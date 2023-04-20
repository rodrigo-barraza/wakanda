'use strict';
const httpRequest = require('request-promise');
const TransactionAdapter = require.main.require('./service/TransactionAdapterService');
const RiskCheck = require.main.require('./service/RiskCheckService');
const TransferService = require.main.require('./service/TransferService');
const FlexepinService = require.main.require('./service/FlexepinService');
const Logger = require.main.require('./config/winston');
const BigNumber = require('bignumber.js');
const OtpAdapter = require.main.require('./service/OtpService');
const ReceiptService = require.main.require('./service/ReceiptMessageService');


//Final step in mobile atm flow - verify quote, otp code and profitability of purchase then process transaction
const TransactionService = async function processTransaction(network, quoteId, paymentDetails, walletAddress, otpId, otpToken, userPhoneNumber) {

    const validateFlexepin = (flexepinPin, currentTransactionId) => {
        return new Promise ( (resolve, reject) => {
            FlexepinService.voucherValidate(flexepinPin, currentTransactionId, (response, error) => {
                if (response.result_description === 'Success' && response.currency === 'USD') {
                    //Must check that flexepin is in valid currency - USD
                    Logger.info('Flexepin Validated: %o', response);
                    resolve(response);
                } else if (error) {
                    TransactionAdapter.updateTransactionPaymentMethodStatus(currentTransactionId, 'VALIDATION_ERROR').then();
                    reject(error);
                } else {
                    TransactionAdapter.updateTransactionPaymentMethodStatus(currentTransactionId, 'VALIDATION_FAIL').then();
                    const rejectObject = {
                        code: 200,
                        message: 'Flexepin Validation Failure: ' + response.result_description
                    }
                    reject(rejectObject);
                }
            })
        });
    }

    const redeemFlexepin = (flexepinPin, currentTransactionId) => {
        return new Promise ( (resolve, reject) => {
            FlexepinService.voucherRedeem(flexepinPin, currentTransactionId, (response, error) => {
                if (response.result_description === 'Success') {
                    TransactionAdapter.updateTransactionPaymentMethodStatus(currentTransactionId, 'SUCCESS').then();
                    TransactionAdapter.updateTransactionPaymentMethodResponse(currentTransactionId, response.trans_no).then();
                    Logger.info('Flexepin Redeemed: %o', response);
                    resolve(response);
                } else if (error) {
                    TransactionAdapter.updateTransactionPaymentMethodStatus(currentTransactionId, 'REDEMPTION_ERROR').then();
                    Logger.info('Redeem flexepin error: %o', error);
                    reject(error);
                } else {
                    TransactionAdapter.updateTransactionPaymentMethodStatus(currentTransactionId, 'REDEMPTION_FAIL').then();
                    Logger.info('Unexpected Redeem Flexepin response: %o', response);
                    reject(new Error('Unexpected Response from Redeem Flexepin'));
                }
            })
        });
    }

    let transactionId = '';
    let transactionTime = 0;
    try {
        
        let quotePrice = 0;
        const transactionStatus = await TransactionAdapter.createTransaction(network, quoteId, paymentDetails, walletAddress, otpId, userPhoneNumber)
        .then( (transaction) => {
            Logger.info('Transaction Created: %o', transaction);
            transactionId = transaction.id;
            transactionTime = transaction.created;
            return validateFlexepin(paymentDetails.pinNumber, transaction.id);
        })
        .then( (validFlexepin) => {
            TransactionAdapter.updateTransactionPaymentAmount(transactionId, validFlexepin.value).then();
            return RiskCheck(network, quoteId, validFlexepin.value, paymentDetails, walletAddress, otpId, otpToken)
        })
        .then( (riskCheckPass) => {
            quotePrice = new BigNumber(riskCheckPass.quotePrice);
            Logger.info('Risk Check Passed: %o', riskCheckPass);
            OtpAdapter.useOtpToken(otpId).then();
            return redeemFlexepin(paymentDetails.pinNumber, transactionId);
        })
        .then( (redeemedFlexepin) => {
            const voucherValue = new BigNumber(redeemedFlexepin.value);
            const transferAmount = voucherValue.dividedBy(quotePrice).toFixed(6);//changed to be compatable with binance - consider chaning back to 8 and truncating for order later
            TransactionAdapter.updateTransactionAmount(transactionId, transferAmount).then();
            return TransferService(network, quoteId, transferAmount, paymentDetails, walletAddress, otpId, redeemedFlexepin.transaction_id);
        });
        Logger.info('Transaction Status: %o', transactionStatus);

        const transactionInfo = transactionStatus;
        transactionInfo.transactionId = transactionId;
        transactionInfo.timestamp = transactionTime;
        transactionInfo.network = network;
        transactionInfo.walletAddress = walletAddress;

        ReceiptService.sendTextReceipt(transactionInfo, otpId, (res, error) => {
            Logger.info('Receipt Sent %o', res);
        });
        return transactionInfo;
    } catch (err) {
        const error = {
            reason: err,
            txId: transactionId,
        };
        Logger.info('Error Processing Transaction: %o', error);
        throw error;
    }
}

module.exports = TransactionService;
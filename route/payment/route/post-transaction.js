'use strict';
const TransactionService = require.main.require('./service/TransactionService');
const ResponseClass = require.main.require('./class/ResponseClass');
const Logger = require.main.require('./config/winston');

const postTransaction = () => {
    return (request, res) => {
        const response = new ResponseClass(res);
        const network = request.body.network;// || 'BTC';
        const quoteId = request.body.quote_id;// || 'id';
        // const amount = request.body.amount;// || 123;
        const paymentDetails = request.body.payment_details;// || {};
        const walletAddress = request.body.wallet_address;// || 'btcaddy';
        const otpId = request.body.otp_id;// || 'OTPID';
        const otpToken = request.body.otp_token;
        const userPhoneNumber = request.body.user_phone_number;
       
        TransactionService(network, quoteId, paymentDetails, walletAddress, otpId, otpToken, userPhoneNumber)
        .then( (transaction) => {
            res.status(200).json({
                status: transaction.status,
                tx_hash: transaction.data.txid,
                amount_sent: transaction.data.amount_sent,
                tx_id: transaction.transactionId,
                timestamp: transaction.timestamp,
            });
        }).catch( (error) => {
            Logger.info('Transaction Failed Error: ');
            Logger.info('%o', error);
            if (error.reason.code === 200) {
                const responseObject =  {
                    message: 'Error Processing Transaction',
                    reason: error.reason.message,
                    receipt_id: error.txId,
                }
                response.sendResponseErrorObject(responseObject);
            } else {
                response.sendResponseErrorMessage('transaction failed');
            }
        });
 	};
};

module.exports = postTransaction;
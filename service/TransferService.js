'use strict';
const BinanceService = require.main.require('./service/BinanceService');
const BlockioService = require.main.require('./service/BlockIoService');
const TransactionAdapter = require.main.require('./service/TransactionAdapterService');
const Logger = require.main.require('./config/winston');

    //hedge order on binance
    //transfer bitcoin from block IO to customer wallet
    //check block IO/binance balances and if nessesary withdraw from binance to refill blockIO and send alert to top up binance account
    //if there is an error on the binance buy we must still process the block IO transaction as the customer as already paid

const TransferService = async function transferAndRebalanceService(network, quoteId, transferAmount, paymentDetails, walletAddress, otpId, transactionId) {

    const blockIoDepositAddress = '36FbYmnYtC2kFG1FJRKmW5fq8AJhVZKG8E';
    
    //TODO: Validate wallet address?
    if (process.env.NODE_ENV !== 'develop' && process.env.NODE_ENV !== 'development') {
        try {
            const nonce = Date.now();
            Logger.info('Transfer Amount: %o', transferAmount);
            const customerTransfer = await BlockioService.withdraw(walletAddress, transferAmount, nonce);
            
            if (process.env.NODE_ENV === 'production') {
                const hedgeOrder = BinanceService.marketOrder('BUY', transferAmount)
                .then( (res) => {
                    Logger.info('Hedge Order Sucess');
                })
                .catch( (error) => {
                    Logger.info('HEDGE ORDER FAILURE: %o', error);
                });
            } else {
                const hedgeOrder = BinanceService.testMarketOrder('BUY', transferAmount)
                .then( (res) => {
                    Logger.info('Hedge Order Sucess');
                })
                .catch( (error) => {
                    Logger.info('HEDGE ORDER FAILURE: %o', error);
                });

            }
            
            
            Logger.info('Customer Transfer Status: %o', customerTransfer);
            TransactionAdapter.updateTransactionNetworkTransactionStatus(transactionId, customerTransfer.status).then();
            TransactionAdapter.updateTransactionNetworkTransactionResponse(transactionId, customerTransfer.data.txid).then();
            return customerTransfer;
        } catch (error) {
            throw error;
        }

    // IF CONDITIONS ARE MET:
    //  BinanceService.withdraw(walletAddress, amount)

    //UPDATE TRANSACTION IN DB
    } else {
        //FOR TESTING
        const testReturnObject = {
            status: "success",
            data: {
                network: "BTC",
                txid: "e7ef1ea77a63d971b11d5940b9a219954f45c477b8649ec785e4c227789b24dd",
                amount_withdrawn: "0.00107280",
                amount_sent: transferAmount,
                network_fee: "0.00007280",
                blockio_fee: "0.00000000"
            }
        }
        TransactionAdapter.updateTransactionNetworkTransactionStatus(transactionId, testReturnObject.status).then();
        TransactionAdapter.updateTransactionNetworkTransactionResponse(transactionId, testReturnObject.data.txid).then();
        return testReturnObject;
    }
}

module.exports = TransferService;

    //Ensuring Uniqueness of Withdrawals Client-side human or machine error can lead to multiple executions of the same 	
    //withdrawal request. If such an error occurs, you will lose money. To ensure the uniqueness of withdrawal requests, 	
    //you can specify a nonce=value parameter with your withdrawal requests, where value is an alpha-numeric string 	
    //between 1 and 64 characters long. Withdrawal requests that provide duplicate nonces less than 1 hour apart will 	
    //be rejected. This is an optional but recommended security measure.
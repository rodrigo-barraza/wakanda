'use strict';
const TransactionAdapterService = require.main.require('./service/TransactionAdapterService');
const Logger = require.main.require('./config/winston');

const getTransaction = () => {
    return (request, response) => {

        const txId = request.query.txId
       
        TransactionAdapterService.getTransactionById(txId)
        .then( (transaction) => {
            Logger.info('Get Transaction: %o', transaction);
            response.status(200).json({
                status: transaction.networkTransactionStatus,
                tx_hash: transaction.networkTransactionResponse,
                amount_sent: transaction.amount,
                payment_amount: transaction.paymentAmount,
                tx_id: transaction.id,
                timestamp: transaction.created,
                wallet_address: transaction.walletAddress,
            });
        }).catch( (error) => {
            Logger.info('Error getting transaction: %o', error);
            response.status(400).json({
                message: 'Failed to get Transaction',
                error: error
            });
        });
 	};
};

module.exports = getTransaction;
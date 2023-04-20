'use strict'
const uuidv4 = require('uuid/v4');

const Transaction = require.main.require('./model/transactionModel.js');

const TransactionService = {
    createTransaction: (network, quoteId, paymentDetails, walletAddress, otpId, userPhoneNumber) => {
    //(quoteId, amount, network, paymentDetails, walletAddress, ip, paymentMethodStatus, paymentMethodResponse, networkTransactionStatus, networkTransactionResponse, walletProvider, userId, userPhoneNumber) 
        let transaction = new Transaction();

        transaction.id = uuidv4();
        transaction.quoteId = quoteId;
        transaction.network = network;
        transaction.paymentDetails = paymentDetails;
        transaction.walletAddress = walletAddress;
        transaction.otpId = otpId;
        transaction.userId = userPhoneNumber;
        
        return transaction.save();
    },
    getTransactionById: (id) => {
        return Transaction.findOne( { id: id } );
    },
    getTransactionByQuoteId: (quoteId) => {
        return Transaction.findOne( { quoteId: quoteId } );
    },
    getTransactionsByDate: (startDate, endDate, limitTo) => {
        return Transaction.find( { created: { $gt: startDate, $lt: endDate } } ).limit(limitTo);
    },
    updateTransactionAmount: (id, amount) => {
        return Transaction.updateOne( { id: id }, {amount: amount } );
    },
    updateTransactionPaymentAmount: (id, paymentAmount) => {
        return Transaction.updateOne( { id: id }, {paymentAmount: paymentAmount } );
    },
    updateTransactionPaymentMethodStatus: (id, paymentMethodStatus) => {
        return Transaction.updateOne( { id: id }, {paymentMethodStatus: paymentMethodStatus } );
    },
    updateTransactionPaymentMethodResponse: (id, paymentMethodResponse) => {
        return Transaction.updateOne( { id: id }, {paymentMethodResponse: paymentMethodResponse } );
    },
    updateTransactionNetworkTransactionStatus: (id, networkTransactionStatus) => {
        return Transaction.updateOne( { id: id }, {networkTransactionStatus: networkTransactionStatus } );
    },
    updateTransactionNetworkTransactionResponse: (id, networkTransactionResponse) => {
        return Transaction.updateOne( { id: id }, {networkTransactionResponse: networkTransactionResponse } );
    }
};

module.exports = TransactionService;
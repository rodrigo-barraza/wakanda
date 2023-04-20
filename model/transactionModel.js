const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    id: String,
    quoteId: String,
    amount: String,
    network: String,
    paymentDetails: {},
    walletAddress: String,
    otpId: String,
    ip: String,
    paymentMethodStatus: String,
    paymentMethodResponse: String,
    networkTransactionStatus: String,
    networkTransactionResponse: String,
    walletProvider: String,
    userId: String,
    paymentAmount: String,
}, { timestamps: { createdAt: 'created'},
    collection : 'WakandaTransactionCollection',
});

module.exports = mongoose.model('TransactionModel', TransactionSchema);
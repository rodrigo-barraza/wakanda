const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
	paymentId: String,
	merchantId: Number,
    paymentType: String,
    amount: Number,
    pricePerUnitUSD: Number,
    walletAddress: String,
    confirmsRequired: Number,
    confirms: Number,
    created: Number,
    closed: Number,
    paymentTimeout: Number,
    paymentPending: Boolean,
    walletTXID: String,
    merchantProductId: Number,
    description: String,
    clientUserId: String,
    clientEmail: String,
    clientIp: String,
    status: String,
    convertToFiat: Boolean,
}, { collection: 'paymentCollection' });

module.exports = mongoose.model('Payment', PaymentSchema);
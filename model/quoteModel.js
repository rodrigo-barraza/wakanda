const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    id: String, 
    network: String,
    baseCurrency: String,
    paymentMethod: String,
    marketPrice: String,
    sourceExchange: String,
    merchantMarkup: Number,
    quotePrice: String,
    requestCount: Number,
    ipList: [String],
    expires: Date,
    merchantId: String,
    storeId: String,
}, { timestamps: { createdAt: 'created'},
    collection : 'WakandaQuoteCollection',
});

module.exports = mongoose.model('QuoteModel', QuoteSchema);
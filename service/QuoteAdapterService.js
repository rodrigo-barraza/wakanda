'use strict'
const uuidv4 = require('uuid/v4');
const Quote = require.main.require('./model/quoteModel.js');

const QuoteService = {
    createQuote: (network, baseCurrency, paymentMethod, marketPrice, sourceExchange, paymentMethodMarkup, merchantMarkup, quotePrice, ip, merchantId, storeId) => {
        let quote = new Quote();
        const expiresIn = (60000 * 5);//quote expires 5 min after generation

        quote.id = uuidv4();
        quote.merchantId = merchantId;
        quote.network = network;
        quote.baseCurrency = baseCurrency;
        quote.paymentMethod = paymentMethod;
        quote.marketPrice = marketPrice;
        quote.sourceExchange = sourceExchange;
        quote.paymentMethodMarkup = paymentMethodMarkup;
        quote.merchantMarkup = merchantMarkup;
        quote.quotePrice = quotePrice;
        quote.requestCount = 0;
        quote.storeId = storeId;
        quote.ipList = ip;
        quote.expires = new Date(Date.now() + expiresIn); 
        
        return quote.save();
    },
    getQuoteById: (id) => {
        return Quote.findOne( { id: id } );
    },
    getQuotesByDate: (startDate, endDate, limitTo) => {
        return Quote.find( { created: { $gt: startDate, $lt: endDate } } ).limit(limitTo);
    },
    updateQuoteRequestCount: (id) => {
        return Quote.updateOne({id: id }, { '$inc': { requestCount: 1 } });
    },
    updateQuoteIpList: (id, ip) => {
        return Quote.updateOne({id: id}, { '$push': { ipList: ip } });
    }
};

module.exports = QuoteService;
'use strict';
const QuoteService = require.main.require('./service/QuoteAdapterService');
const uuidv4 = require('uuid/v4')

const getQuote = () => {
    return (request, response) => {

        if(!request.session.sid) {
			request.session.sid = uuidv4();
            request.session.validationRequests = 0;
            request.session.created = Date.now();
		}

        QuoteService.getQuoteById(request.query.quote_id)
        .then( (quote) => {
            QuoteService.updateQuoteRequestCount(quote.quoteId).then();
            response.status(200).json({
                network: quote.network,
                base_currency: quote.baseCurrency,
                price_per_unit: quote.quotePrice,
                quote_id: quote.id,
                created: quote.created,
                expires: quote.expires
            });
        }).catch( (error) => {
            response.status(400).json({
                message: 'error getting quote'
            });
        });
    };
};

module.exports = getQuote;
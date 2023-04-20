'use strict';
const QuoteGenerationService = require.main.require('./service/QuoteGenerationService');
const Logger = require.main.require('./config/winston');
const uuidv4 = require('uuid/v4');

//generate quote in database, return quote ID
const postQuote = () => {
    return (request, response) => {
		
		const merchantId = process.env.MERCHANT_ID;
		const network = request.body.network;// || 'BTC';
		const baseCurrency = request.body.base_currency;// || 'USD';
		const paymentMethod = request.body.payment_method;// || 1;

		const requestIp = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(',')[0] : null || request.connection['remoteAddress'];
		
		//create a session that will allow a user to request to validate their flexepin 3 times
		if(!request.session.sid) {
			request.session.sid = uuidv4();
			request.session.validationRequests = 0;
			request.session.created = Date.now();
		}

		QuoteGenerationService(network, baseCurrency, paymentMethod, merchantId, requestIp)
		.then( (quote) => {
			Logger.info('New Quote Generated: %o', quote);
			response.status(200).json({
				network: quote.network,
				base_currency: quote.baseCurrency,
				price_per_unit: quote.quotePrice,
				quote_id: quote.id,
				created: quote.created,
				expires: quote.expires
			});
		}).catch((error) => {
			Logger.info('Error generating Quote: %o', error);
			response.status(400).json({
				message: "Fail"
			});
		});
 	};
};

module.exports = postQuote;
'use strict';
const httpRequest = require('request-promise');
const BigNumber = require('bignumber.js');
const MerchantAdapter = require.main.require('./service/MerchantAdapterService');
const QuoteAdapter = require.main.require('./service/QuoteAdapterService');
const Logger = require.main.require('./config/winston');

// Simple pricing based on best ask price available on binance will need to be adjusted to account for QTY
const generateQuote = async function quoteGenerationFunction(network, baseCurrency, paymentMethod, merchantId, ip) {
    const exchange = 'binance';
    const storeId = 'storeId placeholder';

    const getBinanceOrderbookSnapshot =  async (network, baseCurrency) => { //move to binance service
        let symbol = '';

        if (network === 'BTC' && baseCurrency === 'USD') {
            symbol = 'BTCUSDT';
        } else {
            return 'Invalid symbol'
        }

        const options = {
            method: 'GET',
            url: `https://www.binance.com/api/v1/depth?symbol=${symbol}&limit=5`,
            headers: {'Cache-Control': 'no-cache'}
        };

        try {
            const response = await httpRequest(options);

            return response;
        } catch (err) {
            throw err;
        }
    }

    const merchant = MerchantAdapter.getMerchantById(merchantId);
    let orderBook;
    if (exchange === 'binance') {
        orderBook = getBinanceOrderbookSnapshot(network, baseCurrency);
    } else {
        exchange = 'binance';
        orderBook = getBinanceOrderbookSnapshot(network, baseCurrency);
    }
    
    try {
        const quote = await Promise.all( [orderBook, merchant])
        .then( (promiseArray) => {
            // Logger.info(promiseArray[0]);
            const bestAskPrice = new BigNumber(JSON.parse(promiseArray[0]).asks[0][0]);
            const merchantMarkup = new BigNumber(promiseArray[1].merchantMarkup);
            const quotePrice = bestAskPrice.times(merchantMarkup.plus(1));
            const priceObject = {
                bestAskPrice: bestAskPrice.toNumber(4),
                merchantMarkup: merchantMarkup.toNumber(4),
                quotePrice: quotePrice.toNumber(4)
            }
            return priceObject;
        })
        .then( (priceObject) => {
            return QuoteAdapter.createQuote(network, baseCurrency, paymentMethod, priceObject.bestAskPrice, exchange, paymentMethod, priceObject.merchantMarkup, priceObject.quotePrice, ip, merchantId, storeId);
        });
        // .catch( (error) => {
        //     console.log('Error generating quote:', error);
        //     throw error;
        // });
        return quote;
    } catch (error) {
        throw error;
    }
}

module.exports = generateQuote;
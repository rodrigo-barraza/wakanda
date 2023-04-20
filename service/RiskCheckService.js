'use strict';
const BigNumber = require('bignumber.js');
const httpRequest = require('request-promise');
const QuoteAdapter = require.main.require('./service/QuoteAdapterService');
const OTPService = require.main.require('./service/OtpService');
const BlockIoService = require.main.require('./service/BlockIoService');
const Logger = require.main.require('./config/winston');

//Final step in mobile atm flow - verify quote, otp code and profitability of purchase then process transaction
const RiskCheckService = async function riskAndValidationService(network, quoteId, fiatValue, paymentDetails, walletAddress, otpId, otpToken) {

    const getBinanceOrderbookSnapshot =  async (network, baseCurrency) => {//move to binance service

        let symbol = '';

        if (network === 'BTC' && baseCurrency === 'USD') {
            symbol = 'BTCUSDT';
        } else {
            throw new Error('Invalid symbol');
        }
    
        const options = {
            method: 'GET',
            url: `https://www.binance.com/api/v1/depth?symbol=${symbol}&limit=5`,
            headers: {'Cache-Control': 'no-cache'}
        };

        try {
            const response = await httpRequest(options);

            return response;
        } catch (error) {
            throw error;
        }
    }

    const riskCheck = (promiseResponseArray) => {

        const maxAllowedRequests = 5;
        const quote = promiseResponseArray[0];
        const otp = promiseResponseArray[1];
        
        const riskCheckBoolean = (quote.id === otp.refrenceId
            && quote.requestCount <= maxAllowedRequests
            && quote.ipList[0] === otp.ip
            && quote.expires >= Date.now()
            && otp.expires >= Date.now()
            && otp.tokenUsed === false
            && otp.token
            && otp.token === otpToken);

        const riskCheckArray = [quote.id === otp.refrenceId, quote.requestCount <= maxAllowedRequests, quote.ipList[0] === otp.ip, quote.expires >= Date.now(), otp.expires >= Date.now(), otp.token, otp.tokenUsed === false, otp.token === otpToken];
        Logger.info('Risk Check Elements: %o', riskCheckArray);

        return new Promise ( (resolve, reject) => {

            if (riskCheckBoolean === true) {
                resolve(quote);
            } else {
                reject('Risk Check Failed');
            }
        });
    }

    const profitCheck = async (validQuote) => { //profit check should incorporate merchant/payment markups
        //at this time proftCheck only verifies price not quantity
        const profitCheckHelper = (orderBook, price) => {

            const percentFromCurrentPriceAllowed = new BigNumber(0.99); //TESTING  0.99; //1 - percent price change allowable
            const currentBestAsk = new BigNumber(JSON.parse(orderBook).asks[0][0]);
            const quoteMarketPrice = new BigNumber(price);

            
            const profitCheckBoolean = currentBestAsk.times(percentFromCurrentPriceAllowed).isLessThan(quoteMarketPrice); //NEEDS BIG NUMBER
            return profitCheckBoolean;
        }

        try {
            const currentOfferValid = await getBinanceOrderbookSnapshot(validQuote.network, validQuote.baseCurrency)
            .then( (orderBook) => {
                return profitCheckHelper(orderBook, validQuote.marketPrice);
            })
            .catch( (error) => {
                throw error;
            });

            Logger.info('Profit Check: %o', currentOfferValid);
            return new Promise ( (resolve, reject) => {
                if (currentOfferValid === true) {
                    resolve(validQuote);
                } else {
                    reject('Profit Check Failed');
                }
            });
        } catch (error) {
            throw error;
        }
    }

    const balanceCheck = async (validQuote, fiatValue) => { //balance check should also take into account network fee

        try { 
            const blockIoBalance = await BlockIoService.getBalance()
            .then( (response) => {
                return response.data;
            }).catch( (error) => {
                throw error;
            });
            const value = new BigNumber(fiatValue);
            const price = new BigNumber(validQuote.quotePrice);
            const balance = new BigNumber(blockIoBalance.available_balance);

            const balanceCheckBoolean = balance.isGreaterThan(value.div(price)); //+network fee

            Logger.info('Balance Check: %o', balanceCheckBoolean);
            return new Promise ( (resolve, reject) => {
                if (balanceCheckBoolean === true) {
                    resolve(validQuote);
                } else {
                    reject('Balance Check Failed');
                }
            });
        } catch (error) {
            throw error;
        }
    }
    const quotePromise = QuoteAdapter.getQuoteById(quoteId);
    const otpPromise = OTPService.findByIdPromise(otpId);

    return Promise.all( [quotePromise, otpPromise] )
        .then( riskCheck )
        .then( profitCheck )
        .then( (res) => {
            return balanceCheck(res, fiatValue);
        })
        .catch ( (error) => {
            Logger.info('Failure in Risk Check Service %o', error)
            const riskCheckFailedObject = {
                code: 200,
                message: 'Transaction Failed, Please Try again'
            }
            throw(riskCheckFailedObject);
        });
}

module.exports = RiskCheckService;
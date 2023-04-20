'use strict';
const TwilioService = require.main.require('./service/TwilioService.js');
const OtpService = require.main.require('./service/OtpService');
const ResponseClass = require.main.require('./class/ResponseClass');
const RequestClass = require.main.require('./class/RequestClass');
const QuoteAdapter = require.main.require('./service/QuoteAdapterService');

const getOtpPurchase = () => {
    return (req, res) => {
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const requestObject = {
            ip: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null || req.connection['remoteAddress'],
            query : {
                quoteId: request.query('quote_id'),
                countryCode: request.query('country_code'),
                phoneNumber: request.query('phone_number'),
            },
        };

        function verifyRequest() {
            const hasRequiredFields = (requestObject.query.quoteId && requestObject.query.countryCode && requestObject.query.phoneNumber);
            if (hasRequiredFields) {
                validateRequest();
            } else {
    	        response.sendResponseErrorMessage('Missing required fields.');
            }
        };

        function validateRequest() {
            const phoneValid = true; // TODO: regex possible with african phone numbers?
            const contryCodeValid = true; // TODO: same as above

            if (phoneValid && contryCodeValid) {
                validateQuote();
            } else {
    	        response.sendResponseErrorMessage('Invalid parameters.');
            }
        };

        function validateQuote() {
            let isQuoteExpired = false; // TODO: get from Quote from collection
            QuoteAdapter.getQuoteById(requestObject.query.quoteId)
            .then( (quote) =>{
                console.log(quote.ipList[0]);
                console.log(requestObject.ip);
                
                if (requestObject.ip == quote.ipList[0] && !isQuoteExpired) {
                    generateAndStoreOtp();
                } else {
                    response.sendResponseErrorMessage('Invalid quote.');
                }
            })
            .catch( (error) => {
                Logger.error('ERROR GETTING QUOTE FROM DB: %o', error);
            })
        };

        function generateAndStoreOtp() {
            OtpService.initOtp(requestObject.query.phoneNumber, requestObject.query.countryCode, requestObject.query.quoteId, requestObject.ip, (serviceResponse, serviceError) => {
                if (!serviceError && serviceResponse) {
                    sendOtpCodeTextMessage(serviceResponse);
                } else {
                    response.sendResponseErrorMessage('OTP code failed to send text message.');
                }
            });
        };

        function sendOtpCodeTextMessage(otpObject) {
            TwilioService.sendText(requestObject.query.countryCode, requestObject.query.phoneNumber, otpObject.oneTimePassword,(serviceResponse, serviceError) => {
                if (!serviceError && serviceResponse) {
                    otpObject.sid = serviceResponse;
                    updateOtpWithSmsStatus(otpObject);
                } else {
                    response.sendResponseErrorMessage('OTP code failed to send text message.');
                }
            });
        };

        function updateOtpWithSmsStatus(otpObject) {
            OtpService.updateSid(otpObject.id, otpObject.sid, (serviceResponse, serviceError) => {
                if (!serviceError && serviceResponse) {
                    const responseObject = {
                        otpCodeSent: true,
                        otpId: otpObject.id,
                        country_code: requestObject.query.countryCode,
                        phone_number: requestObject.query.phoneNumber,
                    };
                    response.sendResponseSuccessObject(responseObject);
                } else {
                    response.sendResponseErrorMessage('Failed to updated sid.');
                }
            });
        };
       	verifyRequest();
    };
};

module.exports = getOtpPurchase;
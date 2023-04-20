'use strict';
const OtpService = require.main.require('./service/OtpService');
const ResponseClass = require.main.require('./class/ResponseClass');
const RequestClass = require.main.require('./class/RequestClass');

const postOtpPayment = () => {
    return (req, res) => {
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        
        const requestObject = {
            ip: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null || req.connection['remoteAddress'],
            body: {
                otpCode: request.body('one_time_password'),
                otpId: request.body('otp_id'),
                quoteId: request.body('quote_id')
            },
        };

        let otpObject;

        function verifyRequest() {
            const hasRequiredFields = (requestObject.body.otpCode && requestObject.body.otpId && requestObject.body.quoteId);
            // console.log(requestObject.body.otpCode, requestObject.body.otpId, req.body.quoteId )
            if (hasRequiredFields) {
                lookupOtp();
            } else {
    	        response.sendResponseErrorMessage('Missing required fields.');
            }
        };

        req.session.validationRequests++;
        function lookupOtp() {
            OtpService.findById(requestObject.body.otpId, (serviceResponse, serviceError) => {
                if (req.session.validationRequests <= 3){
                    if (!serviceError && serviceResponse && serviceResponse.oneTimePassword == requestObject.body.otpCode) {
                        otpObject = serviceResponse;
                        checkExpiry();
                    } else {
                        response.sendResponseErrorMessage('Incorrect verification code.');
                    }
                } else {
                    response.sendResponseErrorMessage('Max number of attempts reached. Try again in 5 minutes.');
                }
            });
        };

        function checkExpiry() {
            const now = Date.now();

            if (now >= otpObject.expires) {
                response.sendResponseErrorMessage('Expired.');
            } else {
                validateClient();
            }
        };

        function validateClient() {
            const isClientValid = ( otpObject.ip == requestObject.ip );

            if (isClientValid) {
                isOtpUsed();
            } else {
                response.sendResponseErrorMessage('Invalid IP Address.');
            }
        };

        function checkAttempts() {
            const maxNumberOfAttempts = 5;
            otpObject.attempts ++;
            
            if (otpObject.attempts <= maxNumberOfAttempts) {
                OtpService.updateAttempts(requestObject.body.otpId, otpObject.attempts,(serviceResponse, serviceError) => {
                    if (!serviceError && serviceResponse) {
                        validateOtpCode();
                    } else {
                        response.sendResponseErrorMessage('Could not update one time password attempts.');
                    }
                });
            } else {
                response.sendResponseErrorMessage('Max number of attempts reached.');
            }
        };

        function isOtpUsed() {
            if (otpObject.token.length == 0) {
                checkAttempts();
            } else {
                response.sendResponseErrorMessage('Sms password already completed.');
            }
        };

        function validateOtpCode() {
            const otpCodeIsValid = (otpObject.oneTimePassword == requestObject.body.otpCode);

            if (otpCodeIsValid) {
                generateAndStoreToken();
            } else {
                response.sendResponseErrorMessage('Incorrect sms code.');
            }
        };

        function generateAndStoreToken() {
            OtpService.createToken(otpObject.id, (serviceResponse, serviceError) => {
                if (!serviceError && serviceResponse) {
                    const responseObject = {
                        token: serviceResponse,
                    };
                    response.sendResponseSuccessObject(responseObject);
                } else {
                    response.sendResponseErrorMessage('Server error.');
                }
            });
        };
       
       	verifyRequest();
    };
};

module.exports = postOtpPayment;
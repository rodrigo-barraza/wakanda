'use strict';
const FlexepinService = require.main.require('./service/FlexepinService');
const OtpService = require.main.require('./service/OtpService');
const ResponseClass = require.main.require('./class/ResponseClass');
const RequestClass = require.main.require('./class/RequestClass');
const Logger = require.main.require('./config/winston');

const PostValidateFlexepin = () => {
    return (req, res) => {

        const currentTime = Date.now();
        const forcedDelayCheck = (currentTime - req.session.created) > 1000; //check that session is older than 5 seconds - basic attempt to stop automated use of endpoint

        req.session.validationRequests++;
        if (req.session.validationRequests <= 5 && forcedDelayCheck) {
            

            const response = new ResponseClass(res);
            const request = new RequestClass(req);

            const requestObject = {
                ip: req.ip,
                query : {
                    pin: request.query('pin'),
                    transactionId: request.query('transactionId'),
                },
            };

            function verifyRequest() {
                const hasRequiredFields = (requestObject.query.pin && requestObject.query.transactionId);
                if (hasRequiredFields) {
                    validateRequest();
                } else {
                    response.sendResponseErrorMessage('Missing required fields.');
                }
            };

            function validateRequest() {
                const isFlexepinPinValid = true;
                const isTransactionIdValid = true;
                const isRequestValid = isFlexepinPinValid && isTransactionIdValid;

                if (isRequestValid) {
                    voucherValidate();
                } else {
                    response.sendResponseErrorMessage('Invalid request parameters.');
                }
            };

            function voucherValidate() {
                FlexepinService.voucherValidate(requestObject.query.pin, requestObject.query.transactionId, (voucherValidateResponse, voucherValidateError) => {
                    if (voucherValidateResponse) {
                        if (voucherValidateResponse.currency === 'USD') {
                            response.sendResponseSuccessObject(voucherValidateResponse);
                        } else if (voucherValidateResponse.result_description === 'Voucher is used') {
                            response.sendResponseErrorMessage(voucherValidateResponse.result_description);
                        } else {
                            response.sendResponseErrorMessage('Issue validating voucher.');
                        }
                    } else {
                        response.sendResponseErrorMessage('Flexepin voucher failed validation.');
                    }
                    console.log('flexepin response: ', JSON.stringify(voucherValidateResponse));
                    console.log('flexepin error: ', JSON.stringify(voucherValidateError));
                });
            };

            verifyRequest();
        } else {
            res.status(400).json({
                message: 'Too many attempts. Try again in 5 minutes'
            });
        }
    };
};

module.exports = PostValidateFlexepin;
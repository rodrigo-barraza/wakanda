'use strict';
const FlexepinService = require.main.require('./service/FlexepinService');
const OtpService = require.main.require('./service/OtpService');
const ResponseClass = require.main.require('./class/ResponseClass');
const RequestClass = require.main.require('./class/RequestClass');

const PutRedeemFlexepin = () => {
    return (req, res) => {
        const response = new ResponseClass(res);
        const request = new RequestClass(req);
        const requestObject = {
            ip: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null || req.connection['remoteAddress'],
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
            FlexepinService.voucherRedeem(requestObject.query.pin, requestObject.query.transactionId, (voucherValidateResponse, voucherValidateError) => {
                if (voucherValidateResponse) {
                    response.sendResponseSuccessObject(voucherValidateResponse);
                } else {
    	            response.sendResponseErrorMessage('Voucher failed validation.');
                }
            });
        };

       	verifyRequest();
    };
};

module.exports = PutRedeemFlexepin;
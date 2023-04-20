'use strict';
// routes
const otpService = (router) => {
    const postOtpPayment = require('./route/post-otp-purchase')();
    const getOtpPurchase = require('./route/get-otp-purchase')();
    const resourceName = '/token';

    router.post(`${resourceName}/one-time-password`, postOtpPayment);
    router.get(`${resourceName}/one-time-password`, getOtpPurchase);
};

module.exports = otpService;
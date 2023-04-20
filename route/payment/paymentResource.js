'use strict';
// routes
const PaymentResource = (router) => {
    const postQuote = require('./route/post-quote')();
    const getQuote = require('./route/get-quote')();
    const postTransaction = require('./route/post-transaction')();
    const getValidateFlexepin = require('./route/get-validate-flexepin')();
    const putRedeemFlexepin = require('./route/put-redeem-flexepin')();
    const getTransaction = require('./route/get-transaction')();
    const resourceName = '/payment';
   
    router.get(`${resourceName}/validate-flexepin`, getValidateFlexepin);
    router.put(`${resourceName}/redeem-flexepin`, putRedeemFlexepin);
    router.post(`${resourceName}/quote`, postQuote);
    router.get(`${resourceName}/quote`, getQuote);
    router.post(`${resourceName}/transaction`, postTransaction);
    router.get(`${resourceName}/transaction`, getTransaction);
};

module.exports = PaymentResource;
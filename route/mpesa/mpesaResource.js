'use strict';
// routes
const MpesaResource = (router) => {
    const postconfirmation = require('./route/post-confirmation')();
    const postvalidation = require('./route/post-validation')();
    const postc2bsimulate = require('./route/c2bsimulate')();
    const postc2bregister = require('./route/c2bregister')();
    const resourceName = '/mpesa';

    router.post(`${resourceName}/confirmation`, postconfirmation);
    router.post(`${resourceName}/validation`, postvalidation);
    router.post(`${resourceName}/c2bsimulate`, postc2bsimulate);
    router.post(`${resourceName}/c2bregister`, postc2bregister);
};

module.exports = MpesaResource;

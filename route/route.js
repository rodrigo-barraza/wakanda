'use strict';
const express = require('express');
const router = new express.Router();

const getPing = require('./get-ping')();
const PaymentResource = require('./payment/paymentResource');
const TokenResource = require('./token/tokenResource');
const MpesaResource = require('./mpesa/mpesaResource');

const route = () => {
    router.get('/ping', getPing);
    PaymentResource(router);
    TokenResource(router);
    MpesaResource(router);
    return router;
};

module.exports = route;

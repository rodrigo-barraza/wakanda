'use strict';
require('dotenv').config({ path: 'variables.env' });
const HttpService = require.main.require('./service/HttpService');
const crypto = require('crypto');
const Logger = require.main.require('./config/winston');

const flexepinApi = process.env.FLEXEPIN_API;
const flexepinTerminalId = process.env.FLEXEPIN_TERMINAL_ID;
const flexepinKey = process.env.FLEXEPIN_KEY;
const flexepinSecret = process.env.FLEXEPIN_SECRET;
const flexepinAlgorithm = 'sha256';

function buildAuthenticationHeader(method, url, nonce) {
    const tester = `${method}\n${url}\n${nonce}\n`;
    const hmac = crypto.createHmac(flexepinAlgorithm, flexepinSecret).update(tester).digest('hex');
    const authentication = `HMAC ${flexepinKey}:${hmac}:${nonce}`;
    // console.log(authentication);
    return authentication;
};

const FlexepinService = {
    getStatus(callback) {
        HttpService.get(`${flexepinApi}/status`, {}, (response, error) => {
            callback(response, error);
        });
    },
    voucherValidate(flexepinPin, currentTransactionId, callback) {
        const nonce = +new Date;
        const uri = `/voucher/validate/${flexepinPin}/${flexepinTerminalId}/${currentTransactionId}`;
        const authenticationHeader = {
            Authentication: buildAuthenticationHeader('GET', uri, nonce),
        };
        // console.log(uri);
        HttpService.get(`${flexepinApi}${uri}`, authenticationHeader, (response, error) => {
            callback(response, error);
        });
    },
    voucherRedeem(flexepinPin, currentTransactionId, callback) {
        const nonce = +new Date;
        const uri = `/voucher/redeem/${flexepinPin}/${flexepinTerminalId}/${currentTransactionId}`;
        const authenticationHeader = {
            Authentication: buildAuthenticationHeader('PUT', uri, nonce),
        };
        // console.log(uri);
        // console.log(authenticationHeader);
        HttpService.put(`${flexepinApi}${uri}`, authenticationHeader, (response, error) => {
            callback(response, error);
        });
    },

};

module.exports = FlexepinService;
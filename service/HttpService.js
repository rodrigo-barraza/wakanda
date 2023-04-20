'use strict';
const httpRequest = require('request');
const Logger = require.main.require('./config/winston');

const HttpService = {
    get(url, headers, callback) {
        return httpRequest.get({
            url: url,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
    post(url, body, headers, callback) {
        return httpRequest.post({
            url: url,
            body: body,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
    put(url, headers, callback) {
        return httpRequest.put({
            url: url,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
    delete(url, body, headers, callback) {
        return httpRequest.post({
            url: url,
            body: body,
            headers: headers,
            json: true,
        }, (httpError, httpResponse, body) => {
            callback(body, httpError);
        });
    },
};

module.exports = HttpService;
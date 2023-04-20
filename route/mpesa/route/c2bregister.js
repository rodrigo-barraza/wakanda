'use strict';
require('dotenv').config({ path: 'variables.env' });
const request = require('request');
const oauth_token = "ACCESS-TOKEN";
const url = process.env.MPESA_URL2;

const postC2bregister = () => {
    return (req, res) => {
        const ShortCode = req.body.ShortCode;
        const ConfirmationURL = req.body.ConfirmationURL;
        const ValidationURL = req.body.ValidationURL;

        let auth = "";
        let tokenString = req.headers['authorization'] || req.headers['x-access-token']; // Express headers are auto converted to lowercase
        let accessToken;
        function extractBearerTokenFromHeader() {
            if (!tokenString) {
                res.json('Unauthorized token.');
            } else {
                let splitString = tokenString.split(' ');

                accessToken = splitString[1];

                const mpesaRequestObject = {
                    method: 'POST',
                    url: url,
                    headers: {
                        "Authorization" : tokenString
                    },
                    json : {
                      "ShortCode": ShortCode,
                      "ResponseType": process.env.MPESA_ResponseType,
                      "ConfirmationURL": process.env.MPESA_ConfirmationURL,
                      "ValidationURL": process.env.MPESA_ValidationURL
                    }
                }
                request(mpesaRequestObject,
                function (error, response, body) {
                    // TODO: Use the body object to extract the response
                    console.log("----------------------------");
                    console.log('c2b payment response');
                    console.log(body);
                    if (!error){
                        res.status(200).json(body);
                    } else {
                        res.status(400).json({
                            message: 'transaction failed',
                        });
                    }
                });
            }
        };
        extractBearerTokenFromHeader();
    };
};


  module.exports = postC2bregister;

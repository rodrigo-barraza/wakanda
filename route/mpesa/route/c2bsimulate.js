'use strict';
require('dotenv').config({ path: 'variables.env' });
const request = require('request');
const oauth_token = "ACCESS-TOKEN";
const url = process.env.MPESA_URL;

const postC2bsimulate = () => {
    return (req, res) => {
        const shortcode = req.body.ShortCode;
        const commandid = req.body.CommandID;
        const amount = req.body.Amount;
        const msisdn = req.body.Msisdn;
        const billrefnumber = req.body.BillRefNumber;

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
                    json: {
                        //Fill in the request parameters with valid values
                        "ShortCode":shortcode,
                        "CommandID": commandid,
                        "Amount": amount,
                        "Msisdn": msisdn,
                        "BillRefNumber": billrefnumber
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

module.exports = postC2bsimulate;

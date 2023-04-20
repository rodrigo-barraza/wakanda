'use strict'
const prettyjson = require('prettyjson');
const options = {
  noColor: true
};

const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PostValidation = () => {
    return (req, res) => {
	//			app.post('/urlvalidation', (req, res) => {
					console.log('-----------C2B VALIDATION REQUEST-----------');
					console.log(prettyjson.render(req.body, options));
					console.log('-----------------------');

					let message = {
						"ResultCode": 0,
						"ResultDesc": "Success",
						"ThirdPartyTransID": "1234567890"
					};

					res.json(message);
	//			});
		}
}

module.exports = PostValidation;

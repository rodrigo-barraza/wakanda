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
const PostConfirmation = () => {
    return (req, res) => {
		//		app.post('/urlconfirmation', (req, res) => {
					console.log('-----------C2B CONFIRMATION REQUEST------------');
					console.log(prettyjson.render(req.body, options));
					console.log('-----------------------');

					let message = {
						"ResultCode": 0,
						"ResultDesc": "Success"
					};
					res.json(message);
			//	});
		}
}

module.exports = PostConfirmation;

'use strict';
require('dotenv').config({ path: 'variables.env' });
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);

const TwilioService = {
    sendText: (countryCode, phoneNumber, message, callback) => {
      	client.messages.create({
		    to: `011${countryCode}${phoneNumber}`,
		    from: process.env.TWILIO_NUMBER,
		    body: message
		}, function(error, message) {
		    if (!error) {
		    	//success
		    	callback(message.sid, null);
		    } else {
		        console.log('There was an error with twillio.', error);
		        callback(null, error);
		    }
		});
    }
};

module.exports = TwilioService;
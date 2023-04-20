'use strict';
const TwilioService = require("./TwilioService");
const OtpService = require('./OtpService');
const Logger = require('./../config/winston');

const ReciptMessageService = {
    // sendTextRecipt: (transactionDetails, countryCode, phoneNumber, callback) => {
    // 	let messageString;
        
    //     messageString = `${transactionDetails.network} amount: ${transactionDetails.amount} | `;
    //     messageString += `Price: $${transactionDetails.quotePrice} | `;
    //     messageString += `Wallet address: ${transactionDetails.walletAddress} | `;
    //     messageString += `TRX ID: ${transactionDetails.txid} | `;
    //     messageString += `Recipt: ${transactionDetails.id}`;

    //     return TwilioService.sendText(countryCode, phoneNumber, messageString,(serviceResponse, serviceError) => {
    //         callback(serviceResponse, serviceError);
    //     });
    // }
    sendTextReceipt: (transactionDetails, otpId, callback) => {
    	let messageString;
        
        messageString = `${transactionDetails.network} amount: ${transactionDetails.data.amount_sent} \n`;
        // messageString += `Price: $${transactionDetails.quotePrice} | `;
        messageString += `Wallet address: ${transactionDetails.walletAddress} \n`;
        messageString += `Network Transaction Hash: ${transactionDetails.data.txid} \n`;
        messageString += `Receipt Id: ${transactionDetails.transactionId}`;

        return OtpService.findByIdPromise(otpId)
        .then((otpInfo) => {
            return TwilioService.sendText(otpInfo.countryCode, otpInfo.phoneNumber, messageString,(serviceResponse, serviceError) => {
                callback(serviceResponse, serviceError);
            });
        })
        .catch((error) => {
            Logger.info('ERROR SENDING TEXT RECEIPT', error);
        });
    }
};

module.exports = ReciptMessageService;
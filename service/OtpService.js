'use strict';
let OtpPurchase = require.main.require('./model/otpCode.js');

const otpService = {
    initOtp: (phoneNumber, countryCode, refrenceId, ip, callback) => {
        let otpPurchase = new OtpPurchase();
        const timeoutInMinutes = 30;
        const now = new Date();

        otpPurchase.id = uuidGenerator();
        otpPurchase.oneTimePassword = otpCodeGenerator();
        otpPurchase.phoneNumber = phoneNumber;
        otpPurchase.countryCode = countryCode; 
        otpPurchase.attempts = 0;
        otpPurchase.otpCompleted = false;
        otpPurchase.refrenceId = refrenceId;
        otpPurchase.token = '';
        otpPurchase.tokenUsed = false;
        otpPurchase.ip = ip;
        otpPurchase.created = Date.now();
        otpPurchase.expires = now.setMinutes(now.getMinutes() + timeoutInMinutes);  

        return otpPurchase.save().then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    updateSid: (otpId, sid, callback) => {
        return OtpPurchase.updateOne({id: otpId}, { sid: sid }).then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    updateAttempts: (otpId, attempts, callback) => {
        return OtpPurchase.updateOne({id: otpId}, { attempts: attempts }).then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    createToken: (otpId, callback) => {
        const token = uuidGenerator();

        return OtpPurchase.updateOne({id: otpId}, { token: token }).then((mongoResponse, mongoError) => {
            if (!mongoError && mongoResponse && mongoResponse.nModified == 1) {
                callback(token, mongoError);
            } else {
                callback(null, 'token not updated');
            }
        });
    },
    findById: (otpId, callback) => {
        return OtpPurchase.findOne({ id: otpId}).then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    findByIdPromise: (otpId) => {
        return OtpPurchase.findOne({ id: otpId });
    },
    useOtpToken: (otpId) => {
        return OtpPurchase.updateOne({ id: otpId }, {tokenUsed: true});
    }
};

module.exports = otpService;

//otp code generator
function otpCodeGenerator() {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1); // 1234
};

//uuid generator
function uuidGenerator() {
    let S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
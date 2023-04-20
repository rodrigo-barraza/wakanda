const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
    id: String,
    phoneNumber: String,
    countryCode: String,
    oneTimePassword: String,
    created: String,
    expires: String,
    attempts: Number,
    completed: String,
    token: String,
    tokenUsed: Boolean,
    refrenceId: String,
    sid: String,
    ip: String,
}, { collection: 'otpCollection' });

module.exports = mongoose.model('otp', OtpSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    fullName: String,
    walletBtc: String,
    address: String,
    city: String,
    country: String,
    province: String,
    postalCode: String,
    cardName: String,
    cardNumber: String,
    cardExpiry: String,
    cardCvv: String,
    phone: String,
    phoneCountryCode: String,
    phoneAreaCode: String,
    phoneLineNumber: String,
    useAuthy2Fa: Boolean,
    use2FaForWithdraw: Boolean,
    cell2FaCountryCode: Number,
    monthOfBirth: String,
    dayOfBirth: String,
    yearOfBirth: String,
    created: { type: Date, default: Date.now },
    createdFrom: String,
    alphaPointAccountId: Number,
    alphaPointUserId: Number,
    phoneVerified: Boolean,
    profileId: String
}, { collection: 'userCollection' });

module.exports = mongoose.model('User', UserSchema);
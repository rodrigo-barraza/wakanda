const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MerchantSchema = new Schema({

    id: String, 
    companyName: String,
    phone: String,
    companyContact: String,
    merchantEmail: String,
    merchantMarkup: Number,
    created: {
		type: Date,
		default: Date.now(),
	},
	lastUpdated: {
		type: Date,
		default: Date.now(),
	},
}, { collection : 'WakandaMerchantCollection' });

module.exports = mongoose.model('MerchantModel', MerchantSchema);
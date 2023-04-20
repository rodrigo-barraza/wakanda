'use strict'
const ShortId = require('shortid');
const Merchant = require.main.require('./model/merchantModel.js');

const MerchantService = {
    createMerchant: (companyName, phone, companyContact, merchantEmail, merchantMarkup) => {
        let merchant = new Merchant();

        merchant.id = ShortId.generate(); 
        merchant.companyName = companyName;
        merchant.phone = phone;
        merchant.companyContact = companyContact;
        merchant.merchantEmail = merchantEmail;
        merchant.merchantMarkup = merchantMarkup;

        return merchant.save();
    },
    getMerchantById: (id) => {
        return Merchant.findOne( { id: id } );
    },
    findMerchantByCompanyName: (companyName) => {
        return Merchant.find( { companyName: companyName } );
    },
    findMerchantsByCreation: (startDate, endDate, limitTo) => {
        console.log(startDate, endDate)
        return Merchant.find( { created: { $gt: startDate, $lt: endDate } } ).limit(limitTo);
    },
    updateMerchant: (id, phone, companyContact, website, merchantEmail) => {
        return Merchant.update(
                { id: id }, 
                { phone: phone, companyContact: companyContact, website: website, merchantEmail: merchantEmail, lastUpdated: new Date().now }
            );
    }
    //archive merchant
};

module.exports = MerchantService;
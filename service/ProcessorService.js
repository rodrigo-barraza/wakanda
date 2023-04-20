'use strict';
const Processor = require.main.require('./model/processor.js');

const processService = {
    addNewProcessor: (paymentMethod, paymentMethodMarkup, internalMarkup, callback) => {
        let processor = new Processor();

        processor.paymentMethod = paymentMethod;
        processor.paymentMethodMarkup = paymentMethodMarkup;
        processor.internalMarkup = internalMarkup;
        processor.created = Date.now(); 

        return processor.save().then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    updatePaymentMethodMarkup: (paymentMethod, markupPercentage, callback) => {
        return Processor.updateOne({paymentMethod: paymentMethod}, { paymentMethodMarkup: markupPercentage }).then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    updateInternalMarkupByMethod: (paymentMethod, markupPercentage, callback) => {
        return Processor.updateOne({paymentMethod: paymentMethod}, { internalMarkup: markupPercentage }).then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    findByPaymentMethod: (paymentMethod, callback) => {
        return Processor.findOne({paymentMethod: paymentMethod}).then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
    getAll: (callback) => {
        return Processor.find().then((mongoResponse, mongoError) => {
            callback(mongoResponse, mongoError);
        });
    },
};

module.exports = processService;
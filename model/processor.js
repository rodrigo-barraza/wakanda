const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProcessorSchema = new Schema({
    paymentMethod: String,
    paymentMethodMarkup: Number,
    internalMarkup: Number,
    created: String,
    updated: String,
}, { collection: 'processorCollection' });

module.exports = mongoose.model('processor', ProcessorSchema);


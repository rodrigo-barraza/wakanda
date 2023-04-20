'use strict'
require('dotenv').config({ path: 'variables.env' });
const mongoose = require('mongoose');
const mongoUri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?retryWrites=true`;

const DatabaseService = {
    connect: (callback) => {
        mongoose.Promise = global.Promise;
        mongoose.connect(mongoUri, { useNewUrlParser: true });
        const db = mongoose.connection;
        db.on('error', () => {
            callback(false, true);
        });
        db.once('open', () => {
            callback(true, false);
        });
    },
};

module.exports = DatabaseService;
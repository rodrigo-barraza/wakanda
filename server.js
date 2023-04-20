'use strict';
require('dotenv').config({ path: 'variables.env' });
const Logger = require('./config/winston');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const route = require('./route/route');
const http = require('http');
const fs = require('fs');
const DatabaseService = require('./service/DatabaseService');
const MerchantAdapter = require('./service/MerchantAdapterService');
const port = process.env.SERVER_PORT;

const helmet = require('helmet');
const session = require('express-session');
const mongoUri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`;
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'sessionTest'
})

store.on('error', (error) => {
    Logger.error('Session Store Error: %o', error);
})


function morganObject(tokens, request, response) {
    return JSON.stringify({
        date: tokens['date'](request, response, 'iso'),
        method: tokens['method'](request, response),
        url: tokens['url'](request, response),
        status: tokens['status'](request, response),
        contentLength: tokens['res'](request, response, 'content-length'),
        responseTime: tokens['response-time'](request, response),
        ip: request.headers['x-forwarded-for'] || request.connection['remoteAddress'],
        user: tokens['remote-user'](request, response),
        userAgent: tokens['user-agent'](request, response),
        httpVersion: tokens['http-version'](request, response),
        referrer: tokens['referrer'](request, response),
    });
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use(session({
    name: 'bba-session',
    secret: "Africa eh?",
    cookie: {
        secure: false,
        maxAge: 60000 * 5, //session valid for 5 min
        httpOnly: false, //should set to true
    },
    store: store,
    resave: false,
    saveUninitialized: true
}));

app.use(helmet());
app.use(cors({ origin: ['*.buy-bitcoin.africa'], credentials: true }));
app.use(morgan(morganObject));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));


app.use('/api/', route());

DatabaseService.connect((response, error) => {
    if (response) {
        console.log(`                                                                                                            
                        .@@@@@@@@@@@@@@@@@@.                                                                                                           
                    @@@@@@@@@@@@@@&      @@@@#                                                                                                        
                @@@@@@@@@@@%*.   .@@@@                                                                                                              
                @@@@@@@@(         #@@@@@@@@@@@@@@#                                                                               
            #@@@@@@#        @@&&@@@@@@@@@@@@@@@@@#       @@@@/   &@   .@@@@       
            @@@@@@&       @@@@@@@@@@@@@@@@@@@@@@@@@@      %@@@@  *@@%  %@@@@   @@@@@@@@@#  @@@@ ,@@@,  @@@@@@@@@#  @@@  /@@@, *@@@@@@@     @@@@@@@@@.
            @@@@@@.      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@     ,@@@@  @@@@. @@@@&   @@@@  @@@#  @@@@ @@@@   @@@@  @@@#  @@@@ /@@@, *@@@ @@@@/   @@@@  @@@,
            *@@@@@.     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/     @@@@.@@@@@@ @@@@,   @@@@  @@@#  @@@@@@@@    @@@@  @@@#  @@@@&/@@@, *@@@  /@@@   @@@@  @@@,
            @@@@@%     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     @@@@@@@@@@@@@@@@    @@@@  @@@#  @@@@@@@     @@@@  @@@#  @@@@@&@@@, *@@@   @@@&  @@@@  @@@,
            @@@@@     *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     %@@@@@@@@@@@@@@@   .@@@@@@@@@# .@@@@@@%    .@@@@@@@@@#  @@@@@@@@@, *@@@   (@@@ .@@@@@@@@@,
            @@@@@    @@@@@@@@@@@@@@@@@@@,@@@@@@@@@@@@@@@,    ,@@@@@@@@@@@@@@(   ,@@@@,,@@@# ,@@@@@@@    ,@@@@,,@@@#  @@@(@@@@@, *@@@   *@@@ ,@@@@,,@@@,
            @@@@@   @@@@@@@@@@@@@@@@@@@@@#.@@@@@@@@@@@@@,     @@@@@@%*@@@@@@     @@@@  @@@#  @@@@@@@/    @@@@  @@@#  @@@/#@@@@, *@@@   #@@@  @@@@  @@@,
            @@@@@, /@@@@@@@@@@@@@@@@@@@@@# @@@@@@@@@@@@@      &@@@@@  @@@@@@     @@@@  @@@#  @@@@%@@@    @@@@  @@@#  @@@/ @@@@, *@@@   @@@&  @@@@  @@@,
            @@@@@@   @@@@@@@@@@@@@@@@@@@/ /@@@@@@@@@@@@@      *@@@@,   @@@@&     @@@@  @@@#  @@@@ @@@%   @@@@  @@@#  @@@/  @@@, *@@@  @@@@   @@@@  @@@,
            @@@@@@   /@@     @@@@@@@@.  &@@@@@@@@@@@@@        @@@@    &@@@,     @@@@  @@@#  @@@@ %@@@   @@@@  @@@#  @@@/  .@@, *@@@@@@@@    @@@@  @@@,
            ,@@@@@@         @@@@@@@     @@@@@@@@@@@@@,        @@@      @@@      @@@@  @@@#  @@@@  @@@/  @@@@  @@@#  @@@/   %@, *@@@@@@&     @@@@  @@@,
            .@@@@@@*     @@@@@@@.     #@@@@@@@@@@@@.         &@(      (@&                                                                         
                @@@@@@@(    #@@@@%      @@@@@@@@@@@@                                                                                 
                ,@@@@@@@@@.           ,@@@@@@@@@@,                                                                                                  
                    @@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                                                       
                    .@@@@@@@@@@@@@@@@@@@@@@                                                                                                          
                        .%@@@@@@@@@@@@&.                                                                                                                                         
        `)
        console.log('WAKANDA FOREVER!');
        http.createServer(app).listen(port, () => {
            console.log(`http://dev.buy-bitcoin.africa:${port}`);
        });

        //checks if merchant env variable is assigned, if not creates a new merchant and sets env variable
        if (process.env.MERCHANT_ID) {
            Logger.info('Merchant in use: %o', process.env.MERCHANT_ID);
        } else {
            MerchantAdapter.createMerchant('Einstein Default', '604-800-3303', "ALI ALI ALI", 'support@einstein.exchange', 0.02)
            .then( (merchant) => {
                Logger.info('New Merchant Created: %o', merchant);
                process.env.MERCHANT_ID = merchant.id;
            })
            .catch( (error) => {
                Logger.info('Merchant Creation Failed: o%');
                throw error;
            });
        }

    } else {
        console.log('Failed to connect to Database');
    }
});

module.exports = app;
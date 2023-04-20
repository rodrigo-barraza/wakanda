'use strict';
const request = require('request-promise');
const Binance = require('binance-api-node').default //using library should re-wire own functions
require('dotenv').config({ path: 'variables.env' });
const Logger = require.main.require('./config/winston')

const tradingClient = Binance({
    apiKey: process.env.BINANCE_TRADING_KEY,
    apiSecret: process.env.BINANCE_TRADING_SECRET,
});

const withdrawingClient = Binance({
    apiKey: process.env.BINANCE_WITHDRAWING_KEY,
    apiSecret: process.env.BINANCE_WITHDRAWING_SECRET,
});

const BinanceService = {
    ping: async () => {
        return await tradingClient.ping();
    },
    marketOrder: async (side, quantity) => {
        Logger.info('order: %o', quantity);
        // const qty = Number(quantity);
        return Logger.info('Binance Order Response: %o', await tradingClient.order({
            symbol: 'BTCUSDT',
            side: side,
            type: 'MARKET',
            quantity: quantity
            // price: undefined
        }));
    },
    testMarketOrder: async (side, quantity) => {
        Logger.info('order: %o', quantity);
        // const qty = Number(quantity);
        return Logger.info('Binance Order Response: %o', await tradingClient.orderTest({
            symbol: 'BTCUSDT',
            side: side,
            type: 'MARKET',
            quantity: quantity
            // price: undefined
        }));
    },
    withdraw: async (walletAddress, quantity) => {
        Logger.info('withdraw:', quantity);
        const qty = Number(quantity);
        return Logger.info('%o', await withdrawingClient.withdraw({
            asset: 'BTC', 
            address: walletAddress, 
            amount: qty
        }));
    }
    // time
    // exchangeInfo
    // book
    // candles
    // aggTrades
    // aggTradesdailyStats
    // prices
    // allBookTickers

    // orderTest
    // getOrder
    // cancelOrder
    // openOrders
    // allOrders
    // accountInfo
    // myTrades
    // tradesHistory
    // depositHistory
    // withdrawHistory
    // withdraw
    // depositAddress
    // tradeFee

//Websocket
    // depth 
    // partialDepth
    // ticker
    // allTickers 
    // candles
    // aggTrades 
    // trades
    // user
};

module.exports = BinanceService;
'use strict';
require('dotenv').config({ path: 'variables.env' });
const BlockIo = require('block_io');
const blockIoKey = process.env.BLOCKIO_KEY;
const block_io = new BlockIo(blockIoKey, process.env.BLOCKIO_SECRET, process.env.BLOCKIO_VERSION);

//cur
const BlockIoService = {
    getBalance:() => {
        return new Promise ( (resolve, reject) => {
            block_io.get_balance({}, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    },
    withdraw:(walletAddress, amount, nonce) => {
        return new Promise ( (resolve, reject) => {
            block_io.withdraw({'amounts': amount, 'to_addresses': walletAddress, 'nonce': nonce}, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    },
    getNetworkFeeEstimate:(walletAddress, amount) => {
        return new Promise ( (resolve, reject) => {
            block_io.get_network_fee_estimate({'amounts': amount, 'to_addresses': walletAddress}, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

module.exports = BlockIoService;
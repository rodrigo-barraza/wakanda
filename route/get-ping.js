'use strict';
const ResponseClass = require.main.require('./class/ResponseClass');

const getPing = () => {
    return (request, response) => {
        const responseClass = new ResponseClass(response);
    	responseClass.sendResponseSuccessMessage('Service is online.');
 	};
};

module.exports = getPing;
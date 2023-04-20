'use strict';
class ResponseClass {
    constructor(response) {
        this.response = response;
    }
    sendResponseSuccessMessage(message, code) {
        const statusCode = code || 200;
        const successObject = {
            success: true,
            message: message
        }
        return this.response.status(statusCode).json(successObject);
    };
    sendResponseSuccessObject(object, code) {
        const statusCode = code || 200;
        const responseObject = {
            success: true,
            data: object
        }
        return this.response.status(statusCode).json(responseObject);
    };
    sendResponseErrorObject(object, code) {
        const statusCode = code || 400;
        const responseObject = {
            error: true,
            data: object
        }
        return this.response.status(statusCode).json(responseObject);
    };
    sendResponseErrorMessage(message, code) {
        const statusCode = code || 400;
        const successObject = {
            error: true,
            message: message
        }
        return this.response.status(statusCode).json(successObject);
    };
    sendResponseErrors(errors, code) {
        const statusCode = code || 400;
        const successObject = {
            status: status,
            errors: errors
        }
        return this.response.status(statusCode).json(successObject);
    };
};

module.exports = ResponseClass;
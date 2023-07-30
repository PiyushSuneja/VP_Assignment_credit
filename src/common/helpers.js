const { UserAccount } = require('../lib/models');
const { ERROR_CODES } = require('./constants');
const { v4: uuidv4 } = require('uuid');
const error = new Error();
//function to print request endpoint on console
module.exports.requestLogger = (req, res, next) => {
    console.log(`${req.hostname}${req.port ? ':' + req.port : ''}${req.originalUrl}`);
    next(); // Move on to the next middleware or route handler
};

//function to validate the body,params sent by user
module.exports.validateSchema = async (details, validationSchema) => {
    try {
        let result = validationSchema.validate(details, {
            abortEarly: false,
            stripUnknown: false,
        });
        if (result.error && result.error.details) {
            error.message = result.error.details[0].message;
            throw error;
        } else {
            return result.value;
        }
    } catch (error) {
        throw error;
    }
};

//generic function to throw error
module.exports.genericError = async (httpResponse, error) => {
    let response = {
        status: 'error',
        message: error.message ? error.message : '',
        code: error.code ? error.code : ''
    };
    let statusCode = error.code ? error.code : 500
    httpResponse.status(statusCode).json(response);
};

//generic function to return success api response
module.exports.genericResponse = async (httpResponse, data) => {
    let response = {
        status: 'success',
        data: data,
    };
    httpResponse.status(ERROR_CODES.SUCCESS).json(response);
};

//function to get unique uuidv4 for account_id
module.exports.getNewAccountId = async (txn) => {
    try {
        let account_id = uuidv4();
        let userAccountDetails = await UserAccount.findByPk(account_id, {
            transaction: txn,
            raw: true,
        });
        if (!userAccountDetails) {
            return account_id;
        } else {
            return -1;
        }
    } catch (error) {
        throw error;
    }
};
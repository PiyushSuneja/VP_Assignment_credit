const Joi = require('joi');
const UserBao = require('../bao/user.bao');
const { validateSchema, genericError, genericResponse } = require('../../common/helpers');
const { LIMIT_TYPES, CREDIT_OFFER_STATUS } = require('../../common/constants');

module.exports.POST_createUserAccount = async (httpRequest, httpResponse, next) => {
    try {
        const schemaCreateUserAccount = Joi.object().keys({
            contact_no: Joi.number().required(),
            account_limit: Joi.number().required(),
            per_transaction_limit: Joi.number().required()
        });
        const data = httpRequest.body;
        //validating the user request body with the help of joi
        const params = await validateSchema(data, schemaCreateUserAccount)
        const result = await UserBao.createUserAccount(params);
        return genericResponse(httpResponse, result)
    } catch (error) {
        return genericError(httpResponse, error)
    };
}

module.exports.POST_createLimitOffers = async (httpRequest, httpResponse) => {
    try {
        const schemaCreateOfferLimit = Joi.object().keys({
            account_id: Joi.string().required(),
            limit_type: Joi.string().valid(LIMIT_TYPES.ACCOUNT_LIMIT, LIMIT_TYPES.PER_TRANSACTION_LIMIT).required(),
            new_limit: Joi.number().required(),
            expiry_time: Joi.date().required().greater(Date.now())
        });
        const data = httpRequest.body;
        const params = await validateSchema(data, schemaCreateOfferLimit);
        const result = await UserBao.createLimitOffers(params);
        return genericResponse(httpResponse, result)
    } catch (error) {
        return genericError(httpResponse, error)
    };
};


module.exports.GET_getLimitOffers = async (httpRequest, httpResponse) => {
    try {
        const schemaGetLimitOffers = Joi.object().keys({
            account_id: Joi.string().required(),
            active_date: Joi.date().optional(),
        });
        const data = httpRequest.query
        const params = await validateSchema(data, schemaGetLimitOffers);
        const result = await UserBao.getLimitOffers(params);
        return genericResponse(httpResponse, result)
    } catch (error) {
        return genericError(httpResponse, error)
    }
};

module.exports.POST_updateLimitOffers = async (httpRequest, httpResponse) => {
    try {
        const schemaUpdateLimitOffers = Joi.object().keys({
            offer_id: Joi.number().required(),
            update_status: Joi.string().valid(CREDIT_OFFER_STATUS.ACCEPTED, CREDIT_OFFER_STATUS.REJECTED).required(),
        });
        const data = httpRequest.body;
        const params = await validateSchema(data, schemaUpdateLimitOffers);
        const result = await UserBao.updateLimitOffers(params);
        return genericResponse(httpResponse, result)
    } catch (error) {
        return genericError(httpResponse, error)
    }
};

module.exports.GET_getAccountDetails = async (httpRequest, httpResponse) => {
    try {
        const schemaGetAccountDetails = Joi.object().keys({
            account_id: Joi.string().required(),
        });
        const data = httpRequest.params;
        const params = await validateSchema(data, schemaGetAccountDetails);
        const result = await UserBao.getAccountDetails(params);
        return genericResponse(httpResponse, result)
    } catch (error) {
        return (httpResponse, error)
    }
};
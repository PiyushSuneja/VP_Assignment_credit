//this files contains business logic for services
const db = require('../../db/index');
const { v4: uuidv4, validate } = require('uuid');
const { UserAccount, CreditLimitOffer } = require('../models/index');
const { LIMIT_TYPES, CREDIT_OFFER_STATUS, ERROR_CODES } = require('../../common/constants');
const { Op } = require('sequelize');
const { getNewAccountId } = require('../../common/helpers');
const error = new Error();
module.exports.createUserAccount = async (params) => {
    let txn = await db.sequelize.transaction();
    try {
        let account_id = -1;
        do {
            account_id = await getNewAccountId(txn);
        } while (account_id == -1 || account_id == undefined);
        let insertObj = {
            account_id: account_id,
            customer_id: params?.contact_no,
            account_limit: params?.account_limit,
            per_transaction_limit: params?.per_transaction_limit,
            last_account_limit: 0,
            last_per_transaction_limit: 0,
            account_limit_update_time: new Date().toISOString(),
            per_transaction_limit_update_time: new Date().toISOString(),
        };
        await UserAccount.create(insertObj, {
            transaction: txn,
            raw: true,
        });
        await txn.commit();
        return 'Account Created Successfully';
    } catch (error) {
        await txn.rollback();
        throw error;
    }
};

module.exports.createLimitOffers = async (params) => {
    let txn = await db.sequelize.transaction();
    try {
        const isuuid = validate(params?.account_id)
        if (!isuuid) {
            error.message = 'Wrong account_id'
            error.code = ERROR_CODES.BAD_REQUEST
            throw error
        }
        let userAccountDetails = await UserAccount.findByPk(params?.account_id, {
            transaction: txn,
            raw: true,
        });
        //check if userAccountNot Exists
        if (!userAccountDetails || userAccountDetails == undefined) {
            error.message = 'Account Not Exist'
            error.code = ERROR_CODES.BAD_REQUEST
            throw error
        };

        //check if new limit must be greater than existing account and per transaction limit in different cases
        if (params.limit_type == LIMIT_TYPES.ACCOUNT_LIMIT) {
            if (userAccountDetails.account_limit > params?.new_limit) {
                error.message = `Account Limit must be greater than ${userAccountDetails.account_limit}`
                error.code = ERROR_CODES.BAD_REQUEST
                throw error
            };
        } else if (params.limit_type == LIMIT_TYPES.PER_TRANSACTION_LIMIT) {
            if (userAccountDetails.per_transaction_limit > params?.new_limit) {
                error.message = `Per Transaction Limit must be greater than ${userAccountDetails.per_transaction_limit}`
                error.code = ERROR_CODES.BAD_REQUEST
                throw error
            };
        };

        let insertObj = {
            account_id: params?.account_id,
            limit_type: params?.limit_type == LIMIT_TYPES.ACCOUNT_LIMIT ? LIMIT_TYPES.ACCOUNT_LIMIT : LIMIT_TYPES.PER_TRANSACTION_LIMIT,
            new_limit: params?.new_limit,
            offer_activation_time: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            offer_expiry_time: new Date(params?.expiry_time).toISOString(),
            status: CREDIT_OFFER_STATUS.PENDING
        };
        await CreditLimitOffer.create(insertObj, {
            transaction: txn,
            raw: true,
        });
        await txn.commit();
        return 'Offer Created Successfully';
    } catch (error) {
        await txn.rollback();
        throw error;
    }
};

module.exports.getLimitOffers = async (params) => {
    let txn = await db.sequelize.transaction();
    try {
        let whereObj = {
            account_id: params?.account_id,
            status: CREDIT_OFFER_STATUS.PENDING,
        };
        if (params?.active_date) {
            whereObj.offer_activation_time = { [Op.lte]: params?.active_date };
            whereObj.offer_expiry_time = { [Op.gte]: params?.active_date };
        };
        let data = await CreditLimitOffer.findAll({
            where: whereObj,
            transaction: txn,
            raw: true
        });
        await txn.commit();
        return data;
    } catch (error) {
        await txn.rollback();
        throw error;
    };
};

module.exports.updateLimitOffers = async (params) => {
    let txn = await db.sequelize.transaction();
    try {
        let offerDetails = await CreditLimitOffer.findByPk(params?.offer_id, {
            transaction: txn,
            raw: true,
        });
        const offerExpiryTime = offerDetails.offer_expiry_time;
        const currenttime = new Date();
        //check if limit order already expired or not exist or already acepted or rejected than we will not let user to accept it
        if (!offerDetails || offerDetails == undefined || offerExpiryTime <= currenttime) {
            error.message = 'offer not exist or expired';
            error.code = ERROR_CODES.BAD_REQUEST;
            throw error;
        } else if (offerDetails.status == CREDIT_OFFER_STATUS.ACCEPTED || offerDetails.status == CREDIT_OFFER_STATUS.REJECTED) {
            error.message = 'offer is already accepted or rejected';
            error.code = ERROR_CODES.BAD_REQUEST;
            throw error;
        };
        let accountDetails = await UserAccount.findOne({
            where: { account_id: offerDetails.account_id },
            transaction: txn,
            raw: true
        });
        let updateObjCreditLimitOffer = { status: params?.update_status };
        let whereObjUserAccount = {
            account_id: offerDetails?.account_id
        };
        let whereObjCreditLimitOffer = {
            offer_id: params?.offer_id
        };
        let updateObjUserAccount = {};
        if (offerDetails.limit_type == LIMIT_TYPES.ACCOUNT_LIMIT) {
            updateObjUserAccount.account_limit = offerDetails?.new_limit;
            updateObjUserAccount.last_account_limit = accountDetails.account_limit;
            updateObjUserAccount.account_limit_update_time = new Date().toISOString();
        } else if (offerDetails.limit_type == LIMIT_TYPES.PER_TRANSACTION_LIMIT) {
            updateObjUserAccount.per_transaction_limit = offerDetails?.new_limit;
            updateObjUserAccount.last_per_transaction_limit = accountDetails.per_transaction_limit;
            updateObjUserAccount.per_transaction_limit_update_time = new Date().toISOString();
        }
        //updating new limits and previos limits and status of offer
        await Promise.all([
            (params?.update_status == CREDIT_OFFER_STATUS.ACCEPTED) ?
                UserAccount.update(updateObjUserAccount,
                    {
                        where: whereObjUserAccount,
                    },
                    {
                        transaction: txn,
                    }) : Promise.resolve(),
            CreditLimitOffer.update(updateObjCreditLimitOffer,
                {
                    where: whereObjCreditLimitOffer,
                },
                {
                    transaction: txn,
                })
        ]);
        await txn.commit();
        return 'Offer Limit Updated Successfully';
    } catch (error) {
        await txn.rollback();
        throw error;
    }
};

module.exports.getAccountDetails = async (params) => {
    let txn = await db.sequelize.transaction();
    try {
        //check if account_id is of uuid format as I used uuid for account_id
        const isuuid = validate(params?.account_id)
        if (!isuuid) {
            error.message = 'Wrong account_id'
            error.code = ERROR_CODES.BAD_REQUEST
            throw error
        };
        const [userAccountDetails, userCreditOfferDetail] = await Promise.all([
            UserAccount.findByPk(params?.account_id, {
                transaction: txn,
                raw: true,
            }),
            CreditLimitOffer.findAll({
                where: { account_id: params?.account_id },
                transaction: txn,
                raw: true
            })
        ]);
        if (!userAccountDetails || userAccountDetails == undefined) {
            error.message = 'Account Not Exist'
            error.code = ERROR_CODES.BAD_REQUEST
            throw error
        };
        await txn.commit();
        return { accountDetails: userAccountDetails, creditOfferDetails: userCreditOfferDetail }
    } catch (error) {
        await txn.rollback();
        throw error
    }
};
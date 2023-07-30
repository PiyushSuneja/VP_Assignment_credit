const express = require('express');
const router = express.Router();
const UserContoller = require('../controllers/userController');

//api to create user acccount


/**
 * @swagger
 * /create-user-account:
 *   post:
 *     summary: Create a new user account
 *     description: Endpoint to create a new user account
 *     tags:
 *       - User Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateUserAccountRequest'
 *           example:
 *             contact_no: 1234567890
 *             account_limit: 1000
 *             per_transaction_limit: 100
 *     responses:
 *       '200':
 *         description: User account created successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   CreateUserAccountRequest:
 *     type: object
 *     properties:
 *       contact_no:
 *         type: number
 *         format: int32
 *       account_limit:
 *         type: number
 *         format: int32
 *       per_transaction_limit:
 *         type: number
 *         format: int32
 *     required:
 *       - contact_no
 *       - account_limit
 *       - per_transaction_limit
 */

router.post('/create-user-account', UserContoller.POST_createUserAccount);


//api for creating credit limit offers


/**
 * @swagger
 * /create-limit-offers:
 *   post:
 *     summary: Create a new limit offer
 *     description: Endpoint to create a new limit offer for an account
 *     tags:
 *       - Limit Offers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateLimitOfferRequest'
 *           example:
 *             account_id: "96094fbe-c136-4159-a94f-68784e05b4a6"
 *             limit_type: "account_limit"
 *             new_limit: 5000
 *             expiry_time: "2023-12-31T23:59:59Z"
 *     responses:
 *       '200':
 *         description: Limit offer created successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   CreateLimitOfferRequest:
 *     type: object
 *     properties:
 *       account_id:
 *         type: string
 *       limit_type:
 *         type: string
 *         enum: ["ACCOUNT_LIMIT", "PER_TRANSACTION_LIMIT"]
 *       new_limit:
 *         type: number
 *       expiry_time:
 *         type: string
 *         format: date-time
 *     required:
 *       - account_id
 *       - limit_type
 *       - new_limit
 *       - expiry_time
 */

router.post('/create-limit-offers', UserContoller.POST_createLimitOffers);

//api to get all limit offers

/**
 * @swagger
 * /limit-offers:
 *   get:
 *     summary: Get limit offers for an account
 *     description: Endpoint to retrieve limit offers for a specific account
 *     tags:
 *       - Limit Offers
 *     parameters:
 *       - in: query
 *         name: account_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "your_account_id"
 *       - in: query
 *         name: active_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: "2023-07-30"
 *     responses:
 *       '200':
 *         description: Successfully retrieved limit offers
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * parameters:
 *   accountIdQueryParam:
 *     name: account_id
 *     in: query
 *     description: ID of the account to retrieve limit offers for
 *     required: true
 *     schema:
 *       type: string
 *     example: "your_account_id"
 * 
 *   activeDateQueryParam:
 *     name: active_date
 *     in: query
 *     description: Optional. The date for which to retrieve active limit offers
 *     required: false
 *     schema:
 *       type: string
 *       format: date
 *     example: "2023-07-30"
 * 
 * definitions:
 *   LimitOffersQueryParams:
 *     type: object
 *     properties:
 *       account_id:
 *         type: string
 *         example: "your_account_id"
 *       active_date:
 *         type: string
 *         format: date
 *         example: "2023-07-30"
 */


router.get('/limit-offers', UserContoller.GET_getLimitOffers);
// api to update limit offers

/**
 * @swagger
 * /update/limit-offers:
 *   post:
 *     summary: Update limit offers for an account
 *     description: Endpoint to update limit offers for a specific account
 *     tags:
 *       - Limit Offers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateLimitOffersRequest'
 *     responses:
 *       '200':
 *         description: Limit offers updated successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * definitions:
 *   UpdateLimitOffersRequest:
 *     type: object
 *     properties:
 *       offer_id:
 *         type: number
 *         example: 4
 *       update_status:
 *         type: string
 *         enum: ["accepted", "rejected"]
 *         example: "accepted"
 *     required:
 *       - offer_id
 *       - update_status
 */

router.post('/update/limit-offers', UserContoller.POST_updateLimitOffers);
//api to get all account details

/**
 * @swagger
 * /account/{account_id}:
 *   get:
 *     summary: Get account details
 *     description: Endpoint to retrieve details for a specific account
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: account_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the account to retrieve details for
 *         example: "your_account_id"
 *     responses:
 *       '200':
 *         description: Account details retrieved successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '404':
 *         description: Account not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * parameters:
 *   accountIdPathParam:
 *     name: account_id
 *     in: path
 *     description: ID of the account to retrieve details for
 *     required: true
 *     schema:
 *       type: string
 *     example: "your_account_id"
 */


router.get('/account/:account_id', UserContoller.GET_getAccountDetails)
module.exports = router;



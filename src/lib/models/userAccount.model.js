// models/Account.js
const { DataTypes } = require('sequelize');
const db = require('../../db/index');

const userAccount = db.sequelize.define('userAccount', {
    account_id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    account_limit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    per_transaction_limit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    last_account_limit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    last_per_transaction_limit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    account_limit_update_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    per_transaction_limit_update_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = userAccount;

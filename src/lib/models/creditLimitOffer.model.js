const { DataTypes } = require('sequelize');
const db = require('../../db/index');

const creditLimitOffer = db.sequelize.define('creditLimitOffer', {
    offer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    account_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
    },
    limit_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    new_limit: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    offer_activation_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    offer_expiry_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = creditLimitOffer;

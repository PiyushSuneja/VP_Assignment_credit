const { Sequelize } = require('sequelize');
const colors = require('colors');
const db = {};
//creating a db connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.ping = async () => {
    try {
        await sequelize.authenticate();
        console.log(
            `Database connection ${colors.green(
                'OK'
            )}`
        );
    }
    catch (e) {
        console.error(
            ` Database connection  ${colors.red(
                'FAILED'
            )}`,
            e
        );
        process.exit(1);
    }
};

module.exports = db;
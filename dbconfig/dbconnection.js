const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME, // Specify the database name
    logging: false // Disable logging of SQL queries (optional)
});

module.exports = sequelize;



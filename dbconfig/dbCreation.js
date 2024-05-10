const { Sequelize } = require('sequelize');

// Function to establish a database connection using Sequelize
async function CreateDb() {
    try {
        // Create a Sequelize instance without specifying the database name
        const sequelize = new Sequelize({
            host: process.env.HOST,
            dialect: process.env.DIALECT,
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            logging: false // Disable logging of SQL queries (optional)
        });

        // Test the connection
        await sequelize.authenticate();
        console.log('Connected to MySQL server!');

        // Check if the database exists
        const [results] = await sequelize.query(`SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DATABASE_NAME}'`);
        const databaseExists = results.length > 0;

        if (!databaseExists) {
            // Create the database
            await sequelize.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
            console.log('Database created successfully!');
        }
        else{
            console.log('Database is already there!')
        }
        await sequelize.close(); 
        console.log('Disconnected from MySQL server!');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        return null;
    }
}

module.exports = CreateDb;

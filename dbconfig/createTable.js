const  defineUserDetailsModel  = require('../datamodels/UserDetailsModel');
const  defineUserModel  = require('../datamodels/UserModel'); 
const sequelize = require('./dbconnection');

async function createTables() {
    try {
        // Define both User and UserDetails models
        const User = defineUserModel(sequelize);
        const UserDetails = defineUserDetailsModel(sequelize);

        // Check if the 'users' table exists
        const userTableExists = await sequelize.getQueryInterface().showAllTables().then(tables => tables.includes('users'));

        if (!userTableExists) {
            // Create the 'users' table
            await User.sync({ force: true });
            console.log('Table "users" created successfully!');
        } else {
            console.log('Table "users" already exists!');
        }

        // Check if the 'user_details' table exists
        const userDetailsTableExists = await sequelize.getQueryInterface().showAllTables().then(tables => tables.includes('user_details'));

        if (!userDetailsTableExists) {
            // Create the 'user_details' table
            await UserDetails.sync({ force: true });
            console.log('Table "user_details" created successfully!');
        } else {
            console.log('Table "user_details" already exists!');
        }

        return sequelize;
    } catch (error) {
        console.error('Error creating database and tables:', error.message);
    }
}

module.exports = createTables;

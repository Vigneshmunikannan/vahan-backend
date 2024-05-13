const { DataTypes } = require('sequelize')

const defineUserDetailsModel = (sequelize, User) => {
    const UserDetails = sequelize.define('UserDetails', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rollnumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'username'
            }
        },
        DOB: {
            type: DataTypes.DATE,
            allowNull: false
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        college: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 4
            }
        }
    }, {
        tableName: 'user_details', // Table name in the database
        timestamps: true // Enable timestamps (createdAt and updatedAt)
    });

    return UserDetails;
};

module.exports = defineUserDetailsModel;

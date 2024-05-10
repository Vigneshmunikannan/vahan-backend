 const { DataTypes } = require('sequelize')

 const defineUserModel = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Other user attributes...
    }, {
        tableName: 'users', // Table name in the database
        timestamps: true // Enable timestamps (createdAt and updatedAt)
    });

    return User;
};

module.exports = defineUserModel;

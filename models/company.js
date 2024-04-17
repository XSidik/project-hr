const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Companies = sequelize.define('Companies', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    sub_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Companies;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Companies = sequelize.define('Wa', {
    is_active: {
        type: DataTypes.BOOLEAN,
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

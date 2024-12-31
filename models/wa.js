const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Companies = sequelize.define('Wa', {
    is_active: {
        type: DataTypes.BOOLEAN,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = Companies;

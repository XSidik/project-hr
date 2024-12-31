const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Companies = sequelize.define('companies', {
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
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
});

module.exports = Companies;

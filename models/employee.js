const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('employees', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    whatsapp_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    date_of_entry: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departement: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
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

module.exports = Employee;

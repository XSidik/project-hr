const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project_hr', 'postgres', 'mort', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres'
});

module.exports = sequelize;

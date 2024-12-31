const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project_hr', 'PayNet', 'PayNet123', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgresql'
});


// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite' // Specify the path to the file database
// });

module.exports = sequelize;

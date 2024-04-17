'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Companies',
      'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Companies',
      'updatedBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Employees',
      'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Employees',
      'updatedBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('TranSalaries',
      'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('TranSalaries',
      'updatedBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('TranSalaries',
      'status', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users',
      'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Users',
      'updatedBy', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Companies', 'createdBy');
    await queryInterface.removeColumn('Companies', 'updatedBy');
    await queryInterface.removeColumn('Employees', 'createdBy');
    await queryInterface.removeColumn('Employees', 'updatedBy');
    await queryInterface.removeColumn('TranSalaries', 'createdBy');
    await queryInterface.removeColumn('TranSalaries', 'updatedBy');
    await queryInterface.removeColumn('TranSalaries', 'status');
    await queryInterface.removeColumn('Users', 'createdBy');
    await queryInterface.removeColumn('Users', 'updatedBy');
  }
};

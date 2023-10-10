"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "projectManager", {
      type: Sequelize.STRING, // Change the data type if needed
      allowNull: true,
    });

    await queryInterface.addColumn("tasks", "QCI", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tasks", "fitter", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tasks", "welder", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tasks", "painter", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tasks", "foreman", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tasks", "projectManager");
    await queryInterface.removeColumn("tasks", "QCI");
    await queryInterface.removeColumn("tasks", "fitter");
    await queryInterface.removeColumn("tasks", "welder");
    await queryInterface.removeColumn("tasks", "painter");
    await queryInterface.removeColumn("tasks", "foreman");
  },
};

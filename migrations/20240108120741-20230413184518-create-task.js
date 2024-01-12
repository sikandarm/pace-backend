"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("tasks", "task_iteration", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("tasks", "task_iteration"),
    ]);
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all(
      [
        queryInterface.addColumn("breaktasks", "task_status", {
          type: Sequelize.ENUM(
            "in_process",
            "pending",
            "rejected",
            "approved",
            "to_inspect"
          ),
          allowNull: false,
          defaultValue: "pending",
        }),
      ],
      [
        queryInterface.addColumn("breaktasks", "total_time", {
          type: Sequelize.STRING,
          allowNull: true,
        }),
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("breaktasks", "task_status"),
      queryInterface.removeColumn("breaktasks", "total_time"),
    ]);
  },
};

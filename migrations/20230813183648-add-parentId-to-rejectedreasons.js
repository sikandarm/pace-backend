"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("rejectedreasons", "parentId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "rejectedreasons",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("rejectedreasons", "parentId");
  },
};

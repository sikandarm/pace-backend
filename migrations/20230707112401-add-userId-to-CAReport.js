"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("careports", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addIndex("careports", ["userId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("careports", ["userId"]);
    await queryInterface.removeColumn("careports", "userId");
  },
};

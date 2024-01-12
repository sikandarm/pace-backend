"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bill_of_ladings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      billTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dilveryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      orderDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      shipVia: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      terms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bill_lading_items: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "bill_of_landing_items",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedBy: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bill_of_ladings");
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("careports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      originatorName: {
        type: Sequelize.STRING,
      },

      contractorSupplier: {
        type: Sequelize.STRING,
      },
      caReportDate: {
        type: Sequelize.DATE,
      },
      ncNo: {
        type: Sequelize.STRING,
      },
      purchaseOrderNo: {
        type: Sequelize.STRING,
      },
      partDescription: {
        type: Sequelize.TEXT,
      },
      partId: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      dwgNo: {
        type: Sequelize.STRING,
      },
      activityFound: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      actionToPrevent: {
        type: Sequelize.TEXT,
      },
      disposition: {
        type: Sequelize.STRING,
      },
      responsiblePartyName: {
        type: Sequelize.STRING,
      },
      responsiblePartyDate: {
        type: Sequelize.DATE,
      },
      correctiveActionDesc: {
        type: Sequelize.TEXT,
      },
      approvalName: {
        type: Sequelize.STRING,
      },
      approvalDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("careports");
  },
};

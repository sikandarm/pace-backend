'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ediStdNomenclature: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      aiscManualLabel: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      shape: {
        type: Sequelize.ENUM("2L","C", "HP", "HSS", "L", "M", "MC", "MT", "PIPE", "S", "ST", "W", "WT"), allowNull: false
      },
      weight : {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      depth : {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      grade: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      poNumber: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      heatNumber: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      orderArrivedInFull: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      orderArrivedCMTR: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      itemType: {
        type: Sequelize.ENUM("stock","job"),
        allowNull: false
      },
      lengthReceivedFoot: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lengthReceivedInch: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      poPulledFromNumber: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      lengthUsedFoot: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lengthUsedInch: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lengthRemainingFoot: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lengthRemainingInch: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  }
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inventory.init(
    {
      ediStdNomenclature: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      aiscManualLabel: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      shape: {
        type: DataTypes.ENUM(
          "2L",
          "C",
          "HP",
          "HSS",
          "L",
          "M",
          "MC",
          "MT",
          "PIPE",
          "S",
          "ST",
          "W",
          "WT"
        ),
        allowNull: false,
        validate: {
          isIn: [["2L", "C", "HP", "HSS", "L", "M", "MC", "MT", "PIPE", "S", "ST", "W", "WT"]],
        },
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      depth: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { len: [5, 10] },
      },
      poNumber: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { len: [5, 10] },
      },
      heatNumber: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { len: [5, 10] },
      },
      orderArrivedInFull: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      orderArrivedCMTR: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      itemType: {
        type: DataTypes.ENUM("stock", "job"),
        allowNull: false,
        validate: { isIn: [["stock", "job"]] },
      },
      lengthReceivedFoot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 99 },
      },
      lengthReceivedInch: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 99 },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 100 },
      },
      poPulledFromNumber: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { len: [5, 10] },
      },
      lengthUsedFoot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 99 },
      },
      lengthUsedInch: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 99 },
      },
      lengthRemainingFoot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 99 },
      },
      lengthRemainingInch: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 99 },
      },
    },
    {
      sequelize,
      modelName: "Inventory",
      tableName: "inventories",
    }
  );
  return Inventory;
};
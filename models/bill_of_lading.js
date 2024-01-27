"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bill_of_lading extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bill_of_lading.hasMany(models.bill_of_landing_items, {
        foreignKey: "billId",
      });
      bill_of_lading.belongsTo(models.Company, {
        foreignKey: "companyId",
      });
    }
  }
  bill_of_lading.init(
    {
      billTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      terms: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shipVia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      receivedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      receivedStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      receivedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      createdBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      deletedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "bill_of_lading",
    }
  );
  return bill_of_lading;
};

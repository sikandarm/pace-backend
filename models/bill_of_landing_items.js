"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bill_of_landing_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bill_of_landing_items.belongsTo(models.PurchaseOrder, {
        foreignKey: "purchase_order",
      });
      bill_of_landing_items.belongsTo(models.fabricated_items_perjob, {
        foreignKey: "fabricated_items",
      });
      bill_of_landing_items.hasMany(models.bill_of_lading, {
        foreignKey: "bill_lading_items",
      });
    }
  }
  bill_of_landing_items.init(
    {
      fabricated_items: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: "bill_of_landing_items",
    }
  );
  return bill_of_landing_items;
};

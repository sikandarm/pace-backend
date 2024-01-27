"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class fabricated_items_perjob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      fabricated_items_perjob.belongsTo(models.Job, { foreignKey: "job_Id" });
      fabricated_items_perjob.belongsTo(models.Purchase_Order_Items, {
        foreignKey: "poitems_id",
      });
      fabricated_items_perjob.hasMany(models.bill_of_landing_items, {
        foreignKey: "fabricateditemsId",
      });
    }
  }
  fabricated_items_perjob.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      poitems_id: {
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
      modelName: "fabricated_items_perjob",
    }
  );
  return fabricated_items_perjob;
};

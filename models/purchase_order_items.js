"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase_Order_Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase_Order_Items.belongsTo(models.Inventory, {
        foreignKey: "inventory_id",
      });
      Purchase_Order_Items.belongsTo(models.PurchaseOrder, {
        foreignKey: "po_id",
      });
    }
  }
  Purchase_Order_Items.init(
    {
      po_id: DataTypes.INTEGER,
      inventory_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      deleted_At: DataTypes.DATE,
      deleted_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Purchase_Order_Items",
      tableName: "Purchase_Order_Items",
    }
  );
  return Purchase_Order_Items;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PurchaseOrder.belongsTo(models.Purchase_Order_Items, {
        foreignKey: "id",
      });
    }
  }

  PurchaseOrder.init(
    {
      po_id: DataTypes.INTEGER,
      company_name: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      fax: DataTypes.STRING,
      email: DataTypes.STRING,
      po_number: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      delivery_date: DataTypes.DATE,
      vendor_name: DataTypes.STRING,
      ship_to: DataTypes.STRING,
      ship_via: DataTypes.STRING,
      term: DataTypes.TEXT,
      order_by: DataTypes.STRING,
      confirm_with: DataTypes.STRING,
      placed_via: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
      deleted_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PurchaseOrder",
      tableName: "purchase_orders",
    }
  );
  return PurchaseOrder;
};

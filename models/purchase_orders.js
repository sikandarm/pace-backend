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
      PurchaseOrder.belongsTo(models.Vendor, {
        foreignKey: "vendor_name",
        as: "vendor",
      });
      PurchaseOrder.belongsTo(models.Company, {
        foreignKey: "company_name",
        as: "company",
      });
      PurchaseOrder.belongsTo(models.User, {
        foreignKey: "userId",
        as: "firstName",
      });
      PurchaseOrder.hasMany(models.Job, { foreignKey: "po_id" });
      PurchaseOrder.hasMany(models.bill_of_landing_items, {
        foreignKey: "purchase_order",
      });
    }
  }
  PurchaseOrder.init(
    {
      company_name: DataTypes.INTEGER,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      fax: DataTypes.STRING,
      email: DataTypes.STRING,
      status: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      po_number: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      delivery_date: DataTypes.DATE,
      vendor_name: DataTypes.INTEGER,
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
      tableName: "purchaseorders",
    }
  );
  return PurchaseOrder;
};

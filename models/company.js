"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Company.hasMany(models.PurchaseOrder, {
        foreignKey: "id",
      });
      Company.hasMany(models.bill_of_lading, {
        foreignKey: "company_id",
      });
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      fax: DataTypes.STRING,
      email: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
      deletedby: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companies",
    }
  );
  return Company;
};

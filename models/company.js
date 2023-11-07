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
      // define association here
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      fax: DataTypes.INTEGER,
      email: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
      deletedby: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "Companies",
    }
  );
  return Company;
};

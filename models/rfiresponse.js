"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rfiresponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rfiresponse.init(
    {
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "rfiresponse",
      tableName: "rfiresponses",
    }
  );
  return rfiresponse;
};

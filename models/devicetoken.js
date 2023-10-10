"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeviceToken extends Model {
    static associate({ User }) {
      // define association here

      this.belongsTo(User, { foreignKey: "userId" });
    }
  }
  DeviceToken.init(
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      token: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "DeviceToken",
      tableName: "devicetokens",
    }
  );
  return DeviceToken;
};

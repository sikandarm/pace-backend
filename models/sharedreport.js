"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SharedReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ CAReport }) {
      // define association here

      this.belongsTo(CAReport, {
        foreignKey: "reportId",
      });
    }
    toJSON() {
      const values = Object.assign({}, this.get());

      delete values.createdAt;
      delete values.updatedAt;
      return values;
    }
  }
  SharedReport.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "SharedReport",
      tableName: "sharedreports",
    }
  );
  return SharedReport;
};

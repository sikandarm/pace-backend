"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CAReport extends Model {
    static associate({ User, SharedReport }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });

      this.belongsToMany(User, {
        through: SharedReport,
        foreignKey: "reportId",
      });

      this.hasMany(SharedReport, {
        foreignKey: "reportId",
      });
    }
  }
  CAReport.init(
    {
      originatorName: {
        type: DataTypes.STRING,
      },
      contractorSupplier: {
        type: DataTypes.STRING,
      },
      caReportDate: {
        type: DataTypes.DATE,
      },
      ncNo: {
        type: DataTypes.STRING,
      },
      purchaseOrderNo: {
        type: DataTypes.STRING,
      },
      partDescription: {
        type: DataTypes.TEXT,
      },
      partId: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      dwgNo: {
        type: DataTypes.STRING,
      },
      activityFound: {
        type: DataTypes.STRING,
        get() {
          const activityFoundJSON = this.getDataValue("activityFound");
          if (activityFoundJSON) {
            return JSON.parse(activityFoundJSON);
          }
          return null;
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      actionToPrevent: {
        type: DataTypes.TEXT,
      },
      disposition: {
        type: DataTypes.STRING,
      },
      responsiblePartyName: {
        type: DataTypes.STRING,
      },
      responsiblePartyDate: {
        type: DataTypes.DATE,
      },
      correctiveActionDesc: {
        type: DataTypes.TEXT,
      },
      approvalName: {
        type: DataTypes.STRING,
      },
      approvalDate: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("pending", "rejected", "approved"),
        allowNull: false,
        defaultValue: "pending",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CAReport",
      tableName: "careports",
    }
  );
  return CAReport;
};

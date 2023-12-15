"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Task,
      sequence,
      PurchaseOrder,
      fabricated_items_perjob,
    }) {
      // define association here
      this.hasMany(Task, { foreignKey: "jobId" });
      this.hasMany(sequence, { foreignKey: "job_id" });
      this.hasMany(fabricated_items_perjob, { foreignKey: "job_Id" });
      this.belongsTo(PurchaseOrder, { foreignKey: "po_id" });
    }
  }
  Job.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      po_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("in_process", "completed", "priority"),
        allowNull: false,
        defaultValue: "priority",
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Job",
      tableName: "jobs",
      paranoid: true,
    }
  );
  return Job;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class breaktasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      breaktasks.belongsTo(models.Task, {
        foreignKey: "task_id",
      });
    }
  }
  breaktasks.init(
    {
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      break_start: {
        type: DataTypes.DATE,
      },
      break_end: {
        type: DataTypes.DATE,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      task_iteration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      task_status: {
        type: DataTypes.ENUM(
          "in_process",
          "pending",
          "rejected",
          "approved",
          "to_inspect"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      total_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "breaktasks",
    }
  );
  return breaktasks;
};

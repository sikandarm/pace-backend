"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const UrlUtil = require("../utils/urlUtil");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Job, User, sequence_task, breaktasks }) {
      // define association here
      this.belongsTo(Job, { foreignKey: "jobId" });
      this.belongsTo(User, { foreignKey: "userId" });
      this.hasMany(sequence_task, {
        foreignKey: "task_id",
      });
      this.hasMany(breaktasks, {
        foreignKey: "task_id",
      });
    }
    toJSON() {
      const values = Object.assign({}, this.get());
      const taskImageDir = UrlUtil.join(
        process.env.BASE_URL,
        "uploads",
        "task_images"
      );

      if (values.image) {
        values.image = `${taskImageDir}/${values.image}`;
      }

      delete values.createdAt;
      delete values.updatedAt;
      return values;
    }
  }
  Task.init(
    {
      pmkNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => uuidv4().slice(0, 6),
      },
      heatNo: {
        type: DataTypes.STRING,
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      estimatedHour: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comments: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rejectionReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectManager: {
        type: DataTypes.STRING, // Change the data type if needed
        allowNull: true,
      },
      QCI: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fitter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      welder: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      painter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      foreman: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      COPQ: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      task_iteration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
    }
  );
  return Task;
};

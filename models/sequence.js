"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sequence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sequence.belongsTo(models.Job, {
        foreignKey: "job_id",
      });
      sequence.hasMany(models.sequence_task, {
        foreignKey: "sequence_id",
      });
    }
  }
  sequence.init(
    {
      sequence_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      createdBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      deletedBy: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "sequence",
      tableName: "sequences",
    }
  );
  return sequence;
};

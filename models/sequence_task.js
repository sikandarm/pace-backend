'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sequence_task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       sequence_task.belongsTo(models.sequence, {
         foreignKey: "sequence_id",
       });
       sequence_task.belongsTo(models.Task, {
         foreignKey: "task_id",
       });
    }
  }
  sequence_task.init(
    {
      sequence_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_id: {
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
      modelName: "sequence_task",
    }
  );
  return sequence_task;
};
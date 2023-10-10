"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RejectedReason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(this, { foreignKey: "parentId", as: "children" });
      this.belongsTo(this, { foreignKey: "parentId", as: "parent" });
    }
  }
  RejectedReason.init(
    {
      name: {
        type: DataTypes.TEXT,
        set(value) {
          if (value === null) {
            this.setDataValue("name", null);
          } else if (value !== undefined) {
            this.setDataValue("name", value.trim().toLowerCase());
          }
        },
      },
    },
    {
      sequelize,
      modelName: "RejectedReason",
      tableName: "rejectedreasons",
    }
  );
  return RejectedReason;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Role,
      UserRole,
      DeviceToken,
      CAReport,
      SharedReport,
      Task,
      Notification,
    }) {
      // define association here
      this.belongsToMany(Role, {
        through: UserRole,
        as: "roles",
        foreignKey: "userId",
      });

      this.hasMany(CAReport, { foreignKey: "userId" });

      this.hasMany(Task, { foreignKey: "userId" });

      this.hasMany(DeviceToken, { foreignKey: "userId", onDelete: "CASCADE" });

      this.hasMany(Notification, { foreignKey: "userId" });

      this.belongsToMany(CAReport, {
        through: SharedReport,
        foreignKey: "userId",
      });
    }

    toJSON() {
      return {
        ...this.get(),
        password: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      };
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      zip: {
        type: DataTypes.INTEGER,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ratePerHour: {
        type: DataTypes.INTEGER,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      paranoid: true,
    }
  );
  return User;
};
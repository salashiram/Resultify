const { Sequelize, Model, DataTypes } = require("sequelize");
const UserRol = require("../models/userRol.model");
const sequelize = require("../connection");

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "UserRol",
        key: "id",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Users",
    tableName: "Users",
  }
);

Users.hasOne(UserRol, {
  foreignKey: "rol_id",
});

UserRol.belongsTo(Users, {
  foreignKey: "id",
});

module.exports = Users;

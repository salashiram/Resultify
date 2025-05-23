const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const UserProfiles = require("./userProfiles.model");

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
    },
  },
  {
    sequelize,
    modelName: "Users",
    tableName: "Users",
  }
);

Users.hasOne(UserProfiles, {
  foreignKey: "user_id",
});

module.exports = Users;

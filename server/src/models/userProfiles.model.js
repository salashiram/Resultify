const { Sequelize, Model, DataTypes } = require("sequelize");
const Users = require("../models/users.model");

const sequelize = require("../connection");

class UserProfiles extends Model {}

UserProfiles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UserProfiles",
    tableName: "UserProfiles",
  }
);

UserProfiles.hasOne(Users, {
  foreignKey: "user_id",
});

Users.belongsTo(UserProfiles, {
  foreignKey: "id",
});

module.exports = UserProfiles;

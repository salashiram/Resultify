const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");

class UserRol extends Model {}

UserRol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserRol",
    tableName: "UserRol",
  }
);

module.exports = UserRol;

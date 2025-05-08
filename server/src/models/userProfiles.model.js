const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Users = require("./users.model");

class UserProfiles extends Model {}

UserProfiles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      onDelete: "CASCADE",
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
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

// UserProfiles.belongsTo(Users, {
//   foreignKey: "user_id",
// });

module.exports = UserProfiles;

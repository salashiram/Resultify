const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Users = require("../models/users.model");

class Exams extends Model {}

Exams.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exam_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    school_group: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school_career: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Exams",
    tableName: "Exams",
  }
);

Users.hasOne(Exams, { foreignKey: "created_by" });
Exams.belongsTo(Users, { foreignKey: "created_by" });

module.exports = Exams;

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Exams = require("./exams.model");

class Submissions extends Model {}

Submissions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Exams",
        key: "exam_id",
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Submissions",
    tableName: "Submissions",
  }
);

module.exports = Submissions;

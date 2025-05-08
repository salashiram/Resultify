const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Exams = require("../models/exams.model");

class Questions extends Model {}

Questions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    question_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Exams",
        key: "id",
      },
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    question_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Questions",
    tableName: "Questions",
  }
);

Exams.hasOne(Questions, { foreignKey: "exam_id" });
Questions.belongsTo(Exams, { foreignKey: "exam_id" });

module.exports = Questions;

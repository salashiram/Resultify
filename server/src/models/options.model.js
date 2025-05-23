const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Questions = require("../models/questions.model");

class Options extends Model {}

Options.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {},
    },
    option_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Options",
    tableName: "Options",
  }
);

Questions.hasMany(Options, { foreignKey: "question_id" });
Options.belongsTo(Questions, { foreignKey: "question_id" });

module.exports = Options;

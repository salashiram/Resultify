const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "Resultify",
  process.env.DB_USER || "root",
  process.env.DB_PASS_CONNECTION,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || "3306",
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection successfully");
  } catch (err) {
    console.log("Connection error", err);
  }
}

testConnection();

module.exports = sequelize;

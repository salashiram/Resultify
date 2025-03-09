const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Resultify", "root", "YHsy8B2QJQTrYg3A", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
});

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

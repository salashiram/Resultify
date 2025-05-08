const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS_CONNECTION,
  database: "Resultify",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

module.exports = pool;

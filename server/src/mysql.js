const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS_CONNECTION,
  database: process.env.DB_NAME || "Resultify",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

module.exports = pool;

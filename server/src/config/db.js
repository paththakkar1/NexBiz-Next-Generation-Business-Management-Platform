const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'your_password',
  database: process.env.DB_NAME || 'nexbiz_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Simple validation to ensure database credentials can be loaded
pool.getConnection()
  .then((connection) => {
    console.log('Database connection pool initialized successfully.');
    connection.release();
  })
  .catch((err) => {
    console.error('Database connection failed. Ensure your MySQL server is running and configuration is correct.');
    console.error(err.message);
  });

module.exports = pool;

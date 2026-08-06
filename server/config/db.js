const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nexbiz_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Test connection immediately on initial load
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Database connection pool established successfully.');
    connection.release();
  } catch (error) {
    console.error('Database connection failed! Please check your credentials in .env.');
    console.error('Error details:', error.message);
  }
})();

module.exports = pool;

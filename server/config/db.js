const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create MySQL Connection Pool configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nexbiz_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Instantiate mysql2/promise connection pool
const pool = mysql.createPool(poolConfig);

/**
 * Helper function to execute parameterized SQL queries.
 * @param {string} sql - SQL Query string
 * @param {Array} params - Array of parameters
 * @returns {Promise<Array>} - Returns [rows, fields] tuple
 */
const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Database Query Error:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sql: sql
    });
    throw error;
  }
};

/**
 * Tests connection pool health on server boot.
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database pool connected successfully to:', process.env.DB_NAME || 'nexbiz_db');
    connection.release();
    return true;
  } catch (error) {
    console.error('⚠️ MySQL Connection Failed! Check database credentials and server status.');
    console.error('Details:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};

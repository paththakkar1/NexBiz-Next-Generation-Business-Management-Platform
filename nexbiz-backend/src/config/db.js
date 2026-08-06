const mysql = require('mysql2/promise');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'nexbiz_db'
};

let pool;

async function initDB() {
    try {
        // 1. Connect without database name to ensure the database exists
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await connection.end();

        // 2. Create the connection pool with the database specified
        pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // 3. Create the users table if it does not exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'Customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(createTableQuery);
        console.log('Database and tables initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        throw error;
    }
}

// Export the query wrapper which ensures database initialization is complete before queries run
const dbInterface = {
    query: async (...args) => {
        if (!pool) {
            await initPromise;
        }
        return pool.query(...args);
    },
    execute: async (...args) => {
        if (!pool) {
            await initPromise;
        }
        return pool.execute(...args);
    }
};

const initPromise = initDB();

module.exports = dbInterface;
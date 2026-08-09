const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log(`🔌 Connecting to MySQL server at ${host}:${port} as user '${user}'...`);

  try {
    // Create connection without database selected to create DB if needed
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL Server!');

    const sqlPath = path.join(__dirname, '../config/schema.sql');
    console.log(`📄 Reading SQL DDL file from: ${sqlPath}`);
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Executing schema DDL queries...');
    await connection.query(sqlScript);

    console.log('🎉 Database and tables initialized successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    console.error('\nTips:');
    console.error('1. Check if MySQL server is running.');
    console.error('2. Verify DB_USER and DB_PASSWORD in server/.env file.');
    process.exit(1);
  }
}

initDB();

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'retaste',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const connection = await pool.getConnection();
  
  try {
    const sqlFile = path.join(__dirname, 'src/database/init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    // Split SQL statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (const stmt of statements) {
      const trimmedStmt = stmt.trim();
      if (trimmedStmt) {
        try {
          await connection.query(trimmedStmt);
          console.log('✓ Executed:', trimmedStmt.substring(0, 50) + '...');
        } catch (err) {
          console.error('✗ Error executing statement:', trimmedStmt.substring(0, 50));
          console.error('Error:', err.message);
        }
      }
    }
    
    console.log('✓ Database initialization completed!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

initializeDatabase();

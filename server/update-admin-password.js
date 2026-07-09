const mysql = require('mysql2/promise');

async function updateAdminPassword() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'admin123',
      database: 'retaste'
    });

    const newHash = '$2a$10$eouanx6NJIqVPVkp12cbZOEw8vi.1sOummbCLamXeef/GZoxQjmFe';
    const email = 'admin@retaste.local';

    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [newHash, email]
    );

    console.log(`Updated ${result.affectedRows} user(s)`);
    console.log(`Admin password hash updated for: ${email}`);
  } catch (error) {
    console.error('Error updating database:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateAdminPassword();

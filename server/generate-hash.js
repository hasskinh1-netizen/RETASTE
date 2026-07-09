const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('admin', 10);
  console.log('New bcrypt hash for password "admin":');
  console.log(hash);
}

generateHash();

const fs = require('fs');
const path = require('path');
const db = require('./index');

async function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    console.log('Initializing database...');
    await db.query(schema);
    
    // Create default super-admin if no users exist
    const userCheck = await db.query('SELECT id FROM users LIMIT 1');
    if (userCheck.rows.length === 0) {
      console.log('No users found. Creating default super-admin...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'super-admin']
      );
      console.log('Default super-admin created: admin / admin123');
    }

    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initDb();

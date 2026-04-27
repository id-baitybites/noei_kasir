const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to NeonDB');
    
    const schema = fs.readFileSync(path.join(__dirname, 'src/db/schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema migration successful');

    // Add some sample data
    const sampleData = `
      INSERT INTO products (name, description, price, stock, category) VALUES
      ('Kopi Tubruk', 'Traditional Indonesian coffee', 15.00, 50, 'Coffee'),
      ('Es Teh Manis', 'Sweet iced tea', 5.00, 100, 'Tea'),
      ('Nasi Goreng', 'Special fried rice', 25.00, 30, 'Food'),
      ('Roti Bakar', 'Grilled bread with chocolate', 12.00, 20, 'Snack')
      ON CONFLICT DO NOTHING;
    `;
    await client.query(sampleData);
    console.log('Sample data inserted');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();

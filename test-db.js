// test-db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'smart_learning',
  user: 'postgres',
  password: 'YOUR_PASSWORD', // Ganti dengan password Anda
});

async function test() {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', ['parent@example.com']);
    console.log('✅ Database connection OK');
    console.log('User found:', result.rows);
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await pool.end();
  }
}

test();
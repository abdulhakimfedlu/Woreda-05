const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runMigration() {
  try {
    console.log('Running migration to add email field to admins table...');
    
    await pool.query(`
      ALTER TABLE admins 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
      ALTER COLUMN password_hash DROP NOT NULL;
    `);
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();

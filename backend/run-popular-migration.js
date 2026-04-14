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
    console.log('Running migration to add isPopular field to services table...');
    
    await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;
    `);
    
    await pool.query(`
      UPDATE services 
      SET is_popular = FALSE 
      WHERE is_popular IS NULL;
    `);
    
    console.log('Migration completed successfully!');
    console.log('isPopular field added to services table.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
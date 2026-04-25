const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function upgrade() {
  try {
    await pool.query(`
      UPDATE admins 
      SET 
        can_view_dashboard = true,
        can_manage_announcements = true,
        can_manage_services = true,
        can_manage_categories = true,
        can_manage_gallery = true,
        message_access = 'Both'
    `);
    console.log('Upgraded all existing admins with legacy access!');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
upgrade();

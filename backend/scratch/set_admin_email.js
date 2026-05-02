const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const adminUsername = process.argv[2];
const adminEmail = process.argv[3];

if (!adminUsername || !adminEmail) {
  console.log('Usage: node set_admin_email.js <username> <email>');
  process.exit(1);
}

async function setAdminEmail() {
  try {
    console.log(`Setting email ${adminEmail} for admin ${adminUsername}...`);
    
    const result = await pool.query(
      'UPDATE admins SET email = $1 WHERE username = $2 RETURNING id',
      [adminEmail, adminUsername]
    );
    
    if (result.rowCount > 0) {
      console.log('Successfully updated admin email!');
    } else {
      console.log('Admin not found. Please check the username.');
    }
    
  } catch (error) {
    console.error('Failed to update admin email:', error);
  } finally {
    await pool.end();
  }
}

setAdminEmail();

const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function check() {
  const res = await pool.query("SELECT * FROM admins WHERE username = 'Abdu'");
  console.log(JSON.stringify(res.rows[0], null, 2));
  await pool.end();
}
check();

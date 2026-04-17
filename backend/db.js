const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'adoptalia_user',
  password: process.env.DB_PASSWORD || 'Ad0pt4l14@2620',
  database: process.env.DB_NAME || 'adoptalia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

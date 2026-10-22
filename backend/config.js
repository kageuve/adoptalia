const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });
function required(name) {
  const value = process.env[name];
  if (!value || value.startsWith('CHANGE_ME')) throw new Error(`Configure ${name}`);
  return value;
}
const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');
module.exports = {
  jwtSecret,
  db: {
    host: process.env.DB_HOST || 'db',
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 100,
    connectTimeout: 10000
  },
  uploadsDir: path.join(__dirname, 'public/uploads')
};

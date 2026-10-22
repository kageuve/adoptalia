const mysql = require('mysql2/promise');
const { db } = require('./config');
module.exports = mysql.createPool(db);

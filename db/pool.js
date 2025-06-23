const {Pool} = require('pg');
require('dotenv').config();

const db_url = process.env.DATABASE_URL;

if (!db_url) {
    console.log("Invalid or missing database URL");
    process.exit(1);
}

const pool = new Pool ({
    connectionString: db_url,
});

console.log("Connected to database");

module.exports = pool;


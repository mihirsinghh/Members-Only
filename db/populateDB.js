const pool = require('./pool');

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        membership_status TEXT NOT NULL,
        admin_status TEXT NOT NULL
    );

    INSERT INTO users (first_name, last_name, username, password, membership_status, admin_status)
    VALUES ('mihir', 'singh', 'mihirsingh', 'Tennis0817*', 'yes', 'yes');
`

async function createTables() {
    try {
        await pool.query(createUserTable);
    } catch (err) {
        console.log(err);
    }
}

createTables();


const pool = require('./pool.js');

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
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
const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`

async function createTables() {
    try {
        await pool.query(createUserTable);
        await pool.query(createSessionsTable);
        console.log("tables created in database");
    } catch (err) {
        console.log(err);
    }
}

createTables();


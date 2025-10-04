const pool = require('./pool.js');

// Script to drop and recreate the messages table with the new author_id column
const recreateMessagesTable = `
    -- Drop the existing messages table (this will delete all existing messages)
    DROP TABLE IF EXISTS messages CASCADE;
    
    -- Recreate the messages table with the author column
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Insert sample data
    INSERT INTO messages (title, text, author)
    VALUES ('life is crazy', 'hey everyone, just realized that life is crazy', 'mihirsingh');
`;

const deleteAllMessagesQuery = `
    DELETE FROM messages
`;

const deleteAllUsersQuery = `
    DELETE FROM users
`;

async function recreateMessages() {
    try {
        await pool.query(recreateMessagesTable);
        console.log("Successfully dropped and recreated messages table with author column");
        console.log("Sample message has been inserted");
    } catch (err) {
        console.error("Error recreating messages table:", err);
    } finally {
        // Close the pool connection
        await pool.end();
    }
}

async function deleteMessages() {
    try {
        await pool.query(deleteAllMessagesQuery);
        console.log('deleted all messages from table');
    } catch (err) {
        console.error('error deleting all messages: ', err);
    }
}

async function deleteUsers() {
    try {
        await pool.query(deleteAllUsersQuery);
        console.log('deleted all users from table');
    } catch (err) {
        console.error('error deleting all users: ', err);
    }
}

async function addBaseUser() {
    const query = 
    `
        INSERT INTO users (first_name, last_name, username, password, membership_status, admin_status)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = ['Mihir', 'Singh', 'mihirsingh', 'Tennis0817*', 'yes', 'yes'];
    try {
        await pool.query(query, values);
    } catch (err) {
        console.log("error adding base user: ", err);
    }
}


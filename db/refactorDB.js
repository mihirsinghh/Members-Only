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

recreateMessages();
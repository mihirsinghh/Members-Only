const pool = require('./pool');

//submits user info to database
async function postUser(firstName, lastName, username, password) {
    const insertQuery = `
        INSERT INTO users (first_name, last_name, username, password, membership_status, admin_status)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [firstName, lastName, username, password, "yes", "yes"];
    await pool.query(insertQuery, values);
}

async function getUser(username) {
    const getUserQuery = `
        SELECT * FROM users 
        WHERE username = $1;
    `
    const rows = await pool.query(getUserQuery, [username]);
    const user = rows[0];
    return user;
}

async function getUserByID(userID) {
    const getUserQuery = `
        SELECT * FROM users
        WHERE id = $1;
    `
    const rows = pool.query(getUserQuery, [userID]);
    const user = rows[0];
    return user;
}

module.exports = {
    getUser,
    getUserByID,
    postUser,
};

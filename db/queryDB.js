const pool = require('./pool');

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
};

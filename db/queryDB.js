const pool = require('./pool');

//submits user info to database
async function postUser(firstName, lastName, username, password) {
    const insertQuery = `
        INSERT INTO users (first_name, last_name, username, password, membership_status, admin_status)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [firstName, lastName, username, password, "no", "no"];
    try {
        await pool.query(insertQuery, values);
    } catch (err) {
        throw new Error('internal server error');
    }
}

async function validateUniqueness(username) {
    const validateQuery = `
        SELECT * FROM users WHERE username = $1;
    `
    const values = [username];
    const rows = await pool.query(validateQuery, values);
    if (rows.length != 0) {
        throw new Error('Username already exists');
    }
}


module.exports = {
    postUser,
    validateUniqueness
};

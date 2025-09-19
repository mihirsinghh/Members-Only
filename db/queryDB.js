const pool = require('./pool');

async function getUser(username) {
    try {
        const query = `SELECT * FROM users WHERE username = $1`;
        return await pool.query(query, [username]);

    } catch(err) {
        console.log("username does not exist in db", err);
        throw err; // Re-throw the error so it bubbles up to the controller
    }
}

async function getUserByID(id) {
    try {
        const query = `SELECT * FROM users WHERE id = $1`;
        return await pool.query(query, [id]);
    } catch(err) {
        console.log("error fetching user by id: ", err);
        throw err; // Re-throw the error so it bubbles up to the controller
    }
}

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
    const result = await pool.query(validateQuery, values);
    if (result.rowCount == 0) {
        return true;
    }
    return false;
}

async function validatePostUniqueness(author, title) {
    const validateQuery = `
        SELECT * FROM messages WHERE author = $1 AND title = $2
    `;
    try {
        const queryResult = await pool.query(validateQuery, [author, title]);
        const existingRows = queryResult.rowCount;
        console.log('a post with this title and author combo already exists in the database this many times: ', existingRows);
        if (existingRows > 0) {
            return false; 
        }
        return true; 
    } catch (error) {
        console.log('error validating post uniqueness: ', error);
        throw (error);
    }
}

async function submitPostInfo(title, text, author) {
    const query = `
        INSERT INTO messages (title, text, author)
        VALUES ($1, $2, $3)
    `;
    pool.query(query, [title, text, author])
        .then(() => { console.log('updated database table with post info') })
        .catch((err) => {
            console.log('error submitting post info to table: ', err);
            throw (err);
    });
}

//retrieve all posts from the table (newest posts first)
async function getAllPosts() {
    const query = `
        SELECT * FROM messages
        ORDER BY created_at DESC
    `;
    return await pool.query(query);
}

//get specific post
async function getPost(author, title) {
    const query = `
        SELECT * FROM messages WHERE author = $1 AND title = $2;
    `
    try {
        return await pool.query(query, [author, title]);
    } catch (err) {
        console.log('error fetching post from table');
        throw (err);
    }
}

async function updateUserMembershipStatus(userID) {
    console.log("updating user membership status for user with id: ", userID);
    const query = `
        UPDATE users 
        SET membership_status = 'yes' 
        WHERE id = $1
    `;
    try {
        await pool.query(query, [userID]);
        console.log("Successfully updated membership status to 'yes' for user ID:", userID);
    } catch (err) {
        console.log("Error updating user membership status:", err);
        throw err;
    }
}

//checks the admin_status value of the tuple corresponding to userID
async function checkAdminStatus(userID) {
    console.log("checking admin status for user with id: ", userID);
    const query = `
        SELECT admin_status FROM users WHERE id = $1
    `;
    try {
        const result = await pool.query(query, [userID]);
        if (result.rows.length > 0) {
            const adminStatus = result.rows[0].admin_status;
            console.log("Admin status for user ID", userID, ":", adminStatus);
            return adminStatus === 'yes';
        }
        return false;
    } catch (err) {
        console.log("Error checking admin status:", err);
        throw err;
    }
}

async function updateAdminStatus(userID) {
    const query = `
        UPDATE users
        SET admin_status = 'yes'
        WHERE id = $1
    `;
    try {
        await pool.query(query, [userID]);
    } catch (err) {
        console.log("error updating admin status for user");
        throw err;
    }
}


module.exports = {
    postUser,
    validateUniqueness,
    validatePostUniqueness,
    getUser,
    getUserByID,
    submitPostInfo,
    getAllPosts,
    getPost,
    updateUserMembershipStatus,
    updateAdminStatus,
    checkAdminStatus
};

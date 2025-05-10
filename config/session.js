const session = require('express-session'); //module that creates session data for each user
const pgSession = require('connect-pg-simple')(session); //module that allows us to save session data in a database
const pool = require('../db/pool'); //connection to database

const sessionMiddleware = session ({
    store: new pgSession({
        pool: pool,
        tableName: session,
    }),
    secret: 'cats',
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
});

module.exports = sessionMiddleware;

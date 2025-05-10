const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../db/queryDB');

//define how to authenticate the user's credentials
const strategy = new LocalStrategy(async(username, password, done) => {
    try {
        const user = db.getUser(username);
        if (!user) {
            done(null, false, {message: "Incorrect username"});
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            done(null, false, {message: "Incorrect password"});
        }
        return done(null, user);

    } catch(err) {
        console.log("Error authenticating user: ", err);
        done(err);
    }
});

//sets the user property of the current session object (userID in this case)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//if user property of current session is set, uses it to extract the full user and set the current requests' user property (req.user)
passport.deserializeUser(async (userID, done) => {
    try {
        const user = db.getUserByID(userID);
        if (!user) {
            done(null, false);
        }
        done(null, user);
    } catch(err) {
        console.log("Error fetching user: ", err);
    }
});

module.exports = strategy;

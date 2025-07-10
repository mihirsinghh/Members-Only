const db = require('../db/queryDB.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

function initializePassport(passport) {
    const strategy = new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await db.getUser(username);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);

    } catch(err) {
        console.log("error validating password: ", err);
        return done(err);
    }
});
    passport.use(strategy);
}

module.exports = {initializePassport};

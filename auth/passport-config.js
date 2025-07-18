// config/passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db/queryDB');

function initialize(passport) {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await db.getUser(username);
      const user = rows[0]; //set user only to the relevant part of the returned Query object
      console.log('user associated with username: ', user);

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      //const match = await bcrypt.compare(password, user.password);
      console.log('Comparing passwords: ', password, user.password);
      /*
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      */
      if (password != user.password) {
        console.log("incorrect password");
        return done(null, false, {message: "Incorrect password"});
      }

      console.log('credentials authenticated!');
      return done(null, user); //tells Passport that "user" is the object to work with during serialization

    } catch (err) {
      return done(err);
    }
  }));

  //tells passport what to store in the session if login is authenticated
  passport.serializeUser((user, done) => {
    console.log('serializing user..storing user ID in session with id: ', user.id);
    done(null, user.id); 
  });

  //if session found, this function is called
  //tells passport how to extract the users' info and what to set req.user as 
  passport.deserializeUser(async (id, done) => {
    try {
      const userQueryResult = await db.getUserByID(id);
      const user = userQueryResult.rows[0].username;
      done(null, user); //sets req.user = username

    } catch (err) {
      done(err);
    }
  });
}

module.exports = {
  initialize
};

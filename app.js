const express = require('express');
const app = express(); //create a new express server
const router = require('./routes/router');
const session = require("express-session"); 
const passport = require('passport');
const passportConfig = require('./auth/passport-config');
const path = require('path');

app.set("view engine", "ejs"); //views are generated on an embedded JavaScript template
app.use('/css', express.static(path.join(__dirname, 'public'))); // Static file middleware - 
app.use(session(
    { secret: "cats", 
      resave: false,
      saveUninitialized: false }
));
app.use(passport.initialize()); //uses middleware to set req.passport on all incoming requests
app.use(passport.authenticate('session')); //uses middleware to authenticate the current session - if user is present, sets req.user 
app.use(express.urlencoded({extended: false})); //middleware that allows the app to read form data
app.use("/", router);  

passportConfig.initialize(passport);

app.listen(3000, () => console.log("app listening on port 3000"));

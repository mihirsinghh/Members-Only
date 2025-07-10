const express = require('express');
const app = express(); //create a new express server
const router = require('./routes/router');
const session = require("express-session"); 
const passport = require('passport');
const passportConfig = require('./auth/passport-config');

app.set("view engine", "ejs"); //views are generated on an embedded JavaScript template

app.use(passport.initialize()); //uses middleware to set req.passport
app.use(passport.session()); //uses middleware to persist login - retrieves session data. If user present, sets req.user
app.use(session({ secret: "cats", resave: false, saveUninitialized: false })); //uses session storage to store session data under a session ID
app.use(express.urlencoded({extended: false})); //allows the app to read form data
app.use("/", router);  

passportConfig.initializePassport(passport);

app.listen(3000, () => console.log("app listening on port 3000"));

const db = require('../db/queryDB.js');
const passport = require('passport');
const authFlow = require('../config/authenticationFlow.js');

passport.use(authFlow.strategy);

function loadHomePage(req, res) {
    res.render("homePage.ejs");
}

module.exports = {
    loadHomePage,
};

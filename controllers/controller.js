const db = require('../db/queryDB.js');

function loadHomePage(req, res) {
    res.render("homePage.ejs");
}

function loadSignUpForm(req, res) {
    res.render("signUpForm.ejs");
}

module.exports = {
    loadHomePage,
    loadSignUpForm,
};


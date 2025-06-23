const db = require('../db/queryDB.js');

function loadHomePage(req, res) {
    res.render("homePage.ejs");
}

function loadSignUpForm(req, res) {
    res.render("signUpForm.ejs");
}

function loadLoginPage(req, res) {
    res.render("login-page.ejs");
}

module.exports = {
    loadHomePage,
    loadSignUpForm,
    loadLoginPage,
};


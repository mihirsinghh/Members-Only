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

async function processSignup(req, res) {
    try {
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const username = req.body.username;
        const password = req.body.password;
        
        await db.postUser(firstName, lastName, username, password);
        console.log("user info posted to db");
    } catch(error) {
        console.log("error submitting user info", error);
        res.status(500);
    }
}


module.exports = {
    loadHomePage,
    loadSignUpForm,
    loadLoginPage,
    processSignup,
};


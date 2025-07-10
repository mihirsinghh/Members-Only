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
        
        await db.validateUniqueness(username);
        await db.postUser(firstName, lastName, username, password);
        console.log("user info posted to db");

    } catch(error) {
        if (error.message === "Username already exists") {
            res.status(400).send(error.message);
        } else {
            console.log('error posting credentials to database');
            res.status(500).send(error.message);
        }
    }
}

module.exports = {
    loadHomePage,
    loadSignUpForm,
    loadLoginPage,
    processSignup,
};

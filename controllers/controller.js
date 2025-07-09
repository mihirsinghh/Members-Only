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
        if (error.message === "Username is already taken") {
            res.status(400).send(error.message);
        } else {
            console.log('error posting credentials to database');
            res.status(500).send(error.message);
        }
    }
}

async function processLogin(req, res) {
    const correctSecretCode = "secretcodehehe";
    try {
        //fetch user input from form
        const username = req.body.username;
        const password = req.body.password;
        //if secret code inputted, check
        if (req.body.secretcode) {
            const userSecretCode = req.body.secretcode;
        }
        //check if username + pwd combo exists in db


        //if valid credentials and correct code, load messages page with authors
        //if valid credentials and incorrect code, load regular messages page
        //if invalid credentials, return to login page
    } catch(err) {
    
    }
}


module.exports = {
    loadHomePage,
    loadSignUpForm,
    loadLoginPage,
    processSignup,
    processLogin
};


const db = require('../db/queryDB.js');

function loadHomePage(req, res) {
    //console.log('current user:', req.user.rows[0].username);
    console.log('Accessing home page as: ', req.user);
    res.render("homePage.ejs");
}

function loadSignUpForm(req, res) {
    console.log('Accessing signup page as:', req.user);
    res.render("signUpForm.ejs");
}

function loadLoginPage(req, res) {
    //console.log('current user:', req.user.rows[0].username);
    console.log('Accessing login page as: ', req.user);
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

function loadMessageBoard(req, res, next) {
    console.log('Viewing message board as: ', req.user);
    res.render('messageBoard.ejs');
}

module.exports = {
    loadHomePage,
    loadSignUpForm,
    loadLoginPage,
    processSignup,
    loadMessageBoard,
};

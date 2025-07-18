const db = require('../db/queryDB.js');
const { getRelativeTime } = require('../utils/timeUtils.js');

function loadHomePage(req, res) {
    console.log('Accessing home page as: ', req.user);
    res.render("homePage.ejs", { user: req.user });
}

function loadSignUpForm(req, res) {
    const error = req.query.error;
    console.log('Accessing signup page as:', req.user);
    res.render("signUpForm.ejs", {error: error});
}

function loadLoginPage(req, res) {
    console.log('Accessing login page as: ', req.user);
    res.render("login-page.ejs");
}

async function processSignup(req, res) {
    try {
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const username = req.body.username;
        const password = req.body.password;
        
        const isUsernameUnique = await db.validateUniqueness(username);
        if (isUsernameUnique) {
            await db.postUser(firstName, lastName, username, password);
            console.log("user info posted to db");
            res.redirect("/");
        } else {
            res.redirect("sign-up/?error=duplicate");
        }

    } catch (error) {
        console.log('error processing signup', error);
        res.status(500).send(error.message);
    }
}

async function loadMessageBoard(req, res, next) {
    console.log('Viewing message board as: ', req.user);
    console.log("Fetching all messages from table...");
    const queryResult = await db.getAllPosts();
    //create a new array of post objects, where each post object maintains its original attributes,
    //but a new attribute "relativeTime" gets added to each object
    const allPosts = queryResult.rows.map(post => ({
        ...post,
        relativeTime: getRelativeTime(post.created_at)
    }));
    //fetch user object from DB
    const userObject = await db.getUser(req.user);
    //check membership status
    const member = userObject.rows[0].membership_status;
    //render message board accordingly
    if (member === "yes") {
        res.render('messageBoard.ejs', { user: req.user, posts: allPosts, isMember: true});
    } else {
        res.render('messageBoard.ejs', { user: req.user, posts: allPosts, isMember: false});
    }
}

function loadCreatePostForm(req, res, next) {
    console.log("Viewing post-creation form as: ", req.user);
    const error = req.query.error;
    res.render('createPostForm.ejs', { error: error });
}

async function submitPost(req, res, next) {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const author = req.user;
        console.log('validating post uniqueness...');
        const valid = await db.validatePostUniqueness(author, title);
        if (valid) {
            console.log(`Submitting post with 
            title: ${title}, 
            content: ${content}, 
            author: ${author}`);
            await db.submitPostInfo(title, content, author);
            res.redirect("/message-board");
        } else {
            res.redirect("/create-post?error=duplicate");
        }
       
    } catch (err) {
        console.log("error handling post: ", err);
    }
}

async function loadPost(req, res) {
    const author = req.params.author;
    const title = req.params.title;
    try {
        const queryResult = await db.getPost(author, title);
        console.log("loading post with following info: ", queryResult.rows[0]);
        const postAuthor = queryResult.rows[0].author;
        const postTitle = queryResult.rows[0].title;
        const postText = queryResult.rows[0].text;
        const timestamp = queryResult.rows[0].created_at;
        const relativeTime = getRelativeTime(timestamp);
        res.render("viewPost.ejs", {
            user: req.user,
            postInfo: {
                author: postAuthor,
                title: postTitle,
                text: postText,
                time: relativeTime
        } });
    } catch (error) {
        console.log('error: ', error);
        res.status(400).send('error loading post');
    }
}

function loadMembershipPage(req, res) {
    const error = req.query.error;
    res.render("membershipPage.ejs", {user: req.user, error: error});
}

async function validateMembership(req, res) {
    const inputtedCode = req.body.secretcode;
    const correctCode = "hahaha";
    try {
        if (inputtedCode == correctCode) {
            const getUserObject = await db.getUser(req.user);
            const userID = getUserObject.rows[0].id;
            await db.updateUserMembershipStatus(userID);
            console.log(`successfully made user: ${req.user} with id: ${userID} a member!`);
            res.redirect("/message-board");
        } else {
            res.redirect("/become-member?error=incorrect");
        }
    } catch (err) {
        console.log("error: ", err);
        res.status(400).send('error updating membership status');
    }
}


module.exports = {
    loadHomePage,
    loadSignUpForm,
    loadLoginPage,
    processSignup,
    loadMessageBoard,
    loadCreatePostForm,
    submitPost,
    loadPost,
    loadMembershipPage,
    validateMembership
};

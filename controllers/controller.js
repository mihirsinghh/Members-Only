const db = require('../db/queryDB.js');
const { getRelativeTime } = require('../utils/timeUtils.js');

async function loadHomePage(req, res) {
    //check if user is member and render accordingly
    if (req.user) {
        console.log('Accessing home page as: ', req.user);
        const userObject = await db.getUser(req.user);
        const userID = userObject.rows[0].id;
        const isMember = await db.checkMembershipStatus(userID);
        const isAdmin = await db.checkAdminStatus(userID);
        if (isAdmin) {
            res.render("homePage.ejs", {user: req.user, isMember: true, isAdmin: true});
        } else if (isMember) {
            res.render("homePage.ejs", {user: req.user, isMember: true, isAdmin: false});
        } else {
            res.render("homePage.ejs", {user: req.user, isMember: false, isAdmin: false});
        }

    } else {
        console.log("Accessing homepage as guest user");
        res.render("homePage.ejs", {user: null, isMember: null});
    }
}

function loadSignUpForm(req, res) {
    const error = req.query.error;
    const signupSuccess = req.query.success;
    console.log('Accessing signup page as:', req.user);
    res.render("signUpForm.ejs", {error: error, success: signupSuccess});
}

function loadLoginPage(req, res) {
    const error = req.query.error;
    res.render("login-page.ejs", {error: error});
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
            res.redirect("sign-up/?success=true");
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
    //if user is logged in, fetch details and render message board accordingly
    if (req.user) {
        const userObject = await db.getUser(req.user);
        const member = userObject.rows[0].membership_status;
        const admin = userObject.rows[0].admin_status;
        if (member === "yes") {
            if (admin == 'yes') {
                res.render('messageBoard.ejs', { user: req.user, posts: allPosts, isMember: true, admin: true});
            } else {
                res.render('messageBoard.ejs', { user: req.user, posts: allPosts, isMember: true, admin: null});
            }
        } else {
            res.render('messageBoard.ejs', { user: req.user, posts: allPosts, isMember: false, admin: null});
        }
    //if no user logged in, render message board accordingly
    } else {
        res.render('messageBoard.ejs', { user: null, posts: allPosts, isMember: null, admin: null});
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
        
        // Validate that title and content are not empty
        if (!title || title.trim() === '') {
            console.log('Post submission rejected: empty title');
            return res.redirect("/create-post?error=emptytitle");
        }
        
        if (!content || content.trim() === '') {
            console.log('Post submission rejected: empty content');
            return res.redirect("/create-post?error=emptycontent");
        }
        
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
    //obtain post info
    const author = req.params.author;
    const title = req.params.title;

    const queryResult = await db.getPost(author, title);
    const postAuthor = queryResult.rows[0].author;
    const postTitle = queryResult.rows[0].title;
    const postText = queryResult.rows[0].text;
    const timestamp = queryResult.rows[0].created_at;
    const relativeTime = getRelativeTime(timestamp);


    //if user logged in, check membership status and load post accordingly
    if (req.user) {
        const userObject = await db.getUser(req.user);
        const member = userObject.rows[0].membership_status;
        if (member === 'yes') {
            res.render("viewPost.ejs", {
                user: req.user,
                postInfo: {
                    author: postAuthor,
                    title: postTitle,
                    text: postText,
                    time: relativeTime
                },
                isMember: true
            });
        } else {
            res.render("viewPost.ejs", {
            user: req.user,
            postInfo: {
                    title: postTitle,
                    text: postText,
                    time: relativeTime
                },
                isMember: false
            });
        }
    } else {
        res.render("viewPost.ejs", {
            user: req.user,
            postInfo: {
                title: postTitle,
                text: postText,
                time: relativeTime
            },
            isMember: false
        });
    }
}

function loadMembershipPage(req, res) {
    const error = req.query.error;
    res.render("membershipPage.ejs", {user: req.user, error: error});
}

async function validateMembership(req, res) {
    // Check if user is logged in first
    if (!req.user) {
        console.log('No user logged in, redirecting to membership page with error');
        return res.redirect("/become-member?error=nouserloggedin");
    }

    const inputtedCode = req.body.secretcode;
    const correctCode = "hahaha";

    if (inputtedCode === correctCode) {
        //check if user is already a member
        //if so, load message board without updating membership status. Else, update status first.
        const getUserObject = await db.getUser(req.user);
        const userID = getUserObject.rows[0].id;
        const alreadyMember = await db.checkMembershipStatus(userID);

        if (alreadyMember) {
            console.log(`user ${req.user} already a member. Loading message board...`);
            res.redirect("/message-board");
        } else {
            try {
                await db.updateUserMembershipStatus(userID);
                console.log(`successfully made user: ${req.user} with id: ${userID} a member!`);
                res.redirect("/message-board");
            } catch (err) {
                console.log("error: ", err);
                res.status(400).send('error updating membership status');
            }
        }

    } else {
        res.redirect("/become-member?error=incorrect");
    }
}

function getAdminPage(req, res){
    const error = req.query.error;
    const admin = req.query.admin;
    res.render("adminPage.ejs", {user: req.user, error: error, admin: admin});
}

async function validateAdmin(req, res) {
    // Check if user is logged in first
    if (!req.user) {
        console.log('No user logged in, redirecting to admin page with error');
        return res.redirect("/admin?error=nouserloggedin");
    }

    const inputtedPasscode = req.body.adminpasscode;
    const correctAdminPasscode = "trustmeiamanadmin";

    if (inputtedPasscode === correctAdminPasscode) {
        const getUserObject = await db.getUser(req.user);
        const userID = getUserObject.rows[0].id;

        //ensure user is a member
        const isMember = await db.checkMembershipStatus(userID);
        if (!isMember) {
            console.log(`user ${req.user} is not a member. Redirecting back to sign-in...`)
            res.redirect("/admin?error=notamember");
        }

        //check if user is already an admin
        //if so, load message board without updating admin status. Else, update status first.
        const alreadyAdmin = await db.checkAdminStatus(userID);

        if (alreadyAdmin) {
            console.log(`user ${req.user} already an admin. Loading message board...`);
            res.redirect("/message-board?admin=true");
        } else {
            try {
                await db.updateAdminStatus(userID);
                console.log(`successfully validated user ${req.user} with id: ${userID} as an administrator`);
                res.redirect("/message-board?admin=true");
            } catch (err) {
                console.log("error: ", err);
                res.status(400).send('error validating admin status');
            }
        }

    } else {
        res.redirect("/admin?error=incorrect");
    }
}

async function deletePost(req, res) {
    try {
        const author = req.params.author;
        const title = req.params.title;
        
        console.log(`Admin ${req.user} attempting to delete post "${title}" by ${author}`);
        
        await db.deletePost(author, title);
        console.log(`Successfully deleted post "${title}" by ${author}`);
        
        res.redirect('/message-board');
    } catch (err) {
        console.log("Error deleting post:", err);
        res.status(500).send('Error deleting post');
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
    validateMembership,
    getAdminPage,
    validateAdmin,
    deletePost
};

const {Router} = require('express'); //extracts Router constructor from express module
const router = Router(); //creates new Router object so that routes can be exported
const controller = require('../controllers/controller.js');
const passport = require('passport');

router.get("/", controller.loadHomePage);
router.get("/sign-up", controller.loadSignUpForm);
router.post("/sign-up", controller.processSignup);
router.get("/log-in", controller.loadLoginPage);
router.post("/log-in", authMiddleware, passport.authenticate('local', {successRedirect: '/message-board', failureRedirect: '/log-in?error=incorrectlogininfo'}));
router.post("/log-out", logoutMiddleware, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
router.get('/message-board', controller.loadMessageBoard);
router.get('/create-post', controller.loadCreatePostForm);
router.post('/submit-post', controller.submitPost);
router.get('/view-post/:author/:title', controller.loadPost);
router.get("/become-member", controller.loadMembershipPage);
router.post("/validate-member", controller.validateMembership);
router.get("/admin", controller.getAdminPage);
router.post("/validate-admin", controller.validateAdmin);
router.post("/delete-post/:author/:title", controller.deletePost);

function authMiddleware(req, res, next) {
    console.log('authenticating credentials...');
    next();
}

function logoutMiddleware(req, res, next) {
    console.log('logging out...');
    next();
}

module.exports = router;

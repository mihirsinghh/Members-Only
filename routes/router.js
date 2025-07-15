const {Router} = require('express'); //extracts Router constructor from express module
const router = Router(); //creates new Router object so that routes can be exported
const controller = require('../controllers/controller.js');
const passport = require('passport');

router.get("/", controller.loadHomePage);
router.get("/sign-up", controller.loadSignUpForm);
router.post("/sign-up", controller.processSignup);
router.get("/log-in", controller.loadLoginPage);
router.post("/log-in", authMiddleware, passport.authenticate('local', {successRedirect: '/message-board', failureRedirect: '/log-in'}));
router.post("/log-out", logoutMiddleware, (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
router.get('/message-board', controller.loadMessageBoard);

function authMiddleware(req, res, next) {
    console.log('authenticating credentials...');
    next();
}

function logoutMiddleware(req, res, next) {
    console.log('logging out...');
    next();
}

module.exports = router;

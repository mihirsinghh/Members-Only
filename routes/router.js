const {Router} = require('express'); //extracts Router constructor from express module
const router = Router(); //creates new Router object so that routes can be exported
const controller = require('../controllers/controller.js'); 

router.get("/", controller.loadHomePage);
router.get("/sign-up", controller.loadSignUpForm);
router.post("/sign-up", controller.processSignup);
router.get("/log-in", controller.loadLoginPage);

module.exports = router;

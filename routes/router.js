const {Router} = require('express'); //extracts Router constructor from express module
const router = Router(); //creates new Router object so that routes can be exported
const controller = require('../controllers/controller.js'); 

router.get("/", controller.loadHomePage); //when the client sends a GET request to fetch some data from the server, the request is routed to the controller, which handles loading the home page
router.get("/sign-up", controller.loadSignUpForm); //load the signup form when requested

module.exports = router;

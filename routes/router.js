const {Router} = require('express'); //extracts Router constructor from express module
const router = Router(); //creates new Router object so that routes can be exported
const controller = require('./controllers/controller.js');

router.get("/", controller.loadHomePage);
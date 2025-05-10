const express = require('express');
const app = express();
const router = require('./routes/router');
const sessionMiddleware = require('./config/session');

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(sessionMiddleware);
app.use("/", router);


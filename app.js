const express = require('express');
const app = express(); //create a new express server
const router = require('./routes/router'); 

app.set("view engine", "ejs"); //views are generated on an embedded JavaScript template

app.use(express.urlencoded({extended: false})); //allows the app to read form data
app.use("/", router);  

app.listen(3000, () => console.log("app listening on port 3000"));

require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption");


const app = express();
const port = 3000;

// console.log(process.env.API_KEY)


app.use(express.static("public"));
app.set("view engine", ejs);
app.use(bodyparser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true });


const UserSchema = new mongoose.Schema( {
    email: String,
    password: String
});



UserSchema.plugin(encrypt, {secret:process.env.API_KEY,encryptedFields: ['password'] });



const User = new mongoose.model("user", UserSchema);


app.get("/", function (req, res) {
    res.render("home.ejs")
});

app.get("/login", function (req, res) {
    res.render("login.ejs")
});


app.get("/register", function (req, res) {
    res.render("register.ejs")
});

app.post("/register", function (req, res) {

    console.log(req.body.username, req.body.password);
    const new1 = new User({
        email: req.body.username,
        password: req.body.password
    });



    new1.save()
        .then(() => {
            res.render("secrets.ejs")
        })
        .catch((err) => {
            console.error(err);

        })
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body.username, req.body.password);

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets.ejs");
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
});


app.listen(3000, function () {
    console.log("app listening on port: 3000");
});

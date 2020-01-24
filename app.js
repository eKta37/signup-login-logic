var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var Passport = require("passport");
var PassportLocal = require("passport-local");
var User = require("./models/user");

//seedDB();
var app = express();
mongoose.connect("mongodb://localhost/demo");
app.use(bodyParser.urlencoded({extended: true}));

//var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Smart India Hackathon",
    resave: false,
    saveUninitialized: false
}));
app.use(Passport.initialize());
app.use(Passport.session());

Passport.use(new PassportLocal(User.authenticate()));
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser());


//=================================================================================================
//BASIC ROUTES
//=================================================================================================
//root route
app.get("/", function (req, res) {
    res.render("landing");
});

//secret page
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/error", function(req, res){
    res.render("error");
});


//=================================================================================================
//AUTHENTICATION ROUTES
//=================================================================================================
//REGISTER
//index route
app.get("/signup", function(req, res){
    res.render("signup");
});

//post route
app.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        Passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN
//index route
app.get("/login", function(req, res){
    res.render("login");
});

//post route
app.post("/login",Passport.authenticate("local", 
    {
        successRedirect: "/secret", 
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT
//index route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/error");
}

let port = 1528;
app.listen(port, function () {
    console.log("server gets started!!");
});
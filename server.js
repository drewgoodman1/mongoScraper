//dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//access to Note and Article
//var Note = require("./models/Note.js");
//var Article = require("./models/Article.js");
var db = require("./models");

//set up mongoose to use ES6 promises
mongoose.Promise = Promise;

//heroku or local
var PORT = process.env.PORT || 3000;

//initialize Express
var app = express();

app.use(logger("dev")) 
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static("public"));

//set handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB with Mongoose
mongoose.connect("mongodb://localhost/nytDataBase", { useNewUrlParser: true });

/*db.on("error", function(error) {
    console.log("Mongoose error: ", error);
});
db.once("open", function() {
    console.log("connected to MongoDB");
});*/

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});

//routes

//get request to render handlebars pages
app.get("/", function(req, res) {
    db.Article.find({"saved": false}, function(error, data) {
        var hbsObject = {
            article: data
        };
    });
    console.log("Home" + hbsObject);
    res.render("home", hbsObject);
});

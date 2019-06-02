var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ 
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

 
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost/nytimesDB", { useNewUrlParser: true });
mongoose.connect("mongodb://heroku_9gdgkfhb:5ucu6r92e17jkfsj4sq9vn5i43@ds261616.mlab.com:61616/heroku_9gdgkfhb");
// Routes

///GET request to render Handlebars pages
app.get("/", function(req, res) {
    db.Article.find({"saved": false}, function(error, data) {
        var hbsObject = {
            article: data
        };
    console.log(hbsObject);
    res.render("home", hbsObject);
    });
});

// A GET route for scraping the Reddoit/WebDev website
app.get("/scrape", function(req, res) {
    axios.get("http://www.nytimes.com/").then(function(response) {    
        var $ = cheerio.load(response.data);
        console.log($);
        
        $("article").each(function(i, element) {
            var result = {};
            result.title = $(this).find("h2").text();
            result.link = "https://www.nytimes.com" + $(this).find("a").attr("href");
            result.summary = $(this).find("p").text();
            //add article to db
            db.Article.create(result)            
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        // Send a message to the client
        res.send("Scrape Complete");
    });
});

//a GET route to render saved articles
app.get("/saved", function(req, res) {
    db.Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
        var hbsObject = {
            article: articles
        };
        res.render("saved", hbsObject);
    });
});

// a POST route to update the article's saved field to true
app.post("/articles/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
    .exec(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(doc);
        }
    });
});

// a POST route to change article's saved field to false
app.post("/articles/delete/:id", function(req, res) {
    // Use the article id to find and update its saved boolean
    db.Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false, "notes": []})
    .exec(function(err, doc) {
        if (err) {
        console.log(err);
        }
        else {
        res.send(doc);
        }
    });
});

// Delete an article
app.post("/articles/delete/:id", function(req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false, "notes": []})
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Create a new note
app.post("/notes/save/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new db.Note({
      body: req.body.text,
      article: req.params.id
    });
    console.log(req.body)
    // And save the new note the db
    newNote.save(function(error, note) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's notes
        db.Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "notes": note } })
        // Execute the above query
        .exec(function(err) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            // Or send the note to the browser
            res.send(note);
          }
        });
      }
    });
  });
  






// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
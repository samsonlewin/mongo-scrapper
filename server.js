/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */
require("dotenv").config();
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

var databaseUri = "mongodb://localhost/mongo_scrapper"

if(process.env.MONGODB_URI){
// Database configuration with mongoose
mongoose.connect(process.env.MONGODB_URI);
} else {
 mongoose.connect(databaseUri); 
};

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.lefigaro.fr", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("section").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).find("div").find("h2").find("a").text();
      result.link = $(this).find("div").find("h2").find("a").attr("href");


      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });

  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// html routes
  app.get("/saved", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/saved.html"));
  });


    app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:id", function(req, res) {
  // Grab every doc in the Articles array
  Article.findOneAndUpdate({ "_id": req.params.id },{$set:{saved:true}},function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:id", function(req, res) {

  if (req.body.saved === false){
  
  // Grab every doc in the Articles array
  Article.findOneAndUpdate({ "_id": req.params.id },{$set:{saved:true}},function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
  console.log("this is req",req.body)
  console.log("this is res",res.body)
    }
  });
} 

});

app.put("/articles/:id", function(req, res) {
    // Grab every doc in the Articles array
  Article.findOneAndUpdate({ "_id": req.params.id },{$set:{saved:false}},function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);

    }
  });

});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, {$push:{ "note": doc._id }})
      // Execute the above query
      .exec(function(err, doc) {
        console.log(doc)
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

app.post("/articles/:id"), function(req, res){
  console.log(req.params.id)
//  Article.findByIdAndUpdate({ "_id": req.params.id }, {$pull: { note:{ "_id": doc._id }}})
//  .exec(function(err,doc){
//    if(err){
//      console.log(err)
//    }
//    else{
//      res.send(doc)
//    }
//  })
}


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

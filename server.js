var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware


// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
  axios.get("https://www.latimes.com/").then(response => {
    function randomNum() { return Math.floor(Math.random()*4)}
    randomNum();
    var num = randomNum();
    const array = ["XSmall","Small","Medium","Large"];
    var $ = cheerio.load(response.data);
  
    var results = [];

    $(`.Promo${array[num]}-content`).each(function(i, element) {
    
    var title = $(this).find(`div.Promo${array[num]}-title`).children("a").text();
    var link = $(this).find(`div.Promo${array[num]}-title`).children("a").attr("href");
    
    var summary = $(this).children(`.Promo${array[num]}-description`).text()
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      summary: summary,
      isItSaved: false
    });
  });
   db.Article.create(results).then(function(dbArticle){
    res.json(dbArticle)
    })
    .catch(err => {
    console.log(err)
    })
  })
});
app.put("/api/headlines/:id",function(req,res){
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isItSaved: req.body.saved }, { new: true })
  .then(function(dbArticle){
    console.log(dbArticle)
  })
});
app.get("/articles",function(req,res){
  db.Article.find({})
  .then(function(dbArticle){
    res.json(dbArticle)
  })
})
app.get("/savedArticles",function(req,res){
  db.Article.find({isItSaved : true})
  .then(function(dbArticle){
    res.json(dbArticle)
  })
})
app.delete("/clear", function(req,res){
  db.Article.remove({})
  .then(console.log("Articles Cleared"))
})
  // Load index page
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
    });

  // Load example page and pass in an example by id
  app.get("/saved", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/saved.html"));
    });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
module.exports = app;
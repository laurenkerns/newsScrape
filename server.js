
//////////// Dependencies///////////////
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

//require all models
const db = require("./models");

const PORT = 3003;

// Initialize Express
const app = express();

//Log requests
app.use(logger("dev"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up a static folder (public) for web app
app.use(express.static("public"));


//////////Connect to Mongo Database///////////////
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true })
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

/////////ROUTES//////////////////

app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/arts/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article h2").each(function(i, element) {
      var result = {};
        result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// /////////////////GET Route for scraping Reddit///////////
// app.get("/scrape", (req, res) =>{
//   //grab html with axios
//   axios.get("http://www.echojs.com/").then(response => {
//     const $ = cheerio.load(response.data);
//     $("article h2").each((i, element) => {
//       const result = {};
//       result.title = $(element).children("a").text();
//       result.link = $(element).children().attr("href");

//   //create new article
//       db.Article.create(result)
//       .then(dbArticle => {
//         console.log(dbArticle);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//     });
//     res.send("Articles Scraped")
//   });
// });



// //////////////GET Route to pull articles from dbArticle/////////////
// app.get("/articles", (req, res) => {
//   db.Article.find({})
//     .then(dbArticle => {
//       res.json(dbArticle);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });


// /////////////Get Request to get specific Article/////////////////////////
// app.get("/articles/:id", (req, res) => {
//   db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//     .then(dbArticle => {
//       res.json(dbArticle);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });



// ///////////////Route to get note/////////////////
// app.post("/articles/:id", (req, res) => {
//   db.Note.create(req.body)
//     .then(dbNote => {
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(dbArticle => {
//       res.json(dbArticle);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });



///////////////////LISTEN///////////////////////////
app.listen(PORT, () => {
    // Log (server-side) when our server has started
    console.log(`Server listening on: http://localhost:${PORT}`);
  });





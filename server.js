
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
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true })
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

///////////////ROUTES//////////////////


////////Route to scrape NY TImes website /////////
app.get("/scrape", (req, res) => {
  axios.get("https://www.nytimes.com/section/arts/").then(response => {
    //load into cherro
    const $ = cheerio.load(response.data);
    //grab all H2's and links
    $("article h2").each((i, element) => {
      const result = {};
        result.title = $(element).children("a").text();
        result.link = $(element).children("a").attr("href");
      //create new article 
      db.Article.create(result)
        .then(dbArticle => {
          console.log(dbArticle);
        })
        .catch(err => {
          console.log(err);
        });
    });
    //redirect to homepage
    res.redirect('/')
  });
});



///////route to get all articles//////////
app.get("/articles", (req, res) => {
  db.Article.find({})
    .then(dbArticle => {
      res.json(dbArticle);
    })
    .catch(err => {
      res.json(err);
    });
});



/////route for saved articles///////
app.get("/saved", (req, res) => {
  db.Article.find({ "saved": true })   
    .then(dbArticle => {
      res.json(dbArticle);
    })
      .catch(err => {
        res.json(err);
      });
});




//////////route to get specific artice by id & add note///////////
app.get("/articles/:id", (req, res) => {
  db.Article.findOne({ _id: req.params.id })
  /////populate article with it's note
    .populate("note")
    .then(dbArticle => {
      res.json(dbArticle);
    })
    .catch(err => {
      res.json(err);
    });
});


////////route to save new note to article/////////
app.post("/articles/:id", (req, res) => {
  db.Note.create(req.body)
    .then(dbNote => {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(dbArticle => {
      res.json(dbArticle);
    })
    .catch(err => {
      res.json(err);
    });
});



///////////////////LISTEN///////////////////////////
app.listen(PORT, () => {
    // Log (server-side) when our server has started
    console.log(`Server listening on: http://localhost:${PORT}`);
  });





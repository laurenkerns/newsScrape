//////////// Dependencies///////////////
const express = require("express");
const mongojs = require("mongojs");
// const PORT = process.env.PORT || 8080;
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Set up a static folder (public) for web app
app.use(express.static("public"));



/////////////handelbars/////////////////////
// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



//////////Connect to Mongo Database///////////////
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Use mongojs to hook the database to the db variable**************not sure ho to use mongoose yet
// const db = 


///////////////////ROUTES/////////////////////////
// Import routes and give the server access to them.
const routes = require("./controllers/news_controllers");

app.use(routes);

///////////////////LISTEN///////////////////////////
app.listen(PORT, () => {
    // Log (server-side) when our server has started
    console.log(`Server listening on: http://localhost:${PORT}`);
  });





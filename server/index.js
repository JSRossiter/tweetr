"use strict";

// Basic express setup:
require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const {MongoClient} = require("mongodb");
const MONGODB_URI   = process.env.MONGODB_URI;
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['its_a_secret'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of tweets. It's a basic object with an array in it.

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  const DataHelpers = require("./lib/data-helpers.js")(db);
  const UserHelpers = require(".lib/user-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers, UserHelpers);
  const loginRoutes = require("./routes/login")(UserHelpers);
  app.use("/tweets", tweetsRoutes);
  app.use("/", loginRoutes);
});
// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.

// Mount the tweets routes at the "/tweets" path prefix:

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

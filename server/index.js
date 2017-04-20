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


MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  const DataHelpers = require("./lib/data-helpers.js")(db);
  const UserHelpers = require("./lib/user-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers, UserHelpers);
  const loginRoutes = require("./routes/login")(UserHelpers);
  app.use("/tweets", tweetsRoutes);
  app.use("/", loginRoutes);
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

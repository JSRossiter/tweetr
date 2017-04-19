"use strict";
const ObjectId = require('mongodb').ObjectID

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));
      });
    },

    likeTweet: function(tweetId, val, callback) {
      db.collection("tweets").updateOne(
        { _id: new ObjectId("58f6836f169b4f6606ed4c3e") },
        { $inc: { likes: Number(val) } }
      );
      callback(null, true);
    }
  };
}

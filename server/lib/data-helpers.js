"use strict";

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

    likeTweet: function(tweetId, handle, callback) {
      db.collection("tweets").updateOne(
        { id: Number(tweetId) },
        { $addToSet: { likes: handle } }
      );
      callback(null, true);
    },

    unlikeTweet: function(tweetId, handle, callback) {
      db.collection("tweets").updateOne(
        { id: Number(tweetId) },
        { $pullAll: { likes: [handle] } }
      );
      callback(null, true);
    },

    getLikedTweets: function(handle, cb) {
      db.collection("tweets").find({ "likes": handle }).toArray((err, tweets) => {
        if (err) {
          return cb(err);
        }
        cb(null, tweets);
      });
    }
  };
};

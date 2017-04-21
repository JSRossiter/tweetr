"use strict";

const userHelper    = require("../lib/util/user-helper");
const {generateTweetId} = require("../lib/util/generate-tweet-id");

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers, UserHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    const getTweets = new Promise((resolve, reject) => {
      DataHelpers.getTweets(resolve, reject);
    });

    getTweets
      .then((tweets) => {
        res.json(tweets);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      })











    // DataHelpers.getTweets((err, tweets) => {
    //   if (err) {
    //     res.status(500).json({ error: err.message });
    //   } else {
    //     res.json(tweets);
    //   }
    // });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    UserHelpers.getUser(req.session.handle, (err, user) => {
      const tweet = {
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        id: generateTweetId(),
        likes: []
      };
      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send(tweet);
        }
      });
    });
  });

  tweetsRoutes.put("/", function(req, res) {
    if (req.body.like) {
      if (req.body.like.like) {
        DataHelpers.likeTweet(req.body.like.id, req.session.handle, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send();
          }
        });
      } else {
        DataHelpers.unlikeTweet(req.body.like.id, req.session.handle, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send();
          }
        });
      }
    } else {
      res.status(500).json({ error: err.message });
    }
  });

  return tweetsRoutes;
};

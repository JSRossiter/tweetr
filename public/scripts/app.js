/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 function createTweetElement (input) {
  const $tweet = $("<article>");
  const $header = $("<header>");
  const $avatar = $("<img>").addClass("avatar").attr("src", input.user.avatars.small);
  const $poster = $("<h2>").text(input.user.name);
  const $handle = $("<p>").text(input.user.handle);
  $header.append($avatar, $poster, $handle);

  const $div = $("<div>").addClass("tweet-content").text(input.content.text);

  const ageMinutes = Math.floor((Date.now() - input.created_at) / (1000 * 60));
  let ageStatement = ""
  if (ageMinutes === 0) {
    ageStatement = "Just now";
  } else if (ageMinutes < 60) {
    ageStatement = `${ageMinutes} minutes ago`;
  } else if (ageMinutes < 1440) {
    ageStatement = `${Math.floor(ageMinutes / 60)} hours ago`;
  } else {
    ageStatement = `${Math.floor(ageMinutes / 1440)} days ago`;
  }

  const $footer = $("<footer>");
  const $age = $("<p>").text(ageStatement);
  const $icons = $("<ul>").addClass("tweet-icons");
  const $flag = $("<li>").append($("<img>").attr("src", "images/flag.png"));
  const $retweet = $("<li>").append($("<img>").attr("src", "images/retweet.png"));
  const $heart = $("<li>").append($("<img>").attr("src", "images/heart.svg"));
  $icons.append($flag, $retweet, $heart);
  $footer.append($age, $icons);

  $tweet.append($header, $div, $footer);
  return $tweet;
 }

 function renderTweets (tweets) {
  for (var i = 0; i < tweets.length; i++) {
    $("#tweets-container").append(createTweetElement(tweets[i]));
  }
 }

var data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": Date.now() - 1000000
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": Date.now()
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


$(document).ready(function() {
  renderTweets(data);

})

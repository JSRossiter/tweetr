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
  let ageStatement = "";
  if (ageMinutes <= 0) {
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
  const $heart = $("<li>").append($("<img>").attr("src", "images/heart.svg").addClass("like-btn").click(likeButton));
  $icons.append($flag, $retweet, $heart);
  $footer.append($age, $icons);

  $tweet.append($header, $div, $footer);
  return $tweet;
}

function renderTweets (tweets) {
  $("article").remove();
  for (var i = 0; i < tweets.length; i++) {
    $("#tweets-container").prepend(createTweetElement(tweets[i]));
  }
}

function flashMessage (message) {
  const span = $("<span>").addClass("flash-message").text(message);
  $("form").append(span);
  span.slideDown(function() {
    setTimeout(function() {
      span.slideUp();
    }, 2000);
  });
}

function loadTweets () {
  $.ajax({
    url: "/tweets/",
    method: 'GET',
    success: renderTweets
  });
}

function postTweet (event) {
  event.preventDefault();
  const $tweet = $("textarea[name='text']");
  if (!$tweet[0].value) {
    flashMessage("You didn't type anything!");
  } else if ($tweet[0].value.length > 140) {
    flashMessage("Your tweet is too long!");
  } else {
    $.ajax({
      url: "/tweets/",
      method: "POST",
      data: $tweet.serialize(),
      success: function () {
        loadTweets();
        $tweet[0].value = "";
      }
    });
  }
}

function composeButton (event) {
  event.preventDefault();
  $(".new-tweet").slideToggle(function() {
    if (!$(".new-tweet").is(":hidden")) {
      $(".new-tweet textarea").focus();
    }
  });
}

function likeButton (event) {
  console.log("called");
  console.log(this);
  const val = $(this).hasClass("liked") ? -1 : 1;
  const liked = () => {
    $(this).toggleClass("liked");
  }
  $.ajax({
    url: "/tweets/",
    method: "PUT",
    data: {
      like: {
        id: "58f6836f169b4f6606ed4c3e",
        val: val
      }
    },
    success: liked
  });
}

$(document).ready(function() {
  loadTweets();
  $(".compose").click(composeButton);
  $("input[value='Tweet']").click(postTweet);
});

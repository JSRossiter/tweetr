function likeButton (event) {
  const poster = $(this).closest("article").find("p").first().text();
  if ($.data(document.body, "handle") && poster !== $.data(document.body, "handle")) {
    const val = $(this).hasClass("liked") ? "" : 1;
    const liked = () => {
      $(this).toggleClass("liked");
      let newLikes;
      const $counter = $(this).siblings(".like-count");
      if ($(this).hasClass("liked")) {
        newLikes = parseInt($counter.text(), 10) + 1;
      } else {
        newLikes = parseInt($counter.text(), 10) - 1;
      }
      $counter.text(newLikes);
    };
    const tweetId = $(this).closest("article").data("tweet-id");
    $.ajax({
      url: "/tweets/",
      method: "PUT",
      data: {
        like: {
          like: val,
          id: tweetId,
          handle: "jeff"
        }
      },
      success: liked
    });
  }
}

function createTweetElement (input) {
  const $tweet = $("<article>").data("tweet-id", input.id);
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
  const $flag = $("<li>").append($('<i class="fa fa-flag"></i> '));
  const $retweet = $("<li>").append($('<i class="fa fa-retweet"></i> '));
  const $heart = $("<li>").append($('<i class="fa fa-heart like-btn"></i>')).click(likeButton);
  const $likes = $("<li>").addClass("like-count").text(input.likes.length);
  if (input.likes.find((element) => {
    return element === $.data(document.body, "handle");
  })) {
    $heart.addClass("liked");
  }
  $icons.append($flag, $retweet, $heart, $likes);
  $footer.append($age, $icons);

  $tweet.append($header, $div, $footer);
  return $tweet;
}

function checkLogin () {
  $.ajax({
    url: "login",
    method: "GET",
    success: function(data) {
      if (data) {
        $("nav a").toggle(0);
        $(".logged-in-label").text("Logged in as");
        $(".logged-in").text(data);
        $.data(document.body, "handle", data);
      }
    },
    error: function(err) {
      $.ajax({
        url: "/logout",
        method: "POST"
      });
    }
  });
}

function logoutButton (event) {
  event.preventDefault();
  $.ajax({
    url: "/logout",
    method: "POST",
    success: function () {
      $(".logout").toggle(() => {
        $(".login, .register").toggle();
      });
      $(".logged-in-label, .logged-in").text("");
      $(".compose").toggle();
      $(".liked").removeClass("liked");
      $.data(document.body, "handle", null);
    }
  });
}

function renderTweets (tweets) {
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
    success: (data) => {
      $("article").remove();
      renderTweets(data);
    }
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
      success: function (data) {
        renderTweets([data]);
        $tweet[0].value = "";
        $(".counter").text(140);
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

$(document).ready(function() {
  checkLogin();
  loadTweets();
  $(".compose").click(composeButton);
  $("input[value='Tweet']").click(postTweet);
  $(".logout").click(logoutButton);
});

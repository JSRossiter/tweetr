function logoutButton (event) {
  event.preventDefault();
  $.ajax({
    url: "/logout",
    method: "POST",
    success: function () {
      $(".logout").toggle(() => {
        $(".login, .register").toggle();
      });
      $(".logged-in-label").text("");
      $(".compose, .logged-in").toggle();
      $(".liked").removeClass("liked");
      $.data(document.body, "handle", null);

    }
  });
}

$(() => {
  $(".logout").click(logoutButton)
});
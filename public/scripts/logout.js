function logoutButton (event) {
  event.preventDefault();
  $.ajax({
    url: "/logout",
    method: "POST",
    success: function () {
      $(".logout").toggle(() => {
        $(".login, .register").toggle();
      });
      $(".compose, .logged-in, .logged-in-label").toggle();
      $(".liked").removeClass("liked");
      $.data(document.body, "handle", null);

    }
  });
}

$(() => {
  $(".logout").click(logoutButton)
});
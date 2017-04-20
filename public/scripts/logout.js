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

    }
  });
}

$(() => {
  $(".logout").click(logoutButton)
});
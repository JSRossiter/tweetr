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

$(() => {
  $(".logout").click(logoutButton)
});
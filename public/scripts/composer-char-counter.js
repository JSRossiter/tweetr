$(document).ready(function() {
  let charCount = 140;
  $(".new-tweet textarea").on("keydown", function(event) {
    charCount = 140 - $(this).val().length;
    const counter = $(this).siblings(".counter");
    if (charCount < 0) {
      counter.addClass("invalid");;
    }
    counter.text(charCount);
    console.log(counter);
  })
})

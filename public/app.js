// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var container = $("<div>").addClass("article_container");
    var saveButton = $("<button data-id='" + data[i]._id + "'>Save Article</button>")
    saveButton.addClass("btn btn-default saveButton")

    container.append("<p style='font-weight:bold; cursor:pointer' data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
    container.append("<a data-id='" + data[i]._id + "' target='_blank' href='"+data[i].link+"'>Discover more on lefigaro.fr</a>");
    container.append( saveButton);
    $("#articles").append(container)
  }
});

$("#scrape").on("click",function(){
  $.get('/scrape', function(data){
      console.log("scrapped!");
  })
})

// Whenever someone clicks a p tag
$(document).on("click","button", function() {
  // Empty the notes from the note section
  //$("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId
  }).done(function(data){
    console.log(data);
  })
})
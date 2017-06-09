

$.getJSON("/articles", function(data) {
  for (var i=0; i<data.length; i++){
 if (data[i].saved === true){
  console.log(data[i])

var container = $("<div>").addClass("article_saved_container");
var noteButton = $("<a data-id='" + data[i]._id + "'>Add a note</a>")
var deleteButton = $("<a data-id='" + data[i]._id + "'>Delete from Saved</a>")
noteButton.addClass("btn btn-default noteButton")
deleteButton.addClass("btn btn-default deleteButton")

container.append("<p style='font-weight:bold; cursor:pointer' data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
container.append("<a data-id='" + data[i]._id + "' target='_blank' href='"+data[i].link+"'>Discover more on lefigaro.fr</a>");
container.append(deleteButton);
container.append(noteButton);

$("#savedArticles").append(container);

 }
}
});


$(document).on("click", "a.deleteButton", function() {
  var thisId = $(this).attr("data-id");
$.ajax({
  method: "PUT",
  url: "/articles/" + thisId,
}).done(function(data){
  console.log(data.saved);
})
});


$(document).on("click", "a.noteButton", function() {

var thisId = $(this).attr("data-id");

  $("#notes").empty();

// Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    //With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Save Note</button>");



      for (var i=0; i<data.note.length;i++){
      var theNote = $("<div></div>");
      theNote.addClass("theNote");
      theNote.addClass("panel panel-default");
      var theNoteTitle = $("<h2>");
      theNoteTitle.text(data.note[i].title);
      var theNoteBody = $("<p>");
      theNoteBody.text(data.note[i].body);
      theNote.append(theNoteTitle)
      theNote.append(theNoteBody)
      theNote.append("<button class='btn btn-default' data-id='" + data._id + "' id='deletenote'>Delete Note</button>");


      //Append a new note
      $("#notes").append(theNote);

      }
    });

  });



// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      //console.log(data.note);
      // Empty the notes section



    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId
  }).done(
    function(data){
    console.log("deleted!");
    $(".theNote").remove();
  })
})

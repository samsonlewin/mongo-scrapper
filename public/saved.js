

$.getJSON("/articles", function(data) {
  for (var i=0; i<data.length; i++){
 if (data[i].saved === true){
  console.log(data[i])

var container = $("<div>").addClass("article_saved_container");
var saveButton = $("<button data-id='" + data[i]._id + "'>Save Article</button>")
container.append("<p style='font-weight:bold; cursor:pointer' data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
container.append("<a data-id='" + data[i]._id + "' target='_blank' href='"+data[i].link+"'>Discover more on lefigaro.fr</a>");
$("#savedArticles").append(container);
 }
}


});
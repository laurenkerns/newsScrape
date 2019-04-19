////// Grab the articles as a json//////
$.getJSON("/articles", data => {
  for (let i = 0; i < data.length; i++) {
   
    ////// Display information on the page///////
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href=" + data[i].link + "> " + data[i].link + "</a> " + "<br />" +
      "<button class='waves-effect waves-light btn' id='noteBtn' data-id=" + data[i]._id + ">Article Notes</button>" +
      "<button class='waves-effect waves-light btn' id='save'  data-id=" + data[i]._id + ">Save Article</button>" +
      "<button class='waves-effect waves-light btn' id='delete'  data-id=" + data[i]._id + ">Delete Article</button>" + "</p>");
  }
});

/////ON CLICK FUNCTION for note button
$(document).on("click", "#noteBtn", function() {
  $("#notes").empty();
  // Save the id
  let thisId = $(this).attr("data-id");

  /////// ajax call for article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    /////// Add the note information to the page
    .then(function(data) {
      console.log(data);
      /////TITLE
      $("#notes").append("<h2>" + data.title + "</h2>");

      ///// An INPUT TO ENTER TITLE
      $("#notes").append("<input id='titleinput' name='title' >");

      ///// TEXT AREA
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      // SUBMIT BUTTON
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>"); ////add class

      //////IF NO NOTE
      if (data.note) {
        //PUT TITLE OF NOT IN PNPUT
        $("#titleinput").val(data.note.title);
        // PUT BODY OF NOTE IN TEXT
        $("#bodyinput").val(data.note.body);
      }
    });
});


/////ON CLICK SAVE NOTE  
  $(document).on("click", "#savenote", function() {
  // GRAB ID
  let thisId = $(this).attr("data-id");

  // POST REQUEST TO CHANGE NOTE
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      // EMPTY NOTES
      $("#notes").empty();
    });

  // REMOVE INPUT AREA
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



///////ON CLICK FUNCTION TO SAVE
$(document).on("click", "#save", function () {
  /////GRAB ID
  let thisId = $(this).attr("data-id");

  ////POST REQUEST TO UPDATE NOTE
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
  })
    .then(function (data) {
      // console.log(data);
    });
});



//////ON CLICK TO DELETE NOTE
$(document).on("click", "#delete", function () {
  let thisId = $(this).attr("data-id");
  
  //////reload the page 
  window.location.reload();

  ///////ajax delete request
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId, 
  }) 
    .then(function (data) {   
    });
});




////////GET SAVED ARTICLES
$.getJSON("/saved", function (data) {
  
  // For each one
  for (let i = 0; i < data.length; i++) {

    // DISPLAY SAVED ARTICLES AT BOTTOM
    $("#saved").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href=" + data[i].link + "> " + data[i].link + "</a> " + "<br />" +
        "<button class='waves-effect waves-light btn' id='noteBtn' data-id=" + data[i]._id + ">Article Notes</button>" +
        "<button class='waves-effect waves-light btn' id='delete'  data-id=" + data[i]._id + ">Delete Article</button>" + "</p>");
  }
});
  
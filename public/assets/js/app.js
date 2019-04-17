//////////Grab the articles as a json///////////
$.getJSON("/articles", data => {
    // For each one
    for (let i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href=" + data[i].link + "> " + data[i].link + "</a> " + "<br />" +
          "<button class='btn' id='note' data-id=" + data[i]._id + ">Article Notes</button>" +
          "<button class='btn' id='save'  data-id=" + data[i]._id + ">Save Article</button>" +
          "<button class='btn' id='delete'  data-id=" + data[i]._id + ">Delete Article</button>" + "</p>");
    }
  });
  
  ///////// On CLick note function///////////////
  $(document).on("click", "#note", function() {
    // Empty the notes 
    $("#notes").empty();
    // Save the id from the note id
    const thisId = $(this).attr("data-id");
  
    ///Article ajax call
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      /// append note information 
      .then(data => {
        console.log(data);
        // Title
        $("#notes").append("<h2>" + data.title + "</h2>");
        // Enter title
        $("#notes").append("<input id='titleinput' name='title' >");
        // Textarea
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // Submit Button
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        //insert note title & body in appended areas
        if (data.note) {
          $("#titleinput").val(data.note.title)
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // On Click function to save note
  $(document).on("click", "#savenote", function() {
    const thisId = $(this).attr("data-id");
  
  //ajax call to post inputs 
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(data => {
        console.log(data);
        $("#notes").empty();
      });
  
    // Empty input values 
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  //on click function to caputre data and post to #saved route
    $(document).on("click", "#save", function() {
      window.location.reload();
      let thisId = $(this).attr("data-id");

    //ajax call to post to #saved data
    $.ajax({
      method: "POST",
      url: "/saved" + thisId
    })
      .then(function(data) {
        console.log(data);
      });
    });

    $(document).on("click", "#delete", function (){
      let thisId = $(this).attr("data-id");
      console.log("delete sucessful");
      window.location.reload();

      $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
      })
        .then(function(data){
        });
    });

  //grab information and display in json
    $.getJSON("/saved", data => {
      for (let i = 0; i < data.length; i++){
        $("#saved").append("<p data-id='" + data[i]._id + "'>" +
      data[i].title + "<br />" +
      "<a href=" + data[i].link + "> " + data[i].link + "</a> " + "<br />" +
      "<button class='btn' id='noteBtn' data-id=" + data[i]._id + ">Article Notes</button>" +
      "<button class='btn' id='delete'  data-id=" + data[i]._id + ">Delete Article</button>" + "</p>");
      } 
 
      console.log(data)
    });

  
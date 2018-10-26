// Initial array of gif
// global var
var gifList = ["the office", "motivation", "the it crowd", "laugh"];
var gifLimitPerCall = 10;

// Function for dumping the JSON content for each button into the div
function displayMovieInfo() {
  //get the data name of the button
  var gifName = $(this).attr("data-name");
  getGif(gifName);
}

//toggles between the gif and the still when user clicks on the gif
function playGif() {
  var gifStill = $(this).attr("data-gif-still");
  var gif = $(this).attr("data-gif");

  if ($(this).attr("src") !== gifStill) {
    $(this).attr("src", gifStill);
  } else {
    $(this).attr("src", gif);
  }
}

function getGif(gifName) {
  //create the queryURL using the gifName
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    gifName +
    "&api_key=kGOO42dDHjBstMYP3bEXkTG3g9nUihvo&limit=" +
    gifLimitPerCall;

  //ajax call using the queryURL
  $.ajax({
    method: "GET",
    url: queryURL
  }).then(function(response) {
    console.log(response);
    makeGifHTML(response.data);
  });
}

function makeGifHTML(responseArr) {
  for (var i = 0; i < responseArr.length; i++) {
    var gifDiv = $("<div>");
    gifDiv.addClass("col-sm-6 col-md-4 col-lg-2");

    var gifRating = $("<h4>");
    gifRating.html("Rated: " + responseArr[i].rating);
    var gifPreview = $("<img>");
    gifPreview.addClass("gifResult");
    //store the still and gif in two data properties, toggle between them when clicking on the gif
    gifPreview.attr(
      "data-gif-still",
      responseArr[i].images.fixed_width_still.url
    );
    gifPreview.attr("data-gif", responseArr[i].images.fixed_width.url);
    gifPreview.attr("src", responseArr[i].images.fixed_width_still.url);
    $("#gif-section").prepend(gifDiv.append(gifRating, gifPreview));
  }
}

// Function for displaying movie data
function renderButtons(arr) {
  // Looping through the array of movies
  for (var i = 0; i < arr.length; i++) {
    // Then dynamicaly generating buttons for each movie in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var btn = $("<button>");
    // Adding a class of movie to our button
    btn.addClass("gifTopic");
    // Adding a data-attribute
    btn.attr("data-name", arr[i]);
    // Providing the initial button text
    btn.text(arr[i]);
    // Adding the button to the buttons-view div
    $("#buttons-view").append(btn);
  }
}

// This function handles events where one button is clicked

$(document).ready(function() {
  // Calling the renderButtons function to display the intial buttons
  renderButtons(gifList);

  $(".add-gif").submit(function(e) {
    e.preventDefault();

    // This line grabs the input from the textbox
    var gifTopic = $("#gif-input")
      .val()
      .trim();

    // The movie from the textbox is then added to our array
    gifList.push(gifTopic);

    // Deleting the buttons prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Calling renderButtons which handles the processing of our movie array
    renderButtons(gifList);
  });

  // Generic function for displaying the movieInfo
  $(document).on("click", ".gifTopic", displayMovieInfo);

  $(document).on("click", ".gifResult", playGif);
});

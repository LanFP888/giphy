// Initial array of gif
// global var
var gifList = ["Trending", "the office", "motivation", "the it crowd", "laugh"];
var gifLimitPerCall = 10;
var gifFavList = [];

$(document).ready(function () {
  // Calling the renderButtons function to display the intial buttons
  renderButtons(gifList);

  //add topic button
  $(".add-topic").on("click", function (e) {
    e.preventDefault();
    // This line grabs the input from the textbox
    var gifTopic = $(".topic-input").val().trim();
    //making sure the user didn't submit an empty string
    if (gifTopic !== "") {
      //adding the new gif Topic to the gif array
      gifList.push(gifTopic);
      // Deleting the buttons prior to adding new topics
      // (this is necessary otherwise you will have repeat buttons)
      $(".buttons-view").empty();
      // Calling renderButtons which handles the processing of our gif array
      renderButtons(gifList);
      //clears the topic text box
      $(".topic-input").val("")
    }
  });

  // Generic function for displaying the movieInfo
  $(document).on("click", ".gifTopic", displayGifInfo);

  $(document).on("click", ".gifResult", playGif);
});

// Function for dumping the JSON content for each button into the div
function displayGifInfo() {
  //get the data name of the button
  var gifTopic = $(this).attr("data-name");
  getGif(gifTopic);
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

//function for calling the GIPHY API to get the appropriate gifs based on the gifTopic
function getGif(gifTopic) {
  var queryURL;
  if (gifTopic !== "Trending") {
    //create the queryURL using the gifTopic
    queryURL =
      "https://api.giphy.com/v1/gifs/search?q=" +
      gifTopic +
      "&api_key=kGOO42dDHjBstMYP3bEXkTG3g9nUihvo&limit=" +
      gifLimitPerCall;
  } else {
    queryURL =
      "https://api.giphy.com/v1/gifs/trending?api_key=kGOO42dDHjBstMYP3bEXkTG3g9nUihvo"
  }
  //ajax call using the queryURL
  $.ajax({
    method: "GET",
    url: queryURL
  }).then(function (response) {
    console.log(response);
    makeGifHTML(response.data);
  });
}

//function to render the gifs on the screen using the API response
function makeGifHTML(responseArr) {
  for (var i = 0; i < responseArr.length; i++) {
    var gifDiv = $("<div>");
    gifDiv.addClass("col-sm-6 col-md-4 col-xl-2");
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
    var fav = $("<i>")
    fav.addClass("fas fa-star col-12")
    var downloadBtn = $("<a>")
    // downloadBtn.attr("type", "button")
    downloadBtn.addClass("btn btn-info col-12 downloadGif")
    downloadBtn.attr("href", responseArr[i].images.fixed_width.url)
    downloadBtn.attr("download", "myGif")
    downloadBtn.attr("target", "_blank")
    downloadBtn.html("Download")
    var downloadIcon = $("<i>")
    downloadIcon.addClass("fa fa-download")
    var hr = $("<hr>")
    $(".gif-section").prepend(gifDiv.append(gifRating, gifPreview, fav, downloadBtn.prepend(downloadIcon), hr));
  }
}

// Function for rendering the gif topic buttons
function renderButtons(arr) {
  // Looping through the given
  for (var i = 0; i < arr.length; i++) {
    // Then dynamicaly generating buttons for each items in the array
    var btn = $("<button>");
    btn.addClass("btn btn-success gifTopic");
    btn.attr("id", arr[i].replace(/\s+/g, ''))
    // Adding a data-attribute
    btn.attr("data-name", arr[i]);
    // Providing the initial button text
    btn.text(arr[i]);
    // Adding the button to the buttons-view div
    $(".buttons-view").append(btn);
  }
}



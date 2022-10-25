//Gia script sandbox
//global variables
var movieAPIKey = "k_4qje020e";
var movieContentEl = document.querySelector("#movie-results-print");
var movieForm = document.getElementById("movie-form");
var genreInput = document.getElementById("movie-search");

// var testURL =
//   "https://imdb-api.com/API/AdvancedSearch/k_4qje020e/?genres=action";

//append movie cards on screen
function displayMovie(movieResults) {
  // console.log(movieResults);

  var resultCard = document.createElement("div");
  resultCard.classList.add("movie-card", "background-dark", "text-light");

  var resultBody = document.createElement("div");
  resultBody.classList.add("movie-card-body");
  resultCard.append(resultBody);

  var movieImage = document.createElement("img");
  movieImage.src = movieResults.image;
  movieImage.classList.add("movie-image");
  // console.log(movieImage)

  var movieTitle = document.createElement("h1");
  movieTitle.textContent = movieResults.title;
  movieTitle.classList.add("movie-title");

  var bodyContentEl = document.createElement("div");
  bodyContentEl.classList.add("movie-content");

  var bodyContent = document.createElement("p");
  if (movieResults.contentRating) {
    bodyContent.innerHTML += "Rating: " + movieResults.contentRating + "<br/>";
  } else {
    bodyContent.innerHTML += "Ratings: No Results";
  }

  if (movieResults.genres) {
    bodyContent.innerHTML += "Genres: " + movieResults.genres + "<br/>";
  } else {
    bodyContent.innerHTML += "Genres: No Results";
  }

  if (movieResults.plot) {
    bodyContent.innerHTML += "Plot: " + movieResults.plot + "<br/>";
  } else {
    bodyContent.innerHTML += "Plot: No Results";
  }

  bodyContentEl.append(bodyContent);

  resultBody.append(movieImage, movieTitle, bodyContentEl);

  movieContentEl.append(resultCard);
}

//search IMDB API
function searchMovieAPI(genreInputVal) {
  var partialURL = "https://imdb-api.com/API/AdvancedSearch/";

  if (genreInput) {
    newMovieURL =
      partialURL + movieAPIKey + "/?genres=" + genreInputVal + "&count=250";
  }

  //fetching new url each time a genre input is entered
  fetch(newMovieURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);

      data.results.sort(function () {
        return Math.floor(Math.random() * 2) * 2 - 1;
      });

      data.results.splice(50);
      //looping through all movie data and pulling 5 movies
      for (var i = 0; i < 5; i++) {
        // console.log(data.results[i]);
        displayMovie(data.results[i]);
      }
    });
}

//getting value of user input
function handleMovieSearchSubmit(event) {
  event.preventDefault();

  //clears out the searches each time
  movieContentEl.innerHTML = "";

  var genreInputVal = document.getElementById("movie-search").value;

  searchMovieAPI(genreInputVal);
}

//when submit the form gets the user input and get
movieForm.addEventListener("submit", handleMovieSearchSubmit);
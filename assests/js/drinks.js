//Reed script sandbox
var drinkAPIKey = "da333d9db486c458f3dfb0ea2d6b6ecd";
var appID = "1e7f6e54";
var drinkFormEl = document.querySelector("#drink-form");
var drinkSearchInputEl = document.querySelector("#drink-search-input");
var userDrinkInput = drinkSearchInputEl.value.trim();

var displayToSidebar = document.querySelector("#historySidebar");
var saveDrink = document.querySelector("#save-btn");

//set up the array for drink search history and saved drink history
var allDrinkSearchHistory = JSON.parse(localStorage.getItem("all drinks"));
if (!allDrinkSearchHistory) {
  allDrinkSearchHistory = [];
}
var savedDrinkHistory = JSON.parse(localStorage.getItem("saved drinks"));
if (!savedDrinkHistory) {
  savedDrinkHistory = [];
}

// for handling submission of the drink form
var drinkFormSubmitHandler = function (event) {
  event.preventDefault();

  //to get the user input data
  var userDrinkInput = drinkSearchInputEl.value.trim();
  //to get the API
  var querydrinkAPI =
    "https://api.edamam.com/api/recipes/v2?type=public&q=" +
    userDrinkInput +
    "&app_id=f77c6a8d&app_key=5618241aea289752355d852d3165a903&health=alcohol-cocktail&random=true";

  if (userDrinkInput) {
    fetch(querydrinkAPI).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //check how the process is going
          // console.log(data.hits[0].recipe.images.SMALL.url);
          // console.log(userDrinkInput);

          var drinkName = data.hits[0].recipe.label;
          var ingredientsList = data.hits[0].recipe.ingredientLines;
          var recipeSource = data.hits[0].recipe.source;
          var drinkImage = data.hits[0].recipe.images.SMALL.url;
          var drinkLink = data.hits[0].recipe.url;
          var drinkSource = $("#drink-source");

          //display the recipe
          $("#drink-title").text(drinkName);

          // console.log(ingredientsList);
          let drinkPic =
            "<img class='drink-pic rounded-lg' src=" +
            drinkImage +
            " alt='Drink image'>";
          let ingreText = "<ul>";
          let source =
            "<a class='drink-ext-link' href=" +
            drinkLink +
            ">Click here for complete directions.</a>";
          let save =
            "<button class='save-recipe rounded-md p-2 mt-2' id='save-btn' onclick='javascript:saveDrinksToLocal();'>Save Recipe</button";
          for (let i = 0; i < ingredientsList.length; i++) {
            ingreText += "<li>" + ingredientsList[i] + "</li<br>";
          }
          ingreText += "</ul>";
          //display list
          document.getElementById("drink-ingredients").innerHTML = ingreText;
          //a line for the source link
          document.getElementById("drink-image").innerHTML = drinkPic;
          drinkSource.text("Recipe from " + recipeSource + ".");
          document.getElementById("drink-link").innerHTML = source;
          document.getElementById("drink-save").innerHTML = save;

          //to reduce the need for multiple fetches, drinkData saves everything I need to call back saved recipes without more fetches.
          var drinkData = {
            drinkName: data.hits[0].recipe.label,
            ingredientsList: data.hits[0].recipe.ingredientLines,
            recipeSource: data.hits[0].recipe.source,
            drinkImage: data.hits[0].recipe.images.SMALL.url,
            drinkLink: data.hits[0].recipe.url,
          };
          console.log(drinkData);
          console.log(save);
          //YEs! unshift adds an item to the beginning of an array, so I can always grab the zero position for saving drinks (without getting the whol array or making a function to get the ever changing last item..)
          allDrinkSearchHistory.unshift(drinkData);
          localStorage.setItem(
            "all drinks",
            JSON.stringify(allDrinkSearchHistory)
          );
        });
      }
    });
  }
};
// check on data status -- need to know the value of saved drinks so that I can set up the 'if' statement correctly
// console.log(allDrinkSearchHistory);
// console.log(savedDrinkHistory);

//this function gets the saved drinks into local storage
function saveDrinksToLocal() {
  // console.log(allDrinkSearchHistory[0].drinkName);

  //set to the current recipe to localStorage
  var savedDrink = {
    name: allDrinkSearchHistory[0].drinkName,
    url: allDrinkSearchHistory[0].drinkLink,
    ingredientsList: allDrinkSearchHistory[0].ingredientsList,
    recipeSource: allDrinkSearchHistory[0].recipeSource,
    drinkImage: allDrinkSearchHistory[0].drinkImage,
    drinkLink: allDrinkSearchHistory[0].drinkLink,
  };

  savedDrinkHistory.unshift(savedDrink);
  localStorage.setItem("saved drinks", JSON.stringify(savedDrinkHistory));

  var saveDrinkToSidebar = document.createElement("a");
  saveDrinkToSidebar.id = "savedDrink";
  saveDrinkToSidebar.class = "savedDrink";
  saveDrinkToSidebar.href = "javascript:displaySaved();";
  saveDrinkToSidebar.innerHTML = savedDrinkHistory[0].name;

  document.getElementById("savedDrinks").appendChild(saveDrinkToSidebar);
}

function addDrinksToSidebar() {
  for (let i = 0; i < savedDrinkHistory.length; i++) {
    var saveDrinkToSidebar = document.createElement("a");
    saveDrinkToSidebar.id = "savedDrink";
    saveDrinkToSidebar.class = "savedDrink";
    saveDrinkToSidebar.href = "javascript:displaySaved();";
    saveDrinkToSidebar.innerHTML = savedDrinkHistory[i].name;

    document.getElementById("savedDrinks").appendChild(saveDrinkToSidebar);
  }
}
// console.log(JSON.parse(localStorage.getItem("saved drinks"))[1].name);

//this function displays the saved recipes after they are clicked in the sidebar
function displaySaved() {
  // console.log($("#savedDrink"));

  // var drinkSelect = document.querySelector("#savedDrink").innerHTML;
  for (let i = 0; i < savedDrinkHistory.length; i++) {
    console.log(savedDrinkHistory[i].name);
    console.log(savedDrinkHistory[i].url);

    // var getbutton = $("#savedDrink")
    // var getSavedDrink = getbutton[0].textContent;
    // console.log(savedDrinkHistory[i].getSavedDrink.url);

    var drinkName = savedDrinkHistory[i].name;
    var drinkLink = savedDrinkHistory[i].url;
    var ingredientsList = savedDrinkHistory[i].ingredientsList;
    var recipeSource = savedDrinkHistory[i].recipeSource;
    var drinkImage = savedDrinkHistory[i].drinkImage;
    var drinkSource = $("#drink-source");

    //display the recipe
    $("#drink-title").text(drinkName);

    //ingredient list
    let drinkPic =
      "<img class='drink-pic rounded-lg' src=" +
      drinkImage +
      " alt='Drink image'>";
    let ingreText = "<ul>";
    let source =
      "<a class='drink-ext-link' href=" +
      drinkLink +
      " target='_blank'" +
      ">Click here for complete directions.</a>";
    for (let i = 0; i < ingredientsList.length; i++) {
      ingreText += "<li>" + ingredientsList[i] + "</li<br>";
    }
    ingreText += "</ul>";
    //display list
    document.getElementById("drink-ingredients").innerHTML = ingreText;
    //a line for the source link
    document.getElementById("drink-image").innerHTML = drinkPic;
    drinkSource.text("Recipe from " + recipeSource + ".");
    document.getElementById("drink-link").innerHTML = source;
  }
}

drinkFormEl.addEventListener("submit", drinkFormSubmitHandler);

//running this function here will show all saved drink history in the sidebar upon refresh
//this function appends the saved recipes to the html sidebar

addDrinksToSidebar();

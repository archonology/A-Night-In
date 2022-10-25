//Dymond script sandbox
//Declare global vars

var foodApiKey = "&app_key=9e715a0764f4ea504885da5433e5c920";
var foodAppId = "&app_id=69d122e0";
var foodFormEl = $("#food-form");

//Set arrays for local storage of searched and saved meals
var mealRecipeSearchHistory = JSON.parse(
  localStorage.getItem("Dinner recipe search")
);
if (!mealRecipeSearchHistory) {
  mealRecipeSearchHistory = [];
}
var savedMeals = JSON.parse(localStorage.getItem("saved meals"));
if (!savedMeals) {
  savedMeals = [];
}
//Handle submissions from drink form
function handleFoodSearchSubmit() {
  var userFoodType = $("#food-search").val();

  //Declare edamamAPI url
  var foodURL =
    "https://api.edamam.com/api/recipes/v2?type=public&q=" +
    foodAppId +
    foodApiKey +
    "&cuisineType=" +
    userFoodType +
    "&mealType=Dinner&random=true";

  //Request api url
  fetch(foodURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        //Declare local vars from api recipe data
        var foodImg = data.hits[0].recipe.images.SMALL.url;
        var recipeLabel = data.hits[0].recipe.label;
        var ingList = data.hits[0].recipe.ingredientLines;
        var foodSource = data.hits[0].recipe.source;
        var foodLink = data.hits[0].recipe.url;

        let foodIngList = "<ul>";

        //Creat <a> and link recipe url
        let fullRecipe =
          "<a class='drink-ext-link' href=" +
          foodLink +
          ">Click here for complete directions.</a>";

        //make recipe.ingredientsLines array into <li>
        for (var i = 0; i < ingList.length; i++) {
          foodIngList += "<li class=food-ing-list>" + ingList[i] + "</li><br>";
        }
        foodIngList += "</ul>";

        //Display results on page
        $("#food-img").html($("#food-img").attr("src", foodImg));
        $("#food-label").text(recipeLabel);
        $("#food-list").html(foodIngList);
        $("#food-source").text("Recipe from " + foodSource + ".");
        $("#food-link").html(fullRecipe);
        //Make save button visibe when user submits form
        $("#food-save").removeClass("invisible");
        $("#food-save").addClass("visible");

        const mealData = {
          mealTitle: data.hits[0].recipe.label,
          mealImage: data.hits[0].recipe.images.SMALL.url,
          mealIngList: data.hits[0].recipe.ingredientLines,
          mealSource: data.hits[0].recipe.source,
          mealLink: data.hits[0].recipe.url,
        };

        //Add all saved search recipes to local storage
        mealRecipeSearchHistory.unshift(mealData);
        localStorage.setItem(
          "Dinner recipe search",
          JSON.stringify(mealRecipeSearchHistory)
        );
      });
    }
  });
}

//Local storage functions
function storeMealRecipe() {
  const savedMeal = {
    mealTitle: mealRecipeSearchHistory[0].mealTitle,
    mealImage: mealRecipeSearchHistory[0].mealImage,
    mealIngList: mealRecipeSearchHistory[0].mealIngList,
    mealSource: mealRecipeSearchHistory[0].mealSource,
    mealLink: mealRecipeSearchHistory[0].mealLink,
  };

  //Add saved recipes to local storage
  savedMeals.unshift(savedMeal);
  localStorage.setItem("saved meals", JSON.stringify(savedMeals));

  addMealToSaved()
}

//append all recipes in local storage
function addMealToSaved() {

  $("#savedMealRecipes").html("")

  for (var i = 0; i < savedMeals.length; i++) {
    var savedRecipe = $("<a>")
    savedRecipe.attr("id", "savedMeal")
    savedRecipe.attr("href", savedMeals[i].mealLink)
    savedRecipe.attr("target", "_blank")
    savedRecipe.text(savedMeals[i].mealTitle)

    $("#savedMealRecipes").append(savedRecipe);
  }
}

//Run function when form is submited
foodFormEl.on("submit", function (e) {
  e.preventDefault();

  handleFoodSearchSubmit();
});

//Run local storage function when 'save recipe' button is clicked
$($("#food-save")).on("click", function (e) {
  e.preventDefault();

  storeMealRecipe();
});

//Run function to append saved recipes to sidebar
addMealToSaved();
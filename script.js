var APIkey = "ec7e9482552d5ccb105e641cf33561ab";

var searchHistoryArr = [];

function searchLocation() {
  var citySearch = $("#userInput").val().trim();
  if (citySearch === "") {
    return;
  }
  getWeather(citySearch);
  getForecast(citySearch);
  console.log(citySearch);
}

function getWeather(search) {
  var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${APIkey}&units=imperial`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#current-city").text(response.name);
    // $("#search-history").text(response.name);
  });
}

function getForecast(search) {
  var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${APIkey}&units=imperial`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#temp").html("<b>Temperature: </b>" + "" + (response.main.temp + " °F"));
    $("#humidity").html(
      "<b>Humidity: </b>" + "" + (response.main.humidity + "%")
    );
    $("#wind-speed").html(
      "<b>Wind Speed: </b>" + "" + (response.wind.speed + " mph")
    );
    var long = response.coord.lon;
    var latt = response.coord.lat;
    getFiveDay(latt, long);
  });
}

function getFiveDay(latt, long) {
  var queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${long}&appid=${APIkey}&units=imperial`;
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#uv-index").html("<b>UVI: </b>" + "" + response.daily[0].uvi);

    // Get 5-Day
    var fiveDay = response.daily;
    for (var i = 1; i < 6; i++) {
      console.log(fiveDay[i]);
      var dayDiv = $("<div>").addClass("five-day-forecast");
      var date = new Date(fiveDay[i].dt * 1000).toLocaleDateString("en-US");
      console.log(date);
    }
  });
}

$(".search-button").on("click", searchLocation);

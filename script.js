var APIkey = "ec7e9482552d5ccb105e641cf33561ab";

var searchHistoryArr = [];

getLastCity();

function searchLocation(event) {
  //   console.log(event.target);

  var citySearch = $("#userInput").val().trim();
  //   console.log(citySearch);

  if (event.target.matches(".cities")) {
    // console.log("cities");
    citySearch = $(event.target).text();
  }

  getWeather(citySearch);
  getForecast(citySearch);

  if (
    event.target.matches(".search-button") ||
    event.target.matches(".fa-search")
  ) {
    storeCity(citySearch);
  }
}

function storeCity(city) {
  searchHistoryArr.unshift(city);
  localStorage.setItem("cityData", city);
  var searchedCity = $("<div>").addClass("cities").text(city);
  $(".search-history").prepend(searchedCity);
}

function getLastCity() {
  var lastCity = localStorage.getItem("cityData");
  getWeather(lastCity);
  getForecast(lastCity);
}

function getWeather(search) {
  var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${APIkey}&units=imperial`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    $("#current-city").text(response.name);
  });
}

function getForecast(search) {
  var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${APIkey}&units=imperial`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var date = new Date(response.dt * 1000).toLocaleDateString("en-US");
    console.log(date);
    $("#current-city").append(" (" + date + ")");

    var weatherIcon = $("<img>").attr({
      src: `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
      alt: `weather icon`,
      // style: "display: block",
    });
    $("#current-city").append(weatherIcon);

    $("#temp").html(`<b>Temperature: </b>${response.main.temp} °F`);
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
    $(".future-forecast").empty();
    // console.log(response);
    $("#uv-index").html(
      "<b>UV Index: </b>" + "" + "<span>" + response.daily[0].uvi
    ) + "</span>";

    if (response.daily[0].uvi < 3) {
      $("span").addClass("green");
    } else if (response.daily[0].uvi < 8) {
      $("span").addClass("yellow");
    } else if (response.daily[0].uvi > 8) $("span").addClass("red");

    // Get 5-Day
    var fiveDay = response.daily;
    for (var i = 1; i < 6; i++) {
      //   console.log(fiveDay[i]);
      var dayDiv = $("<div>").addClass("five-day-forecast");
      var date = new Date(fiveDay[i].dt * 1000).toLocaleDateString("en-US");
      //   console.log(date);

      var weatherIcon = $("<img>").attr({
        src: `http://openweathermap.org/img/wn/${fiveDay[i].weather[0].icon}@2x.png`,
        alt: `weather icon`,
      });

      var temp = $("<p>").html(
        `<b>Temperature: </b> ${fiveDay[i].temp.day} °F`
      );
      var humidity = $("<p>").html(`<b>Humidity: <b> ${fiveDay[i].humidity} %`);
      dayDiv.append(date, weatherIcon, temp, humidity);

      $(".future-forecast").append(dayDiv);
    }
  });
}

$(".search-button").on("click", searchLocation);
$(".search-history").on("click", searchLocation);

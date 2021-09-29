function init() {
  let inputEl = document.getElementById("city-input");
  let searchEl = document.getElementById("search-btn");
  let clearEl = document.getElementById("clear-btn");
  let nameEl = document.getElementById("city-name");
  let cityEl = document.getElementById("city-report");
  let currentPicEl = document.getElementById("current-weather");
  let currentTempEl = document.getElementById("temperature");
  let currentHumidityEl = document.getElementById("humidity");
  let currentWindEl = document.getElementById("wind-speed");
  let currentUVEL = document.getElementById("UX-index");
  let historyEl = document.getElementById("history");
  let headerEl = document.getElementById("window-text");

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  console.log(searchHistory);

  const APIKey = "022cc364ebaff6d446fc84e71d5063a9";

  function getWeather(cityName) {
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;

    console.log("From getWeather()" + cityName);
    console.log("From getWeather()" + queryURL);

    fetch(queryURL)
    .then(function (response) {
        console.log(response.status);
        console.log(response);

        cityEl.innerHTML = cityName + " " + moment().format("DD-MM-YYYY");

        let currentWeatherIcon = "https://openweathermap.ord/img/w/" + response.weather[0].icon + ".png"
    })
  }

  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    console.log("From event listener: " + searchTerm);
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    //renderSearchHistory();
  });

  clearEl.addEventListener("click", function () {
    searchHistory = [];
    //renderSearchHistory();
  });
}

init();

function init() {
  let inputEl = document.getElementById("city-input");
  let searchEl = document.getElementById("search-btn");
  let clearEl = document.getElementById("clear-btn");
  let nameEl = document.getElementById("city-name");
  let cityEl = document.getElementById("city-report");
  let currentPicEl = document.getElementById("current-weather-icon");
  let currentTempEl = document.getElementById("temperature");
  let currentHumidityEl = document.getElementById("humidity");
  let currentWindEl = document.getElementById("wind-speed");
  let currentUVEl = document.getElementById("UV-index");
  let historyEl = document.getElementById("history");
  let headerEl = document.getElementById("window-text");

  let currentEl = document.getElementById("current-weather");

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
        if (response.status < 400) {
          console.log(response);
          return response.json();
        } else {
          throw new Error("Invalid city name");
        }
      })
      .then(function (response) {
        headerEl.textContent = cityName;
        console.log(response);

        let currentMoment = moment
          .unix(response.dt)
          .utc()
          .utcOffset(response.timezone / 60 / 60);

        console.log(currentMoment.format("DD-MM-YYYY"));

        cityEl.innerHTML = currentMoment.format("DD-MM-YYYY");

        let currentWeatherIcon =
          "https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png";
        console.log(currentWeatherIcon);

        let currentWeatherHTML = `
        <h2>${response.name} ${currentMoment.format(
          "(MM/DD/YY)"
        )}<img src="${currentWeatherIcon}"></h2>`;

        console.log(currentWeatherHTML);

        headerEl.innerHTML = currentWeatherHTML;

        currentTempEl.innerHTML =
          "Temperature: " + k2c(response.main.temp) + " &#176F";
        console.log(currentTempEl);

        currentHumidityEl.innerHTML =
          "Humidity: " + response.main.humidity + "%";
        console.log(currentHumidityEl);

        currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
        console.log(currentWindEl);

        let lat = response.coord.lat;
        let lon = response.coord.lon;

            
        uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&APPID=" + APIKey;
        console.log(uvQuery);

        fetch(uvQuery)
        .then(function (response) {
            return response.json();
        })
        .then (function (response) {
            let uvIndex = response.value;
            currentUVEl.innerHTML = `UV Index: <span id="uvVal"> ${uvIndex}</span>`;
            if (uvIndex>=0 && uvIndex<3){
                currentUVEl.setAttribute("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                currentUVEl.setAttribute("class", "uv-moderate");
            } else if (uvIndex>=8){
                currentUVEl.setAttribute("class", "uv-severe");
            }
        })
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

  function k2c(K) {
    return Math.floor(K - 273);
  }
}

init();

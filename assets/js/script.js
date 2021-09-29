function init() {
  let inputEl = document.getElementById("city-input");
  let searchEl = document.getElementById("search-btn");
  let clearEl = document.getElementById("clear-btn");

  let cityEl = document.getElementById("city-report");

  let currentTempEl = document.getElementById("temperature");
  let currentHumidityEl = document.getElementById("humidity");
  let currentWindEl = document.getElementById("wind-speed");
  let currentUVEl = document.getElementById("UV-index");
  let historyEl = document.getElementById("history");
  let headerEl = document.getElementById("window-text");

  let fiveDayForecastEl = document.getElementById("five-day-forecast");

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

  

    fetch(queryURL)
      .then(function (response) {
     
        if (response.status < 400) {

          return response.json();
        } else {
          throw new Error("Invalid city name");
        }
      })
      .then(function (response) {
        headerEl.textContent = cityName;
    

        let currentMoment = moment
          .unix(response.dt)
          .utc()
          .utcOffset(response.timezone / 60 / 60);



        cityEl.innerHTML = currentMoment.format("DD-MM-YYYY");

        let currentWeatherIcon =
          "https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png";


        let currentWeatherHTML = `
        <h2>${response.name} ${currentMoment.format(
          "(MM/DD/YY)"
        )}<img src="${currentWeatherIcon}"></h2>`;

 

        headerEl.innerHTML = currentWeatherHTML;

        currentTempEl.innerHTML =
          "Temperature: " + k2c(response.main.temp) + " &#176C";
  

        currentHumidityEl.innerHTML =
          "Humidity: " + response.main.humidity + "%";


        currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
      

        let lat = response.coord.lat;
        let lon = response.coord.lon;

        uvQuery =
          "https://api.openweathermap.org/data/2.5/uvi?lat=" +
          lat +
          "&lon=" +
          lon +
          "&APPID=" +
          APIKey;
    

        fetch(uvQuery)
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            let uvIndex = response.value;
            currentUVEl.innerHTML = `UV Index: <span id="uvVal"> ${uvIndex}</span>`;
            if (uvIndex >= 0 && uvIndex < 3) {
              currentUVEl.setAttribute("class", "uv-favorable");
            } else if (uvIndex >= 3 && uvIndex < 8) {
              currentUVEl.setAttribute("class", "uv-moderate");
            } else if (uvIndex >= 8) {
              currentUVEl.setAttribute("class", "uv-severe");
            }
          });

        let cityID = response.id;
       

        let forcastQueryURL =
          "https://api.openweathermap.org/data/2.5/forecast?id=" +
          cityID +
          "&appid=" +
          APIKey;
        console.log(forcastQueryURL);

        fetch(forcastQueryURL)
          .then(function (response) {
      
            return response.json();
          })

          .then(function (response) {
            let fivedayforecastURL =
              "https://api.openweathermap.org/data/2.5/forecast?q=" +
              cityName +
              "&APPID=" +
              APIKey;
      

            fetch(fivedayforecastURL)
              .then(function (response) {
                return response.json();
              })

              .then(function (response) {
                  let=fiveDayForecastHTML=''
                 fiveDayForecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
                // Loop over the 5 day forecast and build the template HTML using UTC offset and Open Weather Map icon
                for (let i = 0; i < response.list.length; i++) {
                  let dayData = response.list[i];

                  let thisMoment = moment
                    .unix(dayData.dt)
                    .utc()
                    .utcOffset(response.city.timezone / 60 / 60);

                  let iconURL =
                    "https://openweathermap.org/img/w/" +
                    dayData.weather[0].icon +
                    ".png";

                    let dayTemp = k2c(dayData.main.temp);

                  // Only displaying mid-day forecasts
                  if (
                    thisMoment.format("HH:mm:ss") === "11:00:00" ||
                    thisMoment.format("HH:mm:ss") === "12:00:00" ||
                    thisMoment.format("HH:mm:ss") === "13:00:00"
                  ) {
                    fiveDayForecastHTML += `
                <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayTemp}&#176C;</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
                  }
                }

                fiveDayForecastHTML += `</div>`;

                fiveDayForecastEl.innerHTML = fiveDayForecastHTML;
              });
          });
      });
  }

  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;

    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  });

  clearEl.addEventListener("click", function () {
    searchHistory = [];
    localStorage.clear();
    renderSearchHistory();
  });

  function k2c(K) {
    return Math.floor(K - 273);
  }

  function renderSearchHistory(){
      historyEl.innerHTML = "";
      for(let i = 0; i<searchHistory.length; i++){
          const historyItem = document.createElement("li");
          historyItem.setAttribute("type", "text");
        
          historyItem.setAttribute("class", "form-control");
      
          historyItem.setAttribute("value", searchHistory[i]);
     
          historyItem.textContent=searchHistory[i]
          historyItem.addEventListener("click", function(event) {
              console.log(event.target.textContent)
              getWeather(event.target.textContent);
          });
          historyEl.appendChild(historyItem);
  
      }
  }

  renderSearchHistory();

}

init();

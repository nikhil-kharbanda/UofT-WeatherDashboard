function init() {
  /*All elements being linked via HTML id's*/
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

  /*Get cities from local storage. If local storage empty, make an empty array*/
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  /*Open Weather API key*/
  const APIKey = "022cc364ebaff6d446fc84e71d5063a9";

  /*Function to be called when search button is clicked*/
  function getWeather(cityName) {
    /*Using string cocatination, create URL with cityName, and APIKey appended*/
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey;

    /*Fetch to see if valid response*/
    fetch(queryURL)
      .then(function (response) {
        if (response.status < 400) {
          return response.json();
        } else {
          throw new Error("Invalid city name");
        }
      })
      .then(function (response) {
        /*Once confirmed a valid repsonse, change headers name to cities name*/
        headerEl.textContent = cityName;

        /*Find date of city*/
        let currentMoment = moment
          .unix(response.dt)
          .utc()
          .utcOffset(response.timezone / 60 / 60);

        /*Display date*/
        cityEl.innerHTML = currentMoment.format("DD-MM-YYYY");

        /*Create weather icon link using string concatination*/
        let currentWeatherIcon =
          "https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png";

        /*Create a HTML element variable that is to be displayed. Also, using this method, can append the icon using the variable above*/
        let currentWeatherHTML = `
        <h2>${response.name} ${currentMoment.format(
          "(MM/DD/YY)"
        )}<img src="${currentWeatherIcon}"></h2>`;

        /*Using the HTML variable above, display that */
        headerEl.innerHTML = currentWeatherHTML;

        /*Calculate temperature from API, and convert to Celcius*/
        currentTempEl.innerHTML =
          "Temperature: " + k2c(response.main.temp) + " &#176C";

        /*Gather Humidity value, display it on webpage*/
        currentHumidityEl.innerHTML =
          "Humidity: " + response.main.humidity + "%";

        /*Gather windspeed value, display it on webpage*/
        currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";

        /*For UX-Index, not supported by this API. Have to regenerate and create new link using longitude and latitiude*/
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        uvQuery =
          "https://api.openweathermap.org/data/2.5/uvi?lat=" +
          lat +
          "&lon=" +
          lon +
          "&APPID=" +
          APIKey;

        /*Fetch to see if valid request*/
        fetch(uvQuery)
          .then(function (response) {
            if (response.status < 400) {
              return response.json();
            } else {
              throw Error("Invalid Link");
            }
          })
          .then(function (response) {
            /*When URL is valid and status granted, find the UV-Index value*/
            let uvIndex = response.value;
            /*Color UV-Index bar with appropriate background color, and display value on webpage*/
            currentUVEl.innerHTML = `UV Index: <span id="uvVal"> ${uvIndex}</span>`;
            if (uvIndex >= 0 && uvIndex < 3) {
              currentUVEl.setAttribute("class", "uv-favorable");
            } else if (uvIndex >= 3 && uvIndex < 8) {
              currentUVEl.setAttribute("class", "uv-moderate");
            } else if (uvIndex >= 8) {
              currentUVEl.setAttribute("class", "uv-severe");
            }
          });

        /*This following code is for the 5 day forecast*/
        /*Find the cityID*/
        let cityID = response.id;

        /*Create new URL containing the 5 day forecast*/
        let forcastQueryURL =
          "https://api.openweathermap.org/data/2.5/forecast?id=" +
          cityID +
          "&appid=" +
          APIKey;

        /*Check to see if getting valid response*/
        fetch(forcastQueryURL)
          .then(function (response) {
            if (response.status < 400) {
              return response.json();
            } else {
              throw Error("Invalid Link");
            }
          })

          .then(function (response) {
            /*Once connection established...*/
            /*Create new link for 5 day forecast URL*/
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
                /*Create empty HTML element*/
                let fiveDayForecastHTML = "";
                /*New empty element to display a heading, and a section for the fivedayforcast list. Used string concatination*/
                fiveDayForecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
                // Loop over the 5 day forecast and build the template HTML
                for (let i = 0; i < response.list.length; i++) {
                  let dayData = response.list[i];
                  /*Find date*/
                  let thisMoment = moment
                    .unix(dayData.dt)
                    .utc()
                    .utcOffset(response.city.timezone / 60 / 60);

                  /*Create icon URL variable*/
                  let iconURL =
                    "https://openweathermap.org/img/w/" +
                    dayData.weather[0].icon +
                    ".png";

                  /*Convert kelvins to cel for that day*/
                  let dayTemp = k2c(dayData.main.temp);

                  // Only displaying mid-day forecasts
                  if (
                    thisMoment.format("HH:mm:ss") === "11:00:00" ||
                    thisMoment.format("HH:mm:ss") === "12:00:00" ||
                    thisMoment.format("HH:mm:ss") === "13:00:00"
                  ) {
                    /*Using string concatination, create HTML element containing up to 5 cards, and the list and icon of information*/
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

                /*End div*/
                fiveDayForecastHTML += `</div>`;

                /*Set the fiveDayForecast innerHTML element to variable that has concatinated HTML*/
                fiveDayForecastEl.innerHTML = fiveDayForecastHTML;
              });
          });
      });
  }

  /*When search button is pressed...*/
  searchEl.addEventListener("click", function () {
    /*Create variable and assign the textbox value to if*/
    const searchTerm = inputEl.value;

    /*Go to function getWeather with the parameter from the search bar*/
    getWeather(searchTerm);

    /*Add the searched city to the searchHistory array*/
    searchHistory.push(searchTerm);

    /*Add the search history item to the localStorage*/
    localStorage.setItem("search", JSON.stringify(searchHistory));

    /*Display the search history*/
    renderSearchHistory();
  });

  /*Button to clear the array and empty local storge*/
  clearEl.addEventListener("click", function () {
    searchHistory = [];
    localStorage.clear();
    renderSearchHistory();
  });

  /*Function to convert Kelvins to Cel*/
  function k2c(K) {
    return Math.floor(K - 273);
  }

  /*Function to convert Kelvins to Fer*/
  function k2f(K) {
    return Math.floor((K - 273) * (9 / 5) + 32);
  }

  /*Display the searched cities*/
  function renderSearchHistory() {
    historyEl.innerHTML = "";
    /*Reading from localStorage*/
    for (let i = 0; i < searchHistory.length; i++) {
      /*Create new list element */
      const historyItem = document.createElement("li");

      /*In list element, set the type to text*/
      historyItem.setAttribute("type", "text");

      /*Set class to form*/
      historyItem.setAttribute("class", "form-control");

      /*Set value and text inside box to the searchHistory at index in for loop*/
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.textContent = searchHistory[i];

      /*When city from prev search is clicked...*/
      historyItem.addEventListener("click", function (event) {
        /*Go to getWeather function with the value clicked as cityName*/
        getWeather(event.target.textContent);
      });

      /*Append historyItem to the prev search section*/
      historyEl.appendChild(historyItem);
    }
  }
  /*Should renderSearchHistory at end just to handle updates to page*/
  renderSearchHistory();
}

/*Fuction called, page reactive immediately*/
init();

const apiKey = "e1f50dc6c7d097fabf20a71bcdc46f86";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=vi&q=";

const inputCity = document.querySelector(".input-bar");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.querySelector(".weather-image");
const content = document.querySelector(".content");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  const data = await response.json();

  if (response.status == 404) {
    alert("This city do not exist!");
  }
  console.log(data);

  document.querySelector(".city-name").innerHTML = data.name;
  document.querySelector(".temperature").innerHTML =
    Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML =
    (data.wind.speed * 3.6).toFixed(2) + "km/h";
  switch (data.weather[0].main) {
    case "Clouds": {
      weatherIcon.src = "images/clouds.png";
      break;
    }
    case "Clear": {
      weatherIcon.src = "images/clear.png";
      break;
    }
    case "Rain": {
      weatherIcon.src = "images/rain.png";
      break;
    }
    case "Drizzle": {
      weatherIcon.src = "images/drizzle.png";
      break;
    }
    case "Mist": {
      weatherIcon.src = "images/mist.png";
      break;
    }
    default: {
      weatherIcon.src = "images/clear.png";
    }
  }
}


searchBtn.addEventListener("click", () => {
  checkWeather(inputCity.value);
});

import { showAlert } from "./utilits.js"

const ApiKey = ""


// Update Weather UI
function updateWeatherUI(cityName, data) {
    let temperature = data.main.temp;
    let humidity = data.main.humidity;
    let windSpeed = data.wind.speed;
    let weatherDescription = data.weather[0].description;
    let weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;


    document.getElementById("cityName").innerHTML = cityName;
    document.getElementById("temperature").innerHTML = `${temperature}°C`;
    document.getElementById("description").innerHTML = weatherDescription;
    document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`;
    document.getElementById("windSpeed").innerHTML = `Wind: ${windSpeed} km/h`;

    let iconElement = document.getElementById("weatherIcon");
    iconElement.src = weatherIcon;
    iconElement.alt = weatherDescription;

}

// Get Weather Data  
async function getWeatherData(cityName, lat, lon) {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${ApiKey}`);

        if (!res.ok) throw new Error(`HTTP error, Status: ${res.status}`);

        let data = await res.json();
        updateWeatherUI(cityName, data);

    } catch (err) {
        console.error(err);
    }
}


// Get City Coordinates
async function getCityCoordinates() {
    try {
        let cityName = document.getElementById("cityInput").value.trim();

        let res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${ApiKey}`);
        let data = await res.json();


        getWeatherData(cityName, data[0].lat, data[0].lon);
        drawMap(data[0].lat, data[0].lon);
    }
    catch (err) {
        console.log(err);
    }
}

// Get Your Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        showAlert("Geolocation is not supported by this browser", "danger");
    }
}

function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    getWeatherData("Your Location", lat, lon);
    drawMap(lat, lon);
    showAlert("Location found", "success");
}

function error() {
    showAlert("Unable to retrieve your location", "danger");
}



// Draw Map
function drawMap(lat, lon) {

    let map = L.map("map").setView([lat, lon], 10);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
        .openPopup();
}


document.getElementById("searchBtn").addEventListener("click", getCityCoordinates);
document.getElementById("locationBtn").addEventListener("click", getLocation);


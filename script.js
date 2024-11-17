const apiKey = 'YOUR_API_KEY'; 
const weatherDisplay = document.getElementById('weatherDisplay');
const recentSearchesList = document.getElementById('recentSearches');

function getWeatherByCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeatherData(`q=${city}`);
        saveRecentSearch(city);
    } else {
        alert('Please enter a city name.');
    }
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
        }, () => alert('Location access denied.'));
    } else {
        alert('Geolocation not supported.');
    }
}

function fetchWeatherData(query) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => weatherDisplay.textContent = error.message);
}

function displayWeather(data) {
    const { name, main, wind, weather } = data;
    weatherDisplay.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Condition: ${weather[0].description}</p>
    `;
}

function saveRecentSearch(city) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        displayRecentSearches();
    }
}

function displayRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearchesList.innerHTML = recentSearches.map(city =>
        `<li onclick="getWeatherByCityName('${city}')">${city}</li>`
    ).join('');
}

function getWeatherByCityName(city) {
    document.getElementById('cityInput').value = city;
    getWeatherByCity();
}

// Initialize recent searches on page load
displayRecentSearches();

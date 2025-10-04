document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');

    // Current weather elements
    const weatherIconImg = document.getElementById('weather-icon-img');
    const tempValue = document.getElementById('temp-value');
    const cityNameEl = document.getElementById('city-name');
    const dateEl = document.getElementById('date');
    const timeEl = document.getElementById('time');

    // Weather details elements
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const precipitation = document.getElementById('precipitation');

    // Daily forecast container
    const forecastContainer = document.getElementById('forecast-container');

    searchBtn.addEventListener('click', () => {
        const cityName = cityInput.value.trim();
        if (cityName) {
            getWeather(cityName);
        } else {
            alert('Please enter a city name.');
        }
    });

    async function getWeather(city) {
        const geocodingApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

        try {
            const geoResponse = await fetch(geocodingApiUrl);
            const geoData = await geoResponse.json();

            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude, name } = geoData.results[0];
                const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
                
                const weatherResponse = await fetch(weatherApiUrl);
                const weatherData = await weatherResponse.json();

                displayCurrentWeather(weatherData, name);
                displayWeatherDetails(weatherData);
                displayDailyForecast(weatherData);
            } else {
                alert('City not found.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Could not fetch weather data. Please try again.');
        }
    }

    function displayCurrentWeather(data, cityName) {
        if (data && data.current_weather) {
            const { temperature, weathercode, time } = data.current_weather;
            
            tempValue.textContent = Math.round(temperature);
            cityNameEl.textContent = cityName;
            weatherIconImg.src = getWeatherIcon(weathercode);

            const currentDate = new Date(time);
            dateEl.textContent = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            timeEl.textContent = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    }

    function displayWeatherDetails(data) {
        if (data && data.current_weather) {
            const { windspeed } = data.current_weather;
            const { temperature_2m_min, temperature_2m_max, precipitation_sum } = data.daily;

            feelsLike.textContent = `${Math.round(temperature_2m_min[0])}°C / ${Math.round(temperature_2m_max[0])}°C`;
            humidity.textContent = `--%`; // Humidity data not available in this API response
            windSpeed.textContent = `${windspeed} km/h`;
            precipitation.textContent = `${precipitation_sum[0]} mm`;
        }
    }

    function displayDailyForecast(data) {
        if (data && data.daily) {
            forecastContainer.innerHTML = '';
            const { time, weathercode, temperature_2m_max, temperature_2m_min } = data.daily;

            for (let i = 1; i < 6; i++) {
                const date = new Date(time[i]);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });

                const forecastItem = `
                    <div class="forecast-item">
                        <div class="day">${day}</div>
                        <img src="${getWeatherIcon(weathercode[i])}" alt="Weather Icon">
                        <div class="temp">${Math.round(temperature_2m_min[i])}°/${Math.round(temperature_2m_max[i])}°</div>
                    </div>
                `;
                forecastContainer.innerHTML += forecastItem;
            }
        }
    }

    function getWeatherIcon(code) {
        if (code >= 0 && code <= 1) return 'https://img.icons8.com/fluency/96/sun.png';
        if (code === 2) return 'https://img.icons8.com/fluency/96/partly-cloudy-day.png';
        if (code === 3) return 'https://img.icons8.com/fluency/96/cloud.png';
        if (code >= 45 && code <= 48) return 'https://img.icons8.com/fluency/96/fog-day.png';
        if (code >= 51 && code <= 67) return 'https://img.icons8.com/fluency/96/rain.png';
        if (code >= 71 && code <= 77) return 'https://img.icons8.com/fluency/96/snow.png';
        if (code >= 80 && code <= 82) return 'https://img.icons8.com/fluency/96/rain.png';
        if (code >= 85 && code <= 86) return 'https://img.icons8.com/fluency/96/snow.png';
        if (code >= 95 && code <= 99) return 'https://img.icons8.com/fluency/96/storm.png';
        return 'https://img.icons8.com/fluency/96/sun.png';
    }
});

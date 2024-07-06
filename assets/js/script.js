$(document).ready(() => {
    const form = $('.form');
    const cityInput = $('#city-input');
    const history = $('#search-history');
    const forecast = $('#forecast-content');
    const apiKey = '2bb98df7c6bd4e1372efffedf391c44c';
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // renderHistory();

    form.on('submit', (event) => {
        event.preventDefault();

        const city = cityInput.val().trim();

        if (city) {
            retrieveCoordinates(city);

            cityInput.val('');
            }
    });

    const retrieveCoordinates = (city) => {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No response found.")
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error('City not found.');
                }
                const { lat, lon } = data[0];
                
                getWeather(lat, lon, city);
                // addCityToHistory(city);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const getWeather = (lat, lon, city) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No response found.')
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                displayWeather(data, city);
                // displayForecast();
            })
            .catch(error => {
                console.error(error);
            });
    }

    const displayWeather = (data, city) => {
        const weatherData = data.list[0];
        const weatherContent = `
            <h3>${city} (${dayjs(weatherData.dt_text).format('DD/MM/YYYY')})</h3>
            <p>Temp: ${weatherData.main.temp} °F</p>
            <p>Wind: ${weatherData.wind.speed} MPH</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
           `;
           
    }        

});

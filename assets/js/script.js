$(document).ready(() => {
    const form = $('.form');
    const cityInput = $('#city-input');
    const history = $('#search-history');
    const forecast = $('#forecast-content');
    const apiKey = '2bb98df7c6bd4e1372efffedf391c44c';
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

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
                addCityToHistory(city);
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
                displayWeather(data, city);
                displayForecast(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const displayWeather = (data, city) => {
        const weatherData = data.list[0];
        const weatherContent = `
            <h4>${city} (${dayjs(weatherData.dt_text).format('MM/DD/YYYY')})</h3>
            <p class="mt-4">Temp: ${weatherData.main.temp} °F</p>
            <p class="mt-4">Wind: ${weatherData.wind.speed} MPH</p>
            <p class="mt-4">Humidity: ${weatherData.main.humidity}%</p>
           `;

           $('#current-weather-content').html(weatherContent);
           
    }
    
    const displayForecast = (data) => {
        forecast.empty();
        console.log(data.list.length);
        for (let i = 0; i < data.list.length; i += 8) {
            const weather = data.list[i];
            const day = $(`
                <div class=col forecast-day>
                    <h5>${dayjs(weather.dt_txt).format('MM/DD/YYYY')}</h4>
                    <p>Temp: ${weather.main.temp} °F</p>
                    <p>Wind: ${weather.wind.speed} MPH</p>
                    <p>Humidity: ${weather.main.humidity}%</p>
                </div>
            `);
            forecast.append(day);
        };
    }

    const addCityToHistory = (city) => {
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);

            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            renderHistory();
        }
    }

    const renderHistory = () => {
        history.empty();

        searchHistory.forEach(city => {
            const item = $('<li class="collection-item">').text(city);

            item.on('click', () => retrieveCoordinates(city));

            history.append(item);
        })
    }

    renderHistory();
});

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
                    throw new Error("Can't find city Coordinates.")
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error('City not found');
                }
                const { lat, lon } = data[0];
                
                // getWeather(lat, lon, city);
            })
            .catch(error => {
                console.error(error);
            });
    }
});

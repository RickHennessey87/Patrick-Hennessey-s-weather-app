$(document).ready(() => {
    const form = $('.form');
    const cityInput = $('#city-input');
    const history = $('#search-history');
    const forecast = $('#forecast-content');
    const apiKey = '2bb98df7c6bd4e1372efffedf391c44c';
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    renderHistory();
});

form.on('submit', (event) => {
    event.preventDefault();

    const city = cityInput.val().trim();

    if (city) {
        retrieveCoordinates(city);

        cityInput.val('');
    }

});

retrieveCoordinates (city)
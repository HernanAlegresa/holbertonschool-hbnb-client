document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
});

function checkAuthentication() {
  const token = getCookie('token');
  if (!token) {
      alert('Please log to access the list of places.');
      window.location.href = 'login.html';
  } else {
      fetchPlaces(token);
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
  try {
      const response = await fetch('http://127.0.0.1:5000/places', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          const places = await response.json();
          displayPlaces(places);
          setupCountryFilter(places);
      } else {
          alert('Failed to load places: ' + response.statusText);
      }
  } catch (error) {
      console.error('Error fetching places:', error);
      alert('Fetching places error. Please try again.');
  }
}

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';

  places.forEach(place => {
      const placeCard = document.createElement('article');
      placeCard.className = 'place-card';

      placeCard.innerHTML = `
          <h3>${place.description}</h3>
          <p>Price per night: $${place.price_per_night}</p>
          <p>Location: ${place.city_name}, ${place.country_name}</p>
          <button class="details-button" onclick="viewDetails('${place.id}')">View Details</button>
      `;

      placesList.appendChild(placeCard);
  });
}

function setupCountryFilter(places) {
  const countryFilter = document.getElementById('country-filter');
  const countries = [...new Set(places.map(place => place.country_name))];
  countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countryFilter.appendChild(option);
  });

  countryFilter.addEventListener('change', () => {
      filterPlaces(countryFilter.value, places);
  });
}

function filterPlaces(selectedCountry, places) {
  const filteredPlaces = selectedCountry === 'all'
      ? places
      : places.filter(place => place.country_name === selectedCountry);

  displayPlaces(filteredPlaces);
}

function viewDetails(placeId) {
  window.location.href = `place.html?id=${placeId}`;
}

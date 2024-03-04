

   let long,lat;
  

   cities.forEach(city => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=YOUR_API_KEY&units=metric`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            const conditionNumber = data.weather[0].id;
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            const cityElement = document.querySelector(`.city:contains(${city.name})`);
            const temperatureElement = cityElement.querySelector('.temperature');
            const conditionElement = cityElement.querySelector('.weather-condition');
            const iconElement = cityElement.querySelector('.weather-icon');

            temperatureElement.textContent = `${temperature}°C`;
            conditionElement.textContent = `Weather condition: ${conditionNumber}`;
            iconElement.src = iconUrl;
        })
        .catch(error => console.error('Error fetching weather data:', error));
    });
 function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

	 function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

  function showPosition(position) {
    console.log(position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    long = longitude
    lat = latitude
    getResturant(lat,long)
    // Call the reverse geocoding API
    fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65d2942cbe3e8745956225aro865b60`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Modify your parsing logic according to the response format of the new API
            // Adjust as necessary based on the response structure of the new API
            var city = data.address.village;
            var country = data.address.country;
            console.log('City: ${city}, Country: ${country}')
            var locationElement = document.getElementById("location");
            var resturantElement = document.getElementById("resturant");

            locationElement.textContent = `City: ${city}, Country: ${country}`;
            resturantElement.textContent = ` ${city} Restaurants`;
            window.location.href = `city.html?city=${encodeURIComponent(city)}&lat=${latitude}&long=${longitude}`;

          })
        .catch(error => {
            console.error("Error fetching reverse geocoding data:", error);
            alert("An error occurred while fetching location data. Please try again later.");
        });
}


        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        }

const searchInput = document.getElementById('searchInput');
const suggestionsPanel = document.getElementById('suggestions');

const cities = ['Haifa', 'Holon', 'Herzliya', 'Hebron', 'Hadera'];

searchInput.addEventListener('input', function() {
  console.log("Input event triggered"); // Debugging line
  const input = searchInput.value.toLowerCase();
  suggestionsPanel.innerHTML = '';
  const suggestions = cities.filter(function(city) {
    return city.toLowerCase().startsWith(input);
  });
  console.log(suggestions); // Debugging line

  if (input && suggestions.length) {
    suggestionsPanel.classList.remove('hidden');
    suggestions.forEach(function(suggested) {
      const div = document.createElement('div');
      div.innerHTML = suggested;
      div.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
      div.onclick = function() {
        searchInput.value = suggested;
        suggestionsPanel.classList.add('hidden');
        suggestionsPanel.innerHTML = '';
      };
      suggestionsPanel.appendChild(div);
    });
  } else {
    suggestionsPanel.classList.add('hidden');
  }
});

window.addEventListener('click', function(e) {
  if (!searchInput.contains(e.target)) {
    suggestionsPanel.classList.add('hidden');
  }
});
// here i added for test -> maybe to be removed


async function getResturant(lat, long) {
  console.log('I\'m here',lat ,long);
  const url = `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${lat}&longitude=${long}&limit=5&currency=ils&distance=4&lunit=km&lang=en_US`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0322cc479amshf2237675d6bf417p16980ejsn734280e9919d',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}, text: ${await response.text()}`);
    }

    const result = await response.json();
    console.log('get restaurant:', result.data);
    
    // Call a new function to update the DOM with these restaurants
    // Make sure to uncomment or implement this function as needed
    // updateRestaurantsDOM(result.data);
    return result.data;
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
  }
}


//here for search button input
async function searchRestaurants() {
  const cityName = document.getElementById('cityInput').value.trim();
  const result = await getCoordsByCity(cityName)
  const {longitude,latitude}= result
  console.log("searchRestaurants",result)
    await getRestaurants(latitude, longitude); // Example coordinates for Haifa
  
  
    // Implement actual geocoding service here
  }


async function getCoordsByCity(city){
  const url = "https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address="+city;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0322cc479amshf2237675d6bf417p16980ejsn734280e9919d',
      'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
    }
  };
  
  try {
    const locations = []
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result)
    console.log(result.Results);
    const allresults = result.Results
    const israeliLocations = allresults.filter(location => location.country === 'Israel');
    const coordinates = israeliLocations.map(location => ({
      longitude: location.longitude,
      latitude: location.latitude
  }));
console.log(coordinates)

    return coordinates[0]
  } catch (error) {
    console.error(error);
  }
}

async function getRestaurants(lat, long) {
  const url = `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=${lat}&longitude=${long}&limit=10&currency=ils&distance=4&lunit=km&lang=en_US`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0322cc479amshf2237675d6bf417p16980ejsn734280e9919d',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => displayRestaurants(data))
    .catch(error => console.error('Failed to fetch restaurants:', error));
}

function displayRestaurants(data) {
  const container = document.getElementById('restaurantsContainer');
  container.innerHTML = ''; // Clear existing content

  // Check if data contains restaurants
  if (data && data.data) {
    data.data.forEach(restaurant => {
      const card = document.createElement('div');
      card.className = 'restaurant-card bg-white rounded-lg shadow-lg p-6';

      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';

      const image = document.createElement('img');
      image.src = restaurant.photo && restaurant.photo.images && restaurant.photo.images.small ? restaurant.photo.images.small.url : 'images/default.jpg';
      image.alt = restaurant.name;
      image.className = 'restaurant-image w-full h-48 object-cover rounded-lg mb-4';

      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'details-container';

      const name = document.createElement('h3');
      name.textContent = restaurant.name;
      name.className = 'restaurant-name text-lg font-semibold mb-2';

      const rating = document.createElement('p');
      rating.textContent = `Rating: ${restaurant.rating}`;
      rating.className = 'restaurant-rating text-gray-600 mb-2';

      const address = document.createElement('p');
      address.textContent = `Address: ${restaurant.address}`;
      address.className = 'restaurant-address text-gray-600 mb-2';

      imageContainer.appendChild(image);
      detailsContainer.appendChild(name);
      detailsContainer.appendChild(rating);
      detailsContainer.appendChild(address);

      card.appendChild(imageContainer);
      card.appendChild(detailsContainer);

      container.appendChild(card);
    });
  } else {
    container.innerHTML = '<p class="text-center">No restaurants found.</p>';
  }
}






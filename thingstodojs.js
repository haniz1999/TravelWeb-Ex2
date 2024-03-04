

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
    getAttractions(lat,long)
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
            // var locationElement = document.getElementById("location");
            // var resturantElement = document.getElementById("resturant");

            // locationElement.textContent = `City: ${city}, Country: ${country}`;
            // resturantElement.textContent = ` ${city} Restaurants`;
             window.location.href = `cityAttraction.html?city=${encodeURIComponent(city)}&lat=${latitude}&long=${longitude}`;

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





//here for search button input



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

async function getAttractions(latitude, longitude) {
  const url = `https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng?latitude=${latitude}&longitude=${longitude}&lunit=km&currency=USD&lang=en_US`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0322cc479amshf2237675d6bf417p16980ejsn734280e9919d',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  };

  try {
     const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    const allresult= result.data;
    console.log('attractions:', allresult);
    displayAttractions(allresult)
    return allresult;
    // Process the result here
  } catch (error) {
    console.error('Error fetching attractions:', error);
  }
}

// Example usage with hardcoded coordinates (you can replace these with dynamic values)

function displaySearchResults(data) {
  const container = document.getElementById('searchResultsContainer');
  container.innerHTML = ''; // Clear existing content

  data.forEach(attraction => {
      // Skip entries that are advertisements
      if (attraction.ad_position) return;

      const attractionDiv = document.createElement('div');
      attractionDiv.className = 'bg-white rounded-lg shadow overflow-hidden';

      // Construct card content
      attractionDiv.innerHTML = `
          <img src="${attraction.photo?.images.large.url}" alt="${attraction.name}" class="w-full h-48 object-cover">
          <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">${attraction.name}</h3>
              <p class="text-gray-600">Reviews: ${attraction.num_reviews}</p>
              <p class="text-gray-600">Rating: ${attraction.rating ?? 'N/A'}</p>
              <a href="${attraction.web_url}" target="_blank" class="text-blue-500 hover:text-blue-700 mt-2 inline-block">Read more</a>
          </div>
      `;

      container.appendChild(attractionDiv);
  });
}
function displayAttractions(attractionsData) {
  const container = document.getElementById('attractionsContainer');
  container.innerHTML = ''; // Clear existing content

  attractionsData.forEach(attraction => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-lg p-6';

      const name = document.createElement('h3');
      name.textContent = attraction.name;
      name.className = 'text-lg font-semibold mb-2';

      const image = document.createElement('img');
      // Replace 'images/parkhai.jpg' with your dynamic image source if available
      image.src = 'images/parkhai.jpg'; // Assuming a placeholder image here
      image.alt = attraction.name;
      image.className = 'w-full h-48 object-cover rounded-lg mb-4';

      const description = document.createElement('p');
      description.textContent = 'Description not available'; // Static placeholder, replace with actual data if available
      description.className = 'text-gray-600 mb-4';

      const locationInfo = document.createElement('p');
      locationInfo.className = 'text-gray-600 mb-2';
      locationInfo.innerHTML = `Latitude: ${attraction.latitude}, Longitude: ${attraction.longitude}<br>`; // Example location info

      // Append the elements to the card
      card.appendChild(name);
      card.appendChild(image);
      card.appendChild(description);
      card.appendChild(locationInfo);

      // Append social icons and links if needed here

      // Finally, append the card to the container
      container.appendChild(card);
  });
}


async function searchRestaurants() {
  const cityName = document.getElementById('cityInput').value.trim();
  const result = await getCoordsByCity(cityName)
  const {longitude,latitude}= result
  console.log("searchRestaurants",result)
    await getAttractions(latitude, longitude); // Example coordinates for Haifa
  
  
    // Implement actual geocoding service here
  }


// for the search bar to auto suggest cities or villages 

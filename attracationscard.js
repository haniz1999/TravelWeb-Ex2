
function displayAttractions(data) {
    const container = document.getElementById('attractionsContainer');
    container.innerHTML = ''; // Clear existing content before adding new attractions

    if (!data || !Array.isArray(data)) {
        console.error('Data is undefined or not an array');
        return;
    }
    
    data.forEach(attraction => {
        const attractionDiv = document.createElement('div');
        attractionDiv.className = 'bg-white rounded-lg shadow-lg p-6 mb-4';

        const name = document.createElement('h3');
        name.className = 'text-lg font-semibold mb-2';
        name.textContent = attraction.name;

        const image = document.createElement('img');
        image.src = attraction.photo.images.large.url;
        image.alt = attraction.name;
        image.className = 'w-full h-48 object-cover rounded-lg mb-4';

        const description = document.createElement('p');
        description.className = 'text-gray-600 mb-4';
        description.innerHTML = `Latitude: ${attraction.latitude}, Longitude: ${attraction.longitude}<br>` +
                                `Number of reviews: ${attraction.num_reviews}<br>` +
                                `Rating: ${attraction.rating}<br>` +
                                `<a href="${attraction.web_url}" target="_blank">Read more on TripAdvisor</a>`;

        attractionDiv.appendChild(name);
        attractionDiv.appendChild(image);
        attractionDiv.appendChild(description);

        container.appendChild(attractionDiv);
    });
}


function getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    const city = queryParams.get('city'); // 'Ibilin'
    const lat = queryParams.get('lat'); // '32.822689'
    const long = queryParams.get('long'); // '35.189542'
  console.log('query', city,lat,long)
    return {
        city,
        lat,
        long,
    };
}

document.addEventListener('DOMContentLoaded', async function() {
    const {city, lat,long}= getQueryParams()
    // var locationElement = document.getElementById("cityName");
    // locationElement.textContent = `${city} Restaurant`;
    console.log("event",lat,long)
    const attractions= await getAttractions(lat,long)
    displayAttractions(attractions)
console.log("dom attractions:",attractions)
    // Adding the restaurants to the DOM
    // const grid = document.getElementById('attractionsContainer');
    // attractions.forEach(restaurant => {
    //     const restaurantCard = displayAttractions(restaurant);
    //     grid.appendChild(restaurantCard);
    // });
});

function updateRestaurantsDOM(restaurants) {
    const grid = document.getElementById('attractionsContainer');
    // Clear existing content
    grid.innerHTML = '';

    restaurants.forEach(restaurant => {
        const restaurantCard = displayAttractions(restaurant);
        grid.appendChild(restaurantCard);
    });
}

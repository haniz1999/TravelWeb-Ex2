
function createRestaurantCard(restaurant) {
    // Creating the card element
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg p-6';

    // Adding the restaurant name
    const name = document.createElement('h3');
    name.className = 'text-lg font-semibold mb-2';
    name.textContent = restaurant.name;
    card.appendChild(name);

    // Adding the restaurant image
    const image = document.createElement('img');
    image.src = restaurant.photo?.images?.large?.url || restaurant.photo?.images?.small?.url || 'images/default.jpg'
    image.alt = restaurant.name;
    image.className = 'w-full h-48 object-cover rounded-lg mb-4';
    card.appendChild(image);

    // Adding placeholder for restaurant description
    const description = document.createElement('p');
    description.className = 'text-gray-600 mb-4';
    description.innerHTML = 'About:<br>' + 'Placeholder description text for ' + restaurant.name;
    card.appendChild(description);

    // Adding opening hours if available
    const hours = document.createElement('p');
    hours.className = 'text-gray-600 mb-2';
    // Assuming opening hours are the same every day for simplicity
    const openingTime = restaurant?.hours?.week_ranges[0][0] ? restaurant?.hours?.week_ranges[0][0].open_time : 'Not Available';
    const closingTime = restaurant?.hours?.week_ranges[0][0] ? restaurant?.hours?.week_ranges[0][0].close_time : 'Not Available';
    hours.textContent = `Opening Hours: ${openingTime} - ${closingTime}`;
    card.appendChild(hours);

    // Placeholder for links (actual links not provided in JSON)
    const links = document.createElement('div');
    links.className = 'flex items-center space-x-4';
    const linkPlaceholder = document.createElement('p');
    linkPlaceholder.textContent = 'Links placeholder (Facebook, Waze, Phone)';
    links.appendChild(linkPlaceholder);

    card.appendChild(links);

    return card;
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
    var locationElement = document.getElementById("cityName");
    locationElement.textContent = `${city} Restaurant`;
    console.log("event",lat,long)
    const restaurants= await getResturant(lat,long)
   createRestaurantCard(restaurants)

    // Adding the restaurants to the DOM
    const grid = document.getElementById('restaurantsGrid');
    restaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        grid.appendChild(restaurantCard);
    });
});

function updateRestaurantsDOM(restaurants) {
    const grid = document.getElementById('restaurantsGrid');
    // Clear existing content
    grid.innerHTML = '';

    restaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        grid.appendChild(restaurantCard);
    });
}

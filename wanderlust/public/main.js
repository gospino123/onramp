// Foursquare API Info
const clientId = 'KF0YSDIVBOFQUVW5AHPBY2TLSIL0LPHNODQUV0X31QCBO3YH'; // Unique to project
const clientSecret = 'MQTORTWEAQZDASLQTNJS13H3ACNZ50IXUOUDWUHLKNMKPMM2'; // Unique to project
const url = 'https://api.foursquare.com/v2/venues/explore?near='; // From Foursquare documentation

// OpenWeather Info
const openWeatherKey = '4ac5cc700e6c0e5a7f3c3e63d8fa52ba';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?';

// Add Parameters (for future refactor)
// const addParam = param => `&${param}=`;

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20210926`; // This can be refactored
  // Orig url ? near = city & limit = 10 & id = cID & secret = cS & v = [DATE = YYYYMMDD]
  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      // console.log(response); // You can navigate to HTML included in response to see raw JSON code
      const jsonResponse = await response.json();
      // console.log(jsonResponse); // Same but json version
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      // console.log(venues);
      return venues;
    }
  } catch(error) {
    console.log(error);
  }
}

const getForecast = async () => {
  const city = $input.val();
  const urlToFetch = `${weatherUrl}q=${city}&APPID=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      // console.log(jsonResponse);
      return jsonResponse;
    }
  } catch(error) {
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    // Add your code here:
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`; // full icon img src
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  // Add your code here:
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues()
    .then(venues => renderVenues(venues));
  getForecast()
    .then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)
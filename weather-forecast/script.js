const statusText = document.getElementById('status');
const locationName = document.getElementById('locationName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const weatherBadge = document.getElementById('weatherBadge');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const coordinates = document.getElementById('coordinates');
const forecastList = document.getElementById('forecastList');
const refreshButton = document.getElementById('refreshButton');

function setStatus(message) {
  statusText.textContent = message;
}

function weatherCodeToLabel(code) {
  const weatherMap = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Heavy freezing rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Heavy rain showers',
    82: 'Violent rain showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  };

  return weatherMap[code] || 'Unknown conditions';
}

function formatDay(dateString) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(dateString));
}

function renderForecast(daily) {
  forecastList.innerHTML = '';

  const count = Math.min(5, daily.time.length);

  for (let index = 0; index < count; index += 1) {
    const day = document.createElement('article');
    day.className = 'forecast-item';

    const label = weatherCodeToLabel(daily.weather_code[index]);
    const maxTemp = Math.round(daily.temperature_2m_max[index]);
    const minTemp = Math.round(daily.temperature_2m_min[index]);
    const precipitation = Math.round(daily.precipitation_probability_max[index] || 0);

    day.innerHTML = `
      <p class="forecast-item__day">${formatDay(daily.time[index])}</p>
      <strong>${label}</strong>
      <p class="forecast-item__condition">High confidence daily forecast based on live data.</p>
      <div class="forecast-item__temps">
        <span>${maxTemp}°</span>
        <span>${minTemp}°</span>
      </div>
      <div class="forecast-item__meta">Rain chance ${precipitation}%</div>
    `;

    forecastList.appendChild(day);
  }
}

function renderCurrent(data, placeLabel) {
  const current = data.current;
  const currentWeatherLabel = weatherCodeToLabel(current.weather_code);

  locationName.textContent = placeLabel;
  temperature.textContent = `${Math.round(current.temperature_2m)}°`;
  condition.textContent = currentWeatherLabel;
  weatherBadge.textContent = currentWeatherLabel;
  feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
  humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  coordinates.textContent = `${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}`;
  renderForecast(data.daily);
}

async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (!response.ok) {
      throw new Error('Unable to resolve place name');
    }

    const data = await response.json();
    const parts = [data.city, data.principalSubdivision, data.countryName].filter(Boolean);
    return parts.join(', ') || 'Current location';
  } catch {
    return 'Current location';
  }
}

async function loadWeather(latitude, longitude) {
  setStatus('Loading live weather data...');

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Weather request failed');
  }

  const data = await response.json();
  const placeLabel = await reverseGeocode(latitude, longitude);
  renderCurrent(data, placeLabel);
  setStatus(`Updated just now for ${placeLabel}.`);
}

function showError(message) {
  setStatus(message);
  locationName.textContent = 'Location unavailable';
  temperature.textContent = '--°';
  condition.textContent = 'Unable to load weather';
  weatherBadge.textContent = '--';
  feelsLike.textContent = '--°';
  humidity.textContent = '--%';
  windSpeed.textContent = '-- km/h';
  coordinates.textContent = '--';
  forecastList.innerHTML = '';
}

function requestLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported in this browser.');
    return;
  }

  setStatus('Requesting your current location...');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        await loadWeather(latitude, longitude);
      } catch (error) {
        showError(error.message || 'Unable to load weather data.');
      }
    },
    () => {
      showError('Location access was denied. Allow location access and try again.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

refreshButton.addEventListener('click', requestLocation);

setStatus('Click "Use current location" to fetch live weather.');

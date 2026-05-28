const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const result = document.getElementById('result');
const locationEl = document.getElementById('location');
const summaryEl = document.getElementById('summary');
const detailsEl = document.getElementById('details');
const errorEl = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  showLoading();
  try {
    const geo = await fetchGeo(city);
    if (!geo) throw new Error('Location not found');
    const weather = await fetchWeather(geo.latitude, geo.longitude);
    if (!weather) throw new Error('Weather data unavailable');
    render(geo, weather);
  } catch (err) {
    showError(err.message || 'Failed to fetch weather');
  }
});

function showLoading(){
  errorEl.classList.add('hidden');
  result.classList.add('card');
  result.classList.remove('hidden');
  locationEl.textContent = 'Loading...';
  summaryEl.textContent = '';
  detailsEl.innerHTML = '';
}

function showError(msg){
  result.classList.add('hidden');
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

async function fetchGeo(city){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const r = data.results[0];
  return {name: r.name, country: r.country, latitude: r.latitude, longitude: r.longitude};
}

async function fetchWeather(lat, lon){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API failed');
  const data = await res.json();
  return data.current_weather || null;
}

function weatherCodeToText(code){
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Mainly clear to partly cloudy';
  if (code >= 45 && code <= 48) return 'Fog or depositing rime fog';
  if (code >= 51 && code <= 67) return 'Drizzle / Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 86) return 'Rain showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

function render(geo, weather){
  errorEl.classList.add('hidden');
  result.classList.remove('hidden');
  locationEl.textContent = `${geo.name}, ${geo.country}`;
  summaryEl.textContent = `${weather.temperature}°C — ${weatherCodeToText(weather.weathercode)}`;
  detailsEl.innerHTML = '';
  const items = [
    [`Temperature`, `${weather.temperature} °C`],
    [`Wind Speed`, `${weather.windspeed} km/h`],
    [`Wind Direction`, `${weather.winddirection}°`],
    [`Weather Code`, `${weather.weathercode}`],
    [`Time (UTC)`, weather.time]
  ];
  items.forEach(([k,v]) => {
    const li = document.createElement('li');
    li.textContent = `${k}: ${v}`;
    detailsEl.appendChild(li);
  });
}

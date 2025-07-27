import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity]       = useState('London');
  const [input, setInput]     = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`, {
            params: { q: city, appid: API_KEY, units: 'metric' }
          }
        );
        setWeather(data);
      } catch {
        setError('Could not fetch weather');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) setCity(input.trim());
  };

  return (
    <div className="app-container">
      <div className="bg-animation"></div>
      <form className="weather-card" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter city"
        />
        <button type="submit">Go</button>

        {loading && <p>Loading…</p>}
        {error   && <p style={{ color: 'red' }}>{error}</p>}

        {weather && !error && (
          <div>
            <h2>{weather.name}</h2>
            <WeatherIcon main={weather.weather[0].main} />

            <p>
              {weather.main.temp}°C • {weather.weather[0].description}
            </p>
          </div>
        )}
      </form>
    </div>
  );
  function WeatherIcon({ main }) {
  switch (main) {
    case 'Clear':
      return <span className="weather-icon sun" title="Clear">☀️</span>;
    case 'Clouds':
      return <span className="weather-icon cloud" title="Clouds">☁️</span>;
    case 'Rain':
      return <span className="weather-icon rain" title="Rain">🌧️</span>;
    case 'Drizzle':
      return <span className="weather-icon drizzle" title="Drizzle">🌦️</span>;
    case 'Thunderstorm':
      return <span className="weather-icon thunder" title="Thunderstorm">⛈️</span>;
    case 'Snow':
      return <span className="weather-icon snow" title="Snow">❄️</span>;
    case 'Mist':
    case 'Fog':
      return <span className="weather-icon mist" title="Mist">🌫️</span>;
    default:
      return <span className="weather-icon" title={main}>🌡️</span>;
  }
}
}
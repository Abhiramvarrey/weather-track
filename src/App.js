import React, { useState, useEffect ,useCallback } from 'react';
import './styles.css';

import cloudyImage from './assets/cloud.png';
import rainyImage from './assets/rain.png';
import snowImage from './assets/snow.png';
import windyImage from './assets/wind.png';
import clearImage from './assets/clear.png';
import drizzleImage from './assets/drizzle.png'
import humidImage from './assets/humidity.png';
import searchIcon from './assets/search.png'
function App() {
  const [cityname, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // API Key (consider using environment variables in production)
  const API_KEY = process.env.REACT_APP_API_KEY;
  // Function to fetch weather by city name
  
  // Wrapping fetchWeatherByCity in useCallback
  const fetchWeatherByCity = useCallback((city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setWeatherData(null);
      });
  }, [API_KEY]); // Only redefined if API_KEY changes

  // Wrapping fetchWeatherByCoords in useCallback
  const fetchWeatherByCoords = useCallback((lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [API_KEY]);
  
  // Get user's current location
  const getUserLocation = useCallback(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        fetchWeatherByCity('London');
      }
    );
  } else {
    fetchWeatherByCity('London');
  }
}, [fetchWeatherByCoords, fetchWeatherByCity]); // Add dependencies if required

useEffect(() => {
  getUserLocation();
}, [getUserLocation]);

  // Search function
  const search = () => {
    if (cityname.trim()) {
      fetchWeatherByCity(cityname);
    }
  };

  // Image mapping
  const getWeatherImage = (condition) => {
    switch(condition?.toLowerCase()) {
      case 'clear':
        return clearImage;
      case 'clouds':
        return cloudyImage;
      case 'rain':
        return rainyImage;
      case 'snow':
        return snowImage;
      case 'wind':
        return windyImage;
      case 'drizzle':
        return drizzleImage;
      case 'humidity':
        return humidImage;
      default:
        return clearImage; // Default image
    }
  };
   
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='weatherbox'>
      <div className='search'>
        <div className='search-container'>
          <img 
            src={ searchIcon} 
            alt="Search" 
            className='search-icon' 
          />
          <input 
            type='text' 
            placeholder='Enter City Name'
            value={cityname} 
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && search()}
          />
        </div>
        <button onClick={search}>Search</button>
      </div>

      {error && (
          <div className="error-message">
            <h3>Error Occurred</h3>
            <p>{error}</p>
            <details>
              <summary>Troubleshooting Tips</summary>
              <ul>
                <li>Check your internet connection</li>
                <li>Verify city name spelling</li>
              </ul>
            </details>
          </div>
        )}
      {weatherData && (
        <div className='output'>
          <h1>{weatherData.name}, {weatherData.sys?.country}</h1>
          <img 
            src={getWeatherImage(weatherData.weather?.[0]?.main)} 
            alt="Weather Condition" 
          />
          <h1>{Math.round(weatherData.main?.temp)}°C</h1>
          <p>{weatherData.weather?.[0].description}</p>
          <p>{formatDate(weatherData.dt)}</p>

          <div className='extended-details'>
            <div className='detail-card'>
              <h3>Humidity</h3>
              <p>{weatherData.main?.humidity}%</p>
            </div>
            <div className='detail-card'>
              <h3>Wind Speed</h3>
              <p>{weatherData.wind?.speed} km/h</p>
            </div>
            <div className='detail-card'>
              <h3>Pressure</h3>
              <p>{weatherData.main?.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;

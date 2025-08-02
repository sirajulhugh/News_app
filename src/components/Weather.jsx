import React, { useEffect, useState } from 'react';
import './Weather.css';
import axios from 'axios';

const Weather = () => {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('Abuja');

  const search = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c4f69944f28d91f6f0e1fd56963ffc2c`;

    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log('Weather type:', response.data.weather[0].main);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setData(null);
    }
  };

  useEffect(() => {
    search(query);
  }, []);

  const handleSearch = () => {
    if (query.trim() !== '') {
      search(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (weatherType) => {
    if (!weatherType) return 'bxs-question-mark';

    switch (weatherType.toLowerCase()) {
      case 'clear': return 'bxs-sun';
      case 'clouds': return 'bxs-cloud';
      case 'rain': return 'bxs-cloud-rain';
      case 'thunderstorm': return 'bxs-cloud-lightning';
      case 'snow': return 'bxs-snowflake';
      case 'mist':
      case 'haze':
      case 'fog': return 'bxs-fog';
      case 'drizzle': return 'bxs-cloud-drizzle';
      case 'smoke': return 'bxs-hot';
      case 'dust':
      case 'sand':
      case 'ash': return 'bxs-cloud';
      default: return 'bxs-question-mark';
    }
  };

  const getWeatherBackground = (weatherType) => {
    const type = weatherType?.toLowerCase() || '';

    const backgroundMap = {
      clear: 'bg-clear',
      clouds: 'bg-clouds',
      rain: 'bg-rain',
      thunderstorm: 'bg-thunderstorm',
      snow: 'bg-snow',
      mist: 'bg-mist',
      haze: 'bg-mist',
      fog: 'bg-mist',
      drizzle: 'bg-drizzle',
      smoke: 'bg-smoke',
      dust: 'bg-dust',
      sand: 'bg-dust',
      ash: 'bg-dust',
    };

    return backgroundMap[type] || 'bg-default';
  };

  const getAnimationClass = (weatherType) => {
    if (!weatherType) return '';

    switch (weatherType.toLowerCase()) {
      case 'clear': return 'sun-anim';
      case 'clouds': return 'cloud-anim';
      case 'rain':
      case 'drizzle': return 'rain-anim';
      default: return '';
    }
  };

  const weatherType = data?.weather?.[0]?.main;
  const weatherIcon = getWeatherIcon(weatherType);
  const weatherBackground = getWeatherBackground(weatherType);
  const animationClass = getAnimationClass(weatherType);

  return (
    <div className={`weather ${weatherBackground}`}>
      <div className='search'>
        <div className='search-top'>
          <i className='fa-solid fa-location-dot'></i>
          <div className='location'>{data?.name || 'City not found'}</div>
        </div>

        <div className='search-location'>
          <input
            type='text'
            placeholder='Enter location'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <i
            className='fa-solid fa-magnifying-glass'
            onClick={handleSearch}
            style={{ cursor: 'pointer' }}
          ></i>
        </div>
      </div>

      {data ? (
        <div className='weather-data'>
          <i className={`bx ${weatherIcon} ${animationClass}`} style={{ fontSize: '3rem' }}></i>
          <div className='weather-type'>{weatherType}</div>
          <div className='temp'>{Math.round(data.main?.temp)}°C</div>
        </div>
      ) : (
        <div className='weather-data'>
          <p>Weather data not available.</p>
        </div>
      )}
    </div>
  );
};

export default Weather;

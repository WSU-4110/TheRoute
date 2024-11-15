import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { Geocoder } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  const directionsControlRef = useRef();

  const [instructions, setInstructions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [startCoords, setStartCoords] = useState([-83.06680531, 42.35908111]);
  const [endCoords, setEndCoords] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plannedLocations, setPlannedLocations] = useState('');
  const [weather, setWeather] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    // Initialize the map
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: startCoords,
      zoom: 14,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartCoords([longitude, latitude]);
          mapInstanceRef.current.setCenter([longitude, latitude]);
        },
        (error) => {
          console.error('Error fetching user location:', error);
        },
        { enableHighAccuracy: true }
      );
    }

    directionsControlRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    });
    mapInstanceRef.current.addControl(directionsControlRef.current, 'top-left');

    // Event listener for changes in destination (point B)
    directionsControlRef.current.on('destination', (e) => {
      if (e && e.feature && e.feature.geometry) {
        const [lon, lat] = e.feature.geometry.coordinates;

        // Update endCoords only if they have changed to avoid unnecessary fetches
        if (!endCoords || endCoords[0] !== lon || endCoords[1] !== lat) {
          setEndCoords([lon, lat]);
        }
      }
    });

    return () => {
      mapInstanceRef.current.removeControl(directionsControlRef.current);
      mapInstanceRef.current.remove();
    };
  }, []);

  // Effect for fetching weather information when endCoords change
  useEffect(() => {
    if (endCoords) {
      fetchWeather(endCoords[1], endCoords[0]);
    }
  }, [endCoords]);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
      );

      if (response.status !== 200) throw new Error(`Invalid response status: ${response.status}`);

      const weatherData = await response.json();
      console.log("Fetched weather data:", weatherData);

      if (!weatherData || !weatherData.main || !weatherData.weather) {
        throw new Error('Invalid weather data');
      }

      // Update weather state only if the data has changed
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null);
    }
  };

  const handleCityInput = async () => {
    const coordinates = await getCoordinates(cityInput);
    if (coordinates) {
      setStartCoords([coordinates.lon, coordinates.lat]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: [coordinates.lon, coordinates.lat],
          zoom: 14,
        });
      }
      setEndCoords([coordinates.lon, coordinates.lat]);
    } else {
      console.error('Could not get coordinates for the given city/state.');
    }
  };

  const getCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `https://pro.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        console.error('City not found!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <div>
      {weather && (
        <div 
          className={`weather-overlay ${isWeatherExpanded ? 'expanded' : ''}`}
          onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
        >
          <h3 className="weather-title">Weather at Destination</h3>
          <div className="weather-basic-info">
            <div className="weather-main">
              <img
                src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
              />
              <p className="temp-main">{Math.round(weather.main.temp)}°F</p>
            </div>
            <p className="temp-range">
              H: {Math.round(weather.main.temp_max)}°F  
              L: {Math.round(weather.main.temp_min)}°F
            </p>
            <p className="weather-description">{weather.weather[0].description}</p>
          </div>

          {isWeatherExpanded && (
            <div className="weather-details">
              <p>Feels Like: {Math.round(weather.main.feels_like)}°F</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      )}
      
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}

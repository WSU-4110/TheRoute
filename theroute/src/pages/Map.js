import React, { useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '../styles/App.css';
import { Geocoder } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';

export const Map = () => {
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
  const weatherBackgrounds = {
    Clouds: "url('/images/cloudy.jpg')",
    Clear: "url('/images/clear.jpg')",
    Rain: "url('/images/rainy.jpg')",
    Snow: "url('/images/snowy.jpg')",
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    // Initialize the map
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: startCoords,
      zoom: 14,
    });

    new mapboxgl.Marker().setLngLat(startCoords).addTo(mapInstanceRef.current);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartCoords([longitude, latitude]);
          mapInstanceRef.current.setCenter([longitude, latitude]);
          new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(mapInstanceRef.current);
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

    return () => {
      mapInstanceRef.current.removeControl(directionsControlRef.current);
      mapInstanceRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (startCoords && endCoords) {
      directionsControlRef.current.setOrigin(startCoords);
      directionsControlRef.current.setDestination(endCoords);
      getRoute(startCoords, endCoords);
      fetchWeather(endCoords[0], endCoords[1]);
    }
  }, [startCoords, endCoords]);

  const getCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `https://pro.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
      } else {
        console.error('City not found!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips');
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
      );

      if (response.status !== 200) throw new Error(`Invalid response status: ${response.status}`);
      
      const weatherData = response.json();
      if (!weatherData || !weatherData.main || !weatherData.weather) {
        throw new Error('Invalid weather data');
      }

      setWeather(weatherData);
     
    } catch (error) {
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
      fetchWeather(coordinates.lat, coordinates.lon);
    } else {
      console.error('Could not get coordinates for the given city/state.');
    }
  };

  async function getRoute(start, end) {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const newInstructions = data.legs[0].steps.map((step) => step.maneuver.instruction);
      setInstructions(newInstructions);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  const handleAddTrip = async (e) => {
    e.preventDefault();
    const tripData = {
      startLocation: startCoords.join(','),
      endCoords,
      tripDistance,
      tripDate,
      email,
      vehicleInfo,
      expenses,
      plannedLocations,
    };

    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        fetchTrips();
      } else {
        console.error('Error adding trip');
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  return (
    <div>
       {weather && (
          <div className="weather-overlay"
          style={{
            backgroundImage: weather ? weatherBackgrounds[weather.weather[0].main] : null,
            backgroundSize: 'cover',
          }}
          >
            <h3>Weather at Destination</h3>
            <p>Temperature: {Math.round(weather.main.temp)} °F</p>
            <p>Feels Like: {Math.round(weather.main.feels_like)} °F</p> {/* Added Feels Like */}
            <p>Condition: {weather.weather[0].description}</p>
            <img 
              src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} 
              alt={weather.weather[0].description} 
            />
            <p>Humidity: {weather.main.humidity} %</p>
            <p>Pressure: {weather.main.pressure} hPa</p> {/* Pressure */}
            <p>Visibility: {(weather.visibility / 1000).toFixed(1)} km</p> {/* Visibility */}
            
            <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p> {/* Sunrise time */}
            <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p> {/* Sunset time */}
            
          </div>
        )}
      <div className='trip-button'>
        <Link to="/setup">
        <button>Add a Trip</button>
        </Link>
      </div>
      <div className='expenses'>
        <Link to='/add-expense'>
        <button>Expenses</button>
        </Link>
      </div>
      <dive className='home-button'>
        <Link to='/'>
          <button>Home</button>
        </Link>
      </dive>
     
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default Map;
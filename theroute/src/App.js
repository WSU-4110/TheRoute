import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import axios from 'axios';
import './App.css';
import { Geocoder } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';

//console.log('Weather API Key:', process.env.REACT_APP_WEATHER_API_KEY);

const App = () => {
  console.log('Weather API Key:', process.env.REACT_APP_WEATHER_API_KEY);
  const weatherBackgrounds = {
    Clouds: "url('/images/cloudy.jpg')",
    Clear: "url('/images/clear.jpg')",
    Rain: "url('/images/rainy.jpg')",
    Snow: "url('/images/snowy.jpg')",
  };

  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  const directionsControlRef = useRef();

  const [instructions, setInstructions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [startCoords, setStartCoords] = useState([-83.04622,42.33140]);
  const [endCoords, setEndCoords] = useState(null);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [trips, setTrips] = useState([]);
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plannedLocations, setPlannedLocations] = useState('');
  const [weather, setWeather] = useState(null);
  const [cityInput, setCityInput] = useState('');

  useEffect(() => {
    
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: startCoords,
      zoom: 14,
    });

    new mapboxgl.Marker().setLngLat(startCoords).addTo(mapInstanceRef.current);

    directionsControlRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    });
    mapInstanceRef.current.addControl(directionsControlRef.current, 'top-left');
    directionsControlRef.current.on('origin', (e) => {
      if (e && e.feature && e.feature.geometry && e.feature.geometry.coordinates) {
        const [lon, lat] = e.feature.geometry.coordinates;
        setStartCoords([lon, lat]);
        fetchWeather(lat, lon);
      }
    });

    // Event listener for setting the destination (B)
    directionsControlRef.current.on('destination', (e) => {
      if (e && e.feature && e.feature.geometry && e.feature.geometry.coordinates) {
        const [lon, lat] = e.feature.geometry.coordinates;
        fetchWeather(lat, lon);
      }
    });

    return () => {
      mapInstanceRef.current.removeControl(directionsControlRef.current);
      mapInstanceRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (startCoords) {
      // When startCoords change, update map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: startCoords,
          zoom: 14,
        });

        new mapboxgl.Marker().setLngLat(startCoords).addTo(mapInstanceRef.current);
      }
    }
  }, [startCoords]);

  useEffect(() => {
    if (endCoords) {
      directionsControlRef.current.setDestination(endCoords);
      getRoute(endCoords);
      fetchWeather(endCoords[0], endCoords[1]);
    }
  }, [endCoords]);
  const getCoordinates = async (cityName) => {
    try {
      const response = await axios.get(
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

  //const weatherCache = {};
  const fetchWeather = async (lat, lon) => {
    try {
      console.log('Fetching weather for:', lat, lon);
      const response = await axios.get(
        `https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
      );

      if (response.status !== 200) throw new Error(`Invalid response status: ${response.status}`);
      
      const weatherData = response.data;
      if (!weatherData || !weatherData.main || !weatherData.weather) {
        throw new Error('Invalid weather data');
      }
      //weatherCache[cacheKey] = weatherData; // Cache the data
      

      setWeather(weatherData);
      console.log('Updated weather state:', weather); 
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
      fetchWeather(coordinates.lat, coordinates.lon);
    } else {
      console.error('Could not get coordinates for the given city/state.');
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

  async function getRoute(start, end) {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const newInstructions = data.legs[0].steps.map((step) => step.maneuver.instruction);
      setInstructions(newInstructions);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  const handleGeocoderChange = (event) => {
    const selectedResult = event.result;
    if (selectedResult && selectedResult.geometry) {
      const [lng, lat] = selectedResult.geometry.coordinates;
      setEndCoords([lng, lat]);
      setEndLocation(selectedResult.place_name);
      fetchWeather(lat, lng); // Swapped lat and lng
    }
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    const tripData = {
      startLocation: startCoords.join(','),
      endLocation,
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
    <div style={{ position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '60vh' }}>
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
      </div>
      
      
      <Geocoder
        accessToken={process.env.REACT_APP_MAPBOX_ACCESS_KEY}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        onChange={handleGeocoderChange}
        value={inputValue}
        marker
      />
      
      
      

      <div className="trip-form">
        <h2>Add a Trip</h2>
        <form onSubmit={handleAddTrip}>
          <label>
            Start Location:
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Enter start location"
            />
          </label>
          <br />
          <label>
            End Location:
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              placeholder="Enter end location"
            />
          </label>
          <br />
          <label>
            Trip Distance (in miles):
            <input
              type="number"
              value={tripDistance}
              onChange={(e) => setTripDistance(e.target.value)}
              placeholder="Enter trip distance"
            />
          </label>
          <br />
          <label>
            Trip Date:
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </label>
          <br />
          <label>
            Vehicle Information:
            <input
              type="text"
              value={vehicleInfo}
              onChange={(e) => setVehicleInfo(e.target.value)}
              placeholder="Enter vehicle info"
            />
          </label>
          <br />
          <label>
            Planned Locations:
            <textarea
              value={plannedLocations}
              onChange={(e) => setPlannedLocations(e.target.value)}
              placeholder="Enter planned locations"
            />
          </label>
          <br />
          <label>
            Expenses:
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="Enter expenses"
            />
          </label>
          <br />
          <button type="submit">Save Trip</button>
        </form>

        <h2>Trip List</h2>
        <ul>
          {trips.map((trip, index) => (
            <li key={index}>
              From {trip.startLocation} to {trip.endLocation}, Distance: {trip.tripDistance} miles, 
              Date: {new Date(trip.tripDate).toLocaleDateString()}, Email: {trip.email}, 
              Vehicle: {trip.vehicleInfo}, Expenses: ${trip.expenses}, 
              Planned Locations: {trip.plannedLocations}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

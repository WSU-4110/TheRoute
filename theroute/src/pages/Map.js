import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  const directionsControlRef = useRef();

  const [startCoords, setStartCoords] = useState([-83.06680531, 42.35908111]);
  const [endCoords, setEndCoords] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

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
    const nav = new mapboxgl.NavigationControl();

    directionsControlRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      controls: { inputs: false },
      interactive: false,
    });

    mapInstanceRef.current.addControl(nav, 'top-left');
    mapInstanceRef.current.addControl(directionsControlRef.current,'top-left');

    mapInstanceRef.current.on('click', (e) => {
      e.preventDefault();  // Prevent the default click behavior
    });

    directionsControlRef.current.on('destination', (e) => {
      if (e && e.feature && e.feature.geometry) {
        const [lon, lat] = e.feature.geometry.coordinates;

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

  const handleGeocoderResult = (type, coordinates) => {
    if (type === 'start') {
      setStartCoords(coordinates);
      directionsControlRef.current.setOrigin(coordinates);
    } else if (type === 'end') {
      setEndCoords(coordinates);
      directionsControlRef.current.setDestination(coordinates);
    } else if (type === 'waypoint') {
      setWaypoints((prevWaypoints) => {
        const newWaypoints = [...prevWaypoints, coordinates];
        directionsControlRef.current.addWaypoint(prevWaypoints.length, coordinates);
        return newWaypoints;
      });
    }
  };

  const addGeocoder = (type, placeholder) => {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: placeholder,
    });

    geocoder.on('result', (event) => {
      const location = event.result.geometry.coordinates;
      handleGeocoderResult(type, location);
    });

    const container = document.getElementById(`${type}-input`);
    if (container) {
      container.appendChild(geocoder.onAdd(mapInstanceRef.current));
    }
  };
  
  

  useEffect(() => {
    addGeocoder('start', 'Enter start location');
    addGeocoder('end', 'Enter end location');
    addGeocoder('waypoint', 'Enter waypoint location');
    return () => {
      // Cleanup geocoder elements
      ['start-input', 'end-input', 'waypoint-input'].forEach((id) => {
        const geocoder = document.querySelector(`#${id} .mapboxgl-ctrl-geocoder`);
        if (geocoder) geocoder.remove();
      });
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

  const addMarkers = () => {
    const startMarker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat(startCoords)
      .addTo(mapInstanceRef.current);
  
    const startPopup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h3>Start Location</h3><p>Coordinates: ${startCoords.join(', ')}</p><p>Date: ${new Date().toLocaleDateString()}</p>`);
  
    startMarker.setPopup(startPopup);
    startMarker.togglePopup();
  
    if (endCoords) {
      const endMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(endCoords)
        .addTo(mapInstanceRef.current);
  
      const endPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>End Location</h3><p>Coordinates: ${endCoords.join(', ')}</p><p>Date: ${new Date().toLocaleDateString()}</p>`);
  
      endMarker.setPopup(endPopup);
      endMarker.togglePopup();
    }
  
    waypoints.forEach((coordinates, index) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(mapInstanceRef.current);
  
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>Waypoint ${index + 1}</h3><p>Coordinates: ${coordinates.join(', ')}</p><p>Date: ${new Date().toLocaleDateString()}</p>`);
  
      marker.setPopup(popup);
      marker.togglePopup();
    });
  };
  

  useEffect(() => {
    if (mapInstanceRef.current && waypoints.length > 0) {
      addMarkers();
    }
  }, [waypoints]);

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
      <div className="input">
        <div id="start-input"></div>
        <div id="end-input" ></div>
        <div id="waypoint-input" ></div>
      </div>
    
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}
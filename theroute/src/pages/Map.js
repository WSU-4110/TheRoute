import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
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
  const [waypoints, setWaypoints] = useState([]);
  const [weather, setWeather] = useState(null);
  const [waypointInput, setWaypointInput] = useState('');

  const weatherBackgrounds = {
    Clouds: "url('/images/cloudy.jpg')",
    Clear: "url('/images/clear.jpg')",
    Rain: "url('/images/rainy.jpg')",
    Snow: "url('/images/snowy.jpg')",
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartCoords([longitude, latitude]);
          mapInstanceRef.current.setCenter([longitude, latitude]);
        },
        (error) => console.error('Error fetching user location:', error),
        { enableHighAccuracy: true }
      );
    }

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: startCoords,
      zoom: 14,
    });

    const nav = new mapboxgl.NavigationControl();

    directionsControlRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    });

    mapInstanceRef.current.addControl(nav);
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
  }, [startCoords, endCoords, waypoints]);

  

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

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
      );

      if (response.status !== 200) throw new Error(`Invalid response status: ${response.status}`);

      const weatherData = await response.json();

      if (!weatherData || !weatherData.main || !weatherData.weather) {
        throw new Error('Invalid weather data');
      }

      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null);
    }
  };

  return (
    <div>
      <div className="trip-button">
        <Link to="/setup">
          <button>Add a Trip</button>
        </Link>
        </div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      
    </div>
  );
}

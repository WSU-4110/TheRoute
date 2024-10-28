import React, { useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '../App.css';
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
    }
  }, [startCoords, endCoords]);

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
      const route = data.geometry.coordinates;

      const newInstructions = data.legs[0].steps.map((step) => step.maneuver.instruction);
      setInstructions(newInstructions);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  return (
    <div>
      <div className='trip-button'>
        <Link to="/setup">
        <button>Add a Trip</button>
        </Link>
      </div>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

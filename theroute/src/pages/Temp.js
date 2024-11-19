import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/map.css';

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  const directionsControlRef = useRef();

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    // Initialize map
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-83.06680531, 42.35908111], // Default coordinates
      zoom: 14,
    });

    const nav = new mapboxgl.NavigationControl();
    directionsControlRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      controls: { inputs: false },
    });

    mapInstanceRef.current.addControl(nav);
    mapInstanceRef.current.addControl(directionsControlRef.current, 'top-left');

    return () => {
      mapInstanceRef.current.removeControl(directionsControlRef.current);
      mapInstanceRef.current.remove();
    };
  }, []);

  // Function to add Geocoder to a custom input field
  const addGeocoderToInput = (containerId, type) => {

    
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: `Enter ${type} location`,
    });

    geocoder.on('result', (event) => {
      const location = event.result.geometry.coordinates;

      if (type === 'start') {
        setStartLocation(location);
        directionsControlRef.current.setOrigin(location);
      } else if (type === 'end') {
        setEndLocation(location);
        directionsControlRef.current.setDestination(location);
      } else if (type === 'waypoint') {
        setWaypoints([...waypoints, location]);
        directionsControlRef.current.addWaypoint(waypoints.length, location);
      }
      return () => {
        // Cleanup map and controls
        if (mapInstanceRef.current) mapInstanceRef.current.remove();
      };
    });

    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(geocoder.onAdd(mapInstanceRef.current));
    }
    
  };

  useEffect(() => {
    addGeocoderToInput('start-input', 'start');
    addGeocoderToInput('end-input', 'end');
    addGeocoderToInput('waypoint-input', 'waypoint');
    
  }, []);

  return (
    <div>
      <div className="input">
        <div id="start-input" className="input-container"></div>
        <div id="end-input" className="input-container"></div>
        <div id="waypoint-input" className="input-container"></div>
      </div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css'; // Assuming you have some custom styles

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Set Mapbox access token
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Ref to the map container div
      style: 'mapbox://styles/mapbox/outdoors-v12', // Your map style
      center: [-83.06680531, 42.35908111], // Starting position [lng, lat]
      zoom: 14, // Starting zoom
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default App;

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css'; // Assuming you have some custom styles
import { Geocoder } from "@mapbox/search-js-react";

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapWithGeocoder() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  //const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Set Mapbox access token
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    // Initialize Mapbox map
      mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // Ref to the map container div
      style: 'mapbox://styles/mapbox/outdoors-v12', // Your map style
      center: [-83.06680531, 42.35908111], // Starting position [lng, lat]
      zoom: 14, // Starting zoom
    });

    

    // Clean up on unmount
    return () => mapInstanceRef.current.remove();
  }, []);

  return (
    <>
      <Geocoder
        accessToken={process.env.REACT_APP_MAPBOX_ACCESS_KEY}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        marker
      />
      <div>
        {/* Map Container */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      </div>
    </>
  );
};

//export default App;

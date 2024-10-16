import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css'; // Assuming you have some custom styles

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  const mapContainerRef = useRef(null);
  const [instructions, setInstructions] = useState([]); // State to hold driving directions

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Ref to the map container div
      style: 'mapbox://styles/mapbox/streets-v12', // Your map style
      center: [-83.06680531, 42.35908111], // Detroit, MI [lng, lat]
      zoom: 18, // Starting zoom
    });

    // Add a marker for the starting point
    new mapboxgl.Marker().setLngLat([-83.06680531, 42.35908111]).addTo(map);

    // After the map loads, make a request for the route
    map.on('load', () => {
      const start = [-83.06680531, 42.35908111]; // Start coordinates (Detroit, MI)
      const end = [ -115.1391 ,36.1716]; // End coordinates (Another point in Detroit)

      // Call the function to get the route and instructions
      getRoute(start, end, map);
    });

    return () => map.remove();
  }, []);

  // Function to make a directions request and get instructions
  async function getRoute(start, end, map) {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      
      // Extract the driving instructions (steps)
      const instructions = data.legs[0].steps.map((step) => step.maneuver.instruction);
      setInstructions(instructions); // Update state with driving instructions

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };

      // If the route exists, update it, otherwise add it
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '70%', height: '100%' }} />
      
      {/* Instructions Container */}
      <div style={{ width: '30%', padding: '20px', overflowY: 'scroll' }}>
        <h2>Driving Directions</h2>
        <ul>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

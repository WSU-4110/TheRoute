import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import './App.css';
import { Geocoder } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  const directionsControlRef = useRef();
  const [instructions, setInstructions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [startCoords, setStartCoords] = useState([-83.06680531, 42.35908111]); // Default starting location
  const [endCoords, setEndCoords] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plannedLocations, setPlannedLocations] = useState('');

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_KEY;

    // Initialize the map
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: startCoords,
      zoom: 14,
    });

    // Add a marker for the starting location
    new mapboxgl.Marker().setLngLat(startCoords).addTo(mapInstanceRef.current);

    // Get user's current location
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
    } else {
      console.error('Geolocation not supported by this browser.');
    }

    // Add Directions Control
    directionsControlRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    });
    mapInstanceRef.current.addControl(directionsControlRef.current, 'top-left');

    // Clean up on unmount
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

  // Function to get route and directions
  async function getRoute(start, end) {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      // Extract driving instructions (steps)
      const newInstructions = data.legs[0].steps.map((step) => step.maneuver.instruction);
      setInstructions(newInstructions);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  // Handle form submission to add a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();
    const tripData = {
      startLocation: startCoords.toString(),
      endLocation: endCoords ? endCoords.toString() : '',
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
        console.log('Trip added successfully!');
        fetchTrips(); // Refresh trip list
      } else {
        console.error('Error adding trip');
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  return (
    <div>
      {/* Geocoder and Go Button */}
      <Geocoder
        accessToken={process.env.REACT_APP_MAPBOX_ACCESS_KEY}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(event) => {
          const selectedResult = event.result; // Get the search result
          if (selectedResult && selectedResult.geometry) {
            const [lng, lat] = selectedResult.geometry.coordinates;
            setEndCoords([lng, lat]); // Set the destination coordinates
            getRoute(startCoords, [lng, lat]);
          }
          setInputValue(event.value); // Set the input value properly
        }}
        marker
      />

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '60vh' }} />

      {/* Driving Instructions */}
      <div style={{ width: '30%', padding: '20px', overflowY: 'scroll' }}>
        <h2>Driving Directions</h2>
        <ul>
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>

      {/* Trip Form */}
      <div className="trip-form">
        <h2>Add a Trip</h2>
        <form onSubmit={handleAddTrip}>
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
          {trips.map((trip) => (
            <li key={trip.id}>
              From {trip.startLocation} to {trip.endLocation}, Distance: {trip.tripDistance} miles, Date: {new Date(trip.tripDate).toLocaleDateString()}, Email: {trip.email}, Vehicle: {trip.vehicleInfo}, Expenses: ${trip.expenses}, Planned Locations: {trip.plannedLocations}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

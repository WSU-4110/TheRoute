import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css'; // Assuming you have some custom styles
import { Geocoder } from "@mapbox/search-js-react";

// Import Mapbox CSS
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapWithGeocoder() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef();
  //const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [trips, setTrips] = useState([]);
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plannedLocations, setPlannedLocations] = useState('');

  useEffect(() => {
    // Log the access token to verify it's loaded correctly
    console.log("Mapbox Access Token:", process.env.REACT_APP_MAPBOX_ACCESS_KEY);

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

  // Fetch trips from backend
  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips');
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };
// Updated to handle trip details storage using Repository Pattern

  // Handle form submission to add a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

    const tripData = {
      startLocation,
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
      <div ref={mapContainerRef} style={{ width: '100%', height: '60vh' }} />

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
          {trips.map((trip) => (
            <li key={trip.id}>
              {trip.startLocation} to {trip.endLocation}, Distance: {trip.tripDistance} miles, Date: {new Date(trip.tripDate).toLocaleDateString()}, Email: {trip.email}, Vehicle: {trip.vehicleInfo}, Expenses: ${trip.expenses}, Planned Locations: {trip.plannedLocations}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
  );
};

//export default App;

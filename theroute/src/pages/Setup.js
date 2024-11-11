import React, { useEffect, useState } from 'react';
import '../styles/setup.css';
import { Link } from 'react-router-dom';

export const Setup = () => {
  const [startCoords, setStartCoords] = useState([-83.06680531, 42.35908111]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [trips, setTrips] = useState([]);
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plannedLocations, setPlannedLocations] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);

  // Fetch city name based on coordinates
  const getCityName = async () => {
    try {
      setIsFetchingLocation(true);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${startCoords[0]},${startCoords[1]}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN`
      );
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        setStartLocation(data.features[0].text);
      } else {
        setStartLocation('Unknown Location');
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
      setStartLocation('Error fetching location');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  useEffect(() => {
    getCityName();
  }, [startCoords]);

  // Fetch all saved trips from the backend
  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips');
      const data = await response.json();
      console.log("Fetched trips:", data); 
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle form submission to add a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

    if (!startLocation || startLocation === 'Unknown Location' || startLocation === 'Error fetching location') {
      console.error('Start location is not set properly. Please wait for the location to load.');
      return;
    }

    const tripData = {
      startLocation,
      endLocation: endLocation || null,
      tripDistance,
      tripDate,
      returnDate,
      email,
      vehicleInfo,
      expenses,
      plannedLocations,
    };

    console.log("Trip data to be sent:", tripData);

    try {
      // Save trip data to Local Storage
      const existingTrips = JSON.parse(localStorage.getItem('trips')) || [];
      existingTrips.push(tripData);
      localStorage.setItem('trips', JSON.stringify(existingTrips));
  
      // You can also save to backend here if needed
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
  
      if (response.ok) {
        console.log('Trip added successfully!');
        fetchTrips(); // Refresh trip list from backend if needed
      } else {
        console.error('Error adding trip');
      }
      fetchTrips(); // Refresh trip list from Local Storage
    } catch (error) {
      console.error('Error saving trip:', error);
  }
    
  };

  return (
    <div>
      <div className="trip-form">
        <h2>Add a Trip</h2>
        <form onSubmit={handleAddTrip}>
          <label>
            Starting Location:
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Enter starting location"
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
            Return Date:
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
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
          <button type="submit" disabled={isFetchingLocation}>
            {isFetchingLocation ? 'Loading Location...' : 'Save Trip'}
          </button>
        </form>
      </div>

      {/* Button to navigate to view saved trips page */}
      <div className="view-trips-button">
        <Link to="/view-trips">
          <button>View Saved Trips</button>
        </Link>
      </div>

      <Link to="/map">
        <button>Go to theRoute!</button>
      </Link>
    </div>
  );
};

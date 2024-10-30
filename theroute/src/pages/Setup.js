import React, { useEffect, useRef, useState } from 'react';
import '../styles/setup.css';
import {Link} from 'react-router-dom';

export const Setup = ()=>{
  const [startCoords, setStartCoords] = useState([-83.06680531, 42.35908111]); // Default starting location
  const [endCoords, setEndCoords] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plannedLocations, setPlannedLocations] = useState('');


  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips');
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

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
    <div >
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

        {trips.length > 1 && (
          <>
            <h2>Trip List</h2>
            <ul>
              {trips.map((trip, index) => (
                <li key={index}>
                From {trip.startLocation} to {trip.endLocation}, Distance: {trip.tripDistance} miles, 
                Date: {new Date(trip.tripDate).toLocaleDateString()}, Email: {trip.email}, 
                Vehicle: {trip.vehicleInfo}, Expenses: ${trip.expenses}, 
                Planned Locations: {trip.plannedLocations}
                </li>
              ))}
            </ul>
          </>
        )}
        <Link to="/">
          <button>Go to theRoute!</button>
        </Link>
      </div>
    </div>
  );
};
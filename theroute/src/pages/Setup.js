import React, { useEffect, useRef, useState } from 'react';
import { TripBuilder, Trip } from './Trip';
import '../styles/setup.css';
import {Link} from 'react-router-dom';



export const Setup: React.FC = () => {
  const [tripData, setTripData] = useState<Partial<Trip>>({});
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleChange = (field: keyof Trip, value: string) => {
    setTripData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const trip = new TripBuilder()
        .setStartLocation(tripData.startLocation || '')
        .setEndLocation(tripData.endLocation || '')
        .setTripDistance(tripData.tripDistance || '')
        .setTripDate(tripData.tripDate || '')
        .setEmail(tripData.email || '')
        .setVehicleInfo(tripData.vehicleInfo || '')
        .setExpenses(tripData.expenses || '')
        .setPlannedLocations(tripData.plannedLocations || '')
        .build();

      // Send trip to backend (mocked here)
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      });

      if (response.ok) {
        console.log('Trip added successfully!');
        setTrips([...trips, trip]); // Update state
      } else {
        console.error('Error adding trip');
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  return (
    <div className="trip-form">
      <h2>Add a Trip</h2>
      <form onSubmit={handleAddTrip}>
        <label>
          Start Location:
          <input
            type="text"
            value={tripData.startLocation || ''}
            onChange={(e) => handleChange('startLocation', e.target.value)}
            placeholder="Enter start location"
          />
        </label>
        <br />
        <label>
          End Location:
          <input
            type="text"
            value={tripData.endLocation || ''}
            onChange={(e) => handleChange('endLocation', e.target.value)}
            placeholder="Enter end location"
          />
        </label>
        <br />
        {/* Other fields (e.g., trip distance, date, etc.) similarly follow */}
        <button type="submit">Save Trip</button>
      </form>

      {trips.length > 0 && (
        <>
          <h2>Trip List</h2>
          <ul>
            {trips.map((trip, index) => (
              <li key={index}>
                From {trip.startLocation} to {trip.endLocation}, Distance: {trip.tripDistance} miles, Date: {new Date(trip.tripDate).toLocaleDateString()}, Email: {trip.email}, Vehicle: {trip.vehicleInfo}, Expenses: ${trip.expenses}, Planned Locations: {trip.plannedLocations}
              </li>
            ))}
          </ul>
        </>
      )}
      <Link to="/">
        <button>Go to theRoute!</button>
      </Link>
    </div>
  );
};
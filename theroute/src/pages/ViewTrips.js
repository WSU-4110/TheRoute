import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../styles/ViewTrips.css'; 
export default function ViewTrips() {
    const [trips, setTrips] = useState([]);
    const navigate = useNavigate(); // Hook to navigate programmatically


  // Fetch saved trips from the backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="view-trips">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h2>Saved Trips</h2>
      {trips.length > 0 ? (
        <table className="trips-table">
          <thead>
            <tr>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Distance (miles)</th>
              <th>Trip Date</th>
              <th>Return Date</th>
              <th>Email</th>
              <th>Vehicle</th>
              <th>Expenses</th>
              <th>Planned Locations</th>
            </tr>
          </thead>
          <tbody>
          {trips.map((trip, index) => (
              <tr key={index}>
                <td>{trip.startLocation}</td>
                <td>{trip.endLocation ? trip.endLocation : 'N/A'}</td>
                <td>{trip.tripDistance}</td>
                <td>{trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'N/A'}</td>
                <td>{trip.returnDate ? new Date(trip.returnDate).toLocaleDateString() : 'N/A'}</td>
                <td>{trip.email}</td>
                <td>{trip.vehicleInfo}</td>
                <td>${trip.expenses}</td>
                <td>{trip.plannedLocations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No trips have been saved yet.</p>
      )}
      
   
    </div>
  );
}
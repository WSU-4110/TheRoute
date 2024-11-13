import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/viewTrips.css';

export const ViewTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user's email
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      alert('Please log in to view your trips');
      navigate('/login');
      return;
    }

    // Get trips from localStorage and filter by user's email
    const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    const userTrips = savedTrips.filter(trip => trip.email === userEmail);
    setTrips(userTrips);
  }, [navigate]);

  return (
    <div className="view-trips-container">
      <h2>Your Saved Trips</h2>

      {trips.length === 0 ? (
        <div className="no-trips">
          <p>No trips found for {localStorage.getItem('userEmail')}</p>
          <Link to="/setup" className="add-trip-button">Add Your First Trip</Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip, index) => (
            <div key={index} className="trip-card">
              <div className="trip-header">
                <h3>{trip.startLocation} → {trip.endLocation}</h3>
                <span className="trip-date">{trip.tripDate}</span>
              </div>
              
              <div className="trip-details">
                <p><strong>Distance:</strong> {trip.tripDistance} miles</p>
                <p><strong>Return Date:</strong> {trip.returnDate}</p>
                <p><strong>Vehicle:</strong> {trip.vehicleInfo}</p>
                <p><strong>Expenses:</strong> ${trip.expenses}</p>
                {trip.plannedLocations && (
                  <p><strong>Planned Stops:</strong> {trip.plannedLocations}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="button-container">
        <Link to="/setup" className="add-trip-button">Add New Trip</Link>
      </div>
      
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewTrips;
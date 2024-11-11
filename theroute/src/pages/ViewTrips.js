import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/viewTrips.css';

export const ViewTrips = () => {
  const [trips, setTrips] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (userEmail) {
      const savedTrips = JSON.parse(localStorage.getItem('trips')) || [];
      const userTrips = savedTrips.filter(trip => trip.email === userEmail);
      setTrips(userTrips);
      setIsEmailSubmitted(true);
    }
  };

  return (
    <div className="view-trips-container">
      <h2>Your Saved Trips</h2>

      {!isEmailSubmitted ? (
        <div className="email-form-container">
          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email to view trips"
              required
            />
            <button type="submit">View My Trips</button>
          </form>
        </div>
      ) : (
        <>
          <p className="user-email">Showing trips for: {userEmail}</p>
          
          {trips.length === 0 ? (
            <div className="no-trips">
              <p>No trips found for {userEmail}</p>
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
            <button 
              onClick={() => setIsEmailSubmitted(false)} 
              className="change-email-button"
            >
              Change Email
            </button>
            <Link to="/setup" className="add-trip-button">Add New Trip</Link>
          </div>
        </>
      )}
      
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ViewTrips;
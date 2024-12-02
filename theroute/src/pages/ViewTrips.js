import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../components/axios';
import { AuthContext } from '../context/AuthContext';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/viewTrips.css';

const ViewTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { getAccessToken } = useContext(AuthContext);  // Context for retrieving the access token
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = await getAccessToken();  // Get the access token
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      // Fetch trips from the API
      const response = await axiosInstance.get('/trips/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrips(response.data);  // Set the trip data to state
      setLoading(false);
    } catch (error) {
      setErrorMessage('Error fetching trips');  // Handle any errors
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      const token = await getAccessToken();  // Get the access token for deletion
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      await axiosInstance.delete(`/trips/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted trip from state
      setTrips(trips.filter(trip => trip.id !== id));
      setErrorMessage('');
    } catch (error) {
      console.error("Failed to delete trip:", error.response?.data || error);
      setErrorMessage("Failed to delete trip. Please try again.");
    }
  };
  return (
    <div className="view-trips-container">
      <h2>Your Saved Trips</h2>

      {loading ? (
        <div className="loading-message">Loading trips...</div>
      ) : errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : trips.length === 0 ? (
        <div className="no-trips">
          <p>No trips found for {localStorage.getItem('userEmail')}</p>
          <Link to="/setup" className="add-trip-button">Add Your First Trip</Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip, index) => (
            <div key={index} className="trip-card">
              <div className="trip-header">
                <h3>{trip.start_location} → {trip.end_location}</h3>
                <span className="trip-date">{new Date(trip.start_date).toLocaleDateString()}</span>
              </div>

              <div className="trip-details">
                <p><strong>Trip Name:</strong> {trip.trip_name}</p>
                <p><strong>Distance:</strong> {trip.trip_distance} mi</p>
                <p><strong>Start Date:</strong> {new Date(trip.start_date).toLocaleDateString()}</p>
                <p><strong>Return Date:</strong> {new Date(trip.end_date).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> ${trip.budget}</p>
                {trip.plannedLocations && (
                  <p><strong>Planned Stops:</strong> {trip.plannedLocations}</p>
                )}
              </div>

              <button className="delete-trip" onClick={() => handleDeleteTrip(trip.id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="button-container">
        <Link to="/setup" className="back-button">Add Trip</Link>
      </div>
    </div>
  );
};

export default ViewTrips;

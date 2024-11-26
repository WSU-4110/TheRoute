import React, { useEffect, useState, useContext } from 'react';
import '../styles/setup.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export const Setup = () => {
  const { getAccessToken } = useContext(AuthContext);
  const [tripName, setTripName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [tripDistance, setTripDistance] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [email, setEmail] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const navigate = useNavigate();

  // Initialize state with data from local storage
  useEffect(() => {
    const storedTripData = localStorage.getItem('tripData');
    
    // If tripData exists, parse it and set the state values
    if (storedTripData) {
      const { startLocation, endLocation, tripDistance, email } = JSON.parse(storedTripData);

      setStartLocation(startLocation || '');
      setEndLocation(endLocation || '');
      setTripDistance(tripDistance || '');
      setEmail(email || '');
    }

    // Set start and end addresses from local storage
    setStartAddress(localStorage.getItem('startAddress') || '');
    setEndAddress(localStorage.getItem('endAddress') || '');

    setIsFetchingLocation(false);
  }, []);

  // Handle form submission to add a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

    // Validate fields
    let errors = {};
    if (!tripName) errors.tripName = '*Trip Name is required';
    if (!startLocation) errors.startLocation = '*Starting Location is required';
    if (!endLocation) errors.endLocation = '*End Location is required';
    if (!tripDistance) errors.tripDistance = '*Trip Distance is required';
    if (!startDate) errors.tripDate = '*Trip Date is required';
    if (!endDate) errors.returnDate = '*Return Date is required';
    if (!email) errors.email = '*Email is required';
    if (!budget) errors.budget = '*Budget is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors
      return; // Prevent form submission if there are errors
      setValidationErrors(errors);
      return;
    }

    // Check for empty required fields and display error next to the empty fields
    let valid = true;
    setErrorMessage('');
    let errorObj = {};

    if (!tripName) {
      errorObj.tripName = 'Trip Name is required';
      valid = false;
    }
    if (!startLocation) {
      errorObj.startLocation = 'Starting Location is required';
      valid = false;
    }
    if (!endLocation) {
      errorObj.endLocation = 'End Location is required';
      valid = false;
    }
    if (!tripDistance) {
      errorObj.tripDistance = 'Total Distance is required';
      valid = false;
    }
    if (!startDate) {
      errorObj.startDate = 'Trip Date is required';
      valid = false;
    }
    if (!endDate) {
      errorObj.endDate = 'End Date is required';
      valid = false;
    }
    if (!budget) {
      errorObj.budget = 'Budget is required';
      valid = false;
    }

    setErrorFields(errorObj);

    if (!valid) {
      setErrorMessage('Please fill in all the required fields.');
      return;
    }

    // Prepare the trip data
    const tripData = {
      email: email,
      trip_name: tripName,
      start_location: startLocation,
      end_location: endLocation,
      trip_distance: parseFloat(tripDistance),
      start_date: startDate,
      end_date: endDate,
      budget: parseFloat(budget),
    };

    const handleAddTrip = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setError('Authentication required. Please log in again.');
          return;
        }
    
        const response = await axios.post(
          'http://localhost:8000/api/trips/',
          tripData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        console.log('Trip added successfully:', response.data);
        alert('Trip saved successfully!');
        navigate('/view-trips');
      } catch (error) {
        console.error('Failed to add trip:', error.response?.data || error);
        alert('Failed to add trip. Please try again.');
      }
    };
  };

  return (
    <div>
      <div className="background-div">
        <div className="trip-form">
          <h2>Add a Trip</h2>
          <form onSubmit={handleAddTrip}>
            <label className="label-name">
              Trip Name:
              <input
                className="form-input"
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter trip name"
              />
              {validationErrors.tripName && (
                <span className="error-message">{validationErrors.tripName}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              Starting Location:
              <input
                className="form-input"
                type="text"
                //value={startLocation}
                value={startAddress}
                placeholder="Enter starting location"
                onChange={(e) => setStartLocation(e.target.value)}
                readOnly
              />
              {validationErrors.startLocation && (
                <span className="error-message">{validationErrors.startLocation}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              End Location:
              <input
                className="form-input"
                type="text"
                //value={endLocation}
                value={endAddress}
                placeholder="Enter end location"
                onChange={(e) => setEndLocation(e.target.value)}
                readOnly
              />
              {validationErrors.endLocation && (
                <span className="error-message">{validationErrors.endLocation}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              Trip Distance (in miles):
              <input
                className="form-input"
                type="number"
                value={tripDistance}
                placeholder="Enter trip distance"
                onChange={(e) => setTripDistance(e.target.value)}
              />
              {validationErrors.tripDistance && (
                <span className="error-message">{validationErrors.tripDistance}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              Trip Date:
              <input
                className="form-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {validationErrors.tripDate && (
                <span className="error-message">{validationErrors.tripDate}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              Return Date:
              <input
                className="form-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {validationErrors.returnDate && (
                <span className="error-message">{validationErrors.returnDate}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              Email:
              <input
                className="form-input"
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
              {validationErrors.email && (
                <span className="error-message">{validationErrors.email}</span>
              )}
            </label>
            <br />
            <label className="label-name">
              Budget:
              <input
                className="form-input"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter budget"
              />
              {validationErrors.budget && (
                <span className="error-message">{validationErrors.budget}</span>
              )}
            </label>
            <br />
            <button type="submit" disabled={isFetchingLocation}>
              {isFetchingLocation ? 'Loading Location...' : 'Add Trip'}
            </button>
          </form>
          <div className="view-trips-button">
            <Link to="/view-trips">
              <button>View Saved Trips</button>
            </Link>
          </div>
          <div className="route-button">
            <Link to="/map">
              <button>Go to theRoute!</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;

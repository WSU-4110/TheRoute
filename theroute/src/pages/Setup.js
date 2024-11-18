import React, { useEffect, useState, useContext } from 'react';
import '../styles/setup.css';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export const Setup = () => {
  const { getAccessToken } = useContext(AuthContext);
  const [tripName, setTripName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [tripDistance, setTripDistance] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [budget, setBudget] = useState('');
  const [email, setEmail] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({}); // State for validation errors
  const navigate = useNavigate();

  // Initialize state with data from local storage
  useEffect(() => {
    const savedStartLocation = localStorage.getItem('startLocation') || '';
    const savedEndLocation = localStorage.getItem('endLocation') || '';
    const savedTripDistance = localStorage.getItem('tripDistance') || '';
    const savedEmail = localStorage.getItem('email') || '';

    setStartLocation(savedStartLocation);
    setEndLocation(savedEndLocation);
    setTripDistance(savedTripDistance);
    setEmail(savedEmail);

    setIsFetchingLocation(false);
  }, []);
=======
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import axios from 'axios';

export const Setup = () => {
  const [tripName, setTripName] = useState(''); // New field for trip name
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [totalDistance, setTotalDistance] = useState('');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [stops, setStops] = useState([]); // New field for stops
  const [vehicleInfo, setVehicleInfo] = useState(''); // Optional field if needed
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
  const [successMessage, setSuccessMessage] = useState(''); // State to store success message
  const [errorFields, setErrorFields] = useState({}); // State for individual field errors
  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const navigate = useNavigate();

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedTripData = localStorage.getItem('savedTripData');
    if (savedTripData) {
      const { tripName, startLocation, endLocation, totalDistance, tripDate } = JSON.parse(savedTripData);
      setTripName(tripName);
      setStartLocation(startLocation);
      setEndLocation(endLocation);
      setTotalDistance(totalDistance);
      setTripDate(tripDate);
    }
  }, []); // Empty dependency array ensures this runs once when the component mounts
>>>>>>> 203ff1d (Working on displaying user trips)

  // Handle form submission to add a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    // Validate fields
    let errors = {};
    if (!tripName) errors.tripName = '*Trip Name is required';
    if (!startLocation) errors.startLocation = '*Starting Location is required';
    if (!endLocation) errors.endLocation = '*End Location is required';
    if (!tripDistance) errors.tripDistance = '*Trip Distance is required';
    if (!tripDate) errors.tripDate = '*Trip Date is required';
    if (!returnDate) errors.returnDate = '*Return Date is required';
    if (!email) errors.email = '*Email is required';
    if (!budget) errors.budget = '*Budget is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors
      return; // Prevent form submission if there are errors
=======
    const userEmail = user?.email; // Get the email from AuthContext
    if (!userEmail) {
      alert('Please log in to save trips');
      navigate('/login');
      return;
>>>>>>> 203ff1d (Working on displaying user trips)
    }

    // Check for empty required fields and display error next to the empty fields
    let valid = true;
    setErrorMessage('');
    let errorObj = {};  // Initialize an error object

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
    if (!totalDistance) {
      errorObj.totalDistance = 'Total Distance is required';
      valid = false;
    }
    if (!tripDate) {
      errorObj.tripDate = 'Trip Date is required';
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

    setErrorFields(errorObj);  // Set the error fields

    if (!valid) {
      setErrorMessage('Please fill in all the required fields.');
      return; // Don't submit the form if there are missing fields
    }

    // Prepare the trip data
    const tripData = {
<<<<<<< HEAD
      email: email,
      trip_name: tripName,
      start_location: startLocation,
      end_location: endLocation,
      trip_distance: parseFloat(tripDistance),
      start_date: tripDate,
      end_date: returnDate,
      budget: parseFloat(budget),
    };

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
      navigate('/view-trips'); // Redirect to view trips page after success
    } catch (error) {
      console.error('Failed to add trip:', error.response?.data || error);
      alert('Failed to add trip. Please try again.');
=======
      trip_name: tripName,
      start_location: startLocation,
      end_location: endLocation,
      total_distance: totalDistance,
      start_date: tripDate,
      end_date: endDate,
      budget,
      email: userEmail,
      stops: stops.map(stop => ({ stop_name: stop })), // Format stops for API
    };

    try {
      // Set the fetching state to true to prevent resubmitting during the request
      setIsFetchingLocation(true);
      setErrorMessage(''); // Clear any previous error message

      // Send the POST request to the API
      const response = await axios.post('http://127.0.0.1:8000/api/trips/', tripData);

      // If the request is successful, show a success message
      if (response.status === 200) {
        setSuccessMessage('Trip saved successfully!');
        setErrorMessage(''); // Clear any previous error messages
        // Optionally, reset the form fields after successful submission
        setTripName('');
        setStartLocation('');
        setEndLocation('');
        setTotalDistance('');
        setTripDate('');
        setEndDate('');
        setBudget('');
        setStops([]);
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      setErrorMessage('Error saving trip. Please try again.');
    } finally {
      setIsFetchingLocation(false); // Reset the fetching state
>>>>>>> 203ff1d (Working on displaying user trips)
    }
  };

  return (
    <div>
<<<<<<< HEAD
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
                value={startLocation}
                placeholder="Enter starting location"
                onChange={(e) => setStartLocation(e.target.value)}
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
                value={endLocation}
                placeholder="Enter end location"
                onChange={(e) => setEndLocation(e.target.value)}
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
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
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
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
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
              {isFetchingLocation ? 'Loading Location...' : 'Save Trip'}
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
=======
      <div className="trip-form">
        <h2>Add a Trip</h2>

        {/* Display error message if there are missing fields */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Display success message if the trip is saved successfully */}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleAddTrip}>
          <label>
            Trip Name:
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
            {errorFields.tripName && <span className="error-text">{errorFields.tripName}</span>}
          </label>
          <br />
          <label>
            Starting Location:
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
            />
            {errorFields.startLocation && <span className="error-text">{errorFields.startLocation}</span>}
          </label>
          <br />
          <label>
            End Location:
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
            />
            {errorFields.endLocation && <span className="error-text">{errorFields.endLocation}</span>}
          </label>
          <br />
          <label>
            Total Distance (in miles):
            <input
              type="number"
              value={totalDistance}
              onChange={(e) => setTotalDistance(e.target.value)}
            />
            {errorFields.totalDistance && <span className="error-text">{errorFields.totalDistance}</span>}
          </label>
          <br />
          <label>
            Start Date:
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
            />
            {errorFields.tripDate && <span className="error-text">{errorFields.tripDate}</span>}
          </label>
          <br />
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errorFields.endDate && <span className="error-text">{errorFields.endDate}</span>}
          </label>
          <br />
          <label>
            Budget:
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            {errorFields.budget && <span className="error-text">{errorFields.budget}</span>}
          </label>
          <br />
          <label>
            Stops (Comma separated):
            <input
              type="text"
              value={stops.join(', ')}
              onChange={(e) => setStops(e.target.value.split(',').map(stop => stop.trim()))}
            />
          </label>
          <br />
          <button type="submit" disabled={isFetchingLocation}>
            {isFetchingLocation ? 'Saving...' : 'Save Trip'}
          </button>
        </form>
      </div>

      <div className="view-trips-button">
        <Link to="/view-trips">
          <button>View Trips</button>
        </Link>
      </div>
      
      <div className='back-button'>
        <Link to="/map">
          <button>Back</button>
        </Link>
      </div>
>>>>>>> 203ff1d (Working on displaying user trips)
    </div>
  );
};

export default Setup;

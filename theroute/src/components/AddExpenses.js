//AddExpense.js
import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/AddExpense.css';
import { FaMap, FaDollarSign, FaHome, FaCar, FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const AddExpense = () => {
  const { getAccessToken } = useContext(AuthContext);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [tripNames, setTripNames] = useState([]); // To store the trip names
  const [selectedTrip, setSelectedTrip] = useState(''); // To store the selected trip name

  // Fetch existing trip names for the user
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setError('Authentication required. Please log in again.');
          return;
        }

        const response = await axiosInstance.get('/trips/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract unique trip names from the response data
        const trips = response.data.map(trip => trip.trip_name);
        setTripNames([...new Set(trips)]); // Remove duplicates
      } catch (error) {
        console.error("Error fetching trips:", error.response?.data || error);
        setError('Failed to fetch trips.');
      }
    };

    fetchTrips();
  }, [getAccessToken]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    // Check if both trip name and category are selected
    if (!selectedTrip || !category || !amount) {
      setError('Please select a trip, category, and amount.');
      return;
    }

    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.post(
        '/expenses/', 
        { category, amount, trip_name: selectedTrip }, // Include trip_name in POST data
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Expense added successfully:", response.data);
      setResult('Expense Added!');
      setError('');
      alert('Expense added successfully.')
    } catch (error) {
      console.error("Failed to add expense:", error.response?.data || error);
      setError("Failed to add expense. Please try again.");
      alert('Failed to add expense. Please try again.')
    }
  };

  return (
   <div className='addexpenses-screen'>
    <div className='addexpenses'>
      <h1>Add Expense</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddExpense}>
        <label className="label-name">Stored Trips: </label>
        <div className="dropdown-container">
          <select
            className="trip-dropdown"
            value={selectedTrip}
            onChange={(e) => setSelectedTrip(e.target.value)}
            required
          >
            <option value="">Select Trip</option>
            {tripNames.length > 0 ? (
              tripNames.map((tripName, index) => (
                <option key={index} value={tripName}>{tripName}</option>
              ))
            ) : (
              <option>No trips available</option>
            )}
          </select>
        </div>
        
        <label className="label-name">Trip Categories: </label>
        <div className="dropdown-container">
          <select
            className="add-dropdown"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="other">Other</option>
            <option value="activities">Activities</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="housing">Housing</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>
        <label className="label-name">Expense Amount: </label>
        <input
          className="input-field"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <div className="button-click">
          <button type="submit">Add Expense</button>
        </div>
        <div className="view-button">
          <Link to="/view-expense">
            <button>View Expenses</button>
          </Link>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddExpense;

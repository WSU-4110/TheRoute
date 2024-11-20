// AddExpense.js
import React, { useState, useContext } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import {Link} from 'react-router-dom';
import '../styles/AddExpense.css';
import { FaMap, FaDollarSign, FaHome, FaCar, FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const AddExpense = () => {
  const { getAccessToken } = useContext(AuthContext);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessToken();
      console.log("Retrieved token:", token); // Debug: Check if token is retrieved
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.post(
        '/expenses/', 
        { category, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Expense added successfully:", response.data);
      setError('');
    } catch (error) {
      console.error("Failed to add expense:", error.response?.data || error);
      setError("Failed to add expense. Please try again.");
    }
  };

  const handleClick = () => {
    setResult('Expense Added!');
  };

  return (
    <div>
      <h2>Add Expense</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddExpense}>
      <div className='dropdown-container'>
        <select className='add-dropdown'
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
        <input className='input-field'
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div className='button-click'>
          <button onClick={handleClick} type="submit">Add Expense</button>
          {result && <p>{result}</p>}
          </div>
        <div className='button-click'>
          <Link to='/view-expense'>
        <button>View Expenses</button>
        </Link>
      </div>
      </form>
    </div>
  );
};

export default AddExpense;

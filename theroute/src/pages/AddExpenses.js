// AddExpense.js
import React, { useState, useContext } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import {Link} from 'react-router-dom';

const AddExpense = () => {
  const { getAccessToken } = useContext(AuthContext);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

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

  return (
    <div>
      <h2>Add Expense</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddExpense}>
        <select
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
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
        <div className='expenses'>
          <Link to='/view-expense'>
        <button>View Expenses</button>
        </Link>
      </div>
      </form>
    </div>
  );
};

export default AddExpense;

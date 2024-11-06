// AddExpense.js
import React, { useState, useContext } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';

const AddExpense = () => {
  const { getAccessToken } = useContext(AuthContext);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessToken();
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
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
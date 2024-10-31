// src/components/AddExpense.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AddExpense.css';
import { AuthContext } from '../context/AuthContext';

const AddExpense = ({ fetchExpenses }) => {
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, getAccessToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    try {
      const token = await getAccessToken(); // Get valid access token

      await axios.post(
        'http://127.0.0.1:8000/api/expenses/',
        {
          category,
          amount: amount.toString(),
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();
      navigate('/view-expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/map'); // Adjust the route to your map screen
  };

  return (
    <div className="add-expense-container">
      {/* Go Back Button positioned at the top left */}
      <button onClick={handleGoBack} className="go-back-button">
        Go Back
      </button>

      <h2 className="add-expense-title">Add Expense</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Category:
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="activities">Activities</option>
            <option value="housing">Housing</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount"
            required
          />
        </label>
        <button type="submit">Add Expense</button>

        <div className="view-button-container">
          <Link to="/view-expenses">
            <button>View Trip Expenses</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;

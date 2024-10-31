// src/components/ViewExpenses.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/ViewExpenses.css';
import { AuthContext } from '../context/AuthContext';
import { addObserver, removeObserver } from '../utils/observer';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { accessToken } = useContext(AuthContext);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/expenses/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Use the access token for authorization
        },
      });
      setExpenses(response.data);
    } catch (error) {
      setErrorMessage('Error fetching expenses');
    }
  };

  useEffect(() => {
    // Register fetchExpenses as an observer when the component mounts
    addObserver(fetchExpenses);

    // Fetch expenses initially
    fetchExpenses();

    // Clean up: Remove fetchExpenses from observers when component unmounts
    return () => removeObserver(fetchExpenses);
  }, []);

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${id}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Use the access token for authorization
        },
      });
      fetchExpenses(); // Refresh the list after deleting an expense
    } catch (error) {
      setErrorMessage('Error deleting expense');
    }
  };

  return (
    <div>
      <h1>View Expenses</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <ul>
        {expenses.map((item) => (
          <li key={item.id}>
            {item.category}: ${item.amount} on {new Date(item.date).toLocaleDateString()}
            <button onClick={() => deleteExpense(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewExpenses;

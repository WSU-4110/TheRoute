// ViewExpenses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ViewExpenses.css'; // Add styles as needed
import { useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { accessToken } = useContext(AuthContext); // Access the token from context

  useEffect(() => {
    fetchExpenses();
  }, []);

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
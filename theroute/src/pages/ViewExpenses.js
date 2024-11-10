import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { getAccessToken } = useContext(AuthContext);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      // Assuming the backend can filter by user ID from the token or has a way to get the current user
      const response = await axiosInstance.get('/expenses/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Fetched expenses:", response.data);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data || error);
      setErrorMessage('Error fetching expenses');
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewExpenses;

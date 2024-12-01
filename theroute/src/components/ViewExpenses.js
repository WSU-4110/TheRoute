
import React, { useState, useEffect, useContext } from 'react'; 
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FaHome, FaCar, FaUtensils, FaRunning, FaQuestionCircle, FaShoppingBag, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/ViewExpenses.css';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(''); // For filtering by trip_name
  const [totalBudget, setTotalBudget] = useState(0);
  const { getAccessToken } = useContext(AuthContext);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [trips, setTrips] = useState([]);

  const getTrips = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }
  
      // Fetch trips data from the server
      const response = await axiosInstance.get(`/trips/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Extract trip names and budgets
      const tripsData = response.data.map(trip => ({
        tripName: trip.trip_name,
        budget: trip.budget,
      }));
  
      // Store the extracted data
      setTrips(tripsData);
      setErrorMessage('');
    } catch (error) {
      console.error("Failed to fetch trips:", error.response?.data || error);
      setErrorMessage("Failed to fetch trips. Please try again.");
    }
  };


  const getCategoryBudget = () => {
    const categoryBudgets = filteredExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});
    return categoryBudgets;
  };
  
  const categoryBudgets = getCategoryBudget();
  
  const updatedData = Object.keys(categoryBudgets).map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    budget: categoryBudgets[category],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#808080'];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    fetchExpenses();
    getTrips(); // Call getTrips when component mounts
  }, []);

  useEffect(() => {
    // Update totalBudget when selectedTrip changes
    if (selectedTrip) {
      const selectedTripData = trips.find(trip => trip.tripName === selectedTrip);
      setTotalBudget(selectedTripData ? selectedTripData.budget : 0);
    } else {
      setTotalBudget(0);
    }
  
    setFilteredExpenses(
      expenses.filter(expense => {
        const matchesCategory = selectedCategory
          ? expense.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;
        const matchesTrip = selectedTrip ? expense.trip_name === selectedTrip : true;
        return matchesCategory && matchesTrip;
      })
    );
  }, [selectedTrip, selectedCategory, expenses, trips]);  

  const fetchExpenses = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.get('/expenses/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(response.data);
    } catch (error) {
      setErrorMessage('Error fetching expenses');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      await axiosInstance.delete(`/expenses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(expenses.filter(expense => expense.id !== id));
      setErrorMessage('');
    } catch (error) {
      console.error("Failed to delete expense:", error.response?.data || error);
      setErrorMessage("Failed to delete expense. Please try again.");
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'housing':
        return <FaHome />;
      case 'transportation':
        return <FaCar />;
      case 'food':
        return <FaUtensils />;
      case 'activities':
        return <FaRunning />;
      case 'shopping':
        return <FaShoppingBag />;
      case 'other':
        return <FaQuestionCircle />;
      default:
        return null;
    }
  };

  const formatAmount = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const progressPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="view-expenses">
      <h1>Expenses</h1>
      <p className="progress-text">{`${progressPercentage.toFixed(2)}%`}</p>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <p className="progress-text">{`$${totalSpent.toFixed(2)} of $${totalBudget} spent`}</p>
      <br></br>      
      {/* Category Dropdown */}
      <div classname='dropdown-container'>
        <select className='dropdown' onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="">All Categories</option>
          <option value="housing">Housing</option>
          <option value="transportation">Transportation</option>
          <option value="food">Food</option>
          <option value="activities">Activities</option>
          <option value="shopping">Shopping</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="expenses-container">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((item) => (
            <div key={item.id} className="expense-item">
              <button className="delete-button" onClick={() => handleDeleteExpense(item.id)}>
                <FaTrash />
              </button>
              <p>
                <div className="category">
                  {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </div>
                <div className='date'>{new Date(item.date).toLocaleDateString()}</div>
                <div className="expense-amount"> -{formatAmount(item.amount)}</div>
                <br></br>
              </p>
            </div>
          ))
        ) : (
          <p>No expenses to display for this category.</p>
        )}
      </div>

      <div className='pieChart'>
        <PieChart width={500} height={500}>
              <Pie
                  activeIndex={activeIndex}
                  data={data}
                  dataKey="budget"
                  outerRadius={250}
                  fill="green"
                  onMouseEnter={onPieEnter}
                  style={{ cursor: 'pointer', outline: 'none' }} // Ensure no outline on focus
              >
                  {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip />
          </PieChart>
        </div> 

    </div>
  );
};

export default ViewExpenses;

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
  const [selectedTrip, setSelectedTrip] = useState('');
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
      const response = await axiosInstance.get('/trips/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tripsData = response.data.map(trip => ({
        tripName: trip.trip_name,
        budget: trip.budget,
      }));
      setTrips(tripsData);
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to fetch trips:', error.response?.data || error);
      setErrorMessage('Failed to fetch trips. Please try again.');
    }
  };

  useEffect(() => {
    fetchExpenses();
    getTrips();
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      const selectedTripData = trips.find(trip => trip.tripName === selectedTrip);
      setTotalBudget(selectedTripData ? selectedTripData.budget : 0);
    } else {
      const totalAllTripsBudget = trips.reduce((sum, trip) => sum + parseFloat(trip.budget || 0), 0);
      setTotalBudget(totalAllTripsBudget);
    }

    // Filter expenses based on selected trip and category
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
      console.error('Failed to delete expense:', error.response?.data || error);
      setErrorMessage('Failed to delete expense. Please try again.');
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

  const getCategoryBudget = () => {
    const categoryBudgets = filteredExpenses.reduce((acc, expense) => {
      const amount = parseFloat(expense.amount) || 0; // Ensure amount is a valid number
      if (!acc[expense.category]) acc[expense.category] = 0;
      acc[expense.category] += amount;
      return acc;
    }, {});
    return categoryBudgets;
  };
  
  const categoryBudgets = getCategoryBudget();
  
  const updatedData = Object.keys(categoryBudgets).map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    budget: parseFloat(categoryBudgets[category].toFixed(2)) || 0, // Ensure no NaN values
  }));
  
  console.log(updatedData); // Log the data for the pie chart

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#808080'];
  const onPieEnter = (_, index) => setActiveIndex(index);

  const renderCustomizedLabel = () => {
    return (
      <g>
        
        <circle
          cx="300"  // Center x-coordinate (same as text)
          cy="300"  // Center y-coordinate (same as text)
          r="80"    // Radius of the circle, adjust as needed
          fill="white"
        />
        
        
        <text
          x="300"
          y="290"  // Adjust the vertical position to center it perfectly
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="24"
          fontWeight="bold"
        >
          ${totalSpent.toFixed(2)}
        </text>
        
        
        <text
          x="300"
          y="330"  
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize="18"
        >
          Total
        </text>
      </g>
    );
  };

  return (
    <div className="view-expenses">
      <div className="expenses-header">
        <h1 className="top-box"><b> Expenses</b></h1>
      </div>
      <div className="main-box">
      
        <div className="filters">
        <div className="dropdown-container-1">
          <select className="dropdown-categories" onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option className="box-option" value="">All Categories</option>
            <option className="box-option" value="housing">Housing</option>
            <option className="box-option" value="transportation">Transportation</option>
            <option className="box-option" value="food">Food</option>
            <option className="box-option" value="activities">Activities</option>
            <option className="box-option" value="shopping">Shopping</option>
            <option className="box-option" value="other">Other</option>
          </select>
          <select className="dropdown-trips" onChange={(e) => setSelectedTrip(e.target.value)} value={selectedTrip}>
            <option value="">All Trips</option>
            {trips.map((trip, index) => (
              <option key={index} value={trip.tripName}>{trip.tripName}</option>
            ))}
          </select>
        
          <Link to="/add-expense">
            <button className="expenses">Add Expenses</button>
          </Link>
          <Link to="/setup">
            <button className="trip">Add Trip</button>
          </Link>
          
        </div>
        <div className="container-for-boxes">
        <div className="box-2">
            <p className="progress-text">{`${progressPercentage.toFixed(2)}%`}</p>
            
          {errorMessage && <p className="error">{errorMessage}</p>}
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
          <p className="progress-text">{`$${totalSpent.toFixed(2)} of $${totalBudget} spent`}</p>
        </div>
        <div className="box-1">
        <div className="expenses-container">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map(item => (
              <div key={item.id} className="expense-item">
                <button className="delete-expense" onClick={() => handleDeleteExpense(item.id)}>
                  <FaTrash />
                </button>
                <p>
                  <span className="category">
                    {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  <span className="expense-amount"> - {formatAmount(item.amount)}</span>
                  <div className="date">{new Date(item.date).toLocaleDateString()}</div>
                </p>
              </div>
            ))
          ) : (
            <p>No expenses to display for this category and trip.</p>
          )}
        </div>
        </div>
        </div>
        <div className="box-3">
          <div className="pieChart">
            <p className="spending">Spending</p>
            <PieChart width={600} height={600}>
              <Pie
                activeIndex={activeIndex}
                data={updatedData}
                dataKey="budget"
                outerRadius={205}  
                fill="green"
                label={renderCustomizedLabel} 
                labelLine={false} 
                onMouseEnter={onPieEnter}
              >
                {updatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpenses;

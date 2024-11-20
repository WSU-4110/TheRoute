import React, { useState, useEffect, useContext } from 'react'; 
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FaHome, FaCar, FaUtensils, FaRunning, FaQuestionCircle, FaShoppingBag, FaTrash } from 'react-icons/fa';  
import '../styles/ViewExpenses.css';


const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [totalBudget, setTotalBudget] = useState(300000);  // Set a total budget (e.g., 300000)
  const { getAccessToken } = useContext(AuthContext);

  const [activeIndex, setActiveIndex] = useState(-1);

  /* Loading Data For Pie Chart */
    const data = [
        { name: 'Housing', budget: 1000 },
        { name: 'Transportation', budget: 300 },
        { name: 'Food', budget: 200 },
        { name: 'Activities', budget: 1000 },
        { name: 'Shopping', budget: 1000 },
        { name: 'Other', budget: 1000 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#808080'];

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    }; 

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredExpenses(expenses.filter(expense => expense.category.toLowerCase() === selectedCategory.toLowerCase()));
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedCategory, expenses]);

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
  
      // Remove the deleted expense from local state
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

  // Calculate total spent amount and progress percentage
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const progressPercentage = Math.min((totalSpent / totalBudget) * 100, 100);

  return (
    <div className="view-expenses">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1>Expenses</h1>
      <p className="progress-text">{`${progressPercentage.toFixed(2)}%`}</p>

      {/* Display Error Message */}
      {errorMessage && <p className="error">{errorMessage}</p>}
      
      {/* Budget Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <p className="progress-text">{`$${totalSpent.toFixed(2)} of $${totalBudget} spent`}</p>
      
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
                <span className="category">
                  {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className="expense-amount"> -{formatAmount(item.amount)}</span>
                <br></br>
                <div className='date'>{new Date(item.date).toLocaleDateString()}</div>
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
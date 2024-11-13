import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMap, FaDollarSign, FaHome, FaCar, FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import '../styles/SideBar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Define the getAccessToken function to retrieve the token
  const getAccessToken = () => {
    return localStorage.getItem('access_token'); // Modify based on your token storage method
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAccessToken(); // Call the function to get the token
        if (!token) {
          setError('User not found.');
          return;
        }

        const response = await axios.get('/user/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(response.data.username); // Assuming the API returns { username: 'user_name' }
      } catch (error) {
        console.error("Failed to fetch user details:", error.response?.data || error);
        setError("Failed to load user details. Please try again.");
      }
    };

    fetchUser();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getSidebarOptions = () => {
    if (location.pathname === '/map') {
      return (
        <>
          <Link to="/" onClick={toggleSidebar}>
            <FaHome /> Home
          </Link>
          <Link to="/add-expense" onClick={toggleSidebar}>
            <FaDollarSign /> Expenses
          </Link>
          <Link to="/setup" onClick={toggleSidebar}>
            <FaCar /> Trip Details
          </Link>
        </>
      );
    } else if (location.pathname === '/add-expense' || location.pathname === '/view-expense') {
      return (
        <>
          <Link to="/" onClick={toggleSidebar}>
            <FaHome /> Home
          </Link>
          <Link to="/map" onClick={toggleSidebar}>
            <FaMap /> Map
          </Link>
          <Link to="/setup" onClick={toggleSidebar}>
            <FaCar /> Trip Details
          </Link>
        </>
      );
    } else if (location.pathname === '/setup') {
      return (
        <>
          <Link to="/" onClick={toggleSidebar}>
            <FaHome /> Home
          </Link>
          <Link to="/map" onClick={toggleSidebar}>
            <FaMap /> Map
          </Link>
          <Link to="/add-expense" onClick={toggleSidebar}>
            <FaDollarSign /> Expenses
          </Link>
        </>
      );
    } else {
      return null;
    }
  };

  if (!['/map', '/add-expense', '/view-expense', '/setup'].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      )}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className='close'>
          <FaTimes onClick={toggleSidebar} style={{position: 'absolute', top: '10px', right: '10px' }} />
        </div>
        <div className="profile">
          <FaUser size={32} />
          {/* Render username or fallback to "Guest" if username is empty */}
          <h2>{username || 'Guest'}</h2> {/* Replace "Username" with dynamic data if available */}
        </div>
        {getSidebarOptions()}
        <Link to="/login" onClick={toggleSidebar} className="logout">
          <FaSignOutAlt /> Logout
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
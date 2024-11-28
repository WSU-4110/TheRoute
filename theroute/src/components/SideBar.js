/*
import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMap, FaDollarSign, FaHome, FaCar, FaUser, FaSignOutAlt, FaTimes, FaTrophy } from 'react-icons/fa'; // Added FaTrophy icon
import axios from 'axios';
import '../styles/SideBar.css';
import AuthContext from '../context/AuthContext'; // Import the AuthContext

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext); // Access user and setUser from AuthContext
  const username = localStorage.getItem('username'); // Get the username directly from the context

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Fetch user data if not already available
    if (!user) {
      axios
        .get('/api/user/profile') // Adjust the endpoint to your actual API
        .then(response => {
          setUser(response.data); // Set the user data in AuthContext
        })
        .catch(() => {
          setUser({ username: 'Guest' }); // Fallback to 'Guest' on error
        });
    }
  }, [user, setUser]);

  const getSidebarOptions = () => {
    return (
      <>
        <Link to="/view-expense" onClick={toggleSidebar}>
          <FaDollarSign /> Expenses
        </Link>
        <Link to="/map" onClick={toggleSidebar}>
          <FaMap /> Map
        </Link>
        <Link to="/view-achievements" onClick={toggleSidebar}>
          <FaTrophy /> Achievements 
        </Link>
        <Link to="/setup" onClick={toggleSidebar}>
          <FaCar /> Trip Details
        </Link>
      </>
    );
  };

  // Only render the sidebar for specified paths
  if (!['/map', '/add-expense', '/view-expense', '/setup', '/view-achievements'].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div className="hamburger-menu">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      )}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="close">
          <FaTimes onClick={toggleSidebar} style={{ position: 'absolute', top: '10px', right: '10px' }} />
        </div>
        <div className="profile">
          <FaUser size={32} />
          <h2>{username || 'User'}</h2>
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
*/
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMap, FaDollarSign, FaHome, FaCar, FaUser, FaSignOutAlt, FaTimes, FaTrophy } from 'react-icons/fa'; // Added FaTrophy icon
import axios from 'axios';
import '../styles/SideBar.css';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const username = localStorage.getItem('username'); // Get the username directly from the context

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getSidebarOptions = () => {
    return (
      <>
        <Link to="/view-expense" onClick={toggleSidebar}>
          <FaDollarSign /> Expenses
        </Link>
        <Link to="/map" onClick={toggleSidebar}>
          <FaMap /> Map
        </Link>
        <Link to="/view-achievements" onClick={toggleSidebar}>
          <FaTrophy /> Achievements {/* New Achievements Option */}
        </Link>
        <Link to="/setup" onClick={toggleSidebar}>
          <FaCar /> Trip Details
        </Link>
      </>
    );
  };

  // Only render the sidebar for specified paths
  if (!['/map', '/add-expense', '/view-expense', '/setup', '/view-achievements'].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div className="hamburger-menu">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        </div>
      )}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="close">
          <FaTimes onClick={toggleSidebar} style={{ position: 'absolute', top: '10px', right: '10px' }} />
        </div>
        <div className="profile">
          <FaUser size={32} />
          {/* Render username or fallback to "Guest" if username is empty */}
          <h2>{username || 'User'}</h2> {/* Use username directly from the context */}
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
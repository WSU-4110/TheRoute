import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMap, FaDollarSign, FaHome, FaCar, FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import '../styles/SideBar.css';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const username = user?.username; // Get the username directly from the context

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getSidebarOptions = () => {
    if (location.pathname === '/map') {
      return (
        <>
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

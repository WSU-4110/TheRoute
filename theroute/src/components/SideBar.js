import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMap, FaDollarSign, FaCar, FaUser, FaSignOutAlt, FaTimes, FaTrophy } from 'react-icons/fa'; 
import '../styles/SideBar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const email = localStorage.getItem("email"); // Get the username directly from the context

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
  if (!['/map', '/add-expense', '/view-expense', '/setup', '/view-achievements', '/view-trips'].includes(location.pathname)) {
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
          <h2>{email || 'User'}</h2> {/* Use username directly from the context */}
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

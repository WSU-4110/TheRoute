import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login'); 
  };

  return (
    <div className="home-container">
      <div className="overlay">
        <h1>Welcome to TheRoute</h1>
        <p>Your adventure begins here! Click the button below to start planning your trips.</p>
        <button className="start-button" onClick={handleStartClick}>
          Click Here to Begin
        </button>
      </div>
    </div>
  );
};

export default Home;
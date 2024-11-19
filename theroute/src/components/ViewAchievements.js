import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import keyIcon from '../assets/key.png';
import moneyIcon from '../assets/money.png';
import mapIcon from '../assets/treasure-map.png';
import signupIcon from '../assets/write.png'; // Updated icon for "Planner Signup"
import '../styles/ViewAchievements.css';

const ViewAchievements = () => {
  const [achievements, setAchievements] = useState([]); // All achievements
  const [userAchievements, setUserAchievements] = useState([]); // User-obtained achievements
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const { getAccessToken } = useContext(AuthContext); // Auth context for token

  useEffect(() => {
    fetchAllAchievements();
    fetchUserAchievements();
  }, []);

  // Fetch all achievements (general list)
  const fetchAllAchievements = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.get('/achievements/all/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAchievements(response.data); // Store all achievements
    } catch (error) {
      setErrorMessage('Error fetching all achievements');
    }
  };

  // Fetch user-obtained achievements
  const fetchUserAchievements = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }

      const response = await axiosInstance.get('/achievements/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const obtainedIds = response.data.map((achievement) => achievement.achievement_id);
      setUserAchievements(obtainedIds); // Store obtained achievement IDs
    } catch (error) {
      setErrorMessage('Error fetching user achievements');
    }
  };

  // Map achievement keys to icons
  const getAchievementIcon = (key) => {
    switch (key) {
      case 'first_login':
        return keyIcon;
      case 'first_expense':
        return moneyIcon;
      case 'first_trip_planner':
        return mapIcon;
      case 'signup': // Updated to match the key for "Planner Signup"
        return signupIcon;
      default:
        return '/default-icon.png'; // Default icon
    }
  };

  // Calculate progress percentage
  const completedAchievements = achievements.filter((achievement) =>
    userAchievements.includes(achievement.id)
  ).length;
  const totalAchievements = achievements.length;
  const progress = totalAchievements
    ? Math.floor((completedAchievements / totalAchievements) * 100)
    : 0;

  return (
    <div className="view-achievements">
      <div className="header">
        <h1>Achievements</h1>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar-wrapper">
          <div
            className="circular-progress-bar"
            style={{ '--progress': progress }}
          >
            <span>{progress}%</span>
          </div>
        </div>
        <div className="progress-details">
          {completedAchievements} / {totalAchievements} completed
        </div>
      </div>

      {/* Display Error Message */}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {/* Achievement Grid */}
      <div className="achievement-grid">
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-card ${
                userAchievements.includes(achievement.id) ? 'obtained' : ''
              }`}
            >
              <img
                src={getAchievementIcon(achievement.key)} // Get the correct icon for each achievement
                alt={achievement.name}
              />
              <p className="achievement-name">{achievement.name}</p>
              <p className="achievement-description">
                {achievement.description}
              </p>
              {userAchievements.includes(achievement.id) && (
                <div className="achievement-obtained">Obtained</div>
              )}
            </div>
          ))
        ) : (
          <p className="no-achievements">
            No achievements available to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewAchievements;

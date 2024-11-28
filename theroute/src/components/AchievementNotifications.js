import React, { useState, useEffect, useContext, useCallback } from 'react';
import axiosInstance from './axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AchievementNotifications.css';

const AchievementNotifications = () => {
  const [newAchievements, setNewAchievements] = useState([]);
  const { getAccessToken } = useContext(AuthContext);

  // Function to fetch and process achievements
  const fetchAchievements = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      // Fetch the user's achievements from the backend
      const response = await axiosInstance.get('/achievements/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const obtainedAchievements = response.data.map((achievement) => achievement.achievement_id);

      // Get previously stored achievements from localStorage
      const storedAchievements = JSON.parse(localStorage.getItem('userAchievements')) || [];

      // Identify newly obtained achievements
      const newlyObtained = obtainedAchievements.filter(
        (id) => !storedAchievements.includes(id)
      );

      if (newlyObtained.length > 0) {
        // Fetch details of new achievements
        const newAchievementDetails = response.data.filter((achievement) =>
          newlyObtained.includes(achievement.achievement_id)
        );

        // Update state with new achievements
        setNewAchievements((prev) => [...prev, ...newAchievementDetails]);

        // Update localStorage with the latest achievements
        localStorage.setItem('userAchievements', JSON.stringify(obtainedAchievements));
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, [getAccessToken]);

  // Set up periodic polling for new achievements
  useEffect(() => {
    fetchAchievements(); // Fetch immediately on mount
    const interval = setInterval(fetchAchievements, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchAchievements]);

  // Remove a notification
  const removeNotification = (id) => {
    setNewAchievements((prev) =>
      prev.filter((achievement) => achievement.achievement_id !== id)
    );
  };

  return (
    <div className="achievement-notifications">
      {newAchievements.map((achievement) => (
        <div key={achievement.achievement_id} className="notification">
          <h3>Achievement Unlocked!</h3>
          <p>{achievement.achievement_name}</p>
          <p>{achievement.achievement_description}</p>
          <button onClick={() => removeNotification(achievement.achievement_id)}>
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
};

export default AchievementNotifications;
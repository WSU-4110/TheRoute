import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // To track current route
import { AuthContext } from '../context/AuthContext';
import axiosInstance from './axios';
import '../styles/AchievementNotifications.css'; // Notification styles
import keyIcon from '../assets/key.png';
import moneyIcon from '../assets/money.png';
import mapIcon from '../assets/treasure-map.png';
import signupIcon from '../assets/write.png'; // Icons for achievements

const AchievementNotifications = () => {
  const [notifications, setNotifications] = useState([]); // Store active notifications
  const { getAccessToken, user } = useContext(AuthContext); // Destructure `user` from context
  const location = useLocation(); // Get current route

  // Memoized showNotification function
  const showNotification = useCallback((achievement) => {
    setNotifications((prev) => {
      // Prevent duplicate notifications
      if (prev.some((n) => n.id === achievement.achievement_id)) {
        return prev;
      }

      const newNotification = {
        id: achievement.achievement_id,
        title: `Achievement Unlocked!`,
        description: achievement.description,
        icon: getAchievementIcon(achievement.key),
      };

      return [...prev, newNotification];
    });

    // Automatically remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== achievement.achievement_id)
      );
    }, 5000);
  }, []); // No dependencies since it doesn't rely on anything external

  const checkForNewAchievements = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        return;
      }

      const response = await axiosInstance.get('/achievements/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const obtainedAchievements = response.data;
      if (!obtainedAchievements || obtainedAchievements.length === 0) {
        return;
      }

      // Fetch stored achievements from LocalStorage
      let storedAchievements;
      try {
        storedAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
      } catch (error) {
        storedAchievements = [];
      }

      // Filter out new achievements
      const newAchievements = obtainedAchievements.filter(
        (achievement) =>
          !storedAchievements.some(
            (stored) => stored.achievement_id === achievement.achievement_id
          )
      );

      newAchievements.forEach((achievement) => {
        showNotification(achievement);
      });

      // Update LocalStorage to include all obtained achievements
      localStorage.setItem('userAchievements', JSON.stringify(obtainedAchievements));
    } catch (error) {
      // Handle errors silently
    }
  }, [getAccessToken, showNotification]);

  useEffect(() => {
    let interval;

    const startPolling = async () => {
      const token = await getAccessToken();
      if (!token || !user || location.pathname === '/login') {
        return;
      }

      setTimeout(() => {
        interval = setInterval(() => {
          checkForNewAchievements();
        }, 10000);
      }, 3000); // 3-second delay
    };

    startPolling();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [getAccessToken, user, location.pathname, checkForNewAchievements]); // Updated dependencies

  const getAchievementIcon = (key) => {
    switch (key) {
      case 'first_login':
        return keyIcon;
      case 'first_expense':
        return moneyIcon;
      case 'first_trip_planner':
        return mapIcon;
      case 'signup':
        return signupIcon;
      default:
        return '/default-icon.png'; // Default fallback icon
    }
  };

  return (
    <div className="achievement-notifications">
      {notifications.map((notification) => (
        <div key={notification.id} className="achievement-notification">
          <img src={notification.icon} alt="Achievement Icon" />
          <div className="achievement-details">
            <h4>{notification.title}</h4>
            <p>{notification.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementNotifications;

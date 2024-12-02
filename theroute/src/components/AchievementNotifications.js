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

  const showNotification = useCallback((achievement) => {
    console.log('[DEBUG] Attempting to show notification for:', achievement);

    // Prevent showing notifications if the user is not authenticated or on the login page
    if (!user) {
      console.warn('[DEBUG] User is not authenticated. Notification suppressed.');
      return;
    }
    if (location.pathname === '/login') {
      console.warn('[DEBUG] User is on the login page. Notification suppressed.');
      return;
    }

    setNotifications((prev) => {
      // Prevent duplicate notifications
      if (prev.some((n) => n.id === achievement.achievement_id)) {
        console.log('[DEBUG] Duplicate notification detected. Skipping:', achievement);
        return prev;
      }

      const newNotification = {
        id: achievement.achievement_id,
        title: `Achievement Unlocked!`,
        description: achievement.achievement_description,
        icon: getAchievementIcon(achievement.achievement_key),
      };

      console.log('[DEBUG] New notification created:', newNotification);
      return [...prev, newNotification];
    });

    // Automatically remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== achievement.achievement_id)
      );
      console.log('[DEBUG] Notification removed for:', achievement);
    }, 5000);
  }, [user, location.pathname]); // Updated dependencies

  const checkForNewAchievements = useCallback(async () => {
    console.log('[DEBUG] checkForNewAchievements called.');
    try {
      const token = await getAccessToken();
      if (!token) {
        console.warn('[DEBUG] No access token available. Skipping API call.');
        return;
      }

      if (!user) {
        console.warn('[DEBUG] User is not authenticated. Skipping API call.');
        return;
      }

      if (location.pathname === '/login') {
        console.warn('[DEBUG] User is on the login page. Skipping API call.');
        return;
      }

      console.log('[DEBUG] Making API call to /achievements/list/');
      const response = await axiosInstance.get('/achievements/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const obtainedAchievements = response.data;
      console.log('[DEBUG] API Response for achievements:', obtainedAchievements);

      if (!obtainedAchievements || obtainedAchievements.length === 0) {
        console.log('[DEBUG] No new achievements obtained from API.');
        return;
      }

      // Fetch stored achievements from LocalStorage
      let storedAchievements;
      try {
        storedAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
        console.log('[DEBUG] Stored achievements in LocalStorage:', storedAchievements);
      } catch (error) {
        console.error('[DEBUG] Error parsing LocalStorage achievements:', error);
        storedAchievements = [];
      }

      // Filter out new achievements
      const newAchievements = obtainedAchievements.filter(
        (achievement) =>
          !storedAchievements.some(
            (stored) => stored.achievement_id === achievement.achievement_id
          )
      );

      if (newAchievements.length > 0) {
        console.log('[DEBUG] New achievements detected:', newAchievements);
      } else {
        console.log('[DEBUG] No new achievements to display.');
      }

      newAchievements.forEach((achievement) => {
        showNotification(achievement);
      });

      // Update LocalStorage to include all obtained achievements
      localStorage.setItem('userAchievements', JSON.stringify(obtainedAchievements));
      console.log('[DEBUG] Updated LocalStorage with achievements:', obtainedAchievements);
    } catch (error) {
      console.error('[DEBUG] Error fetching achievements:', error.response?.data || error.message);
    }
  }, [getAccessToken, showNotification, user, location.pathname]); // Updated dependencies

  useEffect(() => {
    let interval;

    const startPolling = async () => {
      console.log('[DEBUG] Starting polling for achievements...');
      const token = await getAccessToken();

      // Check if the user is authenticated and not on the login page
      if (!token) {
        console.warn('[DEBUG] No token found. Polling aborted.');
        return;
      }
      if (!user) {
        console.warn('[DEBUG] User is not authenticated. Polling aborted.');
        return;
      }
      if (location.pathname === '/login') {
        console.warn('[DEBUG] User is on the login page. Polling aborted.');
        return;
      }

      console.log('[DEBUG] Polling initialized with a 3-second delay.');
      setTimeout(() => {
        interval = setInterval(() => {
          checkForNewAchievements();
        }, 10000); // Poll every 10 seconds
      }, 3000); // 3-second delay
    };

    startPolling();

    return () => {
      if (interval) clearInterval(interval); // Clear polling on component unmount
      console.log('[DEBUG] Polling stopped.');
    };
  }, [getAccessToken, user, location.pathname, checkForNewAchievements]);

  const getAchievementIcon = (key) => {
    switch (key) {
      case 'first_login':
        return keyIcon;
      case 'first_expense':
        return moneyIcon;
      case 'first_trip_planner':
        return mapIcon;
      case 'planner_signup': // Fixed missing key
        return signupIcon;
      default:
        console.warn('[DEBUG] No icon found for key:', key);
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

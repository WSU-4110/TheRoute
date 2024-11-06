/*
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use named import
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    console.log("Stored Access Token:", storedToken); // Log token

    if (storedToken) {
      setAccessToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken); // Use jwtDecode function
        console.log("Decoded Token:", decoded); // Log decoded token
        setUser({ email: decoded.email });
      } catch (error) {
        console.error('Invalid token:', error); // Handle invalid token
      }
    }
  }, []);

  const getAccessToken = async () => {
    try {
      const now = Date.now() / 1000;
      const decoded = jwtDecode(accessToken); // Use jwtDecode function

      if (decoded.exp < now) {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: localStorage.getItem('refreshToken'),
        });

        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        console.log('Access token refreshed:', newAccessToken); // Log new token

        return newAccessToken;
      }
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    console.log('User logged in:', userData); // Log login info
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('User logged out'); // Log logout
  };

  return (
    <AuthContext.Provider value={{ user, getAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
*/
// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct named import
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    console.log("Stored Access Token:", storedToken);

    if (storedToken) {
      setAccessToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        console.log("Decoded Token:", decoded);
        setUser({ email: decoded.email });
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const getAccessToken = async () => {
    try {
      const now = Date.now() / 1000;
      const decoded = jwtDecode(accessToken);
      
      if (decoded.exp < now) {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: localStorage.getItem('refreshToken'),
        });
        
        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        console.log('Access token refreshed:', newAccessToken);

        return newAccessToken;
      }
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    console.log('User logged in:', userData);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, getAccessToken, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
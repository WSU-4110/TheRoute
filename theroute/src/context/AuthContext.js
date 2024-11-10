import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    console.log("Retrieved Stored Access Token on load:", storedToken);

    if (storedToken) {
      setAccessToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        console.log("Decoded Token:", decoded);
        setUser({ email: decoded.email });
      } catch (error) {
        console.error('Invalid token on load:', error);
      }
    }
  }, []);

  const getAccessToken = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return null;
    }

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

  const login = (userData, token, refreshToken) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken); // Save refresh token
    console.log('User logged in:', userData, 'AccessToken:', token, 'RefreshToken:', refreshToken);
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

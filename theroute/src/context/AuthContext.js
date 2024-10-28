import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthContext Provider Component
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // User object or null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Example: Simulate checking user session (you can replace with an API call)
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Check user from storage
        if (storedUser) setUser(storedUser);
      } catch (error) {
        console.error('Failed to load user session', error);
      } finally {
        setIsLoading(false); // Finish loading
      }
    };
    checkUserSession();
  }, []);

  // Function to log in the user
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
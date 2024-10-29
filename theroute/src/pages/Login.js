// src/components/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import '../styles/Login.css';

const Login = () => {
  const { login } = useContext(AuthContext); // Access login function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Check if password is shorter than 8 characters
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check if email contains an '@' symbol
    if (!email.includes('@') || email.length < 8) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        email,
        password,
      });

      // Store tokens in context
      login(response.data.user, response.data.access); // Pass user and token to context

      navigate('/map'); // Change the route to '/map'
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ fontSize: '1em' }}>
          Don't have an account? <span onClick={handleRegisterClick} style={{ color: 'blue', cursor: 'pointer' }}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;

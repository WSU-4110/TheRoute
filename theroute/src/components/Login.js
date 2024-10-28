import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        email,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      navigate('/map'); // Change the route to '/map'
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials. Please try again.'); // Customize this message based on the error
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleRegisterClick = () => {
    navigate('/signup'); // Navigate to Signup page
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="error">{error}</p>}  {/* Display error if any */}
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
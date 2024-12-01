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
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        email,
        password,
      });

      // Extract tokens and user data from response
      const { access, refresh } = response.data;

      // Pass user data and tokens to context
      login({ email }, access, refresh); // Store access and refresh tokens
      
      localStorage.setItem('email', email);
      alert("Do you consent to your information being stored?");
      navigate('/map'); // Redirect to '/map'
    } catch (error) {
      console.error('Login failed:', error.response?.data || error);
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
          <label className="label-box" htmlFor="email">Email:</label>
          <input
            className="input-box"
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label className="label-box" htmlFor="password">Password:</label>
          <input
            className="input-box"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ fontSize: '1em' }}>
          Don't have an account?{' '}
          <span onClick={handleRegisterClick} style={{ color: 'blue', cursor: 'pointer' }}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
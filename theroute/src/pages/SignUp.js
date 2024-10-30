import React, { useState, useContext } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/SignUp.css'; 
import { AuthContext } from '../context/AuthContext'; 

const SignUp = () => {
  const { login } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSignUp = async (e) => {
    e.preventDefault(); 

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!email.includes('@') || email.length < 8) {
      setError('Please enter a valid email');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        email,
        username,
        password,
      });

      if (response.data && response.data.user && response.data.access) {
        login(response.data.user, response.data.access); 
        navigate('/map'); 
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.detail || 'Invalid credentials. Please try again.'; 
      setError(errorMessage);
    }
  };

  const handleRegisterClick = () => {
    navigate('/login'); 
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p style={{ fontSize: '1em' }}>
          Already have an account? <span onClick={handleRegisterClick} style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

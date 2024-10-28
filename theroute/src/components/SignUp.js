import React, { useState } from 'react';
import '../styles/SignUp.css'; 

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Example validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Reset error message
    setError('');

    // Here you would typically handle sign-up logic
    console.log('Signing up with:', { email, password });

    // Example of a fetch call (replace with your API endpoint)
    /*
    fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle successful sign-up (e.g., navigate to a different screen)
      console.log('Sign-up successful:', data);
    })
    .catch(err => {
      setError('Sign-up failed. Please try again.');
      console.error('Sign-up error:', err);
    });
    */
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
      </form>
    </div>
  );
};

export default SignUp;
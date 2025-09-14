// src/pages/UserLoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  let navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous error messages

    if (!username || !password) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

              if (response.ok) {
          const { access_token } = await response.json();
          localStorage.setItem('authToken', access_token); // Save the token in localStorage
          navigate('/SelectUserTypePage'); // Navigate upon successful login
        } else {
        const error = await response.json();
        setErrorMessage(error.message || 'Username or password incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error, please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="content-wrapper">
        <div className="form-container">
          <div className="form-title">
            <div className="card-header">
             {/* <div className="card-icon">🥔</div> */}
              <h2>Potato Traceability System</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Secure blockchain-based potato supply chain management
            </p>
          </div>
          
          {errorMessage && (
            <div className="message error">
              <span>⚠️</span> {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="predict-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
             {/* <span>🔐</span> */}
              Login
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/create-new-user" className="btn btn-secondary">
              <span>👤</span>
              Create New User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Make sure to import Link here

const RegisterUserPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Registration successful
      alert('Registration successful');
      navigate('/'); // Navigate to the login page or another appropriate page
    } else {
      // Handle registration errors (e.g., user already exists)
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
    }
  };

  return (
    <div className="login-page-container">
      <div className="content-wrapper">
        <div className="form-container">
          <div className="form-title">
            <div className="card-header">
              {/*<div className="card-icon">👤</div>*/}
              <h2>Create New Account</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Join the system to manage supply chain operations
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="predict-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {/*<span>✅</span>*/}
              Create Account
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Already have an account?
            </p>
            <Link to="/" className="btn btn-secondary">
              {/*<span>🔐</span>*/}
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserPage;

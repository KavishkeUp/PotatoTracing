// src/pages/SupermarketDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const SupermarketDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Navigation />
      <div className="page-container">
        <div className="content-wrapper">
          <div className="dashboard-header">
            <div className="card-header">
              <div className="card-icon">🛒</div>
              <h1>Supermarket Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Manage deliveries, track inventory, and analyze market trends
            </p>
          </div>
          
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupermarketDashboard;

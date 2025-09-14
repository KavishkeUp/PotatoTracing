// src/pages/DistributorDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const DistributorDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Navigation />
      <div className="page-container">
        <div className="content-wrapper">
          <div className="dashboard-header">
            <div className="card-header">
              <div className="card-icon">🚚</div>
              <h1>Distributor Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Manage distribution and delivery logistics
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

export default DistributorDashboard;

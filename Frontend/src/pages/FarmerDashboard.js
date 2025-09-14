import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const FarmerDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Navigation />
      <div className="page-container">
        <div className="content-wrapper">
          <div className="dashboard-header">
            <div className="card-header">
              {/*<div className="card-icon">🌾</div>*/}
              <h1>Farmer Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Manage harvest records and track potato production
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

export default FarmerDashboard;

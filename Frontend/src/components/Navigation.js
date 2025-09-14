import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const getCurrentRole = () => {
    const path = location.pathname;
    if (path.includes('farmer-dashboard')) return 'Farmer';
    if (path.includes('Clerk-Dashboard')) return 'Clerk';
    if (path.includes('distributor-dashboard')) return 'Distributor';
    if (path.includes('supermarket-dashboard')) return 'Supermarket';
    return 'User';
  };

  const getNavigationLinks = () => {
    const role = getCurrentRole();
    
    switch (role) {
      case 'Farmer':
        return [
          { name: 'Dashboard', path: '/farmer-dashboard', icon: '🏠' },
          { name: 'New Record', path: '/farmer-dashboard/new-record', icon: '📝' },
          { name: 'Past Records', path: '/farmer-dashboard/past-records', icon: '📊' },
        ];
      case 'Clerk':
        return [
          { name: 'Dashboard', path: '/Clerk-Dashboard', icon: '🏠' },
          { name: 'New Collection', path: '/Clerk-Dashboard/new-collection', icon: '📦' },
          { name: 'Past Collections', path: '/Clerk-Dashboard/past-collections', icon: '📋' },
        ];
      case 'Distributor':
        return [
          { name: 'Dashboard', path: '/distributor-dashboard', icon: '🏠' },
          { name: 'New Delivery', path: '/distributor-dashboard/new-delivery', icon: '🚚' },
          { name: 'Past Deliveries', path: '/distributor-dashboard/past-deliveries', icon: '📊' },
        ];
      case 'Supermarket':
        return [
          { name: 'Dashboard', path: '/supermarket-dashboard', icon: '🏠' },
          { name: 'Receive Delivery', path: '/supermarket-dashboard/receive-delivery', icon: '📥' },
          { name: 'Received Deliveries', path: '/supermarket-dashboard/received-deliveries', icon: '📋' },
          { name: 'Predict Price', path: '/supermarket-dashboard/predict-potato-price', icon: '💰' },
          { name: 'Predict Demand', path: '/supermarket-dashboard/predict-potato-demand', icon: '📊' },
        ];
      default:
        return [];
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-brand">
          <div 
            className="nav-logo clickable-logo"
            onClick={() => navigate('/SelectUserTypePage')}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🥔</span>
            Potato Traceability
          </div>
          <div className="nav-role">
            <span className="role-badge">{getCurrentRole()}</span>
          </div>
        </div>

        <div className="nav-menu">
          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger"></span>
          </button>

          <div className={`nav-links ${isMenuOpen ? 'nav-open' : ''}`}>
            {getNavigationLinks().map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setIsMenuOpen(false);
                }}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.name}
              </a>
            ))}
            
            <div className="nav-divider"></div>
            
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

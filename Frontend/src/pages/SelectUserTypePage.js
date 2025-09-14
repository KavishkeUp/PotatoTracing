import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryTile from '../components/CategoryTile';

const SelectUserTypePage = () => {
  let navigate = useNavigate();

  const navigateTo = (category) => {
    let path = "";
    switch (category.toLowerCase()) {
      case "farmer":
        path = "/farmer-dashboard"; // Assuming this is the path to the Farmer dashboard
        break;
      case "clerk":
        path = "/Clerk-Dashboard"; // Update with actual path
        break;
      case "distributor":
        path = "/distributor-dashboard"; // Update with actual path
        break;
      case "supermarket":
        path = "/supermarket-dashboard"; // Update with actual path
        break;
      default:
        console.error("Unknown category");
        return;
    }
    navigate(path);
  };

  return (
    <div className="menu-page-container">
      <div className="content-wrapper">
        <div className="form-title">
          <div className="card-header">
            {/*<div className="card-icon">🎯</div>*/}
            <h2>Select Your Role</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Choose your role in the potato supply chain to access your dashboard
          </p>
        </div>
        
        <div className="dashboard-grid">
          <CategoryTile category="Farmer" navigateTo={navigateTo} />
          <CategoryTile category="Clerk" navigateTo={navigateTo} />
          <CategoryTile category="Distributor" navigateTo={navigateTo} />
          <CategoryTile category="Supermarket" navigateTo={navigateTo} />
        </div>
      </div>
    </div>
  );
};

export default SelectUserTypePage;

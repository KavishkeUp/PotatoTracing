// src/components/CategoryTile.js
import React from 'react';

const CategoryTile = ({ category, navigateTo }) => {
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'farmer':
        return '';  // No icon
      case 'clerk':
        return '';  // No icon
      case 'distributor':
        return '';  // No icon
      case 'supermarket':
        return '';  // No icon
      default:
        return '';  // No icon
    }
  };

  const getCategoryDescription = (category) => {
    switch (category.toLowerCase()) {
      case 'farmer':
        return 'Manage harvest records and track potato production';
      case 'clerk':
        return 'Handle collection and quality control processes';
      case 'distributor':
        return 'Manage all distribution and delivery logistics';
      case 'supermarket':
        return 'Receive deliveries and manage customer sales';
      default:
        return 'Access your dashboard';
    }
  };

  const icon = getCategoryIcon(category);

  return (
    <div className="dashboard-card" onClick={() => navigateTo(category)}>
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}  {/* Only render if there's an icon */}
        <h3>{category}</h3>
      </div>
      <p>{getCategoryDescription(category)}</p>
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem',
        color: 'var(--primary-color)',
        fontWeight: '500'
      }}>
        Click to access →
      </div>
    </div>
  );
};

export default CategoryTile;

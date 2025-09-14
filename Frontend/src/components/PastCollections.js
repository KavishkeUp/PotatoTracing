import React, { useEffect, useState } from 'react';

const PastCollections = () => {
  const [collections, setCollections] = useState([]);
  const authToken = localStorage.getItem('authToken');

    
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/clerks/past-collections', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCollections(data);
        } else {
          console.error('Failed to fetch collections:', response.status);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
    
    if (authToken) {
      fetchCollections();
    }
  }, [authToken]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">📋</div>
        <h2>Past Collections</h2>
      </div>
      
      {collections.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          No collections found
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Clerk Name</th>
                <th>Contact Info</th>
                <th>Collection Date/Time</th>
                <th>Quantity</th>
                <th>Distribution Location</th>
                <th>Temperature</th>
                <th>Storage Conditions</th>
                <th>Harvest ID</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection, index) => (
                <tr key={index}>
                  <td>{collection.clerkName}</td>
                  <td>{collection.clerkContactInfo}</td>
                  <td>{collection.collectionDateTime}</td>
                  <td>{collection.collectionQuantity}</td>
                  <td>{collection.distributeLocation}</td>
                  <td>{collection.distributeTemperature}</td>
                  <td>{collection.distributeStorageConditions}</td>
                  <td>{collection.harvestId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastCollections;

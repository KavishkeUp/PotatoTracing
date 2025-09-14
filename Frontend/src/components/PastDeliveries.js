import React, { useEffect, useState } from 'react';

const PastDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
 const authToken = localStorage.getItem('authToken');
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/distributors/past-deliveries', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDeliveries(data);
        } else {
          console.error('Failed to fetch deliveries:', response.status);
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };
    
    if (authToken) {
      fetchDeliveries();
    }
  }, [authToken]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">📊</div>
        <h2>Past Deliveries</h2>
      </div>
      
      {deliveries.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          No delivery records found
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Distributor Name</th>
                <th>Contact Info</th>
                <th>Delivery Date/Time</th>
                <th>Quantity</th>
                <th>Delivery Location</th>
                <th>Temperature</th>
                <th>Storage Conditions</th>
                <th>Collection ID</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery, index) => (
                <tr key={index}>
                  <td>{delivery.distributorName}</td>
                  <td>{delivery.distributorContactInfo}</td>
                  <td>{delivery.deliveryDateTime}</td>
                  <td>{delivery.deliveryQuantity}</td>
                  <td>{delivery.deliverLocation}</td>
                  <td>{delivery.deliverTemperature}</td>
                  <td>{delivery.deliverStorageConditions}</td>
                  <td>{delivery.collectionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastDeliveries;

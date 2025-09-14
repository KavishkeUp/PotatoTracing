import React, { useEffect, useState } from 'react';

const PastRecords = () => {
  const [records, setRecords] = useState([]);
  const authToken = localStorage.getItem('authToken');


  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/farmer/past-records', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        } else {
          console.error('Failed to fetch records:', response.status);
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
    
    if (authToken) {
      fetchRecords();
    }
  }, [authToken]);



  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">📊</div>
        <h2>Past Records</h2>
      </div>
      
      {records.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          No harvest records found
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Farmer Name</th>
                <th>Farm Location</th>
                <th>Harvest Date/Time</th>
                <th>Quantity</th>
                <th>Chemicals Used</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.farmerName}</td>
                  <td>{record.farmLocation}</td>
                  <td>{record.harvestDateTime}</td>
                  <td>{record.harvestQuantity}</td>
                  <td>{record.chemicalsUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastRecords;

// src/components/ReceiveDelivery.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceiveDelivery = () => {
  const [receiptData, setReceiptData] = useState({
    supermarketId: '',
    supermarketName: '',
    supermarketContactInfo: '',
    supermarketReceiveDateTime: '',
    supermarketQuantity: '',
    supermarketPrice: '',
    promotions: '',
    labels: '',
    distributionId: ''
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiptData({...receiptData, [name]: value});
  };

  const handleClear = () => {
    setReceiptData({
      supermarketId: '',
      supermarketName: '',
      supermarketContactInfo: '',
      supermarketReceiveDateTime: '',
      supermarketQuantity: '',
      supermarketPrice: '',
      promotions: '',
      labels: '',
      distributionId: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!receiptData.supermarketId || !receiptData.supermarketName || !receiptData.distributionId) {
      alert('Please fill in all required fields (Supermarket ID, Supermarket Name, and Distribution ID)');
      return;
    }
    
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please login again. Authentication token not found.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/supermarkets/receive-delivery', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(receiptData),
      });

      if (response.ok) {
        alert('Delivery received successfully! QR code has been generated.');
        navigate('/supermarket-dashboard/received-deliveries');
      } else {
        const errorData = await response.json();
        alert(`Failed to receive delivery: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error receiving delivery:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon">📥</div>
        <h2>Receive Delivery</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label htmlFor="supermarketId">Supermarket ID:</label>
          <input type="text" id="supermarketId" name="supermarketId" value={receiptData.supermarketId} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="supermarketName">Supermarket Name:</label>
          <input type="text" id="supermarketName" name="supermarketName" value={receiptData.supermarketName} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="supermarketContactInfo">Contact Info:</label>
          <input type="text" id="supermarketContactInfo" name="supermarketContactInfo" value={receiptData.supermarketContactInfo} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="supermarketReceiveDateTime">Receive Date/Time:</label>
          <input type="datetime-local" id="supermarketReceiveDateTime" name="supermarketReceiveDateTime" value={receiptData.supermarketReceiveDateTime} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="supermarketQuantity">Quantity:</label>
          <input type="number" id="supermarketQuantity" name="supermarketQuantity" value={receiptData.supermarketQuantity} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="supermarketPrice">Price (LKR):</label>
          <input type="number" id="supermarketPrice" name="supermarketPrice" value={receiptData.supermarketPrice} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="promotions">Promotions:</label>
          <input type="text" id="promotions" name="promotions" value={receiptData.promotions} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="labels">Labels:</label>
          <input type="text" id="labels" name="labels" value={receiptData.labels} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="distributionId">Distribution ID:</label>
          <input type="text" id="distributionId" name="distributionId" value={receiptData.distributionId} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" onClick={handleClear} className="btn btn-secondary">Clear Form</button>
        </div>
      </form>
    </div>
  );
};

export default ReceiveDelivery;

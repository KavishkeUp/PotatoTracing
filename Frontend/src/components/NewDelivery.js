import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewDelivery = () => {
  const [deliveryData, setDeliveryData] = useState({
    distributionId: '',
    distributorName: '',
    distributorContactInfo: '',
    deliveryDateTime: '',
    deliveryQuantity: '',
    deliverLocation: '',
    deliverTemperature: '',
    deliverStorageConditions: '',
    collectionId: ''
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleClear = () => {
    setDeliveryData({
      distributionId: '',
      distributorName: '',
      distributorContactInfo: '',
      deliveryDateTime: '',
      deliveryQuantity: '',
      deliverLocation: '',
      deliverTemperature: '',
      deliverStorageConditions: '',
      collectionId: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!deliveryData.distributionId || !deliveryData.distributorName || !deliveryData.collectionId) {
      alert('Please fill in all required fields (Distribution ID, Distributor Name, and Collection ID)');
      return;
    }
    
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please login again. Authentication token not found.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/distributors/create-delivery', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(deliveryData),
      });

      if (response.ok) {
        alert('Delivery successfully created');
        navigate('/distributor-dashboard/past-deliveries');
      } else {
        const errorData = await response.json();
        alert(`Failed to create delivery: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting delivery:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="new-delivery-form">
      <h2>Create New Delivery</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="distributionId">Distribution ID:</label>
          <input type="text" id="distributionId" name="distributionId" value={deliveryData.distributionId} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="distributorName">Distributor Name:</label>
          <input type="text" id="distributorName" name="distributorName" value={deliveryData.distributorName} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="distributorContactInfo">Distributor Contact Info:</label>
          <input type="text" id="distributorContactInfo" name="distributorContactInfo" value={deliveryData.distributorContactInfo} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="deliveryDateTime">Delivery Date/Time:</label>
          <input type="datetime-local" id="deliveryDateTime" name="deliveryDateTime" value={deliveryData.deliveryDateTime} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="deliveryQuantity">Delivery Quantity:</label>
          <input type="number" id="deliveryQuantity" name="deliveryQuantity" value={deliveryData.deliveryQuantity} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="deliverLocation">Delivery Location:</label>
          <input type="text" id="deliverLocation" name="deliverLocation" value={deliveryData.deliverLocation} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="deliverTemperature">Delivery Temperature:</label>
          <input type="number" id="deliverTemperature" name="deliverTemperature" value={deliveryData.deliverTemperature} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="deliverStorageConditions">Delivery Storage Conditions:</label>
          <input type="text" id="deliverStorageConditions" name="deliverStorageConditions" value={deliveryData.deliverStorageConditions} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="collectionId">Collection ID:</label>
          <input type="text" id="collectionId" name="collectionId" value={deliveryData.collectionId} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" onClick={handleClear} className="clear-btn">Clear Form</button>
        </div>
      </form>
    </div>
  );
};

export default NewDelivery;

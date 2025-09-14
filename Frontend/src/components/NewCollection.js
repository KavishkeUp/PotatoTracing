import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewCollection = () => {
  const [collectionData, setCollectionData] = useState({
    collectionId: '',
    clerkName: '',
    clerkContactInfo: '',
    collectionDateTime: '',
    collectionQuantity: '',
    distributeLocation: '',
    distributeTemperature: '',
    distributeStorageConditions: '',
    harvestId: ''
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollectionData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleClear = () => {
    setCollectionData({
      collectionId: '',
      clerkName: '',
      clerkContactInfo: '',
      collectionDateTime: '',
      collectionQuantity: '',
      distributeLocation: '',
      distributeTemperature: '',
      distributeStorageConditions: '',
      harvestId: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!collectionData.collectionId || !collectionData.clerkName || !collectionData.harvestId) {
      alert('Please fill in all required fields (Collection ID, Clerk Name, and Harvest ID)');
      return;
    }
    
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please login again. Authentication token not found.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/clerks/create-collection', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(collectionData),
      });

      if (response.ok) {
        alert('Collection successfully created');
        navigate('/Clerk-Dashboard/past-collections');
      } else {
        const errorData = await response.json();
        alert(`Failed to create collection: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting collection:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="new-record-form">
      <h2>Create New Collection</h2>
      <form onSubmit={handleSubmit}>
        {/* Each form field structured similarly for style application */}
        <div className="form-field">
          <label htmlFor="collectionId">Collection ID:</label>
          <input type="text" id="collectionId" name="collectionId" value={collectionData.collectionId} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="clerkName">Clerk Name:</label>
          <input type="text" id="clerkName" name="clerkName" value={collectionData.clerkName} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="clerkContactInfo">Clerk Contact Info:</label>
          <input type="text" id="clerkContactInfo" name="clerkContactInfo" value={collectionData.clerkContactInfo} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="collectionDateTime">Collection Date/Time:</label>
          <input type="text" id="collectionDateTime" name="collectionDateTime" value={collectionData.collectionDateTime} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="collectionQuantity">Collection Quantity:</label>
          <input type="text" id="collectionQuantity" name="collectionQuantity" value={collectionData.collectionQuantity} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="distributeLocation">Distribute Location:</label>
          <input type="text" id="distributeLocation" name="distributeLocation" value={collectionData.distributeLocation} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="distributeTemperature">Distribute Temperature:</label>
          <input type="text" id="distributeTemperature" name="distributeTemperature" value={collectionData.distributeTemperature} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="distributeStorageConditions">Distribute Storage Conditions:</label>
          <input type="text" id="distributeStorageConditions" name="distributeStorageConditions" value={collectionData.distributeStorageConditions} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="harvestId">Harvest ID:</label>
          <input type="text" id="harvestId" name="harvestId" value={collectionData.harvestId} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" onClick={handleClear} className="clear-btn">Clear Form</button>
        </div>
      </form>
    </div>
  );
};

export default NewCollection;

// src/components/NewRecord.js
import React, { useState } from 'react';

const NewRecord = () => {
  const [record, setRecord] = useState({
    harvestId: '', // Added field
    farmerName: '',
    farmerContactInfo: '', // Added field
    farmLocation: '',
    harvestDateTime: '',
    harvestQuantity: '',
    chemicalsUsed: ''
  });

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');
    console.log('authToken:', authToken);

    // Submit the data to your API endpoint
    const response = await fetch('http://localhost:8080/api/farmer/add-harvest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(record)
    });

    if (response.ok) {
      alert('Record added successfully');
      // Clear the form
      handleClear();
    } else {
      alert('Failed to add record');
    }
  };

  const handleClear = () => {
    setRecord({
      harvestId: '',
      farmerName: '',
      farmerContactInfo: '',
      farmLocation: '',
      harvestDateTime: '',
      harvestQuantity: '',
      chemicalsUsed: ''
    });
  };

  return (
    <div className="new-record-form">
      <h2>Add New Harvest Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="harvestId">Harvest ID:</label>
          <input
            type="text"
            id="harvestId"
            name="harvestId"
            value={record.harvestId}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="farmerName">Farmer Name:</label>
          <input
            type="text"
            id="farmerName"
            name="farmerName"
            value={record.farmerName}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="farmerContactInfo">Farmer Contact Info:</label>
          <input
            type="text"
            id="farmerContactInfo"
            name="farmerContactInfo"
            value={record.farmerContactInfo}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="farmLocation">Farm Location:</label>
          <input
            type="text"
            id="farmLocation"
            name="farmLocation"
            value={record.farmLocation}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="harvestDateTime">Harvest Date and Time:</label>
          <input
            type="datetime-local"
            id="harvestDateTime"
            name="harvestDateTime"
            value={record.harvestDateTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="harvestQuantity">Harvest Quantity (kg):</label>
          <input
            type="number"
            id="harvestQuantity"
            name="harvestQuantity"
            value={record.harvestQuantity}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="chemicalsUsed">Chemicals Used:</label>
          <input
            type="text"
            id="chemicalsUsed"
            name="chemicalsUsed"
            value={record.chemicalsUsed}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default NewRecord;
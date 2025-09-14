// src/components/ReceivedDeliveries.js
import React, { useEffect, useState } from 'react';

const ReceivedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const authToken = localStorage.getItem('authToken');
  
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/supermarkets/received-deliveries', {
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

  const printQRCode = (delivery) => {
    if (delivery.qrCode) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Potato Traceability QR Code</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { margin: 20px; }
              .qr-code { max-width: 300px; }
              .info { margin: 20px 0; text-align: left; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <h1>Potato Traceability QR Code</h1>
            <div class="qr-container">
              <img src="${delivery.qrCode}" alt="QR Code" class="qr-code" />
            </div>
            <div class="info">
              <h3>Product Information:</h3>
              <p><strong>Supermarket:</strong> ${delivery.supermarketName}</p>
              <p><strong>Quantity:</strong> ${delivery.supermarketQuantity} kg</p>
              <p><strong>Price:</strong> LKR ${delivery.supermarketPrice}</p>
              <p><strong>Distribution ID:</strong> ${delivery.distributionId}</p>
              <p><strong>Receive Date:</strong> ${delivery.supermarketReceiveDateTime}</p>
            </p>
            <p><em>Scan this QR code to view complete traceability information</em></p>
            <p><strong>Note:</strong> This QR code contains complete traceability data including farmer details, collection info, distribution details, and supermarket information.</p>
          </body>
        </html>
        <script>window.print();</script>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('QR code not available for this delivery');
    }
  };

  return (
    <div className="received-deliveries-container">
      <h2>Received Deliveries</h2>
      <table className="received-deliveries-table">
        <thead>
          <tr>
            <th>Supermarket Name</th>
            <th>Contact Info</th>
            <th>Receive Date/Time</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Promotions</th>
            <th>Labels</th>
            <th>Distribution ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, index) => (
            <tr key={index}>
              <td>{delivery.supermarketName}</td>
              <td>{delivery.supermarketContactInfo}</td>
              <td>{delivery.supermarketReceiveDateTime}</td>
              <td>{delivery.supermarketQuantity}</td>
              <td>LKR {delivery.supermarketPrice}</td>
              <td>{delivery.promotions}</td>
              <td>{delivery.labels}</td>
              <td>{delivery.distributionId}</td>
              <td>
                <button 
                  onClick={() => printQRCode(delivery)}
                  className="print-btn"
                  title="Print QR Code"
                >
                  🖨️ Print QR
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceivedDeliveries;

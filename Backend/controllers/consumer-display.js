const mongoose = require("mongoose");
const Distribution = require("../schemas/distribution");
const Supermarket = require("../schemas/supermarket");
const Harvest = require("../schemas/harvest");
const Collection = require("../schemas/collection");

// Generate a beautiful HTML page for consumers
function generateConsumerHTML(data) {
    const { supermarketData, distributionData, collectionData, harvestData } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potato Traceability - Your Food Journey</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .journey-container {
            padding: 30px;
        }
        
        .journey-step {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 15px;
            background: #f8f9fa;
            border-left: 5px solid #4CAF50;
            transition: transform 0.3s ease;
        }
        
        .journey-step:hover {
            transform: translateX(10px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .step-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #4CAF50;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            font-size: 24px;
            color: white;
            flex-shrink: 0;
        }
        
        .step-content h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        
        .step-details {
            color: #666;
            line-height: 1.6;
        }
        
        .step-details strong {
            color: #4CAF50;
        }
        
        .timeline {
            position: relative;
            margin: 20px 0;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 30px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #4CAF50;
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 20px;
            padding-left: 60px;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: 24px;
            top: 8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #4CAF50;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #4CAF50;
        }
        
        .quality-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }
        
        .badge {
            background: #e8f5e8;
            color: #4CAF50;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #eee;
        }
        
        .verification {
            background: #e3f2fd;
            border: 1px solid #2196F3;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        
        .verification h4 {
            color: #1976D2;
            margin-bottom: 5px;
        }
        
        .verification p {
            color: #666;
            font-size: 0.9em;
        }
        
        @media (max-width: 600px) {
            .journey-step {
                flex-direction: column;
                text-align: center;
            }
            
            .step-icon {
                margin-right: 0;
                margin-bottom: 15px;
            }
            
            .timeline::before {
                left: 15px;
            }
            
            .timeline-item {
                padding-left: 40px;
            }
            
            .timeline-item::before {
                left: 9px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥔 Your Potato Journey</h1>
            <p>Complete traceability from farm to your table</p>
        </div>
        
        <div class="journey-container">
            <div class="verification">
                <h4>✅ Verified by Blockchain</h4>
                <p>This information is cryptographically secured and cannot be tampered with</p>
            </div>
            
            <div class="timeline">
                <div class="timeline-item">
                    <div class="journey-step">
                        <div class="step-icon">🌾</div>
                        <div class="step-content">
                            <h3>Farm Harvest</h3>
                            <div class="step-details">
                                <strong>Farmer:</strong> ${harvestData.farmerName}<br>
                                <strong>Location:</strong> ${harvestData.farmLocation}<br>
                                <strong>Harvest Date:</strong> ${new Date(harvestData.harvestDateTime).toLocaleDateString()}<br>
                                <strong>Quantity:</strong> ${harvestData.harvestQuantity} kg<br>
                                <strong>Growing Method:</strong> ${harvestData.chemicalsUsed}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="journey-step">
                        <div class="step-icon">📦</div>
                        <div class="step-content">
                            <h3>Collection Center</h3>
                            <div class="step-details">
                                <strong>Collection Manager:</strong> ${collectionData.clerkName}<br>
                                <strong>Location:</strong> ${collectionData.distributeLocation}<br>
                                <strong>Collection Date:</strong> ${new Date(collectionData.collectionDateTime).toLocaleDateString()}<br>
                                <strong>Storage Temperature:</strong> ${collectionData.distributeTemperature}°C<br>
                                <strong>Storage Conditions:</strong> ${collectionData.distributeStorageConditions}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="journey-step">
                        <div class="step-icon">🚚</div>
                        <div class="step-content">
                            <h3>Distribution</h3>
                            <div class="step-details">
                                <strong>Distributor:</strong> ${distributionData.distributorName}<br>
                                <strong>Delivery Location:</strong> ${distributionData.deliverLocation}<br>
                                <strong>Delivery Date:</strong> ${new Date(distributionData.deliveryDateTime).toLocaleDateString()}<br>
                                <strong>Transport Temperature:</strong> ${distributionData.deliverTemperature}°C<br>
                                <strong>Storage Method:</strong> ${distributionData.deliverStorageConditions}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="journey-step">
                        <div class="step-icon">🏪</div>
                        <div class="step-content">
                            <h3>Supermarket</h3>
                            <div class="step-details">
                                <strong>Store:</strong> ${supermarketData.supermarketName}<br>
                                <strong>Contact:</strong> ${supermarketData.supermarketContactInfo}<br>
                                <strong>Received Date:</strong> ${new Date(supermarketData.supermarketReceiveDateTime).toLocaleDateString()}<br>
                                <strong>Price:</strong> Rs. ${supermarketData.supermarketPrice}<br>
                                <strong>Promotions:</strong> ${supermarketData.promotions}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="quality-badges">
                <div class="badge">${harvestData.chemicalsUsed}</div>
                <div class="badge">${supermarketData.labels}</div>
                <div class="badge">Blockchain Verified</div>
                <div class="badge">Complete Traceability</div>
            </div>
        </div>
        
        <div class="footer">
            <p>🔒 This information is secured by blockchain technology</p>
            <p>For more details, contact: ${supermarketData.supermarketContactInfo}</p>
        </div>
    </div>
</body>
</html>`;
}

exports.getConsumerDisplay = async (req, res) => {
    try {
        const supermarketId = req.params.qrcode; // This is actually the supermarketId from the URL
        const supermarketData = await Supermarket.findOne({supermarketId:supermarketId}).exec();

        if (!supermarketData) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>QR Code Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                        .error { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        h1 { color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h1>❌ QR Code Not Found</h1>
                        <p>This QR code is not valid or the product information is not available.</p>
                    </div>
                </body>
                </html>
            `);
        }

        const distributionId = supermarketData.distributionId;
        const distributionData = await Distribution.findOne({ distributionId:distributionId }).exec();
        
        if (!distributionData) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Data Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                        .error { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        h1 { color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h1>❌ Distribution Data Not Found</h1>
                        <p>Unable to retrieve complete traceability information.</p>
                    </div>
                </body>
                </html>
            `);
        }

        const collectionId = distributionData.collectionId;
        const collectionData = await Collection.findOne({collectionId:collectionId}).exec();
        
        if (!collectionData) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Data Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                        .error { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        h1 { color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h1>❌ Collection Data Not Found</h1>
                        <p>Unable to retrieve complete traceability information.</p>
                    </div>
                </body>
                </html>
            `);
        }

        const harvestId = collectionData.harvestId;
        const harvestData = await Harvest.findOne({harvestId:harvestId});
        
        if (!harvestData) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Data Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                        .error { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                        h1 { color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h1>❌ Harvest Data Not Found</h1>
                        <p>Unable to retrieve complete traceability information.</p>
                    </div>
                </body>
                </html>
            `);
        }

        const traceabilityData = {
            supermarketData,
            distributionData,
            collectionData,
            harvestData
        };

        const html = generateConsumerHTML(traceabilityData);
        res.send(html);

    } catch (error) {
        console.error('Error generating consumer display:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                    .error { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                    h1 { color: #e74c3c; }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>❌ Server Error</h1>
                    <p>Something went wrong while retrieving the traceability information.</p>
                </div>
            </body>
            </html>
        `);
    }
};

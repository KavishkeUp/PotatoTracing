const QRCode = require('qrcode');
const mongoose = require('mongoose');

const Supermarket = require("../schemas/supermarket");
const Distribution = require("../schemas/distribution");
const Harvest = require("../schemas/harvest");
const Collection = require("../schemas/collection");
const {sendTransaction} = require("../services/transaction");
const { actions } = require("../constants");

exports.receiveDelivery = ( async (req, res) => {
    try {
        console.log('Received delivery request:', req.body);
        console.log('User object:', req.user);
        
        // Check if user is authenticated
        if (!req.user || !req.user.publicKey) {
            return res.status(401).json({ message: 'User not authenticated or missing public key' });
        }
        
        // Extract data from the request body
        const { supermarketId,supermarketName,supermarketContactInfo,supermarketReceiveDateTime,supermarketQuantity,supermarketPrice,promotions,labels,distributionId} = req.body;

        // Validate required fields
        if (!supermarketId || !supermarketName || !distributionId) {
            return res.status(400).json({ message: 'Missing required fields: supermarketId, supermarketName, distributionId' });
        }

        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        //Generating QR
        if (!req) {
            return res.status(404).json({ message: 'Supermarket Data not found' });
        }

        const supermarketData = ({
            supermarketId,
            supermarketName,
            supermarketContactInfo,
            supermarketReceiveDateTime,
            supermarketQuantity,
            supermarketPrice,
            promotions,
            labels,
            distributionId
        })

        console.log('Looking for distribution with ID:', distributionId);
        const distributionData = await Distribution.findOne({ distributionId:distributionId }).exec();  
        
        if (!distributionData) {
            return res.status(404).json({ message: `Distribution with ID ${distributionId} not found` });
        }
        console.log('Found distribution:', distributionData);

        const collectionId = distributionData.collectionId;
        console.log('Looking for collection with ID:', collectionId);
        const collectionData = await Collection.findOne({collectionId:collectionId}).exec();
        
        if (!collectionData) {
            return res.status(404).json({ message: `Collection with ID ${collectionId} not found` });
        }
        console.log('Found collection:', collectionData);

        const harvestId = collectionData.harvestId;
        console.log('Looking for harvest with ID:', harvestId);
        const harvestData = await Harvest.findOne({harvestId:harvestId});
        
        if (!harvestData) {
            return res.status(404).json({ message: `Harvest with ID ${harvestId} not found` });
        }
        console.log('Found harvest:', harvestData);

        const returnData = ({
            supermarketData,
            distributionData,
            collectionData,
            harvestData

        });

        let qrCode;
        // Get the actual IP address for mobile access
        const os = require('os');
        const networkInterfaces = os.networkInterfaces();
        let serverIP = 'localhost';
        
        // Find the first non-internal IPv4 address
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    serverIP = iface.address;
                    break;
                }
            }
            if (serverIP !== 'localhost') break;
        }
        
        try {
            // Generate QR code with the complete traceability data
            console.log('Generating QR code with complete data');
            qrCode = await QRCode.toDataURL(JSON.stringify(returnData, null, 2));
            console.log('QR code generated successfully, length:', qrCode.length);
        } catch (error) {
            console.error('Error generating QR code:', error);
            return res.status(500).json({ message: 'Error generating QR code: ' + error.message });
        }
        
       
        // Create a ReceivePotato object
        const newDelivery= new Supermarket({
            supermarketId,
            supermarketName,
            supermarketContactInfo,
            supermarketReceiveDateTime,
            supermarketQuantity,
            supermarketPrice,
            promotions,
            labels,
            qrCode: qrCode, // Store the QR code image
            distributionId,
            owner: req.user.publicKey, // Add owner field
        });

        console.log('Saving delivery to database:', newDelivery);
        await newDelivery.save();
        console.log('Delivery saved successfully');
        const payload={
            id:supermarketId,
            supermarketName:supermarketName,
            supermarketContactInfo:supermarketContactInfo,
            supermarketReceiveDateTime:supermarketReceiveDateTime,
            supermarketQuantity:supermarketQuantity,
            supermarketPrice:supermarketPrice,
            promotions:promotions,
            labels:labels,
            qrCode:qrCode,
            distributionId:distributionId,
            owner:req.user.publicKey,
            action: actions.receiveDelivery,
        }
        console.log(payload)
    
    console.log('Sending transaction to blockchain with payload:', payload);
    const test = await sendTransaction(payload, req.user.publicKey)
        .then((result) => {
            console.log('Blockchain transaction successful:', result);
            return({
                result: result,
                message: "Transaction submitted",
                owner:payload.owner
              });

        }).catch((err) => {
            console.error('Blockchain transaction failed:', err);
            return ('Pending in transaction submission');
        })
    const response = {
        qr:qrCode, // Return the QR code image
        test:test,
        message:'Delivery transaction submitted successfully.'
    }

            res.status(200).json(response);
    } catch (error) {
        console.error('Error in receiveDelivery:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack
        });
    }
});

exports.getReceivedDeliveries = async (req, res) => {
    try {
        const deliveries = await Supermarket.find({ owner: req.user.publicKey }).sort({ supermarketReceiveDateTime: -1 });
        res.status(200).json(deliveries);
    } catch (error) {
        console.error('Error in getReceivedDeliveries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
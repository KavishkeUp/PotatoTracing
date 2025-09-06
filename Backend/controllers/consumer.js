const mongoose= require("mongoose");
const Distribution = require("../schemas/distribution");
const Supermarket = require("../schemas/supermarket");
const Harvest = require("../schemas/harvest");
const Collection = require("../schemas/collection");
const {sendTransaction} = require("../services/transaction");
const { actions } = require("../constants");


exports.getDetails = (async (req, res) => {
    try {
        const qrcode = req.params.qrcode;
        const supermarketData = await Supermarket.findOne({qrCode:qrcode}).exec();

        if (!supermarketData) {
            return res.status(404).json({ message: 'QR code not found' });
        }

        const distributionId = supermarketData.distributionId;

        const distributionData = await Distribution.findOne({ distributionId:distributionId }).exec();  

        const collectionId = distributionData.collectionId;

        const collectionData = await Collection.findOne({collectionId:collectionId}).exec();

        const harvestId = collectionData.harvestId;

        const harvestData = await Harvest.findOne({harvestId:harvestId});

        return res.json({
            supermarketData,
            distributionData,
            collectionData,
            harvestData

        });

        // // Extract the product ID from the request parameters
        // const productId = req.params.id;

        // // Create a query payload
        // const queryPayload = {
        //     action: 'query',
        //     productId,
        // };

        // // Define the transaction header
        // const transactionHeader = TransactionHeader.encode({
        //     familyName: 'potato-chain',
        //     familyVersion: '1.0',
        //     inputs: ['your-input-address'],
        //     outputs: ['your-output-address'],
        //     signerPublicKey: 'your-public-key',
        // }).finish();

        // // Send the query transaction to the Sawtooth network
        // await sendTransaction(context, transactionHeader, JSON.stringify(queryPayload), 'your-private-key');

       //res.status(200).json({ message: 'Query transaction submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const Distribution = require("../schemas/distribution");
const {sendTransaction} = require("../services/transaction");
const { actions } = require("../constants");

exports.createDistribution = (async (req, res) => {
    try {
        

        // Extract data from the request body
        const { distributionId,distributorName,distributorContactInfo,deliveryDateTime,deliveryQuantity,deliverLocation,deliverTemperature,deliverStorageConditions,collectionId } = req.body;

        // Create a Delivery object
        const newDistribution= new Distribution({
            distributionId,
            distributorName,
            distributorContactInfo,
            deliveryDateTime,
            deliveryQuantity,
            deliverLocation,
            deliverTemperature,
            deliverStorageConditions,
            collectionId,
            owner: req.user.publicKey, // Add owner field to database record
        });

        await newDistribution.save();
        
        const payload={
            id:distributionId,
            distributorName:distributorName,
            distributorContactInfo:distributorContactInfo,
            deliveryDateTime:deliveryDateTime,
            deliveryQuantity:deliveryQuantity,
            deliverLocation:deliverLocation,
            deliverTemperature:deliverTemperature,
            deliverStorageConditions:deliverStorageConditions,
            collectionId:collectionId, 
            owner:req.user.publicKey,
            action: actions.createDistribution,
        }
        console.log(payload)
    
    const test = await sendTransaction(payload, req.user.publicKey)
        .then((result) => {
            return({
                result: result,
                message: "Transaction submitted",
                owner:payload.owner
              });

        }).catch((err) => {
            return ('Pending in transaction submission');
        })
    const response = {
        test:test,
        message:'Distribution transaction submitted successfully.'
    }

            res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.getPastDeliveries = async (req, res) => {
    try {
        const deliveries = await Distribution.find({ owner: req.user.publicKey }).sort({ deliveryDateTime: -1 });
        res.status(200).json(deliveries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
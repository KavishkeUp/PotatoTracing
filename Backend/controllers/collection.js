const Collection  = require("../schemas/collection");
const {sendTransaction} = require("../services/transaction");
const { actions } = require("../constants");

exports.createCollection = (async (req, res) => {
    try {

        const { collectionId, clerkName,clerkContactInfo,collectionDateTime,collectionQuantity, distributeLocation,distributeTemperature,distributeStorageConditions,harvestId} = req.body;

        // Create a Collection object
        const newCollection = new Collection({
            collectionId,
            clerkName,
            clerkContactInfo,
            collectionDateTime,
            collectionQuantity,
            distributeLocation,
            distributeTemperature,
            distributeStorageConditions,
            harvestId,
            owner: req.user.publicKey, // Add owner field to database record
        })

        await newCollection.save();

        const payload={
            id:collectionId,
            clerkName:clerkName,
            clerkContactInfo:clerkContactInfo,
            collectionDateTime:collectionDateTime,
            collectionQuantity:collectionQuantity,
            distributeLocation:distributeLocation,
            distributeTemperature:distributeTemperature,
            distributeStorageConditions:distributeStorageConditions,
            harvestId:harvestId,
            owner:req.user.publicKey,
            action: actions.createCollection,
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
        message:'Collection transaction submitted successfully.'
    }

            res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.getPastCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ owner: req.user.publicKey }).sort({ collectionDateTime: -1 });
        res.status(200).json(collections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const Harvest = require("../schemas/harvest");
const {sendTransaction} = require("../services/transaction");
const { actions } = require("../constants");

exports.createHarvest = (async(req, res) => {
    try {
        const { harvestId,farmerName,farmerContactInfo,farmLocation,harvestDateTime,harvestQuantity,chemicalsUsed} = req.body;
        const newHarvest = new Harvest({
            harvestId,
            farmerName,
            farmerContactInfo,
            farmLocation,
            harvestDateTime,
            harvestQuantity,
            chemicalsUsed,
            owner: req.user.publicKey, // Add owner field to database record
        }) 

        await newHarvest.save();

        

        const payload={
                id:harvestId,
                farmerName :farmerName,
                farmerContactInfo : farmLocation,
                farmLocation : farmLocation,
                harvestDateTime : harvestDateTime,
                harvestQuantity : harvestQuantity,
                chemicalsUsed : chemicalsUsed,
                owner:req.user.publicKey,
                action: actions.createHarvest,
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
            message:'Harvest transaction submitted successfully.'
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.getPastRecords = async (req, res) => {
    try {
        const records = await Harvest.find({ owner: req.user.publicKey }).sort({ harvestDateTime: -1 });
        res.status(200).json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


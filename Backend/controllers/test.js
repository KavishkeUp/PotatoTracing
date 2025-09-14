const Test = require("../schemas/test");
const {sendTransaction,fetchDataById} = require("../services/transaction");
const { actions } = require("../constants");

exports.newEntry = ( async (req, res) => {
    try {
        // Extract data from the request body
        const { testId,qrCode,testName} = req.body;
        
        // Create a ReceivePotato object
        const newEnt= new Test({
            testId,
            qrCode,
            testName,
            //req.user.publicKey,
        });

        await newEnt.save();
        
        const payload={
            id:testId,
            testName:testName,
            qrCode:qrCode,
            owner:req.user.publicKey,
            action: actions.receiveDelivery,
        }
        
    
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
        message:'Delivery transaction submitted successfully.'
    }

    res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Method to retrieve data by ID
exports.getTestDataById = async (req, res) => {
    console.log('eeeee')
    console.log(req.params);
    try {
        const { id } = req.params; // Retrieve ID from request parameters
        const testData = await fetchDataById(id); // Fetch data by ID from the blockchain
        if (testData) {
            res.status(200).json({ testData });
        } else {
            res.status(404).json({ message: 'Data not found for the specified ID' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
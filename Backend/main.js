const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();


//Connecting with the Transaction Processor
const { TransactionProcessor } = require('sawtooth-sdk-js/processor');
const IntegerKeyHandler = require('./handler/intkey');
const ChainHandler = require('./handler/chain');

const VALIDATOR_URL = 'tcp://localhost:4004'
const transactionProcessor = new TransactionProcessor(VALIDATOR_URL)



transactionProcessor.addHandler(new IntegerKeyHandler());
transactionProcessor.addHandler(new ChainHandler());


transactionProcessor.start();



//Defining routes
const user = require('./routes/user');
const chain = require('./routes/chain')
const authMiddleware = require('./auth-middleware');
const { getDetails } = require('./controllers/consumer');
const { getTestDataById } = require('./controllers/test');
const { predictPotatoPrice, predictPotatoDemand } = require('./controllers/prediction');


const port = process.env.PORT || 8080;

// Setup 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require('./db');
// Register routes
app.get('/health', (req, res) => {
    res.json({
        message: 'Running'
    })
})
app.use('/auth', user)
app.use('/api', authMiddleware, chain)
app.get('/chain/consumers/:qrcode',getDetails)

// Prediction endpoints (protected by authentication)
app.post('/predict_potato_prices', authMiddleware, predictPotatoPrice);
app.post('/predict_potato_demand', authMiddleware, predictPotatoDemand);

app.get('/test/:id',getTestDataById)

app.get('/generate', async (req, res) => {
    try {
        // Generate QR code
        const qrCodeData = 'Your data here'; // Replace with your data
        const qrCode = await QRCode.toDataURL(qrCodeData);

        // Serve QR code image to the client
        res.send(qrCode);
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Error generating QR code');
    }
});

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test-db');
        // Server run
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running over here http://localhost:${port}/health`)
        })
    } catch (error) {
        console.error('Failed to get the server running', error)
    }
}

start();

//Handle Stop Process
process.on('SIGUSR2', () => {
    transactionProcessor._handleShutdown();
})
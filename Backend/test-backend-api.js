const express = require('express');
const cors = require('cors');
const { predictPotatoPrice } = require('./controllers/prediction');

// Create a simple test server
const app = express();
app.use(express.json());
app.use(cors());

// Mock authentication middleware for testing
const mockAuthMiddleware = (req, res, next) => {
    req.user = {
        publicKey: 'test_user_123'
    };
    next();
};

// Test endpoint
app.post('/predict_potato_prices', mockAuthMiddleware, predictPotatoPrice);

// Health check
app.get('/health', (req, res) => {
    res.json({ message: 'Test server running' });
});

const PORT = 8081;

app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log('Test the prediction API with:');
    console.log('POST http://localhost:8081/predict_potato_prices');
    console.log('Body: {"temp":25,"disaster":"none","condition":"good","variety":"russet","rainfall":80,"origin":"Kandy","organic":"no","location":"Colombo"}');
});

module.exports = app;

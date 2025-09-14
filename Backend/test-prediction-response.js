// Test the prediction response format
const MLPredictor = require('./ml-predictor');

async function testPredictionResponse() {
    console.log('🧪 Testing Prediction Response Format\n');
    
    try {
        const predictor = new MLPredictor();
        
        const testData = {
            temp: 25,
            disaster: 'none',
            condition: 'good',
            variety: 'russet',
            rainfall: 80,
            origin: 'Kandy',
            organic: 'no',
            location: 'Colombo'
        };
        
        console.log('Test Data:', testData);
        console.log('\nCalling predictPrice...');
        
        const result = await predictor.predictPrice(testData);
        
        console.log('\nRaw Result:', JSON.stringify(result, null, 2));
        
        // Simulate what the API controller does
        const apiResponse = {
            predicted_price: result.success ? result.predicted_price : result.fallback_price,
            prediction_method: result.success ? 'Random Forest ML Model' : 'Fallback Logic',
            confidence: result.success ? result.confidence : 0.6,
            message: 'Price prediction completed successfully.'
        };
        
        console.log('\nAPI Response Format:', JSON.stringify(apiResponse, null, 2));
        
        if (apiResponse.predicted_price) {
            console.log(`\n✅ SUCCESS: Price prediction works!`);
            console.log(`💰 Predicted Price: LKR ${apiResponse.predicted_price.toFixed(2)}`);
            console.log(`📊 Method: ${apiResponse.prediction_method}`);
            console.log(`🎯 Confidence: ${(apiResponse.confidence * 100).toFixed(1)}%`);
        } else {
            console.log(`\n❌ FAILED: No price prediction returned`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

testPredictionResponse();

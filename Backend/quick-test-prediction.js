// Quick test for prediction system
const MLPredictor = require('./ml-predictor');

async function quickTest() {
    console.log('🧪 Quick Prediction Test\n');
    
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
        console.log('\nTesting prediction...');
        
        const result = await predictor.predictPrice(testData);
        
        console.log('\nResult:', result);
        
        if (result.success) {
            console.log(`✅ SUCCESS: Predicted price is LKR ${result.predicted_price.toFixed(2)}`);
            console.log(`📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        } else {
            console.log(`⚠️ ML Model failed, using fallback: LKR ${result.fallback_price.toFixed(2)}`);
            console.log(`❌ Error: ${result.error}`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

quickTest();

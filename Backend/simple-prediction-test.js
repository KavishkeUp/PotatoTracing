const MLPredictor = require('./ml-predictor');

async function testSimplePrediction() {
    console.log('🧪 Testing Simple Price Prediction System...\n');
    
    try {
        const predictor = new MLPredictor();
        
        // Test data
        const testCases = [
            {
                name: 'Normal Conditions',
                data: {
                    temp: 25,
                    disaster: 'none',
                    condition: 'good',
                    variety: 'russet',
                    rainfall: 80,
                    origin: 'Kandy',
                    organic: 'no',
                    location: 'Colombo'
                }
            },
            {
                name: 'Hot Weather + Flood',
                data: {
                    temp: 35,
                    disaster: 'flood',
                    condition: 'poor',
                    variety: 'organic',
                    rainfall: 200,
                    origin: 'Galle',
                    organic: 'yes',
                    location: 'Colombo'
                }
            },
            {
                name: 'Cold Weather + Drought',
                data: {
                    temp: 10,
                    disaster: 'drought',
                    condition: 'excellent',
                    variety: 'red',
                    rainfall: 20,
                    origin: 'Nuwara Eliya',
                    organic: 'no',
                    location: 'Kandy'
                }
            }
        ];
        
        for (const testCase of testCases) {
            console.log(`📊 Testing: ${testCase.name}`);
            console.log('Input:', testCase.data);
            
            try {
                const result = await predictor.predictPrice(testCase.data);
                console.log('✅ Result:', result);
            } catch (error) {
                console.log('❌ Error:', error.message);
            }
            
            console.log('---\n');
        }
        
        console.log('🎉 Simple prediction test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testSimplePrediction();

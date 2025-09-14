const MLPredictor = require('./ml-predictor');

// Sample test cases for price prediction
const testCases = [
    {
        name: "Normal Conditions - Good Weather",
        input: {
            temp: 25,
            disaster: "none",
            condition: "good",
            variety: "russet",
            rainfall: 80,
            origin: "Kandy",
            organic: "no",
            location: "Colombo"
        }
    },
    {
        name: "Hot Weather + Flood Conditions",
        input: {
            temp: 35,
            disaster: "flood",
            condition: "poor",
            variety: "organic",
            rainfall: 200,
            origin: "Galle",
            organic: "yes",
            location: "Colombo"
        }
    },
    {
        name: "Cold Weather + Drought",
        input: {
            temp: 10,
            disaster: "drought",
            condition: "excellent",
            variety: "red",
            rainfall: 20,
            origin: "Nuwara Eliya",
            organic: "no",
            location: "Kandy"
        }
    },
    {
        name: "Optimal Growing Conditions",
        input: {
            temp: 20,
            disaster: "none",
            condition: "excellent",
            variety: "yellow",
            rainfall: 100,
            origin: "Badulla",
            organic: "yes",
            location: "Matara"
        }
    },
    {
        name: "Storm Conditions",
        input: {
            temp: 28,
            disaster: "storm",
            condition: "average",
            variety: "russet",
            rainfall: 150,
            origin: "Trincomalee",
            organic: "no",
            location: "Jaffna"
        }
    }
];

async function testPredictions() {
    console.log('🧪 Testing Potato Price Predictions with Sample Inputs\n');
    console.log('=' .repeat(60));
    
    const predictor = new MLPredictor();
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n📊 Test Case ${i + 1}: ${testCase.name}`);
        console.log('-'.repeat(50));
        
        console.log('Input Parameters:');
        console.log(`  Temperature: ${testCase.input.temp}°C`);
        console.log(`  Disaster: ${testCase.input.disaster}`);
        console.log(`  Condition: ${testCase.input.condition}`);
        console.log(`  Variety: ${testCase.input.variety}`);
        console.log(`  Rainfall: ${testCase.input.rainfall}mm`);
        console.log(`  Origin: ${testCase.input.origin}`);
        console.log(`  Organic: ${testCase.input.organic}`);
        console.log(`  Market Location: ${testCase.input.location}`);
        
        try {
            const result = await predictor.predictPrice(testCase.input);
            
            console.log('\n🎯 Prediction Result:');
            if (result.success) {
                console.log(`  ✅ Predicted Price: LKR ${result.predicted_price.toFixed(2)}`);
                console.log(`  📈 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
                console.log(`  🤖 Method: Machine Learning Model`);
            } else {
                console.log(`  ⚠️  ML Model Failed: ${result.error}`);
                console.log(`  💰 Fallback Price: LKR ${result.fallback_price.toFixed(2)}`);
                console.log(`  📊 Method: Fallback Logic`);
            }
            
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All test cases completed!');
    console.log('\n💡 To test via API, use these sample inputs with:');
    console.log('   POST http://localhost:8080/predict_potato_prices');
    console.log('   Headers: Content-Type: application/json, Authorization: Bearer YOUR_TOKEN');
}

// Run the tests
testPredictions().catch(console.error);

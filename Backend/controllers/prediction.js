const {sendTransaction} = require("../services/transaction");
const { actions } = require("../constants");
const MLPredictor = require("../ml-predictor");

// Initialize ML predictor
const mlPredictor = new MLPredictor();

exports.predictPotatoPrice = async (req, res) => {
    try {
        console.log('Received price prediction request:', req.body);
        console.log('User object:', req.user);
        
        // Check if user is authenticated
        if (!req.user || !req.user.publicKey) {
            return res.status(401).json({ message: 'User not authenticated or missing public key' });
        }
        
        const { temp, disaster, condition, variety, rainfall, origin, organic, location } = req.body;
        
        // Use ML model for prediction
        console.log('🤖 Using trained Random Forest model for price prediction...');
        const mlResult = await mlPredictor.predictPrice({
            temp, disaster, condition, variety, rainfall, origin, organic, location
        });

        let predictedPrice;
        let predictionMethod = 'Random Forest ML Model';
        let confidence = null;

        if (mlResult.success) {
            predictedPrice = mlResult.predicted_price;
            confidence = mlResult.confidence;
            console.log(`✅ ML prediction successful: LKR ${predictedPrice} (confidence: ${confidence})`);
        } else {
            // Fallback to data-driven analysis if ML model fails
            console.log(`⚠️ ML model failed: ${mlResult.error}. Using data-driven analysis.`);
            const dataResult = await predictPriceFromData({
                temp, disaster, condition, variety, rainfall, origin, organic, location
            });
            
            if (dataResult.success) {
                predictedPrice = dataResult.predicted_price;
                confidence = dataResult.confidence;
                predictionMethod = 'Data-Driven Analysis';
                console.log(`✅ Data-driven prediction successful: LKR ${predictedPrice} (confidence: ${confidence})`);
            } else {
                // Final fallback to simple logic
                console.log(`⚠️ Data-driven prediction failed. Using fallback logic.`);
                predictedPrice = mlResult.fallback_price;
                predictionMethod = 'Fallback Logic';
                confidence = 0.6;
            }
        }

        const payload = {
            id: `pred_${Date.now()}`,
            temp,
            disaster,
            condition,
            variety,
            rainfall,
            origin,
            organic,
            location,
            predictedPrice,
            predictionMethod,
            confidence,
            owner: req.user.publicKey,
            action: actions.predictPrice || 'predictPrice',
        };
        
        // Send transaction to blockchain
        const test = await sendTransaction(payload, req.user.publicKey)
            .then((result) => {
                return {
                    result: result,
                    message: "Prediction transaction submitted",
                    owner: payload.owner
                };
            }).catch((err) => {
                return 'Pending in transaction submission';
            });
        
        const response = {
            predicted_price: predictedPrice,
            prediction_method: predictionMethod,
            confidence: confidence,
            test: test,
            message: 'Price prediction completed successfully.'
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in predictPotatoPrice:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack
        });
    }
};

// Data-driven prediction function (fallback)
const mongoose = require('mongoose');
const Harvest = require("../schemas/harvest");
const Collection = require("../schemas/collection");
const Distribution = require("../schemas/distribution");
const Supermarket = require("../schemas/supermarket");

async function predictPriceFromData(inputData) {
    try {
        // Connect to database if not already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect('mongodb://localhost:27017/test-db');
        }

        // Get all supermarket records with prices
        const supermarketRecords = await Supermarket.find({}).limit(100);
        
        if (supermarketRecords.length === 0) {
            throw new Error('No price data available in database');
        }

        // Calculate base price from historical data
        const prices = supermarketRecords
            .map(record => parseFloat(record.supermarketPrice))
            .filter(price => !isNaN(price) && price > 0 && price < 100000); // Filter for LKR prices (up to 100k LKR)

        if (prices.length === 0) {
            throw new Error('No valid price data found');
        }

        // Calculate average price and standard deviation
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;
        const stdDev = Math.sqrt(variance);

        // Start with average price
        let predictedPrice = avgPrice;

        // Adjust based on temperature
        if (inputData.temp > 25) {
            predictedPrice += stdDev * 0.1; // 10% of std dev
        } else if (inputData.temp < 15) {
            predictedPrice += stdDev * 0.05; // 5% of std dev
        }

        // Adjust based on disaster conditions
        if (inputData.disaster === 'flood' || inputData.disaster === 'drought') {
            predictedPrice += stdDev * 0.2; // 20% of std dev
        }

        // Adjust based on crop condition
        if (inputData.condition === 'excellent') {
            predictedPrice += stdDev * 0.1; // 10% of std dev
        } else if (inputData.condition === 'poor') {
            predictedPrice -= stdDev * 0.15; // -15% of std dev
        }

        // Adjust based on variety
        if (inputData.variety === 'organic') {
            predictedPrice += stdDev * 0.15; // 15% of std dev
        }

        // Adjust based on rainfall
        if (inputData.rainfall > 100) {
            predictedPrice += stdDev * 0.05; // 5% of std dev
        } else if (inputData.rainfall < 50) {
            predictedPrice += stdDev * 0.08; // 8% of std dev
        }

        // Adjust based on organic status
        if (inputData.organic === 'yes') {
            predictedPrice += stdDev * 0.12; // 12% of std dev
        }

        // Ensure price is within reasonable bounds for LKR
        predictedPrice = Math.max(10.0, Math.min(100000.0, predictedPrice));

        // Calculate confidence based on data quality
        const confidence = Math.min(0.95, Math.max(0.6, 0.7 + (prices.length / 100) * 0.25));

        return {
            success: true,
            predicted_price: predictedPrice,
            confidence: confidence,
            data_points: prices.length,
            average_price: avgPrice,
            standard_deviation: stdDev
        };

    } catch (error) {
        console.error('Error in data-driven prediction:', error);
        return {
            success: false,
            error: error.message,
            fallback_price: calculateFallbackPrice(inputData)
        };
    }
}

// Fallback price calculation (in LKR)
function calculateFallbackPrice(inputData) {
    let basePrice = 250.0; // Base price in LKR

    // Adjust based on temperature
    if (inputData.temp > 25) basePrice += 30.0;
    if (inputData.temp < 15) basePrice += 20.0;

    // Adjust based on disaster
    if (inputData.disaster === 'flood' || inputData.disaster === 'drought') {
        basePrice += 50.0;
    }

    // Adjust based on condition
    if (inputData.condition === 'excellent') basePrice += 25.0;
    if (inputData.condition === 'poor') basePrice -= 25.0;

    // Adjust based on variety
    if (inputData.variety === 'organic') basePrice += 40.0;

    // Adjust based on rainfall
    if (inputData.rainfall > 100) basePrice += 15.0;
    if (inputData.rainfall < 50) basePrice += 20.0;

    // Adjust based on organic
    if (inputData.organic === 'yes') basePrice += 35.0;

    return Math.max(10.0, basePrice);
}

exports.predictPotatoDemand = async (req, res) => {
    try {
        console.log('Received demand prediction request:', req.body);
        console.log('User object:', req.user);
        
        // Check if user is authenticated
        if (!req.user || !req.user.publicKey) {
            return res.status(401).json({ message: 'User not authenticated or missing public key' });
        }
        
        const { season, marketTrend, population, previousDemand } = req.body;
        
        console.log('Processing demand prediction with:', { season, marketTrend, population, previousDemand });
        
        // Simple demand prediction logic (you can replace this with ML model)
        let baseDemand = 1000; // Base demand in kg
        
        // Adjust demand based on season
        if (season === 'winter') baseDemand += 200;
        if (season === 'summer') baseDemand += 150;
        if (season === 'spring') baseDemand += 100;
        
        // Adjust demand based on market trend
        if (marketTrend === 'increasing') baseDemand += 300;
        if (marketTrend === 'decreasing') baseDemand -= 200;
        
        // Adjust demand based on population
        if (population > 1000000) baseDemand += 500;
        if (population < 100000) baseDemand -= 200;
        
        // Adjust demand based on previous demand
        if (previousDemand) {
            baseDemand = Math.round((baseDemand + previousDemand) / 2);
        }
        
        const predictedDemand = Math.max(100, baseDemand); // Minimum demand 100
        
        const payload = {
            id: `demand_${Date.now()}`,
            season,
            marketTrend,
            population,
            previousDemand,
            predictedDemand,
            owner: req.user.publicKey,
            action: actions.predictDemand || 'predictDemand',
        };
        
        // Send transaction to blockchain
        const test = await sendTransaction(payload, req.user.publicKey)
            .then((result) => {
                return {
                    result: result,
                    message: "Demand prediction transaction submitted",
                    owner: payload.owner
                };
            }).catch((err) => {
                return 'Pending in transaction submission';
            });
        
        const response = {
            predicted_demand: predictedDemand,
            test: test,
            message: 'Demand prediction completed successfully.'
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in predictPotatoDemand:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack
        });
    }
};

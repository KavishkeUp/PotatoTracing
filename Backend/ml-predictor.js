const { spawn } = require('child_process');
const path = require('path');

class MLPredictor {
    constructor() {
        this.modelLoaded = false;
        this.modelPath = path.join(__dirname, 'potato_price_model.pkl');
    }

    /**
     * Check if the model file exists
     */
    async checkModelExists() {
        const fs = require('fs').promises;
        try {
            await fs.access(this.modelPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Make prediction using the trained model
     */
    async predictPrice(inputData) {
        try {
            // Check if model exists
            const modelExists = await this.checkModelExists();
            if (!modelExists) {
                throw new Error('Model file not found. Please train the model first.');
            }

            // Prepare input data for prediction
            const predictionInput = this.prepareInputData(inputData);

            // Make prediction using Python script
            const prediction = await this.runPythonPrediction(predictionInput);
            
            return {
                success: true,
                predicted_price: prediction,
                confidence: this.calculateConfidence(prediction)
            };

        } catch (error) {
            console.error('Error in ML prediction:', error);
            return {
                success: false,
                error: error.message,
                fallback_price: this.calculateFallbackPrice(inputData)
            };
        }
    }

    /**
     * Prepare input data for the model
     */
    prepareInputData(inputData) {
        const {
            temp, disaster, condition, variety, rainfall, origin, organic, location
        } = inputData;

        // Convert input data to model features
        const features = {
            // Time features (using current date as reference)
            harvestMonth: new Date().getMonth() + 1,
            daysFromHarvestToCollection: 1, // Default 1 day
            daysFromCollectionToDistribution: 2, // Default 2 days
            daysFromDistributionToSupermarket: 1, // Default 1 day
            totalDaysInSupplyChain: 4, // Sum of above

            // Quantity features (estimated based on typical values)
            harvestQuantity: 500, // Default harvest quantity
            collectionQuantity: 480, // 4% loss
            distributionQuantity: 456, // 5% loss
            supermarketQuantity: 433, // 5% loss
            collectionLossPercent: 4.0,
            distributionLossPercent: 5.0,
            supermarketLossPercent: 5.0,

            // Location features (encoded)
            origin: this.encodeLocation(origin),
            marketLocation: this.encodeLocation(location),

            // Chemical features
            chemicalsUsed: this.encodeChemicals(organic),

            // Storage features (default values)
            collectionStorageConditions: 2, // Cool Storage
            distributionStorageConditions: 2, // Cool Storage

            // Temperature features
            collectionTemperature: temp || 20,
            distributionTemperature: temp || 20,

            // Market features (default values)
            promotions: 5, // None
            labels: 5, // Standard

            // Season (calculated from current month)
            season: this.getSeason(new Date().getMonth() + 1)
        };

        return features;
    }

    /**
     * Run Python prediction script
     */
    async runPythonPrediction(inputData) {
        return new Promise((resolve, reject) => {
            const pythonScript = path.join(__dirname, 'predict_price.py');
            
            // Create temporary input file
            const fs = require('fs');
            const inputFile = path.join(__dirname, 'temp_input.json');
            fs.writeFileSync(inputFile, JSON.stringify(inputData));

            const pythonProcess = spawn('python', [pythonScript, inputFile]);

            let result = '';
            let error = '';

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            pythonProcess.on('close', (code) => {
                // Clean up temporary file
                try {
                    fs.unlinkSync(inputFile);
                } catch (e) {
                    // Ignore cleanup errors
                }

                if (code !== 0) {
                    reject(new Error(`Python script failed: ${error}`));
                    return;
                }

                try {
                    const prediction = parseFloat(result.trim());
                    if (isNaN(prediction)) {
                        reject(new Error('Invalid prediction result'));
                        return;
                    }
                    resolve(prediction);
                } catch (e) {
                    reject(new Error('Failed to parse prediction result'));
                }
            });

            pythonProcess.on('error', (err) => {
                reject(new Error(`Failed to start Python process: ${err.message}`));
            });
        });
    }

    /**
     * Calculate confidence score based on prediction
     */
    calculateConfidence(prediction) {
        // Simple confidence calculation based on price range
        if (prediction >= 1.0 && prediction <= 5.0) {
            return 0.9; // High confidence for reasonable prices
        } else if (prediction >= 0.5 && prediction <= 8.0) {
            return 0.7; // Medium confidence for wider range
        } else {
            return 0.5; // Low confidence for extreme values
        }
    }

    /**
     * Calculate fallback price when ML model fails
     */
    calculateFallbackPrice(inputData) {
        let basePrice = 2.50;

        // Adjust based on temperature
        if (inputData.temp > 25) basePrice += 0.30;
        if (inputData.temp < 15) basePrice += 0.20;

        // Adjust based on disaster
        if (inputData.disaster === 'flood' || inputData.disaster === 'drought') {
            basePrice += 0.50;
        }

        // Adjust based on condition
        if (inputData.condition === 'excellent') basePrice += 0.25;
        if (inputData.condition === 'poor') basePrice -= 0.25;

        // Adjust based on variety
        if (inputData.variety === 'organic') basePrice += 0.40;

        // Adjust based on rainfall
        if (inputData.rainfall > 100) basePrice += 0.15;
        if (inputData.rainfall < 50) basePrice += 0.20;

        // Adjust based on organic
        if (inputData.organic === 'yes') basePrice += 0.35;

        return Math.max(0.50, basePrice);
    }

    // Helper functions (same as in extract-training-data.js)
    getSeason(month) {
        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        if (month >= 9 && month <= 11) return 'autumn';
        return 'winter';
    }

    encodeLocation(location) {
        if (!location) return 0;
        const locations = [
            'Kandy', 'Jaffna', 'Anuradhapura', 'Galle', 'Trincomalee',
            'Kurunegala', 'Ratnapura', 'Badulla', 'Polonnaruwa', 'Matara',
            'Colombo', 'Nuwara Eliya', 'Batticaloa', 'Ampara', 'Monaragala'
        ];
        const index = locations.findIndex(loc => location.toLowerCase().includes(loc.toLowerCase()));
        return index >= 0 ? index + 1 : 0;
    }

    encodeChemicals(organic) {
        if (!organic) return 0;
        if (organic === 'yes') return 1; // Organic
        return 3; // Standard Fertilizers
    }
}

module.exports = MLPredictor;

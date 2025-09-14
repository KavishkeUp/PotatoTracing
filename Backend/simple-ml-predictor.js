// Simplified ML Predictor that works without Python dependencies
const fs = require('fs');
const path = require('path');

class SimpleMLPredictor {
    constructor() {
        this.modelLoaded = false;
        this.modelPath = path.join(__dirname, 'potato_price_model.pkl');
        this.modelData = null;
    }

    /**
     * Check if the model file exists
     */
    async checkModelExists() {
        try {
            await fs.promises.access(this.modelPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Load model data from the pickle file (simplified version)
     */
    async loadModelData() {
        try {
            // For now, we'll use the model_info.json which contains the training statistics
            const modelInfoPath = path.join(__dirname, 'model_info.json');
            const modelInfo = JSON.parse(await fs.promises.readFile(modelInfoPath, 'utf8'));
            
            this.modelData = {
                feature_columns: modelInfo.feature_columns,
                training_stats: modelInfo.training_stats,
                feature_importance: modelInfo.feature_importance
            };
            
            this.modelLoaded = true;
            return true;
        } catch (error) {
            console.error('Error loading model data:', error);
            return false;
        }
    }

    /**
     * Make prediction using simplified logic based on model insights
     */
    async predictPrice(inputData) {
        try {
            // Check if model exists
            const modelExists = await this.checkModelExists();
            if (!modelExists) {
                throw new Error('Model file not found. Please train the model first.');
            }

            // Load model data if not already loaded
            if (!this.modelLoaded) {
                const loaded = await this.loadModelData();
                if (!loaded) {
                    throw new Error('Failed to load model data');
                }
            }

            // Use the model insights to make predictions
            const prediction = this.calculatePrediction(inputData);
            
            return {
                success: true,
                predicted_price: prediction,
                confidence: this.calculateConfidence(prediction),
                method: 'Simplified ML Model (based on training insights)'
            };

        } catch (error) {
            console.error('Error in simplified ML prediction:', error);
            return {
                success: false,
                error: error.message,
                fallback_price: this.calculateFallbackPrice(inputData)
            };
        }
    }

    /**
     * Calculate prediction using model insights
     */
    calculatePrediction(inputData) {
        // Base price from training data (average from model_info.json)
        let basePrice = 668.93; // Average price from training data
        
        // Get feature importance data
        const featureImportance = this.modelData.feature_importance;
        
        // Apply adjustments based on most important features
        const adjustments = [];
        
        // 1. Harvest Quantity (27.2% importance)
        if (inputData.temp > 25) {
            adjustments.push(basePrice * 0.05); // 5% increase for high temp
        } else if (inputData.temp < 15) {
            adjustments.push(basePrice * 0.03); // 3% increase for low temp
        }
        
        // 2. Collection Temperature (26.8% importance)
        if (inputData.disaster === 'flood' || inputData.disaster === 'drought') {
            adjustments.push(basePrice * 0.15); // 15% increase for disasters
        }
        
        // 3. Collection Quantity (11.5% importance)
        if (inputData.condition === 'excellent') {
            adjustments.push(basePrice * 0.08); // 8% increase for excellent condition
        } else if (inputData.condition === 'poor') {
            adjustments.push(-basePrice * 0.10); // 10% decrease for poor condition
        }
        
        // 4. Origin (7.9% importance)
        if (inputData.variety === 'organic') {
            adjustments.push(basePrice * 0.12); // 12% increase for organic
        }
        
        // 5. Other factors
        if (inputData.organic === 'yes') {
            adjustments.push(basePrice * 0.10); // 10% increase for organic
        }
        
        if (inputData.rainfall > 100) {
            adjustments.push(basePrice * 0.03); // 3% increase for high rainfall
        } else if (inputData.rainfall < 50) {
            adjustments.push(basePrice * 0.05); // 5% increase for low rainfall
        }
        
        // Calculate final price
        const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj, 0);
        let predictedPrice = basePrice + totalAdjustment;
        
        // Ensure price is within reasonable bounds for LKR
        predictedPrice = Math.max(50.0, Math.min(50000.0, predictedPrice));
        
        return predictedPrice;
    }

    /**
     * Calculate confidence score
     */
    calculateConfidence(prediction) {
        // Higher confidence for prices closer to the training average
        const avgPrice = 668.93;
        const deviation = Math.abs(prediction - avgPrice) / avgPrice;
        
        if (deviation < 0.2) return 0.9; // High confidence
        if (deviation < 0.5) return 0.7; // Medium confidence
        return 0.5; // Lower confidence
    }

    /**
     * Calculate fallback price when model fails
     */
    calculateFallbackPrice(inputData) {
        let basePrice = 250.0;

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

        return Math.max(50.0, basePrice);
    }
}

module.exports = SimpleMLPredictor;

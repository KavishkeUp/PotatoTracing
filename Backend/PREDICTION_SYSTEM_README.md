# Potato Price Prediction System

This system provides AI-powered price prediction for potatoes using machine learning models and data-driven analysis.

## Features

- **Machine Learning Prediction**: Uses Random Forest model trained on historical data
- **Data-Driven Fallback**: Falls back to statistical analysis if ML model fails
- **Simple Logic Fallback**: Basic rule-based prediction as final fallback
- **Confidence Scoring**: Provides confidence levels for predictions
- **Multiple Input Factors**: Considers temperature, weather, crop condition, variety, etc.

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Python** (v3.7 or higher)
3. **MongoDB** (for data storage)

### Installation

1. **Install Node.js dependencies:**
   ```cmd
   npm install
   ```

2. **Install Python dependencies:**
   ```cmd
   pip install pandas scikit-learn numpy openpyxl
   ```

3. **Run the complete setup:**
   ```cmd
   setup-prediction-system.bat
   ```

### Manual Setup Steps

If the automated setup fails, follow these steps:

1. **Train the ML model:**
   ```cmd
   python train_random_forest.py
   ```

2. **Test the prediction system:**
   ```cmd
   node simple-prediction-test.js
   ```

3. **Start the server:**
   ```cmd
   node main.js
   ```

## API Usage

### Endpoint: `POST /predict_potato_prices`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-auth-token>
```

**Request Body:**
```json
{
  "temp": 25,
  "disaster": "none",
  "condition": "good",
  "variety": "russet",
  "rainfall": 80,
  "origin": "Kandy",
  "organic": "no",
  "location": "Colombo"
}
```

**Response:**
```json
{
  "predicted_price": 285.50,
  "prediction_method": "Random Forest ML Model",
  "confidence": 0.85,
  "message": "Price prediction completed successfully."
}
```

### Input Parameters

| Parameter | Type | Description | Options |
|-----------|------|-------------|---------|
| `temp` | number | Temperature in Celsius | 0-50 |
| `disaster` | string | Disaster condition | "none", "flood", "drought", "storm" |
| `condition` | string | Crop condition | "excellent", "good", "average", "poor" |
| `variety` | string | Potato variety | "organic", "russet", "red", "yellow" |
| `rainfall` | number | Rainfall in mm | 0-500 |
| `origin` | string | Origin location | Any Sri Lankan city |
| `organic` | string | Organic status | "yes", "no" |
| `location` | string | Market location | Any Sri Lankan city |

## Prediction Methods

### 1. Machine Learning Model (Primary)
- Uses Random Forest Regressor
- Trained on historical supply chain data
- Considers 22+ features including time, quantity, location, storage conditions
- Provides highest accuracy when model is properly trained

### 2. Data-Driven Analysis (Fallback)
- Analyzes historical price data from database
- Applies statistical adjustments based on input factors
- Uses standard deviation-based pricing adjustments
- More reliable when ML model is unavailable

### 3. Simple Logic (Final Fallback)
- Rule-based pricing with fixed adjustments
- Base price: LKR 250 per kg
- Adjustments based on temperature, disasters, crop condition, etc.
- Always available as last resort

## Troubleshooting

### Common Issues

1. **"Model file not found" error:**
   - Run `python train_random_forest.py` to create the model
   - Ensure `training_data.xlsx` exists with sufficient data

2. **Python dependencies missing:**
   - Run `pip install pandas scikit-learn numpy openpyxl`
   - Ensure Python is in your PATH

3. **Database connection issues:**
   - Ensure MongoDB is running on localhost:27017
   - Check database name is "test-db"

4. **Low confidence predictions:**
   - This is normal for extreme input values
   - System will still provide a prediction with appropriate confidence level

### Testing

Run the test suite to verify everything works:

```cmd
node simple-prediction-test.js
```

This will test various scenarios and show prediction results.

## File Structure

```
Backend/
├── controllers/
│   └── prediction.js          # Main prediction controller
├── ml-predictor.js            # ML prediction wrapper
├── predict_price.py           # Python prediction script
├── train_random_forest.py     # Model training script
├── potato_price_model.pkl     # Trained model file
├── model_info.json           # Model metadata
├── setup-prediction-system.bat # Complete setup script
├── simple-prediction-test.js  # Test script
└── PREDICTION_SYSTEM_README.md # This file
```

## Performance Notes

- **ML Model**: Fastest and most accurate when trained properly
- **Data-Driven**: Medium speed, good accuracy with sufficient historical data
- **Simple Logic**: Fastest, basic accuracy, always available

The system automatically falls back through these methods if any fail, ensuring you always get a prediction.

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Ensure all dependencies are installed
3. Verify the model file exists and is valid
4. Test with the provided test scripts

The system is designed to be robust and will always provide a prediction, even if some components fail.

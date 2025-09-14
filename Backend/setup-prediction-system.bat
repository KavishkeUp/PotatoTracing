@echo off
echo Setting up Potato Price Prediction System...

echo.
echo Step 1: Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Python dependencies...
pip install pandas scikit-learn numpy openpyxl
if %errorlevel% neq 0 (
    echo ERROR: Python dependencies installation failed!
    echo Please ensure Python is installed and pip is available.
    pause
    exit /b 1
)

echo.
echo Step 3: Checking if model file exists...
if not exist "potato_price_model.pkl" (
    echo Model file not found. Training new model...
    call python train_random_forest.py
    if %errorlevel% neq 0 (
        echo ERROR: Model training failed!
        pause
        exit /b 1
    )
) else (
    echo Model file found. Skipping training.
)

echo.
echo Step 4: Testing prediction system...
echo Creating test input...
echo {> test_input.json
echo   "harvestMonth": 9,>> test_input.json
echo   "daysFromHarvestToCollection": 1,>> test_input.json
echo   "daysFromCollectionToDistribution": 2,>> test_input.json
echo   "daysFromDistributionToSupermarket": 1,>> test_input.json
echo   "totalDaysInSupplyChain": 4,>> test_input.json
echo   "harvestQuantity": 500,>> test_input.json
echo   "collectionQuantity": 480,>> test_input.json
echo   "distributionQuantity": 456,>> test_input.json
echo   "supermarketQuantity": 433,>> test_input.json
echo   "collectionLossPercent": 4.0,>> test_input.json
echo   "distributionLossPercent": 5.0,>> test_input.json
echo   "supermarketLossPercent": 5.0,>> test_input.json
echo   "origin": 1,>> test_input.json
echo   "marketLocation": 11,>> test_input.json
echo   "chemicalsUsed": 3,>> test_input.json
echo   "collectionStorageConditions": 2,>> test_input.json
echo   "distributionStorageConditions": 2,>> test_input.json
echo   "collectionTemperature": 25,>> test_input.json
echo   "distributionTemperature": 25,>> test_input.json
echo   "promotions": 5,>> test_input.json
echo   "labels": 5,>> test_input.json
echo   "season": "autumn">> test_input.json
echo }>> test_input.json

echo Testing Python prediction script...
python predict_price.py test_input.json
if %errorlevel% neq 0 (
    echo ERROR: Python prediction test failed!
    pause
    exit /b 1
)

echo.
echo Step 5: Testing Node.js prediction system...
node test-prediction.js
if %errorlevel% neq 0 (
    echo ERROR: Node.js prediction test failed!
    pause
    exit /b 1
)

echo.
echo Step 6: Starting the server...
echo Starting the backend server...
echo You can now test the prediction API at http://localhost:8080/predict_potato_prices
echo.
echo Press Ctrl+C to stop the server
node main.js

pause

@echo off
echo Testing Potato Price Prediction API with Sample Inputs
echo.

echo Test 1: Normal Conditions
echo -------------------------
curl -X POST http://localhost:8080/predict_potato_prices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE" ^
  -d "{\"temp\":25,\"disaster\":\"none\",\"condition\":\"good\",\"variety\":\"russet\",\"rainfall\":80,\"origin\":\"Kandy\",\"organic\":\"no\",\"location\":\"Colombo\"}"

echo.
echo.
echo Test 2: Hot Weather + Flood
echo ---------------------------
curl -X POST http://localhost:8080/predict_potato_prices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE" ^
  -d "{\"temp\":35,\"disaster\":\"flood\",\"condition\":\"poor\",\"variety\":\"organic\",\"rainfall\":200,\"origin\":\"Galle\",\"organic\":\"yes\",\"location\":\"Colombo\"}"

echo.
echo.
echo Test 3: Cold Weather + Drought
echo ------------------------------
curl -X POST http://localhost:8080/predict_potato_prices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE" ^
  -d "{\"temp\":10,\"disaster\":\"drought\",\"condition\":\"excellent\",\"variety\":\"red\",\"rainfall\":20,\"origin\":\"Nuwara Eliya\",\"organic\":\"no\",\"location\":\"Kandy\"}"

echo.
echo.
echo Test 4: Optimal Conditions
echo --------------------------
curl -X POST http://localhost:8080/predict_potato_prices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE" ^
  -d "{\"temp\":20,\"disaster\":\"none\",\"condition\":\"excellent\",\"variety\":\"yellow\",\"rainfall\":100,\"origin\":\"Badulla\",\"organic\":\"yes\",\"location\":\"Matara\"}"

echo.
echo.
echo Test 5: Storm Conditions
echo ------------------------
curl -X POST http://localhost:8080/predict_potato_prices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE" ^
  -d "{\"temp\":28,\"disaster\":\"storm\",\"condition\":\"average\",\"variety\":\"russet\",\"rainfall\":150,\"origin\":\"Trincomalee\",\"organic\":\"no\",\"location\":\"Jaffna\"}"

echo.
echo.
echo API testing completed!
echo.
echo Note: Replace "YOUR_AUTH_TOKEN_HERE" with your actual authentication token
echo Make sure the server is running on http://localhost:8080
pause

@echo off
echo Updating API URLs for production...

echo Updating Frontend configuration...
cd Frontend\src

echo Updating config.js...
(
echo const config = {
echo   API_BASE_URL: 'https://potato-supply-chain-backend.azurewebsites.net',
echo   FRONTEND_URL: 'https://potato-supply-chain-frontend.azurewebsites.net'
echo };
echo 
echo export default config;
) > config.js

echo Rebuilding Frontend...
cd ..
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b 1
)

echo API URLs updated successfully!
echo Backend: https://potato-supply-chain-backend.azurewebsites.net
echo Frontend: https://potato-supply-chain-frontend.azurewebsites.net
pause

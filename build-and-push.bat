@echo off
echo Building and pushing Docker images...

echo Building Backend image...
cd Backend
docker build -t potato-supply-chain-backend .
if %errorlevel% neq 0 (
    echo Backend build failed!
    exit /b 1
)

echo Building Frontend image...
cd ..\Frontend
docker build -t potato-supply-chain-frontend .
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b 1
)

echo Pushing images to Azure Container Registry...
cd ..
docker tag potato-supply-chain-backend your-registry.azurecr.io/potato-supply-chain-backend:latest
docker tag potato-supply-chain-frontend your-registry.azurecr.io/potato-supply-chain-frontend:latest

docker push your-registry.azurecr.io/potato-supply-chain-backend:latest
docker push your-registry.azurecr.io/potato-supply-chain-frontend:latest

echo Build and push completed successfully!
pause

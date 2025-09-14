@echo off
echo Deploying to Azure...

echo Logging into Azure...
az login
if %errorlevel% neq 0 (
    echo Azure login failed!
    exit /b 1
)

echo Setting subscription...
az account set --subscription "your-subscription-id"

echo Creating resource group...
az group create --name potato-supply-chain-rg --location "East US"
if %errorlevel% neq 0 (
    echo Resource group creation failed!
    exit /b 1
)

echo Creating Container Registry...
az acr create --resource-group potato-supply-chain-rg --name potatosupplychain --sku Basic
if %errorlevel% neq 0 (
    echo Container Registry creation failed!
    exit /b 1
)

echo Logging into Container Registry...
az acr login --name potatosupplychain

echo Building and pushing images...
call build-and-push.bat

echo Creating App Service Plan...
az appservice plan create --resource-group potato-supply-chain-rg --name potato-supply-chain-plan --sku B1 --is-linux
if %errorlevel% neq 0 (
    echo App Service Plan creation failed!
    exit /b 1
)

echo Creating Web App for Backend...
az webapp create --resource-group potato-supply-chain-rg --plan potato-supply-chain-plan --name potato-supply-chain-backend --deployment-container-image-name potatosupplychain.azurecr.io/potato-supply-chain-backend:latest
if %errorlevel% neq 0 (
    echo Backend Web App creation failed!
    exit /b 1
)

echo Creating Web App for Frontend...
az webapp create --resource-group potato-supply-chain-rg --plan potato-supply-chain-plan --name potato-supply-chain-frontend --deployment-container-image-name potatosupplychain.azurecr.io/potato-supply-chain-frontend:latest
if %errorlevel% neq 0 (
    echo Frontend Web App creation failed!
    exit /b 1
)

echo Configuring environment variables...
az webapp config appsettings set --resource-group potato-supply-chain-rg --name potato-supply-chain-backend --settings NODE_ENV=production PORT=8080
az webapp config appsettings set --resource-group potato-supply-chain-rg --name potato-supply-chain-frontend --settings NODE_ENV=production

echo Deployment completed successfully!
echo Backend URL: https://potato-supply-chain-backend.azurewebsites.net
echo Frontend URL: https://potato-supply-chain-frontend.azurewebsites.net
pause

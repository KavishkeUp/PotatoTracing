@echo off
echo Quick deployment to Azure...

echo Checking Azure CLI installation...
az --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Azure CLI not found! Please install it first.
    echo Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
    pause
    exit /b 1
)

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker not found! Please install it first.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Starting deployment...
call deploy-to-azure.bat

echo Quick deployment completed!
pause

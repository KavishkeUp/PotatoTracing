# PowerShell script to build and push Docker images to Azure Container Registry
# Make sure you're logged into Azure CLI: az login

Write-Host "Building and pushing Docker images..." -ForegroundColor Green

# Variables
$containerRegistryName = "potatotraceability"
$resourceGroupName = "potato-traceability-rg"

# Login to ACR
Write-Host "Logging into Azure Container Registry..." -ForegroundColor Yellow
az acr login --name $containerRegistryName

# Build and push backend image
Write-Host "Building backend image..." -ForegroundColor Yellow
docker build -t $containerRegistryName.azurecr.io/potato-traceability-backend:latest ./Backend

Write-Host "Pushing backend image..." -ForegroundColor Yellow
docker push $containerRegistryName.azurecr.io/potato-traceability-backend:latest

# Build and push frontend image
Write-Host "Building frontend image..." -ForegroundColor Yellow
docker build -t $containerRegistryName.azurecr.io/potato-traceability-frontend:latest ./Frontend

Write-Host "Pushing frontend image..." -ForegroundColor Yellow
docker push $containerRegistryName.azurecr.io/potato-traceability-frontend:latest

Write-Host "Images pushed successfully!" -ForegroundColor Green
Write-Host "Backend image: $containerRegistryName.azurecr.io/potato-traceability-backend:latest" -ForegroundColor White
Write-Host "Frontend image: $containerRegistryName.azurecr.io/potato-traceability-frontend:latest" -ForegroundColor White

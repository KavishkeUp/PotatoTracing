# PowerShell script to deploy Potato Traceability System to Azure
# Make sure you're logged into Azure CLI: az login

Write-Host "Starting Azure deployment for Potato Traceability System..." -ForegroundColor Green

# Variables
$resourceGroupName = "potato-traceability-rg"
$location = "East US"
$appServicePlanName = "potato-traceability-plan"
$webAppName = "potato-traceability-backend"
$staticWebAppName = "potato-traceability-frontend"
$cosmosAccountName = "potato-traceability-cosmos"
$containerRegistryName = "potatotraceability"
$containerRegistryLoginServer = "$containerRegistryName.azurecr.io"

# Create resource group
Write-Host "Creating resource group..." -ForegroundColor Yellow
az group create --name $resourceGroupName --location $location

# Create App Service Plan (Free tier)
Write-Host "Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create --name $appServicePlanName --resource-group $resourceGroupName --sku FREE --is-linux

# Create Azure Container Registry
Write-Host "Creating Azure Container Registry..." -ForegroundColor Yellow
az acr create --resource-group $resourceGroupName --name $containerRegistryName --sku Basic --admin-enabled true

# Get ACR login server
$acrLoginServer = az acr show --name $containerRegistryName --resource-group $resourceGroupName --query loginServer --output tsv

# Create Cosmos DB account with MongoDB API
Write-Host "Creating Cosmos DB account..." -ForegroundColor Yellow
az cosmosdb create --name $cosmosAccountName --resource-group $resourceGroupName --kind MongoDB

# Get Cosmos DB connection string
$cosmosConnectionString = az cosmosdb keys list --name $cosmosAccountName --resource-group $resourceGroupName --type connection-strings --query connectionStrings[0].connectionString --output tsv

# Create Web App
Write-Host "Creating Web App..." -ForegroundColor Yellow
az webapp create --resource-group $resourceGroupName --plan $appServicePlanName --name $webAppName --deployment-container-image-name nginx

# Configure Web App settings
Write-Host "Configuring Web App settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $resourceGroupName --name $webAppName --settings MONGODB_URI="$cosmosConnectionString" NODE_ENV="production" PORT="8080"

# Create Static Web App
Write-Host "Creating Static Web App..." -ForegroundColor Yellow
az staticwebapp create --name $staticWebAppName --resource-group $resourceGroupName --location $location --source https://github.com/yourusername/yourrepo --branch main --app-location "/Frontend" --output-location "build"

Write-Host "Deployment completed! Next steps:" -ForegroundColor Green
Write-Host "1. Build and push Docker images to ACR" -ForegroundColor White
Write-Host "2. Update Web App to use your container image" -ForegroundColor White
Write-Host "3. Configure CORS settings" -ForegroundColor White
Write-Host "4. Set up custom domain (optional)" -ForegroundColor White

Write-Host "`nConnection strings and URLs:" -ForegroundColor Cyan
Write-Host "Cosmos DB: $cosmosConnectionString" -ForegroundColor White
Write-Host "Web App URL: https://$webAppName.azurewebsites.net" -ForegroundColor White
Write-Host "Static Web App URL: https://$staticWebAppName.azurestaticapps.net" -ForegroundColor White
Write-Host "Container Registry: $acrLoginServer" -ForegroundColor White

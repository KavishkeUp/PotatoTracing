# Quick deployment script for Potato Traceability System on Azure
# This script automates the entire deployment process

param(
    [string]$ResourceGroupName = "potato-traceability-rg",
    [string]$Location = "East US",
    [string]$WebAppName = "potato-traceability-backend",
    [string]$StaticWebAppName = "potato-traceability-frontend"
)

Write-Host "🚀 Starting Quick Deployment to Azure..." -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan

# Check if Azure CLI is installed
try {
    $azVersion = az version --output tsv --query '"azure-cli"'
    Write-Host "✅ Azure CLI version: $azVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
try {
    $account = az account show --output tsv --query name
    Write-Host "✅ Logged in as: $account" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# Create resource group
Write-Host "`n📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location --output none

# Create App Service Plan (Free tier)
Write-Host "📋 Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create --name "potato-traceability-plan" --resource-group $ResourceGroupName --sku FREE --is-linux --output none

# Create Container Registry
Write-Host "🐳 Creating Azure Container Registry..." -ForegroundColor Yellow
$acrName = "potatotraceability$(Get-Random -Maximum 9999)"
az acr create --resource-group $ResourceGroupName --name $acrName --sku Basic --admin-enabled true --output none

# Create Cosmos DB
Write-Host "🗄️ Creating Cosmos DB..." -ForegroundColor Yellow
$cosmosName = "potato-traceability-$(Get-Random -Maximum 9999)"
az cosmosdb create --name $cosmosName --resource-group $ResourceGroupName --kind MongoDB --output none

# Get Cosmos DB connection string
Write-Host "🔗 Getting database connection string..." -ForegroundColor Yellow
$cosmosConnectionString = az cosmosdb keys list --name $cosmosName --resource-group $ResourceGroupName --type connection-strings --query connectionStrings[0].connectionString --output tsv

# Create Web App
Write-Host "🌐 Creating Web App..." -ForegroundColor Yellow
az webapp create --resource-group $ResourceGroupName --plan "potato-traceability-plan" --name $WebAppName --deployment-container-image-name "nginx" --output none

# Configure Web App
Write-Host "⚙️ Configuring Web App..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $ResourceGroupName --name $WebAppName --settings `
    MONGODB_URI="$cosmosConnectionString" `
    NODE_ENV="production" `
    PORT="8080" `
    JWT_SECRET="$(New-Guid)" `
    --output none

# Create Static Web App
Write-Host "📱 Creating Static Web App..." -ForegroundColor Yellow
az staticwebapp create --name $StaticWebAppName --resource-group $ResourceGroupName --location $Location --source "https://github.com/microsoft/static-web-apps" --branch "main" --app-location "/" --output-location "build" --output none

# Get deployment info
$webAppUrl = "https://$WebAppName.azurewebsites.net"
$staticWebAppUrl = "https://$StaticWebAppName.azurestaticapps.net"

Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "`n📋 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "Web App URL: $webAppUrl" -ForegroundColor White
Write-Host "Static Web App URL: $staticWebAppUrl" -ForegroundColor White
Write-Host "Container Registry: $acrName.azurecr.io" -ForegroundColor White
Write-Host "Cosmos DB: $cosmosName" -ForegroundColor White

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Build and push your Docker images to the container registry" -ForegroundColor White
Write-Host "2. Update your Web App to use your container image" -ForegroundColor White
Write-Host "3. Deploy your frontend to the Static Web App" -ForegroundColor White
Write-Host "4. Configure CORS settings for your frontend URL" -ForegroundColor White

Write-Host "`n🔧 To build and push images, run:" -ForegroundColor Cyan
Write-Host ".\build-and-push.ps1 -ContainerRegistryName $acrName" -ForegroundColor White

Write-Host "`n💡 To view your resources in Azure Portal:" -ForegroundColor Cyan
Write-Host "https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id --output tsv)/resourceGroups/$ResourceGroupName/overview" -ForegroundColor White

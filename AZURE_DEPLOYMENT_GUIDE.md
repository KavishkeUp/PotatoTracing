# Azure Deployment Guide for Potato Traceability System

This guide will help you deploy your Potato Traceability System to Azure using your MSDN free credits.

## Prerequisites

1. **Azure CLI** installed on your machine
2. **Docker Desktop** installed
3. **Node.js 18+** installed
4. **Git** installed
5. **MSDN Azure subscription** with free credits

## Step 1: Azure Setup

### 1.1 Login to Azure
```powershell
az login
```

### 1.2 Set your subscription (if you have multiple)
```powershell
az account list --output table
az account set --subscription "Your MSDN Subscription Name"
```

### 1.3 Run the deployment script
```powershell
.\deploy-to-azure.ps1
```

This script will create:
- Resource Group: `potato-traceability-rg`
- App Service Plan (Free tier)
- Azure Container Registry
- Cosmos DB account with MongoDB API
- Web App for backend
- Static Web App for frontend

## Step 2: Build and Push Docker Images

### 2.1 Build and push images
```powershell
.\build-and-push.ps1
```

This will:
- Build Docker images for both backend and frontend
- Push them to your Azure Container Registry

## Step 3: Configure Your Application

### 3.1 Update Web App Configuration
After deployment, update your Web App settings in the Azure Portal:

1. Go to your Web App in Azure Portal
2. Navigate to Configuration > Application settings
3. Add these settings:
   - `MONGODB_URI`: Your Cosmos DB connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: Your Static Web App URL

### 3.2 Update Frontend Configuration
Update your frontend to point to the backend URL:

1. In `Frontend/src`, create a config file:
```javascript
// config.js
const config = {
  API_BASE_URL: 'https://potato-traceability-backend.azurewebsites.net'
};

export default config;
```

2. Update your API calls to use this config

## Step 4: Deploy Frontend

### 4.1 Deploy to Static Web App
```powershell
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy frontend
swa deploy ./Frontend/build --deployment-token YOUR_DEPLOYMENT_TOKEN
```

## Step 5: Configure Custom Domain (Optional)

1. In Azure Portal, go to your Static Web App
2. Navigate to Custom domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Step 6: Monitoring and Maintenance

### 6.1 Enable Application Insights
1. Go to your Web App in Azure Portal
2. Navigate to Application Insights
3. Enable monitoring

### 6.2 Set up Log Analytics
1. Create a Log Analytics workspace
2. Connect it to your Web App
3. Set up alerts for errors and performance issues

## Cost Optimization

### Free Tier Limits
- **App Service**: 1 F1 instance (1 GB RAM, 1 CPU core)
- **Static Web Apps**: 100 GB bandwidth/month
- **Cosmos DB**: 400 RU/s provisioned throughput
- **Container Registry**: 1 GB storage

### Tips to Stay Within Free Limits
1. Use F1 App Service plan (free tier)
2. Monitor your Cosmos DB usage
3. Use CDN for static assets
4. Implement caching strategies
5. Monitor bandwidth usage

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ORIGIN is set correctly
   - Check that your frontend URL is whitelisted

2. **Database Connection Issues**
   - Verify Cosmos DB connection string
   - Check firewall rules
   - Ensure MongoDB API is enabled

3. **Container Deployment Issues**
   - Check container logs in Azure Portal
   - Verify image exists in Container Registry
   - Check resource limits

4. **Static Web App Issues**
   - Verify build output directory
   - Check deployment token
   - Review build logs

### Getting Help
- Check Azure Portal logs
- Use Azure CLI: `az webapp log tail --name potato-traceability-backend --resource-group potato-traceability-rg`
- Review Application Insights for detailed monitoring

## Security Considerations

1. **Environment Variables**: Never commit secrets to code
2. **HTTPS**: All traffic is encrypted by default
3. **Authentication**: Implement proper JWT validation
4. **Database**: Use connection string authentication
5. **CORS**: Restrict to your domain only

## Scaling (Future)

When you're ready to scale beyond free tier:
1. Upgrade to Standard App Service plan
2. Add more Cosmos DB throughput
3. Implement Redis caching
4. Use Azure CDN
5. Add multiple regions for global deployment

## Support

For issues specific to this deployment:
1. Check Azure Portal logs
2. Review this guide
3. Consult Azure documentation
4. Contact Azure support (if you have a support plan)

---

**Note**: This deployment uses Azure free tier services. Monitor your usage to avoid unexpected charges when free credits are exhausted.

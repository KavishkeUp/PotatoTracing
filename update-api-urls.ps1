# PowerShell script to update all hardcoded localhost URLs to use config
Write-Host "Updating API URLs in frontend components..." -ForegroundColor Green

# List of files to update
$files = @(
    "Frontend/src/components/ReceivedDeliveries.js",
    "Frontend/src/pages/RegisterUserPage.js", 
    "Frontend/src/components/ReceiveDelivery.js",
    "Frontend/src/pages/UserLoginPage.js",
    "Frontend/src/components/PredictPotatoPrice.js",
    "Frontend/src/components/PredictPotatoDemand.js",
    "Frontend/src/components/PastCollections.js",
    "Frontend/src/components/PastRecords.js",
    "Frontend/src/components/PastDeliveries.js",
    "Frontend/src/components/NewDelivery.js",
    "Frontend/src/components/NewCollection.js",
    "Frontend/src/components/NewRecord.js"
)

# Add config import to each file
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Yellow
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Add config import at the top if not already present
        if ($content -notmatch "import config from") {
            $content = $content -replace "(import React[^;]*;)", "`$1`nimport config from '../config';"
        }
        
        # Replace hardcoded localhost URLs with config
        $content = $content -replace "'http://localhost:8080", "config.API_BASE_URL"
        $content = $content -replace '"http://localhost:8080', 'config.API_BASE_URL'
        
        # Write back to file
        Set-Content $file -Value $content -NoNewline
    }
}

Write-Host "✅ All API URLs updated successfully!" -ForegroundColor Green
Write-Host "Now your frontend will use the correct backend URL based on environment." -ForegroundColor Cyan


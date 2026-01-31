$env:PATH += ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"

# Test connection
Write-Host "Testing GitHub connection..."
try {
    $response = Invoke-WebRequest -Uri "https://github.com" -TimeoutSec 10
    Write-Host "GitHub is accessible"
} catch {
    Write-Host "Cannot connect to GitHub: $_"
    Write-Host "Please check your internet connection and try again later."
    exit 1
}

Set-Location -Path "E:\WarehouseScanner"

# Push to GitHub
Write-Host "Pushing to GitHub..."
& "C:\Program Files\Git\cmd\git.exe" push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "=== Success! ===" -ForegroundColor Green
    Write-Host "Repository: https://github.com/3996510229-cell/warehouse-scanner"
} else {
    Write-Host "Push failed. Please check your GitHub credentials and network connection."
}

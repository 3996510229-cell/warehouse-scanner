$env:PATH = $env:PATH + ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
Set-Location -Path "E:\WarehouseScanner"

Write-Host "=== Committing all Gradle configuration fixes ===" -ForegroundColor Cyan

# Add all new and modified files
& "C:\Program Files\Git\cmd\git.exe" add android/build.gradle
& "C:\Program Files\Git\cmd\git.exe" add android/gradle.properties
& "C:\Program Files\Git\cmd\git.exe" add android/app/proguard-rules.pro

# Commit all fixes
& "C:\Program Files\Git\cmd\git.exe" commit -m "fix: Complete Android Gradle configuration

- Create android/build.gradle root configuration file
- Create android/gradle.properties build parameters
- Create android/app/proguard-rules.pro for code optimization
- Configure complete Gradle build environment"

# Push to GitHub
& "C:\Program Files\Git\cmd\git.exe" push origin main

Write-Host ""
Write-Host "=== Push completed ===" -ForegroundColor Green
Write-Host ""
Write-Host "Please run the following commands to rebuild:" -ForegroundColor Yellow
Write-Host "  cd E:\WarehouseScanner"
Write-Host "  eas build --platform android --profile production"

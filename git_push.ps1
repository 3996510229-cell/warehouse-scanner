$env:PATH += ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
Set-Location -Path "E:\WarehouseScanner"

# Configure Git
git config --global user.name "3996510229-cell"
git config --global user.email "cell@example.com"
git config --global init.defaultBranch main

# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: 仓库扫码管理系统 v1.0"

# Add remote
git remote remove origin 2>$null
git remote add origin https://github.com/3996510229-cell/warehouse-scanner.git

# Push
git branch -M main
git push -u origin main

Write-Host "=== 完成 ==="

$env:PATH = $env:PATH + ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
Set-Location -Path "E:\WarehouseScanner"

Write-Host "开始提交和推送修复..." -ForegroundColor Cyan

# Stage the modified file
& "C:\Program Files\Git\cmd\git.exe" add ".github/workflows/android-build.yml"

# Commit the changes
& "C:\Program Files\Git\cmd\git.exe" commit -m "fix: 修复 GitHub Actions 工作流配置

- 移除了不支持的 api-level 参数
- 使用 android-actions/setup-android@v3 默认配置"

# Push to GitHub
& "C:\Program Files\Git\cmd\git.exe" push origin main

Write-Host ""
Write-Host "推送完成！" -ForegroundColor Green
Write-Host "请访问 https://github.com/3996510229-cell/warehouse-scanner/actions 查看构建进度" -ForegroundColor Yellow

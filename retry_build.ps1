$env:PATH += ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
Set-Location -Path "E:\WarehouseScanner"

Write-Host "=== 推送修复后的工作流文件 ===" -ForegroundColor Green

# 添加修改的文件
git add .github/workflows/android-build.yml

# 提交修复
git commit -m "fix: 修复 GitHub Actions 工作流配置

- 移除了不支持的 api-level 参数
- 使用 android-actions/setup-android@v3 默认配置
- 简化构建流程"

# 推送到 GitHub
git push origin main

Write-Host ""
Write-Host "=== 推送完成 ===" -ForegroundColor Green
Write-Host "GitHub Actions 将自动重新运行构建"
Write-Host ""
Write-Host "请访问以下地址查看构建进度:" -ForegroundColor Yellow
Write-Host "https://github.com/3996510229-cell/warehouse-scanner/actions"

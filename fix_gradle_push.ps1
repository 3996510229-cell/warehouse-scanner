$env:PATH = $env:PATH + ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
Set-Location -Path "E:\WarehouseScanner"

Write-Host "=== 修复 Android 构建语法错误 ===" -ForegroundColor Cyan

# 添加修复的文件
& "C:\Program Files\Git\cmd\git.exe" add android/app/build.gradle

# 提交修复
& "C:\Program Files\Git\cmd\git.exe" commit -m "fix: 修复 Android build.gradle 语法错误

- 修正 defaultConfig 中的 minSdk 和 targetSdk 格式
- 移除损坏的代码行
- 使 Gradle 构建能够正常进行"

# 推送到 GitHub
& "C:\Program Files\Git\cmd\git.exe" push origin main

Write-Host ""
Write-Host "=== 推送完成 ===" -ForegroundColor Green
Write-Host ""
Write-Host "请访问 https://expo.dev/accounts/george222/projects/warehouse-scanner/builds 重新构建" -ForegroundColor Yellow

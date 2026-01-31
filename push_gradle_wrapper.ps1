$env:PATH = $env:PATH + ";C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
Set-Location -Path "E:\WarehouseScanner"

Write-Host "=== 推送 Gradle Wrapper 设置 ===" -ForegroundColor Cyan

# 添加所有 Gradle Wrapper 文件
& "C:\Program Files\Git\cmd\git.exe" add android/gradle/wrapper/
& "C:\Program Files\Git\cmd\git.exe" add android/gradlew
& "C:\Program Files\Git\cmd\git.exe" add android/gradlew.bat

# 提交更改
& "C:\Program Files\Git\cmd\git.exe" commit -m "feat: 添加 Gradle Wrapper 文件

- 添加 gradle-wrapper.jar
- 添加 gradle-wrapper.properties (Gradle 8.4)
- 添加 gradlew 和 gradlew.bat 脚本
- 启用本地 Android 构建能力"

# 推送到 GitHub
& "C:\Program Files\Git\cmd\git.exe" push origin main

Write-Host ""
Write-Host "=== 推送完成！===" -ForegroundColor Green
Write-Host "请访问 https://github.com/3996510229-cell/warehouse-scanner/actions 查看构建进度" -ForegroundColor Yellow

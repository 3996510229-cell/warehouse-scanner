cd /d E:\WarehouseScanner
"C:\Program Files\Git\cmd\git.exe" add .github/workflows/android-build.yml
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: 修复 GitHub Actions 工作流配置

- 移除了不支持的 api-level 参数
- 使用 android-actions/setup-android@v3 默认配置"
"C:\Program Files\Git\cmd\git.exe" push origin main
pause

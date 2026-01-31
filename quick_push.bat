@echo off
chcp 65001 >nul
cd /d E:\WarehouseScanner
echo 正在提交修复...
"C:\Program Files\Git\cmd\git.exe" add .github/workflows/android-build.yml
"C:\Program Files\Git\cmd\git.exe" commit -m "fix: 修复 GitHub Actions 工作流配置"
echo 正在推送...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo 完成！
pause

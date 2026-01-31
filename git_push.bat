@echo off
chcp 65001 >nul
echo === 1. 配置 Git 用户信息 ===
"C:\Program Files\Git\cmd\git.exe" config --global user.name "3996510229-cell"
"C:\Program Files\Git\cmd\git.exe" config --global user.email "cell@example.com"
"C:\Program Files\Git\cmd\git.exe" config --global init.defaultBranch main
echo 配置完成
echo.

echo === 2. 检查状态 ===
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner status
echo.

echo === 3. 初始化仓库 (如果需要) ===
if not exist "E:\WarehouseScanner\.git" (
    "C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner init
)
echo.

echo === 4. 添加文件 ===
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner add .
echo.

echo === 5. 提交代码 ===
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner commit -m "Initial commit: 仓库扫码管理系统 v1.0"
echo.

echo === 6. 添加远程仓库 ===
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner remote add origin https://github.com/3996510229-cell/warehouse-scanner.git
echo.

echo === 7. 推送到 GitHub ===
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner branch -M main
"C:\Program Files\Git\cmd\git.exe" -C E:\WarehouseScanner push -u origin main

echo.
echo === 完成! ===
pause

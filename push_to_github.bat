@echo off
chcp 65001 >nul
Title 推送到 GitHub - 仓库扫码管理系统

echo ========================================
echo   仓库扫码管理系统 - GitHub 上传工具
echo ========================================
echo.

echo [1/5] 配置环境...
set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\Git\bin
cd /d E:\WarehouseScanner
echo 完成
echo.

echo [2/5] 测试 GitHub 连接...
"C:\Program Files\Git\cmd\git.exe" config --global --get http.proxy
"C:\Program Files\Git\cmd\git.exe" config --global --get https.proxy
echo 完成
echo.

echo [3/5] 添加远程仓库 (如果需要)...
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/3996510229-cell/warehouse-scanner.git
echo 完成
echo.

echo [4/5] 推送到 GitHub...
echo 注意: 如果弹出认证窗口，请输入 GitHub 用户名和密码/Token
echo.
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   成功! 代码已推送到 GitHub
    echo ========================================
    echo.
    echo 仓库地址: https://github.com/3996510229-cell/warehouse-scanner
    echo.
    echo 下一步:
    echo   1. 访问 https://github.com/3996510229-cell/warehouse-scanner/actions
    echo   2. 等待 GitHub Actions 构建完成
    echo   3. 下载生成的 APK 文件
    echo.
) else (
    echo.
    echo ========================================
    echo   推送失败
    echo ========================================
    echo.
    echo 请检查:
    echo   1. 网络连接
    echo   2. GitHub 认证信息
    echo   3. 仓库权限
    echo.
    echo 详细信息请查看上方错误信息
)

echo.
pause

@echo off
chcp 65001 >nul
Title 推送 Gradle Wrapper 到 GitHub

echo ========================================
echo   推送 Gradle Wrapper 文件
echo ========================================
echo.

echo [1/3] 配置环境...
set PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\Git\bin
cd /d E:\WarehouseScanner
echo 完成
echo.

echo [2/3] 推送到 GitHub...
"C:\Program Files\Git\cmd\git.exe" push origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   推送成功！
    echo ========================================
    echo.
    echo 请访问以下地址查看构建进度:
    echo https://github.com/3996510229-cell/warehouse-scanner/actions
    echo.
    echo 预计构建时间: 10-20 分钟
) else (
    echo ========================================
    echo   推送失败
    echo ========================================
    echo.
    echo 请检查网络连接后重试
    echo 或手动运行: git push origin main
)

echo.
pause

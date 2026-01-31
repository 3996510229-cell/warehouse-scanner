@echo off
chcp 65001 >nul
Title 推送并构建 APK

echo ========================================
echo   推送代码并开始 EAS Build
echo ========================================
echo.

echo [1/3] 推送到 GitHub...
cd /d E:\WarehouseScanner
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [警告] 推送失败，请手动执行: git push origin main
    echo.
    goto manual
)

echo.
echo [2/3] 开始构建 APK...
eas build --platform android --profile production

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ 构建成功！
    echo ========================================
    echo.
    echo 请访问 https://expo.dev/builds 下载 APK
) else (
    echo.
    echo ========================================
    echo   ⚠️  构建失败
    echo ========================================
    echo.
    echo 请访问 https://expo.dev/accounts/george222/projects/warehouse-scanner/builds 查看错误
)

goto end

:manual
echo.
echo ========================================
echo   手动操作步骤
echo ========================================
echo.
echo 1. 在 PowerShell 中执行:
echo    cd E:\WarehouseScanner
echo    git push origin main
echo.
echo 2. 推送成功后执行:
echo    eas build --platform android --profile production
echo.
echo 3. 或访问 https://expo.dev/builds 手动触发构建

:end
echo.
pause

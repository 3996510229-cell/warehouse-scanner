@echo off
chcp 65001 >nul
Title Expo EAS Build - Android APK 构建

echo ========================================
echo   仓库扫码管理系统 - EAS Build 构建
echo ========================================
echo.

echo [1/5] 检查环境...
cd /d E:\WarehouseScanner
echo   当前目录: %cd%
echo.

echo [2/5] 确认 Expo 登录状态...
echo   执行命令: eas whoami
echo.
eas whoami
echo.

echo [3/5] 开始构建 APK（生产版本）...
echo   执行命令: eas build --platform android --profile production
echo.
echo   ⚠️  注意: 构建过程需要 10-30 分钟
echo   ⚠️  请耐心等待，不要关闭此窗口
echo.

eas build --platform android --profile production

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ 构建成功！
    echo ========================================
    echo.
    echo 下载方式:
    echo   1. 终端显示的下载链接
    echo   2. 访问 https://expo.dev/builds
    echo   3. 检查邮箱
    echo.
) else (
    echo.
    echo ========================================
    echo   ⚠️  构建失败
    echo ========================================
    echo.
    echo 请检查错误信息，或访问:
    echo   https://expo.dev/builds
    echo.
)

echo.
pause

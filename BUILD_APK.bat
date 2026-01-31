@echo off
chcp 65001 >nul
REM ============================================
REM 仓库扫码管理系统 - 一键构建脚本
REM ============================================

echo ============================================
echo 仓库扫码管理系统 - 安装包构建
echo ============================================
echo.

REM 设置路径
set PATH=C:\Program Files\nodejs;%PATH%
set PATH=C:\Users\18jcz\AppData\Roaming\npm;%PATH%

REM 进入项目目录
cd /d %~dp0

echo [步骤 1/4] 验证登录状态...
eas whoami >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] 已登录 Expo 账户
    for /f "delims=" %%i in ('eas whoami') do set EXPO_USER=%%i
    echo   用户名: %EXPO_USER%
) else (
    echo [✗] 未登录或登录已过期
    echo.
    echo 请运行以下命令登录：
    echo   eas login
    echo.
    echo 或者双击运行: LOGIN_EXPO.bat
    echo.
    pause
    exit /b 1
)
echo.

echo [步骤 2/4] 配置 EAS Build 项目...
if not exist "eas.json" (
    echo [✓] eas.json 已存在，跳过配置
) else (
    echo [✓] eas.json 已存在
)
echo.

echo [步骤 3/4] 构建 Android APK...
echo.
echo 开始构建 Android APK...
echo 这可能需要 5-15 分钟，请耐心等待...
echo.
eas build --platform android --profile development --non-interactive

if %errorlevel% equ 0 (
    echo.
    echo [✓] Android 构建成功！
    echo.
    echo 下载 APK 文件：
    echo   1. 检查您的邮箱，Expo 会发送下载链接
    echo   2. 或访问 https://expo.dev/builds 查看构建状态
    echo   3. 或运行: eas build:list
    echo.
) else (
    echo.
    echo [✗] Android 构建失败
    echo 请检查错误日志或访问 https://expo.dev/builds 查看详情
    echo.
    pause
    exit /b 1
)
echo.

echo [步骤 4/4] 完成！
echo ============================================
echo 构建完成！
echo ============================================
echo.
echo 生成的安装包：
echo   - Android APK: 下载链接将发送到您的邮箱
echo.
echo 后续步骤：
echo   1. 下载 APK 文件到您的手机
echo   2. 安装应用
echo   3. 开始使用仓库扫码功能
echo.
echo 文档位置：
echo   - CLOUD_BUILD_GUIDE.md (构建指南)
echo   - docs/ (详细文档)
echo.
pause

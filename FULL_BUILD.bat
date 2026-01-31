@echo off
chcp 65001 >nul
REM ============================================
REM 仓库扫码管理系统 - 完整构建脚本
REM ============================================

echo ============================================
echo 仓库扫码管理系统 - Android APK 构建
echo ============================================
echo.

REM 设置路径
set PATH=C:\Program Files\nodejs;%PATH%
set PATH=C:\Users\18jcz\AppData\Roaming\npm;%PATH%

REM 进入项目目录
cd /d %~dp0

echo [1/5] 验证登录状态...
eas whoami >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] 已登录 Expo 账户
    for /f "delims=" %%i in ('eas whoami') do set EXPO_USER=%%i
) else (
    echo [✗] 未登录
    echo 请先运行: eas login
    pause
    exit /b 1
)
echo.

echo [2/5] 检查项目配置...
if exist "eas.json" (
    echo [✓] EAS 配置已存在
) else (
    echo [✗] EAS 配置不存在
    echo 正在初始化...
    eas init --non-interactive --force
)
echo.

echo [3/5] 开始构建 Android APK
echo.
echo ⚠️  注意：接下来需要您手动确认以下提示：
echo    - "Generate a new Android Keystore?"  → 输入 y 并回车
echo    - 其他提示 → 直接回车使用默认值
echo.
echo 正在启动构建...
echo.
eas build --platform android --profile development

if %errorlevel% equ 0 (
    echo.
    echo [✓] 构建已启动！
    echo.
) else (
    echo.
    echo [✗] 构建启动失败
    echo 请访问 https://expo.dev/builds 查看错误信息
    echo.
    pause
    exit /b 1
)
echo.

echo [4/5] 等待构建完成...
echo.
echo ⏳ 构建过程可能需要 5-15 分钟
echo.
echo 您可以：
echo   1. 在此处等待（每30秒检查一次状态）
echo   2. 访问 https://expo.dev/builds 查看实时进度
echo   3. 检查您的邮箱，Expo 会发送构建通知
echo.
echo 开始监控构建状态（每30秒检查一次，按 Ctrl+C 可中断）...

:check_loop
timeout /t 30 /nobreak >nul
eas build:list | findstr /c:"android" /c:"building" >nul 2>&1
if %errorlevel% equ 0 (
    echo [%time%] 构建进行中...
    goto check_loop
) else (
    eas build:list | findstr /c:"finished" /c:"completed" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [%time%] 构建可能已完成！
        echo.
        echo [✓] 请检查您的邮箱或访问以下链接下载 APK:
        echo    https://expo.dev/accounts/%EXPO_USER%/projects/warehouse-scanner/builds
        echo.
    )
)

echo.
echo [5/5] 构建完成！
echo ============================================
echo 构建完成！
echo ============================================
echo.
echo 下一步：
echo   1. 访问 https://expo.dev/accounts/%EXPO_USER%/projects/warehouse-scanner/builds
echo   2. 找到完成的构建，点击下载 APK
echo   3. 将 APK 传输到手机并安装
echo.
echo 祝您使用愉快！🎉
echo.

pause

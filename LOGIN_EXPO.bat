@echo off
REM ============================================
REM Expo 账户登录脚本
REM ============================================

echo ============================================
echo 仓库扫码管理系统 - Expo 账户登录
echo ============================================
echo.
echo 请按照以下步骤操作：
echo.
echo 1. 您将看到登录提示
echo 2. 输入您的 Expo 注册邮箱
echo 3. 输入您的密码
echo 4. 等待登录成功确认
echo.
echo ============================================
echo 正在启动登录...
echo ============================================
echo.

REM 设置路径
set PATH=C:\Program Files\nodejs;%PATH%
set PATH=C:\Users\18jcz\AppData\Roaming\npm;%PATH%

REM 进入项目目录
cd /d %~dp0

REM 运行登录命令
eas login

echo.
echo ============================================
echo 登录完成！
echo ============================================
echo.
echo 验证登录状态，请运行：
echo   eas whoami
echo.
echo 登录成功后，继续运行构建脚本：
echo   BUILD_APK.bat
echo.

pause

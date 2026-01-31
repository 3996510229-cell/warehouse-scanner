@echo off
chcp 65001 >nul
REM ============================================
REM 仓库扫码管理系统 - 交互式构建脚本
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

echo [1/4] 验证登录状态...
eas whoami
if %errorlevel% neq 0 (
    echo.
    echo [✗] 未登录或登录已过期
    echo 请先运行: eas login
    pause
    exit /b 1
)
echo.

echo [2/4] 项目配置检查...
echo 配置文件内容:
type eas.json
echo.
pause
echo.

echo [3/4] 开始构建 Android APK
echo.
echo ⚠️ 重要提示：
echo ============================================
echo 在接下来的步骤中，当出现提示时：
echo.
echo 1. "Generate a new Android Keystore?" 
echo    → 输入: y  并按回车
echo.
echo 2. 等待构建完成（5-15分钟）
echo.
echo ============================================
echo.
echo 正在启动构建...
echo.
echo 如果命令行无法显示提示，请访问：
echo https://expo.dev/accounts/george222/projects/warehouse-scanner/builds
echo.
echo.

REM 设置环境变量
set EAS_NO_VCS=1

REM 尝试启动构建
eas build --platform android --profile development

echo.
echo ============================================
echo 构建状态
echo ============================================
echo.
echo 如果构建已启动：
echo   - 查看上方日志了解进度
echo   - 或访问 https://expo.dev/builds 查看详情
echo   - 构建完成后会收到邮件通知
echo.
echo 如果命令行无响应或报错：
echo   - 请访问 https://expo.dev/accounts/george222/projects/warehouse-scanner/builds
echo   - 点击 "Create a build"
echo   - 选择 Android → development
echo   - 当提示 Keystore 时选择 "Generate new"
echo   - 等待构建完成
echo.
echo ============================================

pause

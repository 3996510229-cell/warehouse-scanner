@echo off
chcp 65001 >nul
REM ============================================
REM 仓库扫码管理系统 - 一键构建脚本
REM 自动上传到 GitHub 并构建 Android/iOS 安装包
REM ============================================

echo ============================================
echo 仓库扫码管理系统 - 自动构建工具
echo ============================================
echo.

REM 设置路径
set PATH=C:\Program Files\nodejs;%PATH%
set PATH=C:\Users\18jcz\AppData\Roaming\npm;%PATH%

REM 进入项目目录
cd /d %~dp0

echo [步骤 1/5] 检查 GitHub 登录状态...
echo.
echo 请先在浏览器中访问 https://github.com 并登录您的账户
echo.
echo 如果您还没有 GitHub 账户，请先注册：
echo https://github.com/signup
echo.
echo 登录后，请输入以下信息：
echo.

set /p GITHUB_USER="请输入您的 GitHub 用户名: "
if "%GITHUB_USER%"=="" (
    echo [错误] 用户名不能为空
    pause
    exit /b 1
)

echo.
echo 创建 GitHub 仓库...
echo.
echo 请在浏览器中访问以下链接创建仓库：
echo.
echo ============================================
echo https://github.com/new?name=warehouse-scanner&description=仓库扫码管理系统&public=1
echo ============================================
echo.
echo 创建仓库后，请按回车继续...
pause >nul

echo.
echo [步骤 2/5] 初始化 Git 仓库...
echo.
git init
if %errorlevel% neq 0 (
    echo [错误] Git 初始化失败
    echo 请确保已安装 Git: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [✓] Git 初始化完成
echo.

echo [步骤 3/5] 提交代码...
echo.
git add .
echo 输入提交信息（直接回车使用默认值）:
set /p COMMIT_MSG="> "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial commit: 仓库扫码管理系统
git commit -m "%COMMIT_MSG%"
echo [✓] 代码提交完成
echo.

echo [步骤 4/5] 上传到 GitHub...
echo.
git branch -M main
git remote add origin https://github.com/%GITHUB_USER%/warehouse-scanner.git 2>nul
echo 正在上传代码到 GitHub...
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo [错误] 上传失败
    echo 请检查：
    echo 1. GitHub 用户名是否正确
    echo 2. 网络连接是否正常
    echo 3. 仓库是否已创建
    echo.
    echo 如果仓库不存在，请先在 GitHub 网站上创建
    echo 然后重试
    pause
    exit /b 1
)
echo [✓] 代码上传完成
echo.

echo [步骤 5/5] 启动自动构建...
echo.
echo ============================================
echo 构建已启动！
echo ============================================
echo.
echo 构建进度：
echo   - 访问 https://github.com/%GITHUB_USER%/warehouse-scanner/actions
echo   - 查看 "Android Build" 工作流的运行状态
echo   - 构建完成后会显示 APK 下载链接
echo.
echo iOS 构建：
echo   - 需要 Apple Developer 账户
echo   - 访问 Apple Developer 网站配置证书
echo   - 使用 Xcode 或 CI/CD 服务构建
echo.
echo 下载 APK：
echo   - Actions 页面 → 点击构建 → Artifacts → app-debug.apk
echo   - 或等待构建完成后查看 Releases 页面
echo.
echo 构建完成后，请访问：
echo   https://github.com/%GITHUB_USER%/warehouse-scanner/actions
echo.
echo ============================================
echo 完成！
echo ============================================
echo.
echo 提示：后续更新代码后，只需运行以下命令即可自动构建：
echo   git add .
echo   git commit -m "更新说明"
echo   git push
echo.
pause

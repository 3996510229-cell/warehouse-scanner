@echo off
REM ============================================
REM 仓库扫码管理系统 - 构建脚本
REM Warehouse Scanner Build Script
REM ============================================

echo ============================================
echo 仓库扫码管理系统 - 安装包构建
echo ============================================
echo.

REM 检查环境变量
if not defined ANDROID_HOME (
    echo [警告] ANDROID_HOME 未设置
    echo 请确保已安装 Android SDK 并设置 ANDROID_HOME 环境变量
    echo.
)

if not defined JAVA_HOME (
    echo [警告] JAVA_HOME 未设置
    echo 请确保已安装 JDK 17+ 并设置 JAVA_HOME 环境变量
    echo.
)

echo [1/5] 检查依赖安装...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] npm install 失败
        pause
        exit /b 1
    )
)
echo [完成] 依赖安装完成
echo.

echo [2/5] iOS 依赖安装...
if exist "ios" (
    cd ios
    if not exist "Pods" (
        echo 正在安装 CocoaPods 依赖...
        call pod install
        if %errorlevel% neq 0 (
            echo [警告] pod install 失败，iOS 构建可能受影响
        )
    )
    cd ..
)
echo [完成] iOS 依赖检查完成
echo.

echo [3/5] 构建 Android APK (Debug 版本)...
cd android
echo 正在构建 Debug APK...
call gradlew assembleDebug
if %errorlevel% equ 0 (
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        echo [完成] Debug APK 已生成
        echo 位置: android\app\build\outputs\apk\debug\app-debug.apk
    )
) else (
    echo [错误] Android Debug 构建失败
)
cd ..
echo.

echo [4/5] 构建 Android APK (Release 版本)...
cd android
echo 正在构建 Release APK...
call gradlew assembleRelease
if %errorlevel% equ 0 (
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo [完成] Release APK 已生成
        echo 位置: android\app\build\outputs\apk\release\app-release.apk
    )
) else (
    echo [警告] Android Release 构建失败，跳过签名步骤
)
cd ..
echo.

echo [5/5] 生成签名 APK (如需发布)...
echo 如需生成已签名的发布版 APK，请执行以下步骤:
echo 1. 在 android/app/ 目录下创建 keystore 文件
echo 2. 配置 android/app/build.gradle 中的签名信息
echo 3. 运行: gradlew bundleRelease
echo.

echo ============================================
echo 构建完成！
echo ============================================
echo.
echo 生成的文件:
echo   - android\app\build\outputs\apk\debug\app-debug.apk
echo   - android\app\build\outputs\apk\release\app-release.apk (如果构建成功)
echo.
echo iOS 构建说明:
echo   - 使用 Xcode 打开 ios/workspace-scanner.xcworkspace
echo   - 选择 Product -> Archive 生成 IPA
echo.
pause

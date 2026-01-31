#!/bin/bash
# ============================================
# 仓库扫码管理系统 - 构建脚本 (macOS/Linux)
# Warehouse Scanner Build Script
# ============================================

set -e  # 遇到错误立即退出

echo "============================================"
echo "仓库扫码管理系统 - 安装包构建"
echo "============================================"
echo ""

# 检查环境变量
if [ -z "$ANDROID_HOME" ]; then
    echo "[警告] ANDROID_HOME 未设置"
    echo "请确保已安装 Android SDK 并设置 ANDROID_HOME 环境变量"
    echo ""
fi

if [ -z "$JAVA_HOME" ]; then
    echo "[警告] JAVA_HOME 未设置"
    echo "请确保已安装 JDK 17+ 并设置 JAVA_HOME 环境变量"
    echo ""
fi

echo "[1/5] 检查依赖安装..."
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[错误] npm install 失败"
        exit 1
    fi
fi
echo "[完成] 依赖安装完成"
echo ""

echo "[2/5] iOS 依赖安装..."
if [ -d "ios" ]; then
    cd ios
    if [ ! -d "Pods" ]; then
        echo "正在安装 CocoaPods 依赖..."
        pod install
        if [ $? -ne 0 ]; then
            echo "[警告] pod install 失败，iOS 构建可能受影响"
        fi
    fi
    cd ..
fi
echo "[完成] iOS 依赖检查完成"
echo ""

echo "[3/5] 构建 Android APK (Debug 版本)..."
cd android
echo "正在构建 Debug APK..."
./gradlew assembleDebug
if [ $? -eq 0 ]; then
    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
        echo "[完成] Debug APK 已生成"
        echo "位置: android/app/build/outputs/apk/debug/app-debug.apk"
    fi
else
    echo "[错误] Android Debug 构建失败"
fi
cd ..
echo ""

echo "[4/5] 构建 Android APK (Release 版本)..."
cd android
echo "正在构建 Release APK..."
./gradlew assembleRelease
if [ $? -eq 0 ]; then
    if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
        echo "[完成] Release APK 已生成"
        echo "位置: android/app/build/outputs/apk/release/app-release.apk"
    fi
else
    echo "[警告] Android Release 构建失败，跳过签名步骤"
fi
cd ..
echo ""

echo "[5/5] 生成签名 APK (如需发布)..."
echo "如需生成已签名的发布版 APK，请执行以下步骤:"
echo "1. 在 android/app/ 目录下创建 keystore 文件"
echo "2. 配置 android/app/build.gradle 中的签名信息"
echo "3. 运行: ./gradlew bundleRelease"
echo ""

echo "============================================"
echo "构建完成！"
echo "============================================"
echo ""
echo "生成的文件:"
echo "  - android/app/build/outputs/apk/debug/app-debug.apk"
echo "  - android/app/build/outputs/apk/release/app-release.apk (如果构建成功)"
echo ""
echo "iOS 构建说明:"
echo "  - 使用 Xcode 打开 ios/workspace-scanner.xcworkspace"
echo "  - 选择 Product -> Archive 生成 IPA"
echo ""

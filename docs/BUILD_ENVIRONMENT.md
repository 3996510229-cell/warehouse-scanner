# 构建环境要求与安装指南

## 一、总体要求

要生成APK和IPA安装包，您需要准备以下开发环境：

| 平台 | 操作系统 | 必需软件 |
|------|----------|----------|
| Android | Windows/macOS/Linux | Node.js、JDK 17+、Android SDK |
| iOS | macOS (必需) | Node.js、Xcode、CocoaPods |

## 二、安装步骤

### 2.1 安装 Node.js

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本 (推荐 v18 或 v20)
3. 运行安装程序
4. 验证安装：
```bash
node --version
npm --version
```

### 2.2 安装 Java JDK

**Windows:**
1. 访问 [Eclipse Temurin](https://adoptium.net/)
2. 下载 JDK 17 (LTS) Windows x64 Installer
3. 运行安装程序
4. 设置环境变量：
```
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x-x64
PATH=%JAVA_HOME%\bin
```

**macOS:**
```bash
brew install openjdk@17
```

**验证:**
```bash
java --version
```

### 2.3 安装 Android SDK

**方式一：Android Studio (推荐)**
1. 下载 [Android Studio](https://developer.android.com/studio)
2. 安装并启动
3. SDK Manager 中安装：
   - Android SDK Platform 34
   - Build-Tools 34.0.0
   - Command-line Tools

**方式二：命令行安装**
```bash
# Windows (使用 Chocolatey)
choco install android-sdk

# macOS (使用 Homebrew)
brew install android-sdk

# 设置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

### 2.4 安装 Xcode (仅 iOS)

1. 从 App Store 下载 Xcode 15+
2. 打开并安装组件
3. 验证安装：
```bash
xcodebuild --version
```

### 2.5 安装 CocoaPods (仅 iOS)

```bash
sudo gem install cocoapods
pod setup
```

## 三、项目配置

### 3.1 克隆项目

```bash
git clone <your-repo-url>
cd WarehouseScanner
npm install
```

### 3.2 iOS 配置

```bash
cd ios
pod install
cd ..
```

## 四、构建 Android APK

### 4.1 Debug 版本 (测试用)

```bash
cd android
./gradlew assembleDebug
```

生成位置：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4.2 Release 版本 (发布用)

需要先配置签名：

1. 创建签名密钥：
```bash
keytool -genkeypair -v -storetype PKCS12 -keyalg RSA \
  -keysize 2048 -validity 10000 \
  -keystore release-key.keystore \
  -alias release-key \
  -storepass yourpassword \
  -keypass yourpassword
```

2. 配置签名信息：
编辑 `android/app/build.gradle`，在 `android` 块中添加：

```groovy
signingConfigs {
    release {
        storeFile file('release-key.keystore')
        storePassword 'yourpassword'
        keyAlias 'release-key'
        keyPassword 'yourpassword'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ...
    }
}
```

3. 构建 Release APK：
```bash
./gradlew assembleRelease
```

生成位置：
```
android/app/build/outputs/apk/release/app-release.apk
```

### 4.3 App Bundle (Google Play)

```bash
./gradlew bundleRelease
```

生成位置：
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 五、构建 iOS IPA

### 5.1 使用 Xcode 构建

1. 打开项目：
```bash
open ios/warehouse-scanner.xcworkspace
```

2. 配置签名：
   - 选择项目导航器
   - 选择 warehouse-scanner 目标
   - Signing & Capabilities 选项卡
   - 选择 Team
   - 自动或手动管理签名

3. 构建归档：
   - 菜单：Product → Archive
   - 等待构建完成

4. 导出 IPA：
   - 在 Organizer 窗口选择归档
   - 点击 Distribute App
   - 选择分发方式
   - 导出 IPA

### 5.2 命令行构建

```bash
# Debug 构建
xcodebuild -workspace ios/warehouse-scanner.xcworkspace \
  -scheme warehouse-scanner \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  build

# Release 构建
xcodebuild -workspace ios/warehouse-scanner.xcworkspace \
  -scheme warehouse-scanner \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  archive -archivePath build/release
```

## 六、常见问题

### Q1: 构建失败，提示缺少依赖

A: 运行以下命令重新安装依赖：
```bash
rm -rf node_modules
npm install
cd ios && pod deintegrate && pod install && cd ..
```

### Q2: Android 构建内存不足

A: 编辑 `android/gradle.properties`：
```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
```

### Q3: iOS 签名失败

A: 检查：
1. Apple Developer 账户是否有效
2. 证书和描述文件是否匹配 Bundle ID
3. Team ID 是否正确设置

### Q4: Android SDK 未找到

A: 设置环境变量：
```bash
export ANDROID_HOME=/path/to/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
```

## 七、一键构建脚本

项目已提供一键构建脚本：

- **Windows**: `build-android.bat`
- **macOS/Linux**: `build-android.sh`

运行脚本将自动执行构建流程。

## 八、技术支持

如遇到问题，请：
1. 查看构建日志
2. 检查环境变量配置
3. 确认所有依赖已安装
4. 参考官方文档

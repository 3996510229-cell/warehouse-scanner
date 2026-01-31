# iOS 构建与分发指南

## 环境要求

- macOS 系统 (必须)
- Xcode 14.0+
- CocoaPods
- Apple Developer Account

## 安装依赖

```bash
# 1. 安装 Node.js 依赖
npm install

# 2. 安装 iOS 依赖
cd ios
pod install
cd ..
```

## 构建步骤

### 方式1: 使用命令行

```bash
# Debug 版本
cd ios
xcodebuild -workspace warehouse-scanner.xcworkspace \
  -scheme warehouse-scanner \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  build

# Release 版本
xcodebuild -workspace warehouse-scanner.xcworkspace \
  -scheme warehouse-scanner \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  archive
```

### 方式2: 使用 Xcode

1. 打开 `ios/warehouse-scanner.xcworkspace`
2. 选择目标设备和配置
3. 菜单: Product -> Build
4. 等待构建完成

## 生成 IPA 文件

### 方式1: Xcode Archive

1. 打开 `ios/warehouse-scanner.xcworkspace`
2. 菜单: Product -> Archive
3. 等待归档完成
4. 在 Organizer 窗口中选择归档
5. 点击 "Distribute App"
6. 选择分发方式:
   - **App Store Connect** (上传到 App Store)
   - **Ad Hoc** (测试设备分发)
   **Enterprise** (企业分发)
   - **Development** (开发测试)

### 方式2: 命令行

```bash
# 导出 IPA (需要配置文件)
xcodebuild -exportArchive \
  -archivePath build/Release-iphoneos/warehouse-scanner.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist exportOptions.plist
```

## 创建导出配置

创建 `ios/exportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
</dict>
</plist>
```

## App Store 分发

### 1. 上传 IPA

使用 Xcode 或 Transporter 应用上传 IPA 到 App Store Connect。

### 2. 配置应用信息

在 App Store Connect 中:
- 设置应用名称、描述、截图
- 配置价格和分发区域
- 提交审核

### 3. 审核要求

确保应用满足:
- [ ] 完整的隐私政策
- [ ] 正确的权限使用说明
- [ ] 无崩溃和严重bug
- [ ] 符合 App Store 审核指南

## TestFlight 分发 (测试)

### 1. 上传到 TestFlight

1. Xcode 菜单: Product -> Archive
2. Distribute App -> TestFlight
3. 自动上传到 App Store Connect

### 2. 管理测试

1. 登录 App Store Connect
2. 选择 TestFlight 标签
3. 添加测试用户
4. 管理构建版本

## 企业分发

### 1. Apple Enterprise 证书

需要 Apple Enterprise Developer Account。

### 2. 导出企业 IPA

```bash
xcodebuild -exportArchive \
  -archivePath build/Release-iphoneos/warehouse-scanner.xcarchive \
  -exportPath build/enterprise \
  -exportOptionsPlist enterprise.plist
```

创建 `ios/enterprise.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>enterprise</string>
    <key>teamID</key>
    <string>YOUR_ENTERPRISE_TEAM_ID</string>
</dict>
</plist>
```

## 常见问题

### Q: Xcode 构建失败?

A: 检查以下项目:
1. Xcode 版本是否兼容
2. CocoaPods 是否正确安装
3. 证书和描述文件是否有效

### Q: IPA 签名错误?

A: 检查:
1. 证书是否包含正确的权限
2. 描述文件是否匹配 Bundle ID
3. Team ID 是否正确

### Q: 无法上传到 App Store?

A: 确保:
1. 应用已创建在 App Store Connect
2. 证书权限包含 "App Store" 分发
3. 版本号和构建号正确

### Q: TestFlight 无法安装?

A: 检查:
1. 测试用户是否接受邀请
2. 设备 UDID 是否在列表中
3. 证书是否有效

## 证书管理建议

1. **不要共享证书文件**
2. **使用自动签名管理**
3. **定期更新证书**
4. **备份证书到 Keychain**

## 相关资源

- [Apple Developer](https://developer.apple.com)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)

# 仓库扫码管理系统 - 云端构建指南

## 当前状态 ✅

以下步骤已完成：
- ✅ Node.js 环境已安装 (v24.13.0)
- ✅ EAS CLI 已安装
- ✅ 项目已配置为 Expo 项目
- ✅ 依赖包已安装 (1380+ packages)
- ✅ EAS 构建配置已创建

## 接下来需要您完成的步骤

### 步骤1: 登录 Expo 账户

1. **注册 Expo 账户**
   - 访问 https://expo.dev/signup
   - 使用邮箱注册（免费）

2. **登录 Expo**
   ```bash
   eas login
   ```
   - 输入您的邮箱和密码

3. **验证登录**
   ```bash
   eas whoami
   ```
   应该显示您的用户名

### 步骤2: 配置 EAS Build

1. **初始化项目配置**
   ```bash
   eas build:configure
   ```
   - 选择 "Android" 和 "iOS"
   - 这将更新 eas.json 配置

2. **登录 Apple Developer Account (仅 iOS)**
   - 访问 https://appstoreconnect.apple.com
   - 确保您有有效的 Apple Developer 账户

3. **配置 Android 签名**
   - EAS 会自动处理 Android 签名
   - 或者您可以上传自己的签名密钥

### 步骤3: 开始构建

#### 构建 Android APK (推荐首先尝试)

```bash
# 构建 Debug 版本 APK
eas build --platform android --profile development

# 构建 Release 版本 APK
eas build --platform android --profile production
```

**预计时间**: 5-15 分钟

**下载位置**: 构建完成后，Expo 会发送下载链接到您的邮箱

#### 构建 iOS IPA

```bash
# 构建 iOS Simulator 版本 (用于测试)
eas build --platform ios --profile preview

# 构建 App Store 版本
eas build --platform ios --profile production
```

**注意**: iOS 构建需要 Apple Developer 账户

**预计时间**: 10-20 分钟

### 步骤4: 下载安装包

构建完成后，您有以下下载方式：

1. **邮件通知**: 构建完成会收到下载链接
2. **Expo Dashboard**: https://expo.dev/builds
3. **命令行下载**:
   ```bash
   eas build:list
   ```

## 生成的安装包

| 平台 | 类型 | 文件格式 | 用途 |
|------|------|---------|------|
| Android | Debug | .apk | 开发测试 |
| Android | Production | .aab | Google Play 提交 |
| iOS | Simulator | .ipa | 模拟器测试 |
| iOS | Production | .ipa | App Store 提交 |

## 安装包位置

构建生成的安装包默认保存在：
- **本地**: `android/app/build/outputs/` (本地构建)
- **云端**: 通过 Expo Dashboard 下载

## 快速参考命令

```bash
# 登录
eas login

# 查看账户
eas whoami

# 构建 Android
eas build --platform android

# 构建 iOS
eas build --platform ios

# 查看构建状态
eas build:list

# 查看构建日志
eas build:view <build-id>
```

## 常见问题

### Q: 构建失败怎么办？

A: 1. 检查邮件中的错误日志
   2. 确保所有依赖已正确安装
   3. 检查 app.json 配置是否正确

### Q: iOS 构建需要什么？

A: - Apple Developer 账户
  - 有效的 Team ID
  - Bundle Identifier 配置

### Q: Android 构建需要什么？

A: - Google Play 账户（可选，用于发布）
  - 默认使用 EAS 提供的签名

### Q: 构建速度慢怎么办？

A: - 首次构建较慢（10-20分钟）
  - 后续构建会使用缓存
  - 可以使用预览版本加速

## 技术支持

如需帮助，请参考：
- [Expo 文档](https://docs.expo.dev)
- [EAS Build 文档](https://docs.expo.dev/build/introduction)
- [Expo 社区](https://forums.expo.dev)

---

**项目位置**: `E:\WarehouseScanner`

**文档位置**: `E:\WarehouseScanner\docs\`

祝您构建成功！🎉

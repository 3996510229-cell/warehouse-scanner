# 云端构建服务指南

如果本地环境配置困难，可以使用云端构建服务生成安装包。

## 一、推荐的云端构建服务

### 1.1 Expo Application Services (EAS)

Expo 提供的云端构建服务，支持 Android 和 iOS。

**特点：**
- 无需本地配置开发环境
- 支持 Android APK/AAB 和 iOS IPA
- 免费额度充足
- 简单易用

**使用方法：**

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo 账户
eas login

# 3. 初始化项目
eas build:configure

# 4. 构建 Android
eas build --platform android

# 5. 构建 iOS
eas build --platform ios
```

**配置 eas.json：**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 1.2 Microsoft App Center

微软提供的移动应用构建服务。

**特点：**
- 免费构建额度
- 支持 Android 和 iOS
- 自动测试和分发
- 支持自定义构建脚本

**使用方法：**
1. 注册 [App Center](https://appcenter.ms)
2. 连接 GitHub 仓库
3. 配置构建分支
4. 启动构建

### 1.3 Buddy

CI/CD 自动化平台，支持移动应用构建。

**特点：**
- 丰富的模板
- 支持 Docker
- 免费额度充足
- 易于配置

## 二、云端构建注意事项

### 2.1 隐私和安全

- **敏感信息**：不要将密钥库文件提交到代码仓库
- **环境变量**：使用云服务的密钥管理功能
- **访问控制**：限制团队成员的构建权限

### 2.2 构建时间

- 首次构建：10-30 分钟
- 增量构建：2-5 分钟
- 排队时间：视服务而定

### 2.3 成本考虑

- 免费额度通常有限
- 超出额度后按次收费
- 建议优化构建频率

## 三、替代方案：在线 Playground

如果只是想快速体验应用功能，可以使用：

### 3.1 Expo Snack

在线 React Native 运行环境：
1. 访问 [snack.expo.dev](https://snack.expo.dev)
2. 上传项目代码
3. 在手机浏览器中预览

### 3.2 CodeSandbox

在线开发环境：
1. 访问 [codesandbox.io](https://codesandbox.io)
2. 导入项目
3. 使用移动设备预览

## 四、构建服务对比

| 服务 | 免费额度 | Android | iOS | 易用性 |
|------|----------|---------|-----|--------|
| EAS | 充足 | APK/AAB | IPA | ⭐⭐⭐⭐⭐ |
| App Center | 有限 | APK | IPA | ⭐⭐⭐⭐ |
| Buddy | 充足 | APK | IPA | ⭐⭐⭐⭐ |
| 本地构建 | 无限 | APK/AAB | IPA | ⭐⭐⭐ |

## 五、最佳实践

### 5.1 选择建议

- **快速验证**：使用 EAS
- **团队协作**：使用 App Center
- **完全控制**：本地构建
- **预算有限**：使用免费额度

### 5.2 成本优化

- 开启构建缓存
- 减少不必要的构建
- 使用增量构建
- 及时清理旧构建

### 5.3 安全建议

- 定期轮换密钥
- 限制 API 访问权限
- 监控构建日志
- 备份重要文件

## 六、获取帮助

- [Expo 文档](https://docs.expo.dev)
- [App Center 文档](https://docs.microsoft.com/en-us/appcenter)
- [Buddy 文档](https://buddy.works/docs)

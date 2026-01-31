# 通过 Expo 网站手动构建 APK 指南

由于命令行在非交互式环境中无法显示签名密钥确认提示，请按照以下步骤通过 Expo 网站手动构建：

## 步骤 1：访问构建页面

1. 打开浏览器，访问：
   https://expo.dev/accounts/george222/projects/warehouse-scanner/builds

2. 您将看到项目构建页面

## 步骤 2：创建新构建

1. 点击 **"Create a build"** 按钮

2. 在弹出的窗口中：
   - **Platform**: 选择 **Android**
   - **Build profile**: 选择 **production**（推荐，用于发布）
     - 或选择 **preview**（用于测试）

3. 点击 **"Initiate build"** 按钮

## 步骤 3：处理签名密钥

1. 系统可能会弹出 **Android Keystore** 提示

2. 选择 **"Generate a new Keystore"**（推荐）

3. 点击 **"Continue"** 或 **"OK"**

## 步骤 4：等待构建完成

1. 构建过程开始，状态显示为 **"Building"**

2. 预计时间：**5-15 分钟**

3. 页面会自动刷新显示进度

## 步骤 5：下载 APK

构建完成后（状态变为 **"Finished"**）：

1. 在构建列表中找到完成的构建

2. 点击 **"Download"** 按钮下载 APK 文件

3. 或者点击构建详情页的下载链接

## 步骤 6：安装到手机

1. 将 APK 文件传输到您的 Android 手机

2. 在手机上打开 APK 文件

3. 如果系统阻止安装：
   - 进入 **设置 → 安全**
   - 启用 **"未知来源"** 或 **"允许安装未知应用"**

4. 完成安装

## 常见问题

### Q: 构建失败了怎么办？

A: 
1. 检查页面显示的错误信息
2. 确保项目依赖已正确安装
3. 访问 https://expo.dev/builds 查看详细日志

### Q: 下载链接在哪里？

A: 
1. Expo 会发送邮件到您的注册邮箱
2. 或访问 https://expo.dev/accounts/george222/projects/warehouse-scanner/builds
3. 点击完成的构建，详情页有下载链接

### Q: 可以构建 iOS 吗？

A: 可以，但需要 Apple Developer 账户。步骤类似，选择 iOS 平台即可。

## 快速访问链接

- **构建页面**: https://expo.dev/accounts/george222/projects/warehouse-scanner/builds
- **项目主页**: https://expo.dev/accounts/george222/projects/warehouse-scanner
- **Expo 文档**: https://docs.expo.dev/build/introduction/

---

**项目位置**: `E:\WarehouseScanner`

祝您构建成功！🎉

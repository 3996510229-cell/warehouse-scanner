# 修复构建失败 - 手动步骤

## 问题原因
GitHub Actions 工作流中的 `android-actions/setup-android@v3` 不支持 `api-level` 参数。

## 已完成的修复
- [x] 移除了不支持的 `api-level` 参数
- [x] 使用默认的 Android SDK 配置
- [x] 简化了工作流文件

## 需要你手动执行的步骤

### 步骤 1: 运行推送脚本
双击运行以下文件：
```
E:\WarehouseScanner\quick_push.bat
```

或者手动打开 Git Bash 并执行：
```bash
cd /e/WarehouseScanner
git add .github/workflows/android-build.yml
git commit -m "fix: 修复 GitHub Actions 工作流配置"
git push origin main
```

### 步骤 2: 验证构建
推送成功后：
1. 访问 https://github.com/3996510229-cell/warehouse-scanner/actions
2. 等待新的构建任务开始（通常在推送后几秒内自动触发）
3. 观察构建进度（预计需要 10-20 分钟）

### 步骤 3: 下载 APK
构建成功后：
1. 点击构建任务
2. 找到 Artifacts 部分
3. 下载 `app-debug.apk`

## 预期结果
- 构建状态: Success (绿色勾)
- 构建产物: app-debug.apk

## 如果构建仍然失败
请将以下信息发送给我：
1. 构建错误日志截图
2. 访问 https://github.com/3996510229-cell/warehouse-scanner/actions/runs/最近一次运行 查看详情

---
**当前 Git 状态**: 修改已准备好，需要提交并推送

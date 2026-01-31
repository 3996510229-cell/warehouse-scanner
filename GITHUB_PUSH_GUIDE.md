# 仓库扫码管理系统 - GitHub 上传指南

## 当前状态
- [x] Git 已安装 (v2.52.0)
- [x] Git 用户已配置
- [x] 本地仓库已初始化
- [x] 代码已提交 (66 files, commit: 5cb7df6)
- [ ] 代码已推送到 GitHub

## 推送到 GitHub

### 方法 1: 使用提供的脚本 (推荐)

双击运行以下文件：
```
E:\WarehouseScanner\push_to_github.bat
```

### 方法 2: 手动执行命令

1. **打开 Git Bash** (开始菜单 -> Git -> Git Bash)

2. **执行以下命令**：
```bash
cd /e/WarehouseScanner
git push -u origin main
```

3. **如果需要认证**：
   - 如果使用 HTTPS，会弹出窗口要求输入 GitHub 用户名和密码
   - 如果使用 Token，需要在密码栏输入 Personal Access Token

### 方法 3: 使用 PowerShell

右键点击 `push_to_github.bat` -> "使用 PowerShell 运行"

---

## GitHub Actions 自动构建

推送成功后，GitHub Actions 会自动开始构建 APK：

1. 访问: https://github.com/3996510229-cell/warehouse-scanner/actions
2. 等待构建完成 (约 10-15 分钟)
3. 点击构建任务 -> Artifacts -> 下载 app-debug.apk

---

## 常见问题

### Q: 网络连接失败
```bash
# 检查网络代理
git config --global --get http.proxy
git config --global --get https.proxy

# 如果需要，设置代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy http://proxy.example.com:8080
```

### Q: 认证失败
确保使用正确的认证方式：
- 如果启用了 2FA，需要使用 Personal Access Token
- Token 可以在 GitHub -> Settings -> Developer settings -> Personal access tokens 生成

### Q: 重试推送
如果推送失败，可以重新运行：
```bash
git push -u origin main --force
```

---

## 仓库信息
- **仓库地址**: https://github.com/3996510229-cell/warehouse-scanner
- **分支**: main
- **提交数**: 1

## 下一步操作
1. 推送代码到 GitHub
2. 访问 Actions 页面查看构建进度
3. 下载生成的 APK 文件

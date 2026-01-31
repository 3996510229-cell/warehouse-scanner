# 应用图标生成说明

## 需要的图标文件

请根据以下规格创建图标文件：

### 1. 应用图标 (icon.png)
- 尺寸: 1024x1024 像素
- 格式: PNG
- 用途: 应用图标

### 2. 启动画面 (splash.png)
- 尺寸: 1242x2208 像素
- 格式: PNG
- 用途: 启动加载画面

### 3. 自适应图标 (Android)
- 前景: 512x512 像素 (透明背景)
- 背景: 432x432 像素 (纯色背景)

## 快速生成方法

### 使用在线工具
1. 访问 [Expo Icon Generator](https://expo.github.io/vector-icons/)
2. 上传您的设计或使用模板
3. 下载生成的图标集

### 使用命令行工具
```bash
npx expo-app-icon generate
```

## 图标设计建议

1. **简洁明了**: 使用简单的图形和颜色
2. **品牌识别**: 包含仓库或扫码元素
3. **颜色方案**: 使用品牌主色调 (#1976D2)
4. **背景**: 使用圆角矩形或圆形

## 推荐的图标生成工具

- [Figma](https://figma.com) - 专业设计工具
- [Canva](https://canva.com) - 在线设计
- [Expo App Icon](https://expo.github.io/vector-icons/) - Expo官方工具

## 当前状态

已创建 SVG 版本图标 (icon.svg)，您可以：
1. 使用在线工具将其转换为 PNG
2. 使用设计软件打开并导出 PNG
3. 将 PNG 文件放置在 src/assets/ 目录下

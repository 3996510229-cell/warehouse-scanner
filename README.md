# 仓库扫码管理系统

一款用于仓库物料库存管理的移动应用，支持扫码入库、出库、库存查询和操作记录。

## 功能特性

- **扫码功能**: 调用手机摄像头扫描物料条码
- **库存管理**: 实时记录和更新物料库存数量
- **物料查询**: 快速查找物料信息
- **操作记录**: 记录所有库存变动历史
- **低库存预警**: 自动提醒库存不足的物料
- **离线存储**: 使用 SQLite 本地数据库，支持离线使用

## 技术栈

- **前端框架**: React Native + TypeScript
- **状态管理**: Zustand
- **扫码功能**: react-native-vision-camera + MLKit 条码识别
- **数据存储**: SQLite (react-native-sqlite-storage)
- **UI组件**: React Native Paper
- **导航**: React Navigation Native Stack

## 项目结构

```
WarehouseScanner/
├── android/                    # Android 项目配置
├── ios/                        # iOS 项目配置
├── src/
│   ├── components/            # 可复用组件
│   │   ├── BarcodeScanner.tsx # 条码扫描组件
│   │   └── InventoryItem.tsx  # 库存列表项组件
│   ├── navigation/            # 导航配置
│   │   └── AppNavigator.tsx   # 路由配置
│   ├── screens/               # 页面组件
│   │   ├── HomeScreen.tsx            # 首页
│   │   ├── InventoryScreen.tsx       # 库存列表
│   │   ├── ScannerScreen.tsx         # 扫码页面
│   │   ├── MaterialDetailScreen.tsx  # 物料详情
│   │   ├── HistoryScreen.tsx         # 操作记录
│   │   ├── AddMaterialScreen.tsx     # 新建物料
│   │   ├── EditMaterialScreen.tsx    # 编辑物料
│   │   └── LowStockScreen.tsx        # 低库存预警
│   ├── services/              # 服务层
│   │   ├── database.ts        # SQLite 数据库服务
│   │   └── barcodeService.ts  # 条码扫描服务
│   ├── store/                 # 状态管理
│   │   └── inventoryStore.ts  # 库存状态管理
│   ├── types/                 # TypeScript 类型定义
│   │   └── index.ts           # 类型导出
│   ├── utils/                 # 工具函数
│   │   └── ReactotronConfig.ts # 调试配置
│   ├── theme.ts               # 主题配置
│   ├── App.tsx                # 应用入口
│   └── app.json               # 应用配置
├── index.js                   # 入口文件
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript 配置
├── babel.config.js            # Babel 配置
├── metro.config.js            # Metro 配置
├── .eslintrc.js               # ESLint 配置
├── .prettierrc                # Prettier 配置
└── README.md                  # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 18
- React Native CLI
- Android Studio (Android 开发)
- Xcode (iOS 开发，需要 Mac)

### 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 或使用 yarn
yarn install
```

### iOS 平台

```bash
# 安装 iOS 依赖
cd ios
pod install
cd ..

# 运行 iOS 应用
npm run ios
```

### Android 平台

```bash
# 启动 Android 模拟器或连接设备
npm run android
```

## 使用说明

### 扫码入库

1. 点击首页的"扫码入库"按钮
2. 将物料条码对准扫描框
3. 扫描成功后选择入库数量
4. 确认入库

### 新建物料

1. 点击首页的"新建物料"按钮
2. 填写物料信息（条码、名称、规格等）
3. 设置库存参数（当前库存、最低预警等）
4. 保存物料

### 库存查询

1. 在库存列表页面可查看所有物料
2. 使用搜索功能快速查找
3. 按分类筛选物料

### 操作记录

1. 点击首页的"操作记录"按钮
2. 查看所有库存操作历史
3. 可按日期筛选记录

## 主要功能

### 扫码功能

应用支持扫描多种条码格式：
- QR Code
- EAN-13 / EAN-8
- Code 128 / Code 39
- UPC-A / UPC-E

### 库存操作

- **入库**: 增加物料库存数量
- **出库**: 减少物料库存数量
- **调整**: 直接设置物料库存数量

### 预警机制

当物料库存低于最低预警值时：
- 在物料列表显示低库存标识
- 低库存预警页面集中显示所有需要补货的物料
- 详情页显示警告信息

## 配置说明

### 数据库

应用使用 SQLite 进行本地数据存储，数据保存在设备本地。

### 权限配置

- **相机权限**: 用于扫码功能
- **存储权限**: 用于数据本地存储

## 开发

### 代码规范

```bash
# 检查代码规范
npm run lint

# 格式化代码
npm run format
```

### 类型检查

```bash
# TypeScript 类型检查
npm run type-check
```

## 构建发布

### Android

```bash
# Debug 版本
cd android
./gradlew assembleDebug

# Release 版本
cd android
./gradlew assembleRelease
```

### iOS

```bash
# Archive 版本 (Xcode)
# Product -> Archive
```

## 常见问题

### 扫码无响应

1. 检查相机权限是否已授权
2. 确保光线充足，条码清晰
3. 保持手机稳定，对焦后再扫描

### 数据丢失

应用数据存储在本地数据库，卸载应用前请导出重要数据。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request。

# Android 签名配置指南签名密钥库 (Keystore)

###

## 创建 方法1: 使用 keytool 命令

```bash
keytool -genkeypair -v -storetype PKCS12 -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -storepass password123 \
  -keypass password123
```

参数说明:
- `-keystore`: 密钥库文件名
- `-alias`: 密钥别名
- `-storepass`: 密钥库密码
- `-keypass`: 密钥密码
- `-validity`: 有效期(天)

### 方法2: 使用 Android Studio

1. 打开 Android Studio
2. 菜单: Build -> Generate Signed Bundle/APK
3. 点击 "Create new..." 按钮
4. 填写密钥库信息
5. 保存密钥库文件

## 配置签名信息

编辑 `android/app/build.gradle` 文件:

```groovy
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

## 创建 gradle.properties

在项目根目录创建或编辑 `gradle.properties`:

```properties
# 签名配置 (不要提交到版本控制)
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

## 构建签名 APK

```bash
# Debug 版本 (无需签名)
cd android
./gradlew assembleDebug

# Release 版本 (自动签名)
./gradlew assembleRelease

# 生成 App Bundle (用于 Google Play)
./gradlew bundleRelease
```

## 生成签名 APK (手动签名)

如果已有未签名的 APK:

```bash
# 1. 创建签名 APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.keystore \
  -signedjar app-signed.apk \
  app-unsigned.apk \
  my-key-alias

# 2. 优化 APK (可选)
zipalign -v 4 app-signed.apk app-final.apk
```

## 发布到应用商店

### Google Play
需要上传 `.aab` (App Bundle) 文件:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 其他商店
上传 `.apk` 文件:
```
android/app/build/outputs/apk/release/app-release.apk
```

## 安全建议

1. **不要提交密钥库到版本控制**
2. **使用强密码**
3. **备份密钥库到安全位置**
4. **设置较长的有效期**
5. **考虑使用密钥轮换**

## 常见问题

### Q: 忘记密钥库密码怎么办?
A: 无法恢复，请妥善保管密码。建议使用密码管理工具。

### Q: 丢失密钥库文件怎么办?
A: 无法恢复，发布的应用将无法更新。请务必备份。

### Q: 签名验证失败?
A: 检查 build.gradle 中的签名配置是否正确。

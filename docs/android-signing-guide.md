# Android 发布签名配置指南

> Windows / Mac / Linux 通用。一次配置，长期使用。

---

## 📋 发布前必做

1. 生成签名 keystore（终身使用，**必须妥善保管**）
2. 配置 `android/app/build.gradle` 签名信息
3. 配置 ProGuard / R8 混淆
4. 生成 Release APK / AAB
5. 上传到 Google Play Console

---

## 🔐 第 1 步：生成签名 keystore

### 命令

```bash
keytool -genkey -v \
  -keystore wan-nian-li.keystore \
  -alias wannianli \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass [您的密码] \
  -keypass [您的密码] \
  -dname "CN=WanNianLi, OU=Dev, O=Personal, L=Beijing, S=Beijing, C=CN"
```

### 参数说明

| 参数 | 含义 | 示例 |
|---|---|---|
| `-keystore` | keystore 文件名 | `wan-nian-li.keystore` |
| `-alias` | 密钥别名 | `wannianli` |
| `-keyalg RSA -keysize 2048` | 算法与位数 | 标准 |
| `-validity 10000` | 有效期（天）≈ 27 年 | 推荐 10000 |
| `-storepass` | **keystore 密码** | 妥善记录 |
| `-keypass` | **key 密码**（可与 storepass 相同） | 妥善记录 |
| `-dname` | 证书所有者信息 | 按需填写 |

### ⚠️ 重要警告

**`wan-nian-li.keystore` 是您应用的"身份证"，必须：**
- ✅ 备份到云端（Google Drive / OneDrive 等）
- ✅ 备份到本地多个位置
- ❌ **绝对不能** 提交到 Git 仓库
- ❌ **绝对不能** 弄丢

**丢了的代价**：永远无法更新已上架的应用，只能卸载重发（用户也会丢数据）。

---

## 🔒 第 2 步：保护 keystore

### 添加到 `.gitignore`

在项目根目录的 `.gitignore` 中添加：

```gitignore
# Android signing
*.keystore
*.jks
keystore.properties
```

### 把密码放到 `keystore.properties`（不进 Git）

创建 `android/keystore.properties`：

```properties
storeFile=../wan-nian-li.keystore
storePassword=您的storepass密码
keyAlias=wannianli
keyPassword=您的keypass密码
```

并在 `.gitignore` 中添加：

```gitignore
android/keystore.properties
```

---

## ⚙️ 第 3 步：配置 `android/app/build.gradle`

### 完整 release 配置

在 `android/app/build.gradle` 中：

```gradle
import java.util.Properties
import java.io.FileInputStream

// 加载 keystore.properties
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    namespace "com.wannianli.app"
    compileSdk 34

    defaultConfig {
        applicationId "com.wannianli.app"
        minSdk 23
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystystoreProperties['storePassword']
            }
        }
    }

    buildTypes {
        release {
            minifyEnabled true       // 启用混淆
            shrinkResources true     // 移除未用资源
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
        debug {
            applicationIdSuffix ".debug"
            versionNameSuffix "-debug"
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    // ... Capacitor 依赖会自动添加
}

apply from: 'capacitor.build.gradle'

try {
    def servicesJSON = file('google-services.json')
    if (servicesJSON.text) {
        apply plugin: 'com.google.gms.google-services'
    }
} catch (Exception e) {
    logger.info('google-services.json not found, skipping Google Services plugin')
}
```

---

## 🛡️ 第 4 步：配置 ProGuard 规则

在 `android/app/proguard-rules.pro` 中添加：

```proguard
# ==========================================
# Capacitor
# ==========================================
-keep class com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugin.** { *; }
-dontwarn com.getcapacitor.**

# ==========================================
# WebView JavaScript Interface
# ==========================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ==========================================
# Cordova (如果用到)
# ==========================================
-keep class org.apache.cordova.** { *; }
-dontwarn org.apache.cordova.**

# ==========================================
# AndroidX
# ==========================================
-keep class androidx.** { *; }
-dontwarn androidx.**

# ==========================================
# JavaScript 反射调用
# ==========================================
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod
```

---

## 📦 第 5 步：构建 Release

### 方式 A：构建 APK（直接安装）

```bash
cd android
./gradlew assembleRelease
# 产物：android/app/build/outputs/apk/release/app-release.apk
```

### 方式 B：构建 AAB（Google Play 推荐）

```bash
cd android
./gradlew bundleRelease
# 产物：android/app/build/outputs/bundle/release/app-release.aab
```

### 方式 C：一次性构建 + 同步

```bash
# 在项目根目录
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease
```

---

## 🚀 第 6 步：上传到 Google Play

### 准备工作
1. 访问 [Google Play Console](https://play.google.com/console)
2. 一次性付费 25 美元注册
3. 同意协议 + 实名认证

### 创建应用
1. **创建应用** → 选"应用"或"游戏"
2. 默认语言、名称、简介
3. 上传 AAB 文件
4. 填写内容分级、目标受众
5. 填写隐私政策 URL：`https://dist-ten-psi-35.vercel.app/privacy.html`

### 商店上架资料
- 应用图标：512×512 PNG
- 截图：手机 / 7 寸平板 / 10 寸平板
- 顶部宣传图（Feature Graphic）：1024×500
- 应用描述、标签

### 国内安卓市场（可选）
- 华为、小米、OPPO、vivo、应用宝、阿里、百度
- 大多需要：营业执照 + 软著（软件著作权）
- 软著办理周期 1-2 个月，可提前申请

---

## 🆘 常见问题

### Q1：忘记 keystore 密码怎么办？
**无法找回**。必须重新生成 keystore + 重新发布新应用。
建议：密码用 1Password / Bitwarden 等工具管理。

### Q2：可以更换 keystore 吗？
**不可以**。已上架的应用必须用同一 keystore 更新。

### Q3：debug 签名 vs release 签名？
- `debug` keystore：Android Studio 自动生成，每次开发用
- `release` keystore：发布用，必须自己创建并妥善保管

### Q4：如何测试 release 包？
```bash
cd android
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

### Q5：Vercel Token 已设置，但 Vercel 部署时如何处理？
Vercel 部署**只**部署 Web 资源（`dist/`），与 Android 签名无关。Android 签名只在构建 APK/AAB 时使用。

---

## 📋 发布前最终自检清单

| ✅ | 项目 |
|---|---|
| ⬜ | keystore 已生成并备份到 2+ 个位置 |
| ⬜ | `keystore.properties` 已配置且**不**进 Git |
| ⬜ | `build.gradle` 已配置 `signingConfigs.release` |
| ⬜ | ProGuard 规则已添加 |
| ⬜ | `npm run build && npx cap sync android` 已执行 |
| ⬜ | `./gradlew bundleRelease` 已成功生成 AAB |
| ⬜ | AAB 在模拟器/真机安装测试通过 |
| ⬜ | Google Play Console 账号已付费（25$） |
| ⬜ | 隐私政策 URL 已准备 |

---

## 🔗 相关链接

- [Google Play Console](https://play.google.com/console)
- [Android 签名文档](https://developer.android.com/studio/publish/app-signing)
- [Capacitor Android 文档](https://capacitorjs.com/docs/android)
- [ProGuard 规则参考](https://developer.android.com/studio/build/shrink-code)

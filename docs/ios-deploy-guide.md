# iOS 发布操作手册（Mac 端）

> 在 Mac 上逐步执行本文档。Windows 端已完成：隐私政策、配置、文案准备。

---

## 📋 发布前自检清单

| ✅ | 项目 | 状态 |
|---|---|---|
| ✅ | Apple Developer 账号（99 美元/年） | 必须先有 |
| ✅ | Mac + Xcode 15+ | 必须 |
| ✅ | iPhone 真机（用于测试） | 推荐 |
| ⬜ | 隐私政策已部署到可访问 URL | ⚠️ 发布前必须 |
| ⬜ | App Store 截图已准备 | ⚠️ 发布前必须 |
| ⬜ | 应用名称已决定 | ⚠️ 发布前必须 |

---

## 🚀 第一步：在 Mac 上初始化 iOS 项目

```bash
# 1. 克隆代码（如果还没有）
git clone <你的仓库地址>
cd wan-nian-li

# 2. 安装依赖
npm install

# 3. 构建 web 资源
npm run build

# 4. 添加 iOS 平台（Mac 专属命令）
npx cap add ios

# 5. 同步 web 资源到 iOS
npx cap sync ios

# 6. 打开 Xcode
npx cap open ios
```

---

## 🔒 第二步：替换 iOS 隐私清单（Apple 强制要求）

```bash
# 把本仓库的隐私清单复制到 iOS 项目
cp resources/PrivacyInfo.xcprivacy ios/App/PrivacyInfo.xcprivacy
```

⚠️ 如果 Xcode 里看到的是空文件，用本仓库 `resources/PrivacyInfo.xcprivacy` 内容覆盖。

---

## ⚙️ 第三步：Xcode 项目配置

### 1. 选择项目根节点 → Signing & Capabilities
- **Team**：选择你付费的 Apple ID 团队
- **Bundle Identifier**：保留 `com.wannianli.app`（或自定义）
- **Sign Style**：Automatic

### 2. 选择 `App` Target → General
| 配置项 | 值 |
|---|---|
| Display Name | 万年历 |
| Version | 1.0.0 |
| Build | 1 |
| Deployment Target | iOS 13.0 |
| Device Orientation | ✅ Portrait（取消 Landscape） |
| Requires Full Screen | ✅ 勾选 |

### 3. 选择 `App` Target → Info
- 确认存在 `Privacy - ... Usage Description` 键（如有）
- 本应用不需要任何权限描述键

### 4. 选择 `App` Target → Build Settings
- 搜索 `IPHONEOS_DEPLOYMENT_TARGET` → 13.0
- 搜索 `SWIFT_VERSION` → 5.0
- 搜索 `DEVELOPMENT_TEAM` → 你的 Team ID

### 5. 应用图标
Xcode → Assets.xcassets → AppIcon
- 把 `resources/icon.png`（1024×1024）拖到 1024×1024 槽位

### 6. 启动屏
Xcode → Assets.xcassets → Splash
- 把 `resources/splash.png`（1024×1792 或 1242×2688）放入

---

## 🧪 第四步：真机测试

```bash
# 1. 连接 iPhone 到 Mac
# 2. iPhone 设置 → 隐私与安全性 → 开发者模式 → 开启
# 3. Xcode 顶部选择你的 iPhone 设备
# 4. Cmd+R 运行
```

**测试清单**：
- [ ] 启动 SplashScreen 显示
- [ ] 状态栏样式正确
- [ ] 6 个主题切换正常
- [ ] 浅色/深色模式切换
- [ ] 滑动切换月份
- [ ] 添加/删除/完成日程
- [ ] 黄历宜忌显示
- [ ] 软键盘弹出/收起
- [ ] 安全区域（刘海/灵动岛）适配
- [ ] 横竖屏旋转（应只支持竖屏）
- [ ] 30 分钟不崩溃

---

## 📦 第五步：Archive 打包

1. Xcode 顶部选择 **Any iOS Device (arm64)**
2. **Product → Archive**
3. 等待完成（首次较慢）
4. 在 Organizer 窗口点击 **Distribute App**
5. 选择 **App Store Connect** → **Upload**
6. 选择 **Automatically manage signing**
7. 选择 **Upload**（不上传 symbols）
8. 等待上传完成

---

## 🌐 第六步：App Store Connect 配置

打开 https://appstoreconnect.apple.com

### 1. 创建应用
- 我的 App → **+** → **新建 App**
- 平台：iOS
- 名称：**万年历-日历黄历**（30 字内）
- 主要语言：简体中文
- Bundle ID：选 `com.wannianli.app`
- SKU：`wannianli-001`（自定义唯一）
- 用户访问权限：完全访问

### 2. 填写应用信息（参见 `app-store-listing.md`）
- 副标题、类别、定价
- 隐私政策 URL（⚠️ 必须）
- 描述、关键词、截图（3 套尺寸）

### 3. App Privacy 标签
- "Do you or your third-party partners collect data from this app?" → **No**
- 勾选 **"Data Not Collected"**

### 4. 定价与销售范围
- 价格：**免费**
- 可购买项目：无

### 5. 选择构建版本
- 上传完 Archive 后等 5-10 分钟，刷新即可看到构建版本
- 选择最新 Build

### 6. 内容分级
- 按 `app-store-listing.md` 中的问卷如实回答
- 预期分级：**4+**

### 7. 提交审核
- **版本发布** → 选择 **手动发布**（建议首次先手动）
- 右上角 **添加以供审核** → **提交**

---

## ⏱ 审核等待

- 首次提交：**1-3 个工作日**
- 后续提交：通常 **24 小时内**
- 状态查询：App Store Connect → 我的 App → 活动

---

## 🚨 常见被拒原因与预防

| 被拒原因 | 怎么防 |
|---|---|
| 隐私政策 URL 无法访问 | ⚠️ 发布前在浏览器测试隐私政策链接可正常打开 |
| App Privacy 标签错误 | 严格勾选 "Data Not Collected" |
| 截图含刘海/带壳 | 使用纯设备截图（Xcode Simulator Cmd+S） |
| 含 alpha 通道图标 | 用 sips 或 ImageMagick 转 sRGB |
| 闪退 | 充分测试 30 分钟 |
| 缺少恢复机制 | 已实现"导入/导出"按钮 ✅ |
| 第三方 SDK 未声明 | 无第三方 SDK ✅ |

---

## 🛠 调试命令汇总

```bash
# 清除构建
cd ios && xcodebuild clean && cd ..

# 重新同步
npx cap sync ios

# 在模拟器运行
npx cap run ios

# 查看 Capacitor 同步状态
npx cap ls

# 实时查看日志（Xcode 控制台）
# Xcode → Window → Devices and Simulators → 选 iPhone → Open Console
```

---

## 📞 遇到问题？

- [Capacitor iOS 文档](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple Developer Forums](https://developer.apple.com/forums/)

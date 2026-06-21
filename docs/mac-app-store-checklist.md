# Mac 上架精确 Checklist

> 适用：万年历 v1.0.1 上架 iOS App Store
> 预计总耗时：3-5 小时（含审核 1-3 天）
> 必须 Mac + Xcode 15+ + iPhone 真机

---

## 📋 上架前 5 个必备项

| 序号 | 项目 | 状态 | 位置 |
|---|---|---|---|
| 1 | Apple Developer Program 账号 | ⬜ 99$/年 | https://developer.apple.com/account |
| 2 | App Store Connect 账号 | ⬜ 免费 | https://appstoreconnect.apple.com |
| 3 | Mac 电脑（macOS 14+） | ⬜ 必需 | - |
| 4 | Xcode 15+ 已安装 | ⬜ App Store 下载 | - |
| 5 | iPhone 真机（iOS 13+） | ⬜ 真机测试 | - |

---

## 🔧 阶段 1：环境准备（10 分钟）

### 1.1 安装 Xcode Command Line Tools

```bash
xcode-select --install
```

### 1.2 安装 Node.js 20+

```bash
brew install node@20
node -v   # 确认 v20+
```

### 1.3 克隆项目

```bash
git clone https://github.com/wfwkiss-max/wan-nian-li.git
cd wan-nian-li
npm install
```

### 1.4 准备 Apple Developer Team ID

- 登录 https://developer.apple.com/account
- 点击 **Membership** → 找到 **Team ID**（10 位字符，如 `ABCDE12345`）
- **记下来**（Xcode 中需要）

---

## 📱 阶段 2：添加 iOS 平台（15 分钟）

### 2.1 Capacitor 添加 iOS

```bash
# 确保 dist 是最新的
npm run build

# 添加 iOS 平台（首次会下载 Capacitor iOS 模板，约 1-2 分钟）
npx cap add ios

# 同步 web 资源到 iOS 项目
npx cap sync ios
```

### 2.2 复制 Info.plist 模板

```bash
# 用我们准备好的完整 Info.plist 模板覆盖默认的
cp resources/Info.plist.template ios/App/App/Info.plist
```

### 2.3 复制 PrivacyInfo.xcprivacy

```bash
# 隐私清单（已准备好）
cp resources/PrivacyInfo.xcprivacy ios/App/PrivacyInfo.xcprivacy

# 如果 Xcode 没自动添加，需手动：
# 在 Xcode 中右键 ios/App 文件夹 → Add Files to "App" → 选择 PrivacyInfo.xcprivacy
```

### 2.4 复制图标和启动屏

```bash
# 图标（1024×1024，无 alpha）
# 在 Xcode 中操作：打开 Assets.xcassets → AppIcon → 拖入 resources/icon-1024.png

# 启动屏（在 Xcode 中操作）
# 打开 Assets.xcassets → Splash → 添加 New Image Set
# 名称改为 Splash，将 3 个 splash@*.png 拖入对应尺寸
```

### 2.5 打开 Xcode

```bash
npx cap open ios
# 等待 Xcode 加载项目（首次较慢）
```

---

## ⚙️ 阶段 3：Xcode 项目配置（20 分钟）

### 3.1 选择 App Target

1. 左侧 Project Navigator → 点击蓝色 **App** 项目
2. 中间选择 **App** Target
3. **General** 标签 → 检查以下设置：

| 设置 | 值 | 说明 |
|---|---|---|
| Display Name | 万年历 | 显示名称 |
| Bundle Identifier | com.wannianli.app | 唯一标识 |
| Version | 1.0.0 | 用户可见版本 |
| Build | 1 | 构建号（每次提交递增） |
| Deployment Target | iOS 13.0 | 最低系统 |
| Devices | iPhone | 仅 iPhone（iPad 选 Universal） |
| Requires Full Screen | ☐ 取消 | 让用户可用多任务 |

### 3.2 Signing & Capabilities

1. 选择 **Signing & Capabilities** 标签
2. **Team**：选择你的 Apple Developer Team
3. **Signing Certificate**：Automatic
4. **Provisioning Profile**：Automatic

### 3.3 Info 选项

1. 选择 **Info** 标签
2. **Custom iOS Target Properties**：
   - 检查 `UILaunchStoryboardName` = `LaunchScreen`（应已自动）
   - 检查 `UISupportedInterfaceOrientations` 数组中有 `Portrait`
3. **URL Types**：
   - 如果没有 URL Scheme 需求，跳过
   - 我们的 `Info.plist.template` 已包含 `wannianli://` Scheme

### 3.4 Build Settings（可选）

- **iOS Deployment Target**：13.0
- **Swift Language Version**：5.0（如果用到）

### 3.5 替换 Info.plist 实际内容

如果 `cap add ios` 之后你修改了 `ios/App/App/Info.plist`：
1. 在 Xcode 中右键 `Info.plist` → **Open As Source Code**
2. **完全替换**为 `resources/Info.plist.template` 的内容
3. 保存

> 重要：`CFBundleDisplayName` 和 `CFBundleVersion` 等值已由 Xcode 的 Build Settings 控制，**不需要在 plist 里改**。

---

## 🖼 阶段 4：添加资源（10 分钟）

### 4.1 应用图标

1. Xcode 左侧 → `Assets.xcassets`
2. 点击 **AppIcon** （默认应有 1024×1024 槽位）
3. 拖入 `resources/icon-1024.png` 到 1024×1024 槽位
4. 系统自动缩放生成所有尺寸

### 4.2 启动屏

1. 在 `Assets.xcassets` 中右键 → **New Image Set**
2. 命名为 `Splash`
3. 右侧 Attributes inspector 设置：
   - **Devices**: iPhone
   - **Scale**: 1x, 2x, 3x
4. 拖入 3 个文件到对应槽位：
   - `splash@2x.png` → 2x (iPhone 11 Pro Max)
   - `splash@3x.png` → 3x (iPhone 14 Pro)
   - `splash-2048.png` → iPad 槽位（如果支持 iPad）

### 4.3 修改 LaunchScreen.storyboard（可选）

1. 打开 `ios/App/App/LaunchScreen.storyboard`
2. 可改为显示 Logo + 应用名（默认是白色空白）
3. 如不改也 OK（Apple 允许）

---

## 📱 阶段 5：真机测试（30 分钟）

### 5.1 连接 iPhone

1. 用数据线连接 iPhone 到 Mac
2. 在 iPhone 上：**设置 → 隐私与安全性 → 开发者模式** → 开启
3. 在 Xcode 顶部设备栏选择你的 iPhone
4. 点 **▶ Run** 按钮（⌘R）

### 5.2 测试清单

逐项确认打勾：

#### 启动测试
- [ ] App 启动时间 < 3 秒
- [ ] 启动屏正确显示（Logo + 蓝紫渐变）
- [ ] 启动后直接进入月历视图

#### 月历页
- [ ] 6 套主题可切换（设置 → 外观 → UI 主题）
- [ ] 浅色/深色模式自动适配
- [ ] 当前日期正确高亮
- [ ] 点击日期 → 显示日详情
- [ ] 左右滑动 → 切换月份
- [ ] 标题点击 → 弹出年月选择器

#### 日详情
- [ ] 显示完整黄历（宜忌吉神凶煞）
- [ ] 干支纪年正确
- [ ] 节日标注
- [ ] 添加日程按钮可点击
- [ ] 日程列表正确显示（若有）

#### 黄历页
- [ ] 切换日期选择器
- [ ] 宜忌列表渲染
- [ ] 吉日筛选功能正常

#### 日程页
- [ ] 两个 Tab 切换（日程/纪念日）
- [ ] 滑动删除（SwipeToDelete）
- [ ] 标记完成（点击圆圈）

#### 工具页
- [ ] 三个工具正常

#### 设置页
- [ ] 中英文切换（语言选择器）
- [ ] 主题切换实时生效
- [ ] 数据导出/导入功能
- [ ] 关于页面信息

#### 系统交互
- [ ] 状态栏样式正确（不与应用内容冲突）
- [ ] 横竖屏切换锁定竖屏
- [ ] 后台切换不丢失数据
- [ ] 杀掉重开数据保留

### 5.3 模拟器测试（额外）

Cmd+R 启动模拟器（可选，但推荐）：

- [ ] iPhone SE（最小屏）
- [ ] iPhone 14 Pro（标准）
- [ ] iPhone 14 Pro Max（大屏）
- [ ] iPhone 15 Pro Max（最新）

---

## 🏗 阶段 6：Archive 构建（10 分钟）

### 6.1 清理缓存

```bash
# 在 Xcode 菜单 Product → Clean Build Folder
# 或快捷键 Cmd+Shift+K
```

### 6.2 选择 Any iOS Device

- 顶部设备栏选 **Any iOS Device (arm64)**（不是具体 iPhone）

### 6.3 Archive

- 菜单 **Product → Archive**
- 或快捷键：略（Xcode 无默认快捷键）
- 等待 1-3 分钟编译完成
- 自动弹出 **Organizer** 窗口

### 6.4 验证 Archive

- Organizer 窗口显示刚才的 Archive
- 点击 **Validate App** 按钮
- 等待 1-2 分钟验证
- 应该显示 "No issues"

---

## 🚀 阶段 7：分发到 App Store Connect（10 分钟）

### 7.1 Distribute App

- 在 Organizer 中点击 **Distribute App** 按钮
- 选择 **App Store Connect** → **Upload**
- 勾选 **Upload**（不上传 symbols）
- 选择 **Automatically manage signing**
- 等待 2-5 分钟上传

### 7.2 验证上传

- 打开 https://appstoreconnect.apple.com
- **我的 App** → 选择"万年历"（如果还没创建，需要先创建）
- 等待 5-10 分钟，刷新页面
- **构建版本**处应出现 1.0.0 (1) 可选择

---

## 📝 阶段 8：填 App Store Connect 资料（30 分钟）

参考 [`docs/app-store-listing.md`](./app-store-listing.md)，下面是最简步骤：

### 8.1 创建应用

1. App Store Connect → 我的 App → **+** → **新建 App**
2. 平台：iOS
3. 名称：**万年历**
4. 主要语言：简体中文
5. Bundle ID：选 `com.wannianli.app`
6. SKU：`wannianli-001`（自定义）
7. 用户访问权限：完全访问

### 8.2 1.0 提交 → App 信息

| 字段 | 值 |
|---|---|
| 名称 | 万年历 |
| 副标题 | 公历农历老黄历三历合一 |
| 类别 | 工具 (主) / 效率 (次) |
| 内容分级 | 4+ |

### 8.3 价格与销售范围

- 价格：免费
- 销售范围：勾选（参考 iOS-4 上架地区文档）
  - 中国大陆
  - 中国香港 / 中国台湾
  - 美国
  - 新加坡 / 马来西亚
  - 加拿大 / 澳大利亚
  - 日本 / 韩国

### 8.4 App 隐私

- **问你或第三方合作伙伴会从此 App 收集数据吗？** → **否**
- 勾选 **Data Not Collected**

### 8.5 1.0 提交 → App 隐私政策

- 隐私政策 URL：`https://dist-ten-psi-35.vercel.app/privacy.html`

### 8.6 1.0 提交 → 支持

- 支持 URL：`https://dist-ten-psi-35.vercel.app/support.html`

### 8.7 1.0 提交 → 描述

参考 `app-store-listing.md` 完整文案，复制：

- **Promotional Text**（170 字内）
- **Description**（中文 + 英文）
- **Keywords**（100 字内）
- **Support URL**（已填）
- **Marketing URL**（可选，GitHub 仓库即可）

### 8.8 上传截图

- **3 套尺寸**（必填）：
  - 6.7" (iPhone 15 Pro Max) 1290×2796
  - 6.5" (iPhone 11 Pro Max) 1242×2688
  - 5.5" (iPhone 8 Plus) 1242×2208
- **每套 3-10 张**
- **来源**：
  - 用 `resources/screenshots-real/*.png` 作为真实界面截图
  - 用 `resources/screenshots-tpl/*.png` 作为品牌背景模板
  - 在 Figma 中叠加真实截图到模板上

### 8.9 推广文本 / 描述

复制 `app-store-listing.md` 中的内容。

### 8.10 App Icon

- 1024×1024 PNG
- 已在 Xcode 中设置
- 不需要在这里再次上传

### 8.11 版本发布

- 选择 **手动发布**（推荐首次）
- 审核通过后您手动点"发布"

---

## ✅ 阶段 9：提交审核（5 分钟）

### 9.1 选构建版本

- 滚动到 **构建版本**
- 点击 **+ 添加构建版本**
- 选刚才上传的 1.0.0 (1)
- 点击 **完成**

### 9.2 内容分级

回答问卷（参考 `app-store-listing.md`）：
- 暴力/色情/赌博/毒品等：全部 **否**
- 用户生成内容：否
- 预期分级：4+

### 9.3 提交

- 右上角 **添加以供审核** → **提交**

---

## ⏳ 阶段 10：等待审核（1-3 天）

### 10.1 监控状态

- App Store Connect → 活动 → 1.0 提交
- 状态变化：
  - **正在等待审核** → 排队中
  - **正在审核** → Apple 审核员在测
  - **已批准** → 可以发布
  - **被拒绝** → 需修改重新提交

### 10.2 常见被拒原因与修复

| 原因 | 修复 |
|---|---|
| 隐私政策无法访问 | 检查 Vercel URL 是否可访问 |
| 截图含手机壳 | 重新截图，纯设备框 |
| 应用崩溃 | 真机测试所有功能 |
| 缺少权限说明 | 我们的应用不需要任何 NS\*UsageDescription |
| 含宗教/政治内容 | 已优化（"禅意"非"佛教"） |

### 10.3 被拒时

1. App Store Connect → 拒绝信息（会邮件通知）
2. 阅读 Resolution Center 的具体问题
3. 修改后重新提交（**通常 1-2 天再批**）

---

## 🎉 阶段 11：发布

### 11.1 审核通过后

- 手动发布：App Store Connect → 选版本 → **发布**
- 自动发布：审核通过后自动上架

### 11.2 上架后检查

- [ ] App Store 搜索"万年历"能找到
- [ ] 下载安装正常
- [ ] 隐私政策/支持链接可点击
- [ ] 评分和评论可正常提交

---

## 🆘 故障排查

### Xcode 签名失败
- 检查 Team ID 是否正确
- 重新登录 Apple ID：Xcode → Settings → Accounts

### Build 失败：Capacitor not found
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

### 启动白屏
- 检查 dev server 是否在 3000 端口运行
- 检查 `capacitor.config.ts` 中 `server.url` 配置（应为空表示使用打包的 web 资源）

### 模拟器能跑，真机崩溃
- 检查 Info.plist 中 `NSAppTransportSecurity`（如果用了 HTTP）
- 检查 `PrivacyInfo.xcprivacy` 是否包含所有 API 类别

### 审核被拒
- 阅读 Resolution Center 完整说明
- 90% 情况是文档/截图问题，不是代码问题
- 修改后用 Resolution Center 回复，1-2 天再批

---

## 📊 时间估算

| 阶段 | 首次 | 后续更新 |
|---|---|---|
| 1-2 准备 | 30 分钟 | 5 分钟 |
| 3-4 Xcode 配置 | 30 分钟 | 0（保留） |
| 5 真机测试 | 30 分钟 | 15 分钟 |
| 6-7 Archive + 上传 | 15 分钟 | 5 分钟 |
| 8 填资料 | 30 分钟 | 10 分钟 |
| 9 提交 | 5 分钟 | 5 分钟 |
| 10 审核 | 1-3 天 | 1-2 天 |
| **总计（首次）** | **2.5 小时 + 审核** | **45 分钟 + 审核** |

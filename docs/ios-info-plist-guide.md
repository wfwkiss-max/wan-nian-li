# iOS Info.plist 权限说明

## 核心结论

本 App 完全离线，所有数据仅保存在设备本地（IndexedDB）。
- 不需要任何 NS*UsageDescription 字符串
- 不会触发系统权限弹窗
- App Privacy 标签勾选 Data Not Collected

## 必须保留的 Info.plist 键

| 键 | 必需 | 说明 |
|---|---|---|
| CFBundleDisplayName | 是 | 显示名称（万年历） |
| CFBundleIdentifier | 是 | 唯一标识（Xcode 中改 com.wannianli.app） |
| CFBundleShortVersionString | 是 | 版本号 1.0.0 |
| CFBundleVersion | 是 | 构建号 1 |
| UILaunchStoryboardName | 是 | 启动屏（Capacitor 默认 LaunchScreen） |
| UISupportedInterfaceOrientations | 是 | 支持方向（仅竖屏） |
| Capacitor | 是 | Capacitor 配置 |
| NSPrivacyAccessedAPITypes | 是 | iOS 14+ 隐私清单 |

## 可选项

- CFBundleURLTypes: URL Scheme 让浏览器可唤起 App（wannianli://）
- CFBundleLocalizations: 应用支持的语言（zh_CN, en）
- ITSAppUsesNonExemptEncryption: 声明无加密，免出口审查

## 完整 Info.plist 模板

cap add ios 之后此文件会自动生成在 ios/App/App/Info.plist。完全替换为下方内容。

## 部署步骤（Mac 上）

1. cap add ios 之后自动生成 ios/App/App/Info.plist
2. 完全替换为模板
3. 在 Xcode 中修改 CFBundleIdentifier、Display Name、Version、Build
4. 不需要添加任何 Capabilities
5. 真机测试通过后 Archive 上传

## 常见问题

### Q1: Capacitor 默认会生成哪些键？
A: Capacitor 字典 + CFBundleURLTypes + 基础 CFBundle 键。

### Q2: NSUserTrackingUsageDescription 需要吗？
A: 只有用了跟踪用户的 SDK 才需要。我们没用，不加。

### Q3: App Icons 在哪配？
A: 在 Xcode 的 Assets.xcassets/AppIcon.appiconset 中。Mac 上传 1024×1024 PNG 即可（已生成 resources/icon-1024.png）。

### Q4: 要不要添加 NSCameraUsageDescription 让用户能拍照？
A: 绝对不要。本 App 不需要相机，加了反而触发审核询问。

### Q5: 要不要 NSPhotoLibraryUsageDescription 备份功能？
A: 不要。我们的导出是 JSON 文件，不访问相册。导出用 iOS 系统分享面板。

### Q6: 要不要 ITSAppUsesNonExemptEncryption 声明？
A: 建议加（见模板末尾）。声明无加密可避免出口合规审查。

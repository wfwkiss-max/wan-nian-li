/**
 * 平台检测工具
 * 用于区分 Web 浏览器和 Capacitor 原生壳
 */

/**
 * 是否在 Capacitor 原生壳中运行
 * - true: iOS/Android App 内部
 * - false: 普通 Web 浏览器（含 PWA）
 */
export function isNativeApp(): boolean {
  // Capacitor 在原生壳中将 CapConfig 注入到 window 上
  if (typeof window === 'undefined') return false;
  // @ts-expect-error - Capacitor 注入的全局变量
  return !!window.Capacitor?.isNativePlatform?.();
}

/**
 * 是否在 iOS
 */
export function isIOS(): boolean {
  // @ts-expect-error
  return window.Capacitor?.getPlatform?.() === 'ios';
}

/**
 * 是否在 Android
 */
export function isAndroid(): boolean {
  // @ts-expect-error
  return window.Capacitor?.getPlatform?.() === 'android';
}

/**
 * 是否支持 PWA 安装
 * - iOS Safari: 部分支持
 * - Android Chrome: 完全支持
 * - Desktop Chrome/Edge: 完全支持
 */
export function canInstallPWA(): boolean {
  if (isNativeApp()) return false;
  // 简单判断：非 iOS Safari
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIPhoneSafari = /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
  return !isIPhoneSafari;
}

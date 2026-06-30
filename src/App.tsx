import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Capacitor } from '@capacitor/core';
import i18n from './i18n';
import { detectBrowserLanguage } from './i18n';
import { AppRouter } from './app/router';
import { useTheme } from './hooks/useTheme';
import { useSettingsStore } from './stores/settings-store';
import { useScheduleStore } from './stores/schedule-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30分钟
      retry: 2,
    },
  },
});

function App() {
  useTheme();
  useLanguageSync();
  useNativeSetup();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * 将 settings-store 中的 language 与 i18next 同步
 * - 'auto'：使用浏览器语言检测（中文→zh-CN，其他→en）
 * - 'zh-CN' | 'en'：强制使用指定语言
 */
function useLanguageSync() {
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    const target =
      language === 'auto' ? detectBrowserLanguage() : language;
    if (i18n.language !== target) {
      i18n.changeLanguage(target);
    }
  }, [language]);
}

/** 原生平台初始化 */
function useNativeSetup() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cancelled = false;
    const handles: Array<{ remove: () => void | Promise<void> }> = [];

    async function setup() {
      // 状态栏适配
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      if (cancelled) return;
      const isDark = document.documentElement.classList.contains('dark');
      await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({
          color: isDark ? '#0c1222' : '#f8fafd',
        });
      }

      // 隐藏 Splash Screen
      const { SplashScreen } = await import('@capacitor/splash-screen');
      if (cancelled) return;
      await SplashScreen.hide();

      // 键盘适配
      const { Keyboard } = await import('@capacitor/keyboard');
      if (cancelled) return;
      handles.push(await Keyboard.addListener('keyboardWillShow', (info) => {
        document.documentElement.style.setProperty(
          '--keyboard-height',
          `${info.keyboardHeight}px`
        );
      }));
      handles.push(await Keyboard.addListener('keyboardWillHide', () => {
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      }));

      // 处理 Android 返回键
      const { App: CapApp } = await import('@capacitor/app');
      if (cancelled) return;
      handles.push(await CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      }));

      // ============= 通知系统初始化 =============
      try {
        const { initNotifications, onNotificationTap, resyncAllNotifications } =
          await import('./services/notifications');
        const scheduleStore = useScheduleStore.getState();

        // 1) 初始化（请求权限 + 创建 channel + 注册 iOS actions）
        await initNotifications();

        // 2) 加载所有日程 + 重新同步通知
        await scheduleStore.loadAll();
        const all = useScheduleStore.getState().allSchedules;
        await resyncAllNotifications(all);

        // 3) App resume 时重新同步
        handles.push(await CapApp.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            useScheduleStore.getState().loadAll().then(() => {
              const fresh = useScheduleStore.getState().allSchedules;
              void resyncAllNotifications(fresh);
            });
          }
        }));

        // 4) 通知点击 → 跳转到对应日程
        const unsub = await onNotificationTap((scheduleId) => {
          useScheduleStore.getState().openScheduleById(scheduleId);
          // 跳到 Schedule 页面
          window.location.hash = '#/schedule';
        });
        handles.push({ remove: unsub });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[App] notification init failed:', err);
      }
    }

    setup();

    // 清理：移除所有监听器，防止 React 严格模式下重复注册
    return () => {
      cancelled = true;
      handles.forEach((h) => {
        void Promise.resolve(h.remove()).catch(() => {});
      });
    };
  }, []);
}

export default App;

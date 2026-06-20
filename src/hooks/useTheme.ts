import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settings-store';

/**
 * 根据当前小时判断是否应该使用深色主题
 * 白天 6:00 - 18:00 用浅色，其余时间用深色
 */
function isDarkByTime(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18;
}

/**
 * 计算到下一个切换时间点（6:00 或 18:00）的毫秒数
 */
function msUntilNextSwitch(): number {
  const now = new Date();
  const hour = now.getHours();
  const next = new Date(now);

  if (hour < 6) {
    next.setHours(6, 0, 0, 0);
  } else if (hour < 18) {
    next.setHours(18, 0, 0, 0);
  } else {
    // 已过18点，下一个切换点是明天6:00
    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
  }

  return next.getTime() - now.getTime();
}

/**
 * 根据系统偏好判断是否深色
 */
function isDarkBySystem(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 主题管理 Hook
 * 在 App 根组件中调用一次即可
 */
export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const uiTheme = useSettingsStore((s) => s.uiTheme);

  // 应用 UI 主题到根元素
  useEffect(() => {
    const html = document.documentElement;
    if (uiTheme && uiTheme !== 'classic') {
      html.setAttribute('data-ui-theme', uiTheme);
    } else {
      html.removeAttribute('data-ui-theme');
    }
  }, [uiTheme]);

  useEffect(() => {
    function applyTheme() {
      const html = document.documentElement;
      let dark = false;

      switch (theme) {
        case 'dark':
          dark = true;
          break;
        case 'light':
          dark = false;
          break;
        case 'system':
          dark = isDarkBySystem();
          break;
        case 'auto':
          dark = isDarkByTime();
          break;
      }

      if (dark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }

    // 立即应用
    applyTheme();

    // auto 模式：只在下一个切换时间点设置一次 setTimeout
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (theme === 'auto') {
      function scheduleNext() {
        const delay = msUntilNextSwitch();
        timer = setTimeout(() => {
          applyTheme();
          scheduleNext(); // 切换后再设置下一次
        }, delay);
      }
      scheduleNext();
    }

    // system 模式下监听系统主题变化
    let mediaQuery: MediaQueryList | null = null;
    if (theme === 'system') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (mediaQuery) mediaQuery.removeEventListener('change', applyTheme);
    };
  }, [theme]);
}

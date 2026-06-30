import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './i18n'; // 初始化 i18next
import { isNativeApp } from './utils/platform';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// PWA Service Worker 注册
// 仅在 Web 环境（非 Capacitor 原生壳）且为生产构建时注册，避免 iOS/Android WebView 出错
// dev 模式下 vite dev server 不会生成 /sw.js，注册会返回 index.html（text/html MIME）导致失败
if (!isNativeApp() && 'serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[PWA] Service Worker registered, scope:', reg.scope);
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
              console.log('[PWA] New content available, refresh to update.');
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

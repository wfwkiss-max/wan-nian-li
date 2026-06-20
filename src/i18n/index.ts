import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCommon from './locales/zh-CN/common.json';
import zhCalendar from './locales/zh-CN/calendar.json';
import zhSchedule from './locales/zh-CN/schedule.json';
import zhSettings from './locales/zh-CN/settings.json';
import zhAlmanac from './locales/zh-CN/almanac.json';
import zhTools from './locales/zh-CN/tools.json';

import enCommon from './locales/en/common.json';
import enCalendar from './locales/en/calendar.json';
import enSchedule from './locales/en/schedule.json';
import enSettings from './locales/en/settings.json';
import enAlmanac from './locales/en/almanac.json';
import enTools from './locales/en/tools.json';

export const SUPPORTED_LANGUAGES = ['zh-CN', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * 根据浏览器语言判断应使用哪种语言
 * 规则：中文区域（zh、zh-CN、zh-HK、zh-TW）→ zh-CN
 *      其他语言 → en
 */
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return 'zh-CN';
  const langs = navigator.languages ?? [navigator.language];
  for (const lang of langs) {
    if (lang.toLowerCase().startsWith('zh')) return 'zh-CN';
    if (lang.toLowerCase().startsWith('en')) return 'en';
  }
  return 'en';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        common: zhCommon,
        calendar: zhCalendar,
        schedule: zhSchedule,
        settings: zhSettings,
        almanac: zhAlmanac,
        tools: zhTools,
      },
      en: {
        common: enCommon,
        calendar: enCalendar,
        schedule: enSchedule,
        settings: enSettings,
        almanac: enAlmanac,
        tools: enTools,
      },
    },
    fallbackLng: 'zh-CN',
    supportedLngs: ['zh-CN', 'en'],
    ns: ['common', 'calendar', 'schedule', 'settings', 'almanac', 'tools'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'wannianli-lang',
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  });

export default i18n;

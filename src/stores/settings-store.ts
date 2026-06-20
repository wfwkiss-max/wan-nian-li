import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../core/types';

interface SettingsState extends AppSettings {
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      uiTheme: 'classic',
      fontSize: 'md',
      weekStart: 1,
      zodiacMode: 'newyear',
      defaultCalendar: 'solar',
      language: 'auto',
      weatherCity: undefined,
      weatherCityId: undefined,

      updateSettings: (partial) => set(partial),
    }),
    {
      name: 'wan-nian-li-settings',
    }
  )
);

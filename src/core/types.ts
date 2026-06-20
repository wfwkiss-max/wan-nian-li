/** 农历日期 */
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

/** 农历完整信息 */
export interface LunarInfo {
  lunarDate: LunarDate;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  zodiac: string;
  lunarMonthName: string;
  lunarDayName: string;
  solarTerm: string | null;
  festivals: string[];
  lunarFestivals: string[];
}

/** 黄历信息 */
export interface AlmanacInfo {
  yi: string[];
  ji: string[];
  chong: string;
  sha: string;
  jiShen: string[];
  xiongShen: string[];
  taiShen: string;
  wuXing: string;
  pengZu: string;
  jianChu: string;
}

/** 日程 */
export interface Schedule {
  id: string;
  title: string;
  date: string;
  lunarDate?: LunarDate;
  isLunar: boolean;
  time?: string;
  endTime?: string;
  location?: string;
  note?: string;
  repeat: RepeatType;
  reminder: ReminderConfig;
  type: ScheduleType;
  color?: string;
  completed?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ScheduleType = 'schedule' | 'anniversary' | 'birthday';

export interface ReminderConfig {
  enabled: boolean;
  advance: number;
  method: ReminderMethod[];
}

export type ReminderMethod = 'popup' | 'sound' | 'vibrate';

/** 天气 */
export interface WeatherInfo {
  city: string;
  temp: string;
  text: string;
  icon: string;
  humidity: string;
  windDir: string;
  windScale: string;
  updateTime: string;
}

/** 应用设置 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system' | 'auto';
  uiTheme: 'classic' | 'ios' | 'google' | 'island' | 'taiji' | 'buddhist';
  fontSize: 'sm' | 'md' | 'lg';
  weekStart: 0 | 1;
  zodiacMode: 'spring' | 'newyear';
  defaultCalendar: 'solar' | 'lunar';
  /** UI 语言。'auto' = 跟随浏览器语言，非中文时自动切到 en */
  language: 'auto' | 'zh-CN' | 'en';
  weatherCity?: string;
  weatherCityId?: string;
}

/** 一天的完整信息 */
export interface DayInfo {
  date: Date;
  solar: { year: number; month: number; day: number };
  lunar: LunarInfo;
  almanac: AlmanacInfo;
  isToday: boolean;
  isCurrentMonth: boolean;
  schedules: Schedule[];
  weather?: WeatherInfo;
}

/**
 * 节日数据模块
 */

/** 公历法定节假日 */
export const SOLAR_FESTIVALS: Record<string, string> = {
  '1-1': '元旦',
  '2-14': '情人节',
  '3-8': '妇女节',
  '3-12': '植树节',
  '4-1': '愚人节',
  '5-1': '劳动节',
  '5-4': '青年节',
  '6-1': '儿童节',
  '7-1': '建党节',
  '8-1': '建军节',
  '9-10': '教师节',
  '10-1': '国庆节',
  '10-31': '万圣节',
  '11-11': '双十一',
  '12-24': '平安夜',
  '12-25': '圣诞节',
};

/** 农历传统节日 */
export const LUNAR_FESTIVALS: Record<string, string> = {
  '1-1': '春节',
  '1-15': '元宵节',
  '2-2': '龙抬头',
  '5-5': '端午节',
  '7-7': '七夕',
  '7-15': '中元节',
  '8-15': '中秋节',
  '9-9': '重阳节',
  '10-1': '寒衣节',
  '10-15': '下元节',
  '12-8': '腊八节',
  '12-23': '小年',
  '12-30': '除夕',
};

/**
 * 中国法定节假日安排
 * 'holiday' = 放假, 'workday' = 调休补班
 * 
 * 数据按年度维护，覆盖 2024-2026 年
 * 格式: 'YYYY-MM-DD': 'holiday' | 'workday'
 */
export const CHINA_HOLIDAYS: Record<string, Record<string, 'holiday' | 'workday'>> = {
  '2024': {
    // 元旦
    '2024-01-01': 'holiday',
    // 春节
    '2024-02-10': 'holiday', '2024-02-11': 'holiday', '2024-02-12': 'holiday',
    '2024-02-13': 'holiday', '2024-02-14': 'holiday', '2024-02-15': 'holiday',
    '2024-02-16': 'holiday', '2024-02-17': 'holiday',
    '2024-02-04': 'workday', '2024-02-18': 'workday',
    // 清明
    '2024-04-04': 'holiday', '2024-04-05': 'holiday', '2024-04-06': 'holiday',
    '2024-04-07': 'workday',
    // 劳动节
    '2024-05-01': 'holiday', '2024-05-02': 'holiday', '2024-05-03': 'holiday',
    '2024-05-04': 'holiday', '2024-05-05': 'holiday',
    '2024-04-28': 'workday', '2024-05-11': 'workday',
    // 端午
    '2024-06-08': 'holiday', '2024-06-09': 'holiday', '2024-06-10': 'holiday',
    // 中秋
    '2024-09-15': 'holiday', '2024-09-16': 'holiday', '2024-09-17': 'holiday',
    '2024-09-14': 'workday',
    // 国庆
    '2024-10-01': 'holiday', '2024-10-02': 'holiday', '2024-10-03': 'holiday',
    '2024-10-04': 'holiday', '2024-10-05': 'holiday', '2024-10-06': 'holiday',
    '2024-10-07': 'holiday',
    '2024-09-29': 'workday', '2024-10-12': 'workday',
  },
  '2025': {
    // 元旦
    '2025-01-01': 'holiday',
    '2025-01-26': 'workday',
    // 春节
    '2025-01-28': 'holiday', '2025-01-29': 'holiday', '2025-01-30': 'holiday',
    '2025-01-31': 'holiday', '2025-02-01': 'holiday', '2025-02-02': 'holiday',
    '2025-02-03': 'holiday', '2025-02-04': 'holiday',
    '2025-02-08': 'workday',
    // 清明
    '2025-04-04': 'holiday', '2025-04-05': 'holiday', '2025-04-06': 'holiday',
    // 劳动节
    '2025-05-01': 'holiday', '2025-05-02': 'holiday', '2025-05-03': 'holiday',
    '2025-05-04': 'holiday', '2025-05-05': 'holiday',
    '2025-04-27': 'workday',
    // 端午
    '2025-05-31': 'holiday', '2025-06-01': 'holiday', '2025-06-02': 'holiday',
    // 中秋+国庆
    '2025-10-01': 'holiday', '2025-10-02': 'holiday', '2025-10-03': 'holiday',
    '2025-10-04': 'holiday', '2025-10-05': 'holiday', '2025-10-06': 'holiday',
    '2025-10-07': 'holiday', '2025-10-08': 'holiday',
    '2025-09-28': 'workday', '2025-10-11': 'workday',
  },
  '2026': {
    // 元旦
    '2026-01-01': 'holiday', '2026-01-02': 'holiday', '2026-01-03': 'holiday',
    // 春节
    '2026-02-17': 'holiday', '2026-02-18': 'holiday', '2026-02-19': 'holiday',
    '2026-02-20': 'holiday', '2026-02-21': 'holiday', '2026-02-22': 'holiday',
    '2026-02-23': 'holiday',
    '2026-02-14': 'workday', '2026-02-28': 'workday',
    // 清明
    '2026-04-05': 'holiday', '2026-04-06': 'holiday', '2026-04-07': 'holiday',
    // 劳动节
    '2026-05-01': 'holiday', '2026-05-02': 'holiday', '2026-05-03': 'holiday',
    '2026-05-04': 'holiday', '2026-05-05': 'holiday',
    '2026-04-26': 'workday', '2026-05-09': 'workday',
    // 端午
    '2026-06-19': 'holiday', '2026-06-20': 'holiday', '2026-06-21': 'holiday',
    // 中秋
    '2026-09-25': 'holiday', '2026-09-26': 'holiday', '2026-09-27': 'holiday',
    // 国庆
    '2026-10-01': 'holiday', '2026-10-02': 'holiday', '2026-10-03': 'holiday',
    '2026-10-04': 'holiday', '2026-10-05': 'holiday', '2026-10-06': 'holiday',
    '2026-10-07': 'holiday', '2026-10-08': 'holiday',
    '2026-09-28': 'workday', '2026-10-10': 'workday',
  },
};

/**
 * 获取某天的法定假日状态
 * @returns 'holiday' 放假 | 'workday' 调休补班 | null 正常
 */
export function getHolidayStatus(year: number, month: number, day: number): 'holiday' | 'workday' | null {
  const yearData = CHINA_HOLIDAYS[String(year)];
  if (!yearData) return null;
  const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return yearData[key] || null;
}

/**
 * 获取公历节日
 */
export function getSolarFestival(month: number, day: number): string | null {
  return SOLAR_FESTIVALS[`${month}-${day}`] || null;
}

/**
 * 获取农历节日
 */
export function getLunarFestival(month: number, day: number): string | null {
  return LUNAR_FESTIVALS[`${month}-${day}`] || null;
}

/**
 * 获取母亲节（5月第二个周日）
 */
export function getMothersDay(year: number): number {
  const may1 = new Date(year, 4, 1);
  const dayOfWeek = may1.getDay();
  return 1 + ((7 - dayOfWeek) % 7) + 7;
}

/**
 * 获取父亲节（6月第三个周日）
 */
export function getFathersDay(year: number): number {
  const june1 = new Date(year, 5, 1);
  const dayOfWeek = june1.getDay();
  return 1 + ((7 - dayOfWeek) % 7) + 14;
}

/**
 * 获取感恩节（11月第四个周四）
 */
export function getThanksgiving(year: number): number {
  const nov1 = new Date(year, 10, 1);
  const dayOfWeek = nov1.getDay();
  const firstThursday = 1 + ((4 - dayOfWeek + 7) % 7);
  return firstThursday + 21;
}

/**
 * 获取所有公历节日（包含动态节日）
 */
export function getAllSolarFestivals(year: number, month: number, day: number): string[] {
  const festivals: string[] = [];
  
  const staticFestival = getSolarFestival(month, day);
  if (staticFestival) festivals.push(staticFestival);
  
  // 动态节日检查
  if (month === 5 && day === getMothersDay(year)) {
    festivals.push('母亲节');
  }
  if (month === 6 && day === getFathersDay(year)) {
    festivals.push('父亲节');
  }
  if (month === 11 && day === getThanksgiving(year)) {
    festivals.push('感恩节');
  }
  
  return festivals;
}

import type { LunarDate } from '../types';
import { LUNAR_INFO, getLeapMonth, getLeapDays, getLunarYearDays, getLunarMonthDays } from './lunar-data';

/**
 * 基准日期：1900年1月31日 = 农历庚子年正月初一
 */
const BASE_DATE = new Date(1900, 0, 31);

/**
 * 公历转农历
 */
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  if (year < 1900 || year > 2100) {
    throw new Error('年份超出范围 (1900-2100)');
  }

  const target = new Date(year, month - 1, day);
  // 计算与基准日期的天数差
  let offset = Math.floor((target.getTime() - BASE_DATE.getTime()) / 86400000);

  // 逐年减去天数，确定农历年
  let lunarYear = 1900;
  let yearDays: number;
  for (let i = 1900; i < 2101 && offset > 0; i++) {
    yearDays = getLunarYearDays(i);
    offset -= yearDays;
    lunarYear++;
  }
  if (offset < 0) {
    lunarYear--;
    offset += getLunarYearDays(lunarYear);
  }

  // 确定闰月
  const leapMonth = getLeapMonth(lunarYear);
  let isLeap = false;

  // 逐月减去天数，确定农历月日
  let lunarMonth = 1;
  let monthDays: number;
  for (let i = 1; i < 13 && offset > 0; i++) {
    // 如果有闰月且到了闰月
    if (leapMonth > 0 && i === leapMonth + 1 && !isLeap) {
      --i;
      isLeap = true;
      monthDays = getLeapDays(lunarYear);
    } else {
      monthDays = getLunarMonthDays(lunarYear, i);
    }
    
    // 如果正在处理闰月，处理完后恢复
    if (isLeap && i === leapMonth + 1) {
      isLeap = false;
    }

    offset -= monthDays;
    if (!isLeap) lunarMonth++;
  }

  // 如果 offset 为负或刚好为0
  if (offset < 0) {
    offset += monthDays!;
    lunarMonth--;
  }

  // 确定是否是闰月
  const isLeapMonth = leapMonth > 0 && lunarMonth === leapMonth + 1;
  const actualMonth = isLeapMonth ? lunarMonth - 1 : lunarMonth;

  return {
    year: lunarYear,
    month: actualMonth,
    day: offset + 1,
    isLeap: isLeapMonth,
  };
}

/**
 * 农历转公历
 */
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap = false): Date {
  if (lunarYear < 1900 || lunarYear > 2100) {
    throw new Error('年份超出范围 (1900-2100)');
  }

  const leapMonth = getLeapMonth(lunarYear);

  // 如果指定了闰月但该年没有闰月或闰月不对应
  if (isLeap && leapMonth !== lunarMonth) {
    throw new Error(`${lunarYear}年没有闰${lunarMonth}月`);
  }

  // 计算从 1900年正月初一 到目标日期的天数
  let offset = 0;

  // 加上 1900 到 lunarYear-1 年的天数
  for (let i = 1900; i < lunarYear; i++) {
    offset += getLunarYearDays(i);
  }

  // 加上 lunarYear 年内的月天数
  for (let i = 1; i < lunarMonth; i++) {
    offset += getLunarMonthDays(lunarYear, i);
    // 如果该年闰月在此月之前或就是此月
    if (leapMonth > 0 && i === leapMonth) {
      offset += getLeapDays(lunarYear);
    }
  }

  // 如果是闰月，还要加上本月正常月的天数
  if (isLeap) {
    offset += getLunarMonthDays(lunarYear, lunarMonth);
  }

  // 加上日（offset 从初一开始算 0 天偏移）
  offset += lunarDay - 1;

  return new Date(1900, 0, 31 + offset);
}

/**
 * 获取指定农历年有多少个月（含闰月）
 */
export function getLunarMonthCount(year: number): number {
  return getLeapMonth(year) > 0 ? 13 : 12;
}

/**
 * 验证农历日期是否合法
 */
export function isValidLunarDate(year: number, month: number, day: number, isLeap = false): boolean {
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  
  const leapMonth = getLeapMonth(year);
  
  if (isLeap) {
    if (leapMonth !== month) return false;
    const leapDays = getLeapDays(year);
    return day >= 1 && day <= leapDays;
  }
  
  const monthDays = getLunarMonthDays(year, month);
  return day >= 1 && day <= monthDays;
}

export { getLeapMonth, getLeapDays, getLunarYearDays, getLunarMonthDays, LUNAR_INFO };

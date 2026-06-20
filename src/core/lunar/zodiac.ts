/**
 * 生肖计算模块
 */
import { ZODIAC } from '../../utils/constants';
import { getCachedYearSolarTerms } from './solar-terms';

/**
 * 获取年份对应的生肖（以农历正月初一为界）
 */
export function getZodiac(lunarYear: number): string {
  return ZODIAC[(lunarYear - 4) % 12]!;
}

/**
 * 获取年份对应的生肖（以立春为界）
 * 部分传统以立春为生肖更替点
 */
export function getZodiacByLichun(year: number, month: number, day: number): string {
  const solarTerms = getCachedYearSolarTerms(year);
  const lichun = solarTerms[2]!; // 立春

  let effectiveYear = year;
  if (month < lichun.getMonth() + 1 || 
      (month === lichun.getMonth() + 1 && day < lichun.getDate())) {
    effectiveYear = year - 1;
  }

  return ZODIAC[(effectiveYear - 4) % 12]!;
}

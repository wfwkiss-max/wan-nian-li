/**
 * 农历核心模块统一导出
 */
export { solarToLunar, lunarToSolar, isValidLunarDate, getLunarMonthCount } from './lunar-converter';
export { getLeapMonth, getLeapDays, getLunarYearDays, getLunarMonthDays } from './lunar-data';
export { getSolarTermDate, getSolarTermForDate, getYearSolarTerms, getCachedYearSolarTerms } from './solar-terms';
export { getYearGanZhi, getMonthGanZhi, getDayGanZhi, getDayGanZhiIndex, getDayGanIndex, getDayZhiIndex, getGanZhiFromIndex } from './heavenly-earthly';
export { getZodiac, getZodiacByLichun } from './zodiac';
export { getSolarFestival, getLunarFestival, getAllSolarFestivals, getHolidayStatus } from './festivals';

import type { LunarInfo } from '../types';
import { solarToLunar } from './lunar-converter';
import { getSolarTermForDate } from './solar-terms';
import { getYearGanZhi, getMonthGanZhi, getDayGanZhi } from './heavenly-earthly';
import { getZodiac } from './zodiac';
import { getAllSolarFestivals, getLunarFestival } from './festivals';
import { LUNAR_MONTH_NAMES, LUNAR_DAY_NAMES } from '../../utils/constants';

/**
 * 获取指定日期的完整农历信息
 */
export function getFullLunarInfo(year: number, month: number, day: number): LunarInfo {
  const lunarDate = solarToLunar(year, month, day);
  
  const yearGanZhi = getYearGanZhi(year, month, day);
  const monthGanZhi = getMonthGanZhi(year, month, day);
  const dayGanZhi = getDayGanZhi(year, month, day);
  const zodiac = getZodiac(lunarDate.year);
  
  const lunarMonthName = (lunarDate.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[lunarDate.month - 1]! + '月';
  const lunarDayName = LUNAR_DAY_NAMES[lunarDate.day - 1]!;
  
  const solarTerm = getSolarTermForDate(year, month, day);
  const festivals = getAllSolarFestivals(year, month, day);
  
  const lunarFestival = getLunarFestival(lunarDate.month, lunarDate.day);
  const lunarFestivals = lunarFestival ? [lunarFestival] : [];
  
  return {
    lunarDate,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    zodiac,
    lunarMonthName,
    lunarDayName,
    solarTerm,
    festivals,
    lunarFestivals,
  };
}

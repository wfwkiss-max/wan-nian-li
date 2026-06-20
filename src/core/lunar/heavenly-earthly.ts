/**
 * 天干地支计算模块
 */
import { TIAN_GAN, DI_ZHI } from '../../utils/constants';
import { getCachedYearSolarTerms } from './solar-terms';

/**
 * 获取干支组合字符串
 */
export function getGanZhi(ganIndex: number, zhiIndex: number): string {
  return TIAN_GAN[ganIndex % 10]! + DI_ZHI[zhiIndex % 12]!;
}

/**
 * 获取六十甲子序号 (0-59)
 */
export function getSixtyIndex(ganIndex: number, zhiIndex: number): number {
  // 天干序号 0-9，地支序号 0-11
  // 六十甲子循环
  for (let i = 0; i < 60; i++) {
    if (i % 10 === ganIndex && i % 12 === zhiIndex) return i;
  }
  return 0;
}

/**
 * 从六十甲子序号获取干支
 */
export function getGanZhiFromIndex(index: number): string {
  return TIAN_GAN[index % 10]! + DI_ZHI[index % 12]!;
}

/**
 * 年干支
 * 以立春为界划分年干支
 * @param year 公历年
 * @param month 公历月
 * @param day 公历日
 */
export function getYearGanZhi(year: number, month: number, day: number): string {
  // 判断是否在立春之前
  const solarTerms = getCachedYearSolarTerms(year);
  const lichun = solarTerms[2]!; // 立春是第3个节气（index 2）

  let effectiveYear = year;
  if (month < lichun.getMonth() + 1 || 
      (month === lichun.getMonth() + 1 && day < lichun.getDate())) {
    effectiveYear = year - 1;
  }

  const ganIndex = (effectiveYear - 4) % 10;
  const zhiIndex = (effectiveYear - 4) % 12;
  return getGanZhi(ganIndex, zhiIndex);
}

/**
 * 月干支
 * 以节气为界（非中气），每月从"节"开始
 * 正月建寅
 */
export function getMonthGanZhi(year: number, month: number, day: number): string {
  // 获取当年节气
  const solarTerms = getCachedYearSolarTerms(year);
  
  // 确定所在的月建
  // 节气序号：0小寒 1大寒 2立春 3雨水 4惊蛰 5春分...
  // "节"是偶数序号：0小寒 2立春 4惊蛰 6清明 8立夏 10芒种 12小暑 14立秋 16白露 18寒露 20立冬 22大雪
  let monthZhiIndex: number;
  
  // 从大雪往后检查，确定当前日期属于哪个月
  // 月建对照：寅月(立春起) 卯月(惊蛰起) 辰月(清明起)...
  const jieQiIndices = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 0]; // 立春到大雪的"节"序号
  const zhiIndices = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 对应地支：寅卯辰巳午未申酉戌亥子丑
  
  const currentDate = new Date(year, month - 1, day);
  monthZhiIndex = 1; // 默认丑月
  
  for (let i = 11; i >= 0; i--) {
    const jieIndex = jieQiIndices[i]!;
    // 小寒(0)在1月，需要特殊处理
    if (jieIndex === 0 && i === 11) {
      // 大雪之后、下年小寒之前 = 子月
      const daxue = solarTerms[22]!;
      if (currentDate >= daxue) {
        monthZhiIndex = 0; // 子月
        break;
      }
    }
    
    const jie = solarTerms[jieIndex]!;
    if (currentDate >= jie) {
      monthZhiIndex = zhiIndices[i]!;
      break;
    }
  }
  
  // 月干 = 年干 * 2 + 月地支偏移
  const yearGan = getYearGanIndex(year, month, day);
  // 甲己之年丙作首（寅月为丙寅）
  const monthGanBase = (yearGan % 5) * 2 + 2;
  const monthOffset = (monthZhiIndex - 2 + 12) % 12;
  const monthGanIndex = (monthGanBase + monthOffset) % 10;
  
  return TIAN_GAN[monthGanIndex]! + DI_ZHI[monthZhiIndex]!;
}

/**
 * 获取年干的序号
 */
function getYearGanIndex(year: number, month: number, day: number): number {
  const solarTerms = getCachedYearSolarTerms(year);
  const lichun = solarTerms[2]!;
  let effectiveYear = year;
  if (month < lichun.getMonth() + 1 || 
      (month === lichun.getMonth() + 1 && day < lichun.getDate())) {
    effectiveYear = year - 1;
  }
  return (effectiveYear - 4) % 10;
}

/**
 * 日干支
 * 基于已知基准日推算
 * 基准：1900年1月1日 = 甲戌日 (index=10)
 */
export function getDayGanZhi(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  
  // 1900年1月1日是甲戌日，六十甲子序号为10
  const index = ((diffDays % 60) + 10 + 60) % 60;
  return getGanZhiFromIndex(index);
}

/**
 * 获取日干支的六十甲子序号
 */
export function getDayGanZhiIndex(year: number, month: number, day: number): number {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  return ((diffDays % 60) + 10 + 60) % 60;
}

/**
 * 获取日干支的天干序号
 */
export function getDayGanIndex(year: number, month: number, day: number): number {
  return getDayGanZhiIndex(year, month, day) % 10;
}

/**
 * 获取日干支的地支序号
 */
export function getDayZhiIndex(year: number, month: number, day: number): number {
  return getDayGanZhiIndex(year, month, day) % 12;
}

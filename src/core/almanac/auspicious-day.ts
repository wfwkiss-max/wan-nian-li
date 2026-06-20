/**
 * 吉日筛选模块
 */

import { getAlmanacInfo } from './almanac-engine';

export interface AuspiciousDayResult {
  date: Date;
  year: number;
  month: number;
  day: number;
  yi: string[];
  ji: string[];
  jianChu: string;
  jiShenCount: number;
}

/**
 * 在指定范围内查找适合某事项的吉日
 * @param event 事项名称（如"嫁娶"、"搬家"等）
 * @param startDate 起始日期
 * @param endDate 结束日期
 * @returns 符合条件的日期列表，按吉利程度排序
 */
export function findAuspiciousDays(
  event: string,
  startDate: Date,
  endDate: Date
): AuspiciousDayResult[] {
  const results: AuspiciousDayResult[] = [];
  
  const current = new Date(startDate);
  while (current <= endDate) {
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    const d = current.getDate();
    
    const almanac = getAlmanacInfo(y, m, d);
    
    // 检查宜中是否包含该事项（模糊匹配）
    const isYi = almanac.yi.some((item) => item.includes(event) || event.includes(item));
    // 检查忌中是否包含该事项
    const isJi = almanac.ji.some((item) => item.includes(event) || event.includes(item));
    
    if (isYi && !isJi) {
      results.push({
        date: new Date(current),
        year: y,
        month: m,
        day: d,
        yi: almanac.yi,
        ji: almanac.ji,
        jianChu: almanac.jianChu,
        jiShenCount: almanac.jiShen.length,
      });
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  // 按吉神数量降序排列
  results.sort((a, b) => b.jiShenCount - a.jiShenCount);
  
  return results;
}

/** 常见可查询事项 */
export const COMMON_EVENTS = [
  '嫁娶', '结婚', '搬家', '入宅', '移徙',
  '开市', '开业', '动土', '修造', '装修',
  '出行', '旅游', '安床', '祭祀', '祈福',
  '签约', '交易', '求财', '上任',
] as const;

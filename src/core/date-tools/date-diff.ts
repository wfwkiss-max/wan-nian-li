/**
 * 日期差计算模块
 */

/**
 * 计算两个日期之间的天数差
 */
export function diffDays(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

/**
 * 计算两个日期之间的工作日数（排除周六日）
 */
export function diffWorkDays(date1: Date, date2: Date): number {
  let start = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const end = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  if (start > end) {
    [start] = [end];
  }
  
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * 日期推算模块
 */

/**
 * 日期加减天数
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 日期加减工作日
 */
export function addWorkDays(date: Date, workDays: number): Date {
  const result = new Date(date);
  let remaining = Math.abs(workDays);
  const direction = workDays >= 0 ? 1 : -1;
  
  while (remaining > 0) {
    result.setDate(result.getDate() + direction);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) {
      remaining--;
    }
  }
  
  return result;
}

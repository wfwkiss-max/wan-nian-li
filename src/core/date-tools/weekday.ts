/**
 * 星期查询模块
 */

const WEEKDAY_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] as const;

/**
 * 获取指定日期是星期几（中文）
 */
export function getWeekdayCN(date: Date): string {
  return WEEKDAY_CN[date.getDay()]!;
}

/**
 * 获取指定日期是星期几（数字 0-6）
 */
export function getWeekday(date: Date): number {
  return date.getDay();
}

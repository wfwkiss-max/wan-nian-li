/**
 * 黄历计算引擎
 * 
 * 将干支历法规则转化为每日宜忌/吉凶输出
 */

import type { AlmanacInfo } from '../types';
import { getDayGanIndex, getDayZhiIndex, getDayGanZhiIndex } from '../lunar/heavenly-earthly';
import { solarToLunar } from '../lunar/lunar-converter';
import { TAI_SHEN, NA_YIN, PENG_ZU_GAN, PENG_ZU_ZHI } from '../../utils/constants';
import {
  getJianChu,
  getChong,
  getSha,
  getJiShen,
  getXiongShen,
  getMonthZhiIndex,
  JIAN_CHU_YI,
  JIAN_CHU_JI,
} from './almanac-data';

/**
 * 获取指定日期的完整黄历信息
 */
export function getAlmanacInfo(year: number, month: number, day: number): AlmanacInfo {
  const dayGanIndex = getDayGanIndex(year, month, day);
  const dayZhiIndex = getDayZhiIndex(year, month, day);
  const dayGanZhiIndex = getDayGanZhiIndex(year, month, day);
  
  // 获取农历月份，用于确定月建
  const lunarDate = solarToLunar(year, month, day);
  const monthZhiIndex = getMonthZhiIndex(lunarDate.month);
  
  // 建除十二神
  const jianChu = getJianChu(monthZhiIndex, dayZhiIndex);
  
  // 宜忌
  const yi = JIAN_CHU_YI[jianChu] || [];
  const ji = JIAN_CHU_JI[jianChu] || [];
  
  // 冲煞
  const chongInfo = getChong(dayZhiIndex);
  const chong = `冲${chongInfo.zhi}(${chongInfo.animal})`;
  const sha = `煞${getSha(dayZhiIndex)}`;
  
  // 吉神凶神
  const jiShen = getJiShen(dayGanIndex, dayZhiIndex, monthZhiIndex);
  const xiongShen = getXiongShen(dayGanIndex, dayZhiIndex, monthZhiIndex);
  
  // 胎神
  const taiShen = TAI_SHEN[dayGanZhiIndex % 60]!;
  
  // 五行（纳音）
  const wuXing = NA_YIN[Math.floor(dayGanZhiIndex / 2) % 30]!;
  
  // 彭祖百忌
  const pengZu = PENG_ZU_GAN[dayGanIndex]! + ' ' + PENG_ZU_ZHI[dayZhiIndex]!;
  
  return {
    yi,
    ji,
    chong,
    sha,
    jiShen,
    xiongShen,
    taiShen,
    wuXing,
    pengZu,
    jianChu,
  };
}

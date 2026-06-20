/**
 * 黄历数据模块
 * 
 * 基于建除十二神和干支历法的确定性规则
 */

import { JIAN_CHU_NAMES } from '../../utils/constants';

/** 建除十二神对应的宜事项 */
export const JIAN_CHU_YI: Record<string, string[]> = {
  '建': ['出行', '动土', '开市', '交易', '立券'],
  '除': ['祭祀', '祈福', '婚姻', '出行', '入宅', '移徙', '解除'],
  '满': ['祭祀', '祈福', '结婚', '开光', '出行', '开市'],
  '平': ['修饰', '涂泥', '裁衣', '修造'],
  '定': ['祭祀', '祈福', '嫁娶', '造屋', '装修', '开市', '入学'],
  '执': ['祭祀', '祈福', '捕捉', '结网'],
  '破': ['破屋', '拆卸', '求医'],
  '危': ['祭祀', '祈福', '安床', '入宅', '修造'],
  '成': ['祭祀', '祈福', '嫁娶', '开市', '修造', '动土', '安床', '入宅', '上任'],
  '收': ['祭祀', '求财', '签约', '嫁娶', '入宅'],
  '开': ['祭祀', '祈福', '开光', '开市', '嫁娶', '动土', '安床'],
  '闭': ['祭祀', '修墓', '安葬', '取鱼'],
};

/** 建除十二神对应的忌事项 */
export const JIAN_CHU_JI: Record<string, string[]> = {
  '建': ['安葬', '动土'],
  '除': ['动土', '安葬', '开仓'],
  '满': ['安葬', '动土'],
  '平': ['祈福', '求嗣', '嫁娶', '开市', '安葬'],
  '定': ['诉讼', '出行', '动土'],
  '执': ['开市', '交易', '搬家', '远行'],
  '破': ['嫁娶', '开市', '交易', '祭祀', '出行'],
  '危': ['出行', '登高', '动土'],
  '成': ['诉讼', '安葬'],
  '收': ['动土', '开市', '安葬'],
  '开': ['安葬', '破土'],
  '闭': ['开市', '出行', '嫁娶', '动土', '求医'],
};

/**
 * 计算建除十二神
 * 建除以月建（地支）为基准
 * 月建寅月为建，卯为除...
 * 日地支与月建的关系确定十二神
 */
export function getJianChu(monthZhiIndex: number, dayZhiIndex: number): string {
  // 月建地支开始为"建"，之后依次为除满平定执破危成收开闭
  const offset = (dayZhiIndex - monthZhiIndex + 12) % 12;
  return JIAN_CHU_NAMES[offset]!;
}

/**
 * 获取冲
 * 日支 +6 为冲
 */
export function getChong(dayZhiIndex: number): { zhi: string; animal: string } {
  const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const chongIndex = (dayZhiIndex + 6) % 12;
  return {
    zhi: DI_ZHI[chongIndex]!,
    animal: ANIMALS[chongIndex]!,
  };
}

/**
 * 获取煞方
 */
export function getSha(dayZhiIndex: number): string {
  const shaMap = ['南', '东', '北', '西'];
  return shaMap[dayZhiIndex % 4]!;
}

/**
 * 吉神判定规则（简化版，覆盖常见吉神）
 */
export function getJiShen(dayGanIndex: number, dayZhiIndex: number, monthZhiIndex: number): string[] {
  const result: string[] = [];

  // 天德：月支对应天干
  const tianDeMap = [9, 0, 7, 1, 8, 2, 7, 3, 8, 4, 9, 5]; // 按月支序号
  if (dayGanIndex === tianDeMap[monthZhiIndex]) {
    result.push('天德');
  }

  // 月德：寅午戌月丙，申子辰月壬，亥卯未月甲，巳酉丑月庚
  const yueDeMap: Record<number, number> = {
    2: 2, 6: 2, 10: 2,  // 寅午戌月 -> 丙(2)
    8: 8, 0: 8, 4: 8,   // 申子辰月 -> 壬(8)
    11: 0, 3: 0, 7: 0,  // 亥卯未月 -> 甲(0)
    5: 6, 9: 6, 1: 6,   // 巳酉丑月 -> 庚(6)
  };
  if (yueDeMap[monthZhiIndex] === dayGanIndex) {
    result.push('月德');
  }

  // 天恩：固定甲子、乙丑等日
  const tianEnDays = [0, 1, 2, 3, 4, 15, 16, 17, 18, 19, 30, 31, 32, 33, 34, 45, 46, 47, 48, 49];
  const sixtyIndex = dayGanIndex + dayZhiIndex * 5; // simplified
  if (tianEnDays.includes(sixtyIndex % 60)) {
    result.push('天恩');
  }

  // 四相/时德 (简化)
  if ((monthZhiIndex % 3 === 0 && dayGanIndex % 2 === 0) || 
      (monthZhiIndex % 3 === 1 && dayGanIndex % 2 === 1)) {
    result.push('四相');
  }

  return result;
}

/**
 * 凶神判定规则（简化版）
 */
export function getXiongShen(dayGanIndex: number, dayZhiIndex: number, monthZhiIndex: number): string[] {
  const result: string[] = [];

  // 天刑：月支+7=日支
  if ((monthZhiIndex + 7) % 12 === dayZhiIndex) {
    result.push('天刑');
  }

  // 白虎：由建除推算，执日后第二天
  // 简化：日支与月建差为8
  if ((dayZhiIndex - monthZhiIndex + 12) % 12 === 8) {
    result.push('白虎');
  }

  // 朱雀：日支与月建差为10
  if ((dayZhiIndex - monthZhiIndex + 12) % 12 === 10) {
    result.push('朱雀');
  }

  // 勾陈
  if ((dayZhiIndex - monthZhiIndex + 12) % 12 === 4) {
    result.push('勾陈');
  }

  // 五鬼
  const wuGuiMap: Record<number, number> = { 0: 10, 1: 11, 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7 };
  if (wuGuiMap[dayGanIndex] === dayZhiIndex) {
    result.push('五鬼');
  }

  return result;
}

/** 获取月建地支序号（以节气划分月份） */
export function getMonthZhiIndex(month: number): number {
  // 正月建寅(2), 二月建卯(3)...
  return (month + 1) % 12;
}

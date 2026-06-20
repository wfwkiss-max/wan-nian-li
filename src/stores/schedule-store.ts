import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { db } from './db';
import type { Schedule } from '../core/types';

/** 某天的日程颜色点信息 */
export interface DayDot {
  color: string;
  completed: boolean;
}

/** 月度日程点数据: dateStr -> DayDot[] */
export type MonthDotsMap = Record<string, DayDot[]>;

interface ScheduleState {
  daySchedules: Schedule[];
  allSchedules: Schedule[];
  /** 当前月份的日程点数据 */
  monthDots: MonthDotsMap;
  loadByDate: (dateStr: string) => Promise<void>;
  loadAll: () => Promise<void>;
  /** 加载某月所有日程点 */
  loadMonthDots: (year: number, month: number) => Promise<void>;
  addSchedule: (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  /** 切换日程完成状态 */
  toggleComplete: (id: string) => Promise<void>;
}

function sortSchedules(list: Schedule[]) {
  list.sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return a.createdAt - b.createdAt;
  });
  return list;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  daySchedules: [],
  allSchedules: [],
  monthDots: {},

  loadByDate: async (dateStr) => {
    const list = await db.schedules.where('date').equals(dateStr).toArray();
    set({ daySchedules: sortSchedules(list) });
  },

  loadAll: async () => {
    const list = await db.schedules.orderBy('date').toArray();
    set({ allSchedules: list });
  },

  loadMonthDots: async (year, month) => {
    const startStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const endStr = `${year}-${String(month).padStart(2, '0')}-31`;
    const list = await db.schedules
      .where('date')
      .between(startStr, endStr, true, true)
      .toArray();

    const dotsMap: MonthDotsMap = {};
    for (const s of list) {
      if (!dotsMap[s.date]) dotsMap[s.date] = [];
      const color = s.color || '#4f7df5';
      const completed = !!s.completed;
      const dots = dotsMap[s.date]!;
      // 去重：相同颜色+相同完成状态只保留一个点
      const exists = dots.some(
        (d) => d.color === color && d.completed === completed
      );
      if (!exists) {
        dots.push({ color, completed });
      }
    }
    set({ monthDots: dotsMap });
  },

  addSchedule: async (data) => {
    const now = Date.now();
    const schedule: Schedule = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    await db.schedules.add(schedule);
    const list = await db.schedules.where('date').equals(data.date).toArray();
    set({ daySchedules: sortSchedules(list) });
    // 刷新月度点
    const d = new Date(data.date);
    get().loadMonthDots(d.getFullYear(), d.getMonth() + 1);
  },

  deleteSchedule: async (id) => {
    const item = await db.schedules.get(id);
    await db.schedules.delete(id);
    if (item) {
      const list = await db.schedules.where('date').equals(item.date).toArray();
      set({ daySchedules: sortSchedules(list) });
      const d = new Date(item.date);
      get().loadMonthDots(d.getFullYear(), d.getMonth() + 1);
    }
  },

  toggleComplete: async (id) => {
    const item = await db.schedules.get(id);
    if (!item) return;
    const updated = !item.completed;
    await db.schedules.update(id, { completed: updated, updatedAt: Date.now() });
    // 刷新当天列表
    const list = await db.schedules.where('date').equals(item.date).toArray();
    set({ daySchedules: sortSchedules(list) });
    // 刷新月度点
    const d = new Date(item.date);
    get().loadMonthDots(d.getFullYear(), d.getMonth() + 1);
  },
}));

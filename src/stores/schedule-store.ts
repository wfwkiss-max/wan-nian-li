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
  /** 通知点击时希望打开的日程 ID（SchedulePage 监听） */
  targetScheduleId: string | null;
  loadByDate: (dateStr: string) => Promise<void>;
  loadAll: () => Promise<void>;
  /** 加载某月所有日程点 */
  loadMonthDots: (year: number, month: number) => Promise<void>;
  addSchedule: (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Schedule>;
  updateSchedule: (id: string, data: Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  /** 切换日程完成状态 */
  toggleComplete: (id: string) => Promise<void>;
  /** 重新同步所有日程到本地通知（App 启动/resume 时调用） */
  resyncNotifications: () => Promise<void>;
  /** 由通知点击触发，SchedulePage 监听后跳到详情 */
  openScheduleById: (id: string) => void;
  clearTargetSchedule: () => void;
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

/**
 * 通知调度钩子（动态 import 避免 Web 端构建依赖原生插件）
 */
async function notifyScheduleFor(s: Schedule) {
  try {
    const { scheduleForSchedule } = await import('../services/notifications');
    await scheduleForSchedule(s);
  } catch {
    // 通知服务不可用时静默（Web 端无影响）
  }
}

async function notifyCancelFor(s: Schedule) {
  try {
    const { cancelForSchedule } = await import('../services/notifications');
    await cancelForSchedule(s);
  } catch {
    // ignore
  }
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  daySchedules: [],
  allSchedules: [],
  monthDots: {},
  targetScheduleId: null,

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
    // 通知调度
    await notifyScheduleFor(schedule);
    return schedule;
  },

  updateSchedule: async (id, data) => {
    const item = await db.schedules.get(id);
    if (!item) return;
    const previousDate = item.date;
    const updated: Schedule = {
      ...item,
      ...data,
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: Date.now(),
    };
    await db.schedules.put(updated);
    // 刷新列表（如果日期变了需要刷新两边）
    const newDate = updated.date;
    if (newDate === previousDate) {
      const list = await db.schedules.where('date').equals(newDate).toArray();
      set({ daySchedules: sortSchedules(list) });
    } else {
      const prevList = await db.schedules.where('date').equals(previousDate).toArray();
      const newList = await db.schedules.where('date').equals(newDate).toArray();
      set({ daySchedules: sortSchedules(newList) });
      void prevList;
    }
    // 刷新月度点（新旧月都可能影响）
    const d1 = new Date(previousDate);
    const d2 = new Date(newDate);
    get().loadMonthDots(d1.getFullYear(), d1.getMonth() + 1);
    if (d1.getFullYear() !== d2.getFullYear() || d1.getMonth() !== d2.getMonth()) {
      get().loadMonthDots(d2.getFullYear(), d2.getMonth() + 1);
    }
    // 通知：先取消旧的，再调度新的
    await notifyCancelFor(item);
    await notifyScheduleFor(updated);
  },

  deleteSchedule: async (id) => {
    const item = await db.schedules.get(id);
    if (item) {
      await notifyCancelFor(item);
    }
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
    // 通知：标记完成时取消该日程的所有提醒
    if (updated) {
      await notifyCancelFor({ ...item, completed: true });
    } else {
      // 取消完成时重新调度
      await notifyScheduleFor({ ...item, completed: false });
    }
  },

  resyncNotifications: async () => {
    try {
      const { resyncAllNotifications } = await import('../services/notifications');
      const all = get().allSchedules;
      await resyncAllNotifications(all);
    } catch {
      // ignore
    }
  },

  openScheduleById: (id) => {
    set({ targetScheduleId: id });
  },

  clearTargetSchedule: () => {
    set({ targetScheduleId: null });
  },
}));

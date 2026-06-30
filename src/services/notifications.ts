/**
 * 本地通知服务（iOS / Android 双端）
 *
 * 核心能力：
 * - initNotifications：启动时调用一次（请求权限、创建 Android channel、注册 iOS actions）
 * - scheduleForSchedule：为单个日程调度提醒
 * - cancelForSchedule：取消单个日程的所有通知
 * - resyncAllNotifications：App 启动/恢复时重置所有未来要响的提醒
 * - onNotificationTap：监听用户点击通知，跳转到对应日程详情
 *
 * 平台差异：
 * - iOS：daily 用 `every: 'day' + repeats: true`；其他 repeat / 普通 用一次性 `at`
 * - Android：所有通知一律一次性 `at`，依赖 App resume 重新调度
 *
 * ID 映射：schedule.id（string）→ hashStringToInt(int32)
 */

import { Capacitor } from '@capacitor/core';
import type { Schedule, ReminderMethod } from '../core/types';

const ANDROID_CHANNEL_ID = 'wannianli_default';
const ANDROID_CHANNEL_NAME = '日程提醒';
const TAP_ACTION_ID = 'view-schedule';

/**
 * 把 string 哈希成 int32（稳定映射）
 * 用 djb2 哈希，截取 32 位
 */
export function hashStringToInt(s: string): number {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    // hash * 33 + c
    hash = ((hash << 5) + hash + s.charCodeAt(i)) | 0;
  }
  // 防止 0；保留正数（负数也行，LocalNotifications 支持）
  return hash === 0 ? 1 : hash;
}

/**
 * 计算日程的提醒触发时间
 * - 考虑 date + time + advance 提前分钟
 * - 如果在过去，返回 null（不调度）
 *
 * 重复任务每天/每周/每月/每年：返回下一个最近的 Date
 * 其它情况：返回单次 Date
 */
export function buildAtDate(s: Schedule, advanceMin: number, now: Date = new Date()): Date | null {
  // 解析日期
  const [y, m, d] = s.date.split('-').map(Number);
  if (!y || !m || !d) return null;

  let trigger: Date;

  if (s.time) {
    const [hh, mm] = s.time.split(':').map(Number);
    if (hh === undefined || mm === undefined) return null;
    trigger = new Date(y, m - 1, d, hh, mm, 0, 0);
  } else {
    // 没有具体时间，默认 09:00
    trigger = new Date(y, m - 1, d, 9, 0, 0, 0);
  }

  // 提前 N 分钟
  trigger = new Date(trigger.getTime() - advanceMin * 60 * 1000);

  // 如果是非重复任务，过去就不调度
  if (s.repeat === 'none') {
    if (trigger.getTime() <= now.getTime()) return null;
    return trigger;
  }

  // 重复任务：找到下一个未来的触发点
  // 注意：这里只算"下一次"，调度完成后 App resume 时会重新算
  const oneDay = 24 * 60 * 60 * 1000;

  if (s.repeat === 'daily') {
    while (trigger.getTime() <= now.getTime()) {
      trigger = new Date(trigger.getTime() + oneDay);
    }
    return trigger;
  }

  if (s.repeat === 'weekly') {
    while (trigger.getTime() <= now.getTime()) {
      trigger = new Date(trigger.getTime() + 7 * oneDay);
    }
    return trigger;
  }

  if (s.repeat === 'monthly') {
    while (trigger.getTime() <= now.getTime()) {
      trigger = new Date(trigger.getFullYear(), trigger.getMonth() + 1, trigger.getDate(), trigger.getHours(), trigger.getMinutes());
    }
    return trigger;
  }

  if (s.repeat === 'yearly') {
    while (trigger.getTime() <= now.getTime()) {
      trigger = new Date(trigger.getFullYear() + 1, trigger.getMonth(), trigger.getDate(), trigger.getHours(), trigger.getMinutes());
    }
    return trigger;
  }

  return null;
}

/**
 * 把 ReminderMethod 数组翻译为震动/声音开关
 */
function shouldVibrate(methods: ReminderMethod[]): boolean {
  return methods.includes('vibrate');
}
function shouldSound(methods: ReminderMethod[]): boolean {
  return methods.includes('sound');
}

/**
 * 构造通知文案
 */
function buildNotificationContent(s: Schedule): { title: string; body: string } {
  const repeatLabel = {
    none: '',
    daily: ' · 每天',
    weekly: ' · 每周',
    monthly: ' · 每月',
    yearly: ' · 每年',
  }[s.repeat];
  const title = `${s.title}${repeatLabel}`;

  const timeStr = s.time ? ` ${s.time}` : '';
  const body = `${s.date}${timeStr}${s.note ? ' · ' + s.note : ''}`;

  return { title, body };
}

/**
 * 是否在原生平台
 */
function isNative(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
}

/**
 * 初始化：权限请求 + Android channel + iOS action types
 * 在 App 启动时调用一次
 */
export async function initNotifications(): Promise<void> {
  if (!isNative()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    // 1) 权限请求
    await LocalNotifications.requestPermissions();

    // 2) Android: 创建通知渠道
    if (Capacitor.getPlatform() === 'android') {
      await LocalNotifications.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: ANDROID_CHANNEL_NAME,
        description: '日程提醒通知',
        importance: 4, // IMPORTANCE_HIGH
        vibration: true,
        sound: undefined, // 使用系统默认
        lights: true,
        lightColor: '#4f7df5',
        visibility: 1, // VISIBILITY_PUBLIC
      });
    }

    // 3) iOS: 注册点击 action
    if (Capacitor.getPlatform() === 'ios') {
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: TAP_ACTION_ID,
            actions: [
              {
                id: 'view',
                title: '查看',
                foreground: true,
              },
            ],
          },
        ],
      });
    }
  } catch (err) {
    // 静默失败：通知是辅助功能，不能让 App 崩
    // eslint-disable-next-line no-console
    console.warn('[notifications] init failed:', err);
  }
}

/**
 * 为单个日程调度提醒
 * - 自动跳过 reminder.enabled = false 的
 * - 内部先取消再调度（避免重复）
 */
export async function scheduleForSchedule(s: Schedule): Promise<void> {
  if (!isNative()) return;
  if (s.completed) return;
  if (!s.reminder?.enabled) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    const id = hashStringToInt(s.id);
    // 先取消
    await LocalNotifications.cancel({ notifications: [{ id }] });

    const advance = s.reminder.advance ?? 0;
    const at = buildAtDate(s, advance);
    if (!at) return; // 已过期

    const { title, body } = buildNotificationContent(s);
    const methods = s.reminder.method ?? ['popup'];

    const notification: any = {
      id,
      title,
      body,
      schedule: { at },
      extra: { scheduleId: s.id },
      actionTypeId: TAP_ACTION_ID, // iOS
      channelId: ANDROID_CHANNEL_ID, // Android 8+
    };

    // iOS: 每天重复用系统级 repeats
    if (Capacitor.getPlatform() === 'ios' && s.repeat === 'daily') {
      notification.schedule = {
        at,
        repeats: true,
        every: 'day',
      };
    }

    await LocalNotifications.schedule({ notifications: [notification] });

    // 控制 Android 是否震动（在 channel 级别已设置；这里保留扩展点）
    void shouldVibrate(methods);
    void shouldSound(methods);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[notifications] schedule failed:', s.id, err);
  }
}

/**
 * 取消单个日程的所有通知
 */
export async function cancelForSchedule(s: Schedule): Promise<void> {
  if (!isNative()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const id = hashStringToInt(s.id);
    await LocalNotifications.cancel({ notifications: [{ id }] });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[notifications] cancel failed:', s.id, err);
  }
}

/**
 * 重新同步所有日程的通知
 * - App 启动 / resume 时调用
 * - 先取消所有，再为每个未来要响的重新调度
 */
export async function resyncAllNotifications(schedules: Schedule[]): Promise<void> {
  if (!isNative()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    // 1) 拿到所有 pending
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }

    // 2) 为每个日程重新调度
    for (const s of schedules) {
      await scheduleForSchedule(s);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[notifications] resync failed:', err);
  }
}

/**
 * 监听通知点击事件
 * 返回取消监听的函数
 *
 * handler 接收 scheduleId（点击的通知对应的日程 ID）
 */
export async function onNotificationTap(handler: (scheduleId: string) => void): Promise<() => void> {
  if (!isNative()) return () => {};

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    const actionHandle = await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (action) => {
        const scheduleId = action.notification?.extra?.scheduleId;
        if (scheduleId) handler(scheduleId);
      }
    );

    const receivedHandle = await LocalNotifications.addListener(
      'localNotificationReceived',
      (notification) => {
        // 通知到达时也触发（点击和到达事件二选一，根据 App 状态）
        const scheduleId = notification.extra?.scheduleId;
        if (scheduleId) handler(scheduleId);
      }
    );

    return () => {
      actionHandle.remove();
      receivedHandle.remove();
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[notifications] onNotificationTap failed:', err);
    return () => {};
  }
}

/**
 * 取 App 启动时的待处理通知（处理冷启动点击通知的场景）
 * 调用一次后应清空队列
 */
export async function getInitialNotification(): Promise<Schedule | null> {
  if (!isNative()) return null;
  if (typeof window === 'undefined') return null;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.getPending();
    // 冷启动时通常 notifications 还没 schedule，return null
    void result;
    return null;
  } catch {
    return null;
  }
}

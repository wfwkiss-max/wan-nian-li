import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { useScheduleStore } from '../../stores/schedule-store';
import type { Schedule, ScheduleType, RepeatType, ReminderMethod } from '../../core/types';

interface ScheduleFormProps {
  date: Date;
  open: boolean;
  onClose: () => void;
  /** 编辑时传入已有日程；新增时省略 */
  existing?: Schedule | null;
  /** 打开时的默认类型（用于 SchedulePage 根据 tab 自动选择） */
  defaultType?: ScheduleType;
}

const COLORS = ['#4f7df5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/** 提前时间选项（分钟） */
const ADVANCE_OPTIONS: number[] = [0, 5, 15, 30, 60, 120, 1440];

export function ScheduleForm({
  date,
  open,
  onClose,
  existing = null,
  defaultType = 'schedule',
}: ScheduleFormProps) {
  const addSchedule = useScheduleStore((s) => s.addSchedule);
  const updateSchedule = useScheduleStore((s) => s.updateSchedule);
  const { t } = useTranslation(['schedule', 'common']);

  const isEdit = !!existing;

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<ScheduleType>(defaultType);
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [color, setColor] = useState<string>(COLORS[0]!);
  // 提醒相关
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderAdvance, setReminderAdvance] = useState<number>(15);
  const [reminderMethods, setReminderMethods] = useState<ReminderMethod[]>(['popup']);
  const [saving, setSaving] = useState(false);

  // 打开时根据 existing 或 defaultType 初始化
  useEffect(() => {
    if (!open) return;
    if (existing) {
      setTitle(existing.title);
      setTime(existing.time ?? '');
      setEndTime(existing.endTime ?? '');
      setNote(existing.note ?? '');
      setType(existing.type);
      setRepeat(existing.repeat);
      setColor(existing.color ?? COLORS[0]!);
      setReminderEnabled(existing.reminder?.enabled ?? false);
      setReminderAdvance(existing.reminder?.advance ?? 15);
      setReminderMethods(
        existing.reminder?.method && existing.reminder.method.length > 0
          ? existing.reminder.method
          : ['popup']
      );
    } else {
      setTitle('');
      setTime('');
      setEndTime('');
      setNote('');
      setType(defaultType);
      setRepeat('none');
      setColor(COLORS[0]!);
      setReminderEnabled(false);
      setReminderAdvance(15);
      setReminderMethods(['popup']);
    }
  }, [open, existing, defaultType]);

  if (!open) return null;

  const dateStr = existing
    ? existing.date
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      // 保证方式至少有一个（防止用户全关）
      const finalMethods: ReminderMethod[] = reminderEnabled
        ? reminderMethods.length > 0
          ? reminderMethods
          : ['popup']
        : [];

      if (existing) {
        await updateSchedule(existing.id, {
          title: title.trim(),
          date: dateStr,
          isLunar: existing.isLunar,
          time: time || undefined,
          endTime: endTime || undefined,
          note: note.trim() || undefined,
          type,
          repeat,
          reminder: {
            enabled: reminderEnabled,
            advance: reminderAdvance,
            method: finalMethods,
          },
          color,
        });
      } else {
        await addSchedule({
          title: title.trim(),
          date: dateStr,
          isLunar: false,
          time: time || undefined,
          endTime: endTime || undefined,
          note: note.trim() || undefined,
          type,
          repeat,
          reminder: {
            enabled: reminderEnabled,
            advance: reminderAdvance,
            method: finalMethods,
          },
          color,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const toggleMethod = (m: ReminderMethod) => {
    if (reminderMethods.includes(m)) {
      setReminderMethods(reminderMethods.filter((x) => x !== m));
    } else {
      setReminderMethods([...reminderMethods, m]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={handleClose}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 表单面板：flex 列布局，固定头/滚动中/底安全区 */}
      <div
        className="relative w-full max-w-lg bg-card rounded-t-3xl animate-slide-up flex flex-col"
        style={{ maxHeight: 'min(90vh, 720px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 拖动指示条 */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* 头部：固定不滚动 - 触摸目标 ≥44pt */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0 border-b border-theme/40">
          <button
            onClick={handleClose}
            className="min-h-[44px] min-w-[64px] px-4 py-2 text-sm text-secondary rounded-lg active:bg-secondary/60 transition-colors"
          >
            {t('common:action.cancel')}
          </button>
          <h3 className="text-base font-bold">
            {isEdit ? t('schedule:editSchedule') : t('schedule:addSchedule')}
          </h3>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className={cn(
              'min-h-[44px] px-4 py-2 text-sm font-medium rounded-xl transition-all',
              title.trim()
                ? 'accent-gradient text-white active:scale-95'
                : 'text-tertiary bg-secondary/50'
            )}
          >
            {saving ? '...' : t('common:action.save')}
          </button>
        </div>

        {/* 内容：可滚动，flex-1 占据中间剩余空间 */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-3">
          {/* 日期显示 */}
          <div className="text-sm text-secondary">{dateStr}</div>

          {/* 标题 */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('schedule:placeholder.title')}
            autoFocus
            className="w-full px-3 py-2.5 text-base border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
          />

          {/* 时间 */}
          <div className="flex gap-2 items-center">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              placeholder={t('schedule:field.time')}
            />
            <span className="text-tertiary text-sm">-</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
              placeholder={t('schedule:field.endTime')}
            />
          </div>

          {/* 类型 - 触摸目标 ≥44pt */}
          <div className="flex gap-2">
            {([
              ['schedule', t('schedule:type.schedule')],
              ['anniversary', t('schedule:type.anniversary')],
              ['birthday', t('schedule:type.birthday')],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setType(val)}
                className={cn(
                  'flex-1 py-3 min-h-[44px] text-sm font-medium rounded-xl transition-all',
                  type === val
                    ? 'accent-gradient text-white shadow-sm'
                    : 'bg-secondary/50 text-secondary'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 重复 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary w-10 flex-shrink-0">{t('schedule:field.repeat')}</span>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as RepeatType)}
              className="flex-1 px-3 py-2 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none"
            >
              <option value="none">{t('schedule:repeat.none')}</option>
              <option value="daily">{t('schedule:repeat.daily')}</option>
              <option value="weekly">{t('schedule:repeat.weekly')}</option>
              <option value="monthly">{t('schedule:repeat.monthly')}</option>
              <option value="yearly">{t('schedule:repeat.yearly')}</option>
            </select>
          </div>

          {/* 颜色 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary w-10 flex-shrink-0">{t('schedule:field.color')}</span>
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-11 h-11 flex items-center justify-center"
                  aria-label={c}
                >
                  <span
                    className={cn(
                      'w-7 h-7 rounded-full transition-all',
                      color === c && 'ring-2 ring-offset-2 ring-offset-[var(--color-bg-card)]'
                    )}
                    style={{ backgroundColor: c, ['--tw-ring-color' as string]: c }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 提醒区 */}
          <div className="border border-theme/60 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('schedule:field.reminder')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={reminderEnabled}
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors duration-200',
                  reminderEnabled ? 'accent-gradient' : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                    reminderEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            {reminderEnabled && (
              <>
                {/* 提前时间 - 触摸目标 ≥44pt */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary w-12 flex-shrink-0">
                    {t('schedule:reminderAdvance')}
                  </span>
                  <select
                    value={reminderAdvance}
                    onChange={(e) => setReminderAdvance(Number(e.target.value))}
                    className="flex-1 min-h-[44px] px-3 py-2.5 text-sm border border-theme rounded-lg bg-secondary/30 focus:outline-none"
                  >
                    {ADVANCE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m === 0
                          ? t('schedule:advance.atTime')
                          : m >= 1440
                          ? t('schedule:advance.day', { count: m / 1440 })
                          : m >= 60
                          ? t('schedule:advance.hour', { count: m / 60 })
                          : t('schedule:advance.minute', { count: m })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 提醒方式 - 触摸目标 ≥44pt */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary w-12 flex-shrink-0">
                    {t('schedule:reminderMethods')}
                  </span>
                  <div className="flex gap-1.5 flex-1">
                    {(
                      [
                        ['popup', t('schedule:methodPopup')],
                        ['sound', t('schedule:methodSound')],
                        ['vibrate', t('schedule:methodVibrate')],
                      ] as const
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => toggleMethod(val)}
                        className={cn(
                          'flex-1 py-3 min-h-[44px] text-sm font-medium rounded-lg transition-all',
                          reminderMethods.includes(val)
                            ? 'accent-gradient text-white shadow-sm'
                            : 'bg-secondary/50 text-secondary'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 备注：放在最后但在可滚动区域内可见 */}
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('schedule:placeholder.note')}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 resize-none"
            />
          </div>
        </div>

        {/* 底部安全区 */}
        <div className="flex-shrink-0 safe-area-bottom" />
      </div>
    </div>
  );
}

// 兼容旧导出
export const AddScheduleForm = ScheduleForm;

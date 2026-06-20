import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { useScheduleStore } from '../../stores/schedule-store';
import type { ScheduleType, RepeatType } from '../../core/types';

interface AddScheduleFormProps {
  date: Date;
  open: boolean;
  onClose: () => void;
}

const COLORS = ['#4f7df5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AddScheduleForm({ date, open, onClose }: AddScheduleFormProps) {
  const addSchedule = useScheduleStore((s) => s.addSchedule);
  const { t } = useTranslation(['schedule', 'common']);

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<ScheduleType>('schedule');
  const [repeat, setRepeat] = useState<RepeatType>('none');
  const [color, setColor] = useState(COLORS[0]!);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await addSchedule({
      title: title.trim(),
      date: dateStr,
      isLunar: false,
      time: time || undefined,
      endTime: endTime || undefined,
      note: note.trim() || undefined,
      type,
      repeat,
      reminder: { enabled: false, advance: 15, method: ['popup'] },
      color,
    });
    setSaving(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setTime('');
    setEndTime('');
    setNote('');
    setType('schedule');
    setRepeat('none');
    setColor(COLORS[0]!);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 表单面板 */}
      <div
        className="relative w-full max-w-lg bg-card rounded-t-3xl animate-slide-up safe-area-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 拖动指示条 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* 头部 */}
        <div className="flex items-center justify-between px-5 pb-3">
          <button onClick={handleClose} className="text-sm text-secondary">
            {t('common:action.cancel')}
          </button>
          <h3 className="text-base font-bold">{t('schedule:addSchedule')}</h3>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className={cn(
              'text-sm font-medium px-3 py-1 rounded-lg transition-all',
              title.trim()
                ? 'accent-gradient text-white active:scale-95'
                : 'text-tertiary bg-secondary/50'
            )}
          >
            {saving ? '...' : t('common:action.save')}
          </button>
        </div>

        <div className="px-5 pb-5 space-y-3 max-h-[70vh] overflow-y-auto">
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

          {/* 类型 */}
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
                  'flex-1 py-2 text-xs font-medium rounded-xl transition-all',
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
            <span className="text-sm text-secondary w-10">{t('schedule:field.repeat')}</span>
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
            <span className="text-sm text-secondary w-10">{t('schedule:field.color')}</span>
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

          {/* 备注 */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('schedule:placeholder.note')}
            rows={2}
            className="w-full px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

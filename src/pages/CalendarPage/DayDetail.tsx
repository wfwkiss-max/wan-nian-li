import { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalendarStore } from '../../stores/calendar-store';
import { useScheduleStore } from '../../stores/schedule-store';
import { getFullLunarInfo } from '../../core/lunar';
import { getDayGanZhiIndex } from '../../core/lunar/heavenly-earthly';
import { NA_YIN } from '../../utils/constants';
import { cn } from '../../utils/cn';
import { SwipeToDelete } from '../../components/SwipeToDelete';
import { AddScheduleForm } from './AddScheduleForm';

export function DayDetail() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const { daySchedules, loadByDate, deleteSchedule, toggleComplete } = useScheduleStore();
  const { t } = useTranslation(['calendar', 'schedule', 'common']);
  const [formOpen, setFormOpen] = useState(false);

  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    loadByDate(dateStr);
  }, [dateStr, loadByDate]);

  const info = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();
    const lunar = getFullLunarInfo(y, m, d);
    const dayIndex = getDayGanZhiIndex(y, m, d);
    const naYin = NA_YIN[Math.floor(dayIndex / 2)]!;
    return { lunar, naYin, y, m, d };
  }, [selectedDate]);

  const { lunar, naYin } = info;
  const allFestivals = [...lunar.festivals, ...lunar.lunarFestivals];

  return (
    <>
      <div className="flex-1 mx-3 mt-2 mb-2 rounded-2xl bg-card shadow-card overflow-y-auto">
        <div className="px-4 pt-4 pb-3">
          {/* 日期头部 */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold accent-gradient-text leading-none">
              {selectedDate.getDate()}
            </span>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">
                {lunar.lunarMonthName}{lunar.lunarDayName}
              </span>
              {lunar.solarTerm && (
                <span className="text-xxs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {lunar.solarTerm}
                </span>
              )}
            </div>
            {/* 添加日程按钮 - 44x44 触摸区 */}
            <button
              onClick={() => setFormOpen(true)}
              className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              aria-label={t('schedule:addSchedule')}
            >
              <span className="w-7 h-7 rounded-full accent-gradient text-white flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </button>
          </div>

          {/* 节日标签 */}
          {allFestivals.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {allFestivals.map((f) => (
                <span
                  key={f}
                  className="text-xxs px-2 py-0.5 bg-red-50 text-festival rounded-full font-medium dark:bg-red-900/20"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* 当天日程 - 左滑删除 */}
          {daySchedules.length > 0 && (
            <div className="mb-3 space-y-1.5">
              {daySchedules.map((s) => (
                <SwipeToDelete key={s.id} onDelete={() => deleteSchedule(s.id)}>
                  <div className="flex items-center gap-2.5 px-2.5 py-2.5 bg-secondary/40">
                    {/* 完成状态切换 - 44x44 触摸区 */}
                    <button
                      onClick={() => toggleComplete(s.id)}
                      className="flex-shrink-0 w-11 h-11 flex items-center justify-center"
                      aria-label={s.completed ? '标记为未完成' : '标记为完成'}
                    >
                      <span
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{
                          borderColor: s.completed ? '#b0b8c8' : (s.color || '#4f7df5'),
                          backgroundColor: s.completed ? '#b0b8c8' : 'transparent',
                        }}
                      >
                        {s.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        s.completed && 'line-through text-tertiary'
                      )}>{s.title}</p>
                      {s.time && (
                        <p className="text-xxs text-tertiary">
                          {s.time}{s.endTime ? ` - ${s.endTime}` : ''}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      'text-xxxs px-1.5 py-0.5 rounded',
                      s.type === 'schedule' && 'bg-primary-50 text-primary-500 dark:bg-primary-900/30',
                      s.type === 'anniversary' && 'bg-pink-50 text-pink-500 dark:bg-pink-900/30',
                      s.type === 'birthday' && 'bg-amber-50 text-amber-500 dark:bg-amber-900/30',
                    )}>
                      {s.type === 'schedule' ? t('schedule:type.schedule') : s.type === 'anniversary' ? t('schedule:type.anniversary') : t('schedule:type.birthday')}
                    </span>
                  </div>
                </SwipeToDelete>
              ))}
            </div>
          )}

          {/* 干支信息 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <GanZhiItem label={t('almanac:yearGanZhi')} value={`${lunar.yearGanZhi}年`} extra={`${lunar.zodiac}`} />
            <GanZhiItem label={t('almanac:monthGanZhi')} value={`${lunar.monthGanZhi}月`} />
            <GanZhiItem label={t('almanac:dayGanZhi')} value={`${lunar.dayGanZhi}日`} />
            <GanZhiItem label={t('almanac:wuXing')} value={naYin} />
          </div>
        </div>
      </div>

      {/* 添加日程表单 */}
      <AddScheduleForm
        date={selectedDate}
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
}

function GanZhiItem({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-xxs text-tertiary bg-secondary/60 px-1.5 py-0.5 rounded">{label}</span>
      <span className="font-medium">{value}</span>
      {extra && <span className="text-lunar text-xxs">({extra})</span>}
    </div>
  );
}

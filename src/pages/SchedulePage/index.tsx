import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScheduleStore } from '../../stores/schedule-store';
import { SwipeToDelete } from '../../components/SwipeToDelete';
import { cn } from '../../utils/cn';
import { ScheduleForm } from '../CalendarPage/AddScheduleForm';
import type { Schedule, ScheduleType } from '../../core/types';

function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'anniversary'>('schedule');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const { allSchedules, loadAll, deleteSchedule, targetScheduleId, clearTargetSchedule } = useScheduleStore();
  const { t } = useTranslation(['schedule', 'common']);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // 监听通知点击：跳到对应日程详情
  useEffect(() => {
    if (!targetScheduleId) return;
    const target = allSchedules.find((s) => s.id === targetScheduleId);
    if (target) {
      setEditing(target);
      setFormOpen(true);
    }
    clearTargetSchedule();
  }, [targetScheduleId, allSchedules, clearTargetSchedule]);

  const filtered = allSchedules.filter((s) =>
    activeTab === 'schedule' ? s.type === 'schedule' : s.type !== 'schedule'
  );

  const handleDelete = async (id: string) => {
    await deleteSchedule(id);
    loadAll();
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (s: Schedule) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditing(null);
    loadAll();
  };

  // 根据当前 tab 决定默认 type（纪念日 tab → anniversary，否则 schedule）
  const defaultType: ScheduleType = activeTab === 'anniversary' ? 'anniversary' : 'schedule';

  return (
    <div className="relative p-4">
      {/* Tab 切换 - 触摸目标 ≥44pt */}
      <div className="flex gap-1 mb-4 bg-secondary/60 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('schedule')}
          className={cn(
            'flex-1 py-3 min-h-[44px] text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === 'schedule'
              ? 'bg-card shadow-card text-primary-500'
              : 'text-secondary'
          )}
        >
          {t('schedule:type.schedule')}
        </button>
        <button
          onClick={() => setActiveTab('anniversary')}
          className={cn(
            'flex-1 py-3 min-h-[44px] text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === 'anniversary'
              ? 'bg-card shadow-card text-primary-500'
              : 'text-secondary'
          )}
        >
          {t('schedule:type.anniversary')}
        </button>
      </div>

      {filtered.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-tertiary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {activeTab === 'schedule' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              )}
            </svg>
          </div>
          <p className="text-secondary text-sm mb-1">{t('schedule:noSchedule')}</p>
          <p className="text-tertiary text-xxs">{t('schedule:noScheduleHint')}</p>
        </div>
      ) : (
        /* 日程列表 - 左滑删除，点击编辑 */
        <div className="space-y-2 pb-2">
          {filtered.map((s) => (
            <SwipeToDelete
              key={s.id}
              onDelete={() => handleDelete(s.id)}
              className="rounded-2xl shadow-card"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => openEdit(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openEdit(s);
                  }
                }}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-secondary/30 transition-colors cursor-pointer"
              >
                <span
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: s.color || '#4f7df5' }}
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-semibold truncate',
                    s.completed && 'line-through text-tertiary'
                  )}>{s.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xxs text-tertiary">{s.date}</span>
                    {s.time && (
                      <span className="text-xxs text-tertiary">
                        {s.time}{s.endTime ? ` - ${s.endTime}` : ''}
                      </span>
                    )}
                    {s.repeat !== 'none' && (
                      <span className="text-xxxs px-1.5 py-0.5 rounded bg-secondary/50 text-tertiary">
                        {t(`schedule:repeat.${s.repeat}`)}
                      </span>
                    )}
                    {/* 非当前 tab 类型用徽章提示 */}
                    {activeTab === 'anniversary' && s.type === 'birthday' && (
                      <span className="text-xxxs px-1.5 py-0.5 rounded bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400">
                        {t('schedule:type.birthday')}
                      </span>
                    )}
                  </div>
                  {s.note && (
                    <p className="text-xs text-secondary mt-1 truncate leading-relaxed">{s.note}</p>
                  )}
                </div>
                {/* 编辑指示器 */}
                <svg className="w-4 h-4 text-tertiary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </SwipeToDelete>
          ))}
        </div>
      )}

      {/* 浮动新建按钮（FAB） - 不影响列表滚动和布局 */}
      <button
        onClick={openAdd}
        aria-label={t('schedule:addSchedule')}
        className={cn(
          'fixed right-5 bottom-[5.25rem] z-40',
          'w-14 h-14 rounded-full',
          'flex items-center justify-center',
          'accent-gradient text-white',
          'shadow-lg active:scale-95 transition-transform duration-150',
          'safe-area-bottom'
        )}
        style={{ boxShadow: '0 8px 24px rgba(79, 125, 245, 0.4)' }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* 添加/编辑日程表单 */}
      <ScheduleForm
        date={editing ? new Date(editing.date) : new Date()}
        open={formOpen}
        onClose={handleFormClose}
        existing={editing}
        defaultType={defaultType}
      />
    </div>
  );
}

export default SchedulePage;

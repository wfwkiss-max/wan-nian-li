import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalendarStore } from '../../stores/calendar-store';
import { getAlmanacInfo } from '../../core/almanac';
import { getFullLunarInfo } from '../../core/lunar';
import { findAuspiciousDays, COMMON_EVENTS } from '../../core/almanac';
import { cn } from '../../utils/cn';
import { DatePicker } from './DatePicker';

function AlmanacPage() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);
  const { t } = useTranslation(['almanac', 'common']);
  const [showFilter, setShowFilter] = useState(false);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterResults, setFilterResults] = useState<Awaited<ReturnType<typeof findAuspiciousDays>>>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const info = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();
    return {
      almanac: getAlmanacInfo(y, m, d),
      lunar: getFullLunarInfo(y, m, d),
    };
  }, [selectedDate]);

  const handleFilter = (event: string) => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 90);
    const results = findAuspiciousDays(event, start, end);
    setFilterResults(results);
    setFilterEvent(event);
    setShowFilter(true);
  };

  const { almanac, lunar } = info;

  return (
    <div className="p-4 space-y-2.5">
      {/* 日期显示 - 点击可选择 */}
      <button
        onClick={() => setPickerOpen(true)}
        className="w-full text-center py-3 rounded-2xl bg-card shadow-card active:scale-[0.99] transition-all duration-150"
      >
        <div className="flex items-center justify-center gap-1.5">
          <h2 className="text-lg font-bold">
            <span className="accent-gradient-text">{selectedDate.getFullYear()}</span>
            <span>年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日</span>
          </h2>
          <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>
        <p className="text-sm text-secondary mt-1">
          {lunar.yearGanZhi}年 {lunar.lunarMonthName}{lunar.lunarDayName} {lunar.dayGanZhi}日
        </p>
      </button>

      {/* 日期选择器 */}
      <DatePicker
        year={selectedDate.getFullYear()}
        month={selectedDate.getMonth() + 1}
        day={selectedDate.getDate()}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(date) => setSelectedDate(date)}
      />

      {/* 宜忌卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-3 shadow-card overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300" />
          <h3 className="text-almanac-yi font-bold text-sm mb-2 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-xxs">宜</span>
            <span className="text-tertiary text-xxs font-normal">{t('almanac:yi')}</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {almanac.yi.map((item) => (
              <span key={item} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg dark:bg-emerald-900/20 dark:text-emerald-400">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-3 shadow-card overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-red-300" />
          <h3 className="text-almanac-ji font-bold text-sm mb-2 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-xxs">忌</span>
            <span className="text-tertiary text-xxs font-normal">{t('almanac:ji')}</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {almanac.ji.map((item) => (
              <span key={item} className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="bg-card rounded-2xl p-3.5 shadow-card space-y-0">
        <h3 className="text-sm font-bold mb-2.5 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full accent-gradient" />
          {t('almanac:details')}
        </h3>
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          <InfoRow label={t('almanac:jianChu')} value={almanac.jianChu} />
          <InfoRow label={t('almanac:chong') + ' ' + t('almanac:sha')} value={`${almanac.chong} ${almanac.sha}`} />
          <InfoRow label={t('almanac:jiShen')} value={almanac.jiShen.join(' ') || '-'} />
          <InfoRow label={t('almanac:xiongShen')} value={almanac.xiongShen.join(' ') || '-'} />
          <InfoRow label={t('almanac:taiShen')} value={almanac.taiShen} />
          <InfoRow label={t('almanac:wuXing')} value={almanac.wuXing} />
          <InfoRow label={t('almanac:pengZu')} value={almanac.pengZu} />
        </div>
      </div>

      {/* 吉日筛选 */}
      <div className="bg-card rounded-2xl p-3.5 shadow-card">
        <h3 className="text-sm font-bold mb-2.5 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-400" />
          吉日查询
        </h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_EVENTS.slice(0, 12).map((event) => (
            <button
              key={event}
              onClick={() => handleFilter(event)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full transition-all duration-150',
                filterEvent === event
                  ? 'accent-gradient text-white shadow-sm'
                  : 'bg-secondary/60 text-secondary hover:bg-secondary active:scale-95'
              )}
            >
              {event}
            </button>
          ))}
        </div>

        {showFilter && (
          <div className="mt-3 pt-3 border-t border-theme/50">
            <p className="text-xs text-secondary mb-2">
              未来90天适合「{filterEvent}」的吉日（共{filterResults.length}天）
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filterResults.slice(0, 20).map((r) => (
                <div key={r.date.toISOString()} className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <span className="font-medium">{r.year}-{String(r.month).padStart(2, '0')}-{String(r.day).padStart(2, '0')}</span>
                  <span className="text-xxs text-tertiary bg-secondary/50 px-2 py-0.5 rounded">{r.jianChu}日</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm py-2">
      <span className="text-tertiary text-xxs w-10 flex-shrink-0 bg-secondary/40 px-1.5 py-0.5 rounded text-center leading-tight">{label}</span>
      <span className="flex-1 leading-relaxed">{value}</span>
    </div>
  );
}

export default AlmanacPage;

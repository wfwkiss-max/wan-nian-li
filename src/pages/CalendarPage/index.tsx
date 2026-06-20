import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalendarStore } from '../../stores/calendar-store';
import { MonthGrid } from './MonthGrid';
import { DayDetail } from './DayDetail';
import { WeekHeader } from './WeekHeader';
import { YearMonthPicker } from './YearMonthPicker';

function CalendarPage() {
  const { currentYear, currentMonth, prevMonth, nextMonth, goToToday, setMonth } = useCalendarStore();
  const { t } = useTranslation(['calendar', 'common']);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* 头部：年月选择 */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 relative">
        <button
          onClick={prevMonth}
          className="w-11 h-11 flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          aria-label={t('calendar:prev')}
        >
          <svg className="w-4.5 h-4.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className="text-lg font-bold px-3 py-1 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200 flex items-center gap-1.5"
          >
            <span className="accent-gradient-text">{currentYear}</span>
            <span>{t('calendar:yearMonth', { year: currentYear, month: currentMonth })}</span>
            <svg className={`w-3 h-3 text-tertiary transition-transform duration-300 ${pickerOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xxs font-medium accent-gradient text-white rounded-full shadow-sm transition-all duration-200 active:scale-95"
          >
            {t('common:action.today')}
          </button>
        </div>

        <button
          onClick={nextMonth}
          className="w-11 h-11 flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
          aria-label={t('calendar:next')}
        >
          <svg className="w-4.5 h-4.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* 年月选择器 */}
        <YearMonthPicker
          year={currentYear}
          month={currentMonth}
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(y, m) => setMonth(y, m)}
        />
      </header>

      {/* 星期表头 */}
      <WeekHeader />

      {/* 月网格 */}
      <MonthGrid year={currentYear} month={currentMonth} />

      {/* 日详情 */}
      <DayDetail />
    </div>
  );
}

export default CalendarPage;

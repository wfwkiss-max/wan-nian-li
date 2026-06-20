import { useMemo, useEffect, useRef, useCallback, type TouchEvent } from 'react';
import { useCalendarStore } from '../../stores/calendar-store';
import { useSettingsStore } from '../../stores/settings-store';
import { useScheduleStore } from '../../stores/schedule-store';
import { DayCell } from './DayCell';
import { getFullLunarInfo, getHolidayStatus } from '../../core/lunar';

interface MonthGridProps {
  year: number;
  month: number;
}

export function MonthGrid({ year, month }: MonthGridProps) {
  const weekStart = useSettingsStore((s) => s.weekStart);
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const setSelectedDate = useCalendarStore((s) => s.setSelectedDate);
  const prevMonth = useCalendarStore((s) => s.prevMonth);
  const nextMonth = useCalendarStore((s) => s.nextMonth);
  const monthDots = useScheduleStore((s) => s.monthDots);
  const loadMonthDots = useScheduleStore((s) => s.loadMonthDots);

  // 滑动手势处理
  const touchRef = useRef<{ startX: number; startY: number; locked: 'h' | 'v' | null; swiped: boolean }>({
    startX: 0, startY: 0, locked: null, swiped: false,
  });
  const lastTouchX = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0]!;
    touchRef.current = { startX: t.clientX, startY: t.clientY, locked: null, swiped: false };
    lastTouchX.current = t.clientX;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const t = e.touches[0]!;
    const ref = touchRef.current;
    const dx = t.clientX - ref.startX;
    const dy = t.clientY - ref.startY;
    lastTouchX.current = t.clientX;

    if (!ref.locked) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        ref.locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const ref = touchRef.current;
    if (ref.locked !== 'h' || ref.swiped) return;
    const dx = lastTouchX.current - ref.startX;
    const SWIPE_THRESHOLD = 50;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      ref.swiped = true;
      if (dx > 0) {
        prevMonth();
      } else {
        nextMonth();
      }
    }
  }, [prevMonth, nextMonth]);

  // 加载当月日程点数据
  useEffect(() => {
    loadMonthDots(year, month);
  }, [year, month, loadMonthDots]);

  const days = useMemo(() => {
    const result: Array<{
      date: Date;
      day: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      lunarText: string;
      festival: string | null;
      isWeekend: boolean;
      holidayStatus: 'holiday' | 'workday' | null;
      dateKey: string;
    }> = [];

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const selectedStr = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

    const firstDay = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDay.getDay();

    const offset = weekStart === 1
      ? (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1)
      : firstDayOfWeek;

    const daysInMonth = new Date(year, month, 0).getDate();
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - offset;
      const date = new Date(year, month - 1, dayOffset + 1);
      const d = date.getDate();
      const m = date.getMonth() + 1;
      const y = date.getFullYear();
      const isCurrentMonth = dayOffset >= 0 && dayOffset < daysInMonth;
      const dateStr = `${y}-${date.getMonth()}-${d}`;

      // 用于匹配日程点的 key (YYYY-MM-DD)
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      const dow = date.getDay();
      const isWeekend = dow === 0 || dow === 6;

      const lunar = getFullLunarInfo(y, m, d);
      const holidayStatus = getHolidayStatus(y, m, d);

      let lunarText = lunar.lunarDayName;
      let festival: string | null = null;

      if (lunar.solarTerm) {
        lunarText = lunar.solarTerm;
        festival = lunar.solarTerm;
      } else if (lunar.lunarFestivals.length > 0) {
        lunarText = lunar.lunarFestivals[0]!;
        festival = lunar.lunarFestivals[0]!;
      } else if (lunar.festivals.length > 0) {
        lunarText = lunar.festivals[0]!;
        festival = lunar.festivals[0]!;
      } else if (lunar.lunarDate.day === 1) {
        lunarText = lunar.lunarMonthName;
      }

      result.push({
        date,
        day: d,
        isCurrentMonth,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedStr,
        lunarText,
        festival,
        isWeekend,
        holidayStatus,
        dateKey,
      });
    }

    return result;
  }, [year, month, weekStart, selectedDate]);

  return (
    <div
      className="grid grid-cols-7 gap-px px-2 pb-2"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {days.map((info, i) => (
        <DayCell
          key={i}
          {...info}
          dots={monthDots[info.dateKey] || []}
          onClick={() => setSelectedDate(info.date)}
        />
      ))}
    </div>
  );
}

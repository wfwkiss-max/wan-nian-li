import { cn } from '../../utils/cn';
import type { DayDot } from '../../stores/schedule-store';

interface DayCellProps {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  lunarText: string;
  festival: string | null;
  isWeekend: boolean;
  holidayStatus: 'holiday' | 'workday' | null;
  dots: DayDot[];
  onClick: () => void;
}

export function DayCell({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  lunarText,
  festival,
  isWeekend,
  holidayStatus,
  dots,
  onClick,
}: DayCellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-150 min-h-[3rem]',
        !isCurrentMonth && 'opacity-25',
        isSelected && 'accent-gradient text-white shadow-md shadow-primary-500/25 scale-[1.02]',
        isToday && !isSelected && 'ring-1.5 ring-primary-400/60 bg-primary-50/50 dark:bg-primary-900/20',
        !isSelected && 'active:bg-gray-100/80 dark:active:bg-gray-800/60'
      )}
    >
      {/* 法定假日标记：休/班 */}
      {holidayStatus && (
        <span
          className={cn(
            'absolute top-0.5 right-1 text-xxxs font-bold leading-none',
            holidayStatus === 'holiday' && 'text-emerald-500',
            holidayStatus === 'workday' && 'text-orange-400',
            isSelected && 'text-white/80'
          )}
        >
          {holidayStatus === 'holiday' ? '休' : '班'}
        </span>
      )}

      <span
        className={cn(
          'text-sm font-semibold leading-tight',
          isWeekend && !isSelected && holidayStatus !== 'workday' && 'text-festival',
          holidayStatus === 'holiday' && !isSelected && 'text-festival',
          holidayStatus === 'workday' && !isSelected && !isWeekend && 'text-primary',
          isSelected && 'text-white'
        )}
      >
        {day}
      </span>
      <span
        style={{ fontSize: '9px' }}
        className={cn(
          'leading-tight mt-0.5 truncate max-w-full px-0.5',
          festival && !isSelected && 'text-primary-500 dark:text-primary-400 font-medium',
          isSelected && 'text-white/75',
          !festival && !isSelected && 'text-secondary'
        )}
      >
        {lunarText}
      </span>

      {/* 日程颜色点 */}
      {dots.length > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {dots.slice(0, 4).map((dot, i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: dot.completed
                  ? (isSelected ? 'rgba(255,255,255,0.4)' : '#b0b8c8')
                  : (isSelected ? 'rgba(255,255,255,0.85)' : dot.color),
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
}

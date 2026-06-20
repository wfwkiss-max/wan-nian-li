import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface YearMonthPickerProps {
  year: number;
  month: number;
  open: boolean;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
}

export function YearMonthPicker({ year, month, open, onClose, onSelect }: YearMonthPickerProps) {
  const [mode, setMode] = useState<'month' | 'year'>('month');
  const [displayYear, setDisplayYear] = useState(year);
  const [yearPageStart, setYearPageStart] = useState(Math.floor(year / 12) * 12);
  const panelRef = useRef<HTMLDivElement>(null);

  // 同步外部传入的年份
  useEffect(() => {
    if (open) {
      setDisplayYear(year);
      setYearPageStart(Math.floor(year / 12) * 12);
      setMode('month');
    }
  }, [open, year]);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="absolute inset-x-0 top-full z-50 flex justify-center px-4 pt-1">
      <div
        ref={panelRef}
        className="bg-card border border-theme rounded-xl shadow-lg p-3 w-full max-w-xs animate-fade-in"
      >
        {mode === 'month' ? (
          <>
            {/* 年份标题，点击进入年选择 */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setDisplayYear((y) => y - 1)}
                className="p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => setMode('year')}
                className="text-sm font-semibold px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {displayYear}年
              </button>
              <button
                onClick={() => setDisplayYear((y) => y + 1)}
                className="p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* 月份网格 */}
            <div className="grid grid-cols-4 gap-1.5">
              {months.map((label, i) => {
                const m = i + 1;
                const isSelected = displayYear === year && m === month;
                const isCurrentMonth = displayYear === new Date().getFullYear() && m === new Date().getMonth() + 1;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      onSelect(displayYear, m);
                      onClose();
                    }}
                    className={cn(
                      'py-2 text-sm rounded-lg transition-colors',
                      isSelected && 'bg-primary-500 text-white',
                      !isSelected && isCurrentMonth && 'ring-1 ring-primary-500 text-primary-600 dark:text-primary-400',
                      !isSelected && !isCurrentMonth && 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* 年份选择模式 */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setYearPageStart((s) => s - 12)}
                className="p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <span className="text-sm font-semibold">
                {yearPageStart} - {yearPageStart + 11}
              </span>
              <button
                onClick={() => setYearPageStart((s) => s + 12)}
                className="p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* 年份网格 */}
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => {
                const y = yearPageStart + i;
                const isSelected = y === year;
                const isCurrent = y === new Date().getFullYear();
                return (
                  <button
                    key={y}
                    onClick={() => {
                      setDisplayYear(y);
                      setMode('month');
                    }}
                    className={cn(
                      'py-2 text-sm rounded-lg transition-colors',
                      isSelected && 'bg-primary-500 text-white',
                      !isSelected && isCurrent && 'ring-1 ring-primary-500 text-primary-600 dark:text-primary-400',
                      !isSelected && !isCurrent && 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

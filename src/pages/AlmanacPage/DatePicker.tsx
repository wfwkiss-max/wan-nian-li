import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface DatePickerProps {
  year: number;
  month: number;
  day: number;
  open: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export function DatePicker({ year, month, day, open, onClose, onSelect }: DatePickerProps) {
  const [selYear, setSelYear] = useState(year);
  const [selMonth, setSelMonth] = useState(month);
  const [selDay, setSelDay] = useState(day);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelYear(year);
      setSelMonth(month);
      setSelDay(day);
    }
  }, [open, year, month, day]);

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

  const daysInMonth = new Date(selYear, selMonth, 0).getDate();
  // 如果当前选中日超过该月天数，自动修正
  const effectiveDay = Math.min(selDay, daysInMonth);

  const handleConfirm = () => {
    onSelect(new Date(selYear, selMonth - 1, effectiveDay));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={onClose}>
      <div
        ref={panelRef}
        className="w-full max-w-md bg-card rounded-t-2xl p-4 pb-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-sm text-secondary">取消</button>
          <span className="text-sm font-semibold">选择日期</span>
          <button onClick={handleConfirm} className="text-sm text-primary-500 font-semibold">确定</button>
        </div>

        {/* 滚轮选择器 */}
        <div className="flex gap-2">
          {/* 年 */}
          <ScrollColumn
            items={Array.from({ length: 201 }, (_, i) => ({ value: 1900 + i, label: `${1900 + i}年` }))}
            selected={selYear}
            onChange={(v) => setSelYear(v)}
          />
          {/* 月 */}
          <ScrollColumn
            items={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }))}
            selected={selMonth}
            onChange={(v) => setSelMonth(v)}
          />
          {/* 日 */}
          <ScrollColumn
            items={Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: `${i + 1}日` }))}
            selected={effectiveDay}
            onChange={(v) => setSelDay(v)}
          />
        </div>
      </div>
    </div>
  );
}

interface ScrollColumnProps {
  items: Array<{ value: number; label: string }>;
  selected: number;
  onChange: (value: number) => void;
}

function ScrollColumn({ items, selected, onChange }: ScrollColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 36;
  const visibleCount = 5;

  // 滚动到选中项
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = items.findIndex((item) => item.value === selected);
    if (index >= 0) {
      container.scrollTop = index * itemHeight;
    }
  }, [items, selected]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / itemHeight);
    const item = items[index];
    if (item && item.value !== selected) {
      onChange(item.value);
    }
  };

  return (
    <div className="flex-1 relative">
      {/* 选中区域高亮 */}
      <div
        className="absolute left-0 right-0 pointer-events-none border-y border-primary-200 dark:border-primary-800 rounded"
        style={{ top: itemHeight * 2, height: itemHeight }}
      />
      {/* 上下渐隐 */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--color-bg-card)] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent pointer-events-none z-10" />

      <div
        ref={containerRef}
        className="overflow-y-auto scrollbar-none"
        style={{ height: itemHeight * visibleCount }}
        onScroll={handleScroll}
      >
        {/* 上方空白 */}
        <div style={{ height: itemHeight * 2 }} />
        {items.map((item) => (
          <div
            key={item.value}
            className={cn(
              'flex items-center justify-center text-sm transition-colors',
              item.value === selected ? 'font-semibold' : 'text-secondary'
            )}
            style={{ height: itemHeight }}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </div>
        ))}
        {/* 下方空白 */}
        <div style={{ height: itemHeight * 2 }} />
      </div>
    </div>
  );
}

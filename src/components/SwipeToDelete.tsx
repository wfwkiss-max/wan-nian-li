import { useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  className?: string;
}

const THRESHOLD = 70;

export function SwipeToDelete({ children, onDelete, className = '' }: SwipeToDeleteProps) {
  const { t } = useTranslation('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef(false); // 锁定方向

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0]!.clientX;
    startY.current = e.touches[0]!.clientY;
    locked.current = false;
    setSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!swiping) return;
    const dx = e.touches[0]!.clientX - startX.current;
    const dy = e.touches[0]!.clientY - startY.current;

    // 首次移动时判断方向，如果纵向滑动则放弃
    if (!locked.current) {
      if (Math.abs(dy) > Math.abs(dx)) {
        setSwiping(false);
        setOffsetX(0);
        return;
      }
      locked.current = true;
    }

    // 只允许向左滑（dx < 0）
    if (dx < 0) {
      setOffsetX(Math.max(dx, -120));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    if (offsetX < -THRESHOLD) {
      // 展开删除按钮
      setOffsetX(-80);
    } else {
      setOffsetX(0);
    }
  };

  const handleDelete = () => {
    setOffsetX(-300); // 滑出动画
    setTimeout(onDelete, 200);
  };

  const handleContentClick = () => {
    if (offsetX < 0) {
      setOffsetX(0);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* 删除按钮背景 */}
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={handleDelete}
          className="h-full px-6 bg-red-500 text-white text-sm font-medium flex items-center justify-center active:bg-red-600 transition-colors"
        >
          {t('action.delete')}
        </button>
      </div>

      {/* 可滑动内容 */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleContentClick}
        className="relative bg-card"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

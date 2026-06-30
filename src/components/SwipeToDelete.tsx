import { useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  className?: string;
}

const THRESHOLD = 60;
const REVEAL = 80;

/**
 * 左滑删除行（iOS 风格）
 * - 默认状态：只显示内容卡片，删除按钮**不渲染**（绝对干净）
 * - 左滑超过阈值：内容卡片左移，右侧露出红色"删除"按钮
 * - 点击内容卡片（已展开时）：回弹
 * - 点击"删除"：滑出 + 触发 onDelete
 */
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

    // 首次移动时判断方向，纵向滑动则放弃
    if (!locked.current) {
      if (Math.abs(dy) > Math.abs(dx)) {
        setSwiping(false);
        setOffsetX(0);
        return;
      }
      locked.current = true;
    }

    // 仅允许左滑展开右侧删除按钮（iOS 标准模式），限制 [ -REVEAL, 0 ]
    setOffsetX(Math.max(-REVEAL, Math.min(0, dx)));
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    if (offsetX < -THRESHOLD) {
      setOffsetX(-REVEAL);
    } else {
      setOffsetX(0);
    }
  };

  const handleDelete = () => {
    // 向左滑出后删除
    setOffsetX(-300);
    setTimeout(onDelete, 200);
  };

  const handleContentClick = () => {
    if (offsetX !== 0) {
      setOffsetX(0);
    }
  };

  // 关键：仅在展开时渲染删除按钮，默认状态彻底干净
  const revealed = offsetX !== 0;

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* 右侧删除按钮（仅展开时渲染） */}
      {revealed && (
        <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-red-500">
          <button
            type="button"
            onClick={handleDelete}
            aria-label={t('action.delete')}
            className="w-full h-full text-white text-sm font-medium active:bg-red-600 transition-colors"
          >
            {t('action.delete')}
          </button>
        </div>
      )}

      {/* 可滑动内容 */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleContentClick}
        className="relative w-full bg-card"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
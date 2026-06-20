import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/settings-store';

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export function WeekHeader() {
  const weekStart = useSettingsStore((s) => s.weekStart);
  const { t } = useTranslation('common');

  // weekStart=1 (周一) -> 从 mon 开始；weekStart=0 (周日) -> 从 sun 开始
  const order = weekStart === 1
    ? [0, 1, 2, 3, 4, 5, 6]
    : [6, 0, 1, 2, 3, 4, 5];

  return (
    <div className="grid grid-cols-7 px-2 pb-1">
      {order.map((idx, i) => {
        const key = WEEKDAY_KEYS[idx]!;
        const isWeekend = idx === 5 || idx === 6;
        return (
          <div
            key={i}
            className={`text-center text-xxs font-medium py-1.5 ${
              isWeekend ? 'text-festival/70' : 'text-tertiary'
            }`}
          >
            {t(`weekday.${key}`)}
          </div>
        );
      })}
    </div>
  );
}

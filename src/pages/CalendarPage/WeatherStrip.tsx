import { useEffect, useState } from 'react';
import { fetchWeather, WEATHER_ICON_MAP, type CurrentWeather } from '@/core/weather/weather-data';

export default function WeatherStrip() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchWeather().then((data) => {
      if (!cancelled) setWeather(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!weather) {
    return (
      <div className="mx-4 my-3 h-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
    );
  }

  const CurrentIcon = WEATHER_ICON_MAP[weather.icon];

  return (
    <div
      className="mx-4 my-3 rounded-2xl text-white shadow-lg overflow-hidden relative isolate"
      style={{
        background: 'var(--weather-gradient)',
        boxShadow: 'var(--weather-shadow)',
        backdropFilter: 'var(--weather-blur)',
        WebkitBackdropFilter: 'var(--weather-blur)',
      }}
    >
      {/* 液态玻璃高光叠加层（仅 iOS 主题可见） */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: 'var(--weather-overlay)' }}
      />
      <div className="relative flex items-center h-20 px-4">
        {/* 左侧：当前天气 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <CurrentIcon width={36} height={36} className="text-white/95 drop-shadow" />
          <div className="leading-tight">
            <div className="text-3xl font-light tracking-tight">{weather.temp}°</div>
            <div className="text-xs text-white/85">
              {weather.city}·{weather.desc}
            </div>
          </div>
        </div>

        {/* 竖分割线 */}
        <div className="mx-4 h-12 w-px bg-white/25 flex-shrink-0" />

        {/* 右侧：5 天预报 */}
        <div className="flex-1 flex items-center justify-between gap-1 min-w-0">
          {weather.forecast.map((day) => {
            const Icon = WEATHER_ICON_MAP[day.icon];
            return (
              <div key={day.date} className="flex flex-col items-center gap-0.5 min-w-0 px-1">
                <div className="flex items-baseline gap-0.5 leading-none">
                  <span className="text-[11px] text-white/85">{day.weekday}</span>
                  <span className="text-[10px] text-white/55 tabular-nums">{day.dayNum}</span>
                </div>
                <Icon width={18} height={18} className="text-white/95" />
                <span className="text-[11px] font-medium tabular-nums leading-none">
                  {day.high}°/{day.low}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

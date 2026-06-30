import type { CurrentWeather, DailyWeather, WeatherIconType } from './weather-types';

export type { CurrentWeather, DailyWeather, WeatherIconType };
export { WEATHER_ICON_MAP } from './weather-icons';

const WEEKDAY_LABELS: readonly string[] = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d'];

const MOCK_ICON_PATTERN: readonly WeatherIconType[] = [
  'sunny',
  'partly-cloudy',
  'cloudy',
  'rainy',
  'partly-cloudy',
];

const MOCK_HIGH_LOW_PATTERN: readonly { high: number; low: number }[] = [
  { high: 28, low: 19 },
  { high: 26, low: 20 },
  { high: 25, low: 21 },
  { high: 23, low: 20 },
  { high: 27, low: 19 },
];

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildForecast(now: Date): DailyWeather[] {
  const days: DailyWeather[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dow = d.getDay();
    const label =
      i === 0
        ? '\u4eca'
        : i === 1
          ? '\u660e'
          : (WEEKDAY_LABELS[dow] ?? '\u65e5');
    days.push({
      date: formatDate(d),
      weekday: label,
      dayNum: String(d.getDate()),
      icon: MOCK_ICON_PATTERN[i] ?? 'partly-cloudy',
      high: MOCK_HIGH_LOW_PATTERN[i]?.high ?? 25,
      low: MOCK_HIGH_LOW_PATTERN[i]?.low ?? 20,
    });
  }
  return days;
}

export async function fetchWeather(): Promise<CurrentWeather> {
  const now = new Date();
  const data: CurrentWeather = {
    city: '\u5317\u4eac',
    temp: 26,
    desc: '\u6674\u8f6c\u591a\u4e91',
    icon: 'partly-cloudy',
    forecast: buildForecast(now),
  };
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100);
  });
}

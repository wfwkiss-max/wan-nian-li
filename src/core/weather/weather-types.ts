export type WeatherIconType =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'thunderstorm'
  | 'foggy';

export interface DailyWeather {
  date: string;
  weekday: string;
  dayNum: string;
  icon: WeatherIconType;
  high: number;
  low: number;
}

export interface CurrentWeather {
  city: string;
  temp: number;
  desc: string;
  icon: WeatherIconType;
  forecast: DailyWeather[];
}

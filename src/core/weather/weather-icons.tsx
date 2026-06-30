import type { ReactElement, SVGProps } from 'react';
import type { WeatherIconType } from './weather-types';

const baseProps: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

export function SunnyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function PartlyCloudyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="8" cy="9" r="3" />
      <path d="M8 3v1M8 14v1M2 9h1M13 9h1M4 5l0.7 0.7M11.3 12.3l0.7 0.7M4 13l0.7-0.7M11.3 5.7l0.7-0.7" />
      <path d="M10 18h8.5a3.5 3.5 0 0 0 0.4-6.97A6 6 0 0 0 7.5 11.5 3.5 3.5 0 0 0 10 18z" />
    </svg>
  );
}

export function CloudyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <path d="M17 18H7a4 4 0 0 1 0-8 6 6 0 0 1 11.66 2A3.5 3.5 0 0 1 17 18z" />
    </svg>
  );
}

export function RainyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <path d="M17 14H7a4 4 0 0 1 0-8 6 6 0 0 1 11.66 2A3.5 3.5 0 0 1 17 14z" />
      <path d="M8 17v2M12 17v2M16 17v2" />
    </svg>
  );
}

export function SnowyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <path d="M17 14H7a4 4 0 0 1 0-8 6 6 0 0 1 11.66 2A3.5 3.5 0 0 1 17 14z" />
      <path d="M8 17l0.01 0M12 17l0.01 0M16 17l0.01 0M9 20l0.01 0M15 20l0.01 0" />
    </svg>
  );
}

export function ThunderstormIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <path d="M17 13H7a4 4 0 0 1 0-8 6 6 0 0 1 11.66 2A3.5 3.5 0 0 1 17 13z" />
      <path d="M12 14l-2 4h3l-1 3" />
    </svg>
  );
}

export function FoggyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 8h12M4 12h16M6 16h14M4 20h12" />
    </svg>
  );
}

export const WEATHER_ICON_MAP: Record<WeatherIconType, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  'sunny': SunnyIcon,
  'partly-cloudy': PartlyCloudyIcon,
  'cloudy': CloudyIcon,
  'rainy': RainyIcon,
  'snowy': SnowyIcon,
  'thunderstorm': ThunderstormIcon,
  'foggy': FoggyIcon,
};

import type { ServiceArea } from '@/data/servicosData';

export default function ServiceIcon({ icon, color }: { icon: ServiceArea['icon']; color: string }) {
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-7 w-7',
    'aria-hidden': true,
  };

  switch (icon) {
    case 'brain':
      return (
        <svg {...common}>
          <path d="M18 8a7 7 0 0 0-6 11 7 7 0 0 0 2 13h8V11a6 6 0 0 0-4-3Z" />
          <path d="M30 8a7 7 0 0 1 6 11 7 7 0 0 1-2 13h-8V11a6 6 0 0 1 4-3Z" />
          <path d="M24 12v24" />
          <path d="M15 20h5m13 0h-5m-13 7h5m13 0h-5" />
        </svg>
      );
    case 'mouth':
      return (
        <svg {...common}>
          <path d="M10 25c4-5 10-7 14-7s10 2 14 7c-4 8-10 12-14 12S14 33 10 25Z" />
          <path d="M15 24c3 2 6 3 9 3s6-1 9-3" />
          <path d="M20 13h8" />
          <path d="M24 9v8" />
        </svg>
      );
    case 'sensory':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="15" />
          <path d="M24 9v30M9 24h30" />
          <circle cx="24" cy="24" r="5" />
        </svg>
      );
    case 'pediatric':
      return (
        <svg {...common}>
          <path d="M24 8c5 0 9 4 9 9v4c0 8-4 13-9 13s-9-5-9-13v-4c0-5 4-9 9-9Z" />
          <path d="M18 21c1 1 2 1 3 0m6 0c1 1 2 1 3 0" />
          <path d="M20 27c2 2 6 2 8 0" />
          <path d="M24 4v4M21 6h6" />
        </svg>
      );
    case 'speech':
    default:
      return (
        <svg {...common}>
          <path d="M11 12h26v18H19l-8 7v-7h0V12Z" />
          <path d="M17 19h1m6 0h1m6 0h1" />
        </svg>
      );
  }
}

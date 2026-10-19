import type { CSSProperties } from 'react';



export function Blob({ color, radius, className = '' }: { color: string; radius: string; className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ background: color, borderRadius: radius }} />;
}

export function Dashes({
  color, className = '', rotate = 0, size = 44,
}: { color: string; className?: string; rotate?: number; size?: number }) {
  const style: CSSProperties = { width: size, height: size, transform: `rotate(${rotate}deg)` };
  return (
    <svg aria-hidden viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round"
      className={`pointer-events-none absolute ${className}`} style={style}>
      <path d="M7 9l7 8" /><path d="M21 4l3 11" /><path d="M20 30l12-4" />
    </svg>
  );
}

export function StarShape({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2.4" strokeLinejoin="round"
      className={`pointer-events-none absolute ${className}`}>
      <polygon points="12 2.5 14.8 8.8 21.5 9.3 16.4 13.7 18 20.3 12 16.8 6 20.3 7.6 13.7 2.5 9.3 9.2 8.8" />
    </svg>
  );
}

export function Heart({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round"
      className={`pointer-events-none absolute ${className}`}>
      <path d="M12 20.5S3.5 15.2 3.5 9.3A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.3C20.5 15.2 12 20.5 12 20.5z" />
    </svg>
  );
}

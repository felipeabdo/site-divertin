import Image from 'next/image';
import type { CSSProperties } from 'react';
import { PAL } from './data';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  tone?: string;
  icon?: string;
  
  onClick?: () => void;
};


export default function Photo({ src, alt, className = '', style, tone = PAL.orangeSoft, icon = '🧸', onClick }: Props) {
  const boxStyle: CSSProperties = { ...style, background: `linear-gradient(135deg, ${tone}, #fff)` };

  const content = src ? (
    <Image
      src={src}
      alt={onClick ? '' : alt}
      fill
      sizes="(max-width: 1023px) 100vw, 50vw"
      className="object-cover"
    />
  ) : (
    <span aria-hidden className="absolute inset-0 grid place-items-center text-6xl opacity-60">{icon}</span>
  );

  if (onClick && src) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Ampliar foto: ${alt}`}
        className={`group relative block cursor-zoom-in overflow-hidden transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#f7931e] ${className}`}
        style={boxStyle}
      >
        {content}
        <span
          aria-hidden
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-md transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={PAL.orange} strokeWidth="2.6" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /><path d="M10.5 8v5M8 10.5h5" />
          </svg>
        </span>
      </button>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={boxStyle}>
      {content}
    </div>
  );
}

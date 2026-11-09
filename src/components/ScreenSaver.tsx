'use client';

import { useEffect, useRef, useState } from 'react';
import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';

interface ScreenSaverProps {
  sources?: string[];
  src?: string;
  idleMinutes?: number;
  alt?: string;
  fadeDuration?: number;
  
}

type Phase = 'idle' | 'entering' | 'visible' | 'leaving';

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'pointerdown',
  'keydown',
  'touchstart',
  'wheel',
  'scroll',
] as const;

const WAKE_EVENTS = [
  'mousemove',
  'mousedown',
  'pointerdown',
  'keydown',
  'touchstart',
  'touchmove',
  'wheel',
] as const;

const WAKE_GRACE_MS = 700;
const DEFAULT_SOURCES = ['/descanso.gif'];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ScreenSaver({
  sources,
  src,
  idleMinutes = 1,
  alt = 'Descanso de tela',
  fadeDuration = 600,
}: ScreenSaverProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const { settings } = useSiteTheme();
  const isChristmasTheme = settings.theme === 'natal';

  const lastActivity = useRef(0);

  const list = Array.from(new Set(sources && sources.length > 0 ? sources : src ? [src] : DEFAULT_SOURCES));
  const listRef = useRef<string[]>(list);
  listRef.current = list;

  const bagRef = useRef<string[]>([]);
  const lastShownRef = useRef<string | null>(null);

  const pickNext = (): string => {
    const all = listRef.current;
    if (all.length === 1) return all[0];

    bagRef.current = bagRef.current.filter((s) => all.includes(s));

    if (bagRef.current.length === 0) {
      const bag = shuffle(all);
      if (bag[0] === lastShownRef.current) {
        const swapWith = 1 + Math.floor(Math.random() * (bag.length - 1));
        [bag[0], bag[swapWith]] = [bag[swapWith], bag[swapWith]];
      }
      bagRef.current = bag;
    }

    const next = bagRef.current.shift() as string;
    lastShownRef.current = next;
    return next;
  };

  const idleMs = Math.max(1000, idleMinutes * 60 * 1000);
  const isActive = phase === 'entering' || phase === 'visible';

  useEffect(() => {
    lastActivity.current = Date.now();
    const markActive = () => {
      lastActivity.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, markActive, { passive: true, capture: true }),
    );
    document.addEventListener('visibilitychange', markActive);
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive, { capture: true }));
      document.removeEventListener('visibilitychange', markActive);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'idle') return;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastActivity.current >= idleMs) {
        setCurrentSrc(pickNext());
        setPhase('entering');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, idleMs]);

  useEffect(() => {
    if (phase === 'entering') {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setPhase('visible'));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    if (phase === 'leaving') {
      const timer = setTimeout(() => setPhase('idle'), fadeDuration + 50);
      return () => clearTimeout(timer);
    }
  }, [phase, fadeDuration]);

  useEffect(() => {
    if (!isActive) return;
    const shownAt = Date.now();

    const wake = (e: Event) => {
      if (e.cancelable) {
        if (e.type === 'keydown') {
          const k = e as KeyboardEvent;
          if (!k.ctrlKey && !k.metaKey && !k.altKey && !/^F\d+$/.test(k.key)) e.preventDefault();
        } else if (e.type !== 'mousemove' && e.type !== 'pointerdown') {
          e.preventDefault();
        }
      }
      if (Date.now() - shownAt < WAKE_GRACE_MS) return;
      setPhase('leaving');
    };

    WAKE_EVENTS.forEach((e) =>
      window.addEventListener(e, wake, { passive: false, capture: true }),
    );
    return () => {
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake, { capture: true }));
    };
  }, [isActive]);

  if (phase === 'idle' || !currentSrc) return null;

  const screenSaverVariant = currentSrc.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
  // Cada arquivo natalino já contém o gorro em todos os quadros da animação.
  const displaySrc = isChristmasTheme && /\.webp$/i.test(currentSrc)
    ? currentSrc.replace(/\.webp$/i, '-natal.webp')
    : currentSrc;

  return (
    <div
      id="screen-saver"
      role="status"
      aria-label={alt}
      className="screen-saver fixed inset-0 z-[9990] isolate overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        opacity: phase === 'visible' ? 1 : 0,
        transition: `opacity ${fadeDuration}ms ease`,
        minHeight: '100svh',
        height: '100dvh',
      }}
    >
      <div className={`screen-saver__frame screen-saver__frame--${screenSaverVariant}`}>
        <img
          key={displaySrc}
          src={displaySrc}
          alt={alt}
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className="screen-saver__animation"
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
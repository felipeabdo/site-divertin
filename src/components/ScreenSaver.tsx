'use client';

import { useEffect, useRef, useState } from 'react';

interface ScreenSaverProps {
  
  src?: string;

  
  idleMinutes?: number;

  
  width?: number | string;

  
  height?: number | string;

  
  maxWidth?: string;

  
  alt?: string;

  
  backgroundColor?: string;

  
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

export default function ScreenSaver({
  src = '/descanso.gif',
  idleMinutes = 5,
  width = 220,
  height,
  maxWidth = '80vw',
  alt = 'Descanso de tela',
  backgroundColor = '#ffffff',
  fadeDuration = 600,
}: ScreenSaverProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  
  const lastActivity = useRef(0);

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

  
  
  // A imagem é carregada somente quando a tela de descanso é exibida.
  // Isso evita baixar o GIF de 3,5 MB para visitantes que continuam navegando.

  if (phase === 'idle') return null;

  return (
    <div
      id="screen-saver"
      role="status"
      aria-label={alt}
      className="fixed inset-0 z-[9990] flex items-center justify-center"
      style={{
        backgroundColor,
        opacity: phase === 'visible' ? 1 : 0,
        transition: `opacity ${fadeDuration}ms ease`,
      }}
    >
      {}
      {}
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: height === undefined ? 'auto' : typeof height === 'number' ? `${height}px` : height,
          maxWidth,
          objectFit: 'contain',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

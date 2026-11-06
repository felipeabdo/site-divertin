
'use client';

import { useEffect, useRef, useState } from 'react';

interface ScreenSaverProps {
  src?: string | string[];

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

  const [selectedGif, setSelectedGif] = useState<string>('/descanso.gif');

  const lastActivity = useRef(0);

  // Guarda o último GIF exibido para evitar repetições.
  const previousGif = useRef<string | null>(null);

  const idleMs = Math.max(1000, idleMinutes * 60 * 1000);

  const isActive = phase === 'entering' || phase === 'visible';

  // Monitora as atividades do usuário.
  useEffect(() => {
    lastActivity.current = Date.now();

    const markActive = () => {
      lastActivity.current = Date.now();
    };

    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, markActive, {
        passive: true,
        capture: true,
      }),
    );

    document.addEventListener('visibilitychange', markActive);

    return () => {
      ACTIVITY_EVENTS.forEach((e) =>
        window.removeEventListener(e, markActive, { capture: true }),
      );

      document.removeEventListener('visibilitychange', markActive);
    };
  }, []);

  // Verifica o tempo de inatividade e sorteia um GIF.
  useEffect(() => {
    if (phase !== 'idle') return;

    const timer = setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastActivity.current >= idleMs
      ) {
        const gifs = Array.isArray(src) ? src : [src];

        // Remove valores duplicados para evitar repetições desnecessárias.
        const uniqueGifs = [...new Set(gifs)];

        // Evita selecionar o mesmo GIF da ativação anterior.
        const availableGifs =
          uniqueGifs.length > 1
            ? uniqueGifs.filter((gif) => gif !== previousGif.current)
            : uniqueGifs;

        // Sorteia um GIF entre os disponíveis.
        const randomGif =
          availableGifs[Math.floor(Math.random() * availableGifs.length)];

        setSelectedGif(randomGif);

        previousGif.current = randomGif;

        setPhase('entering');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, idleMs, src]);

  // Controla as transições de entrada e saída.
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

  // Detecta interações para sair do modo de descanso.
  useEffect(() => {
    if (!isActive) return;

    const shownAt = Date.now();

    const wake = (e: Event) => {
      if (e.cancelable) {
        if (e.type === 'keydown') {
          const k = e as KeyboardEvent;

          if (
            !k.ctrlKey &&
            !k.metaKey &&
            !k.altKey &&
            !/^F\d+$/.test(k.key)
          ) {
            e.preventDefault();
          }
        } else if (e.type !== 'mousemove' && e.type !== 'pointerdown') {
          e.preventDefault();
        }
      }

      if (Date.now() - shownAt < WAKE_GRACE_MS) return;

      setPhase('leaving');
    };

    WAKE_EVENTS.forEach((e) =>
      window.addEventListener(e, wake, {
        passive: false,
        capture: true,
      }),
    );

    return () => {
      WAKE_EVENTS.forEach((e) =>
        window.removeEventListener(e, wake, { capture: true }),
      );
    };
  }, [isActive]);

  // Não renderiza nada enquanto o site está ativo.
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
      <img
        src={selectedGif}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height:
            height === undefined
              ? 'auto'
              : typeof height === 'number'
                ? `${height}px`
                : height,
          maxWidth,
          objectFit: 'contain',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

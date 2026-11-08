'use client';

import { useEffect, useRef, useState } from 'react';

/** Estrutura de ajustes personalizados por arquivo/animação */
export interface ScreenSaverOverride {
  /** Fator de escala extra (ex: 1.3 para aumentar 30%, 0.8 para diminuir 20%) */
  scale?: number;
  /** Deslocamento horizontal em pixels (positivo para direita, negativo para esquerda) */
  translateX?: number;
  /** Deslocamento vertical em pixels (positivo para baixo, negativo para cima) */
  translateY?: number;
}

interface ScreenSaverProps {
  sources?: string[];
  src?: string;
  idleMinutes?: number;
  width?: number | string;
  height?: number | string;
  maxWidth?: string;
  alt?: string;
  backgroundColor?: string;
  fadeDuration?: number;
  
  /** 
   * Novo objeto para configurar regras específicas por arquivo.
   * Exemplo: { '/descanso3.webp': { scale: 1.3, translateX: -30, translateY: 20 } }
   */
  overrides?: Record<string, ScreenSaverOverride>;
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
  width = 220,
  height,
  maxWidth = '80vw',
  alt = 'Descanso de tela',
  backgroundColor = '#ffffff',
  fadeDuration = 600,
  overrides = {}, // Recebe as regras customizadas
}: ScreenSaverProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSrc, setCurrentSrc] = useState<string>('');

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

  // Busca regras customizadas para o arquivo atual (se houver)
  const currentOverride = overrides[currentSrc] || {};
  
  // Cálculo de dimensões base com suporte ao redimensionamento customizado
  const baseWidth = typeof width === 'number' ? width : parseFloat(width) || 220;
  const finalWidth = currentOverride.scale ? baseWidth * currentOverride.scale : width;

  // Monta propriedades de transformação CSS para os deslocamentos em pixels
  const transformParts: string[] = [];
  if (currentOverride.translateX !== undefined) {
    transformParts.push(`translateX(${currentOverride.translateX}px)`);
  }
  if (currentOverride.translateY !== undefined) {
    transformParts.push(`translateY(${currentOverride.translateY}px)`);
  }
  const finalTransform = transformParts.length > 0 ? transformParts.join(' ') : undefined;

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
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{
          width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
          height: height === undefined ? 'auto' : typeof height === 'number' ? `${height}px` : height,
          maxWidth,
          objectFit: 'contain',
          userSelect: 'none',
          transform: finalTransform, // Aplica o deslocamento x/y de forma fluida
        }}
      />
    </div>
  );
}
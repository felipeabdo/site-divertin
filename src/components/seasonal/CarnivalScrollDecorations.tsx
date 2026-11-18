'use client';

import { useEffect, useRef } from 'react';
import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';

const PEOPLE = {
  man: 'https://freesvg.org/img/clowncaj.png',
  woman: 'https://freesvg.org/img/comic-dancer.png',
  boy: 'https://freesvg.org/img/ragazzo.png',
  children: 'https://freesvg.org/img/gahag-dance.png',
} as const;

type PersonKey = keyof typeof PEOPLE;
type Pair = { left: PersonKey; right: PersonKey };

const PAIRS: Pair[] = [
  { left: 'man', right: 'woman' },
  { left: 'children', right: 'boy' },
  { left: 'woman', right: 'boy' },
  { left: 'man', right: 'children' },
  { left: 'boy', right: 'woman' },
  { left: 'children', right: 'man' },
];

const CONFETTI_COLORS = ['#ef4b91', '#f5c34b', '#36ae91', '#9273c5', '#58a6d6', '#ff9c58'];

function addPerson(
  layer: HTMLElement,
  person: PersonKey,
  side: 'left' | 'right',
  top: number,
) {
  const wrapper = document.createElement('div');
  wrapper.className = `carnival-scroll-person carnival-scroll-person--${side}`;
  wrapper.style.top = `${top}px`;
  wrapper.style.setProperty('--person-entry-x', side === 'left' ? '-135%' : '135%');
  wrapper.style.setProperty('--person-exit-x', side === 'left' ? '-145%' : '145%');

  const image = document.createElement('img');
  image.src = PEOPLE[person];
  image.alt = '';
  image.draggable = false;
  image.decoding = 'async';
  image.className = 'carnival-scroll-person__image';
  image.addEventListener('error', () => wrapper.remove(), { once: true });
  wrapper.appendChild(image);
  wrapper.addEventListener('animationend', () => wrapper.remove(), { once: true });
  layer.appendChild(wrapper);
}

function addConfetti(
  layer: HTMLElement,
  side: 'left' | 'right',
  top: number,
  index: number,
) {
  const piece = document.createElement('i');
  const shape = index % 6 === 0 ? 'dot' : index % 5 === 0 ? 'streamer' : 'paper';
  piece.className = `carnival-scroll-confetti carnival-scroll-confetti--${shape}`;
  piece.style.left = side === 'left'
    ? `${3 + Math.random() * 34}%`
    : `${63 + Math.random() * 34}%`;
  piece.style.top = `${top + Math.random() * 75}px`;
  piece.style.backgroundColor = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  piece.style.setProperty('--paper-drift', `${Math.round((Math.random() - 0.5) * 190)}px`);
  piece.style.setProperty('--paper-spin', `${Math.round(220 + Math.random() * 760)}deg`);
  piece.style.setProperty('--paper-delay', `${Math.round(Math.random() * 850)}ms`);
  piece.dataset.startTop = String(top + 75);
  piece.addEventListener('animationend', () => piece.remove(), { once: true });
  layer.appendChild(piece);
}

/**
 * Page-bound carnival animation. Each marked section launches characters from
 * its side edges once as it enters the viewport; confetti is absolutely
 * positioned in the document and falls to the bottom of that page.
 */
export default function CarnivalScrollDecorations() {
  const { settings } = useSiteTheme();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings.theme !== 'carnaval') return;

    const layer = layerRef.current;
    const page = layer?.parentElement;
    if (!layer || !page) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const sections = Array.from(page.querySelectorAll<HTMLElement>('[data-carnival-section]'));
    if (sections.length === 0) return;

    let pairIndex = 0;
    let confettiIndex = 0;
    const seen = new WeakSet<HTMLElement>();

    const updateLayerHeight = () => {
      const pageHeight = Math.max(page.scrollHeight, page.offsetHeight);
      layer.style.height = `${pageHeight}px`;
      layer.querySelectorAll<HTMLElement>('.carnival-scroll-confetti').forEach((piece) => {
        const startTop = Number(piece.dataset.startTop || 0);
        const fallDistance = Math.max(260, pageHeight - startTop + 100);
        piece.style.setProperty('--paper-fall-distance', `${fallDistance}px`);
        piece.style.setProperty('--paper-duration', `${Math.min(28, Math.max(8, fallDistance / 390))}s`);
      });
    };

    const emitForSection = (section: HTMLElement) => {
      if (seen.has(section)) return;
      seen.add(section);

      const pageRect = page.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = Math.max(0, sectionRect.top - pageRect.top);
      const characterTop = sectionTop + Math.min(155, Math.max(54, sectionRect.height * 0.18));
      const pair = PAIRS[pairIndex % PAIRS.length];
      pairIndex += 1;

      addPerson(layer, pair.left, 'left', characterTop);
      addPerson(layer, pair.right, 'right', characterTop + 42);

      for (let index = 0; index < 18; index += 1) {
        addConfetti(layer, index % 2 === 0 ? 'left' : 'right', characterTop + 22, confettiIndex);
        confettiIndex += 1;
      }
      updateLayerHeight();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) emitForSection(entry.target as HTMLElement);
      });
    }, { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));

    const resizeObserver = new ResizeObserver(updateLayerHeight);
    resizeObserver.observe(page);
    window.addEventListener('load', updateLayerHeight, { once: true });
    updateLayerHeight();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('load', updateLayerHeight);
      layer.replaceChildren();
    };
  }, [settings.theme]);

  return <div ref={layerRef} className="carnival-scroll-layer" aria-hidden="true" />;
}

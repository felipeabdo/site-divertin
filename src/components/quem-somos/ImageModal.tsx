'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Dashes } from './Decor';
import { PAL } from './data';

export type ModalImage = { src: string; alt: string };

type Props = {
  images: ModalImage[];
  
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};


export default function ImageModal({ images, index, onClose, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const total = images.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || total === 0) return;
      onChange((index + dir + total) % total);
    },
    [index, total, onChange],
  );

  useEffect(() => {
  if (!isOpen) return;

  
  const scrollY = window.scrollY;
  const previousOverflow = document.body.style.overflow;
  const previousPaddingRight = document.body.style.paddingRight;

  
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  closeRef.current?.focus();

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };
  window.addEventListener('keydown', onKey);

  return () => {
    
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
    window.scrollTo(0, scrollY);
    window.removeEventListener('keydown', onKey);
  };
}, [isOpen, onClose, go]);



  if (index === null) return null;
  const img = images[index];
  
  if (!img) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
      
      style={{ background: 'rgba(8,8,8,.28)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="relative max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Dashes color={PAL.lime} className="-left-6 -top-6 hidden md:block" size={44} rotate={-20} />
        <Dashes color={PAL.orange} className="-bottom-6 -right-6 hidden md:block" size={44} rotate={160} />

        <div className="rounded-[32px] bg-white p-3 shadow-2xl md:p-4" style={{ border: `4px solid ${PAL.orangeSoft}` }}>
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="mx-auto block max-h-[74vh] w-auto max-w-full rounded-[22px] object-contain"
          />
          <p className="mt-3 text-center text-sm font-semibold text-gray-600">
            {img.alt}
            {total > 1 && <span className="ml-2 text-gray-400">{index + 1} / {total}</span>}
          </p>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -right-2 -top-2 grid h-11 w-11 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white md:-right-4 md:-top-4"
          style={{ background: PAL.orange }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {total > 1 && (
          <>
            <NavButton side="left" label="Foto anterior" onClick={() => go(-1)} />
            <NavButton side="right" label="Próxima foto" onClick={() => go(1)} />
          </>
        )}
      </div>
    </div>
  );
}

function NavButton({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-[45%] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white ${
        side === 'left' ? 'left-2 md:-left-5' : 'right-2 md:-right-5'
      }`}
      style={{ background: PAL.pink }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={side === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );
}

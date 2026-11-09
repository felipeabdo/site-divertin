"use client";

import { useState } from "react";

type InteractiveMapProps = {
  src: string;
  title: string;
};

/**
 * O Google Maps só é requisitado quando a pessoa escolhe abrir o mapa.
 * Isso evita carregar scripts/recursos de terceiros durante a abertura da página.
 */
export default function InteractiveMap({ src, title }: InteractiveMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <iframe
        title={title}
        src={src}
        className="h-[380px] w-full md:h-[470px]"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="flex h-[380px] w-full flex-col items-center justify-center gap-4 bg-[#F6F1E8] px-6 text-center md:h-[470px]">
      <span
        aria-hidden="true"
        className="grid h-16 w-16 place-items-center rounded-full bg-white text-[#CC4B00] shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </span>
      <div className="max-w-xs">
        <p className="font-bold text-gray-800">Mapa da Clínica Divertin</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">
          O mapa interativo será carregado somente quando você solicitar.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsLoaded(true)}
        className="rounded-full bg-[#CC4B00] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#A83D00] focus:outline-none focus:ring-2 focus:ring-[#CC4B00] focus:ring-offset-2"
      >
        Carregar mapa interativo
      </button>
    </div>
  );
}

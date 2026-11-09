"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ScreenSaver = dynamic(() => import("./ScreenSaver"), {
  ssr: false,
  loading: () => null,
});

type DeferredScreenSaverProps = {
  sources: string[];
  idleMinutes?: number;
};

/**
 * O código do protetor de tela é baixado depois da janela crítica de carregamento.
 * A pequena espera não afeta o conteúdo principal nem a navegação do site.
 */
export default function DeferredScreenSaver({
  sources,
  idleMinutes = 1,
}: DeferredScreenSaverProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEnabled(true), 12_000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!enabled) return null;

  return (
    <ScreenSaver
      sources={sources}
      idleMinutes={idleMinutes}
    />
  );
}

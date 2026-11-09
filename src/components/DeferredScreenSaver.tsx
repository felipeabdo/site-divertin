"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useOfflineExperience } from "@/components/offline/OfflineExperience";

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
 * O screensaver só existe enquanto a conexão estiver disponível: ao entrar no
 * modo offline, ele é desmontado imediatamente e a página original é revelada.
 */
export default function DeferredScreenSaver({
  sources,
  idleMinutes = 1,
}: DeferredScreenSaverProps) {
  const [enabled, setEnabled] = useState(false);
  const { isOffline } = useOfflineExperience();

  useEffect(() => {
    const timer = window.setTimeout(() => setEnabled(true), 12_000);
    return () => window.clearTimeout(timer);
  }, []);

  // Também impede que o screensaver seja montado caso o atraso de carregamento
  // termine durante uma queda de conexão.
  if (!enabled || isOffline) return null;

  return (
    <ScreenSaver
      sources={sources}
      idleMinutes={idleMinutes}
    />
  );
}

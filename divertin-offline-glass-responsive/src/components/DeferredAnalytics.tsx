'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/** Tempo máximo (ms) de espera, depois do load, antes de carregar o GA mesmo sem interação. */
const MAX_WAIT_AFTER_LOAD_MS = 3500;

/**
 * Carrega o Google Analytics só depois que a página terminou de carregar e
 * ficou ociosa (ou na primeira interação do visitante).
 *
 * O script do GTM/GA tem ~170 KB e competia com a imagem do hero e com o JS da
 * página no mobile (aparecia em "Terceiros", "JavaScript não usado" e nas
 * tarefas longas do relatório).
 */
export default function DeferredAnalytics({ gaId }: { gaId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    let started = false;

    const cleanup = () => {
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', onLoad);
      if (timer) window.clearTimeout(timer);
    };

    function start() {
      if (started) return;
      started = true;
      cleanup();
      setReady(true);
    }

    function onLoad() {
      timer = window.setTimeout(start, MAX_WAIT_AFTER_LOAD_MS);
    }

    INTERACTION_EVENTS.forEach((e) =>
      window.addEventListener(e, start, { once: true, passive: true }),
    );

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return cleanup;
  }, []);

  return ready ? <GoogleAnalytics gaId={gaId} /> : null;
}

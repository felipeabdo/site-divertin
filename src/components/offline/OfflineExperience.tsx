'use client';

import Image from 'next/image';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { OFFLINE_CONFIG } from '@/lib/offlineConfig';
import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';
import {
  getTabSessionId,
  loadQueuedContacts,
  removeQueuedContact,
  saveQueuedContact,
  submitContactPayload,
} from '@/lib/offlineQueue';
import type { ContactPayload, QueuedContact } from '@/lib/offlineQueue';

type OfflineContextValue = {
  isOffline: boolean;
  queueContact: (payload: ContactPayload) => Promise<void>;
  reportConnectionLost: () => void;
};

type QueueNotice = {
  tone: 'success' | 'warning';
  title: string;
  message: string;
};

type OverlayMode = 'offline' | 'reconnected' | null;

// Persiste apenas nesta aba: a navegação offline recarrega o documento para usar o cache do SW.
const OFFLINE_PROMPT_DISMISSED_KEY = 'divertin:offline-prompt-dismissed';
// Mantém o estado offline entre recargas completas feitas pelo service worker.
const OFFLINE_STATE_KEY = 'divertin:connection-offline';

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function useOfflineExperience() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineExperience precisa ser usado dentro de OfflineExperience.');
  }
  return context;
}

function WifiOffIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8.8a15.4 15.4 0 0 1 16.5-3.2M5.5 12.3a10.2 10.2 0 0 1 8.8-2.1M9.2 15.9a4.8 4.8 0 0 1 3.2-.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m3 3 18 18M12 20h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function WifiIcon({ className = 'h-14 w-14 text-[#2A9D8F]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <path d="M6 23C20 10 44 10 58 23M15 33c10-9 24-9 34 0M24 43c5-4 11-4 16 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="52" r="3.8" fill="currentColor" />
      <circle cx="49" cy="45" r="11" fill="#2A9D8F" stroke="white" strokeWidth="2" />
      <path d="m44 45 3.5 3.5 6.5-7" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function OfflineExperience({ children }: { children: ReactNode }) {
  const { settings } = useSiteTheme();
  const isChristmasTheme = settings.theme === 'natal';
  const [isOffline, setIsOffline] = useState(false);
  const [overlay, setOverlay] = useState<OverlayMode>(null);
  const [pendingItems, setPendingItems] = useState<QueuedContact[]>([]);
  const [queueLoaded, setQueueLoaded] = useState(false);
  const [notice, setNotice] = useState<QueueNotice | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const sessionIdRef = useRef('');
  const pendingRef = useRef<QueuedContact[]>([]);
  const isOfflineRef = useRef<boolean | null>(null);
  const flushAttemptedRef = useRef(false);
  const flushInProgressRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePending = useCallback((items: QueuedContact[]) => {
    pendingRef.current = items;
    setPendingItems(items);
  }, []);

  const markOffline = useCallback(() => {
    isOfflineRef.current = true;
    setIsOffline(true);
    flushAttemptedRef.current = false;

    try {
      // A navegação offline usa recargas completas; este sinal sobrevive a elas.
      window.sessionStorage.setItem(OFFLINE_STATE_KEY, '1');
    } catch {
      // A detecção por navigator.onLine e pelo teste de conectividade continua ativa.
    }

    let promptWasDismissed = false;
    try {
      promptWasDismissed = window.sessionStorage.getItem(OFFLINE_PROMPT_DISMISSED_KEY) === '1';
    } catch {
      // Se o armazenamento da sessão estiver bloqueado, o aviso continua disponível.
    }
    if (!promptWasDismissed) setOverlay('offline');
  }, []);

  const verifyConnection = useCallback(async () => {
    if (typeof navigator === 'undefined') return;

    if (!navigator.onLine) {
      markOffline();
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OFFLINE_CONFIG.connectivityTimeoutMs);

    try {
      const response = await fetch(`/api/health?check=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('A conexão com o servidor ainda não foi restabelecida.');

      const wasOffline = isOfflineRef.current === true;
      isOfflineRef.current = false;
      setIsOffline(false);

      if (wasOffline) {
        flushAttemptedRef.current = false;
        try {
          // A próxima queda poderá mostrar novamente o aviso inicial e o indicador
          // só reaparecerá quando uma nova perda de conexão for detectada.
          window.sessionStorage.removeItem(OFFLINE_PROMPT_DISMISSED_KEY);
          window.sessionStorage.removeItem(OFFLINE_STATE_KEY);
        } catch {
          // A experiência não depende de sessionStorage para continuar funcionando.
        }
        setOverlay('reconnected');
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => setOverlay(null), OFFLINE_CONFIG.reconnectionScreenDurationMs);
      }
    } catch {
      markOffline();
    } finally {
      clearTimeout(timeout);
    }
  }, [markOffline]);

  useEffect(() => {
    sessionIdRef.current = getTabSessionId();

    // Restaura o estado conhecido antes do primeiro teste de rede, evitando que
    // o indicador desapareça durante a recarga de uma página aberta offline.
    try {
      if (window.sessionStorage.getItem(OFFLINE_STATE_KEY) === '1') {
        isOfflineRef.current = true;
        setIsOffline(true);
      }
    } catch {
      // O teste ativo de conectividade abaixo continua sendo a fonte alternativa.
    }

    let active = true;
    loadQueuedContacts(sessionIdRef.current)
      .then((items) => {
        if (!active) return;
        const merged = [...items];
        for (const pending of pendingRef.current) {
          if (!merged.some((item) => item.id === pending.id)) merged.push(pending);
        }
        merged.sort((a, b) => a.createdAt - b.createdAt);
        updatePending(merged);
      })
      .catch(() => {
        if (!active) return;
        setNotice({
          tone: 'warning',
          title: 'Armazenamento offline indisponível',
          message: 'Este navegador não permitiu guardar envios pendentes. Mantenha esta página aberta até a conexão voltar.',
        });
      })
      .finally(() => {
        if (active) setQueueLoaded(true);
      });

    void verifyConnection();
    const interval = window.setInterval(() => void verifyConnection(), OFFLINE_CONFIG.connectivityCheckIntervalMs);
    const handleOffline = () => markOffline();
    const handleOnline = () => void verifyConnection();

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // A experiência de conexão continua funcional mesmo quando o SW não pode ser instalado.
      });
    }

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [markOffline, updatePending, verifyConnection]);

  const queueContact = useCallback(async (payload: ContactPayload) => {
    if (!sessionIdRef.current) sessionIdRef.current = getTabSessionId();

    const item: QueuedContact = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sessionId: sessionIdRef.current,
      createdAt: Date.now(),
      payload,
    };

    // IndexedDB conserva também o arquivo anexado durante a navegação entre páginas.
    await saveQueuedContact(item);
    updatePending([...pendingRef.current, item]);
    setNotice({
      tone: 'success',
      title: 'Formulário guardado nesta aba!',
      message: 'O conteúdo será enviado quando a conexão voltar. Mantenha esta aba aberta até a confirmação do envio.',
    });
  }, [updatePending]);

  const flushPendingQueue = useCallback(async () => {
    if (flushInProgressRef.current || pendingRef.current.length === 0) return;

    flushInProgressRef.current = true;
    setIsRetrying(true);
    let sentCount = 0;

    try {
      for (const item of [...pendingRef.current]) {
        const message = await submitContactPayload(item.payload);
        await removeQueuedContact(item.id);
        updatePending(pendingRef.current.filter((pending) => pending.id !== item.id));
        sentCount += 1;
        setNotice({
          tone: 'success',
          title: 'Envio concluído!',
          message: message || 'Um formulário pendente foi enviado com sucesso.',
        });
      }

      if (sentCount > 1) {
        setNotice({
          tone: 'success',
          title: 'Tudo enviado!',
          message: `${sentCount} formulários pendentes foram enviados com sucesso.`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir o envio.';
      setNotice({
        tone: 'warning',
        title: 'A conexão voltou, mas o envio continua pendente',
        message: `${message} O conteúdo permanece guardado nesta aba; você pode tentar novamente abaixo.`,
      });

      if (error instanceof TypeError || !navigator.onLine) {
        markOffline();
      }
    } finally {
      flushInProgressRef.current = false;
      setIsRetrying(false);
      flushAttemptedRef.current = true;
    }
  }, [markOffline, updatePending]);

  useEffect(() => {
    if (isOffline || !queueLoaded || pendingItems.length === 0 || flushAttemptedRef.current) return;
    flushAttemptedRef.current = true;
    void flushPendingQueue();
  }, [flushPendingQueue, isOffline, pendingItems.length, queueLoaded]);

  const reportConnectionLost = useCallback(() => {
    markOffline();
  }, [markOffline]);

  const dismissOfflineOverlay = useCallback(() => {
    try {
      window.sessionStorage.setItem(OFFLINE_PROMPT_DISMISSED_KEY, '1');
    } catch {
      // O botão ainda fecha o aviso mesmo se o navegador bloquear armazenamento.
    }
    setOverlay(null);
  }, []);

  const contextValue = useMemo<OfflineContextValue>(() => ({
    isOffline,
    queueContact,
    reportConnectionLost,
  }), [isOffline, queueContact, reportConnectionLost]);

  function handleOfflineNavigation(event: MouseEvent<HTMLDivElement>) {
    if (!isOffline) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.hash && destination.pathname === window.location.pathname) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    // Força uma navegação HTML completa. O service worker consegue servir a página já armazenada
    // mesmo quando a navegação cliente do Next tentaria buscar um payload RSC pela rede.
    event.preventDefault();
    window.location.assign(destination.href);
  }

  return (
    <OfflineContext.Provider value={contextValue}>
      <div className="contents" onClickCapture={handleOfflineNavigation}>
        {children}
      </div>

      {isOffline && !overlay && (
        <div
          className="divertin-offline-indicator"
          role="status"
          aria-live="polite"
          aria-label={`Você está navegando offline${pendingItems.length > 0 ? `, ${pendingItems.length} envio(s) pendente(s)` : ''}`}
        >
          <span className="divertin-offline-indicator__dot" aria-hidden="true" />
          <WifiOffIcon className="h-4 w-4 shrink-0" />
          <span>Navegação offline</span>
          {pendingItems.length > 0 && <span className="divertin-offline-indicator__count">{pendingItems.length}</span>}
        </div>
      )}

      {notice && !overlay && (
        <div className="fixed bottom-5 right-5 z-[9995] flex w-[min(92vw,420px)] gap-3 rounded-[24px] border border-white/80 bg-white/85 p-4 text-[#343434] shadow-2xl shadow-black/15 backdrop-blur-2xl" role="status" aria-live="polite">
          <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${notice.tone === 'success' ? 'bg-[#2A9D8F]' : 'bg-[#CC4B00]'}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{notice.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{notice.message}</p>
            {notice.tone === 'warning' && pendingItems.length > 0 && !isOffline && (
              <button
                type="button"
                onClick={() => {
                  flushAttemptedRef.current = false;
                  void flushPendingQueue();
                }}
                disabled={isRetrying}
                className="mt-3 rounded-full bg-[#2A9D8F] px-4 py-2 text-xs font-black text-white transition hover:bg-[#23877C] disabled:opacity-60"
              >
                {isRetrying ? 'Tentando...' : 'Tentar envio novamente'}
              </button>
            )}
          </div>
          <button type="button" onClick={() => setNotice(null)} aria-label="Fechar aviso" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-gray-500 transition hover:bg-black/5 hover:text-gray-900">
            <CloseIcon />
          </button>
        </div>
      )}

      {overlay === 'offline' && (
        <div className="divertin-network-overlay divertin-network-overlay--offline" role="dialog" aria-modal="true" aria-labelledby="offline-title">
          <div className="divertin-network-overlay__ambient" aria-hidden="true" />
          <div className="divertin-network-overlay__content divertin-network-overlay__content--offline">
            <div className="divertin-network-overlay__art divertin-network-overlay__art--offline">
              <span className="divertin-network-overlay__orbit divertin-network-overlay__orbit--offline" aria-hidden="true" />
              <Image
                src={isChristmasTheme ? '/mascote-offline-glass-natal.webp' : '/mascote-offline-glass.webp'}
                alt="Mascote da Divertin tentando encontrar o sinal de internet"
                width={1065}
                height={800}
                priority
                unoptimized
                className="divertin-network-overlay__image divertin-network-overlay__image--offline"
              />
            </div>
            <section className="divertin-network-overlay__copy divertin-network-overlay__copy--offline">
              <div className="divertin-network-overlay__eyebrow divertin-network-overlay__eyebrow--offline">
                <WifiOffIcon className="h-4 w-4" />
                <span>Conexão interrompida</span>
              </div>
              <h1 id="offline-title" className="divertin-network-overlay__title">
                Ops! A internet saiu para tomar um café.
              </h1>
              <p className="divertin-network-overlay__description">
                A conexão caiu por aqui, mas você ainda pode explorar as páginas que já foram armazenadas neste dispositivo.
              </p>
              <button type="button" onClick={dismissOfflineOverlay} className="divertin-network-overlay__action divertin-network-overlay__action--offline">
                <span className="divertin-network-overlay__action-icon" aria-hidden="true">↗</span>
                Continuar navegando
              </button>
              <p className="divertin-network-overlay__hint">
                Este aviso não vai interromper as próximas páginas. Um pequeno sinal ficará visível enquanto você estiver offline.
              </p>
            </section>
          </div>
        </div>
      )}

      {overlay === 'reconnected' && (
        <div className="divertin-network-overlay divertin-network-overlay--reconnected" role="status" aria-live="assertive">
          <div className="divertin-network-overlay__ambient" aria-hidden="true" />
          <div className="divertin-network-overlay__content divertin-network-overlay__content--reconnected">
            <section className="divertin-network-overlay__copy divertin-network-overlay__copy--reconnected">
              <div className="divertin-network-overlay__eyebrow divertin-network-overlay__eyebrow--online">
                <WifiIcon className="h-7 w-7 text-[#2A9D8F]" />
                <span>Sinal encontrado!</span>
              </div>
              <h2 className="divertin-network-overlay__title">
                Conexão restabelecida!
              </h2>
              <p className="divertin-network-overlay__description">
                Que bom ter você de volta! A navegação online já está disponível novamente.
              </p>
              {pendingItems.length > 0 && (
                <p className="divertin-network-overlay__pending">
                  {pendingItems.length} formulário(s) aguardando tentativa de envio.
                </p>
              )}
            </section>
            <div className="divertin-network-overlay__art divertin-network-overlay__art--online">
              <span className="divertin-network-overlay__orbit divertin-network-overlay__orbit--online" aria-hidden="true" />
              <Image
                src={isChristmasTheme ? '/mascote-online-glass-natal.webp' : '/mascote-online-glass.webp'}
                alt="Mascote da Divertin comemorando a volta da conexão"
                width={253}
                height={338}
                priority
                unoptimized
                className="divertin-network-overlay__image divertin-network-overlay__image--online"
              />
            </div>
          </div>
        </div>
      )}
    </OfflineContext.Provider>
  );
}

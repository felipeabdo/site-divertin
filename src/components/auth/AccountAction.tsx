'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/auth/SiteExperienceProvider';

interface AccountActionProps {
  variant?: 'desktop' | 'mobile';
}

/**
 * A ação de conta começa sempre como um link textual para "Entrar".
 * O estado da sessão só é aplicado depois da hidratação, mantendo o HTML
 * inicial idêntico no servidor e no primeiro render do navegador.
 * O atalho desktop permanece textual; no menu mobile, o item acompanha
 * a mesma estrutura visual dos demais links (ícone, texto e seta).
 */
export default function AccountAction({
  variant = 'desktop',
}: AccountActionProps) {
  const { user, loading } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const isMobile = variant === 'mobile';
  const authenticated = hydrated && !loading && Boolean(user);
  const href = authenticated ? '/configuracoes' : '/login';
  const label = authenticated ? 'Configurações' : 'Entrar';
  const accountClass = authenticated ? 'settings' : 'login';

  const button = (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`divertin-account-action divertin-account-action--${isMobile ? 'mobile' : 'desktop'} divertin-account-action--${accountClass}`}
    >
      {isMobile ? (
        <>
          <div className="divertin-account-action__icon-wrap" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="divertin-account-action__menu-icon"
              focusable="false"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.7-3.4 3.2-5.2 7-5.2s6.3 1.8 7 5.2" />
            </svg>
          </div>
          <span className="divertin-account-action__menu-label">{label}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="divertin-account-action__menu-arrow"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 12h16M13.5 5.5 20 12l-6.5 6.5" />
          </svg>
        </>
      ) : (
        <span>{label}</span>
      )}
    </Link>
  );

  // O item mobile já faz parte da lista do menu e mantém o mesmo HTML inicial.
  if (isMobile) return button;

  // O atalho desktop fica fora da NavBar, mas só é criado após a hidratação.
  if (!hydrated) return null;

  return createPortal(button, document.body);
}

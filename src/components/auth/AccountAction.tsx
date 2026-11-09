
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/auth/SiteExperienceProvider';

interface AccountActionProps {
  variant?: 'desktop' | 'mobile';
}

export default function AccountAction({
  variant = 'desktop',
}: AccountActionProps) {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = variant === 'mobile';
  const href = user ? '/configuracoes' : '/login';
  const label = user ? 'Configurações' : 'Entrar';

  const button = (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`divertin-account-action ${
        isMobile
          ? 'divertin-account-action--mobile'
          : 'divertin-account-action--desktop'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      >
        {user ? (
          <>
            <path d="M12 8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            <path d="m19.4 15 .1.1 1.1.8-1.3 2.2-1.3-.5a7.5 7.5 0 0 1-1.5.9l-.2 1.4h-2.6l-.2-1.4a7.5 7.5 0 0 1-1.5-.9l-1.3.5-1.3-2.2 1.1-.9a7.5 7.5 0 0 1 0-1.8l-1.1-.8 1.3-2.2 1.3.5a7.5 7.5 0 0 1 1.5-.9l.2-1.4h2.6l.2 1.4a7.5 7.5 0 0 1 1.5.9l1.3-.5 1.3 2.2-1.1.8a7.5 7.5 0 0 1 0 1.8Z" />
          </>
        ) : (
          <>
            <path d="M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5" />
            <path d="M10 16l4-4-4-4M14 12H3" />
          </>
        )}
      </svg>

      {(!user || isMobile || loading) && (
        <span>{loading ? 'Carregando...' : label}</span>
      )}
    </Link>
  );

  // Mobile: permanece dentro do menu.
  if (isMobile) return button;

  // Desktop: renderiza diretamente no body, fora da NavBar.
  if (!mounted) return null;

  return createPortal(button, document.body);
}


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
      } ${user ? 'divertin-account-action--settings' : 'divertin-account-action--login'}`}
    >
      {user && (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="divertin-account-action__gear">
          <path d="M41 5 Q41 2 44 2 H56 Q59 2 59 5 V10 Q59 15 64 17 Q69 19 73 16 L77 12 Q79 10 82 13 L88 19 Q90 21 88 23 L84 27 Q81 31 83 36 Q85 41 90 41 H95 Q98 41 98 44 V56 Q98 59 95 59 H90 Q85 59 83 64 Q81 69 84 73 L88 77 Q90 79 88 82 L82 88 Q79 90 77 88 L73 84 Q69 81 64 83 Q59 85 59 90 V95 Q59 98 56 98 H44 Q41 98 41 95 V90 Q41 85 36 83 Q31 81 27 84 L23 88 Q21 90 18 88 L12 82 Q10 79 12 77 L16 73 Q19 69 17 64 Q15 59 10 59 H5 Q2 59 2 56 V44 Q2 41 5 41 H10 Q15 41 17 36 Q19 31 16 27 L12 23 Q10 21 12 18 L18 12 Q21 10 23 12 L27 16 Q31 19 36 17 Q41 15 41 10 Z" />
          <circle cx="50" cy="50" r="14.5" />
        </svg>
      )}
      {(!user || isMobile || loading) && <span>{loading ? 'Carregando...' : label}</span>}
    </Link>
  );

  // Mobile: permanece dentro do menu.
  if (isMobile) return button;

  // Desktop: renderiza diretamente no body, fora da NavBar.
  if (!mounted) return null;

  return createPortal(button, document.body);
}

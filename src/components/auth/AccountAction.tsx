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
 * Nenhum ícone é renderizado neste botão.
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
      <span>{label}</span>
    </Link>
  );

  // O item mobile já faz parte da lista do menu e mantém o mesmo HTML inicial.
  if (isMobile) return button;

  // O atalho desktop fica fora da NavBar, mas só é criado após a hidratação.
  if (!hydrated) return null;

  return createPortal(button, document.body);
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/SiteExperienceProvider';

export default function AccountAction() {
  const { user, loading } = useAuth();
  const href = user ? '/configuracoes' : '/login';
  const label = user ? 'Opções' : 'Entrar';
  return (
    <Link
      href={href}
      aria-label={loading ? 'Carregando conta' : user ? 'Abrir opções e configurações' : 'Entrar no site'}
      title={label}
      className="divertin-account-action"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
        {user ? (
          <>
            <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5.2 20c.5-3.1 2.9-5 6.8-5s6.3 1.9 6.8 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10 16l4-4-4-4M14 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <span>{loading ? '...' : label}</span>
    </Link>
  );
}

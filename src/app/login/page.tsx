'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/SiteExperienceProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, configured, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!loading && user) router.replace('/configuracoes'); }, [loading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Não foi possível entrar.');
      await refreshUser();
      router.replace('/configuracoes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="divertin-auth-page">
      <div className="divertin-auth-decoration divertin-auth-decoration--one" aria-hidden="true" />
      <div className="divertin-auth-decoration divertin-auth-decoration--two" aria-hidden="true" />
      <Link href="/" className="divertin-auth-back">← Voltar ao site</Link>
      <section className="divertin-auth-card">
        <Link href="/" className="divertin-auth-logo" aria-label="Voltar à página inicial">
          <Image src="/logo (1).png" alt="Clínica Divertin" width={1096} height={1003} priority />
        </Link>
        <div className="divertin-auth-kicker">Área exclusiva</div>
        <h1>Que bom ter você por aqui!</h1>
        <p className="divertin-auth-subtitle">Entre na sua conta para acessar opções e configurações da Divertin.</p>
        {!configured && !loading && (
          <div className="divertin-auth-alert" role="status">
            O acesso ainda precisa ser ativado no ambiente do site. Configure o Redis e as variáveis de segurança indicadas no arquivo <code>.env.example</code>.
          </div>
        )}
        <form onSubmit={handleSubmit} className="divertin-auth-form">
          <label htmlFor="login-email">E-mail</label>
          <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" />
          <label htmlFor="login-password">Senha</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" />
          {error && <p className="divertin-auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy || !configured} className="divertin-auth-submit">{busy ? 'Entrando...' : 'Entrar na minha conta'}</button>
        </form>
        <p className="divertin-auth-footnote">O acesso é pessoal. Em caso de dúvida, procure um administrador da clínica.</p>
      </section>
    </main>
  );
}

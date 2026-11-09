'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/SiteExperienceProvider';
import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';
import type { PublicUser, SiteTheme, UserRole } from '@/lib/auth';

type Feedback = { tone: 'success' | 'error'; message: string } | null;

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  const data = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.');
  return data;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, refreshUser, logout } = useAuth();
  const { settings, refreshSettings } = useSiteTheme();
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const name = nameDraft ?? user?.name ?? '';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [themeDraft, setThemeDraft] = useState<SiteTheme | null>(null);
  const theme: SiteTheme = themeDraft ?? settings.theme;
  const [themeBusy, setThemeBusy] = useState(false);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [usersBusy, setUsersBusy] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [createBusy, setCreateBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const isAdmin = user?.role === 'admin';
  const otherActiveAdmins = useMemo(() => users.filter((item) => item.role === 'admin' && item.active && item.id !== user?.id).length, [users, user?.id]);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);
  useEffect(() => {
    if (isAdmin) void loadUsers();
  }, [isAdmin]);

  async function loadUsers() {
    setUsersBusy(true);
    try {
      const data = await apiRequest<{ users: PublicUser[] }>('/api/admin/users');
      setUsers(data.users);
    } catch (error) {
      setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Não foi possível carregar os usuários.' });
    } finally {
      setUsersBusy(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setProfileBusy(true);
    try {
      await apiRequest('/api/auth/profile', { method: 'PATCH', body: JSON.stringify({ name, ...(newPassword ? { currentPassword, newPassword } : {}) }) });
      await refreshUser();
      setCurrentPassword('');
      setNewPassword('');
      setFeedback({ tone: 'success', message: 'Seu cadastro foi atualizado.' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Não foi possível salvar seu cadastro.' });
    } finally {
      setProfileBusy(false);
    }
  }

  async function saveTheme() {
    setThemeBusy(true);
    setFeedback(null);
    try {
      await apiRequest('/api/site-settings', { method: 'PUT', body: JSON.stringify({ theme }) });
      await refreshSettings();
      setThemeDraft(null);
      setFeedback({ tone: 'success', message: theme === 'natal' ? 'Tema de Natal aplicado ao site.' : 'Tema padrão restaurado.' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Não foi possível aplicar o tema.' });
    } finally {
      setThemeBusy(false);
    }
  }

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateBusy(true);
    setFeedback(null);
    try {
      await apiRequest('/api/admin/users', { method: 'POST', body: JSON.stringify({ name: newName, email: newEmail, password: newUserPassword, role: newRole }) });
      setNewName(''); setNewEmail(''); setNewUserPassword(''); setNewRole('user');
      await loadUsers();
      setFeedback({ tone: 'success', message: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Não foi possível cadastrar o usuário.' });
    } finally {
      setCreateBusy(false);
    }
  }

  async function updateAccount(target: PublicUser, patch: { role?: UserRole; active?: boolean }) {
    setFeedback(null);
    try {
      await apiRequest(`/api/admin/users/${target.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      await loadUsers();
      setFeedback({ tone: 'success', message: `Cadastro de ${target.name} atualizado.` });
    } catch (error) {
      setFeedback({ tone: 'error', message: error instanceof Error ? error.message : 'Não foi possível atualizar a conta.' });
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  if (loading || !user) {
    return <main className="divertin-settings-loading"><span className="divertin-auth-spinner" />Carregando suas configurações...</main>;
  }

  return (
    <main className="divertin-settings-page">
      <header className="divertin-settings-header">
        <Link href="/" className="divertin-settings-back">← Voltar ao site</Link>
        <div className="divertin-settings-brand"><span className="divertin-settings-brand-mark">D</span><span>Divertin</span></div>
        <button type="button" onClick={handleLogout} className="divertin-settings-logout">Sair da conta</button>
      </header>

      <div className="divertin-settings-container">
        <div className="divertin-settings-intro">
          <span className="divertin-auth-kicker">Painel {isAdmin ? 'administrativo' : 'pessoal'}</span>
          <h1>Olá, {user.name.split(' ')[0]}!</h1>
          <p>{isAdmin ? 'Gerencie seu acesso e personalize a experiência da Clínica Divertin.' : 'Aqui você pode atualizar seus dados de acesso e preferências.'}</p>
        </div>

        {feedback && <div className={`divertin-settings-feedback divertin-settings-feedback--${feedback.tone}`} role="status">{feedback.message}</div>}

        <section className="divertin-settings-card">
          <div className="divertin-settings-section-heading"><span className="divertin-settings-icon">☺</span><div><h2>Minha conta</h2><p>Seus dados e segurança de acesso.</p></div></div>
          <form onSubmit={saveProfile} className="divertin-settings-form">
            <label htmlFor="profile-name">Nome de exibição</label>
            <input id="profile-name" required minLength={2} maxLength={80} value={name} onChange={(event) => setNameDraft(event.target.value)} />
            <label htmlFor="profile-email">E-mail</label>
            <input id="profile-email" value={user.email} readOnly disabled />
            <div className="divertin-settings-divider" />
            <h3>Alterar senha</h3>
            <p className="divertin-settings-help">Deixe os campos em branco para manter sua senha atual. A nova senha precisa ter pelo menos 10 caracteres.</p>
            <label htmlFor="current-password">Senha atual</label>
            <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            <label htmlFor="new-password">Nova senha</label>
            <input id="new-password" type="password" autoComplete="new-password" minLength={10} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            <button type="submit" disabled={profileBusy} className="divertin-settings-primary">{profileBusy ? 'Salvando...' : 'Salvar meus dados'}</button>
          </form>
        </section>

        {isAdmin && (
          <>
            <section className="divertin-settings-card">
              <div className="divertin-settings-section-heading"><span className="divertin-settings-icon">✦</span><div><h2>Temas do site</h2><p>Escolha a decoração visual que será exibida para todos os visitantes.</p></div></div>
              <div className="divertin-theme-options">
                <label className={`divertin-theme-option ${theme === 'padrao' ? 'is-selected' : ''}`}>
                  <input type="radio" name="site-theme" value="padrao" checked={theme === 'padrao'} onChange={() => setThemeDraft('padrao')} />
                  <span className="divertin-theme-preview divertin-theme-preview--default"><i /><i /><i /></span>
                  <span className="divertin-theme-option-copy"><strong>Tema padrão</strong><small>Visual original da Divertin</small></span>
                  {theme === 'padrao' && <span className="divertin-theme-selected">Selecionado</span>}
                </label>
                <label className={`divertin-theme-option ${theme === 'natal' ? 'is-selected' : ''}`}>
                  <input type="radio" name="site-theme" value="natal" checked={theme === 'natal'} onChange={() => setThemeDraft('natal')} />
                  <span className="divertin-theme-preview divertin-theme-preview--christmas"><i>✦</i><i>❄</i><i>✧</i></span>
                  <span className="divertin-theme-option-copy"><strong>Natal</strong><small>Verde pinheiro, vermelho e dourado, com neve delicada</small></span>
                  {theme === 'natal' && <span className="divertin-theme-selected">Selecionado</span>}
                </label>
              </div>
              <div className="divertin-theme-coming">Mais temas sazonais, como Páscoa e Carnaval, poderão ser adicionados a esta biblioteca.</div>
              <button type="button" onClick={saveTheme} disabled={themeBusy || theme === settings.theme} className="divertin-settings-primary">{themeBusy ? 'Aplicando...' : 'Aplicar tema escolhido'}</button>
            </section>

            <section className="divertin-settings-card">
              <div className="divertin-settings-section-heading"><span className="divertin-settings-icon">♧</span><div><h2>Usuários e administradores</h2><p>Cadastre contas, conceda acesso administrativo ou suspenda acessos.</p></div></div>
              <form onSubmit={createAccount} className="divertin-settings-form divertin-admin-create-form">
                <h3>Novo cadastro</h3>
                <label htmlFor="new-user-name">Nome</label>
                <input id="new-user-name" required minLength={2} maxLength={80} value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Nome da pessoa" />
                <label htmlFor="new-user-email">E-mail</label>
                <input id="new-user-email" type="email" required value={newEmail} onChange={(event) => setNewEmail(event.target.value)} placeholder="pessoa@email.com" />
                <label htmlFor="new-user-password">Senha inicial</label>
                <input id="new-user-password" type="password" required minLength={10} autoComplete="new-password" value={newUserPassword} onChange={(event) => setNewUserPassword(event.target.value)} placeholder="Mínimo de 10 caracteres" />
                <label htmlFor="new-user-role">Tipo de acesso</label>
                <select id="new-user-role" value={newRole} onChange={(event) => setNewRole(event.target.value as UserRole)}><option value="user">Usuário padrão</option><option value="admin">Administrador</option></select>
                <button type="submit" disabled={createBusy} className="divertin-settings-primary">{createBusy ? 'Cadastrando...' : `Cadastrar ${newRole === 'admin' ? 'administrador' : 'usuário'}`}</button>
              </form>

              <div className="divertin-user-list-heading"><h3>Contas cadastradas</h3><button type="button" onClick={() => void loadUsers()} disabled={usersBusy}>Atualizar lista</button></div>
              {usersBusy ? <p className="divertin-settings-help">Carregando usuários...</p> : (
                <div className="divertin-user-list">
                  {users.map((item) => (
                    <article key={item.id} className={`divertin-user-row ${!item.active ? 'is-inactive' : ''}`}>
                      <div className="divertin-user-avatar">{item.name.trim().charAt(0).toUpperCase()}</div>
                      <div className="divertin-user-info"><strong>{item.name}{item.id === user.id ? ' (você)' : ''}</strong><span>{item.email}</span><small>{item.role === 'admin' ? 'Administrador' : 'Usuário padrão'} · {item.active ? 'Ativo' : 'Acesso suspenso'}</small></div>
                      <div className="divertin-user-actions">
                        <select aria-label={`Perfil de ${item.name}`} value={item.role} disabled={item.id === user.id} onChange={(event) => void updateAccount(item, { role: event.target.value as UserRole })}>
                          <option value="user">Usuário</option><option value="admin">ADM</option>
                        </select>
                        <button type="button" disabled={item.id === user.id || (item.role === 'admin' && item.active && otherActiveAdmins === 0)} onClick={() => void updateAccount(item, { active: !item.active })}>{item.active ? 'Suspender' : 'Reativar'}</button>
                      </div>
                    </article>
                  ))}
                  {users.length === 0 && <p className="divertin-settings-help">Nenhuma conta cadastrada.</p>}
                </div>
              )}
            </section>
          </>
        )}

        <p className="divertin-settings-footer">Clínica Divertin · {isAdmin ? 'Painel administrativo' : 'Área do usuário'}</p>
      </div>
    </main>
  );
}

'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { PublicUser, SiteSettings } from '@/lib/auth';

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  configured: boolean;
  refreshUser: () => Promise<PublicUser | null>;
  logout: () => Promise<void>;
};
type ThemeContextValue = {
  settings: SiteSettings;
  settingsLoading: boolean;
  refreshSettings: () => Promise<SiteSettings>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);
const defaultSettings: SiteSettings = {
  theme: 'padrao',
  announcement: { enabled: false, title: '', message: '' },
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de SiteExperienceProvider.');
  return context;
}
export function useSiteTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useSiteTheme deve ser usado dentro de SiteExperienceProvider.');
  return context;
}

export default function SiteExperienceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' });
      const data = await response.json() as { user?: PublicUser | null; configured?: boolean };
      setUser(data.user ?? null);
      setConfigured(Boolean(data.configured));
      return data.user ?? null;
    } catch {
      setUser(null);
      setConfigured(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/site-settings', { cache: 'no-store' });
      if (!response.ok) throw new Error('Não foi possível carregar o tema.');
      const data = await response.json() as { settings: SiteSettings };
      const next = data.settings ?? defaultSettings;
      setSettings(next);
      return next;
    } catch {
      setSettings(defaultSettings);
      return defaultSettings;
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    setUser(null);
  }, []);

  useEffect(() => {
    // Carregamentos assíncronos sincronizam as sessões e preferências com o servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
    void refreshSettings();
  }, [refreshSettings, refreshUser]);

  useEffect(() => {
    document.documentElement.dataset.siteTheme = settings.theme === 'natal' ? 'natal' : 'padrao';
  }, [settings.theme]);

  const authValue = useMemo(() => ({ user, loading, configured, refreshUser, logout }), [user, loading, configured, refreshUser, logout]);
  const themeValue = useMemo(() => ({ settings, settingsLoading, refreshSettings }), [settings, settingsLoading, refreshSettings]);

  return (
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

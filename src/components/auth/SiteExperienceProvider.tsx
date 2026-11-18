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
  updateSettings: (next: SiteSettings) => void;
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

export default function SiteExperienceProvider({ children, initialSettings = defaultSettings }: { children: ReactNode; initialSettings?: SiteSettings }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [settingsLoading, setSettingsLoading] = useState(false);

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
      const response = await fetch('/api/site-settings', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Não foi possível carregar o tema.');
      const data = await response.json() as { settings?: SiteSettings };
      if (!data.settings) throw new Error('A resposta de configurações não contém um tema.');
      setSettings(data.settings);
      return data.settings;
    } catch {
      // Não apague a configuração enviada pelo servidor por causa de uma falha transitória.
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
    // Revalida o tema para corrigir HTML/CDN potencialmente antigo, preservando o tema inicial se a API falhar.
    void refreshSettings();
  }, [refreshUser, refreshSettings]);

  useEffect(() => {
    document.documentElement.dataset.siteTheme = settings.theme;
  }, [settings.theme]);

  const updateSettings = useCallback((next: SiteSettings) => setSettings(next), []);

  const authValue = useMemo(() => ({ user, loading, configured, refreshUser, logout }), [user, loading, configured, refreshUser, logout]);
  const themeValue = useMemo(() => ({ settings, settingsLoading, refreshSettings, updateSettings }), [settings, settingsLoading, refreshSettings, updateSettings]);

  return (
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

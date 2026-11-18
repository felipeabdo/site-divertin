'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'divertin-pascoa-ovos-v1';

type SeasonalExperienceValue = {
  foundEggIds: string[];
  foundEggCount: number;
  discoverEgg: (id: string) => void;
};

const SeasonalExperienceContext = createContext<SeasonalExperienceValue | null>(null);

export default function SeasonalExperienceProvider({ children }: { children: ReactNode }) {
  const [foundEggIds, setFoundEggIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFoundEggIds(parsed.filter((item): item is string => typeof item === 'string').slice(0, 3));
        }
      }
    } catch {
      // A experiência continua funcionando mesmo quando o armazenamento está indisponível.
    }
  }, []);

  const discoverEgg = useCallback((id: string) => {
    setFoundEggIds((current) => {
      if (current.includes(id) || current.length >= 3) return current;
      const next = [...current, id];
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // O estado em memória permanece válido durante a visita.
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ foundEggIds, foundEggCount: foundEggIds.length, discoverEgg }),
    [foundEggIds, discoverEgg],
  );

  return <SeasonalExperienceContext.Provider value={value}>{children}</SeasonalExperienceContext.Provider>;
}

export function useSeasonalExperience() {
  const value = useContext(SeasonalExperienceContext);
  if (!value) throw new Error('useSeasonalExperience precisa estar dentro de SeasonalExperienceProvider.');
  return value;
}

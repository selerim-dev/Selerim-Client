'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode = 'auto' | 'light' | 'dark';
export type Scene = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  scene: Scene;
  resolved: Scene;
  setScene: (s: Scene) => void;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'selerim-theme';

export function ThemeProvider({
  children,
  defaultScene = 'dark',
}: {
  children: React.ReactNode;
  defaultScene?: Scene;
}) {
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [scene, setSceneState] = useState<Scene>(defaultScene);

  // Hydrate persisted preference (mode only; scene is derived on scroll)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        setModeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const resolved: Scene = mode === 'auto' ? scene : mode;

  // Reflect resolved theme on <html> so CSS variables swap
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
  }, []);

  const setScene = useCallback((s: Scene) => {
    setSceneState((prev) => (prev === s ? prev : s));
  }, []);

  const toggle = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setMode]);

  const value = useMemo(
    () => ({ mode, scene, resolved, setScene, setMode, toggle }),
    [mode, scene, resolved, setScene, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Inline, render-blocking script that sets the initial theme before paint (no FOUC). */
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${STORAGE_KEY}');document.documentElement.dataset.theme=(m==='light'||m==='dark')?m:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

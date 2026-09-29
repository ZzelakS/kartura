"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

export const THEME_KEY = "kartura-theme";

type ThemeValue = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in the layout has already put the right class on <html>
  // before paint. This reads back from it rather than deciding again, so the
  // first render matches what is on screen.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("light", next === "light");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing. The choice just will not survive a reload.
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(
    () => setTheme(document.documentElement.classList.contains("light") ? "dark" : "light"),
    [setTheme],
  );

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Runs before first paint to avoid a flash of the wrong theme. Stored choice
 * wins; otherwise follow the operating system.
 */
export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`;

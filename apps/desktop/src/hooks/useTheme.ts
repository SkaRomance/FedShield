import { useCallback, useEffect, useState } from "react";

/**
 * S14-B: tema chiaro/scuro globale via [data-theme] su <html>.
 * - Persistenza in localStorage chiave "fedshield-theme".
 * - Default light se non c'e' valore salvato.
 * - Al primo accesso (nessun valore salvato) rispetta prefers-color-scheme.
 * - Tutti i token --color-* vengono ridefiniti da [data-theme="dark"] in styles.css,
 *   quindi i componenti non devono cambiare nulla.
 */
export type Theme = "light" | "dark";

const STORAGE_KEY = "fedshield-theme";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
  } catch {
    // localStorage non accessibile (es. modalita' privata strict): fallback OS
  }
  if (typeof window.matchMedia === "function") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  return "light";
}

function applyThemeAttribute(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    // Light = assenza dell'attributo: cosi' :root tokens valgono di default.
    root.removeAttribute("data-theme");
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  // Applica subito al mount (sincronizza DOM con stato letto da localStorage/OS).
  useEffect(() => {
    applyThemeAttribute(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore: persistenza best-effort
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}

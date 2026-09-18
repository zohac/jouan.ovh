export type ThemePreference = "system" | "dark" | "light";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "jouan_theme_mode";
let mediaListenerAttached = false;

/**
 * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
 *
 * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
 * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
 * avec localStorage et les preferences systeme de l'OS.
 */
export function useTheme() {
  const preference = useState<ThemePreference>("theme-preference", () => "system");
  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");

  const resolveSystemTheme = (): ResolvedTheme => {
    if (!import.meta.client || typeof window === "undefined" || !window.matchMedia) {
      return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
    if (!import.meta.client) {
      return;
    }
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-source", pref);
    document.documentElement.style.colorScheme = resolved;
  };

  const setTheme = (pref: ThemePreference) => {
    if (pref !== "system" && pref !== "dark" && pref !== "light") {
      return;
    }
    preference.value = pref;
    const resolved = pref === "system" ? resolveSystemTheme() : pref;
    resolvedTheme.value = resolved;

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, pref);
      } catch {
        // Ignorer en navigation privee restrictive
      }
      applyToDom(resolved, pref);
    }
  };

  const cycleTheme = () => {
    const nextMap: Record<ThemePreference, ThemePreference> = {
      system: "dark",
      dark: "light",
      light: "system",
    };
    setTheme(nextMap[preference.value] || "system");
  };

  const initTheme = () => {
    if (!import.meta.client) {
      return;
    }

    let storedPref: ThemePreference = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light" || stored === "system") {
        storedPref = stored;
      }
    } catch {
      // Ignorer si localStorage inaccessible
    }

    preference.value = storedPref;
    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
    resolvedTheme.value = resolved;
    applyToDom(resolved, storedPref);

    if (mediaListenerAttached || typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (preference.value === "system") {
        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
        resolvedTheme.value = newResolved;
        applyToDom(newResolved, "system");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }
    mediaListenerAttached = true;
  };

  return {
    preference,
    resolvedTheme,
    setTheme,
    cycleTheme,
    initTheme,
  };
}

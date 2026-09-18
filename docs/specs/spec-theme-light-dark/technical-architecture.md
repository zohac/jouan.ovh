# Technical Architecture — Thème Light & Dark

> Compagnon technique à `SPEC.md`. Détaille l'architecture logicielle, les contrats d'API client, les tokens SCSS et le mécanisme anti-FOUC sous Nuxt 4 SSG.

---

## 1. Architecture des Tokens SCSS (`_root.scss`)

Le design system repose sur une cascade de variables CSS :
1. **Défaut sur `:root` :** Conserve la palette sombre actuelle comme socle de base (`--surface-0`, `--ink-1`, etc.).
2. **Surcharge sur `[data-theme="light"]` :** Réaffecte les alias sémantiques aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md`.
3. **Exception sanctuarisée :** Les sélecteurs du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: #2e0024`, `--text-strong: #f5f3f0`, `--text-body: #c3bdb7`), assurant l'immunité au thème clair.

```scss
// app/assets/scss/abstract/_root.scss

:root {
  // Base sombre (existante)...
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
}

// Surcharge Thème Clair
[data-theme="light"] {
  --bg-page: hsl(38deg 25% 97%);        // #FAF8F4 crème solaire
  --bg-sunken: hsl(38deg 20% 93%);      // #F1EDE6
  --bg-card: hsl(0deg 0% 100%);         // #FFFFFF cartes blanches
  --bg-elevated: hsl(38deg 30% 99%);    // #FFFEFB
  --bg-input: hsl(38deg 15% 95%);       // #F5F3EE
  
  --text-strong: hsl(320deg 30% 12%);   // #271524 titres aubergine sombre
  --text-body: hsl(320deg 18% 26%);     // #473644 corps de texte
  --text-muted: hsl(320deg 10% 44%);    // #756773 légendes
  --text-faint: hsl(320deg 8% 58%);     // #988D96 désactivé
  
  --border-subtle: hsl(35deg 15% 88%);  // #E6E2DC
  --border-default: hsl(35deg 12% 80%); // #D1CCC4
  --border-strong: hsl(35deg 12% 68%);  // #B3ABA2
  
  --accent: hsl(24deg 95% 44%);         // #DA5207 contraste AA > 4.5:1 sur fond clair
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
}
```

---

## 2. Script Inline Anti-FOUC (`nuxt.config.ts`)

Pour éviter tout flash noir/blanc lors du premier rendu statique sur GitHub Pages :
- Un micro-script synchrone auto-exécuté est inséré tout en haut du `<head>` via `app.head.script`.
- Il lit `localStorage.getItem('jouan_theme_mode')` et évalue `window.matchMedia('(prefers-color-scheme: dark)')`.
- Il applique immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant tout affichage graphique.

```javascript
// Injection anti-FOUC (exécutée avant le premier rendu du navigateur)
(function() {
  try {
    var stored = localStorage.getItem('jouan_theme_mode') || 'system';
    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var resolved = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-source', stored);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
```

---

## 3. Composable `useTheme()` (`app/composables/useTheme.ts`)

Source unique de vérité pour la réactivité du thème dans Vue :

```typescript
export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

export const useTheme = () => {
  const preference = useState<ThemePreference>('theme-preference', () => 'system');
  const resolved = useState<ResolvedTheme>('theme-resolved', () => 'dark');

  // Initialisation client
  const initTheme = () => { /* synchronisation avec localStorage et matchMedia */ };

  // Cycle ternaire : system -> dark -> light -> system
  const cycleTheme = () => {
    const next: Record<ThemePreference, ThemePreference> = {
      system: 'dark',
      dark: 'light',
      light: 'system',
    };
    setTheme(next[preference.value]);
  };

  const setTheme = (pref: ThemePreference) => {
    preference.value = pref;
    // Mise à jour localStorage + DOM data-theme
  };

  return { preference, resolved, cycleTheme, setTheme, initTheme };
};
```

---

## 4. Intégration du Composant `ThemeToggle.vue`

- **Composant UI :** `app/components/ui/ThemeToggle.vue`
- **Positionnement :**
  1. Desktop : dans `HeaderComponent.vue`, dans `.hdr__dock-right`, immédiatement devant `.hdr__status-badge`.
  2. Mobile : dans `HeaderComponent.vue`, dans `.hdr__menu-status`, en vis-à-vis du statut.
- **Iconographie :** 3 symboles vectoriels déclarés dans `ZIcon.vue` :
  - `monitor` : Écran épuré avec pied (mode système).
  - `moon` : Croissant de lune technique (mode sombre).
  - `sun` : Cercle central avec 8 rayons géométriques (mode clair).

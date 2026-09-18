---
baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
---

# Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur naviguant sur `jouan.ovh`,
I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
so that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20, CAP-2, CAP-3, CAP-5).

## Acceptance Criteria

1. **Given** l'infrastructure client Nuxt 4
   **When** on initialise le thème dans l'application
   **Then** le composable `app/composables/useTheme.ts` expose l'état réactif et les méthodes de contrôle :
     - `preference: Ref<ThemePreference>` (`'system' | 'dark' | 'light'`)
     - `resolvedTheme: Ref<ResolvedTheme>` (`'dark' | 'light'`)
     - `cycleTheme(): void` (cycle ternaire `system → dark → light → system`)
     - `setTheme(pref: ThemePreference): void`
     - `initTheme(): void` (synchronisation client avec `localStorage`, évaluation de `prefers-color-scheme` et attachement de l'écouteur `change`)
   **And** côté serveur (SSR / compilation SSG `pnpm generate`), le composable s'exécute sans erreur (`import.meta.client` guards, zéro accès direct à `window`/`document`/`localStorage` lors du pré-rendu statique).

2. **Given** un visiteur sans préférence manuelle préalable
   **When** l'application s'initialise
   **Then** `preference` vaut `'system'`
   **And** `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
   **And** tout basculement du thème système de l'OS (ou bascule émulée dans DevTools) met immédiatement à jour `resolvedTheme` et l'attribut `data-theme` sur `<html>` sans rechargement de page.

3. **Given** l'appel à `setTheme(pref)`
   **When** l'utilisateur choisit `'dark'`, `'light'` ou `'system'`
   **Then** `preference.value` est mis à jour
   **And** `localStorage.setItem('jouan_theme_mode', pref)` persiste le choix (ou suppression/mise à jour propre)
   **And** `document.documentElement.setAttribute('data-theme', resolved)` applique le thème effectif
   **And** `document.documentElement.setAttribute('data-theme-source', pref)` reflète la préférence sélectionnée.

4. **Given** la génération statique Nuxt 4 (SSG) et l'hébergement GitHub Pages
   **When** une page HTML pré-rendue est chargée dans le navigateur
   **Then** un micro-script synchrone pur JS (< 15 lignes, sans dépendance externe) est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`
   **And** ce script lit `localStorage.getItem('jouan_theme_mode') || 'system'`, résout le thème effectif avant tout rendu CSS/DOM, et pose immédiatement les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
   **And** aucun flash de contenu non stylisé ou inversion de couleur (FOUC) ne se produit avant le premier paint
   **And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.

5. **Given** la suite d'outillage et les standards de code du projet
   **When** on exécute la vérification dans Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint, 0 erreur TypeScript (vue-tsc) et 24 routes SSG pré-rendues sans anomalie.

## Tasks / Subtasks

- [x] Tâche 1 — Création du composable réactif `app/composables/useTheme.ts` (AC: 1, 2, 3)
  - [x] Déclarer les types exportés `export type ThemePreference = 'system' | 'dark' | 'light'` et `export type ResolvedTheme = 'dark' | 'light'`.
  - [x] Initialiser l'état partagé via `useState<ThemePreference>('theme-preference', () => 'system')` et `useState<ResolvedTheme>('theme-resolved', () => 'dark')`.
  - [x] Implémenter la fonction interne de résolution `resolveTheme(pref: ThemePreference): ResolvedTheme` (évaluant `window.matchMedia('(prefers-color-scheme: dark)').matches` sous `'system'`).
  - [x] Implémenter `initTheme()` :
    - Guard `if (!import.meta.client) return;`
    - Lecture de `localStorage.getItem('jouan_theme_mode')` (fallback sur `'system'`).
    - Synchronisation des refs `preference` et `resolvedTheme`.
    - Écoute de l'événement `change` sur `window.matchMedia('(prefers-color-scheme: dark)')` pour réagir dynamiquement quand `preference.value === 'system'`.
  - [x] Implémenter `setTheme(pref: ThemePreference)` :
    - Mise à jour de `preference.value`.
    - Calcul du `resolvedTheme.value`.
    - Écriture dans `localStorage.setItem('jouan_theme_mode', pref)`.
    - Mise à jour synchrone de `document.documentElement.setAttribute('data-theme', resolvedTheme.value)` et `document.documentElement.setAttribute('data-theme-source', pref)`.
  - [x] Implémenter `cycleTheme()` : transition cyclique `system → dark → light → system`.

- [x] Tâche 2 — Injection du micro-script synchrone anti-FOUC dans `nuxt.config.ts` (AC: 4)
  - [x] Ajouter dans `app.head.script` de `nuxt.config.ts` le micro-script IIFE inline.
  - [x] Contenu du script :
    ```javascript
    (function() {
      try {
        var pref = localStorage.getItem('jouan_theme_mode') || 'system';
        var resolved = pref;
        if (pref === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', resolved);
        document.documentElement.setAttribute('data-theme-source', pref);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
    ```
  - [x] Configurer `type: 'text/javascript'` et `innerHTML` pour que Nitro émette le script directement dans le `<head>` de toutes les pages HTML statiques.

- [x] Tâche 3 — Initialisation client dans `app/app.vue` et prévention d'hydration mismatch (AC: 1, 4)
  - [x] Importer et appeler `const { initTheme } = useTheme()` dans `app/app.vue`.
  - [x] Déclencher `initTheme()` dans `onMounted()` pour synchroniser l'arbre Vue avec le DOM déjà étiqueté par le script anti-FOUC.
  - [x] Vérifier qu'aucun warning d'hydratation Vue n'apparaît.

- [x] Tâche 4 — Validation et conformité Docker (AC: 5)
  - [x] Vérifier dans le build `.output/public/index.html` la présence du script inline anti-FOUC dans le `<head>`.
  - [x] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG générées.

### Review Findings

- [x] [Review][Patch] Validation stricte de la valeur localStorage dans le script anti-FOUC [nuxt.config.ts:34]
- [x] [Review][Patch] Renseignement de data-theme-source et repli adaptatif dans le catch du script anti-FOUC [nuxt.config.ts:34]
- [x] [Review][Patch] Idempotence d'initTheme() et prévention des écouteurs matchMedia multiples [app/composables/useTheme.ts:56]
- [x] [Review][Patch] Validation runtime du paramètre de préférence dans setTheme() [app/composables/useTheme.ts:32]
- [x] [Review][Patch] Synchronisation de la propriété CSS standard color-scheme sur la racine du document [app/composables/useTheme.ts:28]
- [x] [Review][Defer] Suite de tests automatisés unitaires pour la logique réactive de useTheme [test/] — deferred, pre-existing

## Dev Notes

### Architecture logicielle & Contrats d'API
- **Fichier principal à créer :** `app/composables/useTheme.ts`
- **Fichiers à modifier :**
  - `nuxt.config.ts` (section `app.head.script`)
  - `app/app.vue` (appel `initTheme()` dans `onMounted`)
- **Fichiers de référence :**
  - Spécification technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
  - Spécification UX : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md)
  - Contrat général : [`docs/specs/spec-theme-light-dark/SPEC.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/SPEC.md)
  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Invariants critiques à respecter
- **Environnement Docker obligatoire :** Ne jamais exécuter `pnpm` sur la machine hôte. Toute commande s'exécute via :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```
- **Zéro Emoji :** Aucun caractère emoji dans les commentaires ou le code.
- **SSR / SSG Hydration Guard :** Ne jamais accéder à `window`, `document` ou `localStorage` en dehors d'une garde `import.meta.client` ou du hook Vue `onMounted`. Au rendu SSR/SSG, `useState` fournit des valeurs par défaut stables (`'system'` et `'dark'`).
- **Clé de stockage unique :** Toujours utiliser `'jouan_theme_mode'`.

### Code Snippet de référence pour `app/composables/useTheme.ts`

```typescript
import { ref } from 'vue';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'jouan_theme_mode';

export function useTheme() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system');
  const resolvedTheme = useState<ResolvedTheme>('theme-resolved', () => 'dark');

  const resolveSystemTheme = (): ResolvedTheme => {
    if (!import.meta.client) return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
    if (!import.meta.client) return;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-source', pref);
  };

  const setTheme = (pref: ThemePreference) => {
    preference.value = pref;
    const resolved = pref === 'system' ? resolveSystemTheme() : pref;
    resolvedTheme.value = resolved;

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, pref);
      } catch {
        // Mode privé strict
      }
      applyToDom(resolved, pref);
    }
  };

  const cycleTheme = () => {
    const nextMap: Record<ThemePreference, ThemePreference> = {
      system: 'dark',
      dark: 'light',
      light: 'system',
    };
    setTheme(nextMap[preference.value] || 'system');
  };

  const initTheme = () => {
    if (!import.meta.client) return;

    let storedPref: ThemePreference = 'system';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        storedPref = stored;
      }
    } catch {
      // Ignorer si localStorage inaccessible
    }

    preference.value = storedPref;
    const resolved = storedPref === 'system' ? resolveSystemTheme() : storedPref;
    resolvedTheme.value = resolved;
    applyToDom(resolved, storedPref);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (preference.value === 'system') {
        const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
        resolvedTheme.value = newResolved;
        applyToDom(newResolved, 'system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }
  };

  return {
    preference,
    resolvedTheme,
    setTheme,
    cycleTheme,
    initTheme,
  };
}
```

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash (Medium)

### Debug Log References

- Validation Docker exécutée : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
- 0 erreur ESLint / Stylelint, 0 erreur TypeScript (vue-tsc), 24 routes SSG pré-rendues avec succès.
- Vérification du `<head>` généré dans `.output/public/index.html` : script inline synchrone anti-FOUC présent.

### Completion Notes List

- Création du composable réactif `app/composables/useTheme.ts` avec gestion des états `preference` (`'system' | 'dark' | 'light'`) et `resolvedTheme` (`'dark' | 'light'`), synchronisation bidirectionnelle avec `localStorage` (`jouan_theme_mode`) et écouteur réactif `matchMedia('(prefers-color-scheme: dark)')`.
- Implémentation du cycle ternaire `cycleTheme()` (`system → dark → light → system`) et de l'initialisation sûre en environnement SSR/SSG.
- Injection du micro-script synchrone anti-FOUC inline dans `nuxt.config.ts` (`app.head.script`) pour poser immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant le premier paint.
- Initialisation client dans `app/app.vue` via `onMounted` sans aucune discordance d'hydratation.

### File List

- `app/composables/useTheme.ts` (créé)
- `nuxt.config.ts` (modifié)
- `app/app.vue` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md` (modifié)

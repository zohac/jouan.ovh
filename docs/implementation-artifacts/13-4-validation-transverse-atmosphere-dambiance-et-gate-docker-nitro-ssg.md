---
baseline_commit: 08e08fe191517a257c8b3b5d7be17d8b78d7b19d
---

# Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur garantissant la robustesse de production,
I want vérifier et polir le rendu esthétique de toutes les pages sous le thème clair, adapter l'atmosphère d'ambiance et exécuter la gate Docker complète,
so that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régression visuelle, fonctionnelle ou d'accessibilité (FR37, FR38, FR39, FR40, FR41, FR42, NFR17, NFR19, CAP-1, CAP-6).

## Acceptance Criteria

1. **Given** le fichier de tokens `app/assets/scss/abstract/_root.scss`
   **When** le thème `[data-theme="light"]` est actif
   **Then** les tokens primitifs de surface (`--surface-0` à `--surface-4`), d'encre (`--ink-1` à `--ink-4`), de bordures (`--line-subtle`, `--line`, `--line-strong`) et d'accentuation interactive (`--accent-hover`, `--accent-active`) sont explicitement surchargés pour correspondre aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md` :
     - `--surface-0: hsl(38deg 25% 97%)` (`#FAF8F4`)
     - `--surface-1: hsl(38deg 20% 93%)` (`#F1EDE6`)
     - `--surface-2: hsl(0deg 0% 100%)` (`#FFFFFF`)
     - `--surface-3: hsl(38deg 30% 99%)` (`#FFFEFB`)
     - `--surface-4: hsl(38deg 15% 95%)` (`#F5F3EE`)
     - `--ink-1: hsl(320deg 30% 12%)` (`#271524`, contraste > 14:1)
     - `--ink-2: hsl(320deg 18% 26%)` (`#473644`, contraste > 8:1)
     - `--ink-3: hsl(320deg 10% 44%)` (`#756773`, contraste > 4.5:1)
     - `--ink-4: hsl(320deg 8% 58%)` (`#988D96`)
     - `--line-subtle: hsl(35deg 15% 88%)` (`#E6E2DC`)
     - `--line: hsl(35deg 12% 80%)` (`#D1CCC4`)
     - `--line-strong: hsl(35deg 12% 68%)` (`#B3ABA2`)
     - `--accent-hover: hsl(24deg 95% 48%)`
     - `--accent-active: hsl(24deg 95% 40%)`
   **And** aucun composant utilisant directement `var(--surface-*)`, `var(--ink-*)` ou `var(--line-*)` ne conserve d'aubergine sombre résiduelle sur fond clair.

2. **Given** le composant d'atmosphère WebGL `app/components/home/HomeAtmosComponent.vue`
   **When** le thème passe en mode `light`
   **Then** l'arrière-plan atmosphérique s'harmonise avec le fond crème :
     - L'opacité du canvas WebGL (`.atmos__canvas`) est atténuée à `0.18` (au lieu de `0.52` en dark) pour éviter toute interférence de contraste avec les textes du hero et de la page d'accueil
     - Les masques radiaux `.grid-dots` et la vignette `.vignette` fondent sans couture dans `--surface-0` (`#FAF8F4`)
     - Le repli CSS `.atmos--fallback` bascule sur des gradients doux adaptés au fond clair
     - Sous `prefers-reduced-motion: reduce`, l'atténuation d'opacité est maintenue sans animation cinétique.

3. **Given** l'ensemble des routes et composants du site `jouan.ovh`
   **When** l'utilisateur navigue en mode clair (`data-theme="light"`)
   **Then** chaque page offre une lisibilité exemplaire et un rendu contrasté conforme WCAG AA/AAA :
     - **Accueil (`/`) :** Cartes blanches nettes (`#FFFFFF`), typographie aubergine contrastée, Terminal Hero et terminal flottant sanctuarisés en mode sombre permanent avec prompt vert (`#45D677`), bouton ThemeToggle dans le dock droit
     - **Services (`/services`) :** 3 cartes d'offres et grille de process à 4 étapes avec bordures nettes et badges contrastés
     - **À propos (`/about`) :** Portrait, bio, timeline d'expériences, blocs formation et compétences, inspecteur interactif terminal sombre
     - **Contact (`/contact` & `/contact/card`) :** Formulaire Web3Forms, inputs lisibles (`--bg-input: #F5F3EE`), colonnes d'infos et carte de visite vCard
     - **Blog (`/blog` & `/blog/[...slug]`) :** Liste d'articles, badges de tags, lecture d'article prose `<ContentRenderer>`, blocs de code syntaxique et inline code préservés
     - **Châssis global (`HeaderComponent.vue`, `FooterComponent.vue`) :** Navigation transparente dégradée, dock d'état, menu mobile déplié avec badge Disponible et ThemeToggle, footer avec copyright et liens légaux.

4. **Given** le cycle complet de gestion du thème (`ThemeToggle`, `useTheme()`, script anti-FOUC)
   **When** l'utilisateur alterne entre `system`, `dark` et `light`
   **Then** la bascule s'opère instantanément sans rechargement, la persistance dans `localStorage` (`jouan_theme_mode`) est immédiate
   **And** un rechargement dur de la page (`Cmd+R` / `F5`) en mode clair restaure le thème sans aucun flash noir ou clignotement FOUC.

5. **Given** l'environnement Docker du projet
   **When** on exécute la commande de validation complète
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et l'ensemble des routes statiques (24 routes dont assets) générées sans anomalie.

## Tasks / Subtasks

- [x] Tâche 1 — Complétion des tokens primitifs et sémantiques dans `app/assets/scss/abstract/_root.scss` (AC: 1)
  - [x] Ajouter la surcharge complète des variables primitives `--surface-0` à `--surface-4`, `--ink-1` à `--ink-4`, `--line-subtle`, `--line`, `--line-strong`, `--accent-hover`, `--accent-active` sous `[data-theme="light"]`.
  - [x] Vérifier que `--text-shadow` ou ombres textuelles éventuelles s'adaptent ou s'effacent proprement sur fond clair.
  - [x] Valider l'absence de régression sur la sanctuarisation du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`, `.contact__term`, `pre`).

- [x] Tâche 2 — Adaptation et calibration de l'atmosphère d'ambiance dans `app/components/home/HomeAtmosComponent.vue` (AC: 2)
  - [x] Ajouter une règle d'opacité conditionnelle pour `.atmos__canvas` en mode clair :
    ```scss
    :global([data-theme="light"]) .atmos__canvas {
      opacity: 0.18;
    }
    ```
  - [x] Adapter le repli `.atmos--fallback` pour le mode clair.
  - [x] Vérifier que les masques `.grid-dots` et `.vignette` restent fluides et sans bordure dure sous les deux thèmes.

- [x] Tâche 3 — Audit visuel transverse multi-pages et ajustements de polissage (AC: 3, AC: 4)
  - [x] Tester visuellement la page d'accueil (`/`) en mode sombre et clair (desktop et mobile).
  - [x] Tester visuellement la page Services (`/services`) et la grille de process.
  - [x] Tester visuellement la page À propos (`/about`), les blocs de CV et l'inspecteur terminal.
  - [x] Tester visuellement la page Contact (`/contact`), les inputs de formulaire et `/contact/card`.
  - [x] Tester visuellement la page Blog (`/blog` et vue article markdown).
  - [x] Vérifier la persistance `localStorage` et l'absence totale de FOUC au rechargement.

- [x] Tâche 4 — Validation qualité Docker & certification SSG (AC: 5)
  - [x] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
  - [x] Réaliser une capture ou revue visuelle comparative sur navigateur (desktop et mobile).

### Review Findings

- [x] [Review][Patch] Fixer l'inversion globale CSS accidentelle `[data-theme="light"] { filter: invert(1) }` et basculer les logos vers les assets noirs propres [app/components/HeaderComponent.vue, app/components/FooterComponent.vue, app/assets/scss/abstract/_root.scss]
- [x] [Review][Patch] Compléter les tokens de sanctuarisation du terminal sombre (`--accent-2-soft`, `--ink-on-accent`, `--accent-hover`, `--accent-active`, `--accent-soft`, `--accent-ring`, `--link`, `--prompt`) [app/assets/scss/abstract/_root.scss]
- [x] [Review][Patch] Adapter le repli `.atmos--fallback` et canvas opacity via tokens sans `:global` [app/components/home/HomeAtmosComponent.vue, app/assets/scss/abstract/_root.scss]
- [x] [Review][Patch] Neutraliser l'ombre portée `text-shadow` résiduelle sur `.hero__title` et `.hero__sub` via tokens `--hero-title-shadow` et `--hero-sub-shadow` [app/pages/index.vue, app/assets/scss/abstract/_root.scss]
- [x] [Review][Patch] Aligner la checklist, la file list et les preuves de tests dans la story 13.4 [docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md]
- [x] [Review][Defer] Isolation du sélecteur global `pre` vis-à-vis des composants Markdown blog [app/assets/scss/abstract/_root.scss:268] — deferred, pre-existing

## Dev Notes

### Architecture logicielle & Contrats de tokens
- **Fichiers principaux modifiés :**
  - `app/assets/scss/abstract/_root.scss` (complétion des tokens primitifs `--surface-*`, `--ink-*`, `--line-*`, `--atmos-*`, `--hero-*-shadow` sous `[data-theme="light"]`, sanctuarisation terminal et bascule globale logo dark/light)
  - `app/components/home/HomeAtmosComponent.vue` (consommation de tokens `--atmos-opacity` et `--atmos-fallback-accent` sans pseudo-sélecteur `:global`)
  - `app/components/HeaderComponent.vue` & `app/components/FooterComponent.vue` (double asset `logo_white.png` et `logo_black_256x256.png` géré sans filtre `invert(1)`)
  - `app/pages/index.vue` (consommation des tokens de text-shadow du hero)
- **Documents de référence :**
  - Spécification Thème : [`docs/specs/spec-theme-light-dark/SPEC.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/SPEC.md)
  - Spécification Technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
  - Spécification Design : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
  - Spécification UX : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md)
  - Cahier des charges Epics : [`docs/planning-artifacts/epics.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md#Epic 13)
  - Règles globales et invariants : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Points d'attention & Invariants critiques
1. **Pas de hardcoding de couleurs :** Toutes les adaptations s'appuient sur `var(--token)` et les variables sémantiques de `_root.scss`.
2. **Sanctuarisation absolue du terminal :** Le Hero Terminal et les fenêtres CLI flottantes sont sanctuarisés (fond sombre `--aubergine-deep`, prompt vert, barre de titre aubergine).
3. **Contraste forcé (`forced-colors`) :** Conserver le repli standard inline `outline: 2px solid transparent; outline-offset: 2px;` sur tous les focusables.
4. **Motion réduit :** Respecter `prefers-reduced-motion: reduce` sur toute transition ou animation ajoutée.
5. **Élimination des sélecteurs `:global` dans les SFC :** Éviter les artefacts de compilation Vue scoped où `:global([data-theme="light"]) selector` est tronqué en `[data-theme="light"]` sur l'élément racine `<html>`.

## Dev Agent Record

### Agent Model Used
Gemini 3.7 Flash

### Debug Log References
- Gate Docker 100% verte : ESLint 0 erreur, Stylelint 0 erreur, vue-tsc 0 erreur, Nitro SSG 28 routes statiques pré-rendues.
- Vérification visuelle Chrome DevTools (CDP) automatisée : captures multi-pages sous thème sombre et clair (`audit_dark_home.png`, `audit_light_home.png`, `audit_light_services.png`, `audit_light_about.png`, `audit_light_contact.png`, `audit_light_blog.png`).
- Rendu contrasté, photos nettes sans négatif, fond papier crème `#FAF8F4`, logos noirs dédiés, terminal sombre sanctuarisé.

### Completion Notes List
- Surcharge complète des tokens primitifs `--surface-0` à `--surface-4`, `--ink-1` à `--ink-4`, `--line-subtle`, `--line`, `--line-strong`, `--accent-hover`, `--accent-active` sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
- Sanctuarisation étendue du terminal et des blocs de code avec tokens sombres explicites.
- Remplacement du filtre raster d'inversion par un asset logo noir dédié (`logo_black_256x256.png`) dans `HeaderComponent.vue` et `FooterComponent.vue`.
- Calibration de l'atmosphère d'ambiance WebGL et du repli CSS via tokens (`--atmos-opacity`, `--atmos-fallback-accent`).
- Élimination des ombres portées résiduelles sur les titres clairs via `--hero-title-shadow: none`.
- Validation de conformité 100% verte de la gate de production Docker Nitro SSG (28 routes pré-rendues).

### File List
- `app/assets/scss/abstract/_root.scss`
- `app/components/home/HomeAtmosComponent.vue`
- `app/components/HeaderComponent.vue`
- `app/components/FooterComponent.vue`
- `app/pages/index.vue`
- `docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md`
- `docs/implementation-artifacts/sprint-status.yaml`

## Change Log
- 2026-09-18 : Code review et correction des 5 findings (suppression de l'inversion globale CSS et de l'opacité 0.18 sur html, intégration de `logo_black_256x256.png`, tokens de sanctuarisation terminal et atmosphère, gate Docker 100% verte).
- 2026-09-18 : Implémentation initiale de la Story 13.4.

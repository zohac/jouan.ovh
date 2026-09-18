---
baseline_commit: 08e08fe191517a257c8b3b5d7be17d8b78d7b19d
---

# Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG

Status: ready-for-dev

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

- [ ] Tâche 1 — Complétion des tokens primitifs et sémantiques dans `app/assets/scss/abstract/_root.scss` (AC: 1)
  - [ ] Ajouter la surcharge complète des variables primitives `--surface-0` à `--surface-4`, `--ink-1` à `--ink-4`, `--line-subtle`, `--line`, `--line-strong`, `--accent-hover`, `--accent-active` sous `[data-theme="light"]`.
  - [ ] Vérifier que `--text-shadow` ou ombres textuelles éventuelles s'adaptent ou s'effacent proprement sur fond clair.
  - [ ] Valider l'absence de régression sur la sanctuarisation du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`).

- [ ] Tâche 2 — Adaptation et calibration de l'atmosphère d'ambiance dans `app/components/home/HomeAtmosComponent.vue` (AC: 2)
  - [ ] Ajouter une règle d'opacité conditionnelle pour `.atmos__canvas` en mode clair :
    ```scss
    :global([data-theme="light"]) .atmos__canvas {
      opacity: 0.18;
    }
    ```
  - [ ] Adapter le repli `.atmos--fallback` pour le mode clair.
  - [ ] Vérifier que les masques `.grid-dots` et `.vignette` restent fluides et sans bordure dure sous les deux thèmes.

- [ ] Tâche 3 — Audit visuel transverse multi-pages et ajustements de polissage (AC: 3, AC: 4)
  - [ ] Tester visuellement la page d'accueil (`/`) en mode sombre et clair (desktop et mobile).
  - [ ] Tester visuellement la page Services (`/services`) et la grille de process.
  - [ ] Tester visuellement la page À propos (`/about`), les blocs de CV et l'inspecteur terminal.
  - [ ] Tester visuellement la page Contact (`/contact`), les inputs de formulaire et `/contact/card`.
  - [ ] Tester visuellement la page Blog (`/blog` et vue article markdown).
  - [ ] Vérifier la persistance `localStorage` et l'absence totale de FOUC au rechargement.

- [ ] Tâche 4 — Validation qualité Docker & certification SSG (AC: 5)
  - [ ] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
  - [ ] Réaliser une capture ou revue visuelle comparative sur navigateur (desktop et mobile).

## Dev Notes

### Architecture logicielle & Contrats de tokens
- **Fichiers principaux à modifier :**
  - `app/assets/scss/abstract/_root.scss` (complétion des tokens primitifs `--surface-*`, `--ink-*`, `--line-*` sous `[data-theme="light"]`)
  - `app/components/home/HomeAtmosComponent.vue` (atténuation opacité `.atmos__canvas` en mode clair)
  - Composants/pages spécifiques si des ajustements de contraste ou d'ombres résiduels sont constatés lors de l'audit transverse.
- **Documents de référence :**
  - Spécification Thème : [`docs/specs/spec-theme-light-dark/SPEC.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/SPEC.md)
  - Spécification Technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
  - Spécification Design : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
  - Spécification UX : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md)
  - Cahier des charges Epics : [`docs/planning-artifacts/epics.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md#Epic 13)
  - Règles globales et invariants : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Points d'attention & Invariants critiques
1. **Pas de hardcoding de couleurs :** Toutes les adaptations doivent impérativement s'appuyer sur `var(--token)` et les variables sémantiques de `_root.scss`.
2. **Sanctuarisation absolue du terminal :** Le Hero Terminal et les fenêtres CLI flottantes ne doivent en aucun cas être impactés par le mode clair (fond sombre `--aubergine-deep`, prompt vert, barre de titre aubergine).
3. **Contraste forcé (`forced-colors`) :** Conserver le repli standard inline `outline: 2px solid transparent; outline-offset: 2px;` sur tous les focusables.
4. **Motion réduit :** Respecter `prefers-reduced-motion: reduce` sur toute transition ou animation ajoutée.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2026-09-18 : Création de la Story 13.4 (cadrage de la validation transverse, complétion des tokens primitifs SCSS, atmosphère d'ambiance et gate Docker Nitro SSG).

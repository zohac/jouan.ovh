# Story 2.1: Porter les tokens du design system

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
so that tout composant style via une source unique de vérité (UX-DR1, FR2, NFR2).

## Acceptance Criteria

1. **Given** les tokens dans `docs/design_system/tokens/*.css`, **When** on les porte vers `assets/scss/abstract/` (et/ou CSS vars globales) via `@use`, **Then** les valeurs (orange accent, surfaces aubergine, échelle d'espacement, rayons, ombres, motion) sont consommables depuis n'importe quel composant.
2. **Given** le portage, **When** on écrit de nouveaux composants, **Then** aucune valeur de couleur/espace/rayon n'est hardcodée dans le nouveau code — tout passe par les tokens (CSS custom properties ou variables SCSS).

> Périmètre : **exposer les tokens** (couleurs, typo, espacement, rayons, élévation, motion) comme variables consommables globalement. Les `@font-face`/import de polices et le reset/base dark-first sont la **story 2.2**. Les primitives qui consomment ces tokens sont les stories 2.3–2.6. Cette story ne touche à aucun composant `.vue`.

## Tasks / Subtasks

- [ ] Tâche 1 — Créer le fichier d'entrée des tokens CSS globaux (AC: #1)
  - [ ] Créer `assets/scss/abstract/_root.scss` (le partiel `root` est déjà référencé par `assets/scss/abstract/_index.scss` mais **n'existe pas encore** — il fait actuellement échouer toute compilation de `abstract/_index`). Y déclarer un bloc `:root { … }` portant les CSS custom properties.
  - [ ] Y porter **à l'identique** les valeurs de `docs/design_system/tokens/colors.css` (échelles orange/aubergine, ramp `--surface-0…4`, hairlines `--line*`, encres `--ink-1…4`, palette terminale `--term-*`, sémantiques `--success/--warning/--danger/--info`, puis tous les alias `--bg-*`, `--text-*`, `--border-*`, `--accent*`, `--link`, `--prompt`, `--overlay`, `--selection`).
  - [ ] Ajouter la règle `::selection { background: var(--selection); }` (cf. `colors.css`).
- [ ] Tâche 2 — Porter typographie, espacement, rayons (AC: #1)
  - [ ] Porter `typography.css` : `--font-mono`/`--font-sans`/`--font-display`, échelle `--fs-xs…6xl`, poids `--fw-*`, line-heights `--lh-*`, letter-spacing `--ls-*`.
  - [ ] Porter `spacing.css` : `--space-0…24`, conteneurs `--container-*`, `--header-height`/`--footer-height` (56px), `--gutter`.
  - [ ] Porter `radius.css` : `--radius-none/xs/sm/md/lg/xl/pill/circle`.
- [ ] Tâche 3 — Porter élévation et motion (AC: #1)
  - [ ] Porter `elevation.css` : `--shadow-1…4`, `--shadow-hairline`, `--glow-accent`, `--glow-terminal`, `--ring-accent`.
  - [ ] Porter `motion.css` : durées `--dur-*`, easings `--ease-*`, et les keyframes `caret-blink` + `fade-rise` (les déclarer au niveau global, hors `:root`).
- [ ] Tâche 4 — Brancher les tokens dans la chaîne SCSS globale (AC: #1)
  - [ ] Vérifier que `assets/scss/abstract/_index.scss` charge bien `_root.scss` via `@use "root";` (déjà présent) — la création du partiel doit lever l'erreur de compilation.
  - [ ] S'assurer que `assets/scss/main.scss` (point d'entrée global déclaré dans `nuxt.config.ts` via `css: ["@/assets/scss/main.scss"]`) importe la couche tokens : ajouter `@use "abstract/index";` (ou `@use "abstract";`) si `main.scss` ne charge pas déjà `abstract/_index`. Aujourd'hui `main.scss` ne charge que `base/reset`, `abstract/fonts`, `abstract/typography` — les CSS vars ne sont donc pas globales tant qu'on ne branche pas la couche.
- [ ] Tâche 5 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` démarre ; inspecter le DOM : `:root` expose les nouvelles CSS vars (`--accent`, `--bg-page`, `--space-4`, `--radius-md`, etc.).
  - [ ] `yarn lint` (stylelint inclus) passe sans erreur sur le nouveau `_root.scss`.
  - [ ] Documenter dans le code (commentaire en tête de `_root.scss`) que ces tokens sont la source de vérité et qu'aucune valeur ne doit être hardcodée.

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Tokens, pas de valeurs en dur** : la source de vérité du style est `docs/design_system/tokens/` ; les composants consomment des tokens (SCSS `@use` / CSS vars). [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **CAP-2** : « Les valeurs de `docs/design_system/tokens/*.css` sont consommables depuis n'importe quel composant Vue (via SCSS `@use` et/ou CSS custom properties globales) ; aucune valeur de couleur/espace/rayon n'est hardcodée dans les nouveaux composants. » [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-2)]
- **Pattern de theming existant** : un composant déclare des CSS custom properties locales à partir de tokens SCSS, puis les consomme via `var()`. Le DS source fonctionne déjà en CSS custom properties globales — la voie la plus fidèle est d'exposer les tokens DS **en CSS vars globales sur `:root`** et de les consommer via `var(--token)` dans les composants. [Source: docs/project-context.md#SCSS (règle critique)]
- **SCSS `@use` uniquement, jamais `@import`** (déprécié). [Source: docs/project-context.md#SCSS]
- **NFR8** : Epic 1 (migration Nuxt 4) doit être verte avant cette story. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]

### Décision de portage (CSS vars globales vs SCSS $vars)

- Le DS source est **100 % CSS custom properties** (`docs/design_system/tokens/*.css` déclarent tout sous `:root`). Pour rester fidèle et permettre l'usage `var(--accent)` dans les primitives 2.3–2.6 sans réécriture, **porter en CSS vars globales** dans un partiel `_root.scss` chargé globalement.
- Les anciens tokens SCSS (`abstract/_color.scss`, `_space.scss`, `_radius.scss`, `_box_shadow.scss`, `_variables.scss`) **restent en place** (utilisés par le code legacy : `HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`, `card/*`). Ne pas les supprimer ici — leur retrait suivra la refonte composant par composant (header/footer = story 2.8 ; cartes = story 2.4).
- Les deux systèmes coexistent : ancien SCSS `$vars` pour le legacy, nouvelles CSS `--vars` pour le nouveau code DS.

### Fichiers à créer / modifier (lus — état actuel)

- **`assets/scss/abstract/_root.scss`** (CREATE) — n'existe pas ; pourtant `_index.scss` fait déjà `@use "root";`. Y déclarer `:root { … }` avec l'intégralité des tokens DS (colors, typography, spacing, radius, elevation, motion) + `::selection` + keyframes `caret-blink`/`fade-rise`.
- **`assets/scss/main.scss`** (UPDATE) — état actuel : `@use "base/reset"; @use "abstract/fonts"; @use "abstract/typography";` + quelques utilitaires. Brancher la couche tokens (`@use "abstract/index";` ou `@use "abstract";`) pour rendre les CSS vars globales. ⚠️ Attention aux conflits : `abstract/_index` charge aussi `typography` et `fonts` — éviter le double `@use` (Sass dédoublonne par module, mais vérifier qu'aucun side-effect CSS n'est dupliqué).
- **`assets/scss/abstract/_index.scss`** (lecture/vérif) — contient déjà `@use "root";` (8e ligne) ; aucune modification nécessaire si `_root.scss` est créé.
- **Tokens source à recopier** (lecture seule, ne pas modifier) : `docs/design_system/tokens/colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`.

### Mapping tokens (valeurs de référence à reproduire à l'identique)

- **Accent héros** : `--accent: var(--orange-500)` = `hsl(24 94% 53%)` ; `--accent-hover: hsl(24 100% 60%)` ; `--accent-active: var(--orange-600)` = `hsl(24 100% 47%)` ; `--accent-text: hsl(320 60% 5%)` (texte sombre sur orange). [Source: docs/design_system/tokens/colors.css]
- **Surfaces aubergine** : `--surface-0: hsl(320 30% 6%)` (fond page) … `--surface-4: hsl(316 14% 21%)` (inputs) ; `--bg-terminal: var(--aubergine-deep)` = `hsl(319 100% 9%)`. [Source: colors.css]
- **Espacement** : base 4px, `--space-1: 0.25rem` … `--space-24: 6rem`. `--header-height: 56px`, `--footer-height: 56px`. [Source: spacing.css]
- **Rayons** : `--radius-sm: 5px` (terminal/chips), `--radius-md: 8px` (cartes/inputs/boutons), `--radius-pill: 999px` (tags/avatars). [Source: radius.css]
- **Ombres** : `--shadow-2: 0 2px 8px hsl(320 60% 2% / 0.55)` + `--shadow-hairline: inset 0 1px 0 hsl(30 20% 100% / 0.05)` (carte « éclairée du dessus »). [Source: elevation.css]
- **Motion** : `--dur-base: 180ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` ; keyframes `caret-blink` (seule boucle UI) + `fade-rise`. [Source: motion.css]

### Pièges / régressions à éviter

- **Ne pas hardcoder** : recopier les valeurs DS dans `_root.scss` est attendu (c'est la source de vérité portée) ; mais dans tout futur composant, consommer via `var(--token)`, jamais en littéral. (NFR2)
- **Le partiel `root` manquant casse déjà la compilation** d'`abstract/_index` : si une story future fait `@use "abstract/index"`, ça plante tant que `_root.scss` n'existe pas. Cette story résout ce point.
- **Dark-first** : ne porter aucun token de thème clair (il n'y en a pas dans le DS) ; ne pas réintroduire le `body { background: #fff; }` du reset (traité en 2.2). (NFR1)
- **Compatibilité prerender** : tokens = CSS statique, aucun accès DOM — neutre pour `nuxi generate`. (NFR4)
- **Ne pas casser le legacy** : ne pas supprimer les anciens `$`-tokens SCSS encore consommés par header/footer/cartes/hexagones.

### Project Structure Notes

- SCSS structuré : `abstract/` (tokens, mixins, fonctions), `base/` (reset), `components/`, `pages/`, entrée `assets/scss/main.scss`. Le nouveau `_root.scss` vit dans `abstract/`. [Source: docs/project-context.md#Organisation]
- Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + **stylelint**, ne pas dégrader) + **`yarn dev` démarre** et les CSS vars apparaissent dans `:root`. Le build statique `yarn generate` doit rester vert. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-2), #Constraints]
- [Source: docs/project-context.md#SCSS (règle critique), #Port du design system, #Organisation]
- [Source: docs/design_system/tokens/colors.css, typography.css, spacing.css, radius.css, elevation.css, motion.css]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — corner radii, shadows, colour vibe]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

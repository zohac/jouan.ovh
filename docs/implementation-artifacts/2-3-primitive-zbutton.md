---
baseline_commit: a18e484894356470812ded548b0dc3144880d08b
---

# Story 2.3: Primitive ZButton

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want un composant bouton conforme au DS,
so that les CTA sont cohérents (UX-DR2, FR3).

## Acceptance Criteria

1. **Given** la référence `components/core/Button.jsx` (+ `.d.ts`), **When** on crée `ZButton.vue` (`<script setup>`), **Then** les variantes (primary orange, dark) et tailles rendent conformément à la référence.
2. **Given** la primitive, **When** l'utilisateur interagit, **Then** les états hover/press/focus suivent les tokens (orange → hover/active, nudge press de 1px, focus ring `--ring-accent`).

> Périmètre : **la primitive `ZButton.vue` uniquement**. S'appuie sur les tokens (2.1) et la base typo (2.2). L'intégration des icônes Lucide est la story 2.7 — ici, prévoir des slots/props icône (`icon`/`iconRight`) mais le rendu d'icône réel peut rester un `<slot>`.

## Tasks / Subtasks

- [x] Tâche 1 — Créer le composant `components/ui/ZButton.vue` (AC: #1)
  - [x] `<script setup lang="ts">` avec `defineProps` typé (interface `Props` + `withDefaults`) d'après `Button.d.ts`.
  - [x] Élément polymorphe via prop `as` — `<component :is="as">` ; `href`/`type`/`@click`… via `$attrs` (inheritAttrs par défaut).
  - [x] Slot par défaut (label) ; props `icon` / `iconRight` + slots nommés `icon` / `iconRight` rendus dans `.zbtn__icon` quand fournis (placeholders avant la story 2.7).
- [x] Tâche 2 — Variantes et tailles (AC: #1)
  - [x] Variantes `primary` / `secondary` / `ghost` / `terminal` / `danger`, défaut `primary`.
  - [x] Tailles `sm` (28px) / `md` (36px, défaut) / `lg` (44px) via `--_h`/`--_px`/`--_fs`.
- [x] Tâche 3 — États interactifs via tokens (AC: #2)
  - [x] `primary` : `var(--accent)` → hover `var(--accent-hover)` → active `var(--accent-active)` + `translateY(1px)`.
  - [x] `:focus-visible` : `box-shadow: var(--ring-accent)`, `outline: none`.
  - [x] `:disabled` / `[aria-disabled="true"]` : `opacity .45`, `cursor: not-allowed`, `pointer-events: none`.
  - [x] `terminal` : `--bg-terminal` + `--term-green`, hover bordure `--term-green` + `var(--glow-terminal)`.
- [x] Tâche 4 — Style scoped via tokens (AC: #1, #2)
  - [x] `<style lang="scss" scoped>` ; label `--font-mono` / `--fw-medium` / `letter-spacing: var(--ls-wide)` / `border-radius: var(--radius-md)`.
  - [x] Transitions background/border-color/color/transform en `--dur-fast var(--ease-standard)`.
  - [x] Aucune valeur hardcodée : les nuances terminal/danger utilisent des tokens existants (`--accent-2-soft`, `--ink-on-accent`).
- [x] Tâche 5 — Vérification (AC: #1, #2)
  - [x] Rendu prouvé par build : page de smoke-test temporaire (5 variantes + 3 tailles + `as="a"` + disabled) générée → HTML `<button class="zbtn zbtn--primary zbtn--md">`, CSS scoped émis (`.zbtn--primary{background:var(--accent)…}`), `as="a"`→`<a href>`, lien disabled→`aria-disabled="true"`, bouton disabled→attribut natif. Page de test supprimée ensuite (zéro résidu).
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` **exit 0** (24 routes).

### Review Findings

- [x] [Review][Patch] Ajouter aussi le support props d'icône `icon` / `iconRight`, en complément des slots nommés [app/components/ui/ZButton.vue:21]
- [x] [Review][Patch] Remplacer les deux couleurs hardcodées par des tokens existants [app/components/ui/ZButton.vue:155]
- [x] [Review][Patch] Retirer/localiser les changements Stylelint globaux non strictement nécessaires à `ZButton` [.stylelintrc.json:16]
- [x] [Review][Patch] Ajouter un `type="button"` par défaut au rendu natif `<button>` [app/components/ui/ZButton.vue:2]
- [x] [Review][Patch] Bloquer réellement l'activation des rendus non natifs disabled (`as="a"`, `NuxtLink`, etc.) [app/components/ui/ZButton.vue:2]
- [x] [Review][Patch] Refaire/documenter la validation via Docker avec `lint + typecheck + generate` [docs/implementation-artifacts/2-3-primitive-zbutton.md:43]

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** : recréer en Vue 3 `<script setup>` + SCSS `@use` ; ne pas copier le `.jsx`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Tokens, pas de valeurs en dur** : styler uniquement via tokens. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints ; primitives.md]
- **Cible** : `components/ui/ZButton.vue` (préfixe `Z`, dossier `ui/`). [Source: docs/specs/spec-design-system-revamp/primitives.md]
- **Dark-first** ; orange = unique accent héros (variante `primary`). [Source: docs/design_system/README.md#VISUAL FOUNDATIONS]
- Dépend de 2.1 (tokens) et 2.2 (police mono pour le label).

### Fichiers à créer / modifier (lus — état actuel)

- **`components/ui/ZButton.vue`** (CREATE) — le dossier `components/ui/` n'existe pas encore (à créer). Auto-import Nuxt actif : utilisable comme `<ZButton>` sans import manuel.
- **Réf. source** : `docs/design_system/components/core/Button.jsx` (CSS de référence), `Button.d.ts` (contrat de props), `Button.prompt.md` (intention/usages). Ne pas copier le mécanisme `ensureStyles()` (injection JS) — porter le CSS en `<style scoped>`.
- **Ne pas réutiliser** `assets/scss/components/_button.scss` (legacy, classes `.btn .btn-dark` du header) : c'est l'ancien bouton ; le `ZButton` est neuf. Ne pas modifier le legacy.

### Mapping props (depuis `Button.d.ts`)

| Prop | Type | Défaut | Notes |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "terminal" \| "danger"` | `"primary"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | hauteurs 28/36/44 |
| `icon` | slot/inline SVG | — | leading (story 2.7 pour le set Lucide) |
| `iconRight` | slot/inline SVG | — | trailing |
| `as` | `"button" \| "a" \| …` | `"button"` | polymorphe ; `as="a"` + `href` pour liens |
| `disabled` | natif | — | via attribut HTML natif |

### Mapping styles clés (depuis `Button.jsx`)

- Base : `display: inline-flex; align-items/justify center; gap var(--space-2); height var(--_h); padding 0 var(--_px); font-family var(--font-mono); font-size var(--_fs); font-weight var(--fw-medium); line-height 1; letter-spacing var(--ls-wide); border 1px solid transparent; border-radius var(--radius-md);`
- `sm` → `--_h: 28px; --_px: var(--space-3); --_fs: var(--fs-xs)` · `md` → `36px / var(--space-4) / var(--fs-sm)` · `lg` → `44px / var(--space-5) / var(--fs-base)`.
- `primary` → bg/border `--accent`, texte `--accent-text` ; hover `--accent-hover` ; active `--accent-active` + `translateY(1px)`.
- `secondary` → bg `--surface-2`, texte `--text-strong`, border `--border-default` ; hover `--surface-3` + `--border-strong`.
- `ghost` → transparent, texte `--text-body` ; hover bg `--surface-2`, texte `--text-strong`.
- `terminal` → bg `--bg-terminal`, texte `--term-green`, border `hsl(319 40% 30% / 0.6)` ; hover border `--term-green` + `--glow-terminal`.
- `danger` → bg/border `--danger`, hover `filter: brightness(1.08)`, active `translateY(1px)`.
- Focus : `:focus-visible { outline:none; box-shadow: var(--ring-accent); }`. Icône : `width:1.05em; height:1.05em`.

### Pièges / régressions à éviter

- **`as` polymorphe** : avec `<component :is>`, gérer `disabled` sur `<a>` via `aria-disabled` + `pointer-events:none` (un `<a>` n'a pas d'attribut `disabled`).
- **Press = nudge, pas scale** : `translateY(1px)`, jamais `transform: scale()` (règle motion DS : pas de bounce UI). [Source: docs/design_system/README.md#Press states]
- **Focus visible obligatoire** (a11y) : ne pas supprimer le ring. (NFR — CAP-11)
- **Prerender** : pas d'accès DOM ; ne pas porter `ensureStyles()`/`document.createElement` du `.jsx`. (NFR4)
- **Naming** : préfixe `Z` (cohérent avec `ZCard*` existants), suffixe non-`Component` ici car nouvelle famille `ui/` (cf. primitives.md). Conserver `ZButton` (pas `ZButtonComponent`).

### Project Structure Notes

- Nouveau dossier `components/ui/` accueille les primitives DS (`ZButton`, puis `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`). [Source: docs/specs/spec-design-system-revamp/primitives.md]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint) + **build `yarn generate` vert** + vérif visuelle des variantes/états en `yarn dev`. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.3]
- [Source: docs/specs/spec-design-system-revamp/primitives.md (Button → components/ui/ZButton.vue)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-3), #Constraints]
- [Source: docs/design_system/components/core/Button.jsx, Button.d.ts, Button.prompt.md]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS (hover/press states)]
- [Source: docs/project-context.md#Port du design system, #SCSS]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → exit 0.
- Validation détaillée : lint vert (0 erreur ; 43 warnings baseline), `typecheck` vert, `generate` vert (« Prerendered 24 routes »).
- **Diagnostic auto-import** : 1er `generate` rendait `<main><!----> …</main>` (ZButton non résolu). Cause : le défaut Nuxt préfixe les sous-dossiers (`ui/ZButton` → `UiZButton`), or la story attend `<ZButton>`. Corrigé via `components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"]`. 2e `generate` → `<button class="zbtn zbtn--primary zbtn--md">Primary</button>` (+ secondary/ghost/terminal/danger), `<a class="zbtn…" href="#test">`, `<a … aria-disabled="true">`, `<button … disabled>`.
- Preuve CSS scoped : `.zbtn--primary[data-v-…]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}` et les 5 variantes émises dans `.output/public/_nuxt/*.css`.

### Completion Notes List

- **`components/ui/ZButton.vue` créé** (`<script setup lang="ts">`) : props typées `variant`/`size`/`icon`/`iconRight`/`as`/`disabled` (`withDefaults`), polymorphe `<component :is="as">`, slots `default`/`icon`/`iconRight`. CSS porté de `Button.jsx` en `<style scoped>` (pas de portage de `ensureStyles()`/`document` → compatible prerender).
- **Disabled polymorphe** : `disabled` natif sur `<button>` ; `type="button"` par défaut pour éviter les submits implicites ; `aria-disabled="true"`, `tabindex="-1"`, suppression de `href`/listeners et guard events sur les autres tags (`<a>` n'a pas d'attribut `disabled`).
- **Press = nudge** : `translateY(1px)` (jamais `scale`), conforme à la règle motion DS.
- **Config Nuxt** (`nuxt.config.ts`) : `components` ajouté pour auto-importer `components/ui/` **sans préfixe** (`<ZButton>`), le reste de `components/` garde le scan par défaut. Enabler pour toutes les primitives `ui/` (2.4→2.6).
- **Config Stylelint** (`.stylelintrc.json`) : seul `selector-pseudo-class-no-unknown` ignore `:deep`/`:slotted`/`:global` de Vue. Les exceptions BEM/custom properties restent localisées dans le SFC via `stylelint-disable` ciblé.
- **Tokens-only rétabli** : bordure terminal `--accent-2-soft`, encre danger `--ink-on-accent`.
- **Legacy intact** : `assets/scss/components/_button.scss` (ancien `.btn`) non touché.

### File List

- `app/components/ui/ZButton.vue` (CRÉÉ) — primitive bouton DS.
- `nuxt.config.ts` (MODIFIÉ) — `components` : auto-import `components/ui/` sans préfixe.
- `.stylelintrc.json` (MODIFIÉ) — pseudo-classes Vue autorisées pour `:deep`/`:slotted`/`:global`.

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-20 | 0.1 | Primitive `ZButton.vue` (5 variantes, 3 tailles, états hover/press/focus, polymorphe `as`, slots icône) 100 % tokens. Auto-import `ui/` sans préfixe + patterns Stylelint BEM/Vue. Lint/typecheck/generate verts, rendu prouvé. Status → review. | Amelia (dev-story) |
| 2026-06-21 | 0.2 | Findings de code review résolus : props icône, disabled polymorphe renforcé, `type="button"` par défaut, tokens-only, Stylelint localisé, validation Docker complète. Status → done. | Codex (code-review) |

# Story 2.3: Primitive ZButton

Status: ready-for-dev

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

- [ ] Tâche 1 — Créer le composant `components/ui/ZButton.vue` (AC: #1)
  - [ ] `<script setup lang="ts">` avec `defineProps` typé d'après `Button.d.ts`.
  - [ ] Élément polymorphe via prop `as` (`"button" | "a"` …) — `<component :is="as">` ; transmettre `href`, `disabled`, etc. via `$attrs` (inheritAttrs par défaut OK).
  - [ ] Slot par défaut pour le label ; slots/props `icon` et `iconRight` pour les icônes inline (placeholders en attendant la story 2.7).
- [ ] Tâche 2 — Variantes et tailles (AC: #1)
  - [ ] Variantes : `primary` (orange), `secondary` (surface + bordure), `ghost` (texte seul), `terminal` (aubergine + vert), `danger`. Défaut `primary`.
  - [ ] Tailles : `sm` (28px), `md` (36px, défaut), `lg` (44px) via les variables locales `--_h`/`--_px`/`--_fs`.
- [ ] Tâche 3 — États interactifs via tokens (AC: #2)
  - [ ] `primary` : `background var(--accent)` → hover `var(--accent-hover)` → active `var(--accent-active)` + `transform: translateY(1px)`.
  - [ ] `:focus-visible` : `box-shadow: var(--ring-accent)`, `outline: none`.
  - [ ] `:disabled`/`[aria-disabled="true"]` : `opacity .45`, `cursor: not-allowed`, `pointer-events: none`.
  - [ ] `terminal` : fond `--bg-terminal`, texte `--term-green`, hover → bordure `--term-green` + `box-shadow: var(--glow-terminal)`.
- [ ] Tâche 4 — Style scoped via tokens (AC: #1, #2)
  - [ ] `<style lang="scss" scoped>` ; label en `--font-mono`, `--fw-medium`, `letter-spacing: var(--ls-wide)`, `border-radius: var(--radius-md)`.
  - [ ] Transitions sur background/border-color/color/transform en `--dur-fast var(--ease-standard)`.
  - [ ] Aucune valeur hardcodée — tout via `var(--token)`.
- [ ] Tâche 5 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : poser un `ZButton` de test (ex. dans une page existante) et vérifier les 5 variantes + 3 tailles + hover/press/focus.
  - [ ] `yarn lint` (eslint + stylelint) vert ; `yarn generate` reste vert.

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

### Debug Log References

### Completion Notes List

### File List

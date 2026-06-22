---
baseline_commit: efc11e972298f62d06b8f1756beee7fde2691348
---

# Story 2.5: Primitives ZBadge et ZTag

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want des composants badge et tag conformes au DS,
so that les libellés et chips sont cohérents (UX-DR4, UX-DR5, FR3).

## Acceptance Criteria

1. **Given** les références `Badge.jsx` et `Tag.jsx`, **When** on crée `ZBadge.vue` et `ZTag.vue` (tag en radius pill), **Then** ils rendent conformément aux références et stylent via tokens.

> Périmètre : **deux primitives** `ZBadge.vue` et `ZTag.vue` dans `components/ui/`. S'appuie sur les tokens (2.1) et la base typo (2.2).

## Tasks / Subtasks

- [x] Tâche 1 — Créer `components/ui/ZBadge.vue` (AC: #1)
  - [x] `<script setup lang="ts">`, `defineProps` (`withDefaults`) d'après `Badge.d.ts` : `tone` (`neutral` défaut), `dot` (`false`).
  - [x] Rendu `<span>` ; si `dot`, point de statut en tête (`currentcolor`, 6px, rond, `aria-hidden`) ; slot par défaut.
  - [x] Tones : `neutral`, `accent`, `success`, `warning`, `danger`, `info`.
- [x] Tâche 2 — Style `ZBadge` via tokens (AC: #1)
  - [x] Base : `inline-flex; gap var(--space-2); height 22px; padding 0 var(--space-2); var(--font-mono); var(--fs-xs); var(--fw-medium); letter-spacing var(--ls-wide); border 1px solid transparent; border-radius var(--radius-sm)`.
  - [x] Mapping tones (bg/texte/bordure) repris de `Badge.jsx` (bordures = teintes DS sans token équivalent, portées telles quelles + commentées, notation normalisée).
- [x] Tâche 3 — Créer `components/ui/ZTag.vue` (AC: #1)
  - [x] `<script setup lang="ts">`, `defineProps` d'après `Tag.d.ts` : `hash` (`true`). `inheritAttrs: false` ; `onRemove`/`onClick` détectés via les attrs (fidèle à l'API React : `×` et état cliquable n'apparaissent que si un listener est fourni).
  - [x] Préfixe `#` orange via `::before` (désactivé si `hash=false` → classe `--plain`).
  - [x] Bouton `×` optionnel (`type="button"`, `aria-label="Retirer"`, `@click.stop`, hover `--term-red`, focus ring a11y) ; invoque le handler `onRemove` fourni.
- [x] Tâche 4 — Style `ZTag` via tokens (AC: #1)
  - [x] Base : `inline-flex; gap var(--space-2); height 26px; padding 0 var(--space-3); var(--font-mono); var(--fs-xs); var(--fw-regular); color var(--text-body); background var(--surface-2); border 1px solid var(--border-subtle); border-radius var(--radius-pill)`.
  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
- [x] Tâche 5 — Vérification (AC: #1)
  - [x] Rendu prouvé par build (page de smoke-test temporaire, supprimée après) : `<span class="zbadge zbadge--{tone}">` pour les 6 tones, `zbadge__dot` pour `dot` ; `<span class="ztag">`, `ztag--plain` (`hash=false`), `ztag--clickable` (`@click`), bouton `ztag__remove` (`@remove`). CSS scoped émis : 6 tones, `border-radius:var(--radius-pill)`, `--plain`/`--clickable`.
  - [x] `pnpm lint` **exit 0** ; `pnpm typecheck` **exit 0** ; `pnpm generate` **exit 0** (24 routes).

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** ; **tokens, pas de valeurs en dur** ; `<script setup>` + SCSS `<style scoped>`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Cibles** : `components/ui/ZBadge.vue` et `components/ui/ZTag.vue` (tag en radius pill). [Source: docs/specs/spec-design-system-revamp/primitives.md]
- **Palette terminale/syntaxe** pour les fills doux des badges (vert/bleu/rouge/jaune/cyan/purple) — pas comme grands aplats UI. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS]
- Dépend de 2.1 (tokens) et 2.2 (police mono).

### Fichiers à créer (lus — état actuel)

- **`components/ui/ZBadge.vue`** (CREATE) · **`components/ui/ZTag.vue`** (CREATE) — dossier `components/ui/` (créé en 2.3). Auto-import Nuxt actif.
- **Réf. source** : `docs/design_system/components/core/Badge.jsx` + `Badge.d.ts` + `Badge.prompt.md` ; `Tag.jsx` + `Tag.d.ts` + `Tag.prompt.md`.

### Mapping props (depuis `.d.ts`)

**ZBadge** (`Badge.d.ts`) : `tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info"` (défaut `neutral`) ; `dot?: boolean` (défaut `false`).

**ZTag** (`Tag.d.ts`) : `hash?: boolean` (défaut `true`) ; `onRemove?` → en Vue, émettre `@remove` + rendre le `×` ; clic interactif → émettre `@click` (chip de filtre).

### Mapping styles — tones de `ZBadge` (depuis `Badge.jsx`)

| tone | background | color | border |
|---|---|---|---|
| neutral | `var(--surface-3)` | `var(--text-body)` | `var(--border-default)` |
| accent | `var(--accent-soft)` | `var(--accent)` | `hsl(24 94% 53% / 0.3)` |
| success | `var(--success-soft)` | `var(--success)` | `hsl(143 50% 32% / 0.5)` |
| warning | `var(--warning-soft)` | `var(--warning)` | `hsl(38 70% 32% / 0.5)` |
| danger | `var(--danger-soft)` | `var(--danger)` | `hsl(0 55% 35% / 0.5)` |
| info | `var(--info-soft)` | `var(--info)` | `hsl(204 55% 32% / 0.5)` |

Le point de statut : `width/height 6px; border-radius var(--radius-circle); background currentColor;`.

### Mapping styles — `ZTag` (depuis `Tag.jsx`)

- `::before { content:"#"; color: var(--accent); }` ; variante `plain` → `content:""`.
- `--clickable` → `cursor:pointer`, hover `border-color var(--border-strong)` + `color var(--text-strong)`.
- `__remove` : 14px, sans bordure/fond, `color var(--text-muted)`, hover `--term-red`, `aria-label="Retirer"`, glyphe `×`.

### Pièges / régressions à éviter

- **Radius distincts** : badge = `--radius-sm` (5px) ; tag = `--radius-pill` (999px). Ne pas confondre.
- **API React → Vue** : `onRemove`/`onClick` (props callback React) deviennent des **événements émis** (`emit('remove')`, `emit('click')`) ; le `stopPropagation` sur le `×` doit être conservé (`@click.stop`).
- **Pas de hardcode** : les quelques `hsl(... / 0.x)` de bordure viennent du DS et sont tolérés tels quels (valeurs DS portées), mais privilégier les tokens existants quand ils couvrent le besoin.
- **Prerender** : pas d'`ensureStyles()`/DOM ; CSS en `<style scoped>`. (NFR4)
- **Naming** : `ZBadge`/`ZTag` (famille `ui/`, pas de suffixe `Component`).

### Project Structure Notes

- Primitives dans `components/ui/` aux côtés de `ZButton`/`ZCard`. [Source: docs/specs/spec-design-system-revamp/primitives.md]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint) + **`yarn generate` vert** + vérif visuelle des tones/variantes. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.5]
- [Source: docs/specs/spec-design-system-revamp/primitives.md (Badge → ZBadge.vue ; Tag → ZTag.vue, radius pill)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-3)]
- [Source: docs/design_system/components/core/Badge.jsx, Badge.d.ts, Badge.prompt.md]
- [Source: docs/design_system/components/core/Tag.jsx, Tag.d.ts, Tag.prompt.md]
- [Source: docs/project-context.md#Port du design system, #SCSS]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `pnpm lint` → exit 0 ; `pnpm typecheck` → exit 0 ; `pnpm generate` → exit 0 (24 routes). 2 erreurs Prettier transitoires (compactage attributs ZTag) corrigées via `eslint --fix`.
- Preuves sortie (page smoke temporaire) : `<span class="zbadge zbadge--neutral|accent|success|warning|danger|info">`, `zbadge__dot` (tones avec `dot`) ; `<span class="ztag">`, `ztag--plain`, `ztag--clickable`, bouton `ztag__remove`. CSS : 6 `.zbadge--*`, `.ztag{…border-radius:var(--radius-pill)…}`, `.ztag--plain`/`.ztag--clickable`.

### Completion Notes List

- **`components/ui/ZBadge.vue` créé** : `<span>`, props `tone` (6 valeurs)/`dot`, point de statut `currentcolor` (`aria-hidden`). CSS porté de `Badge.jsx` 100 % tokens, `--radius-sm`. Auto-import `<ZBadge>`.
- **`components/ui/ZTag.vue` créé** : `<span>` pill (`--radius-pill`), préfixe `#` via `::before` (classe `--plain` si `hash=false`), bouton `×` optionnel.
  - **API React → Vue** : `onRemove`/`onClick` (callbacks React) → détection de listener via `useAttrs()` (`inheritAttrs: false`). Le `×` et l'état `--clickable` n'apparaissent que si un handler est fourni — fidèle à la sémantique de référence. `@click.stop` sur le `×` préserve le `stopPropagation` de la réf. (pas de déclenchement du clic du tag).
  - **a11y** : `×` = `<button type="button" aria-label="Retirer">` + `:focus-visible` ring (`--ring-accent`).
- **Bordures de tones (`ZBadge`)** : teintes DS dédiées (`hsl(143 50% 32% / 0.5)`, etc.) sans token équivalent → portées telles quelles de `Badge.jsx` (explicitement toléré par la story), notation normalisée (`deg`/`%`) pour Stylelint, commentées.
- **Conventions revues 2.3/2.4 appliquées** : `/* stylelint-disable selector-class-pattern */` inline (BEM `zbadge__dot`/`ztag--plain`…), `prefers-reduced-motion` neutralise la transition de `ZTag`. Aucun changement Stylelint global.
- **Prerender-safe** : pas de portage de `ensureStyles()`/`document` ; CSS en `<style scoped>`.
- Vérif par page de smoke-test temporaire (`app/pages/__zbadgetag_smoke.vue`) générée puis **supprimée** (zéro résidu).

### File List

- `app/components/ui/ZBadge.vue` (CRÉÉ) — primitive badge DS (6 tones, dot).
- `app/components/ui/ZTag.vue` (CRÉÉ) — primitive tag pill DS (hash, clickable, removable).

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-22 | 0.1 | Primitives `ZBadge.vue` (6 tones + dot) et `ZTag.vue` (pill, `#`, clickable/removable, détection de listener) 100 % tokens. Lint/typecheck/generate verts, rendu prouvé. Status → review. | Amelia (dev-story) |

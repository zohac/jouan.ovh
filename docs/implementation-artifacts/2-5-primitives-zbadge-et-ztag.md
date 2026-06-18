# Story 2.5: Primitives ZBadge et ZTag

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want des composants badge et tag conformes au DS,
so that les libellés et chips sont cohérents (UX-DR4, UX-DR5, FR3).

## Acceptance Criteria

1. **Given** les références `Badge.jsx` et `Tag.jsx`, **When** on crée `ZBadge.vue` et `ZTag.vue` (tag en radius pill), **Then** ils rendent conformément aux références et stylent via tokens.

> Périmètre : **deux primitives** `ZBadge.vue` et `ZTag.vue` dans `components/ui/`. S'appuie sur les tokens (2.1) et la base typo (2.2).

## Tasks / Subtasks

- [ ] Tâche 1 — Créer `components/ui/ZBadge.vue` (AC: #1)
  - [ ] `<script setup lang="ts">`, `defineProps` d'après `Badge.d.ts` : `tone` (`neutral` défaut), `dot` (`false`).
  - [ ] Rendu `<span>` ; si `dot`, point de statut en tête (`currentColor`, 6px, rond) ; slot par défaut pour le label.
  - [ ] Tones : `neutral`, `accent`, `success`, `warning`, `danger`, `info` (fills doux de la palette terminale/sémantique).
- [ ] Tâche 2 — Style `ZBadge` via tokens (AC: #1)
  - [ ] Base : `inline-flex; gap var(--space-2); height 22px; padding 0 var(--space-2); font-family var(--font-mono); font-size var(--fs-xs); font-weight var(--fw-medium); letter-spacing var(--ls-wide); border 1px solid transparent; border-radius var(--radius-sm);`
  - [ ] Mapping tones (bg/texte/bordure) repris de `Badge.jsx` (voir tableau ci-dessous).
- [ ] Tâche 3 — Créer `components/ui/ZTag.vue` (AC: #1)
  - [ ] `<script setup lang="ts">`, `defineProps` d'après `Tag.d.ts` : `hash` (`true`), plus support `onRemove`/clic (en Vue : émettre `remove` et rendre cliquable si un listener `click` est présent).
  - [ ] Préfixe `#` orange via `::before` (désactivé si `hash=false` → classe `--plain`).
  - [ ] Bouton `×` de suppression optionnel (émet `remove`, `aria-label="Retirer"`, hover `--term-red`).
- [ ] Tâche 4 — Style `ZTag` via tokens (AC: #1)
  - [ ] Base : `inline-flex; gap var(--space-2); height 26px; padding 0 var(--space-3); font-family var(--font-mono); font-size var(--fs-xs); font-weight var(--fw-regular); color var(--text-body); background var(--surface-2); border 1px solid var(--border-subtle); border-radius var(--radius-pill);`
  - [ ] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`.
- [ ] Tâche 5 — Vérification (AC: #1)
  - [ ] `yarn dev` : poser des `ZBadge` (tous tones, avec/sans dot) et `ZTag` (avec/sans `#`, removable) de test ; comparer aux cartes de référence.
  - [ ] `yarn lint` (eslint + stylelint) vert ; `yarn generate` reste vert.

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

### Debug Log References

### Completion Notes List

### File List

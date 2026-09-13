---
baseline_commit: 34f112905e05db48357018c5f6ba19c56f6b1a8a
---

# Story 2.6: Primitives ZInput et ZAvatar

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want des composants champ et avatar conformes au DS,
so that les formulaires et identités visuelles sont cohérents (UX-DR6, UX-DR7, FR3).

## Acceptance Criteria

1. **Given** les références `Input.jsx` et `Avatar.jsx`, **When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill), **Then** ils rendent conformément aux références et stylent via tokens.

> Périmètre : **deux primitives** `ZInput.vue` et `ZAvatar.vue` dans `components/ui/`. S'appuie sur les tokens (2.1) et la base typo (2.2). `ZInput` sera réutilisé par le formulaire Contact (Epic 7) ; `ZAvatar` par le portrait/byline (Epics 3/5/6).

## Tasks / Subtasks

- [x] Tâche 1 — Créer `components/ui/ZInput.vue` (AC: #1)
  - [x] `<script setup lang="ts">`, `defineProps` (`withDefaults`) d'après `Input.d.ts` : `label`, `hint`, `error`, `required`, `multiline`, `icon`, `id` (+ `modelValue`).
  - [x] `v-model` : `modelValue` + `update:modelValue` (émis sur `@input`). `inheritAttrs: false` → `$attrs` (placeholder/type…) forwardés sur le contrôle, pas le wrapper.
  - [x] Rendu conditionnel : `<textarea>` si `multiline`, sinon `<input>` (wrapper + slot/prop `icon` si présent).
  - [x] Label mono uppercase ; `*` orange si `required` (+ `required` natif sur le contrôle) ; hint en dessous (rouge si `error`). **a11y** : `label[for]`↔`id` (via `useId`, hydration-safe), `aria-invalid` si error, `aria-describedby`→hint.
- [x] Tâche 2 — Style `ZInput` via tokens (AC: #1)
  - [x] Champ : `var(--font-sans)`, `var(--fs-base)`, `var(--text-strong)`, `var(--bg-input)`, `1px solid var(--border-default)`, `var(--radius-md)`, `height 42px`, `padding 0 var(--space-3)` (textarea : `min-height 110px`, `resize: vertical`, `padding var(--space-3)`).
  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
  - [x] Erreur `var(--danger)` (champ + hint). Placeholder `var(--text-faint)`.
  - [x] Label : `var(--font-mono)`, `var(--fs-xs)`, `var(--ls-wider)`, uppercase, `var(--text-muted)` ; `.zfield__req { color: var(--accent); }`.
- [x] Tâche 3 — Créer `components/ui/ZAvatar.vue` (AC: #1)
  - [x] `<script setup lang="ts">`, `defineProps` d'après `Avatar.d.ts` : `src`, `alt` (`""`), `initials`, `size` (`md`), `ring` (`false`).
  - [x] Si `src` → `<NuxtImg>` (pas `<img>` brut) ; sinon initiales (fallback `"?"`).
  - [x] Tailles `sm` 32 / `md` 44 / `lg` 64 / `xl` 96 ; `ring` → anneau accent.
- [x] Tâche 4 — Style `ZAvatar` via tokens (AC: #1)
  - [x] `inline-flex center; border-radius var(--radius-circle); overflow hidden; background var(--surface-3); color var(--text-strong); var(--font-mono); var(--fw-bold); border 1px solid var(--border-default)`.
  - [x] Taille via `--_sz` ; police initiales `calc(var(--_sz) * 0.4)` ; `ring` → `box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--accent)`.
- [x] Tâche 5 — Vérification (AC: #1)
  - [x] Rendu prouvé par build (page de smoke-test temporaire, supprimée après) : `<label for="v-0-0">`↔`<input id="v-0-0" class="zinput">`, `<textarea class="ztextarea">` (multiline), `zfield--error`+`aria-invalid="true"`+`aria-describedby`, `zfield__req`, `zinput--has-icon`/`zinput__icon` ; `<img data-nuxt-img srcset="/_ipx/…">` (NuxtImg), `zavatar--sm/md/lg/xl`, `zavatar--ring` (box-shadow double `--bg-page`+`--accent`).
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` **exit 0** (`lint` : 43 warnings existants, 0 error ; `typecheck` vert ; `generate` : 24 routes).

### Review Findings

- [x] [Review][Patch] Protéger les attributs contrôlés de `ZInput` contre l'écrasement par `$attrs` [app/components/ui/ZInput.vue:14]
- [x] [Review][Patch] Garder une taille avatar valide si `size` reçoit une valeur runtime invalide [app/components/ui/ZAvatar.vue:44]
- [x] [Review][Patch] Revenir aux initiales si l'image de `ZAvatar` échoue au chargement [app/components/ui/ZAvatar.vue:3]

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** ; **tokens, pas de valeurs en dur** ; `<script setup>` + SCSS `<style scoped>`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Cibles** : `components/ui/ZInput.vue` (bordure `--border-default` → `--border-strong` au focus — formulé dans primitives.md ; le `.jsx` montre en plus le focus accent `--accent` + ring) et `components/ui/ZAvatar.vue` (radius pill/circle). [Source: docs/specs/spec-design-system-revamp/primitives.md]
- **Images** : `<nuxt-img>`/`<nuxt-picture>`, jamais `<img>` brut ; portrait dans `assets/`/`public/images/`. [Source: docs/project-context.md#Nuxt, #Organisation]
- Dépend de 2.1 (tokens) et 2.2 (police mono/sans).

### Fichiers à créer (lus — état actuel)

- **`components/ui/ZInput.vue`** (CREATE) · **`components/ui/ZAvatar.vue`** (CREATE) — dossier `components/ui/`.
- **Réf. source** : `Input.jsx` + `Input.d.ts` + `Input.prompt.md` ; `Avatar.jsx` + `Avatar.d.ts` + `Avatar.prompt.md`.
- **Portrait** : `docs/design_system/assets/brand/portrait.jpeg` à copier vers `public/images/` (ou `assets/`) lors de l'usage (story Avatar dans Home/About — Epics 3/5). [Source: docs/project-context.md#Organisation]

### Mapping props (depuis `.d.ts`)

**ZInput** (`Input.d.ts`) : `label?`, `hint?`, `error?: boolean` (`false`), `required?: boolean` (`false`), `multiline?: boolean` (`false`), `icon?` (SVG inline), `id?`. Forwarde tous les attributs natifs input/textarea → en Vue, gérer `v-model` (`modelValue`/`update:modelValue`) + `$attrs`.

**ZAvatar** (`Avatar.d.ts`) : `src?`, `alt?` (`""`), `initials?`, `size?: "sm" | "md" | "lg" | "xl"` (`md`), `ring?: boolean` (`false`).

### Mapping styles clés

**ZInput** (depuis `Input.jsx`) :
- `.ds-input/.ds-textarea` : sans-serif value, `--bg-input`, border `--border-default`, `--radius-md`, height 42 (textarea auto, min 110, resize vertical).
- hover `--border-strong` ; focus `--accent` + `--ring-accent` ; error `--danger`.
- label : mono, `--fs-xs`, `--ls-wider`, uppercase, `--text-muted` ; `.req` orange.
- icône : wrapper `position:relative`, icône absolue à `var(--space-3)`, input `padding-left: calc(var(--space-3) + 1.4em)`.

**ZAvatar** (depuis `Avatar.jsx`) :
- `--_sz` 32/44/64/96 ; `border-radius var(--radius-circle)` ; `background --surface-3` ; bordure `--border-default`.
- `img { width/height 100%; object-fit cover; }` ; ring → double `box-shadow` (gap `--bg-page` + anneau `--accent`).
- *Note primitives.md « radius pill »* : le `.jsx` utilise `--radius-circle` (rond) ; suivre le `.jsx` (rond) qui est l'intention réelle de l'avatar.

### Pièges / régressions à éviter

- **v-model** : `Input.jsx` forwarde les attributs natifs (`value`/`onChange`) ; en Vue, exposer un `modelValue` propre pour l'usage formulaire (Contact, Epic 7).
- **`<nuxt-img>` pour l'avatar image** : ne pas porter le `<img>` brut du `.jsx`. [Source: docs/project-context.md#Nuxt]
- **Focus accessible** : conserver le ring orange au focus (a11y, CAP-11) ; ne pas masquer l'outline sans alternative visible.
- **Prerender** : pas d'`ensureStyles()`/DOM ; styles en `<style scoped>`. (NFR4)
- **id/label** : générer un `id` stable pour lier `<label for>` au contrôle (déterministe pour le prerender — éviter les ids aléatoires non hydration-safe).
- **Naming** : `ZInput`/`ZAvatar` (famille `ui/`).

### Project Structure Notes

- Primitives dans `components/ui/`. Le portrait et autres assets de marque sont copiés depuis `docs/design_system/assets/brand/` vers `public/images/` au moment de l'usage. [Source: docs/project-context.md#Organisation]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint) + **`yarn generate` vert** + vérif visuelle (focus ring, error, tailles avatar). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.6]
- [Source: docs/specs/spec-design-system-revamp/primitives.md (Input → ZInput.vue ; Avatar → ZAvatar.vue)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-3)]
- [Source: docs/design_system/components/core/Input.jsx, Input.d.ts, Input.prompt.md]
- [Source: docs/design_system/components/core/Avatar.jsx, Avatar.d.ts, Avatar.prompt.md]
- [Source: docs/project-context.md#Nuxt (images), #SCSS, #Organisation]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → exit 0 ; `lint` : 43 warnings existants, 0 error ; `typecheck` → exit 0 ; `generate` → exit 0 (24 routes). 1 erreur Prettier transitoire (`<input>` auto-fermé) corrigée via `eslint --fix` ; 7 erreurs Stylelint `custom-property-pattern` sur `--_sz` (ZAvatar) corrigées en ajoutant `custom-property-pattern` au `stylelint-disable` inline (comme `--_h` de ZButton).
- Preuves sortie (page smoke temporaire) : `<label for="v-0-0">` ↔ `<input id="v-0-0" class="zinput">` (lien `useId`), `<textarea class="ztextarea">`, `zfield--error` + `aria-invalid="true"` + `aria-describedby="v-0-1-hint"`, `zfield__req`, `zinput--has-icon`/`zinput__icon` ; `<img data-nuxt-img srcset="/_ipx/_/images/…">` (NuxtImg, pas de `<img>` brut), `zavatar--{sm,md,lg,xl}`, `.zavatar--ring{box-shadow:0 0 0 2px var(--bg-page),0 0 0 4px var(--accent)}`.

### Completion Notes List

- **`components/ui/ZInput.vue` créé** : `<div>` field + label mono uppercase + `<input>`/`<textarea>` (selon `multiline`) + hint. CSS porté de `Input.jsx` 100 % tokens.
  - **v-model** : `modelValue` + `update:modelValue` (`@input`). `inheritAttrs: false` → `$attrs` (placeholder, type, name…) forwardés sur le contrôle, pas le wrapper.
  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
  - **icon** : prop (composant) + slot nommé `icon` (cohérent avec `ZButton`), placeholder avant le set Lucide (2.7).
- **`components/ui/ZAvatar.vue` créé** : `<span>` rond (`--radius-circle`, suit `Avatar.jsx` — pas pill), image via **`<NuxtImg>`** (optimisée `_ipx`, jamais `<img>` brut) ou initiales (fallback `"?"`). Tailles `sm/md/lg/xl` via `--_sz`, `ring` → double box-shadow (`--bg-page` + `--accent`). Revue : taille runtime invalide ramenée à `md`, et échec image → fallback initiales.
- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
- Vérif par page de smoke-test temporaire (`app/pages/__zinputavatar_smoke.vue`) générée puis **supprimée** (zéro résidu). Le portrait `docs/design_system/assets/brand/portrait.jpeg` sera copié vers `public/images/` à l'usage réel (Epics 3/5) — hors périmètre de cette primitive.

### File List

- `app/components/ui/ZInput.vue` (CRÉÉ) — primitive champ DS (v-model, label/hint/error/required/multiline/icon, a11y).
- `app/components/ui/ZAvatar.vue` (CRÉÉ) — primitive avatar DS (image NuxtImg / initiales, 4 tailles, ring).

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-22 | 0.1 | Primitives `ZInput.vue` (v-model, a11y label/id via useId, focus ring, error, icon) et `ZAvatar.vue` (NuxtImg/initiales, 4 tailles, ring) 100 % tokens. Lint/typecheck/generate verts, rendu prouvé. Status → review. | Amelia (dev-story) |
| 2026-06-22 | 0.2 | Correctifs review : attrs contrôlés de `ZInput` protégés/fusion `aria-describedby`, fallback taille `ZAvatar`, fallback initiales sur erreur image, validation Docker documentée. Status → done. | Codex (code-review) |

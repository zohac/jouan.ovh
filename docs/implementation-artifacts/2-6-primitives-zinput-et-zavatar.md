# Story 2.6: Primitives ZInput et ZAvatar

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur,
I want des composants champ et avatar conformes au DS,
so that les formulaires et identités visuelles sont cohérents (UX-DR6, UX-DR7, FR3).

## Acceptance Criteria

1. **Given** les références `Input.jsx` et `Avatar.jsx`, **When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill), **Then** ils rendent conformément aux références et stylent via tokens.

> Périmètre : **deux primitives** `ZInput.vue` et `ZAvatar.vue` dans `components/ui/`. S'appuie sur les tokens (2.1) et la base typo (2.2). `ZInput` sera réutilisé par le formulaire Contact (Epic 7) ; `ZAvatar` par le portrait/byline (Epics 3/5/6).

## Tasks / Subtasks

- [ ] Tâche 1 — Créer `components/ui/ZInput.vue` (AC: #1)
  - [ ] `<script setup lang="ts">`, `defineProps` d'après `Input.d.ts` : `label`, `hint`, `error` (`false`), `required` (`false`), `multiline` (`false`), `icon`, `id`.
  - [ ] `v-model` : exposer `modelValue` + émettre `update:modelValue` (équivalent Vue des attributs natifs forwarded du `.jsx`).
  - [ ] Rendu conditionnel : `<textarea>` si `multiline`, sinon `<input>` (avec wrapper + slot/prop `icon` si présent).
  - [ ] Label mono uppercase ; `*` orange si `required` ; hint en dessous (rouge si `error`).
- [ ] Tâche 2 — Style `ZInput` via tokens (AC: #1)
  - [ ] Champ : `font-family var(--font-sans); font-size var(--fs-base); color var(--text-strong); background var(--bg-input); border 1px solid var(--border-default); border-radius var(--radius-md); height 42px; padding 0 var(--space-3);` (textarea : `min-height 110px`, `resize: vertical`, `padding var(--space-3)`).
  - [ ] Hover : `border-color var(--border-strong)`. **Focus** : `border-color var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`.
  - [ ] Erreur : `border-color var(--danger)` + hint `--danger`. Placeholder `--text-faint`.
  - [ ] Label : `font-family var(--font-mono); font-size var(--fs-xs); letter-spacing var(--ls-wider); text-transform uppercase; color var(--text-muted);` ; `.req { color var(--accent); }`.
- [ ] Tâche 3 — Créer `components/ui/ZAvatar.vue` (AC: #1)
  - [ ] `<script setup lang="ts">`, `defineProps` d'après `Avatar.d.ts` : `src`, `alt` (`""`), `initials`, `size` (`md`), `ring` (`false`).
  - [ ] Si `src` → image (préférer `<nuxt-img>` plutôt que `<img>` — règle images projet) ; sinon initiales (fallback `"?"`).
  - [ ] Tailles `sm` 32 / `md` 44 / `lg` 64 / `xl` 96 ; `ring` → anneau accent.
- [ ] Tâche 4 — Style `ZAvatar` via tokens (AC: #1)
  - [ ] `inline-flex center; border-radius var(--radius-circle); overflow hidden; background var(--surface-3); color var(--text-strong); font-family var(--font-mono); font-weight var(--fw-bold); border 1px solid var(--border-default);`
  - [ ] Taille via `--_sz` ; police initiales `calc(var(--_sz) * 0.4)` ; `ring` → `box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--accent);`
- [ ] Tâche 5 — Vérification (AC: #1)
  - [ ] `yarn dev` : poser `ZInput` (input + textarea + error + icon) et `ZAvatar` (image + initiales + ring, 4 tailles) de test.
  - [ ] `yarn lint` (eslint + stylelint) vert ; `yarn generate` reste vert.

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

### Debug Log References

### Completion Notes List

### File List

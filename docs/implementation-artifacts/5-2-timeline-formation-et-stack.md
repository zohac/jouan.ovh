# Story 5.2: Timeline, formation et stack

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want voir l'expérience, la formation et la stack technique,
so that j'évalue les compétences de Simon (UX-DR14, FR7).

## Acceptance Criteria

**Given** le contenu CV de `data.js`
**When** on implémente la timeline d'expérience, la formation et la stack sur `/about`
**Then** les trois sections rendent conformément à la référence
**And** la stack utilise des `ZTag`/`ZBadge`

## Tasks / Subtasks

- [ ] Tâche 1 — Ajouter la section CV sous le hero portrait/bio (AC)
  - [ ] Dans `pages/about.vue` (déjà refondu en story 5.1), ajouter une `<section class="section section--sunken">` + `<div class="container">` conforme à `About.jsx`.
  - [ ] Grille 2 colonnes (gauche ≈ `1.4fr` expériences, droite ≈ `0.6fr` formation), `gap: var(--space-12)`.
- [ ] Tâche 2 — Timeline d'expérience (AC)
  - [ ] Eyebrow `// expériences`.
  - [ ] Boucler sur `S.experiences` (3 entrées) et rendre, par item : date, rôle, organisation, description (classes `tl` / `tl__item` / `tl__date` / `tl__role` / `tl__org` / `tl__desc`).
  - [ ] Contenu exact depuis `data.js` (voir Dev Notes), dans l'ordre de la référence.
- [ ] Tâche 3 — Formation (AC)
  - [ ] Eyebrow `// formation`.
  - [ ] Boucler sur `S.degrees` (2 entrées) et rendre chaque diplôme dans une carte (`ZCard` padded) : date, intitulé (mono, `--text-strong`), école.
- [ ] Tâche 4 — Stack (AC + AND `ZTag`/`ZBadge`)
  - [ ] Eyebrow `// stack`.
  - [ ] Boucler sur `S.skills` (12 technos) et rendre chaque techno en **`ZTag`** (radius pill) — ou `ZBadge` selon la primitive disponible de l'Epic 2.
  - [ ] Selon le découpage retenu en story 5.1, le bloc `// stack` est soit dans la colonne droite du hero (comme `About.jsx`), soit dans la section CV ; le placer une seule fois, conforme à la référence (dans `About.jsx` il est sous la bio, colonne droite du hero).
- [ ] Tâche 5 — Style via tokens (AC)
  - [ ] Styles en `<style lang="scss" scoped>` consommant les tokens du DS, `@use` jamais `@import`.
  - [ ] Aucune valeur de couleur/espace/rayon hardcodée (`--space-*`, `--fs-*`, `--text-*`, `--font-mono`, surface sunken via token).
- [ ] Tâche 6 — Vérification
  - [ ] `yarn dev` : `/about` affiche les trois sections (timeline, formation, stack) sous le portrait/bio.
  - [ ] La stack rend bien en `ZTag`/`ZBadge` (pill).
  - [ ] Compatibilité prerender (aucun accès DOM non gardé) ; `yarn lint` ne régresse pas.

## Dev Notes

### Périmètre

- **Cette story complète `/about`** avec timeline d'expérience + formation + stack. Elle **s'appuie sur la story 5.1** (portrait + bio) qui a refondu `pages/about.vue` en `<script setup lang="ts">` et copié le portrait. Ne pas refaire le hero ici ; ajouter la/les section(s) manquante(s).

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** : `About.jsx` est React + CSS vars ; recréer en Vue 3 `<script setup>` + SCSS `@use`. [Source: docs/project-context.md#Port du design system]
- **Tokens, pas de valeurs en dur** : couleurs/espaces/rayons via tokens DS. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** (site statique) : tout accès DOM gardé. [Source: docs/project-context.md#Nuxt]
- **SCSS** : `<style lang="scss" scoped>`, système `@use ... as _alias` uniquement. [Source: docs/project-context.md#SCSS (règle critique)]

### Fichiers à modifier

- **`pages/about.vue`** (UPDATE) — ajouter la `<section class="section section--sunken">` (expériences + formation) et le bloc `// stack`, à la suite du hero portrait/bio livré en 5.1. [Source: pages/about.vue ; docs/design_system/ui_kits/jouan-site/About.jsx]

### Dépendances (Epic 2)

- **`ZTag.vue`** (story 2.5, UX-DR5, radius pill) — primitive cible pour la stack (chaque techno = un tag). [Source: epics.md#Story 2.5]
- **`ZBadge.vue`** (story 2.5, UX-DR4) — alternative/complément selon la primitive disponible ; l'AC exige `ZTag`/`ZBadge` pour la stack.
- **`ZCard.vue`** (story 2.4, UX-DR3) — pour les cartes de formation (`padded`).
- **Tokens** (story 2.1) + **polices Ubuntu** (story 2.2) : dates/intitulés/labels en Ubuntu Mono.
- **Layout global** (story 2.8) : la page s'insère dans `layouts/default.vue`.
- Ces dépendances pointent vers l'**Epic 2** (autorisé). Aucune dépendance vers des stories futures.

### Mapping About.jsx → Vue (sections concernées par cette story)

- `<section className="section section--sunken">` → `<section class="section section--sunken">` + `<div class="container">`.
- `grid-2` avec `gridTemplateColumns: "1.4fr 0.6fr"`, `gap: var(--space-12)`.
- **Expériences** (`S.experiences.map`) :
  - `<p className="eyebrow">// expériences</p>`.
  - `<div className="tl">` puis, par item : `tl__item` > `tl__date` / `tl__role` / `tl__org` / `tl__desc`.
- **Formation** (`S.degrees.map`) :
  - `<p className="eyebrow">// formation</p>`.
  - Colonne en `flex column`, `gap: var(--space-5)` ; chaque `<Card padded>` → `<ZCard padded>` : `tl__date` + intitulé (mono, `--text-strong`) + `tl__org` (école).
- **Stack** (`S.skills.map`) — dans `About.jsx` ce bloc est sous la bio (colonne droite du hero) :
  - `<p className="eyebrow eyebrow--muted">// stack</p>`.
  - `<div className="hero__tags">{S.skills.map(t => <Tag>{t}</Tag>)}</div>` → `<ZTag v-for=...>` (radius pill).

### Contenu (data.js — exact, dans l'ordre)

- **experiences** : [Source: docs/design_system/ui_kits/jouan-site/data.js]
  - `02/2021 — aujourd'hui` · **Testeur QA** · Linkizz · « Tests automatisés — Node.js, TypeScript, TestCafé. »
  - `05/2020 — 12/2021` · **Développeur Full Stack** · CINS · « PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker. »
  - `07/2007 — 05/2019` · **Métrologue** · A+ Métrologie / Trescal · « Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme. »
- **degrees** :
  - `2017 — 2018` · « Développeur d'application — PHP / Symfony » · OpenClassrooms
  - `1999 — 2001` · « BTS CIRA » · Lycée A. de Tocqueville, Cherbourg
- **skills** (12, ordre conservé) : `php`, `symfony`, `wordpress`, `node.js`, `nest.js`, `nuxt.js`, `vue`, `typescript`, `docker`, `tailwind`, `n8n`, `mysql`.

### Pièges / régressions à éviter

- Ne pas dupliquer le bloc `// stack` (s'il a déjà été esquissé en 5.1, le finaliser ici en `ZTag`/`ZBadge`, sans le rendre deux fois).
- Ne pas hardcoder couleurs/espaces ; mapper sur tokens (`--space-12`, `--space-5`, `--fs-sm`, `--text-strong`, `--text-muted`, `--font-mono`, surface `section--sunken` via token de fond).
- Respecter l'ordre des entrées CV de `data.js` (de la plus récente à la plus ancienne pour les expériences).
- Prerender : pas d'accès DOM non gardé (contenu statique, `v-for` sur tableaux locaux).
- Ne pas réintroduire de composant legacy / Options API.
- Ne pas casser le `CNAME` ni la chaîne de déploiement.

### Project Structure Notes

- Page sous `pages/about.vue` (structure racine conservée, cf. story 1.1 `srcDir: '.'`).
- Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` affiche les trois sections sur `/about`** (timeline, formation, stack en `ZTag`/`ZBadge`) + compatibilité `yarn generate` (prerender). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 5: Page À-propos — Story 5.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-7), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md#/about]
- [Source: docs/design_system/ui_kits/jouan-site/About.jsx — sections expériences / formation / stack]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — experiences, degrees, skills]
- [Source: docs/project-context.md#Port du design system, #Nuxt, #SCSS (règle critique), #Langue, #Tests]
- [Source: pages/about.vue — page à compléter (après story 5.1)]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

---
baseline_commit: 1c7bbd5e58541cc5083936dc59307cb086bdc972
---

# Story 4.2: Section process

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want voir les étapes du process,
so that je sais comment se déroule une collaboration (UX-DR13, FR6).

## Acceptance Criteria

1. **Given** les étapes du process dans `Services.jsx`/`data.js`, **When** on implémente la section process sur `/services`, **Then** les étapes rendent dans l'ordre conformément à la référence.

> Périmètre : **ajout de la 2e section (« process ») à la page `/services` déjà créée en story 4.1** : les 4 étapes ordonnées (01→04) + le CTA final « Demander un devis ». Cette story **dépend de la story 4.1** (la route `pages/services.vue` et sa 1re section doivent exister). Ne pas recréer la page ni la grille d'offres.

## Tasks / Subtasks

- [x] Tâche 1 — Ajouter la section process à `pages/services.vue` (AC: #1)
  - [x] Sous la 1re `<section>` (offres, story 4.1), ajouter une 2e `<section class="section section--sunken">` avec un `.container`
  - [x] Eyebrow `// comment ça se passe` + titre h2 « Un déroulé simple en quatre temps » (repris de `Services.jsx`)
- [x] Tâche 2 — Modéliser et rendre les 4 étapes ordonnées (AC: #1)
  - [x] Déclarer dans le `<script setup>` les 4 étapes ordonnées : numéro `01`–`04`, titre, description (texte repris à l'identique de `Services.jsx`)
  - [x] Rendre une grille de 4 colonnes (`grid-template-columns: repeat(4, 1fr)`) ; chaque étape = numéro (mono, `var(--accent)`, `fs-3xl`, `fw-light`) → titre `h3` → `p.prose` description
  - [x] Garantir l'ordre d'affichage 01 → 02 → 03 → 04 (le tableau préserve l'ordre)
- [x] Tâche 3 — CTA final (AC: #1)
  - [x] Bouton `ZButton` (primary, size lg, icône `arrow` à droite) « Demander un devis » centré, menant vers `/contact`
- [x] Tâche 4 — Responsive & vérification (AC: #1)
  - [x] Vérifier le passage en 1 colonne sur mobile (la grille process suit le comportement responsive du DS)
  - [x] `pnpm lint` (eslint + stylelint) sans nouvelle erreur ; `pnpm dev` affiche les 4 étapes ordonnées + le CTA ; `pnpm generate` prerender `/services` sans erreur — via Docker

### Review Findings

_Revue de code 2026-06-22 (baseline `1c7bbd5` = HEAD ; travail 4.2 non committé, revu depuis le working tree). Blind Hunter, Edge Case Hunter, Acceptance Auditor. AC #1 vérifié conforme (4 étapes dans l'ordre 01→04, fidèles à `Services.jsx`), scope respecté (section offres 4.1 et nav 2.8 intactes), hiérarchie h1→h2→h2→h3 sans saut, tokens-only, responsive 4→1 col, `ZButton`/`ZIcon` réutilisés. 1 decision-needed (a11y, non bloquant), 0 patch, 0 defer, 16 dismissed._

- [x] [Review][Decision → résolu : accepté, `<ol>` différé à Epic 9] Séquence ordonnée du process en `<div>` plutôt qu'`<ol>` (sémantique a11y) — Les 4 étapes (01→04) sont rendues en grille de `<div class="process__step">` avec le numéro en `<div class="process__num">`, pas en `<ol>`/`<li>`. **Fidèle à `Services.jsx`** (qui utilise aussi des `<div>`) et **l'ordre est déjà communiqué** aux lecteurs d'écran (les numéros « 01 »…« 04 » sont annoncés dans le flux) → ce n'est **pas un défaut bloquant**, l'AC #1 (ordre) est satisfait. Amélioration sémantique possible : passer en `<ol>` + numéros `aria-hidden` (l'ordre serait porté par la liste). Décider : (a) accepter / différer à Epic 9 (passage a11y) — fidèle à la réf. et ordre déjà accessible ; (b) appliquer `<ol>` maintenant. [blind+auditor]

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Dépendance story 4.1** : cette section s'ajoute au `pages/services.vue` créé en 4.1. Ne pas dupliquer l'en-tête ni la grille d'offres. [Source: docs/planning-artifacts/epics.md#Epic 4]
- **Port, pas copie** : recréation Vue 3 `<script setup>` + SCSS `@use`, jamais copier le `.jsx`. [Source: docs/project-context.md#Port du design system]
- **Réutiliser la primitive `ZButton`** (story 2.3) pour le CTA — ne pas réimplémenter. L'icône `arrow` passe par le système d'icônes (story 2.7, `currentColor`). [Source: docs/specs/spec-design-system-revamp/primitives.md ; epics.md#Epic 2]
- **Tokens, pas de valeurs en dur** : numéro d'étape coloré via `var(--accent)`, espacements via `var(--space-*)`, tailles via `var(--fs-*)`. [Source: docs/project-context.md#SCSS]
- **Langue & voix** : français, vouvoiement, pas d'emoji ; le contenu des étapes est déjà français dans `Services.jsx`. [Source: SPEC.md#Constraints]
- **Compatibilité prerender** : section statique, pas d'accès DOM. [Source: docs/project-context.md#Nuxt]

### Fichiers à modifier

- **`pages/services.vue`** (UPDATE) — ajouter la 2e `<section class="section section--sunken">` (process + CTA) sous la section d'offres existante (créée en 4.1).

### Contenu source — les 4 étapes (depuis Services.jsx)

Les étapes sont définies en dur dans `Services.jsx` (tableau `steps`), pas dans `data.js` :

1. `01` — **Échange** — « On cadre le besoin, le périmètre et le budget — sans jargon inutile. »
2. `02` — **Conception** — « Architecture, maquette, et plan de livraison clair. »
3. `03` — **Développement** — « Code propre, testé, livré par itérations visibles. »
4. `04` — **Livraison & suivi** — « Mise en ligne, documentation, et accompagnement. »

[Source: docs/design_system/ui_kits/jouan-site/Services.jsx L5-10]

### Mapping depuis Services.jsx (référence visuelle)

- Conteneur : `<section className="section section--sunken">` (fond `--bg-sunken`, bordure haute `--border-subtle`) > `.container`. [Source: Services.jsx L45-46 ; kit.css L28]
- En-tête : `p.eyebrow` « // comment ça se passe » + `h2` (`fs-3xl`) « Un déroulé simple en quatre temps ». [Source: Services.jsx L47-48]
- Grille étapes : `grid-template-columns: repeat(4, 1fr)`, gap `--space-5`. Chaque étape : numéro `fontFamily: var(--font-mono)`, `fs-3xl`, `color: var(--accent)`, `fw-light` → `h3` (`fs-lg`) → `p.prose` (`fs-sm`, `--text-muted`). [Source: Services.jsx L49-56]
- CTA : `Button variant="primary" size="lg" iconRight={arrow}` « Demander un devis » → `contact`, centré (`textAlign: center`, `margin-top: var(--space-12)`). [Source: Services.jsx L58-60]
- Classes DS de `kit.css` : `.section--sunken`, `.container`, `.eyebrow`, `.grid-2` (surchargée ici en 4 colonnes), `.prose`. À porter via tokens. [Source: kit.css L18-28, L112, L186-187]
- Icône `arrow` définie dans `icons.jsx`. [Source: docs/design_system/ui_kits/jouan-site/icons.jsx]

### Pièges / régressions à éviter

- Ne pas réimplémenter `ZButton` : le consommer (dépendance Epic 2).
- Ne pas hardcoder couleurs/espaces — tokens uniquement (`var(--accent)`, `var(--space-*)`, `var(--fs-*)`). [Source: SPEC.md#Constraints]
- Préserver l'**ordre** 01→04 (AC #1) ; ne pas trier ni réordonner.
- Ne pas toucher à la section offres (story 4.1) ni au châssis nav (story 2.8).
- Le CTA pointe vers `/contact` (route Epic 7) ; lien simple, pas de dépendance bloquante.
- Responsive : la grille 4 colonnes doit dégrader proprement (1 colonne en mobile, cf. `kit.css` `@media`).

### Project Structure Notes

- Pas de nouveau fichier de page : modification de `pages/services.vue` (existant après 4.1).
- Aucune base de données / entité. Les étapes sont un petit tableau statique local au composant (porté depuis `Services.jsx`).

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + **`yarn dev`** (les 4 étapes s'affichent dans l'ordre + le CTA « Demander un devis ») + **`yarn generate`** (`/services` prerender sans erreur). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 4: Page Services — Story 4.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-6), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md — `/services` (section « étapes du process »)]
- [Source: docs/project-context.md#Règles Langage & Framework, #Port du design system]
- [Source: docs/design_system/ui_kits/jouan-site/Services.jsx — section process + CTA]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.section--sunken`, grille étapes]
- [Source: docs/design_system/ui_kits/jouan-site/icons.jsx — `arrow`]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context) — workflow bmad-dev-story.

### Debug Log References

- `pnpm lint` (eslint + stylelint) via Docker — vert.
- `pnpm typecheck` (nuxi typecheck / vue-tsc) via Docker — vert.
- `pnpm generate` via Docker — `/services` prerendé sans erreur (24 routes).
- HTML généré vérifié : hiérarchie `h1 → h2 → h3` sans saut, étapes dans l'ordre `01 → 02 → 03 → 04`, CTA « Demander un devis » présent une fois.
- Vérif visuelle Chrome DevTools MCP (desktop 1280px + mobile 390px) : section process fidèle à `Services.jsx` (fond sunken, numéros accent, CTA centré), grille 4 colonnes → 1 colonne sous 900px.

### Completion Notes List

- Ajout de la 2e `<section class="section section--sunken">` au `pages/services.vue` existant (story 4.1), sous la section offres — aucune modification de l'en-tête ni de la grille d'offres.
- En-tête de section : eyebrow `// comment ça se passe` + `<h2 class="process__title">` « Un déroulé simple en quatre temps ». L'`h2` s'insère proprement dans la hiérarchie post-4.1 (offres déjà en `<h2>`), les étapes en `<h3>` → ordre `h1 → h2 → h3` sans saut (cohérent avec le correctif a11y de 4.1).
- 4 étapes modélisées en tableau statique local `steps` dans le `<script setup>` (texte repris à l'identique de `Services.jsx`, pas dans `data.js`). L'ordre du tableau garantit l'affichage `01 → 04` (AC #1) ; `n` sert de clé v-for stable.
- Grille `repeat(4, 1fr)` (gap `--space-5`) : par étape, numéro mono `fs-3xl`/`fw-light`/`var(--accent)` → `h3` `fs-lg` → `p.prose` `fs-sm`/`text-muted`. Tout en tokens, aucune valeur en dur.
- CTA final « Demander un devis » via la primitive `ZButton` (primary, `size="lg"`, icône `arrow` à droite via slot `#iconRight` + `ZIcon`), centré (`text-align: center`, `margin-top: var(--space-12)`), `:as="NuxtLink"` vers `/contact` (route Epic 7, lien non bloquant). Aucune primitive réimplémentée.
- Responsive : la grille process passe en 1 colonne sous 900px (même breakpoint que `.grid-3`), vérifié à l'écran.

### File List

- `app/pages/services.vue` (MODIFIED — ajout de la section process : en-tête, grille des 4 étapes ordonnées, CTA ; styles `.section--sunken` + `.process*`)
- `docs/implementation-artifacts/4-2-section-process.md` (MODIFIED — frontmatter baseline, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED — statut story 4.2 : ready-for-dev → in-progress → review)

## Change Log

- 2026-06-22 — Implémentation story 4.2 : section process sur `/services` (4 étapes ordonnées 01→04 + CTA « Demander un devis »), portée de `Services.jsx` en Vue 3 `<script setup>` + SCSS token-only, réutilisant `ZButton`/`ZIcon`. Validé lint + typecheck + generate (Docker) et vérif visuelle Chrome DevTools. Statut → review.
- 2026-06-22 — Revue de code : revue propre (AC conforme, scope respecté, hiérarchie sans saut, tokens-only). Seul point = sémantique `<ol>` des étapes (non bloquant, ordre déjà accessible) → **accepté, différé à Epic 9** (décision Simon). `pnpm lint` (0/0) + `pnpm typecheck` revérifiés verts via Docker. Statut → done.

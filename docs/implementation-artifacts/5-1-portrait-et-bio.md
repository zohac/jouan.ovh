---
baseline_commit: f42ef6d300a45d0155618814c6a976eebb0f20bd
---

# Story 5.1: Portrait et bio

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want voir le portrait et la bio de Simon,
so that je connais la personne derrière le travail (UX-DR14, FR7).

## Acceptance Criteria

**Given** la référence `About.jsx`, le portrait et le contenu `data.js`
**When** on refond `/about` avec portrait + bio
**Then** la section rend conformément à la référence, en français 1re personne

## Tasks / Subtasks

- [x] Tâche 1 — Préparer l'asset portrait (AC)
  - [x] Copier `docs/design_system/assets/brand/portrait.jpeg` vers `public/images/portrait.jpeg` (assets statiques servis par `@nuxt/image` → cible `public/images/`, cf. project-context).
  - [x] Vérifier que l'image est bien servie en dev (`/images/portrait.jpeg`).
- [x] Tâche 2 — Refondre la page `pages/about.vue` (AC)
  - [x] Remplacer l'implémentation legacy actuelle (`MainComponent` + `ZCard*` Options API) par un nouveau composant en `<script setup lang="ts">`.
  - [x] Construire la section « hero À-propos » en grille 2 colonnes (gauche ≈ `0.8fr` portrait + identité, droite ≈ `1.2fr` bio), conforme à `About.jsx` (`<section class="section">` + `<div class="container">` + `grid-2`).
  - [x] Colonne gauche : portrait via `<nuxt-img>` (radius pill / `ZAvatar` une fois disponible — voir Dev Notes), nom (`Simon Jouan`), rôle en mono accent (`Développeur web freelance`), localisation (`Valognes, France`) avec icône pin, et deux CTA (« Me contacter » → `/contact`, « CV » → `mailto:`).
  - [x] Colonne droite : eyebrow `// à propos`, bio en `.prose` (deux paragraphes, voir contenu en Dev Notes), avec les emphases `<strong>` sur les technologies.
- [x] Tâche 3 — Contenu & voix FR (AC)
  - [x] Reprendre la bio depuis `About.jsx` (texte 1re personne « je » déjà rédigé) ; libellés depuis `data.js` (`name`, `role`, `city`, `email`).
  - [x] Aucun emoji ; vouvoiement ; lien `keova.app` en `target="_blank" rel="noreferrer"`.
- [x] Tâche 4 — Style via tokens (AC)
  - [x] Styles en `<style lang="scss" scoped>` consommant les tokens du DS (Epic 2), `@use` jamais `@import`.
  - [x] Aucune valeur de couleur/espace/rayon hardcodée (mapper sur `--fs-*`, `--space-*`, `--accent`, `--text-muted`, `--text-strong`, etc.).
- [x] Tâche 5 — Vérification
  - [x] `yarn dev` : `/about` se charge sans erreur, le portrait s'affiche, la bio est lisible.
  - [x] Compatibilité prerender : aucun accès `window`/`document` hors garde ; `yarn lint` ne régresse pas.
  - [x] Réserver l'espace pour les sections timeline/formation/stack ajoutées par la story 5.2 (ne pas les implémenter ici).

## Dev Notes

### Périmètre

- **Cette story = portrait + bio uniquement** (haut de page `/about`). La timeline d'expérience, la formation et la stack (`ZTag`/`ZBadge`) sont la **story 5.2** — ne pas les traiter ici, mais laisser la structure de page prête à les recevoir (la 5.2 ajoute une `<section class="section section--sunken">` sous le hero).

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Port, pas copie** : `About.jsx` est React + CSS vars ; recréer en Vue 3 `<script setup>` + SCSS `@use`. Ne pas copier le `.jsx` tel quel. [Source: docs/project-context.md#Port du design system]
- **Images TOUJOURS via `<nuxt-img>` / `<nuxt-picture>`**, jamais `<img>` brut ; assets statiques sous `public/images/`. [Source: docs/project-context.md#Nuxt]
- **Tokens, pas de valeurs en dur** : couleurs/espaces/rayons via tokens DS. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** (site statique) : tout accès DOM gardé (`onMounted` / `import.meta.client`). [Source: docs/project-context.md#Nuxt]
- **SCSS** : `<style lang="scss" scoped>`, système `@use ... as _alias` uniquement. [Source: docs/project-context.md#SCSS (règle critique)]

### Fichiers à modifier / créer

- **`pages/about.vue`** (REFONTE) — état actuel : page legacy en Options API qui affiche une `ZCardComponent` avec portrait « drip art » et le titre « Simon Jouan / Développeur Web FullStack & Testeur/QA / Freelance ». À remplacer par la nouvelle section portrait + bio en `<script setup lang="ts">`, fidèle à `About.jsx`. [Source: pages/about.vue]
- **`public/images/portrait.jpeg`** (CREATE) — copie de `docs/design_system/assets/brand/portrait.jpeg`.

### Dépendances (Epic 2)

- **`ZAvatar.vue`** (story 2.6, UX-DR7, radius pill, prop `ring`) : si disponible, l'utiliser pour le portrait (`<ZAvatar :src="..." :alt="..." size="xl" ring />` comme dans `About.jsx`). À défaut, encadrer un `<nuxt-img>` avec le style avatar (radius pill, anneau) en local et migrer vers `ZAvatar` ensuite.
- **`ZButton.vue`** (story 2.3, UX-DR2) : utiliser pour les CTA (`variant="primary"` → « Me contacter » ; `variant="secondary" as="a" :href="mailto:..."` → « CV »).
- **Tokens** (story 2.1) + **polices Ubuntu** (story 2.2) : la bio en Ubuntu sans, rôle/labels en Ubuntu Mono.
- **Layout global** (story 2.8) : la page s'insère dans `layouts/default.vue` (header/footer déjà refondus).
- Ces dépendances pointent vers l'**Epic 2** (autorisé). Aucune dépendance vers des stories futures.

### Mapping About.jsx → Vue (section concernée par cette story)

- `<section className="section">` → `<section class="section">` ; `<div className="container">` → idem.
- `grid-2` avec `gridTemplateColumns: "0.8fr 1.2fr"`, `alignItems: "start"`.
- Colonne gauche :
  - `<Avatar src="../../assets/brand/portrait.jpeg" alt={S.name} size="xl" ring />` → `<ZAvatar src="/images/portrait.jpeg" :alt="name" size="xl" ring />` (chemin **réécrit** vers `public/`).
  - `<h1>{S.name}</h1>` → « Simon Jouan » (`--fs-3xl`).
  - `<p>{S.role}</p>` en `--font-mono` + `--accent` → « Développeur web freelance ».
  - `<p className="prose">… {S.city}</p>` avec icône pin → « Valognes, France ».
  - Deux `<Button>` : `variant="primary"` (« Me contacter ») et `variant="secondary" as="a" href={"mailto:"+S.email}` (« CV »).
- Colonne droite :
  - `<p className="eyebrow">// à propos</p>`.
  - Deux paragraphes `.prose` (`--fs-md`) — **contenu exact** :
    > Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de basculer dans le code. Aujourd'hui je conçois des applications en **PHP/Symfony**, des sites **WordPress** sur-mesure, et des produits en **Node.js / Nest.js / Nuxt.js**.
    >
    > Je suis aussi fondateur du SaaS [keova.app](https://keova.app), et j'aime mettre l'IA au service du code — agents, automatisations, intégrations LLM.
  - Les `<strong>` portent `color: var(--text-strong)`.
- **Ne pas implémenter ici** le `// stack` (`S.skills.map(...)`) ni les sections expériences/formation : ce sont la story 5.2.

### Contenu (data.js — pour cette story)

- `name: "Simon Jouan"`, `role: "Développeur web freelance"`, `city: "Valognes, France"`, `email: "simon@jouan.ovh"`. [Source: docs/design_system/ui_kits/jouan-site/data.js]
- Bio : texte 1re personne déjà rédigé dans `About.jsx` (voir mapping ci-dessus).

### Pièges / régressions à éviter

- Chemin portrait : `About.jsx` référence `../../assets/brand/portrait.jpeg` (relatif au kit). Dans le site, copier vers `public/images/portrait.jpeg` et référencer `/images/portrait.jpeg` via `<nuxt-img>`.
- Ne pas hardcoder des couleurs/tailles ; mapper sur les tokens (`--fs-3xl`, `--fs-md`, `--fs-sm`, `--space-*`, `--accent`, `--text-muted`, `--text-strong`, `--font-mono`).
- Prerender : pas d'accès DOM non gardé (la bio est statique, attention si une icône Lucide nécessite un montage client — la garder simple/SVG inline).
- Ne pas réintroduire le composant legacy `ZCardComponent` / Options API pour cette page.
- Ne pas casser le `CNAME` ni la chaîne de déploiement (validation build = passe transverse).

### Project Structure Notes

- Page sous `pages/about.vue` (structure racine conservée, cf. story 1.1 `srcDir: '.'`).
- Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev` charge `/about`** (portrait visible, bio lisible) + compatibilité `yarn generate` (prerender). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 5: Page À-propos — Story 5.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-7), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md#/about]
- [Source: docs/design_system/ui_kits/jouan-site/About.jsx — section hero portrait + bio]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — name, role, city, email]
- [Source: docs/design_system/assets/brand/portrait.jpeg — asset portrait]
- [Source: docs/project-context.md#Port du design system, #Nuxt, #SCSS (règle critique), #Langue, #Tests]
- [Source: pages/about.vue — implémentation legacy à refondre]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- `pnpm lint` (Docker) : 2 erreurs Prettier (retours à la ligne de la bio) → corrigées via `eslint --fix` → re-lint vert (exit 0).
- `pnpm typecheck` (Docker, `nuxi typecheck`) : exit 0.
- `pnpm generate` (Docker) : prerender OK — `/about` (24 ms) + `/_ipx/_/images/portrait.jpeg` générés, aucune erreur.
- Vérif visuelle Chrome DevTools MCP (desktop 1280 + mobile 375) : rendu fidèle à `About.jsx`, console propre (les `504 Outdated Optimize Dep` initiaux étaient des artefacts Vite dev, disparus au reload).

### Completion Notes List

- Refonte de `app/pages/about.vue` (chemin réel sous `srcDir = app`, pas `pages/` ; la note `srcDir: '.'` des Dev Notes était obsolète post-Epic 1) : suppression de l'implémentation legacy Options API (`MainComponent` + `ZCard*`), remplacée par un composant `<script setup lang="ts">`.
- Hero À-propos en grille 2 colonnes `0.8fr / 1.2fr` (`align-items: start`), fidèle à `About.jsx`. Colonne gauche : `<ZAvatar size="xl" ring>` (portrait), nom (`--fs-3xl` mono), rôle mono accent, localisation `<ZIcon name="pin">` + ville, deux CTA `<ZButton>` (« Me contacter » → `/contact` via `NuxtLink` ; « CV » → `as="a"` `mailto:`). Colonne droite : eyebrow `// à propos` + bio `.prose` deux paragraphes avec `<strong>` (`--text-strong`) et lien `keova.app` (`target="_blank" rel="noreferrer"`, couleur `--link`, focus-ring accessible).
- Tokens uniquement, aucune valeur en dur ; `<style scoped>`. Responsive : grille → 1 colonne sous 900px (cf. kit `.grid-2`).
- Place réservée pour la story 5.2 (commentaire explicite : `<section class="section section--sunken">` timeline/formation/stack sous le hero) — non implémentée ici, conforme au périmètre.
- Portrait copié vers `public/images/portrait.jpeg` et servi via `<NuxtImg>` (`ZAvatar`), optimisé par `@nuxt/image` (route `/_ipx/...` prerendue).

### File List

- `app/pages/about.vue` (MODIFIÉ — refonte complète Options API legacy → `<script setup lang="ts">` ; correctifs de revue : « M'écrire », `initials`, meta 1ʳᵉ pers., OG/Twitter/canonical, focus-ring `forced-colors`, primitives de layout retirées)
- `public/images/portrait.jpeg` (CRÉÉ — copie de `docs/design_system/assets/brand/portrait.jpeg`)
- `app/assets/scss/base/_layout.scss` (CRÉÉ — primitives de layout DS globales `.section`/`.section--sunken`/`.container`/`.eyebrow`/`.prose`)
- `app/assets/scss/main.scss` (MODIFIÉ — `@use "base/layout"`)
- `app/pages/index.vue` (MODIFIÉ — primitives de layout dupliquées retirées au profit du partiel global)
- `app/pages/services.vue` (MODIFIÉ — idem)
- `docs/implementation-artifacts/5-1-portrait-et-bio.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches cochées, Dev Agent Record, findings de revue, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                 |
| ---------- | ------- | --------------------------------------------------------------------------- |
| 2026-06-23 | 0.1     | Implémentation story 5.1 — refonte `/about` (hero portrait + bio) sur le DS |
| 2026-06-23 | 0.2     | Correctifs de revue — 6 findings résolus (3 patchs + 3 deferred traités, zéro dette) : « M'écrire », `initials`, meta 1ʳᵉ pers., OG/Twitter/canonical, focus-ring `forced-colors`, extraction des primitives de layout dans un partiel global |

## Review Findings

_Code review (bmad-code-review) — 2026-06-23. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet) · Acceptance Auditor (diff + SPEC/ticket). Verdict Auditor : aucune violation d'AC ni de contrainte dure — port très fidèle à `About.jsx`._

- [x] [Review][Patch] Relibeller le bouton « CV » → « M'écrire » (conserver le `mailto:`) — décision Simon : relibeller pour lever l'ambiguïté UX, pas de CV PDF (était `decision-needed`). [app/pages/about.vue:21] — ✅ résolu : libellé « M'écrire », `mailto:` conservé.
- [x] [Review][Patch] Réécrire la meta description en 1ʳᵉ personne cohérente (corriger la voix mixte 3ᵉ/1ʳᵉ), description conservée — décision Simon : harmoniser la voix (était `decision-needed`). [app/pages/about.vue:62-71] — ✅ résolu : description 100 % 1ʳᵉ personne (« je conçois… voici mon parcours »).
- [x] [Review][Patch] `ZAvatar` sans prop `initials` → le repli affiche « ? » si le portrait échoue au chargement ; ajouter `initials="SJ"` pour un fallback gracieux (l'image existe et est prérendue, donc défensif/faible) [app/pages/about.vue:12] — ✅ résolu : `initials="SJ"`.
- [x] [Review][Defer→Fixed] Primitives de layout `.section`/`.container`/`.prose`/`.eyebrow` redéclarées en `<style scoped>` dans chaque page (`index.vue`, `services.vue`, `about.vue`) au lieu d'un partiel partagé. — ✅ résolu (décision Simon : zéro dette) : extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications supprimées des 3 pages. Vérif visuelle desktop des 3 pages : aucune régression.
- [x] [Review][Defer→Fixed] Anneau de focus du lien bio en `box-shadow: var(--ring-accent)` + `outline: none`, sans repli → disparaît en `forced-colors` (High Contrast). — ✅ résolu localement : `outline: 2px solid transparent` + `outline-offset` (rendu en couleur système en `forced-colors`). NB : le pattern DS-wide identique (ZButton/ZInput) reste tracé pour l'Epic 9 — hors diff 5.1.
- [x] [Review][Defer→Fixed] Aucune balise Open Graph / Twitter / canonical pour le partage social. — ✅ résolu (décision Simon : zéro dette) : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` d'`about.vue` (domaine `dev.jouan.ovh` cf. CNAME) ; vérifiés dans le HTML prérendu, `description` dédoublonnée par unhead.

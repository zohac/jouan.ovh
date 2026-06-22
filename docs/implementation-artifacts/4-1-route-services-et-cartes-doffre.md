---
baseline_commit: e5fff1ad4dbf9a611952e4801b6003c80629934c
---

# Story 4.1: Route /services et cartes d'offre

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want une page Services avec les trois offres,
so that je comprends ce que Simon propose (UX-DR13, FR6).

## Acceptance Criteria

1. **Given** la référence `Services.jsx` et le contenu `data.js`, **When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA), **Then** les 3 offres rendent conformément à la référence.
2. **Given** la nouvelle route `/services`, **When** le visiteur navigue depuis le châssis global, **Then** la route est accessible depuis la nav.

> Périmètre : **création de la route `/services` + section d'en-tête (eyebrow, titre, prose) + grille des 3 cartes d'offre** uniquement. La **section process** (étapes ordonnées + CTA « Demander un devis ») est la story **4.2** — ne pas l'implémenter ici, mais laisser la page prête à l'accueillir (un `<main>` avec la première `<section>`). Le lien de navigation vers `/services` est ajouté dans le châssis (story **2.8**) ; cette story vérifie seulement qu'il pointe sur la route créée.

## Tasks / Subtasks

- [x] Tâche 1 — Créer la route `pages/services.vue` (AC: #1)
  - [x] Créer le fichier `pages/services.vue` (`<script setup lang="ts">`, dark-first)
  - [x] Structurer le `<template>` avec `<main>` puis une première `<section class="section">` contenant un `.container`
  - [x] Ajouter l'eyebrow `// services`, le titre h1 (« Des prestations claires, pensées comme des produits. ») et la prose d'intro (« Du site WordPress à l'application sur-mesure… »), repris à l'identique de `Services.jsx`
  - [x] Définir le `<title>`/meta de page via `useHead`/`definePageMeta` (français, cohérent avec `app.head`)
- [x] Tâche 2 — Modéliser le contenu des 3 offres depuis `data.js` (AC: #1)
  - [x] Reprendre les 3 entrées `services` de `data.js` (WordPress sur-mesure / Applications web / IA & automatisation) : `icon`, `title`, `desc`, `points[]`, `price`, `featured`
  - [x] Déclarer ce contenu dans le `<script setup>` (tableau typé) ; l'offre « Applications web » est `featured: true`
- [x] Tâche 3 — Rendre la grille des 3 cartes d'offre (AC: #1)
  - [x] Boucler sur les offres dans une `.grid-3` ; chaque offre = primitive `ZCard` (réutilisée de l'Epic 2), variante accent/featured pour la carte mise en avant
  - [x] Carte featured : afficher un `ZBadge` (tone accent) « Le plus demandé » en tête
  - [x] Afficher l'icône d'offre (`wp` / `code` / `spark`) via le système d'icônes de la story 2.7, le titre `h3`, la description, la liste de `points` (puces `→` via la classe `.offer li`), le prix (`.offer__price` + `<b>`)
  - [x] Bouton « Discuter du projet » (`ZButton`, primary pour featured / secondary sinon) en pleine largeur, menant vers `/contact`
- [x] Tâche 4 — Vérifier la navigation (AC: #2)
  - [x] Confirmer que le lien de nav `/services` (ajouté en story 2.8) résout bien vers cette page
  - [x] Vérifier le rendu responsive : `.grid-3` passe en 1 colonne sur mobile (déjà prévu par le DS)
- [x] Tâche 5 — Vérification (AC: #1, #2)
  - [x] `pnpm lint` (eslint + stylelint) sans nouvelle erreur — via Docker
  - [x] `pnpm dev` : `/services` se charge, affiche les 3 cartes ; `pnpm generate` prerender la route sans erreur — via Docker

### Review Findings

_Revue de code 2026-06-22 (baseline `e5fff1a` = HEAD ; travail 4.1 non committé, revu depuis le working tree). Blind Hunter, Edge Case Hunter, Acceptance Auditor. AC #1 & #2 vérifiés conformes (contenu exact depuis `data.js`, route auto, primitives Epic 2 réutilisées, scope process 4.2 non débordé). 1 decision-needed, 1 patch, 0 defer, 16 dismissed._

- [x] [Review][Patch] (ex-Decision — résolu : promouvoir les cartes en `<h2>`) Saut de hiérarchie de titres `h1 → h3` (pas de `h2`) sur `/services` — La 1re section passe du `<h1 class="services__title">` directement aux `<h3 class="offer__title">` des cartes, sans `<h2>`. Fidèle à `Services.jsx` mais incohérent avec la Home (`index.vue` met un `<h2>` avant la même grille) → saut de niveau (WCAG 1.3.1). **Fix retenu (décision Simon)** : passer les titres d'offre de `<h3>` à `<h2>` dans `app/pages/services.vue` (le style est porté par la classe `.offer__title`, donc visuel inchangé) → ordre correct h1 → h2. [blind+auditor] — ✅ Résolu : titres d'offre en `<h2 class="offer__title">` ; HTML généré vérifié (h1 → h2, sans saut), rendu visuel inchangé.
- [x] [Review][Patch] CTA « Discuter du projet » identique ×3 sans libellé distinct (a11y) [app/pages/services.vue — `ZButton` de carte] — Les 3 cartes rendent le même bouton-lien « Discuter du projet » → `/contact` ; navigation par liste de liens d'un lecteur d'écran = 3 cibles indistinctes (même problème que les « En savoir plus » corrigés en story 3.2). Fix : `aria-label` par offre (ex. « Discuter du projet — Applications web »), cohérent avec le correctif 3.2. [blind] — ✅ Résolu : `:aria-label="`Discuter du projet — ${offer.title}`"` sur chaque `ZButton` ; les 3 libellés distincts vérifiés dans le HTML généré.

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Route à créer** : `pages/services.vue` (auto-route Nuxt `/services`). La route n'existe pas aujourd'hui (`pages/` ne contient que `index.vue`, `about.vue`, `blog/`). [Source: docs/specs/spec-design-system-revamp/pages.md]
- **Port, pas copie** : ne pas copier `Services.jsx` tel quel ; recréer en Vue 3 `<script setup>` + SCSS `@use`. [Source: docs/project-context.md#Port du design system]
- **Réutiliser les primitives de l'Epic 2** : `ZCard` (story 2.4), `ZBadge` (story 2.5), `ZButton` (story 2.3) — ne pas réimplémenter ces composants ici. [Source: docs/specs/spec-design-system-revamp/primitives.md ; epics.md#Epic 2]
- **Tokens, pas de valeurs en dur** : couleurs/espaces/rayons via les tokens DS (`var(--accent)`, `var(--space-*)`, `var(--fs-*)`…), portés en story 2.1. [Source: docs/project-context.md#SCSS]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. Le contenu des offres est déjà en français dans `data.js`. [Source: SPEC.md#Constraints]
- **Compatibilité prerender** : page statique pure, pas d'accès DOM ; rien à garder ici. [Source: docs/project-context.md#Nuxt]
- **Auto-import** des composants Nuxt activé — `ZButton`/`ZCard`/`ZBadge` n'ont en principe pas besoin d'import manuel (selon les conventions de nommage/dossiers retenues en Epic 2). [Source: docs/project-context.md#Nuxt]

### Fichiers à créer / modifier

- **`pages/services.vue`** (CREATE) — page de la route `/services`. Première `<section class="section">` = en-tête + grille d'offres (cette story). La 2e section (process) viendra en 4.2.
- **(rappel) châssis nav** — le lien `/services` est ajouté en story **2.8** ; ne pas re-modifier le header ici, seulement vérifier la résolution du lien.

### Contenu source (depuis data.js)

3 offres dans `window.SITE.services` :

1. `wp` — **WordPress sur-mesure** — desc « Thèmes et plugins développés à la main… » — points : `Thème sur-mesure (press-wind / Tailwind)`, `Plugins & blocs Gutenberg`, `Performance & SEO technique` — prix `à partir de 1 500 €` — `featured: false`.
2. `code` — **Applications web** — desc « Des produits complets en Symfony, Nest.js et Nuxt.js… » — points : `API REST / GraphQL (Symfony · Nest.js)`, `Front Vue / Nuxt`, `Tests & CI/CD, qualité QA` — prix `sur devis` — `featured: true`.
3. `spark` — **IA & automatisation** — desc « L'IA au service du code… » — points : `Agents & workflows (n8n)`, `Intégration d'API LLM`, `Automatisation de contenu` — prix `sur devis` — `featured: false`.

[Source: docs/design_system/ui_kits/jouan-site/data.js — `services`]

### Mapping depuis Services.jsx (référence visuelle)

- En-tête : `p.eyebrow` « // services » → `h1` (`fs-4xl`, `fw-light`, `max-width: 16ch`) → `p.prose` (`max-width: 60ch`, `color: var(--text-muted)`). [Source: docs/design_system/ui_kits/jouan-site/Services.jsx L13-21]
- Grille : `.grid-3`, une `Card` par offre avec `accent`/`featured` sur la carte mise en avant. [Source: Services.jsx L22-41]
- Carte featured : `Badge tone="accent"` « Le plus demandé » avant l'icône. [Source: Services.jsx L27]
- Corps de carte : `.offer__icon` (icône), `h3` titre, `p` desc, `ul/li` points (puce `→` via `.offer li::before`), `.offer__price > b` prix, `Button` pleine largeur « Discuter du projet » → `contact`. [Source: Services.jsx L28-38]
- Classes DS disponibles dans `kit.css` : `.section`, `.container`, `.eyebrow`, `.prose`, `.grid-3`, `.offer`, `.offer__icon`, `.offer h3/p/ul/li`, `.offer__price`. À porter en SCSS via tokens (ne pas hardcoder). [Source: docs/design_system/ui_kits/jouan-site/kit.css L18-27, L111-129]
- Icônes `wp` / `code` / `spark` (et `arrow` pour 4.2) définies dans `icons.jsx` — passer par le système d'icônes de la story 2.7 (Lucide / SVG inline, `currentColor`). [Source: docs/design_system/ui_kits/jouan-site/icons.jsx]

### Pièges / régressions à éviter

- Ne pas réimplémenter `ZCard`/`ZButton`/`ZBadge` : les consommer (dépendance vers Epic 2). Si une primitive manque encore, c'est un blocage à remonter, pas à contourner par du markup ad hoc.
- Ne pas hardcoder couleurs/espaces (`#…`, `px` arbitraires) — utiliser les tokens (`var(--accent)`, `var(--space-*)`, `var(--fs-*)`). [Source: SPEC.md#Constraints]
- Ne pas implémenter la section process ici (c'est la story 4.2) — éviter le chevauchement.
- Le bouton « Discuter du projet » pointe vers `/contact` (route créée en Epic 7) ; un `NuxtLink`/`href` vers `/contact` suffit, pas de dépendance bloquante au formulaire.
- Respecter le responsive : `.grid-3` → 1 colonne sous le breakpoint mobile du DS.

### Project Structure Notes

- Pages dans `pages/` (auto-routing Nuxt). `pages/services.vue` crée `/services`. [Source: docs/project-context.md#Nuxt]
- Aucune base de données / entité à créer. Le contenu des offres est statique (repris de `data.js`), porté dans le composant ou un petit module de contenu local.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + **`yarn dev`** (la page `/services` se charge et affiche les 3 cartes) + **`yarn generate`** (la route prerender sans erreur). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 4: Page Services — Story 4.1]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-6), #Constraints, #Decisions]
- [Source: docs/specs/spec-design-system-revamp/pages.md — ligne `/services`]
- [Source: docs/project-context.md#Technology Stack, #Règles Langage & Framework, #Port du design system]
- [Source: docs/design_system/ui_kits/jouan-site/Services.jsx — en-tête + grille d'offres]
- [Source: docs/design_system/ui_kits/jouan-site/data.js — `services`]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css — `.section`, `.grid-3`, `.offer*`]
- [Source: docs/design_system/ui_kits/jouan-site/icons.jsx — `wp`, `code`, `spark`]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context) — workflow bmad-dev-story.

### Debug Log References

- `pnpm lint` (eslint + stylelint) via Docker — vert (un seul fix Prettier sur le `<b>` du prix, corrigé).
- `pnpm typecheck` (nuxi typecheck / vue-tsc) via Docker — vert.
- `pnpm generate` via Docker — `/services` prerendé sans erreur (24 routes générées).
- Vérif visuelle Chrome DevTools MCP (desktop 1280px + mobile 390px) : rendu fidèle à `Services.jsx`, grille → 1 colonne sous 900px, nav « Services » active.

### Completion Notes List

- Remplacement du stub `pages/services.vue` (créé en story 2.8 pour la nav/prerender) par la vraie page : `<main>` → première `<section class="section">` avec en-tête (eyebrow `// services`, h1 `fs-4xl`/`fw-light`/16ch, prose intro `fs`/60ch en `text-muted`) + grille `.grid-3` des 3 offres. Un seul `<main>` avec la 1re section : la page est prête à accueillir la section process (story 4.2) en 2e `<section>`.
- Contenu des 3 offres repris à l'identique de `data.js` (`window.SITE.services`), modélisé en tableau typé `Offer[]` dans le `<script setup>`. « Applications web » est `featured: true`.
- Cartes rendues via la primitive `ZCard` (Epic 2), `:accent` + `:featured` sur la carte mise en avant (barre accent + glow). Badge `ZBadge tone="accent"` « Le plus demandé » en tête de la featured. Icônes `wp`/`code`/`spark` via `ZIcon` (story 2.7). CTA « Discuter du projet » via `ZButton` (primary sur la featured, secondary sinon) en pleine largeur, `:as="NuxtLink"` vers `/contact` (route stub d'Epic 7, lien non bloquant). Aucune primitive réimplémentée.
- Styles `<style scoped>` token-only (aucune valeur en dur) : portage SCSS de `.section`/`.container`/`.eyebrow`/`.grid-3`/`.offer*` depuis `kit.css`. Dérogation assumée et commentée : `font-size: 22px` sur `.offer__icon` pour dimensionner le glyphe ZIcon (pas de token d'espacement à 22px) — même choix qu'en story 3.2. `.section` en `padding-block` seul (le gutter horizontal vient de `.container` via `padding-inline`), cohérent avec le piège shorthand documenté.
- Hors périmètre (story 4.2) non implémenté : section process (étapes ordonnées + CTA « Demander un devis »).
- ✅ Revue de code (2026-06-22) — 2 findings [Patch] résolus, aucune dette : (1) titres d'offre `<h3>` → `<h2>` (hiérarchie h1 → h2, classe `.offer__title` inchangée donc rendu identique) ; (2) `aria-label` distinct par CTA (« Discuter du projet — {offre} »), cohérent avec le correctif 3.2. Revalidé lint + typecheck + generate (Docker) verts ; HTML prerendu vérifié (h1→h2, 3 aria-label distincts).

### File List

- `app/pages/services.vue` (MODIFIED — stub remplacé par la page Services : en-tête + grille des 3 offres)
- `docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md` (MODIFIED — frontmatter baseline, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED — statut story 4.1 : ready-for-dev → in-progress → review)

## Change Log

- 2026-06-22 — Implémentation story 4.1 : route `/services` (en-tête + grille des 3 cartes d'offre), portée de `Services.jsx` en Vue 3 `<script setup>` + SCSS token-only, réutilisant `ZCard`/`ZBadge`/`ZButton`/`ZIcon`. Validé lint + typecheck + generate (Docker) et vérif visuelle Chrome DevTools. Statut → review.
- 2026-06-22 — Suite revue de code : 2 findings [Patch] résolus (titres d'offre `<h3>`→`<h2>` ; `aria-label` distinct par CTA). Revalidé lint + typecheck + generate (Docker) verts. Statut → review.
- 2026-06-22 — Re-revue (vérification post-fix) : 2 patchs confirmés dans le code (`<h2 class="offer__title">` → ordre h1→h2 ; `:aria-label="Discuter du projet — ${offer.title}"` ×3 distincts). `pnpm lint` (0/0) + `pnpm typecheck` revérifiés verts via Docker. Aucune régression. Statut → done. (Travail toujours non committé dans le working tree — à committer ; `docs/project-context.md` modifié reste hors périmètre 4.1.)

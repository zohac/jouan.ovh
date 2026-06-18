# Story 4.1: Route /services et cartes d'offre

Status: ready-for-dev

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

- [ ] Tâche 1 — Créer la route `pages/services.vue` (AC: #1)
  - [ ] Créer le fichier `pages/services.vue` (`<script setup lang="ts">`, dark-first)
  - [ ] Structurer le `<template>` avec `<main>` puis une première `<section class="section">` contenant un `.container`
  - [ ] Ajouter l'eyebrow `// services`, le titre h1 (« Des prestations claires, pensées comme des produits. ») et la prose d'intro (« Du site WordPress à l'application sur-mesure… »), repris à l'identique de `Services.jsx`
  - [ ] Définir le `<title>`/meta de page via `useHead`/`definePageMeta` (français, cohérent avec `app.head`)
- [ ] Tâche 2 — Modéliser le contenu des 3 offres depuis `data.js` (AC: #1)
  - [ ] Reprendre les 3 entrées `services` de `data.js` (WordPress sur-mesure / Applications web / IA & automatisation) : `icon`, `title`, `desc`, `points[]`, `price`, `featured`
  - [ ] Déclarer ce contenu dans le `<script setup>` (tableau typé) ; l'offre « Applications web » est `featured: true`
- [ ] Tâche 3 — Rendre la grille des 3 cartes d'offre (AC: #1)
  - [ ] Boucler sur les offres dans une `.grid-3` ; chaque offre = primitive `ZCard` (réutilisée de l'Epic 2), variante accent/featured pour la carte mise en avant
  - [ ] Carte featured : afficher un `ZBadge` (tone accent) « Le plus demandé » en tête
  - [ ] Afficher l'icône d'offre (`wp` / `code` / `spark`) via le système d'icônes de la story 2.7, le titre `h3`, la description, la liste de `points` (puces `→` via la classe `.offer li`), le prix (`.offer__price` + `<b>`)
  - [ ] Bouton « Discuter du projet » (`ZButton`, primary pour featured / secondary sinon) en pleine largeur, menant vers `/contact`
- [ ] Tâche 4 — Vérifier la navigation (AC: #2)
  - [ ] Confirmer que le lien de nav `/services` (ajouté en story 2.8) résout bien vers cette page
  - [ ] Vérifier le rendu responsive : `.grid-3` passe en 1 colonne sur mobile (déjà prévu par le DS)
- [ ] Tâche 5 — Vérification (AC: #1, #2)
  - [ ] `yarn lint` (eslint + stylelint) sans nouvelle erreur
  - [ ] `yarn dev` : `/services` se charge, affiche les 3 cartes ; `yarn generate` prerender la route sans erreur

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

### Debug Log References

### Completion Notes List

### File List

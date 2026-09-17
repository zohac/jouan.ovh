---
baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
---

# Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur évaluant l'offre de services sur la page d'accueil,
I want découvrir les 3 piliers d'accompagnement et les arguments prouvant la viabilité des systèmes déployés,
so that je distingue le travail industriel d'une simple démonstration de chatbot fragile (FR30, NFR13, UX-DR29).

## Acceptance Criteria

1. **Given** la section vitrine des services dans `app/pages/index.vue`
   **When** la page est rendue et inspectée
   **Then** le sur-titre affiche `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
   **And** le titre de section affiche `Trois expertises pour concevoir et faire évoluer vos systèmes`
   **And** la liste sémantique `<ul class="grid-3">` expose 3 cartes structurées `<ZCard class="offer" interactive tilt ...>` avec numérotation terminale `01 / 03`, `02 / 03`, `03 / 03` :
     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
     3. **Applications IA sur mesure** (`id: "apps"`, icône `code`, tags `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`, prix/format `Sur mesure / Sprint`)
   **And** chaque carte oriente directement vers la route Nuxt `/services` (via `<NuxtLink to="/services" ...>` et lien d'action accessible).

2. **Given** le nouveau bloc différenciateur « Prototype → Production » dans `app/pages/index.vue`
   **When** le visiteur fait défiler la page immédiatement sous la vitrine des services
   **Then** une section ou un conteneur dédié `.diff-block` (ou `.section--sunken`) expose :
     - Le sur-titre `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
     - Le titre de section `<h2>` ou `<h3>` affichant `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
     - Le texte explicatif officiel (messaging matrix 4.3) valorisant la culture Full Stack et QA : `Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification, permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine. L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile lorsqu’il rencontre la vraie vie.`
     - Les 4 piliers d'industrialisation balisés sous forme de liste sémantique `<ul class="pillars-grid">` avec cartes `<ZCard :padded="true">` :
       - **Données :** provenance, structuration, stockage, rétention, secrets. (icône `layers` ou `terminal`)
       - **Fiabilité :** cas limites, retries, fallbacks, tests, observabilité. (icône `check` ou `zap`)
       - **IA :** sorties structurées, versionnage, évaluations, contrôle humain. (icône `bot` ou `spark`)
       - **Exploitation :** monitoring, coûts, support, maintenance, évolution. (icône `terminal` ou `code`)

3. **Given** les critères d'accessibilité (a11y RGAA/WCAG), de responsive et de design tokens
   **When** la page est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
   **Then** les grilles `.grid-3` et `.pillars-grid` basculent harmonieusement de 3/4 colonnes à 1 colonne sans débordement horizontal
   **And** sous `prefers-reduced-motion: reduce`, les effets de tilt 3D sur `ZCard` et transitions dynamiques sont instantanément neutralisés
   **And** le focus clavier (`Tab`) parcourt les cartes et liens `/services` selon un ordre séquentiel et visible (`:focus-visible` avec outline 2px)
   **And** aucun emoji n'est injecté dans les templates, textes ou styles (NFR6 / NFR13)
   **And** tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).

4. **Given** l'ensemble des modifications de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et les routes statiques pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour des données et cartes de la vitrine des 3 services dans `app/pages/index.vue` (AC: 1, 3)
  - [x] Mettre à jour l'interface `HomeServiceOffer` et la constante `services` dans le `<script setup>` :
    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
    - Offre 3 : `id: "apps"`, `no: "03 / 03"`, `title: "Applications IA sur mesure"`, promesse/points, tags `["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"]`, format tarifaire `Sur mesure / Sprint`
  - [x] Mettre à jour le titre de la section : `Trois expertises pour concevoir et faire évoluer vos systèmes`
  - [x] Vérifier que tous les liens d'action pointent vers `/services` sans ancre `#`.

- [x] Tâche 2 — Intégration du bloc différenciateur « Prototype → Production » (AC: 2, 3)
  - [x] Créer la structure HTML sémantique immédiatement sous la vitrine des services dans `app/pages/index.vue` :
    - Sur-titre : `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
    - Titre H2 : `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
    - Texte d'accroche valorisant le background Full Stack & QA
    - Grille `ul.pillars-grid` de 4 cartes `ZCard` (Données, Fiabilité, IA, Exploitation) avec icônes `ZIcon` dédiées et puces descriptives
  - [x] Ajouter les styles SCSS scopés pour `.diff-block` / `.pillars-grid` en utilisant les tokens du Design System (`--space-*`, `--radius-*`, `--font-*`, `--surface-*`, `--border-*`).

- [x] Tâche 3 — Vérification responsive, a11y et respect des invariants (AC: 3)
  - [x] Vérifier le comportement responsive sous breakpoints mobile (900px, 680px).
  - [x] Valider l'absence totale d'emoji dans le DOM et les contenus textuels.
  - [x] Valider la navigation clavier et le respect de `prefers-reduced-motion: reduce`.

- [x] Tâche 4 — Validation qualité Docker (AC: 4)
  - [x] Lancer la commande de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc, et génération statique Nitro réussie.

### Review Findings

- [x] [Review][Patch] Supprimer la fausse affordance interactive sur les 4 cartes piliers du bloc différenciateur [app/pages/index.vue:108]
- [x] [Review][Patch] Étendre la cliquabilité de la carte de service via un lien étiré (stretched link) pour cohérence avec cursor: pointer [app/pages/index.vue:62-86]

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`.
- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
- **Icônes :** Utiliser les glyphes SVG intégrés de `<ZIcon name="..." />` (`code`, `layers`, `bot`, `spark`, `check`, `terminal`, `zap`). Ne pas importer de bibliothèque d'icônes externe.
- **Zéro Emoji :** Règle stricte NFR6 / NFR13.

### Fichiers concernés
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)

### Ce qui doit être préservé
- La section Hero commercial et son terminal interactif (`HomeHeroTerminal`).
- Le bandeau défilant `HomeStackMarquee`.
- La section des projets sélectionnés et le journal technique situés en aval.
- L'intégrité du routing multi-pages Nuxt 4.

### Références
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
- Charte éditoriale & bloc différenciateur : [docs/specs/spec-repositionnement-ia/messaging-matrix.md#Section-4.3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Offres et tarifs : [docs/specs/spec-repositionnement-ia/services-and-pricing.md#Section-1](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/services-and-pricing.md)
- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate de validation Docker complète réussie : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
- 0 erreur ESLint / Stylelint.
- 0 erreur TypeScript (vue-tsc).
- 20 routes pré-rendues statiquement via Nitro SSG avec succès.

### Completion Notes List
- Vitrine des 3 services mise à jour dans `app/pages/index.vue` avec les nouvelles offres : Automatisation de processus métier, Agents IA intégrés à vos outils (mis en avant), Applications IA sur mesure.
- Intégration du bloc différenciateur « Prototype → Production » (`section.diff-block.section--sunken`) avec son accroche Full Stack / QA et sa grille sémantique de 4 piliers (Données, Fiabilité, IA, Exploitation).
- Styles SCSS scopés conformes au Design System, responsive (1/2/4 colonnes), support motion réduit et navigation clavier testés et validés.

### File List
- app/pages/index.vue
- docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
- docs/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-09-16 : Implémentation complète de la Story 12.3 (vitrine des 3 services ciblés et bloc différenciateur Prototype vers Production). Passé en revue.

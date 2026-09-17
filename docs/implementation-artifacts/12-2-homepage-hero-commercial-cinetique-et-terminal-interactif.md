---
baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
---

# Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect découvrant la page d'accueil,
I want lire immédiatement une promesse orientée vers la résolution de mes irritants métier et voir un terminal interactif cohérent,
so that je comprends en 5 secondes ce que Simon apporte à mon équipe (FR29, NFR13, NFR15, UX-DR28).

## Acceptance Criteria

1. **Given** la section Hero de la page d'accueil `app/pages/index.vue`
   **When** le composant est monté et rendu
   **Then** le sur-titre est balisé sémantiquement en `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`
   **And** le titre principal `<h1>` affiche `Automatisez les workflows qui freinent votre équipe.`
   **And** le paragraphe d'introduction `.hero__sub` affiche `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`
   **And** une ligne de crédibilité technique `.hero__credibility` affiche `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`
   **And** le badge de disponibilité affiche le signal pulsant avec le libellé `Disponible pour nouvelles missions freelance` et conserve le lien profil Malt vérifié via `<ZExternalLink>`
   **And** le CTA principal `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">` affiche `Identifier un workflow à automatiser` avec l'icône flèche
   **And** le CTA secondaire `<ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg">` affiche `Voir mes systèmes IA` (redirigeant vers la page `/services` ou ancre dédiée).

2. **Given** le composant `app/components/home/HomeHeroTerminal.vue`
   **When** la séquence cinétique de frappe est déroulée (ou affichée instantanément sous reduced-motion)
   **Then** la première commande exécutée est `$ whoami` avec la sortie `${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation` (ton `ink`)
   **And** la deuxième commande exécutée est `$ cat focus.txt` avec la sortie `Systèmes IA · automatisation métier · agents · applications Full Stack · QA` (ton `blue`)
   **And** la troisième commande exécutée est `$ ls ~/systems` (remplaçant définitivement `$ ls ~/projets`) avec la sortie `keova-signal/ debrief/ devis-assist/` issue dynamiquement de `SITE.projects` (ton `green`)
   **And** l'invite finale `$ help` avec caret interactif permet d'ouvrir le terminal modal complet via `useTerminal().open()` sans régression
   **And** le bloc de repli statique `<noscript>` reproduit fidèlement les 3 nouvelles commandes et sorties pour les clients sans JavaScript.

3. **Given** l'accessibilité et la cohérence visuelle
   **When** l'utilisateur navigue au clavier ou avec un lecteur d'écran
   **Then** l'ordre de focus est séquentiel et naturel (CTA principal -> CTA secondaire -> terminal hero -> ruban stack)
   **And** aucun emoji n'est injecté dans les contenus ou l'UI (NFR6 / NFR13)
   **And** sous `prefers-reduced-motion: reduce`, l'animation de frappe est immédiatement contournée (`showInstantState()`) affichant l'état terminal complet sans délai.

4. **Given** l'ensemble des modifications de la story
   **When** on lance la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques (+ assets) pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte textuelle et sémantique du Hero dans `app/pages/index.vue` (AC: 1, 3)
  - [x] Remplacer le sur-titre par `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
  - [x] Mettre à jour le `<h1>` avec `Automatisez les workflows qui freinent votre équipe.`.
  - [x] Mettre à jour `.hero__sub` avec le nouveau pitch d'intégration de systèmes.
  - [x] Ajouter la ligne de crédibilité `.hero__credibility` sous le sous-titre avec les tokens de typographie monospace / muted.
  - [x] Mettre à jour le badge de disponibilité avec `Disponible pour nouvelles missions freelance` tout en conservant le lien Malt externe.
  - [x] Mettre à jour le CTA principal (`/contact`) : `Identifier un workflow à automatiser`.
  - [x] Mettre à jour le CTA secondaire (`/services`) : `Voir mes systèmes IA`.

- [x] Tâche 2 — Mise à jour de la séquence et des commandes dans `HomeHeroTerminal.vue` (AC: 2, 3)
  - [x] Mettre à jour le tableau `fullRows` :
    - `cmd: "whoami"`, `out: "${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation"`, `tone: "ink"`
    - `cmd: "cat focus.txt"`, `out: "Systèmes IA · automatisation métier · agents · applications Full Stack · QA"`, `tone: "blue"`
    - `cmd: "ls ~/systems"`, `out: projectsOutput`, `tone: "green"`
  - [x] Vérifier que `projectsOutput` formate correctement les slugs des projets de `SITE.projects` (`keova-signal/  debrief/  devis-assist/`).
  - [x] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
  - [x] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
  - [x] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.

- [x] Tâche 3 — Validation responsive, accessibilité et design tokens (AC: 1, 2, 3)
  - [x] Vérifier le rendu sur mobile et desktop (pas de débordement de texte, wrapping correct des CTAs).
  - [x] Vérifier la conformité de la hiérarchie de titres (`<h2>` eyebrow -> `<h1>`).
  - [x] Vérifier l'absence absolue d'emoji dans les textes.

- [x] Tâche 4 — Validation qualité Docker (AC: 4)
  - [x] Exécuter `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et génération SSG Nitro complète.

### Review Findings

- [x] [Review][Patch] Centraliser `shortRole` dans `app/data/site.ts` et le consommer dans `HomeHeroTerminal.vue` pour respecter l'invariant DRY [app/components/home/HomeHeroTerminal.vue:118]
- [x] [Review][Patch] Remplacer les emojis décoratifs de coches dans les notes de completion par des marqueurs textuels conformes à la règle Zéro Emoji [docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md:115]
- [x] [Review][Patch] Clarifier la note de route count dans le journal dev pour expliciter les 20 sorties Nitro (11 pages + 9 assets) vs 13 routes statiques [docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md:110]

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker : `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **DRY & Source unique :** `app/data/site.ts` est la seule et unique source de vérité pour le profil et les projets. Les libellés dynamiques du terminal et de la home consomment `SITE.profile` et `SITE.projects`. [Source: AGENTS.md#Section 5.2]
- **Accessibilité & Sémantique :**
  - Tout lien ouvrant un nouvel onglet utilise `<ZExternalLink>`.
  - Le sur-titre sans h2 propre doit être un `<h2 class="eyebrow">` avec `<span aria-hidden="true">// </span>`.
  - Les boutons vers les routes internes Nuxt utilisent `<ZButton :as="NuxtLink" to="...">` pour éviter l'échec de résolution de composants dynamiques chaînés. [Source: AGENTS.md#Section 5.4 et 5.5]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13. Aucune icône emoji dans le DOM ni dans les artéfacts documentaires.

### Fichiers concernés
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
- [MODIFY] [app/components/home/HomeHeroTerminal.vue](file:///Users/simon/dev/jouan.ovh/app/components/home/HomeHeroTerminal.vue)
- [MODIFY] [app/data/site.ts](file:///Users/simon/dev/jouan.ovh/app/data/site.ts)

### Ce qui doit être préservé
- `HomeBootOverlay` et son écouteur `@boot-complete="onBootComplete"`.
- L'arrière-plan interactif `HomeAtmosComponent` et le micro-curseur `ZCustomCursor`.
- L'intégration du ruban `HomeStackMarquee` sous le hero.
- Le cycle de frappe avec `useTerminal()` dans `HomeHeroTerminal.vue`.

### Références
- Cahier des charges et critères d'acceptation : [docs/planning-artifacts/epics.md#Story-12.2](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-2](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
- Charte éditoriale & terminal : [docs/specs/spec-repositionnement-ia/messaging-matrix.md#Section-4.1-Homepage](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate de validation Docker complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 20 routes et assets Nitro pré-rendus avec succès, soit 11 pages HTML/content et 9 assets/images transformés via IPX correspondant aux routes statiques du projet).
- Résolution du formatage Prettier sous `app/pages/index.vue` via `eslint --fix .`.
- Redémarrage propre du conteneur web pour synchronisation de la base SQLite @nuxt/content (`docker compose restart web`).

### Completion Notes List
- [OK] **AC-1 :** Section Hero mise à jour dans `app/pages/index.vue` :
  - Sur-titre sémantique `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
  - H1 : `Automatisez les workflows qui freinent votre équipe.`.
  - Sous-titre : `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`.
  - Ligne de crédibilité `.hero__credibility` : `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`.
  - Badge de disponibilité : `Disponible pour nouvelles missions freelance` + lien profil Malt vérifié via `<ZExternalLink>`.
  - CTAs : `Identifier un workflow à automatiser` (`/contact`) et `Voir mes systèmes IA` (`/services`).
- [OK] **AC-2 :** Terminal Hero cinétique mis à jour dans `HomeHeroTerminal.vue` :
  - Commande `$ whoami` -> `${SITE.profile.name} — ${SITE.profile.shortRole ?? SITE.profile.role}` (ton `ink`, consommé depuis `site.ts` en respect de l'invariant DRY).
  - Commande `$ cat focus.txt` -> `Systèmes IA · automatisation métier · agents · applications Full Stack · QA` (ton `blue`).
  - Commande `$ ls ~/systems` -> `keova-signal/  debrief/  devis-assist/` dérivé de `SITE.projects` (ton `green`).
  - Bloc `<noscript>` et état reduced-motion synchronisés avec les nouvelles sorties.
  - Interaction d'ouverture modal `$ help` (`useTerminal().open()`) préservée.
- [OK] **AC-3 :** Accessibilité, hiérarchie de titres, ordre de focus et règle stricte Zéro Emoji validés.
- [OK] **AC-4 :** Gate de validation Docker 100 % verte.

### File List
- `app/pages/index.vue` (modifié)
- `app/components/home/HomeHeroTerminal.vue` (modifié)
- `app/data/site.ts` (modifié)
- `docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)

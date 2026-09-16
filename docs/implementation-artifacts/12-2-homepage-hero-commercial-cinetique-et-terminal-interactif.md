# Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif

Status: ready-for-dev

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

- [ ] Tâche 1 — Refonte textuelle et sémantique du Hero dans `app/pages/index.vue` (AC: 1, 3)
  - [ ] Remplacer le sur-titre par `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
  - [ ] Mettre à jour le `<h1>` avec `Automatisez les workflows qui freinent votre équipe.`.
  - [ ] Mettre à jour `.hero__sub` avec le nouveau pitch d'intégration de systèmes.
  - [ ] Ajouter la ligne de crédibilité `.hero__credibility` sous le sous-titre avec les tokens de typographie monospace / muted.
  - [ ] Mettre à jour le badge de disponibilité avec `Disponible pour nouvelles missions freelance` tout en conservant le lien Malt externe.
  - [ ] Mettre à jour le CTA principal (`/contact`) : `Identifier un workflow à automatiser`.
  - [ ] Mettre à jour le CTA secondaire (`/services`) : `Voir mes systèmes IA`.

- [ ] Tâche 2 — Mise à jour de la séquence et des commandes dans `HomeHeroTerminal.vue` (AC: 2, 3)
  - [ ] Mettre à jour le tableau `fullRows` :
    - `cmd: "whoami"`, `out: "${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation"`, `tone: "ink"`
    - `cmd: "cat focus.txt"`, `out: "Systèmes IA · automatisation métier · agents · applications Full Stack · QA"`, `tone: "blue"`
    - `cmd: "ls ~/systems"`, `out: projectsOutput`, `tone: "green"`
  - [ ] Vérifier que `projectsOutput` formate correctement les slugs des projets de `SITE.projects` (`keova-signal/  debrief/  devis-assist/`).
  - [ ] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
  - [ ] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
  - [ ] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.

- [ ] Tâche 3 — Validation responsive, accessibilité et design tokens (AC: 1, 2, 3)
  - [ ] Vérifier le rendu sur mobile et desktop (pas de débordement de texte, wrapping correct des CTAs).
  - [ ] Vérifier la conformité de la hiérarchie de titres (`<h2>` eyebrow -> `<h1>`).
  - [ ] Vérifier l'absence absolue d'emoji dans les textes.

- [ ] Tâche 4 — Validation qualité Docker (AC: 4)
  - [ ] Exécuter `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et génération SSG Nitro complète.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker : `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **DRY & Source unique :** `app/data/site.ts` est la seule et unique source de vérité pour le profil et les projets. Les libellés dynamiques du terminal et de la home consomment `SITE.profile` et `SITE.projects`. [Source: AGENTS.md#Section 5.2]
- **Accessibilité & Sémantique :**
  - Tout lien ouvrant un nouvel onglet utilise `<ZExternalLink>`.
  - Le sur-titre sans h2 propre doit être un `<h2 class="eyebrow">` avec `<span aria-hidden="true">// </span>`.
  - Les boutons vers les routes internes Nuxt utilisent `<ZButton :as="NuxtLink" to="...">` pour éviter l'échec de résolution de composants dynamiques chaînés. [Source: AGENTS.md#Section 5.4 et 5.5]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13. Aucune icône emoji dans le DOM.

### Fichiers concernés
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
- [MODIFY] [app/components/home/HomeHeroTerminal.vue](file:///Users/simon/dev/jouan.ovh/app/components/home/HomeHeroTerminal.vue)

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

### Debug Log References

### Completion Notes List

### File List

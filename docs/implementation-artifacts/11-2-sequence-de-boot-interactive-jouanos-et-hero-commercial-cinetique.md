---
baseline_commit: 5f72e8c14627deb82e7d7c8f8f7f2227b00bd0d4
---

# Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect technique ou client potentiel visitant la page d'accueil,
I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
so that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20, CAP-2, CAP-3).

## Acceptance Criteria

1. **Given** un visiteur arrivant sur la page d'accueil
   **When** la page se charge pour la première fois de la session
   **Then** l'overlay de boot (`HomeBootOverlay.vue`, simulant `jouan.os`) s'affiche au premier plan (`z-index: 200`), déroule la montée en charge système (`initialisation du noyau…`, `montage de /dev/portfolio`, `chargement des polices Ubuntu Mono`, `compilation des projets [ok]`, `démarrage du serveur [ok]`) avec jauge de progression
   **And** l'overlay s'efface automatiquement (transition d'opacité vers disparition) après 1.0s à 1.5s
   **And** un clic n'importe où sur l'overlay ou la pression sur la touche `Escape` court-circuite immédiatement l'animation (`finishBoot`)
   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
   **And** sous `@media (prefers-reduced-motion: reduce)`, la séquence de boot est immédiatement court-circuitée sans animation ni délai.

2. **Given** la fin de la séquence de boot (ou son contournement immédiat)
   **When** le hero s'affiche
   **Then** le composant terminal hero (`HomeHeroTerminal.vue`) déclenche sa simulation de frappe séquentielle progressive (effet machine à écrire) :
     - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
     - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
     - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
   **And** sous `@media (prefers-reduced-motion: reduce)`, les lignes du terminal hero s'affichent instantanément en texte statique complet sans animation de frappe, le caret restant figé visible.

3. **Given** la colonne gauche du Hero commercial sur `app/pages/index.vue`
   **When** le visiteur visualise la zone d'accroche principale
   **Then** la hiérarchie de contenu affiche en typographie Ubuntu :
     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
     - Titre principal `<h1>` : `Développeur Full Stack TypeScript`
     - Sous-titre descriptif : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
     - Badge de statut de disponibilité : puce pulsée (`--success`), texte `Disponible pour missions freelance · Profil Malt vérifié`, encapsulant un lien accessible vers Malt via `<ZExternalLink :href="SITE.profile.maltUrl">`
     - Groupe de CTAs d'action :
       - CTA primaire : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Discuter de votre projet<template #iconRight><ZIcon name="arrow" /></template></ZButton>`
       - CTA secondaire : `<ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg">Voir le parcours &amp; CV</ZButton>`
   **And** les anciens tags WordPress/PHP (`php`, `symfony`, `wordpress`) et l'ancienne accroche (« Du code sur-mesure, de l'IA utile ») sont définitivement retirés du Hero.

4. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [ ] Tâche 1 — Création du composant de démarrage `app/components/home/HomeBootOverlay.vue` (AC: 1)
  - [ ] Définir la structure HTML/template (`.boot`, `.boot__in`, `.boot__logo` avec nom `jouan.os`, `.boot__line`, `.boot__bar` avec barre `<i>`, `.boot__skip`).
  - [ ] Implémenter les étapes de boot textuelles (`bootSteps`) et la barre de progression linéaire.
  - [ ] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
  - [ ] Permettre l'interruption immédiate au clic ou via la touche `Escape` (avec écouteur nettoyé dans `onUnmounted()`).
  - [ ] Supporter `prefers-reduced-motion: reduce` en zappant instantanément la séquence (`finishBoot()`).
  - [ ] Émettre l'événement `@boot-complete` vers le composant parent pour synchroniser le démarrage du terminal hero.
  - [ ] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).

- [ ] Tâche 2 — Création du composant terminal hero `app/components/home/HomeHeroTerminal.vue` (AC: 2)
  - [ ] Extraire et modulariser la fenêtre terminal décorative du hero dans `app/components/home/HomeHeroTerminal.vue`.
  - [ ] Implémenter la séquence de frappe séquentielle progressive (effet machine à écrire) pour les commandes `$ whoami`, `$ cat focus.txt` et `$ ls ~/projets` alignées sur le positionnement Full Stack TS.
  - [ ] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
  - [ ] Assurer la neutralisation sous `prefers-reduced-motion: reduce` : contenu affiché immédiatement dans son état final, caret figé visible.
  - [ ] Styliser avec les variables de Design System (`--bg-terminal`, `--font-mono`, `--term-red`, `--term-yellow`, `--term-green`, `--term-blue`, etc.).

- [ ] Tâche 3 — Refonte commerciale de la colonne gauche du Hero sur `app/pages/index.vue` (AC: 3)
  - [ ] Mettre à jour l'eyebrow : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`.
  - [ ] Mettre à jour le titre `h1` : `Développeur Full Stack TypeScript`.
  - [ ] Remplacer le sous-titre par le pitch commercial ciblé Nuxt / NestJS / PostgreSQL.
  - [ ] Intégrer le badge de disponibilité avec puce pulsée et lien `<ZExternalLink :href="SITE.profile.maltUrl">Profil Malt vérifié</ZExternalLink>`.
  - [ ] Adapter les boutons d'appel à l'action : bouton principal vers `/contact` (« Discuter de votre projet ») et secondaire vers `/about` (« Voir le parcours & CV »).
  - [ ] Supprimer la liste de tags legacy (`tags = ["php", "symfony", "wordpress", ...]`) du template hero.
  - [ ] Intégrer `<HomeBootOverlay @boot-complete="onBootComplete" />` et `<HomeHeroTerminal :auto-start="isBootFinished" />`.

- [ ] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [ ] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [ ] Vérifier la conformité de rendu et l'absence de régression d'hydratation (SSR/SSG Nitro).
  - [ ] Vérifier le comportement d'accessibilité au clavier (`Tab`, `Escape`) et sous contraste forcé.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
- **Accessibilité (a11y) :**
  - Le lien externe vers Malt DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`).
  - Seul le caret de frappe actif clignote ; les carets décoratifs ou sous reduced-motion doivent être figés visibles.
  - La touche `Escape` court-circuite le boot overlay et ne bloque aucun focus.
  - Les puces pulsées doivent être stylisées sans animations violentes (pulsation douce ou opacité).

### Analyse des fichiers modifiés et créés
- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
- **`app/components/home/HomeHeroTerminal.vue`** (NEW) : Terminal hero cinétique avec animation de frappe des commandes cibles, invitant ensuite à ouvrir l'easter-egg terminal.
- **`app/pages/index.vue`** (UPDATE) : Remplacement du hero existant par le nouveau hero commercial Full Stack TS, intégration de `HomeBootOverlay` et `HomeHeroTerminal`, suppression des données legacy (`tags`, ancienne `tagline`).

### Données & Textes exacts (Source : `sections-mapping.md` et `SPEC.md`)
- **Eyebrow hero :** `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
- **Titre principal H1 :** `Développeur Full Stack TypeScript`
- **Pitch sous-titre :** `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
- **Badge disponibilité :** `Disponible pour missions freelance · Profil Malt vérifié` (lien `SITE.profile.maltUrl`).
- **Commandes terminal hero :**
  1. `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
  2. `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
  3. `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
  4. Invite finale : `anon.@jouan.ovh:~$ help` avec caret clignotant et déclencheur `openTerminal`.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.1 : docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md]

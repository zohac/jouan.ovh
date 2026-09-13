# Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur découvrant la page d'accueil,
I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
so that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).

## Acceptance Criteria

1. **Given** le projet en production sur `main` et la volonté de développer de manière totalement isolée sans impacter la prod
   **When** on initialise la branche de développement dédiée `feat/home-awwwards` issue de `develop` (NFR10)
   **Then** l'historique de `main` reste préservé et tout le travail de l'Epic 11 s'exécute sur cette branche isolée.

2. **Given** la source de vérité partagée du contenu `app/data/site.ts`
   **When** on met à jour les données du profil, des compétences et des projets
   **Then** `SITE.profile` affiche le rôle officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », la ville « Rouen, France », l'URL Malt `https://www.malt.fr/profile/simonjouan`, et le statut disponible
   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
   **And** `SITE.projects` intègre les 3 projets alignés avec Malt : **Keova** (statut production, lien live `https://keova.app`), **TryOn** (statut étude de cas MVP livré, sans lien mort `url: ""`), et **Nodium** (statut lab R&D en cours)
   **And** l'interface `IProject` supporte `status?: string` et `url?: string` de façon rétrocompatible (sans casser `programs/Projets.ts` ni `FooterComponent`).

3. **Given** le conteneur atmosphérique cinétique `.atmos`
   **When** le visiteur charge la page d'accueil
   **Then** 3 calques auroras floutés (aubergine, orange, rouge) s'animent de façon lente et fluide (26s à 32s) en pur CSS, superposés à une grille de points et une texture de scanlines CRT terminales
   **And** le conteneur est marqué `aria-hidden="true"`
   **And** sous `@media (prefers-reduced-motion: reduce)`, les keyframes d'animation sont strictement neutralisées (`animation: none`), les gradients restant figés de manière lisible.

4. **Given** un utilisateur sur ordinateur de bureau avec souris (`@media (hover: hover)`)
   **When** il survole la page d'accueil
   **Then** un micro-curseur interactif fluide (`.cursor-dot` + `.cursor-ring`) suit le pointeur et réagit (agrandissement / scaling) au survol des éléments interactifs marqués `data-hot` (boutons, liens, cartes)
   **And** le curseur personnalisé est totalement masqué sur les périphériques tactiles (`@media (hover: none)`) et sous reduced-motion
   **And** en cas d'erreur ou d'absence de JS, le curseur système natif du navigateur reste 100 % opérationnel et visible.

5. **Given** l'ensemble des ajouts de la story (branche, `site.ts`, composant atmosphérique, micro-curseur)
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques pré-rendues.

## Tasks / Subtasks

- [ ] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
  - [ ] Vérifier l'état de l'arbre de travail (`git status`).
  - [ ] S'assurer que la branche `develop` est à jour.
  - [ ] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.

- [ ] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
  - [ ] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
  - [ ] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
  - [ ] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
  - [ ] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
  - [ ] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).

- [ ] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
  - [ ] Créer `app/components/home/HomeAtmosComponent.vue`.
  - [ ] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
  - [ ] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
  - [ ] Baliser le bloc avec `aria-hidden="true"`.
  - [ ] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.

- [ ] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
  - [ ] Créer `app/components/ui/ZCustomCursor.vue`.
  - [ ] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
  - [ ] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
  - [ ] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
  - [ ] Nettoyer les listeners lors du `onUnmounted()`.

- [ ] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
  - [ ] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
  - [ ] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [ ] Vérifier que les 13 routes statiques sont générées sans avertissement.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--color-bg-base)`, `var(--color-aubergine-base)`, `var(--color-orange-base)`, `var(--color-text-default)`, etc.). [Source: AGENTS.md#Section 3]
- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `pointermove`) DOIT être encapsulé dans un bloc `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]

### Fichiers concernés & Analyse d'impact
- **`app/data/site.ts`** (UPDATE) : Source unique de vérité du profil et des projets.
  - *État actuel :* Contient `patio-conseil.fr` (WordPress) et un profil générique « Développeur web freelance ».
  - *Modifications :* Rôle mis à jour (« Développeur Full Stack TypeScript — Nuxt / NestJS »), ville « Rouen, France », stack moderne ciblée, et projets Keova (live), TryOn (étude de cas) et Nodium (lab).
  - *À préserver :* Rétrocompatibilité avec `app/components/terminal/programs/Projets.ts` qui boucle sur `SITE.projects`. Si `project.url` est vide, ne pas tenter d'ouvrir de lien ou conditionner l'action d'ouverture.
- **`app/components/terminal/programs/Projets.ts`** (UPDATE si nécessaire) : Adapter le programme terminal pour gérer les projets sans URL (ex. TryOn : afficher `(étude de cas)` au lieu d'ouvrir une URL vide).
- **`app/components/home/HomeAtmosComponent.vue`** (NEW) : Composant dédié aux calques auroras et scanlines.
- **`app/components/ui/ZCustomCursor.vue`** (NEW) : Composant du micro-curseur interactif progressif.
- **`app/pages/index.vue`** (UPDATE) : Intégration du composant atmosphérique et du curseur.

### Conformité Accessibilité (a11y)
- **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
- **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.

### References
- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Direction stratégique : docs/direction_strategique_site.md]
- [Directives globales pour agents : AGENTS.md]

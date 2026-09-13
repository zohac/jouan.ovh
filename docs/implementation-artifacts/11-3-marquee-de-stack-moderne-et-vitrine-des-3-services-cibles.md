---
baseline_commit: edfab0ecf3859790926fdae447ce7256a2f03565
---

# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur explorant la page d'accueil,
I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
so that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22, CAP-4, CAP-5).

## Acceptance Criteria

1. **Given** la stack moderne définie dans `app/data/site.ts` (`SITE.skills`)
   **When** le visiteur visualise la zone située immédiatement sous le Hero
   **Then** le composant `HomeStackMarquee.vue` affiche un bandeau défilant continu en pur CSS (animation `scroll-x` avec masque d'atténuation horizontal `mask-image: linear-gradient(...)`)
   **And** les compétences sont affichées avec un séparateur visuel distinctif (étoile accent `✦` ou puce stylisée)
   **And** le défilement se met automatiquement en pause au survol de la souris (`:hover`)
   **And** le ruban animé est masqué aux technologies d'assistance (`aria-hidden="true"`) pour éviter la pollution sonore des lecteurs d'écran
   **And** sous `@media (prefers-reduced-motion: reduce)`, l'animation est totalement arrêtée (`animation: none`), les éléments restent alignés proprement sans débordement horizontal (`overflow: hidden`).

2. **Given** la section des services sur `app/pages/index.vue`
   **When** le visiteur découvre la vitrine d'offres
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
     - Titre de section : `<h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>`
   **And** la grille présente exactement 3 cartes `ZCard` orientées Full Stack TypeScript & SaaS :
     - **Carte 1 — Création d'applications web & SaaS** (`01 / 03`) :
       - Proposition de valeur : `De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.`
       - Points livrables clés avec icône de validation : Architecture logicielle & APIs REST, Applications Vue 3 / Nuxt 4 & NestJS, Intégration Stripe & PostgreSQL.
       - Tags technologiques : `Nuxt`, `NestJS`, `PostgreSQL`, `Stripe Connect`.
       - Tarif indicatif : `Sur devis / au sprint`.
     - **Carte 2 — Développement Full Stack TypeScript** (`02 / 03`, carte vedette / `featured`) :
       - Proposition de valeur : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
       - Points livrables clés avec icône de validation : Composants Vue 3 / Nuxt avec TypeScript strict, Microservices & backend modulaire NestJS, Fiabilisation et optimisation des performances.
       - Tags technologiques : `TypeScript`, `Vue 3`, `Nuxt`, `NestJS`, `Node.js`.
       - Tarif indicatif : `Sur devis / TJM`.
     - **Carte 3 — Évolution & Architecture applicative** (`03 / 03`) :
       - Proposition de valeur : `Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).`
       - Points livrables clés avec icône de validation : Audits techniques de code & migrations de versions, Tests E2E Cypress & tests unitaires Vitest, Pipelines CI/CD & conteneurisation Docker.
       - Tags technologiques : `Cypress`, `Vitest`, `Docker`, `CI/CD`.
       - Tarif indicatif : `Au forfait / audit`.
   **And** chaque carte ou lien d'approfondissement cible directement la route `/services` (aucune ancre intra-page `#`).

3. **Given** le template `app/pages/index.vue`
   **When** les nouvelles sections sont intégrées
   **Then** les anciennes données de services legacy (`wordpress`, `apps`, `ia` de l'ancien portfolio) et leur code mort sont intégralement supprimés du script et du template de la page d'accueil.

4. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Création du composant `app/components/home/HomeStackMarquee.vue` (AC: 1)
  - [x] Définir la structure de template (`.marquee`, `.marquee__track`, `.marquee__item`, séparateur `.star` avec symbole `✦`).
  - [x] Consommer les compétences directement depuis `SITE.skills` (`app/data/site.ts`) et formater les libellés de stack pour l'affichage (ex. TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest).
  - [x] Doubler la liste des items dans le track pour assurer une boucle infinie continue sans à-coup visuel.
  - [x] Configurer l'animation CSS `@keyframes scroll-x` avec masquage horizontal `mask-image` et pause au survol (`:hover`).
  - [x] Appliquer `aria-hidden="true"` sur le conteneur décoratif et neutraliser l'animation sous `@media (prefers-reduced-motion: reduce)`.
  - [x] Styliser en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--space-5`, `--space-8`, `--font-mono`, `--fs-xl`, `--text-faint`, `--text-body`, `--accent`, `--fw-regular`, `--ls-wide`).

- [x] Tâche 2 — Refonte de la vitrine des 3 services dans `app/pages/index.vue` (AC: 2, 3)
  - [x] Supprimer le tableau de données legacy `services` (WordPress, etc.) de `app/pages/index.vue`.
  - [x] Déclarer les 3 offres ciblées Full Stack TS (`creation`, `fullstack`, `evolution`) avec leur numérotation (`01 / 03`), description, points livrables, tags et liens vers `/services`.
  - [x] Baliser les cartes avec `ZCard` (support de `:accent="service.featured"` et `:featured="service.featured"`).
  - [x] Baliser la liste de points avec `<ul>` et `<li>`, utilisant une icône de validation accessible.
  - [x] Assurer que chaque lien d'action pointe vers `/services` (`<NuxtLink to="/services">`).

- [x] Tâche 3 — Intégration et disposition sur `app/pages/index.vue` (AC: 1, 2, 3)
  - [x] Placer `<HomeStackMarquee />` sous le hero commercial `.hero` et avant la section des services.
  - [x] Mettre à jour l'eyebrow de section (`// ce que je propose`) et le titre `h2`.
  - [x] Vérifier la cohérence responsive (grille 3 colonnes sur desktop, 1 colonne sous 860px) et l'espacement avec les primitives globales (`.section`, `.container`).

- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu, l'absence de régression d'hydratation et le comportement au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier l'arrêt complet du défilement sous `prefers-reduced-motion: reduce`.

### Review Findings

- [x] [Review][Patch] Corriger le décalage de bouclage infini du marquee (saut de var(--space-8)/2 à translateX) [app/components/home/HomeStackMarquee.vue:95-102]
- [x] [Review][Patch] Éliminer les valeurs CSS hardcodées (#000 dans mask-image et 2px dans .offer__check) [app/components/home/HomeStackMarquee.vue:54, app/pages/index.vue:466]
- [x] [Review][Patch] Optimiser le rendu statique sous prefers-reduced-motion en masquant la passe dupliquée [app/components/home/HomeStackMarquee.vue:97-107]
- [x] [Review][Patch] Typer strictement le tableau des services et sécuriser l'affichage du marquee en cas de liste vide [app/pages/index.vue:140, app/components/home/HomeStackMarquee.vue:41]
- [x] [Review][Defer] Aligner le catalogue de la page dédiée /services et ses métadonnées SEO/JSON-LD avec les 3 nouvelles offres de l'accueil [app/pages/services.vue] — deferred, pre-existing
- [x] [Review][Defer] Couverture automatisée par tests E2E / visuels de la boucle continue du marquee [app/components/home/HomeStackMarquee.vue] — deferred, prévu Story 11.5

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--border-subtle)`, `var(--surface-1)`, `var(--text-strong)`, `var(--text-muted)`, `var(--accent)`, `var(--success)`, etc.). [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) :**
  - Le marquee est décoratif et en boucle continue : il DOIT porter `aria-hidden="true"`.
  - Respect strict de `prefers-reduced-motion: reduce` : l'animation de défilement doit être désactivée (`animation: none`).
  - Les cartes et listes doivent utiliser une sémantique `<ul>` / `<li>` propre.
  - Liens vers `/services` accessibles avec libellés explicites (`aria-label`).
- **DRY & Données :** La liste des compétences du marquee doit s'appuyer sur `SITE.skills` issu de `app/data/site.ts`.

### Fichiers modifiés et créés
- **`app/components/home/HomeStackMarquee.vue`** (NEW) : Composant bandeau défilant infini de la stack moderne.
- **`app/pages/index.vue`** (UPDATE) : Insertion du marquee, refonte complète de la section services en 3 offres ciblées, suppression des reliquats WordPress.

### Données & Textes exacts (Source : `sections-mapping.md` et `Home - Awwwards.html`)
- **Marquee items :**
  - Dérivés de `SITE.skills` : `TypeScript`, `Nuxt 4`, `Vue.js`, `NestJS`, `Node.js`, `PostgreSQL`, `TypeORM`, `Stripe Connect`, `Cypress`, `Docker`, `REST API`, `Vitest`.
  - Séparateur : `<span class="star" aria-hidden="true">✦</span>` en couleur `var(--accent)`.
- **Services (3 offres) :**
  1. `01 / 03` — `Création d'applications web & SaaS`
     - Proposition : `De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.`
     - Points : `Architecture logicielle & APIs REST`, `Applications Vue 3 / Nuxt 4 & NestJS`, `Intégration Stripe & PostgreSQL`.
     - Tags : `Nuxt`, `NestJS`, `PostgreSQL`, `Stripe Connect`.
  2. `02 / 03` (Featured) — `Développement Full Stack TypeScript`
     - Proposition : `Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.`
     - Points : `Composants Vue 3 / Nuxt avec TypeScript strict`, `Microservices & backend modulaire NestJS`, `Fiabilisation et optimisation des performances`.
     - Tags : `TypeScript`, `Vue 3`, `Nuxt`, `NestJS`, `Node.js`.
  3. `03 / 03` — `Évolution & Architecture applicative`
     - Proposition : `Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).`
     - Points : `Audits techniques de code & migrations de versions`, `Tests E2E Cypress & tests unitaires Vitest`, `Pipelines CI/CD & conteneurisation Docker`.
     - Tags : `Cypress`, `Vitest`, `Docker`, `CI/CD`.

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate Docker validée avec 0 erreur ESLint / 0 erreur Stylelint / 0 erreur TypeScript (vue-tsc) / 13 routes SSG Nitro pré-rendues.

### Completion Notes List
- Implémentation du composant `HomeStackMarquee.vue` avec boucle infinie CSS, mask-image et `aria-hidden="true"`, pause au survol `:hover` et arrêt sous `prefers-reduced-motion: reduce`.
- Refonte de la vitrine des services sur `app/pages/index.vue` : suppression des reliquats WordPress, intégration des 3 offres ciblées Full Stack TypeScript avec tags `ZTag`, points livrables avec `ZIcon name="check"`, tarification indicative et liens explicites vers `/services`.
- Mise à jour de l'en-tête de section (`// ce que je propose` et `Trois expertises pour concevoir et faire évoluer vos applications`).
- Validation réussie de la suite complète d'outillage via Docker.

### File List
- `app/components/home/HomeStackMarquee.vue` (NEW)
- `app/pages/index.vue` (MODIFIED)

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.2 : docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md]

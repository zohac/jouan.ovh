Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09c1b-ec92-7d73-b158-11b0060d0a7e
--------
user
# Acceptance Auditor Prompt — Story 11.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.3), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais comparer directement le diff aux critères de la Story 11.3 et aux contraintes de contexte, puis restituer uniquement les écarts constatés sous forme de liste Markdown.
exec
/bin/zsh -lc "wc -l \"docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md\" && sed -n '1,260p' \"docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     144 docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md
---
baseline_commit: edfab0ecf3859790926fdae447ce7256a2f03565
---

# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles

Status: review

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

exec
/bin/zsh -lc "wc -l \"docs/planning-artifacts/epics.md\" && sed -n '1,260p' \"docs/planning-artifacts/epics.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     789 docs/planning-artifacts/epics.md
---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - docs/specs/spec-design-system-revamp/SPEC.md
  - docs/specs/spec-design-system-revamp/pages.md
  - docs/specs/spec-design-system-revamp/primitives.md
  - docs/project-context.md
  - docs/implementation-artifacts/deferred-work.md
  - docs/implementation-artifacts/epic-9-retro-2026-06-29.md
  - docs/specs/spec-home-awwwards/SPEC.md
  - docs/specs/spec-home-awwwards/sections-mapping.md
  - docs/specs/spec-home-awwwards/.decision-log.md
  - docs/contexte_malt.md
  - docs/direction_strategique_site.md
  - AGENTS.md
---

# jouan.ovh - Epic Breakdown

## Overview

Ce document décompose la refonte de jouan.ovh sur le nouveau design system
(contrat : `SPEC-design-system-revamp`) en épics et stories implémentables.
Sources : SPEC.md (capacités/contraintes), pages.md + primitives.md (UX),
project-context.md (technique).

## Requirements Inventory

### Functional Requirements

FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_

#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_

### NonFunctional Requirements

NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).

### Additional Requirements

- Gestionnaire de paquets **pnpm** (corepack enable) sous Docker ; build statique `pnpm generate` → `.output/public` ; déploiement automatique GitHub Pages via `.github/workflows/cd.yml`.
- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
- Blog via `@nuxt/content` markdown — dossier `content/`.
- Barre de qualité stricte = Docker-only gate (`pnpm lint && pnpm typecheck && pnpm generate`) avec 0 erreur et 13 routes pré-rendues.
- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.

### UX Design Requirements

UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
UX-DR6: Primitive `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) — réf. `Input.jsx`.
UX-DR7: Primitive `ZAvatar.vue` (radius pill) — réf. `Avatar.jsx`.
UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
UX-DR18: Pile atmosphérique `.atmos` avec 3 calques auroras floutés (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), scanlines CRT et grille de points.
UX-DR19: Composant `BootOverlay` avec montée en charge progressive stylisée `jouan.os`, affichage des étapes, fermeture Escape/clic et mémorisation en session.
UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).

### FR Coverage Map

FR1: Epic 1 — Migration de la stack vers Nuxt 4
FR2: Epic 2 — Tokens du design system disponibles
FR3: Epic 2 — Primitives Vue réutilisables
FR4: Epic 2 — Châssis global (header/footer/nav/socials)
FR5: Epic 3 — Page d'accueil (hero Terminal A)
FR6: Epic 4 — Page Services (route /services)
FR7: Epic 5 — Page À-propos
FR8: Epic 6 — Blog (index + article)
FR9: Epic 7 — Page Contact (route /contact)
FR10: Epic 8 — Terminal easter-egg restylé
FR11: Epic 9 — Accessibilité & finitions motion
FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
FR14: Epic 10 — Validation a11y émulée + unification forced-colors
FR15: Epic 10 — SEO centralisé site-wide
FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
FR21: Epic 11 — Marquee infini de la stack moderne ciblée
FR22: Epic 11 — Vitrine des 3 offres de services ciblées
FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
FR24: Epic 11 — Vitrine des articles récents du blog
FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
FR26: Epic 11 — Préservation de l'architecture multi-pages
FR27: Epic 11 — Micro-curseur interactif progressif desktop

## Epic List

### Epic 1: Migration de la stack vers Nuxt 4
Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_

### Epic 2: Fondations du design system
Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
**FRs covered:** FR2, FR3, FR4 _(UX-DR1–7, 10, 11)_

### Epic 3: Page d'accueil
Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
**FRs covered:** FR5 _(UX-DR12)_

### Epic 4: Page Services
Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
**FRs covered:** FR6 _(UX-DR13)_

### Epic 5: Page À-propos
Le visiteur découvre le parcours : portrait, bio, timeline d'expérience, formation, stack.
**FRs covered:** FR7 _(UX-DR14)_

### Epic 6: Blog
Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
**FRs covered:** FR8 _(UX-DR15)_

### Epic 7: Page Contact
Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
**FRs covered:** FR9 _(UX-DR16)_

### Epic 8: Terminal easter-egg restylé
L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
**FRs covered:** FR10 _(UX-DR8, UX-DR9)_

### Epic 9: Accessibilité & finitions motion
Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
**FRs covered:** FR11 _(UX-DR17)_

### Epic 10: Fin de refonte
La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_

### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_

---

## Epic 1: Migration de la stack vers Nuxt 4

Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).

### Story 1.1: Migrer le cœur vers Nuxt 4

As a mainteneur du site,
I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
So that le site repose sur une base moderne et supportée.

**Acceptance Criteria:**

**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé

### Story 1.2: Mettre à jour les modules et dépendances

As a mainteneur du site,
I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
So that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.

**Acceptance Criteria:**

**Given** les versions héritées dans `package.json`
**When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable
**Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>`/`<nuxt-picture>`) fonctionnent
**And** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation)

### Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)

As a mainteneur du site,
I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
So that le lint reste la barre de qualité après la montée de version.

**Acceptance Criteria:**

**Given** la config `.eslintrc.js` historique
**When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4
**Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration
**And** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`)

### Story 1.4: Valider build statique et déploiement gh-pages

As a mainteneur du site,
I want valider `yarn generate` et le déploiement gh-pages après migration,
So that la chaîne de production est verte avant d'entamer la refonte.

**Acceptance Criteria:**

**Given** la stack migrée
**When** on lance `yarn generate`
**Then** le build statique réussit et `.output/public` contient les pages existantes
**And** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel

---

## Epic 2: Fondations du design system

Langage visuel, primitives Vue réutilisables et châssis global refondu, visibles sur tout le site.

### Story 2.1: Porter les tokens du design system

As a développeur,
I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
So that tout composant style via une source unique de vérité (UX-DR1, FR2, NFR2).


exec
/bin/zsh -lc "wc -l \"AGENTS.md\" && sed -n '1,260p' \"AGENTS.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     171 AGENTS.md
# AGENTS.md — Directives & Contexte Projet pour Agents IA

Ce document constitue la **source de vérité universelle** pour tout agent IA (Claude, Gemini, Antigravity, BMAD, Cursor, Windsurf, Copilot, etc.) intervenant sur le dépôt **jouan.ovh**. Il consigne les règles critiques, l'architecture, l'environnement de développement et les invariants non négociables du projet.

---

## 1. Identité & État du Projet

- **Projet :** `jouan.ovh` — Portfolio, vitrine de services et blog de **Simon Jouan** (développeur web freelance).
- **URL de production :** [`https://jouan.ovh`](https://jouan.ovh) (déployé sur **GitHub Pages**, domaine custom, HTTPS Let's Encrypt forcé, DNS OVH).
- **Statut actuel :** **Refonte complète livrée et active en production** (Epics 1 à 10 validés et clôturés). Le projet est en phase d'**exploitation, maintenance et évolutions ciblées (Run)**.
- **Langue & Voix (NFR6) :** 
  - Interface et contenu en **FRANÇAIS** (`lang="fr"`).
  - Voix : **1re personne (« je »)** pour Simon, **vouvoiement** pour le visiteur/client.
  - **ZÉRO EMOJI** dans le contenu et l'UI (univers sobre et professionnel inspiré du terminal).

---

## 2. Règle d'Or d'Environnement : Docker Uniquement ⚠️

**L'intégralité du développement et de l'outillage DOIT s'exécuter dans le conteneur Docker.**

> ⚠️ **Ne JAMAIS exécuter `pnpm`, `npm`, `yarn` ou `nuxi` directement sur la machine hôte.**
> Les dépendances natives (`better-sqlite3`, `esbuild`, `sharp`...) sont compilées pour Linux dans un volume Docker isolé nommé `node_modules`. Exécuter des commandes sur l'hôte (macOS arm64) corromprait l'environnement.

### Commandes usuelles via Docker :

```sh
# Démarrer le serveur de développement (http://localhost:3000)
docker compose up

# Arrêter les conteneurs
docker compose down

# Lancer la suite de validation complète (Gate obligatoire avant commit)
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"

# Commandes ponctuelles
docker compose run --rm web sh -c "corepack enable && pnpm lint"       # eslint + stylelint
docker compose run --rm web sh -c "corepack enable && pnpm typecheck"  # vérification TypeScript vue-tsc
docker compose run --rm web sh -c "corepack enable && pnpm generate"   # build statique SSG (13 routes)
docker compose run --rm web sh -c "corepack enable && pnpm add -D <pkg>" # ajout de dépendance
```

*Note SQLite / `@nuxt/content` :* Lancer `pnpm generate` dans un conteneur séparé pendant que le serveur dev tourne peut invalider la base de contenu SQLite du dev. Si `/blog` affiche une erreur en dev, exécuter `docker compose restart web`.

---

## 3. Stack Technique & Versions

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé, cible de build **statique** (`nuxi generate` via Nitro).
- **Structure applicative :** Tout le code Nuxt vit sous **`app/`** (`srcDir = "app"` dans `nuxt.config.ts`).
- **UI / Composants :** Vue 3 avec **`<script setup lang="ts">`** obligatoire pour tout nouveau composant. (Plus aucun décorateur de classe ; le terminal a été intégralement migré en `script setup`).
- **Langage :** TypeScript `^6.0.3` en mode strict.
- **Styles :** SCSS (`sass ^1.101.0`) avec `@use ... as _alias` (jamais `@import`).
- **Tokens & Design System :** Dark-first (pas de mode clair). Tokens CSS custom properties exposés globalement sur `:root` dans `app/assets/scss/abstract/_root.scss`. Consommation via `var(--token)`.
- **Contenu :** `@nuxt/content ^3.14.0` (v3, stockage SQLite, collections typées dans `content.config.ts`).
- **Images :** `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`), jamais de balise `<img>` brute.
- **Linters :** ESLint 10 (flat config `@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
- **Formulaire de contact :** Web3Forms (service tiers sans serveur), clé publique lue via `useRuntimeConfig().public.web3formsAccessKey`.
- **CI/CD :** GitHub Actions (`.github/workflows/cd.yml`) publiant automatiquement `.output/public` vers la branche `gh-pages` lors d'un push sur `main`.

---

## 4. Architecture & Arborescence Clé

```text
jouan.ovh/
├── app/
│   ├── assets/scss/
│   │   ├── abstract/        # Tokens, variables, mixins (_root.scss = source vérité CSS vars)
│   │   ├── base/            # _reset.scss, _layout.scss (primitives globales), _motion.scss
│   │   └── main.scss        # Point d'entrée SCSS global
│   ├── components/
│   │   ├── ui/              # Primitives DS auto-importées sans préfixe (ZButton, ZCard, ZExternalLink...)
│   │   ├── card/            # Sous-blocs ZCardHeader, ZCardBody, ZCardFooter
│   │   ├── terminal/        # Sous-système terminal draggable (TerminalComponent, TerminalManagerComponent)
│   │   │   └── programs/    # Classes TypeScript pures implémentant IProgram
│   │   ├── HeaderComponent.vue
│   │   ├── FooterComponent.vue
│   │   └── HexagonLinkComponent.vue
│   ├── composables/
│   │   ├── useSiteUrl.ts    # Source unique pour l'URL de base résolue via runtimeConfig
│   │   └── usePageSeo.ts    # Helper universel useSeoMeta, canonical et Schema.org / JSON-LD
│   ├── data/
│   │   └── site.ts          # SOURCE UNIQUE de vérité pour le profil, compétences et projets (SITE)
│   ├── layouts/
│   │   └── default.vue      # Layout principal
│   └── pages/               # 13 routes statiques pré-rendues
│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
│       ├── services.vue     # Offres de freelance et déroulé du process en 4 étapes
│       ├── about.vue        # Biographie, timeline expériences/formations et stack
│       ├── contact.vue      # Formulaire de contact Web3Forms et coordonnées
│       ├── confidentialite.vue # Politique de confidentialité RGPD
│       ├── mentions-legales.vue# Mentions légales
│       └── blog/
│           ├── index.vue    # Liste des articles du blog
│           └── [...slug].vue# Rendu Markdown d'article via <ContentRenderer>
├── content/
│   └── blog/                # Articles de blog au format Markdown
├── content.config.ts        # Schéma et validation Zod des collections @nuxt/content
├── nuxt.config.ts           # Configuration centrale Nuxt 4
├── public/
│   ├── CNAME                # Domaine de production officiel (contient "jouan.ovh")
│   ├── _headers             # En-têtes HTTP de sécurité pour gh-pages
│   └── images/              # Assets statiques optimisés
├── .github/workflows/cd.yml # Pipeline CI/CD GitHub Actions
└── docs/                    # Documentation projet, specs, artifacts de planning et d'implémentation
```

---

## 5. Invariants & Règles d'Implémentation Critiques

### 1. URLs et Domaines : Jamais de Hardcoding
- **Règle :** Ne **JAMAIS** écrire en dur `https://jouan.ovh` ou `https://dev.jouan.ovh` dans le code applicatif ou les métadonnées.
- **Pattern :** Toujours injecter l'URL via le composable `useSiteUrl()`. Ce composable lit `runtimeConfig.public.siteUrl` (surchargeable par la variable d'environnement `NUXT_PUBLIC_SITE_URL`).
- **SEO :** Utiliser systématiquement `usePageSeo({ title, description, path, ... })` pour garantir l'unicité des canonicals et des balises OpenGraph/Twitter.

### 2. Contenu Partagé : DRY Strict
- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
- **Pattern :** Consommer `SITE.profile`, `SITE.skills` ou `SITE.projects` depuis `app/data/site.ts`.

### 3. Tokens & Primitives de Layout SCSS
- **No Hardcode :** Aucune couleur, rayon, ombre ou marge en dur. Toujours consommer les variables globales `var(--token)`.
- **Primitives globales :** Les classes de mise en page `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose`, `.hero__tags` vivent dans `app/assets/scss/base/_layout.scss`. **Ne JAMAIS les redéclarer dans un `<style scoped>` de page**.
- **Piège du padding multi-classes :** Lorsqu'un élément cumule `.container` et une classe locale (ex. `.hero__in.container`), ne **JAMAIS** utiliser le raccourci `padding: ...`. Utiliser impérativement les propriétés logiques **`padding-inline`** et **`padding-block`** pour éviter l'écrasement mutuel des axes.

### 4. Accessibilité (a11y) dès la Conception
- **Liens externes :** TOUT lien ouvrant un nouvel onglet (`target="_blank"`) DOIT utiliser la primitive **`<ZExternalLink>`** (`app/components/ui/ZExternalLink.vue`). Elle impose `rel="noopener"` et injecte le libellé masqué accessible `(ouvre dans un nouvel onglet)`.
- **Hiérarchie de titres :** Tout libellé de section eyebrow ouvrant une section sans titre h2 propre doit être un **`<h2 class="eyebrow">`** (le style neutralisé hérite de `font-weight`/`line-height` pour une parité visuelle stricte). Les préfixes décoratifs `// ` doivent être encapsulés dans `<span aria-hidden="true">// </span>`.
- **Séquences :** Toute répétition de cartes ou étapes doit être balisée en listes sémantiques **`<ul>` ou `<ol>` avec `<li>`** (avec `> li { display: flex }` si cartes flex).
- **Contraste forcé (`forced-colors`) :** Tout élément interactif au focus doit intégrer le repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` pour rester visible en mode contraste élevé système.
- **Motion réduit :** Respect universel de `prefers-reduced-motion: reduce`. Le caret natif du terminal est la **seule animation en boucle autorisée** sur le site (CAP-11). Les carets décoratifs doivent être figés visibles.
- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.

### 5. Nuxt 4 Gotchas
- **`<component :is="...">` :** Passer un nom de composant en chaîne de caractères (`:is="'NuxtLink'"`) **ne résout pas** l'auto-import Nuxt. Il faut importer explicitement la référence depuis `#components` (`import { NuxtLink } from "#components"`) et la lier comme valeur.
- **Prerender compatibility :** Le site étant statique, aucun accès direct à `window`, `document` ou `localStorage` n'est toléré en dehors du hook `onMounted` ou d'une garde `import.meta.client`.
- **Génération d'IDs :** Toujours utiliser `useId()` de Nuxt/Vue pour générer des attributs `id` de formulaires hydration-safe.

### 6. Pipeline CI/CD & Déploiement
- Le fichier `public/CNAME` contient **`jouan.ovh`**. Ne jamais le modifier ou le supprimer.
- Le step `Verify static output` dans `.github/workflows/cd.yml` vérifie `grep -qx "jouan.ovh" .output/public/CNAME`. Tout changement de domaine doit être répercuté simultanément sur ces deux fichiers.

---

## 6. Checklist de Validation Qualité (Definition of Done)

Avant de soumettre tout changement ou de clore une tâche, l'agent IA doit exécuter et valider :

1. **Gate Docker verte à 100 % :**
   ```sh
   docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
   ```
   - 0 erreur ESLint / Stylelint.
   - 0 erreur TypeScript vue-tsc.
   - 13 routes pré-rendues statiquement avec succès par Nitro.
2. **Vérification visuelle & comportementale :**
   - Rendu fidèle au Design System (thème sombre aubergine, orange accent, typographie Ubuntu).
   - Navigation clavier fonctionnelle (focus visible, ordre logique).
   - Pas de valeurs CSS en dur non justifiées.

---

## 7. Documents de Référence Complémentaires

- [`docs/project-context.md`](file:///Users/simon/dev/jouan.ovh/docs/project-context.md) : Historique détaillé, leçons apprises par épic et règles fines.
- [`docs/implementation-artifacts/sprint-status.yaml`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml) : Registre officiel des stories et de leur statut.
- [`docs/planning-artifacts/epics.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md) : Cahier des charges et critères d'acceptation des Epics 1 à 10.
- [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md) : Inventaire des arbitrages et améliorations futures optionnelles.

exec
/bin/zsh -lc "wc -l \"docs/specs/spec-home-awwwards/SPEC.md\" && sed -n '1,260p' \"docs/specs/spec-home-awwwards/SPEC.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
      86 docs/specs/spec-home-awwwards/SPEC.md
---
id: SPEC-home-awwwards
companions:
  - sections-mapping.md
  - ../../contexte_malt.md
  - ../../direction_strategique_site.md
  - ../../project-context.md
sources:
  - ../../design_system/ui_kits/jouan-site/Home - Awwwards.html
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)

## Why

Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.

## Capabilities

- id: CAP-1
  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.

- id: CAP-2
  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.

- id: CAP-3
  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.

- id: CAP-4
  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.

- id: CAP-5
  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.

- id: CAP-6
  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).

- id: CAP-7
  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.

- id: CAP-8
  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.

- id: CAP-9
  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.

- id: CAP-10
  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.

## Constraints

- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.

## Non-goals

- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.

## Success signal

- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

exec
/bin/zsh -lc "wc -l \"docs/implementation-artifacts/code-reviews/11-3/full.diff\" && sed -n '1,260p' \"docs/implementation-artifacts/code-reviews/11-3/full.diff\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     310 docs/implementation-artifacts/code-reviews/11-3/full.diff
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
new file mode 100644
index 0000000..a65ef1e
--- /dev/null
+++ b/app/components/home/HomeStackMarquee.vue
@@ -0,0 +1,108 @@
+<template>
+  <div class="marquee" aria-hidden="true">
+    <div class="marquee__track">
+      <!-- Première passe -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
+// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
+import { computed } from "vue";
+import { SITE } from "~/data/site";
+
+const SKILL_LABEL_MAP: Record<string, string> = {
+  typescript: "TypeScript",
+  nuxt: "Nuxt 4",
+  vue: "Vue.js",
+  "nest.js": "NestJS",
+  "node.js": "Node.js",
+  postgresql: "PostgreSQL",
+  typeorm: "TypeORM",
+  stripe: "Stripe Connect",
+  cypress: "Cypress",
+  docker: "Docker",
+  "rest-api": "REST API",
+  vitest: "Vitest",
+};
+
+const skillsList = computed(() => {
+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.marquee {
+  display: block;
+  width: 100%;
+  padding-block: var(--space-5);
+  overflow: hidden;
+  border-block: 1px solid var(--border-subtle);
+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
+
+  &:hover .marquee__track {
+    animation-play-state: paused;
+  }
+}
+
+.marquee__track {
+  display: flex;
+  gap: var(--space-8);
+  width: max-content;
+  will-change: transform;
+  animation: scroll-x 32s linear infinite;
+}
+
+.marquee__item {
+  display: inline-flex;
+  gap: var(--space-8);
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xl);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  white-space: nowrap;
+}
+
+.marquee__label {
+  font-weight: var(--fw-regular);
+  color: var(--text-body);
+}
+
+.marquee__star {
+  color: var(--accent);
+}
+
+@keyframes scroll-x {
+  from {
+    transform: translateX(0);
+  }
+
+  to {
+    transform: translateX(-50%);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .marquee {
+    mask-image: none;
+  }
+
+  .marquee__track {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 07df568..eaedacd 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -44,17 +44,37 @@
       </div>
     </section>
 
-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
+    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
+    <HomeStackMarquee />
+
+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <div class="offer__top">
+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+                <span class="offer__no">{{ service.no }}</span>
+              </div>
               <h3 class="offer__title">{{ service.title }}</h3>
               <p class="offer__desc">{{ service.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in service.points" :key="point">
+                  <ZIcon name="check" class="offer__check" />
+                  <span>{{ point }}</span>
+                </li>
+              </ul>
+              <ul class="hero__tags offer__tags">
+                <li v-for="tag in service.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <div class="offer__price">
+                <span>{{ service.price }}</span>
+              </div>
               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                 En savoir plus →
               </NuxtLink>
@@ -116,29 +136,52 @@ function onBootComplete() {
   isBootFinished.value = true;
 }
 
-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché).
+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+// Remplacement complet des données legacy.
 const services = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
+    id: "creation",
+    no: "01 / 03",
+    icon: "code",
+    title: "Création d'applications web & SaaS",
+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    points: [
+      "Architecture logicielle & APIs REST",
+      "Applications Vue 3 / Nuxt 4 & NestJS",
+      "Intégration Stripe & PostgreSQL",
+    ],
+    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
+    price: "Sur devis / au sprint",
     featured: false,
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
+    id: "fullstack",
+    no: "02 / 03",
+    icon: "layers",
+    title: "Développement Full Stack TypeScript",
+    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
+    points: [
+      "Composants Vue 3 / Nuxt avec TypeScript strict",
+      "Microservices & backend modulaire NestJS",
+      "Fiabilisation et optimisation des performances",
+    ],
+    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
+    price: "Sur devis / TJM",
     featured: true,
   },
   {
-    id: "ia",
+    id: "evolution",
+    no: "03 / 03",
     icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
+    title: "Évolution & Architecture applicative",
+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
+    points: [
+      "Audits techniques de code & migrations de versions",
+      "Tests E2E Cypress & tests unitaires Vitest",
+      "Pipelines CI/CD & conteneurisation Docker",
+    ],
+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
+    price: "Au forfait / audit",
     featured: false,
   },
 ];
@@ -356,13 +399,19 @@ usePageSeo({
   width: 100%;
 }
 
+.offer__top {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  margin-bottom: var(--space-4);
+}
+
 .offer__icon {
   display: flex;
   align-items: center;
   justify-content: center;
   width: var(--space-10); // 40px
   height: var(--space-10);
-  margin-bottom: var(--space-4);
 
   // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
@@ -372,6 +421,13 @@ usePageSeo({
   border-radius: var(--radius-md);
 }
 
+.offer__no {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wider);
+  color: var(--text-faint);
+}
+
 .offer__title {

exec
/bin/zsh -lc "wc -l \"docs/project-context.md\" && sed -n '1,260p' \"docs/project-context.md\"" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     282 docs/project-context.md
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-09-13"
sections_completed: ["technology_stack", "language_framework", "code_quality", "workflow_testing", "critical_rules"]
status: "complete"
optimized_for_llm: true
existing_patterns_found: 12
---

# Project Context for AI Agents

_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Il se concentre sur les détails non évidents que les agents pourraient manquer._

---

## Technology Stack & Versions

> ✅ **Migration de stack terminée (Epic 1).** Les versions ci-dessous sont l'état
> ACTUEL, post-migration. `@nuxt/bridge-edge` a été abandonné ; le code applicatif
> vit désormais sous `app/` (structure Nuxt 4 par défaut, `srcDir = "app"`).

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
- **Langage :** TypeScript `^6.0.3`.
- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
- **Déploiement :** site statique (`nuxi generate`) → publication vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME` = `jouan.ovh`). ✅ La chaîne CI de déploiement est **prouvée en réel** sur `main` (Story 10.7), avec 13 routes pré-rendues, HTTPS Let's Encrypt forcé et DNS OVH opérationnel.
- **Divers :** `ua-parser-js ^2` (détection device, terminal).

## Critical Implementation Rules

### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)

**TypeScript / Vue**

- Préférer `<script setup lang="ts">` pour tout NOUVEAU composant. Le sous-système
  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
  décision rétro Epic 7). **Reste un seul résidu Options API** (`defineComponent`,
  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
  pas l'étendre ; le migrer vers `<script setup>` lors d'une refonte du header
  (cleanup optionnel, non planifié).
- `vue-property-decorator` et l'option `experimentalDecorators` ont été retirés
  (Epic 3) : plus aucun décorateur de classe, ne pas en réintroduire.
- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).

**Nuxt**

- Cible de build = site **STATIQUE** (`nuxi generate`) → tout code doit être
  compatible prerender : pas d'accès `window`/`document` hors `onMounted` ou
  garde `import.meta.client`.
- Pages dans `app/pages/`, layout `app/layouts/default.vue`, auto-import des
  composants activé (pas d'import manuel pour la plupart).
- **Primitives DS sous `app/components/ui/` auto-importées SANS préfixe de dossier**
  (`<ZButton>`, pas `<UiZButton>`) via `components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"]`.
  Le reste de `components/` garde le scan par défaut.
- ⚠️ **Piège `<component :is>` :** un nom de composant passé en _string_
  (`<component :is="'NuxtLink'">`) **ne résout pas** l'auto-import. Importer la
  référence depuis `#components` (`import { NuxtLink } from "#components"`) et la
  passer comme valeur. (Régression rencontrée en story 2.8.)
- Images TOUJOURS via `<NuxtImg>` / `<NuxtPicture>` (@nuxt/image), jamais
  `<img>` brut. Assets statiques dans `public/images/`.
- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
  `app/pages/blog/index.vue`, article `app/pages/blog/[...slug].vue`. Collections **typées
  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
  `tags`, `read`, `image`). Requêtes via `queryCollection("blog")…` dans `useAsyncData`
  (prerender-safe) ; rendu article via `<ContentRenderer>`. **Coloration Shiki désactivée**
  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
  ne pas réactiver sans surcharge (sinon styles inline par token écrasant le DS).
- **Formulaire `/contact` (Epic 7)** : envoi via **Web3Forms** (tiers _sans serveur_, site
  reste statique), clé via `runtimeConfig.public.web3formsAccessKey` (env
  `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, cf. `.env.example`). ⚠️ **Sans la clé, l'envoi échoue** —
  la provisionner en env. `$fetch` **client-only** (prerender-safe) + honeypot anti-spam ;
  validation/feedback front. Notice RGPD sous le form + page politique de confidentialité dédiée
  (`/confidentialite`, livrée en story 10.6).

**SCSS (règle critique)**

- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
  sont exposés sur `:root` par `app/assets/scss/abstract/_root.scss` — source unique
  de vérité (couleurs, typo, espacement, rayons, élévation, motion).
- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
  palette syntaxe), commenter explicitement la dérogation.
- **Primitives de layout GLOBALES** : `.section` / `.section--sunken` / `.container` /
  `.eyebrow` (+ `.eyebrow--muted`) / `.prose` / `.hero__tags` vivent dans
  `app/assets/scss/base/_layout.scss` (chargé par `main.scss`). **Les consommer, ne PAS
  les redéclarer en `<style scoped>` par page** (sinon duplication divergente). Si un
  modifieur DS manque, l'ajouter au partiel global, pas en local. (Convention extraite
  en story 5.1 après duplication scoped dans index/services/about.)
- Legacy : certains composants déclarent encore des CSS props locales à partir des
  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
- Styles dans `<style lang="scss" scoped>` par composant. Exceptions Stylelint
  (`:deep`/`:slotted`/`:global`) en `/* stylelint-disable */` **inline et commenté**,
  pas en config globale.

### Qualité de code & conventions

**Lint / format**

- ESLint + Prettier : double quotes, points-virgules, `max-len: 120`.
  `prefer-const` en erreur. Stylelint + `stylelint-scss` pour le SCSS.
- `no-console` / `no-debugger` : warning en production uniquement.

**Conventions de nommage**

- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`) — `<script setup>`,
  auto-importées sans préfixe de dossier.
- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
  `ZCardComponent` monolithique a été supprimé en story 2.4.)
- Composants applicatifs legacy : PascalCase suffixé `Component`
  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
- Sous-système terminal sous `components/terminal/` : coquilles Vue
  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
  contrats (`I*` + barrel `index.ts`).
- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
  (ex. `@use "...color" as _color`).

**Organisation**

- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
  `public/images/` ou `assets/` lors de l'implémentation.
- **Contenu partagé, URLs & SEO :**
  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_

**Langue**

- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
  vouvoiement. Pas d'emoji (cf. guidelines du design system).

### Workflow de développement

**Git**

- Branche principale : `main`. Intégration : `develop`. Travail par branches de
  feature (ex. refonte en cours : `feat/design-system-revamp`).
- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).

**Environnement de dev : Docker (obligatoire)**

- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
- Commande ponctuelle (lint, typecheck, generate…) :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Stopper : `docker compose down`.

**Build & déploiement**

- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@11.8.0`, lockfile
  `pnpm-lock.yaml`). **Ne JAMAIS utiliser `npm`/`yarn`.**
- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
  « Environnement de dev »), jamais directement sur l'hôte :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
- Build statique : `pnpm generate` → sortie `.output/public`.
- Déploiement : automatisé par GitHub Actions (`.github/workflows/cd.yml` via `peaceiris/actions-gh-pages` sur push `main`). Sortie statique avec `CNAME` vérifié.
- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).

### Tests

- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
- Si des tests sont introduits pendant la migration, documenter la convention ici.

### Règles critiques à ne pas manquer

**Port du design system (React/CSS → Vue/SCSS)**

- Le design system source (`docs/design_system/`) est en **React + CSS custom
  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.

**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**

- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
  les traiter en amont (checklist pré-revue dans la consigne de story).
- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).

**À préserver pendant la refonte**

- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
  easter-egg à conserver — le design system la garde comme feature secondaire.
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
  orange Ubuntu comme unique accent héros.
- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
  terminal.

**Pièges**

- Compatibilité prerender (site statique) : tout accès DOM doit être gardé ;
  IDs déterministes via `useId()` (pas d'aléatoire qui casse l'hydration).
- Ne pas casser `CNAME` / le déploiement gh-pages.
- `<component :is="...">` : passer une référence importée, jamais un nom en string
  (cf. règles Nuxt).
- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
  layout cohabitent sur le même élément (typiquement `.container` + wrapper de
  section, ex. `.hero__in.container`), **ne pas** styler le `padding` en shorthand
  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
  effaçait le vertical de `.hero__in`). Utiliser les **longhands** `padding-inline` /
  `padding-block`, qui composent sans conflit quel que soit l'ordre. (Régression de
  padding du hero, story 3.1 — invisible à la revue de code, attrapée à l'œil.)
- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
  dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **invalide la
  base de contenu** du dev (volume partagé) → `/blog` tombe en erreur. Correctif :
  `docker compose restart web` réindexe le contenu. Sans impact sur le build lui-même.
- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
  est aveugle aux régressions de rendu. Réfs par page :
  - **Home** → `docs/animations_jouan.ovh/Home animée.dc.html` + screenshots
    `docs/animations_jouan.ovh/screenshots/` (`hero*.png`, `services.png`, `booted.png`).
  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
    (UI kit cible ; ouvrir la section correspondante).
  - Routine appliquée sans faille sur Epics 4-8 (desktop + mobile) → zéro régression de

exec
/bin/zsh -lc "sed -n '1,180p' docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: edfab0ecf3859790926fdae447ce7256a2f03565
---

# Story 11.3: Marquee de stack moderne & Vitrine des 3 services cibles

Status: review

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

exec
/bin/zsh -lc "rg -n -C 4 'SITE\\.skills|skills|services|legacy|WordPress|hardcod|tokens|prefers-reduced-motion|aria-hidden|lists|ZCard' docs/project-context.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n -C 5 'FR21|FR22|FR26|CAP-4|CAP-5|CAP-9|marquee|service|offre|stack' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
22-
23-- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
24-- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
25-- **Langage :** TypeScript `^6.0.3`.
26:- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
27-- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
28-- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
29-- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
30-- **Déploiement :** site statique (`nuxi generate`) → publication vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME` = `jouan.ovh`). ✅ La chaîne CI de déploiement est **prouvée en réel** sur `main` (Story 10.7), avec 13 routes pré-rendues, HTTPS Let's Encrypt forcé et DNS OVH opérationnel.
--
78-
79-**SCSS (règle critique)**
80-
81-- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
82:- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
83:  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
84-  sont exposés sur `:root` par `app/assets/scss/abstract/_root.scss` — source unique
85-  de vérité (couleurs, typo, espacement, rayons, élévation, motion).
86-- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
87-  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
--
90-  `.eyebrow` (+ `.eyebrow--muted`) / `.prose` / `.hero__tags` vivent dans
91-  `app/assets/scss/base/_layout.scss` (chargé par `main.scss`). **Les consommer, ne PAS
92-  les redéclarer en `<style scoped>` par page** (sinon duplication divergente). Si un
93-  modifieur DS manque, l'ajouter au partiel global, pas en local. (Convention extraite
94:  en story 5.1 après duplication scoped dans index/services/about.)
95-- Legacy : certains composants déclarent encore des CSS props locales à partir des
96:  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
97-  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
98-- Styles dans `<style lang="scss" scoped>` par composant. Exceptions Stylelint
99-  (`:deep`/`:slotted`/`:global`) en `/* stylelint-disable */` **inline et commenté**,
100-  pas en config globale.
--
109-
110-**Conventions de nommage**
111-
112-- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
113:  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`) — `<script setup>`,
114-  auto-importées sans préfixe de dossier.
115:- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
116:  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
117:  `ZCardComponent` monolithique a été supprimé en story 2.4.)
118:- Composants applicatifs legacy : PascalCase suffixé `Component`
119-  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
120-- Sous-système terminal sous `components/terminal/` : coquilles Vue
121-  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
122-  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
--
125-  (ex. `@use "...color" as _color`).
126-
127-**Organisation**
128-
129:- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
130-  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
131-- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
132-  `public/images/` ou `assets/` lors de l'implémentation.
133-- **Contenu partagé, URLs & SEO :**
134:  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
135:  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
136-  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_
137-
138-**Langue**
139-
--
185-**Port du design system (React/CSS → Vue/SCSS)**
186-
187-- Le design system source (`docs/design_system/`) est en **React + CSS custom
188-  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
189:  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
190:- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
191:  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
192-  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
193-- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
194-  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
195-
--
198-- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
199-  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
200-  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
201-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
202:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
203-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
204-- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
205-  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
206-  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
--
210-  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
211-- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
212-  les traiter en amont (checklist pré-revue dans la consigne de story).
213-- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
214:  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
215-  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
216:  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
217:  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
218-  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
219-  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).
220-
221-**À préserver pendant la refonte**
--
223-- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
224-  easter-egg à conserver — le design system la garde comme feature secondaire.
225-- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
226-  orange Ubuntu comme unique accent héros.
227:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
228-  terminal.
229-
230-**Pièges**
231-
--
253-  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
254-  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
255-  est aveugle aux régressions de rendu. Réfs par page :
256-  - **Home** → `docs/animations_jouan.ovh/Home animée.dc.html` + screenshots
257:    `docs/animations_jouan.ovh/screenshots/` (`hero*.png`, `services.png`, `booted.png`).
258-  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
259-    (UI kit cible ; ouvrir la section correspondante).
260-  - Routine appliquée sans faille sur Epics 4-8 (desktop + mobile) → zéro régression de
261-    rendu ; elle a corrigé un défaut de la maquette (centrage timeline `kit.css`, 5.2),
262-    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
263-    (diff visuel **et comportemental** avant/après, Epic 8). Sur les passes transverses a11y/motion (Epics 9 & 10) :
264:    vérification du comportement clavier/motion/contraste sous émulation `forced-colors: active` et `prefers-reduced-motion: reduce`.
265-
266----
267-
268-## Usage Guidelines

 succeeded in 0ms:
14-# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)
15-
16-## Why
17-
18-Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
19:Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
20-1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
21-2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
22:3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.
23-
24-## Capabilities
25-
26-- id: CAP-1
27-  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
--
31-  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
32-  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
33-
34-- id: CAP-3
35-  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
36:  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
37-
38:- id: CAP-4
39:  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
41-
42:- id: CAP-5
43:  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
44:  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
45-
46-- id: CAP-6
47-  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
48:  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
49-
50-- id: CAP-7
51-  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
53-
54-- id: CAP-8
55-  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
56:  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
57-
58:- id: CAP-9
59-  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
60:  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
61-
62-- id: CAP-10
63-  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
64-  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
65-
--
67-
68-- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
69-- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
70-- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
71-- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
72:- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
73:- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
74-- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
75-
76-## Non-goals
77-
78-- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
79:- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
80-- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
81-- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
82-- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
83-
84-## Success signal

exec
/bin/zsh -lc "rg -n -C 8 'Story 11\\.3|FR21|FR22|FR26|CAP-4|CAP-5|CAP-9' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
26-
27-## Requirements Inventory
28-
29-### Functional Requirements
30-
31-FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
32-FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
33-FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
34:FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
35:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
36-FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
37-FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
38-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
39:FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
40-FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
41-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
42-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
43-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
44-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
45-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
46-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
47-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
48-
49-#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
50-FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
51-FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
52-FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
53:FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
54:FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
57-FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
58:FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
59-FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
60-
61-### NonFunctional Requirements
62-
63-NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
64-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
65-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
66-NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
--
129-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
130-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
131-FR15: Epic 10 — SEO centralisé site-wide
132-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
133-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
134-FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
135-FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
136-FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
137:FR21: Epic 11 — Marquee infini de la stack moderne ciblée
138:FR22: Epic 11 — Vitrine des 3 offres de services ciblées
139-FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
140-FR24: Epic 11 — Vitrine des articles récents du blog
141-FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
142:FR26: Epic 11 — Préservation de l'architecture multi-pages
143-FR27: Epic 11 — Micro-curseur interactif progressif desktop
144-
145-## Epic List
146-
147-### Epic 1: Migration de la stack vers Nuxt 4
148-Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
149-**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_
150-
--
181-**FRs covered:** FR11 _(UX-DR17)_
182-
183-### Epic 10: Fin de refonte
184-La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
185-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
186-
187-### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
188-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
189:**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
190-
191----
192-
193-## Epic 1: Migration de la stack vers Nuxt 4
194-
195-Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
196-
197-### Story 1.1: Migrer le cœur vers Nuxt 4
--
735-**And** le Hero commercial affiche en typographie Ubuntu :
736-  - Sur-titre `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
737-  - Titre principal `Développeur Full Stack TypeScript`
738-  - Sous-titre orienté création et évolution d'applications web et SaaS (Nuxt, NestJS, PostgreSQL)
739-  - Badge de statut de disponibilité vérifié avec puce pulsée et lien externe vers le profil Malt (`<ZExternalLink>`)
740-  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
741-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
742-
743:### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés
744-
745-As a visiteur explorant la page d'accueil,
746-I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
747:So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).
748-
749-**Acceptance Criteria:**
750-
751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
752-**When** on intègre le composant `StackMarquee` et la section des 3 services phares
753-**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
754-**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
755-**And** chaque carte oriente directement vers la route `/services` (aucune ancre intra-page `#`)

exec
/bin/zsh -lc "sed -n '1,360p' docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
new file mode 100644
index 0000000..a65ef1e
--- /dev/null
+++ b/app/components/home/HomeStackMarquee.vue
@@ -0,0 +1,108 @@
+<template>
+  <div class="marquee" aria-hidden="true">
+    <div class="marquee__track">
+      <!-- Première passe -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
+        <b class="marquee__label">{{ skill }}</b>
+        <span class="marquee__star" aria-hidden="true">✦</span>
+      </span>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
+// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
+import { computed } from "vue";
+import { SITE } from "~/data/site";
+
+const SKILL_LABEL_MAP: Record<string, string> = {
+  typescript: "TypeScript",
+  nuxt: "Nuxt 4",
+  vue: "Vue.js",
+  "nest.js": "NestJS",
+  "node.js": "Node.js",
+  postgresql: "PostgreSQL",
+  typeorm: "TypeORM",
+  stripe: "Stripe Connect",
+  cypress: "Cypress",
+  docker: "Docker",
+  "rest-api": "REST API",
+  vitest: "Vitest",
+};
+
+const skillsList = computed(() => {
+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.marquee {
+  display: block;
+  width: 100%;
+  padding-block: var(--space-5);
+  overflow: hidden;
+  border-block: 1px solid var(--border-subtle);
+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
+
+  &:hover .marquee__track {
+    animation-play-state: paused;
+  }
+}
+
+.marquee__track {
+  display: flex;
+  gap: var(--space-8);
+  width: max-content;
+  will-change: transform;
+  animation: scroll-x 32s linear infinite;
+}
+
+.marquee__item {
+  display: inline-flex;
+  gap: var(--space-8);
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xl);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+  white-space: nowrap;
+}
+
+.marquee__label {
+  font-weight: var(--fw-regular);
+  color: var(--text-body);
+}
+
+.marquee__star {
+  color: var(--accent);
+}
+
+@keyframes scroll-x {
+  from {
+    transform: translateX(0);
+  }
+
+  to {
+    transform: translateX(-50%);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .marquee {
+    mask-image: none;
+  }
+
+  .marquee__track {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 07df568..eaedacd 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -44,17 +44,37 @@
       </div>
     </section>
 
-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
+    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
+    <HomeStackMarquee />
+
+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
     <section class="section">
       <div class="container">
-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <div class="offer__top">
+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+                <span class="offer__no">{{ service.no }}</span>
+              </div>
               <h3 class="offer__title">{{ service.title }}</h3>
               <p class="offer__desc">{{ service.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in service.points" :key="point">
+                  <ZIcon name="check" class="offer__check" />
+                  <span>{{ point }}</span>
+                </li>
+              </ul>
+              <ul class="hero__tags offer__tags">
+                <li v-for="tag in service.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <div class="offer__price">
+                <span>{{ service.price }}</span>
+              </div>
               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                 En savoir plus →
               </NuxtLink>
@@ -116,29 +136,52 @@ function onBootComplete() {
   isBootFinished.value = true;
 }
 
-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché).
+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+// Remplacement complet des données legacy.
 const services = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
+    id: "creation",
+    no: "01 / 03",
+    icon: "code",
+    title: "Création d'applications web & SaaS",
+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    points: [
+      "Architecture logicielle & APIs REST",
+      "Applications Vue 3 / Nuxt 4 & NestJS",
+      "Intégration Stripe & PostgreSQL",
+    ],
+    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
+    price: "Sur devis / au sprint",
     featured: false,
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
+    id: "fullstack",
+    no: "02 / 03",
+    icon: "layers",
+    title: "Développement Full Stack TypeScript",
+    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
+    points: [
+      "Composants Vue 3 / Nuxt avec TypeScript strict",
+      "Microservices & backend modulaire NestJS",
+      "Fiabilisation et optimisation des performances",
+    ],
+    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
+    price: "Sur devis / TJM",
     featured: true,
   },
   {
-    id: "ia",
+    id: "evolution",
+    no: "03 / 03",
     icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
+    title: "Évolution & Architecture applicative",
+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
+    points: [
+      "Audits techniques de code & migrations de versions",
+      "Tests E2E Cypress & tests unitaires Vitest",
+      "Pipelines CI/CD & conteneurisation Docker",
+    ],
+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
+    price: "Au forfait / audit",
     featured: false,
   },
 ];
@@ -356,13 +399,19 @@ usePageSeo({
   width: 100%;
 }
 
+.offer__top {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  margin-bottom: var(--space-4);
+}
+
 .offer__icon {
   display: flex;
   align-items: center;
   justify-content: center;
   width: var(--space-10); // 40px
   height: var(--space-10);
-  margin-bottom: var(--space-4);
 
   // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
@@ -372,6 +421,13 @@ usePageSeo({
   border-radius: var(--radius-md);
 }
 
+.offer__no {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wider);
+  color: var(--text-faint);
+}
+
 .offer__title {
   margin-bottom: var(--space-2);
   font-family: var(--font-mono);
@@ -388,8 +444,46 @@ usePageSeo({
   color: var(--text-body);
 }
 
-.offer__more {
+.offer__points {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-2);
+  margin: 0 0 var(--space-4);
+  padding: 0;
+  list-style: none;
+
+  li {
+    display: flex;
+    gap: var(--space-2);
+    align-items: flex-start;
+    font-family: var(--font-mono);
+    font-size: var(--fs-xs);
+    line-height: var(--lh-normal);
+    color: var(--text-muted);
+  }
+}
+
+.offer__check {
+  font-size: var(--fs-sm);
+  color: var(--term-green);
+  margin-top: 2px;
+}
+
+.offer__tags {
+  margin-bottom: var(--space-4);
+}
+
+.offer__price {
   margin-top: auto;
+  padding-top: var(--space-4);
+  border-top: 1px dashed var(--border-subtle);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--accent);
+}
+
+.offer__more {
+  margin-top: var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
   color: var(--accent);

codex
Le diff couvre bien les deux fichiers annoncés. Je vérifie maintenant les détails susceptibles de constituer de vrais écarts — notamment la source exacte de `SITE.skills`, la sémantique/accessibilité des cartes et les règles de tokens CSS — avant de distinguer les défauts des simples choix d’implémentation.
exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
id: SPEC-home-awwwards
companions:
  - sections-mapping.md
  - ../../contexte_malt.md
  - ../../direction_strategique_site.md
  - ../../project-context.md
sources:
  - ../../design_system/ui_kits/jouan-site/Home - Awwwards.html
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)

## Why

Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.

## Capabilities

- id: CAP-1
  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.

- id: CAP-2
  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.

- id: CAP-3
  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.

- id: CAP-4
  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.

- id: CAP-5
  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.

- id: CAP-6
  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).

- id: CAP-7
  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.

- id: CAP-8
  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.

- id: CAP-9
  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.

- id: CAP-10
  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.

## Constraints

- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.

## Non-goals

- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.

## Success signal

- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

exec
/bin/zsh -lc "rg -n -C 10 'FR21|FR22|FR26|CAP-4|CAP-5|CAP-9|marquee|services|offres|stack|reduced-motion|SITE\\.skills' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
9-  - ../../design_system/ui_kits/jouan-site/Home - Awwwards.html
10----
11-
12-> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.
13-
14-# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)
15-
16-## Why
17-
18-Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
19:Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
20-1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
21-2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
22:3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.
23-
24-## Capabilities
25-
26-- id: CAP-1
27-  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
28:  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
29-
30-- id: CAP-2
31-  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
32:  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
33-
34-- id: CAP-3
35-  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
36:  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
37-
38:- id: CAP-4
39:  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
41-
42:- id: CAP-5
43:  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
44:  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
45-
46-- id: CAP-6
47-  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
48:  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
49-
50-- id: CAP-7
51-  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
53-
54-- id: CAP-8
55-  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
56-  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
57-
58:- id: CAP-9
59-  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
60:  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
61-
62-- id: CAP-10
63-  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
64-  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
65-
66-## Constraints
67-
68-- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
69:- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
70-- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
71-- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
72:- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
73:- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
74-- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
75-
76-## Non-goals
77-
78-- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
79:- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
80-- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
81-- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
82-- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
83-
84-## Success signal
85-
86-- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, le contenu est le héros.
// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Hover lift + bordure plus claire. @default false */
  interactive?: boolean;
  /** Barre d'accent orange→aubergine en haut. @default false */
  accent?: boolean;
  /** Anneau de glow orange (offre mise en avant). @default false */
  featured?: boolean;
  /** Padding interne `--space-6`. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
});

const attrs = useAttrs();
// `as` accepte une balise native ("div", "article") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const rootAttrs = computed(() => {
  if (!isNativeButton.value) {
    return attrs;
  }

  return {
    ...attrs,
    type: typeof attrs.type === "string" ? attrs.type : "button",
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
.zcard {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2), var(--shadow-hairline);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-standard);
}

.zcard--pad {
  padding: var(--space-6);
}

.zcard--interactive {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-3), var(--shadow-hairline);
  }

  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
  // aucun indicateur. Sans effet sur les cartes non focusables (div).
  &:focus-visible {
    // Outline transparent → rendu en couleur système sous forced-colors (où les
    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.zcard--accent::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
}

.zcard--featured {
  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>

exec
/bin/zsh -lc "sed -n '187,245p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_

---

## Epic 1: Migration de la stack vers Nuxt 4

Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).

### Story 1.1: Migrer le cœur vers Nuxt 4

As a mainteneur du site,
I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
So that le site repose sur une base moderne et supportée.

**Acceptance Criteria:**

**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé

### Story 1.2: Mettre à jour les modules et dépendances

As a mainteneur du site,
I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
So that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.

**Acceptance Criteria:**

**Given** les versions héritées dans `package.json`
**When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable
**Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>`/`<nuxt-picture>`) fonctionnent
**And** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation)

### Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)

As a mainteneur du site,
I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
So that le lint reste la barre de qualité après la montée de version.

**Acceptance Criteria:**

**Given** la config `.eslintrc.js` historique
**When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4
**Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration
**And** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`)

### Story 1.4: Valider build statique et déploiement gh-pages

As a mainteneur du site,
I want valider `yarn generate` et le déploiement gh-pages après migration,
So that la chaîne de production est verte avant d'entamer la refonte.

**Acceptance Criteria:**

**Given** la stack migrée
**When** on lance `yarn generate`

exec
/bin/zsh -lc "sed -n '1,220p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
// les composants/programmes ne font que les présenter). Forme portée de
// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
//
// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
//
// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
// `deferred-work.md`, pas un simple refactor.

export interface IProfile {
  name: string;
  role: string;
  email: string;
  city: string;
  available: boolean;
  maltUrl?: string;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url?: string;
  status?: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
  email: "simon@jouan.ovh",
  city: "Rouen, France",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "nuxt",
  "vue",
  "nest.js",
  "node.js",
  "postgresql",
  "typeorm",
  "stripe",
  "cypress",
  "docker",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "En production",
    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "Étude de cas (MVP livré)",
    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
  },
  {
    name: "Nodium",
    role: "Créateur & Ingénieur IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "R&D / En cours",
    tags: ["typescript", "electron", "agents", "ia"],
  },
];

export const SITE = { profile, skills, projects } as const;

exec
/bin/zsh -lc "sed -n '1,160p' app/components/ui/ZIcon.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <!-- eslint-disable vue/no-v-html -->
  <svg
    class="zicon"
    :viewBox="def.box"
    :fill="def.fill ? 'currentColor' : 'none'"
    :stroke="def.fill ? undefined : 'currentColor'"
    :stroke-width="def.fill ? undefined : 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    v-html="def.body"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
// Système d'icônes du DS — SVG inline, `currentColor` (héritent de la couleur du texte),
// taille en `em`. Choix prerender-safe : set inline (pas de script Lucide CDN qui muterait
// le DOM client et laisserait un trou au `nuxi generate`). Aucune police d'icône (AC #2).
// Icônes au trait = style Lucide ; glyphes de marque (github/twitter/linkedin/wp) + logo
// diamant (gem) = fill. Porté de docs/design_system/ui_kits/jouan-site/icons.jsx.
// Le `v-html` du template injecte uniquement ces chaînes internes statiques.
import { computed } from "vue";

type IconDef = { box: string; fill: boolean; body: string };

// Icônes au trait (viewBox 24, stroke currentColor).
const STROKE: Record<string, string> = {
  arrow: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M2 14h2M20 14h2"/>',
  spark:
    '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
};

// Glyphes de marque (fill currentColor). viewBox 16 pour les réseaux, 24 pour wp/gem.
const GITHUB =
  '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>';
const TWITTER =
  '<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>';
const LINKEDIN =
  '<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>';
const WP =
  '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.5a8.5 8.5 0 0 1 4.9 1.55h-.34c-.62 0-1.06.54-1.06 1.12 0 .52.3.96.62 1.48.24.42.52.96.52 1.74 0 .54-.2 1.18-.48 2.06l-.64 2.12-2.3-6.84c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.62 0-1.66-.08-1.66-.08-.34-.02-.38.5-.04.52 0 0 .32.04.66.06l.96 2.62-1.34 4.02L7.2 7.34c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.12 0-.26 0-.4-.01A8.5 8.5 0 0 1 12 3.5zM3.6 8.7l3.7 10.16A8.5 8.5 0 0 1 3.6 8.7zm8.76 3.18 2.34 6.4c.02.04.04.08.06.1a8.5 8.5 0 0 1-5.04.16l2.64-6.66zm5.96-3.4a8.5 8.5 0 0 1-2.16 9.42l2.58-7.46c.24-.6.4-1.18.48-1.7l.06.04c.24.46.42 1.02.42 1.64 0 .8-.16 1.7-.62 2.86z"/>';

// Logo diamant (gem) : carré pivoté en currentColor + facette haute éclairée
// (overlay blanc très léger, esprit "lit from above" du logo de marque).
const GEM =
  '<path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/>' +
  '<path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/>';

const ICONS: Record<string, IconDef> = {
  ...Object.fromEntries(Object.entries(STROKE).map(([k, body]) => [k, { box: "0 0 24 24", fill: false, body }])),
  github: { box: "0 0 16 16", fill: true, body: GITHUB },
  x: { box: "0 0 16 16", fill: true, body: TWITTER },
  twitter: { box: "0 0 16 16", fill: true, body: TWITTER },
  linkedin: { box: "0 0 16 16", fill: true, body: LINKEDIN },
  wp: { box: "0 0 24 24", fill: true, body: WP },
  gem: { box: "0 0 24 24", fill: true, body: GEM },
};

const EMPTY: IconDef = { box: "0 0 24 24", fill: false, body: "" };

interface Props {
  /** Nom de l'icône dans le set (arrow, terminal, github, gem…). */
  name: string;
  /** Libellé accessible : si fourni, l'icône devient `role="img"` ; sinon décorative (`aria-hidden`). */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
});

const def = computed<IconDef>(() => ICONS[props.name] ?? EMPTY);
</script>

<style scoped>
.zicon {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>

exec
/bin/zsh -lc "sed -n '1,520p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="home">
    <ClientOnly>
      <HomeBootOverlay @boot-complete="onBootComplete" />
    </ClientOnly>
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
            <p class="hero__sub">
              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour missions freelance</span>
              <template v-if="SITE.profile.maltUrl">
                <span aria-hidden="true"> · </span>
                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
              </template>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Discuter de votre projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
          </div>
        </div>
      </div>
    </section>

    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
    <HomeStackMarquee />

    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
              <div class="offer__top">
                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
                <span class="offer__no">{{ service.no }}</span>
              </div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in service.points" :key="point">
                  <ZIcon name="check" class="offer__check" />
                  <span>{{ point }}</span>
                </li>
              </ul>
              <ul class="hero__tags offer__tags">
                <li v-for="tag in service.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
              <div class="offer__price">
                <span>{{ service.price }}</span>
              </div>
              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                En savoir plus →
              </NuxtLink>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="statrow">
          <div v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
        <ul class="grid-2 projects">
          <li v-for="project in projects" :key="project.name">
            <ZCard
              class="project"
              :interactive="Boolean(project.url)"
              :data-hot="Boolean(project.url) ? '' : undefined"
              :as="project.url ? ZExternalLink : 'div'"
              :href="project.url || undefined"
              :rel="project.url ? 'noopener noreferrer' : undefined"
            >
              <div class="project__head">
                <h3 class="project__name">{{ project.name }}</h3>
                <span class="project__role">{{ project.role }}</span>
              </div>
              <p class="prose project__desc">{{ project.desc }}</p>
              <ul class="hero__tags">
                <li v-for="tag in project.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);

function onBootComplete() {
  isBootFinished.value = true;
}

// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
// Remplacement complet des données legacy.
const services = [
  {
    id: "creation",
    no: "01 / 03",
    icon: "code",
    title: "Création d'applications web & SaaS",
    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
    points: [
      "Architecture logicielle & APIs REST",
      "Applications Vue 3 / Nuxt 4 & NestJS",
      "Intégration Stripe & PostgreSQL",
    ],
    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
    price: "Sur devis / au sprint",
    featured: false,
  },
  {
    id: "fullstack",
    no: "02 / 03",
    icon: "layers",
    title: "Développement Full Stack TypeScript",
    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
    points: [
      "Composants Vue 3 / Nuxt avec TypeScript strict",
      "Microservices & backend modulaire NestJS",
      "Fiabilisation et optimisation des performances",
    ],
    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
    price: "Sur devis / TJM",
    featured: true,
  },
  {
    id: "evolution",
    no: "03 / 03",
    icon: "spark",
    title: "Évolution & Architecture applicative",
    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
    points: [
      "Audits techniques de code & migrations de versions",
      "Tests E2E Cypress & tests unitaires Vitest",
      "Pipelines CI/CD & conteneurisation Docker",
    ],
    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
    price: "Au forfait / audit",
    featured: false,
  },
];

// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
const stats = [
  { id: "stat-1", value: "8+", label: "ans dans la tech" },
  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
];

// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
const projects = SITE.projects;

const siteUrl = useSiteUrl();
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simon Jouan — Développeur Full Stack TypeScript",
    url: siteUrl,
    description: SITE.profile.role,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.profile.name,
    jobTitle: SITE.profile.role,
    url: siteUrl,
    image: `${siteUrl}/images/portrait.jpeg`,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
];

usePageSeo({
  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
  description:
    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
  path: "/",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: homeJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
.home {
  display: block;
}

// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
.anim {
  animation: fade-rise var(--dur-slow) var(--ease-out) both;
}

.hero__term-col {
  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
  animation-delay: 80ms;
}

// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
.hero {
  position: relative;
  overflow: hidden;
}

.hero__grad {
  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
  background:
    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(
      700px 500px at 0% 110%,
      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
      transparent 60%
    ),
    var(--bg-page);
}

.hero__in {
  position: relative;
  z-index: 1;

  // padding-block uniquement : le gutter horizontal vient de .container
  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
  padding-block: var(--space-20);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-12);
  align-items: center;
}

// .section / .container / .eyebrow / .prose : primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- Colonne texte ----
.hero__title {
  font-family: var(--font-mono);
  font-size: var(--fs-6xl);
  font-weight: var(--fw-light);
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);

  em {
    font-style: normal;
    color: var(--accent);
  }
}

.hero__sub {
  max-width: 46ch;
  margin: var(--space-5) 0 var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

// ---- Badge de disponibilité & CTAs ----
.hero__badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  a {
    color: var(--accent);
    text-decoration: underline;

    &:hover {
      color: var(--accent-hover);
    }

    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: var(--ring-accent);
    }
  }
}

.hero__pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: var(--success);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  animation: pulse-dot 2.2s infinite var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  }

  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
  }
}

.section__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

// ---- Aperçu services (porté de .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__no {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  color: var(--text-faint);
}

.offer__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.offer__desc {
  margin: 0 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__points {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    line-height: var(--lh-normal);
    color: var(--text-muted);
  }
}

.offer__check {
  font-size: var(--fs-sm);
  color: var(--term-green);
  margin-top: 2px;
}

.offer__tags {
  margin-bottom: var(--space-4);
}

.offer__price {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--accent);
}

.offer__more {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    // Outline transparent : rendu en couleur système sous forced-colors.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

// ---- Stats (porté de .statrow / .stat) ----
.statrow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);

  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
  margin-bottom: var(--space-12);
}

.stat {
  font-family: var(--font-mono);

  b {
    display: block;
    font-size: var(--fs-4xl);

2026-09-13T18:51:42.410164Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '1,130p' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Tokens du design system — SOURCE DE VÉRITÉ du style
//  Porté depuis docs/design_system/tokens/*.css (dark-first,
//  héritage Ubuntu/terminal : orange + aubergine).
//
//  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
//  motion ne doit être hardcodée dans un composant. Tout passe
//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
//
//  Les valeurs sont reproduites à l'identique des tokens source
//  (notation couleur normalisée par Stylelint : hsl angle/%).
// ============================================================

:root {
  // ---- Brand : Ubuntu orange (accent primaire) ----
  --orange-50: hsl(24deg 100% 96%);
  --orange-100: hsl(25deg 100% 92%);
  --orange-300: hsl(24deg 100% 75%);
  --orange-500: hsl(24deg 94% 53%); // accent héros
  --orange-600: hsl(24deg 100% 47%);
  --orange-700: hsl(24deg 100% 37%);
  --orange-900: hsl(15deg 60% 17%);

  // ---- Brand : Aubergine (violet Ubuntu) ----
  --aubergine-light: hsl(319deg 26% 70%);
  --aubergine: hsl(319deg 33% 30%);
  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
  --aubergine-deep: hsl(319deg 100% 9%); // corps terminal
  --aubergine-black: hsl(320deg 60% 5%);

  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
  --surface-1: hsl(319deg 22% 9%); // sections en creux
  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
  --surface-4: hsl(316deg 14% 21%); // popovers, inputs

  // ---- Bordures / hairlines ----
  --line-subtle: hsl(316deg 14% 18%);
  --line: hsl(315deg 12% 25%);
  --line-strong: hsl(314deg 11% 34%);

  // ---- Texte (off-whites chauds sur fond sombre) ----
  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
  --ink-2: hsl(28deg 10% 74%); // corps
  --ink-3: hsl(25deg 7% 54%); // discret / légendes
  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange

  // ---- Palette terminale / syntaxe ----
  --term-green: hsl(143deg 60% 52%); // prompt, succès
  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
  --term-cyan: hsl(186deg 64% 56%);
  --term-red: hsl(0deg 85% 64%);
  --term-yellow: hsl(48deg 90% 58%);
  --term-purple: hsl(280deg 60% 70%);

  // ---- Sémantique ----
  --success: hsl(143deg 58% 46%);
  --success-soft: hsl(143deg 45% 14%);
  --warning: hsl(38deg 92% 56%);
  --warning-soft: hsl(38deg 60% 14%);
  --danger: hsl(0deg 78% 60%);
  --danger-soft: hsl(0deg 55% 15%);
  --info: hsl(204deg 72% 56%);
  --info-soft: hsl(204deg 55% 14%);

  // ============================================================
  //  Alias sémantiques — à préférer dans les composants
  // ============================================================
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --text-faint: var(--ink-4);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--orange-500);
  --accent-hover: hsl(24deg 100% 60%);
  --accent-active: var(--orange-600);
  --accent-text: var(--ink-on-accent);
  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
  --accent-ring: hsl(24deg 94% 53% / 45%);
  --accent-2: var(--aubergine-light); // accent secondaire
  --accent-2-soft: hsl(319deg 40% 30% / 28%);
  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
  --link: var(--term-blue);
  --prompt: var(--term-green);
  --overlay: hsl(320deg 60% 3% / 66%);
  --selection: hsl(24deg 94% 53% / 28%);

  // ============================================================
  //  Typographie
  // ============================================================
  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: var(--font-mono);

  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
  --fs-xs: 0.75rem; // 12
  --fs-sm: 0.875rem; // 14
  --fs-base: 1rem; // 16
  --fs-md: 1.125rem; // 18
  --fs-lg: 1.25rem; // 20
  --fs-xl: 1.5rem; // 24
  --fs-2xl: 1.75rem; // 28
  --fs-3xl: 2rem; // 32
  --fs-4xl: 2.5rem; // 40
  --fs-5xl: 3rem; // 48
  --fs-6xl: 3.5rem; // 56

  // Graisses
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;

  // Interlignes
  --lh-tight: 1.1;
  --lh-snug: 1.3;
  --lh-normal: 1.5;
  --lh-relaxed: 1.65;

  // Interlettrage — les eyebrows/labels mono reçoivent des capitales espacées

exec
/bin/zsh -lc "sed -n '1,180p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, le contenu est le héros.
// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Hover lift + bordure plus claire. @default false */
  interactive?: boolean;
  /** Barre d'accent orange→aubergine en haut. @default false */
  accent?: boolean;
  /** Anneau de glow orange (offre mise en avant). @default false */
  featured?: boolean;
  /** Padding interne `--space-6`. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
});

const attrs = useAttrs();
// `as` accepte une balise native ("div", "article") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const rootAttrs = computed(() => {
  if (!isNativeButton.value) {
    return attrs;
  }

  return {
    ...attrs,
    type: typeof attrs.type === "string" ? attrs.type : "button",
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
.zcard {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2), var(--shadow-hairline);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-standard);
}

.zcard--pad {
  padding: var(--space-6);
}

.zcard--interactive {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-3), var(--shadow-hairline);
  }

  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
  // aucun indicateur. Sans effet sur les cartes non focusables (div).
  &:focus-visible {
    // Outline transparent → rendu en couleur système sous forced-colors (où les
    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.zcard--accent::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
}

.zcard--featured {
  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>

exec
/bin/zsh -lc "sed -n '1,100p' app/components/ui/ZTag.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <span
    v-bind="rootAttrs"
    class="ztag"
    :class="{ 'ztag--plain': !hash, 'ztag--clickable': isClickable }"
    :role="clickableRole"
    :tabindex="clickableTabindex"
    @click="handleClick"
    @keydown.enter="handleKeyboardClick"
    @keydown.space="handleKeyboardClick"
  >
    <slot />
    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
// Primitive tag du DS — chip pill mono avec préfixe "#" orange (techno / sujets).
// Porté de docs/design_system/components/core/Tag.jsx (CSS en <style scoped>, prerender-safe).
// API React → Vue : `onRemove`/`onClick` (callbacks React) deviennent des listeners
// détectés via les attrs (le `×` et l'état cliquable n'apparaissent que si fournis).
import { computed, getCurrentInstance, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Affiche le préfixe "#". @default true */
  hash?: boolean;
}

withDefaults(defineProps<Props>(), {
  hash: true,
});

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent];
  remove: [event: MouseEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

function hasListener(name: "onClick" | "onRemove") {
  const listener = instance?.vnode.props?.[name];
  return typeof listener === "function" || Array.isArray(listener);
}

const isClickable = computed(() => hasListener("onClick"));
const isRemovable = computed(() => hasListener("onRemove"));

const rootAttrs = computed(() => {
  if (!isClickable.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "role" && key !== "tabindex" && key !== "tabIndex";
    }),
  );
});

const clickableRole = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  return typeof attrs.role === "string" ? attrs.role : "button";
});

const clickableTabindex = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  const tabindex = attrs.tabindex ?? attrs.tabIndex;
  return typeof tabindex === "string" || typeof tabindex === "number" ? tabindex : 0;
});

function handleClick(event: MouseEvent) {
  if (!isClickable.value) {
    return;
  }

  emit("click", event);
}

function handleKeyboardClick(event: KeyboardEvent) {
  if (!isClickable.value) {
    return;
  }

  event.preventDefault();
  emit("click", event);
}


exec
/bin/zsh -lc "rg -n -C 4 'Story 11\\.3|UX-DR21|UX-DR22' docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards -g '*.md'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/planning-artifacts/epics.md-105-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/planning-artifacts/epics.md-106-UX-DR18: Pile atmosphérique `.atmos` avec 3 calques auroras floutés (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), scanlines CRT et grille de points.
docs/planning-artifacts/epics.md-107-UX-DR19: Composant `BootOverlay` avec montée en charge progressive stylisée `jouan.os`, affichage des étapes, fermeture Escape/clic et mémorisation en session.
docs/planning-artifacts/epics.md-108-UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
docs/planning-artifacts/epics.md:109:UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
docs/planning-artifacts/epics.md:110:UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
docs/planning-artifacts/epics.md-111-UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
docs/planning-artifacts/epics.md-112-UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
docs/planning-artifacts/epics.md-113-UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
docs/planning-artifacts/epics.md-114-
--
docs/planning-artifacts/epics.md-739-  - Badge de statut de disponibilité vérifié avec puce pulsée et lien externe vers le profil Malt (`<ZExternalLink>`)
docs/planning-artifacts/epics.md-740-  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
docs/planning-artifacts/epics.md-741-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-742-
docs/planning-artifacts/epics.md:743:### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés
docs/planning-artifacts/epics.md-744-
docs/planning-artifacts/epics.md-745-As a visiteur explorant la page d'accueil,
docs/planning-artifacts/epics.md-746-I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
docs/planning-artifacts/epics.md:747:So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).
docs/planning-artifacts/epics.md-748-
docs/planning-artifacts/epics.md-749-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-750-
docs/planning-artifacts/epics.md-751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)

exec
/bin/zsh -lc "rg -n -A 50 -B 5 'skills:' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
36-  available: true,
37-  maltUrl: "https://www.malt.fr/profile/simonjouan",
38-};
39-
40-// Stack technique moderne prioritaire ordonnée.
41:const skills: string[] = [
42-  "typescript",
43-  "nuxt",
44-  "vue",
45-  "nest.js",
46-  "node.js",
47-  "postgresql",
48-  "typeorm",
49-  "stripe",
50-  "cypress",
51-  "docker",
52-  "rest-api",
53-  "vitest",
54-];
55-
56-const projects: IProject[] = [
57-  {
58-    name: "keova.app",
59-    role: "Co-fondateur & Développeur Full Stack",
60-    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
61-    url: "https://keova.app",
62-    status: "En production",
63-    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
64-  },
65-  {
66-    name: "TryOn",
67-    role: "CTO & Développeur Full Stack",
68-    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
69-    status: "Étude de cas (MVP livré)",
70-    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
71-  },
72-  {
73-    name: "Nodium",
74-    role: "Créateur & Ingénieur IA",
75-    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
76-    status: "R&D / En cours",
77-    tags: ["typescript", "electron", "agents", "ia"],
78-  },
79-];
80-
81-export const SITE = { profile, skills, projects } as const;

2026-09-13T18:51:51.495751Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '225,275p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
  orange Ubuntu comme unique accent héros.
- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
  terminal.

**Pièges**

- Compatibilité prerender (site statique) : tout accès DOM doit être gardé ;
  IDs déterministes via `useId()` (pas d'aléatoire qui casse l'hydration).
- Ne pas casser `CNAME` / le déploiement gh-pages.
- `<component :is="...">` : passer une référence importée, jamais un nom en string
  (cf. règles Nuxt).
- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
  layout cohabitent sur le même élément (typiquement `.container` + wrapper de
  section, ex. `.hero__in.container`), **ne pas** styler le `padding` en shorthand
  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
  effaçait le vertical de `.hero__in`). Utiliser les **longhands** `padding-inline` /
  `padding-block`, qui composent sans conflit quel que soit l'ordre. (Régression de
  padding du hero, story 3.1 — invisible à la revue de code, attrapée à l'œil.)
- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
  dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **invalide la
  base de contenu** du dev (volume partagé) → `/blog` tombe en erreur. Correctif :
  `docker compose restart web` réindexe le contenu. Sans impact sur le build lui-même.
- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
  est aveugle aux régressions de rendu. Réfs par page :
  - **Home** → `docs/animations_jouan.ovh/Home animée.dc.html` + screenshots
    `docs/animations_jouan.ovh/screenshots/` (`hero*.png`, `services.png`, `booted.png`).
  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
    (UI kit cible ; ouvrir la section correspondante).
  - Routine appliquée sans faille sur Epics 4-8 (desktop + mobile) → zéro régression de
    rendu ; elle a corrigé un défaut de la maquette (centrage timeline `kit.css`, 5.2),
    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
    (diff visuel **et comportemental** avant/après, Epic 8). Sur les passes transverses a11y/motion (Epics 9 & 10) :
    vérification du comportement clavier/motion/contraste sous émulation `forced-colors: active` et `prefers-reduced-motion: reduce`.

---

## Usage Guidelines

**Pour les agents IA :**

- Lire ce fichier AVANT toute implémentation.
- Suivre toutes les règles ; en cas de doute, choisir l'option la plus restrictive.
- Mettre à jour ce fichier si de nouveaux patterns émergent.


exec
/bin/zsh -lc "sed -n '130,225p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
  `public/images/` ou `assets/` lors de l'implémentation.
- **Contenu partagé, URLs & SEO :**
  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_

**Langue**

- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
  vouvoiement. Pas d'emoji (cf. guidelines du design system).

### Workflow de développement

**Git**

- Branche principale : `main`. Intégration : `develop`. Travail par branches de
  feature (ex. refonte en cours : `feat/design-system-revamp`).
- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).

**Environnement de dev : Docker (obligatoire)**

- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
- Commande ponctuelle (lint, typecheck, generate…) :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Stopper : `docker compose down`.

**Build & déploiement**

- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@11.8.0`, lockfile
  `pnpm-lock.yaml`). **Ne JAMAIS utiliser `npm`/`yarn`.**
- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
  « Environnement de dev »), jamais directement sur l'hôte :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
- Build statique : `pnpm generate` → sortie `.output/public`.
- Déploiement : automatisé par GitHub Actions (`.github/workflows/cd.yml` via `peaceiris/actions-gh-pages` sur push `main`). Sortie statique avec `CNAME` vérifié.
- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).

### Tests

- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
- Si des tests sont introduits pendant la migration, documenter la convention ici.

### Règles critiques à ne pas manquer

**Port du design system (React/CSS → Vue/SCSS)**

- Le design system source (`docs/design_system/`) est en **React + CSS custom
  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.

**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**

- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
  les traiter en amont (checklist pré-revue dans la consigne de story).
- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).

**À préserver pendant la refonte**

- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
  easter-egg à conserver — le design system la garde comme feature secondaire.
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,

exec
/bin/zsh -lc "sed -n '743,805p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés

As a visiteur explorant la page d'accueil,
I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).

**Acceptance Criteria:**

**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
**When** on intègre le composant `StackMarquee` et la section des 3 services phares
**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
**And** chaque carte oriente directement vers la route `/services` (aucune ancre intra-page `#`)
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion

As a prospect cherchant des garanties avant prise de contact,
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).

**Acceptance Criteria:**

**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
**Then** les projets affichent :
  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
  - **Nodium** avec statut `◐ R&D / En cours` valorisant le laboratoire d'agents IA desktop
**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
**And** la section journal présente les articles récents du blog avec lien vers `/blog`
**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker

As a mainteneur du site et garant de la qualité logicielle,
I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).

**Acceptance Criteria:**

**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
**Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)


exec
/bin/zsh -lc "sed -n '1,130p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-09-13"
sections_completed: ["technology_stack", "language_framework", "code_quality", "workflow_testing", "critical_rules"]
status: "complete"
optimized_for_llm: true
existing_patterns_found: 12
---

# Project Context for AI Agents

_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Il se concentre sur les détails non évidents que les agents pourraient manquer._

---

## Technology Stack & Versions

> ✅ **Migration de stack terminée (Epic 1).** Les versions ci-dessous sont l'état
> ACTUEL, post-migration. `@nuxt/bridge-edge` a été abandonné ; le code applicatif
> vit désormais sous `app/` (structure Nuxt 4 par défaut, `srcDir = "app"`).

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
- **Langage :** TypeScript `^6.0.3`.
- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
- **Déploiement :** site statique (`nuxi generate`) → publication vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME` = `jouan.ovh`). ✅ La chaîne CI de déploiement est **prouvée en réel** sur `main` (Story 10.7), avec 13 routes pré-rendues, HTTPS Let's Encrypt forcé et DNS OVH opérationnel.
- **Divers :** `ua-parser-js ^2` (détection device, terminal).

## Critical Implementation Rules

### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)

**TypeScript / Vue**

- Préférer `<script setup lang="ts">` pour tout NOUVEAU composant. Le sous-système
  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
  décision rétro Epic 7). **Reste un seul résidu Options API** (`defineComponent`,
  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
  pas l'étendre ; le migrer vers `<script setup>` lors d'une refonte du header
  (cleanup optionnel, non planifié).
- `vue-property-decorator` et l'option `experimentalDecorators` ont été retirés
  (Epic 3) : plus aucun décorateur de classe, ne pas en réintroduire.
- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).

**Nuxt**

- Cible de build = site **STATIQUE** (`nuxi generate`) → tout code doit être
  compatible prerender : pas d'accès `window`/`document` hors `onMounted` ou
  garde `import.meta.client`.
- Pages dans `app/pages/`, layout `app/layouts/default.vue`, auto-import des
  composants activé (pas d'import manuel pour la plupart).
- **Primitives DS sous `app/components/ui/` auto-importées SANS préfixe de dossier**
  (`<ZButton>`, pas `<UiZButton>`) via `components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"]`.
  Le reste de `components/` garde le scan par défaut.
- ⚠️ **Piège `<component :is>` :** un nom de composant passé en _string_
  (`<component :is="'NuxtLink'">`) **ne résout pas** l'auto-import. Importer la
  référence depuis `#components` (`import { NuxtLink } from "#components"`) et la
  passer comme valeur. (Régression rencontrée en story 2.8.)
- Images TOUJOURS via `<NuxtImg>` / `<NuxtPicture>` (@nuxt/image), jamais
  `<img>` brut. Assets statiques dans `public/images/`.
- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
  `app/pages/blog/index.vue`, article `app/pages/blog/[...slug].vue`. Collections **typées
  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
  `tags`, `read`, `image`). Requêtes via `queryCollection("blog")…` dans `useAsyncData`
  (prerender-safe) ; rendu article via `<ContentRenderer>`. **Coloration Shiki désactivée**
  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
  ne pas réactiver sans surcharge (sinon styles inline par token écrasant le DS).
- **Formulaire `/contact` (Epic 7)** : envoi via **Web3Forms** (tiers _sans serveur_, site
  reste statique), clé via `runtimeConfig.public.web3formsAccessKey` (env
  `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, cf. `.env.example`). ⚠️ **Sans la clé, l'envoi échoue** —
  la provisionner en env. `$fetch` **client-only** (prerender-safe) + honeypot anti-spam ;
  validation/feedback front. Notice RGPD sous le form + page politique de confidentialité dédiée
  (`/confidentialite`, livrée en story 10.6).

**SCSS (règle critique)**

- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
  sont exposés sur `:root` par `app/assets/scss/abstract/_root.scss` — source unique
  de vérité (couleurs, typo, espacement, rayons, élévation, motion).
- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
  palette syntaxe), commenter explicitement la dérogation.
- **Primitives de layout GLOBALES** : `.section` / `.section--sunken` / `.container` /
  `.eyebrow` (+ `.eyebrow--muted`) / `.prose` / `.hero__tags` vivent dans
  `app/assets/scss/base/_layout.scss` (chargé par `main.scss`). **Les consommer, ne PAS
  les redéclarer en `<style scoped>` par page** (sinon duplication divergente). Si un
  modifieur DS manque, l'ajouter au partiel global, pas en local. (Convention extraite
  en story 5.1 après duplication scoped dans index/services/about.)
- Legacy : certains composants déclarent encore des CSS props locales à partir des
  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
- Styles dans `<style lang="scss" scoped>` par composant. Exceptions Stylelint
  (`:deep`/`:slotted`/`:global`) en `/* stylelint-disable */` **inline et commenté**,
  pas en config globale.

### Qualité de code & conventions

**Lint / format**

- ESLint + Prettier : double quotes, points-virgules, `max-len: 120`.
  `prefer-const` en erreur. Stylelint + `stylelint-scss` pour le SCSS.
- `no-console` / `no-debugger` : warning en production uniquement.

**Conventions de nommage**

- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`) — `<script setup>`,
  auto-importées sans préfixe de dossier.
- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
  `ZCardComponent` monolithique a été supprimé en story 2.4.)
- Composants applicatifs legacy : PascalCase suffixé `Component`
  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
- Sous-système terminal sous `components/terminal/` : coquilles Vue
  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
  contrats (`I*` + barrel `index.ts`).
- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
  (ex. `@use "...color" as _color`).

**Organisation**

- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.

exec
/bin/zsh -lc "rg -n 'hardcoded|hardcod|no hard|NFR2|Aucune valeur|duration|durée|px|#[0-9A-Fa-f]' docs/specs/spec-home-awwwards/SPEC.md docs/project-context.md AGENTS.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/specs/spec-home-awwwards/SPEC.md:69:- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
docs/project-context.md:61:  référence depuis `#components` (`import { NuxtLink } from "#components"`) et la
docs/project-context.md:86:- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
docs/project-context.md:134:  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
docs/project-context.md:135:  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
docs/project-context.md:214:  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
docs/project-context.md:240:  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
AGENTS.md:121:- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
AGENTS.md:133:- **Contraste forcé (`forced-colors`) :** Tout élément interactif au focus doit intégrer le repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` pour rester visible en mode contraste élevé système.
AGENTS.md:138:- **`<component :is="...">` :** Passer un nom de composant en chaîne de caractères (`:is="'NuxtLink'"`) **ne résout pas** l'auto-import Nuxt. Il faut importer explicitement la référence depuis `#components` (`import { NuxtLink } from "#components"`) et la lier comme valeur.

2026-09-13T18:51:57.491129Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
codex
Deux écarts techniques ressortent du diff : la distance d’animation n’est pas exactement celle d’un cycle complet lorsque le `gap` est appliqué entre les deux copies, et le nouveau SCSS introduit des littéraux interdits par la règle de tokens. Je fais une dernière vérification des lignes et de l’absence d’autres défauts avant le rendu final.
exec
/bin/zsh -lc "sed -n '1,120p' app/assets/scss/base/_motion.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
// ============================================================
// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
// les animations d'entrée et les transitions non essentielles sont ramenées à
// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
// restent en place et cohérentes ; cette règle couvre le reste (ZButton, etc.)
// et tout ajout futur, sans avoir à y penser au cas par cas.
//
// EXCEPTION (DS / CAP-11) — le caret du terminal est la SEULE boucle autorisée :
//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
//    piloté par CSS → intact ici ;
//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
//
// DÉROGATION « valeurs en dur » (règle SCSS projet) — les durées `0.01ms` / `0ms`
// ci-dessous sont volontairement littérales : c'est la recette a11y standard de
// neutralisation du mouvement (quasi-instantané, sans casser les callbacks
// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.

/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }

  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
  .prm__caret {
    animation: none !important;
  }
}
/* stylelint-enable declaration-no-important, selector-class-pattern */

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-3/full.diff | sed -n '115,230p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   115	diff --git a/app/pages/index.vue b/app/pages/index.vue
   116	index 07df568..eaedacd 100644
   117	--- a/app/pages/index.vue
   118	+++ b/app/pages/index.vue
   119	@@ -44,17 +44,37 @@
   120	       </div>
   121	     </section>
   122	 
   123	-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
   124	+    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
   125	+    <HomeStackMarquee />
   126	+
   127	+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
   128	     <section class="section">
   129	       <div class="container">
   130	-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
   131	-        <h2 class="section__title">Trois façons de travailler ensemble</h2>
   132	+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
   133	+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
   134	         <ul class="grid-3">
   135	           <li v-for="service in services" :key="service.id">
   136	             <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
   137	-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
   138	+              <div class="offer__top">
   139	+                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
   140	+                <span class="offer__no">{{ service.no }}</span>
   141	+              </div>
   142	               <h3 class="offer__title">{{ service.title }}</h3>
   143	               <p class="offer__desc">{{ service.desc }}</p>
   144	+              <ul class="offer__points">
   145	+                <li v-for="point in service.points" :key="point">
   146	+                  <ZIcon name="check" class="offer__check" />
   147	+                  <span>{{ point }}</span>
   148	+                </li>
   149	+              </ul>
   150	+              <ul class="hero__tags offer__tags">
   151	+                <li v-for="tag in service.tags" :key="tag">
   152	+                  <ZTag>{{ tag }}</ZTag>
   153	+                </li>
   154	+              </ul>
   155	+              <div class="offer__price">
   156	+                <span>{{ service.price }}</span>
   157	+              </div>
   158	               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
   159	                 En savoir plus →
   160	               </NuxtLink>
   161	@@ -116,29 +136,52 @@ function onBootComplete() {
   162	   isBootFinished.value = true;
   163	 }
   164	 
   165	-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   166	-// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   167	-// `id` = clé v-for stable (indépendante du contenu affiché).
   168	+// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
   169	+// Remplacement complet des données legacy.
   170	 const services = [
   171	   {
   172	-    id: "wordpress",
   173	-    icon: "wp",
   174	-    title: "WordPress sur-mesure",
   175	-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   176	+    id: "creation",
   177	+    no: "01 / 03",
   178	+    icon: "code",
   179	+    title: "Création d'applications web & SaaS",
   180	+    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
   181	+    points: [
   182	+      "Architecture logicielle & APIs REST",
   183	+      "Applications Vue 3 / Nuxt 4 & NestJS",
   184	+      "Intégration Stripe & PostgreSQL",
   185	+    ],
   186	+    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
   187	+    price: "Sur devis / au sprint",
   188	     featured: false,
   189	   },
   190	   {
   191	-    id: "apps",
   192	-    icon: "code",
   193	-    title: "Applications web",
   194	-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   195	+    id: "fullstack",
   196	+    no: "02 / 03",
   197	+    icon: "layers",
   198	+    title: "Développement Full Stack TypeScript",
   199	+    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
   200	+    points: [
   201	+      "Composants Vue 3 / Nuxt avec TypeScript strict",
   202	+      "Microservices & backend modulaire NestJS",
   203	+      "Fiabilisation et optimisation des performances",
   204	+    ],
   205	+    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
   206	+    price: "Sur devis / TJM",
   207	     featured: true,
   208	   },
   209	   {
   210	-    id: "ia",
   211	+    id: "evolution",
   212	+    no: "03 / 03",
   213	     icon: "spark",
   214	-    title: "IA & automatisation",
   215	-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   216	+    title: "Évolution & Architecture applicative",
   217	+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
   218	+    points: [
   219	+      "Audits techniques de code & migrations de versions",
   220	+      "Tests E2E Cypress & tests unitaires Vitest",
   221	+      "Pipelines CI/CD & conteneurisation Docker",
   222	+    ],
   223	+    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
   224	+    price: "Au forfait / audit",
   225	     featured: false,
   226	   },
   227	 ];
   228	@@ -356,13 +399,19 @@ usePageSeo({
   229	   width: 100%;
   230	 }

exec
/bin/zsh -lc "rg -n 'services|wordpress|apps|ia|HomeStackMarquee|to=\"/services\"|mask-image|scroll-x|prefers-reduced-motion' docs/implementation-artifacts/code-reviews/11-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
5:+++ b/app/components/home/HomeStackMarquee.vue
8:+  <div class="marquee" aria-hidden="true">
13:+        <span class="marquee__star" aria-hidden="true">✦</span>
18:+        <span class="marquee__star" aria-hidden="true">✦</span>
27:+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
28:+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
60:+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
72:+  animation: scroll-x 32s linear infinite;
95:+@keyframes scroll-x {
105:+@media (prefers-reduced-motion: reduce) {
107:+    mask-image: none;
123:-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
125:+    <HomeStackMarquee />
127:+    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
130:-        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
132:+        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
135:           <li v-for="service in services" :key="service.id">
158:               <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
165:-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
170: const services = [
172:-    id: "wordpress",
191:-    id: "apps",
202:+      "Microservices & backend modulaire NestJS",
203:+      "Fiabilisation et optimisation des performances",
210:-    id: "ia",
217:+    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-3/full.diff | sed -n '1,115p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
     2	new file mode 100644
     3	index 0000000..a65ef1e
     4	--- /dev/null
     5	+++ b/app/components/home/HomeStackMarquee.vue
     6	@@ -0,0 +1,108 @@
     7	+<template>
     8	+  <div class="marquee" aria-hidden="true">
     9	+    <div class="marquee__track">
    10	+      <!-- Première passe -->
    11	+      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
    12	+        <b class="marquee__label">{{ skill }}</b>
    13	+        <span class="marquee__star" aria-hidden="true">✦</span>
    14	+      </span>
    15	+      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
    16	+      <span v-for="(skill, index) in skillsList" :key="`skill-b-${index}`" class="marquee__item">
    17	+        <b class="marquee__label">{{ skill }}</b>
    18	+        <span class="marquee__star" aria-hidden="true">✦</span>
    19	+      </span>
    20	+    </div>
    21	+  </div>
    22	+</template>
    23	+
    24	+<script setup lang="ts">
    25	+// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
    26	+// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
    27	+// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
    28	+// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
    29	+import { computed } from "vue";
    30	+import { SITE } from "~/data/site";
    31	+
    32	+const SKILL_LABEL_MAP: Record<string, string> = {
    33	+  typescript: "TypeScript",
    34	+  nuxt: "Nuxt 4",
    35	+  vue: "Vue.js",
    36	+  "nest.js": "NestJS",
    37	+  "node.js": "Node.js",
    38	+  postgresql: "PostgreSQL",
    39	+  typeorm: "TypeORM",
    40	+  stripe: "Stripe Connect",
    41	+  cypress: "Cypress",
    42	+  docker: "Docker",
    43	+  "rest-api": "REST API",
    44	+  vitest: "Vitest",
    45	+};
    46	+
    47	+const skillsList = computed(() => {
    48	+  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
    49	+});
    50	+</script>
    51	+
    52	+<style lang="scss" scoped>
    53	+/* stylelint-disable selector-class-pattern */
    54	+.marquee {
    55	+  display: block;
    56	+  width: 100%;
    57	+  padding-block: var(--space-5);
    58	+  overflow: hidden;
    59	+  border-block: 1px solid var(--border-subtle);
    60	+  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    61	+
    62	+  &:hover .marquee__track {
    63	+    animation-play-state: paused;
    64	+  }
    65	+}
    66	+
    67	+.marquee__track {
    68	+  display: flex;
    69	+  gap: var(--space-8);
    70	+  width: max-content;
    71	+  will-change: transform;
    72	+  animation: scroll-x 32s linear infinite;
    73	+}
    74	+
    75	+.marquee__item {
    76	+  display: inline-flex;
    77	+  gap: var(--space-8);
    78	+  align-items: center;
    79	+  font-family: var(--font-mono);
    80	+  font-size: var(--fs-xl);
    81	+  letter-spacing: var(--ls-wide);
    82	+  color: var(--text-faint);
    83	+  white-space: nowrap;
    84	+}
    85	+
    86	+.marquee__label {
    87	+  font-weight: var(--fw-regular);
    88	+  color: var(--text-body);
    89	+}
    90	+
    91	+.marquee__star {
    92	+  color: var(--accent);
    93	+}
    94	+
    95	+@keyframes scroll-x {
    96	+  from {
    97	+    transform: translateX(0);
    98	+  }
    99	+
   100	+  to {
   101	+    transform: translateX(-50%);
   102	+  }
   103	+}
   104	+
   105	+@media (prefers-reduced-motion: reduce) {
   106	+  .marquee {
   107	+    mask-image: none;
   108	+  }
   109	+
   110	+  .marquee__track {
   111	+    animation: none;
   112	+  }
   113	+}
   114	+</style>
   115	diff --git a/app/pages/index.vue b/app/pages/index.vue

2026-09-13T18:52:35.970354Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-3/full.diff | sed -n '228,330p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   228	@@ -356,13 +399,19 @@ usePageSeo({
   229	   width: 100%;
   230	 }
   231	 
   232	+.offer__top {
   233	+  display: flex;
   234	+  align-items: center;
   235	+  justify-content: space-between;
   236	+  margin-bottom: var(--space-4);
   237	+}
   238	+
   239	 .offer__icon {
   240	   display: flex;
   241	   align-items: center;
   242	   justify-content: center;
   243	   width: var(--space-10); // 40px
   244	   height: var(--space-10);
   245	-  margin-bottom: var(--space-4);
   246	 
   247	   // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   248	   // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   249	@@ -372,6 +421,13 @@ usePageSeo({
   250	   border-radius: var(--radius-md);
   251	 }
   252	 
   253	+.offer__no {
   254	+  font-family: var(--font-mono);
   255	+  font-size: var(--fs-xs);
   256	+  letter-spacing: var(--ls-wider);
   257	+  color: var(--text-faint);
   258	+}
   259	+
   260	 .offer__title {
   261	   margin-bottom: var(--space-2);
   262	   font-family: var(--font-mono);
   263	@@ -388,8 +444,46 @@ usePageSeo({
   264	   color: var(--text-body);
   265	 }
   266	 
   267	-.offer__more {
   268	+.offer__points {
   269	+  display: flex;
   270	+  flex-direction: column;
   271	+  gap: var(--space-2);
   272	+  margin: 0 0 var(--space-4);
   273	+  padding: 0;
   274	+  list-style: none;
   275	+
   276	+  li {
   277	+    display: flex;
   278	+    gap: var(--space-2);
   279	+    align-items: flex-start;
   280	+    font-family: var(--font-mono);
   281	+    font-size: var(--fs-xs);
   282	+    line-height: var(--lh-normal);
   283	+    color: var(--text-muted);
   284	+  }
   285	+}
   286	+
   287	+.offer__check {
   288	+  font-size: var(--fs-sm);
   289	+  color: var(--term-green);
   290	+  margin-top: 2px;
   291	+}
   292	+
   293	+.offer__tags {
   294	+  margin-bottom: var(--space-4);
   295	+}
   296	+
   297	+.offer__price {
   298	   margin-top: auto;
   299	+  padding-top: var(--space-4);
   300	+  border-top: 1px dashed var(--border-subtle);
   301	+  font-family: var(--font-mono);
   302	+  font-size: var(--fs-xs);
   303	+  color: var(--accent);
   304	+}
   305	+
   306	+.offer__more {
   307	+  margin-top: var(--space-3);
   308	   font-family: var(--font-mono);
   309	   font-size: var(--fs-sm);
   310	   color: var(--accent);

2026-09-13T18:52:40.355161Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- **Saut visible à la boucle du marquee** — AC1 / UX-DR21 (défilement continu sans coupure). Le `gap` s’applique aux 23 séparations du track doublé (`full.diff:67-70`), mais l’animation s’arrête à `translateX(-50%)` (`full.diff:95-102`) : le point de reprise est décalé d’un demi-`gap`, provoquant un saut au redémarrage.

- **Valeurs CSS hardcodées dans le nouveau code** — NFR2 / règles SCSS d’`AGENTS.md` et `project-context.md`. Le diff introduit `#000` (`full.diff:60`), une durée `32s` (`full.diff:72`) et une marge `2px` (`full.diff:290`) au lieu de tokens CSS.
tokens used
77 966
- **Saut visible à la boucle du marquee** — AC1 / UX-DR21 (défilement continu sans coupure). Le `gap` s’applique aux 23 séparations du track doublé (`full.diff:67-70`), mais l’animation s’arrête à `translateX(-50%)` (`full.diff:95-102`) : le point de reprise est décalé d’un demi-`gap`, provoquant un saut au redémarrage.

- **Valeurs CSS hardcodées dans le nouveau code** — NFR2 / règles SCSS d’`AGENTS.md` et `project-context.md`. Le diff introduit `#000` (`full.diff:60`), une durée `32s` (`full.diff:72`) et une marge `2px` (`full.diff:290`) au lieu de tokens CSS.

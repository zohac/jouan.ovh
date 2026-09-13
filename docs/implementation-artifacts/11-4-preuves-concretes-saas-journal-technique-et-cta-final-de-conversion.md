---
baseline_commit: 44894826488b4d1acf1ce108ea6ff345b725c80a
---

# Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect explorant la page d'accueil pour évaluer une collaboration freelance,
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés de réassurance, les derniers articles du journal technique et le bloc d'action final,
so that je sois convaincu par des preuves concrètes d'ingénierie logicielle Full Stack TypeScript et engagé à initier un contact direct via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24, CAP-5, CAP-6, CAP-7).

## Acceptance Criteria

1. **Given** les projets définis dans `SITE.projects` (`app/data/site.ts`)
   **When** le visiteur fait défiler la page d'accueil sous la section des services
   **Then** la section des réalisations (`.work`) affiche l'en-tête :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>`
     - Titre de section : `<h2 class="section__title">Des produits qui tournent en production</h2>`
   **And** la liste des projets est structurée en une séquence sémantique `<ul>` / `<li>` avec les 3 réalisations :
     - **Keova App** (`01`) : Statut `● En production`, rôle `Co-fondateur & Développeur Full Stack`, description ERP équestre SaaS, tags (`Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect`, `SaaS`), et lien externe direct accessible via `<ZExternalLink href="https://keova.app">`
     - **TryOn** (`02`) : Statut `○ Étude de cas (MVP livré)`, rôle `CTO & Développeur Full Stack`, description plateforme IA générative & mode, tags (`Nuxt 3`, `NestJS`, `Python`, `ComfyUI`, `IA`), **sans lien externe mort 404** (rendu sans balise `<a>` externe non résolue)
     - **Nodium** (`03`) : Statut `◐ R&D / En cours`, rôle `Créateur & Ingénieur IA`, description orchestration d'agents desktop, tags (`TypeScript`, `Electron`, `Agents`, `IA`), rendu sans lien externe
   **And** chaque ligne interactive (`.work__row`) réagit au survol (`:hover`) avec un dégradé subtil `var(--accent-soft)` et un décalage de la flèche directionnelle (sans à-coup).

2. **Given** la zone de réassurance située immédiatement après les projets
   **When** le visiteur consulte les indicateurs clés
   **Then** une grille responsive (`.stats`) affiche exactement 3 compteurs typés :
     - Compteur 1 : Valeur `11`, libellé `années d'expérience web`
     - Compteur 2 : Valeur `100%`, libellé `TypeScript & SaaS de bout en bout`
     - Compteur 3 : Valeur `QA`, libellé `culture d'automatisation & zéro régression`
   **And** les valeurs numériques/codes sont mises en exergue en police monospace `var(--font-mono)` et couleur d'accent `var(--accent)`
   **And** la grille s'adapte de façon fluide (3 colonnes sur desktop, 1 colonne sous 680px).

3. **Given** la collection de blog `@nuxt/content` v3
   **When** on intègre la section du journal technique sur la page d'accueil
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>`
     - Titre : `<h2 class="section__title">Notes de dev, écrites en construisant</h2>`
     - Lien d'approfondissement : `<NuxtLink to="/blog" class="seeall">cat tous-les-articles →</NuxtLink>`
   **And** les 3 articles les plus récents sont interrogés de manière prerender-safe via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())`
   **And** si des articles existent, ils sont rendus avec leurs tags `ZTag`, titre, date formatée et lien vers leur route `/blog/[slug]`
   **And** si la collection est vide (état initial du dépôt avec `.gitkeep`), un état d'attente sobre et élégant s'affiche invitant à consulter le blog sans bloquer le rendu statique SSG.

4. **Given** le bas de la page d'accueil
   **When** le prospect atteint la fin de la consultation
   **Then** un panneau d'appel à l'action final (`.cta`) se présente avec :
     - Eyebrow mono : `<p class="eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>`
     - Titre : `<h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>`
     - Sous-titre : `<p class="cta__subtitle">Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.</p>`
     - CTAs interactifs :
       - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
       - Bouton externe : `<ZButton :as="ZExternalLink" :href="SITE.profile.maltUrl" variant="secondary">Me contacter sur Malt</ZButton>` (garantissant l'accessibilité a11y et `srText`)
       - Bouton tertiaire : `<ZButton variant="ghost" to="/about">Voir le parcours & CV</ZButton>`
   **And** aucun lien intra-page avec ancre `#` n'est employé (respect de l'architecture multi-pages).

5. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte de la section des projets sélectionnés (`.work`) (AC: 1)
  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
  - [x] Baliser les 3 projets de `SITE.projects` (`keova.app`, `TryOn`, `Nodium`) dans une liste sémantique `<ul>` et `<li>`.
  - [x] Afficher la numérotation (`01`, `02`, `03`), le statut coloré (`● En production`, `○ Étude de cas (MVP livré)`, `◐ R&D / En cours`), le titre, la description, le rôle et les tags avec `ZTag`.
  - [x] Rendre la ligne de `keova.app` comme lien externe accessible via `<ZExternalLink href="https://keova.app">` avec indicateur de sortie (`.work__go`).
  - [x] Rendre les lignes de `TryOn` et `Nodium` sans balise lien externe afin d'éviter tout lien mort 404 (éléments interactifs locaux ou conteneurs non-liens).
  - [x] Styliser les lignes en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--accent-soft`, `--text-faint`, `--text-muted`, `--accent`).

- [x] Tâche 2 — Intégration des statistiques clés de réassurance (`.stats`) (AC: 2)
  - [x] Mettre à jour le tableau `stats` dans le script de `app/pages/index.vue` avec les 3 indicateurs cibles : `11` (années d'expérience web), `100%` (TypeScript & SaaS de bout en bout), `QA` (culture d'automatisation & zéro régression).
  - [x] Rendre les statistiques sous la liste des projets dans un conteneur `.stats`.
  - [x] Styliser les compteurs en typographie monospace (`var(--font-mono)`), taille fluide clamp, couleur d'accent (`var(--accent)`), avec adaptation responsive (3 colonnes sur desktop, 1 colonne sous 680px).

- [x] Tâche 3 — Intégration de la section Journal technique (AC: 3)
  - [x] Déclarer la requête `@nuxt/content` v3 via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())` dans `app/pages/index.vue`.
  - [x] Structurer la section avec l'eyebrow (`// ~/journal`), le titre de section et le lien d'en-tête vers `/blog` (`cat tous-les-articles →`).
  - [x] Rendre les cartes d'articles avec titre, tags `ZTag`, date formatée et lien vers la route d'article si la liste n'est pas vide.
  - [x] Prévoir le rendu de repli élégant lorsque la collection est vide (pas d'erreur, message sobre et invitation à visiter `/blog`).

- [x] Tâche 4 — Intégration du bloc CTA final de conversion (`.cta`) (AC: 4)
  - [x] Créer le bloc de clôture de page d'accueil `.cta` avant la fermeture du `<main>`.
  - [x] Ajouter l'eyebrow terminale (`$ ./contact --start`), le titre d'accroche avec mise en valeur de « en production » (`var(--accent)`), et le sous-titre commercial.
  - [x] Intégrer les trois actions : bouton primaire vers `/contact`, bouton externe vers le profil Malt (`SITE.profile.maltUrl`) avec `<ZButton :as="ZExternalLink">`, et bouton fantôme vers `/about`.
  - [x] Styliser le bloc avec une surface surélevée (`--surface-2` ou dégradé aubergine sombre), bordure subtile et padding généreux.

- [x] Tâche 5 — Validation qualité & Gate Docker (AC: 5)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu visuel, la fluidité des survols, la navigation au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier la complétion de la page d'accueil complète (Hero, Marquee, Services, Projets, Stats, Journal, CTA).

### Review Findings

- [x] [Review][Patch] Synchroniser les données canoniques `SITE.projects` dans `app/data/site.ts` (statuts avec puces `●`/`○`/`◐`, tags complets avec casse, libellé `Keova App`) et mapper le nom dans `HomeHeroTerminal.vue` [app/data/site.ts:58, app/components/home/HomeHeroTerminal.vue:108]
- [x] [Review][Patch] Appliquer `var(--accent)` et une taille fluide `clamp(var(--fs-3xl), 5vw, var(--fs-5xl))` sur les compteurs `.stat b` conformément à l'AC2 [app/pages/index.vue:777]
- [x] [Review][Patch] Passer `:padded="false"` sur `ZCard` pour les cartes d'articles afin d'avoir une vignette bord à bord [app/pages/index.vue:152]
- [x] [Review][Patch] Neutraliser les mouvements et transitions résiduels (`padding-left` de `.work__row--link`, `transform` de `.jpost__arrow`, `transition` de `.seeall`) sous `prefers-reduced-motion: reduce` [app/pages/index.vue:1024]
- [x] [Review][Patch] Remplacer les dimensions SCSS en dur (`56px`, `160px`, `clamp(48px, ...)`) par les tokens du Design System (`var(--fs-6xl)`, `10rem`, `clamp(var(--space-12), ...)`) [app/pages/index.vue:641,848,930]
- [x] [Review][Patch] Utiliser `String(index + 1).padStart(2, '0')` et sécuriser les clés `v-for` des tags pour garantir l'unicité [app/pages/index.vue:104,113,165]
- [x] [Review][Defer] Différenciation éditoriale d'une carte vedette dans le journal (CAP-7) [app/pages/index.vue:150] — deferred, pre-existing / évolution éditoriale future

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)`, `var(--text-strong)`, `var(--text-muted)`, `var(--text-faint)`, `var(--accent)`, `var(--accent-soft)`, `var(--font-mono)`, `var(--fs-sm)`, `var(--space-6)`, etc.). [Source: AGENTS.md#Section 3]
- **Pas de préfixes vendeurs manuels :** Stylelint interdit les préfixes manuels comme `-webkit-*`. Les préfixes navigateurs sont injectés automatiquement par Autoprefixer/PostCSS au build. [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) dès la conception :**
  - Tout lien ouvrant un nouvel onglet DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`), garantissant `rel="noopener"` et l'annonce sr-only `(ouvre dans un nouvel onglet)`.
  - Les projets sans URL externe active (`TryOn`, `Nodium`) ne doivent PAS comporter de fausse balise `<a>` avec `href="#"` ou URL cassée menant à une 404.
  - Les listes de projets et de statistiques doivent être balisées en listes sémantiques `<ul>` et `<li>`.
  - Les éléments interactifs doivent conserver le repli standard pour contraste forcé (`forced-colors`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
- **DRY & Données :** Consommer `SITE.projects` et `SITE.profile` depuis `app/data/site.ts`. Ne jamais dupliquer les URLs, titres ou descriptions en dur.
- **SSG & Prerender Safety :** La récupération des articles de blog via `useAsyncData` et `queryCollection` est résolue au build Nitro. Aucun accès direct aux APIs navigateur sans garde SSR.

### Fichiers modifiés et créés
- **`app/pages/index.vue`** (UPDATE) : Refonte complète des sections projets sélectionnés, stats, ajout du journal technique et du bloc CTA final.

### Données & Textes exacts (Source : `sections-mapping.md`, `epics.md`, `contexte_malt.md`)
- **Projets sélectionnés :**
  - Keova : Rôle `Co-fondateur & Développeur Full Stack`, Statut `● En production`, URL `https://keova.app`.
  - TryOn : Rôle `CTO & Développeur Full Stack`, Statut `○ Étude de cas (MVP livré)`.
  - Nodium : Rôle `Créateur & Ingénieur IA`, Statut `◐ R&D / En cours`.
- **Stats de réassurance :**
  - `11` / `années d'expérience web`
  - `100%` / `TypeScript & SaaS de bout en bout`
  - `QA` / `culture d'automatisation & zéro régression`
- **Journal :**
  - Eyebrow : `// ~/journal`
  - Titre : `Notes de dev, écrites en construisant`
  - Lien : `cat tous-les-articles →` pointant vers `/blog`
- **CTA final :**
  - Eyebrow : `$ ./contact --start`
  - Titre : `Un projet en tête ? Mettons-le en production.`
  - Sous-titre : `Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
  - Boutons : `/contact` (« Discuter de votre projet »), `SITE.profile.maltUrl` (« Me contacter sur Malt »), `/about` (« Voir le parcours & CV »).

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash (Low)

### Debug Log References
- Gate de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques pré-rendues).
- Résolution des ajustements de formatage Prettier sur les balises de template et dégradés SCSS.

### Completion Notes List
- Implémentation complète de la section `.work` en liste sémantique `<ul>`/`<li>` avec les 3 projets SaaS issus de `SITE.projects` (Keova en lien `<ZExternalLink>`, TryOn et Nodium sans lien externe mort, tags `ZTag`, statuts et rôles).
- Intégration de la grille `.stats` responsive à 3 compteurs (`11`, `100%`, `QA`) avec police monospace et adaptation 1 colonne sur mobile.
- Intégration de la section Journal technique avec requête `@nuxt/content` v3 (`useAsyncData` + `queryCollection('blog').order('date', 'DESC').limit(3).all()`), lien vers `/blog` et état de repli élégant.
- Implémentation du bloc CTA final `.cta` avec eyebrow mono, titre percutant, sous-titre commercial et trois boutons d'action (`/contact`, lien Malt via `<ZExternalLink>`, et `/about`).
- Conformité stricte a11y : tokens CSS globaux, pas de valeurs en dur, `forced-colors` focus-visible, `prefers-reduced-motion: reduce`.
- Validation de la gate Docker verte à 100 % (13 routes SSG Nitro pré-rendues).

### File List
- `app/data/site.ts` (MODIFIED)
- `app/components/home/HomeHeroTerminal.vue` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIED)
- `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation des sections Projets SaaS, Statistiques, Journal technique et CTA final de conversion de la page d'accueil (Story 11.4). Gate Docker 100% verte.
- 2026-09-13 : Revue de code adverse (6 patchs résolus, 1 defer consigné, 9 dismissed). Gate Docker 100% verte. Statut passé à done.

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.3 : docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md]

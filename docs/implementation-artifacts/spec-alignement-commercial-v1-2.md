---
title: 'Ajustements de crédibilité, langage et alignement commercial V1.2'
type: 'chore'
created: '2026-09-19'
status: 'done'
baseline_commit: 'ab0633b'
context:
  - 'docs/project-context.md'
  - 'AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le retour commercial post-V1.1 met en évidence plusieurs frictions de crédibilité et de terminologie : le mot « workflow » au 1er écran est trop abstrait pour les patrons de PME, le titre « Des produits qui tournent en production » contredit les statuts R&D/en développement, AI Care promet une « optimisation continue » sans cadrage explicite du devis, la mention « prompt engineering » nuit à l'image d'ingénieur logiciel fiable, le CTA « Démarrer un projet » exige trop d'engagement initial, le lien « Blog » vide envoie un signal de chantier, et les statistiques de la homepage affichaient 11 ans (au lieu de 8+ ans d'expérience logicielle 2018-2026) ainsi qu'un « 100% TypeScript » réducteur face à Debrief (Rust/Tauri/C++).

**Approach:** Appliquer de manière chirurgicale l'ensemble des ajustements de wording, de promesses et de navigation sur les pages d'accueil, services, header, blog et terminal, sans altérer l'architecture des offres ni les fondations techniques du site.

## Boundaries & Constraints

**Always:**
- Exécuter la validation globale Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 0 erreur.
- Respecter le ton sobre, professionnel, voix 1re personne (« je ») et vouvoiement du visiteur, ZÉRO emoji.
- Consommer les tokens CSS existants via `var(--token)`.
- Préserver l'a11y (focus-visible, contrastes, annonces pour lecteurs d'écran).

**Ask First:**
- Toute modification structurelle de l'architecture des 3 offres Build ou du découpage AI Care.

**Never:**
- Ne jamais coder d'URL absolue en dur (`jouan.ovh`).
- Ne jamais réintroduire d'emoji ou de mentions de prix d'entrée sur le build.

</frozen-after-approval>

## Code Map

- `app/pages/index.vue` -- H1 hero, CTA hero, titre section preuves, statistiques de réassurance (8+ ans, Full Stack de bout en bout).
- `app/pages/services.vue` -- Wording IA sans "prompt engineering", limitation et précisions du périmètre AI Care.
- `app/components/HeaderComponent.vue` -- CTA navigation « Parler de mon besoin » (desktop + mobile), retrait de l'entrée « Blog ».
- `app/pages/blog/index.vue` -- Modernisation du texte d'empty-state vers systèmes IA / automatisation.
- `app/components/terminal/programs/About.ts` -- Harmonisation de l'expérience globale à « 8+ ans ».

## Tasks & Acceptance

**Execution:**

- [x] `app/pages/index.vue` -- Remplacer le H1 par « Automatisez les processus qui font perdre du temps à votre équipe. » et le CTA primaire par « Parler d'un processus à automatiser » -- Supprimer l'abstraction "workflow" au 1er écran.
- [x] `app/pages/index.vue` -- Remplacer le titre H2 de la section preuves par « Des systèmes construits autour de problèmes réels » -- Résoudre la contradiction avec les badges de projets en cours/R&D.
- [x] `app/pages/index.vue` -- Ajuster le tableau `stats` : Stat 1 (`value: "8+"`, `label: "années d'expérience logicielle & dev"`), Stat 2 (`value: "100%"`, `label: "Full Stack de bout en bout"`) -- Exactitude d'expérience (2018-2026) et prise en compte de la stack multi-techno (Rust/Tauri/C++).
- [x] `app/pages/services.vue` -- Remplacer « Modèles d'IA & prompt engineering avec sorties typées » par « IA ciblée avec sorties structurées et contrôlées » -- Valoriser l'ingénierie fiable plutôt que le prompt bricolé.
- [x] `app/pages/services.vue` -- Ajouter sous le prix AI Care : « Niveau de monitoring et de support adapté au système et défini au devis. », remplacer « optimisation continue du flux » par « optimisations mineures selon le périmètre convenu », et ajuster « ajustements de prompts » en « calibrage et ajustement des consignes modèles » -- Éviter l'illusion de contrat de support illimité à 250 €/mois.
- [x] `app/components/HeaderComponent.vue` -- Remplacer le texte du bouton d'action CTA par « Parler de mon besoin » (desktop et mobile) -- Réduire la friction d'engagement pour les prospects froids ou recommandés.
- [x] `app/components/HeaderComponent.vue` -- Retirer `{ to: "/blog", label: "Blog", prefix: "~/" }` de `navLinks` -- Éliminer le cul-de-sac de navigation principale tant qu'aucun article n'est publié.
- [x] `app/pages/blog/index.vue` -- Mettre à jour la description d'empty-state pour évoquer l'ingénierie logicielle, les systèmes IA et l'automatisation métier -- Aligner le ton avec le positionnement actuel.
- [x] `app/components/terminal/programs/About.ts` -- Aligner `userInfo.experience` sur « 8+ ans » -- Cohérence avec les chiffres clés.
- [x] `app/data/site.ts` & `app/components/home/HomeStackMarquee.vue` -- Ajouter « automatisation » et « intelligence artificielle » en tête de liste de la stack (`SITE.skills` et `SKILL_LABEL_MAP`) pour affichage sur `/about` (#stack) et dans le bandeau défilant de la homepage -- Faciliter la compréhension pour les profils moins techniques.

**Acceptance Criteria:**

- **Given** un visiteur arrivant sur la page d'accueil (`/`), **When** il lit le Hero, **Then** le titre annonce « Automatisez les processus qui font perdre du temps à votre équipe. » et le CTA indique « Parler d'un processus à automatiser ».
- **Given** un visiteur consultant les preuves de la page d'accueil, **When** il observe le titre de la section et les statistiques, **Then** le titre est « Des systèmes construits autour de problèmes réels » et les chiffres affichent « 8+ années d'expérience logicielle & dev » et « 100% Full Stack de bout en bout ».
- **Given** un prospect examinant la page Services (`/services`), **When** il lit l'offre Niveau 2 et l'offre AI Care, **Then** la mention « prompt engineering » est absente au profit d'« IA ciblée avec sorties structurées et contrôlées », et la carte AI Care précise le cadrage au devis et les optimisations mineures convenues.
- **Given** la navigation du site (header desktop et tiroir mobile), **When** le menu est affiché, **Then** le bouton CTA affiche « Parler de mon besoin » et le lien « Blog » n'apparaît plus dans la navigation principale.

## Verification

**Commands:**

- `docker compose run --rm web sh -c "corepack enable && pnpm lint"` -- expected: 0 erreur ESLint / Stylelint.
- `docker compose run --rm web sh -c "corepack enable && pnpm typecheck"` -- expected: 0 erreur TypeScript vue-tsc.
- `docker compose run --rm web sh -c "corepack enable && pnpm generate"` -- expected: Génération statique Nitro réussie (13 routes pré-rendues).

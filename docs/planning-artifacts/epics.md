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

**Acceptance Criteria:**

**Given** les tokens dans `docs/design_system/tokens/*.css`
**When** on les porte vers `assets/scss/abstract/` (et/ou CSS vars globales) via `@use`
**Then** les valeurs (orange accent, surfaces aubergine, échelle d'espacement, rayons, ombres, motion) sont consommables depuis n'importe quel composant
**And** aucune valeur de couleur/espace/rayon n'est hardcodée dans le nouveau code

### Story 2.2: Polices et base dark-first

As a visiteur,
I want une base typographique et de fond cohérente,
So that le site adopte l'identité « OS de nuit » (UX-DR1, NFR1, NFR7).

**Acceptance Criteria:**

**Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans
**When** on configure `@font-face`/import et le reset/base dark-first
**Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long
**And** le fond par défaut est sombre (aucun thème clair) et lisible

### Story 2.3: Primitive ZButton

As a développeur,
I want un composant bouton conforme au DS,
So that les CTA sont cohérents (UX-DR2, FR3).

**Acceptance Criteria:**

**Given** la référence `components/core/Button.jsx` (+ `.d.ts`)
**When** on crée `ZButton.vue` (`<script setup>`)
**Then** les variantes (primary orange, dark) et tailles rendent conformément à la référence
**And** les états hover/press/focus suivent les tokens (orange → hover/active, nudge press)

### Story 2.4: Primitive ZCard

As a développeur,
I want un composant carte conforme au DS,
So that le contenu est présenté de façon cohérente (UX-DR3, FR3).

**Acceptance Criteria:**

**Given** la référence `Card.jsx` et les `ZCard*` existants
**When** on crée/refond `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline)
**Then** la carte rend conformément à la référence
**And** les usages existants de `ZCard*` sont migrés sans régression

### Story 2.5: Primitives ZBadge et ZTag

As a développeur,
I want des composants badge et tag conformes au DS,
So that les libellés et chips sont cohérents (UX-DR4, UX-DR5, FR3).

**Acceptance Criteria:**

**Given** les références `Badge.jsx` et `Tag.jsx`
**When** on crée `ZBadge.vue` et `ZTag.vue` (tag en radius pill)
**Then** ils rendent conformément aux références et stylent via tokens

### Story 2.6: Primitives ZInput et ZAvatar

As a développeur,
I want des composants champ et avatar conformes au DS,
So that les formulaires et identités visuelles sont cohérents (UX-DR6, UX-DR7, FR3).

**Acceptance Criteria:**

**Given** les références `Input.jsx` et `Avatar.jsx`
**When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill)
**Then** ils rendent conformément aux références et stylent via tokens

### Story 2.7: Iconographie

As a développeur,
I want un système d'icônes cohérent,
So that l'UI utilise des icônes au trait et les glyphes de marque (UX-DR10).

**Acceptance Criteria:**

**Given** l'approche DS (Lucide CDN + SVG inline)
**When** on intègre Lucide (`currentColor`), les glyphes sociaux en SVG inline et le logo diamant
**Then** les icônes héritent de la couleur du texte
**And** aucune police d'icône n'est introduite

### Story 2.8: Châssis global (header, footer, nav, socials)

As a visiteur,
I want un en-tête, un pied de page et une navigation refondus,
So that le site a un cadre cohérent sur toutes les pages (UX-DR11, FR4).

**Acceptance Criteria:**

**Given** le UI kit (Header/Footer) et les composants header/footer existants
**When** on refond le header fixe 56px (logo diamant), le footer 56px et la nav
**Then** ils rendent conformément au UI kit, dark-first et responsive mobile
**And** les hexagones sociaux sont présents (footer/contact) et la nav mène aux routes existantes + `/services`, `/contact`

---

## Epic 3: Page d'accueil

Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.

### Story 3.1: Hero Terminal (A)

As a visiteur,
I want un hero d'accueil en style terminal,
So that je perçois immédiatement l'identité de marque (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** la direction de hero Terminal (A) de `Home.jsx`
**When** on implémente le hero sur `/`
**Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne)
**And** un CTA principal mène à un parcours clé (ex. contact/about)

### Story 3.2: Aperçu services et stats

As a visiteur,
I want voir un aperçu des services et des chiffres clés,
So that je comprends rapidement l'offre (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** le contenu `data.js` (services, stats)
**When** on implémente les blocs aperçu services + stats sur `/`
**Then** les 3 services et les stats rendent conformément à `Home.jsx`
**And** un lien mène à la page Services

### Story 3.3: Projets sélectionnés

As a visiteur,
I want voir des projets sélectionnés,
So that j'évalue le travail de Simon (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** le contenu projets de `data.js`
**When** on implémente le bloc projets sur `/` avec `ZCard`
**Then** les projets sélectionnés rendent en cartes conformes au DS

---

## Epic 4: Page Services

Le visiteur comprend les trois offres et le process (route `/services`).

### Story 4.1: Route /services et cartes d'offre

As a visiteur,
I want une page Services avec les trois offres,
So that je comprends ce que Simon propose (UX-DR13, FR6).

**Acceptance Criteria:**

**Given** la référence `Services.jsx` et le contenu `data.js`
**When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA)
**Then** les 3 offres rendent conformément à la référence
**And** la route est accessible depuis la nav

### Story 4.2: Section process

As a visiteur,
I want voir les étapes du process,
So that je sais comment se déroule une collaboration (UX-DR13, FR6).

**Acceptance Criteria:**

**Given** les étapes du process dans `Services.jsx`/`data.js`
**When** on implémente la section process sur `/services`
**Then** les étapes rendent dans l'ordre conformément à la référence

---

## Epic 5: Page À-propos

Le visiteur découvre le parcours de Simon.

### Story 5.1: Portrait et bio

As a visiteur,
I want voir le portrait et la bio de Simon,
So that je connais la personne derrière le travail (UX-DR14, FR7).

**Acceptance Criteria:**

**Given** la référence `About.jsx`, le portrait et le contenu `data.js`
**When** on refond `/about` avec portrait + bio
**Then** la section rend conformément à la référence, en français 1re personne

### Story 5.2: Timeline, formation et stack

As a visiteur,
I want voir l'expérience, la formation et la stack technique,
So that j'évalue les compétences de Simon (UX-DR14, FR7).

**Acceptance Criteria:**

**Given** le contenu CV de `data.js`
**When** on implémente la timeline d'expérience, la formation et la stack sur `/about`
**Then** les trois sections rendent conformément à la référence
**And** la stack utilise des `ZTag`/`ZBadge`

---

## Epic 6: Blog

Le visiteur lit les articles (index + article).

### Story 6.1: Index du blog et empty-state

As a visiteur,
I want une liste d'articles soignée,
So that je trouve du contenu à lire (UX-DR15, FR8).

**Acceptance Criteria:**

**Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`
**When** on crée le dossier `content/` et on refond `/blog` (index + empty-state)
**Then** la liste rend en cartes conformes au DS
**And** l'empty-state français soigné s'affiche quand il n'y a aucun article

### Story 6.2: Vue article (prose + code)

As a visiteur,
I want lire un article avec une mise en forme lisible,
So that le contenu prose et code est agréable (UX-DR15, FR8).

**Acceptance Criteria:**

**Given** un article markdown dans `content/`
**When** on refond `/blog/[...slug]`
**Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS

---

## Epic 7: Page Contact

Le visiteur peut contacter Simon (route `/contact`).

### Story 7.1: Route /contact et formulaire

As a visiteur,
I want un formulaire de contact,
So that je peux écrire à Simon (UX-DR16, FR9).

**Acceptance Criteria:**

**Given** la référence `Contact.jsx` et la contrainte site statique (pas de backend)
**When** on crée la route `/contact` avec le formulaire (`ZInput`, `ZButton`)
**Then** le formulaire valide les champs côté front et affiche un feedback
**And** aucune dépendance backend n'est requise (NFR4)

### Story 7.2: Infos, CTA terminal et socials

As a visiteur,
I want des moyens de contact alternatifs,
So that je choisis comment joindre Simon (UX-DR16, FR9).

**Acceptance Criteria:**

**Given** la référence `Contact.jsx`
**When** on implémente la carte infos, le CTA terminal et les liens sociaux hexagonaux
**Then** ils rendent conformément à la référence
**And** le CTA terminal ouvre l'easter-egg terminal

---

## Epic 8: Terminal easter-egg restylé

L'easter-egg terminal fonctionne et adopte le style du DS.

### Story 8.1: Style TerminalWindow et Prompt

As a visiteur,
I want un terminal au style de la marque,
So that l'easter-egg s'intègre à l'identité (UX-DR8, UX-DR9, FR10).

**Acceptance Criteria:**

**Given** `components/terminal/` existant et les références `TerminalWindow.jsx`/`Prompt.jsx`
**When** on restyle la fenêtre (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) et le prompt vert (`anon.@jouan.ovh:~$`)
**Then** le terminal rend conformément au DS
**And** le caret clignotant est la seule animation en boucle

### Story 8.2: Préserver les commandes et l'ouverture

As a visiteur,
I want que toutes les commandes du terminal marchent,
So that l'easter-egg reste fonctionnel après refonte (FR10, NFR9).

**Acceptance Criteria:**

**Given** le sous-système terminal restylé
**When** on teste l'ouverture modale et les commandes
**Then** `help`, `about`, `skills`, `projets`, `contact`, `clear` répondent sans régression
**And** le terminal reste draggable

### Story 8.3: Migrer les composants terminal vers `<script setup>`

_(Ajoutée après la rétro Epic 7 — décision Simon : Epic 8 = refonte **complète** du terminal, pas seulement un restyle.)_

As a mainteneur du codebase,
I want que le sous-système terminal soit en `<script setup>` (plus d'Options API),
So that le dernier îlot legacy est résorbé sans aucune régression fonctionnelle (FR10, NFR9).

**Acceptance Criteria:**

**Given** `TerminalComponent.vue` / `TerminalManagerComponent.vue` en Options API
**When** on les réécrit en `<script setup lang="ts">` à comportement constant
**Then** plus aucune Options API dans le sous-système terminal, et commandes / drag / resize / ouverture (header + `/contact`) sans régression
**And** le rendu visuel (restyle 8.1) et `lint`/`typecheck`/`generate` restent identiques/verts

---

## Epic 9: Accessibilité & finitions motion

Passe transverse finale de qualité.

### Story 9.1: États interactifs cohérents

As a visiteur,
I want des états visuels clairs sur les éléments interactifs,
So that je sais ce qui est cliquable et focalisé (UX-DR17, FR11).

**Acceptance Criteria:**

**Given** les primitives et la navigation
**When** on vérifie les états focus/hover/press
**Then** chaque élément interactif a des états visibles conformes au DS
**And** le focus clavier est toujours visible

### Story 9.2: Motion réduit, contraste et clavier

As a visiteur,
I want une interface accessible,
So that je peux l'utiliser quelles que soient mes contraintes (UX-DR17, FR11).

**Acceptance Criteria:**

**Given** l'interface refondue
**When** on audite motion, contraste et navigation clavier
**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
**And** le contraste texte/fond est lisible et toutes les pages sont navigables au clavier

---

## Epic 10: Fin de refonte

_(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic. Le roadmap d'épics 1→9 est `done` mais la refonte n'est pas livrée ; cet épic la rend livrable et la met en production.)_

La refonte est **réellement livrée** : l'accessibilité résiduelle est bouclée et validée, le SEO est centralisé, la conformité légale est publiée, et le site est déployé en production sur `jouan.ovh` (chaîne gh-pages prouvée, `CNAME` intact). Source : `deferred-work.md` (section « → Epic 10 »). Barre qualité inchangée (pas de framework de test) : `pnpm lint` + `pnpm typecheck` + `pnpm generate` verts + vérification Chrome DevTools MCP.

### Story 10.1: Décision hébergement prod et dé-risquage du déploiement gh-pages

As a mainteneur du site,
I want trancher l'hébergement de production et prouver la chaîne de déploiement gh-pages (`CNAME` inclus) sur un dry-run,
So that la première mise en production de la refonte ne révèle pas de surprise (chaîne CI jamais prouvée, ~28 stories empilées).

**Acceptance Criteria:**

**Given** la cible prod `jouan.ovh` et la chaîne `pnpm generate` → `push-dir` vers `gh-pages`
**When** on tranche l'hébergement prod (domaine, branche de déploiement, `CNAME`) et on exécute un dry-run du déploiement depuis le staging (`develop`)
**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story

### Story 10.2: A11y sémantique résiduelle (home / services / contact)

As a visiteur utilisant un lecteur d'écran,
I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
So that la structure du site m'est annoncée correctement (FR12).

**Acceptance Criteria:**

**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)

### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)

As a visiteur,
I want savoir quand un lien ouvre un nouvel onglet,
So that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).

**Acceptance Criteria:**

**Given** les liens `target="_blank"` du site (hexagones sociaux header/footer, cartes projet, liens bio…)
**When** on factorise un helper de lien externe (icône + libellé sr-only « (ouvre dans un nouvel onglet) ») et on l'applique à tous les `_blank`
**Then** chaque lien `_blank` porte `rel="noopener"` + l'indication sr-only via le helper unique (aucune duplication ad hoc)
**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte

### Story 10.4: Validation a11y émulée OS-level et unification forced-colors

As a visiteur en contraste forcé ou motion réduit,
I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).

**Acceptance Criteria:**

**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte

### Story 10.5: SEO centralisé site-wide

As a visiteur partageant une page (ou un moteur d'indexation),
I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
So that le site est correctement indexé et présenté lors d'un partage (FR15).

**Acceptance Criteria:**

**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home, services, contact n'exposent que `title`+`description`)
**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact

### Story 10.6: Conformité légale (RGPD + mentions légales)

As a visiteur,
I want accéder à la politique de confidentialité et aux mentions légales,
So that je sais comment mes données (formulaire `/contact` → Web3Forms) sont traitées (FR16).

**Acceptance Criteria:**

**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
**When** on publie une page « politique de confidentialité » (base légale, finalité, durée de conservation, sous-traitant Web3Forms, droits des personnes) + une page mentions légales, liées depuis le footer et/ou le formulaire
**Then** les deux pages existent, sont liées et rendues en prerender, en français/vouvoiement/sans emoji (NFR6) et stylées au DS
**And** gate verte ; contenu cadré avec le skill `rgpd-france`

### Story 10.7: Mise en production réelle

As a Simon (propriétaire du site),
I want merger la refonte sur `main` et la déployer en production sur `jouan.ovh`,
So that la refonte est enfin livrée aux visiteurs (FR17).

**Acceptance Criteria:**

**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`

---

## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS

Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.

### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique

As a visiteur découvrant la page d'accueil,
I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).

**Acceptance Criteria:**

**Given** le projet en production sur `main` et la nécessité de développer de manière isolée sans régresser la prod
**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique

As a prospect technique ou client potentiel,
I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).

**Acceptance Criteria:**

**Given** la page d'accueil avec son atmosphère en place
**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
**And** le Hero commercial affiche en typographie Ubuntu :
  - Sur-titre `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
  - Titre principal `Développeur Full Stack TypeScript`
  - Sous-titre orienté création et évolution d'applications web et SaaS (Nuxt, NestJS, PostgreSQL)
  - Badge de statut de disponibilité vérifié avec puce pulsée et lien externe vers le profil Malt (`<ZExternalLink>`)
  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

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

### Story 11.6: Polissage visuel, fidélité maquette Awwwards & interactions dynamiques

As a visiteur découvrant la page d'accueil de jouan.ovh,
I want retrouver l'impact visuel immersif, le raffinement typographique et les interactions micro-cinétiques de la maquette Awwwards (hero sans rupture, header transparent puis flouté au scroll, logo officiel blanc, boutons généreux et magnétiques, cartes en 3D tilt, statistiques contrastées, carte CTA ample et aérée, footer parfaitement lisible),
So that l'expérience soit véritablement au niveau d'un portfolio primé Awwwards et reflète une qualité d'ingénierie web et de design irréprochable (FR18, FR20, FR22, FR23, FR25, FR27, UX-DR18, UX-DR20, UX-DR22, UX-DR24, UX-DR25, NFR1, NFR2, NFR11, NFR12).

**Acceptance Criteria:**

**Given** la maquette de référence `Home - Awwwards.html` et les retours d'évaluation visuelle
**When** on implémente la passe de polissage UX/UI sur la page d'accueil et le layout
**Then** `.hero` a un fond 100% transparent sur `min-height: 100vh` sans dégradé opaque de coupure, avec un titre h1 ample (`clamp(2.6rem, 6.4vw, 5.2rem)`) et ses accents en orange italique
**And** le header démarre 100% transparent sans bordure au repos (`scrollY <= 20`) puis devient flouté translucide (`.stuck`) au scroll avec barre de progression de défilement discrète
**And** le logo officiel wireframe blanc `logo_white.png` remplace l'icône gemme orange dans le header
**And** les boutons (`ZButton`) gagnent des dimensions généreuses (hauteur 46-48px, padding étendu) et un micro-effet magnétique fluide desktop neutralisé sous reduced-motion
**And** les cartes de services et de projets intègrent l'effet 3D tilt au mouvement de la souris (neutralisé sous reduced-motion)
**And** les 3 cartes statistiques (`11`, `100%`, `QA`) ont un fond de carte visible et des chiffres en blanc contrasté `var(--text-strong)` parfaitement lisibles
**And** le bloc CTA final `.cta` est aéré (`padding: clamp(48px, 7vw, 84px) var(--space-6)`), avec son halo lumineux radial supérieur et sa typographie h2 valorisée
**And** le footer rehausse le contraste de l'ensemble de ses libellés et liens pour une lisibilité WCAG AA irréprochable
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)



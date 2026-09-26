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
  - docs/specs/spec-repositionnement-ia/SPEC.md
  - docs/specs/spec-repositionnement-ia/messaging-matrix.md
  - docs/specs/spec-repositionnement-ia/services-and-pricing.md
  - docs/specs/spec-repositionnement-ia/projects-showcase.md
  - docs/jouan-ovh-offre-v1-brief-codex.md
  - AGENTS.md
  - docs/specs/spec-theme-light-dark/SPEC.md
  - docs/specs/spec-theme-light-dark/technical-architecture.md
  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
  - docs/specs/spec-analytics-search-console/SPEC.md
  - docs/specs/spec-analytics-search-console/tracking-plan.md
  - docs/specs/spec-analytics-search-console/compliance-gdpr.md
  - docs/specs/spec-analytics-search-console/seo-verification.md
  - docs/jouan-ovh-offre-commerciale-v1.1-updated.md
  - docs/planning-artifacts/sprint-change-proposal-2026-09-18.md
  - docs/specs/spec-blog-editorial/SPEC.md
  - docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md
  - docs/planning-artifacts/sprint-change-proposal-2026-09-25.md
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

#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
FR28: Source de données unique (`site.ts`), assainissement sémantique et cohérence globale du profil (nouveau titre, bio, localisation « France · Remote », stack ciblée, vitrine Keova Signal / Debrief / Devis-Assist, élimination de « Ingénieur IA » et « ERP équestre »). _(CAP-1)_
FR29: Page d'accueil — Hero commercial cinétique & Terminal interactif (H1 « Automatisez les workflows qui freinent votre équipe », sous-titre d'intégration de systèmes, CTAs vers workflow, commandes terminal `whoami`, `cat focus.txt`, `ls ~/systems`). _(CAP-2)_
FR30: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production » (Automatisation, Agents IA, Applications sur mesure, suivi de « Un agent qui fonctionne trois fois n'est pas encore un système fiable » articulé sur 4 piliers). _(CAP-3)_
FR31: Page d'accueil — Vitrine des 3 projets phares (Keova Signal avec dashboard réel HD, Debrief 100% on-device avec capture HD, Devis-Assist avec pipeline OCR BTP et matching pg_trgm, sans faux ROI, relégation des anciens projets en archives/parcours). _(CAP-4)_
FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
FR33: Page À propos — Trajectoire professionnelle et rigueur QA (métrologie industrielle → QA logicielle → Full Stack → systèmes IA en production). _(CAP-6)_
FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
FR35: SEO centralisé, OpenGraph et Schema.org/JSON-LD alignés sur « Systèmes IA, agents & automatisation métier ». _(CAP-8)_
FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_

#### Epic 13 — Thème Light & Dark (SPEC-theme-light-dark)
FR37: Palette de thèmes et tokens sémantiques complets (mode sombre aubergine par défaut et mode clair « Papier technique / Crème solaire », sanctuarisation du terminal sombre, contrastes WCAG AAA/AA). _(CAP-1)_
FR38: Détection automatique et synchronisation réactive de la préférence système (`prefers-color-scheme`) en temps réel sans rechargement de page. _(CAP-2)_
FR39: Surcharge utilisateur et persistance locale sous `localStorage` (`jouan_theme_mode`) conservant le choix d'une visite à l'autre. _(CAP-3)_
FR40: Composant de bascule ternaire `ThemeToggle` dans le Header desktop (`hdr__dock-right` à gauche de « Disponible ») et dans le tiroir mobile, avec cycle `Système → Sombre → Clair → Système`, icônes vectorielles et 0 emoji. _(CAP-4)_
FR41: Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC dans le `<head>` avant le montage client). _(CAP-5)_
FR42: Accessibilité, focus visible, navigation clavier et support de `forced-colors` Windows High Contrast. _(CAP-6)_

#### Epic 14 — Analytics Privacy-First, RGPD & Google Search Console (SPEC-analytics-search-console)
FR43: Initialisation asynchrone et isolée de PostHog Cloud EU (`https://eu.i.posthog.com`) côté client via Nuxt runtimeConfig et respect strict de Do Not Track. _(CAP-1)_
FR44: Session Replay sécurisé avec masquage systématique des champs d'entrée (`mask_all_inputs: true`, exclusion native `ph-no-capture`). _(CAP-2)_
FR45: Bandeau / toast de consentement RGPD sobre inspiré du terminal (`// telemetry:`), opt-in explicite, persistance locale et lien de révocation permanent au footer. _(CAP-4)_
FR46: Plan de taggage exhaustif des interactions métier (navigation, scroll depth, clics CTA offres IA, formulaire contact Web3Forms, terminal interactif, blog, liens externes). _(CAP-3)_
FR47: Observabilité SEO via vérification DNS TXT chez OVH, génération dynamique du `sitemap.xml` et déclaration conforme dans `robots.txt`. _(CAP-5, CAP-6)_
FR48: Outillage agentic MCP PostHog et validation Docker sans régression (`lint`, `typecheck`, `generate`). _(CAP-7, CAP-8)_

#### Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention (Offre V1.1)
FR49: Page d'accueil — Retrait de toute mention « À partir de 3 500 € HT », intégration des liens contextuels vers les types de systèmes et insertion de la phrase de réassurance sur le dimensionnement selon le workflow réel. _(CAP-1)_
FR50: Page Services — Restructuration complète des offres de build en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel. _(CAP-2)_
FR51: Page Services — Section dédiée AI Care après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes (Diagnostic gratuit 20-30 min, Cadrage, Construction & intégration, Exploitation & mesure). _(CAP-3)_
FR52: Cohérence globale, SEO, accessibilité et validation transversale — Formulaire de contact sans budget imposé, alignement des métadonnées SEO, parité des thèmes clair/sombre et validation de la gate Docker 100% verte. _(CAP-4)_

FR53: Migration de la maintenance SEO vers les modules Nuxt SEO officiels — Sitemap et Robots générés au build, découverte des routes `@nuxt/content`, configuration Site Config partagée et suppression des propriétaires concurrents. _(CAP-9)_
FR54: Exposition AEO du site public — `llms.txt`, `llms-full.txt`, versions Markdown, politique OpenAI explicite et mesure du trafic ChatGPT sans promesse de classement. _(CAP-10)_

### NonFunctional Requirements

NFR1: Baseline DS à ratifier au checkpoint Epic 14 — aucune migration ou changement de thème dans le lot blog ; le mode sombre et le terminal sanctuarisé restent les références de contraste.
NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
NFR5: Déploiement préservé — `CNAME` + chaîne `pnpm generate` sous Docker → `gh-pages` non régressés ; aucun.handler manuel ni domaine codé en dur.
NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
NFR13: Sobriété & Zéro Emoji — aucun emoji dans les contenus et composants (NFR6), aucun visuel générique d'IA (pas de robots, cerveaux lumineux ou gradients néon SaaS).
NFR14: Confidentialité & Propriété intellectuelle — respect strict des dépôts privés (`zohac/*`), aucun lien sortant 404, mention transparente des statuts réels.
NFR15: Exécution Docker stricte — toute compilation et validation de gate s'effectue dans le conteneur Docker.
NFR16: Performance SSG & Zéro régression — génération statique Nitro préservée pour toutes les routes publiques indexables, les routes Content et les artefacts SEO/AI, sans hypothèse sur un nombre total de routes.
NFR17: Exécution stricte de la suite de validation dans l'environnement Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
NFR18: Zéro emoji dans les libellés, composants ou infobulles du sélecteur de thème (règle NFR6).
NFR19: Sanctuarisation absolue du terminal (Terminal Hero et fenêtres flottantes conservent impérativement leur fond sombre aubergine `#2E0024` et leurs couleurs syntaxiques).
NFR20: Compatibilité SSG totale sous GitHub Pages sans dépendance dynamique serveur.

### Additional Requirements

- Gestionnaire de paquets **pnpm** (corepack enable) sous Docker ; build statique `pnpm generate` → `.output/public` ; déploiement automatique GitHub Pages via `.github/workflows/cd.yml`.
- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
- Blog via `@nuxt/content` markdown — dossier `content/`.
- Barre de qualité stricte = Docker-only gate (`pnpm lint && pnpm typecheck && pnpm generate`) avec 0 erreur, routes publiques/Content et artefacts SEO/AI vérifiés.
- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
- SEO/AI : les artefacts de sitemap, robots, `llms.txt` et Markdown sont régénérés au build et vérifiés par la CI, sans double propriétaire de route.
- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.

### Planning hygiene — critères historiques supersédés

Les critères anciens qui mentionnent `yarn`, des handlers sitemap/robots manuels, des URL de production codées en dur ou un thème dark-only sont conservés uniquement comme historique. Pour tout nouveau lot, la source actuelle est le gate Docker `pnpm`, les propriétaires Nuxt SEO/ Site Config et le design system à ratifier au checkpoint Epic 14.

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
UX-DR28: Intégration des captures d'écran réelles HD de Keova Signal et Debrief dans `public/images/projects/` avec ratios et bordures conformes au Design System.
UX-DR29: Grille modulaire pour le bloc différenciateur « Prototype → Production » (4 piliers Données, Fiabilité, IA, Exploitation).
UX-DR30: Grille tarifaire transparente sur `/services` dissociant honoraires forfaitaires et coûts variables d'APIs/tokens tiers.
UX-DR31: Formulaire `/contact` allégé et orienté description textuelle de workflow sans questions invasives de budget au premier contact.
UX-DR32: Implémentation de la palette de tokens clairs `--surface-*-light` (fond crème `#FAF8F4`, cartes blanches `#FFFFFF`, encres aubergine `#271524` et `#473644`, orange contrasté `#D94F00`).
UX-DR33: Composant `ThemeToggle.vue` compact (36x36px desktop, 40x40px mobile), 3 icônes vectorielles inline (`monitor`, `moon`, `sun`) déclarées dans `ZIcon.vue`, animations d'icônes débrayées sous `prefers-reduced-motion`.
UX-DR34: Placement dans `HeaderComponent.vue` immédiatement à gauche du badge d'état `.hdr__status-badge` dans `.hdr__dock-right` et dans `.hdr__menu-status`.
UX-DR35: Attributs d'accessibilité dynamiques (`aria-label` descriptif de l'état et de la prochaine action, `title` sans emoji, live region).

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
FR28: Epic 12 — Source de vérité site.ts, assainissement sémantique & profil
FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
FR37: Epic 13 — Palette de thèmes et tokens sémantiques complets (mode clair crème, terminal sombre)
FR38: Epic 13 — Détection et synchronisation réactive de la préférence système (prefers-color-scheme)
FR39: Epic 13 — Surcharge utilisateur et persistance locale (localStorage)
FR40: Epic 13 — Bouton de bascule ternaire ThemeToggle dans le Header (desktop et mobile)
FR41: Epic 13 — Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC)
FR42: Epic 13 — Accessibilité, focus visible, navigation clavier et mode forced-colors
FR43: Epic 14 — Initialisation PostHog Cloud EU asynchrone côté client et respect DNT
FR44: Epic 14 — Session Replay sécurisé et masquage strict des données de formulaire
FR45: Epic 14 — Toast de consentement RGPD inspiré du terminal et gestion des cookies
FR46: Epic 14 — Plan de taggage exhaustif (parcours IA, formulaire, terminal, blog, liens)
FR47: Epic 14 — Observabilité SEO, vérification DNS OVH, sitemap.xml et robots.txt
FR48: Epic 14 — Intégration MCP PostHog et validation Docker complète
FR53: Epic 14 — Migration SEO Nuxt automatisée avec `@nuxtjs/sitemap` et `@nuxtjs/robots`
FR54: Epic 14 — AEO et découvrabilité IA avec AI Ready, Markdown et politique OpenAI
FR55: Epic 16 — Contrat de contenu T0, resolver de visibility et migration contrôlée
FR56: Epic 16 — Homepage `/blog` minimale, route article responsive et non-régression homepage
FR57: Epic 16 — FR-18, checklist de preuve, promotion contrôlée et gate E1
FR58: Epic 16 — Fixtures, validation Docker, navigateur/a11y, rollback et non-régression Epic 14

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

### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36 _(NFR13 à NFR16, UX-DR28 à UX-DR31)_

### Epic 13: Thème Light & Dark et Bascule Utilisateur
Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
**FRs covered:** FR37, FR38, FR39, FR40, FR41, FR42 _(NFR17 à NFR20, UX-DR32 à UX-DR35)_

### Epic 14: Télémétrie respectueuse de la vie privée, SEO Nuxt, AEO et Google Search Console
Le visiteur bénéficie d'un contrôle transparent sur sa vie privée via une invite de consentement sobre inspirée du terminal, tandis que Simon Jouan dispose d'une observabilité complète sur l'audience, la restitution de parcours (rejeu de session sécurisé) et les conversions de l'offre IA, soutenue par une infrastructure SEO statique maintenue par les modules Nuxt SEO, une politique de découvrabilité IA explicite et des artefacts lisibles par les agents sans promesse de classement.
**FRs covered:** FR43, FR44, FR45, FR46, FR47, FR48, FR53, FR54 _(CAP-1 à CAP-10)_

### Epic 16: Plateforme éditoriale durable — contrat, publication et patrimoine

Simon peut publier et préserver une preuve technique fiable dans une boucle éditoriale statique, sans étendre l'Epic 6 historique ni concurrencer les propriétaires Epic 14. Le premier périmètre est T0 + E1 ; hubs, related, projets, AEO étendue, RSS, analytics enhancements et curation restent R1 conditionnels. Epic 16 est backlog tant que le checkpoint Epic 14, la SPEC et les contrats D-01 à D-08 ne sont pas ratifiés.

**FRs covered:** FR55 à FR58 _(CAP-1, CAP-2, CAP-4, CAP-6 à CAP-9)_

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

> **Baseline historique conservée.** Epic 6 est clôturée après ses deux stories terminées. Les capacités éditoriales durables sont suivies dans Epic 16 ; ne pas ouvrir de story 6.3+.

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
**Then** l'arrière-plan anime un dégradé fluide immersif (shader WebGL Flow Chrome accéléré avec déformation fbm, ou repli automatique en pur CSS) avec grille de points et vignette, neutralisé sous `prefers-reduced-motion: reduce`
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

**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, TestCafé, Docker, REST API, Vitest)
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

---

## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier

Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.

### Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale

As a visiteur du site,
I want consulter un profil et des métadonnées alignés sur les systèmes IA et l'automatisation métier,
So that j'identifie la spécialisation de Simon et ne trouve plus de références obsolètes (FR28, NFR13, NFR14).

**Acceptance Criteria:**

**Given** le fichier source unique `app/data/site.ts` et le composant Footer
**When** on met à jour les données de `SITE` :
  - `profile.role` devient `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
  - `profile.location` devient `France · Remote` (suppression définitive de `Rouen, France`)
  - `profile.bio` reflète la promesse d'automatisation des workflows et d'industrialisation IA
  - `skills` met en avant la stack ciblée (`TypeScript`, `Node.js 22`, `NestJS`, `Nuxt`, `PostgreSQL`, `MCP`, `Docker`, `whisper.cpp`, `sherpa-onnx`, `llama.cpp`, `BullMQ`, `Mistral OCR`)
  - `projects` intègre les entrées de `keova-signal` (interne/privé), `debrief` (R&D/privé) et `devis-assist` (architecture validée/privé) avec leurs tags et statuts réels
  - Les projets historiques (`keova-app`, `tryon`, `nodium`, web) sont maintenus dans une catégorie d'archives ou parcours, avec correction de la mention « ERP équestre » remplacée par « Application SaaS de gestion opérationnelle » et suppression du terme « Ingénieur IA » au profit de « Créateur · R&D agents IA »
**Then** aucun terme « Ingénieur IA » ni « ERP équestre » ne subsiste dans `site.ts` et les pieds de page
**And** la validation Docker (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues).

### Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif

As a prospect découvrant la page d'accueil,
I want lire immédiatement une promesse orientée vers la résolution de mes irritants métier et voir un terminal interactif cohérent,
So that je comprends en 5 secondes ce que Simon apporte à mon équipe (FR29, NFR13, NFR15, UX-DR28).

**Acceptance Criteria:**

**Given** la page d'accueil `app/pages/index.vue` et le composant `HomeHeroTerminal.vue`
**When** on charge la page d'accueil
**Then** le hero affiche en typographie Ubuntu et SCSS tokens :
  - Sur-titre : `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`
  - H1 : `Automatisez les workflows qui freinent votre équipe.`
  - Sous-titre : `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`
  - Ligne de crédibilité : `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`
  - CTA principal : `<ZButton to="/contact">Identifier un workflow à automatiser</ZButton>`
  - CTA secondaire : `<ZButton variant="secondary" href="#systems">Voir mes systèmes IA</ZButton>` (ou route `/services`)
  - Signal de disponibilité : `Disponible pour nouvelles missions freelance`
**And** la séquence de frappe du terminal hero exécute les nouvelles commandes :
  - `$ whoami` -> `Simon Jouan — Développeur Full Stack spécialisé IA & automatisation`
  - `$ cat focus.txt` -> `Systèmes IA · automatisation métier · agents · applications Full Stack · QA`
  - `$ ls ~/systems` -> `keova-signal/ debrief/ devis-assist/`
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.

### Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »

As a visiteur évaluant l'offre de services sur la page d'accueil,
I want découvrir les 3 piliers d'accompagnement et les arguments prouvant la viabilité des systèmes déployés,
So that je distingue le travail industriel d'une simple démonstration de chatbot fragile (FR30, NFR13, UX-DR29).

**Acceptance Criteria:**

**Given** la section services d'accueil et le nouveau bloc différenciateur
**When** le visiteur fait défiler la page d'accueil
**Then** la section vitrine expose 3 cartes `ZCard` d'offres :
  1. *Automatisation de processus métier* (cartographie de workflow, tâches répétitives, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`)
  2. *Agents IA intégrés à vos outils* (lecture, interprétation, synthèse, validation humaine, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`)
  3. *Applications IA sur mesure* (produits dédiés, toute la chaîne logicielle, tags `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`)
**And** chaque carte redirige vers `/services`
**And** immédiatement après, le bloc différenciateur `.prototype-to-prod` expose :
  - Eyebrow `<span class="eyebrow">// au-delà de la démo</span>`
  - H2 `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
  - Texte explicatif valorisant le background Full Stack et QA (gestion des erreurs, retries, logs, tests, coûts, monitoring, sécurité)
  - 4 piliers techniques : *Données*, *Fiabilité*, *IA*, *Exploitation*
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.

### Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)

As a prospect technique en quête de preuves de compétences,
I want examiner 3 réalisations concrètes résolvant des cas réels avec visuels et stacks précises,
So that je sois convaincu de la faisabilité de mon propre projet sans être trompé par de faux indicateurs (FR31, NFR14, UX-DR28).

**Acceptance Criteria:**

**Given** la section des projets de la page d'accueil
**When** on rend la vitrine des projets phares
**Then** les 3 projets sont affichés sous forme de cartes riches :
  - **Keova Signal** : statut `● Système interne / En développement actif`, accroche `Détecter le bon prospect au bon moment`, description courte (Open Data Sirene, Token Bucket, scraping éthique, double étage de scoring Zod, serveur MCP 10 outils), tags (`Node.js 22` · `TypeScript` · `MCP Server` · `PostgreSQL` · `Cheerio` · `Docker`), capture réelle HD `keova-signal-dashboard.png` (via `<NuxtImg>`), badge `Projet interne / Dépôt privé` sans lien externe mort
  - **Debrief** : statut `◐ R&D / En développement`, accroche `Transformer un rendez-vous commercial en apprentissage exploitable`, description courte (application desktop privacy-first, 100% on-device, whisper.cpp large-v3, sherpa-onnx, NER composite GLiNER/CamemBERT, llama-server Gemma 4 IT), tags (`Tauri` · `Rust` · `whisper.cpp` · `sherpa-onnx` · `llama.cpp` · `Gemma 4`), capture réelle `debrief-dashboard.png`, badge `Dépôt privé`
  - **Devis-Assist** : statut `○ Produit / Architecture BMM validée`, accroche `Transformer un historique de devis BTP en aide au chiffrage`, description courte (Mistral OCR 3, file BullMQ/Redis, catalogue de services canoniques BTP avec Data Flywheel et matching pg_trgm), tags (`NestJS` · `Nuxt UI 4` · `PostgreSQL pg_trgm` · `Mistral OCR` · `BullMQ`), badge `Dépôt privé`
**And** aucun ROI client ni chiffre d'affaires inventé n'apparaît
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.

### Story 12.5: Page Services — Restructuration complète des offres & Processus en 4 étapes

As a client potentiel prêt à s'engager,
I want consulter le déroulement type d'une mission et des tarifs forfaitaires clairs,
So that je puisse budgéter mon besoin sans crainte de coûts cachés (FR32, NFR13, UX-DR30).

**Acceptance Criteria:**

**Given** la page `app/pages/services.vue`
**When** on charge la page
**Then** le hero affiche :
  - H1 : `Des systèmes IA construits autour de vos vrais processus métier.`
  - Intro : `Je pars d’un workflow existant, pas d’une technologie à placer... L’IA intervient uniquement là où elle apporte réellement quelque chose.`
**And** les 3 offres commerciales sont détaillées :
  1. **AI Workflow Sprint** (Offre principale) : `À partir de 3 500 € HT`. Règle : `Un Sprint = un workflow prioritaire`. Liste complète des livrables inclus (diagnostic, cartographie, KPI, architecture, dev, intégrations, tests, MEP, documentation, mesure initiale).
  2. **AI Workflow Blueprint** : `À partir de 750 € HT`. Cadrage préalable pour problématique complexe (processus actuel, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, estimation).
  3. **AI Care** : `À partir de 490 € HT / mois`. Maintien en condition opérationnelle (monitoring, maintenance, support, veille coûts et modèles), avec exclusion explicite des consommations tierces d'APIs/tokens refacturées au réel.
**And** le processus en 4 étapes est balisé sémantiquement en liste ordonnée `<ol>` :
  - Étape 1 : *Diagnostic* (20-30 min pour qualifier le problème) avec CTA `Identifier un workflow`
  - Étape 2 : *Cadrage* (workflow cible, KPI, architecture)
  - Étape 3 : *Construction & intégration* (développement, tests sur cas réels, MEP)
  - Étape 4 : *Suivi & amélioration* (monitoring, maintenance, mesure des résultats)
**And** l'ancienne offre WordPress principale est supprimée de la page
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.

### Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide

As a prospect souhaitant vérifier la crédibilité du profil et initier une demande ciblée,
I want comprendre le lien entre le parcours qualité/métrologie de Simon et la robustesse de ses systèmes IA, et pouvoir qualifier mon workflow dans le formulaire,
So that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR15, NFR16, UX-DR31).

**Acceptance Criteria:**

**Given** les pages `app/pages/about.vue`, `app/pages/contact/index.vue`, le layout global et les métadonnées SEO
**When** on navigue sur le site
**Then** la page À propos (`/about`) :
  - Présente le titre `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
  - Relie les 12 ans de métrologie industrielle et l'expérience QA aux réflexes de fiabilité des systèmes IA (reproductibilité, gestion des cas limites, observabilité)
  - Expose le bloc philosophie (« Je ne pars pas de "où mettre de l'IA ?", je pars de "qu'est-ce qui prend du temps ?" »)
  - Mentionne l'expérience Linkizz dans le parcours selon les données réelles
**And** le CTA final présent sur les pages de conversion affiche :
  - Eyebrow : `$ ./workflow --inspect`
  - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
  - Texte d'accompagnement orienté diagnostic pragmatique
  - Boutons d'action `Identifier un workflow à automatiser` (vers `/contact`) et `M’écrire directement`
**And** le formulaire de contact (`/contact`) est orienté qualification de workflow (champs processus à améliorer, fonctionnement actuel, répétition)
**And** `usePageSeo` met à jour les balises de titres (`Simon Jouan — Systèmes IA, agents & automatisation métier`), descriptions et métadonnées canoniques/OpenGraph sur l'ensemble des 13 routes
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur (0 ESLint/Stylelint, 0 typecheck TypeScript, 13 routes statiques pré-rendues).

## Epic 13: Thème Light & Dark et Bascule Utilisateur

Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.

### Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal

As a visiteur préférant un environnement d'affichage clair,
I want que les variables CSS du design system exposent une palette claire « Papier technique / Crème solaire » tout en préservant le terminal sombre,
So that l'application s'adapte sans rupture de style ni dénaturation de l'immersion CLI (FR37, UX-DR32, NFR17, NFR19).

**Acceptance Criteria:**

**Given** le fichier `app/assets/scss/abstract/_root.scss`
**When** on déclare le sélecteur `[data-theme="light"]`
**Then** les alias sémantiques de surfaces sont surchargés :
  - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4`)
  - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6`)
  - `--bg-card: hsl(0deg 0% 100%)` (`#FFFFFF`)
  - `--bg-elevated: hsl(38deg 30% 99%)` (`#FFFEFB`)
  - `--bg-input: hsl(38deg 15% 95%)` (`#F5F3EE`)
**And** les alias sémantiques d'encre garantissent un contraste WCAG AAA :
  - `--text-strong: hsl(320deg 30% 12%)` (`#271524`, ratio > 14:1)
  - `--text-body: hsl(320deg 18% 26%)` (`#473644`, ratio > 8:1)
  - `--text-muted: hsl(320deg 10% 44%)` (`#756773`, ratio > 4.5:1)
**And** l'accent orange est adapté au contraste sur fond clair (`--accent: hsl(24deg 95% 44%)`, `#DA5207`, ratio AA > 4.5:1)
**And** les conteneurs de terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: var(--aubergine-deep)`, `#2E0024`) et leurs couleurs de texte clair, restant insensibles au mode clair global
**And** la suite `docker compose run --rm web sh -c "corepack enable && pnpm lint"` est validée avec 0 erreur.

### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC

As a visiteur naviguant sur `jouan.ovh`,
I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
So that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20).

**Acceptance Criteria:**

**Given** l'infrastructure client Nuxt 4
**When** on initialise le thème dans l'application
**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
**And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.

### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

As a utilisateur sur desktop ou smartphone,
I want disposer d'un bouton de bascule compact placé à gauche du statut « Disponible » dans le dock d'état et dans le menu mobile,
So that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).

**Acceptance Criteria:**

**Given** le composant `HeaderComponent.vue` et `ZIcon.vue`
**When** on affiche la barre de navigation
**Then** 3 icônes vectorielles inline sans emoji (`monitor`, `moon`, `sun`) sont déclarées dans `app/components/ui/ZIcon.vue`
**And** le composant `app/components/ui/ThemeToggle.vue` est créé :
  - Format compact (36x36px desktop, 40x40px mobile) avec bordure subtile
  - Clic / activation clavier cycle l'état : `system → dark → light → system`
  - Affiche l'icône correspondant au mode courant
  - Dispose d'un `aria-label` dynamique décrivant l'état actif et la prochaine action
  - Supporte le focus visible (`--ring-accent`), la navigation clavier (`Tab`, `Entrée`, `Espace`), le mode `forced-colors: active` et désactive toute rotation d'icône sous `prefers-reduced-motion: reduce`
**And** le composant est intégré dans `HeaderComponent.vue` :
  1. Desktop : dans `.hdr__dock-right`, immédiatement à gauche de `.hdr__status-badge` (« Disponible »)
  2. Mobile : dans `.hdr__menu-status`, aligné avec le badge de statut
**And** la suite de lint et typecheck passe avec 0 erreur.

### Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG

As a développeur garantissant la robustesse de production,
I want vérifier le rendu esthétique des pages sous le thème clair et exécuter la gate Docker complète,
So that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régressions (FR37–FR42, NFR17, NFR19).

**Acceptance Criteria:**

**Given** l'ensemble des routes statiques de `jouan.ovh`
**When** on bascule le thème sur `light`
**Then** toutes les pages (Accueil, Services, À propos, Blog, Contact) affichent un rendu harmonieux :
  - Les cartes blanches (`#FFFFFF`) se détachent nettement du fond crème (`#FAF8F4`)
  - Les encres aubergine et les liens orange offrent une lisibilité contrastée conforme WCAG AA/AAA
  - L'arrière-plan atmosphérique d'accueil (`.atmos`) atténue son opacité pour éviter toute interférence de lecture
  - Le Terminal Hero et le terminal flottant demeurent en mode sombre permanent avec leur prompt vert
**And** le changement de thème est persistant après rechargement de page ou changement d'URL
**And** la suite de validation Docker complète réussit avec 0 erreur :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```
  *(0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, 13 routes statiques pré-rendues avec succès).*

---

## Epic 14: Télémétrie respectueuse de la vie privée (PostHog EU), consentement RGPD et Google Search Console

Simon Jouan dispose d'un suivi précis et respectueux du trafic, du comportement des visiteurs (rejeu de session masqué) et de la conversion de l'offre commerciale IA, tout en garantissant une conformité RGPD exemplaire (invite de consentement terminal) et une infrastructure de recherche prête pour Google Search Console (`sitemap.xml`, `robots.txt`, procédure DNS documentée). La validation DNS et la soumission du sitemap restent à exécuter.

> **Point de contrôle documentaire.** Les six tâches de l'Epic 14 sont terminées et la réconciliation documentaire est enregistrée dans `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md`. Les réserves externes (validation Google Search Console, preuve exhaustive des événements, mesure AEO et inspection visuelle du rejeu de session) restent visibles et ne sont pas déclarées acquises. L'Epic 16 consomme ce point de contrôle et ne modifie pas les propriétaires SEO/AEO/vie privée sans décision séparée. Les critères manuels de 14.4 sont supersédés par 14.5.

### Story 14.1: Fondations PostHog EU, Composable de Consentement & Toast Cookie Terminal

As a visiteur du site `jouan.ovh`,
I want être informé sobrement de la télémétrie de navigation et pouvoir accepter ou refuser les cookies/analytics via une invite terminal non intrusive,
So that mes droits à la vie privée soient respectés sans dégrader l'expérience esthétique du portfolio (FR43, FR45, NFR6, CAP-1, CAP-4).

**Acceptance Criteria:**

**Given** l'infrastructure client Nuxt 4 et l'environnement Docker
**When** on intègre la dépendance client PostHog
**Then** le paquet `posthog-js` est installé dans le conteneur Docker sans altérer l'hôte
**And** les variables `runtimeConfig.public.posthogKey` et `runtimeConfig.public.posthogHost` (défaut `https://eu.i.posthog.com`) sont déclarées dans `nuxt.config.ts`
**And** le composable `app/composables/useConsent.ts` est créé :
  - Gère l'état réactif (`consentState: 'unknown' | 'accepted' | 'declined'`)
  - Mémorise le choix dans `localStorage` (`jouan_consent_telemetry`)
  - Détecte le signal navigateur `navigator.doNotTrack === '1'` et bascule automatiquement en mode `declined`
  - Expose `accept()`, `decline()` et `openConsentModal()`
**And** le composant `app/components/ui/ConsentToast.vue` est créé :
  - Présentation flottante en bas d'écran conforme au Design System sombre aubergine (`--surface-raised`, `--border-subtle`)
  - Préfixe stylisé terminal `// telemetry:`
  - Zéro emoji (NFR6)
  - Bouton `Accepter` (active PostHog et Session Replay) et bouton `Refuser`
  - Lien discret `En savoir plus` vers `/confidentialite`
**And** le composant `FooterComponent.vue` intègre un lien discret « Gestion des cookies » permettant de rouvrir le sélecteur à tout moment
**And** le plugin `app/plugins/posthog.client.ts` initialise PostHog uniquement côté navigateur (`import.meta.client`), en mode `opt_out_capturing_by_default: true` tant que le consentement n'est pas accordé, et s'exécute de façon non bloquante.

### Story 14.2: Session Replay sécurisé, Masquage des Données Sensibles & Mise à Jour RGPD

As a développeur et visiteur,
I want que les sessions enregistrées ne capturent aucune donnée personnelle ou texte confidentiel,
So that l'analyse UX s'effectue dans le respect absolu du RGPD et du secret des échanges (FR44, NFR14, CAP-2, CAP-3).

**Acceptance Criteria:**

**Given** le plugin `app/plugins/posthog.client.ts` et la page `/contact`
**When** le visiteur accepte la télémétrie et navigue sur le site
**Then** le Session Replay est initialisé avec les options strictes de protection de la vie privée :
  - `mask_all_inputs: true`
  - `mask_all_element_attributes: true`
  - `mask_text_selector: ".ph-no-capture, input, textarea"`
**And** tous les champs du formulaire de contact dans `app/pages/contact.vue` intègrent la classe CSS d'exclusion `ph-no-capture`
**And** la page `app/pages/confidentialite.vue` est mise à jour pour expliciter :
  - Le recours à PostHog Cloud EU et les finalités d'amélioration continue
  - L'activation d'enregistrements de session anonymisés avec masquage intégral des inputs
  - La prise en compte native du signal `Do Not Track`
  - La durée de rétention maximale fixée à 14 mois
**And** la validation Docker passe sans erreur.

### Story 14.3: Implémentation du Plan de Taggage Exhaustif (Conversions IA & Interactions)

As a Simon Jouan,
I want collecter un spectre maximal d'événements comportementaux et de conversion sur le site,
So that je dispose d'une visibilité granulaire sur l'attractivité de l'offre IA et les parcours prospects avant filtrage ultérieur (FR46, CAP-3).

**Acceptance Criteria:**

**Given** les composants d'interface de `jouan.ovh` et le routeur Nuxt
**When** le visiteur interagit avec les différents éléments du site
**Then** un helper partagé `useAnalytics()` ou `posthog.capture()` émet les événements du plan de taggage (`tracking-plan.md`) :
  1. *Navigation :* `$pageview` à chaque transition de route Nuxt avec `path` et `title`
  2. *Lecture & Scroll :* `scroll_depth_reached` aux seuils 25%, 50%, 75% et 100%
  3. *Engagement Hero & Offres :* `hero_cta_clicked`, `service_card_clicked`, `pricing_cta_clicked`, `project_card_clicked`
  4. *Tunnel de Contact :* `contact_field_focused`, `contact_form_submit_attempt`, `contact_form_success`, `contact_form_error`, `direct_email_copied`, `linkedin_profile_clicked`
  5. *Terminal :* `terminal_window_opened`, `terminal_window_closed`, `terminal_command_executed`, `terminal_invalid_command`
  6. *Blog & Liens sortants :* `blog_article_viewed`, `blog_code_copied`, `external_link_clicked` sur les composants `<ZExternalLink>`
**And** aucun appel télémétrique n'est émis si l'utilisateur a refusé le consentement ou activé Do Not Track.

**Boundary Epic 16 :** les événements et propriétés analytics existants restent couverts par Epic 14 pour la non-régression. Epic 16 T0 n'ajoute aucun événement, propriété ou paramètre ; toute évolution fait l'objet de R-07 et d'une revue de vie privée.

### Story 14.4: Référencement Google Search Console (DNS TXT OVH), Sitemap XML & Robots.txt

As a Simon Jouan,
I want certifier la propriété de mon domaine apex et garantir l'exploration systématique des routes publiques et des articles publiés par les moteurs de recherche,
So that mon positionnement sur les systèmes IA et l'automatisation métier bénéficie d'une visibilité organique optimale (FR47, FR48, CAP-5, CAP-6, CAP-8).

**Acceptance Criteria:**

**Given** l'infrastructure statique Nitro et le domaine `jouan.ovh`
**When** on génère le site statique (`pnpm generate`)
**Then** la route `https://jouan.ovh/sitemap.xml` est autogénérée et liste les routes publiques indexables ainsi que les articles de blog publiés
**And** chaque URL du sitemap est absolue et générée dynamiquement via le composable `useSiteUrl()` (zéro hardcode)
**And** la route Nitro `server/routes/robots.txt.ts` autorise l'exploration générale et référence la ligne `Sitemap: https://jouan.ovh/sitemap.xml`
**And** la documentation de validation GSC par enregistrement DNS TXT chez OVH est formalisée dans `docs/specs/spec-analytics-search-console/seo-verification.md`
**And** la configuration agentic MCP PostHog dans `.agents/mcp_config.json` et les variables de `.env.example` sont validées
**And** la suite de validation Docker complète réussit avec 0 erreur :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```

### Story 14.5: Migration SEO Nuxt automatisée — Sitemap, Robots & Site Config

As a mainteneur du site,
I want remplacer les artefacts SEO manuels par les modules Nuxt SEO officiels et une configuration de site partagée,
so that chaque nouvelle route ou article `@nuxt/content` soit pris en compte au prochain build sans mettre à jour un manifeste manuel.

**Acceptance Criteria:**

**Given** la story 14.4 et le site statique GitHub Pages,
**When** la migration est effectuée via Docker,
**Then** `@nuxtjs/sitemap` et `@nuxtjs/robots` possèdent chacun une seule route publique, `NUXT_SITE_URL`/`NUXT_SITE_ENV` pilotent l'origine et l'indexabilité, et les handlers `server/routes/sitemap.xml.ts`/`robots.txt.ts` sont supprimés sans collision,
**And** l'intégration Content v3, le mode `zeroRuntime`, les exclusions, les dates `lastmod` réelles et les URLs prérendues sont vérifiés,
**And** la gate Docker, les assertions CI, le XML, le MIME robots, `_headers` et le `CNAME` restent verts sans hypothèse sur un nombre total de routes.

### Story 14.6: AEO & AI Ready — `llms.txt`, Markdown, OAI-SearchBot et découvrabilité ChatGPT

As a Simon Jouan,
I want exposer les contenus publics déjà indexables dans des formats lisibles par les agents IA et mesurer les visites ChatGPT,
so que la lisibilité machine et la découvrabilité observée restent vérifiables sans promettre un classement ou une citation ChatGPT garantis.

**Acceptance Criteria:**

**Given** la story 14.5 terminée et le déploiement statique,
**When** `nuxt-ai-ready` est installé via Docker dans une version revue,
**Then** `llms.txt`, `llms-full.txt`, les `.md` des routes prérendues et les liens HTML alternatifs sont générés sans MCP, WebMCP, runtime sync ou base de production,
**And** `OAI-SearchBot` est autorisé pour la recherche tandis que `GPTBot` est bloqué pour l'entraînement selon la politique respectueuse de la vie privée documentée,
**And** les artefacts publics ne contiennent aucune donnée personnelle, le workflow CI préserve les `_headers`, les routes internes sont revues et les liens/sections sont contrôlés,
**And** la mesure PostHog respecte le consentement existant et conserve uniquement les paramètres UTM sanitizés, avec une fenêtre avant/après documentée et aucune promesse de ranking.

**Décisions d'implémentation (2026-09-24) :** `nuxt-ai-ready@2.4.0` est verrouillé dans le manifeste et le lockfile après revue Docker. La configuration est statique (`contentSource: true`, `contentNegotiation: false`, `database: false`, `runtimeSync: false`, `cron: false`, `sitemapMd: true`, `describedby: true`) ; MCP, WebMCP, API Catalog et Agent Skills restent désactivés. Les routes publiques de base et les articles publiés sont exportés ; les noindex, brouillons, futurs et exclusions explicites sont retirés des artefacts AEO, tandis que les pages légales et coordonnées professionnelles déjà publiques restent des contenus publics. Les budgets sont de 64 KiB pour `llms.txt` et 1 MiB pour `llms-full.txt`. `OAI-SearchBot` est autorisé pour la politique de recherche et `GPTBot` bloqué pour l'entraînement ; `Content-Signal`/`Content-Usage` restent des indications voluntaristes, jamais un contrôle d'accès. La mesure avant/après dure au moins quatre semaines par période et distingue sessions referral, conversions, panel de prompts français, citations observées et contrôles GSC, sans score de lisibilité agent comme proxy de classement. Les vérifications HTTP post-déploiement sont requises avant de conclure le cycle de vie de la story.

---

## Epic 15: Repositionnement Commercial V1.1 — Désancrage Tarifaire & Niveaux d'Intervention

Simon Jouan souhaite supprimer l'affichage récurrent du prix d'entrée public de 3 500 € HT qui freinait les prospects ayant des besoins d'automatisation ciblée, et restructurer l'offre en 3 niveaux d'intervention sur devis, tout en conservant le Workflow métier comme offre cœur, AI Care isolé après mise en production à partir de 250 € HT/mois, et le Blueprint en cadrage optionnel.

### Story 15.1: Homepage — Suppression des Prix d'Entrée, Liens Contextuels & Phrase de Réassurance

As a visiteur découvrant la page d'accueil,
I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
So that je me sente libre de le contacter pour qualifier mon besoin réel (FR49, NFR6, CAP-1).

**Acceptance Criteria:**

**Given** la section expertises de `app/pages/index.vue`
**When** le visiteur consulte les 3 cartes de services
**Then** la mention `À partir de 3 500 € HT` est intégralement retirée des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
**And** chaque carte intègre un lien d'exploration contextuel ciblant `/services` :
  - *Automatisation :* « Voir les types d'automatisation → »
  - *Agents IA :* « Voir quand utiliser un agent → »
  - *Applications sur mesure :* « Découvrir les projets sur mesure → »
**And** la phrase de réassurance officielle est insérée à proximité des expertises ou du CTA intermédiaire :
  > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
**And** le style est strictement conforme aux tokens du design system (`var(--token)`), responsive et sans régression visuelle.

### Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint

As a prospect consultant la page `/services`,
I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
So that je puisse identifier le format adapté à mon organisation (FR50, CAP-2).

**Acceptance Criteria:**

**Given** la route `/services` (`app/pages/services.vue`)
**When** la page est affichée
**Then** le Hero présente le H1 officiel :
  > *« Le bon niveau de système pour le bon problème. »*
  avec le texte d'introduction centré sur le workflow plutôt que sur la technologie
**And** la grille principale présente les 3 offres de build :
  1. *Automatisation ciblée :* (Eyebrow `BESOIN PRÉCIS`, titre, accroche « Supprimer une tâche répétitive sans reconstruire tout le processus », prix `Sur devis`, CTA « Décrire mon besoin »)
  2. *Workflow métier :* (Eyebrow `OFFRE CŒUR`, titre, accroche « Transformer un processus complet en système opérationnel », prix `Sur devis`, carte visuellement mise en avant / featured, CTA « Identifier un workflow »)
  3. *Système métier sur mesure :* (Eyebrow `PROJET COMPLEXE`, titre, accroche « Construire l'application lorsque l'automatisation devient un vrai produit », prix `Sur devis`, CTA « Parler du projet »)
**And** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process.

### Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes

As a client ayant déployé un système,
I want comprendre comment Simon garantit la fiabilité et la maintenance de la capacité dans la durée,
So that mon investissement reste opérationnel et maîtrisé en coûts (FR51, CAP-3).

**Acceptance Criteria:**

**Given** la page `/services` (`app/pages/services.vue`)
**When** l'utilisateur parcourt la page sous la grille des offres de build
**Then** une section autonome est créée spécifiquement pour l'exploitation post-déploiement :
  - Eyebrow : `<h2 class="eyebrow"><span aria-hidden="true">// </span>APRÈS LA MISE EN PRODUCTION</h2>`
  - Titre : `Le système doit continuer à fonctionner.`
  - Carte ou bloc dédié `AI Care` affichant `À partir de 250 € HT / mois`
  - Descriptif axé sur le monitoring, la maintenance corrective, le suivi des coûts d'inférence et les adaptations mineures d'APIs
  - Mention explicite des coûts variables d'infrastructures et tokens tiers non inclus
  - CTA orienté « Découvrir AI Care »
**And** la section du déroulé en 4 étapes (`steps`) est mise à jour :
  - *01 — Diagnostic :* Gratuit — 20 à 30 minutes
  - *02 — Cadrage :* Cadrage du workflow cible, avec mention explicite du Blueprint facturable optionnel (à partir de 750 € HT) pour les sujets complexes
  - *03 — Construction & intégration :* Développement uniquement du niveau de système nécessaire
  - *04 — Exploitation & mesure :* Mise en production, mesure initiale et maintien opérationnel.

### Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG

As a développeur garantissant la qualité du projet,
I want auditer l'ensemble des parcours et formulaires et valider la compilation statique,
So that le site soit exempt de régressions fonctionnelles, visuelles ou d'accessibilité (FR52, NFR4, NFR6, CAP-4).

**Acceptance Criteria:**

**Given** l'ensemble des routes statiques de `jouan.ovh`
**When** on audite le CTA final global et la page `/contact`
**Then** le CTA global maintient la question « Quel process vous fait perdre du temps chaque semaine ? » avec le terminal `$ ./workflow --inspect`
**And** le formulaire de contact dans `app/pages/contact.vue` qualifie le processus sans champ de budget obligatoire
**And** les méta-descriptions SEO et OpenGraph gérées par `usePageSeo()` sont alignées sur l'Offre V1.1 sans référence obsolète aux 3 500 €
**And** les thèmes clair et sombre s'affichent avec un contraste conforme WCAG AA
**And** la suite de validation Docker s'exécute avec un succès complet à 100% :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```

---

## Epic 16: Plateforme éditoriale durable — contrat, publication et patrimoine

Simon peut publier, préserver et faire découvrir une preuve technique fiable dans une boucle éditoriale statique. Cet Epic ne réécrit pas Epic 6, ne fait pas entrer les capacités conditionnelles dans T0 et ne concurrence pas les propriétaires Epic 14.

**Statut de planning :** `backlog` — aucun story d'implémentation ne doit être créé avant le checkpoint Epic 14 et la ratification de la SPEC, du content-contract, du verification-plan et des décisions D-01 à D-08.

**Source de vérité :** `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md`, `docs/specs/spec-blog-editorial/SPEC.md` et `docs/planning-artifacts/sprint-change-proposal-2026-09-25.md`.

### Portée Epic 16

#### T0 — Préparation technique

- contrat de contenu minimal et migration contrôlée ;
- resolver de visibility déterministe ;
- homepage `/blog` avec promesse, empty state et trois derniers articles publics ;
- route article responsive avec auteur, date, pilier, format et sources ;
- non-régression homepage, Site Config, SEO, AEO, `CNAME` et `_headers` ;
- supply chain, secrets, licences, analytics no-diff et gate Docker ;
- validation navigateur/a11y desktop 1280 px et mobile 375 px.

#### E1 — Lancement éditorial

- article réel nommé et hash de contenu ;
- checklist FR-18 versionnée et pass de Simon ;
- promotion contrôlée et probes post-déploiement ;
- preuve de rollback éditorial et de takedown confidentialité.

#### R1 — Roadmap conditionnelle

- hubs Vue dédiés ;
- related filtré avant crawl ;
- auteur enrichi et relations projet par ID public ;
- AEO étendue par allow-list ;
- RSS statique approuvé ;
- curation `featured`, navigation principale et analytics enhancements.

### Matrice de traçabilité Epic 16

| CAP | Phase | FR couvertes | Story map prévu | Statut |
| --- | --- | --- | --- | --- |
| CAP-1 | T0/E1 | FR-1 à FR-3, FR-18 | contrat + resolver ; checklist FR-18 | bloqué avant ratification |
| CAP-2 | T0 | FR-4 | `/blog` et empty state | bloqué avant ratification |
| CAP-3 | R1 | FR-5 | routes Vue dédiées et precedence | différé R1 |
| CAP-4 | T0/R1 | FR-6 à FR-9 | article responsive ; related R1 | bloqué avant ratification |
| CAP-5 | R1 | FR-10, FR-11 | auteur canonique et projet par ID public | différé R1 |
| CAP-6 | T0/E1/R1 | FR-12 | visibility matrix et fixtures | bloqué avant ratification |
| CAP-7 | T0/R1 | FR-13 à FR-15 | non-régression SEO/AEO ; extensions R1 | bloqué avant ratification |
| CAP-8 | T0 | FR-9, FR-16 | DS, responsive, a11y | bloqué avant ratification |
| CAP-9 | T0/E1/R1 | FR-17, FR-18 | Docker, probes, rollback, rapports | bloqué avant ratification |

### Conditions d'entrée

- Epic 6 est `done` et ses stories restent la baseline historique.
- Epic 14 a livré ses six tâches (`14.1` à `14.6`) et possède un checkpoint écrit (`docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md`), actuellement réconcilié mais non ratifié.
- La SPEC et ses companions partagent les gates T0/E1/R1.
- D-01 à D-07 sont ratifiés ; D-08 reste à confirmer au checkpoint Epic 14.
- Aucun événement/propriété analytics nouveau n'est requis en T0.
- Les fixtures ne sont jamais versionnées ni déployées en production.

### Critères de sortie Epic 16

- T0 est vert sans régression des surfaces partagées.
- E1 est vert avec article réel, FR-18, promotion et probes.
- Les capacités R1 restent fermées jusqu'à leurs propres décisions et gates.
- La commande Docker complète est verte :

```sh
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
```

- Les résultats statiques, navigateur/a11y et production sont consignés.



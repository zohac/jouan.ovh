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
  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et d'une vignette terminale.
  success: La pile atmosphérique s'affiche de manière fluide (shader WebGL Flow Chrome 60fps natif avec déformation fbm, ou repli automatique en pur CSS en l'absence de WebGL), sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.

- id: CAP-2
  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.

- id: CAP-3
  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript »), complété par le surtitre spécialisé (« // DÉVELOPPEUR FREELANCE · NUXT & NESTJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.

- id: CAP-4
  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, TestCafé, REST API, Vitest), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.

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
- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras et shader figés au premier rendu, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.

## Non-goals

- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
- Introduire de lourdes bibliothèques JavaScript externes (GSAP, Three.js, Babylon) pour l'UI ou les effets cinétiques.
- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.

## Success signal

- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

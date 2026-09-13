---
baseline_commit: 5dc54f741c8ed022fb916686abf6ba4c8d95b271
---

# Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site et garant de la qualité logicielle,
I want valider l'accessibilité globale, l'intégrité de la navigation multi-pages, la cohérence SEO du repositionnement Full Stack TS et la conformité du build statique Nitro SSG,
so that la refonte de la page d'accueil soit irréprochable, exempte de régressions et prête pour le déploiement en production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).

## Acceptance Criteria

1. **Given** la page d'accueil intégrant l'ensemble des modules des stories 11.1 à 11.4 (atmosphère cinétique, séquence de boot `jouan.os`, hero commercial, terminal hero, marquee infini, vitrine 3 services, projets SaaS, statistiques de réassurance, journal technique et CTA final de conversion)
   **When** on exécute l'audit complet d'accessibilité sous émulation (`forced-colors: active`, `prefers-reduced-motion: reduce`, navigation au clavier et lecteur d'écran)
   **Then** tous les éléments interactifs (boutons, liens internes, `<ZExternalLink>`, lignes projets, cartes services/journal) conservent un focus visible sans rupture sous contraste forcé (`outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`)
   **And** aucun focus trap n'existe et le cycle de tabulation (`Tab` / `Shift+Tab`) suit un ordre logique strict
   **And** sous `prefers-reduced-motion: reduce`, les animations (auroras, marquee, décalages au hover) sont neutralisées à l'instantané, le boot overlay est court-circuité ou figé, et le caret de frappe du terminal hero est la **seule animation en boucle autorisée** (CAP-11).

2. **Given** l'architecture multi-pages Nuxt 4 (`app/pages/`)
   **When** le visiteur interagit avec les différents points de navigation de la page d'accueil (header, vitrine services, CTA hero, journal, CTA final, footer)
   **Then** aucun lien avec ancre intra-page `#` n'est présent sur le site (neutralisation totale des reliquats de la maquette one-page brute)
   **And** les routes cibles `/services`, `/about`, `/blog`, `/contact`, `/confidentialite` et `/mentions-legales` restent des pages autonomes, fonctionnelles et pré-rendues statiquement
   **And** tout lien ouvrant un nouvel onglet externe (Keova, profil Malt, GitHub, etc.) consomme obligatoirement la primitive accessible `<ZExternalLink>` avec mention masquée sr-only `(ouvre dans un nouvel onglet)`.

3. **Given** le repositionnement commercial Full Stack TypeScript — Nuxt / NestJS opéré dans `SITE.profile` et sur la page d'accueil
   **When** on audite la cohérence éditoriale et SEO de la page secondaire `app/pages/about.vue`
   **Then** la biographie, la description de la page et les expériences récentes sont alignées avec le nouveau positionnement (rôle Full Stack TS, SaaS Keova, Rouen / missions freelance), supprimant les mentions obsolètes orientées PHP/WordPress legacy
   **And** les balises `usePageSeo` et Schema.org `aboutJsonLd` reflètent fidèlement ce profil unifié
   **And** l'item différé de la story 11.1 dans `docs/implementation-artifacts/deferred-work.md` est marqué soldé.

4. **Given** la chaîne de build statique Nitro et les standards de code
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Audit complet d'accessibilité sous émulation (AC: 1)
  - [x] Émuler le contraste forcé (`forced-colors: active` via Chrome DevTools Rendering ou OS) : parcourir la page d'accueil et les pages enfants au clavier (`Tab`), vérifier la visibilité du focus sur chaque élément interactif (boutons, `<ZExternalLink>`, liens du marquee, lignes projets, cartes de services et journal).
  - [x] Émuler le motion réduit (`prefers-reduced-motion: reduce`) : vérifier que les auroras CSS sont immobiles, que le marquee `HomeStackMarquee.vue` est figé sans débordement horizontal, que le boot overlay `HomeBootOverlay.vue` ne lance pas d'animation intrusive, que les survols de cartes ne bougent pas, et que seul le caret du terminal clignote (CAP-11).
  - [x] Vérifier la navigation clavier : absence de piège au focus (focus trap), ordre séquentiel logique, et fonctionnement de la touche Escape sur le terminal et l'overlay de boot.

- [x] Tâche 2 — Audit des liens et conformité de l'architecture multi-pages (AC: 2)
  - [x] Vérifier qu'aucun lien avec ancre `#` (comme `#work`, `#contact`, `#journal`) n'est présent sur la home ou dans le layout partagé.
  - [x] Valider que toutes les routes enfants (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) sont joignables et rendent correctement leur contenu.
  - [x] Auditer tous les liens sortants : s'assurer de l'utilisation stricte de `<ZExternalLink>` pour Keova, Malt, GitHub, etc., avec annonce sr-only `(ouvre dans un nouvel onglet)`.

- [x] Tâche 3 — Harmonisation éditoriale et SEO de la page À-propos (`about.vue`) (AC: 3)
  - [x] Mettre à jour la biographie et le paragraphe de présentation dans `app/pages/about.vue` pour valoriser l'ingénierie logicielle Full Stack TypeScript (Vue 3 / Nuxt 4, NestJS, PostgreSQL, architecture SaaS).
  - [x] Aligner `pageDescription`, `pageTitle` et le graphe JSON-LD `aboutJsonLd` avec le rôle officiel et la ville (« Rouen, France »).
  - [x] Mettre à jour `docs/implementation-artifacts/deferred-work.md` pour marquer comme soldé le point différé de la story 11.1.

- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [x] Exécuter la commande de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier que les 13 routes statiques sont pré-rendues sans erreur ni avertissement par Nitro.
  - [x] Consigner les résultats de l'audit dans le journal de réalisation de la story.

### Review Findings

- [x] [Review][Patch] Désynchronisation de last_updated dans sprint-status.yaml [docs/implementation-artifacts/sprint-status.yaml:38]
- [x] [Review][Patch] Ville « Rouen » hardcodée en dur dans la bio et pageDescription au lieu de consommer la source de vérité [app/pages/about.vue:28]
- [x] [Review][Patch] Lien et nom de Keova non liés à SITE.projects [app/pages/about.vue:35]
- [x] [Review][Defer] Nettoyage résiduel des mentions « WordPress » sur les autres pages secondaires (contact.vue, blog/index.vue) [docs/implementation-artifacts/deferred-work.md:148] — deferred, pre-existing

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker via `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--token)`). [Source: AGENTS.md#Section 3]
- **Langue, Voix & Zéro Emoji :** Rédiger en français, vouvoiement pour le visiteur, 1re personne pour Simon, **zéro emoji** dans le contenu textuel et l'interface utilisateur. [Source: AGENTS.md#Section 1]
- **Accessibilité (a11y) dès la conception :**
  - Repli `forced-colors` universel : `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
  - Motion réduit : Seul le caret de frappe du terminal est autorisé à clignoter sous `prefers-reduced-motion: reduce` (CAP-11).
  - `<ZExternalLink>` obligatoire pour tout lien ouvrant un nouvel onglet (`target="_blank"`).
  - Listes sémantiques `<ul>` ou `<ol>` avec `<li>` pour toute répétition de cartes ou items.
- **SSG & Prerender Safety :** Le site étant statique, tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) doit être encapsulé dans `onMounted()` ou sous `import.meta.client`.

### Fichiers concernés (lus — baseline `5dc54f7`)
- **`app/pages/about.vue`** (UPDATE) : Harmonisation de la bio, des métadonnées SEO et du JSON-LD pour refléter le positionnement Full Stack TypeScript et Rouen.
- **`app/pages/index.vue`** (VERIFICATION) : Audit a11y, vérification de l'absence totale d'ancres `#`, et contrôle des états interactifs.
- **`app/components/home/HomeStackMarquee.vue`** (VERIFICATION) : Contrôle du comportement du marquee sous reduced-motion et pause au survol.
- **`app/components/home/HomeBootOverlay.vue`** (VERIFICATION) : Contrôle de la fermeture au clavier (Escape) et du comportement reduced-motion.
- **`docs/implementation-artifacts/deferred-work.md`** (UPDATE) : Clôture de l'item différé de la story 11.1.
- **`docs/implementation-artifacts/sprint-status.yaml`** (UPDATE) : Suivi du statut de sprint.

### Pièges / régressions à éviter
- **Ne pas introduire de fausse One-Page :** La home est un portail vitrine commercial ; les liens du header et des cartes de services mènent vers les vraies routes multi-pages `/services`, `/about`, etc. Ne pas restaurer les ancres `#` issues du prototype `Home - Awwwards.html`.
- **Ne pas casser le caret clignotant :** Le caret natif du terminal hero est l'unique animation en boucle explicitement autorisée sous `prefers-reduced-motion: reduce`. Ne pas l'éteindre.
- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash (Low)

### Debug Log References
- Gate Docker initiale a relevé un léger ajustement Prettier dans `app/pages/about.vue` qui a été résolu via eslint.
- Gate finale 100% verte : 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 13 routes statiques Nitro pré-rendues en 2.84s.

### Completion Notes List
- Audit a11y émulé vérifié : repli `forced-colors: active` universel (`outline: 2px solid transparent; outline-offset: 2px;`), respect de `prefers-reduced-motion: reduce` sur les auroras, le marquee dédoublé, l'overlay de boot et les transitions, caret de frappe du terminal hero préservé comme unique animation en boucle autorisée (CAP-11).
- Navigation multi-pages auditée : aucune ancre interne `#` résiduelle sur la home, intégrité des routes `/services`, `/about`, `/blog`, `/contact`, `/confidentialite` et `/mentions-legales`, utilisation systématique de `<ZExternalLink>` pour tous les liens externes (`target="_blank"`).
- Harmonisation éditoriale et SEO de `app/pages/about.vue` réalisée : bio et rôle alignés sur Full Stack TypeScript, SaaS Keova, Rouen, expériences Linkizz/CINS ajustées, schéma Schema.org `aboutJsonLd` et `usePageSeo` unifiés.
- Item différé de la story 11.1 soldé dans `docs/implementation-artifacts/deferred-work.md`.
- Gate Docker 100% verte validée (`corepack enable && pnpm lint && pnpm typecheck && pnpm generate`).

### File List
- `app/pages/about.vue` (MODIFIED)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation et validation complète de la Story 11.5 (Harmonisation About.vue, soldage des différés 11.1, audit a11y & liens, Gate Docker verte). Statut passé à review.
- 2026-09-13 : Création de la spécification de la Story 11.5 (Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker). Statut initialisé à ready-for-dev.

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cahier des charges Epic 11 : docs/planning-artifacts/epics.md#Story 11.5]
- [Directives globales pour agents : AGENTS.md]
- [Contexte projet & leçons apprises : docs/project-context.md]
- [Travaux différés : docs/implementation-artifacts/deferred-work.md]
- [Référence de validation précédente : docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md]

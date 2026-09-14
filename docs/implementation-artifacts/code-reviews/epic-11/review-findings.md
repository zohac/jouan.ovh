# Rapport de Revue de Code — Epic 11 : Refonte d'accueil Awwwards & Repositionnement Commercial

**Date :** 2026-09-14
**Périmètre :** Consolidation Epic 11 (Stories 11.1 à 11.6), branche `feat/home-awwwards` vs `main`
**Sous-agents :** Blind Hunter, Edge Case Hunter, Acceptance Auditor (via Codex gpt-5.6-luna)

---

## Synthèse du Triage & Exécution

- **Décisions résolues (`decision-needed`) :** 3 / 3 résolues (1A, 2A, 3A)
- **Patchs appliqués (`patch`) :** 9 / 9 appliqués avec succès
- **Reports consignés (`defer`) :** 2
- **Rejets / Bruit (`dismiss`) :** 6

---

## 1. Décisions arbitrées (`decision-needed`)

- [x] [Review][Decision] Arbitrage Shader WebGL Flow Chrome vs pur CSS — Option 1A validée : conservation du shader WebGL avec fallback CSS et conformité reduced-motion ; `SPEC.md` et `epics.md` alignés.
- [x] [Review][Decision] Harmonisation de la stack : TestCafé vs Cypress — Option 2A validée : conservation de TestCafé (aligné sur profil Malt réel) ; `SPEC.md` et `epics.md` alignés.
- [x] [Review][Decision] Titre Hero H1 — Option 3A validée : conservation du H1 allégé `Développeur Full Stack TypeScript` avec surtitre spécialisé ; `SPEC.md` aligné.

---

## 2. Correctifs appliqués (`patch`)

- [x] [Review][Patch] Nettoyer la référence de listener resize dans `HomeAtmosComponent.vue` [`app/components/home/HomeAtmosComponent.vue:287`]
- [x] [Review][Patch] Gérer la mise en veille de l'onglet via `visibilitychange` dans `HomeAtmosComponent.vue` [`app/components/home/HomeAtmosComponent.vue:292`]
- [x] [Review][Patch] Gérer l'événement `webglcontextlost` et bascule fallback dans `HomeAtmosComponent.vue` [`app/components/home/HomeAtmosComponent.vue:281`]
- [x] [Review][Patch] Remplacer les couleurs hexadécimales en dur du fallback par des tokens CSS [`app/components/home/HomeAtmosComponent.vue:345`]
- [x] [Review][Patch] Sécuriser le cycle de vie des écouteurs hover et reduced-motion dans `ZCustomCursor.vue` [`app/components/ui/ZCustomCursor.vue:105`]
- [x] [Review][Patch] Encapsuler le hover CSS de `ZButton.vue` sous `@media (hover: hover)` et sécuriser les liens désactivés [`app/components/ui/ZButton.vue:202`]
- [x] [Review][Patch] Supprimer l'URL Keova hardcodée en fallback dans `about.vue` pour un DRY strict [`app/pages/about.vue:105`]
- [x] [Review][Patch] Dynamiser la liste des projets dans `HomeHeroTerminal.vue` depuis `SITE.projects` et sécuriser l'échappement dans `Projets.ts` [`app/components/home/HomeHeroTerminal.vue:106`]
- [x] [Review][Patch] Sécuriser le parsing de date contre les valeurs invalides dans `formatDate.ts` [`app/utils/formatDate.ts:12`]
- [x] [Review][Patch] Gérer la bascule dynamique de `prefers-reduced-motion` dans `HomeBootOverlay.vue` [`app/components/home/HomeBootOverlay.vue:118`]

---

## 3. Reports préexistants (`defer`)

- [x] [Review][Defer] Carte vedette asymétrique pour le premier article du blog sur la Home [`app/pages/index.vue:885`] — deferred, tracé dans `deferred-work.md`
- [x] [Review][Defer] Normalisation fine de l'adresse Schema.org (`addressLocality`/`addressCountry`) [`app/composables/usePageSeo.ts`] — deferred, préexistant Epic 10

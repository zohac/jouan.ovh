---
baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
---

# Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect technique en quête de preuves de compétences,
I want examiner 3 réalisations concrètes résolvant des cas réels avec visuels et stacks précises,
so that je sois convaincu de la faisabilité de mon propre projet sans être trompé par de faux indicateurs (FR31, NFR14, UX-DR28, CAP-4).

## Acceptance Criteria

1. **Given** la section des projets de la page d'accueil dans `app/pages/index.vue`
   **When** la section est rendue et inspectée
   **Then** le sur-titre affiche `<p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>`
   **And** le titre de section affiche `Des produits qui tournent en production`
   **And** les 3 projets sont affichés sous forme de cartes riches structurées (`<ul class="projects-grid">` ou `<ul class="work-showcase">`) valorisant la résolution de problèmes réels :
     1. **Keova Signal** :
        - Statut : `● Système interne / En développement actif`
        - Accroche : `Détecter le bon prospect au bon moment`
        - Description courte : Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique, double étage de scoring Zod et serveur MCP natif (10 outils).
        - Tags technologiques : `["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"]`
        - Capture visuelle HD optimisée via `<NuxtImg>` : `/images/projects/keova-signal-dashboard.png` (alt descriptif : `Tableau de bord de qualification de prospects Keova Signal`)
        - Badge de confidentialité : `<ZBadge variant="subtle">Projet interne / Dépôt privé</ZBadge>` sans lien sortant mort ni URL externe factice
     2. **Debrief** :
        - Statut : `◐ R&D / En développement`
        - Accroche : `Transformer un rendez-vous commercial en apprentissage exploitable`
        - Description courte : Application desktop privacy-first (100 % on-device) de synthèse commerciale et analyse d'appels, sans fuite réseau ni dépendance cloud externe.
        - Tags technologiques : `["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"]`
        - Capture visuelle HD optimisée via `<NuxtImg>` : `/images/projects/debrief-dashboard.png` (alt descriptif : `Interface desktop de synthèse d'appels Debrief`)
        - Badge de confidentialité : `<ZBadge variant="subtle">Dépôt privé</ZBadge>` sans lien sortant mort
     3. **Devis-Assist** :
        - Statut : `○ Produit / Architecture BMM validée`
        - Accroche : `Transformer un historique de devis BTP en aide au chiffrage`
        - Description courte : Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ/Redis et matching flou PostgreSQL pg_trgm.
        - Tags technologiques : `["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"]`
        - Visuel / illustration d'architecture : schéma visuel stylisé ou carte architecturale élégante cohérente avec le Design System
        - Badge de confidentialité : `<ZBadge variant="subtle">Dépôt privé</ZBadge>` sans lien sortant mort.

2. **Given** les principes de transparence et de probité commerciale (NFR14, SPEC.md Constraints)
   **When** le visiteur lit le contenu des cartes et des métriques
   **Then** aucun ROI client ni chiffre d'affaires inventé n'apparaît dans les textes ou les statistiques
   **And** les chiffres clés situés sous les cartes de projets restent strictement des indicateurs d'expérience et d'ingénierie vérifiables (11 années d'expérience web, 100% TypeScript & SaaS de bout en bout, QA culture d'automatisation & zéro régression).

3. **Given** les critères d'accessibilité (a11y RGAA/WCAG), de responsive et de design tokens
   **When** la page est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
   **Then** la mise en page des projets s'adapte sans débordement horizontal ni tronquage
   **And** toutes les images utilisent obligatoirement le composant `<NuxtImg>` ou `<NuxtPicture>` avec dimensions explicites (`width`, `height`, `sizes`, `format="webp"`), jamais de balise `<img>` brute
   **And** sous `prefers-reduced-motion: reduce`, toute cinétique ou transition au survol est instantanément neutralisée
   **And** aucun emoji n'est injecté dans les templates, textes ou styles (NFR6 / NFR13)
   **And** tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).

4. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint / Stylelint, 0 erreur TypeScript, et les routes statiques pré-rendues par Nitro.

## Tasks / Subtasks

- [ ] Tâche 1 — Modélisation et enrichissement des métadonnées de projets dans `app/data/site.ts` (AC: 1, 2)
  - [ ] Mettre à jour l'interface `IProject` pour supporter optionnellement `hook?: string`, `image?: string`, `badge?: string`, `statusVariant?: string` sans casser la compatibilité existante (`FooterComponent`, `HomeHeroTerminal`, `About.ts`).
  - [ ] Aligner les entrées de `SITE.projects` avec les libellés officiels de `projects-showcase.md` :
    - Keova Signal : accroche, statut `● Système interne / En développement actif`, image `/images/projects/keova-signal-dashboard.png`, badge `Projet interne / Dépôt privé`
    - Debrief : accroche, statut `◐ R&D / En développement`, image `/images/projects/debrief-dashboard.png`, badge `Dépôt privé`
    - Devis-Assist : accroche, statut `○ Produit / Architecture BMM validée`, badge `Dépôt privé`

- [ ] Tâche 2 — Intégration du composant et de la grille de cartes riches dans `app/pages/index.vue` (AC: 1, 2, 3)
  - [ ] Remplacer l'ancienne liste linéaire `.work` par une grille de cartes riches mettant en scène les 3 démonstrateurs techniques.
  - [ ] Utiliser `<ZCard>` (ou structure dédiée conforme au Design System) avec :
    - En-tête de carte : numéro de projet, badge de confidentialité `<ZBadge>`, pastille de statut
    - Visuel projet optimisé avec `<NuxtImg>` (lazy-loading, format webp, fallback visuel soigné pour Devis-Assist)
    - Titre du projet et accroche métier mise en avant
    - Description technique mettant en valeur la résolution du problème concret
    - Liste des tags technologiques avec `<ZTag>`
  - [ ] S'assurer de l'absence de lien mort (pas de balise `<a>` vide ou `href="#"`).

- [ ] Tâche 3 — Styles SCSS, responsive et design tokens (AC: 3)
  - [ ] Développer les styles SCSS scopés pour la vitrine de projets dans `app/pages/index.vue`.
  - [ ] Définir les adaptations responsive sous 900px et 680px (bascule fluide en 1 colonne sur mobile).
  - [ ] Intégrer les styles pour les visuels d'écran (ombrage discret, liseré de démarcation `--border-subtle`, arrondi `--radius-md`).
  - [ ] Vérifier que tous les styles consomment les custom properties (`--space-*`, `--radius-*`, `--color-*`, `--text-*`).

- [ ] Tâche 4 — Accessibilité, vérification sans emoji et respect motion (AC: 2, 3)
  - [ ] Vérifier les attributs `alt` pertinents sur chaque image `<NuxtImg>`.
  - [ ] Valider l'ordre de tabulation clavier et le focus visible (`:focus-visible`).
  - [ ] Valider le respect strict de `prefers-reduced-motion: reduce`.
  - [ ] Vérifier l'absence absolue de tout emoji dans le DOM et les textes.

- [ ] Tâche 5 — Validation qualité Docker (AC: 4)
  - [ ] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [ ] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, et génération SSG Nitro réussie.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **Images Nuxt :** Toujours utiliser `<NuxtImg>` avec `format="webp"`, `sizes="..."`, `width` et `height`. Ne jamais utiliser de balise `<img>` brute. [Source: AGENTS.md#Section 3]
- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`. [Source: AGENTS.md#Section 5.3]
- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
- **Confidentialité & Liens :** Les dépôts étant privés (`zohac/*`), ne pas insérer de liens externes brisés. Utiliser `<ZBadge>` pour afficher le statut sans lien sortant. [Source: SPEC.md#Assumptions]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13.

### Fichiers concernés
- [MODIFY] [app/data/site.ts](file:///Users/simon/dev/jouan.ovh/app/data/site.ts)
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)

### Ce qui doit être préservé
- Le bloc des chiffres clés de réassurance (`ul.stats`) situé immédiatement sous la vitrine des projets.
- Le journal technique (`ul.journal`) et le CTA de conversion final.
- Le bon fonctionnement des programmes terminal (`Projets.ts`) et composants (`FooterComponent.vue`, `HomeHeroTerminal.vue`) consommant `SITE.projects`.

### Références
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-4](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
- Vitrine des 3 projets phares : [docs/specs/spec-repositionnement-ia/projects-showcase.md#Section-1](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/projects-showcase.md)
- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

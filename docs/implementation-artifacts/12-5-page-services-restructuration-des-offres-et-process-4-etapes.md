---
baseline_commit: c1b8a200419751d2817144be71e60d508b413626
---

# Story 12.5: Page Services — Restructuration complète des offres & Processus en 4 étapes

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client potentiel prêt à s'engager,
I want consulter le déroulement type d'une mission et des tarifs forfaitaires clairs,
so that je puisse budgéter mon besoin sans crainte de coûts cachés (FR32, NFR13, UX-DR30, CAP-5).

## Acceptance Criteria

1. **Given** la section d'en-tête de la page Services dans `app/pages/services.vue`
   **When** la page est rendue et inspectée
   **Then** le sur-titre affiche `<p class="eyebrow"><span aria-hidden="true">// </span>services</p>`
   **And** le titre principal affiche `Des systèmes IA construits autour de vos vrais processus métier.`
   **And** le paragraphe d'introduction affiche `Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.`

2. **Given** la grille des offres commerciales dans `app/pages/services.vue`
   **When** les offres sont affichées dans la liste sémantique `<ul class="grid-3">`
   **Then** l'ancienne offre WordPress principale est totalement supprimée de la page
   **And** les 3 formats d'engagement commercial sont détaillés sous forme de cartes `<ZCard class="offer" ...>` :
     1. **AI Workflow Sprint** (`id: "sprint"`, `featured: true` avec badge `<ZBadge tone="accent">Format cœur</ZBadge>`, icône `zap`) :
        - Titre : `AI Workflow Sprint`
        - Accroche / Règle : `Un Sprint = un workflow prioritaire`
        - Description : Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.
        - Livrables clés (`points`) :
          - Diagnostic approfondi & cartographie avant/après
          - Architecture système, connecteurs API & intégrations métier
          - Modèles d'IA & prompt engineering avec sorties typées
          - Tests automatisés sur cas réels & boucle de validation humaine
          - Déploiement en production, documentation & mesure initiale
        - Prix : `À partir de 3 500 € HT`
        - Bouton d'action : `<ZButton :as="NuxtLink" to="/contact" variant="primary" class="offer__btn" :aria-label="'Discuter d\'un AI Workflow Sprint'">Lancer un Sprint</ZButton>`
     2. **AI Workflow Blueprint** (`id: "blueprint"`, `featured: false`, icône `layers`) :
        - Titre : `AI Workflow Blueprint`
        - Accroche : `Cadrage préalable pour problématique complexe`
        - Description : Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.
        - Livrables clés (`points`) :
          - Audit du processus actuel, volumes & points de friction
          - Matrice de décision : code déterministe vs IA vs humain
          - Schéma d'architecture technique & flux de données cibles
          - Analyse des risques, contraintes de sécurité & secrets
          - Spécification des KPI de mesure & estimation budgétaire
        - Prix : `À partir de 750 € HT`
        - Bouton d'action : `<ZButton :as="NuxtLink" to="/contact" variant="secondary" class="offer__btn" :aria-label="'Demander un AI Workflow Blueprint'">Demander un Blueprint</ZButton>`
     3. **AI Care** (`id: "care"`, `featured: false`, icône `bot`) :
        - Titre : `AI Care`
        - Accroche : `Maintien en condition opérationnelle`
        - Description : Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.
        - Livrables clés (`points`) :
          - Supervision proactive, alertes & analyse des échecs
          - Maintenance corrective & adaptation aux APIs tierces
          - Suivi des coûts d'inférence & micro-ajustements de prompts
          - Support technique réactif & veille sur les nouveaux modèles
        - Clause de transparence explicite (`p.offer__disclaimer` ou équivalent) : consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.
        - Prix : `À partir de 490 € HT / mois`
        - Bouton d'action : `<ZButton :as="NuxtLink" to="/contact" variant="secondary" class="offer__btn" :aria-label="'Découvrir l\'accompagnement AI Care'">Découvrir AI Care</ZButton>`

3. **Given** la section du processus projet dans `app/pages/services.vue`
   **When** le visiteur fait défiler la page sous la grille des offres
   **Then** la section `.section.section--sunken` expose :
     - Le sur-titre `<p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>`
     - Le titre de section `<h2>` : `Un déroulé simple en quatre temps`
     - Une liste ordonnée sémantique `<ol class="process">` présentant les 4 étapes numérotées :
       - **01 — Diagnostic** : Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement. Avec un lien textuel d'action inline `<NuxtLink to="/contact" class="process__inline-cta">Identifier un workflow →</NuxtLink>`.
       - **02 — Cadrage** : Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.
       - **03 — Construction & intégration** : Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.
       - **04 — Suivi & amélioration** : Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.
     - Un bouton CTA en bas de section : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Me parler de votre besoin</ZButton>` avec icône flèche droite.

4. **Given** les exigences de référencement (SEO), données structurées et intégrité de marque
   **When** la page `/services` est compilée en SSG et inspectée
   **Then** le composable `usePageSeo` injecte :
     - `title` : `Services & Tarifs — Simon Jouan`
     - `description` : `Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.`
   **And** l'objet JSON-LD `servicesJsonLd` (`@type: "ItemList"` / `Service`) référence fidèlement les 3 nouvelles offres (AI Workflow Sprint, AI Workflow Blueprint, AI Care) sans aucune mention obsolète.

5. **Given** les critères d'accessibilité (a11y RGAA/WCAG), de responsive et de design tokens
   **When** la page est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
   **Then** les grilles `.grid-3` et `.process` basculent de 3/4 colonnes à 1 colonne sans débordement horizontal
   **And** la navigation au clavier (`Tab`) traverse les cartes d'offres et les étapes avec focus visible (`:focus-visible` outline 2px)
   **And** aucun emoji n'est injecté dans les templates, textes ou styles (NFR6 / NFR13)
   **And** tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).

6. **Given** l'ensemble des modifications de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint / Stylelint, 0 erreur TypeScript, et les routes statiques pré-rendues par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Restructuration des modèles de données et typage dans `app/pages/services.vue` (AC: 1, 2, 4)
  - [x] Mettre à jour l'interface `Offer` pour inclure optionnellement `hook?: string`, `disclaimer?: string` et les types d'icônes appropriés (`zap`, `layers`, `bot`).
  - [x] Remplacer les 3 anciennes offres par les offres officielles V1 :
    - `id: "sprint"` : AI Workflow Sprint (3 500 € HT, format cœur `featured: true`, livrables complets)
    - `id: "blueprint"` : AI Workflow Blueprint (750 € HT, cadrage complexe)
    - `id: "care"` : AI Care (490 € HT / mois, maintien en condition opérationnelle, exclusion consommations tierces)
  - [x] Mettre à jour la constante `steps` avec les 4 étapes officielles (Diagnostic, Cadrage, Construction & intégration, Suivi & amélioration) et le CTA inline pour l'étape 1.

- [x] Tâche 2 — Mise à jour du template du Hero et de la grille des offres (AC: 1, 2)
  - [x] Aligner le H1 et l'intro sur la charte officielle : `Des systèmes IA construits autour de vos vrais processus métier.`
  - [x] Intégrer les nouvelles cartes `<ZCard class="offer" ...>` avec l'accroche, les points de livrables, le prix, la clause de transparence et le bouton CTA `<ZButton>` lié à `/contact`.
  - [x] Vérifier la suppression définitive de toute mention de WordPress, Symfony ou n8n.

- [x] Tâche 3 — Mise à jour de la section Processus en 4 étapes (AC: 3)
  - [x] Structurer la liste ordonnée `<ol class="process">` avec les 4 étapes détaillées.
  - [x] Intégrer le lien d'action inline `<NuxtLink to="/contact" ...>Identifier un workflow →</NuxtLink>` dans la première étape.
  - [x] Conserver le bouton CTA final de section vers `/contact`.

- [x] Tâche 4 — SEO, données structurées Schema.org & accessibilité (AC: 4, 5)
  - [x] Aligner l'objet `servicesJsonLd` sur les 3 nouvelles offres (AI Workflow Sprint, AI Workflow Blueprint, AI Care).
  - [x] Mettre à jour les métadonnées de page dans `usePageSeo` (titre et description repositionnés).
  - [x] Vérifier les attributs `aria-label` sur tous les boutons d'action des offres.
  - [x] Contrôler l'absence totale de tout emoji.

- [x] Tâche 5 — Styles SCSS, responsive et design tokens (AC: 5)
  - [x] Adapter les styles de cartes `.offer` (gestion de l'accroche, de la clause `disclaimer` en taille feutrée `--fs-xs` / `--text-muted`, alignement des boutons en bas de carte via `margin-top: auto`).
  - [x] Styliser le lien inline `.process__inline-cta` avec couleur accent, soulignement au survol et focus visible.
  - [x] Vérifier le responsive sur mobile (< 900px, < 680px) et l'absence de débordement.
  - [x] Contrôler que 100% des styles consomment les custom properties (`--space-*`, `--radius-*`, `--color-*`, `--text-*`).

- [x] Tâche 6 — Validation qualité Docker (AC: 6)
  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, et génération SSG Nitro réussie.

### Review Findings

- [x] [Review][Patch] Réinsérer le commentaire explicatif de dérogation DS pour font-size: 22px sur .offer__icon [app/pages/services.vue:301]
- [x] [Review][Defer] Ajustement de la grille process à 4 colonnes entre 900px et 1100px [app/pages/services.vue:401] — deferred, pre-existing

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`. [Source: AGENTS.md#Section 5.3]
- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
- **Icônes :** Utiliser les glyphes intégrés de `<ZIcon name="..." />` (`zap`, `layers`, `bot`, `check`, `arrow`, `code`). [Source: app/components/ui/ZIcon.vue]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13.

### Fichiers concernés
- [MODIFY] [app/pages/services.vue](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue)

### Ce qui doit être préservé
- La structure de mise en page globale avec `<HeaderComponent />` et `<FooterComponent />` fournie par le layout `default.vue`.
- L'expérience fluide de navigation et le bouton d'action vers `/contact`.
- La sémantique de liste ordonnée `<ol>` pour les étapes du process.

### Références
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-5](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
- Grille tarifaire & process : [docs/specs/spec-repositionnement-ia/services-and-pricing.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/services-and-pricing.md)
- Charte éditoriale & messaging : [docs/specs/spec-repositionnement-ia/messaging-matrix.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.5](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

## Dev Agent Record

### Agent Model Used
Gemini 3.7 Flash

### Debug Log References
- Gate de validation Docker complète exécutée avec succès :
  `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
  - ESLint 10 : 0 erreur
  - Stylelint 17 : 0 erreur
  - TypeScript vue-tsc : 0 erreur
  - Nitro SSG : 24 routes et assets statiques pré-rendus avec succès dans `.output/public`.

### Completion Notes List
- Restructuration intégrale de la page `/services` (`app/pages/services.vue`) selon les spécifications canoniques V1 (CAP-5).
- Supprimé toute mention obsolète de WordPress, Symfony ou n8n de la page services.
- Implémenté les 3 offres commerciales IA :
  - **AI Workflow Sprint** : format cœur mis en avant avec badge `<ZBadge tone="accent">Format cœur</ZBadge>`, prix à partir de 3 500 € HT, icône `zap`, 5 livrables clés et CTA primaire.
  - **AI Workflow Blueprint** : cadrage complexe préalable, prix à partir de 750 € HT, icône `layers`, 5 livrables clés et CTA secondaire.
  - **AI Care** : maintien en condition opérationnelle, prix à partir de 490 € HT / mois, icône `bot`, 4 livrables clés, clause de transparence sur les consommations tierces d'APIs/tokens et CTA secondaire.
- Implémenté la section Process en 4 étapes sémantiques (`<ol class="process">`) avec le CTA inline `Identifier un workflow →` sur l'étape 1 et le bouton de conversion principal vers `/contact`.
- Aligné les métadonnées SEO (`usePageSeo`) et données structurées Schema.org (`servicesJsonLd` `@type: "ItemList"` / `Service`).
- Respect strict des tokens SCSS `:root`, des règles d'accessibilité (outline `:focus-visible`, pas d'emojis, labels explicites) et du responsive mobile.

### File List
- `app/pages/services.vue` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md` (modifié)

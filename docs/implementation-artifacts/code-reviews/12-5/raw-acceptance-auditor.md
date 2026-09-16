Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0ac2e-73b7-7f80-b998-4c227e874157
--------
user
# Acceptance Auditor Prompt — Story 12.5

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/services-and-pricing.md`, `docs/specs/spec-repositionnement-ia/messaging-matrix.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.5), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-5/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais lire la story, les specs de contexte et le diff, puis je rendrai l’audit directement avec les écarts vérifiables. Je reste en mode revue d’acceptance, donc je privilégie les violations concrètes avec preuve dans le diff.
exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/services-and-pricing.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/12-5-page-services-restructuration-des-offres-et-process-4-etapes.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Structure des Services, Process & Grille Tarifaire

## 1. Les 3 Offres d'Intervention

### Offre 1 — Automatisation de processus métier
- **Titre :** Automatisation de processus métier
- **Promesse :** Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.
- **Cas d'usage :** Qualification de demandes, enrichissement de données, traitement de mails/documents, reporting, synchronisation inter-outils, préparation de propositions, mise à jour CRM.
- **Tags techniques :** `Workflow` · `APIs` · `Automation` · `PostgreSQL`

### Offre 2 — Agents IA intégrés à vos outils
- **Titre :** Agents IA intégrés à vos outils
- **Promesse :** Quand une étape nécessite de lire, interpréter, synthétiser ou décider entre plusieurs actions, intégration de l'IA dans le flux de travail sans reconstruire ce qui fonctionne déjà.
- **Cas d'usage :** Agents outillés (Tool Calling / APIs), extraction structurée, recherche augmentée, validation humaine préalable, intégrations MCP et orchestration.
- **Tags techniques :** `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`

### Offre 3 — Applications IA sur mesure
- **Titre :** Applications IA sur mesure
- **Promesse :** Lorsque le workflow nécessite un produit dédié, développement de toute la chaîne : interface, backend, base de données, authentification, intégrations, IA, tests et déploiement.
- **Cas d'usage :** Outil métier interne, SaaS, application desktop, pipeline documentaire, interface de supervision, industrialisation d'un prototype existant.
- **Tags techniques :** `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`

---

## 2. Déroulement d'un Projet en 4 Étapes

```text
Diagnostic (20-30 min) ──► Cadrage / Blueprint ──► Build & Intégration ──► Suivi & Exploitation
```

1. **Étape 1 — Diagnostic (Prise de contact / Échange initial) :**
   - Échange de 20 à 30 minutes pour qualifier le problème.
   - Analyse du processus réel : fréquence, acteurs, outils impliqués, données manipulées, irritants et impact sur l'activité.
   - CTA associé : `Identifier un workflow`.
2. **Étape 2 — Cadrage :**
   - Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis, des KPI de mesure et du périmètre projet.
   - Fait l'objet d'un livrable dédié (Blueprint) pour les sujets complexes.
3. **Étape 3 — Construction & Intégration (Build) :**
   - Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.
4. **Étape 4 — Suivi & Amélioration (Exploitation) :**
   - Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.

---

## 3. Grille Tarifaire & Engagements Commerciaux

### Format Cœur — AI Workflow Sprint
- **Tarif public affiché :** *À partir de 3 500 € HT*
- **Règle absolue :** Un Sprint = Un workflow prioritaire borné (ex: ingestion de lead → enrichissement → qualification → scoring → CRM → proposition préparée → validation humaine).
- **Livrables inclus :** Diagnostic, cartographie avant/après, KPI, architecture, dev, intégrations, tests, mise en production, documentation, mesure initiale.
- **Ordres de grandeur internes indicatifs :**
  - Pilote borné : 2 500 – 3 900 € HT
  - Système métier intégré : 3 900 – 6 500 € HT
  - Système multi-workflows avancé : 6 500 – 12 000 €+ HT

### Format Cadrage — AI Workflow Blueprint
- **Tarif public affiché :** *À partir de 750 € HT*
- **Utilité :** Pour les projets nécessitant plusieurs heures d'audit préalable, modélisation de données et choix d'architecture avant de s'engager sur le build.
- **Livrable :** Dossier de cadrage complet (process actuel, irritants, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, architecture, budget estimé).

### Format Exploitation — AI Care
- **Tarif public affiché :** *À partir de 490 € HT / mois*
- **Définition :** Maintien en condition opérationnelle d'une capacité intégrée au processus métier (pas "le salaire d'un employé IA").
- **Périmètre inclus :** Supervision/monitoring, maintenance corrective, support réactif, suivi des coûts d'inférence, micro-ajustements de prompts/modèles, optimisations de prompts et code.
- **Exclusions strictes :** Nouveaux workflows (font l'objet d'un nouveau Sprint), migrations d'envergure, et **consommations tierces directes** (tokens LLM, OCR, scraping, SMS/email, serveurs dédiés) refacturées au réel ou prises en charge directement par le client.

 succeeded in 0ms:
---
baseline_commit: c1b8a200419751d2817144be71e60d508b413626
---

# Story 12.5: Page Services — Restructuration complète des offres & Processus en 4 étapes

Status: review

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

 succeeded in 0ms:
---
id: SPEC-repositionnement-ia
companions:
  - messaging-matrix.md
  - services-and-pricing.md
  - projects-showcase.md
sources:
  - docs/jouan-ovh-offre-v1-brief-codex.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Repositionnement Offre V1 — Systèmes IA & Automatisation Métier

## Why

Le site actuel positionne Simon Jouan comme développeur Full Stack technique (Nuxt/NestJS/SaaS), ce qui dilue la valeur perçue et attire des demandes génériques ou peu qualifiées. Le nouveau positionnement commercial cible directement la douleur opérationnelle des entreprises : automatiser les processus métier chronophages et intégrer des systèmes et agents IA fiables en production. Le savoir-faire Full Stack et la culture QA deviennent le garant d'industrialisation (au-delà du prototype ou de l'automatisation fragile), sans renier l'identité sobre d'inspiration terminal du portfolio.

## Capabilities

- id: CAP-1
  intent: La source unique de données du site (`site.ts`) et les éléments globaux de marque (footer, bio, tags, métadonnées) reflètent le positionnement d'expert systèmes IA et automatisation métier, en éliminant les intitulés proscrits (ingénieur IA, ERP équestre, WordPress principal, localisation erronée).
  success: Une inspection de `app/data/site.ts` et des pieds de page confirme la présence du titre "Développeur Full Stack spécialisé en systèmes IA & automatisation métier", la localisation "France · Remote", la mise à jour des bios et l'absence totale de "Ingénieur IA" ou "ERP équestre".

- id: CAP-2
  intent: Le visiteur arrivant sur la page d'accueil identifie en moins de 15 secondes la promesse d'automatisation des workflows d'équipe via un Hero restructuré et un terminal interactif mis à jour.
  success: Le hero affiche le H1 "Automatisez les workflows qui freinent votre équipe", le sous-titre orienté intégration métier, les CTAs dédiés ("Identifier un workflow à automatiser" et "Voir mes systèmes IA"), et les sorties de commande du terminal hero reflètent les commandes `whoami`, `focus.txt` et `~/systems`.

- id: CAP-3
  intent: La page d'accueil présente la nouvelle offre en 3 cartes de services et un bloc différenciateur "prototype vers production" valorisant la robustesse technique et la QA.
  success: La section "Ce que je propose" expose les 3 offres (Automatisation de processus métier, Agents IA intégrés à vos outils, Applications IA sur mesure) avec leurs tags respectifs, immédiatement suivie du bloc "Un agent qui fonctionne trois fois n'est pas encore un système fiable" détaillant les piliers Données, Fiabilité, IA et Exploitation.

- id: CAP-4
  intent: La page d'accueil met en avant 3 projets phares démontrant la résolution de problèmes métier concrets (Keova Signal, Debrief, Devis-Assist), tout en conservant les réalisations antérieures dans un statut d'archives ou de parcours.
  success: Les trois projets affichés en vitrine principale sont Keova Signal (commercial / signaux d'achat), Debrief (desktop / IA locale privacy-first) et Devis-Assist (BTP / OCR & extraction documentaire), avec leurs statuts réels (interne, R&D, MVP) et sans métrique ni ROI fictif.

- id: CAP-5
  intent: La page Services (`/services`) détaille la méthodologie d'intervention en 4 étapes et la grille tarifaire transparente des 3 formats d'engagement.
  success: La page `/services` articule le processus (Diagnostic, Cadrage, Build, Exploitation) et affiche les offres "AI Workflow Sprint" (à partir de 3 500 € HT), "AI Workflow Blueprint" (à partir de 750 € HT) et "AI Care" (à partir de 490 € HT/mois) en dissociant explicitement les coûts d'infrastructure et d'APIs tierces.

- id: CAP-6
  intent: La page À propos (`/about`) retrace la trajectoire professionnelle en articulant la métrologie industrielle, le contrôle qualité (QA), le développement Full Stack et l'ingénierie des systèmes IA.
  success: Le contenu d'introduction et la timeline relient explicitement la rigueur de métrologie et QA à la fiabilité des agents IA en production (reproductibilité, gestion des cas limites, observabilité).

- id: CAP-7
  intent: Le visiteur peut qualifier directement son workflow problématique via les CTA de bas de page et le formulaire de contact mis à jour.
  success: Le CTA final global pose la question "Quel process vous fait perdre du temps chaque semaine ?" avec le prompt inspecteur `$ ./workflow --inspect`, et le formulaire de contact permet de saisir la description du processus et son fonctionnement actuel.

- id: CAP-8
  intent: Les métadonnées SEO, OpenGraph et données structurées Schema.org intègrent les nouveaux mots-clés sans allégations trompeuses.
  success: `usePageSeo` injecte les balises de titres ("Simon Jouan — Systèmes IA, agents & automatisation métier") et descriptions cibles sur l'ensemble des 13 routes pré-rendues.

- id: CAP-9
  intent: La refonte de contenu préserve intégralement les acquis d'accessibilité (a11y WCAG / RGAA), le responsive mobile et l'univers graphique terminal dark-first sans régression technique.
  success: La validation Docker `pnpm lint && pnpm typecheck && pnpm generate` passe avec 0 erreur et les contrastes, focus clavier et comportements motion réduit sont maintenus conformes aux standards du projet.

## Constraints

- **Direction artistique pérenne :** Conservation stricte du thème sombre aubergine, de l'accent orange, de la typographie Ubuntu/monospace et de l'ambiance terminal. Zéro cliché visuel d'IA générique (pas de cerveaux lumineux, néons bleus/violets, robots ou logos OpenAI partout).
- **Zéro Emoji :** Conformité stricte à la règle NFR6 du projet (aucun emoji dans les contenus textuels ou l'UI).
- **Vérité des faits :** Aucun ROI inventé, aucune promesse magique de remplacement d'employés, respect des statuts réels des projets (R&D, MVP, interne).
- **Environnement Docker exclusif :** Toute validation et compilation s'exécute dans Docker via `docker compose run --rm web ...`.
- **DRY & Pas d'URL en dur :** Données centralisées dans `app/data/site.ts`, URL résolue via `useSiteUrl()`.

## Non-goals

- Ne pas refondre l'identité graphique, le logo ou le Design System de base.
- Ne pas construire de système d'authentification ou d'espace client sur `jouan.ovh`.
- Ne pas supprimer brutalement les anciens projets du code (conservation propre pour archives ou parcours).
- Ne pas créer de calculateur de devis automatisé complexe en V1.

## Success signal

Le site déployé sur `jouan.ovh` (ou prévisualisé en local) permet à un prospect ou client en moins de 20 secondes d'identifier Simon comme développeur Full Stack capable d'automatiser un processus métier via des systèmes IA robustes, avec 3 démonstrateurs techniques crédibles et une proposition d'audit initial immédiate, validé par une gate CI/Docker verte à 100 %.

## Assumptions

- Les dépôts `zohac/keova_signal`, `zohac/debrief` et `zohac/devis-assist` sont des projets privés sous propriété intellectuelle : ils sont présentés avec le statut `Projet interne / Dépôt privé` sans lien GitHub sortant direct.
- Keova Signal dispose déjà de 3 visuels haute définition copiés dans `public/images/projects/`.
- Debrief dispose de 3 captures de référence prêtes à l'import depuis son Design System.
- Devis-Assist est représenté fidèlement sous son statut de phase de spécification et d'architecture BMM validées (pipeline Mistral OCR 3, BullMQ, pg_trgm).
- Les anciens projets restent référencés dans le code de `site.ts` sous une section secondaire d'archives/parcours.

## Open Questions

- L'expérience `Linkizz` sur la page À propos doit-elle être conservée telle quelle, ajustée ou complétée ?


exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/messaging-matrix.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Messaging Matrix & Charte Éditoriale — Repositionnement Offre IA

## 1. Identité & Promesse

| Dimension | Formulation officielle |
| :--- | :--- |
| **Titre principal** | Développeur Full Stack spécialisé en systèmes IA & automatisation métier |
| **Promesse centrale** | J’automatise les processus commerciaux et opérationnels qui font perdre du temps, des opportunités ou de la capacité aux entreprises. |
| **Explication courte** | Je conçois des agents IA, automatisations et applications métier qui s’intègrent aux outils existants — du diagnostic jusqu’à la mise en production. |
| **Différenciateur clé** | Je ne construis pas seulement l’agent. Je construis le système autour : données, API, interface, sécurité, tests, supervision et déploiement. |
| **Version condensée** | Développeur Full Stack spécialisé IA & automatisation métier. Je transforme les workflows manuels en systèmes logiciels intégrés, fiables et mesurables. |
| **Baseline ultra-courte**| Systèmes IA · automatisation métier · Full Stack |

## 2. Principes & Doctrine d'Intervention

1. **Douleur avant solution :** on part du dysfonctionnement ou du goulot d'étranglement concret, jamais d'une lubie technologique.
2. **Workflow avant technologie :** simplifier et cartographier le flux avant d'automatiser.
3. **Déterministe d'abord :** des règles de code simples prévalent dès qu'elles suffisent.
4. **IA ciblée :** mobilisée uniquement lorsque l'interprétation, la lecture, la synthèse ou la génération apportent une valeur irremplaçable.
5. **Autonomie justifiée :** des agents multi-étapes seulement si le parcours l'exige.
6. **Contrôle humain (*Human-in-the-loop*) :** supervision obligatoire sur les actions critiques, financières ou engageantes.
7. **Mesure factuelle :** comparaison systématique avant / après, sans indicateurs de rentabilité fantaisistes.
8. **Intégrité commerciale :** aucune promesse de remplacement d'effectifs ni de gain magique "10x".

## 3. Formulations proscrites vs Formulations cibles

| Proscrit / À bannir | Privilégié / À utiliser |
| :--- | :--- |
| Ingénieur IA / Ingénieur produit IA | Développeur Full Stack spécialisé systèmes IA |
| Expert ChatGPT / Prompt Engineer | Conception de systèmes IA & automatisation métier |
| Agence IA / No-code AI expert | Développement sur mesure & intégration robuste |
| "Vos employés IA autonomes" | "Des systèmes qui assistent vos équipes sur leurs tâches récurrentes" |
| "Révolutionnez votre business avec l'IA" | "Automatisez les workflows qui freinent votre équipe" |
| "ERP équestre" (pour Keova) | "Application métier & gestion opérationnelle" |
| Localisation "Rouen, France" | "France · Remote" |

## 4. Textes d'Accroche par Page

### 4.1 Homepage
- **Eyebrow :** `// DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION`
- **H1 :** `Automatisez les workflows qui freinent votre équipe.`
- **Sous-titre :** `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`
- **Ligne de crédibilité :** `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`
- **CTA principal :** `Identifier un workflow à automatiser`
- **CTA secondaire :** `Voir mes systèmes IA`
- **Signal disponibilité :** `Disponible pour nouvelles missions freelance`

### 4.2 Terminal Hero
```text
anon.@jouan.ovh:~$ whoami
Simon Jouan — Développeur Full Stack spécialisé IA & automatisation

anon.@jouan.ovh:~$ cat focus.txt
Systèmes IA · automatisation métier · agents · applications Full Stack · QA

anon.@jouan.ovh:~$ ls ~/systems
keova-signal/ debrief/ devis-assist/
```

### 4.3 Bloc Différenciateur "Prototype → Production"
- **Eyebrow :** `// au-delà de la démo`
- **H2 :** `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
- **Corps :** `Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification, permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine. L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile lorsqu’il rencontre la vraie vie.`
- **4 Piliers :**
  - *Données :* provenance, structuration, stockage, rétention, secrets.
  - *Fiabilité :* cas limites, retries, fallbacks, tests, observabilité.
  - *IA :* sorties structurées, versionnage, évaluations, contrôle humain.
  - *Exploitation :* monitoring, coûts, support, maintenance, évolution.

### 4.4 CTA Final Global
- **Eyebrow :** `$ ./workflow --inspect`
- **H2 :** `Quel process vous fait perdre du temps chaque semaine ?`
- **Corps :** `Décrivez-moi simplement comment il fonctionne aujourd’hui. Je vous dirai ce qui mérite d’être automatisé, ce qui doit rester humain et si l’IA apporte réellement quelque chose.`
- **CTA principal :** `Identifier un workflow à automatiser`
- **CTA secondaire :** `M’écrire directement`

codex
J’ai les critères de la story et la spécification canonique. Je récupère maintenant les passages Epic 12/projet et le diff complet pour comparer l’intention aux changements réels, pas seulement aux notes de livraison.
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 349512a..a8d9ea1 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -1,40 +1,46 @@
 <template>
   <main class="services">
-    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
+    <!-- En-tête + grille d'offres (story 12.5) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
-        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
+        <h1 class="services__title">Des systèmes IA construits autour de vos vrais processus métier.</h1>
         <p class="prose services__intro">
-          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
-          vous gardez la main sur votre projet.
+          Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en
+          condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.
         </p>
 
         <ul class="grid-3">
           <li v-for="offer in offers" :key="offer.id">
             <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
               <div v-if="offer.featured" class="offer__badge">
-                <ZBadge tone="accent">Le plus demandé</ZBadge>
+                <ZBadge tone="accent">Format cœur</ZBadge>
               </div>
               <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
               <h2 class="offer__title">{{ offer.title }}</h2>
+              <p v-if="offer.hook" class="offer__hook">{{ offer.hook }}</p>
               <p class="offer__desc">{{ offer.desc }}</p>
               <ul class="offer__points">
                 <li v-for="point in offer.points" :key="point">{{ point }}</li>
               </ul>
-              <div class="offer__price">
-                <b>{{ offer.price }}</b>
-              </div>
-              <div class="offer__cta">
-                <ZButton
-                  :as="NuxtLink"
-                  to="/contact"
-                  :variant="offer.featured ? 'primary' : 'secondary'"
-                  :aria-label="`Discuter du projet — ${offer.title}`"
-                  class="offer__btn"
-                >
-                  Discuter du projet
-                </ZButton>
+              <div class="offer__footer">
+                <div class="offer__price">
+                  <b>{{ offer.price }}</b>
+                </div>
+                <p v-if="offer.disclaimer" class="offer__disclaimer">
+                  {{ offer.disclaimer }}
+                </p>
+                <div class="offer__cta">
+                  <ZButton
+                    :as="NuxtLink"
+                    to="/contact"
+                    :variant="offer.featured ? 'primary' : 'secondary'"
+                    :aria-label="offer.ctaAriaLabel"
+                    class="offer__btn"
+                  >
+                    {{ offer.ctaText }}
+                  </ZButton>
+                </div>
               </div>
             </ZCard>
           </li>
@@ -42,7 +48,7 @@
       </div>
     </section>
 
-    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
+    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
     <section class="section section--sunken">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
@@ -53,6 +59,11 @@
             <div class="process__num" aria-hidden="true">{{ step.n }}</div>
             <h3 class="process__step-title">{{ step.title }}</h3>
             <p class="prose process__desc">{{ step.desc }}</p>
+            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
+              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
+                {{ step.inlineCta.label }}
+              </NuxtLink>
+            </div>
           </li>
         </ol>
 
@@ -68,7 +79,7 @@
 </template>
 
 <script setup lang="ts">
-// Page Services : catalogue d'offres packagées + process 4 étapes + CTA contact.
+// Page Services : catalogue d'offres IA packagées + process 4 étapes + CTA contact.
 // Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
 import { NuxtLink } from "#components";
 import { SITE } from "~/data/site";
@@ -76,56 +87,115 @@ import { SITE } from "~/data/site";
 interface Offer {
   /** Clé v-for stable (indépendante du contenu affiché). */
   id: string;
-  /** Nom d'icône dans le set ZIcon (story 2.7). */
+  /** Nom d'icône dans le set ZIcon. */
   icon: string;
   title: string;
+  hook?: string;
   desc: string;
   points: string[];
   price: string;
+  disclaimer?: string;
   /** Offre mise en avant : carte accent + glow + badge. */
   featured: boolean;
+  ctaText: string;
+  ctaAriaLabel: string;
+}
+
+interface Step {
+  n: string;
+  title: string;
+  desc: string;
+  inlineCta?: {
+    to: string;
+    label: string;
+  };
 }
 
-// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
-// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
+// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
 const offers: Offer[] = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
-    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
-    price: "à partir de 1 500 €",
-    featured: false,
+    id: "sprint",
+    icon: "zap",
+    title: "AI Workflow Sprint",
+    hook: "Un Sprint = un workflow prioritaire",
+    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
+    points: [
+      "Diagnostic approfondi & cartographie avant/après",
+      "Architecture système, connecteurs API & intégrations métier",
+      "Modèles d'IA & prompt engineering avec sorties typées",
+      "Tests automatisés sur cas réels & boucle de validation humaine",
+      "Déploiement en production, documentation & mesure initiale",
+    ],
+    price: "À partir de 3 500 € HT",
+    featured: true,
+    ctaText: "Lancer un Sprint",
+    ctaAriaLabel: "Discuter d'un AI Workflow Sprint",
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
-    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
-    price: "sur devis",
-    featured: true,
+    id: "blueprint",
+    icon: "layers",
+    title: "AI Workflow Blueprint",
+    hook: "Cadrage préalable pour problématique complexe",
+    desc: "Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.",
+    points: [
+      "Audit du processus actuel, volumes & points de friction",
+      "Matrice de décision : code déterministe vs IA vs humain",
+      "Schéma d'architecture technique & flux de données cibles",
+      "Analyse des risques, contraintes de sécurité & secrets",
+      "Spécification des KPI de mesure & estimation budgétaire",
+    ],
+    price: "À partir de 750 € HT",
+    featured: false,
+    ctaText: "Demander un Blueprint",
+    ctaAriaLabel: "Demander un AI Workflow Blueprint",
   },
   {
-    id: "ia",
-    icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
-    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
-    price: "sur devis",
+    id: "care",
+    icon: "bot",
+    title: "AI Care",
+    hook: "Maintien en condition opérationnelle",
+    desc: "Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.",
+    points: [
+      "Supervision proactive, alertes & analyse des échecs",
+      "Maintenance corrective & adaptation aux APIs tierces",
+      "Suivi des coûts d'inférence & micro-ajustements de prompts",
+      "Support technique réactif & veille sur les nouveaux modèles",
+    ],
+    disclaimer:
+      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
+    price: "À partir de 490 € HT / mois",
     featured: false,
+    ctaText: "Découvrir AI Care",
+    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
   },
 ];
 
-// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
-// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
-// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
-const steps = [
-  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
-  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
-  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
-  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
+// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
+const steps: Step[] = [
+  {
+    n: "01",
+    title: "Diagnostic",
+    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
+    inlineCta: {
+      to: "/contact",
+      label: "Identifier un workflow →",
+    },
+  },
+  {
+    n: "02",
+    title: "Cadrage",
+    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
+  },
+  {
+    n: "03",
+    title: "Construction & intégration",
+    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
+  },
+  {
+    n: "04",
+    title: "Suivi & amélioration",
+    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
+  },
 ];
 
 const siteUrl = useSiteUrl();
@@ -133,9 +203,9 @@ const siteUrl = useSiteUrl();
 const servicesJsonLd = {
   "@context": "https://schema.org",
   "@type": "WebPage",
-  name: "Services — jouan.ovh",
+  name: "Services & Tarifs — Simon Jouan",
   description:
-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
   url: `${siteUrl}/services`,
   mainEntity: {
     "@type": "ItemList",
@@ -161,9 +231,9 @@ const servicesJsonLd = {
 };

exec
/bin/zsh -lc "rg -n \"Story 12\\.5|12\\.5|Epic 12|CAP-5|Services\" docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/project-context.md:197:  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
docs/project-context.md:260:  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
docs/planning-artifacts/epics.md:40:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md:41:FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
docs/planning-artifacts/epics.md:59:FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md:66:#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
docs/planning-artifacts/epics.md:71:FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
docs/planning-artifacts/epics.md:121:UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
docs/planning-artifacts/epics.md:146:FR6: Epic 4 — Page Services (route /services)
docs/planning-artifacts/epics.md:168:FR28: Epic 12 — Source de vérité site.ts, assainissement sémantique & profil
docs/planning-artifacts/epics.md:169:FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
docs/planning-artifacts/epics.md:170:FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
docs/planning-artifacts/epics.md:171:FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
docs/planning-artifacts/epics.md:172:FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
docs/planning-artifacts/epics.md:173:FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
docs/planning-artifacts/epics.md:174:FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
docs/planning-artifacts/epics.md:175:FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
docs/planning-artifacts/epics.md:176:FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
docs/planning-artifacts/epics.md:192:### Epic 4: Page Services
docs/planning-artifacts/epics.md:224:### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:424:**And** un lien mène à la page Services
docs/planning-artifacts/epics.md:440:## Epic 4: Page Services
docs/planning-artifacts/epics.md:447:I want une page Services avec les trois offres,
docs/planning-artifacts/epics.md:452:**Given** la référence `Services.jsx` et le contenu `data.js`
docs/planning-artifacts/epics.md:465:**Given** les étapes du process dans `Services.jsx`/`data.js`
docs/planning-artifacts/epics.md:849:## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:935:### Story 12.5: Page Services — Restructuration complète des offres & Processus en 4 étapes

exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/12-5/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     458 docs/implementation-artifacts/code-reviews/12-5/full.diff

exec
/bin/zsh -lc "sed -n '849,1010p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '260,560p' docs/implementation-artifacts/code-reviews/12-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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




 succeeded in 0ms:
 };
 
 usePageSeo({
-  title: "Services — jouan.ovh",
+  title: "Services & Tarifs — Simon Jouan",
   description:
-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
   path: "/services",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -172,7 +242,7 @@ usePageSeo({
 </script>
 
 <style lang="scss" scoped>
-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
+/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
 .services {
   display: block;
 }
@@ -180,9 +250,9 @@ usePageSeo({
 // .section / .section--sunken / .container / .eyebrow / .prose : primitives de
 // layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
 
-// ---- En-tête (porté de Services.jsx L13-21) ----
+// ---- En-tête ----
 .services__title {
-  max-width: 16ch;
+  max-width: 22ch;
   margin-bottom: var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-4xl);
@@ -192,12 +262,12 @@ usePageSeo({
 }
 
 .services__intro {
-  max-width: 60ch;
+  max-width: 62ch;
   margin-bottom: var(--space-10);
   color: var(--text-muted);
 }
 
-// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
+// ---- Grille des offres (.grid-3 / .offer*) ----
 .grid-3 {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
@@ -211,8 +281,6 @@ usePageSeo({
   }
 }
 
-// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
-// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
 .offer {
   display: flex;
   flex-direction: column;
@@ -230,9 +298,6 @@ usePageSeo({
   width: var(--space-10); // 40px
   height: var(--space-10);
   margin-bottom: var(--space-4);
-
-  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
-  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   font-size: 22px;
   color: var(--accent);
   background: var(--accent-soft);
@@ -240,13 +305,22 @@ usePageSeo({
 }
 
 .offer__title {
-  margin-bottom: var(--space-2);
+  margin-bottom: var(--space-1);
   font-family: var(--font-mono);
   font-size: var(--fs-xl);
   font-weight: var(--fw-regular);
   color: var(--text-strong);
 }
 
+.offer__hook {
+  margin: 0 0 var(--space-3);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-weight: var(--fw-medium);
+  letter-spacing: var(--ls-wide);
+  color: var(--accent);
+}
+
 .offer__desc {
   margin: 0 0 var(--space-4);
   font-family: var(--font-sans);
@@ -268,7 +342,7 @@ usePageSeo({
     color: var(--text-muted);
   }
 
-  // Puce fléchée « → » (porté de kit.css .offer li::before).
+  // Puce fléchée « → »
   li::before {
     content: "→";
     position: absolute;
@@ -277,11 +351,14 @@ usePageSeo({
   }
 }
 
-.offer__price {
-  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
-  // `padding-top` reprend l'inline JSX (space-5) au lieu du margin-top du kit.
+.offer__footer {
+  display: flex;
+  flex-direction: column;
   margin-top: auto;
   padding-top: var(--space-5);
+}
+
+.offer__price {
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
   color: var(--text-muted);
@@ -293,16 +370,24 @@ usePageSeo({
   }
 }
 
+.offer__disclaimer {
+  margin: var(--space-2) 0 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  line-height: var(--lh-normal);
+  color: var(--text-muted);
+  opacity: 0.85;
+}
+
 .offer__cta {
   margin-top: var(--space-4);
 }
 
-// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
 .offer__btn {
   width: 100%;
 }
 
-// ---- Section process (porté de Services.jsx L45-61) ----
+// ---- Section process ----
 .process__title {
   margin-bottom: var(--space-8);
   font-family: var(--font-mono);
@@ -320,6 +405,11 @@ usePageSeo({
   list-style: none;
 }
 
+.process__step {
+  display: flex;
+  flex-direction: column;
+}
+
 .process__num {
   font-family: var(--font-mono);
   font-size: var(--fs-3xl);
@@ -340,12 +430,41 @@ usePageSeo({
   color: var(--text-muted);
 }
 
+.process__cta-inline-wrapper {
+  margin-top: auto;
+  padding-top: var(--space-3);
+}
+
+.process__inline-cta {
+  display: inline-flex;
+  align-items: center;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--accent);
+  text-decoration: none;
+  transition:
+    color var(--dur-base) var(--ease-standard),
+    text-decoration-color var(--dur-base) var(--ease-standard);
+
+  &:hover {
+    color: var(--accent-hover);
+    text-decoration: underline;
+  }
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+    border-radius: var(--radius-xs);
+  }
+}
+
 .process__cta {
   margin-top: var(--space-12);
   text-align: center;
 }
 
-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
+// ---- Responsive ----
 @media (width <= 900px) {
   .grid-3,
   .process {

exec
/bin/zsh -lc "sed -n '1,340p' app/components/ui/ZCard.vue && sed -n '1,220p' app/components/ui/ZButton.vue && sed -n '1,220p' app/components/ui/ZIcon.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <component
    :is="as"
    ref="cardRef"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
      'zcard--tilt': tilt,
    }"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, 3D tilt interactif optionnel.
// Porté de docs/design_system/components/core/Card.jsx et Home - Awwwards.html.
import type { Component, ComponentPublicInstance } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Rendre la carte interactive (hover state, clickable). @default false */
  interactive?: boolean;
  /** Filet supérieur dégradé accent (story 2.4). @default false */
  accent?: boolean;
  /** Variante mise en valeur (bordure accent, glow). @default false */
  featured?: boolean;
  /** Padding interne (var(--space-6)). Désactivable pour cartes média. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
  /** Activer l'effet 3D tilt sur mousemove. @default false */
  tilt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
  tilt: false,
});

const attrs = useAttrs();
const cardRef = ref<Element | ComponentPublicInstance | null>(null);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion.value = e.matches;
  if (e.matches) {
    onMouseLeave();
  }
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onMouseMove(event: MouseEvent) {
  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
    return;
  }
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return;
  }
  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
}

function onMouseLeave() {
  if (cardRef.value) {
    const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
    if (el instanceof HTMLElement) {
      el.style.transform = "";
    }
  }
}

watch(
  () => props.tilt,
  (newVal) => {
    if (!newVal) {
      onMouseLeave();
    }
  },
);

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

.zcard--tilt {
  transform-style: preserve-3d;
  will-change: transform;
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

  &:focus-visible {
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
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
    transform: none !important;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>
<template>
  <component
    :is="as"
    ref="buttonEl"
    v-bind="passthroughAttrs"
    class="zbtn"
    :class="[`zbtn--${variant}`, `zbtn--${size}`, { 'zbtn--magnetic': magnetic }]"
    :type="buttonType"
    :disabled="isNativeButton ? disabled || undefined : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    :tabindex="isDisabledNonNative ? -1 : undefined"
    @click="blockDisabledActivation"
    @keydown.enter="blockDisabledActivation"
    @keydown.space="blockDisabledActivation"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <span ref="innerEl" class="zbtn__inner">
      <span v-if="icon || $slots.icon" class="zbtn__icon">
        <component :is="icon" v-if="icon" aria-hidden="true" />
        <slot v-else name="icon" />
      </span>
      <slot />
      <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
        <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
        <slot v-else name="iconRight" />
      </span>
    </span>
  </component>
</template>

<script setup lang="ts">
// Primitive bouton du DS — label mono, dimensions généreuses, micro-effet magnétique.
// Porté de docs/design_system/components/core/Button.jsx et Home - Awwwards.html.
import type { Component, ComponentPublicInstance } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

type IconProp = string | Component;

interface Props {
  /** Style visuel. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" — hauteurs 32 / 46 / 48 */
  size?: "sm" | "md" | "lg";
  /** Icône leading via composant Vue ou nom de composant. */
  icon?: IconProp;
  /** Icône trailing via composant Vue ou nom de composant. */
  iconRight?: IconProp;
  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
  as?: string | Component;
  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
  disabled?: boolean;
  /** Activer le micro-effet magnétique au curseur. @default true */
  magnetic?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: undefined,
  iconRight: undefined,
  as: "button",
  disabled: false,
  magnetic: true,
});

const attrs = useAttrs();
const buttonEl = ref<Element | ComponentPublicInstance | null>(null);
const innerEl = ref<HTMLElement | null>(null);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(event: MediaQueryListEvent) {
  isReducedMotion.value = event.matches;
  if (event.matches) {
    onMouseLeave();
  }
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onMouseMove(event: MouseEvent) {
  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
    return;
  }
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return;
  }
  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  el.style.setProperty("--mag-x", `${(x * 0.16).toFixed(2)}px`);
  el.style.setProperty("--mag-y", `${(y * 0.18).toFixed(2)}px`);
  if (innerEl.value) {
    innerEl.value.style.setProperty("--mag-inner-x", `${(x * 0.08).toFixed(2)}px`);
    innerEl.value.style.setProperty("--mag-inner-y", `${(y * 0.1).toFixed(2)}px`);
  }
}

function onMouseLeave() {
  if (buttonEl.value) {
    const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
    if (el instanceof HTMLElement) {
      el.style.removeProperty("--mag-x");
      el.style.removeProperty("--mag-y");
    }
  }
  if (innerEl.value) {
    innerEl.value.style.removeProperty("--mag-inner-x");
    innerEl.value.style.removeProperty("--mag-inner-y");
  }
}

watch(
  () => [props.magnetic, props.disabled],
  () => {
    onMouseLeave();
  },
);

// `as` accepte une balise native ("button", "a") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const isDisabledNonNative = computed(() => !isNativeButton.value && props.disabled);
const buttonType = computed(() => {
  if (!isNativeButton.value) {
    return undefined;
  }
  return typeof attrs.type === "string" ? (attrs.type as "button" | "submit" | "reset") : "button";
});

// Transmet tous les attributs au root polymorphe en excluant `type` pour les non-boutons
// et en retirant `href` si l'élément non natif est désactivé.
const passthroughAttrs = computed(() => {
  if (isNativeButton.value) {
    return attrs;
  }
  const { type: _discardedType, ...rest } = attrs;
  if (props.disabled) {
    const { href: _discardedHref, ...withoutHref } = rest;
    return withoutHref;
  }
  return rest;
});

function blockDisabledActivation(event: Event) {
  if (!props.disabled) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
.zbtn {
  --_h: 46px;
  --_px: var(--space-5);
  --_fs: var(--fs-sm);
  --_ty: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--_h);
  padding: 0 var(--_px);
  font-family: var(--font-mono);
  font-size: var(--_fs);
  font-weight: var(--fw-medium);
  line-height: 1;
  letter-spacing: var(--ls-wide);
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transform: translate(var(--mag-x, 0), calc(var(--mag-y, 0) + var(--_ty, 0)));
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  @media (hover: hover) {
    &:hover {
      --_ty: -1px;
    }
  }

  &:active {
    --_ty: 0;
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
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
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
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

codex
Le diff implémente bien une grande partie du contenu attendu. Je vérifie les zones qui peuvent casser l’acceptance malgré un rendu plausible : JSON-LD exact, focus clavier sur les cartes/étapes, et la forme du CTA final.
exec
/bin/zsh -lc "sed -n '120,250p' docs/implementation-artifacts/code-reviews/12-5/full.diff" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '280,520p' app/pages/services.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  n: string;
+  title: string;
+  desc: string;
+  inlineCta?: {
+    to: string;
+    label: string;
+  };
 }
 
-// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
-// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
+// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
 const offers: Offer[] = [
   {
-    id: "wordpress",
-    icon: "wp",
-    title: "WordPress sur-mesure",
-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
-    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
-    price: "à partir de 1 500 €",
-    featured: false,
+    id: "sprint",
+    icon: "zap",
+    title: "AI Workflow Sprint",
+    hook: "Un Sprint = un workflow prioritaire",
+    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
+    points: [
+      "Diagnostic approfondi & cartographie avant/après",
+      "Architecture système, connecteurs API & intégrations métier",
+      "Modèles d'IA & prompt engineering avec sorties typées",
+      "Tests automatisés sur cas réels & boucle de validation humaine",
+      "Déploiement en production, documentation & mesure initiale",
+    ],
+    price: "À partir de 3 500 € HT",
+    featured: true,
+    ctaText: "Lancer un Sprint",
+    ctaAriaLabel: "Discuter d'un AI Workflow Sprint",
   },
   {
-    id: "apps",
-    icon: "code",
-    title: "Applications web",
-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
-    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
-    price: "sur devis",
-    featured: true,
+    id: "blueprint",
+    icon: "layers",
+    title: "AI Workflow Blueprint",
+    hook: "Cadrage préalable pour problématique complexe",
+    desc: "Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.",
+    points: [
+      "Audit du processus actuel, volumes & points de friction",
+      "Matrice de décision : code déterministe vs IA vs humain",
+      "Schéma d'architecture technique & flux de données cibles",
+      "Analyse des risques, contraintes de sécurité & secrets",
+      "Spécification des KPI de mesure & estimation budgétaire",
+    ],
+    price: "À partir de 750 € HT",
+    featured: false,
+    ctaText: "Demander un Blueprint",
+    ctaAriaLabel: "Demander un AI Workflow Blueprint",
   },
   {
-    id: "ia",
-    icon: "spark",
-    title: "IA & automatisation",
-    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
-    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
-    price: "sur devis",
+    id: "care",
+    icon: "bot",
+    title: "AI Care",
+    hook: "Maintien en condition opérationnelle",
+    desc: "Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.",
+    points: [
+      "Supervision proactive, alertes & analyse des échecs",
+      "Maintenance corrective & adaptation aux APIs tierces",
+      "Suivi des coûts d'inférence & micro-ajustements de prompts",
+      "Support technique réactif & veille sur les nouveaux modèles",
+    ],
+    disclaimer:
+      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
+    price: "À partir de 490 € HT / mois",
     featured: false,
+    ctaText: "Découvrir AI Care",
+    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
   },
 ];
 
-// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
-// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
-// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
-const steps = [
-  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
-  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
-  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
-  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
+// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
+const steps: Step[] = [
+  {
+    n: "01",
+    title: "Diagnostic",
+    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
+    inlineCta: {
+      to: "/contact",
+      label: "Identifier un workflow →",
+    },
+  },
+  {
+    n: "02",
+    title: "Cadrage",
+    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
+  },
+  {
+    n: "03",
+    title: "Construction & intégration",
+    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
+  },
+  {
+    n: "04",
+    title: "Suivi & amélioration",
+    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
+  },
 ];
 
 const siteUrl = useSiteUrl();
@@ -133,9 +203,9 @@ const siteUrl = useSiteUrl();
 const servicesJsonLd = {
   "@context": "https://schema.org",
   "@type": "WebPage",

 succeeded in 0ms:
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__badge {
  margin-bottom: var(--space-3);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);
  margin-bottom: var(--space-4);
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__title {
  margin-bottom: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.offer__hook {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  letter-spacing: var(--ls-wide);
  color: var(--accent);
}

.offer__desc {
  margin: 0 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__points {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding: var(--space-1) 0 var(--space-1) var(--space-5);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  // Puce fléchée « → »
  li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }
}

.offer__footer {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  padding-top: var(--space-5);
}

.offer__price {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  b {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.offer__disclaimer {
  margin: var(--space-2) 0 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--text-muted);
  opacity: 0.85;
}

.offer__cta {
  margin-top: var(--space-4);
}

.offer__btn {
  width: 100%;
}

// ---- Section process ----
.process__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.process__step {
  display: flex;
  flex-direction: column;
}

.process__num {
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-light);
  color: var(--accent);
}

.process__step-title {
  margin: var(--space-2) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process__desc {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.process__cta-inline-wrapper {
  margin-top: auto;
  padding-top: var(--space-3);
}

.process__inline-cta {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;
  transition:
    color var(--dur-base) var(--ease-standard),
    text-decoration-color var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

.process__cta {
  margin-top: var(--space-12);
  text-align: center;
}

// ---- Responsive ----
@media (width <= 900px) {
  .grid-3,
  .process {
    grid-template-columns: 1fr;
  }
}
</style>

exec
/bin/zsh -lc "sed -n '200,320p' docs/implementation-artifacts/code-reviews/12-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+    ],
+    disclaimer:
+      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
+    price: "À partir de 490 € HT / mois",
     featured: false,
+    ctaText: "Découvrir AI Care",
+    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
   },
 ];
 
-// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
-// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
-// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
-const steps = [
-  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
-  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
-  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
-  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
+// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
+const steps: Step[] = [
+  {
+    n: "01",
+    title: "Diagnostic",
+    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
+    inlineCta: {
+      to: "/contact",
+      label: "Identifier un workflow →",
+    },
+  },
+  {
+    n: "02",
+    title: "Cadrage",
+    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
+  },
+  {
+    n: "03",
+    title: "Construction & intégration",
+    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
+  },
+  {
+    n: "04",
+    title: "Suivi & amélioration",
+    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
+  },
 ];
 
 const siteUrl = useSiteUrl();
@@ -133,9 +203,9 @@ const siteUrl = useSiteUrl();
 const servicesJsonLd = {
   "@context": "https://schema.org",
   "@type": "WebPage",
-  name: "Services — jouan.ovh",
+  name: "Services & Tarifs — Simon Jouan",
   description:
-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
   url: `${siteUrl}/services`,
   mainEntity: {
     "@type": "ItemList",
@@ -161,9 +231,9 @@ const servicesJsonLd = {
 };
 
 usePageSeo({
-  title: "Services — jouan.ovh",
+  title: "Services & Tarifs — Simon Jouan",
   description:
-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
   path: "/services",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -172,7 +242,7 @@ usePageSeo({
 </script>
 
 <style lang="scss" scoped>
-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
+/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
 .services {
   display: block;
 }
@@ -180,9 +250,9 @@ usePageSeo({
 // .section / .section--sunken / .container / .eyebrow / .prose : primitives de
 // layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
 
-// ---- En-tête (porté de Services.jsx L13-21) ----
+// ---- En-tête ----
 .services__title {
-  max-width: 16ch;
+  max-width: 22ch;
   margin-bottom: var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-4xl);
@@ -192,12 +262,12 @@ usePageSeo({
 }
 
 .services__intro {
-  max-width: 60ch;
+  max-width: 62ch;
   margin-bottom: var(--space-10);
   color: var(--text-muted);
 }
 
-// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
+// ---- Grille des offres (.grid-3 / .offer*) ----
 .grid-3 {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
@@ -211,8 +281,6 @@ usePageSeo({
   }
 }
 
-// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
-// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
 .offer {
   display: flex;
   flex-direction: column;
@@ -230,9 +298,6 @@ usePageSeo({
   width: var(--space-10); // 40px
   height: var(--space-10);
   margin-bottom: var(--space-4);
-

exec
/bin/zsh -lc "sed -n '1,280p' app/pages/services.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="services">
    <!-- En-tête + grille d'offres (story 12.5) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
        <h1 class="services__title">Des systèmes IA construits autour de vos vrais processus métier.</h1>
        <p class="prose services__intro">
          Je pars d’un workflow existant, pas d’une technologie à placer. Du cadrage initial jusqu'au maintien en
          condition opérationnelle, l’IA intervient uniquement là où elle apporte réellement quelque chose.
        </p>

        <ul class="grid-3">
          <li v-for="offer in offers" :key="offer.id">
            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
              <div v-if="offer.featured" class="offer__badge">
                <ZBadge tone="accent">Format cœur</ZBadge>
              </div>
              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
              <h2 class="offer__title">{{ offer.title }}</h2>
              <p v-if="offer.hook" class="offer__hook">{{ offer.hook }}</p>
              <p class="offer__desc">{{ offer.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in offer.points" :key="point">{{ point }}</li>
              </ul>
              <div class="offer__footer">
                <div class="offer__price">
                  <b>{{ offer.price }}</b>
                </div>
                <p v-if="offer.disclaimer" class="offer__disclaimer">
                  {{ offer.disclaimer }}
                </p>
                <div class="offer__cta">
                  <ZButton
                    :as="NuxtLink"
                    to="/contact"
                    :variant="offer.featured ? 'primary' : 'secondary'"
                    :aria-label="offer.ctaAriaLabel"
                    class="offer__btn"
                  >
                    {{ offer.ctaText }}
                  </ZButton>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Section process : 4 étapes ordonnées + CTA (story 12.5) -->
    <section class="section section--sunken">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
        <h2 class="process__title">Un déroulé simple en quatre temps</h2>

        <ol class="process">
          <li v-for="step in steps" :key="step.n" class="process__step">
            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
            <h3 class="process__step-title">{{ step.title }}</h3>
            <p class="prose process__desc">{{ step.desc }}</p>
            <div v-if="step.inlineCta" class="process__cta-inline-wrapper">
              <NuxtLink :to="step.inlineCta.to" class="process__inline-cta">
                {{ step.inlineCta.label }}
              </NuxtLink>
            </div>
          </li>
        </ol>

        <div class="process__cta">
          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
            Me parler de votre besoin
            <template #iconRight><ZIcon name="arrow" /></template>
          </ZButton>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Services : catalogue d'offres IA packagées + process 4 étapes + CTA contact.
// Données statiques (3 offres, 4 étapes) déclarées localement. Prerender-safe, dark-first.
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

interface Offer {
  /** Clé v-for stable (indépendante du contenu affiché). */
  id: string;
  /** Nom d'icône dans le set ZIcon. */
  icon: string;
  title: string;
  hook?: string;
  desc: string;
  points: string[];
  price: string;
  disclaimer?: string;
  /** Offre mise en avant : carte accent + glow + badge. */
  featured: boolean;
  ctaText: string;
  ctaAriaLabel: string;
}

interface Step {
  n: string;
  title: string;
  desc: string;
  inlineCta?: {
    to: string;
    label: string;
  };
}

// Les 3 offres officielles V1 — 1re personne, vouvoiement, zéro emoji.
const offers: Offer[] = [
  {
    id: "sprint",
    icon: "zap",
    title: "AI Workflow Sprint",
    hook: "Un Sprint = un workflow prioritaire",
    desc: "Conception, intégration logicielle et mise en production d'un workflow métier complet avec IA ciblée et supervision humaine.",
    points: [
      "Diagnostic approfondi & cartographie avant/après",
      "Architecture système, connecteurs API & intégrations métier",
      "Modèles d'IA & prompt engineering avec sorties typées",
      "Tests automatisés sur cas réels & boucle de validation humaine",
      "Déploiement en production, documentation & mesure initiale",
    ],
    price: "À partir de 3 500 € HT",
    featured: true,
    ctaText: "Lancer un Sprint",
    ctaAriaLabel: "Discuter d'un AI Workflow Sprint",
  },
  {
    id: "blueprint",
    icon: "layers",
    title: "AI Workflow Blueprint",
    hook: "Cadrage préalable pour problématique complexe",
    desc: "Pour les projets nécessitant un audit préalable, une modélisation de données et des choix d'architecture avant de s'engager sur le build.",
    points: [
      "Audit du processus actuel, volumes & points de friction",
      "Matrice de décision : code déterministe vs IA vs humain",
      "Schéma d'architecture technique & flux de données cibles",
      "Analyse des risques, contraintes de sécurité & secrets",
      "Spécification des KPI de mesure & estimation budgétaire",
    ],
    price: "À partir de 750 € HT",
    featured: false,
    ctaText: "Demander un Blueprint",
    ctaAriaLabel: "Demander un AI Workflow Blueprint",
  },
  {
    id: "care",
    icon: "bot",
    title: "AI Care",
    hook: "Maintien en condition opérationnelle",
    desc: "Maintien en condition opérationnelle d'une capacité intégrée au processus métier pour garantir disponibilité, précision et maîtrise des coûts.",
    points: [
      "Supervision proactive, alertes & analyse des échecs",
      "Maintenance corrective & adaptation aux APIs tierces",
      "Suivi des coûts d'inférence & micro-ajustements de prompts",
      "Support technique réactif & veille sur les nouveaux modèles",
    ],
    disclaimer:
      "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client.",
    price: "À partir de 490 € HT / mois",
    featured: false,
    ctaText: "Découvrir AI Care",
    ctaAriaLabel: "Découvrir l'accompagnement AI Care",
  },
];

// Étapes du process en 4 temps. L'ordre du tableau garantit l'affichage 01 → 04.
const steps: Step[] = [
  {
    n: "01",
    title: "Diagnostic",
    desc: "Échange de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant et identifier les goulots d'étranglement.",
    inlineCta: {
      to: "/contact",
      label: "Identifier un workflow →",
    },
  },
  {
    n: "02",
    title: "Cadrage",
    desc: "Formalisation du workflow cible, des étapes manuelles à conserver sous contrôle humain, des connecteurs API requis et des KPI de mesure. Fait l'objet d'un Blueprint pour les sujets complexes.",
  },
  {
    n: "03",
    title: "Construction & intégration",
    desc: "Développement logiciel du système, connexion aux outils métiers (CRM, ERP, messagerie...), couverture de tests automatisés et mise à l'épreuve sur cas réels avant livraison.",
  },
  {
    n: "04",
    title: "Suivi & amélioration",
    desc: "Monitoring en production, maintenance préventive/corrective, ajustements aux évolutions d'APIs tierces ou modèles d'IA, mesure factuelle des résultats.",
  },
];

const siteUrl = useSiteUrl();

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Services & Tarifs — Simon Jouan",
  description:
    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
  url: `${siteUrl}/services`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: offer.title,
        description: offer.desc,
        provider: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: SITE.profile.name,
        },
        offers: {
          "@type": "Offer",
          description: offer.price,
        },
      },
    })),
  },
};

usePageSeo({
  title: "Services & Tarifs — Simon Jouan",
  description:
    "Développement de systèmes IA et automatisation de processus métier : offres packagées (AI Workflow Sprint, Blueprint, AI Care) et déroulement d'intervention transparent.",
  path: "/services",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: servicesJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) */
.services {
  display: block;
}

// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- En-tête ----
.services__title {
  max-width: 22ch;
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.services__intro {
  max-width: 62ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Grille des offres (.grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;

codex
- **JSON-LD root type is not the specified `ItemList`** — violates AC4 / structured data constraint. Evidence: `servicesJsonLd` is implemented with `"@type": "WebPage"` and only nests the offers under `mainEntity: { "@type": "ItemList" }`, while AC4 requires the `servicesJsonLd` object itself to be `@type: "ItemList"` / `Service`.

- **Offer cards and process steps are not keyboard-focusable** — violates AC5 a11y requirement: “Tab traverse les cartes d'offres et les étapes avec focus visible.” Evidence: the diff renders `<ZCard class="offer" ...>` without `interactive`, `as`, or `tabindex`, and `.process__step` is a plain `<li>` with no `tabindex` or `:focus-visible` style. Only nested CTAs/links can receive focus.

- **Hard-coded CSS value remains in scoped styles** — violates AC5 / design-token constraint: “tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).” Evidence: `.offer__icon` sets `font-size: 22px;` directly in the diff instead of using a token or custom property.
tokens used
35 978
- **JSON-LD root type is not the specified `ItemList`** — violates AC4 / structured data constraint. Evidence: `servicesJsonLd` is implemented with `"@type": "WebPage"` and only nests the offers under `mainEntity: { "@type": "ItemList" }`, while AC4 requires the `servicesJsonLd` object itself to be `@type: "ItemList"` / `Service`.

- **Offer cards and process steps are not keyboard-focusable** — violates AC5 a11y requirement: “Tab traverse les cartes d'offres et les étapes avec focus visible.” Evidence: the diff renders `<ZCard class="offer" ...>` without `interactive`, `as`, or `tabindex`, and `.process__step` is a plain `<li>` with no `tabindex` or `:focus-visible` style. Only nested CTAs/links can receive focus.

- **Hard-coded CSS value remains in scoped styles** — violates AC5 / design-token constraint: “tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).” Evidence: `.offer__icon` sets `font-size: 22px;` directly in the diff instead of using a token or custom property.

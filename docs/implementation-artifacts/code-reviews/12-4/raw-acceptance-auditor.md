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
session id: 01a0ac16-7ddb-7601-ab1a-7c38c024f9ca
--------
user
# Acceptance Auditor Prompt — Story 12.4

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/projects-showcase.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.4), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-4/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais utiliser la compétence `bmad-code-review` pour cadrer l’audit, puis lire la story, les specs de contexte et le diff avant de produire uniquement les constats demandés.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-code-review
description: 'Review code changes adversarially using parallel review layers (Blind Hunter, Edge Case Hunter, Acceptance Auditor) with structured triage into actionable categories. Use when the user says "run code review" or "review this code"'
---

# Code Review Workflow

**Goal:** Review code changes adversarially using parallel review layers and structured triage.

**Your Role:** You are an elite code reviewer. You gather context, launch parallel adversarial reviews, triage findings with precision, and present actionable results. No noise, no filler.

## Conventions

- Bare paths (e.g. `checklist.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `project_context` = `**/project-context.md` (load if exists)
- CLAUDE.md / memory files (load if exist)
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

- **Micro-file Design**: Each step is self-contained and followed exactly
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Persist progress via in-memory variables
- **Append-Only Building**: Build artifacts incrementally

### Step Processing Rules

1. **READ COMPLETELY**: Read the entire step file before acting
2. **FOLLOW SEQUENCE**: Execute sections in order
3. **WAIT FOR INPUT**: Halt at checkpoints and wait for human
4. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** follow the exact instructions in the step file
- **ALWAYS** halt at checkpoints and wait for human input

## FIRST STEP

Read fully and follow: `./steps/step-01-gather-context.md`

codex
La compétence contient un workflow très prescriptif avec des checkpoints humains, mais votre consigne explicite demande un audit complet sans pause. Je garde donc son angle “Acceptance Auditor” et j’applique vos règles de sortie en priorité.
exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/projects-showcase.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Vitrine Projets & Démonstrateurs Techniques

## 1. Les 3 Projets Phares du Repositionnement

Les trois projets sélectionnés représentent trois familles de problèmes distinctes et apportent des preuves concrètes de maîtrise sur toute la chaîne logicielle :

### 1.1 Keova Signal — Intelligence Commerciale & Qualification Autonome
- **Statut :** Système interne / En développement actif (Dépôt privé `zohac/keova_signal`, pas de lien sortant direct, badge `Projet interne / Dépôt privé`).
- **Accroche :** Détecter le bon prospect au bon moment.
- **Description :** Moteur d’acquisition B2B conçu pour détecter les créations d'entreprises au moment exact de leur immatriculation légale. Il ingère les flux Open Data Sirene Insee (régulation Token Bucket 25 req/min, filtre CNIL strict `statutDiffusion != 'O'`), découvre la présence web des dirigeants par scraping éthique (Cheerio, détection CMS et signaux faibles de lancement), applique un double étage de scoring (ICP Gate binaire + Priority Score 0 à 100 via règles déclaratives YAML versionnées) et expose un serveur MCP natif (10 outils typés) permettant le pilotage par agent IA avec validation humaine.
- **Preuves techniques apportées :** Ingestion Open Data Insee, limitation Token Bucket, filtre éthique/CNIL, web discovery heuristique, scraping Cheerio assaini, scoring double étage découplé (Zod), audit trail append-only en JSONB, serveur MCP natif (transport stdio, 10 outils), boucle human-in-the-loop.
- **Stack affichable :** `Node.js 22` · `TypeScript` · `MCP Server` · `PostgreSQL` · `Cheerio` · `Docker`
- **Visuels disponibles :**
  - Image principale : `public/images/projects/keova-signal-dashboard.png` (Vue dashboard sombre, funnel 1 465 leads, scoring coloré).
  - Image zoom : `public/images/projects/keova-signal-drawer.png` (Tiroir latéral, fit score, décomposition des règles YAML).
  - Image data : `public/images/projects/keova-signal-analytics.png` (Efficacité par canal Instagram/Email/Form, conversion CMS).

### 1.2 Debrief — IA Locale & Privacy-First pour Équipes Commerciales
- **Statut :** R&D / En développement (Dépôt privé `zohac/debrief`, application desktop privacy-first).
- **Accroche :** Transformer un rendez-vous commercial en apprentissage exploitable.
- **Description :** Application desktop respectueuse de la vie privée reposant sur le principe du *privacy by impossibility* : 100 % des inférences et traitements tournent en local sur la machine, sans dépendance externe ni envoi réseau. Elle orchestre ASR local via `whisper.cpp` (`ggml-large-v3.bin`), diarisation locuteurs via `sherpa-onnx` (Pyannote 3.0 + 3D-Speaker Eres2Net), anonymisation locale par bras composite GLiNER + CamemBERT-NER avec passerelle anti-fuite étanche (`SafeEnginePayload`), et génération de la carte débrief via `llama-server` supervisé embarquant Google Gemma 4 IT (GGUF Q4_K_M) sur 65 536 tokens de contexte.
- **Preuves techniques apportées :** 100 % on-device (zéro fuite réseau), orchestration native Tauri/Rust, bindings C++ / Rust, ONNX Runtime (`ort`), modèles ASR & diarisation multi-locuteurs, anonymisation NER réversible, supervision de sous-processus `llama-server`, UI warm-paper éditoriale.
- **Stack affichable :** `Tauri` · `Rust` · `whisper.cpp` · `sherpa-onnx` · `llama.cpp` · `Gemma 4`
- **Visuels disponibles dans `public/images/projects/` :**
  - `debrief-dashboard.png` (Vue dashboard d'accueil, métriques et synthèse).
  - `debrief-enregistrer-un-appel.png` (Écran d'enregistrement / import audio, consentement).
  - `debrief-journal-list.png` (Liste des rendez-vous et statuts).
  - `debrief-journal-detail.png` (Carte débrief détaillée, verbatims, conseil pivot et analyse).

### 1.3 Devis-Assist — Pipeline Documentaire Métier & Chiffrage BTP
- **Statut :** Produit / Spécifications & Architecture BMM validées (Dépôt privé `zohac/devis-assist`).
- **Accroche :** Transformer un historique de devis BTP en aide au chiffrage.
- **Description :** Solution d'ingestion et d'analyse de devis artisans BTP pour accélérer la production d'un premier budget. Elle combine l'API Mistral OCR 3 (extraction native des tableaux en Markdown/HTML avec 95 % d'exactitude), un traitement asynchrone découplé par file de tâches BullMQ/Redis derrière une interface port/adapter (`OcrProviderPort`), et un référentiel métier dynamique à base de services canoniques hiérarchisés. L'algorithme de matching s'appuie sur une boucle d'auto-apprentissage (Data Flywheel) : exact match, trigramme PostgreSQL `pg_trgm`, mots-clés et consolidation des alias validés par la revue humaine.
- **Preuves techniques apportées :** Architecture hexagonale (ports/adapters), intégration Mistral OCR 3, file de tâches asynchrone BullMQ/Redis, Data Flywheel avec apprentissage des alias par validation humaine, matching flou trigramme PostgreSQL, souveraineté multi-tenant des catalogues de prix.
- **Stack affichable :** `NestJS` · `Nuxt UI 4` · `PostgreSQL pg_trgm` · `Mistral OCR` · `BullMQ`
- **Visuels :** Spécifications d'écrans détaillées Nuxt UI (web) et Flutter (mobile). Schéma de pipeline documentaire.

---

## 2. Statut et Conservation des Anciens Projets

Les anciens projets ne sont pas supprimés du site, mais ils cèdent la place d'honneur sur la page d'accueil pour éviter de brouiller le message :

- **Keova (App) :** Reste mentionné dans le parcours / portfolio global. **Règle absolue :** Ne plus jamais utiliser la mention obsolète "ERP équestre", remplacer par une formulation d'application SaaS de gestion opérationnelle.
- **Nodium :** Reste dans l'historique R&D. **Règle absolue :** Ne pas employer l'intitulé "Ingénieur IA", préférer "Créateur · R&D agents IA" ou "Développeur IA".
- **TryOn & Projets Web historiques :** Reclassés dans le parcours ou les archives d'ingénierie logicielle.

exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
---

# Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)

Status: review

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

- [x] Tâche 1 — Modélisation et enrichissement des métadonnées de projets dans `app/data/site.ts` (AC: 1, 2)
  - [x] Mettre à jour l'interface `IProject` pour supporter optionnellement `hook?: string`, `image?: string`, `imageAlt?: string`, `badge?: string`, `statusVariant?: string` sans casser la compatibilité existante (`FooterComponent`, `HomeHeroTerminal`, `About.ts`).
  - [x] Aligner les entrées de `SITE.projects` avec les libellés officiels de `projects-showcase.md` :
    - Keova Signal : accroche, statut `● Système interne / En développement actif`, image `/images/projects/keova-signal-dashboard.png`, badge `Projet interne / Dépôt privé`
    - Debrief : accroche, statut `◐ R&D / En développement`, image `/images/projects/debrief-dashboard.png`, badge `Dépôt privé`
    - Devis-Assist : accroche, statut `○ Produit / Architecture BMM validée`, badge `Dépôt privé`

- [x] Tâche 2 — Intégration du composant et de la grille de cartes riches dans `app/pages/index.vue` (AC: 1, 2, 3)
  - [x] Remplacer l'ancienne liste linéaire `.work` par une grille de cartes riches mettant en scène les 3 démonstrateurs techniques.
  - [x] Utiliser `<ZCard>` (ou structure dédiée conforme au Design System) avec :
    - En-tête de carte : numéro de projet, badge de confidentialité `<ZBadge>`, pastille de statut
    - Visuel projet optimisé avec `<NuxtImg>` (lazy-loading, format webp, fallback visuel soigné pour Devis-Assist)
    - Titre du projet et accroche métier mise en avant
    - Description technique mettant en valeur la résolution du problème concret
    - Liste des tags technologiques avec `<ZTag>`
  - [x] S'assurer de l'absence de lien mort (pas de balise `<a>` vide ou `href="#"`).

- [x] Tâche 3 — Styles SCSS, responsive et design tokens (AC: 3)
  - [x] Développer les styles SCSS scopés pour la vitrine de projets dans `app/pages/index.vue`.
  - [x] Définir les adaptations responsive sous 900px et 680px (bascule fluide en 1 colonne sur mobile).
  - [x] Intégrer les styles pour les visuels d'écran (ombrage discret, liseré de démarcation `--border-subtle`, arrondi `--radius-md`).
  - [x] Vérifier que tous les styles consomment les custom properties (`--space-*`, `--radius-*`, `--color-*`, `--text-*`).

- [x] Tâche 4 — Accessibilité, vérification sans emoji et respect motion (AC: 2, 3)
  - [x] Vérifier les attributs `alt` pertinents sur chaque image `<NuxtImg>`.
  - [x] Valider l'ordre de tabulation clavier et le focus visible (`:focus-visible`).
  - [x] Valider le respect strict de `prefers-reduced-motion: reduce`.
  - [x] Vérifier l'absence absolue de tout emoji dans le DOM et les textes.

- [x] Tâche 5 — Validation qualité Docker (AC: 4)
  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, et génération SSG Nitro réussie.

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
- Gemini 3.7 Flash (Antigravity Dev Agent)

### Debug Log References
- Exécution Docker de validation gate: `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 24 routes et assets statiques pré-rendus par Nitro.

### Completion Notes List
- Modélisation enrichie de `IProject` et de `SITE.projects` dans `app/data/site.ts` avec les métadonnées officielles (accroches, badges de confidentialité, visuels HD, statuts précis, tags technologiques).
- Remplacement de l'ancienne liste linéaire `.work` par la grille de cartes riches `.projects-grid` et `.project-card` utilisant `<ZCard>` (3D tilt interactif préservé), `<NuxtImg>` pour les captures Keova Signal et Debrief, et un schéma visuel de pipeline documentaire pour Devis-Assist.
- Intégration complète des badges `<ZBadge>`, tags `<ZTag>`, titres, accroches métier et descriptions techniques sans aucun lien sortant mort.
- Préservation intégrale du bloc de chiffres clés de réassurance `ul.stats`.
- Respect strict des tokens CSS, du responsive (grille 3 col desktop -> 1 col mobile < 900px), de `prefers-reduced-motion: reduce`, de l'accessibilité a11y et de la règle zéro emoji.
- Gate Docker 100% verte validée.

### File List
- `app/data/site.ts`
- `app/pages/index.vue`
- `docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md`
- `docs/implementation-artifacts/sprint-status.yaml`

exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/SPEC.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "rg -n \"Epic 12|Story 12\\.4|12\\.4|projets phares|vitrine\" docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md docs/implementation-artifacts/code-reviews/12-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
AGENTS.md:9:- **Projet :** `jouan.ovh` — Portfolio, vitrine de services et blog de **Simon Jouan** (développeur web freelance).
AGENTS.md:91:│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
docs/implementation-artifacts/code-reviews/12-4/full.diff:64:+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 12.4 / AC-1, AC-2, AC-3) -->
docs/implementation-artifacts/code-reviews/12-4/full.diff:196:+// ---- Section Projets sélectionnés (Story 12.4 / AC-1 & AC-3) ----
docs/implementation-artifacts/code-reviews/12-4/full.diff:515:diff --git a/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md b/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md
docs/implementation-artifacts/code-reviews/12-4/full.diff:517:--- a/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md
docs/implementation-artifacts/code-reviews/12-4/full.diff:518:+++ b/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md
docs/implementation-artifacts/code-reviews/12-4/full.diff:521: # Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
docs/implementation-artifacts/code-reviews/12-4/full.diff:557:-  - [ ] Développer les styles SCSS scopés pour la vitrine de projets dans `app/pages/index.vue`.
docs/implementation-artifacts/code-reviews/12-4/full.diff:562:+  - [x] Développer les styles SCSS scopés pour la vitrine de projets dans `app/pages/index.vue`.
docs/implementation-artifacts/code-reviews/12-4/full.diff:607:+- `docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md`
docs/implementation-artifacts/code-reviews/12-4/full.diff:617:-last_updated: "2026-09-16 (Story 12.4 initialisée en ready-for-dev)"
docs/implementation-artifacts/code-reviews/12-4/full.diff:618:+last_updated: "2026-09-16 (Story 12.4 terminée et passée en review)"
docs/implementation-artifacts/code-reviews/12-4/full.diff:625:   12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: done
docs/implementation-artifacts/code-reviews/12-4/full.diff:626:-  12-4-homepage-vitrine-des-3-projets-phares: ready-for-dev
docs/implementation-artifacts/code-reviews/12-4/full.diff:627:+  12-4-homepage-vitrine-des-3-projets-phares: review
docs/planning-artifacts/epics.md:59:FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md:66:#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
docs/planning-artifacts/epics.md:67:FR28: Source de données unique (`site.ts`), assainissement sémantique et cohérence globale du profil (nouveau titre, bio, localisation « France · Remote », stack ciblée, vitrine Keova Signal / Debrief / Devis-Assist, élimination de « Ingénieur IA » et « ERP équestre »). _(CAP-1)_
docs/planning-artifacts/epics.md:70:FR31: Page d'accueil — Vitrine des 3 projets phares (Keova Signal avec dashboard réel HD, Debrief 100% on-device avec capture HD, Devis-Assist avec pipeline OCR BTP et matching pg_trgm, sans faux ROI, relégation des anciens projets en archives/parcours). _(CAP-4)_
docs/planning-artifacts/epics.md:160:FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md:168:FR28: Epic 12 — Source de vérité site.ts, assainissement sémantique & profil
docs/planning-artifacts/epics.md:169:FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
docs/planning-artifacts/epics.md:170:FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
docs/planning-artifacts/epics.md:171:FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
docs/planning-artifacts/epics.md:172:FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
docs/planning-artifacts/epics.md:173:FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
docs/planning-artifacts/epics.md:174:FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
docs/planning-artifacts/epics.md:175:FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
docs/planning-artifacts/epics.md:176:FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
docs/planning-artifacts/epics.md:221:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md:224:### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:745:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md:791:**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
docs/planning-artifacts/epics.md:849:## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:906:**Then** la section vitrine expose 3 cartes `ZCard` d'offres :
docs/planning-artifacts/epics.md:918:### Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
docs/planning-artifacts/epics.md:927:**When** on rend la vitrine des projets phares

codex
J’ai chargé la story et les specs centrales. Je lis maintenant les portions précises de l’epic et le diff complet pour comparer les exigences ligne par ligne aux changements réels.
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-4/full.diff" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '849,970p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/data/site.ts b/app/data/site.ts
index 6292fdc..0e9a314 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -27,6 +27,10 @@ export interface IProject {
   name: string;
   role: string;
   desc: string;
+  hook?: string;
+  image?: string;
+  imageAlt?: string;
+  badge?: string;
   url?: string;
   status?: string;
   tags: string[];
@@ -67,22 +71,32 @@ const projects: IProject[] = [
   {
     name: "Keova Signal",
     role: "Concepteur & Développeur Full Stack",
-    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique et serveur MCP natif.",
-    status: "● Système interne / Dépôt privé",
+    hook: "Détecter le bon prospect au bon moment",
+    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique, double étage de scoring Zod et serveur MCP natif (10 outils).",
+    image: "/images/projects/keova-signal-dashboard.png",
+    imageAlt: "Tableau de bord de qualification de prospects Keova Signal",
+    badge: "Projet interne / Dépôt privé",
+    status: "● Système interne / En développement actif",
     tags: ["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"],
   },
   {
     name: "Debrief",
     role: "Concepteur & Développeur Full Stack",
-    desc: "Application desktop privacy-first de synthèse commerciale 100 % locale (ASR whisper.cpp, diarisation sherpa-onnx, LLM Gemma 4).",
-    status: "◐ R&D / Dépôt privé",
+    hook: "Transformer un rendez-vous commercial en apprentissage exploitable",
+    desc: "Application desktop privacy-first (100 % on-device) de synthèse commerciale et analyse d'appels, sans fuite réseau ni dépendance cloud externe.",
+    image: "/images/projects/debrief-dashboard.png",
+    imageAlt: "Interface desktop de synthèse d'appels Debrief",
+    badge: "Dépôt privé",
+    status: "◐ R&D / En développement",
     tags: ["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"],
   },
   {
     name: "Devis-Assist",
     role: "Architecte & Développeur Full Stack",
-    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ et matching flou PostgreSQL.",
-    status: "○ Architecture validée / Dépôt privé",
+    hook: "Transformer un historique de devis BTP en aide au chiffrage",
+    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ/Redis et matching flou PostgreSQL pg_trgm.",
+    badge: "Dépôt privé",
+    status: "○ Produit / Architecture BMM validée",
     tags: ["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"],
   },
 ];
diff --git a/app/pages/index.vue b/app/pages/index.vue
index ee2f388..911a337 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -117,7 +117,7 @@
       </div>
     </section>
 
-    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 12.4 / AC-1, AC-2, AC-3) -->
     <section class="section">
       <div class="container">
         <div class="block__head">
@@ -125,35 +125,61 @@
           <h2 class="section__title">Des produits qui tournent en production</h2>
         </div>
 
-        <ul class="work">
-          <li v-for="(project, index) in projects" :key="project.name">
-            <component
-              :is="project.url ? ZExternalLink : 'div'"
-              :href="project.url"
-              class="work__row"
-              :class="{ 'work__row--link': Boolean(project.url) }"
-              :data-hot="project.url ? '' : undefined"
-              @mousemove="onProjectMouseMove"
-              @mouseleave="onProjectMouseLeave"
-            >
-              <span class="work__no">{{ String(index + 1).padStart(2, "0") }}</span>
-              <div class="work__main">
-                <div class="work__topline">
-                  <h3 class="work__name">{{ project.name }}</h3>
-                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
+        <ul class="projects-grid">
+          <li v-for="(project, index) in projects" :key="project.name" class="projects-grid__item">
+            <ZCard class="project-card" interactive tilt :padded="false">
+              <div v-if="project.image" class="project-card__media">
+                <NuxtImg
+                  :src="project.image"
+                  :alt="project.imageAlt || `Capture d'écran du projet ${project.name}`"
+                  width="720"
+                  height="405"
+                  sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 380px"
+                  format="webp"
+                  loading="lazy"
+                  class="project-card__img"
+                />
+              </div>
+              <div v-else class="project-card__media project-card__media--schematic">
+                <div class="project-card__blueprint" aria-hidden="true">
+                  <div class="project-card__blueprint-grid">
+                    <div class="project-card__node">
+                      <ZIcon name="layers" class="project-card__node-icon" />
+                      <span class="project-card__node-label">Mistral OCR 3</span>
+                    </div>
+                    <span class="project-card__node-flow">→</span>
+                    <div class="project-card__node">
+                      <ZIcon name="zap" class="project-card__node-icon" />
+                      <span class="project-card__node-label">BullMQ / Redis</span>
+                    </div>
+                    <span class="project-card__node-flow">→</span>
+                    <div class="project-card__node">
+                      <ZIcon name="code" class="project-card__node-icon" />
+                      <span class="project-card__node-label">pg_trgm Match</span>
+                    </div>
+                  </div>
+                  <div class="project-card__blueprint-sub">Pipeline documentaire &amp; extraction tabulaire</div>
+                </div>
+              </div>
+
+              <div class="project-card__body">
+                <div class="project-card__header">
+                  <span class="project-card__no">{{ String(index + 1).padStart(2, "0") }} / 03</span>
+                  <ZBadge v-if="project.badge" tone="neutral">{{ project.badge }}</ZBadge>
                 </div>
-                <p class="work__role">{{ project.role }}</p>
-                <p class="prose work__desc">{{ project.desc }}</p>
-                <ul class="hero__tags work__tags">
-                  <li v-for="(tag, tagIndex) in project.tags" :key="`${tag}-${tagIndex}`">
+                <div class="project-card__title-wrap">
+                  <h3 class="project-card__title">{{ project.name }}</h3>
+                  <span v-if="project.status" class="project-card__status">{{ project.status }}</span>
+                </div>
+                <p v-if="project.hook" class="project-card__hook">{{ project.hook }}</p>
+                <p class="project-card__desc prose">{{ project.desc }}</p>
+                <ul class="hero__tags project-card__tags">
+                  <li v-for="tag in project.tags" :key="tag">
                     <ZTag>{{ tag }}</ZTag>
                   </li>
                 </ul>
               </div>
-              <span v-if="project.url" class="work__go" aria-hidden="true">
-                <ZIcon name="arrow" />
-              </span>
-            </component>
+            </ZCard>
           </li>
         </ul>
 
@@ -292,33 +318,6 @@ function onBootComplete() {
   isBootFinished.value = true;
 }
 
-function onProjectMouseMove(event: MouseEvent) {
-  if (isReducedMotion.value) {
-    return;
-  }
-  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
-    return;
-  }
-  const target = event.currentTarget as HTMLElement | null;
-  if (!target) {
-    return;
-  }
-  const rect = target.getBoundingClientRect();
-  if (rect.width <= 0 || rect.height <= 0) {
-    return;
-  }
-  const px = (event.clientX - rect.left) / rect.width - 0.5;
-  const py = (event.clientY - rect.top) / rect.height - 0.5;
-  target.style.transform = `perspective(1000px) rotateX(${-py * 3.5}deg) rotateY(${px * 4.5}deg) translateY(-2px)`;
-}
-
-function onProjectMouseLeave(event: MouseEvent) {
-  const target = event.currentTarget as HTMLElement | null;
-  if (target) {
-    target.style.transform = "";
-  }
-}
-
 interface HomeServiceOffer {
   id: string;
   no: string;
@@ -808,136 +807,187 @@ usePageSeo({
   color: var(--text-muted);
 }
 
-// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
-.work {
-  display: flex;
-  flex-direction: column;
+// ---- Section Projets sélectionnés (Story 12.4 / AC-1 & AC-3) ----
+.projects-grid {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-6);
   margin: 0;
   padding: 0;
   list-style: none;
 
   > li {
-    display: block;
-    width: 100%;
+    display: flex;
   }
 }
 
-.work__row {
+.project-card {
+  display: flex;
+  flex-direction: column;
+  width: 100%;
+}
+
+.project-card__media {
   position: relative;
-  display: grid;
-  grid-template-columns: var(--fs-6xl) 1fr auto;
-  gap: var(--space-6);
-  align-items: center;
-  padding: var(--space-8) var(--space-3);
-  border-top: 1px solid var(--border-subtle);
-  text-decoration: none;
-  color: inherit;
-  transition:
-    padding-left var(--dur-slow) var(--ease-out),
-    background var(--dur-slow) var(--ease-standard),
-    transform var(--dur-fast) var(--ease-standard);
+  width: 100%;
+  aspect-ratio: 16 / 9;
+  overflow: hidden;
+  background: var(--surface-0);
+  border-bottom: 1px solid var(--border-subtle);
+}
 
-  &::before {
-    content: "";
-    position: absolute;
-    inset: 0;
-    background: linear-gradient(90deg, var(--accent-soft), transparent 60%);
-    opacity: 0;
-    transition: opacity var(--dur-slow) var(--ease-standard);
-  }
+.project-card__img {
+  display: block;
+  width: 100%;
+  height: 100%;
+  object-fit: cover;
+  object-position: top center;
+  transition: transform var(--dur-slow) var(--ease-out);
 }
 
-li:last-child .work__row {
-  border-bottom: 1px solid var(--border-subtle);
+.project-card:hover .project-card__img {
+  transform: scale(1.03);

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

exec
/bin/zsh -lc "sed -n '260,620p' docs/implementation-artifacts/code-reviews/12-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  transform: scale(1.03);
 }
 
-.work__row--link {
-  cursor: pointer;
+.project-card__media--schematic {
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  padding: var(--space-4);
+  background:
+    radial-gradient(circle at center, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
+    var(--surface-0);
+}
 
-  &:hover {
-    padding-left: var(--space-6);
+.project-card__blueprint {
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  justify-content: center;
+  gap: var(--space-3);
+  width: 100%;
+  height: 100%;
+  padding: var(--space-3);
+  border: 1px dashed var(--border-default);
+  border-radius: var(--radius-sm);
+  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
+}
 
-    &::before {
-      opacity: 1;
-    }
+.project-card__blueprint-grid {
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  gap: var(--space-2);
+  width: 100%;
+}
 
-    .work__name {
-      color: var(--accent);
-    }
+.project-card__node {
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  gap: var(--space-1);
+  padding: var(--space-2);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-xs);
+  background: var(--surface-2);
+  box-shadow: var(--shadow-1);
+}
 
-    .work__go {
-      color: var(--accent);
-      transform: translate(6px, -6px);
-    }
-  }
+.project-card__node-icon {
+  font-size: var(--fs-md);
+  color: var(--accent);
+}
 
-  &:focus-visible {
-    outline: 2px solid transparent;
-    outline-offset: 2px;
-    box-shadow: var(--ring-accent);
-    border-radius: var(--radius-xs);
-  }
+.project-card__node-label {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  font-weight: var(--fw-medium);
+  color: var(--text-strong);
+  white-space: nowrap;
 }
 
-.work__no {
-  position: relative;
+.project-card__node-flow {
   font-family: var(--font-mono);
-  font-size: var(--fs-sm);
-  color: var(--text-faint);
+  font-size: var(--fs-xs);
+  color: var(--accent);
 }
 
-.work__main {
-  position: relative;
+.project-card__blueprint-sub {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--text-muted);
+  text-align: center;
+  letter-spacing: var(--ls-wide);
 }
 
-.work__topline {
+.project-card__body {
   display: flex;
-  flex-wrap: wrap;
-  align-items: baseline;
-  gap: var(--space-3);
+  flex: 1;
+  flex-direction: column;
+  padding: var(--space-6);
+}
+
+.project-card__header {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  gap: var(--space-2);
+  margin-bottom: var(--space-3);
+}
+
+.project-card__no {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wider);
+  color: var(--text-faint);
+}
+
+.project-card__title-wrap {
+  display: flex;
+  flex-direction: column;
+  gap: var(--space-1);
+  margin-bottom: var(--space-2);
 }
 
-.work__name {
+.project-card__title {
   margin: 0;
   font-family: var(--font-mono);
-  font-size: clamp(1.4rem, 2.8vw, 2rem);
+  font-size: var(--fs-xl);
   font-weight: var(--fw-regular);
-  letter-spacing: var(--ls-tight);
   color: var(--text-strong);
-  transition: color var(--dur-base) var(--ease-standard);
+  transition: color var(--dur-fast) var(--ease-standard);
 }
 
-.work__status {
-  font-family: var(--font-mono);
-  font-size: var(--fs-xs);
+.project-card:hover .project-card__title {
   color: var(--accent);
-  letter-spacing: var(--ls-wide);
 }
 
-.work__role {
-  margin: var(--space-1) 0 0;
+.project-card__status {
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  color: var(--text-muted);
+  color: var(--accent);
+  letter-spacing: var(--ls-wide);
 }
 
-.work__desc {
-  max-width: 65ch;
-  margin: var(--space-3) 0 0;
+.project-card__hook {
+  margin: 0 0 var(--space-3);
+  font-family: var(--font-sans);
   font-size: var(--fs-sm);
+  font-weight: var(--fw-medium);
+  font-style: italic;
+  color: var(--text-body);
+  line-height: var(--lh-snug);
 }
 
-.work__tags {
-  margin-top: var(--space-4);
+.project-card__desc {
+  margin: 0 0 var(--space-5);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
 }
 
-.work__go {
-  position: relative;
-  font-size: var(--fs-xl);
-  color: var(--text-faint);
-  transition:
-    transform var(--dur-base) var(--ease-out),
-    color var(--dur-base) var(--ease-standard);
+.project-card__tags {
+  margin-top: auto;
 }
 
 // ---- Stats (porté de .stats) ----
@@ -1197,6 +1247,7 @@ li:last-child .work__row {
   }
 
   .grid-3,
+  .projects-grid,
   .journal {
     grid-template-columns: 1fr;
   }
@@ -1212,16 +1263,6 @@ li:last-child .work__row {
 }
 
 @media (width <= 680px) {
-  .work__row {
-    grid-template-columns: 1fr;
-    gap: var(--space-3);
-  }
-
-  .work__no,
-  .work__go {
-    display: none;
-  }
-
   .pillars-grid,
   .stats {
     grid-template-columns: 1fr;
@@ -1233,8 +1274,7 @@ li:last-child .work__row {
     animation: none;
   }
 
-  .work__row,
-  .work__go,
+  .project-card__img,
   .jpost__arrow,
   .seeall {
     transition: none;
@@ -1248,16 +1288,12 @@ li:last-child .work__row {
     }
   }
 
-  .work__row {
-    transform: none !important;
+  .project-card:hover .project-card__img {
+    transform: none;
   }
 
-  .work__row--link:hover {
-    padding-left: var(--space-3);
-
-    .work__go {
-      transform: none;
-    }
+  .project-card:hover .project-card__title {
+    transition: none;
   }
 
   .jpost:hover {
diff --git a/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md b/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md
index 90607d2..6013c56 100644
--- a/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md
+++ b/docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md
@@ -4,7 +4,7 @@ baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
 
 # Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -62,38 +62,38 @@ so that je sois convaincu de la faisabilité de mon propre projet sans être tro
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Modélisation et enrichissement des métadonnées de projets dans `app/data/site.ts` (AC: 1, 2)
-  - [ ] Mettre à jour l'interface `IProject` pour supporter optionnellement `hook?: string`, `image?: string`, `badge?: string`, `statusVariant?: string` sans casser la compatibilité existante (`FooterComponent`, `HomeHeroTerminal`, `About.ts`).
-  - [ ] Aligner les entrées de `SITE.projects` avec les libellés officiels de `projects-showcase.md` :
+- [x] Tâche 1 — Modélisation et enrichissement des métadonnées de projets dans `app/data/site.ts` (AC: 1, 2)
+  - [x] Mettre à jour l'interface `IProject` pour supporter optionnellement `hook?: string`, `image?: string`, `imageAlt?: string`, `badge?: string`, `statusVariant?: string` sans casser la compatibilité existante (`FooterComponent`, `HomeHeroTerminal`, `About.ts`).
+  - [x] Aligner les entrées de `SITE.projects` avec les libellés officiels de `projects-showcase.md` :
     - Keova Signal : accroche, statut `● Système interne / En développement actif`, image `/images/projects/keova-signal-dashboard.png`, badge `Projet interne / Dépôt privé`
     - Debrief : accroche, statut `◐ R&D / En développement`, image `/images/projects/debrief-dashboard.png`, badge `Dépôt privé`
     - Devis-Assist : accroche, statut `○ Produit / Architecture BMM validée`, badge `Dépôt privé`
 
-- [ ] Tâche 2 — Intégration du composant et de la grille de cartes riches dans `app/pages/index.vue` (AC: 1, 2, 3)
-  - [ ] Remplacer l'ancienne liste linéaire `.work` par une grille de cartes riches mettant en scène les 3 démonstrateurs techniques.
-  - [ ] Utiliser `<ZCard>` (ou structure dédiée conforme au Design System) avec :
+- [x] Tâche 2 — Intégration du composant et de la grille de cartes riches dans `app/pages/index.vue` (AC: 1, 2, 3)
+  - [x] Remplacer l'ancienne liste linéaire `.work` par une grille de cartes riches mettant en scène les 3 démonstrateurs techniques.
+  - [x] Utiliser `<ZCard>` (ou structure dédiée conforme au Design System) avec :
     - En-tête de carte : numéro de projet, badge de confidentialité `<ZBadge>`, pastille de statut
     - Visuel projet optimisé avec `<NuxtImg>` (lazy-loading, format webp, fallback visuel soigné pour Devis-Assist)
     - Titre du projet et accroche métier mise en avant
     - Description technique mettant en valeur la résolution du problème concret
     - Liste des tags technologiques avec `<ZTag>`
-  - [ ] S'assurer de l'absence de lien mort (pas de balise `<a>` vide ou `href="#"`).
+  - [x] S'assurer de l'absence de lien mort (pas de balise `<a>` vide ou `href="#"`).
 
-- [ ] Tâche 3 — Styles SCSS, responsive et design tokens (AC: 3)
-  - [ ] Développer les styles SCSS scopés pour la vitrine de projets dans `app/pages/index.vue`.
-  - [ ] Définir les adaptations responsive sous 900px et 680px (bascule fluide en 1 colonne sur mobile).
-  - [ ] Intégrer les styles pour les visuels d'écran (ombrage discret, liseré de démarcation `--border-subtle`, arrondi `--radius-md`).
-  - [ ] Vérifier que tous les styles consomment les custom properties (`--space-*`, `--radius-*`, `--color-*`, `--text-*`).
+- [x] Tâche 3 — Styles SCSS, responsive et design tokens (AC: 3)
+  - [x] Développer les styles SCSS scopés pour la vitrine de projets dans `app/pages/index.vue`.
+  - [x] Définir les adaptations responsive sous 900px et 680px (bascule fluide en 1 colonne sur mobile).
+  - [x] Intégrer les styles pour les visuels d'écran (ombrage discret, liseré de démarcation `--border-subtle`, arrondi `--radius-md`).
+  - [x] Vérifier que tous les styles consomment les custom properties (`--space-*`, `--radius-*`, `--color-*`, `--text-*`).
 
-- [ ] Tâche 4 — Accessibilité, vérification sans emoji et respect motion (AC: 2, 3)
-  - [ ] Vérifier les attributs `alt` pertinents sur chaque image `<NuxtImg>`.
-  - [ ] Valider l'ordre de tabulation clavier et le focus visible (`:focus-visible`).
-  - [ ] Valider le respect strict de `prefers-reduced-motion: reduce`.
-  - [ ] Vérifier l'absence absolue de tout emoji dans le DOM et les textes.
+- [x] Tâche 4 — Accessibilité, vérification sans emoji et respect motion (AC: 2, 3)
+  - [x] Vérifier les attributs `alt` pertinents sur chaque image `<NuxtImg>`.
+  - [x] Valider l'ordre de tabulation clavier et le focus visible (`:focus-visible`).
+  - [x] Valider le respect strict de `prefers-reduced-motion: reduce`.
+  - [x] Vérifier l'absence absolue de tout emoji dans le DOM et les textes.
 
-- [ ] Tâche 5 — Validation qualité Docker (AC: 4)
-  - [ ] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, et génération SSG Nitro réussie.
+- [x] Tâche 5 — Validation qualité Docker (AC: 4)
+  - [x] Exécuter la gate de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, et génération SSG Nitro réussie.
 
 ## Dev Notes
 
@@ -123,9 +123,21 @@ so that je sois convaincu de la faisabilité de mon propre projet sans être tro
 ## Dev Agent Record
 
 ### Agent Model Used
+- Gemini 3.7 Flash (Antigravity Dev Agent)
 
 ### Debug Log References
+- Exécution Docker de validation gate: `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 24 routes et assets statiques pré-rendus par Nitro.
 
 ### Completion Notes List
+- Modélisation enrichie de `IProject` et de `SITE.projects` dans `app/data/site.ts` avec les métadonnées officielles (accroches, badges de confidentialité, visuels HD, statuts précis, tags technologiques).
+- Remplacement de l'ancienne liste linéaire `.work` par la grille de cartes riches `.projects-grid` et `.project-card` utilisant `<ZCard>` (3D tilt interactif préservé), `<NuxtImg>` pour les captures Keova Signal et Debrief, et un schéma visuel de pipeline documentaire pour Devis-Assist.
+- Intégration complète des badges `<ZBadge>`, tags `<ZTag>`, titres, accroches métier et descriptions techniques sans aucun lien sortant mort.
+- Préservation intégrale du bloc de chiffres clés de réassurance `ul.stats`.
+- Respect strict des tokens CSS, du responsive (grille 3 col desktop -> 1 col mobile < 900px), de `prefers-reduced-motion: reduce`, de l'accessibilité a11y et de la règle zéro emoji.
+- Gate Docker 100% verte validée.
 
 ### File List
+- `app/data/site.ts`
+- `app/pages/index.vue`
+- `docs/implementation-artifacts/12-4-homepage-vitrine-des-3-projets-phares.md`
+- `docs/implementation-artifacts/sprint-status.yaml`
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 29eb79a..e4c5dcf 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-16 (Story 12.4 initialisée en ready-for-dev)"
+last_updated: "2026-09-16 (Story 12.4 terminée et passée en review)"
 project: jouan.ovh
 project_key: NOKEY

exec
/bin/zsh -lc "sed -n '620,760p' docs/implementation-artifacts/code-reviews/12-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 project_key: NOKEY
 tracking_system: file-system
@@ -132,7 +132,7 @@ development_status:
   12-1-source-unique-de-donnees-sitets-et-coherence-globale: done
   12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: done
   12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: done
-  12-4-homepage-vitrine-des-3-projets-phares: ready-for-dev
+  12-4-homepage-vitrine-des-3-projets-phares: review
   12-5-page-services-restructuration-des-offres-et-process-4-etapes: backlog
   12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: backlog
   epic-12-retrospective: optional

codex
Le diff montre l’essentiel de l’implémentation. Je vérifie deux primitives (`ZBadge`, `ZCard`) et les métriques conservées, parce que plusieurs critères dépendent de leurs props réelles et du texte inchangé hors du hunk visible.
exec
/bin/zsh -lc "sed -n '140,210p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
                  class="project-card__img"
                />
              </div>
              <div v-else class="project-card__media project-card__media--schematic">
                <div class="project-card__blueprint" aria-hidden="true">
                  <div class="project-card__blueprint-grid">
                    <div class="project-card__node">
                      <ZIcon name="layers" class="project-card__node-icon" />
                      <span class="project-card__node-label">Mistral OCR 3</span>
                    </div>
                    <span class="project-card__node-flow">→</span>
                    <div class="project-card__node">
                      <ZIcon name="zap" class="project-card__node-icon" />
                      <span class="project-card__node-label">BullMQ / Redis</span>
                    </div>
                    <span class="project-card__node-flow">→</span>
                    <div class="project-card__node">
                      <ZIcon name="code" class="project-card__node-icon" />
                      <span class="project-card__node-label">pg_trgm Match</span>
                    </div>
                  </div>
                  <div class="project-card__blueprint-sub">Pipeline documentaire &amp; extraction tabulaire</div>
                </div>
              </div>

              <div class="project-card__body">
                <div class="project-card__header">
                  <span class="project-card__no">{{ String(index + 1).padStart(2, "0") }} / 03</span>
                  <ZBadge v-if="project.badge" tone="neutral">{{ project.badge }}</ZBadge>
                </div>
                <div class="project-card__title-wrap">
                  <h3 class="project-card__title">{{ project.name }}</h3>
                  <span v-if="project.status" class="project-card__status">{{ project.status }}</span>
                </div>
                <p v-if="project.hook" class="project-card__hook">{{ project.hook }}</p>
                <p class="project-card__desc prose">{{ project.desc }}</p>
                <ul class="hero__tags project-card__tags">
                  <li v-for="tag in project.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
        <ul class="stats">
          <li v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
    <section class="section">
      <div class="container">
        <div class="block__head block__head--row">
          <div>
            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
          </div>
          <NuxtLink to="/blog" class="seeall" data-hot>
            cat tous-les-articles
            <ZIcon name="arrow" class="seeall__icon" />
          </NuxtLink>
        </div>

        <!-- Liste des articles les plus récents -->

exec
/bin/zsh -lc 'rg -n "defineProps|variant|tone|interactive|tilt|stats|11|100|zéro|regression|régression|projects =|const projects" app/components app/pages/index.vue app/data/site.ts' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/data/site.ts:70:const projects: IProject[] = [
app/data/site.ts:86:    desc: "Application desktop privacy-first (100 % on-device) de synthèse commerciale et analyse d'appels, sans fuite réseau ni dépendance cloud externe.",
app/pages/index.vue:36:              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/index.vue:40:              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir mes systèmes IA </ZButton>
app/pages/index.vue:62:            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
app/pages/index.vue:130:            <ZCard class="project-card" interactive tilt :padded="false">
app/pages/index.vue:137:                  sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 380px"
app/pages/index.vue:168:                  <ZBadge v-if="project.badge" tone="neutral">{{ project.badge }}</ZBadge>
app/pages/index.vue:186:        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
app/pages/index.vue:187:        <ul class="stats">
app/pages/index.vue:188:          <li v-for="stat in stats" :key="stat.id" class="stat">
app/pages/index.vue:196:    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
app/pages/index.vue:213:            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
app/pages/index.vue:251:          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
app/pages/index.vue:256:    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
app/pages/index.vue:270:            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
app/pages/index.vue:278:              variant="secondary"
app/pages/index.vue:284:            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
app/pages/index.vue:293:// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
app/pages/index.vue:417:// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
app/pages/index.vue:418:const projects = SITE.projects;
app/pages/index.vue:420:// Chiffres clés de réassurance (Story 11.4 / AC-2).
app/pages/index.vue:421:const stats = [
app/pages/index.vue:422:  { id: "stat-1", value: "11", label: "années d'expérience web" },
app/pages/index.vue:423:  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
app/pages/index.vue:424:  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
app/pages/index.vue:427:// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
app/pages/index.vue:488:  min-height: 100vh;
app/pages/index.vue:498:  width: 100%;
app/pages/index.vue:605:  100% {
app/pages/index.vue:635:  width: 100%;
app/pages/index.vue:778:  width: 100%;
app/pages/index.vue:827:  width: 100%;
app/pages/index.vue:832:  width: 100%;
app/pages/index.vue:841:  width: 100%;
app/pages/index.vue:842:  height: 100%;
app/pages/index.vue:868:  width: 100%;
app/pages/index.vue:869:  height: 100%;
app/pages/index.vue:881:  width: 100%;
app/pages/index.vue:993:// ---- Stats (porté de .stats) ----
app/pages/index.vue:994:.stats {
app/pages/index.vue:1095:  width: 100%;
app/pages/index.vue:1112:  width: 100%;
app/pages/index.vue:1267:  .stats {
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
app/components/HeaderComponent.vue:29:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue:81:        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:85:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/HeaderComponent.vue:127:  const progress = h > 0 ? (top / h) * 100 : 0;
app/components/HeaderComponent.vue:128:  scrollProgress.value = Math.min(100, Math.max(0, progress));
app/components/HeaderComponent.vue:177:// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
app/components/HeaderComponent.vue:275:  width: 100%;
app/components/HeaderComponent.vue:277:  height: 100%;
app/components/HeaderComponent.vue:379:      width: 100%;
app/components/HeaderComponent.vue:396:    width: 100%;
app/components/CurrentTime.vue:46:  interval.value = setInterval(updateTime, 1000);
app/components/CurrentTime.vue:63:  font-variant-numeric: tabular-nums;
app/components/MainComponent.vue:20:  max-width: 100vw;
app/components/FooterComponent.vue:37:    <!-- Barre basse pleine largeur (border-top 100% de la fenêtre) -->
app/components/FooterComponent.vue:63:const projects = SITE.projects;
app/components/FooterComponent.vue:80:  width: 100%;
app/components/FooterComponent.vue:198:  width: 100%;
app/components/HexagonLinkComponent.vue:11:defineProps<{
app/components/HexagonLinkComponent.vue:29:  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
app/components/terminal/programs/About.ts:167:      '<table class="table w-100">\n' +
app/components/terminal/programs/About.ts:199:      '<table class="table w-100">\n' +
app/components/terminal/programs/About.ts:217:      '<table class="table w-100">\n' +
app/components/terminal/TerminalComponent.vue:77:  defineProps<{
app/components/terminal/TerminalComponent.vue:97:// l'ouverture pour y renvoyer le focus à la fermeture (a11y clavier, story 9.2).
app/components/terminal/TerminalComponent.vue:287:  // Retour du focus au déclencheur (a11y : ne pas perdre le focus sur <body>
app/components/terminal/TerminalComponent.vue:333:  z-index: 1000;
app/components/terminal/TerminalComponent.vue:364:    // Rouge sombre (hsl(0 100% 27%)) + ombre : sans token dédié, valeurs portées du DS.
app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
app/components/terminal/TerminalComponent.vue:377:      // Focus clavier visible (close désormais focusable — a11y CAP-11).
app/components/terminal/TerminalComponent.vue:415:    height: calc(100% - 30px);
app/components/terminal/TerminalComponent.vue:465:      // contrainte « caret = seule boucle » (CAP-11) respectée par construction. `caret-shape:
app/components/terminal/TerminalComponent.vue:519:  --color-light: hsl(0deg 0% 92% / 100%);
app/components/terminal/TerminalComponent.vue:520:  --color-dark: hsl(0deg 0% 8% / 100%);
app/components/terminal/TerminalComponent.vue:537:  &.w-100 {
app/components/terminal/TerminalComponent.vue:538:    width: calc(100% - 2 * var(--margin));
app/components/terminal/TerminalComponent.vue:555:  &.w-100 {
app/components/terminal/TerminalComponent.vue:556:    width: calc(100% - 2 * var(--margin));
app/components/WindowWrapperComponent.vue:209:        responsiveWidth.value = window.innerWidth < parseInt(props.width) ? "100%" : props.width;
app/components/WindowWrapperComponent.vue:245:  width: 100%;
app/components/WindowWrapperComponent.vue:246:  height: 100%;
app/components/WindowWrapperComponent.vue:270:  --wwc-color-dark: hsl(0deg 0% 8% / 100%);
app/components/WindowWrapperComponent.vue:274:  --wwc-color-aubergine: hsl(319deg 33% 30% / 100%);
app/components/WindowWrapperComponent.vue:275:  --wwc-color-aubergine-light: hsl(319deg 26% 70% / 100%);
app/components/WindowWrapperComponent.vue:276:  --wwc-color-aubergine-dark: hsl(319deg 100% 9% / 100%);
app/components/WindowWrapperComponent.vue:277:  --wwc-color-red: hsl(0deg 100% 43% / 100%);
app/components/WindowWrapperComponent.vue:278:  --wwc-color-red-light: hsl(0deg 72% 72% / 100%);
app/components/WindowWrapperComponent.vue:279:  --wwc-color-red-dark: hsl(0deg 100% 27% / 100%);
app/components/WindowWrapperComponent.vue:288:  width: 100%;
app/components/WindowWrapperComponent.vue:294:  z-index: 100;
app/components/WindowWrapperComponent.vue:311:    width: 100%;
app/components/WindowWrapperComponent.vue:343:    height: calc(100% - var(--wh-height));
app/components/WindowWrapperComponent.vue:362:  100% {
app/components/card/ZCardHeader.vue:40:  width: 100%;
app/components/card/ZCardHeader.vue:44:    width: 100%;
app/components/card/ZCardHeader.vue:47:      width: 100%;
app/components/ui/ZCustomCursor.vue:19:// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
app/components/home/HomeStackMarquee.vue:23:// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
app/components/home/HomeStackMarquee.vue:56:  width: 100%;
app/components/ui/ZButton.vue:7:    :class="[`zbtn--${variant}`, `zbtn--${size}`, { 'zbtn--magnetic': magnetic }]"
app/components/ui/ZButton.vue:46:  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
app/components/ui/ZButton.vue:61:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZButton.vue:62:  variant: "primary",
app/components/ui/ZButton.vue:247:    width: 100%;
app/components/ui/ZButton.vue:248:    height: 100%;
app/components/home/HomeHeroTerminal.vue:24:        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
app/components/home/HomeHeroTerminal.vue:71:            <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
app/components/home/HomeHeroTerminal.vue:84:// Terminal hero cinétique (Story 11.2 / 12.2 / AC-2 / CAP-2).
app/components/home/HomeHeroTerminal.vue:90:  defineProps<{
app/components/home/HomeHeroTerminal.vue:103:  tone: "ink" | "blue" | "green";
app/components/home/HomeHeroTerminal.vue:106:const projectsOutput = SITE.projects
app/components/home/HomeHeroTerminal.vue:119:    tone: "ink",
app/components/home/HomeHeroTerminal.vue:124:    tone: "blue",
app/components/home/HomeHeroTerminal.vue:129:    tone: "green",
app/components/home/HomeHeroTerminal.vue:357:  width: 100%;
app/components/home/HomeAtmosComponent.vue:48:  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
app/components/home/HomeAtmosComponent.vue:82:  return dot(c, vec3(0.299, 0.587, 0.114));
app/components/home/HomeAtmosComponent.vue:223:  // Couleurs : #F87116 (spot 0: 80% 30%) et #7A1F5D (spot 1: 21% 68%)
app/components/home/HomeAtmosComponent.vue:229:  // Spot 0 : #F87116 -> rgb(248, 113, 22)
app/components/home/HomeAtmosComponent.vue:231:  const colBuf = new Float32Array([248 / 255, 113 / 255, 22 / 255, 122 / 255, 31 / 255, 93 / 255]);
app/components/home/HomeAtmosComponent.vue:391:  width: 100%;
app/components/home/HomeAtmosComponent.vue:392:  height: 100%;
app/components/ui/ZIcon.vue:33:  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
app/components/ui/ZIcon.vue:44:    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
app/components/ui/ZIcon.vue:54:  '<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>';
app/components/ui/ZIcon.vue:85:const props = withDefaults(defineProps<Props>(), {
app/components/home/HomeBootOverlay.vue:25:        aria-valuemax="100"
app/components/home/HomeBootOverlay.vue:39:// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
app/components/home/HomeBootOverlay.vue:68:  progressPercent.value = 100;
app/components/home/HomeBootOverlay.vue:103:      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
app/components/home/HomeBootOverlay.vue:236:    height: 100%;
app/components/ui/ZTag.vue:35:withDefaults(defineProps<Props>(), {
app/components/ui/ZBadge.vue:2:  <span class="zbadge" :class="`zbadge--${tone}`">
app/components/ui/ZBadge.vue:14:  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
app/components/ui/ZBadge.vue:19:withDefaults(defineProps<Props>(), {
app/components/ui/ZBadge.vue:20:  tone: "neutral",
app/components/ui/ZCard.vue:9:      'zcard--interactive': interactive,
app/components/ui/ZCard.vue:12:      'zcard--tilt': tilt,
app/components/ui/ZCard.vue:22:// Primitive carte du DS — surface discrète, 3D tilt interactif optionnel.
app/components/ui/ZCard.vue:32:  /** Rendre la carte interactive (hover state, clickable). @default false */
app/components/ui/ZCard.vue:33:  interactive?: boolean;
app/components/ui/ZCard.vue:42:  /** Activer l'effet 3D tilt sur mousemove. @default false */
app/components/ui/ZCard.vue:43:  tilt?: boolean;
app/components/ui/ZCard.vue:46:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:47:  interactive: false,
app/components/ui/ZCard.vue:52:  tilt: false,
app/components/ui/ZCard.vue:78:  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
app/components/ui/ZCard.vue:107:  () => props.tilt,
app/components/ui/ZCard.vue:146:.zcard--tilt {
app/components/ui/ZCard.vue:155:.zcard--interactive {
app/components/ui/ZCard.vue:190:  .zcard--interactive:hover {
app/components/ui/ZInput.vue:71:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZInput.vue:151:  width: 100%;
app/components/ui/ZInput.vue:186:  min-height: 110px;
app/components/ui/ZInput.vue:228:    width: 100%;
app/components/ui/ZInput.vue:229:    height: 100%;
app/components/ui/ZExternalLink.vue:29:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZAvatar.vue:31:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZAvatar.vue:81:  width: 100%;
app/components/ui/ZAvatar.vue:82:  height: 100%;

exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZBadge.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <span class="zbadge" :class="`zbadge--${tone}`">
    <span v-if="dot" class="zbadge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup lang="ts">
// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
// Porté de docs/design_system/components/core/Badge.jsx (CSS en <style scoped>, prerender-safe).

interface Props {
  /** Teinte. @default "neutral" */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  /** Point de statut en tête. @default false */
  dot?: boolean;
}

withDefaults(defineProps<Props>(), {
  tone: "neutral",
  dot: false,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Badge.jsx */
.zbadge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: 22px;
  padding: 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  line-height: 1;
  letter-spacing: var(--ls-wide);
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
}

.zbadge__dot {
  width: 6px;
  height: 6px;
  background: currentcolor;
  border-radius: var(--radius-circle);
}

// Tones — fills doux. Les couleurs de bordure sont des teintes DS dédiées (sans token
// équivalent) : valeurs portées telles quelles de Badge.jsx (tolérées par la story).
.zbadge--neutral {
  background: var(--surface-3);
  color: var(--text-body);
  border-color: var(--border-default);
}

.zbadge--accent {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: hsl(24deg 94% 53% / 30%);
}

.zbadge--success {
  background: var(--success-soft);
  color: var(--success);
  border-color: hsl(143deg 50% 32% / 50%);
}

.zbadge--warning {
  background: var(--warning-soft);
  color: var(--warning);
  border-color: hsl(38deg 70% 32% / 50%);
}

.zbadge--danger {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: hsl(0deg 55% 35% / 50%);
}

.zbadge--info {
  background: var(--info-soft);
  color: var(--info);
  border-color: hsl(204deg 55% 32% / 50%);
}
</style>

exec
/bin/zsh -lc "sed -n '1,260p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
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

codex
J’ai assez de contexte. Les constats qui restent sont surtout des écarts de contrat sémantique, pas des erreurs de syntaxe évidentes : le code affiche bien trois cartes, mais certains libellés/props et niveaux de détail ne collent pas strictement au contrat.
exec
/bin/zsh -lc "sed -n '120,145p' app/pages/index.vue && sed -n '70,98p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    <!-- Projets sélectionnés & Statistiques de réassurance (Story 12.4 / AC-1, AC-2, AC-3) -->
    <section class="section">
      <div class="container">
        <div class="block__head">
          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
          <h2 class="section__title">Des produits qui tournent en production</h2>
        </div>

        <ul class="projects-grid">
          <li v-for="(project, index) in projects" :key="project.name" class="projects-grid__item">
            <ZCard class="project-card" interactive tilt :padded="false">
              <div v-if="project.image" class="project-card__media">
                <NuxtImg
                  :src="project.image"
                  :alt="project.imageAlt || `Capture d'écran du projet ${project.name}`"
                  width="720"
                  height="405"
                  sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 380px"
                  format="webp"
                  loading="lazy"
                  class="project-card__img"
                />
              </div>
              <div v-else class="project-card__media project-card__media--schematic">
                <div class="project-card__blueprint" aria-hidden="true">
                  <div class="project-card__blueprint-grid">
const projects: IProject[] = [
  {
    name: "Keova Signal",
    role: "Concepteur & Développeur Full Stack",
    hook: "Détecter le bon prospect au bon moment",
    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique, double étage de scoring Zod et serveur MCP natif (10 outils).",
    image: "/images/projects/keova-signal-dashboard.png",
    imageAlt: "Tableau de bord de qualification de prospects Keova Signal",
    badge: "Projet interne / Dépôt privé",
    status: "● Système interne / En développement actif",
    tags: ["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"],
  },
  {
    name: "Debrief",
    role: "Concepteur & Développeur Full Stack",
    hook: "Transformer un rendez-vous commercial en apprentissage exploitable",
    desc: "Application desktop privacy-first (100 % on-device) de synthèse commerciale et analyse d'appels, sans fuite réseau ni dépendance cloud externe.",
    image: "/images/projects/debrief-dashboard.png",
    imageAlt: "Interface desktop de synthèse d'appels Debrief",
    badge: "Dépôt privé",
    status: "◐ R&D / En développement",
    tags: ["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"],
  },
  {
    name: "Devis-Assist",
    role: "Architecte & Développeur Full Stack",
    hook: "Transformer un historique de devis BTP en aide au chiffrage",
    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ/Redis et matching flou PostgreSQL pg_trgm.",
    badge: "Dépôt privé",

codex
- **Missing `statusVariant` metadata support** — Violates Story 12.4 Task 1 specified behavior. Evidence: `IProject` diff adds `hook`, `image`, `imageAlt`, `badge`, but not `statusVariant?: string`, while the story requires it.

- **Badge API does not match required `<ZBadge variant="subtle">`** — Violates AC1 confidentiality badge constraint. Evidence: diff renders `<ZBadge v-if="project.badge" tone="neutral">{{ project.badge }}</ZBadge>` instead of the specified `variant="subtle"`.

- **Keova Signal description omits context-required proof points** — Deviates from Epic 12 / Story 12.4 and `projects-showcase.md` intent. Evidence: diff description mentions `Open Data Insee`, `scraping éthique`, `double étage de scoring Zod`, `serveur MCP natif`, but omits `Open Data Sirene`, `Token Bucket`, and the stricter ethical/CNIL filtering details required by context specs.

- **Debrief description is under-specified against context specs** — Deviates from Epic 12 / Story 12.4 and `projects-showcase.md` intent. Evidence: diff description only says `100 % on-device`, `sans fuite réseau ni dépendance cloud externe`, but omits required proof points such as `whisper.cpp large-v3`, `sherpa-onnx`, `GLiNER/CamemBERT`, and `llama-server Gemma 4 IT`.

- **Devis-Assist description omits Data Flywheel and canonical BTP services** — Violates Epic 12 / Story 12.4 context constraint. Evidence: diff description includes `Mistral OCR 3`, `BullMQ/Redis`, `PostgreSQL pg_trgm`, but omits `catalogue de services canoniques BTP` and `Data Flywheel`.

- **Reduced-motion neutralization is incomplete for title hover transition** — Violates AC3 `prefers-reduced-motion: reduce` constraint. Evidence: diff adds `.project-card__title { transition: color var(--dur-fast) ... }`; reduced-motion only sets `.project-card:hover .project-card__title { transition: none; }`, leaving the base transition active when hover ends.
tokens used
28 360
- **Missing `statusVariant` metadata support** — Violates Story 12.4 Task 1 specified behavior. Evidence: `IProject` diff adds `hook`, `image`, `imageAlt`, `badge`, but not `statusVariant?: string`, while the story requires it.

- **Badge API does not match required `<ZBadge variant="subtle">`** — Violates AC1 confidentiality badge constraint. Evidence: diff renders `<ZBadge v-if="project.badge" tone="neutral">{{ project.badge }}</ZBadge>` instead of the specified `variant="subtle"`.

- **Keova Signal description omits context-required proof points** — Deviates from Epic 12 / Story 12.4 and `projects-showcase.md` intent. Evidence: diff description mentions `Open Data Insee`, `scraping éthique`, `double étage de scoring Zod`, `serveur MCP natif`, but omits `Open Data Sirene`, `Token Bucket`, and the stricter ethical/CNIL filtering details required by context specs.

- **Debrief description is under-specified against context specs** — Deviates from Epic 12 / Story 12.4 and `projects-showcase.md` intent. Evidence: diff description only says `100 % on-device`, `sans fuite réseau ni dépendance cloud externe`, but omits required proof points such as `whisper.cpp large-v3`, `sherpa-onnx`, `GLiNER/CamemBERT`, and `llama-server Gemma 4 IT`.

- **Devis-Assist description omits Data Flywheel and canonical BTP services** — Violates Epic 12 / Story 12.4 context constraint. Evidence: diff description includes `Mistral OCR 3`, `BullMQ/Redis`, `PostgreSQL pg_trgm`, but omits `catalogue de services canoniques BTP` and `Data Flywheel`.

- **Reduced-motion neutralization is incomplete for title hover transition** — Violates AC3 `prefers-reduced-motion: reduce` constraint. Evidence: diff adds `.project-card__title { transition: color var(--dur-fast) ... }`; reduced-motion only sets `.project-card:hover .project-card__title { transition: none; }`, leaving the base transition active when hover ends.

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
session id: 01a0abf7-fdad-74d3-965a-e44d20334b7f
--------
user
# Acceptance Auditor Prompt — Story 12.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/messaging-matrix.md`, `docs/specs/spec-repositionnement-ia/services-and-pricing.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.3), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais utiliser la compétence `bmad-code-review` pour cadrer l’audit comme une revue d’acceptance, puis je lis la story, les specs de contexte et le diff complet avant de sortir uniquement les écarts constatés.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-code-review
description: 'Adversarial code review using parallel review layers and structured triage. Use when the user says "run code review" or "review this code"'
---

# Code Review Workflow

**Goal:** Review code changes adversarially. No noise, no filler.

Subagents, when the capability is available, are an important part of this workflow. Use them as directed by the workflow steps.
If you need an explicit user instruction to run them, ask once now for the whole workflow run.

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
La compétence impose des checkpoints bloquants, ce qui contredit votre consigne explicite “one shot”. Je garde donc l’esprit revue adversariale, sans appliquer son workflow interactif, et je poursuis directement l’audit des artefacts.
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
---

# Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur évaluant l'offre de services sur la page d'accueil,
I want découvrir les 3 piliers d'accompagnement et les arguments prouvant la viabilité des systèmes déployés,
so that je distingue le travail industriel d'une simple démonstration de chatbot fragile (FR30, NFR13, UX-DR29).

## Acceptance Criteria

1. **Given** la section vitrine des services dans `app/pages/index.vue`
   **When** la page est rendue et inspectée
   **Then** le sur-titre affiche `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
   **And** le titre de section affiche `Trois expertises pour concevoir et faire évoluer vos systèmes`
   **And** la liste sémantique `<ul class="grid-3">` expose 3 cartes structurées `<ZCard class="offer" interactive tilt ...>` avec numérotation terminale `01 / 03`, `02 / 03`, `03 / 03` :
     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
     3. **Applications IA sur mesure** (`id: "apps"`, icône `code`, tags `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`, prix/format `Sur mesure / Sprint`)
   **And** chaque carte oriente directement vers la route Nuxt `/services` (via `<NuxtLink to="/services" ...>` et lien d'action accessible).

2. **Given** le nouveau bloc différenciateur « Prototype → Production » dans `app/pages/index.vue`
   **When** le visiteur fait défiler la page immédiatement sous la vitrine des services
   **Then** une section ou un conteneur dédié `.diff-block` (ou `.section--sunken`) expose :
     - Le sur-titre `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
     - Le titre de section `<h2>` ou `<h3>` affichant `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
     - Le texte explicatif officiel (messaging matrix 4.3) valorisant la culture Full Stack et QA : `Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification, permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine. L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile lorsqu’il rencontre la vraie vie.`
     - Les 4 piliers d'industrialisation balisés sous forme de liste sémantique `<ul class="pillars-grid">` avec cartes `<ZCard :padded="true">` :
       - **Données :** provenance, structuration, stockage, rétention, secrets. (icône `layers` ou `terminal`)
       - **Fiabilité :** cas limites, retries, fallbacks, tests, observabilité. (icône `check` ou `zap`)
       - **IA :** sorties structurées, versionnage, évaluations, contrôle humain. (icône `bot` ou `spark`)
       - **Exploitation :** monitoring, coûts, support, maintenance, évolution. (icône `terminal` ou `code`)

3. **Given** les critères d'accessibilité (a11y RGAA/WCAG), de responsive et de design tokens
   **When** la page est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
   **Then** les grilles `.grid-3` et `.pillars-grid` basculent harmonieusement de 3/4 colonnes à 1 colonne sans débordement horizontal
   **And** sous `prefers-reduced-motion: reduce`, les effets de tilt 3D sur `ZCard` et transitions dynamiques sont instantanément neutralisés
   **And** le focus clavier (`Tab`) parcourt les cartes et liens `/services` selon un ordre séquentiel et visible (`:focus-visible` avec outline 2px)
   **And** aucun emoji n'est injecté dans les templates, textes ou styles (NFR6 / NFR13)
   **And** tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).

4. **Given** l'ensemble des modifications de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et les routes statiques pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour des données et cartes de la vitrine des 3 services dans `app/pages/index.vue` (AC: 1, 3)
  - [x] Mettre à jour l'interface `HomeServiceOffer` et la constante `services` dans le `<script setup>` :
    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
    - Offre 3 : `id: "apps"`, `no: "03 / 03"`, `title: "Applications IA sur mesure"`, promesse/points, tags `["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"]`, format tarifaire `Sur mesure / Sprint`
  - [x] Mettre à jour le titre de la section : `Trois expertises pour concevoir et faire évoluer vos systèmes`
  - [x] Vérifier que tous les liens d'action pointent vers `/services` sans ancre `#`.

- [x] Tâche 2 — Intégration du bloc différenciateur « Prototype → Production » (AC: 2, 3)
  - [x] Créer la structure HTML sémantique immédiatement sous la vitrine des services dans `app/pages/index.vue` :
    - Sur-titre : `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
    - Titre H2 : `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
    - Texte d'accroche valorisant le background Full Stack & QA
    - Grille `ul.pillars-grid` de 4 cartes `ZCard` (Données, Fiabilité, IA, Exploitation) avec icônes `ZIcon` dédiées et puces descriptives
  - [x] Ajouter les styles SCSS scopés pour `.diff-block` / `.pillars-grid` en utilisant les tokens du Design System (`--space-*`, `--radius-*`, `--font-*`, `--surface-*`, `--border-*`).

- [x] Tâche 3 — Vérification responsive, a11y et respect des invariants (AC: 3)
  - [x] Vérifier le comportement responsive sous breakpoints mobile (900px, 680px).
  - [x] Valider l'absence totale d'emoji dans le DOM et les contenus textuels.
  - [x] Valider la navigation clavier et le respect de `prefers-reduced-motion: reduce`.

- [x] Tâche 4 — Validation qualité Docker (AC: 4)
  - [x] Lancer la commande de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc, et génération statique Nitro réussie.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`.
- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
- **Icônes :** Utiliser les glyphes SVG intégrés de `<ZIcon name="..." />` (`code`, `layers`, `bot`, `spark`, `check`, `terminal`, `zap`). Ne pas importer de bibliothèque d'icônes externe.
- **Zéro Emoji :** Règle stricte NFR6 / NFR13.

### Fichiers concernés
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)

### Ce qui doit être préservé
- La section Hero commercial et son terminal interactif (`HomeHeroTerminal`).
- Le bandeau défilant `HomeStackMarquee`.
- La section des projets sélectionnés et le journal technique situés en aval.
- L'intégrité du routing multi-pages Nuxt 4.

### Références
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
- Charte éditoriale & bloc différenciateur : [docs/specs/spec-repositionnement-ia/messaging-matrix.md#Section-4.3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Offres et tarifs : [docs/specs/spec-repositionnement-ia/services-and-pricing.md#Section-1](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/services-and-pricing.md)
- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate de validation Docker complète réussie : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
- 0 erreur ESLint / Stylelint.
- 0 erreur TypeScript (vue-tsc).
- 20 routes pré-rendues statiquement via Nitro SSG avec succès.

### Completion Notes List
- Vitrine des 3 services mise à jour dans `app/pages/index.vue` avec les nouvelles offres : Automatisation de processus métier, Agents IA intégrés à vos outils (mis en avant), Applications IA sur mesure.
- Intégration du bloc différenciateur « Prototype → Production » (`section.diff-block.section--sunken`) avec son accroche Full Stack / QA et sa grille sémantique de 4 piliers (Données, Fiabilité, IA, Exploitation).
- Styles SCSS scopés conformes au Design System, responsive (1/2/4 colonnes), support motion réduit et navigation clavier testés et validés.

### File List
- app/pages/index.vue
- docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
- docs/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-09-16 : Implémentation complète de la Story 12.3 (vitrine des 3 services ciblés et bloc différenciateur Prototype vers Production). Passé en revue.

exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/SPEC.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/services-and-pricing.md" in /Users/simon/dev/jouan.ovh
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

codex
J’ai les critères précis de la story et les textes canoniques. Je lis maintenant Epic 12, le contexte projet et le diff, puis je croise ligne par ligne ce qui a été ajouté contre les contraintes plutôt que de me fier aux notes de complétion.
exec
/bin/zsh -lc "sed -n '1,260p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-09-14"
sections_completed: ["technology_stack", "language_framework", "code_quality", "workflow_testing", "critical_rules"]
status: "complete"
optimized_for_llm: true
existing_patterns_found: 12
---

# Project Context for AI Agents

_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Il se concentre sur les détails non évidents que les agents pourraient manquer._

---

## Technology Stack & Versions

> ✅ **Migration de stack terminée (Epic 1).** Les versions ci-dessous sont l'état
> ACTUEL, post-migration. `@nuxt/bridge-edge` a été abandonné ; le code applicatif
> vit désormais sous `app/` (structure Nuxt 4 par défaut, `srcDir = "app"`).

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
- **Langage :** TypeScript `^6.0.3`.
- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
- **Déploiement :** site statique (`nuxi generate`) → publication vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME` = `jouan.ovh`). ✅ La chaîne CI de déploiement est **prouvée en réel** sur `main` (Story 10.7), avec 13 routes pré-rendues, HTTPS Let's Encrypt forcé et DNS OVH opérationnel.
- **Divers :** `ua-parser-js ^2` (détection device, terminal).

## Critical Implementation Rules

### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)

**TypeScript / Vue**

- Préférer `<script setup lang="ts">` pour tout NOUVEAU composant. Le sous-système
  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
  décision rétro Epic 7). **Reste un seul résidu Options API** (`defineComponent`,
  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
  pas l'étendre ; le migrer vers `<script setup>` lors d'une refonte du header
  (cleanup optionnel, non planifié).
- `vue-property-decorator` et l'option `experimentalDecorators` ont été retirés
  (Epic 3) : plus aucun décorateur de classe, ne pas en réintroduire.
- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).

**Nuxt**

- Cible de build = site **STATIQUE** (`nuxi generate`) → tout code doit être
  compatible prerender : pas d'accès `window`/`document` hors `onMounted` ou
  garde `import.meta.client`.
- Pages dans `app/pages/`, layout `app/layouts/default.vue`, auto-import des
  composants activé (pas d'import manuel pour la plupart).
- **Primitives DS sous `app/components/ui/` auto-importées SANS préfixe de dossier**
  (`<ZButton>`, pas `<UiZButton>`) via `components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"]`.
  Le reste de `components/` garde le scan par défaut.
- ⚠️ **Piège `<component :is>` :** un nom de composant passé en _string_
  (`<component :is="'NuxtLink'">`) **ne résout pas** l'auto-import. Importer la
  référence depuis `#components` (`import { NuxtLink } from "#components"`) et la
  passer comme valeur. (Régression rencontrée en story 2.8.)
- Images TOUJOURS via `<NuxtImg>` / `<NuxtPicture>` (@nuxt/image), jamais
  `<img>` brut. Assets statiques dans `public/images/`.
- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
  `app/pages/blog/index.vue`, article `app/pages/blog/[...slug].vue`. Collections **typées
  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
  `tags`, `read`, `image`). Requêtes via `queryCollection("blog")…` dans `useAsyncData`
  (prerender-safe) ; rendu article via `<ContentRenderer>`. **Coloration Shiki désactivée**
  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
  ne pas réactiver sans surcharge (sinon styles inline par token écrasant le DS).
- **Formulaire `/contact` (Epic 7)** : envoi via **Web3Forms** (tiers _sans serveur_, site
  reste statique), clé via `runtimeConfig.public.web3formsAccessKey` (env
  `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, cf. `.env.example`). ⚠️ **Sans la clé, l'envoi échoue** —
  la provisionner en env. `$fetch` **client-only** (prerender-safe) + honeypot anti-spam ;
  validation/feedback front. Notice RGPD sous le form + page politique de confidentialité dédiée
  (`/confidentialite`, livrée en story 10.6).

**SCSS (règle critique)**

- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
  sont exposés sur `:root` par `app/assets/scss/abstract/_root.scss` — source unique
  de vérité (couleurs, typo, espacement, rayons, élévation, motion).
- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
  palette syntaxe), commenter explicitement la dérogation.
- **Primitives de layout GLOBALES** : `.section` / `.section--sunken` / `.container` /
  `.eyebrow` (+ `.eyebrow--muted`) / `.prose` / `.hero__tags` vivent dans
  `app/assets/scss/base/_layout.scss` (chargé par `main.scss`). **Les consommer, ne PAS
  les redéclarer en `<style scoped>` par page** (sinon duplication divergente). Si un
  modifieur DS manque, l'ajouter au partiel global, pas en local. (Convention extraite
  en story 5.1 après duplication scoped dans index/services/about.)
- Legacy : certains composants déclarent encore des CSS props locales à partir des
  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
- Styles dans `<style lang="scss" scoped>` par composant. Exceptions Stylelint
  (`:deep`/`:slotted`/`:global`) en `/* stylelint-disable */` **inline et commenté**,
  pas en config globale.

### Qualité de code & conventions

**Lint / format**

- ESLint + Prettier : double quotes, points-virgules, `max-len: 120`.
  `prefer-const` en erreur. Stylelint + `stylelint-scss` pour le SCSS.
- `no-console` / `no-debugger` : warning en production uniquement.

**Conventions de nommage**

- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`, `ZCustomCursor`) — `<script setup>`,
  auto-importées sans préfixe de dossier.
- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>` (supportant le 3D tilt via prop `tilt`).
- Composants d'accueil immersifs sous `app/components/home/` : `HomeAtmosComponent.vue`
  (shader WebGL Flow Chrome accéléré avec repli CSS pur automatique, écouteurs `webglcontextlost` et `visibilitychange`),
  `HomeBootOverlay.vue` (boot interactif jouan.os), `HomeHeroTerminal.vue` (terminal Hero à frappe dynamique)
  et `HomeStackMarquee.vue` (défilement infini CSS pur).
- Composants applicatifs legacy : PascalCase suffixé `Component`
  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
- Sous-système terminal sous `components/terminal/` : coquilles Vue
  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
  contrats (`I*` + barrel `index.ts`).
- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
  (ex. `@use "...color" as _color`).

**Organisation**

- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
  `public/images/` ou `assets/` lors de l'implémentation.
- **Contenu partagé, URLs & SEO :**
  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_

**Langue**

- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
  vouvoiement. Pas d'emoji (cf. guidelines du design system).

### Workflow de développement

**Git**

- Branche principale : `main`. Intégration : `develop`. Travail par branches de
  feature (ex. refonte en cours : `feat/design-system-revamp`).
- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).

**Environnement de dev : Docker (obligatoire)**

- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
- Commande ponctuelle (lint, typecheck, generate…) :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Stopper : `docker compose down`.

**Build & déploiement**

- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@11.8.0`, lockfile
  `pnpm-lock.yaml`). **Ne JAMAIS utiliser `npm`/`yarn`.**
- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
  « Environnement de dev »), jamais directement sur l'hôte :
  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
- Build statique : `pnpm generate` → sortie `.output/public`.
- Déploiement : automatisé par GitHub Actions (`.github/workflows/cd.yml` via `peaceiris/actions-gh-pages` sur push `main`). Sortie statique avec `CNAME` vérifié.
- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).

### Tests

- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
- Si des tests sont introduits pendant la migration, documenter la convention ici.

### Règles critiques à ne pas manquer

**Port du design system (React/CSS → Vue/SCSS)**

- Le design system source (`docs/design_system/`) est en **React + CSS custom
  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.

**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**

- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
  les traiter en amont (checklist pré-revue dans la consigne de story).
- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).

**À préserver pendant la refonte**

- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
  easter-egg à conserver — le design system la garde comme feature secondaire.
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
  orange Ubuntu comme unique accent héros.
- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
  terminal.

**Pièges**

- Compatibilité prerender (site statique) : tout accès DOM doit être gardé ;
  IDs déterministes via `useId()` (pas d'aléatoire qui casse l'hydration).
- Ne pas casser `CNAME` / le déploiement gh-pages.
- `<component :is="...">` : passer une référence importée, jamais un nom en string
  (cf. règles Nuxt).
- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
  layout cohabitent sur le même élément (typiquement `.container` + wrapper de
  section, ex. `.hero__in.container`), **ne pas** styler le `padding` en shorthand
  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
  effaçait le vertical de `.hero__in`). Utiliser les **longhands** `padding-inline` /
  `padding-block`, qui composent sans conflit quel que soit l'ordre. (Régression de
  padding du hero, story 3.1 — invisible à la revue de code, attrapée à l'œil.)
- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
  dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **invalide la
  base de contenu** du dev (volume partagé) → `/blog` tombe en erreur. Correctif :
  `docker compose restart web` réindexe le contenu. Sans impact sur le build lui-même.
- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
  est aveugle aux régressions de rendu. Réfs par page :
  - **Home** → `docs/design_system/ui_kits/jouan-site/Home - Awwwards.html` (maquette cible Awwwards officielle depuis l'Epic 11).
  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`

exec
/bin/zsh -lc "rg -n \"Story 12\\.3|Epic 12|12\\.3|CAP-3|Prototype|Trois expertises|au-delà\" docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
38:FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
57:FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
66:#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
69:FR30: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production » (Automatisation, Agents IA, Applications sur mesure, suivi de « Un agent qui fonctionne trois fois n'est pas encore un système fiable » articulé sur 4 piliers). _(CAP-3)_
135:UX-DR29: Grille modulaire pour le bloc différenciateur « Prototype → Production » (4 piliers Données, Fiabilité, IA, Exploitation).
168:FR28: Epic 12 — Source de vérité site.ts, assainissement sémantique & profil
169:FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
170:FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
171:FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
172:FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
173:FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
174:FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
175:FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
176:FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
224:### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
849:## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
896:### Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »
912:  - Eyebrow `<span class="eyebrow">// au-delà de la démo</span>`

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/index.vue b/app/pages/index.vue
index c513732..755db7b 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -11,16 +11,21 @@
         <div class="hero__grid">
           <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
           <div class="anim hero__text">
-            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
-            <h1 class="hero__title">Développeur Full Stack <em>TypeScript</em></h1>
+            <h2 class="eyebrow">
+              <span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA &amp; AUTOMATISATION
+            </h2>
+            <h1 class="hero__title">Automatisez les workflows qui freinent votre équipe.</h1>
             <p class="hero__sub">
-              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
-              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
+              Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants —
+              de l’identification du problème jusqu’à la mise en production.
+            </p>
+            <p class="hero__credibility">
+              Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA
             </p>
 
             <div class="hero__badge-wrap">
               <span class="hero__pulse-dot" aria-hidden="true" />
-              <span>Disponible pour missions freelance</span>
+              <span>Disponible pour nouvelles missions freelance</span>
               <template v-if="SITE.profile.maltUrl">
                 <span aria-hidden="true"> · </span>
                 <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
@@ -29,10 +34,10 @@
 
             <div class="hero__cta">
               <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
-                Discuter de votre projet
+                Identifier un workflow à automatiser
                 <template #iconRight><ZIcon name="arrow" /></template>
               </ZButton>
-              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
+              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir mes systèmes IA </ZButton>
             </div>
           </div>
 
@@ -47,11 +52,11 @@
       </div>
     </section>
 
-    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
+    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1) -->
     <section class="section">
       <div class="container">
         <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
-        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
+        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
         <ul class="grid-3">
           <li v-for="service in services" :key="service.id">
             <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
@@ -84,6 +89,34 @@
       </div>
     </section>
 
+    <!-- Bloc différenciateur « Prototype → Production » (Story 12.3 / AC-2) -->
+    <section class="section section--sunken diff-block">
+      <div class="container">
+        <p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>
+        <h2 class="section__title diff-block__title">
+          Un agent qui fonctionne trois fois n’est pas encore un système fiable.
+        </h2>
+        <p class="prose diff-block__lead">
+          Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification,
+          permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine.
+          L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile
+          lorsqu’il rencontre la vraie vie.
+        </p>
+
+        <ul class="pillars-grid">
+          <li v-for="pillar in pillars" :key="pillar.id">
+            <ZCard class="pillar" padded interactive tilt>
+              <div class="pillar__icon">
+                <ZIcon :name="pillar.icon" />
+              </div>
+              <h3 class="pillar__title">{{ pillar.title }}</h3>
+              <p class="pillar__desc">{{ pillar.desc }}</p>
+            </ZCard>
+          </li>
+        </ul>
+      </div>
+    </section>
+
     <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
     <section class="section">
       <div class="container">
@@ -289,7 +322,7 @@ function onProjectMouseLeave(event: MouseEvent) {
 interface HomeServiceOffer {
   id: string;
   no: string;
-  icon: "code" | "layers" | "spark";
+  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
   title: string;
   desc: string;
   points: string[];
@@ -298,55 +331,90 @@ interface HomeServiceOffer {
   featured: boolean;
 }
 
-// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
+interface ProductionPillar {
+  id: string;
+  icon: "code" | "layers" | "spark" | "bot" | "terminal" | "zap";
+  title: string;
+  desc: string;
+}
+
+// Vitrine des 3 offres ciblées Systèmes IA & Automatisation (Story 12.3 / AC-1).
 const services: HomeServiceOffer[] = [
   {
-    id: "creation",
+    id: "automation",
     no: "01 / 03",
-    icon: "code",
-    title: "Création d'applications web & SaaS",
-    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
+    icon: "layers",
+    title: "Automatisation de processus métier",
+    desc: "Cartographie d'un workflow existant, identification des tâches répétitives et construction du système qui automatise ce qui mérite réellement de l'être.",
     points: [
-      "Architecture logicielle & APIs REST",
-      "Applications Vue 3 / Nuxt 4 & NestJS",
-      "Intégration Stripe & PostgreSQL",
+      "Cartographie de flux & connecteurs d'APIs",
+      "Ingestion, enrichissement et traitement de données",
+      "Synchronisation d'outils métier & reporting",
     ],
-    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
-    price: "Sur devis / au sprint",
+    tags: ["Workflow", "APIs", "Automation", "PostgreSQL"],
+    price: "À partir de 3 500 € HT",
     featured: false,
   },
   {
-    id: "fullstack",
+    id: "agents",
     no: "02 / 03",
-    icon: "layers",
-    title: "Développement Full Stack TypeScript",
-    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
+    icon: "bot",
+    title: "Agents IA intégrés à vos outils",
+    desc: "Intégration d'agents outillés dans vos flux existants pour lire, interpréter, synthétiser et décider sans casser vos habitudes de travail.",
     points: [
-      "Composants Vue 3 / Nuxt avec TypeScript strict",
-      "Microservices & backend modulaire NestJS",
-      "Fiabilisation et optimisation des performances",
+      "Agents outillés (Tool Calling) & serveurs MCP",
+      "Extraction structurée & analyse documentaire",
+      "Supervision humaine obligatoire (Human-in-the-loop)",
     ],
-    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
-    price: "Sur devis / TJM",
+    tags: ["Agents IA", "LLM", "MCP", "Human-in-the-loop"],
+    price: "À partir de 3 500 € HT",
     featured: true,
   },
   {
-    id: "evolution",
+    id: "apps",
     no: "03 / 03",
-    icon: "spark",
-    title: "Évolution & Architecture applicative",
-    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
+    icon: "code",
+    title: "Applications IA sur mesure",
+    desc: "Développement complet de solutions logicielles dédiées quand le workflow nécessite une interface, un backend robuste et une base de données sur mesure.",
     points: [
-      "Audits techniques de code & migrations de versions",
-      "Tests E2E TestCafé & tests unitaires Vitest",
-      "Pipelines CI/CD & conteneurisation Docker",
+      "Applications web complètes Nuxt & NestJS",
+      "Applications desktop sécurisées Tauri (IA locale)",
+      "Architecture PostgreSQL, tests QA & déploiement",
     ],
-    tags: ["TestCafé", "Vitest", "Docker", "CI/CD"],
-    price: "Au forfait / audit",
+    tags: ["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"],
+    price: "Sur mesure / Sprint",
     featured: false,
   },
 ];
 
+// 4 Piliers d'industrialisation « Prototype → Production » (Story 12.3 / AC-2).
+const pillars: ProductionPillar[] = [
+  {
+    id: "data",
+    icon: "layers",
+    title: "Données",
+    desc: "Provenance, structuration, stockage, rétention, secrets.",
+  },
+  {
+    id: "reliability",
+    icon: "zap",
+    title: "Fiabilité",
+    desc: "Cas limites, retries, fallbacks, tests, observabilité.",
+  },
+  {
+    id: "ai",
+    icon: "bot",
+    title: "IA",
+    desc: "Sorties structurées, versionnage, évaluations, contrôle humain.",
+  },
+  {
+    id: "ops",
+    icon: "terminal",
+    title: "Exploitation",
+    desc: "Monitoring, coûts, support, maintenance, évolution.",
+  },
+];
+
 // Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
 const projects = SITE.projects;
 
@@ -464,7 +532,7 @@ usePageSeo({
 
 .hero__sub {
   max-width: 46ch;
-  margin: var(--space-5) 0 var(--space-6);
+  margin: var(--space-5) 0 var(--space-4);
   font-family: var(--font-sans);
   font-size: var(--fs-lg);
   line-height: var(--lh-relaxed);
@@ -472,6 +540,14 @@ usePageSeo({
   text-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
 }
 
+.hero__credibility {
+  margin: 0 0 var(--space-6);
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-muted);
+}
+
 .hero__cta {
   display: flex;
   flex-wrap: wrap;
@@ -664,6 +740,68 @@ usePageSeo({
   }
 }
 
+// ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
+.diff-block__title {
+  max-width: 28ch;
+  margin-bottom: var(--space-4);
+}
+
+.diff-block__lead {
+  max-width: 72ch;
+  margin: 0 0 var(--space-8);
+  font-size: var(--fs-md);
+  line-height: var(--lh-relaxed);

exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/12-3/full.diff docs/planning-artifacts/epics.md docs/project-context.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     490 docs/implementation-artifacts/code-reviews/12-3/full.diff
     985 docs/planning-artifacts/epics.md
     287 docs/project-context.md
    1762 total

codex
Le diff montre aussi des changements Hero hors du périmètre nominal de 12.3. Je vais vérifier la suite du diff et les lignes Epic précises pour distinguer violation réelle, simple opportunisme, et contrainte explicitement imposée.
exec
/bin/zsh -lc "sed -n '260,560p' docs/implementation-artifacts/code-reviews/12-3/full.diff" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '880,930p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc 'rg -n "outline|focus-visible|grid-3|pillars-grid|diff-block|offer|ZCard" docs/implementation-artifacts/code-reviews/12-3/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  line-height: var(--lh-relaxed);
+  color: var(--text-body);
+}
+
+.pillars-grid {
+  display: grid;
+  grid-template-columns: repeat(4, 1fr);
+  gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
+
+  > li {
+    display: flex;
+  }
+}
+
+.pillar {
+  display: flex;
+  flex-direction: column;
+  width: 100%;
+}
+
+.pillar__icon {
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  width: var(--space-10);
+  height: var(--space-10);
+  margin-bottom: var(--space-4);
+  font-size: var(--fs-xl);
+  color: var(--accent);
+  background: var(--accent-soft);
+  border-radius: var(--radius-md);
+}
+
+.pillar__title {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-lg);
+  font-weight: var(--fw-regular);
+  color: var(--text-strong);
+}
+
+.pillar__desc {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  line-height: var(--lh-normal);
+  color: var(--text-muted);
+}
+
 // ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
 .work {
   display: flex;
@@ -1057,6 +1195,10 @@ li:last-child .work__row {
     grid-template-columns: 1fr;
   }
 
+  .pillars-grid {
+    grid-template-columns: repeat(2, 1fr);
+  }
+
   .block__head--row {
     flex-direction: column;
     align-items: flex-start;
@@ -1074,6 +1216,7 @@ li:last-child .work__row {
     display: none;
   }
 
+  .pillars-grid,
   .stats {
     grid-template-columns: 1fr;
   }
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 15c84cd..64e81a5 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-16 (Story 12.2 initialisée en ready-for-dev)"
+last_updated: "2026-09-16 (Story 12.3 passée en review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -130,8 +130,8 @@ development_status:
   # Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier
   epic-12: in-progress
   12-1-source-unique-de-donnees-sitets-et-coherence-globale: done
-  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: ready-for-dev
-  12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: backlog
+  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: done
+  12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: review
   12-4-homepage-vitrine-des-3-projets-phares: backlog
   12-5-page-services-restructuration-des-offres-et-process-4-etapes: backlog
   12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: backlog
diff --git a/docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md b/docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
new file mode 100644
index 0000000..67f7ae7
--- /dev/null
+++ b/docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
@@ -0,0 +1,127 @@
+---
+baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
+---
+
+# Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a visiteur évaluant l'offre de services sur la page d'accueil,
+I want découvrir les 3 piliers d'accompagnement et les arguments prouvant la viabilité des systèmes déployés,
+so that je distingue le travail industriel d'une simple démonstration de chatbot fragile (FR30, NFR13, UX-DR29).
+
+## Acceptance Criteria
+
+1. **Given** la section vitrine des services dans `app/pages/index.vue`
+   **When** la page est rendue et inspectée
+   **Then** le sur-titre affiche `<p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>`
+   **And** le titre de section affiche `Trois expertises pour concevoir et faire évoluer vos systèmes`
+   **And** la liste sémantique `<ul class="grid-3">` expose 3 cartes structurées `<ZCard class="offer" interactive tilt ...>` avec numérotation terminale `01 / 03`, `02 / 03`, `03 / 03` :
+     1. **Automatisation de processus métier** (`id: "automation"`, icône `layers`, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
+     2. **Agents IA intégrés à vos outils** (`id: "agents"`, `featured: true`, icône `bot` ou `spark`, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`, prix/format `À partir de 3 500 € HT` ou `Format Sprint`)
+     3. **Applications IA sur mesure** (`id: "apps"`, icône `code`, tags `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`, prix/format `Sur mesure / Sprint`)
+   **And** chaque carte oriente directement vers la route Nuxt `/services` (via `<NuxtLink to="/services" ...>` et lien d'action accessible).
+
+2. **Given** le nouveau bloc différenciateur « Prototype → Production » dans `app/pages/index.vue`
+   **When** le visiteur fait défiler la page immédiatement sous la vitrine des services
+   **Then** une section ou un conteneur dédié `.diff-block` (ou `.section--sunken`) expose :
+     - Le sur-titre `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
+     - Le titre de section `<h2>` ou `<h3>` affichant `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
+     - Le texte explicatif officiel (messaging matrix 4.3) valorisant la culture Full Stack et QA : `Mon background Full Stack et QA me permet de traiter ce qui arrive après le prototype : authentification, permissions, données, erreurs, retries, logs, tests, coûts, monitoring, sécurité et supervision humaine. L’objectif n’est pas de mettre de l’IA partout. L’objectif est de construire un workflow qui reste utile lorsqu’il rencontre la vraie vie.`
+     - Les 4 piliers d'industrialisation balisés sous forme de liste sémantique `<ul class="pillars-grid">` avec cartes `<ZCard :padded="true">` :
+       - **Données :** provenance, structuration, stockage, rétention, secrets. (icône `layers` ou `terminal`)
+       - **Fiabilité :** cas limites, retries, fallbacks, tests, observabilité. (icône `check` ou `zap`)
+       - **IA :** sorties structurées, versionnage, évaluations, contrôle humain. (icône `bot` ou `spark`)
+       - **Exploitation :** monitoring, coûts, support, maintenance, évolution. (icône `terminal` ou `code`)
+
+3. **Given** les critères d'accessibilité (a11y RGAA/WCAG), de responsive et de design tokens
+   **When** la page est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
+   **Then** les grilles `.grid-3` et `.pillars-grid` basculent harmonieusement de 3/4 colonnes à 1 colonne sans débordement horizontal
+   **And** sous `prefers-reduced-motion: reduce`, les effets de tilt 3D sur `ZCard` et transitions dynamiques sont instantanément neutralisés
+   **And** le focus clavier (`Tab`) parcourt les cartes et liens `/services` selon un ordre séquentiel et visible (`:focus-visible` avec outline 2px)
+   **And** aucun emoji n'est injecté dans les templates, textes ou styles (NFR6 / NFR13)
+   **And** tous les styles SCSS consomment exclusivement les tokens de thème `:root` (`var(--token)`).
+
+4. **Given** l'ensemble des modifications de la story
+   **When** on exécute la gate de validation Docker
+   **Then** `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et les routes statiques pré-rendues.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Mise à jour des données et cartes de la vitrine des 3 services dans `app/pages/index.vue` (AC: 1, 3)
+  - [x] Mettre à jour l'interface `HomeServiceOffer` et la constante `services` dans le `<script setup>` :
+    - Offre 1 : `id: "automation"`, `no: "01 / 03"`, `title: "Automatisation de processus métier"`, promesse/points, tags `["Workflow", "APIs", "Automation", "PostgreSQL"]`, format tarifaire `À partir de 3 500 € HT`
+    - Offre 2 : `id: "agents"`, `no: "02 / 03"`, `title: "Agents IA intégrés à vos outils"`, promesse/points, tags `["Agents IA", "LLM", "MCP", "Human-in-the-loop"]`, format tarifaire `À partir de 3 500 € HT`, `featured: true`
+    - Offre 3 : `id: "apps"`, `no: "03 / 03"`, `title: "Applications IA sur mesure"`, promesse/points, tags `["TypeScript", "Nuxt", "NestJS", "PostgreSQL", "Tauri"]`, format tarifaire `Sur mesure / Sprint`
+  - [x] Mettre à jour le titre de la section : `Trois expertises pour concevoir et faire évoluer vos systèmes`
+  - [x] Vérifier que tous les liens d'action pointent vers `/services` sans ancre `#`.
+
+- [x] Tâche 2 — Intégration du bloc différenciateur « Prototype → Production » (AC: 2, 3)
+  - [x] Créer la structure HTML sémantique immédiatement sous la vitrine des services dans `app/pages/index.vue` :
+    - Sur-titre : `<p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>`
+    - Titre H2 : `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
+    - Texte d'accroche valorisant le background Full Stack & QA
+    - Grille `ul.pillars-grid` de 4 cartes `ZCard` (Données, Fiabilité, IA, Exploitation) avec icônes `ZIcon` dédiées et puces descriptives
+  - [x] Ajouter les styles SCSS scopés pour `.diff-block` / `.pillars-grid` en utilisant les tokens du Design System (`--space-*`, `--radius-*`, `--font-*`, `--surface-*`, `--border-*`).
+
+- [x] Tâche 3 — Vérification responsive, a11y et respect des invariants (AC: 3)
+  - [x] Vérifier le comportement responsive sous breakpoints mobile (900px, 680px).
+  - [x] Valider l'absence totale d'emoji dans le DOM et les contenus textuels.
+  - [x] Valider la navigation clavier et le respect de `prefers-reduced-motion: reduce`.
+
+- [x] Tâche 4 — Validation qualité Docker (AC: 4)
+  - [x] Lancer la commande de validation complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] S'assurer de 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc, et génération statique Nitro réussie.
+
+## Dev Notes
+
+### Architecture & Contraintes d'environnement
+- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage doit s'exécuter dans Docker : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
+- **Tokens & Design System :** Aucune couleur ou espacement en dur. Utiliser impérativement `var(--token)`.
+- **Primitives de Layout :** Les classes `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` sont des primitives globales (`app/assets/scss/base/_layout.scss`). Ne pas les redéclarer dans le bloc scoped. [Source: AGENTS.md#Section 5.3]
+- **Icônes :** Utiliser les glyphes SVG intégrés de `<ZIcon name="..." />` (`code`, `layers`, `bot`, `spark`, `check`, `terminal`, `zap`). Ne pas importer de bibliothèque d'icônes externe.
+- **Zéro Emoji :** Règle stricte NFR6 / NFR13.
+
+### Fichiers concernés
+- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
+
+### Ce qui doit être préservé
+- La section Hero commercial et son terminal interactif (`HomeHeroTerminal`).
+- Le bandeau défilant `HomeStackMarquee`.
+- La section des projets sélectionnés et le journal technique situés en aval.
+- L'intégrité du routing multi-pages Nuxt 4.
+
+### Références
+- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
+- Charte éditoriale & bloc différenciateur : [docs/specs/spec-repositionnement-ia/messaging-matrix.md#Section-4.3](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
+- Offres et tarifs : [docs/specs/spec-repositionnement-ia/services-and-pricing.md#Section-1](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/services-and-pricing.md)
+- Cahier des charges : [docs/planning-artifacts/epics.md#Story-12.3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
+- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
+
+## Dev Agent Record
+
+### Agent Model Used
+- Gemini 3.7 Flash
+
+### Debug Log References
+- Gate de validation Docker complète réussie : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+- 0 erreur ESLint / Stylelint.
+- 0 erreur TypeScript (vue-tsc).
+- 20 routes pré-rendues statiquement via Nitro SSG avec succès.
+
+### Completion Notes List
+- Vitrine des 3 services mise à jour dans `app/pages/index.vue` avec les nouvelles offres : Automatisation de processus métier, Agents IA intégrés à vos outils (mis en avant), Applications IA sur mesure.
+- Intégration du bloc différenciateur « Prototype → Production » (`section.diff-block.section--sunken`) avec son accroche Full Stack / QA et sa grille sémantique de 4 piliers (Données, Fiabilité, IA, Exploitation).
+- Styles SCSS scopés conformes au Design System, responsive (1/2/4 colonnes), support motion réduit et navigation clavier testés et validés.
+
+### File List
+- app/pages/index.vue
+- docs/implementation-artifacts/12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur.md
+- docs/implementation-artifacts/sprint-status.yaml
+
+### Change Log
+- 2026-09-16 : Implémentation complète de la Story 12.3 (vitrine des 3 services ciblés et bloc différenciateur Prototype vers Production). Passé en revue.

 succeeded in 0ms:
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

 succeeded in 0ms:
56:         <ul class="grid-3">
58:             <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
64:+    <section class="section section--sunken diff-block">
67:+        <h2 class="section__title diff-block__title">
70:+        <p class="prose diff-block__lead">
77:+        <ul class="pillars-grid">
79:+            <ZCard class="pillar" padded interactive tilt>
85:+            </ZCard>
251:+.diff-block__title {
256:+.diff-block__lead {
264:+.pillars-grid {
319:+  .pillars-grid {
330:+  .pillars-grid,
386:+   **And** la liste sémantique `<ul class="grid-3">` expose 3 cartes structurées `<ZCard class="offer" interactive tilt ...>` avec numérotation terminale `01 / 03`, `02 / 03`, `03 / 03` :
394:+   **Then** une section ou un conteneur dédié `.diff-block` (ou `.section--sunken`) expose :
398:+     - Les 4 piliers d'industrialisation balisés sous forme de liste sémantique `<ul class="pillars-grid">` avec cartes `<ZCard :padded="true">` :
406:+   **Then** les grilles `.grid-3` et `.pillars-grid` basculent harmonieusement de 3/4 colonnes à 1 colonne sans débordement horizontal
407:+   **And** sous `prefers-reduced-motion: reduce`, les effets de tilt 3D sur `ZCard` et transitions dynamiques sont instantanément neutralisés
408:+   **And** le focus clavier (`Tab`) parcourt les cartes et liens `/services` selon un ordre séquentiel et visible (`:focus-visible` avec outline 2px)
431:+    - Grille `ul.pillars-grid` de 4 cartes `ZCard` (Données, Fiabilité, IA, Exploitation) avec icônes `ZIcon` dédiées et puces descriptives
432:+  - [x] Ajouter les styles SCSS scopés pour `.diff-block` / `.pillars-grid` en utilisant les tokens du Design System (`--space-*`, `--radius-*`, `--font-*`, `--surface-*`, `--border-*`).
481:+- Intégration du bloc différenciateur « Prototype → Production » (`section.diff-block.section--sunken`) avec son accroche Full Stack / QA et sa grille sémantique de 4 piliers (Données, Fiabilité, IA, Exploitation).

exec
/bin/zsh -lc 'rg -n "grid-3|section__title|eyebrow|ZCard|focus-visible|prefers-reduced-motion|section--sunken" app/pages/index.vue app/components/ui/ZCard.vue app/assets/scss/base/_motion.scss app/assets/scss/base/_layout.scss' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/ui/ZCard.vue:68:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCard.vue:164:  &:focus-visible {
app/components/ui/ZCard.vue:184:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_layout.scss:4://  .section / .section--sunken / .container / .eyebrow / .prose
app/assets/scss/base/_layout.scss:11:/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
app/assets/scss/base/_layout.scss:21:.section--sunken {
app/assets/scss/base/_layout.scss:36:// font-weight et line-height neutralisés pour un rendu identique sur <h2 class="eyebrow"> et <p class="eyebrow">.
app/assets/scss/base/_layout.scss:37:.eyebrow {
app/assets/scss/base/_layout.scss:49:.eyebrow--muted {
app/pages/index.vue:14:            <h2 class="eyebrow">
app/pages/index.vue:58:        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
app/pages/index.vue:59:        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
app/pages/index.vue:60:        <ul class="grid-3">
app/pages/index.vue:62:            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
app/pages/index.vue:86:            </ZCard>
app/pages/index.vue:93:    <section class="section section--sunken diff-block">
app/pages/index.vue:95:        <p class="eyebrow"><span aria-hidden="true">// </span>au-delà de la démo</p>
app/pages/index.vue:96:        <h2 class="section__title diff-block__title">
app/pages/index.vue:108:            <ZCard class="pillar" padded interactive tilt>
app/pages/index.vue:114:            </ZCard>
app/pages/index.vue:124:          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
app/pages/index.vue:125:          <h2 class="section__title">Des produits qui tournent en production</h2>
app/pages/index.vue:175:            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
app/pages/index.vue:176:            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
app/pages/index.vue:187:            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
app/pages/index.vue:217:            </ZCard>
app/pages/index.vue:222:        <ZCard v-else class="journal__empty" padded>
app/pages/index.vue:226:        </ZCard>
app/pages/index.vue:234:          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
app/pages/index.vue:282:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/pages/index.vue:513:// .section / .container / .eyebrow / .prose : primitives de layout globales
app/pages/index.vue:576:    &:focus-visible {
app/pages/index.vue:592:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:611:.section__title {
app/pages/index.vue:619:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
app/pages/index.vue:620:.grid-3 {
app/pages/index.vue:734:  &:focus-visible {
app/pages/index.vue:868:  &:focus-visible {
app/pages/index.vue:990:  .section__title {
app/pages/index.vue:1011:  &:focus-visible {
app/pages/index.vue:1146:.cta__eyebrow {
app/pages/index.vue:1193:  .grid-3,
app/pages/index.vue:1225:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:6:// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {

exec
/bin/zsh -lc "sed -n '620,760p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__no {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  color: var(--text-faint);
}

.offer__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.offer__desc {
  margin: 0 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__points {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    line-height: var(--lh-normal);
    color: var(--text-muted);
  }
}

.offer__check {
  flex-shrink: 0;
  margin-top: calc(var(--space-1) / 2);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

.offer__tags {
  margin-bottom: var(--space-4);
}

.offer__price {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--accent);
}

.offer__more {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    // Outline transparent : rendu en couleur système sous forced-colors.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

// ---- Bloc Différenciateur « Prototype → Production » (Story 12.3 / AC-2) ----
.diff-block__title {
  max-width: 28ch;
  margin-bottom: var(--space-4);
}

.diff-block__lead {
  max-width: 72ch;
  margin: 0 0 var(--space-8);
  font-size: var(--fs-md);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);

exec
/bin/zsh -lc "sed -n '52,90p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1190,1235p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .journal {
    grid-template-columns: 1fr;
  }

  .pillars-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .block__head--row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (width <= 680px) {
  .work__row {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .work__no,
  .work__go {
    display: none;
  }

  .pillars-grid,
  .stats {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim {
    animation: none;
  }

  .work__row,
  .work__go,
  .jpost__arrow,
  .seeall {
    transition: none;
  }

 succeeded in 0ms:
      </div>
    </section>

    <!-- Vitrine des 3 services cibles (Story 12.3 / AC-1) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos systèmes</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
              <div class="offer__top">
                <div class="offer__icon"><ZIcon :name="service.icon" /></div>
                <span class="offer__no">{{ service.no }}</span>
              </div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
              <ul class="offer__points">
                <li v-for="point in service.points" :key="point">
                  <ZIcon name="check" class="offer__check" />
                  <span>{{ point }}</span>
                </li>
              </ul>
              <ul class="hero__tags offer__tags">
                <li v-for="tag in service.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
              <div class="offer__price">
                <span>{{ service.price }}</span>
              </div>
              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                En savoir plus →
              </NuxtLink>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

exec
/bin/zsh -lc "sed -n '150,200p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

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
À ce stade, la majeure partie de l’AC fonctionnelle est bien couverte : les trois offres, les tags, les prix et le bloc “au-delà de la démo” correspondent aux textes canoniques. Je vérifie surtout les petits écarts structurels et d’a11y, là où les specs sont généralement les plus strictes.
exec
/bin/zsh -lc "sed -n '1,120p' app/components/ui/ZCard.vue && sed -n '120,170p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
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


codex
- **Service cards are not themselves routable** — violates Story 12.3 AC1: “chaque carte oriente directement vers `/services`”.
  Evidence from diff: cards render as plain `<ZCard class="offer" interactive tilt ...>` and only contain a nested `<NuxtLink to="/services" class="offer__more">`. The card root is not rendered as `<NuxtLink>` / `:as="NuxtLink"`.

- **Interactive pillar cards have no action or keyboard path** — violates Story 12.3 AC3 keyboard/focus requirement and a11y intent.
  Evidence from diff: pillar cards are added as `<ZCard class="pillar" padded interactive tilt>` with no `as`, `to`, `href`, `tabindex`, button role, or internal action. They look interactive but are not reachable/actionable by keyboard.

- **Interactive service card focus is effectively unreachable** — violates Story 12.3 AC3: “le focus clavier (`Tab`) parcourt les cartes et liens `/services`”.
  Evidence from diff: service cards are `<ZCard class="offer" interactive tilt ...>` without `as="NuxtLink"` or tabindex. Only the inner `.offer__more` link can receive tab focus, so the card-level `ZCard` focus-visible state is not part of the keyboard path.

- **Story 12.2 is marked done inside the Story 12.3 diff without its required terminal implementation evidence** — violates sprint/status consistency against Epic 12 context.
  Evidence from diff: `sprint-status.yaml` changes `12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: ready-for-dev` to `done`, while the diff only shows `app/pages/index.vue`, sprint status, and the 12.3 story file. No `HomeHeroTerminal.vue` diff appears, although Epic 12 Story 12.2 requires updated terminal commands (`whoami`, `focus.txt`, `~/systems`).
tokens used
37 565
- **Service cards are not themselves routable** — violates Story 12.3 AC1: “chaque carte oriente directement vers `/services`”.
  Evidence from diff: cards render as plain `<ZCard class="offer" interactive tilt ...>` and only contain a nested `<NuxtLink to="/services" class="offer__more">`. The card root is not rendered as `<NuxtLink>` / `:as="NuxtLink"`.

- **Interactive pillar cards have no action or keyboard path** — violates Story 12.3 AC3 keyboard/focus requirement and a11y intent.
  Evidence from diff: pillar cards are added as `<ZCard class="pillar" padded interactive tilt>` with no `as`, `to`, `href`, `tabindex`, button role, or internal action. They look interactive but are not reachable/actionable by keyboard.

- **Interactive service card focus is effectively unreachable** — violates Story 12.3 AC3: “le focus clavier (`Tab`) parcourt les cartes et liens `/services`”.
  Evidence from diff: service cards are `<ZCard class="offer" interactive tilt ...>` without `as="NuxtLink"` or tabindex. Only the inner `.offer__more` link can receive tab focus, so the card-level `ZCard` focus-visible state is not part of the keyboard path.

- **Story 12.2 is marked done inside the Story 12.3 diff without its required terminal implementation evidence** — violates sprint/status consistency against Epic 12 context.
  Evidence from diff: `sprint-status.yaml` changes `12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: ready-for-dev` to `done`, while the diff only shows `app/pages/index.vue`, sprint status, and the 12.3 story file. No `HomeHeroTerminal.vue` diff appears, although Epic 12 Story 12.2 requires updated terminal commands (`whoami`, `focus.txt`, `~/systems`).

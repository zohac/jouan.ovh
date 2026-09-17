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
session id: 01a0abc0-450b-73d1-8af2-cd6d398f6794
--------
user
# Acceptance Auditor Prompt — Story 12.1

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/projects-showcase.md`, `docs/specs/spec-repositionnement-ia/messaging-matrix.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.1), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-1/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
Je vais traiter ça en audit pur: lire la story, les specs de contexte, puis le diff fourni, et ressortir uniquement les écarts vérifiables avec preuves.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md" in /Users/simon/dev/jouan.ovh
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

 succeeded in 0ms:
---
baseline_commit: 5d8ea765a7adaf422137894801bf096860876837
---

# Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur du site,
I want consulter un profil et des métadonnées alignés sur les systèmes IA et l'automatisation métier,
so that j'identifie la spécialisation de Simon et ne trouve plus de références obsolètes (FR28, NFR13, NFR14).

## Acceptance Criteria

1. **Given** le fichier source unique `app/data/site.ts`
   **When** on met à jour les données du profil `SITE.profile`
   **Then** `profile.role` est exactement `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
   **And** `profile.city` devient `France · Remote` (suppression définitive de `Rouen, France`)
   **And** `profile.bio` ou description résume la promesse d'automatisation des workflows et d'industrialisation IA
   **And** le champ `maltUrl` est conservé (`https://www.malt.fr/profile/simonjouan`).

2. **Given** la liste ordonnée des compétences clés `SITE.skills`
   **When** on audite la stack technique moderne
   **Then** la liste met en valeur la stack ciblée IA & systèmes : `["typescript", "node.js", "nest.js", "nuxt", "vue", "postgresql", "mcp", "docker", "whisper.cpp", "sherpa-onnx", "llama.cpp", "bullmq", "rest-api", "vitest"]`.

3. **Given** la collection des projets vitrines `SITE.projects`
   **When** on charge les projets phares
   **Then** la liste principale expose exactement les 3 projets de l'Offre V1 :
     - **Keova Signal** : `role: "Concepteur & Développeur Full Stack"`, `status: "● Système interne / Dépôt privé"`, tags `["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"]`, sans champ `url` externe direct
     - **Debrief** : `role: "Concepteur & Développeur Full Stack"`, `status: "◐ R&D / Dépôt privé"`, tags `["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"]`, sans champ `url` externe direct
     - **Devis-Assist** : `role: "Architecte & Développeur Full Stack"`, `status: "○ Architecture validée / Dépôt privé"`, tags `["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"]`, sans champ `url` externe direct
   **And** les anciens projets (`Keova App`, `TryOn`, `Nodium`) sont conservés dans `SITE.legacyProjects` (ou export typé équivalent) pour préserver l'historique et le parcours
   **And** la mention obsolète `ERP équestre` est définitivement bannie et remplacée par `Application SaaS de gestion opérationnelle`
   **And** le terme proscrit `Ingénieur IA` est définitivement banni et remplacé par `Créateur · R&D agents IA`.

4. **Given** les composants consommateurs existants (`app/components/FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`, `app/components/CurrentTime.vue`, `app/components/home/HomeHeroTerminal.vue`, `app/pages/about.vue`, `app/pages/index.vue`)
   **When** les composants lisent `SITE.profile` et `SITE.projects`
   **Then** aucun plantage TypeScript ni erreur d'hydratation ne survient
   **And** `FooterComponent.vue` affiche la nouvelle tagline `Développeur Full Stack spécialisé en systèmes IA & automatisation métier. France · Remote.` et liste les 3 projets avec la classe `.ftr__link--static` sans lien 404
   **And** le terminal (`Projets.ts`) formate correctement les noms, statuts et descriptions sans générer de lien mort
   **And** `CurrentTime.vue` conserve un `aria-label` valide `Heure locale (France · Remote) : ...`.

5. **Given** l'ensemble des modifications de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour des interfaces et données dans `app/data/site.ts` (AC: 1, 2, 3)
  - [x] Mettre à jour `profile.role` avec `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`.
  - [x] Mettre à jour `profile.city` avec `France · Remote`.
  - [x] Réordonner `skills` pour intégrer MCP, whisper.cpp, sherpa-onnx, llama.cpp, BullMQ, Docker.
  - [x] Configurer les 3 projets phares dans `projects` : Keova Signal, Debrief, Devis-Assist.
  - [x] Déclarer `legacyProjects` pour conserver Keova App (corrigé sans « ERP équestre »), TryOn et Nodium (corrigé sans « Ingénieur IA »).
  - [x] Exporter `legacyProjects` dans l'objet `SITE`.

- [x] Tâche 2 — Contrôle et adaptation des consommateurs directs (AC: 4)
  - [x] Vérifier `app/components/FooterComponent.vue` (rendu des projets sans URL sous forme statique accessible).
  - [x] Vérifier `app/components/terminal/programs/Projets.ts` (affichage propre des statuts et descriptions).
  - [x] Vérifier `app/components/CurrentTime.vue` (aria-label avec `France · Remote`).
  - [x] Vérifier `app/components/home/HomeHeroTerminal.vue` (formatage de `projectsOutput` : `keova-signal/ debrief/ devis-assist/`).
  - [x] Vérifier `app/pages/about.vue` pour assurer la résolution correcte de `keovaProject` via `SITE.projects` ou `SITE.legacyProjects`.

- [x] Tâche 3 — Vérification sémantique globale anti-régression (AC: 1, 3)
  - [x] Lancer une recherche grep pour s'assurer de l'absence totale de « Ingénieur IA » et « ERP équestre » dans tout le dossier `app/`.
  - [x] Vérifier qu'aucun lien mort vers un dépôt GitHub privé n'est généré.

- [x] Tâche 4 — Validation qualité Docker (AC: 5)
  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider le passage à 100 % des tests ESLint, Stylelint, typecheck TypeScript et du build Nitro SSG.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker : `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **DRY & Source unique :** `app/data/site.ts` est la seule et unique source de vérité pour le profil et les projets. Aucun nom, rôle, bio ou projet ne doit être codé en dur dans les pages ou les programmes du terminal. [Source: AGENTS.md#Section 5.2]
- **Préservation des anciens projets :** Les anciens projets (Keova App, TryOn, Nodium) ne doivent pas être détruits. Ils sont simplement déplacés dans une propriété `legacyProjects` afin que `about.vue` ou les futures pages de parcours continuent de fonctionner sans rupture. [Source: docs/specs/spec-repositionnement-ia/projects-showcase.md#Section 2]

### Fichiers concernés
- [MODIFY] [app/data/site.ts](file:///Users/simon/dev/jouan.ovh/app/data/site.ts)
- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
- [MODIFY] [app/components/home/HomeStackMarquee.vue](file:///Users/simon/dev/jouan.ovh/app/components/home/HomeStackMarquee.vue)
- [MODIFY] [app/components/terminal/programs/About.ts](file:///Users/simon/dev/jouan.ovh/app/components/terminal/programs/About.ts)

### Références
- Cahier des charges et critères d'acceptation : [docs/planning-artifacts/epics.md#Story-12.1](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Vitrine projets & spécifications techniques réelles : [docs/specs/spec-repositionnement-ia/projects-showcase.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/projects-showcase.md)
- Matrice éditoriale : [docs/specs/spec-repositionnement-ia/messaging-matrix.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash

### Debug Log References

- Validation Docker exécutée avec succès via `docker compose run --rm web sh -c "export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 && corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
- 0 erreur ESLint / Stylelint.
- 0 erreur vue-tsc typecheck.
- 20 routes et assets statiques pré-rendus par Nitro SSG.

### Completion Notes List

- `app/data/site.ts` mis à jour avec le nouveau profil (« Développeur Full Stack spécialisé en systèmes IA & automatisation métier », localisation « France · Remote »), les compétences ordonnées ciblées IA & systèmes, les 3 projets phares de l'Offre V1 (Keova Signal, Debrief, Devis-Assist) sans lien sortant privé, et `legacyProjects` assaini sans mention « ERP équestre » ni « Ingénieur IA ».
- `app/pages/about.vue` adapté pour résoudre le projet Keova depuis `SITE.legacyProjects` ou `SITE.projects` de manière résiliente.
- `app/components/home/HomeStackMarquee.vue` enrichi avec les libellés de la nouvelle stack technique (MCP, whisper.cpp, sherpa-onnx, llama.cpp, BullMQ).
- `app/components/terminal/programs/About.ts` aligné sur `SITE.profile.role`.
- Recherche grep exhaustive confirmant l'absence de mentions obsolètes et de liens rompus.

### File List

- `app/data/site.ts` (modifié)
- `app/pages/about.vue` (modifié)
- `app/components/home/HomeStackMarquee.vue` (modifié)
- `app/components/terminal/programs/About.ts` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md` (modifié)

## Change Log

- 2026-09-16 : Implémentation complète de la Story 12.1 — Refonte de la source unique de données `site.ts`, intégration des 3 projets phares de l'Offre V1, déclaration de `legacyProjects`, assainissement sémantique et validation Docker 100% verte.


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


codex
Le skill de revue BMAD contient des checkpoints interactifs, mais votre consigne demande explicitement un audit sans pause. Je garde donc le mode adversarial, sans lancer de workflow qui exigerait de vous interrompre.
exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/messaging-matrix.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,260p' docs/specs/spec-repositionnement-ia/projects-showcase.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "rg -n \"Story 12\\.1|Epic 12|12\\.1|Source unique\" docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
AGENTS.md:84:│   │   ├── useSiteUrl.ts    # Source unique pour l'URL de base résolue via runtimeConfig
docs/project-context.md:137:  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
docs/project-context.md:138:  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
docs/planning-artifacts/epics.md:66:#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
docs/planning-artifacts/epics.md:168:FR28: Epic 12 — Source de vérité site.ts, assainissement sémantique & profil
docs/planning-artifacts/epics.md:169:FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
docs/planning-artifacts/epics.md:170:FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
docs/planning-artifacts/epics.md:171:FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
docs/planning-artifacts/epics.md:172:FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
docs/planning-artifacts/epics.md:173:FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
docs/planning-artifacts/epics.md:174:FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
docs/planning-artifacts/epics.md:175:FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
docs/planning-artifacts/epics.md:176:FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
docs/planning-artifacts/epics.md:224:### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:849:## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md:853:### Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/home/HomeStackMarquee.vue b/app/components/home/HomeStackMarquee.vue
index 3be72c8..c64b248 100644
--- a/app/components/home/HomeStackMarquee.vue
+++ b/app/components/home/HomeStackMarquee.vue
@@ -29,15 +29,17 @@ import { SITE } from "~/data/site";
 
 const SKILL_LABEL_MAP: Record<string, string> = {
   typescript: "TypeScript",
+  "node.js": "Node.js",
+  "nest.js": "NestJS",
   nuxt: "Nuxt 4",
   vue: "Vue.js",
-  "nest.js": "NestJS",
-  "node.js": "Node.js",
   postgresql: "PostgreSQL",
-  typeorm: "TypeORM",
-  stripe: "Stripe Connect",
-  testcafe: "TestCafé",
+  mcp: "MCP",
   docker: "Docker",
+  "whisper.cpp": "whisper.cpp",
+  "sherpa-onnx": "sherpa-onnx",
+  "llama.cpp": "llama.cpp",
+  bullmq: "BullMQ",
   "rest-api": "REST API",
   vitest: "Vitest",
 };
diff --git a/app/components/terminal/programs/About.ts b/app/components/terminal/programs/About.ts
index a92884e..e1784c5 100644
--- a/app/components/terminal/programs/About.ts
+++ b/app/components/terminal/programs/About.ts
@@ -63,7 +63,7 @@ const aboutData = {
   userInfo: {
     firstname: "Simon",
     lastname: "JOUAN",
-    poste: "Développeur Fullstack & Testeur QA",
+    poste: SITE.profile.role,
     experience: "3 ans",
     ville: SITE.profile.city,
     telephone: "+33 6 58 96 90 20",
diff --git a/app/data/site.ts b/app/data/site.ts
index 71a2a5b..d6a4b15 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -13,6 +13,7 @@
 export interface IProfile {
   name: string;
   role: string;
+  bio?: string;
   email: string;
   city: string;
   available: boolean;
@@ -32,9 +33,10 @@ export interface IProject {
 
 const profile: IProfile = {
   name: "Simon Jouan",
-  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
+  role: "Développeur Full Stack spécialisé en systèmes IA & automatisation métier",
+  bio: "Conception et industrialisation d'applications web, agents IA et pipelines d'automatisation métier de bout en bout.",
   email: "simon@jouan.ovh",
-  city: "Rouen, France",
+  city: "France · Remote",
   available: true,
   maltUrl: "https://www.malt.fr/profile/simonjouan",
   phone: "+33 6 58 96 90 20",
@@ -44,24 +46,50 @@ const profile: IProfile = {
 // Stack technique moderne prioritaire ordonnée.
 const skills: string[] = [
   "typescript",
+  "node.js",
+  "nest.js",
   "nuxt",
   "vue",
-  "nest.js",
-  "node.js",
   "postgresql",
-  "typeorm",
-  "stripe",
-  "testcafe",
+  "mcp",
   "docker",
+  "whisper.cpp",
+  "sherpa-onnx",
+  "llama.cpp",
+  "bullmq",
   "rest-api",
   "vitest",
 ];
 
 const projects: IProject[] = [
+  {
+    name: "Keova Signal",
+    role: "Concepteur & Développeur Full Stack",
+    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique et serveur MCP natif.",
+    status: "● Système interne / Dépôt privé",
+    tags: ["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"],
+  },
+  {
+    name: "Debrief",
+    role: "Concepteur & Développeur Full Stack",
+    desc: "Application desktop privacy-first de synthèse commerciale 100 % locale (ASR whisper.cpp, diarisation sherpa-onnx, LLM Gemma 4).",
+    status: "◐ R&D / Dépôt privé",
+    tags: ["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"],
+  },
+  {
+    name: "Devis-Assist",
+    role: "Architecte & Développeur Full Stack",
+    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ et matching flou PostgreSQL.",
+    status: "○ Architecture validée / Dépôt privé",
+    tags: ["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"],
+  },
+];
+
+const legacyProjects: IProject[] = [
   {
     name: "Keova App",
     role: "Co-fondateur & Développeur Full Stack",
-    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
+    desc: "Application SaaS de gestion opérationnelle complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
     url: "https://keova.app",
     status: "● En production",
     tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
@@ -75,11 +103,11 @@ const projects: IProject[] = [
   },
   {
     name: "Nodium",
-    role: "Créateur & Ingénieur IA",
+    role: "Créateur · R&D agents IA",
     desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
     status: "◐ R&D / En cours",
     tags: ["TypeScript", "Electron", "Agents", "IA"],
   },
 ];
 
-export const SITE = { profile, skills, projects } as const;
+export const SITE = { profile, skills, projects, legacyProjects } as const;
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 7282541..10f3bb9 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -102,7 +102,9 @@ import { SITE } from "~/data/site";
 const profile = SITE.profile;
 const skills = SITE.skills;
 const city = profile.city.split(",")[0]?.trim() ?? profile.city;
-const keovaProject = SITE.projects.find((p) => p.name.toLowerCase().includes("keova") || p.url?.includes("keova"));
+const keovaProject =
+  SITE.legacyProjects.find((p) => p.name.toLowerCase().includes("keova") && p.url) ??
+  SITE.projects.find((p) => p.name.toLowerCase().includes("keova"));
 const keovaUrl = keovaProject?.url ?? "";
 const keovaHostname = keovaUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
 
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 6fab533..574b40d 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-14 (Epic 11 rétrospective clôturée, accords d'équipe formalisés, prêt pour merge prod)"
+last_updated: "2026-09-16 (Story 12.1 terminée et prête pour revue)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -126,3 +126,13 @@ development_status:
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: done
   11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions: done
   epic-11-retrospective: done
+
+  # Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier
+  epic-12: in-progress
+  12-1-source-unique-de-donnees-sitets-et-coherence-globale: review
+  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: backlog
+  12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: backlog
+  12-4-homepage-vitrine-des-3-projets-phares: backlog
+  12-5-page-services-restructuration-des-offres-et-process-4-etapes: backlog
+  12-6-page-a-propos-cta-inspecteur-formulaire-et-seo-site-wide: backlog
+  epic-12-retrospective: optional
diff --git a/docs/planning-artifacts/epics.md b/docs/planning-artifacts/epics.md
index 45a43fe..349a3c1 100644
--- a/docs/planning-artifacts/epics.md
+++ b/docs/planning-artifacts/epics.md
@@ -12,6 +12,11 @@ inputDocuments:
   - docs/specs/spec-home-awwwards/.decision-log.md
   - docs/contexte_malt.md
   - docs/direction_strategique_site.md
+  - docs/specs/spec-repositionnement-ia/SPEC.md
+  - docs/specs/spec-repositionnement-ia/messaging-matrix.md
+  - docs/specs/spec-repositionnement-ia/services-and-pricing.md
+  - docs/specs/spec-repositionnement-ia/projects-showcase.md
+  - docs/jouan-ovh-offre-v1-brief-codex.md
   - AGENTS.md
 ---
 
@@ -58,6 +63,17 @@ FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet
 FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
 FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
 
+#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
+FR28: Source de données unique (`site.ts`), assainissement sémantique et cohérence globale du profil (nouveau titre, bio, localisation « France · Remote », stack ciblée, vitrine Keova Signal / Debrief / Devis-Assist, élimination de « Ingénieur IA » et « ERP équestre »). _(CAP-1)_
+FR29: Page d'accueil — Hero commercial cinétique & Terminal interactif (H1 « Automatisez les workflows qui freinent votre équipe », sous-titre d'intégration de systèmes, CTAs vers workflow, commandes terminal `whoami`, `cat focus.txt`, `ls ~/systems`). _(CAP-2)_
+FR30: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production » (Automatisation, Agents IA, Applications sur mesure, suivi de « Un agent qui fonctionne trois fois n'est pas encore un système fiable » articulé sur 4 piliers). _(CAP-3)_
+FR31: Page d'accueil — Vitrine des 3 projets phares (Keova Signal avec dashboard réel HD, Debrief 100% on-device avec capture HD, Devis-Assist avec pipeline OCR BTP et matching pg_trgm, sans faux ROI, relégation des anciens projets en archives/parcours). _(CAP-4)_
+FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
+FR33: Page À propos — Trajectoire professionnelle et rigueur QA (métrologie industrielle → QA logicielle → Full Stack → systèmes IA en production). _(CAP-6)_
+FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
+FR35: SEO centralisé, OpenGraph et Schema.org/JSON-LD alignés sur « Systèmes IA, agents & automatisation métier ». _(CAP-8)_
+FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_
+
 ### NonFunctional Requirements
 
 NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
@@ -72,6 +88,10 @@ NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
 NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
 NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
 NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
+NFR13: Sobriété & Zéro Emoji — aucun emoji dans les contenus et composants (NFR6), aucun visuel générique d'IA (pas de robots, cerveaux lumineux ou gradients néon SaaS).
+NFR14: Confidentialité & Propriété intellectuelle — respect strict des dépôts privés (`zohac/*`), aucun lien sortant 404, mention transparente des statuts réels.
+NFR15: Exécution Docker stricte — toute compilation et validation de gate s'effectue dans le conteneur Docker.
+NFR16: Performance SSG & Zéro régression — génération statique Nitro préservée avec 13 routes pré-rendues.
 
 ### Additional Requirements
 
@@ -111,6 +131,10 @@ UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse d
 UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
 UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
 UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
+UX-DR28: Intégration des captures d'écran réelles HD de Keova Signal et Debrief dans `public/images/projects/` avec ratios et bordures conformes au Design System.
+UX-DR29: Grille modulaire pour le bloc différenciateur « Prototype → Production » (4 piliers Données, Fiabilité, IA, Exploitation).
+UX-DR30: Grille tarifaire transparente sur `/services` dissociant honoraires forfaitaires et coûts variables d'APIs/tokens tiers.
+UX-DR31: Formulaire `/contact` allégé et orienté description textuelle de workflow sans questions invasives de budget au premier contact.
 
 ### FR Coverage Map
 
@@ -141,6 +165,15 @@ FR24: Epic 11 — Vitrine des articles récents du blog
 FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
 FR26: Epic 11 — Préservation de l'architecture multi-pages
 FR27: Epic 11 — Micro-curseur interactif progressif desktop
+FR28: Epic 12 — Source de vérité site.ts, assainissement sémantique & profil
+FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
+FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
+FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
+FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
+FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
+FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
+FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
+FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
 
 ## Epic List
 
@@ -188,6 +221,10 @@ La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO
 Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
 **FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
 
+### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
+Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
+**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36 _(NFR13 à NFR16, UX-DR28 à UX-DR31)_
+
 ---
 

codex
J’ai déjà un premier signal: le diff touche surtout `site.ts` et quelques consommateurs, donc je vérifie maintenant les sections exactes Epic 12/Story 12.1 et la fin du diff pour ne pas rater un écart caché dans la doc ou les fichiers consommateurs.
exec
/bin/zsh -lc "sed -n '849,940p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
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


exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/12-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 ## Epic 1: Migration de la stack vers Nuxt 4
@@ -807,4 +844,142 @@ So that l'expérience soit véritablement au niveau d'un portfolio primé Awwwar
 **And** le footer rehausse le contraste de l'ensemble de ses libellés et liens pour une lisibilité WCAG AA irréprochable
 **And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)
 
+---
+
+## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
+
+Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
+
+### Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale
+
+As a visiteur du site,
+I want consulter un profil et des métadonnées alignés sur les systèmes IA et l'automatisation métier,
+So that j'identifie la spécialisation de Simon et ne trouve plus de références obsolètes (FR28, NFR13, NFR14).
+
+**Acceptance Criteria:**
+
+**Given** le fichier source unique `app/data/site.ts` et le composant Footer
+**When** on met à jour les données de `SITE` :
+  - `profile.role` devient `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
+  - `profile.location` devient `France · Remote` (suppression définitive de `Rouen, France`)
+  - `profile.bio` reflète la promesse d'automatisation des workflows et d'industrialisation IA
+  - `skills` met en avant la stack ciblée (`TypeScript`, `Node.js 22`, `NestJS`, `Nuxt`, `PostgreSQL`, `MCP`, `Docker`, `whisper.cpp`, `sherpa-onnx`, `llama.cpp`, `BullMQ`, `Mistral OCR`)
+  - `projects` intègre les entrées de `keova-signal` (interne/privé), `debrief` (R&D/privé) et `devis-assist` (architecture validée/privé) avec leurs tags et statuts réels
+  - Les projets historiques (`keova-app`, `tryon`, `nodium`, web) sont maintenus dans une catégorie d'archives ou parcours, avec correction de la mention « ERP équestre » remplacée par « Application SaaS de gestion opérationnelle » et suppression du terme « Ingénieur IA » au profit de « Créateur · R&D agents IA »
+**Then** aucun terme « Ingénieur IA » ni « ERP équestre » ne subsiste dans `site.ts` et les pieds de page
+**And** la validation Docker (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues).
+
+### Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif
+
+As a prospect découvrant la page d'accueil,
+I want lire immédiatement une promesse orientée vers la résolution de mes irritants métier et voir un terminal interactif cohérent,
+So that je comprends en 5 secondes ce que Simon apporte à mon équipe (FR29, NFR13, NFR15, UX-DR28).
+
+**Acceptance Criteria:**
+
+**Given** la page d'accueil `app/pages/index.vue` et le composant `HomeHeroTerminal.vue`
+**When** on charge la page d'accueil
+**Then** le hero affiche en typographie Ubuntu et SCSS tokens :
+  - Sur-titre : `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`
+  - H1 : `Automatisez les workflows qui freinent votre équipe.`
+  - Sous-titre : `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`
+  - Ligne de crédibilité : `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`
+  - CTA principal : `<ZButton to="/contact">Identifier un workflow à automatiser</ZButton>`
+  - CTA secondaire : `<ZButton variant="secondary" href="#systems">Voir mes systèmes IA</ZButton>` (ou route `/services`)
+  - Signal de disponibilité : `Disponible pour nouvelles missions freelance`
+**And** la séquence de frappe du terminal hero exécute les nouvelles commandes :
+  - `$ whoami` -> `Simon Jouan — Développeur Full Stack spécialisé IA & automatisation`
+  - `$ cat focus.txt` -> `Systèmes IA · automatisation métier · agents · applications Full Stack · QA`
+  - `$ ls ~/systems` -> `keova-signal/ debrief/ devis-assist/`
+**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.
+
+### Story 12.3: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production »
+
+As a visiteur évaluant l'offre de services sur la page d'accueil,
+I want découvrir les 3 piliers d'accompagnement et les arguments prouvant la viabilité des systèmes déployés,
+So that je distingue le travail industriel d'une simple démonstration de chatbot fragile (FR30, NFR13, UX-DR29).
+
+**Acceptance Criteria:**
+
+**Given** la section services d'accueil et le nouveau bloc différenciateur
+**When** le visiteur fait défiler la page d'accueil
+**Then** la section vitrine expose 3 cartes `ZCard` d'offres :
+  1. *Automatisation de processus métier* (cartographie de workflow, tâches répétitives, tags `Workflow` · `APIs` · `Automation` · `PostgreSQL`)
+  2. *Agents IA intégrés à vos outils* (lecture, interprétation, synthèse, validation humaine, tags `Agents IA` · `LLM` · `MCP` · `Human-in-the-loop`)
+  3. *Applications IA sur mesure* (produits dédiés, toute la chaîne logicielle, tags `TypeScript` · `Nuxt` · `NestJS` · `PostgreSQL` · `Tauri`)
+**And** chaque carte redirige vers `/services`
+**And** immédiatement après, le bloc différenciateur `.prototype-to-prod` expose :
+  - Eyebrow `<span class="eyebrow">// au-delà de la démo</span>`
+  - H2 `Un agent qui fonctionne trois fois n’est pas encore un système fiable.`
+  - Texte explicatif valorisant le background Full Stack et QA (gestion des erreurs, retries, logs, tests, coûts, monitoring, sécurité)
+  - 4 piliers techniques : *Données*, *Fiabilité*, *IA*, *Exploitation*
+**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.
+
+### Story 12.4: Page d'accueil — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
+
+As a prospect technique en quête de preuves de compétences,
+I want examiner 3 réalisations concrètes résolvant des cas réels avec visuels et stacks précises,
+So that je sois convaincu de la faisabilité de mon propre projet sans être trompé par de faux indicateurs (FR31, NFR14, UX-DR28).
+
+**Acceptance Criteria:**
+
+**Given** la section des projets de la page d'accueil
+**When** on rend la vitrine des projets phares
+**Then** les 3 projets sont affichés sous forme de cartes riches :
+  - **Keova Signal** : statut `● Système interne / En développement actif`, accroche `Détecter le bon prospect au bon moment`, description courte (Open Data Sirene, Token Bucket, scraping éthique, double étage de scoring Zod, serveur MCP 10 outils), tags (`Node.js 22` · `TypeScript` · `MCP Server` · `PostgreSQL` · `Cheerio` · `Docker`), capture réelle HD `keova-signal-dashboard.png` (via `<NuxtImg>`), badge `Projet interne / Dépôt privé` sans lien externe mort
+  - **Debrief** : statut `◐ R&D / En développement`, accroche `Transformer un rendez-vous commercial en apprentissage exploitable`, description courte (application desktop privacy-first, 100% on-device, whisper.cpp large-v3, sherpa-onnx, NER composite GLiNER/CamemBERT, llama-server Gemma 4 IT), tags (`Tauri` · `Rust` · `whisper.cpp` · `sherpa-onnx` · `llama.cpp` · `Gemma 4`), capture réelle `debrief-dashboard.png`, badge `Dépôt privé`
+  - **Devis-Assist** : statut `○ Produit / Architecture BMM validée`, accroche `Transformer un historique de devis BTP en aide au chiffrage`, description courte (Mistral OCR 3, file BullMQ/Redis, catalogue de services canoniques BTP avec Data Flywheel et matching pg_trgm), tags (`NestJS` · `Nuxt UI 4` · `PostgreSQL pg_trgm` · `Mistral OCR` · `BullMQ`), badge `Dépôt privé`
+**And** aucun ROI client ni chiffre d'affaires inventé n'apparaît
+**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.
+
+### Story 12.5: Page Services — Restructuration complète des offres & Processus en 4 étapes
+
+As a client potentiel prêt à s'engager,
+I want consulter le déroulement type d'une mission et des tarifs forfaitaires clairs,
+So that je puisse budgéter mon besoin sans crainte de coûts cachés (FR32, NFR13, UX-DR30).
+
+**Acceptance Criteria:**
+
+**Given** la page `app/pages/services.vue`
+**When** on charge la page
+**Then** le hero affiche :
+  - H1 : `Des systèmes IA construits autour de vos vrais processus métier.`
+  - Intro : `Je pars d’un workflow existant, pas d’une technologie à placer... L’IA intervient uniquement là où elle apporte réellement quelque chose.`
+**And** les 3 offres commerciales sont détaillées :
+  1. **AI Workflow Sprint** (Offre principale) : `À partir de 3 500 € HT`. Règle : `Un Sprint = un workflow prioritaire`. Liste complète des livrables inclus (diagnostic, cartographie, KPI, architecture, dev, intégrations, tests, MEP, documentation, mesure initiale).
+  2. **AI Workflow Blueprint** : `À partir de 750 € HT`. Cadrage préalable pour problématique complexe (processus actuel, volumes, risques, flux cible, matrice IA vs automation vs humain, KPI, estimation).
+  3. **AI Care** : `À partir de 490 € HT / mois`. Maintien en condition opérationnelle (monitoring, maintenance, support, veille coûts et modèles), avec exclusion explicite des consommations tierces d'APIs/tokens refacturées au réel.
+**And** le processus en 4 étapes est balisé sémantiquement en liste ordonnée `<ol>` :
+  - Étape 1 : *Diagnostic* (20-30 min pour qualifier le problème) avec CTA `Identifier un workflow`
+  - Étape 2 : *Cadrage* (workflow cible, KPI, architecture)
+  - Étape 3 : *Construction & intégration* (développement, tests sur cas réels, MEP)
+  - Étape 4 : *Suivi & amélioration* (monitoring, maintenance, mesure des résultats)
+**And** l'ancienne offre WordPress principale est supprimée de la page
+**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) passe avec 0 erreur.
+
+### Story 12.6: Page À propos, CTA d'inspection de workflow, formulaire & SEO site-wide
+
+As a prospect souhaitant vérifier la crédibilité du profil et initier une demande ciblée,
+I want comprendre le lien entre le parcours qualité/métrologie de Simon et la robustesse de ses systèmes IA, et pouvoir qualifier mon workflow dans le formulaire,
+So that j'envoie une demande précise et pertinente (FR33, FR34, FR35, FR36, NFR15, NFR16, UX-DR31).
+
+**Acceptance Criteria:**
+
+**Given** les pages `app/pages/about.vue`, `app/pages/contact/index.vue`, le layout global et les métadonnées SEO
+**When** on navigue sur le site
+**Then** la page À propos (`/about`) :
+  - Présente le titre `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
+  - Relie les 12 ans de métrologie industrielle et l'expérience QA aux réflexes de fiabilité des systèmes IA (reproductibilité, gestion des cas limites, observabilité)
+  - Expose le bloc philosophie (« Je ne pars pas de "où mettre de l'IA ?", je pars de "qu'est-ce qui prend du temps ?" »)
+  - Mentionne l'expérience Linkizz dans le parcours selon les données réelles
+**And** le CTA final présent sur les pages de conversion affiche :
+  - Eyebrow : `$ ./workflow --inspect`
+  - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
+  - Texte d'accompagnement orienté diagnostic pragmatique
+  - Boutons d'action `Identifier un workflow à automatiser` (vers `/contact`) et `M’écrire directement`
+**And** le formulaire de contact (`/contact`) est orienté qualification de workflow (champs processus à améliorer, fonctionnement actuel, répétition)
+**And** `usePageSeo` met à jour les balises de titres (`Simon Jouan — Systèmes IA, agents & automatisation métier`), descriptions et métadonnées canoniques/OpenGraph sur l'ensemble des 13 routes
+**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur (0 ESLint/Stylelint, 0 typecheck TypeScript, 13 routes statiques pré-rendues).
+
+
 
diff --git a/docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md b/docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md
new file mode 100644
index 0000000..29e80c4
--- /dev/null
+++ b/docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md
@@ -0,0 +1,127 @@
+---
+baseline_commit: 5d8ea765a7adaf422137894801bf096860876837
+---
+
+# Story 12.1: Source unique de données `site.ts`, assainissement sémantique & cohérence globale
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a visiteur du site,
+I want consulter un profil et des métadonnées alignés sur les systèmes IA et l'automatisation métier,
+so that j'identifie la spécialisation de Simon et ne trouve plus de références obsolètes (FR28, NFR13, NFR14).
+
+## Acceptance Criteria
+
+1. **Given** le fichier source unique `app/data/site.ts`
+   **When** on met à jour les données du profil `SITE.profile`
+   **Then** `profile.role` est exactement `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
+   **And** `profile.city` devient `France · Remote` (suppression définitive de `Rouen, France`)
+   **And** `profile.bio` ou description résume la promesse d'automatisation des workflows et d'industrialisation IA
+   **And** le champ `maltUrl` est conservé (`https://www.malt.fr/profile/simonjouan`).
+
+2. **Given** la liste ordonnée des compétences clés `SITE.skills`
+   **When** on audite la stack technique moderne
+   **Then** la liste met en valeur la stack ciblée IA & systèmes : `["typescript", "node.js", "nest.js", "nuxt", "vue", "postgresql", "mcp", "docker", "whisper.cpp", "sherpa-onnx", "llama.cpp", "bullmq", "rest-api", "vitest"]`.
+
+3. **Given** la collection des projets vitrines `SITE.projects`
+   **When** on charge les projets phares
+   **Then** la liste principale expose exactement les 3 projets de l'Offre V1 :
+     - **Keova Signal** : `role: "Concepteur & Développeur Full Stack"`, `status: "● Système interne / Dépôt privé"`, tags `["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"]`, sans champ `url` externe direct
+     - **Debrief** : `role: "Concepteur & Développeur Full Stack"`, `status: "◐ R&D / Dépôt privé"`, tags `["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"]`, sans champ `url` externe direct
+     - **Devis-Assist** : `role: "Architecte & Développeur Full Stack"`, `status: "○ Architecture validée / Dépôt privé"`, tags `["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"]`, sans champ `url` externe direct
+   **And** les anciens projets (`Keova App`, `TryOn`, `Nodium`) sont conservés dans `SITE.legacyProjects` (ou export typé équivalent) pour préserver l'historique et le parcours
+   **And** la mention obsolète `ERP équestre` est définitivement bannie et remplacée par `Application SaaS de gestion opérationnelle`
+   **And** le terme proscrit `Ingénieur IA` est définitivement banni et remplacé par `Créateur · R&D agents IA`.
+
+4. **Given** les composants consommateurs existants (`app/components/FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`, `app/components/CurrentTime.vue`, `app/components/home/HomeHeroTerminal.vue`, `app/pages/about.vue`, `app/pages/index.vue`)
+   **When** les composants lisent `SITE.profile` et `SITE.projects`
+   **Then** aucun plantage TypeScript ni erreur d'hydratation ne survient
+   **And** `FooterComponent.vue` affiche la nouvelle tagline `Développeur Full Stack spécialisé en systèmes IA & automatisation métier. France · Remote.` et liste les 3 projets avec la classe `.ftr__link--static` sans lien 404
+   **And** le terminal (`Projets.ts`) formate correctement les noms, statuts et descriptions sans générer de lien mort
+   **And** `CurrentTime.vue` conserve un `aria-label` valide `Heure locale (France · Remote) : ...`.
+
+5. **Given** l'ensemble des modifications de la story
+   **When** on exécute la gate de validation Docker
+   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques pré-rendues.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Mise à jour des interfaces et données dans `app/data/site.ts` (AC: 1, 2, 3)
+  - [x] Mettre à jour `profile.role` avec `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`.
+  - [x] Mettre à jour `profile.city` avec `France · Remote`.
+  - [x] Réordonner `skills` pour intégrer MCP, whisper.cpp, sherpa-onnx, llama.cpp, BullMQ, Docker.
+  - [x] Configurer les 3 projets phares dans `projects` : Keova Signal, Debrief, Devis-Assist.
+  - [x] Déclarer `legacyProjects` pour conserver Keova App (corrigé sans « ERP équestre »), TryOn et Nodium (corrigé sans « Ingénieur IA »).
+  - [x] Exporter `legacyProjects` dans l'objet `SITE`.
+
+- [x] Tâche 2 — Contrôle et adaptation des consommateurs directs (AC: 4)
+  - [x] Vérifier `app/components/FooterComponent.vue` (rendu des projets sans URL sous forme statique accessible).
+  - [x] Vérifier `app/components/terminal/programs/Projets.ts` (affichage propre des statuts et descriptions).
+  - [x] Vérifier `app/components/CurrentTime.vue` (aria-label avec `France · Remote`).
+  - [x] Vérifier `app/components/home/HomeHeroTerminal.vue` (formatage de `projectsOutput` : `keova-signal/ debrief/ devis-assist/`).
+  - [x] Vérifier `app/pages/about.vue` pour assurer la résolution correcte de `keovaProject` via `SITE.projects` ou `SITE.legacyProjects`.
+
+- [x] Tâche 3 — Vérification sémantique globale anti-régression (AC: 1, 3)
+  - [x] Lancer une recherche grep pour s'assurer de l'absence totale de « Ingénieur IA » et « ERP équestre » dans tout le dossier `app/`.
+  - [x] Vérifier qu'aucun lien mort vers un dépôt GitHub privé n'est généré.
+
+- [x] Tâche 4 — Validation qualité Docker (AC: 5)
+  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Valider le passage à 100 % des tests ESLint, Stylelint, typecheck TypeScript et du build Nitro SSG.
+
+## Dev Notes
+
+### Architecture & Contraintes d'environnement
+- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker : `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
+- **DRY & Source unique :** `app/data/site.ts` est la seule et unique source de vérité pour le profil et les projets. Aucun nom, rôle, bio ou projet ne doit être codé en dur dans les pages ou les programmes du terminal. [Source: AGENTS.md#Section 5.2]
+- **Préservation des anciens projets :** Les anciens projets (Keova App, TryOn, Nodium) ne doivent pas être détruits. Ils sont simplement déplacés dans une propriété `legacyProjects` afin que `about.vue` ou les futures pages de parcours continuent de fonctionner sans rupture. [Source: docs/specs/spec-repositionnement-ia/projects-showcase.md#Section 2]
+
+### Fichiers concernés
+- [MODIFY] [app/data/site.ts](file:///Users/simon/dev/jouan.ovh/app/data/site.ts)
+- [MODIFY] [app/pages/about.vue](file:///Users/simon/dev/jouan.ovh/app/pages/about.vue)
+- [MODIFY] [app/components/home/HomeStackMarquee.vue](file:///Users/simon/dev/jouan.ovh/app/components/home/HomeStackMarquee.vue)
+- [MODIFY] [app/components/terminal/programs/About.ts](file:///Users/simon/dev/jouan.ovh/app/components/terminal/programs/About.ts)
+
+### Références
+- Cahier des charges et critères d'acceptation : [docs/planning-artifacts/epics.md#Story-12.1](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
+- Vitrine projets & spécifications techniques réelles : [docs/specs/spec-repositionnement-ia/projects-showcase.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/projects-showcase.md)
+- Matrice éditoriale : [docs/specs/spec-repositionnement-ia/messaging-matrix.md](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
+
+## Dev Agent Record
+
+### Agent Model Used
+
+Gemini 3.7 Flash
+
+### Debug Log References
+
+- Validation Docker exécutée avec succès via `docker compose run --rm web sh -c "export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 && corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+- 0 erreur ESLint / Stylelint.
+- 0 erreur vue-tsc typecheck.
+- 20 routes et assets statiques pré-rendus par Nitro SSG.
+
+### Completion Notes List
+
+- `app/data/site.ts` mis à jour avec le nouveau profil (« Développeur Full Stack spécialisé en systèmes IA & automatisation métier », localisation « France · Remote »), les compétences ordonnées ciblées IA & systèmes, les 3 projets phares de l'Offre V1 (Keova Signal, Debrief, Devis-Assist) sans lien sortant privé, et `legacyProjects` assaini sans mention « ERP équestre » ni « Ingénieur IA ».
+- `app/pages/about.vue` adapté pour résoudre le projet Keova depuis `SITE.legacyProjects` ou `SITE.projects` de manière résiliente.
+- `app/components/home/HomeStackMarquee.vue` enrichi avec les libellés de la nouvelle stack technique (MCP, whisper.cpp, sherpa-onnx, llama.cpp, BullMQ).
+- `app/components/terminal/programs/About.ts` aligné sur `SITE.profile.role`.
+- Recherche grep exhaustive confirmant l'absence de mentions obsolètes et de liens rompus.
+
+### File List
+
+- `app/data/site.ts` (modifié)
+- `app/pages/about.vue` (modifié)
+- `app/components/home/HomeStackMarquee.vue` (modifié)
+- `app/components/terminal/programs/About.ts` (modifié)
+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
+- `docs/implementation-artifacts/12-1-source-unique-de-donnees-sitets-et-coherence-globale.md` (modifié)
+
+## Change Log
+
+- 2026-09-16 : Implémentation complète de la Story 12.1 — Refonte de la source unique de données `site.ts`, intégration des 3 projets phares de l'Offre V1, déclaration de `legacyProjects`, assainissement sémantique et validation Docker 100% verte.
+

exec
/bin/zsh -lc "sed -n '120,170p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"ftr__link|SITE\\.projects|profile\\.city|CurrentTime|Projets|projectsOutput|legacyProjects|profile\\.role|SITE\\.profile\" app docs/implementation-artifacts/code-reviews/12-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/code-reviews/12-1/full.diff:37:+    poste: SITE.profile.role,
docs/implementation-artifacts/code-reviews/12-1/full.diff:39:     ville: SITE.profile.city,
docs/implementation-artifacts/code-reviews/12-1/full.diff:114:+const legacyProjects: IProject[] = [
docs/implementation-artifacts/code-reviews/12-1/full.diff:136:+export const SITE = { profile, skills, projects, legacyProjects } as const;
docs/implementation-artifacts/code-reviews/12-1/full.diff:142: const profile = SITE.profile;
docs/implementation-artifacts/code-reviews/12-1/full.diff:144: const city = profile.city.split(",")[0]?.trim() ?? profile.city;
docs/implementation-artifacts/code-reviews/12-1/full.diff:145:-const keovaProject = SITE.projects.find((p) => p.name.toLowerCase().includes("keova") || p.url?.includes("keova"));
docs/implementation-artifacts/code-reviews/12-1/full.diff:147:+  SITE.legacyProjects.find((p) => p.name.toLowerCase().includes("keova") && p.url) ??
docs/implementation-artifacts/code-reviews/12-1/full.diff:148:+  SITE.projects.find((p) => p.name.toLowerCase().includes("keova"));
docs/implementation-artifacts/code-reviews/12-1/full.diff:282:+  - `profile.role` devient `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
docs/implementation-artifacts/code-reviews/12-1/full.diff:430:+   **When** on met à jour les données du profil `SITE.profile`
docs/implementation-artifacts/code-reviews/12-1/full.diff:431:+   **Then** `profile.role` est exactement `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`
docs/implementation-artifacts/code-reviews/12-1/full.diff:432:+   **And** `profile.city` devient `France · Remote` (suppression définitive de `Rouen, France`)
docs/implementation-artifacts/code-reviews/12-1/full.diff:440:+3. **Given** la collection des projets vitrines `SITE.projects`
docs/implementation-artifacts/code-reviews/12-1/full.diff:446:+   **And** les anciens projets (`Keova App`, `TryOn`, `Nodium`) sont conservés dans `SITE.legacyProjects` (ou export typé équivalent) pour préserver l'historique et le parcours
docs/implementation-artifacts/code-reviews/12-1/full.diff:450:+4. **Given** les composants consommateurs existants (`app/components/FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`, `app/components/CurrentTime.vue`, `app/components/home/HomeHeroTerminal.vue`, `app/pages/about.vue`, `app/pages/index.vue`)
docs/implementation-artifacts/code-reviews/12-1/full.diff:451:+   **When** les composants lisent `SITE.profile` et `SITE.projects`
docs/implementation-artifacts/code-reviews/12-1/full.diff:453:+   **And** `FooterComponent.vue` affiche la nouvelle tagline `Développeur Full Stack spécialisé en systèmes IA & automatisation métier. France · Remote.` et liste les 3 projets avec la classe `.ftr__link--static` sans lien 404
docs/implementation-artifacts/code-reviews/12-1/full.diff:454:+   **And** le terminal (`Projets.ts`) formate correctement les noms, statuts et descriptions sans générer de lien mort
docs/implementation-artifacts/code-reviews/12-1/full.diff:455:+   **And** `CurrentTime.vue` conserve un `aria-label` valide `Heure locale (France · Remote) : ...`.
docs/implementation-artifacts/code-reviews/12-1/full.diff:464:+  - [x] Mettre à jour `profile.role` avec `Développeur Full Stack spécialisé en systèmes IA & automatisation métier`.
docs/implementation-artifacts/code-reviews/12-1/full.diff:465:+  - [x] Mettre à jour `profile.city` avec `France · Remote`.
docs/implementation-artifacts/code-reviews/12-1/full.diff:468:+  - [x] Déclarer `legacyProjects` pour conserver Keova App (corrigé sans « ERP équestre »), TryOn et Nodium (corrigé sans « Ingénieur IA »).
docs/implementation-artifacts/code-reviews/12-1/full.diff:469:+  - [x] Exporter `legacyProjects` dans l'objet `SITE`.
docs/implementation-artifacts/code-reviews/12-1/full.diff:473:+  - [x] Vérifier `app/components/terminal/programs/Projets.ts` (affichage propre des statuts et descriptions).
docs/implementation-artifacts/code-reviews/12-1/full.diff:474:+  - [x] Vérifier `app/components/CurrentTime.vue` (aria-label avec `France · Remote`).
docs/implementation-artifacts/code-reviews/12-1/full.diff:475:+  - [x] Vérifier `app/components/home/HomeHeroTerminal.vue` (formatage de `projectsOutput` : `keova-signal/ debrief/ devis-assist/`).
docs/implementation-artifacts/code-reviews/12-1/full.diff:476:+  - [x] Vérifier `app/pages/about.vue` pour assurer la résolution correcte de `keovaProject` via `SITE.projects` ou `SITE.legacyProjects`.
docs/implementation-artifacts/code-reviews/12-1/full.diff:491:+- **Préservation des anciens projets :** Les anciens projets (Keova App, TryOn, Nodium) ne doivent pas être détruits. Ils sont simplement déplacés dans une propriété `legacyProjects` afin que `about.vue` ou les futures pages de parcours continuent de fonctionner sans rupture. [Source: docs/specs/spec-repositionnement-ia/projects-showcase.md#Section 2]
docs/implementation-artifacts/code-reviews/12-1/full.diff:519:+- `app/data/site.ts` mis à jour avec le nouveau profil (« Développeur Full Stack spécialisé en systèmes IA & automatisation métier », localisation « France · Remote »), les compétences ordonnées ciblées IA & systèmes, les 3 projets phares de l'Offre V1 (Keova Signal, Debrief, Devis-Assist) sans lien sortant privé, et `legacyProjects` assaini sans mention « ERP équestre » ni « Ingénieur IA ».
docs/implementation-artifacts/code-reviews/12-1/full.diff:520:+- `app/pages/about.vue` adapté pour résoudre le projet Keova depuis `SITE.legacyProjects` ou `SITE.projects` de manière résiliente.
docs/implementation-artifacts/code-reviews/12-1/full.diff:522:+- `app/components/terminal/programs/About.ts` aligné sur `SITE.profile.role`.
docs/implementation-artifacts/code-reviews/12-1/full.diff:536:+- 2026-09-16 : Implémentation complète de la Story 12.1 — Refonte de la source unique de données `site.ts`, intégration des 3 projets phares de l'Offre V1, déclaration de `legacyProjects`, assainissement sémantique et validation Docker 100% verte.
app/pages/about.vue:13:            <p class="about__role">{{ profile.role }}</p>
app/pages/about.vue:16:              {{ profile.city }}
app/pages/about.vue:102:const profile = SITE.profile;
app/pages/about.vue:104:const city = profile.city.split(",")[0]?.trim() ?? profile.city;
app/pages/about.vue:106:  SITE.legacyProjects.find((p) => p.name.toLowerCase().includes("keova") && p.url) ??
app/pages/about.vue:107:  SITE.projects.find((p) => p.name.toLowerCase().includes("keova"));
app/pages/about.vue:152:    name: SITE.profile.name,
app/pages/about.vue:153:    jobTitle: SITE.profile.role,
app/pages/about.vue:156:    email: SITE.profile.email,
app/pages/about.vue:159:      addressLocality: SITE.profile.city,
app/pages/blog/[...slug].vue:134:      name: SITE.profile.name,
app/pages/blog/[...slug].vue:140:      name: SITE.profile.name,
app/pages/blog/index.vue:123:      name: SITE.profile.name,
app/pages/blog/index.vue:129:      name: SITE.profile.name,
app/pages/services.vue:152:          name: SITE.profile.name,
app/pages/mentions-legales.vue:20:              Activité : {{ profile.role }}<br />
app/pages/mentions-legales.vue:21:              Localisation : {{ profile.city }}<br />
app/pages/mentions-legales.vue:95:const profile = SITE.profile;
app/pages/contact/card.vue:14:              <p class="vcard__role">{{ profile.role }}</p>
app/pages/contact/card.vue:84:const profile = SITE.profile;
app/pages/contact/card.vue:91:  jobTitle: profile.role,
app/pages/contact/card.vue:98:    addressLocality: profile.city,
app/pages/contact/index.vue:154:const contact = SITE.profile;
app/pages/contact/index.vue:172:const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;
app/pages/contact/index.vue:276:    name: SITE.profile.name,
app/pages/contact/index.vue:277:    email: SITE.profile.email,
app/pages/contact/index.vue:280:      addressLocality: SITE.profile.city,
app/pages/confidentialite.vue:19:              {{ profile.role }} — {{ profile.city }}.<br />
app/pages/confidentialite.vue:155:const profile = SITE.profile;
app/pages/index.vue:24:              <template v-if="SITE.profile.maltUrl">
app/pages/index.vue:26:                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
app/pages/index.vue:87:    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
app/pages/index.vue:216:              v-if="SITE.profile.maltUrl"
app/pages/index.vue:218:              :href="SITE.profile.maltUrl"
app/pages/index.vue:234:// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
app/pages/index.vue:350:// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
app/pages/index.vue:351:const projects = SITE.projects;
app/pages/index.vue:372:    description: SITE.profile.role,
app/pages/index.vue:377:    name: SITE.profile.name,
app/pages/index.vue:378:    jobTitle: SITE.profile.role,
app/pages/index.vue:381:    email: SITE.profile.email,
app/pages/index.vue:384:      addressLocality: SITE.profile.city,
app/pages/index.vue:667:// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
app/app.vue:18:  name: SITE.profile.name,
app/app.vue:21:  email: SITE.profile.email,
app/app.vue:24:    addressLocality: SITE.profile.city,
app/components/HeaderComponent.vue:53:      <CurrentTime class="hdr__dock-clock" />
app/components/HeaderComponent.vue:79:          <CurrentTime class="hdr__menu-clock" />
app/components/FooterComponent.vue:10:          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
app/components/FooterComponent.vue:15:          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
app/components/FooterComponent.vue:19:          <h2 class="ftr__title">// Projets</h2>
app/components/FooterComponent.vue:22:              <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
app/components/FooterComponent.vue:25:              <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
app/components/FooterComponent.vue:61:const profile = SITE.profile;
app/components/FooterComponent.vue:62:// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
app/components/FooterComponent.vue:63:const projects = SITE.projects;
app/components/FooterComponent.vue:162:.ftr__link {
app/components/FooterComponent.vue:221:  .ftr__link {
app/data/site.ts:6:// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
app/data/site.ts:88:const legacyProjects: IProject[] = [
app/data/site.ts:113:export const SITE = { profile, skills, projects, legacyProjects } as const;
app/components/home/HomeHeroTerminal.vue:106:const projectsOutput = SITE.projects
app/components/home/HomeHeroTerminal.vue:118:    out: `${SITE.profile.name} — ${SITE.profile.role}`,
app/components/home/HomeHeroTerminal.vue:128:    out: projectsOutput,
app/components/CurrentTime.vue:22:  return `Heure locale (${SITE.profile.city}) : ${hours.value}h${minutes.value}`;
app/components/terminal/programs/Projets.ts:13:// Projets — source unique `app/data/site.ts`. Rendu en `<ul>` (cohérent avec `help`/`system-info`) :
app/components/terminal/programs/Projets.ts:19:    const items = SITE.projects
app/components/terminal/programs/About.ts:66:    poste: SITE.profile.role,
app/components/terminal/programs/About.ts:68:    ville: SITE.profile.city,
app/components/terminal/programs/About.ts:70:    email: SITE.profile.email,
app/components/terminal/programs/index.ts:7:export { default as projets } from "./Projets";
app/components/terminal/programs/Contact.ts:10:    const statut = SITE.profile.available ? "disponible pour de nouveaux projets" : "indisponible pour le moment";
app/components/terminal/programs/Contact.ts:13:      `<li>email : ${SITE.profile.email}</li>`,
app/components/terminal/programs/Contact.ts:14:      `<li>ville : ${SITE.profile.city}</li>`,

codex
Le diff ne modifie pas plusieurs consommateurs explicitement nommés par l’AC4; je les lis dans l’état courant pour vérifier si le changement de données suffit réellement ou si un comportement reste figé.
exec
/bin/zsh -lc "sed -n '1,190p' app/components/terminal/programs/Projets.ts" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,180p' app/components/home/HomeHeroTerminal.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
import { SITE } from "~/data/site";
import type { IProgram } from "~/components/terminal/interfaces";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Projets — source unique `app/data/site.ts`. Rendu en `<ul>` (cohérent avec `help`/`system-info`) :
// les `<li>` portent les retours à la ligne sous `white-space: normal`.
const projets: IProgram = {
  command: "projets",
  description: "Mes projets.",
  run: function (): string {
    const items = SITE.projects
      .map((p) => {
        const status = p.status ? ` [${escapeHtml(p.status)}]` : "";
        const url = p.url ? ` (${escapeHtml(p.url)})` : "";
        return `<li>${escapeHtml(p.name)} — ${escapeHtml(p.role)} — ${escapeHtml(p.desc)}${status}${url}</li>`;
      })
      .join("");
    return `<ul>${items}</ul>`;
  },
};

export default projets;

 succeeded in 0ms:
<template>
  <div class="hero-term">
    <div class="hero-term__bar">
      <span class="hero-term__dots" aria-hidden="true">
        <span class="hero-term__dot hero-term__dot--close" />
        <span class="hero-term__dot hero-term__dot--min" />
        <span class="hero-term__dot hero-term__dot--max" />
      </span>
      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
    </div>

    <div class="hero-term__body">
      <!-- Lignes complètes terminées -->
      <template v-for="(row, idx) in executedRows" :key="idx">
        <p class="hero-term__line" aria-hidden="true">
          <span class="prm">
            <span class="prm__user">anon.@jouan.ovh</span>
            <span class="prm__sep">:</span>
            <span class="prm__dir">~</span>
            <span class="prm__sep">$ </span>
            <span class="prm__cmd">{{ row.cmd }}</span>
          </span>
        </p>
        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
      </template>

      <!-- Ligne en cours de frappe -->
      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
        <span class="prm">
          <span class="prm__user">anon.@jouan.ovh</span>
          <span class="prm__sep">:</span>
          <span class="prm__dir">~</span>
          <span class="prm__sep">$ </span>
          <span class="prm__cmd">{{ currentTypingText }}</span>
          <span class="prm__caret" />
        </span>
      </p>

      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
      <button
        v-if="isSequenceComplete"
        type="button"
        class="hero-term__open"
        aria-label="Ouvrir le terminal interactif"
        aria-haspopup="dialog"
        @click="openTerminal"
      >
        <span class="prm">
          <span class="prm__user">anon.@jouan.ovh</span>
          <span class="prm__sep">:</span>
          <span class="prm__dir">~</span>
          <span class="prm__sep">$ </span>
          <span class="prm__cmd">help</span>
          <span class="prm__caret" aria-hidden="true" />
        </span>
      </button>

      <!-- Fallback statique si JavaScript est désactivé -->
      <noscript>
        <div>
          <template v-for="(row, idx) in fullRows" :key="`noscript-${idx}`">
            <p class="hero-term__line">
              <span class="prm">
                <span class="prm__user">anon.@jouan.ovh</span>
                <span class="prm__sep">:</span>
                <span class="prm__dir">~</span>
                <span class="prm__sep">$ </span>
                <span class="prm__cmd">{{ row.cmd }}</span>
              </span>
            </p>
            <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
          </template>
        </div>
      </noscript>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useTerminal } from "~/composables/useTerminal";
import { SITE } from "~/data/site";

// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.

const props = withDefaults(
  defineProps<{
    autoStart?: boolean;
  }>(),
  {
    autoStart: true,
  },
);

const { open: openTerminal } = useTerminal();

interface ITermRow {
  cmd: string;
  out: string;
  tone: "ink" | "blue" | "green";
}

const projectsOutput = SITE.projects
  .map((p) => {
    if (p.url) {
      return `${p.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}/`;
    }
    return `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`;
  })
  .join("  ");

const fullRows: ITermRow[] = [
  {
    cmd: "whoami",
    out: `${SITE.profile.name} — ${SITE.profile.role}`,
    tone: "ink",
  },
  {
    cmd: "cat focus.txt",
    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
    tone: "blue",
  },
  {
    cmd: "ls ~/projets",
    out: projectsOutput,
    tone: "green",
  },
];

const executedRows = ref<ITermRow[]>([]);
const currentTypingLine = ref<ITermRow | null>(null);
const currentTypingText = ref("");
const isSequenceComplete = ref(false);

let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
let motionMq: MediaQueryList | null = null;
let isStarted = false;

function showInstantState() {
  executedRows.value = [...fullRows];
  currentTypingLine.value = null;
  currentTypingText.value = "";
  isSequenceComplete.value = true;
}

function startTypingSequence() {
  if (isStarted) return;
  isStarted = true;

  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    showInstantState();
    return;
  }

  let rowIndex = 0;

  function typeRow() {
    if (rowIndex >= fullRows.length) {
      currentTypingLine.value = null;
      currentTypingText.value = "";
      isSequenceComplete.value = true;
      return;
    }

    const row = fullRows[rowIndex];
    if (!row) return;

    const activeRow: ITermRow = row;
    currentTypingLine.value = activeRow;
    currentTypingText.value = "";

    let charIndex = 0;
    const fullCmd = activeRow.cmd;


exec
/bin/zsh -lc "sed -n '1,90p' app/components/FooterComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <footer class="ftr">
    <div class="ftr__container">
      <div class="ftr__in">
        <div class="ftr__brand-col">
          <NuxtLink to="/" class="ftr__brand">
            <NuxtImg src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
            <span><b>jouan</b><span class="dim">.ovh</span></span>
          </NuxtLink>
          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
        </div>

        <nav class="ftr__col" aria-label="Navigation du pied de page">
          <h2 class="ftr__title">// Navigation</h2>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
        </nav>

        <div class="ftr__col">
          <h2 class="ftr__title">// Projets</h2>
          <ul class="ftr__list">
            <li v-for="project in projects" :key="project.name">
              <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
                project.name
              }}</ZExternalLink>
              <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
            </li>
          </ul>
        </div>

        <div class="ftr__col">
          <h2 class="ftr__title">// Réseaux</h2>
          <LinkListComponent />
        </div>
      </div>
    </div>

    <!-- Barre basse pleine largeur (border-top 100% de la fenêtre) -->
    <div class="ftr__bottom-bar">
      <div class="ftr__container ftr__bottom">
        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LinkListComponent from "~/components/LinkListComponent.vue";
import { SITE } from "~/data/site";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/confidentialite", label: "Confidentialité" },
  { to: "/mentions-legales", label: "Mentions légales" },
];

const profile = SITE.profile;
// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
const projects = SITE.projects;

const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
.ftr {
  position: relative;
  z-index: 10;
  margin-top: auto;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 0;
}

.ftr__container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.ftr__in {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: flex-start;

exec
/bin/zsh -lc "sed -n '1,60p' app/components/CurrentTime.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <time class="current-time" :datetime="currentTimeIso" :aria-label="timeAriaLabel">
    <span class="current-time__hours">{{ hours }}</span>
    <span class="current-time__colon" aria-hidden="true">:</span>
    <span class="current-time__minutes">{{ minutes }}</span>
  </time>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { SITE } from "~/data/site";

const hours = ref("--");
const minutes = ref("--");
const currentTimeIso = ref("");

const timeAriaLabel = computed(() => {
  if (hours.value === "--") {
    return "Heure locale";
  }
  return `Heure locale (${SITE.profile.city}) : ${hours.value}h${minutes.value}`;
});

function updateTime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  }).formatToParts(now);

  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "";
  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "";

  hours.value = hourPart.padStart(2, "0");
  minutes.value = minutePart.padStart(2, "0");
  currentTimeIso.value = now.toISOString();
}

const interval: Ref<ReturnType<typeof setInterval> | null> = ref(null);

onMounted(() => {
  updateTime();
  interval.value = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (interval.value !== null) {
    clearInterval(interval.value);
  }
});
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern -- convention BEM */
.current-time {
  display: inline-flex;
  align-items: center;

codex
- **Home hero terminal remains on the old positioning** — Violates Story 12.1 AC4 consumer coherence and `messaging-matrix.md` §4.2. Evidence: `full.diff` contains no code hunk for `app/components/home/HomeHeroTerminal.vue`, even though the story marks verification of `projectsOutput`; the current component still outputs `cat focus.txt` as `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering` and uses `ls ~/projets` instead of `ls ~/systems`.

- **`About.ts` still hardcodes profile identity data** — Violates AGENTS/project-context DRY constraint: `app/data/site.ts` must be the single source for profile data. Evidence from diff: `app/components/terminal/programs/About.ts` changes only `poste` to `SITE.profile.role`, while nearby unchanged lines still hardcode `firstname: "Simon"`, `lastname: "JOUAN"`, and `telephone: "+33 6 58 96 90 20"`.

- **Stack omits context-specified `Mistral OCR` / `Node.js 22` wording** — Deviates from `docs/planning-artifacts/epics.md` Story 12.1 context stack, which lists `Node.js 22` and `Mistral OCR`. Evidence from diff: `SITE.skills` becomes `"node.js"` and does not include any `mistral-ocr` / `Mistral OCR` entry.

- **Validation evidence contradicts the required prerender count** — Violates AC5 / NFR16 requiring 13 static routes pre-rendered. Evidence from diff: the story’s Dev Agent Record says `20 routes et assets statiques pré-rendus par Nitro SSG`, while AC5 in the same diff requires `13 routes statiques pré-rendues`.
tokens used
36 847
- **Home hero terminal remains on the old positioning** — Violates Story 12.1 AC4 consumer coherence and `messaging-matrix.md` §4.2. Evidence: `full.diff` contains no code hunk for `app/components/home/HomeHeroTerminal.vue`, even though the story marks verification of `projectsOutput`; the current component still outputs `cat focus.txt` as `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering` and uses `ls ~/projets` instead of `ls ~/systems`.

- **`About.ts` still hardcodes profile identity data** — Violates AGENTS/project-context DRY constraint: `app/data/site.ts` must be the single source for profile data. Evidence from diff: `app/components/terminal/programs/About.ts` changes only `poste` to `SITE.profile.role`, while nearby unchanged lines still hardcode `firstname: "Simon"`, `lastname: "JOUAN"`, and `telephone: "+33 6 58 96 90 20"`.

- **Stack omits context-specified `Mistral OCR` / `Node.js 22` wording** — Deviates from `docs/planning-artifacts/epics.md` Story 12.1 context stack, which lists `Node.js 22` and `Mistral OCR`. Evidence from diff: `SITE.skills` becomes `"node.js"` and does not include any `mistral-ocr` / `Mistral OCR` entry.

- **Validation evidence contradicts the required prerender count** — Violates AC5 / NFR16 requiring 13 static routes pre-rendered. Evidence from diff: the story’s Dev Agent Record says `20 routes et assets statiques pré-rendus par Nitro SSG`, while AC5 in the same diff requires `13 routes statiques pré-rendues`.

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
session id: 01a0abe2-0b93-7353-a086-c11d62be1448
--------
user
# Acceptance Auditor Prompt — Story 12.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md`
- Context specs: `docs/specs/spec-repositionnement-ia/SPEC.md`, `docs/specs/spec-repositionnement-ia/messaging-matrix.md`, `docs/planning-artifacts/epics.md` (Epic 12 / Story 12.2), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/12-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’ll use the `bmad-code-review` skill for this audit, then read the story/spec context and the provided diff end to end before listing findings.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
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
The project skill contains a checkpoint-heavy workflow, but your instruction is explicit: I’ll keep the useful adversarial review posture and complete the audit without stopping for intermediate confirmation.
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
---

# Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect découvrant la page d'accueil,
I want lire immédiatement une promesse orientée vers la résolution de mes irritants métier et voir un terminal interactif cohérent,
so that je comprends en 5 secondes ce que Simon apporte à mon équipe (FR29, NFR13, NFR15, UX-DR28).

## Acceptance Criteria

1. **Given** la section Hero de la page d'accueil `app/pages/index.vue`
   **When** le composant est monté et rendu
   **Then** le sur-titre est balisé sémantiquement en `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`
   **And** le titre principal `<h1>` affiche `Automatisez les workflows qui freinent votre équipe.`
   **And** le paragraphe d'introduction `.hero__sub` affiche `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`
   **And** une ligne de crédibilité technique `.hero__credibility` affiche `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`
   **And** le badge de disponibilité affiche le signal pulsant avec le libellé `Disponible pour nouvelles missions freelance` et conserve le lien profil Malt vérifié via `<ZExternalLink>`
   **And** le CTA principal `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">` affiche `Identifier un workflow à automatiser` avec l'icône flèche
   **And** le CTA secondaire `<ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg">` affiche `Voir mes systèmes IA` (redirigeant vers la page `/services` ou ancre dédiée).

2. **Given** le composant `app/components/home/HomeHeroTerminal.vue`
   **When** la séquence cinétique de frappe est déroulée (ou affichée instantanément sous reduced-motion)
   **Then** la première commande exécutée est `$ whoami` avec la sortie `${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation` (ton `ink`)
   **And** la deuxième commande exécutée est `$ cat focus.txt` avec la sortie `Systèmes IA · automatisation métier · agents · applications Full Stack · QA` (ton `blue`)
   **And** la troisième commande exécutée est `$ ls ~/systems` (remplaçant définitivement `$ ls ~/projets`) avec la sortie `keova-signal/ debrief/ devis-assist/` issue dynamiquement de `SITE.projects` (ton `green`)
   **And** l'invite finale `$ help` avec caret interactif permet d'ouvrir le terminal modal complet via `useTerminal().open()` sans régression
   **And** le bloc de repli statique `<noscript>` reproduit fidèlement les 3 nouvelles commandes et sorties pour les clients sans JavaScript.

3. **Given** l'accessibilité et la cohérence visuelle
   **When** l'utilisateur navigue au clavier ou avec un lecteur d'écran
   **Then** l'ordre de focus est séquentiel et naturel (CTA principal -> CTA secondaire -> terminal hero -> ruban stack)
   **And** aucun emoji n'est injecté dans les contenus ou l'UI (NFR6 / NFR13)
   **And** sous `prefers-reduced-motion: reduce`, l'animation de frappe est immédiatement contournée (`showInstantState()`) affichant l'état terminal complet sans délai.

4. **Given** l'ensemble des modifications de la story
   **When** on lance la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques (+ assets) pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte textuelle et sémantique du Hero dans `app/pages/index.vue` (AC: 1, 3)
  - [x] Remplacer le sur-titre par `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
  - [x] Mettre à jour le `<h1>` avec `Automatisez les workflows qui freinent votre équipe.`.
  - [x] Mettre à jour `.hero__sub` avec le nouveau pitch d'intégration de systèmes.
  - [x] Ajouter la ligne de crédibilité `.hero__credibility` sous le sous-titre avec les tokens de typographie monospace / muted.
  - [x] Mettre à jour le badge de disponibilité avec `Disponible pour nouvelles missions freelance` tout en conservant le lien Malt externe.
  - [x] Mettre à jour le CTA principal (`/contact`) : `Identifier un workflow à automatiser`.
  - [x] Mettre à jour le CTA secondaire (`/services`) : `Voir mes systèmes IA`.

- [x] Tâche 2 — Mise à jour de la séquence et des commandes dans `HomeHeroTerminal.vue` (AC: 2, 3)
  - [x] Mettre à jour le tableau `fullRows` :
    - `cmd: "whoami"`, `out: "${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation"`, `tone: "ink"`
    - `cmd: "cat focus.txt"`, `out: "Systèmes IA · automatisation métier · agents · applications Full Stack · QA"`, `tone: "blue"`
    - `cmd: "ls ~/systems"`, `out: projectsOutput`, `tone: "green"`
  - [x] Vérifier que `projectsOutput` formate correctement les slugs des projets de `SITE.projects` (`keova-signal/  debrief/  devis-assist/`).
  - [x] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
  - [x] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
  - [x] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.

- [x] Tâche 3 — Validation responsive, accessibilité et design tokens (AC: 1, 2, 3)
  - [x] Vérifier le rendu sur mobile et desktop (pas de débordement de texte, wrapping correct des CTAs).
  - [x] Vérifier la conformité de la hiérarchie de titres (`<h2>` eyebrow -> `<h1>`).
  - [x] Vérifier l'absence absolue d'emoji dans les textes.

- [x] Tâche 4 — Validation qualité Docker (AC: 4)
  - [x] Exécuter `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et génération SSG Nitro complète.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Ne jamais exécuter `pnpm` sur l'hôte macOS. Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker : `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. [Source: AGENTS.md#Section 2]
- **DRY & Source unique :** `app/data/site.ts` est la seule et unique source de vérité pour le profil et les projets. Les libellés dynamiques du terminal et de la home consomment `SITE.profile` et `SITE.projects`. [Source: AGENTS.md#Section 5.2]
- **Accessibilité & Sémantique :**
  - Tout lien ouvrant un nouvel onglet utilise `<ZExternalLink>`.
  - Le sur-titre sans h2 propre doit être un `<h2 class="eyebrow">` avec `<span aria-hidden="true">// </span>`.
  - Les boutons vers les routes internes Nuxt utilisent `<ZButton :as="NuxtLink" to="...">` pour éviter l'échec de résolution de composants dynamiques chaînés. [Source: AGENTS.md#Section 5.4 et 5.5]
- **Zéro Emoji :** Règle stricte NFR6 / NFR13. Aucune icône emoji dans le DOM.

### Fichiers concernés
- [MODIFY] [app/pages/index.vue](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
- [MODIFY] [app/components/home/HomeHeroTerminal.vue](file:///Users/simon/dev/jouan.ovh/app/components/home/HomeHeroTerminal.vue)

### Ce qui doit être préservé
- `HomeBootOverlay` et son écouteur `@boot-complete="onBootComplete"`.
- L'arrière-plan interactif `HomeAtmosComponent` et le micro-curseur `ZCustomCursor`.
- L'intégration du ruban `HomeStackMarquee` sous le hero.
- Le cycle de frappe avec `useTerminal()` dans `HomeHeroTerminal.vue`.

### Références
- Cahier des charges et critères d'acceptation : [docs/planning-artifacts/epics.md#Story-12.2](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- Spécification canonique : [docs/specs/spec-repositionnement-ia/SPEC.md#CAP-2](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/SPEC.md)
- Charte éditoriale & terminal : [docs/specs/spec-repositionnement-ia/messaging-matrix.md#Section-4.1-Homepage](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-repositionnement-ia/messaging-matrix.md)
- Invariants d'implémentation : [AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Gate de validation Docker complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 20 routes et assets Nitro pré-rendus avec succès).
- Résolution du formatage Prettier sous `app/pages/index.vue` via `eslint --fix .`.
- Redémarrage propre du conteneur web pour synchronisation de la base SQLite @nuxt/content (`docker compose restart web`).

### Completion Notes List
- ✅ **AC-1 :** Section Hero mise à jour dans `app/pages/index.vue` :
  - Sur-titre sémantique `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
  - H1 : `Automatisez les workflows qui freinent votre équipe.`.
  - Sous-titre : `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`.
  - Ligne de crédibilité `.hero__credibility` : `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`.
  - Badge de disponibilité : `Disponible pour nouvelles missions freelance` + lien profil Malt vérifié via `<ZExternalLink>`.
  - CTAs : `Identifier un workflow à automatiser` (`/contact`) et `Voir mes systèmes IA` (`/services`).
- ✅ **AC-2 :** Terminal Hero cinétique mis à jour dans `HomeHeroTerminal.vue` :
  - Commande `$ whoami` -> `${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation` (ton `ink`).
  - Commande `$ cat focus.txt` -> `Systèmes IA · automatisation métier · agents · applications Full Stack · QA` (ton `blue`).
  - Commande `$ ls ~/systems` -> `keova-signal/  debrief/  devis-assist/` dérivé de `SITE.projects` (ton `green`).
  - Bloc `<noscript>` et état reduced-motion synchronisés avec les nouvelles sorties.
  - Interaction d'ouverture modal `$ help` (`useTerminal().open()`) préservée.
- ✅ **AC-3 :** Accessibilité, hiérarchie de titres, ordre de focus et règle stricte Zéro Emoji validés.
- ✅ **AC-4 :** Gate de validation Docker 100 % verte.

### File List
- `app/pages/index.vue` (modifié)
- `app/components/home/HomeHeroTerminal.vue` (modifié)
- `docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)

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
I’ve got the story contract and the canonical wording. Next I’m pulling the Epic 12 section, project invariants, and the actual diff so the findings are tied to evidence rather than vibes.
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/12-2/full.diff" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n \"Story 12\\.2|Epic 12|12\\.2|homepage hero|Hero\" docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
index 83b79b4..4b97174 100644
--- a/app/components/home/HomeHeroTerminal.vue
+++ b/app/components/home/HomeHeroTerminal.vue
@@ -81,8 +81,8 @@ import { ref, watch, onMounted, onUnmounted } from "vue";
 import { useTerminal } from "~/composables/useTerminal";
 import { SITE } from "~/data/site";
 
-// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
-// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
+// Terminal hero cinétique (Story 11.2 / 12.2 / AC-2 / CAP-2).
+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/systems.
 // Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
 // Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
 
@@ -115,16 +115,16 @@ const projectsOutput = SITE.projects
 const fullRows: ITermRow[] = [
   {
     cmd: "whoami",
-    out: `${SITE.profile.name} — ${SITE.profile.role}`,
+    out: `${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation`,
     tone: "ink",
   },
   {
     cmd: "cat focus.txt",
-    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
+    out: "Systèmes IA · automatisation métier · agents · applications Full Stack · QA",
     tone: "blue",
   },
   {
-    cmd: "ls ~/projets",
+    cmd: "ls ~/systems",
     out: projectsOutput,
     tone: "green",
   },
diff --git a/app/pages/index.vue b/app/pages/index.vue
index c513732..7cac3e1 100644
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
 
@@ -464,7 +469,7 @@ usePageSeo({
 
 .hero__sub {
   max-width: 46ch;
-  margin: var(--space-5) 0 var(--space-6);
+  margin: var(--space-5) 0 var(--space-4);
   font-family: var(--font-sans);
   font-size: var(--fs-lg);
   line-height: var(--lh-relaxed);
@@ -472,6 +477,14 @@ usePageSeo({
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
diff --git a/docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md b/docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md
index 3f0b722..a1abbb2 100644
--- a/docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md
+++ b/docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md
@@ -1,6 +1,10 @@
+---
+baseline_commit: c7136c64cd1a9dd3de9b7a6689a26000a217af56
+---
+
 # Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -42,33 +46,33 @@ so that je comprends en 5 secondes ce que Simon apporte à mon équipe (FR29, NF
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Refonte textuelle et sémantique du Hero dans `app/pages/index.vue` (AC: 1, 3)
-  - [ ] Remplacer le sur-titre par `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
-  - [ ] Mettre à jour le `<h1>` avec `Automatisez les workflows qui freinent votre équipe.`.
-  - [ ] Mettre à jour `.hero__sub` avec le nouveau pitch d'intégration de systèmes.
-  - [ ] Ajouter la ligne de crédibilité `.hero__credibility` sous le sous-titre avec les tokens de typographie monospace / muted.
-  - [ ] Mettre à jour le badge de disponibilité avec `Disponible pour nouvelles missions freelance` tout en conservant le lien Malt externe.
-  - [ ] Mettre à jour le CTA principal (`/contact`) : `Identifier un workflow à automatiser`.
-  - [ ] Mettre à jour le CTA secondaire (`/services`) : `Voir mes systèmes IA`.
-
-- [ ] Tâche 2 — Mise à jour de la séquence et des commandes dans `HomeHeroTerminal.vue` (AC: 2, 3)
-  - [ ] Mettre à jour le tableau `fullRows` :
+- [x] Tâche 1 — Refonte textuelle et sémantique du Hero dans `app/pages/index.vue` (AC: 1, 3)
+  - [x] Remplacer le sur-titre par `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
+  - [x] Mettre à jour le `<h1>` avec `Automatisez les workflows qui freinent votre équipe.`.
+  - [x] Mettre à jour `.hero__sub` avec le nouveau pitch d'intégration de systèmes.
+  - [x] Ajouter la ligne de crédibilité `.hero__credibility` sous le sous-titre avec les tokens de typographie monospace / muted.
+  - [x] Mettre à jour le badge de disponibilité avec `Disponible pour nouvelles missions freelance` tout en conservant le lien Malt externe.
+  - [x] Mettre à jour le CTA principal (`/contact`) : `Identifier un workflow à automatiser`.
+  - [x] Mettre à jour le CTA secondaire (`/services`) : `Voir mes systèmes IA`.
+
+- [x] Tâche 2 — Mise à jour de la séquence et des commandes dans `HomeHeroTerminal.vue` (AC: 2, 3)
+  - [x] Mettre à jour le tableau `fullRows` :
     - `cmd: "whoami"`, `out: "${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation"`, `tone: "ink"`
     - `cmd: "cat focus.txt"`, `out: "Systèmes IA · automatisation métier · agents · applications Full Stack · QA"`, `tone: "blue"`
     - `cmd: "ls ~/systems"`, `out: projectsOutput`, `tone: "green"`
-  - [ ] Vérifier que `projectsOutput` formate correctement les slugs des projets de `SITE.projects` (`keova-signal/  debrief/  devis-assist/`).
-  - [ ] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
-  - [ ] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
-  - [ ] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.
+  - [x] Vérifier que `projectsOutput` formate correctement les slugs des projets de `SITE.projects` (`keova-signal/  debrief/  devis-assist/`).
+  - [x] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
+  - [x] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
+  - [x] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.
 
-- [ ] Tâche 3 — Validation responsive, accessibilité et design tokens (AC: 1, 2, 3)
-  - [ ] Vérifier le rendu sur mobile et desktop (pas de débordement de texte, wrapping correct des CTAs).
-  - [ ] Vérifier la conformité de la hiérarchie de titres (`<h2>` eyebrow -> `<h1>`).
-  - [ ] Vérifier l'absence absolue d'emoji dans les textes.
+- [x] Tâche 3 — Validation responsive, accessibilité et design tokens (AC: 1, 2, 3)
+  - [x] Vérifier le rendu sur mobile et desktop (pas de débordement de texte, wrapping correct des CTAs).
+  - [x] Vérifier la conformité de la hiérarchie de titres (`<h2>` eyebrow -> `<h1>`).
+  - [x] Vérifier l'absence absolue d'emoji dans les textes.
 
-- [ ] Tâche 4 — Validation qualité Docker (AC: 4)
-  - [ ] Exécuter `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et génération SSG Nitro complète.
+- [x] Tâche 4 — Validation qualité Docker (AC: 4)
+  - [x] Exécuter `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et génération SSG Nitro complète.
 
 ## Dev Notes
 
@@ -100,9 +104,32 @@ so that je comprends en 5 secondes ce que Simon apporte à mon équipe (FR29, NF
 ## Dev Agent Record
 
 ### Agent Model Used
+- Gemini 3.7 Flash
 
 ### Debug Log References
+- Gate de validation Docker complète : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 20 routes et assets Nitro pré-rendus avec succès).
+- Résolution du formatage Prettier sous `app/pages/index.vue` via `eslint --fix .`.
+- Redémarrage propre du conteneur web pour synchronisation de la base SQLite @nuxt/content (`docker compose restart web`).
 
 ### Completion Notes List
+- ✅ **AC-1 :** Section Hero mise à jour dans `app/pages/index.vue` :
+  - Sur-titre sémantique `<h2 class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA & AUTOMATISATION</h2>`.
+  - H1 : `Automatisez les workflows qui freinent votre équipe.`.
+  - Sous-titre : `Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production.`.
+  - Ligne de crédibilité `.hero__credibility` : `Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA`.
+  - Badge de disponibilité : `Disponible pour nouvelles missions freelance` + lien profil Malt vérifié via `<ZExternalLink>`.
+  - CTAs : `Identifier un workflow à automatiser` (`/contact`) et `Voir mes systèmes IA` (`/services`).
+- ✅ **AC-2 :** Terminal Hero cinétique mis à jour dans `HomeHeroTerminal.vue` :
+  - Commande `$ whoami` -> `${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation` (ton `ink`).
+  - Commande `$ cat focus.txt` -> `Systèmes IA · automatisation métier · agents · applications Full Stack · QA` (ton `blue`).
+  - Commande `$ ls ~/systems` -> `keova-signal/  debrief/  devis-assist/` dérivé de `SITE.projects` (ton `green`).
+  - Bloc `<noscript>` et état reduced-motion synchronisés avec les nouvelles sorties.
+  - Interaction d'ouverture modal `$ help` (`useTerminal().open()`) préservée.
+- ✅ **AC-3 :** Accessibilité, hiérarchie de titres, ordre de focus et règle stricte Zéro Emoji validés.
+- ✅ **AC-4 :** Gate de validation Docker 100 % verte.
 
 ### File List
+- `app/pages/index.vue` (modifié)
+- `app/components/home/HomeHeroTerminal.vue` (modifié)
+- `docs/implementation-artifacts/12-2-homepage-hero-commercial-cinetique-et-terminal-interactif.md` (modifié)
+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 15c84cd..88be376 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-16 (Story 12.2 initialisée en ready-for-dev)"
+last_updated: "2026-09-16 (Story 12.2 passée en review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -130,7 +130,7 @@ development_status:
   # Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier
   epic-12: in-progress
   12-1-source-unique-de-donnees-sitets-et-coherence-globale: done
-  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: ready-for-dev
+  12-2-homepage-hero-commercial-cinetique-et-terminal-interactif: review
   12-3-homepage-vitrine-des-3-services-et-bloc-differenciateur: backlog
   12-4-homepage-vitrine-des-3-projets-phares: backlog
   12-5-page-services-restructuration-des-offres-et-process-4-etapes: backlog

 succeeded in 0ms:
57:FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
66:#### Epic 12 — Repositionnement Commercial V1 : Systèmes IA & Automatisation Métier (SPEC-repositionnement-ia)
68:FR29: Page d'accueil — Hero commercial cinétique & Terminal interactif (H1 « Automatisez les workflows qui freinent votre équipe », sous-titre d'intégration de systèmes, CTAs vers workflow, commandes terminal `whoami`, `cat focus.txt`, `ls ~/systems`). _(CAP-2)_
128:UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
160:FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
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
400:### Story 3.1: Hero Terminal (A)
761:### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
772:**And** le Hero commercial affiche en typographie Ubuntu :
849:## Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
872:### Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif
880:**Given** la page d'accueil `app/pages/index.vue` et le composant `HomeHeroTerminal.vue`

exec
/bin/zsh -lc "rg -n \"NFR6|NFR13|NFR15|UX-DR28|Story 12\\.2|CAP-2|Hero|terminal|prefers-reduced-motion|ZExternalLink|emoji|Docker\" docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
24:- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
29:- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
31:- **Divers :** `ua-parser-js ^2` (détection device, terminal).
40:  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
70:  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
113:  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`, `ZCustomCursor`) — `<script setup>`,
119:  `HomeBootOverlay.vue` (boot interactif jouan.os), `HomeHeroTerminal.vue` (terminal Hero à frappe dynamique)
123:- Sous-système terminal sous `components/terminal/` : coquilles Vue
137:  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
139:  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_
144:  vouvoiement. Pas d'emoji (cf. guidelines du design system).
154:**Environnement de dev : Docker (obligatoire)**
156:- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
169:- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
183:  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
205:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
218:  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
219:  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
220:  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
221:  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
226:- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
230:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
231:  terminal.
247:- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
264:    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
266:    vérification du comportement clavier/motion/contraste sous émulation `forced-colors: active` et `prefers-reduced-motion: reduce`.
268:    1. **Revue visuelle et capture comparative obligatoire** : toute story comportant de l'UI doit être validée visuellement sur navigateur avant passage en review/done (la gate Docker seule ne protège pas du décalage d'ambiance visuelle).

exec
/bin/zsh -lc "sed -n '860,910p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

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

exec
/bin/zsh -lc "sed -n '1,220p' app/components/home/HomeHeroTerminal.vue" in /Users/simon/dev/jouan.ovh
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

// Terminal hero cinétique (Story 11.2 / 12.2 / AC-2 / CAP-2).
// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/systems.
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
    out: `${SITE.profile.name} — Développeur Full Stack spécialisé IA & automatisation`,
    tone: "ink",
  },
  {
    cmd: "cat focus.txt",
    out: "Systèmes IA · automatisation métier · agents · applications Full Stack · QA",
    tone: "blue",
  },
  {
    cmd: "ls ~/systems",
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

    function typeChar() {
      if (charIndex < fullCmd.length) {
        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
        charIndex++;
        typingTimeoutId = setTimeout(typeChar, 46);
      } else {
        // Commande entièrement tapée, afficher le résultat après une pause
        stepTimeoutId = setTimeout(() => {
          executedRows.value.push(activeRow);
          currentTypingLine.value = null;
          currentTypingText.value = "";
          rowIndex++;
          stepTimeoutId = setTimeout(typeRow, 280);
        }, 200);
      }
    }

    typeChar();
  }

  typeRow();
}

watch(
  () => props.autoStart,
  (shouldStart) => {
    if (shouldStart && !isStarted) {
      startTypingSequence();
    }
  },
);

function onMotionChange(e: MediaQueryListEvent) {
  if (e.matches) {
    if (typingTimeoutId !== null) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
    if (stepTimeoutId !== null) {
      clearTimeout(stepTimeoutId);

exec
/bin/zsh -lc "rg -n \"noscript|\\"'$ whoami|ls ~/systems|ls ~/projets|showInstantState|prefers-reduced-motion|openTerminal|help|tabindex|aria-haspopup" app/components/home/HomeHeroTerminal.vue app/pages/index.vue docs/implementation-artifacts/code-reviews/12-2/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue:254:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/pages/index.vue:529:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:1095:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/12-2/full.diff:10:-// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
docs/implementation-artifacts/code-reviews/12-2/full.diff:12:+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/systems.
docs/implementation-artifacts/code-reviews/12-2/full.diff:13: // Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
docs/implementation-artifacts/code-reviews/12-2/full.diff:14: // Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
docs/implementation-artifacts/code-reviews/12-2/full.diff:31:-    cmd: "ls ~/projets",
docs/implementation-artifacts/code-reviews/12-2/full.diff:32:+    cmd: "ls ~/systems",
docs/implementation-artifacts/code-reviews/12-2/full.diff:148:     - `cmd: "ls ~/systems"`, `out: projectsOutput`, `tone: "green"`
docs/implementation-artifacts/code-reviews/12-2/full.diff:150:-  - [ ] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
docs/implementation-artifacts/code-reviews/12-2/full.diff:151:-  - [ ] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
docs/implementation-artifacts/code-reviews/12-2/full.diff:152:-  - [ ] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/code-reviews/12-2/full.diff:154:+  - [x] Mettre à jour le bloc `<noscript>` pour refléter les nouvelles commandes et sorties textuelles.
docs/implementation-artifacts/code-reviews/12-2/full.diff:155:+  - [x] Vérifier que l'interaction d'ouverture du terminal (`openTerminal` sur `help`) fonctionne sans régression.
docs/implementation-artifacts/code-reviews/12-2/full.diff:156:+  - [x] Vérifier la neutralisation immédiate sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/code-reviews/12-2/full.diff:198:+  - Commande `$ ls ~/systems` -> `keova-signal/  debrief/  devis-assist/` dérivé de `SITE.projects` (ton `green`).
docs/implementation-artifacts/code-reviews/12-2/full.diff:199:+  - Bloc `<noscript>` et état reduced-motion synchronisés avec les nouvelles sorties.
docs/implementation-artifacts/code-reviews/12-2/full.diff:200:+  - Interaction d'ouverture modal `$ help` (`useTerminal().open()`) préservée.
app/components/home/HomeHeroTerminal.vue:45:        aria-haspopup="dialog"
app/components/home/HomeHeroTerminal.vue:46:        @click="openTerminal"
app/components/home/HomeHeroTerminal.vue:53:          <span class="prm__cmd">help</span>
app/components/home/HomeHeroTerminal.vue:59:      <noscript>
app/components/home/HomeHeroTerminal.vue:61:          <template v-for="(row, idx) in fullRows" :key="`noscript-${idx}`">
app/components/home/HomeHeroTerminal.vue:74:      </noscript>
app/components/home/HomeHeroTerminal.vue:85:// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/systems.
app/components/home/HomeHeroTerminal.vue:86:// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
app/components/home/HomeHeroTerminal.vue:87:// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
app/components/home/HomeHeroTerminal.vue:98:const { open: openTerminal } = useTerminal();
app/components/home/HomeHeroTerminal.vue:127:    cmd: "ls ~/systems",
app/components/home/HomeHeroTerminal.vue:143:function showInstantState() {
app/components/home/HomeHeroTerminal.vue:154:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:157:    showInstantState();
app/components/home/HomeHeroTerminal.vue:223:    showInstantState();
app/components/home/HomeHeroTerminal.vue:230:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeHeroTerminal.vue:235:    showInstantState();
app/components/home/HomeHeroTerminal.vue:405:@media (prefers-reduced-motion: reduce) {

codex
A likely gap is emerging around the `<noscript>` fallback: the diff marks it complete but the code hunk doesn’t actually replace it with static HTML. I’m checking whether that’s just okay because it binds to `fullRows`, or whether it violates the “clients sans JavaScript” part in practice.
exec
/bin/zsh -lc "sed -n '220,280p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
            <ZButton
              v-if="SITE.profile.maltUrl"
              :as="ZExternalLink"
              :href="SITE.profile.maltUrl"
              variant="secondary"
              size="lg"
              data-hot
            >
              Me contacter sur Malt
            </ZButton>
            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion.value = e.matches;
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onBootComplete() {
  isBootFinished.value = true;
}

function onProjectMouseMove(event: MouseEvent) {
  if (isReducedMotion.value) {
    return;
  }
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return;
  }
  const target = event.currentTarget as HTMLElement | null;
  if (!target) {
    return;
  }
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;

exec
/bin/zsh -lc "sed -n '200,260p' app/components/home/HomeHeroTerminal.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

  typeRow();
}

watch(
  () => props.autoStart,
  (shouldStart) => {
    if (shouldStart && !isStarted) {
      startTypingSequence();
    }
  },
);

function onMotionChange(e: MediaQueryListEvent) {
  if (e.matches) {
    if (typingTimeoutId !== null) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
    if (stepTimeoutId !== null) {
      clearTimeout(stepTimeoutId);
      stepTimeoutId = null;
    }
    showInstantState();
  }
}

onMounted(() => {
  if (!import.meta.client) return;

  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionMq.addEventListener("change", onMotionChange);

  if (motionMq.matches) {
    isStarted = true;
    showInstantState();
    return;
  }

  if (props.autoStart) {
    startTypingSequence();
  }
});

onUnmounted(() => {
  motionMq?.removeEventListener("change", onMotionChange);
  if (typingTimeoutId !== null) {
    clearTimeout(typingTimeoutId);
    typingTimeoutId = null;
  }
  if (stepTimeoutId !== null) {
    clearTimeout(stepTimeoutId);
    stepTimeoutId = null;
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.hero-term {
  display: flex;

exec
/bin/zsh -lc 'rg -n "name:|url:|slug|keova|debrief|devis" app/data/site.ts' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
14:  name: string;
26:  name: string;
35:  name: "Simon Jouan",
66:    name: "Keova Signal",
73:    name: "Debrief",
80:    name: "Devis-Assist",
82:    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ et matching flou PostgreSQL.",
90:    name: "Keova App",
93:    url: "https://keova.app",
98:    name: "TryOn",
105:    name: "Nodium",

exec
/bin/zsh -lc "sed -n '56,112p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
  "whisper.cpp",
  "sherpa-onnx",
  "llama.cpp",
  "bullmq",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "Keova Signal",
    role: "Concepteur & Développeur Full Stack",
    desc: "Moteur d'acquisition B2B & qualification de leads par ingestion Open Data Insee, scraping éthique et serveur MCP natif.",
    status: "● Système interne / Dépôt privé",
    tags: ["Node.js 22", "TypeScript", "MCP Server", "PostgreSQL", "Cheerio", "Docker"],
  },
  {
    name: "Debrief",
    role: "Concepteur & Développeur Full Stack",
    desc: "Application desktop privacy-first de synthèse commerciale 100 % locale (ASR whisper.cpp, diarisation sherpa-onnx, LLM Gemma 4).",
    status: "◐ R&D / Dépôt privé",
    tags: ["Tauri", "Rust", "whisper.cpp", "sherpa-onnx", "llama.cpp", "Gemma 4"],
  },
  {
    name: "Devis-Assist",
    role: "Architecte & Développeur Full Stack",
    desc: "Solution d'ingestion et d'analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ et matching flou PostgreSQL.",
    status: "○ Architecture validée / Dépôt privé",
    tags: ["NestJS", "Nuxt UI 4", "PostgreSQL pg_trgm", "Mistral OCR", "BullMQ"],
  },
];

const legacyProjects: IProject[] = [
  {
    name: "Keova App",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Application SaaS de gestion opérationnelle complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "● En production",
    tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "○ Étude de cas (MVP livré)",
    tags: ["Nuxt 3", "NestJS", "Python", "ComfyUI", "IA"],
  },
  {
    name: "Nodium",
    role: "Créateur · R&D agents IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "◐ R&D / En cours",
    tags: ["TypeScript", "Electron", "Agents", "IA"],
  },
];


codex
The project list itself is okay: `SITE.projects` currently contains exactly Keova Signal, Debrief, and Devis-Assist, with legacy projects separated. I’m doing one last pass for contradictions between the claimed task completion and code hunks, especially around verification claims and focus/motion behavior.
exec
/bin/zsh -lc "sed -n '90,180p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,90p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    </section>

    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    <section class="section">
      <div class="container">
        <div class="block__head">
          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
          <h2 class="section__title">Des produits qui tournent en production</h2>
        </div>

        <ul class="work">
          <li v-for="(project, index) in projects" :key="project.name">
            <component
              :is="project.url ? ZExternalLink : 'div'"
              :href="project.url"
              class="work__row"
              :class="{ 'work__row--link': Boolean(project.url) }"
              :data-hot="project.url ? '' : undefined"
              @mousemove="onProjectMouseMove"
              @mouseleave="onProjectMouseLeave"
            >
              <span class="work__no">{{ String(index + 1).padStart(2, "0") }}</span>
              <div class="work__main">
                <div class="work__topline">
                  <h3 class="work__name">{{ project.name }}</h3>
                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
                </div>
                <p class="work__role">{{ project.role }}</p>
                <p class="prose work__desc">{{ project.desc }}</p>
                <ul class="hero__tags work__tags">
                  <li v-for="(tag, tagIndex) in project.tags" :key="`${tag}-${tagIndex}`">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
              </div>
              <span v-if="project.url" class="work__go" aria-hidden="true">
                <ZIcon name="arrow" />
              </span>
            </component>
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
        <ul v-if="articles && articles.length" class="journal">
          <li v-for="article in articles" :key="article.path" class="journal__item">
            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive tilt class="jpost" data-hot>
              <NuxtImg
                v-if="article.image"
                class="jpost__thumb"
                :src="article.image.src"
                :alt="article.image.alt"
                width="360"
                height="200"
                sizes="360px"
                format="webp"
              />
              <div class="jpost__body">
                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
                  <li v-for="(tag, tagIndex) in article.tags" :key="`${tag}-${tagIndex}`">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h3 class="jpost__title">{{ article.title }}</h3>
                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
                <div class="jpost__meta">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                  <template v-if="article.read">

 succeeded in 0ms:
<template>
  <main class="home">
    <ClientOnly>
      <HomeBootOverlay @boot-complete="onBootComplete" />
    </ClientOnly>
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <h2 class="eyebrow">
              <span aria-hidden="true">// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA &amp; AUTOMATISATION
            </h2>
            <h1 class="hero__title">Automatisez les workflows qui freinent votre équipe.</h1>
            <p class="hero__sub">
              Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants —
              de l’identification du problème jusqu’à la mise en production.
            </p>
            <p class="hero__credibility">
              Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour nouvelles missions freelance</span>
              <template v-if="SITE.profile.maltUrl">
                <span aria-hidden="true"> · </span>
                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
              </template>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Identifier un workflow à automatiser
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir mes systèmes IA </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
          </div>
        </div>

        <!-- Ruban défilant de la stack moderne remonté au sein du hero (fidèle à la maquette) -->
        <HomeStackMarquee class="hero__marquee" />
      </div>
    </section>

    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
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
/bin/zsh -lc "sed -n '1,180p' app/components/home/HomeStackMarquee.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div v-if="skillsList.length" class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <!-- Première passe -->
      <span v-for="(skill, index) in skillsList" :key="`skill-a-${index}`" class="marquee__item">
        <b class="marquee__label">{{ skill }}</b>
        <span class="marquee__star" aria-hidden="true">✦</span>
      </span>
      <!-- Deuxième passe pour la boucle infinie CSS sans coupure -->
      <span
        v-for="(skill, index) in skillsList"
        :key="`skill-b-${index}`"
        class="marquee__item marquee__item--duplicate"
      >
        <b class="marquee__label">{{ skill }}</b>
        <span class="marquee__star" aria-hidden="true">✦</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ruban défilant continu de la stack moderne prioritaire (Story 11.3 / AC-1 / CAP-4).
// Alimenté par SITE.skills (app/data/site.ts) avec mapping soigné des libellés.
// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
import { computed } from "vue";
import { SITE } from "~/data/site";

const SKILL_LABEL_MAP: Record<string, string> = {
  typescript: "TypeScript",
  "node.js": "Node.js",
  "nest.js": "NestJS",
  nuxt: "Nuxt 4",
  vue: "Vue.js",
  postgresql: "PostgreSQL",
  mcp: "MCP",
  docker: "Docker",
  "whisper.cpp": "whisper.cpp",
  "sherpa-onnx": "sherpa-onnx",
  "llama.cpp": "llama.cpp",
  bullmq: "BullMQ",
  "rest-api": "REST API",
  vitest: "Vitest",
};

const skillsList = computed(() => {
  return SITE.skills.map((skillKey) => SKILL_LABEL_MAP[skillKey] ?? skillKey);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.marquee {
  display: block;
  width: 100%;
  padding-block: var(--space-5);
  overflow: hidden;
  border-block: 1px solid var(--border-subtle);
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);

  &:hover .marquee__track {
    animation-play-state: paused;
  }
}

.marquee__track {
  display: flex;
  gap: var(--space-8);
  width: max-content;
  will-change: transform;
  animation: scroll-x 32s linear infinite;
}

.marquee__item {
  display: inline-flex;
  gap: var(--space-8);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  letter-spacing: var(--ls-wide);
  color: var(--text-faint);
  white-space: nowrap;
}

.marquee__label {
  font-weight: var(--fw-regular);
  color: var(--text-body);
}

.marquee__star {
  color: var(--accent);
}

@keyframes scroll-x {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - var(--space-8) / 2));
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    mask-image: none;
  }

  .marquee__track {
    animation: none;
  }

  .marquee__item--duplicate {
    display: none;
  }
}
</style>

codex
I’m not going to run the full Docker gate for an audit of an existing diff unless needed; the diff’s own claims are enough to assess acceptance. One important detail: `HomeStackMarquee` is `aria-hidden`, so it doesn’t add keyboard stops after the terminal.
exec
/bin/zsh -lc "ls -la .output/public 2>/dev/null && rg -n \"noscript|whoami|focus\\.txt|ls ~/systems|ls ~/projets|v-for|\\{\\{ row\" .output/public/index.html 2>/dev/null" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
total 720
drwxr-xr-x  19 simon  staff     608 Sep 16 22:12 .
drwxr-xr-x   4 simon  staff     128 Sep 16 22:12 ..
-rw-r--r--   1 simon  staff    1621 Sep 16 22:12 200.html
-rw-r--r--   1 simon  staff    1621 Sep 16 22:12 404.html
-rw-r--r--   1 simon  staff       9 Sep 16 22:12 CNAME
drwxr-xr-x   3 simon  staff      96 Sep 16 22:12 __nuxt_content
-rw-r--r--   1 simon  staff     113 Sep 16 22:12 _headers
drwxr-xr-x  11 simon  staff     352 Sep 16 22:12 _ipx
drwxr-xr-x  86 simon  staff    2752 Sep 16 22:12 _nuxt
drwxr-xr-x   3 simon  staff      96 Sep 16 22:12 about
drwxr-xr-x   3 simon  staff      96 Sep 16 22:12 blog
drwxr-xr-x   3 simon  staff      96 Sep 16 22:12 confidentialite
drwxr-xr-x   4 simon  staff     128 Sep 16 22:12 contact
-rw-r--r--   1 simon  staff  249998 Sep 16 22:12 favicon.ico
drwxr-xr-x  44 simon  staff    1408 Sep 16 22:12 images
-rw-r--r--   1 simon  staff   85971 Sep 16 22:12 index.html
drwxr-xr-x   3 simon  staff      96 Sep 16 22:12 mentions-legales
drwxr-xr-x   3 simon  staff      96 Sep 16 22:12 services
-rw-r--r--   1 simon  staff     368 Sep 16 22:12 simon-jouan.vcf
1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-278e668d]{position:relative;z-index:10;margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 0}.ftr__container[data-v-278e668d]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-278e668d]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-278e668d]{max-width:300px}.ftr__brand[data-v-278e668d]{display:inline-flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-278e668d]{display:block;width:22px;height:22px;-o-object-fit:contain;object-fit:contain;filter:drop-shadow(0 2px 4px color-mix(in srgb,var(--surface-0) 60%,transparent))}.ftr__brand b[data-v-278e668d]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand .dim[data-v-278e668d]{color:var(--text-muted)}.ftr__brand[data-v-278e668d]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-278e668d]{margin:0;font-size:var(--fs-sm);color:var(--text-body)}.ftr__col[data-v-278e668d]{display:flex;flex-direction:column}.ftr__title[data-v-278e668d]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--accent)}.ftr__list[data-v-278e668d]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-278e668d]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-strong);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-278e668d]:hover{color:var(--accent);transform:translate(2px)}.ftr__link[data-v-278e668d]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-278e668d]{color:var(--text-body);cursor:default}.ftr__link--static[data-v-278e668d]:hover{color:var(--text-body);transform:none}.ftr__bottom-bar[data-v-278e668d]{width:100%;margin-top:var(--space-8);border-top:1px solid var(--border-default)}.ftr__bottom[data-v-278e668d]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;align-items:center;padding-block:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-body)}.ftr__cmd[data-v-278e668d]{color:var(--term-green);font-weight:var(--fw-medium)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-278e668d]{transition:none;transform:none!important}}</style><style>.current-time[data-v-d0ca7980]{display:inline-flex;align-items:center;font-family:var(--font-mono);font-size:var(--fs-xs);font-variant-numeric:tabular-nums;letter-spacing:var(--ls-wide);color:var(--text-muted)}.current-time__colon[data-v-d0ca7980]{display:inline-block;margin:0 1px}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-4d1381a1]{position:fixed;top:0;left:0;right:0;z-index:50;height:var(--header-height);background:transparent;border-bottom:1px solid transparent;transition:background var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard),backdrop-filter var(--dur-base) var(--ease-standard)}.hdr--stuck[data-v-4d1381a1]{background:color-mix(in srgb,var(--surface-0) 80%,transparent);border-bottom-color:var(--border-subtle);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}.hdr__progress[data-v-4d1381a1]{position:absolute;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));box-shadow:0 0 10px var(--accent);pointer-events:none;transition:width .05s linear}.hdr__in[data-v-4d1381a1]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-4d1381a1]{display:inline-flex;align-items:center;gap:var(--space-3);text-decoration:none;cursor:pointer}.hdr__brand .hdr__logo[data-v-4d1381a1]{display:block;width:24px;height:24px;-o-object-fit:contain;object-fit:contain;filter:drop-shadow(0 2px 6px color-mix(in srgb,var(--surface-0) 60%,transparent));transition:transform var(--dur-base) var(--ease-standard),filter var(--dur-base) var(--ease-standard)}.hdr__brand .hdr__brand-text[data-v-4d1381a1]{transition:transform var(--dur-fast) var(--ease-standard)}.hdr__brand b[data-v-4d1381a1]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand .dim[data-v-4d1381a1],.hdr__brand b[data-v-4d1381a1]{transition:color var(--dur-fast) var(--ease-standard)}.hdr__brand .dim[data-v-4d1381a1]{color:var(--text-faint)}.hdr__brand:hover .hdr__logo[data-v-4d1381a1]{transform:rotate(-12deg) scale(1.15);filter:drop-shadow(0 0 10px color-mix(in srgb,var(--accent) 70%,transparent))}.hdr__brand:hover b[data-v-4d1381a1]{color:var(--accent)}.hdr__brand:hover .dim[data-v-4d1381a1]{color:var(--text-body)}.hdr__brand[data-v-4d1381a1]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-4d1381a1]{position:absolute;left:50%;display:flex;align-items:center;gap:var(--space-6);transform:translate(-50%)}.hdr__link[data-v-4d1381a1]{position:relative;display:inline-flex;align-items:center;gap:var(--space-1);padding:4px 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;background:transparent;transition:color var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-4d1381a1]:after{content:"";position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:var(--accent);transition:width var(--dur-base) var(--ease-out)}.hdr__link[data-v-4d1381a1]:hover{color:var(--text-strong);background:transparent}.hdr__link[data-v-4d1381a1]:hover:after{width:100%}.hdr__link[data-v-4d1381a1]:focus-visible{outline:2px solid transparent;outline-offset:4px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.hdr__link--active[data-v-4d1381a1]{color:var(--text-strong)}.hdr__link--active[data-v-4d1381a1]:after{width:100%}.hdr__link--active .hdr__link-prefix[data-v-4d1381a1]{color:var(--accent)}.hdr__link-prefix[data-v-4d1381a1],.hdr__menu-link-prefix[data-v-4d1381a1]{font-family:var(--font-mono);color:var(--text-faint);transition:color var(--dur-fast) var(--ease-standard)}.hdr__link--active .hdr__link-prefix[data-v-4d1381a1],.hdr__link:hover .hdr__link-prefix[data-v-4d1381a1],.hdr__menu-link--active .hdr__menu-link-prefix[data-v-4d1381a1],.hdr__menu-link:hover .hdr__menu-link-prefix[data-v-4d1381a1]{color:var(--accent)}.hdr__right[data-v-4d1381a1]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__action--terminal[data-v-4d1381a1]{border-color:color-mix(in srgb,var(--term-green) 40%,transparent);box-shadow:0 0 12px color-mix(in srgb,var(--term-green) 22%,transparent)}.hdr__action--terminal[data-v-4d1381a1]:hover{border-color:var(--term-green);box-shadow:0 0 20px color-mix(in srgb,var(--term-green) 45%,transparent),var(--glow-terminal)}.hdr__dock-right[data-v-4d1381a1]{position:absolute;top:50%;right:var(--space-6);z-index:52;display:flex;gap:var(--space-3);align-items:center;transform:translateY(-50%)}.hdr__status-badge[data-v-4d1381a1]{display:inline-flex;gap:var(--space-2);align-items:center;padding:4px 10px;font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--term-green);-webkit-user-select:none;-moz-user-select:none;user-select:none;background:color-mix(in srgb,var(--term-green) 12%,transparent);border:1px solid color-mix(in srgb,var(--term-green) 40%,transparent);border-radius:var(--radius-pill);box-shadow:0 0 10px color-mix(in srgb,var(--term-green) 18%,transparent);transition:box-shadow var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.hdr__status-badge[data-v-4d1381a1]:hover{border-color:var(--term-green);box-shadow:0 0 16px color-mix(in srgb,var(--term-green) 35%,transparent)}.hdr__status-dot[data-v-4d1381a1]{width:7px;height:7px;background:var(--term-green);border-radius:var(--radius-circle);box-shadow:0 0 6px var(--term-green)}.hdr__dock-clock[data-v-4d1381a1]{margin-left:var(--space-1)}.hdr__burger[data-v-4d1381a1]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-4d1381a1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-4d1381a1]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-4d1381a1]{display:none}.hdr__menu-status[data-v-4d1381a1]{display:flex;align-items:center;justify-content:space-between;padding-bottom:var(--space-2);margin-bottom:var(--space-2);border-bottom:1px solid var(--border-subtle)}@media(max-width:1650px){.hdr__dock-right[data-v-4d1381a1]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-4d1381a1]{display:none}}@media(max-width:900px){.hdr__dock-right[data-v-4d1381a1],.hdr__nav[data-v-4d1381a1],.hdr__right .hdr__action[data-v-4d1381a1]{display:none}.hdr__burger[data-v-4d1381a1]{display:inline-flex}.hdr__menu[data-v-4d1381a1]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-4d1381a1]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-4d1381a1]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-4d1381a1]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-4d1381a1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-4d1381a1]{color:var(--accent)}.hdr__menu-actions[data-v-4d1381a1]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr[data-v-4d1381a1],.hdr__link[data-v-4d1381a1],.hdr__link[data-v-4d1381a1]:after,.hdr__menu[data-v-4d1381a1],.hdr__progress[data-v-4d1381a1]{transition:none!important}.hdr__brand .hdr__logo[data-v-4d1381a1],.hdr__brand:hover .hdr__logo[data-v-4d1381a1]{transform:none;transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zbtn[data-v-cb9dbc4e]{--_h:46px;--_px:var(--space-5);--_fs:var(--fs-sm);--_ty:0;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transform:translate(var(--mag-x,0),calc(var(--mag-y, 0) + var(--_ty, 0)));transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}@media(hover:hover){.zbtn[data-v-cb9dbc4e]:hover{--_ty:-1px}}.zbtn[data-v-cb9dbc4e]:active{--_ty:0}.zbtn[data-v-cb9dbc4e]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-cb9dbc4e]:disabled,.zbtn[aria-disabled=true][data-v-cb9dbc4e]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__inner[data-v-cb9dbc4e]{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);transform:translate(var(--mag-inner-x,0),var(--mag-inner-y,0));transition:transform var(--dur-fast) var(--ease-standard);will-change:transform}.zbtn__icon[data-v-cb9dbc4e]{display:inline-flex;width:1.1em;height:1.1em}.zbtn__icon[data-v-cb9dbc4e] svg{width:100%;height:100%}.zbtn--sm[data-v-cb9dbc4e]{--_h:32px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-cb9dbc4e]{--_h:48px;--_px:var(--space-6);--_fs:var(--fs-sm)}.zbtn--primary[data-v-cb9dbc4e]{background:var(--accent);color:var(--accent-text);border-color:var(--accent);box-shadow:var(--glow-accent)}.zbtn--primary[data-v-cb9dbc4e]:hover{background:var(--accent-hover);border-color:var(--accent-hover);box-shadow:0 0 16px color-mix(in srgb,var(--accent) 45%,transparent)}.zbtn--primary[data-v-cb9dbc4e]:active{background:var(--accent-active);border-color:var(--accent-active)}.zbtn--secondary[data-v-cb9dbc4e]{background:color-mix(in srgb,var(--surface-2) 75%,transparent);color:var(--text-strong);border-color:var(--border-default);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.zbtn--secondary[data-v-cb9dbc4e]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--ghost[data-v-cb9dbc4e]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-cb9dbc4e]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-cb9dbc4e]{background:var(--bg-terminal);color:var(--term-green);border-color:color-mix(in srgb,var(--term-green) 35%,var(--accent-2-soft));box-shadow:0 0 10px color-mix(in srgb,var(--term-green) 18%,transparent)}.zbtn--terminal[data-v-cb9dbc4e]:hover{border-color:var(--term-green);box-shadow:0 0 18px color-mix(in srgb,var(--term-green) 45%,transparent),var(--glow-terminal)}.zbtn--danger[data-v-cb9dbc4e]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-cb9dbc4e]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-cb9dbc4e]:active{--_ty:1px}@media(prefers-reduced-motion:reduce){.zbtn[data-v-cb9dbc4e],.zbtn__inner[data-v-cb9dbc4e]{transition:none;transform:none!important}}</style><style>.zicon[data-v-e418c62d]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.boot[data-v-9f939532]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-9f939532]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-9f939532]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-9f939532]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-9f939532]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-9f939532]{font-size:26px;color:var(--accent)}.boot__line[data-v-9f939532]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-9f939532]{color:var(--term-green)}.boot__bar[data-v-9f939532]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-9f939532]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-9f939532]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-9f939532]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-9f939532]{display:none}}</style><style>.cursor-dot[data-v-3c06b2da],.cursor-ring[data-v-3c06b2da]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-3c06b2da],.cursor-ring.is-visible[data-v-3c06b2da]{opacity:1}.cursor-dot[data-v-3c06b2da]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-3c06b2da]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-3c06b2da]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-3c06b2da],.cursor-ring[data-v-3c06b2da]{display:none}}</style><style>.hero-term[data-v-bcd80dd3]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-bcd80dd3]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-bcd80dd3]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-bcd80dd3]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-bcd80dd3]{background:var(--term-red)}.hero-term__dot--min[data-v-bcd80dd3]{background:var(--term-yellow)}.hero-term__dot--max[data-v-bcd80dd3]{background:var(--term-green)}.hero-term__title[data-v-bcd80dd3]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-bcd80dd3]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-bcd80dd3]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-bcd80dd3]{margin:0}.hero-term__out[data-v-bcd80dd3]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-bcd80dd3]{color:var(--ink-1)}.hero-term__out--blue[data-v-bcd80dd3]{color:var(--term-blue)}.hero-term__out--green[data-v-bcd80dd3]{color:var(--term-green)}.hero-term__open[data-v-bcd80dd3]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-bcd80dd3]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-bcd80dd3]{font-family:var(--font-mono)}.prm__user[data-v-bcd80dd3]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-bcd80dd3]{color:var(--ink-1)}.prm__dir[data-v-bcd80dd3]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-bcd80dd3]{color:var(--ink-1)}.prm__caret[data-v-bcd80dd3]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-bcd80dd3]{animation:none}}</style><style>.marquee[data-v-51865429]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-51865429]{animation-play-state:paused}.marquee__track[data-v-51865429]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-51865429 32s linear infinite}.marquee__item[data-v-51865429]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-51865429]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-51865429]{color:var(--accent)}@keyframes scroll-x-51865429{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-51865429]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-51865429]{animation:none}.marquee__item--duplicate[data-v-51865429]{display:none}}</style><style>.home[data-v-3d192d3f]{display:block}.anim[data-v-3d192d3f]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-3d192d3f]{animation-delay:80ms}.hero[data-v-3d192d3f]{min-height:100vh;display:flex;align-items:center;padding:calc(var(--header-height) + var(--space-6)) 0 var(--space-10);background:transparent}.hero[data-v-3d192d3f],.hero__in[data-v-3d192d3f]{position:relative}.hero__in[data-v-3d192d3f]{z-index:1;width:100%}.hero__grid[data-v-3d192d3f]{display:grid;grid-template-columns:1.1fr .9fr;gap:var(--space-12);align-items:center}.hero__marquee[data-v-3d192d3f]{margin-top:var(--space-10)}.hero__title[data-v-3d192d3f]{margin:0;font-family:var(--font-mono);font-size:clamp(2.6rem,6.4vw,5.2rem);font-weight:var(--fw-regular);line-height:.98;letter-spacing:var(--ls-tight);color:var(--text-strong);text-shadow:0 2px 14px color-mix(in srgb,var(--surface-0) 80%,transparent)}.hero__title em[data-v-3d192d3f]{font-style:italic;color:var(--accent)}.hero__sub[data-v-3d192d3f]{max-width:46ch;margin:var(--space-5) 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body);text-shadow:0 1px 8px color-mix(in srgb,var(--surface-0) 70%,transparent)}.hero__credibility[data-v-3d192d3f]{margin:0 0 var(--space-6);font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted)}.hero__cta[data-v-3d192d3f]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-3d192d3f]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body)}.hero__badge-wrap a[data-v-3d192d3f]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-3d192d3f]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-3d192d3f]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-3d192d3f]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-3d192d3f 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-3d192d3f]{animation:none}}@keyframes pulse-dot-3d192d3f{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-3d192d3f]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-3d192d3f]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-3d192d3f],.offer[data-v-3d192d3f]{display:flex}.offer[data-v-3d192d3f]{flex-direction:column;width:100%}.offer__top[data-v-3d192d3f]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-3d192d3f],.offer__top[data-v-3d192d3f]{display:flex;align-items:center}.offer__icon[data-v-3d192d3f]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-3d192d3f]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-3d192d3f],.offer__title[data-v-3d192d3f]{font-family:var(--font-mono)}.offer__title[data-v-3d192d3f]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-3d192d3f]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-3d192d3f]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-3d192d3f]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-3d192d3f]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-3d192d3f]{margin-bottom:var(--space-4)}.offer__price[data-v-3d192d3f]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-3d192d3f],.offer__price[data-v-3d192d3f]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-3d192d3f]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-3d192d3f]:hover{text-decoration:underline}.offer__more[data-v-3d192d3f]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-3d192d3f]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-3d192d3f]{display:block;width:100%}.work__row[data-v-3d192d3f]{position:relative;display:grid;grid-template-columns:var(--fs-6xl) 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.work__row[data-v-3d192d3f]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-3d192d3f]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-3d192d3f]{cursor:pointer}.work__row--link[data-v-3d192d3f]:hover{padding-left:var(--space-6)}.work__row--link[data-v-3d192d3f]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-3d192d3f]{color:var(--accent)}.work__row--link:hover .work__go[data-v-3d192d3f]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-3d192d3f]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-3d192d3f]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-3d192d3f],.work__no[data-v-3d192d3f]{position:relative}.work__topline[data-v-3d192d3f]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-3d192d3f]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-3d192d3f]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-3d192d3f],.work__status[data-v-3d192d3f]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-3d192d3f]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-3d192d3f]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-3d192d3f]{margin-top:var(--space-4)}.work__go[data-v-3d192d3f]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-3d192d3f]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-3d192d3f]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 85%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:border-color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.stat[data-v-3d192d3f]:hover{border-color:var(--border-strong);transform:translateY(-2px)}.stat b[data-v-3d192d3f]{display:block;margin-bottom:var(--space-2);font-size:clamp(var(--fs-4xl),4.5vw,var(--fs-5xl));font-weight:var(--fw-bold);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-3d192d3f],.stat span[data-v-3d192d3f]{font-family:var(--font-mono)}.stat span[data-v-3d192d3f]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-3d192d3f]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-3d192d3f]{margin-bottom:0}.seeall[data-v-3d192d3f]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-3d192d3f]:hover{color:var(--accent)}.seeall[data-v-3d192d3f]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-3d192d3f]{font-size:var(--fs-base)}.journal[data-v-3d192d3f]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-3d192d3f],.jpost[data-v-3d192d3f]{display:flex}.jpost[data-v-3d192d3f]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-3d192d3f]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-3d192d3f]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-3d192d3f]{width:100%;height:10rem;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-3d192d3f]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-3d192d3f]{margin-bottom:var(--space-3)}.jpost__title[data-v-3d192d3f]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-3d192d3f]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-3d192d3f]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-3d192d3f]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-3d192d3f]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-3d192d3f]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-3d192d3f]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-3d192d3f]{position:relative;padding:clamp(48px,7vw,84px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,color-mix(in srgb,var(--accent) 22%,transparent),transparent 70%),color-mix(in srgb,var(--surface-1) 85%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.cta__eyebrow[data-v-3d192d3f]{display:inline-block;margin-bottom:var(--space-4)}.cta__title[data-v-3d192d3f]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(2rem,4.5vw,3.2rem);font-weight:var(--fw-regular);line-height:1.08;letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-3d192d3f]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-3d192d3f]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-3d192d3f]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center;align-items:center}@media(max-width:900px){.hero__grid[data-v-3d192d3f]{grid-template-columns:1fr}.hero__title[data-v-3d192d3f]{font-size:var(--fs-4xl)}.grid-3[data-v-3d192d3f],.journal[data-v-3d192d3f]{grid-template-columns:1fr}.block__head--row[data-v-3d192d3f]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-3d192d3f]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-3d192d3f],.work__no[data-v-3d192d3f]{display:none}.stats[data-v-3d192d3f]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-3d192d3f]{animation:none}.jpost__arrow[data-v-3d192d3f],.seeall[data-v-3d192d3f],.stat[data-v-3d192d3f],.work__go[data-v-3d192d3f],.work__row[data-v-3d192d3f]{transition:none}.stat[data-v-3d192d3f]:hover{transform:none}.work__row[data-v-3d192d3f]{transform:none!important}.work__row--link[data-v-3d192d3f]:hover{padding-left:var(--space-3)}.jpost:hover .jpost__arrow[data-v-3d192d3f],.work__row--link:hover .work__go[data-v-3d192d3f]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-a321e1ae]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-strong);cursor:pointer;background:var(--surface-3);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard)}.hex[data-v-a321e1ae]:hover{color:var(--ink-on-accent);background:var(--accent);transform:translateY(-2px)}.hex[data-v-a321e1ae]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-a321e1ae]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-a321e1ae]{transition:none}.hex[data-v-a321e1ae]:hover{transform:none}}</style><style>.atmos[data-v-9e21c469]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.atmos[data-v-9e21c469],.atmos--fallback[data-v-9e21c469]{background-color:var(--surface-0)}.atmos--fallback[data-v-9e21c469]{background-image:radial-gradient(at 80% 30%,var(--accent-soft) 0,transparent 62%),radial-gradient(at 21% 68%,var(--accent-2-soft) 0,transparent 62%)}.atmos__canvas[data-v-9e21c469]{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:.52}.grid-dots[data-v-9e21c469]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 8%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-9e21c469],.vignette[data-v-9e21c469]{position:absolute;inset:0}.vignette[data-v-9e21c469]{background:linear-gradient(180deg,color-mix(in srgb,var(--surface-0) 70%,transparent) 0,transparent 130px),radial-gradient(ellipse 120% 88% at 50% 12%,transparent 30%,var(--surface-0) 90%)}@media(prefers-reduced-motion:reduce){.atmos__canvas[data-v-9e21c469]{animation:none}}</style><style>.zcard[data-v-e96e3958]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--tilt[data-v-e96e3958]{transform-style:preserve-3d;will-change:transform}.zcard--pad[data-v-e96e3958]{padding:var(--space-6)}.zcard--interactive[data-v-e96e3958]{cursor:pointer}.zcard--interactive[data-v-e96e3958]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-e96e3958]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-e96e3958]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-e96e3958]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-e96e3958]{transition:none;transform:none!important}.zcard--interactive[data-v-e96e3958]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRT0voAK.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.dVw-PgAq.css" crossorigin><link rel="stylesheet" href="/_nuxt/HomeAtmosComponent.BFlGjFQL.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.Cx-66epl.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZIQQfQSC.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/Bd0IsGWy.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BAYZ9V5Y.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/pgWrePRg.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BLdl6oae.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/B7Yotls4.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BK5TlX-4.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/D5hjbwyT.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/SryyJNmH.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BR4XQTB-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/D1TFGHIB.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BxguQcWk.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BH2DBLGT.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BvnEvhPh.js"><script type="module" src="/_nuxt/ZIQQfQSC.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"France · Remote","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack spécialisé en systèmes IA & automatisation métier"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack spécialisé en systèmes IA & automatisation métier","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"France · Remote","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-4d1381a1><div class="hdr__progress" style="width:0%;" aria-hidden="true" data-v-4d1381a1></div><div class="hdr__in" data-v-4d1381a1><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-4d1381a1><img width="24" height="24" data-nuxt-img srcset="/_ipx/s_24x24/images/logo_white.png 1x, /_ipx/s_48x48/images/logo_white.png 2x" onerror="this.setAttribute(&#39;data-error&#39;, 1)" alt class="hdr__logo" src="/_ipx/s_24x24/images/logo_white.png" data-v-4d1381a1><span class="hdr__brand-text" data-v-4d1381a1><b data-v-4d1381a1>jouan</b><span class="dim" data-v-4d1381a1>.ovh</span></span></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-4d1381a1><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-4d1381a1><span class="hdr__link-prefix" aria-hidden="true" data-v-4d1381a1>~</span><span class="hdr__link-label" data-v-4d1381a1>Accueil</span></a><a href="/services" class="hdr__link" data-v-4d1381a1><span class="hdr__link-prefix" aria-hidden="true" data-v-4d1381a1>//</span><span class="hdr__link-label" data-v-4d1381a1>Services</span></a><a href="/about" class="hdr__link" data-v-4d1381a1><span class="hdr__link-prefix" aria-hidden="true" data-v-4d1381a1>./</span><span class="hdr__link-label" data-v-4d1381a1>À propos</span></a><a href="/blog" class="hdr__link" data-v-4d1381a1><span class="hdr__link-prefix" aria-hidden="true" data-v-4d1381a1>~/</span><span class="hdr__link-label" data-v-4d1381a1>Blog</span></a><a href="/contact" class="hdr__link" data-v-4d1381a1><span class="hdr__link-prefix" aria-hidden="true" data-v-4d1381a1>$</span><span class="hdr__link-label" data-v-4d1381a1>Contact</span></a><!--]--></nav><div class="hdr__right" data-v-4d1381a1><button class="hdr__action hdr__action--terminal zbtn zbtn--terminal zbtn--sm zbtn--magnetic" type="button" data-v-4d1381a1 data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><span class="zbtn__icon" data-v-cb9dbc4e><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4d1381a1 data-v-e418c62d><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></span></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm zbtn--magnetic" data-v-4d1381a1 data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Démarrer un projet <!--]--><!----></span></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-4d1381a1><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4d1381a1 data-v-e418c62d><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><div class="hdr__dock-right" aria-label="Statut et heure" data-v-4d1381a1><div class="hdr__status-badge" data-v-4d1381a1><span class="hdr__status-dot" aria-hidden="true" data-v-4d1381a1></span><span class="hdr__status-text" data-v-4d1381a1>Disponible</span></div><time class="current-time hdr__dock-clock" datetime aria-label="Heure locale" data-v-4d1381a1 data-v-d0ca7980><span class="current-time__hours" data-v-d0ca7980>--</span><span class="current-time__colon" aria-hidden="true" data-v-d0ca7980>:</span><span class="current-time__minutes" data-v-d0ca7980>--</span></time></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-4d1381a1><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-4d1381a1><span class="hdr__menu-link-prefix" aria-hidden="true" data-v-4d1381a1>~</span><span class="hdr__menu-link-label" data-v-4d1381a1>Accueil</span></a><a href="/services" class="hdr__menu-link" data-v-4d1381a1><span class="hdr__menu-link-prefix" aria-hidden="true" data-v-4d1381a1>//</span><span class="hdr__menu-link-label" data-v-4d1381a1>Services</span></a><a href="/about" class="hdr__menu-link" data-v-4d1381a1><span class="hdr__menu-link-prefix" aria-hidden="true" data-v-4d1381a1>./</span><span class="hdr__menu-link-label" data-v-4d1381a1>À propos</span></a><a href="/blog" class="hdr__menu-link" data-v-4d1381a1><span class="hdr__menu-link-prefix" aria-hidden="true" data-v-4d1381a1>~/</span><span class="hdr__menu-link-label" data-v-4d1381a1>Blog</span></a><a href="/contact" class="hdr__menu-link" data-v-4d1381a1><span class="hdr__menu-link-prefix" aria-hidden="true" data-v-4d1381a1>$</span><span class="hdr__menu-link-label" data-v-4d1381a1>Contact</span></a><!--]--><div class="hdr__menu-actions" data-v-4d1381a1><div class="hdr__menu-status" data-v-4d1381a1><div class="hdr__status-badge" data-v-4d1381a1><span class="hdr__status-dot" aria-hidden="true" data-v-4d1381a1></span><span class="hdr__status-text" data-v-4d1381a1>Disponible</span></div><time class="current-time hdr__menu-clock" datetime aria-label="Heure locale" data-v-4d1381a1 data-v-d0ca7980><span class="current-time__hours" data-v-d0ca7980>--</span><span class="current-time__colon" aria-hidden="true" data-v-d0ca7980>:</span><span class="current-time__minutes" data-v-d0ca7980>--</span></time></div><button class="hdr__action--terminal zbtn zbtn--terminal zbtn--sm zbtn--magnetic" type="button" data-v-4d1381a1 data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><span class="zbtn__icon" data-v-cb9dbc4e><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-4d1381a1 data-v-e418c62d><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></span></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm zbtn--magnetic" data-v-4d1381a1 data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Démarrer un projet <!--]--><!----></span></a></div></nav><div data-v-4d1381a1><!--[--><!--]--></div></header><!--[--><main class="home" data-v-3d192d3f><span data-v-3d192d3f></span><div class="atmos" aria-hidden="true" data-v-3d192d3f data-v-9e21c469><canvas class="atmos__canvas" data-v-9e21c469></canvas><div class="grid-dots" data-v-9e21c469></div><div class="vignette" data-v-9e21c469></div></div><!----><section class="hero" data-v-3d192d3f><div class="hero__in container" data-v-3d192d3f><div class="hero__grid" data-v-3d192d3f><div class="anim hero__text" data-v-3d192d3f><h2 class="eyebrow" data-v-3d192d3f><span aria-hidden="true" data-v-3d192d3f>// </span>DÉVELOPPEUR FULL STACK · SYSTÈMES IA &amp; AUTOMATISATION </h2><h1 class="hero__title" data-v-3d192d3f>Automatisez les workflows qui freinent votre équipe.</h1><p class="hero__sub" data-v-3d192d3f> Je conçois des agents IA, automatisations et applications métier qui s’intègrent à vos outils existants — de l’identification du problème jusqu’à la mise en production. </p><p class="hero__credibility" data-v-3d192d3f> Full Stack TypeScript · Agents IA · APIs · PostgreSQL · MCP · IA locale · QA </p><div class="hero__badge-wrap" data-v-3d192d3f><span class="hero__pulse-dot" aria-hidden="true" data-v-3d192d3f></span><span data-v-3d192d3f>Disponible pour nouvelles missions freelance</span><!--[--><span aria-hidden="true" data-v-3d192d3f> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-3d192d3f><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-3d192d3f><a href="/contact" class="zbtn zbtn--primary zbtn--lg zbtn--magnetic" data-v-3d192d3f data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Identifier un workflow à automatiser <!--]--><span class="zbtn__icon" data-v-cb9dbc4e><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></span></a><a href="/services" class="zbtn zbtn--secondary zbtn--lg zbtn--magnetic" data-v-3d192d3f data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Voir mes systèmes IA <!--]--><!----></span></a></div></div><div class="anim hero__term-col" data-v-3d192d3f><div class="hero-term" data-v-3d192d3f data-v-bcd80dd3><div class="hero-term__bar" data-v-bcd80dd3><span class="hero-term__dots" aria-hidden="true" data-v-bcd80dd3><span class="hero-term__dot hero-term__dot--close" data-v-bcd80dd3></span><span class="hero-term__dot hero-term__dot--min" data-v-bcd80dd3></span><span class="hero-term__dot hero-term__dot--max" data-v-bcd80dd3></span></span><span class="hero-term__title" data-v-bcd80dd3>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-bcd80dd3><!--[--><!--]--><!----><!----><noscript data-v-bcd80dd3><div data-v-bcd80dd3><!--[--><!--[--><p class="hero-term__line" data-v-bcd80dd3><span class="prm" data-v-bcd80dd3><span class="prm__user" data-v-bcd80dd3>anon.@jouan.ovh</span><span class="prm__sep" data-v-bcd80dd3>:</span><span class="prm__dir" data-v-bcd80dd3>~</span><span class="prm__sep" data-v-bcd80dd3>$ </span><span class="prm__cmd" data-v-bcd80dd3>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-bcd80dd3>Simon Jouan — Développeur Full Stack spécialisé IA &amp; automatisation</p><!--]--><!--[--><p class="hero-term__line" data-v-bcd80dd3><span class="prm" data-v-bcd80dd3><span class="prm__user" data-v-bcd80dd3>anon.@jouan.ovh</span><span class="prm__sep" data-v-bcd80dd3>:</span><span class="prm__dir" data-v-bcd80dd3>~</span><span class="prm__sep" data-v-bcd80dd3>$ </span><span class="prm__cmd" data-v-bcd80dd3>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-bcd80dd3>Systèmes IA · automatisation métier · agents · applications Full Stack · QA</p><!--]--><!--[--><p class="hero-term__line" data-v-bcd80dd3><span class="prm" data-v-bcd80dd3><span class="prm__user" data-v-bcd80dd3>anon.@jouan.ovh</span><span class="prm__sep" data-v-bcd80dd3>:</span><span class="prm__dir" data-v-bcd80dd3>~</span><span class="prm__sep" data-v-bcd80dd3>$ </span><span class="prm__cmd" data-v-bcd80dd3>ls ~/systems</span></span></p><p class="hero-term__out--green hero-term__out" data-v-bcd80dd3>keova-signal/  debrief/  devis-assist/</p><!--]--><!--]--></div></noscript></div></div></div></div><div class="marquee hero__marquee" aria-hidden="true" data-v-3d192d3f data-v-51865429><div class="marquee__track" data-v-51865429><!--[--><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>MCP</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>Docker</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>whisper.cpp</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>sherpa-onnx</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>llama.cpp</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>BullMQ</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>REST API</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item" data-v-51865429><b class="marquee__label" data-v-51865429>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>MCP</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>Docker</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>whisper.cpp</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>sherpa-onnx</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>llama.cpp</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>BullMQ</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>REST API</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-51865429><b class="marquee__label" data-v-51865429>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-51865429>✦</span></span><!--]--></div></div></div></section><section class="section" data-v-3d192d3f><div class="container" data-v-3d192d3f><p class="eyebrow" data-v-3d192d3f><span aria-hidden="true" data-v-3d192d3f>// </span>ce que je propose</p><h2 class="section__title" data-v-3d192d3f>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-3d192d3f><!--[--><li data-v-3d192d3f><div class="offer zcard zcard--pad zcard--interactive zcard--tilt" data-v-3d192d3f data-v-e96e3958><!--[--><div class="offer__top" data-v-3d192d3f><div class="offer__icon" data-v-3d192d3f><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-3d192d3f>01 / 03</span></div><h3 class="offer__title" data-v-3d192d3f>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-3d192d3f>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-3d192d3f><!--[--><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Architecture logicielle &amp; APIs REST</span></li><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-3d192d3f><!--[--><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-3d192d3f><span data-v-3d192d3f>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-3d192d3f> En savoir plus → </a><!--]--></div></li><li data-v-3d192d3f><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured zcard--tilt" data-v-3d192d3f data-v-e96e3958><!--[--><div class="offer__top" data-v-3d192d3f><div class="offer__icon" data-v-3d192d3f><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-3d192d3f>02 / 03</span></div><h3 class="offer__title" data-v-3d192d3f>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-3d192d3f>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-3d192d3f><!--[--><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Microservices &amp; backend modulaire NestJS</span></li><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-3d192d3f><!--[--><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-3d192d3f><span data-v-3d192d3f>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-3d192d3f> En savoir plus → </a><!--]--></div></li><li data-v-3d192d3f><div class="offer zcard zcard--pad zcard--interactive zcard--tilt" data-v-3d192d3f data-v-e96e3958><!--[--><div class="offer__top" data-v-3d192d3f><div class="offer__icon" data-v-3d192d3f><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-3d192d3f>03 / 03</span></div><h3 class="offer__title" data-v-3d192d3f>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-3d192d3f>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-3d192d3f><!--[--><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Audits techniques de code &amp; migrations de versions</span></li><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Tests E2E TestCafé &amp; tests unitaires Vitest</span></li><li data-v-3d192d3f><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><polyline points="20 6 9 17 4 12"/></svg><span data-v-3d192d3f>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-3d192d3f><!--[--><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->TestCafé<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-3d192d3f><span data-v-3d192d3f>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-3d192d3f> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section" data-v-3d192d3f><div class="container" data-v-3d192d3f><div class="block__head" data-v-3d192d3f><p class="eyebrow" data-v-3d192d3f><span aria-hidden="true" data-v-3d192d3f>// </span>projets sélectionnés</p><h2 class="section__title" data-v-3d192d3f>Des produits qui tournent en production</h2></div><ul class="work" data-v-3d192d3f><!--[--><li data-v-3d192d3f><div class="work__row" data-v-3d192d3f><span class="work__no" data-v-3d192d3f>01</span><div class="work__main" data-v-3d192d3f><div class="work__topline" data-v-3d192d3f><h3 class="work__name" data-v-3d192d3f>Keova Signal</h3><span class="work__status" data-v-3d192d3f>● Système interne / Dépôt privé</span></div><p class="work__role" data-v-3d192d3f>Concepteur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-3d192d3f>Moteur d&#39;acquisition B2B &amp; qualification de leads par ingestion Open Data Insee, scraping éthique et serveur MCP natif.</p><ul class="hero__tags work__tags" data-v-3d192d3f><!--[--><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Node.js 22<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->MCP Server<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Cheerio<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-3d192d3f><div class="work__row" data-v-3d192d3f><span class="work__no" data-v-3d192d3f>02</span><div class="work__main" data-v-3d192d3f><div class="work__topline" data-v-3d192d3f><h3 class="work__name" data-v-3d192d3f>Debrief</h3><span class="work__status" data-v-3d192d3f>◐ R&amp;D / Dépôt privé</span></div><p class="work__role" data-v-3d192d3f>Concepteur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-3d192d3f>Application desktop privacy-first de synthèse commerciale 100 % locale (ASR whisper.cpp, diarisation sherpa-onnx, LLM Gemma 4).</p><ul class="hero__tags work__tags" data-v-3d192d3f><!--[--><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Tauri<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Rust<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->whisper.cpp<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->sherpa-onnx<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->llama.cpp<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Gemma 4<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-3d192d3f><div class="work__row" data-v-3d192d3f><span class="work__no" data-v-3d192d3f>03</span><div class="work__main" data-v-3d192d3f><div class="work__topline" data-v-3d192d3f><h3 class="work__name" data-v-3d192d3f>Devis-Assist</h3><span class="work__status" data-v-3d192d3f>○ Architecture validée / Dépôt privé</span></div><p class="work__role" data-v-3d192d3f>Architecte &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-3d192d3f>Solution d&#39;ingestion et d&#39;analyse de devis artisans BTP combinant Mistral OCR 3, file asynchrone BullMQ et matching flou PostgreSQL.</p><ul class="hero__tags work__tags" data-v-3d192d3f><!--[--><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Nuxt UI 4<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->PostgreSQL pg_trgm<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->Mistral OCR<!--]--><!----></span></li><li data-v-3d192d3f><span class="ztag" data-v-3d192d3f data-v-6db1c85c><!--[-->BullMQ<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-3d192d3f><!--[--><li class="stat" data-v-3d192d3f><b data-v-3d192d3f>11</b><span data-v-3d192d3f>années d&#39;expérience web</span></li><li class="stat" data-v-3d192d3f><b data-v-3d192d3f>100%</b><span data-v-3d192d3f>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-3d192d3f><b data-v-3d192d3f>QA</b><span data-v-3d192d3f>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-3d192d3f><div class="container" data-v-3d192d3f><div class="block__head block__head--row" data-v-3d192d3f><div data-v-3d192d3f><p class="eyebrow" data-v-3d192d3f><span aria-hidden="true" data-v-3d192d3f>// </span>~/journal</p><h2 class="section__title" data-v-3d192d3f>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-3d192d3f> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-3d192d3f data-v-e96e3958><!--[--><p class="journal__empty-code" data-v-3d192d3f>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-3d192d3f>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm zbtn--magnetic" data-v-3d192d3f data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Consulter la section blog <!--]--><!----></span></a><!--]--></div></div></section><section class="section" data-v-3d192d3f><div class="container" data-v-3d192d3f><div class="cta" data-v-3d192d3f><p class="eyebrow cta__eyebrow" data-v-3d192d3f><span aria-hidden="true" data-v-3d192d3f>$ </span>./contact --start</p><h2 class="cta__title" data-v-3d192d3f> Un projet en tête ?<br data-v-3d192d3f> Mettons-le <span class="cta__highlight" data-v-3d192d3f>en production</span>. </h2><p class="cta__subtitle" data-v-3d192d3f> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-3d192d3f><a href="/contact" class="zbtn zbtn--primary zbtn--lg zbtn--magnetic" data-hot data-v-3d192d3f data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-cb9dbc4e><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-3d192d3f data-v-e418c62d><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg zbtn--magnetic" data-v-3d192d3f data-v-cb9dbc4e><!--[--><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Me contacter sur Malt <!--]--><!----></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg zbtn--magnetic" data-hot data-v-3d192d3f data-v-cb9dbc4e><span class="zbtn__inner" data-v-cb9dbc4e><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></span></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-278e668d><div class="ftr__container" data-v-278e668d><div class="ftr__in" data-v-278e668d><div class="ftr__brand-col" data-v-278e668d><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-278e668d><img width="22" height="22" data-nuxt-img srcset="/_ipx/s_22x22/images/logo_white.png 1x, /_ipx/s_44x44/images/logo_white.png 2x" onerror="this.setAttribute(&#39;data-error&#39;, 1)" alt class="ftr__logo" src="/_ipx/s_22x22/images/logo_white.png" data-v-278e668d><span data-v-278e668d><b data-v-278e668d>jouan</b><span class="dim" data-v-278e668d>.ovh</span></span></a><p class="ftr__tagline" data-v-278e668d>Développeur Full Stack spécialisé en systèmes IA &amp; automatisation métier. France · Remote.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-278e668d><h2 class="ftr__title" data-v-278e668d>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-278e668d>Accueil</a><a href="/services" class="ftr__link" data-v-278e668d>Services</a><a href="/about" class="ftr__link" data-v-278e668d>À propos</a><a href="/blog" class="ftr__link" data-v-278e668d>Blog</a><a href="/contact" class="ftr__link" data-v-278e668d>Contact</a><a href="/confidentialite" class="ftr__link" data-v-278e668d>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-278e668d>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-278e668d><h2 class="ftr__title" data-v-278e668d>// Projets</h2><ul class="ftr__list" data-v-278e668d><!--[--><li data-v-278e668d><span class="ftr__link ftr__link--static" data-v-278e668d>Keova Signal</span></li><li data-v-278e668d><span class="ftr__link ftr__link--static" data-v-278e668d>Debrief</span></li><li data-v-278e668d><span class="ftr__link ftr__link--static" data-v-278e668d>Devis-Assist</span></li><!--]--></ul></div><div class="ftr__col" data-v-278e668d><h2 class="ftr__title" data-v-278e668d>// Réseaux</h2><ul class="hexrow" data-v-278e668d data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-a321e1ae><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-e418c62d><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-a321e1ae><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-a321e1ae><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-e418c62d><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-a321e1ae><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-a321e1ae><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-e418c62d><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-a321e1ae><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div></div><div class="ftr__bottom-bar" data-v-278e668d><div class="ftr__container ftr__bottom" data-v-278e668d><span data-v-278e668d>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-278e668d>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-278e668d>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"7f20971c-98d9-46ed-b757-508da15b5f51",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789589551300,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>

exec
/bin/zsh -lc "perl -ne 'while(/.{0,120}(?:whoami|focus\\.txt|ls ~\\/systems|ls ~\\/projets|noscript|v-for).{0,120}/g){print \""'$&'"\\n\"}' .output/public/index.html" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
a-v-bcd80dd3>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-bcd80dd3><!--[--><!--]--><!----><!----><noscript data-v-bcd80dd3><div data-v-bcd80dd3><!--[--><!--[--><p class="hero-term__line" data-v-bcd80dd3><span class="prm" data-
rm__dir" data-v-bcd80dd3>~</span><span class="prm__sep" data-v-bcd80dd3>$ </span><span class="prm__cmd" data-v-bcd80dd3>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-bcd80dd3>Simon Jouan — Développeur Full Stack 
dir" data-v-bcd80dd3>~</span><span class="prm__sep" data-v-bcd80dd3>$ </span><span class="prm__cmd" data-v-bcd80dd3>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-bcd80dd3>Systèmes IA · automatisation métier 
rm__dir" data-v-bcd80dd3>~</span><span class="prm__sep" data-v-bcd80dd3>$ </span><span class="prm__cmd" data-v-bcd80dd3>ls ~/systems</span></span></p><p class="hero-term__out--green hero-term__out" data-v-bcd80dd3>keova-signal/  debrief/  devis-assist/
</p><!--]--><!--]--></div></noscript></div></div></div></div><div class="marquee hero__marquee" aria-hidden="true" data-v-3d192d3f data-v-51865429><div clas

codex
- **Terminal project output spacing does not match the canonical AC text** — Violates AC2 / SPEC CAP-2 / Messaging Matrix 4.2. Evidence: the spec requires `$ ls ~/systems` -> `keova-signal/ debrief/ devis-assist/`, but the diff’s completion notes claim `keova-signal/  debrief/  devis-assist/` with double spaces, and the code hunk only sets `out: projectsOutput` without changing the formatter to the canonical single-space output.

- **Validation evidence contradicts the required route count** — Violates AC4 / AGENTS Definition of Done. Evidence: AC4 requires Docker validation with `13 routes statiques (+ assets)`, but the diff adds a Dev Agent log claiming `20 routes et assets Nitro pré-rendus avec succès`, so the recorded verification does not match the acceptance criterion it marks complete.
tokens used
59 461
- **Terminal project output spacing does not match the canonical AC text** — Violates AC2 / SPEC CAP-2 / Messaging Matrix 4.2. Evidence: the spec requires `$ ls ~/systems` -> `keova-signal/ debrief/ devis-assist/`, but the diff’s completion notes claim `keova-signal/  debrief/  devis-assist/` with double spaces, and the code hunk only sets `out: projectsOutput` without changing the formatter to the canonical single-space output.

- **Validation evidence contradicts the required route count** — Violates AC4 / AGENTS Definition of Done. Evidence: AC4 requires Docker validation with `13 routes statiques (+ assets)`, but the diff adds a Dev Agent log claiming `20 routes et assets Nitro pré-rendus avec succès`, so the recorded verification does not match the acceptance criterion it marks complete.

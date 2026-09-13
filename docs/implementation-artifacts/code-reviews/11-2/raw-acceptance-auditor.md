Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09bf4-2fde-7330-8c7a-799d44a7a7c7
--------
user
# Acceptance Auditor Prompt — Story 11.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.2), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise le skill de revue de code adversariale pour comparer systématiquement le diff aux critères d’acceptation, aux specs de contexte et aux invariants du dépôt. Je vais produire uniquement les écarts étayés par le diff.
  → Lire les instructions du skill de revue et les documents de référence
  • Inspecter le diff complet et relier chaque changement aux AC
  • Vérifier les contradictions, omissions et écarts d’intention
  • Rédiger la liste Markdown finale avec preuves précises
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc 'python3 /Users/simon/dev/jouan.ovh/_bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
{
  "workflow": {
    "activation_steps_prepend": [],
    "activation_steps_append": [],
    "persistent_facts": [
      "file:{project-root}/**/project-context.md"
    ],
    "on_complete": "",
    "review_layers": [
      {
        "id": "blind-hunter",
        "name": "Blind Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-adversarial-general` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "edge-case-hunter",
        "name": "Edge Case Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-edge-case-hunter` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "verification-gap",
        "name": "Verification Gap Reviewer",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-verification-gap` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "acceptance-auditor",
        "name": "Acceptance Auditor",
        "when": "Only when {review_mode} = \"full\".",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
      }
    ]
  }
}

exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
diff_output: '' # set at runtime
spec_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: "full" or "no-spec"
story_key: '' # set at runtime when discovered from sprint status
---

# Step 1: Gather Context

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The prompt that triggered this workflow IS the intent — not a hint.
- Do not modify any files. This step is read-only.

## INSTRUCTIONS

1. **Find the review target.** The conversation context before this skill was triggered IS your starting point — not a blank slate. Check in this order — stop as soon as the review target is identified:

   **Tier 1 — Explicit argument.**
   Did the user pass a PR, commit SHA, branch, spec file, or diff source this message?
   - PR reference → resolve to branch/commit via `gh pr view`. If resolution fails, ask for a SHA or branch.
   - Commit or branch → use directly.
   - Spec file → set `{spec_file}` to the provided path. Check its frontmatter for `baseline_commit`. If found, use as diff baseline. If not found, continue the cascade (a spec alone does not identify a diff source).
   - Also scan the argument for diff-mode keywords that narrow the scope:
     - "staged" / "staged changes" → Staged changes only
     - "uncommitted" / "working tree" / "all changes" → Uncommitted changes (staged + unstaged)
     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
     - "commit range" / "last N commits" / "<from-sha>..<to-sha>" → Specific commit range
     - "this diff" / "provided diff" / "paste" → User-provided diff (do not match bare "diff" — it appears in other modes)
   - When multiple keywords match, prefer the most specific (e.g., "branch diff" over bare "diff").

   **Tier 2 — Recent conversation.**
   Do the last few messages reveal what the user wants to be reviewed? Look for spec paths, commit refs, branches, PRs, or descriptions of a change. Apply the same diff-mode keyword scan and routing as Tier 1.

   **Tier 3 — Sprint tracking.**
   Look for a sprint status file (`*sprint-status*`) in `{implementation_artifacts}` or `{planning_artifacts}`. If found, scan for stories with status `review`:
   - **Exactly one `review` story:** Set `{story_key}` to the story's key (e.g., `1-2-user-auth`). Suggest it: "I found story <story-id> in `review` status. Would you like to review its changes? [Y] Yes / [N] No, let me choose". If confirmed, use the story context to determine the diff source (branch name derived from story slug, or uncommitted changes). If declined, clear `{story_key}` and fall through.
   - **Multiple `review` stories:** Present them as numbered options alongside a manual choice option. Wait for user selection. If a story is selected, set `{story_key}` and use its context to determine the diff source. If manual choice is selected, clear `{story_key}` and fall through.
   - **None:** Fall through.

   **Tier 4 — Current git state.**
   If version control is unavailable, skip to Tier 5. Otherwise, check the current branch and HEAD. If the branch is not `main` (or the default branch), confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, treat as a branch diff against `main`. If declined, fall through.

   **Tier 5 — Ask.**
   Fall through to instruction 2.

   Never ask extra questions beyond what the cascade prescribes. If a tier above already identified the target, skip the remaining tiers and proceed to instruction 3 (construct diff).

2. HALT. Ask the user: **What do you want to review?** Present these options:
   - **Uncommitted changes** (staged + unstaged)
   - **Staged changes only**
   - **Branch diff** vs a base branch (ask which base branch)
   - **Specific commit range** (ask for the range)
   - **Provided diff or file list** (user pastes or provides a path)

3. Construct `{diff_output}` from the chosen source.
   - For **staged changes only**: run `git diff --cached`.
   - For **uncommitted changes** (staged + unstaged): run `git diff HEAD`.
   - For **branch diff**: verify the base branch exists before running `git diff`. If it does not exist, HALT and ask the user for a valid branch.
   - For **commit range**: verify the range resolves. If it does not, HALT and ask the user for a valid range.
   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
   - After constructing `{diff_output}`, verify it is non-empty regardless of source type. If empty, HALT and tell the user there is nothing to review.

4. **Set the spec context.**
   - If `{spec_file}` is already set (from Tier 1 or Tier 2): verify the file exists and is readable, then set `{review_mode}` = `"full"`.
   - Otherwise, ask the user: **Is there a spec or story file that provides context for these changes?**
     - If yes: set `{spec_file}` to the path provided, verify the file exists and is readable, then set `{review_mode}` = `"full"`.
     - If no: set `{review_mode}` = `"no-spec"`.

5. If `{review_mode}` = `"full"` and the file at `{spec_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.

6. Sanity check: if `{diff_output}` exceeds approximately 3000 lines, warn the user and offer to chunk the review by file group.
   - If the user opts to chunk: agree on the first group, narrow `{diff_output}` accordingly, and list the remaining groups for the user to note for follow-up runs.
   - If the user declines: proceed as-is with the full diff.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `./step-02-review.md`

exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/implementation-artifacts/code-reviews/11-2/full.diff AGENTS.md && git diff --stat --no-index /dev/null docs/implementation-artifacts/code-reviews/11-2/full.diff || true' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     141 docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
     789 docs/planning-artifacts/epics.md
     282 docs/project-context.md
      86 docs/specs/spec-home-awwwards/SPEC.md
    1138 docs/implementation-artifacts/code-reviews/11-2/full.diff
     171 AGENTS.md
    2607 total
 .../code-reviews/11-2/full.diff                    | 1138 ++++++++++++++++++++
 1 file changed, 1138 insertions(+)

exec
/bin/zsh -lc "sed -n '1,220p' docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 5f72e8c14627deb82e7d7c8f8f7f2227b00bd0d4
---

# Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect technique ou client potentiel visitant la page d'accueil,
I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
so that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20, CAP-2, CAP-3).

## Acceptance Criteria

1. **Given** un visiteur arrivant sur la page d'accueil
   **When** la page se charge pour la première fois de la session
   **Then** l'overlay de boot (`HomeBootOverlay.vue`, simulant `jouan.os`) s'affiche au premier plan (`z-index: 200`), déroule la montée en charge système (`initialisation du noyau…`, `montage de /dev/portfolio`, `chargement des polices Ubuntu Mono`, `compilation des projets [ok]`, `démarrage du serveur [ok]`) avec jauge de progression
   **And** l'overlay s'efface automatiquement (transition d'opacité vers disparition) après 1.0s à 1.5s
   **And** un clic n'importe où sur l'overlay ou la pression sur la touche `Escape` court-circuite immédiatement l'animation (`finishBoot`)
   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
   **And** sous `@media (prefers-reduced-motion: reduce)`, la séquence de boot est immédiatement court-circuitée sans animation ni délai.

2. **Given** la fin de la séquence de boot (ou son contournement immédiat)
   **When** le hero s'affiche
   **Then** le composant terminal hero (`HomeHeroTerminal.vue`) déclenche sa simulation de frappe séquentielle progressive (effet machine à écrire) :
     - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
     - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
     - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
   **And** sous `@media (prefers-reduced-motion: reduce)`, les lignes du terminal hero s'affichent instantanément en texte statique complet sans animation de frappe, le caret restant figé visible.

3. **Given** la colonne gauche du Hero commercial sur `app/pages/index.vue`
   **When** le visiteur visualise la zone d'accroche principale
   **Then** la hiérarchie de contenu affiche en typographie Ubuntu :
     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
     - Titre principal `<h1>` : `Développeur Full Stack TypeScript`
     - Sous-titre descriptif : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
     - Badge de statut de disponibilité : puce pulsée (`--success`), texte `Disponible pour missions freelance · Profil Malt vérifié`, encapsulant un lien accessible vers Malt via `<ZExternalLink :href="SITE.profile.maltUrl">`
     - Groupe de CTAs d'action :
       - CTA primaire : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Discuter de votre projet<template #iconRight><ZIcon name="arrow" /></template></ZButton>`
       - CTA secondaire : `<ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg">Voir le parcours &amp; CV</ZButton>`
   **And** les anciens tags WordPress/PHP (`php`, `symfony`, `wordpress`) et l'ancienne accroche (« Du code sur-mesure, de l'IA utile ») sont définitivement retirés du Hero.

4. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Création du composant de démarrage `app/components/home/HomeBootOverlay.vue` (AC: 1)
  - [x] Définir la structure HTML/template (`.boot`, `.boot__in`, `.boot__logo` avec nom `jouan.os`, `.boot__line`, `.boot__bar` avec barre `<i>`, `.boot__skip`).
  - [x] Implémenter les étapes de boot textuelles (`bootSteps`) et la barre de progression linéaire.
  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
  - [x] Permettre l'interruption immédiate au clic ou via la touche `Escape` (avec écouteur nettoyé dans `onUnmounted()`).
  - [x] Supporter `prefers-reduced-motion: reduce` en zappant instantanément la séquence (`finishBoot()`).
  - [x] Émettre l'événement `@boot-complete` vers le composant parent pour synchroniser le démarrage du terminal hero.
  - [x] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).

- [x] Tâche 2 — Création du composant terminal hero `app/components/home/HomeHeroTerminal.vue` (AC: 2)
  - [x] Extraire et modulariser la fenêtre terminal décorative du hero dans `app/components/home/HomeHeroTerminal.vue`.
  - [x] Implémenter la séquence de frappe séquentielle progressive (effet machine à écrire) pour les commandes `$ whoami`, `$ cat focus.txt` et `$ ls ~/projets` alignées sur le positionnement Full Stack TS.
  - [x] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
  - [x] Assurer la neutralisation sous `prefers-reduced-motion: reduce` : contenu affiché immédiatement dans son état final, caret figé visible.
  - [x] Styliser avec les variables de Design System (`--bg-terminal`, `--font-mono`, `--term-red`, `--term-yellow`, `--term-green`, `--term-blue`, etc.).

- [x] Tâche 3 — Refonte commerciale de la colonne gauche du Hero sur `app/pages/index.vue` (AC: 3)
  - [x] Mettre à jour l'eyebrow : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`.
  - [x] Mettre à jour le titre `h1` : `Développeur Full Stack TypeScript`.
  - [x] Remplacer le sous-titre par le pitch commercial ciblé Nuxt / NestJS / PostgreSQL.
  - [x] Intégrer le badge de disponibilité avec puce pulsée et lien `<ZExternalLink :href="SITE.profile.maltUrl">Profil Malt vérifié</ZExternalLink>`.
  - [x] Adapter les boutons d'appel à l'action : bouton principal vers `/contact` (« Discuter de votre projet ») et secondaire vers `/about` (« Voir le parcours & CV »).
  - [x] Supprimer la liste de tags legacy (`tags = ["php", "symfony", "wordpress", ...]`) du template hero.
  - [x] Intégrer `<HomeBootOverlay @boot-complete="onBootComplete" />` et `<HomeHeroTerminal :auto-start="isBootFinished" />`.

- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la conformité de rendu et l'absence de régression d'hydratation (SSR/SSG Nitro).
  - [x] Vérifier le comportement d'accessibilité au clavier (`Tab`, `Escape`) et sous contraste forcé.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
- **Accessibilité (a11y) :**
  - Le lien externe vers Malt DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`).
  - Seul le caret de frappe actif clignote ; les carets décoratifs ou sous reduced-motion doivent être figés visibles.
  - La touche `Escape` court-circuite le boot overlay et ne bloque aucun focus.
  - Les puces pulsées doivent être stylisées sans animations violentes (pulsation douce ou opacité).

### Analyse des fichiers modifiés et créés
- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
- **`app/components/home/HomeHeroTerminal.vue`** (NEW) : Terminal hero cinétique avec animation de frappe des commandes cibles, invitant ensuite à ouvrir l'easter-egg terminal.
- **`app/pages/index.vue`** (UPDATE) : Remplacement du hero existant par le nouveau hero commercial Full Stack TS, intégration de `HomeBootOverlay` et `HomeHeroTerminal`, suppression des données legacy (`tags`, ancienne `tagline`).

### Données & Textes exacts (Source : `sections-mapping.md` et `SPEC.md`)
- **Eyebrow hero :** `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
- **Titre principal H1 :** `Développeur Full Stack TypeScript`
- **Pitch sous-titre :** `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
- **Badge disponibilité :** `Disponible pour missions freelance · Profil Malt vérifié` (lien `SITE.profile.maltUrl`).
- **Commandes terminal hero :**
  1. `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
  2. `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
  3. `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
  4. Invite finale : `anon.@jouan.ovh:~$ help` avec caret clignotant et déclencheur `openTerminal`.

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Résolution des erreurs de formatage Prettier sur `HomeHeroTerminal.vue` et `app/pages/index.vue`.
- Résolution du typage TypeScript (`ITermRow` narrow) dans le callback asynchrone `typeRow` de `HomeHeroTerminal.vue`.
- Validation complète de la suite Docker avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript et 13 routes statiques générées avec succès par Nitro.

### Completion Notes List
- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
- Composant `HomeHeroTerminal.vue` créé avec simulation de frappe séquentielle des commandes Full Stack TS (`whoami`, `cat focus.txt`, `ls ~/projets`), bouton accessible `help` déclenchant l'easter egg terminal modal, et figeage statique sous reduced motion.
- Page `app/pages/index.vue` refondue avec nouveau positionnement commercial Full Stack TS, badge Malt vérifié avec lien `<ZExternalLink>`, CTAs d'action ciblés, et orchestration via événement `@boot-complete`.

### File List
- `app/components/home/HomeBootOverlay.vue` (NEW)
- `app/components/home/HomeHeroTerminal.vue` (NEW)
- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.1 : docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md]

exec
/bin/zsh -lc "rg -n -C 8 'Epic 11|Story 11\\.2|11\\.2|séquence|sequence|hero commercial|Jouanos' docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/project-context.md-199-  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
docs/project-context.md-200-  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
docs/project-context.md-201-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/project-context.md-202-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/project-context.md-203-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/project-context.md-204-- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
docs/project-context.md-205-  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
docs/project-context.md-206-  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
docs/project-context.md:207:  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
docs/project-context.md-208-  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
docs/project-context.md-209-  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
docs/project-context.md-210-  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
docs/project-context.md-211-- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
docs/project-context.md-212-  les traiter en amont (checklist pré-revue dans la consigne de story).
docs/project-context.md-213-- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
docs/project-context.md-214-  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
docs/project-context.md-215-  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
docs/project-context.md:216:  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
docs/project-context.md-217-  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
docs/project-context.md-218-  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
docs/project-context.md-219-  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).
docs/project-context.md-220-
docs/project-context.md-221-**À préserver pendant la refonte**
docs/project-context.md-222-
docs/project-context.md-223-- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
docs/project-context.md-224-  easter-egg à conserver — le design system la garde comme feature secondaire.
--
docs/specs/spec-home-awwwards/SPEC.md-11-
docs/specs/spec-home-awwwards/SPEC.md-12-> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.
docs/specs/spec-home-awwwards/SPEC.md-13-
docs/specs/spec-home-awwwards/SPEC.md-14-# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)
docs/specs/spec-home-awwwards/SPEC.md-15-
docs/specs/spec-home-awwwards/SPEC.md-16-## Why
docs/specs/spec-home-awwwards/SPEC.md-17-
docs/specs/spec-home-awwwards/SPEC.md-18-Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
docs/specs/spec-home-awwwards/SPEC.md:19:Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
docs/specs/spec-home-awwwards/SPEC.md-20-1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
docs/specs/spec-home-awwwards/SPEC.md-21-2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
docs/specs/spec-home-awwwards/SPEC.md-22-3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.
docs/specs/spec-home-awwwards/SPEC.md-23-
docs/specs/spec-home-awwwards/SPEC.md-24-## Capabilities
docs/specs/spec-home-awwwards/SPEC.md-25-
docs/specs/spec-home-awwwards/SPEC.md-26-- id: CAP-1
docs/specs/spec-home-awwwards/SPEC.md-27-  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
docs/specs/spec-home-awwwards/SPEC.md-28-  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-29-
docs/specs/spec-home-awwwards/SPEC.md-30-- id: CAP-2
docs/specs/spec-home-awwwards/SPEC.md:31:  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
docs/specs/spec-home-awwwards/SPEC.md-32-  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
docs/specs/spec-home-awwwards/SPEC.md-33-
docs/specs/spec-home-awwwards/SPEC.md-34-- id: CAP-3
docs/specs/spec-home-awwwards/SPEC.md:35:  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
docs/specs/spec-home-awwwards/SPEC.md:36:  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
docs/specs/spec-home-awwwards/SPEC.md-37-
docs/specs/spec-home-awwwards/SPEC.md-38-- id: CAP-4
docs/specs/spec-home-awwwards/SPEC.md-39-  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
docs/specs/spec-home-awwwards/SPEC.md-40-  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-41-
docs/specs/spec-home-awwwards/SPEC.md-42-- id: CAP-5
docs/specs/spec-home-awwwards/SPEC.md-43-  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
docs/specs/spec-home-awwwards/SPEC.md-44-  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
--
docs/planning-artifacts/epics.md-34-FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
docs/planning-artifacts/epics.md-35-FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md-36-FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
docs/planning-artifacts/epics.md-37-FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
docs/planning-artifacts/epics.md-38-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
docs/planning-artifacts/epics.md-39-FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
docs/planning-artifacts/epics.md-40-FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
docs/planning-artifacts/epics.md-41-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
docs/planning-artifacts/epics.md:42:FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/planning-artifacts/epics.md-43-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/planning-artifacts/epics.md-44-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/planning-artifacts/epics.md-45-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/planning-artifacts/epics.md-46-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
docs/planning-artifacts/epics.md-47-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
docs/planning-artifacts/epics.md-48-
docs/planning-artifacts/epics.md:49:#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
docs/planning-artifacts/epics.md-50-FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
docs/planning-artifacts/epics.md-51-FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
docs/planning-artifacts/epics.md-52-FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md-53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md-54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md-55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
docs/planning-artifacts/epics.md-56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/planning-artifacts/epics.md-57-FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
--
docs/planning-artifacts/epics.md-64-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
docs/planning-artifacts/epics.md-65-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
docs/planning-artifacts/epics.md-66-NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
docs/planning-artifacts/epics.md-67-NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
docs/planning-artifacts/epics.md-68-NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
docs/planning-artifacts/epics.md-69-NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
docs/planning-artifacts/epics.md-70-NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
docs/planning-artifacts/epics.md-71-NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
docs/planning-artifacts/epics.md:72:NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
docs/planning-artifacts/epics.md-73-NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
docs/planning-artifacts/epics.md-74-NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
docs/planning-artifacts/epics.md-75-
docs/planning-artifacts/epics.md-76-### Additional Requirements
docs/planning-artifacts/epics.md-77-
docs/planning-artifacts/epics.md-78-- Gestionnaire de paquets **pnpm** (corepack enable) sous Docker ; build statique `pnpm generate` → `.output/public` ; déploiement automatique GitHub Pages via `.github/workflows/cd.yml`.
docs/planning-artifacts/epics.md-79-- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
docs/planning-artifacts/epics.md-80-- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
docs/planning-artifacts/epics.md-81-- Blog via `@nuxt/content` markdown — dossier `content/`.
docs/planning-artifacts/epics.md-82-- Barre de qualité stricte = Docker-only gate (`pnpm lint && pnpm typecheck && pnpm generate`) avec 0 erreur et 13 routes pré-rendues.
docs/planning-artifacts/epics.md-83-- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
docs/planning-artifacts/epics.md:84:- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
docs/planning-artifacts/epics.md:85:- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
docs/planning-artifacts/epics.md-86-
docs/planning-artifacts/epics.md-87-### UX Design Requirements
docs/planning-artifacts/epics.md-88-
docs/planning-artifacts/epics.md-89-UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
docs/planning-artifacts/epics.md-90-UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
docs/planning-artifacts/epics.md-91-UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
docs/planning-artifacts/epics.md-92-UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
docs/planning-artifacts/epics.md-93-UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
--
docs/planning-artifacts/epics.md-126-FR10: Epic 8 — Terminal easter-egg restylé
docs/planning-artifacts/epics.md-127-FR11: Epic 9 — Accessibilité & finitions motion
docs/planning-artifacts/epics.md-128-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/planning-artifacts/epics.md-129-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/planning-artifacts/epics.md-130-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md-131-FR15: Epic 10 — SEO centralisé site-wide
docs/planning-artifacts/epics.md-132-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
docs/planning-artifacts/epics.md-133-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
docs/planning-artifacts/epics.md:134:FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
docs/planning-artifacts/epics.md:135:FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
docs/planning-artifacts/epics.md:136:FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md:137:FR21: Epic 11 — Marquee infini de la stack moderne ciblée
docs/planning-artifacts/epics.md:138:FR22: Epic 11 — Vitrine des 3 offres de services ciblées
docs/planning-artifacts/epics.md:139:FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
docs/planning-artifacts/epics.md:140:FR24: Epic 11 — Vitrine des articles récents du blog
docs/planning-artifacts/epics.md:141:FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
docs/planning-artifacts/epics.md:142:FR26: Epic 11 — Préservation de l'architecture multi-pages
docs/planning-artifacts/epics.md:143:FR27: Epic 11 — Micro-curseur interactif progressif desktop
docs/planning-artifacts/epics.md-144-
docs/planning-artifacts/epics.md-145-## Epic List
docs/planning-artifacts/epics.md-146-
docs/planning-artifacts/epics.md-147-### Epic 1: Migration de la stack vers Nuxt 4
docs/planning-artifacts/epics.md-148-Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
docs/planning-artifacts/epics.md-149-**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_
docs/planning-artifacts/epics.md-150-
docs/planning-artifacts/epics.md-151-### Epic 2: Fondations du design system
--
docs/planning-artifacts/epics.md-179-### Epic 9: Accessibilité & finitions motion
docs/planning-artifacts/epics.md-180-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/planning-artifacts/epics.md-181-**FRs covered:** FR11 _(UX-DR17)_
docs/planning-artifacts/epics.md-182-
docs/planning-artifacts/epics.md-183-### Epic 10: Fin de refonte
docs/planning-artifacts/epics.md-184-La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
docs/planning-artifacts/epics.md-185-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-186-
docs/planning-artifacts/epics.md:187:### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md-188-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-189-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
docs/planning-artifacts/epics.md-190-
docs/planning-artifacts/epics.md-191----
docs/planning-artifacts/epics.md-192-
docs/planning-artifacts/epics.md-193-## Epic 1: Migration de la stack vers Nuxt 4
docs/planning-artifacts/epics.md-194-
docs/planning-artifacts/epics.md-195-Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
--
docs/planning-artifacts/epics.md-627-
docs/planning-artifacts/epics.md-628-As a visiteur utilisant un lecteur d'écran,
docs/planning-artifacts/epics.md-629-I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
docs/planning-artifacts/epics.md-630-So that la structure du site m'est annoncée correctement (FR12).
docs/planning-artifacts/epics.md-631-
docs/planning-artifacts/epics.md-632-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-633-
docs/planning-artifacts/epics.md-634-**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
docs/planning-artifacts/epics.md:635:**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
docs/planning-artifacts/epics.md:636:**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
docs/planning-artifacts/epics.md-637-**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
docs/planning-artifacts/epics.md-638-
docs/planning-artifacts/epics.md-639-### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
docs/planning-artifacts/epics.md-640-
docs/planning-artifacts/epics.md-641-As a visiteur,
docs/planning-artifacts/epics.md-642-I want savoir quand un lien ouvre un nouvel onglet,
docs/planning-artifacts/epics.md-643-So that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).
docs/planning-artifacts/epics.md-644-
--
docs/planning-artifacts/epics.md-698-
docs/planning-artifacts/epics.md-699-**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
docs/planning-artifacts/epics.md-700-**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
docs/planning-artifacts/epics.md-701-**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
docs/planning-artifacts/epics.md-702-**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
docs/planning-artifacts/epics.md-703-
docs/planning-artifacts/epics.md-704----
docs/planning-artifacts/epics.md-705-
docs/planning-artifacts/epics.md:706:## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md-707-
docs/planning-artifacts/epics.md-708-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-709-
docs/planning-artifacts/epics.md-710-### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
docs/planning-artifacts/epics.md-711-
docs/planning-artifacts/epics.md-712-As a visiteur découvrant la page d'accueil,
docs/planning-artifacts/epics.md-713-I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
docs/planning-artifacts/epics.md-714-So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
--
docs/planning-artifacts/epics.md-716-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-717-
docs/planning-artifacts/epics.md-718-**Given** le projet en production sur `main` et la nécessité de développer de manière isolée sans régresser la prod
docs/planning-artifacts/epics.md-719-**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
docs/planning-artifacts/epics.md-720-**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md-721-**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
docs/planning-artifacts/epics.md-722-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-723-
docs/planning-artifacts/epics.md:724:### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
docs/planning-artifacts/epics.md-725-
docs/planning-artifacts/epics.md-726-As a prospect technique ou client potentiel,
docs/planning-artifacts/epics.md-727-I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
docs/planning-artifacts/epics.md-728-So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).
docs/planning-artifacts/epics.md-729-
docs/planning-artifacts/epics.md-730-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-731-
docs/planning-artifacts/epics.md-732-**Given** la page d'accueil avec son atmosphère en place
docs/planning-artifacts/epics.md-733-**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
docs/planning-artifacts/epics.md:734:**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
docs/planning-artifacts/epics.md-735-**And** le Hero commercial affiche en typographie Ubuntu :
docs/planning-artifacts/epics.md-736-  - Sur-titre `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
docs/planning-artifacts/epics.md-737-  - Titre principal `Développeur Full Stack TypeScript`
docs/planning-artifacts/epics.md-738-  - Sous-titre orienté création et évolution d'applications web et SaaS (Nuxt, NestJS, PostgreSQL)
docs/planning-artifacts/epics.md-739-  - Badge de statut de disponibilité vérifié avec puce pulsée et lien externe vers le profil Malt (`<ZExternalLink>`)
docs/planning-artifacts/epics.md-740-  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
docs/planning-artifacts/epics.md-741-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-742-

exec
/bin/zsh -lc "sed -n '1,220p' docs/specs/spec-home-awwwards/SPEC.md && sed -n '1,340p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.

- id: CAP-2
  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.

- id: CAP-3
  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.

- id: CAP-4
  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.

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
- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.

## Non-goals

- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.

## Success signal

- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-09-13"
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
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`) — `<script setup>`,
  auto-importées sans préfixe de dossier.
- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
  `ZCardComponent` monolithique a été supprimé en story 2.4.)
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
  - **Home** → `docs/animations_jouan.ovh/Home animée.dc.html` + screenshots
    `docs/animations_jouan.ovh/screenshots/` (`hero*.png`, `services.png`, `booted.png`).
  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
    (UI kit cible ; ouvrir la section correspondante).
  - Routine appliquée sans faille sur Epics 4-8 (desktop + mobile) → zéro régression de
    rendu ; elle a corrigé un défaut de la maquette (centrage timeline `kit.css`, 5.2),
    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
    (diff visuel **et comportemental** avant/après, Epic 8). Sur les passes transverses a11y/motion (Epics 9 & 10) :
    vérification du comportement clavier/motion/contraste sous émulation `forced-colors: active` et `prefers-reduced-motion: reduce`.

---

## Usage Guidelines

**Pour les agents IA :**

- Lire ce fichier AVANT toute implémentation.
- Suivre toutes les règles ; en cas de doute, choisir l'option la plus restrictive.
- Mettre à jour ce fichier si de nouveaux patterns émergent.

**Pour les humains :**

- Garder le fichier court et focalisé sur les besoins des agents.
- Mettre à jour quand la stack change.
- Revue périodique ; retirer les règles devenues évidentes.

Dernière mise à jour : 2026-09-13 (post-Epic 10 : refonte complète livrée en production sur https://jouan.ovh — epics 1→10 done ; 13 routes statiques pré-rendues ; validation runtime a11y émulée ; primitive ZExternalLink ; SEO centralisé usePageSeo/useSiteUrl ; conformité légale RGPD /confidentialite et /mentions-legales ; déploiement réel gh-pages prouvé sur main avec HTTPS forcé et DNS OVH opérationnel).

exec
/bin/zsh -lc "sed -n '1,120p' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n 'Epic 11|Story 11\\.2' docs/planning-artifacts/epics.md && sed -n '700,789p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.

- id: CAP-2
  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.

- id: CAP-3
  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.

- id: CAP-4
  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.

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
- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.

## Non-goals

- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.

## Success signal

- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

 succeeded in 0ms:
49:#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
72:NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
84:- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
85:- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
134:FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
135:FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
136:FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
137:FR21: Epic 11 — Marquee infini de la stack moderne ciblée
138:FR22: Epic 11 — Vitrine des 3 offres de services ciblées
139:FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
140:FR24: Epic 11 — Vitrine des articles récents du blog
141:FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
142:FR26: Epic 11 — Préservation de l'architecture multi-pages
143:FR27: Epic 11 — Micro-curseur interactif progressif desktop
187:### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
706:## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
724:### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`

---

## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS

Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.

### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique

As a visiteur découvrant la page d'accueil,
I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).

**Acceptance Criteria:**

**Given** le projet en production sur `main` et la nécessité de développer de manière isolée sans régresser la prod
**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique

As a prospect technique ou client potentiel,
I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).

**Acceptance Criteria:**

**Given** la page d'accueil avec son atmosphère en place
**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
**And** le Hero commercial affiche en typographie Ubuntu :
  - Sur-titre `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
  - Titre principal `Développeur Full Stack TypeScript`
  - Sous-titre orienté création et évolution d'applications web et SaaS (Nuxt, NestJS, PostgreSQL)
  - Badge de statut de disponibilité vérifié avec puce pulsée et lien externe vers le profil Malt (`<ZExternalLink>`)
  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés

As a visiteur explorant la page d'accueil,
I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).

**Acceptance Criteria:**

**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
**When** on intègre le composant `StackMarquee` et la section des 3 services phares
**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
**And** chaque carte oriente directement vers la route `/services` (aucune ancre intra-page `#`)
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion

As a prospect cherchant des garanties avant prise de contact,
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).

**Acceptance Criteria:**

**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
**Then** les projets affichent :
  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
  - **Nodium** avec statut `◐ R&D / En cours` valorisant le laboratoire d'agents IA desktop
**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
**And** la section journal présente les articles récents du blog avec lien vers `/blog`
**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)

### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker

As a mainteneur du site et garant de la qualité logicielle,
I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).

**Acceptance Criteria:**

**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
**Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)


exec
/bin/zsh -lc "sed -n '1,125p' docs/project-context.md && sed -n '180,230p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-09-13"
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
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`) — `<script setup>`,
  auto-importées sans préfixe de dossier.
- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
  `ZCardComponent` monolithique a été supprimé en story 2.4.)
- Composants applicatifs legacy : PascalCase suffixé `Component`
  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
- Sous-système terminal sous `components/terminal/` : coquilles Vue
  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
  contrats (`I*` + barrel `index.ts`).
- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
  (ex. `@use "...color" as _color`).
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

exec
/bin/zsh -lc "sed -n '1,420p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
new file mode 100644
index 0000000..bdd4f89
--- /dev/null
+++ b/app/components/home/HomeBootOverlay.vue
@@ -0,0 +1,230 @@
+<template>
+  <div
+    v-if="!isDismissed"
+    class="boot"
+    :class="{ 'boot--done': isDone }"
+    role="status"
+    aria-live="polite"
+    @click="finishBoot"
+  >
+    <div class="boot__in">
+      <div class="boot__logo">
+        <ZIcon name="gem" class="boot__logo-icon" />
+        <b>jouan.os</b>
+      </div>
+      <div class="boot__line">
+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
+      </div>
+      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
+        <i :style="{ width: `${progressPercent}%` }" />
+      </div>
+      <div class="boot__skip">[ cliquez ou appuyez sur Échap pour passer ]</div>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
+// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
+// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
+
+const emit = defineEmits<{
+  (e: "boot-complete"): void;
+}>();
+
+const isDismissed = ref(false);
+const isDone = ref(false);
+const currentStepText = ref("");
+const currentStepOk = ref(false);
+const progressPercent = ref(0);
+
+const bootSteps = [
+  { text: "initialisation du noyau…", ok: false },
+  { text: "montage de /dev/portfolio", ok: false },
+  { text: "chargement des polices Ubuntu Mono", ok: false },
+  { text: "compilation des projets", ok: true },
+  { text: "démarrage du serveur", ok: true },
+];
+
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
+
+function finishBoot() {
+  if (isDone.value) return;
+  isDone.value = true;
+  progressPercent.value = 100;
+
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+
+  if (import.meta.client) {
+    try {
+      sessionStorage.setItem("jouan_boot_done", "1");
+    } catch {
+      // Ignore sessionStorage exceptions (private browsing / quota)
+    }
+  }
+
+  emit("boot-complete");
+
+  dismissTimeoutId = setTimeout(() => {
+    isDismissed.value = true;
+  }, 600);
+}
+
+function runBoot() {
+  let stepIndex = 0;
+
+  function next() {
+    if (stepIndex >= bootSteps.length) {
+      stepTimeoutId = setTimeout(finishBoot, 260);
+      return;
+    }
+
+    const step = bootSteps[stepIndex];
+    if (step) {
+      currentStepText.value = step.text;
+      currentStepOk.value = step.ok;
+      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
+    }
+    stepIndex++;
+    stepTimeoutId = setTimeout(next, 230);
+  }
+
+  next();
+}
+
+function handleKeydown(e: KeyboardEvent) {
+  if (e.key === "Escape" && !isDone.value) {
+    finishBoot();
+  }
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  window.addEventListener("keydown", handleKeydown);
+
+  // Vérifier si la session a déjà vu le boot
+  let alreadyBooted = false;
+  try {
+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
+  } catch {
+    alreadyBooted = false;
+  }
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (alreadyBooted || reduceMotion) {
+    isDone.value = true;
+    isDismissed.value = true;
+    emit("boot-complete");
+    return;
+  }
+
+  runBoot();
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("keydown", handleKeydown);
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+  if (dismissTimeoutId !== null) {
+    clearTimeout(dismissTimeoutId);
+    dismissTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.boot {
+  position: fixed;
+  inset: 0;
+  z-index: 200;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  cursor: pointer;
+  background: var(--surface-0);
+  transition:
+    opacity var(--dur-slow) var(--ease-out),
+    visibility var(--dur-slow);
+
+  &.boot--done {
+    pointer-events: none;
+    visibility: hidden;
+    opacity: 0;
+  }
+}
+
+.boot__in {
+  width: min(560px, 88vw);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+}
+
+.boot__logo {
+  display: flex;
+  align-items: center;
+  gap: var(--space-3);
+  margin-bottom: var(--space-5);
+  color: var(--text-strong);
+
+  b {
+    font-size: var(--fs-lg);
+  }
+}
+
+.boot__logo-icon {
+  font-size: 26px;
+  color: var(--accent);
+}
+
+.boot__line {
+  min-height: 1.6em;
+  color: var(--text-muted);
+}
+
+.boot__ok {
+  color: var(--term-green);
+}
+
+.boot__bar {
+  height: 3px;
+  margin-top: var(--space-5);
+  overflow: hidden;
+  background: var(--surface-3);
+  border-radius: var(--radius-xs);
+
+  i {
+    display: block;
+    width: 0;
+    height: 100%;
+    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
+    transition: width 0.1s linear;
+  }
+}
+
+.boot__skip {
+  margin-top: var(--space-4);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .boot {
+    display: none;
+  }
+}
+</style>
diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
new file mode 100644
index 0000000..82a1aac
--- /dev/null
+++ b/app/components/home/HomeHeroTerminal.vue
@@ -0,0 +1,363 @@
+<template>
+  <div class="hero-term">
+    <div class="hero-term__bar">
+      <span class="hero-term__dots" aria-hidden="true">
+        <span class="hero-term__dot hero-term__dot--close" />
+        <span class="hero-term__dot hero-term__dot--min" />
+        <span class="hero-term__dot hero-term__dot--max" />
+      </span>
+      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
+    </div>
+
+    <div class="hero-term__body">
+      <!-- Lignes complètes terminées -->
+      <template v-for="(row, idx) in executedRows" :key="idx">
+        <p class="hero-term__line" aria-hidden="true">
+          <span class="prm">
+            <span class="prm__user">anon.@jouan.ovh</span>
+            <span class="prm__sep">:</span>
+            <span class="prm__dir">~</span>
+            <span class="prm__sep">$ </span>
+            <span class="prm__cmd">{{ row.cmd }}</span>
+          </span>
+        </p>
+        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
+      </template>
+
+      <!-- Ligne en cours de frappe -->
+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">{{ currentTypingText }}</span>
+          <span class="prm__caret" />
+        </span>
+      </p>
+
+      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
+      <button
+        v-if="isSequenceComplete"
+        type="button"
+        class="hero-term__open"
+        aria-label="Ouvrir le terminal interactif"
+        aria-haspopup="dialog"
+        @click="openTerminal"
+      >
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">help</span>
+          <span class="prm__caret" aria-hidden="true" />
+        </span>
+      </button>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, watch, onMounted, onUnmounted } from "vue";
+import { useTerminal } from "~/composables/useTerminal";
+
+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
+// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
+// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
+
+const props = withDefaults(
+  defineProps<{
+    autoStart?: boolean;
+  }>(),
+  {
+    autoStart: true,
+  },
+);
+
+const { open: openTerminal } = useTerminal();
+
+interface ITermRow {
+  cmd: string;
+  out: string;
+  tone: "ink" | "blue" | "green";
+}
+
+const fullRows: ITermRow[] = [
+  {
+    cmd: "whoami",
+    out: "Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)",
+    tone: "ink",
+  },
+  {
+    cmd: "cat focus.txt",
+    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
+    tone: "blue",
+  },
+  {
+    cmd: "ls ~/projets",
+    out: "keova.app/  tryon-saas/  nodium-lab/",
+    tone: "green",
+  },
+];
+
+const executedRows = ref<ITermRow[]>([]);
+const currentTypingLine = ref<ITermRow | null>(null);
+const currentTypingText = ref("");
+const isSequenceComplete = ref(false);
+
+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let isStarted = false;
+
+function showInstantState() {
+  executedRows.value = [...fullRows];
+  currentTypingLine.value = null;
+  currentTypingText.value = "";
+  isSequenceComplete.value = true;
+}
+
+function startTypingSequence() {
+  if (isStarted) return;
+  isStarted = true;
+
+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (reduceMotion) {
+    showInstantState();
+    return;
+  }
+
+  let rowIndex = 0;
+
+  function typeRow() {
+    if (rowIndex >= fullRows.length) {
+      currentTypingLine.value = null;
+      currentTypingText.value = "";
+      isSequenceComplete.value = true;
+      return;
+    }
+
+    const row = fullRows[rowIndex];
+    if (!row) return;
+
+    const activeRow: ITermRow = row;
+    currentTypingLine.value = activeRow;
+    currentTypingText.value = "";
+
+    let charIndex = 0;
+    const fullCmd = activeRow.cmd;
+
+    function typeChar() {
+      if (charIndex < fullCmd.length) {
+        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
+        charIndex++;
+        typingTimeoutId = setTimeout(typeChar, 46);
+      } else {
+        // Commande entièrement tapée, afficher le résultat après une pause
+        stepTimeoutId = setTimeout(() => {
+          executedRows.value.push(activeRow);
+          currentTypingLine.value = null;
+          currentTypingText.value = "";
+          rowIndex++;
+          stepTimeoutId = setTimeout(typeRow, 280);
+        }, 200);
+      }
+    }
+
+    typeChar();
+  }
+
+  typeRow();
+}
+
+watch(
+  () => props.autoStart,
+  (shouldStart) => {
+    if (shouldStart && !isStarted) {

exec
/bin/zsh -lc "sed -n '381,760p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+      return;
+    }
+
+    const row = fullRows[rowIndex];
+    if (!row) return;
+
+    const activeRow: ITermRow = row;
+    currentTypingLine.value = activeRow;
+    currentTypingText.value = "";
+
+    let charIndex = 0;
+    const fullCmd = activeRow.cmd;
+
+    function typeChar() {
+      if (charIndex < fullCmd.length) {
+        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
+        charIndex++;
+        typingTimeoutId = setTimeout(typeChar, 46);
+      } else {
+        // Commande entièrement tapée, afficher le résultat après une pause
+        stepTimeoutId = setTimeout(() => {
+          executedRows.value.push(activeRow);
+          currentTypingLine.value = null;
+          currentTypingText.value = "";
+          rowIndex++;
+          stepTimeoutId = setTimeout(typeRow, 280);
+        }, 200);
+      }
+    }
+
+    typeChar();
+  }
+
+  typeRow();
+}
+
+watch(
+  () => props.autoStart,
+  (shouldStart) => {
+    if (shouldStart && !isStarted) {
+      startTypingSequence();
+    }
+  },
+);
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+  if (reduceMotion) {
+    showInstantState();
+    return;
+  }
+
+  if (props.autoStart) {
+    startTypingSequence();
+  }
+});
+
+onUnmounted(() => {
+  if (typingTimeoutId !== null) {
+    clearTimeout(typingTimeoutId);
+    typingTimeoutId = null;
+  }
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.hero-term {
+  display: flex;
+  flex-direction: column;
+  min-height: 300px;
+  overflow: hidden;
+  border: 1px solid var(--accent-2-soft);
+  border-radius: var(--radius-sm);
+  box-shadow: var(--glow-terminal);
+}
+
+.hero-term__bar {
+  position: relative;
+  display: flex;
+  flex: none;
+  align-items: center;
+  gap: var(--space-2);
+  height: 30px;
+  padding: 0 var(--space-3);
+  background: var(--aubergine-black);
+}
+
+.hero-term__dots {
+  display: flex;
+  align-items: center;
+  gap: 7px;
+}
+
+.hero-term__dot {
+  width: 13px;
+  height: 13px;
+  border-radius: var(--radius-circle);
+}
+
+.hero-term__dot--close {
+  background: var(--term-red);
+}
+
+.hero-term__dot--min {
+  background: var(--term-yellow);
+}
+
+.hero-term__dot--max {
+  background: var(--term-green);
+}
+
+.hero-term__title {
+  position: absolute;
+  inset: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-muted);
+  text-align: center;
+  pointer-events: none;
+}
+
+.hero-term__body {
+  flex: 1;
+  min-height: 0;
+  padding: var(--space-4);
+  overflow: auto;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-snug);
+  color: var(--ink-1);
+  background: var(--bg-terminal);
+  overflow-wrap: break-word;
+}
+
+@supports (backdrop-filter: blur(5px)) {
+  .hero-term__body {
+    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
+    backdrop-filter: blur(5px);
+  }
+}
+
+.hero-term__line {
+  margin: 0;
+}
+
+.hero-term__out {
+  margin: 0 0 var(--space-4);
+}
+
+.hero-term__out--ink {
+  color: var(--ink-1);
+}
+
+.hero-term__out--blue {
+  color: var(--term-blue);
+}
+
+.hero-term__out--green {
+  color: var(--term-green);
+}
+
+.hero-term__open {
+  display: block;
+  width: 100%;
+  padding: 0;
+  font: inherit;
+  text-align: left;
+  cursor: pointer;
+  background: none;
+  border: none;
+  border-radius: var(--radius-xs);
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+  }
+}
+
+.prm {
+  font-family: var(--font-mono);
+}
+
+.prm__user {
+  font-weight: var(--fw-bold);
+  color: var(--prompt);
+}
+
+.prm__sep {
+  color: var(--ink-1);
+}
+
+.prm__dir {
+  font-weight: var(--fw-bold);
+  color: var(--term-blue);
+}
+
+.prm__cmd {
+  color: var(--ink-1);
+}
+
+.prm__caret {
+  display: inline-block;
+  width: 0.55em;
+  height: 1.05em;
+  margin-left: 1px;
+  vertical-align: text-bottom;
+  background: var(--prompt);
+  animation: caret-blink 1s steps(1) infinite;
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .prm__caret {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/pages/index.vue b/app/pages/index.vue
index e1e048c..51c7a1c 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -1,69 +1,41 @@
 <template>
   <main class="home">
+    <HomeBootOverlay @boot-complete="onBootComplete" />
     <HomeAtmosComponent />
     <ZCustomCursor />
 
     <section class="hero hero__grad">
       <div class="hero__in container">
         <div class="hero__grid">
-          <!-- Colonne gauche : accroche, CTA, tags -->
+          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
           <div class="anim hero__text">
-            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
-            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
-            <p class="hero__sub">{{ tagline }}</p>
+            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
+            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
+            <p class="hero__sub">
+              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
+              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
+            </p>
+
+            <div class="hero__badge-wrap">
+              <span class="hero__pulse-dot" aria-hidden="true" />
+              <span>Disponible pour missions freelance · </span>
+              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
+                Profil Malt vérifié
+              </ZExternalLink>
+            </div>
+
             <div class="hero__cta">
               <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
-                Démarrer un projet
+                Discuter de votre projet
                 <template #iconRight><ZIcon name="arrow" /></template>
               </ZButton>
-              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
+              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
             </div>
-            <ul class="hero__tags">
-              <li v-for="tag in tags" :key="tag">
-                <ZTag>{{ tag }}</ZTag>
-              </li>
-            </ul>
           </div>
 
-          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
+          <!-- Colonne droite : terminal hero cinétique -->
           <div class="anim hero__term-col">
-            <div class="hero-term">
-              <div class="hero-term__bar">
-                <span class="hero-term__dots" aria-hidden="true">
-                  <span class="hero-term__dot hero-term__dot--close" />
-                  <span class="hero-term__dot hero-term__dot--min" />
-                  <span class="hero-term__dot hero-term__dot--max" />
-                </span>
-                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
-              </div>
-
-              <div class="hero-term__body">
-                <template v-for="row in terminalRows" :key="row.id">
-                  <p class="hero-term__line" aria-hidden="true">
-                    <span class="prm"
-                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
-                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
-                      ><span class="prm__cmd">{{ row.cmd }}</span></span
-                    >
-                  </p>
-                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
-                </template>
-
-                <button
-                  type="button"
-                  class="hero-term__open"
-                  aria-label="Ouvrir le terminal interactif"
-                  aria-haspopup="dialog"
-                  @click="openTerminal"
-                >
-                  <span class="prm"
-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
-                    ><span class="prm__caret" aria-hidden="true"
-                  /></span>
-                </button>
-              </div>
-            </div>
+            <HomeHeroTerminal :auto-start="isBootFinished" />
           </div>
         </div>
       </div>
@@ -129,20 +101,21 @@
 </template>
 
 <script setup lang="ts">
-// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
-// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
+// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
+// Architecture multi-pages Nuxt 4, dark-first, accent orange.
+import { ref } from "vue";
 import { NuxtLink, ZExternalLink } from "#components";
-import { useTerminal } from "~/composables/useTerminal";
 import { SITE } from "~/data/site";
 
-// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
-const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
-const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
+const isBootFinished = ref(false);
+
+function onBootComplete() {
+  isBootFinished.value = true;
+}
 
 // Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
 // (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
+// `id` = clé v-for stable (indépendante du contenu affiché).
 const services = [
   {
     id: "wordpress",
@@ -177,28 +150,14 @@ const stats = [
 // Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
 const projects = SITE.projects;
 
-// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
-// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
-// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
-const terminalRows = [
-  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
-  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
-  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
-];
-
-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
-// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
-// restylisation du terminal lui-même relève d'Epic 8.
-const { open: openTerminal } = useTerminal();
-
 const siteUrl = useSiteUrl();
 const homeJsonLd = [
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
-    name: "Simon Jouan — Développeur web freelance",
+    name: "Simon Jouan — Développeur Full Stack TypeScript",
     url: siteUrl,
-    description: tagline,
+    description: SITE.profile.role,
   },
   {

exec
/bin/zsh -lc "sed -n '1,380p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
new file mode 100644
index 0000000..bdd4f89
--- /dev/null
+++ b/app/components/home/HomeBootOverlay.vue
@@ -0,0 +1,230 @@
+<template>
+  <div
+    v-if="!isDismissed"
+    class="boot"
+    :class="{ 'boot--done': isDone }"
+    role="status"
+    aria-live="polite"
+    @click="finishBoot"
+  >
+    <div class="boot__in">
+      <div class="boot__logo">
+        <ZIcon name="gem" class="boot__logo-icon" />
+        <b>jouan.os</b>
+      </div>
+      <div class="boot__line">
+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
+      </div>
+      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
+        <i :style="{ width: `${progressPercent}%` }" />
+      </div>
+      <div class="boot__skip">[ cliquez ou appuyez sur Échap pour passer ]</div>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
+// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
+// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
+
+const emit = defineEmits<{
+  (e: "boot-complete"): void;
+}>();
+
+const isDismissed = ref(false);
+const isDone = ref(false);
+const currentStepText = ref("");
+const currentStepOk = ref(false);
+const progressPercent = ref(0);
+
+const bootSteps = [
+  { text: "initialisation du noyau…", ok: false },
+  { text: "montage de /dev/portfolio", ok: false },
+  { text: "chargement des polices Ubuntu Mono", ok: false },
+  { text: "compilation des projets", ok: true },
+  { text: "démarrage du serveur", ok: true },
+];
+
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
+
+function finishBoot() {
+  if (isDone.value) return;
+  isDone.value = true;
+  progressPercent.value = 100;
+
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+
+  if (import.meta.client) {
+    try {
+      sessionStorage.setItem("jouan_boot_done", "1");
+    } catch {
+      // Ignore sessionStorage exceptions (private browsing / quota)
+    }
+  }
+
+  emit("boot-complete");
+
+  dismissTimeoutId = setTimeout(() => {
+    isDismissed.value = true;
+  }, 600);
+}
+
+function runBoot() {
+  let stepIndex = 0;
+
+  function next() {
+    if (stepIndex >= bootSteps.length) {
+      stepTimeoutId = setTimeout(finishBoot, 260);
+      return;
+    }
+
+    const step = bootSteps[stepIndex];
+    if (step) {
+      currentStepText.value = step.text;
+      currentStepOk.value = step.ok;
+      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
+    }
+    stepIndex++;
+    stepTimeoutId = setTimeout(next, 230);
+  }
+
+  next();
+}
+
+function handleKeydown(e: KeyboardEvent) {
+  if (e.key === "Escape" && !isDone.value) {
+    finishBoot();
+  }
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  window.addEventListener("keydown", handleKeydown);
+
+  // Vérifier si la session a déjà vu le boot
+  let alreadyBooted = false;
+  try {
+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
+  } catch {
+    alreadyBooted = false;
+  }
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (alreadyBooted || reduceMotion) {
+    isDone.value = true;
+    isDismissed.value = true;
+    emit("boot-complete");
+    return;
+  }
+
+  runBoot();
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("keydown", handleKeydown);
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+  if (dismissTimeoutId !== null) {
+    clearTimeout(dismissTimeoutId);
+    dismissTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.boot {
+  position: fixed;
+  inset: 0;
+  z-index: 200;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  cursor: pointer;
+  background: var(--surface-0);
+  transition:
+    opacity var(--dur-slow) var(--ease-out),
+    visibility var(--dur-slow);
+
+  &.boot--done {
+    pointer-events: none;
+    visibility: hidden;
+    opacity: 0;
+  }
+}
+
+.boot__in {
+  width: min(560px, 88vw);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+}
+
+.boot__logo {
+  display: flex;
+  align-items: center;
+  gap: var(--space-3);
+  margin-bottom: var(--space-5);
+  color: var(--text-strong);
+
+  b {
+    font-size: var(--fs-lg);
+  }
+}
+
+.boot__logo-icon {
+  font-size: 26px;
+  color: var(--accent);
+}
+
+.boot__line {
+  min-height: 1.6em;
+  color: var(--text-muted);
+}
+
+.boot__ok {
+  color: var(--term-green);
+}
+
+.boot__bar {
+  height: 3px;
+  margin-top: var(--space-5);
+  overflow: hidden;
+  background: var(--surface-3);
+  border-radius: var(--radius-xs);
+
+  i {
+    display: block;
+    width: 0;
+    height: 100%;
+    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
+    transition: width 0.1s linear;
+  }
+}
+
+.boot__skip {
+  margin-top: var(--space-4);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .boot {
+    display: none;
+  }
+}
+</style>
diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
new file mode 100644
index 0000000..82a1aac
--- /dev/null
+++ b/app/components/home/HomeHeroTerminal.vue
@@ -0,0 +1,363 @@
+<template>
+  <div class="hero-term">
+    <div class="hero-term__bar">
+      <span class="hero-term__dots" aria-hidden="true">
+        <span class="hero-term__dot hero-term__dot--close" />
+        <span class="hero-term__dot hero-term__dot--min" />
+        <span class="hero-term__dot hero-term__dot--max" />
+      </span>
+      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
+    </div>
+
+    <div class="hero-term__body">
+      <!-- Lignes complètes terminées -->
+      <template v-for="(row, idx) in executedRows" :key="idx">
+        <p class="hero-term__line" aria-hidden="true">
+          <span class="prm">
+            <span class="prm__user">anon.@jouan.ovh</span>
+            <span class="prm__sep">:</span>
+            <span class="prm__dir">~</span>
+            <span class="prm__sep">$ </span>
+            <span class="prm__cmd">{{ row.cmd }}</span>
+          </span>
+        </p>
+        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
+      </template>
+
+      <!-- Ligne en cours de frappe -->
+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">{{ currentTypingText }}</span>
+          <span class="prm__caret" />
+        </span>
+      </p>
+
+      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
+      <button
+        v-if="isSequenceComplete"
+        type="button"
+        class="hero-term__open"
+        aria-label="Ouvrir le terminal interactif"
+        aria-haspopup="dialog"
+        @click="openTerminal"
+      >
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">help</span>
+          <span class="prm__caret" aria-hidden="true" />
+        </span>
+      </button>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, watch, onMounted, onUnmounted } from "vue";
+import { useTerminal } from "~/composables/useTerminal";
+
+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
+// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
+// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
+
+const props = withDefaults(
+  defineProps<{
+    autoStart?: boolean;
+  }>(),
+  {
+    autoStart: true,
+  },
+);
+
+const { open: openTerminal } = useTerminal();
+
+interface ITermRow {
+  cmd: string;
+  out: string;
+  tone: "ink" | "blue" | "green";
+}
+
+const fullRows: ITermRow[] = [
+  {
+    cmd: "whoami",
+    out: "Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)",
+    tone: "ink",
+  },
+  {
+    cmd: "cat focus.txt",
+    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
+    tone: "blue",
+  },
+  {
+    cmd: "ls ~/projets",
+    out: "keova.app/  tryon-saas/  nodium-lab/",
+    tone: "green",
+  },
+];
+
+const executedRows = ref<ITermRow[]>([]);
+const currentTypingLine = ref<ITermRow | null>(null);
+const currentTypingText = ref("");
+const isSequenceComplete = ref(false);
+
+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let isStarted = false;
+
+function showInstantState() {
+  executedRows.value = [...fullRows];
+  currentTypingLine.value = null;
+  currentTypingText.value = "";
+  isSequenceComplete.value = true;
+}
+
+function startTypingSequence() {
+  if (isStarted) return;
+  isStarted = true;
+
+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (reduceMotion) {
+    showInstantState();
+    return;
+  }
+
+  let rowIndex = 0;
+
+  function typeRow() {
+    if (rowIndex >= fullRows.length) {
+      currentTypingLine.value = null;
+      currentTypingText.value = "";
+      isSequenceComplete.value = true;

exec
/bin/zsh -lc "sed -n '220,420p' app/components/home/HomeHeroTerminal.vue; sed -n '1,320p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
}

.hero-term__bar {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-2);
  height: 30px;
  padding: 0 var(--space-3);
  background: var(--aubergine-black);
}

.hero-term__dots {
  display: flex;
  align-items: center;
  gap: 7px;
}

.hero-term__dot {
  width: 13px;
  height: 13px;
  border-radius: var(--radius-circle);
}

.hero-term__dot--close {
  background: var(--term-red);
}

.hero-term__dot--min {
  background: var(--term-yellow);
}

.hero-term__dot--max {
  background: var(--term-green);
}

.hero-term__title {
  position: absolute;
  inset: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wide);
  color: var(--text-muted);
  text-align: center;
  pointer-events: none;
}

.hero-term__body {
  flex: 1;
  min-height: 0;
  padding: var(--space-4);
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--ink-1);
  background: var(--bg-terminal);
  overflow-wrap: break-word;
}

@supports (backdrop-filter: blur(5px)) {
  .hero-term__body {
    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
    backdrop-filter: blur(5px);
  }
}

.hero-term__line {
  margin: 0;
}

.hero-term__out {
  margin: 0 0 var(--space-4);
}

.hero-term__out--ink {
  color: var(--ink-1);
}

.hero-term__out--blue {
  color: var(--term-blue);
}

.hero-term__out--green {
  color: var(--term-green);
}

.hero-term__open {
  display: block;
  width: 100%;
  padding: 0;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-xs);

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.prm {
  font-family: var(--font-mono);
}

.prm__user {
  font-weight: var(--fw-bold);
  color: var(--prompt);
}

.prm__sep {
  color: var(--ink-1);
}

.prm__dir {
  font-weight: var(--fw-bold);
  color: var(--term-blue);
}

.prm__cmd {
  color: var(--ink-1);
}

.prm__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--prompt);
  animation: caret-blink 1s steps(1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .prm__caret {
    animation: none;
  }
}
</style>
<template>
  <main class="home">
    <HomeBootOverlay @boot-complete="onBootComplete" />
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
            <p class="hero__sub">
              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour missions freelance · </span>
              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
                Profil Malt vérifié
              </ZExternalLink>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Discuter de votre projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
          </div>
        </div>
      </div>
    </section>

    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
        <h2 class="section__title">Trois façons de travailler ensemble</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                En savoir plus →
              </NuxtLink>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="statrow">
          <div v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
        <ul class="grid-2 projects">
          <li v-for="project in projects" :key="project.name">
            <ZCard
              class="project"
              :interactive="Boolean(project.url)"
              :data-hot="Boolean(project.url) ? '' : undefined"
              :as="project.url ? ZExternalLink : 'div'"
              :href="project.url || undefined"
              :rel="project.url ? 'noopener noreferrer' : undefined"
            >
              <div class="project__head">
                <h3 class="project__name">{{ project.name }}</h3>
                <span class="project__role">{{ project.role }}</span>
              </div>
              <p class="prose project__desc">{{ project.desc }}</p>
              <ul class="hero__tags">
                <li v-for="tag in project.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);

function onBootComplete() {
  isBootFinished.value = true;
}

// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
// `id` = clé v-for stable (indépendante du contenu affiché).
const services = [
  {
    id: "wordpress",
    icon: "wp",
    title: "WordPress sur-mesure",
    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    featured: false,
  },
  {
    id: "apps",
    icon: "code",
    title: "Applications web",
    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
    featured: true,
  },
  {
    id: "ia",
    icon: "spark",
    title: "IA & automatisation",
    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
    featured: false,
  },
];

// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
const stats = [
  { id: "stat-1", value: "8+", label: "ans dans la tech" },
  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
];

// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
const projects = SITE.projects;

const siteUrl = useSiteUrl();
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simon Jouan — Développeur Full Stack TypeScript",
    url: siteUrl,
    description: SITE.profile.role,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.profile.name,
    jobTitle: SITE.profile.role,
    url: siteUrl,
    image: `${siteUrl}/images/portrait.jpeg`,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
];

usePageSeo({
  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
  description:
    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
  path: "/",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: homeJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
.home {
  display: block;
}

// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
.anim {
  animation: fade-rise var(--dur-slow) var(--ease-out) both;
}

.hero__term-col {
  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
  animation-delay: 80ms;
}

// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
.hero {
  position: relative;
  overflow: hidden;
}

.hero__grad {
  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
  background:
    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(
      700px 500px at 0% 110%,
      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
      transparent 60%
    ),
    var(--bg-page);
}

.hero__in {
  position: relative;
  z-index: 1;

  // padding-block uniquement : le gutter horizontal vient de .container
  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
  padding-block: var(--space-20);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-12);
  align-items: center;
}

// .section / .container / .eyebrow / .prose : primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- Colonne texte ----
.hero__title {
  font-family: var(--font-mono);
  font-size: var(--fs-6xl);
  font-weight: var(--fw-light);
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);

  em {
    font-style: normal;
    color: var(--accent);
  }
}

.hero__sub {
  max-width: 46ch;
  margin: var(--space-5) 0 var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

// ---- Badge de disponibilité & CTAs ----
.hero__badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  a {
    color: var(--accent);
    text-decoration: underline;

    &:hover {
      color: var(--accent-hover);
    }
  }
}

.hero__pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: var(--term-green);
  box-shadow: 0 0 8px var(--term-green);
}

.section__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

// ---- Aperçu services (porté de .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {

exec
/bin/zsh -lc "sed -n '761,1160p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     "@context": "https://schema.org",
@@ -217,9 +176,9 @@ const homeJsonLd = [
 ];
 
 usePageSeo({
-  title: "Simon Jouan — Développeur web freelance & IA",
+  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   description:
-    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
+    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   path: "/",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -313,168 +272,32 @@ usePageSeo({
   margin-bottom: var(--space-6);
 }
 
-// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
-
-// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
-// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
-// l'identique la spec du composant DS et n'ont pas de token d'espacement
-// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
-// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
-// scrollbar parasite si le rendu mono dépasse de quelques px.
-.hero-term {
-  display: flex;
-  flex-direction: column;
-  min-height: 300px;
-  overflow: hidden;
-  border: 1px solid var(--accent-2-soft);
-  border-radius: var(--radius-sm);
-  box-shadow: var(--glow-terminal);
-}
-
-.hero-term__bar {
-  position: relative;
-  display: flex;
-  flex: none;
+// ---- Badge de disponibilité & CTAs ----
+.hero__badge-wrap {
+  display: inline-flex;
   align-items: center;
   gap: var(--space-2);
-  height: 30px;
-  padding: 0 var(--space-3);
-  background: var(--aubergine-black);
-}
-
-.hero-term__dots {
-  display: flex;
-  align-items: center;
-  gap: 7px;
-}
-
-.hero-term__dot {
-  width: 13px;
-  height: 13px;
-  border-radius: var(--radius-circle);
-}
-
-.hero-term__dot--close {
-  background: var(--term-red);
-}
-
-.hero-term__dot--min {
-  background: var(--term-yellow);
-}
-
-.hero-term__dot--max {
-  background: var(--term-green);
-}
-
-.hero-term__title {
-  position: absolute;
-  inset: 0;
-  font-family: var(--font-mono);
-  font-size: var(--fs-xs);
-  letter-spacing: var(--ls-wide);
-  color: var(--text-muted);
-  text-align: center;
-  pointer-events: none;
-}
-
-.hero-term__body {
-  flex: 1;
-  min-height: 0;
-  padding: var(--space-4);
-  overflow: auto;
+  margin-bottom: var(--space-6);
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
-  line-height: var(--lh-snug);
-  color: var(--ink-1);
-  background: var(--bg-terminal);
-  overflow-wrap: break-word;
-}
-
-@supports (backdrop-filter: blur(5px)) {
-  .hero-term__body {
-    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
-    backdrop-filter: blur(5px);
-  }
-}
-
-.hero-term__line {
-  margin: 0;
-}
-
-.hero-term__out {
-  margin: 0 0 var(--space-4);
-}
-
-.hero-term__out--ink {
-  color: var(--ink-1);
-}
-
-.hero-term__out--blue {
-  color: var(--term-blue);
-}
-
-.hero-term__out--green {
-  color: var(--term-green);
-}
+  color: var(--text-muted);
 
-// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
-.hero-term__open {
-  display: block;
-  width: 100%;
-  padding: 0;
-  font: inherit;
-  text-align: left;
-  cursor: pointer;
-  background: none;
-  border: none;
-  border-radius: var(--radius-xs);
+  a {
+    color: var(--accent);
+    text-decoration: underline;
 
-  &:focus-visible {
-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
-    // relais), mais rendu en couleur système sous forced-colors (Windows High
-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
-    outline: 2px solid transparent;
-    outline-offset: 2px;
-    box-shadow: var(--ring-accent);
+    &:hover {
+      color: var(--accent-hover);
+    }
   }
 }
 
-// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
-.prm {
-  font-family: var(--font-mono);
-}
-
-.prm__user {
-  font-weight: var(--fw-bold);
-  color: var(--prompt);
-}
-
-.prm__sep {
-  color: var(--ink-1);
-}
-
-.prm__dir {
-  font-weight: var(--fw-bold);
-  color: var(--term-blue);
-}
-
-.prm__cmd {
-  color: var(--ink-1);
-}
-
-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
-// proportionnel à la police) — pas de token équivalent pour un curseur.
-.prm__caret {
-  display: inline-block;
-  width: 0.55em;
-  height: 1.05em;
-  margin-left: 1px;
-  vertical-align: text-bottom;
-  background: var(--prompt);
-
-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
-  animation: caret-blink 1s steps(1) infinite;
+.hero__pulse-dot {
+  width: 8px;
+  height: 8px;
+  border-radius: var(--radius-circle);
+  background: var(--term-green);
+  box-shadow: 0 0 8px var(--term-green);
 }
 
 .section__title {
@@ -658,8 +481,7 @@ usePageSeo({
 }
 
 @media (prefers-reduced-motion: reduce) {
-  .anim,
-  .prm__caret {
+  .anim {
     animation: none;
   }
 }
diff --git a/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
new file mode 100644
index 0000000..7bd200c
--- /dev/null
+++ b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
@@ -0,0 +1,141 @@
+---
+baseline_commit: 5f72e8c14627deb82e7d7c8f8f7f2227b00bd0d4
+---
+
+# Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a prospect technique ou client potentiel visitant la page d'accueil,
+I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
+so that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20, CAP-2, CAP-3).
+
+## Acceptance Criteria
+
+1. **Given** un visiteur arrivant sur la page d'accueil
+   **When** la page se charge pour la première fois de la session
+   **Then** l'overlay de boot (`HomeBootOverlay.vue`, simulant `jouan.os`) s'affiche au premier plan (`z-index: 200`), déroule la montée en charge système (`initialisation du noyau…`, `montage de /dev/portfolio`, `chargement des polices Ubuntu Mono`, `compilation des projets [ok]`, `démarrage du serveur [ok]`) avec jauge de progression
+   **And** l'overlay s'efface automatiquement (transition d'opacité vers disparition) après 1.0s à 1.5s
+   **And** un clic n'importe où sur l'overlay ou la pression sur la touche `Escape` court-circuite immédiatement l'animation (`finishBoot`)
+   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
+   **And** sous `@media (prefers-reduced-motion: reduce)`, la séquence de boot est immédiatement court-circuitée sans animation ni délai.
+
+2. **Given** la fin de la séquence de boot (ou son contournement immédiat)
+   **When** le hero s'affiche
+   **Then** le composant terminal hero (`HomeHeroTerminal.vue`) déclenche sa simulation de frappe séquentielle progressive (effet machine à écrire) :
+     - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
+     - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
+     - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
+   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
+   **And** sous `@media (prefers-reduced-motion: reduce)`, les lignes du terminal hero s'affichent instantanément en texte statique complet sans animation de frappe, le caret restant figé visible.
+
+3. **Given** la colonne gauche du Hero commercial sur `app/pages/index.vue`
+   **When** le visiteur visualise la zone d'accroche principale
+   **Then** la hiérarchie de contenu affiche en typographie Ubuntu :
+     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
+     - Titre principal `<h1>` : `Développeur Full Stack TypeScript`
+     - Sous-titre descriptif : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
+     - Badge de statut de disponibilité : puce pulsée (`--success`), texte `Disponible pour missions freelance · Profil Malt vérifié`, encapsulant un lien accessible vers Malt via `<ZExternalLink :href="SITE.profile.maltUrl">`
+     - Groupe de CTAs d'action :
+       - CTA primaire : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Discuter de votre projet<template #iconRight><ZIcon name="arrow" /></template></ZButton>`
+       - CTA secondaire : `<ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg">Voir le parcours &amp; CV</ZButton>`
+   **And** les anciens tags WordPress/PHP (`php`, `symfony`, `wordpress`) et l'ancienne accroche (« Du code sur-mesure, de l'IA utile ») sont définitivement retirés du Hero.
+
+4. **Given** l'ensemble des intégrations de la story
+   **When** on exécute la gate de validation Docker
+   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Création du composant de démarrage `app/components/home/HomeBootOverlay.vue` (AC: 1)
+  - [x] Définir la structure HTML/template (`.boot`, `.boot__in`, `.boot__logo` avec nom `jouan.os`, `.boot__line`, `.boot__bar` avec barre `<i>`, `.boot__skip`).
+  - [x] Implémenter les étapes de boot textuelles (`bootSteps`) et la barre de progression linéaire.
+  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
+  - [x] Permettre l'interruption immédiate au clic ou via la touche `Escape` (avec écouteur nettoyé dans `onUnmounted()`).
+  - [x] Supporter `prefers-reduced-motion: reduce` en zappant instantanément la séquence (`finishBoot()`).
+  - [x] Émettre l'événement `@boot-complete` vers le composant parent pour synchroniser le démarrage du terminal hero.
+  - [x] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).
+
+- [x] Tâche 2 — Création du composant terminal hero `app/components/home/HomeHeroTerminal.vue` (AC: 2)
+  - [x] Extraire et modulariser la fenêtre terminal décorative du hero dans `app/components/home/HomeHeroTerminal.vue`.
+  - [x] Implémenter la séquence de frappe séquentielle progressive (effet machine à écrire) pour les commandes `$ whoami`, `$ cat focus.txt` et `$ ls ~/projets` alignées sur le positionnement Full Stack TS.
+  - [x] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
+  - [x] Assurer la neutralisation sous `prefers-reduced-motion: reduce` : contenu affiché immédiatement dans son état final, caret figé visible.
+  - [x] Styliser avec les variables de Design System (`--bg-terminal`, `--font-mono`, `--term-red`, `--term-yellow`, `--term-green`, `--term-blue`, etc.).
+
+- [x] Tâche 3 — Refonte commerciale de la colonne gauche du Hero sur `app/pages/index.vue` (AC: 3)
+  - [x] Mettre à jour l'eyebrow : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`.
+  - [x] Mettre à jour le titre `h1` : `Développeur Full Stack TypeScript`.
+  - [x] Remplacer le sous-titre par le pitch commercial ciblé Nuxt / NestJS / PostgreSQL.
+  - [x] Intégrer le badge de disponibilité avec puce pulsée et lien `<ZExternalLink :href="SITE.profile.maltUrl">Profil Malt vérifié</ZExternalLink>`.
+  - [x] Adapter les boutons d'appel à l'action : bouton principal vers `/contact` (« Discuter de votre projet ») et secondaire vers `/about` (« Voir le parcours & CV »).
+  - [x] Supprimer la liste de tags legacy (`tags = ["php", "symfony", "wordpress", ...]`) du template hero.
+  - [x] Intégrer `<HomeBootOverlay @boot-complete="onBootComplete" />` et `<HomeHeroTerminal :auto-start="isBootFinished" />`.
+
+- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
+  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier la conformité de rendu et l'absence de régression d'hydratation (SSR/SSG Nitro).
+  - [x] Vérifier le comportement d'accessibilité au clavier (`Tab`, `Escape`) et sous contraste forcé.
+
+## Dev Notes
+
+### Architecture & Contraintes d'environnement
+- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
+- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
+- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
+- **Accessibilité (a11y) :**
+  - Le lien externe vers Malt DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`).
+  - Seul le caret de frappe actif clignote ; les carets décoratifs ou sous reduced-motion doivent être figés visibles.
+  - La touche `Escape` court-circuite le boot overlay et ne bloque aucun focus.
+  - Les puces pulsées doivent être stylisées sans animations violentes (pulsation douce ou opacité).
+
+### Analyse des fichiers modifiés et créés
+- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
+- **`app/components/home/HomeHeroTerminal.vue`** (NEW) : Terminal hero cinétique avec animation de frappe des commandes cibles, invitant ensuite à ouvrir l'easter-egg terminal.
+- **`app/pages/index.vue`** (UPDATE) : Remplacement du hero existant par le nouveau hero commercial Full Stack TS, intégration de `HomeBootOverlay` et `HomeHeroTerminal`, suppression des données legacy (`tags`, ancienne `tagline`).
+
+### Données & Textes exacts (Source : `sections-mapping.md` et `SPEC.md`)
+- **Eyebrow hero :** `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
+- **Titre principal H1 :** `Développeur Full Stack TypeScript`
+- **Pitch sous-titre :** `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
+- **Badge disponibilité :** `Disponible pour missions freelance · Profil Malt vérifié` (lien `SITE.profile.maltUrl`).
+- **Commandes terminal hero :**
+  1. `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
+  2. `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
+  3. `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
+  4. Invite finale : `anon.@jouan.ovh:~$ help` avec caret clignotant et déclencheur `openTerminal`.
+
+## Dev Agent Record
+
+### Agent Model Used
+- Gemini 3.7 Flash
+
+### Debug Log References
+- Résolution des erreurs de formatage Prettier sur `HomeHeroTerminal.vue` et `app/pages/index.vue`.
+- Résolution du typage TypeScript (`ITermRow` narrow) dans le callback asynchrone `typeRow` de `HomeHeroTerminal.vue`.
+- Validation complète de la suite Docker avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript et 13 routes statiques générées avec succès par Nitro.
+
+### Completion Notes List
+- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
+- Composant `HomeHeroTerminal.vue` créé avec simulation de frappe séquentielle des commandes Full Stack TS (`whoami`, `cat focus.txt`, `ls ~/projets`), bouton accessible `help` déclenchant l'easter egg terminal modal, et figeage statique sous reduced motion.
+- Page `app/pages/index.vue` refondue avec nouveau positionnement commercial Full Stack TS, badge Malt vérifié avec lien `<ZExternalLink>`, CTAs d'action ciblés, et orchestration via événement `@boot-complete`.
+
+### File List
+- `app/components/home/HomeBootOverlay.vue` (NEW)
+- `app/components/home/HomeHeroTerminal.vue` (NEW)
+- `app/pages/index.vue` (MODIFIED)
+- `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+
+## References
+
+- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
+- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
+- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
+- [Profil Malt officiel : docs/contexte_malt.md]
+- [Directives globales pour agents : AGENTS.md]
+- [Leçons de la Story 11.1 : docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md]
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 9235a51..6706d58 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.1 done : Préparation de branche, site.ts & Atmosphère)"
+last_updated: "2026-09-13 (Story 11.2 review : Séquence de Boot & Hero commercial)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -120,7 +120,7 @@ development_status:
   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   epic-11: in-progress
   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
-  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
+  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: review
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: backlog

exec
/bin/zsh -lc "rg -n '"'^diff --git|''^@@|''^'"\\+.*(TODO|FIXME|window|document|sessionStorage|matchMedia|prefers|animation|@keyframes|z-index|aria|Malt|services|stats|projects|tagline|tags|h1|eyebrow|help|NuxtLink)' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
6:@@ -0,0 +1,230 @@
13:+    aria-live="polite"
22:+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
23:+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
25:+      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
37:+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
38:+// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
39:+// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
74:+      sessionStorage.setItem("jouan_boot_done", "1");
76:+      // Ignore sessionStorage exceptions (private browsing / quota)
118:+  window.addEventListener("keydown", handleKeydown);
123:+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
128:+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
142:+  window.removeEventListener("keydown", handleKeydown);
159:+  z-index: 200;
231:+@media (prefers-reduced-motion: reduce) {
237:diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
242:@@ -0,0 +1,363 @@
246:+      <span class="hero-term__dots" aria-hidden="true">
257:+        <p class="hero-term__line" aria-hidden="true">
270:+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
286:+        aria-label="Ouvrir le terminal interactif"
287:+        aria-haspopup="dialog"
295:+          <span class="prm__cmd">help</span>
296:+          <span class="prm__caret" aria-hidden="true" />
308:+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
309:+// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
310:+// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
367:+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
429:+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
597:+  animation: caret-blink 1s steps(1) infinite;
600:+@media (prefers-reduced-motion: reduce) {
602:+    animation: none;
606:diff --git a/app/pages/index.vue b/app/pages/index.vue
610:@@ -1,69 +1,41 @@
626:+            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
627:+            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
634:+              <span class="hero__pulse-dot" aria-hidden="true" />
637:+                Profil Malt vérifié
648:+              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
701:@@ -129,20 +101,21 @@
731:@@ -177,28 +150,14 @@ const stats = [
762:@@ -217,9 +176,9 @@ const homeJsonLd = [
774:@@ -313,168 +272,32 @@ usePageSeo({
960:@@ -658,8 +481,7 @@ usePageSeo({
970:diff --git a/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
975:@@ -0,0 +1,141 @@
996:+   **Then** l'overlay de boot (`HomeBootOverlay.vue`, simulant `jouan.os`) s'affiche au premier plan (`z-index: 200`), déroule la montée en charge système (`initialisation du noyau…`, `montage de /dev/portfolio`, `chargement des polices Ubuntu Mono`, `compilation des projets [ok]`, `démarrage du serveur [ok]`) avec jauge de progression
998:+   **And** un clic n'importe où sur l'overlay ou la pression sur la touche `Escape` court-circuite immédiatement l'animation (`finishBoot`)
999:+   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
1000:+   **And** sous `@media (prefers-reduced-motion: reduce)`, la séquence de boot est immédiatement court-circuitée sans animation ni délai.
1008:+   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
1009:+   **And** sous `@media (prefers-reduced-motion: reduce)`, les lignes du terminal hero s'affichent instantanément en texte statique complet sans animation de frappe, le caret restant figé visible.
1014:+     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
1015:+     - Titre principal `<h1>` : `Développeur Full Stack TypeScript`
1017:+     - Badge de statut de disponibilité : puce pulsée (`--success`), texte `Disponible pour missions freelance · Profil Malt vérifié`, encapsulant un lien accessible vers Malt via `<ZExternalLink :href="SITE.profile.maltUrl">`
1019:+       - CTA primaire : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Discuter de votre projet<template #iconRight><ZIcon name="arrow" /></template></ZButton>`
1020:+       - CTA secondaire : `<ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg">Voir le parcours &amp; CV</ZButton>`
1021:+   **And** les anciens tags WordPress/PHP (`php`, `symfony`, `wordpress`) et l'ancienne accroche (« Du code sur-mesure, de l'IA utile ») sont définitivement retirés du Hero.
1032:+  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
1034:+  - [x] Supporter `prefers-reduced-motion: reduce` en zappant instantanément la séquence (`finishBoot()`).
1041:+  - [x] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
1042:+  - [x] Assurer la neutralisation sous `prefers-reduced-motion: reduce` : contenu affiché immédiatement dans son état final, caret figé visible.
1043:+  - [x] Styliser avec les variables de Design System (`--bg-terminal`, `--font-mono`, `--term-red`, `--term-yellow`, `--term-green`, `--term-blue`, etc.).
1046:+  - [x] Mettre à jour l'eyebrow : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`.
1047:+  - [x] Mettre à jour le titre `h1` : `Développeur Full Stack TypeScript`.
1049:+  - [x] Intégrer le badge de disponibilité avec puce pulsée et lien `<ZExternalLink :href="SITE.profile.maltUrl">Profil Malt vérifié</ZExternalLink>`.
1051:+  - [x] Supprimer la liste de tags legacy (`tags = ["php", "symfony", "wordpress", ...]`) du template hero.
1063:+- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
1064:+- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
1066:+  - Le lien externe vers Malt DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`).
1069:+  - Les puces pulsées doivent être stylisées sans animations violentes (pulsation douce ou opacité).
1072:+- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
1073:+- **`app/components/home/HomeHeroTerminal.vue`** (NEW) : Terminal hero cinétique avec animation de frappe des commandes cibles, invitant ensuite à ouvrir l'easter-egg terminal.
1074:+- **`app/pages/index.vue`** (UPDATE) : Remplacement du hero existant par le nouveau hero commercial Full Stack TS, intégration de `HomeBootOverlay` et `HomeHeroTerminal`, suppression des données legacy (`tags`, ancienne `tagline`).
1080:+- **Badge disponibilité :** `Disponible pour missions freelance · Profil Malt vérifié` (lien `SITE.profile.maltUrl`).
1085:+  4. Invite finale : `anon.@jouan.ovh:~$ help` avec caret clignotant et déclencheur `openTerminal`.
1098:+- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
1099:+- Composant `HomeHeroTerminal.vue` créé avec simulation de frappe séquentielle des commandes Full Stack TS (`whoami`, `cat focus.txt`, `ls ~/projets`), bouton accessible `help` déclenchant l'easter egg terminal modal, et figeage statique sous reduced motion.
1100:+- Page `app/pages/index.vue` refondue avec nouveau positionnement commercial Full Stack TS, badge Malt vérifié avec lien `<ZExternalLink>`, CTAs d'action ciblés, et orchestration via événement `@boot-complete`.
1114:+- [Profil Malt officiel : docs/contexte_malt.md]
1117:diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
1121:@@ -35,7 +35,7 @@
1130:@@ -120,7 +120,7 @@ development_status:

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-2/full.diff | sed -n '237,620p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   237	diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
   238	new file mode 100644
   239	index 0000000..82a1aac
   240	--- /dev/null
   241	+++ b/app/components/home/HomeHeroTerminal.vue
   242	@@ -0,0 +1,363 @@
   243	+<template>
   244	+  <div class="hero-term">
   245	+    <div class="hero-term__bar">
   246	+      <span class="hero-term__dots" aria-hidden="true">
   247	+        <span class="hero-term__dot hero-term__dot--close" />
   248	+        <span class="hero-term__dot hero-term__dot--min" />
   249	+        <span class="hero-term__dot hero-term__dot--max" />
   250	+      </span>
   251	+      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
   252	+    </div>
   253	+
   254	+    <div class="hero-term__body">
   255	+      <!-- Lignes complètes terminées -->
   256	+      <template v-for="(row, idx) in executedRows" :key="idx">
   257	+        <p class="hero-term__line" aria-hidden="true">
   258	+          <span class="prm">
   259	+            <span class="prm__user">anon.@jouan.ovh</span>
   260	+            <span class="prm__sep">:</span>
   261	+            <span class="prm__dir">~</span>
   262	+            <span class="prm__sep">$ </span>
   263	+            <span class="prm__cmd">{{ row.cmd }}</span>
   264	+          </span>
   265	+        </p>
   266	+        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
   267	+      </template>
   268	+
   269	+      <!-- Ligne en cours de frappe -->
   270	+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
   271	+        <span class="prm">
   272	+          <span class="prm__user">anon.@jouan.ovh</span>
   273	+          <span class="prm__sep">:</span>
   274	+          <span class="prm__dir">~</span>
   275	+          <span class="prm__sep">$ </span>
   276	+          <span class="prm__cmd">{{ currentTypingText }}</span>
   277	+          <span class="prm__caret" />
   278	+        </span>
   279	+      </p>
   280	+
   281	+      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
   282	+      <button
   283	+        v-if="isSequenceComplete"
   284	+        type="button"
   285	+        class="hero-term__open"
   286	+        aria-label="Ouvrir le terminal interactif"
   287	+        aria-haspopup="dialog"
   288	+        @click="openTerminal"
   289	+      >
   290	+        <span class="prm">
   291	+          <span class="prm__user">anon.@jouan.ovh</span>
   292	+          <span class="prm__sep">:</span>
   293	+          <span class="prm__dir">~</span>
   294	+          <span class="prm__sep">$ </span>
   295	+          <span class="prm__cmd">help</span>
   296	+          <span class="prm__caret" aria-hidden="true" />
   297	+        </span>
   298	+      </button>
   299	+    </div>
   300	+  </div>
   301	+</template>
   302	+
   303	+<script setup lang="ts">
   304	+import { ref, watch, onMounted, onUnmounted } from "vue";
   305	+import { useTerminal } from "~/composables/useTerminal";
   306	+
   307	+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
   308	+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
   309	+// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
   310	+// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
   311	+
   312	+const props = withDefaults(
   313	+  defineProps<{
   314	+    autoStart?: boolean;
   315	+  }>(),
   316	+  {
   317	+    autoStart: true,
   318	+  },
   319	+);
   320	+
   321	+const { open: openTerminal } = useTerminal();
   322	+
   323	+interface ITermRow {
   324	+  cmd: string;
   325	+  out: string;
   326	+  tone: "ink" | "blue" | "green";
   327	+}
   328	+
   329	+const fullRows: ITermRow[] = [
   330	+  {
   331	+    cmd: "whoami",
   332	+    out: "Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)",
   333	+    tone: "ink",
   334	+  },
   335	+  {
   336	+    cmd: "cat focus.txt",
   337	+    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
   338	+    tone: "blue",
   339	+  },
   340	+  {
   341	+    cmd: "ls ~/projets",
   342	+    out: "keova.app/  tryon-saas/  nodium-lab/",
   343	+    tone: "green",
   344	+  },
   345	+];
   346	+
   347	+const executedRows = ref<ITermRow[]>([]);
   348	+const currentTypingLine = ref<ITermRow | null>(null);
   349	+const currentTypingText = ref("");
   350	+const isSequenceComplete = ref(false);
   351	+
   352	+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
   353	+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
   354	+let isStarted = false;
   355	+
   356	+function showInstantState() {
   357	+  executedRows.value = [...fullRows];
   358	+  currentTypingLine.value = null;
   359	+  currentTypingText.value = "";
   360	+  isSequenceComplete.value = true;
   361	+}
   362	+
   363	+function startTypingSequence() {
   364	+  if (isStarted) return;
   365	+  isStarted = true;
   366	+
   367	+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   368	+
   369	+  if (reduceMotion) {
   370	+    showInstantState();
   371	+    return;
   372	+  }
   373	+
   374	+  let rowIndex = 0;
   375	+
   376	+  function typeRow() {
   377	+    if (rowIndex >= fullRows.length) {
   378	+      currentTypingLine.value = null;
   379	+      currentTypingText.value = "";
   380	+      isSequenceComplete.value = true;
   381	+      return;
   382	+    }
   383	+
   384	+    const row = fullRows[rowIndex];
   385	+    if (!row) return;
   386	+
   387	+    const activeRow: ITermRow = row;
   388	+    currentTypingLine.value = activeRow;
   389	+    currentTypingText.value = "";
   390	+
   391	+    let charIndex = 0;
   392	+    const fullCmd = activeRow.cmd;
   393	+
   394	+    function typeChar() {
   395	+      if (charIndex < fullCmd.length) {
   396	+        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
   397	+        charIndex++;
   398	+        typingTimeoutId = setTimeout(typeChar, 46);
   399	+      } else {
   400	+        // Commande entièrement tapée, afficher le résultat après une pause
   401	+        stepTimeoutId = setTimeout(() => {
   402	+          executedRows.value.push(activeRow);
   403	+          currentTypingLine.value = null;
   404	+          currentTypingText.value = "";
   405	+          rowIndex++;
   406	+          stepTimeoutId = setTimeout(typeRow, 280);
   407	+        }, 200);
   408	+      }
   409	+    }
   410	+
   411	+    typeChar();
   412	+  }
   413	+
   414	+  typeRow();
   415	+}
   416	+
   417	+watch(
   418	+  () => props.autoStart,
   419	+  (shouldStart) => {
   420	+    if (shouldStart && !isStarted) {
   421	+      startTypingSequence();
   422	+    }
   423	+  },
   424	+);
   425	+
   426	+onMounted(() => {
   427	+  if (!import.meta.client) return;
   428	+
   429	+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   430	+  if (reduceMotion) {
   431	+    showInstantState();
   432	+    return;
   433	+  }
   434	+
   435	+  if (props.autoStart) {
   436	+    startTypingSequence();
   437	+  }
   438	+});
   439	+
   440	+onUnmounted(() => {
   441	+  if (typingTimeoutId !== null) {
   442	+    clearTimeout(typingTimeoutId);
   443	+    typingTimeoutId = null;
   444	+  }
   445	+  if (stepTimeoutId !== null) {
   446	+    clearTimeout(stepTimeoutId);
   447	+    stepTimeoutId = null;
   448	+  }
   449	+});
   450	+</script>
   451	+
   452	+<style lang="scss" scoped>
   453	+/* stylelint-disable selector-class-pattern */
   454	+.hero-term {
   455	+  display: flex;
   456	+  flex-direction: column;
   457	+  min-height: 300px;
   458	+  overflow: hidden;
   459	+  border: 1px solid var(--accent-2-soft);
   460	+  border-radius: var(--radius-sm);
   461	+  box-shadow: var(--glow-terminal);
   462	+}
   463	+
   464	+.hero-term__bar {
   465	+  position: relative;
   466	+  display: flex;
   467	+  flex: none;
   468	+  align-items: center;
   469	+  gap: var(--space-2);
   470	+  height: 30px;
   471	+  padding: 0 var(--space-3);
   472	+  background: var(--aubergine-black);
   473	+}
   474	+
   475	+.hero-term__dots {
   476	+  display: flex;
   477	+  align-items: center;
   478	+  gap: 7px;
   479	+}
   480	+
   481	+.hero-term__dot {
   482	+  width: 13px;
   483	+  height: 13px;
   484	+  border-radius: var(--radius-circle);
   485	+}
   486	+
   487	+.hero-term__dot--close {
   488	+  background: var(--term-red);
   489	+}
   490	+
   491	+.hero-term__dot--min {
   492	+  background: var(--term-yellow);
   493	+}
   494	+
   495	+.hero-term__dot--max {
   496	+  background: var(--term-green);
   497	+}
   498	+
   499	+.hero-term__title {
   500	+  position: absolute;
   501	+  inset: 0;
   502	+  font-family: var(--font-mono);
   503	+  font-size: var(--fs-xs);
   504	+  letter-spacing: var(--ls-wide);
   505	+  color: var(--text-muted);
   506	+  text-align: center;
   507	+  pointer-events: none;
   508	+}
   509	+
   510	+.hero-term__body {
   511	+  flex: 1;
   512	+  min-height: 0;
   513	+  padding: var(--space-4);
   514	+  overflow: auto;
   515	+  font-family: var(--font-mono);
   516	+  font-size: var(--fs-sm);
   517	+  line-height: var(--lh-snug);
   518	+  color: var(--ink-1);
   519	+  background: var(--bg-terminal);
   520	+  overflow-wrap: break-word;
   521	+}
   522	+
   523	+@supports (backdrop-filter: blur(5px)) {
   524	+  .hero-term__body {
   525	+    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
   526	+    backdrop-filter: blur(5px);
   527	+  }
   528	+}
   529	+
   530	+.hero-term__line {
   531	+  margin: 0;
   532	+}
   533	+
   534	+.hero-term__out {
   535	+  margin: 0 0 var(--space-4);
   536	+}
   537	+
   538	+.hero-term__out--ink {
   539	+  color: var(--ink-1);
   540	+}
   541	+
   542	+.hero-term__out--blue {
   543	+  color: var(--term-blue);
   544	+}
   545	+
   546	+.hero-term__out--green {
   547	+  color: var(--term-green);
   548	+}
   549	+
   550	+.hero-term__open {
   551	+  display: block;
   552	+  width: 100%;
   553	+  padding: 0;
   554	+  font: inherit;
   555	+  text-align: left;
   556	+  cursor: pointer;
   557	+  background: none;
   558	+  border: none;
   559	+  border-radius: var(--radius-xs);
   560	+
   561	+  &:focus-visible {
   562	+    outline: 2px solid transparent;
   563	+    outline-offset: 2px;
   564	+    box-shadow: var(--ring-accent);
   565	+  }
   566	+}
   567	+
   568	+.prm {
   569	+  font-family: var(--font-mono);
   570	+}
   571	+
   572	+.prm__user {
   573	+  font-weight: var(--fw-bold);
   574	+  color: var(--prompt);
   575	+}
   576	+
   577	+.prm__sep {
   578	+  color: var(--ink-1);
   579	+}
   580	+
   581	+.prm__dir {
   582	+  font-weight: var(--fw-bold);
   583	+  color: var(--term-blue);
   584	+}
   585	+
   586	+.prm__cmd {
   587	+  color: var(--ink-1);
   588	+}
   589	+
   590	+.prm__caret {
   591	+  display: inline-block;
   592	+  width: 0.55em;
   593	+  height: 1.05em;
   594	+  margin-left: 1px;
   595	+  vertical-align: text-bottom;
   596	+  background: var(--prompt);
   597	+  animation: caret-blink 1s steps(1) infinite;
   598	+}
   599	+
   600	+@media (prefers-reduced-motion: reduce) {
   601	+  .prm__caret {
   602	+    animation: none;
   603	+  }
   604	+}
   605	+</style>
   606	diff --git a/app/pages/index.vue b/app/pages/index.vue
   607	index e1e048c..51c7a1c 100644
   608	--- a/app/pages/index.vue
   609	+++ b/app/pages/index.vue
   610	@@ -1,69 +1,41 @@
   611	 <template>
   612	   <main class="home">
   613	+    <HomeBootOverlay @boot-complete="onBootComplete" />
   614	     <HomeAtmosComponent />
   615	     <ZCustomCursor />
   616	 
   617	     <section class="hero hero__grad">
   618	       <div class="hero__in container">
   619	         <div class="hero__grid">
   620	-          <!-- Colonne gauche : accroche, CTA, tags -->

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-2/full.diff | sed -n '606,970p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   606	diff --git a/app/pages/index.vue b/app/pages/index.vue
   607	index e1e048c..51c7a1c 100644
   608	--- a/app/pages/index.vue
   609	+++ b/app/pages/index.vue
   610	@@ -1,69 +1,41 @@
   611	 <template>
   612	   <main class="home">
   613	+    <HomeBootOverlay @boot-complete="onBootComplete" />
   614	     <HomeAtmosComponent />
   615	     <ZCustomCursor />
   616	 
   617	     <section class="hero hero__grad">
   618	       <div class="hero__in container">
   619	         <div class="hero__grid">
   620	-          <!-- Colonne gauche : accroche, CTA, tags -->
   621	+          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
   622	           <div class="anim hero__text">
   623	-            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
   624	-            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
   625	-            <p class="hero__sub">{{ tagline }}</p>
   626	+            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
   627	+            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
   628	+            <p class="hero__sub">
   629	+              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
   630	+              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
   631	+            </p>
   632	+
   633	+            <div class="hero__badge-wrap">
   634	+              <span class="hero__pulse-dot" aria-hidden="true" />
   635	+              <span>Disponible pour missions freelance · </span>
   636	+              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
   637	+                Profil Malt vérifié
   638	+              </ZExternalLink>
   639	+            </div>
   640	+
   641	             <div class="hero__cta">
   642	               <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
   643	-                Démarrer un projet
   644	+                Discuter de votre projet
   645	                 <template #iconRight><ZIcon name="arrow" /></template>
   646	               </ZButton>
   647	-              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
   648	+              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
   649	             </div>
   650	-            <ul class="hero__tags">
   651	-              <li v-for="tag in tags" :key="tag">
   652	-                <ZTag>{{ tag }}</ZTag>
   653	-              </li>
   654	-            </ul>
   655	           </div>
   656	 
   657	-          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
   658	+          <!-- Colonne droite : terminal hero cinétique -->
   659	           <div class="anim hero__term-col">
   660	-            <div class="hero-term">
   661	-              <div class="hero-term__bar">
   662	-                <span class="hero-term__dots" aria-hidden="true">
   663	-                  <span class="hero-term__dot hero-term__dot--close" />
   664	-                  <span class="hero-term__dot hero-term__dot--min" />
   665	-                  <span class="hero-term__dot hero-term__dot--max" />
   666	-                </span>
   667	-                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
   668	-              </div>
   669	-
   670	-              <div class="hero-term__body">
   671	-                <template v-for="row in terminalRows" :key="row.id">
   672	-                  <p class="hero-term__line" aria-hidden="true">
   673	-                    <span class="prm"
   674	-                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
   675	-                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
   676	-                      ><span class="prm__cmd">{{ row.cmd }}</span></span
   677	-                    >
   678	-                  </p>
   679	-                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
   680	-                </template>
   681	-
   682	-                <button
   683	-                  type="button"
   684	-                  class="hero-term__open"
   685	-                  aria-label="Ouvrir le terminal interactif"
   686	-                  aria-haspopup="dialog"
   687	-                  @click="openTerminal"
   688	-                >
   689	-                  <span class="prm"
   690	-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
   691	-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
   692	-                    ><span class="prm__caret" aria-hidden="true"
   693	-                  /></span>
   694	-                </button>
   695	-              </div>
   696	-            </div>
   697	+            <HomeHeroTerminal :auto-start="isBootFinished" />
   698	           </div>
   699	         </div>
   700	       </div>
   701	@@ -129,20 +101,21 @@
   702	 </template>
   703	 
   704	 <script setup lang="ts">
   705	-// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   706	-// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   707	-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   708	+// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
   709	+// Architecture multi-pages Nuxt 4, dark-first, accent orange.
   710	+import { ref } from "vue";
   711	 import { NuxtLink, ZExternalLink } from "#components";
   712	-import { useTerminal } from "~/composables/useTerminal";
   713	 import { SITE } from "~/data/site";
   714	 
   715	-// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
   716	-const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
   717	-const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
   718	+const isBootFinished = ref(false);
   719	+
   720	+function onBootComplete() {
   721	+  isBootFinished.value = true;
   722	+}
   723	 
   724	 // Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   725	 // (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   726	-// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
   727	+// `id` = clé v-for stable (indépendante du contenu affiché).
   728	 const services = [
   729	   {
   730	     id: "wordpress",
   731	@@ -177,28 +150,14 @@ const stats = [
   732	 // Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   733	 const projects = SITE.projects;
   734	 
   735	-// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
   736	-// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
   737	-// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
   738	-const terminalRows = [
   739	-  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
   740	-  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
   741	-  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
   742	-];
   743	-
   744	-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
   745	-// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
   746	-// restylisation du terminal lui-même relève d'Epic 8.
   747	-const { open: openTerminal } = useTerminal();
   748	-
   749	 const siteUrl = useSiteUrl();
   750	 const homeJsonLd = [
   751	   {
   752	     "@context": "https://schema.org",
   753	     "@type": "WebSite",
   754	-    name: "Simon Jouan — Développeur web freelance",
   755	+    name: "Simon Jouan — Développeur Full Stack TypeScript",
   756	     url: siteUrl,
   757	-    description: tagline,
   758	+    description: SITE.profile.role,
   759	   },
   760	   {
   761	     "@context": "https://schema.org",
   762	@@ -217,9 +176,9 @@ const homeJsonLd = [
   763	 ];
   764	 
   765	 usePageSeo({
   766	-  title: "Simon Jouan — Développeur web freelance & IA",
   767	+  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   768	   description:
   769	-    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
   770	+    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   771	   path: "/",
   772	   image: "/images/portrait.jpeg",
   773	   type: "website",
   774	@@ -313,168 +272,32 @@ usePageSeo({
   775	   margin-bottom: var(--space-6);
   776	 }
   777	 
   778	-// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
   779	-
   780	-// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
   781	-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
   782	-// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
   783	-// l'identique la spec du composant DS et n'ont pas de token d'espacement
   784	-// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
   785	-// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
   786	-// scrollbar parasite si le rendu mono dépasse de quelques px.
   787	-.hero-term {
   788	-  display: flex;
   789	-  flex-direction: column;
   790	-  min-height: 300px;
   791	-  overflow: hidden;
   792	-  border: 1px solid var(--accent-2-soft);
   793	-  border-radius: var(--radius-sm);
   794	-  box-shadow: var(--glow-terminal);
   795	-}
   796	-
   797	-.hero-term__bar {
   798	-  position: relative;
   799	-  display: flex;
   800	-  flex: none;
   801	+// ---- Badge de disponibilité & CTAs ----
   802	+.hero__badge-wrap {
   803	+  display: inline-flex;
   804	   align-items: center;
   805	   gap: var(--space-2);
   806	-  height: 30px;
   807	-  padding: 0 var(--space-3);
   808	-  background: var(--aubergine-black);
   809	-}
   810	-
   811	-.hero-term__dots {
   812	-  display: flex;
   813	-  align-items: center;
   814	-  gap: 7px;
   815	-}
   816	-
   817	-.hero-term__dot {
   818	-  width: 13px;
   819	-  height: 13px;
   820	-  border-radius: var(--radius-circle);
   821	-}
   822	-
   823	-.hero-term__dot--close {
   824	-  background: var(--term-red);
   825	-}
   826	-
   827	-.hero-term__dot--min {
   828	-  background: var(--term-yellow);
   829	-}
   830	-
   831	-.hero-term__dot--max {
   832	-  background: var(--term-green);
   833	-}
   834	-
   835	-.hero-term__title {
   836	-  position: absolute;
   837	-  inset: 0;
   838	-  font-family: var(--font-mono);
   839	-  font-size: var(--fs-xs);
   840	-  letter-spacing: var(--ls-wide);
   841	-  color: var(--text-muted);
   842	-  text-align: center;
   843	-  pointer-events: none;
   844	-}
   845	-
   846	-.hero-term__body {
   847	-  flex: 1;
   848	-  min-height: 0;
   849	-  padding: var(--space-4);
   850	-  overflow: auto;
   851	+  margin-bottom: var(--space-6);
   852	   font-family: var(--font-mono);
   853	   font-size: var(--fs-sm);
   854	-  line-height: var(--lh-snug);
   855	-  color: var(--ink-1);
   856	-  background: var(--bg-terminal);
   857	-  overflow-wrap: break-word;
   858	-}
   859	-
   860	-@supports (backdrop-filter: blur(5px)) {
   861	-  .hero-term__body {
   862	-    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
   863	-    backdrop-filter: blur(5px);
   864	-  }
   865	-}
   866	-
   867	-.hero-term__line {
   868	-  margin: 0;
   869	-}
   870	-
   871	-.hero-term__out {
   872	-  margin: 0 0 var(--space-4);
   873	-}
   874	-
   875	-.hero-term__out--ink {
   876	-  color: var(--ink-1);
   877	-}
   878	-
   879	-.hero-term__out--blue {
   880	-  color: var(--term-blue);
   881	-}
   882	-
   883	-.hero-term__out--green {
   884	-  color: var(--term-green);
   885	-}
   886	+  color: var(--text-muted);
   887	 
   888	-// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
   889	-.hero-term__open {
   890	-  display: block;
   891	-  width: 100%;
   892	-  padding: 0;
   893	-  font: inherit;
   894	-  text-align: left;
   895	-  cursor: pointer;
   896	-  background: none;
   897	-  border: none;
   898	-  border-radius: var(--radius-xs);
   899	+  a {
   900	+    color: var(--accent);
   901	+    text-decoration: underline;
   902	 
   903	-  &:focus-visible {
   904	-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
   905	-    // relais), mais rendu en couleur système sous forced-colors (Windows High
   906	-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
   907	-    outline: 2px solid transparent;
   908	-    outline-offset: 2px;
   909	-    box-shadow: var(--ring-accent);
   910	+    &:hover {
   911	+      color: var(--accent-hover);
   912	+    }
   913	   }
   914	 }
   915	 
   916	-// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
   917	-.prm {
   918	-  font-family: var(--font-mono);
   919	-}
   920	-
   921	-.prm__user {
   922	-  font-weight: var(--fw-bold);
   923	-  color: var(--prompt);
   924	-}
   925	-
   926	-.prm__sep {
   927	-  color: var(--ink-1);
   928	-}
   929	-
   930	-.prm__dir {
   931	-  font-weight: var(--fw-bold);
   932	-  color: var(--term-blue);
   933	-}
   934	-
   935	-.prm__cmd {
   936	-  color: var(--ink-1);
   937	-}
   938	-
   939	-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
   940	-// proportionnel à la police) — pas de token équivalent pour un curseur.
   941	-.prm__caret {
   942	-  display: inline-block;
   943	-  width: 0.55em;
   944	-  height: 1.05em;
   945	-  margin-left: 1px;
   946	-  vertical-align: text-bottom;
   947	-  background: var(--prompt);
   948	-
   949	-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
   950	-  animation: caret-blink 1s steps(1) infinite;
   951	+.hero__pulse-dot {
   952	+  width: 8px;
   953	+  height: 8px;
   954	+  border-radius: var(--radius-circle);
   955	+  background: var(--term-green);
   956	+  box-shadow: 0 0 8px var(--term-green);
   957	 }
   958	 
   959	 .section__title {
   960	@@ -658,8 +481,7 @@ usePageSeo({
   961	 }
   962	 
   963	 @media (prefers-reduced-motion: reduce) {
   964	-  .anim,
   965	-  .prm__caret {
   966	+  .anim {
   967	     animation: none;
   968	   }
   969	 }
   970	diff --git a/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md

exec
/bin/zsh -lc "sed -n '1,160p' app/components/ui/ZExternalLink.vue; sed -n '1,220p' app/components/ui/ZButton.vue; sed -n '1,220p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n -C 5 '11\\.2|FR19|FR20|UX-DR19|UX-DR20|CAP-2|CAP-3' docs/specs/spec-home-awwwards docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <a :href="href" :rel="computedRel" target="_blank">
    <slot />
    <span class="screen-reader-text">{{ computedSrText }}</span>
  </a>
</template>

<script setup lang="ts">
// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" garanti),
// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
// (Story 10.3 — WCAG G201 / FR13).
import { computed } from "vue";

interface Props {
  /** URL externe cible. */
  href: string;
  /**
   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
   * Peut être étendu à "noopener noreferrer" si nécessaire. "noopener" reste garanti.
   * @default "noopener"
   */
  rel?: string;
  /** Libellé accessible alternatif pour l'annonce sr-only. */
  srText?: string;
}

const DEFAULT_SR_TEXT = " (ouvre dans un nouvel onglet)";

const props = withDefaults(defineProps<Props>(), {
  rel: "noopener",
  srText: DEFAULT_SR_TEXT,
});

const computedRel = computed(() => {
  const custom = props.rel?.trim();
  if (!custom) {
    return "noopener";
  }
  const tokens = new Set(custom.split(/\s+/));
  tokens.add("noopener");
  return Array.from(tokens).join(" ");
});

const computedSrText = computed(() => {
  return props.srText && props.srText.trim() ? props.srText : DEFAULT_SR_TEXT;
});
</script>
<template>
  <component
    :is="as"
    v-bind="passthroughAttrs"
    class="zbtn"
    :class="[`zbtn--${variant}`, `zbtn--${size}`]"
    :type="buttonType"
    :disabled="isNativeButton ? disabled || undefined : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    :tabindex="isDisabledNonNative ? -1 : undefined"
    @click="blockDisabledActivation"
    @keydown.enter="blockDisabledActivation"
    @keydown.space="blockDisabledActivation"
  >
    <span v-if="icon || $slots.icon" class="zbtn__icon">
      <component :is="icon" v-if="icon" aria-hidden="true" />
      <slot v-else name="icon" />
    </span>
    <slot />
    <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
      <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
      <slot v-else name="iconRight" />
    </span>
  </component>
</template>

<script setup lang="ts">
// Primitive bouton du DS — label mono, accent orange Ubuntu en primary.
// Porté de docs/design_system/components/core/Button.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

type IconProp = string | Component;

interface Props {
  /** Style visuel. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" — hauteurs 28 / 36 / 44 */
  size?: "sm" | "md" | "lg";
  /** Icône leading via composant Vue ou nom de composant. */
  icon?: IconProp;
  /** Icône trailing via composant Vue ou nom de composant. */
  iconRight?: IconProp;
  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
  as?: string | Component;
  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: undefined,
  iconRight: undefined,
  as: "button",
  disabled: false,
});

const attrs = useAttrs();
// `as` accepte une balise native ("button", "a") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const isDisabledNonNative = computed(() => !isNativeButton.value && props.disabled);
const buttonType = computed(() => {
  if (!isNativeButton.value) {
    return undefined;
  }

  return typeof attrs.type === "string" ? attrs.type : "button";
});

const passthroughAttrs = computed(() => {
  if (!isDisabledNonNative.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
    }),
  );
});

function blockDisabledActivation(event: Event) {
  if (!isDisabledNonNative.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if ("stopImmediatePropagation" in event) {
    event.stopImmediatePropagation();
  }
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
.zbtn {
  --_h: 36px;
  --_px: var(--space-4);
  --_fs: var(--fs-sm);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
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
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &:focus-visible {
    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
    // relais), mais rendu en couleur système sous forced-colors (Windows High
    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }

  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.zbtn__icon {
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

// ---- Tailles ----
.zbtn--sm {
  --_h: 28px;
  --_px: var(--space-3);
  --_fs: var(--fs-xs);
}

.zbtn--lg {
  --_h: 44px;
  --_px: var(--space-5);
  --_fs: var(--fs-base);
}

// ---- Variantes ----
.zbtn--primary {
  background: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent);

  &:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  &:active {
    background: var(--accent-active);
    border-color: var(--accent-active);
    transform: translateY(1px);
  }
}

.zbtn--secondary {
  background: var(--surface-2);
  color: var(--text-strong);
  border-color: var(--border-default);

  &:hover {
    background: var(--surface-3);
    border-color: var(--border-strong);
  }

  &:active {
    transform: translateY(1px);
  }
}

.zbtn--ghost {
  background: transparent;
  color: var(--text-body);
  border-color: transparent;

  &:hover {
    background: var(--surface-2);
    color: var(--text-strong);
  }
}

.zbtn--terminal {
  background: var(--bg-terminal);
<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, le contenu est le héros.
// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Hover lift + bordure plus claire. @default false */
  interactive?: boolean;
  /** Barre d'accent orange→aubergine en haut. @default false */
  accent?: boolean;
  /** Anneau de glow orange (offre mise en avant). @default false */
  featured?: boolean;
  /** Padding interne `--space-6`. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
});

const attrs = useAttrs();
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

  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
  // aucun indicateur. Sans effet sur les cartes non focusables (div).
  &:focus-visible {
    // Outline transparent → rendu en couleur système sous forced-colors (où les
    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
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
  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>

 succeeded in 0ms:
docs/planning-artifacts/epics.md-27-## Requirements Inventory
docs/planning-artifacts/epics.md-28-
docs/planning-artifacts/epics.md-29-### Functional Requirements
docs/planning-artifacts/epics.md-30-
docs/planning-artifacts/epics.md-31-FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
docs/planning-artifacts/epics.md:32:FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
docs/planning-artifacts/epics.md:33:FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
docs/planning-artifacts/epics.md-34-FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
docs/planning-artifacts/epics.md-35-FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md-36-FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
docs/planning-artifacts/epics.md-37-FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
docs/planning-artifacts/epics.md-38-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
--
docs/planning-artifacts/epics.md-46-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
docs/planning-artifacts/epics.md-47-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
docs/planning-artifacts/epics.md-48-
docs/planning-artifacts/epics.md-49-#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
docs/planning-artifacts/epics.md-50-FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
docs/planning-artifacts/epics.md:51:FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
docs/planning-artifacts/epics.md:52:FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md-53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md-54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md-55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
docs/planning-artifacts/epics.md-56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/planning-artifacts/epics.md-57-FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
--
docs/planning-artifacts/epics.md-102-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
docs/planning-artifacts/epics.md-103-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/planning-artifacts/epics.md-104-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/planning-artifacts/epics.md-105-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/planning-artifacts/epics.md-106-UX-DR18: Pile atmosphérique `.atmos` avec 3 calques auroras floutés (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), scanlines CRT et grille de points.
docs/planning-artifacts/epics.md:107:UX-DR19: Composant `BootOverlay` avec montée en charge progressive stylisée `jouan.os`, affichage des étapes, fermeture Escape/clic et mémorisation en session.
docs/planning-artifacts/epics.md:108:UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
docs/planning-artifacts/epics.md-109-UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
docs/planning-artifacts/epics.md-110-UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
docs/planning-artifacts/epics.md-111-UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
docs/planning-artifacts/epics.md-112-UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
docs/planning-artifacts/epics.md-113-UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
--
docs/planning-artifacts/epics.md-130-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md-131-FR15: Epic 10 — SEO centralisé site-wide
docs/planning-artifacts/epics.md-132-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
docs/planning-artifacts/epics.md-133-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
docs/planning-artifacts/epics.md-134-FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
docs/planning-artifacts/epics.md:135:FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
docs/planning-artifacts/epics.md:136:FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md-137-FR21: Epic 11 — Marquee infini de la stack moderne ciblée
docs/planning-artifacts/epics.md-138-FR22: Epic 11 — Vitrine des 3 offres de services ciblées
docs/planning-artifacts/epics.md-139-FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
docs/planning-artifacts/epics.md-140-FR24: Epic 11 — Vitrine des articles récents du blog
docs/planning-artifacts/epics.md-141-FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
--
docs/planning-artifacts/epics.md-184-La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
docs/planning-artifacts/epics.md-185-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-186-
docs/planning-artifacts/epics.md-187-### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md-188-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md:189:**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
docs/planning-artifacts/epics.md-190-
docs/planning-artifacts/epics.md-191----
docs/planning-artifacts/epics.md-192-
docs/planning-artifacts/epics.md-193-## Epic 1: Migration de la stack vers Nuxt 4
docs/planning-artifacts/epics.md-194-
--
docs/planning-artifacts/epics.md-719-**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
docs/planning-artifacts/epics.md-720-**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md-721-**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
docs/planning-artifacts/epics.md-722-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-723-
docs/planning-artifacts/epics.md:724:### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
docs/planning-artifacts/epics.md-725-
docs/planning-artifacts/epics.md-726-As a prospect technique ou client potentiel,
docs/planning-artifacts/epics.md-727-I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
docs/planning-artifacts/epics.md:728:So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).
docs/planning-artifacts/epics.md-729-
docs/planning-artifacts/epics.md-730-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-731-
docs/planning-artifacts/epics.md-732-**Given** la page d'accueil avec son atmosphère en place
docs/planning-artifacts/epics.md-733-**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
--
docs/specs/spec-home-awwwards/SPEC.md-25-
docs/specs/spec-home-awwwards/SPEC.md-26-- id: CAP-1
docs/specs/spec-home-awwwards/SPEC.md-27-  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
docs/specs/spec-home-awwwards/SPEC.md-28-  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-29-
docs/specs/spec-home-awwwards/SPEC.md:30:- id: CAP-2
docs/specs/spec-home-awwwards/SPEC.md-31-  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
docs/specs/spec-home-awwwards/SPEC.md-32-  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
docs/specs/spec-home-awwwards/SPEC.md-33-
docs/specs/spec-home-awwwards/SPEC.md:34:- id: CAP-3
docs/specs/spec-home-awwwards/SPEC.md-35-  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
docs/specs/spec-home-awwwards/SPEC.md-36-  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
docs/specs/spec-home-awwwards/SPEC.md-37-
docs/specs/spec-home-awwwards/SPEC.md-38-- id: CAP-4
docs/specs/spec-home-awwwards/SPEC.md-39-  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.

exec
/bin/zsh -lc "rg -n -- '--dur-slow|--dur-fast|--success|--text-faint|--ring-accent|--font-sans|--font-mono|@keyframes caret-blink' app/assets/scss app | head -80" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:191:  font-family: var(--font-mono);
app/pages/about.vue:199:  font-family: var(--font-mono);
app/pages/about.vue:250:      box-shadow: var(--ring-accent);
app/pages/about.vue:319:  font-family: var(--font-mono);
app/pages/about.vue:329:  font-family: var(--font-mono);
app/pages/about.vue:335:  font-family: var(--font-mono);
app/pages/about.vue:342:  font-family: var(--font-sans);
app/pages/about.vue:360:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:180:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:193:    box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:204:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:238:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:247:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:256:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:281:      box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:300:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:311:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:371:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:399:  font-family: var(--font-mono);
app/pages/blog/index.vue:165:  font-family: var(--font-mono);
app/pages/blog/index.vue:212:  font-family: var(--font-mono);
app/pages/blog/index.vue:221:  font-family: var(--font-sans);
app/pages/blog/index.vue:244:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:39:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:55:  font-family: var(--font-sans);
app/assets/scss/base/_layout.scss:77:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:81:  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/pages/services.vue:187:  font-family: var(--font-mono);
app/pages/services.vue:244:  font-family: var(--font-mono);
app/pages/services.vue:252:  font-family: var(--font-sans);
app/pages/services.vue:266:    font-family: var(--font-mono);
app/pages/services.vue:285:  font-family: var(--font-mono);
app/pages/services.vue:308:  font-family: var(--font-mono);
app/pages/services.vue:324:  font-family: var(--font-mono);
app/pages/services.vue:332:  font-family: var(--font-mono);
app/pages/contact.vue:305:  font-family: var(--font-mono);
app/pages/contact.vue:345:  font-family: var(--font-mono);
app/pages/contact.vue:353:  font-family: var(--font-mono);
app/pages/contact.vue:358:  // plus lisible que --text-faint. Reste discrète. Token, pas de couleur en dur.
app/pages/contact.vue:374:    box-shadow: var(--ring-accent);
app/pages/contact.vue:386:  font-family: var(--font-mono);
app/pages/contact.vue:413:  font-family: var(--font-mono);
app/pages/contact.vue:447:    box-shadow: var(--ring-accent);
app/pages/contact.vue:464:  font-family: var(--font-mono);
app/pages/mentions-legales.vue:117:  font-family: var(--font-mono);
app/pages/mentions-legales.vue:157:  font-family: var(--font-mono);
app/pages/mentions-legales.vue:175:    box-shadow: var(--ring-accent);
app/pages/confidentialite.vue:178:  font-family: var(--font-mono);
app/pages/confidentialite.vue:218:  font-family: var(--font-mono);
app/pages/confidentialite.vue:236:    box-shadow: var(--ring-accent);
app/pages/index.vue:197:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
app/pages/index.vue:247:  font-family: var(--font-mono);
app/pages/index.vue:262:  font-family: var(--font-sans);
app/pages/index.vue:281:  font-family: var(--font-mono);
app/pages/index.vue:305:  font-family: var(--font-mono);
app/pages/index.vue:349:  font-family: var(--font-mono);
app/pages/index.vue:357:  font-family: var(--font-sans);
app/pages/index.vue:365:  font-family: var(--font-mono);
app/pages/index.vue:378:    box-shadow: var(--ring-accent);
app/pages/index.vue:394:  font-family: var(--font-mono);
app/pages/index.vue:449:  font-family: var(--font-mono);
app/pages/index.vue:456:  font-family: var(--font-mono);
app/assets/scss/abstract/_root.scss:59:  --success: hsl(143deg 58% 46%);
app/assets/scss/abstract/_root.scss:60:  --success-soft: hsl(143deg 45% 14%);
app/assets/scss/abstract/_root.scss:80:  --text-faint: var(--ink-4);
app/assets/scss/abstract/_root.scss:101:  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
app/assets/scss/abstract/_root.scss:102:  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
app/assets/scss/abstract/_root.scss:103:  --font-display: var(--font-mono);
app/assets/scss/abstract/_root.scss:191:  --ring-accent: 0 0 0 3px var(--accent-ring);
app/assets/scss/abstract/_root.scss:196:  --dur-fast: 120ms;
app/assets/scss/abstract/_root.scss:198:  --dur-slow: 320ms;
app/assets/scss/abstract/_root.scss:199:  --dur-slower: 600ms;
app/assets/scss/abstract/_root.scss:210:@keyframes caret-blink {
app/assets/scss/base/_layout.scss:39:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:55:  font-family: var(--font-sans);
app/assets/scss/base/_layout.scss:77:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:81:  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/abstract/_root.scss:59:  --success: hsl(143deg 58% 46%);
app/assets/scss/abstract/_root.scss:60:  --success-soft: hsl(143deg 45% 14%);
app/assets/scss/abstract/_root.scss:80:  --text-faint: var(--ink-4);

exec
/bin/zsh -lc "sed -n '1,240p' app/composables/useTerminal.ts; rg -n 'TerminalManager|useTerminal\\(|openTerminal|provide|inject' app | head -120" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n -C 4 'hero__pulse-dot|hero__badge|hero__title|hero__sub|hero__grid|@media \\(max-width|prefers-reduced-motion' app/pages/index.vue app/assets/scss/base/_motion.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
import { ref } from "vue";

// Lanceur partagé de l'easter-egg terminal.
//
// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
// le `HeaderComponent` ; il n'existe pas d'API globale d'ouverture. Ce registre
// minimal expose cette ouverture aux autres parties du site (ex. le hero d'accueil
// story 3.1) sans dupliquer le gestionnaire ni dépendre d'Epic 8.
//
// Le header enregistre son lanceur au montage (`register`), les appelants
// déclenchent l'ouverture (`open`). Tant qu'aucun lanceur n'est enregistré (ex.
// au prerender `nuxi generate`, avant hydratation), `open()` est un no-op sûr.
// La restylisation complète du terminal reste du périmètre d'Epic 8.

type TerminalLauncher = () => void;

const launcher = ref<TerminalLauncher | null>(null);

export function useTerminal() {
  return {
    /** Enregistre le lanceur réel (appelé par le header au montage). */
    register(fn: TerminalLauncher) {
      launcher.value = fn;
    },
    /**
     * Désenregistre le lanceur au démontage. Ne nullifie que si le lanceur
     * courant est bien `fn` (évite d'effacer un enregistrement plus récent).
     */
    unregister(fn: TerminalLauncher) {
      if (launcher.value === fn) {
        launcher.value = null;
      }
    },
    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
    open() {
      launcher.value?.();
    },
  };
}
app/pages/services.vue:149:        provider: {
app/pages/contact.vue:121:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue:147:const { open: openTerminal } = useTerminal();
app/pages/contact.vue:163:// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
app/assets/fonts/Ubuntu_Mono/UFL.txt:8:bundled, embedded, and redistributed provided the terms of this licence
app/assets/scss/abstract/_color.scss:159:// This is why we can't provide Neutral and Overlay palettes
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:74:    <TerminalManagerComponent ref="terminalManager" />
app/components/HeaderComponent.vue:82:import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";
app/components/HeaderComponent.vue:103:const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
app/components/HeaderComponent.vue:112:const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();
app/components/HeaderComponent.vue:153:function openTerminalFromMenu() {
app/utils/functions.ts:13: * Échappe les caractères HTML sensibles pour neutraliser toute injection lorsqu'une
app/composables/usePageSeo.ts:21:  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
app/components/ui/ZButton.vue:30:// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
app/composables/useTerminal.ts:5:// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
app/composables/useTerminal.ts:19:export function useTerminal() {
app/components/terminal/TerminalComponent.vue:473:    // Sorties de commandes injectées via v-html : HTML pretty-printé (\n + indentation) qui,
app/components/ui/ZIcon.vue:25:// Le `v-html` du template injecte uniquement ces chaînes internes statiques.
app/components/home/HomeHeroTerminal.vue:46:        @click="openTerminal"
app/components/home/HomeHeroTerminal.vue:68:// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
app/components/home/HomeHeroTerminal.vue:79:const { open: openTerminal } = useTerminal();
app/components/terminal/TerminalManagerComponent.vue:18:defineOptions({ name: "TerminalManagerComponent" });
app/components/terminal/TerminalManagerComponent.vue:34:// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
app/components/ui/ZCard.vue:20:// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
app/components/terminal/programs/SystemInfos.ts:8:// systématiquement avant de les injecter dans la sortie rendue via v-html.

 succeeded in 0ms:
app/assets/scss/base/_motion.scss-1-// ============================================================
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss-3-// ============================================================
app/assets/scss/base/_motion.scss-4-// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
app/assets/scss/base/_motion.scss-5-// les animations d'entrée et les transitions non essentielles sont ramenées à
app/assets/scss/base/_motion.scss-6-// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
--
app/assets/scss/base/_motion.scss-20-// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
app/assets/scss/base/_motion.scss-21-// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
app/assets/scss/base/_motion.scss-22-
app/assets/scss/base/_motion.scss-23-/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss-25-  *,
app/assets/scss/base/_motion.scss-26-  *::before,
app/assets/scss/base/_motion.scss-27-  *::after {
app/assets/scss/base/_motion.scss-28-    animation-duration: 0.01ms !important;
--
app/pages/index.vue-5-    <ZCustomCursor />
app/pages/index.vue-6-
app/pages/index.vue-7-    <section class="hero hero__grad">
app/pages/index.vue-8-      <div class="hero__in container">
app/pages/index.vue:9:        <div class="hero__grid">
app/pages/index.vue-10-          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
app/pages/index.vue-11-          <div class="anim hero__text">
app/pages/index.vue-12-            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
app/pages/index.vue:13:            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
app/pages/index.vue:14:            <p class="hero__sub">
app/pages/index.vue-15-              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
app/pages/index.vue-16-              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
app/pages/index.vue-17-            </p>
app/pages/index.vue-18-
app/pages/index.vue:19:            <div class="hero__badge-wrap">
app/pages/index.vue:20:              <span class="hero__pulse-dot" aria-hidden="true" />
app/pages/index.vue-21-              <span>Disponible pour missions freelance · </span>
app/pages/index.vue-22-              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
app/pages/index.vue-23-                Profil Malt vérifié
app/pages/index.vue-24-              </ZExternalLink>
--
app/pages/index.vue-202-  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
app/pages/index.vue-203-  animation-delay: 80ms;
app/pages/index.vue-204-}
app/pages/index.vue-205-
app/pages/index.vue:206:// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
app/pages/index.vue-207-.hero {
app/pages/index.vue-208-  position: relative;
app/pages/index.vue-209-  overflow: hidden;
app/pages/index.vue-210-}
--
app/pages/index.vue-231-  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
app/pages/index.vue-232-  padding-block: var(--space-20);
app/pages/index.vue-233-}
app/pages/index.vue-234-
app/pages/index.vue:235:.hero__grid {
app/pages/index.vue-236-  display: grid;
app/pages/index.vue-237-  grid-template-columns: 1.05fr 0.95fr;
app/pages/index.vue-238-  gap: var(--space-12);
app/pages/index.vue-239-  align-items: center;
--
app/pages/index.vue-242-// .section / .container / .eyebrow / .prose : primitives de layout globales
app/pages/index.vue-243-// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/index.vue-244-
app/pages/index.vue-245-// ---- Colonne texte ----
app/pages/index.vue:246:.hero__title {
app/pages/index.vue-247-  font-family: var(--font-mono);
app/pages/index.vue-248-  font-size: var(--fs-6xl);
app/pages/index.vue-249-  font-weight: var(--fw-light);
app/pages/index.vue-250-  letter-spacing: var(--ls-tight);
--
app/pages/index.vue-255-    color: var(--accent);
app/pages/index.vue-256-  }
app/pages/index.vue-257-}
app/pages/index.vue-258-
app/pages/index.vue:259:.hero__sub {
app/pages/index.vue-260-  max-width: 46ch;
app/pages/index.vue-261-  margin: var(--space-5) 0 var(--space-6);
app/pages/index.vue-262-  font-family: var(--font-sans);
app/pages/index.vue-263-  font-size: var(--fs-lg);
--
app/pages/index.vue-272-  margin-bottom: var(--space-6);
app/pages/index.vue-273-}
app/pages/index.vue-274-
app/pages/index.vue-275-// ---- Badge de disponibilité & CTAs ----
app/pages/index.vue:276:.hero__badge-wrap {
app/pages/index.vue-277-  display: inline-flex;
app/pages/index.vue-278-  align-items: center;
app/pages/index.vue-279-  gap: var(--space-2);
app/pages/index.vue-280-  margin-bottom: var(--space-6);
--
app/pages/index.vue-291-    }
app/pages/index.vue-292-  }
app/pages/index.vue-293-}
app/pages/index.vue-294-
app/pages/index.vue:295:.hero__pulse-dot {
app/pages/index.vue-296-  width: 8px;
app/pages/index.vue-297-  height: 8px;
app/pages/index.vue-298-  border-radius: var(--radius-circle);
app/pages/index.vue-299-  background: var(--term-green);
--
app/pages/index.vue-465-}
app/pages/index.vue-466-
app/pages/index.vue-467-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
app/pages/index.vue-468-@media (width <= 900px) {
app/pages/index.vue:469:  .hero__grid {
app/pages/index.vue-470-    grid-template-columns: 1fr;
app/pages/index.vue-471-  }
app/pages/index.vue-472-
app/pages/index.vue:473:  .hero__title {
app/pages/index.vue-474-    font-size: var(--fs-4xl);
app/pages/index.vue-475-  }
app/pages/index.vue-476-
app/pages/index.vue-477-  .grid-3,
--
app/pages/index.vue-479-    grid-template-columns: 1fr;
app/pages/index.vue-480-  }
app/pages/index.vue-481-}
app/pages/index.vue-482-
app/pages/index.vue:483:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue-484-  .anim {
app/pages/index.vue-485-    animation: none;
app/pages/index.vue-486-  }
app/pages/index.vue-487-}

exec
/bin/zsh -lc 'git status --short --branch && git log -1 --oneline' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
## feat/home-awwwards
 M app/pages/index.vue
 M docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
 M docs/implementation-artifacts/sprint-status.yaml
?? app/components/home/HomeBootOverlay.vue
?? app/components/home/HomeHeroTerminal.vue
?? docs/implementation-artifacts/code-reviews/11-2/
a2439d6 docs(story): créer la story 11.2 (séquence de boot & hero commercial)

exec
/bin/zsh -lc "nl -ba app/assets/scss/abstract/_root.scss | sed -n '185,225p'; nl -ba app/assets/scss/base/_motion.scss | sed -n '1,60p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   185	
   186	  // Glows focaux
   187	  --glow-accent: 0 0 0 1px hsl(24deg 94% 53% / 40%), 0 8px 30px hsl(24deg 94% 53% / 22%);
   188	  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);
   189	
   190	  // Anneau de focus
   191	  --ring-accent: 0 0 0 3px var(--accent-ring);
   192	
   193	  // ============================================================
   194	  //  Motion — easings sobres et mécaniques (esprit terminal)
   195	  // ============================================================
   196	  --dur-fast: 120ms;
   197	  --dur-base: 180ms;
   198	  --dur-slow: 320ms;
   199	  --dur-slower: 600ms;
   200	  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
   201	  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
   202	  --ease-standard: ease-in-out;
   203	}
   204	
   205	::selection {
   206	  background: var(--selection);
   207	}
   208	
   209	// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
   210	@keyframes caret-blink {
   211	  0%,
   212	  49% {
   213	    opacity: 1;
   214	  }
   215	
   216	  50%,
   217	  100% {
   218	    opacity: 0;
   219	  }
   220	}
   221	
   222	@keyframes fade-rise {
   223	  from {
   224	    opacity: 0;
   225	    transform: translateY(8px);
     1	// ============================================================
     2	//  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
     3	// ============================================================
     4	// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
     5	// les animations d'entrée et les transitions non essentielles sont ramenées à
     6	// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
     7	// restent en place et cohérentes ; cette règle couvre le reste (ZButton, etc.)
     8	// et tout ajout futur, sans avoir à y penser au cas par cas.
     9	//
    10	// EXCEPTION (DS / CAP-11) — le caret du terminal est la SEULE boucle autorisée :
    11	//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
    12	//    piloté par CSS → intact ici ;
    13	//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
    14	//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
    15	//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
    16	//
    17	// DÉROGATION « valeurs en dur » (règle SCSS projet) — les durées `0.01ms` / `0ms`
    18	// ci-dessous sont volontairement littérales : c'est la recette a11y standard de
    19	// neutralisation du mouvement (quasi-instantané, sans casser les callbacks
    20	// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
    21	// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
    22	
    23	/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
    24	@media (prefers-reduced-motion: reduce) {
    25	  *,
    26	  *::before,
    27	  *::after {
    28	    animation-duration: 0.01ms !important;
    29	    animation-iteration-count: 1 !important;
    30	    transition-duration: 0.01ms !important;
    31	    transition-delay: 0ms !important;
    32	    scroll-behavior: auto !important;
    33	  }
    34	
    35	  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
    36	  .prm__caret {
    37	    animation: none !important;
    38	  }
    39	}
    40	/* stylelint-enable declaration-no-important, selector-class-pattern */

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md | sed -n '1,90p'; nl -ba docs/planning-artifacts/epics.md | sed -n '724,750p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	---
     2	baseline_commit: 5f72e8c14627deb82e7d7c8f8f7f2227b00bd0d4
     3	---
     4	
     5	# Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
     6	
     7	Status: review
     8	
     9	<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    10	
    11	## Story
    12	
    13	As a prospect technique ou client potentiel visitant la page d'accueil,
    14	I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
    15	so that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20, CAP-2, CAP-3).
    16	
    17	## Acceptance Criteria
    18	
    19	1. **Given** un visiteur arrivant sur la page d'accueil
    20	   **When** la page se charge pour la première fois de la session
    21	   **Then** l'overlay de boot (`HomeBootOverlay.vue`, simulant `jouan.os`) s'affiche au premier plan (`z-index: 200`), déroule la montée en charge système (`initialisation du noyau…`, `montage de /dev/portfolio`, `chargement des polices Ubuntu Mono`, `compilation des projets [ok]`, `démarrage du serveur [ok]`) avec jauge de progression
    22	   **And** l'overlay s'efface automatiquement (transition d'opacité vers disparition) après 1.0s à 1.5s
    23	   **And** un clic n'importe où sur l'overlay ou la pression sur la touche `Escape` court-circuite immédiatement l'animation (`finishBoot`)
    24	   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
    25	   **And** sous `@media (prefers-reduced-motion: reduce)`, la séquence de boot est immédiatement court-circuitée sans animation ni délai.
    26	
    27	2. **Given** la fin de la séquence de boot (ou son contournement immédiat)
    28	   **When** le hero s'affiche
    29	   **Then** le composant terminal hero (`HomeHeroTerminal.vue`) déclenche sa simulation de frappe séquentielle progressive (effet machine à écrire) :
    30	     - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
    31	     - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
    32	     - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
    33	   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
    34	   **And** sous `@media (prefers-reduced-motion: reduce)`, les lignes du terminal hero s'affichent instantanément en texte statique complet sans animation de frappe, le caret restant figé visible.
    35	
    36	3. **Given** la colonne gauche du Hero commercial sur `app/pages/index.vue`
    37	   **When** le visiteur visualise la zone d'accroche principale
    38	   **Then** la hiérarchie de contenu affiche en typographie Ubuntu :
    39	     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
    40	     - Titre principal `<h1>` : `Développeur Full Stack TypeScript`
    41	     - Sous-titre descriptif : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
    42	     - Badge de statut de disponibilité : puce pulsée (`--success`), texte `Disponible pour missions freelance · Profil Malt vérifié`, encapsulant un lien accessible vers Malt via `<ZExternalLink :href="SITE.profile.maltUrl">`
    43	     - Groupe de CTAs d'action :
    44	       - CTA primaire : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Discuter de votre projet<template #iconRight><ZIcon name="arrow" /></template></ZButton>`
    45	       - CTA secondaire : `<ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg">Voir le parcours &amp; CV</ZButton>`
    46	   **And** les anciens tags WordPress/PHP (`php`, `symfony`, `wordpress`) et l'ancienne accroche (« Du code sur-mesure, de l'IA utile ») sont définitivement retirés du Hero.
    47	
    48	4. **Given** l'ensemble des intégrations de la story
    49	   **When** on exécute la gate de validation Docker
    50	   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.
    51	
    52	## Tasks / Subtasks
    53	
    54	- [x] Tâche 1 — Création du composant de démarrage `app/components/home/HomeBootOverlay.vue` (AC: 1)
    55	  - [x] Définir la structure HTML/template (`.boot`, `.boot__in`, `.boot__logo` avec nom `jouan.os`, `.boot__line`, `.boot__bar` avec barre `<i>`, `.boot__skip`).
    56	  - [x] Implémenter les étapes de boot textuelles (`bootSteps`) et la barre de progression linéaire.
    57	  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
    58	  - [x] Permettre l'interruption immédiate au clic ou via la touche `Escape` (avec écouteur nettoyé dans `onUnmounted()`).
    59	  - [x] Supporter `prefers-reduced-motion: reduce` en zappant instantanément la séquence (`finishBoot()`).
    60	  - [x] Émettre l'événement `@boot-complete` vers le composant parent pour synchroniser le démarrage du terminal hero.
    61	  - [x] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).
    62	
    63	- [x] Tâche 2 — Création du composant terminal hero `app/components/home/HomeHeroTerminal.vue` (AC: 2)
    64	  - [x] Extraire et modulariser la fenêtre terminal décorative du hero dans `app/components/home/HomeHeroTerminal.vue`.
    65	  - [x] Implémenter la séquence de frappe séquentielle progressive (effet machine à écrire) pour les commandes `$ whoami`, `$ cat focus.txt` et `$ ls ~/projets` alignées sur le positionnement Full Stack TS.
    66	  - [x] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
    67	  - [x] Assurer la neutralisation sous `prefers-reduced-motion: reduce` : contenu affiché immédiatement dans son état final, caret figé visible.
    68	  - [x] Styliser avec les variables de Design System (`--bg-terminal`, `--font-mono`, `--term-red`, `--term-yellow`, `--term-green`, `--term-blue`, etc.).
    69	
    70	- [x] Tâche 3 — Refonte commerciale de la colonne gauche du Hero sur `app/pages/index.vue` (AC: 3)
    71	  - [x] Mettre à jour l'eyebrow : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`.
    72	  - [x] Mettre à jour le titre `h1` : `Développeur Full Stack TypeScript`.
    73	  - [x] Remplacer le sous-titre par le pitch commercial ciblé Nuxt / NestJS / PostgreSQL.
    74	  - [x] Intégrer le badge de disponibilité avec puce pulsée et lien `<ZExternalLink :href="SITE.profile.maltUrl">Profil Malt vérifié</ZExternalLink>`.
    75	  - [x] Adapter les boutons d'appel à l'action : bouton principal vers `/contact` (« Discuter de votre projet ») et secondaire vers `/about` (« Voir le parcours & CV »).
    76	  - [x] Supprimer la liste de tags legacy (`tags = ["php", "symfony", "wordpress", ...]`) du template hero.
    77	  - [x] Intégrer `<HomeBootOverlay @boot-complete="onBootComplete" />` et `<HomeHeroTerminal :auto-start="isBootFinished" />`.
    78	
    79	- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
    80	  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
    81	  - [x] Vérifier la conformité de rendu et l'absence de régression d'hydratation (SSR/SSG Nitro).
    82	  - [x] Vérifier le comportement d'accessibilité au clavier (`Tab`, `Escape`) et sous contraste forcé.
    83	
    84	## Dev Notes
    85	
    86	### Architecture & Contraintes d'environnement
    87	- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
    88	- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
    89	- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
    90	- **Accessibilité (a11y) :**
   724	### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
   725	
   726	As a prospect technique ou client potentiel,
   727	I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
   728	So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).
   729	
   730	**Acceptance Criteria:**
   731	
   732	**Given** la page d'accueil avec son atmosphère en place
   733	**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
   734	**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
   735	**And** le Hero commercial affiche en typographie Ubuntu :
   736	  - Sur-titre `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
   737	  - Titre principal `Développeur Full Stack TypeScript`
   738	  - Sous-titre orienté création et évolution d'applications web et SaaS (Nuxt, NestJS, PostgreSQL)
   739	  - Badge de statut de disponibilité vérifié avec puce pulsée et lien externe vers le profil Malt (`<ZExternalLink>`)
   740	  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
   741	**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
   742	
   743	### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés
   744	
   745	As a visiteur explorant la page d'accueil,
   746	I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
   747	So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).
   748	
   749	**Acceptance Criteria:**
   750	

exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '1,190p'; nl -ba app/pages/index.vue | sed -n '190,500p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="home">
     3	    <HomeBootOverlay @boot-complete="onBootComplete" />
     4	    <HomeAtmosComponent />
     5	    <ZCustomCursor />
     6	
     7	    <section class="hero hero__grad">
     8	      <div class="hero__in container">
     9	        <div class="hero__grid">
    10	          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
    11	          <div class="anim hero__text">
    12	            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
    13	            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
    14	            <p class="hero__sub">
    15	              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
    16	              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
    17	            </p>
    18	
    19	            <div class="hero__badge-wrap">
    20	              <span class="hero__pulse-dot" aria-hidden="true" />
    21	              <span>Disponible pour missions freelance · </span>
    22	              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
    23	                Profil Malt vérifié
    24	              </ZExternalLink>
    25	            </div>
    26	
    27	            <div class="hero__cta">
    28	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    29	                Discuter de votre projet
    30	                <template #iconRight><ZIcon name="arrow" /></template>
    31	              </ZButton>
    32	              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
    33	            </div>
    34	          </div>
    35	
    36	          <!-- Colonne droite : terminal hero cinétique -->
    37	          <div class="anim hero__term-col">
    38	            <HomeHeroTerminal :auto-start="isBootFinished" />
    39	          </div>
    40	        </div>
    41	      </div>
    42	    </section>
    43	
    44	    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    45	    <section class="section">
    46	      <div class="container">
    47	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
    48	        <h2 class="section__title">Trois façons de travailler ensemble</h2>
    49	        <ul class="grid-3">
    50	          <li v-for="service in services" :key="service.id">
    51	            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
    52	              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    53	              <h3 class="offer__title">{{ service.title }}</h3>
    54	              <p class="offer__desc">{{ service.desc }}</p>
    55	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    56	                En savoir plus →
    57	              </NuxtLink>
    58	            </ZCard>
    59	          </li>
    60	        </ul>
    61	      </div>
    62	    </section>
    63	
    64	    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    65	    <section class="section section--sunken">
    66	      <div class="container">
    67	        <div class="statrow">
    68	          <div v-for="stat in stats" :key="stat.id" class="stat">
    69	            <b>{{ stat.value }}</b>
    70	            <span>{{ stat.label }}</span>
    71	          </div>
    72	        </div>
    73	
    74	        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
    75	        <ul class="grid-2 projects">
    76	          <li v-for="project in projects" :key="project.name">
    77	            <ZCard
    78	              class="project"
    79	              :interactive="Boolean(project.url)"
    80	              :data-hot="Boolean(project.url) ? '' : undefined"
    81	              :as="project.url ? ZExternalLink : 'div'"
    82	              :href="project.url || undefined"
    83	              :rel="project.url ? 'noopener noreferrer' : undefined"
    84	            >
    85	              <div class="project__head">
    86	                <h3 class="project__name">{{ project.name }}</h3>
    87	                <span class="project__role">{{ project.role }}</span>
    88	              </div>
    89	              <p class="prose project__desc">{{ project.desc }}</p>
    90	              <ul class="hero__tags">
    91	                <li v-for="tag in project.tags" :key="tag">
    92	                  <ZTag>{{ tag }}</ZTag>
    93	                </li>
    94	              </ul>
    95	            </ZCard>
    96	          </li>
    97	        </ul>
    98	      </div>
    99	    </section>
   100	  </main>
   101	</template>
   102	
   103	<script setup lang="ts">
   104	// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
   105	// Architecture multi-pages Nuxt 4, dark-first, accent orange.
   106	import { ref } from "vue";
   107	import { NuxtLink, ZExternalLink } from "#components";
   108	import { SITE } from "~/data/site";
   109	
   110	const isBootFinished = ref(false);
   111	
   112	function onBootComplete() {
   113	  isBootFinished.value = true;
   114	}
   115	
   116	// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   117	// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   118	// `id` = clé v-for stable (indépendante du contenu affiché).
   119	const services = [
   120	  {
   121	    id: "wordpress",
   122	    icon: "wp",
   123	    title: "WordPress sur-mesure",
   124	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   125	    featured: false,
   126	  },
   127	  {
   128	    id: "apps",
   129	    icon: "code",
   130	    title: "Applications web",
   131	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   132	    featured: true,
   133	  },
   134	  {
   135	    id: "ia",
   136	    icon: "spark",
   137	    title: "IA & automatisation",
   138	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   139	    featured: false,
   140	  },
   141	];
   142	
   143	// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   144	const stats = [
   145	  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   146	  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   147	  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   148	];
   149	
   150	// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   151	const projects = SITE.projects;
   152	
   153	const siteUrl = useSiteUrl();
   154	const homeJsonLd = [
   155	  {
   156	    "@context": "https://schema.org",
   157	    "@type": "WebSite",
   158	    name: "Simon Jouan — Développeur Full Stack TypeScript",
   159	    url: siteUrl,
   160	    description: SITE.profile.role,
   161	  },
   162	  {
   163	    "@context": "https://schema.org",
   164	    "@type": "Person",
   165	    name: SITE.profile.name,
   166	    jobTitle: SITE.profile.role,
   167	    url: siteUrl,
   168	    image: `${siteUrl}/images/portrait.jpeg`,
   169	    email: SITE.profile.email,
   170	    address: {
   171	      "@type": "PostalAddress",
   172	      addressLocality: SITE.profile.city,
   173	      addressCountry: "FR",
   174	    },
   175	  },
   176	];
   177	
   178	usePageSeo({
   179	  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   180	  description:
   181	    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   182	  path: "/",
   183	  image: "/images/portrait.jpeg",
   184	  type: "website",
   185	  jsonLd: homeJsonLd,
   186	});
   187	</script>
   188	
   189	<style lang="scss" scoped>
   190	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   190	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   191	.home {
   192	  display: block;
   193	}
   194	
   195	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   196	.anim {
   197	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   198	}
   199	
   200	.hero__term-col {
   201	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
   202	  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
   203	  animation-delay: 80ms;
   204	}
   205	
   206	// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
   207	.hero {
   208	  position: relative;
   209	  overflow: hidden;
   210	}
   211	
   212	.hero__grad {
   213	  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
   214	  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
   215	  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
   216	  background:
   217	    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
   218	    radial-gradient(
   219	      700px 500px at 0% 110%,
   220	      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
   221	      transparent 60%
   222	    ),
   223	    var(--bg-page);
   224	}
   225	
   226	.hero__in {
   227	  position: relative;
   228	  z-index: 1;
   229	
   230	  // padding-block uniquement : le gutter horizontal vient de .container
   231	  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
   232	  padding-block: var(--space-20);
   233	}
   234	
   235	.hero__grid {
   236	  display: grid;
   237	  grid-template-columns: 1.05fr 0.95fr;
   238	  gap: var(--space-12);
   239	  align-items: center;
   240	}
   241	
   242	// .section / .container / .eyebrow / .prose : primitives de layout globales
   243	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   244	
   245	// ---- Colonne texte ----
   246	.hero__title {
   247	  font-family: var(--font-mono);
   248	  font-size: var(--fs-6xl);
   249	  font-weight: var(--fw-light);
   250	  letter-spacing: var(--ls-tight);
   251	  color: var(--text-strong);
   252	
   253	  em {
   254	    font-style: normal;
   255	    color: var(--accent);
   256	  }
   257	}
   258	
   259	.hero__sub {
   260	  max-width: 46ch;
   261	  margin: var(--space-5) 0 var(--space-6);
   262	  font-family: var(--font-sans);
   263	  font-size: var(--fs-lg);
   264	  line-height: var(--lh-relaxed);
   265	  color: var(--text-body);
   266	}
   267	
   268	.hero__cta {
   269	  display: flex;
   270	  flex-wrap: wrap;
   271	  gap: var(--space-3);
   272	  margin-bottom: var(--space-6);
   273	}
   274	
   275	// ---- Badge de disponibilité & CTAs ----
   276	.hero__badge-wrap {
   277	  display: inline-flex;
   278	  align-items: center;
   279	  gap: var(--space-2);
   280	  margin-bottom: var(--space-6);
   281	  font-family: var(--font-mono);
   282	  font-size: var(--fs-sm);
   283	  color: var(--text-muted);
   284	
   285	  a {
   286	    color: var(--accent);
   287	    text-decoration: underline;
   288	
   289	    &:hover {
   290	      color: var(--accent-hover);
   291	    }
   292	  }
   293	}
   294	
   295	.hero__pulse-dot {
   296	  width: 8px;
   297	  height: 8px;
   298	  border-radius: var(--radius-circle);
   299	  background: var(--term-green);
   300	  box-shadow: 0 0 8px var(--term-green);
   301	}
   302	
   303	.section__title {
   304	  margin-bottom: var(--space-8);
   305	  font-family: var(--font-mono);
   306	  font-size: var(--fs-3xl);
   307	  font-weight: var(--fw-regular);
   308	  color: var(--text-strong);
   309	}
   310	
   311	// ---- Aperçu services (porté de .grid-3 / .offer*) ----
   312	.grid-3 {
   313	  display: grid;
   314	  grid-template-columns: repeat(3, 1fr);
   315	  gap: var(--space-5);
   316	  margin: 0;
   317	  padding: 0;
   318	  list-style: none;
   319	
   320	  > li {
   321	    display: flex;
   322	  }
   323	}
   324	
   325	.offer {
   326	  display: flex;
   327	  flex-direction: column;
   328	  width: 100%;
   329	}
   330	
   331	.offer__icon {
   332	  display: flex;
   333	  align-items: center;
   334	  justify-content: center;
   335	  width: var(--space-10); // 40px
   336	  height: var(--space-10);
   337	  margin-bottom: var(--space-4);
   338	
   339	  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   340	  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   341	  font-size: 22px;
   342	  color: var(--accent);
   343	  background: var(--accent-soft);
   344	  border-radius: var(--radius-md);
   345	}
   346	
   347	.offer__title {
   348	  margin-bottom: var(--space-2);
   349	  font-family: var(--font-mono);
   350	  font-size: var(--fs-xl);
   351	  font-weight: var(--fw-regular);
   352	  color: var(--text-strong);
   353	}
   354	
   355	.offer__desc {
   356	  margin: 0 0 var(--space-4);
   357	  font-family: var(--font-sans);
   358	  font-size: var(--fs-sm);
   359	  line-height: var(--lh-relaxed);
   360	  color: var(--text-body);
   361	}
   362	
   363	.offer__more {
   364	  margin-top: auto;
   365	  font-family: var(--font-mono);
   366	  font-size: var(--fs-sm);
   367	  color: var(--accent);
   368	  text-decoration: none;
   369	
   370	  &:hover {
   371	    text-decoration: underline;
   372	  }
   373	
   374	  &:focus-visible {
   375	    // Outline transparent : rendu en couleur système sous forced-colors.
   376	    outline: 2px solid transparent;
   377	    outline-offset: 2px;
   378	    box-shadow: var(--ring-accent);
   379	    border-radius: var(--radius-xs);
   380	  }
   381	}
   382	
   383	// ---- Stats (porté de .statrow / .stat) ----
   384	.statrow {
   385	  display: flex;
   386	  flex-wrap: wrap;
   387	  gap: var(--space-12);
   388	
   389	  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
   390	  margin-bottom: var(--space-12);
   391	}
   392	
   393	.stat {
   394	  font-family: var(--font-mono);
   395	
   396	  b {
   397	    display: block;
   398	    font-size: var(--fs-4xl);
   399	    font-weight: var(--fw-light);
   400	    color: var(--text-strong);
   401	  }
   402	
   403	  span {
   404	    font-size: var(--fs-sm);
   405	    color: var(--text-muted);
   406	  }
   407	}
   408	
   409	// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
   410	.grid-2 {
   411	  display: grid;
   412	  grid-template-columns: 1fr 1fr;
   413	  gap: var(--space-6);
   414	  margin: 0;
   415	  padding: 0;
   416	  list-style: none;
   417	
   418	  > li {
   419	    display: flex;
   420	  }
   421	}
   422	
   423	.projects {
   424	  margin-top: var(--space-5);
   425	}
   426	
   427	// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
   428	// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
   429	.project {
   430	  display: flex;
   431	  flex-direction: column;
   432	  width: 100%;
   433	  text-decoration: none;
   434	
   435	  .hero__tags {
   436	    margin-top: auto;
   437	  }
   438	}
   439	
   440	.project__head {
   441	  display: flex;
   442	  align-items: baseline;
   443	  justify-content: space-between;
   444	  gap: var(--space-3);
   445	}
   446	
   447	.project__name {
   448	  margin: 0;
   449	  font-family: var(--font-mono);
   450	  font-size: var(--fs-xl);
   451	  font-weight: var(--fw-regular);
   452	  color: var(--text-strong);
   453	}
   454	
   455	.project__role {
   456	  font-family: var(--font-mono);
   457	  font-size: var(--fs-xs);
   458	  color: var(--text-muted);
   459	  white-space: nowrap;
   460	}
   461	
   462	.project__desc {
   463	  margin: var(--space-3) 0 var(--space-4);
   464	  font-size: var(--fs-sm);
   465	}
   466	
   467	// ---- Responsive (cf. kit.css @media max-width: 900px) ----
   468	@media (width <= 900px) {
   469	  .hero__grid {
   470	    grid-template-columns: 1fr;
   471	  }
   472	
   473	  .hero__title {
   474	    font-size: var(--fs-4xl);
   475	  }
   476	
   477	  .grid-3,
   478	  .grid-2 {
   479	    grid-template-columns: 1fr;
   480	  }
   481	}
   482	
   483	@media (prefers-reduced-motion: reduce) {
   484	  .anim {
   485	    animation: none;
   486	  }
   487	}
   488	</style>

exec
/bin/zsh -lc "rg -n -C 8 'z-index' app/components/ui/ZCustomCursor.vue app/components | head -160" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/ui/ZCustomCursor.vue-139-
app/components/ui/ZCustomCursor.vue-140-<style lang="scss" scoped>
app/components/ui/ZCustomCursor.vue-141-/* stylelint-disable selector-class-pattern */
app/components/ui/ZCustomCursor.vue-142-.cursor-dot,
app/components/ui/ZCustomCursor.vue-143-.cursor-ring {
app/components/ui/ZCustomCursor.vue-144-  position: fixed;
app/components/ui/ZCustomCursor.vue-145-  top: 0;
app/components/ui/ZCustomCursor.vue-146-  left: 0;
app/components/ui/ZCustomCursor.vue:147:  z-index: 90;
app/components/ui/ZCustomCursor.vue-148-  border-radius: var(--radius-circle);
app/components/ui/ZCustomCursor.vue-149-  mix-blend-mode: difference;
app/components/ui/ZCustomCursor.vue-150-  opacity: 0;
app/components/ui/ZCustomCursor.vue-151-  pointer-events: none;
app/components/ui/ZCustomCursor.vue-152-  transition: opacity var(--dur-base) var(--ease-standard);
app/components/ui/ZCustomCursor.vue-153-
app/components/ui/ZCustomCursor.vue-154-  &.is-visible {
app/components/ui/ZCustomCursor.vue-155-    opacity: 1;
--
app/components/HeaderComponent.vue-184-});
app/components/HeaderComponent.vue-185-</script>
app/components/HeaderComponent.vue-186-
app/components/HeaderComponent.vue-187-<style lang="scss" scoped>
app/components/HeaderComponent.vue-188-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
app/components/HeaderComponent.vue-189-.hdr {
app/components/HeaderComponent.vue-190-  position: sticky;
app/components/HeaderComponent.vue-191-  top: 0;
app/components/HeaderComponent.vue:192:  z-index: 50;
app/components/HeaderComponent.vue-193-  height: var(--header-height);
app/components/HeaderComponent.vue-194-
app/components/HeaderComponent.vue-195-  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
app/components/HeaderComponent.vue-196-  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
app/components/HeaderComponent.vue-197-  border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue-198-
app/components/HeaderComponent.vue-199-  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
app/components/HeaderComponent.vue-200-  -webkit-backdrop-filter: blur(10px);
--
app/components/HeaderComponent.vue-306-    outline-offset: 2px;
app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-308-  }
app/components/HeaderComponent.vue-309-}
app/components/HeaderComponent.vue-310-
app/components/HeaderComponent.vue-311-.hdr__overlay {
app/components/HeaderComponent.vue-312-  position: fixed;
app/components/HeaderComponent.vue-313-  inset: var(--header-height) 0 0;
app/components/HeaderComponent.vue:314:  z-index: 40;
app/components/HeaderComponent.vue-315-  background: var(--overlay);
app/components/HeaderComponent.vue-316-}
app/components/HeaderComponent.vue-317-
app/components/HeaderComponent.vue-318-.hdr__menu {
app/components/HeaderComponent.vue-319-  display: none;
app/components/HeaderComponent.vue-320-}
app/components/HeaderComponent.vue-321-
app/components/HeaderComponent.vue-322-// ---- Dégradé progressif (tablette) pour éviter l'overflow du header
--
app/components/HeaderComponent.vue-351-
app/components/HeaderComponent.vue-352-  .hdr__burger {
app/components/HeaderComponent.vue-353-    display: inline-flex;
app/components/HeaderComponent.vue-354-  }
app/components/HeaderComponent.vue-355-
app/components/HeaderComponent.vue-356-  .hdr__menu {
app/components/HeaderComponent.vue-357-    position: fixed;
app/components/HeaderComponent.vue-358-    inset: var(--header-height) 0 auto 0;
app/components/HeaderComponent.vue:359:    z-index: 45;
app/components/HeaderComponent.vue-360-    display: flex;
app/components/HeaderComponent.vue-361-    flex-direction: column;
app/components/HeaderComponent.vue-362-    gap: var(--space-1);
app/components/HeaderComponent.vue-363-    padding: var(--space-4) var(--space-6) var(--space-6);
app/components/HeaderComponent.vue-364-    background: var(--surface-1);
app/components/HeaderComponent.vue-365-    border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue-366-    box-shadow: var(--shadow-3);
app/components/HeaderComponent.vue-367-    transform: translateY(-8px);
--
app/components/terminal/TerminalComponent.vue-325-  // son backdrop-filter rende hors du <header> filtré) ; fixed le garde relatif au VIEWPORT,
app/components/terminal/TerminalComponent.vue-326-  // cohérent avec le clamp du drag (window.innerWidth/innerHeight) et évite une fenêtre
app/components/terminal/TerminalComponent.vue-327-  // hors-écran ou un saut de scroll au focus quand la page est défilée.
app/components/terminal/TerminalComponent.vue-328-  // Dimensions/pastilles (px) = structurelles (DS), portées telles quelles.
app/components/terminal/TerminalComponent.vue-329-  box-sizing: border-box;
app/components/terminal/TerminalComponent.vue-330-  position: fixed;
app/components/terminal/TerminalComponent.vue-331-  top: 60px;
app/components/terminal/TerminalComponent.vue-332-  left: 15px;
app/components/terminal/TerminalComponent.vue:333:  z-index: 1000;
app/components/terminal/TerminalComponent.vue-334-  width: 600px;
app/components/terminal/TerminalComponent.vue-335-  height: 400px;
app/components/terminal/TerminalComponent.vue-336-  overflow: hidden;
app/components/terminal/TerminalComponent.vue-337-  resize: both;
app/components/terminal/TerminalComponent.vue-338-  font-family: var(--font-mono);
app/components/terminal/TerminalComponent.vue-339-  color: var(--ink-1);
app/components/terminal/TerminalComponent.vue-340-  border: 1px solid var(--border-terminal);
app/components/terminal/TerminalComponent.vue-341-  border-radius: var(--radius-sm);
app/components/terminal/TerminalComponent.vue-342-  box-shadow: var(--glow-terminal);
app/components/terminal/TerminalComponent.vue-343-
app/components/terminal/TerminalComponent.vue-344-  &-header {
app/components/terminal/TerminalComponent.vue-345-    position: relative;
app/components/terminal/TerminalComponent.vue:346:    z-index: 1;
app/components/terminal/TerminalComponent.vue-347-    display: flex;
app/components/terminal/TerminalComponent.vue-348-    flex-wrap: nowrap;
app/components/terminal/TerminalComponent.vue-349-    align-items: center;
app/components/terminal/TerminalComponent.vue-350-    gap: var(--space-2);
app/components/terminal/TerminalComponent.vue-351-    height: 30px;
app/components/terminal/TerminalComponent.vue-352-    padding: 0 var(--space-3);
app/components/terminal/TerminalComponent.vue-353-    background: var(--aubergine-black);
app/components/terminal/TerminalComponent.vue-354-    cursor: move;
--
app/components/WindowWrapperComponent.vue-286-  }
app/components/WindowWrapperComponent.vue-287-
app/components/WindowWrapperComponent.vue-288-  width: 100%;
app/components/WindowWrapperComponent.vue-289-  color: var(--wwc-color-text);
app/components/WindowWrapperComponent.vue-290-  font-size: 1rem;
app/components/WindowWrapperComponent.vue-291-  border-radius: 5px;
app/components/WindowWrapperComponent.vue-292-  position: relative;
app/components/WindowWrapperComponent.vue-293-  overflow: hidden;
app/components/WindowWrapperComponent.vue:294:  z-index: 100;
app/components/WindowWrapperComponent.vue-295-  box-shadow: #{_boxShadow.$box-shadow-2};
app/components/WindowWrapperComponent.vue-296-
app/components/WindowWrapperComponent.vue-297-  @media (min-width: _function.breakpoint("lg")) {
app/components/WindowWrapperComponent.vue-298-    width: auto;
app/components/WindowWrapperComponent.vue-299-    position: absolute;
app/components/WindowWrapperComponent.vue-300-  }
app/components/WindowWrapperComponent.vue-301-
app/components/WindowWrapperComponent.vue-302-  &-header {
app/components/WindowWrapperComponent.vue:303:    z-index: 1;
app/components/WindowWrapperComponent.vue-304-    height: var(--wh-height);
app/components/WindowWrapperComponent.vue-305-    padding: 0.25rem;
app/components/WindowWrapperComponent.vue-306-    border-top-left-radius: 0.25rem;
app/components/WindowWrapperComponent.vue-307-    border-top-right-radius: 0.25rem;
app/components/WindowWrapperComponent.vue-308-    text-align: center;
app/components/WindowWrapperComponent.vue-309-    background-color: var(--wwc-color-grey-dark);
app/components/WindowWrapperComponent.vue-310-    position: absolute;
app/components/WindowWrapperComponent.vue-311-    width: 100%;
--
app/components/home/HomeAtmosComponent.vue-14-// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue-15-</script>
app/components/home/HomeAtmosComponent.vue-16-
app/components/home/HomeAtmosComponent.vue-17-<style lang="scss" scoped>
app/components/home/HomeAtmosComponent.vue-18-/* stylelint-disable selector-class-pattern */
app/components/home/HomeAtmosComponent.vue-19-.atmos {
app/components/home/HomeAtmosComponent.vue-20-  position: fixed;
app/components/home/HomeAtmosComponent.vue-21-  inset: 0;
app/components/home/HomeAtmosComponent.vue:22:  z-index: 0;
app/components/home/HomeAtmosComponent.vue-23-  overflow: hidden;
app/components/home/HomeAtmosComponent.vue-24-  pointer-events: none;
app/components/home/HomeAtmosComponent.vue-25-}
app/components/home/HomeAtmosComponent.vue-26-
app/components/home/HomeAtmosComponent.vue-27-.aurora {
app/components/home/HomeAtmosComponent.vue-28-  position: absolute;
app/components/home/HomeAtmosComponent.vue-29-  border-radius: var(--radius-circle);
app/components/home/HomeAtmosComponent.vue-30-  filter: blur(80px);
--
app/components/home/HomeBootOverlay.vue-145-});
app/components/home/HomeBootOverlay.vue-146-</script>
app/components/home/HomeBootOverlay.vue-147-
app/components/home/HomeBootOverlay.vue-148-<style lang="scss" scoped>
app/components/home/HomeBootOverlay.vue-149-/* stylelint-disable selector-class-pattern */
app/components/home/HomeBootOverlay.vue-150-.boot {
app/components/home/HomeBootOverlay.vue-151-  position: fixed;
app/components/home/HomeBootOverlay.vue-152-  inset: 0;
app/components/home/HomeBootOverlay.vue:153:  z-index: 200;
app/components/home/HomeBootOverlay.vue-154-  display: flex;
app/components/home/HomeBootOverlay.vue-155-  align-items: center;
app/components/home/HomeBootOverlay.vue-156-  justify-content: center;

exec
/bin/zsh -lc "rg -n -C 5 'HomeBootOverlay|BootOverlay|hero-term|hero__pulse' docs/specs/spec-home-awwwards/sections-mapping.md docs/design_system 'Home - Awwwards.html' 2>/dev/null | head -240" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "rg -n 'maltUrl|role:|city:|projects:' app/data/site.ts && sed -n '1,240p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 succeeded in 0ms:
15:  role: string;
17:  city: string;
19:  maltUrl?: string;
24:  role: string;
33:  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
35:  city: "Rouen, France",
37:  maltUrl: "https://www.malt.fr/profile/simonjouan",
56:const projects: IProject[] = [
59:    role: "Co-fondateur & Développeur Full Stack",
67:    role: "CTO & Développeur Full Stack",
74:    role: "Créateur & Ingénieur IA",
// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
// les composants/programmes ne font que les présenter). Forme portée de
// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
//
// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
//
// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
// `deferred-work.md`, pas un simple refactor.

export interface IProfile {
  name: string;
  role: string;
  email: string;
  city: string;
  available: boolean;
  maltUrl?: string;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url?: string;
  status?: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
  email: "simon@jouan.ovh",
  city: "Rouen, France",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "nuxt",
  "vue",
  "nest.js",
  "node.js",
  "postgresql",
  "typeorm",
  "stripe",
  "cypress",
  "docker",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "En production",
    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "Étude de cas (MVP livré)",
    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
  },
  {
    name: "Nodium",
    role: "Créateur & Ingénieur IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "R&D / En cours",
    tags: ["typescript", "electron", "agents", "ia"],
  },
];

export const SITE = { profile, skills, projects } as const;

exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZIcon.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n 'ZIcon' app/components/ui/ZIcon.vue docs/design_system | head -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
exec
/bin/zsh -lc "rg -n 'name=\"gem\"|gem:' app docs | head -40" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/HeaderComponent.vue:5:        <ZIcon name="gem" class="hdr__logo" />
app/components/FooterComponent.vue:7:            <ZIcon name="gem" class="ftr__logo" />
app/components/home/HomeBootOverlay.vue:12:        <ZIcon name="gem" class="boot__logo-icon" />
app/components/ui/ZIcon.vue:68:  gem: { box: "0 0 24 24", fill: true, body: GEM },
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:1612:             <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:2882:             <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4006:docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:4355:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:5927:     6	             <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-acceptance-auditor.md:6614:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:115:             <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-edge-case-hunter.json:741:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/full.diff:6:             <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:77:             <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-1/raw-blind-hunter.md:1226:            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4204:app/components/HeaderComponent.vue-5-        <ZIcon name="gem" class="hdr__logo" />
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/2-7-iconographie.md:35:  - [x] Disponible via `<ZIcon name="gem">` (dimensionnable en 24px). Le **swap du header** PNG→SVG est hors périmètre (châssis = story 2.8) ; le PNG blanc reste acceptable d'ici là (dark-first, un seul thème).
docs/implementation-artifacts/2-7-iconographie.md:116:- **Centralisation (Tâche 2)** : les glyphes sociaux sont désormais dans `ZIcon` (source unique). `LinkListComponent`/`HexagonLinkComponent` legacy **non modifiés** — leur refonte (et le swap du logo header PNG→`<ZIcon name="gem">`) relèvent de la story 2.8 (châssis). Périmètre 2.7 = fournir le système, pas câbler les consommateurs.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1341:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/10-6/raw-acceptance-auditor.md:2772:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/10-6/raw-acceptance-auditor.md:3328:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:1417:+        <ZIcon name="gem" class="boot__logo-icon" />
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md:2225:+        <ZIcon name="gem" class="boot__logo-icon" />
docs/implementation-artifacts/code-reviews/11-2/full.diff:18:+        <ZIcon name="gem" class="boot__logo-icon" />
docs/implementation-artifacts/code-reviews/10-6/raw-blind-hunter.md:3170:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/10-6/raw-blind-hunter.md:4117:./docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:2344:./docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:3557:./docs/implementation-artifacts/code-reviews/10-6/raw-blind-hunter.md:4117:./docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/code-reviews/10-7/raw-acceptance-auditor.md:4271:./docs/implementation-artifacts/code-reviews/10-7/raw-blind-hunter.md:1872:./docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/code-reviews/11-2/raw-edge-case-hunter.json:128:+        <ZIcon name="gem" class="boot__logo-icon" />
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:1652:     5	        <ZIcon name="gem" class="hdr__logo" />
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:1794:app/components/HeaderComponent.vue-5-        <ZIcon name="gem" class="hdr__logo" />
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:490:     7	            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:723:docs/implementation-artifacts/2-7-iconographie.md:116:- **Centralisation (Tâche 2)** : les glyphes sociaux sont désormais dans `ZIcon` (source unique). `LinkListComponent`/`HexagonLinkComponent` legacy **non modifiés** — leur refonte (et le swap du logo header PNG→`<ZIcon name="gem">`) relèvent de la story 2.8 (châssis). Périmètre 2.7 = fournir le système, pas câbler les consommateurs.
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:1383:docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1251-app/components/HeaderComponent.vue-5-        <ZIcon name="gem" class="hdr__logo" />
docs/implementation-artifacts/code-reviews/10-7/raw-blind-hunter.md:1872:./docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/code-reviews/10-6/raw-edge-case-hunter.json:690:            <ZIcon name="gem" class="ftr__logo" />
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:94:+        <ZIcon name="gem" class="boot__logo-icon" />
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md:2282:        <ZIcon name="gem" class="hdr__logo" />

2026-09-13T18:10:42.309229Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "find docs/implementation-artifacts/code-reviews/11-2 -maxdepth 1 -type f -print | sort | sed -n '1,40p'; if [ -f docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md ]; then sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md; fi" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/code-reviews/11-2/full.diff
docs/implementation-artifacts/code-reviews/11-2/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-2/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-2/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/11-2/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/11-2/raw-edge-case-hunter.json
Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09bf4-2fde-7330-8c7a-799d44a7a7c7
--------
user
# Acceptance Auditor Prompt — Story 11.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.2), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise le skill de revue de code adversariale pour comparer systématiquement le diff aux critères d’acceptation, aux specs de contexte et aux invariants du dépôt. Je vais produire uniquement les écarts étayés par le diff.
  → Lire les instructions du skill de revue et les documents de référence
  • Inspecter le diff complet et relier chaque changement aux AC
  • Vérifier les contradictions, omissions et écarts d’intention
  • Rédiger la liste Markdown finale avec preuves précises
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc 'python3 /Users/simon/dev/jouan.ovh/_bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
{
  "workflow": {
    "activation_steps_prepend": [],
    "activation_steps_append": [],
    "persistent_facts": [
      "file:{project-root}/**/project-context.md"
    ],
    "on_complete": "",
    "review_layers": [
      {
        "id": "blind-hunter",
        "name": "Blind Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-adversarial-general` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "edge-case-hunter",
        "name": "Edge Case Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-edge-case-hunter` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "verification-gap",
        "name": "Verification Gap Reviewer",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-verification-gap` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "acceptance-auditor",
        "name": "Acceptance Auditor",
        "when": "Only when {review_mode} = \"full\".",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
      }
    ]
  }
}

exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
diff_output: '' # set at runtime
spec_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: "full" or "no-spec"
story_key: '' # set at runtime when discovered from sprint status
---

# Step 1: Gather Context

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The prompt that triggered this workflow IS the intent — not a hint.
- Do not modify any files. This step is read-only.

## INSTRUCTIONS

1. **Find the review target.** The conversation context before this skill was triggered IS your starting point — not a blank slate. Check in this order — stop as soon as the review target is identified:

   **Tier 1 — Explicit argument.**
   Did the user pass a PR, commit SHA, branch, spec file, or diff source this message?
   - PR reference → resolve to branch/commit via `gh pr view`. If resolution fails, ask for a SHA or branch.
   - Commit or branch → use directly.
   - Spec file → set `{spec_file}` to the provided path. Check its frontmatter for `baseline_commit`. If found, use as diff baseline. If not found, continue the cascade (a spec alone does not identify a diff source).
   - Also scan the argument for diff-mode keywords that narrow the scope:
     - "staged" / "staged changes" → Staged changes only
     - "uncommitted" / "working tree" / "all changes" → Uncommitted changes (staged + unstaged)
     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
     - "commit range" / "last N commits" / "<from-sha>..<to-sha>" → Specific commit range
     - "this diff" / "provided diff" / "paste" → User-provided diff (do not match bare "diff" — it appears in other modes)
   - When multiple keywords match, prefer the most specific (e.g., "branch diff" over bare "diff").

   **Tier 2 — Recent conversation.**
   Do the last few messages reveal what the user wants to be reviewed? Look for spec paths, commit refs, branches, PRs, or descriptions of a change. Apply the same diff-mode keyword scan and routing as Tier 1.

   **Tier 3 — Sprint tracking.**
   Look for a sprint status file (`*sprint-status*`) in `{implementation_artifacts}` or `{planning_artifacts}`. If found, scan for stories with status `review`:
   - **Exactly one `review` story:** Set `{story_key}` to the story's key (e.g., `1-2-user-auth`). Suggest it: "I found story <story-id> in `review` status. Would you like to review its changes? [Y] Yes / [N] No, let me choose". If confirmed, use the story context to determine the diff source (branch name derived from story slug, or uncommitted changes). If declined, clear `{story_key}` and fall through.
   - **Multiple `review` stories:** Present them as numbered options alongside a manual choice option. Wait for user selection. If a story is selected, set `{story_key}` and use its context to determine the diff source. If manual choice is selected, clear `{story_key}` and fall through.
   - **None:** Fall through.

   **Tier 4 — Current git state.**
   If version control is unavailable, skip to Tier 5. Otherwise, check the current branch and HEAD. If the branch is not `main` (or the default branch), confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, treat as a branch diff against `main`. If declined, fall through.

   **Tier 5 — Ask.**
   Fall through to instruction 2.

   Never ask extra questions beyond what the cascade prescribes. If a tier above already identified the target, skip the remaining tiers and proceed to instruction 3 (construct diff).

2. HALT. Ask the user: **What do you want to review?** Present these options:
   - **Uncommitted changes** (staged + unstaged)
   - **Staged changes only**
   - **Branch diff** vs a base branch (ask which base branch)
   - **Specific commit range** (ask for the range)
   - **Provided diff or file list** (user pastes or provides a path)

3. Construct `{diff_output}` from the chosen source.
   - For **staged changes only**: run `git diff --cached`.
   - For **uncommitted changes** (staged + unstaged): run `git diff HEAD`.
   - For **branch diff**: verify the base branch exists before running `git diff`. If it does not exist, HALT and ask the user for a valid branch.
   - For **commit range**: verify the range resolves. If it does not, HALT and ask the user for a valid range.
   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
   - After constructing `{diff_output}`, verify it is non-empty regardless of source type. If empty, HALT and tell the user there is nothing to review.

4. **Set the spec context.**
   - If `{spec_file}` is already set (from Tier 1 or Tier 2): verify the file exists and is readable, then set `{review_mode}` = `"full"`.
   - Otherwise, ask the user: **Is there a spec or story file that provides context for these changes?**
     - If yes: set `{spec_file}` to the path provided, verify the file exists and is readable, then set `{review_mode}` = `"full"`.
     - If no: set `{review_mode}` = `"no-spec"`.

5. If `{review_mode}` = `"full"` and the file at `{spec_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.

6. Sanity check: if `{diff_output}` exceeds approximately 3000 lines, warn the user and offer to chunk the review by file group.
   - If the user opts to chunk: agree on the first group, narrow `{diff_output}` accordingly, and list the remaining groups for the user to note for follow-up runs.
   - If the user declines: proceed as-is with the full diff.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `./step-02-review.md`

exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/implementation-artifacts/code-reviews/11-2/full.diff AGENTS.md && git diff --stat --no-index /dev/null docs/implementation-artifacts/code-reviews/11-2/full.diff || true' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     141 docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
     789 docs/planning-artifacts/epics.md
     282 docs/project-context.md

exec
/bin/zsh -lc "rg -n -C 12 'Boot|Hero|whoami|focus.txt|help|pulse|Malt|DÉVELOPPEUR FREELANCE' docs/specs/spec-home-awwwards/sections-mapping.md | head -260" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1-# Cartographie des sections & Adaptation Multi-pages
2-
3:Ce document détaille la transposition de la maquette source `Home - Awwwards.html` vers l'architecture applicative Nuxt 4 de `jouan.ovh`, en application directe de la direction stratégique (`direction_strategique_site.md`) et du profil Malt (`contexte_malt.md`).
4-
5----
6-
7-## 1. Principe directeur : Vitrine immersive vs Pages complètes
8-
9-La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
10-Dans `jouan.ovh`, la home refondue agit comme un **entonnoir de conversion commercial**, orientant les visiteurs vers les pages complètes du site :
11-
12:| Section Maquette Awwwards | Rôle sur la Home refondue | Contenu aligné Malt / Direction Stratégique | Destination / Route cible |
13-| :--- | :--- | :--- | :--- |
14-| **Navigation Header** | Menu de navigation du site | Liens directs vers les pages applicatives Nuxt. | Liens Nuxt vers `/services`, `/about`, `/blog`, `/contact`. |
15:| **Hero & Terminal** | Positionnement commercial immédiat | « Développeur Full Stack TypeScript — Nuxt / NestJS » + pitch création/évolution SaaS + badge Malt. | CTA primaire vers `/contact` (« Discuter de votre projet »), secondaire vers `/about`, lien externe vers profil Malt. |
16-| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
17-| **Services (3 cartes)** | Présentation des 3 offres ciblées | 1. Création d'apps web & SaaS<br>2. Dév Full Stack TypeScript<br>3. Évolution & architecture applicative | Cartes cliquables avec renvoi vers `/services` (où se trouve le déroulé du process en 4 étapes). |
18-| **Projets sélectionnés** | Preuves concrètes de réalisations SaaS | 1. **Keova** (SaaS ERP équestre Nuxt 4/NestJS/PostgreSQL/Stripe)<br>2. **TryOn** (SaaS IA générative Nuxt/NestJS/Python/ComfyUI)<br>3. **Nodium** (Lab d'agents IA desktop) | Liens externes vers les projets via `<ZExternalLink>`, renvoi vers `/about` pour le parcours complet (Kidizz, CINS). |
19-| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
20-| **Journal (Blog)** | Vitrine d'ingénierie logicielle | Les 3 derniers articles techniques du blog. | Lien global « Voir tous les articles » menant vers `/blog`. |
21:| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |
22-
23----
24-
25-## 2. Découpage technique et éditorial des blocs
26-
27-### A. Pile Atmosphérique (`.atmos`)
28-- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
29-- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
30-- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
31-
32:### B. Boot Sequence (`.boot`)
33-- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
34-- **Règles :**
35-  - S'efface automatiquement après 1 à 1.5s ou immédiatement au clic / touche Escape.
36-  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
37-  - Déclenche la frappe progressive du terminal hero à sa fermeture.
38-
39:### C. Hero Commercial & Terminal Vitrine
40-- **Accroche commerciale :**
41:  - Sur-titre : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
42-  - Titre principal : `Développeur Full Stack TypeScript`
43-  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
44:  - Badge de statut : `● Disponible pour missions freelance · Profil Malt vérifié` (avec lien `<ZExternalLink>` vers Malt).
45-  - CTAs :
46-    - Principal : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
47-    - Secondaire : `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
48-- **Terminal vitrine :**
49-  - Simulation de frappe séquentielle :
50:    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
51:    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
52-    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
53-
54-### D. Marquee Stack Moderne
55-- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
56-  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
57-- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.
58-
59-### E. Vitrine des Services (3 Offres Ciblées)
60-1. **Création d'applications web & SaaS**
61-   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
62-   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
63-2. **Développement Full Stack TypeScript**
--
70-### F. Preuves Concrètes & Projets Phares
71-- **1. Keova App (Pièce maîtresse SaaS en production) :**
72-  - Statut : `● En production`
73-  - Rôle : Co-fondateur & Développeur Full Stack
74-  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
75-  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
76-  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
77-- **2. TryOn (Étude de cas SaaS & IA générative) :**
78-  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
79-  - Rôle : CTO & Développeur Full Stack
80-  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
81-  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
82:  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
83-- **3. Nodium (Laboratoire R&D en cours) :**
84-  - Statut : `◐ R&D / En cours`
85-  - Rôle : Créateur & Ingénieur IA
86-  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
87-  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
88-- **Statistiques clés de réassurance :**
89-  - `11` Années d'expérience web
90-  - `100%` TypeScript & SaaS de bout en bout
91-  - `QA` Culture d'automatisation & zéro régression
92-
93-### G. Bloc CTA Final
94-- **Titre :** `Un projet d'application web ou SaaS ?`
95-- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
96-- **Actions :**
97-  - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
98:  - Bouton externe : `<ZExternalLink href="https://www.malt.fr/profile/simonjouan">Me contacter sur Malt</ZExternalLink>`

exec
/bin/zsh -lc "rg -n '"'^(-|'"\\*) ' docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md | tail -80" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
3140:-  color: var(--text-muted);
3141:-  text-align: center;
3142:-  pointer-events: none;
3146:-  flex: 1;
3147:-  min-height: 0;
3148:-  padding: var(--space-4);
3149:-  overflow: auto;
3153:-  line-height: var(--lh-snug);
3154:-  color: var(--ink-1);
3155:-  background: var(--bg-terminal);
3156:-  overflow-wrap: break-word;
3160:-  .hero-term__body {
3161:-    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
3162:-    backdrop-filter: blur(5px);
3163:-  }
3167:-  margin: 0;
3171:-  margin: 0 0 var(--space-4);
3175:-  color: var(--ink-1);
3179:-  color: var(--term-blue);
3183:-  color: var(--term-green);
3189:-  display: block;
3190:-  width: 100%;
3191:-  padding: 0;
3192:-  font: inherit;
3193:-  text-align: left;
3194:-  cursor: pointer;
3195:-  background: none;
3196:-  border: none;
3197:-  border-radius: var(--radius-xs);
3202:-  &:focus-visible {
3203:-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
3204:-    // relais), mais rendu en couleur système sous forced-colors (Windows High
3205:-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
3206:-    outline: 2px solid transparent;
3207:-    outline-offset: 2px;
3208:-    box-shadow: var(--ring-accent);
3217:-  font-family: var(--font-mono);
3221:-  font-weight: var(--fw-bold);
3222:-  color: var(--prompt);
3226:-  color: var(--ink-1);
3230:-  font-weight: var(--fw-bold);
3231:-  color: var(--term-blue);
3235:-  color: var(--ink-1);
3241:-  display: inline-block;
3242:-  width: 0.55em;
3243:-  height: 1.05em;
3244:-  margin-left: 1px;
3245:-  vertical-align: text-bottom;
3246:-  background: var(--prompt);
3248:-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
3249:-  animation: caret-blink 1s steps(1) infinite;
3263:-  .anim,
3264:-  .prm__caret {
3433:-  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
6210:- Spec file: `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md`
6211:- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.2), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
6212:- Diff file: `docs/implementation-artifacts/code-reviews/11-2/full.diff`
6246:- Bare paths (e.g. `checklist.md`) resolve from the skill root.
6247:- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
6248:- `{project-root}`-prefixed paths resolve from the project working directory.
6249:- `{skill-name}` resolves to the skill directory's basename.
6277:- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
6278:- `communication_language`, `document_output_language`, `user_skill_level`
6279:- `date` as system-generated current datetime
6280:- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
6281:- `project_context` = `**/project-context.md` (load if exists)
6282:- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
6298:- **Micro-file Design**: Each step is self-contained and followed exactly
6299:- **Just-In-Time Loading**: Only load the current step file
6300:- **Sequential Enforcement**: Complete steps in order, no skipping
6301:- **State Tracking**: Persist progress via in-memory variables
6302:- **Append-Only Building**: Build artifacts incrementally
6313:- **NEVER** load multiple step files simultaneously
6314:- **ALWAYS** read entire step file before execution
6315:- **NEVER** skip steps or optimize the sequence
6316:- **ALWAYS** follow the exact instructions in the step file
6317:- **ALWAYS** halt at checkpoints and wait for human input
6374:- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
6375:- The prompt that triggered this workflow IS the intent — not a hint.
6376:- Do not modify any files. This step is read-only.

exec
/bin/zsh -lc "rg -n -i 'finding|violation|ac-1|ac-2|ac-3|hardcod|pulse|tim(e|ing)|sessionStorage|token|réserve|aucun écart|no findings' docs/implementation-artifacts/code-reviews/11-2/raw-acceptance-auditor.md | tail -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1889:+    clearTimeout(stepTimeoutId);
1890:+    stepTimeoutId = null;
2077:+              <span class="hero__pulse-dot" aria-hidden="true" />
2150:-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
2243:+// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
2244:+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
2266:+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
2267:+let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
2274:+  if (stepTimeoutId !== null) {
2275:+    clearTimeout(stepTimeoutId);
2276:+    stepTimeoutId = null;
2281:+      sessionStorage.setItem("jouan_boot_done", "1");
2283:+      // Ignore sessionStorage exceptions (private browsing / quota)
2289:+  dismissTimeoutId = setTimeout(() => {
2299:+      stepTimeoutId = setTimeout(finishBoot, 260);
2310:+    stepTimeoutId = setTimeout(next, 230);
2330:+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
2350:+  if (stepTimeoutId !== null) {
2351:+    clearTimeout(stepTimeoutId);
2352:+    stepTimeoutId = null;
2354:+  if (dismissTimeoutId !== null) {
2355:+    clearTimeout(dismissTimeoutId);
2356:+    dismissTimeoutId = null;
2514:+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
2559:+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
2560:+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
2755:              <span class="hero__pulse-dot" aria-hidden="true" />
2936:  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
2948:  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
2950:  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
3030:.hero__pulse-dot {
3080:-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
3082:-// l'identique la spec du composant DS et n'ont pas de token d'espacement
3083:-// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
3239:-// proportionnel à la police) — pas de token équivalent pour un curseur.
3250:+.hero__pulse-dot {
3298:+   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
3331:+  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
3335:+  - [x] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).
3362:+- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
3363:+- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
3371:+- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
3397:+- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
3440:/bin/zsh -lc "rg -n '"'^diff --git|''^@@|''^'"\\+.*(TODO|FIXME|window|document|sessionStorage|matchMedia|prefers|animation|@keyframes|z-index|aria|Malt|services|stats|projects|tagline|tags|h1|eyebrow|help|NuxtLink)' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
3448:37:+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
3451:74:+      sessionStorage.setItem("jouan_boot_done", "1");
3452:76:+      // Ignore sessionStorage exceptions (private browsing / quota)
3454:123:+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
3480:634:+              <span class="hero__pulse-dot" aria-hidden="true" />
3492:999:+   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
3502:1032:+  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
3511:1063:+- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
3512:1064:+- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
3515:1072:+- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
3520:1098:+- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
3601:   307	+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
3646:   352	+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
3647:   353	+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
3692:   398	+        typingTimeoutId = setTimeout(typeChar, 46);
3695:   401	+        stepTimeoutId = setTimeout(() => {
3700:   406	+          stepTimeoutId = setTimeout(typeRow, 280);
3735:   441	+  if (typingTimeoutId !== null) {
3736:   442	+    clearTimeout(typingTimeoutId);
3737:   443	+    typingTimeoutId = null;
3739:   445	+  if (stepTimeoutId !== null) {
3740:   446	+    clearTimeout(stepTimeoutId);
3741:   447	+    stepTimeoutId = null;
3947:   634	+              <span class="hero__pulse-dot" aria-hidden="true" />
4020:   707	-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
4094:   781	-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
4096:   783	-// l'identique la spec du composant DS et n'ont pas de token d'espacement
4097:   784	-// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
4253:   940	-// proportionnel à la police) — pas de token équivalent pour un curseur.
4264:   951	+.hero__pulse-dot {
4328:  const tokens = new Set(custom.split(/\s+/));
4329:  tokens.add("noopener");
4330:  return Array.from(tokens).join(" ");
4366:// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
4576:// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
4671:  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
4694:docs/planning-artifacts/epics.md:32:FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
4699:docs/planning-artifacts/epics.md-37-FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
4715:docs/planning-artifacts/epics.md-102-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
4767:docs/planning-artifacts/epics.md-733-**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
4826:app/pages/contact.vue:358:  // plus lisible que --text-faint. Reste discrète. Token, pas de couleur en dur.
4872:/bin/zsh -lc "rg -n -C 4 'hero__pulse-dot|hero__badge|hero__title|hero__sub|hero__grid|@media \\(max-width|prefers-reduced-motion' app/pages/index.vue app/assets/scss/base/_motion.scss" in /Users/simon/dev/jouan.ovh
4927:app/components/ui/ZButton.vue:30:// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
4937:app/components/ui/ZCard.vue:20:// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
4948:app/assets/scss/base/_motion.scss-20-// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
4973:app/pages/index.vue:20:              <span class="hero__pulse-dot" aria-hidden="true" />
5033:app/pages/index.vue:295:.hero__pulse-dot {
5138:    20	// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
5186:    24	   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
5219:    57	  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
5223:    61	  - [x] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).
5250:    88	- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
5251:    89	- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
5262:   733	**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
5303:    20	              <span class="hero__pulse-dot" aria-hidden="true" />
5485:   201	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
5497:   213	  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
5499:   215	  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
5579:   295	.hero__pulse-dot {
5624:   340	  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
5806:app/components/HeaderComponent.vue-195-  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
5939:/bin/zsh -lc "rg -n -C 5 'HomeBootOverlay|BootOverlay|hero-term|hero__pulse' docs/specs/spec-home-awwwards/sections-mapping.md docs/design_system 'Home - Awwwards.html' 2>/dev/null | head -240" in /Users/simon/dev/jouan.ovh
6215:1. Violations of acceptance criteria (AC)
6220:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
6279:- `date` as system-generated current datetime
6299:- **Just-In-Time Loading**: Only load the current step file
6354:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
6364:diff_output: '' # set at runtime
6365:spec_file: '' # set at runtime (path or empty)
6366:review_mode: '' # set at runtime: "full" or "no-spec"
6367:story_key: '' # set at runtime when discovered from sprint status
6456:/bin/zsh -lc "rg -n -C 12 'Boot|Hero|whoami|focus.txt|help|pulse|Malt|DÉVELOPPEUR FREELANCE' docs/specs/spec-home-awwwards/sections-mapping.md | head -260" in /Users/simon/dev/jouan.ovh
6493:36-  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
6539:87-  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
6618:6279:- `date` as system-generated current datetime
6623:6299:- **Just-In-Time Loading**: Only load the current step file

2026-09-13T18:11:45.540822Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Le diff couvre bien les trois fichiers applicatifs attendus. Deux écarts se dessinent déjà : la puce Malt n’est pas réellement pulsée, et le terminal recopie localement des données de profil/projets malgré la règle DRY. Je vérifie maintenant la gate Docker et les chemins d’exécution pour distinguer les défauts avérés des simples risques.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T18:11:57.226714Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T18:12:04.382111Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T18:12:12.721589Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 16605ms:
 Container jouanovh-web-run-37c9f0b23759 Created 
! Corepack is about to download https://registry.npmjs.org/pnpm/-/pnpm-11.8.0.tgz
$ eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"
$ nuxi typecheck
$ nuxi generate
│
▲  Changing NODE_ENV from development to production, to avoid unintended behavior.
┌  Building Nuxt for production...
│
●  Nuxt 4.4.8 (with Nitro 2.13.4, Vite 7.3.5 and Vue 3.5.38)

[@nuxt/content]  WARN  "blog/blog/.gitkeep" is ignored because parsing is failed. Error: .gitkeep files are not supported.

[@nuxt/content] ✔ Processed 2 collections and 1 files in 12.89ms (0 cached, 1 parsed)

 WARN  Payload extraction is recommended for full-static output. You can enable it by setting experimental.payloadExtraction to true or 'client'.

│
●  Nitro preset: static
ℹ Building client...
ℹ vite v7.3.5 building client environment for production...

 WARN  [plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help

ℹ transforming...
ℹ ✓ 353 modules transformed.
ℹ rendering chunks...
ℹ computing gzip size...
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js            9.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        33.21 kB │ gzip:   2.61 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Bold.DxtomZAI.ttf                  174.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Regular.C0QEQ_U4.ttf               189.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Italic.B29yKq6H.ttf                193.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js  196.87 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-BoldItalic.TXXgaKQw.ttf            198.23 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3.DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ProsePre.D5orA6B_.css                           0.03 kB │ gzip:   0.05 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/LinkListComponent.BRYW5MSq.css                  0.85 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZBadge.BAw1B01J.css                             1.11 kB │ gzip:   0.43 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZCard.C5C9a-aj.css                              1.19 kB │ gzip:   0.47 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/confidentialite.6cyJdYTo.css                    1.31 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/mentions-legales.NzlifB_e.css                   1.31 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZTag.f2Aq6DLg.css                               1.46 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.DsdfcI12.css                              1.65 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-500.CIKAhgAS.css                          1.91 kB │ gzip:   0.73 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-404.BvOk15Jd.css                          2.43 kB │ gzip:   0.86 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZButton.CyAD_ftR.css                            2.70 kB │ gzip:   0.84 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/services.Cbyd59f6.css                           2.83 kB │ gzip:   0.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/about.CJ89_QfO.css                              3.78 kB │ gzip:   1.06 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/_...Xw9nepfy.css                                4.30 kB │ gzip:   0.90 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/contact.CccJ7Dqb.css                            5.08 kB │ gzip:   1.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/default.CvwmGadH.css                            9.77 kB │ gzip:   2.20 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.QaoIl47T.css                             10.41 kB │ gzip:   3.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.CD20ZE6u.css                             11.42 kB │ gzip:   2.60 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BLZjkidY.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/XitNLBmi.js                                     0.21 kB │ gzip:   0.18 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BY9xgIeT.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D9iMAvcC.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CQ-qHzqe.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BVxE9DEu.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CNNfQLSa.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CKAkFjIr.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CRNDMt1F.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cy4WOBL_.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CBhv-jyt.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BrY8EgEC.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CblTwNNG.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DiY3hoSM.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CRxGB9kG.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/NJNqXbK-.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/3UqfMilv.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/vyBzT3Sa.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/pjqLcJzD.js                                     0.48 kB │ gzip:   0.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BRTlzc6W.js                                     0.49 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/lGPxMAix.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DTeXcsCD.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DnTN3vDy.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dq1CwJi-.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DMEer2Go.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Co7L5kxg.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/KYoMLD6F.js                                     0.63 kB │ gzip:   0.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DvN4GzJt.js                                     0.64 kB │ gzip:   0.42 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/87NIhNG9.js                                     0.79 kB │ gzip:   0.46 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CrgqK6PZ.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D4MARP0V.js                                     1.30 kB │ gzip:   0.58 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CGu9udF1.js                                     1.32 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/IeLFzN6u.js                                     2.82 kB │ gzip:   1.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/xchxbewC.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D5C0fWTv.js                                     3.76 kB │ gzip:   1.80 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/TE3rSraK.js                                     3.79 kB │ gzip:   1.70 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DC3U5ttM.js                                     4.77 kB │ gzip:   2.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DFV51AGQ.js                                     4.92 kB │ gzip:   2.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dqic560-.js                                     5.14 kB │ gzip:   2.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dg_rLtv1.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BffN3Nzm.js                                     6.01 kB │ gzip:   2.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CeF9wZwA.js                                     7.68 kB │ gzip:   2.91 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DeySzHKC.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DkfUF7fC.js                                     8.97 kB │ gzip:   3.58 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BdXoYctf.js                                    11.84 kB │ gzip:   4.65 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BkPT_PlW.js                                    13.21 kB │ gzip:   5.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DSmySma-.js                                    32.42 kB │ gzip:  11.76 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/-3YnG8O8.js                                    46.45 kB │ gzip:  19.11 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DfF4bNBO.js                                   187.33 kB │ gzip:  70.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CiuxW6Kl.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.53s
✔ Client built in 2533ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 398 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.50s
✔ Server built in 2508ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /404.html (56ms)
[nitro]   ├─ /200.html (56ms)
[nitro]   ├─ / (58ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (57ms)
[nitro]   ├─ /mentions-legales (36ms)
[nitro]   ├─ /confidentialite (36ms)
[nitro]   ├─ /about (37ms)
[nitro]   ├─ /services (36ms)
[nitro]   ├─ /contact (37ms)
[nitro]   ├─ /blog (38ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (101ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (92ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (92ms)
[nitro] ℹ Prerendered 13 routes in 2.966 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

exec
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-02-review.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together, then wait for all results before continuing.

## INSTRUCTIONS

1. The review layers are `{workflow.review_layers}`, resolved during activation.

2. For each layer in `{workflow.review_layers}`:
   - `instruction` empty or missing → drop the layer silently (an override disabled it).
   - `when` condition present and not satisfied by the current context (`{review_mode}`, `{spec_file}`) → drop the layer and tell the user, e.g. "Acceptance Auditor skipped — no spec file provided."
   - otherwise → the layer is active.

   If no layer is active, HALT with status `blocked` and blocking condition `no active review layers`.

3. Execute all active layers in parallel wherever their execution methods allow: substitute the runtime placeholders (`{diff_output}`, `{spec_file}`) into each layer's `instruction`, then follow it verbatim. If a layer's instruction requires subagents and subagents are not available, generate prompt files in `{implementation_artifacts}` for each such layer and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.

4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.

## NEXT

Read fully and follow `./step-03-triage.md`

2026-09-13T18:12:19.330900Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-04-complete.md" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.codex/skills/bmad-code-review/steps/step-04-complete.md: No such file or directory

exec
/bin/zsh -lc "sed -n '1,360p' /Users/simon/.codex/skills/bmad-code-review/steps/step-03-triage.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
---

# Step 3: Triage

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

## INSTRUCTIONS

1. **Normalize** findings from all layers into a unified list where each finding has:
   - `id` -- sequential integer
   - `source` -- the `id` of the layer that produced the finding (e.g., `blind-hunter`), or merged sources joined with `+` (e.g., `blind-hunter+edge-case-hunter`)
   - `title` -- one-line summary
   - `detail` -- full description
   - `location` -- file and line reference (if available)

2. **Deduplicate.** Deduplicate only findings with the same claim and same required action. If two or more findings meet both conditions, merge them into one:
   - Use the most specific finding as the base (prefer findings with a precise location over prose-only findings).
   - Append any unique detail, reasoning, or location references from the other finding(s) into the surviving `detail` field.
   - Set `source` to the merged sources (e.g., `blind-hunter+edge-case-hunter`).

3. Then evaluate each remaining finding independently. Do not reject a finding because a related finding was rejected.

4. **Read the code before rating.** Before assigning severity, open the source at each finding's location and read enough surrounding code to judge reachability -- call sites, guards, and validation that live outside the diff hunk. Do not rate from the diff hunk alone. Severity reflects the real consequence at a real call site, not the worst theoretical reading.

5. **Assign severity** to each finding by consequence for the artifact's main consumer (software user, document reader, etc).
   Disregard any severity assigned by a reviewing subagent. Review subagents operate under by-design information asymmetry and do not have enough context to set final severity for this workflow.
   - `low` -- none or cosmetic
   - `medium` -- tolerable
   - `high` -- intolerable

6. **Route** each finding into exactly one triage bucket:
   - **decision_needed** -- There is an ambiguous choice that requires human input. The code cannot be correctly patched without knowing the user's intent. Only possible if `{review_mode}` = `"full"`.
   - **patch** -- Code issue that is fixable without human input. The correct fix is unambiguous.
   - **defer** -- Pre-existing issue not caused by the current change. Real but not actionable now.
   - **dismiss** -- Noise, false positive, or handled elsewhere.

   If `{review_mode}` = `"no-spec"` and a finding would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).

7. **Drop** all `dismiss` findings. Record the dismiss count for the summary.

8. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero findings remain after dropping dismissed AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.

9. If zero findings remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)

## NEXT

Read fully and follow `./step-04-present.md`

2026-09-13T18:12:27.796713Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-04-present.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 4: Present and Act

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- When `{spec_file}` is set, always write findings to the story file before offering action choices.
- `decision-needed` findings must be resolved before handling `patch` findings.

## INSTRUCTIONS

### 1. Clean review shortcut

If zero findings remain after triage (all dismissed or none raised): state that and proceed to section 6 (Sprint Status Update).

### 2. Write findings to the story file

If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:

1. **`decision-needed`** findings (unchecked):
   `- [ ] [Review][Decision] <Title> — <Detail>`

2. **`patch`** findings (unchecked):
   `- [ ] [Review][Patch] <Title> [<file>:<line>]`

3. **`defer`** findings (checked off, marked deferred):
   `- [x] [Review][Defer] <Title> [<file>:<line>] — deferred, pre-existing`

Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with description.

### 3. Present summary

Announce what was written:

> **Code review complete.** <D> `decision-needed`, <P> `patch`, <W> `defer`, <R> dismissed as noise.

If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
Otherwise add: `Findings are listed above. No story file was provided, so nothing was persisted.`

### 4. Resolve decision-needed findings

If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.

If the user chooses to defer, ask: Quick one-line reason for deferring this item? (helps future reviews): — then append that reason to both the story file bullet and the `{deferred_work_file}` entry.

**HALT** — I am waiting for your numbered choice. Reply with only the number. Do not proceed until you select an option.

### 5. Handle `patch` findings

If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:

If `{spec_file}` is set, present all three options:

> **How would you like to handle the `<P>` `patch` findings?**
> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
> 2. **Leave as action items** — they are already in the story file
> 3. **Walk through each patch** — show details for each before deciding

If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):

> **How would you like to handle the `<P>` `patch` findings?**
> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
> 2. **Walk through each patch** — show details for each before deciding

**HALT** — I am waiting for your numbered choice. Reply with only the number. Do not proceed until you select an option.

- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.

  **HALT** — I am waiting for your numbered choice. Do not proceed until you select an option.

**✅ Code review actions complete**

- Decision-needed resolved: <D>
- Patches handled: <P>
- Deferred: <W>
- Dismissed: <R>

### 6. Update story status and sync sprint tracking

Skip this section if `{spec_file}` is not set.

#### Determine new status based on review outcome

- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.

Save the story file.

#### Sync sprint-status.yaml

If `{story_key}` is not set, skip this subsection and note that sprint status was not synced because no story key was available.

If `{sprint_status}` file exists:

1. Load the FULL `{sprint_status}` file.
2. Find the `development_status` entry matching `{story_key}`.
3. If found: update `development_status[{story_key}]` to `{new_status}`. Update `last_updated` to current date. Save the file, preserving ALL comments and structure including STATUS DEFINITIONS.
4. If `{story_key}` not found in sprint status: warn the user that the story file was updated but sprint-status sync failed.

If `{sprint_status}` file does not exist, note that story status was updated in the story file only.

#### Completion summary

> **Review Complete!**
>
> **Story Status:** `{new_status}`
> **Issues Fixed:** <fixed_count>
> **Action Items Created:** <action_count>
> **Deferred:** <W>
> **Dismissed:** <R>

### 7. Next steps

Present the user with follow-up options:

> **What would you like to do next?**
> 1. **Start the next story** — run `dev-story` to pick up the next `ready-for-dev` story
> 2. **Re-run code review** — address findings and review again
> 3. **Done** — end the workflow

**HALT** — I am waiting for your choice. Do not proceed until the user selects an option.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.

2026-09-13T18:12:32.392681Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/assets/scss/base/_layout.scss | sed -n '1,140p'; rg -n -C 4 'a:focus-visible|\\.screen-reader-text|focus-visible' app/assets/scss app/components | head -200" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	// ============================================================
     2	//  Primitives de layout du design system — GLOBALES
     3	//
     4	//  .section / .section--sunken / .container / .eyebrow / .prose
     5	//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
     6	//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
     7	//  à l'identique en <style scoped> dans chaque page (index, services,
     8	//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
     9	// ============================================================
    10	
    11	/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
    12	
    13	// Bloc de section vertical. padding-block uniquement : le gutter
    14	// horizontal vient de .container (enfant) — évite le conflit de
    15	// shorthand padding multi-axes (cf. project-context, piège story 3.1).
    16	.section {
    17	  padding-block: var(--space-16);
    18	}
    19	
    20	// Section en creux : fond teinté + filets haut/bas.
    21	.section--sunken {
    22	  background: var(--bg-sunken);
    23	  border-top: 1px solid var(--border-subtle);
    24	  border-bottom: 1px solid var(--border-subtle);
    25	}
    26	
    27	// Conteneur centré à largeur max ; gutter horizontal en longhand.
    28	.container {
    29	  width: 100%;
    30	  max-width: var(--container-xl);
    31	  margin: 0 auto;
    32	  padding-inline: var(--space-6);
    33	}
    34	
    35	// Sur-titre mono en capitales espacées, accent orange.
    36	// font-weight et line-height neutralisés pour un rendu identique sur <h2 class="eyebrow"> et <p class="eyebrow">.
    37	.eyebrow {
    38	  margin: 0 0 var(--space-3);
    39	  font-family: var(--font-mono);
    40	  font-size: var(--fs-xs);
    41	  font-weight: var(--fw-regular);
    42	  line-height: var(--lh-relaxed);
    43	  letter-spacing: var(--ls-wider);
    44	  text-transform: uppercase;
    45	  color: var(--accent);
    46	}
    47	
    48	// Variante discrète (sur-titre secondaire, ex. « // stack »).
    49	.eyebrow--muted {
    50	  color: var(--text-muted);
    51	}
    52	
    53	// Texte long-forme : Ubuntu sans, interligne détendu.
    54	.prose {
    55	  font-family: var(--font-sans);
    56	  line-height: var(--lh-relaxed);
    57	  color: var(--text-body);
    58	}
    59	
    60	// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
    61	// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
    62	.hero__tags {
    63	  display: flex;
    64	  flex-wrap: wrap;
    65	  gap: var(--space-2);
    66	  margin: 0;
    67	  padding: 0;
    68	  list-style: none;
    69	}
    70	
    71	// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
    72	// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
    73	.post__meta {
    74	  display: flex;
    75	  gap: var(--space-3);
    76	  align-items: center;
    77	  font-family: var(--font-mono);
    78	  font-size: var(--fs-xs);
    79	
    80	  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
    81	  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
    82	  color: var(--text-muted);
    83	}
app/components/HeaderComponent.vue-230-    color: var(--text-strong);
app/components/HeaderComponent.vue-231-  }
app/components/HeaderComponent.vue-232-
app/components/HeaderComponent.vue-233-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-236-    outline-offset: 2px;
app/components/HeaderComponent.vue-237-    border-radius: var(--radius-sm);
app/components/HeaderComponent.vue-238-    box-shadow: var(--ring-accent);
--
app/components/HeaderComponent.vue-263-    background: var(--surface-2);
app/components/HeaderComponent.vue-264-  }
app/components/HeaderComponent.vue-265-
app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
app/components/HeaderComponent.vue:267:  &:focus-visible {
app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-269-    outline-offset: 2px;
app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-271-  }
--
app/components/HeaderComponent.vue-300-  background: none;
app/components/HeaderComponent.vue-301-  border: 1px solid var(--border-default);
app/components/HeaderComponent.vue-302-  border-radius: var(--radius-md);
app/components/HeaderComponent.vue-303-
app/components/HeaderComponent.vue:304:  &:focus-visible {
app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-306-    outline-offset: 2px;
app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-308-  }
--
app/components/HeaderComponent.vue-392-    color: var(--text-strong);
app/components/HeaderComponent.vue-393-    background: var(--surface-2);
app/components/HeaderComponent.vue-394-  }
app/components/HeaderComponent.vue-395-
app/components/HeaderComponent.vue:396:  &:focus-visible {
app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-398-    outline-offset: 2px;
app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-400-  }
--
app/assets/scss/base/_reset.scss-558-/* Accessibility
app/assets/scss/base/_reset.scss-559---------------------------------------------- */
app/assets/scss/base/_reset.scss-560-
app/assets/scss/base/_reset.scss-561-/* Text meant only for screen readers. */
app/assets/scss/base/_reset.scss:562:.screen-reader-text {
app/assets/scss/base/_reset.scss-563-  border: 0;
app/assets/scss/base/_reset.scss-564-  clip-path: inset(50%);
app/assets/scss/base/_reset.scss-565-  height: 1px;
app/assets/scss/base/_reset.scss-566-  margin: -1px;
--
app/assets/scss/base/_reset.scss-570-  width: 1px;
app/assets/scss/base/_reset.scss-571-  overflow-wrap: normal !important;
app/assets/scss/base/_reset.scss-572-}
app/assets/scss/base/_reset.scss-573-
app/assets/scss/base/_reset.scss:574:.screen-reader-text:focus {
app/assets/scss/base/_reset.scss-575-  background-color: #f1f1f1;
app/assets/scss/base/_reset.scss-576-  border-radius: 3px;
app/assets/scss/base/_reset.scss-577-  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
app/assets/scss/base/_reset.scss-578-  clip-path: none;
--
app/components/FooterComponent.vue-109-    color: var(--text-strong);
app/components/FooterComponent.vue-110-  }
app/components/FooterComponent.vue-111-
app/components/FooterComponent.vue-112-  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
app/components/FooterComponent.vue:113:  &:focus-visible {
app/components/FooterComponent.vue-114-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-115-    outline-offset: 2px;
app/components/FooterComponent.vue-116-    border-radius: var(--radius-sm);
app/components/FooterComponent.vue-117-    box-shadow: var(--ring-accent);
--
app/components/FooterComponent.vue-160-    color: var(--accent);
app/components/FooterComponent.vue-161-  }
app/components/FooterComponent.vue-162-
app/components/FooterComponent.vue-163-  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
app/components/FooterComponent.vue:164:  &:focus-visible {
app/components/FooterComponent.vue-165-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-166-    outline-offset: 2px;
app/components/FooterComponent.vue-167-    border-radius: var(--radius-xs);
app/components/FooterComponent.vue-168-    box-shadow: var(--ring-accent);
--
app/components/HexagonLinkComponent.vue-35-    color: var(--ink-on-accent);
app/components/HexagonLinkComponent.vue-36-    background: var(--accent);
app/components/HexagonLinkComponent.vue-37-  }
app/components/HexagonLinkComponent.vue-38-
app/components/HexagonLinkComponent.vue:39:  &:focus-visible {
app/components/HexagonLinkComponent.vue-40-    outline: 2px solid var(--accent);
app/components/HexagonLinkComponent.vue-41-    outline-offset: 2px;
app/components/HexagonLinkComponent.vue-42-  }
app/components/HexagonLinkComponent.vue-43-}
--
app/components/terminal/TerminalComponent.vue-374-        filter: brightness(1.2);
app/components/terminal/TerminalComponent.vue-375-      }
app/components/terminal/TerminalComponent.vue-376-
app/components/terminal/TerminalComponent.vue-377-      // Focus clavier visible (close désormais focusable — a11y CAP-11).
app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
app/components/terminal/TerminalComponent.vue-379-        outline: 2px solid var(--accent);
app/components/terminal/TerminalComponent.vue-380-        outline-offset: 2px;
app/components/terminal/TerminalComponent.vue-381-      }
app/components/terminal/TerminalComponent.vue-382-    }
--
app/components/ui/ZButton.vue-130-    border-color var(--dur-fast) var(--ease-standard),
app/components/ui/ZButton.vue-131-    color var(--dur-fast) var(--ease-standard),
app/components/ui/ZButton.vue-132-    transform var(--dur-fast) var(--ease-standard);
app/components/ui/ZButton.vue-133-
app/components/ui/ZButton.vue:134:  &:focus-visible {
app/components/ui/ZButton.vue-135-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
app/components/ui/ZButton.vue-136-    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/components/ui/ZButton.vue-137-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
app/components/ui/ZButton.vue-138-    outline: 2px solid transparent;
--
app/components/home/HomeHeroTerminal.vue-315-  background: none;
app/components/home/HomeHeroTerminal.vue-316-  border: none;
app/components/home/HomeHeroTerminal.vue-317-  border-radius: var(--radius-xs);
app/components/home/HomeHeroTerminal.vue-318-
app/components/home/HomeHeroTerminal.vue:319:  &:focus-visible {
app/components/home/HomeHeroTerminal.vue-320-    outline: 2px solid transparent;
app/components/home/HomeHeroTerminal.vue-321-    outline-offset: 2px;
app/components/home/HomeHeroTerminal.vue-322-    box-shadow: var(--ring-accent);
app/components/home/HomeHeroTerminal.vue-323-  }
--
app/components/ui/ZCard.vue-93-
app/components/ui/ZCard.vue-94-  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
app/components/ui/ZCard.vue-95-  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
app/components/ui/ZCard.vue-96-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
app/components/ui/ZCard.vue:97:  &:focus-visible {
app/components/ui/ZCard.vue-98-    // Outline transparent → rendu en couleur système sous forced-colors (où les
app/components/ui/ZCard.vue-99-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
app/components/ui/ZCard.vue-100-    outline: 2px solid transparent;
app/components/ui/ZCard.vue-101-    outline-offset: 2px;
--
app/components/ui/ZTag.vue-143-    border-color: var(--border-strong);
app/components/ui/ZTag.vue-144-    color: var(--text-strong);
app/components/ui/ZTag.vue-145-  }
app/components/ui/ZTag.vue-146-
app/components/ui/ZTag.vue:147:  &:focus-visible {
app/components/ui/ZTag.vue-148-    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue-149-    outline: 2px solid transparent;
app/components/ui/ZTag.vue-150-    outline-offset: 2px;
app/components/ui/ZTag.vue-151-    box-shadow: var(--ring-accent);
--
app/components/ui/ZTag.vue-172-  &:hover {
app/components/ui/ZTag.vue-173-    color: var(--term-red);
app/components/ui/ZTag.vue-174-  }
app/components/ui/ZTag.vue-175-
app/components/ui/ZTag.vue:176:  &:focus-visible {
app/components/ui/ZTag.vue-177-    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue-178-    outline: 2px solid transparent;
app/components/ui/ZTag.vue-179-    outline-offset: 2px;
app/components/ui/ZTag.vue-180-    box-shadow: var(--ring-accent);

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-2/raw-edge-case-hunter.json" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09bf4-2781-7321-a0dd-9da1bfa6c2fc
--------
user
# Edge Case Hunter Prompt — Story 11.2

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-2/full.diff`

Goal: Walk every branching path and boundary condition in content, report only unhandled edge cases.
Method: Exhaustive path enumeration — mechanically walk every branch, report ONLY paths and conditions that lack handling. Discard handled ones silently. Do NOT editorialize or add filler. Do not assign severity labels, rankings, or priority levels.

Return ONLY a valid JSON array of objects. Each edge-case finding contains exactly these four fields:
[
  {
    "location": "file:start-end (or file:line)",
    "trigger_condition": "one-line description (max 15 words)",
    "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string)",
    "potential_consequence": "what could actually go wrong (max 15 words)"
  }
]

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-edge-case-hunter` pour parcourir exhaustivement les branches du diff et ne retenir que les cas non gérés.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-edge-case-hunter/SKILL.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-review-edge-case-hunter
description: 'Walk every branching path and boundary condition in content, report only unhandled edge cases. Orthogonal to adversarial review - method-driven not attitude-driven. Use when you need exhaustive edge-case analysis of code, specs, or diffs.'
---

# Edge Case Hunter Review

**Goal:** You are a pure path tracer. Never comment on whether code is good or bad; only list missing handling.
When a diff is provided, scan only the diff hunks and list boundaries that are directly reachable from the changed lines and lack an explicit guard in the diff.
When no diff is provided (full file or function), treat the entire provided content as the scope.
Ignore the rest of the codebase unless the provided content explicitly references external functions.

**Inputs:**
- **content** — Content to review: diff, full file, or function
- **also_consider** (optional) — Areas to keep in mind during review alongside normal edge-case analysis

**MANDATORY: Execute steps in the Execution section IN EXACT ORDER. DO NOT skip steps or change the sequence. When a halt condition triggers, follow its specific instruction exactly. Each action within a step is a REQUIRED action to complete that step.**

**Your method is exhaustive path enumeration — mechanically walk every branch, not hunt by intuition. Report ONLY paths and conditions that lack handling — discard handled ones silently. Do NOT editorialize or add filler — findings only.**


## EXECUTION

### Step 1: Receive Content

- Load the content to review strictly from provided input
- If content is empty, or cannot be decoded as text, return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` and stop
- Identify content type (diff, full file, or function) to determine scope rules

### Step 2: Exhaustive Path Analysis

**Walk every branching path and boundary condition within scope — report only unhandled ones.**

- If `also_consider` input was provided, incorporate those areas into the analysis
- Walk all branching paths: control flow (conditionals, loops, error handlers, early returns) and domain boundaries (where values, states, or conditions transition). Derive the relevant edge classes from the content itself — don't rely on a fixed checklist. Examples: missing else/default, unguarded inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
- For each path: determine whether the content handles it
- Collect only the unhandled paths as findings — discard handled ones silently

### Step 3: Validate Completeness

- Revisit every edge class from Step 2 — e.g., missing else/default, null/empty inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
- Add any newly found unhandled paths to findings; discard confirmed-handled ones

### Step 4: Present Findings

Output findings as a JSON array following the Output Format specification exactly.


## OUTPUT FORMAT

Return ONLY a valid JSON array of objects. Each object must contain exactly these four fields and nothing else:

```json
[{
  "location": "file:start-end (or file:line when single line, or file:hunk when exact line unavailable)",
  "trigger_condition": "one-line description (max 15 words)",
  "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string, no raw newlines or unescaped quotes)",
  "potential_consequence": "what could actually go wrong (max 15 words)"
}]
```

No extra text, no explanations, no markdown wrapping. An empty array `[]` is valid when no unhandled paths are found.


## HALT CONDITIONS

- If content is empty or cannot be decoded as text, return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` and stop

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/11-2/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    1138 docs/implementation-artifacts/code-reviews/11-2/full.diff
diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
new file mode 100644
index 0000000..bdd4f89
--- /dev/null
+++ b/app/components/home/HomeBootOverlay.vue
@@ -0,0 +1,230 @@
+<template>
+  <div
+    v-if="!isDismissed"
+    class="boot"
+    :class="{ 'boot--done': isDone }"
+    role="status"
+    aria-live="polite"
+    @click="finishBoot"
+  >
+    <div class="boot__in">
+      <div class="boot__logo">
+        <ZIcon name="gem" class="boot__logo-icon" />
+        <b>jouan.os</b>
+      </div>
+      <div class="boot__line">
+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
+      </div>
+      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
+        <i :style="{ width: `${progressPercent}%` }" />
+      </div>
+      <div class="boot__skip">[ cliquez ou appuyez sur Échap pour passer ]</div>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
+// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
+// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
+
+const emit = defineEmits<{
+  (e: "boot-complete"): void;
+}>();
+
+const isDismissed = ref(false);
+const isDone = ref(false);
+const currentStepText = ref("");
+const currentStepOk = ref(false);
+const progressPercent = ref(0);
+
+const bootSteps = [
+  { text: "initialisation du noyau…", ok: false },
+  { text: "montage de /dev/portfolio", ok: false },
+  { text: "chargement des polices Ubuntu Mono", ok: false },
+  { text: "compilation des projets", ok: true },
+  { text: "démarrage du serveur", ok: true },
+];
+
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
+
+function finishBoot() {
+  if (isDone.value) return;
+  isDone.value = true;
+  progressPercent.value = 100;
+
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+
+  if (import.meta.client) {
+    try {
+      sessionStorage.setItem("jouan_boot_done", "1");
+    } catch {
+      // Ignore sessionStorage exceptions (private browsing / quota)
+    }
+  }
+
+  emit("boot-complete");
+
+  dismissTimeoutId = setTimeout(() => {
+    isDismissed.value = true;
+  }, 600);
+}
+
+function runBoot() {
+  let stepIndex = 0;
+
+  function next() {
+    if (stepIndex >= bootSteps.length) {
+      stepTimeoutId = setTimeout(finishBoot, 260);
+      return;
+    }
+
+    const step = bootSteps[stepIndex];
+    if (step) {
+      currentStepText.value = step.text;
+      currentStepOk.value = step.ok;
+      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
+    }
+    stepIndex++;
+    stepTimeoutId = setTimeout(next, 230);
+  }
+
+  next();
+}
+
+function handleKeydown(e: KeyboardEvent) {
+  if (e.key === "Escape" && !isDone.value) {
+    finishBoot();
+  }
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  window.addEventListener("keydown", handleKeydown);
+
+  // Vérifier si la session a déjà vu le boot
+  let alreadyBooted = false;
+  try {
+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
+  } catch {
+    alreadyBooted = false;
+  }
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (alreadyBooted || reduceMotion) {
+    isDone.value = true;
+    isDismissed.value = true;
+    emit("boot-complete");
+    return;
+  }
+
+  runBoot();
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("keydown", handleKeydown);
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+  if (dismissTimeoutId !== null) {
+    clearTimeout(dismissTimeoutId);
+    dismissTimeoutId = null;
+  }

codex
La gate Docker demandée est verte : lint, typecheck et génération statique réussissent, avec 13 routes pré-rendues. Les écarts retenus sont donc contractuels/comportementaux et non un échec de compilation ; je finalise la liste avec les références exactes au diff.
Audit terminé; la gate Docker est verte et les écarts avérés sont isolés.
  ✓ Lire les instructions du skill de revue et les documents de référence
  ✓ Inspecter le diff complet et relier chaque changement aux AC
  ✓ Vérifier les contradictions, omissions et écarts d’intention
  ✓ Rédiger la liste Markdown finale avec preuves précises
codex
- **[Moyen] Puce Malt non pulsée et mauvais token** — Viole AC3 / FR20 / UX-DR20 : `.hero__pulse-dot` est statique, utilise `var(--term-green)` au lieu de `var(--success)` et ne définit aucune animation (`app/pages/index.vue:295-300`).

- **[Moyen] Données profil/projets hardcodées dans le terminal** — Viole la contrainte DRY d’`AGENTS.md` et AC2 : `HomeHeroTerminal.vue` recopie « Simon Jouan » et les projets au lieu de consommer `SITE.profile` / `SITE.projects` (`HomeHeroTerminal.vue:329-343`).

- **[Moyen] Styles du nouveau code non entièrement tokenisés** — Viole `AGENTS.md` §3 et les tâches de stylisation : valeurs en dur pour dimensions, espacements, ombres et durées (`HomeBootOverlay.vue:181-219`, `HomeHeroTerminal.vue:470-597`, `app/pages/index.vue:295-300`).

- **[Faible] Focus forced-colors incomplet sur le lien Malt** — Viole la contrainte a11y d’`AGENTS.md` : le style local du lien ne définit que `:hover`, sans repli `:focus-visible` avec `outline` transparent et `outline-offset` (`app/pages/index.vue:285-292`).

- **[Faible] Le contournement reduced-motion ne passe pas par `finishBoot()`** — Viole AC1 / la tâche de mémorisation en session : la branche `reduceMotion` masque et émet directement, tandis que l’écriture `jouan_boot_done` existe uniquement dans `finishBoot()` (`HomeBootOverlay.vue:67-80`, `HomeBootOverlay.vue:130-136`). Une modification ultérieure de la préférence peut donc rejouer le boot dans la même session.

La gate Docker AC4 passe : lint, typecheck et génération de 13 routes réussis.
tokens used
170 519
- **[Moyen] Puce Malt non pulsée et mauvais token** — Viole AC3 / FR20 / UX-DR20 : `.hero__pulse-dot` est statique, utilise `var(--term-green)` au lieu de `var(--success)` et ne définit aucune animation (`app/pages/index.vue:295-300`).

- **[Moyen] Données profil/projets hardcodées dans le terminal** — Viole la contrainte DRY d’`AGENTS.md` et AC2 : `HomeHeroTerminal.vue` recopie « Simon Jouan » et les projets au lieu de consommer `SITE.profile` / `SITE.projects` (`HomeHeroTerminal.vue:329-343`).

- **[Moyen] Styles du nouveau code non entièrement tokenisés** — Viole `AGENTS.md` §3 et les tâches de stylisation : valeurs en dur pour dimensions, espacements, ombres et durées (`HomeBootOverlay.vue:181-219`, `HomeHeroTerminal.vue:470-597`, `app/pages/index.vue:295-300`).

- **[Faible] Focus forced-colors incomplet sur le lien Malt** — Viole la contrainte a11y d’`AGENTS.md` : le style local du lien ne définit que `:hover`, sans repli `:focus-visible` avec `outline` transparent et `outline-offset` (`app/pages/index.vue:285-292`).

- **[Faible] Le contournement reduced-motion ne passe pas par `finishBoot()`** — Viole AC1 / la tâche de mémorisation en session : la branche `reduceMotion` masque et émet directement, tandis que l’écriture `jouan_boot_done` existe uniquement dans `finishBoot()` (`HomeBootOverlay.vue:67-80`, `HomeBootOverlay.vue:130-136`). Une modification ultérieure de la préférence peut donc rejouer le boot dans la même session.

La gate Docker AC4 passe : lint, typecheck et génération de 13 routes réussis.

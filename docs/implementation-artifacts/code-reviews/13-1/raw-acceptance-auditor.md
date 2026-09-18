Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b4c6-6b75-70e2-a248-10ede8bc7060
--------
user
# Acceptance Auditor Prompt — Story 13.1

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md`
- Context specs: `docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`, `docs/specs/spec-theme-light-dark/technical-architecture.md`, `docs/specs/spec-theme-light-dark/SPEC.md`, `docs/planning-artifacts/epics.md` (Epic 13 / Story 13.1), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/13-1/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise la compétence de revue de code BMAD pour auditer la diff contre les critères d’acceptation et les spécifications indiquées, puis je vérifierai les contraintes projet directement dans les fichiers de référence.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && printf '%s\\n' docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md docs/specs/spec-theme-light-dark/technical-architecture.md docs/specs/spec-theme-light-dark/SPEC.md docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md docs/implementation-artifacts/code-reviews/13-1/full.diff | xargs -n1 test -f && echo all-files-present" in /Users/simon/dev/jouan.ovh
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

---FILES---
all-files-present

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

codex
La cible est explicitement le fichier de diff fourni, avec une revue “full” basée sur Story 13.1 et les documents de contexte listés. Je poursuis sans checkpoint interactif, conformément à votre consigne, et je vais confronter les AC aux changements réels.
exec
/bin/zsh -lc "rg -n -i \"story 13\\.1|13\\.1|acceptance|AC[0-9]|token|theme|clair|terminal|sanctuar|dark|light\" docs/planning-artifacts/epics.md docs/specs/spec-theme-light-dark/SPEC.md docs/specs/spec-theme-light-dark/technical-architecture.md docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md docs/project-context.md AGENTS.md" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/13-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/assets/scss/abstract/_root.scss b/app/assets/scss/abstract/_root.scss
index 16c78d3..5e92f5f 100644
--- a/app/assets/scss/abstract/_root.scss
+++ b/app/assets/scss/abstract/_root.scss
@@ -202,6 +202,57 @@
   --ease-standard: ease-in-out;
 }
 
+// ============================================================
+//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
+// ============================================================
+[data-theme="light"] {
+  // Surfaces claires
+  --bg-page: hsl(38deg 25% 97%);
+  --bg-sunken: hsl(38deg 20% 93%);
+  --bg-card: hsl(0deg 0% 100%);
+  --bg-elevated: hsl(38deg 30% 99%);
+  --bg-input: hsl(38deg 15% 95%);
+
+  // Encres aubergine (contrastes WCAG AAA)
+  --text-strong: hsl(320deg 30% 12%);
+  --text-body: hsl(320deg 18% 26%);
+  --text-muted: hsl(320deg 10% 44%);
+  --text-faint: hsl(320deg 8% 58%);
+  --ink-on-accent: hsl(0deg 0% 100%);
+
+  // Bordures douces
+  --border-subtle: hsl(35deg 15% 88%);
+  --border-default: hsl(35deg 12% 80%);
+  --border-strong: hsl(35deg 12% 68%);
+
+  // Accent & sélections
+  --accent: hsl(24deg 95% 44%);
+  --accent-soft: hsl(24deg 94% 53% / 10%);
+  --accent-ring: hsl(24deg 94% 53% / 35%);
+  --selection: hsl(24deg 94% 53% / 22%);
+  --overlay: hsl(320deg 30% 10% / 40%);
+
+  // Ombres adaptées
+  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
+  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
+  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
+  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
+}
+
+// Sanctuarisation absolue du terminal sombre
+.home-hero-terminal,
+.hero-term,
+.terminal-window,
+.terminal {
+  --bg-terminal: hsl(319deg 100% 9%);
+  --text-strong: var(--ink-1);
+  --text-body: var(--ink-2);
+  --text-muted: var(--ink-3);
+  --border-subtle: var(--line-subtle);
+  --border-default: var(--line);
+  --border-terminal: hsl(319deg 40% 30% / 40%);
+}
+
 ::selection {
   background: var(--selection);
 }
diff --git a/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md b/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
index 88e70d4..b25f23b 100644
--- a/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
+++ b/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
@@ -4,7 +4,7 @@ baseline_commit: f077f9b563bcef69bc61b9f28913f6db071e8b36
 
 # Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -65,21 +65,21 @@ so that l'application s'adapte sans rupture de style ni dénaturation de l'immer
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
-  - [ ] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
-  - [ ] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
-  - [ ] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
-  - [ ] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).
+- [x] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
+  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
+  - [x] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
+  - [x] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
+  - [x] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
+  - [x] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).
 
-- [ ] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
-  - [ ] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
-  - [ ] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-terminal`).
-  - [ ] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.
+- [x] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
+  - [x] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
+  - [x] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-default`, `--border-terminal`).
+  - [x] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.
 
-- [ ] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
-  - [ ] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
-  - [ ] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.
+- [x] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
+  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
+  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.
 
 ## Dev Notes
 
@@ -157,11 +157,19 @@ so that l'application s'adapte sans rupture de style ni dénaturation de l'immer
 
 ### Agent Model Used
 
-Gemini 3.8 Flash (High)
+Gemini 3.7 Flash (Medium)
 
 ### Debug Log References
 
+- Validation Gate Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
+- 0 erreur ESLint, 0 erreur Stylelint.
+- 24 routes SSG pré-rendues sans anomalie.
+
 ### Completion Notes List
 
+- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
+- Redéfinition des alias sémantiques de surfaces (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`), encres aubergine WCAG AAA (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`, `--ink-on-accent`), bordures chaudes, ombres et accents orange contrastés.
+- Sanctuarisation stricte des composants terminaux (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`) avec préservation du fond sombre, encres claires et bordures terminales.
+
 ### File List
 - `app/assets/scss/abstract/_root.scss`
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 7ec2bf6..aa2eec1 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 13.1 prête pour le dev)"
+last_updated: "2026-09-18 (Story 13.1 prête pour code-review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -139,7 +139,7 @@ development_status:
 
   # Epic 13 — Thème Light & Dark et Bascule Utilisateur
   epic-13: in-progress
-  13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: ready-for-dev
+  13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: review
   13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: backlog
   13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: backlog
   13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg: backlog

 succeeded in 0ms:
AGENTS.md:15:  - **ZÉRO EMOJI** dans le contenu et l'UI (univers sobre et professionnel inspiré du terminal).
AGENTS.md:53:- **UI / Composants :** Vue 3 avec **`<script setup lang="ts">`** obligatoire pour tout nouveau composant. (Plus aucun décorateur de classe ; le terminal a été intégralement migré en `script setup`).
AGENTS.md:56:- **Tokens & Design System :** Dark-first (pas de mode clair). Tokens CSS custom properties exposés globalement sur `:root` dans `app/assets/scss/abstract/_root.scss`. Consommation via `var(--token)`.
AGENTS.md:71:│   │   ├── abstract/        # Tokens, variables, mixins (_root.scss = source vérité CSS vars)
AGENTS.md:77:│   │   ├── home/            # Composants immersifs d'accueil (HomeAtmosComponent, HomeBootOverlay, HomeHeroTerminal, HomeStackMarquee)
AGENTS.md:78:│   │   ├── terminal/        # Sous-système terminal draggable (TerminalComponent, TerminalManagerComponent)
AGENTS.md:91:│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
AGENTS.md:122:- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
AGENTS.md:125:### 3. Tokens & Primitives de Layout SCSS
AGENTS.md:126:- **No Hardcode :** Aucune couleur, rayon, ombre ou marge en dur. Toujours consommer les variables globales `var(--token)`.
AGENTS.md:135:- **Motion réduit :** Respect universel de `prefers-reduced-motion: reduce`. Le caret natif du terminal est la **seule animation en boucle autorisée** sur le site (CAP-11). Les carets décoratifs doivent être figés visibles.
AGENTS.md:136:- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:3:description: Systèmes IA & automatisation métier — Design System Thème Light & Dark
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:7:  # Palette Dark (Fondations existantes)
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:8:  surface-0-dark: '#140b12'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:9:  surface-1-dark: '#1c121a'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:10:  surface-2-dark: '#241a22'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:11:  surface-3-dark: '#2f232d'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:12:  surface-4-dark: '#3d303b'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:13:  ink-1-dark: '#f5f3f0'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:14:  ink-2-dark: '#c3bdb7'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:15:  ink-3-dark: '#8f8783'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:16:  ink-4-dark: '#6b6460'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:17:  line-subtle-dark: '#342832'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:18:  line-dark: '#483945'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:19:  line-strong-dark: '#63515f'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:21:  # Palette Light (Option 1 — Papier technique / Crème solaire)
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:22:  surface-0-light: '#faf8f4'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:23:  surface-1-light: '#f1ede6'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:24:  surface-2-light: '#ffffff'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:25:  surface-3-light: '#fffefb'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:26:  surface-4-light: '#f5f3ee'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:27:  ink-1-light: '#271524'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:28:  ink-2-light: '#473644'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:29:  ink-3-light: '#756773'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:30:  ink-4-light: '#988d96'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:31:  line-subtle-light: '#e6e2dc'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:32:  line-light: '#d1ccc4'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:33:  line-strong-light: '#b3aba2'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:35:  # Sanctuarisation Terminal (Identique en Dark et Light)
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:36:  surface-terminal: '#2e0024'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:37:  ink-terminal-prompt: '#45d677'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:38:  ink-terminal-dir: '#56b6f7'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:39:  ink-terminal-text: '#f5f3f0'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:43:  orange-light-contrast: '#d94f00'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:45:  aubergine-light: '#b890b0'
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:66:  theme-toggle:
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:74:# Design Specification — Thème Light & Dark (jouan.ovh)
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:78:Le site **jouan.ovh** incarne le savoir-faire de Simon Jouan en tant que développeur Full Stack spécialisé en systèmes IA et automatisation métier. Son identité visuelle puise ses racines dans l'univers du terminal UNIX, la rigueur métrologique et l'héritage Ubuntu (orange vibrant et nuances aubergines).
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:80:L'introduction du mode clair ne renie aucunement cette âme :
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:81:- En lieu et place d'un blanc clinique éblouissant de laboratoire, le thème clair adopte la posture **« Papier technique / Crème solaire »** : une feuille de calcul industrielle, un carnet d'ingénieur ou une documentation d'architecture imprimée sur un papier ivoire chaud (`{colors.surface-0-light}`).
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:82:- Les éléments de typographie conservent leur ascendance aubergine profonde (`{colors.ink-1-light}` et `{colors.ink-2-light}`), offrant une lisibilité veloutée et hautement contrastée sans jamais être agressive.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:83:- **Sanctuarisation terminal :** Les composants à vocation purement CLI (le Terminal Hero et les fenêtres flottantes `TerminalComponent`) restent **impérativement sombres** (`{colors.surface-terminal}`). Ils agissent comme des îlots d'exécution système authentiques, tranchant avec élégance sur la clarté du document.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:89:### 2.1 Philosophie et Palette en mode Clair
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:91:| Rôle de Token | Valeur HSL / Hex | Usage & Intention |
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:102:### 2.2 Typographie et Lisibilité (Encres en mode Clair)
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:104:| Token d'encre | Valeur Hex | Ratio de contraste vs Surface-0 / Surface-2 |
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:111:### 2.3 Accents et Terminal
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:113:- **Accent Orange en mode clair :** Afin de garantir un ratio de contraste supérieur à 4.5:1 pour les textes d'accroche et les liens sur fond clair, l'orange est subtilement réajusté à `{colors.orange-light-contrast}` (`#D94F00`, contraste 4.6:1). Pour les boutons pleins (`ZButton variant="primary"`), l'orange vif standard (`#FA6412`) est conservé avec du texte blanc `{colors.ink-1-dark}`.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:114:- **Terminal sanctuarisé :** Les classes `.terminal`, `.home-hero-terminal` et les fenêtres CLI forcent explicitement les variables locales de surface à `--bg-terminal: #2e0024` et `--text-strong: #f5f3f0`, rendant le terminal insensible à l'inversion globale du thème.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:122:- Police de données, terminal et code : **Ubuntu Mono** (`{typography.font-mono.fontFamily}`).
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:129:Le composant de bascule de thème (`ThemeToggle`) s'intègre au système de grille du Header sans déformer la hauteur existante (`--header-height: 56px`) :
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:138:En mode sombre, la profondeur s'exprime par la lumière incidente et les bordures subtiles. En mode clair, la profondeur s'articule par des ombres portées douces et chaleureuses :
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:140:- `--shadow-1` (Light) : `0 1px 3px hsl(35deg 20% 40% / 8%)`
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:141:- `--shadow-2` (Light) : `0 3px 10px hsl(35deg 20% 40% / 10%)`
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:142:- `--shadow-3` (Light) : `0 8px 24px hsl(35deg 20% 40% / 12%)`
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:143:- `--shadow-hairline` (Light) : `inset 0 1px 0 hsl(0 0% 100% / 80%)` (rehaut supérieur blanc net)
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:154:## 7. Components — Le Bouton `ThemeToggle`
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:167:| **Système (Auto)** | Moniteur / Terminal épuré (`monitor` ou `terminal-mini`) avec pastille discrète de synchronisation | Bordure subtile, icône encre atténuée. |
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:169:| **Clair forcé** | Soleil technique stylisé (`sun` à 8 rayons nets) | Accent ambre/orange doux. |
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:181:- **DO** tester systématiquement chaque token de texte sur `{colors.surface-0-light}` et `{colors.surface-2-light}` pour garantir le ratio minimal de 4.5:1.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:182:- **DO** laisser le Terminal Hero en fond sombre `{colors.surface-terminal}` quel que soit le mode actif.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:187:- **DON'T** utiliser un blanc `#FFFFFF` brut pour le fond général de page (utiliser impérativement la teinte crème `{colors.surface-0-light}`).
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md:188:- **DON'T** inverser le fond du terminal ou blanchir son prompt (le terminal est sanctuarisé).
docs/specs/spec-theme-light-dark/technical-architecture.md:1:# Technical Architecture — Thème Light & Dark
docs/specs/spec-theme-light-dark/technical-architecture.md:3:> Compagnon technique à `SPEC.md`. Détaille l'architecture logicielle, les contrats d'API client, les tokens SCSS et le mécanisme anti-FOUC sous Nuxt 4 SSG.
docs/specs/spec-theme-light-dark/technical-architecture.md:7:## 1. Architecture des Tokens SCSS (`_root.scss`)
docs/specs/spec-theme-light-dark/technical-architecture.md:11:2. **Surcharge sur `[data-theme="light"]` :** Réaffecte les alias sémantiques aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md`.
docs/specs/spec-theme-light-dark/technical-architecture.md:12:3. **Exception sanctuarisée :** Les sélecteurs du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: #2e0024`, `--text-strong: #f5f3f0`, `--text-body: #c3bdb7`), assurant l'immunité au thème clair.
docs/specs/spec-theme-light-dark/technical-architecture.md:24:  --bg-terminal: var(--aubergine-deep);
docs/specs/spec-theme-light-dark/technical-architecture.md:32:// Surcharge Thème Clair
docs/specs/spec-theme-light-dark/technical-architecture.md:33:[data-theme="light"] {
docs/specs/spec-theme-light-dark/technical-architecture.md:49:  --accent: hsl(24deg 95% 44%);         // #DA5207 contraste AA > 4.5:1 sur fond clair
docs/specs/spec-theme-light-dark/technical-architecture.md:61:- Il lit `localStorage.getItem('jouan_theme_mode')` et évalue `window.matchMedia('(prefers-color-scheme: dark)')`.
docs/specs/spec-theme-light-dark/technical-architecture.md:62:- Il applique immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant tout affichage graphique.
docs/specs/spec-theme-light-dark/technical-architecture.md:68:    var stored = localStorage.getItem('jouan_theme_mode') || 'system';
docs/specs/spec-theme-light-dark/technical-architecture.md:69:    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
docs/specs/spec-theme-light-dark/technical-architecture.md:70:    var resolved = isDark ? 'dark' : 'light';
docs/specs/spec-theme-light-dark/technical-architecture.md:71:    document.documentElement.setAttribute('data-theme', resolved);
docs/specs/spec-theme-light-dark/technical-architecture.md:72:    document.documentElement.setAttribute('data-theme-source', stored);
docs/specs/spec-theme-light-dark/technical-architecture.md:74:    document.documentElement.setAttribute('data-theme', 'dark');
docs/specs/spec-theme-light-dark/technical-architecture.md:81:## 3. Composable `useTheme()` (`app/composables/useTheme.ts`)
docs/specs/spec-theme-light-dark/technical-architecture.md:86:export type ThemePreference = 'system' | 'dark' | 'light';
docs/specs/spec-theme-light-dark/technical-architecture.md:87:export type ResolvedTheme = 'dark' | 'light';
docs/specs/spec-theme-light-dark/technical-architecture.md:89:export const useTheme = () => {
docs/specs/spec-theme-light-dark/technical-architecture.md:90:  const preference = useState<ThemePreference>('theme-preference', () => 'system');
docs/specs/spec-theme-light-dark/technical-architecture.md:91:  const resolved = useState<ResolvedTheme>('theme-resolved', () => 'dark');
docs/specs/spec-theme-light-dark/technical-architecture.md:94:  const initTheme = () => { /* synchronisation avec localStorage et matchMedia */ };
docs/specs/spec-theme-light-dark/technical-architecture.md:96:  // Cycle ternaire : system -> dark -> light -> system
docs/specs/spec-theme-light-dark/technical-architecture.md:97:  const cycleTheme = () => {
docs/specs/spec-theme-light-dark/technical-architecture.md:98:    const next: Record<ThemePreference, ThemePreference> = {
docs/specs/spec-theme-light-dark/technical-architecture.md:99:      system: 'dark',
docs/specs/spec-theme-light-dark/technical-architecture.md:100:      dark: 'light',
docs/specs/spec-theme-light-dark/technical-architecture.md:101:      light: 'system',
docs/specs/spec-theme-light-dark/technical-architecture.md:103:    setTheme(next[preference.value]);
docs/specs/spec-theme-light-dark/technical-architecture.md:106:  const setTheme = (pref: ThemePreference) => {
docs/specs/spec-theme-light-dark/technical-architecture.md:108:    // Mise à jour localStorage + DOM data-theme
docs/specs/spec-theme-light-dark/technical-architecture.md:111:  return { preference, resolved, cycleTheme, setTheme, initTheme };
docs/specs/spec-theme-light-dark/technical-architecture.md:117:## 4. Intégration du Composant `ThemeToggle.vue`
docs/specs/spec-theme-light-dark/technical-architecture.md:119:- **Composant UI :** `app/components/ui/ThemeToggle.vue`
docs/specs/spec-theme-light-dark/technical-architecture.md:126:  - `sun` : Cercle central avec 8 rayons géométriques (mode clair).
docs/project-context.md:24:- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
docs/project-context.md:26:- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
docs/project-context.md:31:- **Divers :** `ua-parser-js ^2` (détection device, terminal).
docs/project-context.md:40:  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
docs/project-context.md:70:  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
docs/project-context.md:71:  ne pas réactiver sans surcharge (sinon styles inline par token écrasant le DS).
docs/project-context.md:82:- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
docs/project-context.md:83:  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
docs/project-context.md:87:  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
docs/project-context.md:96:  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
docs/project-context.md:97:  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
docs/project-context.md:116:  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>` (supportant le 3D tilt via prop `tilt`).
docs/project-context.md:119:  `HomeBootOverlay.vue` (boot interactif jouan.os), `HomeHeroTerminal.vue` (terminal Hero à frappe dynamique)
docs/project-context.md:123:- Sous-système terminal sous `components/terminal/` : coquilles Vue
docs/project-context.md:124:  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
docs/project-context.md:127:- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
docs/project-context.md:132:- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
docs/project-context.md:137:  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
docs/project-context.md:139:  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_
docs/project-context.md:192:  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
docs/project-context.md:193:- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
docs/project-context.md:194:  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
docs/project-context.md:197:  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
docs/project-context.md:219:  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
docs/project-context.md:220:  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
docs/project-context.md:221:  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
docs/project-context.md:226:- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
docs/project-context.md:228:- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/project-context.md:231:  terminal.
docs/project-context.md:264:    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
docs/specs/spec-theme-light-dark/SPEC.md:2:id: SPEC-theme-light-dark
docs/specs/spec-theme-light-dark/SPEC.md:12:# Thème Light & Dark (jouan.ovh)
docs/specs/spec-theme-light-dark/SPEC.md:16:Le site actuel est conçu exclusivement en thème sombre aubergine, ce qui limite le confort de lecture pour les visiteurs consultant le portfolio en environnement à forte luminosité (en extérieur, sur écran non traité ou selon leur habitude système). L'ajout d'un thème clair « Papier technique / Crème solaire » tout en préservant le terminal sombre résout cette gêne visuelle, renforce l'accessibilité globale et offre aux visiteurs un contrôle complet (synchronisation avec leur OS ou forçage manuel persistant).
docs/specs/spec-theme-light-dark/SPEC.md:21:  intent: Le visiteur peut consulter l'intégralité du site dans une palette claire « Papier technique » contrastée et lisible sans dénaturer l'identité de marque ni modifier l'apparence sombre des terminaux.
docs/specs/spec-theme-light-dark/SPEC.md:22:  success: L'application de `data-theme="light"` permute l'ensemble des arrière-plans (`#FAF8F4`), bordures et textes aubergine profonde (`#271524`, contraste > 8:1) sur toutes les routes statiques, tandis que le Terminal Hero et les fenêtres flottantes conservent leur fond sombre (`#2E0024`) et leurs couleurs syntaxiques d'origine.
docs/specs/spec-theme-light-dark/SPEC.md:26:  success: En absence de clé locale, le basculement de `prefers-color-scheme` entre sombre et clair dans le système (ou l'émulation DevTools) adapte immédiatement le thème sans rafraîchissement ni interruption de lecture.
docs/specs/spec-theme-light-dark/SPEC.md:29:  intent: L'utilisateur peut surcharger manuellement le thème de son choix et conserver ce paramètre lors de ses visites ultérieures sur le même terminal.
docs/specs/spec-theme-light-dark/SPEC.md:30:  success: La sélection d'un thème forcé (`dark` ou `light`) s'enregistre dans le `localStorage` du navigateur sous la clé `jouan_theme_mode` et est restaurée fidèlement lors des rechargements et navigations futures.
docs/specs/spec-theme-light-dark/SPEC.md:33:  intent: L'utilisateur dispose dans le Header d'une commande compacte positionnée immédiatement à gauche du statut « Disponible » permettant de faire défiler les états Système, Sombre et Clair.
docs/specs/spec-theme-light-dark/SPEC.md:34:  success: Un bouton d'action placé dans le dock d'état du header (`.hdr__dock-right`) et dans le tiroir mobile avance cycliquement dans l'ordre `Système → Sombre → Clair → Système`, affiche l'icône vectorielle correspondante (`monitor` / `moon` / `sun`), et met à jour son `aria-label` descriptif sans aucun emoji textuel.
docs/specs/spec-theme-light-dark/SPEC.md:38:  success: Un script inline synchrone injecté dans le `<head>` du document HTML résout et applique `data-theme` sur l'élément racine avant le premier paint du navigateur, sans provoquer de décalage de mise en page ni de flash FOUC.
docs/specs/spec-theme-light-dark/SPEC.md:41:  intent: La sélection du thème et la navigation en mode clair sont pleinement utilisables au clavier, intelligibles pour les lecteurs d'écran et visibles en mode contraste élevé système.
docs/specs/spec-theme-light-dark/SPEC.md:42:  success: Le bouton est manipulable par `Tab`, `Entrée` et `Espace`, expose un indicateur de focus distinct (`--ring-accent`), supporte le mode Windows High Contrast via `forced-colors`, et tous les textes du thème clair valident le seuil de contraste WCAG AA (> 4.5:1).
docs/specs/spec-theme-light-dark/SPEC.md:48:- **Sanctuarisation du Terminal :** Le Terminal Hero et le composant `TerminalComponent` conservent impérativement leur fond sombre aubergine (`#2E0024`) et leur rendu CLI dans les deux thèmes.
docs/specs/spec-theme-light-dark/SPEC.md:50:- **DRY & Pas de tokens hardcodés :** Toutes les couleurs et élévations sont exposées via les variables CSS sémantiques de `_root.scss`.
docs/specs/spec-theme-light-dark/SPEC.md:56:- Ne pas convertir l'interface interne du terminal en thème clair.
docs/specs/spec-theme-light-dark/SPEC.md:61:Sur n'importe quelle page de `jouan.ovh`, un utilisateur clique sur la commande située à gauche de « Disponible » : l'interface bascule instantanément entre les modes Système, Sombre et Clair avec une palette crème « Papier technique » contrastée WCAG AA/AAA, le choix persiste au rechargement de page sans flash FOUC, et la suite de vérification Docker (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur sur l'ensemble des 13 routes statiques.
docs/planning-artifacts/epics.md:21:  - docs/specs/spec-theme-light-dark/SPEC.md
docs/planning-artifacts/epics.md:22:  - docs/specs/spec-theme-light-dark/technical-architecture.md
docs/planning-artifacts/epics.md:45:FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
docs/planning-artifacts/epics.md:48:FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md:52:FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
docs/planning-artifacts/epics.md:53:FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
docs/planning-artifacts/epics.md:55:FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/planning-artifacts/epics.md:65:FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md:76:FR29: Page d'accueil — Hero commercial cinétique & Terminal interactif (H1 « Automatisez les workflows qui freinent votre équipe », sous-titre d'intégration de systèmes, CTAs vers workflow, commandes terminal `whoami`, `cat focus.txt`, `ls ~/systems`). _(CAP-2)_
docs/planning-artifacts/epics.md:83:FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_
docs/planning-artifacts/epics.md:85:#### Epic 13 — Thème Light & Dark (SPEC-theme-light-dark)
docs/planning-artifacts/epics.md:86:FR37: Palette de thèmes et tokens sémantiques complets (mode sombre aubergine par défaut et mode clair « Papier technique / Crème solaire », sanctuarisation du terminal sombre, contrastes WCAG AAA/AA). _(CAP-1)_
docs/planning-artifacts/epics.md:88:FR39: Surcharge utilisateur et persistance locale sous `localStorage` (`jouan_theme_mode`) conservant le choix d'une visite à l'autre. _(CAP-3)_
docs/planning-artifacts/epics.md:89:FR40: Composant de bascule ternaire `ThemeToggle` dans le Header desktop (`hdr__dock-right` à gauche de « Disponible ») et dans le tiroir mobile, avec cycle `Système → Sombre → Clair → Système`, icônes vectorielles et 0 emoji. _(CAP-4)_
docs/planning-artifacts/epics.md:96:FR45: Bandeau / toast de consentement RGPD sobre inspiré du terminal (`// telemetry:`), opt-in explicite, persistance locale et lien de révocation permanent au footer. _(CAP-4)_
docs/planning-artifacts/epics.md:97:FR46: Plan de taggage exhaustif des interactions métier (navigation, scroll depth, clics CTA offres IA, formulaire contact Web3Forms, terminal interactif, blog, liens externes). _(CAP-3)_
docs/planning-artifacts/epics.md:103:NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
docs/planning-artifacts/epics.md:104:NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
docs/planning-artifacts/epics.md:111:NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
docs/planning-artifacts/epics.md:121:NFR19: Sanctuarisation absolue du terminal (Terminal Hero et fenêtres flottantes conservent impérativement leur fond sombre aubergine `#2E0024` et leurs couleurs syntaxiques).
docs/planning-artifacts/epics.md:134:- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.
docs/planning-artifacts/epics.md:138:UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
docs/planning-artifacts/epics.md:139:UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
docs/planning-artifacts/epics.md:145:UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
docs/planning-artifacts/epics.md:146:UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
docs/planning-artifacts/epics.md:149:UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
docs/planning-artifacts/epics.md:153:UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/planning-artifacts/epics.md:157:UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
docs/planning-artifacts/epics.md:159:UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
docs/planning-artifacts/epics.md:165:UX-DR30: Grille tarifaire transparente sur `/services` dissociant honoraires forfaitaires et coûts variables d'APIs/tokens tiers.
docs/planning-artifacts/epics.md:167:UX-DR32: Implémentation de la palette de tokens clairs `--surface-*-light` (fond crème `#FAF8F4`, cartes blanches `#FFFFFF`, encres aubergine `#271524` et `#473644`, orange contrasté `#D94F00`).
docs/planning-artifacts/epics.md:168:UX-DR33: Composant `ThemeToggle.vue` compact (36x36px desktop, 40x40px mobile), 3 icônes vectorielles inline (`monitor`, `moon`, `sun`) déclarées dans `ZIcon.vue`, animations d'icônes débrayées sous `prefers-reduced-motion`.
docs/planning-artifacts/epics.md:175:FR2: Epic 2 — Tokens du design system disponibles
docs/planning-artifacts/epics.md:178:FR5: Epic 3 — Page d'accueil (hero Terminal A)
docs/planning-artifacts/epics.md:183:FR10: Epic 8 — Terminal easter-egg restylé
docs/planning-artifacts/epics.md:193:FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md:202:FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
docs/planning-artifacts/epics.md:209:FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
docs/planning-artifacts/epics.md:210:FR37: Epic 13 — Palette de thèmes et tokens sémantiques complets (mode clair crème, terminal sombre)
docs/planning-artifacts/epics.md:213:FR40: Epic 13 — Bouton de bascule ternaire ThemeToggle dans le Header (desktop et mobile)
docs/planning-artifacts/epics.md:218:FR45: Epic 14 — Toast de consentement RGPD inspiré du terminal et gestion des cookies
docs/planning-artifacts/epics.md:219:FR46: Epic 14 — Plan de taggage exhaustif (parcours IA, formulaire, terminal, blog, liens)
docs/planning-artifacts/epics.md:230:Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
docs/planning-artifacts/epics.md:234:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
docs/planning-artifacts/epics.md:250:Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
docs/planning-artifacts/epics.md:253:### Epic 8: Terminal easter-egg restylé
docs/planning-artifacts/epics.md:254:L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
docs/planning-artifacts/epics.md:270:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md:273:### Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md:274:Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
docs/planning-artifacts/epics.md:278:Le visiteur bénéficie d'un contrôle transparent sur sa vie privée via un toast de consentement sobre inspiré du terminal, tandis que Simon Jouan dispose d'une observabilité complète sur l'audience, la restitution de parcours (Session Replay sécurisé) et les conversions de l'offre IA, soutenue par l'indexation organique certifiée par Google Search Console (`sitemap.xml`, `robots.txt` et DNS OVH).
docs/planning-artifacts/epics.md:293:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:306:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:319:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:332:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:345:### Story 2.1: Porter les tokens du design system
docs/planning-artifacts/epics.md:348:I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
docs/planning-artifacts/epics.md:351:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:353:**Given** les tokens dans `docs/design_system/tokens/*.css`
docs/planning-artifacts/epics.md:358:### Story 2.2: Polices et base dark-first
docs/planning-artifacts/epics.md:364:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:367:**When** on configure `@font-face`/import et le reset/base dark-first
docs/planning-artifacts/epics.md:369:**And** le fond par défaut est sombre (aucun thème clair) et lisible
docs/planning-artifacts/epics.md:377:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:381:**Then** les variantes (primary orange, dark) et tailles rendent conformément à la référence
docs/planning-artifacts/epics.md:382:**And** les états hover/press/focus suivent les tokens (orange → hover/active, nudge press)
docs/planning-artifacts/epics.md:390:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:403:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:407:**Then** ils rendent conformément aux références et stylent via tokens
docs/planning-artifacts/epics.md:415:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:419:**Then** ils rendent conformément aux références et stylent via tokens
docs/planning-artifacts/epics.md:427:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:440:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:444:**Then** ils rendent conformément au UI kit, dark-first et responsive mobile
docs/planning-artifacts/epics.md:451:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.
docs/planning-artifacts/epics.md:453:### Story 3.1: Hero Terminal (A)
docs/planning-artifacts/epics.md:456:I want un hero d'accueil en style terminal,
docs/planning-artifacts/epics.md:459:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:461:**Given** la direction de hero Terminal (A) de `Home.jsx`
docs/planning-artifacts/epics.md:463:**Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne)
docs/planning-artifacts/epics.md:472:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:485:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:503:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:516:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:534:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:546:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:565:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:578:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:582:**Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS
docs/planning-artifacts/epics.md:596:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:603:### Story 7.2: Infos, CTA terminal et socials
docs/planning-artifacts/epics.md:609:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:612:**When** on implémente la carte infos, le CTA terminal et les liens sociaux hexagonaux
docs/planning-artifacts/epics.md:614:**And** le CTA terminal ouvre l'easter-egg terminal
docs/planning-artifacts/epics.md:618:## Epic 8: Terminal easter-egg restylé
docs/planning-artifacts/epics.md:620:L'easter-egg terminal fonctionne et adopte le style du DS.
docs/planning-artifacts/epics.md:622:### Story 8.1: Style TerminalWindow et Prompt
docs/planning-artifacts/epics.md:625:I want un terminal au style de la marque,
docs/planning-artifacts/epics.md:628:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:630:**Given** `components/terminal/` existant et les références `TerminalWindow.jsx`/`Prompt.jsx`
docs/planning-artifacts/epics.md:632:**Then** le terminal rend conformément au DS
docs/planning-artifacts/epics.md:638:I want que toutes les commandes du terminal marchent,
docs/planning-artifacts/epics.md:641:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:643:**Given** le sous-système terminal restylé
docs/planning-artifacts/epics.md:646:**And** le terminal reste draggable
docs/planning-artifacts/epics.md:648:### Story 8.3: Migrer les composants terminal vers `<script setup>`
docs/planning-artifacts/epics.md:650:_(Ajoutée après la rétro Epic 7 — décision Simon : Epic 8 = refonte **complète** du terminal, pas seulement un restyle.)_
docs/planning-artifacts/epics.md:653:I want que le sous-système terminal soit en `<script setup>` (plus d'Options API),
docs/planning-artifacts/epics.md:656:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:658:**Given** `TerminalComponent.vue` / `TerminalManagerComponent.vue` en Options API
docs/planning-artifacts/epics.md:660:**Then** plus aucune Options API dans le sous-système terminal, et commandes / drag / resize / ouverture (header + `/contact`) sans régression
docs/planning-artifacts/epics.md:672:I want des états visuels clairs sur les éléments interactifs,
docs/planning-artifacts/epics.md:675:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:688:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:709:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:722:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:725:**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
docs/planning-artifacts/epics.md:735:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:748:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:752:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/planning-artifacts/epics.md:761:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:774:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:787:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:792:**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
docs/planning-artifacts/epics.md:806:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:817:I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
docs/planning-artifacts/epics.md:820:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:824:**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
docs/planning-artifacts/epics.md:837:So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).
docs/planning-artifacts/epics.md:839:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:844:**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
docs/planning-artifacts/epics.md:854:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:873:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:886:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:904:Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md:912:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:925:### Story 12.2: Page d'accueil — Hero commercial cinétique & Terminal interactif
docs/planning-artifacts/epics.md:928:I want lire immédiatement une promesse orientée vers la résolution de mes irritants métier et voir un terminal interactif cohérent,
docs/planning-artifacts/epics.md:931:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:933:**Given** la page d'accueil `app/pages/index.vue` et le composant `HomeHeroTerminal.vue`
docs/planning-artifacts/epics.md:935:**Then** le hero affiche en typographie Ubuntu et SCSS tokens :
docs/planning-artifacts/epics.md:943:**And** la séquence de frappe du terminal hero exécute les nouvelles commandes :
docs/planning-artifacts/epics.md:955:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:977:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:982:  - **Keova Signal** : statut `● Système interne / En développement actif`, accroche `Détecter le bon prospect au bon moment`, description courte (Open Data Sirene, Token Bucket, scraping éthique, double étage de scoring Zod, serveur MCP 10 outils), tags (`Node.js 22` · `TypeScript` · `MCP Server` · `PostgreSQL` · `Cheerio` · `Docker`), capture réelle HD `keova-signal-dashboard.png` (via `<NuxtImg>`), badge `Projet interne / Dépôt privé` sans lien externe mort
docs/planning-artifacts/epics.md:991:I want consulter le déroulement type d'une mission et des tarifs forfaitaires clairs,
docs/planning-artifacts/epics.md:994:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1004:  3. **AI Care** : `À partir de 490 € HT / mois`. Maintien en condition opérationnelle (monitoring, maintenance, support, veille coûts et modèles), avec exclusion explicite des consommations tierces d'APIs/tokens refacturées au réel.
docs/planning-artifacts/epics.md:1019:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1037:## Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md:1039:Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
docs/planning-artifacts/epics.md:1041:### Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal
docs/planning-artifacts/epics.md:1043:As a visiteur préférant un environnement d'affichage clair,
docs/planning-artifacts/epics.md:1044:I want que les variables CSS du design system exposent une palette claire « Papier technique / Crème solaire » tout en préservant le terminal sombre,
docs/planning-artifacts/epics.md:1047:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1050:**When** on déclare le sélecteur `[data-theme="light"]`
docs/planning-artifacts/epics.md:1061:**And** l'accent orange est adapté au contraste sur fond clair (`--accent: hsl(24deg 95% 44%)`, `#DA5207`, ratio AA > 4.5:1)
docs/planning-artifacts/epics.md:1062:**And** les conteneurs de terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: var(--aubergine-deep)`, `#2E0024`) et leurs couleurs de texte clair, restant insensibles au mode clair global
docs/planning-artifacts/epics.md:1065:### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC
docs/planning-artifacts/epics.md:1071:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1075:**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
docs/planning-artifacts/epics.md:1076:**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
docs/planning-artifacts/epics.md:1077:**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/planning-artifacts/epics.md:1078:**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
docs/planning-artifacts/epics.md:1081:### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile
docs/planning-artifacts/epics.md:1085:So that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).
docs/planning-artifacts/epics.md:1087:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1092:**And** le composant `app/components/ui/ThemeToggle.vue` est créé :
docs/planning-artifacts/epics.md:1094:  - Clic / activation clavier cycle l'état : `system → dark → light → system`
docs/planning-artifacts/epics.md:1106:I want vérifier le rendu esthétique des pages sous le thème clair et exécuter la gate Docker complète,
docs/planning-artifacts/epics.md:1109:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1112:**When** on bascule le thème sur `light`
docs/planning-artifacts/epics.md:1117:  - Le Terminal Hero et le terminal flottant demeurent en mode sombre permanent avec leur prompt vert
docs/planning-artifacts/epics.md:1129:Simon Jouan dispose d'un suivi précis et respectueux du trafic, du comportement des visiteurs (Session Replay masqué) et de la conversion de l'offre commerciale IA, tout en garantissant une conformité RGPD exemplaire (toast de consentement terminal) et une indexation certifiée par Google Search Console (`sitemap.xml`, `robots.txt`, vérification DNS).
docs/planning-artifacts/epics.md:1131:### Story 14.1: Fondations PostHog EU, Composable de Consentement & Toast Cookie Terminal
docs/planning-artifacts/epics.md:1134:I want être informé sobrement de la télémétrie de navigation et pouvoir accepter ou refuser les cookies/analytics via une invite terminal non intrusive,
docs/planning-artifacts/epics.md:1137:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1150:  - Préfixe stylisé terminal `// telemetry:`
docs/planning-artifacts/epics.md:1163:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1185:**Acceptance Criteria:**
docs/planning-artifacts/epics.md:1194:  5. *Terminal :* `terminal_window_opened`, `terminal_window_closed`, `terminal_command_executed`, `terminal_invalid_command`
docs/planning-artifacts/epics.md:1204:**Acceptance Criteria:**

exec
/bin/zsh -lc "git diff --no-index /dev/null docs/implementation-artifacts/code-reviews/13-1/full.diff >/dev/null 2>&1; wc -l docs/implementation-artifacts/code-reviews/13-1/full.diff; sed -n '1,220p' docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     153 docs/implementation-artifacts/code-reviews/13-1/full.diff
---
baseline_commit: f077f9b563bcef69bc61b9f28913f6db071e8b36
---

# Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur préférant un environnement d'affichage clair,
I want que les variables CSS du design system exposent une palette claire « Papier technique / Crème solaire » tout en préservant le terminal sombre,
so that l'application s'adapte sans rupture de style ni dénaturation de l'immersion CLI (FR37, UX-DR32, NFR17, NFR19, CAP-1).

## Acceptance Criteria

1. **Given** le fichier `app/assets/scss/abstract/_root.scss`
   **When** on inspecte les règles de style globales du projet
   **Then** un bloc de surcharge dédié `[data-theme="light"]` est déclaré à la suite des tokens racine `:root`
   **And** ce bloc redéfinit les alias sémantiques de surfaces avec la palette « Papier technique / Crème solaire » :
     - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4` — fond de page principal crème chaleureux)
     - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6` — sections en creux)
     - `--bg-card: hsl(0deg 0% 100%)` (`#FFFFFF` — cartes de contenu blanches nettes)
     - `--bg-elevated: hsl(38deg 30% 99%)` (`#FFFEFB` — survol et popovers)
     - `--bg-input: hsl(38deg 15% 95%)` (`#F5F3EE` — champs et conteneurs secondaires)
   **And** les alias sémantiques de bordures sont adaptés aux teintes chaudes :
     - `--border-subtle: hsl(35deg 15% 88%)` (`#E6E2DC`)
     - `--border-default: hsl(35deg 12% 80%)` (`#D1CCC4`)
     - `--border-strong: hsl(35deg 12% 68%)` (`#B3ABA2`)
   **And** les ombres sont réétalonnées pour un fond clair :
     - `--shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%)`
     - `--shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%)`
     - `--shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%)`
     - `--shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%)`
   **And** les tokens d'accent et de sélection sont ajustés :
     - `--accent: hsl(24deg 95% 44%)` (`#DA5207` — contraste AA > 4.5:1 garanti sur fond blanc/crème)
     - `--accent-soft: hsl(24deg 94% 53% / 10%)`
     - `--accent-ring: hsl(24deg 94% 53% / 35%)`
     - `--selection: hsl(24deg 94% 53% / 22%)`
     - `--overlay: hsl(320deg 30% 10% / 40%)`.

2. **Given** les alias sémantiques d'encre (typographie) en mode clair
   **When** le thème `[data-theme="light"]` est appliqué
   **Then** les variables de texte adoptent la gamme aubergine profonde garantissant un confort et une conformité WCAG :
     - `--text-strong: hsl(320deg 30% 12%)` (`#271524` — ratio de contraste > 14:1 sur fond crème, conforme WCAG AAA)
     - `--text-body: hsl(320deg 18% 26%)` (`#473644` — ratio de contraste > 8:1 sur fond crème, conforme WCAG AAA)
     - `--text-muted: hsl(320deg 10% 44%)` (`#756773` — ratio de contraste > 4.5:1 sur fond crème, conforme WCAG AA)
     - `--text-faint: hsl(320deg 8% 58%)` (`#988D96` — réservé aux éléments secondaires désactivés)
     - `--ink-on-accent: hsl(0deg 0% 100%)` (`#FFFFFF` sur les boutons à fond plein).

3. **Given** les conteneurs et fenêtres d'émulation terminal (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`)
   **When** le document HTML porte l'attribut `data-theme="light"`
   **Then** les règles d'isolation sanctuarisent le terminal :
     - Le fond reste sombre : `--bg-terminal: var(--aubergine-deep)` (`hsl(319deg 100% 9%)` / `#2E0024`)
     - Les textes restent clairs : `--text-strong: var(--ink-1)` (`hsl(30deg 18% 95%)`), `--text-body: var(--ink-2)` (`hsl(28deg 10% 74%)`)
     - Les couleurs de syntaxe (`--term-green`, `--term-blue`, etc.) et le prompt vert clignotant restent inchangés
     - Aucune décoloration ni inversion involontaire ne se produit à l'intérieur du Terminal Hero ou de la console draggable.

4. **Given** la suite d'outillage et les standards de code du projet
   **When** on exécute la vérification dans Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint"` s'exécute avec 0 erreur ESLint et 0 erreur Stylelint
   **And** la syntaxe HSL avec degrés (`deg`) et pourcentages respecte scrupuleusement la configuration `.stylelintrc.json`.

## Tasks / Subtasks

- [x] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
  - [x] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
  - [x] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
  - [x] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
  - [x] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).

- [x] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
  - [x] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
  - [x] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-default`, `--border-terminal`).
  - [x] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.

- [x] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.

## Dev Notes

### Architecture des Tokens SCSS & Emplacement des fichiers
- **Fichier principal à modifier :** `app/assets/scss/abstract/_root.scss`
- **Fichiers de référence :**
  - Spécification visuelle : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
  - Architecture technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Invariants critiques à respecter
- **Environnement Docker obligatoire :** Ne jamais lancer `pnpm` sur la machine hôte. Toute commande s'exécute via :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint"
  ```
- **Zéro Emoji :** Aucun caractère emoji dans les commentaires de code ou les styles.
- **Règle d'or Stylelint :** Le projet utilise la notation standard CSS Color Module Level 4 pour HSL : `hsl(38deg 25% 97%)` et pour l'alpha `hsl(24deg 94% 53% / 10%)`. Ne pas utiliser de virgules dans les déclarations HSL (`hsl(38, 25%, 97%)` est rejeté par Stylelint).

### Code Snippet de référence pour `_root.scss`

```scss
// ============================================================
//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
// ============================================================
[data-theme="light"] {
  // Surfaces claires
  --bg-page: hsl(38deg 25% 97%);
  --bg-sunken: hsl(38deg 20% 93%);
  --bg-card: hsl(0deg 0% 100%);
  --bg-elevated: hsl(38deg 30% 99%);
  --bg-input: hsl(38deg 15% 95%);

  // Encres aubergine (contrastes WCAG AAA)
  --text-strong: hsl(320deg 30% 12%);
  --text-body: hsl(320deg 18% 26%);
  --text-muted: hsl(320deg 10% 44%);
  --text-faint: hsl(320deg 8% 58%);
  --ink-on-accent: hsl(0deg 0% 100%);

  // Bordures douces
  --border-subtle: hsl(35deg 15% 88%);
  --border-default: hsl(35deg 12% 80%);
  --border-strong: hsl(35deg 12% 68%);

  // Accent & sélections
  --accent: hsl(24deg 95% 44%);
  --accent-soft: hsl(24deg 94% 53% / 10%);
  --accent-ring: hsl(24deg 94% 53% / 35%);
  --selection: hsl(24deg 94% 53% / 22%);
  --overlay: hsl(320deg 30% 10% / 40%);

  // Ombres adaptées
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
}

// Sanctuarisation absolue du terminal sombre
.home-hero-terminal,
.hero-term,
.terminal-window,
.terminal {
  --bg-terminal: hsl(319deg 100% 9%);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-terminal: hsl(319deg 40% 30% / 40%);
}
```

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash (Medium)

### Debug Log References

- Validation Gate Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
- 0 erreur ESLint, 0 erreur Stylelint.
- 24 routes SSG pré-rendues sans anomalie.

### Completion Notes List

- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
- Redéfinition des alias sémantiques de surfaces (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`), encres aubergine WCAG AAA (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`, `--ink-on-accent`), bordures chaudes, ombres et accents orange contrastés.
- Sanctuarisation stricte des composants terminaux (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`) avec préservation du fond sombre, encres claires et bordures terminales.

### File List
- `app/assets/scss/abstract/_root.scss`

exec
/bin/zsh -lc "sed -n '1,300p' docs/specs/spec-theme-light-dark/technical-architecture.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Technical Architecture — Thème Light & Dark

> Compagnon technique à `SPEC.md`. Détaille l'architecture logicielle, les contrats d'API client, les tokens SCSS et le mécanisme anti-FOUC sous Nuxt 4 SSG.

---

## 1. Architecture des Tokens SCSS (`_root.scss`)

Le design system repose sur une cascade de variables CSS :
1. **Défaut sur `:root` :** Conserve la palette sombre actuelle comme socle de base (`--surface-0`, `--ink-1`, etc.).
2. **Surcharge sur `[data-theme="light"]` :** Réaffecte les alias sémantiques aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md`.
3. **Exception sanctuarisée :** Les sélecteurs du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: #2e0024`, `--text-strong: #f5f3f0`, `--text-body: #c3bdb7`), assurant l'immunité au thème clair.

```scss
// app/assets/scss/abstract/_root.scss

:root {
  // Base sombre (existante)...
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
}

// Surcharge Thème Clair
[data-theme="light"] {
  --bg-page: hsl(38deg 25% 97%);        // #FAF8F4 crème solaire
  --bg-sunken: hsl(38deg 20% 93%);      // #F1EDE6
  --bg-card: hsl(0deg 0% 100%);         // #FFFFFF cartes blanches
  --bg-elevated: hsl(38deg 30% 99%);    // #FFFEFB
  --bg-input: hsl(38deg 15% 95%);       // #F5F3EE
  
  --text-strong: hsl(320deg 30% 12%);   // #271524 titres aubergine sombre
  --text-body: hsl(320deg 18% 26%);     // #473644 corps de texte
  --text-muted: hsl(320deg 10% 44%);    // #756773 légendes
  --text-faint: hsl(320deg 8% 58%);     // #988D96 désactivé
  
  --border-subtle: hsl(35deg 15% 88%);  // #E6E2DC
  --border-default: hsl(35deg 12% 80%); // #D1CCC4
  --border-strong: hsl(35deg 12% 68%);  // #B3ABA2
  
  --accent: hsl(24deg 95% 44%);         // #DA5207 contraste AA > 4.5:1 sur fond clair
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
}
```

---

## 2. Script Inline Anti-FOUC (`nuxt.config.ts`)

Pour éviter tout flash noir/blanc lors du premier rendu statique sur GitHub Pages :
- Un micro-script synchrone auto-exécuté est inséré tout en haut du `<head>` via `app.head.script`.
- Il lit `localStorage.getItem('jouan_theme_mode')` et évalue `window.matchMedia('(prefers-color-scheme: dark)')`.
- Il applique immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant tout affichage graphique.

```javascript
// Injection anti-FOUC (exécutée avant le premier rendu du navigateur)
(function() {
  try {
    var stored = localStorage.getItem('jouan_theme_mode') || 'system';
    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var resolved = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-source', stored);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
```

---

## 3. Composable `useTheme()` (`app/composables/useTheme.ts`)

Source unique de vérité pour la réactivité du thème dans Vue :

```typescript
export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

export const useTheme = () => {
  const preference = useState<ThemePreference>('theme-preference', () => 'system');
  const resolved = useState<ResolvedTheme>('theme-resolved', () => 'dark');

  // Initialisation client
  const initTheme = () => { /* synchronisation avec localStorage et matchMedia */ };

  // Cycle ternaire : system -> dark -> light -> system
  const cycleTheme = () => {
    const next: Record<ThemePreference, ThemePreference> = {
      system: 'dark',
      dark: 'light',
      light: 'system',
    };
    setTheme(next[preference.value]);
  };

  const setTheme = (pref: ThemePreference) => {
    preference.value = pref;
    // Mise à jour localStorage + DOM data-theme
  };

  return { preference, resolved, cycleTheme, setTheme, initTheme };
};
```

---

## 4. Intégration du Composant `ThemeToggle.vue`

- **Composant UI :** `app/components/ui/ThemeToggle.vue`
- **Positionnement :**
  1. Desktop : dans `HeaderComponent.vue`, dans `.hdr__dock-right`, immédiatement devant `.hdr__status-badge`.
  2. Mobile : dans `HeaderComponent.vue`, dans `.hdr__menu-status`, en vis-à-vis du statut.
- **Iconographie :** 3 symboles vectoriels déclarés dans `ZIcon.vue` :
  - `monitor` : Écran épuré avec pied (mode système).
  - `moon` : Croissant de lune technique (mode sombre).
  - `sun` : Cercle central avec 8 rayons géométriques (mode clair).

exec
/bin/zsh -lc "sed -n '1,220p' docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: jouan.ovh
description: Systèmes IA & automatisation métier — Design System Thème Light & Dark
status: final
updated: 2026-09-18
colors:
  # Palette Dark (Fondations existantes)
  surface-0-dark: '#140b12'
  surface-1-dark: '#1c121a'
  surface-2-dark: '#241a22'
  surface-3-dark: '#2f232d'
  surface-4-dark: '#3d303b'
  ink-1-dark: '#f5f3f0'
  ink-2-dark: '#c3bdb7'
  ink-3-dark: '#8f8783'
  ink-4-dark: '#6b6460'
  line-subtle-dark: '#342832'
  line-dark: '#483945'
  line-strong-dark: '#63515f'

  # Palette Light (Option 1 — Papier technique / Crème solaire)
  surface-0-light: '#faf8f4'
  surface-1-light: '#f1ede6'
  surface-2-light: '#ffffff'
  surface-3-light: '#fffefb'
  surface-4-light: '#f5f3ee'
  ink-1-light: '#271524'
  ink-2-light: '#473644'
  ink-3-light: '#756773'
  ink-4-light: '#988d96'
  line-subtle-light: '#e6e2dc'
  line-light: '#d1ccc4'
  line-strong-light: '#b3aba2'

  # Sanctuarisation Terminal (Identique en Dark et Light)
  surface-terminal: '#2e0024'
  ink-terminal-prompt: '#45d677'
  ink-terminal-dir: '#56b6f7'
  ink-terminal-text: '#f5f3f0'

  # Brand Accents
  orange-500: '#fa6412'
  orange-light-contrast: '#d94f00'
  aubergine: '#663359'
  aubergine-light: '#b890b0'
typography:
  font-mono:
    fontFamily: '"Ubuntu Mono", "SF Mono", ui-monospace, monospace'
  font-sans:
    fontFamily: '"Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif'
  font-display:
    fontFamily: '"Ubuntu Mono", "SF Mono", ui-monospace, monospace'
rounded:
  sm: '5px'
  md: '8px'
  lg: '12px'
  full: '9999px'
spacing:
  1: '4px'
  2: '8px'
  3: '12px'
  4: '16px'
  6: '24px'
  8: '32px'
components:
  theme-toggle:
    height: '36px'
    width: '36px'
    border-radius: '{rounded.md}'
    border-width: '1px'
    icon-size: '16px'
---

# Design Specification — Thème Light & Dark (jouan.ovh)

## 1. Brand & Style

Le site **jouan.ovh** incarne le savoir-faire de Simon Jouan en tant que développeur Full Stack spécialisé en systèmes IA et automatisation métier. Son identité visuelle puise ses racines dans l'univers du terminal UNIX, la rigueur métrologique et l'héritage Ubuntu (orange vibrant et nuances aubergines).

L'introduction du mode clair ne renie aucunement cette âme :
- En lieu et place d'un blanc clinique éblouissant de laboratoire, le thème clair adopte la posture **« Papier technique / Crème solaire »** : une feuille de calcul industrielle, un carnet d'ingénieur ou une documentation d'architecture imprimée sur un papier ivoire chaud (`{colors.surface-0-light}`).
- Les éléments de typographie conservent leur ascendance aubergine profonde (`{colors.ink-1-light}` et `{colors.ink-2-light}`), offrant une lisibilité veloutée et hautement contrastée sans jamais être agressive.
- **Sanctuarisation terminal :** Les composants à vocation purement CLI (le Terminal Hero et les fenêtres flottantes `TerminalComponent`) restent **impérativement sombres** (`{colors.surface-terminal}`). Ils agissent comme des îlots d'exécution système authentiques, tranchant avec élégance sur la clarté du document.

---

## 2. Colors

### 2.1 Philosophie et Palette en mode Clair

| Rôle de Token | Valeur HSL / Hex | Usage & Intention |
|---|---|---|
| `--surface-0` (Page) | `hsl(38 25% 97%)` / `#FAF8F4` | Fond principal de l'application. Ton sable/lin très doux, reposant pour les yeux en environnement lumineux. |
| `--surface-1` (Sunken) | `hsl(38 20% 93%)` / `#F1EDE6` | Sections en creux (ex. grilles de process, citations, arrière-plans de tableaux). |
| `--surface-2` (Card) | `#FFFFFF` | Cartes de contenu (services, projets phares, compétences). Blanc franc pour détacher le contenu du fond crème. |
| `--surface-3` (Elevated) | `hsl(38 30% 99%)` / `#FFFEFB` | Survol de carte, menus déroulants, popovers. |
| `--surface-4` (Input) | `hsl(38 15% 95%)` / `#F5F3EE` | Champs de formulaire et conteneurs de boutons secondaires. |
| `--line-subtle` | `hsl(35 15% 88%)` / `#E6E2DC` | Séparateurs légers, délimitation des cartes blanches sur fond crème. |
| `--line` | `hsl(35 12% 80%)` / `#D1CCC4` | Bordure standard des cartes et inputs. |
| `--line-strong` | `hsl(35 12% 68%)` / `#B3ABA2` | Bordures actives, états de focus ou badges encadrés. |

### 2.2 Typographie et Lisibilité (Encres en mode Clair)

| Token d'encre | Valeur Hex | Ratio de contraste vs Surface-0 / Surface-2 |
|---|---|---|
| `--ink-1` (Titres) | `#271524` | **15.2:1** (dépasse largement le seuil WCAG AAA de 7:1). Aubergine presque noire. |
| `--ink-2` (Corps de texte) | `#473644` | **8.4:1** (seuil WCAG AAA validé). Ardoise aubergine profonde. |
| `--ink-3` (Muted / Légendes) | `#756773` | **4.9:1** (conforme WCAG AA > 4.5:1). |
| `--ink-4` (Faint / Désactivé) | `#988D96` | 3.1:1 (réservé aux placeholders et états désactivés). |

### 2.3 Accents et Terminal

- **Accent Orange en mode clair :** Afin de garantir un ratio de contraste supérieur à 4.5:1 pour les textes d'accroche et les liens sur fond clair, l'orange est subtilement réajusté à `{colors.orange-light-contrast}` (`#D94F00`, contraste 4.6:1). Pour les boutons pleins (`ZButton variant="primary"`), l'orange vif standard (`#FA6412`) est conservé avec du texte blanc `{colors.ink-1-dark}`.
- **Terminal sanctuarisé :** Les classes `.terminal`, `.home-hero-terminal` et les fenêtres CLI forcent explicitement les variables locales de surface à `--bg-terminal: #2e0024` et `--text-strong: #f5f3f0`, rendant le terminal insensible à l'inversion globale du thème.

---

## 3. Typography

Aucun changement de police ni d'échelle :
- Police principale d'interface : **Ubuntu** (`{typography.font-sans.fontFamily}`).
- Police de données, terminal et code : **Ubuntu Mono** (`{typography.font-mono.fontFamily}`).
- Échelle modulaire préservée (`--fs-xs` à `--fs-6xl`).

---

## 4. Layout & Spacing

Le composant de bascule de thème (`ThemeToggle`) s'intègre au système de grille du Header sans déformer la hauteur existante (`--header-height: 56px`) :
- **En Desktop :** Positionné dans `.hdr__dock-right`, immédiatement à gauche du badge `.hdr__status-badge` (« Disponible »).
- **Espacement :** Marge de séparation de `var(--space-3)` (12px) avec le badge d'état.
- **En Mobile :** Positionné dans `.hdr__menu-status`, à gauche ou en vis-à-vis direct du badge d'état.

---

## 5. Elevation & Depth

En mode sombre, la profondeur s'exprime par la lumière incidente et les bordures subtiles. En mode clair, la profondeur s'articule par des ombres portées douces et chaleureuses :

- `--shadow-1` (Light) : `0 1px 3px hsl(35deg 20% 40% / 8%)`
- `--shadow-2` (Light) : `0 3px 10px hsl(35deg 20% 40% / 10%)`
- `--shadow-3` (Light) : `0 8px 24px hsl(35deg 20% 40% / 12%)`
- `--shadow-hairline` (Light) : `inset 0 1px 0 hsl(0 0% 100% / 80%)` (rehaut supérieur blanc net)

---

## 6. Shapes

- Rayon standard du bouton toggle : `{rounded.md}` (8px), identique aux boutons compacts de l'écosystème `ZButton`.
- Rayon des cartes : `{rounded.md}` (8px) ou `{rounded.lg}` (12px) préservés.

---

## 7. Components — Le Bouton `ThemeToggle`

### 7.1 Anatomie
- Bouton interactif carré compact (`36px × 36px` en desktop, `40px × 40px` sur mobile pour satisfaire les cibles tactiles).
- Fond transparent ou teinté (`--surface-1` en repos, `--surface-3` en hover).
- Bordure fine `1px solid var(--border-subtle)`.
- Conteneur d'icône vectorielle SVG inline unique (`18px × 18px`).
- Aucune présence d'emoji textuel (respect de la règle NFR6 d'`AGENTS.md`).

### 7.2 États Visuels

| État du Thème | Icône affichée | Aspect Visuel |
|---|---|---|
| **Système (Auto)** | Moniteur / Terminal épuré (`monitor` ou `terminal-mini`) avec pastille discrète de synchronisation | Bordure subtile, icône encre atténuée. |
| **Sombre forcé** | Croissant de lune technique minimaliste (`moon`) | Accent aubergine lumineux ou blanc chaud. |
| **Clair forcé** | Soleil technique stylisé (`sun` à 8 rayons nets) | Accent ambre/orange doux. |

### 7.3 Micro-interactions
- **Hover :** Légère élévation (`translateY(-1px)`), surbrillance de bordure (`var(--border-strong)`).
- **Focus visible :** Double anneau de focus (`--ring-accent`) conforme WCAG 2.1 AA.
- **Rotation d'icône :** Transition douce de rotation (45deg) et fondu enchaîné d'opacité (`180ms cubic-bezier(0.22, 1, 0.36, 1)`), débrayée sous `prefers-reduced-motion: reduce`.

---

## 8. Do's and Don'ts

### Do's
- **DO** tester systématiquement chaque token de texte sur `{colors.surface-0-light}` et `{colors.surface-2-light}` pour garantir le ratio minimal de 4.5:1.
- **DO** laisser le Terminal Hero en fond sombre `{colors.surface-terminal}` quel que soit le mode actif.
- **DO** utiliser des icônes SVG créées avec des tracés vectoriels stricts et propres (pas de glyphes Unicode ou emojis).
- **DO** synchroniser automatiquement le thème lorsque l'utilisateur modifie la préférence de son OS si le mode actif est « Système ».

### Don'ts
- **DON'T** utiliser un blanc `#FFFFFF` brut pour le fond général de page (utiliser impérativement la teinte crème `{colors.surface-0-light}`).
- **DON'T** inverser le fond du terminal ou blanchir son prompt (le terminal est sanctuarisé).
- **DON'T** insérer des émojis de soleil ☀️ ou lune 🌙 dans l'interface ou les bulles d'aide.
- **DON'T** provoquer de saut visuel (FOUC) blanc/noir lors du rafraîchissement d'une page en SSG.

exec
/bin/zsh -lc "sed -n '1037,1125p' docs/planning-artifacts/epics.md; sed -n '1,260p' docs/specs/spec-theme-light-dark/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
## Epic 13: Thème Light & Dark et Bascule Utilisateur

Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.

### Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal

As a visiteur préférant un environnement d'affichage clair,
I want que les variables CSS du design system exposent une palette claire « Papier technique / Crème solaire » tout en préservant le terminal sombre,
So that l'application s'adapte sans rupture de style ni dénaturation de l'immersion CLI (FR37, UX-DR32, NFR17, NFR19).

**Acceptance Criteria:**

**Given** le fichier `app/assets/scss/abstract/_root.scss`
**When** on déclare le sélecteur `[data-theme="light"]`
**Then** les alias sémantiques de surfaces sont surchargés :
  - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4`)
  - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6`)
  - `--bg-card: hsl(0deg 0% 100%)` (`#FFFFFF`)
  - `--bg-elevated: hsl(38deg 30% 99%)` (`#FFFEFB`)
  - `--bg-input: hsl(38deg 15% 95%)` (`#F5F3EE`)
**And** les alias sémantiques d'encre garantissent un contraste WCAG AAA :
  - `--text-strong: hsl(320deg 30% 12%)` (`#271524`, ratio > 14:1)
  - `--text-body: hsl(320deg 18% 26%)` (`#473644`, ratio > 8:1)
  - `--text-muted: hsl(320deg 10% 44%)` (`#756773`, ratio > 4.5:1)
**And** l'accent orange est adapté au contraste sur fond clair (`--accent: hsl(24deg 95% 44%)`, `#DA5207`, ratio AA > 4.5:1)
**And** les conteneurs de terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: var(--aubergine-deep)`, `#2E0024`) et leurs couleurs de texte clair, restant insensibles au mode clair global
**And** la suite `docker compose run --rm web sh -c "corepack enable && pnpm lint"` est validée avec 0 erreur.

### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC

As a visiteur naviguant sur `jouan.ovh`,
I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
So that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20).

**Acceptance Criteria:**

**Given** l'infrastructure client Nuxt 4
**When** on initialise le thème dans l'application
**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
**And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.

### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

As a utilisateur sur desktop ou smartphone,
I want disposer d'un bouton de bascule compact placé à gauche du statut « Disponible » dans le dock d'état et dans le menu mobile,
So that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).

**Acceptance Criteria:**

**Given** le composant `HeaderComponent.vue` et `ZIcon.vue`
**When** on affiche la barre de navigation
**Then** 3 icônes vectorielles inline sans emoji (`monitor`, `moon`, `sun`) sont déclarées dans `app/components/ui/ZIcon.vue`
**And** le composant `app/components/ui/ThemeToggle.vue` est créé :
  - Format compact (36x36px desktop, 40x40px mobile) avec bordure subtile
  - Clic / activation clavier cycle l'état : `system → dark → light → system`
  - Affiche l'icône correspondant au mode courant
  - Dispose d'un `aria-label` dynamique décrivant l'état actif et la prochaine action
  - Supporte le focus visible (`--ring-accent`), la navigation clavier (`Tab`, `Entrée`, `Espace`), le mode `forced-colors: active` et désactive toute rotation d'icône sous `prefers-reduced-motion: reduce`
**And** le composant est intégré dans `HeaderComponent.vue` :
  1. Desktop : dans `.hdr__dock-right`, immédiatement à gauche de `.hdr__status-badge` (« Disponible »)
  2. Mobile : dans `.hdr__menu-status`, aligné avec le badge de statut
**And** la suite de lint et typecheck passe avec 0 erreur.

### Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG

As a développeur garantissant la robustesse de production,
I want vérifier le rendu esthétique des pages sous le thème clair et exécuter la gate Docker complète,
So that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régressions (FR37–FR42, NFR17, NFR19).

**Acceptance Criteria:**

**Given** l'ensemble des routes statiques de `jouan.ovh`
**When** on bascule le thème sur `light`
**Then** toutes les pages (Accueil, Services, À propos, Blog, Contact) affichent un rendu harmonieux :
  - Les cartes blanches (`#FFFFFF`) se détachent nettement du fond crème (`#FAF8F4`)
  - Les encres aubergine et les liens orange offrent une lisibilité contrastée conforme WCAG AA/AAA
  - L'arrière-plan atmosphérique d'accueil (`.atmos`) atténue son opacité pour éviter toute interférence de lecture
  - Le Terminal Hero et le terminal flottant demeurent en mode sombre permanent avec leur prompt vert
**And** le changement de thème est persistant après rechargement de page ou changement d'URL
**And** la suite de validation Docker complète réussit avec 0 erreur :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```
  *(0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, 13 routes statiques pré-rendues avec succès).*

---
---
id: SPEC-theme-light-dark
companions:
  - ../../planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
  - technical-architecture.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Thème Light & Dark (jouan.ovh)

## Why

Le site actuel est conçu exclusivement en thème sombre aubergine, ce qui limite le confort de lecture pour les visiteurs consultant le portfolio en environnement à forte luminosité (en extérieur, sur écran non traité ou selon leur habitude système). L'ajout d'un thème clair « Papier technique / Crème solaire » tout en préservant le terminal sombre résout cette gêne visuelle, renforce l'accessibilité globale et offre aux visiteurs un contrôle complet (synchronisation avec leur OS ou forçage manuel persistant).

## Capabilities

- id: CAP-1
  intent: Le visiteur peut consulter l'intégralité du site dans une palette claire « Papier technique » contrastée et lisible sans dénaturer l'identité de marque ni modifier l'apparence sombre des terminaux.
  success: L'application de `data-theme="light"` permute l'ensemble des arrière-plans (`#FAF8F4`), bordures et textes aubergine profonde (`#271524`, contraste > 8:1) sur toutes les routes statiques, tandis que le Terminal Hero et les fenêtres flottantes conservent leur fond sombre (`#2E0024`) et leurs couleurs syntaxiques d'origine.

- id: CAP-2
  intent: Le site adopte automatiquement le thème préféré du système d'exploitation de l'utilisateur dès la première visite et réagit en temps réel à tout changement d'ambiance système tant qu'aucun forçage n'a été enregistré.
  success: En absence de clé locale, le basculement de `prefers-color-scheme` entre sombre et clair dans le système (ou l'émulation DevTools) adapte immédiatement le thème sans rafraîchissement ni interruption de lecture.

- id: CAP-3
  intent: L'utilisateur peut surcharger manuellement le thème de son choix et conserver ce paramètre lors de ses visites ultérieures sur le même terminal.
  success: La sélection d'un thème forcé (`dark` ou `light`) s'enregistre dans le `localStorage` du navigateur sous la clé `jouan_theme_mode` et est restaurée fidèlement lors des rechargements et navigations futures.

- id: CAP-4
  intent: L'utilisateur dispose dans le Header d'une commande compacte positionnée immédiatement à gauche du statut « Disponible » permettant de faire défiler les états Système, Sombre et Clair.
  success: Un bouton d'action placé dans le dock d'état du header (`.hdr__dock-right`) et dans le tiroir mobile avance cycliquement dans l'ordre `Système → Sombre → Clair → Système`, affiche l'icône vectorielle correspondante (`monitor` / `moon` / `sun`), et met à jour son `aria-label` descriptif sans aucun emoji textuel.

- id: CAP-5
  intent: Tout chargement d'une page pré-rendue applique le thème effectif dès le premier instant sans aucun flash lumineux ou clignotement de thème inverse lors de l'hydratation côté client.
  success: Un script inline synchrone injecté dans le `<head>` du document HTML résout et applique `data-theme` sur l'élément racine avant le premier paint du navigateur, sans provoquer de décalage de mise en page ni de flash FOUC.

- id: CAP-6
  intent: La sélection du thème et la navigation en mode clair sont pleinement utilisables au clavier, intelligibles pour les lecteurs d'écran et visibles en mode contraste élevé système.
  success: Le bouton est manipulable par `Tab`, `Entrée` et `Espace`, expose un indicateur de focus distinct (`--ring-accent`), supporte le mode Windows High Contrast via `forced-colors`, et tous les textes du thème clair valident le seuil de contraste WCAG AA (> 4.5:1).

## Constraints

- **Environnement Docker exclusif :** Toute compilation, vérification TypeScript et validation SSG s'exécute strictement via `docker compose run --rm web ...`.
- **Zéro Emoji :** Conformité stricte avec la règle NFR6 du projet (aucun caractère emoji dans les libellés, infobulles, SVG ou code).
- **Sanctuarisation du Terminal :** Le Terminal Hero et le composant `TerminalComponent` conservent impérativement leur fond sombre aubergine (`#2E0024`) et leur rendu CLI dans les deux thèmes.
- **Architecture SSG Statique :** Aucune dépendance à un middleware serveur ou cookie HTTP dynamique ; persistance reposant exclusivement sur `localStorage` et les media queries côté client.
- **DRY & Pas de tokens hardcodés :** Toutes les couleurs et élévations sont exposées via les variables CSS sémantiques de `_root.scss`.

## Non-goals

- Ne pas implémenter de sélecteur libre de couleurs ou de générateur de thèmes personnalisés.
- Ne pas synchroniser le thème via un compte utilisateur ou un backend distant.
- Ne pas convertir l'interface interne du terminal en thème clair.
- Ne pas introduire de bibliothèque externe de gestion de thème ou de framework CSS tiers.

## Success signal

Sur n'importe quelle page de `jouan.ovh`, un utilisateur clique sur la commande située à gauche de « Disponible » : l'interface bascule instantanément entre les modes Système, Sombre et Clair avec une palette crème « Papier technique » contrastée WCAG AA/AAA, le choix persiste au rechargement de page sans flash FOUC, et la suite de vérification Docker (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur sur l'ensemble des 13 routes statiques.

## Assumptions

- Les trois tracés d'icônes (`monitor`, `moon`, `sun`) sont ajoutés directement dans `ZIcon.vue` sans dépendance externe.
- Le script synchrone anti-FOUC est configuré dans `nuxt.config.ts` au niveau de `app.head.script`.

exec
/bin/zsh -lc "sed -n '1,280p' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Tokens du design system — SOURCE DE VÉRITÉ du style
//  Porté depuis docs/design_system/tokens/*.css (dark-first,
//  héritage Ubuntu/terminal : orange + aubergine).
//
//  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
//  motion ne doit être hardcodée dans un composant. Tout passe
//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
//
//  Les valeurs sont reproduites à l'identique des tokens source
//  (notation couleur normalisée par Stylelint : hsl angle/%).
// ============================================================

:root {
  // ---- Brand : Ubuntu orange (accent primaire) ----
  --orange-50: hsl(24deg 100% 96%);
  --orange-100: hsl(25deg 100% 92%);
  --orange-300: hsl(24deg 100% 75%);
  --orange-500: hsl(24deg 94% 53%); // accent héros
  --orange-600: hsl(24deg 100% 47%);
  --orange-700: hsl(24deg 100% 37%);
  --orange-900: hsl(15deg 60% 17%);

  // ---- Brand : Aubergine (violet Ubuntu) ----
  --aubergine-light: hsl(319deg 26% 70%);
  --aubergine: hsl(319deg 33% 30%);
  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
  --aubergine-deep: hsl(319deg 100% 9%); // corps terminal
  --aubergine-black: hsl(320deg 60% 5%);

  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
  --surface-1: hsl(319deg 22% 9%); // sections en creux
  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
  --surface-4: hsl(316deg 14% 21%); // popovers, inputs

  // ---- Bordures / hairlines ----
  --line-subtle: hsl(316deg 14% 18%);
  --line: hsl(315deg 12% 25%);
  --line-strong: hsl(314deg 11% 34%);

  // ---- Texte (off-whites chauds sur fond sombre) ----
  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
  --ink-2: hsl(28deg 10% 74%); // corps
  --ink-3: hsl(25deg 7% 54%); // discret / légendes
  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange

  // ---- Palette terminale / syntaxe ----
  --term-green: hsl(143deg 60% 52%); // prompt, succès
  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
  --term-cyan: hsl(186deg 64% 56%);
  --term-red: hsl(0deg 85% 64%);
  --term-yellow: hsl(48deg 90% 58%);
  --term-purple: hsl(280deg 60% 70%);

  // ---- Sémantique ----
  --success: hsl(143deg 58% 46%);
  --success-soft: hsl(143deg 45% 14%);
  --warning: hsl(38deg 92% 56%);
  --warning-soft: hsl(38deg 60% 14%);
  --danger: hsl(0deg 78% 60%);
  --danger-soft: hsl(0deg 55% 15%);
  --info: hsl(204deg 72% 56%);
  --info-soft: hsl(204deg 55% 14%);

  // ============================================================
  //  Alias sémantiques — à préférer dans les composants
  // ============================================================
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --text-faint: var(--ink-4);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--orange-500);
  --accent-hover: hsl(24deg 100% 60%);
  --accent-active: var(--orange-600);
  --accent-text: var(--ink-on-accent);
  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
  --accent-ring: hsl(24deg 94% 53% / 45%);
  --accent-2: var(--aubergine-light); // accent secondaire
  --accent-2-soft: hsl(319deg 40% 30% / 28%);
  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
  --link: var(--term-blue);
  --prompt: var(--term-green);
  --overlay: hsl(320deg 60% 3% / 66%);
  --selection: hsl(24deg 94% 53% / 28%);

  // ============================================================
  //  Typographie
  // ============================================================
  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: var(--font-mono);

  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
  --fs-xs: 0.75rem; // 12
  --fs-sm: 0.875rem; // 14
  --fs-base: 1rem; // 16
  --fs-md: 1.125rem; // 18
  --fs-lg: 1.25rem; // 20
  --fs-xl: 1.5rem; // 24
  --fs-2xl: 1.75rem; // 28
  --fs-3xl: 2rem; // 32
  --fs-4xl: 2.5rem; // 40
  --fs-5xl: 3rem; // 48
  --fs-6xl: 3.5rem; // 56

  // Graisses
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;

  // Interlignes
  --lh-tight: 1.1;
  --lh-snug: 1.3;
  --lh-normal: 1.5;
  --lh-relaxed: 1.65;

  // Interlettrage — les eyebrows/labels mono reçoivent des capitales espacées
  --ls-tight: -0.02em;
  --ls-normal: 0;
  --ls-wide: 0.04em;
  --ls-wider: 0.14em;

  // ============================================================
  //  Espacement — base 4px (token = px / 4)
  // ============================================================
  --space-0: 0;
  --space-1: 0.25rem; // 4
  --space-2: 0.5rem; // 8
  --space-3: 0.75rem; // 12
  --space-4: 1rem; // 16
  --space-5: 1.25rem; // 20
  --space-6: 1.5rem; // 24
  --space-8: 2rem; // 32
  --space-10: 2.5rem; // 40
  --space-12: 3rem; // 48
  --space-16: 4rem; // 64
  --space-20: 5rem; // 80
  --space-24: 6rem; // 96

  // Layout
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 992px;
  --container-xl: 1200px;
  --container-2xl: 1400px;
  --header-height: 56px;
  --footer-height: 56px;
  --gutter: var(--space-6);

  // ============================================================
  //  Rayons (héritage : 0 / 4 / 8 / pill / 50% ; terminal = 5px)
  // ============================================================
  --radius-none: 0;
  --radius-xs: 3px;
  --radius-sm: 5px; // fenêtre terminal, chips
  --radius-md: 8px; // cartes, inputs, boutons
  --radius-lg: 12px; // grands panneaux
  --radius-xl: 18px;
  --radius-pill: 999px;
  --radius-circle: 50%;

  // ============================================================
  //  Élévation — ombres calibrées pour une UI sombre
  // ============================================================
  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
  --shadow-2: 0 2px 8px hsl(320deg 60% 2% / 55%);
  --shadow-3: 0 8px 24px hsl(320deg 60% 2% / 60%);
  --shadow-4: 0 18px 48px hsl(320deg 60% 2% / 66%);

  // Hairline interne en haut : donne l'impression d'une carte éclairée du dessus
  --shadow-hairline: inset 0 1px 0 hsl(30deg 20% 100% / 5%);

  // Glows focaux
  --glow-accent: 0 0 0 1px hsl(24deg 94% 53% / 40%), 0 8px 30px hsl(24deg 94% 53% / 22%);
  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);

  // Anneau de focus
  --ring-accent: 0 0 0 3px var(--accent-ring);

  // ============================================================
  //  Motion — easings sobres et mécaniques (esprit terminal)
  // ============================================================
  --dur-fast: 120ms;
  --dur-base: 180ms;
  --dur-slow: 320ms;
  --dur-slower: 600ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-standard: ease-in-out;
}

// ============================================================
//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
// ============================================================
[data-theme="light"] {
  // Surfaces claires
  --bg-page: hsl(38deg 25% 97%);
  --bg-sunken: hsl(38deg 20% 93%);
  --bg-card: hsl(0deg 0% 100%);
  --bg-elevated: hsl(38deg 30% 99%);
  --bg-input: hsl(38deg 15% 95%);

  // Encres aubergine (contrastes WCAG AAA)
  --text-strong: hsl(320deg 30% 12%);
  --text-body: hsl(320deg 18% 26%);
  --text-muted: hsl(320deg 10% 44%);
  --text-faint: hsl(320deg 8% 58%);
  --ink-on-accent: hsl(0deg 0% 100%);

  // Bordures douces
  --border-subtle: hsl(35deg 15% 88%);
  --border-default: hsl(35deg 12% 80%);
  --border-strong: hsl(35deg 12% 68%);

  // Accent & sélections
  --accent: hsl(24deg 95% 44%);
  --accent-soft: hsl(24deg 94% 53% / 10%);
  --accent-ring: hsl(24deg 94% 53% / 35%);
  --selection: hsl(24deg 94% 53% / 22%);
  --overlay: hsl(320deg 30% 10% / 40%);

  // Ombres adaptées
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
}

// Sanctuarisation absolue du terminal sombre
.home-hero-terminal,
.hero-term,
.terminal-window,
.terminal {
  --bg-terminal: hsl(319deg 100% 9%);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-terminal: hsl(319deg 40% 30% / 40%);
}

::selection {
  background: var(--selection);
}

// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@keyframes fade-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;

exec
/bin/zsh -lc "git status --short; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/13-1/full.diff || true; rg -n \"--(bg-terminal|text-strong|text-body|text-muted|border-terminal|term-green|term-blue|ink-1|ink-2|ink-3|line-subtle|line)\" app/components app/assets/scss -g '*.vue' -g '*.scss'" in /Users/simon/dev/jouan.ovh
 exited 2 in 0ms:
 M app/assets/scss/abstract/_root.scss
 M docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/13-1/
 .../code-reviews/13-1/full.diff                    | 153 +++++++++++++++++++++
 1 file changed, 153 insertions(+)
rg: unrecognized flag --(bg-terminal|text-strong|text-body|text-muted|border-terminal|term-green|term-blue|ink-1|ink-2|ink-3|line-subtle|line)

exec
/bin/zsh -lc "rg -n -- \"--(bg-terminal|text-strong|text-body|text-muted|border-terminal|term-green|term-blue|ink-1|ink-2|ink-3|line-subtle|line)\" app/components app/assets/scss -g '*.vue' -g '*.scss'" in /Users/simon/dev/jouan.ovh
 exited 2 in 0ms:
rg: -g: No such file or directory (os error 2)
rg: *.vue: No such file or directory (os error 2)
rg: -g: No such file or directory (os error 2)
rg: *.scss: No such file or directory (os error 2)
app/components/HeaderComponent.vue:308:    color: var(--text-strong);
app/components/HeaderComponent.vue:328:      color: var(--text-body);
app/components/HeaderComponent.vue:358:  color: var(--text-body);
app/components/HeaderComponent.vue:375:    color: var(--text-strong);
app/components/HeaderComponent.vue:393:  color: var(--text-strong);
app/components/HeaderComponent.vue:426:  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
app/components/HeaderComponent.vue:427:  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);
app/components/HeaderComponent.vue:430:    border-color: var(--term-green);
app/components/HeaderComponent.vue:432:      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
app/components/HeaderComponent.vue:456:  color: var(--term-green);
app/components/HeaderComponent.vue:458:  background: color-mix(in srgb, var(--term-green) 12%, transparent);
app/components/HeaderComponent.vue:459:  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
app/components/HeaderComponent.vue:461:  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
app/components/HeaderComponent.vue:471:    border-color: var(--term-green);
app/components/HeaderComponent.vue:472:    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
app/components/HeaderComponent.vue:479:  background: var(--term-green);
app/components/HeaderComponent.vue:481:  box-shadow: 0 0 6px var(--term-green);
app/components/HeaderComponent.vue:495:  color: var(--text-strong);
app/components/HeaderComponent.vue:585:  color: var(--text-body);
app/components/HeaderComponent.vue:590:    color: var(--text-strong);
app/assets/scss/base/_layout.scss:54:  color: var(--text-muted);
app/assets/scss/base/_layout.scss:61:  color: var(--text-body);
app/assets/scss/base/_layout.scss:85:  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/base/_layout.scss:86:  color: var(--text-muted);
app/components/CurrentTime.vue:65:  color: var(--text-muted);
app/assets/scss/base/_reset.scss:384:  color: var(--text-body);
app/components/FooterComponent.vue:117:    color: var(--text-strong);
app/components/FooterComponent.vue:121:    color: var(--text-muted);
app/components/FooterComponent.vue:136:  color: var(--text-body);
app/components/FooterComponent.vue:167:  color: var(--text-strong);
app/components/FooterComponent.vue:187:    color: var(--text-body);
app/components/FooterComponent.vue:191:      color: var(--text-body);
app/components/FooterComponent.vue:212:  color: var(--text-body);
app/components/FooterComponent.vue:216:  color: var(--term-green);
app/components/HexagonLinkComponent.vue:26:  color: var(--text-strong);
app/assets/scss/abstract/_root.scss:39:  --line-subtle: hsl(316deg 14% 18%);
app/assets/scss/abstract/_root.scss:40:  --line: hsl(315deg 12% 25%);
app/assets/scss/abstract/_root.scss:41:  --line-strong: hsl(314deg 11% 34%);
app/assets/scss/abstract/_root.scss:44:  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
app/assets/scss/abstract/_root.scss:45:  --ink-2: hsl(28deg 10% 74%); // corps
app/assets/scss/abstract/_root.scss:46:  --ink-3: hsl(25deg 7% 54%); // discret / légendes
app/assets/scss/abstract/_root.scss:51:  --term-green: hsl(143deg 60% 52%); // prompt, succès
app/assets/scss/abstract/_root.scss:52:  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
app/assets/scss/abstract/_root.scss:76:  --bg-terminal: var(--aubergine-deep);
app/assets/scss/abstract/_root.scss:77:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:79:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:81:  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss:82:  --border-default: var(--line);
app/assets/scss/abstract/_root.scss:83:  --border-strong: var(--line-strong);
app/assets/scss/abstract/_root.scss:92:  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
app/assets/scss/abstract/_root.scss:93:  --link: var(--term-blue);
app/assets/scss/abstract/_root.scss:94:  --prompt: var(--term-green);
app/assets/scss/abstract/_root.scss:217:  --text-strong: hsl(320deg 30% 12%);
app/assets/scss/abstract/_root.scss:218:  --text-body: hsl(320deg 18% 26%);
app/assets/scss/abstract/_root.scss:219:  --text-muted: hsl(320deg 10% 44%);
app/assets/scss/abstract/_root.scss:247:  --bg-terminal: hsl(319deg 100% 9%);
app/assets/scss/abstract/_root.scss:248:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:249:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:250:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:251:  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss:252:  --border-default: var(--line);
app/assets/scss/abstract/_root.scss:253:  --border-terminal: hsl(319deg 40% 30% / 40%);
app/components/terminal/TerminalComponent.vue:339:  color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:340:  border: 1px solid var(--border-terminal);
app/components/terminal/TerminalComponent.vue:397:      background: var(--term-green);
app/components/terminal/TerminalComponent.vue:408:      color: var(--text-muted);
app/components/terminal/TerminalComponent.vue:423:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:445:      color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:450:      color: var(--term-blue);
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/card/ZCardBody.vue:19:  // illisible sur le fond sombre --bg-card de ZCard → encre claire --text-strong.
app/components/card/ZCardBody.vue:21:  color: var(--text-body);
app/components/card/ZCardBody.vue:24:    color: var(--text-strong);
app/components/home/HomeAtmosComponent.vue:400:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 8%, transparent) 1px, transparent 1px);
app/components/home/HomeBootOverlay.vue:205:  color: var(--text-strong);
app/components/home/HomeBootOverlay.vue:219:  color: var(--text-muted);
app/components/home/HomeBootOverlay.vue:223:  color: var(--term-green);
app/components/ui/ZButton.vue:286:  color: var(--text-strong);
app/components/ui/ZButton.vue:298:  color: var(--text-body);
app/components/ui/ZButton.vue:303:    color: var(--text-strong);
app/components/ui/ZButton.vue:308:  background: var(--bg-terminal);
app/components/ui/ZButton.vue:309:  color: var(--term-green);
app/components/ui/ZButton.vue:310:  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
app/components/ui/ZButton.vue:311:  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
app/components/ui/ZButton.vue:314:    border-color: var(--term-green);
app/components/ui/ZButton.vue:316:      0 0 18px color-mix(in srgb, var(--term-green) 45%, transparent),
app/components/home/HomeStackMarquee.vue:88:  color: var(--text-body);
app/components/home/HomeHeroTerminal.vue:301:  background: var(--term-green);
app/components/home/HomeHeroTerminal.vue:310:  color: var(--text-muted);
app/components/home/HomeHeroTerminal.vue:323:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:324:  background: var(--bg-terminal);
app/components/home/HomeHeroTerminal.vue:330:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/home/HomeHeroTerminal.vue:344:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:348:  color: var(--term-blue);
app/components/home/HomeHeroTerminal.vue:352:  color: var(--term-green);
app/components/home/HomeHeroTerminal.vue:383:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:388:  color: var(--term-blue);
app/components/home/HomeHeroTerminal.vue:392:  color: var(--ink-1);
app/components/ui/ZBadge.vue:55:  color: var(--text-body);
app/components/ui/ZCard.vue:136:  color: var(--text-body);
app/components/ui/ZAvatar.vue:73:  color: var(--text-strong);
app/components/ui/ZCustomCursor.vue:175:  background: var(--ink-1);
app/components/ui/ZCustomCursor.vue:181:  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
app/components/ui/ZInput.vue:140:  color: var(--text-muted);
app/components/ui/ZInput.vue:156:  color: var(--text-strong);
app/components/ui/ZInput.vue:165:    // Contraste (story 9.2) : remonté d'un palier (--text-faint → --text-muted).
app/components/ui/ZInput.vue:167:    color: var(--text-muted);
app/components/ui/ZInput.vue:206:  color: var(--text-muted);
app/components/ui/ZInput.vue:225:  color: var(--text-muted);
app/components/ui/ZTag.vue:120:  color: var(--text-body);
app/components/ui/ZTag.vue:144:    color: var(--text-strong);
app/components/ui/ZTag.vue:166:  color: var(--text-muted);

exec
/bin/zsh -lc "rg -n \"home-hero-terminal|hero-term|terminal-window|class=\\\"terminal|class=\\\".*terminal\" app -g '*.vue' -g '*.scss'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/contact/index.vue:113:            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
app/pages/contact/index.vue:152:              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
app/assets/scss/abstract/_root.scss:243:.home-hero-terminal,
app/assets/scss/abstract/_root.scss:244:.hero-term,
app/assets/scss/abstract/_root.scss:245:.terminal-window,
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
app/components/HeaderComponent.vue:81:        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
app/components/home/HomeHeroTerminal.vue:2:  <div class="hero-term">
app/components/home/HomeHeroTerminal.vue:3:    <div class="hero-term__bar">
app/components/home/HomeHeroTerminal.vue:4:      <span class="hero-term__dots" aria-hidden="true">
app/components/home/HomeHeroTerminal.vue:5:        <span class="hero-term__dot hero-term__dot--close" />
app/components/home/HomeHeroTerminal.vue:6:        <span class="hero-term__dot hero-term__dot--min" />
app/components/home/HomeHeroTerminal.vue:7:        <span class="hero-term__dot hero-term__dot--max" />
app/components/home/HomeHeroTerminal.vue:9:      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
app/components/home/HomeHeroTerminal.vue:12:    <div class="hero-term__body">
app/components/home/HomeHeroTerminal.vue:15:        <p class="hero-term__line" aria-hidden="true">
app/components/home/HomeHeroTerminal.vue:24:        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
app/components/home/HomeHeroTerminal.vue:28:      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
app/components/home/HomeHeroTerminal.vue:43:        class="hero-term__open"
app/components/home/HomeHeroTerminal.vue:62:            <p class="hero-term__line">
app/components/home/HomeHeroTerminal.vue:71:            <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
app/components/home/HomeHeroTerminal.vue:259:.hero-term {
app/components/home/HomeHeroTerminal.vue:269:.hero-term__bar {
app/components/home/HomeHeroTerminal.vue:280:.hero-term__dots {
app/components/home/HomeHeroTerminal.vue:286:.hero-term__dot {
app/components/home/HomeHeroTerminal.vue:292:.hero-term__dot--close {
app/components/home/HomeHeroTerminal.vue:296:.hero-term__dot--min {
app/components/home/HomeHeroTerminal.vue:300:.hero-term__dot--max {
app/components/home/HomeHeroTerminal.vue:304:.hero-term__title {
app/components/home/HomeHeroTerminal.vue:315:.hero-term__body {
app/components/home/HomeHeroTerminal.vue:329:  .hero-term__body {
app/components/home/HomeHeroTerminal.vue:335:.hero-term__line {
app/components/home/HomeHeroTerminal.vue:339:.hero-term__out {
app/components/home/HomeHeroTerminal.vue:343:.hero-term__out--ink {
app/components/home/HomeHeroTerminal.vue:347:.hero-term__out--blue {
app/components/home/HomeHeroTerminal.vue:351:.hero-term__out--green {
app/components/home/HomeHeroTerminal.vue:355:.hero-term__open {
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
app/components/terminal/TerminalComponent.vue:11:      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
app/components/terminal/TerminalComponent.vue:12:        <div class="terminal-dots">
app/components/terminal/TerminalComponent.vue:22:          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:23:          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:28:      <div class="terminal-body">
app/components/terminal/TerminalComponent.vue:32:            <span class="terminal-response" v-html="line.text"></span>

exec
/bin/zsh -lc "git show f077f9b563bcef69bc61b9f28913f6db071e8b36:app/assets/scss/abstract/_root.scss | sed -n '75,125p'; git diff --check -- app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --text-faint: var(--ink-4);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--orange-500);
  --accent-hover: hsl(24deg 100% 60%);
  --accent-active: var(--orange-600);
  --accent-text: var(--ink-on-accent);
  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
  --accent-ring: hsl(24deg 94% 53% / 45%);
  --accent-2: var(--aubergine-light); // accent secondaire
  --accent-2-soft: hsl(319deg 40% 30% / 28%);
  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
  --link: var(--term-blue);
  --prompt: var(--term-green);
  --overlay: hsl(320deg 60% 3% / 66%);
  --selection: hsl(24deg 94% 53% / 28%);

  // ============================================================
  //  Typographie
  // ============================================================
  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: var(--font-mono);

  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
  --fs-xs: 0.75rem; // 12
  --fs-sm: 0.875rem; // 14
  --fs-base: 1rem; // 16
  --fs-md: 1.125rem; // 18
  --fs-lg: 1.25rem; // 20
  --fs-xl: 1.5rem; // 24
  --fs-2xl: 1.75rem; // 28
  --fs-3xl: 2rem; // 32
  --fs-4xl: 2.5rem; // 40
  --fs-5xl: 3rem; // 48
  --fs-6xl: 3.5rem; // 56

  // Graisses
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;

  // Interlignes
  --lh-tight: 1.1;

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/13-1/full.diff | sed -n '1,120p'; printf '\\n--- relevant spec line numbers ---\\n'; nl -ba docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md | sed -n '20,95p'; nl -ba docs/specs/spec-theme-light-dark/technical-architecture.md | sed -n '12,48p'; printf '\\n--- actual terminal declarations ---\\n'; nl -ba app/components/terminal/TerminalComponent.vue | sed -n '330,460p'; nl -ba app/components/home/HomeHeroTerminal.vue | sed -n '255,355p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/assets/scss/abstract/_root.scss b/app/assets/scss/abstract/_root.scss
     2	index 16c78d3..5e92f5f 100644
     3	--- a/app/assets/scss/abstract/_root.scss
     4	+++ b/app/assets/scss/abstract/_root.scss
     5	@@ -202,6 +202,57 @@
     6	   --ease-standard: ease-in-out;
     7	 }
     8	 
     9	+// ============================================================
    10	+//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
    11	+// ============================================================
    12	+[data-theme="light"] {
    13	+  // Surfaces claires
    14	+  --bg-page: hsl(38deg 25% 97%);
    15	+  --bg-sunken: hsl(38deg 20% 93%);
    16	+  --bg-card: hsl(0deg 0% 100%);
    17	+  --bg-elevated: hsl(38deg 30% 99%);
    18	+  --bg-input: hsl(38deg 15% 95%);
    19	+
    20	+  // Encres aubergine (contrastes WCAG AAA)
    21	+  --text-strong: hsl(320deg 30% 12%);
    22	+  --text-body: hsl(320deg 18% 26%);
    23	+  --text-muted: hsl(320deg 10% 44%);
    24	+  --text-faint: hsl(320deg 8% 58%);
    25	+  --ink-on-accent: hsl(0deg 0% 100%);
    26	+
    27	+  // Bordures douces
    28	+  --border-subtle: hsl(35deg 15% 88%);
    29	+  --border-default: hsl(35deg 12% 80%);
    30	+  --border-strong: hsl(35deg 12% 68%);
    31	+
    32	+  // Accent & sélections
    33	+  --accent: hsl(24deg 95% 44%);
    34	+  --accent-soft: hsl(24deg 94% 53% / 10%);
    35	+  --accent-ring: hsl(24deg 94% 53% / 35%);
    36	+  --selection: hsl(24deg 94% 53% / 22%);
    37	+  --overlay: hsl(320deg 30% 10% / 40%);
    38	+
    39	+  // Ombres adaptées
    40	+  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
    41	+  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
    42	+  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
    43	+  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
    44	+}
    45	+
    46	+// Sanctuarisation absolue du terminal sombre
    47	+.home-hero-terminal,
    48	+.hero-term,
    49	+.terminal-window,
    50	+.terminal {
    51	+  --bg-terminal: hsl(319deg 100% 9%);
    52	+  --text-strong: var(--ink-1);
    53	+  --text-body: var(--ink-2);
    54	+  --text-muted: var(--ink-3);
    55	+  --border-subtle: var(--line-subtle);
    56	+  --border-default: var(--line);
    57	+  --border-terminal: hsl(319deg 40% 30% / 40%);
    58	+}
    59	+
    60	 ::selection {
    61	   background: var(--selection);
    62	 }
    63	diff --git a/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md b/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
    64	index 88e70d4..b25f23b 100644
    65	--- a/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
    66	+++ b/docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
    67	@@ -4,7 +4,7 @@ baseline_commit: f077f9b563bcef69bc61b9f28913f6db071e8b36
    68	 
    69	 # Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal
    70	 
    71	-Status: ready-for-dev
    72	+Status: review
    73	 
    74	 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    75	 
    76	@@ -65,21 +65,21 @@ so that l'application s'adapte sans rupture de style ni dénaturation de l'immer
    77	 
    78	 ## Tasks / Subtasks
    79	 
    80	-- [ ] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
    81	-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
    82	-  - [ ] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
    83	-  - [ ] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
    84	-  - [ ] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
    85	-  - [ ] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).
    86	+- [x] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
    87	+  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
    88	+  - [x] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
    89	+  - [x] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
    90	+  - [x] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
    91	+  - [x] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).
    92	 
    93	-- [ ] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
    94	-  - [ ] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
    95	-  - [ ] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-terminal`).
    96	-  - [ ] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.
    97	+- [x] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
    98	+  - [x] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
    99	+  - [x] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-default`, `--border-terminal`).
   100	+  - [x] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.
   101	 
   102	-- [ ] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
   103	-  - [ ] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
   104	-  - [ ] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.
   105	+- [x] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
   106	+  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
   107	+  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.
   108	 
   109	 ## Dev Notes
   110	 
   111	@@ -157,11 +157,19 @@ so that l'application s'adapte sans rupture de style ni dénaturation de l'immer
   112	 
   113	 ### Agent Model Used
   114	 
   115	-Gemini 3.8 Flash (High)
   116	+Gemini 3.7 Flash (Medium)
   117	 
   118	 ### Debug Log References
   119	 
   120	+- Validation Gate Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).

--- relevant spec line numbers ---
    20	   **When** on inspecte les règles de style globales du projet
    21	   **Then** un bloc de surcharge dédié `[data-theme="light"]` est déclaré à la suite des tokens racine `:root`
    22	   **And** ce bloc redéfinit les alias sémantiques de surfaces avec la palette « Papier technique / Crème solaire » :
    23	     - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4` — fond de page principal crème chaleureux)
    24	     - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6` — sections en creux)
    25	     - `--bg-card: hsl(0deg 0% 100%)` (`#FFFFFF` — cartes de contenu blanches nettes)
    26	     - `--bg-elevated: hsl(38deg 30% 99%)` (`#FFFEFB` — survol et popovers)
    27	     - `--bg-input: hsl(38deg 15% 95%)` (`#F5F3EE` — champs et conteneurs secondaires)
    28	   **And** les alias sémantiques de bordures sont adaptés aux teintes chaudes :
    29	     - `--border-subtle: hsl(35deg 15% 88%)` (`#E6E2DC`)
    30	     - `--border-default: hsl(35deg 12% 80%)` (`#D1CCC4`)
    31	     - `--border-strong: hsl(35deg 12% 68%)` (`#B3ABA2`)
    32	   **And** les ombres sont réétalonnées pour un fond clair :
    33	     - `--shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%)`
    34	     - `--shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%)`
    35	     - `--shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%)`
    36	     - `--shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%)`
    37	   **And** les tokens d'accent et de sélection sont ajustés :
    38	     - `--accent: hsl(24deg 95% 44%)` (`#DA5207` — contraste AA > 4.5:1 garanti sur fond blanc/crème)
    39	     - `--accent-soft: hsl(24deg 94% 53% / 10%)`
    40	     - `--accent-ring: hsl(24deg 94% 53% / 35%)`
    41	     - `--selection: hsl(24deg 94% 53% / 22%)`
    42	     - `--overlay: hsl(320deg 30% 10% / 40%)`.
    43	
    44	2. **Given** les alias sémantiques d'encre (typographie) en mode clair
    45	   **When** le thème `[data-theme="light"]` est appliqué
    46	   **Then** les variables de texte adoptent la gamme aubergine profonde garantissant un confort et une conformité WCAG :
    47	     - `--text-strong: hsl(320deg 30% 12%)` (`#271524` — ratio de contraste > 14:1 sur fond crème, conforme WCAG AAA)
    48	     - `--text-body: hsl(320deg 18% 26%)` (`#473644` — ratio de contraste > 8:1 sur fond crème, conforme WCAG AAA)
    49	     - `--text-muted: hsl(320deg 10% 44%)` (`#756773` — ratio de contraste > 4.5:1 sur fond crème, conforme WCAG AA)
    50	     - `--text-faint: hsl(320deg 8% 58%)` (`#988D96` — réservé aux éléments secondaires désactivés)
    51	     - `--ink-on-accent: hsl(0deg 0% 100%)` (`#FFFFFF` sur les boutons à fond plein).
    52	
    53	3. **Given** les conteneurs et fenêtres d'émulation terminal (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`)
    54	   **When** le document HTML porte l'attribut `data-theme="light"`
    55	   **Then** les règles d'isolation sanctuarisent le terminal :
    56	     - Le fond reste sombre : `--bg-terminal: var(--aubergine-deep)` (`hsl(319deg 100% 9%)` / `#2E0024`)
    57	     - Les textes restent clairs : `--text-strong: var(--ink-1)` (`hsl(30deg 18% 95%)`), `--text-body: var(--ink-2)` (`hsl(28deg 10% 74%)`)
    58	     - Les couleurs de syntaxe (`--term-green`, `--term-blue`, etc.) et le prompt vert clignotant restent inchangés
    59	     - Aucune décoloration ni inversion involontaire ne se produit à l'intérieur du Terminal Hero ou de la console draggable.
    60	
    61	4. **Given** la suite d'outillage et les standards de code du projet
    62	   **When** on exécute la vérification dans Docker
    63	   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint"` s'exécute avec 0 erreur ESLint et 0 erreur Stylelint
    64	   **And** la syntaxe HSL avec degrés (`deg`) et pourcentages respecte scrupuleusement la configuration `.stylelintrc.json`.
    65	
    66	## Tasks / Subtasks
    67	
    68	- [x] Tâche 1 — Déclaration des tokens de surface et d'encre clairs dans `app/assets/scss/abstract/_root.scss` (AC: 1, 2)
    69	  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
    70	  - [x] Déclarer la rampe des surfaces claires (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`).
    71	  - [x] Déclarer la rampe d'encres aubergine (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`).
    72	  - [x] Déclarer les bordures douces (`--border-subtle`, `--border-default`, `--border-strong`), les ombres claires et l'accent orange contrasté AA.
    73	  - [x] Vérifier la conformité de la notation CSS (angles `deg`, pourcentages sans virgules non standard).
    74	
    75	- [x] Tâche 2 — Sanctuarisation du Terminal Hero et des fenêtres CLI (AC: 3)
    76	  - [x] Déclarer dans `_root.scss` (ou dans une section dédiée) la réinitialisation locale des tokens pour les sélecteurs `.hero-term`, `.home-hero-terminal`, `.terminal-window`, `.terminal`.
    77	  - [x] Forcer les variables internes de surface et de texte (`--bg-terminal`, `--text-strong`, `--text-body`, `--text-muted`, `--border-subtle`, `--border-default`, `--border-terminal`).
    78	  - [x] Vérifier qu'aucun composant terminal n'est pollué par les encres sombres du mode clair.
    79	
    80	- [x] Tâche 3 — Vérification visuelle locale et conformité Stylelint / Docker (AC: 4)
    81	  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
    82	  - [x] Lancer `docker compose run --rm web sh -c "corepack enable && pnpm lint"` et corriger tout avertissement Stylelint.
    83	
    84	## Dev Notes
    85	
    86	### Architecture des Tokens SCSS & Emplacement des fichiers
    87	- **Fichier principal à modifier :** `app/assets/scss/abstract/_root.scss`
    88	- **Fichiers de référence :**
    89	  - Spécification visuelle : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
    90	  - Architecture technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
    91	  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
    92	
    93	### Invariants critiques à respecter
    94	- **Environnement Docker obligatoire :** Ne jamais lancer `pnpm` sur la machine hôte. Toute commande s'exécute via :
    95	  ```sh
    12	3. **Exception sanctuarisée :** Les sélecteurs du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: #2e0024`, `--text-strong: #f5f3f0`, `--text-body: #c3bdb7`), assurant l'immunité au thème clair.
    13	
    14	```scss
    15	// app/assets/scss/abstract/_root.scss
    16	
    17	:root {
    18	  // Base sombre (existante)...
    19	  --bg-page: var(--surface-0);
    20	  --bg-sunken: var(--surface-1);
    21	  --bg-card: var(--surface-2);
    22	  --bg-elevated: var(--surface-3);
    23	  --bg-input: var(--surface-4);
    24	  --bg-terminal: var(--aubergine-deep);
    25	  --text-strong: var(--ink-1);
    26	  --text-body: var(--ink-2);
    27	  --text-muted: var(--ink-3);
    28	  --border-subtle: var(--line-subtle);
    29	  --border-default: var(--line);
    30	}
    31	
    32	// Surcharge Thème Clair
    33	[data-theme="light"] {
    34	  --bg-page: hsl(38deg 25% 97%);        // #FAF8F4 crème solaire
    35	  --bg-sunken: hsl(38deg 20% 93%);      // #F1EDE6
    36	  --bg-card: hsl(0deg 0% 100%);         // #FFFFFF cartes blanches
    37	  --bg-elevated: hsl(38deg 30% 99%);    // #FFFEFB
    38	  --bg-input: hsl(38deg 15% 95%);       // #F5F3EE
    39	  
    40	  --text-strong: hsl(320deg 30% 12%);   // #271524 titres aubergine sombre
    41	  --text-body: hsl(320deg 18% 26%);     // #473644 corps de texte
    42	  --text-muted: hsl(320deg 10% 44%);    // #756773 légendes
    43	  --text-faint: hsl(320deg 8% 58%);     // #988D96 désactivé
    44	  
    45	  --border-subtle: hsl(35deg 15% 88%);  // #E6E2DC
    46	  --border-default: hsl(35deg 12% 80%); // #D1CCC4
    47	  --border-strong: hsl(35deg 12% 68%);  // #B3ABA2
    48	  

--- actual terminal declarations ---
   330	  position: fixed;
   331	  top: 60px;
   332	  left: 15px;
   333	  z-index: 1000;
   334	  width: 600px;
   335	  height: 400px;
   336	  overflow: hidden;
   337	  resize: both;
   338	  font-family: var(--font-mono);
   339	  color: var(--ink-1);
   340	  border: 1px solid var(--border-terminal);
   341	  border-radius: var(--radius-sm);
   342	  box-shadow: var(--glow-terminal);
   343	
   344	  &-header {
   345	    position: relative;
   346	    z-index: 1;
   347	    display: flex;
   348	    flex-wrap: nowrap;
   349	    align-items: center;
   350	    gap: var(--space-2);
   351	    height: 30px;
   352	    padding: 0 var(--space-3);
   353	    background: var(--aubergine-black);
   354	    cursor: move;
   355	
   356	    // Groupe de pastilles à gauche (façon fenêtre Ubuntu) — porté de .ds-term__btns.
   357	    .terminal-dots {
   358	      display: flex;
   359	      align-items: center;
   360	      gap: 7px; // espacement décoratif des pastilles (DS, pas de token)
   361	    }
   362	
   363	    // Pastille de fermeture (.ds-term__dot--close). Conserve @click="closeTerminal".
   364	    // Rouge sombre (hsl(0 100% 27%)) + ombre : sans token dédié, valeurs portées du DS.
   365	    .close-button {
   366	      width: 13px;
   367	      height: 13px;
   368	      cursor: pointer;
   369	      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
   370	      border-radius: var(--radius-circle);
   371	      box-shadow: 1px 1px 2px hsl(320deg 60% 2%);
   372	
   373	      &:hover {
   374	        filter: brightness(1.2);
   375	      }
   376	
   377	      // Focus clavier visible (close désormais focusable — a11y CAP-11).
   378	      &:focus-visible {
   379	        outline: 2px solid var(--accent);
   380	        outline-offset: 2px;
   381	      }
   382	    }
   383	
   384	    // Pastilles min/max purement décoratives (aucun handler).
   385	    .terminal-dot {
   386	      width: 13px;
   387	      height: 13px;
   388	      border-radius: var(--radius-circle);
   389	      opacity: 0.85;
   390	    }
   391	
   392	    .terminal-dot--min {
   393	      background: var(--term-yellow);
   394	    }
   395	
   396	    .terminal-dot--max {
   397	      background: var(--term-green);
   398	    }
   399	
   400	    // Titre centré, transparent aux clics → toute la barre reste draggable.
   401	    .header-text {
   402	      position: absolute;
   403	      inset: 0;
   404	      font-family: var(--font-mono);
   405	      font-size: var(--fs-xs);
   406	      letter-spacing: var(--ls-wide);
   407	      line-height: 30px; // centre verticalement dans la barre de 30px
   408	      color: var(--text-muted);
   409	      text-align: center;
   410	      pointer-events: none;
   411	    }
   412	  }
   413	
   414	  &-body {
   415	    height: calc(100% - 30px);
   416	    margin: 0;
   417	    padding: var(--space-4);
   418	    overflow: auto;
   419	    font-size: var(--fs-sm);
   420	    line-height: var(--lh-snug);
   421	    white-space: pre-wrap;
   422	    overflow-wrap: break-word;
   423	    background: var(--bg-terminal);
   424	
   425	    .git-prompt,
   426	    .git-prompt-separator,
   427	    .git-prompt-directory {
   428	      display: inline;
   429	    }
   430	
   431	    // `user@host` (vert) et le répertoire `~` (bleu) en gras comme Prompt.jsx ;
   432	    // les séparateurs `:` et `$` restent en graisse normale (.ds-prompt__sep).
   433	    .git-prompt,
   434	    .git-prompt-directory {
   435	      font-weight: var(--fw-bold);
   436	    }
   437	
   438	    .git-prompt {
   439	      color: var(--prompt);
   440	    }
   441	
   442	    // `:` et `$` : graisse normale explicite (sinon ils héritent du gras du parent
   443	    // `.git-prompt`) — fidèle à `.ds-prompt__sep` du DS.
   444	    .git-prompt-separator {
   445	      color: var(--ink-1);
   446	      font-weight: var(--fw-regular);
   447	    }
   448	
   449	    .git-prompt-directory {
   450	      color: var(--term-blue);
   451	    }
   452	
   453	    .user-input {
   454	      margin: 0;
   455	      padding: 0;
   456	      font-family: inherit;
   457	      font-size: inherit;
   458	      color: inherit;
   459	      background-color: transparent;
   460	      border: none;
   255	</script>
   256	
   257	<style lang="scss" scoped>
   258	/* stylelint-disable selector-class-pattern */
   259	.hero-term {
   260	  display: flex;
   261	  flex-direction: column;
   262	  min-height: 300px;
   263	  overflow: hidden;
   264	  border: 1px solid var(--accent-2-soft);
   265	  border-radius: var(--radius-sm);
   266	  box-shadow: var(--glow-terminal);
   267	}
   268	
   269	.hero-term__bar {
   270	  position: relative;
   271	  display: flex;
   272	  flex: none;
   273	  align-items: center;
   274	  gap: var(--space-2);
   275	  height: 30px;
   276	  padding: 0 var(--space-3);
   277	  background: var(--aubergine-black);
   278	}
   279	
   280	.hero-term__dots {
   281	  display: flex;
   282	  align-items: center;
   283	  gap: 7px;
   284	}
   285	
   286	.hero-term__dot {
   287	  width: 13px;
   288	  height: 13px;
   289	  border-radius: var(--radius-circle);
   290	}
   291	
   292	.hero-term__dot--close {
   293	  background: var(--term-red);
   294	}
   295	
   296	.hero-term__dot--min {
   297	  background: var(--term-yellow);
   298	}
   299	
   300	.hero-term__dot--max {
   301	  background: var(--term-green);
   302	}
   303	
   304	.hero-term__title {
   305	  position: absolute;
   306	  inset: 0;
   307	  font-family: var(--font-mono);
   308	  font-size: var(--fs-xs);
   309	  letter-spacing: var(--ls-wide);
   310	  color: var(--text-muted);
   311	  text-align: center;
   312	  pointer-events: none;
   313	}
   314	
   315	.hero-term__body {
   316	  flex: 1;
   317	  min-height: 0;
   318	  padding: var(--space-4);
   319	  overflow: auto;
   320	  font-family: var(--font-mono);
   321	  font-size: var(--fs-sm);
   322	  line-height: var(--lh-snug);
   323	  color: var(--ink-1);
   324	  background: var(--bg-terminal);
   325	  overflow-wrap: break-word;
   326	}
   327	
   328	@supports (backdrop-filter: blur(5px)) {
   329	  .hero-term__body {
   330	    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
   331	    backdrop-filter: blur(5px);
   332	  }
   333	}
   334	
   335	.hero-term__line {
   336	  margin: 0;
   337	}
   338	
   339	.hero-term__out {
   340	  margin: 0 0 var(--space-4);
   341	}
   342	
   343	.hero-term__out--ink {
   344	  color: var(--ink-1);
   345	}
   346	
   347	.hero-term__out--blue {
   348	  color: var(--term-blue);
   349	}
   350	
   351	.hero-term__out--green {
   352	  color: var(--term-green);
   353	}
   354	
   355	.hero-term__open {

codex
- **Valeurs terminal hardcodées au lieu des tokens source** — Violation de l’AC3, de la contrainte DRY et d’AGENTS.md (« aucune couleur hardcodée ») : la diff déclare `--bg-terminal: hsl(319deg 100% 9%)` et `--border-terminal: hsl(...)` au lieu d’utiliser `var(--aubergine-deep)` et le token terminal existant (`full.diff:51`, `full.diff:57`).

- **Sanctuarisation appliquée globalement, pas uniquement sous le thème clair** — Déviation de l’intention de l’AC3 et de l’architecture technique : le bloc `.home-hero-terminal, .hero-term, .terminal-window, .terminal` n’est pas préfixé par `[data-theme="light"]` (`full.diff:46-58`), ce qui modifie aussi les variables locales en thème sombre et crée une surcharge inutile hors du contexte testé.

- **Preuve de validation Docker non vérifiable dans la diff** — L’AC4 exige l’exécution de `pnpm lint` dans Docker, mais la diff ne contient aucun rapport, log CI ou artefact de cette exécution ; seule une déclaration textuelle est ajoutée dans les notes (`full.diff:120-121`).
tokens used
64 015
- **Valeurs terminal hardcodées au lieu des tokens source** — Violation de l’AC3, de la contrainte DRY et d’AGENTS.md (« aucune couleur hardcodée ») : la diff déclare `--bg-terminal: hsl(319deg 100% 9%)` et `--border-terminal: hsl(...)` au lieu d’utiliser `var(--aubergine-deep)` et le token terminal existant (`full.diff:51`, `full.diff:57`).

- **Sanctuarisation appliquée globalement, pas uniquement sous le thème clair** — Déviation de l’intention de l’AC3 et de l’architecture technique : le bloc `.home-hero-terminal, .hero-term, .terminal-window, .terminal` n’est pas préfixé par `[data-theme="light"]` (`full.diff:46-58`), ce qui modifie aussi les variables locales en thème sombre et crée une surcharge inutile hors du contexte testé.

- **Preuve de validation Docker non vérifiable dans la diff** — L’AC4 exige l’exécution de `pnpm lint` dans Docker, mais la diff ne contient aucun rapport, log CI ou artefact de cette exécution ; seule une déclaration textuelle est ajoutée dans les notes (`full.diff:120-121`).

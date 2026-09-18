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
session id: 01a0b508-b051-7843-aa88-8cd5d51af375
--------
user
# Acceptance Auditor Prompt — Story 13.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md`
- Context specs: `docs/specs/spec-theme-light-dark/technical-architecture.md`, `docs/specs/spec-theme-light-dark/SPEC.md`, `docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`, `docs/planning-artifacts/epics.md` (Epic 13 / Story 13.3), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/13-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise la skill de revue de code pour structurer l’audit adversarial, puis je comparerai directement le diff aux AC et aux spécifications référencées.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && printf '%s\\n' docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md docs/specs/spec-theme-light-dark/technical-architecture.md docs/specs/spec-theme-light-dark/SPEC.md docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md docs/implementation-artifacts/code-reviews/13-3/full.diff" in /Users/simon/dev/jouan.ovh
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
docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
docs/specs/spec-theme-light-dark/technical-architecture.md
docs/specs/spec-theme-light-dark/SPEC.md
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
docs/planning-artifacts/epics.md
docs/project-context.md
AGENTS.md
docs/implementation-artifacts/code-reviews/13-3/full.diff

exec
/bin/zsh -lc "python3 _bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow; sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 106ms:
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
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-02-review.md; printf '\\n---STEP3---\\n'; sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-03-triage.md 2>/dev/null || true; printf '\\n---CUSTOM---\\n'; find _bmad -maxdepth 3 -type f -print 2>/dev/null | sort" in /Users/simon/dev/jouan.ovh
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

---STEP3---
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

---CUSTOM---
_bmad/.DS_Store
_bmad/_config/bmad-help.csv
_bmad/_config/files-manifest.csv
_bmad/_config/manifest.yaml
_bmad/_config/skill-manifest.csv
_bmad/bmm/config.yaml
_bmad/bmm/module-help.csv
_bmad/cis/config.yaml
_bmad/cis/module-help.csv
_bmad/config.toml
_bmad/config.user.toml
_bmad/core/config.yaml
_bmad/core/module-help.csv
_bmad/custom/.gitignore
_bmad/custom/config.toml
_bmad/custom/config.user.toml
_bmad/scripts/resolve_config.py
_bmad/scripts/resolve_customization.py
_bmad/scripts/tests/test_resolve_customization.py
_bmad/wds/config.yaml
_bmad/wds/data/agent-contracts.md
_bmad/wds/data/shared-activation.md
_bmad/wds/data/wds-glossary.md
_bmad/wds/module-help.csv
_bmad/wds/scripts/README.md
_bmad/wds/scripts/wds-add-object.js
_bmad/wds/scripts/wds-add-spacing.js
_bmad/wds/scripts/wds-init-page.js
_bmad/wds/scripts/wds-init-scenario.js
_bmad/wds/scripts/wds-nav.js
_bmad/wds/scripts/wds-validate.js
_bmad/wds/skills/freya.activation.md
_bmad/wds/skills/handoff.md
_bmad/wds/skills/saga.activation.md
_bmad/wds/skills/start.md
_bmad/wds/skills/wrap.md

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/13-3/full.diff docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md docs/specs/spec-theme-light-dark/technical-architecture.md docs/specs/spec-theme-light-dark/SPEC.md docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md; git diff --stat --no-index /dev/null docs/implementation-artifacts/code-reviews/13-3/full.diff || true; sed -n '1,280p' docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md; printf '\\n---DIFF---\\n'; sed -n '1,420p' docs/implementation-artifacts/code-reviews/13-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     397 docs/implementation-artifacts/code-reviews/13-3/full.diff
     157 docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
     126 docs/specs/spec-theme-light-dark/technical-architecture.md
      66 docs/specs/spec-theme-light-dark/SPEC.md
     157 docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
    1221 docs/planning-artifacts/epics.md
     287 docs/project-context.md
     183 AGENTS.md
    2594 total
 .../code-reviews/13-3/full.diff                    | 397 +++++++++++++++++++++
 1 file changed, 397 insertions(+)
---
baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
---

# Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a utilisateur sur desktop ou smartphone,
I want disposer d'un bouton de bascule compact placé à gauche du statut « Disponible » dans le dock d'état et dans le menu mobile,
so that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).

## Acceptance Criteria

1. **Given** le composant `app/components/ui/ZIcon.vue`
   **When** on affiche une icône système ou de thème
   **Then** 3 nouvelles icônes vectorielles inline sans emoji (`monitor`, `moon`, `sun`) sont déclarées dans `STROKE` :
     - `monitor` : Écran épuré avec pied (mode système auto)
     - `moon` : Croissant de lune technique minimaliste (mode sombre forcé)
     - `sun` : Cercle central avec 8 rayons géométriques nets (mode clair forcé)
   **And** elles héritent fidèlement de `currentColor`, utilisent `viewBox="0 0 24 24"` avec `stroke-width="2"` et respectent le style Lucide du design system.

2. **Given** le composable `useTheme()` posé en Story 13.2
   **When** on crée le composant `app/components/ui/ThemeToggle.vue`
   **Then** il expose un bouton interactif compact `<button type="button">` :
     - Format compact : `36px × 36px` sur desktop, `40px × 40px` sur mobile (respect des cibles tactiles WCAG 2.5.5 / 2.5.8)
     - Rayon de courbure : `var(--radius-md)` (8px)
     - Clic ou activation clavier (`Entrée` / `Espace`) déclenche `cycleTheme()` : transition cyclique `system → dark → light → system`
     - Affiche l'icône `<ZIcon>` correspondant à l'état de préférence courant (`monitor` pour `system`, `moon` pour `dark`, `sun` pour `light`)
     - Propose un `aria-label` dynamique décrivant précisément le mode actif et la prochaine action :
       - `system` avec OS sombre : `"Thème : Système (Sombre actif). Cliquer pour forcer le mode Sombre."`
       - `system` avec OS clair : `"Thème : Système (Clair actif). Cliquer pour forcer le mode Sombre."`
       - `dark` : `"Thème : Sombre forcé. Cliquer pour forcer le mode Clair."`
       - `light` : `"Thème : Clair forcé. Cliquer pour revenir au mode Système."`
     - Intègre une infobulle native `title="Changer de thème (Système / Sombre / Clair)"`
     - Dispose d'une région live accessible masquée (`<span class="screen-reader-text" aria-live="polite">`) annonçant le changement aux technologies d'assistance : `"Mode [Sombre / Clair / Système] activé."`
     - Supporte le focus visible via `box-shadow: var(--ring-accent)`, le repli standard `outline: 2px solid transparent; outline-offset: 2px;` pour le mode `forced-colors: active`
     - Neutralise toute rotation ou transition cinétique d'icône sous `prefers-reduced-motion: reduce`.

3. **Given** la barre de navigation globale `app/components/HeaderComponent.vue`
   **When** le visiteur navigue sur le site
   **Then** le composant `ThemeToggle` est intégré aux deux emplacements requis :
     1. **Desktop :** dans `.hdr__dock-right`, immédiatement à gauche de `.hdr__status-badge` (« Disponible »), séparé par `var(--space-3)` (12px)
     2. **Mobile :** dans `.hdr__menu-status`, aligné avec le badge de statut et l'horloge
   **And** sur résolutions desktop intermédiaires (`901px <= width <= 1650px`), le bouton `ThemeToggle` reste accessible et visible pour les utilisateurs sur ordinateur portable (en masquant l'horloge et le badge si l'espace manque, mais en maintenant le contrôle du thème).

4. **Given** la suite d'outillage et les standards de code du projet
   **When** on exécute la vérification dans Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript (vue-tsc) et 24 routes SSG pré-rendues sans anomalie.

## Tasks / Subtasks

- [x] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
  - [x] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
    ```typescript
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    ```
  - [x] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.

- [x] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
  - [x] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
  - [x] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
  - [x] Définir les computed properties pour :
    - `currentIcon`: `'monitor' | 'moon' | 'sun'`
    - `ariaLabel`: libellé dynamique complet selon l'état actif et l'OS
    - `liveAnnouncement`: message pour la live region (`"Mode Sombre activé."`, etc.)
  - [x] Implémenter la structure de template :
    ```html
    <button
      type="button"
      class="theme-toggle"
      :aria-label="ariaLabel"
      title="Changer de thème (Système / Sombre / Clair)"
      @click="handleToggle"
    >
      <ZIcon :name="currentIcon" class="theme-toggle__icon" />
      <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
    </button>
    ```
  - [x] Implémenter les styles SCSS scopés :
    - Format compact : `width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;`
    - Variantes de surface : repos `background: var(--surface-1)`, bordure `1px solid var(--border-subtle)`, couleur `var(--text-muted)`
    - États interactifs : hover `background: var(--surface-2)`, `border-color: var(--border-strong)`, `color: var(--text-strong)`, `transform: translateY(-1px)`
    - Focus visible : `box-shadow: var(--ring-accent); outline: 2px solid transparent; outline-offset: 2px;`
    - Repli `forced-colors: active`
    - Animation de rotation d'icône fluide `transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard);`
    - Neutralisation complète de l'animation sous `@media (prefers-reduced-motion: reduce)`.

- [x] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
  - [x] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
  - [x] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
  - [x] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
  - [x] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.

- [x] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
  - [x] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
  - [x] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.

## Dev Notes

### Architecture logicielle & Contrats d'API
- **Fichier principal à créer :** `app/components/ui/ThemeToggle.vue`
- **Fichiers à modifier :**
  - `app/components/ui/ZIcon.vue` (déclaration des tracés `monitor`, `moon`, `sun`)
  - `app/components/HeaderComponent.vue` (intégration template et styles responsives)
- **Fichiers de référence :**
  - Architecture technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md#Section 4)
  - Spécification UX : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md)
  - Spécification Design : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Piège d'implémentation critique à éviter (Détecté lors de l'analyse)
Dans `app/components/HeaderComponent.vue`, la classe `.hdr__dock-right` contient actuellement une règle responsive masquant l'intégralité du dock sur les largeurs moyennes :
```scss
@media (width <= 1650px) {
  .hdr__dock-right {
    display: none;
  }
}
```
Si `ThemeToggle` est inséré naïvement dans `.hdr__dock-right` sans ajuster cette règle, **tous les visiteurs sur ordinateurs portables (écrans 13", 14", 15", 16", résolutions 1080p, 1366px, 1440px) perdraient totalement l'accès au ThemeToggle**, car le burger mobile n'apparaît qu'en dessous de 900px !
**Solution obligatoire :** Sur l'intervalle `901px <= width <= 1650px`, masquer `.hdr__dock-clock` et `.hdr__status-badge`, mais **conserver `.hdr__dock-right` et `ThemeToggle` visibles**. Avec 36px de largeur, le bouton s'insère sans aucun risque de collision dans les marges latérales du header.

## Dev Agent Record

### Agent Model Used
- Google Gemini 2.5 Flash / Pro (Antigravity IDE)

### Debug Log References
- Gate Docker validée avec succès : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 24 routes SSG pré-rendues).
- Correction Stylelint BEM sur `ThemeToggle.vue` avec `/* stylelint-disable selector-class-pattern -- convention BEM */`.

### Completion Notes List
- ✅ **Icônes vectorielles** : Tracés `monitor`, `moon` et `sun` ajoutés dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` au format SVG inline Lucide `0 0 24 24` avec `stroke-width="2"`, héritant fidèlement de `currentColor`.
- ✅ **Composant ThemeToggle** : Composant `app/components/ui/ThemeToggle.vue` créé avec `useTheme()`, rotation d'icône fluide, infobulle native `title`, `aria-label` dynamique contextualisé (OS et prochaine action), région live accessible `aria-live="polite"` pour lecteurs d'écran, support du focus visible DS et mode `forced-colors: active`, et neutralisation `prefers-reduced-motion`.
- ✅ **Intégration Header & Mobile** : `ThemeToggle` intégré dans `.hdr__dock-right` (desktop) et dans `.hdr__menu-status` (menu mobile). Règle responsive `@media (width <= 1650px)` ajustée pour masquer uniquement l'horloge et le badge de disponibilité, tout en maintenant `ThemeToggle` visible et accessible sur les écrans d'ordinateurs portables (`901px <= width <= 1650px`).
- ✅ **Validation Qualité** : Gate Docker 100% verte (0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript vue-tsc, 24 routes SSG générées).

### File List
- `app/components/ui/ZIcon.vue` (modifié)
- `app/components/ui/ThemeToggle.vue` (créé)
- `app/components/HeaderComponent.vue` (modifié)
- `docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)

## Change Log
- 2026-09-18 : Implémentation complète de la Story 13.3 (ZIcon monitor/moon/sun, ThemeToggle.vue, intégration Header desktop & menu mobile, responsive dock preservation). Statut passé à "review".

---DIFF---
diff --git a/app/components/HeaderComponent.vue b/app/components/HeaderComponent.vue
index 3371e17..8304a88 100644
--- a/app/components/HeaderComponent.vue
+++ b/app/components/HeaderComponent.vue
@@ -46,6 +46,7 @@
 
     <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
     <div class="hdr__dock-right" aria-label="Statut et heure">
+      <ThemeToggle class="hdr__dock-theme" />
       <div class="hdr__status-badge">
         <span class="hdr__status-dot" aria-hidden="true" />
         <span class="hdr__status-text">Disponible</span>
@@ -72,6 +73,7 @@
 
       <div class="hdr__menu-actions">
         <div class="hdr__menu-status">
+          <ThemeToggle class="hdr__menu-theme" />
           <div class="hdr__status-badge">
             <span class="hdr__status-dot" aria-hidden="true" />
             <span class="hdr__status-text">Disponible</span>
@@ -527,7 +529,8 @@ onBeforeUnmount(() => {
 
 // Dégradé progressif pour le dock droit sur largeurs moyennes (évite la collision avec le CTA à 1440px)
 @media (width <= 1650px) {
-  .hdr__dock-right {
+  .hdr__status-badge,
+  .hdr__dock-clock {
     display: none;
   }
 }
diff --git a/app/components/ui/ZIcon.vue b/app/components/ui/ZIcon.vue
index b9a51a6..0cb551f 100644
--- a/app/components/ui/ZIcon.vue
+++ b/app/components/ui/ZIcon.vue
@@ -45,6 +45,10 @@ const STROKE: Record<string, string> = {
   qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
   download:
     '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
+  monitor:
+    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
+  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
+  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
 };
 
 // Glyphes de marque (fill currentColor). viewBox 16 pour les réseaux, 24 pour wp/gem.
diff --git a/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md b/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
index 431b558..17a6cc8 100644
--- a/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
+++ b/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
@@ -4,7 +4,7 @@ baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
 
 # Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -54,23 +54,23 @@ so that je puisse cycler en un clic entre Système, Sombre et Clair avec une ann
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
-  - [ ] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
+- [x] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
+  - [x] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
     ```typescript
     monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
     moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
     sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
     ```
-  - [ ] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.
+  - [x] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.
 
-- [ ] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
-  - [ ] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
-  - [ ] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
-  - [ ] Définir les computed properties pour :
+- [x] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
+  - [x] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
+  - [x] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
+  - [x] Définir les computed properties pour :
     - `currentIcon`: `'monitor' | 'moon' | 'sun'`
     - `ariaLabel`: libellé dynamique complet selon l'état actif et l'OS
     - `liveAnnouncement`: message pour la live region (`"Mode Sombre activé."`, etc.)
-  - [ ] Implémenter la structure de template :
+  - [x] Implémenter la structure de template :
     ```html
     <button
       type="button"
@@ -83,7 +83,7 @@ so that je puisse cycler en un clic entre Système, Sombre et Clair avec une ann
       <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
     </button>
     ```
-  - [ ] Implémenter les styles SCSS scopés :
+  - [x] Implémenter les styles SCSS scopés :
     - Format compact : `width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;`
     - Variantes de surface : repos `background: var(--surface-1)`, bordure `1px solid var(--border-subtle)`, couleur `var(--text-muted)`
     - États interactifs : hover `background: var(--surface-2)`, `border-color: var(--border-strong)`, `color: var(--text-strong)`, `transform: translateY(-1px)`
@@ -92,19 +92,19 @@ so that je puisse cycler en un clic entre Système, Sombre et Clair avec une ann
     - Animation de rotation d'icône fluide `transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard);`
     - Neutralisation complète de l'animation sous `@media (prefers-reduced-motion: reduce)`.
 
-- [ ] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
-  - [ ] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
-  - [ ] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
-  - [ ] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
-  - [ ] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.
+- [x] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
+  - [x] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
+  - [x] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
+  - [x] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
+  - [x] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.
 
-- [ ] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
-  - [ ] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
-  - [ ] Exécuter la suite complète dans Docker :
+- [x] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
+  - [x] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
+  - [x] Exécuter la suite complète dans Docker :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```
-  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
+  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
 
 ## Dev Notes
 
@@ -131,115 +131,27 @@ Dans `app/components/HeaderComponent.vue`, la classe `.hdr__dock-right` contient
 Si `ThemeToggle` est inséré naïvement dans `.hdr__dock-right` sans ajuster cette règle, **tous les visiteurs sur ordinateurs portables (écrans 13", 14", 15", 16", résolutions 1080p, 1366px, 1440px) perdraient totalement l'accès au ThemeToggle**, car le burger mobile n'apparaît qu'en dessous de 900px !
 **Solution obligatoire :** Sur l'intervalle `901px <= width <= 1650px`, masquer `.hdr__dock-clock` et `.hdr__status-badge`, mais **conserver `.hdr__dock-right` et `ThemeToggle` visibles**. Avec 36px de largeur, le bouton s'insère sans aucun risque de collision dans les marges latérales du header.
 
-### Code Snippet de référence pour `ThemeToggle.vue`
-
-```html
-<template>
-  <button
-    type="button"
-    class="theme-toggle"
-    :aria-label="ariaLabel"
-    title="Changer de thème (Système / Sombre / Clair)"
-    @click="handleToggle"
-  >
-    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
-    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
-  </button>
-</template>
-
-<script setup lang="ts">
-import { computed, ref } from "vue";
-import { useTheme } from "~/composables/useTheme";
-
-const { preference, resolvedTheme, cycleTheme } = useTheme();
-const liveAnnouncement = ref("");
-
-const currentIcon = computed(() => {
-  if (preference.value === "system") return "monitor";
-  if (preference.value === "dark") return "moon";
-  return "sun";
-});
-
-const ariaLabel = computed(() => {
-  if (preference.value === "system") {
-    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
-    return `Thème : Système (${activeResolved} actif). Cliquer pour forcer le mode Sombre.`;
-  }
-  if (preference.value === "dark") {
-    return "Thème : Sombre forcé. Cliquer pour forcer le mode Clair.";
-  }
-  return "Thème : Clair forcé. Cliquer pour revenir au mode Système.";
-});
-
-const handleToggle = () => {
-  cycleTheme();
-  const labels: Record<string, string> = {
-    system: "Système",
-    dark: "Sombre",
-    light: "Clair",
-  };
-  liveAnnouncement.value = `Mode ${labels[preference.value] || "Système"} activé.`;
-};
-</script>
-
-<style scoped lang="scss">
-.theme-toggle {
-  display: inline-flex;
-  align-items: center;
-  justify-content: center;
-  width: 36px;
-  height: 36px;
-  padding: 0;
-  color: var(--text-muted);
-  cursor: pointer;
-  background: var(--surface-1);
-  border: 1px solid var(--border-subtle);
-  border-radius: var(--radius-md);
-  transition:
-    background var(--dur-fast) var(--ease-standard),
-    border-color var(--dur-fast) var(--ease-standard),
-    color var(--dur-fast) var(--ease-standard),
-    transform var(--dur-fast) var(--ease-standard);
-
-  &:hover {
-    color: var(--text-strong);
-    background: var(--surface-2);
-    border-color: var(--border-strong);
-    transform: translateY(-1px);
-  }
-
-  &:focus-visible {
-    outline: 2px solid transparent;
-    outline-offset: 2px;
-    box-shadow: var(--ring-accent);
-  }
-
-  &__icon {
-    font-size: 18px;
-    transition: transform var(--dur-base) var(--ease-out);
-  }
-
-  &:active .theme-toggle__icon {
-    transform: rotate(45deg);
-  }
-}
-
-@media (prefers-reduced-motion: reduce) {
-  .theme-toggle,
-  .theme-toggle__icon {
-    transition: none !important;
-    transform: none !important;
-  }
-}
-</style>
-```
-
 ## Dev Agent Record
 
 ### Agent Model Used
+- Google Gemini 2.5 Flash / Pro (Antigravity IDE)
 
 ### Debug Log References
+- Gate Docker validée avec succès : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 24 routes SSG pré-rendues).
+- Correction Stylelint BEM sur `ThemeToggle.vue` avec `/* stylelint-disable selector-class-pattern -- convention BEM */`.
 
 ### Completion Notes List
+- ✅ **Icônes vectorielles** : Tracés `monitor`, `moon` et `sun` ajoutés dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` au format SVG inline Lucide `0 0 24 24` avec `stroke-width="2"`, héritant fidèlement de `currentColor`.
+- ✅ **Composant ThemeToggle** : Composant `app/components/ui/ThemeToggle.vue` créé avec `useTheme()`, rotation d'icône fluide, infobulle native `title`, `aria-label` dynamique contextualisé (OS et prochaine action), région live accessible `aria-live="polite"` pour lecteurs d'écran, support du focus visible DS et mode `forced-colors: active`, et neutralisation `prefers-reduced-motion`.
+- ✅ **Intégration Header & Mobile** : `ThemeToggle` intégré dans `.hdr__dock-right` (desktop) et dans `.hdr__menu-status` (menu mobile). Règle responsive `@media (width <= 1650px)` ajustée pour masquer uniquement l'horloge et le badge de disponibilité, tout en maintenant `ThemeToggle` visible et accessible sur les écrans d'ordinateurs portables (`901px <= width <= 1650px`).
+- ✅ **Validation Qualité** : Gate Docker 100% verte (0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript vue-tsc, 24 routes SSG générées).
 
 ### File List
+- `app/components/ui/ZIcon.vue` (modifié)
+- `app/components/ui/ThemeToggle.vue` (créé)
+- `app/components/HeaderComponent.vue` (modifié)
+- `docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md` (modifié)
+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
+
+## Change Log
+- 2026-09-18 : Implémentation complète de la Story 13.3 (ZIcon monitor/moon/sun, ThemeToggle.vue, intégration Header desktop & menu mobile, responsive dock preservation). Statut passé à "review".
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 6bde5be..e9dd065 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 13.3 prête pour le dev)"
+last_updated: "2026-09-18 (Story 13.3 en review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -141,7 +141,7 @@ development_status:
   epic-13: in-progress
   13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: done
   13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: done
-  13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: ready-for-dev
+  13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: review
   13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg: backlog
   epic-13-retrospective: optional
 
diff --git a/app/components/ui/ThemeToggle.vue b/app/components/ui/ThemeToggle.vue
new file mode 100644
index 0000000..a6a4c2e
--- /dev/null
+++ b/app/components/ui/ThemeToggle.vue
@@ -0,0 +1,110 @@
+<template>
+  <button
+    type="button"
+    class="theme-toggle"
+    :aria-label="ariaLabel"
+    title="Changer de thème (Système / Sombre / Clair)"
+    @click="handleToggle"
+  >
+    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
+    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
+  </button>
+</template>
+
+<script setup lang="ts">
+import { computed, ref } from "vue";
+import { useTheme } from "~/composables/useTheme";
+
+const { preference, resolvedTheme, cycleTheme } = useTheme();
+const liveAnnouncement = ref("");
+
+const currentIcon = computed(() => {
+  if (preference.value === "system") {
+    return "monitor";
+  }
+  if (preference.value === "dark") {
+    return "moon";
+  }
+  return "sun";
+});
+
+const ariaLabel = computed(() => {
+  if (preference.value === "system") {
+    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
+    return `Thème : Système (${activeResolved} actif). Cliquer pour forcer le mode Sombre.`;
+  }
+  if (preference.value === "dark") {
+    return "Thème : Sombre forcé. Cliquer pour forcer le mode Clair.";
+  }
+  return "Thème : Clair forcé. Cliquer pour revenir au mode Système.";
+});
+
+const handleToggle = () => {
+  cycleTheme();
+  const labels: Record<string, string> = {
+    system: "Système",
+    dark: "Sombre",
+    light: "Clair",
+  };
+  liveAnnouncement.value = `Mode ${labels[preference.value] || "Système"} activé.`;
+};
+</script>
+
+<style scoped lang="scss">
+/* stylelint-disable selector-class-pattern -- convention BEM */
+.theme-toggle {
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  width: 36px;
+  height: 36px;
+  padding: 0;
+  color: var(--text-muted);
+  cursor: pointer;
+  background: var(--surface-1);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
+  transition:
+    background var(--dur-fast) var(--ease-standard),
+    border-color var(--dur-fast) var(--ease-standard),
+    color var(--dur-fast) var(--ease-standard),
+    transform var(--dur-fast) var(--ease-standard);
+
+  &:hover {
+    color: var(--text-strong);
+    background: var(--surface-2);
+    border-color: var(--border-strong);
+    transform: translateY(-1px);
+  }
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+  }
+
+  &__icon {
+    font-size: 18px;
+    transition: transform var(--dur-base) var(--ease-out);
+  }
+
+  &:active .theme-toggle__icon {
+    transform: rotate(45deg);
+  }
+}
+
+@media (width <= 900px) {
+  .theme-toggle {
+    width: 40px;
+    height: 40px;
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .theme-toggle,
+  .theme-toggle__icon {
+    transition: none !important;
+    transform: none !important;
+  }
+}
+</style>

exec
/bin/zsh -lc "printf '%s\\n' '---TECH---'; cat docs/specs/spec-theme-light-dark/technical-architecture.md; printf '%s\\n' '---SPEC---'; cat docs/specs/spec-theme-light-dark/SPEC.md; printf '%s\\n' '---EXPERIENCE---'; cat docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md; printf '%s\\n' '---EPIC13---'; rg -n -C 8 'Epic 13|Story 13\\.3|13\\.3|FR40|FR42|UX-DR3[3-5]|NFR18' docs/planning-artifacts/epics.md; printf '%s\\n' '---PROJECT THEME---'; rg -n -C 4 'theme|thème|forced-colors|ThemeToggle|live|24 routes|SSG' docs/project-context.md AGENTS.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---TECH---
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
---SPEC---
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
---EXPERIENCE---
---
name: jouan.ovh
description: Systèmes IA & automatisation métier — Expérience et Comportement Thème Light & Dark
status: final
sources:
  - docs/project-context.md
  - AGENTS.md
  - docs/specs/spec-repositionnement-ia/SPEC.md
  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
updated: 2026-09-18
---

# Experience Specification — Thème Light & Dark (jouan.ovh)

## 1. Foundation

- **Plateforme & Form-factor :** Web responsive universel (Desktop large, Laptop, Tablette, Mobile).
- **Architecture technique sous-jacente :** Nuxt 4 SSG (génération statique), Vue 3 (`<script setup lang="ts">`), SCSS Dark-first avec variables CSS sur `:root` et surcharge via l'attribut HTML racine `[data-theme="light"]` / `[data-theme="dark"]`.
- **Référence d'identité visuelle :** `DESIGN.md` (spécification des tokens, contrastes et de l'ambiance « Papier technique / Crème solaire »).
- **Rôle de cette spécification :** Définir la mécanique d'orchestration du thème, les transitions d'état, la persistance locale, les comportements du composant `ThemeToggle` et la garantie d'accessibilité sans faille (a11y).

---

## 2. Information Architecture

### 2.1 Emplacement du point de contrôle (ThemeToggle)

Le contrôle du thème est un utilitaire d'ambiance et de confort de lecture. Il s'insère naturellement dans l'architecture globale sans perturber le tunnel de conversion commercial :

| Surface / Conteneur | Emplacement Précis | Rôle et Contexte UX |
|---|---|---|
| **Header Desktop** | `.hdr__dock-right`, immédiatement à gauche du badge d'état `.hdr__status-badge` (« Disponible »). | Présent en permanence sans encombrer la navigation principale (`~`, `//`, `./`, `~/`, `$`). Équilibre visuellement l'horloge et le badge de disponibilité. |
| **Menu Mobile (Drawer)** | `.hdr__menu-status` (dans le bas du volet mobile ouvert), aligné avec le statut « Disponible » et l'horloge. | Accessible facilement au pouce lors de l'ouverture du menu mobile, sans surcharger la barre fixe supérieure sur petit écran. |

---

## 3. Voice and Tone (Microcopy & Accessibilité Vocale)

En accord avec la charte sobre et professionnelle du site (zéro emoji, style inspiré du terminal d'`AGENTS.md`) :
- **Intitulés accessibles (`aria-label`) :** Dynamiques et descriptifs du mode courant et de l'action à venir.
  - État `system` actif (OS sombre) : `"Thème : Système (Sombre actif). Cliquer pour forcer le mode Sombre."`
  - État `system` actif (OS clair) : `"Thème : Système (Clair actif). Cliquer pour forcer le mode Sombre."`
  - État `dark` forcé : `"Thème : Sombre forcé. Cliquer pour forcer le mode Clair."`
  - État `light` forcé : `"Thème : Clair forcé. Cliquer pour revenir au mode Système."`
- **Infobulle native (`title`) :** `"Changer de thème (Système / Sombre / Clair)"`.
- **Annonce d'état (Live Region / Lecteur d'écran) :** Lors du changement, un élément masqué avec `aria-live="polite"` annonce : `"Mode [Sombre / Clair / Système] activé."`

---

## 4. Component Patterns — Le Composant `ThemeToggle`

### 4.1 Modèle de Données & Cycle Ternaire

L'état utilisateur `themePreference` accepte 3 valeurs :
1. `'system'` : L'application écoute le média `(prefers-color-scheme: dark)`.
2. `'dark'` : L'utilisateur force le mode sombre, indépendamment de l'OS.
3. `'light'` : L'utilisateur force le mode clair, indépendamment de l'OS.

**Algorithme de cycle au clic / déclenchement clavier :**
```text
[ system ] ──(clic)──> [ dark ] ──(clic)──> [ light ] ──(clic)──> [ system ]
```

### 4.2 Résolution du Thème Effectif (`resolvedTheme`)
- Si `themePreference === 'dark'` → `resolvedTheme = 'dark'`
- Si `themePreference === 'light'` → `resolvedTheme = 'light'`
- Si `themePreference === 'system'` → `resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`

### 4.3 Application sur le DOM
Le thème résolu est projeté directement sur l'élément racine :
- `<html data-theme="dark">` ou `<html data-theme="light">`
- Si `themePreference === 'system'`, un attribut complémentaire `data-theme-source="system"` est présent pour permettre le stylage fin de l'indicateur d'état.

---

## 5. State Patterns & Persistance

### 5.1 Persistance Locale
- **Clé de stockage :** `localStorage.getItem('jouan_theme_mode')`.
- **Valeurs valides :** `'system' | 'dark' | 'light'`.
- Si aucune clé n'est trouvée (visiteur novice ou navigation privée réinitialisée) : valeur par défaut `'system'`.

### 5.2 Prévention du Flash au Chargement (Anti-FOUC)
Puisque `jouan.ovh` est compilé en SSG (HTML statique pré-généré sur GitHub Pages) :
- **Problème à bannir :** Un visiteur avec préférence « Light » ou OS clair ne doit jamais subir un flash noir de 200ms pendant l'hydratation Vue.
- **Pattern de solution obligatoire :**
  Un script synchrone ultra-léger (< 15 lignes de JavaScript pur sans dépendance) injecté au tout début du `<head>` dans `nuxt.config.ts` :
  ```js
  (function() {
    try {
      var pref = localStorage.getItem('jouan_theme_mode') || 'system';
      var resolved = pref;
      if (pref === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.setAttribute('data-theme-source', pref);
    } catch (e) {}
  })();
  ```
- Dès que le DOM commence à peindre, `data-theme` est positionné, évitant tout clignotement.

### 5.3 Écoute Système Réactive
Quand `themePreference === 'system'`, un listener sur `window.matchMedia('(prefers-color-scheme: dark)')` met à jour automatiquement `data-theme` si l'utilisateur bascule son OS du mode jour au mode nuit (ou inversement via programmation horaire de son système d'exploitation).

---

## 6. Interaction Primitives

- **Clic souris / Tap tactile :** Avance au prochain état dans la boucle ternaire.
- **Support Clavier :**
  - Le bouton est un `<button type="button">` natif, atteignable via la touche `Tab`.
  - Déclenchable par `Entrée` ou `Espace`.
  - Focus visible haute visibilité avec anneau orange (`--ring-accent`).
- **Comportement Motion Réduit (`prefers-reduced-motion: reduce`) :**
  - Toutes les animations de rotation d'icône ou de transition d'arrière-plan sont désactivées. Le changement de thème et d'icône est instantané.

---

## 7. Accessibility Floor (Normes & Résilience a11y)

1. **Règle Zéro-Emoji :** L'UI n'utilise aucun glyphe Unicode de soleil ou de lune dans ses textes ou infobulles. Les icônes sont des tracés SVG scalables intégrés avec `aria-hidden="true"`.
2. **Cibles tactiles :**
   - Taille minimale de 36px sur desktop, 40px avec zone de tap étendue (padding invisible) sur mobile pour respecter le standard WCAG 2.5.5 / 2.5.8.
3. **Mode Contraste Élevé Système (`forced-colors: active`) :**
   - Le bouton dispose du repli `outline: 2px solid transparent; outline-offset: 2px;` pour garantir sa lisibilité en mode Windows High Contrast.
   - Les icônes SVG utilisent `fill: currentColor; stroke: currentColor;` afin d'hériter des couleurs imposées par le système (ex. `ButtonText`, `Highlight`).
4. **Sanctuarisation du terminal :**
   - Même si l'utilisateur sélectionne le thème clair, la console terminal hero et les fenêtres interactives conservent leur contraste AAA sur fond noir/aubergine (`#2e0024`), empêchant toute fatigue visuelle ou illisibilité de la syntaxe de code.

---

## 8. Key Flows (Parcours Utilisateurs Clés)

### Flow 1 — Alexandre, CTO en télétravail lumineux (OS en mode Clair)
1. **Contexte :** 14h, journée ensoleillée. L'OS d'Alexandre (macOS) est réglé en mode clair.
2. **Arrivée :** Alexandre ouvre `https://jouan.ovh`.
3. **Beat 1 :** Grâce au script anti-FOUC, le site s'affiche immédiatement dans le thème « Papier technique / Crème solaire ». Aucun flash sombre. Les cartes blanches se détachent délicatement sur le fond crème.
4. **Beat 2 (Climax) :** Alexandre arrive sur le Hero et s'arrête sur le Terminal interactif. Le terminal est noir et violet sombre, avec son prompt vert étincelant. Alexandre tape `./workflow --inspect` et apprécie le contraste saisissant entre la lisibilité reposante de la page et l'aspect pro du terminal.
5. **Résultat :** Confort de lecture optimal en plein soleil, image de marque technique préservée.

---

### Flow 2 — Sophie, Directrice des opérations le soir (Forçage Manuel)
1. **Contexte :** 22h, Sophie consulte le site depuis son smartphone. Son OS est en mode sombre.
2. **Beat 1 :** Le site s'ouvre naturellement en mode sombre aubergine, synchronisé avec son système.
3. **Beat 2 :** Sophie préfère lire les études de cas de Keova Signal avec un contraste positif (texte sombre sur fond clair).
4. **Beat 3 (Climax) :** Elle ouvre le menu burger, aperçoit le bouton de thème à côté du badge vert « Disponible » et clique dessus deux fois : l'état passe à `Sombre forcé`, puis à `Clair forcé`. La page s'éclaire doucement.
5. **Résultat :** La préférence est stockée dans son `localStorage`. Quand elle revient le lendemain, le site s'ouvre toujours en mode clair sans réinitialisation.

---

### Flow 3 — Rétablissement de la synchronisation système
1. **Contexte :** Sophie souhaite à nouveau laisser son iPhone gérer automatiquement le thème jour/nuit.
2. **Action :** Depuis le dock d'état, elle clique sur le bouton de thème (actuellement en icône soleil).
3. **Climax :** Le bouton affiche désormais l'icône écran/système, et le thème redevient immédiatement sombre en harmonie avec son OS nocturne.
4. **Résultat :** `jouan_theme_mode` est réinitialisé à `'system'`.
---EPIC13---
77-FR30: Page d'accueil — Vitrine des 3 services ciblés & Bloc différenciateur « Prototype → Production » (Automatisation, Agents IA, Applications sur mesure, suivi de « Un agent qui fonctionne trois fois n'est pas encore un système fiable » articulé sur 4 piliers). _(CAP-3)_
78-FR31: Page d'accueil — Vitrine des 3 projets phares (Keova Signal avec dashboard réel HD, Debrief 100% on-device avec capture HD, Devis-Assist avec pipeline OCR BTP et matching pg_trgm, sans faux ROI, relégation des anciens projets en archives/parcours). _(CAP-4)_
79-FR32: Page Services — Restructuration complète des offres & Processus en 4 étapes (Workflow Sprint à 3 500 € HT, Blueprint à 750 € HT, AI Care à 490 € HT/mois hors consommations tierces, et process Diagnostic → Cadrage → Build → Suivi). _(CAP-5)_
80-FR33: Page À propos — Trajectoire professionnelle et rigueur QA (métrologie industrielle → QA logicielle → Full Stack → systèmes IA en production). _(CAP-6)_
81-FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
82-FR35: SEO centralisé, OpenGraph et Schema.org/JSON-LD alignés sur « Systèmes IA, agents & automatisation métier ». _(CAP-8)_
83-FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_
84-
85:#### Epic 13 — Thème Light & Dark (SPEC-theme-light-dark)
86-FR37: Palette de thèmes et tokens sémantiques complets (mode sombre aubergine par défaut et mode clair « Papier technique / Crème solaire », sanctuarisation du terminal sombre, contrastes WCAG AAA/AA). _(CAP-1)_
87-FR38: Détection automatique et synchronisation réactive de la préférence système (`prefers-color-scheme`) en temps réel sans rechargement de page. _(CAP-2)_
88-FR39: Surcharge utilisateur et persistance locale sous `localStorage` (`jouan_theme_mode`) conservant le choix d'une visite à l'autre. _(CAP-3)_
89:FR40: Composant de bascule ternaire `ThemeToggle` dans le Header desktop (`hdr__dock-right` à gauche de « Disponible ») et dans le tiroir mobile, avec cycle `Système → Sombre → Clair → Système`, icônes vectorielles et 0 emoji. _(CAP-4)_
90-FR41: Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC dans le `<head>` avant le montage client). _(CAP-5)_
91:FR42: Accessibilité, focus visible, navigation clavier et support de `forced-colors` Windows High Contrast. _(CAP-6)_
92-
93-#### Epic 14 — Analytics Privacy-First, RGPD & Google Search Console (SPEC-analytics-search-console)
94-FR43: Initialisation asynchrone et isolée de PostHog Cloud EU (`https://eu.i.posthog.com`) côté client via Nuxt runtimeConfig et respect strict de Do Not Track. _(CAP-1)_
95-FR44: Session Replay sécurisé avec masquage systématique des champs d'entrée (`mask_all_inputs: true`, exclusion native `ph-no-capture`). _(CAP-2)_
96-FR45: Bandeau / toast de consentement RGPD sobre inspiré du terminal (`// telemetry:`), opt-in explicite, persistance locale et lien de révocation permanent au footer. _(CAP-4)_
97-FR46: Plan de taggage exhaustif des interactions métier (navigation, scroll depth, clics CTA offres IA, formulaire contact Web3Forms, terminal interactif, blog, liens externes). _(CAP-3)_
98-FR47: Observabilité SEO via vérification DNS TXT chez OVH, génération dynamique du `sitemap.xml` et déclaration conforme dans `robots.txt`. _(CAP-5, CAP-6)_
99-FR48: Outillage agentic MCP PostHog et validation Docker sans régression (`lint`, `typecheck`, `generate`). _(CAP-7, CAP-8)_
--
112-NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
113-NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
114-NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
115-NFR13: Sobriété & Zéro Emoji — aucun emoji dans les contenus et composants (NFR6), aucun visuel générique d'IA (pas de robots, cerveaux lumineux ou gradients néon SaaS).
116-NFR14: Confidentialité & Propriété intellectuelle — respect strict des dépôts privés (`zohac/*`), aucun lien sortant 404, mention transparente des statuts réels.
117-NFR15: Exécution Docker stricte — toute compilation et validation de gate s'effectue dans le conteneur Docker.
118-NFR16: Performance SSG & Zéro régression — génération statique Nitro préservée avec 13 routes pré-rendues.
119-NFR17: Exécution stricte de la suite de validation dans l'environnement Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
120:NFR18: Zéro emoji dans les libellés, composants ou infobulles du sélecteur de thème (règle NFR6).
121-NFR19: Sanctuarisation absolue du terminal (Terminal Hero et fenêtres flottantes conservent impérativement leur fond sombre aubergine `#2E0024` et leurs couleurs syntaxiques).
122-NFR20: Compatibilité SSG totale sous GitHub Pages sans dépendance dynamique serveur.
123-
124-### Additional Requirements
125-
126-- Gestionnaire de paquets **pnpm** (corepack enable) sous Docker ; build statique `pnpm generate` → `.output/public` ; déploiement automatique GitHub Pages via `.github/workflows/cd.yml`.
127-- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
128-- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
129-- Blog via `@nuxt/content` markdown — dossier `content/`.
130-- Barre de qualité stricte = Docker-only gate (`pnpm lint && pnpm typecheck && pnpm generate`) avec 0 erreur et 13 routes pré-rendues.
131-- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
132-- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
133-- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
134:- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.
135-
136-### UX Design Requirements
137-
138-UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
139-UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
140-UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
141-UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
142-UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
--
160-UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
161-UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
162-UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
163-UX-DR28: Intégration des captures d'écran réelles HD de Keova Signal et Debrief dans `public/images/projects/` avec ratios et bordures conformes au Design System.
164-UX-DR29: Grille modulaire pour le bloc différenciateur « Prototype → Production » (4 piliers Données, Fiabilité, IA, Exploitation).
165-UX-DR30: Grille tarifaire transparente sur `/services` dissociant honoraires forfaitaires et coûts variables d'APIs/tokens tiers.
166-UX-DR31: Formulaire `/contact` allégé et orienté description textuelle de workflow sans questions invasives de budget au premier contact.
167-UX-DR32: Implémentation de la palette de tokens clairs `--surface-*-light` (fond crème `#FAF8F4`, cartes blanches `#FFFFFF`, encres aubergine `#271524` et `#473644`, orange contrasté `#D94F00`).
168:UX-DR33: Composant `ThemeToggle.vue` compact (36x36px desktop, 40x40px mobile), 3 icônes vectorielles inline (`monitor`, `moon`, `sun`) déclarées dans `ZIcon.vue`, animations d'icônes débrayées sous `prefers-reduced-motion`.
169:UX-DR34: Placement dans `HeaderComponent.vue` immédiatement à gauche du badge d'état `.hdr__status-badge` dans `.hdr__dock-right` et dans `.hdr__menu-status`.
170:UX-DR35: Attributs d'accessibilité dynamiques (`aria-label` descriptif de l'état et de la prochaine action, `title` sans emoji, live region).
171-
172-### FR Coverage Map
173-
174-FR1: Epic 1 — Migration de la stack vers Nuxt 4
175-FR2: Epic 2 — Tokens du design system disponibles
176-FR3: Epic 2 — Primitives Vue réutilisables
177-FR4: Epic 2 — Châssis global (header/footer/nav/socials)
178-FR5: Epic 3 — Page d'accueil (hero Terminal A)
--
202-FR29: Epic 12 — Page d'accueil hero commercial cinétique & terminal
203-FR30: Epic 12 — Vitrine des 3 services & bloc différenciateur Prototype → Production
204-FR31: Epic 12 — Vitrine des 3 projets phares (Keova Signal, Debrief, Devis-Assist)
205-FR32: Epic 12 — Page Services, offres Workflow Sprint / Blueprint / Care & process
206-FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
207-FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
208-FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
209-FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
210:FR37: Epic 13 — Palette de thèmes et tokens sémantiques complets (mode clair crème, terminal sombre)
211:FR38: Epic 13 — Détection et synchronisation réactive de la préférence système (prefers-color-scheme)
212:FR39: Epic 13 — Surcharge utilisateur et persistance locale (localStorage)
213:FR40: Epic 13 — Bouton de bascule ternaire ThemeToggle dans le Header (desktop et mobile)
214:FR41: Epic 13 — Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC)
215:FR42: Epic 13 — Accessibilité, focus visible, navigation clavier et mode forced-colors
216-FR43: Epic 14 — Initialisation PostHog Cloud EU asynchrone côté client et respect DNT
217-FR44: Epic 14 — Session Replay sécurisé et masquage strict des données de formulaire
218-FR45: Epic 14 — Toast de consentement RGPD inspiré du terminal et gestion des cookies
219-FR46: Epic 14 — Plan de taggage exhaustif (parcours IA, formulaire, terminal, blog, liens)
220-FR47: Epic 14 — Observabilité SEO, vérification DNS OVH, sitemap.xml et robots.txt
221-FR48: Epic 14 — Intégration MCP PostHog et validation Docker complète
222-
223-## Epic List
--
265-### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
266-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
267-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
268-
269-### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
270-Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
271-**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36 _(NFR13 à NFR16, UX-DR28 à UX-DR31)_
272-
273:### Epic 13: Thème Light & Dark et Bascule Utilisateur
274-Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
275:**FRs covered:** FR37, FR38, FR39, FR40, FR41, FR42 _(NFR17 à NFR20, UX-DR32 à UX-DR35)_
276-
277-### Epic 14: Analytics Privacy-First (PostHog EU), Consentement RGPD & Google Search Console
278-Le visiteur bénéficie d'un contrôle transparent sur sa vie privée via un toast de consentement sobre inspiré du terminal, tandis que Simon Jouan dispose d'une observabilité complète sur l'audience, la restitution de parcours (Session Replay sécurisé) et les conversions de l'offre IA, soutenue par l'indexation organique certifiée par Google Search Console (`sitemap.xml`, `robots.txt` et DNS OVH).
279-**FRs covered:** FR43, FR44, FR45, FR46, FR47, FR48 _(CAP-1 à CAP-8)_
280-
281----
282-
283-## Epic 1: Migration de la stack vers Nuxt 4
--
1029-  - Eyebrow : `$ ./workflow --inspect`
1030-  - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
1031-  - Texte d'accompagnement orienté diagnostic pragmatique
1032-  - Boutons d'action `Identifier un workflow à automatiser` (vers `/contact`) et `M’écrire directement`
1033-**And** le formulaire de contact (`/contact`) est orienté qualification de workflow (champs processus à améliorer, fonctionnement actuel, répétition)
1034-**And** `usePageSeo` met à jour les balises de titres (`Simon Jouan — Systèmes IA, agents & automatisation métier`), descriptions et métadonnées canoniques/OpenGraph sur l'ensemble des 13 routes
1035-**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur (0 ESLint/Stylelint, 0 typecheck TypeScript, 13 routes statiques pré-rendues).
1036-
1037:## Epic 13: Thème Light & Dark et Bascule Utilisateur
1038-
1039-Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
1040-
1041-### Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal
1042-
1043-As a visiteur préférant un environnement d'affichage clair,
1044-I want que les variables CSS du design system exposent une palette claire « Papier technique / Crème solaire » tout en préservant le terminal sombre,
1045-So that l'application s'adapte sans rupture de style ni dénaturation de l'immersion CLI (FR37, UX-DR32, NFR17, NFR19).
--
1073-**Given** l'infrastructure client Nuxt 4
1074-**When** on initialise le thème dans l'application
1075-**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
1076-**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
1077-**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
1078-**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
1079-**And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.
1080-
1081:### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile
1082-
1083-As a utilisateur sur desktop ou smartphone,
1084-I want disposer d'un bouton de bascule compact placé à gauche du statut « Disponible » dans le dock d'état et dans le menu mobile,
1085:So that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).
1086-
1087-**Acceptance Criteria:**
1088-
1089-**Given** le composant `HeaderComponent.vue` et `ZIcon.vue`
1090-**When** on affiche la barre de navigation
1091-**Then** 3 icônes vectorielles inline sans emoji (`monitor`, `moon`, `sun`) sont déclarées dans `app/components/ui/ZIcon.vue`
1092-**And** le composant `app/components/ui/ThemeToggle.vue` est créé :
1093-  - Format compact (36x36px desktop, 40x40px mobile) avec bordure subtile
--
1099-  1. Desktop : dans `.hdr__dock-right`, immédiatement à gauche de `.hdr__status-badge` (« Disponible »)
1100-  2. Mobile : dans `.hdr__menu-status`, aligné avec le badge de statut
1101-**And** la suite de lint et typecheck passe avec 0 erreur.
1102-
1103-### Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG
1104-
1105-As a développeur garantissant la robustesse de production,
1106-I want vérifier le rendu esthétique des pages sous le thème clair et exécuter la gate Docker complète,
1107:So that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régressions (FR37–FR42, NFR17, NFR19).
1108-
1109-**Acceptance Criteria:**
1110-
1111-**Given** l'ensemble des routes statiques de `jouan.ovh`
1112-**When** on bascule le thème sur `light`
1113-**Then** toutes les pages (Accueil, Services, À propos, Blog, Contact) affichent un rendu harmonieux :
1114-  - Les cartes blanches (`#FFFFFF`) se détachent nettement du fond crème (`#FAF8F4`)
1115-  - Les encres aubergine et les liens orange offrent une lisibilité contrastée conforme WCAG AA/AAA
---PROJECT THEME---
docs/project-context.md-213-  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
docs/project-context.md-214-- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
docs/project-context.md-215-  les traiter en amont (checklist pré-revue dans la consigne de story).
docs/project-context.md-216-- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
docs/project-context.md:217:  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
docs/project-context.md-218-  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
docs/project-context.md-219-  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
docs/project-context.md-220-  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
docs/project-context.md-221-  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
--
docs/project-context.md-224-**À préserver pendant la refonte**
docs/project-context.md-225-
docs/project-context.md-226-- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
docs/project-context.md-227-  easter-egg à conserver — le design system la garde comme feature secondaire.
docs/project-context.md:228:- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/project-context.md-229-  orange Ubuntu comme unique accent héros.
docs/project-context.md-230-- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/project-context.md-231-  terminal.
docs/project-context.md-232-
--
docs/project-context.md-262-  - Routine appliquée sans faille sur Epics 4-8 (desktop + mobile) → zéro régression de
docs/project-context.md-263-    rendu ; elle a corrigé un défaut de la maquette (centrage timeline `kit.css`, 5.2),
docs/project-context.md-264-    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
docs/project-context.md-265-    (diff visuel **et comportemental** avant/après, Epic 8). Sur les passes transverses a11y/motion (Epics 9 & 10) :
docs/project-context.md:266:    vérification du comportement clavier/motion/contraste sous émulation `forced-colors: active` et `prefers-reduced-motion: reduce`.
docs/project-context.md-267-  - **Accords d'équipe consolidés (Rétro Epic 11) :**
docs/project-context.md-268-    1. **Revue visuelle et capture comparative obligatoire** : toute story comportant de l'UI doit être validée visuellement sur navigateur avant passage en review/done (la gate Docker seule ne protège pas du décalage d'ambiance visuelle).
docs/project-context.md-269-    2. **Critères d'acceptation spatiaux et sensoriels dès la spécification** : consigner les échelles `clamp`, hauteurs de ligne, transparences et micro-cinétiques dès l'écriture des stories.
docs/project-context.md-270-
--
AGENTS.md-37-
AGENTS.md-38-# Commandes ponctuelles
AGENTS.md-39-docker compose run --rm web sh -c "corepack enable && pnpm lint"       # eslint + stylelint
AGENTS.md-40-docker compose run --rm web sh -c "corepack enable && pnpm typecheck"  # vérification TypeScript vue-tsc
AGENTS.md:41:docker compose run --rm web sh -c "corepack enable && pnpm generate"   # build statique SSG (13 routes)
AGENTS.md-42-docker compose run --rm web sh -c "corepack enable && pnpm add -D <pkg>" # ajout de dépendance
AGENTS.md-43-```
AGENTS.md-44-
AGENTS.md-45-*Note SQLite / `@nuxt/content` :* Lancer `pnpm generate` dans un conteneur séparé pendant que le serveur dev tourne peut invalider la base de contenu SQLite du dev. Si `/blog` affiche une erreur en dev, exécuter `docker compose restart web`.
--
AGENTS.md-130-### 4. Accessibilité (a11y) dès la Conception
AGENTS.md-131-- **Liens externes :** TOUT lien ouvrant un nouvel onglet (`target="_blank"`) DOIT utiliser la primitive **`<ZExternalLink>`** (`app/components/ui/ZExternalLink.vue`). Elle impose `rel="noopener"` et injecte le libellé masqué accessible `(ouvre dans un nouvel onglet)`.
AGENTS.md-132-- **Hiérarchie de titres :** Tout libellé de section eyebrow ouvrant une section sans titre h2 propre doit être un **`<h2 class="eyebrow">`** (le style neutralisé hérite de `font-weight`/`line-height` pour une parité visuelle stricte). Les préfixes décoratifs `// ` doivent être encapsulés dans `<span aria-hidden="true">// </span>`.
AGENTS.md-133-- **Séquences :** Toute répétition de cartes ou étapes doit être balisée en listes sémantiques **`<ul>` ou `<ol>` avec `<li>`** (avec `> li { display: flex }` si cartes flex).
AGENTS.md:134:- **Contraste forcé (`forced-colors`) :** Tout élément interactif au focus doit intégrer le repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` pour rester visible en mode contraste élevé système.
AGENTS.md-135-- **Motion réduit :** Respect universel de `prefers-reduced-motion: reduce`. Le caret natif du terminal est la **seule animation en boucle autorisée** sur le site (CAP-11). Les carets décoratifs doivent être figés visibles.
AGENTS.md-136-- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.
AGENTS.md-137-
AGENTS.md-138-### 5. Nuxt 4 Gotchas
--
AGENTS.md-168-   - 0 erreur TypeScript vue-tsc.
AGENTS.md-169-   - 13 routes statiques (+ assets) pré-rendues avec succès par Nitro.
AGENTS.md-170-2. **Vérification visuelle & comportementale :**
AGENTS.md-171-   - Contrôle visuel comparatif sur navigateur (desktop et mobile) conforme à la maquette cible.
AGENTS.md:172:   - Rendu fidèle au Design System (thème sombre aubergine, orange accent, typographie Ubuntu).
AGENTS.md-173-   - Navigation clavier fonctionnelle (focus visible, ordre logique).
AGENTS.md-174-   - Pas de valeurs CSS en dur non justifiées.
AGENTS.md-175-
AGENTS.md-176----

exec
/bin/zsh -lc "sed -n '1081,1103p' docs/planning-artifacts/epics.md; printf '\\n---ZICON SOURCE---\\n'; sed -n '1,180p' app/components/ui/ZIcon.vue; printf '\\n---HEADER RELEVANT---\\n'; sed -n '1,110p' app/components/HeaderComponent.vue; sed -n '470,570p' app/components/HeaderComponent.vue; printf '\\n---ROOT/HIDDEN---\\n'; rg -n -C 3 'screen-reader-text|forced-colors' app/assets app/components | head -160" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

---ZICON SOURCE---
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
  monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
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

---HEADER RELEVANT---
<template>
  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
      </NuxtLink>

      <nav class="hdr__nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hdr__link"
          :class="{ 'hdr__link--active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
          <span class="hdr__link-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
          Démarrer un projet
        </ZButton>

        <button
          ref="burgerButton"
          class="hdr__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="hdr-mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="toggleMenu"
        >
          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
        </button>
      </div>
    </div>

    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
    <div class="hdr__dock-right" aria-label="Statut et heure">
      <ThemeToggle class="hdr__dock-theme" />
      <div class="hdr__status-badge">
        <span class="hdr__status-dot" aria-hidden="true" />
        <span class="hdr__status-text">Disponible</span>
      </div>
      <CurrentTime class="hdr__dock-clock" />
    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
      <NuxtLink
        v-for="(item, index) in navItems"
        :key="item.to"
        :ref="(el) => registerFirstLink(el, index)"
        :to="item.to"
        class="hdr__menu-link"
        :class="{ 'hdr__menu-link--active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        @click="closeMenu"
      >
        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
        <span class="hdr__menu-link-label">{{ item.label }}</span>
      </NuxtLink>

      <div class="hdr__menu-actions">
        <div class="hdr__menu-status">
          <ThemeToggle class="hdr__menu-theme" />
          <div class="hdr__status-badge">
            <span class="hdr__status-dot" aria-hidden="true" />
            <span class="hdr__status-text">Disponible</span>
          </div>
          <CurrentTime class="hdr__menu-clock" />
        </div>
        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
          Démarrer un projet
        </ZButton>
      </div>
    </nav>

    <TerminalManagerComponent ref="terminalManager" />
  </header>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from "vue";
import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
import { NuxtLink } from "#components";
import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";

const route = useRoute();

const navItems = [
  { to: "/", label: "Accueil", prefix: "~" },
  { to: "/services", label: "Services", prefix: "//" },
  { to: "/about", label: "À propos", prefix: "./" },
  { to: "/blog", label: "Blog", prefix: "~/" },
  { to: "/contact", label: "Contact", prefix: "$" },
  backdrop-filter: blur(8px);

  &:hover {
    border-color: var(--term-green);
    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
  }
}

.hdr__status-dot {
  width: 7px;
  height: 7px;
  background: var(--term-green);
  border-radius: var(--radius-circle);
  box-shadow: 0 0 6px var(--term-green);
}

.hdr__dock-clock {
  margin-left: var(--space-1);
}

.hdr__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  color: var(--text-strong);
  cursor: pointer;
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__overlay {
  position: fixed;
  inset: var(--header-height) 0 0;
  z-index: 40;
  background: var(--overlay);
}

.hdr__menu {
  display: none;
}

.hdr__menu-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-subtle);
}

// Dégradé progressif pour le dock droit sur largeurs moyennes (évite la collision avec le CTA à 1440px)
@media (width <= 1650px) {
  .hdr__status-badge,
  .hdr__dock-clock {
    display: none;
  }
}

// Sécurité : pas d'overlay en desktop (le menu mobile y est fermé par JS).
@media (width >= 901px) {
  .hdr__overlay {
    display: none;
  }
}

// ---- Responsive : < 900px (cf. kit.css) ----
@media (width <= 900px) {
  .hdr__nav,
  .hdr__dock-right,
  .hdr__right .hdr__action {
    display: none;
  }

  .hdr__burger {
    display: inline-flex;
  }

  .hdr__menu {
    position: fixed;
    inset: var(--header-height) 0 auto 0;
    z-index: 45;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-4) var(--space-6) var(--space-6);
    background: var(--surface-1);
    border-bottom: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-3);
    transform: translateY(-8px);
    opacity: 0;
    visibility: hidden;

---ROOT/HIDDEN---
app/components/HeaderComponent.vue-333-
app/components/HeaderComponent.vue-334-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue-335-  &:focus-visible {
app/components/HeaderComponent.vue:336:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-337-    outline-offset: 2px;
app/components/HeaderComponent.vue-338-    border-radius: var(--radius-sm);
app/components/HeaderComponent.vue-339-    box-shadow: var(--ring-accent);
--
app/components/HeaderComponent.vue-384-
app/components/HeaderComponent.vue-385-  // Anneau de focus DS
app/components/HeaderComponent.vue-386-  &:focus-visible {
app/components/HeaderComponent.vue:387:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-388-    outline-offset: 4px;
app/components/HeaderComponent.vue-389-    border-radius: var(--radius-xs);
app/components/HeaderComponent.vue-390-    box-shadow: var(--ring-accent);
--
app/components/HeaderComponent.vue-501-  border-radius: var(--radius-md);
app/components/HeaderComponent.vue-502-
app/components/HeaderComponent.vue-503-  &:focus-visible {
app/components/HeaderComponent.vue:504:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-505-    outline-offset: 2px;
app/components/HeaderComponent.vue-506-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-507-  }
--
app/components/HeaderComponent.vue-595-  }
app/components/HeaderComponent.vue-596-
app/components/HeaderComponent.vue-597-  &:focus-visible {
app/components/HeaderComponent.vue:598:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-599-    outline-offset: 2px;
app/components/HeaderComponent.vue-600-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-601-  }
--
app/components/FooterComponent.vue-123-
app/components/FooterComponent.vue-124-  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
app/components/FooterComponent.vue-125-  &:focus-visible {
app/components/FooterComponent.vue:126:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-127-    outline-offset: 2px;
app/components/FooterComponent.vue-128-    border-radius: var(--radius-sm);
app/components/FooterComponent.vue-129-    box-shadow: var(--ring-accent);
--
app/components/FooterComponent.vue-177-
app/components/FooterComponent.vue-178-  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
app/components/FooterComponent.vue-179-  &:focus-visible {
app/components/FooterComponent.vue:180:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-181-    outline-offset: 2px;
app/components/FooterComponent.vue-182-    border-radius: var(--radius-xs);
app/components/FooterComponent.vue-183-    box-shadow: var(--ring-accent);
--
app/assets/scss/base/_reset.scss-559---------------------------------------------- */
app/assets/scss/base/_reset.scss-560-
app/assets/scss/base/_reset.scss-561-/* Text meant only for screen readers. */
app/assets/scss/base/_reset.scss:562:.screen-reader-text {
app/assets/scss/base/_reset.scss-563-  border: 0;
app/assets/scss/base/_reset.scss-564-  clip-path: inset(50%);
app/assets/scss/base/_reset.scss-565-  height: 1px;
--
app/assets/scss/base/_reset.scss-571-  overflow-wrap: normal !important;
app/assets/scss/base/_reset.scss-572-}
app/assets/scss/base/_reset.scss-573-
app/assets/scss/base/_reset.scss:574:.screen-reader-text:focus {
app/assets/scss/base/_reset.scss-575-  background-color: #f1f1f1;
app/assets/scss/base/_reset.scss-576-  border-radius: 3px;
app/assets/scss/base/_reset.scss-577-  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
--
app/components/ui/ThemeToggle.vue-7-    @click="handleToggle"
app/components/ui/ThemeToggle.vue-8-  >
app/components/ui/ThemeToggle.vue-9-    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
app/components/ui/ThemeToggle.vue:10:    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
app/components/ui/ThemeToggle.vue-11-  </button>
app/components/ui/ThemeToggle.vue-12-</template>
app/components/ui/ThemeToggle.vue-13-
--
app/components/ui/ZInput.vue-172-  }
app/components/ui/ZInput.vue-173-
app/components/ui/ZInput.vue-174-  &:focus {
app/components/ui/ZInput.vue:175:    // Outline transparent → rendu en couleur système sous forced-colors (où la
app/components/ui/ZInput.vue-176-    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
app/components/ui/ZInput.vue-177-    outline: 2px solid transparent;
app/components/ui/ZInput.vue-178-    outline-offset: 2px;
--
app/components/ui/ZExternalLink.vue-1-<template>
app/components/ui/ZExternalLink.vue-2-  <a :href="href" :rel="computedRel" target="_blank">
app/components/ui/ZExternalLink.vue-3-    <slot />
app/components/ui/ZExternalLink.vue:4:    <span class="screen-reader-text">{{ computedSrText }}</span>
app/components/ui/ZExternalLink.vue-5-  </a>
app/components/ui/ZExternalLink.vue-6-</template>
app/components/ui/ZExternalLink.vue-7-
--
app/components/ui/ZTag.vue-145-  }
app/components/ui/ZTag.vue-146-
app/components/ui/ZTag.vue-147-  &:focus-visible {
app/components/ui/ZTag.vue:148:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue-149-    outline: 2px solid transparent;
app/components/ui/ZTag.vue-150-    outline-offset: 2px;
app/components/ui/ZTag.vue-151-    box-shadow: var(--ring-accent);
--
app/components/ui/ZTag.vue-174-  }
app/components/ui/ZTag.vue-175-
app/components/ui/ZTag.vue-176-  &:focus-visible {
app/components/ui/ZTag.vue:177:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue-178-    outline: 2px solid transparent;
app/components/ui/ZTag.vue-179-    outline-offset: 2px;
app/components/ui/ZTag.vue-180-    box-shadow: var(--ring-accent);

exec
/bin/zsh -lc "sed -n '1,280p' app/composables/useTheme.ts; printf '\\n---NUXT THEME SCRIPT---\\n'; rg -n -C 8 'jouan_theme_mode|data-theme|matchMedia' nuxt.config.ts app; printf '\\n---HEADER DOCK CSS---\\n'; sed -n '300,480p' app/components/HeaderComponent.vue; printf '\\n---GIT DIFF BASE FILES---\\n'; git diff 6ed0830e17d887fd75969597295fab6c4af5ab15 -- app/composables/useTheme.ts nuxt.config.ts app/assets/scss/abstract/_root.scss | sed -n '1,320p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
export type ThemePreference = "system" | "dark" | "light";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "jouan_theme_mode";
let mediaListenerAttached = false;

/**
 * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
 *
 * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
 * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
 * avec localStorage et les preferences systeme de l'OS.
 */
export function useTheme() {
  const preference = useState<ThemePreference>("theme-preference", () => "system");
  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");

  const resolveSystemTheme = (): ResolvedTheme => {
    if (!import.meta.client || typeof window === "undefined" || !window.matchMedia) {
      return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
    if (!import.meta.client) {
      return;
    }
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-source", pref);
    document.documentElement.style.colorScheme = resolved;
  };

  const setTheme = (pref: ThemePreference) => {
    if (pref !== "system" && pref !== "dark" && pref !== "light") {
      return;
    }
    preference.value = pref;
    const resolved = pref === "system" ? resolveSystemTheme() : pref;
    resolvedTheme.value = resolved;

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, pref);
      } catch {
        // Ignorer en navigation privee restrictive
      }
      applyToDom(resolved, pref);
    }
  };

  const cycleTheme = () => {
    const nextMap: Record<ThemePreference, ThemePreference> = {
      system: "dark",
      dark: "light",
      light: "system",
    };
    setTheme(nextMap[preference.value] || "system");
  };

  const initTheme = () => {
    if (!import.meta.client) {
      return;
    }

    let storedPref: ThemePreference = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light" || stored === "system") {
        storedPref = stored;
      }
    } catch {
      // Ignorer si localStorage inaccessible
    }

    preference.value = storedPref;
    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
    resolvedTheme.value = resolved;
    applyToDom(resolved, storedPref);

    if (mediaListenerAttached || typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (preference.value === "system") {
        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
        resolvedTheme.value = newResolved;
        applyToDom(newResolved, "system");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }
    mediaListenerAttached = true;
  };

  return {
    preference,
    resolvedTheme,
    setTheme,
    cycleTheme,
    initTheme,
  };
}

---NUXT THEME SCRIPT---
nuxt.config.ts-26-            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
nuxt.config.ts-27-            " Discutons de votre projet.",
nuxt.config.ts-28-        },
nuxt.config.ts-29-      ],
nuxt.config.ts-30-      script: [
nuxt.config.ts-31-        {
nuxt.config.ts-32-          type: "text/javascript",
nuxt.config.ts-33-          innerHTML:
nuxt.config.ts:34:            "(function(){try{var stored=localStorage.getItem('jouan_theme_mode');var pref=(stored==='dark'||stored==='light'||stored==='system')?stored:'system';var isDark=pref==='dark'||(pref==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var resolved=isDark?'dark':'light';document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);document.documentElement.style.colorScheme=resolved;}catch(e){var fallback=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.setAttribute('data-theme',fallback);document.documentElement.setAttribute('data-theme-source','system');document.documentElement.style.colorScheme=fallback;}})();",
nuxt.config.ts-35-        },
nuxt.config.ts-36-      ],
nuxt.config.ts-37-    },
nuxt.config.ts-38-  },
nuxt.config.ts-39-  css: ["@/assets/scss/main.scss"],
nuxt.config.ts-40-  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint"],
nuxt.config.ts-41-  // @nuxt/content : coloration syntaxique Shiki désactivée. Le DS rend le code en
nuxt.config.ts-42-  // palette terminale UNIFORME (mono off-white sur fond aubergine, vert pour l'inline,
--
app/pages/index.vue-297-const isReducedMotion = ref(false);
app/pages/index.vue-298-let motionMq: MediaQueryList | null = null;
app/pages/index.vue-299-
app/pages/index.vue-300-function onMotionChange(e: MediaQueryListEvent) {
app/pages/index.vue-301-  isReducedMotion.value = e.matches;
app/pages/index.vue-302-}
app/pages/index.vue-303-
app/pages/index.vue-304-onMounted(() => {
app/pages/index.vue:305:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/pages/index.vue-306-  isReducedMotion.value = motionMq.matches;
app/pages/index.vue-307-  motionMq.addEventListener("change", onMotionChange);
app/pages/index.vue-308-});
app/pages/index.vue-309-
app/pages/index.vue-310-onBeforeUnmount(() => {
app/pages/index.vue-311-  motionMq?.removeEventListener("change", onMotionChange);
app/pages/index.vue-312-});
app/pages/index.vue-313-
--
app/assets/scss/abstract/_root.scss-200-  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
app/assets/scss/abstract/_root.scss-201-  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
app/assets/scss/abstract/_root.scss-202-  --ease-standard: ease-in-out;
app/assets/scss/abstract/_root.scss-203-}
app/assets/scss/abstract/_root.scss-204-
app/assets/scss/abstract/_root.scss-205-// ============================================================
app/assets/scss/abstract/_root.scss-206-//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
app/assets/scss/abstract/_root.scss-207-// ============================================================
app/assets/scss/abstract/_root.scss:208:[data-theme="light"] {
app/assets/scss/abstract/_root.scss-209-  // Surfaces claires
app/assets/scss/abstract/_root.scss-210-  --bg-page: hsl(38deg 25% 97%);
app/assets/scss/abstract/_root.scss-211-  --bg-sunken: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss-212-  --bg-card: hsl(0deg 0% 100%);
app/assets/scss/abstract/_root.scss-213-  --bg-elevated: hsl(38deg 30% 99%);
app/assets/scss/abstract/_root.scss-214-  --bg-input: hsl(38deg 15% 95%);
app/assets/scss/abstract/_root.scss-215-
app/assets/scss/abstract/_root.scss-216-  // Encres aubergine (contrastes WCAG AAA)
--
app/components/HeaderComponent.vue-166-
app/components/HeaderComponent.vue-167-function onBrandClick(event: MouseEvent) {
app/components/HeaderComponent.vue-168-  closeMenu();
app/components/HeaderComponent.vue-169-  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
app/components/HeaderComponent.vue-170-    return;
app/components/HeaderComponent.vue-171-  }
app/components/HeaderComponent.vue-172-  if (route.path === "/") {
app/components/HeaderComponent.vue-173-    event.preventDefault();
app/components/HeaderComponent.vue:174:    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/HeaderComponent.vue-175-    window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" });
app/components/HeaderComponent.vue-176-  }
app/components/HeaderComponent.vue-177-}
app/components/HeaderComponent.vue-178-
app/components/HeaderComponent.vue-179-// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
app/components/HeaderComponent.vue-180-function closeMenuAndRefocus() {
app/components/HeaderComponent.vue-181-  if (!menuOpen.value) {
app/components/HeaderComponent.vue-182-    return;
--
app/components/HeaderComponent.vue-210-function onDesktopChange(event: MediaQueryListEvent) {
app/components/HeaderComponent.vue-211-  if (event.matches) {
app/components/HeaderComponent.vue-212-    closeMenu();
app/components/HeaderComponent.vue-213-  }
app/components/HeaderComponent.vue-214-}
app/components/HeaderComponent.vue-215-
app/components/HeaderComponent.vue-216-onMounted(() => {
app/components/HeaderComponent.vue-217-  document.addEventListener("keydown", onKeydown);
app/components/HeaderComponent.vue:218:  desktopMq = window.matchMedia("(min-width: 901px)");
app/components/HeaderComponent.vue-219-  desktopMq.addEventListener("change", onDesktopChange);
app/components/HeaderComponent.vue-220-  registerTerminalLauncher(addNewTerminal);
app/components/HeaderComponent.vue-221-  window.addEventListener("scroll", onScroll, { passive: true });
app/components/HeaderComponent.vue-222-  window.addEventListener("resize", onScroll, { passive: true });
app/components/HeaderComponent.vue-223-  onScroll();
app/components/HeaderComponent.vue-224-});
app/components/HeaderComponent.vue-225-
app/components/HeaderComponent.vue-226-onBeforeUnmount(() => {
--
app/components/home/HomeAtmosComponent.vue-315-}
app/components/home/HomeAtmosComponent.vue-316-
app/components/home/HomeAtmosComponent.vue-317-onMounted(() => {
app/components/home/HomeAtmosComponent.vue-318-  const canvas = canvasRef.value;
app/components/home/HomeAtmosComponent.vue-319-  if (!canvas) {
app/components/home/HomeAtmosComponent.vue-320-    return;
app/components/home/HomeAtmosComponent.vue-321-  }
app/components/home/HomeAtmosComponent.vue-322-
app/components/home/HomeAtmosComponent.vue:323:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeAtmosComponent.vue-324-  isReducedMotion = motionMq.matches;
app/components/home/HomeAtmosComponent.vue-325-  motionMq.addEventListener("change", onMotionChange);
app/components/home/HomeAtmosComponent.vue-326-  document.addEventListener("visibilitychange", onVisibilityChange);
app/components/home/HomeAtmosComponent.vue-327-
app/components/home/HomeAtmosComponent.vue-328-  canvas.addEventListener("webglcontextlost", onContextLost);
app/components/home/HomeAtmosComponent.vue-329-
app/components/home/HomeAtmosComponent.vue-330-  const success = initWebGL(canvas);
app/components/home/HomeAtmosComponent.vue-331-  if (!success) {
--
app/composables/useTheme.ts-1-export type ThemePreference = "system" | "dark" | "light";
app/composables/useTheme.ts-2-export type ResolvedTheme = "dark" | "light";
app/composables/useTheme.ts-3-
app/composables/useTheme.ts:4:const STORAGE_KEY = "jouan_theme_mode";
app/composables/useTheme.ts-5-let mediaListenerAttached = false;
app/composables/useTheme.ts-6-
app/composables/useTheme.ts-7-/**
app/composables/useTheme.ts-8- * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
app/composables/useTheme.ts-9- *
app/composables/useTheme.ts-10- * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
app/composables/useTheme.ts-11- * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
app/composables/useTheme.ts-12- * avec localStorage et les preferences systeme de l'OS.
app/composables/useTheme.ts-13- */
app/composables/useTheme.ts-14-export function useTheme() {
app/composables/useTheme.ts-15-  const preference = useState<ThemePreference>("theme-preference", () => "system");
app/composables/useTheme.ts-16-  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");
app/composables/useTheme.ts-17-
app/composables/useTheme.ts-18-  const resolveSystemTheme = (): ResolvedTheme => {
app/composables/useTheme.ts:19:    if (!import.meta.client || typeof window === "undefined" || !window.matchMedia) {
app/composables/useTheme.ts-20-      return "dark";
app/composables/useTheme.ts-21-    }
app/composables/useTheme.ts:22:    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
app/composables/useTheme.ts-23-  };
app/composables/useTheme.ts-24-
app/composables/useTheme.ts-25-  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
app/composables/useTheme.ts-26-    if (!import.meta.client) {
app/composables/useTheme.ts-27-      return;
app/composables/useTheme.ts-28-    }
app/composables/useTheme.ts:29:    document.documentElement.setAttribute("data-theme", resolved);
app/composables/useTheme.ts:30:    document.documentElement.setAttribute("data-theme-source", pref);
app/composables/useTheme.ts-31-    document.documentElement.style.colorScheme = resolved;
app/composables/useTheme.ts-32-  };
app/composables/useTheme.ts-33-
app/composables/useTheme.ts-34-  const setTheme = (pref: ThemePreference) => {
app/composables/useTheme.ts-35-    if (pref !== "system" && pref !== "dark" && pref !== "light") {
app/composables/useTheme.ts-36-      return;
app/composables/useTheme.ts-37-    }
app/composables/useTheme.ts-38-    preference.value = pref;
--
app/composables/useTheme.ts-73-      // Ignorer si localStorage inaccessible
app/composables/useTheme.ts-74-    }
app/composables/useTheme.ts-75-
app/composables/useTheme.ts-76-    preference.value = storedPref;
app/composables/useTheme.ts-77-    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
app/composables/useTheme.ts-78-    resolvedTheme.value = resolved;
app/composables/useTheme.ts-79-    applyToDom(resolved, storedPref);
app/composables/useTheme.ts-80-
app/composables/useTheme.ts:81:    if (mediaListenerAttached || typeof window === "undefined" || !window.matchMedia) {
app/composables/useTheme.ts-82-      return;
app/composables/useTheme.ts-83-    }
app/composables/useTheme.ts-84-
app/composables/useTheme.ts:85:    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
app/composables/useTheme.ts-86-    const handleMediaChange = (e: MediaQueryListEvent) => {
app/composables/useTheme.ts-87-      if (preference.value === "system") {
app/composables/useTheme.ts-88-        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
app/composables/useTheme.ts-89-        resolvedTheme.value = newResolved;
app/composables/useTheme.ts-90-        applyToDom(newResolved, "system");
app/composables/useTheme.ts-91-      }
app/composables/useTheme.ts-92-    };
app/composables/useTheme.ts-93-
--
app/components/home/HomeBootOverlay.vue-131-  // Vérifier si la session a déjà vu le boot
app/components/home/HomeBootOverlay.vue-132-  let alreadyBooted = false;
app/components/home/HomeBootOverlay.vue-133-  try {
app/components/home/HomeBootOverlay.vue-134-    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
app/components/home/HomeBootOverlay.vue-135-  } catch {
app/components/home/HomeBootOverlay.vue-136-    alreadyBooted = false;
app/components/home/HomeBootOverlay.vue-137-  }
app/components/home/HomeBootOverlay.vue-138-
app/components/home/HomeBootOverlay.vue:139:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeBootOverlay.vue-140-  motionMq.addEventListener("change", onMotionChange);
app/components/home/HomeBootOverlay.vue-141-
app/components/home/HomeBootOverlay.vue-142-  if (alreadyBooted || motionMq.matches) {
app/components/home/HomeBootOverlay.vue-143-    try {
app/components/home/HomeBootOverlay.vue-144-      sessionStorage.setItem("jouan_boot_done", "1");
app/components/home/HomeBootOverlay.vue-145-    } catch {
app/components/home/HomeBootOverlay.vue-146-      // Ignore sessionStorage exceptions
app/components/home/HomeBootOverlay.vue-147-    }
--
app/components/home/HomeHeroTerminal.vue-146-  currentTypingText.value = "";
app/components/home/HomeHeroTerminal.vue-147-  isSequenceComplete.value = true;
app/components/home/HomeHeroTerminal.vue-148-}
app/components/home/HomeHeroTerminal.vue-149-
app/components/home/HomeHeroTerminal.vue-150-function startTypingSequence() {
app/components/home/HomeHeroTerminal.vue-151-  if (isStarted) return;
app/components/home/HomeHeroTerminal.vue-152-  isStarted = true;
app/components/home/HomeHeroTerminal.vue-153-
app/components/home/HomeHeroTerminal.vue:154:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue-155-
app/components/home/HomeHeroTerminal.vue-156-  if (reduceMotion) {
app/components/home/HomeHeroTerminal.vue-157-    showInstantState();
app/components/home/HomeHeroTerminal.vue-158-    return;
app/components/home/HomeHeroTerminal.vue-159-  }
app/components/home/HomeHeroTerminal.vue-160-
app/components/home/HomeHeroTerminal.vue-161-  let rowIndex = 0;
app/components/home/HomeHeroTerminal.vue-162-
--
app/components/home/HomeHeroTerminal.vue-222-    }
app/components/home/HomeHeroTerminal.vue-223-    showInstantState();
app/components/home/HomeHeroTerminal.vue-224-  }
app/components/home/HomeHeroTerminal.vue-225-}
app/components/home/HomeHeroTerminal.vue-226-
app/components/home/HomeHeroTerminal.vue-227-onMounted(() => {
app/components/home/HomeHeroTerminal.vue-228-  if (!import.meta.client) return;
app/components/home/HomeHeroTerminal.vue-229-
app/components/home/HomeHeroTerminal.vue:230:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeHeroTerminal.vue-231-  motionMq.addEventListener("change", onMotionChange);
app/components/home/HomeHeroTerminal.vue-232-
app/components/home/HomeHeroTerminal.vue-233-  if (motionMq.matches) {
app/components/home/HomeHeroTerminal.vue-234-    isStarted = true;
app/components/home/HomeHeroTerminal.vue-235-    showInstantState();
app/components/home/HomeHeroTerminal.vue-236-    return;
app/components/home/HomeHeroTerminal.vue-237-  }
app/components/home/HomeHeroTerminal.vue-238-
--
app/components/ui/ZButton.vue-77-function onMotionChange(event: MediaQueryListEvent) {
app/components/ui/ZButton.vue-78-  isReducedMotion.value = event.matches;
app/components/ui/ZButton.vue-79-  if (event.matches) {
app/components/ui/ZButton.vue-80-    onMouseLeave();
app/components/ui/ZButton.vue-81-  }
app/components/ui/ZButton.vue-82-}
app/components/ui/ZButton.vue-83-
app/components/ui/ZButton.vue-84-onMounted(() => {
app/components/ui/ZButton.vue:85:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZButton.vue-86-  isReducedMotion.value = motionMq.matches;
app/components/ui/ZButton.vue-87-  motionMq.addEventListener("change", onMotionChange);
app/components/ui/ZButton.vue-88-});
app/components/ui/ZButton.vue-89-
app/components/ui/ZButton.vue-90-onBeforeUnmount(() => {
app/components/ui/ZButton.vue-91-  motionMq?.removeEventListener("change", onMotionChange);
app/components/ui/ZButton.vue-92-});
app/components/ui/ZButton.vue-93-
app/components/ui/ZButton.vue-94-function onMouseMove(event: MouseEvent) {
app/components/ui/ZButton.vue-95-  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
app/components/ui/ZButton.vue-96-    return;
app/components/ui/ZButton.vue-97-  }
app/components/ui/ZButton.vue:98:  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
app/components/ui/ZButton.vue-99-    return;
app/components/ui/ZButton.vue-100-  }
app/components/ui/ZButton.vue-101-  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
app/components/ui/ZButton.vue-102-  if (!el || !(el instanceof HTMLElement)) {
app/components/ui/ZButton.vue-103-    return;
app/components/ui/ZButton.vue-104-  }
app/components/ui/ZButton.vue-105-  const rect = el.getBoundingClientRect();
app/components/ui/ZButton.vue-106-  if (rect.width <= 0 || rect.height <= 0) {
--
app/components/ui/ZCard.vue-60-function onMotionChange(e: MediaQueryListEvent) {
app/components/ui/ZCard.vue-61-  isReducedMotion.value = e.matches;
app/components/ui/ZCard.vue-62-  if (e.matches) {
app/components/ui/ZCard.vue-63-    onMouseLeave();
app/components/ui/ZCard.vue-64-  }
app/components/ui/ZCard.vue-65-}
app/components/ui/ZCard.vue-66-
app/components/ui/ZCard.vue-67-onMounted(() => {
app/components/ui/ZCard.vue:68:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCard.vue-69-  isReducedMotion.value = motionMq.matches;
app/components/ui/ZCard.vue-70-  motionMq.addEventListener("change", onMotionChange);
app/components/ui/ZCard.vue-71-});
app/components/ui/ZCard.vue-72-
app/components/ui/ZCard.vue-73-onBeforeUnmount(() => {
app/components/ui/ZCard.vue-74-  motionMq?.removeEventListener("change", onMotionChange);
app/components/ui/ZCard.vue-75-});
app/components/ui/ZCard.vue-76-
app/components/ui/ZCard.vue-77-function onMouseMove(event: MouseEvent) {
app/components/ui/ZCard.vue-78-  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
app/components/ui/ZCard.vue-79-    return;
app/components/ui/ZCard.vue-80-  }
app/components/ui/ZCard.vue:81:  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
app/components/ui/ZCard.vue-82-    return;
app/components/ui/ZCard.vue-83-  }
app/components/ui/ZCard.vue-84-  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
app/components/ui/ZCard.vue-85-  if (!el || !(el instanceof HTMLElement)) {
app/components/ui/ZCard.vue-86-    return;
app/components/ui/ZCard.vue-87-  }
app/components/ui/ZCard.vue-88-  const rect = el.getBoundingClientRect();
app/components/ui/ZCard.vue-89-  if (rect.width <= 0 || rect.height <= 0) {
--
app/components/ui/ZCustomCursor.vue-124-
app/components/ui/ZCustomCursor.vue-125-function handleMediaQueryChange() {
app/components/ui/ZCustomCursor.vue-126-  updateCursorState();
app/components/ui/ZCustomCursor.vue-127-}
app/components/ui/ZCustomCursor.vue-128-
app/components/ui/ZCustomCursor.vue-129-onMounted(() => {
app/components/ui/ZCustomCursor.vue-130-  if (!import.meta.client) return;
app/components/ui/ZCustomCursor.vue-131-
app/components/ui/ZCustomCursor.vue:132:  hoverMediaQuery = window.matchMedia("(hover: hover)");
app/components/ui/ZCustomCursor.vue:133:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCustomCursor.vue-134-
app/components/ui/ZCustomCursor.vue-135-  hoverMediaQuery.addEventListener("change", handleMediaQueryChange);
app/components/ui/ZCustomCursor.vue-136-  motionMediaQuery.addEventListener("change", handleMediaQueryChange);
app/components/ui/ZCustomCursor.vue-137-
app/components/ui/ZCustomCursor.vue-138-  updateCursorState();
app/components/ui/ZCustomCursor.vue-139-});
app/components/ui/ZCustomCursor.vue-140-
app/components/ui/ZCustomCursor.vue-141-onUnmounted(() => {

---HEADER DOCK CSS---
  }

  .hdr__brand-text {
    transition: transform var(--dur-fast) var(--ease-standard);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
    transition: color var(--dur-fast) var(--ease-standard);
  }

  .dim {
    color: var(--text-faint);
    transition: color var(--dur-fast) var(--ease-standard);
  }

  &:hover {
    .hdr__logo {
      transform: rotate(-12deg) scale(1.15);
      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 70%, transparent));
    }

    b {
      color: var(--accent);
    }

    .dim {
      color: var(--text-body);
    }
  }

  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.hdr__nav {
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  gap: var(--space-6);
  transform: translateX(-50%);
}

.hdr__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);
  text-decoration: none;
  background: transparent;
  transition: color var(--dur-fast) var(--ease-standard);

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: var(--accent);
    transition: width var(--dur-base) var(--ease-out);
  }

  &:hover {
    color: var(--text-strong);
    background: transparent;

    &::after {
      width: 100%;
    }
  }

  // Anneau de focus DS
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 4px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.hdr__link--active {
  color: var(--text-strong);

  &::after {
    width: 100%;
  }

  .hdr__link-prefix {
    color: var(--accent);
  }
}

.hdr__link-prefix,
.hdr__menu-link-prefix {
  font-family: var(--font-mono);
  color: var(--text-faint);
  transition: color var(--dur-fast) var(--ease-standard);
}

.hdr__link:hover .hdr__link-prefix,
.hdr__link--active .hdr__link-prefix,
.hdr__menu-link:hover .hdr__menu-link-prefix,
.hdr__menu-link--active .hdr__menu-link-prefix {
  color: var(--accent);
}

.hdr__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

.hdr__action--terminal {
  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);

  &:hover {
    border-color: var(--term-green);
    box-shadow:
      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
      var(--glow-terminal);
  }
}

// Dock de statut & horloge positionné tout à droite de l'écran (hors container centré)
.hdr__dock-right {
  position: absolute;
  top: 50%;
  right: var(--space-6);
  z-index: 52;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  transform: translateY(-50%);
}

.hdr__status-badge {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--term-green);
  user-select: none;
  background: color-mix(in srgb, var(--term-green) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
  border-radius: var(--radius-pill);
  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
  transition:
    box-shadow var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard);

  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);

  &:hover {
    border-color: var(--term-green);
    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
  }
}

.hdr__status-dot {
  width: 7px;
  height: 7px;

---GIT DIFF BASE FILES---
diff --git a/app/assets/scss/abstract/_root.scss b/app/assets/scss/abstract/_root.scss
index 16c78d3..aa40e8f 100644
--- a/app/assets/scss/abstract/_root.scss
+++ b/app/assets/scss/abstract/_root.scss
@@ -202,6 +202,59 @@
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
+  --bg-terminal: var(--aubergine-deep);
+  --text-strong: var(--ink-1);
+  --text-body: var(--ink-2);
+  --text-muted: var(--ink-3);
+  --border-subtle: var(--line-subtle);
+  --border-default: var(--line);
+  --border-terminal: hsl(319deg 40% 30% / 40%);
+  --accent: var(--orange-500);
+  --selection: hsl(24deg 94% 53% / 30%);
+}
+
 ::selection {
   background: var(--selection);
 }
diff --git a/app/composables/useTheme.ts b/app/composables/useTheme.ts
new file mode 100644
index 0000000..26a8f88
--- /dev/null
+++ b/app/composables/useTheme.ts
@@ -0,0 +1,109 @@
+export type ThemePreference = "system" | "dark" | "light";
+export type ResolvedTheme = "dark" | "light";
+
+const STORAGE_KEY = "jouan_theme_mode";
+let mediaListenerAttached = false;
+
+/**
+ * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
+ *
+ * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
+ * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
+ * avec localStorage et les preferences systeme de l'OS.
+ */
+export function useTheme() {
+  const preference = useState<ThemePreference>("theme-preference", () => "system");
+  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");
+
+  const resolveSystemTheme = (): ResolvedTheme => {
+    if (!import.meta.client || typeof window === "undefined" || !window.matchMedia) {
+      return "dark";
+    }
+    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
+  };
+
+  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
+    if (!import.meta.client) {
+      return;
+    }
+    document.documentElement.setAttribute("data-theme", resolved);
+    document.documentElement.setAttribute("data-theme-source", pref);
+    document.documentElement.style.colorScheme = resolved;
+  };
+
+  const setTheme = (pref: ThemePreference) => {
+    if (pref !== "system" && pref !== "dark" && pref !== "light") {
+      return;
+    }
+    preference.value = pref;
+    const resolved = pref === "system" ? resolveSystemTheme() : pref;
+    resolvedTheme.value = resolved;
+
+    if (import.meta.client) {
+      try {
+        localStorage.setItem(STORAGE_KEY, pref);
+      } catch {
+        // Ignorer en navigation privee restrictive
+      }
+      applyToDom(resolved, pref);
+    }
+  };
+
+  const cycleTheme = () => {
+    const nextMap: Record<ThemePreference, ThemePreference> = {
+      system: "dark",
+      dark: "light",
+      light: "system",
+    };
+    setTheme(nextMap[preference.value] || "system");
+  };
+
+  const initTheme = () => {
+    if (!import.meta.client) {
+      return;
+    }
+
+    let storedPref: ThemePreference = "system";
+    try {
+      const stored = localStorage.getItem(STORAGE_KEY);
+      if (stored === "dark" || stored === "light" || stored === "system") {
+        storedPref = stored;
+      }
+    } catch {
+      // Ignorer si localStorage inaccessible
+    }
+
+    preference.value = storedPref;
+    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
+    resolvedTheme.value = resolved;
+    applyToDom(resolved, storedPref);
+
+    if (mediaListenerAttached || typeof window === "undefined" || !window.matchMedia) {
+      return;
+    }
+
+    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
+    const handleMediaChange = (e: MediaQueryListEvent) => {
+      if (preference.value === "system") {
+        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
+        resolvedTheme.value = newResolved;
+        applyToDom(newResolved, "system");
+      }
+    };
+
+    if (mediaQuery.addEventListener) {
+      mediaQuery.addEventListener("change", handleMediaChange);
+    } else {
+      mediaQuery.addListener(handleMediaChange);
+    }
+    mediaListenerAttached = true;
+  };
+
+  return {
+    preference,
+    resolvedTheme,
+    setTheme,
+    cycleTheme,
+    initTheme,
+  };
+}
diff --git a/nuxt.config.ts b/nuxt.config.ts
index 3808249..c5d3a8b 100644
--- a/nuxt.config.ts
+++ b/nuxt.config.ts
@@ -27,6 +27,13 @@ export default defineNuxtConfig({
             " Discutons de votre projet.",
         },
       ],
+      script: [
+        {
+          type: "text/javascript",
+          innerHTML:
+            "(function(){try{var stored=localStorage.getItem('jouan_theme_mode');var pref=(stored==='dark'||stored==='light'||stored==='system')?stored:'system';var isDark=pref==='dark'||(pref==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var resolved=isDark?'dark':'light';document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);document.documentElement.style.colorScheme=resolved;}catch(e){var fallback=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.setAttribute('data-theme',fallback);document.documentElement.setAttribute('data-theme-source','system');document.documentElement.style.colorScheme=fallback;}})();",
+        },
+      ],
     },
   },
   css: ["@/assets/scss/main.scss"],

exec
/bin/zsh -lc "rg -n 'initTheme\\(|useTheme\\(' app plugins nuxt.config.ts; rg -n -C 5 'hdr__menu-status|hdr__menu-theme|hdr__dock-theme' app/components/HeaderComponent.vue; git status --short" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
rg: plugins: No such file or directory (os error 2)
app/composables/useTheme.ts:14:export function useTheme() {
app/app.vue:11:const { initTheme } = useTheme();
app/app.vue:14:  initTheme();
app/components/ui/ThemeToggle.vue:18:const { preference, resolvedTheme, cycleTheme } = useTheme();
44-      </div>
45-    </div>
46-
47-    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
48-    <div class="hdr__dock-right" aria-label="Statut et heure">
49:      <ThemeToggle class="hdr__dock-theme" />
50-      <div class="hdr__status-badge">
51-        <span class="hdr__status-dot" aria-hidden="true" />
52-        <span class="hdr__status-text">Disponible</span>
53-      </div>
54-      <CurrentTime class="hdr__dock-clock" />
--
70-        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
71-        <span class="hdr__menu-link-label">{{ item.label }}</span>
72-      </NuxtLink>
73-
74-      <div class="hdr__menu-actions">
75:        <div class="hdr__menu-status">
76:          <ThemeToggle class="hdr__menu-theme" />
77-          <div class="hdr__status-badge">
78-            <span class="hdr__status-dot" aria-hidden="true" />
79-            <span class="hdr__status-text">Disponible</span>
80-          </div>
81-          <CurrentTime class="hdr__menu-clock" />
--
516-
517-.hdr__menu {
518-  display: none;
519-}
520-
521:.hdr__menu-status {
522-  display: flex;
523-  align-items: center;
524-  justify-content: space-between;
525-  padding-bottom: var(--space-2);
526-  margin-bottom: var(--space-2);
 M app/components/HeaderComponent.vue
 M app/components/ui/ZIcon.vue
 M docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
 M docs/implementation-artifacts/sprint-status.yaml
?? app/components/ui/ThemeToggle.vue
?? docs/implementation-artifacts/code-reviews/13-3/

exec
/bin/zsh -lc "rg -n 'status-badge|menu-status|menu-clock' app/components/HeaderComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
50:      <div class="hdr__status-badge">
75:        <div class="hdr__menu-status">
77:          <div class="hdr__status-badge">
81:          <CurrentTime class="hdr__menu-clock" />
451:.hdr__status-badge {
521:.hdr__menu-status {
532:  .hdr__status-badge,

codex
- **Badge de statut masqué dans le menu mobile** — Viole AC3 / UX-DR34 (« aligné avec le badge de statut »). La règle responsive ajoutée cible globalement `.hdr__status-badge` à `@media (width <= 1650px)`, ce qui masque aussi le badge situé dans `.hdr__menu-status` sur mobile, tandis que seul le `ThemeToggle` reste visible (`full.diff`, modification de `HeaderComponent.vue`).
tokens used
66 624
- **Badge de statut masqué dans le menu mobile** — Viole AC3 / UX-DR34 (« aligné avec le badge de statut »). La règle responsive ajoutée cible globalement `.hdr__status-badge` à `@media (width <= 1650px)`, ce qui masque aussi le badge situé dans `.hdr__menu-status` sur mobile, tandis que seul le `ThemeToggle` reste visible (`full.diff`, modification de `HeaderComponent.vue`).

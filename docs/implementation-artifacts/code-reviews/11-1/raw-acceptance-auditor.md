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
session id: 01a09b99-6a20-7000-9e86-6da2cdc99273
--------
user
# Acceptance Auditor Prompt — Story 11.1

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.1), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-1/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise la compétence de revue de code adversariale pour structurer l’audit, puis je comparerai directement le diff aux AC et contraintes des documents indiqués.
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
/bin/zsh -lc "sed -n '1,300p' /Users/simon/.codex/skills/bmad-code-review/steps/step-02-review.md" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-03-triage.md" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-04-present.md" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/implementation-artifacts/code-reviews/11-1/full.diff && rg -n -C 5 'Epic 11|Story 11\\.1|11\\.1|Acceptance|AC[0-9]|acceptance|atmosphere|ambiance|kinet|cin[eé]t|site|data' docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md docs/planning-artifacts/epics.md docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     150 docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
     789 docs/planning-artifacts/epics.md
     282 docs/project-context.md
      86 docs/specs/spec-home-awwwards/SPEC.md
     617 docs/implementation-artifacts/code-reviews/11-1/full.diff
    1924 total
docs/specs/spec-home-awwwards/SPEC.md-1----
docs/specs/spec-home-awwwards/SPEC.md-2-id: SPEC-home-awwwards
docs/specs/spec-home-awwwards/SPEC.md-3-companions:
docs/specs/spec-home-awwwards/SPEC.md-4-  - sections-mapping.md
docs/specs/spec-home-awwwards/SPEC.md-5-  - ../../contexte_malt.md
docs/specs/spec-home-awwwards/SPEC.md:6:  - ../../direction_strategique_site.md
docs/specs/spec-home-awwwards/SPEC.md-7-  - ../../project-context.md
docs/specs/spec-home-awwwards/SPEC.md-8-sources:
docs/specs/spec-home-awwwards/SPEC.md:9:  - ../../design_system/ui_kits/jouan-site/Home - Awwwards.html
docs/specs/spec-home-awwwards/SPEC.md-10----
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
docs/specs/spec-home-awwwards/SPEC.md:27:  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
docs/specs/spec-home-awwwards/SPEC.md-28-  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-29-
docs/specs/spec-home-awwwards/SPEC.md-30-- id: CAP-2
docs/specs/spec-home-awwwards/SPEC.md:31:  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
docs/specs/spec-home-awwwards/SPEC.md-32-  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
docs/specs/spec-home-awwwards/SPEC.md-33-
docs/specs/spec-home-awwwards/SPEC.md-34-- id: CAP-3
docs/specs/spec-home-awwwards/SPEC.md:35:  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
docs/specs/spec-home-awwwards/SPEC.md-36-  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
docs/specs/spec-home-awwwards/SPEC.md-37-
docs/specs/spec-home-awwwards/SPEC.md-38-- id: CAP-4
docs/specs/spec-home-awwwards/SPEC.md:39:  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
docs/specs/spec-home-awwwards/SPEC.md-40-  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-41-
docs/specs/spec-home-awwwards/SPEC.md-42-- id: CAP-5
docs/specs/spec-home-awwwards/SPEC.md:43:  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
docs/specs/spec-home-awwwards/SPEC.md-44-  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
docs/specs/spec-home-awwwards/SPEC.md-45-
docs/specs/spec-home-awwwards/SPEC.md-46-- id: CAP-6
docs/specs/spec-home-awwwards/SPEC.md:47:  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
docs/specs/spec-home-awwwards/SPEC.md-48-  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
docs/specs/spec-home-awwwards/SPEC.md-49-
docs/specs/spec-home-awwwards/SPEC.md-50-- id: CAP-7
docs/specs/spec-home-awwwards/SPEC.md:51:  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
docs/specs/spec-home-awwwards/SPEC.md-52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/specs/spec-home-awwwards/SPEC.md-53-
docs/specs/spec-home-awwwards/SPEC.md-54-- id: CAP-8
docs/specs/spec-home-awwwards/SPEC.md:55:  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
docs/specs/spec-home-awwwards/SPEC.md-56-  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
docs/specs/spec-home-awwwards/SPEC.md-57-
docs/specs/spec-home-awwwards/SPEC.md-58-- id: CAP-9
docs/specs/spec-home-awwwards/SPEC.md:59:  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
docs/specs/spec-home-awwwards/SPEC.md-60-  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
docs/specs/spec-home-awwwards/SPEC.md-61-
docs/specs/spec-home-awwwards/SPEC.md-62-- id: CAP-10
docs/specs/spec-home-awwwards/SPEC.md:63:  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
docs/specs/spec-home-awwwards/SPEC.md:64:  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
docs/specs/spec-home-awwwards/SPEC.md-65-
docs/specs/spec-home-awwwards/SPEC.md-66-## Constraints
docs/specs/spec-home-awwwards/SPEC.md-67-
docs/specs/spec-home-awwwards/SPEC.md-68-- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
docs/specs/spec-home-awwwards/SPEC.md:69:- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
docs/specs/spec-home-awwwards/SPEC.md-70-- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
docs/specs/spec-home-awwwards/SPEC.md-71-- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
docs/specs/spec-home-awwwards/SPEC.md-72-- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
docs/specs/spec-home-awwwards/SPEC.md-73-- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
docs/specs/spec-home-awwwards/SPEC.md-74-- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
docs/specs/spec-home-awwwards/SPEC.md-75-
docs/specs/spec-home-awwwards/SPEC.md-76-## Non-goals
docs/specs/spec-home-awwwards/SPEC.md-77-
docs/specs/spec-home-awwwards/SPEC.md:78:- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
docs/specs/spec-home-awwwards/SPEC.md-79-- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
docs/specs/spec-home-awwwards/SPEC.md-80-- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
docs/specs/spec-home-awwwards/SPEC.md:81:- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
docs/specs/spec-home-awwwards/SPEC.md-82-- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
docs/specs/spec-home-awwwards/SPEC.md-83-
docs/specs/spec-home-awwwards/SPEC.md-84-## Success signal
docs/specs/spec-home-awwwards/SPEC.md-85-
docs/specs/spec-home-awwwards/SPEC.md-86-- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.
--
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-1----
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-2-baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-3----
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-4-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:5:# Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-6-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-7-Status: review
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-8-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-9-<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-10-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-11-## Story
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-12-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:13:As a visiteur découvrant la page d'accueil,
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-14-I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:15:so that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-16-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:17:## Acceptance Criteria
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-18-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-19-1. **Given** le projet en production sur `main` et la volonté de développer de manière totalement isolée sans impacter la prod
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-20-   **When** on initialise la branche de développement dédiée `feat/home-awwwards` issue de `develop` (NFR10)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:21:   **Then** l'historique de `main` reste préservé et tout le travail de l'Epic 11 s'exécute sur cette branche isolée.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-22-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:23:2. **Given** la source de vérité partagée du contenu `app/data/site.ts`
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-24-   **When** on met à jour les données du profil, des compétences et des projets
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-25-   **Then** `SITE.profile` affiche le rôle officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », la ville « Rouen, France », l'URL Malt `https://www.malt.fr/profile/simonjouan`, et le statut disponible
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-26-   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-27-   **And** `SITE.projects` intègre les 3 projets alignés avec Malt : **Keova** (statut production, lien live `https://keova.app`), **TryOn** (statut étude de cas MVP livré, sans lien mort `url: ""`), et **Nodium** (statut lab R&D en cours)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-28-   **And** l'interface `IProject` supporte `status?: string` et `url?: string` de façon rétrocompatible (sans casser `programs/Projets.ts` ni `FooterComponent`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-29-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:30:3. **Given** le conteneur atmosphérique cinétique `.atmos`
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:31:   **When** le visiteur charge la page d'accueil
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-32-   **Then** 3 calques auroras floutés (aubergine, orange, rouge) s'animent de façon lente et fluide (26s à 32s) en pur CSS, superposés à une grille de points et une texture de scanlines CRT terminales
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-33-   **And** le conteneur est marqué `aria-hidden="true"`
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-34-   **And** sous `@media (prefers-reduced-motion: reduce)`, les keyframes d'animation sont strictement neutralisées (`animation: none`), les gradients restant figés de manière lisible.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-35-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-36-4. **Given** un utilisateur sur ordinateur de bureau avec souris (`@media (hover: hover)`)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-37-   **When** il survole la page d'accueil
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:38:   **Then** un micro-curseur interactif fluide (`.cursor-dot` + `.cursor-ring`) suit le pointeur et réagit (agrandissement / scaling) au survol des éléments interactifs marqués `data-hot` (boutons, liens, cartes)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-39-   **And** le curseur personnalisé est totalement masqué sur les périphériques tactiles (`@media (hover: none)`) et sous reduced-motion
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-40-   **And** en cas d'erreur ou d'absence de JS, le curseur système natif du navigateur reste 100 % opérationnel et visible.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-41-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:42:5. **Given** l'ensemble des ajouts de la story (branche, `site.ts`, composant atmosphérique, micro-curseur)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-43-   **When** on exécute la gate de validation Docker
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-44-   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques pré-rendues.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-45-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-46-## Tasks / Subtasks
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-47-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-48-- [x] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-49-  - [x] Vérifier l'état de l'arbre de travail (`git status`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-50-  - [x] S'assurer que la branche `develop` est à jour.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-51-  - [x] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-52-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:53:- [x] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-54-  - [x] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-55-  - [x] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-56-  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-57-  - [x] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-58-  - [x] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
--
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-65-  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-66-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-67-- [x] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-68-  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-69-  - [x] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:70:  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-71-  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-72-  - [x] Nettoyer les listeners lors du `onUnmounted()`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-73-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-74-- [x] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-75-  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
--
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-82-- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-83-- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--color-bg-base)`, `var(--color-aubergine-base)`, `var(--color-orange-base)`, `var(--color-text-default)`, etc.). [Source: AGENTS.md#Section 3]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-84-- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `pointermove`) DOIT être encapsulé dans un bloc `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-85-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-86-### Fichiers concernés & Analyse d'impact
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:87:- **`app/data/site.ts`** (UPDATE) : Source unique de vérité du profil et des projets.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-88-  - *État actuel :* Contient `patio-conseil.fr` (WordPress) et un profil générique « Développeur web freelance ».
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-89-  - *Modifications :* Rôle mis à jour (« Développeur Full Stack TypeScript — Nuxt / NestJS »), ville « Rouen, France », stack moderne ciblée, et projets Keova (live), TryOn (étude de cas) et Nodium (lab).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-90-  - *À préserver :* Rétrocompatibilité avec `app/components/terminal/programs/Projets.ts` qui boucle sur `SITE.projects`. Si `project.url` est vide, ne pas tenter d'ouvrir de lien ou conditionner l'action d'ouverture.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-91-- **`app/components/terminal/programs/Projets.ts`** (UPDATE si nécessaire) : Adapter le programme terminal pour gérer les projets sans URL (ex. TryOn : afficher `(étude de cas)` au lieu d'ouvrir une URL vide).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-92-- **`app/components/home/HomeAtmosComponent.vue`** (NEW) : Composant dédié aux calques auroras et scanlines.
--
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-99-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-100-## Dev Agent Record
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-101-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-102-### Implementation Plan
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-103-1. **Isolation Git :** Création et bascule sur la branche `feat/home-awwwards` depuis `develop`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:104:2. **Données centralisées (`site.ts`) :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-105-   - Mise à jour de `IProject` (`status?: string`, `url?: string`) et `IProfile` (`maltUrl?: string`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-106-   - Rôle commercial unifié : « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », lien Malt.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-107-   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-108-   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-109-3. **Rétrocompatibilité :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-110-   - Sécurisation de `FooterComponent.vue` pour supporter les projets sans URL externe.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-111-   - Sécurisation de `programs/Projets.ts` dans le terminal pour afficher `[status]` au lieu d'une URL vide.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:112:4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-113-   - 3 auroras floutées (aubergine, orange, rouge) avec dérive lente fluide en CSS pur.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-114-   - Grille de points et scanlines CRT en overlay.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-115-   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-116-5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-117-   - Suivi fluide (`dot` + `ring`) avec interpolation par `requestAnimationFrame`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:118:   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-119-   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-120-6. **Intégration & Gate Docker :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-121-   - Intégration sur `app/pages/index.vue`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-122-   - Validation 100% verte : `pnpm lint`, `pnpm typecheck`, `pnpm generate` (13 routes pré-rendues).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-123-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-124-### Completion Notes
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-125-- Branche `feat/home-awwwards` initialisée à partir de `develop` (`baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-126-- Données `SITE` alignées rigoureusement sur le profil Malt et la direction stratégique.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:127:- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-128-- Gate Docker 100% verte : 0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques générées avec succès par Nitro.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-129-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-130-## File List
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-131-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:132:- `app/data/site.ts` (MODIFIED)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-133-- `app/components/terminal/programs/Projets.ts` (MODIFIED)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-134-- `app/components/FooterComponent.vue` (MODIFIED)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-135-- `app/components/home/HomeAtmosComponent.vue` (NEW)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-136-- `app/components/ui/ZCustomCursor.vue` (NEW)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-137-- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:138:- `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md` (MODIFIED)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-139-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-140-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-141-## Change Log
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-142-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:143:- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-144-
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-145-### References
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-146-- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-147-- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-148-- [Profil Malt officiel : docs/contexte_malt.md]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:149:- [Direction stratégique : docs/direction_strategique_site.md]
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md-150-- [Directives globales pour agents : AGENTS.md]
--
docs/planning-artifacts/epics.md-1----
docs/planning-artifacts/epics.md:2:stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
docs/planning-artifacts/epics.md-3-inputDocuments:
docs/planning-artifacts/epics.md-4-  - docs/specs/spec-design-system-revamp/SPEC.md
docs/planning-artifacts/epics.md-5-  - docs/specs/spec-design-system-revamp/pages.md
docs/planning-artifacts/epics.md-6-  - docs/specs/spec-design-system-revamp/primitives.md
docs/planning-artifacts/epics.md-7-  - docs/project-context.md
--
docs/planning-artifacts/epics.md-9-  - docs/implementation-artifacts/epic-9-retro-2026-06-29.md
docs/planning-artifacts/epics.md-10-  - docs/specs/spec-home-awwwards/SPEC.md
docs/planning-artifacts/epics.md-11-  - docs/specs/spec-home-awwwards/sections-mapping.md
docs/planning-artifacts/epics.md-12-  - docs/specs/spec-home-awwwards/.decision-log.md
docs/planning-artifacts/epics.md-13-  - docs/contexte_malt.md
docs/planning-artifacts/epics.md:14:  - docs/direction_strategique_site.md
docs/planning-artifacts/epics.md-15-  - AGENTS.md
docs/planning-artifacts/epics.md-16----
docs/planning-artifacts/epics.md-17-
docs/planning-artifacts/epics.md-18-# jouan.ovh - Epic Breakdown
docs/planning-artifacts/epics.md-19-
--
docs/planning-artifacts/epics.md-38-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
docs/planning-artifacts/epics.md-39-FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
docs/planning-artifacts/epics.md-40-FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
docs/planning-artifacts/epics.md-41-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
docs/planning-artifacts/epics.md-42-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/planning-artifacts/epics.md:43:FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/planning-artifacts/epics.md-44-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/planning-artifacts/epics.md:45:FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/planning-artifacts/epics.md-46-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
docs/planning-artifacts/epics.md-47-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
docs/planning-artifacts/epics.md-48-
docs/planning-artifacts/epics.md:49:#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
docs/planning-artifacts/epics.md-50-FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
docs/planning-artifacts/epics.md-51-FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
docs/planning-artifacts/epics.md:52:FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md-53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md-54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md-55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
docs/planning-artifacts/epics.md-56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/planning-artifacts/epics.md-57-FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
docs/planning-artifacts/epics.md-58-FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
docs/planning-artifacts/epics.md:59:FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
docs/planning-artifacts/epics.md-60-
docs/planning-artifacts/epics.md-61-### NonFunctional Requirements
docs/planning-artifacts/epics.md-62-
docs/planning-artifacts/epics.md-63-NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
docs/planning-artifacts/epics.md-64-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
--
docs/planning-artifacts/epics.md-67-NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
docs/planning-artifacts/epics.md-68-NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
docs/planning-artifacts/epics.md-69-NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
docs/planning-artifacts/epics.md-70-NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
docs/planning-artifacts/epics.md-71-NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
docs/planning-artifacts/epics.md:72:NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
docs/planning-artifacts/epics.md:73:NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
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
--
docs/planning-artifacts/epics.md-95-UX-DR7: Primitive `ZAvatar.vue` (radius pill) — réf. `Avatar.jsx`.
docs/planning-artifacts/epics.md-96-UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
docs/planning-artifacts/epics.md-97-UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
docs/planning-artifacts/epics.md-98-UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
docs/planning-artifacts/epics.md-99-UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
docs/planning-artifacts/epics.md:100:UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
docs/planning-artifacts/epics.md-101-UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
docs/planning-artifacts/epics.md-102-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
docs/planning-artifacts/epics.md-103-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/planning-artifacts/epics.md-104-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/planning-artifacts/epics.md-105-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/planning-artifacts/epics.md-106-UX-DR18: Pile atmosphérique `.atmos` avec 3 calques auroras floutés (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), scanlines CRT et grille de points.
docs/planning-artifacts/epics.md-107-UX-DR19: Composant `BootOverlay` avec montée en charge progressive stylisée `jouan.os`, affichage des étapes, fermeture Escape/clic et mémorisation en session.
docs/planning-artifacts/epics.md:108:UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
docs/planning-artifacts/epics.md-109-UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
docs/planning-artifacts/epics.md-110-UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
docs/planning-artifacts/epics.md-111-UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
docs/planning-artifacts/epics.md-112-UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
docs/planning-artifacts/epics.md:113:UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
docs/planning-artifacts/epics.md-114-
docs/planning-artifacts/epics.md-115-### FR Coverage Map
docs/planning-artifacts/epics.md-116-
docs/planning-artifacts/epics.md-117-FR1: Epic 1 — Migration de la stack vers Nuxt 4
docs/planning-artifacts/epics.md-118-FR2: Epic 2 — Tokens du design system disponibles
--
docs/planning-artifacts/epics.md-126-FR10: Epic 8 — Terminal easter-egg restylé
docs/planning-artifacts/epics.md-127-FR11: Epic 9 — Accessibilité & finitions motion
docs/planning-artifacts/epics.md-128-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/planning-artifacts/epics.md-129-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/planning-artifacts/epics.md-130-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md:131:FR15: Epic 10 — SEO centralisé site-wide
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
docs/planning-artifacts/epics.md:148:Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
docs/planning-artifacts/epics.md-149-**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_
docs/planning-artifacts/epics.md-150-
docs/planning-artifacts/epics.md-151-### Epic 2: Fondations du design system
docs/planning-artifacts/epics.md:152:Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
docs/planning-artifacts/epics.md-153-**FRs covered:** FR2, FR3, FR4 _(UX-DR1–7, 10, 11)_
docs/planning-artifacts/epics.md-154-
docs/planning-artifacts/epics.md-155-### Epic 3: Page d'accueil
docs/planning-artifacts/epics.md:156:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
docs/planning-artifacts/epics.md-157-**FRs covered:** FR5 _(UX-DR12)_
docs/planning-artifacts/epics.md-158-
docs/planning-artifacts/epics.md-159-### Epic 4: Page Services
docs/planning-artifacts/epics.md:160:Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
docs/planning-artifacts/epics.md-161-**FRs covered:** FR6 _(UX-DR13)_
docs/planning-artifacts/epics.md-162-
docs/planning-artifacts/epics.md-163-### Epic 5: Page À-propos
docs/planning-artifacts/epics.md:164:Le visiteur découvre le parcours : portrait, bio, timeline d'expérience, formation, stack.
docs/planning-artifacts/epics.md-165-**FRs covered:** FR7 _(UX-DR14)_
docs/planning-artifacts/epics.md-166-
docs/planning-artifacts/epics.md-167-### Epic 6: Blog
docs/planning-artifacts/epics.md:168:Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
docs/planning-artifacts/epics.md-169-**FRs covered:** FR8 _(UX-DR15)_
docs/planning-artifacts/epics.md-170-
docs/planning-artifacts/epics.md-171-### Epic 7: Page Contact
docs/planning-artifacts/epics.md:172:Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
docs/planning-artifacts/epics.md-173-**FRs covered:** FR9 _(UX-DR16)_
docs/planning-artifacts/epics.md-174-
docs/planning-artifacts/epics.md-175-### Epic 8: Terminal easter-egg restylé
docs/planning-artifacts/epics.md-176-L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
docs/planning-artifacts/epics.md-177-**FRs covered:** FR10 _(UX-DR8, UX-DR9)_
--
docs/planning-artifacts/epics.md-179-### Epic 9: Accessibilité & finitions motion
docs/planning-artifacts/epics.md-180-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/planning-artifacts/epics.md-181-**FRs covered:** FR11 _(UX-DR17)_
docs/planning-artifacts/epics.md-182-
docs/planning-artifacts/epics.md-183-### Epic 10: Fin de refonte
docs/planning-artifacts/epics.md:184:La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
docs/planning-artifacts/epics.md-185-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-186-
docs/planning-artifacts/epics.md:187:### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md:188:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-189-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
docs/planning-artifacts/epics.md-190-
docs/planning-artifacts/epics.md-191----
docs/planning-artifacts/epics.md-192-
docs/planning-artifacts/epics.md-193-## Epic 1: Migration de la stack vers Nuxt 4
docs/planning-artifacts/epics.md-194-
docs/planning-artifacts/epics.md:195:Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
docs/planning-artifacts/epics.md-196-
docs/planning-artifacts/epics.md-197-### Story 1.1: Migrer le cœur vers Nuxt 4
docs/planning-artifacts/epics.md-198-
docs/planning-artifacts/epics.md:199:As a mainteneur du site,
docs/planning-artifacts/epics.md-200-I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
docs/planning-artifacts/epics.md:201:So that le site repose sur une base moderne et supportée.
docs/planning-artifacts/epics.md-202-
docs/planning-artifacts/epics.md:203:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-204-
docs/planning-artifacts/epics.md-205-**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
docs/planning-artifacts/epics.md-206-**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
docs/planning-artifacts/epics.md-207-**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
docs/planning-artifacts/epics.md-208-**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé
docs/planning-artifacts/epics.md-209-
docs/planning-artifacts/epics.md-210-### Story 1.2: Mettre à jour les modules et dépendances
docs/planning-artifacts/epics.md-211-
docs/planning-artifacts/epics.md:212:As a mainteneur du site,
docs/planning-artifacts/epics.md-213-I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
docs/planning-artifacts/epics.md-214-So that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.
docs/planning-artifacts/epics.md-215-
docs/planning-artifacts/epics.md:216:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-217-
docs/planning-artifacts/epics.md-218-**Given** les versions héritées dans `package.json`
docs/planning-artifacts/epics.md-219-**When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable
docs/planning-artifacts/epics.md-220-**Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>`/`<nuxt-picture>`) fonctionnent
docs/planning-artifacts/epics.md-221-**And** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation)
docs/planning-artifacts/epics.md-222-
docs/planning-artifacts/epics.md-223-### Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)
docs/planning-artifacts/epics.md-224-
docs/planning-artifacts/epics.md:225:As a mainteneur du site,
docs/planning-artifacts/epics.md-226-I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
docs/planning-artifacts/epics.md-227-So that le lint reste la barre de qualité après la montée de version.
docs/planning-artifacts/epics.md-228-
docs/planning-artifacts/epics.md:229:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-230-
docs/planning-artifacts/epics.md-231-**Given** la config `.eslintrc.js` historique
docs/planning-artifacts/epics.md-232-**When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4
docs/planning-artifacts/epics.md-233-**Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration
docs/planning-artifacts/epics.md-234-**And** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`)
docs/planning-artifacts/epics.md-235-
docs/planning-artifacts/epics.md-236-### Story 1.4: Valider build statique et déploiement gh-pages
docs/planning-artifacts/epics.md-237-
docs/planning-artifacts/epics.md:238:As a mainteneur du site,
docs/planning-artifacts/epics.md-239-I want valider `yarn generate` et le déploiement gh-pages après migration,
docs/planning-artifacts/epics.md-240-So that la chaîne de production est verte avant d'entamer la refonte.
docs/planning-artifacts/epics.md-241-
docs/planning-artifacts/epics.md:242:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-243-
docs/planning-artifacts/epics.md-244-**Given** la stack migrée
docs/planning-artifacts/epics.md-245-**When** on lance `yarn generate`
docs/planning-artifacts/epics.md-246-**Then** le build statique réussit et `.output/public` contient les pages existantes
docs/planning-artifacts/epics.md-247-**And** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel
docs/planning-artifacts/epics.md-248-
docs/planning-artifacts/epics.md-249----
docs/planning-artifacts/epics.md-250-
docs/planning-artifacts/epics.md-251-## Epic 2: Fondations du design system
docs/planning-artifacts/epics.md-252-
docs/planning-artifacts/epics.md:253:Langage visuel, primitives Vue réutilisables et châssis global refondu, visibles sur tout le site.
docs/planning-artifacts/epics.md-254-
docs/planning-artifacts/epics.md-255-### Story 2.1: Porter les tokens du design system
docs/planning-artifacts/epics.md-256-
docs/planning-artifacts/epics.md-257-As a développeur,
docs/planning-artifacts/epics.md-258-I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
docs/planning-artifacts/epics.md-259-So that tout composant style via une source unique de vérité (UX-DR1, FR2, NFR2).
docs/planning-artifacts/epics.md-260-
docs/planning-artifacts/epics.md:261:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-262-
docs/planning-artifacts/epics.md-263-**Given** les tokens dans `docs/design_system/tokens/*.css`
docs/planning-artifacts/epics.md-264-**When** on les porte vers `assets/scss/abstract/` (et/ou CSS vars globales) via `@use`
docs/planning-artifacts/epics.md-265-**Then** les valeurs (orange accent, surfaces aubergine, échelle d'espacement, rayons, ombres, motion) sont consommables depuis n'importe quel composant
docs/planning-artifacts/epics.md-266-**And** aucune valeur de couleur/espace/rayon n'est hardcodée dans le nouveau code
docs/planning-artifacts/epics.md-267-
docs/planning-artifacts/epics.md-268-### Story 2.2: Polices et base dark-first
docs/planning-artifacts/epics.md-269-
docs/planning-artifacts/epics.md:270:As a visiteur,
docs/planning-artifacts/epics.md-271-I want une base typographique et de fond cohérente,
docs/planning-artifacts/epics.md:272:So that le site adopte l'identité « OS de nuit » (UX-DR1, NFR1, NFR7).
docs/planning-artifacts/epics.md-273-
docs/planning-artifacts/epics.md:274:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-275-
docs/planning-artifacts/epics.md-276-**Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans
docs/planning-artifacts/epics.md-277-**When** on configure `@font-face`/import et le reset/base dark-first
docs/planning-artifacts/epics.md-278-**Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long
docs/planning-artifacts/epics.md-279-**And** le fond par défaut est sombre (aucun thème clair) et lisible
--
docs/planning-artifacts/epics.md-282-
docs/planning-artifacts/epics.md-283-As a développeur,
docs/planning-artifacts/epics.md-284-I want un composant bouton conforme au DS,
docs/planning-artifacts/epics.md-285-So that les CTA sont cohérents (UX-DR2, FR3).
docs/planning-artifacts/epics.md-286-
docs/planning-artifacts/epics.md:287:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-288-
docs/planning-artifacts/epics.md-289-**Given** la référence `components/core/Button.jsx` (+ `.d.ts`)
docs/planning-artifacts/epics.md-290-**When** on crée `ZButton.vue` (`<script setup>`)
docs/planning-artifacts/epics.md-291-**Then** les variantes (primary orange, dark) et tailles rendent conformément à la référence
docs/planning-artifacts/epics.md-292-**And** les états hover/press/focus suivent les tokens (orange → hover/active, nudge press)
--
docs/planning-artifacts/epics.md-295-
docs/planning-artifacts/epics.md-296-As a développeur,
docs/planning-artifacts/epics.md-297-I want un composant carte conforme au DS,
docs/planning-artifacts/epics.md-298-So that le contenu est présenté de façon cohérente (UX-DR3, FR3).
docs/planning-artifacts/epics.md-299-
docs/planning-artifacts/epics.md:300:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-301-
docs/planning-artifacts/epics.md-302-**Given** la référence `Card.jsx` et les `ZCard*` existants
docs/planning-artifacts/epics.md-303-**When** on crée/refond `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline)
docs/planning-artifacts/epics.md-304-**Then** la carte rend conformément à la référence
docs/planning-artifacts/epics.md-305-**And** les usages existants de `ZCard*` sont migrés sans régression
--
docs/planning-artifacts/epics.md-308-
docs/planning-artifacts/epics.md-309-As a développeur,
docs/planning-artifacts/epics.md-310-I want des composants badge et tag conformes au DS,
docs/planning-artifacts/epics.md-311-So that les libellés et chips sont cohérents (UX-DR4, UX-DR5, FR3).
docs/planning-artifacts/epics.md-312-
docs/planning-artifacts/epics.md:313:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-314-
docs/planning-artifacts/epics.md-315-**Given** les références `Badge.jsx` et `Tag.jsx`
docs/planning-artifacts/epics.md-316-**When** on crée `ZBadge.vue` et `ZTag.vue` (tag en radius pill)
docs/planning-artifacts/epics.md-317-**Then** ils rendent conformément aux références et stylent via tokens
docs/planning-artifacts/epics.md-318-
--
docs/planning-artifacts/epics.md-320-
docs/planning-artifacts/epics.md-321-As a développeur,
docs/planning-artifacts/epics.md-322-I want des composants champ et avatar conformes au DS,
docs/planning-artifacts/epics.md-323-So that les formulaires et identités visuelles sont cohérents (UX-DR6, UX-DR7, FR3).
docs/planning-artifacts/epics.md-324-
docs/planning-artifacts/epics.md:325:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-326-
docs/planning-artifacts/epics.md-327-**Given** les références `Input.jsx` et `Avatar.jsx`
docs/planning-artifacts/epics.md-328-**When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill)
docs/planning-artifacts/epics.md-329-**Then** ils rendent conformément aux références et stylent via tokens
docs/planning-artifacts/epics.md-330-
--
docs/planning-artifacts/epics.md-332-
docs/planning-artifacts/epics.md-333-As a développeur,
docs/planning-artifacts/epics.md-334-I want un système d'icônes cohérent,
docs/planning-artifacts/epics.md-335-So that l'UI utilise des icônes au trait et les glyphes de marque (UX-DR10).
docs/planning-artifacts/epics.md-336-
docs/planning-artifacts/epics.md:337:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-338-
docs/planning-artifacts/epics.md-339-**Given** l'approche DS (Lucide CDN + SVG inline)
docs/planning-artifacts/epics.md-340-**When** on intègre Lucide (`currentColor`), les glyphes sociaux en SVG inline et le logo diamant
docs/planning-artifacts/epics.md-341-**Then** les icônes héritent de la couleur du texte
docs/planning-artifacts/epics.md-342-**And** aucune police d'icône n'est introduite
docs/planning-artifacts/epics.md-343-
docs/planning-artifacts/epics.md-344-### Story 2.8: Châssis global (header, footer, nav, socials)
docs/planning-artifacts/epics.md-345-
docs/planning-artifacts/epics.md:346:As a visiteur,
docs/planning-artifacts/epics.md-347-I want un en-tête, un pied de page et une navigation refondus,
docs/planning-artifacts/epics.md:348:So that le site a un cadre cohérent sur toutes les pages (UX-DR11, FR4).
docs/planning-artifacts/epics.md-349-
docs/planning-artifacts/epics.md:350:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-351-
docs/planning-artifacts/epics.md-352-**Given** le UI kit (Header/Footer) et les composants header/footer existants
docs/planning-artifacts/epics.md-353-**When** on refond le header fixe 56px (logo diamant), le footer 56px et la nav
docs/planning-artifacts/epics.md-354-**Then** ils rendent conformément au UI kit, dark-first et responsive mobile
docs/planning-artifacts/epics.md-355-**And** les hexagones sociaux sont présents (footer/contact) et la nav mène aux routes existantes + `/services`, `/contact`
docs/planning-artifacts/epics.md-356-
docs/planning-artifacts/epics.md-357----
docs/planning-artifacts/epics.md-358-
docs/planning-artifacts/epics.md-359-## Epic 3: Page d'accueil
docs/planning-artifacts/epics.md-360-
docs/planning-artifacts/epics.md:361:Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.
docs/planning-artifacts/epics.md-362-
docs/planning-artifacts/epics.md-363-### Story 3.1: Hero Terminal (A)
docs/planning-artifacts/epics.md-364-
docs/planning-artifacts/epics.md:365:As a visiteur,
docs/planning-artifacts/epics.md-366-I want un hero d'accueil en style terminal,
docs/planning-artifacts/epics.md-367-So that je perçois immédiatement l'identité de marque (UX-DR12, FR5).
docs/planning-artifacts/epics.md-368-
docs/planning-artifacts/epics.md:369:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-370-
docs/planning-artifacts/epics.md-371-**Given** la direction de hero Terminal (A) de `Home.jsx`
docs/planning-artifacts/epics.md-372-**When** on implémente le hero sur `/`
docs/planning-artifacts/epics.md-373-**Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne)
docs/planning-artifacts/epics.md-374-**And** un CTA principal mène à un parcours clé (ex. contact/about)
docs/planning-artifacts/epics.md-375-
docs/planning-artifacts/epics.md-376-### Story 3.2: Aperçu services et stats
docs/planning-artifacts/epics.md-377-
docs/planning-artifacts/epics.md:378:As a visiteur,
docs/planning-artifacts/epics.md-379-I want voir un aperçu des services et des chiffres clés,
docs/planning-artifacts/epics.md-380-So that je comprends rapidement l'offre (UX-DR12, FR5).
docs/planning-artifacts/epics.md-381-
docs/planning-artifacts/epics.md:382:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-383-
docs/planning-artifacts/epics.md:384:**Given** le contenu `data.js` (services, stats)
docs/planning-artifacts/epics.md-385-**When** on implémente les blocs aperçu services + stats sur `/`
docs/planning-artifacts/epics.md-386-**Then** les 3 services et les stats rendent conformément à `Home.jsx`
docs/planning-artifacts/epics.md-387-**And** un lien mène à la page Services
docs/planning-artifacts/epics.md-388-
docs/planning-artifacts/epics.md-389-### Story 3.3: Projets sélectionnés
docs/planning-artifacts/epics.md-390-
docs/planning-artifacts/epics.md:391:As a visiteur,
docs/planning-artifacts/epics.md-392-I want voir des projets sélectionnés,
docs/planning-artifacts/epics.md-393-So that j'évalue le travail de Simon (UX-DR12, FR5).
docs/planning-artifacts/epics.md-394-
docs/planning-artifacts/epics.md:395:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-396-
docs/planning-artifacts/epics.md:397:**Given** le contenu projets de `data.js`
docs/planning-artifacts/epics.md-398-**When** on implémente le bloc projets sur `/` avec `ZCard`
docs/planning-artifacts/epics.md-399-**Then** les projets sélectionnés rendent en cartes conformes au DS
docs/planning-artifacts/epics.md-400-
docs/planning-artifacts/epics.md-401----
docs/planning-artifacts/epics.md-402-
docs/planning-artifacts/epics.md-403-## Epic 4: Page Services
docs/planning-artifacts/epics.md-404-
docs/planning-artifacts/epics.md:405:Le visiteur comprend les trois offres et le process (route `/services`).
docs/planning-artifacts/epics.md-406-
docs/planning-artifacts/epics.md-407-### Story 4.1: Route /services et cartes d'offre
docs/planning-artifacts/epics.md-408-
docs/planning-artifacts/epics.md:409:As a visiteur,
docs/planning-artifacts/epics.md-410-I want une page Services avec les trois offres,
docs/planning-artifacts/epics.md-411-So that je comprends ce que Simon propose (UX-DR13, FR6).
docs/planning-artifacts/epics.md-412-
docs/planning-artifacts/epics.md:413:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-414-
docs/planning-artifacts/epics.md:415:**Given** la référence `Services.jsx` et le contenu `data.js`
docs/planning-artifacts/epics.md-416-**When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA)
docs/planning-artifacts/epics.md-417-**Then** les 3 offres rendent conformément à la référence
docs/planning-artifacts/epics.md-418-**And** la route est accessible depuis la nav
docs/planning-artifacts/epics.md-419-
docs/planning-artifacts/epics.md-420-### Story 4.2: Section process
docs/planning-artifacts/epics.md-421-
docs/planning-artifacts/epics.md:422:As a visiteur,
docs/planning-artifacts/epics.md-423-I want voir les étapes du process,
docs/planning-artifacts/epics.md-424-So that je sais comment se déroule une collaboration (UX-DR13, FR6).
docs/planning-artifacts/epics.md-425-
docs/planning-artifacts/epics.md:426:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-427-
docs/planning-artifacts/epics.md:428:**Given** les étapes du process dans `Services.jsx`/`data.js`
docs/planning-artifacts/epics.md-429-**When** on implémente la section process sur `/services`
docs/planning-artifacts/epics.md-430-**Then** les étapes rendent dans l'ordre conformément à la référence
docs/planning-artifacts/epics.md-431-
docs/planning-artifacts/epics.md-432----
docs/planning-artifacts/epics.md-433-
docs/planning-artifacts/epics.md-434-## Epic 5: Page À-propos
docs/planning-artifacts/epics.md-435-
docs/planning-artifacts/epics.md:436:Le visiteur découvre le parcours de Simon.
docs/planning-artifacts/epics.md-437-
docs/planning-artifacts/epics.md-438-### Story 5.1: Portrait et bio
docs/planning-artifacts/epics.md-439-
docs/planning-artifacts/epics.md:440:As a visiteur,
docs/planning-artifacts/epics.md-441-I want voir le portrait et la bio de Simon,
docs/planning-artifacts/epics.md-442-So that je connais la personne derrière le travail (UX-DR14, FR7).
docs/planning-artifacts/epics.md-443-
docs/planning-artifacts/epics.md:444:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-445-
docs/planning-artifacts/epics.md:446:**Given** la référence `About.jsx`, le portrait et le contenu `data.js`
docs/planning-artifacts/epics.md-447-**When** on refond `/about` avec portrait + bio
docs/planning-artifacts/epics.md-448-**Then** la section rend conformément à la référence, en français 1re personne
docs/planning-artifacts/epics.md-449-
docs/planning-artifacts/epics.md-450-### Story 5.2: Timeline, formation et stack
docs/planning-artifacts/epics.md-451-
docs/planning-artifacts/epics.md:452:As a visiteur,
docs/planning-artifacts/epics.md-453-I want voir l'expérience, la formation et la stack technique,
docs/planning-artifacts/epics.md-454-So that j'évalue les compétences de Simon (UX-DR14, FR7).
docs/planning-artifacts/epics.md-455-
docs/planning-artifacts/epics.md:456:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-457-
docs/planning-artifacts/epics.md:458:**Given** le contenu CV de `data.js`
docs/planning-artifacts/epics.md-459-**When** on implémente la timeline d'expérience, la formation et la stack sur `/about`
docs/planning-artifacts/epics.md-460-**Then** les trois sections rendent conformément à la référence
docs/planning-artifacts/epics.md-461-**And** la stack utilise des `ZTag`/`ZBadge`
docs/planning-artifacts/epics.md-462-
docs/planning-artifacts/epics.md-463----
docs/planning-artifacts/epics.md-464-
docs/planning-artifacts/epics.md-465-## Epic 6: Blog
docs/planning-artifacts/epics.md-466-
docs/planning-artifacts/epics.md:467:Le visiteur lit les articles (index + article).
docs/planning-artifacts/epics.md-468-
docs/planning-artifacts/epics.md-469-### Story 6.1: Index du blog et empty-state
docs/planning-artifacts/epics.md-470-
docs/planning-artifacts/epics.md:471:As a visiteur,
docs/planning-artifacts/epics.md-472-I want une liste d'articles soignée,
docs/planning-artifacts/epics.md-473-So that je trouve du contenu à lire (UX-DR15, FR8).
docs/planning-artifacts/epics.md-474-
docs/planning-artifacts/epics.md:475:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-476-
docs/planning-artifacts/epics.md-477-**Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`
docs/planning-artifacts/epics.md-478-**When** on crée le dossier `content/` et on refond `/blog` (index + empty-state)
docs/planning-artifacts/epics.md-479-**Then** la liste rend en cartes conformes au DS
docs/planning-artifacts/epics.md-480-**And** l'empty-state français soigné s'affiche quand il n'y a aucun article
docs/planning-artifacts/epics.md-481-
docs/planning-artifacts/epics.md-482-### Story 6.2: Vue article (prose + code)
docs/planning-artifacts/epics.md-483-
docs/planning-artifacts/epics.md:484:As a visiteur,
docs/planning-artifacts/epics.md-485-I want lire un article avec une mise en forme lisible,
docs/planning-artifacts/epics.md-486-So that le contenu prose et code est agréable (UX-DR15, FR8).
docs/planning-artifacts/epics.md-487-
docs/planning-artifacts/epics.md:488:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-489-
docs/planning-artifacts/epics.md-490-**Given** un article markdown dans `content/`
docs/planning-artifacts/epics.md-491-**When** on refond `/blog/[...slug]`
docs/planning-artifacts/epics.md-492-**Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS
docs/planning-artifacts/epics.md-493-
docs/planning-artifacts/epics.md-494----
docs/planning-artifacts/epics.md-495-
docs/planning-artifacts/epics.md-496-## Epic 7: Page Contact
docs/planning-artifacts/epics.md-497-
docs/planning-artifacts/epics.md:498:Le visiteur peut contacter Simon (route `/contact`).
docs/planning-artifacts/epics.md-499-
docs/planning-artifacts/epics.md-500-### Story 7.1: Route /contact et formulaire
docs/planning-artifacts/epics.md-501-
docs/planning-artifacts/epics.md:502:As a visiteur,
docs/planning-artifacts/epics.md-503-I want un formulaire de contact,
docs/planning-artifacts/epics.md-504-So that je peux écrire à Simon (UX-DR16, FR9).
docs/planning-artifacts/epics.md-505-
docs/planning-artifacts/epics.md:506:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-507-
docs/planning-artifacts/epics.md:508:**Given** la référence `Contact.jsx` et la contrainte site statique (pas de backend)
docs/planning-artifacts/epics.md-509-**When** on crée la route `/contact` avec le formulaire (`ZInput`, `ZButton`)
docs/planning-artifacts/epics.md-510-**Then** le formulaire valide les champs côté front et affiche un feedback
docs/planning-artifacts/epics.md-511-**And** aucune dépendance backend n'est requise (NFR4)
docs/planning-artifacts/epics.md-512-
docs/planning-artifacts/epics.md-513-### Story 7.2: Infos, CTA terminal et socials
docs/planning-artifacts/epics.md-514-
docs/planning-artifacts/epics.md:515:As a visiteur,
docs/planning-artifacts/epics.md-516-I want des moyens de contact alternatifs,
docs/planning-artifacts/epics.md-517-So that je choisis comment joindre Simon (UX-DR16, FR9).
docs/planning-artifacts/epics.md-518-
docs/planning-artifacts/epics.md:519:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-520-
docs/planning-artifacts/epics.md-521-**Given** la référence `Contact.jsx`
docs/planning-artifacts/epics.md-522-**When** on implémente la carte infos, le CTA terminal et les liens sociaux hexagonaux
docs/planning-artifacts/epics.md-523-**Then** ils rendent conformément à la référence
docs/planning-artifacts/epics.md-524-**And** le CTA terminal ouvre l'easter-egg terminal
--
docs/planning-artifacts/epics.md-529-
docs/planning-artifacts/epics.md-530-L'easter-egg terminal fonctionne et adopte le style du DS.
docs/planning-artifacts/epics.md-531-
docs/planning-artifacts/epics.md-532-### Story 8.1: Style TerminalWindow et Prompt
docs/planning-artifacts/epics.md-533-
docs/planning-artifacts/epics.md:534:As a visiteur,
docs/planning-artifacts/epics.md-535-I want un terminal au style de la marque,
docs/planning-artifacts/epics.md-536-So that l'easter-egg s'intègre à l'identité (UX-DR8, UX-DR9, FR10).
docs/planning-artifacts/epics.md-537-
docs/planning-artifacts/epics.md:538:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-539-
docs/planning-artifacts/epics.md-540-**Given** `components/terminal/` existant et les références `TerminalWindow.jsx`/`Prompt.jsx`
docs/planning-artifacts/epics.md-541-**When** on restyle la fenêtre (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) et le prompt vert (`anon.@jouan.ovh:~$`)
docs/planning-artifacts/epics.md-542-**Then** le terminal rend conformément au DS
docs/planning-artifacts/epics.md-543-**And** le caret clignotant est la seule animation en boucle
docs/planning-artifacts/epics.md-544-
docs/planning-artifacts/epics.md-545-### Story 8.2: Préserver les commandes et l'ouverture
docs/planning-artifacts/epics.md-546-
docs/planning-artifacts/epics.md:547:As a visiteur,
docs/planning-artifacts/epics.md-548-I want que toutes les commandes du terminal marchent,
docs/planning-artifacts/epics.md-549-So that l'easter-egg reste fonctionnel après refonte (FR10, NFR9).
docs/planning-artifacts/epics.md-550-
docs/planning-artifacts/epics.md:551:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-552-
docs/planning-artifacts/epics.md-553-**Given** le sous-système terminal restylé
docs/planning-artifacts/epics.md-554-**When** on teste l'ouverture modale et les commandes
docs/planning-artifacts/epics.md-555-**Then** `help`, `about`, `skills`, `projets`, `contact`, `clear` répondent sans régression
docs/planning-artifacts/epics.md-556-**And** le terminal reste draggable
--
docs/planning-artifacts/epics.md-561-
docs/planning-artifacts/epics.md-562-As a mainteneur du codebase,
docs/planning-artifacts/epics.md-563-I want que le sous-système terminal soit en `<script setup>` (plus d'Options API),
docs/planning-artifacts/epics.md-564-So that le dernier îlot legacy est résorbé sans aucune régression fonctionnelle (FR10, NFR9).
docs/planning-artifacts/epics.md-565-
docs/planning-artifacts/epics.md:566:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-567-
docs/planning-artifacts/epics.md-568-**Given** `TerminalComponent.vue` / `TerminalManagerComponent.vue` en Options API
docs/planning-artifacts/epics.md-569-**When** on les réécrit en `<script setup lang="ts">` à comportement constant
docs/planning-artifacts/epics.md-570-**Then** plus aucune Options API dans le sous-système terminal, et commandes / drag / resize / ouverture (header + `/contact`) sans régression
docs/planning-artifacts/epics.md-571-**And** le rendu visuel (restyle 8.1) et `lint`/`typecheck`/`generate` restent identiques/verts
--
docs/planning-artifacts/epics.md-576-
docs/planning-artifacts/epics.md-577-Passe transverse finale de qualité.
docs/planning-artifacts/epics.md-578-
docs/planning-artifacts/epics.md-579-### Story 9.1: États interactifs cohérents
docs/planning-artifacts/epics.md-580-
docs/planning-artifacts/epics.md:581:As a visiteur,
docs/planning-artifacts/epics.md-582-I want des états visuels clairs sur les éléments interactifs,
docs/planning-artifacts/epics.md-583-So that je sais ce qui est cliquable et focalisé (UX-DR17, FR11).
docs/planning-artifacts/epics.md-584-
docs/planning-artifacts/epics.md:585:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-586-
docs/planning-artifacts/epics.md-587-**Given** les primitives et la navigation
docs/planning-artifacts/epics.md-588-**When** on vérifie les états focus/hover/press
docs/planning-artifacts/epics.md-589-**Then** chaque élément interactif a des états visibles conformes au DS
docs/planning-artifacts/epics.md-590-**And** le focus clavier est toujours visible
docs/planning-artifacts/epics.md-591-
docs/planning-artifacts/epics.md-592-### Story 9.2: Motion réduit, contraste et clavier
docs/planning-artifacts/epics.md-593-
docs/planning-artifacts/epics.md:594:As a visiteur,
docs/planning-artifacts/epics.md-595-I want une interface accessible,
docs/planning-artifacts/epics.md-596-So that je peux l'utiliser quelles que soient mes contraintes (UX-DR17, FR11).
docs/planning-artifacts/epics.md-597-
docs/planning-artifacts/epics.md:598:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-599-
docs/planning-artifacts/epics.md-600-**Given** l'interface refondue
docs/planning-artifacts/epics.md-601-**When** on audite motion, contraste et navigation clavier
docs/planning-artifacts/epics.md-602-**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/planning-artifacts/epics.md-603-**And** le contraste texte/fond est lisible et toutes les pages sont navigables au clavier
--
docs/planning-artifacts/epics.md-606-
docs/planning-artifacts/epics.md-607-## Epic 10: Fin de refonte
docs/planning-artifacts/epics.md-608-
docs/planning-artifacts/epics.md-609-_(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic. Le roadmap d'épics 1→9 est `done` mais la refonte n'est pas livrée ; cet épic la rend livrable et la met en production.)_
docs/planning-artifacts/epics.md-610-
docs/planning-artifacts/epics.md:611:La refonte est **réellement livrée** : l'accessibilité résiduelle est bouclée et validée, le SEO est centralisé, la conformité légale est publiée, et le site est déployé en production sur `jouan.ovh` (chaîne gh-pages prouvée, `CNAME` intact). Source : `deferred-work.md` (section « → Epic 10 »). Barre qualité inchangée (pas de framework de test) : `pnpm lint` + `pnpm typecheck` + `pnpm generate` verts + vérification Chrome DevTools MCP.
docs/planning-artifacts/epics.md-612-
docs/planning-artifacts/epics.md-613-### Story 10.1: Décision hébergement prod et dé-risquage du déploiement gh-pages
docs/planning-artifacts/epics.md-614-
docs/planning-artifacts/epics.md:615:As a mainteneur du site,
docs/planning-artifacts/epics.md-616-I want trancher l'hébergement de production et prouver la chaîne de déploiement gh-pages (`CNAME` inclus) sur un dry-run,
docs/planning-artifacts/epics.md-617-So that la première mise en production de la refonte ne révèle pas de surprise (chaîne CI jamais prouvée, ~28 stories empilées).
docs/planning-artifacts/epics.md-618-
docs/planning-artifacts/epics.md:619:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-620-
docs/planning-artifacts/epics.md-621-**Given** la cible prod `jouan.ovh` et la chaîne `pnpm generate` → `push-dir` vers `gh-pages`
docs/planning-artifacts/epics.md-622-**When** on tranche l'hébergement prod (domaine, branche de déploiement, `CNAME`) et on exécute un dry-run du déploiement depuis le staging (`develop`)
docs/planning-artifacts/epics.md-623-**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
docs/planning-artifacts/epics.md:624:**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story
docs/planning-artifacts/epics.md-625-
docs/planning-artifacts/epics.md-626-### Story 10.2: A11y sémantique résiduelle (home / services / contact)
docs/planning-artifacts/epics.md-627-
docs/planning-artifacts/epics.md:628:As a visiteur utilisant un lecteur d'écran,
docs/planning-artifacts/epics.md-629-I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
docs/planning-artifacts/epics.md:630:So that la structure du site m'est annoncée correctement (FR12).
docs/planning-artifacts/epics.md-631-
docs/planning-artifacts/epics.md:632:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-633-
docs/planning-artifacts/epics.md-634-**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
docs/planning-artifacts/epics.md-635-**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
docs/planning-artifacts/epics.md-636-**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
docs/planning-artifacts/epics.md-637-**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
docs/planning-artifacts/epics.md-638-
docs/planning-artifacts/epics.md-639-### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
docs/planning-artifacts/epics.md-640-
docs/planning-artifacts/epics.md:641:As a visiteur,
docs/planning-artifacts/epics.md-642-I want savoir quand un lien ouvre un nouvel onglet,
docs/planning-artifacts/epics.md-643-So that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).
docs/planning-artifacts/epics.md-644-
docs/planning-artifacts/epics.md:645:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-646-
docs/planning-artifacts/epics.md:647:**Given** les liens `target="_blank"` du site (hexagones sociaux header/footer, cartes projet, liens bio…)
docs/planning-artifacts/epics.md-648-**When** on factorise un helper de lien externe (icône + libellé sr-only « (ouvre dans un nouvel onglet) ») et on l'applique à tous les `_blank`
docs/planning-artifacts/epics.md-649-**Then** chaque lien `_blank` porte `rel="noopener"` + l'indication sr-only via le helper unique (aucune duplication ad hoc)
docs/planning-artifacts/epics.md-650-**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte
docs/planning-artifacts/epics.md-651-
docs/planning-artifacts/epics.md-652-### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/planning-artifacts/epics.md-653-
docs/planning-artifacts/epics.md:654:As a visiteur en contraste forcé ou motion réduit,
docs/planning-artifacts/epics.md-655-I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
docs/planning-artifacts/epics.md-656-So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).
docs/planning-artifacts/epics.md-657-
docs/planning-artifacts/epics.md:658:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-659-
docs/planning-artifacts/epics.md-660-**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/planning-artifacts/epics.md-661-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/planning-artifacts/epics.md-662-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/planning-artifacts/epics.md-663-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/planning-artifacts/epics.md-664-
docs/planning-artifacts/epics.md:665:### Story 10.5: SEO centralisé site-wide
docs/planning-artifacts/epics.md-666-
docs/planning-artifacts/epics.md:667:As a visiteur partageant une page (ou un moteur d'indexation),
docs/planning-artifacts/epics.md-668-I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
docs/planning-artifacts/epics.md:669:So that le site est correctement indexé et présenté lors d'un partage (FR15).
docs/planning-artifacts/epics.md-670-
docs/planning-artifacts/epics.md:671:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-672-
docs/planning-artifacts/epics.md-673-**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home, services, contact n'exposent que `title`+`description`)
docs/planning-artifacts/epics.md-674-**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/planning-artifacts/epics.md-675-**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/planning-artifacts/epics.md-676-**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact
docs/planning-artifacts/epics.md-677-
docs/planning-artifacts/epics.md-678-### Story 10.6: Conformité légale (RGPD + mentions légales)
docs/planning-artifacts/epics.md-679-
docs/planning-artifacts/epics.md:680:As a visiteur,
docs/planning-artifacts/epics.md-681-I want accéder à la politique de confidentialité et aux mentions légales,
docs/planning-artifacts/epics.md-682-So that je sais comment mes données (formulaire `/contact` → Web3Forms) sont traitées (FR16).
docs/planning-artifacts/epics.md-683-
docs/planning-artifacts/epics.md:684:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-685-
docs/planning-artifacts/epics.md-686-**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
docs/planning-artifacts/epics.md-687-**When** on publie une page « politique de confidentialité » (base légale, finalité, durée de conservation, sous-traitant Web3Forms, droits des personnes) + une page mentions légales, liées depuis le footer et/ou le formulaire
docs/planning-artifacts/epics.md-688-**Then** les deux pages existent, sont liées et rendues en prerender, en français/vouvoiement/sans emoji (NFR6) et stylées au DS
docs/planning-artifacts/epics.md-689-**And** gate verte ; contenu cadré avec le skill `rgpd-france`
docs/planning-artifacts/epics.md-690-
docs/planning-artifacts/epics.md-691-### Story 10.7: Mise en production réelle
docs/planning-artifacts/epics.md-692-
docs/planning-artifacts/epics.md:693:As a Simon (propriétaire du site),
docs/planning-artifacts/epics.md-694-I want merger la refonte sur `main` et la déployer en production sur `jouan.ovh`,
docs/planning-artifacts/epics.md:695:So that la refonte est enfin livrée aux visiteurs (FR17).
docs/planning-artifacts/epics.md-696-
docs/planning-artifacts/epics.md:697:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-698-
docs/planning-artifacts/epics.md-699-**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
docs/planning-artifacts/epics.md-700-**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
docs/planning-artifacts/epics.md:701:**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
docs/planning-artifacts/epics.md-702-**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
docs/planning-artifacts/epics.md-703-
docs/planning-artifacts/epics.md-704----
docs/planning-artifacts/epics.md-705-
docs/planning-artifacts/epics.md:706:## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
docs/planning-artifacts/epics.md-707-
docs/planning-artifacts/epics.md:708:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-709-
docs/planning-artifacts/epics.md:710:### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
docs/planning-artifacts/epics.md-711-
docs/planning-artifacts/epics.md:712:As a visiteur découvrant la page d'accueil,
docs/planning-artifacts/epics.md-713-I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
docs/planning-artifacts/epics.md:714:So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
docs/planning-artifacts/epics.md-715-
docs/planning-artifacts/epics.md:716:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-717-
docs/planning-artifacts/epics.md-718-**Given** le projet en production sur `main` et la nécessité de développer de manière isolée sans régresser la prod
docs/planning-artifacts/epics.md:719:**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
docs/planning-artifacts/epics.md-720-**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md:721:**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
docs/planning-artifacts/epics.md-722-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-723-
docs/planning-artifacts/epics.md:724:### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
docs/planning-artifacts/epics.md-725-
docs/planning-artifacts/epics.md-726-As a prospect technique ou client potentiel,
docs/planning-artifacts/epics.md-727-I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
docs/planning-artifacts/epics.md-728-So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).
docs/planning-artifacts/epics.md-729-
docs/planning-artifacts/epics.md:730:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-731-
docs/planning-artifacts/epics.md-732-**Given** la page d'accueil avec son atmosphère en place
docs/planning-artifacts/epics.md-733-**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
docs/planning-artifacts/epics.md-734-**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
docs/planning-artifacts/epics.md-735-**And** le Hero commercial affiche en typographie Ubuntu :
--
docs/planning-artifacts/epics.md-740-  - CTA primaire `<ZButton to="/contact">Discuter de votre projet</ZButton>` et CTA secondaire `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
docs/planning-artifacts/epics.md-741-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-742-
docs/planning-artifacts/epics.md-743-### Story 11.3: Marquee de stack moderne & Vitrine des 3 services ciblés
docs/planning-artifacts/epics.md-744-
docs/planning-artifacts/epics.md:745:As a visiteur explorant la page d'accueil,
docs/planning-artifacts/epics.md-746-I want observer le défilé continu de la stack moderne maîtrisée et découvrir les 3 cartes d'offres de services,
docs/planning-artifacts/epics.md-747-So that j'identifie clairement les compétences techniques et accède au détail des prestations sur la page dédiée `/services` (FR21, FR22, FR26, UX-DR21, UX-DR22).
docs/planning-artifacts/epics.md-748-
docs/planning-artifacts/epics.md:749:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-750-
docs/planning-artifacts/epics.md-751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
docs/planning-artifacts/epics.md-752-**When** on intègre le composant `StackMarquee` et la section des 3 services phares
docs/planning-artifacts/epics.md-753-**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md-754-**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
--
docs/planning-artifacts/epics.md-759-
docs/planning-artifacts/epics.md-760-As a prospect cherchant des garanties avant prise de contact,
docs/planning-artifacts/epics.md-761-I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
docs/planning-artifacts/epics.md-762-So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).
docs/planning-artifacts/epics.md-763-
docs/planning-artifacts/epics.md:764:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-765-
docs/planning-artifacts/epics.md-766-**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
docs/planning-artifacts/epics.md-767-**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
docs/planning-artifacts/epics.md-768-**Then** les projets affichent :
docs/planning-artifacts/epics.md-769-  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
--
docs/planning-artifacts/epics.md-774-**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
docs/planning-artifacts/epics.md-775-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-776-
docs/planning-artifacts/epics.md-777-### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker
docs/planning-artifacts/epics.md-778-
docs/planning-artifacts/epics.md:779:As a mainteneur du site et garant de la qualité logicielle,
docs/planning-artifacts/epics.md-780-I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
docs/planning-artifacts/epics.md-781-So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).
docs/planning-artifacts/epics.md-782-
docs/planning-artifacts/epics.md:783:**Acceptance Criteria:**
docs/planning-artifacts/epics.md-784-
docs/planning-artifacts/epics.md:785:**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
docs/planning-artifacts/epics.md-786-**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
docs/planning-artifacts/epics.md-787-**Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
docs/planning-artifacts/epics.md-788-**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)
docs/planning-artifacts/epics.md-789-

exec
/bin/zsh -lc "sed -n '1,190p' docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed
---

# Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur découvrant la page d'accueil,
I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
so that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).

## Acceptance Criteria

1. **Given** le projet en production sur `main` et la volonté de développer de manière totalement isolée sans impacter la prod
   **When** on initialise la branche de développement dédiée `feat/home-awwwards` issue de `develop` (NFR10)
   **Then** l'historique de `main` reste préservé et tout le travail de l'Epic 11 s'exécute sur cette branche isolée.

2. **Given** la source de vérité partagée du contenu `app/data/site.ts`
   **When** on met à jour les données du profil, des compétences et des projets
   **Then** `SITE.profile` affiche le rôle officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », la ville « Rouen, France », l'URL Malt `https://www.malt.fr/profile/simonjouan`, et le statut disponible
   **And** `SITE.skills` reflète la stack moderne ordonnée : `["typescript", "nuxt", "vue", "nest.js", "node.js", "postgresql", "typeorm", "stripe", "cypress", "docker", "rest-api", "vitest"]` sans dispersion WordPress/PHP en premier plan
   **And** `SITE.projects` intègre les 3 projets alignés avec Malt : **Keova** (statut production, lien live `https://keova.app`), **TryOn** (statut étude de cas MVP livré, sans lien mort `url: ""`), et **Nodium** (statut lab R&D en cours)
   **And** l'interface `IProject` supporte `status?: string` et `url?: string` de façon rétrocompatible (sans casser `programs/Projets.ts` ni `FooterComponent`).

3. **Given** le conteneur atmosphérique cinétique `.atmos`
   **When** le visiteur charge la page d'accueil
   **Then** 3 calques auroras floutés (aubergine, orange, rouge) s'animent de façon lente et fluide (26s à 32s) en pur CSS, superposés à une grille de points et une texture de scanlines CRT terminales
   **And** le conteneur est marqué `aria-hidden="true"`
   **And** sous `@media (prefers-reduced-motion: reduce)`, les keyframes d'animation sont strictement neutralisées (`animation: none`), les gradients restant figés de manière lisible.

4. **Given** un utilisateur sur ordinateur de bureau avec souris (`@media (hover: hover)`)
   **When** il survole la page d'accueil
   **Then** un micro-curseur interactif fluide (`.cursor-dot` + `.cursor-ring`) suit le pointeur et réagit (agrandissement / scaling) au survol des éléments interactifs marqués `data-hot` (boutons, liens, cartes)
   **And** le curseur personnalisé est totalement masqué sur les périphériques tactiles (`@media (hover: none)`) et sous reduced-motion
   **And** en cas d'erreur ou d'absence de JS, le curseur système natif du navigateur reste 100 % opérationnel et visible.

5. **Given** l'ensemble des ajouts de la story (branche, `site.ts`, composant atmosphérique, micro-curseur)
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur et 13 routes statiques pré-rendues.

## Tasks / Subtasks

- [x] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
  - [x] Vérifier l'état de l'arbre de travail (`git status`).
  - [x] S'assurer que la branche `develop` est à jour.
  - [x] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.

- [x] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
  - [x] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
  - [x] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
  - [x] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
  - [x] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).

- [x] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
  - [x] Créer `app/components/home/HomeAtmosComponent.vue`.
  - [x] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
  - [x] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
  - [x] Baliser le bloc avec `aria-hidden="true"`.
  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.

- [x] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
  - [x] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
  - [x] Nettoyer les listeners lors du `onUnmounted()`.

- [x] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
  - [x] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier que les 13 routes statiques sont générées sans avertissement.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--color-bg-base)`, `var(--color-aubergine-base)`, `var(--color-orange-base)`, `var(--color-text-default)`, etc.). [Source: AGENTS.md#Section 3]
- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `pointermove`) DOIT être encapsulé dans un bloc `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]

### Fichiers concernés & Analyse d'impact
- **`app/data/site.ts`** (UPDATE) : Source unique de vérité du profil et des projets.
  - *État actuel :* Contient `patio-conseil.fr` (WordPress) et un profil générique « Développeur web freelance ».
  - *Modifications :* Rôle mis à jour (« Développeur Full Stack TypeScript — Nuxt / NestJS »), ville « Rouen, France », stack moderne ciblée, et projets Keova (live), TryOn (étude de cas) et Nodium (lab).
  - *À préserver :* Rétrocompatibilité avec `app/components/terminal/programs/Projets.ts` qui boucle sur `SITE.projects`. Si `project.url` est vide, ne pas tenter d'ouvrir de lien ou conditionner l'action d'ouverture.
- **`app/components/terminal/programs/Projets.ts`** (UPDATE si nécessaire) : Adapter le programme terminal pour gérer les projets sans URL (ex. TryOn : afficher `(étude de cas)` au lieu d'ouvrir une URL vide).
- **`app/components/home/HomeAtmosComponent.vue`** (NEW) : Composant dédié aux calques auroras et scanlines.
- **`app/components/ui/ZCustomCursor.vue`** (NEW) : Composant du micro-curseur interactif progressif.
- **`app/pages/index.vue`** (UPDATE) : Intégration du composant atmosphérique et du curseur.

### Conformité Accessibilité (a11y)
- **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
- **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.

## Dev Agent Record

### Implementation Plan
1. **Isolation Git :** Création et bascule sur la branche `feat/home-awwwards` depuis `develop`.
2. **Données centralisées (`site.ts`) :**
   - Mise à jour de `IProject` (`status?: string`, `url?: string`) et `IProfile` (`maltUrl?: string`).
   - Rôle commercial unifié : « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », lien Malt.
   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
3. **Rétrocompatibilité :**
   - Sécurisation de `FooterComponent.vue` pour supporter les projets sans URL externe.
   - Sécurisation de `programs/Projets.ts` dans le terminal pour afficher `[status]` au lieu d'une URL vide.
4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
   - 3 auroras floutées (aubergine, orange, rouge) avec dérive lente fluide en CSS pur.
   - Grille de points et scanlines CRT en overlay.
   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
   - Suivi fluide (`dot` + `ring`) avec interpolation par `requestAnimationFrame`.
   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
6. **Intégration & Gate Docker :**
   - Intégration sur `app/pages/index.vue`.
   - Validation 100% verte : `pnpm lint`, `pnpm typecheck`, `pnpm generate` (13 routes pré-rendues).

### Completion Notes
- Branche `feat/home-awwwards` initialisée à partir de `develop` (`baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed`).
- Données `SITE` alignées rigoureusement sur le profil Malt et la direction stratégique.
- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
- Gate Docker 100% verte : 0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques générées avec succès par Nitro.

## File List

- `app/data/site.ts` (MODIFIED)
- `app/components/terminal/programs/Projets.ts` (MODIFIED)
- `app/components/FooterComponent.vue` (MODIFIED)
- `app/components/home/HomeAtmosComponent.vue` (NEW)
- `app/components/ui/ZCustomCursor.vue` (NEW)
- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)

## Change Log

- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).

### References
- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Direction stratégique : docs/direction_strategique_site.md]
- [Directives globales pour agents : AGENTS.md]

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index febe415..a583c55 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -7,7 +7,7 @@
             <ZIcon name="gem" class="ftr__logo" />
             <b>jouan.ovh</b>
           </NuxtLink>
-          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
+          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
         </div>
 
         <nav class="ftr__col" aria-label="Navigation du pied de page">
@@ -17,14 +17,12 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <ZExternalLink
-            v-for="project in projects"
-            :key="project.url"
-            :href="project.url"
-            rel="noopener noreferrer"
-            class="ftr__link"
-            >{{ project.name }}</ZExternalLink
-          >
+          <template v-for="project in projects" :key="project.name">
+            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
+              project.name
+            }}</ZExternalLink>
+            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
+          </template>
         </div>
 
         <div class="ftr__col">
@@ -55,6 +53,7 @@ const navItems = [
   { to: "/mentions-legales", label: "Mentions légales" },
 ];
 
+const profile = SITE.profile;
 // Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
 const projects = SITE.projects;
 
diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
new file mode 100644
index 0000000..b9f7223
--- /dev/null
+++ b/app/components/home/HomeAtmosComponent.vue
@@ -0,0 +1,124 @@
+<template>
+  <div class="atmos" aria-hidden="true">
+    <div class="aurora aurora--auberg" />
+    <div class="aurora aurora--orange" />
+    <div class="aurora aurora--red" />
+    <div class="grid-dots" />
+    <div class="scanlines" />
+    <div class="vignette" />
+  </div>
+</template>
+
+<script setup lang="ts">
+// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
+// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.atmos {
+  position: fixed;
+  inset: 0;
+  z-index: 0;
+  overflow: hidden;
+  pointer-events: none;
+}
+
+.aurora {
+  position: absolute;
+  border-radius: var(--radius-circle);
+  filter: blur(80px);
+  mix-blend-mode: screen;
+  will-change: transform;
+}
+
+.aurora--orange {
+  top: -22%;
+  left: 48%;
+  width: 60vw;
+  height: 60vw;
+  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
+  opacity: 0.55;
+  animation: drift-orange 26s var(--ease-in-out) infinite;
+}
+
+.aurora--auberg {
+  top: 6%;
+  left: -22%;
+  width: 64vw;
+  height: 64vw;
+  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
+  opacity: 0.7;
+  animation: drift-auberg 32s var(--ease-in-out) infinite;
+}
+
+.aurora--red {
+  top: 44%;
+  left: 26%;
+  width: 44vw;
+  height: 44vw;
+  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
+  opacity: 0.4;
+  animation: drift-red 30s var(--ease-in-out) infinite;
+}
+
+.grid-dots {
+  position: absolute;
+  inset: 0;
+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
+  background-size: 34px 34px;
+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
+}
+
+.scanlines {
+  position: absolute;
+  inset: 0;
+  opacity: 0.35;
+  background: repeating-linear-gradient(0deg, hsl(0deg 0% 0% / 18%) 0 1px, transparent 1px 3px);
+}
+
+.vignette {
+  position: absolute;
+  inset: 0;
+  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
+}
+
+@keyframes drift-orange {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(-6vw, 5vh) scale(1.12);
+  }
+}
+
+@keyframes drift-auberg {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(7vw, -4vh) scale(1.08);
+  }
+}
+
+@keyframes drift-red {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(-4vw, -6vh) scale(1.15);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .aurora {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/components/terminal/programs/Projets.ts b/app/components/terminal/programs/Projets.ts
index 9333808..46b4ff8 100644
--- a/app/components/terminal/programs/Projets.ts
+++ b/app/components/terminal/programs/Projets.ts
@@ -7,7 +7,12 @@ const projets: IProgram = {
   command: "projets",
   description: "Mes projets.",
   run: function (): string {
-    const items = SITE.projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");
+    const items = SITE.projects
+      .map((p) => {
+        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";
+        return `<li>${p.name} — ${p.role} — ${p.desc}${meta}</li>`;
+      })
+      .join("");
     return `<ul>${items}</ul>`;
   },
 };
diff --git a/app/components/ui/ZCustomCursor.vue b/app/components/ui/ZCustomCursor.vue
new file mode 100644
index 0000000..c43f680
--- /dev/null
+++ b/app/components/ui/ZCustomCursor.vue
@@ -0,0 +1,142 @@
+<template>
+  <div v-if="isEnabled" aria-hidden="true">
+    <div
+      class="cursor-ring"
+      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
+    />
+    <div
+      class="cursor-dot"
+      :class="{ 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
+    />
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
+// Purement décoratif (aria-hidden="true").
+// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
+// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.
+
+const isEnabled = ref(false);
+const isVisible = ref(false);
+const isHot = ref(false);
+
+const dotX = ref(0);
+const dotY = ref(0);
+const ringX = ref(0);
+const ringY = ref(0);
+
+let mouseX = 0;
+let mouseY = 0;
+let currentRingX = 0;
+let currentRingY = 0;
+let rafId: number | null = null;
+
+function updateAnimationLoop() {
+  currentRingX += (mouseX - currentRingX) * 0.18;
+  currentRingY += (mouseY - currentRingY) * 0.18;
+  ringX.value = currentRingX;
+  ringY.value = currentRingY;
+  rafId = requestAnimationFrame(updateAnimationLoop);
+}
+
+function handlePointerMove(e: PointerEvent) {
+  if (!isVisible.value) {
+    isVisible.value = true;
+    currentRingX = e.clientX;
+    currentRingY = e.clientY;
+    ringX.value = e.clientX;
+    ringY.value = e.clientY;
+  }
+  mouseX = e.clientX;
+  mouseY = e.clientY;
+  dotX.value = e.clientX;
+  dotY.value = e.clientY;
+}
+
+function handlePointerOver(e: Event) {
+  const target = e.target as HTMLElement | null;
+  if (!target) return;
+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");

exec
/bin/zsh -lc "sed -n '1,282p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "sed -n '1,100p' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  isHot.value = Boolean(isInteractive);
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const hasHover = window.matchMedia("(hover: hover)").matches;
+  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (!hasHover || prefersReducedMotion) {
+    return;
+  }
+
+  isEnabled.value = true;
+  window.addEventListener("pointermove", handlePointerMove, { passive: true });
+  document.addEventListener("pointerover", handlePointerOver, { passive: true });
+  rafId = requestAnimationFrame(updateAnimationLoop);
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("pointermove", handlePointerMove);
+  document.removeEventListener("pointerover", handlePointerOver);
+  if (rafId !== null) {
+    cancelAnimationFrame(rafId);
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.cursor-dot,
+.cursor-ring {
+  position: fixed;
+  top: 0;
+  left: 0;
+  z-index: 90;
+  border-radius: var(--radius-circle);
+  mix-blend-mode: difference;
+  opacity: 0;
+  pointer-events: none;
+  transition: opacity var(--dur-base) var(--ease-standard);
+
+  &.is-visible {
+    opacity: 1;
+  }
+}
+
+.cursor-dot {
+  width: 6px;
+  height: 6px;
+  background: var(--ink-1);
+}
+
+.cursor-ring {
+  width: 34px;
+  height: 34px;
+  border: 1px solid hsl(0deg 0% 100% / 70%);
+  transition:
+    width var(--dur-base) var(--ease-out),
+    height var(--dur-base) var(--ease-out),
+    border-color var(--dur-base) var(--ease-out),
+    opacity var(--dur-base) var(--ease-standard);
+
+  &.is-hot {
+    width: 56px;
+    height: 56px;
+    border-color: var(--accent);
+  }
+}
+
+@media (hover: none), (prefers-reduced-motion: reduce) {
+  .cursor-dot,
+  .cursor-ring {
+    display: none;
+  }
+}
+</style>
diff --git a/app/data/site.ts b/app/data/site.ts
index 81fd41d..d87e1d2 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -16,54 +16,65 @@ export interface IProfile {
   email: string;
   city: string;
   available: boolean;
+  maltUrl?: string;
 }
 
 export interface IProject {
   name: string;
   role: string;
   desc: string;
-  url: string;
+  url?: string;
+  status?: string;
   tags: string[];
 }
 
 const profile: IProfile = {
   name: "Simon Jouan",
-  role: "Développeur web freelance",
+  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
   email: "simon@jouan.ovh",
-  city: "Valognes, France",
+  city: "Rouen, France",
   available: true,
+  maltUrl: "https://www.malt.fr/profile/simonjouan",
 };
 
-// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
+// Stack technique moderne prioritaire ordonnée.
 const skills: string[] = [
-  "php",
-  "symfony",
-  "wordpress",
-  "node.js",
-  "nest.js",
-  "nuxt.js",
-  "vue",
   "typescript",
+  "nuxt",
+  "vue",
+  "nest.js",
+  "node.js",
+  "postgresql",
+  "typeorm",
+  "stripe",
+  "cypress",
   "docker",
-  "tailwind",
-  "n8n",
-  "mysql",
+  "rest-api",
+  "vitest",
 ];
 
 const projects: IProject[] = [
   {
     name: "keova.app",
-    role: "Fondateur · SaaS",
-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
+    role: "Co-fondateur & Développeur Full Stack",
+    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
     url: "https://keova.app",
-    tags: ["nest.js", "nuxt", "saas"],
+    status: "En production",
+    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
+  },
+  {
+    name: "TryOn",
+    role: "CTO & Développeur Full Stack",
+    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
+    status: "Étude de cas (MVP livré)",
+    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
   },
   {
-    name: "patio-conseil.fr",
-    role: "Client",
-    desc: "Site et outils pour un cabinet de conseil.",
-    url: "https://patio-conseil.fr",
-    tags: ["wordpress", "conseil"],
+    name: "Nodium",
+    role: "Créateur & Ingénieur IA",
+    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
+    status: "R&D / En cours",
+    tags: ["typescript", "electron", "agents", "ia"],
   },
 ];
 
diff --git a/app/pages/index.vue b/app/pages/index.vue
index cb89e65..fbd4f5c 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -1,5 +1,8 @@
 <template>
   <main class="home">
+    <HomeAtmosComponent />
+    <ZCustomCursor />
+
     <section class="hero hero__grad">
       <div class="hero__in container">
         <div class="hero__grid">
@@ -98,8 +101,14 @@
 
         <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
         <ul class="grid-2 projects">
-          <li v-for="project in projects" :key="project.url">
-            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
+          <li v-for="project in projects" :key="project.name">
+            <ZCard
+              class="project"
+              interactive
+              :as="project.url ? ZExternalLink : 'div'"
+              :href="project.url || undefined"
+              :rel="project.url ? 'noopener noreferrer' : undefined"
+            >
               <div class="project__head">
                 <h3 class="project__name">{{ project.name }}</h3>
                 <span class="project__role">{{ project.role }}</span>
diff --git a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
index 44ad82b..38abf8d 100644
--- a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
+++ b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
@@ -1,6 +1,10 @@
+---
+baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed
+---
+
 # Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -41,36 +45,36 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
-  - [ ] Vérifier l'état de l'arbre de travail (`git status`).
-  - [ ] S'assurer que la branche `develop` est à jour.
-  - [ ] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
-
-- [ ] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
-  - [ ] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
-  - [ ] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
-  - [ ] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
-  - [ ] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
-  - [ ] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
-
-- [ ] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
-  - [ ] Créer `app/components/home/HomeAtmosComponent.vue`.
-  - [ ] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
-  - [ ] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
-  - [ ] Baliser le bloc avec `aria-hidden="true"`.
-  - [ ] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
-
-- [ ] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
-  - [ ] Créer `app/components/ui/ZCustomCursor.vue`.
-  - [ ] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
-  - [ ] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
-  - [ ] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
-  - [ ] Nettoyer les listeners lors du `onUnmounted()`.
-
-- [ ] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
-  - [ ] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
-  - [ ] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] Vérifier que les 13 routes statiques sont générées sans avertissement.
+- [x] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
+  - [x] Vérifier l'état de l'arbre de travail (`git status`).
+  - [x] S'assurer que la branche `develop` est à jour.
+  - [x] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
+
+- [x] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
+  - [x] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
+  - [x] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
+  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
+  - [x] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
+  - [x] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
+
+- [x] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
+  - [x] Créer `app/components/home/HomeAtmosComponent.vue`.
+  - [x] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
+  - [x] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
+  - [x] Baliser le bloc avec `aria-hidden="true"`.
+  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
+
+- [x] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
+  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
+  - [x] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
+  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
+  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
+  - [x] Nettoyer les listeners lors du `onUnmounted()`.
+
+- [x] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
+  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
+  - [x] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier que les 13 routes statiques sont générées sans avertissement.
 
 ## Dev Notes
 
@@ -93,6 +97,51 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
 - **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
 - **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.
 
+## Dev Agent Record
+
+### Implementation Plan
+1. **Isolation Git :** Création et bascule sur la branche `feat/home-awwwards` depuis `develop`.
+2. **Données centralisées (`site.ts`) :**
+   - Mise à jour de `IProject` (`status?: string`, `url?: string`) et `IProfile` (`maltUrl?: string`).
+   - Rôle commercial unifié : « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », lien Malt.
+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
+   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
+3. **Rétrocompatibilité :**
+   - Sécurisation de `FooterComponent.vue` pour supporter les projets sans URL externe.
+   - Sécurisation de `programs/Projets.ts` dans le terminal pour afficher `[status]` au lieu d'une URL vide.
+4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
+   - 3 auroras floutées (aubergine, orange, rouge) avec dérive lente fluide en CSS pur.
+   - Grille de points et scanlines CRT en overlay.
+   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
+5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
+   - Suivi fluide (`dot` + `ring`) avec interpolation par `requestAnimationFrame`.
+   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
+   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
+6. **Intégration & Gate Docker :**
+   - Intégration sur `app/pages/index.vue`.
+   - Validation 100% verte : `pnpm lint`, `pnpm typecheck`, `pnpm generate` (13 routes pré-rendues).
+
+### Completion Notes
+- Branche `feat/home-awwwards` initialisée à partir de `develop` (`baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed`).
+- Données `SITE` alignées rigoureusement sur le profil Malt et la direction stratégique.
+- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
+- Gate Docker 100% verte : 0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques générées avec succès par Nitro.
+
+## File List
+
+- `app/data/site.ts` (MODIFIED)
+- `app/components/terminal/programs/Projets.ts` (MODIFIED)
+- `app/components/FooterComponent.vue` (MODIFIED)
+- `app/components/home/HomeAtmosComponent.vue` (NEW)
+- `app/components/ui/ZCustomCursor.vue` (NEW)
+- `app/pages/index.vue` (MODIFIED)
+- `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+
+## Change Log
+
+- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).
+
 ### References
 - [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
 - [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 5d9dab6..b28e1fb 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.1 ready-for-dev : Préparation de branche, site.ts & Atmosphère)"
+last_updated: "2026-09-13 (Story 11.1 review : Préparation de branche, site.ts & Atmosphère)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -119,7 +119,7 @@ development_status:
 
   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   epic-11: in-progress
-  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: ready-for-dev
+  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: review
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog

exec
/bin/zsh -lc "sed -n '706,724p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

codex
Le périmètre est identifié : le diff contient les fichiers de données, les deux nouveaux composants, l’intégration home et des adaptations de consommateurs. Je vérifie maintenant chaque AC sur le code réel, notamment les détails SSR/a11y et les contrats de données.
exec
/bin/zsh -lc "rg -n '"'^diff --git|''^@@|''^'"\\+["'^+]|''^-[-+]'"' docs/implementation-artifacts/code-reviews/11-1/full.diff | sed -n '1,240p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
3:--- a/app/components/FooterComponent.vue
5:@@ -7,7 +7,7 @@
10:+          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
14:@@ -17,14 +17,12 @@
26:+          <template v-for="project in projects" :key="project.name">
27:+            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
28:+              project.name
29:+            }}</ZExternalLink>
30:+            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
31:+          </template>
35:@@ -55,6 +53,7 @@ const navItems = [
39:+const profile = SITE.profile;
43:diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
46:--- /dev/null
48:@@ -0,0 +1,124 @@
49:+<template>
50:+  <div class="atmos" aria-hidden="true">
51:+    <div class="aurora aurora--auberg" />
52:+    <div class="aurora aurora--orange" />
53:+    <div class="aurora aurora--red" />
54:+    <div class="grid-dots" />
55:+    <div class="scanlines" />
56:+    <div class="vignette" />
57:+  </div>
58:+</template>
60:+<script setup lang="ts">
61:+// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
62:+// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
63:+</script>
65:+<style lang="scss" scoped>
66:+/* stylelint-disable selector-class-pattern */
67:+.atmos {
68:+  position: fixed;
69:+  inset: 0;
70:+  z-index: 0;
71:+  overflow: hidden;
72:+  pointer-events: none;
73:+}
75:+.aurora {
76:+  position: absolute;
77:+  border-radius: var(--radius-circle);
78:+  filter: blur(80px);
79:+  mix-blend-mode: screen;
80:+  will-change: transform;
81:+}
83:+.aurora--orange {
84:+  top: -22%;
85:+  left: 48%;
86:+  width: 60vw;
87:+  height: 60vw;
88:+  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
89:+  opacity: 0.55;
90:+  animation: drift-orange 26s var(--ease-in-out) infinite;
91:+}
93:+.aurora--auberg {
94:+  top: 6%;
95:+  left: -22%;
96:+  width: 64vw;
97:+  height: 64vw;
98:+  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
99:+  opacity: 0.7;
100:+  animation: drift-auberg 32s var(--ease-in-out) infinite;
101:+}
103:+.aurora--red {
104:+  top: 44%;
105:+  left: 26%;
106:+  width: 44vw;
107:+  height: 44vw;
108:+  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
109:+  opacity: 0.4;
110:+  animation: drift-red 30s var(--ease-in-out) infinite;
111:+}
113:+.grid-dots {
114:+  position: absolute;
115:+  inset: 0;
116:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
117:+  background-size: 34px 34px;
118:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
119:+}
121:+.scanlines {
122:+  position: absolute;
123:+  inset: 0;
124:+  opacity: 0.35;
125:+  background: repeating-linear-gradient(0deg, hsl(0deg 0% 0% / 18%) 0 1px, transparent 1px 3px);
126:+}
128:+.vignette {
129:+  position: absolute;
130:+  inset: 0;
131:+  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
132:+}
134:+@keyframes drift-orange {
135:+  0%,
136:+  100% {
137:+    transform: translate(0, 0) scale(1);
138:+  }
140:+  50% {
141:+    transform: translate(-6vw, 5vh) scale(1.12);
142:+  }
143:+}
145:+@keyframes drift-auberg {
146:+  0%,
147:+  100% {
148:+    transform: translate(0, 0) scale(1);
149:+  }
151:+  50% {
152:+    transform: translate(7vw, -4vh) scale(1.08);
153:+  }
154:+}
156:+@keyframes drift-red {
157:+  0%,
158:+  100% {
159:+    transform: translate(0, 0) scale(1);
160:+  }
162:+  50% {
163:+    transform: translate(-4vw, -6vh) scale(1.15);
164:+  }
165:+}
167:+@media (prefers-reduced-motion: reduce) {
168:+  .aurora {
169:+    animation: none;
170:+  }
171:+}
172:+</style>
173:diff --git a/app/components/terminal/programs/Projets.ts b/app/components/terminal/programs/Projets.ts
175:--- a/app/components/terminal/programs/Projets.ts
177:@@ -7,7 +7,12 @@ const projets: IProgram = {
182:+    const items = SITE.projects
183:+      .map((p) => {
184:+        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";
185:+        return `<li>${p.name} — ${p.role} — ${p.desc}${meta}</li>`;
186:+      })
187:+      .join("");
191:diff --git a/app/components/ui/ZCustomCursor.vue b/app/components/ui/ZCustomCursor.vue
194:--- /dev/null
196:@@ -0,0 +1,142 @@
197:+<template>
198:+  <div v-if="isEnabled" aria-hidden="true">
199:+    <div
200:+      class="cursor-ring"
201:+      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
202:+      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
203:+    />
204:+    <div
205:+      class="cursor-dot"
206:+      :class="{ 'is-visible': isVisible }"
207:+      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
208:+    />
209:+  </div>
210:+</template>
212:+<script setup lang="ts">
213:+import { ref, onMounted, onUnmounted } from "vue";
215:+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
216:+// Purement décoratif (aria-hidden="true").
217:+// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
218:+// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.
220:+const isEnabled = ref(false);
221:+const isVisible = ref(false);
222:+const isHot = ref(false);
224:+const dotX = ref(0);
225:+const dotY = ref(0);
226:+const ringX = ref(0);
227:+const ringY = ref(0);
229:+let mouseX = 0;
230:+let mouseY = 0;
231:+let currentRingX = 0;
232:+let currentRingY = 0;
233:+let rafId: number | null = null;
235:+function updateAnimationLoop() {
236:+  currentRingX += (mouseX - currentRingX) * 0.18;
237:+  currentRingY += (mouseY - currentRingY) * 0.18;
238:+  ringX.value = currentRingX;
239:+  ringY.value = currentRingY;
240:+  rafId = requestAnimationFrame(updateAnimationLoop);
241:+}
243:+function handlePointerMove(e: PointerEvent) {
244:+  if (!isVisible.value) {
245:+    isVisible.value = true;
246:+    currentRingX = e.clientX;
247:+    currentRingY = e.clientY;
248:+    ringX.value = e.clientX;
249:+    ringY.value = e.clientY;
250:+  }
251:+  mouseX = e.clientX;
252:+  mouseY = e.clientY;
253:+  dotX.value = e.clientX;
254:+  dotY.value = e.clientY;
255:+}
257:+function handlePointerOver(e: Event) {
258:+  const target = e.target as HTMLElement | null;
259:+  if (!target) return;
260:+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
261:+  isHot.value = Boolean(isInteractive);
262:+}
264:+onMounted(() => {
265:+  if (!import.meta.client) return;
267:+  const hasHover = window.matchMedia("(hover: hover)").matches;
268:+  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
270:+  if (!hasHover || prefersReducedMotion) {
271:+    return;
272:+  }
274:+  isEnabled.value = true;
275:+  window.addEventListener("pointermove", handlePointerMove, { passive: true });
276:+  document.addEventListener("pointerover", handlePointerOver, { passive: true });
277:+  rafId = requestAnimationFrame(updateAnimationLoop);
278:+});
280:+onUnmounted(() => {
281:+  if (!import.meta.client) return;
282:+  window.removeEventListener("pointermove", handlePointerMove);
283:+  document.removeEventListener("pointerover", handlePointerOver);
284:+  if (rafId !== null) {
285:+    cancelAnimationFrame(rafId);
286:+  }
287:+});
288:+</script>
290:+<style lang="scss" scoped>
291:+/* stylelint-disable selector-class-pattern */
292:+.cursor-dot,
293:+.cursor-ring {
294:+  position: fixed;
295:+  top: 0;
296:+  left: 0;
297:+  z-index: 90;
298:+  border-radius: var(--radius-circle);
299:+  mix-blend-mode: difference;
300:+  opacity: 0;
301:+  pointer-events: none;
302:+  transition: opacity var(--dur-base) var(--ease-standard);
304:+  &.is-visible {
305:+    opacity: 1;
306:+  }
307:+}
309:+.cursor-dot {
310:+  width: 6px;
311:+  height: 6px;
312:+  background: var(--ink-1);
313:+}
315:+.cursor-ring {
316:+  width: 34px;
317:+  height: 34px;

exec
/bin/zsh -lc "sed -n '1,180p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index febe415..a583c55 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -7,7 +7,7 @@
             <ZIcon name="gem" class="ftr__logo" />
             <b>jouan.ovh</b>
           </NuxtLink>
-          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
+          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
         </div>
 
         <nav class="ftr__col" aria-label="Navigation du pied de page">
@@ -17,14 +17,12 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <ZExternalLink
-            v-for="project in projects"
-            :key="project.url"
-            :href="project.url"
-            rel="noopener noreferrer"
-            class="ftr__link"
-            >{{ project.name }}</ZExternalLink
-          >
+          <template v-for="project in projects" :key="project.name">
+            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
+              project.name
+            }}</ZExternalLink>
+            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
+          </template>
         </div>
 
         <div class="ftr__col">
@@ -55,6 +53,7 @@ const navItems = [
   { to: "/mentions-legales", label: "Mentions légales" },
 ];
 
+const profile = SITE.profile;
 // Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
 const projects = SITE.projects;
 
diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
new file mode 100644
index 0000000..b9f7223
--- /dev/null
+++ b/app/components/home/HomeAtmosComponent.vue
@@ -0,0 +1,124 @@
+<template>
+  <div class="atmos" aria-hidden="true">
+    <div class="aurora aurora--auberg" />
+    <div class="aurora aurora--orange" />
+    <div class="aurora aurora--red" />
+    <div class="grid-dots" />
+    <div class="scanlines" />
+    <div class="vignette" />
+  </div>
+</template>
+
+<script setup lang="ts">
+// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
+// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.atmos {
+  position: fixed;
+  inset: 0;
+  z-index: 0;
+  overflow: hidden;
+  pointer-events: none;
+}
+
+.aurora {
+  position: absolute;
+  border-radius: var(--radius-circle);
+  filter: blur(80px);
+  mix-blend-mode: screen;
+  will-change: transform;
+}
+
+.aurora--orange {
+  top: -22%;
+  left: 48%;
+  width: 60vw;
+  height: 60vw;
+  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
+  opacity: 0.55;
+  animation: drift-orange 26s var(--ease-in-out) infinite;
+}
+
+.aurora--auberg {
+  top: 6%;
+  left: -22%;
+  width: 64vw;
+  height: 64vw;
+  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
+  opacity: 0.7;
+  animation: drift-auberg 32s var(--ease-in-out) infinite;
+}
+
+.aurora--red {
+  top: 44%;
+  left: 26%;
+  width: 44vw;
+  height: 44vw;
+  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
+  opacity: 0.4;
+  animation: drift-red 30s var(--ease-in-out) infinite;
+}
+
+.grid-dots {
+  position: absolute;
+  inset: 0;
+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
+  background-size: 34px 34px;
+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
+}
+
+.scanlines {
+  position: absolute;
+  inset: 0;
+  opacity: 0.35;
+  background: repeating-linear-gradient(0deg, hsl(0deg 0% 0% / 18%) 0 1px, transparent 1px 3px);
+}
+
+.vignette {
+  position: absolute;
+  inset: 0;
+  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
+}
+
+@keyframes drift-orange {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(-6vw, 5vh) scale(1.12);
+  }
+}
+
+@keyframes drift-auberg {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(7vw, -4vh) scale(1.08);
+  }
+}
+
+@keyframes drift-red {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(-4vw, -6vh) scale(1.15);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .aurora {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/components/terminal/programs/Projets.ts b/app/components/terminal/programs/Projets.ts
index 9333808..46b4ff8 100644
--- a/app/components/terminal/programs/Projets.ts
+++ b/app/components/terminal/programs/Projets.ts
@@ -7,7 +7,12 @@ const projets: IProgram = {
   command: "projets",
   description: "Mes projets.",
   run: function (): string {

exec
/bin/zsh -lc "sed -n '181,380p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
-    const items = SITE.projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");
+    const items = SITE.projects
+      .map((p) => {
+        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";
+        return `<li>${p.name} — ${p.role} — ${p.desc}${meta}</li>`;
+      })
+      .join("");
     return `<ul>${items}</ul>`;
   },
 };
diff --git a/app/components/ui/ZCustomCursor.vue b/app/components/ui/ZCustomCursor.vue
new file mode 100644
index 0000000..c43f680
--- /dev/null
+++ b/app/components/ui/ZCustomCursor.vue
@@ -0,0 +1,142 @@
+<template>
+  <div v-if="isEnabled" aria-hidden="true">
+    <div
+      class="cursor-ring"
+      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
+    />
+    <div
+      class="cursor-dot"
+      :class="{ 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
+    />
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
+// Purement décoratif (aria-hidden="true").
+// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
+// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.
+
+const isEnabled = ref(false);
+const isVisible = ref(false);
+const isHot = ref(false);
+
+const dotX = ref(0);
+const dotY = ref(0);
+const ringX = ref(0);
+const ringY = ref(0);
+
+let mouseX = 0;
+let mouseY = 0;
+let currentRingX = 0;
+let currentRingY = 0;
+let rafId: number | null = null;
+
+function updateAnimationLoop() {
+  currentRingX += (mouseX - currentRingX) * 0.18;
+  currentRingY += (mouseY - currentRingY) * 0.18;
+  ringX.value = currentRingX;
+  ringY.value = currentRingY;
+  rafId = requestAnimationFrame(updateAnimationLoop);
+}
+
+function handlePointerMove(e: PointerEvent) {
+  if (!isVisible.value) {
+    isVisible.value = true;
+    currentRingX = e.clientX;
+    currentRingY = e.clientY;
+    ringX.value = e.clientX;
+    ringY.value = e.clientY;
+  }
+  mouseX = e.clientX;
+  mouseY = e.clientY;
+  dotX.value = e.clientX;
+  dotY.value = e.clientY;
+}
+
+function handlePointerOver(e: Event) {
+  const target = e.target as HTMLElement | null;
+  if (!target) return;
+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
+  isHot.value = Boolean(isInteractive);
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const hasHover = window.matchMedia("(hover: hover)").matches;
+  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (!hasHover || prefersReducedMotion) {
+    return;
+  }
+
+  isEnabled.value = true;
+  window.addEventListener("pointermove", handlePointerMove, { passive: true });
+  document.addEventListener("pointerover", handlePointerOver, { passive: true });
+  rafId = requestAnimationFrame(updateAnimationLoop);
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("pointermove", handlePointerMove);
+  document.removeEventListener("pointerover", handlePointerOver);
+  if (rafId !== null) {
+    cancelAnimationFrame(rafId);
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.cursor-dot,
+.cursor-ring {
+  position: fixed;
+  top: 0;
+  left: 0;
+  z-index: 90;
+  border-radius: var(--radius-circle);
+  mix-blend-mode: difference;
+  opacity: 0;
+  pointer-events: none;
+  transition: opacity var(--dur-base) var(--ease-standard);
+
+  &.is-visible {
+    opacity: 1;
+  }
+}
+
+.cursor-dot {
+  width: 6px;
+  height: 6px;
+  background: var(--ink-1);
+}
+
+.cursor-ring {
+  width: 34px;
+  height: 34px;
+  border: 1px solid hsl(0deg 0% 100% / 70%);
+  transition:
+    width var(--dur-base) var(--ease-out),
+    height var(--dur-base) var(--ease-out),
+    border-color var(--dur-base) var(--ease-out),
+    opacity var(--dur-base) var(--ease-standard);
+
+  &.is-hot {
+    width: 56px;
+    height: 56px;
+    border-color: var(--accent);
+  }
+}
+
+@media (hover: none), (prefers-reduced-motion: reduce) {
+  .cursor-dot,
+  .cursor-ring {
+    display: none;
+  }
+}
+</style>
diff --git a/app/data/site.ts b/app/data/site.ts
index 81fd41d..d87e1d2 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -16,54 +16,65 @@ export interface IProfile {
   email: string;
   city: string;
   available: boolean;
+  maltUrl?: string;
 }
 
 export interface IProject {
   name: string;
   role: string;
   desc: string;
-  url: string;
+  url?: string;
+  status?: string;
   tags: string[];
 }
 
 const profile: IProfile = {
   name: "Simon Jouan",
-  role: "Développeur web freelance",
+  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
   email: "simon@jouan.ovh",
-  city: "Valognes, France",
+  city: "Rouen, France",
   available: true,
+  maltUrl: "https://www.malt.fr/profile/simonjouan",
 };
 
-// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
+// Stack technique moderne prioritaire ordonnée.
 const skills: string[] = [
-  "php",
-  "symfony",
-  "wordpress",
-  "node.js",
-  "nest.js",
-  "nuxt.js",
-  "vue",

exec
/bin/zsh -lc "sed -n '381,617p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   "typescript",
+  "nuxt",
+  "vue",
+  "nest.js",
+  "node.js",
+  "postgresql",
+  "typeorm",
+  "stripe",
+  "cypress",
   "docker",
-  "tailwind",
-  "n8n",
-  "mysql",
+  "rest-api",
+  "vitest",
 ];
 
 const projects: IProject[] = [
   {
     name: "keova.app",
-    role: "Fondateur · SaaS",
-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
+    role: "Co-fondateur & Développeur Full Stack",
+    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
     url: "https://keova.app",
-    tags: ["nest.js", "nuxt", "saas"],
+    status: "En production",
+    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
+  },
+  {
+    name: "TryOn",
+    role: "CTO & Développeur Full Stack",
+    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
+    status: "Étude de cas (MVP livré)",
+    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
   },
   {
-    name: "patio-conseil.fr",
-    role: "Client",
-    desc: "Site et outils pour un cabinet de conseil.",
-    url: "https://patio-conseil.fr",
-    tags: ["wordpress", "conseil"],
+    name: "Nodium",
+    role: "Créateur & Ingénieur IA",
+    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
+    status: "R&D / En cours",
+    tags: ["typescript", "electron", "agents", "ia"],
   },
 ];
 
diff --git a/app/pages/index.vue b/app/pages/index.vue
index cb89e65..fbd4f5c 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -1,5 +1,8 @@
 <template>
   <main class="home">
+    <HomeAtmosComponent />
+    <ZCustomCursor />
+
     <section class="hero hero__grad">
       <div class="hero__in container">
         <div class="hero__grid">
@@ -98,8 +101,14 @@
 
         <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
         <ul class="grid-2 projects">
-          <li v-for="project in projects" :key="project.url">
-            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
+          <li v-for="project in projects" :key="project.name">
+            <ZCard
+              class="project"
+              interactive
+              :as="project.url ? ZExternalLink : 'div'"
+              :href="project.url || undefined"
+              :rel="project.url ? 'noopener noreferrer' : undefined"
+            >
               <div class="project__head">
                 <h3 class="project__name">{{ project.name }}</h3>
                 <span class="project__role">{{ project.role }}</span>
diff --git a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
index 44ad82b..38abf8d 100644
--- a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
+++ b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
@@ -1,6 +1,10 @@
+---
+baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed
+---
+
 # Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -41,36 +45,36 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
-  - [ ] Vérifier l'état de l'arbre de travail (`git status`).
-  - [ ] S'assurer que la branche `develop` est à jour.
-  - [ ] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
-
-- [ ] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
-  - [ ] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
-  - [ ] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
-  - [ ] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
-  - [ ] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
-  - [ ] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
-
-- [ ] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
-  - [ ] Créer `app/components/home/HomeAtmosComponent.vue`.
-  - [ ] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
-  - [ ] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
-  - [ ] Baliser le bloc avec `aria-hidden="true"`.
-  - [ ] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
-
-- [ ] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
-  - [ ] Créer `app/components/ui/ZCustomCursor.vue`.
-  - [ ] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
-  - [ ] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
-  - [ ] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
-  - [ ] Nettoyer les listeners lors du `onUnmounted()`.
-
-- [ ] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
-  - [ ] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
-  - [ ] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] Vérifier que les 13 routes statiques sont générées sans avertissement.
+- [x] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
+  - [x] Vérifier l'état de l'arbre de travail (`git status`).
+  - [x] S'assurer que la branche `develop` est à jour.
+  - [x] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
+
+- [x] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
+  - [x] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
+  - [x] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
+  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
+  - [x] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
+  - [x] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
+
+- [x] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
+  - [x] Créer `app/components/home/HomeAtmosComponent.vue`.
+  - [x] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
+  - [x] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
+  - [x] Baliser le bloc avec `aria-hidden="true"`.
+  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
+
+- [x] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
+  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
+  - [x] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
+  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
+  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
+  - [x] Nettoyer les listeners lors du `onUnmounted()`.
+
+- [x] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
+  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
+  - [x] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier que les 13 routes statiques sont générées sans avertissement.
 
 ## Dev Notes
 
@@ -93,6 +97,51 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
 - **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
 - **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.
 
+## Dev Agent Record
+
+### Implementation Plan
+1. **Isolation Git :** Création et bascule sur la branche `feat/home-awwwards` depuis `develop`.
+2. **Données centralisées (`site.ts`) :**
+   - Mise à jour de `IProject` (`status?: string`, `url?: string`) et `IProfile` (`maltUrl?: string`).
+   - Rôle commercial unifié : « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », lien Malt.
+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
+   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
+3. **Rétrocompatibilité :**
+   - Sécurisation de `FooterComponent.vue` pour supporter les projets sans URL externe.
+   - Sécurisation de `programs/Projets.ts` dans le terminal pour afficher `[status]` au lieu d'une URL vide.
+4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
+   - 3 auroras floutées (aubergine, orange, rouge) avec dérive lente fluide en CSS pur.
+   - Grille de points et scanlines CRT en overlay.
+   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
+5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
+   - Suivi fluide (`dot` + `ring`) avec interpolation par `requestAnimationFrame`.
+   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
+   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
+6. **Intégration & Gate Docker :**
+   - Intégration sur `app/pages/index.vue`.
+   - Validation 100% verte : `pnpm lint`, `pnpm typecheck`, `pnpm generate` (13 routes pré-rendues).
+
+### Completion Notes
+- Branche `feat/home-awwwards` initialisée à partir de `develop` (`baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed`).
+- Données `SITE` alignées rigoureusement sur le profil Malt et la direction stratégique.
+- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
+- Gate Docker 100% verte : 0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques générées avec succès par Nitro.
+
+## File List
+
+- `app/data/site.ts` (MODIFIED)
+- `app/components/terminal/programs/Projets.ts` (MODIFIED)
+- `app/components/FooterComponent.vue` (MODIFIED)
+- `app/components/home/HomeAtmosComponent.vue` (NEW)
+- `app/components/ui/ZCustomCursor.vue` (NEW)
+- `app/pages/index.vue` (MODIFIED)
+- `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+
+## Change Log
+
+- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).
+
 ### References
 - [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
 - [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 5d9dab6..b28e1fb 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.1 ready-for-dev : Préparation de branche, site.ts & Atmosphère)"
+last_updated: "2026-09-13 (Story 11.1 review : Préparation de branche, site.ts & Atmosphère)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -119,7 +119,7 @@ development_status:
 
   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   epic-11: in-progress
-  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: ready-for-dev
+  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: review
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog

exec
/bin/zsh -lc 'git diff --stat 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed && git diff --numstat 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 app/components/FooterComponent.vue                 |  17 ++-
 app/components/home/HomeAtmosComponent.vue         | 124 ++++++++++++++++++
 app/components/terminal/programs/Projets.ts        |   7 +-
 app/components/ui/ZCustomCursor.vue                | 142 +++++++++++++++++++++
 app/data/site.ts                                   |  55 ++++----
 app/pages/index.vue                                |  13 +-
 ...r-des-donnees-sitets-et-atmosphere-cinetique.md | 111 +++++++++++-----
 docs/implementation-artifacts/sprint-status.yaml   |   4 +-
 8 files changed, 406 insertions(+), 67 deletions(-)
8	9	app/components/FooterComponent.vue
124	0	app/components/home/HomeAtmosComponent.vue
6	1	app/components/terminal/programs/Projets.ts
142	0	app/components/ui/ZCustomCursor.vue
33	22	app/data/site.ts
11	2	app/pages/index.vue
80	31	docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
2	2	docs/implementation-artifacts/sprint-status.yaml

exec
/bin/zsh -lc 'git diff --check 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed -- app/components/FooterComponent.vue app/components/home/HomeAtmosComponent.vue app/components/terminal/programs/Projets.ts app/components/ui/ZCustomCursor.vue app/data/site.ts app/pages/index.vue; git status --short' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/components/FooterComponent.vue
 A app/components/home/HomeAtmosComponent.vue
 M app/components/terminal/programs/Projets.ts
 A app/components/ui/ZCustomCursor.vue
 M app/data/site.ts
 M app/pages/index.vue
 M docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/11-1/

exec
/bin/zsh -lc "git branch --show-current && git log -1 --oneline && git merge-base --is-ancestor 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed HEAD; printf 'baseline_ancestor_exit=%s\\n' \""'$?"; git show -s --format='"'%H %D' 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed; git show-ref --verify --quiet refs/heads/develop; printf 'develop_ref_exit=%s\\n' \""'$?"' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
feat/home-awwwards
42d7d7e docs: spec, planning et cadrage Epic 11 pour la refonte Home Awwwards et alignement Malt
baseline_ancestor_exit=0
42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed HEAD -> feat/home-awwwards, origin/develop, feat/design-system-revamp, develop
develop_ref_exit=0

exec
/bin/zsh -lc "nl -ba app/assets/scss/abstract/_root.scss | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	// ============================================================
     2	//  Tokens du design system — SOURCE DE VÉRITÉ du style
     3	//  Porté depuis docs/design_system/tokens/*.css (dark-first,
     4	//  héritage Ubuntu/terminal : orange + aubergine).
     5	//
     6	//  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
     7	//  motion ne doit être hardcodée dans un composant. Tout passe
     8	//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
     9	//
    10	//  Les valeurs sont reproduites à l'identique des tokens source
    11	//  (notation couleur normalisée par Stylelint : hsl angle/%).
    12	// ============================================================
    13	
    14	:root {
    15	  // ---- Brand : Ubuntu orange (accent primaire) ----
    16	  --orange-50: hsl(24deg 100% 96%);
    17	  --orange-100: hsl(25deg 100% 92%);
    18	  --orange-300: hsl(24deg 100% 75%);
    19	  --orange-500: hsl(24deg 94% 53%); // accent héros
    20	  --orange-600: hsl(24deg 100% 47%);
    21	  --orange-700: hsl(24deg 100% 37%);
    22	  --orange-900: hsl(15deg 60% 17%);
    23	
    24	  // ---- Brand : Aubergine (violet Ubuntu) ----
    25	  --aubergine-light: hsl(319deg 26% 70%);
    26	  --aubergine: hsl(319deg 33% 30%);
    27	  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
    28	  --aubergine-deep: hsl(319deg 100% 9%); // corps terminal
    29	  --aubergine-black: hsl(320deg 60% 5%);
    30	
    31	  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
    32	  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
    33	  --surface-1: hsl(319deg 22% 9%); // sections en creux
    34	  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
    35	  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
    36	  --surface-4: hsl(316deg 14% 21%); // popovers, inputs
    37	
    38	  // ---- Bordures / hairlines ----
    39	  --line-subtle: hsl(316deg 14% 18%);
    40	  --line: hsl(315deg 12% 25%);
    41	  --line-strong: hsl(314deg 11% 34%);
    42	
    43	  // ---- Texte (off-whites chauds sur fond sombre) ----
    44	  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
    45	  --ink-2: hsl(28deg 10% 74%); // corps
    46	  --ink-3: hsl(25deg 7% 54%); // discret / légendes
    47	  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
    48	  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange
    49	
    50	  // ---- Palette terminale / syntaxe ----
    51	  --term-green: hsl(143deg 60% 52%); // prompt, succès
    52	  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
    53	  --term-cyan: hsl(186deg 64% 56%);
    54	  --term-red: hsl(0deg 85% 64%);
    55	  --term-yellow: hsl(48deg 90% 58%);
    56	  --term-purple: hsl(280deg 60% 70%);
    57	
    58	  // ---- Sémantique ----
    59	  --success: hsl(143deg 58% 46%);
    60	  --success-soft: hsl(143deg 45% 14%);
    61	  --warning: hsl(38deg 92% 56%);
    62	  --warning-soft: hsl(38deg 60% 14%);
    63	  --danger: hsl(0deg 78% 60%);
    64	  --danger-soft: hsl(0deg 55% 15%);
    65	  --info: hsl(204deg 72% 56%);
    66	  --info-soft: hsl(204deg 55% 14%);
    67	
    68	  // ============================================================
    69	  //  Alias sémantiques — à préférer dans les composants
    70	  // ============================================================
    71	  --bg-page: var(--surface-0);
    72	  --bg-sunken: var(--surface-1);
    73	  --bg-card: var(--surface-2);
    74	  --bg-elevated: var(--surface-3);
    75	  --bg-input: var(--surface-4);
    76	  --bg-terminal: var(--aubergine-deep);
    77	  --text-strong: var(--ink-1);
    78	  --text-body: var(--ink-2);
    79	  --text-muted: var(--ink-3);
    80	  --text-faint: var(--ink-4);
    81	  --border-subtle: var(--line-subtle);
    82	  --border-default: var(--line);
    83	  --border-strong: var(--line-strong);
    84	  --accent: var(--orange-500);
    85	  --accent-hover: hsl(24deg 100% 60%);
    86	  --accent-active: var(--orange-600);
    87	  --accent-text: var(--ink-on-accent);
    88	  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
    89	  --accent-ring: hsl(24deg 94% 53% / 45%);
    90	  --accent-2: var(--aubergine-light); // accent secondaire
    91	  --accent-2-soft: hsl(319deg 40% 30% / 28%);
    92	  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
    93	  --link: var(--term-blue);
    94	  --prompt: var(--term-green);
    95	  --overlay: hsl(320deg 60% 3% / 66%);
    96	  --selection: hsl(24deg 94% 53% / 28%);
    97	
    98	  // ============================================================
    99	  //  Typographie
   100	  // ============================================================
   101	  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
   102	  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
   103	  --font-display: var(--font-mono);
   104	
   105	  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
   106	  --fs-xs: 0.75rem; // 12
   107	  --fs-sm: 0.875rem; // 14
   108	  --fs-base: 1rem; // 16
   109	  --fs-md: 1.125rem; // 18
   110	  --fs-lg: 1.25rem; // 20
   111	  --fs-xl: 1.5rem; // 24
   112	  --fs-2xl: 1.75rem; // 28
   113	  --fs-3xl: 2rem; // 32
   114	  --fs-4xl: 2.5rem; // 40
   115	  --fs-5xl: 3rem; // 48
   116	  --fs-6xl: 3.5rem; // 56
   117	
   118	  // Graisses
   119	  --fw-light: 300;
   120	  --fw-regular: 400;
   121	  --fw-medium: 500;
   122	  --fw-bold: 700;
   123	
   124	  // Interlignes
   125	  --lh-tight: 1.1;
   126	  --lh-snug: 1.3;
   127	  --lh-normal: 1.5;
   128	  --lh-relaxed: 1.65;
   129	
   130	  // Interlettrage — les eyebrows/labels mono reçoivent des capitales espacées
   131	  --ls-tight: -0.02em;
   132	  --ls-normal: 0;
   133	  --ls-wide: 0.04em;
   134	  --ls-wider: 0.14em;
   135	
   136	  // ============================================================
   137	  //  Espacement — base 4px (token = px / 4)
   138	  // ============================================================
   139	  --space-0: 0;
   140	  --space-1: 0.25rem; // 4
   141	  --space-2: 0.5rem; // 8
   142	  --space-3: 0.75rem; // 12
   143	  --space-4: 1rem; // 16
   144	  --space-5: 1.25rem; // 20
   145	  --space-6: 1.5rem; // 24
   146	  --space-8: 2rem; // 32
   147	  --space-10: 2.5rem; // 40
   148	  --space-12: 3rem; // 48
   149	  --space-16: 4rem; // 64
   150	  --space-20: 5rem; // 80
   151	  --space-24: 6rem; // 96
   152	
   153	  // Layout
   154	  --container-sm: 640px;
   155	  --container-md: 768px;
   156	  --container-lg: 992px;
   157	  --container-xl: 1200px;
   158	  --container-2xl: 1400px;
   159	  --header-height: 56px;
   160	  --footer-height: 56px;
   161	  --gutter: var(--space-6);
   162	
   163	  // ============================================================
   164	  //  Rayons (héritage : 0 / 4 / 8 / pill / 50% ; terminal = 5px)
   165	  // ============================================================
   166	  --radius-none: 0;
   167	  --radius-xs: 3px;
   168	  --radius-sm: 5px; // fenêtre terminal, chips
   169	  --radius-md: 8px; // cartes, inputs, boutons
   170	  --radius-lg: 12px; // grands panneaux
   171	  --radius-xl: 18px;
   172	  --radius-pill: 999px;
   173	  --radius-circle: 50%;
   174	
   175	  // ============================================================
   176	  //  Élévation — ombres calibrées pour une UI sombre
   177	  // ============================================================
   178	  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
   179	  --shadow-2: 0 2px 8px hsl(320deg 60% 2% / 55%);
   180	  --shadow-3: 0 8px 24px hsl(320deg 60% 2% / 60%);
   181	  --shadow-4: 0 18px 48px hsl(320deg 60% 2% / 66%);
   182	
   183	  // Hairline interne en haut : donne l'impression d'une carte éclairée du dessus
   184	  --shadow-hairline: inset 0 1px 0 hsl(30deg 20% 100% / 5%);
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
   226	  }
   227	
   228	  to {
   229	    opacity: 1;
   230	    transform: translateY(0);
   231	  }
   232	}

exec
/bin/zsh -lc "rg -n \"data-hot|cursor: none|ZCustomCursor|HomeAtmos|prefers-reduced-motion|forced-colors|--orange-500|--aubergine-vivid|--term-red|--surface-0|--ink-1|--accent|--ease-in-out\" app public docs -g '*.{vue,scss,ts,md}' | sed -n '1,320p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:201:  color: var(--accent);
app/pages/about.vue:244:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/about.vue:312:  background: var(--surface-0);
app/pages/about.vue:313:  border: 2px solid var(--accent);
app/pages/about.vue:322:  color: var(--accent);
app/pages/blog/[...slug].vue:190:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:278:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:332:    color: var(--accent);
app/pages/blog/[...slug].vue:341:    border-left: 2px solid var(--accent);
app/pages/services.vue:237:  color: var(--accent);
app/pages/services.vue:238:  background: var(--accent-soft);
app/pages/services.vue:276:    color: var(--accent);
app/pages/services.vue:327:  color: var(--accent);
app/pages/contact.vue:367:    color: var(--accent);
app/pages/contact.vue:444:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/contact.vue:459:  border-color: var(--accent-2-soft);
app/pages/mentions-legales.vue:168:    color: var(--accent);
app/pages/confidentialite.vue:229:    color: var(--accent);
app/pages/index.vue:3:    <HomeAtmosComponent />
app/pages/index.vue:4:    <ZCustomCursor />
app/pages/index.vue:255:  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
app/pages/index.vue:257:    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue:260:      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
app/pages/index.vue:295:    color: var(--accent);
app/pages/index.vue:329:  border: 1px solid var(--accent-2-soft);
app/pages/index.vue:358:  background: var(--term-red);
app/pages/index.vue:388:  color: var(--ink-1);
app/pages/index.vue:409:  color: var(--ink-1);
app/pages/index.vue:434:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/pages/index.vue:453:  color: var(--ink-1);
app/pages/index.vue:462:  color: var(--ink-1);
app/pages/index.vue:518:  color: var(--accent);
app/pages/index.vue:519:  background: var(--accent-soft);
app/pages/index.vue:543:  color: var(--accent);
app/pages/index.vue:551:    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/index.vue:659:@media (prefers-reduced-motion: reduce) {
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:91:  a faint purple cast (`--surface-0` … `--surface-4`) so the UI reads like a
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:92:  lit terminal rather than flat grey. **Ubuntu orange** (`--accent`,
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:108:- **Backgrounds:** Three registers — (1) flat `--surface-0` for most content;
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:117:  `prefers-reduced-motion`.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:120:  orange (`--accent` → `--accent-hover`). Links gain underline / brighter blue.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:121:- **Press states:** Settle to the active colour (`--accent-active`) and a
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
docs/planning-artifacts/epics.md:44:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/planning-artifacts/epics.md:50:FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
docs/planning-artifacts/epics.md:59:FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
docs/planning-artifacts/epics.md:105:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/planning-artifacts/epics.md:113:UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
docs/planning-artifacts/epics.md:130:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md:180:Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/planning-artifacts/epics.md:602:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/planning-artifacts/epics.md:652:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/planning-artifacts/epics.md:660:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/planning-artifacts/epics.md:661:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/planning-artifacts/epics.md:662:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/planning-artifacts/epics.md:720:**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md:721:**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
docs/planning-artifacts/epics.md:753:**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md:786:**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
app/assets/scss/base/_layout.scss:45:  color: var(--accent);
docs/project-context.md:202:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/project-context.md:214:  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
docs/project-context.md:217:  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
docs/project-context.md:227:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/project-context.md:264:    vérification du comportement clavier/motion/contraste sous émulation `forced-colors: active` et `prefers-reduced-motion: reduce`.
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/specs/spec-design-system-revamp/SPEC.md:64:  success: `prefers-reduced-motion` respecté (seule boucle = caret terminal) ; états focus/hover/press visibles ; contraste texte lisible sur fonds sombres ; navigation clavier opérante.
app/components/HeaderComponent.vue:196:  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
app/components/HeaderComponent.vue:223:    color: var(--accent);
app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:275:  color: var(--accent);
app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:404:  color: var(--accent);
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
docs/specs/spec-home-awwwards/sections-mapping.md:30:- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
docs/specs/spec-home-awwwards/sections-mapping.md:36:  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
docs/specs/spec-home-awwwards/sections-mapping.md:57:- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/2-4-primitive-zcard.md:33:  - [x] `accent` → `::before` barre 2px haut `linear-gradient(90deg, var(--accent), var(--aubergine-light))`.
docs/implementation-artifacts/2-4-primitive-zcard.md:34:  - [x] `featured` → `box-shadow var(--glow-accent), var(--shadow-hairline)` + bordure `var(--accent-ring)` (token le plus proche de la réf. `hsl(24 94% 53% / 0.35)` — même teinte accent translucide ; évite une valeur hardcodée, cf. revue 2.3).
docs/implementation-artifacts/2-4-primitive-zcard.md:41:  - [x] Rendu prouvé par build : `about/index.html`/`blog/index.html` → `<article class="zcard ...">` pour préserver la sémantique legacy ; CSS scoped émis : `.zcard{background:var(--bg-card)…}` + modifiers `--pad`/`--interactive`/`--accent`/`--featured` ; body title `color:var(--text-strong)`.
docs/implementation-artifacts/2-4-primitive-zcard.md:47:- [x] [Review][Patch] Respecter `prefers-reduced-motion` pour les transitions/lift de `ZCard` et l'animation de `ZCardBody` [app/components/ui/ZCard.vue:54]
docs/implementation-artifacts/2-4-primitive-zcard.md:120:- **Revue `ZCard`** : `as="button"` injecte `type="button"` par défaut tout en respectant un `type` explicite ; les autres attrs restent passthrough. `prefers-reduced-motion` neutralise la transition et le lift hover.
docs/implementation-artifacts/2-4-primitive-zcard.md:122:- **`featured`** : bordure via token `--accent-ring` (réf. `hsl(24 94% 53% / 0.35)` sans token exact ; `--accent-ring` = même teinte accent translucide, choix cohérent avec la revue 2.3 « tokens plutôt que valeurs hardcodées »).
docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:122:  - **Carte CTA terminal** (`ZCard` fond `--bg-terminal`, bordure `--accent-2-soft`) : ligne prompt mono `anon.@jouan.ovh:~$ ./contact` (vert + `./contact` off-white), invite, `ZButton variant="terminal" size="sm"` + `ZIcon name="terminal"`.
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:147:_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:69:- **Epic 9** — a11y DS-wide (forced-colors, généralisation titres/listes home/services, audit `_blank`, + sémantique infos `/contact`).
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:102:- ⚠️ **Motion** : caret clignotant = **seule** animation en boucle (respecter `prefers-reduced-motion`) — recoupe le lot motion d'Epic 9.
docs/specs/spec-home-awwwards/SPEC.md:28:  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md:32:  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
docs/specs/spec-home-awwwards/SPEC.md:40:  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md:64:  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
docs/specs/spec-home-awwwards/SPEC.md:73:- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:32:  - [x] Restyler la pastille de fermeture (`close-button`) comme `.ds-term__dot--close` (dégradé `--term-red` → rouge sombre, `--radius-circle`). Conserver le `@click="closeTerminal"` existant.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:35:  - [x] Aligner la ligne de prompt sur `Prompt.jsx` : `user@host` en vert `--prompt` gras, séparateur `:` en `--ink-1`, répertoire `~` en `--term-blue` gras, `$ ` en `--ink-1`. Le format reste `anon.@jouan.ovh:~$` (valeurs depuis `terminal.config.ts`).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:36:  - [x] Mettre à jour les classes existantes (`.git-prompt`, `.git-prompt-separator`, `.git-prompt-directory`) pour pointer sur les tokens (`--prompt`, `--ink-1`, `--term-blue`) au lieu des `--color-green` / `--color-blue` locaux.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:40:  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:52:- [x] [Review][Decision] **Alpha de bordure 0.28 vs 0.4 (AC + DS)** [app/components/terminal/TerminalComponent.vue:323] — code = `border: 1px solid var(--accent-2-soft)`, or `--accent-2-soft = hsl(319 40% 30% / 28%)`, alors que Task 1 et `TerminalWindow.jsx` exigent `hsl(319 40% 30% / 0.4)`. Même teinte, alpha ~30 % plus transparent. **Medium.** Options : (a) ajouter/ajuster un token à alpha 0.4 ; (b) dérogation commentée `hsl(319 40% 30% / 0.4)` (comme le rouge de la pastille close) ; (c) accepter 0.28 (priorité tokens-only). → **Décision Simon : (a) nouveau token DS à alpha 0.4** (dans `_root.scss`) consommé par la bordure.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:53:- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:72:- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:75:- **[Med] a11y close + input** → close : `role="button"`, `aria-label`, `tabindex="0"`, `@keydown.enter/.space.prevent`, `:focus-visible` (ring `--accent`) ; input : `aria-label`. Fermeture clavier (Enter) vérifiée.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:109:  - Corps : `--bg-terminal` (= `--aubergine-deep`, `hsl(319 100% 9%)`) ; sous `@supports (backdrop-filter)`, `hsl(319 100% 9% / 0.86)` + `blur(5px)`. Texte `--ink-1`, `--font-mono`, `--fs-sm`, `--lh-snug`, `white-space: pre-wrap`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:110:  - Barre : `--aubergine-black`, titre `--text-muted` / `--fs-xs` / `--ls-wide`, pastille close en dégradé `--term-red`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:111:  - Prompt : `user@host` vert `--prompt` (= `--term-green`), `:` `--ink-1`, `~` `--term-blue`, `$` `--ink-1` ; tous gras (`--fw-bold`) comme la réf.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:117:- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:129:- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:152:- Vérif visuelle Chrome DevTools MCP (terminal ouvert) : computed styles tous conformes aux tokens — `border-radius 5px` (`--radius-sm`), bordure `rgba(107,46,88,.28)` (`--accent-2-soft`), ombre `--glow-terminal`, corps `bg-terminal` à 86 % (`color-mix`) + `backdrop-filter: blur(5px)`, prompt `rgb(59,206,115)` (`--prompt`), `~` `rgb(88,172,228)` (`--term-blue`), séparateurs `--ink-1`, caret `--prompt`, pastilles jaune/vert. Close vérifié (clic → `display:none`), classes des handlers intactes.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:159:- **Fenêtre** (`.terminal`) : suppression du bloc de ~22 variables `--color-*` codées en dur → tokens DS. `--radius-sm`, bordure `--accent-2-soft`, ombre `--glow-terminal` (remplace `var(--box-shadow-2)` qui était indéfini), `font-mono`, `color: --ink-1`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:160:- **Barre** (`.terminal-header`) : 30px, fond `--aubergine-black` ; pastilles à gauche (close `--term-red`→rouge sombre + min `--term-yellow` / max `--term-green` décoratives `aria-hidden`) ; titre centré absolu `--text-muted`/`--fs-xs`/`--ls-wide`, `pointer-events: none` (toute la barre reste draggable).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:162:- **Prompt** : `.git-prompt` → `--prompt` (vert), séparateurs → `--ink-1`, répertoire → `--term-blue`, tous `--fw-bold` (porté de `Prompt.jsx`).
app/components/FooterComponent.vue:100:    color: var(--accent);
app/components/FooterComponent.vue:112:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:150:    color: var(--accent);
app/components/FooterComponent.vue:155:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:182:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:21:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:26:- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:28:  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:34:  - [x] Vérifier le texte sur l'orange accent (`--accent-text` sur `--accent`) et le texte sur les fonds atmosphériques. **OK** : `accent-text` sur orange = 6.93:1 ; accent orange comme texte sur surfaces = 5.3–6.8:1 ; gradient hero reste très sombre (texte blanc 17:1).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:63:- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:67:- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:68:- Keyframes disponibles : `caret-blink` (réservé au caret) et `fade-rise` (entrées). Durées via `--dur-fast`/`--dur-base`/`--dur-slow`/`--dur-slower` ; easings via `--ease-out`/`--ease-in-out`/`--ease-standard`. [Source: docs/design_system/tokens/motion.css]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:69:- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:74:- Échelle de texte (du plus fort au plus faible) : `--text-strong` (titres haut contraste), `--text-body` (corps), `--text-muted` (légendes), `--text-faint` (atténué/désactivé) ; `--accent-text` = texte sombre sur orange. [Source: docs/design_system/tokens/colors.css]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:92:- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:97:- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:101:- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:109:- [Source: docs/design_system/tokens/colors.css — `--text-strong`/`--text-body`/`--text-muted`/`--text-faint`, `--bg-*`, `--accent-text`, `--overlay`]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:125:  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:138:- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:140:- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:153:| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
app/assets/scss/abstract/_root.scss:19:  --orange-500: hsl(24deg 94% 53%); // accent héros
app/assets/scss/abstract/_root.scss:27:  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
app/assets/scss/abstract/_root.scss:32:  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
app/assets/scss/abstract/_root.scss:44:  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
app/assets/scss/abstract/_root.scss:54:  --term-red: hsl(0deg 85% 64%);
app/assets/scss/abstract/_root.scss:71:  --bg-page: var(--surface-0);
app/assets/scss/abstract/_root.scss:77:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:84:  --accent: var(--orange-500);
app/assets/scss/abstract/_root.scss:85:  --accent-hover: hsl(24deg 100% 60%);
app/assets/scss/abstract/_root.scss:86:  --accent-active: var(--orange-600);
app/assets/scss/abstract/_root.scss:87:  --accent-text: var(--ink-on-accent);
app/assets/scss/abstract/_root.scss:88:  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
app/assets/scss/abstract/_root.scss:89:  --accent-ring: hsl(24deg 94% 53% / 45%);
app/assets/scss/abstract/_root.scss:90:  --accent-2: var(--aubergine-light); // accent secondaire
app/assets/scss/abstract/_root.scss:91:  --accent-2-soft: hsl(319deg 40% 30% / 28%);
app/assets/scss/abstract/_root.scss:191:  --ring-accent: 0 0 0 3px var(--accent-ring);
app/assets/scss/abstract/_root.scss:201:  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
docs/implementation-artifacts/4-2-section-process.md:30:  - [x] Rendre une grille de 4 colonnes (`grid-template-columns: repeat(4, 1fr)`) ; chaque étape = numéro (mono, `var(--accent)`, `fs-3xl`, `fw-light`) → titre `h3` → `p.prose` description
docs/implementation-artifacts/4-2-section-process.md:51:- **Tokens, pas de valeurs en dur** : numéro d'étape coloré via `var(--accent)`, espacements via `var(--space-*)`, tailles via `var(--fs-*)`. [Source: docs/project-context.md#SCSS]
docs/implementation-artifacts/4-2-section-process.md:74:- Grille étapes : `grid-template-columns: repeat(4, 1fr)`, gap `--space-5`. Chaque étape : numéro `fontFamily: var(--font-mono)`, `fs-3xl`, `color: var(--accent)`, `fw-light` → `h3` (`fs-lg`) → `p.prose` (`fs-sm`, `--text-muted`). [Source: Services.jsx L49-56]
docs/implementation-artifacts/4-2-section-process.md:82:- Ne pas hardcoder couleurs/espaces — tokens uniquement (`var(--accent)`, `var(--space-*)`, `var(--fs-*)`). [Source: SPEC.md#Constraints]
docs/implementation-artifacts/4-2-section-process.md:126:- Grille `repeat(4, 1fr)` (gap `--space-5`) : par étape, numéro mono `fs-3xl`/`fw-light`/`var(--accent)` → `h3` `fs-lg` → `p.prose` `fs-sm`/`text-muted`. Tout en tokens, aucune valeur en dur.
app/components/HexagonLinkComponent.vue:36:    background: var(--accent);
app/components/HexagonLinkComponent.vue:40:    outline: 2px solid var(--accent);
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:5:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:19:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:20:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:21:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:26:- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:27:  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:29:- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:30:  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:32:- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:33:  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:40:- [x] [Review][Patch] Mettre à jour deferred-work.md pour solder les items #4 (audit émulé) et #5 (unification forced-colors) [docs/implementation-artifacts/deferred-work.md:27-28]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:41:- [x] [Review][Patch] Consigner l'environnement d'émulation (macOS VoiceOver, Chrome Rendering) et le relevé des observations dans le Dev Agent Record [docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:83]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:52:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:53:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:58:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:60:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:61:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:65:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:73:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:91:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:94:  - Profils émulés : `forced-colors: active` (palette système Windows High Contrast / Canvas & Highlight) et `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:96:  - Relevé d'observations `forced-colors` : Chaque élément interactif (`ZButton`, `ZCard`, `ZTag`, `ZInput`, liens de navigation header/footer, liens sociaux, boutons page d'accueil) restitue un outline système bien visible (le repli `outline: transparent` se colore en couleur système `Highlight`).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:97:  - Relevé d'observations `prefers-reduced-motion` : Transitions CSS et animations `fade-rise` instantanées (`0.01ms`), aucune boucle superflue en cours, le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none`), et le caret de frappe du terminal reste fonctionnel (seule boucle autorisée CAP-11).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:107:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:109:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:120:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:82:- `forced-colors` DS-wide + audit `_blank` site-wide → **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:98:- ⚠️ **Reports** : déploiement non prouvé (grossit) ; `forced-colors` / `_blank` → Epic 9.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:33:  - [x] Boutons primaires : l'orange s'éclaircit (`var(--accent)` → `var(--accent-hover)`). **Conforme** (`ZButton--primary:hover`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:34:  - [x] Liens : soulignement / bleu plus clair (`var(--link)`). **Conforme** (liens nav/footer → `--text-strong`/`--accent` ; liens prose/email → soulignement + `--term-blue`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:37:  - [x] Boutons : couleur active (`var(--accent-active)`) + léger nudge de ~1px vers le bas ; **pas** de scale-shrink, pas de rebond. **Conforme** (`ZButton--primary:active` : `--accent-active` + `translateY(1px)` ; secondary/danger : `translateY(1px)`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:42:  - [x] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6). **Conforme (focus plus fort que demandé)** : `ZInput:focus` pose `border-color: --accent` **+** ring `--accent-ring` (pattern DS README, plus prominent que `--border-strong`) ; `:hover` renforce déjà à `--border-strong`. Non régressé (n'aurait fait qu'affaiblir le focus).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:55:> **Pistes écartées après recoupement (dismiss)** : (1) « rayon des anneaux incohérent (nav/menu carrés vs brand/footer arrondis) » (Blind Hunter) — **faux positif** : `.hdr__link`/`.hdr__menu-link` portent déjà `border-radius` dans leur règle de base (`HeaderComponent.vue:256/389`), seuls brand/footer (base sans rayon) l'ajoutent → tous les anneaux arrondis. (2) « clipping de l'anneau par un ancêtre `overflow:hidden` » — infirmé : aucun `overflow:hidden` sur les ancêtres du header/nav/footer. (3) « tokens inexistants (`--ring-accent`/`--radius-sm`/`--radius-xs`) » — infirmé : tous définis (`_root.scss`), `--ring-accent` = la valeur box-shadow correcte (le `--accent-ring` couleur n'est pas utilisé en box-shadow). (4) « littéraux `2px` hardcodés » — dérogation a11y légitime (largeur/offset d'outline, pas de token DS dédié), pattern déjà établi (`contact.vue`/`about.vue`/`index.vue`). (5) « `.hdr__brand`/`.ftr__brand` pas focusables » — infirmé : vrais `<a>`/NuxtLink.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:68:- **Hover** : éclaircir la surface d'un cran (`--surface-2` → `--surface-3`) et/ou passer la bordure à `--border-strong` ; les boutons primaires éclaircissent l'orange (`--accent` → `--accent-hover`) ; les liens gagnent un soulignement / un bleu plus clair. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:69:- **Press** : se poser sur la couleur active (`--accent-active`) avec un nudge de ~1px vers le bas ; **pas de scale-shrink**. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:70:- **Focus** : anneau visible via `--accent-ring` (`hsl(24 94% 53% / 0.45)`) ; `--border-strong` au focus pour bordures/inputs. [Source: docs/design_system/tokens/colors.css — `--accent-ring`, `--border-strong`]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:77:- Tokens d'états disponibles : `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--accent-soft`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--border-subtle`, `--border-default`, `--border-strong`, `--link`. [Source: docs/design_system/tokens/colors.css]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:90:- **Ne jamais** faire `outline: none` sans fournir un focus visible de remplacement (anneau via `--accent-ring`). Le focus clavier doit **toujours** rester visible (AC #2).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:105:- [Source: docs/design_system/tokens/colors.css — `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--border-strong`]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:118:- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:126:  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:128:- **Correctif central — repli `forced-colors` au niveau des primitives DS (deferred-work item #1, revues 3.2/5.1)** : les rings de focus en `box-shadow: var(--ring-accent)` disparaissent en contraste forcé (Windows High Contrast) → focus invisible. Corrigé **une seule fois à la source** (ZButton, ZCard, ZTag ×2, ZInput) en remplaçant `outline: none` par `outline: 2px solid transparent; outline-offset: 2px;` — invisible en rendu normal (le ring prend le relais), rendu en **couleur système** sous forced-colors. Pattern identique à celui déjà posé localement sur les pages (`contact__email`, lien bio `/about`…), désormais factorisé pour tous les consommateurs des primitives.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:129:- **Lacune de focus comblée — liens du châssis** : `hdr__brand`, `hdr__link`, `hdr__menu-link`, `ftr__brand`, `ftr__link` n'avaient **aucun** `:focus-visible` (ils tombaient sur l'outline UA par défaut, non conforme au DS). Ajout de l'anneau DS `--ring-accent` + repli forced-colors. `hdr__burger` (qui avait déjà le ring) reçoit aussi le repli forced-colors.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:130:- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:135:- `app/components/ui/ZButton.vue` (MODIFIÉ — repli forced-colors sur `:focus-visible`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:136:- `app/components/ui/ZCard.vue` (MODIFIÉ — repli forced-colors sur `.zcard--interactive:focus-visible`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:137:- `app/components/ui/ZTag.vue` (MODIFIÉ — repli forced-colors sur `.ztag--clickable` + `.ztag__remove`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:138:- `app/components/ui/ZInput.vue` (MODIFIÉ — repli forced-colors sur `.zinput,.ztextarea:focus`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:139:- `app/components/HeaderComponent.vue` (MODIFIÉ — anneau DS sur `hdr__brand`/`hdr__link`/`hdr__menu-link` + repli forced-colors sur `hdr__burger`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:140:- `app/components/FooterComponent.vue` (MODIFIÉ — anneau DS + repli forced-colors sur `ftr__brand`/`ftr__link`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:143:- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — item Epic 9 #1 « repli forced-colors DS-wide » soldé)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:28:  - [x] Brand : logo **diamant** `<ZIcon name="gem">` (24px, `var(--accent)`) + `jouan.ovh` mono bold (`--font-mono`, `--text-strong`).
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:29:  - [x] Nav desktop : liens mono `--fs-sm`, `--text-muted` ; hover `--text-strong` + `--surface-2` ; actif `--accent`.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:44:  - [x] `HexagonLinkComponent.vue` refondu au style DS : hexagone `clip-path` (kit), `--surface-2`, glyphe `currentColor` (`ZIcon`), hover `background var(--accent)` + `color var(--ink-on-accent)`, focus visible, libellé a11y masqué visuellement.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:55:- [x] [Review][Patch] Remplacer la couleur de header hardcodée par une composition de tokens [app/components/HeaderComponent.vue:159] **→ Résolu** : `background: color-mix(in srgb, var(--surface-0) 82%, transparent)` (surface de page token à 82 %), remplace le `hsl(320deg 40% 5% / 82%)` hardcodé.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:73:- **`components/HexagonLinkComponent.vue`** (UPDATE) — état actuel : hexagone paramétrable via CSS vars, couleurs `_color.$gray-*`. Restyler aux tokens DS (`--surface-2`, hover `--accent`).
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:81:- **kit.css `.hdr`** : `position: sticky; top:0; z-index:50; height var(--header-height);` ; `.hdr__brand img { 24px }` ; `.hdr__link` mono `--fs-sm` `--text-muted`, hover `--text-strong`+`--surface-2`, `--active` `--accent` ; `.hdr__right { margin-left:auto; gap var(--space-3) }` ; `@media .hdr__nav { display:none }` (mobile). [Source: kit.css]
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:83:- **kit.css `.ftr`/`.hex`** : `.ftr { background var(--surface-1); border-top 1px var(--border-subtle) }` ; `.hex { width:46px; height:53px; … }` hover `color var(--ink-on-accent); background var(--accent)` ; `.hex svg { 20px }`. [Source: kit.css]
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:130:- **`HexagonLinkComponent.vue` refondu** : hexagone `clip-path` DS (remplace le hexagone legacy à pseudo-éléments complexes), `--surface-2` → hover `--accent`/`--ink-on-accent`, `<a target="_blank" rel="noopener noreferrer">`, libellé a11y visuellement masqué, focus visible.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:135:- **Décision logo** : diamant `ZIcon gem` en `var(--accent)` (orange = accent héros) plutôt que le PNG blanc — vectoriel, net en 24px, contrôlé par token.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:143:- ✅ Résolu [Patch] **couleur header tokenisée** : `color-mix(in srgb, var(--surface-0) 82%, transparent)` à la place du `hsl(...)` hardcodé.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:144:- Validation : `pnpm lint` / `typecheck` / `generate` **exit 0** (24 routes, CNAME intact). Preuves dans la sortie : `aria-current="page"` (lien actif), `background:color-mix(in srgb,var(--surface-0)…)`, `@media(max-width:1100px){.hdr__clock{display:none}}`, `@media(max-width:1000px){.hdr__badge{display:none}}`, `@media(min-width:901px){.hdr__overlay{display:none}}`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:55:- [x] [Review][Defer] `outline:none` + ring `box-shadow` KO en forced-colors [app/pages/index.vue `.offer__more:focus-visible`] — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → focus invisible. Pattern **systémique du DS** (ZButton, etc.), à corriger centralement (`@media (forced-colors: active)` restaurant l'outline) — relève d'Epic 9 (contraste/clavier), pas de cette story. [blind]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:62:- **Aucune valeur hardcodée** (NFR2) : couleurs, espaces, rayons via tokens (`--bg-sunken`, `--border-subtle`, `--accent`, `--text-muted`, `--text-strong`, `--fs-*`, `--space-*`). [Source: docs/project-context.md#SCSS]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:91:| `<a onClick={() => go("services")}>En savoir plus →</a>` | `NuxtLink` → `/services` (Ubuntu Mono, `--accent`) |
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:138:- Vérification visuelle via **Chrome DevTools MCP** (viewport desktop, serveur dev) : 2 sections, grille 3 colonnes égales, carte `featured` avec bordure `--accent-ring` + glow, icônes 22px, fond `--bg-sunken` sur les stats, liens `→ /services`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:145:- Chaque carte : `.offer__icon` (boîte `--space-10`/40px, fond `--accent-soft`, glyphe `ZIcon` dimensionné via `font-size`), `<h3>` titre, `<p>` description (Ubuntu sans), lien `NuxtLink` `En savoir plus →` vers `/services`.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:168:- ✅ Resolved review finding [Defer→corrigé ciblé] focus en `forced-colors` : ajout d'un repli `@media (forced-colors: active)` restaurant un `outline` sur les éléments focusables **propres à cette page** (`.offer__more`, `.hero-term__open`) → cette page ne porte plus la dette. **Le repli DS-wide** (ZButton/ZTag/ZCard/ZInput, focus via `box-shadow`) reste un correctif central **assigné à Epic 9** : le traiter ici impliquerait de toucher toutes les primitives Epic 2 (élargissement de périmètre, justement pointé par le finding Decision).
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:182:- 2026-06-22 — Corrections de revue de code : 2 findings [Patch] (aria-label liens, clés v-for stables) + 2 [Defer] traités (retrait `role="img"` sur `.init` ; repli `forced-colors` pour les focusables de la page ; repli DS-wide laissé à Epic 9). Lint/typecheck/generate verts. Statut → review.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:183:- 2026-06-22 — Re-revue (vérification post-fix, commit `132093d`) : 2 patchs confirmés dans le code (aria-label distincts ×3, clés `id` stables) + 2 defers réellement traités (`role="img"` retiré ; `@media (forced-colors: active)` sur `.offer__more`/`.hero-term__open`). `pnpm lint` (0/0) + `pnpm typecheck` verts (couverts par la vérif HEAD `5056196`). Aucune régression. Statut → done.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:32:  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:34:  - [x] Label : `var(--font-mono)`, `var(--fs-xs)`, `var(--ls-wider)`, uppercase, `var(--text-muted)` ; `.zfield__req { color: var(--accent); }`.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:41:  - [x] Taille via `--_sz` ; police initiales `calc(var(--_sz) * 0.4)` ; `ring` → `box-shadow: 0 0 0 2px var(--bg-page), 0 0 0 4px var(--accent)`.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:43:  - [x] Rendu prouvé par build (page de smoke-test temporaire, supprimée après) : `<label for="v-0-0">`↔`<input id="v-0-0" class="zinput">`, `<textarea class="ztextarea">` (multiline), `zfield--error`+`aria-invalid="true"`+`aria-describedby`, `zfield__req`, `zinput--has-icon`/`zinput__icon` ; `<img data-nuxt-img srcset="/_ipx/…">` (NuxtImg), `zavatar--sm/md/lg/xl`, `zavatar--ring` (box-shadow double `--bg-page`+`--accent`).
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:57:- **Cibles** : `components/ui/ZInput.vue` (bordure `--border-default` → `--border-strong` au focus — formulé dans primitives.md ; le `.jsx` montre en plus le focus accent `--accent` + ring) et `components/ui/ZAvatar.vue` (radius pill/circle). [Source: docs/specs/spec-design-system-revamp/primitives.md]
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:77:- hover `--border-strong` ; focus `--accent` + `--ring-accent` ; error `--danger`.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:83:- `img { width/height 100%; object-fit cover; }` ; ring → double `box-shadow` (gap `--bg-page` + anneau `--accent`).
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:121:- Preuves sortie (page smoke temporaire) : `<label for="v-0-0">` ↔ `<input id="v-0-0" class="zinput">` (lien `useId`), `<textarea class="ztextarea">`, `zfield--error` + `aria-invalid="true"` + `aria-describedby="v-0-1-hint"`, `zfield__req`, `zinput--has-icon`/`zinput__icon` ; `<img data-nuxt-img srcset="/_ipx/_/images/…">` (NuxtImg, pas de `<img>` brut), `zavatar--{sm,md,lg,xl}`, `.zavatar--ring{box-shadow:0 0 0 2px var(--bg-page),0 0 0 4px var(--accent)}`.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:127:  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:129:- **`components/ui/ZAvatar.vue` créé** : `<span>` rond (`--radius-circle`, suit `Avatar.jsx` — pas pill), image via **`<NuxtImg>`** (optimisée `_ipx`, jamais `<img>` brut) ou initiales (fallback `"?"`). Tailles `sm/md/lg/xl` via `--_sz`, `ring` → double box-shadow (`--bg-page` + `--accent`). Revue : taille runtime invalide ramenée à `md`, et échec image → fallback initiales.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:130:- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
docs/implementation-artifacts/2-1-porter-les-tokens-du-design-system.md:28:  - [x] Y porter **à l'identique** les valeurs de `docs/design_system/tokens/colors.css` (échelles orange/aubergine, ramp `--surface-0…4`, hairlines `--line*`, encres `--ink-1…4`, palette terminale `--term-*`, sémantiques `--success/--warning/--danger/--info`, puis tous les alias `--bg-*`, `--text-*`, `--border-*`, `--accent*`, `--link`, `--prompt`, `--overlay`, `--selection`).
docs/implementation-artifacts/2-1-porter-les-tokens-du-design-system.md:41:  - [x] Build vert (`pnpm generate`, exit 0, 24 routes) : `:root` expose les nouvelles CSS vars (`--accent`, `--bg-page`, `--space-4`, `--radius-md`, `--shadow-2`, `--dur-base`, `--font-mono`…) — prouvé par grep dans `.output/public/_nuxt/*.css` ; `::selection` et keyframes `caret-blink`/`fade-rise` émis. (Preuve par build, plus forte que l'inspection DOM en `dev` : même compilation Sass.)
docs/implementation-artifacts/2-1-porter-les-tokens-du-design-system.md:57:- Le DS source est **100 % CSS custom properties** (`docs/design_system/tokens/*.css` déclarent tout sous `:root`). Pour rester fidèle et permettre l'usage `var(--accent)` dans les primitives 2.3–2.6 sans réécriture, **porter en CSS vars globales** dans un partiel `_root.scss` chargé globalement.
docs/implementation-artifacts/2-1-porter-les-tokens-du-design-system.md:70:- **Accent héros** : `--accent: var(--orange-500)` = `hsl(24 94% 53%)` ; `--accent-hover: hsl(24 100% 60%)` ; `--accent-active: var(--orange-600)` = `hsl(24 100% 47%)` ; `--accent-text: hsl(320 60% 5%)` (texte sombre sur orange). [Source: docs/design_system/tokens/colors.css]
docs/implementation-artifacts/2-1-porter-les-tokens-du-design-system.md:71:- **Surfaces aubergine** : `--surface-0: hsl(320 30% 6%)` (fond page) … `--surface-4: hsl(316 14% 21%)` (inputs) ; `--bg-terminal: var(--aubergine-deep)` = `hsl(319 100% 9%)`. [Source: colors.css]
docs/implementation-artifacts/2-1-porter-les-tokens-du-design-system.md:112:- `pnpm generate` → exit 0, « Prerendered 24 routes ». Tokens vérifiés dans `.output/public/_nuxt/*.css` : bloc `:root{--orange-50…--selection}` présent (le minifieur Nuxt convertit hsl→hex, couleurs identiques), `::selection{background:var(--selection)}`, `@keyframes caret-blink`/`fade-rise` présents. Grep OK sur `--accent`, `--accent-soft`, `--bg-page`, `--text-body`, `--space-4`, `--radius-md`, `--shadow-2`, `--ring-accent`, `--dur-base`, `--ease-out`, `--font-mono`, `--selection`.
app/components/home/HomeAtmosComponent.vue:14:// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue:40:  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
app/components/home/HomeAtmosComponent.vue:42:  animation: drift-orange 26s var(--ease-in-out) infinite;
app/components/home/HomeAtmosComponent.vue:50:  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
app/components/home/HomeAtmosComponent.vue:52:  animation: drift-auberg 32s var(--ease-in-out) infinite;
app/components/home/HomeAtmosComponent.vue:60:  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
app/components/home/HomeAtmosComponent.vue:62:  animation: drift-red 30s var(--ease-in-out) infinite;
app/components/home/HomeAtmosComponent.vue:83:  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
app/components/home/HomeAtmosComponent.vue:119:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:18:  - 3.1 — Hero Terminal (A) : refonte `pages/index.vue`, composable `useTerminal` (registre/launcher), token `--aubergine-vivid`.
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:40:5. **Conventions qui se propagent proprement.** Clés `v-for` sur `id` stable (établi 3.1 → appliqué 3.2/3.3), repli `forced-colors` local, libellé sr-only « nouvel onglet ». Cohérence intra-fichier tenue. `<component :is>` géré correctement dès 3.1 (import via `#components`) — la leçon Epic 2 est passée dans les réflexes.
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:42:6. **`forced-colors`** (rings de focus en `box-shadow` supprimés en contraste forcé) : trou **systémique du DS**, traité localement sur `/`, reporté DS-wide à **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:95:- `forced-colors` DS-wide + audit `_blank` site-wide → **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:111:- ⚠️ **Reports** : déploiement non prouvé (grossit) ; `forced-colors` / `_blank` → Epic 9.
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/terminal/TerminalComponent.vue:339:  color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
app/components/terminal/TerminalComponent.vue:379:        outline: 2px solid var(--accent);
app/components/terminal/TerminalComponent.vue:445:      color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:468:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:34:   **And** sous `@media (prefers-reduced-motion: reduce)`, les keyframes d'animation sont strictement neutralisées (`animation: none`), les gradients restant figés de manière lisible.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:38:   **Then** un micro-curseur interactif fluide (`.cursor-dot` + `.cursor-ring`) suit le pointeur et réagit (agrandissement / scaling) au survol des éléments interactifs marqués `data-hot` (boutons, liens, cartes)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:61:  - [x] Créer `app/components/home/HomeAtmosComponent.vue`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:65:  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:68:  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:70:  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:71:  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:75:  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:92:- **`app/components/home/HomeAtmosComponent.vue`** (NEW) : Composant dédié aux calques auroras et scanlines.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:93:- **`app/components/ui/ZCustomCursor.vue`** (NEW) : Composant du micro-curseur interactif progressif.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:97:- **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:98:- **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:112:4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:115:   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:116:5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:118:   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:119:   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:127:- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:135:- `app/components/home/HomeAtmosComponent.vue` (NEW)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:136:- `app/components/ui/ZCustomCursor.vue` (NEW)
docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md:143:- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).
app/components/ui/ZButton.vue:136:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/components/ui/ZButton.vue:177:  background: var(--accent);
app/components/ui/ZButton.vue:178:  color: var(--accent-text);
app/components/ui/ZButton.vue:179:  border-color: var(--accent);
app/components/ui/ZButton.vue:182:    background: var(--accent-hover);
app/components/ui/ZButton.vue:183:    border-color: var(--accent-hover);
app/components/ui/ZButton.vue:187:    background: var(--accent-active);
app/components/ui/ZButton.vue:188:    border-color: var(--accent-active);
app/components/ui/ZButton.vue:222:  border-color: var(--accent-2-soft);
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:44:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
app/components/ui/ZBadge.vue:59:.zbadge--accent {
app/components/ui/ZBadge.vue:60:  background: var(--accent-soft);
app/components/ui/ZBadge.vue:61:  color: var(--accent);
app/components/ui/ZAvatar.vue:90:    0 0 0 4px var(--accent);
app/components/ui/ZInput.vue:145:  color: var(--accent);
app/components/ui/ZInput.vue:175:    // Outline transparent → rendu en couleur système sous forced-colors (où la
app/components/ui/ZInput.vue:179:    border-color: var(--accent);
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:34:1. **La revue trouve de vrais bugs invisibles au lint — surtout en a11y.** ~13 des 24 findings sont d'accessibilité : `ZTag` non focusable au clavier (2.5), retour de focus après fermeture du menu mobile (2.8), `aria-current` (2.8), fallback avatar sur image échouée (2.6), `prefers-reduced-motion` sur les lifts de carte (2.4). `lint + typecheck + generate` ne les voit pas ; la revue, oui.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:78:1. **Checklist pré-revue dans chaque consigne d'agent** : « tokens-only (aucune valeur en dur) + a11y (focus visible, clavier Enter/Space, `aria-*`, `prefers-reduced-motion`) » à auto-vérifier avant de passer la story en revue. Complète la règle de périmètre Epic 1 (#1).

exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '1,240p'; nl -ba app/components/FooterComponent.vue | sed -n '1,180p'; nl -ba app/components/terminal/programs/Projets.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="home">
     3	    <HomeAtmosComponent />
     4	    <ZCustomCursor />
     5	
     6	    <section class="hero hero__grad">
     7	      <div class="hero__in container">
     8	        <div class="hero__grid">
     9	          <!-- Colonne gauche : accroche, CTA, tags -->
    10	          <div class="anim hero__text">
    11	            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
    12	            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
    13	            <p class="hero__sub">{{ tagline }}</p>
    14	            <div class="hero__cta">
    15	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    16	                Démarrer un projet
    17	                <template #iconRight><ZIcon name="arrow" /></template>
    18	              </ZButton>
    19	              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
    20	            </div>
    21	            <ul class="hero__tags">
    22	              <li v-for="tag in tags" :key="tag">
    23	                <ZTag>{{ tag }}</ZTag>
    24	              </li>
    25	            </ul>
    26	          </div>
    27	
    28	          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
    29	          <div class="anim hero__term-col">
    30	            <div class="hero-term">
    31	              <div class="hero-term__bar">
    32	                <span class="hero-term__dots" aria-hidden="true">
    33	                  <span class="hero-term__dot hero-term__dot--close" />
    34	                  <span class="hero-term__dot hero-term__dot--min" />
    35	                  <span class="hero-term__dot hero-term__dot--max" />
    36	                </span>
    37	                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
    38	              </div>
    39	
    40	              <div class="hero-term__body">
    41	                <template v-for="row in terminalRows" :key="row.id">
    42	                  <p class="hero-term__line" aria-hidden="true">
    43	                    <span class="prm"
    44	                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    45	                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
    46	                      ><span class="prm__cmd">{{ row.cmd }}</span></span
    47	                    >
    48	                  </p>
    49	                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
    50	                </template>
    51	
    52	                <button
    53	                  type="button"
    54	                  class="hero-term__open"
    55	                  aria-label="Ouvrir le terminal interactif"
    56	                  aria-haspopup="dialog"
    57	                  @click="openTerminal"
    58	                >
    59	                  <span class="prm"
    60	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    61	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
    62	                    ><span class="prm__caret" aria-hidden="true"
    63	                  /></span>
    64	                </button>
    65	              </div>
    66	            </div>
    67	          </div>
    68	        </div>
    69	      </div>
    70	    </section>
    71	
    72	    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    73	    <section class="section">
    74	      <div class="container">
    75	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
    76	        <h2 class="section__title">Trois façons de travailler ensemble</h2>
    77	        <ul class="grid-3">
    78	          <li v-for="service in services" :key="service.id">
    79	            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
    80	              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    81	              <h3 class="offer__title">{{ service.title }}</h3>
    82	              <p class="offer__desc">{{ service.desc }}</p>
    83	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    84	                En savoir plus →
    85	              </NuxtLink>
    86	            </ZCard>
    87	          </li>
    88	        </ul>
    89	      </div>
    90	    </section>
    91	
    92	    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    93	    <section class="section section--sunken">
    94	      <div class="container">
    95	        <div class="statrow">
    96	          <div v-for="stat in stats" :key="stat.id" class="stat">
    97	            <b>{{ stat.value }}</b>
    98	            <span>{{ stat.label }}</span>
    99	          </div>
   100	        </div>
   101	
   102	        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
   103	        <ul class="grid-2 projects">
   104	          <li v-for="project in projects" :key="project.name">
   105	            <ZCard
   106	              class="project"
   107	              interactive
   108	              :as="project.url ? ZExternalLink : 'div'"
   109	              :href="project.url || undefined"
   110	              :rel="project.url ? 'noopener noreferrer' : undefined"
   111	            >
   112	              <div class="project__head">
   113	                <h3 class="project__name">{{ project.name }}</h3>
   114	                <span class="project__role">{{ project.role }}</span>
   115	              </div>
   116	              <p class="prose project__desc">{{ project.desc }}</p>
   117	              <ul class="hero__tags">
   118	                <li v-for="tag in project.tags" :key="tag">
   119	                  <ZTag>{{ tag }}</ZTag>
   120	                </li>
   121	              </ul>
   122	            </ZCard>
   123	          </li>
   124	        </ul>
   125	      </div>
   126	    </section>
   127	  </main>
   128	</template>
   129	
   130	<script setup lang="ts">
   131	// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   132	// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   133	// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   134	import { NuxtLink, ZExternalLink } from "#components";
   135	import { useTerminal } from "~/composables/useTerminal";
   136	import { SITE } from "~/data/site";
   137	
   138	// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
   139	const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
   140	const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
   141	
   142	// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   143	// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   144	// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
   145	const services = [
   146	  {
   147	    id: "wordpress",
   148	    icon: "wp",
   149	    title: "WordPress sur-mesure",
   150	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   151	    featured: false,
   152	  },
   153	  {
   154	    id: "apps",
   155	    icon: "code",
   156	    title: "Applications web",
   157	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   158	    featured: true,
   159	  },
   160	  {
   161	    id: "ia",
   162	    icon: "spark",
   163	    title: "IA & automatisation",
   164	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   165	    featured: false,
   166	  },
   167	];
   168	
   169	// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   170	const stats = [
   171	  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   172	  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   173	  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   174	];
   175	
   176	// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   177	const projects = SITE.projects;
   178	
   179	// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
   180	// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
   181	// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
   182	const terminalRows = [
   183	  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
   184	  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
   185	  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
   186	];
   187	
   188	// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
   189	// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
   190	// restylisation du terminal lui-même relève d'Epic 8.
   191	const { open: openTerminal } = useTerminal();
   192	
   193	const siteUrl = useSiteUrl();
   194	const homeJsonLd = [
   195	  {
   196	    "@context": "https://schema.org",
   197	    "@type": "WebSite",
   198	    name: "Simon Jouan — Développeur web freelance",
   199	    url: siteUrl,
   200	    description: tagline,
   201	  },
   202	  {
   203	    "@context": "https://schema.org",
   204	    "@type": "Person",
   205	    name: SITE.profile.name,
   206	    jobTitle: SITE.profile.role,
   207	    url: siteUrl,
   208	    image: `${siteUrl}/images/portrait.jpeg`,
   209	    email: SITE.profile.email,
   210	    address: {
   211	      "@type": "PostalAddress",
   212	      addressLocality: SITE.profile.city,
   213	      addressCountry: "FR",
   214	    },
   215	  },
   216	];
   217	
   218	usePageSeo({
   219	  title: "Simon Jouan — Développeur web freelance & IA",
   220	  description:
   221	    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
   222	  path: "/",
   223	  image: "/images/portrait.jpeg",
   224	  type: "website",
   225	  jsonLd: homeJsonLd,
   226	});
   227	</script>
   228	
   229	<style lang="scss" scoped>
   230	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   231	.home {
   232	  display: block;
   233	}
   234	
   235	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   236	.anim {
   237	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   238	}
   239	
   240	.hero__term-col {
     1	<template>
     2	  <footer class="ftr">
     3	    <div class="ftr__container">
     4	      <div class="ftr__in">
     5	        <div class="ftr__brand-col">
     6	          <NuxtLink to="/" class="ftr__brand">
     7	            <ZIcon name="gem" class="ftr__logo" />
     8	            <b>jouan.ovh</b>
     9	          </NuxtLink>
    10	          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
    11	        </div>
    12	
    13	        <nav class="ftr__col" aria-label="Navigation du pied de page">
    14	          <h2 class="ftr__title">// Navigation</h2>
    15	          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
    16	        </nav>
    17	
    18	        <div class="ftr__col">
    19	          <h2 class="ftr__title">// Projets</h2>
    20	          <template v-for="project in projects" :key="project.name">
    21	            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
    22	              project.name
    23	            }}</ZExternalLink>
    24	            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
    25	          </template>
    26	        </div>
    27	
    28	        <div class="ftr__col">
    29	          <h2 class="ftr__title">// Réseaux</h2>
    30	          <LinkListComponent />
    31	        </div>
    32	      </div>
    33	
    34	      <div class="ftr__bottom">
    35	        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
    36	        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
    37	      </div>
    38	    </div>
    39	  </footer>
    40	</template>
    41	
    42	<script setup lang="ts">
    43	import LinkListComponent from "~/components/LinkListComponent.vue";
    44	import { SITE } from "~/data/site";
    45	
    46	const navItems = [
    47	  { to: "/", label: "Accueil" },
    48	  { to: "/services", label: "Services" },
    49	  { to: "/about", label: "À propos" },
    50	  { to: "/blog", label: "Blog" },
    51	  { to: "/contact", label: "Contact" },
    52	  { to: "/confidentialite", label: "Confidentialité" },
    53	  { to: "/mentions-legales", label: "Mentions légales" },
    54	];
    55	
    56	const profile = SITE.profile;
    57	// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
    58	const projects = SITE.projects;
    59	
    60	const year = new Date().getFullYear();
    61	</script>
    62	
    63	<style lang="scss" scoped>
    64	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
    65	.ftr {
    66	  margin-top: auto;
    67	  background: var(--surface-1);
    68	  border-top: 1px solid var(--border-subtle);
    69	  padding: var(--space-12) 0 var(--space-8);
    70	}
    71	
    72	.ftr__container {
    73	  width: 100%;
    74	  max-width: var(--container-xl);
    75	  margin: 0 auto;
    76	  padding: 0 var(--space-6);
    77	}
    78	
    79	.ftr__in {
    80	  display: flex;
    81	  flex-wrap: wrap;
    82	  gap: var(--space-8);
    83	  align-items: flex-start;
    84	  justify-content: space-between;
    85	}
    86	
    87	.ftr__brand-col {
    88	  max-width: 300px;
    89	}
    90	
    91	.ftr__brand {
    92	  display: inline-flex;
    93	  align-items: center;
    94	  gap: var(--space-2);
    95	  margin-bottom: var(--space-3);
    96	  text-decoration: none;
    97	
    98	  .ftr__logo {
    99	    font-size: 22px;
   100	    color: var(--accent);
   101	  }
   102	
   103	  b {
   104	    font-family: var(--font-mono);
   105	    font-size: var(--fs-md);
   106	    font-weight: var(--fw-bold);
   107	    color: var(--text-strong);
   108	  }
   109	
   110	  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
   111	  &:focus-visible {
   112	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   113	    outline-offset: 2px;
   114	    border-radius: var(--radius-sm);
   115	    box-shadow: var(--ring-accent);
   116	  }
   117	}
   118	
   119	.ftr__tagline {
   120	  margin: 0;
   121	  font-size: var(--fs-sm);
   122	  color: var(--text-muted);
   123	}
   124	
   125	.ftr__col {
   126	  display: flex;
   127	  flex-direction: column;
   128	}
   129	
   130	.ftr__title {
   131	  margin: 0 0 var(--space-3);
   132	  font-family: var(--font-mono);
   133	  font-size: var(--fs-xs);
   134	  font-weight: var(--fw-regular);
   135	  letter-spacing: var(--ls-wider);
   136	  text-transform: uppercase;
   137	  color: var(--text-muted);
   138	}
   139	
   140	.ftr__link {
   141	  display: block;
   142	  padding: var(--space-1) 0;
   143	  font-family: var(--font-mono);
   144	  font-size: var(--fs-sm);
   145	  color: var(--text-body);
   146	  text-decoration: none;
   147	  transition: color var(--dur-fast) var(--ease-standard);
   148	
   149	  &:hover {
   150	    color: var(--accent);
   151	  }
   152	
   153	  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
   154	  &:focus-visible {
   155	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   156	    outline-offset: 2px;
   157	    border-radius: var(--radius-xs);
   158	    box-shadow: var(--ring-accent);
   159	  }
   160	}
   161	
   162	.ftr__bottom {
   163	  display: flex;
   164	  flex-wrap: wrap;
   165	  gap: var(--space-3);
   166	  justify-content: space-between;
   167	  margin-top: var(--space-8);
   168	  padding-top: var(--space-5);
   169	  font-family: var(--font-mono);
   170	  font-size: var(--fs-xs);
   171	
   172	  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
   173	  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
   174	  color: var(--text-muted);
   175	  border-top: 1px solid var(--border-subtle);
   176	}
   177	
   178	.ftr__cmd {
   179	  color: var(--term-green);
   180	}
     1	import { SITE } from "~/data/site";
     2	import type { IProgram } from "~/components/terminal/interfaces";
     3	
     4	// Projets — source unique `app/data/site.ts`. Rendu en `<ul>` (cohérent avec `help`/`system-info`) :
     5	// les `<li>` portent les retours à la ligne sous `white-space: normal`.
     6	const projets: IProgram = {
     7	  command: "projets",
     8	  description: "Mes projets.",
     9	  run: function (): string {
    10	    const items = SITE.projects
    11	      .map((p) => {
    12	        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";
    13	        return `<li>${p.name} — ${p.role} — ${p.desc}${meta}</li>`;
    14	      })
    15	      .join("");
    16	    return `<ul>${items}</ul>`;
    17	  },
    18	};
    19	
    20	export default projets;

exec
/bin/zsh -lc "nl -ba app/components/ui/ZCard.vue 2>/dev/null || true; rg -n \"defineProps|as|href|component|NuxtLink|ZExternalLink|interactive\" app/components/ui app/components/card app -g '*.vue' | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <component
     3	    :is="as"
     4	    v-bind="rootAttrs"
     5	    class="zcard"
     6	    :class="{
     7	      'zcard--pad': padded,
     8	      'zcard--interactive': interactive,
     9	      'zcard--accent': accent,
    10	      'zcard--featured': featured,
    11	    }"
    12	  >
    13	    <slot />
    14	  </component>
    15	</template>
    16	
    17	<script setup lang="ts">
    18	// Primitive carte du DS — surface discrète, le contenu est le héros.
    19	// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
    20	// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
    21	import type { Component } from "vue";
    22	import { computed, useAttrs } from "vue";
    23	
    24	defineOptions({
    25	  inheritAttrs: false,
    26	});
    27	
    28	interface Props {
    29	  /** Hover lift + bordure plus claire. @default false */
    30	  interactive?: boolean;
    31	  /** Barre d'accent orange→aubergine en haut. @default false */
    32	  accent?: boolean;
    33	  /** Anneau de glow orange (offre mise en avant). @default false */
    34	  featured?: boolean;
    35	  /** Padding interne `--space-6`. @default true */
    36	  padded?: boolean;
    37	  /** Élément rendu (polymorphe). @default "div" */
    38	  as?: string | Component;
    39	}
    40	
    41	const props = withDefaults(defineProps<Props>(), {
    42	  interactive: false,
    43	  accent: false,
    44	  featured: false,
    45	  padded: true,
    46	  as: "div",
    47	});
    48	
    49	const attrs = useAttrs();
    50	// `as` accepte une balise native ("div", "article") ou une référence de composant
    51	// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
    52	const isNativeButton = computed(() => props.as === "button");
    53	const rootAttrs = computed(() => {
    54	  if (!isNativeButton.value) {
    55	    return attrs;
    56	  }
    57	
    58	  return {
    59	    ...attrs,
    60	    type: typeof attrs.type === "string" ? attrs.type : "button",
    61	  };
    62	});
    63	</script>
    64	
    65	<style lang="scss" scoped>
    66	/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
    67	.zcard {
    68	  position: relative;
    69	  overflow: hidden;
    70	  background: var(--bg-card);
    71	  color: var(--text-body);
    72	  border: 1px solid var(--border-subtle);
    73	  border-radius: var(--radius-md);
    74	  box-shadow: var(--shadow-2), var(--shadow-hairline);
    75	  transition:
    76	    border-color var(--dur-base) var(--ease-standard),
    77	    transform var(--dur-base) var(--ease-out),
    78	    box-shadow var(--dur-base) var(--ease-standard);
    79	}
    80	
    81	.zcard--pad {
    82	  padding: var(--space-6);
    83	}
    84	
    85	.zcard--interactive {
    86	  cursor: pointer;
    87	
    88	  &:hover {
    89	    border-color: var(--border-strong);
    90	    transform: translateY(-2px);
    91	    box-shadow: var(--shadow-3), var(--shadow-hairline);
    92	  }
    93	
    94	  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
    95	  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
    96	  // aucun indicateur. Sans effet sur les cartes non focusables (div).
    97	  &:focus-visible {
    98	    // Outline transparent → rendu en couleur système sous forced-colors (où les
    99	    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
   100	    outline: 2px solid transparent;
   101	    outline-offset: 2px;
   102	    box-shadow: var(--ring-accent);
   103	  }
   104	}
   105	
   106	.zcard--accent::before {
   107	  content: "";
   108	  position: absolute;
   109	  inset: 0 0 auto;
   110	  height: 2px;
   111	  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
   112	}
   113	
   114	.zcard--featured {
   115	  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
   116	  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
   117	  border-color: var(--accent-ring);
   118	  box-shadow: var(--glow-accent), var(--shadow-hairline);
   119	}
   120	
   121	@media (prefers-reduced-motion: reduce) {
   122	  .zcard {
   123	    transition: none;
   124	  }
   125	
   126	  .zcard--interactive:hover {
   127	    transform: none;
   128	  }
   129	}
   130	</style>
app/components/card/ZCardFooter.vue:8:import LinkListComponent from "~/components/LinkListComponent.vue";
app/components/card/ZCardFooter.vue:12:  components: { LinkListComponent },
app/components/ui/ZButton.vue:2:  <component
app/components/ui/ZButton.vue:3:    :is="as"
app/components/ui/ZButton.vue:4:    v-bind="passthroughAttrs"
app/components/ui/ZButton.vue:5:    class="zbtn"
app/components/ui/ZButton.vue:6:    :class="[`zbtn--${variant}`, `zbtn--${size}`]"
app/components/ui/ZButton.vue:15:    <span v-if="icon || $slots.icon" class="zbtn__icon">
app/components/ui/ZButton.vue:16:      <component :is="icon" v-if="icon" aria-hidden="true" />
app/components/ui/ZButton.vue:20:    <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
app/components/ui/ZButton.vue:21:      <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
app/components/ui/ZButton.vue:24:  </component>
app/components/ui/ZButton.vue:29:// Porté de docs/design_system/components/core/Button.jsx (pas de copie JS :
app/components/ui/ZButton.vue:50:  as?: string | Component;
app/components/ui/ZButton.vue:55:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZButton.vue:60:  as: "button",
app/components/ui/ZButton.vue:65:// `as` accepte une balise native ("button", "a") ou une référence de composant
app/components/ui/ZButton.vue:66:// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
app/components/ui/ZButton.vue:67:const isNativeButton = computed(() => props.as === "button");
app/components/ui/ZButton.vue:77:const passthroughAttrs = computed(() => {
app/components/ui/ZButton.vue:84:      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
app/components/ui/ZButton.vue:104:/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
app/components/ui/ZButton.vue:129:    background var(--dur-fast) var(--ease-standard),
app/components/ui/ZButton.vue:130:    border-color var(--dur-fast) var(--ease-standard),
app/components/ui/ZButton.vue:131:    color var(--dur-fast) var(--ease-standard),
app/components/ui/ZButton.vue:132:    transform var(--dur-fast) var(--ease-standard);
app/components/ui/ZButton.vue:137:    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
app/components/ui/ZButton.vue:172:  --_fs: var(--fs-base);
app/components/ui/ZButton.vue:244:// Parité a11y avec les autres primitives (ZCard/ZInput/ZTag) : pas de transition
app/components/ui/ZButton.vue:245:// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
app/components/ui/ZButton.vue:246:// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
app/pages/about.vue:2:  <main class="about">
app/pages/about.vue:6:    <section class="section">
app/pages/about.vue:7:      <div class="container">
app/pages/about.vue:8:        <div class="about__grid">
app/pages/about.vue:10:          <div class="about__identity">
app/pages/about.vue:12:            <h1 class="about__name">{{ profile.name }}</h1>
app/pages/about.vue:13:            <p class="about__role">{{ profile.role }}</p>
app/pages/about.vue:14:            <p class="prose about__location">
app/pages/about.vue:15:              <ZIcon name="pin" class="about__pin" />
app/pages/about.vue:18:            <div class="about__cta">
app/pages/about.vue:19:              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue:24:          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
app/pages/about.vue:25:          <div class="about__bio">
app/pages/about.vue:26:            <h2 class="eyebrow">// à propos</h2>
app/pages/about.vue:27:            <p class="prose about__para">
app/pages/about.vue:29:              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
app/pages/about.vue:32:            <p class="prose about__para">
app/pages/about.vue:34:              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
app/pages/about.vue:40:            <div class="about__stack">
app/pages/about.vue:41:              <h2 class="eyebrow eyebrow--muted">// stack</h2>
app/pages/about.vue:42:              <ul class="hero__tags">
app/pages/about.vue:55:    <section class="section section--sunken">
app/pages/about.vue:56:      <div class="container">
app/pages/about.vue:57:        <div class="about__cv">
app/pages/about.vue:61:            <h2 class="eyebrow">// expériences</h2>
app/pages/about.vue:62:            <ol class="tl">
app/pages/about.vue:63:              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
app/pages/about.vue:64:                <div class="tl__date">{{ xp.date }}</div>
app/pages/about.vue:65:                <div class="tl__role">{{ xp.role }}</div>
app/pages/about.vue:66:                <div class="tl__org">{{ xp.org }}</div>
app/pages/about.vue:67:                <div class="tl__desc">{{ xp.desc }}</div>
app/pages/about.vue:74:            <h2 class="eyebrow">// formation</h2>
app/pages/about.vue:75:            <ul class="about__degrees">
app/pages/about.vue:78:                  <div class="tl__date">{{ degree.date }}</div>
app/pages/about.vue:79:                  <div class="about__degree-name">{{ degree.name }}</div>
app/pages/about.vue:80:                  <div class="tl__org">{{ degree.school }}</div>
app/pages/about.vue:96:import { NuxtLink } from "#components";
app/pages/about.vue:116:    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
app/pages/about.vue:128:  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
app/pages/about.vue:164:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
app/pages/about.vue:166:// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/about.vue:173:// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
app/pages/about.vue:224:  &:last-child {
app/pages/about.vue:228:  // Emphases sur les technologies (porté des <strong> d'About.jsx).
app/pages/about.vue:234:  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
app/pages/about.vue:245:    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
app/pages/about.vue:256:// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
app/pages/about.vue:269:// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
app/pages/about.vue:273:// (left:5px sur .tl), les deux centres n'étant pas sur le même axe.
app/pages/about.vue:304:// (le ::before est positionné par rapport à .tl__item, pas à .tl).
app/pages/about.vue:327:  // (pureté tokens, delta 2px imperceptible) — pas de token d'espacement à 2px.
app/components/card/ZCardBody.vue:2:  <section class="content">
app/components/card/ZCardBody.vue:15:@use "assets/scss/abstract/animations";
app/components/card/ZCardBody.vue:29:    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
app/components/ui/ZBadge.vue:2:  <span class="zbadge" :class="`zbadge--${tone}`">
app/components/ui/ZBadge.vue:3:    <span v-if="dot" class="zbadge__dot" aria-hidden="true" />
app/components/ui/ZBadge.vue:10:// Porté de docs/design_system/components/core/Badge.jsx (CSS en <style scoped>, prerender-safe).
app/components/ui/ZBadge.vue:19:withDefaults(defineProps<Props>(), {
app/components/ui/ZBadge.vue:26:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Badge.jsx */
app/components/card/ZCardHeader.vue:11:export type ImgDecodingType = "sync" | "async" | "auto";
app/components/card/ZCardHeader.vue:21:    class?: string;
app/components/card/ZCardHeader.vue:30:      type: Object as PropType<ImageInterface>,
app/components/card/ZCardHeader.vue:49:      aspect-ratio: 16/9;
app/components/ui/ZAvatar.vue:2:  <span class="zavatar" :class="[`zavatar--${safeSize}`, { 'zavatar--ring': ring }]">
app/components/ui/ZAvatar.vue:3:    <NuxtImg v-if="showImage" class="zavatar__img" :src="src" :alt="alt" @error="onImageError" />
app/components/ui/ZAvatar.vue:10:// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>
app/components/ui/ZAvatar.vue:14:const avatarSizes = ["sm", "md", "lg", "xl"] as const;
app/components/ui/ZAvatar.vue:31:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZAvatar.vue:59:/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS BEM + variable privée --_sz portée depuis Avatar.jsx */
app/pages/blog/[...slug].vue:2:  <main class="blog-article">
app/pages/blog/[...slug].vue:3:    <section class="section">
app/pages/blog/[...slug].vue:4:      <div class="container">
app/pages/blog/[...slug].vue:5:        <article v-if="page" class="article">
app/pages/blog/[...slug].vue:8:          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>
app/pages/blog/[...slug].vue:11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
app/pages/blog/[...slug].vue:17:          <h1 class="article__title">{{ page.title }}</h1>
app/pages/blog/[...slug].vue:19:          <div class="post__meta article__meta">
app/pages/blog/[...slug].vue:31:            class="article__hero"
app/pages/blog/[...slug].vue:41:          <div class="prose article__prose">
app/pages/blog/[...slug].vue:46:          <div class="article__cta">
app/pages/blog/[...slug].vue:47:            <span class="article__cta-label">Un projet en tête ?</span>
app/pages/blog/[...slug].vue:48:            <ZButton :as="NuxtLink" to="/contact" variant="primary">
app/pages/blog/[...slug].vue:64:import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue:69:// Normalise le chemin (retire le(s) slash(es) final/aux) pour éviter un faux 404
app/pages/blog/[...slug].vue:80:// Erreur adaptée à l'état courant : 500 si la requête de contenu échoue (on ne masque
app/pages/blog/[...slug].vue:81:// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
app/pages/blog/[...slug].vue:92:// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
app/pages/blog/[...slug].vue:163:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
app/pages/blog/[...slug].vue:165:// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/blog/[...slug].vue:211:// Méta : base mono via .post__meta (global) ; ici on ajoute la marge de l'en-tête.
app/pages/blog/[...slug].vue:262:  // Emphase forte = couleur titre (cf. emphases bio /about).
app/pages/blog/[...slug].vue:285:  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
app/pages/blog/[...slug].vue:286:  // garder le titre neutre (couleur héritée, pas de soulignement bleu).
app/pages/blog/[...slug].vue:295:  // désactivé → <pre><code> nu, donc pas de styles inline par token à surcharger.
app/pages/blog/[...slug].vue:344:  :deep(blockquote p:last-child) {
app/components/ui/ZIcon.vue:4:    class="zicon"
app/components/ui/ZIcon.vue:21:// taille en `em`. Choix prerender-safe : set inline (pas de script Lucide CDN qui muterait
app/components/ui/ZIcon.vue:80:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZInput.vue:2:  <div class="zfield" :class="{ 'zfield--error': error }">
app/components/ui/ZInput.vue:3:    <label v-if="label" class="zfield__label" :for="fieldId">
app/components/ui/ZInput.vue:4:      {{ label }}<span v-if="required" class="zfield__req" aria-hidden="true">*</span>
app/components/ui/ZInput.vue:11:      class="ztextarea"
app/components/ui/ZInput.vue:19:    <span v-else class="zinput__wrap">
app/components/ui/ZInput.vue:20:      <span v-if="icon || $slots.icon" class="zinput__icon">
app/components/ui/ZInput.vue:21:        <component :is="icon" v-if="icon" aria-hidden="true" />
app/components/ui/ZInput.vue:27:        class="zinput"
app/components/ui/ZInput.vue:28:        :class="{ 'zinput--has-icon': icon || $slots.icon }"
app/components/ui/ZInput.vue:37:    <span v-if="hint" :id="hintId" class="zfield__hint">{{ hint }}</span>
app/components/ui/ZInput.vue:42:// Primitive champ du DS — label mono uppercase, valeur sans-serif, focus ring orange.
app/components/ui/ZInput.vue:43:// Porté de docs/design_system/components/core/Input.jsx (CSS en <style scoped>, prerender-safe).
app/components/ui/ZInput.vue:55:  /** Label mono uppercase au-dessus du contrôle. */
app/components/ui/ZInput.vue:71:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZInput.vue:106:      return !controlledAttrs.has(key);
app/components/ui/ZInput.vue:123:  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
app/components/ui/ZInput.vue:128:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Input.jsx */
app/components/ui/ZInput.vue:139:  text-transform: uppercase;
app/components/ui/ZInput.vue:155:  font-size: var(--fs-base);
app/components/ui/ZInput.vue:161:    border-color var(--dur-fast) var(--ease-standard),
app/components/ui/ZInput.vue:162:    box-shadow var(--dur-fast) var(--ease-standard);
app/components/ui/ZInput.vue:165:    // Contraste (story 9.2) : remonté d'un palier (--text-faint → --text-muted).
app/components/ui/ZInput.vue:215:.zinput--has-icon {
app/pages/blog/index.vue:2:  <main class="blog">
app/pages/blog/index.vue:3:    <section class="section">
app/pages/blog/index.vue:4:      <div class="container">
app/pages/blog/index.vue:6:        <p class="eyebrow">// ~/blog</p>
app/pages/blog/index.vue:7:        <h1 class="blog__title">Notes de dev</h1>
app/pages/blog/index.vue:8:        <p class="prose blog__subtitle">
app/pages/blog/index.vue:12:        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
app/pages/blog/index.vue:13:        <ul v-if="articles && articles.length" class="blog__list">
app/pages/blog/index.vue:14:          <li v-for="article in articles" :key="article.path" class="blog__item">
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:18:                class="post__thumb"
app/pages/blog/index.vue:26:              <div class="post__body">
app/pages/blog/index.vue:27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
app/pages/blog/index.vue:32:                <h2 class="post__title">{{ article.title }}</h2>
app/pages/blog/index.vue:33:                <p class="post__desc">{{ article.description }}</p>
app/pages/blog/index.vue:34:                <div class="post__meta">
app/pages/blog/index.vue:36:                  <!-- `read` est optionnel : pas de séparateur ni de « de lecture » orphelins. -->
app/pages/blog/index.vue:48:        <ZCard v-else-if="error" class="blog__notice" padded>
app/pages/blog/index.vue:50:            class="blog__notice-img"
app/pages/blog/index.vue:56:          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
app/pages/blog/index.vue:57:          <p class="prose blog__notice-text">
app/pages/blog/index.vue:58:            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
app/pages/blog/index.vue:64:        <ZCard v-else class="blog__notice" padded>
app/pages/blog/index.vue:66:            class="blog__notice-img"
app/pages/blog/index.vue:72:          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
app/pages/blog/index.vue:73:          <p class="prose blog__notice-text">
app/pages/blog/index.vue:85:// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
app/pages/blog/index.vue:88:import { NuxtLink } from "#components";
app/pages/blog/index.vue:155:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
app/pages/blog/index.vue:157:// primitives de layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/blog/index.vue:189:// Carte article = ZCard interactive rendue en lien : grille vignette / contenu.
app/pages/blog/index.vue:227:// .post__meta : primitive globale (base/_layout.scss), partagée avec la vue article.
app/components/ui/ZCard.vue:2:  <component
app/components/ui/ZCard.vue:3:    :is="as"
app/components/ui/ZCard.vue:5:    class="zcard"
app/components/ui/ZCard.vue:6:    :class="{
app/components/ui/ZCard.vue:8:      'zcard--interactive': interactive,
app/components/ui/ZCard.vue:14:  </component>
app/components/ui/ZCard.vue:19:// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
app/components/ui/ZCard.vue:30:  interactive?: boolean;
app/components/ui/ZCard.vue:38:  as?: string | Component;
app/components/ui/ZCard.vue:41:const props = withDefaults(defineProps<Props>(), {
app/components/ui/ZCard.vue:42:  interactive: false,
app/components/ui/ZCard.vue:46:  as: "div",
app/components/ui/ZCard.vue:50:// `as` accepte une balise native ("div", "article") ou une référence de composant
app/components/ui/ZCard.vue:51:// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
app/components/ui/ZCard.vue:52:const isNativeButton = computed(() => props.as === "button");
app/components/ui/ZCard.vue:66:/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
app/components/ui/ZCard.vue:76:    border-color var(--dur-base) var(--ease-standard),
app/components/ui/ZCard.vue:77:    transform var(--dur-base) var(--ease-out),
app/components/ui/ZCard.vue:78:    box-shadow var(--dur-base) var(--ease-standard);
app/components/ui/ZCard.vue:85:.zcard--interactive {
app/components/ui/ZCard.vue:95:  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
app/components/ui/ZCard.vue:126:  .zcard--interactive:hover {
app/components/ui/ZTag.vue:4:    class="ztag"
app/components/ui/ZTag.vue:5:    :class="{ 'ztag--plain': !hash, 'ztag--clickable': isClickable }"
app/components/ui/ZTag.vue:13:    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
app/components/ui/ZTag.vue:21:// Porté de docs/design_system/components/core/Tag.jsx (CSS en <style scoped>, prerender-safe).
app/components/ui/ZTag.vue:32:  hash?: boolean;
app/components/ui/ZTag.vue:35:withDefaults(defineProps<Props>(), {
app/components/ui/ZTag.vue:36:  hash: true,
app/components/ui/ZTag.vue:47:function hasListener(name: "onClick" | "onRemove") {
app/components/ui/ZTag.vue:52:const isClickable = computed(() => hasListener("onClick"));
app/components/ui/ZTag.vue:53:const isRemovable = computed(() => hasListener("onRemove"));
app/components/ui/ZTag.vue:107:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Tag.jsx */
app/components/ui/ZTag.vue:125:    border-color var(--dur-fast) var(--ease-standard),
app/components/ui/ZTag.vue:126:    color var(--dur-fast) var(--ease-standard);
app/pages/services.vue:2:  <main class="services">
app/pages/services.vue:4:    <section class="section">
app/pages/services.vue:5:      <div class="container">
app/pages/services.vue:6:        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
app/pages/services.vue:7:        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
app/pages/services.vue:8:        <p class="prose services__intro">
app/pages/services.vue:9:          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
app/pages/services.vue:13:        <ul class="grid-3">
app/pages/services.vue:15:            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
app/pages/services.vue:16:              <div v-if="offer.featured" class="offer__badge">
app/pages/services.vue:19:              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
app/pages/services.vue:20:              <h2 class="offer__title">{{ offer.title }}</h2>
app/pages/services.vue:21:              <p class="offer__desc">{{ offer.desc }}</p>
app/pages/services.vue:22:              <ul class="offer__points">
app/pages/services.vue:25:              <div class="offer__price">
app/pages/services.vue:28:              <div class="offer__cta">
app/pages/services.vue:30:                  :as="NuxtLink"
app/pages/services.vue:34:                  class="offer__btn"
app/pages/services.vue:46:    <section class="section section--sunken">
app/pages/services.vue:47:      <div class="container">
app/pages/services.vue:48:        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
app/pages/services.vue:49:        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
app/pages/services.vue:51:        <ol class="process">
app/pages/services.vue:52:          <li v-for="step in steps" :key="step.n" class="process__step">
app/pages/services.vue:53:            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
app/pages/services.vue:54:            <h3 class="process__step-title">{{ step.title }}</h3>
app/pages/services.vue:55:            <p class="prose process__desc">{{ step.desc }}</p>
app/pages/services.vue:59:        <div class="process__cta">
app/pages/services.vue:60:          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue:73:import { NuxtLink } from "#components";
app/pages/services.vue:90:// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
app/pages/services.vue:122:// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
app/pages/services.vue:175:/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
app/pages/services.vue:181:// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/services.vue:214:// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
app/pages/services.vue:235:  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
app/pages/services.vue:281:  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
app/components/ui/ZExternalLink.vue:2:  <a :href="href" :rel="computedRel" target="_blank">
app/components/ui/ZExternalLink.vue:4:    <span class="screen-reader-text">{{ computedSrText }}</span>
app/components/ui/ZExternalLink.vue:16:  href: string;

exec
/bin/zsh -lc "nl -ba app/components/ui/ZExternalLink.vue | sed -n '1,180p'; nl -ba app/components/ui/ZCard.vue | sed -n '1,150p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <a :href="href" :rel="computedRel" target="_blank">
     3	    <slot />
     4	    <span class="screen-reader-text">{{ computedSrText }}</span>
     5	  </a>
     6	</template>
     7	
     8	<script setup lang="ts">
     9	// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" garanti),
    10	// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
    11	// (Story 10.3 — WCAG G201 / FR13).
    12	import { computed } from "vue";
    13	
    14	interface Props {
    15	  /** URL externe cible. */
    16	  href: string;
    17	  /**
    18	   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
    19	   * Peut être étendu à "noopener noreferrer" si nécessaire. "noopener" reste garanti.
    20	   * @default "noopener"
    21	   */
    22	  rel?: string;
    23	  /** Libellé accessible alternatif pour l'annonce sr-only. */
    24	  srText?: string;
    25	}
    26	
    27	const DEFAULT_SR_TEXT = " (ouvre dans un nouvel onglet)";
    28	
    29	const props = withDefaults(defineProps<Props>(), {
    30	  rel: "noopener",
    31	  srText: DEFAULT_SR_TEXT,
    32	});
    33	
    34	const computedRel = computed(() => {
    35	  const custom = props.rel?.trim();
    36	  if (!custom) {
    37	    return "noopener";
    38	  }
    39	  const tokens = new Set(custom.split(/\s+/));
    40	  tokens.add("noopener");
    41	  return Array.from(tokens).join(" ");
    42	});
    43	
    44	const computedSrText = computed(() => {
    45	  return props.srText && props.srText.trim() ? props.srText : DEFAULT_SR_TEXT;
    46	});
    47	</script>
     1	<template>
     2	  <component
     3	    :is="as"
     4	    v-bind="rootAttrs"
     5	    class="zcard"
     6	    :class="{
     7	      'zcard--pad': padded,
     8	      'zcard--interactive': interactive,
     9	      'zcard--accent': accent,
    10	      'zcard--featured': featured,
    11	    }"
    12	  >
    13	    <slot />
    14	  </component>
    15	</template>
    16	
    17	<script setup lang="ts">
    18	// Primitive carte du DS — surface discrète, le contenu est le héros.
    19	// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
    20	// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
    21	import type { Component } from "vue";
    22	import { computed, useAttrs } from "vue";
    23	
    24	defineOptions({
    25	  inheritAttrs: false,
    26	});
    27	
    28	interface Props {
    29	  /** Hover lift + bordure plus claire. @default false */
    30	  interactive?: boolean;
    31	  /** Barre d'accent orange→aubergine en haut. @default false */
    32	  accent?: boolean;
    33	  /** Anneau de glow orange (offre mise en avant). @default false */
    34	  featured?: boolean;
    35	  /** Padding interne `--space-6`. @default true */
    36	  padded?: boolean;
    37	  /** Élément rendu (polymorphe). @default "div" */
    38	  as?: string | Component;
    39	}
    40	
    41	const props = withDefaults(defineProps<Props>(), {
    42	  interactive: false,
    43	  accent: false,
    44	  featured: false,
    45	  padded: true,
    46	  as: "div",
    47	});
    48	
    49	const attrs = useAttrs();
    50	// `as` accepte une balise native ("div", "article") ou une référence de composant
    51	// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
    52	const isNativeButton = computed(() => props.as === "button");
    53	const rootAttrs = computed(() => {
    54	  if (!isNativeButton.value) {
    55	    return attrs;
    56	  }
    57	
    58	  return {
    59	    ...attrs,
    60	    type: typeof attrs.type === "string" ? attrs.type : "button",
    61	  };
    62	});
    63	</script>
    64	
    65	<style lang="scss" scoped>
    66	/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
    67	.zcard {
    68	  position: relative;
    69	  overflow: hidden;
    70	  background: var(--bg-card);
    71	  color: var(--text-body);
    72	  border: 1px solid var(--border-subtle);
    73	  border-radius: var(--radius-md);
    74	  box-shadow: var(--shadow-2), var(--shadow-hairline);
    75	  transition:
    76	    border-color var(--dur-base) var(--ease-standard),
    77	    transform var(--dur-base) var(--ease-out),
    78	    box-shadow var(--dur-base) var(--ease-standard);
    79	}
    80	
    81	.zcard--pad {
    82	  padding: var(--space-6);
    83	}
    84	
    85	.zcard--interactive {
    86	  cursor: pointer;
    87	
    88	  &:hover {
    89	    border-color: var(--border-strong);
    90	    transform: translateY(-2px);
    91	    box-shadow: var(--shadow-3), var(--shadow-hairline);
    92	  }
    93	
    94	  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
    95	  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
    96	  // aucun indicateur. Sans effet sur les cartes non focusables (div).
    97	  &:focus-visible {
    98	    // Outline transparent → rendu en couleur système sous forced-colors (où les
    99	    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
   100	    outline: 2px solid transparent;
   101	    outline-offset: 2px;
   102	    box-shadow: var(--ring-accent);
   103	  }
   104	}
   105	
   106	.zcard--accent::before {
   107	  content: "";
   108	  position: absolute;
   109	  inset: 0 0 auto;
   110	  height: 2px;
   111	  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
   112	}
   113	
   114	.zcard--featured {
   115	  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
   116	  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
   117	  border-color: var(--accent-ring);
   118	  box-shadow: var(--glow-accent), var(--shadow-hairline);
   119	}
   120	
   121	@media (prefers-reduced-motion: reduce) {
   122	  .zcard {
   123	    transition: none;
   124	  }
   125	
   126	  .zcard--interactive:hover {
   127	    transform: none;
   128	  }
   129	}
   130	</style>

exec
/bin/zsh -lc "rg -n -C 4 \"\\.home|hero__grad|z-index|background: var\\(--bg-page\\)|background-color|body\" app/assets/scss app/pages/index.vue | sed -n '1,300p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue-2-  <main class="home">
app/pages/index.vue-3-    <HomeAtmosComponent />
app/pages/index.vue-4-    <ZCustomCursor />
app/pages/index.vue-5-
app/pages/index.vue:6:    <section class="hero hero__grad">
app/pages/index.vue-7-      <div class="hero__in container">
app/pages/index.vue-8-        <div class="hero__grid">
app/pages/index.vue-9-          <!-- Colonne gauche : accroche, CTA, tags -->
app/pages/index.vue-10-          <div class="anim hero__text">
--
app/pages/index.vue-36-                </span>
app/pages/index.vue-37-                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
app/pages/index.vue-38-              </div>
app/pages/index.vue-39-
app/pages/index.vue:40:              <div class="hero-term__body">
app/pages/index.vue-41-                <template v-for="row in terminalRows" :key="row.id">
app/pages/index.vue-42-                  <p class="hero-term__line" aria-hidden="true">
app/pages/index.vue-43-                    <span class="prm"
app/pages/index.vue-44-                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
--
app/pages/index.vue-227-</script>
app/pages/index.vue-228-
app/pages/index.vue-229-<style lang="scss" scoped>
app/pages/index.vue-230-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
app/pages/index.vue:231:.home {
app/pages/index.vue-232-  display: block;
app/pages/index.vue-233-}
app/pages/index.vue-234-
app/pages/index.vue-235-// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
--
app/pages/index.vue-242-  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
app/pages/index.vue-243-  animation-delay: 80ms;
app/pages/index.vue-244-}
app/pages/index.vue-245-
app/pages/index.vue:246:// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
app/pages/index.vue-247-.hero {
app/pages/index.vue-248-  position: relative;
app/pages/index.vue-249-  overflow: hidden;
app/pages/index.vue-250-}
app/pages/index.vue-251-
app/pages/index.vue:252:.hero__grad {
app/pages/index.vue-253-  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
app/pages/index.vue-254-  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
app/pages/index.vue:255:  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
app/pages/index.vue-256-  background:
app/pages/index.vue-257-    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue-258-    radial-gradient(
app/pages/index.vue-259-      700px 500px at 0% 110%,
--
app/pages/index.vue-264-}
app/pages/index.vue-265-
app/pages/index.vue-266-.hero__in {
app/pages/index.vue-267-  position: relative;
app/pages/index.vue:268:  z-index: 1;
app/pages/index.vue-269-
app/pages/index.vue-270-  // padding-block uniquement : le gutter horizontal vient de .container
app/pages/index.vue-271-  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
app/pages/index.vue-272-  padding-block: var(--space-20);
--
app/pages/index.vue-301-  margin: var(--space-5) 0 var(--space-6);
app/pages/index.vue-302-  font-family: var(--font-sans);
app/pages/index.vue-303-  font-size: var(--fs-lg);
app/pages/index.vue-304-  line-height: var(--lh-relaxed);
app/pages/index.vue:305:  color: var(--text-body);
app/pages/index.vue-306-}
app/pages/index.vue-307-
app/pages/index.vue-308-.hero__cta {
app/pages/index.vue-309-  display: flex;
--
app/pages/index.vue-376-  text-align: center;
app/pages/index.vue-377-  pointer-events: none;
app/pages/index.vue-378-}
app/pages/index.vue-379-
app/pages/index.vue:380:.hero-term__body {
app/pages/index.vue-381-  flex: 1;
app/pages/index.vue-382-  min-height: 0;
app/pages/index.vue-383-  padding: var(--space-4);
app/pages/index.vue-384-  overflow: auto;
--
app/pages/index.vue-390-  overflow-wrap: break-word;
app/pages/index.vue-391-}
app/pages/index.vue-392-
app/pages/index.vue-393-@supports (backdrop-filter: blur(5px)) {
app/pages/index.vue:394:  .hero-term__body {
app/pages/index.vue-395-    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/pages/index.vue-396-    backdrop-filter: blur(5px);
app/pages/index.vue-397-  }
app/pages/index.vue-398-}
--
app/pages/index.vue-532-  margin: 0 0 var(--space-4);
app/pages/index.vue-533-  font-family: var(--font-sans);
app/pages/index.vue-534-  font-size: var(--fs-sm);
app/pages/index.vue-535-  line-height: var(--lh-relaxed);
app/pages/index.vue:536:  color: var(--text-body);
app/pages/index.vue-537-}
app/pages/index.vue-538-
app/pages/index.vue-539-.offer__more {
app/pages/index.vue-540-  margin-top: auto;
--
app/assets/scss/base/_layout.scss-53-// Texte long-forme : Ubuntu sans, interligne détendu.
app/assets/scss/base/_layout.scss-54-.prose {
app/assets/scss/base/_layout.scss-55-  font-family: var(--font-sans);
app/assets/scss/base/_layout.scss-56-  line-height: var(--lh-relaxed);
app/assets/scss/base/_layout.scss:57:  color: var(--text-body);
app/assets/scss/base/_layout.scss-58-}
app/assets/scss/base/_layout.scss-59-
app/assets/scss/base/_layout.scss-60-// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
app/assets/scss/base/_layout.scss-61-// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
--
app/assets/scss/base/_reset.scss-52-
app/assets/scss/base/_reset.scss-53-/**
app/assets/scss/base/_reset.scss-54- * Remove the margin in all browsers.
app/assets/scss/base/_reset.scss-55- */
app/assets/scss/base/_reset.scss:56:body {
app/assets/scss/base/_reset.scss-57-  margin: 0;
app/assets/scss/base/_reset.scss-58-}
app/assets/scss/base/_reset.scss-59-
app/assets/scss/base/_reset.scss-60-/**
--
app/assets/scss/base/_reset.scss-101-/**
app/assets/scss/base/_reset.scss-102- * Remove the gray background on active links in IE 10.
app/assets/scss/base/_reset.scss-103- */
app/assets/scss/base/_reset.scss-104-a {
app/assets/scss/base/_reset.scss:105:  background-color: transparent;
app/assets/scss/base/_reset.scss-106-}
app/assets/scss/base/_reset.scss-107-
app/assets/scss/base/_reset.scss-108-/**
app/assets/scss/base/_reset.scss-109- * 1. Remove the bottom border in Chrome 57-
--
app/assets/scss/base/_reset.scss-375-
app/assets/scss/base/_reset.scss-376-/* Base dark-first : fond sombre par défaut (tokens DS, story 2.1).
app/assets/scss/base/_reset.scss-377-   Neutralise l'ancien `background: #fff` du reset (incompatible dark-first). */
app/assets/scss/base/_reset.scss-378-html {
app/assets/scss/base/_reset.scss:379:  background: var(--bg-page);
app/assets/scss/base/_reset.scss-380-}
app/assets/scss/base/_reset.scss-381-
app/assets/scss/base/_reset.scss:382:body {
app/assets/scss/base/_reset.scss:383:  background: var(--bg-page);
app/assets/scss/base/_reset.scss:384:  color: var(--text-body);
app/assets/scss/base/_reset.scss-385-}
app/assets/scss/base/_reset.scss-386-
app/assets/scss/base/_reset.scss-387-hr {
app/assets/scss/base/_reset.scss:388:  background-color: #ccc;
app/assets/scss/base/_reset.scss-389-  border: 0;
app/assets/scss/base/_reset.scss-390-  height: 1px;
app/assets/scss/base/_reset.scss-391-  margin-bottom: 1.5rem;
app/assets/scss/base/_reset.scss-392-}
--
app/assets/scss/base/_reset.scss-571-  overflow-wrap: normal !important;
app/assets/scss/base/_reset.scss-572-}
app/assets/scss/base/_reset.scss-573-
app/assets/scss/base/_reset.scss-574-.screen-reader-text:focus {
app/assets/scss/base/_reset.scss:575:  background-color: #f1f1f1;
app/assets/scss/base/_reset.scss-576-  border-radius: 3px;
app/assets/scss/base/_reset.scss-577-  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
app/assets/scss/base/_reset.scss-578-  clip-path: none;
app/assets/scss/base/_reset.scss-579-  color: #21759b;
--
app/assets/scss/base/_reset.scss-586-  padding: 15px 23px 14px;
app/assets/scss/base/_reset.scss-587-  text-decoration: none;
app/assets/scss/base/_reset.scss-588-  top: 5px;
app/assets/scss/base/_reset.scss-589-  width: auto;
app/assets/scss/base/_reset.scss:590:  z-index: 100000;
app/assets/scss/base/_reset.scss-591-}
app/assets/scss/base/_reset.scss-592-
app/assets/scss/base/_reset.scss-593-/* Do not show the outline on the skip link target. */
app/assets/scss/base/_reset.scss-594-#primary[tabindex="-1"]:focus {
--
app/assets/scss/components/_card.scss-65-  --card-color-text: var(--color-text);
app/assets/scss/components/_card.scss-66-  --card-color-text-hover: var(--color-text-hover);
app/assets/scss/components/_card.scss-67-  --card-color-text-active: var(--color-text-active);
app/assets/scss/components/_card.scss-68-
app/assets/scss/components/_card.scss:69:  background-color: var(--card-color-background);
app/assets/scss/components/_card.scss-70-  color: var(--card-color-text);
app/assets/scss/components/_card.scss-71-  border: 1px solid var(--card-color-border);
app/assets/scss/components/_card.scss-72-  border-radius: var(--card-border-radius);
app/assets/scss/components/_card.scss-73-  padding: var(--card-space-inset);
--
app/assets/scss/components/_button.scss-97-  user-select: none;
app/assets/scss/components/_button.scss-98-  border: 1px solid;
app/assets/scss/components/_button.scss-99-  border-radius: var(--btn-border-radius);
app/assets/scss/components/_button.scss-100-  transition: color 0.15s ease-in-out, background 0.15s ease-in-out, border-color 0.15s ease-in-out;
app/assets/scss/components/_button.scss:101:  background-color: var(--btn-color-background);
app/assets/scss/components/_button.scss-102-  color: var(--btn-color-text);
app/assets/scss/components/_button.scss-103-  border-color: var(--btn-color-border);
app/assets/scss/components/_button.scss-104-
app/assets/scss/components/_button.scss-105-  &:hover,
app/assets/scss/components/_button.scss-106-  &:focus {
app/assets/scss/components/_button.scss:107:    background-color: var(--btn-color-background-hover);
app/assets/scss/components/_button.scss-108-    color: var(--btn-color-text-hover);
app/assets/scss/components/_button.scss-109-    border-color: var(--btn-color-border-hover);
app/assets/scss/components/_button.scss-110-  }
app/assets/scss/components/_button.scss-111-
app/assets/scss/components/_button.scss-112-  &:active {
app/assets/scss/components/_button.scss:113:    background-color: var(--btn-color-background-hover);
app/assets/scss/components/_button.scss-114-    color: var(--btn-color-text-active);
app/assets/scss/components/_button.scss-115-    border-color: var(--btn-color-border-hover);
app/assets/scss/components/_button.scss-116-  }
app/assets/scss/components/_button.scss-117-
--
app/assets/scss/components/_button.scss-181-    --btn-dark-color-shapes: var(--btn-dark-color-border-hover);
app/assets/scss/components/_button.scss-182-    --btn-dark-color-shapes-hover: var(--btn-dark-color-text-hover);
app/assets/scss/components/_button.scss-183-    --btn-dark-color-shapes-active: var(--btn-dark-color-text-hover);
app/assets/scss/components/_button.scss-184-
app/assets/scss/components/_button.scss:185:    background-color: var(--btn-dark-color-background);
app/assets/scss/components/_button.scss-186-    border: 1px solid var(--btn-dark-color-border);
app/assets/scss/components/_button.scss-187-    color: var(--btn-dark-color-text);
app/assets/scss/components/_button.scss-188-
app/assets/scss/components/_button.scss-189-    &:hover,
app/assets/scss/components/_button.scss-190-    &:focus {
app/assets/scss/components/_button.scss:191:      background-color: var(--btn-dark-color-background-hover);
app/assets/scss/components/_button.scss-192-      border: 1px solid var(--btn-dark-color-border-hover);
app/assets/scss/components/_button.scss-193-      color: var(--btn-dark-color-text-hover);
app/assets/scss/components/_button.scss-194-    }
app/assets/scss/components/_button.scss-195-
--
app/assets/scss/components/_button.scss-218-    --btn-grey-color-text-hover: var(--color-border);
app/assets/scss/components/_button.scss-219-
app/assets/scss/components/_button.scss-220-    // --btn-color-text-active: ;
app/assets/scss/components/_button.scss-221-
app/assets/scss/components/_button.scss:222:    background-color: var(--btn-grey-color-background);
app/assets/scss/components/_button.scss-223-    border: 1px solid var(--btn-grey-color-border);
app/assets/scss/components/_button.scss-224-    color: var(--btn-grey-color-text);
app/assets/scss/components/_button.scss-225-
app/assets/scss/components/_button.scss-226-    &:hover {
app/assets/scss/components/_button.scss:227:      background-color: var(--btn-grey-color-background-hover);
app/assets/scss/components/_button.scss-228-      border: 1px solid var(--btn-grey-color-border-hover);
app/assets/scss/components/_button.scss-229-      color: var(--btn-grey-color-text-hover);
app/assets/scss/components/_button.scss-230-    }
app/assets/scss/components/_button.scss-231-
--
app/assets/scss/abstract/_root.scss-74-  --bg-elevated: var(--surface-3);
app/assets/scss/abstract/_root.scss-75-  --bg-input: var(--surface-4);
app/assets/scss/abstract/_root.scss-76-  --bg-terminal: var(--aubergine-deep);
app/assets/scss/abstract/_root.scss-77-  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss-79-  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss-80-  --text-faint: var(--ink-4);
app/assets/scss/abstract/_root.scss-81-  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss-82-  --border-default: var(--line);
--
app/assets/scss/abstract/_typography.scss-2-@use "variables";
app/assets/scss/abstract/_typography.scss-3-@use "mixin";
app/assets/scss/abstract/_typography.scss-4-@use "space";
app/assets/scss/abstract/_typography.scss-5-
app/assets/scss/abstract/_typography.scss:6:body,
app/assets/scss/abstract/_typography.scss-7-button,
app/assets/scss/abstract/_typography.scss-8-input,
app/assets/scss/abstract/_typography.scss-9-select,
app/assets/scss/abstract/_typography.scss-10-optgroup,
--
app/assets/scss/abstract/_variables.scss-13-// font-size-5x-large  64px   4rem      Header
app/assets/scss/abstract/_variables.scss-14-// font-size-4x-large  48px   3rem      Header
app/assets/scss/abstract/_variables.scss-15-// font-size-3x-large  32px   2rem      Header
app/assets/scss/abstract/_variables.scss-16-// font-size-2x-large  28px   1.75rem   Header
app/assets/scss/abstract/_variables.scss:17:// font-size-x-large   24px   1.5rem    Header, body text
app/assets/scss/abstract/_variables.scss:18:// font-size-large     20px   1.25rem   Header, body text
app/assets/scss/abstract/_variables.scss-19-// font-size-medium    18px   1.125rem  Body text
app/assets/scss/abstract/_variables.scss-20-// font-size-base      16px   1rem      Body text
app/assets/scss/abstract/_variables.scss-21-// font-size-small     14px   0.875rem  Description, caption
app/assets/scss/abstract/_variables.scss-22-// font-size-x-small   12px   0.75rem   Description, caption

exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <main class="home">
     3	    <HomeAtmosComponent />
     4	    <ZCustomCursor />
     5	
     6	    <section class="hero hero__grad">
     7	      <div class="hero__in container">
     8	        <div class="hero__grid">
     9	          <!-- Colonne gauche : accroche, CTA, tags -->
    10	          <div class="anim hero__text">
    11	            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
    12	            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
    13	            <p class="hero__sub">{{ tagline }}</p>
    14	            <div class="hero__cta">
    15	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    16	                Démarrer un projet
    17	                <template #iconRight><ZIcon name="arrow" /></template>
    18	              </ZButton>
    19	              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
    20	            </div>
    21	            <ul class="hero__tags">
    22	              <li v-for="tag in tags" :key="tag">
    23	                <ZTag>{{ tag }}</ZTag>
    24	              </li>
    25	            </ul>
    26	          </div>
    27	
    28	          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
    29	          <div class="anim hero__term-col">
    30	            <div class="hero-term">
    31	              <div class="hero-term__bar">
    32	                <span class="hero-term__dots" aria-hidden="true">
    33	                  <span class="hero-term__dot hero-term__dot--close" />
    34	                  <span class="hero-term__dot hero-term__dot--min" />
    35	                  <span class="hero-term__dot hero-term__dot--max" />
    36	                </span>
    37	                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
    38	              </div>
    39	
    40	              <div class="hero-term__body">
    41	                <template v-for="row in terminalRows" :key="row.id">
    42	                  <p class="hero-term__line" aria-hidden="true">
    43	                    <span class="prm"
    44	                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    45	                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
    46	                      ><span class="prm__cmd">{{ row.cmd }}</span></span
    47	                    >
    48	                  </p>
    49	                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
    50	                </template>
    51	
    52	                <button
    53	                  type="button"
    54	                  class="hero-term__open"
    55	                  aria-label="Ouvrir le terminal interactif"
    56	                  aria-haspopup="dialog"
    57	                  @click="openTerminal"
    58	                >
    59	                  <span class="prm"
    60	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    61	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
    62	                    ><span class="prm__caret" aria-hidden="true"
    63	                  /></span>
    64	                </button>
    65	              </div>
    66	            </div>
    67	          </div>
    68	        </div>
    69	      </div>
    70	    </section>
    71	
    72	    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    73	    <section class="section">
    74	      <div class="container">
    75	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
    76	        <h2 class="section__title">Trois façons de travailler ensemble</h2>
    77	        <ul class="grid-3">
    78	          <li v-for="service in services" :key="service.id">
    79	            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
    80	              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    81	              <h3 class="offer__title">{{ service.title }}</h3>
    82	              <p class="offer__desc">{{ service.desc }}</p>
    83	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    84	                En savoir plus →
    85	              </NuxtLink>
    86	            </ZCard>
    87	          </li>
    88	        </ul>
    89	      </div>
    90	    </section>
    91	
    92	    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    93	    <section class="section section--sunken">
    94	      <div class="container">
    95	        <div class="statrow">
    96	          <div v-for="stat in stats" :key="stat.id" class="stat">
    97	            <b>{{ stat.value }}</b>
    98	            <span>{{ stat.label }}</span>
    99	          </div>
   100	        </div>
   101	
   102	        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
   103	        <ul class="grid-2 projects">
   104	          <li v-for="project in projects" :key="project.name">
   105	            <ZCard
   106	              class="project"
   107	              interactive
   108	              :as="project.url ? ZExternalLink : 'div'"
   109	              :href="project.url || undefined"
   110	              :rel="project.url ? 'noopener noreferrer' : undefined"
   111	            >
   112	              <div class="project__head">
   113	                <h3 class="project__name">{{ project.name }}</h3>
   114	                <span class="project__role">{{ project.role }}</span>
   115	              </div>
   116	              <p class="prose project__desc">{{ project.desc }}</p>
   117	              <ul class="hero__tags">
   118	                <li v-for="tag in project.tags" :key="tag">
   119	                  <ZTag>{{ tag }}</ZTag>
   120	                </li>
   121	              </ul>
   122	            </ZCard>
   123	          </li>
   124	        </ul>
   125	      </div>
   126	    </section>
   127	  </main>
   128	</template>
   129	
   130	<script setup lang="ts">
   131	// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   132	// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   133	// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   134	import { NuxtLink, ZExternalLink } from "#components";
   135	import { useTerminal } from "~/composables/useTerminal";
   136	import { SITE } from "~/data/site";
   137	
   138	// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
   139	const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
   140	const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
   141	
   142	// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   143	// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   144	// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
   145	const services = [
   146	  {
   147	    id: "wordpress",
   148	    icon: "wp",
   149	    title: "WordPress sur-mesure",
   150	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   151	    featured: false,
   152	  },
   153	  {
   154	    id: "apps",
   155	    icon: "code",
   156	    title: "Applications web",
   157	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   158	    featured: true,
   159	  },
   160	  {
   161	    id: "ia",
   162	    icon: "spark",
   163	    title: "IA & automatisation",
   164	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   165	    featured: false,
   166	  },
   167	];
   168	
   169	// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   170	const stats = [
   171	  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   172	  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   173	  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   174	];
   175	
   176	// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   177	const projects = SITE.projects;
   178	
   179	// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
   180	// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
   181	// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
   182	const terminalRows = [
   183	  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
   184	  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
   185	  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
   186	];
   187	
   188	// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
   189	// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
   190	// restylisation du terminal lui-même relève d'Epic 8.
   191	const { open: openTerminal } = useTerminal();
   192	
   193	const siteUrl = useSiteUrl();
   194	const homeJsonLd = [
   195	  {
   196	    "@context": "https://schema.org",
   197	    "@type": "WebSite",
   198	    name: "Simon Jouan — Développeur web freelance",
   199	    url: siteUrl,
   200	    description: tagline,
   201	  },
   202	  {
   203	    "@context": "https://schema.org",
   204	    "@type": "Person",
   205	    name: SITE.profile.name,
   206	    jobTitle: SITE.profile.role,
   207	    url: siteUrl,
   208	    image: `${siteUrl}/images/portrait.jpeg`,
   209	    email: SITE.profile.email,
   210	    address: {
   211	      "@type": "PostalAddress",
   212	      addressLocality: SITE.profile.city,
   213	      addressCountry: "FR",
   214	    },
   215	  },
   216	];
   217	
   218	usePageSeo({
   219	  title: "Simon Jouan — Développeur web freelance & IA",
   220	  description:
   221	    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
   222	  path: "/",
   223	  image: "/images/portrait.jpeg",
   224	  type: "website",
   225	  jsonLd: homeJsonLd,
   226	});
   227	</script>
   228	
   229	<style lang="scss" scoped>
   230	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   231	.home {
   232	  display: block;
   233	}
   234	
   235	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   236	.anim {
   237	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   238	}
   239	
   240	.hero__term-col {
   241	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
   242	  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
   243	  animation-delay: 80ms;
   244	}
   245	
   246	// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
   247	.hero {
   248	  position: relative;
   249	  overflow: hidden;
   250	}
   251	
   252	.hero__grad {
   253	  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
   254	  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
   255	  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
   256	  background:
   257	    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
   258	    radial-gradient(
   259	      700px 500px at 0% 110%,
   260	      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),

exec
/bin/zsh -lc "nl -ba docs/project-context.md | sed -n '50,230p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    50	
    51	- Cible de build = site **STATIQUE** (`nuxi generate`) → tout code doit être
    52	  compatible prerender : pas d'accès `window`/`document` hors `onMounted` ou
    53	  garde `import.meta.client`.
    54	- Pages dans `app/pages/`, layout `app/layouts/default.vue`, auto-import des
    55	  composants activé (pas d'import manuel pour la plupart).
    56	- **Primitives DS sous `app/components/ui/` auto-importées SANS préfixe de dossier**
    57	  (`<ZButton>`, pas `<UiZButton>`) via `components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"]`.
    58	  Le reste de `components/` garde le scan par défaut.
    59	- ⚠️ **Piège `<component :is>` :** un nom de composant passé en _string_
    60	  (`<component :is="'NuxtLink'">`) **ne résout pas** l'auto-import. Importer la
    61	  référence depuis `#components` (`import { NuxtLink } from "#components"`) et la
    62	  passer comme valeur. (Régression rencontrée en story 2.8.)
    63	- Images TOUJOURS via `<NuxtImg>` / `<NuxtPicture>` (@nuxt/image), jamais
    64	  `<img>` brut. Assets statiques dans `public/images/`.
    65	- Blog alimenté par `@nuxt/content` **v3** (markdown sous `content/blog/`) — index
    66	  `app/pages/blog/index.vue`, article `app/pages/blog/[...slug].vue`. Collections **typées
    67	  dans `content.config.ts`** (schéma `blog` : `date` validée ISO via `z.string().regex`,
    68	  `tags`, `read`, `image`). Requêtes via `queryCollection("blog")…` dans `useAsyncData`
    69	  (prerender-safe) ; rendu article via `<ContentRenderer>`. **Coloration Shiki désactivée**
    70	  (`content.build.markdown.highlight: false`) pour imposer la palette terminale du DS —
    71	  ne pas réactiver sans surcharge (sinon styles inline par token écrasant le DS).
    72	- **Formulaire `/contact` (Epic 7)** : envoi via **Web3Forms** (tiers _sans serveur_, site
    73	  reste statique), clé via `runtimeConfig.public.web3formsAccessKey` (env
    74	  `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, cf. `.env.example`). ⚠️ **Sans la clé, l'envoi échoue** —
    75	  la provisionner en env. `$fetch` **client-only** (prerender-safe) + honeypot anti-spam ;
    76	  validation/feedback front. Notice RGPD sous le form + page politique de confidentialité dédiée
    77	  (`/confidentialite`, livrée en story 10.6).
    78	
    79	**SCSS (règle critique)**
    80	
    81	- Système `@use ... as _alias` UNIQUEMENT — jamais `@import` (déprécié).
    82	- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
    83	  (ex. `background: var(--bg-card); border-radius: var(--radius-md);`). Les tokens
    84	  sont exposés sur `:root` par `app/assets/scss/abstract/_root.scss` — source unique
    85	  de vérité (couleurs, typo, espacement, rayons, élévation, motion).
    86	- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
    87	  passe par un token. Si aucun token n'existe pour un besoin légitime (ex. teintes de
    88	  palette syntaxe), commenter explicitement la dérogation.
    89	- **Primitives de layout GLOBALES** : `.section` / `.section--sunken` / `.container` /
    90	  `.eyebrow` (+ `.eyebrow--muted`) / `.prose` / `.hero__tags` vivent dans
    91	  `app/assets/scss/base/_layout.scss` (chargé par `main.scss`). **Les consommer, ne PAS
    92	  les redéclarer en `<style scoped>` par page** (sinon duplication divergente). Si un
    93	  modifieur DS manque, l'ajouter au partiel global, pas en local. (Convention extraite
    94	  en story 5.1 après duplication scoped dans index/services/about.)
    95	- Legacy : certains composants déclarent encore des CSS props locales à partir des
    96	  anciens tokens SCSS `$` (ex. `--header-color-background: #{_color.$dark-background};`).
    97	  Ne pas étendre ce pattern ; migrer vers `var(--token)` lors d'une refonte.
    98	- Styles dans `<style lang="scss" scoped>` par composant. Exceptions Stylelint
    99	  (`:deep`/`:slotted`/`:global`) en `/* stylelint-disable */` **inline et commenté**,
   100	  pas en config globale.
   101	
   102	### Qualité de code & conventions
   103	
   104	**Lint / format**
   105	
   106	- ESLint + Prettier : double quotes, points-virgules, `max-len: 120`.
   107	  `prefer-const` en erreur. Stylelint + `stylelint-scss` pour le SCSS.
   108	- `no-console` / `no-debugger` : warning en production uniquement.
   109	
   110	**Conventions de nommage**
   111	
   112	- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
   113	  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`, `ZExternalLink`) — `<script setup>`,
   114	  auto-importées sans préfixe de dossier.
   115	- Sous-blocs de carte : `app/components/card/` (`ZCardHeader`, `ZCardBody`,
   116	  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
   117	  `ZCardComponent` monolithique a été supprimé en story 2.4.)
   118	- Composants applicatifs legacy : PascalCase suffixé `Component`
   119	  (`HeaderComponent.vue`, `FooterComponent.vue`, `HexagonLinkComponent.vue`…).
   120	- Sous-système terminal sous `components/terminal/` : coquilles Vue
   121	  (`TerminalComponent`, `TerminalManagerComponent`) en **`<script setup>`** (migrées
   122	  Epic 8) ; `programs/` = classes TS implémentant `IProgram`, `interfaces/` =
   123	  contrats (`I*` + barrel `index.ts`).
   124	- Tokens SCSS : fichiers partiels `_nom.scss`, importés en `_alias`
   125	  (ex. `@use "...color" as _color`).
   126	
   127	**Organisation**
   128	
   129	- SCSS structuré en `abstract/` (tokens, mixins, fonctions), `base/` (reset),
   130	  `components/`, `pages/`. Point d'entrée global `assets/scss/main.scss`.
   131	- Copier les SVG/PNG du design system depuis `docs/design_system/assets/` vers
   132	  `public/images/` ou `assets/` lors de l'implémentation.
   133	- **Contenu partagé, URLs & SEO :**
   134	  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
   135	  - Source unique d'URL de base : `app/composables/useSiteUrl.ts` (lit `runtimeConfig.public.siteUrl`, surchargeable via `NUXT_PUBLIC_SITE_URL`). **Ne jamais hardcoder l'URL de domaine** dans le code applicatif.
   136	  - Helper SEO centralisé : `app/composables/usePageSeo.ts` — pose `useSeoMeta`, liens canonicals et JSON-LD Schema.org échappé via `jsonLdScript()`. _(Les `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_
   137	
   138	**Langue**
   139	
   140	- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
   141	  vouvoiement. Pas d'emoji (cf. guidelines du design system).
   142	
   143	### Workflow de développement
   144	
   145	**Git**
   146	
   147	- Branche principale : `main`. Intégration : `develop`. Travail par branches de
   148	  feature (ex. refonte en cours : `feat/design-system-revamp`).
   149	- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).
   150	
   151	**Environnement de dev : Docker (obligatoire)**
   152	
   153	- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
   154	  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
   155	  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
   156	  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
   157	- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
   158	- Commande ponctuelle (lint, typecheck, generate…) :
   159	  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
   160	- Stopper : `docker compose down`.
   161	
   162	**Build & déploiement**
   163	
   164	- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@11.8.0`, lockfile
   165	  `pnpm-lock.yaml`). **Ne JAMAIS utiliser `npm`/`yarn`.**
   166	- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
   167	  « Environnement de dev »), jamais directement sur l'hôte :
   168	  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
   169	- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
   170	  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
   171	- Build statique : `pnpm generate` → sortie `.output/public`.
   172	- Déploiement : automatisé par GitHub Actions (`.github/workflows/cd.yml` via `peaceiris/actions-gh-pages` sur push `main`). Sortie statique avec `CNAME` vérifié.
   173	- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
   174	  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).
   175	
   176	### Tests
   177	
   178	- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
   179	- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
   180	  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
   181	- Si des tests sont introduits pendant la migration, documenter la convention ici.
   182	
   183	### Règles critiques à ne pas manquer
   184	
   185	**Port du design system (React/CSS → Vue/SCSS)**
   186	
   187	- Le design system source (`docs/design_system/`) est en **React + CSS custom
   188	  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
   189	  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
   190	- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
   191	  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
   192	  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
   193	- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
   194	  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
   195	
   196	**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**
   197	
   198	- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
   199	  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
   200	  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
   201	  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
   202	- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
   203	- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
   204	- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
   205	  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
   206	  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
   207	  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
   208	  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
   209	  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
   210	  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
   211	- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
   212	  les traiter en amont (checklist pré-revue dans la consigne de story).
   213	- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
   214	  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
   215	  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
   216	  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
   217	  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
   218	  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
   219	  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).
   220	
   221	**À préserver pendant la refonte**
   222	
   223	- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
   224	  easter-egg à conserver — le design system la garde comme feature secondaire.
   225	- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
   226	  orange Ubuntu comme unique accent héros.
   227	- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
   228	  terminal.
   229	
   230	**Pièges**

codex
Deux écarts se dégagent déjà : les éléments cartes ne portent aucun `data-hot`, et le nouveau SCSS introduit des couleurs littérales malgré la règle token-only. Je lance aussi la gate Docker prescrite et contrôle les consommateurs pour distinguer les défauts réels des simples écarts de documentation.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T16:31:33.874820Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 exited 137 in 30114ms:
 Container jouanovh-web-run-f39823917cc0 Creating 
 Container jouanovh-web-run-f39823917cc0 Created 
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 25.78ms (0 cached, 1 parsed)

 WARN  Payload extraction is recommended for full-static output. You can enable it by setting experimental.payloadExtraction to true or 'client'.

│
●  Nitro preset: static
ℹ Building client...
ℹ vite v7.3.5 building client environment for production...

 WARN  [plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help

ℹ transforming...
Killed
[ELIFECYCLE] Command failed with exit code 137.


exec
/bin/zsh -lc "find .output/public -type f -name 'index.html' -print 2>/dev/null | sort | wc -l; find .output/public -type f -name 'index.html' -print 2>/dev/null | sort | sed -n '1,40p'" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc 'rg -n "''^[+-].*(hsl'"\\(|#[0-9a-fA-F]{3,8}|data-hot|cursor: *none|var\\(--(orange-500|aubergine-vivid|term-red|surface-0)\\))\" docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
       7
.output/public/about/index.html
.output/public/blog/index.html
.output/public/confidentialite/index.html
.output/public/contact/index.html
.output/public/index.html
.output/public/mentions-legales/index.html
.output/public/services/index.html

 succeeded in 0ms:
88:+  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
98:+  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
108:+  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
116:+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
118:+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
125:+  background: repeating-linear-gradient(0deg, hsl(0deg 0% 0% / 18%) 0 1px, transparent 1px 3px);
131:+  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
260:+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
318:+  border: 1px solid hsl(0deg 0% 100% / 70%);
503:-  - [ ] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
533:+  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
566:+   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).

exec
/bin/zsh -lc 'git status --short' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/components/FooterComponent.vue
 A app/components/home/HomeAtmosComponent.vue
 M app/components/terminal/programs/Projets.ts
 A app/components/ui/ZCustomCursor.vue
 M app/data/site.ts
 M app/pages/index.vue
 M docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/11-1/

2026-09-13T16:31:59.589514Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-1/full.diff | sed -n '1,190p;191,360p;361,430p'" in /Users/simon/dev/jouan.ovh
exec
/bin/zsh -lc "nl -ba app/data/site.ts | sed -n '1,150p'; nl -ba app/pages/index.vue | sed -n '130,230p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
     2	index febe415..a583c55 100644
     3	--- a/app/components/FooterComponent.vue
     4	+++ b/app/components/FooterComponent.vue
     5	@@ -7,7 +7,7 @@
     6	             <ZIcon name="gem" class="ftr__logo" />
     7	             <b>jouan.ovh</b>
     8	           </NuxtLink>
     9	-          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
    10	+          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
    11	         </div>
    12	 
    13	         <nav class="ftr__col" aria-label="Navigation du pied de page">
    14	@@ -17,14 +17,12 @@
    15	 
    16	         <div class="ftr__col">
    17	           <h2 class="ftr__title">// Projets</h2>
    18	-          <ZExternalLink
    19	-            v-for="project in projects"
    20	-            :key="project.url"
    21	-            :href="project.url"
    22	-            rel="noopener noreferrer"
    23	-            class="ftr__link"
    24	-            >{{ project.name }}</ZExternalLink
    25	-          >
    26	+          <template v-for="project in projects" :key="project.name">
    27	+            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
    28	+              project.name
    29	+            }}</ZExternalLink>
    30	+            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
    31	+          </template>
    32	         </div>
    33	 
    34	         <div class="ftr__col">
    35	@@ -55,6 +53,7 @@ const navItems = [
    36	   { to: "/mentions-legales", label: "Mentions légales" },
    37	 ];
    38	 
    39	+const profile = SITE.profile;
    40	 // Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
    41	 const projects = SITE.projects;
    42	 
    43	diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
    44	new file mode 100644
    45	index 0000000..b9f7223
    46	--- /dev/null
    47	+++ b/app/components/home/HomeAtmosComponent.vue
    48	@@ -0,0 +1,124 @@
    49	+<template>
    50	+  <div class="atmos" aria-hidden="true">
    51	+    <div class="aurora aurora--auberg" />
    52	+    <div class="aurora aurora--orange" />
    53	+    <div class="aurora aurora--red" />
    54	+    <div class="grid-dots" />
    55	+    <div class="scanlines" />
    56	+    <div class="vignette" />
    57	+  </div>
    58	+</template>
    59	+
    60	+<script setup lang="ts">
    61	+// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
    62	+// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
    63	+</script>
    64	+
    65	+<style lang="scss" scoped>
    66	+/* stylelint-disable selector-class-pattern */
    67	+.atmos {
    68	+  position: fixed;
    69	+  inset: 0;
    70	+  z-index: 0;
    71	+  overflow: hidden;
    72	+  pointer-events: none;
    73	+}
    74	+
    75	+.aurora {
    76	+  position: absolute;
    77	+  border-radius: var(--radius-circle);
    78	+  filter: blur(80px);
    79	+  mix-blend-mode: screen;
    80	+  will-change: transform;
    81	+}
    82	+
    83	+.aurora--orange {
    84	+  top: -22%;
    85	+  left: 48%;
    86	+  width: 60vw;
    87	+  height: 60vw;
    88	+  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
    89	+  opacity: 0.55;
    90	+  animation: drift-orange 26s var(--ease-in-out) infinite;
    91	+}
    92	+
    93	+.aurora--auberg {
    94	+  top: 6%;
    95	+  left: -22%;
    96	+  width: 64vw;
    97	+  height: 64vw;
    98	+  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
    99	+  opacity: 0.7;
   100	+  animation: drift-auberg 32s var(--ease-in-out) infinite;
   101	+}
   102	+
   103	+.aurora--red {
   104	+  top: 44%;
   105	+  left: 26%;
   106	+  width: 44vw;
   107	+  height: 44vw;
   108	+  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
   109	+  opacity: 0.4;
   110	+  animation: drift-red 30s var(--ease-in-out) infinite;
   111	+}
   112	+
   113	+.grid-dots {
   114	+  position: absolute;
   115	+  inset: 0;
   116	+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
   117	+  background-size: 34px 34px;
   118	+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
   119	+}
   120	+
   121	+.scanlines {
   122	+  position: absolute;
   123	+  inset: 0;
   124	+  opacity: 0.35;
   125	+  background: repeating-linear-gradient(0deg, hsl(0deg 0% 0% / 18%) 0 1px, transparent 1px 3px);
   126	+}
   127	+
   128	+.vignette {
   129	+  position: absolute;
   130	+  inset: 0;
   131	+  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
   132	+}
   133	+
   134	+@keyframes drift-orange {
   135	+  0%,
   136	+  100% {
   137	+    transform: translate(0, 0) scale(1);
   138	+  }
   139	+
   140	+  50% {
   141	+    transform: translate(-6vw, 5vh) scale(1.12);
   142	+  }
   143	+}
   144	+
   145	+@keyframes drift-auberg {
   146	+  0%,
   147	+  100% {
   148	+    transform: translate(0, 0) scale(1);
   149	+  }
   150	+
   151	+  50% {
   152	+    transform: translate(7vw, -4vh) scale(1.08);
   153	+  }
   154	+}
   155	+
   156	+@keyframes drift-red {
   157	+  0%,
   158	+  100% {
   159	+    transform: translate(0, 0) scale(1);
   160	+  }
   161	+
   162	+  50% {
   163	+    transform: translate(-4vw, -6vh) scale(1.15);
   164	+  }
   165	+}
   166	+
   167	+@media (prefers-reduced-motion: reduce) {
   168	+  .aurora {
   169	+    animation: none;
   170	+  }
   171	+}
   172	+</style>
   173	diff --git a/app/components/terminal/programs/Projets.ts b/app/components/terminal/programs/Projets.ts
   174	index 9333808..46b4ff8 100644
   175	--- a/app/components/terminal/programs/Projets.ts
   176	+++ b/app/components/terminal/programs/Projets.ts
   177	@@ -7,7 +7,12 @@ const projets: IProgram = {
   178	   command: "projets",
   179	   description: "Mes projets.",
   180	   run: function (): string {
   181	-    const items = SITE.projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");
   182	+    const items = SITE.projects
   183	+      .map((p) => {
   184	+        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";
   185	+        return `<li>${p.name} — ${p.role} — ${p.desc}${meta}</li>`;
   186	+      })
   187	+      .join("");
   188	     return `<ul>${items}</ul>`;
   189	   },
   190	 };
   191	diff --git a/app/components/ui/ZCustomCursor.vue b/app/components/ui/ZCustomCursor.vue
   192	new file mode 100644
   193	index 0000000..c43f680
   194	--- /dev/null
   195	+++ b/app/components/ui/ZCustomCursor.vue
   196	@@ -0,0 +1,142 @@
   197	+<template>
   198	+  <div v-if="isEnabled" aria-hidden="true">
   199	+    <div
   200	+      class="cursor-ring"
   201	+      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
   202	+      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
   203	+    />
   204	+    <div
   205	+      class="cursor-dot"
   206	+      :class="{ 'is-visible': isVisible }"
   207	+      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
   208	+    />
   209	+  </div>
   210	+</template>
   211	+
   212	+<script setup lang="ts">
   213	+import { ref, onMounted, onUnmounted } from "vue";
   214	+
   215	+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
   216	+// Purement décoratif (aria-hidden="true").
   217	+// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
   218	+// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.
   219	+
   220	+const isEnabled = ref(false);
   221	+const isVisible = ref(false);
   222	+const isHot = ref(false);
   223	+
   224	+const dotX = ref(0);
   225	+const dotY = ref(0);
   226	+const ringX = ref(0);
   227	+const ringY = ref(0);
   228	+
   229	+let mouseX = 0;
   230	+let mouseY = 0;
   231	+let currentRingX = 0;
   232	+let currentRingY = 0;
   233	+let rafId: number | null = null;
   234	+
   235	+function updateAnimationLoop() {
   236	+  currentRingX += (mouseX - currentRingX) * 0.18;
   237	+  currentRingY += (mouseY - currentRingY) * 0.18;
   238	+  ringX.value = currentRingX;
   239	+  ringY.value = currentRingY;
   240	+  rafId = requestAnimationFrame(updateAnimationLoop);
   241	+}
   242	+
   243	+function handlePointerMove(e: PointerEvent) {
   244	+  if (!isVisible.value) {
   245	+    isVisible.value = true;
   246	+    currentRingX = e.clientX;
   247	+    currentRingY = e.clientY;
   248	+    ringX.value = e.clientX;
   249	+    ringY.value = e.clientY;
   250	+  }
   251	+  mouseX = e.clientX;
   252	+  mouseY = e.clientY;
   253	+  dotX.value = e.clientX;
   254	+  dotY.value = e.clientY;
   255	+}
   256	+
   257	+function handlePointerOver(e: Event) {
   258	+  const target = e.target as HTMLElement | null;
   259	+  if (!target) return;
   260	+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
   261	+  isHot.value = Boolean(isInteractive);
   262	+}
   263	+
   264	+onMounted(() => {
   265	+  if (!import.meta.client) return;
   266	+
   267	+  const hasHover = window.matchMedia("(hover: hover)").matches;
   268	+  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   269	+
   270	+  if (!hasHover || prefersReducedMotion) {
   271	+    return;
   272	+  }
   273	+
   274	+  isEnabled.value = true;
   275	+  window.addEventListener("pointermove", handlePointerMove, { passive: true });
   276	+  document.addEventListener("pointerover", handlePointerOver, { passive: true });
   277	+  rafId = requestAnimationFrame(updateAnimationLoop);
   278	+});
   279	+
   280	+onUnmounted(() => {
   281	+  if (!import.meta.client) return;
   282	+  window.removeEventListener("pointermove", handlePointerMove);
   283	+  document.removeEventListener("pointerover", handlePointerOver);
   284	+  if (rafId !== null) {
   285	+    cancelAnimationFrame(rafId);
   286	+  }
   287	+});
   288	+</script>
   289	+
   290	+<style lang="scss" scoped>
   291	+/* stylelint-disable selector-class-pattern */
   292	+.cursor-dot,
   293	+.cursor-ring {
   294	+  position: fixed;
   295	+  top: 0;
   296	+  left: 0;
   297	+  z-index: 90;
   298	+  border-radius: var(--radius-circle);
   299	+  mix-blend-mode: difference;
   300	+  opacity: 0;
   301	+  pointer-events: none;
   302	+  transition: opacity var(--dur-base) var(--ease-standard);
   303	+
   304	+  &.is-visible {
   305	+    opacity: 1;
   306	+  }
   307	+}
   308	+
   309	+.cursor-dot {
   310	+  width: 6px;
   311	+  height: 6px;
   312	+  background: var(--ink-1);
   313	+}
   314	+
   315	+.cursor-ring {
   316	+  width: 34px;
   317	+  height: 34px;
   318	+  border: 1px solid hsl(0deg 0% 100% / 70%);
   319	+  transition:
   320	+    width var(--dur-base) var(--ease-out),
   321	+    height var(--dur-base) var(--ease-out),
   322	+    border-color var(--dur-base) var(--ease-out),
   323	+    opacity var(--dur-base) var(--ease-standard);
   324	+
   325	+  &.is-hot {
   326	+    width: 56px;
   327	+    height: 56px;
   328	+    border-color: var(--accent);
   329	+  }
   330	+}
   331	+
   332	+@media (hover: none), (prefers-reduced-motion: reduce) {
   333	+  .cursor-dot,
   334	+  .cursor-ring {
   335	+    display: none;
   336	+  }
   337	+}
   338	+</style>
   339	diff --git a/app/data/site.ts b/app/data/site.ts
   340	index 81fd41d..d87e1d2 100644
   341	--- a/app/data/site.ts
   342	+++ b/app/data/site.ts
   343	@@ -16,54 +16,65 @@ export interface IProfile {
   344	   email: string;
   345	   city: string;
   346	   available: boolean;
   347	+  maltUrl?: string;
   348	 }
   349	 
   350	 export interface IProject {
   351	   name: string;
   352	   role: string;
   353	   desc: string;
   354	-  url: string;
   355	+  url?: string;
   356	+  status?: string;
   357	   tags: string[];
   358	 }
   359	 
   360	 const profile: IProfile = {
   361	   name: "Simon Jouan",
   362	-  role: "Développeur web freelance",
   363	+  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
   364	   email: "simon@jouan.ovh",
   365	-  city: "Valognes, France",
   366	+  city: "Rouen, France",
   367	   available: true,
   368	+  maltUrl: "https://www.malt.fr/profile/simonjouan",
   369	 };
   370	 
   371	-// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
   372	+// Stack technique moderne prioritaire ordonnée.
   373	 const skills: string[] = [
   374	-  "php",
   375	-  "symfony",
   376	-  "wordpress",
   377	-  "node.js",
   378	-  "nest.js",
   379	-  "nuxt.js",
   380	-  "vue",
   381	   "typescript",
   382	+  "nuxt",
   383	+  "vue",
   384	+  "nest.js",
   385	+  "node.js",
   386	+  "postgresql",
   387	+  "typeorm",
   388	+  "stripe",
   389	+  "cypress",
   390	   "docker",
   391	-  "tailwind",
   392	-  "n8n",
   393	-  "mysql",
   394	+  "rest-api",
   395	+  "vitest",
   396	 ];
   397	 
   398	 const projects: IProject[] = [
   399	   {
   400	     name: "keova.app",
   401	-    role: "Fondateur · SaaS",
   402	-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
   403	+    role: "Co-fondateur & Développeur Full Stack",
   404	+    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
   405	     url: "https://keova.app",
   406	-    tags: ["nest.js", "nuxt", "saas"],
   407	+    status: "En production",
   408	+    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
   409	+  },
   410	+  {
   411	+    name: "TryOn",
   412	+    role: "CTO & Développeur Full Stack",
   413	+    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
   414	+    status: "Étude de cas (MVP livré)",
   415	+    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
   416	   },
   417	   {
   418	-    name: "patio-conseil.fr",
   419	-    role: "Client",
   420	-    desc: "Site et outils pour un cabinet de conseil.",
   421	-    url: "https://patio-conseil.fr",
   422	-    tags: ["wordpress", "conseil"],
   423	+    name: "Nodium",
   424	+    role: "Créateur & Ingénieur IA",
   425	+    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
   426	+    status: "R&D / En cours",
   427	+    tags: ["typescript", "electron", "agents", "ia"],
   428	   },
   429	 ];
   430	 

 succeeded in 0ms:
     1	// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
     2	// les composants/programmes ne font que les présenter). Forme portée de
     3	// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
     4	//
     5	// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
     6	// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
     7	//
     8	// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
     9	// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
    10	// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
    11	// `deferred-work.md`, pas un simple refactor.
    12	
    13	export interface IProfile {
    14	  name: string;
    15	  role: string;
    16	  email: string;
    17	  city: string;
    18	  available: boolean;
    19	  maltUrl?: string;
    20	}
    21	
    22	export interface IProject {
    23	  name: string;
    24	  role: string;
    25	  desc: string;
    26	  url?: string;
    27	  status?: string;
    28	  tags: string[];
    29	}
    30	
    31	const profile: IProfile = {
    32	  name: "Simon Jouan",
    33	  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
    34	  email: "simon@jouan.ovh",
    35	  city: "Rouen, France",
    36	  available: true,
    37	  maltUrl: "https://www.malt.fr/profile/simonjouan",
    38	};
    39	
    40	// Stack technique moderne prioritaire ordonnée.
    41	const skills: string[] = [
    42	  "typescript",
    43	  "nuxt",
    44	  "vue",
    45	  "nest.js",
    46	  "node.js",
    47	  "postgresql",
    48	  "typeorm",
    49	  "stripe",
    50	  "cypress",
    51	  "docker",
    52	  "rest-api",
    53	  "vitest",
    54	];
    55	
    56	const projects: IProject[] = [
    57	  {
    58	    name: "keova.app",
    59	    role: "Co-fondateur & Développeur Full Stack",
    60	    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    61	    url: "https://keova.app",
    62	    status: "En production",
    63	    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
    64	  },
    65	  {
    66	    name: "TryOn",
    67	    role: "CTO & Développeur Full Stack",
    68	    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    69	    status: "Étude de cas (MVP livré)",
    70	    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
    71	  },
    72	  {
    73	    name: "Nodium",
    74	    role: "Créateur & Ingénieur IA",
    75	    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    76	    status: "R&D / En cours",
    77	    tags: ["typescript", "electron", "agents", "ia"],
    78	  },
    79	];
    80	
    81	export const SITE = { profile, skills, projects } as const;
   130	<script setup lang="ts">
   131	// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   132	// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   133	// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   134	import { NuxtLink, ZExternalLink } from "#components";
   135	import { useTerminal } from "~/composables/useTerminal";
   136	import { SITE } from "~/data/site";
   137	
   138	// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
   139	const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
   140	const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
   141	
   142	// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   143	// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   144	// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
   145	const services = [
   146	  {
   147	    id: "wordpress",
   148	    icon: "wp",
   149	    title: "WordPress sur-mesure",
   150	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   151	    featured: false,
   152	  },
   153	  {
   154	    id: "apps",
   155	    icon: "code",
   156	    title: "Applications web",
   157	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   158	    featured: true,
   159	  },
   160	  {
   161	    id: "ia",
   162	    icon: "spark",
   163	    title: "IA & automatisation",
   164	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   165	    featured: false,
   166	  },
   167	];
   168	
   169	// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   170	const stats = [
   171	  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   172	  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   173	  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   174	];
   175	
   176	// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   177	const projects = SITE.projects;
   178	
   179	// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
   180	// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
   181	// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
   182	const terminalRows = [
   183	  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
   184	  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
   185	  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
   186	];
   187	
   188	// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
   189	// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
   190	// restylisation du terminal lui-même relève d'Epic 8.
   191	const { open: openTerminal } = useTerminal();
   192	
   193	const siteUrl = useSiteUrl();
   194	const homeJsonLd = [
   195	  {
   196	    "@context": "https://schema.org",
   197	    "@type": "WebSite",
   198	    name: "Simon Jouan — Développeur web freelance",
   199	    url: siteUrl,
   200	    description: tagline,
   201	  },
   202	  {
   203	    "@context": "https://schema.org",
   204	    "@type": "Person",
   205	    name: SITE.profile.name,
   206	    jobTitle: SITE.profile.role,
   207	    url: siteUrl,
   208	    image: `${siteUrl}/images/portrait.jpeg`,
   209	    email: SITE.profile.email,
   210	    address: {
   211	      "@type": "PostalAddress",
   212	      addressLocality: SITE.profile.city,
   213	      addressCountry: "FR",
   214	    },
   215	  },
   216	];
   217	
   218	usePageSeo({
   219	  title: "Simon Jouan — Développeur web freelance & IA",
   220	  description:
   221	    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
   222	  path: "/",
   223	  image: "/images/portrait.jpeg",
   224	  type: "website",
   225	  jsonLd: homeJsonLd,
   226	});
   227	</script>
   228	
   229	<style lang="scss" scoped>
   230	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */

exec
/bin/zsh -lc "nl -ba docs/specs/spec-home-awwwards/SPEC.md | sed -n '24,86p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    24	## Capabilities
    25	
    26	- id: CAP-1
    27	  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
    28	  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
    29	
    30	- id: CAP-2
    31	  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
    32	  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
    33	
    34	- id: CAP-3
    35	  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
    36	  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.
    37	
    38	- id: CAP-4
    39	  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
    40	  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.
    41	
    42	- id: CAP-5
    43	  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
    44	  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
    45	
    46	- id: CAP-6
    47	  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
    48	  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
    49	
    50	- id: CAP-7
    51	  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
    52	  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
    53	
    54	- id: CAP-8
    55	  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
    56	  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
    57	
    58	- id: CAP-9
    59	  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
    60	  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
    61	
    62	- id: CAP-10
    63	  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
    64	  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
    65	
    66	## Constraints
    67	
    68	- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
    69	- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
    70	- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
    71	- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
    72	- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
    73	- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
    74	- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
    75	
    76	## Non-goals
    77	
    78	- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
    79	- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
    80	- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
    81	- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
    82	- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
    83	
    84	## Success signal
    85	
    86	- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

2026-09-13T16:32:08.250588Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "nl -ba app/components/FooterComponent.vue | sed -n '1,100p'; rg -n \"SITE\" app/components/FooterComponent.vue app/components/terminal/programs/Projets.ts app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <footer class="ftr">
     3	    <div class="ftr__container">
     4	      <div class="ftr__in">
     5	        <div class="ftr__brand-col">
     6	          <NuxtLink to="/" class="ftr__brand">
     7	            <ZIcon name="gem" class="ftr__logo" />
     8	            <b>jouan.ovh</b>
     9	          </NuxtLink>
    10	          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
    11	        </div>
    12	
    13	        <nav class="ftr__col" aria-label="Navigation du pied de page">
    14	          <h2 class="ftr__title">// Navigation</h2>
    15	          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
    16	        </nav>
    17	
    18	        <div class="ftr__col">
    19	          <h2 class="ftr__title">// Projets</h2>
    20	          <template v-for="project in projects" :key="project.name">
    21	            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
    22	              project.name
    23	            }}</ZExternalLink>
    24	            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
    25	          </template>
    26	        </div>
    27	
    28	        <div class="ftr__col">
    29	          <h2 class="ftr__title">// Réseaux</h2>
    30	          <LinkListComponent />
    31	        </div>
    32	      </div>
    33	
    34	      <div class="ftr__bottom">
    35	        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
    36	        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
    37	      </div>
    38	    </div>
    39	  </footer>
    40	</template>
    41	
    42	<script setup lang="ts">
    43	import LinkListComponent from "~/components/LinkListComponent.vue";
    44	import { SITE } from "~/data/site";
    45	
    46	const navItems = [
    47	  { to: "/", label: "Accueil" },
    48	  { to: "/services", label: "Services" },
    49	  { to: "/about", label: "À propos" },
    50	  { to: "/blog", label: "Blog" },
    51	  { to: "/contact", label: "Contact" },
    52	  { to: "/confidentialite", label: "Confidentialité" },
    53	  { to: "/mentions-legales", label: "Mentions légales" },
    54	];
    55	
    56	const profile = SITE.profile;
    57	// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
    58	const projects = SITE.projects;
    59	
    60	const year = new Date().getFullYear();
    61	</script>
    62	
    63	<style lang="scss" scoped>
    64	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
    65	.ftr {
    66	  margin-top: auto;
    67	  background: var(--surface-1);
    68	  border-top: 1px solid var(--border-subtle);
    69	  padding: var(--space-12) 0 var(--space-8);
    70	}
    71	
    72	.ftr__container {
    73	  width: 100%;
    74	  max-width: var(--container-xl);
    75	  margin: 0 auto;
    76	  padding: 0 var(--space-6);
    77	}
    78	
    79	.ftr__in {
    80	  display: flex;
    81	  flex-wrap: wrap;
    82	  gap: var(--space-8);
    83	  align-items: flex-start;
    84	  justify-content: space-between;
    85	}
    86	
    87	.ftr__brand-col {
    88	  max-width: 300px;
    89	}
    90	
    91	.ftr__brand {
    92	  display: inline-flex;
    93	  align-items: center;
    94	  gap: var(--space-2);
    95	  margin-bottom: var(--space-3);
    96	  text-decoration: none;
    97	
    98	  .ftr__logo {
    99	    font-size: 22px;
   100	    color: var(--accent);
app/pages/index.vue:136:import { SITE } from "~/data/site";
app/pages/index.vue:138:// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
app/pages/index.vue:177:const projects = SITE.projects;
app/pages/index.vue:205:    name: SITE.profile.name,
app/pages/index.vue:206:    jobTitle: SITE.profile.role,
app/pages/index.vue:209:    email: SITE.profile.email,
app/pages/index.vue:212:      addressLocality: SITE.profile.city,
app/components/FooterComponent.vue:44:import { SITE } from "~/data/site";
app/components/FooterComponent.vue:56:const profile = SITE.profile;
app/components/FooterComponent.vue:58:const projects = SITE.projects;
app/components/terminal/programs/Projets.ts:1:import { SITE } from "~/data/site";
app/components/terminal/programs/Projets.ts:10:    const items = SITE.projects

2026-09-13T16:32:32.963128Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"projects|project\\.url|p\\.url|IProject|profile\\.maltUrl|maltUrl\" app -g '*.{vue,ts}' | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue:103:        <ul class="grid-2 projects">
app/pages/index.vue:104:          <li v-for="project in projects" :key="project.name">
app/pages/index.vue:108:              :as="project.url ? ZExternalLink : 'div'"
app/pages/index.vue:109:              :href="project.url || undefined"
app/pages/index.vue:110:              :rel="project.url ? 'noopener noreferrer' : undefined"
app/pages/index.vue:177:const projects = SITE.projects;
app/pages/index.vue:599:.projects {
app/data/site.ts:19:  maltUrl?: string;
app/data/site.ts:22:export interface IProject {
app/data/site.ts:37:  maltUrl: "https://www.malt.fr/profile/simonjouan",
app/data/site.ts:56:const projects: IProject[] = [
app/data/site.ts:81:export const SITE = { profile, skills, projects } as const;
app/components/FooterComponent.vue:20:          <template v-for="project in projects" :key="project.name">
app/components/FooterComponent.vue:21:            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
app/components/FooterComponent.vue:58:const projects = SITE.projects;
app/components/terminal/programs/Projets.ts:10:    const items = SITE.projects
app/components/terminal/programs/Projets.ts:12:        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";

2026-09-13T16:32:36.417361Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -C 5 \"cursor-dot|cursor-ring|custom cursor|data-hot|cursor: *none|micro-curseur|atmos|aurora|scanline\" docs/design_system docs/specs docs -g '*.{html,css,md,jsx,js,ts,vue,scss}' | sed -n '1,360p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/specs/spec-home-awwwards/sections-mapping.md-22-
docs/specs/spec-home-awwwards/sections-mapping.md-23----
docs/specs/spec-home-awwwards/sections-mapping.md-24-
docs/specs/spec-home-awwwards/sections-mapping.md-25-## 2. Découpage technique et éditorial des blocs
docs/specs/spec-home-awwwards/sections-mapping.md-26-
docs/specs/spec-home-awwwards/sections-mapping.md:27:### A. Pile Atmosphérique (`.atmos`)
docs/specs/spec-home-awwwards/sections-mapping.md:28:- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
docs/specs/spec-home-awwwards/sections-mapping.md:29:- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
docs/specs/spec-home-awwwards/sections-mapping.md-30-- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
docs/specs/spec-home-awwwards/sections-mapping.md-31-
docs/specs/spec-home-awwwards/sections-mapping.md-32-### B. Boot Sequence (`.boot`)
docs/specs/spec-home-awwwards/sections-mapping.md-33-- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
docs/specs/spec-home-awwwards/sections-mapping.md-34-- **Règles :**
--
docs/planning-artifacts/epics.md-45-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/planning-artifacts/epics.md-46-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
docs/planning-artifacts/epics.md-47-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
docs/planning-artifacts/epics.md-48-
docs/planning-artifacts/epics.md-49-#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
docs/planning-artifacts/epics.md:50:FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
docs/planning-artifacts/epics.md-51-FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
docs/planning-artifacts/epics.md-52-FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md-53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md-54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md-55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
docs/planning-artifacts/epics.md-56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/planning-artifacts/epics.md-57-FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
docs/planning-artifacts/epics.md-58-FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
docs/planning-artifacts/epics.md:59:FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
docs/planning-artifacts/epics.md-60-
docs/planning-artifacts/epics.md-61-### NonFunctional Requirements
docs/planning-artifacts/epics.md-62-
docs/planning-artifacts/epics.md-63-NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
docs/planning-artifacts/epics.md-64-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
--
docs/planning-artifacts/epics.md-101-UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
docs/planning-artifacts/epics.md-102-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
docs/planning-artifacts/epics.md-103-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/planning-artifacts/epics.md-104-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/planning-artifacts/epics.md-105-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/planning-artifacts/epics.md:106:UX-DR18: Pile atmosphérique `.atmos` avec 3 calques auroras floutés (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), scanlines CRT et grille de points.
docs/planning-artifacts/epics.md-107-UX-DR19: Composant `BootOverlay` avec montée en charge progressive stylisée `jouan.os`, affichage des étapes, fermeture Escape/clic et mémorisation en session.
docs/planning-artifacts/epics.md-108-UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
docs/planning-artifacts/epics.md-109-UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
docs/planning-artifacts/epics.md-110-UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
docs/planning-artifacts/epics.md-111-UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
docs/planning-artifacts/epics.md-112-UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
docs/planning-artifacts/epics.md:113:UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
docs/planning-artifacts/epics.md-114-
docs/planning-artifacts/epics.md-115-### FR Coverage Map
docs/planning-artifacts/epics.md-116-
docs/planning-artifacts/epics.md-117-FR1: Epic 1 — Migration de la stack vers Nuxt 4
docs/planning-artifacts/epics.md-118-FR2: Epic 2 — Tokens du design system disponibles
--
docs/planning-artifacts/epics.md-129-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/planning-artifacts/epics.md-130-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md-131-FR15: Epic 10 — SEO centralisé site-wide
docs/planning-artifacts/epics.md-132-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
docs/planning-artifacts/epics.md-133-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
docs/planning-artifacts/epics.md:134:FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
docs/planning-artifacts/epics.md-135-FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
docs/planning-artifacts/epics.md-136-FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md-137-FR21: Epic 11 — Marquee infini de la stack moderne ciblée
docs/planning-artifacts/epics.md-138-FR22: Epic 11 — Vitrine des 3 offres de services ciblées
docs/planning-artifacts/epics.md-139-FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
--
docs/planning-artifacts/epics.md-708-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
docs/planning-artifacts/epics.md-709-
docs/planning-artifacts/epics.md-710-### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
docs/planning-artifacts/epics.md-711-
docs/planning-artifacts/epics.md-712-As a visiteur découvrant la page d'accueil,
docs/planning-artifacts/epics.md:713:I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
docs/planning-artifacts/epics.md-714-So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
docs/planning-artifacts/epics.md-715-
docs/planning-artifacts/epics.md-716-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-717-
docs/planning-artifacts/epics.md-718-**Given** le projet en production sur `main` et la nécessité de développer de manière isolée sans régresser la prod
docs/planning-artifacts/epics.md:719:**When** on crée et checkout la branche dédiée `feat/home-awwwards` issue de `develop`, qu'on met à jour `app/data/site.ts` avec le profil Malt (`SITE.profile` rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France » ; `SITE.skills` stack moderne ciblée ; `SITE.projects` avec Keova, TryOn et Nodium), et qu'on intègre le conteneur atmosphérique `.atmos` et le micro-curseur desktop progressif
docs/planning-artifacts/epics.md:720:**Then** l'arrière-plan anime 3 auroras floutées (aubergine, orange, rouge) avec texture scanlines CRT et grille de points en pur CSS fluide, neutralisées sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md:721:**And** le micro-curseur personnalisé (`dot` + `ring`) réagit aux éléments interactifs (`data-hot`), est masqué sous `@media (hover: none)` et sous reduced motion, sans altérer le curseur natif en cas d'erreur JS
docs/planning-artifacts/epics.md-722-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-723-
docs/planning-artifacts/epics.md-724-### Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
docs/planning-artifacts/epics.md-725-
docs/planning-artifacts/epics.md-726-As a prospect technique ou client potentiel,
docs/planning-artifacts/epics.md-727-I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
docs/planning-artifacts/epics.md-728-So that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20).
docs/planning-artifacts/epics.md-729-
docs/planning-artifacts/epics.md-730-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-731-
docs/planning-artifacts/epics.md:732:**Given** la page d'accueil avec son atmosphère en place
docs/planning-artifacts/epics.md-733-**When** on charge la page, l'overlay `BootOverlay` (`jouan.os`) simule la montée en charge système, s'efface automatiquement après 1 à 1.5s ou immédiatement sur clic / touche Escape (mémorisé en `sessionStorage` et zappé sous reduced-motion)
docs/planning-artifacts/epics.md-734-**Then** à la fin du boot, la séquence de frappe du composant terminal hero se déclenche avec caret natif clignotant (commandes `$ whoami`, `$ cat focus.txt`, `$ ls ~/projets`)
docs/planning-artifacts/epics.md-735-**And** le Hero commercial affiche en typographie Ubuntu :
docs/planning-artifacts/epics.md-736-  - Sur-titre `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
docs/planning-artifacts/epics.md-737-  - Titre principal `Développeur Full Stack TypeScript`
--
docs/specs/spec-home-awwwards/sections-mapping.md-22-
docs/specs/spec-home-awwwards/sections-mapping.md-23----
docs/specs/spec-home-awwwards/sections-mapping.md-24-
docs/specs/spec-home-awwwards/sections-mapping.md-25-## 2. Découpage technique et éditorial des blocs
docs/specs/spec-home-awwwards/sections-mapping.md-26-
docs/specs/spec-home-awwwards/sections-mapping.md:27:### A. Pile Atmosphérique (`.atmos`)
docs/specs/spec-home-awwwards/sections-mapping.md:28:- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
docs/specs/spec-home-awwwards/sections-mapping.md:29:- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
docs/specs/spec-home-awwwards/sections-mapping.md-30-- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
docs/specs/spec-home-awwwards/sections-mapping.md-31-
docs/specs/spec-home-awwwards/sections-mapping.md-32-### B. Boot Sequence (`.boot`)
docs/specs/spec-home-awwwards/sections-mapping.md-33-- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
docs/specs/spec-home-awwwards/sections-mapping.md-34-- **Règles :**
--
docs/specs/spec-home-awwwards/.decision-log.md-26-- Les non-goals interdisent expressément le repli vers le one-page à ancres et la dispersion WordPress/PHP en vitrine.
docs/specs/spec-home-awwwards/.decision-log.md-27-- Le signal de succès s'appuie sur la validation par la gate Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
docs/specs/spec-home-awwwards/.decision-log.md-28-
docs/specs/spec-home-awwwards/.decision-log.md-29-**Pass 2 — Préservation :**
docs/specs/spec-home-awwwards/.decision-log.md-30-- Toutes les exigences de `direction_strategique_site.md` et de `contexte_malt.md` sont couvertes sans déperdition : le rôle, la stack ordonnée, les 3 services, les 3 projets SaaS, l'expérience Kidizz, le lien vers Malt et les CTAs orientés mission.
docs/specs/spec-home-awwwards/.decision-log.md:31:- Les composants visuels et interactifs de `Home - Awwwards.html` (auroras, boot sequence, terminal cinétique, marquee, cartes en relief) sont intégralement conservés et stylés selon les tokens du Design System.
docs/specs/spec-home-awwwards/.decision-log.md-32-
docs/specs/spec-home-awwwards/.decision-log.md-33-**Verdict :** Spécification complète, rigoureuse et validée. Prête pour le passage à l'étape suivante : découpage en Epic 11 et stories (`bmad-create-epics-and-stories`).
--
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
docs/specs/spec-home-awwwards/SPEC.md:27:  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
docs/specs/spec-home-awwwards/SPEC.md:28:  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-29-
docs/specs/spec-home-awwwards/SPEC.md-30-- id: CAP-2
docs/specs/spec-home-awwwards/SPEC.md-31-  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
docs/specs/spec-home-awwwards/SPEC.md-32-  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
docs/specs/spec-home-awwwards/SPEC.md-33-
--
docs/specs/spec-home-awwwards/SPEC.md-58-- id: CAP-9
docs/specs/spec-home-awwwards/SPEC.md-59-  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
docs/specs/spec-home-awwwards/SPEC.md-60-  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
docs/specs/spec-home-awwwards/SPEC.md-61-
docs/specs/spec-home-awwwards/SPEC.md-62-- id: CAP-10
docs/specs/spec-home-awwwards/SPEC.md:63:  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
docs/specs/spec-home-awwwards/SPEC.md:64:  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
docs/specs/spec-home-awwwards/SPEC.md-65-
docs/specs/spec-home-awwwards/SPEC.md-66-## Constraints
docs/specs/spec-home-awwwards/SPEC.md-67-
docs/specs/spec-home-awwwards/SPEC.md-68-- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
docs/specs/spec-home-awwwards/SPEC.md-69-- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
docs/specs/spec-home-awwwards/SPEC.md-70-- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
docs/specs/spec-home-awwwards/SPEC.md-71-- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
docs/specs/spec-home-awwwards/SPEC.md-72-- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
docs/specs/spec-home-awwwards/SPEC.md:73:- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
docs/specs/spec-home-awwwards/SPEC.md-74-- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
docs/specs/spec-home-awwwards/SPEC.md-75-
docs/specs/spec-home-awwwards/SPEC.md-76-## Non-goals
docs/specs/spec-home-awwwards/SPEC.md-77-
docs/specs/spec-home-awwwards/SPEC.md-78-- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
docs/specs/spec-home-awwwards/SPEC.md-79-- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
docs/specs/spec-home-awwwards/SPEC.md-80-- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
docs/specs/spec-home-awwwards/SPEC.md:81:- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
docs/specs/spec-home-awwwards/SPEC.md-82-- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
docs/specs/spec-home-awwwards/SPEC.md-83-
docs/specs/spec-home-awwwards/SPEC.md-84-## Success signal
docs/specs/spec-home-awwwards/SPEC.md-85-
docs/specs/spec-home-awwwards/SPEC.md:86:- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.
--
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
docs/specs/spec-home-awwwards/SPEC.md:27:  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
docs/specs/spec-home-awwwards/SPEC.md:28:  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.
docs/specs/spec-home-awwwards/SPEC.md-29-
docs/specs/spec-home-awwwards/SPEC.md-30-- id: CAP-2
docs/specs/spec-home-awwwards/SPEC.md-31-  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
docs/specs/spec-home-awwwards/SPEC.md-32-  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.
docs/specs/spec-home-awwwards/SPEC.md-33-
--
docs/specs/spec-home-awwwards/SPEC.md-58-- id: CAP-9
docs/specs/spec-home-awwwards/SPEC.md-59-  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
docs/specs/spec-home-awwwards/SPEC.md-60-  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.
docs/specs/spec-home-awwwards/SPEC.md-61-
docs/specs/spec-home-awwwards/SPEC.md-62-- id: CAP-10
docs/specs/spec-home-awwwards/SPEC.md:63:  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
docs/specs/spec-home-awwwards/SPEC.md:64:  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
docs/specs/spec-home-awwwards/SPEC.md-65-
docs/specs/spec-home-awwwards/SPEC.md-66-## Constraints
docs/specs/spec-home-awwwards/SPEC.md-67-
docs/specs/spec-home-awwwards/SPEC.md-68-- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
docs/specs/spec-home-awwwards/SPEC.md-69-- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
docs/specs/spec-home-awwwards/SPEC.md-70-- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
docs/specs/spec-home-awwwards/SPEC.md-71-- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
docs/specs/spec-home-awwwards/SPEC.md-72-- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
docs/specs/spec-home-awwwards/SPEC.md:73:- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
docs/specs/spec-home-awwwards/SPEC.md-74-- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.
docs/specs/spec-home-awwwards/SPEC.md-75-
docs/specs/spec-home-awwwards/SPEC.md-76-## Non-goals
docs/specs/spec-home-awwwards/SPEC.md-77-
docs/specs/spec-home-awwwards/SPEC.md-78-- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
docs/specs/spec-home-awwwards/SPEC.md-79-- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
docs/specs/spec-home-awwwards/SPEC.md-80-- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
docs/specs/spec-home-awwwards/SPEC.md:81:- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
docs/specs/spec-home-awwwards/SPEC.md-82-- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.
docs/specs/spec-home-awwwards/SPEC.md-83-
docs/specs/spec-home-awwwards/SPEC.md-84-## Success signal
docs/specs/spec-home-awwwards/SPEC.md-85-
docs/specs/spec-home-awwwards/SPEC.md:86:- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.
--
docs/specs/spec-home-awwwards/.decision-log.md-26-- Les non-goals interdisent expressément le repli vers le one-page à ancres et la dispersion WordPress/PHP en vitrine.
docs/specs/spec-home-awwwards/.decision-log.md-27-- Le signal de succès s'appuie sur la validation par la gate Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
docs/specs/spec-home-awwwards/.decision-log.md-28-
docs/specs/spec-home-awwwards/.decision-log.md-29-**Pass 2 — Préservation :**
docs/specs/spec-home-awwwards/.decision-log.md-30-- Toutes les exigences de `direction_strategique_site.md` et de `contexte_malt.md` sont couvertes sans déperdition : le rôle, la stack ordonnée, les 3 services, les 3 projets SaaS, l'expérience Kidizz, le lien vers Malt et les CTAs orientés mission.
docs/specs/spec-home-awwwards/.decision-log.md:31:- Les composants visuels et interactifs de `Home - Awwwards.html` (auroras, boot sequence, terminal cinétique, marquee, cartes en relief) sont intégralement conservés et stylés selon les tokens du Design System.
docs/specs/spec-home-awwwards/.decision-log.md-32-
docs/specs/spec-home-awwwards/.decision-log.md-33-**Verdict :** Spécification complète, rigoureuse et validée. Prête pour le passage à l'étape suivante : découpage en Epic 11 et stories (`bmad-create-epics-and-stories`).
--
docs/design_system/README.md-90-- **Colour vibe:** Dark, warm, aubergine-tinted. Surfaces are near-black with
docs/design_system/README.md-91-  a faint purple cast (`--surface-0` … `--surface-4`) so the UI reads like a
docs/design_system/README.md-92-  lit terminal rather than flat grey. **Ubuntu orange** (`--accent`,
docs/design_system/README.md-93-  `hsl(24 94% 53%)`) is the single hero colour — used decisively and
docs/design_system/README.md-94-  sparingly for primary actions, links-as-buttons, focal accents. **Aubergine**
docs/design_system/README.md:95:  (`--aubergine`, `--aubergine-light`) is the secondary/atmospheric colour and
docs/design_system/README.md-96-  the terminal body background (`--bg-terminal`, deep aubergine).
docs/design_system/README.md-97-- **Terminal/syntax palette:** green (prompt/success), blue (directory/links),
docs/design_system/README.md-98-  red, yellow, cyan, purple — pulled straight from the original terminal
docs/design_system/README.md-99-  component. Use these for code, the terminal feature, and small status dots —
docs/design_system/README.md-100-  not as broad UI fills.
--
docs/design_system/README.md-107-  (`--space-12`/`--space-16` between blocks). Content max-width ~1200px.
docs/design_system/README.md-108-- **Backgrounds:** Three registers — (1) flat `--surface-0` for most content;
docs/design_system/README.md-109-  (2) the signature **tri-colour heritage gradient** (aubergine-deep → orange
docs/design_system/README.md-110-  → red, diagonal) for hero / full-bleed moments, always dark enough to keep
docs/design_system/README.md-111-  white text legible; (3) **AI-art full-bleed** cyberpunk/hacker-den imagery
docs/design_system/README.md:112:  (in `assets/`) behind a dark `--overlay` for atmospheric section breaks.
docs/design_system/README.md:113:  Subtle scanline / grid textures are optional and low-opacity.
docs/design_system/README.md-114-- **Animation:** Restrained and mechanical — short fades + small upward
docs/design_system/README.md-115-  translate on enter (`fade-rise`, `--ease-out`, ~180–320ms). No bounce on UI.
docs/design_system/README.md-116-  The only looping motion is the **terminal caret blink**. Respect
docs/design_system/README.md-117-  `prefers-reduced-motion`.
docs/design_system/README.md-118-- **Hover states:** Lighten the surface one step (`--surface-2` → `--surface-3`)
--
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-90-- **Colour vibe:** Dark, warm, aubergine-tinted. Surfaces are near-black with
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-91-  a faint purple cast (`--surface-0` … `--surface-4`) so the UI reads like a
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-92-  lit terminal rather than flat grey. **Ubuntu orange** (`--accent`,
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-93-  `hsl(24 94% 53%)`) is the single hero colour — used decisively and
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-94-  sparingly for primary actions, links-as-buttons, focal accents. **Aubergine**
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:95:  (`--aubergine`, `--aubergine-light`) is the secondary/atmospheric colour and
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-96-  the terminal body background (`--bg-terminal`, deep aubergine).
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-97-- **Terminal/syntax palette:** green (prompt/success), blue (directory/links),
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-98-  red, yellow, cyan, purple — pulled straight from the original terminal
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-99-  component. Use these for code, the terminal feature, and small status dots —
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-100-  not as broad UI fills.
--
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-107-  (`--space-12`/`--space-16` between blocks). Content max-width ~1200px.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-108-- **Backgrounds:** Three registers — (1) flat `--surface-0` for most content;
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-109-  (2) the signature **tri-colour heritage gradient** (aubergine-deep → orange
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-110-  → red, diagonal) for hero / full-bleed moments, always dark enough to keep
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-111-  white text legible; (3) **AI-art full-bleed** cyberpunk/hacker-den imagery
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:112:  (in `assets/`) behind a dark `--overlay` for atmospheric section breaks.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:113:  Subtle scanline / grid textures are optional and low-opacity.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-114-- **Animation:** Restrained and mechanical — short fades + small upward
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-115-  translate on enter (`fade-rise`, `--ease-out`, ~180–320ms). No bounce on UI.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-116-  The only looping motion is the **terminal caret blink**. Respect
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-117-  `prefers-reduced-motion`.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md-118-- **Hover states:** Lighten the surface one step (`--surface-2` → `--surface-3`)
--
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:1:<!-- @dsCard group="jouan-site" viewport="1440x900" name="Home — Awwwards concept" subtitle="Immersive terminal-OS homepage: aurora hero, boot sequence, kinetic type" -->
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-2-<!DOCTYPE html>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-3-<html lang="fr">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-4-<head>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-5-<meta charset="utf-8">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-6-<meta name="viewport" content="width=device-width, initial-scale=1">
--
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-22-  a { color: inherit; text-decoration: none; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-23-  h1, h2, h3 { font-family: var(--font-mono); font-weight: var(--fw-regular); margin: 0; color: var(--text-strong); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-24-  ::selection { background: var(--selection); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-25-
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-26-  /* ---------- Atmosphere: fixed background stack ---------- */
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:27:  .atmos { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:28:  .aurora { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55; mix-blend-mode: screen; will-change: transform; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:29:  .aurora--orange { width: 60vw; height: 60vw; left: 48%; top: -22%; background: radial-gradient(circle at center, var(--orange-500), transparent 62%); animation: drift1 26s var(--ease-in-out) infinite; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:30:  .aurora--auberg { width: 64vw; height: 64vw; left: -22%; top: 6%; background: radial-gradient(circle at center, var(--aubergine), transparent 62%); opacity: 0.7; animation: drift2 32s var(--ease-in-out) infinite; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:31:  .aurora--red    { width: 44vw; height: 44vw; left: 26%; top: 44%; background: radial-gradient(circle at center, hsl(8 80% 42%), transparent 64%); opacity: 0.4; animation: drift3 30s var(--ease-in-out) infinite; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-32-  @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-6vw,5vh) scale(1.12)} }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-33-  @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(7vw,-4vh) scale(1.08)} }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-34-  @keyframes drift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-4vw,-6vh) scale(1.15)} }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-35-
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-36-  .grid-dots { position: absolute; inset: 0;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-37-    background-image: radial-gradient(hsl(30 20% 100% / 0.05) 1px, transparent 1px);
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-38-    background-size: 34px 34px; mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:39:  .scanlines { position: absolute; inset: 0; opacity: 0.4;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-40-    background: repeating-linear-gradient(0deg, hsl(0 0% 0% / 0.18) 0 1px, transparent 1px 3px); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-41-  .grain { position: fixed; inset: 0; z-index: 60; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-42-    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-43-  .vignette { position: fixed; inset: 0; z-index: 1; pointer-events: none;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-44-    background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%); }
--
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-46-  /* ---------- Scroll progress ---------- */
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-47-  .progress { position: fixed; top: 0; left: 0; height: 2px; width: 0; z-index: 80;
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-48-    background: linear-gradient(90deg, var(--accent), var(--aubergine-light)); box-shadow: 0 0 12px var(--accent); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-49-
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-50-  /* ---------- Custom cursor ---------- */
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:51:  .cursor-dot, .cursor-ring { position: fixed; top: 0; left: 0; z-index: 90; pointer-events: none; border-radius: 50%; mix-blend-mode: difference; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:52:  .cursor-dot { width: 6px; height: 6px; background: #fff; transform: translate(-50%,-50%); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:53:  .cursor-ring { width: 34px; height: 34px; border: 1px solid hsl(0 0% 100% / 0.7); transform: translate(-50%,-50%); transition: width .2s var(--ease-out), height .2s var(--ease-out), border-color .2s; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:54:  .cursor-ring.is-hot { width: 56px; height: 56px; border-color: var(--accent); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:55:  @media (hover: none) { .cursor-dot, .cursor-ring { display: none; } }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-56-
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-57-  /* ---------- Layout ---------- */
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-58-  .wrap { position: relative; z-index: 2; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-59-  .container { width: min(1200px, 92vw); margin: 0 auto; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-60-  .eyebrow { font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: var(--ls-wider);
--
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-265-  .block__head--row .seeall:hover { color: var(--accent); }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-266-  .block__head--row .seeall svg { width: 15px; height: 15px; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-267-  @media (max-width: 620px) { .block__head--row { flex-direction: column; align-items: flex-start; } }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-268-
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-269-  @media (prefers-reduced-motion: reduce) {
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:270:    .aurora { animation: none; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-271-    .h1 .word { transform: none; transition: none; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-272-    .reveal { opacity: 1; transform: none; transition: none; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-273-    .marquee__track { animation: none; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-274-    .caret { animation: none; }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-275-  }
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-276-</style>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-277-</head>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-278-<body>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:279:  <div class="atmos">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:280:    <div class="aurora aurora--auberg"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:281:    <div class="aurora aurora--orange"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:282:    <div class="aurora aurora--red"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-283-    <div class="grid-dots"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:284:    <div class="scanlines"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-285-  </div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-286-  <div class="vignette"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-287-  <div class="grain"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-288-  <div class="progress" id="progress"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:289:  <div class="cursor-ring" id="ring"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html:290:  <div class="cursor-dot" id="dot"></div>
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-291-
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-292-  <!-- BOOT -->
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-293-  <div class="boot" id="boot">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-294-    <div class="boot__in">
docs/design_system/ui_kits/jouan-site/Home - Awwwards.html-295-      <div class="boot__logo"><img src="../../assets/brand/logo-white.png" alt=""><b>jouan.os</b></div>
--

2026-09-13T16:32:49.501548Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba 'docs/design_system/ui_kits/jouan-site/Home - Awwwards.html' | sed -n '45,62p;520,590p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    45	
    46	  /* ---------- Scroll progress ---------- */
    47	  .progress { position: fixed; top: 0; left: 0; height: 2px; width: 0; z-index: 80;
    48	    background: linear-gradient(90deg, var(--accent), var(--aubergine-light)); box-shadow: 0 0 12px var(--accent); }
    49	
    50	  /* ---------- Custom cursor ---------- */
    51	  .cursor-dot, .cursor-ring { position: fixed; top: 0; left: 0; z-index: 90; pointer-events: none; border-radius: 50%; mix-blend-mode: difference; }
    52	  .cursor-dot { width: 6px; height: 6px; background: #fff; transform: translate(-50%,-50%); }
    53	  .cursor-ring { width: 34px; height: 34px; border: 1px solid hsl(0 0% 100% / 0.7); transform: translate(-50%,-50%); transition: width .2s var(--ease-out), height .2s var(--ease-out), border-color .2s; }
    54	  .cursor-ring.is-hot { width: 56px; height: 56px; border-color: var(--accent); }
    55	  @media (hover: none) { .cursor-dot, .cursor-ring { display: none; } }
    56	
    57	  /* ---------- Layout ---------- */
    58	  .wrap { position: relative; z-index: 2; }
    59	  .container { width: min(1200px, 92vw); margin: 0 auto; }
    60	  .eyebrow { font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: var(--ls-wider);
    61	    text-transform: uppercase; color: var(--accent); margin: 0 0 var(--space-4); }
    62	  .eyebrow .c { color: var(--text-faint); }
   520	  addEventListener('scroll', onScroll, {passive:true}); onScroll();
   521	
   522	  // ---- Custom cursor ----
   523	  const ring = document.getElementById('ring'), dot = document.getElementById('dot');
   524	  let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my;
   525	  addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
   526	  (function loop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
   527	  document.querySelectorAll('[data-hot]').forEach(el=>{
   528	    el.addEventListener('mouseenter',()=>ring.classList.add('is-hot'));
   529	    el.addEventListener('mouseleave',()=>ring.classList.remove('is-hot'));
   530	  });
   531	
   532	  // ---- Magnetic buttons ----
   533	  if(!reduce) document.querySelectorAll('.btn').forEach(btn=>{
   534	    const mag = btn.querySelector('.mag');
   535	    btn.addEventListener('mousemove', e=>{ const r=btn.getBoundingClientRect(); const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2; btn.style.transform=`translate(${x*0.18}px,${y*0.22}px)`; if(mag) mag.style.transform=`translate(${x*0.1}px,${y*0.12}px)`; });
   536	    btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; if(mag) mag.style.transform=''; });
   537	  });
   538	
   539	  // ---- Card tilt ----
   540	  if(!reduce) document.querySelectorAll('[data-tilt]').forEach(card=>{
   541	    card.addEventListener('mousemove', e=>{ const r=card.getBoundingClientRect(); const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5; card.style.transform=`perspective(800px) rotateX(${-py*5}deg) rotateY(${px*6}deg) translateY(-4px)`; });
   542	    card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
   543	  });
   544	
   545	  // ---- Terminal typing ----
   546	  const termLines = [
   547	    {t:'pmt', s:'anon.@jouan.ovh:~$ ', c:'whoami'},
   548	    {t:'out', s:'Simon Jouan — développeur web freelance'},
   549	    {t:'gap'},
   550	    {t:'pmt', s:'anon.@jouan.ovh:~$ ', c:'cat stack.txt'},
   551	    {t:'path', s:'PHP/Symfony · WordPress · Node/Nest · Nuxt'},
   552	    {t:'gap'},
   553	    {t:'pmt', s:'anon.@jouan.ovh:~$ ', c:'ls ~/projets'},
   554	    {t:'dir', s:'keova.app/   patio-conseil.fr/'},
   555	    {t:'gap'},
   556	    {t:'pmt', s:'anon.@jouan.ovh:~$ ', c:'_', caret:true},
   557	  ];
   558	  const termBody = document.getElementById('termbody');
   559	  function renderTerm(upTo, partial){
   560	    let html='';
   561	    for(let i=0;i<upTo;i++){ const l=termLines[i];
   562	      if(l.t==='gap'){ html+='\n'; continue; }
   563	      if(l.s && l.s.includes('$')){ html+=`<span class="pmt">${l.s}</span><span class="out">${l.c||''}</span>\n`; }
   564	      else html+=`<span class="${l.t}">${l.s}</span>\n`;
   565	    }
   566	    const cur=termLines[upTo];
   567	    if(cur){
   568	      if(cur.t==='gap') {}
   569	      else if(cur.s && cur.s.includes('$')) html+=`<span class="pmt">${cur.s}</span><span class="out">${partial}</span>${cur.caret?'<span class="caret"></span>':''}`;
   570	      else html+=`<span class="${cur.t}">${partial}</span>`;
   571	    }
   572	    termBody.innerHTML=html;
   573	  }
   574	  function typeTerm(){
   575	    let i=0;
   576	    function step(){
   577	      if(i>=termLines.length){ return; }
   578	      const l=termLines[i];
   579	      if(l.t==='gap'||l.t==='out'||l.t==='path'||l.t==='dir'){ renderTerm(i+1,''); i++; setTimeout(step, l.t==='gap'?120:260); return; }
   580	      const full=l.c||'';
   581	      if(l.caret){ renderTerm(i,''); return; }
   582	      let j=0;
   583	      (function ch(){ renderTerm(i, full.slice(0,j)); if(j<full.length){ j++; setTimeout(ch, 46);} else { i++; setTimeout(step, 320);} })();
   584	    }
   585	    step();
   586	  }
   587	
   588	  // ---- Boot sequence ----
   589	  const boot=document.getElementById('boot'), bootline=document.getElementById('bootline'), bootbar=document.getElementById('bootbar');
   590	  const bootSteps=['initialisation du noyau…','montage de /dev/portfolio','chargement des polices Ubuntu Mono','compilation des projets <span class="ok">[ok]</span>','démarrage du serveur <span class="ok">[ok]</span>'];

2026-09-13T16:32:52.776820Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"data-hot\" 'docs/design_system/ui_kits/jouan-site/Home - Awwwards.html' | sed -n '1,120p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
305:      <a class="brand" href="#top" data-hot>
310:        <a href="#services" data-hot>// services</a>
311:        <a href="#work" data-hot>// projets</a>
312:        <a href="#journal" data-hot>~/journal</a>
313:        <a href="#contact" data-hot>$ contact</a>
315:      <a class="btn btn--primary" href="#contact" data-hot><span class="mag">Démarrer un projet</span></a>
332:              <a class="btn btn--primary" href="#contact" data-hot><span class="mag">Démarrer un projet <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span></a>
333:              <a class="btn btn--ghost" href="#work" data-hot><span class="mag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> ./voir-les-projets</span></a>
390:          <a class="seeall" href="#journal" data-hot>cat tous-les-articles <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a>
404:            <a class="btn btn--primary" href="mailto:simon@jouan.ovh" data-hot><span class="mag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg> simon@jouan.ovh</span></a>
405:            <a class="btn btn--ghost" href="#top" data-hot><span class="mag">Voir le CV</span></a>
463:    <a class="work__row reveal" href="${w.url}" target="_blank" rel="noreferrer" data-hot>
481:      <a class="jpost jfeat reveal" href="${feat.url}" data-hot>
491:      <a class="jrow reveal" href="${p.url}" data-hot>
503:    <a class="hex" href="${s.url}" target="_blank" rel="noreferrer" data-hot><svg viewBox="${s.vb}" fill="currentColor">${s.svg}</svg></a>`).join('');
527:  document.querySelectorAll('[data-hot]').forEach(el=>{

2026-09-13T16:32:55.954550Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-1/full.diff | sed -n '430,620p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   430	 
   431	diff --git a/app/pages/index.vue b/app/pages/index.vue
   432	index cb89e65..fbd4f5c 100644
   433	--- a/app/pages/index.vue
   434	+++ b/app/pages/index.vue
   435	@@ -1,5 +1,8 @@
   436	 <template>
   437	   <main class="home">
   438	+    <HomeAtmosComponent />
   439	+    <ZCustomCursor />
   440	+
   441	     <section class="hero hero__grad">
   442	       <div class="hero__in container">
   443	         <div class="hero__grid">
   444	@@ -98,8 +101,14 @@
   445	 
   446	         <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
   447	         <ul class="grid-2 projects">
   448	-          <li v-for="project in projects" :key="project.url">
   449	-            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
   450	+          <li v-for="project in projects" :key="project.name">
   451	+            <ZCard
   452	+              class="project"
   453	+              interactive
   454	+              :as="project.url ? ZExternalLink : 'div'"
   455	+              :href="project.url || undefined"
   456	+              :rel="project.url ? 'noopener noreferrer' : undefined"
   457	+            >
   458	               <div class="project__head">
   459	                 <h3 class="project__name">{{ project.name }}</h3>
   460	                 <span class="project__role">{{ project.role }}</span>
   461	diff --git a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
   462	index 44ad82b..38abf8d 100644
   463	--- a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
   464	+++ b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
   465	@@ -1,6 +1,10 @@
   466	+---
   467	+baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed
   468	+---
   469	+
   470	 # Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
   471	 
   472	-Status: ready-for-dev
   473	+Status: review
   474	 
   475	 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
   476	 
   477	@@ -41,36 +45,36 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
   478	 
   479	 ## Tasks / Subtasks
   480	 
   481	-- [ ] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
   482	-  - [ ] Vérifier l'état de l'arbre de travail (`git status`).
   483	-  - [ ] S'assurer que la branche `develop` est à jour.
   484	-  - [ ] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
   485	-
   486	-- [ ] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
   487	-  - [ ] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
   488	-  - [ ] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
   489	-  - [ ] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
   490	-  - [ ] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
   491	-  - [ ] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
   492	-
   493	-- [ ] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
   494	-  - [ ] Créer `app/components/home/HomeAtmosComponent.vue`.
   495	-  - [ ] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
   496	-  - [ ] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
   497	-  - [ ] Baliser le bloc avec `aria-hidden="true"`.
   498	-  - [ ] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
   499	-
   500	-- [ ] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
   501	-  - [ ] Créer `app/components/ui/ZCustomCursor.vue`.
   502	-  - [ ] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
   503	-  - [ ] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
   504	-  - [ ] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
   505	-  - [ ] Nettoyer les listeners lors du `onUnmounted()`.
   506	-
   507	-- [ ] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
   508	-  - [ ] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
   509	-  - [ ] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
   510	-  - [ ] Vérifier que les 13 routes statiques sont générées sans avertissement.
   511	+- [x] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
   512	+  - [x] Vérifier l'état de l'arbre de travail (`git status`).
   513	+  - [x] S'assurer que la branche `develop` est à jour.
   514	+  - [x] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
   515	+
   516	+- [x] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
   517	+  - [x] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
   518	+  - [x] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
   519	+  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
   520	+  - [x] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
   521	+  - [x] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
   522	+
   523	+- [x] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
   524	+  - [x] Créer `app/components/home/HomeAtmosComponent.vue`.
   525	+  - [x] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
   526	+  - [x] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
   527	+  - [x] Baliser le bloc avec `aria-hidden="true"`.
   528	+  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
   529	+
   530	+- [x] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
   531	+  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
   532	+  - [x] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
   533	+  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
   534	+  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
   535	+  - [x] Nettoyer les listeners lors du `onUnmounted()`.
   536	+
   537	+- [x] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
   538	+  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
   539	+  - [x] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
   540	+  - [x] Vérifier que les 13 routes statiques sont générées sans avertissement.
   541	 
   542	 ## Dev Notes
   543	 
   544	@@ -93,6 +97,51 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
   545	 - **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
   546	 - **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.
   547	 
   548	+## Dev Agent Record
   549	+
   550	+### Implementation Plan
   551	+1. **Isolation Git :** Création et bascule sur la branche `feat/home-awwwards` depuis `develop`.
   552	+2. **Données centralisées (`site.ts`) :**
   553	+   - Mise à jour de `IProject` (`status?: string`, `url?: string`) et `IProfile` (`maltUrl?: string`).
   554	+   - Rôle commercial unifié : « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », lien Malt.
   555	+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
   556	+   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
   557	+3. **Rétrocompatibilité :**
   558	+   - Sécurisation de `FooterComponent.vue` pour supporter les projets sans URL externe.
   559	+   - Sécurisation de `programs/Projets.ts` dans le terminal pour afficher `[status]` au lieu d'une URL vide.
   560	+4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
   561	+   - 3 auroras floutées (aubergine, orange, rouge) avec dérive lente fluide en CSS pur.
   562	+   - Grille de points et scanlines CRT en overlay.
   563	+   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
   564	+5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
   565	+   - Suivi fluide (`dot` + `ring`) avec interpolation par `requestAnimationFrame`.
   566	+   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
   567	+   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
   568	+6. **Intégration & Gate Docker :**
   569	+   - Intégration sur `app/pages/index.vue`.
   570	+   - Validation 100% verte : `pnpm lint`, `pnpm typecheck`, `pnpm generate` (13 routes pré-rendues).
   571	+
   572	+### Completion Notes
   573	+- Branche `feat/home-awwwards` initialisée à partir de `develop` (`baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed`).
   574	+- Données `SITE` alignées rigoureusement sur le profil Malt et la direction stratégique.
   575	+- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
   576	+- Gate Docker 100% verte : 0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques générées avec succès par Nitro.
   577	+
   578	+## File List
   579	+
   580	+- `app/data/site.ts` (MODIFIED)
   581	+- `app/components/terminal/programs/Projets.ts` (MODIFIED)
   582	+- `app/components/FooterComponent.vue` (MODIFIED)
   583	+- `app/components/home/HomeAtmosComponent.vue` (NEW)
   584	+- `app/components/ui/ZCustomCursor.vue` (NEW)
   585	+- `app/pages/index.vue` (MODIFIED)
   586	+- `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md` (MODIFIED)
   587	+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   588	+
   589	+## Change Log
   590	+
   591	+- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).
   592	+
   593	 ### References
   594	 - [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
   595	 - [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
   596	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
   597	index 5d9dab6..b28e1fb 100644
   598	--- a/docs/implementation-artifacts/sprint-status.yaml
   599	+++ b/docs/implementation-artifacts/sprint-status.yaml
   600	@@ -35,7 +35,7 @@
   601	 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
   602	 
   603	 generated: 2026-06-18
   604	-last_updated: "2026-09-13 (Story 11.1 ready-for-dev : Préparation de branche, site.ts & Atmosphère)"
   605	+last_updated: "2026-09-13 (Story 11.1 review : Préparation de branche, site.ts & Atmosphère)"
   606	 project: jouan.ovh
   607	 project_key: NOKEY
   608	 tracking_system: file-system
   609	@@ -119,7 +119,7 @@ development_status:
   610	 
   611	   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   612	   epic-11: in-progress
   613	-  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: ready-for-dev
   614	+  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: review
   615	   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
   616	   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
   617	   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog

2026-09-13T16:33:09.359541Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/layouts/default.vue | sed -n '1,160p'; rg -n -C 3 \"("'^|'"\\s)z-index|position: relative|position: fixed|background:\" app/pages/index.vue app/assets/scss/base/_layout.scss app/assets/scss/base/_reset.scss app/components/HeaderComponent.vue app/components/FooterComponent.vue | sed -n '1,320p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <div class="init">
     3	    <HeaderComponent />
     4	
     5	    <slot />
     6	
     7	    <FooterComponent />
     8	  </div>
     9	</template>
    10	
    11	<script setup lang="ts">
    12	import FooterComponent from "../components/FooterComponent.vue";
    13	import HeaderComponent from "../components/HeaderComponent.vue";
    14	</script>
    15	
    16	<style lang="scss" scoped>
    17	.init {
    18	  // Fond de page dark-first (token). Remplace l'ancien dégradé legacy
    19	  // orange/aubergine (anciens tokens SCSS `_color.$`) qui débordait derrière
    20	  // les sections transparentes (révélé par la story 3.2). Le hero porte son
    21	  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
    22	  background: var(--bg-page);
    23	
    24	  // Flex column : header sticky en haut, footer riche poussé en bas via
    25	  // `margin-top: auto` (le footer dépasse 56px — l'ancienne grille à hauteur
    26	  // fixe le tronquait). --header-height/--footer-height viennent des tokens (2.1).
    27	  display: flex;
    28	  flex-direction: column;
    29	  margin: 0;
    30	  min-height: 100vh;
    31	  width: 100%;
    32	  max-width: 100vw;
    33	}
    34	</style>
app/assets/scss/base/_reset.scss-149-sup {
app/assets/scss/base/_reset.scss-150-  font-size: 75%;
app/assets/scss/base/_reset.scss-151-  line-height: 0;
app/assets/scss/base/_reset.scss:152:  position: relative;
app/assets/scss/base/_reset.scss-153-  vertical-align: baseline;
app/assets/scss/base/_reset.scss-154-}
app/assets/scss/base/_reset.scss-155-
--
app/assets/scss/base/_reset.scss-374---------------------------------------------- */
app/assets/scss/base/_reset.scss-375-
app/assets/scss/base/_reset.scss-376-/* Base dark-first : fond sombre par défaut (tokens DS, story 2.1).
app/assets/scss/base/_reset.scss:377:   Neutralise l'ancien `background: #fff` du reset (incompatible dark-first). */
app/assets/scss/base/_reset.scss-378-html {
app/assets/scss/base/_reset.scss:379:  background: var(--bg-page);
app/assets/scss/base/_reset.scss-380-}
app/assets/scss/base/_reset.scss-381-
app/assets/scss/base/_reset.scss-382-body {
app/assets/scss/base/_reset.scss:383:  background: var(--bg-page);
app/assets/scss/base/_reset.scss-384-  color: var(--text-body);
app/assets/scss/base/_reset.scss-385-}
app/assets/scss/base/_reset.scss-386-
--
app/assets/scss/base/_reset.scss-587-  text-decoration: none;
app/assets/scss/base/_reset.scss-588-  top: 5px;
app/assets/scss/base/_reset.scss-589-  width: auto;
app/assets/scss/base/_reset.scss:590:  z-index: 100000;
app/assets/scss/base/_reset.scss-591-}
app/assets/scss/base/_reset.scss-592-
app/assets/scss/base/_reset.scss-593-/* Do not show the outline on the skip link target. */
--
app/components/FooterComponent.vue-64-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
app/components/FooterComponent.vue-65-.ftr {
app/components/FooterComponent.vue-66-  margin-top: auto;
app/components/FooterComponent.vue:67:  background: var(--surface-1);
app/components/FooterComponent.vue-68-  border-top: 1px solid var(--border-subtle);
app/components/FooterComponent.vue-69-  padding: var(--space-12) 0 var(--space-8);
app/components/FooterComponent.vue-70-}
--
app/assets/scss/base/_layout.scss-19-
app/assets/scss/base/_layout.scss-20-// Section en creux : fond teinté + filets haut/bas.
app/assets/scss/base/_layout.scss-21-.section--sunken {
app/assets/scss/base/_layout.scss:22:  background: var(--bg-sunken);
app/assets/scss/base/_layout.scss-23-  border-top: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss-24-  border-bottom: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss-25-}
--
app/components/HeaderComponent.vue-189-.hdr {
app/components/HeaderComponent.vue-190-  position: sticky;
app/components/HeaderComponent.vue-191-  top: 0;
app/components/HeaderComponent.vue:192:  z-index: 50;
app/components/HeaderComponent.vue-193-  height: var(--header-height);
app/components/HeaderComponent.vue-194-
app/components/HeaderComponent.vue-195-  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
app/components/HeaderComponent.vue:196:  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
app/components/HeaderComponent.vue-197-  border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue-198-
app/components/HeaderComponent.vue-199-  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
--
app/components/HeaderComponent.vue-260-
app/components/HeaderComponent.vue-261-  &:hover {
app/components/HeaderComponent.vue-262-    color: var(--text-strong);
app/components/HeaderComponent.vue:263:    background: var(--surface-2);
app/components/HeaderComponent.vue-264-  }
app/components/HeaderComponent.vue-265-
app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
--
app/components/HeaderComponent.vue-297-  font-size: 20px;
app/components/HeaderComponent.vue-298-  color: var(--text-strong);
app/components/HeaderComponent.vue-299-  cursor: pointer;
app/components/HeaderComponent.vue:300:  background: none;
app/components/HeaderComponent.vue-301-  border: 1px solid var(--border-default);
app/components/HeaderComponent.vue-302-  border-radius: var(--radius-md);
app/components/HeaderComponent.vue-303-
--
app/components/HeaderComponent.vue-309-}
app/components/HeaderComponent.vue-310-
app/components/HeaderComponent.vue-311-.hdr__overlay {
app/components/HeaderComponent.vue:312:  position: fixed;
app/components/HeaderComponent.vue-313-  inset: var(--header-height) 0 0;
app/components/HeaderComponent.vue:314:  z-index: 40;
app/components/HeaderComponent.vue:315:  background: var(--overlay);
app/components/HeaderComponent.vue-316-}
app/components/HeaderComponent.vue-317-
app/components/HeaderComponent.vue-318-.hdr__menu {
--
app/components/HeaderComponent.vue-354-  }
app/components/HeaderComponent.vue-355-
app/components/HeaderComponent.vue-356-  .hdr__menu {
app/components/HeaderComponent.vue:357:    position: fixed;
app/components/HeaderComponent.vue-358-    inset: var(--header-height) 0 auto 0;
app/components/HeaderComponent.vue:359:    z-index: 45;
app/components/HeaderComponent.vue-360-    display: flex;
app/components/HeaderComponent.vue-361-    flex-direction: column;
app/components/HeaderComponent.vue-362-    gap: var(--space-1);
app/components/HeaderComponent.vue-363-    padding: var(--space-4) var(--space-6) var(--space-6);
app/components/HeaderComponent.vue:364:    background: var(--surface-1);
app/components/HeaderComponent.vue-365-    border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue-366-    box-shadow: var(--shadow-3);
app/components/HeaderComponent.vue-367-    transform: translateY(-8px);
--
app/components/HeaderComponent.vue-390-
app/components/HeaderComponent.vue-391-  &:hover {
app/components/HeaderComponent.vue-392-    color: var(--text-strong);
app/components/HeaderComponent.vue:393:    background: var(--surface-2);
app/components/HeaderComponent.vue-394-  }
app/components/HeaderComponent.vue-395-
app/components/HeaderComponent.vue-396-  &:focus-visible {
--
app/pages/index.vue-245-
app/pages/index.vue-246-// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
app/pages/index.vue-247-.hero {
app/pages/index.vue:248:  position: relative;
app/pages/index.vue-249-  overflow: hidden;
app/pages/index.vue-250-}
app/pages/index.vue-251-
--
app/pages/index.vue-253-  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
app/pages/index.vue-254-  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
app/pages/index.vue-255-  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
app/pages/index.vue:256:  background:
app/pages/index.vue-257-    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue-258-    radial-gradient(
app/pages/index.vue-259-      700px 500px at 0% 110%,
--
app/pages/index.vue-264-}
app/pages/index.vue-265-
app/pages/index.vue-266-.hero__in {
app/pages/index.vue:267:  position: relative;
app/pages/index.vue:268:  z-index: 1;
app/pages/index.vue-269-
app/pages/index.vue-270-  // padding-block uniquement : le gutter horizontal vient de .container
app/pages/index.vue-271-  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
--
app/pages/index.vue-332-}
app/pages/index.vue-333-
app/pages/index.vue-334-.hero-term__bar {
app/pages/index.vue:335:  position: relative;
app/pages/index.vue-336-  display: flex;
app/pages/index.vue-337-  flex: none;
app/pages/index.vue-338-  align-items: center;
app/pages/index.vue-339-  gap: var(--space-2);
app/pages/index.vue-340-  height: 30px;
app/pages/index.vue-341-  padding: 0 var(--space-3);
app/pages/index.vue:342:  background: var(--aubergine-black);
app/pages/index.vue-343-}
app/pages/index.vue-344-
app/pages/index.vue-345-.hero-term__dots {
--
app/pages/index.vue-355-}
app/pages/index.vue-356-
app/pages/index.vue-357-.hero-term__dot--close {
app/pages/index.vue:358:  background: var(--term-red);
app/pages/index.vue-359-}
app/pages/index.vue-360-
app/pages/index.vue-361-.hero-term__dot--min {
app/pages/index.vue:362:  background: var(--term-yellow);
app/pages/index.vue-363-}
app/pages/index.vue-364-
app/pages/index.vue-365-.hero-term__dot--max {
app/pages/index.vue:366:  background: var(--term-green);
app/pages/index.vue-367-}
app/pages/index.vue-368-
app/pages/index.vue-369-.hero-term__title {
--
app/pages/index.vue-386-  font-size: var(--fs-sm);
app/pages/index.vue-387-  line-height: var(--lh-snug);
app/pages/index.vue-388-  color: var(--ink-1);
app/pages/index.vue:389:  background: var(--bg-terminal);
app/pages/index.vue-390-  overflow-wrap: break-word;
app/pages/index.vue-391-}
app/pages/index.vue-392-
app/pages/index.vue-393-@supports (backdrop-filter: blur(5px)) {
app/pages/index.vue-394-  .hero-term__body {
app/pages/index.vue:395:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/pages/index.vue-396-    backdrop-filter: blur(5px);
app/pages/index.vue-397-  }
app/pages/index.vue-398-}
--
app/pages/index.vue-425-  font: inherit;
app/pages/index.vue-426-  text-align: left;
app/pages/index.vue-427-  cursor: pointer;
app/pages/index.vue:428:  background: none;
app/pages/index.vue-429-  border: none;
app/pages/index.vue-430-  border-radius: var(--radius-xs);
app/pages/index.vue-431-
--
app/pages/index.vue-470-  height: 1.05em;
app/pages/index.vue-471-  margin-left: 1px;
app/pages/index.vue-472-  vertical-align: text-bottom;
app/pages/index.vue:473:  background: var(--prompt);
app/pages/index.vue-474-
app/pages/index.vue-475-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
app/pages/index.vue-476-  animation: caret-blink 1s steps(1) infinite;
--
app/pages/index.vue-516-  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
app/pages/index.vue-517-  font-size: 22px;
app/pages/index.vue-518-  color: var(--accent);
app/pages/index.vue:519:  background: var(--accent-soft);
app/pages/index.vue-520-  border-radius: var(--radius-md);
app/pages/index.vue-521-}
app/pages/index.vue-522-

2026-09-13T16:33:37.825005Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "find .output/public -type f \\( -name '*.html' -o -name 'CNAME' \\) -print 2>/dev/null | sort | sed -n '1,80p'; printf 'html_count='; find .output/public -type f -name '*.html' -print 2>/dev/null | wc -l" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
.output/public/200.html
.output/public/404.html
.output/public/CNAME
.output/public/about/index.html
.output/public/blog/index.html
.output/public/confidentialite/index.html
.output/public/contact/index.html
.output/public/index.html
.output/public/mentions-legales/index.html
.output/public/services/index.html
html_count=       9

2026-09-13T16:34:00.557970Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- **[AC-4 / CAP-10] Les cartes ne réagissent pas au micro-curseur.** `ZCustomCursor` recherche `[data-hot]`, mais les cartes ajoutées dans `index.vue` ne portent pas cet attribut (`full.diff:451-457`) ; les cartes non liées ne déclenchent donc jamais `.is-hot` (`full.diff:257-261`).

- **[SPEC/AGENTS — tokens CSS] Le nouveau SCSS contient des couleurs hardcodées.** `hsl(...)` et `#000` sont utilisés pour la grille, les scanlines et l’anneau du curseur (`full.diff:113-125`, `full.diff:315-318`), contrairement à la contrainte `var(--token)`.

- **[AC-5] La gate Docker n’est pas verte.** Le diff déclare la validation complète réussie (`full.diff:537-576`), mais l’exécution réelle s’est terminée par `exit code 137` pendant `pnpm generate`; seuls 9 fichiers HTML partiels étaient présents, pas 13 routes.

- **[AC-2] Le contrat de données TryOn n’est pas respecté littéralement.** L’AC demande `url: ""`, alors que l’objet TryOn ajouté dans `SITE.projects` omet complètement la propriété (`full.diff:410-415`).
tokens used
157 814
- **[AC-4 / CAP-10] Les cartes ne réagissent pas au micro-curseur.** `ZCustomCursor` recherche `[data-hot]`, mais les cartes ajoutées dans `index.vue` ne portent pas cet attribut (`full.diff:451-457`) ; les cartes non liées ne déclenchent donc jamais `.is-hot` (`full.diff:257-261`).

- **[SPEC/AGENTS — tokens CSS] Le nouveau SCSS contient des couleurs hardcodées.** `hsl(...)` et `#000` sont utilisés pour la grille, les scanlines et l’anneau du curseur (`full.diff:113-125`, `full.diff:315-318`), contrairement à la contrainte `var(--token)`.

- **[AC-5] La gate Docker n’est pas verte.** Le diff déclare la validation complète réussie (`full.diff:537-576`), mais l’exécution réelle s’est terminée par `exit code 137` pendant `pnpm generate`; seuls 9 fichiers HTML partiels étaient présents, pas 13 routes.

- **[AC-2] Le contrat de données TryOn n’est pas respecté littéralement.** L’AC demande `url: ""`, alors que l’objet TryOn ajouté dans `SITE.projects` omet complètement la propriété (`full.diff:410-415`).

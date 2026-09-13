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
session id: 01a09c38-5ae8-7463-892c-72a79d26b10f
--------
user
# Acceptance Auditor Prompt — Story 11.4

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.4), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `docs/specs/spec-home-awwwards/sections-mapping.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-4/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise la compétence de revue de code adversariale pour auditer la diff contre les critères d’acceptation et les contraintes de contexte, puis je vérifierai chaque conclusion directement dans les fichiers de spécification.
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
/bin/zsh -lc "python3 /Users/simon/dev/jouan.ovh/_bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow && sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/11-4/full.diff docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/specs/spec-home-awwwards/sections-mapping.md AGENTS.md && git status --short --branch' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     686 docs/implementation-artifacts/code-reviews/11-4/full.diff
     165 docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md
     789 docs/planning-artifacts/epics.md
     282 docs/project-context.md
      86 docs/specs/spec-home-awwwards/SPEC.md
      98 docs/specs/spec-home-awwwards/sections-mapping.md
     171 AGENTS.md
    2277 total
## feat/home-awwwards
 M app/pages/index.vue
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md
?? docs/implementation-artifacts/code-reviews/11-4/

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

2026-09-13T19:22:44.630370Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,240p' docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 44894826488b4d1acf1ce108ea6ff345b725c80a
---

# Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect explorant la page d'accueil pour évaluer une collaboration freelance,
I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés de réassurance, les derniers articles du journal technique et le bloc d'action final,
so that je sois convaincu par des preuves concrètes d'ingénierie logicielle Full Stack TypeScript et engagé à initier un contact direct via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24, CAP-5, CAP-6, CAP-7).

## Acceptance Criteria

1. **Given** les projets définis dans `SITE.projects` (`app/data/site.ts`)
   **When** le visiteur fait défiler la page d'accueil sous la section des services
   **Then** la section des réalisations (`.work`) affiche l'en-tête :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>`
     - Titre de section : `<h2 class="section__title">Des produits qui tournent en production</h2>`
   **And** la liste des projets est structurée en une séquence sémantique `<ul>` / `<li>` avec les 3 réalisations :
     - **Keova App** (`01`) : Statut `● En production`, rôle `Co-fondateur & Développeur Full Stack`, description ERP équestre SaaS, tags (`Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect`, `SaaS`), et lien externe direct accessible via `<ZExternalLink href="https://keova.app">`
     - **TryOn** (`02`) : Statut `○ Étude de cas (MVP livré)`, rôle `CTO & Développeur Full Stack`, description plateforme IA générative & mode, tags (`Nuxt 3`, `NestJS`, `Python`, `ComfyUI`, `IA`), **sans lien externe mort 404** (rendu sans balise `<a>` externe non résolue)
     - **Nodium** (`03`) : Statut `◐ R&D / En cours`, rôle `Créateur & Ingénieur IA`, description orchestration d'agents desktop, tags (`TypeScript`, `Electron`, `Agents`, `IA`), rendu sans lien externe
   **And** chaque ligne interactive (`.work__row`) réagit au survol (`:hover`) avec un dégradé subtil `var(--accent-soft)` et un décalage de la flèche directionnelle (sans à-coup).

2. **Given** la zone de réassurance située immédiatement après les projets
   **When** le visiteur consulte les indicateurs clés
   **Then** une grille responsive (`.stats`) affiche exactement 3 compteurs typés :
     - Compteur 1 : Valeur `11`, libellé `années d'expérience web`
     - Compteur 2 : Valeur `100%`, libellé `TypeScript & SaaS de bout en bout`
     - Compteur 3 : Valeur `QA`, libellé `culture d'automatisation & zéro régression`
   **And** les valeurs numériques/codes sont mises en exergue en police monospace `var(--font-mono)` et couleur d'accent `var(--accent)`
   **And** la grille s'adapte de façon fluide (3 colonnes sur desktop, 1 colonne sous 680px).

3. **Given** la collection de blog `@nuxt/content` v3
   **When** on intègre la section du journal technique sur la page d'accueil
   **Then** l'en-tête de section affiche :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>`
     - Titre : `<h2 class="section__title">Notes de dev, écrites en construisant</h2>`
     - Lien d'approfondissement : `<NuxtLink to="/blog" class="seeall">cat tous-les-articles →</NuxtLink>`
   **And** les 3 articles les plus récents sont interrogés de manière prerender-safe via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())`
   **And** si des articles existent, ils sont rendus avec leurs tags `ZTag`, titre, date formatée et lien vers leur route `/blog/[slug]`
   **And** si la collection est vide (état initial du dépôt avec `.gitkeep`), un état d'attente sobre et élégant s'affiche invitant à consulter le blog sans bloquer le rendu statique SSG.

4. **Given** le bas de la page d'accueil
   **When** le prospect atteint la fin de la consultation
   **Then** un panneau d'appel à l'action final (`.cta`) se présente avec :
     - Eyebrow mono : `<p class="eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>`
     - Titre : `<h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>`
     - Sous-titre : `<p class="cta__subtitle">Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.</p>`
     - CTAs interactifs :
       - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
       - Bouton externe : `<ZButton :as="ZExternalLink" :href="SITE.profile.maltUrl" variant="secondary">Me contacter sur Malt</ZButton>` (garantissant l'accessibilité a11y et `srText`)
       - Bouton tertiaire : `<ZButton variant="ghost" to="/about">Voir le parcours & CV</ZButton>`
   **And** aucun lien intra-page avec ancre `#` n'est employé (respect de l'architecture multi-pages).

5. **Given** l'ensemble des intégrations de la story
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Refonte de la section des projets sélectionnés (`.work`) (AC: 1)
  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
  - [x] Baliser les 3 projets de `SITE.projects` (`keova.app`, `TryOn`, `Nodium`) dans une liste sémantique `<ul>` et `<li>`.
  - [x] Afficher la numérotation (`01`, `02`, `03`), le statut coloré (`● En production`, `○ Étude de cas (MVP livré)`, `◐ R&D / En cours`), le titre, la description, le rôle et les tags avec `ZTag`.
  - [x] Rendre la ligne de `keova.app` comme lien externe accessible via `<ZExternalLink href="https://keova.app">` avec indicateur de sortie (`.work__go`).
  - [x] Rendre les lignes de `TryOn` et `Nodium` sans balise lien externe afin d'éviter tout lien mort 404 (éléments interactifs locaux ou conteneurs non-liens).
  - [x] Styliser les lignes en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--accent-soft`, `--text-faint`, `--text-muted`, `--accent`).

- [x] Tâche 2 — Intégration des statistiques clés de réassurance (`.stats`) (AC: 2)
  - [x] Mettre à jour le tableau `stats` dans le script de `app/pages/index.vue` avec les 3 indicateurs cibles : `11` (années d'expérience web), `100%` (TypeScript & SaaS de bout en bout), `QA` (culture d'automatisation & zéro régression).
  - [x] Rendre les statistiques sous la liste des projets dans un conteneur `.stats`.
  - [x] Styliser les compteurs en typographie monospace (`var(--font-mono)`), taille fluide clamp, couleur d'accent (`var(--accent)`), avec adaptation responsive (3 colonnes sur desktop, 1 colonne sous 680px).

- [x] Tâche 3 — Intégration de la section Journal technique (AC: 3)
  - [x] Déclarer la requête `@nuxt/content` v3 via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())` dans `app/pages/index.vue`.
  - [x] Structurer la section avec l'eyebrow (`// ~/journal`), le titre de section et le lien d'en-tête vers `/blog` (`cat tous-les-articles →`).
  - [x] Rendre les cartes d'articles avec titre, tags `ZTag`, date formatée et lien vers la route d'article si la liste n'est pas vide.
  - [x] Prévoir le rendu de repli élégant lorsque la collection est vide (pas d'erreur, message sobre et invitation à visiter `/blog`).

- [x] Tâche 4 — Intégration du bloc CTA final de conversion (`.cta`) (AC: 4)
  - [x] Créer le bloc de clôture de page d'accueil `.cta` avant la fermeture du `<main>`.
  - [x] Ajouter l'eyebrow terminale (`$ ./contact --start`), le titre d'accroche avec mise en valeur de « en production » (`var(--accent)`), et le sous-titre commercial.
  - [x] Intégrer les trois actions : bouton primaire vers `/contact`, bouton externe vers le profil Malt (`SITE.profile.maltUrl`) avec `<ZButton :as="ZExternalLink">`, et bouton fantôme vers `/about`.
  - [x] Styliser le bloc avec une surface surélevée (`--surface-2` ou dégradé aubergine sombre), bordure subtile et padding généreux.

- [x] Tâche 5 — Validation qualité & Gate Docker (AC: 5)
  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier la propreté du rendu visuel, la fluidité des survols, la navigation au clavier (`Tab`, `:focus-visible`).
  - [x] Vérifier la complétion de la page d'accueil complète (Hero, Marquee, Services, Projets, Stats, Journal, CTA).

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)`, `var(--text-strong)`, `var(--text-muted)`, `var(--text-faint)`, `var(--accent)`, `var(--accent-soft)`, `var(--font-mono)`, `var(--fs-sm)`, `var(--space-6)`, etc.). [Source: AGENTS.md#Section 3]
- **Pas de préfixes vendeurs manuels :** Stylelint interdit les préfixes manuels comme `-webkit-*`. Les préfixes navigateurs sont injectés automatiquement par Autoprefixer/PostCSS au build. [Source: AGENTS.md#Section 3]
- **Accessibilité (a11y) dès la conception :**
  - Tout lien ouvrant un nouvel onglet DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`), garantissant `rel="noopener"` et l'annonce sr-only `(ouvre dans un nouvel onglet)`.
  - Les projets sans URL externe active (`TryOn`, `Nodium`) ne doivent PAS comporter de fausse balise `<a>` avec `href="#"` ou URL cassée menant à une 404.
  - Les listes de projets et de statistiques doivent être balisées en listes sémantiques `<ul>` et `<li>`.
  - Les éléments interactifs doivent conserver le repli standard pour contraste forcé (`forced-colors`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
- **DRY & Données :** Consommer `SITE.projects` et `SITE.profile` depuis `app/data/site.ts`. Ne jamais dupliquer les URLs, titres ou descriptions en dur.
- **SSG & Prerender Safety :** La récupération des articles de blog via `useAsyncData` et `queryCollection` est résolue au build Nitro. Aucun accès direct aux APIs navigateur sans garde SSR.

### Fichiers modifiés et créés
- **`app/pages/index.vue`** (UPDATE) : Refonte complète des sections projets sélectionnés, stats, ajout du journal technique et du bloc CTA final.

### Données & Textes exacts (Source : `sections-mapping.md`, `epics.md`, `contexte_malt.md`)
- **Projets sélectionnés :**
  - Keova : Rôle `Co-fondateur & Développeur Full Stack`, Statut `● En production`, URL `https://keova.app`.
  - TryOn : Rôle `CTO & Développeur Full Stack`, Statut `○ Étude de cas (MVP livré)`.
  - Nodium : Rôle `Créateur & Ingénieur IA`, Statut `◐ R&D / En cours`.
- **Stats de réassurance :**
  - `11` / `années d'expérience web`
  - `100%` / `TypeScript & SaaS de bout en bout`
  - `QA` / `culture d'automatisation & zéro régression`
- **Journal :**
  - Eyebrow : `// ~/journal`
  - Titre : `Notes de dev, écrites en construisant`
  - Lien : `cat tous-les-articles →` pointant vers `/blog`
- **CTA final :**
  - Eyebrow : `$ ./contact --start`
  - Titre : `Un projet en tête ? Mettons-le en production.`
  - Sous-titre : `Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
  - Boutons : `/contact` (« Discuter de votre projet »), `SITE.profile.maltUrl` (« Me contacter sur Malt »), `/about` (« Voir le parcours & CV »).

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash (Low)

### Debug Log References
- Gate de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques pré-rendues).
- Résolution des ajustements de formatage Prettier sur les balises de template et dégradés SCSS.

### Completion Notes List
- Implémentation complète de la section `.work` en liste sémantique `<ul>`/`<li>` avec les 3 projets SaaS issus de `SITE.projects` (Keova en lien `<ZExternalLink>`, TryOn et Nodium sans lien externe mort, tags `ZTag`, statuts et rôles).
- Intégration de la grille `.stats` responsive à 3 compteurs (`11`, `100%`, `QA`) avec police monospace et adaptation 1 colonne sur mobile.
- Intégration de la section Journal technique avec requête `@nuxt/content` v3 (`useAsyncData` + `queryCollection('blog').order('date', 'DESC').limit(3).all()`), lien vers `/blog` et état de repli élégant.
- Implémentation du bloc CTA final `.cta` avec eyebrow mono, titre percutant, sous-titre commercial et trois boutons d'action (`/contact`, lien Malt via `<ZExternalLink>`, et `/about`).
- Conformité stricte a11y : tokens CSS globaux, pas de valeurs en dur, `forced-colors` focus-visible, `prefers-reduced-motion: reduce`.
- Validation de la gate Docker verte à 100 % (13 routes SSG Nitro pré-rendues).

### File List
- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation des sections Projets SaaS, Statistiques, Journal technique et CTA final de conversion de la page d'accueil (Story 11.4). Gate Docker 100% verte. Status passé à review.

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
- [Profil Malt officiel : docs/contexte_malt.md]
- [Directives globales pour agents : AGENTS.md]
- [Leçons de la Story 11.3 : docs/implementation-artifacts/11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles.md]

exec
/bin/zsh -lc "rg -n -C 8 'Epic 11|Story 11\\.4|11\\.4|preuves concrètes|journal technique|CTA final|conversion' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
41-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
42-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
43-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
44-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
45-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
46-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
47-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
48-
49:#### Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial (SPEC-home-awwwards)
50-FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
51-FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
52-FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
55:FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
57:FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
58-FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
59-FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
60-
61-### NonFunctional Requirements
62-
63-NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
64-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
65-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
66-NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
67-NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
68-NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
69-NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
70-NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
71-NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
72:NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
73-NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
74-NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
75-
76-### Additional Requirements
77-
78-- Gestionnaire de paquets **pnpm** (corepack enable) sous Docker ; build statique `pnpm generate` → `.output/public` ; déploiement automatique GitHub Pages via `.github/workflows/cd.yml`.
79-- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
80-- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
81-- Blog via `@nuxt/content` markdown — dossier `content/`.
82-- Barre de qualité stricte = Docker-only gate (`pnpm lint && pnpm typecheck && pnpm generate`) avec 0 erreur et 13 routes pré-rendues.
83-- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
84:- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
85:- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
86-
87-### UX Design Requirements
88-
89-UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
90-UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
91-UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
92-UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
93-UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
--
104-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
105-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
106-UX-DR18: Pile atmosphérique `.atmos` avec 3 calques auroras floutés (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`), scanlines CRT et grille de points.
107-UX-DR19: Composant `BootOverlay` avec montée en charge progressive stylisée `jouan.os`, affichage des étapes, fermeture Escape/clic et mémorisation en session.
108-UX-DR20: Hero cinétique avec révélation progressive de texte, badge de disponibilité avec puce pulsée et lien Malt, et composant terminal simulant la frappe avec caret natif.
109-UX-DR21: Composant `StackMarquee` avec doublement des éléments pour défilement infini CSS fluide et pause sur `:hover`.
110-UX-DR22: Grille des 3 cartes de service avec numérotation terminale, promesse de valeur et tags technologiques (redirection `/services`).
111-UX-DR23: Section projets avec cartes en relief, badges de statut (`● En production`, `○ Étude de cas`, `◐ R&D`), intégration propre de TryOn sans lien mort 404, et 3 blocs compteurs statistiques.
112:UX-DR24: Bloc CTA de conversion avec fond aubergine contrasté, typographie Ubuntu et boutons d'action (contact + lien Malt via `<ZExternalLink>`).
113-UX-DR25: Micro-curseur interactif custom (`dot` + `ring`) réactif aux zones interactives (`data-hot`), actif uniquement sur desktop avec souris (`@media (hover: hover)`).
114-
115-### FR Coverage Map
116-
117-FR1: Epic 1 — Migration de la stack vers Nuxt 4
118-FR2: Epic 2 — Tokens du design system disponibles
119-FR3: Epic 2 — Primitives Vue réutilisables
120-FR4: Epic 2 — Châssis global (header/footer/nav/socials)
--
126-FR10: Epic 8 — Terminal easter-egg restylé
127-FR11: Epic 9 — Accessibilité & finitions motion
128-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
129-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
130-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
131-FR15: Epic 10 — SEO centralisé site-wide
132-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
133-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
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
144-
145-## Epic List
146-
147-### Epic 1: Migration de la stack vers Nuxt 4
148-Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
149-**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_
150-
151-### Epic 2: Fondations du design system
--
179-### Epic 9: Accessibilité & finitions motion
180-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
181-**FRs covered:** FR11 _(UX-DR17)_
182-
183-### Epic 10: Fin de refonte
184-La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
185-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
186-
187:### Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
188:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
189-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
190-
191----
192-
193-## Epic 1: Migration de la stack vers Nuxt 4
194-
195-Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
196-
--
698-
699-**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
700-**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
701-**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
702-**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
703-
704----
705-
706:## Epic 11: Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
707-
708:Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
709-
710-### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
711-
712-As a visiteur découvrant la page d'accueil,
713-I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
714-So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
715-
716-**Acceptance Criteria:**
--
750-
751-**Given** la stack moderne définie dans `SITE.skills` (TypeScript, Nuxt 4, Vue.js, NestJS, Node.js, PostgreSQL, TypeORM, Stripe Connect, Cypress, Docker, REST API, Vitest)
752-**When** on intègre le composant `StackMarquee` et la section des 3 services phares
753-**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
754-**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
755-**And** chaque carte oriente directement vers la route `/services` (aucune ancre intra-page `#`)
756-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
757-
758:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
759-
760-As a prospect cherchant des garanties avant prise de contact,
761-I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
762:So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).
763-
764-**Acceptance Criteria:**
765-
766-**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
767:**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
768-**Then** les projets affichent :
769-  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
770-  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
771-  - **Nodium** avec statut `◐ R&D / En cours` valorisant le laboratoire d'agents IA desktop
772-**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
773-**And** la section journal présente les articles récents du blog avec lien vers `/blog`
774:**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
775-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
776-
777-### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker
778-
779-As a mainteneur du site et garant de la qualité logicielle,
780-I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
781-So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).
782-
783-**Acceptance Criteria:**
784-
785:**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
786-**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
787-**Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
788-**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)
789-

exec
/bin/zsh -lc "sed -n '1,320p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
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
/bin/zsh -lc "sed -n '1,180p' docs/specs/spec-home-awwwards/SPEC.md && sed -n '1,220p' docs/specs/spec-home-awwwards/sections-mapping.md" in /Users/simon/dev/jouan.ovh
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
# Cartographie des sections & Adaptation Multi-pages

Ce document détaille la transposition de la maquette source `Home - Awwwards.html` vers l'architecture applicative Nuxt 4 de `jouan.ovh`, en application directe de la direction stratégique (`direction_strategique_site.md`) et du profil Malt (`contexte_malt.md`).

---

## 1. Principe directeur : Vitrine immersive vs Pages complètes

La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
Dans `jouan.ovh`, la home refondue agit comme un **entonnoir de conversion commercial**, orientant les visiteurs vers les pages complètes du site :

| Section Maquette Awwwards | Rôle sur la Home refondue | Contenu aligné Malt / Direction Stratégique | Destination / Route cible |
| :--- | :--- | :--- | :--- |
| **Navigation Header** | Menu de navigation du site | Liens directs vers les pages applicatives Nuxt. | Liens Nuxt vers `/services`, `/about`, `/blog`, `/contact`. |
| **Hero & Terminal** | Positionnement commercial immédiat | « Développeur Full Stack TypeScript — Nuxt / NestJS » + pitch création/évolution SaaS + badge Malt. | CTA primaire vers `/contact` (« Discuter de votre projet »), secondaire vers `/about`, lien externe vers profil Malt. |
| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
| **Services (3 cartes)** | Présentation des 3 offres ciblées | 1. Création d'apps web & SaaS<br>2. Dév Full Stack TypeScript<br>3. Évolution & architecture applicative | Cartes cliquables avec renvoi vers `/services` (où se trouve le déroulé du process en 4 étapes). |
| **Projets sélectionnés** | Preuves concrètes de réalisations SaaS | 1. **Keova** (SaaS ERP équestre Nuxt 4/NestJS/PostgreSQL/Stripe)<br>2. **TryOn** (SaaS IA générative Nuxt/NestJS/Python/ComfyUI)<br>3. **Nodium** (Lab d'agents IA desktop) | Liens externes vers les projets via `<ZExternalLink>`, renvoi vers `/about` pour le parcours complet (Kidizz, CINS). |
| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
| **Journal (Blog)** | Vitrine d'ingénierie logicielle | Les 3 derniers articles techniques du blog. | Lien global « Voir tous les articles » menant vers `/blog`. |
| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |

---

## 2. Découpage technique et éditorial des blocs

### A. Pile Atmosphérique (`.atmos`)
- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.

### B. Boot Sequence (`.boot`)
- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
- **Règles :**
  - S'efface automatiquement après 1 à 1.5s ou immédiatement au clic / touche Escape.
  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
  - Déclenche la frappe progressive du terminal hero à sa fermeture.

### C. Hero Commercial & Terminal Vitrine
- **Accroche commerciale :**
  - Sur-titre : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
  - Titre principal : `Développeur Full Stack TypeScript`
  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
  - Badge de statut : `● Disponible pour missions freelance · Profil Malt vérifié` (avec lien `<ZExternalLink>` vers Malt).
  - CTAs :
    - Principal : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
    - Secondaire : `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
- **Terminal vitrine :**
  - Simulation de frappe séquentielle :
    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`

### D. Marquee Stack Moderne
- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.

### E. Vitrine des Services (3 Offres Ciblées)
1. **Création d'applications web & SaaS**
   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
2. **Développement Full Stack TypeScript**
   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
   - *Technologies :* Vue 3, Nuxt, NestJS, Node.js, TypeORM.
3. **Évolution & Architecture applicative**
   - *Promesse :* Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).
   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.

### F. Preuves Concrètes & Projets Phares
- **1. Keova App (Pièce maîtresse SaaS en production) :**
  - Statut : `● En production`
  - Rôle : Co-fondateur & Développeur Full Stack
  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
- **2. TryOn (Étude de cas SaaS & IA générative) :**
  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
  - Rôle : CTO & Développeur Full Stack
  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
- **3. Nodium (Laboratoire R&D en cours) :**
  - Statut : `◐ R&D / En cours`
  - Rôle : Créateur & Ingénieur IA
  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
- **Statistiques clés de réassurance :**
  - `11` Années d'expérience web
  - `100%` TypeScript & SaaS de bout en bout
  - `QA` Culture d'automatisation & zéro régression

### G. Bloc CTA Final
- **Titre :** `Un projet d'application web ou SaaS ?`
- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
- **Actions :**
  - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
  - Bouton externe : `<ZExternalLink href="https://www.malt.fr/profile/simonjouan">Me contacter sur Malt</ZExternalLink>`

exec
/bin/zsh -lc "rg -n '"'^(diff --git|@@)|11'"\\.4|preuve|SaaS|journal|CTA|contact|saas|article|proof|conversion' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:diff --git a/app/pages/index.vue b/app/pages/index.vue
5:@@ -84,47 +84,149 @@
10:+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
50:+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
60:+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
65:+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
69:+            cat tous-les-articles
88:+        <!-- Liste des articles les plus récents -->
89:+        <ul v-if="articles && articles.length" class="journal">
90:+          <li v-for="article in articles" :key="article.path" class="journal__item">
91:+            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
93:+                v-if="article.image"
95:+                :src="article.image.src"
96:+                :alt="article.image.alt"
103:+                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
104:+                  <li v-for="tag in article.tags" :key="tag">
108:+                <h3 class="jpost__title">{{ article.title }}</h3>
109:+                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
111:+                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
112:+                  <template v-if="article.read">
114:+                    <span>{{ article.read }} de lecture</span>
131:+        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
132:+        <ZCard v-else class="journal__empty" padded>
133:+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
134:+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
140:+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
144:+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
147:+            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
151:+            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
163:+              Me contacter sur Malt
175:+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
179:@@ -149,7 +251,6 @@ interface HomeServiceOffer {
187:@@ -198,15 +299,20 @@ const services: HomeServiceOffer[] = [
192:+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
195:+// Chiffres clés de réassurance (Story 11.4 / AC-2).
199:-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
201:+  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
207:+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
208:+const { data: articles } = await useAsyncData("home-articles", () =>
214:@@ -515,37 +621,217 @@ usePageSeo({
395:+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
436:+.journal {
443:@@ -555,51 +841,150 @@ usePageSeo({
540:+.journal__empty {
548:+.journal__empty-code {
555:+.journal__empty-text {
563:+// ---- Bloc CTA final (porté de .cta) ----
616:@@ -610,7 +995,28 @@ usePageSeo({
621:+  .journal {
646:@@ -619,5 +1025,19 @@ usePageSeo({
666:diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
670:@@ -35,7 +35,7 @@
675:+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
679:@@ -122,6 +122,6 @@ development_status:
683:-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
684:+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review

exec
/bin/zsh -lc 'git diff --stat -- app/pages/index.vue docs/implementation-artifacts/sprint-status.yaml && git diff -- app/pages/index.vue docs/implementation-artifacts/sprint-status.yaml' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 app/pages/index.vue                              | 550 ++++++++++++++++++++---
 docs/implementation-artifacts/sprint-status.yaml |   4 +-
 2 files changed, 487 insertions(+), 67 deletions(-)
diff --git a/app/pages/index.vue b/app/pages/index.vue
index f49add5..8a04ba6 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -84,47 +84,149 @@
       </div>
     </section>
 
-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
     <section class="section section--sunken">
       <div class="container">
-        <div class="statrow">
-          <div v-for="stat in stats" :key="stat.id" class="stat">
+        <div class="block__head">
+          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
+          <h2 class="section__title">Des produits qui tournent en production</h2>
+        </div>
+
+        <ul class="work">
+          <li v-for="(project, index) in projects" :key="project.name">
+            <component
+              :is="project.url ? ZExternalLink : 'div'"
+              :href="project.url"
+              class="work__row"
+              :class="{ 'work__row--link': Boolean(project.url) }"
+              :data-hot="project.url ? '' : undefined"
+            >
+              <span class="work__no">0{{ index + 1 }}</span>
+              <div class="work__main">
+                <div class="work__topline">
+                  <h3 class="work__name">{{ project.name }}</h3>
+                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
+                </div>
+                <p class="work__role">{{ project.role }}</p>
+                <p class="prose work__desc">{{ project.desc }}</p>
+                <ul class="hero__tags work__tags">
+                  <li v-for="tag in project.tags" :key="tag">
+                    <ZTag>{{ tag }}</ZTag>
+                  </li>
+                </ul>
+              </div>
+              <span v-if="project.url" class="work__go" aria-hidden="true">
+                <ZIcon name="arrow" />
+              </span>
+            </component>
+          </li>
+        </ul>
+
+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
+        <ul class="stats">
+          <li v-for="stat in stats" :key="stat.id" class="stat">
             <b>{{ stat.value }}</b>
             <span>{{ stat.label }}</span>
+          </li>
+        </ul>
+      </div>
+    </section>
+
+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
+    <section class="section">
+      <div class="container">
+        <div class="block__head block__head--row">
+          <div>
+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
+            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
           </div>
+          <NuxtLink to="/blog" class="seeall" data-hot>
+            cat tous-les-articles
+            <ZIcon name="arrow" class="seeall__icon" />
+          </NuxtLink>
         </div>
 
-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
-        <ul class="grid-2 projects">
-          <li v-for="project in projects" :key="project.name">
-            <ZCard
-              class="project"
-              :interactive="Boolean(project.url)"
-              :data-hot="Boolean(project.url) ? '' : undefined"
-              :as="project.url ? ZExternalLink : 'div'"
-              :href="project.url || undefined"
-              :rel="project.url ? 'noopener noreferrer' : undefined"
-            >
-              <div class="project__head">
-                <h3 class="project__name">{{ project.name }}</h3>
-                <span class="project__role">{{ project.role }}</span>
+        <!-- Liste des articles les plus récents -->
+        <ul v-if="articles && articles.length" class="journal">
+          <li v-for="article in articles" :key="article.path" class="journal__item">
+            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
+              <NuxtImg
+                v-if="article.image"
+                class="jpost__thumb"
+                :src="article.image.src"
+                :alt="article.image.alt"
+                width="360"
+                height="200"
+                sizes="360px"
+                format="webp"
+              />
+              <div class="jpost__body">
+                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
+                  <li v-for="tag in article.tags" :key="tag">
+                    <ZTag>{{ tag }}</ZTag>
+                  </li>
+                </ul>
+                <h3 class="jpost__title">{{ article.title }}</h3>
+                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
+                <div class="jpost__meta">
+                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
+                  <template v-if="article.read">
+                    <span aria-hidden="true">·</span>
+                    <span>{{ article.read }} de lecture</span>
+                  </template>
+                  <span class="jpost__arrow" aria-hidden="true">
+                    <ZIcon name="arrow" />
+                  </span>
+                </div>
               </div>
-              <p class="prose project__desc">{{ project.desc }}</p>
-              <ul class="hero__tags">
-                <li v-for="tag in project.tags" :key="tag">
-                  <ZTag>{{ tag }}</ZTag>
-                </li>
-              </ul>
             </ZCard>
           </li>
         </ul>
+
+        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
+        <ZCard v-else class="journal__empty" padded>
+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
+          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
+        </ZCard>
+      </div>
+    </section>
+
+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
+    <section class="section section--sunken">
+      <div class="container">
+        <div class="cta">
+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
+          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
+          <p class="cta__subtitle">
+            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
+            parlons-en.
+          </p>
+          <div class="cta__actions">
+            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
+              Discuter de votre projet
+              <template #iconRight><ZIcon name="arrow" /></template>
+            </ZButton>
+            <ZButton
+              v-if="SITE.profile.maltUrl"
+              :as="ZExternalLink"
+              :href="SITE.profile.maltUrl"
+              variant="secondary"
+              size="lg"
+              data-hot
+            >
+              Me contacter sur Malt
+            </ZButton>
+            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
+          </div>
+        </div>
       </div>
     </section>
   </main>
 </template>
 
 <script setup lang="ts">
-// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
 // Architecture multi-pages Nuxt 4, dark-first, accent orange.
 import { ref } from "vue";
 import { NuxtLink, ZExternalLink } from "#components";
@@ -149,7 +251,6 @@ interface HomeServiceOffer {
 }
 
 // Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
-// Remplacement complet des données legacy.
 const services: HomeServiceOffer[] = [
   {
     id: "creation",
@@ -198,15 +299,20 @@ const services: HomeServiceOffer[] = [
   },
 ];
 
-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
+const projects = SITE.projects;
+
+// Chiffres clés de réassurance (Story 11.4 / AC-2).
 const stats = [
-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
+  { id: "stat-1", value: "11", label: "années d'expérience web" },
+  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
+  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
 ];
 
-// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
-const projects = SITE.projects;
+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
+const { data: articles } = await useAsyncData("home-articles", () =>
+  queryCollection("blog").order("date", "DESC").limit(3).all(),
+);
 
 const siteUrl = useSiteUrl();
 const homeJsonLd = [
@@ -515,37 +621,217 @@ usePageSeo({
   }
 }
 
-// ---- Stats (porté de .statrow / .stat) ----
-.statrow {
+// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
+.work {
+  display: flex;
+  flex-direction: column;
+  margin: 0;
+  padding: 0;
+  list-style: none;
+
+  > li {
+    display: block;
+    width: 100%;
+  }
+}
+
+.work__row {
+  position: relative;
+  display: grid;
+  grid-template-columns: 56px 1fr auto;
+  gap: var(--space-6);
+  align-items: center;
+  padding: var(--space-8) var(--space-3);
+  border-top: 1px solid var(--border-subtle);
+  text-decoration: none;
+  color: inherit;
+  transition:
+    padding-left var(--dur-slow) var(--ease-out),
+    background var(--dur-slow) var(--ease-standard);
+
+  &::before {
+    content: "";
+    position: absolute;
+    inset: 0;
+    background: linear-gradient(90deg, var(--accent-soft), transparent 60%);
+    opacity: 0;
+    transition: opacity var(--dur-slow) var(--ease-standard);
+  }
+}
+
+li:last-child .work__row {
+  border-bottom: 1px solid var(--border-subtle);
+}
+
+.work__row--link {
+  cursor: pointer;
+
+  &:hover {
+    padding-left: var(--space-6);
+
+    &::before {
+      opacity: 1;
+    }
+
+    .work__name {
+      color: var(--accent);
+    }
+
+    .work__go {
+      color: var(--accent);
+      transform: translate(6px, -6px);
+    }
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
+.work__no {
+  position: relative;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-faint);
+}
+
+.work__main {
+  position: relative;
+}
+
+.work__topline {
   display: flex;
   flex-wrap: wrap;
-  gap: var(--space-12);
+  align-items: baseline;
+  gap: var(--space-3);
+}
 
-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
-  margin-bottom: var(--space-12);
+.work__name {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: clamp(1.4rem, 2.8vw, 2rem);
+  font-weight: var(--fw-regular);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
 }
 
-.stat {
+.work__status {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--accent);
+  letter-spacing: var(--ls-wide);
+}
+
+.work__role {
+  margin: var(--space-1) 0 0;
   font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--text-muted);
+}
+
+.work__desc {
+  max-width: 65ch;
+  margin: var(--space-3) 0 0;
+  font-size: var(--fs-sm);
+}
+
+.work__tags {
+  margin-top: var(--space-4);
+}
+
+.work__go {
+  position: relative;
+  font-size: var(--fs-xl);
+  color: var(--text-faint);
+  transition:
+    transform var(--dur-base) var(--ease-out),
+    color var(--dur-base) var(--ease-standard);
+}
+
+// ---- Stats (porté de .stats) ----
+.stats {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-4);
+  margin: var(--space-12) 0 0;
+  padding: 0;
+  list-style: none;
+}
+
+.stat {
+  padding: var(--space-6);
+  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
 
   b {
     display: block;
-    font-size: var(--fs-4xl);
+    margin-bottom: var(--space-1);
+    font-family: var(--font-mono);
+    font-size: var(--fs-5xl);
     font-weight: var(--fw-light);
+    line-height: 1;
+    letter-spacing: var(--ls-tight);
     color: var(--text-strong);
   }
 
   span {
+    font-family: var(--font-mono);
     font-size: var(--fs-sm);
+    letter-spacing: var(--ls-wide);
     color: var(--text-muted);
   }
 }
 
-// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
-.grid-2 {
-  display: grid;
-  grid-template-columns: 1fr 1fr;
+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
+.block__head--row {
+  display: flex;
+  align-items: flex-end;
+  justify-content: space-between;
   gap: var(--space-6);
+  margin-bottom: var(--space-8);
+
+  .section__title {
+    margin-bottom: 0;
+  }
+}
+
+.seeall {
+  display: inline-flex;
+  flex: none;
+  align-items: center;
+  gap: var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
+  text-decoration: none;
+  white-space: nowrap;
+  transition: color var(--dur-base) var(--ease-standard);
+
+  &:hover {
+    color: var(--accent);
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
+.seeall__icon {
+  font-size: var(--fs-base);
+}
+
+.journal {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-5);
   margin: 0;
   padding: 0;
   list-style: none;
@@ -555,51 +841,150 @@ usePageSeo({
   }
 }
 
-.projects {
-  margin-top: var(--space-5);
-}
-
-// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
-// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
-.project {
+.jpost {
   display: flex;
   flex-direction: column;
   width: 100%;
+  color: inherit;
   text-decoration: none;
 
-  .hero__tags {
-    margin-top: auto;
+  &:hover {
+    .jpost__title {
+      color: var(--accent);
+    }
+
+    .jpost__arrow {
+      color: var(--accent);
+      transform: translate(4px, -4px);
+    }
   }
 }
 
-.project__head {
+.jpost__thumb {
+  width: 100%;
+  height: 160px;
+  object-fit: cover;
+  border-bottom: 1px solid var(--border-subtle);
+}
+
+.jpost__body {
   display: flex;
-  align-items: baseline;
-  justify-content: space-between;
-  gap: var(--space-3);
+  flex: 1;
+  flex-direction: column;
+  padding: var(--space-5);
 }
 
-.project__name {
-  margin: 0;
+.jpost__tags {
+  margin-bottom: var(--space-3);
+}
+
+.jpost__title {
+  margin: 0 0 var(--space-2);
   font-family: var(--font-mono);
-  font-size: var(--fs-xl);
+  font-size: var(--fs-lg);
   font-weight: var(--fw-regular);
+  line-height: var(--lh-snug);
   color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
+}
+
+.jpost__desc {
+  margin: 0 0 var(--space-4);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
 }
 
-.project__role {
+.jpost__meta {
+  display: flex;
+  align-items: center;
+  gap: var(--space-2);
+  margin-top: auto;
+  padding-top: var(--space-4);
+  border-top: 1px dashed var(--border-subtle);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  color: var(--text-muted);
-  white-space: nowrap;
+  color: var(--text-faint);
+}
+
+.jpost__arrow {
+  margin-left: auto;
+  font-size: var(--fs-base);
+  color: var(--text-faint);
+  transition:
+    transform var(--dur-base) var(--ease-out),
+    color var(--dur-base) var(--ease-standard);
+}
+
+.journal__empty {
+  max-width: 60ch;
+  margin: 0 auto;
+  text-align: center;
 }
 
-.project__desc {
-  margin: var(--space-3) 0 var(--space-4);
+.journal__empty-code {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
   font-size: var(--fs-sm);
+  color: var(--accent);
+}
+
+.journal__empty-text {
+  margin: 0 0 var(--space-5);
+  font-family: var(--font-sans);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
+}
+
+// ---- Bloc CTA final (porté de .cta) ----
+.cta {
+  position: relative;
+  padding: clamp(48px, 6vw, 72px) var(--space-6);
+  overflow: hidden;
+  text-align: center;
+  background:
+    radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%),
+    color-mix(in srgb, var(--surface-2) 60%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-lg);
+}
+
+.cta__eyebrow {
+  display: inline-block;
+}
+
+.cta__title {
+  margin: 0 0 var(--space-4);
+  font-family: var(--font-mono);
+  font-size: clamp(1.8rem, 4vw, 2.8rem);
+  font-weight: var(--fw-light);
+  line-height: var(--lh-tight);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+}
+
+.cta__highlight {
+  font-style: italic;
+  color: var(--accent);
+}
+
+.cta__subtitle {
+  max-width: 58ch;
+  margin: 0 auto var(--space-8);
+  font-family: var(--font-sans);
+  font-size: var(--fs-base);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
 }
 
-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
+.cta__actions {
+  display: flex;
+  flex-wrap: wrap;
+  gap: var(--space-4);
+  justify-content: center;
+}
+
+// ---- Responsive ----
 @media (width <= 900px) {
   .hero__grid {
     grid-template-columns: 1fr;
@@ -610,7 +995,28 @@ usePageSeo({
   }
 
   .grid-3,
-  .grid-2 {
+  .journal {
+    grid-template-columns: 1fr;
+  }
+
+  .block__head--row {
+    flex-direction: column;
+    align-items: flex-start;
+  }
+}
+
+@media (width <= 680px) {
+  .work__row {
+    grid-template-columns: 1fr;
+    gap: var(--space-3);
+  }
+
+  .work__no,
+  .work__go {
+    display: none;
+  }
+
+  .stats {
     grid-template-columns: 1fr;
   }
 }
@@ -619,5 +1025,19 @@ usePageSeo({
   .anim {
     animation: none;
   }
+
+  .work__row,
+  .work__go,
+  .jpost__arrow {
+    transition: none;
+  }
+
+  .work__row--link:hover {
+    padding-left: var(--space-3);
+
+    .work__go {
+      transform: none;
+    }
+  }
 }
 </style>
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index d8c88fd..e661d81 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.3 done : Marquee stack & Vitrine services)"
+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -122,6 +122,6 @@ development_status:
   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: backlog
   epic-11-retrospective: optional

2026-09-13T19:22:57.956342Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,360p' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/index.vue b/app/pages/index.vue
index f49add5..8a04ba6 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -84,47 +84,149 @@
       </div>
     </section>
 
-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
     <section class="section section--sunken">
       <div class="container">
-        <div class="statrow">
-          <div v-for="stat in stats" :key="stat.id" class="stat">
+        <div class="block__head">
+          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
+          <h2 class="section__title">Des produits qui tournent en production</h2>
+        </div>
+
+        <ul class="work">
+          <li v-for="(project, index) in projects" :key="project.name">
+            <component
+              :is="project.url ? ZExternalLink : 'div'"
+              :href="project.url"
+              class="work__row"
+              :class="{ 'work__row--link': Boolean(project.url) }"
+              :data-hot="project.url ? '' : undefined"
+            >
+              <span class="work__no">0{{ index + 1 }}</span>
+              <div class="work__main">
+                <div class="work__topline">
+                  <h3 class="work__name">{{ project.name }}</h3>
+                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
+                </div>
+                <p class="work__role">{{ project.role }}</p>
+                <p class="prose work__desc">{{ project.desc }}</p>
+                <ul class="hero__tags work__tags">
+                  <li v-for="tag in project.tags" :key="tag">
+                    <ZTag>{{ tag }}</ZTag>
+                  </li>
+                </ul>
+              </div>
+              <span v-if="project.url" class="work__go" aria-hidden="true">
+                <ZIcon name="arrow" />
+              </span>
+            </component>
+          </li>
+        </ul>
+
+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
+        <ul class="stats">
+          <li v-for="stat in stats" :key="stat.id" class="stat">
             <b>{{ stat.value }}</b>
             <span>{{ stat.label }}</span>
+          </li>
+        </ul>
+      </div>
+    </section>
+
+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
+    <section class="section">
+      <div class="container">
+        <div class="block__head block__head--row">
+          <div>
+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
+            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
           </div>
+          <NuxtLink to="/blog" class="seeall" data-hot>
+            cat tous-les-articles
+            <ZIcon name="arrow" class="seeall__icon" />
+          </NuxtLink>
         </div>
 
-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
-        <ul class="grid-2 projects">
-          <li v-for="project in projects" :key="project.name">
-            <ZCard
-              class="project"
-              :interactive="Boolean(project.url)"
-              :data-hot="Boolean(project.url) ? '' : undefined"
-              :as="project.url ? ZExternalLink : 'div'"
-              :href="project.url || undefined"
-              :rel="project.url ? 'noopener noreferrer' : undefined"
-            >
-              <div class="project__head">
-                <h3 class="project__name">{{ project.name }}</h3>
-                <span class="project__role">{{ project.role }}</span>
+        <!-- Liste des articles les plus récents -->
+        <ul v-if="articles && articles.length" class="journal">
+          <li v-for="article in articles" :key="article.path" class="journal__item">
+            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
+              <NuxtImg
+                v-if="article.image"
+                class="jpost__thumb"
+                :src="article.image.src"
+                :alt="article.image.alt"
+                width="360"
+                height="200"
+                sizes="360px"
+                format="webp"
+              />
+              <div class="jpost__body">
+                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
+                  <li v-for="tag in article.tags" :key="tag">
+                    <ZTag>{{ tag }}</ZTag>
+                  </li>
+                </ul>
+                <h3 class="jpost__title">{{ article.title }}</h3>
+                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
+                <div class="jpost__meta">
+                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
+                  <template v-if="article.read">
+                    <span aria-hidden="true">·</span>
+                    <span>{{ article.read }} de lecture</span>
+                  </template>
+                  <span class="jpost__arrow" aria-hidden="true">
+                    <ZIcon name="arrow" />
+                  </span>
+                </div>
               </div>
-              <p class="prose project__desc">{{ project.desc }}</p>
-              <ul class="hero__tags">
-                <li v-for="tag in project.tags" :key="tag">
-                  <ZTag>{{ tag }}</ZTag>
-                </li>
-              </ul>
             </ZCard>
           </li>
         </ul>
+
+        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
+        <ZCard v-else class="journal__empty" padded>
+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
+          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
+        </ZCard>
+      </div>
+    </section>
+
+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
+    <section class="section section--sunken">
+      <div class="container">
+        <div class="cta">
+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
+          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
+          <p class="cta__subtitle">
+            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
+            parlons-en.
+          </p>
+          <div class="cta__actions">
+            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
+              Discuter de votre projet
+              <template #iconRight><ZIcon name="arrow" /></template>
+            </ZButton>
+            <ZButton
+              v-if="SITE.profile.maltUrl"
+              :as="ZExternalLink"
+              :href="SITE.profile.maltUrl"
+              variant="secondary"
+              size="lg"
+              data-hot
+            >
+              Me contacter sur Malt
+            </ZButton>
+            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
+          </div>
+        </div>
       </div>
     </section>
   </main>
 </template>
 
 <script setup lang="ts">
-// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
 // Architecture multi-pages Nuxt 4, dark-first, accent orange.
 import { ref } from "vue";
 import { NuxtLink, ZExternalLink } from "#components";
@@ -149,7 +251,6 @@ interface HomeServiceOffer {
 }
 
 // Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
-// Remplacement complet des données legacy.
 const services: HomeServiceOffer[] = [
   {
     id: "creation",
@@ -198,15 +299,20 @@ const services: HomeServiceOffer[] = [
   },
 ];
 
-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
+const projects = SITE.projects;
+
+// Chiffres clés de réassurance (Story 11.4 / AC-2).
 const stats = [
-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
+  { id: "stat-1", value: "11", label: "années d'expérience web" },
+  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
+  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
 ];
 
-// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
-const projects = SITE.projects;
+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
+const { data: articles } = await useAsyncData("home-articles", () =>
+  queryCollection("blog").order("date", "DESC").limit(3).all(),
+);
 
 const siteUrl = useSiteUrl();
 const homeJsonLd = [
@@ -515,37 +621,217 @@ usePageSeo({
   }
 }
 
-// ---- Stats (porté de .statrow / .stat) ----
-.statrow {
+// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
+.work {
+  display: flex;
+  flex-direction: column;
+  margin: 0;
+  padding: 0;
+  list-style: none;
+
+  > li {
+    display: block;
+    width: 100%;
+  }
+}
+
+.work__row {
+  position: relative;
+  display: grid;
+  grid-template-columns: 56px 1fr auto;
+  gap: var(--space-6);
+  align-items: center;
+  padding: var(--space-8) var(--space-3);
+  border-top: 1px solid var(--border-subtle);
+  text-decoration: none;
+  color: inherit;
+  transition:
+    padding-left var(--dur-slow) var(--ease-out),
+    background var(--dur-slow) var(--ease-standard);
+
+  &::before {
+    content: "";
+    position: absolute;
+    inset: 0;
+    background: linear-gradient(90deg, var(--accent-soft), transparent 60%);
+    opacity: 0;
+    transition: opacity var(--dur-slow) var(--ease-standard);
+  }
+}
+
+li:last-child .work__row {
+  border-bottom: 1px solid var(--border-subtle);
+}
+
+.work__row--link {
+  cursor: pointer;
+
+  &:hover {
+    padding-left: var(--space-6);
+
+    &::before {
+      opacity: 1;
+    }
+
+    .work__name {
+      color: var(--accent);
+    }
+
+    .work__go {
+      color: var(--accent);
+      transform: translate(6px, -6px);
+    }
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
+.work__no {
+  position: relative;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-faint);
+}
+
+.work__main {
+  position: relative;
+}
+
+.work__topline {
   display: flex;
   flex-wrap: wrap;
-  gap: var(--space-12);
+  align-items: baseline;
+  gap: var(--space-3);
+}
 
-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
-  margin-bottom: var(--space-12);
+.work__name {
+  margin: 0;
+  font-family: var(--font-mono);
+  font-size: clamp(1.4rem, 2.8vw, 2rem);
+  font-weight: var(--fw-regular);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
 }
 
-.stat {
+.work__status {
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--accent);
+  letter-spacing: var(--ls-wide);
+}
+
+.work__role {
+  margin: var(--space-1) 0 0;
   font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  color: var(--text-muted);
+}
+
+.work__desc {
+  max-width: 65ch;
+  margin: var(--space-3) 0 0;
+  font-size: var(--fs-sm);
+}
+
+.work__tags {
+  margin-top: var(--space-4);
+}
+
+.work__go {
+  position: relative;
+  font-size: var(--fs-xl);
+  color: var(--text-faint);
+  transition:
+    transform var(--dur-base) var(--ease-out),
+    color var(--dur-base) var(--ease-standard);
+}
+
+// ---- Stats (porté de .stats) ----
+.stats {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-4);
+  margin: var(--space-12) 0 0;

2026-09-13T19:23:01.159213Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '361,686p' docs/implementation-artifacts/code-reviews/11-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  padding: 0;
+  list-style: none;
+}
+
+.stat {
+  padding: var(--space-6);
+  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
 
   b {
     display: block;
-    font-size: var(--fs-4xl);
+    margin-bottom: var(--space-1);
+    font-family: var(--font-mono);
+    font-size: var(--fs-5xl);
     font-weight: var(--fw-light);
+    line-height: 1;
+    letter-spacing: var(--ls-tight);
     color: var(--text-strong);
   }
 
   span {
+    font-family: var(--font-mono);
     font-size: var(--fs-sm);
+    letter-spacing: var(--ls-wide);
     color: var(--text-muted);
   }
 }
 
-// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
-.grid-2 {
-  display: grid;
-  grid-template-columns: 1fr 1fr;
+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
+.block__head--row {
+  display: flex;
+  align-items: flex-end;
+  justify-content: space-between;
   gap: var(--space-6);
+  margin-bottom: var(--space-8);
+
+  .section__title {
+    margin-bottom: 0;
+  }
+}
+
+.seeall {
+  display: inline-flex;
+  flex: none;
+  align-items: center;
+  gap: var(--space-2);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
+  text-decoration: none;
+  white-space: nowrap;
+  transition: color var(--dur-base) var(--ease-standard);
+
+  &:hover {
+    color: var(--accent);
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
+.seeall__icon {
+  font-size: var(--fs-base);
+}
+
+.journal {
+  display: grid;
+  grid-template-columns: repeat(3, 1fr);
+  gap: var(--space-5);
   margin: 0;
   padding: 0;
   list-style: none;
@@ -555,51 +841,150 @@ usePageSeo({
   }
 }
 
-.projects {
-  margin-top: var(--space-5);
-}
-
-// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
-// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
-.project {
+.jpost {
   display: flex;
   flex-direction: column;
   width: 100%;
+  color: inherit;
   text-decoration: none;
 
-  .hero__tags {
-    margin-top: auto;
+  &:hover {
+    .jpost__title {
+      color: var(--accent);
+    }
+
+    .jpost__arrow {
+      color: var(--accent);
+      transform: translate(4px, -4px);
+    }
   }
 }
 
-.project__head {
+.jpost__thumb {
+  width: 100%;
+  height: 160px;
+  object-fit: cover;
+  border-bottom: 1px solid var(--border-subtle);
+}
+
+.jpost__body {
   display: flex;
-  align-items: baseline;
-  justify-content: space-between;
-  gap: var(--space-3);
+  flex: 1;
+  flex-direction: column;
+  padding: var(--space-5);
 }
 
-.project__name {
-  margin: 0;
+.jpost__tags {
+  margin-bottom: var(--space-3);
+}
+
+.jpost__title {
+  margin: 0 0 var(--space-2);
   font-family: var(--font-mono);
-  font-size: var(--fs-xl);
+  font-size: var(--fs-lg);
   font-weight: var(--fw-regular);
+  line-height: var(--lh-snug);
   color: var(--text-strong);
+  transition: color var(--dur-base) var(--ease-standard);
+}
+
+.jpost__desc {
+  margin: 0 0 var(--space-4);
+  font-size: var(--fs-sm);
+  color: var(--text-muted);
 }
 
-.project__role {
+.jpost__meta {
+  display: flex;
+  align-items: center;
+  gap: var(--space-2);
+  margin-top: auto;
+  padding-top: var(--space-4);
+  border-top: 1px dashed var(--border-subtle);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
-  color: var(--text-muted);
-  white-space: nowrap;
+  color: var(--text-faint);
+}
+
+.jpost__arrow {
+  margin-left: auto;
+  font-size: var(--fs-base);
+  color: var(--text-faint);
+  transition:
+    transform var(--dur-base) var(--ease-out),
+    color var(--dur-base) var(--ease-standard);
+}
+
+.journal__empty {
+  max-width: 60ch;
+  margin: 0 auto;
+  text-align: center;
 }
 
-.project__desc {
-  margin: var(--space-3) 0 var(--space-4);
+.journal__empty-code {
+  margin: 0 0 var(--space-2);
+  font-family: var(--font-mono);
   font-size: var(--fs-sm);
+  color: var(--accent);
+}
+
+.journal__empty-text {
+  margin: 0 0 var(--space-5);
+  font-family: var(--font-sans);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
+}
+
+// ---- Bloc CTA final (porté de .cta) ----
+.cta {
+  position: relative;
+  padding: clamp(48px, 6vw, 72px) var(--space-6);
+  overflow: hidden;
+  text-align: center;
+  background:
+    radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%),
+    color-mix(in srgb, var(--surface-2) 60%, transparent);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-lg);
+}
+
+.cta__eyebrow {
+  display: inline-block;
+}
+
+.cta__title {
+  margin: 0 0 var(--space-4);
+  font-family: var(--font-mono);
+  font-size: clamp(1.8rem, 4vw, 2.8rem);
+  font-weight: var(--fw-light);
+  line-height: var(--lh-tight);
+  letter-spacing: var(--ls-tight);
+  color: var(--text-strong);
+}
+
+.cta__highlight {
+  font-style: italic;
+  color: var(--accent);
+}
+
+.cta__subtitle {
+  max-width: 58ch;
+  margin: 0 auto var(--space-8);
+  font-family: var(--font-sans);
+  font-size: var(--fs-base);
+  line-height: var(--lh-relaxed);
+  color: var(--text-muted);
 }
 
-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
+.cta__actions {
+  display: flex;
+  flex-wrap: wrap;
+  gap: var(--space-4);
+  justify-content: center;
+}
+
+// ---- Responsive ----
 @media (width <= 900px) {
   .hero__grid {
     grid-template-columns: 1fr;
@@ -610,7 +995,28 @@ usePageSeo({
   }
 
   .grid-3,
-  .grid-2 {
+  .journal {
+    grid-template-columns: 1fr;
+  }
+
+  .block__head--row {
+    flex-direction: column;
+    align-items: flex-start;
+  }
+}
+
+@media (width <= 680px) {
+  .work__row {
+    grid-template-columns: 1fr;
+    gap: var(--space-3);
+  }
+
+  .work__no,
+  .work__go {
+    display: none;
+  }
+
+  .stats {
     grid-template-columns: 1fr;
   }
 }
@@ -619,5 +1025,19 @@ usePageSeo({
   .anim {
     animation: none;
   }
+
+  .work__row,
+  .work__go,
+  .jpost__arrow {
+    transition: none;
+  }
+
+  .work__row--link:hover {
+    padding-left: var(--space-3);
+
+    .work__go {
+      transform: none;
+    }
+  }
 }
 </style>
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index d8c88fd..e661d81 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.3 done : Marquee stack & Vitrine services)"
+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -122,6 +122,6 @@ development_status:
   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: backlog
   epic-11-retrospective: optional

2026-09-13T19:23:03.816986Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZExternalLink.vue && sed -n '1,280p' app/components/ui/ZButton.vue && sed -n '1,260p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
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
  color: var(--term-green);
  border-color: var(--accent-2-soft);

  &:hover {
    border-color: var(--term-green);
    box-shadow: var(--glow-terminal);
  }
}

.zbtn--danger {
  background: var(--danger);
  color: var(--ink-on-accent);
  border-color: var(--danger);

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(1px);
  }
}

// Parité a11y avec les autres primitives (ZCard/ZInput/ZTag) : pas de transition
// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
@media (prefers-reduced-motion: reduce) {
  .zbtn {
    transition: none;
  }
}
</style>
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

exec
/bin/zsh -lc "sed -n '260,560p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",
    points: [
      "Architecture logicielle & APIs REST",
      "Applications Vue 3 / Nuxt 4 & NestJS",
      "Intégration Stripe & PostgreSQL",
    ],
    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
    price: "Sur devis / au sprint",
    featured: false,
  },
  {
    id: "fullstack",
    no: "02 / 03",
    icon: "layers",
    title: "Développement Full Stack TypeScript",
    desc: "Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.",
    points: [
      "Composants Vue 3 / Nuxt avec TypeScript strict",
      "Microservices & backend modulaire NestJS",
      "Fiabilisation et optimisation des performances",
    ],
    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
    price: "Sur devis / TJM",
    featured: true,
  },
  {
    id: "evolution",
    no: "03 / 03",
    icon: "spark",
    title: "Évolution & Architecture applicative",
    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
    points: [
      "Audits techniques de code & migrations de versions",
      "Tests E2E Cypress & tests unitaires Vitest",
      "Pipelines CI/CD & conteneurisation Docker",
    ],
    tags: ["Cypress", "Vitest", "Docker", "CI/CD"],
    price: "Au forfait / audit",
    featured: false,
  },
];

// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
const projects = SITE.projects;

// Chiffres clés de réassurance (Story 11.4 / AC-2).
const stats = [
  { id: "stat-1", value: "11", label: "années d'expérience web" },
  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
];

// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
const { data: articles } = await useAsyncData("home-articles", () =>
  queryCollection("blog").order("date", "DESC").limit(3).all(),
);

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

    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: var(--ring-accent);
    }
  }
}

.hero__pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: var(--success);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  animation: pulse-dot 2.2s infinite var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes pulse-dot {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
  }

  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
  }
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

exec
/bin/zsh -lc "sed -n '1,260p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="home">
    <ClientOnly>
      <HomeBootOverlay @boot-complete="onBootComplete" />
    </ClientOnly>
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
              <span>Disponible pour missions freelance</span>
              <template v-if="SITE.profile.maltUrl">
                <span aria-hidden="true"> · </span>
                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
              </template>
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

    <!-- Ruban défilant de la stack moderne (Story 11.3 / AC-1) -->
    <HomeStackMarquee />

    <!-- Vitrine des 3 services cibles (Story 11.3 / AC-2) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
        <h2 class="section__title">Trois expertises pour concevoir et faire évoluer vos applications</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
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

    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    <section class="section section--sunken">
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
            >
              <span class="work__no">0{{ index + 1 }}</span>
              <div class="work__main">
                <div class="work__topline">
                  <h3 class="work__name">{{ project.name }}</h3>
                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
                </div>
                <p class="work__role">{{ project.role }}</p>
                <p class="prose work__desc">{{ project.desc }}</p>
                <ul class="hero__tags work__tags">
                  <li v-for="tag in project.tags" :key="tag">
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
            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
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
                  <li v-for="tag in article.tags" :key="tag">
                    <ZTag>{{ tag }}</ZTag>
                  </li>
                </ul>
                <h3 class="jpost__title">{{ article.title }}</h3>
                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
                <div class="jpost__meta">
                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
                  <template v-if="article.read">
                    <span aria-hidden="true">·</span>
                    <span>{{ article.read }} de lecture</span>
                  </template>
                  <span class="jpost__arrow" aria-hidden="true">
                    <ZIcon name="arrow" />
                  </span>
                </div>
              </div>
            </ZCard>
          </li>
        </ul>

        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
        <ZCard v-else class="journal__empty" padded>
          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
        </ZCard>
      </div>
    </section>

    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="cta">
          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
          <p class="cta__subtitle">
            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
            parlons-en.
          </p>
          <div class="cta__actions">
            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
              Discuter de votre projet
              <template #iconRight><ZIcon name="arrow" /></template>
            </ZButton>
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
import { ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);

function onBootComplete() {
  isBootFinished.value = true;
}

interface HomeServiceOffer {
  id: string;
  no: string;
  icon: "code" | "layers" | "spark";
  title: string;
  desc: string;
  points: string[];
  tags: string[];
  price: string;
  featured: boolean;
}

// Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
const services: HomeServiceOffer[] = [
  {
    id: "creation",
    no: "01 / 03",
    icon: "code",
    title: "Création d'applications web & SaaS",
    desc: "De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.",

exec
/bin/zsh -lc "sed -n '1,260p' app/data/site.ts && sed -n '1,220p' content.config.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      // type "page" fournit déjà title/description/path/body ; on type ici les champs
      // additionnels consommés par la liste du blog (tri par date, tags, temps de lecture).
      schema: z.object({
        // Date ISO (YYYY-MM-DD) : tri lexicographique = tri chronologique, formatée en
        // français à l'affichage. Sert au `.order("date", "DESC")`. Le `regex` fait
        // échouer le build sur un format dévié (plutôt qu'un « Invalid Date » à l'écran
        // et un tri faux).
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date doit être au format ISO YYYY-MM-DD"),
        // Tags (technos / sujets) rendus en ZTag.
        tags: z.array(z.string()).default([]),
        // Temps de lecture affiché dans la méta (ex. "8 min").
        read: z.string().optional(),
        // Vignette d'article (facultative).
        image: z
          .object({
            src: z.string(),
            alt: z.string(),
          })
          .optional(),
      }),
    }),
  },
});

exec
/bin/zsh -lc "rg -n -C 5 '11\\.4|FR23|FR24|FR25|CAP-6|CAP-7|CAP-8|Story 11\\.4' docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/specs/spec-home-awwwards/sections-mapping.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/specs/spec-home-awwwards/SPEC.md-41-
docs/specs/spec-home-awwwards/SPEC.md-42-- id: CAP-5
docs/specs/spec-home-awwwards/SPEC.md-43-  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
docs/specs/spec-home-awwwards/SPEC.md-44-  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.
docs/specs/spec-home-awwwards/SPEC.md-45-
docs/specs/spec-home-awwwards/SPEC.md:46:- id: CAP-6
docs/specs/spec-home-awwwards/SPEC.md-47-  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
docs/specs/spec-home-awwwards/SPEC.md-48-  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
docs/specs/spec-home-awwwards/SPEC.md-49-
docs/specs/spec-home-awwwards/SPEC.md:50:- id: CAP-7
docs/specs/spec-home-awwwards/SPEC.md-51-  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
docs/specs/spec-home-awwwards/SPEC.md-52-  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.
docs/specs/spec-home-awwwards/SPEC.md-53-
docs/specs/spec-home-awwwards/SPEC.md:54:- id: CAP-8
docs/specs/spec-home-awwwards/SPEC.md-55-  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
docs/specs/spec-home-awwwards/SPEC.md-56-  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.
docs/specs/spec-home-awwwards/SPEC.md-57-
docs/specs/spec-home-awwwards/SPEC.md-58-- id: CAP-9
docs/specs/spec-home-awwwards/SPEC.md-59-  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
--
docs/planning-artifacts/epics.md-31-FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
docs/planning-artifacts/epics.md-32-FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
docs/planning-artifacts/epics.md-33-FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
docs/planning-artifacts/epics.md-34-FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
docs/planning-artifacts/epics.md-35-FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
docs/planning-artifacts/epics.md:36:FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
docs/planning-artifacts/epics.md:37:FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
docs/planning-artifacts/epics.md:38:FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
docs/planning-artifacts/epics.md-39-FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
docs/planning-artifacts/epics.md-40-FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
docs/planning-artifacts/epics.md-41-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
docs/planning-artifacts/epics.md-42-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/planning-artifacts/epics.md-43-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
--
docs/planning-artifacts/epics.md-50-FR18: Arrière-plan atmosphérique immersif en pur CSS (auroras animées aubergine/orange/rouge, scanlines CRT, grille de points) avec neutralisation totale sous `prefers-reduced-motion: reduce`. _(CAP-1)_
docs/planning-artifacts/epics.md-51-FR19: Séquence de boot interactive stylisée `jouan.os` affichant la montée en charge système, avec fermeture automatique (1-1.5s) ou manuelle (clic / touche Escape), mémorisée en session et contournée sous reduced-motion. _(CAP-2)_
docs/planning-artifacts/epics.md-52-FR20: Hero commercial cinétique affichant le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS », le pitch SaaS/web apps, le badge de statut vérifié Malt (`<ZExternalLink>`), les CTAs vers `/contact` et `/about`, et la fenêtre terminal hero simulant la frappe de commandes clés avec caret natif. _(CAP-3)_
docs/planning-artifacts/epics.md-53-FR21: Marquee infini de la stack technique moderne prioritaire alimenté par `SITE.skills`, défilant en continu avec pause au survol et arrêt sans débordement horizontal sous reduced-motion. _(CAP-4)_
docs/planning-artifacts/epics.md-54-FR22: Section vitrine des 3 offres de services ciblées sous forme de cartes structurées invitant à approfondir et redirigeant vers `/services`. _(CAP-5)_
docs/planning-artifacts/epics.md:55:FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
docs/planning-artifacts/epics.md:56:FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
docs/planning-artifacts/epics.md:57:FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
docs/planning-artifacts/epics.md-58-FR26: Maintien strict de l'architecture multi-pages : tous les liens de navigation et de renvoi ciblent les routes Nuxt indépendantes sans repli vers des ancres intra-page `#`. _(CAP-9)_
docs/planning-artifacts/epics.md-59-FR27: Micro-curseur interactif progressif pour navigateurs de bureau avec souris (`data-hot`), désactivé sur tactile et sous reduced-motion. _(CAP-10)_
docs/planning-artifacts/epics.md-60-
docs/planning-artifacts/epics.md-61-### NonFunctional Requirements
docs/planning-artifacts/epics.md-62-
--
docs/planning-artifacts/epics.md-134-FR18: Epic 11 — Arrière-plan atmosphérique immersif en pur CSS
docs/planning-artifacts/epics.md-135-FR19: Epic 11 — Séquence de boot interactive stylisée jouan.os
docs/planning-artifacts/epics.md-136-FR20: Epic 11 — Hero commercial cinétique & terminal vitrine
docs/planning-artifacts/epics.md-137-FR21: Epic 11 — Marquee infini de la stack moderne ciblée
docs/planning-artifacts/epics.md-138-FR22: Epic 11 — Vitrine des 3 offres de services ciblées
docs/planning-artifacts/epics.md:139:FR23: Epic 11 — Preuves concrètes & Projets phares (Keova, TryOn, Nodium)
docs/planning-artifacts/epics.md:140:FR24: Epic 11 — Vitrine des articles récents du blog
docs/planning-artifacts/epics.md:141:FR25: Epic 11 — Bloc CTA de conversion orienté mission & profil Malt
docs/planning-artifacts/epics.md-142-FR26: Epic 11 — Préservation de l'architecture multi-pages
docs/planning-artifacts/epics.md-143-FR27: Epic 11 — Micro-curseur interactif progressif desktop
docs/planning-artifacts/epics.md-144-
docs/planning-artifacts/epics.md-145-## Epic List
docs/planning-artifacts/epics.md-146-
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
docs/planning-artifacts/epics.md-753-**Then** le bandeau défile de manière fluide et infinie en CSS pur, se met en pause au survol (`:hover`) et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`
docs/planning-artifacts/epics.md-754-**And** la vitrine expose 3 cartes structurées `ZCard` (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) avec numérotation terminale, proposition de valeur claire et tags technologiques
docs/planning-artifacts/epics.md-755-**And** chaque carte oriente directement vers la route `/services` (aucune ancre intra-page `#`)
docs/planning-artifacts/epics.md-756-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
docs/planning-artifacts/epics.md-757-
docs/planning-artifacts/epics.md:758:### Story 11.4: Preuves concrètes SaaS, Journal technique & CTA final de conversion
docs/planning-artifacts/epics.md-759-
docs/planning-artifacts/epics.md-760-As a prospect cherchant des garanties avant prise de contact,
docs/planning-artifacts/epics.md-761-I want consulter les réalisations SaaS phares (Keova, TryOn, Nodium), les statistiques clés et les derniers articles du journal,
docs/planning-artifacts/epics.md:762:So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).
docs/planning-artifacts/epics.md-763-
docs/planning-artifacts/epics.md-764-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-765-
docs/planning-artifacts/epics.md-766-**Given** les projets définis dans `SITE.projects`, les articles du blog et le profil Malt
docs/planning-artifacts/epics.md-767-**When** on intègre la section des projets sélectionnés, les statistiques, le journal technique et le bloc CTA final
--
docs/planning-artifacts/epics.md-780-I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
docs/planning-artifacts/epics.md-781-So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).
docs/planning-artifacts/epics.md-782-
docs/planning-artifacts/epics.md-783-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-784-
docs/planning-artifacts/epics.md:785:**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
docs/planning-artifacts/epics.md-786-**When** on exécute l'audit complet d'accessibilité (contraste forcé `forced-colors: active`, `prefers-reduced-motion: reduce`, navigation clavier, `<ZExternalLink>` audités)
docs/planning-artifacts/epics.md-787-**Then** aucun focus trap n'existe, les éléments interactifs sont accessibles au clavier avec focus visible, les animations sont neutralisées sous reduced-motion (seul le caret clignote), et aucun lien avec ancre intra-page `#` n'est présent (les routes `/services`, `/about`, `/blog`, `/contact` restent des pages indépendantes)
docs/planning-artifacts/epics.md-788-**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) est exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes pré-rendues)
docs/planning-artifacts/epics.md-789-

2026-09-13T19:23:15.329521Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZButton.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,180p' app/components/ui/ZCard.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n 'formatDate|article\\.image|queryCollection|home-articles|color-mix|prefers-reduced-motion|block__head|.stats' app/pages/index.vue app app/assets content.config.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue:90:        <div class="block__head">
app/pages/index.vue:126:        <ul class="stats">
app/pages/index.vue:127:          <li v-for="stat in stats" :key="stat.id" class="stat">
app/pages/index.vue:138:        <div class="block__head block__head--row">
app/pages/index.vue:154:                v-if="article.image"
app/pages/index.vue:156:                :src="article.image.src"
app/pages/index.vue:157:                :alt="article.image.alt"
app/pages/index.vue:172:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/index.vue:306:const stats = [
app/pages/index.vue:313:const { data: articles } = await useAsyncData("home-articles", () =>
app/pages/index.vue:314:  queryCollection("blog").order("date", "DESC").limit(3).all(),
app/pages/index.vue:378:  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
app/pages/index.vue:381:    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue:384:      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
app/pages/index.vue:470:  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:473:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:480:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:484:    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:488:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:755:// ---- Stats (porté de .stats) ----
app/pages/index.vue:756:.stats {
app/pages/index.vue:767:  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
app/pages/index.vue:791:.block__head--row {
app/pages/index.vue:947:    color-mix(in srgb, var(--surface-2) 60%, transparent);
app/pages/index.vue:1002:  .block__head--row {
app/pages/index.vue:1019:  .stats {
app/pages/index.vue:1024:@media (prefers-reduced-motion: reduce) {
app/pages/blog/[...slug].vue:22:            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
app/pages/blog/[...slug].vue:63:// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue:76:  () => queryCollection("blog").path(path.value).first(),
app/pages/blog/[...slug].vue:121:  const image = article.image
app/pages/blog/[...slug].vue:122:    ? article.image.src.startsWith("/")
app/pages/blog/[...slug].vue:123:      ? `${siteUrl}${article.image.src}`
app/pages/blog/[...slug].vue:124:      : `${siteUrl}/${article.image.src}`
app/pages/blog/[...slug].vue:154:    image: article.image?.src,
app/pages/blog/[...slug].vue:155:    imageAlt: article.image?.alt,
app/pages/blog/index.vue:17:                v-if="article.image"
app/pages/blog/index.vue:19:                :src="article.image.src"
app/pages/blog/index.vue:20:                :alt="article.image.alt"
app/pages/blog/index.vue:35:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/blog/index.vue:86:// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
app/pages/blog/index.vue:95:  queryCollection("blog").order("date", "DESC").all(),
app/pages/blog/index.vue:98:// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
app/pages/blog/index.vue:135:    ...(article.image
app/pages/blog/index.vue:137:          image: article.image.src.startsWith("/")
app/pages/blog/index.vue:138:            ? `${siteUrl}${article.image.src}`
app/pages/blog/index.vue:139:            : `${siteUrl}/${article.image.src}`,
app/pages/index.vue:90:        <div class="block__head">
app/pages/index.vue:126:        <ul class="stats">
app/pages/index.vue:127:          <li v-for="stat in stats" :key="stat.id" class="stat">
app/pages/index.vue:138:        <div class="block__head block__head--row">
app/pages/index.vue:154:                v-if="article.image"
app/pages/index.vue:156:                :src="article.image.src"
app/pages/index.vue:157:                :alt="article.image.alt"
app/pages/index.vue:172:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
app/pages/index.vue:306:const stats = [
app/pages/index.vue:313:const { data: articles } = await useAsyncData("home-articles", () =>
app/pages/index.vue:314:  queryCollection("blog").order("date", "DESC").limit(3).all(),
app/pages/index.vue:378:  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
app/pages/index.vue:381:    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue:384:      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
app/pages/index.vue:470:  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:473:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:480:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:484:    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:488:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:755:// ---- Stats (porté de .stats) ----
app/pages/index.vue:756:.stats {
app/pages/index.vue:767:  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
app/pages/index.vue:791:.block__head--row {
app/pages/index.vue:947:    color-mix(in srgb, var(--surface-2) 60%, transparent);
app/pages/index.vue:1002:  .block__head--row {
app/pages/index.vue:1019:  .stats {
app/pages/index.vue:1024:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/components/HeaderComponent.vue:196:  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
app/utils/formatDate.ts:12:export function formatDate(iso: string): string {
app/components/FooterComponent.vue:201:@media (prefers-reduced-motion: reduce) {
app/components/terminal/TerminalComponent.vue:468:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCard.vue:121:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCustomCursor.vue:21:// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
app/components/ui/ZCustomCursor.vue:109:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCustomCursor.vue:168:  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
app/components/ui/ZCustomCursor.vue:182:@media (hover: none), (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeAtmosComponent.vue:14:// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue:68:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 6%, transparent) 1px, transparent 1px);
app/components/home/HomeAtmosComponent.vue:79:    color-mix(in srgb, var(--surface-0) 24%, transparent) 0 1px,
app/components/home/HomeAtmosComponent.vue:123:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeStackMarquee.vue:26:// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
app/components/home/HomeStackMarquee.vue:103:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeBootOverlay.vue:41:// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
app/components/home/HomeBootOverlay.vue:131:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeBootOverlay.vue:251:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeHeroTerminal.vue:86:// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
app/components/home/HomeHeroTerminal.vue:153:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:215:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:312:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/home/HomeHeroTerminal.vue:387:@media (prefers-reduced-motion: reduce) {

exec
/bin/zsh -lc "sed -n '758,780p' docs/planning-artifacts/epics.md; sed -n '1,120p' docs/specs/spec-home-awwwards/sections-mapping.md; sed -n '1,110p' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
# Cartographie des sections & Adaptation Multi-pages

Ce document détaille la transposition de la maquette source `Home - Awwwards.html` vers l'architecture applicative Nuxt 4 de `jouan.ovh`, en application directe de la direction stratégique (`direction_strategique_site.md`) et du profil Malt (`contexte_malt.md`).

---

## 1. Principe directeur : Vitrine immersive vs Pages complètes

La maquette HTML brute `Home - Awwwards.html` a été conçue comme un prototype autonome avec des ancres intra-page (`#services`, `#work`, `#journal`, `#contact`).  
Dans `jouan.ovh`, la home refondue agit comme un **entonnoir de conversion commercial**, orientant les visiteurs vers les pages complètes du site :

| Section Maquette Awwwards | Rôle sur la Home refondue | Contenu aligné Malt / Direction Stratégique | Destination / Route cible |
| :--- | :--- | :--- | :--- |
| **Navigation Header** | Menu de navigation du site | Liens directs vers les pages applicatives Nuxt. | Liens Nuxt vers `/services`, `/about`, `/blog`, `/contact`. |
| **Hero & Terminal** | Positionnement commercial immédiat | « Développeur Full Stack TypeScript — Nuxt / NestJS » + pitch création/évolution SaaS + badge Malt. | CTA primaire vers `/contact` (« Discuter de votre projet »), secondaire vers `/about`, lien externe vers profil Malt. |
| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
| **Services (3 cartes)** | Présentation des 3 offres ciblées | 1. Création d'apps web & SaaS<br>2. Dév Full Stack TypeScript<br>3. Évolution & architecture applicative | Cartes cliquables avec renvoi vers `/services` (où se trouve le déroulé du process en 4 étapes). |
| **Projets sélectionnés** | Preuves concrètes de réalisations SaaS | 1. **Keova** (SaaS ERP équestre Nuxt 4/NestJS/PostgreSQL/Stripe)<br>2. **TryOn** (SaaS IA générative Nuxt/NestJS/Python/ComfyUI)<br>3. **Nodium** (Lab d'agents IA desktop) | Liens externes vers les projets via `<ZExternalLink>`, renvoi vers `/about` pour le parcours complet (Kidizz, CINS). |
| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
| **Journal (Blog)** | Vitrine d'ingénierie logicielle | Les 3 derniers articles techniques du blog. | Lien global « Voir tous les articles » menant vers `/blog`. |
| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |

---

## 2. Découpage technique et éditorial des blocs

### A. Pile Atmosphérique (`.atmos`)
- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.

### B. Boot Sequence (`.boot`)
- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
- **Règles :**
  - S'efface automatiquement après 1 à 1.5s ou immédiatement au clic / touche Escape.
  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
  - Déclenche la frappe progressive du terminal hero à sa fermeture.

### C. Hero Commercial & Terminal Vitrine
- **Accroche commerciale :**
  - Sur-titre : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
  - Titre principal : `Développeur Full Stack TypeScript`
  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
  - Badge de statut : `● Disponible pour missions freelance · Profil Malt vérifié` (avec lien `<ZExternalLink>` vers Malt).
  - CTAs :
    - Principal : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
    - Secondaire : `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
- **Terminal vitrine :**
  - Simulation de frappe séquentielle :
    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`

### D. Marquee Stack Moderne
- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.

### E. Vitrine des Services (3 Offres Ciblées)
1. **Création d'applications web & SaaS**
   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
2. **Développement Full Stack TypeScript**
   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
   - *Technologies :* Vue 3, Nuxt, NestJS, Node.js, TypeORM.
3. **Évolution & Architecture applicative**
   - *Promesse :* Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).
   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.

### F. Preuves Concrètes & Projets Phares
- **1. Keova App (Pièce maîtresse SaaS en production) :**
  - Statut : `● En production`
  - Rôle : Co-fondateur & Développeur Full Stack
  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
- **2. TryOn (Étude de cas SaaS & IA générative) :**
  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
  - Rôle : CTO & Développeur Full Stack
  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
- **3. Nodium (Laboratoire R&D en cours) :**
  - Statut : `◐ R&D / En cours`
  - Rôle : Créateur & Ingénieur IA
  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
- **Statistiques clés de réassurance :**
  - `11` Années d'expérience web
  - `100%` TypeScript & SaaS de bout en bout
  - `QA` Culture d'automatisation & zéro régression

### G. Bloc CTA Final
- **Titre :** `Un projet d'application web ou SaaS ?`
- **Sous-titre :** `Que ce soit pour créer un nouveau produit, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
- **Actions :**
  - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
  - Bouton externe : `<ZExternalLink href="https://www.malt.fr/profile/simonjouan">Me contacter sur Malt</ZExternalLink>`
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

2026-09-13T19:23:34.448235Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
codex
Le périmètre est identifié : la diff touche `app/pages/index.vue` et le suivi de sprint, pour 686 lignes. Je vérifie maintenant les écarts fonctionnels dans les données réellement consommées, les composants polymorphes et la gate Docker avant de formuler uniquement les constats actionnables.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T19:24:04.910541Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:24:11.734572Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:24:18.816102Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 16580ms:
 Container jouanovh-web-run-ffce6fef96c1 Created 
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 12.95ms (0 cached, 1 parsed)

 WARN  Payload extraction is recommended for full-static output. You can enable it by setting experimental.payloadExtraction to true or 'client'.

│
●  Nitro preset: static
ℹ Building client...
ℹ vite v7.3.5 building client environment for production...

 WARN  [plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help

ℹ transforming...
ℹ ✓ 356 modules transformed.
ℹ rendering chunks...
ℹ computing gzip size...
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js            9.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        33.25 kB │ gzip:   2.62 kB
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
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.CJQoquAO.css                             20.48 kB │ gzip:   3.93 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C93KKm9n.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BfNJ66XY.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/E6coH47e.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C6ClZyZm.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/6EkvJcX7.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D6PllLF6.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/W2mzQN4s.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B5VBQG00.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DAlaisvh.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DbptucTH.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dm71iS9z.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CNnNtDjK.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DYdgfOQI.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BmI5GTT3.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/xo4BXx-0.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/3FmpaQIW.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CtFmoRwj.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BL5ebH8z.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/OpxrMEpG.js                                     0.48 kB │ gzip:   0.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/iwMlLGmR.js                                     0.49 kB │ gzip:   0.33 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/COEpCcRk.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DbqK7LFs.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cb3aXB38.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CVE0XRCo.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D1ncCd_g.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BLaJ0oiu.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/pEoOc2_8.js                                     0.63 kB │ gzip:   0.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DMhLy-fw.js                                     0.64 kB │ gzip:   0.42 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BGMjmYXP.js                                     0.79 kB │ gzip:   0.46 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CMQEDqfi.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DvmfV0_A.js                                     1.30 kB │ gzip:   0.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/p0temu7u.js                                     1.31 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BNQtrSIS.js                                     2.82 kB │ gzip:   1.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CZPYPyvN.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B_Y52oOI.js                                     3.76 kB │ gzip:   1.80 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BbsU43_G.js                                     3.79 kB │ gzip:   1.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DdLe9mRt.js                                     4.77 kB │ gzip:   2.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BeTW2rkd.js                                     4.92 kB │ gzip:   2.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BMy4T06P.js                                     5.14 kB │ gzip:   2.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CDaHTzsF.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CZy76wlf.js                                     6.01 kB │ gzip:   2.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DVIhH_ob.js                                     7.68 kB │ gzip:   2.91 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CXmFvnQY.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CGzMil67.js                                     8.96 kB │ gzip:   3.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZsGxQ2mD.js                                    12.36 kB │ gzip:   4.89 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/1LEPDT53.js                                    20.42 kB │ gzip:   7.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Q22xKxqT.js                                    32.42 kB │ gzip:  11.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/94XchtD0.js                                    46.45 kB │ gzip:  19.11 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/kT-s8AA-.js                                   187.35 kB │ gzip:  70.78 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dh7SNsIs.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.49s
✔ Client built in 2495ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 399 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.43s
✔ Server built in 2439ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /404.html (54ms)
[nitro]   ├─ /200.html (54ms)
[nitro]   ├─ / (64ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (63ms)
[nitro]   ├─ /confidentialite (35ms)
[nitro]   ├─ /mentions-legales (36ms)
[nitro]   ├─ /services (37ms)
[nitro]   ├─ /about (38ms)
[nitro]   ├─ /contact (37ms)
[nitro]   ├─ /blog (42ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (84ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (63ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (80ms)
[nitro] ℹ Prerendered 13 routes in 2.83 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

2026-09-13T19:24:20.556950Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/data/site.ts | sed -n '35,100p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba docs/specs/spec-home-awwwards/sections-mapping.md | sed -n '20,92p'; nl -ba docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md | sed -n '15,95p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    20	| **Journal (Blog)** | Vitrine d'ingénierie logicielle | Les 3 derniers articles techniques du blog. | Lien global « Voir tous les articles » menant vers `/blog`. |
    21	| **CTA Final** | Appel à la conversion orienté mission | « Un projet d'application web ou SaaS ? Discutons-en. » | Bouton vers `/contact`, lien externe vers profil Malt (`<ZExternalLink>`). |
    22	
    23	---
    24	
    25	## 2. Découpage technique et éditorial des blocs
    26	
    27	### A. Pile Atmosphérique (`.atmos`)
    28	- **Composants :** 3 auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en gradients radiaux floutés avec animations `@keyframes` lentes (26s à 32s).
    29	- **Textures :** Grille de points (`.grid-dots`) et scanlines terminales (`.scanlines`), grain discret en overlay et vignette périphérique.
    30	- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
    31	
    32	### B. Boot Sequence (`.boot`)
    33	- **Comportement :** Écran d'initialisation stylisé `jouan.os` affichant la montée en charge système.
    34	- **Règles :**
    35	  - S'efface automatiquement après 1 à 1.5s ou immédiatement au clic / touche Escape.
    36	  - Contournement immédiat sous `prefers-reduced-motion: reduce` ou si déjà visualisé au cours de la session (`sessionStorage`).
    37	  - Déclenche la frappe progressive du terminal hero à sa fermeture.
    38	
    39	### C. Hero Commercial & Terminal Vitrine
    40	- **Accroche commerciale :**
    41	  - Sur-titre : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
    42	  - Titre principal : `Développeur Full Stack TypeScript`
    43	  - Sous-titre : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
    44	  - Badge de statut : `● Disponible pour missions freelance · Profil Malt vérifié` (avec lien `<ZExternalLink>` vers Malt).
    45	  - CTAs :
    46	    - Principal : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
    47	    - Secondaire : `<ZButton variant="secondary" to="/about">Voir le parcours & CV</ZButton>`
    48	- **Terminal vitrine :**
    49	  - Simulation de frappe séquentielle :
    50	    - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
    51	    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
    52	    - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
    53	
    54	### D. Marquee Stack Moderne
    55	- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
    56	  `TypeScript · Nuxt 4 · Vue.js · NestJS · Node.js · PostgreSQL · TypeORM · Stripe Connect · Cypress · Docker · REST API · Vitest`
    57	- **Animation :** `@keyframes` fluide, pause automatique au survol de la souris, figeage statique sous `prefers-reduced-motion: reduce`.
    58	
    59	### E. Vitrine des Services (3 Offres Ciblées)
    60	1. **Création d'applications web & SaaS**
    61	   - *Promesse :* De l'idée à la production : architecture, développement front & back, base de données, authentification et paiements Stripe.
    62	   - *Technologies :* Nuxt, NestJS, PostgreSQL, Stripe Connect.
    63	2. **Développement Full Stack TypeScript**
    64	   - *Promesse :* Renfort d'équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.
    65	   - *Technologies :* Vue 3, Nuxt, NestJS, Node.js, TypeORM.
    66	3. **Évolution & Architecture applicative**
    67	   - *Promesse :* Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).
    68	   - *Technologies :* Tests E2E Cypress, CI/CD, audits, optimisations.
    69	
    70	### F. Preuves Concrètes & Projets Phares
    71	- **1. Keova App (Pièce maîtresse SaaS en production) :**
    72	  - Statut : `● En production`
    73	  - Rôle : Co-fondateur & Développeur Full Stack
    74	  - Description : ERP vertical SaaS complet dédié au secteur équestre (gestion de pensions, facturation automatisée, réservations).
    75	  - Stack : Nuxt 4, NestJS, PostgreSQL, TypeORM, Stripe Connect, Docker.
    76	  - Lien externe : `<ZExternalLink href="https://keova.app">keova.app</ZExternalLink>`.
    77	- **2. TryOn (Étude de cas SaaS & IA générative) :**
    78	  - Statut : `○ Étude de cas (MVP livré)` *(projet non renouvelé en ligne depuis 01/2026 — valorisé pour son architecture technique et son intégration IA sans lien externe 404)*
    79	  - Rôle : CTO & Développeur Full Stack
    80	  - Description : Plateforme SaaS B2B d'essayage virtuel de vêtements pour marques de mode via l'IA générative (diffusion models, workflows asynchrones, files Redis).
    81	  - Stack : Nuxt 3, NestJS, Python microservices, ComfyUI, Stripe, PostgreSQL.
    82	  - Action : Badge d'étude de cas / renvoi vers le détail de la mission sur `/about` ou profil Malt.
    83	- **3. Nodium (Laboratoire R&D en cours) :**
    84	  - Statut : `◐ R&D / En cours`
    85	  - Rôle : Créateur & Ingénieur IA
    86	  - Description : Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.
    87	  - Stack : TypeScript, Electron/Tauri, Agentic workflows, Local runtimes.
    88	- **Statistiques clés de réassurance :**
    89	  - `11` Années d'expérience web
    90	  - `100%` TypeScript & SaaS de bout en bout
    91	  - `QA` Culture d'automatisation & zéro régression
    92	
    15	so that je sois convaincu par des preuves concrètes d'ingénierie logicielle Full Stack TypeScript et engagé à initier un contact direct via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24, CAP-5, CAP-6, CAP-7).
    16	
    17	## Acceptance Criteria
    18	
    19	1. **Given** les projets définis dans `SITE.projects` (`app/data/site.ts`)
    20	   **When** le visiteur fait défiler la page d'accueil sous la section des services
    21	   **Then** la section des réalisations (`.work`) affiche l'en-tête :
    22	     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>`
    23	     - Titre de section : `<h2 class="section__title">Des produits qui tournent en production</h2>`
    24	   **And** la liste des projets est structurée en une séquence sémantique `<ul>` / `<li>` avec les 3 réalisations :
    25	     - **Keova App** (`01`) : Statut `● En production`, rôle `Co-fondateur & Développeur Full Stack`, description ERP équestre SaaS, tags (`Nuxt 4`, `NestJS`, `PostgreSQL`, `Stripe Connect`, `SaaS`), et lien externe direct accessible via `<ZExternalLink href="https://keova.app">`
    26	     - **TryOn** (`02`) : Statut `○ Étude de cas (MVP livré)`, rôle `CTO & Développeur Full Stack`, description plateforme IA générative & mode, tags (`Nuxt 3`, `NestJS`, `Python`, `ComfyUI`, `IA`), **sans lien externe mort 404** (rendu sans balise `<a>` externe non résolue)
    27	     - **Nodium** (`03`) : Statut `◐ R&D / En cours`, rôle `Créateur & Ingénieur IA`, description orchestration d'agents desktop, tags (`TypeScript`, `Electron`, `Agents`, `IA`), rendu sans lien externe
    28	   **And** chaque ligne interactive (`.work__row`) réagit au survol (`:hover`) avec un dégradé subtil `var(--accent-soft)` et un décalage de la flèche directionnelle (sans à-coup).
    29	
    30	2. **Given** la zone de réassurance située immédiatement après les projets
    31	   **When** le visiteur consulte les indicateurs clés
    32	   **Then** une grille responsive (`.stats`) affiche exactement 3 compteurs typés :
    33	     - Compteur 1 : Valeur `11`, libellé `années d'expérience web`
    34	     - Compteur 2 : Valeur `100%`, libellé `TypeScript & SaaS de bout en bout`
    35	     - Compteur 3 : Valeur `QA`, libellé `culture d'automatisation & zéro régression`
    36	   **And** les valeurs numériques/codes sont mises en exergue en police monospace `var(--font-mono)` et couleur d'accent `var(--accent)`
    37	   **And** la grille s'adapte de façon fluide (3 colonnes sur desktop, 1 colonne sous 680px).
    38	
    39	3. **Given** la collection de blog `@nuxt/content` v3
    40	   **When** on intègre la section du journal technique sur la page d'accueil
    41	   **Then** l'en-tête de section affiche :
    42	     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>`
    43	     - Titre : `<h2 class="section__title">Notes de dev, écrites en construisant</h2>`
    44	     - Lien d'approfondissement : `<NuxtLink to="/blog" class="seeall">cat tous-les-articles →</NuxtLink>`
    45	   **And** les 3 articles les plus récents sont interrogés de manière prerender-safe via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())`
    46	   **And** si des articles existent, ils sont rendus avec leurs tags `ZTag`, titre, date formatée et lien vers leur route `/blog/[slug]`
    47	   **And** si la collection est vide (état initial du dépôt avec `.gitkeep`), un état d'attente sobre et élégant s'affiche invitant à consulter le blog sans bloquer le rendu statique SSG.
    48	
    49	4. **Given** le bas de la page d'accueil
    50	   **When** le prospect atteint la fin de la consultation
    51	   **Then** un panneau d'appel à l'action final (`.cta`) se présente avec :
    52	     - Eyebrow mono : `<p class="eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>`
    53	     - Titre : `<h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>`
    54	     - Sous-titre : `<p class="cta__subtitle">Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.</p>`
    55	     - CTAs interactifs :
    56	       - Bouton primaire : `<ZButton to="/contact">Discuter de votre projet</ZButton>`
    57	       - Bouton externe : `<ZButton :as="ZExternalLink" :href="SITE.profile.maltUrl" variant="secondary">Me contacter sur Malt</ZButton>` (garantissant l'accessibilité a11y et `srText`)
    58	       - Bouton tertiaire : `<ZButton variant="ghost" to="/about">Voir le parcours & CV</ZButton>`
    59	   **And** aucun lien intra-page avec ancre `#` n'est employé (respect de l'architecture multi-pages).
    60	
    61	5. **Given** l'ensemble des intégrations de la story
    62	   **When** on exécute la gate de validation Docker
    63	   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.
    64	
    65	## Tasks / Subtasks
    66	
    67	- [x] Tâche 1 — Refonte de la section des projets sélectionnés (`.work`) (AC: 1)
    68	  - [x] Transposer la structure en grille/lignes `.work__row` issue de `Home - Awwwards.html` dans `app/pages/index.vue`.
    69	  - [x] Baliser les 3 projets de `SITE.projects` (`keova.app`, `TryOn`, `Nodium`) dans une liste sémantique `<ul>` et `<li>`.
    70	  - [x] Afficher la numérotation (`01`, `02`, `03`), le statut coloré (`● En production`, `○ Étude de cas (MVP livré)`, `◐ R&D / En cours`), le titre, la description, le rôle et les tags avec `ZTag`.
    71	  - [x] Rendre la ligne de `keova.app` comme lien externe accessible via `<ZExternalLink href="https://keova.app">` avec indicateur de sortie (`.work__go`).
    72	  - [x] Rendre les lignes de `TryOn` et `Nodium` sans balise lien externe afin d'éviter tout lien mort 404 (éléments interactifs locaux ou conteneurs non-liens).
    73	  - [x] Styliser les lignes en SCSS scoped avec les tokens du Design System (`--border-subtle`, `--accent-soft`, `--text-faint`, `--text-muted`, `--accent`).
    74	
    75	- [x] Tâche 2 — Intégration des statistiques clés de réassurance (`.stats`) (AC: 2)
    76	  - [x] Mettre à jour le tableau `stats` dans le script de `app/pages/index.vue` avec les 3 indicateurs cibles : `11` (années d'expérience web), `100%` (TypeScript & SaaS de bout en bout), `QA` (culture d'automatisation & zéro régression).
    77	  - [x] Rendre les statistiques sous la liste des projets dans un conteneur `.stats`.
    78	  - [x] Styliser les compteurs en typographie monospace (`var(--font-mono)`), taille fluide clamp, couleur d'accent (`var(--accent)`), avec adaptation responsive (3 colonnes sur desktop, 1 colonne sous 680px).
    79	
    80	- [x] Tâche 3 — Intégration de la section Journal technique (AC: 3)
    81	  - [x] Déclarer la requête `@nuxt/content` v3 via `useAsyncData('home-articles', () => queryCollection('blog').order('date', 'DESC').limit(3).all())` dans `app/pages/index.vue`.
    82	  - [x] Structurer la section avec l'eyebrow (`// ~/journal`), le titre de section et le lien d'en-tête vers `/blog` (`cat tous-les-articles →`).
    83	  - [x] Rendre les cartes d'articles avec titre, tags `ZTag`, date formatée et lien vers la route d'article si la liste n'est pas vide.
    84	  - [x] Prévoir le rendu de repli élégant lorsque la collection est vide (pas d'erreur, message sobre et invitation à visiter `/blog`).
    85	
    86	- [x] Tâche 4 — Intégration du bloc CTA final de conversion (`.cta`) (AC: 4)
    87	  - [x] Créer le bloc de clôture de page d'accueil `.cta` avant la fermeture du `<main>`.
    88	  - [x] Ajouter l'eyebrow terminale (`$ ./contact --start`), le titre d'accroche avec mise en valeur de « en production » (`var(--accent)`), et le sous-titre commercial.
    89	  - [x] Intégrer les trois actions : bouton primaire vers `/contact`, bouton externe vers le profil Malt (`SITE.profile.maltUrl`) avec `<ZButton :as="ZExternalLink">`, et bouton fantôme vers `/about`.
    90	  - [x] Styliser le bloc avec une surface surélevée (`--surface-2` ou dégradé aubergine sombre), bordure subtile et padding généreux.
    91	
    92	- [x] Tâche 5 — Validation qualité & Gate Docker (AC: 5)
    93	  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
    94	  - [x] Vérifier la propreté du rendu visuel, la fluidité des survols, la navigation au clavier (`Tab`, `:focus-visible`).
    95	  - [x] Vérifier la complétion de la page d'accueil complète (Hero, Marquee, Services, Projets, Stats, Journal, CTA).

exec
/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '86,190p;300,320p;700,1060p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    86	
    87	    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    88	    <section class="section section--sunken">
    89	      <div class="container">
    90	        <div class="block__head">
    91	          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
    92	          <h2 class="section__title">Des produits qui tournent en production</h2>
    93	        </div>
    94	
    95	        <ul class="work">
    96	          <li v-for="(project, index) in projects" :key="project.name">
    97	            <component
    98	              :is="project.url ? ZExternalLink : 'div'"
    99	              :href="project.url"
   100	              class="work__row"
   101	              :class="{ 'work__row--link': Boolean(project.url) }"
   102	              :data-hot="project.url ? '' : undefined"
   103	            >
   104	              <span class="work__no">0{{ index + 1 }}</span>
   105	              <div class="work__main">
   106	                <div class="work__topline">
   107	                  <h3 class="work__name">{{ project.name }}</h3>
   108	                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
   109	                </div>
   110	                <p class="work__role">{{ project.role }}</p>
   111	                <p class="prose work__desc">{{ project.desc }}</p>
   112	                <ul class="hero__tags work__tags">
   113	                  <li v-for="tag in project.tags" :key="tag">
   114	                    <ZTag>{{ tag }}</ZTag>
   115	                  </li>
   116	                </ul>
   117	              </div>
   118	              <span v-if="project.url" class="work__go" aria-hidden="true">
   119	                <ZIcon name="arrow" />
   120	              </span>
   121	            </component>
   122	          </li>
   123	        </ul>
   124	
   125	        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
   126	        <ul class="stats">
   127	          <li v-for="stat in stats" :key="stat.id" class="stat">
   128	            <b>{{ stat.value }}</b>
   129	            <span>{{ stat.label }}</span>
   130	          </li>
   131	        </ul>
   132	      </div>
   133	    </section>
   134	
   135	    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
   136	    <section class="section">
   137	      <div class="container">
   138	        <div class="block__head block__head--row">
   139	          <div>
   140	            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
   141	            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
   142	          </div>
   143	          <NuxtLink to="/blog" class="seeall" data-hot>
   144	            cat tous-les-articles
   145	            <ZIcon name="arrow" class="seeall__icon" />
   146	          </NuxtLink>
   147	        </div>
   148	
   149	        <!-- Liste des articles les plus récents -->
   150	        <ul v-if="articles && articles.length" class="journal">
   151	          <li v-for="article in articles" :key="article.path" class="journal__item">
   152	            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
   153	              <NuxtImg
   154	                v-if="article.image"
   155	                class="jpost__thumb"
   156	                :src="article.image.src"
   157	                :alt="article.image.alt"
   158	                width="360"
   159	                height="200"
   160	                sizes="360px"
   161	                format="webp"
   162	              />
   163	              <div class="jpost__body">
   164	                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
   165	                  <li v-for="tag in article.tags" :key="tag">
   166	                    <ZTag>{{ tag }}</ZTag>
   167	                  </li>
   168	                </ul>
   169	                <h3 class="jpost__title">{{ article.title }}</h3>
   170	                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
   171	                <div class="jpost__meta">
   172	                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
   173	                  <template v-if="article.read">
   174	                    <span aria-hidden="true">·</span>
   175	                    <span>{{ article.read }} de lecture</span>
   176	                  </template>
   177	                  <span class="jpost__arrow" aria-hidden="true">
   178	                    <ZIcon name="arrow" />
   179	                  </span>
   180	                </div>
   181	              </div>
   182	            </ZCard>
   183	          </li>
   184	        </ul>
   185	
   186	        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
   187	        <ZCard v-else class="journal__empty" padded>
   188	          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
   189	          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
   190	          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
   300	];
   301	
   302	// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
   303	const projects = SITE.projects;
   304	
   305	// Chiffres clés de réassurance (Story 11.4 / AC-2).
   306	const stats = [
   307	  { id: "stat-1", value: "11", label: "années d'expérience web" },
   308	  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
   309	  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
   310	];
   311	
   312	// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
   313	const { data: articles } = await useAsyncData("home-articles", () =>
   314	  queryCollection("blog").order("date", "DESC").limit(3).all(),
   315	);
   316	
   317	const siteUrl = useSiteUrl();
   318	const homeJsonLd = [
   319	  {
   320	    "@context": "https://schema.org",
   700	
   701	.work__main {
   702	  position: relative;
   703	}
   704	
   705	.work__topline {
   706	  display: flex;
   707	  flex-wrap: wrap;
   708	  align-items: baseline;
   709	  gap: var(--space-3);
   710	}
   711	
   712	.work__name {
   713	  margin: 0;
   714	  font-family: var(--font-mono);
   715	  font-size: clamp(1.4rem, 2.8vw, 2rem);
   716	  font-weight: var(--fw-regular);
   717	  letter-spacing: var(--ls-tight);
   718	  color: var(--text-strong);
   719	  transition: color var(--dur-base) var(--ease-standard);
   720	}
   721	
   722	.work__status {
   723	  font-family: var(--font-mono);
   724	  font-size: var(--fs-xs);
   725	  color: var(--accent);
   726	  letter-spacing: var(--ls-wide);
   727	}
   728	
   729	.work__role {
   730	  margin: var(--space-1) 0 0;
   731	  font-family: var(--font-mono);
   732	  font-size: var(--fs-xs);
   733	  color: var(--text-muted);
   734	}
   735	
   736	.work__desc {
   737	  max-width: 65ch;
   738	  margin: var(--space-3) 0 0;
   739	  font-size: var(--fs-sm);
   740	}
   741	
   742	.work__tags {
   743	  margin-top: var(--space-4);
   744	}
   745	
   746	.work__go {
   747	  position: relative;
   748	  font-size: var(--fs-xl);
   749	  color: var(--text-faint);
   750	  transition:
   751	    transform var(--dur-base) var(--ease-out),
   752	    color var(--dur-base) var(--ease-standard);
   753	}
   754	
   755	// ---- Stats (porté de .stats) ----
   756	.stats {
   757	  display: grid;
   758	  grid-template-columns: repeat(3, 1fr);
   759	  gap: var(--space-4);
   760	  margin: var(--space-12) 0 0;
   761	  padding: 0;
   762	  list-style: none;
   763	}
   764	
   765	.stat {
   766	  padding: var(--space-6);
   767	  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
   768	  border: 1px solid var(--border-subtle);
   769	  border-radius: var(--radius-md);
   770	
   771	  b {
   772	    display: block;
   773	    margin-bottom: var(--space-1);
   774	    font-family: var(--font-mono);
   775	    font-size: var(--fs-5xl);
   776	    font-weight: var(--fw-light);
   777	    line-height: 1;
   778	    letter-spacing: var(--ls-tight);
   779	    color: var(--text-strong);
   780	  }
   781	
   782	  span {
   783	    font-family: var(--font-mono);
   784	    font-size: var(--fs-sm);
   785	    letter-spacing: var(--ls-wide);
   786	    color: var(--text-muted);
   787	  }
   788	}
   789	
   790	// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
   791	.block__head--row {
   792	  display: flex;
   793	  align-items: flex-end;
   794	  justify-content: space-between;
   795	  gap: var(--space-6);
   796	  margin-bottom: var(--space-8);
   797	
   798	  .section__title {
   799	    margin-bottom: 0;
   800	  }
   801	}
   802	
   803	.seeall {
   804	  display: inline-flex;
   805	  flex: none;
   806	  align-items: center;
   807	  gap: var(--space-2);
   808	  font-family: var(--font-mono);
   809	  font-size: var(--fs-sm);
   810	  color: var(--text-muted);
   811	  text-decoration: none;
   812	  white-space: nowrap;
   813	  transition: color var(--dur-base) var(--ease-standard);
   814	
   815	  &:hover {
   816	    color: var(--accent);
   817	  }
   818	
   819	  &:focus-visible {
   820	    outline: 2px solid transparent;
   821	    outline-offset: 2px;
   822	    box-shadow: var(--ring-accent);
   823	    border-radius: var(--radius-xs);
   824	  }
   825	}
   826	
   827	.seeall__icon {
   828	  font-size: var(--fs-base);
   829	}
   830	
   831	.journal {
   832	  display: grid;
   833	  grid-template-columns: repeat(3, 1fr);
   834	  gap: var(--space-5);
   835	  margin: 0;
   836	  padding: 0;
   837	  list-style: none;
   838	
   839	  > li {
   840	    display: flex;
   841	  }
   842	}
   843	
   844	.jpost {
   845	  display: flex;
   846	  flex-direction: column;
   847	  width: 100%;
   848	  color: inherit;
   849	  text-decoration: none;
   850	
   851	  &:hover {
   852	    .jpost__title {
   853	      color: var(--accent);
   854	    }
   855	
   856	    .jpost__arrow {
   857	      color: var(--accent);
   858	      transform: translate(4px, -4px);
   859	    }
   860	  }
   861	}
   862	
   863	.jpost__thumb {
   864	  width: 100%;
   865	  height: 160px;
   866	  object-fit: cover;
   867	  border-bottom: 1px solid var(--border-subtle);
   868	}
   869	
   870	.jpost__body {
   871	  display: flex;
   872	  flex: 1;
   873	  flex-direction: column;
   874	  padding: var(--space-5);
   875	}
   876	
   877	.jpost__tags {
   878	  margin-bottom: var(--space-3);
   879	}
   880	
   881	.jpost__title {
   882	  margin: 0 0 var(--space-2);
   883	  font-family: var(--font-mono);
   884	  font-size: var(--fs-lg);
   885	  font-weight: var(--fw-regular);
   886	  line-height: var(--lh-snug);
   887	  color: var(--text-strong);
   888	  transition: color var(--dur-base) var(--ease-standard);
   889	}
   890	
   891	.jpost__desc {
   892	  margin: 0 0 var(--space-4);
   893	  font-size: var(--fs-sm);
   894	  color: var(--text-muted);
   895	}
   896	
   897	.jpost__meta {
   898	  display: flex;
   899	  align-items: center;
   900	  gap: var(--space-2);
   901	  margin-top: auto;
   902	  padding-top: var(--space-4);
   903	  border-top: 1px dashed var(--border-subtle);
   904	  font-family: var(--font-mono);
   905	  font-size: var(--fs-xs);
   906	  color: var(--text-faint);
   907	}
   908	
   909	.jpost__arrow {
   910	  margin-left: auto;
   911	  font-size: var(--fs-base);
   912	  color: var(--text-faint);
   913	  transition:
   914	    transform var(--dur-base) var(--ease-out),
   915	    color var(--dur-base) var(--ease-standard);
   916	}
   917	
   918	.journal__empty {
   919	  max-width: 60ch;
   920	  margin: 0 auto;
   921	  text-align: center;
   922	}
   923	
   924	.journal__empty-code {
   925	  margin: 0 0 var(--space-2);
   926	  font-family: var(--font-mono);
   927	  font-size: var(--fs-sm);
   928	  color: var(--accent);
   929	}
   930	
   931	.journal__empty-text {
   932	  margin: 0 0 var(--space-5);
   933	  font-family: var(--font-sans);
   934	  font-size: var(--fs-sm);
   935	  line-height: var(--lh-relaxed);
   936	  color: var(--text-muted);
   937	}
   938	
   939	// ---- Bloc CTA final (porté de .cta) ----
   940	.cta {
   941	  position: relative;
   942	  padding: clamp(48px, 6vw, 72px) var(--space-6);
   943	  overflow: hidden;
   944	  text-align: center;
   945	  background:
   946	    radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%),
   947	    color-mix(in srgb, var(--surface-2) 60%, transparent);
   948	  border: 1px solid var(--border-subtle);
   949	  border-radius: var(--radius-lg);
   950	}
   951	
   952	.cta__eyebrow {
   953	  display: inline-block;
   954	}
   955	
   956	.cta__title {
   957	  margin: 0 0 var(--space-4);
   958	  font-family: var(--font-mono);
   959	  font-size: clamp(1.8rem, 4vw, 2.8rem);
   960	  font-weight: var(--fw-light);
   961	  line-height: var(--lh-tight);
   962	  letter-spacing: var(--ls-tight);
   963	  color: var(--text-strong);
   964	}
   965	
   966	.cta__highlight {
   967	  font-style: italic;
   968	  color: var(--accent);
   969	}
   970	
   971	.cta__subtitle {
   972	  max-width: 58ch;
   973	  margin: 0 auto var(--space-8);
   974	  font-family: var(--font-sans);
   975	  font-size: var(--fs-base);
   976	  line-height: var(--lh-relaxed);
   977	  color: var(--text-muted);
   978	}
   979	
   980	.cta__actions {
   981	  display: flex;
   982	  flex-wrap: wrap;
   983	  gap: var(--space-4);
   984	  justify-content: center;
   985	}
   986	
   987	// ---- Responsive ----
   988	@media (width <= 900px) {
   989	  .hero__grid {
   990	    grid-template-columns: 1fr;
   991	  }
   992	
   993	  .hero__title {
   994	    font-size: var(--fs-4xl);
   995	  }
   996	
   997	  .grid-3,
   998	  .journal {
   999	    grid-template-columns: 1fr;
  1000	  }
  1001	
  1002	  .block__head--row {
  1003	    flex-direction: column;
  1004	    align-items: flex-start;
  1005	  }
  1006	}
  1007	
  1008	@media (width <= 680px) {
  1009	  .work__row {
  1010	    grid-template-columns: 1fr;
  1011	    gap: var(--space-3);
  1012	  }
  1013	
  1014	  .work__no,
  1015	  .work__go {
  1016	    display: none;
  1017	  }
  1018	
  1019	  .stats {
  1020	    grid-template-columns: 1fr;
  1021	  }
  1022	}
  1023	
  1024	@media (prefers-reduced-motion: reduce) {
  1025	  .anim {
  1026	    animation: none;
  1027	  }
  1028	
  1029	  .work__row,
  1030	  .work__go,
  1031	  .jpost__arrow {
  1032	    transition: none;
  1033	  }
  1034	
  1035	  .work__row--link:hover {
  1036	    padding-left: var(--space-3);
  1037	
  1038	    .work__go {
  1039	      transform: none;
  1040	    }
  1041	  }
  1042	}
  1043	</style>

exec
/bin/zsh -lc "rg -n '#|href=|to=' docs/implementation-artifacts/code-reviews/11-4/full.diff | head -80 && git diff --check -- app/pages/index.vue docs/implementation-artifacts/sprint-status.yaml" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
24:+              :href="project.url"
68:+          <NuxtLink to="/blog" class="seeall" data-hot>
82:-              :href="project.url || undefined"
91:+            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
135:+          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
151:+            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
153:+              <template #iconRight><ZIcon name="arrow" /></template>
158:+              :href="SITE.profile.maltUrl"
165:+            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
178: import { NuxtLink, ZExternalLink } from "#components";
671: # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)

exec
/bin/zsh -lc "rg -o 'keova\\.app|En production|Nuxt 4|NestJS|Stripe Connect|TryOn|Nodium|années d.expérience web|100%|QA|Notes de dev|Un projet en tête|./contact --start|Les notes d.ingénierie' .output/public/index.html | sort | uniq -c" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   1 ./contact --start
  20 100%
   1 En production
  17 NestJS
   2 Nodium
   1 Notes de dev
   3 Nuxt 4
   3 QA
   3 Stripe Connect
   2 TryOn
   1 Un projet en tête
   5 keova.app

2026-09-13T19:24:51.524296Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -C 2 'journal|cat tous|Consulter|articles|notes|production|contact --start' .output/public/index.html | head -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:<!DOCTYPE html><html  lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Développeur Full Stack TypeScript · Nuxt &amp; NestJS</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-ec74c766]{margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 var(--space-8)}.ftr__container[data-v-ec74c766]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-ec74c766]{max-width:300px}.ftr__brand[data-v-ec74c766]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-ec74c766]{font-size:22px;color:var(--accent)}.ftr__brand b[data-v-ec74c766]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-ec74c766]{margin:0;font-size:var(--fs-sm);color:var(--text-muted)}.ftr__col[data-v-ec74c766]{display:flex;flex-direction:column}.ftr__title[data-v-ec74c766]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--text-muted)}.ftr__list[data-v-ec74c766]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-ec74c766]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-body);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-ec74c766]:hover{color:var(--accent)}.ftr__link[data-v-ec74c766]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data-v-ec74c766]{cursor:default}.ftr__bottom[data-v-ec74c766],.ftr__link--static[data-v-ec74c766],.ftr__link--static[data-v-ec74c766]:hover{color:var(--text-muted)}.ftr__bottom[data-v-ec74c766]{display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:space-between;margin-top:var(--space-8);padding-top:var(--space-5);font-family:var(--font-mono);font-size:var(--fs-xs);border-top:1px solid var(--border-subtle)}.ftr__cmd[data-v-ec74c766]{color:var(--term-green)}@media(prefers-reduced-motion:reduce){.ftr__link[data-v-ec74c766]{transition:none}}</style><style>.terminal{box-sizing:border-box;position:fixed;top:60px;left:15px;z-index:1000;width:600px;height:400px;overflow:hidden;resize:both;font-family:var(--font-mono);color:var(--ink-1);border:1px solid var(--border-terminal);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.terminal-header{position:relative;z-index:1;display:flex;flex-wrap:nowrap;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black);cursor:move}.terminal-header .terminal-dots{display:flex;align-items:center;gap:7px}.terminal-header .close-button{width:13px;height:13px;cursor:pointer;background-image:linear-gradient(to bottom right,var(--term-red),#8a0000);border-radius:var(--radius-circle);box-shadow:1px 1px 2px #080206}.terminal-header .close-button:hover{filter:brightness(1.2)}.terminal-header .close-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.terminal-header .terminal-dot{width:13px;height:13px;border-radius:var(--radius-circle);opacity:.85}.terminal-header .terminal-dot--min{background:var(--term-yellow)}.terminal-header .terminal-dot--max{background:var(--term-green)}.terminal-header .header-text{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);line-height:30px;color:var(--text-muted);text-align:center;pointer-events:none}.terminal-body{height:calc(100% - 30px);margin:0;padding:var(--space-4);overflow:auto;font-size:var(--fs-sm);line-height:var(--lh-snug);white-space:pre-wrap;overflow-wrap:break-word;background:var(--bg-terminal)}.terminal-body .git-prompt,.terminal-body .git-prompt-directory,.terminal-body .git-prompt-separator{display:inline}.terminal-body .git-prompt,.terminal-body .git-prompt-directory{font-weight:var(--fw-bold)}.terminal-body .git-prompt{color:var(--prompt)}.terminal-body .git-prompt-separator{color:var(--ink-1);font-weight:var(--fw-regular)}.terminal-body .git-prompt-directory{color:var(--term-blue)}.terminal-body .user-input{margin:0;padding:0;font-family:inherit;font-size:inherit;color:inherit;background-color:transparent;border:none;outline:none;caret-color:var(--prompt);caret-shape:block}.terminal-body .terminal-response{white-space:normal}.terminal-body::-webkit-scrollbar{width:10px}.terminal-body::-webkit-scrollbar-thumb{background:var(--aubergine);border-radius:var(--radius-pill)}@supports (backdrop-filter:blur(5px)) or (-webkit-backdrop-filter:blur(5px)){.terminal .terminal-body{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.terminal .resize-handle{position:absolute;right:0;bottom:0;width:16px;height:16px;background-color:transparent;cursor:nwse-resize}.table,table{--color-light:#ebebeb;--color-dark:#141414;--color-grey-light:#adadad;--margin:1em;border:1px dashed var(--color-light);margin:var(--margin)}.table thead,table thead{color:var(--color-dark);text-align:center;background-color:var(--color-light)}.table td,table td{padding:0 .5em}.table tbody tr:nth-child(2n),table tbody tr:nth-child(2n){background-color:var(--color-grey-light);color:var(--color-dark)}.table.w-100,table.w-100{width:calc(100% - var(--margin)*2)}.table.w-50,table.w-50{width:calc(50% - var(--margin)*2)}</style><style>.hdr[data-v-a782489c]{position:sticky;top:0;z-index:50;height:var(--header-height);background:color-mix(in srgb,var(--surface-0) 82%,transparent);border-bottom:1px solid var(--border-subtle);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.hdr__in[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-6);width:100%;max-width:var(--container-xl);height:100%;margin:0 auto;padding:0 var(--space-6)}.hdr__brand[data-v-a782489c]{display:inline-flex;align-items:center;gap:var(--space-2);text-decoration:none}.hdr__brand .hdr__logo[data-v-a782489c]{font-size:24px;color:var(--accent)}.hdr__brand b[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.hdr__brand[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.hdr__nav[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-1);min-width:0;margin-left:var(--space-4)}.hdr__link[data-v-a782489c]{padding:var(--space-2) var(--space-3);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;border-radius:var(--radius-sm);transition:color var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)}.hdr__link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__link--active[data-v-a782489c]{color:var(--accent)}.hdr__right[data-v-a782489c]{display:flex;align-items:center;gap:var(--space-3);margin-left:auto}.hdr__clock[data-v-a782489c]{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-muted)}.hdr__burger[data-v-a782489c]{display:none;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;color:var(--text-strong);cursor:pointer;background:none;border:1px solid var(--border-default);border-radius:var(--radius-md)}.hdr__burger[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__overlay[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 0;z-index:40;background:var(--overlay)}.hdr__menu[data-v-a782489c]{display:none}@media(max-width:1100px){.hdr__clock[data-v-a782489c]{display:none}}@media(max-width:1000px){.hdr__badge[data-v-a782489c]{display:none}}@media(min-width:901px){.hdr__overlay[data-v-a782489c]{display:none}}@media(max-width:900px){.hdr__badge[data-v-a782489c],.hdr__clock[data-v-a782489c],.hdr__nav[data-v-a782489c],.hdr__right .hdr__action[data-v-a782489c]{display:none}.hdr__burger[data-v-a782489c]{display:inline-flex}.hdr__menu[data-v-a782489c]{position:fixed;inset:var(--header-height) 0 auto 0;z-index:45;display:flex;flex-direction:column;gap:var(--space-1);padding:var(--space-4) var(--space-6) var(--space-6);background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-3);transform:translateY(-8px);opacity:0;visibility:hidden;transition:transform var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard),visibility var(--dur-base)}.hdr__menu--open[data-v-a782489c]{transform:translateY(0);opacity:1;visibility:visible}}.hdr__menu-link[data-v-a782489c]{padding:var(--space-3);font-family:var(--font-mono);font-size:var(--fs-base);color:var(--text-body);text-decoration:none;border-radius:var(--radius-sm)}.hdr__menu-link[data-v-a782489c]:hover{color:var(--text-strong);background:var(--surface-2)}.hdr__menu-link[data-v-a782489c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hdr__menu-link--active[data-v-a782489c]{color:var(--accent)}.hdr__menu-actions[data-v-a782489c]{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)}@media(prefers-reduced-motion:reduce){.hdr__link[data-v-a782489c],.hdr__menu[data-v-a782489c]{transition:none}}</style><style>.init[data-v-e3708db0]{background:var(--bg-page);display:flex;flex-direction:column;margin:0;min-height:100vh;width:100%;max-width:100vw}</style><style>.zicon[data-v-70d98695]{display:inline-block;flex:none;width:1em;height:1em;vertical-align:middle}</style><style>.zbadge[data-v-fc077828]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:22px;padding:0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;border:1px solid transparent;border-radius:var(--radius-sm)}.zbadge__dot[data-v-fc077828]{width:6px;height:6px;background:currentcolor;border-radius:var(--radius-circle)}.zbadge--neutral[data-v-fc077828]{background:var(--surface-3);color:var(--text-body);border-color:var(--border-default)}.zbadge--accent[data-v-fc077828]{background:var(--accent-soft);color:var(--accent);border-color:#f871164d}.zbadge--success[data-v-fc077828]{background:var(--success-soft);color:var(--success);border-color:#297a4880}.zbadge--warning[data-v-fc077828]{background:var(--warning-soft);color:var(--warning);border-color:#8b611880}.zbadge--danger[data-v-fc077828]{background:var(--danger-soft);color:var(--danger);border-color:#8a282880}.zbadge--info[data-v-fc077828]{background:var(--info-soft);color:var(--info);border-color:#255b7e80}</style><style>.zbtn[data-v-c154e5b1]{--_h:36px;--_px:var(--space-4);--_fs:var(--fs-sm);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);box-sizing:border-box;height:var(--_h);padding:0 var(--_px);font-family:var(--font-mono);font-size:var(--_fs);font-weight:var(--fw-medium);line-height:1;letter-spacing:var(--ls-wide);white-space:nowrap;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid transparent;border-radius:var(--radius-md);transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.zbtn[data-v-c154e5b1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zbtn[data-v-c154e5b1]:disabled,.zbtn[aria-disabled=true][data-v-c154e5b1]{opacity:.45;cursor:not-allowed;pointer-events:none}.zbtn__icon[data-v-c154e5b1]{display:inline-flex;width:1.05em;height:1.05em}.zbtn__icon[data-v-c154e5b1] svg{width:100%;height:100%}.zbtn--sm[data-v-c154e5b1]{--_h:28px;--_px:var(--space-3);--_fs:var(--fs-xs)}.zbtn--lg[data-v-c154e5b1]{--_h:44px;--_px:var(--space-5);--_fs:var(--fs-base)}.zbtn--primary[data-v-c154e5b1]{background:var(--accent);color:var(--accent-text);border-color:var(--accent)}.zbtn--primary[data-v-c154e5b1]:hover{background:var(--accent-hover);border-color:var(--accent-hover)}.zbtn--primary[data-v-c154e5b1]:active{background:var(--accent-active);border-color:var(--accent-active);transform:translateY(1px)}.zbtn--secondary[data-v-c154e5b1]{background:var(--surface-2);color:var(--text-strong);border-color:var(--border-default)}.zbtn--secondary[data-v-c154e5b1]:hover{background:var(--surface-3);border-color:var(--border-strong)}.zbtn--secondary[data-v-c154e5b1]:active{transform:translateY(1px)}.zbtn--ghost[data-v-c154e5b1]{background:transparent;color:var(--text-body);border-color:transparent}.zbtn--ghost[data-v-c154e5b1]:hover{background:var(--surface-2);color:var(--text-strong)}.zbtn--terminal[data-v-c154e5b1]{background:var(--bg-terminal);color:var(--term-green);border-color:var(--accent-2-soft)}.zbtn--terminal[data-v-c154e5b1]:hover{border-color:var(--term-green);box-shadow:var(--glow-terminal)}.zbtn--danger[data-v-c154e5b1]{background:var(--danger);color:var(--ink-on-accent);border-color:var(--danger)}.zbtn--danger[data-v-c154e5b1]:hover{filter:brightness(1.08)}.zbtn--danger[data-v-c154e5b1]:active{transform:translateY(1px)}@media(prefers-reduced-motion:reduce){.zbtn[data-v-c154e5b1]{transition:none}}</style><style>.boot[data-v-f59a7d91]{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-0);transition:opacity var(--dur-slow) var(--ease-out),visibility var(--dur-slow)}.boot.boot--done[data-v-f59a7d91]{pointer-events:none;visibility:hidden;opacity:0}.boot__in[data-v-f59a7d91]{width:min(560px,88vw);font-family:var(--font-mono);font-size:var(--fs-sm)}.boot__logo[data-v-f59a7d91]{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5);color:var(--text-strong)}.boot__logo b[data-v-f59a7d91]{font-size:var(--fs-lg)}.boot__logo-icon[data-v-f59a7d91]{font-size:26px;color:var(--accent)}.boot__line[data-v-f59a7d91]{min-height:1.6em;color:var(--text-muted)}.boot__ok[data-v-f59a7d91]{color:var(--term-green)}.boot__bar[data-v-f59a7d91]{height:3px;margin-top:var(--space-5);overflow:hidden;background:var(--surface-3);border-radius:var(--radius-xs)}.boot__bar i[data-v-f59a7d91]{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--aubergine-light));transition:width .1s linear}.boot__skip[data-v-f59a7d91]{display:inline-block;margin-top:var(--space-4);padding:0;font-family:inherit;font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-faint);cursor:pointer;background:none;border:none}.boot__skip[data-v-f59a7d91]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.boot[data-v-f59a7d91]{display:none}}</style><style>.atmos[data-v-796c86c1]{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}.aurora[data-v-796c86c1]{position:absolute;border-radius:var(--radius-circle);filter:blur(80px);mix-blend-mode:screen;will-change:transform}.aurora--orange[data-v-796c86c1]{top:-22%;left:48%;width:60vw;height:60vw;background:radial-gradient(circle at center,var(--orange-500),transparent 62%);opacity:.55;animation:drift-orange-796c86c1 26s var(--ease-in-out) infinite}.aurora--auberg[data-v-796c86c1]{top:6%;left:-22%;width:64vw;height:64vw;background:radial-gradient(circle at center,var(--aubergine-vivid),transparent 62%);opacity:.7;animation:drift-auberg-796c86c1 32s var(--ease-in-out) infinite}.aurora--red[data-v-796c86c1]{top:44%;left:26%;width:44vw;height:44vw;background:radial-gradient(circle at center,var(--term-red),transparent 64%);opacity:.4;animation:drift-red-796c86c1 30s var(--ease-in-out) infinite}.grid-dots[data-v-796c86c1]{background-image:radial-gradient(color-mix(in srgb,var(--ink-1) 6%,transparent) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,var(--surface-0) 30%,transparent 78%)}.grid-dots[data-v-796c86c1],.scanlines[data-v-796c86c1]{position:absolute;inset:0}.scanlines[data-v-796c86c1]{opacity:.35;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-0) 24%,transparent) 0 1px,transparent 1px 3px)}.vignette[data-v-796c86c1]{position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 0,transparent 55%,var(--surface-0) 100%)}@keyframes drift-orange-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-6vw,5vh) scale(1.12)}}@keyframes drift-auberg-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(7vw,-4vh) scale(1.08)}}@keyframes drift-red-796c86c1{0%,to{transform:translate(0) scale(1)}50%{transform:translate(-4vw,-6vh) scale(1.15)}}@media(prefers-reduced-motion:reduce){.aurora[data-v-796c86c1]{animation:none}}</style><style>.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{position:fixed;top:0;left:0;z-index:90;border-radius:var(--radius-circle);mix-blend-mode:difference;opacity:0;pointer-events:none;transition:opacity var(--dur-base) var(--ease-standard)}.cursor-dot.is-visible[data-v-0096a69c],.cursor-ring.is-visible[data-v-0096a69c]{opacity:1}.cursor-dot[data-v-0096a69c]{width:6px;height:6px;background:var(--ink-1)}.cursor-ring[data-v-0096a69c]{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ink-1) 70%,transparent);transition:width var(--dur-base) var(--ease-out),height var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-standard)}.cursor-ring.is-hot[data-v-0096a69c]{width:56px;height:56px;border-color:var(--accent)}@media(hover:none),(prefers-reduced-motion:reduce){.cursor-dot[data-v-0096a69c],.cursor-ring[data-v-0096a69c]{display:none}}</style><style>.hero-term[data-v-313a6524]{display:flex;flex-direction:column;min-height:300px;overflow:hidden;border:1px solid var(--accent-2-soft);border-radius:var(--radius-sm);box-shadow:var(--glow-terminal)}.hero-term__bar[data-v-313a6524]{position:relative;display:flex;flex:none;align-items:center;gap:var(--space-2);height:30px;padding:0 var(--space-3);background:var(--aubergine-black)}.hero-term__dots[data-v-313a6524]{display:flex;align-items:center;gap:7px}.hero-term__dot[data-v-313a6524]{width:13px;height:13px;border-radius:var(--radius-circle)}.hero-term__dot--close[data-v-313a6524]{background:var(--term-red)}.hero-term__dot--min[data-v-313a6524]{background:var(--term-yellow)}.hero-term__dot--max[data-v-313a6524]{background:var(--term-green)}.hero-term__title[data-v-313a6524]{position:absolute;inset:0;font-family:var(--font-mono);font-size:var(--fs-xs);letter-spacing:var(--ls-wide);color:var(--text-muted);text-align:center;pointer-events:none}.hero-term__body[data-v-313a6524]{flex:1;min-height:0;padding:var(--space-4);overflow:auto;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:var(--lh-snug);color:var(--ink-1);background:var(--bg-terminal);overflow-wrap:break-word}@supports (backdrop-filter:blur(5px)){.hero-term__body[data-v-313a6524]{background:color-mix(in srgb,var(--bg-terminal) 86%,transparent);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}}.hero-term__line[data-v-313a6524]{margin:0}.hero-term__out[data-v-313a6524]{margin:0 0 var(--space-4)}.hero-term__out--ink[data-v-313a6524]{color:var(--ink-1)}.hero-term__out--blue[data-v-313a6524]{color:var(--term-blue)}.hero-term__out--green[data-v-313a6524]{color:var(--term-green)}.hero-term__open[data-v-313a6524]{display:block;width:100%;padding:0;font:inherit;text-align:left;cursor:pointer;background:none;border:none;border-radius:var(--radius-xs)}.hero-term__open[data-v-313a6524]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.prm[data-v-313a6524]{font-family:var(--font-mono)}.prm__user[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--prompt)}.prm__sep[data-v-313a6524]{color:var(--ink-1)}.prm__dir[data-v-313a6524]{font-weight:var(--fw-bold);color:var(--term-blue)}.prm__cmd[data-v-313a6524]{color:var(--ink-1)}.prm__caret[data-v-313a6524]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:text-bottom;background:var(--prompt);animation:caret-blink 1s steps(1) infinite}@media(prefers-reduced-motion:reduce){.prm__caret[data-v-313a6524]{animation:none}}</style><style>.marquee[data-v-19576991]{display:block;width:100%;padding-block:var(--space-5);overflow:hidden;border-block:1px solid var(--border-subtle);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.marquee:hover .marquee__track[data-v-19576991]{animation-play-state:paused}.marquee__track[data-v-19576991]{display:flex;gap:var(--space-8);width:-moz-max-content;width:max-content;will-change:transform;animation:scroll-x-19576991 32s linear infinite}.marquee__item[data-v-19576991]{display:inline-flex;gap:var(--space-8);align-items:center;font-family:var(--font-mono);font-size:var(--fs-xl);letter-spacing:var(--ls-wide);color:var(--text-faint);white-space:nowrap}.marquee__label[data-v-19576991]{font-weight:var(--fw-regular);color:var(--text-body)}.marquee__star[data-v-19576991]{color:var(--accent)}@keyframes scroll-x-19576991{0%{transform:translate(0)}to{transform:translate(calc(-50% - var(--space-8)/2))}}@media(prefers-reduced-motion:reduce){.marquee[data-v-19576991]{-webkit-mask-image:none;mask-image:none}.marquee__track[data-v-19576991]{animation:none}.marquee__item--duplicate[data-v-19576991]{display:none}}</style><style>.home[data-v-80e32bdd]{display:block}.anim[data-v-80e32bdd]{animation:fade-rise var(--dur-slow) var(--ease-out) both}.hero__term-col[data-v-80e32bdd]{animation-delay:80ms}.hero[data-v-80e32bdd]{position:relative;overflow:hidden}.hero__grad[data-v-80e32bdd]{background:radial-gradient(900px 500px at 78% -10%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%),radial-gradient(700px 500px at 0 110%,color-mix(in srgb,var(--aubergine-vivid) 28%,transparent),transparent 60%),var(--bg-page)}.hero__in[data-v-80e32bdd]{position:relative;z-index:1;padding-block:var(--space-20)}.hero__grid[data-v-80e32bdd]{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--space-12);align-items:center}.hero__title[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-6xl);font-weight:var(--fw-light);letter-spacing:var(--ls-tight);color:var(--text-strong)}.hero__title em[data-v-80e32bdd]{font-style:normal;color:var(--accent)}.hero__sub[data-v-80e32bdd]{max-width:46ch;margin:var(--space-5) 0 var(--space-6);font-family:var(--font-sans);font-size:var(--fs-lg);line-height:var(--lh-relaxed);color:var(--text-body)}.hero__cta[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6)}.hero__badge-wrap[data-v-80e32bdd]{display:inline-flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-6);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted)}.hero__badge-wrap a[data-v-80e32bdd]{color:var(--accent);text-decoration:underline}.hero__badge-wrap a[data-v-80e32bdd]:hover{color:var(--accent-hover)}.hero__badge-wrap a[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.hero__pulse-dot[data-v-80e32bdd]{width:8px;height:8px;border-radius:var(--radius-circle);background:var(--success);box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent);animation:pulse-dot-80e32bdd 2.2s infinite var(--ease-out)}@media(prefers-reduced-motion:reduce){.hero__pulse-dot[data-v-80e32bdd]{animation:none}}@keyframes pulse-dot-80e32bdd{0%{box-shadow:0 0 color-mix(in srgb,var(--success) 60%,transparent)}70%{box-shadow:0 0 0 6px color-mix(in srgb,var(--success) 0%,transparent)}to{box-shadow:0 0 color-mix(in srgb,var(--success) 0%,transparent)}}.section__title[data-v-80e32bdd]{margin-bottom:var(--space-8);font-family:var(--font-mono);font-size:var(--fs-3xl);font-weight:var(--fw-regular);color:var(--text-strong)}.grid-3[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.grid-3>li[data-v-80e32bdd],.offer[data-v-80e32bdd]{display:flex}.offer[data-v-80e32bdd]{flex-direction:column;width:100%}.offer__top[data-v-80e32bdd]{justify-content:space-between;margin-bottom:var(--space-4)}.offer__icon[data-v-80e32bdd],.offer__top[data-v-80e32bdd]{display:flex;align-items:center}.offer__icon[data-v-80e32bdd]{justify-content:center;width:var(--space-10);height:var(--space-10);font-size:22px;color:var(--accent);background:var(--accent-soft);border-radius:var(--radius-md)}.offer__no[data-v-80e32bdd]{font-size:var(--fs-xs);letter-spacing:var(--ls-wider);color:var(--text-faint)}.offer__no[data-v-80e32bdd],.offer__title[data-v-80e32bdd]{font-family:var(--font-mono)}.offer__title[data-v-80e32bdd]{margin-bottom:var(--space-2);font-size:var(--fs-xl);font-weight:var(--fw-regular);color:var(--text-strong)}.offer__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-body)}.offer__points[data-v-80e32bdd]{display:flex;flex-direction:column;gap:var(--space-2);margin:0 0 var(--space-4);padding:0;list-style:none}.offer__points li[data-v-80e32bdd]{display:flex;gap:var(--space-2);align-items:flex-start;font-family:var(--font-mono);font-size:var(--fs-xs);line-height:var(--lh-normal);color:var(--text-muted)}.offer__check[data-v-80e32bdd]{flex-shrink:0;margin-top:calc(var(--space-1)/2);font-size:var(--fs-sm);color:var(--term-green)}.offer__tags[data-v-80e32bdd]{margin-bottom:var(--space-4)}.offer__price[data-v-80e32bdd]{margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-size:var(--fs-xs)}.offer__more[data-v-80e32bdd],.offer__price[data-v-80e32bdd]{font-family:var(--font-mono);color:var(--accent)}.offer__more[data-v-80e32bdd]{margin-top:var(--space-3);font-size:var(--fs-sm);text-decoration:none}.offer__more[data-v-80e32bdd]:hover{text-decoration:underline}.offer__more[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work[data-v-80e32bdd]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}.work>li[data-v-80e32bdd]{display:block;width:100%}.work__row[data-v-80e32bdd]{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:var(--space-6);align-items:center;padding:var(--space-8) var(--space-3);border-top:1px solid var(--border-subtle);text-decoration:none;color:inherit;transition:padding-left var(--dur-slow) var(--ease-out),background var(--dur-slow) var(--ease-standard)}.work__row[data-v-80e32bdd]:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--accent-soft),transparent 60%);opacity:0;transition:opacity var(--dur-slow) var(--ease-standard)}li:last-child .work__row[data-v-80e32bdd]{border-bottom:1px solid var(--border-subtle)}.work__row--link[data-v-80e32bdd]{cursor:pointer}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-6)}.work__row--link[data-v-80e32bdd]:hover:before{opacity:1}.work__row--link:hover .work__name[data-v-80e32bdd]{color:var(--accent)}.work__row--link:hover .work__go[data-v-80e32bdd]{color:var(--accent);transform:translate(6px,-6px)}.work__row--link[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.work__no[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-faint)}.work__main[data-v-80e32bdd],.work__no[data-v-80e32bdd]{position:relative}.work__topline[data-v-80e32bdd]{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--space-3)}.work__name[data-v-80e32bdd]{margin:0;font-family:var(--font-mono);font-size:clamp(1.4rem,2.8vw,2rem);font-weight:var(--fw-regular);letter-spacing:var(--ls-tight);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.work__status[data-v-80e32bdd]{color:var(--accent);letter-spacing:var(--ls-wide)}.work__role[data-v-80e32bdd],.work__status[data-v-80e32bdd]{font-family:var(--font-mono);font-size:var(--fs-xs)}.work__role[data-v-80e32bdd]{margin:var(--space-1) 0 0;color:var(--text-muted)}.work__desc[data-v-80e32bdd]{max-width:65ch;margin:var(--space-3) 0 0;font-size:var(--fs-sm)}.work__tags[data-v-80e32bdd]{margin-top:var(--space-4)}.work__go[data-v-80e32bdd]{position:relative;font-size:var(--fs-xl);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.stats[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin:var(--space-12) 0 0;padding:0;list-style:none}.stat[data-v-80e32bdd]{padding:var(--space-6);background:color-mix(in srgb,var(--surface-1) 70%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}.stat b[data-v-80e32bdd]{display:block;margin-bottom:var(--space-1);font-size:var(--fs-5xl);font-weight:var(--fw-light);line-height:1;letter-spacing:var(--ls-tight);color:var(--text-strong)}.stat b[data-v-80e32bdd],.stat span[data-v-80e32bdd]{font-family:var(--font-mono)}.stat span[data-v-80e32bdd]{font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--text-muted)}.block__head--row[data-v-80e32bdd]{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);margin-bottom:var(--space-8)}.block__head--row .section__title[data-v-80e32bdd]{margin-bottom:0}.seeall[data-v-80e32bdd]{display:inline-flex;flex:none;align-items:center;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-muted);text-decoration:none;white-space:nowrap;transition:color var(--dur-base) var(--ease-standard)}.seeall[data-v-80e32bdd]:hover{color:var(--accent)}.seeall[data-v-80e32bdd]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent);border-radius:var(--radius-xs)}.seeall__icon[data-v-80e32bdd]{font-size:var(--fs-base)}.journal[data-v-80e32bdd]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5);margin:0;padding:0;list-style:none}.journal>li[data-v-80e32bdd],.jpost[data-v-80e32bdd]{display:flex}.jpost[data-v-80e32bdd]{flex-direction:column;width:100%;color:inherit;text-decoration:none}.jpost:hover .jpost__title[data-v-80e32bdd]{color:var(--accent)}.jpost:hover .jpost__arrow[data-v-80e32bdd]{color:var(--accent);transform:translate(4px,-4px)}.jpost__thumb[data-v-80e32bdd]{width:100%;height:160px;-o-object-fit:cover;object-fit:cover;border-bottom:1px solid var(--border-subtle)}.jpost__body[data-v-80e32bdd]{display:flex;flex:1;flex-direction:column;padding:var(--space-5)}.jpost__tags[data-v-80e32bdd]{margin-bottom:var(--space-3)}.jpost__title[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-lg);font-weight:var(--fw-regular);line-height:var(--lh-snug);color:var(--text-strong);transition:color var(--dur-base) var(--ease-standard)}.jpost__desc[data-v-80e32bdd]{margin:0 0 var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)}.jpost__meta[data-v-80e32bdd]{display:flex;align-items:center;gap:var(--space-2);margin-top:auto;padding-top:var(--space-4);border-top:1px dashed var(--border-subtle);font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--text-faint)}.jpost__arrow[data-v-80e32bdd]{margin-left:auto;font-size:var(--fs-base);color:var(--text-faint);transition:transform var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-standard)}.journal__empty[data-v-80e32bdd]{max-width:60ch;margin:0 auto;text-align:center}.journal__empty-code[data-v-80e32bdd]{margin:0 0 var(--space-2);font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--accent)}.journal__empty-text[data-v-80e32bdd]{margin:0 0 var(--space-5);font-family:var(--font-sans);font-size:var(--fs-sm);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta[data-v-80e32bdd]{position:relative;padding:clamp(48px,6vw,72px) var(--space-6);overflow:hidden;text-align:center;background:radial-gradient(ellipse 80% 120% at 50% 0,var(--accent-2-soft),transparent 70%),color-mix(in srgb,var(--surface-2) 60%,transparent);border:1px solid var(--border-subtle);border-radius:var(--radius-lg)}.cta__eyebrow[data-v-80e32bdd]{display:inline-block}.cta__title[data-v-80e32bdd]{margin:0 0 var(--space-4);font-family:var(--font-mono);font-size:clamp(1.8rem,4vw,2.8rem);font-weight:var(--fw-light);line-height:var(--lh-tight);letter-spacing:var(--ls-tight);color:var(--text-strong)}.cta__highlight[data-v-80e32bdd]{font-style:italic;color:var(--accent)}.cta__subtitle[data-v-80e32bdd]{max-width:58ch;margin:0 auto var(--space-8);font-family:var(--font-sans);font-size:var(--fs-base);line-height:var(--lh-relaxed);color:var(--text-muted)}.cta__actions[data-v-80e32bdd]{display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center}@media(max-width:900px){.hero__grid[data-v-80e32bdd]{grid-template-columns:1fr}.hero__title[data-v-80e32bdd]{font-size:var(--fs-4xl)}.grid-3[data-v-80e32bdd],.journal[data-v-80e32bdd]{grid-template-columns:1fr}.block__head--row[data-v-80e32bdd]{flex-direction:column;align-items:flex-start}}@media(max-width:680px){.work__row[data-v-80e32bdd]{grid-template-columns:1fr;gap:var(--space-3)}.work__go[data-v-80e32bdd],.work__no[data-v-80e32bdd]{display:none}.stats[data-v-80e32bdd]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.anim[data-v-80e32bdd]{animation:none}.jpost__arrow[data-v-80e32bdd],.work__go[data-v-80e32bdd],.work__row[data-v-80e32bdd]{transition:none}.work__row--link[data-v-80e32bdd]:hover{padding-left:var(--space-3)}.work__row--link:hover .work__go[data-v-80e32bdd]{transform:none}}</style><style>.hexrow[data-v-a86d2094]{display:flex;gap:var(--space-5);margin:0;padding:0;list-style:none}</style><style>.hex[data-v-274e53e2]{display:inline-flex;align-items:center;justify-content:center;width:46px;height:53px;font-size:20px;color:var(--text-muted);cursor:pointer;background:var(--surface-2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transition:color var(--dur-base) var(--ease-standard),background var(--dur-base) var(--ease-standard)}.hex[data-v-274e53e2]:hover{color:var(--ink-on-accent);background:var(--accent)}.hex[data-v-274e53e2]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.hex__label[data-v-274e53e2]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;white-space:nowrap;border:0;clip-path:inset(50%)}@media(prefers-reduced-motion:reduce){.hex[data-v-274e53e2]{transition:none}}</style><style>.zcard[data-v-c5ec7be1]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-2),var(--shadow-hairline);transition:border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-standard)}.zcard--pad[data-v-c5ec7be1]{padding:var(--space-6)}.zcard--interactive[data-v-c5ec7be1]{cursor:pointer}.zcard--interactive[data-v-c5ec7be1]:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:var(--shadow-3),var(--shadow-hairline)}.zcard--interactive[data-v-c5ec7be1]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.zcard--accent[data-v-c5ec7be1]:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,var(--accent),var(--aubergine-light))}.zcard--featured[data-v-c5ec7be1]{border-color:var(--accent-ring);box-shadow:var(--glow-accent),var(--shadow-hairline)}@media(prefers-reduced-motion:reduce){.zcard[data-v-c5ec7be1]{transition:none}.zcard--interactive[data-v-c5ec7be1]:hover{transform:none}}</style><style>.ztag[data-v-6db1c85c]{display:inline-flex;align-items:center;gap:var(--space-2);box-sizing:border-box;height:26px;padding:0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-regular);line-height:1;white-space:nowrap;color:var(--text-body);background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);transition:border-color var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard)}.ztag[data-v-6db1c85c]:before{content:"#";color:var(--accent)}.ztag--plain[data-v-6db1c85c]:before{display:none;content:none}.ztag--clickable[data-v-6db1c85c]{cursor:pointer}.ztag--clickable[data-v-6db1c85c]:hover{border-color:var(--border-strong);color:var(--text-strong)}.ztag--clickable[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}.ztag__remove[data-v-6db1c85c]{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-right:-2px;padding:0;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1;color:var(--text-muted);cursor:pointer;background:none;border:none;border-radius:var(--radius-circle)}.ztag__remove[data-v-6db1c85c]:hover{color:var(--term-red)}.ztag__remove[data-v-6db1c85c]:focus-visible{outline:2px solid transparent;outline-offset:2px;box-shadow:var(--ring-accent)}@media(prefers-reduced-motion:reduce){.ztag[data-v-6db1c85c]{transition:none}}</style><link rel="stylesheet" href="/_nuxt/entry.QaoIl47T.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZButton.CyAD_ftR.css" crossorigin><link rel="stylesheet" href="/_nuxt/LinkListComponent.BRYW5MSq.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZBadge.BAw1B01J.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZTag.f2Aq6DLg.css" crossorigin><link rel="stylesheet" href="/_nuxt/ZCard.C5C9a-aj.css" crossorigin><link rel="modulepreload" as="script" crossorigin href="/_nuxt/kT-s8AA-.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/94XchtD0.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CZy76wlf.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DlAUqK2U.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CDaHTzsF.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DMhLy-fw.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CMQEDqfi.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/OpxrMEpG.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/C93KKm9n.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/1LEPDT53.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/ZsGxQ2mD.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/p0temu7u.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/BGMjmYXP.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/CXmFvnQY.js"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/DvmfV0_A.js"><script type="module" src="/_nuxt/kT-s8AA-.js" crossorigin></script><meta name="description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><link rel="icon" type="image/x-icon" href="/favicon.ico"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","@id":"https://jouan.ovh/#organization","name":"Simon Jouan","url":"https://jouan.ovh","logo":"https://jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><link rel="canonical" href="https://jouan.ovh"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur Full Stack TypeScript","url":"https://jouan.ovh","description":"Développeur Full Stack TypeScript — Nuxt / NestJS"}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur Full Stack TypeScript — Nuxt / NestJS","url":"https://jouan.ovh","image":"https://jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Rouen, France","addressCountry":"FR"}}</script><meta property="og:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta property="og:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta property="og:url" content="https://jouan.ovh"><meta property="og:type" content="website"><meta property="og:image" content="https://jouan.ovh/images/portrait.jpeg"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS"><meta name="twitter:description" content="Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL."><meta name="twitter:image" content="https://jouan.ovh/images/portrait.jpeg"></head><body><div id="__nuxt"><div class="init" data-v-e3708db0><header class="hdr" data-v-e3708db0 data-v-a782489c><div class="hdr__in" data-v-a782489c><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__brand" data-v-a782489c><svg class="zicon hdr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-a782489c>jouan.ovh</b></a><nav class="hdr__nav" aria-label="Navigation principale" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__link hdr__link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__link" data-v-a782489c>Services</a><a href="/about" class="hdr__link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__link" data-v-a782489c>Contact</a><!--]--></nav><div class="hdr__right" data-v-a782489c><div class="current-time hdr__clock" data-v-a782489c data-v-1e5503b4></div><span class="zbadge zbadge--success hdr__badge" data-v-a782489c data-v-fc077828><span class="zbadge__dot" aria-hidden="true" data-v-fc077828></span><!--[-->Disponible<!--]--></span><button class="hdr__action zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="hdr__action zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a><button class="hdr__burger" type="button" aria-expanded="false" aria-controls="hdr-mobile-menu" aria-label="Ouvrir le menu" data-v-a782489c><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></button></div></div><!----><nav id="hdr-mobile-menu" class="hdr__menu" aria-label="Navigation mobile" data-v-a782489c><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active hdr__menu-link hdr__menu-link--active" data-v-a782489c>Accueil</a><a href="/services" class="hdr__menu-link" data-v-a782489c>Services</a><a href="/about" class="hdr__menu-link" data-v-a782489c>À propos</a><a href="/blog" class="hdr__menu-link" data-v-a782489c>Blog</a><a href="/contact" class="hdr__menu-link" data-v-a782489c>Contact</a><!--]--><div class="hdr__menu-actions" data-v-a782489c><button class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-a782489c data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a782489c data-v-70d98695><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Terminal <!--]--><!----></button><a href="/contact" class="zbtn zbtn--primary zbtn--sm" data-v-a782489c data-v-c154e5b1><!----><!--[--> Démarrer un projet <!--]--><!----></a></div></nav><div data-v-a782489c><!--[--><!--]--></div></header><!--[--><main class="home" data-v-80e32bdd><span data-v-80e32bdd></span><div class="atmos" aria-hidden="true" data-v-80e32bdd data-v-796c86c1><div class="aurora aurora--auberg" data-v-796c86c1></div><div class="aurora aurora--orange" data-v-796c86c1></div><div class="aurora aurora--red" data-v-796c86c1></div><div class="grid-dots" data-v-796c86c1></div><div class="scanlines" data-v-796c86c1></div><div class="vignette" data-v-796c86c1></div></div><!----><section class="hero hero__grad" data-v-80e32bdd><div class="hero__in container" data-v-80e32bdd><div class="hero__grid" data-v-80e32bdd><div class="anim hero__text" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p><h1 class="hero__title" data-v-80e32bdd>Développeur Full Stack TypeScript</h1><p class="hero__sub" data-v-80e32bdd> Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l&#39;architecture au déploiement, j&#39;interviens sur des produits neufs comme sur des applications existantes. </p><div class="hero__badge-wrap" data-v-80e32bdd><span class="hero__pulse-dot" aria-hidden="true" data-v-80e32bdd></span><span data-v-80e32bdd>Disponible pour missions freelance</span><!--[--><span aria-hidden="true" data-v-80e32bdd> · </span><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-v-80e32bdd><!--[--> Profil Malt vérifié <!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><!--]--></div><div class="hero__cta" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="/about" class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div><div class="anim hero__term-col" data-v-80e32bdd><div class="hero-term" data-v-80e32bdd data-v-313a6524><div class="hero-term__bar" data-v-313a6524><span class="hero-term__dots" aria-hidden="true" data-v-313a6524><span class="hero-term__dot hero-term__dot--close" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--min" data-v-313a6524></span><span class="hero-term__dot hero-term__dot--max" data-v-313a6524></span></span><span class="hero-term__title" data-v-313a6524>anon.@jouan.ovh: ~</span></div><div class="hero-term__body" data-v-313a6524><!--[--><!--]--><!----><!----><noscript data-v-313a6524><div data-v-313a6524><!--[--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>whoami</span></span></p><p class="hero-term__out--ink hero-term__out" data-v-313a6524>Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>cat focus.txt</span></span></p><p class="hero-term__out--blue hero-term__out" data-v-313a6524>SaaS, web apps, clean architecture, automated testing (QA) &amp; AI engineering</p><!--]--><!--[--><p class="hero-term__line" data-v-313a6524><span class="prm" data-v-313a6524><span class="prm__user" data-v-313a6524>anon.@jouan.ovh</span><span class="prm__sep" data-v-313a6524>:</span><span class="prm__dir" data-v-313a6524>~</span><span class="prm__sep" data-v-313a6524>$ </span><span class="prm__cmd" data-v-313a6524>ls ~/projets</span></span></p><p class="hero-term__out--green hero-term__out" data-v-313a6524>keova.app/  tryon-saas/  nodium-lab/</p><!--]--><!--]--></div></noscript></div></div></div></div></div></section><div class="marquee" aria-hidden="true" data-v-80e32bdd data-v-19576991><div class="marquee__track" data-v-19576991><!--[--><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--><!--[--><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeScript</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Nuxt 4</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vue.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>NestJS</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Node.js</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>PostgreSQL</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>TypeORM</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Stripe Connect</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Cypress</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Docker</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>REST API</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><span class="marquee__item marquee__item--duplicate" data-v-19576991><b class="marquee__label" data-v-19576991>Vitest</b><span class="marquee__star" aria-hidden="true" data-v-19576991>✦</span></span><!--]--></div></div><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>ce que je propose</p><h2 class="section__title" data-v-80e32bdd>Trois expertises pour concevoir et faire évoluer vos applications</h2><ul class="grid-3" data-v-80e32bdd><!--[--><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span class="offer__no" data-v-80e32bdd>01 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Création d&#39;applications web &amp; SaaS</h3><p class="offer__desc" data-v-80e32bdd>De l&#39;idée à la production : architecture, développement front &amp; back, base de données, authentification et paiements Stripe.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Architecture logicielle &amp; APIs REST</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Applications Vue 3 / Nuxt 4 &amp; NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Intégration Stripe &amp; PostgreSQL</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->PostgreSQL<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Stripe Connect<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / au sprint</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Création d&#39;applications web &amp; SaaS" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive zcard--accent zcard--featured" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg></div><span class="offer__no" data-v-80e32bdd>02 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Développement Full Stack TypeScript</h3><p class="offer__desc" data-v-80e32bdd>Renfort d&#39;équipe produit ou développement de modules complexes avec une stack moderne unifiée de bout en bout.</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Composants Vue 3 / Nuxt avec TypeScript strict</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Microservices &amp; backend modulaire NestJS</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Fiabilisation et optimisation des performances</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->TypeScript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vue 3<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->NestJS<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Node.js<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Sur devis / TJM</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Développement Full Stack TypeScript" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><li data-v-80e32bdd><div class="offer zcard zcard--pad zcard--interactive" data-v-80e32bdd data-v-c5ec7be1><!--[--><div class="offer__top" data-v-80e32bdd><div class="offer__icon" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><span class="offer__no" data-v-80e32bdd>03 / 03</span></div><h3 class="offer__title" data-v-80e32bdd>Évolution &amp; Architecture applicative</h3><p class="offer__desc" data-v-80e32bdd>Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).</p><ul class="offer__points" data-v-80e32bdd><!--[--><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Audits techniques de code &amp; migrations de versions</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Tests E2E Cypress &amp; tests unitaires Vitest</span></li><li data-v-80e32bdd><svg class="zicon offer__check" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><polyline points="20 6 9 17 4 12"/></svg><span data-v-80e32bdd>Pipelines CI/CD &amp; conteneurisation Docker</span></li><!--]--></ul><ul class="hero__tags offer__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Cypress<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Vitest<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->Docker<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->CI/CD<!--]--><!----></span></li><!--]--></ul><div class="offer__price" data-v-80e32bdd><span data-v-80e32bdd>Au forfait / audit</span></div><a href="/services" class="offer__more" aria-label="En savoir plus sur Évolution &amp; Architecture applicative" data-v-80e32bdd> En savoir plus → </a><!--]--></div></li><!--]--></ul></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head" data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>projets sélectionnés</p><h2 class="section__title" data-v-80e32bdd>Des produits qui tournent en production</h2></div><ul class="work" data-v-80e32bdd><!--[--><li data-v-80e32bdd><a href="https://keova.app" rel="noopener" target="_blank" class="work__row work__row--link" data-hot data-v-80e32bdd><!--[--><span class="work__no" data-v-80e32bdd>01</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>keova.app</h3><span class="work__status" data-v-80e32bdd>En production</span></div><p class="work__role" data-v-80e32bdd>Co-fondateur &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->postgresql<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->stripe<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->saas<!--]--><!----></span></li><!--]--></ul></div><span class="work__go" aria-hidden="true" data-v-80e32bdd><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>02</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>TryOn</h3><span class="work__status" data-v-80e32bdd>Étude de cas (MVP livré)</span></div><p class="work__role" data-v-80e32bdd>CTO &amp; Développeur Full Stack</p><p class="prose work__desc" data-v-80e32bdd>Plateforme SaaS B2B d&#39;essayage virtuel de vêtements via l&#39;IA générative (diffusion models, microservices asynchrones, files Redis).</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nuxt<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->python<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->comfyui<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><li data-v-80e32bdd><div class="work__row" data-v-80e32bdd><span class="work__no" data-v-80e32bdd>03</span><div class="work__main" data-v-80e32bdd><div class="work__topline" data-v-80e32bdd><h3 class="work__name" data-v-80e32bdd>Nodium</h3><span class="work__status" data-v-80e32bdd>R&amp;D / En cours</span></div><p class="work__role" data-v-80e32bdd>Créateur &amp; Ingénieur IA</p><p class="prose work__desc" data-v-80e32bdd>Plateforme desktop d&#39;orchestration d&#39;agents IA autonomes, gestion de permissions et mémoire contextuelle.</p><ul class="hero__tags work__tags" data-v-80e32bdd><!--[--><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->typescript<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->electron<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->agents<!--]--><!----></span></li><li data-v-80e32bdd><span class="ztag" data-v-80e32bdd data-v-6db1c85c><!--[-->ia<!--]--><!----></span></li><!--]--></ul></div><!----></div></li><!--]--></ul><ul class="stats" data-v-80e32bdd><!--[--><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>11</b><span data-v-80e32bdd>années d&#39;expérience web</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>100%</b><span data-v-80e32bdd>TypeScript &amp; SaaS de bout en bout</span></li><li class="stat" data-v-80e32bdd><b data-v-80e32bdd>QA</b><span data-v-80e32bdd>culture d&#39;automatisation &amp; zéro régression</span></li><!--]--></ul></div></section><section class="section" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="block__head block__head--row" data-v-80e32bdd><div data-v-80e32bdd><p class="eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>// </span>~/journal</p><h2 class="section__title" data-v-80e32bdd>Notes de dev, écrites en construisant</h2></div><a href="/blog" class="seeall" data-hot data-v-80e32bdd> cat tous-les-articles <svg class="zicon seeall__icon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a></div><div class="journal__empty zcard zcard--pad" data-v-80e32bdd data-v-c5ec7be1><!--[--><p class="journal__empty-code" data-v-80e32bdd>$ cat ~/journal/*.md</p><p class="journal__empty-text" data-v-80e32bdd>Les notes d&#39;ingénierie et retours d&#39;expérience sont en cours de rédaction.</p><a href="/blog" class="zbtn zbtn--secondary zbtn--sm" data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Consulter la section blog <!--]--><!----></a><!--]--></div></div></section><section class="section section--sunken" data-v-80e32bdd><div class="container" data-v-80e32bdd><div class="cta" data-v-80e32bdd><p class="eyebrow cta__eyebrow" data-v-80e32bdd><span aria-hidden="true" data-v-80e32bdd>$ </span>./contact --start</p><h2 class="cta__title" data-v-80e32bdd>Un projet en tête ? Mettons-le <span class="cta__highlight" data-v-80e32bdd>en production</span>.</h2><p class="cta__subtitle" data-v-80e32bdd> Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en. </p><div class="cta__actions" data-v-80e32bdd><a href="/contact" class="zbtn zbtn--primary zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Discuter de votre projet <!--]--><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-80e32bdd data-v-70d98695><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><!--]--></span></a><a href="https://www.malt.fr/profile/simonjouan" rel="noopener" target="_blank" data-hot class="zbtn zbtn--secondary zbtn--lg" data-v-80e32bdd data-v-c154e5b1><!--[--><!----><!--[--> Me contacter sur Malt <!--]--><!----><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a><a href="/about" class="zbtn zbtn--ghost zbtn--lg" data-hot data-v-80e32bdd data-v-c154e5b1><!----><!--[--> Voir le parcours &amp; CV <!--]--><!----></a></div></div></div></section></main><!--]--><footer class="ftr" data-v-e3708db0 data-v-ec74c766><div class="ftr__container" data-v-ec74c766><div class="ftr__in" data-v-ec74c766><div class="ftr__brand-col" data-v-ec74c766><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__brand" data-v-ec74c766><svg class="zicon ftr__logo" viewbox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-ec74c766 data-v-70d98695><path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/><path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/></svg><b data-v-ec74c766>jouan.ovh</b></a><p class="ftr__tagline" data-v-ec74c766>Développeur Full Stack TypeScript — Nuxt / NestJS. Rouen, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-ec74c766>Accueil</a><a href="/services" class="ftr__link" data-v-ec74c766>Services</a><a href="/about" class="ftr__link" data-v-ec74c766>À propos</a><a href="/blog" class="ftr__link" data-v-ec74c766>Blog</a><a href="/contact" class="ftr__link" data-v-ec74c766>Contact</a><a href="/confidentialite" class="ftr__link" data-v-ec74c766>Confidentialité</a><a href="/mentions-legales" class="ftr__link" data-v-ec74c766>Mentions légales</a><!--]--></nav><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Projets</h2><ul class="ftr__list" data-v-ec74c766><!--[--><li data-v-ec74c766><a href="https://keova.app" rel="noopener noreferrer" target="_blank" class="ftr__link" data-v-ec74c766><!--[-->keova.app<!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>TryOn</span></li><li data-v-ec74c766><span class="ftr__link ftr__link--static" data-v-ec74c766>Nodium</span></li><!--]--></ul></div><div class="ftr__col" data-v-ec74c766><h2 class="ftr__title" data-v-ec74c766>// Réseaux</h2><ul class="hexrow" data-v-ec74c766 data-v-a86d2094><!--[--><li data-v-a86d2094><a href="https://github.com/zohac" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->GitHub<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://twitter.com/fenrir0680" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->Twitter<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><li data-v-a86d2094><a href="https://www.linkedin.com/in/simonjouan/" rel="noopener noreferrer" target="_blank" class="hex" data-v-a86d2094 data-v-274e53e2><!--[--><!--[--><svg class="zicon" viewbox="0 0 16 16" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-v-a86d2094 data-v-70d98695><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg><!--]--><span class="hex__label" data-v-274e53e2><!--[-->LinkedIn<!--]--></span><!--]--><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></a></li><!--]--></ul></div></div><div class="ftr__bottom" data-v-ec74c766><span data-v-ec74c766>© 2026 Simon Jouan — jouan.ovh</span><span class="ftr__term" data-v-ec74c766>anon.@jouan.ovh:~$ <span class="ftr__cmd" data-v-ec74c766>echo &quot;merci de votre visite&quot;</span></span></div></div></footer></div></div><div id="teleports"></div><script>window.__NUXT__={};window.__NUXT__.config={public:{web3formsAccessKey:"320b7ade-7b76-421e-a4bd-f353fd22348b",siteUrl:"https://jouan.ovh",mdc:{components:{prose:true,map:{},customElements:[]},headings:{anchorLinks:{h1:false,h2:true,h3:true,h4:true,h5:false,h6:false}},highlight:false},content:{wsUrl:""}},app:{baseURL:"/",buildId:"47020e4c-64d1-4922-b979-d9f58139e1fe",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script><script type="application/json" data-nuxt-data="nuxt-app" data-ssr="true" id="__NUXT_DATA__">[["ShallowReactive",1],{"prerenderedAt":2,"data":3,"state":6,"once":8,"_errors":9,"serverRendered":11,"path":12},1789327459772,["ShallowReactive",4],{"home-articles":5},[],["Reactive",7],{},["Set"],["ShallowReactive",10],{"home-articles":-1},true,"\u002F"]</script></body></html>

2026-09-13T19:24:55.766502Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion.md | sed -n '96,145p'; nl -ba AGENTS.md | sed -n '70,125p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    96	
    97	## Dev Notes
    98	
    99	### Architecture & Contraintes d'environnement
   100	- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
   101	- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)`, `var(--text-strong)`, `var(--text-muted)`, `var(--text-faint)`, `var(--accent)`, `var(--accent-soft)`, `var(--font-mono)`, `var(--fs-sm)`, `var(--space-6)`, etc.). [Source: AGENTS.md#Section 3]
   102	- **Pas de préfixes vendeurs manuels :** Stylelint interdit les préfixes manuels comme `-webkit-*`. Les préfixes navigateurs sont injectés automatiquement par Autoprefixer/PostCSS au build. [Source: AGENTS.md#Section 3]
   103	- **Accessibilité (a11y) dès la conception :**
   104	  - Tout lien ouvrant un nouvel onglet DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`), garantissant `rel="noopener"` et l'annonce sr-only `(ouvre dans un nouvel onglet)`.
   105	  - Les projets sans URL externe active (`TryOn`, `Nodium`) ne doivent PAS comporter de fausse balise `<a>` avec `href="#"` ou URL cassée menant à une 404.
   106	  - Les listes de projets et de statistiques doivent être balisées en listes sémantiques `<ul>` et `<li>`.
   107	  - Les éléments interactifs doivent conserver le repli standard pour contraste forcé (`forced-colors`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
   108	- **DRY & Données :** Consommer `SITE.projects` et `SITE.profile` depuis `app/data/site.ts`. Ne jamais dupliquer les URLs, titres ou descriptions en dur.
   109	- **SSG & Prerender Safety :** La récupération des articles de blog via `useAsyncData` et `queryCollection` est résolue au build Nitro. Aucun accès direct aux APIs navigateur sans garde SSR.
   110	
   111	### Fichiers modifiés et créés
   112	- **`app/pages/index.vue`** (UPDATE) : Refonte complète des sections projets sélectionnés, stats, ajout du journal technique et du bloc CTA final.
   113	
   114	### Données & Textes exacts (Source : `sections-mapping.md`, `epics.md`, `contexte_malt.md`)
   115	- **Projets sélectionnés :**
   116	  - Keova : Rôle `Co-fondateur & Développeur Full Stack`, Statut `● En production`, URL `https://keova.app`.
   117	  - TryOn : Rôle `CTO & Développeur Full Stack`, Statut `○ Étude de cas (MVP livré)`.
   118	  - Nodium : Rôle `Créateur & Ingénieur IA`, Statut `◐ R&D / En cours`.
   119	- **Stats de réassurance :**
   120	  - `11` / `années d'expérience web`
   121	  - `100%` / `TypeScript & SaaS de bout en bout`
   122	  - `QA` / `culture d'automatisation & zéro régression`
   123	- **Journal :**
   124	  - Eyebrow : `// ~/journal`
   125	  - Titre : `Notes de dev, écrites en construisant`
   126	  - Lien : `cat tous-les-articles →` pointant vers `/blog`
   127	- **CTA final :**
   128	  - Eyebrow : `$ ./contact --start`
   129	  - Titre : `Un projet en tête ? Mettons-le en production.`
   130	  - Sous-titre : `Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript, parlons-en.`
   131	  - Boutons : `/contact` (« Discuter de votre projet »), `SITE.profile.maltUrl` (« Me contacter sur Malt »), `/about` (« Voir le parcours & CV »).
   132	
   133	## Dev Agent Record
   134	
   135	### Agent Model Used
   136	- Gemini 3.7 Flash (Low)
   137	
   138	### Debug Log References
   139	- Gate de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécutée avec succès (0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques pré-rendues).
   140	- Résolution des ajustements de formatage Prettier sur les balises de template et dégradés SCSS.
   141	
   142	### Completion Notes List
   143	- Implémentation complète de la section `.work` en liste sémantique `<ul>`/`<li>` avec les 3 projets SaaS issus de `SITE.projects` (Keova en lien `<ZExternalLink>`, TryOn et Nodium sans lien externe mort, tags `ZTag`, statuts et rôles).
   144	- Intégration de la grille `.stats` responsive à 3 compteurs (`11`, `100%`, `QA`) avec police monospace et adaptation 1 colonne sur mobile.
   145	- Intégration de la section Journal technique avec requête `@nuxt/content` v3 (`useAsyncData` + `queryCollection('blog').order('date', 'DESC').limit(3).all()`), lien vers `/blog` et état de repli élégant.
    70	│   ├── assets/scss/
    71	│   │   ├── abstract/        # Tokens, variables, mixins (_root.scss = source vérité CSS vars)
    72	│   │   ├── base/            # _reset.scss, _layout.scss (primitives globales), _motion.scss
    73	│   │   └── main.scss        # Point d'entrée SCSS global
    74	│   ├── components/
    75	│   │   ├── ui/              # Primitives DS auto-importées sans préfixe (ZButton, ZCard, ZExternalLink...)
    76	│   │   ├── card/            # Sous-blocs ZCardHeader, ZCardBody, ZCardFooter
    77	│   │   ├── terminal/        # Sous-système terminal draggable (TerminalComponent, TerminalManagerComponent)
    78	│   │   │   └── programs/    # Classes TypeScript pures implémentant IProgram
    79	│   │   ├── HeaderComponent.vue
    80	│   │   ├── FooterComponent.vue
    81	│   │   └── HexagonLinkComponent.vue
    82	│   ├── composables/
    83	│   │   ├── useSiteUrl.ts    # Source unique pour l'URL de base résolue via runtimeConfig
    84	│   │   └── usePageSeo.ts    # Helper universel useSeoMeta, canonical et Schema.org / JSON-LD
    85	│   ├── data/
    86	│   │   └── site.ts          # SOURCE UNIQUE de vérité pour le profil, compétences et projets (SITE)
    87	│   ├── layouts/
    88	│   │   └── default.vue      # Layout principal
    89	│   └── pages/               # 13 routes statiques pré-rendues
    90	│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
    91	│       ├── services.vue     # Offres de freelance et déroulé du process en 4 étapes
    92	│       ├── about.vue        # Biographie, timeline expériences/formations et stack
    93	│       ├── contact.vue      # Formulaire de contact Web3Forms et coordonnées
    94	│       ├── confidentialite.vue # Politique de confidentialité RGPD
    95	│       ├── mentions-legales.vue# Mentions légales
    96	│       └── blog/
    97	│           ├── index.vue    # Liste des articles du blog
    98	│           └── [...slug].vue# Rendu Markdown d'article via <ContentRenderer>
    99	├── content/
   100	│   └── blog/                # Articles de blog au format Markdown
   101	├── content.config.ts        # Schéma et validation Zod des collections @nuxt/content
   102	├── nuxt.config.ts           # Configuration centrale Nuxt 4
   103	├── public/
   104	│   ├── CNAME                # Domaine de production officiel (contient "jouan.ovh")
   105	│   ├── _headers             # En-têtes HTTP de sécurité pour gh-pages
   106	│   └── images/              # Assets statiques optimisés
   107	├── .github/workflows/cd.yml # Pipeline CI/CD GitHub Actions
   108	└── docs/                    # Documentation projet, specs, artifacts de planning et d'implémentation
   109	```
   110	
   111	---
   112	
   113	## 5. Invariants & Règles d'Implémentation Critiques
   114	
   115	### 1. URLs et Domaines : Jamais de Hardcoding
   116	- **Règle :** Ne **JAMAIS** écrire en dur `https://jouan.ovh` ou `https://dev.jouan.ovh` dans le code applicatif ou les métadonnées.
   117	- **Pattern :** Toujours injecter l'URL via le composable `useSiteUrl()`. Ce composable lit `runtimeConfig.public.siteUrl` (surchargeable par la variable d'environnement `NUXT_PUBLIC_SITE_URL`).
   118	- **SEO :** Utiliser systématiquement `usePageSeo({ title, description, path, ... })` pour garantir l'unicité des canonicals et des balises OpenGraph/Twitter.
   119	
   120	### 2. Contenu Partagé : DRY Strict
   121	- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
   122	- **Pattern :** Consommer `SITE.profile`, `SITE.skills` ou `SITE.projects` depuis `app/data/site.ts`.
   123	
   124	### 3. Tokens & Primitives de Layout SCSS
   125	- **No Hardcode :** Aucune couleur, rayon, ombre ou marge en dur. Toujours consommer les variables globales `var(--token)`.

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-4/full.diff | sed -n '1,190p;300,470p;520,660p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/pages/index.vue b/app/pages/index.vue
     2	index f49add5..8a04ba6 100644
     3	--- a/app/pages/index.vue
     4	+++ b/app/pages/index.vue
     5	@@ -84,47 +84,149 @@
     6	       </div>
     7	     </section>
     8	 
     9	-    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    10	+    <!-- Projets sélectionnés & Statistiques de réassurance (Story 11.4 / AC-1 & AC-2) -->
    11	     <section class="section section--sunken">
    12	       <div class="container">
    13	-        <div class="statrow">
    14	-          <div v-for="stat in stats" :key="stat.id" class="stat">
    15	+        <div class="block__head">
    16	+          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
    17	+          <h2 class="section__title">Des produits qui tournent en production</h2>
    18	+        </div>
    19	+
    20	+        <ul class="work">
    21	+          <li v-for="(project, index) in projects" :key="project.name">
    22	+            <component
    23	+              :is="project.url ? ZExternalLink : 'div'"
    24	+              :href="project.url"
    25	+              class="work__row"
    26	+              :class="{ 'work__row--link': Boolean(project.url) }"
    27	+              :data-hot="project.url ? '' : undefined"
    28	+            >
    29	+              <span class="work__no">0{{ index + 1 }}</span>
    30	+              <div class="work__main">
    31	+                <div class="work__topline">
    32	+                  <h3 class="work__name">{{ project.name }}</h3>
    33	+                  <span v-if="project.status" class="work__status">{{ project.status }}</span>
    34	+                </div>
    35	+                <p class="work__role">{{ project.role }}</p>
    36	+                <p class="prose work__desc">{{ project.desc }}</p>
    37	+                <ul class="hero__tags work__tags">
    38	+                  <li v-for="tag in project.tags" :key="tag">
    39	+                    <ZTag>{{ tag }}</ZTag>
    40	+                  </li>
    41	+                </ul>
    42	+              </div>
    43	+              <span v-if="project.url" class="work__go" aria-hidden="true">
    44	+                <ZIcon name="arrow" />
    45	+              </span>
    46	+            </component>
    47	+          </li>
    48	+        </ul>
    49	+
    50	+        <!-- Statistiques clés de réassurance (Story 11.4 / AC-2) -->
    51	+        <ul class="stats">
    52	+          <li v-for="stat in stats" :key="stat.id" class="stat">
    53	             <b>{{ stat.value }}</b>
    54	             <span>{{ stat.label }}</span>
    55	+          </li>
    56	+        </ul>
    57	+      </div>
    58	+    </section>
    59	+
    60	+    <!-- Journal technique / Notes de dev (Story 11.4 / AC-3) -->
    61	+    <section class="section">
    62	+      <div class="container">
    63	+        <div class="block__head block__head--row">
    64	+          <div>
    65	+            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
    66	+            <h2 class="section__title">Notes de dev, écrites en construisant</h2>
    67	           </div>
    68	+          <NuxtLink to="/blog" class="seeall" data-hot>
    69	+            cat tous-les-articles
    70	+            <ZIcon name="arrow" class="seeall__icon" />
    71	+          </NuxtLink>
    72	         </div>
    73	 
    74	-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
    75	-        <ul class="grid-2 projects">
    76	-          <li v-for="project in projects" :key="project.name">
    77	-            <ZCard
    78	-              class="project"
    79	-              :interactive="Boolean(project.url)"
    80	-              :data-hot="Boolean(project.url) ? '' : undefined"
    81	-              :as="project.url ? ZExternalLink : 'div'"
    82	-              :href="project.url || undefined"
    83	-              :rel="project.url ? 'noopener noreferrer' : undefined"
    84	-            >
    85	-              <div class="project__head">
    86	-                <h3 class="project__name">{{ project.name }}</h3>
    87	-                <span class="project__role">{{ project.role }}</span>
    88	+        <!-- Liste des articles les plus récents -->
    89	+        <ul v-if="articles && articles.length" class="journal">
    90	+          <li v-for="article in articles" :key="article.path" class="journal__item">
    91	+            <ZCard :as="NuxtLink" :to="article.path" interactive class="jpost" data-hot>
    92	+              <NuxtImg
    93	+                v-if="article.image"
    94	+                class="jpost__thumb"
    95	+                :src="article.image.src"
    96	+                :alt="article.image.alt"
    97	+                width="360"
    98	+                height="200"
    99	+                sizes="360px"
   100	+                format="webp"
   101	+              />
   102	+              <div class="jpost__body">
   103	+                <ul v-if="article.tags?.length" class="hero__tags jpost__tags">
   104	+                  <li v-for="tag in article.tags" :key="tag">
   105	+                    <ZTag>{{ tag }}</ZTag>
   106	+                  </li>
   107	+                </ul>
   108	+                <h3 class="jpost__title">{{ article.title }}</h3>
   109	+                <p v-if="article.description" class="prose jpost__desc">{{ article.description }}</p>
   110	+                <div class="jpost__meta">
   111	+                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
   112	+                  <template v-if="article.read">
   113	+                    <span aria-hidden="true">·</span>
   114	+                    <span>{{ article.read }} de lecture</span>
   115	+                  </template>
   116	+                  <span class="jpost__arrow" aria-hidden="true">
   117	+                    <ZIcon name="arrow" />
   118	+                  </span>
   119	+                </div>
   120	               </div>
   121	-              <p class="prose project__desc">{{ project.desc }}</p>
   122	-              <ul class="hero__tags">
   123	-                <li v-for="tag in project.tags" :key="tag">
   124	-                  <ZTag>{{ tag }}</ZTag>
   125	-                </li>
   126	-              </ul>
   127	             </ZCard>
   128	           </li>
   129	         </ul>
   130	+
   131	+        <!-- État d'attente sobre lorsque aucun article n'est encore publié -->
   132	+        <ZCard v-else class="journal__empty" padded>
   133	+          <p class="journal__empty-code">$ cat ~/journal/*.md</p>
   134	+          <p class="journal__empty-text">Les notes d'ingénierie et retours d'expérience sont en cours de rédaction.</p>
   135	+          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
   136	+        </ZCard>
   137	+      </div>
   138	+    </section>
   139	+
   140	+    <!-- Bloc CTA final de conversion (Story 11.4 / AC-4) -->
   141	+    <section class="section section--sunken">
   142	+      <div class="container">
   143	+        <div class="cta">
   144	+          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
   145	+          <h2 class="cta__title">Un projet en tête ? Mettons-le <span class="cta__highlight">en production</span>.</h2>
   146	+          <p class="cta__subtitle">
   147	+            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
   148	+            parlons-en.
   149	+          </p>
   150	+          <div class="cta__actions">
   151	+            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
   152	+              Discuter de votre projet
   153	+              <template #iconRight><ZIcon name="arrow" /></template>
   154	+            </ZButton>
   155	+            <ZButton
   156	+              v-if="SITE.profile.maltUrl"
   157	+              :as="ZExternalLink"
   158	+              :href="SITE.profile.maltUrl"
   159	+              variant="secondary"
   160	+              size="lg"
   161	+              data-hot
   162	+            >
   163	+              Me contacter sur Malt
   164	+            </ZButton>
   165	+            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
   166	+          </div>
   167	+        </div>
   168	       </div>
   169	     </section>
   170	   </main>
   171	 </template>
   172	 
   173	 <script setup lang="ts">
   174	-// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
   175	+// Page d'accueil — refonte Hero Full Stack TS, Projets SaaS, Journal & CTA final (Story 11.4).
   176	 // Architecture multi-pages Nuxt 4, dark-first, accent orange.
   177	 import { ref } from "vue";
   178	 import { NuxtLink, ZExternalLink } from "#components";
   179	@@ -149,7 +251,6 @@ interface HomeServiceOffer {
   180	 }
   181	 
   182	 // Vitrine des 3 offres ciblées Full Stack TS (Story 11.3 / AC-2).
   183	-// Remplacement complet des données legacy.
   184	 const services: HomeServiceOffer[] = [
   185	   {
   186	     id: "creation",
   187	@@ -198,15 +299,20 @@ const services: HomeServiceOffer[] = [
   188	   },
   189	 ];
   190	 
   300	+
   301	+.work__topline {
   302	   display: flex;
   303	   flex-wrap: wrap;
   304	-  gap: var(--space-12);
   305	+  align-items: baseline;
   306	+  gap: var(--space-3);
   307	+}
   308	 
   309	-  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
   310	-  margin-bottom: var(--space-12);
   311	+.work__name {
   312	+  margin: 0;
   313	+  font-family: var(--font-mono);
   314	+  font-size: clamp(1.4rem, 2.8vw, 2rem);
   315	+  font-weight: var(--fw-regular);
   316	+  letter-spacing: var(--ls-tight);
   317	+  color: var(--text-strong);
   318	+  transition: color var(--dur-base) var(--ease-standard);
   319	 }
   320	 
   321	-.stat {
   322	+.work__status {
   323	+  font-family: var(--font-mono);
   324	+  font-size: var(--fs-xs);
   325	+  color: var(--accent);
   326	+  letter-spacing: var(--ls-wide);
   327	+}
   328	+
   329	+.work__role {
   330	+  margin: var(--space-1) 0 0;
   331	   font-family: var(--font-mono);
   332	+  font-size: var(--fs-xs);
   333	+  color: var(--text-muted);
   334	+}
   335	+
   336	+.work__desc {
   337	+  max-width: 65ch;
   338	+  margin: var(--space-3) 0 0;
   339	+  font-size: var(--fs-sm);
   340	+}
   341	+
   342	+.work__tags {
   343	+  margin-top: var(--space-4);
   344	+}
   345	+
   346	+.work__go {
   347	+  position: relative;
   348	+  font-size: var(--fs-xl);
   349	+  color: var(--text-faint);
   350	+  transition:
   351	+    transform var(--dur-base) var(--ease-out),
   352	+    color var(--dur-base) var(--ease-standard);
   353	+}
   354	+
   355	+// ---- Stats (porté de .stats) ----
   356	+.stats {
   357	+  display: grid;
   358	+  grid-template-columns: repeat(3, 1fr);
   359	+  gap: var(--space-4);
   360	+  margin: var(--space-12) 0 0;
   361	+  padding: 0;
   362	+  list-style: none;
   363	+}
   364	+
   365	+.stat {
   366	+  padding: var(--space-6);
   367	+  background: color-mix(in srgb, var(--surface-1) 70%, transparent);
   368	+  border: 1px solid var(--border-subtle);
   369	+  border-radius: var(--radius-md);
   370	 
   371	   b {
   372	     display: block;
   373	-    font-size: var(--fs-4xl);
   374	+    margin-bottom: var(--space-1);
   375	+    font-family: var(--font-mono);
   376	+    font-size: var(--fs-5xl);
   377	     font-weight: var(--fw-light);
   378	+    line-height: 1;
   379	+    letter-spacing: var(--ls-tight);
   380	     color: var(--text-strong);
   381	   }
   382	 
   383	   span {
   384	+    font-family: var(--font-mono);
   385	     font-size: var(--fs-sm);
   386	+    letter-spacing: var(--ls-wide);
   387	     color: var(--text-muted);
   388	   }
   389	 }
   390	 
   391	-// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
   392	-.grid-2 {
   393	-  display: grid;
   394	-  grid-template-columns: 1fr 1fr;
   395	+// ---- Section Journal (porté de Home - Awwwards.html .journal) ----
   396	+.block__head--row {
   397	+  display: flex;
   398	+  align-items: flex-end;
   399	+  justify-content: space-between;
   400	   gap: var(--space-6);
   401	+  margin-bottom: var(--space-8);
   402	+
   403	+  .section__title {
   404	+    margin-bottom: 0;
   405	+  }
   406	+}
   407	+
   408	+.seeall {
   409	+  display: inline-flex;
   410	+  flex: none;
   411	+  align-items: center;
   412	+  gap: var(--space-2);
   413	+  font-family: var(--font-mono);
   414	+  font-size: var(--fs-sm);
   415	+  color: var(--text-muted);
   416	+  text-decoration: none;
   417	+  white-space: nowrap;
   418	+  transition: color var(--dur-base) var(--ease-standard);
   419	+
   420	+  &:hover {
   421	+    color: var(--accent);
   422	+  }
   423	+
   424	+  &:focus-visible {
   425	+    outline: 2px solid transparent;
   426	+    outline-offset: 2px;
   427	+    box-shadow: var(--ring-accent);
   428	+    border-radius: var(--radius-xs);
   429	+  }
   430	+}
   431	+
   432	+.seeall__icon {
   433	+  font-size: var(--fs-base);
   434	+}
   435	+
   436	+.journal {
   437	+  display: grid;
   438	+  grid-template-columns: repeat(3, 1fr);
   439	+  gap: var(--space-5);
   440	   margin: 0;
   441	   padding: 0;
   442	   list-style: none;
   443	@@ -555,51 +841,150 @@ usePageSeo({
   444	   }
   445	 }
   446	 
   447	-.projects {
   448	-  margin-top: var(--space-5);
   449	-}
   450	-
   451	-// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
   452	-// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
   453	-.project {
   454	+.jpost {
   455	   display: flex;
   456	   flex-direction: column;
   457	   width: 100%;
   458	+  color: inherit;
   459	   text-decoration: none;
   460	 
   461	-  .hero__tags {
   462	-    margin-top: auto;
   463	+  &:hover {
   464	+    .jpost__title {
   465	+      color: var(--accent);
   466	+    }
   467	+
   468	+    .jpost__arrow {
   469	+      color: var(--accent);
   470	+      transform: translate(4px, -4px);
   520	+  gap: var(--space-2);
   521	+  margin-top: auto;
   522	+  padding-top: var(--space-4);
   523	+  border-top: 1px dashed var(--border-subtle);
   524	   font-family: var(--font-mono);
   525	   font-size: var(--fs-xs);
   526	-  color: var(--text-muted);
   527	-  white-space: nowrap;
   528	+  color: var(--text-faint);
   529	+}
   530	+
   531	+.jpost__arrow {
   532	+  margin-left: auto;
   533	+  font-size: var(--fs-base);
   534	+  color: var(--text-faint);
   535	+  transition:
   536	+    transform var(--dur-base) var(--ease-out),
   537	+    color var(--dur-base) var(--ease-standard);
   538	+}
   539	+
   540	+.journal__empty {
   541	+  max-width: 60ch;
   542	+  margin: 0 auto;
   543	+  text-align: center;
   544	 }
   545	 
   546	-.project__desc {
   547	-  margin: var(--space-3) 0 var(--space-4);
   548	+.journal__empty-code {
   549	+  margin: 0 0 var(--space-2);
   550	+  font-family: var(--font-mono);
   551	   font-size: var(--fs-sm);
   552	+  color: var(--accent);
   553	+}
   554	+
   555	+.journal__empty-text {
   556	+  margin: 0 0 var(--space-5);
   557	+  font-family: var(--font-sans);
   558	+  font-size: var(--fs-sm);
   559	+  line-height: var(--lh-relaxed);
   560	+  color: var(--text-muted);
   561	+}
   562	+
   563	+// ---- Bloc CTA final (porté de .cta) ----
   564	+.cta {
   565	+  position: relative;
   566	+  padding: clamp(48px, 6vw, 72px) var(--space-6);
   567	+  overflow: hidden;
   568	+  text-align: center;
   569	+  background:
   570	+    radial-gradient(ellipse 80% 120% at 50% 0%, var(--accent-2-soft), transparent 70%),
   571	+    color-mix(in srgb, var(--surface-2) 60%, transparent);
   572	+  border: 1px solid var(--border-subtle);
   573	+  border-radius: var(--radius-lg);
   574	+}
   575	+
   576	+.cta__eyebrow {
   577	+  display: inline-block;
   578	+}
   579	+
   580	+.cta__title {
   581	+  margin: 0 0 var(--space-4);
   582	+  font-family: var(--font-mono);
   583	+  font-size: clamp(1.8rem, 4vw, 2.8rem);
   584	+  font-weight: var(--fw-light);
   585	+  line-height: var(--lh-tight);
   586	+  letter-spacing: var(--ls-tight);
   587	+  color: var(--text-strong);
   588	+}
   589	+
   590	+.cta__highlight {
   591	+  font-style: italic;
   592	+  color: var(--accent);
   593	+}
   594	+
   595	+.cta__subtitle {
   596	+  max-width: 58ch;
   597	+  margin: 0 auto var(--space-8);
   598	+  font-family: var(--font-sans);
   599	+  font-size: var(--fs-base);
   600	+  line-height: var(--lh-relaxed);
   601	+  color: var(--text-muted);
   602	 }
   603	 
   604	-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
   605	+.cta__actions {
   606	+  display: flex;
   607	+  flex-wrap: wrap;
   608	+  gap: var(--space-4);
   609	+  justify-content: center;
   610	+}
   611	+
   612	+// ---- Responsive ----
   613	 @media (width <= 900px) {
   614	   .hero__grid {
   615	     grid-template-columns: 1fr;
   616	@@ -610,7 +995,28 @@ usePageSeo({
   617	   }
   618	 
   619	   .grid-3,
   620	-  .grid-2 {
   621	+  .journal {
   622	+    grid-template-columns: 1fr;
   623	+  }
   624	+
   625	+  .block__head--row {
   626	+    flex-direction: column;
   627	+    align-items: flex-start;
   628	+  }
   629	+}
   630	+
   631	+@media (width <= 680px) {
   632	+  .work__row {
   633	+    grid-template-columns: 1fr;
   634	+    gap: var(--space-3);
   635	+  }
   636	+
   637	+  .work__no,
   638	+  .work__go {
   639	+    display: none;
   640	+  }
   641	+
   642	+  .stats {
   643	     grid-template-columns: 1fr;
   644	   }
   645	 }
   646	@@ -619,5 +1025,19 @@ usePageSeo({
   647	   .anim {
   648	     animation: none;
   649	   }
   650	+
   651	+  .work__row,
   652	+  .work__go,
   653	+  .jpost__arrow {
   654	+    transition: none;
   655	+  }
   656	+
   657	+  .work__row--link:hover {
   658	+    padding-left: var(--space-3);
   659	+
   660	+    .work__go {

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/11-4/full.diff | sed -n '187,220p;470,522p;657,686p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   187	@@ -198,15 +299,20 @@ const services: HomeServiceOffer[] = [
   188	   },
   189	 ];
   190	 
   191	-// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   192	+// Projets sélectionnés — source unique `app/data/site.ts` (Story 11.4 / AC-1).
   193	+const projects = SITE.projects;
   194	+
   195	+// Chiffres clés de réassurance (Story 11.4 / AC-2).
   196	 const stats = [
   197	-  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   198	-  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   199	-  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   200	+  { id: "stat-1", value: "11", label: "années d'expérience web" },
   201	+  { id: "stat-2", value: "100%", label: "TypeScript & SaaS de bout en bout" },
   202	+  { id: "stat-3", value: "QA", label: "culture d'automatisation & zéro régression" },
   203	 ];
   204	 
   205	-// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   206	-const projects = SITE.projects;
   207	+// Récupération des 3 derniers articles du journal technique (Story 11.4 / AC-3).
   208	+const { data: articles } = await useAsyncData("home-articles", () =>
   209	+  queryCollection("blog").order("date", "DESC").limit(3).all(),
   210	+);
   211	 
   212	 const siteUrl = useSiteUrl();
   213	 const homeJsonLd = [
   214	@@ -515,37 +621,217 @@ usePageSeo({
   215	   }
   216	 }
   217	 
   218	-// ---- Stats (porté de .statrow / .stat) ----
   219	-.statrow {
   220	+// ---- Section Projets sélectionnés (porté de Home - Awwwards.html .work) ----
   470	+      transform: translate(4px, -4px);
   471	+    }
   472	   }
   473	 }
   474	 
   475	-.project__head {
   476	+.jpost__thumb {
   477	+  width: 100%;
   478	+  height: 160px;
   479	+  object-fit: cover;
   480	+  border-bottom: 1px solid var(--border-subtle);
   481	+}
   482	+
   483	+.jpost__body {
   484	   display: flex;
   485	-  align-items: baseline;
   486	-  justify-content: space-between;
   487	-  gap: var(--space-3);
   488	+  flex: 1;
   489	+  flex-direction: column;
   490	+  padding: var(--space-5);
   491	 }
   492	 
   493	-.project__name {
   494	-  margin: 0;
   495	+.jpost__tags {
   496	+  margin-bottom: var(--space-3);
   497	+}
   498	+
   499	+.jpost__title {
   500	+  margin: 0 0 var(--space-2);
   501	   font-family: var(--font-mono);
   502	-  font-size: var(--fs-xl);
   503	+  font-size: var(--fs-lg);
   504	   font-weight: var(--fw-regular);
   505	+  line-height: var(--lh-snug);
   506	   color: var(--text-strong);
   507	+  transition: color var(--dur-base) var(--ease-standard);
   508	+}
   509	+
   510	+.jpost__desc {
   511	+  margin: 0 0 var(--space-4);
   512	+  font-size: var(--fs-sm);
   513	+  color: var(--text-muted);
   514	 }
   515	 
   516	-.project__role {
   517	+.jpost__meta {
   518	+  display: flex;
   519	+  align-items: center;
   520	+  gap: var(--space-2);
   521	+  margin-top: auto;
   522	+  padding-top: var(--space-4);
   657	+  .work__row--link:hover {
   658	+    padding-left: var(--space-3);
   659	+
   660	+    .work__go {
   661	+      transform: none;
   662	+    }
   663	+  }
   664	 }
   665	 </style>
   666	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
   667	index d8c88fd..e661d81 100644
   668	--- a/docs/implementation-artifacts/sprint-status.yaml
   669	+++ b/docs/implementation-artifacts/sprint-status.yaml
   670	@@ -35,7 +35,7 @@
   671	 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
   672	 
   673	 generated: 2026-06-18
   674	-last_updated: "2026-09-13 (Story 11.3 done : Marquee stack & Vitrine services)"
   675	+last_updated: "2026-09-13 (Story 11.4 ready-for-dev : Preuves SaaS, Journal & CTA final)"
   676	 project: jouan.ovh
   677	 project_key: NOKEY
   678	 tracking_system: file-system
   679	@@ -122,6 +122,6 @@ development_status:
   680	   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
   681	   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   682	   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
   683	-  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
   684	+  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: review
   685	   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: backlog
   686	   epic-11-retrospective: optional

codex
- **[Élevé] Données projets non conformes à l’AC1** — La diff rend directement `SITE.projects` (`full.diff:193`), mais les données affichées restent `keova.app`, `En production` sans `●`, et des tags minuscules sans `Nuxt 4` ni `Stripe Connect` ([site.ts:58](/Users/simon/dev/jouan.ovh/app/data/site.ts:58), [site.ts:62](/Users/simon/dev/jouan.ovh/app/data/site.ts:62), [site.ts:63](/Users/simon/dev/jouan.ovh/app/data/site.ts:63)).

- **[Moyen] Compteurs non affichés en couleur d’accent** — L’AC2 exige `var(--accent)`, mais la règle `.stat b` utilise `var(--text-strong)` ([full.diff:380](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:380)).

- **[Moyen] Action de suivi TryOn absente** — La cartographie prévoit un renvoi vers `/about` ou Malt pour l’étude de cas ; la diff rend tout projet sans URL comme un simple `div`, sans destination interne ([full.diff:23](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:23), [sections-mapping.md:82](/Users/simon/dev/jouan.ovh/docs/specs/spec-home-awwwards/sections-mapping.md:82)).

- **[Moyen] Hiérarchie éditoriale du journal non implémentée** — CAP-7 prévoit une carte vedette et des vignettes secondaires, mais les trois articles sont rendus dans une grille uniforme `repeat(3, 1fr)` avec le même composant `.jpost` ([full.diff:89](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:89), [full.diff:438](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:438)).

- **[Moyen] Valeurs de dimensions codées en dur malgré la contrainte Design System** — La diff ajoute notamment `width="360"`, `height="200"`, `height: 160px`, `padding: clamp(48px, ...)` et plusieurs tailles `rem`, contrairement à la règle tokens-only ([full.diff:97](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:97), [full.diff:478](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:478), [full.diff:566](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:566)).
tokens used
128 613
- **[Élevé] Données projets non conformes à l’AC1** — La diff rend directement `SITE.projects` (`full.diff:193`), mais les données affichées restent `keova.app`, `En production` sans `●`, et des tags minuscules sans `Nuxt 4` ni `Stripe Connect` ([site.ts:58](/Users/simon/dev/jouan.ovh/app/data/site.ts:58), [site.ts:62](/Users/simon/dev/jouan.ovh/app/data/site.ts:62), [site.ts:63](/Users/simon/dev/jouan.ovh/app/data/site.ts:63)).

- **[Moyen] Compteurs non affichés en couleur d’accent** — L’AC2 exige `var(--accent)`, mais la règle `.stat b` utilise `var(--text-strong)` ([full.diff:380](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:380)).

- **[Moyen] Action de suivi TryOn absente** — La cartographie prévoit un renvoi vers `/about` ou Malt pour l’étude de cas ; la diff rend tout projet sans URL comme un simple `div`, sans destination interne ([full.diff:23](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:23), [sections-mapping.md:82](/Users/simon/dev/jouan.ovh/docs/specs/spec-home-awwwards/sections-mapping.md:82)).

- **[Moyen] Hiérarchie éditoriale du journal non implémentée** — CAP-7 prévoit une carte vedette et des vignettes secondaires, mais les trois articles sont rendus dans une grille uniforme `repeat(3, 1fr)` avec le même composant `.jpost` ([full.diff:89](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:89), [full.diff:438](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:438)).

- **[Moyen] Valeurs de dimensions codées en dur malgré la contrainte Design System** — La diff ajoute notamment `width="360"`, `height="200"`, `height: 160px`, `padding: clamp(48px, ...)` et plusieurs tailles `rem`, contrairement à la règle tokens-only ([full.diff:97](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:97), [full.diff:478](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:478), [full.diff:566](/Users/simon/dev/jouan.ovh/docs/implementation-artifacts/code-reviews/11-4/full.diff:566)).

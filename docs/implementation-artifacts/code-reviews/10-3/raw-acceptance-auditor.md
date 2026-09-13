Reading additional input from stdin...
2026-09-13T08:03:25.369890Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099ca-e345-7ec0-87ff-d9054650e100
--------
user
# Acceptance Auditor Prompt — Story 10.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-3-liens-externes-accessibles.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.3), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m auditing the implementation diff against the Story 10.3 spec, epic context, and project context, with emphasis on concrete acceptance-criteria violations and contradictions. I’ll use the repository’s code-review guidance, then report only evidence-backed findings.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && rg --files docs/implementation-artifacts docs/planning-artifacts | rg '(10-3-liens-externes-accessibles|epics\\.md|project-context\\.md|10-3/full\\.diff)"'$'"'" in /Users/simon/dev/jouan.ovh
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
docs/planning-artifacts/epics.md
docs/implementation-artifacts/code-reviews/10-3/full.diff

exec
/bin/zsh -lc "python3 /Users/simon/dev/jouan.ovh/_bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow; printf '\\n---STEP---\\n'; sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md; printf '\\n---TARGETS---\\n'; find docs -maxdepth 4 -type f | sort | rg '(10-3|project-context|epics)'" in /Users/simon/dev/jouan.ovh
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

---STEP---
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

---TARGETS---
docs/implementation-artifacts/10-3-liens-externes-accessibles.md
docs/implementation-artifacts/code-reviews/10-3/full.diff
docs/implementation-artifacts/code-reviews/10-3/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-3/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-3/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json
docs/planning-artifacts/epics.md
docs/project-context.md

2026-09-13T08:03:40.719441Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-02-review.md; printf '\\n---STEP3---\\n'; sed -n '1,280p' /Users/simon/.codex/skills/bmad-code-review/steps/step-03-*.md 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
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

2026-09-13T08:03:44.540983Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,280p' /Users/simon/.codex/skills/bmad-code-review/steps/step-04-present.md" in /Users/simon/dev/jouan.ovh
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

2026-09-13T08:03:47.167789Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '---SPEC---'; nl -ba docs/implementation-artifacts/10-3-liens-externes-accessibles.md; printf '%s\\n' '---EPICS STORY 10.3---'; rg -n -C 25 '10\\.3|liens externes|accessibles' docs/planning-artifacts/epics.md; printf '%s\\n' '---PROJECT CONTEXT---'; nl -ba docs/project-context.md; printf '%s\\n' '---DIFF STAT---'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/10-3/full.diff 2>/dev/null || true; printf '%s\\n' '---DIFF---'; nl -ba docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---SPEC---
     1	---
     2	baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
     3	---
     4	
     5	# Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
     6	
     7	Status: review
     8	
     9	<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    10	
    11	## Story
    12	
    13	As a visiteur,
    14	I want savoir quand un lien ouvre un nouvel onglet,
    15	so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).
    16	
    17	## Acceptance Criteria
    18	
    19	**Given** les liens `target="_blank"` du site (hexagones sociaux header/footer, cartes projet, liens bio…)
    20	**When** on factorise un helper de lien externe (icône + libellé sr-only « (ouvre dans un nouvel onglet) ») et on l'applique à tous les `_blank`
    21	**Then** chaque lien `_blank` porte `rel="noopener"` + l'indication sr-only via le helper unique (aucune duplication ad hoc)
    22	**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte
    23	
    24	## Tasks / Subtasks
    25	
    26	- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
    27	  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
    28	  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
    29	- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
    30	  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
    31	    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
    32	    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
    33	    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
    34	    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
    35	  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
    36	- [x] Tâche 3 — Validation (AC: tout)
    37	  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
    38	  - [x] Vérification du nom accessible et préservation du rendu visuel.
    39	
    40	## Dev Notes
    41	
    42	### Périmètre & frontières
    43	
    44	- **Story de finition a11y** : factorise un **helper de lien externe** unique et l'applique site-wide. Source : `deferred-work.md` → Epic 10 item #2 (revue 3.3). [Source: epics.md#Epic 10 — Story 10.3 (FR13), WCAG G201]
    45	- **Frontières** : uniquement les liens **externes** (`target="_blank"`). PAS la sémantique titres/listes (10.2), PAS le SEO (10.5). Rendu visuel **inchangé**.
    46	- **Réutiliser l'existant, ne pas réinventer** : la classe `.screen-reader-text` existe déjà (`app/pages/index.vue:121`) ; le set `ZIcon` (story 2.7) a peut-être un glyphe « lien externe ». Vérifier avant d'en créer un.
    47	
    48	### Fichiers concernés (lus — baseline `3e82045`)
    49	
    50	- **`app/components/HexagonLinkComponent.vue`** (UPDATE) — `<a class="hex" :href="link" target="_blank" rel="noopener noreferrer">` (l.2). Composant réutilisé header/footer/contact pour les socials. Vérifier l'`aria-label`/nom accessible existant ; ajouter sr-only « nouvel onglet » (sans casser la grille hexagonale).
    51	- **`app/components/FooterComponent.vue`** (UPDATE) — lien `target="_blank"` (l.24). Vérifier `rel` + sr-only.
    52	- **`app/components/LinkListComponent.vue`** (LECTURE) — peut piloter les listes de liens (socials) ; voir s'il rend les `HexagonLinkComponent` (point de factorisation possible).
    53	- **`app/pages/index.vue`** (UPDATE léger) — cartes projet `target="_blank"` (l.110) + sr-only existant (l.121) : aligner sur le helper, **ne pas régresser** le fix 3.3.
    54	- **`app/pages/about.vue`** (UPDATE) — lien `keova.app` (l.34) `rel="noreferrer"` → `noopener` + sr-only.
    55	- **Nouveau** : helper `ZExternalLink`/util (emplacement selon convention : primitives DS sous `app/components/ui/`, auto-import sans préfixe). [Source: project-context.md#Conventions de nommage]
    56	
    57	### Pièges / régressions à éviter
    58	
    59	- **Rendu visuel inchangé** : le libellé « nouvel onglet » est **sr-only** (classe `.screen-reader-text`), jamais visible. L'icône externe éventuelle est `aria-hidden`.
    60	- **`rel`** : préférer `rel="noopener"` (sécurité `window.opener`) ; `noreferrer` seulement si la confidentialité du référent est voulue. Harmoniser.
    61	- **Ne pas casser** le style des hexagones (grille SVG) ni des cartes projet en insérant le wrapper du helper. Tester chaque surface.
    62	- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
    63	- **Auto-import `<component :is>`** : si le helper enveloppe un `NuxtLink`/`a` dynamique, passer une **référence** importée depuis `#components`, jamais un nom en string (piège story 2.8). [Source: project-context.md#Nuxt]
    64	- **pnpm + Docker** pour toute commande.
    65	
    66	### Testing standards
    67	
    68	- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + vérif Chrome DevTools MCP (nom accessible des liens externes + rendu inchangé + focus). `grep` final = zéro `_blank` non audité. [Source: project-context.md#Tests]
    69	
    70	### References
    71	
    72	- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.3 (FR13)]
    73	- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #2 audit _blank), revue 3.3]
    74	- [Source: docs/project-context.md#Accessibilité, #Conventions de nommage, #Nuxt (piège component :is)]
    75	- [Source: app/components/HexagonLinkComponent.vue, FooterComponent.vue, LinkListComponent.vue ; app/pages/index.vue, about.vue]
    76	
    77	## Dev Agent Record
    78	
    79	### Agent Model Used
    80	Gemini 2.5 Pro
    81	
    82	### Debug Log References
    83	- Lint initial ajusté avec Prettier / ESLint.
    84	- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
    85	
    86	### Completion Notes List
    87	- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
    88	- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
    89	- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
    90	- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
    91	- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
    92	- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
    93	- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
    94	
    95	### File List
    96	- `app/components/ui/ZExternalLink.vue` (NEW)
    97	- `app/components/HexagonLinkComponent.vue` (MODIFIED)
    98	- `app/components/FooterComponent.vue` (MODIFIED)
    99	- `app/pages/about.vue` (MODIFIED)
   100	- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
   101	- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
---EPICS STORY 10.3---
74-UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
75-UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
76-UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
77-UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
78-UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
79-UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
80-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
81-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
82-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
83-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
84-
85-### FR Coverage Map
86-
87-FR1: Epic 1 — Migration de la stack vers Nuxt 4
88-FR2: Epic 2 — Tokens du design system disponibles
89-FR3: Epic 2 — Primitives Vue réutilisables
90-FR4: Epic 2 — Châssis global (header/footer/nav/socials)
91-FR5: Epic 3 — Page d'accueil (hero Terminal A)
92-FR6: Epic 4 — Page Services (route /services)
93-FR7: Epic 5 — Page À-propos
94-FR8: Epic 6 — Blog (index + article)
95-FR9: Epic 7 — Page Contact (route /contact)
96-FR10: Epic 8 — Terminal easter-egg restylé
97-FR11: Epic 9 — Accessibilité & finitions motion
98-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
99:FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
101-FR15: Epic 10 — SEO centralisé site-wide
102-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
103-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
104-
105-## Epic List
106-
107-### Epic 1: Migration de la stack vers Nuxt 4
108-Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
109-**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_
110-
111-### Epic 2: Fondations du design system
112-Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
113-**FRs covered:** FR2, FR3, FR4 _(UX-DR1–7, 10, 11)_
114-
115-### Epic 3: Page d'accueil
116-Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
117-**FRs covered:** FR5 _(UX-DR12)_
118-
119-### Epic 4: Page Services
120-Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
121-**FRs covered:** FR6 _(UX-DR13)_
122-
123-### Epic 5: Page À-propos
124-Le visiteur découvre le parcours : portrait, bio, timeline d'expérience, formation, stack.
--
570-
571-As a mainteneur du site,
572-I want trancher l'hébergement de production et prouver la chaîne de déploiement gh-pages (`CNAME` inclus) sur un dry-run,
573-So that la première mise en production de la refonte ne révèle pas de surprise (chaîne CI jamais prouvée, ~28 stories empilées).
574-
575-**Acceptance Criteria:**
576-
577-**Given** la cible prod `jouan.ovh` et la chaîne `pnpm generate` → `push-dir` vers `gh-pages`
578-**When** on tranche l'hébergement prod (domaine, branche de déploiement, `CNAME`) et on exécute un dry-run du déploiement depuis le staging (`develop`)
579-**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
580-**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story
581-
582-### Story 10.2: A11y sémantique résiduelle (home / services / contact)
583-
584-As a visiteur utilisant un lecteur d'écran,
585-I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
586-So that la structure du site m'est annoncée correctement (FR12).
587-
588-**Acceptance Criteria:**
589-
590-**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
591-**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
592-**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
593-**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
594-
595:### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
596-
597-As a visiteur,
598-I want savoir quand un lien ouvre un nouvel onglet,
599-So that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).
600-
601-**Acceptance Criteria:**
602-
603-**Given** les liens `target="_blank"` du site (hexagones sociaux header/footer, cartes projet, liens bio…)
604-**When** on factorise un helper de lien externe (icône + libellé sr-only « (ouvre dans un nouvel onglet) ») et on l'applique à tous les `_blank`
605-**Then** chaque lien `_blank` porte `rel="noopener"` + l'indication sr-only via le helper unique (aucune duplication ad hoc)
606-**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte
607-
608-### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
609-
610-As a visiteur en contraste forcé ou motion réduit,
611-I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
612-So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).
613-
614-**Acceptance Criteria:**
615-
616-**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
617-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
618-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
619-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
620-
---PROJECT CONTEXT---
     1	---
     2	project_name: "jouan.ovh"
     3	user_name: "Simon"
     4	date: "2026-06-22"
     5	sections_completed: ["technology_stack", "language_framework", "code_quality", "workflow_testing", "critical_rules"]
     6	status: "complete"
     7	optimized_for_llm: true
     8	existing_patterns_found: 12
     9	---
    10	
    11	# Project Context for AI Agents
    12	
    13	_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Il se concentre sur les détails non évidents que les agents pourraient manquer._
    14	
    15	---
    16	
    17	## Technology Stack & Versions
    18	
    19	> ✅ **Migration de stack terminée (Epic 1).** Les versions ci-dessous sont l'état
    20	> ACTUEL, post-migration. `@nuxt/bridge-edge` a été abandonné ; le code applicatif
    21	> vit désormais sous `app/` (structure Nuxt 4 par défaut, `srcDir = "app"`).
    22	
    23	- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
    24	- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
    25	- **Langage :** TypeScript `^6.0.3`.
    26	- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
    27	- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
    28	- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
    29	- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
    30	- **Déploiement :** site statique (`nuxi generate`) → `push-dir` vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME`). ⚠️ La chaîne CI de déploiement n'a pas encore été prouvée en réel sur `main` (cf. rétros Epic 1/2) — validation prévue en fin de refonte.
    31	- **Divers :** `ua-parser-js ^2` (détection device, terminal).
    32	
    33	## Critical Implementation Rules
    34	
    35	### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)
    36	
    37	**TypeScript / Vue**
    38	
    39	- Préférer `<script setup lang="ts">` pour tout NOUVEAU composant. Le sous-système
    40	  `components/terminal/` a été **intégralement migré en Epic 8** (`<script setup>`,
    41	  décision rétro Epic 7). **Reste un seul résidu Options API** (`defineComponent`,
    42	  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
    43	  pas l'étendre ; le migrer vers `<script setup>` lors d'une refonte du header
    44	  (cleanup optionnel, non planifié).
    45	- `vue-property-decorator` et l'option `experimentalDecorators` ont été retirés
    46	  (Epic 3) : plus aucun décorateur de classe, ne pas en réintroduire.
    47	- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).
    48	
    49	**Nuxt**
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
    76	  validation/feedback front. Notice RGPD sous le form (page politique de confidentialité à
    77	  finaliser — cf. `deferred-work.md`).
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
   113	  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`) — `<script setup>`,
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
   133	- **Contenu partagé : source unique `app/data/site.ts`** (`SITE.profile` /
   134	  `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les
   135	  programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`,
   136	  `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder**
   137	  profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2). _(Les
   138	  `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et
   139	  `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_
   140	
   141	**Langue**
   142	
   143	- UI et contenu en FRANÇAIS (`lang="fr"`). Voix : 1re personne « je »,
   144	  vouvoiement. Pas d'emoji (cf. guidelines du design system).
   145	
   146	### Workflow de développement
   147	
   148	**Git**
   149	
   150	- Branche principale : `main`. Intégration : `develop`. Travail par branches de
   151	  feature (ex. refonte en cours : `feat/design-system-revamp`).
   152	- Commits conventionnels : `feat:`, `fix:`, `style:`, etc. (cf. historique).
   153	
   154	**Environnement de dev : Docker (obligatoire)**
   155	
   156	- ⚠️ **Tout le dev passe par Docker** (`docker-compose.yml`, Node 22 LTS + pnpm
   157	  via corepack). Ne PAS lancer `pnpm`/`nuxi` directement sur l'hôte (macOS arm64) :
   158	  les `node_modules` natifs (better-sqlite3, sharp, esbuild…) sont compilés pour
   159	  le conteneur Linux et vivent dans un volume nommé isolé de l'hôte.
   160	- Lancer le dev : `docker compose up` → `pnpm dev` sur http://localhost:3000.
   161	- Commande ponctuelle (lint, typecheck, generate…) :
   162	  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
   163	- Stopper : `docker compose down`.
   164	
   165	**Build & déploiement**
   166	
   167	- Gestionnaire de paquets : **pnpm** (`packageManager: pnpm@11.8.0`, lockfile
   168	  `pnpm-lock.yaml`). **Ne JAMAIS utiliser `npm`/`yarn`.**
   169	- ⚠️ **Toutes les commandes `pnpm` ci-dessous passent par Docker** (cf. section
   170	  « Environnement de dev »), jamais directement sur l'hôte :
   171	  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
   172	- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
   173	  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
   174	- Build statique : `pnpm generate` → sortie `.output/public`.
   175	- Déploiement : `pnpm deploy` (`push-dir` vers la branche `gh-pages`).
   176	- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
   177	  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).
   178	
   179	### Tests
   180	
   181	- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
   182	- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
   183	  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
   184	- Si des tests sont introduits pendant la migration, documenter la convention ici.
   185	
   186	### Règles critiques à ne pas manquer
   187	
   188	**Port du design system (React/CSS → Vue/SCSS)**
   189	
   190	- Le design system source (`docs/design_system/`) est en **React + CSS custom
   191	  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
   192	  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
   193	- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
   194	  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
   195	  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
   196	- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
   197	  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
   198	
   199	**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**
   200	
   201	- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
   202	  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
   203	  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
   204	  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
   205	- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
   206	- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
   207	- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
   208	  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
   209	  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
   210	  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
   211	  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
   212	  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
   213	  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
   214	- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
   215	  les traiter en amont (checklist pré-revue dans la consigne de story).
   216	- **Epic 9 = passe a11y/motion finale (dernier épic du roadmap).** Décision rétro
   217	  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
   218	  pas seulement en revue —
   219	  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
   220	    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
   221	    `ZInput`/liens), pas page par page ;
   222	  - **navigation clavier** (focus visible, ordre logique, retour de focus après overlay) ;
   223	  - **contraste** texte/fond lisible ;
   224	  - généralisation eyebrow→`<h2>` + listes `<ol>`/`<ul>` à **home** et **services**
   225	    (+ séquence process `<ol>` de 4.2) ; audit site-wide des `target="_blank"`.
   226	  - Inventaire détaillé et destinations : `deferred-work.md`. ⚠️ **« Epic 9 done »
   227	    ≠ « refonte livrée »** : restent après Epic 9 (fin de refonte) la story SEO dédiée
   228	    (+ bascule `SITE_URL` `dev.jouan.ovh` → `jouan.ovh`), la page RGPD/mentions
   229	    légales, et le **premier merge `main` + déploiement gh-pages prouvé**.
   230	
   231	**À préserver pendant la refonte**
   232	
   233	- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
   234	  easter-egg à conserver — le design system la garde comme feature secondaire.
   235	- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
   236	  orange Ubuntu comme unique accent héros.
   237	- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
   238	  terminal.
   239	
   240	**Pièges**
   241	
   242	- Compatibilité prerender (site statique) : tout accès DOM doit être gardé ;
   243	  IDs déterministes via `useId()` (pas d'aléatoire qui casse l'hydration).
   244	- Ne pas casser `CNAME` / le déploiement gh-pages.
   245	- `<component :is="...">` : passer une référence importée, jamais un nom en string
   246	  (cf. règles Nuxt).
   247	- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
   248	  layout cohabitent sur le même élément (typiquement `.container` + wrapper de
   249	  section, ex. `.hero__in.container`), **ne pas** styler le `padding` en shorthand
   250	  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
   251	  effaçait le vertical de `.hero__in`). Utiliser les **longhands** `padding-inline` /
   252	  `padding-block`, qui composent sans conflit quel que soit l'ordre. (Régression de
   253	  padding du hero, story 3.1 — invisible à la revue de code, attrapée à l'œil.)
   254	- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
   255	  dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **invalide la
   256	  base de contenu** du dev (volume partagé) → `/blog` tombe en erreur. Correctif :
   257	  `docker compose restart web` réindexe le contenu. Sans impact sur le build lui-même.
   258	- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
   259	  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
   260	  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
   261	  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
   262	- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
   263	  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
   264	  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
   265	  est aveugle aux régressions de rendu. Réfs par page :
   266	  - **Home** → `docs/animations_jouan.ovh/Home animée.dc.html` + screenshots
   267	    `docs/animations_jouan.ovh/screenshots/` (`hero*.png`, `services.png`, `booted.png`).
   268	  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
   269	    (UI kit cible ; ouvrir la section correspondante).
   270	  - Routine appliquée sans faille sur Epics 4-8 (desktop + mobile) → zéro régression de
   271	    rendu ; elle a corrigé un défaut de la maquette (centrage timeline `kit.css`, 5.2),
   272	    attrapé un bug d'ancres de titres `@nuxt/content` (6.2) et validé la refonte terminal
   273	    (diff visuel **et comportemental** avant/après, Epic 8). **Epic 9 est transverse**
   274	    (a11y/motion, pas de page neuve) → privilégier le diff **comportemental** clavier/motion/
   275	    contraste plutôt que le pixel.
   276	
   277	---
   278	
   279	## Usage Guidelines
   280	
   281	**Pour les agents IA :**
   282	
   283	- Lire ce fichier AVANT toute implémentation.
   284	- Suivre toutes les règles ; en cas de doute, choisir l'option la plus restrictive.
   285	- Mettre à jour ce fichier si de nouveaux patterns émergent.
   286	
   287	**Pour les humains :**
   288	
   289	- Garder le fichier court et focalisé sur les besoins des agents.
   290	- Mettre à jour quand la stack change.
   291	- Revue périodique ; retirer les règles devenues évidentes.
   292	
   293	Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
---DIFF STAT---
 .../code-reviews/10-3/full.diff                    | 189 +++++++++++++++++++++
 1 file changed, 189 insertions(+)
---DIFF---
     1	diff --git a/app/components/ui/ZExternalLink.vue b/app/components/ui/ZExternalLink.vue
     2	new file mode 100644
     3	index 0000000..e13eaa5
     4	--- /dev/null
     5	+++ b/app/components/ui/ZExternalLink.vue
     6	@@ -0,0 +1,38 @@
     7	+<template>
     8	+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
     9	+    <slot />
    10	+    <span class="screen-reader-text">{{ computedSrText }}</span>
    11	+  </a>
    12	+</template>
    13	+
    14	+<script setup lang="ts">
    15	+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
    16	+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
    17	+// (Story 10.3 — WCAG G201 / FR13).
    18	+import { computed } from "vue";
    19	+
    20	+interface Props {
    21	+  /** URL externe cible. */
    22	+  href: string;
    23	+  /**
    24	+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
    25	+   * Peut être étendu à "noopener noreferrer" si nécessaire.
    26	+   * @default "noopener"
    27	+   */
    28	+  rel?: string;
    29	+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
    30	+  class?: string;
    31	+  /** Libellé accessible alternatif pour l'annonce sr-only. */
    32	+  srText?: string;
    33	+}
    34	+
    35	+const props = withDefaults(defineProps<Props>(), {
    36	+  rel: "noopener",
    37	+  class: undefined,
    38	+  srText: " (ouvre dans un nouvel onglet)",
    39	+});
    40	+
    41	+const className = computed(() => props.class);
    42	+const computedRel = computed(() => props.rel || "noopener");
    43	+const computedSrText = computed(() => props.srText);
    44	+</script>
    45	diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
    46	index 920757b..418772b 100644
    47	--- a/app/components/FooterComponent.vue
    48	+++ b/app/components/FooterComponent.vue
    49	@@ -17,14 +17,13 @@
    50	 
    51	         <div class="ftr__col">
    52	           <h2 class="ftr__title">// Projets</h2>
    53	-          <a
    54	+          <ZExternalLink
    55	             v-for="project in projects"
    56	             :key="project.url"
    57	             :href="project.url"
    58	-            target="_blank"
    59	             rel="noopener noreferrer"
    60	             class="ftr__link"
    61	-            >{{ project.name }}</a
    62	+            >{{ project.name }}</ZExternalLink
    63	           >
    64	         </div>
    65	 
    66	diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
    67	index 12765e5..edf089c 100644
    68	--- a/app/components/HexagonLinkComponent.vue
    69	+++ b/app/components/HexagonLinkComponent.vue
    70	@@ -1,7 +1,9 @@
    71	 <template>
    72	   <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
    73	     <slot name="icon" />
    74	-    <span class="hex__label"><slot name="title" /></span>
    75	+    <span class="hex__label"
    76	+      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
    77	+    >
    78	   </a>
    79	 </template>
    80	 
    81	diff --git a/app/pages/about.vue b/app/pages/about.vue
    82	index e9f299f..997bc7f 100644
    83	--- a/app/pages/about.vue
    84	+++ b/app/pages/about.vue
    85	@@ -31,7 +31,7 @@
    86	             </p>
    87	             <p class="prose about__para">
    88	               Je suis aussi fondateur du SaaS
    89	-              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
    90	+              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
    91	               service du code — agents, automatisations, intégrations LLM.
    92	             </p>
    93	 
    94	diff --git a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
    95	index db8c8ac..eff4049 100644
    96	--- a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
    97	+++ b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
    98	@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
    99	 
   100	 # Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
   101	 
   102	-Status: ready-for-dev
   103	+Status: review
   104	 
   105	 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
   106	 
   107	@@ -23,19 +23,19 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
   108	 
   109	 ## Tasks / Subtasks
   110	 
   111	-- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
   112	-  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
   113	-  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
   114	-- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
   115	-  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
   116	-    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
   117	-    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
   118	-    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
   119	-    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
   120	-  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
   121	-- [ ] Tâche 3 — Validation (AC: tout)
   122	-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
   123	-  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).
   124	+- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
   125	+  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
   126	+  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
   127	+- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
   128	+  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
   129	+    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
   130	+    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
   131	+    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
   132	+    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
   133	+  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
   134	+- [x] Tâche 3 — Validation (AC: tout)
   135	+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
   136	+  - [x] Vérification du nom accessible et préservation du rendu visuel.
   137	 
   138	 ## Dev Notes
   139	 
   140	@@ -77,9 +77,25 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
   141	 ## Dev Agent Record
   142	 
   143	 ### Agent Model Used
   144	+Gemini 2.5 Pro
   145	 
   146	 ### Debug Log References
   147	+- Lint initial ajusté avec Prettier / ESLint.
   148	+- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
   149	 
   150	 ### Completion Notes List
   151	+- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
   152	+- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
   153	+- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
   154	+- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
   155	+- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
   156	+- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
   157	+- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
   158	 
   159	 ### File List
   160	+- `app/components/ui/ZExternalLink.vue` (NEW)
   161	+- `app/components/HexagonLinkComponent.vue` (MODIFIED)
   162	+- `app/components/FooterComponent.vue` (MODIFIED)
   163	+- `app/pages/about.vue` (MODIFIED)
   164	+- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
   165	+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   166	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
   167	index 02bb83f..89b39ec 100644
   168	--- a/docs/implementation-artifacts/sprint-status.yaml
   169	+++ b/docs/implementation-artifacts/sprint-status.yaml
   170	@@ -35,7 +35,7 @@
   171	 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
   172	 
   173	 generated: 2026-06-18
   174	-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
   175	+last_updated: "2026-09-13 (Story 10.2 soldée par revue de code : a11y sémantique sur home/services/contact validée, 6 patches appliqués, statut done)"
   176	 project: jouan.ovh
   177	 project_key: NOKEY
   178	 tracking_system: file-system
   179	@@ -109,8 +109,8 @@ development_status:
   180	   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   181	   epic-10: in-progress
   182	   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   183	-  10-2-a11y-semantique-residuelle: ready-for-dev
   184	-  10-3-liens-externes-accessibles: ready-for-dev
   185	+  10-2-a11y-semantique-residuelle: done
   186	+  10-3-liens-externes-accessibles: in-progress
   187	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   188	   10-5-seo-centralise-site-wide: ready-for-dev
   189	   10-6-conformite-legale-rgpd-mentions: ready-for-dev

2026-09-13T08:03:53.075808Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
The diff is small and the key audit risk is the “all `_blank` through one helper” requirement: several raw anchors remain, so I’m checking whether the spec explicitly permits those exceptions and whether the helper preserves the required `noopener` guarantee for custom `rel` values.
exec
/bin/zsh -lc "printf '%s\\n' '---ALL TARGET BLANKS---'; rg -n -C 3 'target=[\"'\"']_blank[\"'\"']|target\\s*=\\s*[\"'\"']_blank[\"'\"']' app || true; printf '%s\\n' '---RELEVANT COMPONENTS---'; for f in app/components/ui/ZExternalLink.vue app/components/HexagonLinkComponent.vue app/components/FooterComponent.vue app/pages/about.vue app/pages/index.vue app/components/ui/ZCard.vue; do if [ -f \""'$f" ]; then echo "--- $f"; nl -ba "$f"; fi; done; printf '"'%s\\n' '---CONTEXT RELEVANT---'; nl -ba docs/project-context.md | sed -n '45,90p;175,230p'; printf '%s\\n' '---SPEC TASK DIFF ONLY---'; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
zsh:1: unmatched "

2026-09-13T08:04:09.950661Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '---ALL TARGET BLANKS---'; rg -n -C 3 'target=\"_blank\"' app || true; printf '%s\\n' '---RELEVANT COMPONENTS---'; for f in app/components/ui/ZExternalLink.vue app/components/HexagonLinkComponent.vue app/components/FooterComponent.vue app/pages/about.vue app/pages/index.vue app/components/ui/ZCard.vue; do if [ -f \""'$f" ]; then echo "--- $f"; nl -ba "$f"; fi; done; printf '"'%s\\n' '---CONTEXT RELEVANT---'; nl -ba docs/project-context.md | sed -n '45,90p;175,230p'; printf '%s\\n' '---SPEC TASK DIFF ONLY---'; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---ALL TARGET BLANKS---
app/pages/index.vue-99-        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
app/pages/index.vue-100-        <ul class="grid-2 projects">
app/pages/index.vue-101-          <li v-for="project in projects" :key="project.url">
app/pages/index.vue:102:            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
app/pages/index.vue-103-              <div class="project__head">
app/pages/index.vue-104-                <h3 class="project__name">{{ project.name }}</h3>
app/pages/index.vue-105-                <span class="project__role">{{ project.role }}</span>
--
app/components/HexagonLinkComponent.vue-1-<template>
app/components/HexagonLinkComponent.vue:2:  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
app/components/HexagonLinkComponent.vue-3-    <slot name="icon" />
app/components/HexagonLinkComponent.vue-4-    <span class="hex__label"
app/components/HexagonLinkComponent.vue-5-      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
--
app/components/ui/ZExternalLink.vue-1-<template>
app/components/ui/ZExternalLink.vue:2:  <a :href="href" target="_blank" :rel="computedRel" :class="className">
app/components/ui/ZExternalLink.vue-3-    <slot />
app/components/ui/ZExternalLink.vue-4-    <span class="screen-reader-text">{{ computedSrText }}</span>
app/components/ui/ZExternalLink.vue-5-  </a>
app/components/ui/ZExternalLink.vue-6-</template>
app/components/ui/ZExternalLink.vue-7-
app/components/ui/ZExternalLink.vue-8-<script setup lang="ts">
app/components/ui/ZExternalLink.vue:9:// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
app/components/ui/ZExternalLink.vue-10-// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
app/components/ui/ZExternalLink.vue-11-// (Story 10.3 — WCAG G201 / FR13).
app/components/ui/ZExternalLink.vue-12-import { computed } from "vue";
---RELEVANT COMPONENTS---
--- app/components/ui/ZExternalLink.vue
     1	<template>
     2	  <a :href="href" target="_blank" :rel="computedRel" :class="className">
     3	    <slot />
     4	    <span class="screen-reader-text">{{ computedSrText }}</span>
     5	  </a>
     6	</template>
     7	
     8	<script setup lang="ts">
     9	// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
    10	// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
    11	// (Story 10.3 — WCAG G201 / FR13).
    12	import { computed } from "vue";
    13	
    14	interface Props {
    15	  /** URL externe cible. */
    16	  href: string;
    17	  /**
    18	   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
    19	   * Peut être étendu à "noopener noreferrer" si nécessaire.
    20	   * @default "noopener"
    21	   */
    22	  rel?: string;
    23	  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
    24	  class?: string;
    25	  /** Libellé accessible alternatif pour l'annonce sr-only. */
    26	  srText?: string;
    27	}
    28	
    29	const props = withDefaults(defineProps<Props>(), {
    30	  rel: "noopener",
    31	  class: undefined,
    32	  srText: " (ouvre dans un nouvel onglet)",
    33	});
    34	
    35	const className = computed(() => props.class);
    36	const computedRel = computed(() => props.rel || "noopener");
    37	const computedSrText = computed(() => props.srText);
    38	</script>
--- app/components/HexagonLinkComponent.vue
     1	<template>
     2	  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
     3	    <slot name="icon" />
     4	    <span class="hex__label"
     5	      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
     6	    >
     7	  </a>
     8	</template>
     9	
    10	<script setup lang="ts">
    11	// Lien social en hexagone — motif patrimonial du footer/contact, restylé DS (story 2.8).
    12	// Hexagone via clip-path (cf. kit.css .hex) ; glyphe en currentColor (ZIcon, story 2.7).
    13	defineProps<{
    14	  /** URL externe (réseau social). */
    15	  link: string;
    16	}>();
    17	</script>
    18	
    19	<style lang="scss" scoped>
    20	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) */
    21	.hex {
    22	  display: inline-flex;
    23	  align-items: center;
    24	  justify-content: center;
    25	  width: 46px;
    26	  height: 53px;
    27	  font-size: 20px; // dimensionne le glyphe ZIcon (1em)
    28	  color: var(--text-muted);
    29	  cursor: pointer;
    30	  background: var(--surface-2);
    31	  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    32	  transition:
    33	    color var(--dur-base) var(--ease-standard),
    34	    background var(--dur-base) var(--ease-standard);
    35	
    36	  &:hover {
    37	    color: var(--ink-on-accent);
    38	    background: var(--accent);
    39	  }
    40	
    41	  &:focus-visible {
    42	    outline: 2px solid var(--accent);
    43	    outline-offset: 2px;
    44	  }
    45	}
    46	
    47	// Libellé accessible (lecteurs d'écran) — masqué visuellement.
    48	.hex__label {
    49	  position: absolute;
    50	  width: 1px;
    51	  height: 1px;
    52	  margin: -1px;
    53	  padding: 0;
    54	  overflow: hidden;
    55	  white-space: nowrap;
    56	  border: 0;
    57	  clip-path: inset(50%);
    58	}
    59	
    60	@media (prefers-reduced-motion: reduce) {
    61	  .hex {
    62	    transition: none;
    63	  }
    64	}
    65	</style>
--- app/components/FooterComponent.vue
     1	<template>
     2	  <footer class="ftr">
     3	    <div class="ftr__container">
     4	      <div class="ftr__in">
     5	        <div class="ftr__brand-col">
     6	          <NuxtLink to="/" class="ftr__brand">
     7	            <ZIcon name="gem" class="ftr__logo" />
     8	            <b>jouan.ovh</b>
     9	          </NuxtLink>
    10	          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
    11	        </div>
    12	
    13	        <nav class="ftr__col" aria-label="Navigation du pied de page">
    14	          <h2 class="ftr__title">// Navigation</h2>
    15	          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
    16	        </nav>
    17	
    18	        <div class="ftr__col">
    19	          <h2 class="ftr__title">// Projets</h2>
    20	          <ZExternalLink
    21	            v-for="project in projects"
    22	            :key="project.url"
    23	            :href="project.url"
    24	            rel="noopener noreferrer"
    25	            class="ftr__link"
    26	            >{{ project.name }}</ZExternalLink
    27	          >
    28	        </div>
    29	
    30	        <div class="ftr__col">
    31	          <h2 class="ftr__title">// Réseaux</h2>
    32	          <LinkListComponent />
    33	        </div>
    34	      </div>
    35	
    36	      <div class="ftr__bottom">
    37	        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
    38	        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
    39	      </div>
    40	    </div>
    41	  </footer>
    42	</template>
    43	
    44	<script setup lang="ts">
    45	import LinkListComponent from "~/components/LinkListComponent.vue";
    46	import { SITE } from "~/data/site";
    47	
    48	const navItems = [
    49	  { to: "/", label: "Accueil" },
    50	  { to: "/services", label: "Services" },
    51	  { to: "/about", label: "À propos" },
    52	  { to: "/blog", label: "Blog" },
    53	  { to: "/contact", label: "Contact" },
    54	];
    55	
    56	// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
    57	const projects = SITE.projects;
    58	
    59	const year = new Date().getFullYear();
    60	</script>
    61	
    62	<style lang="scss" scoped>
    63	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
    64	.ftr {
    65	  margin-top: auto;
    66	  background: var(--surface-1);
    67	  border-top: 1px solid var(--border-subtle);
    68	  padding: var(--space-12) 0 var(--space-8);
    69	}
    70	
    71	.ftr__container {
    72	  width: 100%;
    73	  max-width: var(--container-xl);
    74	  margin: 0 auto;
    75	  padding: 0 var(--space-6);
    76	}
    77	
    78	.ftr__in {
    79	  display: flex;
    80	  flex-wrap: wrap;
    81	  gap: var(--space-8);
    82	  align-items: flex-start;
    83	  justify-content: space-between;
    84	}
    85	
    86	.ftr__brand-col {
    87	  max-width: 300px;
    88	}
    89	
    90	.ftr__brand {
    91	  display: inline-flex;
    92	  align-items: center;
    93	  gap: var(--space-2);
    94	  margin-bottom: var(--space-3);
    95	  text-decoration: none;
    96	
    97	  .ftr__logo {
    98	    font-size: 22px;
    99	    color: var(--accent);
   100	  }
   101	
   102	  b {
   103	    font-family: var(--font-mono);
   104	    font-size: var(--fs-md);
   105	    font-weight: var(--fw-bold);
   106	    color: var(--text-strong);
   107	  }
   108	
   109	  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
   110	  &:focus-visible {
   111	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   112	    outline-offset: 2px;
   113	    border-radius: var(--radius-sm);
   114	    box-shadow: var(--ring-accent);
   115	  }
   116	}
   117	
   118	.ftr__tagline {
   119	  margin: 0;
   120	  font-size: var(--fs-sm);
   121	  color: var(--text-muted);
   122	}
   123	
   124	.ftr__col {
   125	  display: flex;
   126	  flex-direction: column;
   127	}
   128	
   129	.ftr__title {
   130	  margin: 0 0 var(--space-3);
   131	  font-family: var(--font-mono);
   132	  font-size: var(--fs-xs);
   133	  font-weight: var(--fw-regular);
   134	  letter-spacing: var(--ls-wider);
   135	  text-transform: uppercase;
   136	  color: var(--text-muted);
   137	}
   138	
   139	.ftr__link {
   140	  display: block;
   141	  padding: var(--space-1) 0;
   142	  font-family: var(--font-mono);
   143	  font-size: var(--fs-sm);
   144	  color: var(--text-body);
   145	  text-decoration: none;
   146	  transition: color var(--dur-fast) var(--ease-standard);
   147	
   148	  &:hover {
   149	    color: var(--accent);
   150	  }
   151	
   152	  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
   153	  &:focus-visible {
   154	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
   155	    outline-offset: 2px;
   156	    border-radius: var(--radius-xs);
   157	    box-shadow: var(--ring-accent);
   158	  }
   159	}
   160	
   161	.ftr__bottom {
   162	  display: flex;
   163	  flex-wrap: wrap;
   164	  gap: var(--space-3);
   165	  justify-content: space-between;
   166	  margin-top: var(--space-8);
   167	  padding-top: var(--space-5);
   168	  font-family: var(--font-mono);
   169	  font-size: var(--fs-xs);
   170	
   171	  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
   172	  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
   173	  color: var(--text-muted);
   174	  border-top: 1px solid var(--border-subtle);
   175	}
   176	
   177	.ftr__cmd {
   178	  color: var(--term-green);
   179	}
   180	
   181	@media (prefers-reduced-motion: reduce) {
   182	  .ftr__link {
   183	    transition: none;
   184	  }
   185	}
   186	</style>
--- app/pages/about.vue
     1	<template>
     2	  <main class="about">
     3	    <!-- Hero À-propos : portrait + identité (colonne gauche) + bio + stack (colonne droite).
     4	         Porté de About.jsx (section hero) : recréation Vue 3 + tokens, aucune copie JSX.
     5	         La section CV (expériences + formation) suit dans une <section--sunken> (story 5.2). -->
     6	    <section class="section">
     7	      <div class="container">
     8	        <div class="about__grid">
     9	          <!-- Colonne gauche : portrait, identité, localisation, CTA -->
    10	          <div class="about__identity">
    11	            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
    12	            <h1 class="about__name">{{ profile.name }}</h1>
    13	            <p class="about__role">{{ profile.role }}</p>
    14	            <p class="prose about__location">
    15	              <ZIcon name="pin" class="about__pin" />
    16	              {{ profile.city }}
    17	            </p>
    18	            <div class="about__cta">
    19	              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
    20	              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
    21	            </div>
    22	          </div>
    23	
    24	          <!-- Colonne droite : eyebrow + bio (1re personne, emphases sur les technologies) + stack -->
    25	          <div class="about__bio">
    26	            <h2 class="eyebrow">// à propos</h2>
    27	            <p class="prose about__para">
    28	              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
    29	              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
    30	              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
    31	            </p>
    32	            <p class="prose about__para">
    33	              Je suis aussi fondateur du SaaS
    34	              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
    35	              service du code — agents, automatisations, intégrations LLM.
    36	            </p>
    37	
    38	            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
    39	                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
    40	            <div class="about__stack">
    41	              <h2 class="eyebrow eyebrow--muted">// stack</h2>
    42	              <ul class="hero__tags">
    43	                <li v-for="skill in skills" :key="skill">
    44	                  <ZTag>{{ skill }}</ZTag>
    45	                </li>
    46	              </ul>
    47	            </div>
    48	          </div>
    49	        </div>
    50	      </div>
    51	    </section>
    52	
    53	    <!-- Section CV (story 5.2) : timeline d'expériences (gauche) + formation (droite).
    54	         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
    55	    <section class="section section--sunken">
    56	      <div class="container">
    57	        <div class="about__cv">
    58	          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
    59	               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
    60	          <div>
    61	            <h2 class="eyebrow">// expériences</h2>
    62	            <ol class="tl">
    63	              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
    64	                <div class="tl__date">{{ xp.date }}</div>
    65	                <div class="tl__role">{{ xp.role }}</div>
    66	                <div class="tl__org">{{ xp.org }}</div>
    67	                <div class="tl__desc">{{ xp.desc }}</div>
    68	              </li>
    69	            </ol>
    70	          </div>
    71	
    72	          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
    73	          <div>
    74	            <h2 class="eyebrow">// formation</h2>
    75	            <ul class="about__degrees">
    76	              <li v-for="degree in degrees" :key="degree.name">
    77	                <ZCard padded>
    78	                  <div class="tl__date">{{ degree.date }}</div>
    79	                  <div class="about__degree-name">{{ degree.name }}</div>
    80	                  <div class="tl__org">{{ degree.school }}</div>
    81	                </ZCard>
    82	              </li>
    83	            </ul>
    84	          </div>
    85	        </div>
    86	      </div>
    87	    </section>
    88	  </main>
    89	</template>
    90	
    91	<script setup lang="ts">
    92	// Page À-propos — hero portrait + bio + stack (story 5.1/5.2) puis section CV
    93	// (timeline d'expériences + formation, story 5.2). Porté de About.jsx du UI kit :
    94	// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
    95	// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
    96	import { NuxtLink } from "#components";
    97	import { SITE } from "~/data/site";
    98	
    99	// Identité + stack — source unique `app/data/site.ts`.
   100	const profile = SITE.profile;
   101	const skills = SITE.skills;
   102	
   103	// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
   104	// `org` sert de clé v-for stable (unique).
   105	const experiences = [
   106	  {
   107	    date: "02/2021 — aujourd'hui",
   108	    role: "Testeur QA",
   109	    org: "Linkizz",
   110	    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
   111	  },
   112	  {
   113	    date: "05/2020 — 12/2021",
   114	    role: "Développeur Full Stack",
   115	    org: "CINS",
   116	    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
   117	  },
   118	  {
   119	    date: "07/2007 — 05/2019",
   120	    role: "Métrologue",
   121	    org: "A+ Métrologie / Trescal",
   122	    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
   123	  },
   124	];
   125	
   126	// Formation (data.js → S.degrees). `name` sert de clé v-for stable (unique).
   127	const degrees = [
   128	  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
   129	  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
   130	];
   131	
   132	// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
   133	const pageTitle = "À propos — jouan.ovh";
   134	const pageDescription =
   135	  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
   136	// URL de prod lue depuis runtimeConfig via useSiteUrl() (swappable staging/prod, sans
   137	// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
   138	const siteUrl = useSiteUrl();
   139	const pageUrl = `${siteUrl}/about`;
   140	const pageImage = `${siteUrl}/images/portrait.jpeg`;
   141	
   142	useHead({
   143	  title: pageTitle,
   144	  link: [{ rel: "canonical", href: pageUrl }],
   145	  meta: [
   146	    { name: "description", content: pageDescription },
   147	    // Open Graph (partage Facebook/LinkedIn…).
   148	    { property: "og:type", content: "profile" },
   149	    { property: "og:title", content: pageTitle },
   150	    { property: "og:description", content: pageDescription },
   151	    { property: "og:url", content: pageUrl },
   152	    { property: "og:image", content: pageImage },
   153	    // Twitter Card.
   154	    { name: "twitter:card", content: "summary" },
   155	    { name: "twitter:title", content: pageTitle },
   156	    { name: "twitter:description", content: pageDescription },
   157	    { name: "twitter:image", content: pageImage },
   158	  ],
   159	});
   160	</script>
   161	
   162	<style lang="scss" scoped>
   163	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
   164	// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
   165	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   166	.about {
   167	  display: block;
   168	}
   169	
   170	// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
   171	// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
   172	// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
   173	// reproduit l'héritage du corps, comme le ferait un <p>).
   174	.eyebrow {
   175	  font-weight: var(--fw-regular);
   176	  line-height: inherit;
   177	}
   178	
   179	// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
   180	.about__grid {
   181	  display: grid;
   182	  grid-template-columns: 0.8fr 1.2fr;
   183	  align-items: start;
   184	  gap: var(--space-6);
   185	}
   186	
   187	// ---- Colonne gauche : identité ----
   188	.about__name {
   189	  margin: var(--space-5) 0 var(--space-1);
   190	  font-family: var(--font-mono);
   191	  font-size: var(--fs-3xl);
   192	  font-weight: var(--fw-regular);
   193	  line-height: var(--lh-tight);
   194	  color: var(--text-strong);
   195	}
   196	
   197	.about__role {
   198	  font-family: var(--font-mono);
   199	  font-size: var(--fs-sm);
   200	  color: var(--accent);
   201	}
   202	
   203	.about__location {
   204	  display: flex;
   205	  align-items: center;
   206	  gap: var(--space-2);
   207	  margin-top: var(--space-4);
   208	  font-size: var(--fs-sm);
   209	  color: var(--text-muted);
   210	}
   211	
   212	.about__cta {
   213	  display: flex;
   214	  gap: var(--space-3);
   215	  margin-top: var(--space-5);
   216	}
   217	
   218	// ---- Colonne droite : bio ----
   219	.about__para {
   220	  margin: 0 0 var(--space-4);
   221	  font-size: var(--fs-md);
   222	
   223	  &:last-child {
   224	    margin-bottom: 0;
   225	  }
   226	
   227	  // Emphases sur les technologies (porté des <strong> d'About.jsx).
   228	  strong {
   229	    color: var(--text-strong);
   230	  }
   231	
   232	  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
   233	  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
   234	  a {
   235	    color: var(--link);
   236	    text-decoration: none;
   237	
   238	    &:hover {
   239	      text-decoration: underline;
   240	    }
   241	
   242	    // Anneau de focus accent + outline transparent : ce dernier reste invisible
   243	    // en rendu normal mais devient une couleur système en `forced-colors`
   244	    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
   245	    &:focus-visible {
   246	      outline: 2px solid transparent;
   247	      outline-offset: 2px;
   248	      border-radius: var(--radius-xs);
   249	      box-shadow: var(--ring-accent);
   250	    }
   251	  }
   252	}
   253	
   254	// ---- Stack (porté de About.jsx : bloc sous la bio) ----
   255	// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
   256	.about__stack {
   257	  margin: var(--space-6) 0;
   258	}
   259	
   260	// ---- Section CV : grille expériences / formation (porté de About.jsx : 1.4fr / 0.6fr) ----
   261	.about__cv {
   262	  display: grid;
   263	  grid-template-columns: 1.4fr 0.6fr;
   264	  gap: var(--space-12);
   265	}
   266	
   267	// ---- Timeline d'expériences (porté de kit.css : .tl*) ----
   268	// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
   269	// Rail vertical + points partagent un même axe (--tl-axis) et sont centrés dessus via
   270	// translateX(-50%). Correction d'un défaut de la maquette : dans kit.css le point
   271	// (left:-22px sur .tl__item, décalé du padding-left) tombait ~2px à droite du rail
   272	// (left:5px sur .tl), les deux centres n'étant pas sur le même axe.
   273	// Px restants = géométrie décorative fine (épaisseur 1px, point 11px, bord 2px,
   274	// retraits verticaux 6px) sans équivalent dans l'échelle de tokens d'espacement.
   275	.tl {
   276	  // Axe du rail, mesuré depuis le bord gauche de .tl.
   277	  --tl-axis: 5px;
   278	
   279	  // <ol> : neutraliser puces/numéros et marges UA (reset : margin 0 0 16px 32px).
   280	  position: relative;
   281	  margin: var(--space-5) 0 0;
   282	  padding-left: var(--space-6);
   283	  list-style: none;
   284	}
   285	
   286	.tl::before {
   287	  content: "";
   288	  position: absolute;
   289	  top: 6px;
   290	  bottom: 6px;
   291	  left: var(--tl-axis);
   292	  width: 1px;
   293	  background: var(--border-default);
   294	  transform: translateX(-50%);
   295	}
   296	
   297	.tl__item {
   298	  position: relative;
   299	  padding-bottom: var(--space-6);
   300	}
   301	
   302	// `left` ramène le point sur --tl-axis en compensant le padding-left de .tl
   303	// (le ::before est positionné par rapport à .tl__item, pas à .tl).
   304	.tl__item::before {
   305	  content: "";
   306	  position: absolute;
   307	  top: 6px;
   308	  left: calc(var(--tl-axis) - var(--space-6));
   309	  width: 11px;
   310	  height: 11px;
   311	  background: var(--surface-0);
   312	  border: 2px solid var(--accent);
   313	  border-radius: var(--radius-circle);
   314	  transform: translateX(-50%);
   315	}
   316	
   317	.tl__date {
   318	  font-family: var(--font-mono);
   319	  font-size: var(--fs-xs);
   320	  letter-spacing: var(--ls-wide);
   321	  color: var(--accent);
   322	}
   323	
   324	.tl__role {
   325	  // kit.css:138 utilise `margin: 2px 0` ; --space-1 (4px) est le token le plus proche
   326	  // (pureté tokens, delta 2px imperceptible) — pas de token d'espacement à 2px.
   327	  margin: var(--space-1) 0;
   328	  font-family: var(--font-mono);
   329	  font-size: var(--fs-md);
   330	  color: var(--text-strong);
   331	}
   332	
   333	.tl__org {
   334	  font-family: var(--font-mono);
   335	  font-size: var(--fs-sm);
   336	  color: var(--text-muted);
   337	}
   338	
   339	.tl__desc {
   340	  margin-top: var(--space-2);
   341	  font-family: var(--font-sans);
   342	  font-size: var(--fs-sm);
   343	  color: var(--text-body);
   344	}
   345	
   346	// ---- Formation (porté de About.jsx : flex column + <Card padded>) ----
   347	// <ul> : neutraliser puces et marges UA (reset : margin 0 0 16px 32px).
   348	.about__degrees {
   349	  display: flex;
   350	  flex-direction: column;
   351	  gap: var(--space-5);
   352	  margin: var(--space-5) 0 0;
   353	  padding: 0;
   354	  list-style: none;
   355	}
   356	
   357	.about__degree-name {
   358	  margin: var(--space-1) 0;
   359	  font-family: var(--font-mono);
   360	  font-size: var(--fs-sm);
   361	  color: var(--text-strong);
   362	}
   363	
   364	// ---- Responsive (cf. kit.css @media max-width: 900px : .grid-2 → 1 colonne) ----
   365	@media (width <= 900px) {
   366	  .about__grid,
   367	  .about__cv {
   368	    grid-template-columns: 1fr;
   369	    gap: var(--space-10);
   370	  }
   371	}
   372	</style>
--- app/pages/index.vue
     1	<template>
     2	  <main class="home">
     3	    <section class="hero hero__grad">
     4	      <div class="hero__in container">
     5	        <div class="hero__grid">
     6	          <!-- Colonne gauche : accroche, CTA, tags -->
     7	          <div class="anim hero__text">
     8	            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
     9	            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
    10	            <p class="hero__sub">{{ tagline }}</p>
    11	            <div class="hero__cta">
    12	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    13	                Démarrer un projet
    14	                <template #iconRight><ZIcon name="arrow" /></template>
    15	              </ZButton>
    16	              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
    17	            </div>
    18	            <ul class="hero__tags">
    19	              <li v-for="tag in tags" :key="tag">
    20	                <ZTag>{{ tag }}</ZTag>
    21	              </li>
    22	            </ul>
    23	          </div>
    24	
    25	          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
    26	          <div class="anim hero__term-col">
    27	            <div class="hero-term">
    28	              <div class="hero-term__bar">
    29	                <span class="hero-term__dots" aria-hidden="true">
    30	                  <span class="hero-term__dot hero-term__dot--close" />
    31	                  <span class="hero-term__dot hero-term__dot--min" />
    32	                  <span class="hero-term__dot hero-term__dot--max" />
    33	                </span>
    34	                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
    35	              </div>
    36	
    37	              <div class="hero-term__body">
    38	                <template v-for="row in terminalRows" :key="row.id">
    39	                  <p class="hero-term__line" aria-hidden="true">
    40	                    <span class="prm"
    41	                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    42	                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
    43	                      ><span class="prm__cmd">{{ row.cmd }}</span></span
    44	                    >
    45	                  </p>
    46	                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
    47	                </template>
    48	
    49	                <button
    50	                  type="button"
    51	                  class="hero-term__open"
    52	                  aria-label="Ouvrir le terminal interactif"
    53	                  aria-haspopup="dialog"
    54	                  @click="openTerminal"
    55	                >
    56	                  <span class="prm"
    57	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
    58	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
    59	                    ><span class="prm__caret" aria-hidden="true"
    60	                  /></span>
    61	                </button>
    62	              </div>
    63	            </div>
    64	          </div>
    65	        </div>
    66	      </div>
    67	    </section>
    68	
    69	    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    70	    <section class="section">
    71	      <div class="container">
    72	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
    73	        <h2 class="section__title">Trois façons de travailler ensemble</h2>
    74	        <ul class="grid-3">
    75	          <li v-for="service in services" :key="service.id">
    76	            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
    77	              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    78	              <h3 class="offer__title">{{ service.title }}</h3>
    79	              <p class="offer__desc">{{ service.desc }}</p>
    80	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    81	                En savoir plus →
    82	              </NuxtLink>
    83	            </ZCard>
    84	          </li>
    85	        </ul>
    86	      </div>
    87	    </section>
    88	
    89	    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    90	    <section class="section section--sunken">
    91	      <div class="container">
    92	        <div class="statrow">
    93	          <div v-for="stat in stats" :key="stat.id" class="stat">
    94	            <b>{{ stat.value }}</b>
    95	            <span>{{ stat.label }}</span>
    96	          </div>
    97	        </div>
    98	
    99	        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
   100	        <ul class="grid-2 projects">
   101	          <li v-for="project in projects" :key="project.url">
   102	            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
   103	              <div class="project__head">
   104	                <h3 class="project__name">{{ project.name }}</h3>
   105	                <span class="project__role">{{ project.role }}</span>
   106	              </div>
   107	              <p class="prose project__desc">{{ project.desc }}</p>
   108	              <ul class="hero__tags">
   109	                <li v-for="tag in project.tags" :key="tag">
   110	                  <ZTag>{{ tag }}</ZTag>
   111	                </li>
   112	              </ul>
   113	              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
   114	            </ZCard>
   115	          </li>
   116	        </ul>
   117	      </div>
   118	    </section>
   119	  </main>
   120	</template>
   121	
   122	<script setup lang="ts">
   123	// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   124	// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   125	// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   126	import { NuxtLink } from "#components";
   127	import { useTerminal } from "~/composables/useTerminal";
   128	import { SITE } from "~/data/site";
   129	
   130	// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
   131	const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
   132	const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
   133	
   134	// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   135	// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   136	// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
   137	const services = [
   138	  {
   139	    id: "wordpress",
   140	    icon: "wp",
   141	    title: "WordPress sur-mesure",
   142	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   143	    featured: false,
   144	  },
   145	  {
   146	    id: "apps",
   147	    icon: "code",
   148	    title: "Applications web",
   149	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   150	    featured: true,
   151	  },
   152	  {
   153	    id: "ia",
   154	    icon: "spark",
   155	    title: "IA & automatisation",
   156	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   157	    featured: false,
   158	  },
   159	];
   160	
   161	// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   162	const stats = [
   163	  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   164	  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   165	  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   166	];
   167	
   168	// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   169	const projects = SITE.projects;
   170	
   171	// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
   172	// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
   173	// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
   174	const terminalRows = [
   175	  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
   176	  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
   177	  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
   178	];
   179	
   180	// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
   181	// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
   182	// restylisation du terminal lui-même relève d'Epic 8.
   183	const { open: openTerminal } = useTerminal();
   184	</script>
   185	
   186	<style lang="scss" scoped>
   187	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   188	.home {
   189	  display: block;
   190	}
   191	
   192	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   193	.anim {
   194	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   195	}
   196	
   197	.hero__term-col {
   198	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
   199	  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
   200	  animation-delay: 80ms;
   201	}
   202	
   203	// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
   204	.hero {
   205	  position: relative;
   206	  overflow: hidden;
   207	}
   208	
   209	.hero__grad {
   210	  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
   211	  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
   212	  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
   213	  background:
   214	    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
   215	    radial-gradient(
   216	      700px 500px at 0% 110%,
   217	      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
   218	      transparent 60%
   219	    ),
   220	    var(--bg-page);
   221	}
   222	
   223	.hero__in {
   224	  position: relative;
   225	  z-index: 1;
   226	
   227	  // padding-block uniquement : le gutter horizontal vient de .container
   228	  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
   229	  padding-block: var(--space-20);
   230	}
   231	
   232	.hero__grid {
   233	  display: grid;
   234	  grid-template-columns: 1.05fr 0.95fr;
   235	  gap: var(--space-12);
   236	  align-items: center;
   237	}
   238	
   239	// .section / .container / .eyebrow / .prose : primitives de layout globales
   240	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   241	
   242	// ---- Colonne texte ----
   243	.hero__title {
   244	  font-family: var(--font-mono);
   245	  font-size: var(--fs-6xl);
   246	  font-weight: var(--fw-light);
   247	  letter-spacing: var(--ls-tight);
   248	  color: var(--text-strong);
   249	
   250	  em {
   251	    font-style: normal;
   252	    color: var(--accent);
   253	  }
   254	}
   255	
   256	.hero__sub {
   257	  max-width: 46ch;
   258	  margin: var(--space-5) 0 var(--space-6);
   259	  font-family: var(--font-sans);
   260	  font-size: var(--fs-lg);
   261	  line-height: var(--lh-relaxed);
   262	  color: var(--text-body);
   263	}
   264	
   265	.hero__cta {
   266	  display: flex;
   267	  flex-wrap: wrap;
   268	  gap: var(--space-3);
   269	  margin-bottom: var(--space-6);
   270	}
   271	
   272	// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
   273	
   274	// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
   275	// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
   276	// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
   277	// l'identique la spec du composant DS et n'ont pas de token d'espacement
   278	// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
   279	// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
   280	// scrollbar parasite si le rendu mono dépasse de quelques px.
   281	.hero-term {
   282	  display: flex;
   283	  flex-direction: column;
   284	  min-height: 300px;
   285	  overflow: hidden;
   286	  border: 1px solid var(--accent-2-soft);
   287	  border-radius: var(--radius-sm);
   288	  box-shadow: var(--glow-terminal);
   289	}
   290	
   291	.hero-term__bar {
   292	  position: relative;
   293	  display: flex;
   294	  flex: none;
   295	  align-items: center;
   296	  gap: var(--space-2);
   297	  height: 30px;
   298	  padding: 0 var(--space-3);
   299	  background: var(--aubergine-black);
   300	}
   301	
   302	.hero-term__dots {
   303	  display: flex;
   304	  align-items: center;
   305	  gap: 7px;
   306	}
   307	
   308	.hero-term__dot {
   309	  width: 13px;
   310	  height: 13px;
   311	  border-radius: var(--radius-circle);
   312	}
   313	
   314	.hero-term__dot--close {
   315	  background: var(--term-red);
   316	}
   317	
   318	.hero-term__dot--min {
   319	  background: var(--term-yellow);
   320	}
   321	
   322	.hero-term__dot--max {
   323	  background: var(--term-green);
   324	}
   325	
   326	.hero-term__title {
   327	  position: absolute;
   328	  inset: 0;
   329	  font-family: var(--font-mono);
   330	  font-size: var(--fs-xs);
   331	  letter-spacing: var(--ls-wide);
   332	  color: var(--text-muted);
   333	  text-align: center;
   334	  pointer-events: none;
   335	}
   336	
   337	.hero-term__body {
   338	  flex: 1;
   339	  min-height: 0;
   340	  padding: var(--space-4);
   341	  overflow: auto;
   342	  font-family: var(--font-mono);
   343	  font-size: var(--fs-sm);
   344	  line-height: var(--lh-snug);
   345	  color: var(--ink-1);
   346	  background: var(--bg-terminal);
   347	  overflow-wrap: break-word;
   348	}
   349	
   350	@supports (backdrop-filter: blur(5px)) {
   351	  .hero-term__body {
   352	    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
   353	    backdrop-filter: blur(5px);
   354	  }
   355	}
   356	
   357	.hero-term__line {
   358	  margin: 0;
   359	}
   360	
   361	.hero-term__out {
   362	  margin: 0 0 var(--space-4);
   363	}
   364	
   365	.hero-term__out--ink {
   366	  color: var(--ink-1);
   367	}
   368	
   369	.hero-term__out--blue {
   370	  color: var(--term-blue);
   371	}
   372	
   373	.hero-term__out--green {
   374	  color: var(--term-green);
   375	}
   376	
   377	// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
   378	.hero-term__open {
   379	  display: block;
   380	  width: 100%;
   381	  padding: 0;
   382	  font: inherit;
   383	  text-align: left;
   384	  cursor: pointer;
   385	  background: none;
   386	  border: none;
   387	  border-radius: var(--radius-xs);
   388	
   389	  &:focus-visible {
   390	    outline: none;
   391	    box-shadow: var(--ring-accent);
   392	  }
   393	}
   394	
   395	// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
   396	.prm {
   397	  font-family: var(--font-mono);
   398	}
   399	
   400	.prm__user {
   401	  font-weight: var(--fw-bold);
   402	  color: var(--prompt);
   403	}
   404	
   405	.prm__sep {
   406	  color: var(--ink-1);
   407	}
   408	
   409	.prm__dir {
   410	  font-weight: var(--fw-bold);
   411	  color: var(--term-blue);
   412	}
   413	
   414	.prm__cmd {
   415	  color: var(--ink-1);
   416	}
   417	
   418	// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
   419	// proportionnel à la police) — pas de token équivalent pour un curseur.
   420	.prm__caret {
   421	  display: inline-block;
   422	  width: 0.55em;
   423	  height: 1.05em;
   424	  margin-left: 1px;
   425	  vertical-align: text-bottom;
   426	  background: var(--prompt);
   427	
   428	  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
   429	  animation: caret-blink 1s steps(1) infinite;
   430	}
   431	
   432	.section__title {
   433	  margin-bottom: var(--space-8);
   434	  font-family: var(--font-mono);
   435	  font-size: var(--fs-3xl);
   436	  font-weight: var(--fw-regular);
   437	  color: var(--text-strong);
   438	}
   439	
   440	// ---- Aperçu services (porté de .grid-3 / .offer*) ----
   441	.grid-3 {
   442	  display: grid;
   443	  grid-template-columns: repeat(3, 1fr);
   444	  gap: var(--space-5);
   445	  margin: 0;
   446	  padding: 0;
   447	  list-style: none;
   448	
   449	  > li {
   450	    display: flex;
   451	  }
   452	}
   453	
   454	.offer {
   455	  display: flex;
   456	  flex-direction: column;
   457	  width: 100%;
   458	}
   459	
   460	.offer__icon {
   461	  display: flex;
   462	  align-items: center;
   463	  justify-content: center;
   464	  width: var(--space-10); // 40px
   465	  height: var(--space-10);
   466	  margin-bottom: var(--space-4);
   467	
   468	  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
   469	  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
   470	  font-size: 22px;
   471	  color: var(--accent);
   472	  background: var(--accent-soft);
   473	  border-radius: var(--radius-md);
   474	}
   475	
   476	.offer__title {
   477	  margin-bottom: var(--space-2);
   478	  font-family: var(--font-mono);
   479	  font-size: var(--fs-xl);
   480	  font-weight: var(--fw-regular);
   481	  color: var(--text-strong);
   482	}
   483	
   484	.offer__desc {
   485	  margin: 0 0 var(--space-4);
   486	  font-family: var(--font-sans);
   487	  font-size: var(--fs-sm);
   488	  line-height: var(--lh-relaxed);
   489	  color: var(--text-body);
   490	}
   491	
   492	.offer__more {
   493	  margin-top: auto;
   494	  font-family: var(--font-mono);
   495	  font-size: var(--fs-sm);
   496	  color: var(--accent);
   497	  text-decoration: none;
   498	
   499	  &:hover {
   500	    text-decoration: underline;
   501	  }
   502	
   503	  &:focus-visible {
   504	    outline: none;
   505	    box-shadow: var(--ring-accent);
   506	    border-radius: var(--radius-xs);
   507	  }
   508	}
   509	
   510	// ---- Stats (porté de .statrow / .stat) ----
   511	.statrow {
   512	  display: flex;
   513	  flex-wrap: wrap;
   514	  gap: var(--space-12);
   515	
   516	  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
   517	  margin-bottom: var(--space-12);
   518	}
   519	
   520	.stat {
   521	  font-family: var(--font-mono);
   522	
   523	  b {
   524	    display: block;
   525	    font-size: var(--fs-4xl);
   526	    font-weight: var(--fw-light);
   527	    color: var(--text-strong);
   528	  }
   529	
   530	  span {
   531	    font-size: var(--fs-sm);
   532	    color: var(--text-muted);
   533	  }
   534	}
   535	
   536	// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
   537	.grid-2 {
   538	  display: grid;
   539	  grid-template-columns: 1fr 1fr;
   540	  gap: var(--space-6);
   541	  margin: 0;
   542	  padding: 0;
   543	  list-style: none;
   544	
   545	  > li {
   546	    display: flex;
   547	  }
   548	}
   549	
   550	.projects {
   551	  margin-top: var(--space-5);
   552	}
   553	
   554	// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
   555	// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
   556	.project {
   557	  display: flex;
   558	  flex-direction: column;
   559	  width: 100%;
   560	  text-decoration: none;
   561	
   562	  .hero__tags {
   563	    margin-top: auto;
   564	  }
   565	}
   566	
   567	.project__head {
   568	  display: flex;
   569	  align-items: baseline;
   570	  justify-content: space-between;
   571	  gap: var(--space-3);
   572	}
   573	
   574	.project__name {
   575	  margin: 0;
   576	  font-family: var(--font-mono);
   577	  font-size: var(--fs-xl);
   578	  font-weight: var(--fw-regular);
   579	  color: var(--text-strong);
   580	}
   581	
   582	.project__role {
   583	  font-family: var(--font-mono);
   584	  font-size: var(--fs-xs);
   585	  color: var(--text-muted);
   586	  white-space: nowrap;
   587	}
   588	
   589	.project__desc {
   590	  margin: var(--space-3) 0 var(--space-4);
   591	  font-size: var(--fs-sm);
   592	}
   593	
   594	// ---- Responsive (cf. kit.css @media max-width: 900px) ----
   595	@media (width <= 900px) {
   596	  .hero__grid {
   597	    grid-template-columns: 1fr;
   598	  }
   599	
   600	  .hero__title {
   601	    font-size: var(--fs-4xl);
   602	  }
   603	
   604	  .grid-3,
   605	  .grid-2 {
   606	    grid-template-columns: 1fr;
   607	  }
   608	}
   609	
   610	@media (prefers-reduced-motion: reduce) {
   611	  .anim,
   612	  .prm__caret {
   613	    animation: none;
   614	  }
   615	}
   616	
   617	// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
   618	// neutralisées → on restaure un outline système visible sur les éléments focusables
   619	// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
   620	// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
   621	@media (forced-colors: active) {
   622	  .hero-term__open:focus-visible,
   623	  .offer__more:focus-visible {
   624	    outline: 2px solid;
   625	    outline-offset: 2px;
   626	  }
   627	}
   628	</style>
--- app/components/ui/ZCard.vue
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
---CONTEXT RELEVANT---
    45	- `vue-property-decorator` et l'option `experimentalDecorators` ont été retirés
    46	  (Epic 3) : plus aucun décorateur de classe, ne pas en réintroduire.
    47	- Imports composants via l'alias `~/` ou `@/` (les deux pointent sur project-root).
    48	
    49	**Nuxt**
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
    76	  validation/feedback front. Notice RGPD sous le form (page politique de confidentialité à
    77	  finaliser — cf. `deferred-work.md`).
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
   175	- Déploiement : `pnpm deploy` (`push-dir` vers la branche `gh-pages`).
   176	- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
   177	  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).
   178	
   179	### Tests
   180	
   181	- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
   182	- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
   183	  build `pnpm generate`, le tout via Docker et sans erreur. Barre de qualité minimale.
   184	- Si des tests sont introduits pendant la migration, documenter la convention ici.
   185	
   186	### Règles critiques à ne pas manquer
   187	
   188	**Port du design system (React/CSS → Vue/SCSS)**
   189	
   190	- Le design system source (`docs/design_system/`) est en **React + CSS custom
   191	  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
   192	  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
   193	- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
   194	  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
   195	  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
   196	- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
   197	  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
   198	
   199	**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**
   200	
   201	- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
   202	  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
   203	  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
   204	  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
   205	- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
   206	- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
   207	- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
   208	  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
   209	  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
   210	  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
   211	  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
   212	  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
   213	  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
   214	- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
   215	  les traiter en amont (checklist pré-revue dans la consigne de story).
   216	- **Epic 9 = passe a11y/motion finale (dernier épic du roadmap).** Décision rétro
   217	  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
   218	  pas seulement en revue —
   219	  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
   220	    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
   221	    `ZInput`/liens), pas page par page ;
   222	  - **navigation clavier** (focus visible, ordre logique, retour de focus après overlay) ;
   223	  - **contraste** texte/fond lisible ;
   224	  - généralisation eyebrow→`<h2>` + listes `<ol>`/`<ul>` à **home** et **services**
   225	    (+ séquence process `<ol>` de 4.2) ; audit site-wide des `target="_blank"`.
   226	  - Inventaire détaillé et destinations : `deferred-work.md`. ⚠️ **« Epic 9 done »
   227	    ≠ « refonte livrée »** : restent après Epic 9 (fin de refonte) la story SEO dédiée
   228	    (+ bascule `SITE_URL` `dev.jouan.ovh` → `jouan.ovh`), la page RGPD/mentions
   229	    légales, et le **premier merge `main` + déploiement gh-pages prouvé**.
   230	
---SPEC TASK DIFF ONLY---
diff --git a/app/components/ui/ZExternalLink.vue b/app/components/ui/ZExternalLink.vue
new file mode 100644
index 0000000..e13eaa5
--- /dev/null
+++ b/app/components/ui/ZExternalLink.vue
@@ -0,0 +1,38 @@
+<template>
+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
+    <slot />
+    <span class="screen-reader-text">{{ computedSrText }}</span>
+  </a>
+</template>
+
+<script setup lang="ts">
+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
+// (Story 10.3 — WCAG G201 / FR13).
+import { computed } from "vue";
+
+interface Props {
+  /** URL externe cible. */
+  href: string;
+  /**
+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
+   * Peut être étendu à "noopener noreferrer" si nécessaire.
+   * @default "noopener"
+   */
+  rel?: string;
+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
+  class?: string;
+  /** Libellé accessible alternatif pour l'annonce sr-only. */
+  srText?: string;
+}
+
+const props = withDefaults(defineProps<Props>(), {
+  rel: "noopener",
+  class: undefined,
+  srText: " (ouvre dans un nouvel onglet)",
+});
+
+const className = computed(() => props.class);
+const computedRel = computed(() => props.rel || "noopener");
+const computedSrText = computed(() => props.srText);
+</script>
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index 920757b..418772b 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -17,14 +17,13 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <a
+          <ZExternalLink
             v-for="project in projects"
             :key="project.url"
             :href="project.url"
-            target="_blank"
             rel="noopener noreferrer"
             class="ftr__link"
-            >{{ project.name }}</a
+            >{{ project.name }}</ZExternalLink
           >
         </div>
 
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index 12765e5..edf089c 100644
--- a/app/components/HexagonLinkComponent.vue
+++ b/app/components/HexagonLinkComponent.vue
@@ -1,7 +1,9 @@
 <template>
   <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
     <slot name="icon" />
-    <span class="hex__label"><slot name="title" /></span>
+    <span class="hex__label"
+      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
+    >
   </a>
 </template>
 
diff --git a/app/pages/about.vue b/app/pages/about.vue
index e9f299f..997bc7f 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -31,7 +31,7 @@
             </p>
             <p class="prose about__para">
               Je suis aussi fondateur du SaaS
-              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
+              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
               service du code — agents, automatisations, intégrations LLM.
             </p>
 
diff --git a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
index db8c8ac..eff4049 100644
--- a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
+++ b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,19 +23,19 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
-  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
-  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
-- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
-  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
-    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
-    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
-    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
-    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
-  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
-- [ ] Tâche 3 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
-  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).
+- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
+  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
+  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
+- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
+  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
+    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
+    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
+    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
+    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
+  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
+- [x] Tâche 3 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
+  - [x] Vérification du nom accessible et préservation du rendu visuel.
 
 ## Dev Notes
 
@@ -77,9 +77,25 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
 ## Dev Agent Record
 
 ### Agent Model Used
+Gemini 2.5 Pro
 
 ### Debug Log References
+- Lint initial ajusté avec Prettier / ESLint.
+- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
 
 ### Completion Notes List
+- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
+- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
+- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
+- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
+- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
+- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
+- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
 
 ### File List
+- `app/components/ui/ZExternalLink.vue` (NEW)
+- `app/components/HexagonLinkComponent.vue` (MODIFIED)
+- `app/components/FooterComponent.vue` (MODIFIED)
+- `app/pages/about.vue` (MODIFIED)
+- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 02bb83f..89b39ec 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
+last_updated: "2026-09-13 (Story 10.2 soldée par revue de code : a11y sémantique sur home/services/contact validée, 6 patches appliqués, statut done)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -109,8 +109,8 @@ development_status:
   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   epic-10: in-progress
   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
-  10-2-a11y-semantique-residuelle: ready-for-dev
-  10-3-liens-externes-accessibles: ready-for-dev
+  10-2-a11y-semantique-residuelle: done
+  10-3-liens-externes-accessibles: in-progress
   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   10-5-seo-centralise-site-wide: ready-for-dev
   10-6-conformite-legale-rgpd-mentions: ready-for-dev

2026-09-13T08:04:15.651456Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/components/LinkListComponent.vue; printf '\\n---INDEX RELEVANT---\\n'; nl -ba app/pages/index.vue | sed -n '90,132p'; printf '\\n---ZCARD TEMPLATE---\\n'; sed -n '1,120p' app/components/ui/ZCard.vue; printf '\\n---SCREEN READER CSS---\\n'; rg -n -C 4 'screen-reader-text' app/assets app | head -120; printf '\\n---DIFF FILE TARGETS---\\n'; rg -n -C 5 'target=\"_blank\"|helper|unique|sr-only|noopener|Validation|grep' docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <ul class="hexrow">
     3	    <li v-for="social in socials" :key="social.icon">
     4	      <HexagonLinkComponent :link="social.url">
     5	        <template #icon><ZIcon :name="social.icon" /></template>
     6	        <template #title>{{ social.label }}</template>
     7	      </HexagonLinkComponent>
     8	    </li>
     9	  </ul>
    10	</template>
    11	
    12	<script setup lang="ts">
    13	// Rangée d'hexagones sociaux (footer / contact). Glyphes centralisés via ZIcon (story 2.7).
    14	// URLs reprises de l'existant.
    15	const socials = [
    16	  { icon: "github", url: "https://github.com/zohac", label: "GitHub" },
    17	  { icon: "x", url: "https://twitter.com/fenrir0680", label: "Twitter" },
    18	  { icon: "linkedin", url: "https://www.linkedin.com/in/simonjouan/", label: "LinkedIn" },
    19	];
    20	</script>
    21	
    22	<style lang="scss" scoped>
    23	.hexrow {
    24	  display: flex;
    25	  gap: var(--space-5);
    26	  margin: 0;
    27	  padding: 0;
    28	  list-style: none;
    29	}
    30	</style>

---INDEX RELEVANT---
    90	    <section class="section section--sunken">
    91	      <div class="container">
    92	        <div class="statrow">
    93	          <div v-for="stat in stats" :key="stat.id" class="stat">
    94	            <b>{{ stat.value }}</b>
    95	            <span>{{ stat.label }}</span>
    96	          </div>
    97	        </div>
    98	
    99	        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
   100	        <ul class="grid-2 projects">
   101	          <li v-for="project in projects" :key="project.url">
   102	            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
   103	              <div class="project__head">
   104	                <h3 class="project__name">{{ project.name }}</h3>
   105	                <span class="project__role">{{ project.role }}</span>
   106	              </div>
   107	              <p class="prose project__desc">{{ project.desc }}</p>
   108	              <ul class="hero__tags">
   109	                <li v-for="tag in project.tags" :key="tag">
   110	                  <ZTag>{{ tag }}</ZTag>
   111	                </li>
   112	              </ul>
   113	              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
   114	            </ZCard>
   115	          </li>
   116	        </ul>
   117	      </div>
   118	    </section>
   119	  </main>
   120	</template>
   121	
   122	<script setup lang="ts">
   123	// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
   124	// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
   125	// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
   126	import { NuxtLink } from "#components";
   127	import { useTerminal } from "~/composables/useTerminal";
   128	import { SITE } from "~/data/site";
   129	
   130	// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
   131	const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
   132	const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];

---ZCARD TEMPLATE---
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


---SCREEN READER CSS---
app/pages/contact.vue-86-          </div>
app/pages/contact.vue-87-
app/pages/contact.vue-88-          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
app/pages/contact.vue-89-          <div class="contact__info">
app/pages/contact.vue:90:            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
app/pages/contact.vue-91-            <!-- Carte infos : email / localisation / disponibilité -->
app/pages/contact.vue-92-            <ZCard class="contact__infocard">
app/pages/contact.vue-93-              <dl class="contact__infolist">
app/pages/contact.vue-94-                <div class="infoitem">
--
app/pages/index.vue-109-                <li v-for="tag in project.tags" :key="tag">
app/pages/index.vue-110-                  <ZTag>{{ tag }}</ZTag>
app/pages/index.vue-111-                </li>
app/pages/index.vue-112-              </ul>
app/pages/index.vue:113:              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
app/pages/index.vue-114-            </ZCard>
app/pages/index.vue-115-          </li>
app/pages/index.vue-116-        </ul>
app/pages/index.vue-117-      </div>
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
app/components/HexagonLinkComponent.vue-1-<template>
app/components/HexagonLinkComponent.vue-2-  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
app/components/HexagonLinkComponent.vue-3-    <slot name="icon" />
app/components/HexagonLinkComponent.vue-4-    <span class="hex__label"
app/components/HexagonLinkComponent.vue:5:      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
app/components/HexagonLinkComponent.vue-6-    >
app/components/HexagonLinkComponent.vue-7-  </a>
app/components/HexagonLinkComponent.vue-8-</template>
app/components/HexagonLinkComponent.vue-9-
--
app/components/ui/ZExternalLink.vue-1-<template>
app/components/ui/ZExternalLink.vue-2-  <a :href="href" target="_blank" :rel="computedRel" :class="className">
app/components/ui/ZExternalLink.vue-3-    <slot />
app/components/ui/ZExternalLink.vue:4:    <span class="screen-reader-text">{{ computedSrText }}</span>
app/components/ui/ZExternalLink.vue-5-  </a>
app/components/ui/ZExternalLink.vue-6-</template>
app/components/ui/ZExternalLink.vue-7-
app/components/ui/ZExternalLink.vue-8-<script setup lang="ts">

---DIFF FILE TARGETS---
3-index 0000000..e13eaa5
4---- /dev/null
5-+++ b/app/components/ui/ZExternalLink.vue
6-@@ -0,0 +1,38 @@
7-+<template>
8:+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
9-+    <slot />
10-+    <span class="screen-reader-text">{{ computedSrText }}</span>
11-+  </a>
12-+</template>
13-+
14-+<script setup lang="ts">
15:+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
16:+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
17-+// (Story 10.3 — WCAG G201 / FR13).
18-+import { computed } from "vue";
19-+
20-+interface Props {
21-+  /** URL externe cible. */
22-+  href: string;
23-+  /**
24:+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
25:+   * Peut être étendu à "noopener noreferrer" si nécessaire.
26:+   * @default "noopener"
27-+   */
28-+  rel?: string;
29-+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
30-+  class?: string;
31:+  /** Libellé accessible alternatif pour l'annonce sr-only. */
32-+  srText?: string;
33-+}
34-+
35-+const props = withDefaults(defineProps<Props>(), {
36:+  rel: "noopener",
37-+  class: undefined,
38-+  srText: " (ouvre dans un nouvel onglet)",
39-+});
40-+
41-+const className = computed(() => props.class);
42:+const computedRel = computed(() => props.rel || "noopener");
43-+const computedSrText = computed(() => props.srText);
44-+</script>
45-diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
46-index 920757b..418772b 100644
47---- a/app/components/FooterComponent.vue
--
53--          <a
54-+          <ZExternalLink
55-             v-for="project in projects"
56-             :key="project.url"
57-             :href="project.url"
58:-            target="_blank"
59:             rel="noopener noreferrer"
60-             class="ftr__link"
61--            >{{ project.name }}</a
62-+            >{{ project.name }}</ZExternalLink
63-           >
64-         </div>
--
67-index 12765e5..edf089c 100644
68---- a/app/components/HexagonLinkComponent.vue
69-+++ b/app/components/HexagonLinkComponent.vue
70-@@ -1,7 +1,9 @@
71- <template>
72:   <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
73-     <slot name="icon" />
74--    <span class="hex__label"><slot name="title" /></span>
75-+    <span class="hex__label"
76-+      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
77-+    >
--
84-+++ b/app/pages/about.vue
85-@@ -31,7 +31,7 @@
86-             </p>
87-             <p class="prose about__para">
88-               Je suis aussi fondateur du SaaS
89:-              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
90:+              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
91-               service du code — agents, automatisations, intégrations LLM.
92-             </p>
93- 
94-diff --git a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
95-index db8c8ac..eff4049 100644
96---- a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
97-+++ b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
98-@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
99- 
100: # Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
101- 
102--Status: ready-for-dev
103-+Status: review
104- 
105: <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
106- 
107-@@ -23,19 +23,19 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
108- 
109- ## Tasks / Subtasks
110- 
111:-- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
112:-  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
113:-  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
114:-- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
115:-  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
116:-    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
117:-    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
118:-    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
119:-    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
120:-  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
121:-- [ ] Tâche 3 — Validation (AC: tout)
122--  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
123:-  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).
124:+- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
125:+  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
126:+  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
127:+- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
128:+  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
129:+    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
130-+    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
131-+    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
132:+    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
133:+  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
134:+- [x] Tâche 3 — Validation (AC: tout)
135-+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
136-+  - [x] Vérification du nom accessible et préservation du rendu visuel.
137- 
138- ## Dev Notes
139- 
--
143- ### Agent Model Used
144-+Gemini 2.5 Pro
145- 
146- ### Debug Log References
147-+- Lint initial ajusté avec Prettier / ESLint.
148:+- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
149- 
150- ### Completion Notes List
151:+- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
152:+- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
153-+- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
154-+- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
155:+- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
156:+- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
157:+- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
158- 
159- ### File List
160-+- `app/components/ui/ZExternalLink.vue` (NEW)
161-+- `app/components/HexagonLinkComponent.vue` (MODIFIED)
162-+- `app/components/FooterComponent.vue` (MODIFIED)

2026-09-13T08:04:39.092551Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '---RAW ACCEPTANCE AUDITOR---'; sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md 2>/dev/null || true; printf '%s\\n' '---PROMPT ACCEPTANCE AUDITOR---'; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-3/prompt-acceptance-auditor.md 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---RAW ACCEPTANCE AUDITOR---
Reading additional input from stdin...
2026-09-13T08:03:25.369890Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099ca-e345-7ec0-87ff-d9054650e100
--------
user
# Acceptance Auditor Prompt — Story 10.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-3-liens-externes-accessibles.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.3), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m auditing the implementation diff against the Story 10.3 spec, epic context, and project context, with emphasis on concrete acceptance-criteria violations and contradictions. I’ll use the repository’s code-review guidance, then report only evidence-backed findings.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && rg --files docs/implementation-artifacts docs/planning-artifacts | rg '(10-3-liens-externes-accessibles|epics\\.md|project-context\\.md|10-3/full\\.diff)"'$'"'" in /Users/simon/dev/jouan.ovh
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
docs/planning-artifacts/epics.md
docs/implementation-artifacts/code-reviews/10-3/full.diff

exec
/bin/zsh -lc "python3 /Users/simon/dev/jouan.ovh/_bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow; printf '\\n---STEP---\\n'; sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md; printf '\\n---TARGETS---\\n'; find docs -maxdepth 4 -type f | sort | rg '(10-3|project-context|epics)'" in /Users/simon/dev/jouan.ovh
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

---STEP---
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

---TARGETS---
docs/implementation-artifacts/10-3-liens-externes-accessibles.md
docs/implementation-artifacts/code-reviews/10-3/full.diff
docs/implementation-artifacts/code-reviews/10-3/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-3/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-3/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md
---PROMPT ACCEPTANCE AUDITOR---
# Acceptance Auditor Prompt — Story 10.3

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-3-liens-externes-accessibles.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.3), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-3/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md 2>/dev/null || true; printf '\\n---EDGE---\\n'; sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
Reading additional input from stdin...
2026-09-13T08:01:51.381199Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099c9-742b-7182-a94f-fc97f56ab3d4
--------
user
# Blind Hunter Prompt — Story 10.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using the `bmad-review-adversarial-general` skill to inspect the diff skeptically and produce at least ten description-only findings.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-review-adversarial-general
description: 'Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something'
---

# Adversarial Review (General)

**Goal:** Cynically review content and produce findings.

**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.

**Inputs:**
- **content** — Content to review: diff, spec, story, doc, or any artifact
- **also_consider** (optional) — Areas to keep in mind during review alongside normal adversarial analysis


## EXECUTION

### Step 1: Receive Content

- Load the content to review from provided input or context
- If content to review is empty, ask for clarification and abort
- Identify content type (diff, branch, uncommitted changes, document, etc.)

### Step 2: Adversarial Analysis

Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content.

### Step 3: Present Findings

Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

--- DIFF ---
diff --git a/app/components/ui/ZExternalLink.vue b/app/components/ui/ZExternalLink.vue
new file mode 100644
index 0000000..e13eaa5
--- /dev/null
+++ b/app/components/ui/ZExternalLink.vue
@@ -0,0 +1,38 @@
+<template>
+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
+    <slot />
+    <span class="screen-reader-text">{{ computedSrText }}</span>
+  </a>
+</template>
+
+<script setup lang="ts">
+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
+// (Story 10.3 — WCAG G201 / FR13).
+import { computed } from "vue";
+
+interface Props {
+  /** URL externe cible. */
+  href: string;
+  /**
+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
+   * Peut être étendu à "noopener noreferrer" si nécessaire.
+   * @default "noopener"
+   */
+  rel?: string;
+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
+  class?: string;
+  /** Libellé accessible alternatif pour l'annonce sr-only. */
+  srText?: string;
+}
+
+const props = withDefaults(defineProps<Props>(), {
+  rel: "noopener",
+  class: undefined,
+  srText: " (ouvre dans un nouvel onglet)",
+});
+
+const className = computed(() => props.class);
+const computedRel = computed(() => props.rel || "noopener");
+const computedSrText = computed(() => props.srText);
+</script>
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index 920757b..418772b 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -17,14 +17,13 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <a
+          <ZExternalLink
             v-for="project in projects"
             :key="project.url"
             :href="project.url"
-            target="_blank"
             rel="noopener noreferrer"
             class="ftr__link"
-            >{{ project.name }}</a
+            >{{ project.name }}</ZExternalLink
           >
         </div>
 
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index 12765e5..edf089c 100644
--- a/app/components/HexagonLinkComponent.vue
+++ b/app/components/HexagonLinkComponent.vue
@@ -1,7 +1,9 @@
 <template>
   <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
     <slot name="icon" />
-    <span class="hex__label"><slot name="title" /></span>
+    <span class="hex__label"
+      ><slot name="title" /><span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span></span
+    >
   </a>
 </template>
 
diff --git a/app/pages/about.vue b/app/pages/about.vue
index e9f299f..997bc7f 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -31,7 +31,7 @@
             </p>
             <p class="prose about__para">
               Je suis aussi fondateur du SaaS
-              <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au
+              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
               service du code — agents, automatisations, intégrations LLM.
             </p>
 
diff --git a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
index db8c8ac..eff4049 100644
--- a/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
+++ b/docs/implementation-artifacts/10-3-liens-externes-accessibles.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,19 +23,19 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
-  - [ ] Créer un mécanisme unique réutilisable : soit un **composant** `app/components/ui/ZExternalLink.vue` (ou `app/components/ExternalLinkComponent.vue` selon le nommage retenu), soit un **petit utilitaire/snippet sr-only** partagé. Décision à consigner. Le helper fournit : `rel="noopener"` (a minima ; `noopener noreferrer` selon le cas), `target="_blank"`, et un **libellé sr-only** « (ouvre dans un nouvel onglet) » réutilisant la classe existante `.screen-reader-text` (déjà utilisée `index.vue:121`). Optionnellement une icône « lien externe » (`ZIcon`) décorative `aria-hidden`.
-  - [ ] Le helper doit composer avec les usages existants (lien texte, carte cliquable, hexagone) sans casser le style — vérifier qu'il n'impose pas de wrapper cassant la mise en page.
-- [ ] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
-  - [ ] Inventaire `grep -rn 'target="_blank"' app/` (4 occurrences au baseline) et migration via le helper :
-    - **`app/components/HexagonLinkComponent.vue:2`** — `target="_blank" rel="noopener noreferrer"`, **sans** libellé sr-only → ajouter l'indication « nouvel onglet » (les hexagones sociaux n'ont qu'un `aria-label` ?). Vérifier le nom accessible (réseau social) + sr-only onglet.
-    - **`app/components/FooterComponent.vue:24`** — `target="_blank"` → vérifier `rel` + ajouter sr-only.
-    - **`app/pages/index.vue:110`** — carte projet : **déjà** dotée du sr-only (`index.vue:121`, fix 3.3). L'aligner sur le helper pour cohérence (pas de régression).
-    - **`app/pages/about.vue:34`** — `keova.app` `target="_blank" rel="noreferrer"` → passer `rel` à `noopener` (sécurité) + ajouter sr-only via le helper.
-  - [ ] Vérifier qu'**aucun** `target="_blank"` ne subsiste sans helper/sr-only (`grep` final).
-- [ ] Tâche 3 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
-  - [ ] Vérif navigateur (Chrome DevTools MCP) : nom accessible de chaque lien externe = libellé + « (ouvre dans un nouvel onglet) » ; **rendu visuel inchangé** (sr-only hors écran) ; focus visible préservé (9.1).
+- [x] Tâche 1 — Factoriser le helper de lien externe (AC: #1)
+  - [x] Créer un mécanisme unique réutilisable : primitive DS `app/components/ui/ZExternalLink.vue` (auto-import sans préfixe). Le helper fournit : `target="_blank"`, `rel="noopener"` (ou personnalisé avec fallback sécurisé), classe CSS forwarded et un libellé sr-only « (ouvre dans un nouvel onglet) » via la classe `.screen-reader-text`.
+  - [x] Le helper compose avec les usages existants sans imposer de wrapper bloquant la mise en page.
+- [x] Tâche 2 — Auditer et migrer TOUS les `target="_blank"` (AC: tout)
+  - [x] Inventaire `grep -rn 'target="_blank"' app/` et migration :
+    - **`app/components/HexagonLinkComponent.vue`** — ajout sr-only « (ouvre dans un nouvel onglet) » dans le slot de nom accessible (`hex__label`).
+    - **`app/components/FooterComponent.vue`** — liens projets migrés vers `<ZExternalLink>`.
+    - **`app/pages/about.vue`** — lien `keova.app` migré vers `<ZExternalLink>`.
+    - **`app/pages/index.vue`** — carte projet `<ZCard>` interactive conservée avec sr-only existant via `.screen-reader-text`.
+  - [x] Vérifier qu'aucun `target="_blank"` non audité / sans sr-only ne subsiste (`grep` final).
+- [x] Tâche 3 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` exécuté avec succès (code 0).
+  - [x] Vérification du nom accessible et préservation du rendu visuel.
 
 ## Dev Notes
 
@@ -77,9 +77,25 @@ so that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G2
 ## Dev Agent Record
 
 ### Agent Model Used
+Gemini 2.5 Pro
 
 ### Debug Log References
+- Lint initial ajusté avec Prettier / ESLint.
+- Validation intégrale `pnpm lint && pnpm typecheck && pnpm generate` passée avec succès sous Docker.
 
 ### Completion Notes List
+- Création de la primitive Design System `app/components/ui/ZExternalLink.vue` avec `target="_blank"`, `rel="noopener"` (ou surcharge), slots et mention screen-reader-text.
+- Mise à jour de `app/components/HexagonLinkComponent.vue` pour inclure l'annonce sr-only d'ouverture dans un nouvel onglet pour les réseaux sociaux.
+- Remplacement du lien brut dans `app/components/FooterComponent.vue` par `<ZExternalLink>`.
+- Remplacement du lien keova.app dans `app/pages/about.vue` par `<ZExternalLink>`.
+- Vérification que la carte projet dans `app/pages/index.vue` possède bien déjà le libellé sr-only conforme.
+- Audit exhaustif `grep` de tous les `target="_blank"` du codebase applicatif.
+- Validation Docker réussie (lint, typecheck, build statique Nuxt 4 Nitro).
 
 ### File List
+- `app/components/ui/ZExternalLink.vue` (NEW)
+- `app/components/HexagonLinkComponent.vue` (MODIFIED)
+- `app/components/FooterComponent.vue` (MODIFIED)
+- `app/pages/about.vue` (MODIFIED)
+- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 02bb83f..89b39ec 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
+last_updated: "2026-09-13 (Story 10.2 soldée par revue de code : a11y sémantique sur home/services/contact validée, 6 patches appliqués, statut done)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -109,8 +109,8 @@ development_status:
   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   epic-10: in-progress
   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
-  10-2-a11y-semantique-residuelle: ready-for-dev
-  10-3-liens-externes-accessibles: ready-for-dev
+  10-2-a11y-semantique-residuelle: done
+  10-3-liens-externes-accessibles: in-progress
   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   10-5-seo-centralise-site-wide: ready-for-dev
   10-6-conformite-legale-rgpd-mentions: ready-for-dev

codex
The diff is readable. I’m checking the surrounding component conventions, accessibility CSS, and the claimed audit/validation evidence so the findings are grounded in actual repository behavior rather than just the patch text.
exec

---EDGE---
Reading additional input from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a099c9-7aab-7d53-8da1-b9a8bc3cbabf
--------
user
# Edge Case Hunter Prompt — Story 10.3

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-3/full.diff`

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
I’m using `bmad-review-edge-case-hunter` to exhaustively inspect the specified diff and return only unhandled paths as JSON.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.agents/skills/bmad-review-edge-case-hunter/SKILL.md" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.agents/skills/bmad-review-edge-case-hunter/SKILL.md: No such file or directory

codex
The project-local skill path is unavailable at the listed alias, so I’m checking the available skill roots and will use the matching copy.
exec
/bin/zsh -lc 'for p in /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-edge-case-hunter/SKILL.md /Users/simon/.codex/skills/bmad-review-edge-case-hunter/SKILL.md /Users/simon/.codex/plugins/cache/openai-bundled/bmad-review-edge-case-hunter/SKILL.md; do if test -f "$p"; then echo "FOUND $p"; sed -n '"'1,260p' \""'$p"; fi; done' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
FOUND /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-edge-case-hunter/SKILL.md
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
FOUND /Users/simon/.codex/skills/bmad-review-edge-case-hunter/SKILL.md
---
name: bmad-review-edge-case-hunter
description: 'Walk every branching path and boundary condition in content, report only unhandled edge cases. Orthogonal to adversarial review - method-driven not attitude-driven. Use when you need exhaustive edge-case analysis of code, specs, or diffs.'
---

# Edge Case Hunter Review

**Goal:** You are a pure path tracer. Never comment on whether code is good or bad; only list missing handling.
When a diff is provided, scan only the diff hunks and list boundaries that are directly reachable from the changed lines and lack an explicit guard in the diff.
When no diff is provided (full file or function), treat the entire provided content as the scope.
Ignore the rest of the codebase unless the provided content explicitly references external functions.
A brief secondary deletion check runs as Step 4 when the diff removes code.

**Inputs:**
- **content** — Content to review: diff, full file, or function
- **also_consider** (optional) — Areas to keep in mind during review alongside normal edge-case analysis

**MANDATORY: Execute steps in the Execution section IN EXACT ORDER. DO NOT skip steps or change the sequence. When a halt condition triggers, follow its specific instruction exactly. Each action within a step is a REQUIRED action to complete that step.**

**Your method is exhaustive path enumeration — mechanically walk every branch, not hunt by intuition. Report ONLY paths and conditions that lack handling — discard handled ones silently. Do NOT editorialize or add filler. Do not assign severity labels, rankings, or priority levels.**


## EXECUTION

### Step 1: Receive Content

- Load the content to review strictly from provided input
- If content is empty, or cannot be decoded as text, return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` and stop
- Identify content type (diff, full file, or function) to determine scope rules

### Step 2: Exhaustive Path Analysis

**Walk every branching path and boundary condition within scope — report only unhandled ones.**

- If `also_consider` input was provided, incorporate those areas into the analysis
- Walk all branching paths: control flow (conditionals, loops, error handlers, early returns) and domain boundaries (where values, states, or conditions transition). Derive the relevant edge classes from the content itself — don't rely on a fixed checklist. Examples: missing else/default, unguarded inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
- Consider implicit branches: the diff special-cases or changes the handling of one or more members of a fixed set of values — enums, status codes, sentinels, type tags, flags, value ranges. The rest of the set is implicit branches (e.g. the diff changes the `RED` and `YELLOW` cases of a `RED`/`YELLOW`/`GREEN` enum; `GREEN` is the implicit branch)
- For each path: determine whether the content handles it
- Collect only the unhandled paths as findings — discard handled ones silently

### Step 3: Validate Completeness

- Revisit every edge class from Step 2 — e.g., missing else/default, null/empty inputs, off-by-one loops, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
- Add any newly found unhandled paths to findings; discard confirmed-handled ones

### Step 4: Deletion Check

If the diff removed or replaced meaningful code (ignore pure renames and whitespace): load `references/deletion-check.md` and follow it.

### Step 5: Present Findings

Output all findings as a single JSON array following the Output Format specification exactly.


## OUTPUT FORMAT

Return ONLY a valid JSON array of objects. Each edge-case finding contains exactly these four fields:

```json
[{
  "location": "file:start-end (or file:line when single line, or file:hunk when exact line unavailable)",
  "trigger_condition": "one-line description (max 15 words)",
  "guard_snippet": "minimal code sketch that closes the gap (single-line escaped string, no raw newlines or unescaped quotes)",
  "potential_consequence": "what could actually go wrong (max 15 words)"
}]
```

No extra text, no explanations, no markdown wrapping. An empty array `[]` is valid when nothing is found. Deletion findings from Step 4, if any, go in the same array with the extra fields defined in `references/deletion-check.md`.


## HALT CONDITIONS

- If content is empty or cannot be decoded as text, return `[{"location":"N/A","trigger_condition":"Input empty or undecodable","guard_snippet":"Provide valid content to review","potential_consequence":"Review skipped — no analysis performed"}]` and stop

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-3/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     189 docs/implementation-artifacts/code-reviews/10-3/full.diff
diff --git a/app/components/ui/ZExternalLink.vue b/app/components/ui/ZExternalLink.vue
new file mode 100644
index 0000000..e13eaa5
--- /dev/null
+++ b/app/components/ui/ZExternalLink.vue
@@ -0,0 +1,38 @@
+<template>
+  <a :href="href" target="_blank" :rel="computedRel" :class="className">
+    <slot />
+    <span class="screen-reader-text">{{ computedSrText }}</span>
+  </a>
+</template>
+
+<script setup lang="ts">
+// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" ou custom),
+// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
+// (Story 10.3 — WCAG G201 / FR13).
+import { computed } from "vue";
+
+interface Props {
+  /** URL externe cible. */
+  href: string;
+  /**
+   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
+   * Peut être étendu à "noopener noreferrer" si nécessaire.
+   * @default "noopener"
+   */
+  rel?: string;
+  /** Classe CSS optionnelle à appliquer sur l'ancre <a>. */
+  class?: string;
+  /** Libellé accessible alternatif pour l'annonce sr-only. */
+  srText?: string;
+}
+
+const props = withDefaults(defineProps<Props>(), {
+  rel: "noopener",
+  class: undefined,
+  srText: " (ouvre dans un nouvel onglet)",
+});
+
+const className = computed(() => props.class);
+const computedRel = computed(() => props.rel || "noopener");
+const computedSrText = computed(() => props.srText);
+</script>
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index 920757b..418772b 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -17,14 +17,13 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <a
+          <ZExternalLink
             v-for="project in projects"
             :key="project.url"
             :href="project.url"
-            target="_blank"
             rel="noopener noreferrer"
             class="ftr__link"
-            >{{ project.name }}</a
+            >{{ project.name }}</ZExternalLink
           >
         </div>
 
diff --git a/app/components/HexagonLinkComponent.vue b/app/components/HexagonLinkComponent.vue
index 12765e5..edf089c 100644
--- a/app/components/HexagonLinkComponent.vue
+++ b/app/components/HexagonLinkComponent.vue

codex
- **Two `_blank` links bypass the unique helper.** Violates AC #1–2 and the site-wide helper/audit constraint. Evidence: `full.diff:72-77` keeps `HexagonLinkComponent` as a raw anchor with duplicated sr-only text, while `full.diff:132` explicitly preserves the raw project-card implementation (`app/pages/index.vue:102-114`).

- **Custom `rel` values can remove `noopener`.** Violates the requirement that every `_blank` link retain `rel="noopener"` and the helper’s “secure fallback” contract. Evidence: `full.diff:20-28` accepts arbitrary `rel`, and `full.diff:41-43` returns any non-empty value unchanged, so `rel="noreferrer"` would omit `noopener`.
tokens used
72 109
- **Two `_blank` links bypass the unique helper.** Violates AC #1–2 and the site-wide helper/audit constraint. Evidence: `full.diff:72-77` keeps `HexagonLinkComponent` as a raw anchor with duplicated sr-only text, while `full.diff:132` explicitly preserves the raw project-card implementation (`app/pages/index.vue:102-114`).

- **Custom `rel` values can remove `noopener`.** Violates the requirement that every `_blank` link retain `rel="noopener"` and the helper’s “secure fallback” contract. Evidence: `full.diff:20-28` accepts arbitrary `rel`, and `full.diff:41-43` returns any non-empty value unchanged, so `rel="noreferrer"` would omit `noopener`.

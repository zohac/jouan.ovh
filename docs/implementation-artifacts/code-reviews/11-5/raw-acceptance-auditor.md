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
session id: 01a09c4d-82e6-7b22-9015-3ff3613f4a2c
--------
user
# Acceptance Auditor Prompt — Story 11.5

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.5), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `docs/implementation-artifacts/deferred-work.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-5/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise le skill `bmad-code-review` pour auditer le diff de façon adversariale contre les critères d’acceptation et les contraintes projet, puis je vérifierai les preuves directement dans les artefacts référencés.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && printf '%s\\n' docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/implementation-artifacts/deferred-work.md docs/implementation-artifacts/code-reviews/11-5/full.diff AGENTS.md | xargs -n1 sh -c 'test -f \""'$0" && wc -l "$0" || echo MISSING:$0'"'" in /Users/simon/dev/jouan.ovh
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
     122 docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md
     789 docs/planning-artifacts/epics.md
     282 docs/project-context.md
      86 docs/specs/spec-home-awwwards/SPEC.md
     160 docs/implementation-artifacts/deferred-work.md
     113 docs/implementation-artifacts/code-reviews/11-5/full.diff
     171 AGENTS.md

exec
/bin/zsh -lc "python3 _bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow; printf '\\n---STEP 01---\\n'; sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md" in /Users/simon/dev/jouan.ovh
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

---STEP 01---
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

2026-09-13T19:45:44.005396Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "sed -n '1,220p' docs/implementation-artifacts/code-reviews/11-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 6a08e8a..794edfe 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -25,14 +25,16 @@
           <div class="about__bio">
             <h2 class="eyebrow">// à propos</h2>
             <p class="prose about__para">
-              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
-              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
-              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
+              Développeur web freelance basé à <strong>Rouen</strong>, je viens d'un parcours technique (métrologie,
+              instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je conçois et développe des
+              applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
+              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
             </p>
             <p class="prose about__para">
-              Je suis aussi fondateur du SaaS
-              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
-              service du code — agents, automatisations, intégrations LLM.
+              Je suis également co-fondateur de la plateforme SaaS
+              <ZExternalLink href="https://keova.app">keova.app</ZExternalLink>, et j'intègre l'automatisation,
+              l'exigence QA et l'IA au service du code — tests automatisés, architecture modulaire et intégrations
+              d'APIs.
             </p>
 
             <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
@@ -100,20 +102,20 @@ import { SITE } from "~/data/site";
 const profile = SITE.profile;
 const skills = SITE.skills;
 
-// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
+// Expériences (de la plus récente à la plus ancienne).
 // `org` sert de clé v-for stable (unique).
 const experiences = [
   {
     date: "02/2021 — aujourd'hui",
-    role: "Testeur QA",
+    role: "Testeur QA & Développeur TypeScript",
     org: "Linkizz",
-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
   },
   {
     date: "05/2020 — 12/2021",
     role: "Développeur Full Stack",
     org: "CINS",
-    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
+    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
   },
   {
     date: "07/2007 — 05/2019",
@@ -132,7 +134,7 @@ const degrees = [
 // Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
 const pageTitle = "À propos — jouan.ovh";
 const pageDescription =
-  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
+  "Développeur web freelance à Rouen, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.";
 
 const siteUrl = useSiteUrl();
 const aboutJsonLd = {
@@ -146,6 +148,12 @@ const aboutJsonLd = {
     jobTitle: SITE.profile.role,
     url: siteUrl,
     image: `${siteUrl}/images/portrait.jpeg`,
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
+      addressCountry: "FR",
+    },
   },
 };
 
diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
index 37ac248..c3c42ba 100644
--- a/docs/implementation-artifacts/deferred-work.md
+++ b/docs/implementation-artifacts/deferred-work.md
@@ -142,10 +142,10 @@ _Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont
 
 ## Deferred from: code review of 11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique (2026-09-13)
 
-- **Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil** (`app/pages/index.vue`) — L'en-tête hero de `index.vue` conserve temporairement l'ancienne accroche et les tags PHP/WordPress jusqu'à son remplacement par JouanOS. → Prévu dans la **Story 11.2** (Séquence de boot interactive JouanOS et hero commercial cinétique).
-- **Marquee de stack moderne ordonnée et mise en avant des 3 services** (`app/pages/index.vue`) — La section des compétences et des services n'affiche pas encore le marquee ni les 3 offres commerciales. → Prévu dans la **Story 11.3** (Marquee de stack moderne et vitrine des 3 services cibles).
-- **Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt** (`app/pages/index.vue`) — Les indicateurs chiffrés, le journal et le lien de conversion Malt ne sont pas encore intégrés sur la home. → Prévu dans la **Story 11.4** (Preuves concrètes SaaS, journal technique et CTA final de conversion).
-- **Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`) — Révision globale du SEO de `about.vue` et des pages secondaires pour refléter la nouvelle position commerciale Full Stack TS. → Prévu dans la **Story 11.5** (Validation transverse a11y multi-pages, SSG Nitro et gate Docker).
+- ~~**Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil**~~ — ✅ **Résolu en 11.2** (`HomeBootOverlay.vue`, `HomeHeroTerminal.vue`, `index.vue`).
+- ~~**Marquee de stack moderne ordonnée et mise en avant des 3 services**~~ — ✅ **Résolu en 11.3** (`HomeStackMarquee.vue`, `index.vue`).
+- ~~**Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt**~~ — ✅ **Résolu en 11.4** (projets SaaS, stats clés, journal, cta final dans `index.vue`).
+- ~~**Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`)~~ — ✅ **Résolu en 11.5** (`about.vue` : bio, rôle Full Stack TS, localisation Rouen, expériences et JSON-LD synchronisés).
 
 ## Deferred from: code review of 11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles (2026-09-13)
 
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index f8ab73d..98b76e7 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.4 done : Preuves SaaS, Journal & CTA final)"
+last_updated: "2026-09-13 (Story 11.5 ready-for-dev : Validation transverse a11y, multi-pages & Gate Docker)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -123,5 +123,5 @@ development_status:
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: done
-  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: ready-for-dev
+  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: review
   epic-11-retrospective: optional

collab: SpawnAgent
collab: SpawnAgent
collab: SpawnAgent
collab: SpawnAgent
2026-09-13T19:45:56.235436Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:45:58.012320Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:45:58.025775Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:45:58.224205Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:45:58.586228Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:46:03.127625Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "printf '%s\\n' '---STORY SPEC---'; sed -n '1,220p' docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md; printf '%s\\n' '---EPIC 11/11.5---'; rg -n -C 8 'Epic 11|Story 11\\.5|11\\.5' docs/planning-artifacts/epics.md; printf '%s\\n' '---PROJECT CONTEXT---'; sed -n '1,320p' docs/project-context.md; printf '%s\\n' '---HOME SPEC---'; sed -n '1,160p' docs/specs/spec-home-awwwards/SPEC.md; printf '%s\\n' '---DEFERRED---'; sed -n '1,220p' docs/implementation-artifacts/deferred-work.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---STORY SPEC---
---
baseline_commit: 5dc54f741c8ed022fb916686abf6ba4c8d95b271
---

# Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur du site et garant de la qualité logicielle,
I want valider l'accessibilité globale, l'intégrité de la navigation multi-pages, la cohérence SEO du repositionnement Full Stack TS et la conformité du build statique Nitro SSG,
so that la refonte de la page d'accueil soit irréprochable, exempte de régressions et prête pour le déploiement en production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).

## Acceptance Criteria

1. **Given** la page d'accueil intégrant l'ensemble des modules des stories 11.1 à 11.4 (atmosphère cinétique, séquence de boot `jouan.os`, hero commercial, terminal hero, marquee infini, vitrine 3 services, projets SaaS, statistiques de réassurance, journal technique et CTA final de conversion)
   **When** on exécute l'audit complet d'accessibilité sous émulation (`forced-colors: active`, `prefers-reduced-motion: reduce`, navigation au clavier et lecteur d'écran)
   **Then** tous les éléments interactifs (boutons, liens internes, `<ZExternalLink>`, lignes projets, cartes services/journal) conservent un focus visible sans rupture sous contraste forcé (`outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`)
   **And** aucun focus trap n'existe et le cycle de tabulation (`Tab` / `Shift+Tab`) suit un ordre logique strict
   **And** sous `prefers-reduced-motion: reduce`, les animations (auroras, marquee, décalages au hover) sont neutralisées à l'instantané, le boot overlay est court-circuité ou figé, et le caret de frappe du terminal hero est la **seule animation en boucle autorisée** (CAP-11).

2. **Given** l'architecture multi-pages Nuxt 4 (`app/pages/`)
   **When** le visiteur interagit avec les différents points de navigation de la page d'accueil (header, vitrine services, CTA hero, journal, CTA final, footer)
   **Then** aucun lien avec ancre intra-page `#` n'est présent sur le site (neutralisation totale des reliquats de la maquette one-page brute)
   **And** les routes cibles `/services`, `/about`, `/blog`, `/contact`, `/confidentialite` et `/mentions-legales` restent des pages autonomes, fonctionnelles et pré-rendues statiquement
   **And** tout lien ouvrant un nouvel onglet externe (Keova, profil Malt, GitHub, etc.) consomme obligatoirement la primitive accessible `<ZExternalLink>` avec mention masquée sr-only `(ouvre dans un nouvel onglet)`.

3. **Given** le repositionnement commercial Full Stack TypeScript — Nuxt / NestJS opéré dans `SITE.profile` et sur la page d'accueil
   **When** on audite la cohérence éditoriale et SEO de la page secondaire `app/pages/about.vue`
   **Then** la biographie, la description de la page et les expériences récentes sont alignées avec le nouveau positionnement (rôle Full Stack TS, SaaS Keova, Rouen / missions freelance), supprimant les mentions obsolètes orientées PHP/WordPress legacy
   **And** les balises `usePageSeo` et Schema.org `aboutJsonLd` reflètent fidèlement ce profil unifié
   **And** l'item différé de la story 11.1 dans `docs/implementation-artifacts/deferred-work.md` est marqué soldé.

4. **Given** la chaîne de build statique Nitro et les standards de code
   **When** on exécute la gate de validation Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc, et 13 routes statiques générées avec succès par Nitro.

## Tasks / Subtasks

- [x] Tâche 1 — Audit complet d'accessibilité sous émulation (AC: 1)
  - [x] Émuler le contraste forcé (`forced-colors: active` via Chrome DevTools Rendering ou OS) : parcourir la page d'accueil et les pages enfants au clavier (`Tab`), vérifier la visibilité du focus sur chaque élément interactif (boutons, `<ZExternalLink>`, liens du marquee, lignes projets, cartes de services et journal).
  - [x] Émuler le motion réduit (`prefers-reduced-motion: reduce`) : vérifier que les auroras CSS sont immobiles, que le marquee `HomeStackMarquee.vue` est figé sans débordement horizontal, que le boot overlay `HomeBootOverlay.vue` ne lance pas d'animation intrusive, que les survols de cartes ne bougent pas, et que seul le caret du terminal clignote (CAP-11).
  - [x] Vérifier la navigation clavier : absence de piège au focus (focus trap), ordre séquentiel logique, et fonctionnement de la touche Escape sur le terminal et l'overlay de boot.

- [x] Tâche 2 — Audit des liens et conformité de l'architecture multi-pages (AC: 2)
  - [x] Vérifier qu'aucun lien avec ancre `#` (comme `#work`, `#contact`, `#journal`) n'est présent sur la home ou dans le layout partagé.
  - [x] Valider que toutes les routes enfants (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) sont joignables et rendent correctement leur contenu.
  - [x] Auditer tous les liens sortants : s'assurer de l'utilisation stricte de `<ZExternalLink>` pour Keova, Malt, GitHub, etc., avec annonce sr-only `(ouvre dans un nouvel onglet)`.

- [x] Tâche 3 — Harmonisation éditoriale et SEO de la page À-propos (`about.vue`) (AC: 3)
  - [x] Mettre à jour la biographie et le paragraphe de présentation dans `app/pages/about.vue` pour valoriser l'ingénierie logicielle Full Stack TypeScript (Vue 3 / Nuxt 4, NestJS, PostgreSQL, architecture SaaS).
  - [x] Aligner `pageDescription`, `pageTitle` et le graphe JSON-LD `aboutJsonLd` avec le rôle officiel et la ville (« Rouen, France »).
  - [x] Mettre à jour `docs/implementation-artifacts/deferred-work.md` pour marquer comme soldé le point différé de la story 11.1.

- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
  - [x] Exécuter la commande de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Vérifier que les 13 routes statiques sont pré-rendues sans erreur ni avertissement par Nitro.
  - [x] Consigner les résultats de l'audit dans le journal de réalisation de la story.

## Dev Notes

### Architecture & Contraintes d'environnement
- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker via `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
- **Tokens CSS & Design System :** Aucune couleur, espacement ou dimension en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--token)`). [Source: AGENTS.md#Section 3]
- **Langue, Voix & Zéro Emoji :** Rédiger en français, vouvoiement pour le visiteur, 1re personne pour Simon, **zéro emoji** dans le contenu textuel et l'interface utilisateur. [Source: AGENTS.md#Section 1]
- **Accessibilité (a11y) dès la conception :**
  - Repli `forced-colors` universel : `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible`.
  - Motion réduit : Seul le caret de frappe du terminal est autorisé à clignoter sous `prefers-reduced-motion: reduce` (CAP-11).
  - `<ZExternalLink>` obligatoire pour tout lien ouvrant un nouvel onglet (`target="_blank"`).
  - Listes sémantiques `<ul>` ou `<ol>` avec `<li>` pour toute répétition de cartes ou items.
- **SSG & Prerender Safety :** Le site étant statique, tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) doit être encapsulé dans `onMounted()` ou sous `import.meta.client`.

### Fichiers concernés (lus — baseline `5dc54f7`)
- **`app/pages/about.vue`** (UPDATE) : Harmonisation de la bio, des métadonnées SEO et du JSON-LD pour refléter le positionnement Full Stack TypeScript et Rouen.
- **`app/pages/index.vue`** (VERIFICATION) : Audit a11y, vérification de l'absence totale d'ancres `#`, et contrôle des états interactifs.
- **`app/components/home/HomeStackMarquee.vue`** (VERIFICATION) : Contrôle du comportement du marquee sous reduced-motion et pause au survol.
- **`app/components/home/HomeBootOverlay.vue`** (VERIFICATION) : Contrôle de la fermeture au clavier (Escape) et du comportement reduced-motion.
- **`docs/implementation-artifacts/deferred-work.md`** (UPDATE) : Clôture de l'item différé de la story 11.1.
- **`docs/implementation-artifacts/sprint-status.yaml`** (UPDATE) : Suivi du statut de sprint.

### Pièges / régressions à éviter
- **Ne pas introduire de fausse One-Page :** La home est un portail vitrine commercial ; les liens du header et des cartes de services mènent vers les vraies routes multi-pages `/services`, `/about`, etc. Ne pas restaurer les ancres `#` issues du prototype `Home - Awwwards.html`.
- **Ne pas casser le caret clignotant :** Le caret natif du terminal hero est l'unique animation en boucle explicitement autorisée sous `prefers-reduced-motion: reduce`. Ne pas l'éteindre.
- **Pas de framework de test non installé :** Le projet n'embarque pas Vitest ou Cypress dans ses dépendances actuelles. La barre de conformité logicielle s'appuie sur ESLint, Stylelint, vue-tsc, le prerender Nitro 13 routes et l'audit émulé OS-level.

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash (Low)

### Debug Log References
- Gate Docker initiale a relevé un léger ajustement Prettier dans `app/pages/about.vue` qui a été résolu via eslint.
- Gate finale 100% verte : 0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 13 routes statiques Nitro pré-rendues en 2.84s.

### Completion Notes List
- Audit a11y émulé vérifié : repli `forced-colors: active` universel (`outline: 2px solid transparent; outline-offset: 2px;`), respect de `prefers-reduced-motion: reduce` sur les auroras, le marquee dédoublé, l'overlay de boot et les transitions, caret de frappe du terminal hero préservé comme unique animation en boucle autorisée (CAP-11).
- Navigation multi-pages auditée : aucune ancre interne `#` résiduelle sur la home, intégrité des routes `/services`, `/about`, `/blog`, `/contact`, `/confidentialite` et `/mentions-legales`, utilisation systématique de `<ZExternalLink>` pour tous les liens externes (`target="_blank"`).
- Harmonisation éditoriale et SEO de `app/pages/about.vue` réalisée : bio et rôle alignés sur Full Stack TypeScript, SaaS Keova, Rouen, expériences Linkizz/CINS ajustées, schéma Schema.org `aboutJsonLd` et `usePageSeo` unifiés.
- Item différé de la story 11.1 soldé dans `docs/implementation-artifacts/deferred-work.md`.
- Gate Docker 100% verte validée (`corepack enable && pnpm lint && pnpm typecheck && pnpm generate`).

### File List
- `app/pages/about.vue` (MODIFIED)
- `docs/implementation-artifacts/deferred-work.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation et validation complète de la Story 11.5 (Harmonisation About.vue, soldage des différés 11.1, audit a11y & liens, Gate Docker verte). Statut passé à review.
- 2026-09-13 : Création de la spécification de la Story 11.5 (Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker). Statut initialisé à ready-for-dev.

## References

- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
- [Cahier des charges Epic 11 : docs/planning-artifacts/epics.md#Story 11.5]
- [Directives globales pour agents : AGENTS.md]
- [Contexte projet & leçons apprises : docs/project-context.md]
- [Travaux différés : docs/implementation-artifacts/deferred-work.md]
- [Référence de validation précédente : docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md]
---EPIC 11/11.5---
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
55-FR23: Section de preuves concrètes exposant Keova (lien live `<ZExternalLink>`), TryOn (étude de cas technique MVP livré sans lien externe mort), Nodium (lab R&D en cours), et les 3 compteurs statistiques clés de parcours. _(CAP-6)_
56-FR24: Section journal présentant les derniers articles du blog avec lien d'approfondissement vers `/blog`. _(CAP-7)_
57-FR25: Bloc CTA final de conversion orienté mission (« Discuter de votre projet » vers `/contact`, bouton vers profil Malt, lien vers `/about`). _(CAP-8)_
--
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
188-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
189-**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
190-
191----
192-
193-## Epic 1: Migration de la stack vers Nuxt 4
194-
195-Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
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
708-Le visiteur arrivant sur la page d'accueil de `jouan.ovh` découvre une vitrine immersive haute performance (« Awwwards level ») et comprend instantanément le positionnement de Simon Jouan comme Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL) pour applications web et SaaS, appuyé par des preuves concrètes de réalisations (Keova en production, TryOn en étude de cas, Nodium en lab R&D), une réassurance chiffrée (11 ans d'expérience, culture qualité logicielle), et des points de contact directs (formulaire et profil Malt) sans altérer l'architecture multi-pages existante.
709-
710-### Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
711-
712-As a visiteur découvrant la page d'accueil,
713-I want percevoir un arrière-plan immersif atmosphérique (auroras, grille, scanlines) et un micro-curseur interactif sur ordinateur de bureau,
714-So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
--
769-  - **Keova App** avec statut `● En production`, rôle Co-fondateur & Full Stack, stack (Nuxt 4 / NestJS / PostgreSQL / Stripe Connect) et lien direct accessible via `<ZExternalLink href="https://keova.app">`
770-  - **TryOn** avec statut `○ Étude de cas (MVP livré)` valorisant l'ingénierie SaaS & IA générative, **sans lien externe mort 404** (renvoi vers description détaillée/Malt)
771-  - **Nodium** avec statut `◐ R&D / En cours` valorisant le laboratoire d'agents IA desktop
772-**And** les 3 compteurs statistiques clés sont affichés (11 ans d'expérience, SaaS opérés, culture qualité & automatisation)
773-**And** la section journal présente les articles récents du blog avec lien vers `/blog`
774-**And** le bloc CTA final de conversion propose un bouton primaire vers `/contact` (« Discuter de votre projet »), un bouton externe direct vers le profil Malt (`<ZExternalLink href="https://www.malt.fr/profile/simonjouan">`) et un lien vers `/about`
775-**And** gate Docker verte (`pnpm lint`, `pnpm typecheck`, `pnpm generate`)
776-
777:### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker
778-
779-As a mainteneur du site et garant de la qualité logicielle,
780-I want valider l'accessibilité globale, l'absence de régression multi-pages et la conformité du build statique,
781-So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).
782-
783-**Acceptance Criteria:**
784-
785-**Given** la home refondue intégrant l'ensemble des composants des stories 11.1 à 11.4
---PROJECT CONTEXT---
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
---HOME SPEC---
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
---DEFERRED---
# Deferred work

_Travaux réels mais reportés, remontés par les revues de code. À reprendre dans la story/epic indiquée._

---

## 📋 Inventaire consolidé (synthèse — maj rétro Epic 9, 2026-06-29)

_Vue d'ensemble par destination. Le détail par story est conservé dans les sections chronologiques ci-dessous. Aucune dette technique laissée dans les épics (chaque story a soldé ses findings) ; ce sont des **généralisations DS-wide / d'architecture** délibérément regroupées pour être traitées en un seul passage._

> **Décision rétro Epic 9 (2026-06-29) :** les épics 1→9 sont `done`, **mais la refonte n'est pas livrée**. Tout le reste (a11y résiduel non couvert par 9.1/9.2, SEO, RGPD, déploiement, audit a11y émulé) est **consolidé dans un futur Epic 10 « fin de refonte »** — épic à écrire (handoff `bmad` planification). Epic 9 se clôt tel quel.

### ✅ Soldé en Epic 9

- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
- ~~**Contraste — `--text-faint` sous AA**~~ — ✅ **Résolu (story 9.2)** : 4 textes informatifs réels remontés à `--text-muted` (token-only).
- ~~**Clavier — Échap + retour de focus terminal**~~ — ✅ **Résolu (story 9.2)**.

### → Epic 10 — Fin de refonte (épic à écrire ; décision rétro Epic 9)

**A11y résiduel (non couvert par les AC de 9.1/9.2) :**

1. ~~**Généralisation de la convention a11y titres + listes**~~ — ✅ **Résolu en 10.2**
2. ~~**Audit site-wide des liens `target="_blank"`**~~ — ✅ **Résolu en 10.3**
3. ~~**Sémantique a11y de la colonne `/contact`**~~ — ✅ **Résolu en 10.2**
4. ~~**Audit a11y émulé OS-level**~~ — ✅ **Résolu (story 10.4)** : validation runtime `forced-colors: active` et `prefers-reduced-motion: reduce` + parcours lecteur d'écran VoiceOver. _(revues 9.1, 9.2, 10.4)_
5. ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu (story 10.4)** : bloc page-level `@media` d'`index.vue` rabattu sur le repli inline standard DS `outline: 2px solid transparent; outline-offset: 2px;`. 100% des focusables unifiés. _(revues 9.1, 10.4)_

**SEO :**

6. **Centralisation SEO site-wide** — la **dette concrète est soldée** (6.2) : `SITE_URL` unique dans `app/utils/seo.ts` (dédup `/about`+`/blog`+article), JSON-LD via `jsonLdScript()` qui échappe `</script>`. ✅ **`SITE_URL` sourcé depuis `runtimeConfig` fait en 10.1** (`runtimeConfig.public.siteUrl` + composable `useSiteUrl()`, surchargeable `NUXT_PUBLIC_SITE_URL`). **Reste** (architecture, non-dette) : migrer vers `useSeoMeta`/`app.head` partagé, ajouter `publisher`/`Organization` (ou `nuxt-schema-org`), et étendre OG/JSON-LD aux pages encore nues (home, services, contact). → **story 10.5**. _(revues 5.1, 6.1, 6.2)_
7. ~~**Domaine de production**~~ — ✅ **Résolu en 10.7** : DNS OVH configuré (`jouan.ovh` → 4 IPs GitHub Pages, `www` → CNAME), `public/CNAME` = `jouan.ovh`, `nuxt.config.ts` `siteUrl` = `https://jouan.ovh`, CI guard `Verify static output` aligné sur `jouan.ovh`, HTTPS actif et forcé sur GitHub Pages.

**Légal / RGPD :**

8. ~~**Politique de confidentialité (RGPD)**~~ — ✅ **Résolu en 10.6** : pages `/confidentialite` et `/mentions-legales` créées et liées depuis le footer et le formulaire, avec mention de Web3Forms, des droits RGPD et de l'hébergement.

**Déploiement :**

9. ~~**Déploiement gh-pages réel**~~ — ✅ **Résolu en 10.7** : premier merge sur `main` et déploiement réel `gh-pages` exécuté et validé. Site servi en production avec HTTPS sur `https://jouan.ovh`.

---

## Deferred from: code review of 9-2-motion-reduit-contraste-et-clavier (2026-06-29)

- **Placeholder `ZInput` ~3.7:1 sur `--bg-input` (< 4.5:1 AA)** — résidu conscient : `--text-muted` (relevé de `--text-faint` ~2.2:1) reste sous AA sur la surface la plus claire, mais le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter encore le ferait passer pour une saisie. Acceptable tel quel ; à revoir si un token de placeholder dédié ≥ 4.5:1 est introduit. _(revue 9.2)_
- ~~**Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)**~~ — ✅ **Résolu en 10.4** : validation runtime complète effectuée sous émulation navigateur & VoiceOver. _(revues 9.2, 10.4)_

## Deferred from: code review of 9-1-etats-interactifs-coherents (2026-06-29)

- ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu en 10.4** : repli inline `outline: 2px solid transparent; outline-offset: 2px;` généralisé à `index.vue`, suppression du bloc `@media` local. _(revues 9.1, 10.4)_
- ~~**Émulation `forced-colors: active` non rejouée**~~ — ✅ **Résolu en 10.4** : vérification runtime sous contraste forcé émulé sur l'ensemble des routes. _(revues 9.1, 10.4)_

## Deferred from: code review of 7-2-infos-cta-terminal-et-socials (2026-06-26)

- **a11y sémantique de la colonne droite `/contact`** — la carte infos rend les paires label/valeur en `<div>` (pas de `<dl>/<dt>/<dd>`), le préfixe `//` est lu « slash slash », pas de titre de section, et le CTA terminal n'a pas `aria-haspopup="dialog"`. Fidèle au kit, non bloquant. À reprendre dans le **lot a11y Epic 9** (item 2 consolidé : sémantique titres/listes/régions). _(La ligne de prompt décorative a été traitée en patch 7.2 — `aria-hidden`.)_
- ~~**DRY — données de contact inline**~~ — ✅ **Résolu en 8.2** : `contact.email`/`city` (`/contact`) et `profile.email`/`city` (`/about`) consomment désormais la source unique `app/data/site.ts` (`SITE.profile`). _(La consolidation `SITE_URL` SEO reste un sujet distinct, item 4.)_

## Deferred from: code review of 7-1-route-contact-et-formulaire (2026-06-26)

- **SEO `/contact`** — `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD), comme `/services`. Déjà couvert par l'**item 4 consolidé** (« étendre OG/JSON-LD aux pages encore nues : home, services, **contact** »). → story SEO dédiée / Epic 9. _(Les 2 autres findings 7.1 — focus a11y à l'envoi, erreurs collantes — sont des **patchs** de la story, pas des différés ; cf. Review Findings du ticket.)_
- ~~**Clé d'accès Web3Forms à provisionner**~~ — ✅ **OK** (Simon, 2026-06-26) : clé créée et renseignée dans l'env `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. L'envoi réel du formulaire `/contact` est opérationnel.
- **Politique de confidentialité (RGPD)** — le formulaire collecte nom/email/message transmis à un tiers (Web3Forms) ; une **notice courte est posée sous le formulaire**. Reste à publier une **page « politique de confidentialité »** dédiée (base légale, finalité, durée, sous-traitant Web3Forms, droits) et à la lier — cf. skill `rgpd-france`. → tâche légale de fin de refonte (hors périmètre 7.1/7.2).

## Deferred from: code review of 6-2-vue-article-prose-et-code (2026-06-25)

- **Centralisation SEO site-wide (consolidation)** — _Dette concrète résolue en 6.2_ : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, dédup `/about`+`/blog`+`/blog/[...slug]`) ; JSON-LD via helper `jsonLdScript()` qui **échappe `<`** (plus de risque `</script>`). _Reste_ (architecture, non-dette) : migration `useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization` (ou `nuxt-schema-org`). → story SEO dédiée / Epic 9.
- ~~**a11y dates blog + flèche retour**~~ — ✅ **Résolu** : dates en `<time :datetime>` (article + index) ; `←` du lien retour en `<span aria-hidden="true">`. _Reste_ la généralisation a11y (eyebrow→titre + listes home/services) → Epic 9.

## Deferred from: code review of 6-1-index-du-blog-et-empty-state (2026-06-23)

- ~~**SEO `/blog`**~~ — ✅ **Résolu sur `/blog`** (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` ajoutés au `useHead`, vérifiés dans le HTML prerendu. _Reste_ la **centralisation SEO site-wide** (autres pages que `/about` + `/blog`, via `useSeoMeta` partagé / `app.head`) — Epic 9.
- ~~**Sémantique liste du feed d'articles**~~ — ✅ **Résolu** : feed en `<ul class="blog__list">` + `<li>` par article (reset de liste, rendu identique). _Reste_ la **généralisation a11y** (eyebrow→titre + listes home/services) — Epic 9.

## Deferred from: code review of 5-2-timeline-formation-et-stack (2026-06-23)

- ~~**Sémantique a11y des sections CV de `/about`**~~ — ✅ **Résolu sur `/about`** (décision Simon : zéro dette) : libellés de section en `<h2 class="eyebrow">` (outline `h1 → h2×4`), expériences en `<ol>/<li>`, formation et stack en `<ul>/<li>` ; rendu visuel identique (h2 neutralisé `font-weight`/`line-height`, listes `list-style:none` + marges reset). `<time datetime>` écarté (dates = plages, pas de valeur machine). _Reste à généraliser_ la convention (eyebrow→titre + listes) à **home / services**, en lot avec les items a11y ci-dessous (process `<ol>` 4.2, liens `_blank` 3.3) — **passage a11y d'Epic 9**.

## Deferred from: code review of 5-1-portrait-et-bio (2026-06-23)

_Décision Simon : zéro dette technique → les 3 items ci-dessous ont été traités immédiatement (commit de correctifs de revue), pas reportés._

- ~~**Duplication inter-pages des primitives de layout**~~ — ✅ **Résolu** : primitives `.section` / `.section--sunken` / `.container` / `.eyebrow` / `.prose` extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications scoped retirées de `index.vue`, `services.vue`, `about.vue`. Vérif visuelle desktop des 3 pages : aucune régression.
- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.

## Deferred from: code review of 4-2-section-process (2026-06-22)

- **Sémantique `<ol>` pour la séquence du process (`/services`)** — Les 4 étapes ordonnées sont rendues en grille de `<div>` (numéros « 01 »…« 04 » en texte). Fidèle à `Services.jsx` et l'ordre est déjà annoncé aux lecteurs d'écran (AC satisfait, non bloquant). Amélioration : passer en `<ol>`/`<li>` avec les numéros `aria-hidden` (ordre porté par la liste). Décision Simon : accepté tel quel pour 4.2, amélioration différée au passage a11y d'Epic 9.

## Deferred from: code review of 3-3-projets-selectionnes (2026-06-22)

- **Audit site-wide des liens `target="_blank"` sans indication « nouvel onglet »** — _Les cartes projet de `/` ont été traitées localement (span sr-only « (ouvre dans un nouvel onglet) ») lors du fix 3.3._ Reste à auditer/uniformiser les **autres** liens `_blank` du site (hexagones sociaux du header/footer, etc.) et idéalement à factoriser un helper de lien externe (icône + libellé sr-only). Recommandation WCAG G201. À traiter dans le passage a11y d'Epic 9.

## Deferred from: code review of 3-2-apercu-services-et-stats (2026-06-22)

- ~~`role="img" title=""` résiduel sur le wrapper racine `.init`~~ — ✅ **Résolu** lors du fix 3.2 (commit `132093d`) : attribut retiré de `app/layouts/default.vue`.
- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).

## Deferred from: code review of 8-1-style-terminalwindow-et-prompt (2026-06-26)

_Décision Simon : zéro dette technique → l'item ci-dessous a été traité dans la story 8.1 (non reporté en 8.3)._

- ~~**CSS mort `.command-prefix` / `.git-prompt-branch` dans `TerminalComponent.vue`**~~ — ✅ **Résolu en 8.1** : classes mortes confirmées par `grep` (aucun usage dans le `<template>` ni dans `programs/`) et **supprimées**. Plus de nettoyage à reporter en 8.3.

## Deferred from: code review of 8-2-preserver-les-commandes-et-louverture (2026-06-26)

_Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont été traités dans la story 8.2, pas reportés._

- ~~**DRY — données dupliquées en dur dans les programmes terminal**~~ — ✅ **Résolu en 8.2** : **source de vérité unique `app/data/site.ts`** (`SITE.profile`/`skills`/`projects`, typée `IProfile`/`IProject`). Tous les consommateurs branchés — `Skills/Projets/Contact/About.ts` (terminal), `index.vue`, `about.vue`, `contact.vue`, `FooterComponent.vue` — rendu **identique** vérifié au navigateur. **Solde aussi** l'item « données de contact inline » de la revue 7.2 (ci-dessus). _Reste, hors-scope DRY_ : les `experiences`/`degrees` divergent de **contenu** entre le CV terminal (`About.ts`, 4 xp / 3 diplômes détaillés) et `/about` (3 xp / 2 diplômes condensés) — leur unification est une **décision de contenu** (choisir la version canonique + adapter l'affichage), à trancher en passage CV dédié, pas un refactor mécanique.
- ~~**Duplication du bookkeeping d'historique dans la branche `clear`**~~ — ✅ **Résolu en 8.2** : helper `recordHistoryAndResetInput()` partagé entre la branche `clear` et le flux normal de `submitInput`. Plus de report en 8.3.

## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-07-02)

- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_

## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-09-12)

- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.

## Deferred from: code review of 10-2-a11y-semantique-residuelle (2026-09-13)

- **Rôle dialog et accessibilité interne de la fenêtre terminal** — Les déclencheurs du terminal (`contact.vue`, `index.vue`) portent désormais `aria-haspopup="dialog"`, mais la fenêtre elle-même (`WindowWrapperComponent.vue`) ne porte pas encore de `role="dialog"`, `aria-modal="true"`, ni de piège de focus. Composant hérité Options API propre au header (hors périmètre 10.2). À traiter lors d'une refonte / consolidation a11y du terminal ou en story 10.4. _(revue 10.2 — Blind + Edge Case Hunter)_

## Deferred from: code review of 10-4-validation-a11y-emulee-et-unification-forced-colors (2026-09-13)

- **Terminal input `.user-input` sans outline de focus en contraste forcé** (`TerminalComponent.vue:461`) — CLI terminal avec caret natif coloré (`caret-color`, `caret-shape: block`). En mode contraste forcé, le caret natif sert d'indicateur de focus sans ring de focus extérieur. Préexistant (Epic 8).
- **`ZInput` utilise `&:focus` plutôt que `:focus-visible`** (`ZInput.vue:173`) — Stylage du focus appliqué au focus natif des formulaires plutôt qu'exclusivement au clavier. Préexistant (Epic 2).
- **Terminal resize handle manipulable uniquement à la souris** (`TerminalComponent.vue:320`) — `<div>` de redimensionnement de fenêtre avec drag à la souris, sans contrôle clavier équivalent. Préexistant (Epic 8).
- **Accessibilité interne de la fenêtre terminal (rôle dialog / focus trap)** (`TerminalComponent.vue:1`) — Fenêtre terminal interactive sans `role="dialog"`, nom accessible ou confinement de focus (déjà tracé en revue 10.2). Préexistant (Epic 8).
- **Honeypot input sous `aria-hidden="true"`** (`contact.vue:178`) — Champ antispam masqué visuellement et aux technologies d'assistance. Préexistant (Epic 7).

## Deferred from: code review of 10-5-seo-centralise-site-wide (2026-09-13)

- **Prix numériques et devise structurée (`priceCurrency`) pour les offres dans Schema.org** (`app/pages/services.vue:141-147`) — Les prestations exposent des libellés UI de présentation (« à partir de 1 500 € », « sur devis »). Une formalisation stricte sous forme de grille tarifaire machine-readable Schema.org (`priceCurrency: 'EUR'`, `price: 1500`) relève d'une décision de contenu/commerciale sur la formalisation tarifaire.

## Deferred from: code review of 10-6-conformite-legale-rgpd-mentions (2026-09-13)

- **Mutualisation des styles partagés `.legal__*`** (`app/pages/confidentialite.vue`, `app/pages/mentions-legales.vue`) — Les deux pages dupliquent actuellement leur bloc `<style scoped>` `.legal__*`. Préexistant/standard pour des pages Vue distinctes ; factorisable dans un partiel SCSS si d'autres pages légales devaient être créées.
- **Domaine canonique staging par défaut en build local (`dev.jouan.ovh`)** (`nuxt.config.ts:59`) — Dépend de la story 10.7 (Mise en production réelle, FR17 : bascule de `SITE_URL` vers `https://jouan.ovh` et domaine de production). Déjà tracé et planifié en story 10.7.

## Deferred from: code review of 11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique (2026-09-13)

- ~~**Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil**~~ — ✅ **Résolu en 11.2** (`HomeBootOverlay.vue`, `HomeHeroTerminal.vue`, `index.vue`).
- ~~**Marquee de stack moderne ordonnée et mise en avant des 3 services**~~ — ✅ **Résolu en 11.3** (`HomeStackMarquee.vue`, `index.vue`).
- ~~**Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt**~~ — ✅ **Résolu en 11.4** (projets SaaS, stats clés, journal, cta final dans `index.vue`).
- ~~**Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`)~~ — ✅ **Résolu en 11.5** (`about.vue` : bio, rôle Full Stack TS, localisation Rouen, expériences et JSON-LD synchronisés).

## Deferred from: code review of 11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles (2026-09-13)

- **Aligner le catalogue de la page dédiée `/services` et ses métadonnées SEO/JSON-LD avec les 3 nouvelles offres de l'accueil** (`app/pages/services.vue`) — La page `/services` actuelle présente toujours le catalogue historique (WordPress, applications, IA) et les descriptions associées. La refonte complète de `/services` pour calquer les 3 offres SaaS Full Stack TS relève d'une future story d'évolution de la page services.
- **Couverture automatisée par tests E2E / visuels de la boucle continue du marquee** (`app/components/home/HomeStackMarquee.vue`) — Validation automatisée du défilement, du `:hover` et de l'arrêt sous reduced-motion. Prévu dans la validation transverse de la **Story 11.5**.

## Deferred from: code review of 11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion (2026-09-13)

- **Différenciation éditoriale d'une carte vedette dans le journal (CAP-7)** (`app/pages/index.vue:150`) — La spécification CAP-7 envisageait une carte vedette et des vignettes secondaires. L'AC3 de la story 11.4 a implémenté une grille uniforme élégante à 3 cartes conforme à la maquette `Home - Awwwards.html`. La hiérarchisation avancée (première carte mise en avant) pourra être reprise lors de l'enrichissement éditorial du blog.




2026-09-13T19:46:03.223069Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
exec
/bin/zsh -lc "rg -n 'Story 11\\.5|Validation transverse|AC1|AC2|AC3|AC4|CAP-11|NFR10|NFR11|NFR12' docs/planning-artifacts/epics.md | tail -40; printf '\\n---EPICS TARGET---\\n'; sed -n '360,520p' docs/planning-artifacts/epics.md; printf '\\n---CONTEXT FULL---\\n'; sed -n '1,320p' docs/project-context.md; printf '\\n---HOME SPEC FULL---\\n'; sed -n '1,160p' docs/specs/spec-home-awwwards/SPEC.md; printf '\\n---DIFF FULL---\\n'; nl -ba docs/implementation-artifacts/code-reviews/11-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
41:FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
72:NFR10: Isolement Git — le développement de l'Epic 11 s'exécute sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
73:NFR11: Alignement commercial & Malt strict — aucun élément de WordPress, PHP legacy ou QA manuelle en offre de premier niveau sur la home ; harmonisation intégrale avec `docs/contexte_malt.md` et `docs/direction_strategique_site.md`.
74:NFR12: Fiabilité des liens et accessibilité — zéro lien externe mort (TryOn sans lien 404), balisage systématique de tout lien externe via `<ZExternalLink>`, et respect des standards a11y (titres, listes, contrastes, motion réduit).
189:**FRs covered:** FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27 _(NFR10, NFR11, NFR12, UX-DR18 à UX-DR25)_
714:So that j'entre immédiatement dans l'univers technique haut de gamme du site sans gêne de performance ou de lisibilité (FR18, FR27, NFR10, NFR11, UX-DR18, UX-DR25).
762:So that je suis convaincu par des preuves concrètes de conception applicative et engagé à initier une collaboration via le formulaire ou Malt (FR23, FR24, FR25, NFR12, UX-DR23, UX-DR24).
777:### Story 11.5: Validation transverse a11y, multi-pages, SSG Nitro & Gate Docker
781:So that la refonte de la home est irréprochable et prête pour la production (CAP-1 à CAP-10, NFR10, NFR11, NFR12).

---EPICS TARGET---

Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets.

### Story 3.1: Hero Terminal (A)

As a visiteur,
I want un hero d'accueil en style terminal,
So that je perçois immédiatement l'identité de marque (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** la direction de hero Terminal (A) de `Home.jsx`
**When** on implémente le hero sur `/`
**Then** le hero rend en style terminal (prompt, caret, accroche française 1re personne)
**And** un CTA principal mène à un parcours clé (ex. contact/about)

### Story 3.2: Aperçu services et stats

As a visiteur,
I want voir un aperçu des services et des chiffres clés,
So that je comprends rapidement l'offre (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** le contenu `data.js` (services, stats)
**When** on implémente les blocs aperçu services + stats sur `/`
**Then** les 3 services et les stats rendent conformément à `Home.jsx`
**And** un lien mène à la page Services

### Story 3.3: Projets sélectionnés

As a visiteur,
I want voir des projets sélectionnés,
So that j'évalue le travail de Simon (UX-DR12, FR5).

**Acceptance Criteria:**

**Given** le contenu projets de `data.js`
**When** on implémente le bloc projets sur `/` avec `ZCard`
**Then** les projets sélectionnés rendent en cartes conformes au DS

---

## Epic 4: Page Services

Le visiteur comprend les trois offres et le process (route `/services`).

### Story 4.1: Route /services et cartes d'offre

As a visiteur,
I want une page Services avec les trois offres,
So that je comprends ce que Simon propose (UX-DR13, FR6).

**Acceptance Criteria:**

**Given** la référence `Services.jsx` et le contenu `data.js`
**When** on crée la route `/services` avec 3 cartes (WordPress / Applications web / IA)
**Then** les 3 offres rendent conformément à la référence
**And** la route est accessible depuis la nav

### Story 4.2: Section process

As a visiteur,
I want voir les étapes du process,
So that je sais comment se déroule une collaboration (UX-DR13, FR6).

**Acceptance Criteria:**

**Given** les étapes du process dans `Services.jsx`/`data.js`
**When** on implémente la section process sur `/services`
**Then** les étapes rendent dans l'ordre conformément à la référence

---

## Epic 5: Page À-propos

Le visiteur découvre le parcours de Simon.

### Story 5.1: Portrait et bio

As a visiteur,
I want voir le portrait et la bio de Simon,
So that je connais la personne derrière le travail (UX-DR14, FR7).

**Acceptance Criteria:**

**Given** la référence `About.jsx`, le portrait et le contenu `data.js`
**When** on refond `/about` avec portrait + bio
**Then** la section rend conformément à la référence, en français 1re personne

### Story 5.2: Timeline, formation et stack

As a visiteur,
I want voir l'expérience, la formation et la stack technique,
So that j'évalue les compétences de Simon (UX-DR14, FR7).

**Acceptance Criteria:**

**Given** le contenu CV de `data.js`
**When** on implémente la timeline d'expérience, la formation et la stack sur `/about`
**Then** les trois sections rendent conformément à la référence
**And** la stack utilise des `ZTag`/`ZBadge`

---

## Epic 6: Blog

Le visiteur lit les articles (index + article).

### Story 6.1: Index du blog et empty-state

As a visiteur,
I want une liste d'articles soignée,
So that je trouve du contenu à lire (UX-DR15, FR8).

**Acceptance Criteria:**

**Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`
**When** on crée le dossier `content/` et on refond `/blog` (index + empty-state)
**Then** la liste rend en cartes conformes au DS
**And** l'empty-state français soigné s'affiche quand il n'y a aucun article

### Story 6.2: Vue article (prose + code)

As a visiteur,
I want lire un article avec une mise en forme lisible,
So that le contenu prose et code est agréable (UX-DR15, FR8).

**Acceptance Criteria:**

**Given** un article markdown dans `content/`
**When** on refond `/blog/[...slug]`
**Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS

---

## Epic 7: Page Contact

Le visiteur peut contacter Simon (route `/contact`).

### Story 7.1: Route /contact et formulaire

As a visiteur,
I want un formulaire de contact,
So that je peux écrire à Simon (UX-DR16, FR9).

**Acceptance Criteria:**

**Given** la référence `Contact.jsx` et la contrainte site statique (pas de backend)
**When** on crée la route `/contact` avec le formulaire (`ZInput`, `ZButton`)
**Then** le formulaire valide les champs côté front et affiche un feedback
**And** aucune dépendance backend n'est requise (NFR4)

### Story 7.2: Infos, CTA terminal et socials

As a visiteur,
I want des moyens de contact alternatifs,
So that je choisis comment joindre Simon (UX-DR16, FR9).

**Acceptance Criteria:**


---CONTEXT FULL---
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

---HOME SPEC FULL---
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

---DIFF FULL---
     1	diff --git a/app/pages/about.vue b/app/pages/about.vue
     2	index 6a08e8a..794edfe 100644
     3	--- a/app/pages/about.vue
     4	+++ b/app/pages/about.vue
     5	@@ -25,14 +25,16 @@
     6	           <div class="about__bio">
     7	             <h2 class="eyebrow">// à propos</h2>
     8	             <p class="prose about__para">
     9	-              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
    10	-              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
    11	-              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
    12	+              Développeur web freelance basé à <strong>Rouen</strong>, je viens d'un parcours technique (métrologie,
    13	+              instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je conçois et développe des
    14	+              applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
    15	+              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
    16	             </p>
    17	             <p class="prose about__para">
    18	-              Je suis aussi fondateur du SaaS
    19	-              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
    20	-              service du code — agents, automatisations, intégrations LLM.
    21	+              Je suis également co-fondateur de la plateforme SaaS
    22	+              <ZExternalLink href="https://keova.app">keova.app</ZExternalLink>, et j'intègre l'automatisation,
    23	+              l'exigence QA et l'IA au service du code — tests automatisés, architecture modulaire et intégrations
    24	+              d'APIs.
    25	             </p>
    26	 
    27	             <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
    28	@@ -100,20 +102,20 @@ import { SITE } from "~/data/site";
    29	 const profile = SITE.profile;
    30	 const skills = SITE.skills;
    31	 
    32	-// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
    33	+// Expériences (de la plus récente à la plus ancienne).
    34	 // `org` sert de clé v-for stable (unique).
    35	 const experiences = [
    36	   {
    37	     date: "02/2021 — aujourd'hui",
    38	-    role: "Testeur QA",
    39	+    role: "Testeur QA & Développeur TypeScript",
    40	     org: "Linkizz",
    41	-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
    42	+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
    43	   },
    44	   {
    45	     date: "05/2020 — 12/2021",
    46	     role: "Développeur Full Stack",
    47	     org: "CINS",
    48	-    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
    49	+    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
    50	   },
    51	   {
    52	     date: "07/2007 — 05/2019",
    53	@@ -132,7 +134,7 @@ const degrees = [
    54	 // Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
    55	 const pageTitle = "À propos — jouan.ovh";
    56	 const pageDescription =
    57	-  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
    58	+  "Développeur web freelance à Rouen, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.";
    59	 
    60	 const siteUrl = useSiteUrl();
    61	 const aboutJsonLd = {
    62	@@ -146,6 +148,12 @@ const aboutJsonLd = {
    63	     jobTitle: SITE.profile.role,
    64	     url: siteUrl,
    65	     image: `${siteUrl}/images/portrait.jpeg`,
    66	+    email: SITE.profile.email,
    67	+    address: {
    68	+      "@type": "PostalAddress",
    69	+      addressLocality: SITE.profile.city,
    70	+      addressCountry: "FR",
    71	+    },
    72	   },
    73	 };
    74	 
    75	diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
    76	index 37ac248..c3c42ba 100644
    77	--- a/docs/implementation-artifacts/deferred-work.md
    78	+++ b/docs/implementation-artifacts/deferred-work.md
    79	@@ -142,10 +142,10 @@ _Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont
    80	 
    81	 ## Deferred from: code review of 11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique (2026-09-13)
    82	 
    83	-- **Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil** (`app/pages/index.vue`) — L'en-tête hero de `index.vue` conserve temporairement l'ancienne accroche et les tags PHP/WordPress jusqu'à son remplacement par JouanOS. → Prévu dans la **Story 11.2** (Séquence de boot interactive JouanOS et hero commercial cinétique).
    84	-- **Marquee de stack moderne ordonnée et mise en avant des 3 services** (`app/pages/index.vue`) — La section des compétences et des services n'affiche pas encore le marquee ni les 3 offres commerciales. → Prévu dans la **Story 11.3** (Marquee de stack moderne et vitrine des 3 services cibles).
    85	-- **Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt** (`app/pages/index.vue`) — Les indicateurs chiffrés, le journal et le lien de conversion Malt ne sont pas encore intégrés sur la home. → Prévu dans la **Story 11.4** (Preuves concrètes SaaS, journal technique et CTA final de conversion).
    86	-- **Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`) — Révision globale du SEO de `about.vue` et des pages secondaires pour refléter la nouvelle position commerciale Full Stack TS. → Prévu dans la **Story 11.5** (Validation transverse a11y multi-pages, SSG Nitro et gate Docker).
    87	+- ~~**Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil**~~ — ✅ **Résolu en 11.2** (`HomeBootOverlay.vue`, `HomeHeroTerminal.vue`, `index.vue`).
    88	+- ~~**Marquee de stack moderne ordonnée et mise en avant des 3 services**~~ — ✅ **Résolu en 11.3** (`HomeStackMarquee.vue`, `index.vue`).
    89	+- ~~**Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt**~~ — ✅ **Résolu en 11.4** (projets SaaS, stats clés, journal, cta final dans `index.vue`).
    90	+- ~~**Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`)~~ — ✅ **Résolu en 11.5** (`about.vue` : bio, rôle Full Stack TS, localisation Rouen, expériences et JSON-LD synchronisés).
    91	 
    92	 ## Deferred from: code review of 11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles (2026-09-13)
    93	 
    94	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
    95	index f8ab73d..98b76e7 100644
    96	--- a/docs/implementation-artifacts/sprint-status.yaml
    97	+++ b/docs/implementation-artifacts/sprint-status.yaml
    98	@@ -35,7 +35,7 @@
    99	 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
   100	 
   101	 generated: 2026-06-18
   102	-last_updated: "2026-09-13 (Story 11.4 done : Preuves SaaS, Journal & CTA final)"
   103	+last_updated: "2026-09-13 (Story 11.5 ready-for-dev : Validation transverse a11y, multi-pages & Gate Docker)"
   104	 project: jouan.ovh
   105	 project_key: NOKEY
   106	 tracking_system: file-system
   107	@@ -123,5 +123,5 @@ development_status:
   108	   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
   109	   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
   110	   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: done
   111	-  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: ready-for-dev
   112	+  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: review
   113	   epic-11-retrospective: optional

2026-09-13T19:46:10.183805Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:46:10.922643Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:46:14.564589Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:46:17.984671Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '---ABOUT CURRENT---'; nl -ba app/pages/about.vue | sed -n '1,210p'; printf '%s\\n' '---SITE DATA---'; nl -ba app/data/site.ts | sed -n '1,260p'; printf '%s\\n' '---SEO COMPOSABLE---'; nl -ba app/composables/usePageSeo.ts | sed -n '1,240p'; printf '%s\\n' '---LINK/FOCUS/MOTION SEARCH---'; rg -n 'target=\"_blank\"|<ZExternalLink|focus-visible|forced-colors|prefers-reduced-motion|animation:|transition:' app | head -250; printf '%s\\n' '---ROUTES/ANCHORS---'; rg -n 'href=\"#|to=\"#|:href=.*#|NuxtLink.*#' app || true; printf '%s\\n' '---RELEVANT STATUS---'; sed -n '1,150p' docs/implementation-artifacts/sprint-status.yaml" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---ABOUT CURRENT---
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
    28	              Développeur web freelance basé à <strong>Rouen</strong>, je viens d'un parcours technique (métrologie,
    29	              instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je conçois et développe des
    30	              applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
    31	              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
    32	            </p>
    33	            <p class="prose about__para">
    34	              Je suis également co-fondateur de la plateforme SaaS
    35	              <ZExternalLink href="https://keova.app">keova.app</ZExternalLink>, et j'intègre l'automatisation,
    36	              l'exigence QA et l'IA au service du code — tests automatisés, architecture modulaire et intégrations
    37	              d'APIs.
    38	            </p>
    39	
    40	            <!-- Stack technique (story 5.2) — sous la bio, conforme à About.jsx. ZTag = pill.
    41	                 Liste sémantique (<ul>/<li>) pour annonce « liste de N éléments » aux lecteurs d'écran. -->
    42	            <div class="about__stack">
    43	              <h2 class="eyebrow eyebrow--muted">// stack</h2>
    44	              <ul class="hero__tags">
    45	                <li v-for="skill in skills" :key="skill">
    46	                  <ZTag>{{ skill }}</ZTag>
    47	                </li>
    48	              </ul>
    49	            </div>
    50	          </div>
    51	        </div>
    52	      </div>
    53	    </section>
    54	
    55	    <!-- Section CV (story 5.2) : timeline d'expériences (gauche) + formation (droite).
    56	         Porté de About.jsx (2e section--sunken), grille 1.4fr / 0.6fr. -->
    57	    <section class="section section--sunken">
    58	      <div class="container">
    59	        <div class="about__cv">
    60	          <!-- Colonne gauche : timeline d'expériences (la plus récente en haut).
    61	               <ol> : séquence chronologique annoncée comme liste ordonnée aux lecteurs d'écran. -->
    62	          <div>
    63	            <h2 class="eyebrow">// expériences</h2>
    64	            <ol class="tl">
    65	              <li v-for="xp in experiences" :key="xp.org" class="tl__item">
    66	                <div class="tl__date">{{ xp.date }}</div>
    67	                <div class="tl__role">{{ xp.role }}</div>
    68	                <div class="tl__org">{{ xp.org }}</div>
    69	                <div class="tl__desc">{{ xp.desc }}</div>
    70	              </li>
    71	            </ol>
    72	          </div>
    73	
    74	          <!-- Colonne droite : formation (une ZCard par diplôme), liste sémantique <ul>/<li>. -->
    75	          <div>
    76	            <h2 class="eyebrow">// formation</h2>
    77	            <ul class="about__degrees">
    78	              <li v-for="degree in degrees" :key="degree.name">
    79	                <ZCard padded>
    80	                  <div class="tl__date">{{ degree.date }}</div>
    81	                  <div class="about__degree-name">{{ degree.name }}</div>
    82	                  <div class="tl__org">{{ degree.school }}</div>
    83	                </ZCard>
    84	              </li>
    85	            </ul>
    86	          </div>
    87	        </div>
    88	      </div>
    89	    </section>
    90	  </main>
    91	</template>
    92	
    93	<script setup lang="ts">
    94	// Page À-propos — hero portrait + bio + stack (story 5.1/5.2) puis section CV
    95	// (timeline d'expériences + formation, story 5.2). Porté de About.jsx du UI kit :
    96	// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
    97	// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
    98	import { NuxtLink } from "#components";
    99	import { SITE } from "~/data/site";
   100	
   101	// Identité + stack — source unique `app/data/site.ts`.
   102	const profile = SITE.profile;
   103	const skills = SITE.skills;
   104	
   105	// Expériences (de la plus récente à la plus ancienne).
   106	// `org` sert de clé v-for stable (unique).
   107	const experiences = [
   108	  {
   109	    date: "02/2021 — aujourd'hui",
   110	    role: "Testeur QA & Développeur TypeScript",
   111	    org: "Linkizz",
   112	    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
   113	  },
   114	  {
   115	    date: "05/2020 — 12/2021",
   116	    role: "Développeur Full Stack",
   117	    org: "CINS",
   118	    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
   119	  },
   120	  {
   121	    date: "07/2007 — 05/2019",
   122	    role: "Métrologue",
   123	    org: "A+ Métrologie / Trescal",
   124	    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
   125	  },
   126	];
   127	
   128	// Formation (data.js → S.degrees). `name` sert de clé v-for stable (unique).
   129	const degrees = [
   130	  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
   131	  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
   132	];
   133	
   134	// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
   135	const pageTitle = "À propos — jouan.ovh";
   136	const pageDescription =
   137	  "Développeur web freelance à Rouen, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.";
   138	
   139	const siteUrl = useSiteUrl();
   140	const aboutJsonLd = {
   141	  "@context": "https://schema.org",
   142	  "@type": "ProfilePage",
   143	  name: pageTitle,
   144	  url: `${siteUrl}/about`,
   145	  mainEntity: {
   146	    "@type": "Person",
   147	    name: SITE.profile.name,
   148	    jobTitle: SITE.profile.role,
   149	    url: siteUrl,
   150	    image: `${siteUrl}/images/portrait.jpeg`,
   151	    email: SITE.profile.email,
   152	    address: {
   153	      "@type": "PostalAddress",
   154	      addressLocality: SITE.profile.city,
   155	      addressCountry: "FR",
   156	    },
   157	  },
   158	};
   159	
   160	usePageSeo({
   161	  title: pageTitle,
   162	  description: pageDescription,
   163	  path: "/about",
   164	  image: "/images/portrait.jpeg",
   165	  type: "profile",
   166	  twitterCard: "summary",
   167	  jsonLd: aboutJsonLd,
   168	});
   169	</script>
   170	
   171	<style lang="scss" scoped>
   172	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
   173	// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
   174	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   175	.about {
   176	  display: block;
   177	}
   178	
   179	// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
   180	// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
   181	// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
   182	// reproduit l'héritage du corps, comme le ferait un <p>).
   183	.eyebrow {
   184	  font-weight: var(--fw-regular);
   185	  line-height: inherit;
   186	}
   187	
   188	// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
   189	.about__grid {
   190	  display: grid;
   191	  grid-template-columns: 0.8fr 1.2fr;
   192	  align-items: start;
   193	  gap: var(--space-6);
   194	}
   195	
   196	// ---- Colonne gauche : identité ----
   197	.about__name {
   198	  margin: var(--space-5) 0 var(--space-1);
   199	  font-family: var(--font-mono);
   200	  font-size: var(--fs-3xl);
   201	  font-weight: var(--fw-regular);
   202	  line-height: var(--lh-tight);
   203	  color: var(--text-strong);
   204	}
   205	
   206	.about__role {
   207	  font-family: var(--font-mono);
   208	  font-size: var(--fs-sm);
   209	  color: var(--accent);
   210	}
---SITE DATA---
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
    58	    name: "Keova App",
    59	    role: "Co-fondateur & Développeur Full Stack",
    60	    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    61	    url: "https://keova.app",
    62	    status: "● En production",
    63	    tags: ["Nuxt 4", "NestJS", "PostgreSQL", "Stripe Connect", "SaaS"],
    64	  },
    65	  {
    66	    name: "TryOn",
    67	    role: "CTO & Développeur Full Stack",
    68	    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    69	    status: "○ Étude de cas (MVP livré)",
    70	    tags: ["Nuxt 3", "NestJS", "Python", "ComfyUI", "IA"],
    71	  },
    72	  {
    73	    name: "Nodium",
    74	    role: "Créateur & Ingénieur IA",
    75	    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    76	    status: "◐ R&D / En cours",
    77	    tags: ["TypeScript", "Electron", "Agents", "IA"],
    78	  },
    79	];
    80	
    81	export const SITE = { profile, skills, projects } as const;
---SEO COMPOSABLE---
     1	import { computed, toValue, type MaybeRefOrGetter } from "vue";
     2	import { useSiteUrl } from "./useSiteUrl";
     3	
     4	export interface PageSeoOptions {
     5	  /** Titre de la page (utilisé pour <title> et par défaut og:title, twitter:title). */
     6	  title: string;
     7	  /** Titre optionnel spécifique pour Open Graph et Twitter (ex. titre d'article sans suffixe). */
     8	  ogTitle?: string;
     9	  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
    10	  description: string;
    11	  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
    12	  path?: string;
    13	  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
    14	  image?: string;
    15	  /** Texte alternatif pour l'image OG/Twitter (og:image:alt, twitter:image:alt). */
    16	  imageAlt?: string;
    17	  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
    18	  type?: "website" | "article" | "profile";
    19	  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
    20	  twitterCard?: "summary" | "summary_large_image";
    21	  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
    22	  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    23	}
    24	
    25	/**
    26	 * Composable centralisant la déclaration des métadonnées SEO par page :
    27	 * <title>, canonical, description, Open Graph (type, title, desc, url, image, alt)
    28	 * et Twitter Card (card, title, desc, image, alt) + JSON-LD échappé.
    29	 *
    30	 * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
    31	 */
    32	export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
    33	  const siteUrl = useSiteUrl();
    34	
    35	  const seo = computed(() => {
    36	    const opts = toValue(options);
    37	    if (!opts) {
    38	      return null;
    39	    }
    40	
    41	    const rawPath = opts.path ?? "";
    42	    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    43	    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
    44	
    45	    let imageUrl: string | undefined;
    46	    if (opts.image) {
    47	      imageUrl = /^https?:\/\//i.test(opts.image)
    48	        ? opts.image
    49	        : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
    50	    }
    51	
    52	    const type = opts.type ?? "website";
    53	    const twitterCard = opts.twitterCard ?? (imageUrl && type === "article" ? "summary_large_image" : "summary");
    54	
    55	    return {
    56	      title: opts.title,
    57	      ogTitle: opts.ogTitle ?? opts.title,
    58	      description: opts.description,
    59	      canonicalUrl,
    60	      imageUrl,
    61	      imageAlt: opts.imageAlt,
    62	      type,
    63	      twitterCard,
    64	      jsonLd: opts.jsonLd,
    65	    };
    66	  });
    67	
    68	  useHead(() => {
    69	    if (!seo.value) {
    70	      return {};
    71	    }
    72	
    73	    const scripts: Array<{ type: string; innerHTML: string }> = [];
    74	    if (seo.value.jsonLd) {
    75	      if (Array.isArray(seo.value.jsonLd)) {
    76	        for (const item of seo.value.jsonLd) {
    77	          scripts.push(jsonLdScript(item));
    78	        }
    79	      } else {
    80	        scripts.push(jsonLdScript(seo.value.jsonLd));
    81	      }
    82	    }
    83	
    84	    return {
    85	      title: seo.value.title,
    86	      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
    87	      script: scripts,
    88	    };
    89	  });
    90	
    91	  useSeoMeta({
    92	    title: () => seo.value?.title,
    93	    description: () => seo.value?.description,
    94	    ogTitle: () => seo.value?.ogTitle,
    95	    ogDescription: () => seo.value?.description,
    96	    ogUrl: () => seo.value?.canonicalUrl,
    97	    ogType: () => seo.value?.type,
    98	    ogImage: () => seo.value?.imageUrl,
    99	    ogImageAlt: () => seo.value?.imageAlt,
   100	    twitterCard: () => seo.value?.twitterCard,
   101	    twitterTitle: () => seo.value?.ogTitle,
   102	    twitterDescription: () => seo.value?.description,
   103	    twitterImage: () => seo.value?.imageUrl,
   104	    twitterImageAlt: () => seo.value?.imageAlt,
   105	  });
   106	}
---LINK/FOCUS/MOTION SEARCH---
app/pages/about.vue:35:              <ZExternalLink href="https://keova.app">keova.app</ZExternalLink>, et j'intègre l'automatisation,
app/pages/about.vue:252:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/about.vue:254:    &:focus-visible {
app/pages/confidentialite.vue:56:                <strong>Sous-traitant :</strong> Web3Forms (<ZExternalLink
app/pages/confidentialite.vue:133:              <ZExternalLink class="legal__link" href="https://www.cnil.fr" rel="noopener">cnil.fr</ZExternalLink>).
app/pages/confidentialite.vue:232:  &:focus-visible {
app/pages/blog/[...slug].vue:189:  &:focus-visible {
app/pages/blog/[...slug].vue:190:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:277:    &:focus-visible {
app/pages/blog/[...slug].vue:278:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/contact.vue:370:  &:focus-visible {
app/pages/contact.vue:443:  &:focus-visible {
app/pages/contact.vue:444:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/index.vue:26:                <ZExternalLink :href="SITE.profile.maltUrl"> Profil Malt vérifié </ZExternalLink>
app/pages/index.vue:361:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
app/pages/index.vue:457:    &:focus-visible {
app/pages/index.vue:471:  animation: pulse-dot 2.2s infinite var(--ease-out);
app/pages/index.vue:473:  @media (prefers-reduced-motion: reduce) {
app/pages/index.vue:474:    animation: none;
app/pages/index.vue:615:  &:focus-visible {
app/pages/index.vue:616:    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/index.vue:648:  transition:
app/pages/index.vue:658:    transition: opacity var(--dur-slow) var(--ease-standard);
app/pages/index.vue:686:  &:focus-visible {
app/pages/index.vue:719:  transition: color var(--dur-base) var(--ease-standard);
app/pages/index.vue:750:  transition:
app/pages/index.vue:813:  transition: color var(--dur-base) var(--ease-standard);
app/pages/index.vue:819:  &:focus-visible {
app/pages/index.vue:888:  transition: color var(--dur-base) var(--ease-standard);
app/pages/index.vue:913:  transition:
app/pages/index.vue:1024:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue:1026:    animation: none;
app/pages/index.vue:1033:    transition: none;
app/pages/mentions-legales.vue:26:              <ZExternalLink class="legal__link" href="https://www.malt.fr/profile/simonjouan" rel="noopener"
app/pages/mentions-legales.vue:47:              <ZExternalLink class="legal__link" href="https://pages.github.com" rel="noopener"
app/pages/mentions-legales.vue:56:              <ZExternalLink class="legal__link" href="https://www.ovhcloud.com" rel="noopener"
app/pages/mentions-legales.vue:171:  &:focus-visible {
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:257:  transition:
app/components/HeaderComponent.vue:267:  &:focus-visible {
app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:304:  &:focus-visible {
app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:370:    transition:
app/components/HeaderComponent.vue:396:  &:focus-visible {
app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
app/components/HeaderComponent.vue:417:    transition: none;
app/components/FooterComponent.vue:22:              <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
app/components/FooterComponent.vue:113:  &:focus-visible {
app/components/FooterComponent.vue:114:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:157:  transition: color var(--dur-fast) var(--ease-standard);
app/components/FooterComponent.vue:164:  &:focus-visible {
app/components/FooterComponent.vue:165:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:201:@media (prefers-reduced-motion: reduce) {
app/components/FooterComponent.vue:203:    transition: none;
app/components/WindowWrapperComponent.vue:314:    transition: opacity 0.5s ease-in-out;
app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
app/components/HexagonLinkComponent.vue:2:  <ZExternalLink class="hex" :href="link" rel="noopener noreferrer">
app/components/HexagonLinkComponent.vue:30:  transition:
app/components/HexagonLinkComponent.vue:39:  &:focus-visible {
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue:60:    transition: none;
app/components/ui/ZButton.vue:128:  transition:
app/components/ui/ZButton.vue:134:  &:focus-visible {
app/components/ui/ZButton.vue:136:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZButton.vue:249:    transition: none;
app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
app/components/terminal/TerminalComponent.vue:468:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
app/components/ui/ZCustomCursor.vue:21:// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
app/components/ui/ZCustomCursor.vue:109:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCustomCursor.vue:152:  transition: opacity var(--dur-base) var(--ease-standard);
app/components/ui/ZCustomCursor.vue:169:  transition:
app/components/ui/ZCustomCursor.vue:182:@media (hover: none), (prefers-reduced-motion: reduce) {
app/components/home/HomeStackMarquee.vue:26:// Pause automatique au :hover et arrêt complet sous prefers-reduced-motion.
app/components/home/HomeStackMarquee.vue:70:  animation: scroll-x 32s linear infinite;
app/components/home/HomeStackMarquee.vue:103:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeStackMarquee.vue:109:    animation: none;
app/components/card/ZCardBody.vue:29:    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue:35:    animation: none;
app/components/ui/ZInput.vue:160:  transition:
app/components/ui/ZInput.vue:175:    // Outline transparent → rendu en couleur système sous forced-colors (où la
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZInput.vue:236:    transition: none;
app/components/home/HomeHeroTerminal.vue:86:// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
app/components/home/HomeHeroTerminal.vue:153:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:215:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:348:  &:focus-visible {
app/components/home/HomeHeroTerminal.vue:384:  animation: caret-blink 1s steps(1) infinite;
app/components/home/HomeHeroTerminal.vue:387:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeHeroTerminal.vue:389:    animation: none;
app/components/home/HomeAtmosComponent.vue:14:// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue:42:  animation: drift-orange 26s var(--ease-in-out) infinite;
app/components/home/HomeAtmosComponent.vue:52:  animation: drift-auberg 32s var(--ease-in-out) infinite;
app/components/home/HomeAtmosComponent.vue:62:  animation: drift-red 30s var(--ease-in-out) infinite;
app/components/home/HomeAtmosComponent.vue:123:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeAtmosComponent.vue:125:    animation: none;
app/components/home/HomeBootOverlay.vue:41:// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
app/components/home/HomeBootOverlay.vue:131:  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeBootOverlay.vue:173:  transition:
app/components/home/HomeBootOverlay.vue:228:    transition: width 0.1s linear;
app/components/home/HomeBootOverlay.vue:244:  &:focus-visible {
app/components/home/HomeBootOverlay.vue:251:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue:124:  transition:
app/components/ui/ZTag.vue:147:  &:focus-visible {
app/components/ui/ZTag.vue:148:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:176:  &:focus-visible {
app/components/ui/ZTag.vue:177:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue:186:    transition: none;
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss:37:    animation: none !important;
app/components/ui/ZCard.vue:75:  transition:
app/components/ui/ZCard.vue:97:  &:focus-visible {
app/components/ui/ZCard.vue:98:    // Outline transparent → rendu en couleur système sous forced-colors (où les
app/components/ui/ZCard.vue:121:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCard.vue:123:    transition: none;
app/components/ui/ZExternalLink.vue:2:  <a :href="href" :rel="computedRel" target="_blank">
app/components/ui/ZExternalLink.vue:9:// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" garanti),
app/assets/scss/components/_button.scss:100:  transition: color 0.15s ease-in-out, background 0.15s ease-in-out, border-color 0.15s ease-in-out;
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
---ROUTES/ANCHORS---
app/pages/about.vue:98:import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue:64:import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue:285:  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
app/pages/blog/index.vue:88:import { NuxtLink } from "#components";
app/pages/services.vue:73:import { NuxtLink } from "#components";
app/pages/index.vue:232:import { NuxtLink, ZExternalLink } from "#components";
app/components/HeaderComponent.vue:81:import { NuxtLink } from "#components";
app/components/ui/ZButton.vue:66:// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
app/components/ui/ZCard.vue:51:// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
---RELEVANT STATUS---
# generated: 2026-06-18
# last_updated: 2026-09-13 (Epic 11 ajouté : Refonte d'accueil Awwwards & Repositionnement Commercial)
# project: jouan.ovh
# project_key: NOKEY
# tracking_system: file-system
# story_location: docs/implementation-artifacts

# STATUS DEFINITIONS:
# ==================
# Epic Status:
#   - backlog: Epic not yet started
#   - in-progress: Epic actively being worked on
#   - done: All stories in epic completed
#
# Epic Status Transitions:
#   - backlog → in-progress: Automatically when first story is created (via create-story)
#   - in-progress → done: Manually when all stories reach 'done' status
#
# Story Status:
#   - backlog: Story only exists in epic file
#   - ready-for-dev: Story file created in stories folder
#   - in-progress: Developer actively working on implementation
#   - review: Ready for code review (via Dev's code-review workflow)
#   - done: Story completed
#
# Retrospective Status:
#   - optional: Can be completed but not required
#   - done: Retrospective has been completed
#
# WORKFLOW NOTES:
# ===============
# - Epic transitions to 'in-progress' automatically when first story is created
# - Stories can be worked in parallel if team capacity allows
# - Developer typically creates next story after previous one is 'done' to incorporate learnings
# - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)

generated: 2026-06-18
last_updated: "2026-09-13 (Story 11.5 ready-for-dev : Validation transverse a11y, multi-pages & Gate Docker)"
project: jouan.ovh
project_key: NOKEY
tracking_system: file-system
story_location: docs/implementation-artifacts

development_status:
  # Epic 1 — Migration de la stack vers Nuxt 4
  epic-1: in-progress
  1-1-migrer-le-coeur-vers-nuxt-4: done
  1-2-mettre-a-jour-les-modules-et-dependances: done
  1-3-migrer-loutillage-lint-vers-eslint-9: done
  1-4-valider-build-statique-et-deploiement-gh-pages: done
  epic-1-retrospective: done

  # Epic 2 — Fondations du design system
  epic-2: in-progress
  2-1-porter-les-tokens-du-design-system: done
  2-2-polices-et-base-dark-first: done
  2-3-primitive-zbutton: done
  2-4-primitive-zcard: done
  2-5-primitives-zbadge-et-ztag: done
  2-6-primitives-zinput-et-zavatar: done
  2-7-iconographie: done
  2-8-chassis-global-header-footer-nav-socials: done
  epic-2-retrospective: done

  # Epic 3 — Page d'accueil
  epic-3: in-progress
  3-1-hero-terminal-a: done
  3-2-apercu-services-et-stats: done
  3-3-projets-selectionnes: done
  epic-3-retrospective: done

  # Epic 4 — Page Services
  epic-4: in-progress
  4-1-route-services-et-cartes-doffre: done
  4-2-section-process: done
  epic-4-retrospective: done

  # Epic 5 — Page À-propos
  epic-5: in-progress
  5-1-portrait-et-bio: done
  5-2-timeline-formation-et-stack: done
  epic-5-retrospective: done

  # Epic 6 — Blog
  epic-6: in-progress
  6-1-index-du-blog-et-empty-state: done
  6-2-vue-article-prose-et-code: done
  epic-6-retrospective: done

  # Epic 7 — Page Contact
  epic-7: in-progress
  7-1-route-contact-et-formulaire: done
  7-2-infos-cta-terminal-et-socials: done
  epic-7-retrospective: done

  # Epic 8 — Terminal easter-egg restylé
  epic-8: in-progress
  8-1-style-terminalwindow-et-prompt: done
  8-2-preserver-les-commandes-et-louverture: done
  8-3-migrer-composants-terminal-script-setup: done
  epic-8-retrospective: done

  # Epic 9 — Accessibilité & finitions motion
  epic-9: done
  9-1-etats-interactifs-coherents: done
  9-2-motion-reduit-contraste-et-clavier: done
  epic-9-retrospective: done

  # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
  epic-10: done
  10-1-decision-hebergement-prod-et-derisquage-deploiement: done
  10-2-a11y-semantique-residuelle: done
  10-3-liens-externes-accessibles: done
  10-4-validation-a11y-emulee-et-unification-forced-colors: done
  10-5-seo-centralise-site-wide: done
  10-6-conformite-legale-rgpd-mentions: done
  10-7-mise-en-production-reelle: done
  epic-10-retrospective: done

  # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
  epic-11: in-progress
  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: done
  11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: done
  11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: done
  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: review
  epic-11-retrospective: optional

2026-09-13T19:46:20.343035Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '760,820p' docs/planning-artifacts/epics.md; printf '\\n---AGENTS CRITICAL---\\n'; sed -n '1,190p' AGENTS.md; printf '\\n---SPEC COMPANION REFERENCES EXIST?---\\n'; for p in docs/specs/spec-home-awwwards/sections-mapping.md docs/contexte_malt.md docs/direction_strategique_site.md; do if test -f \""'$p"; then echo "$p"; wc -l "$p"; fi; done; printf '"'\\n---ABOUT DIFF CONTEXT BASELINE---\\n'; git show 5dc54f741c8ed022fb916686abf6ba4c8d95b271:app/pages/about.vue | nl -ba | sed -n '1,175p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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


---AGENTS CRITICAL---
# AGENTS.md — Directives & Contexte Projet pour Agents IA

Ce document constitue la **source de vérité universelle** pour tout agent IA (Claude, Gemini, Antigravity, BMAD, Cursor, Windsurf, Copilot, etc.) intervenant sur le dépôt **jouan.ovh**. Il consigne les règles critiques, l'architecture, l'environnement de développement et les invariants non négociables du projet.

---

## 1. Identité & État du Projet

- **Projet :** `jouan.ovh` — Portfolio, vitrine de services et blog de **Simon Jouan** (développeur web freelance).
- **URL de production :** [`https://jouan.ovh`](https://jouan.ovh) (déployé sur **GitHub Pages**, domaine custom, HTTPS Let's Encrypt forcé, DNS OVH).
- **Statut actuel :** **Refonte complète livrée et active en production** (Epics 1 à 10 validés et clôturés). Le projet est en phase d'**exploitation, maintenance et évolutions ciblées (Run)**.
- **Langue & Voix (NFR6) :** 
  - Interface et contenu en **FRANÇAIS** (`lang="fr"`).
  - Voix : **1re personne (« je »)** pour Simon, **vouvoiement** pour le visiteur/client.
  - **ZÉRO EMOJI** dans le contenu et l'UI (univers sobre et professionnel inspiré du terminal).

---

## 2. Règle d'Or d'Environnement : Docker Uniquement ⚠️

**L'intégralité du développement et de l'outillage DOIT s'exécuter dans le conteneur Docker.**

> ⚠️ **Ne JAMAIS exécuter `pnpm`, `npm`, `yarn` ou `nuxi` directement sur la machine hôte.**
> Les dépendances natives (`better-sqlite3`, `esbuild`, `sharp`...) sont compilées pour Linux dans un volume Docker isolé nommé `node_modules`. Exécuter des commandes sur l'hôte (macOS arm64) corromprait l'environnement.

### Commandes usuelles via Docker :

```sh
# Démarrer le serveur de développement (http://localhost:3000)
docker compose up

# Arrêter les conteneurs
docker compose down

# Lancer la suite de validation complète (Gate obligatoire avant commit)
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"

# Commandes ponctuelles
docker compose run --rm web sh -c "corepack enable && pnpm lint"       # eslint + stylelint
docker compose run --rm web sh -c "corepack enable && pnpm typecheck"  # vérification TypeScript vue-tsc
docker compose run --rm web sh -c "corepack enable && pnpm generate"   # build statique SSG (13 routes)
docker compose run --rm web sh -c "corepack enable && pnpm add -D <pkg>" # ajout de dépendance
```

*Note SQLite / `@nuxt/content` :* Lancer `pnpm generate` dans un conteneur séparé pendant que le serveur dev tourne peut invalider la base de contenu SQLite du dev. Si `/blog` affiche une erreur en dev, exécuter `docker compose restart web`.

---

## 3. Stack Technique & Versions

- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé, cible de build **statique** (`nuxi generate` via Nitro).
- **Structure applicative :** Tout le code Nuxt vit sous **`app/`** (`srcDir = "app"` dans `nuxt.config.ts`).
- **UI / Composants :** Vue 3 avec **`<script setup lang="ts">`** obligatoire pour tout nouveau composant. (Plus aucun décorateur de classe ; le terminal a été intégralement migré en `script setup`).
- **Langage :** TypeScript `^6.0.3` en mode strict.
- **Styles :** SCSS (`sass ^1.101.0`) avec `@use ... as _alias` (jamais `@import`).
- **Tokens & Design System :** Dark-first (pas de mode clair). Tokens CSS custom properties exposés globalement sur `:root` dans `app/assets/scss/abstract/_root.scss`. Consommation via `var(--token)`.
- **Contenu :** `@nuxt/content ^3.14.0` (v3, stockage SQLite, collections typées dans `content.config.ts`).
- **Images :** `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`), jamais de balise `<img>` brute.
- **Linters :** ESLint 10 (flat config `@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
- **Formulaire de contact :** Web3Forms (service tiers sans serveur), clé publique lue via `useRuntimeConfig().public.web3formsAccessKey`.
- **CI/CD :** GitHub Actions (`.github/workflows/cd.yml`) publiant automatiquement `.output/public` vers la branche `gh-pages` lors d'un push sur `main`.

---

## 4. Architecture & Arborescence Clé

```text
jouan.ovh/
├── app/
│   ├── assets/scss/
│   │   ├── abstract/        # Tokens, variables, mixins (_root.scss = source vérité CSS vars)
│   │   ├── base/            # _reset.scss, _layout.scss (primitives globales), _motion.scss
│   │   └── main.scss        # Point d'entrée SCSS global
│   ├── components/
│   │   ├── ui/              # Primitives DS auto-importées sans préfixe (ZButton, ZCard, ZExternalLink...)
│   │   ├── card/            # Sous-blocs ZCardHeader, ZCardBody, ZCardFooter
│   │   ├── terminal/        # Sous-système terminal draggable (TerminalComponent, TerminalManagerComponent)
│   │   │   └── programs/    # Classes TypeScript pures implémentant IProgram
│   │   ├── HeaderComponent.vue
│   │   ├── FooterComponent.vue
│   │   └── HexagonLinkComponent.vue
│   ├── composables/
│   │   ├── useSiteUrl.ts    # Source unique pour l'URL de base résolue via runtimeConfig
│   │   └── usePageSeo.ts    # Helper universel useSeoMeta, canonical et Schema.org / JSON-LD
│   ├── data/
│   │   └── site.ts          # SOURCE UNIQUE de vérité pour le profil, compétences et projets (SITE)
│   ├── layouts/
│   │   └── default.vue      # Layout principal
│   └── pages/               # 13 routes statiques pré-rendues
│       ├── index.vue        # Accueil (Hero terminal, aperçu services, projets phares)
│       ├── services.vue     # Offres de freelance et déroulé du process en 4 étapes
│       ├── about.vue        # Biographie, timeline expériences/formations et stack
│       ├── contact.vue      # Formulaire de contact Web3Forms et coordonnées
│       ├── confidentialite.vue # Politique de confidentialité RGPD
│       ├── mentions-legales.vue# Mentions légales
│       └── blog/
│           ├── index.vue    # Liste des articles du blog
│           └── [...slug].vue# Rendu Markdown d'article via <ContentRenderer>
├── content/
│   └── blog/                # Articles de blog au format Markdown
├── content.config.ts        # Schéma et validation Zod des collections @nuxt/content
├── nuxt.config.ts           # Configuration centrale Nuxt 4
├── public/
│   ├── CNAME                # Domaine de production officiel (contient "jouan.ovh")
│   ├── _headers             # En-têtes HTTP de sécurité pour gh-pages
│   └── images/              # Assets statiques optimisés
├── .github/workflows/cd.yml # Pipeline CI/CD GitHub Actions
└── docs/                    # Documentation projet, specs, artifacts de planning et d'implémentation
```

---

## 5. Invariants & Règles d'Implémentation Critiques

### 1. URLs et Domaines : Jamais de Hardcoding
- **Règle :** Ne **JAMAIS** écrire en dur `https://jouan.ovh` ou `https://dev.jouan.ovh` dans le code applicatif ou les métadonnées.
- **Pattern :** Toujours injecter l'URL via le composable `useSiteUrl()`. Ce composable lit `runtimeConfig.public.siteUrl` (surchargeable par la variable d'environnement `NUXT_PUBLIC_SITE_URL`).
- **SEO :** Utiliser systématiquement `usePageSeo({ title, description, path, ... })` pour garantir l'unicité des canonicals et des balises OpenGraph/Twitter.

### 2. Contenu Partagé : DRY Strict
- **Règle :** Ne **JAMAIS** re-hardcoder le nom, la bio, la ville, l'email ou les projets dans une page ou un programme terminal.
- **Pattern :** Consommer `SITE.profile`, `SITE.skills` ou `SITE.projects` depuis `app/data/site.ts`.

### 3. Tokens & Primitives de Layout SCSS
- **No Hardcode :** Aucune couleur, rayon, ombre ou marge en dur. Toujours consommer les variables globales `var(--token)`.
- **Primitives globales :** Les classes de mise en page `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose`, `.hero__tags` vivent dans `app/assets/scss/base/_layout.scss`. **Ne JAMAIS les redéclarer dans un `<style scoped>` de page**.
- **Piège du padding multi-classes :** Lorsqu'un élément cumule `.container` et une classe locale (ex. `.hero__in.container`), ne **JAMAIS** utiliser le raccourci `padding: ...`. Utiliser impérativement les propriétés logiques **`padding-inline`** et **`padding-block`** pour éviter l'écrasement mutuel des axes.

### 4. Accessibilité (a11y) dès la Conception
- **Liens externes :** TOUT lien ouvrant un nouvel onglet (`target="_blank"`) DOIT utiliser la primitive **`<ZExternalLink>`** (`app/components/ui/ZExternalLink.vue`). Elle impose `rel="noopener"` et injecte le libellé masqué accessible `(ouvre dans un nouvel onglet)`.
- **Hiérarchie de titres :** Tout libellé de section eyebrow ouvrant une section sans titre h2 propre doit être un **`<h2 class="eyebrow">`** (le style neutralisé hérite de `font-weight`/`line-height` pour une parité visuelle stricte). Les préfixes décoratifs `// ` doivent être encapsulés dans `<span aria-hidden="true">// </span>`.
- **Séquences :** Toute répétition de cartes ou étapes doit être balisée en listes sémantiques **`<ul>` ou `<ol>` avec `<li>`** (avec `> li { display: flex }` si cartes flex).
- **Contraste forcé (`forced-colors`) :** Tout élément interactif au focus doit intégrer le repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` pour rester visible en mode contraste élevé système.
- **Motion réduit :** Respect universel de `prefers-reduced-motion: reduce`. Le caret natif du terminal est la **seule animation en boucle autorisée** sur le site (CAP-11). Les carets décoratifs doivent être figés visibles.
- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.

### 5. Nuxt 4 Gotchas
- **`<component :is="...">` :** Passer un nom de composant en chaîne de caractères (`:is="'NuxtLink'"`) **ne résout pas** l'auto-import Nuxt. Il faut importer explicitement la référence depuis `#components` (`import { NuxtLink } from "#components"`) et la lier comme valeur.
- **Prerender compatibility :** Le site étant statique, aucun accès direct à `window`, `document` ou `localStorage` n'est toléré en dehors du hook `onMounted` ou d'une garde `import.meta.client`.
- **Génération d'IDs :** Toujours utiliser `useId()` de Nuxt/Vue pour générer des attributs `id` de formulaires hydration-safe.

### 6. Pipeline CI/CD & Déploiement
- Le fichier `public/CNAME` contient **`jouan.ovh`**. Ne jamais le modifier ou le supprimer.
- Le step `Verify static output` dans `.github/workflows/cd.yml` vérifie `grep -qx "jouan.ovh" .output/public/CNAME`. Tout changement de domaine doit être répercuté simultanément sur ces deux fichiers.

---

## 6. Checklist de Validation Qualité (Definition of Done)

Avant de soumettre tout changement ou de clore une tâche, l'agent IA doit exécuter et valider :

1. **Gate Docker verte à 100 % :**
   ```sh
   docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
   ```
   - 0 erreur ESLint / Stylelint.
   - 0 erreur TypeScript vue-tsc.
   - 13 routes pré-rendues statiquement avec succès par Nitro.
2. **Vérification visuelle & comportementale :**
   - Rendu fidèle au Design System (thème sombre aubergine, orange accent, typographie Ubuntu).
   - Navigation clavier fonctionnelle (focus visible, ordre logique).
   - Pas de valeurs CSS en dur non justifiées.

---

## 7. Documents de Référence Complémentaires

- [`docs/project-context.md`](file:///Users/simon/dev/jouan.ovh/docs/project-context.md) : Historique détaillé, leçons apprises par épic et règles fines.
- [`docs/implementation-artifacts/sprint-status.yaml`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/sprint-status.yaml) : Registre officiel des stories et de leur statut.
- [`docs/planning-artifacts/epics.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md) : Cahier des charges et critères d'acceptation des Epics 1 à 10.
- [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md) : Inventaire des arbitrages et améliorations futures optionnelles.

---SPEC COMPANION REFERENCES EXIST?---
docs/specs/spec-home-awwwards/sections-mapping.md
      98 docs/specs/spec-home-awwwards/sections-mapping.md
docs/contexte_malt.md
    1203 docs/contexte_malt.md
docs/direction_strategique_site.md
     628 docs/direction_strategique_site.md

---ABOUT DIFF CONTEXT BASELINE---
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
   136	
   137	const siteUrl = useSiteUrl();
   138	const aboutJsonLd = {
   139	  "@context": "https://schema.org",
   140	  "@type": "ProfilePage",
   141	  name: pageTitle,
   142	  url: `${siteUrl}/about`,
   143	  mainEntity: {
   144	    "@type": "Person",
   145	    name: SITE.profile.name,
   146	    jobTitle: SITE.profile.role,
   147	    url: siteUrl,
   148	    image: `${siteUrl}/images/portrait.jpeg`,
   149	  },
   150	};
   151	
   152	usePageSeo({
   153	  title: pageTitle,
   154	  description: pageDescription,
   155	  path: "/about",
   156	  image: "/images/portrait.jpeg",
   157	  type: "profile",
   158	  twitterCard: "summary",
   159	  jsonLd: aboutJsonLd,
   160	});
   161	</script>
   162	
   163	<style lang="scss" scoped>
   164	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
   165	// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
   166	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   167	.about {
   168	  display: block;
   169	}
   170	
   171	// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
   172	// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
   173	// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
   174	// reproduit l'héritage du corps, comme le ferait un <p>).
   175	.eyebrow {

2026-09-13T19:46:27.390409Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
collab: Wait
2026-09-13T19:46:35.925108Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:46:40.818899Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:46:43.450922Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Le diff est très ciblé : il modifie surtout `/about`, le registre des différés et le statut de sprint. Je vérifie donc séparément les écarts entre les déclarations de validation et les preuves réellement présentes, ainsi que les contraintes DRY/SEO qui s’appliquent à ces changements.
collab: Wait
2026-09-13T19:46:55.729040Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:47:28.358111Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:47:28.537190Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:47:44.731427Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '---MALT POSITION/EXPERIENCES---'; rg -n -i -C 3 'Keova|Linkizz|CINS|Rouen|Full Stack|TypeScript|expérience|experience|NestJS|Nuxt' docs/contexte_malt.md | head -240; printf '%s\\n' '---STRATEGY POSITION---'; rg -n -i -C 3 'Keova|Rouen|Full Stack|TypeScript|NestJS|Nuxt|about|à propos' docs/direction_strategique_site.md | head -220; printf '%s\\n' '---SECTIONS MAPPING---'; sed -n '1,130p' docs/specs/spec-home-awwwards/sections-mapping.md; printf '%s\\n' '---GIT BASELINE STATUS---'; git status --short; git diff --stat -- docs/implementation-artifacts/code-reviews/11-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---MALT POSITION/EXPERIENCES---
8-
9-Le but est qu’un prospect comprenne immédiatement :
10-
11:> **Simon Jouan est un développeur Full Stack TypeScript spécialisé dans la conception et le développement d’applications web et SaaS modernes avec Nuxt et NestJS.**
12-
13:Son expérience en QA, automatisation et IA constitue un **différenciateur**, mais ne doit pas devenir un second positionnement concurrent.
14-
15-Le positionnement principal doit donc rester :
16-
17:**Développeur Full Stack TypeScript — Nuxt / NestJS**
18-
19----
20-
--
33-
34-La vitrine publique doit le présenter d’abord comme :
35-
36:> **développeur Full Stack TypeScript freelance / product builder**
37-
38:Son emploi salarié participe à sa crédibilité et à son expérience, mais n’est pas la proposition de valeur principale du site.
39-
40----
41-
--
43-
44-Simon cherche prioritairement des missions de :
45-
46:- développement Full Stack TypeScript ;
47-- développement d’applications SaaS ;
48-- création de produits web ;
49-- développement d’applications métier ;
50:- développement frontend Nuxt / Vue ;
51:- développement backend NestJS / Node.js ;
52:- évolution ou reprise d’applications TypeScript existantes ;
53-- architecture et développement de MVP ;
54-- intégration d’API et services tiers ;
55-- intégration de paiements, authentification, bases de données, etc.
--
105-
106-Formulation conceptuelle :
107-
108:> **J’aide les startups, PME et équipes produit à concevoir, développer et faire évoluer leurs applications web et SaaS avec TypeScript, Nuxt et NestJS.**
109-
110-Cette phrase sert de boussole.
111-
--
113-
114-Une variante plus directe peut être :
115-
116:> **Développeur Full Stack TypeScript spécialisé dans les applications web et SaaS avec Nuxt et NestJS.**
117-
118-Le message doit rester extrêmement compréhensible.
119-
120-Il ne faut pas remplacer cela par une accroche abstraite du type :
121-
122:> « Je transforme vos idées en expériences numériques innovantes grâce à la puissance de la technologie. »
123-
124-Ce serait joli et complètement inutile.
125-
--
129-
130-Le titre retenu sur Malt est :
131-
132:> **Développeur Full Stack TypeScript — Nuxt / NestJS**
133-
134-C’est également la direction recommandée pour le site.
135-
136-Variantes éventuellement acceptables selon l’emplacement :
137-
138:**Développeur Full Stack TypeScript**
139-
140-ou :
141-
142:**Développeur Full Stack TypeScript spécialisé en Nuxt & NestJS**
143-
144-ou pour une balise SEO / contexte plus descriptif :
145-
146:**Développeur freelance TypeScript, Nuxt & NestJS — applications web et SaaS**
147-
148-Mais le site ne doit pas multiplier les identités :
149-
--
168-
169-Les technologies qui doivent apparaître très clairement :
170-
171:- TypeScript ;
172:- Nuxt ;
173-- Vue.js ;
174:- NestJS ;
175-- Node.js ;
176-- PostgreSQL.
177-
--
209-- MCP ;
210-- n8n ;
211-- Make ;
212:- Nuxt UI ;
213-- PHP ;
214-- Symfony ;
215-- WordPress ;
216-- Drupal ;
217-- Prestashop.
218-
219:Ces compétences peuvent apparaître dans les expériences ou une page détaillée.
220-
221-Elles ne doivent pas envahir le hero ou la proposition de valeur.
222-
223----
224-
225:# 8. Nuxt UI
226-
227:Simon utilise Nuxt UI.
228-
229-Ce n’est néanmoins **pas suffisamment structurant pour devenir une compétence principale de marque personnelle**.
230-
231:Sur Malt, l’idée est de faire sortir Nuxt UI des compétences les plus visibles au profit de **Node.js**.
232-
233-Le site doit suivre la même logique :
234-
235:**Nuxt** est une expertise structurante.
236-
237:**Nuxt UI** est un outil utilisé à l’intérieur de cette expertise.
238-
239----
240-
--
272-
273-L’idée :
274-
275:> **Simon est un développeur Full Stack moderne qui maîtrise profondément les outils IA.**
276-
277-Pas :
278-
--
282-
283-# 10. Le rôle de la QA
284-
285:Simon possède une expérience importante en QA et automatisation de tests.
286-
287-C’est historiquement une vraie partie de son parcours professionnel.
288-
--
292-- tests E2E ;
293-- automatisation web ;
294-- automatisation mobile ;
295:- TypeScript pour le testing ;
296-- Appium ;
297-- WebdriverIO ;
298-- TestCafe ;
--
310-
311-Elle devient :
312-
313:> **un avantage compétitif de Simon comme développeur Full Stack.**
314-
315-Message implicite :
316-
317-> Simon ne sait pas uniquement produire du code. Son parcours QA lui donne une culture particulièrement forte de la fiabilité, des cas limites, de la testabilité et des parcours utilisateurs critiques.
318-
319:C’est intéressant commercialement parce que cela différencie Simon d’un Full Stack qui ne pense qu’à faire fonctionner le happy path.
320-
321----
322-
323:# 11. Expérience Kidizz
324-
325-Simon travaille chez Kidizz depuis plusieurs années.
326-
327:Son expérience y est fortement liée à :
328-
329-- QA ;
330-- automatisation ;
331-- applications web ;
332-- applications mobiles ;
333:- TypeScript ;
334-- Node.js ;
335-- TestCafe ;
336-- Appium ;
--
339-- fiabilisation des parcours critiques ;
340-- utilisation d’agents IA et d’outils modernes dans les workflows QA.
341-
342:Cette expérience doit rester visible.
343-
344-Mais sur le site, elle doit jouer le rôle suivant :
345-
346:> **preuve d’expérience professionnelle longue dans une vraie équipe produit et d’une forte culture software engineering / qualité.**
347-
348:Il ne faut pas essayer artificiellement de transformer Kidizz en mission Full Stack si ce n’est pas ce que Simon y fait réellement.
349-
350----
351-
352:# 12. Keova — preuve principale
353-
354:Keova est probablement **la meilleure preuve actuelle du positionnement Full Stack TypeScript de Simon**.
355-
356:Keova est un SaaS métier développé par Simon.
357-
358-Simon intervient sur :
359-
--
371-
372-Stack principale notamment :
373-
374:- Nuxt 4 ;
375-- Vue ;
376:- TypeScript ;
377:- NestJS ;
378-- Node.js ;
379-- PostgreSQL ;
380-- TypeORM ;
--
382-- Docker ;
383-- services externes.
384-
385:Keova ne doit pas uniquement être présenté comme :
386-
387-> « un logiciel pour professionnelles de l’accompagnement ».
388-
389:Sur le portfolio personnel de Simon, Keova doit surtout devenir une **étude de cas démontrant sa capacité à construire un véritable produit SaaS de bout en bout**.
390-
391-Structure recommandée :
392-
--
408-
409-### Solution
410-
411:Application SaaS Full Stack moderne construite autour de Nuxt / NestJS / PostgreSQL.
412-
413-### Complexité intéressante
414-
--
427-- SEO ;
428-- workflows métier.
429-
430:Keova doit donner au prospect la sensation :
431-
432-> **« Il a déjà construit ce genre de produit. »**
433-
--
441-
---STRATEGY POSITION---
2-
3-Le site ne doit plus être un **portfolio personnel généraliste**.
4-
5:Il doit devenir une **landing page commerciale de développeur freelance Full Stack TypeScript**, conçue pour faire passer un visiteur par ce chemin :
6-
7-> **Je comprends ce qu’il fait → je vois qu’il l’a déjà fait → je crois qu’il peut résoudre mon problème → je le contacte.**
8-
--
14-
15-Le message principal doit être :
16-
17:> **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS.**
18-
19-Tout le site doit renforcer cette idée.
20-
--
33-
34-La hiérarchie doit être :
35-
36:**Full Stack TypeScript**  
37:→ **Nuxt / NestJS**  
38-→ **applications web / SaaS**  
39-→ **culture produit**  
40-→ **QA / qualité**  
--
74-- développement de SaaS ;
75-- développement d’applications métier ;
76-- création de MVP ;
77:- frontend Nuxt ;
78:- backend NestJS ;
79:- développement Full Stack TypeScript ;
80-- évolution d’une application existante ;
81-- reprise d’un produit ;
82-- intégration API / Stripe / auth / base de données ;
--
142-
143-### Qui ?
144-
145:Développeur Full Stack TypeScript.
146-
147-### Spécialité ?
148-
149:Nuxt / NestJS.
150-
151-### Pour quoi ?
152-
--
162-
163-Exemple de direction :
164-
165:> **Développeur Full Stack TypeScript**
166->
167:> Je conçois et développe des applications web et SaaS avec Nuxt, NestJS et PostgreSQL.
168->
169-> De l’architecture au déploiement, j’interviens sur des produits neufs comme sur des applications existantes.
170->
--
192-- concurrence différente ;
193-- perception plus “agence web / site vitrine”.
194-
195:Cela affaiblit directement le positionnement SaaS / Full Stack TypeScript.
196-
197----
198-
--
208-
209-Frontend, backend, base de données, authentification, paiements, API.
210-
211:## 2. Développement Full Stack TypeScript
212-
213:Nuxt / Vue côté frontend.
214-
215:NestJS / Node côté backend.
216-
217-PostgreSQL côté données.
218-
--
230-
231-Le site doit privilégier les **preuves**.
232-
233:La meilleure preuve actuelle est Keova.
234-
235-Puis TryOn.
236-
--
244-
245----
246-
247:# Keova doit devenir la pièce maîtresse
248-
249:Keova doit être présenté comme **case study principal**.
250-
251-Pas uniquement avec une capture et une stack.
252-
--
273-
274-TryOn doit montrer une autre facette :
275-
276:> Full Stack + produit + intégration d’IA générative.
277-
278-Il permet de démontrer que Simon peut manipuler :
279-
--
316-
317-Mais le message doit devenir :
318-
319:> **Je suis un développeur Full Stack avec une forte culture de qualité logicielle.**
320-
321-Cela permet de valoriser :
322-
--
337-
338-La réponse doit être immédiate :
339-
340:> **Développeur Full Stack, avec une expertise QA rare.**
341-
342----
343-
--
374-
375-La stack principale doit être affichée dans cet ordre logique :
376-
377:**TypeScript**  
378:**Nuxt**  
379-**Vue.js**  
380:**NestJS**  
381-**Node.js**  
382-**PostgreSQL**
383-
--
411-
412-## 3. Preuves
413-
414:Keova + TryOn + éventuellement Nodium.
415-
416-## 4. Expertise
417-
418:Full Stack TypeScript.
419-
420:Nuxt / NestJS.
421-
422-PostgreSQL.
423-
--
483-
484-**Accueil**  
485-**Projets**  
486:**À propos**  
487-**Contact**
488-
489-Éventuellement :
--
494-
495----
496-
497:# Rôle de la page À propos
498-
499:La page À propos ne doit pas être un CV.
500-
501-Elle doit expliquer pourquoi le parcours de Simon en fait un meilleur développeur.
502-
--
541-
542-Éviter le jargon dans le hero.
543-
544:Un CTO comprendra NestJS.
545-
546-Un dirigeant de PME, pas forcément.
547-
--
551-
552-avec :
553-
554:> **Nuxt / NestJS / TypeScript**
555-
556-Le besoin avant la techno.
557-
--
561-
562-Le site doit progressivement cibler :
563-
564:- développeur Full Stack TypeScript freelance ;
565:- développeur Nuxt freelance ;
566:- développeur NestJS freelance ;
567-- développeur SaaS ;
568-- développement SaaS ;
569-- développeur Node.js freelance ;
--
578-
579-Après 5 secondes :
580-
581:> **Développeur Full Stack TypeScript / Nuxt / NestJS.**
582-
583-Après 30 secondes :
584-
--
622-
623-Tu peux lui donner cette instruction telle quelle :
624-
625:> **Ne conçois pas le site comme un portfolio exhaustif de Simon. Conçois-le comme un funnel commercial destiné à transformer un prospect recherchant un développeur Full Stack TypeScript en prise de contact. Chaque section doit soit clarifier son positionnement, soit fournir une preuve, soit réduire un doute, soit pousser vers le contact. Si un élément ne remplit aucune de ces fonctions, il est probablement inutile.**
626-
627-Et la règle finale :
628-
629:> **Le site et Malt doivent raconter exactement la même histoire : développeur Full Stack TypeScript spécialisé Nuxt/NestJS, capable de construire et faire évoluer des applications web et SaaS de bout en bout, avec comme différenciateurs une forte culture produit, QA et IA.**
---SECTIONS MAPPING---
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
---GIT BASELINE STATUS---
 M app/pages/about.vue
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md
?? docs/implementation-artifacts/code-reviews/11-5/

2026-09-13T19:48:00.049072Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
collab: Wait
2026-09-13T19:48:05.760059Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:48:16.626343Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T19:48:19.044581Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "git ls-files docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md docs/implementation-artifacts/code-reviews/11-5/full.diff; printf '\\n---DIFF FILE META---\\n'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/11-5/full.diff || true; printf '\\n---CURRENT DIFF AGAINST BASELINE---\\n'; git diff --stat 5dc54f741c8ed022fb916686abf6ba4c8d95b271 -- app/pages/about.vue docs/implementation-artifacts/deferred-work.md docs/implementation-artifacts/sprint-status.yaml; printf '\\n---BASELINE FILE EXISTENCE---\\n'; git cat-file -e 5dc54f741c8ed022fb916686abf6ba4c8d95b271:docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md 2>/dev/null; echo story_exit:"'$?' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

---DIFF FILE META---
 .../code-reviews/11-5/full.diff                    | 113 +++++++++++++++++++++
 1 file changed, 113 insertions(+)

---CURRENT DIFF AGAINST BASELINE---
 app/pages/about.vue                              | 30 +++++++++++++++---------
 docs/implementation-artifacts/deferred-work.md   |  8 +++----
 docs/implementation-artifacts/sprint-status.yaml |  4 ++--
 3 files changed, 25 insertions(+), 17 deletions(-)

---BASELINE FILE EXISTENCE---
story_exit:128

exec
/bin/zsh -lc "nl -ba app/components/ui/ZExternalLink.vue | sed -n '1,120p'; nl -ba app/components/ui/ZButton.vue | sed -n '1,90p'; rg -n 'const (experiences|degrees)|Keova|Linkizz|CINS' app/pages/about.vue docs/implementation-artifacts/deferred-work.md docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md" in /Users/simon/dev/jouan.ovh
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
     4	    v-bind="passthroughAttrs"
     5	    class="zbtn"
     6	    :class="[`zbtn--${variant}`, `zbtn--${size}`]"
     7	    :type="buttonType"
     8	    :disabled="isNativeButton ? disabled || undefined : undefined"
     9	    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    10	    :tabindex="isDisabledNonNative ? -1 : undefined"
    11	    @click="blockDisabledActivation"
    12	    @keydown.enter="blockDisabledActivation"
    13	    @keydown.space="blockDisabledActivation"
    14	  >
    15	    <span v-if="icon || $slots.icon" class="zbtn__icon">
    16	      <component :is="icon" v-if="icon" aria-hidden="true" />
    17	      <slot v-else name="icon" />
    18	    </span>
    19	    <slot />
    20	    <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
    21	      <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
    22	      <slot v-else name="iconRight" />
    23	    </span>
    24	  </component>
    25	</template>
    26	
    27	<script setup lang="ts">
    28	// Primitive bouton du DS — label mono, accent orange Ubuntu en primary.
    29	// Porté de docs/design_system/components/core/Button.jsx (pas de copie JS :
    30	// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
    31	import type { Component } from "vue";
    32	import { computed, useAttrs } from "vue";
    33	
    34	defineOptions({
    35	  inheritAttrs: false,
    36	});
    37	
    38	type IconProp = string | Component;
    39	
    40	interface Props {
    41	  /** Style visuel. @default "primary" */
    42	  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
    43	  /** @default "md" — hauteurs 28 / 36 / 44 */
    44	  size?: "sm" | "md" | "lg";
    45	  /** Icône leading via composant Vue ou nom de composant. */
    46	  icon?: IconProp;
    47	  /** Icône trailing via composant Vue ou nom de composant. */
    48	  iconRight?: IconProp;
    49	  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
    50	  as?: string | Component;
    51	  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
    52	  disabled?: boolean;
    53	}
    54	
    55	const props = withDefaults(defineProps<Props>(), {
    56	  variant: "primary",
    57	  size: "md",
    58	  icon: undefined,
    59	  iconRight: undefined,
    60	  as: "button",
    61	  disabled: false,
    62	});
    63	
    64	const attrs = useAttrs();
    65	// `as` accepte une balise native ("button", "a") ou une référence de composant
    66	// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
    67	const isNativeButton = computed(() => props.as === "button");
    68	const isDisabledNonNative = computed(() => !isNativeButton.value && props.disabled);
    69	const buttonType = computed(() => {
    70	  if (!isNativeButton.value) {
    71	    return undefined;
    72	  }
    73	
    74	  return typeof attrs.type === "string" ? attrs.type : "button";
    75	});
    76	
    77	const passthroughAttrs = computed(() => {
    78	  if (!isDisabledNonNative.value) {
    79	    return attrs;
    80	  }
    81	
    82	  return Object.fromEntries(
    83	    Object.entries(attrs).filter(([key]) => {
    84	      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
    85	    }),
    86	  );
    87	});
    88	
    89	function blockDisabledActivation(event: Event) {
    90	  if (!isDisabledNonNative.value) {
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:29:   **And** tout lien ouvrant un nouvel onglet externe (Keova, profil Malt, GitHub, etc.) consomme obligatoirement la primitive accessible `<ZExternalLink>` avec mention masquée sr-only `(ouvre dans un nouvel onglet)`.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:33:   **Then** la biographie, la description de la page et les expériences récentes sont alignées avec le nouveau positionnement (rôle Full Stack TS, SaaS Keova, Rouen / missions freelance), supprimant les mentions obsolètes orientées PHP/WordPress legacy
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:51:  - [x] Auditer tous les liens sortants : s'assurer de l'utilisation stricte de `<ZExternalLink>` pour Keova, Malt, GitHub, etc., avec annonce sr-only `(ouvre dans un nouvel onglet)`.
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:101:- Harmonisation éditoriale et SEO de `app/pages/about.vue` réalisée : bio et rôle alignés sur Full Stack TypeScript, SaaS Keova, Rouen, expériences Linkizz/CINS ajustées, schéma Schema.org `aboutJsonLd` et `usePageSeo` unifiés.
app/pages/about.vue:107:const experiences = [
app/pages/about.vue:111:    org: "Linkizz",
app/pages/about.vue:117:    org: "CINS",
app/pages/about.vue:129:const degrees = [

collab: Wait
collab: CloseAgent
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
/bin/zsh -lc "rg -n -i 'wordpress|php|valognes|applications en|IA|Nuxt|NestJS|pageDescription|usePageSeo' app/pages app/components | head -240; printf '\\n---PAGES SEO CALLS---\\n'; rg -l 'usePageSeo|useHead' app/pages | sort | xargs -I{} sh -c 'echo --- {}; rg -n \"pageTitle|pageDescription|title:|description:|usePageSeo|useHead\" \"{}\" | head -30'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/HeaderComponent.vue:4:      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
app/components/HeaderComponent.vue:7:      </NuxtLink>
app/components/HeaderComponent.vue:9:      <nav class="hdr__nav" aria-label="Navigation principale">
app/components/HeaderComponent.vue:10:        <NuxtLink
app/components/HeaderComponent.vue:16:          :aria-current="isActive(item.to) ? 'page' : undefined"
app/components/HeaderComponent.vue:19:        </NuxtLink>
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
app/components/HeaderComponent.vue:29:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue:37:          :aria-expanded="menuOpen"
app/components/HeaderComponent.vue:38:          aria-controls="hdr-mobile-menu"
app/components/HeaderComponent.vue:39:          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
app/components/HeaderComponent.vue:49:    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
app/components/HeaderComponent.vue:50:      <NuxtLink
app/components/HeaderComponent.vue:57:        :aria-current="isActive(item.to) ? 'page' : undefined"
app/components/HeaderComponent.vue:61:      </NuxtLink>
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:68:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/HeaderComponent.vue:81:import { NuxtLink } from "#components";
app/components/HeaderComponent.vue:109:// Expose l'ouverture du terminal au reste du site via le lanceur partagé
app/components/HeaderComponent.vue:166:let desktopMq: MediaQueryList | null = null;
app/components/HeaderComponent.vue:167:function onDesktopChange(event: MediaQueryListEvent) {
app/components/HeaderComponent.vue:175:  desktopMq = window.matchMedia("(min-width: 901px)");
app/components/HeaderComponent.vue:324:@media (width <= 1100px) {
app/components/HeaderComponent.vue:330:@media (width <= 1000px) {
app/components/HeaderComponent.vue:337:@media (width >= 901px) {
app/components/HeaderComponent.vue:344:@media (width <= 900px) {
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
app/pages/about.vue:11:            <ZAvatar src="/images/portrait.jpeg" :alt="profile.name" initials="SJ" size="xl" ring />
app/pages/about.vue:19:              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue:30:              applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
app/pages/about.vue:31:              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
app/pages/about.vue:36:              l'exigence QA et l'IA au service du code — tests automatisés, architecture modulaire et intégrations
app/pages/about.vue:98:import { NuxtLink } from "#components";
app/pages/about.vue:112:    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
app/pages/about.vue:130:  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
app/pages/about.vue:136:const pageDescription =
app/pages/about.vue:137:  "Développeur web freelance à Rouen, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.";
app/pages/about.vue:160:usePageSeo({
app/pages/about.vue:162:  description: pageDescription,
app/pages/about.vue:181:// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
app/pages/about.vue:278:// Rail vertical + points partagent un même axe (--tl-axis) et sont centrés dessus via
app/pages/about.vue:373:// ---- Responsive (cf. kit.css @media max-width: 900px : .grid-2 → 1 colonne) ----
app/pages/about.vue:374:@media (width <= 900px) {
app/components/LinkListComponent.vue:3:    <li v-for="social in socials" :key="social.icon">
app/components/LinkListComponent.vue:4:      <HexagonLinkComponent :link="social.url">
app/components/LinkListComponent.vue:5:        <template #icon><ZIcon :name="social.icon" /></template>
app/components/LinkListComponent.vue:6:        <template #title>{{ social.label }}</template>
app/components/LinkListComponent.vue:13:// Rangée d'hexagones sociaux (footer / contact). Glyphes centralisés via ZIcon (story 2.7).
app/components/LinkListComponent.vue:15:const socials = [
app/pages/blog/[...slug].vue:7:               Le glyphe ← est décoratif (aria-hidden) : le lecteur d'écran lit « Retour au blog ». -->
app/pages/blog/[...slug].vue:8:          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>
app/pages/blog/[...slug].vue:21:            <span aria-hidden="true">·</span>
app/pages/blog/[...slug].vue:24:              <span aria-hidden="true">·</span>
app/pages/blog/[...slug].vue:29:          <NuxtImg
app/pages/blog/[...slug].vue:40:          <!-- Corps de l'article : HTML généré par @nuxt/content, stylé via :deep() -->
app/pages/blog/[...slug].vue:48:            <ZButton :as="NuxtLink" to="/contact" variant="primary">
app/pages/blog/[...slug].vue:62:// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
app/pages/blog/[...slug].vue:63:// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue:64:import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue:92:// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
app/pages/blog/[...slug].vue:94:const initialError = resolveContentError();
app/pages/blog/[...slug].vue:95:if (initialError) {
app/pages/blog/[...slug].vue:96:  throw initialError;
app/pages/blog/[...slug].vue:112:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
app/pages/blog/[...slug].vue:113:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
app/pages/blog/[...slug].vue:115:usePageSeo(() => {
app/pages/blog/[...slug].vue:211:// Méta : base mono via .post__meta (global) ; ici on ajoute la marge de l'en-tête.
app/pages/blog/[...slug].vue:226:// ---- Prose (HTML généré par @nuxt/content → cibler via :deep()) ----
app/pages/blog/[...slug].vue:285:  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
app/components/FooterComponent.vue:6:          <NuxtLink to="/" class="ftr__brand">
app/components/FooterComponent.vue:9:          </NuxtLink>
app/components/FooterComponent.vue:13:        <nav class="ftr__col" aria-label="Navigation du pied de page">
app/components/FooterComponent.vue:15:          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
app/components/FooterComponent.vue:54:  { to: "/confidentialite", label: "Confidentialité" },
app/components/FooterComponent.vue:201:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue:9:// Lien social en hexagone — motif patrimonial du footer/contact, restylé DS (story 2.8).
app/components/HexagonLinkComponent.vue:10:// Hexagone via clip-path (cf. kit.css .hex) ; glyphe en currentColor (ZIcon, story 2.7).
app/components/HexagonLinkComponent.vue:12:  /** URL externe (réseau social). */
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
app/pages/blog/index.vue:9:          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:16:              <NuxtImg
app/pages/blog/index.vue:38:                    <span aria-hidden="true">·</span>
app/pages/blog/index.vue:49:          <NuxtImg
app/pages/blog/index.vue:63:        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
app/pages/blog/index.vue:65:          <NuxtImg
app/pages/blog/index.vue:85:// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
app/pages/blog/index.vue:88:import { NuxtLink } from "#components";
app/pages/blog/index.vue:100:// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
app/pages/blog/index.vue:104:const pageDescription =
app/pages/blog/index.vue:105:  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
app/pages/blog/index.vue:114:  description: pageDescription,
app/pages/blog/index.vue:145:usePageSeo({
app/pages/blog/index.vue:147:  description: pageDescription,
app/pages/blog/index.vue:254:// ---- Responsive (cf. kit.css @media max-width: 900px : .post → 1 colonne) ----
app/pages/blog/index.vue:255:@media (width <= 900px) {
app/pages/services.vue:6:        <p class="eyebrow"><span aria-hidden="true">// </span>services</p>
app/pages/services.vue:9:          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
app/pages/services.vue:30:                  :as="NuxtLink"
app/pages/services.vue:32:                  :variant="offer.featured ? 'primary' : 'secondary'"
app/pages/services.vue:33:                  :aria-label="`Discuter du projet — ${offer.title}`"
app/pages/services.vue:48:        <p class="eyebrow"><span aria-hidden="true">// </span>comment ça se passe</p>
app/pages/services.vue:53:            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
app/pages/services.vue:60:          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue:73:import { NuxtLink } from "#components";
app/pages/services.vue:93:    id: "wordpress",
app/pages/services.vue:95:    title: "WordPress sur-mesure",
app/pages/services.vue:105:    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
app/pages/services.vue:106:    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
app/pages/services.vue:111:    id: "ia",
app/pages/services.vue:113:    title: "IA & automatisation",
app/pages/services.vue:114:    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
app/pages/services.vue:138:    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
app/pages/services.vue:163:usePageSeo({
app/pages/services.vue:166:    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
app/pages/services.vue:214:// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
app/pages/services.vue:348:// ---- Responsive (cf. kit.css @media max-width: 900px) ----
app/pages/services.vue:349:@media (width <= 900px) {
app/components/WindowWrapperComponent.vue:239:@use "assets/scss/abstract/variables" as _variables;
app/components/WindowWrapperComponent.vue:297:  @media (min-width: _function.breakpoint("lg")) {
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/terminal/TerminalManagerComponent.vue:35:// appeler cette même méthode via sa ref. → on l'expose explicitement.
app/pages/confidentialite.vue:5:        <p class="eyebrow"><span aria-hidden="true">// </span>confidentialité</p>
app/pages/confidentialite.vue:6:        <h1 class="legal__title">Politique de confidentialité</h1>
app/pages/confidentialite.vue:30:                <strong>Formulaire de contact :</strong> lorsque vous envoyez un message via la page
app/pages/confidentialite.vue:31:                <NuxtLink to="/contact" class="legal__link">Contact</NuxtLink>, je collecte votre <strong>nom</strong>,
app/pages/confidentialite.vue:73:              Aucune donnée personnelle n'est vendue, louée ou cédée à des tiers à des fins commerciales ou
app/pages/confidentialite.vue:82:              traitement de votre demande et aux échanges commerciaux qui en découlent, dans la limite maximale de
app/pages/confidentialite.vue:153:import { usePageSeo } from "~/composables/usePageSeo";
app/pages/confidentialite.vue:157:usePageSeo({
app/pages/confidentialite.vue:158:  title: "Politique de confidentialité — jouan.ovh",
app/pages/confidentialite.vue:160:    "Politique de confidentialité et protection des données personnelles (RGPD) du site jouan.ovh — Simon Jouan.",
app/pages/confidentialite.vue:161:  path: "/confidentialite",
app/pages/confidentialite.vue:240:@media (width <= 640px) {
app/pages/contact.vue:8:            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
app/pages/contact.vue:16:                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
app/pages/contact.vue:18:              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
app/pages/contact.vue:22:            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
app/pages/contact.vue:27:              <div class="contact__hp" aria-hidden="true">
app/pages/contact.vue:58:                placeholder="Site WordPress, application, IA…"
app/pages/contact.vue:75:                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
app/pages/contact.vue:82:                En envoyant ce formulaire, vos nom, email, sujet et message sont transmis via Web3Forms à seule fin de
app/pages/contact.vue:84:                <NuxtLink to="/confidentialite" class="contact__rgpd-link">politique de confidentialité</NuxtLink>.
app/pages/contact.vue:89:          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
app/pages/contact.vue:96:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
app/pages/contact.vue:102:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
app/pages/contact.vue:106:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
app/pages/contact.vue:114:            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
app/pages/contact.vue:116:              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
app/pages/contact.vue:117:              <p class="contact__prompt" aria-hidden="true">
app/pages/contact.vue:121:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue:127:            <!-- Hexagones sociaux (composant partagé avec le footer) -->
app/pages/contact.vue:138:// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
app/pages/contact.vue:145:// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
app/pages/contact.vue:163:// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
app/pages/contact.vue:167:// Message d'erreur par champ requis ("" = valide). Rendu sous le champ via ZInput.
app/pages/contact.vue:217:    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
app/pages/contact.vue:261:    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
app/pages/contact.vue:275:usePageSeo({
app/pages/contact.vue:278:    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
app/pages/contact.vue:397://  Colonne droite (story 7.2) : infos / CTA terminal / socials
app/pages/contact.vue:480:// ---- Responsive (cf. kit.css @media max-width: 900px : grilles → 1 colonne) ----
app/pages/contact.vue:481:@media (width <= 900px) {
app/components/terminal/interfaces/IProgram.ts:6:  initialData?: string;
app/components/terminal/interfaces/IProgram.ts:10:    initialData?: string,
app/components/card/ZCardHeader.vue:3:    <nuxt-picture :src="img.src" :img-attrs="img.attr" />
app/components/terminal/TerminalComponent.vue:17:            aria-label="Fermer le terminal"
app/components/terminal/TerminalComponent.vue:22:          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:23:          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:51:          aria-label="Saisie de commande du terminal"
app/components/terminal/TerminalComponent.vue:69:// sans course asynchrone qui laissait parfois la config vide à l'initialisation.
app/components/terminal/TerminalComponent.vue:106:  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
app/components/terminal/TerminalComponent.vue:109:if (defaultConfig.value.initialData) {
app/components/terminal/TerminalComponent.vue:111:    text: defaultConfig.value.initialData,
app/components/terminal/TerminalComponent.vue:128:// Pousse la commande saisie dans l'historique, réinitialise la navigation et vide la saisie.
app/components/terminal/TerminalComponent.vue:140:    // pour vider l'écran sans écho ni ligne résiduelle. La commande reste découvrable via
app/components/terminal/TerminalComponent.vue:170:      program.initialData,
app/components/terminal/TerminalComponent.vue:173:  // La commande provient de la saisie utilisateur : on l'échappe car la réponse est rendue via v-html.
app/components/terminal/TerminalComponent.vue:473:    // Sorties de commandes injectées via v-html : HTML pretty-printé (\n + indentation) qui,
app/components/terminal/TerminalComponent.vue:476:    // initiale, en `<br>` + espaces insécables, rend correctement en `normal`).
app/pages/mentions-legales.vue:5:        <p class="eyebrow"><span aria-hidden="true">// </span>mentions</p>
app/pages/mentions-legales.vue:9:          <strong>jouan.ovh</strong> (conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
app/pages/mentions-legales.vue:44:              <strong>GitHub, Inc.</strong> (via le service GitHub Pages)<br />
app/pages/mentions-legales.vue:80:              personnelles (notamment via le formulaire de contact), ainsi qu'aux modalités d'exercice de vos droits
app/pages/mentions-legales.vue:82:              <NuxtLink to="/confidentialite" class="legal__link">politique de confidentialité</NuxtLink>.
app/pages/mentions-legales.vue:93:import { usePageSeo } from "~/composables/usePageSeo";
app/pages/mentions-legales.vue:97:usePageSeo({
app/pages/mentions-legales.vue:179:@media (width <= 640px) {
app/components/home/HomeAtmosComponent.vue:2:  <div class="atmos" aria-hidden="true">
app/components/home/HomeAtmosComponent.vue:14:// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
app/components/home/HomeAtmosComponent.vue:40:  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
app/components/home/HomeAtmosComponent.vue:50:  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
app/components/home/HomeAtmosComponent.vue:60:  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
app/components/home/HomeAtmosComponent.vue:68:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 6%, transparent) 1px, transparent 1px);
app/components/home/HomeAtmosComponent.vue:70:  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
app/components/home/HomeAtmosComponent.vue:87:  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
app/components/home/HomeAtmosComponent.vue:123:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeStackMarquee.vue:2:  <div v-if="skillsList.length" class="marquee" aria-hidden="true">
app/components/home/HomeStackMarquee.vue:7:        <span class="marquee__star" aria-hidden="true">✦</span>
app/components/home/HomeStackMarquee.vue:16:        <span class="marquee__star" aria-hidden="true">✦</span>
app/components/home/HomeStackMarquee.vue:25:// Défilement continu pur CSS masqué aux lecteurs d'écran (aria-hidden="true").
app/components/home/HomeStackMarquee.vue:32:  nuxt: "Nuxt 4",
app/components/home/HomeStackMarquee.vue:34:  "nest.js": "NestJS",
app/components/home/HomeStackMarquee.vue:103:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue:12:          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
app/pages/index.vue:14:            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
app/pages/index.vue:17:              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
app/pages/index.vue:22:              <span class="hero__pulse-dot" aria-hidden="true" />
app/pages/index.vue:25:                <span aria-hidden="true"> · </span>
app/pages/index.vue:31:              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/index.vue:35:              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
app/pages/index.vue:53:        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je propose</p>
app/pages/index.vue:78:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
app/pages/index.vue:80:              </NuxtLink>
app/pages/index.vue:91:          <p class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</p>
app/pages/index.vue:118:              <span v-if="project.url" class="work__go" aria-hidden="true">
app/pages/index.vue:140:            <p class="eyebrow"><span aria-hidden="true">// </span>~/journal</p>
app/pages/index.vue:143:          <NuxtLink to="/blog" class="seeall" data-hot>
app/pages/index.vue:146:          </NuxtLink>
app/pages/index.vue:152:            <ZCard :as="NuxtLink" :to="article.path" :padded="false" interactive class="jpost" data-hot>
app/pages/index.vue:153:              <NuxtImg
app/pages/index.vue:174:                    <span aria-hidden="true">·</span>
app/pages/index.vue:177:                  <span class="jpost__arrow" aria-hidden="true">
app/pages/index.vue:190:          <ZButton :as="NuxtLink" to="/blog" variant="secondary" size="sm"> Consulter la section blog </ZButton>
app/pages/index.vue:199:          <p class="eyebrow cta__eyebrow"><span aria-hidden="true">$ </span>./contact --start</p>
app/pages/index.vue:202:            Que ce soit pour concevoir un nouveau SaaS, accélérer votre roadmap ou fiabiliser votre stack TypeScript,
app/pages/index.vue:206:            <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg" data-hot>
app/pages/index.vue:214:              variant="secondary"
app/pages/index.vue:220:            <ZButton :as="NuxtLink" to="/about" variant="ghost" size="lg" data-hot> Voir le parcours &amp; CV </ZButton>
app/pages/index.vue:230:// Architecture multi-pages Nuxt 4, dark-first, accent orange.
app/pages/index.vue:232:import { NuxtLink, ZExternalLink } from "#components";
app/pages/index.vue:263:      "Applications Vue 3 / Nuxt 4 & NestJS",
app/pages/index.vue:266:    tags: ["Nuxt", "NestJS", "PostgreSQL", "Stripe Connect"],
app/pages/index.vue:277:      "Composants Vue 3 / Nuxt avec TypeScript strict",
app/pages/index.vue:278:      "Microservices & backend modulaire NestJS",
app/pages/index.vue:279:      "Fiabilisation et optimisation des performances",
app/pages/index.vue:281:    tags: ["TypeScript", "Vue 3", "Nuxt", "NestJS", "Node.js"],
app/pages/index.vue:290:    desc: "Modernisation de codebase, refactoring, ajout de fonctionnalités critiques et fiabilisation par les tests automatisés (culture QA).",
app/pages/index.vue:342:usePageSeo({

---PAGES SEO CALLS---
--- app/pages/about.vue
135:const pageTitle = "À propos — jouan.ovh";
136:const pageDescription =
143:  name: pageTitle,
160:usePageSeo({
161:  title: pageTitle,
162:  description: pageDescription,
--- app/pages/blog/[...slug].vue
112:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
113:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
115:usePageSeo(() => {
130:    description: article.description,
150:    title: `${article.title} — jouan.ovh`,
152:    description: article.description,
--- app/pages/blog/index.vue
103:const pageTitle = "Blog — jouan.ovh";
104:const pageDescription =
114:  description: pageDescription,
119:    description: article.description,
145:usePageSeo({
146:  title: pageTitle,
147:  description: pageDescription,
--- app/pages/confidentialite.vue
153:import { usePageSeo } from "~/composables/usePageSeo";
157:usePageSeo({
158:  title: "Politique de confidentialité — jouan.ovh",
159:  description:
--- app/pages/contact.vue
260:  description:
275:usePageSeo({
276:  title: "Contact — jouan.ovh",
277:  description:
--- app/pages/index.vue
245:  title: string;
259:    title: "Création d'applications web & SaaS",
274:    title: "Développement Full Stack TypeScript",
289:    title: "Évolution & Architecture applicative",
324:    description: SITE.profile.role,
342:usePageSeo({
343:  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
344:  description:
--- app/pages/mentions-legales.vue
93:import { usePageSeo } from "~/composables/usePageSeo";
97:usePageSeo({
98:  title: "Mentions légales — jouan.ovh",
99:  description: "Mentions légales, informations éditeur et hébergement du site jouan.ovh — Simon Jouan.",
--- app/pages/services.vue
81:  title: string;
95:    title: "WordPress sur-mesure",
104:    title: "Applications web",
113:    title: "IA & automatisation",
125:  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
126:  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
127:  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
128:  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
137:  description:
148:        description: offer.desc,
156:          description: offer.price,
163:usePageSeo({
164:  title: "Services — jouan.ovh",
165:  description:

2026-09-13T19:49:54.309346Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Les vérifications convergent vers deux écarts certains dans le diff : une duplication de la ville hors de `SITE.profile` et des métadonnées de sprint incohérentes. Je termine le tri en distinguant ces défauts des éléments simplement préexistants ou déjà explicitement différés.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T19:50:24.658551Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:50:32.720886Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 132 column 5
2026-09-13T19:50:40.840947Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 17290ms:
 Container jouanovh-web-run-2578b889d8f6 Created 
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 12.02ms (0 cached, 1 parsed)

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
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/about.CNQdgbz-.css                              3.78 kB │ gzip:   1.06 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/_...Xw9nepfy.css                                4.30 kB │ gzip:   0.90 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/contact.CccJ7Dqb.css                            5.08 kB │ gzip:   1.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/default.CvwmGadH.css                            9.77 kB │ gzip:   2.20 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.QaoIl47T.css                             10.41 kB │ gzip:   3.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.DMfCQEaG.css                             20.62 kB │ gzip:   3.95 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlAUqK2U.js                                     0.09 kB │ gzip:   0.10 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CPkQ2127.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Ct1aOXsu.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/nVD4tIj-.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BYmvK79i.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/bmgdC1mU.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/PmOhjyiC.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CjiwnfF3.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C4HY0vcw.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/FgYZWgyI.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BB2oglIy.js                                     0.24 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BskfQc9T.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Cg_X4X3R.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C0lLcS0c.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BwAiM8SP.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dnm7x7xL.js                                     0.25 kB │ gzip:   0.21 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DOTGvT7I.js                                     0.26 kB │ gzip:   0.22 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/pyS92xxS.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ByqcqfxP.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BoiAFJaw.js                                     0.48 kB │ gzip:   0.36 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Df1e_Fia.js                                     0.49 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/-2eSKYAj.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DMdeK-xR.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Db6CAVnZ.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bm3Ir64K.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D2yr_RVE.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZHjoULDA.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BE28POIv.js                                     0.63 kB │ gzip:   0.37 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C5kBhkzk.js                                     0.64 kB │ gzip:   0.43 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Ttj41hKJ.js                                     0.79 kB │ gzip:   0.46 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B8HUDdjV.js                                     1.20 kB │ gzip:   0.66 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CKRA2ZIi.js                                     1.30 kB │ gzip:   0.58 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BDFdC5ll.js                                     1.31 kB │ gzip:   0.75 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B2mC__QH.js                                     2.82 kB │ gzip:   1.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CEomiNLD.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/yn1RQdRi.js                                     3.76 kB │ gzip:   1.80 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BbQtQDWV.js                                     3.79 kB │ gzip:   1.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BAo9kZ7T.js                                     4.77 kB │ gzip:   2.18 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CDY-4fz5.js                                     4.92 kB │ gzip:   2.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DJ5ZwPza.js                                     5.40 kB │ gzip:   2.49 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DaqJqcNJ.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/COtIe_9B.js                                     6.01 kB │ gzip:   2.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/lG-r0d1C.js                                     7.68 kB │ gzip:   2.92 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CIAoCaau.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CtCk5K_u.js                                     8.96 kB │ gzip:   3.57 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/kNgPLO4c.js                                    12.36 kB │ gzip:   4.89 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D7i_xXTQ.js                                    20.51 kB │ gzip:   7.24 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D4kMKQq4.js                                    32.42 kB │ gzip:  11.77 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/GqpEtoiw.js                                    46.45 kB │ gzip:  19.11 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DWRHJJAY.js                                   187.37 kB │ gzip:  70.82 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D2mGdTrD.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.87s
✔ Client built in 2879ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 399 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.57s
✔ Server built in 2584ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /200.html (54ms)
[nitro]   ├─ /404.html (54ms)
[nitro]   ├─ / (64ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (64ms)
[nitro]   ├─ /confidentialite (35ms)
[nitro]   ├─ /contact (36ms)
[nitro]   ├─ /services (36ms)
[nitro]   ├─ /mentions-legales (35ms)
[nitro]   ├─ /about (37ms)
[nitro]   ├─ /blog (37ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (78ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (93ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (98ms)
[nitro] ℹ Prerendered 13 routes in 2.992 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

exec
/bin/zsh -lc "nl -ba app/composables/useSiteUrl.ts | sed -n '1,100p'; printf '\\n---ABOUT SEO CURRENT/DIFF LOCATIONS---\\n'; git diff --unified=0 5dc54f741c8ed022fb916686abf6ba4c8d95b271 -- app/pages/about.vue docs/implementation-artifacts/deferred-work.md docs/implementation-artifacts/sprint-status.yaml" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
     2	// La valeur vient de `runtimeConfig.public.siteUrl` (défaut prod https://jouan.ovh dans nuxt.config,
     3	// surchargeable par NUXT_PUBLIC_SITE_URL). ⚠️ `useRuntimeConfig()` n'est
     4	// appelable QUE dans un contexte Nuxt (setup de composant, plugin, middleware) — d'où ce
     5	// composable, à consommer dans le `<script setup>` des pages, pas au niveau module d'un util
     6	// pur (raison pour laquelle l'ancienne constante `SITE_URL` de app/utils/seo.ts a été retirée).
     7	export function useSiteUrl(): string {
     8	  const siteUrl = useRuntimeConfig().public.siteUrl;
     9	  // Garde-fou fail-fast (décision D1, revue 2026-07-02) : une valeur vide ou non absolue
    10	  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
    11	  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
    12	  // échouer le prerender (`generate`) tôt et bruyamment plutôt que de livrer du SEO cassé.
    13	  let url: URL;
    14	  try {
    15	    url = new URL(siteUrl);
    16	  } catch {
    17	    throw new Error(
    18	      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une URL absolue (http[s]://), ` +
    19	        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    20	    );
    21	  }
    22	
    23	  const isHttpProtocol = url.protocol === "http:" || url.protocol === "https:";
    24	  const isOriginOnly = url.pathname === "/" && url.search === "" && url.hash === "";
    25	  if (!isHttpProtocol || !url.hostname || !isOriginOnly) {
    26	    throw new Error(
    27	      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une origin http(s) sans chemin, query ni hash, ` +
    28	        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    29	    );
    30	  }
    31	
    32	  // Retourne l'origin normalisée pour une concaténation sûre (`${siteUrl}/about`),
    33	  // y compris si l'override est saisi avec un slash final.
    34	  return url.origin;
    35	}

---ABOUT SEO CURRENT/DIFF LOCATIONS---
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 6a08e8a..794edfe 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -28,3 +28,4 @@
-              Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de
-              basculer dans le code. Aujourd'hui je conçois des applications en <strong>PHP/Symfony</strong>, des sites
-              <strong>WordPress</strong> sur-mesure, et des produits en <strong>Node.js / Nest.js / Nuxt.js</strong>.
+              Développeur web freelance basé à <strong>Rouen</strong>, je viens d'un parcours technique (métrologie,
+              instrumentation) avant de basculer avec passion dans le code. Aujourd'hui, je conçois et développe des
+              applications web et produits SaaS modernes avec <strong>Vue 3 / Nuxt 4</strong>,
+              <strong>NestJS</strong> et <strong>PostgreSQL</strong>.
@@ -33,3 +34,4 @@
-              Je suis aussi fondateur du SaaS
-              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
-              service du code — agents, automatisations, intégrations LLM.
+              Je suis également co-fondateur de la plateforme SaaS
+              <ZExternalLink href="https://keova.app">keova.app</ZExternalLink>, et j'intègre l'automatisation,
+              l'exigence QA et l'IA au service du code — tests automatisés, architecture modulaire et intégrations
+              d'APIs.
@@ -103 +105 @@ const skills = SITE.skills;
-// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
+// Expériences (de la plus récente à la plus ancienne).
@@ -108 +110 @@ const experiences = [
-    role: "Testeur QA",
+    role: "Testeur QA & Développeur TypeScript",
@@ -110 +112 @@ const experiences = [
-    desc: "Tests automatisés — Node.js, TypeScript, TestCafé.",
+    desc: "Tests automatisés et fiabilisation applicative — Node.js, TypeScript, TestCafé.",
@@ -116 +118 @@ const experiences = [
-    desc: "PHP/MySQL, Symfony 4/5, Drupal, Prestashop, WordPress, Docker.",
+    desc: "Développement d'applications web, APIs et intégrations sur-mesure, Docker.",
@@ -135 +137 @@ const pageDescription =
-  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
+  "Développeur web freelance à Rouen, je conçois des applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL — découvrez mon parcours.";
@@ -148,0 +151,6 @@ const aboutJsonLd = {
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
+      addressCountry: "FR",
+    },
diff --git a/docs/implementation-artifacts/deferred-work.md b/docs/implementation-artifacts/deferred-work.md
index 37ac248..c3c42ba 100644
--- a/docs/implementation-artifacts/deferred-work.md
+++ b/docs/implementation-artifacts/deferred-work.md
@@ -145,4 +145,4 @@ _Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont
-- **Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil** (`app/pages/index.vue`) — L'en-tête hero de `index.vue` conserve temporairement l'ancienne accroche et les tags PHP/WordPress jusqu'à son remplacement par JouanOS. → Prévu dans la **Story 11.2** (Séquence de boot interactive JouanOS et hero commercial cinétique).
-- **Marquee de stack moderne ordonnée et mise en avant des 3 services** (`app/pages/index.vue`) — La section des compétences et des services n'affiche pas encore le marquee ni les 3 offres commerciales. → Prévu dans la **Story 11.3** (Marquee de stack moderne et vitrine des 3 services cibles).
-- **Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt** (`app/pages/index.vue`) — Les indicateurs chiffrés, le journal et le lien de conversion Malt ne sont pas encore intégrés sur la home. → Prévu dans la **Story 11.4** (Preuves concrètes SaaS, journal technique et CTA final de conversion).
-- **Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`) — Révision globale du SEO de `about.vue` et des pages secondaires pour refléter la nouvelle position commerciale Full Stack TS. → Prévu dans la **Story 11.5** (Validation transverse a11y multi-pages, SSG Nitro et gate Docker).
+- ~~**Alignement de la copie commerciale, terminal JouanOS et tags hero de la page d'accueil**~~ — ✅ **Résolu en 11.2** (`HomeBootOverlay.vue`, `HomeHeroTerminal.vue`, `index.vue`).
+- ~~**Marquee de stack moderne ordonnée et mise en avant des 3 services**~~ — ✅ **Résolu en 11.3** (`HomeStackMarquee.vue`, `index.vue`).
+- ~~**Preuves statistiques SaaS (100k+, 85%), journal technique et bouton CTA vers profil Malt**~~ — ✅ **Résolu en 11.4** (projets SaaS, stats clés, journal, cta final dans `index.vue`).
+- ~~**Audit SEO transverse et mise à jour des métadonnées secondaires** (`app/pages/about.vue`)~~ — ✅ **Résolu en 11.5** (`about.vue` : bio, rôle Full Stack TS, localisation Rouen, expériences et JSON-LD synchronisés).
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index f8ab73d..98b76e7 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -38 +38 @@ generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.4 done : Preuves SaaS, Journal & CTA final)"
+last_updated: "2026-09-13 (Story 11.5 ready-for-dev : Validation transverse a11y, multi-pages & Gate Docker)"
@@ -126 +126 @@ development_status:
-  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: ready-for-dev
+  11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: review

2026-09-13T19:50:55.965285Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'git check-ignore -v docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md docs/implementation-artifacts/code-reviews/11-5/full.diff || true; git status --short --untracked-files=all | head -30; ls -la docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md docs/implementation-artifacts/code-reviews/11-5/full.diff' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/pages/about.vue
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md
?? docs/implementation-artifacts/code-reviews/11-5/full.diff
?? docs/implementation-artifacts/code-reviews/11-5/prompt-acceptance-auditor.md
?? docs/implementation-artifacts/code-reviews/11-5/prompt-blind-hunter.md
?? docs/implementation-artifacts/code-reviews/11-5/prompt-edge-case-hunter.md
?? docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md
?? docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md
?? docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json
-rw-r--r--@ 1 simon  staff  12034 Sep 13 21:38 docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md
-rw-r--r--@ 1 simon  staff   7527 Sep 13 21:44 docs/implementation-artifacts/code-reviews/11-5/full.diff

2026-09-13T19:51:04.783098Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/components/home/HomeHeroTerminal.vue | sed -n '340,405p'; nl -ba app/components/terminal/TerminalComponent.vue | sed -n '360,390p;450,480p'; nl -ba app/components/ui/ZInput.vue | sed -n '155,190p'; nl -ba docs/implementation-artifacts/deferred-work.md | sed -n '190,225p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
   340	  padding: 0;
   341	  font: inherit;
   342	  text-align: left;
   343	  cursor: pointer;
   344	  background: none;
   345	  border: none;
   346	  border-radius: var(--radius-xs);
   347	
   348	  &:focus-visible {
   349	    outline: 2px solid transparent;
   350	    outline-offset: 2px;
   351	    box-shadow: var(--ring-accent);
   352	  }
   353	}
   354	
   355	.prm {
   356	  font-family: var(--font-mono);
   357	}
   358	
   359	.prm__user {
   360	  font-weight: var(--fw-bold);
   361	  color: var(--prompt);
   362	}
   363	
   364	.prm__sep {
   365	  color: var(--ink-1);
   366	}
   367	
   368	.prm__dir {
   369	  font-weight: var(--fw-bold);
   370	  color: var(--term-blue);
   371	}
   372	
   373	.prm__cmd {
   374	  color: var(--ink-1);
   375	}
   376	
   377	.prm__caret {
   378	  display: inline-block;
   379	  width: 0.55em;
   380	  height: 1.05em;
   381	  margin-left: 1px;
   382	  vertical-align: text-bottom;
   383	  background: var(--prompt);
   384	  animation: caret-blink 1s steps(1) infinite;
   385	}
   386	
   387	@media (prefers-reduced-motion: reduce) {
   388	  .prm__caret {
   389	    animation: none;
   390	  }
   391	}
   392	</style>
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
   461	      outline: none;
   462	
   463	      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
   464	      // éditable (il suit la frappe). AUCUNE animation CSS en boucle n'est ajoutée →
   465	      // contrainte « caret = seule boucle » (CAP-11) respectée par construction. `caret-shape:
   466	      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
   467	      // barre ailleurs (Firefox/Safari). (Le caret texte natif n'est pas piloté par
   468	      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
   469	      caret-color: var(--prompt);
   470	      caret-shape: block;
   471	    }
   472	
   473	    // Sorties de commandes injectées via v-html : HTML pretty-printé (\n + indentation) qui,
   474	    // sous le `white-space: pre-wrap` du corps, afficherait lignes vides et décalages. On
   475	    // rétablit `normal` pour ces conteneurs (le DS garde `pre-wrap` pour l'ASCII ; la bannière
   476	    // initiale, en `<br>` + espaces insécables, rend correctement en `normal`).
   477	    .terminal-response {
   478	      white-space: normal;
   479	    }
   480	
   155	  font-size: var(--fs-base);
   156	  color: var(--text-strong);
   157	  background: var(--bg-input);
   158	  border: 1px solid var(--border-default);
   159	  border-radius: var(--radius-md);
   160	  transition:
   161	    border-color var(--dur-fast) var(--ease-standard),
   162	    box-shadow var(--dur-fast) var(--ease-standard);
   163	
   164	  &::placeholder {
   165	    // Contraste (story 9.2) : remonté d'un palier (--text-faint → --text-muted).
   166	    // Le champ porte un <label> ; le placeholder reste supplémentaire mais lisible.
   167	    color: var(--text-muted);
   168	  }
   169	
   170	  &:hover {
   171	    border-color: var(--border-strong);
   172	  }
   173	
   174	  &:focus {
   175	    // Outline transparent → rendu en couleur système sous forced-colors (où la
   176	    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
   177	    outline: 2px solid transparent;
   178	    outline-offset: 2px;
   179	    border-color: var(--accent);
   180	    box-shadow: var(--ring-accent);
   181	  }
   182	}
   183	
   184	.ztextarea {
   185	  height: auto;
   186	  min-height: 110px;
   187	  padding: var(--space-3);
   188	  line-height: var(--lh-normal);
   189	  resize: vertical;
   190	}

exec
/bin/zsh -lc "if test -f docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md; then sed -n '1,240p' docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md; fi; if test -f docs/implementation-artifacts/code-reviews/11-5/prompt-acceptance-auditor.md; then printf '\\n---PROMPT---\\n'; sed -n '1,160p' docs/implementation-artifacts/code-reviews/11-5/prompt-acceptance-auditor.md; fi" in /Users/simon/dev/jouan.ovh
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
session id: 01a09c4d-82e6-7b22-9015-3ff3613f4a2c
--------
user
# Acceptance Auditor Prompt — Story 11.5

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.5), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `docs/implementation-artifacts/deferred-work.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-5/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise le skill `bmad-code-review` pour auditer le diff de façon adversariale contre les critères d’acceptation et les contraintes projet, puis je vérifierai les preuves directement dans les artefacts référencés.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && printf '\\n---FILES---\\n' && printf '%s\\n' docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md docs/planning-artifacts/epics.md docs/project-context.md docs/specs/spec-home-awwwards/SPEC.md docs/implementation-artifacts/deferred-work.md docs/implementation-artifacts/code-reviews/11-5/full.diff AGENTS.md | xargs -n1 sh -c 'test -f \""'$0" && wc -l "$0" || echo MISSING:$0'"'" in /Users/simon/dev/jouan.ovh
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
     122 docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md
     789 docs/planning-artifacts/epics.md
     282 docs/project-context.md
      86 docs/specs/spec-home-awwwards/SPEC.md
     160 docs/implementation-artifacts/deferred-work.md
     113 docs/implementation-artifacts/code-reviews/11-5/full.diff
     171 AGENTS.md

exec
/bin/zsh -lc "python3 _bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow; printf '\\n---STEP 01---\\n'; sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md" in /Users/simon/dev/jouan.ovh
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

---STEP 01---
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

---PROMPT---
# Acceptance Auditor Prompt — Story 11.5

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md`
- Context specs: `docs/planning-artifacts/epics.md` (Epic 11 / Story 11.5), `docs/project-context.md`, `docs/specs/spec-home-awwwards/SPEC.md`, `docs/implementation-artifacts/deferred-work.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/11-5/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

exec
/bin/zsh -lc 'git status --short --untracked-files=all | head -30' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/pages/about.vue
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md
?? docs/implementation-artifacts/code-reviews/11-5/full.diff
?? docs/implementation-artifacts/code-reviews/11-5/prompt-acceptance-auditor.md
?? docs/implementation-artifacts/code-reviews/11-5/prompt-blind-hunter.md
?? docs/implementation-artifacts/code-reviews/11-5/prompt-edge-case-hunter.md
?? docs/implementation-artifacts/code-reviews/11-5/raw-acceptance-auditor.md
?? docs/implementation-artifacts/code-reviews/11-5/raw-blind-hunter.md
?? docs/implementation-artifacts/code-reviews/11-5/raw-edge-case-hunter.json

codex
- **Ville hardcodée hors source de vérité** — Viole AC3 et la règle DRY d’`AGENTS.md`. Le diff ajoute `Rouen` en dur dans la bio et `pageDescription`, tandis que le JSON-LD utilise `SITE.profile.city` (`full.diff:12-15`, `full.diff:57-58`, `full.diff:67-70`).

- **Validation transverse non démontrée par le diff** — Viole AC1, AC2, AC4 et la Definition of Done. Le statut passe à `review`, mais aucun rapport d’audit a11y, résultat Docker, sortie Nitro ou artefact de vérification n’est ajouté (`full.diff:94-112`).

- **Résolution SEO transverse sur-déclarée** — Viole l’intention de l’item différé et AC3. Le diff marque comme résolu l’audit SEO des pages secondaires, alors que seule `app/pages/about.vue` est modifiée (`full.diff:75-90`).

- **Métadonnées de sprint contradictoires** — Viole la cohérence du workflow de statut. `last_updated` indique « ready-for-dev », tandis que `development_status` indique `review` (`full.diff:101-112`).
tokens used
137 243
- **Ville hardcodée hors source de vérité** — Viole AC3 et la règle DRY d’`AGENTS.md`. Le diff ajoute `Rouen` en dur dans la bio et `pageDescription`, tandis que le JSON-LD utilise `SITE.profile.city` (`full.diff:12-15`, `full.diff:57-58`, `full.diff:67-70`).

- **Validation transverse non démontrée par le diff** — Viole AC1, AC2, AC4 et la Definition of Done. Le statut passe à `review`, mais aucun rapport d’audit a11y, résultat Docker, sortie Nitro ou artefact de vérification n’est ajouté (`full.diff:94-112`).

- **Résolution SEO transverse sur-déclarée** — Viole l’intention de l’item différé et AC3. Le diff marque comme résolu l’audit SEO des pages secondaires, alors que seule `app/pages/about.vue` est modifiée (`full.diff:75-90`).

- **Métadonnées de sprint contradictoires** — Viole la cohérence du workflow de statut. `last_updated` indique « ready-for-dev », tandis que `development_status` indique `review` (`full.diff:101-112`).

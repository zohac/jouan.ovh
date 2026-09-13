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
session id: 01a099e9-0248-7061-9841-2383c2e165ec
--------
user
# Acceptance Auditor Prompt — Story 10.5

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.5), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-5/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using the code-review skill because this is a repository-grounded acceptance audit. I’ll read the review instructions, then compare the story spec, context, and full diff and return only actionable Markdown findings.
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

codex
The target and spec are explicit, so I’m treating the supplied `full.diff` as the review source and running the full acceptance mode. I’m loading the exact story spec, Story 10.5 context, project rules, and the diff now; I’ll proceed without the workflow’s confirmation checkpoint per your instruction.
exec
/bin/zsh -lc "printf '%s\\n' '--- files ---'; wc -l docs/implementation-artifacts/10-5-seo-centralise-site-wide.md docs/planning-artifacts/epics.md docs/project-context.md docs/implementation-artifacts/code-reviews/10-5/full.diff; printf '%s\\n' '--- config ---'; sed -n '1,220p' _bmad/bmm/config.yaml; printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-5-seo-centralise-site-wide.md; printf '%s\\n' '--- epics story matches ---'; rg -n -C 24 '10\\.5|SEO|seo|centralise|centralize' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,300p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- files ---
     108 docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
     658 docs/planning-artifacts/epics.md
     293 docs/project-context.md
     517 docs/implementation-artifacts/code-reviews/10-5/full.diff
    1576 total
--- config ---
# BMM Module Configuration
# Generated by BMAD installer
# Version: 6.8.0
# Date: 2026-06-18T17:10:54.053Z

user_skill_level: intermediate
planning_artifacts: "{project-root}/docs/planning-artifacts"
implementation_artifacts: "{project-root}/docs/implementation-artifacts"
project_knowledge: "{project-root}/docs"

# Core Configuration Values
user_name: Simon
project_name: jouan.ovh
communication_language: French
document_output_language: French
output_folder: "{project-root}/docs"
--- spec ---
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.5: SEO centralisé site-wide

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur partageant une page (ou un moteur d'indexation),
I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
so that le site est correctement indexé et présenté lors d'un partage (FR15).

## Acceptance Criteria

**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home n'a aucune meta dédiée ; services et contact n'exposent que `title`+`description`)
**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact

## Tasks / Subtasks

- [x] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
- [x] Tâche 2 — Étendre aux pages nues (AC: tout)
  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
- [x] Tâche 3 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).

## Dev Notes

### Périmètre & frontières

- **Story SEO** : centralise le pattern méta + l'étend aux pages nues. Source : `deferred-work.md` → Epic 10 item #6 (revues 5.1, 6.1, 6.2). [Source: epics.md#Epic 10 — Story 10.5 (FR15)]
- **Dépend de la story 10.1** : `SITE_URL` doit déjà être lu depuis `runtimeConfig.public.siteUrl` (plomberie posée en 10.1). **Ne pas re-hardcoder** le domaine. Si 10.1 a introduit un `useSiteUrl()`, le réutiliser.
- **Frontières** : SEO uniquement. PAS la bascule domaine prod (= 10.7, le `siteUrl` reste `dev.jouan.ovh` par défaut), PAS l'a11y (10.2/10.3/10.4), PAS le RGPD (10.6).
- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/utils/seo.ts`** (UPDATE) — `jsonLdScript()` conservé ; `SITE_URL` déplacé en runtimeConfig (10.1). Peut accueillir des helpers de construction d'URL/JSON-LD partagés.
- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
- **`app/pages/index.vue`** (UPDATE) — **aucun `useHead`** aujourd'hui → ajouter le SEO complet.
- **`app/pages/services.vue`**, **`app/pages/contact.vue`** (UPDATE) — `useHead` avec `title`+`description` seuls → étendre.
- **`app/pages/about.vue`**, **`app/pages/blog/index.vue`**, **`app/pages/blog/[...slug].vue`** (UPDATE) — migration vers le helper, **sans régression** (ils consomment `SITE_URL` aux lignes connues : about l.137-138, blog/index l.103/118/120, article l.117-118).
- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.

### Pièges / régressions à éviter

- **`useRuntimeConfig()` dans le contexte Nuxt** (setup/plugin), pas au top-level d'un module (piège vu en 10.1).
- **Ne pas régresser le SEO existant** d'`/about`/`/blog`/article : vérifier le HTML prerendu **avant/après** la migration (mêmes balises, mêmes URLs).
- **JSON-LD échappé** : toujours via `jsonLdScript()` (échappe `</script>`) — ne pas injecter de JSON-LD brut.
- **Image OG** : URL **absolue** (préfixée `siteUrl`) ; vérifier que l'asset existe (`public/images/…`).
- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
- **Domaine non basculé** : tant que 10.7 n'est pas faite, les URLs restent `https://dev.jouan.ovh/...` — **c'est attendu** (ne pas hardcoder `jouan.ovh`).
- **pnpm + Docker** pour la gate.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.5 (FR15)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #6 centralisation SEO), revues 5.1, 6.1, 6.2]
- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
- [Source: app/utils/seo.ts ; app/pages/index.vue, services.vue, contact.vue, about.vue, blog/index.vue, blog/[...slug].vue ; nuxt.config.ts ; app/data/site.ts]
- [Source: Story 10.1 — SITE_URL via runtimeConfig (dépendance)]

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Build & gate : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error, 11 prerendered routes.
- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.

### Completion Notes List
- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
- Ajout des métadonnées SEO et schémas Schema.org (`WebSite`, `Person`, `Service`/`WebPage`, `ContactPage`, `ProfilePage`, `Blog`, `BlogPosting`) sur toutes les pages (`/`, `/services`, `/contact`, `/about`, `/blog`, `/blog/[...slug]`).
- Aucune URL hardcodée : résolution dynamique via `useSiteUrl()`.
- Validation complète via Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 11 routes prerendues avec succès et inspection conforme du HTML généré.

### File List
- `app/composables/usePageSeo.ts` (NEW)
- `app/app.vue` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `app/pages/services.vue` (MODIFIED)
- `app/pages/contact.vue` (MODIFIED)
- `app/pages/about.vue` (MODIFIED)
- `app/pages/blog/index.vue` (MODIFIED)
- `app/pages/blog/[...slug].vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
--- epics story matches ---
15-
16-Ce document décompose la refonte de jouan.ovh sur le nouveau design system
17-(contrat : `SPEC-design-system-revamp`) en épics et stories implémentables.
18-Sources : SPEC.md (capacités/contraintes), pages.md + primitives.md (UX),
19-project-context.md (technique).
20-
21-## Requirements Inventory
22-
23-### Functional Requirements
24-
25-FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
26-FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
27-FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
28-FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
29-FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
30-FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
31-FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
32-FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
33-FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
34-FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
35-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
36-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
37-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
39:FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
40-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
41-FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
42-
43-### NonFunctional Requirements
44-
45-NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
46-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
47-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
48-NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
49-NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
50-NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
51-NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
52-NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
53-NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
54-
55-### Additional Requirements
56-
57-- Gestionnaire de paquets **Yarn** ; build `yarn generate` → `.output/public` ; déploiement `yarn deploy` (push-dir `gh-pages`).
58-- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
59-- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
60-- Blog via `@nuxt/content` markdown — dossier `content/` à créer.
61-- Pas de framework de test ; barre de qualité = lint (`eslint`, `stylelint`) + build vert.
62-- Code legacy Options API + `vue-property-decorator` : migrer/supprimer, ne pas étendre.
63-- Lint : ESLint + Prettier (double quotes, `;`, `max-len 120`) + `stylelint-scss`.
--
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
99-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
101:FR15: Epic 10 — SEO centralisé site-wide
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
125-**FRs covered:** FR7 _(UX-DR14)_
126-
127-### Epic 6: Blog
128-Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
129-**FRs covered:** FR8 _(UX-DR15)_
130-
131-### Epic 7: Page Contact
132-Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
133-**FRs covered:** FR9 _(UX-DR16)_
134-
135-### Epic 8: Terminal easter-egg restylé
136-L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
137-**FRs covered:** FR10 _(UX-DR8, UX-DR9)_
138-
139-### Epic 9: Accessibilité & finitions motion
140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
141-**FRs covered:** FR11 _(UX-DR17)_
142-
143-### Epic 10: Fin de refonte
144:La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
145-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
146-
147----
148-
149-## Epic 1: Migration de la stack vers Nuxt 4
150-
151-Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).
152-
153-### Story 1.1: Migrer le cœur vers Nuxt 4
154-
155-As a mainteneur du site,
156-I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
157-So that le site repose sur une base moderne et supportée.
158-
159-**Acceptance Criteria:**
160-
161-**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
162-**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
163-**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
164-**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé
165-
166-### Story 1.2: Mettre à jour les modules et dépendances
167-
168-As a mainteneur du site,
--
543-**Given** les primitives et la navigation
544-**When** on vérifie les états focus/hover/press
545-**Then** chaque élément interactif a des états visibles conformes au DS
546-**And** le focus clavier est toujours visible
547-
548-### Story 9.2: Motion réduit, contraste et clavier
549-
550-As a visiteur,
551-I want une interface accessible,
552-So that je peux l'utiliser quelles que soient mes contraintes (UX-DR17, FR11).
553-
554-**Acceptance Criteria:**
555-
556-**Given** l'interface refondue
557-**When** on audite motion, contraste et navigation clavier
558-**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
559-**And** le contraste texte/fond est lisible et toutes les pages sont navigables au clavier
560-
561----
562-
563-## Epic 10: Fin de refonte
564-
565-_(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic. Le roadmap d'épics 1→9 est `done` mais la refonte n'est pas livrée ; cet épic la rend livrable et la met en production.)_
566-
567:La refonte est **réellement livrée** : l'accessibilité résiduelle est bouclée et validée, le SEO est centralisé, la conformité légale est publiée, et le site est déployé en production sur `jouan.ovh` (chaîne gh-pages prouvée, `CNAME` intact). Source : `deferred-work.md` (section « → Epic 10 »). Barre qualité inchangée (pas de framework de test) : `pnpm lint` + `pnpm typecheck` + `pnpm generate` verts + vérification Chrome DevTools MCP.
568-
569-### Story 10.1: Décision hébergement prod et dé-risquage du déploiement gh-pages
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
--
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
621:### Story 10.5: SEO centralisé site-wide
622-
623-As a visiteur partageant une page (ou un moteur d'indexation),
624:I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
625-So that le site est correctement indexé et présenté lors d'un partage (FR15).
626-
627-**Acceptance Criteria:**
628-
629:**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home, services, contact n'exposent que `title`+`description`)
630:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
631-**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
632-**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact
633-
634-### Story 10.6: Conformité légale (RGPD + mentions légales)
635-
636-As a visiteur,
637-I want accéder à la politique de confidentialité et aux mentions légales,
638-So that je sais comment mes données (formulaire `/contact` → Web3Forms) sont traitées (FR16).
639-
640-**Acceptance Criteria:**
641-
642-**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
643-**When** on publie une page « politique de confidentialité » (base légale, finalité, durée de conservation, sous-traitant Web3Forms, droits des personnes) + une page mentions légales, liées depuis le footer et/ou le formulaire
644-**Then** les deux pages existent, sont liées et rendues en prerender, en français/vouvoiement/sans emoji (NFR6) et stylées au DS
645-**And** gate verte ; contenu cadré avec le skill `rgpd-france`
646-
647-### Story 10.7: Mise en production réelle
648-
649-As a Simon (propriétaire du site),
650-I want merger la refonte sur `main` et la déployer en production sur `jouan.ovh`,
651-So that la refonte est enfin livrée aux visiteurs (FR17).
652-
653-**Acceptance Criteria:**
654-
--- project context ---
---
project_name: "jouan.ovh"
user_name: "Simon"
date: "2026-06-22"
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
- **Déploiement :** site statique (`nuxi generate`) → `push-dir` vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME`). ⚠️ La chaîne CI de déploiement n'a pas encore été prouvée en réel sur `main` (cf. rétros Epic 1/2) — validation prévue en fin de refonte.
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
  validation/feedback front. Notice RGPD sous le form (page politique de confidentialité à
  finaliser — cf. `deferred-work.md`).

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
  (`ZButton`, `ZCard`, `ZBadge`, `ZTag`, `ZInput`, `ZAvatar`, `ZIcon`) — `<script setup>`,
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
- **Contenu partagé : source unique `app/data/site.ts`** (`SITE.profile` /
  `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les
  programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`,
  `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder**
  profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2). _(Les
  `experiences`/`degrees` divergent volontairement entre le CV terminal détaillé et
  `/about` condensé — non unifiés, suivi dans `deferred-work.md`.)_

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
- Déploiement : `pnpm deploy` (`push-dir` vers la branche `gh-pages`).
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
- **Epic 9 = passe a11y/motion finale (dernier épic du roadmap).** Décision rétro
  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
  pas seulement en revue —
  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
    `ZInput`/liens), pas page par page ;
  - **navigation clavier** (focus visible, ordre logique, retour de focus après overlay) ;
  - **contraste** texte/fond lisible ;
  - généralisation eyebrow→`<h2>` + listes `<ol>`/`<ul>` à **home** et **services**
    (+ séquence process `<ol>` de 4.2) ; audit site-wide des `target="_blank"`.
  - Inventaire détaillé et destinations : `deferred-work.md`. ⚠️ **« Epic 9 done »
    ≠ « refonte livrée »** : restent après Epic 9 (fin de refonte) la story SEO dédiée
    (+ bascule `SITE_URL` `dev.jouan.ovh` → `jouan.ovh`), la page RGPD/mentions
    légales, et le **premier merge `main` + déploiement gh-pages prouvé**.

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
    (diff visuel **et comportemental** avant/après, Epic 8). **Epic 9 est transverse**
    (a11y/motion, pas de page neuve) → privilégier le diff **comportemental** clavier/motion/
    contraste plutôt que le pixel.

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

Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)

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
/bin/zsh -lc "printf '%s\\n' '--- Story 10.5 in epics ---'; sed -n '610,658p' docs/planning-artifacts/epics.md; printf '%s\\n' '--- spec complete ---'; sed -n '1,140p' docs/implementation-artifacts/10-5-seo-centralise-site-wide.md; printf '%s\\n' '--- diff 1/2 ---'; sed -n '1,280p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- Story 10.5 in epics ---
As a visiteur en contraste forcé ou motion réduit,
I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).

**Acceptance Criteria:**

**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte

### Story 10.5: SEO centralisé site-wide

As a visiteur partageant une page (ou un moteur d'indexation),
I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
So that le site est correctement indexé et présenté lors d'un partage (FR15).

**Acceptance Criteria:**

**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home, services, contact n'exposent que `title`+`description`)
**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact

### Story 10.6: Conformité légale (RGPD + mentions légales)

As a visiteur,
I want accéder à la politique de confidentialité et aux mentions légales,
So that je sais comment mes données (formulaire `/contact` → Web3Forms) sont traitées (FR16).

**Acceptance Criteria:**

**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
**When** on publie une page « politique de confidentialité » (base légale, finalité, durée de conservation, sous-traitant Web3Forms, droits des personnes) + une page mentions légales, liées depuis le footer et/ou le formulaire
**Then** les deux pages existent, sont liées et rendues en prerender, en français/vouvoiement/sans emoji (NFR6) et stylées au DS
**And** gate verte ; contenu cadré avec le skill `rgpd-france`

### Story 10.7: Mise en production réelle

As a Simon (propriétaire du site),
I want merger la refonte sur `main` et la déployer en production sur `jouan.ovh`,
So that la refonte est enfin livrée aux visiteurs (FR17).

**Acceptance Criteria:**

**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
--- spec complete ---
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.5: SEO centralisé site-wide

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur partageant une page (ou un moteur d'indexation),
I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
so that le site est correctement indexé et présenté lors d'un partage (FR15).

## Acceptance Criteria

**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home n'a aucune meta dédiée ; services et contact n'exposent que `title`+`description`)
**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact

## Tasks / Subtasks

- [x] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
- [x] Tâche 2 — Étendre aux pages nues (AC: tout)
  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
- [x] Tâche 3 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).

## Dev Notes

### Périmètre & frontières

- **Story SEO** : centralise le pattern méta + l'étend aux pages nues. Source : `deferred-work.md` → Epic 10 item #6 (revues 5.1, 6.1, 6.2). [Source: epics.md#Epic 10 — Story 10.5 (FR15)]
- **Dépend de la story 10.1** : `SITE_URL` doit déjà être lu depuis `runtimeConfig.public.siteUrl` (plomberie posée en 10.1). **Ne pas re-hardcoder** le domaine. Si 10.1 a introduit un `useSiteUrl()`, le réutiliser.
- **Frontières** : SEO uniquement. PAS la bascule domaine prod (= 10.7, le `siteUrl` reste `dev.jouan.ovh` par défaut), PAS l'a11y (10.2/10.3/10.4), PAS le RGPD (10.6).
- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/utils/seo.ts`** (UPDATE) — `jsonLdScript()` conservé ; `SITE_URL` déplacé en runtimeConfig (10.1). Peut accueillir des helpers de construction d'URL/JSON-LD partagés.
- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
- **`app/pages/index.vue`** (UPDATE) — **aucun `useHead`** aujourd'hui → ajouter le SEO complet.
- **`app/pages/services.vue`**, **`app/pages/contact.vue`** (UPDATE) — `useHead` avec `title`+`description` seuls → étendre.
- **`app/pages/about.vue`**, **`app/pages/blog/index.vue`**, **`app/pages/blog/[...slug].vue`** (UPDATE) — migration vers le helper, **sans régression** (ils consomment `SITE_URL` aux lignes connues : about l.137-138, blog/index l.103/118/120, article l.117-118).
- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.

### Pièges / régressions à éviter

- **`useRuntimeConfig()` dans le contexte Nuxt** (setup/plugin), pas au top-level d'un module (piège vu en 10.1).
- **Ne pas régresser le SEO existant** d'`/about`/`/blog`/article : vérifier le HTML prerendu **avant/après** la migration (mêmes balises, mêmes URLs).
- **JSON-LD échappé** : toujours via `jsonLdScript()` (échappe `</script>`) — ne pas injecter de JSON-LD brut.
- **Image OG** : URL **absolue** (préfixée `siteUrl`) ; vérifier que l'asset existe (`public/images/…`).
- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
- **Domaine non basculé** : tant que 10.7 n'est pas faite, les URLs restent `https://dev.jouan.ovh/...` — **c'est attendu** (ne pas hardcoder `jouan.ovh`).
- **pnpm + Docker** pour la gate.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.5 (FR15)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #6 centralisation SEO), revues 5.1, 6.1, 6.2]
- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
- [Source: app/utils/seo.ts ; app/pages/index.vue, services.vue, contact.vue, about.vue, blog/index.vue, blog/[...slug].vue ; nuxt.config.ts ; app/data/site.ts]
- [Source: Story 10.1 — SITE_URL via runtimeConfig (dépendance)]

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Build & gate : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error, 11 prerendered routes.
- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.

### Completion Notes List
- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
- Ajout des métadonnées SEO et schémas Schema.org (`WebSite`, `Person`, `Service`/`WebPage`, `ContactPage`, `ProfilePage`, `Blog`, `BlogPosting`) sur toutes les pages (`/`, `/services`, `/contact`, `/about`, `/blog`, `/blog/[...slug]`).
- Aucune URL hardcodée : résolution dynamique via `useSiteUrl()`.
- Validation complète via Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 11 routes prerendues avec succès et inspection conforme du HTML généré.

### File List
- `app/composables/usePageSeo.ts` (NEW)
- `app/app.vue` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `app/pages/services.vue` (MODIFIED)
- `app/pages/contact.vue` (MODIFIED)
- `app/pages/about.vue` (MODIFIED)
- `app/pages/blog/index.vue` (MODIFIED)
- `app/pages/blog/[...slug].vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
--- diff 1/2 ---
diff --git a/app/app.vue b/app/app.vue
index 84b23a4..6016dd4 100644
--- a/app/app.vue
+++ b/app/app.vue
@@ -4,4 +4,29 @@
   </NuxtLayout>
 </template>
 
+<script setup lang="ts">
+import { SITE } from "~/data/site";
+
+// Métadonnées Schema.org globales (Organization / publisher du site).
+// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
+const siteUrl = useSiteUrl();
+
+const organizationJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "Organization",
+  name: SITE.profile.name,
+  url: siteUrl,
+  logo: `${siteUrl}/images/logo.png`,
+  email: SITE.profile.email,
+  address: {
+    "@type": "PostalAddress",
+    addressLocality: SITE.profile.city,
+  },
+};
+
+useHead({
+  script: [jsonLdScript(organizationJsonLd)],
+});
+</script>
+
 <style lang="scss" scoped></style>
diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
new file mode 100644
index 0000000..6a238eb
--- /dev/null
+++ b/app/composables/usePageSeo.ts
@@ -0,0 +1,103 @@
+import { computed, toValue, type MaybeRefOrGetter } from "vue";
+import { useSiteUrl } from "./useSiteUrl";
+
+export interface PageSeoOptions {
+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
+  title: string;
+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
+  description: string;
+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
+  path?: string;
+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
+  image?: string;
+  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
+  type?: "website" | "article" | "profile";
+  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
+  twitterCard?: "summary" | "summary_large_image";
+  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
+  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
+}
+
+/**
+ * Composable centralisant la déclaration des métadonnées SEO par page :
+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
+ *
+ * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
+ */
+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
+  const siteUrl = useSiteUrl();
+
+  const seo = computed(() => {
+    const opts = toValue(options);
+    if (!opts) {
+      return null;
+    }
+
+    const rawPath = opts.path ?? "";
+    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
+
+    let imageUrl: string | undefined;
+    if (opts.image) {
+      imageUrl =
+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
+          ? opts.image
+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
+    }
+
+    const type = opts.type ?? "website";
+    const twitterCard =
+      opts.twitterCard ??
+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
+        ? "summary_large_image"
+        : "summary");
+
+    return {
+      title: opts.title,
+      description: opts.description,
+      canonicalUrl,
+      imageUrl,
+      type,
+      twitterCard,
+      jsonLd: opts.jsonLd,
+    };
+  });
+
+  useHead(() => {
+    if (!seo.value) {
+      return {};
+    }
+
+    const scripts: Array<{ type: string; innerHTML: string }> = [];
+    if (seo.value.jsonLd) {
+      if (Array.isArray(seo.value.jsonLd)) {
+        for (const item of seo.value.jsonLd) {
+          scripts.push(jsonLdScript(item));
+        }
+      } else {
+        scripts.push(jsonLdScript(seo.value.jsonLd));
+      }
+    }
+
+    return {
+      title: seo.value.title,
+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
+      script: scripts,
+    };
+  });
+
+  useSeoMeta({
+    title: () => seo.value?.title,
+    description: () => seo.value?.description,
+    ogTitle: () => seo.value?.title,
+    ogDescription: () => seo.value?.description,
+    ogUrl: () => seo.value?.canonicalUrl,
+    ogType: () => seo.value?.type,
+    ogImage: () => seo.value?.imageUrl,
+    twitterCard: () => seo.value?.twitterCard,
+    twitterTitle: () => seo.value?.title,
+    twitterDescription: () => seo.value?.description,
+    twitterImage: () => seo.value?.imageUrl,
+  });
+}
diff --git a/app/pages/about.vue b/app/pages/about.vue
index 997bc7f..3266cce 100644
--- a/app/pages/about.vue
+++ b/app/pages/about.vue
@@ -133,29 +133,30 @@ const degrees = [
 const pageTitle = "À propos — jouan.ovh";
 const pageDescription =
   "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
-// URL de prod lue depuis runtimeConfig via useSiteUrl() (swappable staging/prod, sans
-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
+
 const siteUrl = useSiteUrl();
-const pageUrl = `${siteUrl}/about`;
-const pageImage = `${siteUrl}/images/portrait.jpeg`;
+const aboutJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "ProfilePage",
+  name: pageTitle,
+  url: `${siteUrl}/about`,
+  mainEntity: {
+    "@type": "Person",
+    name: "Simon Jouan",
+    jobTitle: "Développeur web freelance",
+    url: siteUrl,
+    image: `${siteUrl}/images/portrait.jpeg`,
+  },
+};
 
-useHead({
+usePageSeo({
   title: pageTitle,
-  link: [{ rel: "canonical", href: pageUrl }],
-  meta: [
-    { name: "description", content: pageDescription },
-    // Open Graph (partage Facebook/LinkedIn…).
-    { property: "og:type", content: "profile" },
-    { property: "og:title", content: pageTitle },
-    { property: "og:description", content: pageDescription },
-    { property: "og:url", content: pageUrl },
-    { property: "og:image", content: pageImage },
-    // Twitter Card.
-    { name: "twitter:card", content: "summary" },
-    { name: "twitter:title", content: pageTitle },
-    { name: "twitter:description", content: pageDescription },
-    { name: "twitter:image", content: pageImage },
-  ],
+  description: pageDescription,
+  path: "/about",
+  image: "/images/portrait.jpeg",
+  type: "profile",
+  twitterCard: "summary",
+  jsonLd: aboutJsonLd,
 });
 </script>
 
diff --git a/app/pages/blog/[...slug].vue b/app/pages/blog/[...slug].vue
index 155153b..0cda25f 100644
--- a/app/pages/blog/[...slug].vue
+++ b/app/pages/blog/[...slug].vue
@@ -108,14 +108,13 @@ if (import.meta.client) {
   });
 }
 
-// SEO par article (parité avec /about et /blog). URL de prod via useSiteUrl()
-// (runtimeConfig, swappable staging/prod) ; capturée dans le setup, hors du getter useHead
-// (un composable ne s'appelle pas dans un callback).
+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
 const siteUrl = useSiteUrl();
-useHead(() => {
+usePageSeo(() => {
   const article = page.value;
   if (!article) {
-    return {};
+    return null;
   }
   const url = `${siteUrl}${article.path}`;
   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
@@ -130,22 +129,14 @@ useHead(() => {
     ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
     ...(image ? { image } : {}),
   };
+
   return {
     title: `${article.title} — jouan.ovh`,
-    link: [{ rel: "canonical", href: url }],
-    meta: [
-      { name: "description", content: article.description },
-      { property: "og:type", content: "article" },
-      { property: "og:title", content: article.title },
-      { property: "og:description", content: article.description },
-      { property: "og:url", content: url },
-      ...(image ? [{ property: "og:image", content: image }] : []),
-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
-      { name: "twitter:title", content: article.title },
-      { name: "twitter:description", content: article.description },
-      ...(image ? [{ name: "twitter:image", content: image }] : []),
-    ],
-    script: [jsonLdScript(jsonLd)],
+    description: article.description,
+    path: article.path,
+    image: article.image?.src,
+    type: "article",
+    jsonLd,
   };
 });
 </script>
diff --git a/app/pages/blog/index.vue b/app/pages/blog/index.vue
index a4fcc16..73aca76 100644
--- a/app/pages/blog/index.vue
+++ b/app/pages/blog/index.vue
@@ -123,22 +123,12 @@ const blogJsonLd = {
   })),
 };
 
-useHead({
+usePageSeo({
   title: pageTitle,
-  link: [{ rel: "canonical", href: pageUrl }],
-  meta: [
-    { name: "description", content: pageDescription },
-    // Open Graph (partage Facebook/LinkedIn…).
-    { property: "og:type", content: "website" },
-    { property: "og:title", content: pageTitle },
-    { property: "og:description", content: pageDescription },
-    { property: "og:url", content: pageUrl },
-    // Twitter Card.
-    { name: "twitter:card", content: "summary" },
-    { name: "twitter:title", content: pageTitle },
-    { name: "twitter:description", content: pageDescription },
-  ],
-  script: [jsonLdScript(blogJsonLd)],
+  description: pageDescription,
+  path: "/blog",
+  type: "website",
+  jsonLd: blogJsonLd,
 });

exec
/bin/zsh -lc "sed -n '281,620p' docs/implementation-artifacts/code-reviews/10-5/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 </script>
 
diff --git a/app/pages/contact.vue b/app/pages/contact.vue
index 0680a12..ce95b45 100644
--- a/app/pages/contact.vue
+++ b/app/pages/contact.vue
@@ -250,15 +250,34 @@ async function onSubmit(): Promise<void> {
   }
 }
 
-useHead({
-  title: "Contact — jouan.ovh",
-  meta: [
-    {
-      name: "description",
-      content:
-        "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+const siteUrl = useSiteUrl();
+
+const contactJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "ContactPage",
+  name: "Contact — jouan.ovh",
+  description:
+    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+  url: `${siteUrl}/contact`,
+  mainEntity: {
+    "@type": "Person",
+    name: SITE.profile.name,
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
     },
-  ],
+  },
+};
+
+usePageSeo({
+  title: "Contact — jouan.ovh",
+  description:
+    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
+  path: "/contact",
+  image: "/images/portrait.jpeg",
+  type: "website",
+  jsonLd: contactJsonLd,
 });
 </script>
 
diff --git a/app/pages/index.vue b/app/pages/index.vue
index f6139f4..6d5bc04 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -180,6 +180,40 @@ const terminalRows = [
 // header). No-op tant qu'aucun terminal n'est disponible (prerender). La
 // restylisation du terminal lui-même relève d'Epic 8.
 const { open: openTerminal } = useTerminal();
+
+const siteUrl = useSiteUrl();
+const homeJsonLd = [
+  {
+    "@context": "https://schema.org",
+    "@type": "WebSite",
+    name: "Simon Jouan — Développeur web freelance",
+    url: siteUrl,
+    description: tagline,
+  },
+  {
+    "@context": "https://schema.org",
+    "@type": "Person",
+    name: SITE.profile.name,
+    jobTitle: SITE.profile.role,
+    url: siteUrl,
+    image: `${siteUrl}/images/portrait.jpeg`,
+    email: SITE.profile.email,
+    address: {
+      "@type": "PostalAddress",
+      addressLocality: SITE.profile.city,
+    },
+  },
+];
+
+usePageSeo({
+  title: "Simon Jouan — Développeur web freelance & IA",
+  description:
+    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
+  path: "/",
+  image: "/images/portrait.jpeg",
+  type: "website",
+  jsonLd: homeJsonLd,
+});
 </script>
 
 <style lang="scss" scoped>
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 83fb5a1..b458474 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -127,15 +127,35 @@ const steps = [
   { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
 ];
 
-useHead({
+const siteUrl = useSiteUrl();
+
+const servicesJsonLd = {
+  "@context": "https://schema.org",
+  "@type": "WebPage",
+  name: "Services — jouan.ovh",
+  description:
+    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+  url: `${siteUrl}/services`,
+  mainEntity: {
+    "@type": "ItemList",
+    itemListElement: offers.map((offer, index) => ({
+      "@type": "Offer",
+      position: index + 1,
+      name: offer.title,
+      description: offer.desc,
+      price: offer.price,
+    })),
+  },
+};
+
+usePageSeo({
   title: "Services — jouan.ovh",
-  meta: [
-    {
-      name: "description",
-      content:
-        "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
-    },
-  ],
+  description:
+    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
+  path: "/services",
+  image: "/images/portrait.jpeg",
+  type: "website",
+  jsonLd: servicesJsonLd,
 });
 </script>
 
diff --git a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
index 1c23450..fbbe359 100644
--- a/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
+++ b/docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.5: SEO centralisé site-wide
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,17 +23,17 @@ so that le site est correctement indexé et présenté lors d'un partage (FR15).
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
-  - [ ] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
-  - [ ] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
-- [ ] Tâche 2 — Étendre aux pages nues (AC: tout)
-  - [ ] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
-  - [ ] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
-  - [ ] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
-  - [ ] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
-- [ ] Tâche 3 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
-  - [ ] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
+- [x] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
+  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
+  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
+- [x] Tâche 2 — Étendre aux pages nues (AC: tout)
+  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
+  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
+  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
+  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
+- [x] Tâche 3 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
+  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
 
 ## Dev Notes
 
@@ -79,9 +79,30 @@ so that le site est correctement indexé et présenté lors d'un partage (FR15).
 ## Dev Agent Record
 
 ### Agent Model Used
+- Gemini 3.7 Flash
 
 ### Debug Log References
+- Build & gate : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error, 11 prerendered routes.
+- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
 
 ### Completion Notes List
+- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
+- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
+- Ajout des métadonnées SEO et schémas Schema.org (`WebSite`, `Person`, `Service`/`WebPage`, `ContactPage`, `ProfilePage`, `Blog`, `BlogPosting`) sur toutes les pages (`/`, `/services`, `/contact`, `/about`, `/blog`, `/blog/[...slug]`).
+- Aucune URL hardcodée : résolution dynamique via `useSiteUrl()`.
+- Validation complète via Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 11 routes prerendues avec succès et inspection conforme du HTML généré.
 
 ### File List
+- `app/composables/usePageSeo.ts` (NEW)
+- `app/app.vue` (MODIFIED)
+- `app/pages/index.vue` (MODIFIED)
+- `app/pages/services.vue` (MODIFIED)
+- `app/pages/contact.vue` (MODIFIED)
+- `app/pages/about.vue` (MODIFIED)
+- `app/pages/blog/index.vue` (MODIFIED)
+- `app/pages/blog/[...slug].vue` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
+
+## Change Log
+- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 7ccabba..dd09c09 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 10.3 soldée par revue de code : 100% liens _blank unifiés sur ZExternalLink, noopener garanti, statut done)"
+last_updated: "2026-09-13 (Story 10.5 prête pour revue : SEO centralisé site-wide via usePageSeo, statut review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -112,7 +112,7 @@ development_status:
   10-2-a11y-semantique-residuelle: done
   10-3-liens-externes-accessibles: done
   10-4-validation-a11y-emulee-et-unification-forced-colors: done
-  10-5-seo-centralise-site-wide: ready-for-dev
+  10-5-seo-centralise-site-wide: review
   10-6-conformite-legale-rgpd-mentions: ready-for-dev
   10-7-mise-en-production-reelle: ready-for-dev
   epic-10-retrospective: optional

codex
The diff is compact (8 application files plus story tracking/docs), and I’m now checking the implementation against runtime URL handling, the existing SEO helper contract, asset existence, and Nuxt prerender semantics. The key review risk is whether the new central helper actually preserves the article/blog behavior and emits valid, non-duplicated structured data.
exec
/bin/zsh -lc "printf '%s\\n' '--- relevant source files ---'; sed -n '1,220p' app/composables/useSiteUrl.ts; sed -n '1,220p' app/utils/seo.ts; sed -n '1,220p' app/data/site.ts; printf '%s\\n' '--- config/runtime ---'; sed -n '1,240p' nuxt.config.ts; printf '%s\\n' '--- asset inventory ---'; rg --files public app | rg '("'^|/)(images|logo|portrait|og)|'"\\.png"'$|'"\\.jpe?g"'$'"' | sort; printf '%s\\n' '--- page imports/SEO context ---'; for f in app/pages/index.vue app/pages/services.vue app/pages/contact.vue app/pages/about.vue app/pages/blog/index.vue 'app/pages/blog/[...slug].vue'; do echo \"### "'$f"; rg -n -C 3 '"'SITE|usePageSeo|useHead|useSeoMeta|siteUrl|pageTitle|pageDescription|tagline|offers|article' \""'$f"; done' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- relevant source files ---
// URL publique du site (canonical / og:url / JSON-LD) — point d'accès unique.
// La valeur vient de `runtimeConfig.public.siteUrl` (défaut staging dans nuxt.config,
// surchargeable par NUXT_PUBLIC_SITE_URL). ⚠️ `useRuntimeConfig()` n'est
// appelable QUE dans un contexte Nuxt (setup de composant, plugin, middleware) — d'où ce
// composable, à consommer dans le `<script setup>` des pages, pas au niveau module d'un util
// pur (raison pour laquelle l'ancienne constante `SITE_URL` de app/utils/seo.ts a été retirée).
export function useSiteUrl(): string {
  const siteUrl = useRuntimeConfig().public.siteUrl;
  // Garde-fou fail-fast (décision D1, revue 2026-07-02) : une valeur vide ou non absolue
  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
  // échouer le prerender (`generate`) tôt et bruyamment plutôt que de livrer du SEO cassé.
  let url: URL;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error(
      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une URL absolue (http[s]://), ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    );
  }

  const isHttpProtocol = url.protocol === "http:" || url.protocol === "https:";
  const isOriginOnly = url.pathname === "/" && url.search === "" && url.hash === "";
  if (!isHttpProtocol || !url.hostname || !isOriginOnly) {
    throw new Error(
      `[useSiteUrl] runtimeConfig.public.siteUrl doit être une origin http(s) sans chemin, query ni hash, ` +
        `reçu ${JSON.stringify(siteUrl)}. Corriger le défaut dans nuxt.config.ts ou l'env NUXT_PUBLIC_SITE_URL.`,
    );
  }

  // Retourne l'origin normalisée pour une concaténation sûre (`${siteUrl}/about`),
  // y compris si l'override est saisi avec un slash final.
  return url.origin;
}
// Helpers SEO partagés (auto-importés depuis app/utils/).
//
// L'URL de production du site n'est plus une constante ici : elle est lue depuis
// `runtimeConfig.public.siteUrl` via le composable `useSiteUrl()`
// (app/composables/useSiteUrl.ts) — swappable staging/prod sans domaine en dur.
// `useRuntimeConfig()` étant un composable (contexte Nuxt requis), elle ne peut pas
// vivre dans ce module pur.

// Construit l'entrée <script type="application/ld+json"> pour useHead, en échappant
// « < » → « < ». Garantit qu'aucune séquence "</script>" éventuellement présente
// dans les données (titres, descriptions d'articles…) ne ferme la balise prématurément.
export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    innerHTML: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
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
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur web freelance",
  email: "simon@jouan.ovh",
  city: "Valognes, France",
  available: true,
};

// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
const skills: string[] = [
  "php",
  "symfony",
  "wordpress",
  "node.js",
  "nest.js",
  "nuxt.js",
  "vue",
  "typescript",
  "docker",
  "tailwind",
  "n8n",
  "mysql",
];

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Fondateur · SaaS",
    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
    url: "https://keova.app",
    tags: ["nest.js", "nuxt", "saas"],
  },
  {
    name: "patio-conseil.fr",
    role: "Client",
    desc: "Site et outils pour un cabinet de conseil.",
    url: "https://patio-conseil.fr",
    tags: ["wordpress", "conseil"],
  },
];

export const SITE = { profile, skills, projects } as const;
--- config/runtime ---
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "..::<sj />::..",
      htmlAttrs: {
        lang: "fr",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // Ubuntu sans (corps long) — Google Fonts via <link> (pas d'@import SCSS, cf. règle projet).
        // Ubuntu Mono reste self-hosted (abstract/_fonts.scss).
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
            " Discutons de votre projet.",
        },
      ],
    },
  },
  css: ["@/assets/scss/main.scss"],
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint"],
  // @nuxt/content : coloration syntaxique Shiki désactivée. Le DS rend le code en
  // palette terminale UNIFORME (mono off-white sur fond aubergine, vert pour l'inline,
  // cf. kit.css .article .prose pre/code) — pas de multicolore par token, qui injecterait
  // des styles inline écrasant les tokens. Les blocs rendent en <pre><code> nu, stylés en SCSS.
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
  },
  // Primitives DS dans components/ui/ auto-importées sans préfixe de dossier
  // (<ZButton> et non <UiZButton>). Le reste de components/ garde le scan par défaut.
  components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"],
  ssr: true,
  // Config exposée au client. La clé d'accès Web3Forms (envoi du formulaire /contact)
  // n'est JAMAIS en dur : fournie par l'env NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY (cf.
  // .env.example). Vide par défaut → le formulaire bascule sur son état d'erreur.
  runtimeConfig: {
    public: {
      web3formsAccessKey: "",
      // URL de production du site (canonical / og:url / JSON-LD). Défaut = staging
      // (dev.jouan.ovh, cf. public/CNAME) ; surchargeable en prod SANS domaine en dur via
      // l'env NUXT_PUBLIC_SITE_URL=https://jouan.ovh (cf. .env.example). Consommée par le
      // composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
      siteUrl: "https://dev.jouan.ovh",
    },
  },
  // Structure Nuxt 4 par défaut : code applicatif sous app/ (srcDir = "app").
  experimental: {
    payloadExtraction: false,
  },
  // Flat config gérée par @nuxt/eslint ; on laisse Prettier formater (stylistic off).
  eslint: {
    config: {
      stylistic: false,
    },
  },
});
--- asset inventory ---
public/images/favicon.ico
public/images/logo - 128x128.png
public/images/logo - 256x256.png
public/images/logo - 512x512.png
public/images/logo.png
public/images/logo.xcf
public/images/logo_black_1024x1024.png
public/images/logo_black_256x256.png
public/images/logo_black_512x512.png
public/images/logo_white.png
public/images/logo_white_256x256.png
public/images/logo_white_32x32.png
public/images/logo_white_512x512.png
public/images/portrait-256x256.jpeg
public/images/portrait-256x256.webp
public/images/portrait-512x512.jpeg
public/images/portrait-512x512.webp
public/images/portrait-512x709.jpeg
public/images/portrait-512x709.webp
public/images/portrait.jpeg
public/images/portrait_512x512_drip_art_1.png
public/images/portrait_512x512_drip_art_1.webp
public/images/portrait_512x512_drip_art_2.png
public/images/portrait_512x512_drip_art_2.webp
public/images/portrait_512x512_drip_art_3.png
public/images/portrait_512x512_drip_art_3.webp
public/images/portrait_512x512_drip_art_4.png
public/images/portrait_512x512_drip_art_4.webp
public/images/portrait_512x512_drip_art_5.png
public/images/portrait_512x512_drip_art_5.webp
public/images/portrait_512x512_drip_art_6.png
public/images/portrait_512x512_drip_art_6.webp
public/images/portrait_512x512_drip_art_7.png
public/images/portrait_512x512_drip_art_7.webp
public/images/portrait_512x512_drip_art_8.png
public/images/portrait_512x512_drip_art_8.webp
public/images/portrait_512x512_drip_art_9.png
public/images/portrait_512x512_drip_art_9.webp
public/images/undraw_code_thinking_re_gka2.svg
public/images/undraw_programming_re_kg9v.svg
--- page imports/SEO context ---
### app/pages/index.vue
7-          <div class="anim hero__text">
8-            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
9-            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
10:            <p class="hero__sub">{{ tagline }}</p>
11-            <div class="hero__cta">
12-              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
13-                Démarrer un projet
--
124-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
125-import { NuxtLink, ZExternalLink } from "#components";
126-import { useTerminal } from "~/composables/useTerminal";
127:import { SITE } from "~/data/site";
128-
129:// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
130:const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
131-const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
132-
133-// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
--
165-];
166-
167-// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
168:const projects = SITE.projects;
169-
170-// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
171-// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
--
181-// restylisation du terminal lui-même relève d'Epic 8.
182-const { open: openTerminal } = useTerminal();
183-
184:const siteUrl = useSiteUrl();
185-const homeJsonLd = [
186-  {
187-    "@context": "https://schema.org",
188-    "@type": "WebSite",
189-    name: "Simon Jouan — Développeur web freelance",
190:    url: siteUrl,
191:    description: tagline,
192-  },
193-  {
194-    "@context": "https://schema.org",
195-    "@type": "Person",
196:    name: SITE.profile.name,
197:    jobTitle: SITE.profile.role,
198:    url: siteUrl,
199:    image: `${siteUrl}/images/portrait.jpeg`,
200:    email: SITE.profile.email,
201-    address: {
202-      "@type": "PostalAddress",
203:      addressLocality: SITE.profile.city,
204-    },
205-  },
206-];
207-
208:usePageSeo({
209-  title: "Simon Jouan — Développeur web freelance & IA",
210-  description:
211-    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
### app/pages/services.vue
11-        </p>
12-
13-        <ul class="grid-3">
14:          <li v-for="offer in offers" :key="offer.id">
15-            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
16-              <div v-if="offer.featured" class="offer__badge">
17-                <ZBadge tone="accent">Le plus demandé</ZBadge>
--
85-  featured: boolean;
86-}
87-
88:// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
89-// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
90:const offers: Offer[] = [
91-  {
92-    id: "wordpress",
93-    icon: "wp",
--
127-  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
128-];
129-
130:const siteUrl = useSiteUrl();
131-
132-const servicesJsonLd = {
133-  "@context": "https://schema.org",
--
135-  name: "Services — jouan.ovh",
136-  description:
137-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
138:  url: `${siteUrl}/services`,
139-  mainEntity: {
140-    "@type": "ItemList",
141:    itemListElement: offers.map((offer, index) => ({
142-      "@type": "Offer",
143-      position: index + 1,
144-      name: offer.title,
--
148-  },
149-};
150-
151:usePageSeo({
152-  title: "Services — jouan.ovh",
153-  description:
154-    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
### app/pages/contact.vue
136-// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
137-// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
138-import { nextTick } from "vue";
139:import { SITE } from "~/data/site";
140-
141-// Infos de contact — source unique `app/data/site.ts`.
142:const contact = SITE.profile;
143-
144-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
145-// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
--
157-  message: string;
158-}
159-
160:const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;
161-
162-// Clé Web3Forms injectée par l'env (NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY) — jamais en dur.
163-const accessKey = useRuntimeConfig().public.web3formsAccessKey;
--
250-  }
251-}
252-
253:const siteUrl = useSiteUrl();
254-
255-const contactJsonLd = {
256-  "@context": "https://schema.org",
--
258-  name: "Contact — jouan.ovh",
259-  description:
260-    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
261:  url: `${siteUrl}/contact`,
262-  mainEntity: {
263-    "@type": "Person",
264:    name: SITE.profile.name,
265:    email: SITE.profile.email,
266-    address: {
267-      "@type": "PostalAddress",
268:      addressLocality: SITE.profile.city,
269-    },
270-  },
271-};
272-
273:usePageSeo({
274-  title: "Contact — jouan.ovh",
275-  description:
276-    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
### app/pages/about.vue
94-// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
95-// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
96-import { NuxtLink } from "#components";
97:import { SITE } from "~/data/site";
98-
99-// Identité + stack — source unique `app/data/site.ts`.
100:const profile = SITE.profile;
101:const skills = SITE.skills;
102-
103-// Expériences (data.js → S.experiences) — de la plus récente à la plus ancienne.
104-// `org` sert de clé v-for stable (unique).
--
130-];
131-
132-// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
133:const pageTitle = "À propos — jouan.ovh";
134:const pageDescription =
135-  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
136-
137:const siteUrl = useSiteUrl();
138-const aboutJsonLd = {
139-  "@context": "https://schema.org",
140-  "@type": "ProfilePage",
141:  name: pageTitle,
142:  url: `${siteUrl}/about`,
143-  mainEntity: {
144-    "@type": "Person",
145-    name: "Simon Jouan",
146-    jobTitle: "Développeur web freelance",
147:    url: siteUrl,
148:    image: `${siteUrl}/images/portrait.jpeg`,
149-  },
150-};
151-
152:usePageSeo({
153:  title: pageTitle,
154:  description: pageDescription,
155-  path: "/about",
156-  image: "/images/portrait.jpeg",
157-  type: "profile",
### app/pages/blog/index.vue
9-          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
10-        </p>
11-
12:        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
13:        <ul v-if="articles && articles.length" class="blog__list">
14:          <li v-for="article in articles" :key="article.path" class="blog__item">
15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
16-              <NuxtImg
17:                v-if="article.image"
18-                class="post__thumb"
19:                :src="article.image.src"
20:                :alt="article.image.alt"
21-                width="200"
22-                height="130"
23-                sizes="200px"
24-                format="webp"
25-              />
26-              <div class="post__body">
27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
28:                  <li v-for="tag in article.tags" :key="tag">
29-                    <ZTag>{{ tag }}</ZTag>
30-                  </li>
31-                </ul>
32:                <h2 class="post__title">{{ article.title }}</h2>
33:                <p class="post__desc">{{ article.description }}</p>
34-                <div class="post__meta">
35:                  <time :datetime="article.date">{{ formatDate(article.date) }}</time>
36-                  <!-- `read` est optionnel : pas de séparateur ni de « de lecture » orphelins. -->
37:                  <template v-if="article.read">
38-                    <span aria-hidden="true">·</span>
39:                    <span>{{ article.read }} de lecture</span>
40-                  </template>
41-                </div>
42-              </div>
--
53-            width="220"
54-            height="165"
55-          />
56:          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
57-          <p class="prose blog__notice-text">
58:            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
59-            réessayer dans quelques instants.
60-          </p>
61-        </ZCard>
62-
63:        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
64-        <ZCard v-else class="blog__notice" padded>
65-          <NuxtImg
66-            class="blog__notice-img"
--
69-            width="220"
70-            height="165"
71-          />
72:          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
73-          <p class="prose blog__notice-text">
74-            Je travaille actuellement sur de nouveaux contenus pour partager ce que j'apprends en développement web.
75-            Revenez bientôt pour découvrir mes prochaines publications.
--
81-</template>
82-
83-<script setup lang="ts">
84:// Index du blog (story 6.1) — porté de Blog.jsx : en-tête + liste d'articles en
85-// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
86-// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
87:// au build par useAsyncData). La vue article (/blog/[...slug]) est la story 6.2.
88-import { NuxtLink } from "#components";
89-
90-// Articles triés par date décroissante. La requête de contenu est résolue côté
91-// build/SSR → rendu prerender-safe. `error` distingue un échec de chargement d'un
92-// véritable empty-state (liste vide).
93:const { data: articles, error } = await useAsyncData("blog-list", () =>
94-  queryCollection("blog").order("date", "DESC").all(),
95-);
96-
--
98-
99-// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
100-// (swappable staging/prod, sans domaine en dur). Inchangée en staging.
101:const siteUrl = useSiteUrl();
102:const pageTitle = "Blog — jouan.ovh";
103:const pageDescription =
104-  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
105:const pageUrl = `${siteUrl}/blog`;
106-
107:// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
108-// Construit à partir de la liste résolue (snapshot au build, page prerendue).
109-const blogJsonLd = {
110-  "@context": "https://schema.org",
111-  "@type": "Blog",
112-  name: "Notes de dev",
113:  description: pageDescription,
114-  url: pageUrl,
115:  blogPost: (articles.value ?? []).map((article) => ({
116-    "@type": "BlogPosting",
117:    headline: article.title,
118:    description: article.description,
119:    datePublished: article.date,
120:    url: `${siteUrl}${article.path}`,
121:    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
122:    ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
123-  })),
124-};
125-
126:usePageSeo({
127:  title: pageTitle,
128:  description: pageDescription,
129-  path: "/blog",
130-  type: "website",
131-  jsonLd: blogJsonLd,
--
156-  color: var(--text-muted);
157-}
158-
159:// ---- Liste d'articles (porté de Blog.jsx : flex column + .post de kit.css) ----
160:// <ul> sémantique (annonce « liste de N articles ») : reset des puces et marges UA.
161-.blog__list {
162-  display: flex;
163-  flex-direction: column;
--
167-  list-style: none;
168-}
169-
170:// Carte article = ZCard interactive rendue en lien : grille vignette / contenu.
171-.post {
172-  display: grid;
173-  grid-template-columns: 200px 1fr;
--
205-  color: var(--text-body);
206-}
207-
208:// .post__meta : primitive globale (base/_layout.scss), partagée avec la vue article.
209-
210-// ---- Empty-state / erreur (ZCard centrée, illustration + message) ----
211-.blog__notice {
### app/pages/blog/[...slug].vue
1-<template>
2:  <main class="blog-article">
3-    <section class="section">
4-      <div class="container">
5:        <article v-if="page" class="article">
6-          <!-- Lien retour (porté de Blog.jsx : hdr__link « ← Retour au blog »).
7-               Le glyphe ← est décoratif (aria-hidden) : le lecteur d'écran lit « Retour au blog ». -->
8:          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>
9-
10-          <!-- En-tête : tags, titre, méta (auteur · date · lecture), image héro -->
11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
12-            <li v-for="tag in page.tags" :key="tag">
13-              <ZTag>{{ tag }}</ZTag>
14-            </li>
15-          </ul>
16-
17:          <h1 class="article__title">{{ page.title }}</h1>
18-
19:          <div class="post__meta article__meta">
20-            <span>Simon Jouan</span>
21-            <span aria-hidden="true">·</span>
22-            <time :datetime="page.date">{{ formatDate(page.date) }}</time>
--
28-
29-          <NuxtImg
30-            v-if="page.image"
31:            class="article__hero"
32-            :src="page.image.src"
33-            :alt="page.image.alt"
34-            width="760"
--
37-            format="webp"
38-          />
39-
40:          <!-- Corps de l'article : HTML généré par @nuxt/content, stylé via :deep() -->
41:          <div class="prose article__prose">
42-            <ContentRenderer :value="page" />
43-          </div>
44-
45-          <!-- Bloc CTA de fin (porté de Blog.jsx) -->
46:          <div class="article__cta">
47:            <span class="article__cta-label">Un projet en tête ?</span>
48-            <ZButton :as="NuxtLink" to="/contact" variant="primary">
49-              Démarrer un projet
50-              <template #iconRight><ZIcon name="arrow" /></template>
51-            </ZButton>
52-          </div>
53:        </article>
54-      </div>
55-    </section>
56-  </main>
57-</template>
58-
59-<script setup lang="ts">
60:// Vue article du blog (story 6.2) — porté de Blog.jsx (fonction Article) : structure
61:// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
62-// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
63-// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
64-import { NuxtLink } from "#components";
--
66-const route = useRoute();
67-
68-// Normalise le chemin (retire le(s) slash(es) final/aux) pour éviter un faux 404
69:// sur une URL du type "/blog/mon-article/".
70-const path = computed(() => route.path.replace(/\/+$/, "") || "/");
71-
72-const { data: page, error } = await useAsyncData(
--
77-);
78-
79-// Erreur adaptée à l'état courant : 500 si la requête de contenu échoue (on ne masque
80:// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
81-const resolveContentError = () => {
82-  if (error.value) {
83:    return createError({ statusCode: 500, statusMessage: "Erreur lors du chargement de l'article" });
84-  }
85-  if (!page.value) {
86-    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
--
108-  });
109-}
110-
111:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
112:// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
113:const siteUrl = useSiteUrl();
114:usePageSeo(() => {
115:  const article = page.value;
116:  if (!article) {
117-    return null;
118-  }
119:  const url = `${siteUrl}${article.path}`;
120:  const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
121-  const jsonLd = {
122-    "@context": "https://schema.org",
123-    "@type": "BlogPosting",
124:    headline: article.title,
125:    description: article.description,
126:    datePublished: article.date,
127-    author: { "@type": "Person", name: "Simon Jouan" },
128-    url,
129:    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
130-    ...(image ? { image } : {}),
131-  };
132-
133-  return {
134:    title: `${article.title} — jouan.ovh`,
135:    description: article.description,
136:    path: article.path,
137:    image: article.image?.src,
138:    type: "article",
139-    jsonLd,
140-  };
141-});
--
145-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
146-// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
147-// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
148:.blog-article {
149-  display: block;
150-}
151-
152:// ---- Conteneur article (porté de kit.css : .article) ----
153:.article {
154-  max-width: 760px;
155-  margin: 0 auto;
156-}
157-
158-// Lien retour (porté de kit.css : .hdr__link) — mono discret, soulignement + ring au focus.
159:.article__back {
160-  display: inline-block;
161-  margin-bottom: var(--space-5);
162-  font-family: var(--font-mono);
--
176-  }
177-}
178-
179:.article__tags {
180-  margin-bottom: var(--space-4);
181-}
182-
183:// Titre article (porté de kit.css : .article h1).
184:.article__title {
185-  margin-bottom: var(--space-4);
186-  font-family: var(--font-mono);
187-  font-size: var(--fs-4xl);
--
191-}
192-
193-// Méta : base mono via .post__meta (global) ; ici on ajoute la marge de l'en-tête.
194:.article__meta {
195-  margin: var(--space-4) 0 var(--space-8);
196-}
197-
198:// Image héro (porté de kit.css : .article__hero).
199:.article__hero {
200-  width: 100%;
201-  height: 320px;
202-  margin-bottom: var(--space-8);
--
207-
208-// ---- Prose (HTML généré par @nuxt/content → cibler via :deep()) ----
209-// .prose (global) donne déjà font-sans / lh-relaxed / text-body. Ici : taille + rythme
210:// vertical + titres + code, fidèles à kit.css (.article .prose ...).
211:.article__prose {
212-  font-size: var(--fs-md);
213-
214-  :deep(p) {
--
366-}
367-
368-// ---- Bloc CTA de fin (porté de Blog.jsx) ----
369:.article__cta {
370-  display: flex;
371-  flex-wrap: wrap;
372-  gap: var(--space-4);
--
377-  border-top: 1px solid var(--border-subtle);
378-}
379-
380:.article__cta-label {
381-  font-family: var(--font-mono);
382-  font-size: var(--fs-sm);
383-  color: var(--text-muted);

exec
/bin/zsh -lc "printf '%s\\n' '--- generated output ---'; if [ -d .output/public ]; then rg --files .output/public | sort | head -80; else echo 'no .output/public'; fi; printf '%s\\n' '--- current status ---'; git status --short; printf '%s\\n' '--- baseline SEO helper/pages ---'; git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/utils/seo.ts 2>/dev/null || true; printf '%s\\n' '--- baseline useSiteUrl/config ---'; git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/composables/useSiteUrl.ts 2>/dev/null || true; printf '%s\\n' '--- package scripts ---'; node -e 'const p=require(\"./package.json\"); console.log(JSON.stringify(p.scripts,null,2))' 2>/dev/null || sed -n '1,140p' package.json" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- generated output ---
.output/public/200.html
.output/public/404.html
.output/public/CNAME
.output/public/__nuxt_content/blog/sql_dump.txt
.output/public/_headers
.output/public/_ipx/_/images/portrait.jpeg
.output/public/_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg
.output/public/_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg
.output/public/_nuxt/3JCRz6lv.js
.output/public/_nuxt/7aYiFbNO.js
.output/public/_nuxt/7tOpXIIM.js
.output/public/_nuxt/9UfCg06-.js
.output/public/_nuxt/A7iJyabv.js
.output/public/_nuxt/B3XAL9TF.js
.output/public/_nuxt/B6mXn3co.js
.output/public/_nuxt/BGEXL5Gu.js
.output/public/_nuxt/BIRIX3ZF.js
.output/public/_nuxt/BK6bKpmh.js
.output/public/_nuxt/BLPwvjTA.js
.output/public/_nuxt/BOBTTWF0.js
.output/public/_nuxt/BUEoJ5Bd.js
.output/public/_nuxt/BgNGmv6W.js
.output/public/_nuxt/BkGd__4j.js
.output/public/_nuxt/BoviyLWL.js
.output/public/_nuxt/BvwDQc2C.js
.output/public/_nuxt/CB70Z7Ya.js
.output/public/_nuxt/CEP5-_Us.js
.output/public/_nuxt/CEtDha0H.js
.output/public/_nuxt/CFgWZEEp.js
.output/public/_nuxt/CJV6Jzoc.js
.output/public/_nuxt/CXi3cvGG.js
.output/public/_nuxt/CZ1SZu0f.js
.output/public/_nuxt/CcKbyKfr.js
.output/public/_nuxt/CjgUC_QF.js
.output/public/_nuxt/CnnDdhXX.js
.output/public/_nuxt/Cwy5ZDuP.js
.output/public/_nuxt/Cxb3J1cf.js
.output/public/_nuxt/CxlQZYrj.js
.output/public/_nuxt/D-k7rLdV.js
.output/public/_nuxt/D2g1RPey.js
.output/public/_nuxt/D7f-lCIX.js
.output/public/_nuxt/DVmMlLn9.js
.output/public/_nuxt/Df_NIof0.js
.output/public/_nuxt/DlAUqK2U.js
.output/public/_nuxt/DvOHFShh.js
.output/public/_nuxt/DzWZJn4U.js
.output/public/_nuxt/LinkListComponent.BRYW5MSq.css
.output/public/_nuxt/MOnqPcsr.js
.output/public/_nuxt/ProsePre.D5orA6B_.css
.output/public/_nuxt/U6vo5jtL.js
.output/public/_nuxt/UbuntuMono-Bold.DxtomZAI.ttf
.output/public/_nuxt/UbuntuMono-BoldItalic.TXXgaKQw.ttf
.output/public/_nuxt/UbuntuMono-Italic.B29yKq6H.ttf
.output/public/_nuxt/UbuntuMono-Regular.C0QEQ_U4.ttf
.output/public/_nuxt/WjsIUcnj.js
.output/public/_nuxt/ZBadge.BAw1B01J.css
.output/public/_nuxt/ZButton.CyAD_ftR.css
.output/public/_nuxt/ZCard.C5C9a-aj.css
.output/public/_nuxt/ZTag.f2Aq6DLg.css
.output/public/_nuxt/ZgUbhe05.js
.output/public/_nuxt/_...CPiAFn3m.css
.output/public/_nuxt/about.ox_hIrdj.css
.output/public/_nuxt/builds/latest.json
.output/public/_nuxt/builds/meta/397c34db-7991-4ecc-9cb6-0664bbf982d0.json
.output/public/_nuxt/contact.Co71VCIU.css
.output/public/_nuxt/default.e0doGEOD.css
.output/public/_nuxt/entry.QaoIl47T.css
.output/public/_nuxt/error-404.BvOk15Jd.css
.output/public/_nuxt/error-500.CIKAhgAS.css
.output/public/_nuxt/index.DWliMmIh.css
.output/public/_nuxt/index.DYn9lnq-.css
.output/public/_nuxt/jgeOKlzh.js
.output/public/_nuxt/lubjcR-3.js
.output/public/_nuxt/n0XdkQXy.js
.output/public/_nuxt/services.C9Fgnb_o.css
.output/public/_nuxt/sqlite3-DBpDb1lf.wasm
.output/public/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js
.output/public/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js
.output/public/_nuxt/sqlite3.DBpDb1lf.wasm
.output/public/_nuxt/u8mfYzvJ.js
--- current status ---
 M app/app.vue
 A app/composables/usePageSeo.ts
 M app/pages/about.vue
 M app/pages/blog/[...slug].vue
 M app/pages/blog/index.vue
 M app/pages/contact.vue
 M app/pages/index.vue
 M app/pages/services.vue
 M docs/implementation-artifacts/10-5-seo-centralise-site-wide.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/10-5/
--- baseline SEO helper/pages ---
// Constantes & helpers SEO partagés (auto-importés depuis app/utils/).

// Domaine de production — cf. public/CNAME (dev.jouan.ovh). Source unique : évite la
// duplication de l'URL dans /about, /blog, /blog/[...slug].
export const SITE_URL = "https://dev.jouan.ovh";

// Construit l'entrée <script type="application/ld+json"> pour useHead, en échappant
// « < » → « < ». Garantit qu'aucune séquence "</script>" éventuellement présente
// dans les données (titres, descriptions d'articles…) ne ferme la balise prématurément.
export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    innerHTML: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
--- baseline useSiteUrl/config ---
--- package scripts ---
{
  "build": "nuxi build",
  "dev": "nuxi dev",
  "generate": "nuxi generate",
  "preview": "nuxi preview",
  "postinstall": "nuxi prepare",
  "lint": "eslint . && stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
  "lint:style": "stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
  "typecheck": "nuxi typecheck",
  "deploy": "push-dir --dir=.output/public --branch=gh-pages --cleanup"
}

exec
/bin/zsh -lc "printf '%s\\n' '--- prerendered HTML files ---'; find .output/public -type f -name '*.html' -not -path '*/_nuxt/*' -print | sort; printf '%s\\n' '--- SEO tags by page ---'; for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do echo \"### "'$f"; rg -o '"'<title>["'^<]*|<meta (name|property)="(description|og:[''^"]+|twitter:[''^"]+)"[''^>]*|<link rel="canonical"[''^>]*|<script type="application/ld'"\\+json\">["'^<]+'"' \""'$f" | head -40; done; printf '"'%s\\n' '--- JSON-LD snippets ---'; for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do echo \"### "'$f"; rg -o '"'<script type=\"application/ld\\+json\">["'^<]+'"' \""'$f" | sed '"'s/<script type=\"application\\/ld+json\">//' | head -4; done" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- prerendered HTML files ---
.output/public/200.html
.output/public/404.html
.output/public/about/index.html
.output/public/blog/index.html
.output/public/contact/index.html
.output/public/index.html
.output/public/services/index.html
--- SEO tags by page ---
### .output/public/index.html
<title>Simon Jouan — Développeur web freelance &amp; IA
<meta name="description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur web freelance","url":"https://dev.jouan.ovh","description":"Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils."}
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<meta property="og:title" content="Simon Jouan — Développeur web freelance & IA"
<meta property="og:description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<meta property="og:url" content="https://dev.jouan.ovh"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Simon Jouan — Développeur web freelance & IA"
<meta name="twitter:description" content="Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
### .output/public/services/index.html
<title>Services — jouan.ovh
<meta name="description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/services"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
<meta property="og:title" content="Services — jouan.ovh"
<meta property="og:description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<meta property="og:url" content="https://dev.jouan.ovh/services"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Services — jouan.ovh"
<meta name="twitter:description" content="Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
### .output/public/contact/index.html
<title>Contact — jouan.ovh
<meta name="description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/contact"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ContactPage","name":"Contact — jouan.ovh","description":"Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.","url":"https://dev.jouan.ovh/contact","mainEntity":{"@type":"Person","name":"Simon Jouan","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}}
<meta property="og:title" content="Contact — jouan.ovh"
<meta property="og:description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<meta property="og:url" content="https://dev.jouan.ovh/contact"
<meta property="og:type" content="website"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Contact — jouan.ovh"
<meta name="twitter:description" content="Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
### .output/public/about/index.html
<title>À propos — jouan.ovh
<meta name="description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/about"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
<meta property="og:title" content="À propos — jouan.ovh"
<meta property="og:description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<meta property="og:url" content="https://dev.jouan.ovh/about"
<meta property="og:type" content="profile"
<meta property="og:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="À propos — jouan.ovh"
<meta name="twitter:description" content="Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours."
<meta name="twitter:image" content="https://dev.jouan.ovh/images/portrait.jpeg"
### .output/public/blog/index.html
<title>Blog — jouan.ovh
<meta name="description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
<link rel="canonical" href="https://dev.jouan.ovh/blog"
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Blog","name":"Notes de dev","description":"Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.","url":"https://dev.jouan.ovh/blog","blogPost":[]}
<meta property="og:title" content="Blog — jouan.ovh"
<meta property="og:description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
<meta property="og:url" content="https://dev.jouan.ovh/blog"
<meta property="og:type" content="website"
<meta name="twitter:card" content="summary"
<meta name="twitter:title" content="Blog — jouan.ovh"
<meta name="twitter:description" content="Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web."
--- JSON-LD snippets ---
### .output/public/index.html
{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
{"@context":"https://schema.org","@type":"WebSite","name":"Simon Jouan — Développeur web freelance","url":"https://dev.jouan.ovh","description":"Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils."}
{"@context":"https://schema.org","@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
### .output/public/services/index.html
{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
{"@context":"https://schema.org","@type":"WebPage","name":"Services — jouan.ovh","description":"Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.","url":"https://dev.jouan.ovh/services","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"Offer","position":1,"name":"WordPress sur-mesure","description":"Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.","price":"à partir de 1 500 €"},{"@type":"Offer","position":2,"name":"Applications web","description":"Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.","price":"sur devis"},{"@type":"Offer","position":3,"name":"IA & automatisation","description":"L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.","price":"sur devis"}]}}
### .output/public/contact/index.html
{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
{"@context":"https://schema.org","@type":"ContactPage","name":"Contact — jouan.ovh","description":"Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.","url":"https://dev.jouan.ovh/contact","mainEntity":{"@type":"Person","name":"Simon Jouan","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}}
### .output/public/about/index.html
{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
{"@context":"https://schema.org","@type":"ProfilePage","name":"À propos — jouan.ovh","url":"https://dev.jouan.ovh/about","mainEntity":{"@type":"Person","name":"Simon Jouan","jobTitle":"Développeur web freelance","url":"https://dev.jouan.ovh","image":"https://dev.jouan.ovh/images/portrait.jpeg"}}
### .output/public/blog/index.html
{"@context":"https://schema.org","@type":"Organization","name":"Simon Jouan","url":"https://dev.jouan.ovh","logo":"https://dev.jouan.ovh/images/logo.png","email":"simon@jouan.ovh","address":{"@type":"PostalAddress","addressLocality":"Valognes, France"}}
{"@context":"https://schema.org","@type":"Blog","name":"Notes de dev","description":"Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.","url":"https://dev.jouan.ovh/blog","blogPost":[]}

exec
/bin/zsh -lc "rg -n -C 4 'SEO|json.ld|JSON-LD|publisher|Organization|SITE_URL|useSiteUrl|canonical|Open Graph|Twitter|prerender|generate' docs/project-context.md docs/planning-artifacts/epics.md docs/implementation-artifacts/10-5-seo-centralise-site-wide.md app | head -260" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-1----
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-2-baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-3----
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-4-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:5:# Story 10.5: SEO centralisé site-wide
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-6-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-7-Status: review
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-8-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-9-<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-10-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-11-## Story
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-12-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-13-As a visiteur partageant une page (ou un moteur d'indexation),
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:14:I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-15-so that le site est correctement indexé et présenté lors d'un partage (FR15).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-16-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-17-## Acceptance Criteria
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-18-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:19:**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home n'a aucune meta dédiée ; services et contact n'exposent que `title`+`description`)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:20:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:21:**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-22-**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-23-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-24-## Tasks / Subtasks
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-25-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:26:- [x] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:27:  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:28:  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-29-- [x] Tâche 2 — Étendre aux pages nues (AC: tout)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:30:  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:31:  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:32:  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:33:  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-34-- [x] Tâche 3 — Validation (AC: tout)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:35:  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:36:  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-37-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-38-## Dev Notes
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-39-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-40-### Périmètre & frontières
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-41-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:42:- **Story SEO** : centralise le pattern méta + l'étend aux pages nues. Source : `deferred-work.md` → Epic 10 item #6 (revues 5.1, 6.1, 6.2). [Source: epics.md#Epic 10 — Story 10.5 (FR15)]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:43:- **Dépend de la story 10.1** : `SITE_URL` doit déjà être lu depuis `runtimeConfig.public.siteUrl` (plomberie posée en 10.1). **Ne pas re-hardcoder** le domaine. Si 10.1 a introduit un `useSiteUrl()`, le réutiliser.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:44:- **Frontières** : SEO uniquement. PAS la bascule domaine prod (= 10.7, le `siteUrl` reste `dev.jouan.ovh` par défaut), PAS l'a11y (10.2/10.3/10.4), PAS le RGPD (10.6).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:45:- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-46-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-47-### Fichiers concernés (lus — baseline `3e82045`)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-48-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:49:- **`app/utils/seo.ts`** (UPDATE) — `jsonLdScript()` conservé ; `SITE_URL` déplacé en runtimeConfig (10.1). Peut accueillir des helpers de construction d'URL/JSON-LD partagés.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-50-- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:51:- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:52:- **`app/pages/index.vue`** (UPDATE) — **aucun `useHead`** aujourd'hui → ajouter le SEO complet.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-53-- **`app/pages/services.vue`**, **`app/pages/contact.vue`** (UPDATE) — `useHead` avec `title`+`description` seuls → étendre.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:54:- **`app/pages/about.vue`**, **`app/pages/blog/index.vue`**, **`app/pages/blog/[...slug].vue`** (UPDATE) — migration vers le helper, **sans régression** (ils consomment `SITE_URL` aux lignes connues : about l.137-138, blog/index l.103/118/120, article l.117-118).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:55:- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-56-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-57-### Pièges / régressions à éviter
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-58-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-59-- **`useRuntimeConfig()` dans le contexte Nuxt** (setup/plugin), pas au top-level d'un module (piège vu en 10.1).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:60:- **Ne pas régresser le SEO existant** d'`/about`/`/blog`/article : vérifier le HTML prerendu **avant/après** la migration (mêmes balises, mêmes URLs).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:61:- **JSON-LD échappé** : toujours via `jsonLdScript()` (échappe `</script>`) — ne pas injecter de JSON-LD brut.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-62-- **Image OG** : URL **absolue** (préfixée `siteUrl`) ; vérifier que l'asset existe (`public/images/…`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:63:- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-64-- **Domaine non basculé** : tant que 10.7 n'est pas faite, les URLs restent `https://dev.jouan.ovh/...` — **c'est attendu** (ne pas hardcoder `jouan.ovh`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-65-- **pnpm + Docker** pour la gate.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-66-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-67-### Testing standards
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-68-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:69:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-70-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-71-### References
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-72-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-73-- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.5 (FR15)]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:74:- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #6 centralisation SEO), revues 5.1, 6.1, 6.2]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:75:- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-76-- [Source: app/utils/seo.ts ; app/pages/index.vue, services.vue, contact.vue, about.vue, blog/index.vue, blog/[...slug].vue ; nuxt.config.ts ; app/data/site.ts]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:77:- [Source: Story 10.1 — SITE_URL via runtimeConfig (dépendance)]
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-78-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-79-## Dev Agent Record
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-80-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-81-### Agent Model Used
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-82-- Gemini 3.7 Flash
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-83-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-84-### Debug Log References
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:85:- Build & gate : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error, 11 prerendered routes.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:86:- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-87-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-88-### Completion Notes List
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:89:- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:90:- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:91:- Ajout des métadonnées SEO et schémas Schema.org (`WebSite`, `Person`, `Service`/`WebPage`, `ContactPage`, `ProfilePage`, `Blog`, `BlogPosting`) sur toutes les pages (`/`, `/services`, `/contact`, `/about`, `/blog`, `/blog/[...slug]`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:92:- Aucune URL hardcodée : résolution dynamique via `useSiteUrl()`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:93:- Validation complète via Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 11 routes prerendues avec succès et inspection conforme du HTML généré.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-94-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-95-### File List
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-96-- `app/composables/usePageSeo.ts` (NEW)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-97-- `app/app.vue` (MODIFIED)
--
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-104-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-105-- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-106-
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md-107-## Change Log
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:108:- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
--
docs/planning-artifacts/epics.md-35-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
docs/planning-artifacts/epics.md-36-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/planning-artifacts/epics.md-37-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/planning-artifacts/epics.md:39:FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/planning-artifacts/epics.md-40-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
docs/planning-artifacts/epics.md:41:FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_
docs/planning-artifacts/epics.md-42-
docs/planning-artifacts/epics.md-43-### NonFunctional Requirements
docs/planning-artifacts/epics.md-44-
docs/planning-artifacts/epics.md-45-NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
docs/planning-artifacts/epics.md-46-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
docs/planning-artifacts/epics.md-47-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
docs/planning-artifacts/epics.md:48:NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
docs/planning-artifacts/epics.md:49:NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
docs/planning-artifacts/epics.md-50-NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
docs/planning-artifacts/epics.md-51-NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
docs/planning-artifacts/epics.md-52-NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
docs/planning-artifacts/epics.md-53-NFR9: Easter-egg terminal préservé — aucune commande existante cassée.
docs/planning-artifacts/epics.md-54-
docs/planning-artifacts/epics.md-55-### Additional Requirements
docs/planning-artifacts/epics.md-56-
docs/planning-artifacts/epics.md:57:- Gestionnaire de paquets **Yarn** ; build `yarn generate` → `.output/public` ; déploiement `yarn deploy` (push-dir `gh-pages`).
docs/planning-artifacts/epics.md-58-- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
docs/planning-artifacts/epics.md-59-- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
docs/planning-artifacts/epics.md-60-- Blog via `@nuxt/content` markdown — dossier `content/` à créer.
docs/planning-artifacts/epics.md-61-- Pas de framework de test ; barre de qualité = lint (`eslint`, `stylelint`) + build vert.
--
docs/planning-artifacts/epics.md-97-FR11: Epic 9 — Accessibilité & finitions motion
docs/planning-artifacts/epics.md-98-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/planning-artifacts/epics.md-99-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md:101:FR15: Epic 10 — SEO centralisé site-wide
docs/planning-artifacts/epics.md-102-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
docs/planning-artifacts/epics.md-103-FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)
docs/planning-artifacts/epics.md-104-
docs/planning-artifacts/epics.md-105-## Epic List
--
docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/planning-artifacts/epics.md-141-**FRs covered:** FR11 _(UX-DR17)_
docs/planning-artifacts/epics.md-142-
docs/planning-artifacts/epics.md-143-### Epic 10: Fin de refonte
docs/planning-artifacts/epics.md:144:La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
docs/planning-artifacts/epics.md-145-**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-146-
docs/planning-artifacts/epics.md-147----
docs/planning-artifacts/epics.md-148-
--
docs/planning-artifacts/epics.md-160-
docs/planning-artifacts/epics.md-161-**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
docs/planning-artifacts/epics.md-162-**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
docs/planning-artifacts/epics.md-163-**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
docs/planning-artifacts/epics.md:164:**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé
docs/planning-artifacts/epics.md-165-
docs/planning-artifacts/epics.md-166-### Story 1.2: Mettre à jour les modules et dépendances
docs/planning-artifacts/epics.md-167-
docs/planning-artifacts/epics.md-168-As a mainteneur du site,
--
docs/planning-artifacts/epics.md-191-
docs/planning-artifacts/epics.md-192-### Story 1.4: Valider build statique et déploiement gh-pages
docs/planning-artifacts/epics.md-193-
docs/planning-artifacts/epics.md-194-As a mainteneur du site,
docs/planning-artifacts/epics.md:195:I want valider `yarn generate` et le déploiement gh-pages après migration,
docs/planning-artifacts/epics.md-196-So that la chaîne de production est verte avant d'entamer la refonte.
docs/planning-artifacts/epics.md-197-
docs/planning-artifacts/epics.md-198-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-199-
docs/planning-artifacts/epics.md-200-**Given** la stack migrée
docs/planning-artifacts/epics.md:201:**When** on lance `yarn generate`
docs/planning-artifacts/epics.md-202-**Then** le build statique réussit et `.output/public` contient les pages existantes
docs/planning-artifacts/epics.md-203-**And** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel
docs/planning-artifacts/epics.md-204-
docs/planning-artifacts/epics.md-205----
--
docs/planning-artifacts/epics.md-523-
docs/planning-artifacts/epics.md-524-**Given** `TerminalComponent.vue` / `TerminalManagerComponent.vue` en Options API
docs/planning-artifacts/epics.md-525-**When** on les réécrit en `<script setup lang="ts">` à comportement constant
docs/planning-artifacts/epics.md-526-**Then** plus aucune Options API dans le sous-système terminal, et commandes / drag / resize / ouverture (header + `/contact`) sans régression
docs/planning-artifacts/epics.md:527:**And** le rendu visuel (restyle 8.1) et `lint`/`typecheck`/`generate` restent identiques/verts
docs/planning-artifacts/epics.md-528-
docs/planning-artifacts/epics.md-529----
docs/planning-artifacts/epics.md-530-
docs/planning-artifacts/epics.md-531-## Epic 9: Accessibilité & finitions motion
--
docs/planning-artifacts/epics.md-563-## Epic 10: Fin de refonte
docs/planning-artifacts/epics.md-564-
docs/planning-artifacts/epics.md-565-_(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic. Le roadmap d'épics 1→9 est `done` mais la refonte n'est pas livrée ; cet épic la rend livrable et la met en production.)_
docs/planning-artifacts/epics.md-566-
docs/planning-artifacts/epics.md:567:La refonte est **réellement livrée** : l'accessibilité résiduelle est bouclée et validée, le SEO est centralisé, la conformité légale est publiée, et le site est déployé en production sur `jouan.ovh` (chaîne gh-pages prouvée, `CNAME` intact). Source : `deferred-work.md` (section « → Epic 10 »). Barre qualité inchangée (pas de framework de test) : `pnpm lint` + `pnpm typecheck` + `pnpm generate` verts + vérification Chrome DevTools MCP.
docs/planning-artifacts/epics.md-568-
docs/planning-artifacts/epics.md-569-### Story 10.1: Décision hébergement prod et dé-risquage du déploiement gh-pages
docs/planning-artifacts/epics.md-570-
docs/planning-artifacts/epics.md-571-As a mainteneur du site,
--
docs/planning-artifacts/epics.md-573-So that la première mise en production de la refonte ne révèle pas de surprise (chaîne CI jamais prouvée, ~28 stories empilées).
docs/planning-artifacts/epics.md-574-
docs/planning-artifacts/epics.md-575-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-576-
docs/planning-artifacts/epics.md:577:**Given** la cible prod `jouan.ovh` et la chaîne `pnpm generate` → `push-dir` vers `gh-pages`
docs/planning-artifacts/epics.md-578-**When** on tranche l'hébergement prod (domaine, branche de déploiement, `CNAME`) et on exécute un dry-run du déploiement depuis le staging (`develop`)
docs/planning-artifacts/epics.md:579:**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
docs/planning-artifacts/epics.md:580:**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story
docs/planning-artifacts/epics.md-581-
docs/planning-artifacts/epics.md-582-### Story 10.2: A11y sémantique résiduelle (home / services / contact)
docs/planning-artifacts/epics.md-583-
docs/planning-artifacts/epics.md-584-As a visiteur utilisant un lecteur d'écran,
--
docs/planning-artifacts/epics.md-589-
docs/planning-artifacts/epics.md-590-**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
docs/planning-artifacts/epics.md-591-**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
docs/planning-artifacts/epics.md-592-**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
docs/planning-artifacts/epics.md:593:**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
docs/planning-artifacts/epics.md-594-
docs/planning-artifacts/epics.md-595-### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
docs/planning-artifacts/epics.md-596-
docs/planning-artifacts/epics.md-597-As a visiteur,
--
docs/planning-artifacts/epics.md-617-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/planning-artifacts/epics.md-618-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/planning-artifacts/epics.md-619-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/planning-artifacts/epics.md-620-
docs/planning-artifacts/epics.md:621:### Story 10.5: SEO centralisé site-wide
docs/planning-artifacts/epics.md-622-
docs/planning-artifacts/epics.md-623-As a visiteur partageant une page (ou un moteur d'indexation),
docs/planning-artifacts/epics.md:624:I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
docs/planning-artifacts/epics.md-625-So that le site est correctement indexé et présenté lors d'un partage (FR15).
docs/planning-artifacts/epics.md-626-
docs/planning-artifacts/epics.md-627-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-628-
docs/planning-artifacts/epics.md:629:**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home, services, contact n'exposent que `title`+`description`)
docs/planning-artifacts/epics.md:630:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/planning-artifacts/epics.md:631:**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
docs/planning-artifacts/epics.md-632-**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact
docs/planning-artifacts/epics.md-633-
docs/planning-artifacts/epics.md-634-### Story 10.6: Conformité légale (RGPD + mentions légales)
docs/planning-artifacts/epics.md-635-
--
docs/planning-artifacts/epics.md-640-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-641-
docs/planning-artifacts/epics.md-642-**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
docs/planning-artifacts/epics.md-643-**When** on publie une page « politique de confidentialité » (base légale, finalité, durée de conservation, sous-traitant Web3Forms, droits des personnes) + une page mentions légales, liées depuis le footer et/ou le formulaire
docs/planning-artifacts/epics.md:644:**Then** les deux pages existent, sont liées et rendues en prerender, en français/vouvoiement/sans emoji (NFR6) et stylées au DS
docs/planning-artifacts/epics.md-645-**And** gate verte ; contenu cadré avec le skill `rgpd-france`
docs/planning-artifacts/epics.md-646-
docs/planning-artifacts/epics.md-647-### Story 10.7: Mise en production réelle
docs/planning-artifacts/epics.md-648-
--
docs/planning-artifacts/epics.md-652-
docs/planning-artifacts/epics.md-653-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-654-
docs/planning-artifacts/epics.md-655-**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
docs/planning-artifacts/epics.md:656:**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
docs/planning-artifacts/epics.md-657-**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
docs/planning-artifacts/epics.md:658:**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
--
docs/project-context.md-26-- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.

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

exec
/bin/zsh -lc "rg -n -C 12 'SEO|seo|publisher|Organization|centralis' docs/implementation-artifacts/deferred-work.md docs 2>/dev/null | head -220; printf '%s\\n' '--- source line numbers ---'; nl -ba app/composables/usePageSeo.ts | sed -n '1,125p'; nl -ba app/pages/blog/'[...slug].vue' | sed -n '108,145p'; nl -ba app/pages/services.vue | sed -n '125,175p'; nl -ba app/app.vue | sed -n '1,45p'; nl -ba app/pages/about.vue | sed -n '130,165p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/deferred-work.md-1-# Deferred work
docs/implementation-artifacts/deferred-work.md-2-
docs/implementation-artifacts/deferred-work.md-3-_Travaux réels mais reportés, remontés par les revues de code. À reprendre dans la story/epic indiquée._
docs/implementation-artifacts/deferred-work.md-4-
docs/implementation-artifacts/deferred-work.md-5----
docs/implementation-artifacts/deferred-work.md-6-
docs/implementation-artifacts/deferred-work.md-7-## 📋 Inventaire consolidé (synthèse — maj rétro Epic 9, 2026-06-29)
docs/implementation-artifacts/deferred-work.md-8-
docs/implementation-artifacts/deferred-work.md-9-_Vue d'ensemble par destination. Le détail par story est conservé dans les sections chronologiques ci-dessous. Aucune dette technique laissée dans les épics (chaque story a soldé ses findings) ; ce sont des **généralisations DS-wide / d'architecture** délibérément regroupées pour être traitées en un seul passage._
docs/implementation-artifacts/deferred-work.md-10-
docs/implementation-artifacts/deferred-work.md:11:> **Décision rétro Epic 9 (2026-06-29) :** les épics 1→9 sont `done`, **mais la refonte n'est pas livrée**. Tout le reste (a11y résiduel non couvert par 9.1/9.2, SEO, RGPD, déploiement, audit a11y émulé) est **consolidé dans un futur Epic 10 « fin de refonte »** — épic à écrire (handoff `bmad` planification). Epic 9 se clôt tel quel.
docs/implementation-artifacts/deferred-work.md-12-
docs/implementation-artifacts/deferred-work.md-13-### ✅ Soldé en Epic 9
docs/implementation-artifacts/deferred-work.md-14-
docs/implementation-artifacts/deferred-work.md-15-- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
docs/implementation-artifacts/deferred-work.md-16-- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
docs/implementation-artifacts/deferred-work.md-17-- ~~**Contraste — `--text-faint` sous AA**~~ — ✅ **Résolu (story 9.2)** : 4 textes informatifs réels remontés à `--text-muted` (token-only).
docs/implementation-artifacts/deferred-work.md-18-- ~~**Clavier — Échap + retour de focus terminal**~~ — ✅ **Résolu (story 9.2)**.
docs/implementation-artifacts/deferred-work.md-19-
docs/implementation-artifacts/deferred-work.md-20-### → Epic 10 — Fin de refonte (épic à écrire ; décision rétro Epic 9)
docs/implementation-artifacts/deferred-work.md-21-
docs/implementation-artifacts/deferred-work.md-22-**A11y résiduel (non couvert par les AC de 9.1/9.2) :**
docs/implementation-artifacts/deferred-work.md-23-
docs/implementation-artifacts/deferred-work.md-24-1. ~~**Généralisation de la convention a11y titres + listes**~~ — ✅ **Résolu en 10.2**
docs/implementation-artifacts/deferred-work.md-25-2. ~~**Audit site-wide des liens `target="_blank"`**~~ — ✅ **Résolu en 10.3**
docs/implementation-artifacts/deferred-work.md-26-3. ~~**Sémantique a11y de la colonne `/contact`**~~ — ✅ **Résolu en 10.2**
docs/implementation-artifacts/deferred-work.md-27-4. ~~**Audit a11y émulé OS-level**~~ — ✅ **Résolu (story 10.4)** : validation runtime `forced-colors: active` et `prefers-reduced-motion: reduce` + parcours lecteur d'écran VoiceOver. _(revues 9.1, 9.2, 10.4)_
docs/implementation-artifacts/deferred-work.md-28-5. ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu (story 10.4)** : bloc page-level `@media` d'`index.vue` rabattu sur le repli inline standard DS `outline: 2px solid transparent; outline-offset: 2px;`. 100% des focusables unifiés. _(revues 9.1, 10.4)_
docs/implementation-artifacts/deferred-work.md-29-
docs/implementation-artifacts/deferred-work.md:30:**SEO :**
docs/implementation-artifacts/deferred-work.md-31-
docs/implementation-artifacts/deferred-work.md:32:6. **Centralisation SEO site-wide** — la **dette concrète est soldée** (6.2) : `SITE_URL` unique dans `app/utils/seo.ts` (dédup `/about`+`/blog`+article), JSON-LD via `jsonLdScript()` qui échappe `</script>`. ✅ **`SITE_URL` sourcé depuis `runtimeConfig` fait en 10.1** (`runtimeConfig.public.siteUrl` + composable `useSiteUrl()`, surchargeable `NUXT_PUBLIC_SITE_URL`). **Reste** (architecture, non-dette) : migrer vers `useSeoMeta`/`app.head` partagé, ajouter `publisher`/`Organization` (ou `nuxt-schema-org`), et étendre OG/JSON-LD aux pages encore nues (home, services, contact). → **story 10.5**. _(revues 5.1, 6.1, 6.2)_
docs/implementation-artifacts/deferred-work.md-33-7. **Domaine de production** — ✅ **Hébergement tranché (Simon, 2026-06-30) + plomberie posée (10.1).** Décision : **prod `jouan.ovh` sur CE repo** (`main` → `gh-pages`, Option A) ; **staging `dev.jouan.ovh` = setup séparé** hors chemin critique (contrainte GitHub Pages : un repo = un seul domaine custom). `SITE_URL` n'est plus en dur : lu depuis `runtimeConfig.public.siteUrl` (défaut staging `https://dev.jouan.ovh`, surchargeable `NUXT_PUBLIC_SITE_URL`) via `useSiteUrl()` — **staging inchangé**, prod = un flip d'env. **Reste (story 10.7)** : basculer la valeur prod (`NUXT_PUBLIC_SITE_URL=https://jouan.ovh` ou défaut), passer `public/CNAME` à `jouan.ovh`, **et mettre à jour dans le même commit le `grep -qx "dev.jouan.ovh"` du step `Verify static output` de `.github/workflows/cd.yml`** (couplé au CNAME, sinon CI rouge) ; + DNS `jouan.ovh` → GitHub Pages chez OVH. _(rétro Epic 6, décision Simon Epic 10, plomberie 10.1)_
docs/implementation-artifacts/deferred-work.md-34-
docs/implementation-artifacts/deferred-work.md-35-**Légal / RGPD :**
docs/implementation-artifacts/deferred-work.md-36-
docs/implementation-artifacts/deferred-work.md-37-8. **Politique de confidentialité (RGPD)** — le formulaire `/contact` envoie via **Web3Forms** (sous-traitant tiers) et collecte **nom, email, message**. Une **notice courte est posée sous le formulaire** (finalité). **Reste à publier** une page « politique de confidentialité » dédiée — base légale (consentement / intérêt légitime), finalité, durée de conservation, mention du sous-traitant Web3Forms (hébergement/transfert des données), droits des personnes (accès, rectification, effacement) — et à la lier depuis le footer et/ou le formulaire. Vérifier aussi les **mentions légales**. Cf. skill `rgpd-france`. _(revue 7.1, décision Simon Epic 7)_
docs/implementation-artifacts/deferred-work.md-38-
docs/implementation-artifacts/deferred-work.md-39-**Déploiement :**
docs/implementation-artifacts/deferred-work.md-40-
docs/implementation-artifacts/deferred-work.md-41-9. **Déploiement gh-pages réel** — ✅ **Chaîne dé-risquée par un dry-run (10.1)** : gate CI de `cd.yml` reproduit localement (Docker) — `lint`+`typecheck`+`generate` **verts**, **11 routes** prerendered, artefact `.output/public` complet (`index/200/404/about/blog` + `_headers` + portrait), step `Verify static output` OK et **`CNAME` = `dev.jouan.ovh` intact** (régression `cf1829e` non reproduite). **Reste (story 10.7)** : la **première exécution réelle sur `main`** — merge des ~28 stories de `feat/design-system-revamp`, étape `Deploy` (`peaceiris/actions-gh-pages`, gardée `if: push`) réellement déclenchée, + bascule domaine (cf. #7). Option validation pré-merge : ouvrir une PR vers `main` (exécute le gate sans déployer). _(rétros Epic 1→9, dry-run 10.1)_
docs/implementation-artifacts/deferred-work.md-42-
docs/implementation-artifacts/deferred-work.md-43----
docs/implementation-artifacts/deferred-work.md-44-
--
docs/implementation-artifacts/deferred-work.md-46-
docs/implementation-artifacts/deferred-work.md-47-- **Placeholder `ZInput` ~3.7:1 sur `--bg-input` (< 4.5:1 AA)** — résidu conscient : `--text-muted` (relevé de `--text-faint` ~2.2:1) reste sous AA sur la surface la plus claire, mais le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter encore le ferait passer pour une saisie. Acceptable tel quel ; à revoir si un token de placeholder dédié ≥ 4.5:1 est introduit. _(revue 9.2)_
docs/implementation-artifacts/deferred-work.md-48-- ~~**Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)**~~ — ✅ **Résolu en 10.4** : validation runtime complète effectuée sous émulation navigateur & VoiceOver. _(revues 9.2, 10.4)_
docs/implementation-artifacts/deferred-work.md-49-
docs/implementation-artifacts/deferred-work.md-50-## Deferred from: code review of 9-1-etats-interactifs-coherents (2026-06-29)
docs/implementation-artifacts/deferred-work.md-51-
docs/implementation-artifacts/deferred-work.md-52-- ~~**Unifier les deux idiomes forced-colors**~~ — ✅ **Résolu en 10.4** : repli inline `outline: 2px solid transparent; outline-offset: 2px;` généralisé à `index.vue`, suppression du bloc `@media` local. _(revues 9.1, 10.4)_
docs/implementation-artifacts/deferred-work.md-53-- ~~**Émulation `forced-colors: active` non rejouée**~~ — ✅ **Résolu en 10.4** : vérification runtime sous contraste forcé émulé sur l'ensemble des routes. _(revues 9.1, 10.4)_
docs/implementation-artifacts/deferred-work.md-54-
docs/implementation-artifacts/deferred-work.md-55-## Deferred from: code review of 7-2-infos-cta-terminal-et-socials (2026-06-26)
docs/implementation-artifacts/deferred-work.md-56-
docs/implementation-artifacts/deferred-work.md-57-- **a11y sémantique de la colonne droite `/contact`** — la carte infos rend les paires label/valeur en `<div>` (pas de `<dl>/<dt>/<dd>`), le préfixe `//` est lu « slash slash », pas de titre de section, et le CTA terminal n'a pas `aria-haspopup="dialog"`. Fidèle au kit, non bloquant. À reprendre dans le **lot a11y Epic 9** (item 2 consolidé : sémantique titres/listes/régions). _(La ligne de prompt décorative a été traitée en patch 7.2 — `aria-hidden`.)_
docs/implementation-artifacts/deferred-work.md:58:- ~~**DRY — données de contact inline**~~ — ✅ **Résolu en 8.2** : `contact.email`/`city` (`/contact`) et `profile.email`/`city` (`/about`) consomment désormais la source unique `app/data/site.ts` (`SITE.profile`). _(La consolidation `SITE_URL` SEO reste un sujet distinct, item 4.)_
docs/implementation-artifacts/deferred-work.md-59-
docs/implementation-artifacts/deferred-work.md-60-## Deferred from: code review of 7-1-route-contact-et-formulaire (2026-06-26)
docs/implementation-artifacts/deferred-work.md-61-
docs/implementation-artifacts/deferred-work.md:62:- **SEO `/contact`** — `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD), comme `/services`. Déjà couvert par l'**item 4 consolidé** (« étendre OG/JSON-LD aux pages encore nues : home, services, **contact** »). → story SEO dédiée / Epic 9. _(Les 2 autres findings 7.1 — focus a11y à l'envoi, erreurs collantes — sont des **patchs** de la story, pas des différés ; cf. Review Findings du ticket.)_
docs/implementation-artifacts/deferred-work.md-63-- ~~**Clé d'accès Web3Forms à provisionner**~~ — ✅ **OK** (Simon, 2026-06-26) : clé créée et renseignée dans l'env `NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. L'envoi réel du formulaire `/contact` est opérationnel.
docs/implementation-artifacts/deferred-work.md-64-- **Politique de confidentialité (RGPD)** — le formulaire collecte nom/email/message transmis à un tiers (Web3Forms) ; une **notice courte est posée sous le formulaire**. Reste à publier une **page « politique de confidentialité »** dédiée (base légale, finalité, durée, sous-traitant Web3Forms, droits) et à la lier — cf. skill `rgpd-france`. → tâche légale de fin de refonte (hors périmètre 7.1/7.2).
docs/implementation-artifacts/deferred-work.md-65-
docs/implementation-artifacts/deferred-work.md-66-## Deferred from: code review of 6-2-vue-article-prose-et-code (2026-06-25)
docs/implementation-artifacts/deferred-work.md-67-
docs/implementation-artifacts/deferred-work.md:68:- **Centralisation SEO site-wide (consolidation)** — _Dette concrète résolue en 6.2_ : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, dédup `/about`+`/blog`+`/blog/[...slug]`) ; JSON-LD via helper `jsonLdScript()` qui **échappe `<`** (plus de risque `</script>`). _Reste_ (architecture, non-dette) : migration `useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization` (ou `nuxt-schema-org`). → story SEO dédiée / Epic 9.
docs/implementation-artifacts/deferred-work.md-69-- ~~**a11y dates blog + flèche retour**~~ — ✅ **Résolu** : dates en `<time :datetime>` (article + index) ; `←` du lien retour en `<span aria-hidden="true">`. _Reste_ la généralisation a11y (eyebrow→titre + listes home/services) → Epic 9.
docs/implementation-artifacts/deferred-work.md-70-
docs/implementation-artifacts/deferred-work.md-71-## Deferred from: code review of 6-1-index-du-blog-et-empty-state (2026-06-23)
docs/implementation-artifacts/deferred-work.md-72-
docs/implementation-artifacts/deferred-work.md:73:- ~~**SEO `/blog`**~~ — ✅ **Résolu sur `/blog`** (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` ajoutés au `useHead`, vérifiés dans le HTML prerendu. _Reste_ la **centralisation SEO site-wide** (autres pages que `/about` + `/blog`, via `useSeoMeta` partagé / `app.head`) — Epic 9.
docs/implementation-artifacts/deferred-work.md-74-- ~~**Sémantique liste du feed d'articles**~~ — ✅ **Résolu** : feed en `<ul class="blog__list">` + `<li>` par article (reset de liste, rendu identique). _Reste_ la **généralisation a11y** (eyebrow→titre + listes home/services) — Epic 9.
docs/implementation-artifacts/deferred-work.md-75-
docs/implementation-artifacts/deferred-work.md-76-## Deferred from: code review of 5-2-timeline-formation-et-stack (2026-06-23)
docs/implementation-artifacts/deferred-work.md-77-
docs/implementation-artifacts/deferred-work.md-78-- ~~**Sémantique a11y des sections CV de `/about`**~~ — ✅ **Résolu sur `/about`** (décision Simon : zéro dette) : libellés de section en `<h2 class="eyebrow">` (outline `h1 → h2×4`), expériences en `<ol>/<li>`, formation et stack en `<ul>/<li>` ; rendu visuel identique (h2 neutralisé `font-weight`/`line-height`, listes `list-style:none` + marges reset). `<time datetime>` écarté (dates = plages, pas de valeur machine). _Reste à généraliser_ la convention (eyebrow→titre + listes) à **home / services**, en lot avec les items a11y ci-dessous (process `<ol>` 4.2, liens `_blank` 3.3) — **passage a11y d'Epic 9**.
docs/implementation-artifacts/deferred-work.md-79-
docs/implementation-artifacts/deferred-work.md-80-## Deferred from: code review of 5-1-portrait-et-bio (2026-06-23)
docs/implementation-artifacts/deferred-work.md-81-
docs/implementation-artifacts/deferred-work.md-82-_Décision Simon : zéro dette technique → les 3 items ci-dessous ont été traités immédiatement (commit de correctifs de revue), pas reportés._
docs/implementation-artifacts/deferred-work.md-83-
docs/implementation-artifacts/deferred-work.md-84-- ~~**Duplication inter-pages des primitives de layout**~~ — ✅ **Résolu** : primitives `.section` / `.section--sunken` / `.container` / `.eyebrow` / `.prose` extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications scoped retirées de `index.vue`, `services.vue`, `about.vue`. Vérif visuelle desktop des 3 pages : aucune régression.
docs/implementation-artifacts/deferred-work.md-85-- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
docs/implementation-artifacts/deferred-work.md:86:- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.
docs/implementation-artifacts/deferred-work.md-87-
docs/implementation-artifacts/deferred-work.md-88-## Deferred from: code review of 4-2-section-process (2026-06-22)
docs/implementation-artifacts/deferred-work.md-89-
docs/implementation-artifacts/deferred-work.md-90-- **Sémantique `<ol>` pour la séquence du process (`/services`)** — Les 4 étapes ordonnées sont rendues en grille de `<div>` (numéros « 01 »…« 04 » en texte). Fidèle à `Services.jsx` et l'ordre est déjà annoncé aux lecteurs d'écran (AC satisfait, non bloquant). Amélioration : passer en `<ol>`/`<li>` avec les numéros `aria-hidden` (ordre porté par la liste). Décision Simon : accepté tel quel pour 4.2, amélioration différée au passage a11y d'Epic 9.
docs/implementation-artifacts/deferred-work.md-91-
docs/implementation-artifacts/deferred-work.md-92-## Deferred from: code review of 3-3-projets-selectionnes (2026-06-22)
docs/implementation-artifacts/deferred-work.md-93-
docs/implementation-artifacts/deferred-work.md-94-- **Audit site-wide des liens `target="_blank"` sans indication « nouvel onglet »** — _Les cartes projet de `/` ont été traitées localement (span sr-only « (ouvre dans un nouvel onglet) ») lors du fix 3.3._ Reste à auditer/uniformiser les **autres** liens `_blank` du site (hexagones sociaux du header/footer, etc.) et idéalement à factoriser un helper de lien externe (icône + libellé sr-only). Recommandation WCAG G201. À traiter dans le passage a11y d'Epic 9.
docs/implementation-artifacts/deferred-work.md-95-
docs/implementation-artifacts/deferred-work.md-96-## Deferred from: code review of 3-2-apercu-services-et-stats (2026-06-22)
docs/implementation-artifacts/deferred-work.md-97-
docs/implementation-artifacts/deferred-work.md-98-- ~~`role="img" title=""` résiduel sur le wrapper racine `.init`~~ — ✅ **Résolu** lors du fix 3.2 (commit `132093d`) : attribut retiré de `app/layouts/default.vue`.
--
docs/implementation-artifacts/deferred-work.md-104-
docs/implementation-artifacts/deferred-work.md-105-- ~~**CSS mort `.command-prefix` / `.git-prompt-branch` dans `TerminalComponent.vue`**~~ — ✅ **Résolu en 8.1** : classes mortes confirmées par `grep` (aucun usage dans le `<template>` ni dans `programs/`) et **supprimées**. Plus de nettoyage à reporter en 8.3.
docs/implementation-artifacts/deferred-work.md-106-
docs/implementation-artifacts/deferred-work.md-107-## Deferred from: code review of 8-2-preserver-les-commandes-et-louverture (2026-06-26)
docs/implementation-artifacts/deferred-work.md-108-
docs/implementation-artifacts/deferred-work.md-109-_Décision Simon (approche DRY/SOLID) : zéro dette → les items ci-dessous ont été traités dans la story 8.2, pas reportés._
docs/implementation-artifacts/deferred-work.md-110-
docs/implementation-artifacts/deferred-work.md-111-- ~~**DRY — données dupliquées en dur dans les programmes terminal**~~ — ✅ **Résolu en 8.2** : **source de vérité unique `app/data/site.ts`** (`SITE.profile`/`skills`/`projects`, typée `IProfile`/`IProject`). Tous les consommateurs branchés — `Skills/Projets/Contact/About.ts` (terminal), `index.vue`, `about.vue`, `contact.vue`, `FooterComponent.vue` — rendu **identique** vérifié au navigateur. **Solde aussi** l'item « données de contact inline » de la revue 7.2 (ci-dessus). _Reste, hors-scope DRY_ : les `experiences`/`degrees` divergent de **contenu** entre le CV terminal (`About.ts`, 4 xp / 3 diplômes détaillés) et `/about` (3 xp / 2 diplômes condensés) — leur unification est une **décision de contenu** (choisir la version canonique + adapter l'affichage), à trancher en passage CV dédié, pas un refactor mécanique.
docs/implementation-artifacts/deferred-work.md-112-- ~~**Duplication du bookkeeping d'historique dans la branche `clear`**~~ — ✅ **Résolu en 8.2** : helper `recordHistoryAndResetInput()` partagé entre la branche `clear` et le flux normal de `submitInput`. Plus de report en 8.3.
docs/implementation-artifacts/deferred-work.md-113-
docs/implementation-artifacts/deferred-work.md-114-## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-07-02)
docs/implementation-artifacts/deferred-work.md-115-
docs/implementation-artifacts/deferred-work.md:116:- **`article.image.src` sans slash initial → URL d'image malformée** — Dans `blog/index.vue` (JSON-LD `image`) et `blog/[...slug].vue` (`og:image` + JSON-LD), `` `${siteUrl}${article.image.src}` `` concatène sans séparateur : un frontmatter d'article avec `image: { src: "images/x.webp" }` (sans `/` initial) produirait `https://dev.jouan.ovhimages/x.webp`. **Pré-existant** (identique avec l'ancienne constante `SITE_URL`, non introduit par 10.1) et **non déclenchable aujourd'hui** (`content/blog/` vide → 0 article). `content.config.ts` type `image.src` en `z.string()` sans contrainte de format. À corriger à la **factorisation de la construction d'URL SEO de la story 10.5** (helper unique + normalisation slash, ou schéma `image.src` `startsWith("/")`). _(revue 10.1 — Edge Case Hunter)_
docs/implementation-artifacts/deferred-work.md-117-
docs/implementation-artifacts/deferred-work.md-118-## Deferred from: code review of 10-1-decision-hebergement-prod-et-derisquage-deploiement (2026-09-12)
docs/implementation-artifacts/deferred-work.md-119-
docs/implementation-artifacts/deferred-work.md:120:- **`article.image.src` sans slash initial → URL d'image malformée** — Reconfirmé par re-review 10.1 (`app/pages/blog/index.vue:122`, `app/pages/blog/[...slug].vue:121`). Même verdict : pré-existant au baseline, non déclenchable avec `content/blog/` vide, déjà routé vers la normalisation/factorisation SEO de la story 10.5.
docs/implementation-artifacts/deferred-work.md-121-
docs/implementation-artifacts/deferred-work.md-122-## Deferred from: code review of 10-2-a11y-semantique-residuelle (2026-09-13)
docs/implementation-artifacts/deferred-work.md-123-
docs/implementation-artifacts/deferred-work.md-124-- **Rôle dialog et accessibilité interne de la fenêtre terminal** — Les déclencheurs du terminal (`contact.vue`, `index.vue`) portent désormais `aria-haspopup="dialog"`, mais la fenêtre elle-même (`WindowWrapperComponent.vue`) ne porte pas encore de `role="dialog"`, `aria-modal="true"`, ni de piège de focus. Composant hérité Options API propre au header (hors périmètre 10.2). À traiter lors d'une refonte / consolidation a11y du terminal ou en story 10.4. _(revue 10.2 — Blind + Edge Case Hunter)_
docs/implementation-artifacts/deferred-work.md-125-
docs/implementation-artifacts/deferred-work.md-126-## Deferred from: code review of 10-4-validation-a11y-emulee-et-unification-forced-colors (2026-09-13)
docs/implementation-artifacts/deferred-work.md-127-
docs/implementation-artifacts/deferred-work.md-128-- **Terminal input `.user-input` sans outline de focus en contraste forcé** (`TerminalComponent.vue:461`) — CLI terminal avec caret natif coloré (`caret-color`, `caret-shape: block`). En mode contraste forcé, le caret natif sert d'indicateur de focus sans ring de focus extérieur. Préexistant (Epic 8).
docs/implementation-artifacts/deferred-work.md-129-- **`ZInput` utilise `&:focus` plutôt que `:focus-visible`** (`ZInput.vue:173`) — Stylage du focus appliqué au focus natif des formulaires plutôt qu'exclusivement au clavier. Préexistant (Epic 2).
docs/implementation-artifacts/deferred-work.md-130-- **Terminal resize handle manipulable uniquement à la souris** (`TerminalComponent.vue:320`) — `<div>` de redimensionnement de fenêtre avec drag à la souris, sans contrôle clavier équivalent. Préexistant (Epic 8).
docs/implementation-artifacts/deferred-work.md-131-- **Accessibilité interne de la fenêtre terminal (rôle dialog / focus trap)** (`TerminalComponent.vue:1`) — Fenêtre terminal interactive sans `role="dialog"`, nom accessible ou confinement de focus (déjà tracé en revue 10.2). Préexistant (Epic 8).
docs/implementation-artifacts/deferred-work.md-132-- **Honeypot input sous `aria-hidden="true"`** (`contact.vue:178`) — Champ antispam masqué visuellement et aux technologies d'assistance. Préexistant (Epic 7).
--
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1784-    l: "ans dans la tech"
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1785-  }, {
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1786-    n: "3",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1787-    l: "stacks maîtrisés"
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1788-  }, {
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1789-    n: "1",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1790-    l: "SaaS fondé · keova.app"
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1791-  }],
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1792-  services: [{
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1793-    icon: "wp",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1794-    title: "WordPress sur-mesure",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1795-    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js:1796:    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1797-    price: "à partir de 1 500 €",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1798-    featured: false
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1799-  }, {
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1800-    icon: "code",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1801-    title: "Applications web",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1802-    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1803-    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1804-    price: "sur devis",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1805-    featured: true
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1806-  }, {
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1807-    icon: "spark",
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/_ds_bundle.js-1808-    title: "IA & automatisation",
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-39-- [x] Tâche 4 — Vérifier et garantir l'état focus clavier visible (AC: #2)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-40-  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-41-  - [x] Le focus reste visible sur fonds sombres et sur les surfaces atmosphériques (gradient héritage, fond AI-art sous overlay) — contraste suffisant de l'anneau. **Vérifié** au navigateur (ring orange visible sur header vitré + hero dégradé).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-42-  - [x] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6). **Conforme (focus plus fort que demandé)** : `ZInput:focus` pose `border-color: --accent` **+** ring `--accent-ring` (pattern DS README, plus prominent que `--border-strong`) ; `:hover` renforce déjà à `--border-strong`. Non régressé (n'aurait fait qu'affaiblir le focus).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-43-  - [x] L'ordre de tabulation suit l'ordre visuel/logique sur chaque page. **Vérifié** (sweep clavier `/` : logo → nav (5) → Terminal → CTA → contenu).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-44-- [x] Tâche 5 — Vérification manuelle transverse (AC: #1, #2)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-45-  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-46-  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-47-  - [x] `pnpm lint` (eslint + stylelint) + `pnpm typecheck` + `pnpm generate` verts (aucune valeur hardcodée réintroduite). **PASS** (Docker, 11 routes prerendered). _(Le ticket mentionnait `yarn` ; le projet est pnpm via Docker.)_
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-48-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-49-## Review Findings
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-50-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-52-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-53-- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-54-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-55-> **Pistes écartées après recoupement (dismiss)** : (1) « rayon des anneaux incohérent (nav/menu carrés vs brand/footer arrondis) » (Blind Hunter) — **faux positif** : `.hdr__link`/`.hdr__menu-link` portent déjà `border-radius` dans leur règle de base (`HeaderComponent.vue:256/389`), seuls brand/footer (base sans rayon) l'ajoutent → tous les anneaux arrondis. (2) « clipping de l'anneau par un ancêtre `overflow:hidden` » — infirmé : aucun `overflow:hidden` sur les ancêtres du header/nav/footer. (3) « tokens inexistants (`--ring-accent`/`--radius-sm`/`--radius-xs`) » — infirmé : tous définis (`_root.scss`), `--ring-accent` = la valeur box-shadow correcte (le `--accent-ring` couleur n'est pas utilisé en box-shadow). (4) « littéraux `2px` hardcodés » — dérogation a11y légitime (largeur/offset d'outline, pas de token DS dédié), pattern déjà établi (`contact.vue`/`about.vue`/`index.vue`). (5) « `.hdr__brand`/`.ftr__brand` pas focusables » — infirmé : vrais `<a>`/NuxtLink.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-56-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-57-> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-58-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-59-## Dev Notes
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-60-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-61-### Nature de la story (finition transverse)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-62-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-63-- C'est une story de **finition** de l'Epic 9 : elle ne crée pas de nouvelle UI, elle **audite et harmonise** ce qui a été produit en amont — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7) et terminal (Epic 8). Cette dépendance vers tout l'antérieur est normale ; il n'y a **aucune dépendance vers des stories futures**.
--
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-130-- **Index (Tâches 2-4)** : `app/pages/blog/index.vue` refondu (Options API legacy + `MainComponent` + fonds blancs / `width:50vw` → `<script setup lang="ts">`). En-tête eyebrow/titre/sous-titre, liste de `ZCard` interactives (`:as="NuxtLink"`) en `.post` (grille `200px 1fr`), vignette `<NuxtImg>`, tags `ZTag` en `<ul>/<li>` (convention a11y 5.2), titre `h2`, méta mono (date FR · temps de lecture). Tri `queryCollection("blog").order("date","DESC").all()` via `useAsyncData` (prerender-safe).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-131-- **Empty-state (Tâche 3)** : conservé (texte FR + illustration `undraw_code_thinking`), restylé en `ZCard` dark-first centrée via tokens ; branché sur `!articles.length`. État d'erreur distinct conservé (`v-else-if="error"`).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-132-- **Tokens uniquement** ; primitives globales (`.section`/`.container`/`.eyebrow`/`.prose`/`.hero__tags`) consommées, non redéclarées. `.post*` (spécifiques blog) en scoped.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-133-- Date : front-matter ISO (`YYYY-MM-DD`) → `Intl.DateTimeFormat("fr-FR", { timeZone: "UTC" })` (rendu déterministe, pas de décalage de jour à l'hydration).
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-134-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-135-### File List
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-136-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-137-- `content.config.ts` (MODIFIÉ — schéma collection `blog` étendu : `date` (validée ISO `regex`)/`tags`/`read`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-138-- `content/blog/ia-dans-wordpress.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-139-- `content/blog/nuxt-symfony-archi.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-140-- `content/blog/n8n-automatisation.md` (CRÉÉ ; `image.src` → `.webp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-141-- `public/images/hacker-den-1.webp`, `hacker-den-2.webp`, `hacker-den-3.webp` (CRÉÉS — vignettes webp 800×448 ; PNG sources supprimés, recompressés via `sharp`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:142:- `app/pages/blog/index.vue` (REFONTE — Options API legacy → `<script setup>`, cartes `ZCard.post`, empty-state restylé ; correctifs de revue : webp+garde `read`, feed `<ul>/<li>`, SEO OG/canonical/JSON-LD)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-143-- `docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-144-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-145-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-146-## Change Log
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-147-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-148-| Date       | Version | Description                                                                                          |
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-149-| ---------- | ------- | ---------------------------------------------------------------------------------------------------- |
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-150-| 2026-06-23 | 0.1     | Implémentation story 6.1 — pipeline `content/` + 3 articles, refonte de l'index `/blog` (cartes `ZCard`, méta, tri par date) + empty-state restylé. Sanity-check `@nuxt/content` v3 OK. |
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:151:| 2026-06-23 | 0.2     | Correctifs de revue — 5 points résolus (zéro dette) : vignettes webp 800px (~24-34 Ko) + `format="webp"`, garde `v-if` sur `read`, validation ISO de `date` au schéma, feed en `<ul>/<li>`, SEO `/blog` (OG/Twitter/canonical + JSON-LD `BlogPosting`). |
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-152-| 2026-06-23 | 0.3     | Re-revue des correctifs (commit `3a7527b`) : 5 points vérifiés résolus ; build vert (18 routes, IPX webp 1×/2×) ; HTML prérendu (feed `ul`/`li`, srcset webp, OG/canonical, JSON-LD valide) + styles calculés + visuel desktop conformes. Statut → `done`. |
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-153-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-154-## Review Findings
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-155-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-156-_Code review (bmad-code-review) — 2026-06-23. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet) · Acceptance Auditor (diff + SPEC/ticket/`Blog.jsx`/`kit.css`). Verdict : AC #1 (cartes conformes DS) et AC #2 (empty-state) satisfaites, aucune violation dure ; API content v3, tokens, `ZCard`/`ZTag`, prerender tous vérifiés sains._
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-157-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-158-- [x] [Review][Patch] Redimensionner/recompresser les 3 vignettes sources `public/images/hacker-den-*.png` (~4,5 Mo → cible ~2× l'affichage) + `format="webp"` sur la `<NuxtImg>` des cartes — décision Simon : zéro dette (était `decision-needed`). [public/images/hacker-den-*.png ; app/pages/blog/index.vue:27] — ✅ résolu : sources converties en **webp 800×448 (~24-34 Ko**, vs ~1,4 Mo, via `sharp`), PNG supprimés, front-matter `image.src` → `.webp`, `format="webp"` ajouté. HTML prerendu : `f_webp&s_200x130` + 2×.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-159-- [x] [Review][Decision→Accepté] Empty-state réécrit (vs « conserver » du ticket) — décision Simon : **réécriture acceptée** (voix DS cohérente, 1ʳᵉ personne, sans inclusif ni fluff). Aucune action.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-160-- [x] [Review][Patch] Méta : `read` est optionnel au schéma mais rendu sans garde → « · de lecture » orphelin (séparateur + texte vides) si un futur article omet `read`. Ajouter `v-if="article.read"` sur le span ET le séparateur `·`. [app/pages/blog/index.vue:69] — ✅ résolu : `<template v-if="article.read">` enveloppe le séparateur + le texte.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-161-- [x] [Review][Patch] `date` non validée (`z.string()`) → `formatDate` rend « Invalid Date » et le tri `.order("date","DESC")` se trompe si le format dévie. Valider au schéma (`z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`) — échec au build plutôt qu'à l'affichage. [content.config.ts] — ✅ résolu : `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, …)`.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:162:- [x] [Review][Defer→Fixed] SEO `/blog` : pas d'OG/Twitter/canonical ni JSON-LD (`Blog`/`ItemList`) ; seuls `title`+`description` sont posés. — ✅ résolu pour `/blog` (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` (3) ajoutés au `useHead` ; vérifiés dans le HTML prerendu. La **centralisation SEO site-wide** (autres pages, `useSeoMeta` partagé) reste tracée pour Epic 9.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-163-- [x] [Review][Defer→Fixed] Sémantique liste du feed : les articles sont rendus en `<div class="blog__list">` (cartes) alors que les **tags** de chaque carte sont en `<ul>/<li>` — incohérence avec la convention listes a11y de 5.2. Passer le feed en `<ul class="blog__list"><li>`. — ✅ résolu : feed en `<ul class="blog__list">` + `<li>` par article (reset de liste, rendu identique). La **généralisation a11y** (eyebrow→titre + listes home/services) reste Epic 9.
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-164-
docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md-165-_Rejetés (bruit / faux positifs vérifiés)_ : branche erreur « inatteignable » (`useAsyncData` capture l'erreur dans `error`, ne throw pas — Edge) ; pas de loading state (site prérendu statique, contenu figé au build) ; clé `v-for` `article.path` (toujours présent/unique, type `page` — Edge) ; `alt=""` vignettes (décoratif correct, schéma rend `alt` requis — Auditor) ; `hero__tags` réutilisé (primitive globale voulue depuis 5.2) ; `ZTag` imbriqué dans le lien-carte (non interactif → pas de nested-interactive) ; ring de focus carte (fourni par `.zcard--interactive`) ; littéraux `200px`/`130px`/`56ch`/`900px` (structurels, mandatés par `kit.css` — Auditor) ; `h2` vs `h3` du titre (le `h3` du kit/ticket sauterait un niveau ici ; `h2` est le choix a11y correct, port visuel fidèle — Auditor) ; `object-fit:cover` (recadre sans déformer) ; corps markdown riches des articles (seed data pour 6.2, l'index ne rend que le front-matter — Auditor) ; i18n (site mono-français assumé).
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-41-- [x] [Review][Patch] Consigner l'environnement d'émulation (macOS VoiceOver, Chrome Rendering) et le relevé des observations dans le Dev Agent Record [docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:83]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-42-- [x] [Review][Defer] Terminal input .user-input sans outline de focus en contraste forcé [app/components/terminal/TerminalComponent.vue:461] — deferred, pre-existing (Epic 8, terminal CLI avec caret natif coloré)
--- source line numbers ---
     1	import { computed, toValue, type MaybeRefOrGetter } from "vue";
     2	import { useSiteUrl } from "./useSiteUrl";
     3	
     4	export interface PageSeoOptions {
     5	  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
     6	  title: string;
     7	  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
     8	  description: string;
     9	  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
    10	  path?: string;
    11	  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
    12	  image?: string;
    13	  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
    14	  type?: "website" | "article" | "profile";
    15	  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
    16	  twitterCard?: "summary" | "summary_large_image";
    17	  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
    18	  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    19	}
    20	
    21	/**
    22	 * Composable centralisant la déclaration des métadonnées SEO par page :
    23	 * <title>, canonical, description, Open Graph (type, title, desc, url, image)
    24	 * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
    25	 *
    26	 * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
    27	 */
    28	export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
    29	  const siteUrl = useSiteUrl();
    30	
    31	  const seo = computed(() => {
    32	    const opts = toValue(options);
    33	    if (!opts) {
    34	      return null;
    35	    }
    36	
    37	    const rawPath = opts.path ?? "";
    38	    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    39	    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
    40	
    41	    let imageUrl: string | undefined;
    42	    if (opts.image) {
    43	      imageUrl =
    44	        opts.image.startsWith("http://") || opts.image.startsWith("https://")
    45	          ? opts.image
    46	          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
    47	    }
    48	
    49	    const type = opts.type ?? "website";
    50	    const twitterCard =
    51	      opts.twitterCard ??
    52	      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
    53	        ? "summary_large_image"
    54	        : "summary");
    55	
    56	    return {
    57	      title: opts.title,
    58	      description: opts.description,
    59	      canonicalUrl,
    60	      imageUrl,
    61	      type,
    62	      twitterCard,
    63	      jsonLd: opts.jsonLd,
    64	    };
    65	  });
    66	
    67	  useHead(() => {
    68	    if (!seo.value) {
    69	      return {};
    70	    }
    71	
    72	    const scripts: Array<{ type: string; innerHTML: string }> = [];
    73	    if (seo.value.jsonLd) {
    74	      if (Array.isArray(seo.value.jsonLd)) {
    75	        for (const item of seo.value.jsonLd) {
    76	          scripts.push(jsonLdScript(item));
    77	        }
    78	      } else {
    79	        scripts.push(jsonLdScript(seo.value.jsonLd));
    80	      }
    81	    }
    82	
    83	    return {
    84	      title: seo.value.title,
    85	      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
    86	      script: scripts,
    87	    };
    88	  });
    89	
    90	  useSeoMeta({
    91	    title: () => seo.value?.title,
    92	    description: () => seo.value?.description,
    93	    ogTitle: () => seo.value?.title,
    94	    ogDescription: () => seo.value?.description,
    95	    ogUrl: () => seo.value?.canonicalUrl,
    96	    ogType: () => seo.value?.type,
    97	    ogImage: () => seo.value?.imageUrl,
    98	    twitterCard: () => seo.value?.twitterCard,
    99	    twitterTitle: () => seo.value?.title,
   100	    twitterDescription: () => seo.value?.description,
   101	    twitterImage: () => seo.value?.imageUrl,
   102	  });
   103	}
   108	  });
   109	}
   110	
   111	// SEO par article (centralisé via usePageSeo, parité /about, /blog).
   112	// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
   113	const siteUrl = useSiteUrl();
   114	usePageSeo(() => {
   115	  const article = page.value;
   116	  if (!article) {
   117	    return null;
   118	  }
   119	  const url = `${siteUrl}${article.path}`;
   120	  const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
   121	  const jsonLd = {
   122	    "@context": "https://schema.org",
   123	    "@type": "BlogPosting",
   124	    headline: article.title,
   125	    description: article.description,
   126	    datePublished: article.date,
   127	    author: { "@type": "Person", name: "Simon Jouan" },
   128	    url,
   129	    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
   130	    ...(image ? { image } : {}),
   131	  };
   132	
   133	  return {
   134	    title: `${article.title} — jouan.ovh`,
   135	    description: article.description,
   136	    path: article.path,
   137	    image: article.image?.src,
   138	    type: "article",
   139	    jsonLd,
   140	  };
   141	});
   142	</script>
   143	
   144	<style lang="scss" scoped>
   145	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
   125	  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
   126	  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
   127	  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
   128	];
   129	
   130	const siteUrl = useSiteUrl();
   131	
   132	const servicesJsonLd = {
   133	  "@context": "https://schema.org",
   134	  "@type": "WebPage",
   135	  name: "Services — jouan.ovh",
   136	  description:
   137	    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
   138	  url: `${siteUrl}/services`,
   139	  mainEntity: {
   140	    "@type": "ItemList",
   141	    itemListElement: offers.map((offer, index) => ({
   142	      "@type": "Offer",
   143	      position: index + 1,
   144	      name: offer.title,
   145	      description: offer.desc,
   146	      price: offer.price,
   147	    })),
   148	  },
   149	};
   150	
   151	usePageSeo({
   152	  title: "Services — jouan.ovh",
   153	  description:
   154	    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
   155	  path: "/services",
   156	  image: "/images/portrait.jpeg",
   157	  type: "website",
   158	  jsonLd: servicesJsonLd,
   159	});
   160	</script>
   161	
   162	<style lang="scss" scoped>
   163	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Services.jsx */
   164	.services {
   165	  display: block;
   166	}
   167	
   168	// .section / .section--sunken / .container / .eyebrow / .prose : primitives de
   169	// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   170	
   171	// ---- En-tête (porté de Services.jsx L13-21) ----
   172	.services__title {
   173	  max-width: 16ch;
   174	  margin-bottom: var(--space-3);
   175	  font-family: var(--font-mono);
     1	<template>
     2	  <NuxtLayout>
     3	    <NuxtPage />
     4	  </NuxtLayout>
     5	</template>
     6	
     7	<script setup lang="ts">
     8	import { SITE } from "~/data/site";
     9	
    10	// Métadonnées Schema.org globales (Organization / publisher du site).
    11	// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
    12	const siteUrl = useSiteUrl();
    13	
    14	const organizationJsonLd = {
    15	  "@context": "https://schema.org",
    16	  "@type": "Organization",
    17	  name: SITE.profile.name,
    18	  url: siteUrl,
    19	  logo: `${siteUrl}/images/logo.png`,
    20	  email: SITE.profile.email,
    21	  address: {
    22	    "@type": "PostalAddress",
    23	    addressLocality: SITE.profile.city,
    24	  },
    25	};
    26	
    27	useHead({
    28	  script: [jsonLdScript(organizationJsonLd)],
    29	});
    30	</script>
    31	
    32	<style lang="scss" scoped></style>
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
   145	    name: "Simon Jouan",
   146	    jobTitle: "Développeur web freelance",
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

2026-09-13T08:38:20.646353Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '--- content ---'; rg --files content | sort; printf '%s\\n' '--- prerender route config ---'; rg -n -C 5 'routeRules|prerender|routes|crawlLinks|blog' nuxt.config.ts app content.config.ts; printf '%s\\n' '--- generated metadata counts ---'; for f in .output/public/index.html .output/public/services/index.html .output/public/contact/index.html .output/public/about/index.html .output/public/blog/index.html; do printf '%s ' \""'$f"; printf '"'canonical='; rg -o '<link rel=\"canonical\"' \""'$f" | wc -l | tr -d '"' '; printf ' og='; rg -o 'property=\"og:' \""'$f" | wc -l | tr -d '"' '; printf ' twitter='; rg -o 'name=\"twitter:' \""'$f" | wc -l | tr -d '"' '; printf ' ld='; rg -o 'type=\"application/ld\\+json\"' \""'$f" | wc -l | tr -d '"' '; printf '\\n'; done" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- content ---
--- prerender route config ---
content.config.ts-1-import { defineContentConfig, defineCollection, z } from "@nuxt/content";
content.config.ts-2-
content.config.ts-3-// @nuxt/content v3 — déclaration explicite des collections (remplace l'auto-scan v2).
content.config.ts:4:// La collection blog reste vide tant qu'aucun article n'est ajouté sous content/blog/.
content.config.ts-5-export default defineContentConfig({
content.config.ts-6-  collections: {
content.config.ts:7:    blog: defineCollection({
content.config.ts-8-      type: "page",
content.config.ts:9:      source: "blog/**",
content.config.ts-10-      // type "page" fournit déjà title/description/path/body ; on type ici les champs
content.config.ts:11:      // additionnels consommés par la liste du blog (tri par date, tags, temps de lecture).
content.config.ts-12-      schema: z.object({
content.config.ts-13-        // Date ISO (YYYY-MM-DD) : tri lexicographique = tri chronologique, formatée en
content.config.ts-14-        // français à l'affichage. Sert au `.order("date", "DESC")`. Le `regex` fait
content.config.ts-15-        // échouer le build sur un format dévié (plutôt qu'un « Invalid Date » à l'écran
content.config.ts-16-        // et un tri faux).
--
nuxt.config.ts-53-    public: {
nuxt.config.ts-54-      web3formsAccessKey: "",
nuxt.config.ts-55-      // URL de production du site (canonical / og:url / JSON-LD). Défaut = staging
nuxt.config.ts-56-      // (dev.jouan.ovh, cf. public/CNAME) ; surchargeable en prod SANS domaine en dur via
nuxt.config.ts-57-      // l'env NUXT_PUBLIC_SITE_URL=https://jouan.ovh (cf. .env.example). Consommée par le
nuxt.config.ts:58:      // composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
nuxt.config.ts-59-      siteUrl: "https://dev.jouan.ovh",
nuxt.config.ts-60-    },
nuxt.config.ts-61-  },
nuxt.config.ts-62-  // Structure Nuxt 4 par défaut : code applicatif sous app/ (srcDir = "app").
nuxt.config.ts-63-  experimental: {
--
app/pages/about.vue-90-
app/pages/about.vue-91-<script setup lang="ts">
app/pages/about.vue-92-// Page À-propos — hero portrait + bio + stack (story 5.1/5.2) puis section CV
app/pages/about.vue-93-// (timeline d'expériences + formation, story 5.2). Porté de About.jsx du UI kit :
app/pages/about.vue-94-// hero 2 colonnes (0.8fr identité / 1.2fr bio), section CV 2 colonnes (1.4fr / 0.6fr),
app/pages/about.vue:95:// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
app/pages/about.vue-96-import { NuxtLink } from "#components";
app/pages/about.vue-97-import { SITE } from "~/data/site";
app/pages/about.vue-98-
app/pages/about.vue-99-// Identité + stack — source unique `app/data/site.ts`.
app/pages/about.vue-100-const profile = SITE.profile;
--
app/pages/blog/[...slug].vue-1-<template>
app/pages/blog/[...slug].vue:2:  <main class="blog-article">
app/pages/blog/[...slug].vue-3-    <section class="section">
app/pages/blog/[...slug].vue-4-      <div class="container">
app/pages/blog/[...slug].vue-5-        <article v-if="page" class="article">
app/pages/blog/[...slug].vue:6:          <!-- Lien retour (porté de Blog.jsx : hdr__link « ← Retour au blog »).
app/pages/blog/[...slug].vue:7:               Le glyphe ← est décoratif (aria-hidden) : le lecteur d'écran lit « Retour au blog ». -->
app/pages/blog/[...slug].vue:8:          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>
app/pages/blog/[...slug].vue-9-
app/pages/blog/[...slug].vue-10-          <!-- En-tête : tags, titre, méta (auteur · date · lecture), image héro -->
app/pages/blog/[...slug].vue-11-          <ul v-if="page.tags?.length" class="hero__tags article__tags">
app/pages/blog/[...slug].vue-12-            <li v-for="tag in page.tags" :key="tag">
app/pages/blog/[...slug].vue-13-              <ZTag>{{ tag }}</ZTag>
--
app/pages/blog/[...slug].vue-55-    </section>
app/pages/blog/[...slug].vue-56-  </main>
app/pages/blog/[...slug].vue-57-</template>
app/pages/blog/[...slug].vue-58-
app/pages/blog/[...slug].vue-59-<script setup lang="ts">
app/pages/blog/[...slug].vue:60:// Vue article du blog (story 6.2) — porté de Blog.jsx (fonction Article) : structure
app/pages/blog/[...slug].vue-61-// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
app/pages/blog/[...slug].vue-62-// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
app/pages/blog/[...slug].vue-63-// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue-64-import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue-65-
app/pages/blog/[...slug].vue-66-const route = useRoute();
app/pages/blog/[...slug].vue-67-
app/pages/blog/[...slug].vue-68-// Normalise le chemin (retire le(s) slash(es) final/aux) pour éviter un faux 404
app/pages/blog/[...slug].vue:69:// sur une URL du type "/blog/mon-article/".
app/pages/blog/[...slug].vue-70-const path = computed(() => route.path.replace(/\/+$/, "") || "/");
app/pages/blog/[...slug].vue-71-
app/pages/blog/[...slug].vue-72-const { data: page, error } = await useAsyncData(
app/pages/blog/[...slug].vue-73-  // Clé reproductible côté SSR + refetch automatique lors d'une navigation client entre slugs.
app/pages/blog/[...slug].vue:74:  () => `blog-${path.value}`,
app/pages/blog/[...slug].vue:75:  () => queryCollection("blog").path(path.value).first(),
app/pages/blog/[...slug].vue-76-  { watch: [path] },
app/pages/blog/[...slug].vue-77-);
app/pages/blog/[...slug].vue-78-
app/pages/blog/[...slug].vue-79-// Erreur adaptée à l'état courant : 500 si la requête de contenu échoue (on ne masque
app/pages/blog/[...slug].vue-80-// pas une vraie erreur derrière un 404), 404 uniquement quand l'article n'existe pas.
--
app/pages/blog/[...slug].vue-86-    return createError({ statusCode: 404, statusMessage: "Article introuvable" });
app/pages/blog/[...slug].vue-87-  }
app/pages/blog/[...slug].vue-88-  return null;
app/pages/blog/[...slug].vue-89-};
app/pages/blog/[...slug].vue-90-
app/pages/blog/[...slug].vue:91:// Rendu initial (SSR / prerender) : throw pour fixer le bon statut HTTP. Pas besoin de
app/pages/blog/[...slug].vue-92-// `fatal: true` ici, un throw au niveau du setup est déjà traité comme une erreur de page.
app/pages/blog/[...slug].vue-93-const initialError = resolveContentError();
app/pages/blog/[...slug].vue-94-if (initialError) {
app/pages/blog/[...slug].vue-95-  throw initialError;
app/pages/blog/[...slug].vue-96-}
--
app/pages/blog/[...slug].vue-106-      clearError();
app/pages/blog/[...slug].vue-107-    }
app/pages/blog/[...slug].vue-108-  });
app/pages/blog/[...slug].vue-109-}
app/pages/blog/[...slug].vue-110-
app/pages/blog/[...slug].vue:111:// SEO par article (centralisé via usePageSeo, parité /about, /blog).
app/pages/blog/[...slug].vue-112-// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
app/pages/blog/[...slug].vue-113-const siteUrl = useSiteUrl();
app/pages/blog/[...slug].vue-114-usePageSeo(() => {
app/pages/blog/[...slug].vue-115-  const article = page.value;
app/pages/blog/[...slug].vue-116-  if (!article) {
--
app/pages/blog/[...slug].vue-143-
app/pages/blog/[...slug].vue-144-<style lang="scss" scoped>
app/pages/blog/[...slug].vue-145-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
app/pages/blog/[...slug].vue-146-// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
app/pages/blog/[...slug].vue-147-// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/blog/[...slug].vue:148:.blog-article {
app/pages/blog/[...slug].vue-149-  display: block;
app/pages/blog/[...slug].vue-150-}
app/pages/blog/[...slug].vue-151-
app/pages/blog/[...slug].vue-152-// ---- Conteneur article (porté de kit.css : .article) ----
app/pages/blog/[...slug].vue-153-.article {
--
app/pages/blog/index.vue-1-<template>
app/pages/blog/index.vue:2:  <main class="blog">
app/pages/blog/index.vue-3-    <section class="section">
app/pages/blog/index.vue-4-      <div class="container">
app/pages/blog/index.vue-5-        <!-- En-tête (porté de Blog.jsx : eyebrow + titre + sous-titre prose) -->
app/pages/blog/index.vue:6:        <p class="eyebrow">// ~/blog</p>
app/pages/blog/index.vue:7:        <h1 class="blog__title">Notes de dev</h1>
app/pages/blog/index.vue:8:        <p class="prose blog__subtitle">
app/pages/blog/index.vue-9-          WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
app/pages/blog/index.vue-10-        </p>
app/pages/blog/index.vue-11-
app/pages/blog/index.vue-12-        <!-- Liste des articles (triés par date décroissante), cartes interactives -->
app/pages/blog/index.vue:13:        <ul v-if="articles && articles.length" class="blog__list">
app/pages/blog/index.vue:14:          <li v-for="article in articles" :key="article.path" class="blog__item">
app/pages/blog/index.vue-15-            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue-16-              <NuxtImg
app/pages/blog/index.vue-17-                v-if="article.image"
app/pages/blog/index.vue-18-                class="post__thumb"
app/pages/blog/index.vue-19-                :src="article.image.src"
--
app/pages/blog/index.vue-43-            </ZCard>
app/pages/blog/index.vue-44-          </li>
app/pages/blog/index.vue-45-        </ul>
app/pages/blog/index.vue-46-
app/pages/blog/index.vue-47-        <!-- Erreur de chargement (distincte d'un véritable empty-state) -->
app/pages/blog/index.vue:48:        <ZCard v-else-if="error" class="blog__notice" padded>
app/pages/blog/index.vue-49-          <NuxtImg
app/pages/blog/index.vue:50:            class="blog__notice-img"
app/pages/blog/index.vue-51-            src="/images/undraw_code_thinking_re_gka2.svg"
app/pages/blog/index.vue-52-            alt=""
app/pages/blog/index.vue-53-            width="220"
app/pages/blog/index.vue-54-            height="165"
app/pages/blog/index.vue-55-          />
app/pages/blog/index.vue:56:          <h2 class="blog__notice-title">Le chargement des articles a échoué.</h2>
app/pages/blog/index.vue:57:          <p class="prose blog__notice-text">
app/pages/blog/index.vue-58-            Une erreur est survenue lors de la récupération des articles. Ce n'est pas vous, c'est moi : merci de
app/pages/blog/index.vue-59-            réessayer dans quelques instants.
app/pages/blog/index.vue-60-          </p>
app/pages/blog/index.vue-61-        </ZCard>
app/pages/blog/index.vue-62-
app/pages/blog/index.vue-63-        <!-- Empty-state : aucun article publié (texte français conservé, restylé via tokens) -->
app/pages/blog/index.vue:64:        <ZCard v-else class="blog__notice" padded>
app/pages/blog/index.vue-65-          <NuxtImg
app/pages/blog/index.vue:66:            class="blog__notice-img"
app/pages/blog/index.vue-67-            src="/images/undraw_code_thinking_re_gka2.svg"
app/pages/blog/index.vue-68-            alt=""
app/pages/blog/index.vue-69-            width="220"
app/pages/blog/index.vue-70-            height="165"
app/pages/blog/index.vue-71-          />
app/pages/blog/index.vue:72:          <h2 class="blog__notice-title">Pas encore d'articles.</h2>
app/pages/blog/index.vue:73:          <p class="prose blog__notice-text">
app/pages/blog/index.vue-74-            Je travaille actuellement sur de nouveaux contenus pour partager ce que j'apprends en développement web.
app/pages/blog/index.vue-75-            Revenez bientôt pour découvrir mes prochaines publications.
app/pages/blog/index.vue-76-          </p>
app/pages/blog/index.vue-77-        </ZCard>
app/pages/blog/index.vue-78-      </div>
app/pages/blog/index.vue-79-    </section>
app/pages/blog/index.vue-80-  </main>
app/pages/blog/index.vue-81-</template>
app/pages/blog/index.vue-82-
app/pages/blog/index.vue-83-<script setup lang="ts">
app/pages/blog/index.vue:84:// Index du blog (story 6.1) — porté de Blog.jsx : en-tête + liste d'articles en
app/pages/blog/index.vue-85-// cartes ZCard interactives, méta mono, empty-state restylé. Contenu via @nuxt/content
app/pages/blog/index.vue:86:// v3 (queryCollection). Dark-first, tokens uniquement, prerender-safe (requête résolue
app/pages/blog/index.vue:87:// au build par useAsyncData). La vue article (/blog/[...slug]) est la story 6.2.
app/pages/blog/index.vue-88-import { NuxtLink } from "#components";
app/pages/blog/index.vue-89-
app/pages/blog/index.vue-90-// Articles triés par date décroissante. La requête de contenu est résolue côté
app/pages/blog/index.vue:91:// build/SSR → rendu prerender-safe. `error` distingue un échec de chargement d'un
app/pages/blog/index.vue-92-// véritable empty-state (liste vide).
app/pages/blog/index.vue:93:const { data: articles, error } = await useAsyncData("blog-list", () =>
app/pages/blog/index.vue:94:  queryCollection("blog").order("date", "DESC").all(),
app/pages/blog/index.vue-95-);
app/pages/blog/index.vue-96-
app/pages/blog/index.vue-97-// `formatDate` (date ISO → français) est un util auto-importé partagé (app/utils/).
app/pages/blog/index.vue-98-
app/pages/blog/index.vue-99-// Métadonnées de la page. URL de prod lue depuis runtimeConfig via useSiteUrl()
app/pages/blog/index.vue-100-// (swappable staging/prod, sans domaine en dur). Inchangée en staging.
app/pages/blog/index.vue-101-const siteUrl = useSiteUrl();
app/pages/blog/index.vue-102-const pageTitle = "Blog — jouan.ovh";
app/pages/blog/index.vue-103-const pageDescription =
app/pages/blog/index.vue-104-  "Notes de dev — WordPress, architecture et IA appliquée : ce que j'apprends en construisant des produits web.";
app/pages/blog/index.vue:105:const pageUrl = `${siteUrl}/blog`;
app/pages/blog/index.vue-106-
app/pages/blog/index.vue-107-// JSON-LD : flux d'articles (Blog → BlogPosting) pour les moteurs / agrégateurs.
app/pages/blog/index.vue-108-// Construit à partir de la liste résolue (snapshot au build, page prerendue).
app/pages/blog/index.vue:109:const blogJsonLd = {
app/pages/blog/index.vue-110-  "@context": "https://schema.org",
app/pages/blog/index.vue-111-  "@type": "Blog",
app/pages/blog/index.vue-112-  name: "Notes de dev",
app/pages/blog/index.vue-113-  description: pageDescription,
app/pages/blog/index.vue-114-  url: pageUrl,
app/pages/blog/index.vue:115:  blogPost: (articles.value ?? []).map((article) => ({
app/pages/blog/index.vue-116-    "@type": "BlogPosting",
app/pages/blog/index.vue-117-    headline: article.title,
app/pages/blog/index.vue-118-    description: article.description,
app/pages/blog/index.vue-119-    datePublished: article.date,
app/pages/blog/index.vue-120-    url: `${siteUrl}${article.path}`,
--
app/pages/blog/index.vue-124-};
app/pages/blog/index.vue-125-
app/pages/blog/index.vue-126-usePageSeo({
app/pages/blog/index.vue-127-  title: pageTitle,
app/pages/blog/index.vue-128-  description: pageDescription,
app/pages/blog/index.vue:129:  path: "/blog",
app/pages/blog/index.vue-130-  type: "website",
app/pages/blog/index.vue:131:  jsonLd: blogJsonLd,
app/pages/blog/index.vue-132-});
app/pages/blog/index.vue-133-</script>
app/pages/blog/index.vue-134-
app/pages/blog/index.vue-135-<style lang="scss" scoped>
app/pages/blog/index.vue-136-/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
app/pages/blog/index.vue-137-// .section / .container / .eyebrow / .prose / .hero__tags / .post__meta sont des
app/pages/blog/index.vue-138-// primitives de layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
app/pages/blog/index.vue:139:.blog {
app/pages/blog/index.vue-140-  display: block;
app/pages/blog/index.vue-141-}
app/pages/blog/index.vue-142-
app/pages/blog/index.vue-143-// ---- En-tête (porté de Blog.jsx L9-13) ----
app/pages/blog/index.vue:144:.blog__title {
app/pages/blog/index.vue-145-  margin-bottom: var(--space-2);
app/pages/blog/index.vue-146-  font-family: var(--font-mono);
app/pages/blog/index.vue-147-  font-size: var(--fs-4xl);
app/pages/blog/index.vue-148-  font-weight: var(--fw-light);
app/pages/blog/index.vue-149-  line-height: var(--lh-tight);
app/pages/blog/index.vue-150-  color: var(--text-strong);
app/pages/blog/index.vue-151-}
app/pages/blog/index.vue-152-
app/pages/blog/index.vue:153:.blog__subtitle {
app/pages/blog/index.vue-154-  max-width: 56ch;
app/pages/blog/index.vue-155-  margin-bottom: var(--space-10);
app/pages/blog/index.vue-156-  color: var(--text-muted);
app/pages/blog/index.vue-157-}
app/pages/blog/index.vue-158-
app/pages/blog/index.vue-159-// ---- Liste d'articles (porté de Blog.jsx : flex column + .post de kit.css) ----
app/pages/blog/index.vue-160-// <ul> sémantique (annonce « liste de N articles ») : reset des puces et marges UA.
app/pages/blog/index.vue:161:.blog__list {
app/pages/blog/index.vue-162-  display: flex;
app/pages/blog/index.vue-163-  flex-direction: column;
app/pages/blog/index.vue-164-  gap: var(--space-5);
app/pages/blog/index.vue-165-  margin: 0;
app/pages/blog/index.vue-166-  padding: 0;
--
app/pages/blog/index.vue-206-}
app/pages/blog/index.vue-207-
app/pages/blog/index.vue-208-// .post__meta : primitive globale (base/_layout.scss), partagée avec la vue article.
app/pages/blog/index.vue-209-
app/pages/blog/index.vue-210-// ---- Empty-state / erreur (ZCard centrée, illustration + message) ----
app/pages/blog/index.vue:211:.blog__notice {
app/pages/blog/index.vue-212-  max-width: 60ch;
app/pages/blog/index.vue-213-  margin: 0 auto;
app/pages/blog/index.vue-214-  text-align: center;
app/pages/blog/index.vue-215-}
app/pages/blog/index.vue-216-
app/pages/blog/index.vue:217:.blog__notice-img {
app/pages/blog/index.vue-218-  width: 220px;
app/pages/blog/index.vue-219-  height: auto;
app/pages/blog/index.vue-220-  margin: 0 auto var(--space-6);
app/pages/blog/index.vue-221-}
app/pages/blog/index.vue-222-
app/pages/blog/index.vue:223:.blog__notice-title {
app/pages/blog/index.vue-224-  margin-bottom: var(--space-3);
app/pages/blog/index.vue-225-  font-family: var(--font-mono);
app/pages/blog/index.vue-226-  font-size: var(--fs-xl);
app/pages/blog/index.vue-227-  font-weight: var(--fw-regular);
app/pages/blog/index.vue-228-  color: var(--text-strong);
app/pages/blog/index.vue-229-}
app/pages/blog/index.vue-230-
app/pages/blog/index.vue:231:.blog__notice-text {
app/pages/blog/index.vue-232-  color: var(--text-muted);
app/pages/blog/index.vue-233-}
app/pages/blog/index.vue-234-
app/pages/blog/index.vue-235-// ---- Responsive (cf. kit.css @media max-width: 900px : .post → 1 colonne) ----
app/pages/blog/index.vue-236-@media (width <= 900px) {
--
app/pages/contact.vue-140-
app/pages/contact.vue-141-// Infos de contact — source unique `app/data/site.ts`.
app/pages/contact.vue-142-const contact = SITE.profile;
app/pages/contact.vue-143-
app/pages/contact.vue-144-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
app/pages/contact.vue:145:// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
app/pages/contact.vue-146-const { open: openTerminal } = useTerminal();
app/pages/contact.vue-147-
app/pages/contact.vue-148-interface ContactForm {
app/pages/contact.vue-149-  name: string;
app/pages/contact.vue-150-  email: string;
--
app/pages/index.vue-175-  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
app/pages/index.vue-176-  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
app/pages/index.vue-177-];
app/pages/index.vue-178-
app/pages/index.vue-179-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
app/pages/index.vue:180:// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
app/pages/index.vue-181-// restylisation du terminal lui-même relève d'Epic 8.
app/pages/index.vue-182-const { open: openTerminal } = useTerminal();
app/pages/index.vue-183-
app/pages/index.vue-184-const siteUrl = useSiteUrl();
app/pages/index.vue-185-const homeJsonLd = [
--
app/assets/scss/base/_layout.scss-67-  padding: 0;
app/assets/scss/base/_layout.scss-68-  list-style: none;
app/assets/scss/base/_layout.scss-69-}
app/assets/scss/base/_layout.scss-70-
app/assets/scss/base/_layout.scss-71-// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
app/assets/scss/base/_layout.scss:72:// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
app/assets/scss/base/_layout.scss-73-.post__meta {
app/assets/scss/base/_layout.scss-74-  display: flex;
app/assets/scss/base/_layout.scss-75-  gap: var(--space-3);
app/assets/scss/base/_layout.scss-76-  align-items: center;
app/assets/scss/base/_layout.scss-77-  font-family: var(--font-mono);
--
app/utils/formatDate.ts-1-// Formate une date ISO (YYYY-MM-DD) en français long, ex. "12 juin 2026".
app/utils/formatDate.ts-2-// timeZone UTC : rendu déterministe (indépendant du fuseau de build), pas de décalage
app/utils/formatDate.ts:3:// d'un jour à l'hydration. Auto-importé (app/utils/) — partagé par l'index blog et la
app/utils/formatDate.ts-4-// vue article. Le format ISO est garanti par le schéma de la collection (content.config.ts).
app/utils/formatDate.ts-5-const frLongDate = new Intl.DateTimeFormat("fr-FR", {
app/utils/formatDate.ts-6-  day: "numeric",
app/utils/formatDate.ts-7-  month: "long",
app/utils/formatDate.ts-8-  year: "numeric",
--
app/composables/usePageSeo.ts-4-export interface PageSeoOptions {
app/composables/usePageSeo.ts-5-  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
app/composables/usePageSeo.ts-6-  title: string;
app/composables/usePageSeo.ts-7-  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
app/composables/usePageSeo.ts-8-  description: string;
app/composables/usePageSeo.ts:9:  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
app/composables/usePageSeo.ts-10-  path?: string;
app/composables/usePageSeo.ts-11-  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
app/composables/usePageSeo.ts-12-  image?: string;
app/composables/usePageSeo.ts-13-  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
app/composables/usePageSeo.ts-14-  type?: "website" | "article" | "profile";
--
app/composables/useSiteUrl.ts-7-export function useSiteUrl(): string {
app/composables/useSiteUrl.ts-8-  const siteUrl = useRuntimeConfig().public.siteUrl;
app/composables/useSiteUrl.ts-9-  // Garde-fou fail-fast (décision D1, revue 2026-07-02) : une valeur vide ou non absolue
app/composables/useSiteUrl.ts-10-  // émettrait des canonical/og:url/JSON-LD RELATIFS silencieusement cassés (ex. une ligne
app/composables/useSiteUrl.ts-11-  // `NUXT_PUBLIC_SITE_URL=` vide décommentée dans .env → siteUrl=""). On fait plutôt
app/composables/useSiteUrl.ts:12:  // échouer le prerender (`generate`) tôt et bruyamment plutôt que de livrer du SEO cassé.
app/composables/useSiteUrl.ts-13-  let url: URL;
app/composables/useSiteUrl.ts-14-  try {
app/composables/useSiteUrl.ts-15-    url = new URL(siteUrl);
app/composables/useSiteUrl.ts-16-  } catch {
app/composables/useSiteUrl.ts-17-    throw new Error(
--
app/composables/useTerminal.ts-7-// minimal expose cette ouverture aux autres parties du site (ex. le hero d'accueil
app/composables/useTerminal.ts-8-// story 3.1) sans dupliquer le gestionnaire ni dépendre d'Epic 8.
app/composables/useTerminal.ts-9-//
app/composables/useTerminal.ts-10-// Le header enregistre son lanceur au montage (`register`), les appelants
app/composables/useTerminal.ts-11-// déclenchent l'ouverture (`open`). Tant qu'aucun lanceur n'est enregistré (ex.
app/composables/useTerminal.ts:12:// au prerender `nuxi generate`, avant hydratation), `open()` est un no-op sûr.
app/composables/useTerminal.ts-13-// La restylisation complète du terminal reste du périmètre d'Epic 8.
app/composables/useTerminal.ts-14-
app/composables/useTerminal.ts-15-type TerminalLauncher = () => void;
app/composables/useTerminal.ts-16-
app/composables/useTerminal.ts-17-const launcher = ref<TerminalLauncher | null>(null);
--
app/components/HeaderComponent.vue-85-
app/components/HeaderComponent.vue-86-const navItems = [
app/components/HeaderComponent.vue-87-  { to: "/", label: "Accueil" },
app/components/HeaderComponent.vue-88-  { to: "/services", label: "Services" },
app/components/HeaderComponent.vue-89-  { to: "/about", label: "À propos" },
app/components/HeaderComponent.vue:90:  { to: "/blog", label: "Blog" },
app/components/HeaderComponent.vue-91-  { to: "/contact", label: "Contact" },
app/components/HeaderComponent.vue-92-];
app/components/HeaderComponent.vue-93-
app/components/HeaderComponent.vue:94:// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
app/components/HeaderComponent.vue-95-function isActive(to: string): boolean {
app/components/HeaderComponent.vue-96-  if (to === "/") {
app/components/HeaderComponent.vue-97-    return route.path === "/";
app/components/HeaderComponent.vue-98-  }
app/components/HeaderComponent.vue-99-  return route.path === to || route.path.startsWith(`${to}/`);
--
app/components/FooterComponent.vue-47-
app/components/FooterComponent.vue-48-const navItems = [
app/components/FooterComponent.vue-49-  { to: "/", label: "Accueil" },
app/components/FooterComponent.vue-50-  { to: "/services", label: "Services" },
app/components/FooterComponent.vue-51-  { to: "/about", label: "À propos" },
app/components/FooterComponent.vue:52:  { to: "/blog", label: "Blog" },
app/components/FooterComponent.vue-53-  { to: "/contact", label: "Contact" },
app/components/FooterComponent.vue-54-];
app/components/FooterComponent.vue-55-
app/components/FooterComponent.vue-56-// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
app/components/FooterComponent.vue-57-const projects = SITE.projects;
--
app/components/ui/ZBadge.vue-5-  </span>
app/components/ui/ZBadge.vue-6-</template>
app/components/ui/ZBadge.vue-7-
app/components/ui/ZBadge.vue-8-<script setup lang="ts">
app/components/ui/ZBadge.vue-9-// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
app/components/ui/ZBadge.vue:10:// Porté de docs/design_system/components/core/Badge.jsx (CSS en <style scoped>, prerender-safe).
app/components/ui/ZBadge.vue-11-
app/components/ui/ZBadge.vue-12-interface Props {
app/components/ui/ZBadge.vue-13-  /** Teinte. @default "neutral" */
app/components/ui/ZBadge.vue-14-  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
app/components/ui/ZBadge.vue-15-  /** Point de statut en tête. @default false */
--
app/components/ui/ZIcon.vue-16-  <!-- eslint-enable vue/no-v-html -->
app/components/ui/ZIcon.vue-17-</template>
app/components/ui/ZIcon.vue-18-
app/components/ui/ZIcon.vue-19-<script setup lang="ts">
app/components/ui/ZIcon.vue-20-// Système d'icônes du DS — SVG inline, `currentColor` (héritent de la couleur du texte),
app/components/ui/ZIcon.vue:21:// taille en `em`. Choix prerender-safe : set inline (pas de script Lucide CDN qui muterait
app/components/ui/ZIcon.vue-22-// le DOM client et laisserait un trou au `nuxi generate`). Aucune police d'icône (AC #2).
app/components/ui/ZIcon.vue-23-// Icônes au trait = style Lucide ; glyphes de marque (github/twitter/linkedin/wp) + logo
app/components/ui/ZIcon.vue-24-// diamant (gem) = fill. Porté de docs/design_system/ui_kits/jouan-site/icons.jsx.
app/components/ui/ZIcon.vue-25-// Le `v-html` du template injecte uniquement ces chaînes internes statiques.
app/components/ui/ZIcon.vue-26-import { computed } from "vue";
--
app/components/ui/ZAvatar.vue-6-</template>
app/components/ui/ZAvatar.vue-7-
app/components/ui/ZAvatar.vue-8-<script setup lang="ts">
app/components/ui/ZAvatar.vue-9-// Primitive avatar du DS — image ou initiales, anneau accent optionnel.
app/components/ui/ZAvatar.vue-10-// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>
app/components/ui/ZAvatar.vue:11:// (jamais <img> brut — règle images projet). CSS en <style scoped>, prerender-safe.
app/components/ui/ZAvatar.vue-12-import { computed, ref, watch } from "vue";
app/components/ui/ZAvatar.vue-13-
app/components/ui/ZAvatar.vue-14-const avatarSizes = ["sm", "md", "lg", "xl"] as const;
app/components/ui/ZAvatar.vue-15-
app/components/ui/ZAvatar.vue-16-type AvatarSize = (typeof avatarSizes)[number];
--
app/components/ui/ZInput.vue-38-  </div>
app/components/ui/ZInput.vue-39-</template>
app/components/ui/ZInput.vue-40-
app/components/ui/ZInput.vue-41-<script setup lang="ts">
app/components/ui/ZInput.vue-42-// Primitive champ du DS — label mono uppercase, valeur sans-serif, focus ring orange.
app/components/ui/ZInput.vue:43:// Porté de docs/design_system/components/core/Input.jsx (CSS en <style scoped>, prerender-safe).
app/components/ui/ZInput.vue-44-// API React (attrs natifs forwarded) → Vue : v-model (modelValue/update:modelValue) + $attrs sur le contrôle.
app/components/ui/ZInput.vue-45-import type { Component } from "vue";
app/components/ui/ZInput.vue-46-import { computed, useAttrs, useId } from "vue";
app/components/ui/ZInput.vue-47-
app/components/ui/ZInput.vue-48-defineOptions({
--
app/components/ui/ZTag.vue-16-  </span>
app/components/ui/ZTag.vue-17-</template>
app/components/ui/ZTag.vue-18-
app/components/ui/ZTag.vue-19-<script setup lang="ts">
app/components/ui/ZTag.vue-20-// Primitive tag du DS — chip pill mono avec préfixe "#" orange (techno / sujets).
app/components/ui/ZTag.vue:21:// Porté de docs/design_system/components/core/Tag.jsx (CSS en <style scoped>, prerender-safe).
app/components/ui/ZTag.vue-22-// API React → Vue : `onRemove`/`onClick` (callbacks React) deviennent des listeners
app/components/ui/ZTag.vue-23-// détectés via les attrs (le `×` et l'état cliquable n'apparaissent que si fournis).
app/components/ui/ZTag.vue-24-import { computed, getCurrentInstance, useAttrs } from "vue";
app/components/ui/ZTag.vue-25-
app/components/ui/ZTag.vue-26-defineOptions({
--- generated metadata counts ---
.output/public/index.html canonical=1
 og=5
 twitter=4
 ld=3

.output/public/services/index.html canonical=1
 og=5
 twitter=4
 ld=2

.output/public/contact/index.html canonical=1
 og=5
 twitter=4
 ld=2

.output/public/about/index.html canonical=1
 og=5
 twitter=4
 ld=2

.output/public/blog/index.html canonical=1
 og=4
 twitter=3
 ld=2


2026-09-13T08:38:28.721128Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/pages/services.vue | sed -n '82,160p'; printf '%s\\n' '--- current generated JSON-LD parse check ---'; node <<'NODE'
const fs=require('fs');
for (const f of ['.output/public/index.html','.output/public/services/index.html','.output/public/contact/index.html','.output/public/about/index.html','.output/public/blog/index.html']) {
 const html=fs.readFileSync(f,'utf8'); const scripts=[...html.matchAll(/<script type=\"application\\/ld\\+json\">(["'^<]*)<'"\\/script>/g)].map(m=>JSON.parse(m[1])); console.log(f, scripts.map(x=>x['@type']));
}
NODE
printf '%s\\n' '--- exact baseline article SEO ---'; git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:'app/pages/blog/[...slug].vue' | nl -ba | sed -n '108,150p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    82	  points: string[];
    83	  price: string;
    84	  /** Offre mise en avant : carte accent + glow + badge. */
    85	  featured: boolean;
    86	}
    87	
    88	// Contenu repris à l'identique de data.js (window.SITE.services) — 1re personne,
    89	// vouvoiement, pas d'emoji. « Applications web » est l'offre mise en avant.
    90	const offers: Offer[] = [
    91	  {
    92	    id: "wordpress",
    93	    icon: "wp",
    94	    title: "WordPress sur-mesure",
    95	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    96	    points: ["Thème sur-mesure (press-wind / Tailwind)", "Plugins & blocs Gutenberg", "Performance & SEO technique"],
    97	    price: "à partir de 1 500 €",
    98	    featured: false,
    99	  },
   100	  {
   101	    id: "apps",
   102	    icon: "code",
   103	    title: "Applications web",
   104	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   105	    points: ["API REST / GraphQL (Symfony · Nest.js)", "Front Vue / Nuxt", "Tests & CI/CD, qualité QA"],
   106	    price: "sur devis",
   107	    featured: true,
   108	  },
   109	  {
   110	    id: "ia",
   111	    icon: "spark",
   112	    title: "IA & automatisation",
   113	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   114	    points: ["Agents & workflows (n8n)", "Intégration d'API LLM", "Automatisation de contenu"],
   115	    price: "sur devis",
   116	    featured: false,
   117	  },
   118	];
   119	
   120	// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
   121	// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
   122	// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
   123	const steps = [
   124	  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
   125	  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
   126	  { n: "03", title: "Développement", desc: "Code propre, testé, livré par itérations visibles." },
   127	  { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
   128	];
   129	
   130	const siteUrl = useSiteUrl();
   131	
   132	const servicesJsonLd = {
   133	  "@context": "https://schema.org",
   134	  "@type": "WebPage",
   135	  name: "Services — jouan.ovh",
   136	  description:
   137	    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
   138	  url: `${siteUrl}/services`,
   139	  mainEntity: {
   140	    "@type": "ItemList",
   141	    itemListElement: offers.map((offer, index) => ({
   142	      "@type": "Offer",
   143	      position: index + 1,
   144	      name: offer.title,
   145	      description: offer.desc,
   146	      price: offer.price,
   147	    })),
   148	  },
   149	};
   150	
   151	usePageSeo({
   152	  title: "Services — jouan.ovh",
   153	  description:
   154	    "Mes prestations de développeur web freelance : WordPress sur-mesure, applications web (Symfony, Nest.js, Nuxt), IA & automatisation.",
   155	  path: "/services",
   156	  image: "/images/portrait.jpeg",
   157	  type: "website",
   158	  jsonLd: servicesJsonLd,
   159	});
   160	</script>
--- current generated JSON-LD parse check ---
.output/public/index.html [ 'Organization', 'WebSite', 'Person' ]
.output/public/services/index.html [ 'Organization', 'WebPage' ]
.output/public/contact/index.html [ 'Organization', 'ContactPage' ]
.output/public/about/index.html [ 'Organization', 'ProfilePage' ]
.output/public/blog/index.html [ 'Organization', 'Blog' ]
--- exact baseline article SEO ---
   108	  });
   109	}
   110	
   111	// SEO par article (parité avec /about et /blog). `SITE_URL` = util partagé (app/utils/seo).
   112	useHead(() => {
   113	  const article = page.value;
   114	  if (!article) {
   115	    return {};
   116	  }
   117	  const url = `${SITE_URL}${article.path}`;
   118	  const image = article.image ? `${SITE_URL}${article.image.src}` : undefined;
   119	  const jsonLd = {
   120	    "@context": "https://schema.org",
   121	    "@type": "BlogPosting",
   122	    headline: article.title,
   123	    description: article.description,
   124	    datePublished: article.date,
   125	    author: { "@type": "Person", name: "Simon Jouan" },
   126	    url,
   127	    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
   128	    ...(image ? { image } : {}),
   129	  };
   130	  return {
   131	    title: `${article.title} — jouan.ovh`,
   132	    link: [{ rel: "canonical", href: url }],
   133	    meta: [
   134	      { name: "description", content: article.description },
   135	      { property: "og:type", content: "article" },
   136	      { property: "og:title", content: article.title },
   137	      { property: "og:description", content: article.description },
   138	      { property: "og:url", content: url },
   139	      ...(image ? [{ property: "og:image", content: image }] : []),
   140	      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
   141	      { name: "twitter:title", content: article.title },
   142	      { name: "twitter:description", content: article.description },
   143	      ...(image ? [{ name: "twitter:image", content: image }] : []),
   144	    ],
   145	    script: [jsonLdScript(jsonLd)],
   146	  };
   147	});
   148	</script>
   149	
   150	<style lang="scss" scoped>

2026-09-13T08:38:44.585585Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "printf '%s\\n' '--- baseline/current content tree ---'; git ls-tree -r --name-only 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2 | rg '"'^(content|content.config)|hacker-den'"' || true; git ls-files content | sort; printf '%s\\n' '--- full diff stat/check ---'; git diff --no-index -- /dev/null docs/implementation-artifacts/code-reviews/10-5/full.diff >/dev/null; git diff --check 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2 -- app/app.vue app/composables/usePageSeo.ts app/pages/index.vue app/pages/services.vue app/pages/contact.vue app/pages/about.vue app/pages/blog/index.vue 'app/pages/blog/[...slug].vue' || true" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- baseline/current content tree ---
content.config.ts
content/blog/.gitkeep
docs/design_system/assets/backgrounds/hacker-den-1.png
docs/design_system/assets/backgrounds/hacker-den-2.png
docs/design_system/assets/backgrounds/hacker-den-3.png
content/blog/.gitkeep
--- full diff stat/check ---

2026-09-13T08:38:52.354593Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/10-5/full.diff | sed -n '1,190p'; nl -ba docs/implementation-artifacts/code-reviews/10-5/full.diff | sed -n '190,390p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/app.vue b/app/app.vue
     2	index 84b23a4..6016dd4 100644
     3	--- a/app/app.vue
     4	+++ b/app/app.vue
     5	@@ -4,4 +4,29 @@
     6	   </NuxtLayout>
     7	 </template>
     8	 
     9	+<script setup lang="ts">
    10	+import { SITE } from "~/data/site";
    11	+
    12	+// Métadonnées Schema.org globales (Organization / publisher du site).
    13	+// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
    14	+const siteUrl = useSiteUrl();
    15	+
    16	+const organizationJsonLd = {
    17	+  "@context": "https://schema.org",
    18	+  "@type": "Organization",
    19	+  name: SITE.profile.name,
    20	+  url: siteUrl,
    21	+  logo: `${siteUrl}/images/logo.png`,
    22	+  email: SITE.profile.email,
    23	+  address: {
    24	+    "@type": "PostalAddress",
    25	+    addressLocality: SITE.profile.city,
    26	+  },
    27	+};
    28	+
    29	+useHead({
    30	+  script: [jsonLdScript(organizationJsonLd)],
    31	+});
    32	+</script>
    33	+
    34	 <style lang="scss" scoped></style>
    35	diff --git a/app/composables/usePageSeo.ts b/app/composables/usePageSeo.ts
    36	new file mode 100644
    37	index 0000000..6a238eb
    38	--- /dev/null
    39	+++ b/app/composables/usePageSeo.ts
    40	@@ -0,0 +1,103 @@
    41	+import { computed, toValue, type MaybeRefOrGetter } from "vue";
    42	+import { useSiteUrl } from "./useSiteUrl";
    43	+
    44	+export interface PageSeoOptions {
    45	+  /** Titre de la page (utilisé pour <title>, og:title, twitter:title). */
    46	+  title: string;
    47	+  /** Description de la page (utilisée pour <meta name="description">, og:description, twitter:description). */
    48	+  description: string;
    49	+  /** Chemin relatif de la page (ex. "/" ou "/services" ou "/blog/slug"). Si omis, résolu sur siteUrl. */
    50	+  path?: string;
    51	+  /** Chemin relatif ou absolu de l'image OG/Twitter (ex. "/images/portrait.jpeg"). Résolue en URL absolue. */
    52	+  image?: string;
    53	+  /** Type Open Graph : "website" (défaut), "article" ou "profile". */
    54	+  type?: "website" | "article" | "profile";
    55	+  /** Format Twitter Card : si omis, "summary_large_image" si type article avec image, sinon "summary". */
    56	+  twitterCard?: "summary" | "summary_large_image";
    57	+  /** Données JSON-LD (objet Schema.org ou tableau d'objets) injectées via jsonLdScript. */
    58	+  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    59	+}
    60	+
    61	+/**
    62	+ * Composable centralisant la déclaration des métadonnées SEO par page :
    63	+ * <title>, canonical, description, Open Graph (type, title, desc, url, image)
    64	+ * et Twitter Card (card, title, desc, image) + JSON-LD échappé.
    65	+ *
    66	+ * Résout automatiquement les URLs absolues à partir de `useSiteUrl()` (runtimeConfig).
    67	+ */
    68	+export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | undefined | null>): void {
    69	+  const siteUrl = useSiteUrl();
    70	+
    71	+  const seo = computed(() => {
    72	+    const opts = toValue(options);
    73	+    if (!opts) {
    74	+      return null;
    75	+    }
    76	+
    77	+    const rawPath = opts.path ?? "";
    78	+    const cleanPath = rawPath === "" || rawPath === "/" ? "" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    79	+    const canonicalUrl = cleanPath ? `${siteUrl}${cleanPath}` : siteUrl;
    80	+
    81	+    let imageUrl: string | undefined;
    82	+    if (opts.image) {
    83	+      imageUrl =
    84	+        opts.image.startsWith("http://") || opts.image.startsWith("https://")
    85	+          ? opts.image
    86	+          : `${siteUrl}${opts.image.startsWith("/") ? opts.image : `/${opts.image}`}`;
    87	+    }
    88	+
    89	+    const type = opts.type ?? "website";
    90	+    const twitterCard =
    91	+      opts.twitterCard ??
    92	+      (imageUrl && (type === "article" || opts.twitterCard === "summary_large_image")
    93	+        ? "summary_large_image"
    94	+        : "summary");
    95	+
    96	+    return {
    97	+      title: opts.title,
    98	+      description: opts.description,
    99	+      canonicalUrl,
   100	+      imageUrl,
   101	+      type,
   102	+      twitterCard,
   103	+      jsonLd: opts.jsonLd,
   104	+    };
   105	+  });
   106	+
   107	+  useHead(() => {
   108	+    if (!seo.value) {
   109	+      return {};
   110	+    }
   111	+
   112	+    const scripts: Array<{ type: string; innerHTML: string }> = [];
   113	+    if (seo.value.jsonLd) {
   114	+      if (Array.isArray(seo.value.jsonLd)) {
   115	+        for (const item of seo.value.jsonLd) {
   116	+          scripts.push(jsonLdScript(item));
   117	+        }
   118	+      } else {
   119	+        scripts.push(jsonLdScript(seo.value.jsonLd));
   120	+      }
   121	+    }
   122	+
   123	+    return {
   124	+      title: seo.value.title,
   125	+      link: [{ rel: "canonical", href: seo.value.canonicalUrl }],
   126	+      script: scripts,
   127	+    };
   128	+  });
   129	+
   130	+  useSeoMeta({
   131	+    title: () => seo.value?.title,
   132	+    description: () => seo.value?.description,
   133	+    ogTitle: () => seo.value?.title,
   134	+    ogDescription: () => seo.value?.description,
   135	+    ogUrl: () => seo.value?.canonicalUrl,
   136	+    ogType: () => seo.value?.type,
   137	+    ogImage: () => seo.value?.imageUrl,
   138	+    twitterCard: () => seo.value?.twitterCard,
   139	+    twitterTitle: () => seo.value?.title,
   140	+    twitterDescription: () => seo.value?.description,
   141	+    twitterImage: () => seo.value?.imageUrl,
   142	+  });
   143	+}
   144	diff --git a/app/pages/about.vue b/app/pages/about.vue
   145	index 997bc7f..3266cce 100644
   146	--- a/app/pages/about.vue
   147	+++ b/app/pages/about.vue
   148	@@ -133,29 +133,30 @@ const degrees = [
   149	 const pageTitle = "À propos — jouan.ovh";
   150	 const pageDescription =
   151	   "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
   152	-// URL de prod lue depuis runtimeConfig via useSiteUrl() (swappable staging/prod, sans
   153	-// domaine en dur). Inchangée en staging → canonical/og restent sur le domaine staging.
   154	+
   155	 const siteUrl = useSiteUrl();
   156	-const pageUrl = `${siteUrl}/about`;
   157	-const pageImage = `${siteUrl}/images/portrait.jpeg`;
   158	+const aboutJsonLd = {
   159	+  "@context": "https://schema.org",
   160	+  "@type": "ProfilePage",
   161	+  name: pageTitle,
   162	+  url: `${siteUrl}/about`,
   163	+  mainEntity: {
   164	+    "@type": "Person",
   165	+    name: "Simon Jouan",
   166	+    jobTitle: "Développeur web freelance",
   167	+    url: siteUrl,
   168	+    image: `${siteUrl}/images/portrait.jpeg`,
   169	+  },
   170	+};
   171	 
   172	-useHead({
   173	+usePageSeo({
   174	   title: pageTitle,
   175	-  link: [{ rel: "canonical", href: pageUrl }],
   176	-  meta: [
   177	-    { name: "description", content: pageDescription },
   178	-    // Open Graph (partage Facebook/LinkedIn…).
   179	-    { property: "og:type", content: "profile" },
   180	-    { property: "og:title", content: pageTitle },
   181	-    { property: "og:description", content: pageDescription },
   182	-    { property: "og:url", content: pageUrl },
   183	-    { property: "og:image", content: pageImage },
   184	-    // Twitter Card.
   185	-    { name: "twitter:card", content: "summary" },
   186	-    { name: "twitter:title", content: pageTitle },
   187	-    { name: "twitter:description", content: pageDescription },
   188	-    { name: "twitter:image", content: pageImage },
   189	-  ],
   190	+  description: pageDescription,
   190	+  description: pageDescription,
   191	+  path: "/about",
   192	+  image: "/images/portrait.jpeg",
   193	+  type: "profile",
   194	+  twitterCard: "summary",
   195	+  jsonLd: aboutJsonLd,
   196	 });
   197	 </script>
   198	 
   199	diff --git a/app/pages/blog/[...slug].vue b/app/pages/blog/[...slug].vue
   200	index 155153b..0cda25f 100644
   201	--- a/app/pages/blog/[...slug].vue
   202	+++ b/app/pages/blog/[...slug].vue
   203	@@ -108,14 +108,13 @@ if (import.meta.client) {
   204	   });
   205	 }
   206	 
   207	-// SEO par article (parité avec /about et /blog). URL de prod via useSiteUrl()
   208	-// (runtimeConfig, swappable staging/prod) ; capturée dans le setup, hors du getter useHead
   209	-// (un composable ne s'appelle pas dans un callback).
   210	+// SEO par article (centralisé via usePageSeo, parité /about, /blog).
   211	+// usePageSeo résout siteUrl, canonical, og:*, twitter:* et le JSON-LD échappé.
   212	 const siteUrl = useSiteUrl();
   213	-useHead(() => {
   214	+usePageSeo(() => {
   215	   const article = page.value;
   216	   if (!article) {
   217	-    return {};
   218	+    return null;
   219	   }
   220	   const url = `${siteUrl}${article.path}`;
   221	   const image = article.image ? `${siteUrl}${article.image.src}` : undefined;
   222	@@ -130,22 +129,14 @@ useHead(() => {
   223	     ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
   224	     ...(image ? { image } : {}),
   225	   };
   226	+
   227	   return {
   228	     title: `${article.title} — jouan.ovh`,
   229	-    link: [{ rel: "canonical", href: url }],
   230	-    meta: [
   231	-      { name: "description", content: article.description },
   232	-      { property: "og:type", content: "article" },
   233	-      { property: "og:title", content: article.title },
   234	-      { property: "og:description", content: article.description },
   235	-      { property: "og:url", content: url },
   236	-      ...(image ? [{ property: "og:image", content: image }] : []),
   237	-      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
   238	-      { name: "twitter:title", content: article.title },
   239	-      { name: "twitter:description", content: article.description },
   240	-      ...(image ? [{ name: "twitter:image", content: image }] : []),
   241	-    ],
   242	-    script: [jsonLdScript(jsonLd)],
   243	+    description: article.description,
   244	+    path: article.path,
   245	+    image: article.image?.src,
   246	+    type: "article",
   247	+    jsonLd,
   248	   };
   249	 });
   250	 </script>
   251	diff --git a/app/pages/blog/index.vue b/app/pages/blog/index.vue
   252	index a4fcc16..73aca76 100644
   253	--- a/app/pages/blog/index.vue
   254	+++ b/app/pages/blog/index.vue
   255	@@ -123,22 +123,12 @@ const blogJsonLd = {
   256	   })),
   257	 };
   258	 
   259	-useHead({
   260	+usePageSeo({
   261	   title: pageTitle,
   262	-  link: [{ rel: "canonical", href: pageUrl }],
   263	-  meta: [
   264	-    { name: "description", content: pageDescription },
   265	-    // Open Graph (partage Facebook/LinkedIn…).
   266	-    { property: "og:type", content: "website" },
   267	-    { property: "og:title", content: pageTitle },
   268	-    { property: "og:description", content: pageDescription },
   269	-    { property: "og:url", content: pageUrl },
   270	-    // Twitter Card.
   271	-    { name: "twitter:card", content: "summary" },
   272	-    { name: "twitter:title", content: pageTitle },
   273	-    { name: "twitter:description", content: pageDescription },
   274	-  ],
   275	-  script: [jsonLdScript(blogJsonLd)],
   276	+  description: pageDescription,
   277	+  path: "/blog",
   278	+  type: "website",
   279	+  jsonLd: blogJsonLd,
   280	 });
   281	 </script>
   282	 
   283	diff --git a/app/pages/contact.vue b/app/pages/contact.vue
   284	index 0680a12..ce95b45 100644
   285	--- a/app/pages/contact.vue
   286	+++ b/app/pages/contact.vue
   287	@@ -250,15 +250,34 @@ async function onSubmit(): Promise<void> {
   288	   }
   289	 }
   290	 
   291	-useHead({
   292	-  title: "Contact — jouan.ovh",
   293	-  meta: [
   294	-    {
   295	-      name: "description",
   296	-      content:
   297	-        "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
   298	+const siteUrl = useSiteUrl();
   299	+
   300	+const contactJsonLd = {
   301	+  "@context": "https://schema.org",
   302	+  "@type": "ContactPage",
   303	+  name: "Contact — jouan.ovh",
   304	+  description:
   305	+    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
   306	+  url: `${siteUrl}/contact`,
   307	+  mainEntity: {
   308	+    "@type": "Person",
   309	+    name: SITE.profile.name,
   310	+    email: SITE.profile.email,
   311	+    address: {
   312	+      "@type": "PostalAddress",
   313	+      addressLocality: SITE.profile.city,
   314	     },
   315	-  ],
   316	+  },
   317	+};
   318	+
   319	+usePageSeo({
   320	+  title: "Contact — jouan.ovh",
   321	+  description:
   322	+    "Parlons de votre projet — décrivez-moi votre besoin (site WordPress, application web, IA). Je réponds sous 48h.",
   323	+  path: "/contact",
   324	+  image: "/images/portrait.jpeg",
   325	+  type: "website",
   326	+  jsonLd: contactJsonLd,
   327	 });
   328	 </script>
   329	 
   330	diff --git a/app/pages/index.vue b/app/pages/index.vue
   331	index f6139f4..6d5bc04 100644
   332	--- a/app/pages/index.vue
   333	+++ b/app/pages/index.vue
   334	@@ -180,6 +180,40 @@ const terminalRows = [
   335	 // header). No-op tant qu'aucun terminal n'est disponible (prerender). La
   336	 // restylisation du terminal lui-même relève d'Epic 8.
   337	 const { open: openTerminal } = useTerminal();
   338	+
   339	+const siteUrl = useSiteUrl();
   340	+const homeJsonLd = [
   341	+  {
   342	+    "@context": "https://schema.org",
   343	+    "@type": "WebSite",
   344	+    name: "Simon Jouan — Développeur web freelance",
   345	+    url: siteUrl,
   346	+    description: tagline,
   347	+  },
   348	+  {
   349	+    "@context": "https://schema.org",
   350	+    "@type": "Person",
   351	+    name: SITE.profile.name,
   352	+    jobTitle: SITE.profile.role,
   353	+    url: siteUrl,
   354	+    image: `${siteUrl}/images/portrait.jpeg`,
   355	+    email: SITE.profile.email,
   356	+    address: {
   357	+      "@type": "PostalAddress",
   358	+      addressLocality: SITE.profile.city,
   359	+    },
   360	+  },
   361	+];
   362	+
   363	+usePageSeo({
   364	+  title: "Simon Jouan — Développeur web freelance & IA",
   365	+  description:
   366	+    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
   367	+  path: "/",
   368	+  image: "/images/portrait.jpeg",
   369	+  type: "website",
   370	+  jsonLd: homeJsonLd,
   371	+});
   372	 </script>
   373	 
   374	 <style lang="scss" scoped>
   375	diff --git a/app/pages/services.vue b/app/pages/services.vue
   376	index 83fb5a1..b458474 100644
   377	--- a/app/pages/services.vue
   378	+++ b/app/pages/services.vue
   379	@@ -127,15 +127,35 @@ const steps = [
   380	   { n: "04", title: "Livraison & suivi", desc: "Mise en ligne, documentation, et accompagnement." },
   381	 ];
   382	 
   383	-useHead({
   384	+const siteUrl = useSiteUrl();
   385	+
   386	+const servicesJsonLd = {
   387	+  "@context": "https://schema.org",
   388	+  "@type": "WebPage",
   389	+  name: "Services — jouan.ovh",
   390	+  description:

codex
- **Régression des titres sociaux des articles** — Viole la contrainte de non-régression SEO. Le diff remplace `og:title`/`twitter:title: article.title` par le `title` complet `${article.title} — jouan.ovh` via `usePageSeo` (`full.diff:227-245`), modifiant les aperçus de partage.

- **Le JSON-LD de `/about` contourne `SITE.profile`** — Viole la contrainte de source partagée pour les données `Person`. `name` et `jobTitle` sont hardcodés (`full.diff:158-168`) au lieu d’utiliser `SITE.profile.name` et `SITE.profile.role`.

- **L’Organization n’est pas référencée comme `publisher`** — Viole l’AC/Tâche 1 demandant `publisher`/`Organization`. Le diff injecte seulement un nœud global `Organization` dans `app/app.vue` (`full.diff:16-30`) ; aucun JSON-LD `BlogPosting` ou de page ne contient de propriété `publisher`.
tokens used
131 680
- **Régression des titres sociaux des articles** — Viole la contrainte de non-régression SEO. Le diff remplace `og:title`/`twitter:title: article.title` par le `title` complet `${article.title} — jouan.ovh` via `usePageSeo` (`full.diff:227-245`), modifiant les aperçus de partage.

- **Le JSON-LD de `/about` contourne `SITE.profile`** — Viole la contrainte de source partagée pour les données `Person`. `name` et `jobTitle` sont hardcodés (`full.diff:158-168`) au lieu d’utiliser `SITE.profile.name` et `SITE.profile.role`.

- **L’Organization n’est pas référencée comme `publisher`** — Viole l’AC/Tâche 1 demandant `publisher`/`Organization`. Le diff injecte seulement un nœud global `Organization` dans `app/app.vue` (`full.diff:16-30`) ; aucun JSON-LD `BlogPosting` ou de page ne contient de propriété `publisher`.

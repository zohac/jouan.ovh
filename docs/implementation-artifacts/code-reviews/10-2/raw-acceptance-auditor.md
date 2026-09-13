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
session id: 01a099b1-13a5-7e33-9808-bf62f4c5d88e
--------
user
# Acceptance Auditor Prompt — Story 10.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.2), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
2026-09-13T07:35:16.518798Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
I’m using the code-review skill because this is a repository-grounded acceptance audit. I’ll read the review guidance, then compare the story spec, context, and full diff criterion by criterion.
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

2026-09-13T07:35:22.106695Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
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

2026-09-13T07:35:24.984259Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
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

2026-09-13T07:35:27.564938Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
The review target is explicit: the supplied full diff file plus Story 10.2’s spec and context documents. I’m checking those inputs and the repository review configuration now; the review workflow requires a brief scope checkpoint before analysis.
exec
/bin/zsh -lc "sed -n '1,220p' docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.2: A11y sémantique résiduelle (home / services / contact)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur utilisant un lecteur d'écran,
I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
so that la structure du site m'est annoncée correctement (FR12).

## Acceptance Criteria

**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé)
**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)

## Tasks / Subtasks

- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
- [x] Tâche 4 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.

## Dev Notes

### Périmètre & frontières

- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/pages/index.vue`** (UPDATE) — hero eyebrow l.8 (kicker, reste `<p>`), `<h1>` l.9 ; section « ce que je fais » l.69 eyebrow + `<h2 section__title>` l.70 ; section « projets sélectionnés » l.101 (auditer le titre). Grilles offres + projets en `v-for` → `<ul>`/`<li>`. ⚠️ l.110 carte projet a `target="_blank"` + sr-only (story 10.3, ne pas dupliquer ici).
- **`app/pages/services.vue`** (UPDATE) — `.process` (l.50-62) en `<ol>`/`<li>` + `process__num` `aria-hidden` ; grille des 3 offres `v-for` (l.~25) en `<ul>`/`<li>` ; `offer__points` déjà `<ul>` (l.27). Steps proviennent de `const steps` (process 4 temps).
- **`app/pages/contact.vue`** (UPDATE) — `.contact__info` / `.contact__infocard` (l.89-101) : `infoitem__k` (`// email` / `// localisation` / `// disponibilité`) → `<dl>/<dt>/<dd>` + `//` `aria-hidden`. CTA terminal → `aria-haspopup="dialog"`. Données via `SITE.profile` (`app/data/site.ts`) — ne pas re-hardcoder.
- **`app/assets/scss/base/_layout.scss`** (LECTURE/UPDATE éventuel) — la classe globale `.eyebrow` neutralise déjà le style d'un `<h2>`. Si un reset de liste générique manque, l'ajouter au partiel global, pas en scoped (convention 5.1).

### Pièges / régressions à éviter

- **Rendu strictement identique** : tout changement de balise doit neutraliser le style UA (h2 → hérite `font-weight`/`line-height` via `.eyebrow` ; ol/ul → `list-style: none; margin: 0; padding: 0`). Vérif à l'œil (A1), pas seulement au code.
- **Ne pas toucher** : le `target="_blank"`/sr-only (story 10.3), le SEO (10.5), les états/motion (9.x/10.4). Ne pas casser le `v-for :key`.
- **Eyebrow = kicker vs ouverture de section** : ne pas transformer mécaniquement TOUS les eyebrows en `<h2>` — seuls ceux qui ouvrent une section **sans** titre propre. Un eyebrow au-dessus d'un `<h1>`/`<h2>` existant reste `<p>` (sinon doublon de titre).
- **Prerender (NFR4)** : pur markup, safe. **pnpm + Docker** pour toute commande.
- **Contraste `//`** : si `//` passe en pseudo-élément, garder le token de couleur (pas de hardcode).

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **diff visuel** (rendu identique) et **arbre d'accessibilité** (Chrome DevTools MCP) desktop + mobile : outline titres, listes annoncées, `//` non lu, `aria-haspopup` présent. [Source: project-context.md#Tests, #Vérif visuelle avant revue]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.2 (FR12)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #1 titres/listes, #3 sémantique /contact) ; revues 4.2, 5.2, 6.1, 7.2]
- [Source: docs/project-context.md#Accessibilité (convention titres/listes 5.2), #Vérif visuelle avant revue]
- [Source: app/pages/index.vue, app/pages/services.vue, app/pages/contact.vue, app/assets/scss/base/_layout.scss, app/data/site.ts]

## Dev Agent Record

### Agent Model Used

- Gemini 3.7 Flash (Low)

### Debug Log References

- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).

### Completion Notes List

- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.
- `app/pages/index.vue` :
  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
  - Titre de section `// projets sélectionnés` passé en `<h2 class="eyebrow">` (l'eyebrow ouvre la section projets sans titre secondaire).
  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS (`margin: 0; padding: 0; list-style: none`).
- `app/pages/services.vue` :
  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS.
  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
- `app/pages/contact.vue` :
  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash" par les lecteurs d'écran.
  - Reset CSS sur `dl`, `dt`, `dd` pour garantir la stricte conformité visuelle.
  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.

### File List

- `app/assets/scss/base/_layout.scss` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `app/pages/services.vue` (MODIFIED)
- `app/pages/contact.vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (MODIFIED)

exec
/bin/zsh -lc "sed -n '1,260p' docs/planning-artifacts/epics.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - docs/specs/spec-design-system-revamp/SPEC.md
  - docs/specs/spec-design-system-revamp/pages.md
  - docs/specs/spec-design-system-revamp/primitives.md
  - docs/project-context.md
  - docs/implementation-artifacts/deferred-work.md
  - docs/implementation-artifacts/epic-9-retro-2026-06-29.md
---

# jouan.ovh - Epic Breakdown

## Overview

Ce document décompose la refonte de jouan.ovh sur le nouveau design system
(contrat : `SPEC-design-system-revamp`) en épics et stories implémentables.
Sources : SPEC.md (capacités/contraintes), pages.md + primitives.md (UX),
project-context.md (technique).

## Requirements Inventory

### Functional Requirements

FR1: Migrer le projet vers une stack à jour (Nuxt 4, abandon de `@nuxt/bridge-edge`, deps actuelles) avant toute refonte visuelle. _(CAP-1)_
FR2: Rendre les tokens du design system (couleurs, typo, espacement, rayons, élévation, motion, polices) disponibles comme source unique de vérité du style. _(CAP-2)_
FR3: Recréer les primitives du DS en composants Vue 3 réutilisables. _(CAP-3)_
FR4: Refondre le châssis global (header fixe, footer, navigation, liens sociaux hexagonaux). _(CAP-4)_
FR5: Page d'accueil = hero Terminal (A) + aperçu services + stats + projets sélectionnés. _(CAP-5)_
FR6: Page Services = 3 offres (WordPress / Applications web / IA) + étapes du process (route `/services`). _(CAP-6)_
FR7: Page À-propos = portrait, bio, timeline expérience, formation, stack. _(CAP-7)_
FR8: Blog = index (+ empty-state) et vue article prose + code via `@nuxt/content`. _(CAP-8)_
FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
FR17: Mettre en production — trancher l'hébergement prod, basculer `SITE_URL` + `CNAME` `dev.jouan.ovh` → `jouan.ovh`, et prouver la chaîne de déploiement gh-pages (premier merge `main`, CI + `CNAME` intacts). _(deferred-work domaine #7 + déploiement #9)_

### NonFunctional Requirements

NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
NFR6: Langue & voix — français, 1re personne « je », vouvoiement, pas d'emoji.
NFR7: Typo signature — Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long).
NFR8: Séquencement — la migration (FR1) doit être livrée et verte avant FR2+.
NFR9: Easter-egg terminal préservé — aucune commande existante cassée.

### Additional Requirements

- Gestionnaire de paquets **Yarn** ; build `yarn generate` → `.output/public` ; déploiement `yarn deploy` (push-dir `gh-pages`).
- SCSS structuré (`abstract/` `base/` `components/` `pages/`), entrée `assets/scss/main.scss`, système `@use`.
- Nuxt : auto-import des composants, `pages/`, layout `layouts/default.vue`, images via `<nuxt-img>`/`<nuxt-picture>`.
- Blog via `@nuxt/content` markdown — dossier `content/` à créer.
- Pas de framework de test ; barre de qualité = lint (`eslint`, `stylelint`) + build vert.
- Code legacy Options API + `vue-property-decorator` : migrer/supprimer, ne pas étendre.
- Lint : ESLint + Prettier (double quotes, `;`, `max-len 120`) + `stylelint-scss`.

### UX Design Requirements

UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
UX-DR6: Primitive `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) — réf. `Input.jsx`.
UX-DR7: Primitive `ZAvatar.vue` (radius pill) — réf. `Avatar.jsx`.
UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.

### FR Coverage Map

FR1: Epic 1 — Migration de la stack vers Nuxt 4
FR2: Epic 2 — Tokens du design system disponibles
FR3: Epic 2 — Primitives Vue réutilisables
FR4: Epic 2 — Châssis global (header/footer/nav/socials)
FR5: Epic 3 — Page d'accueil (hero Terminal A)
FR6: Epic 4 — Page Services (route /services)
FR7: Epic 5 — Page À-propos
FR8: Epic 6 — Blog (index + article)
FR9: Epic 7 — Page Contact (route /contact)
FR10: Epic 8 — Terminal easter-egg restylé
FR11: Epic 9 — Accessibilité & finitions motion
FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
FR14: Epic 10 — Validation a11y émulée + unification forced-colors
FR15: Epic 10 — SEO centralisé site-wide
FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
FR17: Epic 10 — Mise en production (domaine prod + déploiement gh-pages prouvé)

## Epic List

### Epic 1: Migration de la stack vers Nuxt 4
Le site tourne sur une stack moderne (Nuxt 4, deps à jour, abandon de `@nuxt/bridge-edge`), build & déploiement verts — base saine et bloquante pour la refonte.
**FRs covered:** FR1 _(NFR4, NFR5, NFR8)_

### Epic 2: Fondations du design system
Langage visuel en place (tokens) + kit de primitives Vue réutilisables + châssis global (header/footer/nav/socials) refondu et visible sur tout le site.
**FRs covered:** FR2, FR3, FR4 _(UX-DR1–7, 10, 11)_

### Epic 3: Page d'accueil
Le visiteur découvre Simon via le hero Terminal (A) + aperçu services + stats + projets sélectionnés.
**FRs covered:** FR5 _(UX-DR12)_

### Epic 4: Page Services
Le visiteur comprend les trois offres (WordPress / Applications web / IA) et le process (nouvelle route `/services`).
**FRs covered:** FR6 _(UX-DR13)_

### Epic 5: Page À-propos
Le visiteur découvre le parcours : portrait, bio, timeline d'expérience, formation, stack.
**FRs covered:** FR7 _(UX-DR14)_

### Epic 6: Blog
Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
**FRs covered:** FR8 _(UX-DR15)_

### Epic 7: Page Contact
Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
**FRs covered:** FR9 _(UX-DR16)_

### Epic 8: Terminal easter-egg restylé
L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
**FRs covered:** FR10 _(UX-DR8, UX-DR9)_

### Epic 9: Accessibilité & finitions motion
Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
**FRs covered:** FR11 _(UX-DR17)_

### Epic 10: Fin de refonte
La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_

---

## Epic 1: Migration de la stack vers Nuxt 4

Le site tourne sur une stack moderne, build & déploiement verts — base saine et bloquante pour la refonte (NFR8).

### Story 1.1: Migrer le cœur vers Nuxt 4

As a mainteneur du site,
I want migrer le projet de Nuxt 3 vers Nuxt 4 et retirer `@nuxt/bridge-edge`,
So that le site repose sur une base moderne et supportée.

**Acceptance Criteria:**

**Given** le projet sur Nuxt 3 + `@nuxt/bridge-edge`
**When** on met à niveau vers Nuxt 4 et on retire la dépendance bridge
**Then** `yarn install` réussit et `yarn dev` démarre sans erreur
**And** `nuxt.config.ts` est adapté à Nuxt 4 (structure `app/` ou compat) et le SSR/generate reste activé

### Story 1.2: Mettre à jour les modules et dépendances

As a mainteneur du site,
I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
So that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.

**Acceptance Criteria:**

**Given** les versions héritées dans `package.json`
**When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable
**Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>`/`<nuxt-picture>`) fonctionnent
**And** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation)

### Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)

As a mainteneur du site,
I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
So that le lint reste la barre de qualité après la montée de version.

**Acceptance Criteria:**

**Given** la config `.eslintrc.js` historique
**When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4
**Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration
**And** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`)

### Story 1.4: Valider build statique et déploiement gh-pages

As a mainteneur du site,
I want valider `yarn generate` et le déploiement gh-pages après migration,
So that la chaîne de production est verte avant d'entamer la refonte.

**Acceptance Criteria:**

**Given** la stack migrée
**When** on lance `yarn generate`
**Then** le build statique réussit et `.output/public` contient les pages existantes
**And** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel

---

## Epic 2: Fondations du design system

Langage visuel, primitives Vue réutilisables et châssis global refondu, visibles sur tout le site.

### Story 2.1: Porter les tokens du design system

As a développeur,
I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
So that tout composant style via une source unique de vérité (UX-DR1, FR2, NFR2).

**Acceptance Criteria:**

**Given** les tokens dans `docs/design_system/tokens/*.css`
**When** on les porte vers `assets/scss/abstract/` (et/ou CSS vars globales) via `@use`
**Then** les valeurs (orange accent, surfaces aubergine, échelle d'espacement, rayons, ombres, motion) sont consommables depuis n'importe quel composant
**And** aucune valeur de couleur/espace/rayon n'est hardcodée dans le nouveau code

### Story 2.2: Polices et base dark-first

As a visiteur,
I want une base typographique et de fond cohérente,
So that le site adopte l'identité « OS de nuit » (UX-DR1, NFR1, NFR7).

**Acceptance Criteria:**

**Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans
**When** on configure `@font-face`/import et le reset/base dark-first
**Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long
**And** le fond par défaut est sombre (aucun thème clair) et lisible

### Story 2.3: Primitive ZButton

As a développeur,
I want un composant bouton conforme au DS,
So that les CTA sont cohérents (UX-DR2, FR3).

**Acceptance Criteria:**

**Given** la référence `components/core/Button.jsx` (+ `.d.ts`)
**When** on crée `ZButton.vue` (`<script setup>`)
**Then** les variantes (primary orange, dark) et tailles rendent conformément à la référence
**And** les états hover/press/focus suivent les tokens (orange → hover/active, nudge press)

### Story 2.4: Primitive ZCard

As a développeur,
I want un composant carte conforme au DS,
So that le contenu est présenté de façon cohérente (UX-DR3, FR3).

**Acceptance Criteria:**

**Given** la référence `Card.jsx` et les `ZCard*` existants
**When** on crée/refond `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline)
**Then** la carte rend conformément à la référence

exec
/bin/zsh -lc "sed -n '1,260p' docs/project-context.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,260p' _bmad/bmm/config.yaml 2>/dev/null || true; sed -n '1,200p' docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md | sed -n '1,40p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.2: A11y sémantique résiduelle (home / services / contact)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur utilisant un lecteur d'écran,
I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
so that la structure du site m'est annoncée correctement (FR12).

## Acceptance Criteria

**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé)
**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)

## Tasks / Subtasks

- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
- [x] Tâche 4 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.

## Dev Notes


exec
/bin/zsh -lc 'wc -l docs/implementation-artifacts/code-reviews/10-2/full.diff && git diff --stat -- docs/implementation-artifacts/code-reviews/10-2/full.diff && git status --short --branch' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     430 docs/implementation-artifacts/code-reviews/10-2/full.diff
## feat/design-system-revamp...origin/feat/design-system-revamp [ahead 27]
 M app/assets/scss/base/_layout.scss
 M app/pages/contact.vue
 M app/pages/index.vue
 M app/pages/services.vue
 M docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/

2026-09-13T07:35:37.506445Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
Scope: 430-line provided diff (`full.diff`), full review mode, with the Story 10.2 spec, `epics.md`, and `project-context.md` loaded. The spec declares baseline `3e82045b...`; the working tree is on `feat/design-system-revamp`, with the four implementation files plus story metadata changed. I’m proceeding with the audit against the supplied diff.
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

2026-09-13T07:35:44.987938Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,520p' docs/implementation-artifacts/code-reviews/10-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/assets/scss/base/_layout.scss b/app/assets/scss/base/_layout.scss
index 5d6729f..e59cebe 100644
--- a/app/assets/scss/base/_layout.scss
+++ b/app/assets/scss/base/_layout.scss
@@ -33,10 +33,13 @@
 }
 
 // Sur-titre mono en capitales espacées, accent orange.
+// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
 .eyebrow {
   margin: 0 0 var(--space-3);
   font-family: var(--font-mono);
   font-size: var(--fs-xs);
+  font-weight: var(--fw-regular);
+  line-height: inherit;
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
   color: var(--accent);
diff --git a/app/pages/contact.vue b/app/pages/contact.vue
index ba80d43..5191532 100644
--- a/app/pages/contact.vue
+++ b/app/pages/contact.vue
@@ -89,18 +89,24 @@
           <div class="contact__info">
             <!-- Carte infos : email / localisation / disponibilité -->
             <ZCard class="contact__infocard">
-              <div class="infoitem">
-                <div class="infoitem__k">// email</div>
-                <a class="infoitem__v contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
-              </div>
-              <div class="infoitem">
-                <div class="infoitem__k">// localisation</div>
-                <div class="infoitem__v">{{ contact.city }}</div>
-              </div>
-              <div class="infoitem">
-                <div class="infoitem__k">// disponibilité</div>
-                <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
-              </div>
+              <dl class="contact__infolist">
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
+                  <dd class="infoitem__v">
+                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
+                  </dd>
+                </div>
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
+                  <dd class="infoitem__v">{{ contact.city }}</dd>
+                </div>
+                <div class="infoitem">
+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
+                  <dd class="infoitem__v">
+                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
+                  </dd>
+                </div>
+              </dl>
             </ZCard>
 
             <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
@@ -110,7 +116,7 @@
                 anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
               </p>
               <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
-              <ZButton variant="terminal" size="sm" @click="openTerminal">
+              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
                 <template #icon><ZIcon name="terminal" /></template>
                 Ouvrir le terminal
               </ZButton>
@@ -360,6 +366,11 @@ useHead({
 }
 
 // ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
+.contact__infolist {
+  margin: 0;
+  padding: 0;
+}
+
 .infoitem {
   font-family: var(--font-mono);
 
@@ -370,12 +381,14 @@ useHead({
 
 .infoitem__k {
   font-size: var(--fs-xs);
+  font-weight: var(--fw-regular);
   letter-spacing: var(--ls-wider);
   text-transform: uppercase;
   color: var(--text-muted);
 }
 
 .infoitem__v {
+  margin: 0;
   font-size: var(--fs-md);
   color: var(--text-strong);
 }
diff --git a/app/pages/index.vue b/app/pages/index.vue
index 1b36402..69ee46d 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -15,9 +15,11 @@
               </ZButton>
               <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
             </div>
-            <div class="hero__tags">
-              <ZTag v-for="tag in tags" :key="tag">{{ tag }}</ZTag>
-            </div>
+            <ul class="hero__tags">
+              <li v-for="tag in tags" :key="tag">
+                <ZTag>{{ tag }}</ZTag>
+              </li>
+            </ul>
           </div>
 
           <!-- Colonne droite : fenêtre terminal décorative (statique) -->
@@ -68,23 +70,18 @@
       <div class="container">
         <p class="eyebrow">// ce que je fais</p>
         <h2 class="section__title">Trois façons de travailler ensemble</h2>
-        <div class="grid-3">
-          <ZCard
-            v-for="service in services"
-            :key="service.id"
-            class="offer"
-            interactive
-            :accent="service.featured"
-            :featured="service.featured"
-          >
-            <div class="offer__icon"><ZIcon :name="service.icon" /></div>
-            <h3 class="offer__title">{{ service.title }}</h3>
-            <p class="offer__desc">{{ service.desc }}</p>
-            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
-              En savoir plus →
-            </NuxtLink>
-          </ZCard>
-        </div>
+        <ul class="grid-3">
+          <li v-for="service in services" :key="service.id">
+            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
+              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
+              <h3 class="offer__title">{{ service.title }}</h3>
+              <p class="offer__desc">{{ service.desc }}</p>
+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
+                En savoir plus →
+              </NuxtLink>
+            </ZCard>
+          </li>
+        </ul>
       </div>
     </section>
 
@@ -98,29 +95,24 @@
           </div>
         </div>
 
-        <p class="eyebrow">// projets sélectionnés</p>
-        <div class="grid-2 projects">
-          <ZCard
-            v-for="project in projects"
-            :key="project.url"
-            class="project"
-            interactive
-            as="a"
-            :href="project.url"
-            target="_blank"
-            rel="noopener noreferrer"
-          >
-            <div class="project__head">
-              <h3 class="project__name">{{ project.name }}</h3>
-              <span class="project__role">{{ project.role }}</span>
-            </div>
-            <p class="prose project__desc">{{ project.desc }}</p>
-            <div class="hero__tags">
-              <ZTag v-for="tag in project.tags" :key="tag">{{ tag }}</ZTag>
-            </div>
-            <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
-          </ZCard>
-        </div>
+        <h2 class="eyebrow">// projets sélectionnés</h2>
+        <ul class="grid-2 projects">
+          <li v-for="project in projects" :key="project.url">
+            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
+              <div class="project__head">
+                <h3 class="project__name">{{ project.name }}</h3>
+                <span class="project__role">{{ project.role }}</span>
+              </div>
+              <p class="prose project__desc">{{ project.desc }}</p>
+              <ul class="hero__tags">
+                <li v-for="tag in project.tags" :key="tag">
+                  <ZTag>{{ tag }}</ZTag>
+                </li>
+              </ul>
+              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
+            </ZCard>
+          </li>
+        </ul>
       </div>
     </section>
   </main>
@@ -449,6 +441,9 @@ const { open: openTerminal } = useTerminal();
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 .offer__icon {
@@ -531,6 +526,9 @@ const { open: openTerminal } = useTerminal();
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: var(--space-6);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 .projects {
diff --git a/app/pages/services.vue b/app/pages/services.vue
index 14b739f..c8d81d8 100644
--- a/app/pages/services.vue
+++ b/app/pages/services.vue
@@ -10,39 +10,35 @@
           vous gardez la main sur votre projet.
         </p>
 
-        <div class="grid-3">
-          <ZCard
-            v-for="offer in offers"
-            :key="offer.id"
-            class="offer"
-            :accent="offer.featured"
-            :featured="offer.featured"
-          >
-            <div v-if="offer.featured" class="offer__badge">
-              <ZBadge tone="accent">Le plus demandé</ZBadge>
-            </div>
-            <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
-            <h2 class="offer__title">{{ offer.title }}</h2>
-            <p class="offer__desc">{{ offer.desc }}</p>
-            <ul class="offer__points">
-              <li v-for="point in offer.points" :key="point">{{ point }}</li>
-            </ul>
-            <div class="offer__price">
-              <b>{{ offer.price }}</b>
-            </div>
-            <div class="offer__cta">
-              <ZButton
-                :as="NuxtLink"
-                to="/contact"
-                :variant="offer.featured ? 'primary' : 'secondary'"
-                :aria-label="`Discuter du projet — ${offer.title}`"
-                class="offer__btn"
-              >
-                Discuter du projet
-              </ZButton>
-            </div>
-          </ZCard>
-        </div>
+        <ul class="grid-3">
+          <li v-for="offer in offers" :key="offer.id">
+            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
+              <div v-if="offer.featured" class="offer__badge">
+                <ZBadge tone="accent">Le plus demandé</ZBadge>
+              </div>
+              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
+              <h2 class="offer__title">{{ offer.title }}</h2>
+              <p class="offer__desc">{{ offer.desc }}</p>
+              <ul class="offer__points">
+                <li v-for="point in offer.points" :key="point">{{ point }}</li>
+              </ul>
+              <div class="offer__price">
+                <b>{{ offer.price }}</b>
+              </div>
+              <div class="offer__cta">
+                <ZButton
+                  :as="NuxtLink"
+                  to="/contact"
+                  :variant="offer.featured ? 'primary' : 'secondary'"
+                  :aria-label="`Discuter du projet — ${offer.title}`"
+                  class="offer__btn"
+                >
+                  Discuter du projet
+                </ZButton>
+              </div>
+            </ZCard>
+          </li>
+        </ul>
       </div>
     </section>
 
@@ -52,13 +48,13 @@
         <p class="eyebrow">// comment ça se passe</p>
         <h2 class="process__title">Un déroulé simple en quatre temps</h2>
 
-        <div class="process">
-          <div v-for="step in steps" :key="step.n" class="process__step">
-            <div class="process__num">{{ step.n }}</div>
+        <ol class="process">
+          <li v-for="step in steps" :key="step.n" class="process__step">
+            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
             <h3 class="process__step-title">{{ step.title }}</h3>
             <p class="prose process__desc">{{ step.desc }}</p>
-          </div>
-        </div>
+          </li>
+        </ol>
 
         <div class="process__cta">
           <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
@@ -175,6 +171,9 @@ useHead({
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 // `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
@@ -280,6 +279,9 @@ useHead({
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: var(--space-5);
+  margin: 0;
+  padding: 0;
+  list-style: none;
 }
 
 .process__num {
diff --git a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
index 2ac1617..d8cc22b 100644
--- a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
+++ b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.2: A11y sémantique résiduelle (home / services / contact)
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,18 +23,18 @@ so that la structure du site m'est annoncée correctement (FR12).
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
-  - [ ] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
-  - [ ] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
-- [ ] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
-  - [ ] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
-  - [ ] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
-- [ ] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
-  - [ ] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
-  - [ ] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
-- [ ] Tâche 4 — Validation (AC: tout)
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
-  - [ ] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
+- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
+  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
+  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
+- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
+  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
+  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
+- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
+  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
+  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
+- [x] Tâche 4 — Validation (AC: tout)
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
+  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
 
 ## Dev Notes
 
@@ -74,8 +74,33 @@ so that la structure du site m'est annoncée correctement (FR12).
 
 ### Agent Model Used
 
+- Gemini 3.7 Flash (Low)
+
 ### Debug Log References
 
+- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).
+
 ### Completion Notes List
 
+- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.
+- `app/pages/index.vue` :
+  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
+  - Titre de section `// projets sélectionnés` passé en `<h2 class="eyebrow">` (l'eyebrow ouvre la section projets sans titre secondaire).
+  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS (`margin: 0; padding: 0; list-style: none`).
+- `app/pages/services.vue` :
+  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS.
+  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
+- `app/pages/contact.vue` :
+  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
+  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash" par les lecteurs d'écran.
+  - Reset CSS sur `dl`, `dt`, `dd` pour garantir la stricte conformité visuelle.
+  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.
+
 ### File List
+
+- `app/assets/scss/base/_layout.scss` (MODIFIED)
+- `app/pages/index.vue` (MODIFIED)
+- `app/pages/services.vue` (MODIFIED)
+- `app/pages/contact.vue` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (MODIFIED)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 02bb83f..37ac8d5 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
+last_updated: "2026-09-13 (Story 10.2 terminée : a11y sémantique résiduelle sur home/services/contact, statut review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -109,7 +109,7 @@ development_status:
   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   epic-10: in-progress
   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
-  10-2-a11y-semantique-residuelle: ready-for-dev
+  10-2-a11y-semantique-residuelle: review
   10-3-liens-externes-accessibles: ready-for-dev
   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   10-5-seo-centralise-site-wide: ready-for-dev

2026-09-13T07:35:49.833153Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -C 5 \"hero__tags|grid-3|grid-2|process|contact__infolist|infoitem__k|contact__infocard|<h[1-3]|class=\\\"eyebrow\" app/assets/scss/base/_layout.scss app/pages/index.vue app/pages/services.vue app/pages/contact.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/services.vue-1-<template>
app/pages/services.vue-2-  <main class="services">
app/pages/services.vue:3:    <!-- En-tête + grille d'offres (story 4.1). La 2e section (process) viendra en 4.2. -->
app/pages/services.vue-4-    <section class="section">
app/pages/services.vue-5-      <div class="container">
app/pages/services.vue:6:        <p class="eyebrow">// services</p>
app/pages/services.vue:7:        <h1 class="services__title">Des prestations claires, pensées comme des produits.</h1>
app/pages/services.vue-8-        <p class="prose services__intro">
app/pages/services.vue-9-          Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique,
app/pages/services.vue-10-          vous gardez la main sur votre projet.
app/pages/services.vue-11-        </p>
app/pages/services.vue-12-
app/pages/services.vue:13:        <ul class="grid-3">
app/pages/services.vue-14-          <li v-for="offer in offers" :key="offer.id">
app/pages/services.vue-15-            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
app/pages/services.vue-16-              <div v-if="offer.featured" class="offer__badge">
app/pages/services.vue-17-                <ZBadge tone="accent">Le plus demandé</ZBadge>
app/pages/services.vue-18-              </div>
app/pages/services.vue-19-              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
app/pages/services.vue:20:              <h2 class="offer__title">{{ offer.title }}</h2>
app/pages/services.vue-21-              <p class="offer__desc">{{ offer.desc }}</p>
app/pages/services.vue-22-              <ul class="offer__points">
app/pages/services.vue-23-                <li v-for="point in offer.points" :key="point">{{ point }}</li>
app/pages/services.vue-24-              </ul>
app/pages/services.vue-25-              <div class="offer__price">
--
app/pages/services.vue-40-          </li>
app/pages/services.vue-41-        </ul>
app/pages/services.vue-42-      </div>
app/pages/services.vue-43-    </section>
app/pages/services.vue-44-
app/pages/services.vue:45:    <!-- Section process : 4 étapes ordonnées + CTA (story 4.2). Porté de Services.jsx L45-61. -->
app/pages/services.vue-46-    <section class="section section--sunken">
app/pages/services.vue-47-      <div class="container">
app/pages/services.vue:48:        <p class="eyebrow">// comment ça se passe</p>
app/pages/services.vue:49:        <h2 class="process__title">Un déroulé simple en quatre temps</h2>
app/pages/services.vue-50-
app/pages/services.vue:51:        <ol class="process">
app/pages/services.vue:52:          <li v-for="step in steps" :key="step.n" class="process__step">
app/pages/services.vue:53:            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
app/pages/services.vue:54:            <h3 class="process__step-title">{{ step.title }}</h3>
app/pages/services.vue:55:            <p class="prose process__desc">{{ step.desc }}</p>
app/pages/services.vue-56-          </li>
app/pages/services.vue-57-        </ol>
app/pages/services.vue-58-
app/pages/services.vue:59:        <div class="process__cta">
app/pages/services.vue-60-          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue-61-            Demander un devis
app/pages/services.vue-62-            <template #iconRight><ZIcon name="arrow" /></template>
app/pages/services.vue-63-          </ZButton>
app/pages/services.vue-64-        </div>
--
app/pages/services.vue-66-    </section>
app/pages/services.vue-67-  </main>
app/pages/services.vue-68-</template>
app/pages/services.vue-69-
app/pages/services.vue-70-<script setup lang="ts">
app/pages/services.vue:71:// Page Services — en-tête + grille des 3 offres (story 4.1) puis section process
app/pages/services.vue-72-// (4 étapes ordonnées + CTA « Demander un devis », story 4.2). Porté de Services.jsx
app/pages/services.vue-73-// du UI kit : recréation Vue 3 + tokens (aucune copie JSX). Dark-first, accent orange.
app/pages/services.vue-74-import { NuxtLink } from "#components";
app/pages/services.vue-75-
app/pages/services.vue-76-interface Offer {
--
app/pages/services.vue-116-    price: "sur devis",
app/pages/services.vue-117-    featured: false,
app/pages/services.vue-118-  },
app/pages/services.vue-119-];
app/pages/services.vue-120-
app/pages/services.vue:121:// Étapes du process — texte repris à l'identique de Services.jsx (tableau `steps`,
app/pages/services.vue-122-// pas dans data.js). L'ordre du tableau garantit l'affichage 01 → 04 (AC #1).
app/pages/services.vue-123-// `n` (numéro affiché) sert aussi de clé v-for stable et unique.
app/pages/services.vue-124-const steps = [
app/pages/services.vue-125-  { n: "01", title: "Échange", desc: "On cadre le besoin, le périmètre et le budget — sans jargon inutile." },
app/pages/services.vue-126-  { n: "02", title: "Conception", desc: "Architecture, maquette, et plan de livraison clair." },
--
app/pages/services.vue-164-  max-width: 60ch;
app/pages/services.vue-165-  margin-bottom: var(--space-10);
app/pages/services.vue-166-  color: var(--text-muted);
app/pages/services.vue-167-}
app/pages/services.vue-168-
app/pages/services.vue:169:// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
app/pages/services.vue:170:.grid-3 {
app/pages/services.vue-171-  display: grid;
app/pages/services.vue-172-  grid-template-columns: repeat(3, 1fr);
app/pages/services.vue-173-  gap: var(--space-5);
app/pages/services.vue-174-  margin: 0;
app/pages/services.vue-175-  padding: 0;
--
app/pages/services.vue-264-// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
app/pages/services.vue-265-.offer__btn {
app/pages/services.vue-266-  width: 100%;
app/pages/services.vue-267-}
app/pages/services.vue-268-
app/pages/services.vue:269:// ---- Section process (porté de Services.jsx L45-61) ----
app/pages/services.vue:270:.process__title {
app/pages/services.vue-271-  margin-bottom: var(--space-8);
app/pages/services.vue-272-  font-family: var(--font-mono);
app/pages/services.vue-273-  font-size: var(--fs-3xl);
app/pages/services.vue-274-  font-weight: var(--fw-regular);
app/pages/services.vue-275-  color: var(--text-strong);
app/pages/services.vue-276-}
app/pages/services.vue-277-
app/pages/services.vue:278:.process {
app/pages/services.vue-279-  display: grid;
app/pages/services.vue-280-  grid-template-columns: repeat(4, 1fr);
app/pages/services.vue-281-  gap: var(--space-5);
app/pages/services.vue-282-  margin: 0;
app/pages/services.vue-283-  padding: 0;
app/pages/services.vue-284-  list-style: none;
app/pages/services.vue-285-}
app/pages/services.vue-286-
app/pages/services.vue:287:.process__num {
app/pages/services.vue-288-  font-family: var(--font-mono);
app/pages/services.vue-289-  font-size: var(--fs-3xl);
app/pages/services.vue-290-  font-weight: var(--fw-light);
app/pages/services.vue-291-  color: var(--accent);
app/pages/services.vue-292-}
app/pages/services.vue-293-
app/pages/services.vue:294:.process__step-title {
app/pages/services.vue-295-  margin: var(--space-2) 0;
app/pages/services.vue-296-  font-family: var(--font-mono);
app/pages/services.vue-297-  font-size: var(--fs-lg);
app/pages/services.vue-298-  font-weight: var(--fw-regular);
app/pages/services.vue-299-  color: var(--text-strong);
app/pages/services.vue-300-}
app/pages/services.vue-301-
app/pages/services.vue:302:.process__desc {
app/pages/services.vue-303-  font-size: var(--fs-sm);
app/pages/services.vue-304-  color: var(--text-muted);
app/pages/services.vue-305-}
app/pages/services.vue-306-
app/pages/services.vue:307:.process__cta {
app/pages/services.vue-308-  margin-top: var(--space-12);
app/pages/services.vue-309-  text-align: center;
app/pages/services.vue-310-}
app/pages/services.vue-311-
app/pages/services.vue-312-// ---- Responsive (cf. kit.css @media max-width: 900px) ----
app/pages/services.vue-313-@media (width <= 900px) {
app/pages/services.vue:314:  .grid-3,
app/pages/services.vue:315:  .process {
app/pages/services.vue-316-    grid-template-columns: 1fr;
app/pages/services.vue-317-  }
app/pages/services.vue-318-}
app/pages/services.vue-319-</style>
--
app/pages/contact.vue-3-    <section class="section">
app/pages/contact.vue-4-      <div class="container">
app/pages/contact.vue-5-        <div class="contact__grid">
app/pages/contact.vue-6-          <!-- Colonne gauche : en-tête + formulaire (story 7.1) -->
app/pages/contact.vue-7-          <div class="contact__main">
app/pages/contact.vue:8:            <p class="eyebrow">// contact</p>
app/pages/contact.vue:9:            <h1 class="contact__title">Parlons de votre projet</h1>
app/pages/contact.vue-10-            <p class="prose contact__intro">
app/pages/contact.vue-11-              Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds
app/pages/contact.vue-12-              sous 48h.
app/pages/contact.vue-13-            </p>
app/pages/contact.vue-14-
--
app/pages/contact.vue-86-          </div>
app/pages/contact.vue-87-
app/pages/contact.vue-88-          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
app/pages/contact.vue-89-          <div class="contact__info">
app/pages/contact.vue-90-            <!-- Carte infos : email / localisation / disponibilité -->
app/pages/contact.vue:91:            <ZCard class="contact__infocard">
app/pages/contact.vue:92:              <dl class="contact__infolist">
app/pages/contact.vue-93-                <div class="infoitem">
app/pages/contact.vue:94:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
app/pages/contact.vue-95-                  <dd class="infoitem__v">
app/pages/contact.vue-96-                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
app/pages/contact.vue-97-                  </dd>
app/pages/contact.vue-98-                </div>
app/pages/contact.vue-99-                <div class="infoitem">
app/pages/contact.vue:100:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
app/pages/contact.vue-101-                  <dd class="infoitem__v">{{ contact.city }}</dd>
app/pages/contact.vue-102-                </div>
app/pages/contact.vue-103-                <div class="infoitem">
app/pages/contact.vue:104:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
app/pages/contact.vue-105-                  <dd class="infoitem__v">
app/pages/contact.vue-106-                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
app/pages/contact.vue-107-                  </dd>
app/pages/contact.vue-108-                </div>
app/pages/contact.vue-109-              </dl>
--
app/pages/contact.vue-298-  display: flex;
app/pages/contact.vue-299-  flex-direction: column;
app/pages/contact.vue-300-  gap: var(--space-4);
app/pages/contact.vue-301-}
app/pages/contact.vue-302-
app/pages/contact.vue:303:// Rangée Nom + Email (porté de Contact.jsx : grid-2, gap space-4).
app/pages/contact.vue-304-.contact__row {
app/pages/contact.vue-305-  display: grid;
app/pages/contact.vue-306-  grid-template-columns: 1fr 1fr;
app/pages/contact.vue-307-  gap: var(--space-4);
app/pages/contact.vue-308-}
--
app/pages/contact.vue-364-  flex-direction: column;
app/pages/contact.vue-365-  gap: var(--space-5);
app/pages/contact.vue-366-}
app/pages/contact.vue-367-
app/pages/contact.vue-368-// ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
app/pages/contact.vue:369:.contact__infolist {
app/pages/contact.vue-370-  margin: 0;
app/pages/contact.vue-371-  padding: 0;
app/pages/contact.vue-372-}
app/pages/contact.vue-373-
app/pages/contact.vue-374-.infoitem {
--
app/pages/contact.vue-377-  &:not(:last-child) {
app/pages/contact.vue-378-    margin-bottom: var(--space-5);
app/pages/contact.vue-379-  }
app/pages/contact.vue-380-}
app/pages/contact.vue-381-
app/pages/contact.vue:382:.infoitem__k {
app/pages/contact.vue-383-  font-size: var(--fs-xs);
app/pages/contact.vue-384-  font-weight: var(--fw-regular);
app/pages/contact.vue-385-  letter-spacing: var(--ls-wider);
app/pages/contact.vue-386-  text-transform: uppercase;
app/pages/contact.vue-387-  color: var(--text-muted);
--
app/pages/index.vue-3-    <section class="hero hero__grad">
app/pages/index.vue-4-      <div class="hero__in container">
app/pages/index.vue-5-        <div class="hero__grid">
app/pages/index.vue-6-          <!-- Colonne gauche : accroche, CTA, tags -->
app/pages/index.vue-7-          <div class="anim hero__text">
app/pages/index.vue:8:            <p class="eyebrow">// développeur web freelance</p>
app/pages/index.vue:9:            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
app/pages/index.vue-10-            <p class="hero__sub">{{ tagline }}</p>
app/pages/index.vue-11-            <div class="hero__cta">
app/pages/index.vue-12-              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/index.vue-13-                Démarrer un projet
app/pages/index.vue-14-                <template #iconRight><ZIcon name="arrow" /></template>
app/pages/index.vue-15-              </ZButton>
app/pages/index.vue-16-              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
app/pages/index.vue-17-            </div>
app/pages/index.vue:18:            <ul class="hero__tags">
app/pages/index.vue-19-              <li v-for="tag in tags" :key="tag">
app/pages/index.vue-20-                <ZTag>{{ tag }}</ZTag>
app/pages/index.vue-21-              </li>
app/pages/index.vue-22-            </ul>
app/pages/index.vue-23-          </div>
--
app/pages/index.vue-66-    </section>
app/pages/index.vue-67-
app/pages/index.vue-68-    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
app/pages/index.vue-69-    <section class="section">
app/pages/index.vue-70-      <div class="container">
app/pages/index.vue:71:        <p class="eyebrow">// ce que je fais</p>
app/pages/index.vue:72:        <h2 class="section__title">Trois façons de travailler ensemble</h2>
app/pages/index.vue:73:        <ul class="grid-3">
app/pages/index.vue-74-          <li v-for="service in services" :key="service.id">
app/pages/index.vue-75-            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
app/pages/index.vue-76-              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
app/pages/index.vue:77:              <h3 class="offer__title">{{ service.title }}</h3>
app/pages/index.vue-78-              <p class="offer__desc">{{ service.desc }}</p>
app/pages/index.vue-79-              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
app/pages/index.vue-80-                En savoir plus →
app/pages/index.vue-81-              </NuxtLink>
app/pages/index.vue-82-            </ZCard>
--
app/pages/index.vue-93-            <b>{{ stat.value }}</b>
app/pages/index.vue-94-            <span>{{ stat.label }}</span>
app/pages/index.vue-95-          </div>
app/pages/index.vue-96-        </div>
app/pages/index.vue-97-
app/pages/index.vue:98:        <h2 class="eyebrow">// projets sélectionnés</h2>
app/pages/index.vue:99:        <ul class="grid-2 projects">
app/pages/index.vue-100-          <li v-for="project in projects" :key="project.url">
app/pages/index.vue-101-            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
app/pages/index.vue-102-              <div class="project__head">
app/pages/index.vue:103:                <h3 class="project__name">{{ project.name }}</h3>
app/pages/index.vue-104-                <span class="project__role">{{ project.role }}</span>
app/pages/index.vue-105-              </div>
app/pages/index.vue-106-              <p class="prose project__desc">{{ project.desc }}</p>
app/pages/index.vue:107:              <ul class="hero__tags">
app/pages/index.vue-108-                <li v-for="tag in project.tags" :key="tag">
app/pages/index.vue-109-                  <ZTag>{{ tag }}</ZTag>
app/pages/index.vue-110-                </li>
app/pages/index.vue-111-              </ul>
app/pages/index.vue-112-              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
--
app/pages/index.vue-266-  flex-wrap: wrap;
app/pages/index.vue-267-  gap: var(--space-3);
app/pages/index.vue-268-  margin-bottom: var(--space-6);
app/pages/index.vue-269-}
app/pages/index.vue-270-
app/pages/index.vue:271:// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
app/pages/index.vue-272-
app/pages/index.vue-273-// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
app/pages/index.vue-274-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
app/pages/index.vue-275-// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
app/pages/index.vue-276-// l'identique la spec du composant DS et n'ont pas de token d'espacement
--
app/pages/index.vue-434-  font-size: var(--fs-3xl);
app/pages/index.vue-435-  font-weight: var(--fw-regular);
app/pages/index.vue-436-  color: var(--text-strong);
app/pages/index.vue-437-}
app/pages/index.vue-438-
app/pages/index.vue:439:// ---- Aperçu services (porté de .grid-3 / .offer*) ----
app/pages/index.vue:440:.grid-3 {
app/pages/index.vue-441-  display: grid;
app/pages/index.vue-442-  grid-template-columns: repeat(3, 1fr);
app/pages/index.vue-443-  gap: var(--space-5);
app/pages/index.vue-444-  margin: 0;
app/pages/index.vue-445-  padding: 0;
--
app/pages/index.vue-519-    font-size: var(--fs-sm);
app/pages/index.vue-520-    color: var(--text-muted);
app/pages/index.vue-521-  }
app/pages/index.vue-522-}
app/pages/index.vue-523-
app/pages/index.vue:524:// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
app/pages/index.vue:525:.grid-2 {
app/pages/index.vue-526-  display: grid;
app/pages/index.vue-527-  grid-template-columns: 1fr 1fr;
app/pages/index.vue-528-  gap: var(--space-6);
app/pages/index.vue-529-  margin: 0;
app/pages/index.vue-530-  padding: 0;
--
app/pages/index.vue-576-
app/pages/index.vue-577-  .hero__title {
app/pages/index.vue-578-    font-size: var(--fs-4xl);
app/pages/index.vue-579-  }
app/pages/index.vue-580-
app/pages/index.vue:581:  .grid-3,
app/pages/index.vue:582:  .grid-2 {
app/pages/index.vue-583-    grid-template-columns: 1fr;
app/pages/index.vue-584-  }
app/pages/index.vue-585-}
app/pages/index.vue-586-
app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
--
app/assets/scss/base/_layout.scss-31-  margin: 0 auto;
app/assets/scss/base/_layout.scss-32-  padding-inline: var(--space-6);
app/assets/scss/base/_layout.scss-33-}
app/assets/scss/base/_layout.scss-34-
app/assets/scss/base/_layout.scss-35-// Sur-titre mono en capitales espacées, accent orange.
app/assets/scss/base/_layout.scss:36:// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
app/assets/scss/base/_layout.scss-37-.eyebrow {
app/assets/scss/base/_layout.scss-38-  margin: 0 0 var(--space-3);
app/assets/scss/base/_layout.scss-39-  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss-40-  font-size: var(--fs-xs);
app/assets/scss/base/_layout.scss-41-  font-weight: var(--fw-regular);
--
app/assets/scss/base/_layout.scss-57-  color: var(--text-body);
app/assets/scss/base/_layout.scss-58-}
app/assets/scss/base/_layout.scss-59-
app/assets/scss/base/_layout.scss-60-// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
app/assets/scss/base/_layout.scss-61-// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
app/assets/scss/base/_layout.scss:62:.hero__tags {
app/assets/scss/base/_layout.scss-63-  display: flex;
app/assets/scss/base/_layout.scss-64-  flex-wrap: wrap;
app/assets/scss/base/_layout.scss-65-  gap: var(--space-2);
app/assets/scss/base/_layout.scss-66-  margin: 0;
app/assets/scss/base/_layout.scss-67-  padding: 0;

exec
/bin/zsh -lc 'rg -n -C 3 "Accessibilité|Hiérarchie de titres|sémantique de listes|Tests|Vérif visuelle|FR12|Story 10.2" docs/project-context.md docs/planning-artifacts/epics.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/project-context.md-170-  « Environnement de dev »), jamais directement sur l'hôte :
docs/project-context.md-171-  `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`.
docs/project-context.md-172-- Validation : `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (`nuxi typecheck`
docs/project-context.md:173:  / vue-tsc) + build `pnpm generate` — tout doit passer (cf. section Tests).
docs/project-context.md-174-- Build statique : `pnpm generate` → sortie `.output/public`.
docs/project-context.md-175-- Déploiement : `pnpm deploy` (`push-dir` vers la branche `gh-pages`).
docs/project-context.md-176-- ⚠️ Le domaine custom dépend du fichier `CNAME` — ne pas le perdre lors du
docs/project-context.md-177-  déploiement gh-pages (régression déjà survenue, cf. commit `cf1829e`).
docs/project-context.md-178-
docs/project-context.md:179:### Tests
docs/project-context.md-180-
docs/project-context.md-181-- ❌ Aucun framework de test configuré à ce jour (pas de Vitest/Jest/Playwright).
docs/project-context.md-182-- Validation actuelle = lint (`eslint`, `stylelint`) + `pnpm typecheck` (vue-tsc) +
--
docs/project-context.md-196-- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
docs/project-context.md-197-  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.
docs/project-context.md-198-
docs/project-context.md:199:**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**
docs/project-context.md-200-
docs/project-context.md-201-- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
docs/project-context.md-202-  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
--
docs/project-context.md-204-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/project-context.md-205-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/project-context.md-206-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/project-context.md:207:- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
docs/project-context.md-208-  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
docs/project-context.md-209-  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
docs/project-context.md-210-  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
--
docs/project-context.md-259-  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
docs/project-context.md-260-  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
docs/project-context.md-261-  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
docs/project-context.md:262:- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
docs/project-context.md-263-  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
docs/project-context.md-264-  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
docs/project-context.md-265-  est aveugle aux régressions de rendu. Réfs par page :
--
docs/planning-artifacts/epics.md-33-FR9: Page Contact = formulaire + carte infos + CTA terminal + socials (route `/contact`). _(CAP-9)_
docs/planning-artifacts/epics.md-34-FR10: Conserver et restyler l'easter-egg terminal draggable selon le DS. _(CAP-10)_
docs/planning-artifacts/epics.md-35-FR11: Respecter les fondamentaux d'accessibilité et de motion du DS. _(CAP-11)_
docs/planning-artifacts/epics.md:36:FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/planning-artifacts/epics.md-37-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/planning-artifacts/epics.md-39-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
--
docs/planning-artifacts/epics.md-80-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
docs/planning-artifacts/epics.md-81-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/planning-artifacts/epics.md-82-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/planning-artifacts/epics.md:83:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/planning-artifacts/epics.md-84-
docs/planning-artifacts/epics.md-85-### FR Coverage Map
docs/planning-artifacts/epics.md-86-
--
docs/planning-artifacts/epics.md-94-FR8: Epic 6 — Blog (index + article)
docs/planning-artifacts/epics.md-95-FR9: Epic 7 — Page Contact (route /contact)
docs/planning-artifacts/epics.md-96-FR10: Epic 8 — Terminal easter-egg restylé
docs/planning-artifacts/epics.md:97:FR11: Epic 9 — Accessibilité & finitions motion
docs/planning-artifacts/epics.md:98:FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/planning-artifacts/epics.md-99-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/planning-artifacts/epics.md-101-FR15: Epic 10 — SEO centralisé site-wide
--
docs/planning-artifacts/epics.md-136-L'easter-egg terminal draggable fonctionne et adopte le style du DS (Prompt + TerminalWindow), sans casser les commandes existantes.
docs/planning-artifacts/epics.md-137-**FRs covered:** FR10 _(UX-DR8, UX-DR9)_
docs/planning-artifacts/epics.md-138-
docs/planning-artifacts/epics.md:139:### Epic 9: Accessibilité & finitions motion
docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/planning-artifacts/epics.md-141-**FRs covered:** FR11 _(UX-DR17)_
docs/planning-artifacts/epics.md-142-
docs/planning-artifacts/epics.md-143-### Epic 10: Fin de refonte
docs/planning-artifacts/epics.md-144-La refonte est réellement livrée : a11y résiduelle bouclée et validée, SEO centralisé, conformité légale publiée, et le site déployé en production sur `jouan.ovh` (gh-pages prouvé, `CNAME` intact). _(Ajouté après la rétro Epic 9 — décision Simon : consolider la pile `deferred-work.md` « fin de refonte » en un épic.)_
docs/planning-artifacts/epics.md:145:**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
docs/planning-artifacts/epics.md-146-
docs/planning-artifacts/epics.md-147----
docs/planning-artifacts/epics.md-148-
--
docs/planning-artifacts/epics.md-528-
docs/planning-artifacts/epics.md-529----
docs/planning-artifacts/epics.md-530-
docs/planning-artifacts/epics.md:531:## Epic 9: Accessibilité & finitions motion
docs/planning-artifacts/epics.md-532-
docs/planning-artifacts/epics.md-533-Passe transverse finale de qualité.
docs/planning-artifacts/epics.md-534-
--
docs/planning-artifacts/epics.md-579-**Then** la décision est consignée et `SITE_URL` est lu depuis `runtimeConfig` (valeur staging/prod swappable, sans domaine hardcodé)
docs/planning-artifacts/epics.md-580-**And** le dry-run prouve `pnpm generate` vert (11 routes) + un artefact `gh-pages` servant le site avec `CNAME` intact (régression `cf1829e` non reproduite), documenté dans la story
docs/planning-artifacts/epics.md-581-
docs/planning-artifacts/epics.md:582:### Story 10.2: A11y sémantique résiduelle (home / services / contact)
docs/planning-artifacts/epics.md-583-
docs/planning-artifacts/epics.md-584-As a visiteur utilisant un lecteur d'écran,
docs/planning-artifacts/epics.md-585-I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
docs/planning-artifacts/epics.md:586:So that la structure du site m'est annoncée correctement (FR12).
docs/planning-artifacts/epics.md-587-
docs/planning-artifacts/epics.md-588-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-589-

exec
/bin/zsh -lc 'git diff --check -- docs/implementation-artifacts/code-reviews/10-2/full.diff; rg -n "pnpm lint|typecheck|generate|Chrome|DevTools|accessibility|accessibilité|pixel|11 routes" docs/implementation-artifacts/code-reviews/10-2/full.diff docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:22:**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:36:  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:37:  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:64:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **diff visuel** (rendu identique) et **arbre d'accessibilité** (Chrome DevTools MCP) desktop + mobile : outline titres, listes annoncées, `//` non lu, `aria-haspopup` présent. [Source: project-context.md#Tests, #Vérif visuelle avant revue]
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:81:- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-2/full.diff:358:-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
docs/implementation-artifacts/code-reviews/10-2/full.diff:359:-  - [ ] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
docs/implementation-artifacts/code-reviews/10-2/full.diff:370:+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
docs/implementation-artifacts/code-reviews/10-2/full.diff:371:+  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
docs/implementation-artifacts/code-reviews/10-2/full.diff:383:+- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-2/full.diff:416: generated: 2026-06-18
docs/implementation-artifacts/code-reviews/10-2/full.diff:417:-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"

exec
/bin/zsh -lc "git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/assets/scss/base/_layout.scss | sed -n '1,180p'; git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/pages/index.vue | sed -n '1,180p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Primitives de layout du design system — GLOBALES
//
//  .section / .section--sunken / .container / .eyebrow / .prose
//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
//  à l'identique en <style scoped> dans chaque page (index, services,
//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
// ============================================================

/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */

// Bloc de section vertical. padding-block uniquement : le gutter
// horizontal vient de .container (enfant) — évite le conflit de
// shorthand padding multi-axes (cf. project-context, piège story 3.1).
.section {
  padding-block: var(--space-16);
}

// Section en creux : fond teinté + filets haut/bas.
.section--sunken {
  background: var(--bg-sunken);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

// Conteneur centré à largeur max ; gutter horizontal en longhand.
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

// Sur-titre mono en capitales espacées, accent orange.
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--accent);
}

// Variante discrète (sur-titre secondaire, ex. « // stack »).
.eyebrow--muted {
  color: var(--text-muted);
}

// Texte long-forme : Ubuntu sans, interligne détendu.
.prose {
  font-family: var(--font-sans);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
.post__meta {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
  color: var(--text-muted);
}
<template>
  <main class="home">
    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche, CTA, tags -->
          <div class="anim hero__text">
            <p class="eyebrow">// développeur web freelance</p>
            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
            <p class="hero__sub">{{ tagline }}</p>
            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Démarrer un projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
            </div>
            <div class="hero__tags">
              <ZTag v-for="tag in tags" :key="tag">{{ tag }}</ZTag>
            </div>
          </div>

          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
          <div class="anim hero__term-col">
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
                <template v-for="row in terminalRows" :key="row.id">
                  <p class="hero-term__line" aria-hidden="true">
                    <span class="prm"
                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
                      ><span class="prm__cmd">{{ row.cmd }}</span></span
                    >
                  </p>
                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
                </template>

                <button
                  type="button"
                  class="hero-term__open"
                  aria-label="Ouvrir le terminal interactif"
                  @click="openTerminal"
                >
                  <span class="prm"
                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
                    ><span class="prm__caret" aria-hidden="true"
                  /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow">// ce que je fais</p>
        <h2 class="section__title">Trois façons de travailler ensemble</h2>
        <div class="grid-3">
          <ZCard
            v-for="service in services"
            :key="service.id"
            class="offer"
            interactive
            :accent="service.featured"
            :featured="service.featured"
          >
            <div class="offer__icon"><ZIcon :name="service.icon" /></div>
            <h3 class="offer__title">{{ service.title }}</h3>
            <p class="offer__desc">{{ service.desc }}</p>
            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
              En savoir plus →
            </NuxtLink>
          </ZCard>
        </div>
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

        <p class="eyebrow">// projets sélectionnés</p>
        <div class="grid-2 projects">
          <ZCard
            v-for="project in projects"
            :key="project.url"
            class="project"
            interactive
            as="a"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="project__head">
              <h3 class="project__name">{{ project.name }}</h3>
              <span class="project__role">{{ project.role }}</span>
            </div>
            <p class="prose project__desc">{{ project.desc }}</p>
            <div class="hero__tags">
              <ZTag v-for="tag in project.tags" :key="tag">{{ tag }}</ZTag>
            </div>
            <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
          </ZCard>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
import { NuxtLink } from "#components";
import { useTerminal } from "~/composables/useTerminal";
import { SITE } from "~/data/site";

// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];

// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
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

// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.

2026-09-13T07:36:01.297560Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,260p' app/components/ui/ZButton.vue" in /Users/simon/dev/jouan.ovh
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

exec
/bin/zsh -lc "sed -n '582,640p' docs/planning-artifacts/epics.md; sed -n '30,85p' docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
### Story 10.2: A11y sémantique résiduelle (home / services / contact)

As a visiteur utilisant un lecteur d'écran,
I want une sémantique de titres, de listes et de régions cohérente sur toutes les pages,
So that la structure du site m'est annoncée correctement (FR12).

**Acceptance Criteria:**

**Given** home, services et la colonne d'infos `/contact`, encore en `<div>`/`<p>` à certains endroits
**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)

### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)

As a visiteur,
I want savoir quand un lien ouvre un nouvel onglet,
So that je ne suis pas désorienté par un changement de contexte (FR13, WCAG G201).

**Acceptance Criteria:**

**Given** les liens `target="_blank"` du site (hexagones sociaux header/footer, cartes projet, liens bio…)
**When** on factorise un helper de lien externe (icône + libellé sr-only « (ouvre dans un nouvel onglet) ») et on l'applique à tous les `_blank`
**Then** chaque lien `_blank` porte `rel="noopener"` + l'indication sr-only via le helper unique (aucune duplication ad hoc)
**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte

### Story 10.4: Validation a11y émulée OS-level et unification forced-colors

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
  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
- [x] Tâche 4 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.

## Dev Notes

### Périmètre & frontières

- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/pages/index.vue`** (UPDATE) — hero eyebrow l.8 (kicker, reste `<p>`), `<h1>` l.9 ; section « ce que je fais » l.69 eyebrow + `<h2 section__title>` l.70 ; section « projets sélectionnés » l.101 (auditer le titre). Grilles offres + projets en `v-for` → `<ul>`/`<li>`. ⚠️ l.110 carte projet a `target="_blank"` + sr-only (story 10.3, ne pas dupliquer ici).
- **`app/pages/services.vue`** (UPDATE) — `.process` (l.50-62) en `<ol>`/`<li>` + `process__num` `aria-hidden` ; grille des 3 offres `v-for` (l.~25) en `<ul>`/`<li>` ; `offer__points` déjà `<ul>` (l.27). Steps proviennent de `const steps` (process 4 temps).
- **`app/pages/contact.vue`** (UPDATE) — `.contact__info` / `.contact__infocard` (l.89-101) : `infoitem__k` (`// email` / `// localisation` / `// disponibilité`) → `<dl>/<dt>/<dd>` + `//` `aria-hidden`. CTA terminal → `aria-haspopup="dialog"`. Données via `SITE.profile` (`app/data/site.ts`) — ne pas re-hardcoder.
- **`app/assets/scss/base/_layout.scss`** (LECTURE/UPDATE éventuel) — la classe globale `.eyebrow` neutralise déjà le style d'un `<h2>`. Si un reset de liste générique manque, l'ajouter au partiel global, pas en scoped (convention 5.1).

### Pièges / régressions à éviter

- **Rendu strictement identique** : tout changement de balise doit neutraliser le style UA (h2 → hérite `font-weight`/`line-height` via `.eyebrow` ; ol/ul → `list-style: none; margin: 0; padding: 0`). Vérif à l'œil (A1), pas seulement au code.
- **Ne pas toucher** : le `target="_blank"`/sr-only (story 10.3), le SEO (10.5), les états/motion (9.x/10.4). Ne pas casser le `v-for :key`.
- **Eyebrow = kicker vs ouverture de section** : ne pas transformer mécaniquement TOUS les eyebrows en `<h2>` — seuls ceux qui ouvrent une section **sans** titre propre. Un eyebrow au-dessus d'un `<h1>`/`<h2>` existant reste `<p>` (sinon doublon de titre).
- **Prerender (NFR4)** : pur markup, safe. **pnpm + Docker** pour toute commande.
- **Contraste `//`** : si `//` passe en pseudo-élément, garder le token de couleur (pas de hardcode).

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **diff visuel** (rendu identique) et **arbre d'accessibilité** (Chrome DevTools MCP) desktop + mobile : outline titres, listes annoncées, `//` non lu, `aria-haspopup` présent. [Source: project-context.md#Tests, #Vérif visuelle avant revue]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.2 (FR12)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #1 titres/listes, #3 sémantique /contact) ; revues 4.2, 5.2, 6.1, 7.2]
- [Source: docs/project-context.md#Accessibilité (convention titres/listes 5.2), #Vérif visuelle avant revue]
- [Source: app/pages/index.vue, app/pages/services.vue, app/pages/contact.vue, app/assets/scss/base/_layout.scss, app/data/site.ts]

## Dev Agent Record

### Agent Model Used

- Gemini 3.7 Flash (Low)

### Debug Log References

- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).

### Completion Notes List

- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.

exec
/bin/zsh -lc 'git diff --no-index -- /dev/null docs/implementation-artifacts/code-reviews/10-2/full.diff >/dev/null; rg -n "''^diff --git|''^'"\\+.*(aria|<ul|<ol|<dl|<dt|<dd|font-weight|line-height|margin: 0|padding: 0|list-style)\" docs/implementation-artifacts/code-reviews/10-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:diff --git a/app/assets/scss/base/_layout.scss b/app/assets/scss/base/_layout.scss
9:+// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
14:+  font-weight: var(--fw-regular);
15:+  line-height: inherit;
19:diff --git a/app/pages/contact.vue b/app/pages/contact.vue
39:+              <dl class="contact__infolist">
41:+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
42:+                  <dd class="infoitem__v">
47:+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
48:+                  <dd class="infoitem__v">{{ contact.city }}</dd>
51:+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
52:+                  <dd class="infoitem__v">
65:+              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
74:+  margin: 0;
75:+  padding: 0;
85:+  font-weight: var(--fw-regular);
92:+  margin: 0;
96:diff --git a/app/pages/index.vue b/app/pages/index.vue
107:+            <ul class="hero__tags">
136:+        <ul class="grid-3">
142:+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
179:+        <ul class="grid-2 projects">
187:+              <ul class="hero__tags">
203:+  margin: 0;
204:+  padding: 0;
205:+  list-style: none;
213:+  margin: 0;
214:+  padding: 0;
215:+  list-style: none;
219:diff --git a/app/pages/services.vue b/app/pages/services.vue
260:+        <ul class="grid-3">
269:+              <ul class="offer__points">
279:+                  :variant="offer.featured ? 'primary' : 'secondary'"
280:+                  :aria-label="`Discuter du projet — ${offer.title}`"
299:+        <ol class="process">
301:+            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
315:+  margin: 0;
316:+  padding: 0;
317:+  list-style: none;
325:+  margin: 0;
326:+  padding: 0;
327:+  list-style: none;
331:diff --git a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
361:+  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
362:+  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
363:+- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
364:+  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
365:+  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
366:+- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
367:+  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
368:+  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
387:+- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.
389:+  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
391:+  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS (`margin: 0; padding: 0; list-style: none`).
393:+  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS.
394:+  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
396:+  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
397:+  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash" par les lecteurs d'écran.
399:+  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.
409:diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml

exec
/bin/zsh -lc "git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/pages/contact.vue | sed -n '80,145p'; git show 3e82045b8f9bc18ad3d9520db0c18ad3d9520db0c18dbd9ad307c2:app/pages/services.vue 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

              <p class="contact__rgpd">
                En envoyant ce formulaire, vos nom, email et message sont transmis via Web3Forms à seule fin de traiter
                votre demande.
              </p>
            </form>
          </div>

          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
          <div class="contact__info">
            <!-- Carte infos : email / localisation / disponibilité -->
            <ZCard class="contact__infocard">
              <div class="infoitem">
                <div class="infoitem__k">// email</div>
                <a class="infoitem__v contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
              </div>
              <div class="infoitem">
                <div class="infoitem__k">// localisation</div>
                <div class="infoitem__v">{{ contact.city }}</div>
              </div>
              <div class="infoitem">
                <div class="infoitem__k">// disponibilité</div>
                <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
              </div>
            </ZCard>

            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
            <ZCard class="contact__term">
              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
              <p class="contact__prompt" aria-hidden="true">
                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
              </p>
              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
              <ZButton variant="terminal" size="sm" @click="openTerminal">
                <template #icon><ZIcon name="terminal" /></template>
                Ouvrir le terminal
              </ZButton>
            </ZCard>

            <!-- Hexagones sociaux (composant partagé avec le footer) -->
            <LinkListComponent />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
import { nextTick } from "vue";
import { SITE } from "~/data/site";

// Infos de contact — source unique `app/data/site.ts`.
const contact = SITE.profile;

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
const { open: openTerminal } = useTerminal();

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;

2026-09-13T07:36:12.220403Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '350,415p' app/pages/contact.vue; sed -n '420,565p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
  color: var(--term-green);
}

.contact__sent-text {
  margin: 0;
  font-size: var(--fs-sm);
}

// ============================================================
//  Colonne droite (story 7.2) : infos / CTA terminal / socials
// ============================================================
// Colonne (porté de kit.css : .contact__info — flex column).
.contact__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

// ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
.contact__infolist {
  margin: 0;
  padding: 0;
}

.infoitem {
  font-family: var(--font-mono);

  &:not(:last-child) {
    margin-bottom: var(--space-5);
  }
}

.infoitem__k {
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.infoitem__v {
  margin: 0;
  font-size: var(--fs-md);
  color: var(--text-strong);
}

// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
.contact__email {
  text-decoration: none;
  color: var(--term-blue);

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.contact__avail {
  margin-top: var(--space-2);
}
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--prompt);

  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
  animation: caret-blink 1s steps(1) infinite;
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
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);
  margin-bottom: var(--space-4);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
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
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__more {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

// ---- Stats (porté de .statrow / .stat) ----
.statrow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);

  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
  margin-bottom: var(--space-12);
}

.stat {
  font-family: var(--font-mono);

  b {
    display: block;
    font-size: var(--fs-4xl);
    font-weight: var(--fw-light);
    color: var(--text-strong);
  }

  span {
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
}

// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

.projects {
  margin-top: var(--space-5);
}

// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
.project {
  text-decoration: none;
}

.project__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.project__name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.project__role {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
}


exec
/bin/zsh -lc "rg -n \"<ul|<ol|<dl|<dt|<dd|class=\\\"eyebrow\" app/pages/index.vue app/pages/services.vue app/pages/contact.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/services.vue:6:        <p class="eyebrow">// services</p>
app/pages/services.vue:13:        <ul class="grid-3">
app/pages/services.vue:22:              <ul class="offer__points">
app/pages/services.vue:48:        <p class="eyebrow">// comment ça se passe</p>
app/pages/services.vue:51:        <ol class="process">
app/pages/contact.vue:8:            <p class="eyebrow">// contact</p>
app/pages/contact.vue:92:              <dl class="contact__infolist">
app/pages/contact.vue:94:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
app/pages/contact.vue:95:                  <dd class="infoitem__v">
app/pages/contact.vue:100:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
app/pages/contact.vue:101:                  <dd class="infoitem__v">{{ contact.city }}</dd>
app/pages/contact.vue:104:                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
app/pages/contact.vue:105:                  <dd class="infoitem__v">
app/pages/index.vue:8:            <p class="eyebrow">// développeur web freelance</p>
app/pages/index.vue:18:            <ul class="hero__tags">
app/pages/index.vue:71:        <p class="eyebrow">// ce que je fais</p>
app/pages/index.vue:73:        <ul class="grid-3">
app/pages/index.vue:98:        <h2 class="eyebrow">// projets sélectionnés</h2>
app/pages/index.vue:99:        <ul class="grid-2 projects">
app/pages/index.vue:107:              <ul class="hero__tags">

exec
/bin/zsh -lc "sed -n '1,130p' app/assets/scss/base/_layout.scss; sed -n '150,235p' app/pages/services.vue; sed -n '235,320p' app/pages/services.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Primitives de layout du design system — GLOBALES
//
//  .section / .section--sunken / .container / .eyebrow / .prose
//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
//  à l'identique en <style scoped> dans chaque page (index, services,
//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
// ============================================================

/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */

// Bloc de section vertical. padding-block uniquement : le gutter
// horizontal vient de .container (enfant) — évite le conflit de
// shorthand padding multi-axes (cf. project-context, piège story 3.1).
.section {
  padding-block: var(--space-16);
}

// Section en creux : fond teinté + filets haut/bas.
.section--sunken {
  background: var(--bg-sunken);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

// Conteneur centré à largeur max ; gutter horizontal en longhand.
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

// Sur-titre mono en capitales espacées, accent orange.
// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: inherit;
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--accent);
}

// Variante discrète (sur-titre secondaire, ex. « // stack »).
.eyebrow--muted {
  color: var(--text-muted);
}

// Texte long-forme : Ubuntu sans, interligne détendu.
.prose {
  font-family: var(--font-sans);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
.post__meta {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
  color: var(--text-muted);
}
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- En-tête (porté de Services.jsx L13-21) ----
.services__title {
  max-width: 16ch;
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

.services__intro {
  max-width: 60ch;
  margin-bottom: var(--space-10);
  color: var(--text-muted);
}

// ---- Grille des offres (porté de kit.css : .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

// `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
// `margin-top: auto`, alignant les pieds de carte sur des hauteurs inégales.
.offer {
  display: flex;
  flex-direction: column;
}

.offer__badge {
  margin-bottom: var(--space-3);
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);
  margin-bottom: var(--space-4);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
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
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__points {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding: var(--space-1) 0 var(--space-1) var(--space-5);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }

  // Puce fléchée « → » (porté de kit.css .offer li::before).
  // Puce fléchée « → » (porté de kit.css .offer li::before).
  li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }
}

.offer__price {
  // `margin-top: auto` colle le prix (et le CTA qui suit) au bas de la carte ;
  // `padding-top` reprend l'inline JSX (space-5) au lieu du margin-top du kit.
  margin-top: auto;
  padding-top: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  b {
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }
}

.offer__cta {
  margin-top: var(--space-4);
}

// Bouton CTA en pleine largeur (porté de l'inline `width: 100%` du JSX).
.offer__btn {
  width: 100%;
}

// ---- Section process (porté de Services.jsx L45-61) ----
.process__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.process__num {
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-light);
  color: var(--accent);
}

.process__step-title {
  margin: var(--space-2) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.process__desc {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.process__cta {
  margin-top: var(--space-12);
  text-align: center;
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .grid-3,
  .process {
    grid-template-columns: 1fr;
  }
}
</style>

2026-09-13T07:36:39.876817Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n -C 3 "body|line-height|--lh|--fw-regular|h1|h2|h3|ul|ol|dl|dt|dd" app/assets/scss/base app/assets/scss/abstract app/assets/scss/main.scss | head -260' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/assets/scss/main.scss-6-@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/assets/scss/main.scss-7-
app/assets/scss/main.scss-8-.fixed-height {
app/assets/scss/main.scss:9:  width: auto;
app/assets/scss/main.scss-10-  height: 100%;
app/assets/scss/main.scss-11-}
app/assets/scss/main.scss-12-
--
app/assets/scss/base/_motion.scss-8-// et tout ajout futur, sans avoir à y penser au cas par cas.
app/assets/scss/base/_motion.scss-9-//
app/assets/scss/base/_motion.scss-10-// EXCEPTION (DS / CAP-11) — le caret du terminal est la SEULE boucle autorisée :
app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
app/assets/scss/base/_motion.scss-12-//    piloté par CSS → intact ici ;
app/assets/scss/base/_motion.scss-13-//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
app/assets/scss/base/_motion.scss-14-//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
app/assets/scss/base/_motion.scss-15-//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
app/assets/scss/base/_motion.scss-16-//
app/assets/scss/base/_motion.scss-17-// DÉROGATION « valeurs en dur » (règle SCSS projet) — les durées `0.01ms` / `0ms`
app/assets/scss/base/_motion.scss:18:// ci-dessous sont volontairement littérales : c'est la recette a11y standard de
app/assets/scss/base/_motion.scss-19-// neutralisation du mouvement (quasi-instantané, sans casser les callbacks
app/assets/scss/base/_motion.scss:20:// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
app/assets/scss/base/_motion.scss-21-// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
app/assets/scss/base/_motion.scss-22-
app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
app/assets/scss/base/_motion.scss-24-@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss-25-  *,
app/assets/scss/base/_motion.scss-26-  *::before,
--
app/assets/scss/base/_motion.scss-29-    animation-iteration-count: 1 !important;
app/assets/scss/base/_motion.scss-30-    transition-duration: 0.01ms !important;
app/assets/scss/base/_motion.scss-31-    transition-delay: 0ms !important;
app/assets/scss/base/_motion.scss:32:    scroll-behavior: auto !important;
app/assets/scss/base/_motion.scss-33-  }
app/assets/scss/base/_motion.scss-34-
app/assets/scss/base/_motion.scss-35-  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
--
app/assets/scss/abstract/_color.scss:1:@use "color/blue" as _blue;
app/assets/scss/abstract/_color.scss:2:@use "color/red" as _red;
app/assets/scss/abstract/_color.scss:3:@use "color/yellow" as _yellow;
app/assets/scss/abstract/_color.scss:4:@use "color/green" as _green;
app/assets/scss/abstract/_color.scss:5:@use "color/gray" as _gray;
app/assets/scss/abstract/_color.scss:6:@use "color/gray_dark" as _gray_dark;
app/assets/scss/abstract/_color.scss:7:@use "color/orange" as _orange;
app/assets/scss/abstract/_color.scss:8:@use "color/pink_dark" as _pinkDark;
app/assets/scss/abstract/_color.scss-9-
app/assets/scss/abstract/_color.scss:10:/* https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale */
app/assets/scss/abstract/_color.scss-11-
app/assets/scss/abstract/_color.scss-12-// Use Cases
app/assets/scss/abstract/_color.scss-13-// There are 12 steps in each scale. Each step was designed for at least one specific use case.
--
app/assets/scss/abstract/_color.scss-24-// 6               Subtle borders and separators
app/assets/scss/abstract/_color.scss-25-// 7               UI element border and focus rings
app/assets/scss/abstract/_color.scss-26-// 8               Hovered UI element border
app/assets/scss/abstract/_color.scss:27:// 9               Solid backgrounds
app/assets/scss/abstract/_color.scss:28:// 10              Hovered solid backgrounds
app/assets/scss/abstract/_color.scss-29-// 11              Low-contrast text
app/assets/scss/abstract/_color.scss-30-// 12              High-contrast text
app/assets/scss/abstract/_color.scss-31-
--
app/assets/scss/abstract/_color.scss-43-// * Canvas area background
app/assets/scss/abstract/_color.scss-44-//
app/assets/scss/abstract/_color.scss-45-// You may want to use white for your app background in light mode,
app/assets/scss/abstract/_color.scss:46:// and Step 1 or 2 from a gray or coloured scale in dark mode.
app/assets/scss/abstract/_color.scss:47:// In this case, set up a mutable alias for AppBg and map it to a different color for each color mode.
app/assets/scss/abstract/_color.scss-48-
app/assets/scss/abstract/_color.scss-49-// Steps 3–5: Component backgrounds
app/assets/scss/abstract/_color.scss-50-// ============================================================================
--
app/assets/scss/abstract/_color.scss-53-// * Step 4 is for hover states.
app/assets/scss/abstract/_color.scss-54-// * Step 5 is for pressed or selected states.
app/assets/scss/abstract/_color.scss-55-//
app/assets/scss/abstract/_color.scss:56:// Even if your component has a transparent background in its default state,
app/assets/scss/abstract/_color.scss:57:// you should skip Step 3 and use Step 4 for its hover state.
app/assets/scss/abstract/_color.scss-58-//
app/assets/scss/abstract/_color.scss:59:// For call-to-action components that you want to draw particular attention to,
app/assets/scss/abstract/_color.scss:60:// you can bump each color one step higher to steps 4, 5, and 6.
app/assets/scss/abstract/_color.scss-61-//
app/assets/scss/abstract/_color.scss:62:// For complex components where you need many subtle colors to communicate different meanings,
app/assets/scss/abstract/_color.scss-63-// you can get creative and do something like:
app/assets/scss/abstract/_color.scss-64-// * Step 3 for hovered backgrounds.
app/assets/scss/abstract/_color.scss-65-// * Step 4 for selected / pressed backgrounds.
--
app/assets/scss/abstract/_color.scss-77-// * Step 7 is designed for borders on interactive components, but can also be used for focus rings.
app/assets/scss/abstract/_color.scss-78-// * Step 8 is designed for borders on interactive components in their hover state.
app/assets/scss/abstract/_color.scss-79-
app/assets/scss/abstract/_color.scss:80:// Steps 9–10: Solid backgrounds
app/assets/scss/abstract/_color.scss-81-// ============================================================================
app/assets/scss/abstract/_color.scss:82:// Steps 9 and 10 are designed for solid backgrounds.
app/assets/scss/abstract/_color.scss-83-// Step 9 has the highest chroma of all steps in the scale.
app/assets/scss/abstract/_color.scss-84-// In other words, it's the purest step, the step mixed with the least amount of white or black.
app/assets/scss/abstract/_color.scss-85-// Because 9 is the purest step, it has a wide range of applications:
--
app/assets/scss/abstract/_color.scss-89-// * Component backgrounds
app/assets/scss/abstract/_color.scss-90-// * Graphics/Logos
app/assets/scss/abstract/_color.scss-91-// * Overlays
app/assets/scss/abstract/_color.scss:92:// * Coloured shadows
app/assets/scss/abstract/_color.scss-93-// * Accent borders
app/assets/scss/abstract/_color.scss-94-//
app/assets/scss/abstract/_color.scss-95-// Step 10 is designed for component hover states, where step 9 is the component's normal state background.
app/assets/scss/abstract/_color.scss:96:// Most step 9 colors are designed for white foreground text. Sky, Mint, Lime, Yellow,
app/assets/scss/abstract/_color.scss-97-// and Amber are designed for black foreground text and steps 9 and 10.
app/assets/scss/abstract/_color.scss-98-
app/assets/scss/abstract/_color.scss-99-// Steps 11–12: Text
--
app/assets/scss/abstract/_color.scss-102-// * Step 11 is designed for low-contrast text.
app/assets/scss/abstract/_color.scss-103-// * Step 12 is designed for high-contrast text.
app/assets/scss/abstract/_color.scss-104-
app/assets/scss/abstract/_color.scss:105:$black: _gray.$color-20;
app/assets/scss/abstract/_color.scss:106:$white: _gray.$color-0;
app/assets/scss/abstract/_color.scss:107:$gray-0: _gray.$color-0;
app/assets/scss/abstract/_color.scss:108:$gray-1: _gray.$color-0-5;
app/assets/scss/abstract/_color.scss:109:$gray-2: _gray.$color-1;
app/assets/scss/abstract/_color.scss:110:$gray-3: _gray.$color-8;
app/assets/scss/abstract/_color.scss:111:$gray-4: _gray.$color-13;
app/assets/scss/abstract/_color.scss:112:$gray-5: _gray.$color-17;
app/assets/scss/abstract/_color.scss:113:$gray-6: _gray.$color-20;
app/assets/scss/abstract/_color.scss-114-$background: $gray-0;
app/assets/scss/abstract/_color.scss-115-$background-hover: $gray-1;
app/assets/scss/abstract/_color.scss-116-$border: $gray-2;
--
app/assets/scss/abstract/_color.scss-133-$dark-shapes-active: $dark-text-hover;
app/assets/scss/abstract/_color.scss-134-
app/assets/scss/abstract/_color.scss-135-// Accent
app/assets/scss/abstract/_color.scss:136:// Colors you can use to distinguish elements between them such as tags.
app/assets/scss/abstract/_color.scss:137:// For now there is X colors because we think it is enough
app/assets/scss/abstract/_color.scss-138-// and avoid too much confusions.
app/assets/scss/abstract/_color.scss-139-// ============================================================================
app/assets/scss/abstract/_color.scss-140-$red: _red.$red11;
--
app/assets/scss/abstract/_color.scss-143-$orange: _orange.$orange10;
app/assets/scss/abstract/_color.scss-144-
app/assets/scss/abstract/_color.scss-145-// Semantics
app/assets/scss/abstract/_color.scss:146:// Colors that help identify status,
app/assets/scss/abstract/_color.scss-147-// see actions, locate help, and understand next steps.
app/assets/scss/abstract/_color.scss-148-// ============================================================================
app/assets/scss/abstract/_color.scss-149-$alert: $red;
app/assets/scss/abstract/_color.scss-150-$success: _green.$green10;
app/assets/scss/abstract/_color.scss:151:$mark-color-background: _yellow.$yellow3;
app/assets/scss/abstract/_color.scss-152-
app/assets/scss/abstract/_color.scss-153-// Neutrals & Overlays
app/assets/scss/abstract/_color.scss-154-// They are essential for a perfect visual interface.
app/assets/scss/abstract/_color.scss-155-
app/assets/scss/abstract/_color.scss:156:// Please note that Neutrals and Overlays should be influenced
app/assets/scss/abstract/_color.scss:157:// by your Primary Color.
app/assets/scss/abstract/_color.scss-158-
app/assets/scss/abstract/_color.scss-159-// This is why we can't provide Neutral and Overlay palettes
app/assets/scss/abstract/_color.scss-160-// As Neutrals have more usages in our interfaces,
--
app/assets/scss/base/_layout.scss-10-
app/assets/scss/base/_layout.scss-11-/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */
app/assets/scss/base/_layout.scss-12-
app/assets/scss/base/_layout.scss:13:// Bloc de section vertical. padding-block uniquement : le gutter
app/assets/scss/base/_layout.scss-14-// horizontal vient de .container (enfant) — évite le conflit de
app/assets/scss/base/_layout.scss:15:// shorthand padding multi-axes (cf. project-context, piège story 3.1).
app/assets/scss/base/_layout.scss-16-.section {
app/assets/scss/base/_layout.scss:17:  padding-block: var(--space-16);
app/assets/scss/base/_layout.scss-18-}
app/assets/scss/base/_layout.scss-19-
app/assets/scss/base/_layout.scss-20-// Section en creux : fond teinté + filets haut/bas.
app/assets/scss/base/_layout.scss-21-.section--sunken {
app/assets/scss/base/_layout.scss-22-  background: var(--bg-sunken);
app/assets/scss/base/_layout.scss:23:  border-top: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss:24:  border-bottom: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss-25-}
app/assets/scss/base/_layout.scss-26-
app/assets/scss/base/_layout.scss-27-// Conteneur centré à largeur max ; gutter horizontal en longhand.
app/assets/scss/base/_layout.scss-28-.container {
app/assets/scss/base/_layout.scss:29:  width: 100%;
app/assets/scss/base/_layout.scss:30:  max-width: var(--container-xl);
app/assets/scss/base/_layout.scss-31-  margin: 0 auto;
app/assets/scss/base/_layout.scss:32:  padding-inline: var(--space-6);
app/assets/scss/base/_layout.scss-33-}
app/assets/scss/base/_layout.scss-34-
app/assets/scss/base/_layout.scss-35-// Sur-titre mono en capitales espacées, accent orange.
app/assets/scss/base/_layout.scss:36:// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
app/assets/scss/base/_layout.scss-37-.eyebrow {
app/assets/scss/base/_layout.scss-38-  margin: 0 0 var(--space-3);
app/assets/scss/base/_layout.scss-39-  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss-40-  font-size: var(--fs-xs);
app/assets/scss/base/_layout.scss:41:  font-weight: var(--fw-regular);
app/assets/scss/base/_layout.scss:42:  line-height: inherit;
app/assets/scss/base/_layout.scss-43-  letter-spacing: var(--ls-wider);
app/assets/scss/base/_layout.scss-44-  text-transform: uppercase;
app/assets/scss/base/_layout.scss:45:  color: var(--accent);
app/assets/scss/base/_layout.scss-46-}
app/assets/scss/base/_layout.scss-47-
app/assets/scss/base/_layout.scss-48-// Variante discrète (sur-titre secondaire, ex. « // stack »).
app/assets/scss/base/_layout.scss-49-.eyebrow--muted {
app/assets/scss/base/_layout.scss:50:  color: var(--text-muted);
app/assets/scss/base/_layout.scss-51-}
app/assets/scss/base/_layout.scss-52-
app/assets/scss/base/_layout.scss-53-// Texte long-forme : Ubuntu sans, interligne détendu.
app/assets/scss/base/_layout.scss-54-.prose {
app/assets/scss/base/_layout.scss-55-  font-family: var(--font-sans);
app/assets/scss/base/_layout.scss:56:  line-height: var(--lh-relaxed);
app/assets/scss/base/_layout.scss:57:  color: var(--text-body);
app/assets/scss/base/_layout.scss-58-}
app/assets/scss/base/_layout.scss-59-
app/assets/scss/base/_layout.scss-60-// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
app/assets/scss/base/_layout.scss:61:// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
app/assets/scss/base/_layout.scss-62-.hero__tags {
app/assets/scss/base/_layout.scss-63-  display: flex;
app/assets/scss/base/_layout.scss-64-  flex-wrap: wrap;
app/assets/scss/base/_layout.scss-65-  gap: var(--space-2);
app/assets/scss/base/_layout.scss-66-  margin: 0;
app/assets/scss/base/_layout.scss:67:  padding: 0;
app/assets/scss/base/_layout.scss-68-  list-style: none;
app/assets/scss/base/_layout.scss-69-}
app/assets/scss/base/_layout.scss-70-
--
app/assets/scss/base/_layout.scss-79-
app/assets/scss/base/_layout.scss-80-  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
app/assets/scss/base/_layout.scss-81-  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/base/_layout.scss:82:  color: var(--text-muted);
app/assets/scss/base/_layout.scss-83-}
--
app/assets/scss/abstract/_root.scss-3-//  Porté depuis docs/design_system/tokens/*.css (dark-first,
app/assets/scss/abstract/_root.scss-4-//  héritage Ubuntu/terminal : orange + aubergine).
app/assets/scss/abstract/_root.scss-5-//
app/assets/scss/abstract/_root.scss:6://  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
app/assets/scss/abstract/_root.scss-7-//  motion ne doit être hardcodée dans un composant. Tout passe
app/assets/scss/abstract/_root.scss-8-//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
app/assets/scss/abstract/_root.scss-9-//
app/assets/scss/abstract/_root.scss-10-//  Les valeurs sont reproduites à l'identique des tokens source
app/assets/scss/abstract/_root.scss:11://  (notation couleur normalisée par Stylelint : hsl angle/%).
app/assets/scss/abstract/_root.scss-12-// ============================================================
app/assets/scss/abstract/_root.scss-13-
app/assets/scss/abstract/_root.scss-14-:root {
--
app/assets/scss/abstract/_root.scss-21-  --orange-700: hsl(24deg 100% 37%);
app/assets/scss/abstract/_root.scss-22-  --orange-900: hsl(15deg 60% 17%);
app/assets/scss/abstract/_root.scss-23-
app/assets/scss/abstract/_root.scss:24:  // ---- Brand : Aubergine (violet Ubuntu) ----
app/assets/scss/abstract/_root.scss-25-  --aubergine-light: hsl(319deg 26% 70%);
app/assets/scss/abstract/_root.scss-26-  --aubergine: hsl(319deg 33% 30%);
app/assets/scss/abstract/_root.scss-27-  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
--
app/assets/scss/abstract/_root.scss-75-  --bg-input: var(--surface-4);
app/assets/scss/abstract/_root.scss-76-  --bg-terminal: var(--aubergine-deep);
app/assets/scss/abstract/_root.scss-77-  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss-79-  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss-80-  --text-faint: var(--ink-4);
app/assets/scss/abstract/_root.scss-81-  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss:82:  --border-default: var(--line);
app/assets/scss/abstract/_root.scss-83-  --border-strong: var(--line-strong);
app/assets/scss/abstract/_root.scss-84-  --accent: var(--orange-500);
app/assets/scss/abstract/_root.scss-85-  --accent-hover: hsl(24deg 100% 60%);
--
app/assets/scss/abstract/_root.scss-102-  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
app/assets/scss/abstract/_root.scss-103-  --font-display: var(--font-mono);
app/assets/scss/abstract/_root.scss-104-
app/assets/scss/abstract/_root.scss:105:  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
app/assets/scss/abstract/_root.scss-106-  --fs-xs: 0.75rem; // 12
app/assets/scss/abstract/_root.scss-107-  --fs-sm: 0.875rem; // 14
app/assets/scss/abstract/_root.scss-108-  --fs-base: 1rem; // 16
--
app/assets/scss/abstract/_root.scss-117-
app/assets/scss/abstract/_root.scss-118-  // Graisses
app/assets/scss/abstract/_root.scss-119-  --fw-light: 300;

2026-09-13T07:36:51.503860Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg --files app/assets/scss/base | sort | xargs -I{} sh -c 'echo --- {}; sed -n \"1,180p\" \"{}\"' | head -420" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- app/assets/scss/base/_index.scss
@use "reset";
--- app/assets/scss/base/_layout.scss
// ============================================================
//  Primitives de layout du design system — GLOBALES
//
//  .section / .section--sunken / .container / .eyebrow / .prose
//  Portées de docs/design_system/ui_kits/jouan-site/kit.css.
//  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
//  à l'identique en <style scoped> dans chaque page (index, services,
//  about, …). Tokens uniquement — aucune valeur en dur (CAP-2).
// ============================================================

/* stylelint-disable selector-class-pattern -- convention DS BEM (.section--sunken) portée depuis kit.css */

// Bloc de section vertical. padding-block uniquement : le gutter
// horizontal vient de .container (enfant) — évite le conflit de
// shorthand padding multi-axes (cf. project-context, piège story 3.1).
.section {
  padding-block: var(--space-16);
}

// Section en creux : fond teinté + filets haut/bas.
.section--sunken {
  background: var(--bg-sunken);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

// Conteneur centré à largeur max ; gutter horizontal en longhand.
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

// Sur-titre mono en capitales espacées, accent orange.
// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
.eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: inherit;
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--accent);
}

// Variante discrète (sur-titre secondaire, ex. « // stack »).
.eyebrow--muted {
  color: var(--text-muted);
}

// Texte long-forme : Ubuntu sans, interligne détendu.
.prose {
  font-family: var(--font-sans);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
.hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

// Ligne de méta mono discrète, items séparés par « · » (porté de kit.css .post__meta).
// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
.post__meta {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
  color: var(--text-muted);
}
--- app/assets/scss/base/_motion.scss
// ============================================================
//  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
// ============================================================
// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
// les animations d'entrée et les transitions non essentielles sont ramenées à
// l'instantané. Les gardes par composant (ZCard / ZInput / ZTag / index.vue…)
// restent en place et cohérentes ; cette règle couvre le reste (ZButton, etc.)
// et tout ajout futur, sans avoir à y penser au cas par cas.
//
// EXCEPTION (DS / CAP-11) — le caret du terminal est la SEULE boucle autorisée :
//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
//    piloté par CSS → intact ici ;
//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
//
// DÉROGATION « valeurs en dur » (règle SCSS projet) — les durées `0.01ms` / `0ms`
// ci-dessous sont volontairement littérales : c'est la recette a11y standard de
// neutralisation du mouvement (quasi-instantané, sans casser les callbacks
// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.

/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }

  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
  .prm__caret {
    animation: none !important;
  }
}
/* stylelint-enable declaration-no-important, selector-class-pattern */
--- app/assets/scss/base/_reset.scss
@use "../abstract/space";

/*
Normalizing styles have been helped along thanks to the fine work of
Nicolas Gallagher and Jonathan Neal https://necolas.github.io/normalize.css/
 */

/* --------------------------------------------------------------
>>> TABLE OF CONTENTS:
----------------------------------------------------------------
# Generic
	- Normalize
	- Box sizing
# Base
	- Elements
# Components
	- Media
	- Captions
	- Galleries
# plugins
	- Jetpack infinite scroll
# Utilities
	- Accessibility
	- Alignments

-------------------------------------------------------------- */

/* --------------------------------------------------------------
# Generic
-------------------------------------------------------------- */

/* Normalize
--------------------------------------------- */

/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
	 ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */
html {
  font-size: 100%;
  line-height: 1.15;
  text-size-adjust: 100%;
}

/* Sections
	 ========================================================================== */

/**
 * Remove the margin in all browsers.
 */
body {
  margin: 0;
}

/**
 * Render the `main` element consistently in IE.
 */
main {
  display: block;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */
h1 {
  font-size: 2rem;
  margin: 0.67rem 0;
}

/* Grouping content
	 ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */
pre {
  font-family: monospace;
  font-size: 1rem;
}

/* Text-level semantics
	 ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */
a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */
abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  text-decoration: underline dotted;
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */
b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */
code,
kbd,
samp {
  font-family: monospace;
  font-size: 1rem;
}

/**
 * Add the correct font size in all browsers.
 */
small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25rem;
}

sup {
  top: -0.5rem;
}

/* Embedded content
	 ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */
img {
  border-style: none;
}

/* Forms
	 ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

2026-09-13T07:36:54.327305Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n -C 5 "''^h[1-6]|''^p|''^ul|''^ol|''^dl|''^dt|''^dd|margin" app/assets/scss/base/_reset.scss | tail -160' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
189:  margin: 0;
190-}
191-
192-/**
193- * Show the overflow in IE.
194- * 1. Show the overflow in Edge.
--
261-}
262-
263-/**
264- * Add the correct vertical alignment in Chrome, Firefox, and Opera.
265- */
266:progress {
267-  vertical-align: baseline;
268-}
269-
270-/**
271- * Remove the default vertical scrollbar in IE 10+.
--
386-
387-hr {
388-  background-color: #ccc;
389-  border: 0;
390-  height: 1px;
391:  margin-bottom: 1.5rem;
392-}
393-
394:ul,
395:ol {
396-  --reset-ul-space-stack: #{space.$space-stack-16x};
397-  --reset-ul-space-inline: #{space.$space-inline-32x};
398-
399:  margin: 0 0 var(--reset-ul-space-stack) var(--reset-ul-space-inline);
400-}
401-
402:ul {
403-  list-style: disc;
404-}
405-
406:ol {
407-  list-style: decimal;
408-}
409-
410-li > ul,
411-li > ol {
412:  margin-bottom: 0;
413:  margin-left: 1.5rem;
414-}
415-
416:dt {
417-  font-weight: 700;
418-}
419-
420:dd {
421:  margin: 0 1.5rem 1.5rem;
422-}
423-
424-/* Make sure embeds and iframes fit their containers. */
425-embed,
426-iframe,
--
432-  height: auto;
433-  max-width: 100%;
434-}
435-
436-figure {
437:  margin: 1rem 0;
438-}
439-
440-table {
441:  margin: 0 0 1.5rem;
442-  width: 100%;
443-}
444-
445-/* --------------------------------------------------------------
446-# Components
--
450---------------------------------------------- */
451-.page-content .wp-smiley,
452-.entry-content .wp-smiley,
453-.comment-content .wp-smiley {
454-  border: none;
455:  margin-bottom: 0;
456:  margin-top: 0;
457-  padding: 0;
458-}
459-
460-/* Make sure logo link wraps around logo image. */
461-.custom-logo-link {
--
463-}
464-
465-/* Captions
466---------------------------------------------- */
467-.wp-caption {
468:  margin-bottom: 1.5rem;
469-  max-width: 100%;
470-}
471-
472-.wp-caption img[class*="wp-image-"] {
473-  display: block;
474:  margin-left: auto;
475:  margin-right: auto;
476-}
477-
478-.wp-caption .wp-caption-text {
479:  margin: 0.8075rem 0;
480-}
481-
482-.wp-caption-text {
483-  text-align: center;
484-}
485-
486-/* Galleries
487---------------------------------------------- */
488-.gallery {
489:  margin-bottom: 1.5rem;
490-  display: grid;
491-  gap: 1.5rem;
492-}
493-
494-.gallery-item {
--
561-/* Text meant only for screen readers. */
562-.screen-reader-text {
563-  border: 0;
564-  clip-path: inset(50%);
565-  height: 1px;
566:  margin: -1px;
567-  overflow: hidden;
568-  padding: 0;
569-  position: absolute !important;
570-  width: 1px;
571-  overflow-wrap: normal !important;
--
600-.alignleft {
601-  /* rtl:ignore */
602-  float: left;
603-
604-  /* rtl:ignore */
605:  margin-right: 1.5rem;
606:  margin-bottom: 1.5rem;
607-}
608-
609-.alignright {
610-  /* rtl:ignore */
611-  float: right;
612-
613-  /* rtl:ignore */
614:  margin-left: 1.5rem;
615:  margin-bottom: 1.5rem;
616-}
617-
618-.aligncenter {
619-  clear: both;
620-  display: block;
621:  margin-left: auto;
622:  margin-right: auto;
623:  margin-bottom: 1.5rem;
624-}

2026-09-13T07:36:57.878937Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n -C 4 "role=.?dialog|aria-modal|TerminalComponent|openTerminal|useTerminal|terminal" app/components app/composables app/layouts app | head -260' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/composables/useTerminal.ts-1-import { ref } from "vue";
app/composables/useTerminal.ts-2-
app/composables/useTerminal.ts:3:// Lanceur partagé de l'easter-egg terminal.
app/composables/useTerminal.ts-4-//
app/composables/useTerminal.ts-5-// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
app/composables/useTerminal.ts-6-// le `HeaderComponent` ; il n'existe pas d'API globale d'ouverture. Ce registre
app/composables/useTerminal.ts-7-// minimal expose cette ouverture aux autres parties du site (ex. le hero d'accueil
--
app/composables/useTerminal.ts-9-//
app/composables/useTerminal.ts-10-// Le header enregistre son lanceur au montage (`register`), les appelants
app/composables/useTerminal.ts-11-// déclenchent l'ouverture (`open`). Tant qu'aucun lanceur n'est enregistré (ex.
app/composables/useTerminal.ts-12-// au prerender `nuxi generate`, avant hydratation), `open()` est un no-op sûr.
app/composables/useTerminal.ts:13:// La restylisation complète du terminal reste du périmètre d'Epic 8.
app/composables/useTerminal.ts-14-
app/composables/useTerminal.ts-15-type TerminalLauncher = () => void;
app/composables/useTerminal.ts-16-
app/composables/useTerminal.ts-17-const launcher = ref<TerminalLauncher | null>(null);
app/composables/useTerminal.ts-18-
app/composables/useTerminal.ts:19:export function useTerminal() {
app/composables/useTerminal.ts-20-  return {
app/composables/useTerminal.ts-21-    /** Enregistre le lanceur réel (appelé par le header au montage). */
app/composables/useTerminal.ts-22-    register(fn: TerminalLauncher) {
app/composables/useTerminal.ts-23-      launcher.value = fn;
--
app/composables/useTerminal.ts-30-      if (launcher.value === fn) {
app/composables/useTerminal.ts-31-        launcher.value = null;
app/composables/useTerminal.ts-32-      }
app/composables/useTerminal.ts-33-    },
app/composables/useTerminal.ts:34:    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
app/composables/useTerminal.ts-35-    open() {
app/composables/useTerminal.ts-36-      launcher.value?.();
app/composables/useTerminal.ts-37-    },
app/composables/useTerminal.ts-38-  };
--
app/components/HeaderComponent.vue-21-
app/components/HeaderComponent.vue-22-      <div class="hdr__right">
app/components/HeaderComponent.vue-23-        <CurrentTime class="hdr__clock" />
app/components/HeaderComponent.vue-24-        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
app/components/HeaderComponent.vue:26:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue-27-          Terminal
app/components/HeaderComponent.vue-28-        </ZButton>
app/components/HeaderComponent.vue-29-        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue-30-          Démarrer un projet
--
app/components/HeaderComponent.vue-60-        {{ item.label }}
app/components/HeaderComponent.vue-61-      </NuxtLink>
app/components/HeaderComponent.vue-62-
app/components/HeaderComponent.vue-63-      <div class="hdr__menu-actions">
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:65:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue-66-          Terminal
app/components/HeaderComponent.vue-67-        </ZButton>
app/components/HeaderComponent.vue-68-        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/HeaderComponent.vue-69-          Démarrer un projet
app/components/HeaderComponent.vue-70-        </ZButton>
app/components/HeaderComponent.vue-71-      </div>
app/components/HeaderComponent.vue-72-    </nav>
app/components/HeaderComponent.vue-73-
app/components/HeaderComponent.vue:74:    <TerminalManagerComponent ref="terminalManager" />
app/components/HeaderComponent.vue-75-  </header>
app/components/HeaderComponent.vue-76-</template>
app/components/HeaderComponent.vue-77-
app/components/HeaderComponent.vue-78-<script lang="ts" setup>
app/components/HeaderComponent.vue-79-import type { ComponentPublicInstance } from "vue";
app/components/HeaderComponent.vue-80-import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
app/components/HeaderComponent.vue-81-import { NuxtLink } from "#components";
app/components/HeaderComponent.vue:82:import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";
app/components/HeaderComponent.vue-83-
app/components/HeaderComponent.vue-84-const route = useRoute();
app/components/HeaderComponent.vue-85-
app/components/HeaderComponent.vue-86-const navItems = [
--
app/components/HeaderComponent.vue-99-  return route.path === to || route.path.startsWith(`${to}/`);
app/components/HeaderComponent.vue-100-}
app/components/HeaderComponent.vue-101-
app/components/HeaderComponent.vue-102-// --- Terminal easter-egg (préservé) ---
app/components/HeaderComponent.vue:103:const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
app/components/HeaderComponent.vue-104-
app/components/HeaderComponent.vue-105-function addNewTerminal() {
app/components/HeaderComponent.vue:106:  terminalManager.value?.createNewTerminal();
app/components/HeaderComponent.vue-107-}
app/components/HeaderComponent.vue-108-
app/components/HeaderComponent.vue:109:// Expose l'ouverture du terminal au reste du site via le lanceur partagé
app/components/HeaderComponent.vue-110-// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
app/components/HeaderComponent.vue-111-// monté ici ; on enregistre seulement une référence vers sa méthode.
app/components/HeaderComponent.vue:112:const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();
app/components/HeaderComponent.vue-113-
app/components/HeaderComponent.vue-114-// --- Menu mobile accessible ---
app/components/HeaderComponent.vue-115-const menuOpen = ref(false);
app/components/HeaderComponent.vue-116-const firstMenuLink = ref<HTMLElement | null>(null);
--
app/components/HeaderComponent.vue-149-    openMenu();
app/components/HeaderComponent.vue-150-  }
app/components/HeaderComponent.vue-151-}
app/components/HeaderComponent.vue-152-
app/components/HeaderComponent.vue:153:function openTerminalFromMenu() {
app/components/HeaderComponent.vue-154-  addNewTerminal();
app/components/HeaderComponent.vue-155-  closeMenu();
app/components/HeaderComponent.vue-156-}
app/components/HeaderComponent.vue-157-
--
app/pages/blog/[...slug].vue-58-
app/pages/blog/[...slug].vue-59-<script setup lang="ts">
app/pages/blog/[...slug].vue-60-// Vue article du blog (story 6.2) — porté de Blog.jsx (fonction Article) : structure
app/pages/blog/[...slug].vue-61-// .article (760px), en-tête tags/titre/méta/héro, prose Ubuntu sans, blocs de code en
app/pages/blog/[...slug].vue:62:// palette terminale (Shiki désactivé, cf. nuxt.config), CTA de fin. Contenu via
app/pages/blog/[...slug].vue-63-// @nuxt/content v3 (queryCollection + ContentRenderer). Prerender-safe (useAsyncData).
app/pages/blog/[...slug].vue-64-import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue-65-
app/pages/blog/[...slug].vue-66-const route = useRoute();
--
app/pages/blog/[...slug].vue-281-    color: inherit;
app/pages/blog/[...slug].vue-282-    text-decoration: none;
app/pages/blog/[...slug].vue-283-  }
app/pages/blog/[...slug].vue-284-
app/pages/blog/[...slug].vue:285:  // Bloc de code : palette terminale (fond aubergine, mono off-white). Shiki est
app/pages/blog/[...slug].vue-286-  // désactivé → <pre><code> nu, donc pas de styles inline par token à surcharger.
app/pages/blog/[...slug].vue-287-  :deep(pre) {
app/pages/blog/[...slug].vue-288-    margin: 0 0 var(--space-5);
app/pages/blog/[...slug].vue-289-    padding: var(--space-4);
--
app/pages/blog/[...slug].vue-291-    font-family: var(--font-mono);
app/pages/blog/[...slug].vue-292-    font-size: var(--fs-sm);
app/pages/blog/[...slug].vue-293-    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue-294-    color: var(--text-strong);
app/pages/blog/[...slug].vue:295:    background: var(--bg-terminal);
app/pages/blog/[...slug].vue-296-    border: 1px solid var(--border-default);
app/pages/blog/[...slug].vue-297-    border-radius: var(--radius-md);
app/pages/blog/[...slug].vue-298-  }
app/pages/blog/[...slug].vue-299-
app/pages/blog/[...slug].vue:300:  // Code inline = vert terminal ; le code en bloc hérite la couleur du <pre> (off-white).
app/pages/blog/[...slug].vue-301-  :deep(code) {
app/pages/blog/[...slug].vue-302-    font-family: var(--font-mono);
app/pages/blog/[...slug].vue-303-    font-size: 0.92em;
app/pages/blog/[...slug].vue-304-    color: var(--term-green);
--
app/components/terminal/interfaces/IProgram.ts:1:import type { ITerminalConfig } from "~/components/terminal/interfaces/ITerminalConfig";
app/components/terminal/interfaces/IProgram.ts-2-
app/components/terminal/interfaces/IProgram.ts-3-export interface IProgram {
app/components/terminal/interfaces/IProgram.ts-4-  command: string;
app/components/terminal/interfaces/IProgram.ts-5-  description: string;
--
app/pages/contact.vue-84-              </p>
app/pages/contact.vue-85-            </form>
app/pages/contact.vue-86-          </div>
app/pages/contact.vue-87-
app/pages/contact.vue:88:          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
app/pages/contact.vue-89-          <div class="contact__info">
app/pages/contact.vue-90-            <!-- Carte infos : email / localisation / disponibilité -->
app/pages/contact.vue-91-            <ZCard class="contact__infocard">
app/pages/contact.vue-92-              <dl class="contact__infolist">
--
app/pages/contact.vue-108-                </div>
app/pages/contact.vue-109-              </dl>
app/pages/contact.vue-110-            </ZCard>
app/pages/contact.vue-111-
app/pages/contact.vue:112:            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
app/pages/contact.vue-113-            <ZCard class="contact__term">
app/pages/contact.vue:114:              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
app/pages/contact.vue-115-              <p class="contact__prompt" aria-hidden="true">
app/pages/contact.vue-116-                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
app/pages/contact.vue-117-              </p>
app/pages/contact.vue:118:              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
app/pages/contact.vue:119:              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
app/pages/contact.vue:120:                <template #icon><ZIcon name="terminal" /></template>
app/pages/contact.vue:121:                Ouvrir le terminal
app/pages/contact.vue-122-              </ZButton>
app/pages/contact.vue-123-            </ZCard>
app/pages/contact.vue-124-
app/pages/contact.vue-125-            <!-- Hexagones sociaux (composant partagé avec le footer) -->
--
app/pages/contact.vue-132-</template>
app/pages/contact.vue-133-
app/pages/contact.vue-134-<script setup lang="ts">
app/pages/contact.vue-135-// Page Contact — colonne gauche : en-tête + formulaire (story 7.1, envoi Web3Forms,
app/pages/contact.vue:136:// service tiers SANS serveur). Colonne droite : infos + CTA terminal + socials (story 7.2).
app/pages/contact.vue-137-import { nextTick } from "vue";
app/pages/contact.vue-138-import { SITE } from "~/data/site";
app/pages/contact.vue-139-
app/pages/contact.vue-140-// Infos de contact — source unique `app/data/site.ts`.
app/pages/contact.vue-141-const contact = SITE.profile;
app/pages/contact.vue-142-
app/pages/contact.vue:143:// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
app/pages/contact.vue:144:// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
app/pages/contact.vue:145:const { open: openTerminal } = useTerminal();
app/pages/contact.vue-146-
app/pages/contact.vue-147-interface ContactForm {
app/pages/contact.vue-148-  name: string;
app/pages/contact.vue-149-  email: string;
--
app/pages/contact.vue-355-  font-size: var(--fs-sm);
app/pages/contact.vue-356-}
app/pages/contact.vue-357-
app/pages/contact.vue-358-// ============================================================
app/pages/contact.vue:359://  Colonne droite (story 7.2) : infos / CTA terminal / socials
app/pages/contact.vue-360-// ============================================================
app/pages/contact.vue-361-// Colonne (porté de kit.css : .contact__info — flex column).
app/pages/contact.vue-362-.contact__info {
app/pages/contact.vue-363-  display: flex;
--
app/pages/contact.vue-392-  font-size: var(--fs-md);
app/pages/contact.vue-393-  color: var(--text-strong);
app/pages/contact.vue-394-}
app/pages/contact.vue-395-
app/pages/contact.vue:396:// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
app/pages/contact.vue-397-.contact__email {
app/pages/contact.vue-398-  text-decoration: none;
app/pages/contact.vue-399-  color: var(--term-blue);
app/pages/contact.vue-400-
--
app/pages/contact.vue-413-.contact__avail {
app/pages/contact.vue-414-  margin-top: var(--space-2);
app/pages/contact.vue-415-}
app/pages/contact.vue-416-
app/pages/contact.vue:417:// ---- Carte CTA terminal (porté de Contact.jsx : Card .offer fond terminal) ----
app/pages/contact.vue-418-// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
app/pages/contact.vue-419-.contact__info .contact__term {
app/pages/contact.vue:420:  background: var(--bg-terminal);
app/pages/contact.vue-421-  border-color: var(--accent-2-soft);
app/pages/contact.vue-422-}
app/pages/contact.vue-423-
app/pages/contact.vue-424-.contact__prompt {
--
app/components/terminal/interfaces/IProgramManager.ts:1:import type { IProgram } from "~/components/terminal/interfaces/IProgram";
app/components/terminal/interfaces/IProgramManager.ts-2-
app/components/terminal/interfaces/IProgramManager.ts-3-export interface IProgramManager {
app/components/terminal/interfaces/IProgramManager.ts-4-  add(program: IProgram): IProgramManager;
app/components/terminal/interfaces/IProgramManager.ts-5-
--
app/components/HeaderComponent.vue-21-
app/components/HeaderComponent.vue-22-      <div class="hdr__right">
app/components/HeaderComponent.vue-23-        <CurrentTime class="hdr__clock" />
app/components/HeaderComponent.vue-24-        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
app/components/HeaderComponent.vue:26:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue-27-          Terminal
app/components/HeaderComponent.vue-28-        </ZButton>
app/components/HeaderComponent.vue-29-        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue-30-          Démarrer un projet
--
app/components/HeaderComponent.vue-60-        {{ item.label }}
app/components/HeaderComponent.vue-61-      </NuxtLink>
app/components/HeaderComponent.vue-62-
app/components/HeaderComponent.vue-63-      <div class="hdr__menu-actions">
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:65:          <template #icon><ZIcon name="terminal" /></template>
app/components/HeaderComponent.vue-66-          Terminal
app/components/HeaderComponent.vue-67-        </ZButton>
app/components/HeaderComponent.vue-68-        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/HeaderComponent.vue-69-          Démarrer un projet
app/components/HeaderComponent.vue-70-        </ZButton>
app/components/HeaderComponent.vue-71-      </div>
app/components/HeaderComponent.vue-72-    </nav>
app/components/HeaderComponent.vue-73-
app/components/HeaderComponent.vue:74:    <TerminalManagerComponent ref="terminalManager" />
app/components/HeaderComponent.vue-75-  </header>
app/components/HeaderComponent.vue-76-</template>
app/components/HeaderComponent.vue-77-
app/components/HeaderComponent.vue-78-<script lang="ts" setup>

2026-09-13T07:37:05.384710Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -C 6 \"role=|aria-|class=\\\".*terminal|createNewTerminal|isOpen|visible\" app/components/terminal app/components/HeaderComponent.vue | head -360" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/HeaderComponent.vue-3-    <div class="hdr__in">
app/components/HeaderComponent.vue-4-      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
app/components/HeaderComponent.vue-5-        <ZIcon name="gem" class="hdr__logo" />
app/components/HeaderComponent.vue-6-        <b>jouan.ovh</b>
app/components/HeaderComponent.vue-7-      </NuxtLink>
app/components/HeaderComponent.vue-8-
app/components/HeaderComponent.vue:9:      <nav class="hdr__nav" aria-label="Navigation principale">
app/components/HeaderComponent.vue-10-        <NuxtLink
app/components/HeaderComponent.vue-11-          v-for="item in navItems"
app/components/HeaderComponent.vue-12-          :key="item.to"
app/components/HeaderComponent.vue-13-          :to="item.to"
app/components/HeaderComponent.vue-14-          class="hdr__link"
app/components/HeaderComponent.vue-15-          :class="{ 'hdr__link--active': isActive(item.to) }"
app/components/HeaderComponent.vue:16:          :aria-current="isActive(item.to) ? 'page' : undefined"
app/components/HeaderComponent.vue-17-        >
app/components/HeaderComponent.vue-18-          {{ item.label }}
app/components/HeaderComponent.vue-19-        </NuxtLink>
app/components/HeaderComponent.vue-20-      </nav>
app/components/HeaderComponent.vue-21-
app/components/HeaderComponent.vue-22-      <div class="hdr__right">
--
app/components/HeaderComponent.vue-31-        </ZButton>
app/components/HeaderComponent.vue-32-
app/components/HeaderComponent.vue-33-        <button
app/components/HeaderComponent.vue-34-          ref="burgerButton"
app/components/HeaderComponent.vue-35-          class="hdr__burger"
app/components/HeaderComponent.vue-36-          type="button"
app/components/HeaderComponent.vue:37:          :aria-expanded="menuOpen"
app/components/HeaderComponent.vue:38:          aria-controls="hdr-mobile-menu"
app/components/HeaderComponent.vue:39:          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
app/components/HeaderComponent.vue-40-          @click="toggleMenu"
app/components/HeaderComponent.vue-41-        >
app/components/HeaderComponent.vue-42-          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
app/components/HeaderComponent.vue-43-        </button>
app/components/HeaderComponent.vue-44-      </div>
app/components/HeaderComponent.vue-45-    </div>
app/components/HeaderComponent.vue-46-
app/components/HeaderComponent.vue-47-    <!-- Menu mobile -->
app/components/HeaderComponent.vue-48-    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
app/components/HeaderComponent.vue:49:    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
app/components/HeaderComponent.vue-50-      <NuxtLink
app/components/HeaderComponent.vue-51-        v-for="(item, index) in navItems"
app/components/HeaderComponent.vue-52-        :key="item.to"
app/components/HeaderComponent.vue-53-        :ref="(el) => registerFirstLink(el, index)"
app/components/HeaderComponent.vue-54-        :to="item.to"
app/components/HeaderComponent.vue-55-        class="hdr__menu-link"
app/components/HeaderComponent.vue-56-        :class="{ 'hdr__menu-link--active': isActive(item.to) }"
app/components/HeaderComponent.vue:57:        :aria-current="isActive(item.to) ? 'page' : undefined"
app/components/HeaderComponent.vue-58-        @click="closeMenu"
app/components/HeaderComponent.vue-59-      >
app/components/HeaderComponent.vue-60-        {{ item.label }}
app/components/HeaderComponent.vue-61-      </NuxtLink>
app/components/HeaderComponent.vue-62-
app/components/HeaderComponent.vue-63-      <div class="hdr__menu-actions">
--
app/components/HeaderComponent.vue-100-}
app/components/HeaderComponent.vue-101-
app/components/HeaderComponent.vue-102-// --- Terminal easter-egg (préservé) ---
app/components/HeaderComponent.vue-103-const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);
app/components/HeaderComponent.vue-104-
app/components/HeaderComponent.vue-105-function addNewTerminal() {
app/components/HeaderComponent.vue:106:  terminalManager.value?.createNewTerminal();
app/components/HeaderComponent.vue-107-}
app/components/HeaderComponent.vue-108-
app/components/HeaderComponent.vue-109-// Expose l'ouverture du terminal au reste du site via le lanceur partagé
app/components/HeaderComponent.vue-110-// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
app/components/HeaderComponent.vue-111-// monté ici ; on enregistre seulement une référence vers sa méthode.
app/components/HeaderComponent.vue-112-const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();
--
app/components/HeaderComponent.vue-228-    font-size: var(--fs-md);
app/components/HeaderComponent.vue-229-    font-weight: var(--fw-bold);
app/components/HeaderComponent.vue-230-    color: var(--text-strong);
app/components/HeaderComponent.vue-231-  }
app/components/HeaderComponent.vue-232-
app/components/HeaderComponent.vue-233-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-236-    outline-offset: 2px;
app/components/HeaderComponent.vue-237-    border-radius: var(--radius-sm);
app/components/HeaderComponent.vue-238-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-239-  }
app/components/HeaderComponent.vue-240-}
--
app/components/HeaderComponent.vue-261-  &:hover {
app/components/HeaderComponent.vue-262-    color: var(--text-strong);
app/components/HeaderComponent.vue-263-    background: var(--surface-2);
app/components/HeaderComponent.vue-264-  }
app/components/HeaderComponent.vue-265-
app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
app/components/HeaderComponent.vue:267:  &:focus-visible {
app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-269-    outline-offset: 2px;
app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-271-  }
app/components/HeaderComponent.vue-272-}
app/components/HeaderComponent.vue-273-
--
app/components/HeaderComponent.vue-298-  color: var(--text-strong);
app/components/HeaderComponent.vue-299-  cursor: pointer;
app/components/HeaderComponent.vue-300-  background: none;
app/components/HeaderComponent.vue-301-  border: 1px solid var(--border-default);
app/components/HeaderComponent.vue-302-  border-radius: var(--radius-md);
app/components/HeaderComponent.vue-303-
app/components/HeaderComponent.vue:304:  &:focus-visible {
app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-306-    outline-offset: 2px;
app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-308-  }
app/components/HeaderComponent.vue-309-}
app/components/HeaderComponent.vue-310-
--
app/components/HeaderComponent.vue-373-      visibility var(--dur-base);
app/components/HeaderComponent.vue-374-  }
app/components/HeaderComponent.vue-375-
app/components/HeaderComponent.vue-376-  .hdr__menu--open {
app/components/HeaderComponent.vue-377-    transform: translateY(0);
app/components/HeaderComponent.vue-378-    opacity: 1;
app/components/HeaderComponent.vue:379:    visibility: visible;
app/components/HeaderComponent.vue-380-  }
app/components/HeaderComponent.vue-381-}
app/components/HeaderComponent.vue-382-
app/components/HeaderComponent.vue-383-.hdr__menu-link {
app/components/HeaderComponent.vue-384-  padding: var(--space-3);
app/components/HeaderComponent.vue-385-  font-family: var(--font-mono);
--
app/components/HeaderComponent.vue-390-
app/components/HeaderComponent.vue-391-  &:hover {
app/components/HeaderComponent.vue-392-    color: var(--text-strong);
app/components/HeaderComponent.vue-393-    background: var(--surface-2);
app/components/HeaderComponent.vue-394-  }
app/components/HeaderComponent.vue-395-
app/components/HeaderComponent.vue:396:  &:focus-visible {
app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-398-    outline-offset: 2px;
app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue-400-  }
app/components/HeaderComponent.vue-401-}
app/components/HeaderComponent.vue-402-
--
app/components/terminal/interfaces/IProgram.ts-3-export interface IProgram {
app/components/terminal/interfaces/IProgram.ts-4-  command: string;
app/components/terminal/interfaces/IProgram.ts-5-  description: string;
app/components/terminal/interfaces/IProgram.ts-6-  initialData?: string;
app/components/terminal/interfaces/IProgram.ts-7-  run: (
app/components/terminal/interfaces/IProgram.ts-8-    config?: ITerminalConfig,
app/components/terminal/interfaces/IProgram.ts:9:    createNewTerminal?: (config?: ITerminalConfig) => void,
app/components/terminal/interfaces/IProgram.ts-10-    initialData?: string,
app/components/terminal/interfaces/IProgram.ts-11-  ) => string | HTMLElement;
app/components/terminal/interfaces/IProgram.ts-12-}
--
app/components/terminal/programs/About.ts-244-}
app/components/terminal/programs/About.ts-245-
app/components/terminal/programs/About.ts-246-const about: IProgram = {
app/components/terminal/programs/About.ts-247-  command: "about",
app/components/terminal/programs/About.ts-248-  description: "Voulez-vous en savoir plus sur moi ?",
app/components/terminal/programs/About.ts-249-  initialData: new About().parseData(),
app/components/terminal/programs/About.ts:250:  run: (_, createNewTerminal, initialData?: string) => {
app/components/terminal/programs/About.ts:251:    if (createNewTerminal && initialData) {
app/components/terminal/programs/About.ts:252:      createNewTerminal({
app/components/terminal/programs/About.ts-253-        height: "600px",
app/components/terminal/programs/About.ts-254-        width: "800px",
app/components/terminal/programs/About.ts-255-        initialData,
app/components/terminal/programs/About.ts-256-      });
app/components/terminal/programs/About.ts-257-      return "Un nouveau terminal a été ouvert.";
app/components/terminal/programs/About.ts-258-    }
app/components/terminal/programs/About.ts-259-
app/components/terminal/programs/About.ts:260:    if (createNewTerminal) {
app/components/terminal/programs/About.ts:261:      createNewTerminal();
app/components/terminal/programs/About.ts-262-      return "Un nouveau terminal a été ouvert.";
app/components/terminal/programs/About.ts-263-    }
app/components/terminal/programs/About.ts-264-
app/components/terminal/programs/About.ts-265-    return "Impossible d'ouvrir un nouveau terminal.";
app/components/terminal/programs/About.ts-266-  },
app/components/terminal/programs/About.ts-267-};
--
app/components/terminal/programs/NewTerminal.ts-1-import type { IProgram } from "~/components/terminal/interfaces";
app/components/terminal/programs/NewTerminal.ts-2-
app/components/terminal/programs/NewTerminal.ts-3-const newTerminal: IProgram = {
app/components/terminal/programs/NewTerminal.ts-4-  command: "new",
app/components/terminal/programs/NewTerminal.ts-5-  description: "Ouvre un nouveau terminal.",
app/components/terminal/programs/NewTerminal.ts-6-  initialData: "Data dans la nouvelle fenêtre.",
app/components/terminal/programs/NewTerminal.ts:7:  run: (_, createNewTerminal, initialData?: string) => {
app/components/terminal/programs/NewTerminal.ts:8:    if (createNewTerminal && initialData) {
app/components/terminal/programs/NewTerminal.ts:9:      createNewTerminal({ initialData });
app/components/terminal/programs/NewTerminal.ts-10-      return `Nouvelle fenêtre de terminal ouverte avec les données suivantes : ${initialData}`;
app/components/terminal/programs/NewTerminal.ts-11-    }
app/components/terminal/programs/NewTerminal.ts-12-
app/components/terminal/programs/NewTerminal.ts:13:    if (createNewTerminal) {
app/components/terminal/programs/NewTerminal.ts:14:      createNewTerminal();
app/components/terminal/programs/NewTerminal.ts-15-      return "Un nouveau terminal a été ouvert.";
app/components/terminal/programs/NewTerminal.ts-16-    }
app/components/terminal/programs/NewTerminal.ts-17-
app/components/terminal/programs/NewTerminal.ts-18-    return "Impossible d'ouvrir un nouveau terminal.";
app/components/terminal/programs/NewTerminal.ts-19-  },
app/components/terminal/programs/NewTerminal.ts-20-};
--
app/components/terminal/TerminalComponent.vue-4-    `backdrop-filter: blur(10px)`. Un ancêtre filtré devient "backdrop root" et
app/components/terminal/TerminalComponent.vue-5-    neutralise le `backdrop-filter` du corps (le blur DS ne s'applique alors qu'au
app/components/terminal/TerminalComponent.vue-6-    contenu du header, pas à la page). Hors du header, le flou aubergine rend bien.
app/components/terminal/TerminalComponent.vue-7-    Déplacement de rendu uniquement — drag/resize/focus/historique inchangés.
app/components/terminal/TerminalComponent.vue-8-  -->
app/components/terminal/TerminalComponent.vue-9-  <Teleport to="body">
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
app/components/terminal/TerminalComponent.vue:11:      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
app/components/terminal/TerminalComponent.vue:12:        <div class="terminal-dots">
app/components/terminal/TerminalComponent.vue-13-          <div
app/components/terminal/TerminalComponent.vue-14-            class="close-button"
app/components/terminal/TerminalComponent.vue:15:            role="button"
app/components/terminal/TerminalComponent.vue-16-            tabindex="0"
app/components/terminal/TerminalComponent.vue:17:            aria-label="Fermer le terminal"
app/components/terminal/TerminalComponent.vue-18-            @click="closeTerminal"
app/components/terminal/TerminalComponent.vue-19-            @keydown.enter="closeTerminal"
app/components/terminal/TerminalComponent.vue-20-            @keydown.space.prevent="closeTerminal"
app/components/terminal/TerminalComponent.vue-21-          ></div>
app/components/terminal/TerminalComponent.vue:22:          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:23:          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue-24-        </div>
app/components/terminal/TerminalComponent.vue-25-        <div class="header-text">{{ defaultConfig.domainName }}</div>
app/components/terminal/TerminalComponent.vue-26-      </div>
app/components/terminal/TerminalComponent.vue-27-
app/components/terminal/TerminalComponent.vue:28:      <div class="terminal-body">
app/components/terminal/TerminalComponent.vue-29-        <div v-for="(line, index) in commandLines" :key="index">
app/components/terminal/TerminalComponent.vue-30-          <template v-if="line.isResponse">
app/components/terminal/TerminalComponent.vue-31-            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
app/components/terminal/TerminalComponent.vue:32:            <span class="terminal-response" v-html="line.text"></span>
app/components/terminal/TerminalComponent.vue-33-          </template>
app/components/terminal/TerminalComponent.vue-34-          <template v-else>
app/components/terminal/TerminalComponent.vue-35-            <span class="git-prompt"
app/components/terminal/TerminalComponent.vue-36-              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
app/components/terminal/TerminalComponent.vue-37-              <span class="git-prompt-directory">~</span>
app/components/terminal/TerminalComponent.vue-38-              <span class="git-prompt-separator">$</span></span
--
app/components/terminal/TerminalComponent.vue-45-          <span class="git-prompt-separator">$</span></span
app/components/terminal/TerminalComponent.vue-46-        >&nbsp;<input
app/components/terminal/TerminalComponent.vue-47-          ref="userInputRef"
app/components/terminal/TerminalComponent.vue-48-          v-model="userInput"
app/components/terminal/TerminalComponent.vue-49-          type="text"
app/components/terminal/TerminalComponent.vue-50-          class="user-input"
app/components/terminal/TerminalComponent.vue:51:          aria-label="Saisie de commande du terminal"
app/components/terminal/TerminalComponent.vue-52-          @keydown.enter="submitInput"
app/components/terminal/TerminalComponent.vue-53-          @keydown.arrow-up="handleHistoryNavigation"
app/components/terminal/TerminalComponent.vue-54-          @keydown.arrow-down="handleHistoryNavigation"
app/components/terminal/TerminalComponent.vue-55-        />
app/components/terminal/TerminalComponent.vue-56-      </div>
app/components/terminal/TerminalComponent.vue-57-
--
app/components/terminal/TerminalComponent.vue-73-// (props/refs/cycle de vie/handlers identiques). `defineOptions` préserve le nom du composant.
app/components/terminal/TerminalComponent.vue-74-defineOptions({ name: "TerminalComponent" });
app/components/terminal/TerminalComponent.vue-75-
app/components/terminal/TerminalComponent.vue-76-const props = withDefaults(
app/components/terminal/TerminalComponent.vue-77-  defineProps<{
app/components/terminal/TerminalComponent.vue-78-    id?: number;
app/components/terminal/TerminalComponent.vue:79:    createNewTerminal?: (config?: ITerminalConfig) => void;
app/components/terminal/TerminalComponent.vue-80-    terminalConfig?: ITerminalConfig;
app/components/terminal/TerminalComponent.vue-81-  }>(),
app/components/terminal/TerminalComponent.vue-82-  {
app/components/terminal/TerminalComponent.vue-83-    id: 0,
app/components/terminal/TerminalComponent.vue:84:    createNewTerminal: () => {},
app/components/terminal/TerminalComponent.vue-85-    terminalConfig: () => ({}),
app/components/terminal/TerminalComponent.vue-86-  },
app/components/terminal/TerminalComponent.vue-87-);
app/components/terminal/TerminalComponent.vue-88-
app/components/terminal/TerminalComponent.vue-89-const commandLines = ref<{ text: string; isResponse: boolean }[]>([]);
app/components/terminal/TerminalComponent.vue-90-const userInput = ref<string>("");
--
app/components/terminal/TerminalComponent.vue-163-
app/components/terminal/TerminalComponent.vue-164-const runCommand = (command: string): string | HTMLElement => {
app/components/terminal/TerminalComponent.vue-165-  const program = programManager.get(command);
app/components/terminal/TerminalComponent.vue-166-  if (program) {
app/components/terminal/TerminalComponent.vue-167-    return program.run(
app/components/terminal/TerminalComponent.vue-168-      { userName: defaultConfig.value.userName },
app/components/terminal/TerminalComponent.vue:169:      props.createNewTerminal as (config?: ITerminalConfig) => void,
app/components/terminal/TerminalComponent.vue-170-      program.initialData,
app/components/terminal/TerminalComponent.vue-171-    );
app/components/terminal/TerminalComponent.vue-172-  }
app/components/terminal/TerminalComponent.vue-173-  // La commande provient de la saisie utilisateur : on l'échappe car la réponse est rendue via v-html.
app/components/terminal/TerminalComponent.vue-174-  return `Commande inconnue : ${escapeHtml(command)}`;
app/components/terminal/TerminalComponent.vue-175-};
--
app/components/terminal/TerminalComponent.vue-371-      box-shadow: 1px 1px 2px hsl(320deg 60% 2%);
app/components/terminal/TerminalComponent.vue-372-
app/components/terminal/TerminalComponent.vue-373-      &:hover {
app/components/terminal/TerminalComponent.vue-374-        filter: brightness(1.2);
app/components/terminal/TerminalComponent.vue-375-      }
app/components/terminal/TerminalComponent.vue-376-
app/components/terminal/TerminalComponent.vue:377:      // Focus clavier visible (close désormais focusable — a11y CAP-11).
app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
app/components/terminal/TerminalComponent.vue-379-        outline: 2px solid var(--accent);
app/components/terminal/TerminalComponent.vue-380-        outline-offset: 2px;
app/components/terminal/TerminalComponent.vue-381-      }
app/components/terminal/TerminalComponent.vue-382-    }
app/components/terminal/TerminalComponent.vue-383-
app/components/terminal/TerminalComponent.vue-384-    // Pastilles min/max purement décoratives (aucun handler).
--
app/components/terminal/TerminalManagerComponent.vue-1-<template>
app/components/terminal/TerminalManagerComponent.vue-2-  <div>
app/components/terminal/TerminalManagerComponent.vue-3-    <div v-for="(terminal, index) in terminals" :key="index">
app/components/terminal/TerminalManagerComponent.vue-4-      <TerminalComponent
app/components/terminal/TerminalManagerComponent.vue-5-        :id="index"
app/components/terminal/TerminalManagerComponent.vue:6:        :create-new-terminal="createNewTerminal"
app/components/terminal/TerminalManagerComponent.vue-7-        :terminal-config="terminal.terminalConfig"
app/components/terminal/TerminalManagerComponent.vue-8-      />
app/components/terminal/TerminalManagerComponent.vue-9-    </div>
app/components/terminal/TerminalManagerComponent.vue-10-  </div>
app/components/terminal/TerminalManagerComponent.vue-11-</template>
app/components/terminal/TerminalManagerComponent.vue-12-
--
app/components/terminal/TerminalManagerComponent.vue-16-
app/components/terminal/TerminalManagerComponent.vue-17-// Migration Options API → <script setup> (story 8.3) : comportement strictement constant.
app/components/terminal/TerminalManagerComponent.vue-18-defineOptions({ name: "TerminalManagerComponent" });
app/components/terminal/TerminalManagerComponent.vue-19-
app/components/terminal/TerminalManagerComponent.vue-20-const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);
app/components/terminal/TerminalManagerComponent.vue-21-
app/components/terminal/TerminalManagerComponent.vue:22:const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
app/components/terminal/TerminalManagerComponent.vue-23-  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
app/components/terminal/TerminalManagerComponent.vue-24-  const newTerminal = {
app/components/terminal/TerminalManagerComponent.vue-25-    id: uniqueId(),
app/components/terminal/TerminalManagerComponent.vue-26-    terminalConfig,
app/components/terminal/TerminalManagerComponent.vue-27-  };
app/components/terminal/TerminalManagerComponent.vue-28-  terminals.value.push(newTerminal);
app/components/terminal/TerminalManagerComponent.vue-29-};
app/components/terminal/TerminalManagerComponent.vue-30-
app/components/terminal/TerminalManagerComponent.vue-31-// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
app/components/terminal/TerminalManagerComponent.vue-32-// header détient une ref de ce composant et appelle la méthode directement
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
app/components/terminal/TerminalManagerComponent.vue-34-// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
app/components/terminal/TerminalManagerComponent.vue-35-// appeler cette même méthode via sa ref. → on l'expose explicitement.
app/components/terminal/TerminalManagerComponent.vue:36:defineExpose({ createNewTerminal });
app/components/terminal/TerminalManagerComponent.vue-37-</script>
app/components/terminal/TerminalManagerComponent.vue-38-
app/components/terminal/TerminalManagerComponent.vue-39-<style scoped></style>

2026-09-13T07:37:08.513737Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZCard.vue; rg -n \"\\.grid-3|\\.grid-2|\\.process|\\.offer|\\.project\" app/assets app/components | head -180" in /Users/simon/dev/jouan.ovh
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
app/components/FooterComponent.vue:58:const projects = SITE.projects;
app/components/terminal/programs/Projets.ts:10:    const items = SITE.projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");

2026-09-13T07:37:20.269586Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,170p' app/components/ui/ZTag.vue; sed -n '1,80p' app/components/ui/ZBadge.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <span
    v-bind="rootAttrs"
    class="ztag"
    :class="{ 'ztag--plain': !hash, 'ztag--clickable': isClickable }"
    :role="clickableRole"
    :tabindex="clickableTabindex"
    @click="handleClick"
    @keydown.enter="handleKeyboardClick"
    @keydown.space="handleKeyboardClick"
  >
    <slot />
    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
// Primitive tag du DS — chip pill mono avec préfixe "#" orange (techno / sujets).
// Porté de docs/design_system/components/core/Tag.jsx (CSS en <style scoped>, prerender-safe).
// API React → Vue : `onRemove`/`onClick` (callbacks React) deviennent des listeners
// détectés via les attrs (le `×` et l'état cliquable n'apparaissent que si fournis).
import { computed, getCurrentInstance, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Affiche le préfixe "#". @default true */
  hash?: boolean;
}

withDefaults(defineProps<Props>(), {
  hash: true,
});

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent];
  remove: [event: MouseEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

function hasListener(name: "onClick" | "onRemove") {
  const listener = instance?.vnode.props?.[name];
  return typeof listener === "function" || Array.isArray(listener);
}

const isClickable = computed(() => hasListener("onClick"));
const isRemovable = computed(() => hasListener("onRemove"));

const rootAttrs = computed(() => {
  if (!isClickable.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "role" && key !== "tabindex" && key !== "tabIndex";
    }),
  );
});

const clickableRole = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  return typeof attrs.role === "string" ? attrs.role : "button";
});

const clickableTabindex = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  const tabindex = attrs.tabindex ?? attrs.tabIndex;
  return typeof tabindex === "string" || typeof tabindex === "number" ? tabindex : 0;
});

function handleClick(event: MouseEvent) {
  if (!isClickable.value) {
    return;
  }

  emit("click", event);
}

function handleKeyboardClick(event: KeyboardEvent) {
  if (!isClickable.value) {
    return;
  }

  event.preventDefault();
  emit("click", event);
}

function handleRemove(event: MouseEvent) {
  emit("remove", event);
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Tag.jsx */
.ztag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: 26px;
  padding: 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: 1;
  white-space: nowrap;
  color: var(--text-body);
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);

  &::before {
    content: "#";
    color: var(--accent);
  }
}

.ztag--plain::before {
  display: none;
  content: none;
}

.ztag--clickable {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }

  &:focus-visible {
    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.ztag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: -2px;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-circle);
<template>
  <span class="zbadge" :class="`zbadge--${tone}`">
    <span v-if="dot" class="zbadge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup lang="ts">
// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
// Porté de docs/design_system/components/core/Badge.jsx (CSS en <style scoped>, prerender-safe).

interface Props {
  /** Teinte. @default "neutral" */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  /** Point de statut en tête. @default false */
  dot?: boolean;
}

withDefaults(defineProps<Props>(), {
  tone: "neutral",
  dot: false,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Badge.jsx */
.zbadge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: 22px;
  padding: 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  line-height: 1;
  letter-spacing: var(--ls-wide);
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
}

.zbadge__dot {
  width: 6px;
  height: 6px;
  background: currentcolor;
  border-radius: var(--radius-circle);
}

// Tones — fills doux. Les couleurs de bordure sont des teintes DS dédiées (sans token
// équivalent) : valeurs portées telles quelles de Badge.jsx (tolérées par la story).
.zbadge--neutral {
  background: var(--surface-3);
  color: var(--text-body);
  border-color: var(--border-default);
}

.zbadge--accent {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: hsl(24deg 94% 53% / 30%);
}

.zbadge--success {
  background: var(--success-soft);
  color: var(--success);
  border-color: hsl(143deg 50% 32% / 50%);
}

.zbadge--warning {
  background: var(--warning-soft);
  color: var(--warning);
  border-color: hsl(38deg 70% 32% / 50%);
}

.zbadge--danger {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: hsl(0deg 55% 35% / 50%);

2026-09-13T07:37:31.833972Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
The markup changes largely match the requested semantic conversions. I found two areas needing closer scrutiny: the contact right column remains untitled despite the spec’s explicit structural check, and the claimed validation is only recorded as prose in the story diff. I’m checking the actual project gate and the terminal overlay semantics before finalizing findings.
exec
/bin/zsh -lc 'docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"' in /Users/simon/dev/jouan.ovh
2026-09-13T07:37:52.521172Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T07:37:59.588885Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T07:38:06.883836Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
 succeeded in 15473ms:
 Container jouanovh-web-run-2e4169ad731a Created 
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

[@nuxt/content] ✔ Processed 2 collections and 1 files in 9.11ms (0 cached, 1 parsed)

 WARN  Payload extraction is recommended for full-static output. You can enable it by setting experimental.payloadExtraction to true or 'client'.

│
●  Nitro preset: static
ℹ Building client...
ℹ vite v7.3.5 building client environment for production...

 WARN  [plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help

ℹ transforming...
ℹ ✓ 327 modules transformed.
ℹ rendering chunks...
ℹ computing gzip size...
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-opfs-async-proxy-C_otN2ZJ.js            9.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json                                        31.45 kB │ gzip:   2.46 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Bold.DxtomZAI.ttf                  174.01 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Regular.C0QEQ_U4.ttf               189.00 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-Italic.B29yKq6H.ttf                193.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-worker1-bundler-friendly-Bv6ABw9v.js  196.87 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/UbuntuMono-BoldItalic.TXXgaKQw.ttf            198.23 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3.DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/sqlite3-DBpDb1lf.wasm                         856.45 kB │ gzip: 393.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ProsePre.D5orA6B_.css                           0.03 kB │ gzip:   0.05 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/LinkListComponent.Bm2k_vPP.css                  0.85 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZBadge.BAw1B01J.css                             1.11 kB │ gzip:   0.43 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZCard.C5C9a-aj.css                              1.19 kB │ gzip:   0.47 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZTag.f2Aq6DLg.css                               1.46 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.CILhPoQS.css                              1.65 kB │ gzip:   0.53 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-500.CIKAhgAS.css                          1.91 kB │ gzip:   0.73 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/error-404.BvOk15Jd.css                          2.43 kB │ gzip:   0.86 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/ZButton.CyAD_ftR.css                            2.70 kB │ gzip:   0.84 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/services.CJf1-Mk-.css                           2.77 kB │ gzip:   0.70 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/about.Dl-JotT1.css                              3.78 kB │ gzip:   1.06 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/_...DdRzPo2d.css                                4.30 kB │ gzip:   0.90 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/contact.CJSMvh4z.css                            4.77 kB │ gzip:   1.16 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/index.6ir0DkD4.css                              6.37 kB │ gzip:   1.58 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/default.ojNTd2Et.css                            9.54 kB │ gzip:   2.16 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/entry.CQTEM0lv.css                             10.40 kB │ gzip:   3.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DLr45-pD.js                                     0.17 kB │ gzip:   0.17 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dgp2wKR6.js                                     0.17 kB │ gzip:   0.15 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CMbkxo7c.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C61it82u.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CKQ1uta6.js                                     0.21 kB │ gzip:   0.18 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D-AlFQHs.js                                     0.21 kB │ gzip:   0.18 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/0s6EqXNW.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CE8ENGlt.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BXVkz35Z.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CH3_EhWO.js                                     0.21 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BkFmjRbj.js                                     0.22 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dg1AiWJv.js                                     0.22 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D-tGMpYi.js                                     0.22 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Jqglw7Vl.js                                     0.22 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BzFzYIQQ.js                                     0.22 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BKyzcRoY.js                                     0.23 kB │ gzip:   0.19 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BotiNhCk.js                                     0.33 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bt3sjouG.js                                     0.38 kB │ gzip:   0.27 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BskpSoa0.js                                     0.41 kB │ gzip:   0.25 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BLVGCyQP.js                                     0.46 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/fD70OJnA.js                                     0.49 kB │ gzip:   0.33 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CqfSgz1j.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DSFiRuP1.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BXU8jnqa.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Be95h4L1.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C5qE8RJn.js                                     0.50 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BYnexZMt.js                                     0.51 kB │ gzip:   0.34 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/5RlALd8l.js                                     0.61 kB │ gzip:   0.39 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bvv3qBf4.js                                     0.62 kB │ gzip:   0.37 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/D7Umo3sD.js                                     0.68 kB │ gzip:   0.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Hf4oBiKz.js                                     0.76 kB │ gzip:   0.45 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/C_swmFvz.js                                     1.12 kB │ gzip:   0.63 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Bi3uNhGY.js                                     1.28 kB │ gzip:   0.73 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/323WM9ln.js                                     2.82 kB │ gzip:   1.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/CSJUPGlV.js                                     3.48 kB │ gzip:   1.56 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DpuLL-YT.js                                     3.79 kB │ gzip:   1.70 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BQUb0JNT.js                                     3.82 kB │ gzip:   1.80 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DSvIJn-z.js                                     4.06 kB │ gzip:   1.93 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/5D3O405N.js                                     5.20 kB │ gzip:   2.35 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/akscBp5E.js                                     5.67 kB │ gzip:   2.26 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DlEQINpt.js                                     5.85 kB │ gzip:   2.38 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Czp9uRot.js                                     5.98 kB │ gzip:   2.76 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/B-upC_Qr.js                                     8.12 kB │ gzip:   3.28 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BXjZ9hPg.js                                     8.33 kB │ gzip:   3.51 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/DnSse7QG.js                                    11.95 kB │ gzip:   4.71 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BRUauUBL.js                                    32.61 kB │ gzip:  11.78 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/Dx9gmlBK.js                                    46.10 kB │ gzip:  18.97 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/BgLxm-aq.js                                   179.50 kB │ gzip:  67.70 kB
ℹ ../node_modules/.cache/nuxt/.nuxt/dist/client/_nuxt/pGzD5JPb.js                                   199.77 kB │ gzip:  59.04 kB
ℹ ✓ built in 2.28s
✔ Client built in 2283ms
ℹ Building server...
ℹ vite v7.3.5 building ssr environment for production...
ℹ transforming...
ℹ ✓ 366 modules transformed.
ℹ rendering chunks...
ℹ ✓ built in 2.13s
✔ Server built in 2149ms
[nitro] ℹ Initializing prerenderer
[nitro] ℹ Prerendering 4 initial routes with crawler
[nitro]   ├─ /200.html (48ms)
[nitro]   ├─ /404.html (48ms)
[nitro]   ├─ / (49ms)
[nitro]   ├─ /__nuxt_content/blog/sql_dump.txt (49ms)
[nitro]   ├─ /services (26ms)
[nitro]   ├─ /contact (27ms)
[nitro]   ├─ /about (27ms)
[nitro]   ├─ /blog (28ms)
[nitro]   ├─ /_ipx/_/images/portrait.jpeg (101ms)
[nitro]   ├─ /_ipx/s_220x165/images/undraw_code_thinking_re_gka2.svg (99ms)
[nitro]   ├─ /_ipx/s_440x330/images/undraw_code_thinking_re_gka2.svg (99ms)
[nitro] ℹ Prerendered 11 routes in 2.474 seconds
[nitro] ✔ Generated public .output/public
[nitro] ✔ You can preview this build using npx serve .output/public
│
└  ✨ You can now deploy .output/public to any static hosting!

exec
/bin/zsh -lc "rg -n -o '.{0,120}(aria-haspopup|role=\"dialog\"|<h[1-3]|<dl|<dt|<dd|<ul|<ol).{0,180}' .output/public/contact/index.html .output/public/index.html .output/public/services/index.html | head -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
.output/public/contact/index.html:1:tact__grid" data-v-baa446c9><div class="contact__main" data-v-baa446c9><p class="eyebrow" data-v-baa446c9>// contact</p><h1 class="contact__title" data-v-baa446c9>Parlons de votre projet</h1><p class="prose contact__intro" data-v-baa446c9> Une idée, un site à refaire, une automatisation à mettre en pla
.output/public/contact/index.html:1:"contact__info" data-v-baa446c9><div class="contact__infocard zcard zcard--pad" data-v-baa446c9 data-v-c5ec7be1><!--[--><dl class="contact__infolist" data-v-baa446c9><div class="infoitem" data-v-baa446c9><dt class="infoitem__k" data-v-baa446c9><span aria-hidden="true" data-v-baa446c9>// </span>email</d
.output/public/contact/index.html:1:t><dd class="infoitem__v" data-v-baa446c9><a class="contact__email" href="mailto:simon@jouan.ovh" data-v-baa446c9>simon@jouan.ovh</a></dd></div><div class="infoitem" data-v-baa446c9><dt
.output/public/contact/index.html:1: class="infoitem__k" data-v-baa446c9><span aria-hidden="true" data-v-baa446c9>// </span>localisation</dt><dd class="infoitem__v" data-v-baa446c9>Valognes, France</dd></div><div class="infoitem" data-v-baa446c9><dt class="infoitem__k" data-v-baa446c9><span aria-hidden="true" data-v-baa446
.output/public/contact/index.html:1:c9>// </span>disponibilité</dt><dd class="infoitem__v" data-v-baa446c9><div class="contact__avail" data-v-baa446c9><span class="zbadge zbadge--success" data-v-baa446c9 data-v-fc077828><span class="zbadge__dot" aria
.output/public/contact/index.html:1:<p class="prose contact__term-text" data-v-baa446c9>Vous préférez la ligne de commande ? Ouvrez le terminal.</p><button aria-haspopup="dialog" class="zbtn zbtn--terminal zbtn--sm" type="button" data-v-baa446c9 data-v-c154e5b1><span class="zbtn__icon" data-v-c154e5b1><!--[--><svg class="zicon" viewbox="0 0 24 24"
.output/public/contact/index.html:1:x1="12" y1="19" x2="20" y2="19"/></svg><!--]--></span><!--[--> Ouvrir le terminal <!--]--><!----></button><!--]--></div><ul class="hexrow" data-v-baa446c9 data-v-a86d2094><!--[--><li data-v-a86d2094><a class="hex" href="https://github.com/zohac" target="_blank" rel="noopener noreferrer" data-v-a86d2094
.output/public/contact/index.html:1:web freelance. Valognes, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Navigation</h2><!--[--><a href="/" class="ftr__link" data-v-13e18257>Accueil</a><a href="/services" class="ftr__link" data-v-13e18257>Service
.output/public/contact/index.html:1:tive router-link-exact-active ftr__link" data-v-13e18257>Contact</a><!--]--></nav><div class="ftr__col" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Projets</h2><!--[--><a href="https://keova.app" target="_blank" rel="noopener noreferrer" class="ftr__link" data-v-13e18257>keova.app</a><a h
.output/public/contact/index.html:1:r noreferrer" class="ftr__link" data-v-13e18257>patio-conseil.fr</a><!--]--></div><div class="ftr__col" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Réseaux</h2><ul class="hexrow" data-v-13e18257 data-v-a86d2094><!--[--><li data-v-a86d2094><a class="hex" href="https://github.com/zohac" tar
.output/public/services/index.html:1:lass="section" data-v-0a66d68b><div class="container" data-v-0a66d68b><p class="eyebrow" data-v-0a66d68b>// services</p><h1 class="services__title" data-v-0a66d68b>Des prestations claires, pensées comme des produits.</h1><p class="prose services__intro" data-v-0a66d68b> Du site WordPress à l&#39;applic
.output/public/services/index.html:1:-mesure, en passant par l&#39;IA appliquée — je m&#39;occupe de la technique, vous gardez la main sur votre projet. </p><ul class="grid-3" data-v-0a66d68b><!--[--><li data-v-0a66d68b><div class="offer zcard zcard--pad" data-v-0a66d68b data-v-c5ec7be1><!--[--><!----><div class="offer__icon" data-v-0a66d
.output/public/services/index.html:1:5 8.5 0 0 1-2.16 9.42l2.58-7.46c.24-.6.4-1.18.48-1.7l.06.04c.24.46.42 1.02.42 1.64 0 .8-.16 1.7-.62 2.86z"/></svg></div><h2 class="offer__title" data-v-0a66d68b>WordPress sur-mesure</h2><p class="offer__desc" data-v-0a66d68b>Thèmes et plugins développés à la main — rapides, maintenables, et faciles à é
.output/public/services/index.html:1:diter pour vous.</p><ul class="offer__points" data-v-0a66d68b><!--[--><li data-v-0a66d68b>Thème sur-mesure (press-wind / Tailwind)</li><li data-v-0a66d68b>Plugins &amp; blocs Gutenberg</li><li data-v-0a6
.output/public/services/index.html:1:rue" data-v-0a66d68b data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><h2 class="offer__title" data-v-0a66d68b>Applications web</h2><p class="offer__desc" data-v-0a66d68b>Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propr
.output/public/services/index.html:1:e.</p><ul class="offer__points" data-v-0a66d68b><!--[--><li data-v-0a66d68b>API REST / GraphQL (Symfony · Nest.js)</li><li data-v-0a66d68b>Front Vue / Nuxt</li><li data-v-0a66d68b>Tests &am
.output/public/services/index.html:1:-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><h2 class="offer__title" data-v-0a66d68b>IA &amp; automatisation</h2><p class="offer__desc" data-v-0a66d68b>L&#39;IA au service du code : agents, workflows n8n, et intégrations LLM da
.output/public/services/index.html:1:ns vos outils.</p><ul class="offer__points" data-v-0a66d68b><!--[--><li data-v-0a66d68b>Agents &amp; workflows (n8n)</li><li data-v-0a66d68b>Intégration d&#39;API LLM</li><li data-v-0a66d68b>Automatisa
.output/public/services/index.html:1:en" data-v-0a66d68b><div class="container" data-v-0a66d68b><p class="eyebrow" data-v-0a66d68b>// comment ça se passe</p><h2 class="process__title" data-v-0a66d68b>Un déroulé simple en quatre temps</h2><ol class="process" data-v-0a66d68b><!--[--><li class="process__step" data-v-0a66d68b><div class="proc
.output/public/services/index.html:1:ess__num" aria-hidden="true" data-v-0a66d68b>01</div><h3 class="process__step-title" data-v-0a66d68b>Échange</h3><p class="prose process__desc" data-v-0a66d68b>On cadre le besoin, le périmètre et le budget — sans jargon inutile.</p></li
.output/public/services/index.html:1:><li class="process__step" data-v-0a66d68b><div class="process__num" aria-hidden="true" data-v-0a66d68b>02</div><h3 class="process__step-title" data-v-0a66d68b>Conception</h3><p class="prose process__desc" data-v-0a66d68b>Architecture, maquette, et plan de livraison clair.</p></li><li class="pr
.output/public/services/index.html:1:ocess__step" data-v-0a66d68b><div class="process__num" aria-hidden="true" data-v-0a66d68b>03</div><h3 class="process__step-title" data-v-0a66d68b>Développement</h3><p class="prose process__desc" data-v-0a66d68b>Code propre, testé, livré par itérations visibles.</p></li><li class="
.output/public/services/index.html:1:process__step" data-v-0a66d68b><div class="process__num" aria-hidden="true" data-v-0a66d68b>04</div><h3 class="process__step-title" data-v-0a66d68b>Livraison &amp; suivi</h3><p class="prose process__desc" data-v-0a66d68b>Mise en ligne, documentation, et accompagnement.</p></li><!--]
.output/public/services/index.html:1:web freelance. Valognes, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Navigation</h2><!--[--><a href="/" class="ftr__link" data-v-13e18257>Accueil</a><a aria-current="page" href="/services" class="router-link-ac
.output/public/services/index.html:1:</a><a href="/contact" class="ftr__link" data-v-13e18257>Contact</a><!--]--></nav><div class="ftr__col" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Projets</h2><!--[--><a href="https://keova.app" target="_blank" rel="noopener noreferrer" class="ftr__link" data-v-13e18257>keova.app</a><a h
.output/public/services/index.html:1:r noreferrer" class="ftr__link" data-v-13e18257>patio-conseil.fr</a><!--]--></div><div class="ftr__col" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Réseaux</h2><ul class="hexrow" data-v-13e18257 data-v-a86d2094><!--[--><li data-v-a86d2094><a class="hex" href="https://github.com/zohac" tar
.output/public/index.html:1:55fdfdd><div class="anim hero__text" data-v-255fdfdd><p class="eyebrow" data-v-255fdfdd>// développeur web freelance</p><h1 class="hero__title" data-v-255fdfdd>Du code <em data-v-255fdfdd>sur-mesure</em>,<br data-v-255fdfdd>de l&#39;IA <em data-v-255fdfdd>utile</em>.</h1><p class="hero__sub" data-v-255
.output/public/index.html:1:tn zbtn--secondary zbtn--lg" data-v-255fdfdd data-v-c154e5b1><!----><!--[--> Voir les services <!--]--><!----></a></div><ul class="hero__tags" data-v-255fdfdd><!--[--><li data-v-255fdfdd><span class="ztag" data-v-255fdfdd data-v-6db1c85c><!--[-->php<!--]--><!----></span></li><li data-v-255fdfdd><span c
.output/public/index.html:1:section" data-v-255fdfdd><div class="container" data-v-255fdfdd><p class="eyebrow" data-v-255fdfdd>// ce que je fais</p><h2 class="section__title" data-v-255fdfdd>Trois façons de travailler ensemble</h2><ul class="grid-3" data-v-255fdfdd><!--[--><li data-v-255fdfdd><div class="offer zcard zcard--pad zc
.output/public/index.html:1:5 8.5 0 0 1-2.16 9.42l2.58-7.46c.24-.6.4-1.18.48-1.7l.06.04c.24.46.42 1.02.42 1.64 0 .8-.16 1.7-.62 2.86z"/></svg></div><h3 class="offer__title" data-v-255fdfdd>WordPress sur-mesure</h3><p class="offer__desc" data-v-255fdfdd>Thèmes et plugins développés à la main — rapides, maintenables, et faciles à é
.output/public/index.html:1:rue" data-v-255fdfdd data-v-70d98695><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><h3 class="offer__title" data-v-255fdfdd>Applications web</h3><p class="offer__desc" data-v-255fdfdd>Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propr
.output/public/index.html:1:-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/></svg></div><h3 class="offer__title" data-v-255fdfdd>IA &amp; automatisation</h3><p class="offer__desc" data-v-255fdfdd>L&#39;IA au service du code : agents, workflows n8n, et intégrations LLM da
.output/public/index.html:1:s="stat" data-v-255fdfdd><b data-v-255fdfdd>1</b><span data-v-255fdfdd>SaaS fondé · keova.app</span></div><!--]--></div><h2 class="eyebrow" data-v-255fdfdd>// projets sélectionnés</h2><ul class="grid-2 projects" data-v-255fdfdd><!--[--><li data-v-255fdfdd><a class="project zcard zcard--pad zcard--inter
.output/public/index.html:1:t="_blank" rel="noopener noreferrer" data-v-255fdfdd data-v-c5ec7be1><!--[--><div class="project__head" data-v-255fdfdd><h3 class="project__name" data-v-255fdfdd>keova.app</h3><span class="project__role" data-v-255fdfdd>Fondateur · SaaS</span></div><p class="prose project__desc" data-v-255fdfdd>Platefo
.output/public/index.html:1:rme SaaS que je conçois et opère de bout en bout.</p><ul class="hero__tags" data-v-255fdfdd><!--[--><li data-v-255fdfdd><span class="ztag" data-v-255fdfdd data-v-6db1c85c><!--[-->nest.js<!--]--><!----></span></li><li data-v-255fdfdd><sp
.output/public/index.html:1:t="_blank" rel="noopener noreferrer" data-v-255fdfdd data-v-c5ec7be1><!--[--><div class="project__head" data-v-255fdfdd><h3 class="project__name" data-v-255fdfdd>patio-conseil.fr</h3><span class="project__role" data-v-255fdfdd>Client</span></div><p class="prose project__desc" data-v-255fdfdd>Site et ou
.output/public/index.html:1:tils pour un cabinet de conseil.</p><ul class="hero__tags" data-v-255fdfdd><!--[--><li data-v-255fdfdd><span class="ztag" data-v-255fdfdd data-v-6db1c85c><!--[-->wordpress<!--]--><!----></span></li><li data-v-255fdfdd><
.output/public/index.html:1:web freelance. Valognes, France.</p></div><nav class="ftr__col" aria-label="Navigation du pied de page" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Navigation</h2><!--[--><a aria-current="page" href="/" class="router-link-active router-link-exact-active ftr__link" data-v-13e18257>Accueil<
.output/public/index.html:1:</a><a href="/contact" class="ftr__link" data-v-13e18257>Contact</a><!--]--></nav><div class="ftr__col" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Projets</h2><!--[--><a href="https://keova.app" target="_blank" rel="noopener noreferrer" class="ftr__link" data-v-13e18257>keova.app</a><a h
.output/public/index.html:1:r noreferrer" class="ftr__link" data-v-13e18257>patio-conseil.fr</a><!--]--></div><div class="ftr__col" data-v-13e18257><h2 class="ftr__title" data-v-13e18257>// Réseaux</h2><ul class="hexrow" data-v-13e18257 data-v-a86d2094><!--[--><li data-v-a86d2094><a class="hex" href="https://github.com/zohac" tar

exec
/bin/zsh -lc "rg -n -C 5 \"body \\{|font-family: var\\(--font|line-height: var\\(--lh|--lh-base|--fw-regular\" app/assets app/layouts app/components | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/HeaderComponent.vue-222-    font-size: 24px;
app/components/HeaderComponent.vue-223-    color: var(--accent);
app/components/HeaderComponent.vue-224-  }
app/components/HeaderComponent.vue-225-
app/components/HeaderComponent.vue-226-  b {
app/components/HeaderComponent.vue:227:    font-family: var(--font-mono);
app/components/HeaderComponent.vue-228-    font-size: var(--fs-md);
app/components/HeaderComponent.vue-229-    font-weight: var(--fw-bold);
app/components/HeaderComponent.vue-230-    color: var(--text-strong);
app/components/HeaderComponent.vue-231-  }
app/components/HeaderComponent.vue-232-
--
app/components/HeaderComponent.vue-247-  margin-left: var(--space-4);
app/components/HeaderComponent.vue-248-}
app/components/HeaderComponent.vue-249-
app/components/HeaderComponent.vue-250-.hdr__link {
app/components/HeaderComponent.vue-251-  padding: var(--space-2) var(--space-3);
app/components/HeaderComponent.vue:252:  font-family: var(--font-mono);
app/components/HeaderComponent.vue-253-  font-size: var(--fs-sm);
app/components/HeaderComponent.vue-254-  color: var(--text-muted);
app/components/HeaderComponent.vue-255-  text-decoration: none;
app/components/HeaderComponent.vue-256-  border-radius: var(--radius-sm);
app/components/HeaderComponent.vue-257-  transition:
--
app/components/HeaderComponent.vue-281-  gap: var(--space-3);
app/components/HeaderComponent.vue-282-  margin-left: auto;
app/components/HeaderComponent.vue-283-}
app/components/HeaderComponent.vue-284-
app/components/HeaderComponent.vue-285-.hdr__clock {
app/components/HeaderComponent.vue:286:  font-family: var(--font-mono);
app/components/HeaderComponent.vue-287-  font-size: var(--fs-xs);
app/components/HeaderComponent.vue-288-  color: var(--text-muted);
app/components/HeaderComponent.vue-289-}
app/components/HeaderComponent.vue-290-
app/components/HeaderComponent.vue-291-.hdr__burger {
--
app/components/HeaderComponent.vue-380-  }
app/components/HeaderComponent.vue-381-}
app/components/HeaderComponent.vue-382-
app/components/HeaderComponent.vue-383-.hdr__menu-link {
app/components/HeaderComponent.vue-384-  padding: var(--space-3);
app/components/HeaderComponent.vue:385:  font-family: var(--font-mono);
app/components/HeaderComponent.vue-386-  font-size: var(--fs-base);
app/components/HeaderComponent.vue-387-  color: var(--text-body);
app/components/HeaderComponent.vue-388-  text-decoration: none;
app/components/HeaderComponent.vue-389-  border-radius: var(--radius-sm);
app/components/HeaderComponent.vue-390-
--
app/components/WindowWrapperComponent.vue-335-        filter: brightness(1.2);
app/components/WindowWrapperComponent.vue-336-      }
app/components/WindowWrapperComponent.vue-337-    }
app/components/WindowWrapperComponent.vue-338-  }
app/components/WindowWrapperComponent.vue-339-
app/components/WindowWrapperComponent.vue:340:  &-body {
app/components/WindowWrapperComponent.vue-341-    margin: 0;
app/components/WindowWrapperComponent.vue-342-    padding: 0;
app/components/WindowWrapperComponent.vue-343-    height: calc(100% - var(--wh-height));
app/components/WindowWrapperComponent.vue-344-    overflow: auto;
app/components/WindowWrapperComponent.vue-345-    background-color: var(--wwc-color-aubergine-dark);
--
app/components/FooterComponent.vue-99-    font-size: 22px;
app/components/FooterComponent.vue-100-    color: var(--accent);
app/components/FooterComponent.vue-101-  }
app/components/FooterComponent.vue-102-
app/components/FooterComponent.vue-103-  b {
app/components/FooterComponent.vue:104:    font-family: var(--font-mono);
app/components/FooterComponent.vue-105-    font-size: var(--fs-md);
app/components/FooterComponent.vue-106-    font-weight: var(--fw-bold);
app/components/FooterComponent.vue-107-    color: var(--text-strong);
app/components/FooterComponent.vue-108-  }
app/components/FooterComponent.vue-109-
--
app/components/FooterComponent.vue-127-  flex-direction: column;
app/components/FooterComponent.vue-128-}
app/components/FooterComponent.vue-129-
app/components/FooterComponent.vue-130-.ftr__title {
app/components/FooterComponent.vue-131-  margin: 0 0 var(--space-3);
app/components/FooterComponent.vue:132:  font-family: var(--font-mono);
app/components/FooterComponent.vue-133-  font-size: var(--fs-xs);
app/components/FooterComponent.vue:134:  font-weight: var(--fw-regular);
app/components/FooterComponent.vue-135-  letter-spacing: var(--ls-wider);
app/components/FooterComponent.vue-136-  text-transform: uppercase;
app/components/FooterComponent.vue-137-  color: var(--text-muted);
app/components/FooterComponent.vue-138-}
app/components/FooterComponent.vue-139-
app/components/FooterComponent.vue-140-.ftr__link {
app/components/FooterComponent.vue-141-  display: block;
app/components/FooterComponent.vue-142-  padding: var(--space-1) 0;
app/components/FooterComponent.vue:143:  font-family: var(--font-mono);
app/components/FooterComponent.vue-144-  font-size: var(--fs-sm);
app/components/FooterComponent.vue-145-  color: var(--text-body);
app/components/FooterComponent.vue-146-  text-decoration: none;
app/components/FooterComponent.vue-147-  transition: color var(--dur-fast) var(--ease-standard);
app/components/FooterComponent.vue-148-
--
app/components/FooterComponent.vue-164-  flex-wrap: wrap;
app/components/FooterComponent.vue-165-  gap: var(--space-3);
app/components/FooterComponent.vue-166-  justify-content: space-between;
app/components/FooterComponent.vue-167-  margin-top: var(--space-8);
app/components/FooterComponent.vue-168-  padding-top: var(--space-5);
app/components/FooterComponent.vue:169:  font-family: var(--font-mono);
app/components/FooterComponent.vue-170-  font-size: var(--fs-xs);
app/components/FooterComponent.vue-171-
app/components/FooterComponent.vue-172-  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
app/components/FooterComponent.vue-173-  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
app/components/FooterComponent.vue-174-  color: var(--text-muted);
--
app/assets/scss/base/_layout.scss-34-
app/assets/scss/base/_layout.scss-35-// Sur-titre mono en capitales espacées, accent orange.
app/assets/scss/base/_layout.scss-36-// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
app/assets/scss/base/_layout.scss-37-.eyebrow {
app/assets/scss/base/_layout.scss-38-  margin: 0 0 var(--space-3);
app/assets/scss/base/_layout.scss:39:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss-40-  font-size: var(--fs-xs);
app/assets/scss/base/_layout.scss:41:  font-weight: var(--fw-regular);
app/assets/scss/base/_layout.scss-42-  line-height: inherit;
app/assets/scss/base/_layout.scss-43-  letter-spacing: var(--ls-wider);
app/assets/scss/base/_layout.scss-44-  text-transform: uppercase;
app/assets/scss/base/_layout.scss-45-  color: var(--accent);
app/assets/scss/base/_layout.scss-46-}
--
app/assets/scss/base/_layout.scss-50-  color: var(--text-muted);
app/assets/scss/base/_layout.scss-51-}
app/assets/scss/base/_layout.scss-52-
app/assets/scss/base/_layout.scss-53-// Texte long-forme : Ubuntu sans, interligne détendu.
app/assets/scss/base/_layout.scss-54-.prose {
app/assets/scss/base/_layout.scss:55:  font-family: var(--font-sans);
app/assets/scss/base/_layout.scss:56:  line-height: var(--lh-relaxed);
app/assets/scss/base/_layout.scss-57-  color: var(--text-body);
app/assets/scss/base/_layout.scss-58-}
app/assets/scss/base/_layout.scss-59-
app/assets/scss/base/_layout.scss-60-// Rangée de tags (chips) qui passent à la ligne — hero, stack /about, etc.
app/assets/scss/base/_layout.scss-61-// Reset de liste inclus pour un rendu propre en <ul>/<li> (no-op sur un <div>).
--
app/assets/scss/base/_layout.scss-72-// Réutilisée par le feed blog (/blog) et l'en-tête d'article (/blog/[...slug]).
app/assets/scss/base/_layout.scss-73-.post__meta {
app/assets/scss/base/_layout.scss-74-  display: flex;
app/assets/scss/base/_layout.scss-75-  gap: var(--space-3);
app/assets/scss/base/_layout.scss-76-  align-items: center;
app/assets/scss/base/_layout.scss:77:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss-78-  font-size: var(--fs-xs);
app/assets/scss/base/_layout.scss-79-
app/assets/scss/base/_layout.scss-80-  // Contraste (story 9.2) : méta d'article (date · lecture) = info réelle → palier
app/assets/scss/base/_layout.scss-81-  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/base/_layout.scss-82-  color: var(--text-muted);
--
app/components/ui/ZButton.vue-112-  justify-content: center;
app/components/ui/ZButton.vue-113-  gap: var(--space-2);
app/components/ui/ZButton.vue-114-  box-sizing: border-box;
app/components/ui/ZButton.vue-115-  height: var(--_h);
app/components/ui/ZButton.vue-116-  padding: 0 var(--_px);
app/components/ui/ZButton.vue:117:  font-family: var(--font-mono);
app/components/ui/ZButton.vue-118-  font-size: var(--_fs);
app/components/ui/ZButton.vue-119-  font-weight: var(--fw-medium);
app/components/ui/ZButton.vue-120-  line-height: 1;
app/components/ui/ZButton.vue-121-  letter-spacing: var(--ls-wide);
app/components/ui/ZButton.vue-122-  white-space: nowrap;
--
app/assets/scss/base/_reset.scss-51-	 ========================================================================== */
app/assets/scss/base/_reset.scss-52-
app/assets/scss/base/_reset.scss-53-/**
app/assets/scss/base/_reset.scss-54- * Remove the margin in all browsers.
app/assets/scss/base/_reset.scss-55- */
app/assets/scss/base/_reset.scss:56:body {
app/assets/scss/base/_reset.scss-57-  margin: 0;
app/assets/scss/base/_reset.scss-58-}
app/assets/scss/base/_reset.scss-59-
app/assets/scss/base/_reset.scss-60-/**
app/assets/scss/base/_reset.scss-61- * Render the `main` element consistently in IE.
--
app/assets/scss/base/_reset.scss-377-   Neutralise l'ancien `background: #fff` du reset (incompatible dark-first). */
app/assets/scss/base/_reset.scss-378-html {
app/assets/scss/base/_reset.scss-379-  background: var(--bg-page);
app/assets/scss/base/_reset.scss-380-}
app/assets/scss/base/_reset.scss-381-
app/assets/scss/base/_reset.scss:382:body {
app/assets/scss/base/_reset.scss-383-  background: var(--bg-page);
app/assets/scss/base/_reset.scss-384-  color: var(--text-body);
app/assets/scss/base/_reset.scss-385-}
app/assets/scss/base/_reset.scss-386-
app/assets/scss/base/_reset.scss-387-hr {
--
app/components/ui/ZBadge.vue-29-  align-items: center;
app/components/ui/ZBadge.vue-30-  gap: var(--space-2);
app/components/ui/ZBadge.vue-31-  box-sizing: border-box;
app/components/ui/ZBadge.vue-32-  height: 22px;
app/components/ui/ZBadge.vue-33-  padding: 0 var(--space-2);
app/components/ui/ZBadge.vue:34:  font-family: var(--font-mono);
app/components/ui/ZBadge.vue-35-  font-size: var(--fs-xs);
app/components/ui/ZBadge.vue-36-  font-weight: var(--fw-medium);
app/components/ui/ZBadge.vue-37-  line-height: 1;
app/components/ui/ZBadge.vue-38-  letter-spacing: var(--ls-wide);
app/components/ui/ZBadge.vue-39-  white-space: nowrap;
--
app/components/ui/ZAvatar.vue-65-  justify-content: center;
app/components/ui/ZAvatar.vue-66-  box-sizing: border-box;
app/components/ui/ZAvatar.vue-67-  width: var(--_sz);
app/components/ui/ZAvatar.vue-68-  height: var(--_sz);
app/components/ui/ZAvatar.vue-69-  overflow: hidden;
app/components/ui/ZAvatar.vue:70:  font-family: var(--font-mono);
app/components/ui/ZAvatar.vue-71-  font-weight: var(--fw-bold);
app/components/ui/ZAvatar.vue-72-  font-size: calc(var(--_sz) * 0.4);
app/components/ui/ZAvatar.vue-73-  color: var(--text-strong);
app/components/ui/ZAvatar.vue-74-  background: var(--surface-3);
app/components/ui/ZAvatar.vue-75-  border: 1px solid var(--border-default);
--
app/components/ui/ZInput.vue-131-  flex-direction: column;
app/components/ui/ZInput.vue-132-  gap: var(--space-2);
app/components/ui/ZInput.vue-133-}
app/components/ui/ZInput.vue-134-
app/components/ui/ZInput.vue-135-.zfield__label {
app/components/ui/ZInput.vue:136:  font-family: var(--font-mono);
app/components/ui/ZInput.vue-137-  font-size: var(--fs-xs);
app/components/ui/ZInput.vue-138-  letter-spacing: var(--ls-wider);
app/components/ui/ZInput.vue-139-  text-transform: uppercase;
app/components/ui/ZInput.vue-140-  color: var(--text-muted);
app/components/ui/ZInput.vue-141-}
--
app/components/ui/ZInput.vue-149-.ztextarea {
app/components/ui/ZInput.vue-150-  box-sizing: border-box;
app/components/ui/ZInput.vue-151-  width: 100%;
app/components/ui/ZInput.vue-152-  height: 42px;
app/components/ui/ZInput.vue-153-  padding: 0 var(--space-3);
app/components/ui/ZInput.vue:154:  font-family: var(--font-sans);
app/components/ui/ZInput.vue-155-  font-size: var(--fs-base);
app/components/ui/ZInput.vue-156-  color: var(--text-strong);
app/components/ui/ZInput.vue-157-  background: var(--bg-input);
app/components/ui/ZInput.vue-158-  border: 1px solid var(--border-default);
app/components/ui/ZInput.vue-159-  border-radius: var(--radius-md);
--
app/components/ui/ZInput.vue-183-
app/components/ui/ZInput.vue-184-.ztextarea {
app/components/ui/ZInput.vue-185-  height: auto;
app/components/ui/ZInput.vue-186-  min-height: 110px;
app/components/ui/ZInput.vue-187-  padding: var(--space-3);
app/components/ui/ZInput.vue:188:  line-height: var(--lh-normal);
app/components/ui/ZInput.vue-189-  resize: vertical;
app/components/ui/ZInput.vue-190-}
app/components/ui/ZInput.vue-191-
app/components/ui/ZInput.vue-192-.zfield--error {

exec
/bin/zsh -lc 'rg -n "font-family|line-height|font-weight" app/assets/scss/main.scss app/assets/scss/abstract/_root.scss app/assets/scss/base/_reset.scss app/layouts app/app.vue app | head -200' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/assets/scss/base/_reset.scss:46:  line-height: 1.15;
app/assets/scss/base/_reset.scss:94:  font-family: monospace;
app/assets/scss/base/_reset.scss:123:  font-weight: bolder;
app/assets/scss/base/_reset.scss:133:  font-family: monospace;
app/assets/scss/base/_reset.scss:151:  line-height: 0;
app/assets/scss/base/_reset.scss:186:  font-family: inherit;
app/assets/scss/base/_reset.scss:188:  line-height: 1.15;
app/assets/scss/base/_reset.scss:417:  font-weight: 700;
app/assets/scss/base/_reset.scss:582:  font-weight: 700;
app/assets/scss/base/_reset.scss:585:  line-height: normal;
app/pages/about.vue:172:// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
app/pages/about.vue:175:  font-weight: var(--fw-regular);
app/pages/about.vue:176:  line-height: inherit;
app/pages/about.vue:190:  font-family: var(--font-mono);
app/pages/about.vue:192:  font-weight: var(--fw-regular);
app/pages/about.vue:193:  line-height: var(--lh-tight);
app/pages/about.vue:198:  font-family: var(--font-mono);
app/pages/about.vue:318:  font-family: var(--font-mono);
app/pages/about.vue:328:  font-family: var(--font-mono);
app/pages/about.vue:334:  font-family: var(--font-mono);
app/pages/about.vue:341:  font-family: var(--font-sans);
app/pages/about.vue:359:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:171:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:195:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:197:  font-weight: var(--fw-light);
app/pages/blog/[...slug].vue:198:  line-height: var(--lh-tight);
app/pages/blog/[...slug].vue:229:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:231:    font-weight: var(--fw-regular);
app/pages/blog/[...slug].vue:232:    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue:238:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:240:    font-weight: var(--fw-regular);
app/pages/blog/[...slug].vue:241:    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue:247:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:249:    font-weight: var(--fw-medium);
app/pages/blog/[...slug].vue:255:    font-weight: var(--fw-bold);
app/pages/blog/[...slug].vue:291:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:293:    line-height: var(--lh-snug);
app/pages/blog/[...slug].vue:302:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:362:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:363:    font-weight: var(--fw-medium);
app/pages/blog/[...slug].vue:390:  font-family: var(--font-mono);
app/pages/blog/index.vue:156:  font-family: var(--font-mono);
app/pages/blog/index.vue:158:  font-weight: var(--fw-light);
app/pages/blog/index.vue:159:  line-height: var(--lh-tight);
app/pages/blog/index.vue:203:  font-family: var(--font-mono);
app/pages/blog/index.vue:205:  font-weight: var(--fw-regular);
app/pages/blog/index.vue:206:  line-height: var(--lh-snug);
app/pages/blog/index.vue:212:  font-family: var(--font-sans);
app/pages/blog/index.vue:214:  line-height: var(--lh-relaxed);
app/pages/blog/index.vue:235:  font-family: var(--font-mono);
app/pages/blog/index.vue:237:  font-weight: var(--fw-regular);
app/pages/services.vue:156:  font-family: var(--font-mono);
app/pages/services.vue:158:  font-weight: var(--fw-light);
app/pages/services.vue:159:  line-height: var(--lh-tight);
app/pages/services.vue:208:  font-family: var(--font-mono);
app/pages/services.vue:210:  font-weight: var(--fw-regular);
app/pages/services.vue:216:  font-family: var(--font-sans);
app/pages/services.vue:218:  line-height: var(--lh-relaxed);
app/pages/services.vue:230:    font-family: var(--font-mono);
app/pages/services.vue:249:  font-family: var(--font-mono);
app/pages/services.vue:255:    font-weight: var(--fw-bold);
app/pages/services.vue:272:  font-family: var(--font-mono);
app/pages/services.vue:274:  font-weight: var(--fw-regular);
app/pages/services.vue:288:  font-family: var(--font-mono);
app/pages/services.vue:290:  font-weight: var(--fw-light);
app/pages/services.vue:296:  font-family: var(--font-mono);
app/pages/services.vue:298:  font-weight: var(--fw-regular);
app/pages/contact.vue:283:  font-family: var(--font-mono);
app/pages/contact.vue:285:  font-weight: var(--fw-light);
app/pages/contact.vue:286:  line-height: var(--lh-tight);
app/pages/contact.vue:323:  font-family: var(--font-mono);
app/pages/contact.vue:331:  font-family: var(--font-mono);
app/pages/contact.vue:333:  line-height: var(--lh-normal);
app/pages/contact.vue:348:  font-family: var(--font-mono);
app/pages/contact.vue:375:  font-family: var(--font-mono);
app/pages/contact.vue:384:  font-weight: var(--fw-regular);
app/pages/contact.vue:426:  font-family: var(--font-mono);
app/pages/index.vue:243:  font-family: var(--font-mono);
app/pages/index.vue:245:  font-weight: var(--fw-light);
app/pages/index.vue:258:  font-family: var(--font-sans);
app/pages/index.vue:260:  line-height: var(--lh-relaxed);
app/pages/index.vue:328:  font-family: var(--font-mono);
app/pages/index.vue:341:  font-family: var(--font-mono);
app/pages/index.vue:343:  line-height: var(--lh-snug);
app/pages/index.vue:396:  font-family: var(--font-mono);
app/pages/index.vue:400:  font-weight: var(--fw-bold);
app/pages/index.vue:409:  font-weight: var(--fw-bold);
app/pages/index.vue:433:  font-family: var(--font-mono);
app/pages/index.vue:435:  font-weight: var(--fw-regular);
app/pages/index.vue:467:  font-family: var(--font-mono);
app/pages/index.vue:469:  font-weight: var(--fw-regular);
app/pages/index.vue:475:  font-family: var(--font-sans);
app/pages/index.vue:477:  line-height: var(--lh-relaxed);
app/pages/index.vue:482:  font-family: var(--font-mono);
app/pages/index.vue:509:  font-family: var(--font-mono);
app/pages/index.vue:514:    font-weight: var(--fw-light);
app/pages/index.vue:553:  font-family: var(--font-mono);
app/pages/index.vue:555:  font-weight: var(--fw-regular);
app/pages/index.vue:560:  font-family: var(--font-mono);
app/components/HeaderComponent.vue:227:    font-family: var(--font-mono);
app/components/HeaderComponent.vue:229:    font-weight: var(--fw-bold);
app/components/HeaderComponent.vue:252:  font-family: var(--font-mono);
app/components/HeaderComponent.vue:286:  font-family: var(--font-mono);
app/components/HeaderComponent.vue:385:  font-family: var(--font-mono);
app/components/FooterComponent.vue:104:    font-family: var(--font-mono);
app/components/FooterComponent.vue:106:    font-weight: var(--fw-bold);
app/components/FooterComponent.vue:132:  font-family: var(--font-mono);
app/components/FooterComponent.vue:134:  font-weight: var(--fw-regular);
app/components/FooterComponent.vue:143:  font-family: var(--font-mono);
app/components/FooterComponent.vue:169:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:36:// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
app/assets/scss/base/_layout.scss:39:  font-family: var(--font-mono);
app/assets/scss/base/_layout.scss:41:  font-weight: var(--fw-regular);
app/assets/scss/base/_layout.scss:42:  line-height: inherit;
app/assets/scss/base/_layout.scss:55:  font-family: var(--font-sans);
app/assets/scss/base/_layout.scss:56:  line-height: var(--lh-relaxed);
app/assets/scss/base/_layout.scss:77:  font-family: var(--font-mono);
app/assets/scss/base/_reset.scss:46:  line-height: 1.15;
app/assets/scss/base/_reset.scss:94:  font-family: monospace;
app/assets/scss/base/_reset.scss:123:  font-weight: bolder;
app/assets/scss/base/_reset.scss:133:  font-family: monospace;
app/assets/scss/base/_reset.scss:151:  line-height: 0;
app/assets/scss/base/_reset.scss:186:  font-family: inherit;
app/assets/scss/base/_reset.scss:188:  line-height: 1.15;
app/assets/scss/base/_reset.scss:417:  font-weight: 700;
app/assets/scss/base/_reset.scss:582:  font-weight: 700;
app/assets/scss/base/_reset.scss:585:  line-height: normal;
app/assets/scss/components/_card.scss:9://              font-weight-regular
app/assets/scss/components/_card.scss:13://              font-weight-regular
app/assets/scss/components/_card.scss:17://              font-weight-regular
app/assets/scss/components/_card.scss:43:$-font-weight: variables.$font-weight-regular;
app/assets/scss/components/_card.scss:44:$-line-height: function.line-height($-font-size);
app/assets/scss/components/_card.scss:50:  --card-font-weight: #{$-font-weight};
app/assets/scss/components/_card.scss:51:  --card-line-height: #{$-line-height};
app/assets/scss/components/_button.scss:10://              font-weight-regular
app/assets/scss/components/_button.scss:14://              font-weight-regular
app/assets/scss/components/_button.scss:18://              font-weight-regular
app/assets/scss/components/_button.scss:40:$-font-weight-large: variables.$font-weight-regular;
app/assets/scss/components/_button.scss:41:$-line-height-large: function.line-height($-font-size-large);
app/assets/scss/components/_button.scss:47:$-font-weight: variables.$font-weight-regular;
app/assets/scss/components/_button.scss:48:$-line-height: function.line-height($-font-size);
app/assets/scss/components/_button.scss:54:$-font-weight-small: variables.$font-weight-regular;
app/assets/scss/components/_button.scss:55:$-line-height-small: function.line-height($-font-size-small);
app/assets/scss/components/_button.scss:62:  --btn-font-weight: #{$-font-weight};
app/assets/scss/components/_button.scss:63:  --btn-line-height: #{$-line-height};
app/assets/scss/components/_button.scss:93:  font-weight: var(--btn-font-weight);
app/assets/scss/components/_button.scss:94:  line-height: var(--btn-line-height);
app/assets/scss/components/_button.scss:121:    --btn-large-font-weight: #{$-font-weight-large};
app/assets/scss/components/_button.scss:122:    --btn-large-line-height: #{$-line-height-large};
app/assets/scss/components/_button.scss:127:    font-weight: var(--btn-large-font-weight);
app/assets/scss/components/_button.scss:128:    line-height: var(--btn-large-line-height);
app/assets/scss/components/_button.scss:136:    --btn-small-font-weight: #{$-font-weight-small};
app/assets/scss/components/_button.scss:137:    --btn-small-line-height: #{$-line-height-small};
app/assets/scss/components/_button.scss:142:    font-weight: var(--btn-small-font-weight);
app/assets/scss/components/_button.scss:143:    line-height: var(--btn-small-line-height);
app/components/terminal/TerminalComponent.vue:338:  font-family: var(--font-mono);
app/components/terminal/TerminalComponent.vue:404:      font-family: var(--font-mono);
app/components/terminal/TerminalComponent.vue:407:      line-height: 30px; // centre verticalement dans la barre de 30px
app/components/terminal/TerminalComponent.vue:420:    line-height: var(--lh-snug);
app/components/terminal/TerminalComponent.vue:435:      font-weight: var(--fw-bold);
app/components/terminal/TerminalComponent.vue:446:      font-weight: var(--fw-regular);
app/components/terminal/TerminalComponent.vue:456:      font-family: inherit;
app/assets/scss/abstract/_fonts.scss:5:  font-family: "Ubuntu Mono";
app/assets/scss/abstract/_fonts.scss:7:  font-weight: 400;
app/assets/scss/abstract/_fonts.scss:13:  font-family: "Ubuntu Mono";
app/assets/scss/abstract/_fonts.scss:15:  font-weight: 400;
app/assets/scss/abstract/_fonts.scss:21:  font-family: "Ubuntu Mono";
app/assets/scss/abstract/_fonts.scss:23:  font-weight: 700;
app/assets/scss/abstract/_fonts.scss:29:  font-family: "Ubuntu Mono";
app/assets/scss/abstract/_fonts.scss:31:  font-weight: 700;
app/assets/scss/abstract/_variables.scss:38:// font-weight-bolder   900
app/assets/scss/abstract/_variables.scss:39:// font-weight-bold     700
app/assets/scss/abstract/_variables.scss:40:// font-weight-medium   500
app/assets/scss/abstract/_variables.scss:41:// font-weight-regular  400
app/assets/scss/abstract/_variables.scss:42:// font-weight-thin     300
app/assets/scss/abstract/_variables.scss:43:$font-weight-bolder: 900;
app/assets/scss/abstract/_variables.scss:44:$font-weight-bold: 700;
app/assets/scss/abstract/_variables.scss:45:$font-weight-medium: 500;
app/assets/scss/abstract/_variables.scss:46:$font-weight-regular: 400;
app/assets/scss/abstract/_variables.scss:47:$font-weight-thin: 300;
app/assets/scss/abstract/_function.scss:23:@function line-height($font-size) {
app/assets/scss/abstract/_typography.scss:15:  font-family: var(--font-sans);
app/assets/scss/abstract/_typography.scss:17:  font-weight: #{variables.$font-weight-regular};
app/assets/scss/abstract/_typography.scss:18:  line-height: #{function.line-height(var(--font-size))};
app/assets/scss/abstract/_typography.scss:32:  font-family: var(--font-mono);
app/assets/scss/abstract/_typography.scss:36:  font-weight: #{variables.$font-weight-regular};
app/assets/scss/abstract/_typography.scss:38:  line-height: #{function.line-height(variables.$font-size-3x-large)};
app/assets/scss/abstract/_typography.scss:42:  font-weight: #{variables.$font-weight-thin};
app/assets/scss/abstract/_typography.scss:44:  line-height: #{function.line-height(variables.$font-size-2x-large)};
app/assets/scss/abstract/_typography.scss:50:  font-family: var(--font-mono);
app/assets/scss/abstract/_typography.scss:57:  line-height: var(--lh-relaxed);
app/assets/scss/abstract/_typography.scss:77:  font-family: var(--font-mono);
app/assets/scss/abstract/_typography.scss:79:  line-height: #{function.line-height(variables.$font-size-base)};
app/assets/scss/abstract/_typography.scss:90:  font-family: var(--font-mono);
app/assets/scss/abstract/_typography.scss:107:  line-height: #{function.line-height(variables.$font-size-large)};
app/components/ui/ZButton.vue:117:  font-family: var(--font-mono);
app/components/ui/ZButton.vue:119:  font-weight: var(--fw-medium);
app/components/ui/ZButton.vue:120:  line-height: 1;
app/components/ui/ZAvatar.vue:70:  font-family: var(--font-mono);
app/components/ui/ZAvatar.vue:71:  font-weight: var(--fw-bold);

exec
/bin/zsh -lc "sed -n '1,100p' app/assets/scss/main.scss; sed -n '1,130p' app/assets/scss/abstract/_typography.scss; sed -n '1,80p' app/app.vue 2>/dev/null || true; rg -n \"@use.*typography|@include.*typography\" app/assets/scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
@use "base/reset";
@use "abstract/root"; // tokens DS globaux (:root CSS custom properties) — source de vérité
@use "abstract/fonts";
@use "abstract/typography";
@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)

.fixed-height {
  width: auto;
  height: 100%;
}

.img-center {
  display: flex;
  margin: 0 auto;
}
@use "function";
@use "variables";
@use "mixin";
@use "space";

body,
button,
input,
select,
optgroup,
textarea {
  --font-size: #{variables.$font-size-base};

  // Corps long : Ubuntu sans (token DS). Les titres/labels/code passent en mono ci-dessous.
  font-family: var(--font-sans);
  font-size: var(--font-size);
  font-weight: #{variables.$font-weight-regular};
  line-height: #{function.line-height(var(--font-size))};

  @include mixin.font-style-normal;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  clear: both;

  // Ubuntu Mono = voix signature pour les titres (token DS).
  font-family: var(--font-mono);
}

h1 {
  font-weight: #{variables.$font-weight-regular};
  font-size: #{variables.$font-size-3x-large};
  line-height: #{function.line-height(variables.$font-size-3x-large)};
}

h2 {
  font-weight: #{variables.$font-weight-thin};
  font-size: #{variables.$font-size-2x-large};
  line-height: #{function.line-height(variables.$font-size-2x-large)};
}

label,
legend {
  // Labels : Ubuntu Mono = voix signature pour les micro-libelles.
  font-family: var(--font-mono);
}

p {
  font-size: #{variables.$font-size-medium};

  // Long-form lisible : interligne détendu (token DS).
  line-height: var(--lh-relaxed);
  margin-bottom: #{space.$space-stack-24x};
}

dfn,
cite,
em,
i {
  font-style: italic;
}

blockquote {
  margin: 0 #{space.$space-stack-16x};
}

address {
  margin: 0 0 #{space.$space-stack-16x};
}

pre {
  font-family: var(--font-mono);
  font-size: #{variables.$font-size-base};
  line-height: #{function.line-height(variables.$font-size-base)};
  overflow: auto;
  padding: #{space.$space-inset-16x};
  margin-bottom: #{space.$space-stack-16x};
  max-width: 100%;
}

code,
kbd,
tt,
var {
  font-family: var(--font-mono);
}

abbr,
acronym {
  border: 1px dotted;
  cursor: help;
}

mark,
ins {
  background: var(--mark-color-background);
  text-decoration: none;
}

big {
  font-size: #{variables.$font-size-large};
  line-height: #{function.line-height(variables.$font-size-large)};
}
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss" scoped></style>
app/assets/scss/main.scss:4:@use "abstract/typography";
app/assets/scss/abstract/_index.scss:6:@use "typography";

exec
/bin/zsh -lc "sed -n '1,180p' app/assets/scss/abstract/_root.scss; sed -n '1,80p' app/assets/scss/abstract/_function.scss; sed -n '140,190p' app/pages/about.vue" in /Users/simon/dev/jouan.ovh
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
@use "variables";
@use "sass:map";

@function breakpoint($key) {
  @if map.has-key(variables.$breakpoints-container, $key) {
    @return map.get(variables.$breakpoints-container, $key);
  }

  @warn "Unknown `#{$key}` in $breakpoints-container.";
  @return null;
}

// line height = font size x 1.5
// ==========================================================
$-font-height: variables.$font-height-default or 1;

@function height($space-stack: 0, $font-size: 0) {
  $result: calc(#{$space-stack} * 2 + #{$font-size});

  @return $result;
}

@function line-height($font-size) {
  $result: calc(#{$font-size} * #{$-font-height});

  @return $result;
}

@function min-width($height) {
  $result: calc(#{$height} * 2);

  @return $result;
}
const pageImage = `${siteUrl}/images/portrait.jpeg`;

useHead({
  title: pageTitle,
  link: [{ rel: "canonical", href: pageUrl }],
  meta: [
    { name: "description", content: pageDescription },
    // Open Graph (partage Facebook/LinkedIn…).
    { property: "og:type", content: "profile" },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: pageDescription },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: pageImage },
    // Twitter Card.
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: pageDescription },
    { name: "twitter:image", content: pageImage },
  ],
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / About.jsx */
// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.about {
  display: block;
}

// Les libellés de section sont des <h2> (outline a11y navigable au lecteur d'écran),
// stylés en eyebrow. Neutralise le poids et l'interligne propres au <h2> pour un
// rendu strictement identique au <p class="eyebrow"> initial (line-height: inherit
// reproduit l'héritage du corps, comme le ferait un <p>).
.eyebrow {
  font-weight: var(--fw-regular);
  line-height: inherit;
}

// ---- Grille du hero (porté de About.jsx : grid-2 + gridTemplateColumns "0.8fr 1.2fr") ----
.about__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: start;
  gap: var(--space-6);
}

// ---- Colonne gauche : identité ----
.about__name {
  margin: var(--space-5) 0 var(--space-1);
  font-family: var(--font-mono);

exec
/bin/zsh -lc "sed -n '1,120p' app/assets/scss/abstract/_variables.scss; rg -n \"\\.eyebrow\" app/pages/about.vue app/assets/scss | head -50" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
/* Breakpoint */
$breakpoints-container: (
  "xs": 475px,
  "sm": 576px,
  "md": 768px,
  "lg": 992px,
  "xl": 1200px,
  "xxl": 1400px
);

// Token name          Value  rem       Usage
// ==========================================================
// font-size-5x-large  64px   4rem      Header
// font-size-4x-large  48px   3rem      Header
// font-size-3x-large  32px   2rem      Header
// font-size-2x-large  28px   1.75rem   Header
// font-size-x-large   24px   1.5rem    Header, body text
// font-size-large     20px   1.25rem   Header, body text
// font-size-medium    18px   1.125rem  Body text
// font-size-base      16px   1rem      Body text
// font-size-small     14px   0.875rem  Description, caption
// font-size-x-small   12px   0.75rem   Description, caption
// font-size-2x-small  10px   0.625rem  Description, caption
$font-size-5x-large: 4rem;
$font-size-4x-large: 3rem;
$font-size-3x-large: 2rem;
$font-size-2x-large: 1.75rem;
$font-size-x-large: 1.5rem;
$font-size-large: 1.25rem;
$font-size-medium: 1.125rem;
$font-size-base: 1rem;
$font-size-small: 0.875rem;
$font-size-x-small: 0.75rem;
$font-size-2x-small: 0.625rem;

// Token name           Value
// ==========================================================
// font-weight-bolder   900
// font-weight-bold     700
// font-weight-medium   500
// font-weight-regular  400
// font-weight-thin     300
$font-weight-bolder: 900;
$font-weight-bold: 700;
$font-weight-medium: 500;
$font-weight-regular: 400;
$font-weight-thin: 300;
$font-height-default: 1.5;
$header-height: 56px;
$footer-height: 56px;
app/pages/about.vue:164:// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
app/pages/about.vue:174:.eyebrow {
app/assets/scss/base/_layout.scss:4://  .section / .section--sunken / .container / .eyebrow / .prose
app/assets/scss/base/_layout.scss:37:.eyebrow {
app/assets/scss/base/_layout.scss:49:.eyebrow--muted {
app/assets/scss/main.scss:5:@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées

exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/10-2/full.diff | sed -n '1,230p'; nl -ba docs/implementation-artifacts/code-reviews/10-2/full.diff | sed -n '230,430p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/assets/scss/base/_layout.scss b/app/assets/scss/base/_layout.scss
     2	index 5d6729f..e59cebe 100644
     3	--- a/app/assets/scss/base/_layout.scss
     4	+++ b/app/assets/scss/base/_layout.scss
     5	@@ -33,10 +33,13 @@
     6	 }
     7	 
     8	 // Sur-titre mono en capitales espacées, accent orange.
     9	+// font-weight et line-height neutralisés pour un rendu identique lorsqu'appliqué sur un <h2 class="eyebrow">.
    10	 .eyebrow {
    11	   margin: 0 0 var(--space-3);
    12	   font-family: var(--font-mono);
    13	   font-size: var(--fs-xs);
    14	+  font-weight: var(--fw-regular);
    15	+  line-height: inherit;
    16	   letter-spacing: var(--ls-wider);
    17	   text-transform: uppercase;
    18	   color: var(--accent);
    19	diff --git a/app/pages/contact.vue b/app/pages/contact.vue
    20	index ba80d43..5191532 100644
    21	--- a/app/pages/contact.vue
    22	+++ b/app/pages/contact.vue
    23	@@ -89,18 +89,24 @@
    24	           <div class="contact__info">
    25	             <!-- Carte infos : email / localisation / disponibilité -->
    26	             <ZCard class="contact__infocard">
    27	-              <div class="infoitem">
    28	-                <div class="infoitem__k">// email</div>
    29	-                <a class="infoitem__v contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
    30	-              </div>
    31	-              <div class="infoitem">
    32	-                <div class="infoitem__k">// localisation</div>
    33	-                <div class="infoitem__v">{{ contact.city }}</div>
    34	-              </div>
    35	-              <div class="infoitem">
    36	-                <div class="infoitem__k">// disponibilité</div>
    37	-                <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
    38	-              </div>
    39	+              <dl class="contact__infolist">
    40	+                <div class="infoitem">
    41	+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
    42	+                  <dd class="infoitem__v">
    43	+                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
    44	+                  </dd>
    45	+                </div>
    46	+                <div class="infoitem">
    47	+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
    48	+                  <dd class="infoitem__v">{{ contact.city }}</dd>
    49	+                </div>
    50	+                <div class="infoitem">
    51	+                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
    52	+                  <dd class="infoitem__v">
    53	+                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
    54	+                  </dd>
    55	+                </div>
    56	+              </dl>
    57	             </ZCard>
    58	 
    59	             <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
    60	@@ -110,7 +116,7 @@
    61	                 anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
    62	               </p>
    63	               <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
    64	-              <ZButton variant="terminal" size="sm" @click="openTerminal">
    65	+              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
    66	                 <template #icon><ZIcon name="terminal" /></template>
    67	                 Ouvrir le terminal
    68	               </ZButton>
    69	@@ -360,6 +366,11 @@ useHead({
    70	 }
    71	 
    72	 // ---- Carte infos (porté de kit.css : .infoitem / .k / .v) ----
    73	+.contact__infolist {
    74	+  margin: 0;
    75	+  padding: 0;
    76	+}
    77	+
    78	 .infoitem {
    79	   font-family: var(--font-mono);
    80	 
    81	@@ -370,12 +381,14 @@ useHead({
    82	 
    83	 .infoitem__k {
    84	   font-size: var(--fs-xs);
    85	+  font-weight: var(--fw-regular);
    86	   letter-spacing: var(--ls-wider);
    87	   text-transform: uppercase;
    88	   color: var(--text-muted);
    89	 }
    90	 
    91	 .infoitem__v {
    92	+  margin: 0;
    93	   font-size: var(--fs-md);
    94	   color: var(--text-strong);
    95	 }
    96	diff --git a/app/pages/index.vue b/app/pages/index.vue
    97	index 1b36402..69ee46d 100644
    98	--- a/app/pages/index.vue
    99	+++ b/app/pages/index.vue
   100	@@ -15,9 +15,11 @@
   101	               </ZButton>
   102	               <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
   103	             </div>
   104	-            <div class="hero__tags">
   105	-              <ZTag v-for="tag in tags" :key="tag">{{ tag }}</ZTag>
   106	-            </div>
   107	+            <ul class="hero__tags">
   108	+              <li v-for="tag in tags" :key="tag">
   109	+                <ZTag>{{ tag }}</ZTag>
   110	+              </li>
   111	+            </ul>
   112	           </div>
   113	 
   114	           <!-- Colonne droite : fenêtre terminal décorative (statique) -->
   115	@@ -68,23 +70,18 @@
   116	       <div class="container">
   117	         <p class="eyebrow">// ce que je fais</p>
   118	         <h2 class="section__title">Trois façons de travailler ensemble</h2>
   119	-        <div class="grid-3">
   120	-          <ZCard
   121	-            v-for="service in services"
   122	-            :key="service.id"
   123	-            class="offer"
   124	-            interactive
   125	-            :accent="service.featured"
   126	-            :featured="service.featured"
   127	-          >
   128	-            <div class="offer__icon"><ZIcon :name="service.icon" /></div>
   129	-            <h3 class="offer__title">{{ service.title }}</h3>
   130	-            <p class="offer__desc">{{ service.desc }}</p>
   131	-            <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
   132	-              En savoir plus →
   133	-            </NuxtLink>
   134	-          </ZCard>
   135	-        </div>
   136	+        <ul class="grid-3">
   137	+          <li v-for="service in services" :key="service.id">
   138	+            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
   139	+              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
   140	+              <h3 class="offer__title">{{ service.title }}</h3>
   141	+              <p class="offer__desc">{{ service.desc }}</p>
   142	+              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
   143	+                En savoir plus →
   144	+              </NuxtLink>
   145	+            </ZCard>
   146	+          </li>
   147	+        </ul>
   148	       </div>
   149	     </section>
   150	 
   151	@@ -98,29 +95,24 @@
   152	           </div>
   153	         </div>
   154	 
   155	-        <p class="eyebrow">// projets sélectionnés</p>
   156	-        <div class="grid-2 projects">
   157	-          <ZCard
   158	-            v-for="project in projects"
   159	-            :key="project.url"
   160	-            class="project"
   161	-            interactive
   162	-            as="a"
   163	-            :href="project.url"
   164	-            target="_blank"
   165	-            rel="noopener noreferrer"
   166	-          >
   167	-            <div class="project__head">
   168	-              <h3 class="project__name">{{ project.name }}</h3>
   169	-              <span class="project__role">{{ project.role }}</span>
   170	-            </div>
   171	-            <p class="prose project__desc">{{ project.desc }}</p>
   172	-            <div class="hero__tags">
   173	-              <ZTag v-for="tag in project.tags" :key="tag">{{ tag }}</ZTag>
   174	-            </div>
   175	-            <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
   176	-          </ZCard>
   177	-        </div>
   178	+        <h2 class="eyebrow">// projets sélectionnés</h2>
   179	+        <ul class="grid-2 projects">
   180	+          <li v-for="project in projects" :key="project.url">
   181	+            <ZCard class="project" interactive as="a" :href="project.url" target="_blank" rel="noopener noreferrer">
   182	+              <div class="project__head">
   183	+                <h3 class="project__name">{{ project.name }}</h3>
   184	+                <span class="project__role">{{ project.role }}</span>
   185	+              </div>
   186	+              <p class="prose project__desc">{{ project.desc }}</p>
   187	+              <ul class="hero__tags">
   188	+                <li v-for="tag in project.tags" :key="tag">
   189	+                  <ZTag>{{ tag }}</ZTag>
   190	+                </li>
   191	+              </ul>
   192	+              <span class="screen-reader-text"> (ouvre dans un nouvel onglet)</span>
   193	+            </ZCard>
   194	+          </li>
   195	+        </ul>
   196	       </div>
   197	     </section>
   198	   </main>
   199	@@ -449,6 +441,9 @@ const { open: openTerminal } = useTerminal();
   200	   display: grid;
   201	   grid-template-columns: repeat(3, 1fr);
   202	   gap: var(--space-5);
   203	+  margin: 0;
   204	+  padding: 0;
   205	+  list-style: none;
   206	 }
   207	 
   208	 .offer__icon {
   209	@@ -531,6 +526,9 @@ const { open: openTerminal } = useTerminal();
   210	   display: grid;
   211	   grid-template-columns: 1fr 1fr;
   212	   gap: var(--space-6);
   213	+  margin: 0;
   214	+  padding: 0;
   215	+  list-style: none;
   216	 }
   217	 
   218	 .projects {
   219	diff --git a/app/pages/services.vue b/app/pages/services.vue
   220	index 14b739f..c8d81d8 100644
   221	--- a/app/pages/services.vue
   222	+++ b/app/pages/services.vue
   223	@@ -10,39 +10,35 @@
   224	           vous gardez la main sur votre projet.
   225	         </p>
   226	 
   227	-        <div class="grid-3">
   228	-          <ZCard
   229	-            v-for="offer in offers"
   230	-            :key="offer.id"
   230	-            :key="offer.id"
   231	-            class="offer"
   232	-            :accent="offer.featured"
   233	-            :featured="offer.featured"
   234	-          >
   235	-            <div v-if="offer.featured" class="offer__badge">
   236	-              <ZBadge tone="accent">Le plus demandé</ZBadge>
   237	-            </div>
   238	-            <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
   239	-            <h2 class="offer__title">{{ offer.title }}</h2>
   240	-            <p class="offer__desc">{{ offer.desc }}</p>
   241	-            <ul class="offer__points">
   242	-              <li v-for="point in offer.points" :key="point">{{ point }}</li>
   243	-            </ul>
   244	-            <div class="offer__price">
   245	-              <b>{{ offer.price }}</b>
   246	-            </div>
   247	-            <div class="offer__cta">
   248	-              <ZButton
   249	-                :as="NuxtLink"
   250	-                to="/contact"
   251	-                :variant="offer.featured ? 'primary' : 'secondary'"
   252	-                :aria-label="`Discuter du projet — ${offer.title}`"
   253	-                class="offer__btn"
   254	-              >
   255	-                Discuter du projet
   256	-              </ZButton>
   257	-            </div>
   258	-          </ZCard>
   259	-        </div>
   260	+        <ul class="grid-3">
   261	+          <li v-for="offer in offers" :key="offer.id">
   262	+            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
   263	+              <div v-if="offer.featured" class="offer__badge">
   264	+                <ZBadge tone="accent">Le plus demandé</ZBadge>
   265	+              </div>
   266	+              <div class="offer__icon"><ZIcon :name="offer.icon" /></div>
   267	+              <h2 class="offer__title">{{ offer.title }}</h2>
   268	+              <p class="offer__desc">{{ offer.desc }}</p>
   269	+              <ul class="offer__points">
   270	+                <li v-for="point in offer.points" :key="point">{{ point }}</li>
   271	+              </ul>
   272	+              <div class="offer__price">
   273	+                <b>{{ offer.price }}</b>
   274	+              </div>
   275	+              <div class="offer__cta">
   276	+                <ZButton
   277	+                  :as="NuxtLink"
   278	+                  to="/contact"
   279	+                  :variant="offer.featured ? 'primary' : 'secondary'"
   280	+                  :aria-label="`Discuter du projet — ${offer.title}`"
   281	+                  class="offer__btn"
   282	+                >
   283	+                  Discuter du projet
   284	+                </ZButton>
   285	+              </div>
   286	+            </ZCard>
   287	+          </li>
   288	+        </ul>
   289	       </div>
   290	     </section>
   291	 
   292	@@ -52,13 +48,13 @@
   293	         <p class="eyebrow">// comment ça se passe</p>
   294	         <h2 class="process__title">Un déroulé simple en quatre temps</h2>
   295	 
   296	-        <div class="process">
   297	-          <div v-for="step in steps" :key="step.n" class="process__step">
   298	-            <div class="process__num">{{ step.n }}</div>
   299	+        <ol class="process">
   300	+          <li v-for="step in steps" :key="step.n" class="process__step">
   301	+            <div class="process__num" aria-hidden="true">{{ step.n }}</div>
   302	             <h3 class="process__step-title">{{ step.title }}</h3>
   303	             <p class="prose process__desc">{{ step.desc }}</p>
   304	-          </div>
   305	-        </div>
   306	+          </li>
   307	+        </ol>
   308	 
   309	         <div class="process__cta">
   310	           <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
   311	@@ -175,6 +171,9 @@ useHead({
   312	   display: grid;
   313	   grid-template-columns: repeat(3, 1fr);
   314	   gap: var(--space-5);
   315	+  margin: 0;
   316	+  padding: 0;
   317	+  list-style: none;
   318	 }
   319	 
   320	 // `display:flex` (porté de l'inline JSX) : le prix + CTA sont poussés en bas via
   321	@@ -280,6 +279,9 @@ useHead({
   322	   display: grid;
   323	   grid-template-columns: repeat(4, 1fr);
   324	   gap: var(--space-5);
   325	+  margin: 0;
   326	+  padding: 0;
   327	+  list-style: none;
   328	 }
   329	 
   330	 .process__num {
   331	diff --git a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
   332	index 2ac1617..d8cc22b 100644
   333	--- a/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
   334	+++ b/docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md
   335	@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
   336	 
   337	 # Story 10.2: A11y sémantique résiduelle (home / services / contact)
   338	 
   339	-Status: ready-for-dev
   340	+Status: review
   341	 
   342	 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
   343	 
   344	@@ -23,18 +23,18 @@ so that la structure du site m'est annoncée correctement (FR12).
   345	 
   346	 ## Tasks / Subtasks
   347	 
   348	-- [ ] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
   349	-  - [ ] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
   350	-  - [ ] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
   351	-- [ ] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
   352	-  - [ ] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
   353	-  - [ ] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
   354	-- [ ] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
   355	-  - [ ] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
   356	-  - [ ] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
   357	-- [ ] Tâche 4 — Validation (AC: tout)
   358	-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
   359	-  - [ ] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
   360	+- [x] Tâche 1 — Home (`app/pages/index.vue`) : titres + listes (AC: tout)
   361	+  - [x] Auditer l'outline : `<h1 class="hero__title">` (l.9). Les **libellés de section** qui ouvrent une section et n'ont pas de titre propre passent en `<h2 class="eyebrow">` ; ceux qui sont un **kicker au-dessus d'un titre existant** restent `<p>`. Cas : l.8 `// développeur web freelance` = kicker du hero (au-dessus du `<h1>`) → **reste `<p>`** ; l.69 `// ce que je fais` est suivi d'un `<h2 class="section__title">` (l.70) → kicker, **reste `<p>`** ; l.101 `// projets sélectionnés` → **vérifier** s'il est suivi d'un titre ; si non, le passer en `<h2 class="eyebrow">`. (Convention story 5.2 : `font-weight`/`line-height` hérités → rendu identique.)
   362	+  - [x] **Séquences répétées en listes** : la grille des 3 offres (aperçu services) et la grille des projets sélectionnés (cartes `v-for`) → `<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). Numéros/ordre éventuels en `aria-hidden`.
   363	+- [x] Tâche 2 — Services (`app/pages/services.vue`) : process en `<ol>` + titres (AC: tout)
   364	+  - [x] **Process en `<ol>`/`<li>`** (différé revue 4.2) : `.process` est aujourd'hui `<div class="process"><div v-for="step" class="process__step">` avec `<div class="process__num">{{ step.n }}</div>` + `<h3>` (l.55-60). Passer `.process` en `<ol>`, `.process__step` en `<li>` ; les numéros `01…04` (`process__num`) en `aria-hidden="true"` (l'ordre est porté par la liste). `list-style: none` + reset → rendu identique.
   365	+  - [x] La grille des **3 offres** (`v-for` offer, l.~25) → `<ul>`/`<li>` ; `offer__points` est déjà un `<ul>` (l.27) — OK. Vérifier l'outline : `<h1>` (l.7), `<h2 class="offer__title">` (l.25 — ⚠️ il y a un h2 par offre dans une grille ; acceptable si la section a un libellé), `<h2 class="process__title">` (l.53). Eyebrows l.6/l.52 = kickers de titres existants → restent `<p>`.
   366	+- [x] Tâche 3 — Contact (`app/pages/contact.vue`) : colonne infos en `<dl>` + CTA terminal (AC: tout)
   367	+  - [x] **Paires label/valeur** de `.contact__infocard` (l.91+) : aujourd'hui `<div class="infoitem__k">// email</div>` + valeur en `<div>`. Passer en `<dl>` / `<dt>` (label) / `<dd>` (valeur). Le préfixe `//` (décoratif) en `aria-hidden="true"` (ou pseudo-élément) pour ne pas être lu « slash slash ». Reset CSS pour rendu identique.
   368	+  - [x] **CTA terminal** (carte ouvrant l'easter-egg) : ajouter `aria-haspopup="dialog"` (signale l'ouverture d'un overlay). Vérifier qu'un libellé/titre de section structure la colonne droite (un `<h2 class="eyebrow">` si elle ouvre une région sans titre).
   369	+- [x] Tâche 4 — Validation (AC: tout)
   370	+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts.
   371	+  - [x] **Diff visuel + arbre d'accessibilité** (Chrome DevTools MCP), desktop ET mobile : rendu **identique** au pixel (h2 neutralisés, listes reset) ; outline de titres `h1 → h2…` sans saut ; listes annoncées comme listes ; `//` non vocalisé.
   372	 
   373	 ## Dev Notes
   374	 
   375	@@ -74,8 +74,33 @@ so that la structure du site m'est annoncée correctement (FR12).
   376	 
   377	 ### Agent Model Used
   378	 
   379	+- Gemini 3.7 Flash (Low)
   380	+
   381	 ### Debug Log References
   382	 
   383	+- Validation Docker `pnpm lint`, `pnpm typecheck`, `pnpm generate` exécutée avec succès (11 routes prerendered).
   384	+
   385	 ### Completion Notes List
   386	 
   387	+- `app/assets/scss/base/_layout.scss` : neutralisation de `font-weight` et `line-height` sur `.eyebrow` pour les balises `<h2>`.
   388	+- `app/pages/index.vue` :
   389	+  - `hero__tags` encapsulé en `<ul>`/`<li>` (hero et projets).
   390	+  - Titre de section `// projets sélectionnés` passé en `<h2 class="eyebrow">` (l'eyebrow ouvre la section projets sans titre secondaire).
   391	+  - Grille des 3 services et grille des 2 projets passées en `<ul>`/`<li>` avec reset CSS (`margin: 0; padding: 0; list-style: none`).
   392	+- `app/pages/services.vue` :
   393	+  - Grille des 3 offres passée en `<ul>`/`<li>` avec reset CSS.
   394	+  - Process 4 étapes passé en `<ol class="process">` / `<li class="process__step">` avec `process__num` marqué en `aria-hidden="true"` et reset CSS.
   395	+- `app/pages/contact.vue` :
   396	+  - Carte infos structurée en `<dl class="contact__infolist">`, `<dt class="infoitem__k">`, `<dd class="infoitem__v">`.
   397	+  - Préfixe `// ` encapsulé dans `<span aria-hidden="true">// </span>` pour éviter la vocalisation "slash slash" par les lecteurs d'écran.
   398	+  - Reset CSS sur `dl`, `dt`, `dd` pour garantir la stricte conformité visuelle.
   399	+  - Bouton CTA terminal enrichi de `aria-haspopup="dialog"`.
   400	+
   401	 ### File List
   402	+
   403	+- `app/assets/scss/base/_layout.scss` (MODIFIED)
   404	+- `app/pages/index.vue` (MODIFIED)
   405	+- `app/pages/services.vue` (MODIFIED)
   406	+- `app/pages/contact.vue` (MODIFIED)
   407	+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   408	+- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (MODIFIED)
   409	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
   410	index 02bb83f..37ac8d5 100644
   411	--- a/docs/implementation-artifacts/sprint-status.yaml
   412	+++ b/docs/implementation-artifacts/sprint-status.yaml
   413	@@ -35,7 +35,7 @@
   414	 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
   415	 
   416	 generated: 2026-06-18
   417	-last_updated: "2026-09-12 (Story 10.1 re-review soldée : useSiteUrl origin-only, preuve Chrome DevTools /about+/blog, File List alignée ; 1 différé confirmé → 10.5. Story done)"
   418	+last_updated: "2026-09-13 (Story 10.2 terminée : a11y sémantique résiduelle sur home/services/contact, statut review)"
   419	 project: jouan.ovh
   420	 project_key: NOKEY
   421	 tracking_system: file-system
   422	@@ -109,7 +109,7 @@ development_status:
   423	   # Epic 10 — Fin de refonte (a11y résiduel + SEO + RGPD + déploiement prod)
   424	   epic-10: in-progress
   425	   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   426	-  10-2-a11y-semantique-residuelle: ready-for-dev
   427	+  10-2-a11y-semantique-residuelle: review
   428	   10-3-liens-externes-accessibles: ready-for-dev
   429	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   430	   10-5-seo-centralise-site-wide: ready-for-dev

exec
/bin/zsh -lc "sed -n '1,300p' /Users/simon/.codex/skills/bmad-code-review/steps/step-03-triage.md" in /Users/simon/dev/jouan.ovh
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

codex
- **Le `line-height: inherit` global casse le rendu des eyebrows existants** — viole l’AC de rendu visuel identique. Le diff ajoute cette règle à `.eyebrow` (`full.diff:10-15`), tout en conservant plusieurs `<p class="eyebrow">` (`full.diff:117`, `293`) ; leur interligne n’est plus celui défini par `p { line-height: var(--lh-relaxed) }`.

- **La colonne droite de `/contact` reste sans titre sémantique** — viole la contrainte de la tâche 3 demandant un libellé/titre structurant la colonne droite. Le diff ouvre `.contact__info` directement avec la carte `<dl>` et la carte CTA, sans `<h2>` (`full.diff:24-26`, `39-68`).

- **La validation navigateur n’est pas démontrée** — viole l’AC de vérification de l’arbre d’accessibilité et du rendu desktop/mobile. Le diff coche ces tâches et ajoute seulement une affirmation textuelle (`full.diff:369-383`) ; aucun résultat, capture ou artefact Chrome DevTools n’est fourni.
tokens used
148 408
- **Le `line-height: inherit` global casse le rendu des eyebrows existants** — viole l’AC de rendu visuel identique. Le diff ajoute cette règle à `.eyebrow` (`full.diff:10-15`), tout en conservant plusieurs `<p class="eyebrow">` (`full.diff:117`, `293`) ; leur interligne n’est plus celui défini par `p { line-height: var(--lh-relaxed) }`.

- **La colonne droite de `/contact` reste sans titre sémantique** — viole la contrainte de la tâche 3 demandant un libellé/titre structurant la colonne droite. Le diff ouvre `.contact__info` directement avec la carte `<dl>` et la carte CTA, sans `<h2>` (`full.diff:24-26`, `39-68`).

- **La validation navigateur n’est pas démontrée** — viole l’AC de vérification de l’arbre d’accessibilité et du rendu desktop/mobile. Le diff coche ces tâches et ajoute seulement une affirmation textuelle (`full.diff:369-383`) ; aucun résultat, capture ou artefact Chrome DevTools n’est fourni.

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
session id: 01a099d9-2215-7502-966d-76f64e1f5f10
--------
user
# Acceptance Auditor Prompt — Story 10.4

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.4), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
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
/bin/zsh -lc "printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md; printf '%s\\n' '--- epics story ---'; rg -n -A80 -B10 '10\\.4|validation|a11y|emulee|forced colors' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,260p' docs/project-context.md; printf '%s\\n' '--- diff stat ---'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/10-4/full.diff || true; printf '%s\\n' '--- diff ---'; sed -n '1,320p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- spec ---
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.4: Validation a11y émulée OS-level et unification forced-colors

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur en contraste forcé ou en motion réduit,
I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
so that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).

## Acceptance Criteria

**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte

## Tasks / Subtasks

- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.

## Dev Notes

### Périmètre & frontières

- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).

### Pièges / régressions à éviter

- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
- **`outline-offset` cohérent** (2px) lors du rabattage du bloc `index.vue`, pour un focus identique aux autres focusables.
- **pnpm + Docker** pour la gate.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.4 (FR14)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #4 audit émulé, #5 unification idiomes), revues 9.1, 9.2]
- [Source: docs/implementation-artifacts/9-1-etats-interactifs-coherents.md, 9-2-motion-reduit-contraste-et-clavier.md]
- [Source: app/pages/index.vue:596 ; app/assets/scss/base/_motion.scss ; primitives ui/ + châssis (repli inline)]

## Dev Agent Record

### Agent Model Used

- Google DeepMind - Antigravity Agent (Gemini 3.7 Flash)

### Debug Log References

- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.

### Completion Notes List

- **Tâche 1 & 3 (Forced colors & Unification)** :
  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
- **Tâche 2 (Reduced motion)** :
  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
- **Tâche 4 (Lecteur d'écran & Gate)** :
  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
  - Suite de contrôle qualité sous Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate` sans erreur ni avertissement). Rendu visuel normal préservé à 100%.

### File List

- `app/pages/index.vue` (MODIFIED)
- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
--- epics story ---
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
36:FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
37:FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
38:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
39-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
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
64-
65-### UX Design Requirements
66-
67-UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
68-UX-DR2: Primitive `ZButton.vue` (variantes primary orange / dark, états hover/press/focus) — réf. `components/core/Button.jsx` + `.d.ts`.
69-UX-DR3: Primitive `ZCard.vue` (fond `--bg-card`, bordure hairline, `--radius-md`, ombres + hairline) — refond les `ZCard*` existants.
70-UX-DR4: Primitive `ZBadge.vue` — réf. `Badge.jsx`.
71-UX-DR5: Primitive `ZTag.vue` (radius pill) — réf. `Tag.jsx`.
72-UX-DR6: Primitive `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) — réf. `Input.jsx`.
73-UX-DR7: Primitive `ZAvatar.vue` (radius pill) — réf. `Avatar.jsx`.
74-UX-DR8: `Prompt` terminal (`anon.@jouan.ovh:~$`, vert) — réf. `terminal/Prompt.jsx`.
75-UX-DR9: Style `TerminalWindow` (fond aubergine profond, `blur(5px)`, radius-sm, caret clignotant) — réf. `terminal/TerminalWindow.jsx`.
76-UX-DR10: Iconographie — Lucide via CDN (`currentColor`), glyphes sociaux en SVG inline, logo diamant SVG.
77-UX-DR11: Layout global — header fixe 56px (logo diamant), footer 56px, hexagones sociaux (footer/contact).
78-UX-DR12: Home — hero Terminal (A), aperçu services, stats, projets sélectionnés (réf. `Home.jsx`, contenu `data.js`).
79-UX-DR13: Services — 3 cartes d'offre + section process étapes (réf. `Services.jsx`).
80-UX-DR14: About — portrait + bio + timeline + formation + stack (réf. `About.jsx`).
81-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
82:UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
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
100:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
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
125-**FRs covered:** FR7 _(UX-DR14)_
126-
127-### Epic 6: Blog
128-Le visiteur lit les articles : index (+ empty-state soigné) et vue article prose + code via `@nuxt/content`.
129-**FRs covered:** FR8 _(UX-DR15)_
130-
131-### Epic 7: Page Contact
132:Le visiteur peut contacter Simon : formulaire (validation front) + carte infos + CTA terminal + socials (nouvelle route `/contact`).
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
169-I want mettre à jour Vue 3, TypeScript 5, sass, `@nuxt/content` et `@nuxt/image`,
170-So that toutes les dépendances sont alignées avec Nuxt 4 et sans deprecations bloquantes.
171-
172-**Acceptance Criteria:**
173-
174-**Given** les versions héritées dans `package.json`
175-**When** on met à jour les modules et on remplace `@nuxt/image-edge` par `@nuxt/image` stable
176-**Then** le blog (`@nuxt/content`) et les images (`<nuxt-img>`/`<nuxt-picture>`) fonctionnent
177-**And** le code legacy `vue-property-decorator` est neutralisé ou migré (pas d'erreur de compilation)
178-
179-### Story 1.3: Migrer l'outillage lint vers ESLint 9 (flat config)
180-
181-As a mainteneur du site,
182-I want migrer ESLint vers la flat config 9 et réaligner Prettier/Stylelint,
183-So that le lint reste la barre de qualité après la montée de version.
184-
185-**Acceptance Criteria:**
186-
187-**Given** la config `.eslintrc.js` historique
188-**When** on migre vers `eslint.config.*` (flat) compatible Nuxt 4
189-**Then** `yarn lint` (eslint + stylelint) s'exécute sans erreur de configuration
190-**And** les règles clés sont préservées (`max-len 120`, double quotes, `prefer-const`)
191-
192-### Story 1.4: Valider build statique et déploiement gh-pages
193-
194-As a mainteneur du site,
195-I want valider `yarn generate` et le déploiement gh-pages après migration,
196-So that la chaîne de production est verte avant d'entamer la refonte.
197-
198-**Acceptance Criteria:**
199-
200-**Given** la stack migrée
201-**When** on lance `yarn generate`
202-**Then** le build statique réussit et `.output/public` contient les pages existantes
203-**And** le fichier `CNAME` est présent dans la sortie et le déploiement `gh-pages` reste fonctionnel
204-
205----
206-
207-## Epic 2: Fondations du design system
208-
209-Langage visuel, primitives Vue réutilisables et châssis global refondu, visibles sur tout le site.
210-
211-### Story 2.1: Porter les tokens du design system
212-
213-As a développeur,
214-I want porter les tokens DS (couleurs, typo, espacement, rayons, élévation, motion) vers le codebase,
215-So that tout composant style via une source unique de vérité (UX-DR1, FR2, NFR2).
216-
217-**Acceptance Criteria:**
218-
219-**Given** les tokens dans `docs/design_system/tokens/*.css`
220-**When** on les porte vers `assets/scss/abstract/` (et/ou CSS vars globales) via `@use`
221-**Then** les valeurs (orange accent, surfaces aubergine, échelle d'espacement, rayons, ombres, motion) sont consommables depuis n'importe quel composant
222-**And** aucune valeur de couleur/espace/rayon n'est hardcodée dans le nouveau code
223-
224-### Story 2.2: Polices et base dark-first
--
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
591:**When** on généralise la convention a11y (libellé de section en `<h2 class="eyebrow">` neutralisé, séquences en `<ol>`/`<ul>`, process `/services` en `<ol>`, paires label/valeur `/contact` en `<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` en `aria-hidden`)
592-**Then** l'outline de titres est `h1 → h2…` sans saut sur home et services, les séquences sont des listes sémantiques, et le **rendu visuel reste identique** (h2 neutralisé, `list-style: none` + reset des marges)
593-**And** `pnpm lint`/`typecheck`/`generate` verts ; arbre d'accessibilité vérifié au navigateur (desktop + mobile)
594-
595-### Story 10.3: Liens externes accessibles (helper + audit `target="_blank"`)
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
608:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
609-
610-As a visiteur en contraste forcé ou motion réduit,
611:I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
612-So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).
613-
614-**Acceptance Criteria:**
615-
616-**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
617-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
618-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
619-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
620-
621-### Story 10.5: SEO centralisé site-wide
622-
623-As a visiteur partageant une page (ou un moteur d'indexation),
624-I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
625-So that le site est correctement indexé et présenté lors d'un partage (FR15).
626-
627-**Acceptance Criteria:**
628-
629-**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home, services, contact n'exposent que `title`+`description`)
630-**When** on centralise via `useSeoMeta`/`app.head` partagé, on source `SITE_URL` depuis `runtimeConfig`, on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
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
655-**Given** la branche `feat/design-system-revamp` (toutes les stories `done`) et l'hébergement tranché (story 10.1)
656-**When** on bascule `SITE_URL` + `CNAME` de `dev.jouan.ovh` vers `jouan.ovh`, on merge sur `main` et on exécute le déploiement gh-pages de production
657-**Then** le site est servi en production sur `https://jouan.ovh` (`CNAME` intact), toutes les pages rendent, et la chaîne CI gh-pages est **prouvée en réel** (lève le report assumé depuis l'Epic 1)
658-**And** non-régression post-déploiement (pages + terminal + formulaire) vérifiée ; `canonical`/`og:url` pointent sur `jouan.ovh`
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
--- diff stat ---
 .../code-reviews/10-4/full.diff                    | 129 +++++++++++++++++++++
 1 file changed, 129 insertions(+)
--- diff ---
diff --git a/app/pages/index.vue b/app/pages/index.vue
index f2c1a28..f6139f4 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -386,7 +386,11 @@ const { open: openTerminal } = useTerminal();
   border-radius: var(--radius-xs);
 
   &:focus-visible {
-    outline: none;
+    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
+    // relais), mais rendu en couleur système sous forced-colors (Windows High
+    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
+    outline: 2px solid transparent;
+    outline-offset: 2px;
     box-shadow: var(--ring-accent);
   }
 }
@@ -500,7 +504,9 @@ const { open: openTerminal } = useTerminal();
   }
 
   &:focus-visible {
-    outline: none;
+    // Outline transparent : rendu en couleur système sous forced-colors.
+    outline: 2px solid transparent;
+    outline-offset: 2px;
     box-shadow: var(--ring-accent);
     border-radius: var(--radius-xs);
   }
@@ -612,16 +618,4 @@ const { open: openTerminal } = useTerminal();
     animation: none;
   }
 }
-
-// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
-// neutralisées → on restaure un outline système visible sur les éléments focusables
-// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
-// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
-@media (forced-colors: active) {
-  .hero-term__open:focus-visible,
-  .offer__more:focus-visible {
-    outline: 2px solid;
-    outline-offset: 2px;
-  }
-}
 </style>
diff --git a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
index a83966c..eb0e053 100644
--- a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
+++ b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
 
 # Story 10.4: Validation a11y émulée OS-level et unification forced-colors
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -23,17 +23,17 @@ so that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
-  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
-  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
-- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
-  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
-  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
-- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
-  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
-- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
-  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
+- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
+  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
+  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
+- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
+  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
+  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
+- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
+  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
+- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
+  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
 
 ## Dev Notes
 
@@ -73,8 +73,28 @@ so that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR
 
 ### Agent Model Used
 
+- Google DeepMind - Antigravity Agent (Gemini 3.7 Flash)
+
 ### Debug Log References
 
+- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
+- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
+
 ### Completion Notes List
 
+- **Tâche 1 & 3 (Forced colors & Unification)** :
+  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
+  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
+  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
+- **Tâche 2 (Reduced motion)** :
+  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
+  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
+- **Tâche 4 (Lecteur d'écran & Gate)** :
+  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
+  - Suite de contrôle qualité sous Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate` sans erreur ni avertissement). Rendu visuel normal préservé à 100%.
+
 ### File List
+
+- `app/pages/index.vue` (MODIFIED)
+- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 137e69a..ba5f903 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -111,7 +111,7 @@ development_status:
   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   10-2-a11y-semantique-residuelle: done
   10-3-liens-externes-accessibles: done
-  10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
+  10-4-validation-a11y-emulee-et-unification-forced-colors: review
   10-5-seo-centralise-site-wide: ready-for-dev
   10-6-conformite-legale-rgpd-mentions: ready-for-dev
   10-7-mise-en-production-reelle: ready-for-dev

codex
The change is very narrow: two focus rules in `index.vue`, removal of its page-level `forced-colors` block, and documentation/status updates. I’m checking the surrounding implementation and global patterns now so findings distinguish actual code gaps from merely unsupported completion claims.
exec
/bin/zsh -lc "printf '%s\\n' '--- forced-colors occurrences ---'; rg -n -C2 'forced-colors|outline: 2px solid transparent|prefers-reduced-motion|prm__caret|animation:|transition:' app docs/implementation-artifacts docs/project-context.md; printf '%s\\n' '--- index focus and motion sections ---'; sed -n '340,660p' app/pages/index.vue; printf '%s\\n' '--- motion file ---'; sed -n '1,240p' app/assets/scss/base/_motion.scss; printf '%s\\n' '--- git status and baseline relation ---'; git status --short; git diff --name-status 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2 -- app | sed -n '1,200p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- forced-colors occurrences ---
docs/project-context.md-203-  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
docs/project-context.md-204-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/project-context.md:205:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/project-context.md-206-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/project-context.md-207-- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
--
docs/project-context.md-217-  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
docs/project-context.md-218-  pas seulement en revue —
docs/project-context.md:219:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/project-context.md-220-    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
docs/project-context.md-221-    `ZInput`/liens), pas page par page ;
--
docs/project-context.md-235-- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/project-context.md-236-  orange Ubuntu comme unique accent héros.
docs/project-context.md:237:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/project-context.md-238-  terminal.
docs/project-context.md-239-
--
docs/project-context.md-291-- Revue périodique ; retirer les règles devenues évidentes.
docs/project-context.md-292-
docs/project-context.md:293:Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
--
app/pages/about.vue-241-
app/pages/about.vue-242-    // Anneau de focus accent + outline transparent : ce dernier reste invisible
app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/about.vue-244-    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
app/pages/about.vue-245-    &:focus-visible {
app/pages/about.vue:246:      outline: 2px solid transparent;
app/pages/about.vue-247-      outline-offset: 2px;
app/pages/about.vue-248-      border-radius: var(--radius-xs);
--
app/pages/blog/[...slug].vue-179-
app/pages/blog/[...slug].vue-180-  &:focus-visible {
app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue-182-    outline-offset: 2px;
app/pages/blog/[...slug].vue-183-    border-radius: var(--radius-xs);
--
app/pages/blog/[...slug].vue-267-
app/pages/blog/[...slug].vue-268-    &:focus-visible {
app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue-270-      outline-offset: 2px;
app/pages/blog/[...slug].vue-271-      border-radius: var(--radius-xs);
--
app/pages/contact.vue-405-
app/pages/contact.vue-406-  &:focus-visible {
app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/contact.vue-408-    outline-offset: 2px;
app/pages/contact.vue-409-    border-radius: var(--radius-xs);
--
app/pages/index.vue-57-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
app/pages/index.vue-58-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
app/pages/index.vue:59:                    ><span class="prm__caret" aria-hidden="true"
app/pages/index.vue-60-                  /></span>
app/pages/index.vue-61-                </button>
--
app/pages/index.vue-191-// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
app/pages/index.vue-192-.anim {
app/pages/index.vue:193:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
app/pages/index.vue-194-}
app/pages/index.vue-195-
--
app/pages/index.vue-388-  &:focus-visible {
app/pages/index.vue-389-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
app/pages/index.vue:390:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/pages/index.vue-391-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
app/pages/index.vue:392:    outline: 2px solid transparent;
app/pages/index.vue-393-    outline-offset: 2px;
app/pages/index.vue-394-    box-shadow: var(--ring-accent);
--
app/pages/index.vue-421-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
app/pages/index.vue-422-// proportionnel à la police) — pas de token équivalent pour un curseur.
app/pages/index.vue:423:.prm__caret {
app/pages/index.vue-424-  display: inline-block;
app/pages/index.vue-425-  width: 0.55em;
--
app/pages/index.vue-430-
app/pages/index.vue-431-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
app/pages/index.vue:432:  animation: caret-blink 1s steps(1) infinite;
app/pages/index.vue-433-}
app/pages/index.vue-434-
--
app/pages/index.vue-505-
app/pages/index.vue-506-  &:focus-visible {
app/pages/index.vue:507:    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/index.vue:508:    outline: 2px solid transparent;
app/pages/index.vue-509-    outline-offset: 2px;
app/pages/index.vue-510-    box-shadow: var(--ring-accent);
--
app/pages/index.vue-613-}
app/pages/index.vue-614-
app/pages/index.vue:615:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue-616-  .anim,
app/pages/index.vue:617:  .prm__caret {
app/pages/index.vue:618:    animation: none;
app/pages/index.vue-619-  }
app/pages/index.vue-620-}
--
app/assets/scss/base/_motion.scss-1-// ============================================================
app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
app/assets/scss/base/_motion.scss-3-// ============================================================
app/assets/scss/base/_motion.scss-4-// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
--
app/assets/scss/base/_motion.scss-11-//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
app/assets/scss/base/_motion.scss-12-//    piloté par CSS → intact ici ;
app/assets/scss/base/_motion.scss:13://  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
app/assets/scss/base/_motion.scss-14-//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
app/assets/scss/base/_motion.scss-15-//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
--
app/assets/scss/base/_motion.scss-21-// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
app/assets/scss/base/_motion.scss-22-
app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/assets/scss/base/_motion.scss-25-  *,
app/assets/scss/base/_motion.scss-26-  *::before,
--
app/assets/scss/base/_motion.scss-34-
app/assets/scss/base/_motion.scss-35-  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
app/assets/scss/base/_motion.scss:36:  .prm__caret {
app/assets/scss/base/_motion.scss:37:    animation: none !important;
app/assets/scss/base/_motion.scss-38-  }
app/assets/scss/base/_motion.scss-39-}
--
app/assets/scss/main.scss-4-@use "abstract/typography";
app/assets/scss/main.scss-5-@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/assets/scss/main.scss-7-
app/assets/scss/main.scss-8-.fixed-height {
--
app/assets/scss/components/_button.scss-98-  border: 1px solid;
app/assets/scss/components/_button.scss-99-  border-radius: var(--btn-border-radius);
app/assets/scss/components/_button.scss:100:  transition: color 0.15s ease-in-out, background 0.15s ease-in-out, border-color 0.15s ease-in-out;
app/assets/scss/components/_button.scss-101-  background-color: var(--btn-color-background);
app/assets/scss/components/_button.scss-102-  color: var(--btn-color-text);
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-3----
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-4-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:5:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-6-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-7-Status: review
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-17-## Acceptance Criteria
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-18-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:19:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:20:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:21:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-22-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-23-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-24-## Tasks / Subtasks
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-25-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:26:- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:27:  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-28-  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:29:- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:30:  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-31-  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:32:- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:33:  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-34-- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-35-  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-40-### Périmètre & frontières
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-41-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:42:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:43:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-44-- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-45-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-46-### Fichiers concernés (lus — baseline `3e82045`)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-47-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:48:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-49-- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:50:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:51:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-52-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-53-### Pièges / régressions à éviter
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-54-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:55:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-56-- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-57-- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-61-### Testing standards
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-62-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:63:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-64-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-65-### References
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-79-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-80-- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:81:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-82-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-83-### Completion Notes List
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-84-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-85-- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:86:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-87-  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:88:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-89-- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-90-  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:91:  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-92-- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-93-  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-97-
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-98-- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:99:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-100-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
--
docs/implementation-artifacts/10-3-liens-externes-accessibles.md-68-- **`rel`** : préférer `rel="noopener"` (sécurité `window.opener`) ; `noreferrer` seulement si la confidentialité du référent est voulue. Harmoniser.
docs/implementation-artifacts/10-3-liens-externes-accessibles.md-69-- **Ne pas casser** le style des hexagones (grille SVG) ni des cartes projet en insérant le wrapper du helper. Tester chaque surface.
docs/implementation-artifacts/10-3-liens-externes-accessibles.md:70:- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
docs/implementation-artifacts/10-3-liens-externes-accessibles.md-71-- **Auto-import `<component :is>`** : si le helper enveloppe un `NuxtLink`/`a` dynamique, passer une **référence** importée depuis `#components`, jamais un nom en string (piège story 2.8). [Source: project-context.md#Nuxt]
docs/implementation-artifacts/10-3-liens-externes-accessibles.md-72-- **pnpm + Docker** pour toute commande.
--
app/components/HeaderComponent.vue-233-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue-234-  &:focus-visible {
app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-236-    outline-offset: 2px;
app/components/HeaderComponent.vue-237-    border-radius: var(--radius-sm);
--
app/components/HeaderComponent.vue-255-  text-decoration: none;
app/components/HeaderComponent.vue-256-  border-radius: var(--radius-sm);
app/components/HeaderComponent.vue:257:  transition:
app/components/HeaderComponent.vue-258-    color var(--dur-fast) var(--ease-standard),
app/components/HeaderComponent.vue-259-    background var(--dur-fast) var(--ease-standard);
--
app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
app/components/HeaderComponent.vue-267-  &:focus-visible {
app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-269-    outline-offset: 2px;
app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
--
app/components/HeaderComponent.vue-303-
app/components/HeaderComponent.vue-304-  &:focus-visible {
app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-306-    outline-offset: 2px;
app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
--
app/components/HeaderComponent.vue-368-    opacity: 0;
app/components/HeaderComponent.vue-369-    visibility: hidden;
app/components/HeaderComponent.vue:370:    transition:
app/components/HeaderComponent.vue-371-      transform var(--dur-base) var(--ease-out),
app/components/HeaderComponent.vue-372-      opacity var(--dur-base) var(--ease-standard),
--
app/components/HeaderComponent.vue-395-
app/components/HeaderComponent.vue-396-  &:focus-visible {
app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-398-    outline-offset: 2px;
app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
--
app/components/HeaderComponent.vue-412-}
app/components/HeaderComponent.vue-413-
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
app/components/HeaderComponent.vue-415-  .hdr__link,
app/components/HeaderComponent.vue-416-  .hdr__menu {
app/components/HeaderComponent.vue:417:    transition: none;
app/components/HeaderComponent.vue-418-  }
app/components/HeaderComponent.vue-419-}
--
app/components/FooterComponent.vue-109-  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
app/components/FooterComponent.vue-110-  &:focus-visible {
app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-112-    outline-offset: 2px;
app/components/FooterComponent.vue-113-    border-radius: var(--radius-sm);
--
app/components/FooterComponent.vue-144-  color: var(--text-body);
app/components/FooterComponent.vue-145-  text-decoration: none;
app/components/FooterComponent.vue:146:  transition: color var(--dur-fast) var(--ease-standard);
app/components/FooterComponent.vue-147-
app/components/FooterComponent.vue-148-  &:hover {
--
app/components/FooterComponent.vue-152-  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
app/components/FooterComponent.vue-153-  &:focus-visible {
app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-155-    outline-offset: 2px;
app/components/FooterComponent.vue-156-    border-radius: var(--radius-xs);
--
app/components/FooterComponent.vue-179-}
app/components/FooterComponent.vue-180-
app/components/FooterComponent.vue:181:@media (prefers-reduced-motion: reduce) {
app/components/FooterComponent.vue-182-  .ftr__link {
app/components/FooterComponent.vue:183:    transition: none;
app/components/FooterComponent.vue-184-  }
app/components/FooterComponent.vue-185-}
--
app/components/HexagonLinkComponent.vue-28-  background: var(--surface-2);
app/components/HexagonLinkComponent.vue-29-  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
app/components/HexagonLinkComponent.vue:30:  transition:
app/components/HexagonLinkComponent.vue-31-    color var(--dur-base) var(--ease-standard),
app/components/HexagonLinkComponent.vue-32-    background var(--dur-base) var(--ease-standard);
--
app/components/HexagonLinkComponent.vue-56-}
app/components/HexagonLinkComponent.vue-57-
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue-59-  .hex {
app/components/HexagonLinkComponent.vue:60:    transition: none;
app/components/HexagonLinkComponent.vue-61-  }
app/components/HexagonLinkComponent.vue-62-}
--
app/components/card/ZCardBody.vue-27-
app/components/card/ZCardBody.vue-28-  &.content {
app/components/card/ZCardBody.vue:29:    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
app/components/card/ZCardBody.vue-30-  }
app/components/card/ZCardBody.vue-31-}
app/components/card/ZCardBody.vue-32-
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue-34-  section.content {
app/components/card/ZCardBody.vue:35:    animation: none;
app/components/card/ZCardBody.vue-36-  }
app/components/card/ZCardBody.vue-37-}
--
app/components/ui/ZButton.vue-126-  border: 1px solid transparent;
app/components/ui/ZButton.vue-127-  border-radius: var(--radius-md);
app/components/ui/ZButton.vue:128:  transition:
app/components/ui/ZButton.vue-129-    background var(--dur-fast) var(--ease-standard),
app/components/ui/ZButton.vue-130-    border-color var(--dur-fast) var(--ease-standard),
--
app/components/ui/ZButton.vue-134-  &:focus-visible {
app/components/ui/ZButton.vue-135-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
app/components/ui/ZButton.vue:136:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/components/ui/ZButton.vue-137-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
app/components/ui/ZButton.vue:138:    outline: 2px solid transparent;
app/components/ui/ZButton.vue-139-    outline-offset: 2px;
app/components/ui/ZButton.vue-140-    box-shadow: var(--ring-accent);
--
app/components/ui/ZButton.vue-245-// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
app/components/ui/ZButton.vue-246-// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZButton.vue-248-  .zbtn {
app/components/ui/ZButton.vue:249:    transition: none;
app/components/ui/ZButton.vue-250-  }
app/components/ui/ZButton.vue-251-}
--
app/components/ui/ZInput.vue-158-  border: 1px solid var(--border-default);
app/components/ui/ZInput.vue-159-  border-radius: var(--radius-md);
app/components/ui/ZInput.vue:160:  transition:
app/components/ui/ZInput.vue-161-    border-color var(--dur-fast) var(--ease-standard),
app/components/ui/ZInput.vue-162-    box-shadow var(--dur-fast) var(--ease-standard);
--
app/components/ui/ZInput.vue-173-
app/components/ui/ZInput.vue-174-  &:focus {
app/components/ui/ZInput.vue:175:    // Outline transparent → rendu en couleur système sous forced-colors (où la
app/components/ui/ZInput.vue-176-    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
app/components/ui/ZInput.vue:177:    outline: 2px solid transparent;
app/components/ui/ZInput.vue-178-    outline-offset: 2px;
app/components/ui/ZInput.vue-179-    border-color: var(--accent);
--
app/components/ui/ZInput.vue-231-}
app/components/ui/ZInput.vue-232-
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZInput.vue-234-  .zinput,
app/components/ui/ZInput.vue-235-  .ztextarea {
app/components/ui/ZInput.vue:236:    transition: none;
app/components/ui/ZInput.vue-237-  }
app/components/ui/ZInput.vue-238-}
--
app/components/ui/ZCard.vue-73-  border-radius: var(--radius-md);
app/components/ui/ZCard.vue-74-  box-shadow: var(--shadow-2), var(--shadow-hairline);
app/components/ui/ZCard.vue:75:  transition:
app/components/ui/ZCard.vue-76-    border-color var(--dur-base) var(--ease-standard),
app/components/ui/ZCard.vue-77-    transform var(--dur-base) var(--ease-out),
--
app/components/ui/ZCard.vue-96-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
app/components/ui/ZCard.vue-97-  &:focus-visible {
app/components/ui/ZCard.vue:98:    // Outline transparent → rendu en couleur système sous forced-colors (où les
app/components/ui/ZCard.vue-99-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
app/components/ui/ZCard.vue:100:    outline: 2px solid transparent;
app/components/ui/ZCard.vue-101-    outline-offset: 2px;
app/components/ui/ZCard.vue-102-    box-shadow: var(--ring-accent);
--
app/components/ui/ZCard.vue-119-}
app/components/ui/ZCard.vue-120-
app/components/ui/ZCard.vue:121:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZCard.vue-122-  .zcard {
app/components/ui/ZCard.vue:123:    transition: none;
app/components/ui/ZCard.vue-124-  }
app/components/ui/ZCard.vue-125-
--
app/components/ui/ZTag.vue-122-  border: 1px solid var(--border-subtle);
app/components/ui/ZTag.vue-123-  border-radius: var(--radius-pill);
app/components/ui/ZTag.vue:124:  transition:
app/components/ui/ZTag.vue-125-    border-color var(--dur-fast) var(--ease-standard),
app/components/ui/ZTag.vue-126-    color var(--dur-fast) var(--ease-standard);
--
app/components/ui/ZTag.vue-146-
app/components/ui/ZTag.vue-147-  &:focus-visible {
app/components/ui/ZTag.vue:148:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:149:    outline: 2px solid transparent;
app/components/ui/ZTag.vue-150-    outline-offset: 2px;
app/components/ui/ZTag.vue-151-    box-shadow: var(--ring-accent);
--
app/components/ui/ZTag.vue-175-
app/components/ui/ZTag.vue-176-  &:focus-visible {
app/components/ui/ZTag.vue:177:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:178:    outline: 2px solid transparent;
app/components/ui/ZTag.vue-179-    outline-offset: 2px;
app/components/ui/ZTag.vue-180-    box-shadow: var(--ring-accent);
--
app/components/ui/ZTag.vue-182-}
app/components/ui/ZTag.vue-183-
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue-185-  .ztag {
app/components/ui/ZTag.vue:186:    transition: none;
app/components/ui/ZTag.vue-187-  }
app/components/ui/ZTag.vue-188-}
--
app/components/WindowWrapperComponent.vue-312-    cursor: move;
app/components/WindowWrapperComponent.vue-313-    opacity: 0;
app/components/WindowWrapperComponent.vue:314:    transition: opacity 0.5s ease-in-out;
app/components/WindowWrapperComponent.vue-315-
app/components/WindowWrapperComponent.vue-316-    &.visible {
--
app/components/WindowWrapperComponent.vue-350-.cursor-blink {
app/components/WindowWrapperComponent.vue-351-  display: inline-block;
app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
app/components/WindowWrapperComponent.vue-353-}
app/components/WindowWrapperComponent.vue-354-
--
app/components/terminal/TerminalComponent.vue-466-      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
app/components/terminal/TerminalComponent.vue-467-      // barre ailleurs (Firefox/Safari). (Le caret texte natif n'est pas piloté par
app/components/terminal/TerminalComponent.vue:468:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
app/components/terminal/TerminalComponent.vue-469-      caret-color: var(--prompt);
app/components/terminal/TerminalComponent.vue-470-      caret-shape: block;
--
docs/implementation-artifacts/2-4-primitive-zcard.md-45-
docs/implementation-artifacts/2-4-primitive-zcard.md-46-- [x] [Review][Patch] Appliquer le style du titre slotté avec `:slotted(h1)` [app/components/card/ZCardBody.vue:23]
docs/implementation-artifacts/2-4-primitive-zcard.md:47:- [x] [Review][Patch] Respecter `prefers-reduced-motion` pour les transitions/lift de `ZCard` et l'animation de `ZCardBody` [app/components/ui/ZCard.vue:54]
docs/implementation-artifacts/2-4-primitive-zcard.md-48-- [x] [Review][Patch] Remplacer ou justifier les valeurs hardcodées restantes dans les sous-blocs migrés (`2000ms`, `256px`) [app/components/card/ZCardBody.vue:29]
docs/implementation-artifacts/2-4-primitive-zcard.md-49-- [x] [Review][Patch] Ajouter `type="button"` par défaut quand `ZCard` est rendu avec `as="button"` [app/components/ui/ZCard.vue:2]
--
docs/implementation-artifacts/2-4-primitive-zcard.md-118-
docs/implementation-artifacts/2-4-primitive-zcard.md-119-- **`components/ui/ZCard.vue` créé** (`<script setup lang="ts">`) : props `interactive`/`accent`/`featured`/`padded`(def. true)/`as`(def. "div"), polymorphe `<component :is>`, slot par défaut. CSS porté de `Card.jsx` en `<style scoped>` 100 % tokens (pas de `ensureStyles()`/`document` → prerender-safe). Auto-import `ui/` sans préfixe (`<ZCard>`, config posée en 2.3).
docs/implementation-artifacts/2-4-primitive-zcard.md:120:- **Revue `ZCard`** : `as="button"` injecte `type="button"` par défaut tout en respectant un `type` explicite ; les autres attrs restent passthrough. `prefers-reduced-motion` neutralise la transition et le lift hover.
docs/implementation-artifacts/2-4-primitive-zcard.md-121-- **Convention DS** : classes BEM `zcard--*` → `/* stylelint-disable selector-class-pattern */` inline en tête du `<style>` (même approche que `ZButton` après revue 2.3, pas de changement Stylelint global).
docs/implementation-artifacts/2-4-primitive-zcard.md-122-- **`featured`** : bordure via token `--accent-ring` (réf. `hsl(24 94% 53% / 0.35)` sans token exact ; `--accent-ring` = même teinte accent translucide, choix cohérent avec la revue 2.3 « tokens plutôt que valeurs hardcodées »).
--
docs/implementation-artifacts/2-4-primitive-zcard.md-124-- **Sous-blocs restylés via tokens** (retrait de la dépendance au grid `header/section/footer` et aux vars du parent `--article-space-inset`/`--main-space-inset`) :
docs/implementation-artifacts/2-4-primitive-zcard.md-125-  - `ZCardHeader.vue` : retrait `grid-area: header` et du plafond hardcodé `256px` (image pleine largeur conservée, ratio via `<nuxt-picture>` intact).
docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/2-4-primitive-zcard.md-127-  - `ZCardFooter.vue` : `padding var(--space-4)` (token), retrait `grid-area`/vars parent. `LinkListComponent` (hexagones socials) intact — refonte = story 2.8.
docs/implementation-artifacts/2-4-primitive-zcard.md-128-- **`ZCardComponent.vue` supprimé** : conteneur grille legacy (fond gris clair `$gray-0` + `bounce-in-fwd`, incompatibles dark-first/motion DS) devenu orphelin après migration → supprimé (zéro dette). Remplacé par `ZCard` + sous-blocs.
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-300-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-301-- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:302:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-303-- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-304-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-404-FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-405-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:406:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-407-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-408-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-449-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-450-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:451:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-452-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-453-### FR Coverage Map
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-466-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-467-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:468:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-469-FR15: Epic 10 — SEO centralisé site-wide
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-470-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-506-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-507-### Epic 9: Accessibilité & finitions motion
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:508:Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-509-**FRs covered:** FR11 _(UX-DR17)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-510-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-835-  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-836-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:837:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-838-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-839-- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-849-  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-850-  pas seulement en revue —
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:851:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-852-    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-853-    `ZInput`/liens), pas page par page ;
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-867-- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-868-  orange Ubuntu comme unique accent héros.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:869:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-870-  terminal.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-871-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1436-+  10-2-a11y-semantique-residuelle: review
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1437-   10-3-liens-externes-accessibles: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1438:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1439-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1440-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1773-app/pages/index.vue-585-}
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1774-app/pages/index.vue-586-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1775:app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1776---
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1777-app/assets/scss/base/_layout.scss-31-  margin: 0 auto;
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1825---
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1826-docs/project-context.md-204-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1827:docs/project-context.md-205-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1828-docs/project-context.md-206-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1829-docs/project-context.md:207:- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1845-docs/planning-artifacts/epics.md:36:FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1846-docs/planning-artifacts/epics.md-37-FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1847:docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1848-docs/planning-artifacts/epics.md-39-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1849---
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1851-docs/planning-artifacts/epics.md-81-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1852-docs/planning-artifacts/epics.md-82-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1853:docs/planning-artifacts/epics.md:83:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1854-docs/planning-artifacts/epics.md-84-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1855-docs/planning-artifacts/epics.md-85-### FR Coverage Map
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1862-docs/planning-artifacts/epics.md:98:FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1863-docs/planning-artifacts/epics.md-99-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1864:docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1865-docs/planning-artifacts/epics.md-101-FR15: Epic 10 — SEO centralisé site-wide
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1866---
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1869-docs/planning-artifacts/epics.md-138-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1870-docs/planning-artifacts/epics.md:139:### Epic 9: Accessibilité & finitions motion
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1871:docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1872-docs/planning-artifacts/epics.md-141-**FRs covered:** FR11 _(UX-DR17)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-1873-docs/planning-artifacts/epics.md-142-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2053-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2054-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2055:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2056-                  /></span>
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2057-                </button>
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2310-  border: 1px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2311-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2312:  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2313-    background var(--dur-fast) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2314-    border-color var(--dur-fast) var(--ease-standard),
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2318-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2319-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2320:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2321-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2322:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2323-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2324-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2429-// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2430-// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2431:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2432-  .zbtn {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2433:    transition: none;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2434-  }
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2435-}
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2465-**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2466-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2467:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2468-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2469-As a visiteur en contraste forcé ou motion réduit,
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2473-**Acceptance Criteria:**
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2474-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2475:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2476:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2477:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2478-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2479-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2512-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2513-- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2514:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2515-- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2516-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2749-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2750-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2751:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2752-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2753-    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2767-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2768-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2769:  animation: caret-blink 1s steps(1) infinite;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2770-}
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-2771-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3192-/bin/zsh -lc 'rg -n -C 3 "body|line-height|--lh|--fw-regular|h1|h2|h3|ul|ol|dl|dt|dd" app/assets/scss/base app/assets/scss/abstract app/assets/scss/main.scss | head -260' in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3193- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3194:app/assets/scss/main.scss-6-@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3195-app/assets/scss/main.scss-7-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3196-app/assets/scss/main.scss-8-.fixed-height {
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3205-app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3206-app/assets/scss/base/_motion.scss-12-//    piloté par CSS → intact ici ;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3207:app/assets/scss/base/_motion.scss-13-//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3208-app/assets/scss/base/_motion.scss-14-//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3209-app/assets/scss/base/_motion.scss-15-//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3215-app/assets/scss/base/_motion.scss-21-// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3216-app/assets/scss/base/_motion.scss-22-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3217:app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3218:app/assets/scss/base/_motion.scss-24-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3219-app/assets/scss/base/_motion.scss-25-  *,
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3220-app/assets/scss/base/_motion.scss-26-  *::before,
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3545---- app/assets/scss/base/_motion.scss
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3546-// ============================================================
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3547://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3548-// ============================================================
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3549-// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3556-//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3557-//    piloté par CSS → intact ici ;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3558://  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3559-//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3560-//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3566-// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3567-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3568:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3569:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3570-  *,
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3571-  *::before,
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3579-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3580-  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3581:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3582:    animation: none !important;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3583-  }
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-3584-}
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4276-app/components/HeaderComponent.vue-233-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4277-app/components/HeaderComponent.vue:234:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4278:app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4279-app/components/HeaderComponent.vue-236-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4280-app/components/HeaderComponent.vue-237-    border-radius: var(--radius-sm);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4290-app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4291-app/components/HeaderComponent.vue:267:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4292:app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4293-app/components/HeaderComponent.vue-269-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4294-app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4304-app/components/HeaderComponent.vue-303-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4305-app/components/HeaderComponent.vue:304:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4306:app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4307-app/components/HeaderComponent.vue-306-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4308-app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4332-app/components/HeaderComponent.vue-395-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4333-app/components/HeaderComponent.vue:396:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4334:app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4335-app/components/HeaderComponent.vue-398-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4336-app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4610-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4611-  box-shadow: var(--shadow-2), var(--shadow-hairline);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4612:  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4613-    border-color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4614-    transform var(--dur-base) var(--ease-out),
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4633-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4634-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4635:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4636-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4637:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4638-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4639-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4656-}
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4657-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4658:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4659-  .zcard {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4660:    transition: none;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4661-  }
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4662-
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4796-  border: 1px solid var(--border-subtle);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4797-  border-radius: var(--radius-pill);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4798:  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4799-    border-color var(--dur-fast) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4800-    color var(--dur-fast) var(--ease-standard);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4820-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4821-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4822:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4823:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4824-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-4825-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5132-app/components/HeaderComponent.vue-255-  text-decoration: none;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5133-app/components/HeaderComponent.vue-256-  border-radius: var(--radius-sm);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5134:app/components/HeaderComponent.vue-257-  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5135---
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5136-app/components/HeaderComponent.vue-281-  gap: var(--space-3);
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5202-app/components/FooterComponent.vue-145-  color: var(--text-body);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5203-app/components/FooterComponent.vue-146-  text-decoration: none;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5204:app/components/FooterComponent.vue-147-  transition: color var(--dur-fast) var(--ease-standard);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5205-app/components/FooterComponent.vue-148-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5206---
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5563-@use "abstract/typography";
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5564-@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5565:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5566-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-5567-.fixed-height {
--
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-6452-   427	+  10-2-a11y-semantique-residuelle: review
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-6453-   428	   10-3-liens-externes-accessibles: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6454:   429	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-6455-   430	   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md-6456-
--
docs/implementation-artifacts/code-reviews/10-2/full.diff-427-+  10-2-a11y-semantique-residuelle: review
docs/implementation-artifacts/code-reviews/10-2/full.diff-428-   10-3-liens-externes-accessibles: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/full.diff:429:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/full.diff-430-   10-5-seo-centralise-site-wide: ready-for-dev
--
docs/implementation-artifacts/sprint-status.yaml-112-  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/sprint-status.yaml-113-  10-3-liens-externes-accessibles: done
docs/implementation-artifacts/sprint-status.yaml:114:  10-4-validation-a11y-emulee-et-unification-forced-colors: review
docs/implementation-artifacts/sprint-status.yaml-115-  10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/sprint-status.yaml-116-  10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-543-+  10-2-a11y-semantique-residuelle: review
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-544-   10-3-liens-externes-accessibles: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:545:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-546-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-547-
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-609-    56	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-610-    57	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:611:    58	                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-612-    59	                  /></span>
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-613-    60	                </button>
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-1401-app/pages/index.vue-585-}
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-1402-app/pages/index.vue-586-
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:1403:app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-1404-app/pages/index.vue-588-  .anim,
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-1405---
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2356-   126	  border: 1px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2357-   127	  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2358:   128	  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2359-   129	    background var(--dur-fast) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2360-   130	    border-color var(--dur-fast) var(--ease-standard),
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2364-   134	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2365-   135	    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2366:   136	    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2367-   137	    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2368:   138	    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2369-   139	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2370-   140	    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2523-    73	  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2524-    74	  box-shadow: var(--shadow-2), var(--shadow-hairline);
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2525:    75	  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2526-    76	    border-color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2527-    77	    transform var(--dur-base) var(--ease-out),
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2546-    96	  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2547-    97	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2548:    98	    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2549-    99	    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2550:   100	    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2551-   101	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2552-   102	    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2569-   119	}
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2570-   120	
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2571:   121	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2572-   122	  .zcard {
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:2573:   123	    transition: none;
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2574-   124	  }
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-2575-   125	
--
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-3132-   427	+  10-2-a11y-semantique-residuelle: review
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-3133-   428	   10-3-liens-externes-accessibles: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json:3134:   429	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-3135-   430	   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-edge-case-hunter.json-3136-
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-508-+  10-2-a11y-semantique-residuelle: review
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-509-   10-3-liens-externes-accessibles: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:510:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-511-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-512-
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-836-  border: 1px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-837-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:838:  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-839-    background var(--dur-fast) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-840-    border-color var(--dur-fast) var(--ease-standard),
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-844-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-845-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:846:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-847-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:848:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-849-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-850-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-955-// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-956-// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:957:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-958-  .zbtn {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:959:    transition: none;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-960-  }
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-961-}
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1022-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1023-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1024:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1025-                  /></span>
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1026-                </button>
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1433-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1434-  box-shadow: var(--shadow-2), var(--shadow-hairline);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1435:  transition:
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1436-    border-color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1437-    transform var(--dur-base) var(--ease-out),
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1456-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1457-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1458:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1459-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1460:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1461-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1462-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1479-}
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1480-
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1481:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1482-  .zcard {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1483:    transition: none;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1484-  }
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1485-
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1733-}
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1734-
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1735:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1736-  .anim,
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1737:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1738:    animation: none;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1739-  }
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1740-}
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1741-
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1742:// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1743-// neutralisées → on restaure un outline système visible sur les éléments focusables
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1744-// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1745-// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1746:@media (forced-colors: active) {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1747-  .hero-term__open:focus-visible,
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1748-  .offer__more:focus-visible {
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1968-
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1969-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:1970:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1971-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-1972-    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2304-app/pages/about.vue:233:  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2305-app/pages/about.vue:235:    color: var(--link);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:2306:app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:2307:app/pages/about.vue:246:      outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2308-app/pages/about.vue:263:  grid-template-columns: 1.4fr 0.6fr;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2309-app/pages/about.vue:279:  // <ol> : neutraliser puces/numéros et marges UA (reset : margin 0 0 16px 32px).
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2335-app/pages/blog/[...slug].vue:173:  color: var(--text-muted);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2336-app/pages/blog/[...slug].vue:177:    color: var(--text-strong);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:2337:app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2338-app/pages/blog/[...slug].vue:197:  font-weight: var(--fw-light);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2339-app/pages/blog/[...slug].vue:198:  line-height: var(--lh-tight);
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2354-app/pages/blog/[...slug].vue:259:  // Liens du corps prose : couleur lien DS + ring de focus accessible.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2355-app/pages/blog/[...slug].vue:261:    color: var(--link);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:2356:app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2357-app/pages/blog/[...slug].vue:277:  // garder le titre neutre (couleur héritée, pas de soulignement bleu).
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2358-app/pages/blog/[...slug].vue:278:  :deep(h2 a),
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2404-docs/implementation-artifacts/2-4-primitive-zcard.md:115:- Preuves sortie initiales : `.zcard[data-v-…]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle)…}` ; 4 modifiers `.zcard--{pad,interactive,accent,featured}` émis ; `color:var(--text-strong)` (titre body). Revue : usages migrés rendus en `as="article"` pour préserver la sémantique.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2405-docs/implementation-artifacts/2-4-primitive-zcard.md:119:- **`components/ui/ZCard.vue` créé** (`<script setup lang="ts">`) : props `interactive`/`accent`/`featured`/`padded`(def. true)/`as`(def. "div"), polymorphe `<component :is>`, slot par défaut. CSS porté de `Card.jsx` en `<style scoped>` 100 % tokens (pas de `ensureStyles()`/`document` → prerender-safe). Auto-import `ui/` sans préfixe (`<ZCard>`, config posée en 2.3).
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:2406:docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2407-docs/specs/spec-design-system-revamp/primitives.md:14:| Input | `components/core/Input.jsx` | `components/ui/ZInput.vue` | bordure `--border-default` → `--border-strong` au focus |
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-2408-docs/specs/spec-design-system-revamp/primitives.md:23:- Icônes : Lucide via CDN (stand-in), `currentColor` ; glyphes sociaux et logo
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3166-/bin/zsh -lc "rg -n \"body|html|line-height|h1|h2|h3|ul|ol|dl|li|dt|dd\" app/assets/scss | head -240; sed -n '1,180p' app/assets/scss/base/_root.scss 2>/dev/null; sed -n '1,130p' app/assets/scss/main.scss 2>/dev/null" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3167- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:3168:app/assets/scss/base/_motion.scss:2://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3169-app/assets/scss/base/_motion.scss:4:// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3170-app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3174-app/assets/scss/base/_motion.scss:20:// `animationend`/`transitionend`). Aucun token de durée nulle n'existe (les
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3175-app/assets/scss/base/_motion.scss:21:// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:3176:app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3177-app/assets/scss/base/_motion.scss:32:    scroll-behavior: auto !important;
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3178-app/assets/scss/base/_motion.scss:40:/* stylelint-enable declaration-no-important, selector-class-pattern */
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3411-@use "abstract/typography";
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3412-@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:3413:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3414-
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-3415-.fixed-height {
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4065-    56	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4066-    57	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:4067:    58	                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4068-    59	                  /></span>
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4069-    60	                </button>
--
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4338-    42	
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4339-    43	- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:4340:    44	- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4341-    45	- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md-4342-    46	
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-16-**Livraison**
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-17-- Stories : **2 / 2 done (100 %)**
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:18:  - 9.1 — États interactifs cohérents : audit focus/hover/press ; **zéro nouvelle UI**. Hover/press déjà token-driven (aucun changement) ; travail réel = **visibilité du focus** (repli `forced-colors` aux primitives + anneau DS sur les liens du châssis).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:19:  - 9.2 — Motion réduit, contraste, clavier : filet global `prefers-reduced-motion` + exception caret ; audit contraste WCAG (`--text-faint`→`--text-muted`) ; clavier (Échap ferme le terminal + retour de focus).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-20-- Revue : 9.1 → **« zéro défaut de code »** (1 différé) ; 9.2 → **« aucun défaut bloquant »** (1 patch appliqué + 2 différés).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-21-- Barre qualité : `pnpm lint` / `typecheck` / `generate` **verts** (11 routes), aucune valeur hardcodée réintroduite.
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-29-1. **L'audit a confirmé plus qu'il n'a corrigé.** 9.1 établit noir sur blanc que hover/press étaient déjà 100 % token-driven sur primitives et châssis → **aucun changement requis**. La discipline « a11y dans la story » tenue depuis la rétro Epic 2 a payé : l'épic « a11y final » ramasse surtout des **confirmations**, pas une dette accumulée.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-30-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:31:2. **`forced-colors` réglé au bon niveau (9.1).** Le repli (rings `box-shadow` invisibles en contraste forcé) posé **une seule fois à la source** — `ZButton`/`ZCard`/`ZTag`/`ZInput`, `outline: none` → `outline: 2px solid transparent` — plutôt que page par page. Solde l'item DS-wide #1 qui traînait depuis l'Epic 3. Lacune comblée au passage : les liens du châssis (logo, nav, footer) n'avaient que l'outline navigateur → anneau DS ajouté.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-32-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-33-3. **Filet motion global + exception caret nette (9.2).** `base/_motion.scss` ramène animations/transitions à l'instantané site-wide (couvre tout ajout futur). **Exception CAP-11** correctement gérée : terminal réel = caret **natif** (non-CSS, intact) ; caret déco du hero **figé visible** (pas sauté à `opacity:0`). Audit : `WindowWrapperComponent` (loop `blink`) = dead code non monté.
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-37-5. **Clavier self-contained (9.2).** Terminal : Échap ferme + **retour de focus au déclencheur** (capture de `document.activeElement` en `onMounted` avant focus input), sans plomberie cross-composant, prerender-safe, `help` re-testé.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-38-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:39:6. **Deux limites honnêtes (cf. §5) :** vérification a11y **partielle** (forced-colors + reduced-motion non émulables via MCP) et **panier a11y d'Epic 9 non vidé** (3 items orphelins).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-40-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-41----
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-45-| Engagement rétro Epic 8 | Statut | Preuve |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-46-|---|---|---|
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:47:| **Checklist a11y en amont** (forced-colors / clavier / contraste) dans la consigne 9.1/9.2 | ✅ **Tenu** | Dev Notes/tâches des deux stories structurées autour de ces axes avec sources DS (9.1 T4 focus/forced-colors ; 9.2 T2 contraste, T3 clavier). |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:48:| **A1 — diff visuel/comportemental** | ⚠️ **Tenu partiellement** | Comportemental clavier au navigateur (sweep Tab, terminal Échap, form contact) ; mais **forced-colors + reduced-motion non émulables** → vérif visuelle incomplète (tracée). Limite d'outil, pas de discipline. |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-49-| **Déploiement : report maintenu fin de migration** | ✅ **Tenu** | Toujours pas déployé (choix assumé). |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-50-| **« Epic 9 done ≠ refonte livrée »** | ✅ **Confirmé — devenu le sujet** | Voir §5 + §7. |
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-56-## 4. Ce qui a bien marché
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-57-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:58:- **Correctifs a11y au bon niveau** : forced-colors à la source (primitives), filet motion global — pas de rustines page par page.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-59-- **Audit token-only** : contraste corrigé en remontant d'un palier de token, zéro couleur en dur.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-60-- **Confirmation > correction** : la dette a11y était déjà soldée en amont story par story ; l'épic final l'a validée.
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-68-**Découverte significative — le roadmap d'épics est terminé, mais la refonte n'est PAS livrée.** Épics 1→9 tous `done`, rien en prod. Deux constats structurants :
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-69-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:70:1. **Le panier a11y d'Epic 9 n'est pas vidé.** `deferred-work.md` avait routé **quatre** items a11y vers « Epic 9» ; les stories 9.1/9.2 en ont traité **un** (forced-colors). Restent **orphelins** (Epic 9 ferme, pas d'Epic 10 au démarrage) :
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-71-   - généralisation eyebrow→`<h2>` + listes `<ol>`/`<ul>` à **home** et **services** (+ process `<ol>` 4.2) ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-72-   - audit site-wide des liens `target="_blank"` (+ helper de lien externe) ;
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-75-   **Cause racine :** les AC de 9.1 (focus/hover/press) et 9.2 (motion/contraste/clavier) étaient plus étroites que le « lot a11y » que `deferred-work` supposait qu'Epic 9 viderait. Pas une dérive — un découpage d'épic plus serré que le panier accumulé.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-76-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:77:2. **Vérification a11y partielle.** `forced-colors` et `prefers-reduced-motion` **ne sont pas émulables** via Chrome DevTools MCP. Présence/résolution des règles CSS confirmées + précédent codebase, mais **pas** l'effet runtime visuel. La correction a11y de 9.1/9.2 n'est donc pas prouvée à l'œil → un **audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) reste à faire.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-78-
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-79-**Décision Simon (cette rétro) :** Epic 9 se clôt tel quel. Les 3 items a11y orphelins **+** l'audit émulé sont **versés à `deferred-work.md`**, puis **consolidés dans un futur Epic 10 « fin de refonte »** (épic à écrire — handoff planification). Pas de story 9.3.
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-92-- **Epic 9 clôturé tel quel** ; pas de story 9.3.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-93-- **Créer un Epic 10 « fin de refonte »** (handoff `bmad` planification — `bmad-create-epics-and-stories` / `bmad-sprint-planning`) regroupant :
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:94:  1. **A11y résiduel** : titres/listes home+services (+ process `<ol>`), audit `target="_blank"`, sémantique `/contact`, unification des idiomes forced-colors ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:95:  2. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-96-  3. **SEO** : centralisation `useSeoMeta`/`runtimeConfig`/`Organization`, OG/JSON-LD des pages nues, **bascule `SITE_URL` `dev.jouan.ovh` → `jouan.ovh`** (+ `CNAME` prod) ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-97-  4. **Légal / RGPD** : politique de confidentialité + mentions légales (sous-traitant Web3Forms) ;
--
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-138-2. **Trancher l'hébergement prod** (`jouan.ovh`) tôt — il conditionne SEO (bascule `SITE_URL`/`CNAME`) et déploiement.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md-139-3. **Dé-risquer le déploiement gh-pages** dès le début d'Epic 10 (chaîne CI + `CNAME` jamais prouvée, ~28 stories empilées).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:140:4. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) — la vérif que le MCP ne permettait pas.
--
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-32-## 2. Analyse approfondie des stories (patterns transverses)
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-33-
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:34:1. **La revue trouve de vrais bugs invisibles au lint — surtout en a11y.** ~13 des 24 findings sont d'accessibilité : `ZTag` non focusable au clavier (2.5), retour de focus après fermeture du menu mobile (2.8), `aria-current` (2.8), fallback avatar sur image échouée (2.6), `prefers-reduced-motion` sur les lifts de carte (2.4). `lint + typecheck + generate` ne les voit pas ; la revue, oui.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-35-2. **Le « no hardcode » (AC#2 de 2.1) ne s'auto-applique pas.** Des valeurs en dur passent en première intention puis sont rattrapées en revue : couleurs HSL (2.3), `2000ms`/`256px` (2.4), bordures de badge (2.5, tolérées et documentées car palette syntaxe sans token équivalent). La contrainte tokens-only est tenue *par la revue*, pas par l'écriture.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-36-3. **Piège Nuxt `<component :is="'NuxtLink'">`.** Un nom de composant en *string* ne résout pas l'auto-import (`resolveComponent` échoue). Découvert en 2.8, rétro-corrigé sur `ZButton`/`ZCard` (importer la référence depuis `#components`). Gotcha réel — l'Epic 3 (pages, multiples liens) va le rencontrer.
--
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-76-
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-77-### Process — filet qualité en amont
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:78:1. **Checklist pré-revue dans chaque consigne d'agent** : « tokens-only (aucune valeur en dur) + a11y (focus visible, clavier Enter/Space, `aria-*`, `prefers-reduced-motion`) » à auto-vérifier avant de passer la story en revue. Complète la règle de périmètre Epic 1 (#1).
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-79-   - *Owner : Simon — avant story 3.1*
docs/implementation-artifacts/epic-2-retro-2026-06-22.md-80-2. **Documenter le piège `<component :is="string">`** dans `project-context.md` (gotchas Nuxt) : toujours importer la référence via `#components`, jamais un nom en string.
--
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-30-- [x] Tâche 2 — Style `ZInput` via tokens (AC: #1)
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-31-  - [x] Champ : `var(--font-sans)`, `var(--fs-base)`, `var(--text-strong)`, `var(--bg-input)`, `1px solid var(--border-default)`, `var(--radius-md)`, `height 42px`, `padding 0 var(--space-3)` (textarea : `min-height 110px`, `resize: vertical`, `padding var(--space-3)`).
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:32:  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-33-  - [x] Erreur `var(--danger)` (champ + hint). Placeholder `var(--text-faint)`.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-34-  - [x] Label : `var(--font-mono)`, `var(--fs-xs)`, `var(--ls-wider)`, uppercase, `var(--text-muted)` ; `.zfield__req { color: var(--accent); }`.
--
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-125-- **`components/ui/ZInput.vue` créé** : `<div>` field + label mono uppercase + `<input>`/`<textarea>` (selon `multiline`) + hint. CSS porté de `Input.jsx` 100 % tokens.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-126-  - **v-model** : `modelValue` + `update:modelValue` (`@input`). `inheritAttrs: false` → `$attrs` (placeholder, type, name…) forwardés sur le contrôle, pas le wrapper.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:127:  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-128-  - **icon** : prop (composant) + slot nommé `icon` (cohérent avec `ZButton`), placeholder avant le set Lucide (2.7).
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-129-- **`components/ui/ZAvatar.vue` créé** : `<span>` rond (`--radius-circle`, suit `Avatar.jsx` — pas pill), image via **`<NuxtImg>`** (optimisée `_ipx`, jamais `<img>` brut) ou initiales (fallback `"?"`). Tailles `sm/md/lg/xl` via `--_sz`, `ring` → double box-shadow (`--bg-page` + `--accent`). Revue : taille runtime invalide ramenée à `md`, et échec image → fallback initiales.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:130:- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-131-- Vérif par page de smoke-test temporaire (`app/pages/__zinputavatar_smoke.vue`) générée puis **supprimée** (zéro résidu). Le portrait `docs/design_system/assets/brand/portrait.jpeg` sera copié vers `public/images/` à l'usage réel (Epics 3/5) — hors périmètre de cette primitive.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md-132-
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-38-  - [x] Éléments cliquables non-bouton : feedback press cohérent et discret. **Conforme** : liens = feedback hover (couleur/soulignement) ; cartes-liens = lift hover ; pas de press inventé (le DS ne spécifie pas de nudge sur les liens texte).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-39-- [x] Tâche 4 — Vérifier et garantir l'état focus clavier visible (AC: #2)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-41-  - [x] Le focus reste visible sur fonds sombres et sur les surfaces atmosphériques (gradient héritage, fond AI-art sous overlay) — contraste suffisant de l'anneau. **Vérifié** au navigateur (ring orange visible sur header vitré + hero dégradé).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-42-  - [x] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6). **Conforme (focus plus fort que demandé)** : `ZInput:focus` pose `border-color: --accent` **+** ring `--accent-ring` (pattern DS README, plus prominent que `--border-strong`) ; `:hover` renforce déjà à `--border-strong`. Non régressé (n'aurait fait qu'affaiblir le focus).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-43-  - [x] L'ordre de tabulation suit l'ordre visuel/logique sur chaque page. **Vérifié** (sweep clavier `/` : logo → nav (5) → Terminal → CTA → contenu).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-44-- [x] Tâche 5 — Vérification manuelle transverse (AC: #1, #2)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-47-  - [x] `pnpm lint` (eslint + stylelint) + `pnpm typecheck` + `pnpm generate` verts (aucune valeur hardcodée réintroduite). **PASS** (Docker, 11 routes prerendered). _(Le ticket mentionnait `yarn` ; le projet est pnpm via Docker.)_
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-48-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-49-## Review Findings
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-50-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-52-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-54-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-55-> **Pistes écartées après recoupement (dismiss)** : (1) « rayon des anneaux incohérent (nav/menu carrés vs brand/footer arrondis) » (Blind Hunter) — **faux positif** : `.hdr__link`/`.hdr__menu-link` portent déjà `border-radius` dans leur règle de base (`HeaderComponent.vue:256/389`), seuls brand/footer (base sans rayon) l'ajoutent → tous les anneaux arrondis. (2) « clipping de l'anneau par un ancêtre `overflow:hidden` » — infirmé : aucun `overflow:hidden` sur les ancêtres du header/nav/footer. (3) « tokens inexistants (`--ring-accent`/`--radius-sm`/`--radius-xs`) » — infirmé : tous définis (`_root.scss`), `--ring-accent` = la valeur box-shadow correcte (le `--accent-ring` couleur n'est pas utilisé en box-shadow). (4) « littéraux `2px` hardcodés » — dérogation a11y légitime (largeur/offset d'outline, pas de token DS dédié), pattern déjà établi (`contact.vue`/`about.vue`/`index.vue`). (5) « `.hdr__brand`/`.ftr__brand` pas focusables » — infirmé : vrais `<a>`/NuxtLink.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-56-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-58-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-59-## Dev Notes
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-116-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-117-- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered) après harmonisation.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:118:- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-119-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-120-### Completion Notes List
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-124-  - _Primitives (Epic 2)_ : `ZButton` (hover/active/focus ✅), `ZInput` (hover/focus ✅), `ZCard--interactive` (hover lift/focus ✅), `ZTag--clickable` + `ztag__remove` (hover/focus ✅), `ZBadge`/`ZAvatar`/`ZIcon` = non interactifs (statut/déco).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-125-  - _Châssis (story 2.8)_ : logo header/footer, liens nav header + menu mobile, burger, liens footer (nav/projets), hexagones sociaux.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:126:  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-127-  - _Terminal (Epic 8)_ : input (caret = focus), close button (focusable, outline orange), poignée drag ; aucun `<a>` dans les sorties.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:128:- **Correctif central — repli `forced-colors` au niveau des primitives DS (deferred-work item #1, revues 3.2/5.1)** : les rings de focus en `box-shadow: var(--ring-accent)` disparaissent en contraste forcé (Windows High Contrast) → focus invisible. Corrigé **une seule fois à la source** (ZButton, ZCard, ZTag ×2, ZInput) en remplaçant `outline: none` par `outline: 2px solid transparent; outline-offset: 2px;` — invisible en rendu normal (le ring prend le relais), rendu en **couleur système** sous forced-colors. Pattern identique à celui déjà posé localement sur les pages (`contact__email`, lien bio `/about`…), désormais factorisé pour tous les consommateurs des primitives.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:129:- **Lacune de focus comblée — liens du châssis** : `hdr__brand`, `hdr__link`, `hdr__menu-link`, `ftr__brand`, `ftr__link` n'avaient **aucun** `:focus-visible` (ils tombaient sur l'outline UA par défaut, non conforme au DS). Ajout de l'anneau DS `--ring-accent` + repli forced-colors. `hdr__burger` (qui avait déjà le ring) reçoit aussi le repli forced-colors.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:130:- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-131-- **Hors périmètre, respecté** : motion réduit / contraste / navigabilité clavier complète = **story 9.2** (non traités ici, sauf visibilité du focus qui est partagée et prioritaire). `_button.scss` (durée `0.15s` en dur) = SCSS legacy **non importé** par `main.scss` (dead code) → non corrigé. `WindowWrapperComponent`/`CurrentTime` (durées en dur) = résidu Options API header, hors « refonte ».
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-132-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-133-### File List
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-134-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:135:- `app/components/ui/ZButton.vue` (MODIFIÉ — repli forced-colors sur `:focus-visible`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:136:- `app/components/ui/ZCard.vue` (MODIFIÉ — repli forced-colors sur `.zcard--interactive:focus-visible`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:137:- `app/components/ui/ZTag.vue` (MODIFIÉ — repli forced-colors sur `.ztag--clickable` + `.ztag__remove`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:138:- `app/components/ui/ZInput.vue` (MODIFIÉ — repli forced-colors sur `.zinput,.ztextarea:focus`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:139:- `app/components/HeaderComponent.vue` (MODIFIÉ — anneau DS sur `hdr__brand`/`hdr__link`/`hdr__menu-link` + repli forced-colors sur `hdr__burger`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:140:- `app/components/FooterComponent.vue` (MODIFIÉ — anneau DS + repli forced-colors sur `ftr__brand`/`ftr__link`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-141-- `docs/implementation-artifacts/9-1-etats-interactifs-coherents.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-142-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:143:- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — item Epic 9 #1 « repli forced-colors DS-wide » soldé)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-144-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-145-## Change Log
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-147-| Date       | Version | Description                                                                                  |
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-148-| ---------- | ------- | -------------------------------------------------------------------------------------------- |
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-555-    60	- **`rel`** : préférer `rel="noopener"` (sécurité `window.opener`) ; `noreferrer` seulement si la confidentialité du référent est voulue. Harmoniser.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-556-    61	- **Ne pas casser** le style des hexagones (grille SVG) ni des cartes projet en insérant le wrapper du helper. Tester chaque surface.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:557:    62	- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-558-    63	- **Auto-import `<component :is>`** : si le helper enveloppe un `NuxtLink`/`a` dynamique, passer une **référence** importée depuis `#components`, jamais un nom en string (piège story 2.8). [Source: project-context.md#Nuxt]
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-559-    64	- **pnpm + Docker** pour toute commande.
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-605-81-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-606-82-UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:607:83-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-608-84-
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-609-85-### FR Coverage Map
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-622-98-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-623-99:FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:624:100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-625-101-FR15: Epic 10 — SEO centralisé site-wide
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-626-102-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-686-606-**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-687-607-
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:688:608-### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-689-609-
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-690-610-As a visiteur en contraste forcé ou motion réduit,
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-694-614-**Acceptance Criteria:**
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-695-615-
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:696:616-**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:697:617-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:698:618-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-699-619-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-700-620-
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-904-   203	  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-905-   204	  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:906:   205	- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-907-   206	- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-908-   207	- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-918-   217	  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-919-   218	  pas seulement en revue —
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:920:   219	  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-921-   220	    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-922-   221	    `ZInput`/liens), pas page par page ;
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-936-   235	- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-937-   236	  orange Ubuntu comme unique accent héros.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:938:   237	- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-939-   238	  terminal.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-940-   239	
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-992-   291	- Revue périodique ; retirer les règles devenues évidentes.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-993-   292	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:994:   293	Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-995----DIFF STAT---
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-996- .../code-reviews/10-3/full.diff                    | 189 +++++++++++++++++++++
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1183-   185	+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1184-   186	+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1185:   187	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1186-   188	   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1187-   189	   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1298-    30	  background: var(--surface-2);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1299-    31	  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1300:    32	  transition:
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1301-    33	    color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1302-    34	    background var(--dur-base) var(--ease-standard);
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1326-    58	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1327-    59	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1328:    60	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1329-    61	  .hex {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1330:    62	    transition: none;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1331-    63	  }
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1332-    64	}
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1443-   109	  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1444-   110	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1445:   111	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1446-   112	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1447-   113	    border-radius: var(--radius-sm);
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1478-   144	  color: var(--text-body);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1479-   145	  text-decoration: none;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1480:   146	  transition: color var(--dur-fast) var(--ease-standard);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1481-   147	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1482-   148	  &:hover {
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1486-   152	  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1487-   153	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1488:   154	    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1489-   155	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1490-   156	    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1513-   179	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1514-   180	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1515:   181	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1516-   182	  .ftr__link {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1517:   183	    transition: none;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1518-   184	  }
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1519-   185	}
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1762-   241	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1763-   242	    // Anneau de focus accent + outline transparent : ce dernier reste invisible
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1764:   243	    // en rendu normal mais devient une couleur système en `forced-colors`
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1765-   244	    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1766-   245	    &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1767:   246	      outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1768-   247	      outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1769-   248	      border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1951-    57	                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1952-    58	                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:1953:    59	                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1954-    60	                  /></span>
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-1955-    61	                </button>
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2086-   192	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2087-   193	.anim {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2088:   194	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2089-   195	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2090-   196	
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2312-   418	// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2313-   419	// proportionnel à la police) — pas de token équivalent pour un curseur.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2314:   420	.prm__caret {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2315-   421	  display: inline-block;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2316-   422	  width: 0.55em;
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2321-   427	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2322-   428	  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2323:   429	  animation: caret-blink 1s steps(1) infinite;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2324-   430	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2325-   431	
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2502-   608	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2503-   609	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2504:   610	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2505-   611	  .anim,
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2506:   612	  .prm__caret {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2507:   613	    animation: none;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2508-   614	  }
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2509-   615	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2510-   616	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2511:   617	// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2512-   618	// neutralisées → on restaure un outline système visible sur les éléments focusables
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2513-   619	// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2514-   620	// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2515:   621	@media (forced-colors: active) {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2516-   622	  .hero-term__open:focus-visible,
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2517-   623	  .offer__more:focus-visible {
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2596-    73	  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2597-    74	  box-shadow: var(--shadow-2), var(--shadow-hairline);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2598:    75	  transition:
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2599-    76	    border-color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2600-    77	    transform var(--dur-base) var(--ease-out),
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2619-    96	  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2620-    97	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2621:    98	    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2622-    99	    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2623:   100	    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2624-   101	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2625-   102	    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2642-   119	}
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2643-   120	
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2644:   121	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2645-   122	  .zcard {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2646:   123	    transition: none;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2647-   124	  }
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2648-   125	
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2729-   203	  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2730-   204	  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2731:   205	- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2732-   206	- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2733-   207	- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2743-   217	  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2744-   218	  pas seulement en revue —
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2745:   219	  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2746-   220	    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2747-   221	    `ZInput`/liens), pas page par page ;
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2942-+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2943-+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:2944:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2945-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-2946-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3101-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3102-  box-shadow: var(--shadow-2), var(--shadow-hairline);
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:3103:  transition:
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3104-    border-color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3105-    transform var(--dur-base) var(--ease-out),
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3124-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3125-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:3126:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3127-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:3128:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3129-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3130-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3915-+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3916-+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:3917:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3918-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md-3919-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-3/full.diff-185-+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/full.diff-186-+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/full.diff:187:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/full.diff-188-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/full.diff-189-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-53-- [x] [Review][Patch] Clés `v-for` sur chaîne de contenu (`service.title` / `stat.label`) [app/pages/index.vue] — Incohérent avec la boucle terminal du même fichier qui utilise un `id` stable (fix story 3.1). Aucun bug actuel (valeurs uniques, tableaux statiques) mais fragile et incohérent. Fix : champ `id` stable (comme `terminalRows`) ou index. [blind]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-54-- [x] [Review][Defer] `role="img" title=""` résiduel sur le wrapper racine `.init` [app/layouts/default.vue:2] — Pré-existant (le diff ne touche que le `<style>`), rendu d'autant plus inutile que le dégradé décoratif a été retiré. Risque a11y notable (un `role="img"` sur le conteneur racine peut faire annoncer toute la page comme une image). Hors périmètre 3.2 → à traiter (idéalement Epic 9 a11y). [auditor]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:55:- [x] [Review][Defer] `outline:none` + ring `box-shadow` KO en forced-colors [app/pages/index.vue `.offer__more:focus-visible`] — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → focus invisible. Pattern **systémique du DS** (ZButton, etc.), à corriger centralement (`@media (forced-colors: active)` restaurant l'outline) — relève d'Epic 9 (contraste/clavier), pas de cette story. [blind]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-56-
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-57-## Dev Notes
--
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-166-- ✅ Resolved review finding [Patch] clés `v-for` : champ `id` stable sur `services` (`wordpress`/`apps`/`ia`) et `stats` (`stat-1..3`) ; `:key="…id"` — cohérent avec `terminalRows` (3.1).
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-167-- ✅ Resolved review finding [Defer→corrigé] `role="img" title=""` sur `.init` : retiré (bug a11y réel, trivial — un `role="img"` racine peut faire annoncer toute la page comme image). Le décor justifiant ce rôle avait déjà disparu.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:168:- ✅ Resolved review finding [Defer→corrigé ciblé] focus en `forced-colors` : ajout d'un repli `@media (forced-colors: active)` restaurant un `outline` sur les éléments focusables **propres à cette page** (`.offer__more`, `.hero-term__open`) → cette page ne porte plus la dette. **Le repli DS-wide** (ZButton/ZTag/ZCard/ZInput, focus via `box-shadow`) reste un correctif central **assigné à Epic 9** : le traiter ici impliquerait de toucher toutes les primitives Epic 2 (élargissement de périmètre, justement pointé par le finding Decision).
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-169-
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-170-Validation post-fix (Docker) : `pnpm lint` 0/0, `typecheck` vert, `generate` vert (24 routes).
--
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-172-### File List
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-173-
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-175-- `app/layouts/default.vue` (fond de page legacy → `var(--bg-page)` dark-first ; retrait import `_color` ; retrait `role="img" title=""` du wrapper `.init`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-176-- `docs/implementation-artifacts/3-2-apercu-services-et-stats.md` (frontmatter `baseline_commit`, statut, Dev Agent Record, findings de revue)
--
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-180-
docs/implementation-artifacts/3-2-apercu-services-et-stats.md-181-- 2026-06-22 — Implémentation story 3.2 (aperçu services + stats) : sections portées de `ServicesPreview`/`StatsProjects` (Home.jsx) dans `pages/index.vue`, 3 `ZCard` (carte featured) + statrow, tokens-only. Correctif fidélité : fond de page legacy → `--bg-page` (dark-first). Lint/typecheck/generate verts, vérifié au Chrome DevTools. Statut → review.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:182:- 2026-06-22 — Corrections de revue de code : 2 findings [Patch] (aria-label liens, clés v-for stables) + 2 [Defer] traités (retrait `role="img"` sur `.init` ; repli `forced-colors` pour les focusables de la page ; repli DS-wide laissé à Epic 9). Lint/typecheck/generate verts. Statut → review.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:183:- 2026-06-22 — Re-revue (vérification post-fix, commit `132093d`) : 2 patchs confirmés dans le code (aria-label distincts ×3, clés `id` stables) + 2 defers réellement traités (`role="img"` retiré ; `@media (forced-colors: active)` sur `.offer__more`/`.hero-term__open`). `pnpm lint` (0/0) + `pnpm typecheck` verts (couverts par la vérif HEAD `5056196`). Aucune régression. Statut → done.
--
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-67-
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-68-**La dette différée vit désormais sur TROIS destinations**, toutes tracées dans `deferred-work.md` (inventaire consolidé) :
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:69:- **Epic 9** — a11y DS-wide (forced-colors, généralisation titres/listes home/services, audit `_blank`, + sémantique infos `/contact`).
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-70-- **Story SEO dédiée** — centralisation `useSeoMeta`/`runtimeConfig`/`Organization`, OG/JSON-LD des pages encore nues (home, services, contact), bascule `SITE_URL` → `jouan.ovh`.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-71-- **Légal / RGPD (fin de refonte)** — page politique de confidentialité + mentions légales (sous-traitant Web3Forms).
--
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-100-- ⚠️ **Terrain le plus *legacy* du codebase** : `components/terminal/` est en **Options API** (`TerminalComponent`, `WindowWrapperComponent`, `TerminalManagerComponent`) + classes `IProgram` (TS pur, inchangées par la migration). **Décision : refonte complète** (migration `<script setup>` + restyle DS), pas restyle-only.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-101-- ⚠️ **Risque sans filet de test** : la logique draggable / stateful / DOM-lourde se réécrit à comportement constant. **Mitigation obligatoire** : vérif **commande par commande** + drag + ouverture/fermeture au navigateur (Chrome DevTools MCP), avant/après. Les classes `IProgram` ne devraient pas bouger (TS pur) — ne migrer que les coquilles Vue.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:102:- ⚠️ **Motion** : caret clignotant = **seule** animation en boucle (respecter `prefers-reduced-motion`) — recoupe le lot motion d'Epic 9.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-103-- ⚠️ **Appliquer A1** : diff visuel contre `TerminalWindow.jsx`/`Prompt.jsx` + vérif fonctionnelle dès 8.1.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md-104-
--
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-36-- [x] Tâche 4 — Style `ZTag` via tokens (AC: #1)
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-37-  - [x] Base : `inline-flex; gap var(--space-2); height 26px; padding 0 var(--space-3); var(--font-mono); var(--fs-xs); var(--fw-regular); color var(--text-body); background var(--surface-2); border 1px solid var(--border-subtle); border-radius var(--radius-pill)`.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:38:  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-39-- [x] Tâche 5 — Vérification (AC: #1)
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-40-  - [x] Rendu prouvé par build (page de smoke-test temporaire, supprimée après) : `<span class="zbadge zbadge--{tone}">` pour les 6 tones, `zbadge__dot` pour `dot` ; `<span class="ztag">`, `ztag--plain` (`hash=false`), `ztag--clickable` (`@click`), bouton `ztag__remove` (`@remove`). CSS scoped émis : 6 tones, `border-radius:var(--radius-pill)`, `--plain`/`--clickable`.
--
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-130-  - **Plain tag** : `hash=false` applique `display:none`/`content:none` au pseudo-élément `::before` pour retirer le préfixe du layout.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-131-- **Bordures de tones (`ZBadge`)** : teintes DS dédiées (`hsl(143 50% 32% / 0.5)`, etc.) sans token équivalent → portées telles quelles de `Badge.jsx` (explicitement toléré par la story), notation normalisée (`deg`/`%`) pour Stylelint, commentées.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:132:- **Conventions revues 2.3/2.4 appliquées** : `/* stylelint-disable selector-class-pattern */` inline (BEM `zbadge__dot`/`ztag--plain`…), `prefers-reduced-motion` neutralise la transition de `ZTag`. Aucun changement Stylelint global.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-133-- **Prerender-safe** : pas de portage de `ensureStyles()`/`document` ; CSS en `<style scoped>`.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md-134-- Vérif par page de smoke-test temporaire (`app/pages/__zbadgetag_smoke.vue`) générée puis **supprimée** (zéro résidu).
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-19-**Given** l'interface refondue
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-20-**When** on audite motion, contraste et navigation clavier
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:21:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-22-**And** le contraste texte/fond est lisible et toutes les pages sont navigables au clavier
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-23-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-24-## Tasks / Subtasks
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-25-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:26:- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:28:  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:29:  - [x] **Exception explicite** : le caret clignotant du terminal **reste** la seule boucle autorisée — confirmer qu'il n'est pas désactivé par mégarde (ou qu'il reste lisible si réduit). **Fait** : terminal réel = caret **natif** de l'`<input>` (`caret-color`/`caret-shape`, non piloté par CSS → intact). Caret décoratif du hero (`.prm__caret`) = figé sur état **visible** (`animation: none` dans le filet global + garde index.vue) plutôt que de sauter à la frame finale `opacity:0` → reste lisible.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-30-  - [x] Confirmer qu'aucune autre animation ne boucle par défaut (pas de spinner/bounce/pulse résiduel). **Confirmé** : seule boucle live = `caret-blink` (hero mock) ; aucun spinner/pulse/bounce dans le code chargé (`bounce-in-*` etc. vivent dans `_animations.scss` non importé).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-31-  - [x] Vérifier que les transitions d'état (hover/press) tombent en réduit sans casser la lisibilité des états (les changements de couleur restent, l'animation disparaît). **Vérifié** : le filet ne touche que `*-duration`/`*-delay` → les **états** (couleur hover, ring focus, nudge press) restent, seule l'interpolation disparaît. Garde locale de parité ajoutée à `ZButton` (seule primitive qui n'en avait pas).
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-44-  - [x] `pnpm lint` (eslint + stylelint) vert ; aucune valeur hardcodée réintroduite. **PASS** (les corrections contraste sont des tokens ; le filet motion documente sa dérogation `!important` a11y).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-45-  - [x] `pnpm generate` vert (compatibilité prerender préservée). **PASS** (11 routes ; `import.meta.client` gardant l'accès `document.activeElement`).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-47-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-48-## Review Findings
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-52-- [x] [Review][Patch] Nommer la dérogation des durées hardcodées dans `_motion.scss` [app/assets/scss/base/_motion.scss] — le `stylelint-disable` ne couvre que `!important`/`selector-class-pattern` ; la règle SCSS projet (« commenter explicitement la dérogation » pour toute valeur en dur) n'est que partiellement honorée pour `0.01ms`/`0ms` (recette a11y standard, aucun token de durée nulle ne convient). Ajouter une ligne le nommant. Trivial, sans risque. **✅ Appliqué (2026-06-29)** : bloc « DÉROGATION valeurs en dur » ajouté dans l'en-tête de `_motion.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-53-- [x] [Review][Defer] Placeholder `ZInput` à ~3.7:1 sur `--bg-input` (< 4.5:1 AA) — résidu **justifié et conscient** : `--text-muted` est meilleur que `--text-faint` (~2.2:1) et le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter à `--text-body` ferait passer le placeholder pour une saisie. Accepté tel quel, tracé. → `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-55-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:56:> **Pistes écartées après recoupement (dismiss)** : (1) « opener périmé : `onMounted` ne capture qu'une fois » (Blind Hunter, Medium-High) — **faux positif** : chaque ouverture monte une nouvelle instance (`TerminalManagerComponent:28`), `close` = `display:none` sans réutilisation → capture fraîche par instance. (2) « le reset nucléaire cache une animation d'entrée `base opacity:0` sans `fill-mode:forwards` » (Medium) — infirmé : toutes les animations chargées finissent visibles (`fade-rise`→opacity:1) ; celles finissant cachées (`blink`/`fadeIn`) sont du dead code non monté. (3) garde locale `.zbtn { transition:none }` « morte » — non : `transition-property:none` (non-`!important`) reste actif → robuste en isolation. (4) `document.activeElement` = `<body>`, opener détaché, Échap sans `preventDefault` — no-op sûrs (confirmés Edge Case Hunter).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-57-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-58-## Dev Notes
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-61-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-62-- Story de **finition** de l'Epic 9 : elle **audite et durcit** l'accessibilité de tout ce qui précède — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7), terminal (Epic 8). Cette dépendance vers l'antérieur est normale ; **aucune dépendance vers des stories futures**.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:63:- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-64-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-65-### Motion réduit (référence exacte)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-66-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:67:- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-68-- Keyframes disponibles : `caret-blink` (réservé au caret) et `fade-rise` (entrées). Durées via `--dur-fast`/`--dur-base`/`--dur-slow`/`--dur-slower` ; easings via `--ease-out`/`--ease-in-out`/`--ease-standard`. [Source: docs/design_system/tokens/motion.css]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:69:- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-70-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-71-### Contraste (référence exacte)
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-90-### Pièges / régressions à éviter
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-91-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:92:- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-93-- **Ne pas réintroduire de valeurs hardcodées** (couleur de texte, durée) en corrigeant contraste/motion — toujours via tokens. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-94-- Ne pas supprimer les indices de focus (story 9.1) en désactivant les transitions ; états toujours visibles même en motion réduit.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-95-- Ne pas introduire de boucle d'animation résiduelle (spinner/pulse/bounce) — vérifier qu'il n'en reste aucune par défaut.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-96-- Pas de piège de focus ; restaurer le focus à la fermeture des overlays/terminal.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:97:- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-98-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-99-### Testing standards
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-100-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:101:- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-102-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-103-### References
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-118-### Debug Log References
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-119-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:120:- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered). 1ère passe lint : 4 nits stylelint (3× empty-line-before-comment, 1× selector-class-pattern sur `.prm__caret`) → corrigés (lignes vides + `stylelint-disable selector-class-pattern` commenté).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-121-- **Contraste — calcul WCAG** (script HSL→luminance→ratio sur les tokens) : `text-faint` échoue (2.21:1 sur bg-input, 2.62:1 elevated, 2.95:1 card, 3.36:1 page) ; `text-muted` 3.69–5.61:1 ; `text-body`/`text-strong`/accent/palette terminal tous ≥ 4.5:1 (souvent ≫). Détail consigné dans les tâches.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-122-- **Vérif clavier au navigateur (Chrome DevTools MCP, dev :3000)** :
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-123-  - Terminal : focus bouton header → **Enter** ouvre + input auto-focus → **Échap** masque le terminal **et renvoie le focus au bouton déclencheur** (`focusReturnedCls: hdr__action zbtn zbtn--terminal`). `help` ré-exécuté après l'ajout → sortie correcte (non-régression).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-124-  - `/contact` : 5 contrôles de formulaire atteignables + labellisés (Nom/Email/Sujet/Message/Envoyer) ; honeypot `tabindex -1` exclu du tab.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:125:  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-126-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-127-### Completion Notes List
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-128-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-129-- **Nature : audit + durcissement a11y, complément de 9.1.** 9.1 a posé l'apparence des états (focus/hover/press) ; 9.2 garantit qu'ils restent **accessibles** : motion réduit, contraste lisible, clavier de bout en bout.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-131-- **Contraste (Tâche 2)** : calcul WCAG de toutes les paires texte/surface. Seul `--text-faint` échouait. Ses **4 usages étaient du texte informatif réel** (copyright footer, méta blog `.post__meta`, notice RGPD `/contact`, placeholder `ZInput`) — aucun n'était un contrôle désactivé (exempt) — donc remontés d'un palier à `--text-muted` (la correction prescrite par la story, token-only, pas de couleur en dur). `--text-faint` reste défini pour les vrais états désactivés.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-132-- **Clavier (Tâche 3)** : le terminal était opérable au clavier (Tab → pastille close → Enter/Espace) mais sans **Échap** ni **retour de focus**. Ajout, **self-contained dans `TerminalComponent`** : `@keydown.esc` sur la racine (capte Échap que le focus soit sur l'input ou la pastille close) → `closeTerminal` ; capture du déclencheur (`document.activeElement` mémorisé en `onMounted` **avant** de focaliser l'input) → focus rendu à la fermeture. Aucune plomberie cross-composant, aucune commande cassée (`help` re-testé). Menu mobile (Échap + retour focus) déjà conforme (story 2.8). Formulaire `/contact` entièrement navigable.
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-136-### File List
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-137-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:138:- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-139-- `app/assets/scss/main.scss` (MODIFIÉ — `@use "base/motion"`)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:140:- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-141-- `app/components/ui/ZInput.vue` (MODIFIÉ — placeholder `--text-faint` → `--text-muted`)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-142-- `app/components/FooterComponent.vue` (MODIFIÉ — `.ftr__bottom` `--text-faint` → `--text-muted`)
--
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-151-| Date       | Version | Description                                                                                  |
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-152-| ---------- | ------- | -------------------------------------------------------------------------------------------- |
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:153:| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
--
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-376-+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-377-+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:378:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-379-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-380-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-448-    30	  background: var(--surface-2);
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-449-    31	  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:450:    32	  transition:
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-451-    33	    color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-452-    34	    background var(--dur-base) var(--ease-standard);
--
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-476-    58	}
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-477-    59	
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:478:    60	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-479-    61	  .hex {
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:480:    62	    transition: none;
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-481-    63	  }
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-482-    64	}
--
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1714-+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1715-+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:1716:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1717-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1718-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1841-   185	+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1842-   186	+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:1843:   187	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1844-   188	   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json-1845-   189	   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/epic-6-retro-2026-06-25.md-70-**La pile « plus tard » grossit désormais sur DEUX axes.** Jusqu'ici on empilait de l'a11y pour Epic 9 ; l'Epic 6 ajoute une **dette d'architecture SEO** : OG/Twitter/canonical/JSON-LD ont été posés **ad hoc sur 3 pages** (`/about`, `/blog`, article), et la centralisation (`useSeoMeta`/`app.head` partagé, `SITE_URL` via `runtimeConfig`, `publisher`/`Organization`) est différée. **Décision Simon (cette rétro) : le SEO ne va PAS dans Epic 9** (thématiquement « a11y & motion ») mais dans une **story SEO dédiée en fin de refonte**.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md-71-
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:72:**Action prise :** inventaire **consolidé dans `deferred-work.md`** (section « Inventaire consolidé »), réparti par destination — Epic 9 (forced-colors DS-wide, généralisation titres/listes, audit `_blank`) vs story SEO dédiée (centralisation `useSeoMeta`/`runtimeConfig`/`Organization`). Plus aucune perte de suivi.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md-73-
docs/implementation-artifacts/epic-6-retro-2026-06-25.md-74-**Astérisque déploiement (Winston) :** branche `feat/design-system-revamp` toujours jamais mergée ni déployée. **~21 stories** (Epics 1→6) empilées sur une chaîne CI gh-pages + `CNAME` jamais prouvée. Report assumé en fin de refonte — risque croissant, tracé.
--
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md-42-
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md-43-- **Story de finition a11y sémantique** : généralise à **home** et **services** la convention déjà appliquée sur `/about` (5.2), `/blog` (6.1), article (6.2), + sémantique de la colonne `/contact` (différé 7.2). Source : `deferred-work.md` → Epic 10 items #1 et #3. [Source: epics.md#Epic 10 — Story 10.2 (FR12)]
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:44:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md-45-- **Convention de référence (story 5.2, déjà dans project-context)** : un libellé de section (eyebrow `// …`) **qui ouvre une section** porte un `<h2 class="eyebrow">` (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), **pas** un `<p>`. Une **séquence** (étapes, cartes répétées, tags) se balise en `<ol>`/`<ul>` + `<li>` (`list-style: none` + reset marges UA → rendu identique). [Source: docs/project-context.md#Accessibilité — Hiérarchie de titres & sémantique de listes]
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md-46-
--
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-48-| **Mitigation : vérif commande-par-commande + drag + ouverture, avant/après** | ✅ **Tenu** | Tableau d'invariants 8.3 ; Chrome DevTools sur les 3 stories. |
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-49-| **A1 — diff visuel/comportemental** (`TerminalWindow.jsx`/`Prompt.jsx`) | ✅ **Tenu** | Computed styles vérifiés dès 8.1. |
docs/implementation-artifacts/epic-8-retro-2026-06-29.md:50:| **Caret = seule animation en boucle** (`prefers-reduced-motion`) | ✅ **Tenu** | Caret natif, 0 boucle CSS introduite. |
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-51-| **Découverte invalidant le plan Epic 8 ?** | ✅ **Confirmé « Non »** | Scope élargi conscient et tracé ; ouverture déjà opérante (7.2). |
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-52-
--
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-70-
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-71-**La fin de refonte se charge** sur des piles tracées dans `deferred-work.md` :
docs/implementation-artifacts/epic-8-retro-2026-06-29.md:72:- **Epic 9** — a11y DS-wide (repli `forced-colors`, généralisation titres/listes home+services, audit `_blank`, sémantique `/contact`).
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-73-- **Story SEO dédiée** — centralisation `useSeoMeta`/`runtimeConfig`/`Organization`, OG/JSON-LD des pages encore nues, **bascule `SITE_URL` `dev.jouan.ovh` → `jouan.ovh`**.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-74-- **Légal / RGPD** — page politique de confidentialité + mentions légales (sous-traitant Web3Forms).
--
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-86-### Process — nouvelle action (Epic 9)
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-87-- **Checklist a11y en amont dans la consigne des stories 9.1/9.2** (décision Simon) : embarquer dès la consigne `create-story`, pas seulement en revue —
docs/implementation-artifacts/epic-8-retro-2026-06-29.md:88:  - repli **`@media (forced-colors: active)`** (outline sur les rings de focus en `box-shadow` au niveau des primitives DS `ZButton`/`ZTag`/`ZCard`/`ZInput`/liens) ;
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-89-  - **navigation clavier** (focus visible, ordre logique, retour de focus après overlay) ;
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-90-  - **contraste** texte/fond lisible.
--
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-107-2 stories : 9.1 États interactifs cohérents (focus/hover/press), 9.2 Motion réduit, contraste, clavier.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-108-
docs/implementation-artifacts/epic-8-retro-2026-06-29.md:109:- ✅ **Terrain cadré** : `deferred-work.md` a déjà routé les items a11y vers Epic 9 (forced-colors DS-wide, généralisation titres/listes home+services + séquence process `<ol>` 4.2, audit `_blank` hexagones, sémantique `/contact`).
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-110-- ✅ **Caret terminal** = seule boucle, déjà conforme (8.1) — recoupe le lot motion de 9.2.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-111-- ⚠️ **Checklist a11y en amont** (action ci-dessus) à mettre dans la consigne des deux stories.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md:112:- ⚠️ **Périmètre transverse** : passe DS-wide → appliquer les correctifs **une seule fois au niveau des primitives** plutôt que page par page (forced-colors notamment).
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-113-
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-114-**Découverte significative invalidant le plan d'Epic 9 ? → Non.** Epic 9 est bien préparé ; les items sont pré-inventoriés. Seul risque ouvert : le déploiement non prouvé, **hors périmètre Epic 9** (fin de refonte).
--
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-137-
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-138-1. Démarrer **Epic 9** (a11y & finitions motion) — dernier épic du roadmap.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md:139:2. **Embarquer la checklist a11y** (forced-colors / clavier / contraste) dans la consigne `create-story` de 9.1/9.2, en amont de la revue.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-140-3. Reconduire **A1** (diff visuel/comportemental Chrome DevTools) sur les deux stories.
docs/implementation-artifacts/epic-8-retro-2026-06-29.md-141-4. **En fin de refonte** (après Epic 9, décision Simon — report maintenu) : story SEO dédiée (+ bascule `SITE_URL` → `jouan.ovh`), page RGPD/mentions légales, **premier merge sur `main` + validation CI gh-pages** (~26 stories empilées, risque croissant).
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-252-+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-253-+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:254:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-255-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-256-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-297-  background: var(--surface-2);
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-298-  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:299:  transition:
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-300-    color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-301-    background var(--dur-base) var(--ease-standard);
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-325-}
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-326-
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:327:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-328-  .hex {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:329:    transition: none;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-330-  }
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-331-}
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-443-  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-444-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:445:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-446-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-447-    border-radius: var(--radius-sm);
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-478-  color: var(--text-body);
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-479-  text-decoration: none;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:480:  transition: color var(--dur-fast) var(--ease-standard);
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-481-
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-482-  &:hover {
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-486-  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-487-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:488:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-489-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-490-    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-959-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-960-  box-shadow: var(--shadow-2), var(--shadow-hairline);
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:961:  transition:
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-962-    border-color var(--dur-base) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-963-    transform var(--dur-base) var(--ease-out),
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-982-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-983-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:984:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-985-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:986:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-987-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-988-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1005-}
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1006-
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:1007:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1008-  .zcard {
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:1009:    transition: none;
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1010-  }
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1011-
--
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1838-   185	+  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1839-   186	+  10-3-liens-externes-accessibles: in-progress
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:1840:   187	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1841-   188	   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md-1842-   189	   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/3-1-hero-terminal-a.md-69-- **Typo signature** (NFR7) : Ubuntu Mono pour titres/labels/code (le prompt, l'eyebrow, les tags), Ubuntu sans pour le corps long (`.hero__sub` utilise déjà `--font-sans`). [Source: docs/planning-artifacts/epics.md#NonFunctional Requirements (NFR7)]
docs/implementation-artifacts/3-1-hero-terminal-a.md-70-- **Compatibilité prerender** (NFR4) : site statique `nuxi generate`, gardes DOM obligatoires. [Source: docs/project-context.md#Nuxt]
docs/implementation-artifacts/3-1-hero-terminal-a.md:71:- **Motion** : `prefers-reduced-motion` respecté ; seule boucle = le caret du terminal. La ref `Prompt.jsx` désactive déjà l'animation du caret sous `prefers-reduced-motion: reduce`. [Source: docs/project-context.md#À préserver ; docs/design_system/components/terminal/Prompt.jsx]
docs/implementation-artifacts/3-1-hero-terminal-a.md-72-
docs/implementation-artifacts/3-1-hero-terminal-a.md-73-### Dépendances (épics antérieurs — OK)
--
docs/implementation-artifacts/3-1-hero-terminal-a.md-110-- **Réutiliser** `ZButton`/`ZTag` (Epic 2) — ne pas réécrire de boutons/tags ad hoc. [Source: docs/planning-artifacts/epics.md#Epic 2]
docs/implementation-artifacts/3-1-hero-terminal-a.md-111-- **Ne rien hardcoder** : couleurs (`--accent`, `--term-blue`, `--term-green`, `--prompt`), espaces, rayons, tailles de police via tokens. [Source: docs/project-context.md#SCSS]
docs/implementation-artifacts/3-1-hero-terminal-a.md:112:- **Caret = seule animation en boucle** ; respecter `prefers-reduced-motion`. [Source: docs/project-context.md#À préserver]
docs/implementation-artifacts/3-1-hero-terminal-a.md-113-- **Prerender** : pas d'accès `window`/`document` hors garde. Le handler d'ouverture du terminal ne doit pas casser `nuxi generate`.
docs/implementation-artifacts/3-1-hero-terminal-a.md-114-- **`@import` interdit** en SCSS — `@use ... as _alias` uniquement. [Source: docs/project-context.md#SCSS]
--
docs/implementation-artifacts/3-1-hero-terminal-a.md-145-- `pnpm lint` (eslint + stylelint) : 0 erreur / 0 warning (via Docker).
docs/implementation-artifacts/3-1-hero-terminal-a.md-146-- `pnpm typecheck` (nuxi/vue-tsc) : vert.
docs/implementation-artifacts/3-1-hero-terminal-a.md:147:- `pnpm generate` : vert, 24 routes prérendues, `/` inclus (hero rendu côté SSR — vérifié par grep des marqueurs `hero__grad`, `hero-term__open`, `prm__caret`, `whoami`, etc. dans `.output/public/index.html`).
docs/implementation-artifacts/3-1-hero-terminal-a.md-148-- Findings stylelint corrigés en cours de route : `word-break: break-word` → `overflow-wrap: break-word` ; ligne vide avant commentaire `//` ; formatage Prettier des spans de prompt (`eslint --fix`).
docs/implementation-artifacts/3-1-hero-terminal-a.md-149-
--
docs/implementation-artifacts/3-1-hero-terminal-a.md-156-- CTA : `ZButton` primary `lg` → `/contact` (`Démarrer un projet`, icône `ZIcon name="arrow"` via slot `#iconRight`) + `ZButton` secondary `lg` → `/services` (`Voir les services`). `:as="NuxtLink"` importé de `#components` (évite le piège `<component :is="string">`).
docs/implementation-artifacts/3-1-hero-terminal-a.md-157-- Tags : `ZTag` × 5 (`php`, `symfony`, `wordpress`, `nest.js`, `nuxt.js`).
docs/implementation-artifacts/3-1-hero-terminal-a.md:158:- Colonne droite : fenêtre terminal **statique décorative** (port de `TerminalWindow.jsx` + `Prompt.jsx`), barre titre `anon.@jouan.ovh: ~`, 3 pastilles, puis prompts `whoami` / `cat stack.txt` (sortie `--term-blue`) / `ls ~/projets` (sortie `--term-green`), et ligne `help` avec **caret clignotant** (seule animation en boucle, keyframe globale `caret-blink`, neutralisée sous `prefers-reduced-motion`).
docs/implementation-artifacts/3-1-hero-terminal-a.md-159-- Format prompt fidèle au DS : `anon.@jouan.ovh:~$ <commande>` (user/dir colorés `--prompt` / `--term-blue`).
docs/implementation-artifacts/3-1-hero-terminal-a.md-160-
--
docs/implementation-artifacts/3-1-hero-terminal-a.md-167-
docs/implementation-artifacts/3-1-hero-terminal-a.md-168-- Tokens-only : couleurs/rayons/ombres/typo via `var(--…)`. Dégradés `.hero__grad` dérivés des tokens via `color-mix` (pas de HSL en dur). Dérogations px du chrome terminal (fenêtre 300px, barre 30px, pastilles 13px/gap 7px, caret en em, délai 80ms) **commentées explicitement** — specs DS sans token équivalent (cf. tolérance documentée Epic 2).
docs/implementation-artifacts/3-1-hero-terminal-a.md:169:- Focus visible (`--ring-accent`) sur la ligne `help` ; pastilles décoratives `aria-hidden` ; `prefers-reduced-motion` neutralise l'entrée `.anim` et le caret.
docs/implementation-artifacts/3-1-hero-terminal-a.md-170-
docs/implementation-artifacts/3-1-hero-terminal-a.md-171-**Écarts signalés :**
--
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-38-- [x] Tâche 4 — Garantir « caret = seule animation en boucle » + reduced-motion (AC: caret = seule boucle, NFR9/UX-DR17)
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-39-  - [x] Vérifier qu'aucune autre animation/transition en boucle n'est introduite par le restyle (pas de pulsation, scanline, etc.).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:40:  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-41-- [x] Tâche 5 — Vérification visuelle (AC: rend conformément au DS)
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-42-  - [x] `yarn lint` (eslint + stylelint) sans nouvelle erreur ; `yarn generate` (build statique) vert.
--
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-51-- [x] [Review][Decision] **Teleport → terminal positionné relativement au document (régression hors-viewport + drag faussé quand la page est scrollée)** [app/components/terminal/TerminalComponent.vue:9-20, 232-238] — `<Teleport to="body">` sort `.terminal` (`position: absolute; top:60px; left:15px`) du `.hdr` (sticky + `backdrop-filter` = ancien bloc conteneur épinglé au viewport ; confirmé HeaderComponent.vue:190/201). Le bloc conteneur devient le document : ouvert page scrollée, le terminal s'affiche au-dessus du viewport (top:60px = 60px sous le HAUT du **document**) et `focusUserInput()` au montage tire le scroll vers le haut ; le clamp drag utilise `window.innerHeight/innerWidth` (viewport, l.232-233) tandis que `style.top/left` est désormais document-relatif (l.237-238) → drag « collé » en haut quand scrollé. **Sévérité : High.** Vérif empirique Chrome DevTools bloquée (navigateur déjà ouvert) — à confirmer en scrollant la page puis en ouvrant. Options : (a) `position: fixed` sur `.terminal` (re-cohérent avec le clamp viewport + le drag `clientX/Y` — vraisemblablement le fix propre) ; (b) compenser `scrollX/scrollY` à l'ouverture et dans le drag ; (c) replier ce correctif dans la story 8.3 (réécriture `<script setup>`). → **Décision Simon : (a) `position: fixed`** — corriger en 8.1, re-vérifier au navigateur (scroll + drag + resize).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-52-- [x] [Review][Decision] **Alpha de bordure 0.28 vs 0.4 (AC + DS)** [app/components/terminal/TerminalComponent.vue:323] — code = `border: 1px solid var(--accent-2-soft)`, or `--accent-2-soft = hsl(319 40% 30% / 28%)`, alors que Task 1 et `TerminalWindow.jsx` exigent `hsl(319 40% 30% / 0.4)`. Même teinte, alpha ~30 % plus transparent. **Medium.** Options : (a) ajouter/ajuster un token à alpha 0.4 ; (b) dérogation commentée `hsl(319 40% 30% / 0.4)` (comme le rouge de la pastille close) ; (c) accepter 0.28 (priorité tokens-only). → **Décision Simon : (a) nouveau token DS à alpha 0.4** (dans `_root.scss`) consommé par la bordure.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:53:- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-54-
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-55-### Patchs (correctifs sans ambiguïté)
--
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-70-- **[High] Teleport/positionnement** → `.terminal` en `position: fixed`. Ouvert page scrollée (y=700) : terminal dans le viewport (top:60/left:15), **aucun saut de scroll** au focus ; **drag 1:1** (Δcurseur +200/+150 → fenêtre +200/+150), **resize** OK (800×400 → 907×467).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-71-- **[Med] Bordure 0.4** → nouveau token `--border-terminal: hsl(319 40% 30% / 40%)` dans `_root.scss`, consommé par `.terminal` ; computed = `rgba(107,46,88,0.4)`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:72:- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-73-- **[Med] `pre-wrap` artefacts** → `.terminal-response { white-space: normal }` sur les conteneurs `v-html` ; `about`/`system-info` rendus sans ligne vide (0 ligne blanche parasite), bannière ASCII préservée.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-74-- **[Low] Séparateurs gras** → `.git-prompt-separator { font-weight: var(--fw-regular) }` (les séparateurs héritaient du gras du parent `.git-prompt`) ; computed : `:`/`$` = 400, `user@host`/`~` = 700.
--
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-115-### Caret = seule animation en boucle (contrainte clé)
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-116-
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:117:- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-118-
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-119-### Pièges / régressions à éviter (NFR9)
--
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-127-### Testing standards
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-128-
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:129:- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-130-
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md-131-### References
--
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md-188-- `docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md` (A) — story suivante prête pour dev.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md-189-- `docs/implementation-artifacts/10-3-liens-externes-accessibles.md` (A) — story suivante prête pour dev.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:190:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (A) — story suivante prête pour dev.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md-191-- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (A) — story suivante prête pour dev.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md-192-- `docs/implementation-artifacts/10-6-conformite-legale-rgpd-mentions.md` (A) — story suivante prête pour dev.
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-15-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-16-You are an Acceptance Auditor. Review the provided diff against:
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:17:- Spec file: `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md`
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-18-- Context specs: `docs/planning-artifacts/epics.md` (Story 10.4), `docs/project-context.md`
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-19-- Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-250-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-251-exec
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:252:/bin/zsh -lc "printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md; printf '%s\\n' '--- epics story ---'; rg -n -A80 -B10 '10\\.4|validation|a11y|emulee|forced colors' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,260p' docs/project-context.md; printf '%s\\n' '--- diff stat ---'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/10-4/full.diff || true; printf '%s\\n' '--- diff ---'; sed -n '1,320p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-253- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-254---- spec ---
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-257----
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-258-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:259:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-260-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-261-Status: review
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-271-## Acceptance Criteria
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-272-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:273:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:274:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:275:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-276-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-277-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-278-## Tasks / Subtasks
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-279-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:280:- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:281:  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-282-  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:283:- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:284:  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-285-  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:286:- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:287:  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-288-- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-289-  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-294-### Périmètre & frontières
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-295-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:296:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:297:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-298-- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-299-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-300-### Fichiers concernés (lus — baseline `3e82045`)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-301-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:302:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-303-- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:304:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:305:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-306-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-307-### Pièges / régressions à éviter
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-308-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:309:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-310-- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-311-- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-315-### Testing standards
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-316-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:317:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-318-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-319-### References
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-333-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-334-- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:335:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-336-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-337-### Completion Notes List
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-338-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-339-- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:340:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-341-  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:342:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-343-- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-344-  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:345:  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-346-- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-347-  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-351-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-352-- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:353:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-354-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-355---- epics story ---
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-366-36:FR12: Généraliser la convention a11y titres/listes (`<h2 class="eyebrow">` + séquences `<ol>`/`<ul>`) à home et services (+ process `/services` en `<ol>`) et durcir la sémantique de la colonne `/contact` (`<dl>/<dt>/<dd>`, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non vocalisé). _(deferred-work a11y #1, #3 ; rétro Epic 9)_
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-367-37:FR13: Auditer et uniformiser site-wide les liens `target="_blank"` (indication « nouvel onglet » sr-only) via un helper de lien externe factorisé. _(deferred-work a11y #2 ; WCAG G201)_
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:368:38:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-369-39-FR15: Centraliser le SEO site-wide (`useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization`) et étendre OG/JSON-LD aux pages encore nues (home, services, contact). _(deferred-work SEO #6)_
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-370-40-FR16: Publier la conformité légale — page politique de confidentialité (RGPD, sous-traitant Web3Forms) + mentions légales, liées depuis footer/formulaire. _(deferred-work RGPD #8)_
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-411-81-UX-DR15: Blog — index avec empty-state soigné + vue article prose/code stylés (réf. `Blog.jsx`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-412-82:UX-DR16: Contact — formulaire (validation front, pas de backend) + carte infos + CTA terminal + socials (réf. `Contact.jsx`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:413:83-UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-414-84-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-415-85-### FR Coverage Map
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-428-98-FR12: Epic 10 — A11y sémantique résiduelle (home/services/contact)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-429-99-FR13: Epic 10 — Liens externes accessibles (helper + audit `_blank`)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:430:100:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-431-101-FR15: Epic 10 — SEO centralisé site-wide
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-432-102-FR16: Epic 10 — Conformité légale (RGPD + mentions légales)
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-468-138-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-469-139-### Epic 9: Accessibilité & finitions motion
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:470:140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-471-141-**FRs covered:** FR11 _(UX-DR17)_
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-472-142-
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-581-606-**And** aucun `_blank` non audité ne subsiste (vérif `grep`) ; rendu visuel inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-582-607-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:583:608:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-584-609-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-585-610-As a visiteur en contraste forcé ou motion réduit,
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-589-614-**Acceptance Criteria:**
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-590-615-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:591:616-**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:592:617-**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:593:618-**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-594-619-**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-595-620-
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-837-  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-838-  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:839:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-840-- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-841-- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-851-  Epic 8 : embarquer la checklist a11y **dès la consigne** de chaque story (9.1/9.2),
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-852-  pas seulement en revue —
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:853:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-854-    appliqué **une seule fois au niveau des primitives DS** (`ZButton`/`ZTag`/`ZCard`/
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-855-    `ZInput`/liens), pas page par page ;
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-869-- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-870-  orange Ubuntu comme unique accent héros.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:871:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-872-  terminal.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-873-
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-907--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-908-+    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:909:+    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-910-+    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:911:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-912-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-913-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-919-   &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-920--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:921:+    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:922:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-923-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-924-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-926-   }
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-927-@@ -612,16 +618,4 @@ const { open: openTerminal } = useTerminal();
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:928:     animation: none;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-929-   }
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-930- }
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-931--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:932:-// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-933--// neutralisées → on restaure un outline système visible sur les éléments focusables
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-934--// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-935--// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:936:-@media (forced-colors: active) {
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-937--  .hero-term__open:focus-visible,
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-938--  .offer__more:focus-visible {
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-942--}
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-943- </style>
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:944:diff --git a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-945-index a83966c..eb0e053 100644
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:946:--- a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:947:+++ b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-948-@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-949- 
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:950: # Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-951- 
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-952--Status: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-959- ## Tasks / Subtasks
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-960- 
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:961:-- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:962:-  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-963--  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:964:-- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:965:-  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-966--  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:967:-- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:968:-  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-969--- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-970--  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-971--  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:972:+- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:973:+  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-974-+  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:975:+- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:976:+  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-977-+  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:978:+- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:979:+  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-980-+- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-981-+  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-993- 
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-994-+- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:995:+- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-996-+
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-997- ### Completion Notes List
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-998- 
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-999-+- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1000:+  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1001-+  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1002:+  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1003-+- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1004-+  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1005:+  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1006-+- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1007-+  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1011-+
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1012-+- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1013:+- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1014-+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1015-diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1021-   10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1022-   10-3-liens-externes-accessibles: done
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1023:-  10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1024:+  10-4-validation-a11y-emulee-et-unification-forced-colors: review
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1025-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1026-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1028-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-1029-codex
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1030:The change is very narrow: two focus rules in `index.vue`, removal of its page-level `forced-colors` block, and documentation/status updates. I’m checking the surrounding implementation and global patterns now so findings distinguish actual code gaps from merely unsupported completion claims.
--
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-38-4. **Discordance fiche-story vs source de vérité, répétée 3×.** Les 3 fiches citent `max-width: 720px` ; `kit.css` (vérité) utilise `900px`. Le dev a suivi `kit.css` à chaque fois et l'a signalé. Discordance **systématique dans les fiches**. → Action A3.
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-39-
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:40:5. **Conventions qui se propagent proprement.** Clés `v-for` sur `id` stable (établi 3.1 → appliqué 3.2/3.3), repli `forced-colors` local, libellé sr-only « nouvel onglet ». Cohérence intra-fichier tenue. `<component :is>` géré correctement dès 3.1 (import via `#components`) — la leçon Epic 2 est passée dans les réflexes.
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-41-
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:42:6. **`forced-colors`** (rings de focus en `box-shadow` supprimés en contraste forcé) : trou **systémique du DS**, traité localement sur `/`, reporté DS-wide à **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-43-
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-44----
--
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-93-
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-94-### Reports déjà tracés (rappel, pas de nouvelle action)
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:95:- `forced-colors` DS-wide + audit `_blank` site-wide → **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-96-- **Déploiement gh-pages → fin de refonte** (Action 5 d'Epic 2). Risque croissant consigné.
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-97-
--
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-109-- ⚠️ **Contenu à porter** : 3.2 a **volontairement reporté** les `points`/`price` des offres à Epic 4 → c'est là qu'on affiche les offres détaillées (réf. `Services.jsx` / `data.js`).
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-110-- ⚠️ **Appliquer A1 dès 4.1** : diff visuel Chrome DevTools contre `ui_kits/jouan-site/index.html` (+ `services.png`).
docs/implementation-artifacts/epic-3-retro-2026-06-22.md:111:- ⚠️ **Reports** : déploiement non prouvé (grossit) ; `forced-colors` / `_blank` → Epic 9.
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-112-
docs/implementation-artifacts/epic-3-retro-2026-06-22.md-113-**Découverte significative invalidant le plan d'Epic 4 ? → Non.** Primitives prêtes, route à créer, plan sain. Aucune re-planification requise.
--
docs/implementation-artifacts/5-1-portrait-et-bio.md-145-### File List
docs/implementation-artifacts/5-1-portrait-et-bio.md-146-
docs/implementation-artifacts/5-1-portrait-et-bio.md:147:- `app/pages/about.vue` (MODIFIÉ — refonte complète Options API legacy → `<script setup lang="ts">` ; correctifs de revue : « M'écrire », `initials`, meta 1ʳᵉ pers., OG/Twitter/canonical, focus-ring `forced-colors`, primitives de layout retirées)
docs/implementation-artifacts/5-1-portrait-et-bio.md-148-- `public/images/portrait.jpeg` (CRÉÉ — copie de `docs/design_system/assets/brand/portrait.jpeg`)
docs/implementation-artifacts/5-1-portrait-et-bio.md-149-- `app/assets/scss/base/_layout.scss` (CRÉÉ — primitives de layout DS globales `.section`/`.section--sunken`/`.container`/`.eyebrow`/`.prose`)
--
docs/implementation-artifacts/5-1-portrait-et-bio.md-159-| ---------- | ------- | --------------------------------------------------------------------------- |
docs/implementation-artifacts/5-1-portrait-et-bio.md-160-| 2026-06-23 | 0.1     | Implémentation story 5.1 — refonte `/about` (hero portrait + bio) sur le DS |
docs/implementation-artifacts/5-1-portrait-et-bio.md:161:| 2026-06-23 | 0.2     | Correctifs de revue — 6 findings résolus (3 patchs + 3 deferred traités, zéro dette) : « M'écrire », `initials`, meta 1ʳᵉ pers., OG/Twitter/canonical, focus-ring `forced-colors`, extraction des primitives de layout dans un partiel global |
docs/implementation-artifacts/5-1-portrait-et-bio.md-162-| 2026-06-23 | 0.3     | Re-revue des correctifs (commit `5913e82`) : 6 findings vérifiés résolus, aucune fuite globale ni régression de cascade, build vert (lint + typecheck + generate). Statut → `done`. |
docs/implementation-artifacts/5-1-portrait-et-bio.md-163-
--
docs/implementation-artifacts/5-1-portrait-et-bio.md-170-- [x] [Review][Patch] `ZAvatar` sans prop `initials` → le repli affiche « ? » si le portrait échoue au chargement ; ajouter `initials="SJ"` pour un fallback gracieux (l'image existe et est prérendue, donc défensif/faible) [app/pages/about.vue:12] — ✅ résolu : `initials="SJ"`.
docs/implementation-artifacts/5-1-portrait-et-bio.md-171-- [x] [Review][Defer→Fixed] Primitives de layout `.section`/`.container`/`.prose`/`.eyebrow` redéclarées en `<style scoped>` dans chaque page (`index.vue`, `services.vue`, `about.vue`) au lieu d'un partiel partagé. — ✅ résolu (décision Simon : zéro dette) : extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications supprimées des 3 pages. Vérif visuelle desktop des 3 pages : aucune régression.
docs/implementation-artifacts/5-1-portrait-et-bio.md:172:- [x] [Review][Defer→Fixed] Anneau de focus du lien bio en `box-shadow: var(--ring-accent)` + `outline: none`, sans repli → disparaît en `forced-colors` (High Contrast). — ✅ résolu localement : `outline: 2px solid transparent` + `outline-offset` (rendu en couleur système en `forced-colors`). NB : le pattern DS-wide identique (ZButton/ZInput) reste tracé pour l'Epic 9 — hors diff 5.1.
docs/implementation-artifacts/5-1-portrait-et-bio.md-173-- [x] [Review][Defer→Fixed] Aucune balise Open Graph / Twitter / canonical pour le partage social. — ✅ résolu (décision Simon : zéro dette) : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` d'`about.vue` (domaine `dev.jouan.ovh` cf. CNAME) ; vérifiés dans le HTML prérendu, `description` dédoublonnée par unhead.
--
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md-2-
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md-3-You are an Acceptance Auditor. Review the provided diff against:
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md:4:- Spec file: `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md`
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md-5-- Context specs: `docs/planning-artifacts/epics.md` (Story 10.4), `docs/project-context.md`
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md-6-- Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
--
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-80-
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-81-### Reports déjà tracés (rappel, pas de nouvelle action)
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:82:- `forced-colors` DS-wide + audit `_blank` site-wide → **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-83-- **Déploiement gh-pages → fin de refonte.** Risque croissant consigné (17 stories empilées).
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-84-
--
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-96-- ⚠️ **Asset à porter** : le **portrait** (image) — vérifier sa présence dans `docs/design_system/assets/`, le copier vers `public/images/`, servi via `<NuxtImg>` avec `alt` et fallback visuel.
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-97-- ⚠️ **Appliquer A1 dès 5.1** : diff visuel Chrome DevTools contre `About.jsx` / `ui_kits/jouan-site/index.html`.
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:98:- ⚠️ **Reports** : déploiement non prouvé (grossit) ; `forced-colors` / `_blank` → Epic 9.
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-99-
docs/implementation-artifacts/epic-4-retro-2026-06-23.md-100-**Découverte significative invalidant le plan d'Epic 5 ? → Non.** Primitives prêtes, route existante, contenu dans `data.js`, plan sain. Aucune re-planification requise.
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-9--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/full.diff-10-+    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/full.diff:11:+    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/full.diff-12-+    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/full.diff:13:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/full.diff-14-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/full.diff-15-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-21-   &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/full.diff-22--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/full.diff:23:+    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/full.diff:24:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/full.diff-25-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/full.diff-26-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-28-   }
docs/implementation-artifacts/code-reviews/10-4/full.diff-29-@@ -612,16 +618,4 @@ const { open: openTerminal } = useTerminal();
docs/implementation-artifacts/code-reviews/10-4/full.diff:30:     animation: none;
docs/implementation-artifacts/code-reviews/10-4/full.diff-31-   }
docs/implementation-artifacts/code-reviews/10-4/full.diff-32- }
docs/implementation-artifacts/code-reviews/10-4/full.diff-33--
docs/implementation-artifacts/code-reviews/10-4/full.diff:34:-// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
docs/implementation-artifacts/code-reviews/10-4/full.diff-35--// neutralisées → on restaure un outline système visible sur les éléments focusables
docs/implementation-artifacts/code-reviews/10-4/full.diff-36--// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
docs/implementation-artifacts/code-reviews/10-4/full.diff-37--// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
docs/implementation-artifacts/code-reviews/10-4/full.diff:38:-@media (forced-colors: active) {
docs/implementation-artifacts/code-reviews/10-4/full.diff-39--  .hero-term__open:focus-visible,
docs/implementation-artifacts/code-reviews/10-4/full.diff-40--  .offer__more:focus-visible {
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-44--}
docs/implementation-artifacts/code-reviews/10-4/full.diff-45- </style>
docs/implementation-artifacts/code-reviews/10-4/full.diff:46:diff --git a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/full.diff-47-index a83966c..eb0e053 100644
docs/implementation-artifacts/code-reviews/10-4/full.diff:48:--- a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/full.diff:49:+++ b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/full.diff-50-@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
docs/implementation-artifacts/code-reviews/10-4/full.diff-51- 
docs/implementation-artifacts/code-reviews/10-4/full.diff:52: # Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/full.diff-53- 
docs/implementation-artifacts/code-reviews/10-4/full.diff-54--Status: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-61- ## Tasks / Subtasks
docs/implementation-artifacts/code-reviews/10-4/full.diff-62- 
docs/implementation-artifacts/code-reviews/10-4/full.diff:63:-- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/full.diff:64:-  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/full.diff-65--  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/full.diff:66:-- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/full.diff:67:-  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/full.diff-68--  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/full.diff:69:-- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/full.diff:70:-  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/full.diff-71--- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/full.diff-72--  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
docs/implementation-artifacts/code-reviews/10-4/full.diff-73--  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
docs/implementation-artifacts/code-reviews/10-4/full.diff:74:+- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/full.diff:75:+  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/full.diff-76-+  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/full.diff:77:+- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/full.diff:78:+  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/full.diff-79-+  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/full.diff:80:+- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/full.diff:81:+  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/full.diff-82-+- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/full.diff-83-+  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-95- 
docs/implementation-artifacts/code-reviews/10-4/full.diff-96-+- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/full.diff:97:+- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/full.diff-98-+
docs/implementation-artifacts/code-reviews/10-4/full.diff-99- ### Completion Notes List
docs/implementation-artifacts/code-reviews/10-4/full.diff-100- 
docs/implementation-artifacts/code-reviews/10-4/full.diff-101-+- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/code-reviews/10-4/full.diff:102:+  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/full.diff-103-+  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/code-reviews/10-4/full.diff:104:+  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/full.diff-105-+- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/code-reviews/10-4/full.diff-106-+  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/code-reviews/10-4/full.diff:107:+  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/full.diff-108-+- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/code-reviews/10-4/full.diff-109-+  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-113-+
docs/implementation-artifacts/code-reviews/10-4/full.diff-114-+- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/full.diff:115:+- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/full.diff-116-+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/full.diff-117-diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
--
docs/implementation-artifacts/code-reviews/10-4/full.diff-123-   10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-4/full.diff-124-   10-3-liens-externes-accessibles: done
docs/implementation-artifacts/code-reviews/10-4/full.diff:125:-  10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/full.diff:126:+  10-4-validation-a11y-emulee-et-unification-forced-colors: review
docs/implementation-artifacts/code-reviews/10-4/full.diff-127-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/full.diff-128-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-34-3. **Le filet visuel (A1) a corrigé la maquette, pas seulement le port.** L'œil de Simon a attrapé que les points de la timeline n'étaient **pas centrés sur le rail dans `kit.css` lui-même** (défaut de la référence). Refondu avec un axe commun `--tl-axis` + `transform: translateX(-50%)` → centres alignés. Le diff visuel dépasse son rôle initial : il **améliore la source** au lieu de la copier fidèlement.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-35-
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:36:4. **L'a11y reste partiellement attrapée en revue — mais traitée avec discipline.** 5.1 : focus-ring `forced-colors`, balises OG/Twitter/canonical. 5.2 : hiérarchie de titres (eyebrows → `<h2 class="eyebrow">` neutralisés), sémantique de listes (expériences `<ol>`, formation/stack `<ul>`/`<li>`). Tout **corrigé localement sur `/about`**, avec rendu strictement identique ; la **généralisation DS-wide explicitement tracée pour l'Epic 9** (cf. §5) plutôt qu'en rustines éparpillées. Choix assumé.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-37-
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-38-5. **« Zéro dette » réaffirmé systématiquement.** Chaque finding `decision-needed` / `defer` a été tranché par Simon vers une correction immédiate (« Defer→Fixed »). Aucune dette laissée derrière l'épic.
--
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-67-
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-68-**L'Epic 9 (a11y & motion) accumule une dette différée qui grossit.** Reports a11y consciemment poussés vers Epic 9 au fil des épics :
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:69:- `forced-colors` DS-wide (rings de focus en `box-shadow` sans repli) — `ZButton` / `ZInput` / liens (depuis Epic 3).
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-70-- Généralisation de la convention **hiérarchie de titres** (eyebrow-as-heading) + **sémantique de listes** (`<ol>`/`<ul>`/`<li>`) à **home / services** + items 3.3 / 4.2 (établie localement sur `/about` en 5.2).
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-71-- Audit `_blank` / `rel` site-wide (depuis Epic 3).
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-72-
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:73:Chaque report est *justifié* (éviter les correctifs partiels dispersés), mais **Epic 9 devient un morceau conséquent** : à dimensionner réalistement au moment de le planifier. **Aucune perte** : l'inventaire est tracé ici (et dans `deferred-work.md` pour `forced-colors` / `_blank`). *Recommandation : y ajouter explicitement la convention titres/listes DS-wide avant d'attaquer Epic 9.*
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-74-
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-75-**Astérisque déploiement (Winston) :** branche `feat/design-system-revamp` toujours jamais mergée sur `main` ni déployée. **~19 stories** (Epics 1→5) empilées sur une chaîne CI gh-pages + `CNAME` jamais prouvée en réel. Report assumé en fin de refonte — risque croissant, tracé, pas un oubli.
--
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-87-
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-88-### Reports déjà tracés (rappel)
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:89:- Dette a11y DS-wide (`forced-colors`, titres/listes, `_blank`) → **Epic 9**. Inventaire ci-dessus (§5).
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-90-- Déploiement gh-pages → fin de refonte. Risque croissant consigné.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md-91-
--
docs/implementation-artifacts/deferred-work.md-13-### ✅ Soldé en Epic 9
docs/implementation-artifacts/deferred-work.md-14-
docs/implementation-artifacts/deferred-work.md:15:- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
docs/implementation-artifacts/deferred-work.md:16:- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
docs/implementation-artifacts/deferred-work.md-17-- ~~**Contraste — `--text-faint` sous AA**~~ — ✅ **Résolu (story 9.2)** : 4 textes informatifs réels remontés à `--text-muted` (token-only).
docs/implementation-artifacts/deferred-work.md-18-- ~~**Clavier — Échap + retour de focus terminal**~~ — ✅ **Résolu (story 9.2)**.
--
docs/implementation-artifacts/deferred-work.md-25-2. **Audit site-wide des liens `target="_blank"`** — indication « nouvel onglet » (span sr-only) posée localement sur les cartes projet de `/` (3.3) ; reste à auditer/uniformiser les **autres** `_blank` (hexagones sociaux header/footer…) et à factoriser un helper de lien externe (icône + libellé sr-only, WCAG G201). _(revue 3.3 — orphelin à la clôture d'Epic 9)_
docs/implementation-artifacts/deferred-work.md-26-3. **Sémantique a11y de la colonne `/contact`** — paires label/valeur en `<dl>/<dt>/<dd>`, titre de section, `aria-haspopup="dialog"` sur le CTA terminal, préfixe `//` non lu « slash slash ». _(différé 7.2 — orphelin à la clôture d'Epic 9)_
docs/implementation-artifacts/deferred-work.md:27:4. **Audit a11y émulé OS-level** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a **pas** été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules présence/résolution des règles CSS confirmées. À rejouer d'un coup (forced-colors + reduced-motion + lecteur d'écran). _(revues 9.1, 9.2)_
docs/implementation-artifacts/deferred-work.md:28:5. **Unifier les deux idiomes forced-colors** — repli inline `outline: 2px solid transparent` (primitives + châssis, 9.1) vs bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (epic 3). Inoffensif (les deux donnent un focus visible) ; candidat à unification DS-wide. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md-29-
docs/implementation-artifacts/deferred-work.md-30-**SEO :**
--
docs/implementation-artifacts/deferred-work.md-46-
docs/implementation-artifacts/deferred-work.md-47-- **Placeholder `ZInput` ~3.7:1 sur `--bg-input` (< 4.5:1 AA)** — résidu conscient : `--text-muted` (relevé de `--text-faint` ~2.2:1) reste sous AA sur la surface la plus claire, mais le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter encore le ferait passer pour une saisie. Acceptable tel quel ; à revoir si un token de placeholder dédié ≥ 4.5:1 est introduit. _(revue 9.2)_
docs/implementation-artifacts/deferred-work.md:48:- **Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a pas été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules la présence/résolution des règles CSS sont confirmées. À rejouer d'un coup lors d'un passage a11y émulé en fin de refonte (cf. aussi item « Émulation forced-colors » de la revue 9.1). _(revue 9.2)_
docs/implementation-artifacts/deferred-work.md-49-
docs/implementation-artifacts/deferred-work.md-50-## Deferred from: code review of 9-1-etats-interactifs-coherents (2026-06-29)
docs/implementation-artifacts/deferred-work.md-51-
docs/implementation-artifacts/deferred-work.md:52:- **Unifier les deux idiomes forced-colors** — depuis 9.1, le repli inline `outline: 2px solid transparent; outline-offset: 2px;` (primitives DS + liens du châssis) cohabite avec un bloc page-level `@media (forced-colors: active) { outline: 2px solid }` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Les deux donnent un focus visible en contraste forcé — **inoffensif, non bloquant**. Candidat à une unification DS-wide (un seul idiome) lors d'un futur passage a11y/DS. **Préexistant**, non introduit par 9.1. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:53:- **Émulation `forced-colors: active` non rejouée** — la visibilité réelle de l'anneau sous Windows High Contrast repose sur l'idiome WHCM (outline transparent → couleur système) ; vérifié par présence/résolution des déclarations + précédent codebase, **pas** par émulation visuelle (navigateur MCP verrouillé au moment de la revue). À confirmer d'un coup lors d'un audit a11y émulé (forced-colors + lecteur d'écran) en fin de refonte. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md-54-
docs/implementation-artifacts/deferred-work.md-55-## Deferred from: code review of 7-2-infos-cta-terminal-et-socials (2026-06-26)
--
docs/implementation-artifacts/deferred-work.md-83-
docs/implementation-artifacts/deferred-work.md-84-- ~~**Duplication inter-pages des primitives de layout**~~ — ✅ **Résolu** : primitives `.section` / `.section--sunken` / `.container` / `.eyebrow` / `.prose` extraites dans `app/assets/scss/base/_layout.scss` (global, chargé par `main.scss`) ; duplications scoped retirées de `index.vue`, `services.vue`, `about.vue`. Vérif visuelle desktop des 3 pages : aucune régression.
docs/implementation-artifacts/deferred-work.md:85:- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
docs/implementation-artifacts/deferred-work.md-86-- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.
docs/implementation-artifacts/deferred-work.md-87-
--
docs/implementation-artifacts/deferred-work.md-97-
docs/implementation-artifacts/deferred-work.md-98-- ~~`role="img" title=""` résiduel sur le wrapper racine `.init`~~ — ✅ **Résolu** lors du fix 3.2 (commit `132093d`) : attribut retiré de `app/layouts/default.vue`.
docs/implementation-artifacts/deferred-work.md:99:- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).
docs/implementation-artifacts/deferred-work.md-100-
docs/implementation-artifacts/deferred-work.md-101-## Deferred from: code review of 8-1-style-terminalwindow-et-prompt (2026-06-26)
--
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md-145-- [x] [Review][Defer] a11y sémantique de la carte infos : les `infoitem` sont des `<div>` label/valeur (pas de `<dl>/<dt>/<dd>` ni `aria`), le préfixe `//` est lu « slash slash », la colonne droite n'a pas de titre, et le CTA terminal pourrait porter `aria-haspopup="dialog"`. Fidèle au kit mais améliorable. — deferred, lot a11y Epic 9 (avec eyebrow→titre + listes home/services). _(Note DRY : `contact.email`/`city` sont inline ici comme `profile.email` dans `/about` — candidat à une constante `SITE` partagée, future consolidation.)_
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md-146-
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:147:_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-126--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-127-+    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:128:+    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-129-+    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:130:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-131-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-132-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-138-   &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-139--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:140:+    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:141:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-142-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-143-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-145-   }
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-146-@@ -612,16 +618,4 @@ const { open: openTerminal } = useTerminal();
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:147:     animation: none;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-148-   }
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-149- }
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-150--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:151:-// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-152--// neutralisées → on restaure un outline système visible sur les éléments focusables
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-153--// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-154--// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:155:-@media (forced-colors: active) {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-156--  .hero-term__open:focus-visible,
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-157--  .offer__more:focus-visible {
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-161--}
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-162- </style>
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:163:diff --git a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-164-index a83966c..eb0e053 100644
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:165:--- a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:166:+++ b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-167-@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-168- 
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:169: # Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-170- 
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-171--Status: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-178- ## Tasks / Subtasks
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-179- 
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:180:-- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:181:-  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-182--  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:183:-- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:184:-  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-185--  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:186:-- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:187:-  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-188--- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-189--  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-190--  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:191:+- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:192:+  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-193-+  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:194:+- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:195:+  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-196-+  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:197:+- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:198:+  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-199-+- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-200-+  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-212- 
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-213-+- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:214:+- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-215-+
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-216- ### Completion Notes List
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-217- 
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-218-+- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:219:+  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-220-+  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:221:+  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-222-+- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-223-+  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:224:+  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-225-+- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-226-+  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-230-+
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-231-+- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:232:+- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-233-+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-234-diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-240-   10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-241-   10-3-liens-externes-accessibles: done
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:242:-  10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:243:+  10-4-validation-a11y-emulee-et-unification-forced-colors: review
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-244-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-245-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-247-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-248-exec
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:249:/bin/zsh -lc "nl -ba app/pages/index.vue | sed -n '365,410p;485,525p;595,630p'; nl -ba docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md | sed -n '1,125p'; nl -ba docs/implementation-artifacts/sprint-status.yaml | sed -n '105,116p'" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-250- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-251-   365	  color: var(--ink-1);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-274-   388	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-275-   389	    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:276:   390	    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-277-   391	    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:278:   392	    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-279-   393	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-280-   394	    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-317-   505	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-318-   506	  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:319:   507	    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:320:   508	    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-321-   509	    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-322-   510	    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-356-   613	}
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-357-   614	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:358:   615	@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-359-   616	  .anim,
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:360:   617	  .prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:361:   618	    animation: none;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-362-   619	  }
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-363-   620	}
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-367-     3	---
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-368-     4	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:369:     5	# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-370-     6	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-371-     7	Status: review
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-381-    17	## Acceptance Criteria
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-382-    18	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:383:    19	**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:384:    20	**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:385:    21	**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-386-    22	**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-387-    23	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-388-    24	## Tasks / Subtasks
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-389-    25	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:390:    26	- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:391:    27	  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-392-    28	  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:393:    29	- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:394:    30	  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-395-    31	  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:396:    32	- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:397:    33	  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-398-    34	- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-399-    35	  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-404-    40	### Périmètre & frontières
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-405-    41	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:406:    42	- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:407:    43	- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-408-    44	- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-409-    45	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-410-    46	### Fichiers concernés (lus — baseline `3e82045`)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-411-    47	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:412:    48	- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-413-    49	- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:414:    50	- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:415:    51	- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-416-    52	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-417-    53	### Pièges / régressions à éviter
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-418-    54	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:419:    55	- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-420-    56	- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-421-    57	- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-425-    61	### Testing standards
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-426-    62	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:427:    63	- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-428-    64	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-429-    65	### References
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-443-    79	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-444-    80	- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:445:    81	- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-446-    82	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-447-    83	### Completion Notes List
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-448-    84	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-449-    85	- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:450:    86	  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-451-    87	  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:452:    88	  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-453-    89	- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-454-    90	  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:455:    91	  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-456-    92	- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-457-    93	  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-461-    97	
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-462-    98	- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:463:    99	- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-464-   100	- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-465-   105	  9-1-etats-interactifs-coherents: done
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-472-   112	  10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-473-   113	  10-3-liens-externes-accessibles: done
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:474:   114	  10-4-validation-a11y-emulee-et-unification-forced-colors: review
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-475-   115	  10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-476-   116	  10-6-conformite-legale-rgpd-mentions: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-477-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-478-exec
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:479:/bin/zsh -lc 'rg -n -C 3 "outline: 2px solid transparent|forced-colors|focus-visible" app | head -240' in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-480- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-481-app/pages/about.vue-240-    }
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-482-app/pages/about.vue-241-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-483-app/pages/about.vue-242-    // Anneau de focus accent + outline transparent : ce dernier reste invisible
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:484:app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-485-app/pages/about.vue-244-    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-486-app/pages/about.vue:245:    &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:487:app/pages/about.vue:246:      outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-488-app/pages/about.vue-247-      outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-489-app/pages/about.vue-248-      border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-494-app/pages/blog/[...slug].vue-179-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-495-app/pages/blog/[...slug].vue:180:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:496:app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-497-app/pages/blog/[...slug].vue-182-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-498-app/pages/blog/[...slug].vue-183-    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-503-app/pages/blog/[...slug].vue-267-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-504-app/pages/blog/[...slug].vue:268:    &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:505:app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-506-app/pages/blog/[...slug].vue-270-      outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-507-app/pages/blog/[...slug].vue-271-      border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-512-app/pages/contact.vue-405-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-513-app/pages/contact.vue:406:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:514:app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-515-app/pages/contact.vue-408-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-516-app/pages/contact.vue-409-    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-522-app/pages/index.vue:388:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-523-app/pages/index.vue-389-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:524:app/pages/index.vue:390:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-525-app/pages/index.vue-391-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:526:app/pages/index.vue:392:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-527-app/pages/index.vue-393-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-528-app/pages/index.vue-394-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-533-app/pages/index.vue-505-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-534-app/pages/index.vue:506:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:535:app/pages/index.vue:507:    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:536:app/pages/index.vue:508:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-537-app/pages/index.vue-509-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-538-app/pages/index.vue-510-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-543-app/components/HeaderComponent.vue-233-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-544-app/components/HeaderComponent.vue:234:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:545:app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-546-app/components/HeaderComponent.vue-236-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-547-app/components/HeaderComponent.vue-237-    border-radius: var(--radius-sm);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-552-app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-553-app/components/HeaderComponent.vue:267:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:554:app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-555-app/components/HeaderComponent.vue-269-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-556-app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-561-app/components/HeaderComponent.vue-303-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-562-app/components/HeaderComponent.vue:304:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:563:app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-564-app/components/HeaderComponent.vue-306-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-565-app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-570-app/components/HeaderComponent.vue-395-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-571-app/components/HeaderComponent.vue:396:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:572:app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-573-app/components/HeaderComponent.vue-398-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-574-app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-579-app/components/FooterComponent.vue-109-  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-580-app/components/FooterComponent.vue:110:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:581:app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-582-app/components/FooterComponent.vue-112-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-583-app/components/FooterComponent.vue-113-    border-radius: var(--radius-sm);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-588-app/components/FooterComponent.vue-152-  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-589-app/components/FooterComponent.vue:153:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:590:app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-591-app/components/FooterComponent.vue-155-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-592-app/components/FooterComponent.vue-156-    border-radius: var(--radius-xs);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-606-app/components/ui/ZButton.vue:134:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-607-app/components/ui/ZButton.vue-135-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:608:app/components/ui/ZButton.vue:136:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-609-app/components/ui/ZButton.vue-137-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:610:app/components/ui/ZButton.vue:138:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-611-app/components/ui/ZButton.vue-139-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-612-app/components/ui/ZButton.vue-140-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-617-app/components/ui/ZCard.vue-96-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-618-app/components/ui/ZCard.vue:97:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:619:app/components/ui/ZCard.vue:98:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-620-app/components/ui/ZCard.vue-99-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:621:app/components/ui/ZCard.vue:100:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-622-app/components/ui/ZCard.vue-101-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-623-app/components/ui/ZCard.vue-102-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-628-app/components/ui/ZTag.vue-146-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-629-app/components/ui/ZTag.vue:147:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:630:app/components/ui/ZTag.vue:148:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:631:app/components/ui/ZTag.vue:149:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-632-app/components/ui/ZTag.vue-150-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-633-app/components/ui/ZTag.vue-151-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-638-app/components/ui/ZTag.vue-175-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-639-app/components/ui/ZTag.vue:176:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:640:app/components/ui/ZTag.vue:177:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:641:app/components/ui/ZTag.vue:178:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-642-app/components/ui/ZTag.vue-179-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-643-app/components/ui/ZTag.vue-180-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-647-app/components/ui/ZInput.vue-173-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-648-app/components/ui/ZInput.vue-174-  &:focus {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:649:app/components/ui/ZInput.vue:175:    // Outline transparent → rendu en couleur système sous forced-colors (où la
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-650-app/components/ui/ZInput.vue-176-    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:651:app/components/ui/ZInput.vue:177:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-652-app/components/ui/ZInput.vue-178-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-653-app/components/ui/ZInput.vue-179-    border-color: var(--accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-723-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-724-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:725:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-726-                  /></span>
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-727-                </button>
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-858-// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-859-.anim {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:860:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-861-}
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-862-
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1056-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1057-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1058:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1059-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1060:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1061-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1062-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1089-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1090-// proportionnel à la police) — pas de token équivalent pour un curseur.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1091:.prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1092-  display: inline-block;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1093-  width: 0.55em;
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1098-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1099-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1100:  animation: caret-blink 1s steps(1) infinite;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1101-}
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1102-
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1173-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1174-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1175:    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1176:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1177-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1178-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1281-}
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1282-
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1283:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1284-  .anim,
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1285:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json:1286:    animation: none;
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1287-  }
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-1288-}
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-79--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-80-+    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:81:+    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-82-+    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:83:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-84-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-85-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-91-   &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-92--    outline: none;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:93:+    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:94:+    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-95-+    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-96-     box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-98-   }
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-99-@@ -612,16 +618,4 @@ const { open: openTerminal } = useTerminal();
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:100:     animation: none;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-101-   }
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-102- }
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-103--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:104:-// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-105--// neutralisées → on restaure un outline système visible sur les éléments focusables
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-106--// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-107--// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:108:-@media (forced-colors: active) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-109--  .hero-term__open:focus-visible,
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-110--  .offer__more:focus-visible {
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-114--}
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-115- </style>
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:116:diff --git a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-117-index a83966c..eb0e053 100644
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:118:--- a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:119:+++ b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-120-@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-121- 
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:122: # Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-123- 
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-124--Status: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-131- ## Tasks / Subtasks
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-132- 
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:133:-- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:134:-  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-135--  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:136:-- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:137:-  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-138--  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:139:-- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:140:-  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-141--- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-142--  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-143--  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:144:+- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:145:+  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-146-+  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:147:+- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:148:+  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-149-+  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:150:+- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:151:+  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-152-+- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-153-+  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-165- 
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-166-+- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:167:+- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-168-+
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-169- ### Completion Notes List
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-170- 
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-171-+- **Tâche 1 & 3 (Forced colors & Unification)** :
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:172:+  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-173-+  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:174:+  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-175-+- **Tâche 2 (Reduced motion)** :
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-176-+  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:177:+  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-178-+- **Tâche 4 (Lecteur d'écran & Gate)** :
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-179-+  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-183-+
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-184-+- `app/pages/index.vue` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:185:+- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-186-+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-187-diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-193-   10-2-a11y-semantique-residuelle: done
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-194-   10-3-liens-externes-accessibles: done
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:195:-  10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:196:+  10-4-validation-a11y-emulee-et-unification-forced-colors: review
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-197-   10-5-seo-centralise-site-wide: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-198-   10-6-conformite-legale-rgpd-mentions: ready-for-dev
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-200-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-201-exec
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:202:/bin/zsh -lc "rg -n --hidden -g '"'!node_modules'"' -g '"'!dist'"' -g '"'!*.lock'"' \"forced-colors|focus-visible|prefers-reduced-motion|prm__caret|caret-shape|box-shadow: var\\(--ring|outline: 2px solid transparent\" app docs/implementation-artifacts | head -240" in /Users/simon/dev/jouan.ovh
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-203- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:204:app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-205-app/pages/about.vue:245:    &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:206:app/pages/about.vue:246:      outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-207-app/pages/about.vue:249:      box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-208-app/pages/blog/[...slug].vue:180:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:209:app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-210-app/pages/blog/[...slug].vue:184:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-211-app/pages/blog/[...slug].vue:268:    &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:212:app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-213-app/pages/blog/[...slug].vue:272:      box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:214:docs/implementation-artifacts/2-4-primitive-zcard.md:47:- [x] [Review][Patch] Respecter `prefers-reduced-motion` pour les transitions/lift de `ZCard` et l'animation de `ZCardBody` [app/components/ui/ZCard.vue:54]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:215:docs/implementation-artifacts/2-4-primitive-zcard.md:120:- **Revue `ZCard`** : `as="button"` injecte `type="button"` par défaut tout en respectant un `type` explicite ; les autres attrs restent passthrough. `prefers-reduced-motion` neutralise la transition et le lift hover.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:216:docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:217:docs/implementation-artifacts/10-3-liens-externes-accessibles.md:70:- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:218:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:18:  - 9.1 — États interactifs cohérents : audit focus/hover/press ; **zéro nouvelle UI**. Hover/press déjà token-driven (aucun changement) ; travail réel = **visibilité du focus** (repli `forced-colors` aux primitives + anneau DS sur les liens du châssis).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:219:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:19:  - 9.2 — Motion réduit, contraste, clavier : filet global `prefers-reduced-motion` + exception caret ; audit contraste WCAG (`--text-faint`→`--text-muted`) ; clavier (Échap ferme le terminal + retour de focus).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:220:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:31:2. **`forced-colors` réglé au bon niveau (9.1).** Le repli (rings `box-shadow` invisibles en contraste forcé) posé **une seule fois à la source** — `ZButton`/`ZCard`/`ZTag`/`ZInput`, `outline: none` → `outline: 2px solid transparent` — plutôt que page par page. Solde l'item DS-wide #1 qui traînait depuis l'Epic 3. Lacune comblée au passage : les liens du châssis (logo, nav, footer) n'avaient que l'outline navigateur → anneau DS ajouté.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:221:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:39:6. **Deux limites honnêtes (cf. §5) :** vérification a11y **partielle** (forced-colors + reduced-motion non émulables via MCP) et **panier a11y d'Epic 9 non vidé** (3 items orphelins).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:222:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:47:| **Checklist a11y en amont** (forced-colors / clavier / contraste) dans la consigne 9.1/9.2 | ✅ **Tenu** | Dev Notes/tâches des deux stories structurées autour de ces axes avec sources DS (9.1 T4 focus/forced-colors ; 9.2 T2 contraste, T3 clavier). |
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:223:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:48:| **A1 — diff visuel/comportemental** | ⚠️ **Tenu partiellement** | Comportemental clavier au navigateur (sweep Tab, terminal Échap, form contact) ; mais **forced-colors + reduced-motion non émulables** → vérif visuelle incomplète (tracée). Limite d'outil, pas de discipline. |
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:224:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:58:- **Correctifs a11y au bon niveau** : forced-colors à la source (primitives), filet motion global — pas de rustines page par page.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:225:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:70:1. **Le panier a11y d'Epic 9 n'est pas vidé.** `deferred-work.md` avait routé **quatre** items a11y vers « Epic 9» ; les stories 9.1/9.2 en ont traité **un** (forced-colors). Restent **orphelins** (Epic 9 ferme, pas d'Epic 10 au démarrage) :
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:226:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:77:2. **Vérification a11y partielle.** `forced-colors` et `prefers-reduced-motion` **ne sont pas émulables** via Chrome DevTools MCP. Présence/résolution des règles CSS confirmées + précédent codebase, mais **pas** l'effet runtime visuel. La correction a11y de 9.1/9.2 n'est donc pas prouvée à l'œil → un **audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) reste à faire.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:227:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:94:  1. **A11y résiduel** : titres/listes home+services (+ process `<ol>`), audit `target="_blank"`, sémantique `/contact`, unification des idiomes forced-colors ;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:228:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:95:  2. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) ;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:229:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:140:4. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) — la vérif que le MCP ne permettait pas.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:230:docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:38:  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-231-docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:129:  - **a11y** : `×` = `<button type="button" aria-label="Retirer">` + `:focus-visible` ring (`--ring-accent`). Le tag cliquable reçoit `role="button"`, `tabindex="0"` par défaut, activation `Enter`/`Space`, et focus ring.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:232:docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:132:- **Conventions revues 2.3/2.4 appliquées** : `/* stylelint-disable selector-class-pattern */` inline (BEM `zbadge__dot`/`ztag--plain`…), `prefers-reduced-motion` neutralise la transition de `ZTag`. Aucun changement Stylelint global.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-233-app/pages/contact.vue:406:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:234:app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-235-app/pages/contact.vue:410:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:236:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:32:  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:237:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:127:  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:238:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:130:- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-239-app/components/HeaderComponent.vue:234:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:240:app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-241-app/components/HeaderComponent.vue:238:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-242-app/components/HeaderComponent.vue:267:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:243:app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-244-app/components/HeaderComponent.vue:270:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-245-app/components/HeaderComponent.vue:304:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:246:app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-247-app/components/HeaderComponent.vue:307:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-248-app/components/HeaderComponent.vue:396:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:249:app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-250-app/components/HeaderComponent.vue:399:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:251:app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:252:docs/implementation-artifacts/epic-7-retro-2026-06-26.md:69:- **Epic 9** — a11y DS-wide (forced-colors, généralisation titres/listes home/services, audit `_blank`, + sémantique infos `/contact`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:253:docs/implementation-artifacts/epic-7-retro-2026-06-26.md:102:- ⚠️ **Motion** : caret clignotant = **seule** animation en boucle (respecter `prefers-reduced-motion`) — recoupe le lot motion d'Epic 9.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:254:docs/implementation-artifacts/epic-2-retro-2026-06-22.md:34:1. **La revue trouve de vrais bugs invisibles au lint — surtout en a11y.** ~13 des 24 findings sont d'accessibilité : `ZTag` non focusable au clavier (2.5), retour de focus après fermeture du menu mobile (2.8), `aria-current` (2.8), fallback avatar sur image échouée (2.6), `prefers-reduced-motion` sur les lifts de carte (2.4). `lint + typecheck + generate` ne les voit pas ; la revue, oui.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:255:docs/implementation-artifacts/epic-2-retro-2026-06-22.md:78:1. **Checklist pré-revue dans chaque consigne d'agent** : « tokens-only (aucune valeur en dur) + a11y (focus visible, clavier Enter/Space, `aria-*`, `prefers-reduced-motion`) » à auto-vérifier avant de passer la story en revue. Complète la règle de périmètre Epic 1 (#1).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:256:app/pages/index.vue:59:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-257-app/pages/index.vue:388:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:258:app/pages/index.vue:390:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:259:app/pages/index.vue:392:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-260-app/pages/index.vue:394:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:261:app/pages/index.vue:423:.prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-262-app/pages/index.vue:506:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:263:app/pages/index.vue:507:    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:264:app/pages/index.vue:508:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-265-app/pages/index.vue:510:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:266:app/pages/index.vue:615:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:267:app/pages/index.vue:617:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:268:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:21:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:269:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:26:- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:270:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:271:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:28:  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:272:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:29:  - [x] **Exception explicite** : le caret clignotant du terminal **reste** la seule boucle autorisée — confirmer qu'il n'est pas désactivé par mégarde (ou qu'il reste lisible si réduit). **Fait** : terminal réel = caret **natif** de l'`<input>` (`caret-color`/`caret-shape`, non piloté par CSS → intact). Caret décoratif du hero (`.prm__caret`) = figé sur état **visible** (`animation: none` dans le filet global + garde index.vue) plutôt que de sauter à la frame finale `opacity:0` → reste lisible.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:273:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:274:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:275:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:63:- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:276:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:67:- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:277:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:69:- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:278:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:92:- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:279:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:97:- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:280:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:101:- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:281:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:120:- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered). 1ère passe lint : 4 nits stylelint (3× empty-line-before-comment, 1× selector-class-pattern sur `.prm__caret`) → corrigés (lignes vides + `stylelint-disable selector-class-pattern` commenté).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:282:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:125:  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:283:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:284:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:138:- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:285:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:140:- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:286:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:153:| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:287:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:55:- [x] [Review][Defer] `outline:none` + ring `box-shadow` KO en forced-colors [app/pages/index.vue `.offer__more:focus-visible`] — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → focus invisible. Pattern **systémique du DS** (ZButton, etc.), à corriger centralement (`@media (forced-colors: active)` restaurant l'outline) — relève d'Epic 9 (contraste/clavier), pas de cette story. [blind]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:288:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:168:- ✅ Resolved review finding [Defer→corrigé ciblé] focus en `forced-colors` : ajout d'un repli `@media (forced-colors: active)` restaurant un `outline` sur les éléments focusables **propres à cette page** (`.offer__more`, `.hero-term__open`) → cette page ne porte plus la dette. **Le repli DS-wide** (ZButton/ZTag/ZCard/ZInput, focus via `box-shadow`) reste un correctif central **assigné à Epic 9** : le traiter ici impliquerait de toucher toutes les primitives Epic 2 (élargissement de périmètre, justement pointé par le finding Decision).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:289:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:290:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:182:- 2026-06-22 — Corrections de revue de code : 2 findings [Patch] (aria-label liens, clés v-for stables) + 2 [Defer] traités (retrait `role="img"` sur `.init` ; repli `forced-colors` pour les focusables de la page ; repli DS-wide laissé à Epic 9). Lint/typecheck/generate verts. Statut → review.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:291:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:183:- 2026-06-22 — Re-revue (vérification post-fix, commit `132093d`) : 2 patchs confirmés dans le code (aria-label distincts ×3, clés `id` stables) + 2 defers réellement traités (`role="img"` retiré ; `@media (forced-colors: active)` sur `.offer__more`/`.hero-term__open`). `pnpm lint` (0/0) + `pnpm typecheck` verts (couverts par la vérif HEAD `5056196`). Aucune régression. Statut → done.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:292:docs/implementation-artifacts/deferred-work.md:15:- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:293:docs/implementation-artifacts/deferred-work.md:16:- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:294:docs/implementation-artifacts/deferred-work.md:27:4. **Audit a11y émulé OS-level** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a **pas** été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules présence/résolution des règles CSS confirmées. À rejouer d'un coup (forced-colors + reduced-motion + lecteur d'écran). _(revues 9.1, 9.2)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:295:docs/implementation-artifacts/deferred-work.md:28:5. **Unifier les deux idiomes forced-colors** — repli inline `outline: 2px solid transparent` (primitives + châssis, 9.1) vs bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (epic 3). Inoffensif (les deux donnent un focus visible) ; candidat à unification DS-wide. _(revue 9.1)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:296:docs/implementation-artifacts/deferred-work.md:48:- **Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a pas été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules la présence/résolution des règles CSS sont confirmées. À rejouer d'un coup lors d'un passage a11y émulé en fin de refonte (cf. aussi item « Émulation forced-colors » de la revue 9.1). _(revue 9.2)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:297:docs/implementation-artifacts/deferred-work.md:52:- **Unifier les deux idiomes forced-colors** — depuis 9.1, le repli inline `outline: 2px solid transparent; outline-offset: 2px;` (primitives DS + liens du châssis) cohabite avec un bloc page-level `@media (forced-colors: active) { outline: 2px solid }` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Les deux donnent un focus visible en contraste forcé — **inoffensif, non bloquant**. Candidat à une unification DS-wide (un seul idiome) lors d'un futur passage a11y/DS. **Préexistant**, non introduit par 9.1. _(revue 9.1)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:298:docs/implementation-artifacts/deferred-work.md:53:- **Émulation `forced-colors: active` non rejouée** — la visibilité réelle de l'anneau sous Windows High Contrast repose sur l'idiome WHCM (outline transparent → couleur système) ; vérifié par présence/résolution des déclarations + précédent codebase, **pas** par émulation visuelle (navigateur MCP verrouillé au moment de la revue). À confirmer d'un coup lors d'un audit a11y émulé (forced-colors + lecteur d'écran) en fin de refonte. _(revue 9.1)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:299:docs/implementation-artifacts/deferred-work.md:85:- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:300:docs/implementation-artifacts/deferred-work.md:99:- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:301:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:302:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:303:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:304:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:305:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:306:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:307:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:118:- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:308:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:126:  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:309:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:128:- **Correctif central — repli `forced-colors` au niveau des primitives DS (deferred-work item #1, revues 3.2/5.1)** : les rings de focus en `box-shadow: var(--ring-accent)` disparaissent en contraste forcé (Windows High Contrast) → focus invisible. Corrigé **une seule fois à la source** (ZButton, ZCard, ZTag ×2, ZInput) en remplaçant `outline: none` par `outline: 2px solid transparent; outline-offset: 2px;` — invisible en rendu normal (le ring prend le relais), rendu en **couleur système** sous forced-colors. Pattern identique à celui déjà posé localement sur les pages (`contact__email`, lien bio `/about`…), désormais factorisé pour tous les consommateurs des primitives.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:310:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:129:- **Lacune de focus comblée — liens du châssis** : `hdr__brand`, `hdr__link`, `hdr__menu-link`, `ftr__brand`, `ftr__link` n'avaient **aucun** `:focus-visible` (ils tombaient sur l'outline UA par défaut, non conforme au DS). Ajout de l'anneau DS `--ring-accent` + repli forced-colors. `hdr__burger` (qui avait déjà le ring) reçoit aussi le repli forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:311:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:130:- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:312:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:135:- `app/components/ui/ZButton.vue` (MODIFIÉ — repli forced-colors sur `:focus-visible`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:313:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:136:- `app/components/ui/ZCard.vue` (MODIFIÉ — repli forced-colors sur `.zcard--interactive:focus-visible`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:314:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:137:- `app/components/ui/ZTag.vue` (MODIFIÉ — repli forced-colors sur `.ztag--clickable` + `.ztag__remove`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:315:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:138:- `app/components/ui/ZInput.vue` (MODIFIÉ — repli forced-colors sur `.zinput,.ztextarea:focus`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:316:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:139:- `app/components/HeaderComponent.vue` (MODIFIÉ — anneau DS sur `hdr__brand`/`hdr__link`/`hdr__menu-link` + repli forced-colors sur `hdr__burger`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:317:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:140:- `app/components/FooterComponent.vue` (MODIFIÉ — anneau DS + repli forced-colors sur `ftr__brand`/`ftr__link`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:318:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:143:- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — item Epic 9 #1 « repli forced-colors DS-wide » soldé)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:319:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:320:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:5:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:321:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:19:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:322:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:20:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:323:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:21:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:324:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:26:- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:325:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:27:  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:326:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:29:- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:327:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:30:  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:328:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:32:- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:329:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:33:  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:330:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:42:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:331:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:43:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:332:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:48:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:333:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:50:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:334:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:51:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:335:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:55:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:336:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:63:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:337:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:81:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:338:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:86:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:339:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:88:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:340:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:91:  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:341:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:99:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:342:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:36:4. **L'a11y reste partiellement attrapée en revue — mais traitée avec discipline.** 5.1 : focus-ring `forced-colors`, balises OG/Twitter/canonical. 5.2 : hiérarchie de titres (eyebrows → `<h2 class="eyebrow">` neutralisés), sémantique de listes (expériences `<ol>`, formation/stack `<ul>`/`<li>`). Tout **corrigé localement sur `/about`**, avec rendu strictement identique ; la **généralisation DS-wide explicitement tracée pour l'Epic 9** (cf. §5) plutôt qu'en rustines éparpillées. Choix assumé.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:343:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:69:- `forced-colors` DS-wide (rings de focus en `box-shadow` sans repli) — `ZButton` / `ZInput` / liens (depuis Epic 3).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:344:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:73:Chaque report est *justifié* (éviter les correctifs partiels dispersés), mais **Epic 9 devient un morceau conséquent** : à dimensionner réalistement au moment de le planifier. **Aucune perte** : l'inventaire est tracé ici (et dans `deferred-work.md` pour `forced-colors` / `_blank`). *Recommandation : y ajouter explicitement la convention titres/listes DS-wide avant d'attaquer Epic 9.*
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:345:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:89:- Dette a11y DS-wide (`forced-colors`, titres/listes, `_blank`) → **Epic 9**. Inventaire ci-dessus (§5).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-346-app/components/FooterComponent.vue:110:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:347:app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-348-app/components/FooterComponent.vue:114:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-349-app/components/FooterComponent.vue:153:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:350:app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-351-app/components/FooterComponent.vue:157:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:352:app/components/FooterComponent.vue:181:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:353:docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:147:_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:354:app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-355-docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:37:  - [x] Implémenter le caret clignotant du DS sur l'`input` (ou un caret rendu) : animation `caret-blink 1s steps(1) infinite` (token `motion.css`), couleur `--prompt`. Aujourd'hui le champ utilise `caret-color: var(--color-green)` natif — décider de garder le caret natif coloré OU de porter le caret bloc `.ds-prompt__caret`, mais une seule approche. → **Décision : caret natif coloré** (`caret-color: var(--prompt)`, `caret-shape: block`), seul choix robuste pour un `<input>` éditable (le caret suit la frappe). Clignote nativement, **aucune animation CSS en boucle ajoutée**.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:356:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:40:  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:357:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:53:- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:358:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:72:- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-359-docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:75:- **[Med] a11y close + input** → close : `role="button"`, `aria-label`, `tabindex="0"`, `@keydown.enter/.space.prevent`, `:focus-visible` (ring `--accent`) ; input : `aria-label`. Fermeture clavier (Enter) vérifiée.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:360:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:117:- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:361:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:129:- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-362-docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:166:- **Caret** : natif coloré (`caret-color: var(--prompt)`, `caret-shape: block`) — choix robuste pour un `<input>` éditable. Clignote nativement ; **aucune animation CSS en boucle introduite** → « caret = seule boucle » respecté par construction, reduced-motion géré par le navigateur.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:363:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:302:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:364:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:406:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:365:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:451:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:366:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:468:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:367:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:508:Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:368:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:837:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:369:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:851:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:370:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:869:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:371:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1438:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:372:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1775:app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:373:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1827:docs/project-context.md-205-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:374:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1847:docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:375:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1853:docs/planning-artifacts/epics.md:83:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:376:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1864:docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:377:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1871:docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:378:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2055:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-379-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2318:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:380:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2320:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:381:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2322:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-382-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2324:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:383:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2431:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:384:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2467:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:385:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2475:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:386:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2476:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:387:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2477:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:388:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2514:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-389-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2750:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:390:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2751:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-391-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2754:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-392-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2832:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-393-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2834:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:394:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3194:app/assets/scss/main.scss-6-@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-395-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3205:app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:396:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3207:app/assets/scss/base/_motion.scss-13-//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:397:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3217:app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:398:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3218:app/assets/scss/base/_motion.scss-24-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:399:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3547://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-400-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3556://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:401:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3558://  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:402:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3568:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:403:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3569:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:404:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3581:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-405-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4277:app/components/HeaderComponent.vue:234:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:406:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4278:app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-407-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4281:app/components/HeaderComponent.vue-238-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-408-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4291:app/components/HeaderComponent.vue:267:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:409:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4292:app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-410-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4294:app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-411-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4305:app/components/HeaderComponent.vue:304:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:412:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4306:app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-413-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4308:app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-414-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4333:app/components/HeaderComponent.vue:396:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:415:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4334:app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-416-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4336:app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-417-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4488:app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-418-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4634:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:419:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4635:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:420:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4637:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-421-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4639:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:422:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4658:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-423-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4821:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:424:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4822:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:425:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4823:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-426-docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4825:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:427:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5565:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:428:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6454:   429	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-429-app/components/HexagonLinkComponent.vue:39:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:430:app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-431-docs/implementation-artifacts/3-3-projets-selectionnes.md:46:- [x] [Review][Patch] (ex-Decision — résolu : corriger la primitive `ZCard`, élargissement Epic 2 à noter en rétro) Carte-lien projet sans indicateur de focus visible (a11y) — La carte est rendue en `<a>` focusable (`ZCard as="a"`), mais `ZCard` ne définit que `.zcard--interactive:hover` — **aucun `:focus-visible`** (vérifié `app/components/ui/ZCard.vue`). Au clavier, les liens projet n'ont aucun anneau de focus. Viole `project-context.md#Accessibilité` et la sous-tâche 4 (cochée sur une prémisse fausse : le DS ne définit que le hover, pas le focus). **Fix retenu (décision Simon)** : ajouter dans `app/components/ui/ZCard.vue` `.zcard--interactive:focus-visible { outline: none; box-shadow: var(--ring-accent) }` — corrige toutes les cartes-liens (sans effet de bord : les cartes services 3.2 ne sont pas focusables). Touche Epic 2 → **à remonter en rétrospective Epic 3**. [blind+edge+auditor]
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-432-docs/implementation-artifacts/3-3-projets-selectionnes.md:155:- ✅ Resolved review finding [Patch] focus carte-lien : ajout de `.zcard--interactive:focus-visible { outline: none; box-shadow: var(--ring-accent) }` dans `app/components/ui/ZCard.vue`. Corrige **toutes** les cartes interactives focusables (aucun effet sur les cartes non focusables comme les offres services 3.2, en `div`). Vérifié au Chrome DevTools : anneau orange `--ring-accent` (3px) au focus clavier de la carte projet. **Touche `ZCard` (Epic 2)** — décision Simon en revue ; **à remonter en rétrospective Epic 3** (élargissement de périmètre assumé).
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-435-docs/implementation-artifacts/3-3-projets-selectionnes.md:171:- 2026-06-22 — Re-revue (vérification post-fix, commit `5056196`) : patch focus confirmé dans `ZCard.vue` (`.zcard--interactive:focus-visible` = `--ring-accent`, sans effet de bord) ; span sr-only « nouvel onglet » confirmé (`.screen-reader-text` = utilitaire global réel, masqué visuellement). `pnpm lint` (0/0) + `pnpm typecheck` revérifiés verts via Docker ; aucune régression. Touche `ZCard` (Epic 2) → tracé pour la rétro Epic 3. Statut → done.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-436-docs/implementation-artifacts/epic-4-retro-2026-06-23.md:38:3. **Réutilisation des primitives sans friction.** `ZCard` (featured + badge), `ZButton` (primary/secondary, slot `#iconRight`), `ZBadge`, `ZIcon` consommés tels quels — aucune primitive réimplémentée, aucune correction à *remonter* dans l'Epic 2 (contraste avec Epic 3 où `ZCard:focus-visible` et le fond `default.vue` avaient dû être réparés au point de contact). Signe que les fondations sont stabilisées.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:437:docs/implementation-artifacts/epic-4-retro-2026-06-23.md:82:- `forced-colors` DS-wide + audit `_blank` site-wide → **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:438:docs/implementation-artifacts/epic-4-retro-2026-06-23.md:98:- ⚠️ **Reports** : déploiement non prouvé (grossit) ; `forced-colors` / `_blank` → Epic 9.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-439-app/components/ui/ZButton.vue:134:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:440:app/components/ui/ZButton.vue:136:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:441:app/components/ui/ZButton.vue:138:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-442-app/components/ui/ZButton.vue:140:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:443:app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-444-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-445-exec
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-447- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-448-// ============================================================
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:449://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-450-// ============================================================
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-451-// Filet de sécurité GLOBAL : dès que l'utilisateur demande moins de mouvement,
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-458-//  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-459-//    piloté par CSS → intact ici ;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:460://  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-461-//    VISIBLE (bloc plein) plutôt que de sauter à la frame finale (opacity: 0).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-462-//    Reste donc lisible, ne boucle plus (cf. story 9.2, tâche 1).
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-468-// `--dur-*` sont des durées d'animation positives) → pas de `var()` applicable ici.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-469-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:470:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:471:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-472-  *,
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-473-  *::before,
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-481-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-482-  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:483:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:484:    animation: none !important;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-485-  }
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-486-}
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-491-@use "abstract/typography";
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-492-@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:493:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-494-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-495-.fixed-height {
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-564-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-565-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:566:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-567-                  /></span>
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-568-                </button>
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-656-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-657-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:658:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-659-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:660:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-661-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-662-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-689-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-690-// proportionnel à la police) — pas de token équivalent pour un curseur.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:691:.prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-692-  display: inline-block;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-693-  width: 0.55em;
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-698-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-699-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:700:  animation: caret-blink 1s steps(1) infinite;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-701-}
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-702-
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-773-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-774-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:775:    // Outline transparent : rendu en couleur système sous forced-colors.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:776:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-777-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-778-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-817-}
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-818-
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:819:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-820-  .anim,
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:821:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:822:    animation: none;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-823-  }
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-824-}
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-956-      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-957-      // barre ailleurs (Firefox/Safari). (Le caret texte natif n'est pas piloté par
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:958:      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-959-      caret-color: var(--prompt);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-960-      caret-shape: block;
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-977-  border: 1px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-978-  border-radius: var(--radius-md);
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:979:  transition:
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-980-    background var(--dur-fast) var(--ease-standard),
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-981-    border-color var(--dur-fast) var(--ease-standard),
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-985-  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-986-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:987:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-988-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:989:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-990-    outline-offset: 2px;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-991-    box-shadow: var(--ring-accent);
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1042-// de mouvement en motion réduit. Le filet global (base/_motion.scss) couvre aussi
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1043-// ce cas ; on garde la garde locale pour que la primitive soit robuste en isolation.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:1044:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1045-  .zbtn {
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:1046:    transition: none;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1047-  }
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1048-}
--
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1053- succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1054- M app/pages/index.vue
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:1055: M docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1056- M docs/implementation-artifacts/sprint-status.yaml
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md-1057-?? docs/implementation-artifacts/code-reviews/10-4/
--- index focus and motion sections ---
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

// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
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
    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
    // relais), mais rendu en couleur système sous forced-colors (Windows High
    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
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

// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
// proportionnel à la police) — pas de token équivalent pour un curseur.
.prm__caret {
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

  > li {
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
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
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    // Outline transparent : rendu en couleur système sous forced-colors.
    outline: 2px solid transparent;
    outline-offset: 2px;
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

  > li {
    display: flex;
  }
}

.projects {
  margin-top: var(--space-5);
}

// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
.project {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-decoration: none;

  .hero__tags {
    margin-top: auto;
  }
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

.project__desc {
  margin: var(--space-3) 0 var(--space-4);
  font-size: var(--fs-sm);
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim,
  .prm__caret {
    animation: none;
  }
}
</style>
--- motion file ---
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
--- git status and baseline relation ---
 M app/pages/index.vue
 M docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/10-4/
M	app/assets/scss/base/_layout.scss
M	app/components/FooterComponent.vue
M	app/components/HexagonLinkComponent.vue
A	app/components/ui/ZExternalLink.vue
A	app/composables/useSiteUrl.ts
M	app/pages/about.vue
M	app/pages/blog/[...slug].vue
M	app/pages/blog/index.vue
M	app/pages/contact.vue
M	app/pages/index.vue
M	app/pages/services.vue
M	app/utils/seo.ts

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
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-03-triage.md; sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-04-report.md" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
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
sed: /Users/simon/.codex/skills/bmad-code-review/steps/step-04-report.md: No such file or directory

exec
/bin/zsh -lc "ls -1 /Users/simon/.codex/skills/bmad-code-review/steps && sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-04-present.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
step-01-gather-context.md
step-02-review.md
step-03-triage.md
step-04-present.md
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
/bin/zsh -lc "printf '%s\\n' '--- index template ---'; sed -n '1,230p' app/pages/index.vue; printf '%s\\n' '--- index baseline focused hunks ---'; git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/pages/index.vue | sed -n '360,640p'; printf '%s\\n' '--- focus rules inventory ---'; rg -n -C1 ':focus-visible|outline:\\s*(none|0|2px)' app --glob '*.vue' --glob '*.scss'; printf '%s\\n' '--- interactive declarations in index ---'; rg -n '<(a|button|input|select|textarea)|tabindex|role=\"button\"|@click' app/pages/index.vue app/components/terminal/TerminalComponent.vue app/components/HeaderComponent.vue app/components/FooterComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- index template ---
<template>
  <main class="home">
    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche, CTA, tags -->
          <div class="anim hero__text">
            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
            <p class="hero__sub">{{ tagline }}</p>
            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Démarrer un projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
            </div>
            <ul class="hero__tags">
              <li v-for="tag in tags" :key="tag">
                <ZTag>{{ tag }}</ZTag>
              </li>
            </ul>
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
                  aria-haspopup="dialog"
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
          <li v-for="project in projects" :key="project.url">
            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
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
// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
import { NuxtLink, ZExternalLink } from "#components";
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
const terminalRows = [
  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
];

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
// restylisation du terminal lui-même relève d'Epic 8.
const { open: openTerminal } = useTerminal();
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

--- index baseline focused hunks ---
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

// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
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
    outline: none;
    box-shadow: var(--ring-accent);
  }
}

// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
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

// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
// proportionnel à la police) — pas de token équivalent pour un curseur.
.prm__caret {
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

.project__desc {
  margin: var(--space-3) 0 var(--space-4);
  font-size: var(--fs-sm);
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim,
  .prm__caret {
    animation: none;
  }
}

// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
// neutralisées → on restaure un outline système visible sur les éléments focusables
// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
@media (forced-colors: active) {
  .hero-term__open:focus-visible,
  .offer__more:focus-visible {
    outline: 2px solid;
    outline-offset: 2px;
  }
}
</style>
--- focus rules inventory ---
app/pages/about.vue-232-  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
app/pages/about.vue:233:  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
app/pages/about.vue-234-  a {
--
app/pages/about.vue-244-    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
app/pages/about.vue:245:    &:focus-visible {
app/pages/about.vue:246:      outline: 2px solid transparent;
app/pages/about.vue-247-      outline-offset: 2px;
--
app/pages/blog/[...slug].vue-179-
app/pages/blog/[...slug].vue:180:  &:focus-visible {
app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue-182-    outline-offset: 2px;
--
app/pages/blog/[...slug].vue-267-
app/pages/blog/[...slug].vue:268:    &:focus-visible {
app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue-270-      outline-offset: 2px;
--
app/pages/contact.vue-342-.contact__sent:focus {
app/pages/contact.vue:343:  outline: none;
app/pages/contact.vue-344-}
--
app/pages/contact.vue-405-
app/pages/contact.vue:406:  &:focus-visible {
app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/contact.vue-408-    outline-offset: 2px;
--
app/pages/index.vue-387-
app/pages/index.vue:388:  &:focus-visible {
app/pages/index.vue-389-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
--
app/pages/index.vue-391-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
app/pages/index.vue:392:    outline: 2px solid transparent;
app/pages/index.vue-393-    outline-offset: 2px;
--
app/pages/index.vue-505-
app/pages/index.vue:506:  &:focus-visible {
app/pages/index.vue-507-    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/index.vue:508:    outline: 2px solid transparent;
app/pages/index.vue-509-    outline-offset: 2px;
--
app/assets/scss/base/_reset.scss-594-#primary[tabindex="-1"]:focus {
app/assets/scss/base/_reset.scss:595:  outline: 0;
app/assets/scss/base/_reset.scss-596-}
--
app/components/HeaderComponent.vue-233-  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-236-    outline-offset: 2px;
--
app/components/HeaderComponent.vue-266-  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
app/components/HeaderComponent.vue:267:  &:focus-visible {
app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-269-    outline-offset: 2px;
--
app/components/HeaderComponent.vue-303-
app/components/HeaderComponent.vue:304:  &:focus-visible {
app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-306-    outline-offset: 2px;
--
app/components/HeaderComponent.vue-395-
app/components/HeaderComponent.vue:396:  &:focus-visible {
app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue-398-    outline-offset: 2px;
--
app/components/HexagonLinkComponent.vue-38-
app/components/HexagonLinkComponent.vue:39:  &:focus-visible {
app/components/HexagonLinkComponent.vue:40:    outline: 2px solid var(--accent);
app/components/HexagonLinkComponent.vue-41-    outline-offset: 2px;
--
app/components/FooterComponent.vue-109-  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
app/components/FooterComponent.vue:110:  &:focus-visible {
app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-112-    outline-offset: 2px;
--
app/components/FooterComponent.vue-152-  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
app/components/FooterComponent.vue:153:  &:focus-visible {
app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue-155-    outline-offset: 2px;
--
app/components/terminal/TerminalComponent.vue-377-      // Focus clavier visible (close désormais focusable — a11y CAP-11).
app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
app/components/terminal/TerminalComponent.vue:379:        outline: 2px solid var(--accent);
app/components/terminal/TerminalComponent.vue-380-        outline-offset: 2px;
--
app/components/terminal/TerminalComponent.vue-460-      border: none;
app/components/terminal/TerminalComponent.vue:461:      outline: none;
app/components/terminal/TerminalComponent.vue-462-
--
app/components/ui/ZButton.vue-133-
app/components/ui/ZButton.vue:134:  &:focus-visible {
app/components/ui/ZButton.vue-135-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
--
app/components/ui/ZButton.vue-137-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
app/components/ui/ZButton.vue:138:    outline: 2px solid transparent;
app/components/ui/ZButton.vue-139-    outline-offset: 2px;
--
app/components/ui/ZInput.vue-176-    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
app/components/ui/ZInput.vue:177:    outline: 2px solid transparent;
app/components/ui/ZInput.vue-178-    outline-offset: 2px;
--
app/components/ui/ZCard.vue-96-  // aucun indicateur. Sans effet sur les cartes non focusables (div).
app/components/ui/ZCard.vue:97:  &:focus-visible {
app/components/ui/ZCard.vue-98-    // Outline transparent → rendu en couleur système sous forced-colors (où les
app/components/ui/ZCard.vue-99-    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
app/components/ui/ZCard.vue:100:    outline: 2px solid transparent;
app/components/ui/ZCard.vue-101-    outline-offset: 2px;
--
app/components/ui/ZTag.vue-146-
app/components/ui/ZTag.vue:147:  &:focus-visible {
app/components/ui/ZTag.vue-148-    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:149:    outline: 2px solid transparent;
app/components/ui/ZTag.vue-150-    outline-offset: 2px;
--
app/components/ui/ZTag.vue-175-
app/components/ui/ZTag.vue:176:  &:focus-visible {
app/components/ui/ZTag.vue-177-    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:178:    outline: 2px solid transparent;
app/components/ui/ZTag.vue-179-    outline-offset: 2px;
--- interactive declarations in index ---
app/components/HeaderComponent.vue:4:      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
app/components/HeaderComponent.vue:33:        <button
app/components/HeaderComponent.vue:40:          @click="toggleMenu"
app/components/HeaderComponent.vue:48:    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
app/components/HeaderComponent.vue:58:        @click="closeMenu"
app/components/HeaderComponent.vue:64:        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:68:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
app/components/terminal/TerminalComponent.vue:15:            role="button"
app/components/terminal/TerminalComponent.vue:16:            tabindex="0"
app/components/terminal/TerminalComponent.vue:18:            @click="closeTerminal"
app/components/terminal/TerminalComponent.vue:46:        >&nbsp;<input
app/components/terminal/TerminalComponent.vue:363:    // Pastille de fermeture (.ds-term__dot--close). Conserve @click="closeTerminal".
app/components/terminal/TerminalComponent.vue:463:      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
app/pages/index.vue:49:                <button
app/pages/index.vue:54:                  @click="openTerminal"
app/pages/index.vue:560:// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.

exec
/bin/zsh -lc "printf '%s\\n' '--- HexagonLink ---'; sed -n '1,90p' app/components/HexagonLinkComponent.vue; printf '%s\\n' '--- Terminal relevant markup/styles ---'; sed -n '1,90p' app/components/terminal/TerminalComponent.vue; sed -n '340,485p' app/components/terminal/TerminalComponent.vue; printf '%s\\n' '--- ZCard implementation ---'; sed -n '1,150p' app/components/ui/ZCard.vue; printf '%s\\n' '--- ZButton implementation ---'; sed -n '100,165p' app/components/ui/ZButton.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- HexagonLink ---
<template>
  <ZExternalLink class="hex" :href="link" rel="noopener noreferrer">
    <slot name="icon" />
    <span class="hex__label"><slot name="title" /></span>
  </ZExternalLink>
</template>

<script setup lang="ts">
// Lien social en hexagone — motif patrimonial du footer/contact, restylé DS (story 2.8).
// Hexagone via clip-path (cf. kit.css .hex) ; glyphe en currentColor (ZIcon, story 2.7).
defineProps<{
  /** URL externe (réseau social). */
  link: string;
}>();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) */
.hex {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 53px;
  font-size: 20px; // dimensionne le glyphe ZIcon (1em)
  color: var(--text-muted);
  cursor: pointer;
  background: var(--surface-2);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  transition:
    color var(--dur-base) var(--ease-standard),
    background var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--ink-on-accent);
    background: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

// Libellé accessible (lecteurs d'écran) — masqué visuellement.
.hex__label {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  .hex {
    transition: none;
  }
}
</style>
--- Terminal relevant markup/styles ---
<template>
  <!--
    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
    `backdrop-filter: blur(10px)`. Un ancêtre filtré devient "backdrop root" et
    neutralise le `backdrop-filter` du corps (le blur DS ne s'applique alors qu'au
    contenu du header, pas à la page). Hors du header, le flou aubergine rend bien.
    Déplacement de rendu uniquement — drag/resize/focus/historique inchangés.
  -->
  <Teleport to="body">
    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
        <div class="terminal-dots">
          <div
            class="close-button"
            role="button"
            tabindex="0"
            aria-label="Fermer le terminal"
            @click="closeTerminal"
            @keydown.enter="closeTerminal"
            @keydown.space.prevent="closeTerminal"
          ></div>
          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
        </div>
        <div class="header-text">{{ defaultConfig.domainName }}</div>
      </div>

      <div class="terminal-body">
        <div v-for="(line, index) in commandLines" :key="index">
          <template v-if="line.isResponse">
            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
            <span class="terminal-response" v-html="line.text"></span>
          </template>
          <template v-else>
            <span class="git-prompt"
              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
              <span class="git-prompt-directory">~</span>
              <span class="git-prompt-separator">$</span></span
            >&nbsp;{{ line.text }}
          </template>
        </div>
        <span class="git-prompt"
          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
          <span class="git-prompt-directory">~</span>
          <span class="git-prompt-separator">$</span></span
        >&nbsp;<input
          ref="userInputRef"
          v-model="userInput"
          type="text"
          class="user-input"
          aria-label="Saisie de commande du terminal"
          @keydown.enter="submitInput"
          @keydown.arrow-up="handleHistoryNavigation"
          @keydown.arrow-down="handleHistoryNavigation"
        />
      </div>

      <div class="resize-handle" @mousedown="handleResizeMouseDown"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import programManager from "~/components/terminal/programs/ProgramManager";
import { escapeHtml } from "~/utils/functions";
// Import statique : les valeurs par défaut sont disponibles dès l'exécution du setup,
// sans course asynchrone qui laissait parfois la config vide à l'initialisation.
import { terminalDefaults } from "~/terminal.config";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant
// (props/refs/cycle de vie/handlers identiques). `defineOptions` préserve le nom du composant.
defineOptions({ name: "TerminalComponent" });

const props = withDefaults(
  defineProps<{
    id?: number;
    createNewTerminal?: (config?: ITerminalConfig) => void;
    terminalConfig?: ITerminalConfig;
  }>(),
  {
    id: 0,
    createNewTerminal: () => {},
    terminalConfig: () => ({}),
  },
);

const commandLines = ref<{ text: string; isResponse: boolean }[]>([]);
const userInput = ref<string>("");
  border: 1px solid var(--border-terminal);
  border-radius: var(--radius-sm);
  box-shadow: var(--glow-terminal);

  &-header {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--space-2);
    height: 30px;
    padding: 0 var(--space-3);
    background: var(--aubergine-black);
    cursor: move;

    // Groupe de pastilles à gauche (façon fenêtre Ubuntu) — porté de .ds-term__btns.
    .terminal-dots {
      display: flex;
      align-items: center;
      gap: 7px; // espacement décoratif des pastilles (DS, pas de token)
    }

    // Pastille de fermeture (.ds-term__dot--close). Conserve @click="closeTerminal".
    // Rouge sombre (hsl(0 100% 27%)) + ombre : sans token dédié, valeurs portées du DS.
    .close-button {
      width: 13px;
      height: 13px;
      cursor: pointer;
      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
      border-radius: var(--radius-circle);
      box-shadow: 1px 1px 2px hsl(320deg 60% 2%);

      &:hover {
        filter: brightness(1.2);
      }

      // Focus clavier visible (close désormais focusable — a11y CAP-11).
      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
    }

    // Pastilles min/max purement décoratives (aucun handler).
    .terminal-dot {
      width: 13px;
      height: 13px;
      border-radius: var(--radius-circle);
      opacity: 0.85;
    }

    .terminal-dot--min {
      background: var(--term-yellow);
    }

    .terminal-dot--max {
      background: var(--term-green);
    }

    // Titre centré, transparent aux clics → toute la barre reste draggable.
    .header-text {
      position: absolute;
      inset: 0;
      font-family: var(--font-mono);
      font-size: var(--fs-xs);
      letter-spacing: var(--ls-wide);
      line-height: 30px; // centre verticalement dans la barre de 30px
      color: var(--text-muted);
      text-align: center;
      pointer-events: none;
    }
  }

  &-body {
    height: calc(100% - 30px);
    margin: 0;
    padding: var(--space-4);
    overflow: auto;
    font-size: var(--fs-sm);
    line-height: var(--lh-snug);
    white-space: pre-wrap;
    overflow-wrap: break-word;
    background: var(--bg-terminal);

    .git-prompt,
    .git-prompt-separator,
    .git-prompt-directory {
      display: inline;
    }

    // `user@host` (vert) et le répertoire `~` (bleu) en gras comme Prompt.jsx ;
    // les séparateurs `:` et `$` restent en graisse normale (.ds-prompt__sep).
    .git-prompt,
    .git-prompt-directory {
      font-weight: var(--fw-bold);
    }

    .git-prompt {
      color: var(--prompt);
    }

    // `:` et `$` : graisse normale explicite (sinon ils héritent du gras du parent
    // `.git-prompt`) — fidèle à `.ds-prompt__sep` du DS.
    .git-prompt-separator {
      color: var(--ink-1);
      font-weight: var(--fw-regular);
    }

    .git-prompt-directory {
      color: var(--term-blue);
    }

    .user-input {
      margin: 0;
      padding: 0;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      background-color: transparent;
      border: none;
      outline: none;

      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
      // éditable (il suit la frappe). AUCUNE animation CSS en boucle n'est ajoutée →
      // contrainte « caret = seule boucle » (CAP-11) respectée par construction. `caret-shape:
      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
      // barre ailleurs (Firefox/Safari). (Le caret texte natif n'est pas piloté par
      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
      caret-color: var(--prompt);
      caret-shape: block;
    }

    // Sorties de commandes injectées via v-html : HTML pretty-printé (\n + indentation) qui,
    // sous le `white-space: pre-wrap` du corps, afficherait lignes vides et décalages. On
    // rétablit `normal` pour ces conteneurs (le DS garde `pre-wrap` pour l'ASCII ; la bannière
    // initiale, en `<br>` + espaces insécables, rend correctement en `normal`).
    .terminal-response {
      white-space: normal;
    }

    // Scrollbar fine aubergine — porté de .ds-term__body (chrome de fenêtre DS).
    // Largeur 10px structurelle (comme la barre 30px / pastilles 13px) ; teinte sur
    // --aubergine (≈ hsl(319 30% 30%) de la réf), pouce arrondi --radius-pill.
    /* stylelint-disable-next-line selector-pseudo-element-no-unknown -- pseudo-élément vendeur WebKit (scrollbar), non câblé par autoprefixer */
    &::-webkit-scrollbar {
--- ZCard implementation ---
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
--- ZButton implementation ---
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

2026-09-13T08:20:20.680418Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba app/components/terminal/TerminalComponent.vue | sed -n '1,65p;370,470p'; nl -ba app/components/HexagonLinkComponent.vue | sed -n '30,48p'; nl -ba app/pages/index.vue | sed -n '380,400p;498,515p;608,625p'; printf '%s\\n' '--- all outline:none around focusable selectors ---'; rg -n -B8 -A8 'outline:\\s*none' app --glob '*.vue' --glob '*.scss' | sed -n '1,260p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <!--
     3	    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
     4	    `backdrop-filter: blur(10px)`. Un ancêtre filtré devient "backdrop root" et
     5	    neutralise le `backdrop-filter` du corps (le blur DS ne s'applique alors qu'au
     6	    contenu du header, pas à la page). Hors du header, le flou aubergine rend bien.
     7	    Déplacement de rendu uniquement — drag/resize/focus/historique inchangés.
     8	  -->
     9	  <Teleport to="body">
    10	    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
    11	      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
    12	        <div class="terminal-dots">
    13	          <div
    14	            class="close-button"
    15	            role="button"
    16	            tabindex="0"
    17	            aria-label="Fermer le terminal"
    18	            @click="closeTerminal"
    19	            @keydown.enter="closeTerminal"
    20	            @keydown.space.prevent="closeTerminal"
    21	          ></div>
    22	          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
    23	          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
    24	        </div>
    25	        <div class="header-text">{{ defaultConfig.domainName }}</div>
    26	      </div>
    27	
    28	      <div class="terminal-body">
    29	        <div v-for="(line, index) in commandLines" :key="index">
    30	          <template v-if="line.isResponse">
    31	            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
    32	            <span class="terminal-response" v-html="line.text"></span>
    33	          </template>
    34	          <template v-else>
    35	            <span class="git-prompt"
    36	              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
    37	              <span class="git-prompt-directory">~</span>
    38	              <span class="git-prompt-separator">$</span></span
    39	            >&nbsp;{{ line.text }}
    40	          </template>
    41	        </div>
    42	        <span class="git-prompt"
    43	          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
    44	          <span class="git-prompt-directory">~</span>
    45	          <span class="git-prompt-separator">$</span></span
    46	        >&nbsp;<input
    47	          ref="userInputRef"
    48	          v-model="userInput"
    49	          type="text"
    50	          class="user-input"
    51	          aria-label="Saisie de commande du terminal"
    52	          @keydown.enter="submitInput"
    53	          @keydown.arrow-up="handleHistoryNavigation"
    54	          @keydown.arrow-down="handleHistoryNavigation"
    55	        />
    56	      </div>
    57	
    58	      <div class="resize-handle" @mousedown="handleResizeMouseDown"></div>
    59	    </div>
    60	  </Teleport>
    61	</template>
    62	
    63	<script setup lang="ts">
    64	import { onMounted, onUnmounted, ref, watch } from "vue";
    65	import type { ITerminalConfig } from "~/components/terminal/interfaces";
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
    30	  transition:
    31	    color var(--dur-base) var(--ease-standard),
    32	    background var(--dur-base) var(--ease-standard);
    33	
    34	  &:hover {
    35	    color: var(--ink-on-accent);
    36	    background: var(--accent);
    37	  }
    38	
    39	  &:focus-visible {
    40	    outline: 2px solid var(--accent);
    41	    outline-offset: 2px;
    42	  }
    43	}
    44	
    45	// Libellé accessible (lecteurs d'écran) — masqué visuellement.
    46	.hex__label {
    47	  position: absolute;
    48	  width: 1px;
   380	  padding: 0;
   381	  font: inherit;
   382	  text-align: left;
   383	  cursor: pointer;
   384	  background: none;
   385	  border: none;
   386	  border-radius: var(--radius-xs);
   387	
   388	  &:focus-visible {
   389	    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
   390	    // relais), mais rendu en couleur système sous forced-colors (Windows High
   391	    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
   392	    outline: 2px solid transparent;
   393	    outline-offset: 2px;
   394	    box-shadow: var(--ring-accent);
   395	  }
   396	}
   397	
   398	// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
   399	.prm {
   400	  font-family: var(--font-mono);
   498	  font-size: var(--fs-sm);
   499	  color: var(--accent);
   500	  text-decoration: none;
   501	
   502	  &:hover {
   503	    text-decoration: underline;
   504	  }
   505	
   506	  &:focus-visible {
   507	    // Outline transparent : rendu en couleur système sous forced-colors.
   508	    outline: 2px solid transparent;
   509	    outline-offset: 2px;
   510	    box-shadow: var(--ring-accent);
   511	    border-radius: var(--radius-xs);
   512	  }
   513	}
   514	
   515	// ---- Stats (porté de .statrow / .stat) ----
   608	
   609	  .grid-3,
   610	  .grid-2 {
   611	    grid-template-columns: 1fr;
   612	  }
   613	}
   614	
   615	@media (prefers-reduced-motion: reduce) {
   616	  .anim,
   617	  .prm__caret {
   618	    animation: none;
   619	  }
   620	}
   621	</style>
--- all outline:none around focusable selectors ---
app/pages/about.vue-225-  }
app/pages/about.vue-226-
app/pages/about.vue-227-  // Emphases sur les technologies (porté des <strong> d'About.jsx).
app/pages/about.vue-228-  strong {
app/pages/about.vue-229-    color: var(--text-strong);
app/pages/about.vue-230-  }
app/pages/about.vue-231-
app/pages/about.vue-232-  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
app/pages/about.vue:233:  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
app/pages/about.vue-234-  a {
app/pages/about.vue-235-    color: var(--link);
app/pages/about.vue-236-    text-decoration: none;
app/pages/about.vue-237-
app/pages/about.vue-238-    &:hover {
app/pages/about.vue-239-      text-decoration: underline;
app/pages/about.vue-240-    }
app/pages/about.vue-241-
--
app/pages/contact.vue-335-
app/pages/contact.vue-336-  // Contraste (story 9.2) : notice légale = info réelle → --text-muted (≥ 4.5:1),
app/pages/contact.vue-337-  // plus lisible que --text-faint. Reste discrète. Token, pas de couleur en dur.
app/pages/contact.vue-338-  color: var(--text-muted);
app/pages/contact.vue-339-}
app/pages/contact.vue-340-
app/pages/contact.vue-341-// Carte « envoyé » focalisée par programme (tabindex -1) : pas de contour UA résiduel.
app/pages/contact.vue-342-.contact__sent:focus {
app/pages/contact.vue:343:  outline: none;
app/pages/contact.vue-344-}
app/pages/contact.vue-345-
app/pages/contact.vue-346-// ---- État envoyé (porté de Contact.jsx : Card accent + ligne mono verte) ----
app/pages/contact.vue-347-.contact__sent-line {
app/pages/contact.vue-348-  margin-bottom: var(--space-2);
app/pages/contact.vue-349-  font-family: var(--font-mono);
app/pages/contact.vue-350-  font-size: var(--fs-md);
app/pages/contact.vue-351-  color: var(--term-green);
--
app/components/terminal/TerminalComponent.vue-453-    .user-input {
app/components/terminal/TerminalComponent.vue-454-      margin: 0;
app/components/terminal/TerminalComponent.vue-455-      padding: 0;
app/components/terminal/TerminalComponent.vue-456-      font-family: inherit;
app/components/terminal/TerminalComponent.vue-457-      font-size: inherit;
app/components/terminal/TerminalComponent.vue-458-      color: inherit;
app/components/terminal/TerminalComponent.vue-459-      background-color: transparent;
app/components/terminal/TerminalComponent.vue-460-      border: none;
app/components/terminal/TerminalComponent.vue:461:      outline: none;
app/components/terminal/TerminalComponent.vue-462-
app/components/terminal/TerminalComponent.vue-463-      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
app/components/terminal/TerminalComponent.vue-464-      // éditable (il suit la frappe). AUCUNE animation CSS en boucle n'est ajoutée →
app/components/terminal/TerminalComponent.vue-465-      // contrainte « caret = seule boucle » (CAP-11) respectée par construction. `caret-shape:
app/components/terminal/TerminalComponent.vue-466-      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
app/components/terminal/TerminalComponent.vue-467-      // barre ailleurs (Firefox/Safari). (Le caret texte natif n'est pas piloté par
app/components/terminal/TerminalComponent.vue-468-      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
app/components/terminal/TerminalComponent.vue-469-      caret-color: var(--prompt);

2026-09-13T08:20:33.396223Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/components/terminal/TerminalComponent.vue | nl -ba | sed -n '430,480p'; git show 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2:app/components/HexagonLinkComponent.vue | nl -ba | sed -n '30,48p'; git log --oneline --all -- app/components/terminal/TerminalComponent.vue | sed -n '1,12p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
    30	  transition:
    31	    color var(--dur-base) var(--ease-standard),
    32	    background var(--dur-base) var(--ease-standard);
    33	
    34	  &:hover {
    35	    color: var(--ink-on-accent);
    36	    background: var(--accent);
    37	  }
    38	
    39	  &:focus-visible {
    40	    outline: 2px solid var(--accent);
    41	    outline-offset: 2px;
    42	  }
    43	}
    44	
    45	// Libellé accessible (lecteurs d'écran) — masqué visuellement.
    46	.hex__label {
    47	  position: absolute;
    48	  width: 1px;
3e82045 feat(a11y): story 9.2 — motion réduit, contraste et clavier
b461368 refactor(terminal): migration <script setup> + patch revue 8.3
8aa7f23 fix(terminal): traiter les patchs de revue 8.2 (doc, nommage, DRY local)
50e1b0a feat(terminal): commandes skills/projets/contact/clear + non-régression (story 8.2)
022398c fix(ds): traiter la revue de code du terminal — 8 points, zéro dette (story 8.1)
84ce971 fix(ds): rendre le backdrop-filter du terminal effectif via Teleport (story 8.1)
1bf7f48 feat(ds): finir le restyle terminal — scrollbar + format prompt (story 8.1)
e2cc556 feat(ds): restyler le terminal au DS — fenêtre + prompt (story 8.1)
f0b2c01 fix: corriger les findings de revue de la story 1.1 (Docker, terminal, statut)
f502e71 fix: corriger les findings de revue de la story 1.3 (lint ESLint 9)
f69292f fix: corriger les findings de revue de la story 1.1 (Nuxt 4)
0f2bc9e refactor: adopt Nuxt 4 app/ directory structure

2026-09-13T08:20:38.731980Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "find docs/implementation-artifacts/code-reviews/10-4 -maxdepth 1 -type f -print | sort; if test -f docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md; then sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md; fi; if test -f docs/implementation-artifacts/code-reviews/10-4/acceptance-auditor.md; then sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/acceptance-auditor.md; fi" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/full.diff
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-4/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-4/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json
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
session id: 01a099d9-2215-7502-966d-76f64e1f5f10
--------
user
# Acceptance Auditor Prompt — Story 10.4

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md`
- Context specs: `docs/planning-artifacts/epics.md` (Story 10.4), `docs/project-context.md`
- Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
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
/bin/zsh -lc "printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md; printf '%s\\n' '--- epics story ---'; rg -n -A80 -B10 '10\\.4|validation|a11y|emulee|forced colors' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,260p' docs/project-context.md; printf '%s\\n' '--- diff stat ---'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/10-4/full.diff || true; printf '%s\\n' '--- diff ---'; sed -n '1,320p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- spec ---
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.4: Validation a11y émulée OS-level et unification forced-colors


2026-09-13T08:20:49.419863Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -i 'finding|violation|missing|acceptance|AC|forced|motion|screen|gate|evidence' docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md | tail -80; tail -160 docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
5896:app/pages/contact.vue-348-  margin-bottom: var(--space-2);
5897:app/pages/contact.vue-349-  font-family: var(--font-mono);
5898:app/pages/contact.vue-350-  font-size: var(--fs-md);
5899:app/pages/contact.vue-351-  color: var(--term-green);
5907:app/components/terminal/TerminalComponent.vue-459-      background-color: transparent;
5911:app/components/terminal/TerminalComponent.vue-463-      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
5914:app/components/terminal/TerminalComponent.vue-466-      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
5916:app/components/terminal/TerminalComponent.vue-468-      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
5919:2026-09-13T08:20:33.396223Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
5952:   459	      background-color: transparent;
5956:   463	      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
5959:   466	      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
5961:   468	      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
5967:   474	    // sous le `white-space: pre-wrap` du corps, afficherait lignes vides et décalages. On
5969:   476	    // initiale, en `<br>` + espaces insécables, rend correctement en `normal`).
5971:   478	      white-space: normal;
5976:    32	    background var(--dur-base) var(--ease-standard);
5979:    35	    color: var(--ink-on-accent);
5980:    36	    background: var(--accent);
5984:    40	    outline: 2px solid var(--accent);
5989:    45	// Libellé accessible (lecteurs d'écran) — masqué visuellement.
5993:3e82045 feat(a11y): story 9.2 — motion réduit, contraste et clavier
5994:b461368 refactor(terminal): migration <script setup> + patch revue 8.3
5996:50e1b0a feat(terminal): commandes skills/projets/contact/clear + non-régression (story 8.2)
5998:84ce971 fix(ds): rendre le backdrop-filter du terminal effectif via Teleport (story 8.1)
6001:f0b2c01 fix: corriger les findings de revue de la story 1.1 (Docker, terminal, statut)
6002:f502e71 fix: corriger les findings de revue de la story 1.3 (lint ESLint 9)
6003:f69292f fix: corriger les findings de revue de la story 1.1 (Nuxt 4)
6004:0f2bc9e refactor: adopt Nuxt 4 app/ directory structure
6006:2026-09-13T08:20:38.731980Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
6008:/bin/zsh -lc "find docs/implementation-artifacts/code-reviews/10-4 -maxdepth 1 -type f -print | sort; if test -f docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md; then sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md; fi; if test -f docs/implementation-artifacts/code-reviews/10-4/acceptance-auditor.md; then sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/acceptance-auditor.md; fi" in /Users/simon/dev/jouan.ovh
6010:docs/implementation-artifacts/code-reviews/10-4/full.diff
6011:docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md
6012:docs/implementation-artifacts/code-reviews/10-4/prompt-blind-hunter.md
6013:docs/implementation-artifacts/code-reviews/10-4/prompt-edge-case-hunter.md
6014:docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md
6015:docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md
6016:docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json
6024:sandbox: workspace-write [workdir, /tmp, $TMPDIR]
6030:# Acceptance Auditor Prompt — Story 10.4
6032:You are an Acceptance Auditor. Review the provided diff against:
6033:- Spec file: `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md`
6034:- Context specs: `docs/planning-artifacts/epics.md` (Story 10.4), `docs/project-context.md`
6035:- Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
6038:1. Violations of acceptance criteria (AC)
6040:3. Missing implementation of specified behavior
6041:4. Contradictions between spec constraints and actual code
6043:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
6047:I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
6070:## On Activation
6082:Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.
6086:Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.
6088:### Step 3: Load Persistent Facts
6090:Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.
6096:- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
6099:- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
6109:Execute each entry in `{workflow.activation_steps_append}` in order.
6111:Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.
6117:- **Micro-file Design**: Each step is self-contained and followed exactly
6120:- **State Tracking**: Persist progress via in-memory variables
6121:- **Append-Only Building**: Build artifacts incrementally
6125:1. **READ COMPLETELY**: Read the entire step file before acting
6135:- **ALWAYS** follow the exact instructions in the step file
6147:    "activation_steps_prepend": [],
6148:    "activation_steps_append": [],
6149:    "persistent_facts": [
6170:        "id": "acceptance-auditor",
6171:        "name": "Acceptance Auditor",
6173:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
6209:     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
6217:   **Tier 3 — Sprint tracking.**
6218:   Look for a sprint status file (`*sprint-status*`) in `{implementation_artifacts}` or `{planning_artifacts}`. If found, scan for stories with status `review`:
6219:   - **Exactly one `review` story:** Set `{story_key}` to the story's key (e.g., `1-2-user-auth`). Suggest it: "I found story <story-id> in `review` status. Would you like to review its changes? [Y] Yes / [N] No, let me choose". If confirmed, use the story context to determine the diff source (branch name derived from story slug, or uncommitted changes). If declined, clear `{story_key}` and fall through.
6239:   - For **staged changes only**: run `git diff --cached`.
6244:   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
6253:5. If `{review_mode}` = `"full"` and the file at `{spec_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.
6256:   - If the user opts to chunk: agree on the first group, narrow `{diff_output}` accordingly, and list the remaining groups for the user to note for follow-up runs.
6268:/bin/zsh -lc "printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md; printf '%s\\n' '--- epics story ---'; rg -n -A80 -B10 '10\\.4|validation|a11y|emulee|forced colors' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,260p' docs/project-context.md; printf '%s\\n' '--- diff stat ---'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/10-4/full.diff || true; printf '%s\\n' '--- diff ---'; sed -n '1,320p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
6275:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
6278:2026-09-13T08:20:49.419863Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
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
/bin/zsh -lc "printf '%s\\n' '--- spec ---'; sed -n '1,260p' docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md; printf '%s\\n' '--- epics story ---'; rg -n -A80 -B10 '10\\.4|validation|a11y|emulee|forced colors' docs/planning-artifacts/epics.md; printf '%s\\n' '--- project context ---'; sed -n '1,260p' docs/project-context.md; printf '%s\\n' '--- diff stat ---'; git diff --no-index --stat /dev/null docs/implementation-artifacts/code-reviews/10-4/full.diff || true; printf '%s\\n' '--- diff ---'; sed -n '1,320p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
--- spec ---
---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.4: Validation a11y émulée OS-level et unification forced-colors


2026-09-13T08:20:49.419863Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5

2026-09-13T08:20:54.923524Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n 'Story 10\\.4|FR14|forced-colors' docs/planning-artifacts/epics.md; line="'$(rg -n '"'Story 10\\.4' docs/planning-artifacts/epics.md | head -1 | cut -d: -f1); if test -n \""'$line"; then sed -n "$((line-8)),$((line+34))p" docs/planning-artifacts/epics.md; fi; printf '"'%s\\n' '--- config ---'; sed -n '1,180p' _bmad/bmm/config.yaml" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
38:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
100:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
145:**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17 _(NFR5)_
608:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
612:So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).
616:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
617:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
618:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste

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

**Given** le formulaire `/contact` (Web3Forms, collecte nom/email/message) et sa notice courte sous le formulaire
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

2026-09-13T08:21:01.048882Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
2026-09-13T08:21:17.438392Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "ls docs/implementation-artifacts/*9-1* docs/implementation-artifacts/*9-2* 2>/dev/null; rg -n -A20 -B8 'forced-colors|outline: 2px solid transparent|user-input|Hexagon' docs/implementation-artifacts/9-1* docs/implementation-artifacts/9-2* 2>/dev/null | sed -n '1,320p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-38-  - [x] Parcourir chaque page au clavier seul : `/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`. **Fait** : `/` (sweep complet 9.1 + ici) ; pages partageant les primitives (ZButton/ZCard/ZInput/liens) dont focus + opérabilité clavier déjà vérifiés ; `/contact` vérifié (form).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-39-  - [x] Confirmer que tous les contrôles sont atteignables et actionnables (Tab/Shift+Tab/Enter/Espace ; Échap pour fermer le terminal/les overlays). **Fait** : menu mobile = Échap → ferme + focus rendu au burger (préexistant) ; **terminal = Échap → ferme (ajouté)**.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-40-  - [x] Vérifier l'ordre de tabulation logique, l'absence de piège de focus, et que le focus revient à un endroit sensé à la fermeture du terminal/d'un overlay. **Vérifié au navigateur** : ouverture terminal au clavier (Enter sur bouton header) → input focus ; **Échap → terminal masqué + focus renvoyé au bouton déclencheur** (capté à l'ouverture). Pas de piège de focus (terminal téléporté, non-modal bloquant).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-41-  - [x] Vérifier le formulaire de contact (Epic 7) entièrement utilisable au clavier. **Vérifié** : Nom/Email/Sujet/Message/Envoyer tous atteignables et labellisés ; honeypot exclu du tab (`tabindex -1`) ; carte « envoyé » focalisée par programme (story 7.1).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-42-  - [x] Vérifier l'ouverture/saisie/fermeture du terminal easter-egg (Epic 8) au clavier sans casser les commandes existantes. **Vérifié** : `help` exécuté après l'ajout Échap → sortie correcte (non-régression de la soumission de commande).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-43-- [x] Tâche 4 — Validation finale (AC: #1, #2)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-44-  - [x] `pnpm lint` (eslint + stylelint) vert ; aucune valeur hardcodée réintroduite. **PASS** (les corrections contraste sont des tokens ; le filet motion documente sa dérogation `!important` a11y).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-45-  - [x] `pnpm generate` vert (compatibilité prerender préservée). **PASS** (11 routes ; `import.meta.client` gardant l'accès `document.activeElement`).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-47-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-48-## Review Findings
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-49-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-50-Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : aucun défaut bloquant.** Filet reduced-motion + exception caret fidèles (CAP-11), terminal opérable au clavier (Échap + retour focus), contraste token-only (faint→muted vérifié par calcul : ~4.9–5.6:1). Gate `lint + typecheck + generate` **re-vérifié vert** (11 routes). Périmètre respecté (rien de l'apparence 9.1 re-spécifié).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-51-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-52-- [x] [Review][Patch] Nommer la dérogation des durées hardcodées dans `_motion.scss` [app/assets/scss/base/_motion.scss] — le `stylelint-disable` ne couvre que `!important`/`selector-class-pattern` ; la règle SCSS projet (« commenter explicitement la dérogation » pour toute valeur en dur) n'est que partiellement honorée pour `0.01ms`/`0ms` (recette a11y standard, aucun token de durée nulle ne convient). Ajouter une ligne le nommant. Trivial, sans risque. **✅ Appliqué (2026-06-29)** : bloc « DÉROGATION valeurs en dur » ajouté dans l'en-tête de `_motion.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-53-- [x] [Review][Defer] Placeholder `ZInput` à ~3.7:1 sur `--bg-input` (< 4.5:1 AA) — résidu **justifié et conscient** : `--text-muted` est meilleur que `--text-faint` (~2.2:1) et le champ porte un `<label>` visible persistant (placeholder = texte supplémentaire, zone grise WCAG) ; monter à `--text-body` ferait passer le placeholder pour une saisie. Accepté tel quel, tracé. → `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-55-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-56-> **Pistes écartées après recoupement (dismiss)** : (1) « opener périmé : `onMounted` ne capture qu'une fois » (Blind Hunter, Medium-High) — **faux positif** : chaque ouverture monte une nouvelle instance (`TerminalManagerComponent:28`), `close` = `display:none` sans réutilisation → capture fraîche par instance. (2) « le reset nucléaire cache une animation d'entrée `base opacity:0` sans `fill-mode:forwards` » (Medium) — infirmé : toutes les animations chargées finissent visibles (`fade-rise`→opacity:1) ; celles finissant cachées (`blink`/`fadeIn`) sont du dead code non monté. (3) garde locale `.zbtn { transition:none }` « morte » — non : `transition-property:none` (non-`!important`) reste actif → robuste en isolation. (4) `document.activeElement` = `<body>`, opener détaché, Échap sans `preventDefault` — no-op sûrs (confirmés Edge Case Hunter).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-57-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-58-## Dev Notes
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-59-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-60-### Nature de la story (finition transverse)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-61-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-62-- Story de **finition** de l'Epic 9 : elle **audite et durcit** l'accessibilité de tout ce qui précède — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7), terminal (Epic 8). Cette dépendance vers l'antérieur est normale ; **aucune dépendance vers des stories futures**.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-63-- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-64-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-65-### Motion réduit (référence exacte)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-66-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-67-- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-68-- Keyframes disponibles : `caret-blink` (réservé au caret) et `fade-rise` (entrées). Durées via `--dur-fast`/`--dur-base`/`--dur-slow`/`--dur-slower` ; easings via `--ease-out`/`--ease-in-out`/`--ease-standard`. [Source: docs/design_system/tokens/motion.css]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-69-- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-70-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-71-### Contraste (référence exacte)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-72-
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-73-- Dark-first : surfaces quasi-noires teintées aubergine ; le gradient héritage doit rester « assez sombre pour garder le texte blanc lisible ». [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Backgrounds]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-74-- Échelle de texte (du plus fort au plus faible) : `--text-strong` (titres haut contraste), `--text-body` (corps), `--text-muted` (légendes), `--text-faint` (atténué/désactivé) ; `--accent-text` = texte sombre sur orange. [Source: docs/design_system/tokens/colors.css]
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-32-  - [x] Surfaces (cartes, panneaux) : éclaircissement d'un cran (`--surface-2` → `--surface-3` via `--bg-elevated`) et/ou passage de la bordure à `var(--border-strong)`. **Conforme** (`ZCard--interactive` : `--border-strong` + lift ; `ZButton--secondary` : `--surface-2` → `--surface-3`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-33-  - [x] Boutons primaires : l'orange s'éclaircit (`var(--accent)` → `var(--accent-hover)`). **Conforme** (`ZButton--primary:hover`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-34-  - [x] Liens : soulignement / bleu plus clair (`var(--link)`). **Conforme** (liens nav/footer → `--text-strong`/`--accent` ; liens prose/email → soulignement + `--term-blue`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-35-  - [x] Confirmer que toute transition hover passe par les tokens motion (`--dur-fast`/`--dur-base`, `--ease-out`) — pas de durée/easing en dur. **Vérifié** : toutes les transitions live consomment les tokens motion ; seul résidu de durée en dur = `_button.scss` (legacy **non importé** par `main.scss`, dead code) + `WindowWrapperComponent`/`CurrentTime` (résidu Options API header, hors périmètre) + delays d'entrée intentionnels (motion = 9.2).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-36-- [x] Tâche 3 — Vérifier et harmoniser l'état press/active (AC: #1)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-37-  - [x] Boutons : couleur active (`var(--accent-active)`) + léger nudge de ~1px vers le bas ; **pas** de scale-shrink, pas de rebond. **Conforme** (`ZButton--primary:active` : `--accent-active` + `translateY(1px)` ; secondary/danger : `translateY(1px)`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-38-  - [x] Éléments cliquables non-bouton : feedback press cohérent et discret. **Conforme** : liens = feedback hover (couleur/soulignement) ; cartes-liens = lift hover ; pas de press inventé (le DS ne spécifie pas de nudge sur les liens texte).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-39-- [x] Tâche 4 — Vérifier et garantir l'état focus clavier visible (AC: #2)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-41-  - [x] Le focus reste visible sur fonds sombres et sur les surfaces atmosphériques (gradient héritage, fond AI-art sous overlay) — contraste suffisant de l'anneau. **Vérifié** au navigateur (ring orange visible sur header vitré + hero dégradé).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-42-  - [x] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6). **Conforme (focus plus fort que demandé)** : `ZInput:focus` pose `border-color: --accent` **+** ring `--accent-ring` (pattern DS README, plus prominent que `--border-strong`) ; `:hover` renforce déjà à `--border-strong`. Non régressé (n'aurait fait qu'affaiblir le focus).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-43-  - [x] L'ordre de tabulation suit l'ordre visuel/logique sur chaque page. **Vérifié** (sweep clavier `/` : logo → nav (5) → Terminal → CTA → contenu).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-44-- [x] Tâche 5 — Vérification manuelle transverse (AC: #1, #2)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-47-  - [x] `pnpm lint` (eslint + stylelint) + `pnpm typecheck` + `pnpm generate` verts (aucune valeur hardcodée réintroduite). **PASS** (Docker, 11 routes prerendered). _(Le ticket mentionnait `yarn` ; le projet est pnpm via Docker.)_
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-48-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-49-## Review Findings
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-50-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-52-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-54-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-55-> **Pistes écartées après recoupement (dismiss)** : (1) « rayon des anneaux incohérent (nav/menu carrés vs brand/footer arrondis) » (Blind Hunter) — **faux positif** : `.hdr__link`/`.hdr__menu-link` portent déjà `border-radius` dans leur règle de base (`HeaderComponent.vue:256/389`), seuls brand/footer (base sans rayon) l'ajoutent → tous les anneaux arrondis. (2) « clipping de l'anneau par un ancêtre `overflow:hidden` » — infirmé : aucun `overflow:hidden` sur les ancêtres du header/nav/footer. (3) « tokens inexistants (`--ring-accent`/`--radius-sm`/`--radius-xs`) » — infirmé : tous définis (`_root.scss`), `--ring-accent` = la valeur box-shadow correcte (le `--accent-ring` couleur n'est pas utilisé en box-shadow). (4) « littéraux `2px` hardcodés » — dérogation a11y légitime (largeur/offset d'outline, pas de token DS dédié), pattern déjà établi (`contact.vue`/`about.vue`/`index.vue`). (5) « `.hdr__brand`/`.ftr__brand` pas focusables » — infirmé : vrais `<a>`/NuxtLink.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-56-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-58-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-59-## Dev Notes
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-60-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-61-### Nature de la story (finition transverse)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-62-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-63-- C'est une story de **finition** de l'Epic 9 : elle ne crée pas de nouvelle UI, elle **audite et harmonise** ce qui a été produit en amont — primitives (Epic 2), châssis global (Epic 2 — story 2.8), pages (Epics 3–7) et terminal (Epic 8). Cette dépendance vers tout l'antérieur est normale ; il n'y a **aucune dépendance vers des stories futures**.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-64-- Périmètre : **états interactifs uniquement** (focus / hover / press + visibilité du focus clavier). Le motion réduit, le contraste et la navigabilité clavier complète sont l'objet de la **story 9.2** ; ne pas les traiter ici sauf chevauchement direct (la visibilité du focus est partagée et prioritaire ici). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-65-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-66-### États conformes au DS (référence exacte)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-67-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-68-- **Hover** : éclaircir la surface d'un cran (`--surface-2` → `--surface-3`) et/ou passer la bordure à `--border-strong` ; les boutons primaires éclaircissent l'orange (`--accent` → `--accent-hover`) ; les liens gagnent un soulignement / un bleu plus clair. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-69-- **Press** : se poser sur la couleur active (`--accent-active`) avec un nudge de ~1px vers le bas ; **pas de scale-shrink**. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-70-- **Focus** : anneau visible via `--accent-ring` (`hsl(24 94% 53% / 0.45)`) ; `--border-strong` au focus pour bordures/inputs. [Source: docs/design_system/tokens/colors.css — `--accent-ring`, `--border-strong`]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-71-- **Bordures** : hairlines 1px solides — `--border-subtle` pour séparateurs/cartes, `--border-default` pour inputs, `--border-strong` au hover/focus. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Borders]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-72-- **Transitions** : courtes et mécaniques (`--dur-fast` 120ms / `--dur-base` 180ms, `--ease-out`) ; pas de rebond sur l'UI. [Source: docs/design_system/tokens/motion.css]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-73-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-74-### Tokens & valeurs (source unique de vérité)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-75-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-76-- Consommer exclusivement les tokens CSS (`var(--…)`) / SCSS `@use` ; aucune couleur/durée/rayon en dur. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints — Tokens, pas de valeurs en dur ; #CAP-2]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-77-- Tokens d'états disponibles : `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--accent-soft`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--border-subtle`, `--border-default`, `--border-strong`, `--link`. [Source: docs/design_system/tokens/colors.css]
--
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-110-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-111-### Agent Model Used
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-112-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-113-claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story, effort high)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-114-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-115-### Debug Log References
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-116-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-117-- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered) après harmonisation.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:118:- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-119-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-120-### Completion Notes List
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-121-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-122-- **Nature : audit + harmonisation, zéro nouvelle UI.** L'audit a confirmé que **hover** (Tâche 2) et **press** (Tâche 3) étaient déjà cohérents et 100 % token-driven sur les primitives et le châssis — **aucun changement requis** sur ces deux axes. Tout le travail de code porte sur la **visibilité du focus** (Tâche 4, AC #2).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-123-- **Inventaire des éléments interactifs (Tâche 1)** :
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-124-  - _Primitives (Epic 2)_ : `ZButton` (hover/active/focus ✅), `ZInput` (hover/focus ✅), `ZCard--interactive` (hover lift/focus ✅), `ZTag--clickable` + `ztag__remove` (hover/focus ✅), `ZBadge`/`ZAvatar`/`ZIcon` = non interactifs (statut/déco).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-125-  - _Châssis (story 2.8)_ : logo header/footer, liens nav header + menu mobile, burger, liens footer (nav/projets), hexagones sociaux.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:126:  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-127-  - _Terminal (Epic 8)_ : input (caret = focus), close button (focusable, outline orange), poignée drag ; aucun `<a>` dans les sorties.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:128:- **Correctif central — repli `forced-colors` au niveau des primitives DS (deferred-work item #1, revues 3.2/5.1)** : les rings de focus en `box-shadow: var(--ring-accent)` disparaissent en contraste forcé (Windows High Contrast) → focus invisible. Corrigé **une seule fois à la source** (ZButton, ZCard, ZTag ×2, ZInput) en remplaçant `outline: none` par `outline: 2px solid transparent; outline-offset: 2px;` — invisible en rendu normal (le ring prend le relais), rendu en **couleur système** sous forced-colors. Pattern identique à celui déjà posé localement sur les pages (`contact__email`, lien bio `/about`…), désormais factorisé pour tous les consommateurs des primitives.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:129:- **Lacune de focus comblée — liens du châssis** : `hdr__brand`, `hdr__link`, `hdr__menu-link`, `ftr__brand`, `ftr__link` n'avaient **aucun** `:focus-visible` (ils tombaient sur l'outline UA par défaut, non conforme au DS). Ajout de l'anneau DS `--ring-accent` + repli forced-colors. `hdr__burger` (qui avait déjà le ring) reçoit aussi le repli forced-colors.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:130:- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-131-- **Hors périmètre, respecté** : motion réduit / contraste / navigabilité clavier complète = **story 9.2** (non traités ici, sauf visibilité du focus qui est partagée et prioritaire). `_button.scss` (durée `0.15s` en dur) = SCSS legacy **non importé** par `main.scss` (dead code) → non corrigé. `WindowWrapperComponent`/`CurrentTime` (durées en dur) = résidu Options API header, hors « refonte ».
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-132-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-133-### File List
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-134-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:135:- `app/components/ui/ZButton.vue` (MODIFIÉ — repli forced-colors sur `:focus-visible`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:136:- `app/components/ui/ZCard.vue` (MODIFIÉ — repli forced-colors sur `.zcard--interactive:focus-visible`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:137:- `app/components/ui/ZTag.vue` (MODIFIÉ — repli forced-colors sur `.ztag--clickable` + `.ztag__remove`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:138:- `app/components/ui/ZInput.vue` (MODIFIÉ — repli forced-colors sur `.zinput,.ztextarea:focus`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:139:- `app/components/HeaderComponent.vue` (MODIFIÉ — anneau DS sur `hdr__brand`/`hdr__link`/`hdr__menu-link` + repli forced-colors sur `hdr__burger`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:140:- `app/components/FooterComponent.vue` (MODIFIÉ — anneau DS + repli forced-colors sur `ftr__brand`/`ftr__link`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-141-- `docs/implementation-artifacts/9-1-etats-interactifs-coherents.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-142-- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:143:- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — item Epic 9 #1 « repli forced-colors DS-wide » soldé)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-144-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-145-## Change Log
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-146-
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-147-| Date       | Version | Description                                                                                  |
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-148-| ---------- | ------- | -------------------------------------------------------------------------------------------- |
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |

2026-09-13T08:21:24.448782Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n '"'^#{1,4} |''^- '"\\[[A-Z]|"'^[-*] '"\\*\\*|No findings|Clean review|unsupported|not evidenced|screenshot|capture|emulat' docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md | tail -160" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
120:- **ALWAYS** halt at checkpoints and wait for human input
122:## FIRST STEP
173:# Step 1: Gather Context
175:## RULES
181:## INSTRUCTIONS
243:### CHECKPOINT
247:## NEXT
259:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
265:## Story
271:## Acceptance Criteria
278:## Tasks / Subtasks
292:## Dev Notes
294:### Périmètre & frontières
296:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
297:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
298:- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.
300:### Fichiers concernés (lus — baseline `3e82045`)
302:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
303:- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
304:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
305:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
307:### Pièges / régressions à éviter
309:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
310:- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
311:- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
312:- **`outline-offset` cohérent** (2px) lors du rabattage du bloc `index.vue`, pour un focus identique aux autres focusables.
313:- **pnpm + Docker** pour la gate.
315:### Testing standards
319:### References
321:- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.4 (FR14)]
322:- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #4 audit émulé, #5 unification idiomes), revues 9.1, 9.2]
323:- [Source: docs/implementation-artifacts/9-1-etats-interactifs-coherents.md, 9-2-motion-reduit-contraste-et-clavier.md]
324:- [Source: app/pages/index.vue:596 ; app/assets/scss/base/_motion.scss ; primitives ui/ + châssis (repli inline)]
326:## Dev Agent Record
328:### Agent Model Used
332:### Debug Log References
337:### Completion Notes List
339:- **Tâche 1 & 3 (Forced colors & Unification)** :
343:- **Tâche 2 (Reduced motion)** :
346:- **Tâche 4 (Lecteur d'écran & Gate)** :
350:### File List
645:# Project Context for AI Agents
651:## Technology Stack & Versions
657:- **Framework :** Nuxt 4 (`^4.4.8`), SSR activé. `experimental.payloadExtraction: false`. Code applicatif sous `app/` (`srcDir = "app"`).
658:- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
659:- **Langage :** TypeScript `^6.0.3`.
660:- **Styles :** SCSS (`sass ^1.101.0`) via `@use ... as`. **Deux couches de tokens coexistent :** (1) tokens DS portés en **CSS custom properties globales** dans `app/assets/scss/abstract/_root.scss` (chargé via `main.scss`) = source de vérité du nouveau code ; (2) anciens tokens SCSS `$` sous `abstract/` encore consommés par le legacy restant. Cf. règle SCSS.
661:- **Contenu :** `@nuxt/content ^3.14.0` (**v3** — stockage SQLite via `better-sqlite3`, blog). Images : `@nuxt/image ^2.0.0` (`<NuxtImg>` / `<NuxtPicture>`).
662:- **Lint :** ESLint `^10` en **flat config** via `@nuxt/eslint` (`eslint.config.mjs`, `eslint: { config: { stylistic: false } }` → Prettier formate). Prettier `^3` (double quotes, points-virgules). Stylelint `^17` + `stylelint-config-standard-scss` + `stylelint-scss`. Script : `eslint . && stylelint "app/assets/**/*.scss" "app/**/*.vue"`.
663:- **Gestionnaire de paquets :** pnpm (`packageManager: pnpm@11.8.0`, `pnpm-lock.yaml`), Node `>=22` — dev via Docker (cf. Workflow).
664:- **Déploiement :** site statique (`nuxi generate`) → `push-dir` vers la branche `gh-pages` (GitHub Pages, domaine custom via `CNAME`). ⚠️ La chaîne CI de déploiement n'a pas encore été prouvée en réel sur `main` (cf. rétros Epic 1/2) — validation prévue en fin de refonte.
665:- **Divers :** `ua-parser-js ^2` (détection device, terminal).
667:## Critical Implementation Rules
669:### Règles Langage & Framework (TypeScript · Nuxt · Vue · SCSS)
690:- **Primitives DS sous `app/components/ui/` auto-importées SANS préfixe de dossier**
706:- **Formulaire `/contact` (Epic 7)** : envoi via **Web3Forms** (tiers _sans serveur_, site
716:- **Nouveau code (DS) : consommer directement les tokens CSS globaux via `var(--token)`**
720:- **Aucune valeur en dur** (couleur/espace/rayon/durée) dans le nouveau code — tout
723:- **Primitives de layout GLOBALES** : `.section` / `.section--sunken` / `.container` /
736:### Qualité de code & conventions
746:- **Primitives du design system : préfixe `Z`, sous `app/components/ui/`**
767:- **Contenu partagé : source unique `app/data/site.ts`** (`SITE.profile` /
780:### Workflow de développement
813:### Tests
820:### Règles critiques à ne pas manquer
841:- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
850:- **Epic 9 = passe a11y/motion finale (dernier épic du roadmap).** Décision rétro
881:- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
888:- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
892:- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
1030:The change is very narrow: two focus rules in `index.vue`, removal of its page-level `forced-colors` block, and documentation/status updates. I’m checking the surrounding implementation and global patterns now so findings distinguish actual code gaps from merely unsupported completion claims.
1212:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md-57-- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
1971:docs/implementation-artifacts/epic-9-retro-2026-06-29.md-37-5. **Clavier self-contained (9.2).** Terminal : Échap ferme + **retour de focus au déclencheur** (capture de `document.activeElement` en `onMounted` avant focus input), sans plomberie cross-composant, prerender-safe, `help` re-testé.
2385:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:56:> **Pistes écartées après recoupement (dismiss)** : (1) « opener périmé : `onMounted` ne capture qu'une fois » (Blind Hunter, Medium-High) — **faux positif** : chaque ouverture monte une nouvelle instance (`TerminalManagerComponent:28`), `close` = `display:none` sans réutilisation → capture fraîche par instance. (2) « le reset nucléaire cache une animation d'entrée `base opacity:0` sans `fill-mode:forwards` » (Medium) — infirmé : toutes les animations chargées finissent visibles (`fade-rise`→opacity:1) ; celles finissant cachées (`blink`/`fadeIn`) sont du dead code non monté. (3) garde locale `.zbtn { transition:none }` « morte » — non : `transition-property:none` (non-`!important`) reste actif → robuste en isolation. (4) `document.activeElement` = `<body>`, opener détaché, Échap sans `preventDefault` — no-op sûrs (confirmés Edge Case Hunter).
2430:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-132-- **Clavier (Tâche 3)** : le terminal était opérable au clavier (Tab → pastille close → Enter/Espace) mais sans **Échap** ni **retour de focus**. Ajout, **self-contained dans `TerminalComponent`** : `@keydown.esc` sur la racine (capte Échap que le focus soit sur l'input ou la pastille close) → `closeTerminal` ; capture du déclencheur (`document.activeElement` mémorisé en `onMounted` **avant** de focaliser l'input) → focus rendu à la fermeture. Aucune plomberie cross-composant, aucune commande cassée (`help` re-testé). Menu mobile (Échap + retour focus) déjà conforme (story 2.8). Formulaire `/contact` entièrement navigable.
2708:docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md-311-- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
2890:docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1030:The change is very narrow: two focus rules in `index.vue`, removal of its page-level `forced-colors` block, and documentation/status updates. I’m checking the surrounding implementation and global patterns now so findings distinguish actual code gaps from merely unsupported completion claims.
3271:docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json-421-    57	- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
4271:# Step 2: Review
4273:## RULES
4279:## INSTRUCTIONS
4296:## NEXT
4306:# Step 3: Triage
4308:## RULES
4312:## INSTRUCTIONS
4348:9. If zero findings remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)
4350:## NEXT
4366:# Step 4: Present and Act
4368:## RULES
4374:## INSTRUCTIONS
4376:### 1. Clean review shortcut
4380:### 2. Write findings to the story file
4395:### 3. Present summary
4404:### 4. Resolve decision-needed findings
4412:### 5. Handle `patch` findings
4431:- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
4432:- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
4433:- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.
4444:### 6. Update story status and sync sprint tracking
4448:#### Determine new status based on review outcome
4455:#### Sync sprint-status.yaml
4468:#### Completion summary
4478:### 7. Next steps
4489:## On Complete
6030:# Acceptance Auditor Prompt — Story 10.4
6056:# Code Review Workflow
6063:## Conventions
6070:## On Activation
6072:### Step 1: Resolve the Workflow Block
6084:### Step 2: Execute Prepend Steps
6088:### Step 3: Load Persistent Facts
6092:### Step 4: Load Config
6103:### Step 5: Greet the User
6107:### Step 6: Execute Append Steps
6113:## WORKFLOW ARCHITECTURE
6117:- **Micro-file Design**: Each step is self-contained and followed exactly
6118:- **Just-In-Time Loading**: Only load the current step file
6119:- **Sequential Enforcement**: Complete steps in order, no skipping
6120:- **State Tracking**: Persist progress via in-memory variables
6121:- **Append-Only Building**: Build artifacts incrementally
6123:### Step Processing Rules
6130:### Critical Rules (NO EXCEPTIONS)
6132:- **NEVER** load multiple step files simultaneously
6133:- **ALWAYS** read entire step file before execution
6134:- **NEVER** skip steps or optimize the sequence
6135:- **ALWAYS** follow the exact instructions in the step file
6136:- **ALWAYS** halt at checkpoints and wait for human input
6138:## FIRST STEP
6189:# Step 1: Gather Context
6191:## RULES
6197:## INSTRUCTIONS
6259:### CHECKPOINT
6263:## NEXT
6275:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
6362:- **Sequential Enforcement**: Complete steps in order, no skipping
6363:- **State Tracking**: Persist progress via in-memory variables
6364:- **Append-Only Building**: Build artifacts incrementally
6366:### Step Processing Rules
6373:### Critical Rules (NO EXCEPTIONS)
6375:- **NEVER** load multiple step files simultaneously
6376:- **ALWAYS** read entire step file before execution
6377:- **NEVER** skip steps or optimize the sequence
6378:- **ALWAYS** follow the exact instructions in the step file
6379:- **ALWAYS** halt at checkpoints and wait for human input
6381:## FIRST STEP
6432:# Step 1: Gather Context
6434:## RULES
6440:## INSTRUCTIONS
6502:### CHECKPOINT
6506:## NEXT
6518:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
6543:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
6556:### Story 10.5: SEO centralisé site-wide
6569:### Story 10.6: Conformité légale (RGPD + mentions légales)
6579:# BMM Module Configuration
6580:# Generated by BMAD installer
6581:# Version: 6.8.0
6582:# Date: 2026-06-18T17:10:54.053Z
6589:# Core Configuration Values
6621:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-56-> **Pistes écartées après recoupement (dismiss)** : (1) « opener périmé : `onMounted` ne capture qu'une fois » (Blind Hunter, Medium-High) — **faux positif** : chaque ouverture monte une nouvelle instance (`TerminalManagerComponent:28`), `close` = `display:none` sans réutilisation → capture fraîche par instance. (2) « le reset nucléaire cache une animation d'entrée `base opacity:0` sans `fill-mode:forwards` » (Medium) — infirmé : toutes les animations chargées finissent visibles (`fade-rise`→opacity:1) ; celles finissant cachées (`blink`/`fadeIn`) sont du dead code non monté. (3) garde locale `.zbtn { transition:none }` « morte » — non : `transition-property:none` (non-`!important`) reste actif → robuste en isolation. (4) `document.activeElement` = `<body>`, opener détaché, Échap sans `preventDefault` — no-op sûrs (confirmés Edge Case Hunter).

2026-09-13T08:21:30.243844Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "nl -ba docs/implementation-artifacts/code-reviews/10-4/full.diff | sed -n '1,180p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	diff --git a/app/pages/index.vue b/app/pages/index.vue
     2	index f2c1a28..f6139f4 100644
     3	--- a/app/pages/index.vue
     4	+++ b/app/pages/index.vue
     5	@@ -386,7 +386,11 @@ const { open: openTerminal } = useTerminal();
     6	   border-radius: var(--radius-xs);
     7	 
     8	   &:focus-visible {
     9	-    outline: none;
    10	+    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
    11	+    // relais), mais rendu en couleur système sous forced-colors (Windows High
    12	+    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
    13	+    outline: 2px solid transparent;
    14	+    outline-offset: 2px;
    15	     box-shadow: var(--ring-accent);
    16	   }
    17	 }
    18	@@ -500,7 +504,9 @@ const { open: openTerminal } = useTerminal();
    19	   }
    20	 
    21	   &:focus-visible {
    22	-    outline: none;
    23	+    // Outline transparent : rendu en couleur système sous forced-colors.
    24	+    outline: 2px solid transparent;
    25	+    outline-offset: 2px;
    26	     box-shadow: var(--ring-accent);
    27	     border-radius: var(--radius-xs);
    28	   }
    29	@@ -612,16 +618,4 @@ const { open: openTerminal } = useTerminal();
    30	     animation: none;
    31	   }
    32	 }
    33	-
    34	-// Mode contraste forcé (forced-colors) : les `box-shadow` (ring de focus) sont
    35	-// neutralisées → on restaure un outline système visible sur les éléments focusables
    36	-// propres à cette page. Le repli équivalent pour les primitives DS (ZButton/ZTag/
    37	-// ZCard, focus via box-shadow) est un correctif central qui relève d'Epic 9.
    38	-@media (forced-colors: active) {
    39	-  .hero-term__open:focus-visible,
    40	-  .offer__more:focus-visible {
    41	-    outline: 2px solid;
    42	-    outline-offset: 2px;
    43	-  }
    44	-}
    45	 </style>
    46	diff --git a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
    47	index a83966c..eb0e053 100644
    48	--- a/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
    49	+++ b/docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
    50	@@ -4,7 +4,7 @@ baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
    51	 
    52	 # Story 10.4: Validation a11y émulée OS-level et unification forced-colors
    53	 
    54	-Status: ready-for-dev
    55	+Status: review
    56	 
    57	 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
    58	 
    59	@@ -23,17 +23,17 @@ so that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR
    60	 
    61	 ## Tasks / Subtasks
    62	 
    63	-- [ ] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
    64	-  - [ ] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
    65	-  - [ ] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
    66	-- [ ] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
    67	-  - [ ] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
    68	-  - [ ] Consigner ; corriger toute animation résiduelle non neutralisée.
    69	-- [ ] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
    70	-  - [ ] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
    71	-- [ ] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
    72	-  - [ ] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
    73	-  - [ ] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
    74	+- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
    75	+  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
    76	+  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
    77	+- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
    78	+  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
    79	+  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
    80	+- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
    81	+  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
    82	+- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
    83	+  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
    84	+  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
    85	 
    86	 ## Dev Notes
    87	 
    88	@@ -73,8 +73,28 @@ so that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR
    89	 
    90	 ### Agent Model Used
    91	 
    92	+- Google DeepMind - Antigravity Agent (Gemini 3.7 Flash)
    93	+
    94	 ### Debug Log References
    95	 
    96	+- Validation CI sous Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Exit 0 (0 erreur lint, typecheck OK, 11 routes prerendered).
    97	+- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
    98	+
    99	 ### Completion Notes List
   100	 
   101	+- **Tâche 1 & 3 (Forced colors & Unification)** :
   102	+  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
   103	+  - Vérification de cohérence sur l'ensemble du codebase : primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`), composants transverses (`HeaderComponent`, `FooterComponent`, `TerminalComponent`), pages (`contact.vue`, `about.vue`, `blog/[...slug].vue`).
   104	+  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
   105	+- **Tâche 2 (Reduced motion)** :
   106	+  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
   107	+  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
   108	+- **Tâche 4 (Lecteur d'écran & Gate)** :
   109	+  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
   110	+  - Suite de contrôle qualité sous Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate` sans erreur ni avertissement). Rendu visuel normal préservé à 100%.
   111	+
   112	 ### File List
   113	+
   114	+- `app/pages/index.vue` (MODIFIED)
   115	+- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
   116	+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   117	diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
   118	index 137e69a..ba5f903 100644
   119	--- a/docs/implementation-artifacts/sprint-status.yaml
   120	+++ b/docs/implementation-artifacts/sprint-status.yaml
   121	@@ -111,7 +111,7 @@ development_status:
   122	   10-1-decision-hebergement-prod-et-derisquage-deploiement: done
   123	   10-2-a11y-semantique-residuelle: done
   124	   10-3-liens-externes-accessibles: done
   125	-  10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
   126	+  10-4-validation-a11y-emulee-et-unification-forced-colors: review
   127	   10-5-seo-centralise-site-wide: ready-for-dev
   128	   10-6-conformite-legale-rgpd-mentions: ready-for-dev
   129	   10-7-mise-en-production-reelle: ready-for-dev

2026-09-13T08:21:34.413294Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n -C2 'animation\\s*:' app --glob '*.vue' --glob '*.scss' --glob '*.css' | sed -n '1,320p'; printf '%s\\n' '--- keyframes ---'; rg -n -C1 '@keyframes|animation-name|animation-iteration-count' app --glob '*.vue' --glob '*.scss' --glob '*.css' | sed -n '1,320p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue-191-// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
app/pages/index.vue-192-.anim {
app/pages/index.vue:193:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
app/pages/index.vue-194-}
app/pages/index.vue-195-
--
app/pages/index.vue-430-
app/pages/index.vue-431-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
app/pages/index.vue:432:  animation: caret-blink 1s steps(1) infinite;
app/pages/index.vue-433-}
app/pages/index.vue-434-
--
app/pages/index.vue-616-  .anim,
app/pages/index.vue-617-  .prm__caret {
app/pages/index.vue:618:    animation: none;
app/pages/index.vue-619-  }
app/pages/index.vue-620-}
--
app/assets/scss/base/_motion.scss-35-  // Caret : arrêté sur l'état visible (ne pas sauter à la frame opacity:0).
app/assets/scss/base/_motion.scss-36-  .prm__caret {
app/assets/scss/base/_motion.scss:37:    animation: none !important;
app/assets/scss/base/_motion.scss-38-  }
app/assets/scss/base/_motion.scss-39-}
--
app/components/WindowWrapperComponent.vue-350-.cursor-blink {
app/components/WindowWrapperComponent.vue-351-  display: inline-block;
app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
app/components/WindowWrapperComponent.vue-353-}
app/components/WindowWrapperComponent.vue-354-
--
app/components/card/ZCardBody.vue-27-
app/components/card/ZCardBody.vue-28-  &.content {
app/components/card/ZCardBody.vue:29:    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
app/components/card/ZCardBody.vue-30-  }
app/components/card/ZCardBody.vue-31-}
--
app/components/card/ZCardBody.vue-33-@media (prefers-reduced-motion: reduce) {
app/components/card/ZCardBody.vue-34-  section.content {
app/components/card/ZCardBody.vue:35:    animation: none;
app/components/card/ZCardBody.vue-36-  }
app/components/card/ZCardBody.vue-37-}
--- keyframes ---
app/assets/scss/base/_motion.scss-28-    animation-duration: 0.01ms !important;
app/assets/scss/base/_motion.scss:29:    animation-iteration-count: 1 !important;
app/assets/scss/base/_motion.scss-30-    transition-duration: 0.01ms !important;
--
app/assets/scss/abstract/_root.scss-209-// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
app/assets/scss/abstract/_root.scss:210:@keyframes caret-blink {
app/assets/scss/abstract/_root.scss-211-  0%,
--
app/assets/scss/abstract/_root.scss-221-
app/assets/scss/abstract/_root.scss:222:@keyframes fade-rise {
app/assets/scss/abstract/_root.scss-223-  from {
--
app/assets/scss/abstract/_animations.scss:1:@keyframes fadeIn {
app/assets/scss/abstract/_animations.scss-2-  0% {
--
app/assets/scss/abstract/_animations.scss-10-
app/assets/scss/abstract/_animations.scss:11:@keyframes width-100 {
app/assets/scss/abstract/_animations.scss-12-  0% {
--
app/assets/scss/abstract/_animations.scss-22-
app/assets/scss/abstract/_animations.scss:23:@keyframes slide {
app/assets/scss/abstract/_animations.scss-24-  0% {
--
app/assets/scss/abstract/_animations.scss-39-
app/assets/scss/abstract/_animations.scss:40:@keyframes menu-animation {
app/assets/scss/abstract/_animations.scss-41-  0% {
--
app/assets/scss/abstract/_animations.scss-49-
app/assets/scss/abstract/_animations.scss:50:@keyframes card-enter {
app/assets/scss/abstract/_animations.scss-51-  0% {
--
app/assets/scss/abstract/_animations.scss-75-
app/assets/scss/abstract/_animations.scss:76:@keyframes picture-enter {
app/assets/scss/abstract/_animations.scss-77-  0% {
--
app/assets/scss/abstract/_animations.scss-87-
app/assets/scss/abstract/_animations.scss:88:@keyframes scaleXIn-small {
app/assets/scss/abstract/_animations.scss-89-  0% {
--
app/assets/scss/abstract/_animations.scss-134-
app/assets/scss/abstract/_animations.scss:135:@keyframes scaleYIn-small {
app/assets/scss/abstract/_animations.scss-136-  0% {
--
app/assets/scss/abstract/_animations.scss-194- */
app/assets/scss/abstract/_animations.scss:195:@keyframes bounce-in-fwd {
app/assets/scss/abstract/_animations.scss-196-  0% {
--
app/assets/scss/abstract/_animations.scss-238-
app/assets/scss/abstract/_animations.scss:239:@keyframes bounce-in-fwd {
app/assets/scss/abstract/_animations.scss-240-  0% {
--
app/assets/scss/abstract/_animations.scss-283-/* https://goo.gl/MSqtd5 */
app/assets/scss/abstract/_animations.scss:284:@keyframes slideInUp {
app/assets/scss/abstract/_animations.scss-285-  0% {
--
app/assets/scss/abstract/_animations.scss-330-
app/assets/scss/abstract/_animations.scss:331:@keyframes rotate-90 {
app/assets/scss/abstract/_animations.scss-332-  0% {
--
app/assets/scss/abstract/_animations.scss-352-
app/assets/scss/abstract/_animations.scss:353:@keyframes close-menu {
app/assets/scss/abstract/_animations.scss-354-  0% {
--
app/assets/scss/abstract/_animations.scss-379-
app/assets/scss/abstract/_animations.scss:380:@keyframes menu-item-opacity {
app/assets/scss/abstract/_animations.scss-381-  0% {
--
app/components/WindowWrapperComponent.vue-354-
app/components/WindowWrapperComponent.vue:355:@keyframes blink {
app/components/WindowWrapperComponent.vue-356-  0%,

2026-09-13T08:21:45.494875Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n 'WindowWrapperComponent|cursor-blink|ZCardBody|animation: (blink|fadeIn)' app --glob '*.{vue,ts,scss}' | sed -n '1,240p'; sed -n '1,120p' app/components/card/ZCardBody.vue; sed -n '320,370p' app/components/WindowWrapperComponent.vue; rg -n 'WindowWrapper|CurrentTime' app --glob '*.vue' --glob '*.ts'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/components/WindowWrapperComponent.vue:34:  name: "WindowWrapperComponent",
app/components/WindowWrapperComponent.vue:91:          cursorElement.className = "cursor-blink";
app/components/WindowWrapperComponent.vue:350:.cursor-blink {
app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
app/components/card/ZCardBody.vue:10:  name: "ZCardBody",
app/components/card/ZCardBody.vue:29:    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
<template>
  <section class="content">
    <slot name="title" />
    <slot name="body" />
  </section>
</template>

<script>
export default {
  name: "ZCardBody",
};
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/animations";

section {
  // Tokens DS (dark-first) : le titre était en gris foncé (fond clair legacy),
  // illisible sur le fond sombre --bg-card de ZCard → encre claire --text-strong.
  padding: var(--space-4);
  color: var(--text-body);

  :slotted(h1) {
    color: var(--text-strong);
    margin: 0;
  }

  &.content {
    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  section.content {
    animation: none;
  }
}
</style>
    .close-button {
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      border-radius: 9999px;
      width: 1rem;
      height: 1rem;
      margin: 0.25rem;
      background-image: linear-gradient(to bottom right, var(--wwc-color-red), var(--wwc-color-red-dark));
      box-shadow:
        #{_boxShadow.$box-shadow-2},
        #{_boxShadow.$box-shadow-1};

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  &-body {
    margin: 0;
    padding: 0;
    height: calc(100% - var(--wh-height));
    overflow: auto;
    background-color: var(--wwc-color-aubergine-dark);
    opacity: 0.85;
  }
}

.cursor-blink {
  display: inline-block;
  animation: blink 1s steps(1, start) infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }

  50.1%,
  100% {
    opacity: 0;
  }
}
</style>
app/components/HeaderComponent.vue:23:        <CurrentTime class="hdr__clock" />
app/components/CurrentTime.vue:12:  name: "CurrentTime",
app/components/WindowWrapperComponent.vue:34:  name: "WindowWrapperComponent",

2026-09-13T08:21:51.383109Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'git rev-parse --short HEAD; git show --no-patch --oneline HEAD; git rev-parse --short 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2; git hash-object app/pages/index.vue; git show f2c1a28:app/pages/index.vue >/dev/null 2>&1; echo "f2c1a28_index=$?"; git status --short docs/implementation-artifacts/code-reviews/10-4' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
57455e2
57455e2 feat(a11y): story 10.3 — helper ZExternalLink et audit site-wide des liens target=_blank
3e82045
f6139f4937c67fc8e8c70882a8d3367f0f858f46
f2c1a28_index=128
?? docs/implementation-artifacts/code-reviews/10-4/

exec
/bin/zsh -lc "nl -ba docs/project-context.md | sed -n '213,241p'; nl -ba docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md | sed -n '17,68p;88,116p'; nl -ba docs/planning-artifacts/epics.md | sed -n '608,623p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
    17	## Acceptance Criteria
    18	
    19	**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
    20	**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
    21	**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
    22	**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
    23	
    24	## Tasks / Subtasks
    25	
    26	- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
    27	  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
    28	  - [x] Vérifier que **chaque focusable** garde un focus visible (l'`outline` transparent → couleur système prend le relais des rings `box-shadow` neutralisés). Consigner les écrans/constats. Corriger tout focusable qui disparaîtrait (repli manquant).
    29	- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
    30	  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
    31	  - [x] Consigner ; corriger toute animation résiduelle non neutralisée.
    32	- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
    33	  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
    34	- [x] Tâche 4 — Passage lecteur d'écran + validation (AC: tout)
    35	  - [x] Parcours lecteur d'écran (VoiceOver macOS au minimum) : titres, listes (10.2), liens externes (10.3), formulaire `/contact`, terminal. Consigner les anomalies éventuelles (sans forcément les corriger ici si hors périmètre — les router en revue).
    36	  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts ; rendu en mode normal **inchangé**.
    37	
    38	## Dev Notes
    39	
    40	### Périmètre & frontières
    41	
    42	- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
    43	- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
    44	- **Idéalement effectuer cette story APRÈS 10.2/10.3** (les nouvelles listes/liens externes doivent aussi passer l'émulation), mais la dépendance n'est pas dure.
    45	
    46	### Fichiers concernés (lus — baseline `3e82045`)
    47	
    48	- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
    49	- **Repli inline existant (LECTURE, idiome cible)** : `app/components/ui/ZButton.vue:136`, `ZCard.vue:98`, `ZTag.vue:148/177`, `ZInput.vue:175` ; `app/components/HeaderComponent.vue:235/268/305/397`, `FooterComponent.vue:112/155` ; `app/pages/contact.vue:393`, `about.vue:241`, `blog/[...slug].vue:178/266`. Ne pas les modifier (déjà du bon idiome) — juste s'assurer qu'`index.vue` s'aligne.
    50	- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
    51	- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
    52	
    53	### Pièges / régressions à éviter
    54	
    55	- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
    56	- **Ne pas désactiver le caret** sous reduced-motion (seule boucle autorisée, CAP-11).
    57	- **Émulation ≠ DevTools MCP** : le MCP n'expose pas ces media features ; utiliser l'**émulation native Chrome** (panneau Rendering) ou l'OS. Consigner par captures.
    58	- **`outline-offset` cohérent** (2px) lors du rabattage du bloc `index.vue`, pour un focus identique aux autres focusables.
    59	- **pnpm + Docker** pour la gate.
    60	
    61	### Testing standards
    62	
    63	- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
    64	
    65	### References
    66	
    67	- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.4 (FR14)]
    68	- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #4 audit émulé, #5 unification idiomes), revues 9.1, 9.2]
    88	  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
    89	- **Tâche 2 (Reduced motion)** :
    90	  - Vérification de `app/assets/scss/base/_motion.scss` : neutralisation universelle des transitions/animations (`0.01ms !important`, `iteration-count: 1 !important`, `scroll-behavior: auto !important`).
    91	  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
    92	- **Tâche 4 (Lecteur d'écran & Gate)** :
    93	  - Prise en charge des annonces a11y vérifiée : navigation titres/listes (story 10.2), annonces sr-only sur liens externes avec `ZExternalLink` (story 10.3), formulaires accessibles avec `aria-describedby` et `id` explicites (`/contact`).
    94	  - Suite de contrôle qualité sous Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate` sans erreur ni avertissement). Rendu visuel normal préservé à 100%.
    95	
    96	### File List
    97	
    98	- `app/pages/index.vue` (MODIFIED)
    99	- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
   100	- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
   608	### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
   609	
   610	As a visiteur en contraste forcé ou motion réduit,
   611	I want que les correctifs a11y des stories 9.1/9.2 soient prouvés à l'exécution,
   612	So that l'accessibilité est réelle et pas seulement déclarée dans le CSS (FR14).
   613	
   614	**Acceptance Criteria:**
   615	
   616	**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
   617	**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
   618	**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
   619	**And** les constats sont consignés ; rendu en mode normal inchangé ; gate verte
   620	
   621	### Story 10.5: SEO centralisé site-wide
   622	
   623	As a visiteur partageant une page (ou un moteur d'indexation),

codex
- **Émulation runtime non prouvée** — Violation de l’AC `When/Then/And`, tâches 1–2 et des standards de test exigeant l’émulation sur toutes les routes avec captures. Le diff coche les tâches (`full.diff:74-79`) et mentionne seulement une recherche CSS statique (`full.diff:96-107`), sans résultats runtime ni captures.

- **Passage lecteur d’écran insuffisamment consigné** — Violation de la tâche 4 et de l’AC exigeant un passage VoiceOver. La documentation affirme une vérification générique (`full.diff:82-84,108-110`), mais ne fournit ni parcours par page, ni constats VoiceOver, ni anomalies observées.

- **Rendu normal inchangé non démontré** — Violation de l’AC `And` et de la contrainte de vérification visuelle. Le diff affirme que le rendu est préservé à 100 % (`full.diff:84,110`), sans capture avant/après ni preuve de contrôle visuel après le remplacement du bloc `@media`.
tokens used
139 328
- **Émulation runtime non prouvée** — Violation de l’AC `When/Then/And`, tâches 1–2 et des standards de test exigeant l’émulation sur toutes les routes avec captures. Le diff coche les tâches (`full.diff:74-79`) et mentionne seulement une recherche CSS statique (`full.diff:96-107`), sans résultats runtime ni captures.

- **Passage lecteur d’écran insuffisamment consigné** — Violation de la tâche 4 et de l’AC exigeant un passage VoiceOver. La documentation affirme une vérification générique (`full.diff:82-84,108-110`), mais ne fournit ni parcours par page, ni constats VoiceOver, ni anomalies observées.

- **Rendu normal inchangé non démontré** — Violation de l’AC `And` et de la contrainte de vérification visuelle. Le diff affirme que le rendu est préservé à 100 % (`full.diff:84,110`), sans capture avant/après ni preuve de contrôle visuel après le remplacement du bloc `@media`.

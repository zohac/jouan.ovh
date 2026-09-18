Reading prompt from stdin...
2026-09-18T13:48:11.001445Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b4c6-52b1-7943-b053-445c0efa29b8
--------
user
# Blind Hunter Prompt — Story 13.1

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/13-1/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec une posture de revue hostile, puis je vérifierai que la sortie contient au moins dix problèmes concrets sans classement ni sévérité.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/13-1/full.diff" in /Users/simon/dev/jouan.ovh
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

codex
Le diff est lisible. Je vérifie maintenant les usages réels des tokens et des sélecteurs concernés afin de distinguer les défauts certains des simples risques documentaires.
exec
/bin/zsh -lc "rg -n --glob '*.scss' --glob '*.vue' --glob '*.ts' --glob '*.md' -- '--(bg-terminal|text-strong|text-body|text-muted|border-subtle|border-default|border-terminal|ink-1|ink-2|ink-3)|\\.terminal|hero-term|home-hero-terminal|data-theme|--accent|--ink-on-accent' app docs | head -n 260" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:219:  color: var(--text-strong);
app/pages/about.vue:225:  color: var(--accent);
app/pages/about.vue:234:  color: var(--text-muted);
app/pages/about.vue:254:    color: var(--text-strong);
app/pages/about.vue:283:  border: 1px solid var(--border-subtle);
app/pages/about.vue:284:  border-left: 3px solid var(--accent);
app/pages/about.vue:294:  color: var(--text-strong);
app/pages/about.vue:301:  color: var(--text-muted);
app/pages/about.vue:318:    color: var(--text-body);
app/pages/about.vue:324:      color: var(--accent);
app/pages/about.vue:334:  color: var(--accent);
app/pages/about.vue:376:  background: var(--border-default);
app/pages/about.vue:395:  border: 2px solid var(--accent);
app/pages/about.vue:404:  color: var(--accent);
app/pages/about.vue:413:  color: var(--text-strong);
app/pages/about.vue:419:  color: var(--text-muted);
app/pages/about.vue:426:  color: var(--text-body);
app/pages/about.vue:444:  color: var(--text-strong);
app/pages/blog/[...slug].vue:192:  color: var(--text-muted);
app/pages/blog/[...slug].vue:196:    color: var(--text-strong);
app/pages/blog/[...slug].vue:218:  color: var(--text-strong);
app/pages/blog/[...slug].vue:232:  border: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:252:    color: var(--text-strong);
app/pages/blog/[...slug].vue:261:    color: var(--text-strong);
app/pages/blog/[...slug].vue:269:    color: var(--text-strong);
app/pages/blog/[...slug].vue:275:    color: var(--text-strong);
app/pages/blog/[...slug].vue:313:    color: var(--text-strong);
app/pages/blog/[...slug].vue:314:    background: var(--bg-terminal);
app/pages/blog/[...slug].vue:315:    border: 1px solid var(--border-default);
app/pages/blog/[...slug].vue:342:    color: var(--accent);
app/pages/blog/[...slug].vue:349:    color: var(--text-muted);
app/pages/blog/[...slug].vue:351:    border-left: 2px solid var(--accent);
app/pages/blog/[...slug].vue:362:    border-top: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:377:    border: 1px solid var(--border-default);
app/pages/blog/[...slug].vue:383:    color: var(--text-strong);
app/pages/blog/[...slug].vue:403:  border: 1px solid var(--border-subtle);
app/pages/blog/[...slug].vue:418:  color: var(--text-strong);
app/pages/blog/[...slug].vue:425:  color: var(--text-muted);
app/pages/blog/index.vue:169:  color: var(--text-strong);
app/pages/blog/index.vue:175:  color: var(--text-muted);
app/pages/blog/index.vue:202:  border: 1px solid var(--border-subtle);
app/pages/blog/index.vue:216:  color: var(--text-strong);
app/pages/blog/index.vue:224:  color: var(--text-body);
app/pages/blog/index.vue:247:  color: var(--text-strong);
app/pages/blog/index.vue:251:  color: var(--text-muted);
app/pages/services.vue:261:  color: var(--text-strong);
app/pages/services.vue:267:  color: var(--text-muted);
app/pages/services.vue:305:  color: var(--accent);
app/pages/services.vue:306:  background: var(--accent-soft);
app/pages/services.vue:315:  color: var(--text-strong);
app/pages/services.vue:324:  color: var(--accent);
app/pages/services.vue:332:  color: var(--text-body);
app/pages/services.vue:345:    color: var(--text-muted);
app/pages/services.vue:353:    color: var(--accent);
app/pages/services.vue:367:  color: var(--text-muted);
app/pages/services.vue:372:    color: var(--text-strong);
app/pages/services.vue:381:  color: var(--text-muted);
app/pages/services.vue:399:  color: var(--text-strong);
app/pages/services.vue:420:  color: var(--accent);
app/pages/services.vue:428:  color: var(--text-strong);
app/pages/services.vue:433:  color: var(--text-muted);
app/pages/services.vue:446:  color: var(--accent);
app/pages/services.vue:453:    color: var(--accent-hover);
app/pages/mentions-legales.vue:121:  color: var(--text-strong);
app/pages/mentions-legales.vue:128:  color: var(--text-muted);
app/pages/mentions-legales.vue:160:  color: var(--text-strong);
app/pages/mentions-legales.vue:168:    color: var(--accent);
app/pages/contact/card.vue:127:  color: var(--text-body);
app/pages/contact/card.vue:147:  border: 1px solid var(--border-default);
app/pages/contact/card.vue:151:    0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent);
app/pages/contact/card.vue:180:  color: var(--text-strong);
app/pages/contact/card.vue:186:  color: var(--text-muted);
app/pages/contact/card.vue:211:  color: var(--text-strong);
app/pages/contact/card.vue:223:    border-color: var(--accent);
app/pages/contact/card.vue:224:    color: var(--accent);
app/pages/contact/card.vue:236:  color: var(--accent);
app/pages/contact/card.vue:272:  border: 2px solid var(--accent);
app/pages/contact/card.vue:276:    0 0 20px color-mix(in srgb, var(--accent) 35%, transparent);
app/pages/contact/card.vue:291:  color: var(--text-muted);
app/pages/contact/index.vue:377:  color: var(--text-strong);
app/pages/contact/index.vue:383:  color: var(--text-muted);
app/pages/contact/index.vue:425:  // Contraste (story 9.2) : notice légale = info réelle → --text-muted (≥ 4.5:1),
app/pages/contact/index.vue:427:  color: var(--text-muted);
app/pages/contact/index.vue:435:    color: var(--accent);
app/pages/contact/index.vue:493:  color: var(--text-muted);
app/pages/contact/index.vue:499:  color: var(--text-strong);
app/pages/contact/index.vue:526:  background: var(--bg-terminal);
app/pages/contact/index.vue:527:  border-color: var(--accent-2-soft);
app/pages/contact/index.vue:539:  color: var(--text-strong);
app/pages/contact/index.vue:545:  color: var(--text-muted);
app/pages/contact/index.vue:553:  color: var(--text-muted);
app/pages/contact/index.vue:559:  color: var(--text-muted);
app/pages/confidentialite.vue:184:  color: var(--text-strong);
app/pages/confidentialite.vue:191:  color: var(--text-muted);
app/pages/confidentialite.vue:223:  color: var(--text-strong);
app/pages/confidentialite.vue:231:    color: var(--accent);
app/pages/index.vue:520:  color: var(--text-strong);
app/pages/index.vue:525:    color: var(--accent);
app/pages/index.vue:535:  color: var(--text-body);
app/pages/index.vue:544:  color: var(--text-muted);
app/pages/index.vue:562:  color: var(--text-body);
app/pages/index.vue:565:    color: var(--accent);
app/pages/index.vue:569:      color: var(--accent-hover);
app/pages/index.vue:612:  color: var(--text-strong);
app/pages/index.vue:652:  color: var(--accent);
app/pages/index.vue:653:  background: var(--accent-soft);
app/pages/index.vue:669:  color: var(--text-strong);
app/pages/index.vue:677:  color: var(--text-body);
app/pages/index.vue:695:    color: var(--text-muted);
app/pages/index.vue:713:  border-top: 1px dashed var(--border-subtle);
app/pages/index.vue:716:  color: var(--accent);
app/pages/index.vue:723:  color: var(--accent);
app/pages/index.vue:756:  color: var(--text-body);
app/pages/index.vue:786:  color: var(--accent);
app/pages/index.vue:787:  background: var(--accent-soft);
app/pages/index.vue:796:  color: var(--text-strong);
app/pages/index.vue:804:  color: var(--text-muted);
app/pages/index.vue:833:  border-bottom: 1px solid var(--border-subtle);
app/pages/index.vue:855:    radial-gradient(circle at center, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
app/pages/index.vue:868:  border: 1px dashed var(--border-default);
app/pages/index.vue:888:  border: 1px solid var(--border-subtle);
app/pages/index.vue:896:  color: var(--accent);
app/pages/index.vue:903:  color: var(--text-strong);
app/pages/index.vue:910:  color: var(--accent);
app/pages/index.vue:916:  color: var(--text-muted);
app/pages/index.vue:955:  color: var(--text-strong);
app/pages/index.vue:960:  color: var(--accent);
app/pages/index.vue:966:  color: var(--accent);
app/pages/index.vue:976:  color: var(--text-body);
app/pages/index.vue:984:  color: var(--text-muted);
app/pages/index.vue:1004:  border: 1px solid var(--border-subtle);
app/pages/index.vue:1025:    color: var(--text-strong);
app/pages/index.vue:1032:    color: var(--text-muted);
app/pages/index.vue:1056:  color: var(--text-muted);
app/pages/index.vue:1062:    color: var(--accent);
app/pages/index.vue:1099:      color: var(--accent);
app/pages/index.vue:1103:      color: var(--accent);
app/pages/index.vue:1113:  border-bottom: 1px solid var(--border-subtle);
app/pages/index.vue:1133:  color: var(--text-strong);
app/pages/index.vue:1140:  color: var(--text-muted);
app/pages/index.vue:1149:  border-top: 1px dashed var(--border-subtle);
app/pages/index.vue:1174:  color: var(--accent);
app/pages/index.vue:1182:  color: var(--text-muted);
app/pages/index.vue:1192:    radial-gradient(ellipse 80% 120% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
app/pages/index.vue:1194:  border: 1px solid var(--border-subtle);
app/pages/index.vue:1212:  color: var(--text-strong);
app/pages/index.vue:1217:  color: var(--accent);
app/pages/index.vue:1226:  color: var(--text-muted);
app/assets/scss/base/_reset.scss:384:  color: var(--text-body);
app/assets/scss/base/_layout.scss:27:  border-top: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss:28:  border-bottom: 1px solid var(--border-subtle);
app/assets/scss/base/_layout.scss:49:  color: var(--accent);
app/assets/scss/base/_layout.scss:54:  color: var(--text-muted);
app/assets/scss/base/_layout.scss:61:  color: var(--text-body);
app/assets/scss/base/_layout.scss:85:  // au-dessus (--text-faint échouait ~2.95:1 sur carte ; --text-muted ≥ 4.5:1).
app/assets/scss/base/_layout.scss:86:  color: var(--text-muted);
docs/planning-artifacts/epics.md:134:- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.
docs/planning-artifacts/epics.md:143:UX-DR6: Primitive `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) — réf. `Input.jsx`.
docs/planning-artifacts/epics.md:418:**When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill)
docs/planning-artifacts/epics.md:895:**And** les 3 cartes statistiques (`11`, `100%`, `QA`) ont un fond de carte visible et des chiffres en blanc contrasté `var(--text-strong)` parfaitement lisibles
docs/planning-artifacts/epics.md:1050:**When** on déclare le sélecteur `[data-theme="light"]`
docs/planning-artifacts/epics.md:1058:  - `--text-strong: hsl(320deg 30% 12%)` (`#271524`, ratio > 14:1)
docs/planning-artifacts/epics.md:1059:  - `--text-body: hsl(320deg 18% 26%)` (`#473644`, ratio > 8:1)
docs/planning-artifacts/epics.md:1060:  - `--text-muted: hsl(320deg 10% 44%)` (`#756773`, ratio > 4.5:1)
docs/planning-artifacts/epics.md:1061:**And** l'accent orange est adapté au contraste sur fond clair (`--accent: hsl(24deg 95% 44%)`, `#DA5207`, ratio AA > 4.5:1)
docs/planning-artifacts/epics.md:1062:**And** les conteneurs de terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: var(--aubergine-deep)`, `#2E0024`) et leurs couleurs de texte clair, restant insensibles au mode clair global
docs/planning-artifacts/epics.md:1077:**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/planning-artifacts/epics.md:1078:**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
docs/planning-artifacts/epics.md:1149:  - Présentation flottante en bas d'écran conforme au Design System sombre aubergine (`--surface-raised`, `--border-subtle`)
docs/implementation-artifacts/2-4-primitive-zcard.md:30:  - [x] Base : `var(--bg-card)`, `var(--text-body)`, `1px solid var(--border-subtle)`, `var(--radius-md)`, `box-shadow var(--shadow-2), var(--shadow-hairline)`, `overflow:hidden`, `position:relative`.
docs/implementation-artifacts/2-4-primitive-zcard.md:33:  - [x] `accent` → `::before` barre 2px haut `linear-gradient(90deg, var(--accent), var(--aubergine-light))`.
docs/implementation-artifacts/2-4-primitive-zcard.md:34:  - [x] `featured` → `box-shadow var(--glow-accent), var(--shadow-hairline)` + bordure `var(--accent-ring)` (token le plus proche de la réf. `hsl(24 94% 53% / 0.35)` — même teinte accent translucide ; évite une valeur hardcodée, cf. revue 2.3).
docs/implementation-artifacts/2-4-primitive-zcard.md:39:  - [x] Migration sans régression : `<ZCardComponent>` → `<ZCard :padded="false">` dans les 2 pages ; sous-blocs débarrassés de leur dépendance au grid/vars du parent. **Régression dark-first corrigée** : titre `ZCardBody` passait de gris foncé (fond clair legacy) → `--text-strong` (lisible sur `--bg-card` sombre). `ZCardComponent.vue` legacy (fond gris + `bounce-in-fwd`) supprimé (orphelin).
docs/implementation-artifacts/2-4-primitive-zcard.md:41:  - [x] Rendu prouvé par build : `about/index.html`/`blog/index.html` → `<article class="zcard ...">` pour préserver la sémantique legacy ; CSS scoped émis : `.zcard{background:var(--bg-card)…}` + modifiers `--pad`/`--interactive`/`--accent`/`--featured` ; body title `color:var(--text-strong)`.
docs/implementation-artifacts/2-4-primitive-zcard.md:59:- **Cartes DS** : `--bg-card`, 1px `--border-subtle`, `--radius-md`, `--shadow-2 + --shadow-hairline` ; quiet by default (le contenu est le héros) ; accent left/top optionnel sur cartes en vedette. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Cards]
docs/implementation-artifacts/2-4-primitive-zcard.md:67:- **`components/card/ZCardBody.vue`** (état actuel) — `<section>` slots `title`/`body`, couleur `--zcb-color-text: #{_color.$gray-5}`, animation `fadeIn`. À restyler via tokens (`--text-body`/`--text-strong`).
docs/implementation-artifacts/2-4-primitive-zcard.md:115:- Preuves sortie initiales : `.zcard[data-v-…]{position:relative;overflow:hidden;background:var(--bg-card);color:var(--text-body);border:1px solid var(--border-subtle)…}` ; 4 modifiers `.zcard--{pad,interactive,accent,featured}` émis ; `color:var(--text-strong)` (titre body). Revue : usages migrés rendus en `as="article"` pour préserver la sémantique.
docs/implementation-artifacts/2-4-primitive-zcard.md:122:- **`featured`** : bordure via token `--accent-ring` (réf. `hsl(24 94% 53% / 0.35)` sans token exact ; `--accent-ring` = même teinte accent translucide, choix cohérent avec la revue 2.3 « tokens plutôt que valeurs hardcodées »).
docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/2-4-primitive-zcard.md:135:- `app/components/card/ZCardBody.vue` (MODIFIÉ) — restyle tokens, titre `--text-strong` (fix dark-first), padding `--space-4`.
app/components/HeaderComponent.vue:253:  border-bottom-color: var(--border-subtle);
app/components/HeaderComponent.vue:265:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/HeaderComponent.vue:266:  box-shadow: 0 0 10px var(--accent);
app/components/HeaderComponent.vue:308:    color: var(--text-strong);
app/components/HeaderComponent.vue:320:      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 70%, transparent));
app/components/HeaderComponent.vue:324:      color: var(--accent);
app/components/HeaderComponent.vue:328:      color: var(--text-body);
app/components/HeaderComponent.vue:358:  color: var(--text-body);
app/components/HeaderComponent.vue:370:    background: var(--accent);
app/components/HeaderComponent.vue:375:    color: var(--text-strong);
app/components/HeaderComponent.vue:393:  color: var(--text-strong);
app/components/HeaderComponent.vue:400:    color: var(--accent);
app/components/HeaderComponent.vue:415:  color: var(--accent);
app/components/HeaderComponent.vue:495:  color: var(--text-strong);
app/components/HeaderComponent.vue:498:  border: 1px solid var(--border-default);
app/components/HeaderComponent.vue:525:  border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue:563:    border-bottom: 1px solid var(--border-subtle);
app/components/HeaderComponent.vue:585:  color: var(--text-body);
app/components/HeaderComponent.vue:590:    color: var(--text-strong);
app/components/HeaderComponent.vue:602:  color: var(--accent);
docs/specs/spec-design-system-revamp/primitives.md:14:| Input | `components/core/Input.jsx` | `components/ui/ZInput.vue` | bordure `--border-default` → `--border-strong` au focus |
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:33:  - [x] Boutons primaires : l'orange s'éclaircit (`var(--accent)` → `var(--accent-hover)`). **Conforme** (`ZButton--primary:hover`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:34:  - [x] Liens : soulignement / bleu plus clair (`var(--link)`). **Conforme** (liens nav/footer → `--text-strong`/`--accent` ; liens prose/email → soulignement + `--term-blue`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:37:  - [x] Boutons : couleur active (`var(--accent-active)`) + léger nudge de ~1px vers le bas ; **pas** de scale-shrink, pas de rebond. **Conforme** (`ZButton--primary:active` : `--accent-active` + `translateY(1px)` ; secondary/danger : `translateY(1px)`). Aucun changement requis.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:42:  - [x] Les inputs renforcent leur bordure au focus (`--border-default` → `--border-strong`) conformément à `ZInput` (Epic 2 — story 2.6). **Conforme (focus plus fort que demandé)** : `ZInput:focus` pose `border-color: --accent` **+** ring `--accent-ring` (pattern DS README, plus prominent que `--border-strong`) ; `:hover` renforce déjà à `--border-strong`. Non régressé (n'aurait fait qu'affaiblir le focus).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:55:> **Pistes écartées après recoupement (dismiss)** : (1) « rayon des anneaux incohérent (nav/menu carrés vs brand/footer arrondis) » (Blind Hunter) — **faux positif** : `.hdr__link`/`.hdr__menu-link` portent déjà `border-radius` dans leur règle de base (`HeaderComponent.vue:256/389`), seuls brand/footer (base sans rayon) l'ajoutent → tous les anneaux arrondis. (2) « clipping de l'anneau par un ancêtre `overflow:hidden` » — infirmé : aucun `overflow:hidden` sur les ancêtres du header/nav/footer. (3) « tokens inexistants (`--ring-accent`/`--radius-sm`/`--radius-xs`) » — infirmé : tous définis (`_root.scss`), `--ring-accent` = la valeur box-shadow correcte (le `--accent-ring` couleur n'est pas utilisé en box-shadow). (4) « littéraux `2px` hardcodés » — dérogation a11y légitime (largeur/offset d'outline, pas de token DS dédié), pattern déjà établi (`contact.vue`/`about.vue`/`index.vue`). (5) « `.hdr__brand`/`.ftr__brand` pas focusables » — infirmé : vrais `<a>`/NuxtLink.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:68:- **Hover** : éclaircir la surface d'un cran (`--surface-2` → `--surface-3`) et/ou passer la bordure à `--border-strong` ; les boutons primaires éclaircissent l'orange (`--accent` → `--accent-hover`) ; les liens gagnent un soulignement / un bleu plus clair. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Hover states]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:69:- **Press** : se poser sur la couleur active (`--accent-active`) avec un nudge de ~1px vers le bas ; **pas de scale-shrink**. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Press states]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:70:- **Focus** : anneau visible via `--accent-ring` (`hsl(24 94% 53% / 0.45)`) ; `--border-strong` au focus pour bordures/inputs. [Source: docs/design_system/tokens/colors.css — `--accent-ring`, `--border-strong`]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:71:- **Bordures** : hairlines 1px solides — `--border-subtle` pour séparateurs/cartes, `--border-default` pour inputs, `--border-strong` au hover/focus. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Borders]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:77:- Tokens d'états disponibles : `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--accent-soft`, `--bg-card`, `--bg-elevated`, `--bg-input`, `--border-subtle`, `--border-default`, `--border-strong`, `--link`. [Source: docs/design_system/tokens/colors.css]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:90:- **Ne jamais** faire `outline: none` sans fournir un focus visible de remplacement (anneau via `--accent-ring`). Le focus clavier doit **toujours** rester visible (AC #2).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:105:- [Source: docs/design_system/tokens/colors.css — `--accent`, `--accent-hover`, `--accent-active`, `--accent-ring`, `--border-strong`]
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:118:- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:126:  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:130:- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
app/components/CurrentTime.vue:65:  color: var(--text-muted);
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:22:> Périmètre : **polices + base globale dark-first** (fond `--bg-page`, texte `--text-body`, familles par défaut). S'appuie sur les tokens de la **story 2.1** (CSS vars `--font-mono`, `--font-sans`, `--bg-page`, `--text-*`). Ne traite pas les primitives ni le châssis.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:31:  - [x] `html` + `body` sur fond sombre : `background: var(--bg-page)`, `color: var(--text-body)` ; famille par défaut `font-family: var(--font-sans)` (via `abstract/_typography.scss`).
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:39:  - [x] Fond sombre prouvé dans la sortie : `body,html{background:var(--bg-page)}` + `body{color:var(--text-body)}` ; **plus aucun `#fff` sur `body`** (plus de flash blanc). (Preuve par build `generate`, même compilation que `dev`.)
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:62:- **`assets/scss/base/_reset.scss`** (UPDATE) — état actuel : `body { background: #fff; }` (ligne ~1284). Remplacer par `background: var(--bg-page); color: var(--text-body);` (ou neutraliser dans une couche base dark-first).
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:110:- Preuves dans `.output/public` : `@font-face` `Ubuntu Mono` (4 styles) → `url(./UbuntuMono-*.ttf)` (ttf émis/fingerprintés) ; `body,html{background:var(--bg-page)}` + `body{color:var(--text-body)}` ; aucun `body{…#fff…}` ; `font-family:var(--font-sans)` sur body ; `h1…h6,label,legend{…--font-mono}` ; `index.html` contient `<link rel="preconnect">` + `…fonts.googleapis.com/css2?family=Ubuntu…&display=swap`.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:116:- **Base dark-first** : `base/_reset.scss` — `body { background: #fff }` legacy remplacé par `background: var(--bg-page)` (+ `html` pour couvrir overscroll/flash) et `color: var(--text-body)`.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:125:- `app/assets/scss/base/_reset.scss` (MODIFIÉ) — base dark-first `html`/`body` (`--bg-page`/`--text-body`), suppression du fond blanc.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:132:| 2026-06-19 | 0.1 | Polices (`@font-face "Ubuntu Mono"` + `<link>` Ubuntu sans) et base dark-first (`html`/`body` sur `--bg-page`/`--text-body`, corps `--font-sans`, titres/code `--font-mono`). Lint vert, `generate` vert, preuves dans la sortie. Status → review. | Amelia (dev-story) |
docs/design_system/README.md:92:  lit terminal rather than flat grey. **Ubuntu orange** (`--accent`,
docs/design_system/README.md:96:  the terminal body background (`--bg-terminal`, deep aubergine).
docs/design_system/README.md:120:  orange (`--accent` → `--accent-hover`). Links gain underline / brighter blue.
docs/design_system/README.md:121:- **Press states:** Settle to the active colour (`--accent-active`) and a
docs/design_system/README.md:123:- **Borders:** Hairlines do a lot of work in this dark UI. `--border-subtle`
docs/design_system/README.md:124:  for separators/cards, `--border-default` for inputs, `--border-strong` on
docs/design_system/README.md:137:- **Cards:** `--bg-card` fill, 1px `--border-subtle`, `--radius-md`,
app/components/FooterComponent.vue:75:  border-top: 1px solid var(--border-subtle);
app/components/FooterComponent.vue:117:    color: var(--text-strong);
app/components/FooterComponent.vue:121:    color: var(--text-muted);
app/components/FooterComponent.vue:136:  color: var(--text-body);
app/components/FooterComponent.vue:151:  color: var(--accent);
app/components/FooterComponent.vue:167:  color: var(--text-strong);
app/components/FooterComponent.vue:174:    color: var(--accent);
app/components/FooterComponent.vue:187:    color: var(--text-body);
app/components/FooterComponent.vue:191:      color: var(--text-body);
app/components/FooterComponent.vue:200:  border-top: 1px solid var(--border-default);
app/components/FooterComponent.vue:212:  color: var(--text-body);
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:92:  lit terminal rather than flat grey. **Ubuntu orange** (`--accent`,
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:96:  the terminal body background (`--bg-terminal`, deep aubergine).
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:120:  orange (`--accent` → `--accent-hover`). Links gain underline / brighter blue.
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:121:- **Press states:** Settle to the active colour (`--accent-active`) and a
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:123:- **Borders:** Hairlines do a lot of work in this dark UI. `--border-subtle`
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:124:  for separators/cards, `--border-default` for inputs, `--border-strong` on
docs/animations_jouan.ovh/_ds/jouan-ovh-design-system-c7aa284a-3ed2-49dc-937c-3be39595a71d/README.md:137:- **Cards:** `--bg-card` fill, 1px `--border-subtle`, `--radius-md`,
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:18:- **Architecture technique sous-jacente :** Nuxt 4 SSG (génération statique), Vue 3 (`<script setup lang="ts">`), SCSS Dark-first avec variables CSS sur `:root` et surcharge via l'attribut HTML racine `[data-theme="light"]` / `[data-theme="dark"]`.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:71:- `<html data-theme="dark">` ou `<html data-theme="light">`
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:72:- Si `themePreference === 'system'`, un attribut complémentaire `data-theme-source="system"` est présent pour permettre le stylage fin de l'indicateur d'état.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:96:      document.documentElement.setAttribute('data-theme', resolved);
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:97:      document.documentElement.setAttribute('data-theme-source', pref);
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:101:- Dès que le DOM commence à peindre, `data-theme` est positionné, évitant tout clignotement.
docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md:104:Quand `themePreference === 'system'`, un listener sur `window.matchMedia('(prefers-color-scheme: dark)')` met à jour automatiquement `data-theme` si l'utilisateur bascule son OS du mode jour au mode nuit (ou inversement via programmation horaire de son système d'exploitation).
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:19:1. **Given** les références `Input.jsx` et `Avatar.jsx`, **When** on crée `ZInput.vue` (bordure `--border-default` → `--border-strong` au focus) et `ZAvatar.vue` (radius pill), **Then** ils rendent conformément aux références et stylent via tokens.

exec
/bin/zsh -lc "sed -n '1,280p' app/assets/scss/abstract/_root.scss; rg -l --glob '*.vue' --glob '*.scss' 'class=\"["'^"]*(terminal|hero-term|home-hero-terminal)'"' app | sort; rg -n --glob '*.vue' --glob '*.scss' 'bg-terminal|terminal-window|hero-term|home-hero-terminal' app/components app/pages app/assets/scss" in /Users/simon/dev/jouan.ovh
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
app/components/HeaderComponent.vue
app/components/home/HomeHeroTerminal.vue
app/components/terminal/TerminalComponent.vue
app/pages/blog/[...slug].vue:314:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:423:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/pages/contact/index.vue:526:  background: var(--bg-terminal);
app/components/ui/ZButton.vue:308:  background: var(--bg-terminal);
app/assets/scss/abstract/_root.scss:76:  --bg-terminal: var(--aubergine-deep);
app/assets/scss/abstract/_root.scss:243:.home-hero-terminal,
app/assets/scss/abstract/_root.scss:244:.hero-term,
app/assets/scss/abstract/_root.scss:245:.terminal-window,
app/assets/scss/abstract/_root.scss:247:  --bg-terminal: hsl(319deg 100% 9%);
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
app/components/home/HomeHeroTerminal.vue:324:  background: var(--bg-terminal);
app/components/home/HomeHeroTerminal.vue:329:  .hero-term__body {
app/components/home/HomeHeroTerminal.vue:330:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/home/HomeHeroTerminal.vue:335:.hero-term__line {
app/components/home/HomeHeroTerminal.vue:339:.hero-term__out {
app/components/home/HomeHeroTerminal.vue:343:.hero-term__out--ink {
app/components/home/HomeHeroTerminal.vue:347:.hero-term__out--blue {
app/components/home/HomeHeroTerminal.vue:351:.hero-term__out--green {
app/components/home/HomeHeroTerminal.vue:355:.hero-term__open {

exec
/bin/zsh -lc "rg -n --glob '*.vue' --glob '*.scss' --glob '*.ts' 'var\\(--(surface|ink|line|orange|aubergine|shadow-4|glow|accent-hover|accent-active|accent-text|accent-2|accent-2-soft|link|prompt|success|warning|danger|info)' app | head -n 240; sed -n '250,370p' app/components/home/HomeHeroTerminal.vue; sed -n '400,530p' app/components/terminal/TerminalComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:260:    color: var(--link);
app/pages/about.vue:286:  background: var(--surface-1);
app/pages/about.vue:394:  background: var(--surface-0);
app/pages/blog/[...slug].vue:280:    color: var(--link);
app/pages/blog/[...slug].vue:405:  background: var(--surface-1);
app/pages/services.vue:453:    color: var(--accent-hover);
app/pages/contact/card.vue:146:  background: color-mix(in srgb, var(--surface-2) 85%, transparent);
app/pages/contact/card.vue:213:  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
app/pages/contact/card.vue:214:  border: 1px solid color-mix(in srgb, var(--line-subtle) 80%, transparent);
app/pages/contact/card.vue:222:    background: var(--surface-3);
app/pages/contact/index.vue:415:  color: var(--danger);
app/pages/contact/index.vue:527:  border-color: var(--accent-2-soft);
app/pages/index.vue:521:  text-shadow: 0 2px 14px color-mix(in srgb, var(--surface-0) 80%, transparent);
app/pages/index.vue:536:  text-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
app/pages/index.vue:569:      color: var(--accent-hover);
app/pages/index.vue:584:  background: var(--success);
app/pages/index.vue:585:  box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:595:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 60%, transparent);
app/pages/index.vue:599:    box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:603:    box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 0%, transparent);
app/pages/index.vue:832:  background: var(--surface-0);
app/pages/index.vue:856:    var(--surface-0);
app/pages/index.vue:870:  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
app/pages/index.vue:890:  background: var(--surface-2);
app/pages/index.vue:1003:  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
app/pages/index.vue:1193:    color-mix(in srgb, var(--surface-1) 85%, transparent);
app/components/HeaderComponent.vue:252:  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
app/components/HeaderComponent.vue:265:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/HeaderComponent.vue:294:    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/HeaderComponent.vue:433:      var(--glow-terminal);
app/components/HeaderComponent.vue:562:    background: var(--surface-1);
app/components/HeaderComponent.vue:591:    background: var(--surface-2);
app/components/HexagonLinkComponent.vue:28:  background: var(--surface-3);
app/components/HexagonLinkComponent.vue:36:    color: var(--ink-on-accent);
app/components/FooterComponent.vue:74:  background: var(--surface-1);
app/components/FooterComponent.vue:110:    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/home/HomeAtmosComponent.vue:378:  background-color: var(--surface-0);
app/components/home/HomeAtmosComponent.vue:382:  background-color: var(--surface-0);
app/components/home/HomeAtmosComponent.vue:385:    radial-gradient(at 21% 68%, var(--accent-2-soft) 0, transparent 62%);
app/components/home/HomeAtmosComponent.vue:400:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 8%, transparent) 1px, transparent 1px);
app/components/home/HomeAtmosComponent.vue:402:  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
app/components/home/HomeAtmosComponent.vue:409:    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 70%, transparent) 0%, transparent 130px),
app/components/home/HomeAtmosComponent.vue:410:    radial-gradient(ellipse 120% 88% at 50% 12%, transparent 30%, var(--surface-0) 90%);
app/assets/scss/abstract/_root.scss:71:  --bg-page: var(--surface-0);
app/assets/scss/abstract/_root.scss:72:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:73:  --bg-card: var(--surface-2);
app/assets/scss/abstract/_root.scss:74:  --bg-elevated: var(--surface-3);
app/assets/scss/abstract/_root.scss:75:  --bg-input: var(--surface-4);
app/assets/scss/abstract/_root.scss:76:  --bg-terminal: var(--aubergine-deep);
app/assets/scss/abstract/_root.scss:77:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:78:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:79:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:80:  --text-faint: var(--ink-4);
app/assets/scss/abstract/_root.scss:81:  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss:82:  --border-default: var(--line);
app/assets/scss/abstract/_root.scss:83:  --border-strong: var(--line-strong);
app/assets/scss/abstract/_root.scss:84:  --accent: var(--orange-500);
app/assets/scss/abstract/_root.scss:86:  --accent-active: var(--orange-600);
app/assets/scss/abstract/_root.scss:87:  --accent-text: var(--ink-on-accent);
app/assets/scss/abstract/_root.scss:90:  --accent-2: var(--aubergine-light); // accent secondaire
app/assets/scss/abstract/_root.scss:248:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:249:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:250:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:251:  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss:252:  --border-default: var(--line);
app/components/ui/ZButton.vue:268:  color: var(--accent-text);
app/components/ui/ZButton.vue:270:  box-shadow: var(--glow-accent);
app/components/ui/ZButton.vue:273:    background: var(--accent-hover);
app/components/ui/ZButton.vue:274:    border-color: var(--accent-hover);
app/components/ui/ZButton.vue:279:    background: var(--accent-active);
app/components/ui/ZButton.vue:280:    border-color: var(--accent-active);
app/components/ui/ZButton.vue:285:  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
app/components/ui/ZButton.vue:291:    background: var(--surface-3);
app/components/ui/ZButton.vue:302:    background: var(--surface-2);
app/components/ui/ZButton.vue:310:  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
app/components/ui/ZButton.vue:317:      var(--glow-terminal);
app/components/ui/ZButton.vue:322:  background: var(--danger);
app/components/ui/ZButton.vue:323:  color: var(--ink-on-accent);
app/components/ui/ZButton.vue:324:  border-color: var(--danger);
app/components/home/HomeBootOverlay.vue:182:  background: var(--surface-0);
app/components/home/HomeBootOverlay.vue:230:  background: var(--surface-3);
app/components/home/HomeBootOverlay.vue:237:    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/ui/ZBadge.vue:54:  background: var(--surface-3);
app/components/ui/ZBadge.vue:66:  background: var(--success-soft);
app/components/ui/ZBadge.vue:67:  color: var(--success);
app/components/ui/ZBadge.vue:72:  background: var(--warning-soft);
app/components/ui/ZBadge.vue:73:  color: var(--warning);
app/components/ui/ZBadge.vue:78:  background: var(--danger-soft);
app/components/ui/ZBadge.vue:79:  color: var(--danger);
app/components/ui/ZBadge.vue:84:  background: var(--info-soft);
app/components/ui/ZBadge.vue:85:  color: var(--info);
app/components/home/HomeHeroTerminal.vue:264:  border: 1px solid var(--accent-2-soft);
app/components/home/HomeHeroTerminal.vue:266:  box-shadow: var(--glow-terminal);
app/components/home/HomeHeroTerminal.vue:277:  background: var(--aubergine-black);
app/components/home/HomeHeroTerminal.vue:323:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:344:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:379:  color: var(--prompt);
app/components/home/HomeHeroTerminal.vue:383:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:392:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:401:  background: var(--prompt);
app/components/ui/ZAvatar.vue:74:  background: var(--surface-3);
app/components/terminal/TerminalComponent.vue:339:  color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:342:  box-shadow: var(--glow-terminal);
app/components/terminal/TerminalComponent.vue:353:    background: var(--aubergine-black);
app/components/terminal/TerminalComponent.vue:439:      color: var(--prompt);
app/components/terminal/TerminalComponent.vue:445:      color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:469:      caret-color: var(--prompt);
app/components/terminal/TerminalComponent.vue:491:      background: var(--aubergine);
app/components/ui/ZTag.vue:121:  background: var(--surface-2);
app/components/ui/ZCard.vue:176:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/ui/ZCard.vue:181:  box-shadow: var(--glow-accent), var(--shadow-hairline);
app/components/ui/ZCustomCursor.vue:175:  background: var(--ink-1);
app/components/ui/ZCustomCursor.vue:181:  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
app/components/ui/ZInput.vue:195:    border-color: var(--danger);
app/components/ui/ZInput.vue:199:    color: var(--danger);
  if (stepTimeoutId !== null) {
    clearTimeout(stepTimeoutId);
    stepTimeoutId = null;
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.hero-term {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  overflow: hidden;
  border: 1px solid var(--accent-2-soft);
  border-radius: var(--radius-sm);
  box-shadow: var(--glow-terminal);
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
      width: 10px;
    }

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown -- pseudo-élément vendeur WebKit (scrollbar), non câblé par autoprefixer */
    &::-webkit-scrollbar-thumb {
      background: var(--aubergine);
      border-radius: var(--radius-pill);
    }
  }

  // Corps translucide + flou aubergine derrière (porté de .ds-term__body, derrière @supports).
  @supports (backdrop-filter: blur(5px)) or (-webkit-backdrop-filter: blur(5px)) {
    .terminal-body {
      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
      /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
    }
  }

  .resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    background-color: transparent;
    cursor: nwse-resize;
  }
}

table,
.table {
  --color-light: hsl(0deg 0% 92% / 100%);
  --color-dark: hsl(0deg 0% 8% / 100%);
  --color-grey-light: hsl(0deg 0% 68%);
  --margin: 1em;

  border: 1px dashed var(--color-light);
  margin: var(--margin);

  thead {
    color: var(--color-dark);
    text-align: center;
    background-color: var(--color-light);

exec
/bin/zsh -lc "sed -n '1,35p' app/components/terminal/TerminalComponent.vue; rg -n 'home-hero-terminal|terminal-window|class=\"terminal\"|class=\"terminal ' app || true; nl -ba app/assets/scss/abstract/_root.scss | sed -n '202,270p'; nl -ba docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md | sed -n '145,190p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
app/assets/scss/abstract/_root.scss:243:.home-hero-terminal,
app/assets/scss/abstract/_root.scss:245:.terminal-window,
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
   202	  --ease-standard: ease-in-out;
   203	}
   204	
   205	// ============================================================
   206	//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
   207	// ============================================================
   208	[data-theme="light"] {
   209	  // Surfaces claires
   210	  --bg-page: hsl(38deg 25% 97%);
   211	  --bg-sunken: hsl(38deg 20% 93%);
   212	  --bg-card: hsl(0deg 0% 100%);
   213	  --bg-elevated: hsl(38deg 30% 99%);
   214	  --bg-input: hsl(38deg 15% 95%);
   215	
   216	  // Encres aubergine (contrastes WCAG AAA)
   217	  --text-strong: hsl(320deg 30% 12%);
   218	  --text-body: hsl(320deg 18% 26%);
   219	  --text-muted: hsl(320deg 10% 44%);
   220	  --text-faint: hsl(320deg 8% 58%);
   221	  --ink-on-accent: hsl(0deg 0% 100%);
   222	
   223	  // Bordures douces
   224	  --border-subtle: hsl(35deg 15% 88%);
   225	  --border-default: hsl(35deg 12% 80%);
   226	  --border-strong: hsl(35deg 12% 68%);
   227	
   228	  // Accent & sélections
   229	  --accent: hsl(24deg 95% 44%);
   230	  --accent-soft: hsl(24deg 94% 53% / 10%);
   231	  --accent-ring: hsl(24deg 94% 53% / 35%);
   232	  --selection: hsl(24deg 94% 53% / 22%);
   233	  --overlay: hsl(320deg 30% 10% / 40%);
   234	
   235	  // Ombres adaptées
   236	  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
   237	  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
   238	  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
   239	  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
   240	}
   241	
   242	// Sanctuarisation absolue du terminal sombre
   243	.home-hero-terminal,
   244	.hero-term,
   245	.terminal-window,
   246	.terminal {
   247	  --bg-terminal: hsl(319deg 100% 9%);
   248	  --text-strong: var(--ink-1);
   249	  --text-body: var(--ink-2);
   250	  --text-muted: var(--ink-3);
   251	  --border-subtle: var(--line-subtle);
   252	  --border-default: var(--line);
   253	  --border-terminal: hsl(319deg 40% 30% / 40%);
   254	}
   255	
   256	::selection {
   257	  background: var(--selection);
   258	}
   259	
   260	// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
   261	@keyframes caret-blink {
   262	  0%,
   263	  49% {
   264	    opacity: 1;
   265	  }
   266	
   267	  50%,
   268	  100% {
   269	    opacity: 0;
   270	  }
   145	.terminal {
   146	  --bg-terminal: hsl(319deg 100% 9%);
   147	  --text-strong: var(--ink-1);
   148	  --text-body: var(--ink-2);
   149	  --text-muted: var(--ink-3);
   150	  --border-subtle: var(--line-subtle);
   151	  --border-default: var(--line);
   152	  --border-terminal: hsl(319deg 40% 30% / 40%);
   153	}
   154	```
   155	
   156	## Dev Agent Record
   157	
   158	### Agent Model Used
   159	
   160	Gemini 3.7 Flash (Medium)
   161	
   162	### Debug Log References
   163	
   164	- Validation Gate Docker exécutée avec succès (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
   165	- 0 erreur ESLint, 0 erreur Stylelint.
   166	- 24 routes SSG pré-rendues sans anomalie.
   167	
   168	### Completion Notes List
   169	
   170	- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
   171	- Redéfinition des alias sémantiques de surfaces (`--bg-page`, `--bg-sunken`, `--bg-card`, `--bg-elevated`, `--bg-input`), encres aubergine WCAG AAA (`--text-strong`, `--text-body`, `--text-muted`, `--text-faint`, `--ink-on-accent`), bordures chaudes, ombres et accents orange contrastés.
   172	- Sanctuarisation stricte des composants terminaux (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`) avec préservation du fond sombre, encres claires et bordures terminales.
   173	
   174	### File List
   175	- `app/assets/scss/abstract/_root.scss`

codex
- Le mode clair ne surcharge que les alias sémantiques, alors que de nombreux composants utilisent directement `--surface-*`, `--ink-*`, `--line-*`, `--aubergine-*` et `--success`/`--danger`; une grande partie de l’interface restera donc sombre.

- `HomeAtmosComponent`, le header, le footer et plusieurs pages utilisent directement les surfaces sombres, ce qui empêche le thème clair d’être réellement appliqué à l’ensemble du site.

- Les tokens d’état `--accent-hover`, `--accent-active`, `--accent-2`, `--accent-2-soft`, `--link` et `--prompt` ne sont pas adaptés au thème clair et conservent leurs valeurs prévues pour le fond sombre.

- Les tokens sémantiques `--success`, `--warning`, `--danger`, `--info` et leurs variantes soft ne sont pas redéfinis, ce qui peut produire des contrastes insuffisants sur les nouvelles surfaces claires.

- La valeur `--text-faint: hsl(320deg 8% 58%)` n’est pas compatible avec l’affirmation « WCAG AAA » sur un fond blanc et risque d’être insuffisante pour du texte normal.

- La conformité WCAG annoncée n’est accompagnée d’aucun calcul de contraste, test automatisé ou preuve par couple texte/fond.

- L’accent clair est déclaré à `hsl(24deg 95% 44%)`, mais les états hover et actif utilisent encore des oranges sombres non vérifiés sur fond clair.

- La « sanctuarisation » du terminal ne réinitialise pas `--accent`, `--accent-hover`, `--accent-ring`, `--accent-2`, `--link`, `--prompt`, `--glow-terminal` ni les tokens sémantiques d’état ; le terminal peut donc encore hériter de couleurs du thème clair.

- Le sélecteur `.home-hero-terminal` ne correspond à aucun élément trouvé dans l’application et ne protège donc rien.

- Le sélecteur `.terminal-window` ne correspond à aucun élément trouvé dans l’application et constitue une promesse de protection non vérifiée.

- Le composant `HomeHeroTerminal` utilise de nombreux tokens bruts (`--aubergine-black`, `--ink-1`, `--prompt`, `--accent-2-soft`) qui ne sont pas couverts par la surcharge locale annoncée.

- La protection du terminal repose sur des valeurs de couleur hardcodées dans la section de sanctuarisation, alors que la règle du projet exige de centraliser les couleurs via les tokens existants.

- Les variables `--shadow-4`, `--glow-accent` et `--glow-terminal` ne sont pas adaptées au thème clair ; leurs ombres opaques restent calibrées pour des surfaces sombres.

- Le diff ne modifie aucun composant de thème, aucun attribut `data-theme` et aucun script anti-FOUC ; il ne permet donc pas de vérifier que la surcharge sera effectivement appliquée en production.

- La tâche affirme qu’un test visuel a été effectué, mais le diff ne fournit ni capture, ni procédure reproductible, ni vérification desktop/mobile.

- Le journal affirme que la gate complète Docker a réussi, alors que les sous-tâches visibles ne mentionnent explicitement que `pnpm lint`, ce qui ne permet pas de relier la preuve aux commandes `typecheck` et `generate`.

- L’affirmation « 24 routes SSG pré-rendues » contredit la documentation du projet qui décrit 13 routes statiques, sans expliquer le changement de périmètre.

- Le fichier `sprint-status.yaml` et le document de story sont modifiés mais absents de la section `File List`, ce qui rend l’inventaire de livraison incomplet.

- Le document marque toutes les sous-tâches comme terminées sans preuve que les sélecteurs `.home-hero-terminal` et `.terminal-window` existent réellement dans le DOM.

- Aucun test ne vérifie le rendu lorsque le thème clair est appliqué sur les pages `/about`, `/contact`, `/blog` et les composants d’ambiance, malgré leur utilisation directe de tokens sombres.
tokens used
44 300
- Le mode clair ne surcharge que les alias sémantiques, alors que de nombreux composants utilisent directement `--surface-*`, `--ink-*`, `--line-*`, `--aubergine-*` et `--success`/`--danger`; une grande partie de l’interface restera donc sombre.

- `HomeAtmosComponent`, le header, le footer et plusieurs pages utilisent directement les surfaces sombres, ce qui empêche le thème clair d’être réellement appliqué à l’ensemble du site.

- Les tokens d’état `--accent-hover`, `--accent-active`, `--accent-2`, `--accent-2-soft`, `--link` et `--prompt` ne sont pas adaptés au thème clair et conservent leurs valeurs prévues pour le fond sombre.

- Les tokens sémantiques `--success`, `--warning`, `--danger`, `--info` et leurs variantes soft ne sont pas redéfinis, ce qui peut produire des contrastes insuffisants sur les nouvelles surfaces claires.

- La valeur `--text-faint: hsl(320deg 8% 58%)` n’est pas compatible avec l’affirmation « WCAG AAA » sur un fond blanc et risque d’être insuffisante pour du texte normal.

- La conformité WCAG annoncée n’est accompagnée d’aucun calcul de contraste, test automatisé ou preuve par couple texte/fond.

- L’accent clair est déclaré à `hsl(24deg 95% 44%)`, mais les états hover et actif utilisent encore des oranges sombres non vérifiés sur fond clair.

- La « sanctuarisation » du terminal ne réinitialise pas `--accent`, `--accent-hover`, `--accent-ring`, `--accent-2`, `--link`, `--prompt`, `--glow-terminal` ni les tokens sémantiques d’état ; le terminal peut donc encore hériter de couleurs du thème clair.

- Le sélecteur `.home-hero-terminal` ne correspond à aucun élément trouvé dans l’application et ne protège donc rien.

- Le sélecteur `.terminal-window` ne correspond à aucun élément trouvé dans l’application et constitue une promesse de protection non vérifiée.

- Le composant `HomeHeroTerminal` utilise de nombreux tokens bruts (`--aubergine-black`, `--ink-1`, `--prompt`, `--accent-2-soft`) qui ne sont pas couverts par la surcharge locale annoncée.

- La protection du terminal repose sur des valeurs de couleur hardcodées dans la section de sanctuarisation, alors que la règle du projet exige de centraliser les couleurs via les tokens existants.

- Les variables `--shadow-4`, `--glow-accent` et `--glow-terminal` ne sont pas adaptées au thème clair ; leurs ombres opaques restent calibrées pour des surfaces sombres.

- Le diff ne modifie aucun composant de thème, aucun attribut `data-theme` et aucun script anti-FOUC ; il ne permet donc pas de vérifier que la surcharge sera effectivement appliquée en production.

- La tâche affirme qu’un test visuel a été effectué, mais le diff ne fournit ni capture, ni procédure reproductible, ni vérification desktop/mobile.

- Le journal affirme que la gate complète Docker a réussi, alors que les sous-tâches visibles ne mentionnent explicitement que `pnpm lint`, ce qui ne permet pas de relier la preuve aux commandes `typecheck` et `generate`.

- L’affirmation « 24 routes SSG pré-rendues » contredit la documentation du projet qui décrit 13 routes statiques, sans expliquer le changement de périmètre.

- Le fichier `sprint-status.yaml` et le document de story sont modifiés mais absents de la section `File List`, ce qui rend l’inventaire de livraison incomplet.

- Le document marque toutes les sous-tâches comme terminées sans preuve que les sélecteurs `.home-hero-terminal` et `.terminal-window` existent réellement dans le DOM.

- Aucun test ne vérifie le rendu lorsque le thème clair est appliqué sur les pages `/about`, `/contact`, `/blog` et les composants d’ambiance, malgré leur utilisation directe de tokens sombres.

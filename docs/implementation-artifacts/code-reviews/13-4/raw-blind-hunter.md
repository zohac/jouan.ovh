Reading prompt from stdin...
2026-09-18T15:55:14.294672Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b53a-a5d1-7e11-9422-80037013e546
--------
user
# Blind Hunter Prompt — Story 13.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/13-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find all issues to fix or improve in the provided content (CSS scoping, selector specificity, asset handling, regression risks, token completeness). Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec un biais volontairement sceptique, puis je fournirai uniquement une liste Markdown de constats, sans classement.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/13-4/full.diff" in /Users/simon/dev/jouan.ovh
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
index aa40e8f..7a11d66 100644
--- a/app/assets/scss/abstract/_root.scss
+++ b/app/assets/scss/abstract/_root.scss
@@ -206,54 +206,95 @@
 //  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
 // ============================================================
 [data-theme="light"] {
-  // Surfaces claires
-  --bg-page: hsl(38deg 25% 97%);
-  --bg-sunken: hsl(38deg 20% 93%);
-  --bg-card: hsl(0deg 0% 100%);
-  --bg-elevated: hsl(38deg 30% 99%);
-  --bg-input: hsl(38deg 15% 95%);
-
-  // Encres aubergine (contrastes WCAG AAA)
-  --text-strong: hsl(320deg 30% 12%);
-  --text-body: hsl(320deg 18% 26%);
-  --text-muted: hsl(320deg 10% 44%);
-  --text-faint: hsl(320deg 8% 58%);
+  // ---- Rampe de surfaces neutres primitives ----
+  --surface-0: hsl(38deg 25% 97%);
+  --surface-1: hsl(38deg 20% 93%);
+  --surface-2: hsl(0deg 0% 100%);
+  --surface-3: hsl(38deg 30% 99%);
+  --surface-4: hsl(38deg 15% 95%);
+
+  // ---- Bordures / hairlines primitives ----
+  --line-subtle: hsl(35deg 15% 88%);
+  --line: hsl(35deg 12% 80%);
+  --line-strong: hsl(35deg 12% 68%);
+
+  // ---- Texte encres primitives (contrastes WCAG AAA) ----
+  --ink-1: hsl(320deg 30% 12%);
+  --ink-2: hsl(320deg 18% 26%);
+  --ink-3: hsl(320deg 10% 44%);
+  --ink-4: hsl(320deg 8% 58%);
   --ink-on-accent: hsl(0deg 0% 100%);
 
-  // Bordures douces
-  --border-subtle: hsl(35deg 15% 88%);
-  --border-default: hsl(35deg 12% 80%);
-  --border-strong: hsl(35deg 12% 68%);
+  // ---- Alias sémantiques ----
+  --bg-page: var(--surface-0);
+  --bg-sunken: var(--surface-1);
+  --bg-card: var(--surface-2);
+  --bg-elevated: var(--surface-3);
+  --bg-input: var(--surface-4);
+  --text-strong: var(--ink-1);
+  --text-body: var(--ink-2);
+  --text-muted: var(--ink-3);
+  --text-faint: var(--ink-4);
+  --accent-text: var(--ink-on-accent);
+  --border-subtle: var(--line-subtle);
+  --border-default: var(--line);
+  --border-strong: var(--line-strong);
 
-  // Accent & sélections
+  // ---- Accentuation & interactions ----
   --accent: hsl(24deg 95% 44%);
+  --accent-hover: hsl(24deg 95% 48%);
+  --accent-active: hsl(24deg 95% 40%);
   --accent-soft: hsl(24deg 94% 53% / 10%);
   --accent-ring: hsl(24deg 94% 53% / 35%);
+  --accent-2: hsl(319deg 33% 40%);
+  --accent-2-soft: hsl(319deg 40% 40% / 15%);
   --selection: hsl(24deg 94% 53% / 22%);
   --overlay: hsl(320deg 30% 10% / 40%);
 
-  // Ombres adaptées
+  // ---- Ombres adaptées ----
   --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
   --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
   --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
   --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
 }
 
+/* stylelint-disable selector-class-pattern -- sanctuarisation classes terminal et blocs code */
 // Sanctuarisation absolue du terminal sombre
 .home-hero-terminal,
 .hero-term,
 .terminal-window,
-.terminal {
+.terminal,
+.contact__term,
+pre {
+  --surface-0: hsl(320deg 30% 6%);
+  --surface-1: hsl(319deg 22% 9%);
+  --surface-2: hsl(318deg 18% 12%);
+  --surface-3: hsl(317deg 16% 16%);
+  --surface-4: hsl(316deg 14% 21%);
+  --ink-1: hsl(30deg 18% 95%);
+  --ink-2: hsl(28deg 10% 74%);
+  --ink-3: hsl(25deg 7% 54%);
+  --ink-4: hsl(22deg 6% 40%);
+  --line-subtle: hsl(316deg 14% 18%);
+  --line: hsl(315deg 12% 25%);
+  --line-strong: hsl(314deg 11% 34%);
+  --bg-page: var(--surface-0);
+  --bg-sunken: var(--surface-1);
+  --bg-card: var(--surface-2);
+  --bg-elevated: var(--surface-3);
+  --bg-input: var(--surface-4);
   --bg-terminal: var(--aubergine-deep);
-  --text-strong: var(--ink-1);
-  --text-body: var(--ink-2);
-  --text-muted: var(--ink-3);
-  --border-subtle: var(--line-subtle);
-  --border-default: var(--line);
+  --text-strong: hsl(30deg 18% 95%);
+  --text-body: hsl(28deg 10% 74%);
+  --text-muted: hsl(25deg 7% 54%);
+  --text-faint: hsl(22deg 6% 40%);
+  --border-subtle: hsl(316deg 14% 18%);
+  --border-default: hsl(315deg 12% 25%);
   --border-terminal: hsl(319deg 40% 30% / 40%);
   --accent: var(--orange-500);
   --selection: hsl(24deg 94% 53% / 30%);
 }
+/* stylelint-enable selector-class-pattern */
 
 ::selection {
   background: var(--selection);
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index 1a4a3d6..4054aa5 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -108,6 +108,10 @@ const year = new Date().getFullYear();
     height: 22px;
     object-fit: contain;
     filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
+
+    :global([data-theme="light"]) & {
+      filter: invert(1) drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
+    }
   }
 
   b {
diff --git a/app/components/HeaderComponent.vue b/app/components/HeaderComponent.vue
index 5b26f82..a883d04 100644
--- a/app/components/HeaderComponent.vue
+++ b/app/components/HeaderComponent.vue
@@ -297,6 +297,10 @@ onBeforeUnmount(() => {
     transition:
       transform var(--dur-base) var(--ease-standard),
       filter var(--dur-base) var(--ease-standard);
+
+    :global([data-theme="light"]) & {
+      filter: invert(1) drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
+    }
   }
 
   .hdr__brand-text {
diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
index 849cfc4..4d59728 100644
--- a/app/components/home/HomeAtmosComponent.vue
+++ b/app/components/home/HomeAtmosComponent.vue
@@ -394,6 +394,10 @@ onBeforeUnmount(() => {
   opacity: 0.52;
 }
 
+:global([data-theme="light"]) .atmos__canvas {
+  opacity: 0.18;
+}
+
 .grid-dots {
   position: absolute;
   inset: 0;
diff --git a/docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md b/docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md
index 391ca23..14d47b8 100644
--- a/docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md
+++ b/docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md
@@ -4,7 +4,7 @@ baseline_commit: 08e08fe191517a257c8b3b5d7be17d8b78d7b19d
 
 # Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -64,36 +64,36 @@ so that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régr
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Complétion des tokens primitifs et sémantiques dans `app/assets/scss/abstract/_root.scss` (AC: 1)
-  - [ ] Ajouter la surcharge complète des variables primitives `--surface-0` à `--surface-4`, `--ink-1` à `--ink-4`, `--line-subtle`, `--line`, `--line-strong`, `--accent-hover`, `--accent-active` sous `[data-theme="light"]`.
-  - [ ] Vérifier que `--text-shadow` ou ombres textuelles éventuelles s'adaptent ou s'effacent proprement sur fond clair.
-  - [ ] Valider l'absence de régression sur la sanctuarisation du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`).
+- [x] Tâche 1 — Complétion des tokens primitifs et sémantiques dans `app/assets/scss/abstract/_root.scss` (AC: 1)
+  - [x] Ajouter la surcharge complète des variables primitives `--surface-0` à `--surface-4`, `--ink-1` à `--ink-4`, `--line-subtle`, `--line`, `--line-strong`, `--accent-hover`, `--accent-active` sous `[data-theme="light"]`.
+  - [x] Vérifier que `--text-shadow` ou ombres textuelles éventuelles s'adaptent ou s'effacent proprement sur fond clair.
+  - [x] Valider l'absence de régression sur la sanctuarisation du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`, `.contact__term`, `pre`).
 
-- [ ] Tâche 2 — Adaptation et calibration de l'atmosphère d'ambiance dans `app/components/home/HomeAtmosComponent.vue` (AC: 2)
-  - [ ] Ajouter une règle d'opacité conditionnelle pour `.atmos__canvas` en mode clair :
+- [x] Tâche 2 — Adaptation et calibration de l'atmosphère d'ambiance dans `app/components/home/HomeAtmosComponent.vue` (AC: 2)
+  - [x] Ajouter une règle d'opacité conditionnelle pour `.atmos__canvas` en mode clair :
     ```scss
     :global([data-theme="light"]) .atmos__canvas {
       opacity: 0.18;
     }
     ```
-  - [ ] Adapter le repli `.atmos--fallback` pour le mode clair.
-  - [ ] Vérifier que les masques `.grid-dots` et `.vignette` restent fluides et sans bordure dure sous les deux thèmes.
-
-- [ ] Tâche 3 — Audit visuel transverse multi-pages et ajustements de polissage (AC: 3, AC: 4)
-  - [ ] Tester visuellement la page d'accueil (`/`) en mode sombre et clair (desktop et mobile).
-  - [ ] Tester visuellement la page Services (`/services`) et la grille de process.
-  - [ ] Tester visuellement la page À propos (`/about`), les blocs de CV et l'inspecteur terminal.
-  - [ ] Tester visuellement la page Contact (`/contact`), les inputs de formulaire et `/contact/card`.
-  - [ ] Tester visuellement la page Blog (`/blog` et vue article markdown).
-  - [ ] Vérifier la persistance `localStorage` et l'absence totale de FOUC au rechargement.
-
-- [ ] Tâche 4 — Validation qualité Docker & certification SSG (AC: 5)
-  - [ ] Exécuter la suite complète dans Docker :
+  - [x] Adapter le repli `.atmos--fallback` pour le mode clair.
+  - [x] Vérifier que les masques `.grid-dots` et `.vignette` restent fluides et sans bordure dure sous les deux thèmes.
+
+- [x] Tâche 3 — Audit visuel transverse multi-pages et ajustements de polissage (AC: 3, AC: 4)
+  - [x] Tester visuellement la page d'accueil (`/`) en mode sombre et clair (desktop et mobile).
+  - [x] Tester visuellement la page Services (`/services`) et la grille de process.
+  - [x] Tester visuellement la page À propos (`/about`), les blocs de CV et l'inspecteur terminal.
+  - [x] Tester visuellement la page Contact (`/contact`), les inputs de formulaire et `/contact/card`.
+  - [x] Tester visuellement la page Blog (`/blog` et vue article markdown).
+  - [x] Vérifier la persistance `localStorage` et l'absence totale de FOUC au rechargement.
+
+- [x] Tâche 4 — Validation qualité Docker & certification SSG (AC: 5)
+  - [x] Exécuter la suite complète dans Docker :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```
-  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
-  - [ ] Réaliser une capture ou revue visuelle comparative sur navigateur (desktop et mobile).
+  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
+  - [x] Réaliser une capture ou revue visuelle comparative sur navigateur (desktop et mobile).
 
 ## Dev Notes
 
@@ -119,12 +119,27 @@ so that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régr
 ## Dev Agent Record
 
 ### Agent Model Used
+Gemini 3.7 Flash
 
 ### Debug Log References
+- Gate Docker 100% verte : ESLint 0 erreur, Stylelint 0 erreur, vue-tsc 0 erreur, Nitro SSG 24 routes statiques pré-rendues.
+- HTTP 200 vérifié sur toutes les routes clés (`/`, `/services`, `/about`, `/contact`, `/contact/card`, `/blog`, `/confidentialite`, `/mentions-legales`).
 
 ### Completion Notes List
+- Surcharge complète des tokens primitifs `--surface-0` à `--surface-4`, `--ink-1` à `--ink-4`, `--line-subtle`, `--line`, `--line-strong`, `--accent-hover`, `--accent-active` sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
+- Sanctuarisation étendue du terminal et des blocs de code (`.home-hero-terminal`, `.hero-term`, `.terminal-window`, `.terminal`, `.contact__term`, `pre`) avec tokens sombres explicites.
+- Calibration de l'atmosphère d'ambiance WebGL dans `app/components/home/HomeAtmosComponent.vue` : opacité du canvas atténuée à 0.18 sous `[data-theme="light"]`.
+- Adaptation des logos du header et du footer avec filtre d'inversion sous `[data-theme="light"]` (`HeaderComponent.vue`, `FooterComponent.vue`).
+- Validation de conformité 100% verte de la gate de production Docker Nitro SSG (24 routes pré-rendues).
 
 ### File List
+- `app/assets/scss/abstract/_root.scss`
+- `app/components/home/HomeAtmosComponent.vue`

codex
Le diff est lisible. Je vérifie maintenant les contextes d’usage des tokens, des sélecteurs globaux et des composants concernés afin de distinguer les problèmes réels des affirmations de validation présentes dans le document.
exec
/bin/zsh -lc "rg -n \"(--(surface|ink|line|accent-text|accent-2|bg-terminal|text-shadow)|class=\\\"["'^'"\\\"]*(terminal|hero-term|contact__term)|<pre|atmos--fallback|atmos__canvas|logo|brand)\" app content | sed -n '1,260p'
printf '\\n--- ROOT CONTEXT ---\\n'
sed -n '1,280p' app/assets/scss/abstract/_root.scss
printf '\\n--- COMPONENT STYLES ---\\n'
sed -n '70,145p' app/components/FooterComponent.vue
sed -n '250,340p' app/components/HeaderComponent.vue
sed -n '330,470p' app/components/home/HomeAtmosComponent.vue
printf '\\n--- DIFF STATS / FILE LIST ---\\n'
git diff --stat -- docs/implementation-artifacts/code-reviews/13-4/full.diff 2>/dev/null || true
rg -n \"13\\.4|24 routes|contact/card|adapt.*fallback|fallback|FOUC|localStorage\" docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-ssg.md docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md 2>/dev/null || true" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:286:  background: var(--surface-1);
app/pages/about.vue:394:  background: var(--surface-0);
app/pages/blog/[...slug].vue:152:      logo: `${siteUrl}/images/logo.png`,
app/pages/blog/[...slug].vue:305:  // désactivé → <pre><code> nu, donc pas de styles inline par token à surcharger.
app/pages/blog/[...slug].vue:314:    background: var(--bg-terminal);
app/pages/blog/[...slug].vue:319:  // Code inline = vert terminal ; le code en bloc hérite la couleur du <pre> (off-white).
app/pages/blog/[...slug].vue:405:  background: var(--surface-1);
app/pages/blog/index.vue:131:      logo: `${siteUrl}/images/logo.png`,
app/app.vue:27:  logo: `${siteUrl}/images/logo.png`,
app/pages/contact/card.vue:146:  background: color-mix(in srgb, var(--surface-2) 85%, transparent);
app/pages/contact/card.vue:213:  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
app/pages/contact/card.vue:214:  border: 1px solid color-mix(in srgb, var(--line-subtle) 80%, transparent);
app/pages/contact/card.vue:222:    background: var(--surface-3);
app/pages/contact/index.vue:147:            <ZCard class="contact__term">
app/pages/contact/index.vue:152:              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
app/pages/contact/index.vue:526:  background: var(--bg-terminal);
app/pages/contact/index.vue:527:  border-color: var(--accent-2-soft);
app/components/HeaderComponent.vue:5:      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
app/components/HeaderComponent.vue:6:        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
app/components/HeaderComponent.vue:7:        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
app/components/HeaderComponent.vue:25:        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
app/components/HeaderComponent.vue:83:        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
app/components/HeaderComponent.vue:254:  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
app/components/HeaderComponent.vue:284:.hdr__brand {
app/components/HeaderComponent.vue:291:  .hdr__logo {
app/components/HeaderComponent.vue:296:    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/HeaderComponent.vue:302:      filter: invert(1) drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/HeaderComponent.vue:306:  .hdr__brand-text {
app/components/HeaderComponent.vue:324:    .hdr__logo {
app/components/HeaderComponent.vue:338:  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue:569:    background: var(--surface-1);
app/components/HeaderComponent.vue:598:    background: var(--surface-2);
app/components/HeaderComponent.vue:628:  .hdr__brand .hdr__logo,
app/components/HeaderComponent.vue:629:  .hdr__brand:hover .hdr__logo {
app/pages/index.vue:521:  text-shadow: 0 2px 14px color-mix(in srgb, var(--surface-0) 80%, transparent);
app/pages/index.vue:536:  text-shadow: 0 1px 8px color-mix(in srgb, var(--surface-0) 70%, transparent);
app/pages/index.vue:832:  background: var(--surface-0);
app/pages/index.vue:856:    var(--surface-0);
app/pages/index.vue:870:  background: color-mix(in srgb, var(--surface-1) 60%, transparent);
app/pages/index.vue:890:  background: var(--surface-2);
app/pages/index.vue:1003:  background: color-mix(in srgb, var(--surface-1) 85%, transparent);
app/pages/index.vue:1193:    color-mix(in srgb, var(--surface-1) 85%, transparent);
app/components/FooterComponent.vue:5:        <div class="ftr__brand-col">
app/components/FooterComponent.vue:6:          <NuxtLink to="/" class="ftr__brand">
app/components/FooterComponent.vue:7:            <NuxtImg src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
app/components/FooterComponent.vue:74:  background: var(--surface-1);
app/components/FooterComponent.vue:94:.ftr__brand-col {
app/components/FooterComponent.vue:98:.ftr__brand {
app/components/FooterComponent.vue:105:  .ftr__logo {
app/components/FooterComponent.vue:110:    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/FooterComponent.vue:113:      filter: invert(1) drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/FooterComponent.vue:128:  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
app/components/HexagonLinkComponent.vue:28:  background: var(--surface-3);
app/components/HexagonLinkComponent.vue:36:    color: var(--ink-on-accent);
app/components/terminal/TerminalComponent.vue:10:    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
app/components/terminal/TerminalComponent.vue:11:      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
app/components/terminal/TerminalComponent.vue:12:        <div class="terminal-dots">
app/components/terminal/TerminalComponent.vue:22:          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:23:          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
app/components/terminal/TerminalComponent.vue:28:      <div class="terminal-body">
app/components/terminal/TerminalComponent.vue:32:            <span class="terminal-response" v-html="line.text"></span>
app/components/terminal/TerminalComponent.vue:339:  color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:423:    background: var(--bg-terminal);
app/components/terminal/TerminalComponent.vue:445:      color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:499:      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/assets/scss/base/_reset.scss:460:/* Make sure logo link wraps around logo image. */
app/assets/scss/base/_reset.scss:461:.custom-logo-link {
app/components/home/HomeAtmosComponent.vue:2:  <div class="atmos" :class="{ 'atmos--fallback': isFallback }" aria-hidden="true">
app/components/home/HomeAtmosComponent.vue:3:    <canvas v-if="!isFallback" ref="canvasRef" class="atmos__canvas" />
app/components/home/HomeAtmosComponent.vue:378:  background-color: var(--surface-0);
app/components/home/HomeAtmosComponent.vue:381:.atmos--fallback {
app/components/home/HomeAtmosComponent.vue:382:  background-color: var(--surface-0);
app/components/home/HomeAtmosComponent.vue:385:    radial-gradient(at 21% 68%, var(--accent-2-soft) 0, transparent 62%);
app/components/home/HomeAtmosComponent.vue:388:.atmos__canvas {
app/components/home/HomeAtmosComponent.vue:397::global([data-theme="light"]) .atmos__canvas {
app/components/home/HomeAtmosComponent.vue:404:  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 8%, transparent) 1px, transparent 1px);
app/components/home/HomeAtmosComponent.vue:406:  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
app/components/home/HomeAtmosComponent.vue:413:    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 70%, transparent) 0%, transparent 130px),
app/components/home/HomeAtmosComponent.vue:414:    radial-gradient(ellipse 120% 88% at 50% 12%, transparent 30%, var(--surface-0) 90%);
app/components/home/HomeAtmosComponent.vue:418:  .atmos__canvas {
app/components/home/HomeBootOverlay.vue:11:      <div class="boot__logo">
app/components/home/HomeBootOverlay.vue:12:        <ZIcon name="gem" class="boot__logo-icon" />
app/components/home/HomeBootOverlay.vue:182:  background: var(--surface-0);
app/components/home/HomeBootOverlay.vue:200:.boot__logo {
app/components/home/HomeBootOverlay.vue:212:.boot__logo-icon {
app/components/home/HomeBootOverlay.vue:230:  background: var(--surface-3);
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
app/components/home/HomeHeroTerminal.vue:264:  border: 1px solid var(--accent-2-soft);
app/components/home/HomeHeroTerminal.vue:323:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:324:  background: var(--bg-terminal);
app/components/home/HomeHeroTerminal.vue:330:    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
app/components/home/HomeHeroTerminal.vue:343:.hero-term__out--ink {
app/components/home/HomeHeroTerminal.vue:344:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:383:  color: var(--ink-1);
app/components/home/HomeHeroTerminal.vue:392:  color: var(--ink-1);
app/assets/scss/abstract/_root.scss:32:  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
app/assets/scss/abstract/_root.scss:33:  --surface-1: hsl(319deg 22% 9%); // sections en creux
app/assets/scss/abstract/_root.scss:34:  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
app/assets/scss/abstract/_root.scss:35:  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
app/assets/scss/abstract/_root.scss:36:  --surface-4: hsl(316deg 14% 21%); // popovers, inputs
app/assets/scss/abstract/_root.scss:39:  --line-subtle: hsl(316deg 14% 18%);
app/assets/scss/abstract/_root.scss:40:  --line: hsl(315deg 12% 25%);
app/assets/scss/abstract/_root.scss:41:  --line-strong: hsl(314deg 11% 34%);
app/assets/scss/abstract/_root.scss:44:  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
app/assets/scss/abstract/_root.scss:45:  --ink-2: hsl(28deg 10% 74%); // corps
app/assets/scss/abstract/_root.scss:46:  --ink-3: hsl(25deg 7% 54%); // discret / légendes
app/assets/scss/abstract/_root.scss:47:  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
app/assets/scss/abstract/_root.scss:48:  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange
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
app/assets/scss/abstract/_root.scss:87:  --accent-text: var(--ink-on-accent);
app/assets/scss/abstract/_root.scss:90:  --accent-2: var(--aubergine-light); // accent secondaire
app/assets/scss/abstract/_root.scss:91:  --accent-2-soft: hsl(319deg 40% 30% / 28%);
app/assets/scss/abstract/_root.scss:210:  --surface-0: hsl(38deg 25% 97%);
app/assets/scss/abstract/_root.scss:211:  --surface-1: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss:212:  --surface-2: hsl(0deg 0% 100%);
app/assets/scss/abstract/_root.scss:213:  --surface-3: hsl(38deg 30% 99%);
app/assets/scss/abstract/_root.scss:214:  --surface-4: hsl(38deg 15% 95%);
app/assets/scss/abstract/_root.scss:217:  --line-subtle: hsl(35deg 15% 88%);
app/assets/scss/abstract/_root.scss:218:  --line: hsl(35deg 12% 80%);
app/assets/scss/abstract/_root.scss:219:  --line-strong: hsl(35deg 12% 68%);
app/assets/scss/abstract/_root.scss:222:  --ink-1: hsl(320deg 30% 12%);
app/assets/scss/abstract/_root.scss:223:  --ink-2: hsl(320deg 18% 26%);
app/assets/scss/abstract/_root.scss:224:  --ink-3: hsl(320deg 10% 44%);
app/assets/scss/abstract/_root.scss:225:  --ink-4: hsl(320deg 8% 58%);
app/assets/scss/abstract/_root.scss:226:  --ink-on-accent: hsl(0deg 0% 100%);
app/assets/scss/abstract/_root.scss:229:  --bg-page: var(--surface-0);
app/assets/scss/abstract/_root.scss:230:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:231:  --bg-card: var(--surface-2);
app/assets/scss/abstract/_root.scss:232:  --bg-elevated: var(--surface-3);
app/assets/scss/abstract/_root.scss:233:  --bg-input: var(--surface-4);
app/assets/scss/abstract/_root.scss:234:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:235:  --text-body: var(--ink-2);
app/assets/scss/abstract/_root.scss:236:  --text-muted: var(--ink-3);
app/assets/scss/abstract/_root.scss:237:  --text-faint: var(--ink-4);
app/assets/scss/abstract/_root.scss:238:  --accent-text: var(--ink-on-accent);
app/assets/scss/abstract/_root.scss:239:  --border-subtle: var(--line-subtle);
app/assets/scss/abstract/_root.scss:240:  --border-default: var(--line);
app/assets/scss/abstract/_root.scss:241:  --border-strong: var(--line-strong);
app/assets/scss/abstract/_root.scss:249:  --accent-2: hsl(319deg 33% 40%);
app/assets/scss/abstract/_root.scss:250:  --accent-2-soft: hsl(319deg 40% 40% / 15%);
app/assets/scss/abstract/_root.scss:269:  --surface-0: hsl(320deg 30% 6%);
app/assets/scss/abstract/_root.scss:270:  --surface-1: hsl(319deg 22% 9%);
app/assets/scss/abstract/_root.scss:271:  --surface-2: hsl(318deg 18% 12%);
app/assets/scss/abstract/_root.scss:272:  --surface-3: hsl(317deg 16% 16%);
app/assets/scss/abstract/_root.scss:273:  --surface-4: hsl(316deg 14% 21%);
app/assets/scss/abstract/_root.scss:274:  --ink-1: hsl(30deg 18% 95%);
app/assets/scss/abstract/_root.scss:275:  --ink-2: hsl(28deg 10% 74%);
app/assets/scss/abstract/_root.scss:276:  --ink-3: hsl(25deg 7% 54%);
app/assets/scss/abstract/_root.scss:277:  --ink-4: hsl(22deg 6% 40%);
app/assets/scss/abstract/_root.scss:278:  --line-subtle: hsl(316deg 14% 18%);
app/assets/scss/abstract/_root.scss:279:  --line: hsl(315deg 12% 25%);
app/assets/scss/abstract/_root.scss:280:  --line-strong: hsl(314deg 11% 34%);
app/assets/scss/abstract/_root.scss:281:  --bg-page: var(--surface-0);
app/assets/scss/abstract/_root.scss:282:  --bg-sunken: var(--surface-1);
app/assets/scss/abstract/_root.scss:283:  --bg-card: var(--surface-2);
app/assets/scss/abstract/_root.scss:284:  --bg-elevated: var(--surface-3);
app/assets/scss/abstract/_root.scss:285:  --bg-input: var(--surface-4);
app/assets/scss/abstract/_root.scss:286:  --bg-terminal: var(--aubergine-deep);
app/components/ui/ZButton.vue:268:  color: var(--accent-text);
app/components/ui/ZButton.vue:285:  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
app/components/ui/ZButton.vue:291:    background: var(--surface-3);
app/components/ui/ZButton.vue:302:    background: var(--surface-2);
app/components/ui/ZButton.vue:308:  background: var(--bg-terminal);
app/components/ui/ZButton.vue:310:  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
app/components/ui/ZButton.vue:323:  color: var(--ink-on-accent);
app/components/ui/ZCustomCursor.vue:175:  background: var(--ink-1);
app/components/ui/ZCustomCursor.vue:181:  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
app/components/ui/ThemeToggle.vue:64:  background: var(--surface-1);
app/components/ui/ThemeToggle.vue:76:      background: var(--surface-2);
app/components/ui/ZIcon.vue:23:// Icônes au trait = style Lucide ; glyphes de marque (github/twitter/linkedin/wp) + logo
app/components/ui/ZIcon.vue:65:// (overlay blanc très léger, esprit "lit from above" du logo de marque).
app/components/ui/ZAvatar.vue:74:  background: var(--surface-3);
app/components/ui/ZTag.vue:121:  background: var(--surface-2);
app/components/ui/ZBadge.vue:54:  background: var(--surface-3);

--- ROOT CONTEXT ---
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
  // ---- Rampe de surfaces neutres primitives ----
  --surface-0: hsl(38deg 25% 97%);
  --surface-1: hsl(38deg 20% 93%);
  --surface-2: hsl(0deg 0% 100%);
  --surface-3: hsl(38deg 30% 99%);
  --surface-4: hsl(38deg 15% 95%);

  // ---- Bordures / hairlines primitives ----
  --line-subtle: hsl(35deg 15% 88%);
  --line: hsl(35deg 12% 80%);
  --line-strong: hsl(35deg 12% 68%);

  // ---- Texte encres primitives (contrastes WCAG AAA) ----
  --ink-1: hsl(320deg 30% 12%);
  --ink-2: hsl(320deg 18% 26%);
  --ink-3: hsl(320deg 10% 44%);
  --ink-4: hsl(320deg 8% 58%);
  --ink-on-accent: hsl(0deg 0% 100%);

  // ---- Alias sémantiques ----
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --text-faint: var(--ink-4);
  --accent-text: var(--ink-on-accent);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-strong: var(--line-strong);

  // ---- Accentuation & interactions ----
  --accent: hsl(24deg 95% 44%);
  --accent-hover: hsl(24deg 95% 48%);
  --accent-active: hsl(24deg 95% 40%);
  --accent-soft: hsl(24deg 94% 53% / 10%);
  --accent-ring: hsl(24deg 94% 53% / 35%);
  --accent-2: hsl(319deg 33% 40%);
  --accent-2-soft: hsl(319deg 40% 40% / 15%);
  --selection: hsl(24deg 94% 53% / 22%);
  --overlay: hsl(320deg 30% 10% / 40%);

  // ---- Ombres adaptées ----
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
}

/* stylelint-disable selector-class-pattern -- sanctuarisation classes terminal et blocs code */
// Sanctuarisation absolue du terminal sombre
.home-hero-terminal,
.hero-term,
.terminal-window,
.terminal,
.contact__term,
pre {
  --surface-0: hsl(320deg 30% 6%);
  --surface-1: hsl(319deg 22% 9%);
  --surface-2: hsl(318deg 18% 12%);
  --surface-3: hsl(317deg 16% 16%);
  --surface-4: hsl(316deg 14% 21%);
  --ink-1: hsl(30deg 18% 95%);
  --ink-2: hsl(28deg 10% 74%);
  --ink-3: hsl(25deg 7% 54%);
  --ink-4: hsl(22deg 6% 40%);
  --line-subtle: hsl(316deg 14% 18%);
  --line: hsl(315deg 12% 25%);
  --line-strong: hsl(314deg 11% 34%);

--- COMPONENT STYLES ---
.ftr {
  position: relative;
  z-index: 10;
  margin-top: auto;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 0;
}

.ftr__container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.ftr__in {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: flex-start;
  justify-content: space-between;
}

.ftr__brand-col {
  max-width: 300px;
}

.ftr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  text-decoration: none;

  .ftr__logo {
    display: block;
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));

    :global([data-theme="light"]) & {
      filter: invert(1) drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
    }
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }

  .dim {
    color: var(--text-muted);
  }

  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.ftr__tagline {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-body);
}

.ftr__col {
  display: flex;
  flex-direction: column;
    -webkit-backdrop-filter var(--dur-base) var(--ease-standard);
}

.hdr--stuck {
  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
  border-bottom-color: var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hdr__progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
  box-shadow: 0 0 10px var(--accent);
  pointer-events: none;
  transition: width 0.05s linear;
}

.hdr__in {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  width: 100%;
  max-width: var(--container-xl);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.hdr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  cursor: pointer;

  .hdr__logo {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
    transition:
      transform var(--dur-base) var(--ease-standard),
      filter var(--dur-base) var(--ease-standard);

    :global([data-theme="light"]) & {
      filter: invert(1) drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
    }
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
  const success = initWebGL(canvas);
  if (!success) {
    isFallback.value = true;
    return;
  }

  resizeCanvas(canvas);
  window.addEventListener("resize", onResize, { passive: true });

  startT = performance.now();

  if (isReducedMotion) {
    // Un seul rendu statique pour les préférences d'accessibilité
    if (gl) {
      gl.uniform1f(uniforms.u_time ?? null, 1.2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  } else {
    animId = requestAnimationFrame(loop);
  }
});

onBeforeUnmount(() => {
  if (animId !== null) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  document.removeEventListener("visibilitychange", onVisibilityChange);
  motionMq?.removeEventListener("change", onMotionChange);
  window.removeEventListener("resize", onResize);
  canvasRef.value?.removeEventListener("webglcontextlost", onContextLost);
  if (gl && program) {
    if (quadBuffer) {
      gl.deleteBuffer(quadBuffer);
    }
    gl.deleteProgram(program);
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.atmos {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: var(--surface-0);
}

.atmos--fallback {
  background-color: var(--surface-0);
  background-image:
    radial-gradient(at 80% 30%, var(--accent-soft) 0, transparent 62%),
    radial-gradient(at 21% 68%, var(--accent-2-soft) 0, transparent 62%);
}

.atmos__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.52;
}

:global([data-theme="light"]) .atmos__canvas {
  opacity: 0.18;
}

.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 8%, transparent) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
}

.vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface-0) 70%, transparent) 0%, transparent 130px),
    radial-gradient(ellipse 120% 88% at 50% 12%, transparent 30%, var(--surface-0) 90%);
}

@media (prefers-reduced-motion: reduce) {
  .atmos__canvas {
    animation: none;
  }
}
</style>

--- DIFF STATS / FILE LIST ---
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:5:# Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:43:     - Le repli CSS `.atmos--fallback` bascule sur des gradients doux adaptés au fond clair
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:52:     - **Contact (`/contact` & `/contact/card`) :** Formulaire Web3Forms, inputs lisibles (`--bg-input: #F5F3EE`), colonnes d'infos et carte de visite vCard
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:56:4. **Given** le cycle complet de gestion du thème (`ThemeToggle`, `useTheme()`, script anti-FOUC)
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:58:   **Then** la bascule s'opère instantanément sans rechargement, la persistance dans `localStorage` (`jouan_theme_mode`) est immédiate
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:59:   **And** un rechargement dur de la page (`Cmd+R` / `F5`) en mode clair restaure le thème sans aucun flash noir ou clignotement FOUC.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:63:   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et l'ensemble des routes statiques (24 routes dont assets) générées sans anomalie.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:79:  - [x] Adapter le repli `.atmos--fallback` pour le mode clair.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:86:  - [x] Tester visuellement la page Contact (`/contact`), les inputs de formulaire et `/contact/card`.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:88:  - [x] Vérifier la persistance `localStorage` et l'absence totale de FOUC au rechargement.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:95:  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:125:- Gate Docker 100% verte : ESLint 0 erreur, Stylelint 0 erreur, vue-tsc 0 erreur, Nitro SSG 24 routes statiques pré-rendues.
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:126:- HTTP 200 vérifié sur toutes les routes clés (`/`, `/services`, `/about`, `/contact`, `/contact/card`, `/blog`, `/confidentialite`, `/mentions-legales`).
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:133:- Validation de conformité 100% verte de la gate de production Docker Nitro SSG (24 routes pré-rendues).
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:144:- 2026-09-18 : Implémentation et validation complète de la Story 13.4 (complétion des tokens primitifs SCSS, calibration de l'atmosphère d'ambiance WebGL, adaptation des logos et certification gate Docker Nitro SSG 24 routes).
docs/implementation-artifacts/13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg.md:145:- 2026-09-18 : Création de la Story 13.4 (cadrage de la validation transverse, complétion des tokens primitifs SCSS, atmosphère d'ambiance et gate Docker Nitro SSG).

exec
/bin/zsh -lc "rg -n \"data-theme|useTheme|ThemeToggle|logo_white|shadow-(1|2|3|hairline)|glow|--link|--term-\" app | sed -n '1,300p'
printf '\\n--- THEME IMPLEMENTATION ---\\n'
rg -n -C 6 \"jouan_theme_mode|data-theme|classList\" app plugins nuxt.config.ts 2>/dev/null | sed -n '1,260p'
printf '\\n--- CONTACT / BLOG CODE STYLES ---\\n'
sed -n '280,335p' app/pages/blog/[...slug].vue
sed -n '500,550p' app/pages/contact/index.vue
sed -n '120,180p' app/pages/contact/index.vue
printf '\\n--- ROOT REMAINDER ---\\n'
sed -n '260,330p' app/assets/scss/abstract/_root.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:260:    color: var(--link);
app/pages/blog/[...slug].vue:280:    color: var(--link);
app/pages/blog/[...slug].vue:323:    color: var(--term-green);
app/pages/services.vue:98:  /** Offre mise en avant : carte accent + glow + badge. */
app/pages/mentions-legales.vue:164:  color: var(--term-blue);
app/pages/contact/card.vue:296:  color: var(--term-green);
app/pages/contact/index.vue:431:  color: var(--term-blue);
app/pages/contact/index.vue:456:  color: var(--term-green);
app/pages/contact/index.vue:505:  color: var(--term-blue);
app/pages/contact/index.vue:534:  color: var(--term-green);
app/pages/confidentialite.vue:227:  color: var(--term-blue);
app/pages/index.vue:703:  color: var(--term-green);
app/pages/index.vue:891:  box-shadow: var(--shadow-1);
app/pages/index.vue:1006:  box-shadow: var(--shadow-2);
app/pages/index.vue:1197:  box-shadow: var(--shadow-3), var(--shadow-hairline);
app/assets/scss/components/_card.scss:74:  box-shadow: var(--box-shadow-2), var(--box-shadow-1);
app/assets/scss/abstract/_root.scss:27:  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
app/assets/scss/abstract/_root.scss:51:  --term-green: hsl(143deg 60% 52%); // prompt, succès
app/assets/scss/abstract/_root.scss:52:  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
app/assets/scss/abstract/_root.scss:53:  --term-cyan: hsl(186deg 64% 56%);
app/assets/scss/abstract/_root.scss:54:  --term-red: hsl(0deg 85% 64%);
app/assets/scss/abstract/_root.scss:55:  --term-yellow: hsl(48deg 90% 58%);
app/assets/scss/abstract/_root.scss:56:  --term-purple: hsl(280deg 60% 70%);
app/assets/scss/abstract/_root.scss:93:  --link: var(--term-blue);
app/assets/scss/abstract/_root.scss:94:  --prompt: var(--term-green);
app/assets/scss/abstract/_root.scss:178:  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
app/assets/scss/abstract/_root.scss:179:  --shadow-2: 0 2px 8px hsl(320deg 60% 2% / 55%);
app/assets/scss/abstract/_root.scss:180:  --shadow-3: 0 8px 24px hsl(320deg 60% 2% / 60%);
app/assets/scss/abstract/_root.scss:184:  --shadow-hairline: inset 0 1px 0 hsl(30deg 20% 100% / 5%);
app/assets/scss/abstract/_root.scss:187:  --glow-accent: 0 0 0 1px hsl(24deg 94% 53% / 40%), 0 8px 30px hsl(24deg 94% 53% / 22%);
app/assets/scss/abstract/_root.scss:188:  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);
app/assets/scss/abstract/_root.scss:208:[data-theme="light"] {
app/assets/scss/abstract/_root.scss:255:  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
app/assets/scss/abstract/_root.scss:256:  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
app/assets/scss/abstract/_root.scss:257:  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
app/assets/scss/abstract/_root.scss:258:  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
app/assets/scss/abstract/_box_shadow.scss:8:// box-shadow-1   0 1px 4px #{color}
app/assets/scss/abstract/_box_shadow.scss:9:// box-shadow-2   0 2px 10px #{color}
app/assets/scss/abstract/_box_shadow.scss:10:$box-shadow-1: 0 1px 4px #{_color.$shadow};
app/assets/scss/abstract/_box_shadow.scss:11:$box-shadow-2: 0 2px 10px #{_color.$shadow};
app/app.vue:11:const { initTheme } = useTheme();
app/components/HeaderComponent.vue:6:        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
app/components/HeaderComponent.vue:49:      <ThemeToggle class="hdr__dock-theme" />
app/components/HeaderComponent.vue:76:          <ThemeToggle class="hdr__menu-theme" />
app/components/HeaderComponent.vue:301:    :global([data-theme="light"]) & {
app/components/HeaderComponent.vue:432:  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
app/components/HeaderComponent.vue:433:  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);
app/components/HeaderComponent.vue:436:    border-color: var(--term-green);
app/components/HeaderComponent.vue:438:      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
app/components/HeaderComponent.vue:439:      var(--glow-terminal);
app/components/HeaderComponent.vue:462:  color: var(--term-green);
app/components/HeaderComponent.vue:464:  background: color-mix(in srgb, var(--term-green) 12%, transparent);
app/components/HeaderComponent.vue:465:  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
app/components/HeaderComponent.vue:467:  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
app/components/HeaderComponent.vue:477:    border-color: var(--term-green);
app/components/HeaderComponent.vue:478:    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
app/components/HeaderComponent.vue:485:  background: var(--term-green);
app/components/HeaderComponent.vue:487:  box-shadow: 0 0 6px var(--term-green);
app/components/HeaderComponent.vue:571:    box-shadow: var(--shadow-3);
app/composables/useTheme.ts:14:export function useTheme() {
app/composables/useTheme.ts:29:    document.documentElement.setAttribute("data-theme", resolved);
app/composables/useTheme.ts:30:    document.documentElement.setAttribute("data-theme-source", pref);
app/components/home/HomeAtmosComponent.vue:397::global([data-theme="light"]) .atmos__canvas {
app/components/home/HomeBootOverlay.vue:223:  color: var(--term-green);
app/components/ui/ZButton.vue:270:  box-shadow: var(--glow-accent);
app/components/ui/ZButton.vue:309:  color: var(--term-green);
app/components/ui/ZButton.vue:310:  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
app/components/ui/ZButton.vue:311:  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
app/components/ui/ZButton.vue:314:    border-color: var(--term-green);
app/components/ui/ZButton.vue:316:      0 0 18px color-mix(in srgb, var(--term-green) 45%, transparent),
app/components/ui/ZButton.vue:317:      var(--glow-terminal);
app/components/WindowWrapperComponent.vue:295:  box-shadow: #{_boxShadow.$box-shadow-2};
app/components/WindowWrapperComponent.vue:331:        #{_boxShadow.$box-shadow-2},
app/components/WindowWrapperComponent.vue:332:        #{_boxShadow.$box-shadow-1};
app/components/terminal/TerminalComponent.vue:342:  box-shadow: var(--glow-terminal);
app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
app/components/terminal/TerminalComponent.vue:393:      background: var(--term-yellow);
app/components/terminal/TerminalComponent.vue:397:      background: var(--term-green);
app/components/terminal/TerminalComponent.vue:450:      color: var(--term-blue);
app/components/FooterComponent.vue:7:            <NuxtImg src="/images/logo_white.png" alt="" class="ftr__logo" width="22" height="22" />
app/components/FooterComponent.vue:112:    :global([data-theme="light"]) & {
app/components/FooterComponent.vue:220:  color: var(--term-green);
app/components/ui/ThemeToggle.vue:16:import { useTheme } from "~/composables/useTheme";
app/components/ui/ThemeToggle.vue:18:const { preference, resolvedTheme, cycleTheme } = useTheme();
app/components/home/HomeHeroTerminal.vue:266:  box-shadow: var(--glow-terminal);
app/components/home/HomeHeroTerminal.vue:293:  background: var(--term-red);
app/components/home/HomeHeroTerminal.vue:297:  background: var(--term-yellow);
app/components/home/HomeHeroTerminal.vue:301:  background: var(--term-green);
app/components/home/HomeHeroTerminal.vue:348:  color: var(--term-blue);
app/components/home/HomeHeroTerminal.vue:352:  color: var(--term-green);
app/components/home/HomeHeroTerminal.vue:388:  color: var(--term-blue);
app/components/ui/ZTag.vue:173:    color: var(--term-red);
app/components/ui/ZCard.vue:36:  /** Variante mise en valeur (bordure accent, glow). @default false */
app/components/ui/ZCard.vue:139:  box-shadow: var(--shadow-2), var(--shadow-hairline);
app/components/ui/ZCard.vue:161:    box-shadow: var(--shadow-3), var(--shadow-hairline);
app/components/ui/ZCard.vue:181:  box-shadow: var(--glow-accent), var(--shadow-hairline);

--- THEME IMPLEMENTATION ---
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
--
app/assets/scss/abstract/_root.scss-202-  --ease-standard: ease-in-out;
app/assets/scss/abstract/_root.scss-203-}
app/assets/scss/abstract/_root.scss-204-
app/assets/scss/abstract/_root.scss-205-// ============================================================
app/assets/scss/abstract/_root.scss-206-//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
app/assets/scss/abstract/_root.scss-207-// ============================================================
app/assets/scss/abstract/_root.scss:208:[data-theme="light"] {
app/assets/scss/abstract/_root.scss-209-  // ---- Rampe de surfaces neutres primitives ----
app/assets/scss/abstract/_root.scss-210-  --surface-0: hsl(38deg 25% 97%);
app/assets/scss/abstract/_root.scss-211-  --surface-1: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss-212-  --surface-2: hsl(0deg 0% 100%);
app/assets/scss/abstract/_root.scss-213-  --surface-3: hsl(38deg 30% 99%);
app/assets/scss/abstract/_root.scss-214-  --surface-4: hsl(38deg 15% 95%);
--
app/components/HeaderComponent.vue-295-    object-fit: contain;
app/components/HeaderComponent.vue-296-    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/HeaderComponent.vue-297-    transition:
app/components/HeaderComponent.vue-298-      transform var(--dur-base) var(--ease-standard),
app/components/HeaderComponent.vue-299-      filter var(--dur-base) var(--ease-standard);
app/components/HeaderComponent.vue-300-
app/components/HeaderComponent.vue:301:    :global([data-theme="light"]) & {
app/components/HeaderComponent.vue-302-      filter: invert(1) drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/HeaderComponent.vue-303-    }
app/components/HeaderComponent.vue-304-  }
app/components/HeaderComponent.vue-305-
app/components/HeaderComponent.vue-306-  .hdr__brand-text {
app/components/HeaderComponent.vue-307-    transition: transform var(--dur-fast) var(--ease-standard);
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
--
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
--
app/components/FooterComponent.vue-106-    display: block;
app/components/FooterComponent.vue-107-    width: 22px;
app/components/FooterComponent.vue-108-    height: 22px;
app/components/FooterComponent.vue-109-    object-fit: contain;
app/components/FooterComponent.vue-110-    filter: drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/FooterComponent.vue-111-
app/components/FooterComponent.vue:112:    :global([data-theme="light"]) & {
app/components/FooterComponent.vue-113-      filter: invert(1) drop-shadow(0 2px 4px color-mix(in srgb, var(--surface-0) 60%, transparent));
app/components/FooterComponent.vue-114-    }
app/components/FooterComponent.vue-115-  }
app/components/FooterComponent.vue-116-
app/components/FooterComponent.vue-117-  b {
app/components/FooterComponent.vue-118-    font-family: var(--font-mono);
--
app/components/WindowWrapperComponent.vue-70-      isTypingStarted.value = true;
app/components/WindowWrapperComponent.vue-71-
app/components/WindowWrapperComponent.vue-72-      const childElements = Array.from(element.children);
app/components/WindowWrapperComponent.vue-73-
app/components/WindowWrapperComponent.vue-74-      // Cacher tous les éléments enfants sans la classe 'no-typewriting'
app/components/WindowWrapperComponent.vue-75-      for (const childElement of childElements) {
app/components/WindowWrapperComponent.vue:76:        if (childElement.nodeType === Node.ELEMENT_NODE && !childElement.classList.contains("no-typewriting")) {
app/components/WindowWrapperComponent.vue-77-          const htmlChildElement = childElement as HTMLElement;
app/components/WindowWrapperComponent.vue-78-          htmlChildElement.style.visibility = "hidden";
app/components/WindowWrapperComponent.vue-79-        }
app/components/WindowWrapperComponent.vue-80-      }
app/components/WindowWrapperComponent.vue-81-
app/components/WindowWrapperComponent.vue-82-      // Effectuer le typewriting sur les éléments enfants sans la classe 'no-typewriting' les uns après les autres
app/components/WindowWrapperComponent.vue-83-      for (const childElement of childElements) {
app/components/WindowWrapperComponent.vue:84:        if (childElement.nodeType === Node.ELEMENT_NODE && !childElement.classList.contains("no-typewriting")) {
app/components/WindowWrapperComponent.vue-85-          const htmlChildElement = childElement as HTMLElement;
app/components/WindowWrapperComponent.vue-86-          const originalChildText = htmlChildElement.textContent || "";
app/components/WindowWrapperComponent.vue-87-          htmlChildElement.textContent = "";
app/components/WindowWrapperComponent.vue-88-          htmlChildElement.style.visibility = "visible";
app/components/WindowWrapperComponent.vue-89-
app/components/WindowWrapperComponent.vue-90-          const cursorElement = document.createElement("span");
--
app/components/WindowWrapperComponent.vue-108-
app/components/WindowWrapperComponent.vue-109-    const handleHeaderMouseDown = (event: MouseEvent): void => {
app/components/WindowWrapperComponent.vue-110-      if (
app/components/WindowWrapperComponent.vue-111-        event.target instanceof HTMLElement &&
app/components/WindowWrapperComponent.vue-112-        event.currentTarget instanceof HTMLElement &&
app/components/WindowWrapperComponent.vue-113-        event.currentTarget.parentElement &&
app/components/WindowWrapperComponent.vue:114:        event.target.classList.contains("window-header")
app/components/WindowWrapperComponent.vue-115-      ) {
app/components/WindowWrapperComponent.vue-116-        dragging.value = true;
app/components/WindowWrapperComponent.vue-117-        dragStartPosition.value = {
app/components/WindowWrapperComponent.vue-118-          x: event.clientX - event.currentTarget.parentElement.offsetLeft,
app/components/WindowWrapperComponent.vue-119-          y: event.clientY - event.currentTarget.parentElement.offsetTop,
app/components/WindowWrapperComponent.vue-120-        };
--
app/components/WindowWrapperComponent.vue-166-      isHoveringWindowBody.value = false;
app/components/WindowWrapperComponent.vue-167-    };
app/components/WindowWrapperComponent.vue-168-
app/components/WindowWrapperComponent.vue-169-    const fadeOut = (headerElement: HTMLElement) => {
app/components/WindowWrapperComponent.vue-170-      setTimeout(() => {
app/components/WindowWrapperComponent.vue-171-        if (!isHoveringWindowBody.value) {
app/components/WindowWrapperComponent.vue:172:          headerElement.classList.remove("visible");
app/components/WindowWrapperComponent.vue-173-        }
app/components/WindowWrapperComponent.vue-174-      }, 3000);
app/components/WindowWrapperComponent.vue-175-    };
app/components/WindowWrapperComponent.vue-176-
app/components/WindowWrapperComponent.vue-177-    const focus = () => {
app/components/WindowWrapperComponent.vue-178-      if (windowElement.value) {
--
app/components/WindowWrapperComponent.vue-182-    };
app/components/WindowWrapperComponent.vue-183-
app/components/WindowWrapperComponent.vue-184-    watch(isHoveringWindowBody, (newValue) => {
app/components/WindowWrapperComponent.vue-185-      if (windowElement.value) {
app/components/WindowWrapperComponent.vue-186-        const headerElement = windowElement.value.querySelector(".window-header") as HTMLElement;
app/components/WindowWrapperComponent.vue-187-        if (headerElement) {
app/components/WindowWrapperComponent.vue:188:          if (newValue && !headerElement.classList.contains("visible")) {
app/components/WindowWrapperComponent.vue:189:            headerElement.classList.add("visible");
app/components/WindowWrapperComponent.vue-190-          } else if (!newValue) {
app/components/WindowWrapperComponent.vue-191-            fadeOut(headerElement);
app/components/WindowWrapperComponent.vue-192-          }
app/components/WindowWrapperComponent.vue-193-        }
app/components/WindowWrapperComponent.vue-194-      }
app/components/WindowWrapperComponent.vue-195-    });
--
app/components/home/HomeAtmosComponent.vue-391-  width: 100%;
app/components/home/HomeAtmosComponent.vue-392-  height: 100%;
app/components/home/HomeAtmosComponent.vue-393-  display: block;
app/components/home/HomeAtmosComponent.vue-394-  opacity: 0.52;
app/components/home/HomeAtmosComponent.vue-395-}
app/components/home/HomeAtmosComponent.vue-396-
app/components/home/HomeAtmosComponent.vue:397::global([data-theme="light"]) .atmos__canvas {
app/components/home/HomeAtmosComponent.vue-398-  opacity: 0.18;
app/components/home/HomeAtmosComponent.vue-399-}
app/components/home/HomeAtmosComponent.vue-400-
app/components/home/HomeAtmosComponent.vue-401-.grid-dots {
app/components/home/HomeAtmosComponent.vue-402-  position: absolute;
app/components/home/HomeAtmosComponent.vue-403-  inset: 0;
--
app/components/terminal/TerminalComponent.vue-190-  } else {
app/components/terminal/TerminalComponent.vue-191-    userInput.value = "";
app/components/terminal/TerminalComponent.vue-192-  }
app/components/terminal/TerminalComponent.vue-193-};
app/components/terminal/TerminalComponent.vue-194-
app/components/terminal/TerminalComponent.vue-195-const handleResizeMouseDown = (event: MouseEvent): void => {
app/components/terminal/TerminalComponent.vue:196:  if (event.target instanceof HTMLElement && event.target.classList.contains("resize-handle")) {
app/components/terminal/TerminalComponent.vue-197-    resizing.value = true;
app/components/terminal/TerminalComponent.vue-198-
app/components/terminal/TerminalComponent.vue-199-    // Écouteurs globaux : le redimensionnement continue même si le curseur sort
app/components/terminal/TerminalComponent.vue-200-    // de la poignée de 16px pendant le glissement.
app/components/terminal/TerminalComponent.vue-201-    window.addEventListener("mousemove", handleGlobalResizeMouseMove);
app/components/terminal/TerminalComponent.vue-202-    window.addEventListener("mouseup", handleGlobalResizeMouseUp);
--
app/components/terminal/TerminalComponent.vue-229-
app/components/terminal/TerminalComponent.vue-230-const handleHeaderMouseDown = (event: MouseEvent): void => {
app/components/terminal/TerminalComponent.vue-231-  if (
app/components/terminal/TerminalComponent.vue-232-    event.target instanceof HTMLElement &&
app/components/terminal/TerminalComponent.vue-233-    event.currentTarget instanceof HTMLElement &&
app/components/terminal/TerminalComponent.vue-234-    event.currentTarget.parentElement &&
app/components/terminal/TerminalComponent.vue:235:    event.target.classList.contains("terminal-header")
app/components/terminal/TerminalComponent.vue-236-  ) {
app/components/terminal/TerminalComponent.vue-237-    dragging.value = true;
app/components/terminal/TerminalComponent.vue-238-    dragStartPosition.value = {
app/components/terminal/TerminalComponent.vue-239-      x: event.clientX - event.currentTarget.parentElement.offsetLeft,
app/components/terminal/TerminalComponent.vue-240-      y: event.clientY - event.currentTarget.parentElement.offsetTop,
app/components/terminal/TerminalComponent.vue-241-    };

--- CONTACT / BLOG CODE STYLES ---
zsh:5: no matches found: app/pages/blog/[...slug].vue
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

// ---- Carte CTA terminal (porté de Contact.jsx : Card .offer fond terminal) ----
// Surcharge du fond/bordure de ZCard ; nesting sous .contact__info pour la spécificité.
.contact__info .contact__term {
  background: var(--bg-terminal);
  border-color: var(--accent-2-soft);
}

.contact__prompt {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--term-green);
}

// Commande tapée : off-white (porté de l'inline ink-1 de Contact.jsx).
.contact__prompt-cmd {
  color: var(--text-strong);
}

.contact__term-text {
  margin: 0 0 var(--space-3);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

// ---- Carte CTA Carte de visite & QR Code ----
.contact__cardcta-eyebrow {
  margin: 0 0 var(--space-2);
                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                  </dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>localisation</dt>
                  <dd class="infoitem__v">{{ contact.city }}</dd>
                </div>
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>disponibilité</dt>
                  <dd class="infoitem__v">
                    <div class="contact__avail"><ZBadge tone="success" dot>Ouvert aux missions freelance</ZBadge></div>
                  </dd>
                </div>
              </dl>
            </ZCard>

            <!-- Carte d'accès carte de visite digitale & QR Code -->
            <ZCard class="contact__cardcta">
              <p class="contact__cardcta-eyebrow"><span aria-hidden="true">// </span>carte de visite digitale</p>
              <p class="prose contact__cardcta-text">Fiche contact prête à scanner avec QR code vCard.</p>
              <ZButton :as="NuxtLink" to="/contact/card" variant="secondary" size="sm">
                <template #icon><ZIcon name="qr" /></template>
                Carte de visite &amp; QR Code
              </ZButton>
            </ZCard>

            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
            <ZCard class="contact__term">
              <!-- Prompt décoratif (flavor terminal) : aria-hidden — le bouton + l'invite portent le sens. -->
              <p class="contact__prompt" aria-hidden="true">
                anon.@jouan.ovh:~$ <span class="contact__prompt-cmd">./contact</span>
              </p>
              <p class="prose contact__term-text">Vous préférez la ligne de commande ? Ouvrez le terminal.</p>
              <ZButton variant="terminal" size="sm" aria-haspopup="dialog" @click="openTerminal">
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
import { nextTick, reactive, ref, watch } from "vue";
import { NuxtLink } from "#components";
import { SITE } from "~/data/site";

// Infos de contact — source unique `app/data/site.ts`.
const contact = SITE.profile;

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le header).
// no-op au prerender (aucun lanceur) → prerender-safe ; ouvre le terminal côté client.
const { open: openTerminal } = useTerminal();

--- ROOT REMAINDER ---

/* stylelint-disable selector-class-pattern -- sanctuarisation classes terminal et blocs code */
// Sanctuarisation absolue du terminal sombre
.home-hero-terminal,
.hero-term,
.terminal-window,
.terminal,
.contact__term,
pre {
  --surface-0: hsl(320deg 30% 6%);
  --surface-1: hsl(319deg 22% 9%);
  --surface-2: hsl(318deg 18% 12%);
  --surface-3: hsl(317deg 16% 16%);
  --surface-4: hsl(316deg 14% 21%);
  --ink-1: hsl(30deg 18% 95%);
  --ink-2: hsl(28deg 10% 74%);
  --ink-3: hsl(25deg 7% 54%);
  --ink-4: hsl(22deg 6% 40%);
  --line-subtle: hsl(316deg 14% 18%);
  --line: hsl(315deg 12% 25%);
  --line-strong: hsl(314deg 11% 34%);
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: hsl(30deg 18% 95%);
  --text-body: hsl(28deg 10% 74%);
  --text-muted: hsl(25deg 7% 54%);
  --text-faint: hsl(22deg 6% 40%);
  --border-subtle: hsl(316deg 14% 18%);
  --border-default: hsl(315deg 12% 25%);
  --border-terminal: hsl(319deg 40% 30% / 40%);
  --accent: var(--orange-500);
  --selection: hsl(24deg 94% 53% / 30%);
}
/* stylelint-enable selector-class-pattern */

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
    transform: translateY(0);
  }
}

2026-09-18T15:56:22.227849Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- Le sélecteur global `pre` force un thème terminal sombre sur tous les blocs de code, y compris ceux des articles de blog en thème clair, sans distinction entre code applicatif et terminal interactif.

- La « sanctuarisation absolue » ne redéfinit pas `--accent-text`, `--accent-2`, `--accent-2-soft`, `--accent-hover`, `--accent-active`, `--accent-soft`, `--accent-ring`, `--link`, `--prompt` ni les couleurs `--term-*`, laissant des tokens du thème clair fuir dans les terminaux.

- Les tokens `--shadow-*`, `--shadow-hairline`, `--glow-terminal` et `--glow-accent` ne sont pas isolés, alors que les composants terminaux les utilisent directement.

- `--bg-terminal` reste indirectement dépendant de `--aubergine-deep`, sans token terminal explicitement complet ni garantie contre une future modification de la palette globale.

- Les sélecteurs `.home-hero-terminal` et `.terminal-window` ne correspondent pas aux classes visibles dans le code actuel, ce qui donne une fausse impression de couverture des composants.

- La règle globale sur `pre` augmente fortement le couplage entre le design system et le contenu Markdown, et peut écraser des styles spécifiques définis dans les pages ou composants de contenu.

- Le filtre `invert(1)` du logo du header est écrasé par la règle `filter` du sélecteur `:hover`, laissant potentiellement le logo blanc sur fond clair dès que le lien est survolé.

- La solution d’inversion des logos dépend d’un filtre raster générique et peut altérer les couleurs, l’anti-aliasing et les ombres du logo au lieu de fournir un asset ou une variante réellement adaptée au thème clair.

- La modification de `HomeAtmosComponent.vue` réduit uniquement l’opacité du canvas WebGL ; les gradients du fallback, les points de grille et la vignette ne disposent d’aucune calibration dédiée au thème clair.

- Le document affirme que le fallback `.atmos--fallback` a été adapté, alors qu’aucune règle spécifique à ce fallback n’apparaît dans le diff.

- Le document affirme qu’un audit visuel desktop/mobile a été réalisé, mais le diff ne contient aucune capture, aucun rapport de comparaison ni aucune preuve reproductible de ces vérifications.

- Le document affirme que les 24 routes ont été validées, mais ne fournit ni la sortie de la commande Docker, ni la liste des routes générées, ni une vérification des assets statiques.

- La `File List` du document omet `HeaderComponent.vue` et `FooterComponent.vue`, alors que ces fichiers font partie des changements revendiqués dans les notes de réalisation.

- La surcharge du thème clair ne redéfinit pas les tokens sémantiques `--link`, `--prompt`, `--success`, `--warning`, `--danger`, `--info` et leurs variantes soft ; les pages non terminales continuent donc d’utiliser des couleurs conçues pour le fond sombre.

- Le commentaire « contrastes WCAG AAA » est appliqué à toute la rampe `--ink-1` à `--ink-4`, alors que `--ink-4` est explicitement une couleur estompée susceptible de ne pas atteindre le contraste AAA sur les surfaces claires.

- Les valeurs de `text-shadow` existantes ne reçoivent aucune adaptation dédiée au thème clair ; l’utilisation de `var(--surface-0)` comme couleur d’ombre peut produire des ombres quasi invisibles ou visuellement incohérentes sur fond crème.

- Les déclarations de tokens directement dans le sélecteur global `.contact__term` rendent le composant dépendant de cette classe de page : un déplacement ou une réutilisation du CTA terminal sans cette classe lui fera perdre sa palette sombre.

- L’ouverture et la fermeture des commentaires Stylelint autour de la « sanctuarisation » masquent potentiellement des violations de convention sur la liste entière de sélecteurs, au lieu de limiter la désactivation aux seuls sélecteurs réellement nécessaires.
tokens used
45 077
- Le sélecteur global `pre` force un thème terminal sombre sur tous les blocs de code, y compris ceux des articles de blog en thème clair, sans distinction entre code applicatif et terminal interactif.

- La « sanctuarisation absolue » ne redéfinit pas `--accent-text`, `--accent-2`, `--accent-2-soft`, `--accent-hover`, `--accent-active`, `--accent-soft`, `--accent-ring`, `--link`, `--prompt` ni les couleurs `--term-*`, laissant des tokens du thème clair fuir dans les terminaux.

- Les tokens `--shadow-*`, `--shadow-hairline`, `--glow-terminal` et `--glow-accent` ne sont pas isolés, alors que les composants terminaux les utilisent directement.

- `--bg-terminal` reste indirectement dépendant de `--aubergine-deep`, sans token terminal explicitement complet ni garantie contre une future modification de la palette globale.

- Les sélecteurs `.home-hero-terminal` et `.terminal-window` ne correspondent pas aux classes visibles dans le code actuel, ce qui donne une fausse impression de couverture des composants.

- La règle globale sur `pre` augmente fortement le couplage entre le design system et le contenu Markdown, et peut écraser des styles spécifiques définis dans les pages ou composants de contenu.

- Le filtre `invert(1)` du logo du header est écrasé par la règle `filter` du sélecteur `:hover`, laissant potentiellement le logo blanc sur fond clair dès que le lien est survolé.

- La solution d’inversion des logos dépend d’un filtre raster générique et peut altérer les couleurs, l’anti-aliasing et les ombres du logo au lieu de fournir un asset ou une variante réellement adaptée au thème clair.

- La modification de `HomeAtmosComponent.vue` réduit uniquement l’opacité du canvas WebGL ; les gradients du fallback, les points de grille et la vignette ne disposent d’aucune calibration dédiée au thème clair.

- Le document affirme que le fallback `.atmos--fallback` a été adapté, alors qu’aucune règle spécifique à ce fallback n’apparaît dans le diff.

- Le document affirme qu’un audit visuel desktop/mobile a été réalisé, mais le diff ne contient aucune capture, aucun rapport de comparaison ni aucune preuve reproductible de ces vérifications.

- Le document affirme que les 24 routes ont été validées, mais ne fournit ni la sortie de la commande Docker, ni la liste des routes générées, ni une vérification des assets statiques.

- La `File List` du document omet `HeaderComponent.vue` et `FooterComponent.vue`, alors que ces fichiers font partie des changements revendiqués dans les notes de réalisation.

- La surcharge du thème clair ne redéfinit pas les tokens sémantiques `--link`, `--prompt`, `--success`, `--warning`, `--danger`, `--info` et leurs variantes soft ; les pages non terminales continuent donc d’utiliser des couleurs conçues pour le fond sombre.

- Le commentaire « contrastes WCAG AAA » est appliqué à toute la rampe `--ink-1` à `--ink-4`, alors que `--ink-4` est explicitement une couleur estompée susceptible de ne pas atteindre le contraste AAA sur les surfaces claires.

- Les valeurs de `text-shadow` existantes ne reçoivent aucune adaptation dédiée au thème clair ; l’utilisation de `var(--surface-0)` comme couleur d’ombre peut produire des ombres quasi invisibles ou visuellement incohérentes sur fond crème.

- Les déclarations de tokens directement dans le sélecteur global `.contact__term` rendent le composant dépendant de cette classe de page : un déplacement ou une réutilisation du CTA terminal sans cette classe lui fera perdre sa palette sombre.

- L’ouverture et la fermeture des commentaires Stylelint autour de la « sanctuarisation » masquent potentiellement des violations de convention sur la liste entière de sélecteurs, au lieu de limiter la désactivation aux seuls sélecteurs réellement nécessaires.

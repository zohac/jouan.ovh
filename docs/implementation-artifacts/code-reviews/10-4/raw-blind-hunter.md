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
session id: 01a099d9-06ee-7f61-848e-03a37f0f292c
--------
user
# Blind Hunter Prompt — Story 10.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to inspect the supplied diff skeptically and return at least ten concrete findings in the requested description-only Markdown list.
exec
/bin/zsh -lc 'cat /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md' in /Users/simon/dev/jouan.ovh
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

Output findings as a Markdown list (descriptions only).


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-4/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     129 docs/implementation-artifacts/code-reviews/10-4/full.diff
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

exec
/bin/zsh -lc "rg -n --hidden -g '"'!node_modules'"' -g '"'!dist'"' -g '"'!*.lock'"' \"forced-colors|focus-visible|prefers-reduced-motion|prm__caret|caret-shape|box-shadow: var\\(--ring|outline: 2px solid transparent\" app docs/implementation-artifacts | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/about.vue:245:    &:focus-visible {
app/pages/about.vue:246:      outline: 2px solid transparent;
app/pages/about.vue:249:      box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:180:  &:focus-visible {
app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:184:    box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:268:    &:focus-visible {
app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:272:      box-shadow: var(--ring-accent);
docs/implementation-artifacts/2-4-primitive-zcard.md:47:- [x] [Review][Patch] Respecter `prefers-reduced-motion` pour les transitions/lift de `ZCard` et l'animation de `ZCardBody` [app/components/ui/ZCard.vue:54]
docs/implementation-artifacts/2-4-primitive-zcard.md:120:- **Revue `ZCard`** : `as="button"` injecte `type="button"` par défaut tout en respectant un `type` explicite ; les autres attrs restent passthrough. `prefers-reduced-motion` neutralise la transition et le lift hover.
docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/10-3-liens-externes-accessibles.md:70:- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:18:  - 9.1 — États interactifs cohérents : audit focus/hover/press ; **zéro nouvelle UI**. Hover/press déjà token-driven (aucun changement) ; travail réel = **visibilité du focus** (repli `forced-colors` aux primitives + anneau DS sur les liens du châssis).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:19:  - 9.2 — Motion réduit, contraste, clavier : filet global `prefers-reduced-motion` + exception caret ; audit contraste WCAG (`--text-faint`→`--text-muted`) ; clavier (Échap ferme le terminal + retour de focus).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:31:2. **`forced-colors` réglé au bon niveau (9.1).** Le repli (rings `box-shadow` invisibles en contraste forcé) posé **une seule fois à la source** — `ZButton`/`ZCard`/`ZTag`/`ZInput`, `outline: none` → `outline: 2px solid transparent` — plutôt que page par page. Solde l'item DS-wide #1 qui traînait depuis l'Epic 3. Lacune comblée au passage : les liens du châssis (logo, nav, footer) n'avaient que l'outline navigateur → anneau DS ajouté.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:39:6. **Deux limites honnêtes (cf. §5) :** vérification a11y **partielle** (forced-colors + reduced-motion non émulables via MCP) et **panier a11y d'Epic 9 non vidé** (3 items orphelins).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:47:| **Checklist a11y en amont** (forced-colors / clavier / contraste) dans la consigne 9.1/9.2 | ✅ **Tenu** | Dev Notes/tâches des deux stories structurées autour de ces axes avec sources DS (9.1 T4 focus/forced-colors ; 9.2 T2 contraste, T3 clavier). |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:48:| **A1 — diff visuel/comportemental** | ⚠️ **Tenu partiellement** | Comportemental clavier au navigateur (sweep Tab, terminal Échap, form contact) ; mais **forced-colors + reduced-motion non émulables** → vérif visuelle incomplète (tracée). Limite d'outil, pas de discipline. |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:58:- **Correctifs a11y au bon niveau** : forced-colors à la source (primitives), filet motion global — pas de rustines page par page.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:70:1. **Le panier a11y d'Epic 9 n'est pas vidé.** `deferred-work.md` avait routé **quatre** items a11y vers « Epic 9» ; les stories 9.1/9.2 en ont traité **un** (forced-colors). Restent **orphelins** (Epic 9 ferme, pas d'Epic 10 au démarrage) :
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:77:2. **Vérification a11y partielle.** `forced-colors` et `prefers-reduced-motion` **ne sont pas émulables** via Chrome DevTools MCP. Présence/résolution des règles CSS confirmées + précédent codebase, mais **pas** l'effet runtime visuel. La correction a11y de 9.1/9.2 n'est donc pas prouvée à l'œil → un **audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) reste à faire.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:94:  1. **A11y résiduel** : titres/listes home+services (+ process `<ol>`), audit `target="_blank"`, sémantique `/contact`, unification des idiomes forced-colors ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:95:  2. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:140:4. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) — la vérif que le MCP ne permettait pas.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:38:  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:129:  - **a11y** : `×` = `<button type="button" aria-label="Retirer">` + `:focus-visible` ring (`--ring-accent`). Le tag cliquable reçoit `role="button"`, `tabindex="0"` par défaut, activation `Enter`/`Space`, et focus ring.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:132:- **Conventions revues 2.3/2.4 appliquées** : `/* stylelint-disable selector-class-pattern */` inline (BEM `zbadge__dot`/`ztag--plain`…), `prefers-reduced-motion` neutralise la transition de `ZTag`. Aucun changement Stylelint global.
app/pages/contact.vue:406:  &:focus-visible {
app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/contact.vue:410:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:32:  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:127:  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:130:- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:238:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:267:  &:focus-visible {
app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:270:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:304:  &:focus-visible {
app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:307:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:396:  &:focus-visible {
app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:399:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:69:- **Epic 9** — a11y DS-wide (forced-colors, généralisation titres/listes home/services, audit `_blank`, + sémantique infos `/contact`).
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:102:- ⚠️ **Motion** : caret clignotant = **seule** animation en boucle (respecter `prefers-reduced-motion`) — recoupe le lot motion d'Epic 9.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:34:1. **La revue trouve de vrais bugs invisibles au lint — surtout en a11y.** ~13 des 24 findings sont d'accessibilité : `ZTag` non focusable au clavier (2.5), retour de focus après fermeture du menu mobile (2.8), `aria-current` (2.8), fallback avatar sur image échouée (2.6), `prefers-reduced-motion` sur les lifts de carte (2.4). `lint + typecheck + generate` ne les voit pas ; la revue, oui.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:78:1. **Checklist pré-revue dans chaque consigne d'agent** : « tokens-only (aucune valeur en dur) + a11y (focus visible, clavier Enter/Space, `aria-*`, `prefers-reduced-motion`) » à auto-vérifier avant de passer la story en revue. Complète la règle de périmètre Epic 1 (#1).
app/pages/index.vue:59:                    ><span class="prm__caret" aria-hidden="true"
app/pages/index.vue:388:  &:focus-visible {
app/pages/index.vue:390:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/pages/index.vue:392:    outline: 2px solid transparent;
app/pages/index.vue:394:    box-shadow: var(--ring-accent);
app/pages/index.vue:423:.prm__caret {
app/pages/index.vue:506:  &:focus-visible {
app/pages/index.vue:507:    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/index.vue:508:    outline: 2px solid transparent;
app/pages/index.vue:510:    box-shadow: var(--ring-accent);
app/pages/index.vue:615:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue:617:  .prm__caret {
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:21:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:26:- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:28:  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:29:  - [x] **Exception explicite** : le caret clignotant du terminal **reste** la seule boucle autorisée — confirmer qu'il n'est pas désactivé par mégarde (ou qu'il reste lisible si réduit). **Fait** : terminal réel = caret **natif** de l'`<input>` (`caret-color`/`caret-shape`, non piloté par CSS → intact). Caret décoratif du hero (`.prm__caret`) = figé sur état **visible** (`animation: none` dans le filet global + garde index.vue) plutôt que de sauter à la frame finale `opacity:0` → reste lisible.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:63:- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:67:- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:69:- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:92:- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:97:- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:101:- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:120:- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered). 1ère passe lint : 4 nits stylelint (3× empty-line-before-comment, 1× selector-class-pattern sur `.prm__caret`) → corrigés (lignes vides + `stylelint-disable selector-class-pattern` commenté).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:125:  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:138:- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:140:- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:153:| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:55:- [x] [Review][Defer] `outline:none` + ring `box-shadow` KO en forced-colors [app/pages/index.vue `.offer__more:focus-visible`] — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → focus invisible. Pattern **systémique du DS** (ZButton, etc.), à corriger centralement (`@media (forced-colors: active)` restaurant l'outline) — relève d'Epic 9 (contraste/clavier), pas de cette story. [blind]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:168:- ✅ Resolved review finding [Defer→corrigé ciblé] focus en `forced-colors` : ajout d'un repli `@media (forced-colors: active)` restaurant un `outline` sur les éléments focusables **propres à cette page** (`.offer__more`, `.hero-term__open`) → cette page ne porte plus la dette. **Le repli DS-wide** (ZButton/ZTag/ZCard/ZInput, focus via `box-shadow`) reste un correctif central **assigné à Epic 9** : le traiter ici impliquerait de toucher toutes les primitives Epic 2 (élargissement de périmètre, justement pointé par le finding Decision).
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:182:- 2026-06-22 — Corrections de revue de code : 2 findings [Patch] (aria-label liens, clés v-for stables) + 2 [Defer] traités (retrait `role="img"` sur `.init` ; repli `forced-colors` pour les focusables de la page ; repli DS-wide laissé à Epic 9). Lint/typecheck/generate verts. Statut → review.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:183:- 2026-06-22 — Re-revue (vérification post-fix, commit `132093d`) : 2 patchs confirmés dans le code (aria-label distincts ×3, clés `id` stables) + 2 defers réellement traités (`role="img"` retiré ; `@media (forced-colors: active)` sur `.offer__more`/`.hero-term__open`). `pnpm lint` (0/0) + `pnpm typecheck` verts (couverts par la vérif HEAD `5056196`). Aucune régression. Statut → done.
docs/implementation-artifacts/deferred-work.md:15:- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
docs/implementation-artifacts/deferred-work.md:16:- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
docs/implementation-artifacts/deferred-work.md:27:4. **Audit a11y émulé OS-level** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a **pas** été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules présence/résolution des règles CSS confirmées. À rejouer d'un coup (forced-colors + reduced-motion + lecteur d'écran). _(revues 9.1, 9.2)_
docs/implementation-artifacts/deferred-work.md:28:5. **Unifier les deux idiomes forced-colors** — repli inline `outline: 2px solid transparent` (primitives + châssis, 9.1) vs bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (epic 3). Inoffensif (les deux donnent un focus visible) ; candidat à unification DS-wide. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:48:- **Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a pas été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules la présence/résolution des règles CSS sont confirmées. À rejouer d'un coup lors d'un passage a11y émulé en fin de refonte (cf. aussi item « Émulation forced-colors » de la revue 9.1). _(revue 9.2)_
docs/implementation-artifacts/deferred-work.md:52:- **Unifier les deux idiomes forced-colors** — depuis 9.1, le repli inline `outline: 2px solid transparent; outline-offset: 2px;` (primitives DS + liens du châssis) cohabite avec un bloc page-level `@media (forced-colors: active) { outline: 2px solid }` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Les deux donnent un focus visible en contraste forcé — **inoffensif, non bloquant**. Candidat à une unification DS-wide (un seul idiome) lors d'un futur passage a11y/DS. **Préexistant**, non introduit par 9.1. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:53:- **Émulation `forced-colors: active` non rejouée** — la visibilité réelle de l'anneau sous Windows High Contrast repose sur l'idiome WHCM (outline transparent → couleur système) ; vérifié par présence/résolution des déclarations + précédent codebase, **pas** par émulation visuelle (navigateur MCP verrouillé au moment de la revue). À confirmer d'un coup lors d'un audit a11y émulé (forced-colors + lecteur d'écran) en fin de refonte. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:85:- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
docs/implementation-artifacts/deferred-work.md:99:- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
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
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:42:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:43:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:48:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:50:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:51:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:55:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:63:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:81:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:86:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:88:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:91:  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:99:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:36:4. **L'a11y reste partiellement attrapée en revue — mais traitée avec discipline.** 5.1 : focus-ring `forced-colors`, balises OG/Twitter/canonical. 5.2 : hiérarchie de titres (eyebrows → `<h2 class="eyebrow">` neutralisés), sémantique de listes (expériences `<ol>`, formation/stack `<ul>`/`<li>`). Tout **corrigé localement sur `/about`**, avec rendu strictement identique ; la **généralisation DS-wide explicitement tracée pour l'Epic 9** (cf. §5) plutôt qu'en rustines éparpillées. Choix assumé.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:69:- `forced-colors` DS-wide (rings de focus en `box-shadow` sans repli) — `ZButton` / `ZInput` / liens (depuis Epic 3).
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:73:Chaque report est *justifié* (éviter les correctifs partiels dispersés), mais **Epic 9 devient un morceau conséquent** : à dimensionner réalistement au moment de le planifier. **Aucune perte** : l'inventaire est tracé ici (et dans `deferred-work.md` pour `forced-colors` / `_blank`). *Recommandation : y ajouter explicitement la convention titres/listes DS-wide avant d'attaquer Epic 9.*
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:89:- Dette a11y DS-wide (`forced-colors`, titres/listes, `_blank`) → **Epic 9**. Inventaire ci-dessus (§5).
app/components/FooterComponent.vue:110:  &:focus-visible {
app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:114:    box-shadow: var(--ring-accent);
app/components/FooterComponent.vue:153:  &:focus-visible {
app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:157:    box-shadow: var(--ring-accent);
app/components/FooterComponent.vue:181:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:147:_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:37:  - [x] Implémenter le caret clignotant du DS sur l'`input` (ou un caret rendu) : animation `caret-blink 1s steps(1) infinite` (token `motion.css`), couleur `--prompt`. Aujourd'hui le champ utilise `caret-color: var(--color-green)` natif — décider de garder le caret natif coloré OU de porter le caret bloc `.ds-prompt__caret`, mais une seule approche. → **Décision : caret natif coloré** (`caret-color: var(--prompt)`, `caret-shape: block`), seul choix robuste pour un `<input>` éditable (le caret suit la frappe). Clignote nativement, **aucune animation CSS en boucle ajoutée**.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:40:  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:53:- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:72:- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:75:- **[Med] a11y close + input** → close : `role="button"`, `aria-label`, `tabindex="0"`, `@keydown.enter/.space.prevent`, `:focus-visible` (ring `--accent`) ; input : `aria-label`. Fermeture clavier (Enter) vérifiée.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:117:- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:129:- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:166:- **Caret** : natif coloré (`caret-color: var(--prompt)`, `caret-shape: block`) — choix robuste pour un `<input>` éditable. Clignote nativement ; **aucune animation CSS en boucle introduite** → « caret = seule boucle » respecté par construction, reduced-motion géré par le navigateur.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:302:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:406:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:451:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:468:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:508:Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:837:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:851:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:869:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1438:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1775:app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1827:docs/project-context.md-205-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1847:docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1853:docs/planning-artifacts/epics.md:83:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1864:docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1871:docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2055:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2318:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2320:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2322:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2324:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2431:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2467:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2475:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2476:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2477:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2514:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2750:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2751:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2754:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2832:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2834:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3194:app/assets/scss/main.scss-6-@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3205:app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3207:app/assets/scss/base/_motion.scss-13-//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3217:app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3218:app/assets/scss/base/_motion.scss-24-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3547://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3556://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3558://  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3568:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3569:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3581:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4277:app/components/HeaderComponent.vue:234:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4278:app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4281:app/components/HeaderComponent.vue-238-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4291:app/components/HeaderComponent.vue:267:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4292:app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4294:app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4305:app/components/HeaderComponent.vue:304:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4306:app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4308:app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4333:app/components/HeaderComponent.vue:396:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4334:app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4336:app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4488:app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4634:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4635:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4637:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4639:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4658:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4821:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4822:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4823:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4825:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5565:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:6454:   429	   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
app/components/HexagonLinkComponent.vue:39:  &:focus-visible {
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/3-3-projets-selectionnes.md:46:- [x] [Review][Patch] (ex-Decision — résolu : corriger la primitive `ZCard`, élargissement Epic 2 à noter en rétro) Carte-lien projet sans indicateur de focus visible (a11y) — La carte est rendue en `<a>` focusable (`ZCard as="a"`), mais `ZCard` ne définit que `.zcard--interactive:hover` — **aucun `:focus-visible`** (vérifié `app/components/ui/ZCard.vue`). Au clavier, les liens projet n'ont aucun anneau de focus. Viole `project-context.md#Accessibilité` et la sous-tâche 4 (cochée sur une prémisse fausse : le DS ne définit que le hover, pas le focus). **Fix retenu (décision Simon)** : ajouter dans `app/components/ui/ZCard.vue` `.zcard--interactive:focus-visible { outline: none; box-shadow: var(--ring-accent) }` — corrige toutes les cartes-liens (sans effet de bord : les cartes services 3.2 ne sont pas focusables). Touche Epic 2 → **à remonter en rétrospective Epic 3**. [blind+edge+auditor]
docs/implementation-artifacts/3-3-projets-selectionnes.md:155:- ✅ Resolved review finding [Patch] focus carte-lien : ajout de `.zcard--interactive:focus-visible { outline: none; box-shadow: var(--ring-accent) }` dans `app/components/ui/ZCard.vue`. Corrige **toutes** les cartes interactives focusables (aucun effet sur les cartes non focusables comme les offres services 3.2, en `div`). Vérifié au Chrome DevTools : anneau orange `--ring-accent` (3px) au focus clavier de la carte projet. **Touche `ZCard` (Epic 2)** — décision Simon en revue ; **à remonter en rétrospective Epic 3** (élargissement de périmètre assumé).
docs/implementation-artifacts/3-3-projets-selectionnes.md:163:- `app/components/ui/ZCard.vue` (ajout `:focus-visible` sur `.zcard--interactive` — anneau de focus pour les cartes-liens ; correctif Epic 2 issu de la revue)
docs/implementation-artifacts/3-3-projets-selectionnes.md:170:- 2026-06-22 — Corrections de revue de code : finding [Patch] focus (ajout `:focus-visible` sur `ZCard` interactive, corrige toutes les cartes-liens) + [Defer] traité (libellé sr-only « nouvel onglet » sur les cartes projet). Audit `_blank` site-wide laissé à Epic 9. Lint/typecheck/generate verts. Statut → review.
docs/implementation-artifacts/3-3-projets-selectionnes.md:171:- 2026-06-22 — Re-revue (vérification post-fix, commit `5056196`) : patch focus confirmé dans `ZCard.vue` (`.zcard--interactive:focus-visible` = `--ring-accent`, sans effet de bord) ; span sr-only « nouvel onglet » confirmé (`.screen-reader-text` = utilitaire global réel, masqué visuellement). `pnpm lint` (0/0) + `pnpm typecheck` revérifiés verts via Docker ; aucune régression. Touche `ZCard` (Epic 2) → tracé pour la rétro Epic 3. Statut → done.
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:38:3. **Réutilisation des primitives sans friction.** `ZCard` (featured + badge), `ZButton` (primary/secondary, slot `#iconRight`), `ZBadge`, `ZIcon` consommés tels quels — aucune primitive réimplémentée, aucune correction à *remonter* dans l'Epic 2 (contraste avec Epic 3 où `ZCard:focus-visible` et le fond `default.vue` avaient dû être réparés au point de contact). Signe que les fondations sont stabilisées.
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:82:- `forced-colors` DS-wide + audit `_blank` site-wide → **Epic 9** (`deferred-work.md`).
docs/implementation-artifacts/epic-4-retro-2026-06-23.md:98:- ⚠️ **Reports** : déploiement non prouvé (grossit) ; `forced-colors` / `_blank` → Epic 9.
app/components/ui/ZButton.vue:134:  &:focus-visible {
app/components/ui/ZButton.vue:136:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/components/ui/ZButton.vue:138:    outline: 2px solid transparent;
app/components/ui/ZButton.vue:140:    box-shadow: var(--ring-accent);
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {

exec
/bin/zsh -lc "sed -n '1,180p' app/assets/scss/base/_motion.scss; sed -n '1,180p' app/assets/scss/main.scss" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '1,120p' app/pages/index.vue; sed -n '360,535p' app/pages/index.vue; sed -n '600,635p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '340,470p' app/components/terminal/TerminalComponent.vue; sed -n '110,165p' app/components/ui/ZButton.vue; sed -n '220,270p' app/components/ui/ZButton.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
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
/bin/zsh -lc 'git status --short && git diff --check -- docs/implementation-artifacts/code-reviews/10-4/full.diff && rg --files app | sort' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
 M app/pages/index.vue
 M docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/10-4/
app/app.vue
app/assets/fonts/Ubuntu_Mono/UFL.txt
app/assets/fonts/Ubuntu_Mono/UbuntuMono-Bold.ttf
app/assets/fonts/Ubuntu_Mono/UbuntuMono-BoldItalic.ttf
app/assets/fonts/Ubuntu_Mono/UbuntuMono-Italic.ttf
app/assets/fonts/Ubuntu_Mono/UbuntuMono-Regular.ttf
app/assets/scss/abstract/_animations.scss
app/assets/scss/abstract/_box_shadow.scss
app/assets/scss/abstract/_color.scss
app/assets/scss/abstract/_fonts.scss
app/assets/scss/abstract/_function.scss
app/assets/scss/abstract/_index.scss
app/assets/scss/abstract/_mixin.scss
app/assets/scss/abstract/_radius.scss
app/assets/scss/abstract/_root.scss
app/assets/scss/abstract/_space.scss
app/assets/scss/abstract/_typography.scss
app/assets/scss/abstract/_variables.scss
app/assets/scss/abstract/color/_blue.scss
app/assets/scss/abstract/color/_blue_dark.scss
app/assets/scss/abstract/color/_gray.scss
app/assets/scss/abstract/color/_gray_dark.scss
app/assets/scss/abstract/color/_green.scss
app/assets/scss/abstract/color/_green_dark.scss
app/assets/scss/abstract/color/_orange.scss
app/assets/scss/abstract/color/_orange_dark.scss
app/assets/scss/abstract/color/_pink.scss
app/assets/scss/abstract/color/_pink_dark.scss
app/assets/scss/abstract/color/_purple.scss
app/assets/scss/abstract/color/_purple_dark.scss
app/assets/scss/abstract/color/_red.scss
app/assets/scss/abstract/color/_red_dark.scss
app/assets/scss/abstract/color/_yellow.scss
app/assets/scss/abstract/color/_yellow_dark.scss
app/assets/scss/base/_index.scss
app/assets/scss/base/_layout.scss
app/assets/scss/base/_motion.scss
app/assets/scss/base/_reset.scss
app/assets/scss/components/_button.scss
app/assets/scss/components/_card.scss
app/assets/scss/components/_container.scss
app/assets/scss/components/_index.scss
app/assets/scss/components/_list.scss
app/assets/scss/main.scss
app/assets/scss/pages/_index.scss
app/components/CurrentTime.vue
app/components/FooterComponent.vue
app/components/HeaderComponent.vue
app/components/HexagonLinkComponent.vue
app/components/LinkListComponent.vue
app/components/MainComponent.vue
app/components/WindowWrapperComponent.vue
app/components/card/ZCardBody.vue
app/components/card/ZCardFooter.vue
app/components/card/ZCardHeader.vue
app/components/terminal/TerminalComponent.vue
app/components/terminal/TerminalManagerComponent.vue
app/components/terminal/interfaces/IProgram.ts
app/components/terminal/interfaces/IProgramManager.ts
app/components/terminal/interfaces/ITerminalConfig.ts
app/components/terminal/interfaces/index.ts
app/components/terminal/programs/About.ts
app/components/terminal/programs/Clear.ts
app/components/terminal/programs/Contact.ts
app/components/terminal/programs/HelloWorld.ts
app/components/terminal/programs/Help.ts
app/components/terminal/programs/NewTerminal.ts
app/components/terminal/programs/ProgramManager.ts
app/components/terminal/programs/Projets.ts
app/components/terminal/programs/Skills.ts
app/components/terminal/programs/SystemInfos.ts
app/components/terminal/programs/index.ts
app/components/ui/ZAvatar.vue
app/components/ui/ZBadge.vue
app/components/ui/ZButton.vue
app/components/ui/ZCard.vue
app/components/ui/ZExternalLink.vue
app/components/ui/ZIcon.vue
app/components/ui/ZInput.vue
app/components/ui/ZTag.vue
app/composables/useSiteUrl.ts
app/composables/useTerminal.ts
app/data/site.ts
app/layouts/default.vue
app/pages/about.vue
app/pages/blog/[...slug].vue
app/pages/blog/index.vue
app/pages/contact.vue
app/pages/index.vue
app/pages/services.vue
app/terminal.config.ts
app/utils/formatDate.ts
app/utils/functions.ts
app/utils/seo.ts

exec
/bin/zsh -lc "sed -n '1,180p' app/components/terminal/TerminalComponent.vue; sed -n '180,455p' app/components/terminal/TerminalComponent.vue; sed -n '1,360p' app/components/ui/ZCard.vue; sed -n '1,260p' app/components/ui/ZTag.vue; sed -n '1,260p' app/components/ui/ZInput.vue" in /Users/simon/dev/jouan.ovh
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
const resizing = ref<boolean>(false);
const dragging = ref<boolean>(false);
const dragStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const terminalElement = ref<HTMLElement | null>(null);
const userInputRef = ref<HTMLInputElement | null>(null);
// Élément déclencheur (bouton Terminal du header / CTA /contact) — mémorisé à
// l'ouverture pour y renvoyer le focus à la fermeture (a11y clavier, story 9.2).
const openerElement = ref<HTMLElement | null>(null);
const commandHistory = ref<string[]>([]);
const commandHistoryPosition = ref<number>(-1);
const defaultConfig = ref({
  width: props.terminalConfig.width || terminalDefaults.width,
  height: props.terminalConfig.height || terminalDefaults.height,
  userName: props.terminalConfig.userName || terminalDefaults.userName,
  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
});

if (defaultConfig.value.initialData) {
  commandLines.value.push({
    text: defaultConfig.value.initialData,
    isResponse: true,
  });
}

const focusUserInput = () => {
  if (terminalElement.value) {
    // Garantir que la valeur de zIndex ne dépasse pas la limite du navigateur.
    terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
  }

  // Mettre le focus sur l'élément input
  if (userInputRef.value) {
    userInputRef.value.focus();
  }
};

// Pousse la commande saisie dans l'historique, réinitialise la navigation et vide la saisie.
// Commun à la branche `clear` et au flux normal (factorisation — pas de bookkeeping dupliqué).
const recordHistoryAndResetInput = (): void => {
  commandHistory.value.push(userInput.value);
  commandHistoryPosition.value = -1;
  userInput.value = "";
};

const submitInput = (): void => {
  const command = userInput.value.trim();
  if (command) {
    // `clear` : seul le composant possède le buffer `commandLines` → on l'intercepte ici
    // pour vider l'écran sans écho ni ligne résiduelle. La commande reste découvrable via
    // `help` grâce au programme `programs/Clear.ts` enregistré dans le ProgramManager.
    if (command === "clear") {
      commandLines.value = [];
      recordHistoryAndResetInput();
      return;
    }

    commandLines.value.push({
      text: userInput.value,
      isResponse: false,
    });

    const output = runCommand(command);
    if (output instanceof HTMLElement) {
      commandLines.value.push({ text: output.outerHTML, isResponse: true });
    } else {
      commandLines.value.push({ text: output, isResponse: true });
    }

    recordHistoryAndResetInput();
  }
};

const runCommand = (command: string): string | HTMLElement => {
  const program = programManager.get(command);
  if (program) {
    return program.run(
      { userName: defaultConfig.value.userName },
      props.createNewTerminal as (config?: ITerminalConfig) => void,
      program.initialData,
    );
  }
  // La commande provient de la saisie utilisateur : on l'échappe car la réponse est rendue via v-html.
  return `Commande inconnue : ${escapeHtml(command)}`;
};

const handleHistoryNavigation = (event: KeyboardEvent): void => {
  if (event.key === "ArrowUp") {
    if (commandHistoryPosition.value < commandHistory.value.length - 1) {
      commandHistoryPosition.value++;
      commandHistoryPosition.value++;
    }
  } else if (event.key === "ArrowDown") {
    if (commandHistoryPosition.value > -1) {
      commandHistoryPosition.value--;
    }
  }

  if (commandHistoryPosition.value > -1 && commandHistoryPosition.value < commandHistory.value.length) {
    userInput.value = commandHistory.value[commandHistory.value.length - 1 - commandHistoryPosition.value] ?? "";
  } else {
    userInput.value = "";
  }
};

const handleResizeMouseDown = (event: MouseEvent): void => {
  if (event.target instanceof HTMLElement && event.target.classList.contains("resize-handle")) {
    resizing.value = true;

    // Écouteurs globaux : le redimensionnement continue même si le curseur sort
    // de la poignée de 16px pendant le glissement.
    window.addEventListener("mousemove", handleGlobalResizeMouseMove);
    window.addEventListener("mouseup", handleGlobalResizeMouseUp);
  }
};

const handleGlobalResizeMouseMove = (event: MouseEvent): void => {
  if (resizing.value && terminalElement.value) {
    const terminalRect = terminalElement.value.getBoundingClientRect();
    const minWidth = 320;
    const minHeight = 180;
    const newWidth = Math.max(minWidth, event.clientX - terminalRect.left);
    const newHeight = Math.max(minHeight, event.clientY - terminalRect.top);

    terminalElement.value.style.width = `${newWidth}px`;
    terminalElement.value.style.height = `${newHeight}px`;
  }
};

const handleGlobalResizeMouseUp = (): void => {
  resizing.value = false;
  window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
  window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
};

const handleMouseUp = (): void => {
  resizing.value = false;
  dragging.value = false;
};

const handleHeaderMouseDown = (event: MouseEvent): void => {
  if (
    event.target instanceof HTMLElement &&
    event.currentTarget instanceof HTMLElement &&
    event.currentTarget.parentElement &&
    event.target.classList.contains("terminal-header")
  ) {
    dragging.value = true;
    dragStartPosition.value = {
      x: event.clientX - event.currentTarget.parentElement.offsetLeft,
      y: event.clientY - event.currentTarget.parentElement.offsetTop,
    };

    // Ajouter les écouteurs d'événements globaux
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
  }
};

// Créer une nouvelle fonction pour gérer les événements globaux de déplacement de la souris
const handleGlobalMouseMove = (event: MouseEvent): void => {
  if (dragging.value && terminalElement.value) {
    const terminalElementValue = terminalElement.value;
    // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
    // on le garde collé au bord (0) plutôt que de le pousser hors écran (valeur négative).
    const maxLeft = Math.max(0, window.innerWidth - terminalElementValue.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - terminalElementValue.offsetHeight);
    const newLeft = Math.min(Math.max(0, event.clientX - dragStartPosition.value.x), maxLeft);
    const newTop = Math.min(Math.max(0, event.clientY - dragStartPosition.value.y), maxTop);

    terminalElementValue.style.left = `${newLeft}px`;
    terminalElementValue.style.top = `${newTop}px`;
  }
};

// Créer une nouvelle fonction pour gérer les événements globaux de relâchement de la souris
const handleGlobalMouseUp = (_: MouseEvent): void => {
  if (dragging.value) {
    dragging.value = false;

    // Supprimer les écouteurs d'événements globaux
    window.removeEventListener("mousemove", handleGlobalMouseMove);
    window.removeEventListener("mouseup", handleGlobalMouseUp);
  }
};

const updateTerminalDimensions = (): void => {
  if (terminalElement.value) {
    terminalElement.value.style.width = defaultConfig.value.width;
    terminalElement.value.style.height = defaultConfig.value.height;
  }
};

const closeTerminal = () => {
  if (terminalElement.value) {
    terminalElement.value.style.display = "none";
  }
  // Retour du focus au déclencheur (a11y : ne pas perdre le focus sur <body>
  // à la fermeture clavier — Échap ou Entrée/Espace sur la pastille close).
  openerElement.value?.focus();
};

onMounted(() => {
  updateTerminalDimensions();
  // Mémorise le déclencheur AVANT de déplacer le focus dans le terminal : à ce
  // stade, l'élément actif est encore le bouton qui a ouvert le terminal.
  if (import.meta.client && document.activeElement instanceof HTMLElement) {
    openerElement.value = document.activeElement;
  }
  focusUserInput();
});

watch(
  () => [defaultConfig.value.width, defaultConfig.value.height],
  () => {
    updateTerminalDimensions();
  },
);

onUnmounted(() => {
  // Filet de sécurité : retrait des écouteurs globaux si le composant est démonté en plein drag/resize.
  window.removeEventListener("mousemove", handleGlobalMouseMove);
  window.removeEventListener("mouseup", handleGlobalMouseUp);
  window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
  window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
});
</script>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée de TerminalWindow.jsx */
.terminal {
  // Châssis fenêtre — porté de TerminalWindow.jsx (.ds-term). STYLE uniquement : la
  // logique (drag/resize/close/focus/historique/commandes) et les classes porteuses de
  // handlers (terminal-header, close-button, user-input, resize-handle) sont préservées.
  // `position: fixed` (et non absolute) : le terminal est <Teleport>é sur <body> (pour que
  // son backdrop-filter rende hors du <header> filtré) ; fixed le garde relatif au VIEWPORT,
  // cohérent avec le clamp du drag (window.innerWidth/innerHeight) et évite une fenêtre
  // hors-écran ou un saut de scroll au focus quand la page est défilée.
  // Dimensions/pastilles (px) = structurelles (DS), portées telles quelles.
  box-sizing: border-box;
  position: fixed;
  top: 60px;
  left: 15px;
  z-index: 1000;
  width: 600px;
  height: 400px;
  overflow: hidden;
  resize: both;
  font-family: var(--font-mono);
  color: var(--ink-1);
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

  &:hover {
    color: var(--term-red);
  }

  &:focus-visible {
    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ztag {
    transition: none;
  }
}
</style>
<template>
  <div class="zfield" :class="{ 'zfield--error': error }">
    <label v-if="label" class="zfield__label" :for="fieldId">
      {{ label }}<span v-if="required" class="zfield__req" aria-hidden="true">*</span>
    </label>

    <textarea
      v-if="multiline"
      v-bind="controlAttrs"
      :id="fieldId"
      class="ztextarea"
      :value="modelValue"
      :required="required || undefined"
      :aria-invalid="error || undefined"
      :aria-describedby="describedBy"
      @input="onInput"
    />

    <span v-else class="zinput__wrap">
      <span v-if="icon || $slots.icon" class="zinput__icon">
        <component :is="icon" v-if="icon" aria-hidden="true" />
        <slot v-else name="icon" />
      </span>
      <input
        v-bind="controlAttrs"
        :id="fieldId"
        class="zinput"
        :class="{ 'zinput--has-icon': icon || $slots.icon }"
        :value="modelValue"
        :required="required || undefined"
        :aria-invalid="error || undefined"
        :aria-describedby="describedBy"
        @input="onInput"
      />
    </span>

    <span v-if="hint" :id="hintId" class="zfield__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
// Primitive champ du DS — label mono uppercase, valeur sans-serif, focus ring orange.
// Porté de docs/design_system/components/core/Input.jsx (CSS en <style scoped>, prerender-safe).
// API React (attrs natifs forwarded) → Vue : v-model (modelValue/update:modelValue) + $attrs sur le contrôle.
import type { Component } from "vue";
import { computed, useAttrs, useId } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Valeur liée (v-model). */
  modelValue?: string;
  /** Label mono uppercase au-dessus du contrôle. */
  label?: string;
  /** Texte d'aide / d'erreur sous le contrôle. */
  hint?: string;
  /** Style d'erreur. @default false */
  error?: boolean;
  /** Ajoute un `*` orange au label + `required` natif. @default false */
  required?: boolean;
  /** Rend un <textarea> au lieu d'un <input>. @default false */
  multiline?: boolean;
  /** Icône leading (composant Vue ou nom), input simple uniquement. */
  icon?: string | Component;
  /** id explicite ; sinon généré (hydration-safe via useId). */
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: undefined,
  hint: undefined,
  error: false,
  required: false,
  multiline: false,
  icon: undefined,
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// id déterministe et hydration-safe (useId), surchargeable par la prop `id`.
const generatedId = useId();
const fieldId = computed(() => props.id ?? generatedId);
const hintId = computed(() => `${fieldId.value}-hint`);
const attrs = useAttrs();

const controlledAttrs = new Set([
  "aria-describedby",
  "ariaDescribedby",
  "aria-invalid",
  "ariaInvalid",
  "id",
  "modelValue",
  "required",
  "value",
]);

const controlAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return !controlledAttrs.has(key);
    }),
  );
});

const describedBy = computed(() => {
  const attrDescribedBy = attrs["aria-describedby"] ?? attrs.ariaDescribedby;
  const externalIds = typeof attrDescribedBy === "string" ? attrDescribedBy.trim() : "";

  if (!props.hint) {
    return externalIds || undefined;
  }

  return [externalIds, hintId.value].filter(Boolean).join(" ");
});

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Input.jsx */
.zfield {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.zfield__label {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.zfield__req {
  margin-left: 2px;
  color: var(--accent);
}

.zinput,
.ztextarea {
  box-sizing: border-box;
  width: 100%;
  height: 42px;
  padding: 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  color: var(--text-strong);
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);

  &::placeholder {
    // Contraste (story 9.2) : remonté d'un palier (--text-faint → --text-muted).
    // Le champ porte un <label> ; le placeholder reste supplémentaire mais lisible.
    color: var(--text-muted);
  }

  &:hover {
    border-color: var(--border-strong);
  }

  &:focus {
    // Outline transparent → rendu en couleur système sous forced-colors (où la
    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: var(--accent);
    box-shadow: var(--ring-accent);
  }
}

.ztextarea {
  height: auto;
  min-height: 110px;
  padding: var(--space-3);
  line-height: var(--lh-normal);
  resize: vertical;
}

.zfield--error {
  .zinput,
  .ztextarea {
    border-color: var(--danger);
  }

  .zfield__hint {
    color: var(--danger);
  }
}

.zfield__hint {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.zinput__wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.zinput--has-icon {
  padding-left: calc(var(--space-3) + 1.4em);
}

.zinput__icon {
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;
  color: var(--text-muted);

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .zinput,
  .ztextarea {
    transition: none;
  }
}
</style>

exec
/bin/zsh -lc "sed -n '430,560p' app/components/terminal/TerminalComponent.vue; sed -n '220,430p' app/components/HeaderComponent.vue; sed -n '220,290p' app/pages/about.vue; sed -n '150,290p' app/pages/blog/'[...slug].vue'; sed -n '370,430p' app/pages/contact.vue; rg -n \"<button|<input|<textarea|role=\\\"button\\\"|tabindex=|contenteditable|href=|NuxtLink\" app --glob '*.vue'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:

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
  }

  td {
    padding: 0 0.5em;
  }

  &.w-100 {
    width: calc(100% - 2 * var(--margin));
  }

  &.w-50 {
    width: calc(50% - 2 * var(--margin));
  }

  tbody {
    tr:nth-child(even) {
      background-color: var(--color-grey-light);

      // --color-dark est redéfini localement ci-dessus (le bloc `.terminal` qui exposait
      // --color-text-dark a été retiré au profit des tokens DS) : table auto-suffisante.
      color: var(--color-dark);
    }
  }

  &.w-100 {
    width: calc(100% - 2 * var(--margin));
  }

  &.w-50 {
    width: calc(50% - 2 * var(--margin));

  .hdr__logo {
    font-size: 24px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
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
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-width: 0; // autorise la nav à rétrécir plutôt que de pousser l'overflow
  margin-left: var(--space-4);
}

.hdr__link {
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition:
    color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);

  &:hover {
    color: var(--text-strong);
    background: var(--surface-2);
  }

  // Anneau de focus DS (les liens de nav n'avaient que l'outline UA par défaut).
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__link--active {
  color: var(--accent);
}

.hdr__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

.hdr__clock {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
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

// ---- Dégradé progressif (tablette) pour éviter l'overflow du header
// avant que le burger ne prenne le relais (< 900px). ----
@media (width <= 1100px) {
  .hdr__clock {
    display: none;
  }
}

@media (width <= 1000px) {
  .hdr__badge {
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
  .hdr__clock,
  .hdr__badge,
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
    transition:
      transform var(--dur-base) var(--ease-out),
      opacity var(--dur-base) var(--ease-standard),
      visibility var(--dur-base);
  }

  .hdr__menu--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

.hdr__menu-link {
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-base);
  color: var(--text-body);
  text-decoration: none;
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--text-strong);
    background: var(--surface-2);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__menu-link--active {
  color: var(--accent);
}

.hdr__menu-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  .hdr__link,
  .hdr__menu {
    transition: none;
  }
}
</style>
  margin: 0 0 var(--space-4);
  font-size: var(--fs-md);

  &:last-child {
    margin-bottom: 0;
  }

  // Emphases sur les technologies (porté des <strong> d'About.jsx).
  strong {
    color: var(--text-strong);
  }

  // Lien externe keova.app (porté de l'<a> d'About.jsx) — couleur lien du DS,
  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
  a {
    color: var(--link);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    // Anneau de focus accent + outline transparent : ce dernier reste invisible
    // en rendu normal mais devient une couleur système en `forced-colors`
    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-radius: var(--radius-xs);
      box-shadow: var(--ring-accent);
    }
  }
}

// ---- Stack (porté de About.jsx : bloc sous la bio) ----
// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
.about__stack {
  margin: var(--space-6) 0;
}

// ---- Section CV : grille expériences / formation (porté de About.jsx : 1.4fr / 0.6fr) ----
.about__cv {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: var(--space-12);
}

// ---- Timeline d'expériences (porté de kit.css : .tl*) ----
// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
// Rail vertical + points partagent un même axe (--tl-axis) et sont centrés dessus via
// translateX(-50%). Correction d'un défaut de la maquette : dans kit.css le point
// (left:-22px sur .tl__item, décalé du padding-left) tombait ~2px à droite du rail
// (left:5px sur .tl), les deux centres n'étant pas sur le même axe.
// Px restants = géométrie décorative fine (épaisseur 1px, point 11px, bord 2px,
// retraits verticaux 6px) sans équivalent dans l'échelle de tokens d'espacement.
.tl {
  // Axe du rail, mesuré depuis le bord gauche de .tl.
  --tl-axis: 5px;

  // <ol> : neutraliser puces/numéros et marges UA (reset : margin 0 0 16px 32px).
  position: relative;
  margin: var(--space-5) 0 0;
  padding-left: var(--space-6);
  list-style: none;
}

.tl::before {
  content: "";
  position: absolute;
  top: 6px;
  bottom: 6px;
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis kit.css / Blog.jsx */
// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
// layout globales (app/assets/scss/base/_layout.scss) — non redéclarées ici.
.blog-article {
  display: block;
}

// ---- Conteneur article (porté de kit.css : .article) ----
.article {
  max-width: 760px;
  margin: 0 auto;
}

// Lien retour (porté de kit.css : .hdr__link) — mono discret, soulignement + ring au focus.
.article__back {
  display: inline-block;
  margin-bottom: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;

  &:hover {
    color: var(--text-strong);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.article__tags {
  margin-bottom: var(--space-4);
}

// Titre article (porté de kit.css : .article h1).
.article__title {
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--fs-4xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-tight);
  color: var(--text-strong);
}

// Méta : base mono via .post__meta (global) ; ici on ajoute la marge de l'en-tête.
.article__meta {
  margin: var(--space-4) 0 var(--space-8);
}

// Image héro (porté de kit.css : .article__hero).
.article__hero {
  width: 100%;
  height: 320px;
  margin-bottom: var(--space-8);
  object-fit: cover;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

// ---- Prose (HTML généré par @nuxt/content → cibler via :deep()) ----
// .prose (global) donne déjà font-sans / lh-relaxed / text-body. Ici : taille + rythme
// vertical + titres + code, fidèles à kit.css (.article .prose ...).
.article__prose {
  font-size: var(--fs-md);

  :deep(p) {
    margin: 0 0 var(--space-5);
  }

  :deep(h2) {
    margin: var(--space-8) 0 var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--fs-2xl);
    font-weight: var(--fw-regular);
    line-height: var(--lh-snug);
    color: var(--text-strong);
  }

  :deep(h3) {
    margin: var(--space-6) 0 var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fs-xl);
    font-weight: var(--fw-regular);
    line-height: var(--lh-snug);
    color: var(--text-strong);
  }

  :deep(h4) {
    margin: var(--space-5) 0 var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fs-lg);
    font-weight: var(--fw-medium);
    color: var(--text-strong);
  }

  // Emphase forte = couleur titre (cf. emphases bio /about).
  :deep(strong) {
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }

  // Liens du corps prose : couleur lien DS + ring de focus accessible.
  :deep(a) {
    color: var(--link);
    text-decoration: none;

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

  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
  // garder le titre neutre (couleur héritée, pas de soulignement bleu).
  :deep(h2 a),
  :deep(h3 a),
  :deep(h4 a) {
    color: inherit;
    text-decoration: none;
  }

  // Bloc de code : palette terminale (fond aubergine, mono off-white). Shiki est
  // désactivé → <pre><code> nu, donc pas de styles inline par token à surcharger.
  :deep(pre) {
    margin: 0 0 var(--space-5);
    padding: var(--space-4);
    overflow: auto;
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
app/pages/about.vue:19:              <ZButton :as="NuxtLink" to="/contact" variant="primary">Me contacter</ZButton>
app/pages/about.vue:20:              <ZButton as="a" :href="`mailto:${profile.email}`" variant="secondary">M'écrire</ZButton>
app/pages/about.vue:34:              <ZExternalLink href="https://keova.app" rel="noopener">keova.app</ZExternalLink>, et j'aime mettre l'IA au
app/pages/about.vue:96:import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue:8:          <NuxtLink to="/blog" class="article__back"><span aria-hidden="true">←</span> Retour au blog</NuxtLink>
app/pages/blog/[...slug].vue:48:            <ZButton :as="NuxtLink" to="/contact" variant="primary">
app/pages/blog/[...slug].vue:64:import { NuxtLink } from "#components";
app/pages/blog/[...slug].vue:276:  // Ancres d'auto-lien des titres (@nuxt/content enrobe chaque titre d'un <a href="#…">) :
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:88:import { NuxtLink } from "#components";
app/pages/services.vue:30:                  :as="NuxtLink"
app/pages/services.vue:60:          <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/services.vue:73:import { NuxtLink } from "#components";
app/pages/contact.vue:17:            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
app/pages/contact.vue:30:                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
app/pages/contact.vue:97:                    <a class="contact__email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
app/pages/index.vue:12:              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
app/pages/index.vue:16:              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
app/pages/index.vue:49:                <button
app/pages/index.vue:80:              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
app/pages/index.vue:82:              </NuxtLink>
app/pages/index.vue:102:            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
app/pages/index.vue:125:import { NuxtLink, ZExternalLink } from "#components";
app/components/HeaderComponent.vue:4:      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
app/components/HeaderComponent.vue:7:      </NuxtLink>
app/components/HeaderComponent.vue:10:        <NuxtLink
app/components/HeaderComponent.vue:19:        </NuxtLink>
app/components/HeaderComponent.vue:29:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
app/components/HeaderComponent.vue:33:        <button
app/components/HeaderComponent.vue:50:      <NuxtLink
app/components/HeaderComponent.vue:61:      </NuxtLink>
app/components/HeaderComponent.vue:68:        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
app/components/HeaderComponent.vue:81:import { NuxtLink } from "#components";
app/components/FooterComponent.vue:6:          <NuxtLink to="/" class="ftr__brand">
app/components/FooterComponent.vue:9:          </NuxtLink>
app/components/FooterComponent.vue:15:          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
app/components/FooterComponent.vue:23:            :href="project.url"
app/components/HexagonLinkComponent.vue:2:  <ZExternalLink class="hex" :href="link" rel="noopener noreferrer">
app/components/terminal/TerminalComponent.vue:15:            role="button"
app/components/terminal/TerminalComponent.vue:16:            tabindex="0"
app/components/terminal/TerminalComponent.vue:46:        >&nbsp;<input
app/components/terminal/TerminalComponent.vue:463:      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
app/components/ui/ZButton.vue:10:    :tabindex="isDisabledNonNative ? -1 : undefined"
app/components/ui/ZButton.vue:51:  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
app/components/ui/ZButton.vue:66:// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
app/components/ui/ZInput.vue:7:    <textarea
app/components/ui/ZInput.vue:24:      <input
app/components/ui/ZInput.vue:63:  /** Rend un <textarea> au lieu d'un <input>. @default false */
app/components/ui/ZExternalLink.vue:2:  <a :href="href" :rel="computedRel" target="_blank">
app/components/ui/ZTag.vue:7:    :tabindex="clickableTabindex"
app/components/ui/ZTag.vue:13:    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
app/components/ui/ZCard.vue:51:// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.

exec
/bin/zsh -lc "sed -n '1,120p' app/components/HeaderComponent.vue; sed -n '1,130p' app/components/FooterComponent.vue; sed -n '1,130p' app/components/ui/ZExternalLink.vue; sed -n '1,125p' app/pages/contact.vue; sed -n '1,125p' app/components/HexagonLinkComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <header class="hdr">
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
        <ZIcon name="gem" class="hdr__logo" />
        <b>jouan.ovh</b>
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
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <CurrentTime class="hdr__clock" />
        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
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
        {{ item.label }}
      </NuxtLink>

      <div class="hdr__menu-actions">
        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
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
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

// --- Terminal easter-egg (préservé) ---
const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);

function addNewTerminal() {
  terminalManager.value?.createNewTerminal();
}

// Expose l'ouverture du terminal au reste du site via le lanceur partagé
// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
// monté ici ; on enregistre seulement une référence vers sa méthode.
const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();

// --- Menu mobile accessible ---
const menuOpen = ref(false);
const firstMenuLink = ref<HTMLElement | null>(null);
const burgerButton = ref<HTMLElement | null>(null);

function registerFirstLink(el: Element | ComponentPublicInstance | null, index: number) {
  if (index !== 0) {
<template>
  <footer class="ftr">
    <div class="ftr__container">
      <div class="ftr__in">
        <div class="ftr__brand-col">
          <NuxtLink to="/" class="ftr__brand">
            <ZIcon name="gem" class="ftr__logo" />
            <b>jouan.ovh</b>
          </NuxtLink>
          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
        </div>

        <nav class="ftr__col" aria-label="Navigation du pied de page">
          <h2 class="ftr__title">// Navigation</h2>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
        </nav>

        <div class="ftr__col">
          <h2 class="ftr__title">// Projets</h2>
          <ZExternalLink
            v-for="project in projects"
            :key="project.url"
            :href="project.url"
            rel="noopener noreferrer"
            class="ftr__link"
            >{{ project.name }}</ZExternalLink
          >
        </div>

        <div class="ftr__col">
          <h2 class="ftr__title">// Réseaux</h2>
          <LinkListComponent />
        </div>
      </div>

      <div class="ftr__bottom">
        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LinkListComponent from "~/components/LinkListComponent.vue";
import { SITE } from "~/data/site";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
const projects = SITE.projects;

const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
.ftr {
  margin-top: auto;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 var(--space-8);
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
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  text-decoration: none;

  .ftr__logo {
    font-size: 22px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
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
  color: var(--text-muted);
}

.ftr__col {
  display: flex;
  flex-direction: column;
}

.ftr__title {
  margin: 0 0 var(--space-3);
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
  <main class="contact">
    <section class="section">
      <div class="container">
        <div class="contact__grid">
          <!-- Colonne gauche : en-tête + formulaire (story 7.1) -->
          <div class="contact__main">
            <p class="eyebrow"><span aria-hidden="true">// </span>contact</p>
            <h1 class="contact__title">Parlons de votre projet</h1>
            <p class="prose contact__intro">
              Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds
              sous 48h.
            </p>

            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
                 programmatique (tabindex -1) → annonce fiable aux lecteurs d'écran. -->
            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
              <p class="contact__sent-line"><span aria-hidden="true">✓</span> Message envoyé</p>
              <p class="prose contact__sent-text">Merci ! Je vous réponds très vite à votre adresse.</p>
            </ZCard>

            <!-- Formulaire — envoi via Web3Forms (service sans serveur, clé en env). Validation
                 front d'abord ; `novalidate` pour afficher nos messages FR (et non les bulles
                 natives). Compatible site statique : le fetch ne tourne qu'au clic, côté client. -->
            <form v-else ref="formRef" class="contact__form" novalidate @submit.prevent="onSubmit">
              <!-- Honeypot anti-spam : hors flux visuel et hors tabulation ; rempli = bot. -->
              <div class="contact__hp" aria-hidden="true">
                <label>
                  Ne remplissez pas ce champ
                  <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
                </label>
              </div>

              <div class="contact__row">
                <ZInput
                  v-model="form.name"
                  label="Nom"
                  placeholder="Votre nom"
                  required
                  autocomplete="name"
                  :error="Boolean(errors.name)"
                  :hint="errors.name"
                />
                <ZInput
                  v-model="form.email"
                  label="Email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  autocomplete="email"
                  :error="Boolean(errors.email)"
                  :hint="errors.email"
                />
              </div>
              <ZInput
                v-model="form.subject"
                label="Sujet"
                placeholder="Site WordPress, application, IA…"
                autocomplete="off"
              />
              <ZInput
                v-model="form.message"
                label="Message"
                multiline
                placeholder="Parlez-moi de votre projet…"
                required
                :error="Boolean(errors.message)"
                :hint="errors.message"
              />

              <!-- Erreur d'envoi réseau (distincte des erreurs de validation par champ). -->
              <p v-if="submitError" class="contact__error" role="alert">{{ submitError }}</p>

              <div>
                <ZButton type="submit" variant="primary" size="lg" :disabled="sending">
                  {{ sending ? "Envoi en cours…" : "Envoyer le message" }}
                  <template #iconRight><ZIcon name="arrow" /></template>
                </ZButton>
              </div>

              <p class="contact__rgpd">
                En envoyant ce formulaire, vos nom, email et message sont transmis via Web3Forms à seule fin de traiter
                votre demande.
              </p>
            </form>
          </div>

          <!-- Colonne droite (story 7.2) : carte infos + carte CTA terminal + hexagones sociaux -->
          <div class="contact__info">
            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
            <!-- Carte infos : email / localisation / disponibilité -->
            <ZCard class="contact__infocard">
              <dl class="contact__infolist">
                <div class="infoitem">
                  <dt class="infoitem__k"><span aria-hidden="true">// </span>email</dt>
                  <dd class="infoitem__v">
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

exec
/bin/zsh -lc "rg -n \"\\.anim|fade-rise|caret-blink|animation:|transition:\" app/pages/index.vue app/assets app/components --glob '*.vue' --glob '*.scss' | head -220" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue:191:// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
app/pages/index.vue:192:.anim {
app/pages/index.vue:193:  animation: fade-rise var(--dur-slow) var(--ease-out) both;
app/pages/index.vue:432:  animation: caret-blink 1s steps(1) infinite;
app/pages/index.vue:616:  .anim,
app/pages/index.vue:618:    animation: none;
app/components/HeaderComponent.vue:257:  transition:
app/components/HeaderComponent.vue:370:    transition:
app/components/HeaderComponent.vue:417:    transition: none;
app/components/FooterComponent.vue:146:  transition: color var(--dur-fast) var(--ease-standard);
app/components/FooterComponent.vue:183:    transition: none;
app/components/HexagonLinkComponent.vue:30:  transition:
app/components/HexagonLinkComponent.vue:60:    transition: none;
app/assets/scss/base/_motion.scss:37:    animation: none !important;
app/components/WindowWrapperComponent.vue:314:    transition: opacity 0.5s ease-in-out;
app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
app/components/card/ZCardBody.vue:29:    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
app/components/card/ZCardBody.vue:35:    animation: none;
app/assets/scss/components/_button.scss:100:  transition: color 0.15s ease-in-out, background 0.15s ease-in-out, border-color 0.15s ease-in-out;
app/components/ui/ZButton.vue:128:  transition:
app/components/ui/ZButton.vue:249:    transition: none;
app/assets/scss/abstract/_root.scss:209:// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
app/assets/scss/abstract/_root.scss:210:@keyframes caret-blink {
app/assets/scss/abstract/_root.scss:222:@keyframes fade-rise {
app/components/ui/ZInput.vue:160:  transition:
app/components/ui/ZInput.vue:236:    transition: none;
app/components/ui/ZCard.vue:75:  transition:
app/components/ui/ZCard.vue:123:    transition: none;
app/components/ui/ZTag.vue:124:  transition:
app/components/ui/ZTag.vue:186:    transition: none;

exec
/bin/zsh -lc "rg -n \"WindowWrapperComponent|<WindowWrapper|window-wrapper|class=\\\"window\" app docs --glob '"'!docs/implementation-artifacts/code-reviews/10-4/full.diff'"' | head -100; sed -n '180,235p' app/assets/scss/abstract/_root.scss; sed -n '300,365p' app/components/WindowWrapperComponent.vue; rg -n \"@use|@import\" app --glob '*.scss' --glob '*.vue'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/project-context.md:24:- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
docs/project-context.md:42:  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
docs/project-context.md:293:Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:35:  - [x] Confirmer que toute transition hover passe par les tokens motion (`--dur-fast`/`--dur-base`, `--ease-out`) — pas de durée/easing en dur. **Vérifié** : toutes les transitions live consomment les tokens motion ; seul résidu de durée en dur = `_button.scss` (legacy **non importé** par `main.scss`, dead code) + `WindowWrapperComponent`/`CurrentTime` (résidu Options API header, hors périmètre) + delays d'entrée intentionnels (motion = 9.2).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:131:- **Hors périmètre, respecté** : motion réduit / contraste / navigabilité clavier complète = **story 9.2** (non traités ici, sauf visibilité du focus qui est partagée et prioritaire). `_button.scss` (durée `0.15s` en dur) = SCSS legacy **non importé** par `main.scss` (dead code) → non corrigé. `WindowWrapperComponent`/`CurrentTime` (durées en dur) = résidu Options API header, hors « refonte ».
docs/implementation-artifacts/1-3-migrer-loutillage-lint-vers-eslint-9.md:133:- **Régression `--fix` rattrapée** : `--fix` retirait les préfixes `-webkit-` (autoprefixer non câblé dans ce projet). `-webkit-backdrop-filter` restauré (Safari) dans `TerminalComponent.vue` et `WindowWrapperComponent.vue` avec `stylelint-disable-next-line property-no-vendor-prefix` documenté ; doublons `animation` issus du strip de `-webkit-animation` (préfixe obsolète) nettoyés dans `FooterComponent.vue` et `ZCardComponent.vue`.
docs/implementation-artifacts/1-3-migrer-loutillage-lint-vers-eslint-9.md:142:**Correctifs de revue (2026-06-19)** — Créés : `CLAUDE.md` (convention Docker). Modifiés : `.stylelintrc.json` (override `postcss-html` pour `**/*.vue`), `package.json` + `pnpm-lock.yaml` (`postcss-html` + globs `lint`/`lint:style` élargis aux `.vue`), `eslint.config.mjs` (Prettier en dernier), `app/pages/index.vue` (`.rotate-y-180` + `--fix`), `app/components/terminal/TerminalComponent.vue` & `app/components/WindowWrapperComponent.vue` (restauration `-webkit-backdrop-filter` + `--fix`), `app/components/FooterComponent.vue` & `app/components/card/ZCardComponent.vue` (dédup `animation` + `--fix`), `app/components/HeaderComponent.vue`, `app/components/HexagonLinkComponent.vue`, `app/components/card/ZCardFooter.vue`, `app/components/terminal/TerminalButton.vue`, `app/layouts/default.vue`, `app/pages/blog/index.vue` (reformatage `--fix` mécanique des `<style>`).
docs/implementation-artifacts/3-1-hero-terminal-a.md:25:  - [x] Retirer l'ancien hero (`WindowWrapperComponent` + image `undraw_programming`) — il sera remplacé par le hero terminal
docs/implementation-artifacts/3-1-hero-terminal-a.md:81:- **`pages/index.vue`** (UPDATE — à refondre) — état actuel : ancien hero `WindowWrapperComponent` + image `undraw_programming_re_kg9v.svg`, styles scoped legacy (`fs-5x`, `hero-banner`…). À **remplacer** par le hero Terminal (A). Le `<script>` actuel utilise `defineComponent({ name: "Home" })` + `defineProps`-like `getAttr` — passer en `<script setup lang="ts">` propre. [Source: pages/index.vue]
docs/implementation-artifacts/3-1-hero-terminal-a.md:115:- Ne pas réintroduire l'image `undraw` ni `WindowWrapperComponent` dans le hero refondu.
docs/implementation-artifacts/3-1-hero-terminal-a.md:154:- `pages/index.vue` entièrement refondu : ancien hero (`WindowWrapperComponent` + image `undraw_programming`) retiré, remplacé par le hero Terminal (A) en `<script setup lang="ts">`. Structure `<main class="home">` → `<section class="hero hero__grad">` → `.hero__in.container` → `.hero__grid` deux colonnes.
docs/implementation-artifacts/3-1-hero-terminal-a.md:174:- `WindowWrapperComponent.vue` et l'image `undraw_programming_re_kg9v.svg` ne sont plus référencés par `/` mais ne sont pas supprimés (hors périmètre ; possiblement utilisés ailleurs / legacy à traiter séparément).
docs/implementation-artifacts/8-3-migrer-composants-terminal-script-setup.md:25:> Périmètre : **migration `<script setup>` des coquilles Vue du sous-système terminal** (`TerminalComponent.vue`, `TerminalManagerComponent.vue`). Les **classes `programs/*` (`IProgram`) et `interfaces/`** sont déjà du **TS pur** — **ne pas les réécrire**. Le **restyle** (8.1) et l'**ajout des programmes manquants / vérif commandes** (8.2) sont hors de cette story. `WindowWrapperComponent` / `CurrentTime` (Options API, mais propres au **header**) sont **hors périmètre** (résidu legacy distinct, cf. Dev Notes).
docs/implementation-artifacts/8-3-migrer-composants-terminal-script-setup.md:67:- **`WindowWrapperComponent.vue` / `CurrentTime.vue`** : encore en Options API mais **propres au header** (`HeaderComponent`), pas au terminal. Résidu legacy **distinct** — à migrer hors « refonte du terminal » (cleanup optionnel séparé, à tracer si souhaité). Ne pas les embarquer ici pour ne pas régresser le header.
docs/implementation-artifacts/8-3-migrer-composants-terminal-script-setup.md:123:- **Hors périmètre, respecté** : `programs/*` + `interfaces/` (TS pur) non touchés ; `WindowWrapperComponent`/`CurrentTime` (Options API mais côté header) non embarqués.
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:63:- [x] [Review][Patch] Positionner le bouton de fermeture de `WindowWrapperComponent` relativement à la fenêtre [app/components/WindowWrapperComponent.vue:319]
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:196:- `app/components/WindowWrapperComponent.vue` — bouton fermer `position: absolute`, bornage drag, cleanup `onUnmounted`
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:134:- **Hors périmètre / non régressé** : apparence des états = 9.1 (non re-spécifiée) ; `WindowWrapperComponent`/`CurrentTime` (résidu Options API header) non étendus ; `_button.scss`/`_animations.scss` legacy non importés laissés tels quels (dead code).
docs/implementation-artifacts/10-2-a11y-semantique-residuelle.md:127:- [x] [Review][Defer] Rôle dialog et accessibilité interne de la fenêtre terminal [app/components/WindowWrapperComponent.vue:2] — deferred, pre-existing
docs/implementation-artifacts/deferred-work.md:124:- **Rôle dialog et accessibilité interne de la fenêtre terminal** — Les déclencheurs du terminal (`contact.vue`, `index.vue`) portent désormais `aria-haspopup="dialog"`, mais la fenêtre elle-même (`WindowWrapperComponent.vue`) ne porte pas encore de `role="dialog"`, `aria-modal="true"`, ni de piège de focus. Composant hérité Options API propre au header (hors périmètre 10.2). À traiter lors d'une refonte / consolidation a11y du terminal ou en story 10.4. _(revue 10.2 — Blind + Edge Case Hunter)_
app/components/WindowWrapperComponent.vue:2:  <div class="window-wrapper">
app/components/WindowWrapperComponent.vue:3:    <div ref="windowElement" class="window" @click="focus">
app/components/WindowWrapperComponent.vue:4:      <div class="window-header visible" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
app/components/WindowWrapperComponent.vue:9:        class="window-body"
app/components/WindowWrapperComponent.vue:34:  name: "WindowWrapperComponent",
app/components/WindowWrapperComponent.vue:244:.window-wrapper {
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:33:3. **Filet motion global + exception caret nette (9.2).** `base/_motion.scss` ramène animations/transitions à l'instantané site-wide (couvre tout ajout futur). **Exception CAP-11** correctement gérée : terminal réel = caret **natif** (non-CSS, intact) ; caret déco du hero **figé visible** (pas sauté à `opacity:0`). Audit : `WindowWrapperComponent` (loop `blink`) = dead code non monté.
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:100:- ⚠️ **Terrain le plus *legacy* du codebase** : `components/terminal/` est en **Options API** (`TerminalComponent`, `WindowWrapperComponent`, `TerminalManagerComponent`) + classes `IProgram` (TS pur, inchangées par la migration). **Décision : refonte complète** (migration `<script setup>` + restyle DS), pas restyle-only.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:656:- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:674:  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5160:app/components/WindowWrapperComponent.vue-335-        filter: brightness(1.2);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5161:app/components/WindowWrapperComponent.vue-336-      }
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5162:app/components/WindowWrapperComponent.vue-337-    }
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5163:app/components/WindowWrapperComponent.vue-338-  }
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5164:app/components/WindowWrapperComponent.vue-339-
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5165:app/components/WindowWrapperComponent.vue:340:  &-body {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5166:app/components/WindowWrapperComponent.vue-341-    margin: 0;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5167:app/components/WindowWrapperComponent.vue-342-    padding: 0;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5168:app/components/WindowWrapperComponent.vue-343-    height: calc(100% - var(--wh-height));
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5169:app/components/WindowWrapperComponent.vue-344-    overflow: auto;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:5170:app/components/WindowWrapperComponent.vue-345-    background-color: var(--wwc-color-aubergine-dark);
docs/implementation-artifacts/code-reviews/10-2/raw-blind-hunter.md:632:app/components/WindowWrapperComponent.vue:22:            <slot />
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:725:    24	- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:743:    42	  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:994:   293	Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
docs/implementation-artifacts/code-reviews/10-3/raw-edge-case-hunter.json:703:docs/implementation-artifacts/1-3-migrer-loutillage-lint-vers-eslint-9.md:142:**Correctifs de revue (2026-06-19)** — Créés : `CLAUDE.md` (convention Docker). Modifiés : `.stylelintrc.json` (override `postcss-html` pour `**/*.vue`), `package.json` + `pnpm-lock.yaml` (`postcss-html` + globs `lint`/`lint:style` élargis aux `.vue`), `eslint.config.mjs` (Prettier en dernier), `app/pages/index.vue` (`.rotate-y-180` + `--fix`), `app/components/terminal/TerminalComponent.vue` & `app/components/WindowWrapperComponent.vue` (restauration `-webkit-backdrop-filter` + `--fix`), `app/components/FooterComponent.vue` & `app/components/card/ZCardComponent.vue` (dédup `animation` + `--fix`), `app/components/HeaderComponent.vue`, `app/components/HexagonLinkComponent.vue`, `app/components/card/ZCardFooter.vue`, `app/components/terminal/TerminalButton.vue`, `app/layouts/default.vue`, `app/pages/blog/index.vue` (reformatage `--fix` mécanique des `<style>`).
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:1049:app/components/WindowWrapperComponent.vue:111:        event.target instanceof HTMLElement &&
docs/implementation-artifacts/code-reviews/10-3/raw-blind-hunter.md:1050:app/components/WindowWrapperComponent.vue:114:        event.target.classList.contains("window-header")
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:658:- **UI :** Vue 3 — `<script setup lang="ts">` pour tout nouveau composant. `vue-property-decorator` et l'option `experimentalDecorators` ont été **retirés** (Epic 3, aucun usage réel). ✅ **Epic 8 terminé : le sous-système `components/terminal/` est intégralement migré en `<script setup>`** (coquilles `TerminalComponent` + `TerminalManagerComponent` ; stories 8.1 restyle DS, 8.2 commandes, 8.3 migration). Les classes `programs/*` (`IProgram`) sont du TS pur et ne bougent pas. **Dernier résidu Options API du codebase : `WindowWrapperComponent` / `CurrentTime`, propres au header** (`defineComponent`, sans décorateur) — ne pas les étendre ; cleanup optionnel séparé (hors « refonte du terminal », non planifié). Toute migration future sans framework de test : vérifier **commande/comportement avant-après** au navigateur (Chrome DevTools MCP).
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:676:  sans décorateur) : `WindowWrapperComponent` / `CurrentTime`, **côté header** — ne
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1055:docs/project-context.md:293:Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1439:app/components/WindowWrapperComponent.vue-312-    cursor: move;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1440:app/components/WindowWrapperComponent.vue-313-    opacity: 0;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1441:app/components/WindowWrapperComponent.vue:314:    transition: opacity 0.5s ease-in-out;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1442:app/components/WindowWrapperComponent.vue-315-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1443:app/components/WindowWrapperComponent.vue-316-    &.visible {
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1445:app/components/WindowWrapperComponent.vue-350-.cursor-blink {
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1446:app/components/WindowWrapperComponent.vue-351-  display: inline-block;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1447:app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1448:app/components/WindowWrapperComponent.vue-353-}
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1449:app/components/WindowWrapperComponent.vue-354-
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:1969:docs/implementation-artifacts/epic-9-retro-2026-06-29.md-33-3. **Filet motion global + exception caret nette (9.2).** `base/_motion.scss` ramène animations/transitions à l'instantané site-wide (couvre tout ajout futur). **Exception CAP-11** correctement gérée : terminal réel = caret **natif** (non-CSS, intact) ; caret déco du hero **figé visible** (pas sauté à `opacity:0`). Audit : `WindowWrapperComponent` (loop `blink`) = dead code non monté.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2076:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-131-- **Hors périmètre, respecté** : motion réduit / contraste / navigabilité clavier complète = **story 9.2** (non traités ici, sauf visibilité du focus qui est partagée et prioritaire). `_button.scss` (durée `0.15s` en dur) = SCSS legacy **non importé** par `main.scss` (dead code) → non corrigé. `WindowWrapperComponent`/`CurrentTime` (durées en dur) = résidu Options API header, hors « refonte ».
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2148:docs/implementation-artifacts/code-reviews/10-3/raw-acceptance-auditor.md:994:   293	Dernière mise à jour : 2026-06-29 (post-Epic 8 : refonte terminal **livrée** — `components/terminal/` intégralement en `<script setup>`, commandes `skills`/`projets`/`contact`/`clear` ajoutées, dernier résidu Options API = `WindowWrapperComponent`/`CurrentTime` côté header ; source de contenu partagé unique `app/data/site.ts` (DRY) ; checklist a11y forced-colors/clavier/contraste à embarquer en amont des consignes Epic 9 — dernier épic, puis fin de refonte SEO + RGPD + déploiement gh-pages ; post-Epic 7 : décision Epic 8 = refonte complète du terminal — migration `components/terminal/` vers `<script setup>` + restyle DS, vérif commande-par-commande ; Web3Forms acté côté SPEC pour le formulaire `/contact` ; post-Epic 6 : pipeline `@nuxt/content` v3 — collections typées `content.config.ts`, Shiki désactivé, gotchas Docker/SQLite + `:deep()` ancres de titres ; post-Epic 5 : primitives de layout globales `base/_layout.scss` + convention a11y titres/listes — eyebrow-as-`h2`, séquences en `<ol>`/`<ul>` ; post-Epic 4 : réfs visuelles par page précisées pour la routine de diff avant revue ; post-Epic 3 : pièges `padding` shorthand multi-classes + vérif visuelle Chrome DevTools avant revue pour les stories de page ; post-Epic 2 : stack réelle Nuxt 4 / TS 6 / ESLint 10 flat / @nuxt/content 3, primitives DS `ui/`, tokens CSS globaux, règles a11y)
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2343:docs/implementation-artifacts/epic-7-retro-2026-06-26.md-100-- ⚠️ **Terrain le plus *legacy* du codebase** : `components/terminal/` est en **Options API** (`TerminalComponent`, `WindowWrapperComponent`, `TerminalManagerComponent`) + classes `IProgram` (TS pur, inchangées par la migration). **Décision : refonte complète** (migration `<script setup>` + restyle DS), pas restyle-only.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2369:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:2428:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:3639:docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:270:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md:3652:docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:283:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:270:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:283:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:1109:app/components/WindowWrapperComponent.vue
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:3338:app/components/WindowWrapperComponent.vue:314:    transition: opacity 0.5s ease-in-out;
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md:3339:app/components/WindowWrapperComponent.vue:352:  animation: blink 1s steps(1, start) infinite;
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
  }

  &-header {
    z-index: 1;
    height: var(--wh-height);
    padding: 0.25rem;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    text-align: center;
    background-color: var(--wwc-color-grey-dark);
    position: absolute;
    width: 100%;
    cursor: move;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;

    &.visible {
      opacity: 1;
    }

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
app/assets/scss/base/_reset.scss:1:@use "../abstract/space";
app/assets/scss/base/_index.scss:1:@use "reset";
app/assets/scss/main.scss:1:@use "base/reset";
app/assets/scss/main.scss:2:@use "abstract/root"; // tokens DS globaux (:root CSS custom properties) — source de vérité
app/assets/scss/main.scss:3:@use "abstract/fonts";
app/assets/scss/main.scss:4:@use "abstract/typography";
app/assets/scss/main.scss:5:@use "base/layout"; // primitives de layout DS (.section / .container / .eyebrow / .prose) mutualisées
app/assets/scss/main.scss:6:@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
app/assets/scss/components/_card.scss:1:@use "../abstract/function";
app/assets/scss/components/_card.scss:2:@use "../abstract/radius";
app/assets/scss/components/_card.scss:3:@use "../abstract/variables";
app/assets/scss/components/_card.scss:4:@use "../abstract/space";
app/assets/scss/components/_list.scss:1:@use "../abstract/space";
app/assets/scss/components/_button.scss:1:@use "../abstract/function";
app/assets/scss/components/_button.scss:2:@use "../abstract/radius";
app/assets/scss/components/_button.scss:3:@use "../abstract/variables";
app/assets/scss/components/_button.scss:4:@use "../abstract/space";
app/assets/scss/components/_button.scss:5:@use "../abstract/color" as _color;
app/assets/scss/components/_container.scss:1:@use "../abstract/function";
app/assets/scss/components/_container.scss:2:@use "../abstract/space";
app/assets/scss/components/_container.scss:3:@use "sass:map";
app/assets/scss/components/_index.scss:1:@use "button";
app/assets/scss/components/_index.scss:2:@use "list";
app/assets/scss/components/_index.scss:3:@use "container";
app/assets/scss/components/_index.scss:4:@use "card";
app/assets/scss/components/_index.scss:5:@use "hexagone";
app/assets/scss/abstract/_color.scss:1:@use "color/blue" as _blue;
app/assets/scss/abstract/_color.scss:2:@use "color/red" as _red;
app/assets/scss/abstract/_color.scss:3:@use "color/yellow" as _yellow;
app/assets/scss/abstract/_color.scss:4:@use "color/green" as _green;
app/assets/scss/abstract/_color.scss:5:@use "color/gray" as _gray;
app/assets/scss/abstract/_color.scss:6:@use "color/gray_dark" as _gray_dark;
app/assets/scss/abstract/_color.scss:7:@use "color/orange" as _orange;
app/assets/scss/abstract/_color.scss:8:@use "color/pink_dark" as _pinkDark;
app/assets/scss/abstract/_function.scss:1:@use "variables";
app/assets/scss/abstract/_function.scss:2:@use "sass:map";
app/assets/scss/abstract/_box_shadow.scss:1:@use "variables";
app/assets/scss/abstract/_box_shadow.scss:2:@use "color" as _color;
app/assets/scss/abstract/_radius.scss:1:@use "sass:math";
app/assets/scss/abstract/_typography.scss:1:@use "function";
app/assets/scss/abstract/_typography.scss:2:@use "variables";
app/assets/scss/abstract/_typography.scss:3:@use "mixin";
app/assets/scss/abstract/_typography.scss:4:@use "space";
app/assets/scss/abstract/_index.scss:1:@use "variables";
app/assets/scss/abstract/_index.scss:2:@use "color";
app/assets/scss/abstract/_index.scss:3:@use "animations";
app/assets/scss/abstract/_index.scss:4:@use "function";
app/assets/scss/abstract/_index.scss:5:@use "fonts";
app/assets/scss/abstract/_index.scss:6:@use "typography";
app/assets/scss/abstract/_index.scss:7:@use "mixin";
app/assets/scss/abstract/_index.scss:8:@use "root";
app/components/WindowWrapperComponent.vue:238:@use "assets/scss/abstract/color" as _color;
app/components/WindowWrapperComponent.vue:239:@use "assets/scss/abstract/variables" as _variables;
app/components/WindowWrapperComponent.vue:240:@use "assets/scss/abstract/space" as _space;
app/components/WindowWrapperComponent.vue:241:@use "assets/scss/abstract/function" as _function;
app/components/WindowWrapperComponent.vue:242:@use "assets/scss/abstract/box_shadow" as _boxShadow;
app/components/card/ZCardBody.vue:15:@use "assets/scss/abstract/animations";
app/components/MainComponent.vue:14:@use "assets/scss/abstract/space";

2026-09-13T08:20:17.811881Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "find docs/implementation-artifacts/code-reviews/10-4 -maxdepth 1 -type f -print -exec wc -l {} \\;" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md
    3612 docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-4/prompt-edge-case-hunter.md
      18 docs/implementation-artifacts/code-reviews/10-4/prompt-edge-case-hunter.md
docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json
    2349 docs/implementation-artifacts/code-reviews/10-4/raw-edge-case-hunter.json
docs/implementation-artifacts/code-reviews/10-4/prompt-blind-hunter.md
       8 docs/implementation-artifacts/code-reviews/10-4/prompt-blind-hunter.md
docs/implementation-artifacts/code-reviews/10-4/full.diff
     129 docs/implementation-artifacts/code-reviews/10-4/full.diff
docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md
      14 docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md
docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md
    5622 docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md

2026-09-13T08:20:22.834564Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md; sed -n '260,420p' docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md" in /Users/simon/dev/jouan.ovh
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
session id: 01a099d9-06ee-7f61-848e-03a37f0f292c
--------
user
# Blind Hunter Prompt — Story 10.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to inspect the supplied diff skeptically and return at least ten concrete findings in the requested description-only Markdown list.
exec
/bin/zsh -lc 'cat /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md' in /Users/simon/dev/jouan.ovh
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

Output findings as a Markdown list (descriptions only).


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/10-4/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/10-4/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     129 docs/implementation-artifacts/code-reviews/10-4/full.diff
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

exec
/bin/zsh -lc "rg -n --hidden -g '"'!node_modules'"' -g '"'!dist'"' -g '"'!*.lock'"' \"forced-colors|focus-visible|prefers-reduced-motion|prm__caret|caret-shape|box-shadow: var\\(--ring|outline: 2px solid transparent\" app docs/implementation-artifacts | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/about.vue:243:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/about.vue:245:    &:focus-visible {
app/pages/about.vue:246:      outline: 2px solid transparent;
app/pages/about.vue:249:      box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:180:  &:focus-visible {
app/pages/blog/[...slug].vue:181:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:184:    box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:268:    &:focus-visible {
app/pages/blog/[...slug].vue:269:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:272:      box-shadow: var(--ring-accent);
docs/implementation-artifacts/2-4-primitive-zcard.md:47:- [x] [Review][Patch] Respecter `prefers-reduced-motion` pour les transitions/lift de `ZCard` et l'animation de `ZCardBody` [app/components/ui/ZCard.vue:54]
docs/implementation-artifacts/2-4-primitive-zcard.md:120:- **Revue `ZCard`** : `as="button"` injecte `type="button"` par défaut tout en respectant un `type` explicite ; les autres attrs restent passthrough. `prefers-reduced-motion` neutralise la transition et le lift hover.
docs/implementation-artifacts/2-4-primitive-zcard.md:126:  - `ZCardBody.vue` : `padding var(--space-4)`, `color var(--text-body)`, **titre slotté `:slotted(h1)` en `color var(--text-strong)`** — corrige la régression dark-first (le titre était en gris foncé, illisible sur le fond sombre `--bg-card`). Animation `fadeIn` conservée via tokens `--dur-slower`/`--ease-out`, désactivée si `prefers-reduced-motion: reduce`.
docs/implementation-artifacts/10-3-liens-externes-accessibles.md:70:- **Focus visible (9.1)** : le helper ne doit pas réintroduire `outline: none` sans repli forced-colors. Réutiliser les anneaux DS existants.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:18:  - 9.1 — États interactifs cohérents : audit focus/hover/press ; **zéro nouvelle UI**. Hover/press déjà token-driven (aucun changement) ; travail réel = **visibilité du focus** (repli `forced-colors` aux primitives + anneau DS sur les liens du châssis).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:19:  - 9.2 — Motion réduit, contraste, clavier : filet global `prefers-reduced-motion` + exception caret ; audit contraste WCAG (`--text-faint`→`--text-muted`) ; clavier (Échap ferme le terminal + retour de focus).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:31:2. **`forced-colors` réglé au bon niveau (9.1).** Le repli (rings `box-shadow` invisibles en contraste forcé) posé **une seule fois à la source** — `ZButton`/`ZCard`/`ZTag`/`ZInput`, `outline: none` → `outline: 2px solid transparent` — plutôt que page par page. Solde l'item DS-wide #1 qui traînait depuis l'Epic 3. Lacune comblée au passage : les liens du châssis (logo, nav, footer) n'avaient que l'outline navigateur → anneau DS ajouté.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:39:6. **Deux limites honnêtes (cf. §5) :** vérification a11y **partielle** (forced-colors + reduced-motion non émulables via MCP) et **panier a11y d'Epic 9 non vidé** (3 items orphelins).
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:47:| **Checklist a11y en amont** (forced-colors / clavier / contraste) dans la consigne 9.1/9.2 | ✅ **Tenu** | Dev Notes/tâches des deux stories structurées autour de ces axes avec sources DS (9.1 T4 focus/forced-colors ; 9.2 T2 contraste, T3 clavier). |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:48:| **A1 — diff visuel/comportemental** | ⚠️ **Tenu partiellement** | Comportemental clavier au navigateur (sweep Tab, terminal Échap, form contact) ; mais **forced-colors + reduced-motion non émulables** → vérif visuelle incomplète (tracée). Limite d'outil, pas de discipline. |
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:58:- **Correctifs a11y au bon niveau** : forced-colors à la source (primitives), filet motion global — pas de rustines page par page.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:70:1. **Le panier a11y d'Epic 9 n'est pas vidé.** `deferred-work.md` avait routé **quatre** items a11y vers « Epic 9» ; les stories 9.1/9.2 en ont traité **un** (forced-colors). Restent **orphelins** (Epic 9 ferme, pas d'Epic 10 au démarrage) :
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:77:2. **Vérification a11y partielle.** `forced-colors` et `prefers-reduced-motion` **ne sont pas émulables** via Chrome DevTools MCP. Présence/résolution des règles CSS confirmées + précédent codebase, mais **pas** l'effet runtime visuel. La correction a11y de 9.1/9.2 n'est donc pas prouvée à l'œil → un **audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) reste à faire.
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:94:  1. **A11y résiduel** : titres/listes home+services (+ process `<ol>`), audit `target="_blank"`, sémantique `/contact`, unification des idiomes forced-colors ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:95:  2. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) ;
docs/implementation-artifacts/epic-9-retro-2026-06-29.md:140:4. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) — la vérif que le MCP ne permettait pas.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:38:  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:129:  - **a11y** : `×` = `<button type="button" aria-label="Retirer">` + `:focus-visible` ring (`--ring-accent`). Le tag cliquable reçoit `role="button"`, `tabindex="0"` par défaut, activation `Enter`/`Space`, et focus ring.
docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:132:- **Conventions revues 2.3/2.4 appliquées** : `/* stylelint-disable selector-class-pattern */` inline (BEM `zbadge__dot`/`ztag--plain`…), `prefers-reduced-motion` neutralise la transition de `ZTag`. Aucun changement Stylelint global.
app/pages/contact.vue:406:  &:focus-visible {
app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/contact.vue:410:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:32:  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:127:  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:130:- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:238:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:267:  &:focus-visible {
app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:270:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:304:  &:focus-visible {
app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:307:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:396:  &:focus-visible {
app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:399:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:69:- **Epic 9** — a11y DS-wide (forced-colors, généralisation titres/listes home/services, audit `_blank`, + sémantique infos `/contact`).
docs/implementation-artifacts/epic-7-retro-2026-06-26.md:102:- ⚠️ **Motion** : caret clignotant = **seule** animation en boucle (respecter `prefers-reduced-motion`) — recoupe le lot motion d'Epic 9.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:34:1. **La revue trouve de vrais bugs invisibles au lint — surtout en a11y.** ~13 des 24 findings sont d'accessibilité : `ZTag` non focusable au clavier (2.5), retour de focus après fermeture du menu mobile (2.8), `aria-current` (2.8), fallback avatar sur image échouée (2.6), `prefers-reduced-motion` sur les lifts de carte (2.4). `lint + typecheck + generate` ne les voit pas ; la revue, oui.
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:78:1. **Checklist pré-revue dans chaque consigne d'agent** : « tokens-only (aucune valeur en dur) + a11y (focus visible, clavier Enter/Space, `aria-*`, `prefers-reduced-motion`) » à auto-vérifier avant de passer la story en revue. Complète la règle de périmètre Epic 1 (#1).
app/pages/index.vue:59:                    ><span class="prm__caret" aria-hidden="true"
app/pages/index.vue:388:  &:focus-visible {
app/pages/index.vue:390:    // relais), mais rendu en couleur système sous forced-colors (Windows High
app/pages/index.vue:392:    outline: 2px solid transparent;
app/pages/index.vue:394:    box-shadow: var(--ring-accent);
app/pages/index.vue:394:    box-shadow: var(--ring-accent);
app/pages/index.vue:423:.prm__caret {
app/pages/index.vue:506:  &:focus-visible {
app/pages/index.vue:507:    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/index.vue:508:    outline: 2px solid transparent;
app/pages/index.vue:510:    box-shadow: var(--ring-accent);
app/pages/index.vue:615:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue:617:  .prm__caret {
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:21:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:26:- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:27:  - [x] Recenser toutes les animations/transitions du site : entrées `fade-rise` (Epic 2 + pages Epics 3–7), transitions d'état hover/press, `caret-blink` du terminal (Epic 8). **Fait** : animations live = `fade-rise` (`index.vue .anim`), `caret-blink` (`index.vue .prm__caret`, caret mock du hero), `fadeIn` (`ZCardBody`) ; transitions d'état sur primitives/châssis. `WindowWrapperComponent` (loop `blink`) = **dead code** (non rendu nulle part — seul `CurrentTime` l'est, sans animation). `_animations.scss` (keyframes legacy) non chargé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:28:  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:29:  - [x] **Exception explicite** : le caret clignotant du terminal **reste** la seule boucle autorisée — confirmer qu'il n'est pas désactivé par mégarde (ou qu'il reste lisible si réduit). **Fait** : terminal réel = caret **natif** de l'`<input>` (`caret-color`/`caret-shape`, non piloté par CSS → intact). Caret décoratif du hero (`.prm__caret`) = figé sur état **visible** (`animation: none` dans le filet global + garde index.vue) plutôt que de sauter à la frame finale `opacity:0` → reste lisible.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:63:- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:67:- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:69:- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:92:- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:97:- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:101:- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:120:- `pnpm lint` (eslint + stylelint) + `pnpm typecheck` (vue-tsc) + `pnpm generate` (Docker) : **PASS** (11 routes prerendered). 1ère passe lint : 4 nits stylelint (3× empty-line-before-comment, 1× selector-class-pattern sur `.prm__caret`) → corrigés (lignes vides + `stylelint-disable selector-class-pattern` commenté).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:125:  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:138:- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:140:- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:153:| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:55:- [x] [Review][Defer] `outline:none` + ring `box-shadow` KO en forced-colors [app/pages/index.vue `.offer__more:focus-visible`] — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → focus invisible. Pattern **systémique du DS** (ZButton, etc.), à corriger centralement (`@media (forced-colors: active)` restaurant l'outline) — relève d'Epic 9 (contraste/clavier), pas de cette story. [blind]
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:168:- ✅ Resolved review finding [Defer→corrigé ciblé] focus en `forced-colors` : ajout d'un repli `@media (forced-colors: active)` restaurant un `outline` sur les éléments focusables **propres à cette page** (`.offer__more`, `.hero-term__open`) → cette page ne porte plus la dette. **Le repli DS-wide** (ZButton/ZTag/ZCard/ZInput, focus via `box-shadow`) reste un correctif central **assigné à Epic 9** : le traiter ici impliquerait de toucher toutes les primitives Epic 2 (élargissement de périmètre, justement pointé par le finding Decision).
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:182:- 2026-06-22 — Corrections de revue de code : 2 findings [Patch] (aria-label liens, clés v-for stables) + 2 [Defer] traités (retrait `role="img"` sur `.init` ; repli `forced-colors` pour les focusables de la page ; repli DS-wide laissé à Epic 9). Lint/typecheck/generate verts. Statut → review.
docs/implementation-artifacts/3-2-apercu-services-et-stats.md:183:- 2026-06-22 — Re-revue (vérification post-fix, commit `132093d`) : 2 patchs confirmés dans le code (aria-label distincts ×3, clés `id` stables) + 2 defers réellement traités (`role="img"` retiré ; `@media (forced-colors: active)` sur `.offer__more`/`.hero-term__open`). `pnpm lint` (0/0) + `pnpm typecheck` verts (couverts par la vérif HEAD `5056196`). Aucune régression. Statut → done.
docs/implementation-artifacts/deferred-work.md:15:- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
docs/implementation-artifacts/deferred-work.md:16:- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
docs/implementation-artifacts/deferred-work.md:27:4. **Audit a11y émulé OS-level** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a **pas** été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules présence/résolution des règles CSS confirmées. À rejouer d'un coup (forced-colors + reduced-motion + lecteur d'écran). _(revues 9.1, 9.2)_
docs/implementation-artifacts/deferred-work.md:28:5. **Unifier les deux idiomes forced-colors** — repli inline `outline: 2px solid transparent` (primitives + châssis, 9.1) vs bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (epic 3). Inoffensif (les deux donnent un focus visible) ; candidat à unification DS-wide. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:48:- **Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a pas été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules la présence/résolution des règles CSS sont confirmées. À rejouer d'un coup lors d'un passage a11y émulé en fin de refonte (cf. aussi item « Émulation forced-colors » de la revue 9.1). _(revue 9.2)_
docs/implementation-artifacts/deferred-work.md:52:- **Unifier les deux idiomes forced-colors** — depuis 9.1, le repli inline `outline: 2px solid transparent; outline-offset: 2px;` (primitives DS + liens du châssis) cohabite avec un bloc page-level `@media (forced-colors: active) { outline: 2px solid }` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Les deux donnent un focus visible en contraste forcé — **inoffensif, non bloquant**. Candidat à une unification DS-wide (un seul idiome) lors d'un futur passage a11y/DS. **Préexistant**, non introduit par 9.1. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:53:- **Émulation `forced-colors: active` non rejouée** — la visibilité réelle de l'anneau sous Windows High Contrast repose sur l'idiome WHCM (outline transparent → couleur système) ; vérifié par présence/résolution des déclarations + précédent codebase, **pas** par émulation visuelle (navigateur MCP verrouillé au moment de la revue). À confirmer d'un coup lors d'un audit a11y émulé (forced-colors + lecteur d'écran) en fin de refonte. _(revue 9.1)_
docs/implementation-artifacts/deferred-work.md:85:- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
docs/implementation-artifacts/deferred-work.md:99:- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
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
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:42:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:43:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:48:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:50:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:51:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:55:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:63:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:81:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:86:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:88:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:91:  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:99:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:36:4. **L'a11y reste partiellement attrapée en revue — mais traitée avec discipline.** 5.1 : focus-ring `forced-colors`, balises OG/Twitter/canonical. 5.2 : hiérarchie de titres (eyebrows → `<h2 class="eyebrow">` neutralisés), sémantique de listes (expériences `<ol>`, formation/stack `<ul>`/`<li>`). Tout **corrigé localement sur `/about`**, avec rendu strictement identique ; la **généralisation DS-wide explicitement tracée pour l'Epic 9** (cf. §5) plutôt qu'en rustines éparpillées. Choix assumé.
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:69:- `forced-colors` DS-wide (rings de focus en `box-shadow` sans repli) — `ZButton` / `ZInput` / liens (depuis Epic 3).
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:73:Chaque report est *justifié* (éviter les correctifs partiels dispersés), mais **Epic 9 devient un morceau conséquent** : à dimensionner réalistement au moment de le planifier. **Aucune perte** : l'inventaire est tracé ici (et dans `deferred-work.md` pour `forced-colors` / `_blank`). *Recommandation : y ajouter explicitement la convention titres/listes DS-wide avant d'attaquer Epic 9.*
docs/implementation-artifacts/epic-5-retro-2026-06-23.md:89:- Dette a11y DS-wide (`forced-colors`, titres/listes, `_blank`) → **Epic 9**. Inventaire ci-dessus (§5).
app/components/FooterComponent.vue:110:  &:focus-visible {
app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:114:    box-shadow: var(--ring-accent);
app/components/FooterComponent.vue:153:  &:focus-visible {
app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:157:    box-shadow: var(--ring-accent);
app/components/FooterComponent.vue:181:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:147:_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:37:  - [x] Implémenter le caret clignotant du DS sur l'`input` (ou un caret rendu) : animation `caret-blink 1s steps(1) infinite` (token `motion.css`), couleur `--prompt`. Aujourd'hui le champ utilise `caret-color: var(--color-green)` natif — décider de garder le caret natif coloré OU de porter le caret bloc `.ds-prompt__caret`, mais une seule approche. → **Décision : caret natif coloré** (`caret-color: var(--prompt)`, `caret-shape: block`), seul choix robuste pour un `<input>` éditable (le caret suit la frappe). Clignote nativement, **aucune animation CSS en boucle ajoutée**.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:40:  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:53:- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:72:- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:75:- **[Med] a11y close + input** → close : `role="button"`, `aria-label`, `tabindex="0"`, `@keydown.enter/.space.prevent`, `:focus-visible` (ring `--accent`) ; input : `aria-label`. Fermeture clavier (Enter) vérifiée.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:117:- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:129:- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.
docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:166:- **Caret** : natif coloré (`caret-color: var(--prompt)`, `caret-shape: block`) — choix robuste pour un `<input>` éditable. Clignote nativement ; **aucune animation CSS en boucle introduite** → « caret = seule boucle » respecté par construction, reduced-motion géré par le navigateur.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:302:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:406:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:451:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:468:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:508:Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:837:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:851:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:869:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1438:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1775:app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1827:docs/project-context.md-205-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1847:docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1853:docs/planning-artifacts/epics.md:83:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1864:docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1871:docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2055:                    ><span class="prm__caret" aria-hidden="true"
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2318:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2320:    // relais), mais rendu en couleur système sous forced-colors (Windows High
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2322:    outline: 2px solid transparent;
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2324:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2431:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2467:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2475:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2476:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2477:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2514:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2750:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2751:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2754:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2832:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2834:    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3194:app/assets/scss/main.scss-6-@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3205:app/assets/scss/base/_motion.scss:11://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3207:app/assets/scss/base/_motion.scss-13-//  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3217:app/assets/scss/base/_motion.scss:23:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3218:app/assets/scss/base/_motion.scss-24-@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3547://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3556://  - terminal réel : caret NATIF de l'<input> (caret-color/caret-shape), non
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3558://  - caret décoratif du hero (`.prm__caret`, animation CSS) : figé sur son état
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3568:/* stylelint-disable declaration-no-important, selector-class-pattern -- réduction de motion : surcharge volontaire et globale (a11y) ; .prm__caret = convention BEM DS */
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3569:@media (prefers-reduced-motion: reduce) {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3581:  .prm__caret {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4277:app/components/HeaderComponent.vue:234:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4278:app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4281:app/components/HeaderComponent.vue-238-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4291:app/components/HeaderComponent.vue:267:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4292:app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4294:app/components/HeaderComponent.vue-270-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4305:app/components/HeaderComponent.vue:304:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4306:app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4308:app/components/HeaderComponent.vue-307-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4333:app/components/HeaderComponent.vue:396:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4334:app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4336:app/components/HeaderComponent.vue-399-    box-shadow: var(--ring-accent);
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4488:app/components/terminal/TerminalComponent.vue:378:      &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4634:  &:focus-visible {
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4635:    // Outline transparent → rendu en couleur système sous forced-colors (où les
docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4637:    outline: 2px solid transparent;

2026-09-13T08:20:27.947273Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n "''^[-*] |finding|Finding|Issue|probl|missing|invis|forced|reduced|screen reader" docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md | tail -140' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
3861:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:94:  1. **A11y résiduel** : titres/listes home+services (+ process `<ol>`), audit `target="_blank"`, sémantique `/contact`, unification des idiomes forced-colors ;
3862:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:95:  2. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) ;
3863:docs/implementation-artifacts/epic-9-retro-2026-06-29.md:140:4. **Audit a11y émulé OS-level** (forced-colors + reduced-motion + lecteur d'écran) — la vérif que le MCP ne permettait pas.
3864:docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:38:  - [x] `::before { content:"#"; color: var(--accent); }` ; clic → hover `border-color var(--border-strong)` + `color var(--text-strong)`. `prefers-reduced-motion` neutralise la transition.
3866:docs/implementation-artifacts/2-5-primitives-zbadge-et-ztag.md:132:- **Conventions revues 2.3/2.4 appliquées** : `/* stylelint-disable selector-class-pattern */` inline (BEM `zbadge__dot`/`ztag--plain`…), `prefers-reduced-motion` neutralise la transition de `ZTag`. Aucun changement Stylelint global.
3868:app/pages/contact.vue:407:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3870:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:32:  - [x] Hover `var(--border-strong)` ; **focus** `var(--accent)` + `box-shadow var(--ring-accent)`, `outline:none`. `prefers-reduced-motion` neutralise la transition.
3871:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:127:  - **a11y** : `id` via `useId()` (Vue 3.5, déterministe & hydration-safe — résout le piège « pas d'id aléatoire ») surchargeable par prop `id` ; `label[for]`↔contrôle, `required` natif + `*` visuel, `aria-invalid` si error, hint lié par `aria-describedby`. Revue : les attrs contrôlés (`id`/`value`/`required`/ARIA) sont protégés contre `$attrs`, et les ids externes `aria-describedby` sont fusionnés avec le hint. `prefers-reduced-motion` neutralise la transition.
3872:docs/implementation-artifacts/2-6-primitives-zinput-et-zavatar.md:130:- **Conventions revues 2.3/2.4/2.5** : `/* stylelint-disable selector-class-pattern[, custom-property-pattern] */` inline (BEM + `--_sz`), `prefers-reduced-motion`, focus accessible, tokens partout, prerender-safe (pas de `ensureStyles()`). Aucun changement Stylelint global.
3874:app/components/HeaderComponent.vue:235:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3877:app/components/HeaderComponent.vue:268:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3880:app/components/HeaderComponent.vue:305:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3883:app/components/HeaderComponent.vue:397:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3885:app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
3886:docs/implementation-artifacts/epic-7-retro-2026-06-26.md:69:- **Epic 9** — a11y DS-wide (forced-colors, généralisation titres/listes home/services, audit `_blank`, + sémantique infos `/contact`).
3887:docs/implementation-artifacts/epic-7-retro-2026-06-26.md:102:- ⚠️ **Motion** : caret clignotant = **seule** animation en boucle (respecter `prefers-reduced-motion`) — recoupe le lot motion d'Epic 9.
3888:docs/implementation-artifacts/epic-2-retro-2026-06-22.md:34:1. **La revue trouve de vrais bugs invisibles au lint — surtout en a11y.** ~13 des 24 findings sont d'accessibilité : `ZTag` non focusable au clavier (2.5), retour de focus après fermeture du menu mobile (2.8), `aria-current` (2.8), fallback avatar sur image échouée (2.6), `prefers-reduced-motion` sur les lifts de carte (2.4). `lint + typecheck + generate` ne les voit pas ; la revue, oui.
3889:docs/implementation-artifacts/epic-2-retro-2026-06-22.md:78:1. **Checklist pré-revue dans chaque consigne d'agent** : « tokens-only (aucune valeur en dur) + a11y (focus visible, clavier Enter/Space, `aria-*`, `prefers-reduced-motion`) » à auto-vérifier avant de passer la story en revue. Complète la règle de périmètre Epic 1 (#1).
3892:app/pages/index.vue:390:    // relais), mais rendu en couleur système sous forced-colors (Windows High
3898:app/pages/index.vue:507:    // Outline transparent : rendu en couleur système sous forced-colors.
3901:app/pages/index.vue:615:@media (prefers-reduced-motion: reduce) {
3903:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:21:**Then** `prefers-reduced-motion` désactive les animations (sauf nécessité) et seul le caret boucle par défaut
3904:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:26:- [x] Tâche 1 — Auditer et garantir `prefers-reduced-motion` (AC: #1)
3906:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:28:  - [x] Ajouter/vérifier une règle globale `@media (prefers-reduced-motion: reduce)` qui désactive (ou réduit à l'instantané) les animations et transitions non essentielles. **Fait** : nouveau filet global `app/assets/scss/base/_motion.scss` (chargé par `main.scss`) — `*, *::before, *::after { animation-duration: .01ms; animation-iteration-count: 1; transition-duration: .01ms; … }`. Vérifié présent dans le CSS servi (Chrome DevTools MCP).
3908:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:46:  - [x] Check manuel motion réduit + contraste + parcours clavier consignés. **Fait** : contraste calculé (WCAG) ; clavier vérifié au navigateur (terminal Échap/focus, form contact) ; filet `reduced-motion` vérifié **présent** dans le CSS servi. _(L'émulation visuelle `prefers-reduced-motion` n'est pas exposée par le MCP — comme `forced-colors` en 9.1 ; à confirmer lors d'un audit a11y émulé OS-level en fin de refonte.)_ _(Ticket mentionnait `yarn` ; projet = pnpm via Docker.)_
3909:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:54:- [x] [Review][Defer] Émulation `prefers-reduced-motion` non rejouée — seule la **présence** du filet CSS a été confirmée (servi) ; l'effet runtime (entrées instantanées, caret figé visible) n'est pas émulé (MCP n'expose pas reduced-motion, comme forced-colors en 9.1). → audit a11y émulé OS-level en fin de refonte. `deferred-work.md`.
3910:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:63:- Complémentaire de la **story 9.1** (focus/hover/press visibles) : 9.2 couvre `prefers-reduced-motion`, contraste et navigabilité clavier de bout en bout. Ne pas re-spécifier l'apparence des états (story 9.1) ; ici on garantit qu'ils restent **accessibles** (réduits, contrastés, atteignables). [Source: docs/planning-artifacts/epics.md#Epic 9]
3911:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:67:- Animation restreinte et mécanique : fades + petit translate vers le haut à l'entrée (`fade-rise`, `--ease-out`, ~180–320ms). Pas de rebond sur l'UI. **La seule boucle est le clignotement du caret terminal.** Respecter `prefers-reduced-motion`. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
3912:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:69:- Sous `prefers-reduced-motion: reduce` : désactiver `fade-rise` et les transitions non essentielles ; **conserver** `caret-blink` (seule boucle nécessaire). [Source: docs/specs/spec-design-system-revamp/SPEC.md#CAP-11 ; docs/project-context.md#À préserver]
3913:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:92:- **Ne pas désactiver le caret** sous `prefers-reduced-motion` — c'est la seule boucle autorisée. [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Animation]
3914:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:97:- Respecter `@media (prefers-reduced-motion: reduce)` globalement, pas au cas par cas oublié.
3915:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:101:- Pas de framework de test. Validation = `yarn lint` (eslint + stylelint, ne pas dégrader) + `yarn generate` vert + **check manuel** : (1) OS/navigateur en `prefers-reduced-motion: reduce` → seules transitions essentielles + caret subsistent ; (2) contraste texte/fond lisible sur surfaces sombres et fonds atmosphériques ; (3) parcours clavier complet de toutes les pages + terminal. [Source: docs/project-context.md#Tests]
3917:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:125:  - CSS servi : bloc global `@media (prefers-reduced-motion: reduce) { *, ::before, ::after … ; .prm__caret … }` présent + garde de parité `.zbtn` + gardes par composant existantes (ZCard/ZTag/hex/footer/header/index).
3918:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:130:- **Motion (Tâche 1)** : ajout d'un **filet global** `base/_motion.scss` (`@media (prefers-reduced-motion: reduce)`) qui ramène animations/transitions à l'instantané site-wide — couvre `ZButton` (seule primitive sans garde, à qui on ajoute aussi une garde locale de parité) et tout ajout futur, sans toucher les gardes par composant existantes. **Exception caret (CAP-11)** respectée : le terminal réel utilise le caret **natif** (non-CSS, intact) ; le caret CSS décoratif du hero est figé **visible** (`.prm__caret { animation: none }`), pas sauté à `opacity:0`. Audit : `WindowWrapperComponent` (loop `blink`) est **dead code** (non monté) ; `_animations.scss` (keyframes legacy bounce/slide…) non importé par `main.scss`.
3919:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:138:- `app/assets/scss/base/_motion.scss` (NOUVEAU — filet global `prefers-reduced-motion` + exception caret)
3920:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:140:- `app/components/ui/ZButton.vue` (MODIFIÉ — garde `prefers-reduced-motion` de parité)
3921:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md:153:| 2026-06-29 | 0.1     | Passe a11y finale. **Motion** : filet global `base/_motion.scss` (`prefers-reduced-motion` → animations/transitions instantanées site-wide) + garde de parité `ZButton` ; exception caret préservée (caret natif du terminal intact, caret hero figé visible). **Contraste** : audit WCAG ; `--text-faint` (échouait) remonté à `--text-muted` sur 4 textes réels (copyright footer, méta blog, notice RGPD, placeholder input) — token-only. **Clavier** : Échap ferme le terminal + retour du focus au déclencheur (self-contained, prerender-safe) ; formulaire `/contact` et terminal vérifiés au clavier sans régression. lint + typecheck + generate verts. |
3922:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:55:- [x] [Review][Defer] `outline:none` + ring `box-shadow` KO en forced-colors [app/pages/index.vue `.offer__more:focus-visible`] — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → focus invisible. Pattern **systémique du DS** (ZButton, etc.), à corriger centralement (`@media (forced-colors: active)` restaurant l'outline) — relève d'Epic 9 (contraste/clavier), pas de cette story. [blind]
3923:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:168:- ✅ Resolved review finding [Defer→corrigé ciblé] focus en `forced-colors` : ajout d'un repli `@media (forced-colors: active)` restaurant un `outline` sur les éléments focusables **propres à cette page** (`.offer__more`, `.hero-term__open`) → cette page ne porte plus la dette. **Le repli DS-wide** (ZButton/ZTag/ZCard/ZInput, focus via `box-shadow`) reste un correctif central **assigné à Epic 9** : le traiter ici impliquerait de toucher toutes les primitives Epic 2 (élargissement de périmètre, justement pointé par le finding Decision).
3924:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:174:- `app/pages/index.vue` (sections services + stats ; données services/stats ; aria-label liens ; clés `v-for` stables ; styles `.section*`/`.grid-3`/`.offer*`/`.statrow`/`.stat` ; repli `forced-colors`)
3925:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:182:- 2026-06-22 — Corrections de revue de code : 2 findings [Patch] (aria-label liens, clés v-for stables) + 2 [Defer] traités (retrait `role="img"` sur `.init` ; repli `forced-colors` pour les focusables de la page ; repli DS-wide laissé à Epic 9). Lint/typecheck/generate verts. Statut → review.
3926:docs/implementation-artifacts/3-2-apercu-services-et-stats.md:183:- 2026-06-22 — Re-revue (vérification post-fix, commit `132093d`) : 2 patchs confirmés dans le code (aria-label distincts ×3, clés `id` stables) + 2 defers réellement traités (`role="img"` retiré ; `@media (forced-colors: active)` sur `.offer__more`/`.hero-term__open`). `pnpm lint` (0/0) + `pnpm typecheck` verts (couverts par la vérif HEAD `5056196`). Aucune régression. Statut → done.
3927:docs/implementation-artifacts/deferred-work.md:15:- ~~**Repli `forced-colors` DS-wide**~~ — ✅ **Résolu (story 9.1)** : repli posé une seule fois au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag`, `ZInput`) via `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (rendu en couleur système sous forced-colors, le ring `box-shadow` restant le focus normal) ; anneau DS `--ring-accent` + même repli ajoutés aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. _(revues 3.2, 5.1)_
3928:docs/implementation-artifacts/deferred-work.md:16:- ~~**Filet `prefers-reduced-motion` global + exception caret**~~ — ✅ **Résolu (story 9.2)** : `base/_motion.scss` ramène animations/transitions à l'instantané site-wide ; caret natif du terminal intact, caret déco du hero figé visible.
3929:docs/implementation-artifacts/deferred-work.md:27:4. **Audit a11y émulé OS-level** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a **pas** été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules présence/résolution des règles CSS confirmées. À rejouer d'un coup (forced-colors + reduced-motion + lecteur d'écran). _(revues 9.1, 9.2)_
3930:docs/implementation-artifacts/deferred-work.md:28:5. **Unifier les deux idiomes forced-colors** — repli inline `outline: 2px solid transparent` (primitives + châssis, 9.1) vs bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (epic 3). Inoffensif (les deux donnent un focus visible) ; candidat à unification DS-wide. _(revue 9.1)_
3931:docs/implementation-artifacts/deferred-work.md:48:- **Audit a11y émulé OS-level (reduced-motion + forced-colors + lecteur d'écran)** — l'effet runtime du filet `prefers-reduced-motion` (9.2) et du repli `forced-colors` (9.1) n'a pas été émulé visuellement (le MCP n'expose ni l'un ni l'autre) ; seules la présence/résolution des règles CSS sont confirmées. À rejouer d'un coup lors d'un passage a11y émulé en fin de refonte (cf. aussi item « Émulation forced-colors » de la revue 9.1). _(revue 9.2)_
3932:docs/implementation-artifacts/deferred-work.md:52:- **Unifier les deux idiomes forced-colors** — depuis 9.1, le repli inline `outline: 2px solid transparent; outline-offset: 2px;` (primitives DS + liens du châssis) cohabite avec un bloc page-level `@media (forced-colors: active) { outline: 2px solid }` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Les deux donnent un focus visible en contraste forcé — **inoffensif, non bloquant**. Candidat à une unification DS-wide (un seul idiome) lors d'un futur passage a11y/DS. **Préexistant**, non introduit par 9.1. _(revue 9.1)_
3933:docs/implementation-artifacts/deferred-work.md:53:- **Émulation `forced-colors: active` non rejouée** — la visibilité réelle de l'anneau sous Windows High Contrast repose sur l'idiome WHCM (outline transparent → couleur système) ; vérifié par présence/résolution des déclarations + précédent codebase, **pas** par émulation visuelle (navigateur MCP verrouillé au moment de la revue). À confirmer d'un coup lors d'un audit a11y émulé (forced-colors + lecteur d'écran) en fin de refonte. _(revue 9.1)_
3934:docs/implementation-artifacts/deferred-work.md:85:- ~~**Repli `forced-colors` du ring de focus (lien bio `keova.app`)**~~ — ✅ **Résolu localement** : `outline: 2px solid transparent` + `outline-offset` sur le `:focus-visible` du lien (rendu en couleur système en contraste forcé). Le **pattern DS-wide** identique (`ZButton`/`ZTag`/`ZCard`/`ZInput`) reste tracé ci-dessous (revue 3.2) pour un correctif unique au niveau du DS — Epic 9.
3935:docs/implementation-artifacts/deferred-work.md:99:- **Repli `forced-colors` DS-wide (rings de focus en `box-shadow`)** — En mode contraste forcé (Windows High Contrast), les `box-shadow` sont supprimées → le ring de focus disparaît. _Les focusables propres aux pages `/` (`.offer__more`, `.hero-term__open`) ont reçu un repli `@media (forced-colors: active)` lors du fix 3.2._ Reste le pattern **systémique des primitives DS** (`ZButton`, `ZTag`, `ZCard`, `ZInput`, liens…) qui utilisent `box-shadow: var(--ring-accent)` : à corriger une seule fois au niveau du DS (repli `outline` sous `forced-colors`). Relève d'Epic 9 (contraste & clavier).
3936:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:40:  - [x] Chaque élément focalisable expose un anneau de focus visible (`:focus-visible`) utilisant `var(--accent-ring)` (ou `--border-strong` selon la primitive), jamais `outline: none` sans remplacement visible. **Corrigé** : repli `forced-colors` (deferred-work #1) ajouté au niveau des primitives DS (`ZButton`, `ZCard`, `ZTag` ×2, `ZInput`) — `outline: none` → `outline: 2px solid transparent; outline-offset: 2px;` (rendu en couleur système sous contraste forcé, le ring `box-shadow` reste le focus normal). **Lacune comblée** : les liens du châssis (logo header/footer, liens de nav header + menu mobile, liens footer) n'avaient que l'outline UA par défaut → anneau DS `--ring-accent` + repli `forced-colors` ajoutés.
3937:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:45:  - [x] Parcourir chaque page (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) au clavier (Tab/Shift+Tab/Enter/Espace) et confirmer que focus/hover/press sont visibles partout. **Fait** (Chrome DevTools MCP : sweep `/` + audit CSS compilé des sélecteurs `:focus-visible` du châssis et des primitives ; pages `/about`/`/blog`/`/contact` déjà conformes — repli `forced-colors` posé en 3.2/5.1/6.x/7.x).
3938:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:46:  - [x] Vérifier le terminal easter-egg (ouverture, saisie, liens) au clavier sans régression. **Fait** : ouverture par Enter sur le bouton header → terminal monté, input auto-focus (caret = indicateur de focus), bouton close focusable (`tabindex 0`, outline orange forced-colors-safe, Epic 8). Aucun lien `<a>` émis dans les sorties (texte coloré).
3939:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
3940:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:53:- [x] [Review][Defer] Deux idiomes forced-colors coexistent — soldé en suivi — le repli inline `outline: 2px solid transparent` (9.1, primitives + châssis) cohabite avec un bloc page-level `@media (forced-colors: active)` préexistant dans `index.vue` (`.hero-term__open`/`.offer__more`, epic 3). Inoffensif (les deux produisent un focus visible en contraste forcé) ; candidat à unification DS-wide ultérieure. **Non introduit par 9.1** (préexistant). → tracé dans `deferred-work.md`.
3941:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:57:> **Réserve de vérification (non bloquante)** : le rendu de l'anneau sous `forced-colors: active` n'a pas été émulé visuellement (idiome WHCM documenté + déjà livré/éprouvé dans le codebase — `about.vue`/`contact.vue` ; déclarations présentes et résolues confirmées). Vérif clavier AC#2 en mode normal faite au navigateur par le dev (sweep Tab + audit `styleSheets`).
3942:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:118:- **Vérification clavier au navigateur (Chrome DevTools MCP, dev :3000)** : sweep `Tab` sur `/` — chaque focusable rapporté avec son `:focus-visible` calculé. Résultats : `hdr__brand`, `hdr__link` (×5), `ZButton--terminal`/`--primary` → `box-shadow: rgba(248,113,22,.45) 0 0 0 3px` (`--ring-accent`) **+** `outline: 2px solid rgba(0,0,0,0)` (repli forced-colors). Terminal ouvert par Enter → input auto-focus + close `tabindex 0`. Audit du CSS compilé (`document.styleSheets`) : tous les sélecteurs `:focus-visible` du châssis (`hdr__brand/link/menu-link`, `ftr__brand/link`) et des primitives (`zbtn`, `zcard--interactive`, `ztag--clickable`, `ztag__remove`) portent `box-shadow: var(--ring-accent)` + `outline: transparent solid 2px` ; `hex` conserve son `outline: 2px solid var(--accent)` (déjà forced-colors-safe). Capture d'écran : anneau orange net sur le lien « Accueil ».
3943:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:126:  - _Pages (Epics 3–7)_ : `/` (`hero-term__open`, `offer__more`, cartes projet `ZCard as="a"`), `/services` (`ZCard`/`ZButton`), `/about` (lien bio), `/blog` (cartes/liens), `/contact` (`ZInput`, CTA terminal, `contact__email`, socials). Tous via primitives ou focusables déjà traités (repli forced-colors posé en 3.2/5.1/6.x/7.x).
3944:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:128:- **Correctif central — repli `forced-colors` au niveau des primitives DS (deferred-work item #1, revues 3.2/5.1)** : les rings de focus en `box-shadow: var(--ring-accent)` disparaissent en contraste forcé (Windows High Contrast) → focus invisible. Corrigé **une seule fois à la source** (ZButton, ZCard, ZTag ×2, ZInput) en remplaçant `outline: none` par `outline: 2px solid transparent; outline-offset: 2px;` — invisible en rendu normal (le ring prend le relais), rendu en **couleur système** sous forced-colors. Pattern identique à celui déjà posé localement sur les pages (`contact__email`, lien bio `/about`…), désormais factorisé pour tous les consommateurs des primitives.
3945:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:129:- **Lacune de focus comblée — liens du châssis** : `hdr__brand`, `hdr__link`, `hdr__menu-link`, `ftr__brand`, `ftr__link` n'avaient **aucun** `:focus-visible` (ils tombaient sur l'outline UA par défaut, non conforme au DS). Ajout de l'anneau DS `--ring-accent` + repli forced-colors. `hdr__burger` (qui avait déjà le ring) reçoit aussi le repli forced-colors.
3946:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:130:- **Hors changement (déjà conformes)** : pages `/`, `/about`, `/blog`, `/contact` et terminal (focus traités en amont) ; `hex` (outline orange déjà forced-colors-safe) ; `ZInput` (focus `--accent` + ring, plus fort que `--border-strong` — non régressé) ; `contact__sent:focus { outline:none }` (région `role=status` focalisée par programme, `tabindex -1`, non tabulable — légitime).
3947:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:135:- `app/components/ui/ZButton.vue` (MODIFIÉ — repli forced-colors sur `:focus-visible`)
3948:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:136:- `app/components/ui/ZCard.vue` (MODIFIÉ — repli forced-colors sur `.zcard--interactive:focus-visible`)
3949:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:137:- `app/components/ui/ZTag.vue` (MODIFIÉ — repli forced-colors sur `.ztag--clickable` + `.ztag__remove`)
3950:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:138:- `app/components/ui/ZInput.vue` (MODIFIÉ — repli forced-colors sur `.zinput,.ztextarea:focus`)
3951:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:139:- `app/components/HeaderComponent.vue` (MODIFIÉ — anneau DS sur `hdr__brand`/`hdr__link`/`hdr__menu-link` + repli forced-colors sur `hdr__burger`)
3952:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:140:- `app/components/FooterComponent.vue` (MODIFIÉ — anneau DS + repli forced-colors sur `ftr__brand`/`ftr__link`)
3953:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:143:- `docs/implementation-artifacts/deferred-work.md` (MODIFIÉ — item Epic 9 #1 « repli forced-colors DS-wide » soldé)
3954:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |
3955:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:5:# Story 10.4: Validation a11y émulée OS-level et unification forced-colors
3956:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:19:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
3957:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:20:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
3958:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:21:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
3959:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:26:- [x] Tâche 1 — Émulation `forced-colors: active` (AC: focus visible)
3960:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:27:  - [x] Émuler le contraste forcé (Chrome DevTools : Rendering › « Emulate CSS media feature forced-colors: active », ou OS Windows High Contrast). Parcourir **toutes les pages** (`/`, `/services`, `/about`, `/blog`, `/blog/[...slug]`, `/contact`) + le terminal au clavier.
3961:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:29:- [x] Tâche 2 — Émulation `prefers-reduced-motion: reduce` (AC: animations neutralisées, caret = seule boucle)
3962:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:30:  - [x] Émuler le motion réduit (Chrome DevTools : Rendering › « Emulate CSS media feature prefers-reduced-motion: reduce »). Vérifier que le filet global `app/assets/scss/base/_motion.scss` (9.2) **ramène à l'instantané** les entrées `fade-rise` et transitions ; qu'**aucune autre boucle** ne tourne ; que le **caret du terminal reste** (exception CAP-11) et que le caret déco du hero (`.prm__caret`) est **figé visible** (pas `opacity:0`).
3963:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:32:- [x] Tâche 3 — Unifier les deux idiomes forced-colors (AC: un seul idiome)
3964:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:33:  - [x] Aujourd'hui coexistent : (a) le **repli inline** `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` (primitives DS `ZButton`/`ZCard`/`ZTag`/`ZInput` + châssis `HeaderComponent`/`FooterComponent` + pages `contact.vue`/`about.vue`/`blog/[...slug].vue`) ; (b) un **bloc page-level** `@media (forced-colors: active) { … outline: 2px solid … }` dans `app/pages/index.vue:600`. Choisir **un seul idiome** (recommandé : le repli inline `outline: transparent`, déjà majoritaire et porté par les primitives) et y **rabattre** le bloc d'`index.vue` (supprimer le `@media` page-level au profit du repli inline sur `.hero-term__open`/`.offer__more`). Rendu normal et forced-colors **identiques** après unification.
3965:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:42:- **Story de validation a11y** : prouve **à l'exécution** (émulation) les correctifs CSS de 9.1 (forced-colors) et 9.2 (reduced-motion), que le MCP ne pouvait pas émuler à l'époque, et **unifie** les deux idiomes forced-colors. Source : `deferred-work.md` → Epic 10 items #4 (audit émulé) et #5 (unification). [Source: epics.md#Epic 10 — Story 10.4 (FR14)]
3966:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:43:- **Frontières** : on **ne re-spécifie pas** l'apparence des états (9.1) ni le filet motion (9.2) — on les **valide** et on **unifie** l'idiome forced-colors. Surtout du **diagnostic + un refactor ciblé** (le bloc `@media` d'`index.vue`). Pas de SEO/RGPD.
3967:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:48:- **`app/pages/index.vue`** (UPDATE) — bloc `@media (forced-colors: active)` (l.596-~604) sur `.hero-term__open`/`.offer__more` : à **rabattre** sur le repli inline `outline: transparent` (idiome unique), puis supprimer le `@media`.
3968:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:50:- **`app/assets/scss/base/_motion.scss`** (LECTURE) — filet global `prefers-reduced-motion` (9.2) + exception caret. Vérifier, ne pas casser.
3969:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:51:- **Terminal** : `app/components/terminal/TerminalComponent.vue` — caret natif (intact en reduced-motion) ; close `tabindex 0` focus forced-colors-safe (Epic 8).
3970:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:55:- **Rendu normal strictement inchangé** : l'unification ne doit rien changer hors `forced-colors`/`reduced-motion`. Vérifier à l'œil après refactor d'`index.vue`.
3971:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:63:- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + **émulation** forced-colors & reduced-motion (Chrome Rendering / OS) sur toutes les pages + **passage lecteur d'écran** + rendu normal inchangé. Consigner les preuves dans le Dev Agent Record. [Source: project-context.md#Tests ; deferred-work.md revues 9.1/9.2]
3972:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:81:- Vérification de l'unification forced-colors : recherche globale sur le projet `forced-colors` -> 100% des focusables utilisent l'idiome DS unifié `outline: 2px solid transparent; outline-offset: 2px;` sous `:focus-visible`. Plus aucun bloc `@media (forced-colors: active)` résiduel dans les composants/pages.
3973:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:86:  - Bloc `@media (forced-colors: active)` retiré de `app/pages/index.vue` au profit du repli inline standard DS (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: var(--ring-accent);`) sur `.hero-term__open:focus-visible` et `.offer__more:focus-visible`.
3974:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:88:  - Sous `forced-colors: active`, le navigateur remplace automatiquement `outline: transparent` par la couleur système (`Highlight` / `CanvasText`), garantissant la visibilité du focus sur tous les interactifs.
3975:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:91:  - Vérification de l'exception caret : le caret du terminal (`TerminalComponent.vue`) est géré par l'élément natif `<input>` (`caret-color`, `caret-shape: block`) et reste fonctionnel, tandis que le caret décoratif du hero (`.prm__caret`) est figé visible (`animation: none !important`) sans disparaître.
3976:docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md:99:- `docs/implementation-artifacts/10-4-validation-a11y-emulee-et-unification-forced-colors.md` (MODIFIED)
3977:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:36:4. **L'a11y reste partiellement attrapée en revue — mais traitée avec discipline.** 5.1 : focus-ring `forced-colors`, balises OG/Twitter/canonical. 5.2 : hiérarchie de titres (eyebrows → `<h2 class="eyebrow">` neutralisés), sémantique de listes (expériences `<ol>`, formation/stack `<ul>`/`<li>`). Tout **corrigé localement sur `/about`**, avec rendu strictement identique ; la **généralisation DS-wide explicitement tracée pour l'Epic 9** (cf. §5) plutôt qu'en rustines éparpillées. Choix assumé.
3978:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:69:- `forced-colors` DS-wide (rings de focus en `box-shadow` sans repli) — `ZButton` / `ZInput` / liens (depuis Epic 3).
3979:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:73:Chaque report est *justifié* (éviter les correctifs partiels dispersés), mais **Epic 9 devient un morceau conséquent** : à dimensionner réalistement au moment de le planifier. **Aucune perte** : l'inventaire est tracé ici (et dans `deferred-work.md` pour `forced-colors` / `_blank`). *Recommandation : y ajouter explicitement la convention titres/listes DS-wide avant d'attaquer Epic 9.*
3980:docs/implementation-artifacts/epic-5-retro-2026-06-23.md:89:- Dette a11y DS-wide (`forced-colors`, titres/listes, `_blank`) → **Epic 9**. Inventaire ci-dessus (§5).
3982:app/components/FooterComponent.vue:111:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3985:app/components/FooterComponent.vue:154:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
3987:app/components/FooterComponent.vue:181:@media (prefers-reduced-motion: reduce) {
3988:docs/implementation-artifacts/7-2-infos-cta-terminal-et-socials.md:147:_Rejetés (bruit / faux positifs vérifiés)_ : `@click` non forwardé par `ZButton` (FAUX — forwardé via `passthroughAttrs` ; pattern déjà utilisé au hero 3.1) ; `ZIcon` non `aria-hidden` (FAUX — décoratif par défaut sans `label`) ; ring de focus email forced-colors (FAUX — `outline: 2px transparent` **est** le repli) ; override de spécificité `ZCard` (vérifié : gagne ; + c'est le pattern du kit `.offer`) ; bordure terminal `--accent-2-soft` 28% vs kit 50% (c'est le **token DS de bordure terminal**, identique à `ZButton variant="terminal"` → usage DS correct, la valeur kit était le prototype) ; double espacement gap+margin (FAUX — contextes différents : gap entre cartes, margin entre infoitems dans la carte) ; liens sociaux non sûrs (vérifié : `target=_blank rel="noopener noreferrer"` + libellé sr-only) ; `badge dot` couleur seule (FAUX — le texte « Ouvert… » porte le sens, `dot` `aria-hidden`) ; indication « nouvel onglet » socials (item 3.3 déjà tracé Epic 9) ; `mailto` scraper-bait / no-JS (conformes spec, standard) ; `.prose` sur l'invite (fidèle kit, primitive corps de texte) ; contraste `--term-blue` (token DS) ; icône Twitter `x` vs `twitter` (même glyphe, choix pré-existant du composant partagé) ; `rel` `noopener noreferrer` vs `noreferrer` du kit (sécurité-positif) ; `as const` (inoffensif).
3989:app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
3991:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:40:  - [x] Ajouter `@media (prefers-reduced-motion: reduce) { ... animation: none; }` sur le caret (comme `Prompt.jsx`). → **Sans objet avec le caret natif** : aucune animation CSS n'est introduite (zéro boucle CSS), donc rien à neutraliser ; le clignotement natif est figé par le navigateur sous `prefers-reduced-motion`. Le seul `transition`/effet (hover `filter` de la pastille close) n'est pas une boucle.
3992:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:53:- [x] [Review][Decision] **Caret natif — support `caret-shape: block` + justification reduced-motion inexacte + divergence DS** [app/components/terminal/TerminalComponent.vue:436-439] — le DS (`Prompt.jsx`) implémente un caret bloc `.ds-prompt__caret` avec `caret-blink … infinite` ET `@media (prefers-reduced-motion){ animation: none }`. Le choix « caret natif » (robuste pour `<input>` éditable) satisfait l'AC dure (CAP-11 exempte le caret comme unique boucle), MAIS (i) le commentaire « le navigateur le fige sous prefers-reduced-motion » est techniquement faux (le clignotement du caret texte natif n'est pas piloté par cette media query), (ii) `caret-shape: block` n'est honoré que par Chromium récent (repli barre Firefox/Safari), (iii) le DS arrête explicitement son caret en reduced-motion. **Medium.** Options : (a) ratifier le caret natif + corriger le commentaire trompeur ; (b) porter le caret bloc DS avec garde reduced-motion (fidèle, mais caret détaché de la frappe). → **Décision Simon : (a) caret natif ratifié** — corriger le commentaire trompeur (ne pas affirmer que le caret natif est figé par `prefers-reduced-motion`).
3993:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:72:- **[Med] Caret** → caret natif ratifié ; commentaire trompeur corrigé (ne prétend plus que le caret natif est figé par `prefers-reduced-motion`) ; note `caret-shape: block` = amélioration progressive.
3995:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:117:- Le DS impose `prefers-reduced-motion` partout et **une seule boucle = le caret** (NFR / UX-DR17, project-context.md). Ne pas introduire d'autre animation infinie pendant le restyle. Le keyframe `caret-blink` vit dans `motion.css` ; la garde reduced-motion est dans `Prompt.jsx`.
3996:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:129:- Pas de framework de test (project-context.md). Validation = `yarn lint` (eslint + stylelint) sans nouvelle erreur + `yarn generate` vert + **vérification manuelle** : ouverture du terminal, rendu (aubergine + blur + radius + prompt vert + caret clignotant), et caret qui s'arrête sous `prefers-reduced-motion`. Le non-régression fonctionnel des commandes est couvert par la story 8.2.
3997:docs/implementation-artifacts/8-1-style-terminalwindow-et-prompt.md:166:- **Caret** : natif coloré (`caret-color: var(--prompt)`, `caret-shape: block`) — choix robuste pour un `<input>` éditable. Clignote nativement ; **aucune animation CSS en boucle introduite** → « caret = seule boucle » respecté par construction, reduced-motion géré par le navigateur.
3998:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:302:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
3999:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:406:FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
4000:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:451:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
4001:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:468:FR14: Epic 10 — Validation a11y émulée + unification forced-colors
4002:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:508:Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
4003:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:837:- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
4004:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:851:  - repli **`@media (forced-colors: active)`** sur les rings de focus en `box-shadow`,
4005:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:869:- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
4006:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1438:   10-4-validation-a11y-emulee-et-unification-forced-colors: ready-for-dev
4007:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1775:app/pages/index.vue-587-@media (prefers-reduced-motion: reduce) {
4008:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1827:docs/project-context.md-205-- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
4009:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1847:docs/planning-artifacts/epics.md-38-FR14: Valider l'accessibilité en émulation OS-level (forced-colors + `prefers-reduced-motion` + lecteur d'écran) et unifier les deux idiomes forced-colors en un seul pattern DS-wide. _(deferred-work a11y #4, #5)_
4010:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1853:docs/planning-artifacts/epics.md:83:UX-DR17: Accessibilité & motion — `prefers-reduced-motion` (seule boucle = caret), états focus/hover/press visibles, contraste lisible, navigation clavier.
4011:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1864:docs/planning-artifacts/epics.md-100-FR14: Epic 10 — Validation a11y émulée + unification forced-colors
4012:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:1871:docs/planning-artifacts/epics.md-140-Passe transverse finale : états focus/hover/press, `prefers-reduced-motion`, contraste, navigation clavier.
4015:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2320:    // relais), mais rendu en couleur système sous forced-colors (Windows High
4018:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2431:@media (prefers-reduced-motion: reduce) {
4019:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2467:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
4020:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2475:**Given** le repli `forced-colors` (9.1) et le filet `prefers-reduced-motion` (9.2), non émulés à ce jour, et les deux idiomes forced-colors qui coexistent (repli inline vs `@media` page-level dans `index.vue`)
4021:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2476:**When** on émule `forced-colors: active` et `prefers-reduced-motion: reduce` (navigateur/OS) + un passage lecteur d'écran, et on unifie les deux idiomes forced-colors en un seul pattern DS-wide
4022:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2477:**Then** le focus reste visible sous contraste forcé, les animations non essentielles sont neutralisées (caret terminal = seule boucle conservée), et un seul idiome forced-colors subsiste
4023:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2514:- **Frontières** : **PAS** de motion/contraste/forced-colors (= 9.x + story 10.4), **PAS** de SEO (= 10.5), **PAS** de changement visuel. Uniquement le **balisage sémantique** à rendu constant.
4025:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:2751:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
4029:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3194:app/assets/scss/main.scss-6-@use "base/motion"; // filet a11y global prefers-reduced-motion (story 9.2)
4033:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3218:app/assets/scss/base/_motion.scss-24-@media (prefers-reduced-motion: reduce) {
4034:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3547://  Accessibilité — prefers-reduced-motion (story 9.2, CAP-11)
4038:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:3569:@media (prefers-reduced-motion: reduce) {
4041:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4278:app/components/HeaderComponent.vue-235-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
4044:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4292:app/components/HeaderComponent.vue-268-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
4047:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4306:app/components/HeaderComponent.vue-305-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
4050:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4334:app/components/HeaderComponent.vue-397-    outline: 2px solid transparent; // forced-colors : rendu en couleur système
4054:docs/implementation-artifacts/code-reviews/10-2/raw-acceptance-auditor.md:4635:    // Outline transparent → rendu en couleur système sous forced-colors (où les
4057:2026-09-13T08:20:27.947273Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5

2026-09-13T08:20:31.459943Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,240p' app/components/terminal/TerminalManagerComponent.vue; sed -n '100,220p' app/components/HeaderComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div>
    <div v-for="(terminal, index) in terminals" :key="index">
      <TerminalComponent
        :id="index"
        :create-new-terminal="createNewTerminal"
        :terminal-config="terminal.terminalConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import { uniqueId } from "~/utils/functions";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant.
defineOptions({ name: "TerminalManagerComponent" });

const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);

const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
  const newTerminal = {
    id: uniqueId(),
    terminalConfig,
  };
  terminals.value.push(newTerminal);
};

// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
// header détient une ref de ce composant et appelle la méthode directement
// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
// appeler cette même méthode via sa ref. → on l'expose explicitement.
defineExpose({ createNewTerminal });
</script>

<style scoped></style>
}

// --- Terminal easter-egg (préservé) ---
const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);

function addNewTerminal() {
  terminalManager.value?.createNewTerminal();
}

// Expose l'ouverture du terminal au reste du site via le lanceur partagé
// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
// monté ici ; on enregistre seulement une référence vers sa méthode.
const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();

// --- Menu mobile accessible ---
const menuOpen = ref(false);
const firstMenuLink = ref<HTMLElement | null>(null);
const burgerButton = ref<HTMLElement | null>(null);

function registerFirstLink(el: Element | ComponentPublicInstance | null, index: number) {
  if (index !== 0) {
    return;
  }
  const instance = el as ComponentPublicInstance | null;
  firstMenuLink.value = (instance?.$el ?? el) as HTMLElement | null;
}

function openMenu() {
  menuOpen.value = true;
  nextTick(() => firstMenuLink.value?.focus());
}

function closeMenu() {
  menuOpen.value = false;
}

// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
function closeMenuAndRefocus() {
  if (!menuOpen.value) {
    return;
  }
  closeMenu();
  nextTick(() => burgerButton.value?.focus());
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openTerminalFromMenu() {
  addNewTerminal();
  closeMenu();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && menuOpen.value) {
    closeMenuAndRefocus();
  }
}

// Passage en desktop alors que le menu mobile est ouvert : on le ferme (sinon
// l'overlay fixed resterait actif et le menu deviendrait incohérent au resize).
let desktopMq: MediaQueryList | null = null;
function onDesktopChange(event: MediaQueryListEvent) {
  if (event.matches) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  desktopMq = window.matchMedia("(min-width: 901px)");
  desktopMq.addEventListener("change", onDesktopChange);
  registerTerminalLauncher(addNewTerminal);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  desktopMq?.removeEventListener("change", onDesktopChange);
  unregisterTerminalLauncher(addNewTerminal);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);

  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
  border-bottom: 1px solid var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
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
  gap: var(--space-2);
  text-decoration: none;


2026-09-13T08:20:47.345931Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n \"main\\.scss|css:\" nuxt.config.* app package.json; sed -n '1,120p' nuxt.config.ts 2>/dev/null || true; sed -n '1,80p' app/app.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
nuxt.config.ts:32:  css: ["@/assets/scss/main.scss"],
app/pages/about.vue:325:  // kit.css:138 utilise `margin: 2px 0` ; --space-1 (4px) est le token le plus proche
app/assets/scss/base/_layout.scss:6://  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
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
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss" scoped></style>

2026-09-13T08:21:06.330496Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-4/prompt-blind-hunter.md; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-4/prompt-edge-case-hunter.md; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Blind Hunter Prompt — Story 10.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
# Edge Case Hunter Prompt — Story 10.4

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`

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

2026-09-13T08:21:21.468585Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n "''^##|''^###|''^[-*] '"\\*\\*|"'^[-*] [A-Z].*'"\\(AC|"'^[-*] [''^`].*viol|AC #|Acceptance|Verdict|findings" docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md | tail -100' in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
zsh:1: unmatched "

2026-09-13T08:21:25.855682Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n '"'^(##|###)|''^[-*] '"\\*\\*|"'^[-*] [''^`].*'"\\(AC|"'^[-*] [''^`].*viol|AC #|Acceptance|Verdict|findings'"' docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md | tail -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
4382:If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:
4384:1. **`decision-needed`** findings (unchecked):
4387:2. **`patch`** findings (unchecked):
4390:3. **`defer`** findings (checked off, marked deferred):
4395:### 3. Present summary
4401:If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
4404:### 4. Resolve decision-needed findings
4406:If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.
4412:### 5. Handle `patch` findings
4414:If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:
4418:> **How would you like to handle the `<P>` `patch` findings?**
4423:If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):
4425:> **How would you like to handle the `<P>` `patch` findings?**
4431:- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
4432:- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
4433:- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.
4444:### 6. Update story status and sync sprint tracking
4448:#### Determine new status based on review outcome
4450:- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
4451:- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.
4455:#### Sync sprint-status.yaml
4468:#### Completion summary
4478:### 7. Next steps
4484:> 2. **Re-run code review** — address findings and review again
4489:## On Complete
5073:app/components/ui/ZButton.vue-137-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
5077:app/components/ui/ZInput.vue-176-    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
5592:    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
6001:f0b2c01 fix: corriger les findings de revue de la story 1.1 (Docker, terminal, statut)
6002:f502e71 fix: corriger les findings de revue de la story 1.3 (lint ESLint 9)
6003:f69292f fix: corriger les findings de revue de la story 1.1 (Nuxt 4)
6030:# Acceptance Auditor Prompt — Story 10.4
6032:You are an Acceptance Auditor. Review the provided diff against:
6043:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
6047:I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
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
6171:        "name": "Acceptance Auditor",
6173:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
6191:## RULES
6197:## INSTRUCTIONS
6259:### CHECKPOINT
6263:## NEXT
6307:6001:f0b2c01 fix: corriger les findings de revue de la story 1.1 (Docker, terminal, statut)
6308:6002:f502e71 fix: corriger les findings de revue de la story 1.3 (lint ESLint 9)
6309:6003:f69292f fix: corriger les findings de revue de la story 1.1 (Nuxt 4)
6321:6030:# Acceptance Auditor Prompt — Story 10.4
6322:6032:You are an Acceptance Auditor. Review the provided diff against:
6329:6043:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
6330:6047:I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
6349:6171:        "name": "Acceptance Auditor",
6350:6173:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
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
6414:        "name": "Acceptance Auditor",
6416:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
6434:## RULES
6440:## INSTRUCTIONS
6502:### CHECKPOINT
6506:## NEXT
6536:**Acceptance Criteria:**
6543:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
6549:**Acceptance Criteria:**
6556:### Story 10.5: SEO centralisé site-wide
6562:**Acceptance Criteria:**
6569:### Story 10.6: Conformité légale (RGPD + mentions légales)
6575:**Acceptance Criteria:**
6615:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-50-Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : aucun défaut bloquant.** Filet reduced-motion + exception caret fidèles (CAP-11), terminal opérable au clavier (Échap + retour focus), contraste token-only (faint→muted vérifié par calcul : ~4.9–5.6:1). Gate `lint + typecheck + generate` **re-vérifié vert** (11 routes). Périmètre respecté (rien de l'apparence 9.1 re-spécifié).
6660:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
6700:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-122-- **Nature : audit + harmonisation, zéro nouvelle UI.** L'audit a confirmé que **hover** (Tâche 2) et **press** (Tâche 3) étaient déjà cohérents et 100 % token-driven sur les primitives et le châssis — **aucun changement requis** sur ces deux axes. Tout le travail de code porte sur la **visibilité du focus** (Tâche 4, AC #2).
6727:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |

2026-09-13T08:21:30.215875Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'tail -240 docs/implementation-artifacts/code-reviews/10-4/raw-blind-hunter.md' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
nuxt.config.ts:32:  css: ["@/assets/scss/main.scss"],
app/pages/about.vue:325:  // kit.css:138 utilise `margin: 2px 0` ; --space-1 (4px) est le token le plus proche
app/assets/scss/base/_layout.scss:6://  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
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
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss" scoped></style>

2026-09-13T08:21:06.330496Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-4/prompt-blind-hunter.md; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-4/prompt-edge-case-hunter.md; sed -n '1,220p' docs/implementation-artifacts/code-reviews/10-4/prompt-acceptance-auditor.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
# Blind Hunter Prompt — Story 10.4

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.
# Edge Case Hunter Prompt — Story 10.4

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/10-4/full.diff`

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

2026-09-13T08:21:21.468585Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'rg -n "''^##|''^###|''^[-*] '"\\*\\*|"'^[-*] [A-Z].*'"\\(AC|"'^[-*] [''^`].*viol|AC #|Acceptance|Verdict|findings" docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md | tail -100' in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
zsh:1: unmatched "

2026-09-13T08:21:25.855682Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "rg -n '"'^(##|###)|''^[-*] '"\\*\\*|"'^[-*] [''^`].*'"\\(AC|"'^[-*] [''^`].*viol|AC #|Acceptance|Verdict|findings'"' docs/implementation-artifacts/code-reviews/10-4/raw-acceptance-auditor.md | tail -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
4382:If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:
4384:1. **`decision-needed`** findings (unchecked):
4387:2. **`patch`** findings (unchecked):
4390:3. **`defer`** findings (checked off, marked deferred):
4395:### 3. Present summary
4401:If `{spec_file}` is set, add: `Findings written to the review findings section in {spec_file}.`
4404:### 4. Resolve decision-needed findings
4406:If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.
4412:### 5. Handle `patch` findings
4414:If `patch` findings exist (including any resolved from step 4), HALT. Ask the user:
4418:> **How would you like to handle the `<P>` `patch` findings?**
4423:If `{spec_file}` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):
4425:> **How would you like to handle the `<P>` `patch` findings?**
4431:- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `{spec_file}` is set, check off the patch items in the story file (leave defer items as-is).
4432:- **Leave as action items** (only when `{spec_file}` is set): Done — findings are already written to the story.
4433:- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.
4444:### 6. Update story status and sync sprint tracking
4448:#### Determine new status based on review outcome
4450:- If all `decision-needed` and `patch` findings were resolved (fixed or dismissed) AND no unresolved `high`/`medium` findings remain: set `{new_status}` = `done`. Update the story file Status section to `done`.
4451:- If `patch` findings were left as action items, or unresolved issues remain: set `{new_status}` = `in-progress`. Update the story file Status section to `in-progress`.
4455:#### Sync sprint-status.yaml
4468:#### Completion summary
4478:### 7. Next steps
4484:> 2. **Re-run code review** — address findings and review again
4489:## On Complete
5073:app/components/ui/ZButton.vue-137-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
5077:app/components/ui/ZInput.vue-176-    // box-shadow du ring et la bordure accent ne suffisent plus) — focus visible (AC #2).
5592:    // Contrast), où les box-shadow sont neutralisées — focus toujours visible (AC #2).
6001:f0b2c01 fix: corriger les findings de revue de la story 1.1 (Docker, terminal, statut)
6002:f502e71 fix: corriger les findings de revue de la story 1.3 (lint ESLint 9)
6003:f69292f fix: corriger les findings de revue de la story 1.1 (Nuxt 4)
6030:# Acceptance Auditor Prompt — Story 10.4
6032:You are an Acceptance Auditor. Review the provided diff against:
6043:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
6047:I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
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
6171:        "name": "Acceptance Auditor",
6173:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
6191:## RULES
6197:## INSTRUCTIONS
6259:### CHECKPOINT
6263:## NEXT
6307:6001:f0b2c01 fix: corriger les findings de revue de la story 1.1 (Docker, terminal, statut)
6308:6002:f502e71 fix: corriger les findings de revue de la story 1.3 (lint ESLint 9)
6309:6003:f69292f fix: corriger les findings de revue de la story 1.1 (Nuxt 4)
6321:6030:# Acceptance Auditor Prompt — Story 10.4
6322:6032:You are an Acceptance Auditor. Review the provided diff against:
6329:6043:IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
6330:6047:I’m using the repository’s code-review skill to audit Story 10.4 against the specified artifacts and diff, then I’ll return only the actionable findings as a Markdown list.
6349:6171:        "name": "Acceptance Auditor",
6350:6173:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
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
6414:        "name": "Acceptance Auditor",
6416:        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
6434:## RULES
6440:## INSTRUCTIONS
6502:### CHECKPOINT
6506:## NEXT
6536:**Acceptance Criteria:**
6543:### Story 10.4: Validation a11y émulée OS-level et unification forced-colors
6549:**Acceptance Criteria:**
6556:### Story 10.5: SEO centralisé site-wide
6562:**Acceptance Criteria:**
6569:### Story 10.6: Conformité légale (RGPD + mentions légales)
6575:**Acceptance Criteria:**
6615:docs/implementation-artifacts/9-2-motion-reduit-contraste-et-clavier.md-50-Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : aucun défaut bloquant.** Filet reduced-motion + exception caret fidèles (CAP-11), terminal opérable au clavier (Échap + retour focus), contraste token-only (faint→muted vérifié par calcul : ~4.9–5.6:1). Gate `lint + typecheck + generate` **re-vérifié vert** (11 routes). Périmètre respecté (rien de l'apparence 9.1 re-spécifié).
6660:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:51:Revue de code adversariale (bmad-code-review, 2026-06-29) — 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor). **Verdict : zéro défaut de code.** Diff focus-only conforme (hover/press intacts), 5 liens du châssis dotés d'un anneau DS, repli forced-colors centralisé aux primitives, aucun `outline: none` nu, périmètre respecté (rien de 9.2). Gate `lint + typecheck + generate` **re-vérifié vert** par la revue (11 routes prerendered).
6700:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md-122-- **Nature : audit + harmonisation, zéro nouvelle UI.** L'audit a confirmé que **hover** (Tâche 2) et **press** (Tâche 3) étaient déjà cohérents et 100 % token-driven sur les primitives et le châssis — **aucun changement requis** sur ces deux axes. Tout le travail de code porte sur la **visibilité du focus** (Tâche 4, AC #2).
6727:docs/implementation-artifacts/9-1-etats-interactifs-coherents.md:149:| 2026-06-29 | 0.1     | Audit + harmonisation des états interactifs. Hover/press déjà conformes (token-driven) → aucun changement. Focus (AC #2) : repli `forced-colors` ajouté **une seule fois au niveau des primitives DS** (`ZButton`/`ZCard`/`ZTag`/`ZInput`, deferred-work #1) — `outline:none` → `outline: 2px solid transparent` (couleur système en contraste forcé, ring `box-shadow` conservé) ; anneau de focus DS `--ring-accent` ajouté aux liens du châssis (logo + nav header/menu, liens footer) qui n'avaient que l'outline UA. Vérif clavier au navigateur (ring visible, ordre de tab logique) + lint/typecheck/generate verts. |

2026-09-13T08:21:30.215875Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5

2026-09-13T08:21:34.493310Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- The story marks all four tasks complete, but the diff contains no screenshots, screen-reader transcript, browser output, or per-page observations to substantiate those claims.

- The validation record does not identify the operating system, browser versions, DevTools configuration, viewport sizes, test date, or tested blog slug, so the claimed coverage cannot be reproduced.

- `/blog/[...slug]` is a route pattern rather than a concrete page; testing one article would not establish coverage for all dynamically rendered article content.

- A global search for `forced-colors` cannot prove that every runtime focusable has a fallback; it only finds matching text and declarations, missing dynamically rendered, native, or custom focusable elements.

- `TerminalComponent.vue` is listed as conforming, but `.close-button:focus-visible` still uses `outline: 2px solid var(--accent)` rather than the claimed unified transparent-outline idiom.

- `HexagonLinkComponent.vue` also uses a solid accent outline, contradicting the claim that all interactive elements use the unified forced-colors pattern.

- The terminal’s `.user-input` explicitly sets `outline: none` and defines no focus ring or `:focus-visible` fallback, leaving the primary terminal input without a reliable visible focus indicator.

- `ZInput.vue` uses `&:focus` rather than `:focus-visible`, contradicting the documentation’s description of a consistent `:focus-visible` implementation and causing focus styling on mouse clicks.

- The terminal resize handle is a mouse-only `<div>` with a cursor and mouse handler, has no semantic role, and cannot be operated or discovered through the keyboard path claimed in the story.

- The terminal triggers advertise `aria-haspopup="dialog"`, but the teleported `.terminal` has no dialog role, accessible name, `aria-modal` state, or focus containment; the claimed screen-reader validation therefore omits a known terminal accessibility gap.

- The honeypot input is nested under `aria-hidden="true"` even though it remains an actual input, making the form markup inconsistent with the claim that the entire contact form was validated for assistive technologies.

- The reduced-motion notes treat the native terminal caret as an exception but provide no evidence that its browser-controlled blinking behavior satisfies the requirement under `prefers-reduced-motion`; the global CSS cannot control that native caret animation.

- Removing the explicit `@media (forced-colors: active)` fallback makes correctness depend entirely on each browser repainting `outline: 2px solid transparent` as a system color, but no browser or OS compatibility evidence is included.

- The inline fallback is duplicated across components and pages without a shared mixin, utility, lint rule, or automated assertion, so the claimed unification is not enforceable and future focusables can silently regress.

- The “rendu en mode normal inchangé” claim has no before/after visual comparison, screenshot, or viewport matrix; the only recorded command checks build validity, not rendered behavior.

- The validation command output is summarized as successful without preserving its log, route manifest, dependency versions, or generated artifacts, preventing independent confirmation of the claimed 11 prerendered routes and warning-free run.

- `docs/implementation-artifacts/deferred-work.md` still describes forced-colors unification as outstanding, leaving the backlog inconsistent with the story’s completed status.

- Earlier implementation documentation still describes the page-level `@media (forced-colors: active)` fallback as present, so the diff leaves contradictory instructions and historical claims across the project documentation.
tokens used
116 063
- The story marks all four tasks complete, but the diff contains no screenshots, screen-reader transcript, browser output, or per-page observations to substantiate those claims.

- The validation record does not identify the operating system, browser versions, DevTools configuration, viewport sizes, test date, or tested blog slug, so the claimed coverage cannot be reproduced.

- `/blog/[...slug]` is a route pattern rather than a concrete page; testing one article would not establish coverage for all dynamically rendered article content.

- A global search for `forced-colors` cannot prove that every runtime focusable has a fallback; it only finds matching text and declarations, missing dynamically rendered, native, or custom focusable elements.

- `TerminalComponent.vue` is listed as conforming, but `.close-button:focus-visible` still uses `outline: 2px solid var(--accent)` rather than the claimed unified transparent-outline idiom.

- `HexagonLinkComponent.vue` also uses a solid accent outline, contradicting the claim that all interactive elements use the unified forced-colors pattern.

- The terminal’s `.user-input` explicitly sets `outline: none` and defines no focus ring or `:focus-visible` fallback, leaving the primary terminal input without a reliable visible focus indicator.

- `ZInput.vue` uses `&:focus` rather than `:focus-visible`, contradicting the documentation’s description of a consistent `:focus-visible` implementation and causing focus styling on mouse clicks.

- The terminal resize handle is a mouse-only `<div>` with a cursor and mouse handler, has no semantic role, and cannot be operated or discovered through the keyboard path claimed in the story.

- The terminal triggers advertise `aria-haspopup="dialog"`, but the teleported `.terminal` has no dialog role, accessible name, `aria-modal` state, or focus containment; the claimed screen-reader validation therefore omits a known terminal accessibility gap.

- The honeypot input is nested under `aria-hidden="true"` even though it remains an actual input, making the form markup inconsistent with the claim that the entire contact form was validated for assistive technologies.

- The reduced-motion notes treat the native terminal caret as an exception but provide no evidence that its browser-controlled blinking behavior satisfies the requirement under `prefers-reduced-motion`; the global CSS cannot control that native caret animation.

- Removing the explicit `@media (forced-colors: active)` fallback makes correctness depend entirely on each browser repainting `outline: 2px solid transparent` as a system color, but no browser or OS compatibility evidence is included.

- The inline fallback is duplicated across components and pages without a shared mixin, utility, lint rule, or automated assertion, so the claimed unification is not enforceable and future focusables can silently regress.

- The “rendu en mode normal inchangé” claim has no before/after visual comparison, screenshot, or viewport matrix; the only recorded command checks build validity, not rendered behavior.

- The validation command output is summarized as successful without preserving its log, route manifest, dependency versions, or generated artifacts, preventing independent confirmation of the claimed 11 prerendered routes and warning-free run.

- `docs/implementation-artifacts/deferred-work.md` still describes forced-colors unification as outstanding, leaving the backlog inconsistent with the story’s completed status.

- Earlier implementation documentation still describes the page-level `@media (forced-colors: active)` fallback as present, so the diff leaves contradictory instructions and historical claims across the project documentation.

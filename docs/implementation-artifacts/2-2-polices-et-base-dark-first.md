---
baseline_commit: ac5658dd27bab4b10fb6085cfd7eba3f6d5d5f96
---

# Story 2.2: Polices et base dark-first

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want une base typographique et de fond cohérente,
so that le site adopte l'identité « OS de nuit » (UX-DR1, NFR1, NFR7).

## Acceptance Criteria

1. **Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans, **When** on configure `@font-face`/import et le reset/base dark-first, **Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long.
2. **Given** la configuration de base, **When** on rend une page quelconque, **Then** le fond par défaut est sombre (aucun thème clair) et le texte lisible.

> Périmètre : **polices + base globale dark-first** (fond `--bg-page`, texte `--text-body`, familles par défaut). S'appuie sur les tokens de la **story 2.1** (CSS vars `--font-mono`, `--font-sans`, `--bg-page`, `--text-*`). Ne traite pas les primitives ni le châssis.

## Tasks / Subtasks

- [x] Tâche 1 — Configurer les polices (AC: #1)
  - [x] Ubuntu Mono : `@font-face` (4 graisses/styles) renommés de `'UbuntuMono-Regular'` vers **`"Ubuntu Mono"`** (avec espace) dans `abstract/_fonts.scss` pour matcher `--font-mono`. Le rename répare aussi `TerminalComponent.vue` (qui référençait déjà `"Ubuntu Mono"` sans `@font-face` correspondant → tombait sur `monospace`).
  - [x] Ubuntu sans : ajouté via **`<link>` Google Fonts** (preconnect + stylesheet, `display=swap`) dans `nuxt.config.ts > app.head.link` — et non un `@import` SCSS (respecte la règle « jamais `@import` » + non bloquant).
  - [x] Chemins `url("assets/fonts/Ubuntu_Mono/...")` confirmés résolus par Vite (ttf fingerprintés émis dans `.output/public/_nuxt/`, CSS pointe dessus).
- [x] Tâche 2 — Base dark-first (AC: #2)
  - [x] `html` + `body` sur fond sombre : `background: var(--bg-page)`, `color: var(--text-body)` ; famille par défaut `font-family: var(--font-sans)` (via `abstract/_typography.scss`).
  - [x] **Neutralisé** le `body { background: #fff; }` du reset legacy (`base/_reset.scss`) → `var(--bg-page)` (+ `html` pour éviter tout flash blanc).
  - [x] Titres/labels/code en `--font-mono` ; corps long en `--font-sans`.
- [x] Tâche 3 — Réglages typographiques de base (AC: #1)
  - [x] `h1…h6`, `label`/`legend`, `code`/`pre`/`kbd`/`tt`/`var` → `--font-mono` (`_typography.scss`).
  - [x] `p`/corps → `--font-sans` (hérité du `body`), `line-height: var(--lh-relaxed)` sur `p` pour le long-form.
  - [x] Sélection de texte : `::selection` géré par le token 2.1 (`_root.scss`), présent dans la sortie.
- [x] Tâche 4 — Vérification (AC: #1, #2)
  - [x] Fond sombre prouvé dans la sortie : `body,html{background:var(--bg-page)}` + `body{color:var(--text-body)}` ; **plus aucun `#fff` sur `body`** (plus de flash blanc). (Preuve par build `generate`, même compilation que `dev`.)
  - [x] Ubuntu Mono (titres/code, `@font-face` → ttf locaux) + Ubuntu sans (corps, `<link>` Google Fonts) ; `font-display: swap` (pas de FOUT bloquant).
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` vert.

### Review Findings

- [x] [Review][Patch] Les labels restent en `--font-sans` au lieu de `--font-mono` [app/assets/scss/abstract/_typography.scss:6]
- [x] [Review][Patch] La validation déclarée ne couvre pas le contrat Docker + `pnpm typecheck` [docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:41]

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Dark-first uniquement** : aucun thème clair. Surfaces sombres teintées aubergine. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Typo signature** : Ubuntu Mono (titres/labels/code), Ubuntu sans (corps long). [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints ; docs/project-context.md (NFR7)]
- **Substitution polices** : le repo ne livre **qu'Ubuntu Mono** (`.ttf`) ; Ubuntu sans est ajoutée depuis Google Fonts. [Source: docs/design_system/tokens/fonts.css ; docs/design_system/README.md#Caveats]
- **SCSS `@use`, jamais `@import`** côté partiels SCSS — l'import Google Fonts est une exception « ressource externe » : préférer un `<link>` dans `app.head`. [Source: docs/project-context.md#SCSS]
- Dépend de la **story 2.1** (tokens `--font-mono`/`--font-sans`/`--bg-page`/`--text-*` exposés).

### Fichiers à créer / modifier (lus — état actuel)

- **`assets/scss/abstract/_fonts.scss`** (UPDATE) — état actuel : 4 blocs `@font-face` sous le nom `'UbuntuMono-Regular'` pointant `assets/fonts/Ubuntu_Mono/*.ttf`. Aligner le nom de famille sur **`"Ubuntu Mono"`** (le DS et `--font-mono` attendent ce nom). Soit renommer, soit ajouter des `@font-face` `"Ubuntu Mono"` en parallèle. Conserver les 4 graisses/styles.
- **`assets/scss/abstract/_typography.scss`** (UPDATE) — état actuel : `body/button/input/...` en `font-family: 'UbuntuMono-Regular', 'Segoe UI', serif;` (mono partout, fond non géré). Réaligner : corps en `--font-sans`, titres/labels/code en `--font-mono`, retirer les tailles legacy en `$variables.*` au profit des CSS vars `--fs-*` si pertinent (ou laisser le legacy intact si risque de régression — à minima ne pas réimposer mono au corps).
- **`assets/scss/base/_reset.scss`** (UPDATE) — état actuel : `body { background: #fff; }` (ligne ~1284). Remplacer par `background: var(--bg-page); color: var(--text-body);` (ou neutraliser dans une couche base dark-first).
- **`assets/scss/main.scss`** (lecture/vérif) — charge déjà `base/reset`, `abstract/fonts`, `abstract/typography`. S'assurer que l'ordre laisse les tokens (2.1) chargés **avant** la base qui les consomme.
- **`nuxt.config.ts`** (UPDATE optionnel) — état actuel : `app.head` avec title/htmlAttrs(lang=fr)/charset/viewport/favicon/meta description. Ajouter le `<link>` Google Fonts (preconnect + stylesheet) dans `app.head.link` si on évite l'`@import`.
- **Polices source** : `assets/fonts/Ubuntu_Mono/*.ttf` (déjà dans le repo) ; identiques à `docs/design_system/assets/fonts/Ubuntu_Mono/`.

### Mapping depuis `tokens/fonts.css` + `typography.css`

- `--font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;`
- `--font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;`
- `--font-display: var(--font-mono);`
- 4 `@font-face "Ubuntu Mono"` : 400 normal/italic, 700 normal/italic, `font-display: swap`, `format("truetype")`. [Source: docs/design_system/tokens/fonts.css]
- Échelle de tailles `--fs-xs…6xl`, line-heights `--lh-tight/snug/normal/relaxed`, letter-spacing `--ls-*` (eyebrows = `--ls-wider`). [Source: docs/design_system/tokens/typography.css]
- Headlines en poids `300/400` à grandes tailles (aérien). [Source: docs/design_system/README.md#VISUAL FOUNDATIONS — Type]

### Pièges / régressions à éviter

- **Nom de famille mono** : l'ancien `'UbuntuMono-Regular'` ≠ `"Ubuntu Mono"` du DS. Si on ne réconcilie pas, `--font-mono` chargera la pile de fallback (`SF Mono`) au lieu de la police locale. Préférer déclarer/garder `"Ubuntu Mono"`.
- **Pas de flash blanc** : le `body { background: #fff }` legacy doit disparaître, sinon flash clair au chargement → casse l'identité dark-first (NFR1).
- **`@import` Google Fonts dans SCSS** : la règle projet bannit `@import` SCSS ; l'`@import url(...)` CSS reste valide mais bloque le rendu — préférer `<link rel="preconnect">` + `<link rel="stylesheet">` dans `app.head`.
- **Prerender** : polices = statiques, OK pour `nuxi generate`. Self-hosting d'Ubuntu sans possible plus tard (zéro requête externe) — non requis ici. [Source: docs/design_system/tokens/fonts.css — substitution note]
- **Ne pas casser le legacy** : header/footer/terminal consomment encore l'ancienne typo ; les laisser fonctionner (refonte fine = stories 2.8 / Epic 8).

### Project Structure Notes

- `abstract/_fonts.scss` + `abstract/_typography.scss` + `base/_reset.scss` sont les points d'ancrage. Point d'entrée global `assets/scss/main.scss`. [Source: docs/project-context.md#Organisation]

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (stylelint) + **`yarn dev`** (fond sombre, bonnes familles, pas de flash blanc) + `yarn generate` vert. [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 2: Fondations du design system — Story 2.2]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints (dark-first, typo signature)]
- [Source: docs/project-context.md#SCSS, #Langue (NFR1/NFR7)]
- [Source: docs/design_system/tokens/fonts.css, typography.css]
- [Source: docs/design_system/README.md#VISUAL FOUNDATIONS, #Caveats / substitutions]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Amelia / BMad dev-story)

### Debug Log References

- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → exit 0.
- Validation détaillée : lint vert (0 erreur ; warnings baseline), `typecheck` vert, `generate` vert (« Prerendered 24 routes »).
- Preuves dans `.output/public` : `@font-face` `Ubuntu Mono` (4 styles) → `url(./UbuntuMono-*.ttf)` (ttf émis/fingerprintés) ; `body,html{background:var(--bg-page)}` + `body{color:var(--text-body)}` ; aucun `body{…#fff…}` ; `font-family:var(--font-sans)` sur body ; `h1…h6,label,legend{…--font-mono}` ; `index.html` contient `<link rel="preconnect">` + `…fonts.googleapis.com/css2?family=Ubuntu…&display=swap`.

### Completion Notes List

- **Polices Ubuntu Mono** : `abstract/_fonts.scss` réécrit — famille `'UbuntuMono-Regular'` → `"Ubuntu Mono"` (match `--font-mono`), 4 graisses/styles conservées, `font-display: swap`, `format("truetype")`. Le chemin `url("assets/fonts/Ubuntu_Mono/*.ttf")` résout déjà sous Vite (vérifié : ttf fingerprintés dans le build). **Bonus** : le rename répare `TerminalComponent.vue` (déjà sur `"Ubuntu Mono"`, qui tombait sur `monospace` faute de `@font-face`).
- **Ubuntu sans** : `<link>` Google Fonts (`preconnect` ×2 + `stylesheet` `display=swap`) dans `nuxt.config.ts > app.head.link`. Choix du `<link>` plutôt que `@import` SCSS : respecte la règle projet « jamais `@import` » et évite un import bloquant.
- **Base dark-first** : `base/_reset.scss` — `body { background: #fff }` legacy remplacé par `background: var(--bg-page)` (+ `html` pour couvrir overscroll/flash) et `color: var(--text-body)`.
- **Typo de base** (`abstract/_typography.scss`) : corps (`body`/form) en `var(--font-sans)` (était mono partout) ; `h1…h6` + `label/legend` + `pre` + `code/kbd/tt/var` en `var(--font-mono)` ; `p` en `line-height: var(--lh-relaxed)`. Tailles/line-heights legacy (`$variables.*`) conservées pour éviter toute régression de mise en page.
- **Legacy préservé** : aucun token SCSS `$` supprimé ; `appearance: button` du reset laissé intact (un `--fix` Stylelint le réécrivait en `auto` — changement sémantique annulé, cohérent avec la politique « dépréciations en warning » de la story 1.3).
- **Prerender / dark-first** : polices statiques (neutre `generate`) ; aucun thème clair introduit ; `#fff` du body supprimé (NFR1).

### File List

- `app/assets/scss/abstract/_fonts.scss` (MODIFIÉ) — `@font-face` famille `"Ubuntu Mono"` (4 styles), urls double-quote.
- `app/assets/scss/abstract/_typography.scss` (MODIFIÉ) — body→`--font-sans` ; h1–h6/label/legend/pre/code→`--font-mono` ; p→`--lh-relaxed`.
- `app/assets/scss/base/_reset.scss` (MODIFIÉ) — base dark-first `html`/`body` (`--bg-page`/`--text-body`), suppression du fond blanc.
- `nuxt.config.ts` (MODIFIÉ) — `<link>` preconnect + stylesheet Ubuntu (Google Fonts).

## Change Log

| Date | Version | Description | Auteur |
|------|---------|-------------|--------|
| 2026-06-19 | 0.1 | Polices (`@font-face "Ubuntu Mono"` + `<link>` Ubuntu sans) et base dark-first (`html`/`body` sur `--bg-page`/`--text-body`, corps `--font-sans`, titres/code `--font-mono`). Lint vert, `generate` vert, preuves dans la sortie. Status → review. | Amelia (dev-story) |
| 2026-06-20 | 0.2 | Findings de code review résolus : labels/legends en `--font-mono`, validation Docker complète `lint + typecheck + generate`. Status → done. | Codex (code-review) |

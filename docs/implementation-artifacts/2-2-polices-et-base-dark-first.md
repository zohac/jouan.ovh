# Story 2.2: Polices et base dark-first

Status: ready-for-dev

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

- [ ] Tâche 1 — Configurer les polices (AC: #1)
  - [ ] Ubuntu Mono : les `.ttf` sont **déjà présents** dans `assets/fonts/Ubuntu_Mono/` (Regular/Italic/Bold/BoldItalic). Déclarer (ou réutiliser) les `@font-face` sous le nom de famille **`"Ubuntu Mono"`** (avec espace) pour matcher `--font-mono` du DS, et non l'ancien `'UbuntuMono-Regular'`.
  - [ ] Ubuntu sans : ajouter l'import Google Fonts (`@import url("https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap")`) tel que prescrit par `tokens/fonts.css`. Préférer un `<link>` dans `nuxt.config.ts > app.head` plutôt qu'un `@import` CSS (perf + règle « jamais `@import` » côté SCSS) — sinon documenter le choix.
  - [ ] Vérifier que les chemins `url(...)` des `@font-face` résolvent en Nuxt 4 + Vite (l'ancien `_fonts.scss` utilise `url('assets/fonts/Ubuntu_Mono/...')`).
- [ ] Tâche 2 — Base dark-first (AC: #2)
  - [ ] Mettre `body` (et `html`) sur fond sombre : `background: var(--bg-page)` (= `--surface-0`), couleur `color: var(--text-body)`, famille par défaut `font-family: var(--font-sans)`.
  - [ ] **Neutraliser** le `body { background: #fff; }` du reset legacy (`assets/scss/base/_reset.scss`, ligne ~1284) qui force un fond blanc — incompatible dark-first.
  - [ ] Titres/labels/code en `--font-mono` (Ubuntu Mono = voix signature) ; paragraphes/corps long en `--font-sans` (Ubuntu).
- [ ] Tâche 3 — Réglages typographiques de base (AC: #1)
  - [ ] `h1…h6`, eyebrows/labels, `code`/`pre`/`kbd` → `--font-mono`.
  - [ ] `p`, corps de texte, prose → `--font-sans`, `line-height: var(--lh-relaxed)` pour le long-form.
  - [ ] Sélection de texte : déjà gérée par `::selection` (token 2.1), vérifier le rendu.
- [ ] Tâche 4 — Vérification (AC: #1, #2)
  - [ ] `yarn dev` : le fond du site est sombre (plus de flash blanc) sur `/`, `/about`, `/blog`.
  - [ ] Ubuntu Mono s'applique aux titres ; Ubuntu sans au corps ; pas de FOUT bloquant (`font-display: swap`).
  - [ ] `yarn lint` (stylelint) vert ; `yarn generate` reste vert.

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

### Debug Log References

### Completion Notes List

### File List

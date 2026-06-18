# Story 6.2: Vue article (prose + code)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want lire un article avec une mise en forme lisible,
so that le contenu prose et code est agréable (UX-DR15, FR8).

## Acceptance Criteria

1. **Given** un article markdown dans `content/`, **When** on refond `/blog/[...slug]`, **Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS.

> Périmètre : **vue article (`pages/blog/[...slug].vue`)** — rendu prose + blocs de code stylés. L'index du blog et l'empty-state sont la **story 6.1** (dépendance amont : le dossier `content/` y est créé). Réutiliser les primitives livrées par l'Epic 2 (`ZTag`, `ZButton`) et les tokens (Epic 2). Ne pas créer de nouvelles primitives.

## Tasks / Subtasks

- [ ] Tâche 1 — S'appuyer sur un article markdown de `content/` (AC: #1)
  - [ ] Réutiliser le dossier `content/blog/` créé en story 6.1 (au moins un article avec front-matter : `title`, `description`, `date`, `tags`, `image`/`img`, `read`)
  - [ ] S'assurer que l'article contient de la prose (titres `h2`, paragraphes) ET au moins un bloc de code (fence ` ``` `) pour valider le rendu code
- [ ] Tâche 2 — Refondre `pages/blog/[...slug].vue` selon `Blog.jsx` (vue Article) (AC: #1)
  - [ ] Récupérer le document courant via l'API `@nuxt/content` (voir Dev Notes v2 vs v3) et le rendre via le composant de rendu de contenu de la version installée (`<ContentDoc>` v2 / `<ContentRenderer>` v3)
  - [ ] Reproduire la structure `.article` (réf. `kit.css`) : `max-width: 760px; margin: 0 auto`
  - [ ] Lien retour « ← Retour au blog » (style `hdr__link`, vers `/blog`)
  - [ ] En-tête article : tags en `ZTag`, `h1` (`fs-4xl`, `fw-light`), méta mono (auteur · date · temps de lecture), image héro `.article__hero` via `<nuxt-img>` (`height: 320px; object-fit: cover; border-radius: var(--radius-lg)`)
  - [ ] Bloc de fin : séparateur (`border-top: 1px solid var(--border-subtle)`), libellé mono « Un projet en tête ? » + `ZButton` primary « Démarrer un projet » (vers `/contact`)
- [ ] Tâche 3 — Styler la prose (Ubuntu sans) (AC: #1)
  - [ ] Conteneur `.prose` : `font-family: var(--font-sans)` (Ubuntu sans), `color: var(--text-body)`, `line-height: var(--lh-relaxed)`
  - [ ] `.article .prose` : `font-size: var(--fs-md)` ; `p` `margin: 0 0 var(--space-5)` ; `h2` `font-size: var(--fs-2xl); margin: var(--space-8) 0 var(--space-3)`
  - [ ] Styler le contenu généré par le renderer (cibler les éléments produits via un sélecteur de scope, p. ex. `:deep()`), car le HTML vient de `@nuxt/content`
- [ ] Tâche 4 — Styler les blocs de code (Ubuntu Mono + palette terminal) (AC: #1)
  - [ ] `pre` : `background: var(--bg-terminal)` (aubergine profond), `border: 1px solid var(--border-default)`, radius, padding (réf. `kit.css`)
  - [ ] `code` : `font-family: var(--font-mono)` (Ubuntu Mono), `color: var(--term-green)`, `font-size: 0.92em` ; `pre code { color: inherit; }`
  - [ ] Valider le rendu d'un bloc de code issu du markdown (la coloration syntaxique éventuelle de content ne doit pas casser la palette terminale — voir pièges)
- [ ] Tâche 5 — Style SCSS dark-first via tokens (AC: #1)
  - [ ] `<style lang="scss" scoped>`, `@use` (jamais `@import`), tokens uniquement — aucune valeur en dur
- [ ] Tâche 6 — Vérification prerender (AC: #1)
  - [ ] `yarn dev` : un article `/blog/<slug>` se charge ; prose lisible, bloc de code en palette terminale
  - [ ] `yarn generate` : la route `/blog/[...slug]` est prerendue pour les articles existants (pas d'accès DOM non gardé)

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Blog via `@nuxt/content` markdown** — la vue article rend un document du dossier `content/` (créé en story 6.1). [Source: docs/project-context.md#Nuxt ; docs/specs/spec-design-system-revamp/pages.md]
- **Port, pas copie** : `Blog.jsx` (fonction `Article`) est la référence visuelle, pas à copier. Recréer en Vue 3 `<script setup>` + SCSS `@use`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints ; docs/project-context.md#Port du design system]
- **Typo signature** : Ubuntu sans (`--font-sans`) pour la prose / corps long ; Ubuntu Mono (`--font-mono`) pour le code, les titres et labels. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints ; docs/project-context.md#Langue/Typo ; docs/design_system/tokens/typography.css]
- **Palette terminale pour le code** : fond `--bg-terminal` (aubergine profond), texte `--term-green` (`hsl(143 60% 52%)`), police mono. [Source: docs/design_system/tokens/colors.css (--bg-terminal, --term-green) ; docs/design_system/ui_kits/jouan-site/kit.css#.article .prose pre/code]
- **Tokens, pas de valeurs en dur** ; **dark-first uniquement**. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints ; docs/project-context.md#SCSS]
- **Compatibilité prerender** : tout passe `nuxi generate` ; accès DOM gardés. [Source: docs/project-context.md#Nuxt]
- **Images** : `<nuxt-img>` / `<nuxt-picture>`, jamais `<img>` brut. [Source: docs/project-context.md#Nuxt]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/project-context.md#Langue]

### Fichiers à modifier

- **`pages/blog/[...slug].vue`** (UPDATE / refonte) — état actuel : minimal, `<main><ContentDoc /></main>` (API content v2, aucun style). À refondre : structure `.article`, lien retour, en-tête (tags/titre/méta/héro), rendu prose stylé, blocs de code en palette terminale, bloc CTA de fin. Conserver le rendu du document via le composant de la version content installée.
- **`content/blog/<slug>.md`** (réutilisé de 6.1) — doit contenir prose + au moins un bloc de code pour valider tous les styles.

### API @nuxt/content — attention v2 vs v3 (selon story 1.2)

> Le code actuel utilise `<ContentDoc />` (content v2). La **story 1.2** met à jour `@nuxt/content` ; vérifier la version installée et adapter :

- **Content v2 (actuel `^2.5.2`)** : `<ContentDoc />` rend automatiquement le document de la route ; ou `queryContent(route.path).findOne()` + `<ContentRenderer :value="doc" />`. Accès front-matter via le document (`doc.title`, etc.).
- **Content v3 (cible probable Nuxt 4)** : récupérer le document via `useAsyncData(() => queryCollection("blog").path(route.path).first())`, puis rendre via `<ContentRenderer :value="doc" />`. `<ContentDoc>` n'existe plus.
- Dans les deux cas, le rendu prose est du HTML généré : styler via `:deep()` sur le conteneur `.prose` (ou via les `prose-*` components/`components.prose` si configuré). Garder la requête prerender-safe (`useAsyncData`, résolue au build).
- Si besoin de détails d'API à jour : consulter context7 (lib `/nuxt/content` pour content v3, ou `/websites/nuxt_4_x`).

### Référence visuelle (Blog.jsx — Article + kit.css)

- Conteneur `.article` : `max-width: 760px; margin: 0 auto`.
- Lien retour `hdr__link` (« ← Retour au blog », `padding-left: 0`, marge basse), vers `/blog`.
- En-tête : tags (`ZTag`), `h1` `fs-4xl`/`fw-light`, méta mono « Simon Jouan · {date} · {read} », image héro `.article__hero` (`height: 320px; object-fit: cover; border-radius: var(--radius-lg)`).
- Prose : `.prose { font-family: var(--font-sans); color: var(--text-body); line-height: var(--lh-relaxed); }` ; `.article .prose { font-size: var(--fs-md); }` ; `p` `margin: 0 0 var(--space-5)` ; `h2` `font-size: var(--fs-2xl); margin: var(--space-8) 0 var(--space-3)`.
- Code : `.article .prose pre { background: var(--bg-terminal); border: 1px solid var(--border-default); ... }` ; `.article .prose code { font-family: var(--font-mono); color: var(--term-green); font-size: 0.92em; }` ; `.article .prose pre code { color: inherit; }`.
- Bloc CTA de fin : séparateur `border-top: 1px solid var(--border-subtle)`, libellé mono `text-muted` « Un projet en tête ? » + `ZButton` primary « Démarrer un projet » → `/contact`.
- [Source: docs/design_system/ui_kits/jouan-site/Blog.jsx (fonction Article) ; docs/design_system/ui_kits/jouan-site/kit.css#.article,.prose,pre,code]

### Pièges / régressions à éviter

- **Styler du HTML généré** : la prose est rendue par `@nuxt/content`, donc le scope `scoped` ne l'atteint pas directement — utiliser `:deep()` (ou configurer les composants prose) pour `p`, `h2`, `pre`, `code`.
- **Palette de code** : si content active une coloration syntaxique (Shiki) en v3, elle peut injecter ses propres couleurs/fond. Veiller à ce que le rendu reste fidèle à la palette terminale (fond aubergine, texte/accents verts) — désactiver ou surcharger le highlight si nécessaire pour rester conforme au DS.
- **Polices** : prose en Ubuntu **sans** (`--font-sans`), code en Ubuntu **Mono** (`--font-mono`) — ne pas inverser. Les `@font-face`/imports proviennent de l'Epic 2 (story 2.2).
- **Valeurs en dur** : tout via tokens dark-first ; pas de couleurs/espaces codés en clair.
- **Prerender** : pas d'accès DOM hors garde ; le document content doit être résolu au build (`useAsyncData`).
- **API** : `<ContentDoc>` (v2) vs `<ContentRenderer>` + `queryCollection` (v3) — adapter selon la version installée par 1.2.
- **Dépendances** : dépend de l'Epic 1 (module content à jour), de la story 6.1 (dossier `content/`) et de l'Epic 2 (primitives `ZTag`/`ZButton` + tokens, polices Ubuntu). Ne pas dépendre de stories futures.

### Project Structure Notes

- Route inchangée : `pages/blog/[...slug].vue`. Le châssis global / layout vient de l'Epic 2.
- Le contenu reste du markdown sous `content/blog/`. Aucune base de données / entité à créer.

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev`** (un article `/blog/<slug>` : prose Ubuntu sans lisible + bloc de code en palette terminale Ubuntu Mono) + **`yarn generate`** (route article prerendue sans erreur). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 6: Blog — Story 6.2: Vue article (prose + code)]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-8), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md#/blog/[...slug], #Notes par page (Blog)]
- [Source: docs/design_system/ui_kits/jouan-site/Blog.jsx (fonction Article — vue article prose/code)]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css (.article, .prose, .article__hero, pre, code)]
- [Source: docs/design_system/tokens/typography.css (--font-mono Ubuntu Mono, --font-sans Ubuntu) ; docs/design_system/tokens/colors.css (--bg-terminal, --term-green)]
- [Source: docs/design_system/ui_kits/jouan-site/README.md (Blog — article view prose + code)]
- [Source: docs/project-context.md#Technology Stack & Versions, #Règles Langage & Framework (Nuxt/SCSS), #Langue, #Tests]
- [Source: pages/blog/[...slug].vue (état actuel — ContentDoc, à refondre)]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

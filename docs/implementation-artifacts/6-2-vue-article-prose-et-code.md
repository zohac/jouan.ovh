---
baseline_commit: 24a194c6f90dd20cb9b15267405dfd02dbadd97b
---

# Story 6.2: Vue article (prose + code)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want lire un article avec une mise en forme lisible,
so that le contenu prose et code est agréable (UX-DR15, FR8).

## Acceptance Criteria

1. **Given** un article markdown dans `content/`, **When** on refond `/blog/[...slug]`, **Then** la prose (Ubuntu sans) et les blocs de code (Ubuntu Mono, palette terminal) rendent conformément au DS.

> Périmètre : **vue article (`pages/blog/[...slug].vue`)** — rendu prose + blocs de code stylés. L'index du blog et l'empty-state sont la **story 6.1** (dépendance amont : le dossier `content/` y est créé). Réutiliser les primitives livrées par l'Epic 2 (`ZTag`, `ZButton`) et les tokens (Epic 2). Ne pas créer de nouvelles primitives.

## Tasks / Subtasks

- [x] Tâche 1 — S'appuyer sur un article markdown de `content/` (AC: #1)
  - [x] Réutiliser le dossier `content/blog/` créé en story 6.1 (au moins un article avec front-matter : `title`, `description`, `date`, `tags`, `image`/`img`, `read`)
  - [x] S'assurer que l'article contient de la prose (titres `h2`, paragraphes) ET au moins un bloc de code (fence ` ``` `) pour valider le rendu code
- [x] Tâche 2 — Refondre `pages/blog/[...slug].vue` selon `Blog.jsx` (vue Article) (AC: #1)
  - [x] Récupérer le document courant via l'API `@nuxt/content` (voir Dev Notes v2 vs v3) et le rendre via le composant de rendu de contenu de la version installée (`<ContentDoc>` v2 / `<ContentRenderer>` v3)
  - [x] Reproduire la structure `.article` (réf. `kit.css`) : `max-width: 760px; margin: 0 auto`
  - [x] Lien retour « ← Retour au blog » (style `hdr__link`, vers `/blog`)
  - [x] En-tête article : tags en `ZTag`, `h1` (`fs-4xl`, `fw-light`), méta mono (auteur · date · temps de lecture), image héro `.article__hero` via `<nuxt-img>` (`height: 320px; object-fit: cover; border-radius: var(--radius-lg)`)
  - [x] Bloc de fin : séparateur (`border-top: 1px solid var(--border-subtle)`), libellé mono « Un projet en tête ? » + `ZButton` primary « Démarrer un projet » (vers `/contact`)
- [x] Tâche 3 — Styler la prose (Ubuntu sans) (AC: #1)
  - [x] Conteneur `.prose` : `font-family: var(--font-sans)` (Ubuntu sans), `color: var(--text-body)`, `line-height: var(--lh-relaxed)`
  - [x] `.article .prose` : `font-size: var(--fs-md)` ; `p` `margin: 0 0 var(--space-5)` ; `h2` `font-size: var(--fs-2xl); margin: var(--space-8) 0 var(--space-3)`
  - [x] Styler le contenu généré par le renderer (cibler les éléments produits via un sélecteur de scope, p. ex. `:deep()`), car le HTML vient de `@nuxt/content`
- [x] Tâche 4 — Styler les blocs de code (Ubuntu Mono + palette terminal) (AC: #1)
  - [x] `pre` : `background: var(--bg-terminal)` (aubergine profond), `border: 1px solid var(--border-default)`, radius, padding (réf. `kit.css`)
  - [x] `code` : `font-family: var(--font-mono)` (Ubuntu Mono), `color: var(--term-green)`, `font-size: 0.92em` ; `pre code { color: inherit; }`
  - [x] Valider le rendu d'un bloc de code issu du markdown (la coloration syntaxique éventuelle de content ne doit pas casser la palette terminale — voir pièges)
- [x] Tâche 5 — Style SCSS dark-first via tokens (AC: #1)
  - [x] `<style lang="scss" scoped>`, `@use` (jamais `@import`), tokens uniquement — aucune valeur en dur
- [x] Tâche 6 — Vérification prerender (AC: #1)
  - [x] `yarn dev` : un article `/blog/<slug>` se charge ; prose lisible, bloc de code en palette terminale
  - [x] `yarn generate` : la route `/blog/[...slug]` est prerendue pour les articles existants (pas d'accès DOM non gardé)

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

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- `pnpm lint` (Docker) : PASS. `pnpm typecheck` : PASS.
- `pnpm generate` (Docker) : PASS — `/blog/ia-dans-wordpress`, `/blog/nuxt-symfony-archi`, `/blog/n8n-automatisation` prerendus. `<pre class="language-php">` (sans `shiki`/styles inline → Shiki bien désactivé) ; SEO article vérifié (`og:type=article`, `canonical`, JSON-LD `BlogPosting`).
- Vérif visuelle Chrome DevTools MCP (desktop 1280 + mobile 375) : structure `.article`, prose Ubuntu sans, blocs de code en palette terminale (fond `--bg-terminal`, mono off-white), CTA de fin ; console propre.
- **Bug attrapé à l'œil** : `@nuxt/content` enrobe chaque titre d'une ancre `<a href="#…">` → titres rendus en **bleu UA souligné** (l'app n'a pas de reset global d'`<a>`). Corrigé via `:deep(h2/h3/h4 a) { color: inherit; text-decoration: none }` (+ style de lien DS pour le corps prose). Re-vérifié : ancre h2 = `text-strong`, sans soulignement.

### Completion Notes List

- Refonte de `app/pages/blog/[...slug].vue` (minimal `<ContentRenderer>` → vue article complète). Logique v3 conservée (`queryCollection().path().first()` + gestion 500/404 + refetch client). Structure `.article` (760px) : lien retour, tags `ZTag`, `h1` mono, méta `Simon Jouan · date · lecture`, image héro `<NuxtImg format="webp">`, prose, CTA de fin (`ZButton` primary → `/contact`).
- **Prose** : `.prose` global + `.article__prose` (fs-md, rythme vertical) ; HTML généré stylé via `:deep()` (`p`, `h2`, `a`, `pre`, `code`).
- **Code** : Shiki **désactivé** (`nuxt.config` → `content.build.markdown.highlight: false`) pour un rendu terminal uniforme conforme au kit (fond aubergine `--bg-terminal`, mono off-white `--text-strong` ; `code` inline `--term-green` ; `pre code { color: inherit }`). Sans cette désactivation, Shiki injectait des styles inline par token (thèmes github) écrasant la palette.
- **DRY (zéro dette)** : `formatDate` extrait dans `app/utils/formatDate.ts` (auto-importé, partagé index+article) ; `.post__meta` promu en primitive globale `base/_layout.scss` (réutilisé index+article) — copies retirées de `blog/index.vue`. Tags en `<ul>/<li>` (convention a11y) via `.hero__tags` global.
- **SEO par article** (parité `/about` + `/blog`) : `useHead` réactif (snapshot du document) — `title`/`description`/`canonical` + OG `article` + Twitter + JSON-LD `BlogPosting` (auteur, datePublished, keywords, image).
- Tokens uniquement, `<style scoped>`, prerender-safe (requête `useAsyncData` résolue au build).

### File List

- `app/pages/blog/[...slug].vue` (REFONTE — vue article : structure `.article`, prose `:deep()` vocabulaire complet, code terminal, CTA, SEO ; correctifs revue : `SITE_URL`/`jsonLdScript`, `<time>`, `←` aria-hidden)
- `nuxt.config.ts` (MODIFIÉ — `content.build.markdown.highlight: false`)
- `app/utils/formatDate.ts` (CRÉÉ — util date FR auto-importé, partagé)
- `app/utils/seo.ts` (CRÉÉ — `SITE_URL` partagé + `jsonLdScript()` échappé ; correctif revue)
- `app/assets/scss/base/_layout.scss` (MODIFIÉ — `.post__meta` promu en primitive globale)
- `app/pages/blog/index.vue` (MODIFIÉ — `formatDate`/`.post__meta` partagés ; `SITE_URL`/`jsonLdScript` ; date en `<time>`)
- `app/pages/about.vue` (MODIFIÉ — domaine via `SITE_URL` partagé, correctif revue de dédup)
- `docs/implementation-artifacts/6-2-vue-article-prose-et-code.md` (MODIFIÉ — frontmatter, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                                     |
| ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| 2026-06-24 | 0.1     | Implémentation story 6.2 — vue article `/blog/[...slug]` : prose Ubuntu sans + blocs de code en palette terminale (Shiki désactivé), structure `.article`, en-tête + héro + CTA, SEO article. Extractions partagées `formatDate` / `.post__meta`. |
| 2026-06-25 | 0.2     | Correctifs de revue (zéro dette) : prose `:deep()` vocabulaire complet (listes/citation/table/hr/h3-h4/img, tokens) ; `SITE_URL` + `jsonLdScript()` échappé extraits (`app/utils/seo.ts`, dédup `/about`+`/blog`+article) ; dates en `<time datetime>` (article + index) ; `←` du lien retour en `aria-hidden`. |
| 2026-06-25 | 0.3     | Re-revue des correctifs (commit `4d3e43e`) : patch prose + dette concrète des 2 différés vérifiés résolus ; build vert (24 routes, héros article webp) ; HTML prérendu (time, JSON-LD échappé, SEO `/about`+`/blog` non régressés) + 13 règles prose injectées validées (styles calculés) + visuel desktop. Statut → `done`. |

## Review Findings

_Code review (bmad-code-review) — 2026-06-25. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet, retour `[]`) · Acceptance Auditor (diff + SPEC/ticket/`Blog.jsx`/`kit.css`). Verdict : AC #1 satisfaite (prose Ubuntu sans + code Ubuntu Mono palette terminale, conformes DS), aucune violation dure ; API content v3, gestion 404/500, SEO, refactor index préservé tous vérifiés sains._

- [x] [Review][Patch] Étendre le style prose `:deep()` au vocabulaire markdown complet, DS-tuné (tokens, dark-first) : `ul`/`ol`/`li`, `blockquote`, `table`/`th`/`td`, `hr`, `h3`–`h4` — pour ne plus dépendre du reset legacy WordPress-normalize (`#ccc` sur `hr`, indentation `rem`, tables sans bordures). Décision Simon : zéro dette (était `decision-needed` ; les 3 articles actuels n'utilisent que `h2`/paragraphes/code, AC déjà satisfaite). [app/pages/blog/[...slug].vue (.article__prose)] — ✅ résolu : `:deep()` ajoutés pour `h3`/`h4`/`strong`, `ul`/`ol`/`li` (puces accent), `blockquote` (filet accent), `hr`, `table`/`th`/`td`, `img` — tous tokenisés. Vérifié visuellement via un article styleguide temporaire (rendu DS, supprimé après).
- [x] [Review][Defer→Fixed] Centralisation SEO : `siteUrl` codé en dur et **dupliqué** dans 3 pages + JSON-LD `innerHTML` **sans échappement `</script>`**. — ✅ dette concrète résolue (décision Simon : zéro dette) : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, utilisé par `/about`, `/blog`, `/blog/[...slug]`) ; helper `jsonLdScript()` qui échappe `<` → `<`. _Reste_ la **migration `useSeoMeta`/`runtimeConfig` + `publisher`/`Organization`** (architecture, non-dette) → story SEO dédiée / Epic 9.
- [x] [Review][Defer→Fixed] a11y des dates blog + flèche retour. — ✅ résolu : dates en `<time :datetime="…">` (article ET index — dates ISO uniques) ; glyphe `←` du lien retour enveloppé en `<span aria-hidden="true">`. Vérifié dans le HTML prerendu (`<time datetime="2026-06-12">`). _Reste_ la généralisation a11y site-wide (eyebrow→titre, listes home/services) → Epic 9.

_Rejetés (bruit / faux positifs vérifiés)_ : « listes sans puces » et « images qui débordent » (FAUX — le reset global fournit `disc/decimal` + `img max-width:100%`) ; `h3` en défaut navigateur (FAUX — règle globale `_typography.scss` `h1-h6`) ; clé `useAsyncData` en fonction (typecheck + generate des 3 articles passent — Edge `[]`) ; ordre 404/500 (`.first()` renvoie `null`, pas de throw → 404 ; erreur réelle → 500) ; `clearError` client (transitions correctes) ; path traversal (requête content, pas FS ; `null`→404) ; canonical/trailing-slash (canonical = `article.path` propre, dédoublonne) ; contraste `code` inline vert (fidèle kit, token DS) ; héro `object-fit:cover` (recadre sans déformer) + `alt=""` (décoratif, schéma requis) ; `description`/`datePublished` non gardés (schéma garantit la chaîne) ; classes globales `hero__tags`/`post__meta` réutilisées (primitives voulues) ; `formatDate` sans garde (date regex-validée en 6.1) ; `NuxtLink` template vs `:as` ref (les deux corrects) ; `760px` répété (littéral structurel mandaté kit) ; refactor `index.vue`/`_layout.scss` (DRY in-scope, valeurs préservées — Auditor + Edge).

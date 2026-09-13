---
baseline_commit: 35bcb5c149a546b2d277f40ec05d74d472412dcb
---

# Story 6.1: Index du blog et empty-state

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur,
I want une liste d'articles soignée,
so that je trouve du contenu à lire (UX-DR15, FR8).

## Acceptance Criteria

1. **Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`, **When** on crée le dossier `content/` et on refond `/blog` (index + empty-state), **Then** la liste rend en cartes conformes au DS.
2. **Given** le pipeline `@nuxt/content` et la référence `Blog.jsx`, **When** la liste d'articles est vide, **Then** l'empty-state français soigné s'affiche quand il n'y a aucun article.

> Périmètre : **index du blog (`pages/blog/index.vue`) + création du dossier `content/` + empty-state**. La vue article (`pages/blog/[...slug].vue`, prose + code) est la **story 6.2** — ne pas la traiter ici. Réutiliser les primitives livrées par l'Epic 2 (`ZCard`, `ZTag`/`ZBadge`) et les tokens (Epic 2). Ne pas créer de nouvelles primitives.

## Tasks / Subtasks

- [x] Tâche 1 — Créer le dossier `content/` et un (ou plusieurs) article(s) markdown (AC: #1, #2)
  - [x] Créer le dossier `content/` à la racine du projet (n'existe pas encore)
  - [x] Y placer au moins un article markdown de démonstration (`content/blog/<slug>.md`) avec front-matter (`title`, `description`, `date`, `tags`, `image`/`img`, `read`) pour valider le rendu de la liste en cartes
  - [x] Vérifier que la collection/source `blog` est bien résolue par `@nuxt/content` (voir Dev Notes pour l'API v2 vs v3 selon ce qui est installé après story 1.2)
- [x] Tâche 2 — Refondre l'index `pages/blog/index.vue` selon `Blog.jsx` (AC: #1)
  - [x] Reproduire la structure d'en-tête : eyebrow `// ~/blog`, titre « Notes de dev » (`var(--fs-4xl)`, `var(--fw-light)`), sous-titre prose (`var(--text-muted)`, `max-width: 56ch`)
  - [x] Lister les articles en `ZCard` interactives cliquables (lien vers `article._path` / `article.path`), layout `.post` (grille `200px 1fr`, thumbnail `.post__thumb` arrondie `--radius-md`)
  - [x] Afficher pour chaque article : vignette (via `<nuxt-img>`), tags en `ZTag`, titre `h3`, description, méta mono (date · temps de lecture) — réf. `.post`, `.post__meta` de `kit.css`
  - [x] Récupérer les articles via l'API `@nuxt/content` (voir Dev Notes), triés par date décroissante
- [x] Tâche 3 — Conserver + restyler l'empty-state existant (AC: #2)
  - [x] Conserver le `ZCard` empty-state existant et son texte français (illustration + message « pas encore d'articles » + invitation à revenir)
  - [x] Le restyler selon le DS (tokens, dark-first) ; remplacer le contenu hardcodé blanc/`width: 50vw` par les tokens et la primitive `ZCard` refondue (Epic 2)
  - [x] L'empty-state s'affiche uniquement quand la requête de contenu ne renvoie aucun article
- [x] Tâche 4 — Style SCSS dark-first via tokens (AC: #1, #2)
  - [x] Styler en `<style lang="scss" scoped>`, via `@use` (jamais `@import`), en consommant les tokens (couleurs aubergine, espacement, rayons) — aucune valeur en dur
  - [x] Retirer les styles legacy de l'ancien index (fonds blancs, `width: 50vw`, etc.)
- [x] Tâche 5 — Vérification prerender (AC: #1, #2)
  - [x] `yarn dev` : `/blog` se charge, liste les articles présents dans `content/`
  - [x] Cas vide : retirer/vider temporairement le dossier `content/blog` → l'empty-state s'affiche
  - [x] `yarn generate` : la route `/blog` est bien prerendue (tokens chargés, pas d'accès DOM non gardé)

## Dev Notes

### Contexte & contraintes (depuis project-context.md et SPEC)

- **Blog via `@nuxt/content` markdown** — le dossier `content/` n'existe PAS encore : à créer dans cette story. [Source: docs/project-context.md#Nuxt ; docs/specs/spec-design-system-revamp/pages.md#Notes par page]
- **Port, pas copie** : `Blog.jsx` est la **référence visuelle cible**, pas à copier. Recréer en Vue 3 `<script setup>` + SCSS `@use`. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints ; docs/project-context.md#Port du design system]
- **Tokens, pas de valeurs en dur** : couleurs/espaces/rayons via tokens (Epic 2). Pattern : CSS custom properties locales depuis les tokens SCSS, consommées via `var()`. [Source: docs/project-context.md#SCSS]
- **Dark-first uniquement** : surfaces aubergine, aucun thème clair. [Source: docs/specs/spec-design-system-revamp/SPEC.md#Constraints]
- **Compatibilité prerender** : tout passe `nuxi generate` ; pas d'accès `window`/`document` hors `onMounted`/`import.meta.client`. [Source: docs/project-context.md#Nuxt]
- **Images** : toujours `<nuxt-img>` / `<nuxt-picture>`, jamais `<img>` brut. Assets statiques dans `public/images/`. [Source: docs/project-context.md#Nuxt]
- **Langue & voix** : français, 1re personne « je », vouvoiement, pas d'emoji. [Source: docs/project-context.md#Langue]
- **Lint = barre de qualité** (pas de tests auto) + build vert. [Source: docs/project-context.md#Tests]

### Fichiers à modifier / créer

- **`content/`** (CREATE) — dossier racine à créer. Sous-dossier `content/blog/` + au moins un `.md` de démonstration avec front-matter. C'est le pipeline `@nuxt/content` qui résout ce dossier.
- **`pages/blog/index.vue`** (UPDATE / refonte) — état actuel : utilise `<ContentList path="/blog">` (API content v2) avec un slot `#default` (liste brute `<ul>`/`<li>`) et un slot `#not-found` portant l'empty-state en `ZCardComponent`/`ZCardHeader`/`ZCardBody`. Styles legacy : fonds blancs, `width: 50vw`, `.container-w50`. À refondre : header eyebrow/titre/sous-titre, cartes `ZCard` interactives, méta mono, empty-state restylé via tokens.
- **L'empty-state existant** (CONSERVER + RESTYLER) — garder le message français (illustration `undraw_code_thinking`, titre « pas encore d'articles », paragraphe d'invitation). Le porter sur la primitive `ZCard` refondue (Epic 2) et les tokens dark-first.

### API @nuxt/content — attention v2 vs v3 (selon story 1.2)

> Le code actuel utilise l'API **content v2** (`<ContentList>`, `article._path`, slot `#not-found`). La **story 1.2** met à jour `@nuxt/content` ; si elle installe **v3 (sur Nuxt 4)**, l'API change. Vérifier la version réellement installée avant d'implémenter, et adapter :

- **Content v2 (actuel `^2.5.2`)** : composants `<ContentList>` / `<ContentDoc>` ; requêtes via `queryContent("/blog").find()` ; champ chemin `_path`. Slot `#not-found` pour l'empty-state.
- **Content v3 (cible probable Nuxt 4)** : **collections** définies dans `content.config.ts` (ex. collection `blog` typée) ; requêtes via `await queryCollection("blog").order("date", "DESC").all()` dans un `useAsyncData` ; rendu de liste en clair (plus de `<ContentList>` magique) ; champ chemin `path`. L'empty-state se gère par un `v-if` sur la longueur de la liste (plus de slot `#not-found`).
- Recommandation : récupérer la liste via `useAsyncData` + l'API de requête de la version installée, puis brancher l'empty-state sur `!list?.length`. Garder le rendu prerender-safe (la requête de contenu est résolue côté build).
- Si besoin de détails d'API à jour : consulter context7 (lib `/nuxt/content` pour content v3, ou `/websites/nuxt_4_x`).

### Référence visuelle (Blog.jsx + kit.css)

- En-tête index : `eyebrow` mono `// ~/blog`, `h1` « Notes de dev » `fs-4xl`/`fw-light`, sous-titre `.prose` `text-muted` `max-width: 56ch` (« WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses. »).
- Carte article (`.post`) : grille `grid-template-columns: 200px 1fr; gap: var(--space-5)` ; `.post__thumb` `height: 130px; object-fit: cover; border-radius: var(--radius-md)`. Mobile : `grid-template-columns: 1fr`.
- Titre `.post h3` `fs-xl` ; description `.post p` `font-sans` `fs-sm` `text-body` ; méta `.post__meta` `font-mono` `fs-xs` `text-faint`, items séparés par `·`.
- Tags : primitive `ZTag` (radius pill, Epic 2). Carte : primitive `ZCard` interactive (Epic 2) — `interactive`/cliquable vers l'article.
- [Source: docs/design_system/ui_kits/jouan-site/Blog.jsx ; docs/design_system/ui_kits/jouan-site/kit.css#.post,.eyebrow,.section,.container]

### Pièges / régressions à éviter

- **`content/` absent** : sans ce dossier, `@nuxt/content` n'a aucune source → s'assurer qu'il existe et qu'il contient au moins un article pour valider le rendu en cartes (AC #1), tout en validant aussi le cas vide (AC #2).
- **Empty-state** : ne pas le supprimer — le **conserver** (texte français) et le **restyler**. Vérifier le bon mécanisme selon la version content (slot `#not-found` en v2 vs `v-if` sur liste vide en v3).
- **Valeurs en dur** : supprimer les fonds blancs / `width: 50vw` legacy ; tout via tokens dark-first.
- **Prerender** : ne pas accéder au DOM hors garde ; la requête content doit être résolue au build (`useAsyncData`).
- **Champ chemin** : `_path` (v2) vs `path` (v3) — adapter selon la version installée par 1.2.
- **Dépendances** : cette story dépend de l'Epic 1 (module content à jour) et de l'Epic 2 (primitives `ZCard`/`ZTag`/`ZBadge` + tokens). Ne pas dépendre de stories futures.

### Project Structure Notes

- Nouveau dossier racine `content/` (avec `content/blog/`). Cohérent avec la structure attendue par `@nuxt/content`.
- L'index reste `pages/blog/index.vue` ; le layout/châssis global vient de l'Epic 2 (`MainComponent`/layout).
- Aucune base de données / entité à créer (contenu = markdown).

### Testing standards

- Pas de framework de test. Validation = `yarn lint` (ne pas dégrader) + **`yarn dev`** (`/blog` liste les articles ; cas vide → empty-state) + **`yarn generate`** (route `/blog` prerendue sans erreur). [Source: docs/project-context.md#Tests]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 6: Blog — Story 6.1: Index du blog et empty-state]
- [Source: docs/specs/spec-design-system-revamp/SPEC.md#Capabilities (CAP-8), #Constraints]
- [Source: docs/specs/spec-design-system-revamp/pages.md#/blog, #Notes par page (Blog)]
- [Source: docs/design_system/ui_kits/jouan-site/Blog.jsx (fonction Blog — index)]
- [Source: docs/design_system/ui_kits/jouan-site/kit.css (.post, .post__thumb, .post__meta, .eyebrow, .section, .container)]
- [Source: docs/design_system/ui_kits/jouan-site/README.md (Blog — article index)]
- [Source: docs/project-context.md#Technology Stack & Versions, #Règles Langage & Framework (Nuxt/SCSS), #Langue, #Tests]
- [Source: pages/blog/index.vue (état actuel — ContentList + empty-state ZCard à conserver/restyler)]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Claude Code, workflow bmad-dev-story)

### Debug Log References

- **Sanity-check `@nuxt/content` (préalable Epic 6)** : après création de `content/blog/` + 3 articles et restart du conteneur dev → `[@nuxt/content] ✔ Processed 2 collections and 3 files`. `/blog` liste les 3 titres, `/blog/ia-dans-wordpress` rend le markdown (`<pre>`/`<code>`). Pipeline (better-sqlite3 + rendu) **opérationnel depuis la migration Nuxt 4**.
- `pnpm lint` (Docker) : PASS. `pnpm typecheck` : PASS.
- `pnpm generate` (Docker) : PASS — 18 routes prerendues dont `/blog` + les 3 articles (crawler suivant les liens des cartes) + vignettes optimisées `@nuxt/image` (`/_ipx/s_200x130/...`).
- Vérif visuelle Chrome DevTools MCP : `/blog` peuplé (desktop 1280 + mobile 375, cartes → 1 colonne) ET empty-state (contenu vidé temporairement) ; console propre.
- ⚠️ **Gotcha Docker observé** : lancer `pnpm generate` dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **périme la base SQLite de contenu** du dev (volume partagé) → `/blog` tombait sur l'état d'erreur. Correctif : `docker compose restart web` réindexe le contenu. Sans impact sur le build.

### Completion Notes List

- **Pipeline content (Tâche 1)** : créé `content/blog/` + 3 articles markdown (repris des posts de `data.js` : `ia-dans-wordpress`, `nuxt-symfony-archi`, `n8n-automatisation`) avec front-matter `title`/`description`/`date` (ISO)/`tags`/`read`/`image`. Corps markdown réels (le 1er porté de la démo `Article` de `Blog.jsx`) → pré-amorce aussi la vue article 6.2. Schéma de la collection `blog` (`content.config.ts`) étendu : `date`/`tags`/`read` typés (en plus de `image`).
- **Index (Tâches 2-4)** : `app/pages/blog/index.vue` refondu (Options API legacy + `MainComponent` + fonds blancs / `width:50vw` → `<script setup lang="ts">`). En-tête eyebrow/titre/sous-titre, liste de `ZCard` interactives (`:as="NuxtLink"`) en `.post` (grille `200px 1fr`), vignette `<NuxtImg>`, tags `ZTag` en `<ul>/<li>` (convention a11y 5.2), titre `h2`, méta mono (date FR · temps de lecture). Tri `queryCollection("blog").order("date","DESC").all()` via `useAsyncData` (prerender-safe).
- **Empty-state (Tâche 3)** : conservé (texte FR + illustration `undraw_code_thinking`), restylé en `ZCard` dark-first centrée via tokens ; branché sur `!articles.length`. État d'erreur distinct conservé (`v-else-if="error"`).
- **Tokens uniquement** ; primitives globales (`.section`/`.container`/`.eyebrow`/`.prose`/`.hero__tags`) consommées, non redéclarées. `.post*` (spécifiques blog) en scoped.
- Date : front-matter ISO (`YYYY-MM-DD`) → `Intl.DateTimeFormat("fr-FR", { timeZone: "UTC" })` (rendu déterministe, pas de décalage de jour à l'hydration).

### File List

- `content.config.ts` (MODIFIÉ — schéma collection `blog` étendu : `date` (validée ISO `regex`)/`tags`/`read`)
- `content/blog/ia-dans-wordpress.md` (CRÉÉ ; `image.src` → `.webp`)
- `content/blog/nuxt-symfony-archi.md` (CRÉÉ ; `image.src` → `.webp`)
- `content/blog/n8n-automatisation.md` (CRÉÉ ; `image.src` → `.webp`)
- `public/images/hacker-den-1.webp`, `hacker-den-2.webp`, `hacker-den-3.webp` (CRÉÉS — vignettes webp 800×448 ; PNG sources supprimés, recompressés via `sharp`)
- `app/pages/blog/index.vue` (REFONTE — Options API legacy → `<script setup>`, cartes `ZCard.post`, empty-state restylé ; correctifs de revue : webp+garde `read`, feed `<ul>/<li>`, SEO OG/canonical/JSON-LD)
- `docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md` (MODIFIÉ — frontmatter `baseline_commit`, tâches, Dev Agent Record, statut)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIÉ — statut story `ready-for-dev` → `in-progress` → `review`)

## Change Log

| Date       | Version | Description                                                                                          |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------- |
| 2026-06-23 | 0.1     | Implémentation story 6.1 — pipeline `content/` + 3 articles, refonte de l'index `/blog` (cartes `ZCard`, méta, tri par date) + empty-state restylé. Sanity-check `@nuxt/content` v3 OK. |
| 2026-06-23 | 0.2     | Correctifs de revue — 5 points résolus (zéro dette) : vignettes webp 800px (~24-34 Ko) + `format="webp"`, garde `v-if` sur `read`, validation ISO de `date` au schéma, feed en `<ul>/<li>`, SEO `/blog` (OG/Twitter/canonical + JSON-LD `BlogPosting`). |
| 2026-06-23 | 0.3     | Re-revue des correctifs (commit `3a7527b`) : 5 points vérifiés résolus ; build vert (18 routes, IPX webp 1×/2×) ; HTML prérendu (feed `ul`/`li`, srcset webp, OG/canonical, JSON-LD valide) + styles calculés + visuel desktop conformes. Statut → `done`. |

## Review Findings

_Code review (bmad-code-review) — 2026-06-23. Couches : Blind Hunter (diff seul) · Edge Case Hunter (diff + projet) · Acceptance Auditor (diff + SPEC/ticket/`Blog.jsx`/`kit.css`). Verdict : AC #1 (cartes conformes DS) et AC #2 (empty-state) satisfaites, aucune violation dure ; API content v3, tokens, `ZCard`/`ZTag`, prerender tous vérifiés sains._

- [x] [Review][Patch] Redimensionner/recompresser les 3 vignettes sources `public/images/hacker-den-*.png` (~4,5 Mo → cible ~2× l'affichage) + `format="webp"` sur la `<NuxtImg>` des cartes — décision Simon : zéro dette (était `decision-needed`). [public/images/hacker-den-*.png ; app/pages/blog/index.vue:27] — ✅ résolu : sources converties en **webp 800×448 (~24-34 Ko**, vs ~1,4 Mo, via `sharp`), PNG supprimés, front-matter `image.src` → `.webp`, `format="webp"` ajouté. HTML prerendu : `f_webp&s_200x130` + 2×.
- [x] [Review][Decision→Accepté] Empty-state réécrit (vs « conserver » du ticket) — décision Simon : **réécriture acceptée** (voix DS cohérente, 1ʳᵉ personne, sans inclusif ni fluff). Aucune action.
- [x] [Review][Patch] Méta : `read` est optionnel au schéma mais rendu sans garde → « · de lecture » orphelin (séparateur + texte vides) si un futur article omet `read`. Ajouter `v-if="article.read"` sur le span ET le séparateur `·`. [app/pages/blog/index.vue:69] — ✅ résolu : `<template v-if="article.read">` enveloppe le séparateur + le texte.
- [x] [Review][Patch] `date` non validée (`z.string()`) → `formatDate` rend « Invalid Date » et le tri `.order("date","DESC")` se trompe si le format dévie. Valider au schéma (`z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`) — échec au build plutôt qu'à l'affichage. [content.config.ts] — ✅ résolu : `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, …)`.
- [x] [Review][Defer→Fixed] SEO `/blog` : pas d'OG/Twitter/canonical ni JSON-LD (`Blog`/`ItemList`) ; seuls `title`+`description` sont posés. — ✅ résolu pour `/blog` (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` (3) ajoutés au `useHead` ; vérifiés dans le HTML prerendu. La **centralisation SEO site-wide** (autres pages, `useSeoMeta` partagé) reste tracée pour Epic 9.
- [x] [Review][Defer→Fixed] Sémantique liste du feed : les articles sont rendus en `<div class="blog__list">` (cartes) alors que les **tags** de chaque carte sont en `<ul>/<li>` — incohérence avec la convention listes a11y de 5.2. Passer le feed en `<ul class="blog__list"><li>`. — ✅ résolu : feed en `<ul class="blog__list">` + `<li>` par article (reset de liste, rendu identique). La **généralisation a11y** (eyebrow→titre + listes home/services) reste Epic 9.

_Rejetés (bruit / faux positifs vérifiés)_ : branche erreur « inatteignable » (`useAsyncData` capture l'erreur dans `error`, ne throw pas — Edge) ; pas de loading state (site prérendu statique, contenu figé au build) ; clé `v-for` `article.path` (toujours présent/unique, type `page` — Edge) ; `alt=""` vignettes (décoratif correct, schéma rend `alt` requis — Auditor) ; `hero__tags` réutilisé (primitive globale voulue depuis 5.2) ; `ZTag` imbriqué dans le lien-carte (non interactif → pas de nested-interactive) ; ring de focus carte (fourni par `.zcard--interactive`) ; littéraux `200px`/`130px`/`56ch`/`900px` (structurels, mandatés par `kit.css` — Auditor) ; `h2` vs `h3` du titre (le `h3` du kit/ticket sauterait un niveau ici ; `h2` est le choix a11y correct, port visuel fidèle — Auditor) ; `object-fit:cover` (recadre sans déformer) ; corps markdown riches des articles (seed data pour 6.2, l'index ne rend que le front-matter — Auditor) ; i18n (site mono-français assumé).

---
baseline_commit: 3e82045b8f9bc18ad3d9520db0c18dbd9ad307c2
---

# Story 10.5: SEO centralisé site-wide

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur partageant une page (ou un moteur d'indexation),
I want des métadonnées SEO cohérentes et complètes sur toutes les pages,
so that le site est correctement indexé et présenté lors d'un partage (FR15).

## Acceptance Criteria

**Given** `app/utils/seo.ts` (helpers `SITE_URL`/`jsonLdScript`) et les pages encore nues (home n'a aucune meta dédiée ; services et contact n'exposent que `title`+`description`)
**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
**Then** chaque page expose OG/Twitter/canonical + JSON-LD pertinent dans le HTML prerendu, sans domaine hardcodé (résolu via `runtimeConfig`)
**And** gate verte ; HTML prerendu (`.output/public`) vérifié pour home, services et contact

## Tasks / Subtasks

- [x] Tâche 1 — Factoriser un helper SEO partagé (AC: #1)
  - [x] Créer un composable `app/composables/usePageSeo.ts` (ou util) qui pose `useSeoMeta` (title, description, og:title/description/url/image/type, twitter:card/title/description/image, canonical) à partir d'un objet `{ title, description, path, image? }`, en résolvant l'URL absolue via `useRuntimeConfig().public.siteUrl` (story 10.1). Objectif : **un seul point** de vérité pour le pattern OG/Twitter/canonical, consommé par toutes les pages (dédup `/about` + `/blog` qui le font déjà à la main).
  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
- [x] Tâche 2 — Étendre aux pages nues (AC: tout)
  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
  - [x] **Services `app/pages/services.vue`** : passer de `title`+`description` seuls à OG/Twitter/canonical + JSON-LD (`Service`/`WebPage`).
  - [x] **Contact `app/pages/contact.vue`** : idem (OG/Twitter/canonical + `ContactPage`).
  - [x] **Migrer `/about` + `/blog` + article** vers le helper partagé **sans régresser** leur SEO existant (ils ont déjà OG/Twitter/canonical + JSON-LD via `SITE_URL`/`jsonLdScript`) — dédup, rendu identique.
- [x] Tâche 3 — Validation (AC: tout)
  - [x] `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verts (11 routes).
  - [x] Inspecter le HTML **prerendu** (`.output/public/index.html`, `services/index.html`, `contact/index.html`, + re-vérifier `about`/`blog`) : présence de `og:*`, `twitter:*`, `<link rel="canonical">`, `<script type="application/ld+json">` ; URLs absolues résolues depuis `runtimeConfig` (staging tant que non basculé).

### Review Findings

- [x] [Review][Patch] Préserver les titres de partage social og:title et twitter:title d'article [app/pages/blog/[...slug].vue:134-140]
- [x] [Review][Patch] Ajouter @id (#organization) à l'Organization globale et lier le publisher aux BlogPosting [app/app.vue:87-98, app/pages/blog/[...slug].vue:121-131, app/pages/blog/index.vue:115-123]
- [x] [Review][Patch] Utiliser SITE.profile pour le schéma Person de la page /about [app/pages/about.vue:142-149]
- [x] [Review][Patch] Structurer les offres en Service / ListItem dans le schéma de la page services [app/pages/services.vue:139-148]
- [x] [Review][Patch] Supprimer la condition morte dans la sélection twitterCard de usePageSeo [app/composables/usePageSeo.ts:50-54]
- [x] [Review][Patch] Supporter imageAlt pour og:image:alt et twitter:image:alt dans usePageSeo [app/composables/usePageSeo.ts:4-18, app/pages/blog/[...slug].vue:137]
- [x] [Review][Patch] Robustifier le parsing d'URL absolue d'image dans usePageSeo via regex insensible à la casse [app/composables/usePageSeo.ts:44]
- [x] [Review][Patch] Normaliser le slash séparateur pour les images d'article dans le JSON-LD du blog [app/pages/blog/[...slug].vue:120, app/pages/blog/index.vue:122]
- [x] [Review][Patch] Ajouter addressCountry: "FR" dans les schémas PostalAddress [app/app.vue:94-97, app/pages/index.vue:356-359, app/pages/contact.vue:152-155]
- [x] [Review][Defer] Prix numériques et devise structurée (priceCurrency) pour les offres dans Schema.org [app/pages/services.vue:141-147] — deferred, pre-existing (décision de contenu/commerciale tarifaire)

## Dev Notes

### Périmètre & frontières

- **Story SEO** : centralise le pattern méta + l'étend aux pages nues. Source : `deferred-work.md` → Epic 10 item #6 (revues 5.1, 6.1, 6.2). [Source: epics.md#Epic 10 — Story 10.5 (FR15)]
- **Dépend de la story 10.1** : `SITE_URL` doit déjà être lu depuis `runtimeConfig.public.siteUrl` (plomberie posée en 10.1). **Ne pas re-hardcoder** le domaine. Si 10.1 a introduit un `useSiteUrl()`, le réutiliser.
- **Frontières** : SEO uniquement. PAS la bascule domaine prod (= 10.7, le `siteUrl` reste `dev.jouan.ovh` par défaut), PAS l'a11y (10.2/10.3/10.4), PAS le RGPD (10.6).
- **Réutiliser, ne pas réinventer** : `app/utils/seo.ts` fournit déjà `jsonLdScript()` (échappe `</script>`). `/about` (`app/pages/about.vue`) et `/blog` (`index.vue` + `[...slug].vue`) ont déjà un pattern OG/Twitter/canonical + JSON-LD **fonctionnel** — le helper doit **généraliser ce pattern existant**, pas en inventer un autre.

### Fichiers concernés (lus — baseline `3e82045`)

- **`app/utils/seo.ts`** (UPDATE) — `jsonLdScript()` conservé ; `SITE_URL` déplacé en runtimeConfig (10.1). Peut accueillir des helpers de construction d'URL/JSON-LD partagés.
- **Nouveau** : `app/composables/usePageSeo.ts` (helper `useSeoMeta` partagé).
- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
- **`app/pages/index.vue`** (UPDATE) — **aucun `useHead`** aujourd'hui → ajouter le SEO complet.
- **`app/pages/services.vue`**, **`app/pages/contact.vue`** (UPDATE) — `useHead` avec `title`+`description` seuls → étendre.
- **`app/pages/about.vue`**, **`app/pages/blog/index.vue`**, **`app/pages/blog/[...slug].vue`** (UPDATE) — migration vers le helper, **sans régression** (ils consomment `SITE_URL` aux lignes connues : about l.137-138, blog/index l.103/118/120, article l.117-118).
- **`app/data/site.ts`** (LECTURE) — `SITE.profile` (nom/rôle) pour `Organization`/`Person`.

### Pièges / régressions à éviter

- **`useRuntimeConfig()` dans le contexte Nuxt** (setup/plugin), pas au top-level d'un module (piège vu en 10.1).
- **Ne pas régresser le SEO existant** d'`/about`/`/blog`/article : vérifier le HTML prerendu **avant/après** la migration (mêmes balises, mêmes URLs).
- **JSON-LD échappé** : toujours via `jsonLdScript()` (échappe `</script>`) — ne pas injecter de JSON-LD brut.
- **Image OG** : URL **absolue** (préfixée `siteUrl`) ; vérifier que l'asset existe (`public/images/…`).
- **Shiki off / content** : ne pas toucher au pipeline `@nuxt/content`. **Prerender** : `useSeoMeta` est prerender-safe ; `generate` doit rester vert (11 routes).
- **Domaine non basculé** : tant que 10.7 n'est pas faite, les URLs restent `https://dev.jouan.ovh/...` — **c'est attendu** (ne pas hardcoder `jouan.ovh`).
- **pnpm + Docker** pour la gate.

### Testing standards

- Pas de framework de test. Barre = `pnpm lint`/`typecheck`/`generate` verts + inspection du **HTML prerendu** (`.output/public`) pour home/services/contact (+ non-régression about/blog) : `og:*`/`twitter:*`/canonical/JSON-LD présents, URLs absolues via runtimeConfig. [Source: project-context.md#Tests, #Helpers partagés SEO/date]

### References

- [Source: docs/planning-artifacts/epics.md#Epic 10 — Story 10.5 (FR15)]
- [Source: docs/implementation-artifacts/deferred-work.md#→ Epic 10 (item #6 centralisation SEO), revues 5.1, 6.1, 6.2]
- [Source: docs/project-context.md#Helpers partagés SEO/date (app/utils/seo.ts), #Nuxt (@nuxt/content, prerender)]
- [Source: app/utils/seo.ts ; app/pages/index.vue, services.vue, contact.vue, about.vue, blog/index.vue, blog/[...slug].vue ; nuxt.config.ts ; app/data/site.ts]
- [Source: Story 10.1 — SITE_URL via runtimeConfig (dépendance)]

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- Build & gate : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> 0 error, 11 prerendered routes.
- HTML inspection : `.output/public/{index,services,contact,about,blog}/index.html` checked for `<title>`, `<meta name="description">`, `og:*`, `twitter:*`, `<link rel="canonical">`, and `<script type="application/ld+json">`.

### Completion Notes List
- Création de `app/composables/usePageSeo.ts` qui centralise `useSeoMeta`, `<link rel="canonical">` et l'injection JSON-LD échappée via `jsonLdScript()`.
- Injection du schéma global `Organization` dans `app/app.vue` alimenté par `useSiteUrl()` et `SITE.profile`.
- Ajout des métadonnées SEO et schémas Schema.org (`WebSite`, `Person`, `Service`/`WebPage`, `ContactPage`, `ProfilePage`, `Blog`, `BlogPosting`) sur toutes les pages (`/`, `/services`, `/contact`, `/about`, `/blog`, `/blog/[...slug]`).
- Aucune URL hardcodée : résolution dynamique via `useSiteUrl()`.
- Validation complète via Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 11 routes prerendues avec succès et inspection conforme du HTML généré.

### File List
- `app/composables/usePageSeo.ts` (NEW)
- `app/app.vue` (MODIFIED)
- `app/pages/index.vue` (MODIFIED)
- `app/pages/services.vue` (MODIFIED)
- `app/pages/contact.vue` (MODIFIED)
- `app/pages/about.vue` (MODIFIED)
- `app/pages/blog/index.vue` (MODIFIED)
- `app/pages/blog/[...slug].vue` (MODIFIED)
- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
- `docs/implementation-artifacts/10-5-seo-centralise-site-wide.md` (MODIFIED)

## Change Log
- 2026-09-13 : Implémentation complète de la Story 10.5 — Centralisation du SEO et Schema.org site-wide via `usePageSeo` et `useSiteUrl()`. Statut passé à `review`.
- 2026-09-13 : Revue de code adverse (Blind, Edge, Auditor) — 9 patchs appliqués (préservation og:title, @id organization, publisher blog, Schema.org Service/ListItem, regex imageUrl, imageAlt, PostalAddress addressCountry). Validation CI et HTML prerendu verts. Statut passé à `done`.

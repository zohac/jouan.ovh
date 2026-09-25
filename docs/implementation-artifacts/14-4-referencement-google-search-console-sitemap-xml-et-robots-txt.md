---
baseline_commit: d8193c7
---

# Story 14.4: Référencement Google Search Console (DNS TXT OVH), Sitemap XML & Robots.txt

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Simon Jouan (propriétaire de `jouan.ovh`),
I want certifier la propriété de mon domaine apex dans Google Search Console et garantir l'exploration systématique des routes publiques et des articles publiés du site par les moteurs de recherche,
so that mon positionnement sur les systèmes IA et l'automatisation métier bénéficie d'une visibilité organique optimale, validée par une indexation certifiée (FR47, FR48, CAP-5, CAP-6, CAP-8).

## Acceptance Criteria

1. **Given** le domaine apex `jouan.ovh` géré chez OVH et la chaîne de publication GitHub Pages
   **When** on documente la méthode de vérification de propriété Google Search Console
   **Then** le document `docs/specs/spec-analytics-search-console/seo-verification.md` est finalisé et référence explicitement la méthode **vérification par enregistrement DNS TXT chez OVH** (périmètre « Domaine » couvrant `jouan.ovh` et ses sous-domaines)
   **And** aucune balise `<meta name="google-site-verification" …>` ni fichier HTML de vérification n'est ajouté au code Nuxt (vérification 100 % DNS, conformément au non-goal du SPEC §Non-goals)
   **And** la procédure opérationnelle pour Simon est consignée : (a) créer la propriété de type « Domaine » dans GSC, (b) GSC fournit un token TXT, (c) ajouter l'entrée TXT dans la zone DNS OVH, (d) confirmer la validation après propagation, (e) soumettre `https://jouan.ovh/sitemap.xml` dans le menu Sitemaps de GSC.

2. **Given** l'infrastructure statique Nitro et les 8 routes canoniques actuelles (`/`, `/services`, `/about`, `/blog`, `/contact`, `/mentions-legales`, `/confidentialite`, `/contact/card`) ainsi que tous les articles `content/blog/*.md`
   **When** on génère le site statique (`pnpm generate`)
   **Then** la route `https://jouan.ovh/sitemap.xml` est **autogénérée** par une server route Nitro (`server/routes/sitemap.xml.ts`) lors du prerender
   **And** chaque URL du sitemap est **absolue** et préfixée par `useSiteUrl()` (jamais de domaine hardcodé — règle d'or d'AGENTS.md §1)
   **And** la liste inclut :
     - `/` (priority `1.0`, `changefreq=weekly`)
     - `/services` (priority `0.9`, `changefreq=monthly`)
     - `/about` (priority `0.7`, `changefreq=monthly`)
     - `/contact` (priority `0.9`, `changefreq=monthly`)
     - `/blog` (priority `0.7`, `changefreq=weekly`)
     - `/mentions-legales` (priority `0.3`, `changefreq=yearly`)
     - `/confidentialite` (priority `0.3`, `changefreq=yearly`)
     - tous les articles présents dans `content/blog/*.md` (priority `0.6`, `changefreq=monthly`, `<lastmod>` calqué sur la date ISO du frontmatter)
   **And** chaque entrée porte une balise `<lastmod>` (date du jour pour les pages statiques, date du frontmatter `date:` pour les articles)
   **And** le fichier `.output/public/sitemap.xml` est conforme au schéma XML 0.9 du protocole sitemaps.org (validation : premier tag `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)

3. **Given** le site statique servi depuis `https://jouan.ovh`
   **When** un crawler demande `https://jouan.ovh/robots.txt`
   **Then** la route `server/routes/robots.txt.ts` retourne le contenu strict :
     ```
     User-agent: *
     Allow: /

     Sitemap: https://jouan.ovh/sitemap.xml
     ```
   **And** le fichier est servi avec le `Content-Type: text/plain; charset=utf-8`
   **And** aucune référence codée en dur n'est tolérée dans le code : l'URL du sitemap est dérivée de `useSiteUrl()` (cohérence avec l'AC 2)

4. **Given** l'environnement Docker du projet et la suite de validation
   **When** on exécute la commande de validation complète
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc
   **And** les routes publiques, les articles présents dans le contenu et les artefacts SEO (`sitemap.xml` + `robots.txt`) sont générés dans `.output/public` (vérification : `test -f .output/public/sitemap.xml && test -f .output/public/robots.txt`)
   **And** le contenu de `.output/public/sitemap.xml` est un XML valide (balise racine `<urlset xmlns="…">` + au moins 7 entrées correspondant aux pages statiques + entrées dynamiques pour les articles blog si `content/blog/*.md` non vide)
   **And** le contenu de `.output/public/robots.txt` référence bien `Sitemap: https://jouan.ovh/sitemap.xml` (pas de chemin relatif)
   **And** le `CNAME` (`jouan.ovh`) reste intact dans `.output/public/CNAME` (non régression du pipeline de déploiement)

## Tasks / Subtasks

- [x] **Tâche 1 — Finaliser la documentation de vérification GSC** (AC: 1)
  - [x] Mettre à jour `docs/specs/spec-analytics-search-console/seo-verification.md` pour expliciter la méthode DNS TXT OVH (le document existe déjà — vérifier que les 4 sections sont alignées avec l'AC 1 ci-dessus, notamment la procédure opérationnelle en 5 étapes pour Simon). Pas de modification de code applicatif.
  - [x] Vérifier qu'**aucun** fichier de vérification HTML (ex. `google[hash].html`) n'est présent dans `public/` et qu'**aucune** balise `<meta name="google-site-verification">` n'existe dans `nuxt.config.ts` ou les pages (`grep -r "google-site-verification" app/ nuxt.config.ts` doit retourner 0 résultat).
  - [x] Confirmer que `.env.example` ne référence pas de variable GSC (la vérification DNS TXT ne nécessite aucune clé applicative).

- [x] **Tâche 2 — Server route Nitro `server/routes/sitemap.xml.ts`** (AC: 2, 4)
  - [x] Créer le fichier `server/routes/sitemap.xml.ts` (Nuxt 4 / Nitro : server routes à la racine du projet ; co-existe avec `app/` qui contient le code applicatif Vue).
  - [x] Le handler exporté via `defineEventHandler(async (event) => { ... })` :
    - Définit `Content-Type: 'application/xml; charset=utf-8'` sur la réponse (`setHeader(event, 'content-type', '...')`).
    - Construit la liste des routes statiques d'abord (cf. liste AC 2 avec leurs `priority`/`changefreq`).
    - Lit dynamiquement la collection `blog` via le composable serveur `@nuxt/content` (`await serverQueryContent(event).order('date', 'DESC').find()` ou équivalent v3 — cf. Dev Notes §2 pour la signature exacte). Si la collection est vide (cas actuel : `content/blog/` vide), omet les entrées dynamiques sans erreur.
    - Pour chaque article : URL absolue = `${siteUrl}/blog/${slug}` (slug = `path` retiré du préfixe `/blog/` ou généré depuis le titre par `queryContent`).
    - Pour chaque article, `<lastmod>` est la date ISO du frontmatter `date:` (le contenu `queryCollection` de @nuxt/content v3 expose ce champ).
    - Sérialise via template literal XML (échappement XML des `<loc>` via `encodeURIComponent` est suffisant pour des URLs ; pas de contenu HTML libre).
  - [x] Ajouter `/sitemap.xml` à la liste `nitro.prerender.routes` dans `nuxt.config.ts` (pour que Nitro pré-rende la route pendant `nuxi generate`).
  - [x] Vérifier au DOM que `.output/public/sitemap.xml` existe et contient au minimum les 7 routes statiques avec `<lastmod>` au format ISO 8601.

- [x] **Tâche 3 — Server route Nitro `server/routes/robots.txt.ts`** (AC: 3, 4)
  - [x] Créer le fichier `server/routes/robots.txt.ts`.
  - [x] Le handler `defineEventHandler` :
    - Définit `Content-Type: 'text/plain; charset=utf-8'`.
    - Retourne le template strict :
      ```
      User-agent: *
      Allow: /

      Sitemap: ${siteUrl}/sitemap.xml
      ```
      où `siteUrl` est dérivé de `useSiteUrl()` (donc jamais en dur).
  - [x] Ajouter `/robots.txt` à `nitro.prerender.routes` dans `nuxt.config.ts`.
  - [x] Vérifier au DOM que `.output/public/robots.txt` existe et contient la ligne `Sitemap: https://jouan.ovh/sitemap.xml` (URL absolue, pas relative).

- [x] **Tâche 4 — Validation Docker & absence de régression** (AC: 4)
  - [x] Exécuter la gate complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérifications post-build :
    ```sh
    test -f .output/public/sitemap.xml && echo "sitemap OK"
    test -f .output/public/robots.txt && echo "robots OK"
    grep -q "^Sitemap: https://jouan.ovh/sitemap.xml$" .output/public/robots.txt
    grep -q "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" .output/public/sitemap.xml
    grep -qx "jouan.ovh" .output/public/CNAME  # non-régression du pipeline
    ```
  - [x] Vérification visuelle Chrome DevTools MCP (desktop + mobile) : `https://dev.jouan.ovh/sitemap.xml` (ou équivalent staging) renvoie du XML bien formé ; `https://dev.jouan.ovh/robots.txt` renvoie le contenu attendu avec le bon `Content-Type`.
  - [x] **Documentation de la procédure DNS TXT** dans le Dev Agent Record (le dev agent consigne les étapes 1-5 de l'AC 1 verbatim, sans exécution réelle — l'exécution reste à la charge de Simon dans OVH/GSC).

## Dev Notes

### ⚠️ Décision critique — Server routes Nitro plutôt que page Nuxt classique

Le sitemap et le robots.txt **NE sont PAS** des pages Vue Nuxt (`.vue`) :
- Ils doivent être servis avec un `Content-Type` strict (`application/xml` et `text/plain`).
- Ils ne doivent pas être hydratés côté client (zéro JS, zéro hydration mismatch).
- Le sitemap doit pouvoir lire dynamiquement la collection `blog` via `@nuxt/content` **côté serveur** au moment du prerender.

**Pattern retenu :** server routes Nitro sous `server/routes/` (Nitro 2.x — auto-découvert lors du build). Cette convention co-existe avec le code applicatif Nuxt sous `app/` : Nitro scanne automatiquement `server/routes/` à la racine du projet et crée des routes HTTP au moment du `nuxi generate`.

### 1. Architecture logicielle & fichiers à toucher

**Fichiers NEW (2) :**
- `server/routes/sitemap.xml.ts` — handler Nitro qui retourne le XML du sitemap.
- `server/routes/robots.txt.ts` — handler Nitro qui retourne le contenu texte du robots.txt.

**Fichiers UPDATE (1) :**
- `nuxt.config.ts` — ajout du bloc `nitro.prerender.routes: ['/sitemap.xml', '/robots.txt']` pour forcer le prerender des deux routes pendant `nuxi generate`.

**Fichiers documentation (UPDATE potentiel) :**
- `docs/specs/spec-analytics-search-console/seo-verification.md` — vérification finale que le document aligné avec l'AC 1 (probablement déjà conforme, à confirmer).

**Aucun fichier applicatif Vue/TypeScript à modifier** (les 13 pages restent inchangées : c'est l'infrastructure de prerender qui génère les artefacts SEO).

**À NE PAS toucher dans cette story :**
- `app/composables/useSiteUrl.ts` (déjà conforme et testé — utilisé tel quel).
- `app/composables/useConsent.ts`, `app/composables/useAnalytics.ts` (story 14.3, hors scope).
- `app/pages/**/*.vue` (les routes canoniques sont déjà créées en 13 pages par les stories précédentes).
- `public/CNAME`, `public/_headers` (acquis du pipeline de déploiement, story 10.1).
- `nuxt.config.ts` `runtimeConfig.public.*` (les `siteUrl`/`posthogKey`/etc. sont déjà câblés).
- `app/data/site.ts` (source unique de vérité du profil, non touchée par cette story).
- `package.json` (aucune nouvelle dépendance : on utilise le composable serveur natif de `@nuxt/content` déjà installé).

### 2. Détails d'implémentation critiques

#### 2.1 Lecture de la collection `blog` côté serveur Nitro

`@nuxt/content` v3 expose une variante **server-only** de `queryCollection` pour Nitro. La signature typique (à valider contre la version installée `^3.14.0`) :

```ts
import { serverQueryContent } from '#content/server'

// Dans le handler Nitro :
const articles = await serverQueryContent(event, 'blog')
  .sort({ date: -1 })
  .find()
```

> ⚠️ Si la signature diffère dans la version installée, fallback : itérer sur `readdirSync('content/blog')` et parser les frontmatters via `gray-matter` (non installé → préférer la première option). Vérifier la signature exacte dans `node_modules/@nuxt/content/dist/module.d.mts` (déjà inspecté : `serverQueryContent` n'apparaît pas dans le grep précédent ; explorer plus en profondeur dans `node_modules/@nuxt/content/dist/runtime/server/` qui expose `queryCollection`, `queryNav`, `querySurround`).

**Plan B documenté :** si `serverQueryContent` n'est pas disponible ou ne fonctionne pas en prerender Nitro, lire les fichiers markdown via Node `fs` :
```ts
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter' // ATTENTION : non installé
```
Plan B plus propre : utiliser l'API HTTP locale (Nitro `useStorage()`) ou itérer sur `content/blog/*.md` avec parsing frontmatter minimaliste via regex (`/^date:\s*(\d{4}-\d{2}-\d{2})/m`).

**Recommandation :** ouvrir `node_modules/@nuxt/content/dist/runtime/server.js` et confirmer la signature exacte avant de coder. Si le composable serveur n'est pas auto-importé dans une server route Nitro, utiliser le plan B (parseur frontmatter regex minimal — pas besoin de gray-matter, on ne lit que la date).

#### 2.2 Échappement XML du sitemap

Les URLs du sitemap doivent être échappées pour les caractères spéciaux XML (`&`, `<`, `>`, `'`, `"`). Pour des URLs absolues en HTTPS, `encodeURIComponent` couvre l'essentiel, mais une approche défensive consiste à wrapper `escapeXml()` :
```ts
const escapeXml = (str: string): string =>
  str.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!)
  )
```
Les URLs en `https://jouan.ovh/...` n'ont pas besoin d'échappement, mais les slugs d'articles (titres avec espaces ou accents) oui. **À appliquer systématiquement** sur chaque `<loc>`.

#### 2.3 Format de `<lastmod>`

Format strict ISO 8601 date (sans heure) : `YYYY-MM-DD`. Pour les articles : `article.date` (frontmatter déjà validé ISO via Zod dans `content.config.ts`). Pour les pages statiques : date du jour au moment du build (acceptable par les moteurs, ne pas utiliser `Date.now()` brut qui donnerait l'heure — préférer `new Date().toISOString().split('T')[0]`).

#### 2.4 `useSiteUrl()` côté serveur Nitro

`useSiteUrl()` lit `useRuntimeConfig().public.siteUrl`. Dans une server route Nitro, `useRuntimeConfig()` est disponible nativement (Nitro 2 expose le runtime Nuxt). Aucune adaptation nécessaire — le composable est utilisable directement. Vérification : cf. `useSiteUrl.ts` ligne 8.

#### 2.5 `nitro.prerender.routes` dans `nuxt.config.ts`

Le bloc à ajouter (dans l'objet racine `nitro: { ... }`) :
```ts
nitro: {
  prerender: {
    routes: ['/sitemap.xml', '/robots.txt'],
  },
},
```
Cela force Nitro à invoquer les server routes pendant le `nuxi generate` et à écrire les fichiers résultants dans `.output/public/sitemap.xml` et `.output/public/robots.txt`.

### 3. Patterns & invariants projet à respecter (issus de `AGENTS.md` + `docs/project-context.md`)

1. **Docker exclusif** : toute commande `pnpm`/`nuxi` via conteneur (jamais sur l'hôte macOS).
2. **Prerender-safe (SSG)** : les server routes Nitro s'exécutent au moment du build ; tous les accès `fs`/`process` sont OK (contexte serveur, pas client).
3. **Zéro hardcoding** : `useSiteUrl()` pour l'URL de base. Jamais `https://jouan.ovh` en dur dans le code.
4. **Tokens DS** : pas de CSS à ajouter ici (artefacts XML/texte).
5. **Zéro emoji** (NFR6), français, vouvoiement — uniquement dans les commentaires et la doc.
6. **CNAME + `_headers` intacts** : ne pas modifier `public/CNAME` ni `public/_headers`.
7. **`runtimeConfig.public.siteUrl`** est la source unique de vérité pour l'URL de base — ne pas dupliquer.

### 4. Testing standards summary

- **Pas de framework de test** (cf. `project-context.md#Tests`). Barre = `pnpm lint` + `pnpm typecheck` + `pnpm generate` (Docker, 0 erreur) + **vérification du contenu de `.output/public/sitemap.xml` et `.output/public/robots.txt`** (assertions shell listées dans Tâche 4).
- Vérifications explicites :
  - `pnpm generate` produit bien `.output/public/sitemap.xml` et `.output/public/robots.txt`.
  - Le XML est bien formé (premier tag = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`).
  - Le `robots.txt` référence `Sitemap: https://jouan.ovh/sitemap.xml` (URL absolue).
  - `CNAME` reste intact (`jouan.ovh`).
  - Aucune balise `<meta name="google-site-verification">` n'apparaît dans le HTML prerendu (grep sur `.output/public/**/*.html`).
  - Validation visuelle Chrome DevTools MCP : `http://localhost:3000/sitemap.xml` et `/robots.txt` répondent correctement en dev.

### 5. Project Structure Notes

- **Nouveauté Nuxt 4 :** les server routes Nitro vivent sous `server/routes/` à la **racine du projet** (et non sous `app/server/`). Nitro 2 scanne automatiquement ce dossier. Le code applicatif Vue reste sous `app/`.
- Pas de divergence avec la structure documentée dans `AGENTS.md §4` (qui mentionne uniquement `app/` — les server routes sont une addition mineure qui ne contredit aucune règle existante).
- Aucune migration de fichiers nécessaires.

### 6. Acquis des stories précédentes (à préserver)

- **Story 10.1, 10.7** — pipeline de déploiement gh-pages + `CNAME` intact (`public/CNAME` contient `jouan.ovh`). La non-régression de ce fichier est **non-négociable** (cf. AC 4).
- **Story 10.5** — SEO centralisé via `usePageSeo` + `useSiteUrl()` : on **réutilise** `useSiteUrl()` ici pour générer les URLs absolues du sitemap (cohérence parfaite avec les canonicals/og:url déjà produits par chaque page).
- **Story 14.1, 14.2, 14.3** — l'infrastructure PostHog ne doit pas affecter le sitemap/robots (vérifier que le plugin `posthog.client.ts` n'écrit pas dans `public/sitemap.xml` ou `public/robots.txt` — confirmé : il n'écrit rien dans `public/`).
- **Story 15.4** — la cohérence SEO globale (canonical/og:url pointent sur `jouan.ovh`) est cohérente avec le sitemap pointant sur `https://jouan.ovh/...`.

### 7. References

- [Source: docs/specs/spec-analytics-search-console/SPEC.md#CAP-5, CAP-6, CAP-8]
- [Source: docs/specs/spec-analytics-search-console/seo-verification.md#§1, §2, §3, §4]
- [Source: docs/planning-artifacts/epics.md#Story 14.4 — FR47, FR48]
- [Source: app/composables/useSiteUrl.ts] (consommation de `runtimeConfig.public.siteUrl` avec fail-fast)
- [Source: nuxt.config.ts] (config `runtimeConfig.public.siteUrl` + futur bloc `nitro.prerender.routes`)
- [Source: content.config.ts] (schéma Zod de la collection `blog` — champ `date` validé ISO)
- [Source: public/CNAME] (vérification non-régression `jouan.ovh`)
- [Source: AGENTS.md#Invariants — URLs/Hardcoding, Docker-only, prerender-safe]
- [Source: docs/project-context.md#Tests, Nuxt, SSR/SSG]
- [Source: @nuxt/content v3.14.0 docs] — `serverQueryContent` (signature à confirmer dans `node_modules/@nuxt/content/dist/runtime/server.js`)

## Dev Agent Record

### Agent Model Used

`opencode/space-bunny-free`

### Implementation Plan

1. Aligner la procédure GSC et l'absence de vérification applicative.
2. Confirmer l'API serveur de `@nuxt/content` v3, puis créer les deux handlers Nitro.
3. Pré-rendre les artefacts via `nitro.prerender.routes`, valider leur contenu et exécuter la gate Docker.

### Debug Log References

- API `@nuxt/content` v3.14 confirmée : `queryCollection(event, "blog")` depuis `@nuxt/content/server` ; pas de fallback `fs` requis.
- Première passe `pnpm lint` : une seule erreur Prettier sur le chaînage `queryCollection` ; formatage corrigé, puis lint vert.
- Gate complète `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → 0 erreur ; `/sitemap.xml` et `/robots.txt` pré-rendus.
- `.output/public/sitemap.xml` : XML validé via `xmllint`, 8 URL absolues et 8 `<lastmod>` ISO 8601 (7 routes détaillées dans l'AC + `/contact/card`, route canonique SEO explicitement présente dans le Given).
- Assertions post-build réussies : fichiers présents, racine XML conforme, contenu `robots.txt` strict, sitemap absolu, `CNAME` intact, aucune balise GSC dans le HTML généré.
- Smoke test HTTP dev : premier passage `/sitemap.xml` en 500 après une génération isolée, symptomatique de la base SQLite `@nuxt/content` dev périmée documentée dans `project-context.md`. `docker compose restart web` réindexe le contenu ; nouveau passage : HTTP 200 et `Content-Type: application/xml; charset=utf-8` pour le sitemap, HTTP 200 et `Content-Type: text/plain; charset=utf-8` pour robots.
- Contrôle navigateur desktop (1440 × 900) et mobile (390 × 844) : arbre XML complet et contenu robots exact dans les deux viewports.
- Écart quantitatif documenté : Nitro annonce 30 routes après ajout des deux nouveaux endpoints, et non 28. Le build de référence de la story 14.3 en annonçait déjà 28 ; 28 + `/sitemap.xml` + `/robots.txt` = 30. Les artefacts et contenus exigés sont tous présents.

### Completion Notes List

- Tâche 1 : documentation SEO alignée sur la vérification GSC par propriété « Domaine » et DNS TXT OVH, avec procédure opérationnelle en cinq étapes.
- Audits réussis : aucun fichier `public/google*.html`, aucune balise `google-site-verification` dans le code et aucune variable GSC dans `.env.example`.
- Tâche 2 : sitemap Nitro pré-rendu, XML 0.9 valide, huit routes statiques absolues (dont `/contact/card`) et lecture dynamique de la collection blog ; aucune entrée dynamique ne casse le build lorsque `content/blog/` est vide.
- Tâche 3 : `robots.txt` Nitro pré-rendu avec `Content-Type: text/plain; charset=utf-8`, exploration générale autorisée et sitemap absolu dérivé de `useSiteUrl()`.
- Tâche 4 : gate Docker verte, contrôles shell et HTTP verts, `CNAME` préservé, absence de vérification HTML GSC confirmée et smoke test desktop/mobile réussi.
- Tests automatisés : aucun framework de test n'est configuré dans le dépôt ; les Story 2 et 14 ne justifient pas l'ajout d'une dépendance. La validation repose sur les assertions de build, `xmllint`, les réponses HTTP et le contrôle navigateur décrits ci-dessus.
- Avertissements de build non bloquants et préexistants : `.gitkeep` non parsable par `@nuxt/content`, recommandation `payloadExtraction` et avertissement de sourcemap module-preload ; aucun avertissement ne provient des deux handlers ajoutés.

### Procédure DNS TXT — exécution manuelle par Simon

Cette procédure est documentée mais n'a pas été exécutée dans OVH ou Google Search Console :

1. (a) créer la propriété de type « Domaine » dans GSC,
2. (b) GSC fournit un token TXT,
3. (c) ajouter l'entrée TXT dans la zone DNS OVH,
4. (d) confirmer la validation après propagation,
5. (e) soumettre `https://jouan.ovh/sitemap.xml` dans le menu Sitemaps de GSC.

### File List

**NEW**
- `server/routes/sitemap.xml.ts`
- `server/routes/robots.txt.ts`

**UPDATE**
- `nuxt.config.ts`
- `docs/specs/spec-analytics-search-console/seo-verification.md`
- `docs/implementation-artifacts/sprint-status.yaml`
- `docs/implementation-artifacts/14-4-referencement-google-search-console-sitemap-xml-et-robots-txt.md`

### Review Findings

- [x] [Review][Patch] Supprimer l'hypothèse fixe de 28 routes au profit d'un contrôle des routes publiques, articles et artefacts SEO [14-4-referencement-google-search-console-sitemap-xml-et-robots-txt.md:56]
- [x] [Review][Patch] Remplacer le compte obsolète « 13 routes publiques » par « 8 routes canoniques + articles publiés » [14-4-referencement-google-search-console-sitemap-xml-et-robots-txt.md:14]
- [x] [Review][Defer] Validation calendaire stricte de `content.blog.date` [content.config.ts:17] — deferred, pre-existing

## Change Log

- 2026-09-24 : documentation GSC DNS TXT finalisée ; handlers Nitro `sitemap.xml` et `robots.txt` créés et pré-rendus ; gate Docker verte ; validations XML, shell, HTTP et navigateur desktop/mobile réussies ; statut → review.
- 2026-09-24 : revue de code terminée ; suppression des comptes de routes fixes et clarification de l'inventaire dynamique ; 2 patches appliqués, 1 finding préexistant différé ; statut → done.

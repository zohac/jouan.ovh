---
title: "Search Console — sitemap non récupéré et pages en redirection"
status: implemented
created: 2026-10-30
epic: hors-epic
scope: seo
---

# Search Console : sitemap non récupéré et pages en redirection

Diagnostic et correctif du 2026-10-30, à la suite des notifications Google Search
Console du 2026-10-07 (`Page avec redirection`, `Erreur liée aux redirections`) et de
l'état `Impossible de récupérer le sitemap` sur `https://jouan.ovh/sitemap.xml`.

## 1. Constat mesuré

### 1.1 Le sitemap est servi correctement aujourd'hui

| Contrôle | Résultat |
| --- | --- |
| `GET https://jouan.ovh/sitemap.xml` | `200`, `content-type: application/xml`, 2179 octets |
| XML | `urlset` valide, 8 `loc`, aucune entrée vide ni dupliquée |
| `robots.txt` | `Sitemap: https://jouan.ovh/sitemap.xml` présent, `Allow: /` |
| Feuille de style `/__sitemap__/style.xsl` | `200` |
| Compression (`Accept-Encoding: gzip`) | réponse identique octet pour octet |

La Search Console n'a donc pas un sitemap cassé : elle conserve un **échec de
première lecture**.

### 1.2 L'échec de lecture coïncide avec la première publication du sitemap

`git log origin/gh-pages -- sitemap.xml` ne retourne qu'un seul commit :

- `3697817 deploy: 65a0239…` — **2026-09-25 13:31:16 UTC**.

La Search Console affiche « Dernière lecture : 25 sept. 2026 », soit exactement la
fenêtre de déploiement qui a introduit le fichier pour la première fois (Epic 14).
La soumission a donc été lue pendant que GitHub Pages basculait encore sur le
nouveau commit (ou sur un 404 encore en cache Fastly, `max-age=600`), et la
propriété est restée figée sur cet échec. Aucun re-test n'a eu lieu depuis.

### 1.3 Les redirections viennent de la forme d'URL émise, pas de l'hébergement

GitHub Pages sert une page uniquement sous sa forme « dossier » :

```
/about        -> 301 -> /about/          200
/blog         -> 301 -> /blog/           200
/contact      -> 301 -> /contact/        200
/mentions-legales -> 301 -> /mentions-legales/  200
```

Or tout ce que le site émettait désignait la forme **sans** barre finale :

- `<link rel="canonical" href="https://jouan.ovh/about">`, `og:url` identique ;
- les 8 `loc` du sitemap (`/about`, `/services`, `/contact`, `/blog`…) ;
- tous les liens internes (`href="/about"`).

Chaque page du sitemap était donc une redirection 301, et chaque page déclarait un
canonical qui redirige — exactement les deux motifs signalés les 2026-10-07. Les
exemples fournis par Google (`https://jouan.ovh/mentions-legales`,
`https://jouan.ovh/contact`) sont ceux du sitemap et du canonical.

Les redirections `http://jouan.ovh/` → `https://jouan.ovh/` et
`https://www.jouan.ovh/` → `https://jouan.ovh/` sont, elles, **normales** et
attendues : elles consolident les variantes de protocole et d'hôte, et ne peuvent
pas être supprimées sur GitHub Pages.

## 2. Correctif

### 2.1 Forme canonique unique : la barre finale

- `site.trailingSlash: true` (`nuxt.config.ts`) — `nuxt-site-config` propage la forme
  à ses consommateurs, dont `@nuxtjs/sitemap` (`fixSlashes`,
  `createSitePathResolver`) et les jumeaux Markdown d'AI Ready (`canonical_url`).
- `experimental.defaults.nuxtLink.trailingSlash: "append"` — tous les liens internes
  pointent la forme servie (`/about/`), y compris ceux rendus par `<ZCard :as="NuxtLink">`.
- `toCanonicalPath()` / `absoluteCanonicalUrl()` (`app/utils/site-url.ts`) —
  appliqués par `usePageSeo()` au canonical et à `og:url`, et par les pages au
  `url` du JSON-LD (`WebPage`, `ProfilePage`, `BlogPosting`, `Person`, `WebSite`).
  La racine reste `/` ; un fragment (`/services#offre`) est conservé en fin d'URL.

### 2.2 Effets de bord traités

- `HeaderComponent.isActive()` compare désormais des chemins sans barre finale :
  la route courante porte `/about/` après navigation, et l'état actif
  (`aria-current="page"`, `hdr__link--active`) reste correct.
- `useAnalytics` normalise `path`, `page_path` et `location` **sans** barre finale :
  la série d'analyse de l'Epic 14 reste continue, sans nouvelle propriété ni
  nouvel événement.

### 2.3 Garde-fou CI

Dans `.github/workflows/cd.yml`, la vérification de la sortie statique impose :

- tous les `loc` du sitemap se terminent par `/` ;
- pour chaque `loc`, le `<link rel="canonical">` du HTML **est exactement** ce `loc`.

Une régression future (canonical ou sitemap qui désigne une redirection) casse donc
la CI au lieu de partir en production.

## 3. Preuves locales (build `NUXT_SITE_ENV=production`)

```
https://jouan.ovh/
https://jouan.ovh/about/
https://jouan.ovh/blog/
https://jouan.ovh/confidentialite/
https://jouan.ovh/contact/
https://jouan.ovh/mentions-legales/
https://jouan.ovh/services/
https://jouan.ovh/contact/card/
```

- `/about/` : `canonical = https://jouan.ovh/about/`, `og:url` identique, liens
  internes `/services/`, `/contact/`, `/blog/`, `/confidentialite/`,
  `/mentions-legales/`.
- `/blog/` (fixture CI) : `canonical = https://jouan.ovh/blog/__ci-seo-published/`,
  `loc` correspondant identique.
- Navigation client vérifiée au navigateur : clic sur « À propos » → `/about/`,
  `aria-current="page"` sur le lien d'en-tête, de menu mobile et de pied de page.
- Vérifications CI rejouées localement : `Verify static output`,
  `Verify clean deployment output`, `pnpm lint`, `pnpm typecheck` — vertes.

## 4. Actions d'exploitation à faire dans la Search Console

À exécuter par Simon, propriétaire de la propriété :

1. **Sitemaps** → ligne `https://jouan.ovh/sitemap.xml` → menu `⋮` → **Supprimer le
   sitemap**, puis re-soumettre la même URL. C'est le seul moyen de forcer une
   relecture et de sortir de l'état `Impossible de récupérer` figé depuis le
   2026-09-25.
2. **Inspection de l'URL** → `https://jouan.ovh/mentions-legales/` puis
   `https://jouan.ovh/contact/` → **Tester l'URL en direct** → vérifier
   « Page disponible sur le Web » et « URL canonique déclarée par l'utilisateur ».
3. **Indexation des pages** → demander une validation des corrections une fois le
   sitemap relu, puis suivre la disparition des motifs `Page avec redirection` et
   `Erreur liée aux redirections`.
4. Conserver `http://jouan.ovh/` et `https://www.jouan.ovh/` dans les redirections
   attendues : ce sont des consolidations normales, pas des anomalies.

## 5. Notes d'exploitation

- **`NUXT_SITE_ENV=development` rend le site entier non indexable.** Avec cette
  valeur (celle du `.env` local), `nuxt-site-config` renvoie `indexable: false` :
  `@nuxtjs/robots` injecte `noindex, nofollow` sur toutes les pages et
  `@nuxtjs/sitemap` exclut toutes les routes, d'où un `sitemap.xml` vide. C'est un
  garde-fou, pas une régression : **pour inspecter les artefacts SEO/AEO en local,
  lancer la génération avec `NUXT_SITE_ENV=production`**
  (`docker compose run --rm -e NUXT_SITE_ENV=production web …`).
- Les `Source :` de `llms-full.txt` restent émis sans barre finale par AI Ready.
  La CI compare désormais la couverture par chemin normalisé, pas l'orthographe :
  ces artefacts nomment des routes, pas des URL indexables.
- Réserve inchangée : ce correctif **ne garantit** ni indexation, ni classement, ni
  citation. Il supprime une cause identifiée de redirection et rétablit une lecture
  possible du sitemap. La réserve « Validation DNS et exploitation Google Search
  Console » du point de contrôle Epic 14 reste suivie par Simon.

## 6. Sonde de production

`scripts/probe-production.mjs` interroge l'origine publique, là où la CI de `cd` ne
regarde jamais (elle valide `.output/public`, avant redirection 301 et avant cache).

Contrôles, exécutés après chaque déploiement réussi sur `main`
(`.github/workflows/production-probe.yml`, `workflow_run`) et chaque jour à 06:17 UTC
(`schedule`) :

| Contrôle | Écart détecté |
| --- | --- |
| `robots.txt` 200, `text/plain`, `Sitemap:` absolu | Politique d'exploration cassée |
| `sitemap.xml` 200, type XML, `loc` uniques et non vides | `Impossible de récupérer le sitemap` |
| chaque `loc` : barre finale, 200 **sans** redirection | « Page avec redirection », « Erreur liée aux redirections » |
| `<link rel="canonical">` de chaque page **égal** à son `loc` | Canonical qui redirige ou canonicals divergents |
| directive `robots` sans `noindex` sur chaque page listée | Site entier désindexé (`NUXT_SITE_ENV` mal positionné, garde-fou oublié) |
| `llms.txt`, `llms-full.txt`, `sitemap.md` servis | Artefacts AEO non publiés |
| forme sans barre finale encore redirigée | Liens anciens en 404 |

Chaque requête porte un jeton de cache-busting et l'origine canonique attendue est
lue dans `llms.txt` : la sonde ne peut pas valider un déploiement précédent resté en
cache. Après un déploiement, elle réessaie 16 × 15 s (propagation GitHub Pages) ; sur
le run quotidien, deux tentatives suffisent.

Vérification locale possible avant tout déploiement, sur un aperçu HTTP du build :

```sh
node scripts/probe-production.mjs --base http://127.0.0.1:4174
```

Preuves du 2026-10-30 : la sonde **échoue** sur la production d'alors (8 écarts, tous
les `loc` sans barre finale) et **passe** sur le build corrigé servi localement.

# Observabilité SEO & Vérification Google Search Console

Ce document formalise la validation de propriété du domaine `jouan.ovh` dans Google Search Console et le contrat de génération des artefacts d’exploration `sitemap.xml` et `robots.txt`.

> **État au 2026-09-25 :** les artefacts SEO et les probes de production sont vérifiés. La validation DNS Google et la soumission du sitemap dans Google Search Console restent des opérations à exécuter ; elles ne sont pas déduites de la présence des fichiers.

---

## 1. Méthode retenue : vérification par enregistrement DNS TXT chez OVH

La vérification de propriété Google Search Console s’effectue exclusivement par voie DNS :

- **Périmètre :** propriété de type « Domaine » couvrant `jouan.ovh` et ses sous-domaines.
- **Action requise :** création d’une entrée DNS de type `TXT` dans la zone DNS OVH avec la valeur fournie par Google Search Console :
  ```text
  google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  ```
- **Impact sur le code applicatif :** aucune balise meta ni fichier de vérification Google n’est ajouté au dépôt.

La validation DNS et la soumission du sitemap restent des opérations post-déploiement. Une gate locale ne constitue pas une preuve de validation Google.

---

## 2. Sitemap XML généré par Nuxt SEO

- **URL de production :** `https://jouan.ovh/sitemap.xml`
- **Propriétaire unique :** le module `@nuxtjs/sitemap` prend possession de `/sitemap.xml` en mode `zeroRuntime: true`. Aucun handler `server/routes/sitemap.xml.ts` ni copie `public/sitemap.xml` n’existe.
- **Source canonique :** `NUXT_SITE_URL` alimente Nuxt Site Config ; `useSiteUrl()` adaptateur cette valeur pour les canonicals HTML. `runtimeConfig.public.siteUrl` n’est plus une source concurrente.
- **Découverte :** les pages Nuxt sont découvertes automatiquement par le module. Les articles sont fournis par l’intégration `@nuxt/content` v3 et les schémas `defineSitemapSchema()` / `defineRobotsSchema()` déclarés dans `content.config.ts`. Aucun manifeste d’articles n’est codé en dur.
- **Routes attendues :** `/`, `/services`, `/about`, `/contact`, `/contact/card`, `/blog`, `/mentions-legales`, `/confidentialite` et chaque article publié.
- **Dates :** `<lastmod>` utilise `updated` lorsqu’il est renseigné, sinon `date`. Les pages sans date de contenu n’émettent pas de date de build uniforme. `priority` et `changefreq` sont omis, car aucun consommateur non Google ne les réclame.
- **Exclusions :** brouillons, articles futurs, entrées noindex, `sitemap: false`, `robots: false`, routes d’erreur, assets et endpoints internes ne sont pas inclus. Les URLs publiques présentes dans le sitemap possèdent toutes un fichier HTML statique correspondant.
- **Format :** XML sitemap 0.9 valide, une seule occurrence par URL et une origine absolue canonicale.

Le hook de build `content:file:afterParse` construit dynamiquement l’état des routes Content sans manifeste manuel. Cet état est conservé dans `.data/content/seo-routes.json` afin que les builds suivants restent déterministes même lorsque la base SQLite est réutilisée. Les articles noindex sont prérendus avec leur balise `noindex` lorsqu'ils restent accessibles, puis retirés du sitemap fusionné par `server/plugins/seo-content.ts` ; les entrées `sitemap: false` ou `sitemap: null` restent également hors du sitemap et des artefacts AEO, selon la matrice de visibilité. Le plugin réapplique le `lastmod` éditorial après la fusion des sources, sans `priority` ni `changefreq`.

---

## 3. Robots.txt généré par Nuxt Robots

Le module `@nuxtjs/robots` est le propriétaire unique de `/robots.txt`. Aucun handler `server/routes/robots.txt.ts` ni fichier `public/robots.txt` n’est maintenu.

Le fichier statique est produit avec le type MIME `text/plain; charset=utf-8`. En production, le contenu attendu est :

```text
User-agent: *
Allow: /

Sitemap: https://jouan.ovh/sitemap.xml
```

En développement et staging, `NUXT_SITE_ENV` différent de `production` bloque l’indexation avec `Disallow: /`. La ligne `Sitemap:` absolute est ajoutée automatiquement par l’intégration Robots/Sitemap ; l’origine provient de Nuxt Site Config.

---

## 4. Vérification locale reproductible

Toutes les commandes de build et d’outillage s’exécutent dans Docker :

```sh
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
```

Pour vérifier le contrat de production :

```sh
docker compose run --rm -e NUXT_SITE_ENV=production web sh -c "corepack enable && pnpm generate"
grep -Fqx "Sitemap: https://jouan.ovh/sitemap.xml" .output/public/robots.txt
```

La CI vérifie l’existence de `sitemap.xml`, `robots.txt`, `contact/card/index.html`, `_headers` et `CNAME`, puis contrôle la racine XML, l’origine, l’unicité, les exclusions et la présence du HTML de chaque URL. Elle ne compare jamais le nombre de routes Nitro, qui peut évoluer avec les modules. Les dumps internes `__ai-ready` et `__nuxt_content/blog/sql_dump.txt` doivent être absents de la sortie statique.

`public/_headers` et `public/CNAME` sont émis par le build. La CI ne les recopie pas après coup afin d’écraser un éventuel artefact généré ; elle compare leur présence et leur contenu.

---

## 5. Démarche Google Search Console

1. Simon Jouan crée dans Google Search Console une propriété de type « Domaine » couvrant `jouan.ovh` et ses sous-domaines.
2. Google Search Console fournit un token de vérification.
3. Simon ajoute l’entrée DNS `TXT` portant ce token dans la zone OVH.
4. Après propagation, Simon demande la confirmation de validation à Google Search Console.
5. Après le déploiement de la story 14.5, Simon soumet `https://jouan.ovh/sitemap.xml` dans le menu « Sitemaps ».

Cette démarche est documentée mais son exécution et sa validation ne sont pas encore enregistrées. Le sitemap servi en production ne vaut donc pas preuve de propriété Google, de soumission ou d'indexation.

---

## 6. Validation AEO et AI Ready

La story 14.6 installe `nuxt-ai-ready@2.4.0` en mode statique. La configuration est volontairement déterministe : `contentSource: true`, `contentNegotiation: false`, `database: false`, `runtimeSync: false`, `cron: false`, `llmsTxt.markdownLinks: true`, `sitemapMd: true` et `describedby: true`. MCP, WebMCP, API Catalog, Agent Skills, routes de diagnostic et synchronisation runtime sont désactivés.

### Artefacts attendus

Le build de production doit produire :

- `/llms.txt` : présentation française, origine canonique, pages publiques principales, articles publiés et liens vers les jumeaux Markdown ;
- `/llms-full.txt` : export contextuel des pages effectivement prérendues ;
- `/sitemap.md` : index Markdown des jumeaux ;
- `/index.md`, `/services.md`, `/about.md`, `/contact.md`, `/contact/card.md`, `/blog.md`, `/mentions-legales.md`, `/confidentialite.md` ;
- un jumeau `.md` pour chaque article publié et chaque route présente dans le sitemap.

Les liens HTML `rel="alternate" type="text/markdown"` et `rel="describedby" href="/llms.txt"` sont vérifiés dans chaque HTML éligible. Le hook Content expose un alias interne `updatedAt` dérivé de `updated` pour que la représentation Markdown publie `last_updated` lorsque cette date éditoriale existe. Le hook d'AI Ready complète ensuite le frontmatter Markdown avec `date`, `updated`, `tags`, `image` et `read` à partir du fichier source, y compris lorsque l'article est stocké dans un `index.md` imbriqué, sans réécrire le corps ni dupliquer les champs. Les routes noindex, brouillons, futurs et exclusions explicites sont retirés des artefacts AEO ; leur HTML peut rester accessible avec sa balise `noindex` afin de préserver le contrat SEO 14.5, mais ses liens `alternate`/`describedby` sont retirés et une requête `.md` directe répond 404 en développement comme en production.

En `NUXT_SITE_ENV=staging` ou `development`, le propriétaire Robots conserve le blocage global `Disallow: /` et n'expose pas les groupes OpenAI de production. La politique OAI/GPT doit donc être vérifiée sur un build `NUXT_SITE_ENV=production` ; un artifact local de staging ne vaut pas preuve de la politique publiée.

Les pages légales et les coordonnées professionnelles déjà publiques sont incluses comme texte public. Les valeurs de formulaire, les secrets, les cookies de session, les scripts analytics, les composants de terminal et les contenus privés ne sont jamais ajoutés aux sorties.

### Nettoyage et publication

AI Ready utilise une base SQLite temporaire pendant le build, mais son dossier public `__ai-ready/` (`pages.json`, `pages.dump`, `pages.meta.json`) est supprimé après la génération statique. Le dump technique `__nuxt_content/blog/sql_dump.txt` est également retiré de la sortie publique. Ces fichiers ne sont ni des pages AEO, ni liés depuis `llms.txt` ou `sitemap.md`, ni exposés dans les jumeaux Markdown ; les routes techniques Content générées par le framework ne sont donc pas des contenus AEO.

`public/_headers` reste la source des règles de cache et de sécurité. AI Ready enrichit la copie générée avec les règles `/*.md`, le MIME Markdown et la relation `describedby`. La CI compare les invariants de `CNAME` et vérifie la structure de `_headers`, sans recopier `public/_headers` après le build.

### Assertions reproductibles

La gate Docker complète est exécutée avec :

```sh
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
```

Le contrôle de production vérifie ensuite :

```sh
docker compose run --rm -e NUXT_SITE_ENV=production web sh -c "corepack enable && pnpm generate"
python3 - <<'PY'
from pathlib import Path

public = Path('.output/public')
for name in ('llms.txt', 'llms-full.txt', 'sitemap.md', 'index.md', 'robots.txt', 'sitemap.xml', '_headers', 'CNAME'):
    assert (public / name).is_file(), name
assert (public / 'llms.txt').stat().st_size <= 64 * 1024
assert (public / 'llms-full.txt').stat().st_size <= 1024 * 1024
assert not (public / '__ai-ready').exists()
PY
```

Le workflow GitHub Actions commence par supprimer les caches générés `.nuxt` et `.data`, régénère les types avec `nuxi prepare`, puis ajoute les mêmes contrôles aux artifacts : groupes robots `OAI-SearchBot` et `GPTBot`, couverture Markdown dérivée de chaque URL du sitemap, liens HTML, absence de doublons, budgets, fixtures temporaires et absence de marqueurs de secrets. Une fixture article avec `title`, `description`, `date`, `updated`, `tags`, `image`, `read` et un fence de code, une fixture `index.md` imbriquée et une fixture noindex contenant un filet Markdown `---` sont créées puis supprimées ; aucun faux article ne reste dans `content/blog/`.

### HTTP local et post-déploiement

Le serveur de développement est contrôlé sur `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/sitemap.md`, `/index.md`, `/about.md` et un article fixture pour vérifier les types MIME. Les routes article publiées répondent 200 sur `.md`, tandis que draft, futur, noindex et sitemap exclu répondent 404. Après build SSG isolé, si la base SQLite Content du serveur de développement est invalidée, exécuter `docker compose restart web` puis répéter ces requêtes.

Après le déploiement GitHub Pages, répéter les requêtes sur les URLs publiques, notamment :

```sh
curl -I https://jouan.ovh/llms.txt
curl -I https://jouan.ovh/llms-full.txt
curl -I https://jouan.ovh/about.md
curl -I https://jouan.ovh/robots.txt
```

La présence des fichiers et le contenu HTTP doivent être consignés dans le Dev Agent Record. GitHub Pages peut servir `.md` avec un type MIME différent et n'interprète pas `_headers` comme un reverse proxy : les balises HTML et les URLs explicites restent les mécanismes de découverte vérifiables. Une propagation OpenAI peut en outre être différée d'environ 24 heures ; la CI ne prétend pas mesurer une visibilité ChatGPT immédiate.

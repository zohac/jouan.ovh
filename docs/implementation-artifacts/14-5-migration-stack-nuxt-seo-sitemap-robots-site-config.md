---
baseline_commit: d8193c77d218c364b9ea4d65b8bddb8ac3900f8b
---

# Story 14.5: Migration SEO Nuxt automatisée — Sitemap, Robots & Site Config

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Simon Jouan,
I want que la génération du sitemap et de robots.txt soit portée par les modules Nuxt SEO officiels, avec une configuration de site partagée et une découverte automatique des routes,
so that le site reste correctement indexable après chaque ajout de page ou d’article, sans maintenir de manifeste de routes manuel.

## Acceptance Criteria

1. **Given** le projet Nuxt 4 statique et l’implémentation locale de la story 14.4,
   **When** la stack SEO est migrée via Docker,
   **Then** `@nuxtjs/sitemap` et `@nuxtjs/robots` sont ajoutés comme dépendances reproductibles et verrouillées dans `pnpm-lock.yaml` (`nuxt-site-config` reste une dépendance transitive du module),
   **And** le bundle meta `@nuxtjs/seo` n’est pas installé sans décision séparée, car `usePageSeo()` fournit déjà les métadonnées JSON-LD/OpenGraph du projet,
   **And** aucune commande `pnpm`, `npm`, `yarn` ou `nuxi` n’est exécutée directement sur la machine hôte.

2. **Given** `runtimeConfig.public.siteUrl`, `useSiteUrl()`, `public/CNAME` et la chaîne GitHub Pages,
   **When** la configuration Nuxt SEO est terminée,
   **Then** `NUXT_SITE_URL`, `NUXT_SITE_NAME` et `NUXT_SITE_ENV` sont la source Nuxt Site Config explicite du build, et `useSiteUrl()` conserve son API en lisant cette configuration avec sa validation fail-fast actuelle,
   **And** l’ancienne configuration `runtimeConfig.public.siteUrl` n’est plus une source SEO concurrente ; `.env.example` et le workflow CI sont mis à jour avec la même origine,
   **And** l’environnement local/staging est non indexable tandis que le build de production est explicitement identifié comme indexable,
   **And** le `CNAME` et la configuration de déploiement restent inchangés.

3. **Given** les huit routes pages publiques actuelles et la collection `blog` de `@nuxt/content`,
   **When** `pnpm generate` est exécuté,
   **Then** `/sitemap.xml` est produit par `@nuxtjs/sitemap` avec `zeroRuntime: true` et découvre automatiquement les routes indexables de l’application,
   **And** les routes de page (`/`, `/services`, `/about`, `/contact`, `/contact/card`, `/blog`, `/mentions-legales`, `/confidentialite`) et chaque article publié sont présents une seule fois avec des URL absolues,
   **And** les articles sont alimentés par l’intégration Content v3 et ses schémas `defineSitemapSchema()`/`defineRobotsSchema()`, sans liste d’articles codée en dur,
   **And** le `<lastmod>` n’est émis que pour une date de contenu réelle ; il ne doit pas être une date de build uniforme ni un `autoLastmod` automatique,
   **And** `priority` et `changefreq` sont omis sauf exigence documentée d’un consommateur non Google,
   **And** les pages de fallback, erreurs, assets, endpoints internes, brouillons, articles noindex et routes explicitement exclues ne sont pas inclus,
   **And** chaque URL du sitemap possède une page HTML statique correspondante,
   **And** aucune assertion ne dépend d’un nombre total Nitro instable.

4. **Given** le handler sitemap actuel et le handler robots actuel,
   **When** les modules officiels prennent possession des routes,
   **Then** `server/routes/sitemap.xml.ts` et `server/routes/robots.txt.ts` sont supprimés afin d’éviter deux propriétaires pour `/sitemap.xml` et `/robots.txt`,
   **And** les entrées manuelles correspondantes dans `nitro.prerender.routes` sont supprimées ou remplacées par le mécanisme officiel vérifié,
   **And** `/robots.txt` est généré avec `Content-Type: text/plain; charset=utf-8`, autorise l’exploration en production, bloque l’indexation en développement/staging et référence le sitemap absolu,
   **And** aucune copie concurrente n’est ajoutée dans `public/robots.txt` ou `public/sitemap.xml`.

5. **Given** le schéma actuel de `@nuxt/content` et la page article `app/pages/blog/[...slug].vue`,
   **When** les métadonnées SEO article sont vérifiées après la migration,
   **Then** les champs existants (`title`, `description`, `date`, `tags`, `read`, `image`) restent consommés automatiquement,
   **And** le frontmatter peut expressément distinguer date de publication et date de mise à jour sans casser les articles existants,
   **And** les métadonnées `usePageSeo()` et le JSON-LD `BlogPosting` restent la source de vérité pour les pages HTML, sans double balisage concurrent,
   **And** le lien entre chaque entrée du sitemap et la page HTML générée est vérifié pour les routes articles.

6. **Given** le workflow CI `.github/workflows/cd.yml` et la gate Docker,
   **When** la validation complète est exécutée,
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit sans erreur,
   **And** les assertions CI vérifient l’existence de `sitemap.xml`, `robots.txt`, `contact/card/index.html`, la racine XML, l’origine des URLs, l’absence de duplication et le `CNAME`,
   **And** les fichiers générés par le module ne sont pas écrasés par une copie CI de `public/_headers`,
   **And** aucune régression de consent, DNT, Session Replay, tracking, canonical, JSON-LD ou déploiement GitHub Pages n’est introduite.

## Tasks / Subtasks

- [x] **Tâche 1 — Préflight et décision de migration atomique** (AC: 1, 2)
  - [x] Vérifier dans Docker la compatibilité Nuxt 4.4.8 / `@nuxt/content` 3.14.0 avec les versions résolues de `@nuxtjs/sitemap` et `@nuxtjs/robots`.
  - [x] Capturer dans le Dev Agent Record les versions exactes installées, le lockfile mis à jour et la commande Docker reproductible.
  - [x] Vérifier avant modification qu’un seul composant possèdera `/sitemap.xml` et `/robots.txt` après la migration.
  - [x] Ne pas installer `@nuxtjs/seo` meta-bundle ni `nuxt-ai-ready` dans cette story ; ces éléments restent hors périmètre.

- [x] **Tâche 2 — Configuration canonique du site et environnement** (AC: 2, 6)
  - [x] Configurer `nuxt-site-config` avec `site.url`, `site.name` et `site.env` via `NUXT_SITE_URL`, `NUXT_SITE_NAME` et `NUXT_SITE_ENV`.
  - [x] Adapter `app/composables/useSiteUrl.ts` pour lire `useSiteConfig().url` tout en conservant sa signature et sa validation fail-fast ; supprimer la source runtime concurrente.
  - [x] Tester URL vide, URL relative, URL avec path, query/hash et URL valide ; vérifier que le build échoue clairement sur une configuration invalide.
  - [x] Définir explicitement l’indexation production versus staging/local sans ajouter de token GSC ni de secret.
  - [x] Mettre à jour `.env.example`, le build Docker et `.github/workflows/cd.yml` avec la même origine et le même environnement.

- [x] **Tâche 3 — Migration du sitemap vers l’intégration Content Nuxt SEO** (AC: 3, 4, 5)
  - [x] Supprimer `server/routes/sitemap.xml.ts` seulement après validation de la sortie officielle du module.
  - [x] Activer `sitemap.zeroRuntime: true`, compatible avec un contenu modifiable uniquement par build, et confirmer la prérenderisation de `/sitemap.xml` sans route Vue.
  - [x] Étendre `content.config.ts` avec `defineSitemapSchema()` et `defineRobotsSchema()` pour filtrer les articles publiés, noindex et exclus.
  - [x] Vérifier l’ordre des modules : Sitemap et Robots doivent être chargés avant `@nuxt/content` pour l’intégration Content v3.
  - [x] N’ajouter `server/api/__sitemap__/urls` que si l’intégration Content installée ne fournit pas les slugs dynamiques ; ne pas créer de seconde source concurrente.
  - [x] Prerendre explicitement les slugs Content publiés afin que chaque URL du sitemap possède un HTML statique.
  - [x] Valider l’unicité des URLs, l’origine absolue, le XML sitemap 0.9, les exclusions et les `<lastmod>` réels.

- [x] **Tâche 4 — Migration de robots et suppression des routes manuelles** (AC: 4, 6)
  - [x] Supprimer `server/routes/robots.txt.ts` après validation du module.
  - [x] Configurer les groupes de robots pour production, développement et staging ; conserver la ligne `Sitemap:` absolue.
  - [x] Vérifier le type MIME et le contenu réel dans le serveur de développement puis dans `.output/public`.
  - [x] Vérifier qu’aucun `public/robots.txt` concurrent n’est créé et qu’aucune route n’est dupliquée dans le manifeste Nitro.

- [x] **Tâche 5 — Métadonnées article et durcies** (AC: 3, 5)
  - [x] Ajouter à `content.config.ts` un champ `updated` optionnel au format `YYYY-MM-DD`, avec `date` conservé comme date de publication obligatoire et rétrocompatible.
  - [x] Faire consommer `updated` par la source sitemap et le JSON-LD `BlogPosting` pour distinguer `datePublished` et `dateModified`, sans dupliquer `usePageSeo()`.
  - [x] Tester un article temporaire avec `date` et `updated`, puis le supprimer après validation ; ne pas committer de faux article de production.
  - [x] Vérifier les images SEO, les tags, les titres, les descriptions, les anchors et le HTML généré de chaque route article.

- [x] **Tâche 6 — CI, documentation et gate de non-régression** (AC: 6)
  - [x] Étendre `Verify static output` pour contrôler les artefacts SEO, les routes attendues, l’origine, le XML, l’unicité et le `CNAME`.
  - [x] Empêcher la copie CI d’écraser les en-têtes générés par le module ; valider le comportement `_headers` sur les fichiers `.md`/SEO si présents.
  - [x] Mettre à jour `seo-verification.md` et le SPEC avec la nouvelle propriété des routes et la suppression du manifeste manuel.
  - [x] Exécuter la gate Docker complète, puis consigner les commandes, sorties, avertissements et vérifications HTTP.

## Dev Notes

### Prérequis et séquencement

- 14.4 doit être code-reviewée et intégrée avant 14.5 ; son implémentation manuelle sert de référence réversible.
- 14.5 doit être terminée et revue avant 14.6, car AI Ready dépend des modules sitemap/robots et entre en collision avec les routes manuelles.

### Décision critique — migration atomique, pas coexistence

La story 14.4 fournit une implémentation fonctionnelle de référence. La migration ne doit pas créer temporairement deux propriétaires de `/sitemap.xml` ou `/robots.txt` : cela peut produire une sortie non déterministe, des warnings de routes ou un sitemap vide.

La migration doit être réversible par commit. Si les modules officiels ne permettent pas de conserver le contrat SSG, les URLs absolues, les articles Content et le `CNAME`, le développeur doit arrêter la migration et documenter le blocage plutôt que supprimer l’implémentation de la story 14.4.

### Stack et installation

- Versions observées lors de la recherche (à revérifier dans le lockfile au moment du dev) : `@nuxtjs/sitemap` 8.5.1, `@nuxtjs/robots` 6.2.3, `nuxt-site-config` 4.2.3.
- Nuxt actuel : `4.4.8`, Node 22 via Docker.
- Ne pas exécuter `pnpm` sur l’hôte.
- Ajouter les modules via `docker compose run --rm web ...`; ne pas utiliser `npx` sur l’hôte.
- `@nuxtjs/sitemap` et `@nuxtjs/robots` sont les seules dépendances SEO de cette story ; `nuxt-site-config` est normalement transitif.
- Le bundle `@nuxtjs/seo` est volontairement exclu : il est plus large et chevauche `usePageSeo()`.
- `nuxt-ai-ready` appartient exclusivement à la story 14.6.

### Source de vérité URL et SEO

- Migrer la source canonique vers Nuxt Site Config : `NUXT_SITE_URL`, `NUXT_SITE_NAME`, `NUXT_SITE_ENV`.
- `useSiteUrl()` doit conserver sa signature et devenir un adaptateur mince vers `useSiteConfig().url`, avec les mêmes erreurs fail-fast.
- Ne pas conserver `runtimeConfig.public.siteUrl`, `sitemap.siteUrl` ou `robots.siteUrl` comme sources concurrentes.
- Ne pas ajouter `https://jouan.ovh` dans un second fichier de configuration.
- Préserver `usePageSeo()` et le JSON-LD `Organization` global de `app/app.vue`.
- Le nombre de routes Nitro n’est pas une métrique stable : valider les artefacts et les URLs attendues.

### Intégration `@nuxt/content`

La collection blog est une collection `page` typée dans `content.config.ts`. Le site utilise actuellement un composant `[...slug].vue` et non le mode Document Driven. Utiliser les imports officiels `@nuxtjs/sitemap/content` (`defineSitemapSchema`) et `@nuxtjs/robots/content` (`defineRobotsSchema`) avec un filtre pour les articles non publiés/noindex. Charger Sitemap et Robots avant `@nuxt/content`.

Un endpoint `server/api/__sitemap__/urls` n’est acceptable que si l’intégration Content installée ne fournit pas les slugs dynamiques ; il doit être une source interne, jamais un second propriétaire de `/sitemap.xml`. Le blog est actuellement vide : utiliser une fixture temporaire puis la supprimer. Toute évolution de `@nuxt/content` doit être revalidée par la gate Docker et redémarrage du serveur dev si la base SQLite est périmée.

### Déploiement et CI

- GitHub Pages sert uniquement `.output/public` : les routes modules doivent être statiques.
- `public/CNAME` et `public/_headers` ne doivent pas être supprimés.
- La copie CI de `_headers` doit être examinée : elle peut écraser des ajouts générés par le module.
- La story 14.4 n’est pas encore déployée en production ; aucune story locale ne doit déclarer GSC validé avant déploiement et vérification DNS.

### Testing standards

- Aucun framework de test n’est installé ; ne pas ajouter Vitest/Playwright uniquement pour cette story.
- Valider par `pnpm lint`, `pnpm typecheck`, `pnpm generate`, assertions shell, `xmllint` lorsque disponible et requêtes HTTP.
- Tester au minimum : origine canonique, `NUXT_SITE_ENV=staging`/`noindex`, huit pages de base, article Content temporaire, absence de doublons, HTML statique correspondant, XML 0.9, MIME robots, `_headers`, `CNAME`.

### Previous Story Intelligence — 14.4

- Story 14.4 : `ready-for-dev` → `review`, gate verte localement, artefacts non encore visibles en production.
- Les deux handlers manuels à remplacer sont précisément `server/routes/sitemap.xml.ts` et `server/routes/robots.txt.ts`.
- La documentation `seo-verification.md` décrit la procédure DNS TXT et les artefacts ; elle doit évoluer vers la propriété des modules sans effacer la procédure GSC.
- L’écart historique 28/30 routes est un défaut de formulation : les prochaines validations doivent vérifier des fichiers et URLs, pas un total Nitro.

### Structure des fichiers

- Configuration : `nuxt.config.ts`.
- Dépendances : `package.json`, `pnpm-lock.yaml`.
- Source URL/SEO existante : `app/composables/useSiteUrl.ts` (adaptateur Site Config requis), `app/composables/usePageSeo.ts` (préservé).
- Collection : `content.config.ts`, `app/pages/blog/[...slug].vue`.
- Routes actuelles à supprimer après migration : `server/routes/sitemap.xml.ts`, `server/routes/robots.txt.ts`.
- CI : `.github/workflows/cd.yml`.
- Documentation : `docs/specs/spec-analytics-search-console/SPEC.md`, `docs/specs/spec-analytics-search-console/seo-verification.md`, `epics.md`, `sprint-status.yaml`.

### Project Structure Notes

- Ne pas créer de page Vue `sitemap.vue` ou `robots.vue`.
- Ne pas conserver un fichier `public/robots.txt` en parallèle du module.
- Ne pas faire dépendre le build d’un service réseau externe.
- Ne pas modifier les composants UI, les styles, le consent, PostHog ou le terminal.
- Ne pas traiter la validation GSC DNS ou la production PostHog comme une preuve de build local.

### References

- [Source: `app/composables/useSiteUrl.ts` — source d’URL et validation fail-fast]
- [Source: `app/composables/usePageSeo.ts` — métadonnées et JSON-LD existants]
- [Source: `content.config.ts` — schéma de la collection blog]
- [Source: `app/pages/blog/[...slug].vue` — SEO article et requête Content]
- [Source: `server/routes/sitemap.xml.ts` — implémentation manquée à remplacer]
- [Source: `server/routes/robots.txt.ts` — implémentation manquée à remplacer]
- [Source: `docs/specs/spec-analytics-search-console/SPEC.md#CAP-6, CAP-8]
- [Source: `docs/specs/spec-analytics-search-console/seo-verification.md`]
- [Source: `.github/workflows/cd.yml#Verify static output`]
- [Source: `docs/implementation-artifacts/14-4-referencement-google-search-console-sitemap-xml-et-robots-txt.md`]
- [Source: Nuxt SEO Sitemap — https://nuxtseo.com/docs/sitemap/getting-started/introduction]
- [Source: Nuxt Robots — https://nuxtseo.com/docs/robots/getting-started/introduction]
- [Source: Nuxt SEO Site Config — https://nuxtseo.com/docs/nuxt-seo/getting-started/installation]

## Dev Agent Record

### Agent Model Used

OpenCode Space Bunny Free (`space-bunny-free`) — 2026-09-24

### Debug Log References

- Préflight Docker : `docker compose run --rm web sh -c "corepack enable && pnpm add -D @nuxtjs/sitemap@8.5.1 @nuxtjs/robots@6.2.3"`.
- Versions verrouillées : Nuxt `4.4.8`, `@nuxt/content` `3.14.0`, `@nuxtjs/sitemap` `8.5.1`, `@nuxtjs/robots` `6.2.3`, `nuxt-site-config` `4.2.3` (transitive).
- `pnpm list ... --depth 3` et `pnpm exec nuxi prepare` réussis. `pnpm peers check` signale un écart `unctx@3.0.1` → `oxc-parser@0.133.0` sans bloquer `nuxi prepare`; aucune surcharge hors périmètre ajoutée, la gate complète décidera de la compatibilité effective.
- Inventaire pré-migration : `server/routes/sitemap.xml.ts` et `server/routes/robots.txt.ts` sont les seuls propriétaires présents ; aucun `public/sitemap.xml` ou `public/robots.txt`. Après ajout des modules, ces handlers seront supprimés dans la même migration avant validation des artefacts.
- Recherche de dépendances : `@nuxtjs/seo` et `nuxt-ai-ready` absents de `package.json` et `pnpm-lock.yaml`.
- Gate Docker finale : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` → succès, 0 erreur ESLint/Stylelint/TypeScript, sitemap et robots générés.
- Reproductibilité : `docker compose run --rm web sh -c "corepack enable && pnpm install --frozen-lockfile"` → succès ; `pnpm exec prettier --check .github/workflows/cd.yml` → succès.
- Assertions production : `docker compose run --rm -e NUXT_SITE_ENV=production web sh -c "corepack enable && pnpm generate"` puis assertions Python CI → 8 URLs de base attendues, origine `https://jouan.ovh`, unicité, HTML statique, `_headers` et `CNAME` validés.
- Environnement staging : build `NUXT_SITE_ENV=staging` → `robots.txt` avec `Disallow: /` et sans `Sitemap:`.
- HTTP dev : `/robots.txt` → 200, `content-type: text/plain; charset=utf-8`, `Disallow: /` ; `/sitemap.xml` → 200, XML et en-tête `X-Robots-Tag: noindex, nofollow` en développement.
- Avertissements consignés : `.gitkeep` ignoré par Content, payload extraction recommandé, sourcemap du polyfill module-preload et peer check `unctx`/`oxc-parser`; aucun n’a bloqué la gate.
- Durcissement noindex : `noindex`, `robots: false`, `robots: "false"`, `robots: none` et `robots: "noindex"` sont normalisés par la source partagée ; les fixtures temporaires confirment les meta robots et l'absence du XML.
- Code review 14.5 : 10 patchs appliqués puis validés par une gate Docker complète, un build production avec 8 fixtures CI (publié, noindex, robots false/none, sitemap false/null, draft, futur), les assertions Python exactes de `.github/workflows/cd.yml` et un serveur Dev contrôlé sur `/robots.txt`.
- Cache Content : deux builds consécutifs sans suppression de `.data/content` produisent les mêmes routes ; `.data/content/seo-routes.json` évite quealone indéterminisme sans devenir un manifeste versionné.

### Completion Notes List

- Contexte de création de story généré : migration SEO Nuxt officialisée, sans installation de modules ni modification de code applicatif.
- Tâche 1 : préflight terminé dans Docker, versions reproductibles ajoutées au manifeste et au lockfile, et ownership des deux routes SEO vérifié avant suppression atomique.
- Tâche 2 : `NUXT_SITE_URL` est validée avant normalisation Site Config ; les cinq configurations invalides testées échouent avec `[site-url]`, tandis qu’une origin valide avec slash final se normalise sans double slash. Docker transmet les variables required et la CI les définit au niveau du job.
- Tâche 3 : bascule atomique effectuée sans route Vue concurrence. Le build production génère 8 pages de base + 1 article fixture indexable, une seule fois chaque URL, avec origine absolue, XML valide, `<lastmod>` de contenu uniquement, sans `priority`/`changefreq`. Les fixtures noindex, robots false/none, sitemap false/null, draft et future sont absentes du sitemap. Le hook Content et son cache local ignoré ajoutent les HTML noindex sans les réintroduire dans le sitemap fusionné.
- Tâche 4 : `robots.txt` est servi par `@nuxtjs/robots` avec `text/plain; charset=utf-8`. Le serveur de développement et un build `NUXT_SITE_ENV=staging` renvoient `Disallow: /` sans sitemap ; le build production précédent contient `Allow: /` et `Sitemap: https://jouan.ovh/sitemap.xml`. Aucun handler manual, fichier public concurrent ou route dupliquée ne subsiste.
- Tâche 5 : `date` et `updated` sont validés comme dates calendaires réelles, avec `updated >= date` et Europe/Paris comme frontière de publication. Les fixtures noindex produisent un meta `noindex, nofollow` via `usePageSeo()`. La fixture manuelle `date: 2026-09-20` / `updated: 2026-09-21` et la fixture CI `date: 2026-01-10` / `updated: 2026-02-11` ont validé `<lastmod>`, `datePublished` et `dateModified` distincts, image SEO, tags, titre, description et ancre.
- Tâche 6 : la CI crée puis supprime des fixtures temporaires et vérifie présence/absence HTML, couverture de chaque article source, `<lastmod>`, absence de priority/changefreq, URL canonique sans query/fragment, unicité et MIME HTTP exact via le serveur Dev. `_headers`/`CNAME` restent copiés uniquement depuis `public/` par le build, sans dépendre du nombre total de routes Nitro.
- Durcissement final : `robots: "noindex"` est traité comme une exclusion au même titre que `noindex: true` et `robots: false`; la fixture de contrôle a été supprimée après vérification.

### File List

- `package.json`
- `pnpm-lock.yaml`
- `nuxt.config.ts`
- `content.config.ts`
- `app/composables/useSiteUrl.ts`
- `app/composables/usePageSeo.ts`
- `app/utils/site-url.ts`
- `app/utils/blog-indexability.ts`
- `app/utils/seo.ts`
- `app/app.vue`
- `app/pages/blog/index.vue`
- `app/pages/blog/[...slug].vue`
- `app/pages/index.vue`
- `docker-compose.yml`
- `.env.example`
- `.github/workflows/cd.yml`
- `AGENTS.md`
- `docs/project-context.md`
- `docs/specs/spec-analytics-search-console/SPEC.md`
- `docs/specs/spec-analytics-search-console/seo-verification.md`
- `docs/implementation-artifacts/sprint-status.yaml`
- `server/routes/sitemap.xml.ts` (supprimé)
- `server/routes/robots.txt.ts` (supprimé)
- `server/plugins/seo-content.ts`
- `docs/implementation-artifacts/deferred-work.md`

### Review Findings

- [x] [Review][Patch] Utiliser Europe/Paris pour la frontière de publication des dates `YYYY-MM-DD` [app/utils/blog-indexability.ts:21]
- [x] [Review][Patch] Séparer la publication de l'indexabilité des articles [app/pages/blog/[...slug].vue:92]
- [x] [Review][Patch] Accepter `sitemap: false` et `sitemap: null` dans le schéma Content [content.config.ts:40]
- [x] [Review][Patch] Réutiliser une source unique pour le filtre d'indexabilité Content [content.config.ts:43]
- [x] [Review][Patch] Traiter la directive robots `none` comme `noindex` [app/utils/blog-indexability.ts:22]
- [x] [Review][Patch] Valider calendairement `updated` et sa cohérence avec `date` [content.config.ts:21]
- [x] [Review][Patch] Étendre la CI aux articles, exclusions et métadonnées SEO [`.github/workflows/cd.yml`:91]
- [x] [Review][Patch] Refuser les URL de sitemap avec query, fragment ou origine non canonique [`.github/workflows/cd.yml`:114]
- [x] [Review][Patch] Vérifier le type MIME HTTP exact de `robots.txt` [`.github/workflows/cd.yml`:89]
- [x] [Review][Patch] Aligner la documentation sur la propriété Site Config et les artefacts AEO futurs [`AGENTS.md`:84]
- [x] [Review][Defer] Restaurer les ancres contextuelles des trois CTA Services [app/pages/index.vue:447] — deferred, pre-existing
- [x] [Review][Defer] Corriger l'événement `direct_email_copied` émis sur simple ouverture de `mailto:` [app/pages/blog/[...slug].vue:63] — deferred, pre-existing
- [x] [Review][Defer] Émettre `blog_article_finished` pour un article ne nécessitant aucun défilement [app/pages/blog/[...slug].vue:117] — deferred, pre-existing
- [x] [Review][Defer] Annuler les timers de survol déjà planifiés lors du passage en reduced motion [app/pages/index.vue:370] — deferred, pre-existing
- [x] [Review][Defer] Détecter les sélections de code traversant plusieurs blocs `pre` [app/pages/blog/[...slug].vue:147] — deferred, pre-existing

## Change Log

- 2026-09-24 : story créée pour la migration SEO Nuxt automatisée après la review de 14.4 ; statut → ready-for-dev.
- 2026-09-24 : migration atomique Nuxt SEO terminée (Sitemap/Robots/Site Config/Content v3), gate Docker et assertions CI exécutées ; story prête pour revue.
- 2026-09-24 : code review adversarial terminée, 10 patchs appliqués et 5 éléments préexistants différés ; gate finale verte.

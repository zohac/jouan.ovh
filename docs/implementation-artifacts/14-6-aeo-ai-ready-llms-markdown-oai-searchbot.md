---
baseline_commit: d8193c77d218c364b9ea4d65b8bddb8ac3900f8b
---

# Story 14.6: AEO & AI Ready — `llms.txt`, Markdown, OAI-SearchBot et découvrabilité ChatGPT

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Simon Jouan,
I want que les contenus publics du site soient exposés dans des formats lisibles par les agents IA, avec une politique de crawl explicite et une mesure du trafic referral,
so que le contenu puisse être découvert et cité plus facilement par les agents compatibles, sans confondre lisibilité machine et garantie de classement ChatGPT.

## Acceptance Criteria

1. **Given** la story 14.5 terminée (sitemap, robots et modules Nuxt SEO) ainsi que le déploiement statique GitHub Pages,
   **When** la couche AEO est installée via Docker,
   **Then** `nuxt-ai-ready` est ajouté avec une version exacte revue dans `package.json`/`pnpm-lock.yaml` et sa compatibilité avec le lockfile Nuxt/Content est démontrée par la gate complète,
   **And** le module ne crée pas de second propriétaire de `/sitemap.xml` ou `/robots.txt`,
   **And** `nuxt-llms` n’est pas installé simultanément sans arbitrage explicite pour éviter deux implémentations de `llms.txt`,
   **And** aucune dépendance ou commande n’est installée sur l’hôte.

2. **Given** le site statique GitHub Pages et les routes prérendues,
   **When** `pnpm generate` est exécuté avec la configuration AI Ready validée,
   **Then** le build produit les artefacts publics `llms.txt`, `llms-full.txt` et les jumeaux `.md` des pages éligibles,
   **And** `contentNegotiation` est désactivé pour que les URL HTML restent déterministes sur un hébergeur statique ; les URL `.md` explicites et les liens HTML alternatifs restent disponibles,
   **And** `database: false`, `runtimeSync: false` et `cron: false` sont utilisés pour éviter toute dépendance à un serveur MCP ou à une base persistante en production statique,
   **And** chaque route présente dans le sitemap et prérendue dispose d’une représentation Markdown correspondante, sans page d’erreur, fallback ou endpoint interne dans les exports publics.

3. **Given** la collection `@nuxt/content` et le blog `app/pages/blog/[...slug].vue`,
   **When** AI Ready lit le contenu,
   **Then** `contentSource: true` est utilisé pour préserver les articles Markdown, titres, descriptions, dates, tags, images et blocs de code,
   **And** les pages Vue non-Content sont converties depuis le HTML rendu avec `mdreamOptions.minimal: true` et un nettoyage contrôlé,
   **And** `llmsTxt.markdownLinks: true`, `sitemapMd: true` et `describedby: true` sont explicités dans `nuxt.config.ts`,
   **And** `llms.txt` contient une présentation française, les pages publiques principales et les articles publiés, avec des liens Markdown valides et sans doublons,
   **And** `llms-full.txt` reste dans un budget de taille défini par le projet et ne contient ni formulaires renseignés, ni cookies, ni analytics, ni données privées.

4. **Given** la politique de découvrabilité IA et la politique de vie privée,
   **When** `robots.txt` est généré,
   **Then** `OAI-SearchBot` est explicitement autorisé pour la recherche ChatGPT,
   **And** `GPTBot` est explicitement interdit pour l’entraînement des modèles selon la politique respectueuse de la vie privée retenue,
   **And** cette décision est indépendante des directives `Content-Signal`/`Content-Usage`, qui restent des préférences volontaires et non un contrôle d’accès,
   **And** `blockAiBots: true` n’est pas utilisé car il bloquerait également `OAI-SearchBot`,
   **And** la page `/confidentialite` et `compliance-gdpr.md` expliquent cette politique sans promettre de citation ou de classement.

5. **Given** le déploiement GitHub Pages et la génération des artefacts AI,
   **When** le workflow CI copie les fichiers publics,
   **Then** la copie de `public/_headers` n’écrase plus les en-têtes ou types MIME générés par AI Ready pour les `.md` et le sitemap,
   **And** les routes internes `__ai-ready` sont exclues, supprimées ou explicitement acceptées après revue de leur caractère public et de leur impact sur la taille du dépôt,
   **And** `CNAME`, `public/_headers`, les headers de sécurité et la chaîne de déploiement restent intacts,
   **And** le build ne dépend d’aucun endpoint MCP, WebMCP, WebSocket ou service externe.

6. **Given** le consentement PostHog accordé et la mesure du trafic,
   **When** une session provient de ChatGPT Search,
   **Then** le paramètre `utm_source=chatgpt.com` est conservé par la whitelist existante de `useAnalytics()` et visible dans `$pageview.query_params` sans donnée personnelle,
   **And** aucune donnée de formulaire, aucun nom, email, message ou token n’est envoyé dans `llms.txt`, `llms-full.txt`, les `.md` ou les événements IA,
   **And** une mesure avant/après est définie sur au moins quatre semaines, avec un panel de prompts français, les visites referral, les conversions et la couverture GSC comme métriques de contrôle,
   **And** aucune publication ou documentation ne prétend qu’un fichier `llms.txt` garantit un meilleur classement, une citation ChatGPT ou une visibilité dans les réponses.

7. **Given** la stack complète et la politique IA,
   **When** la validation finale est exécutée,
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit sans erreur,
   **And** les assertions vérifient `llms.txt`, `llms-full.txt`, les `.md` attendues, les liens HTML alternatifs, les MIME, l’absence de doublons et la taille des exports,
   **And** une fixture article temporaire prouve la couverture dynamique puis est retirée ; aucun faux article public n’est laissé dans `content/blog/`,
   **And** la vérification HTTP locale est répétée après `docker compose restart web` si la base SQLite Content a été invalidée par un build séparé,
   **And** la story ne peut être déclarée `done` avant le déploiement et la vérification post-déploiement documentés dans le Dev Agent Record.

## Tasks / Subtasks

- [x] **Tâche 1 — Préflight de la version et de la compatibilité** (AC: 1, 5)
  - [x] Vérifier dans Docker la version stable reviewée de `nuxt-ai-ready` et ses `moduleDependencies` (`@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-site-config`).
  - [x] Vérifier la compatibilité avec Nuxt `4.4.8`, `@nuxt/content` `3.14.0`, `better-sqlite3` `12.11.1` et Node 22 ; ajuster `engines.node` si le minimum SQLite n’est pas déclaré.
  - [x] Vérifier le changelog et la stabilité avant de pinner la version ; si le module n’est pas compatible, documenter le blocage et ne pas installer une version non revue.
  - [x] Confirmer qu’aucune configuration `nuxt-llms` concurrente n’est active.

- [x] **Tâche 2 — Configuration statique AI Ready** (AC: 2, 3, 5)
  - [x] Ajouter `nuxt-ai-ready` à `devDependencies` via Docker et verrouiller la version exacte.
  - [x] Configurer `aiReady.contentSource: true`, `contentNegotiation: false`, `database: false`, `runtimeSync: false` et `cron: false`.
  - [x] Configurer `llmsTxt.markdownLinks: true`, `sitemapMd: true`, `describedby: true`, `mdreamOptions.minimal: true` et les exclusions d’artefacts internes.
  - [x] Vérifier que `site.url`, `site.name` et `site.env` proviennent de la configuration Site Config migrée en 14.5.
  - [x] Ne pas activer MCP/WebMCP, runtime sync, cron, base distante ou contenu privé pour ce déploiement GitHub Pages.

- [x] **Tâche 3 — Export Markdown et qualité `llms.txt`** (AC: 2, 3, 7)
  - [x] Vérifier la présence de `llms.txt`, `llms-full.txt`, `/index.md`, les `.md` des pages publiques et les `.md` des articles prérendus.
  - [x] Vérifier la structure H1/H2, la description française, l’origine canonique, les liens Markdown et la couverture 100 % des routes attendues.
  - [x] Vérifier la préservation des fences de code et de la structure Markdown des articles Content.
  - [x] Vérifier que les exports ne contiennent pas navigation, footer, toast de consentement, terminal, formulaires, erreurs, DevTools ou analytics.
  - [x] Fixer et documenter les budgets de taille de `llms.txt` et `llms-full.txt` ; refuser une explosion de l’artefact public.

- [x] **Tâche 4 — Politique OpenAI et vie privée** (AC: 4, 6)
  - [x] Configurer les groupes robots `OAI-SearchBot: Allow /` et `GPTBot: Disallow /` ; conserver le groupe général et la ligne sitemap.
  - [x] Garder `OAI-SearchBot` indépendant de `GPTBot` ; ne pas utiliser `blockAiBots: true` comme raccourci.
  - [x] Documenter dans `app/pages/confidentialite.vue` et `docs/specs/spec-analytics-search-console/compliance-gdpr.md` la différence recherche ChatGPT versus entraînement.
  - [x] Vérifier que `Content-Signal`/`Content-Usage` ne sont pas présentés comme une sécurité ou un contrôle d’accès.
  - [x] Vérifier que les artefacts AI ne contiennent aucune donnée personnelle, contenu privé, valeur de formulaire ou secret.

- [x] **Tâche 5 — Intégration CI, `_headers` et artefacts publics** (AC: 5, 7)
  - [x] Auditer la copie `public/_headers` de `.github/workflows/cd.yml` et empêcher l’écrasement des types MIME/liens générés.
  - [x] Vérifier les routes `.md` sur le serveur de développement et dans `.output/public` avec les bons Content-Type.
  - [x] Examiner les routes `__ai-ready`, dumps et métadonnées ; les supprimer si possible ou les accepter explicitement dans la documentation de publication.
  - [x] Ajouter les assertions CI des artefacts AI sans supposer un nombre total de routes Nitro.

- [x] **Tâche 6 — Contenu blog et mesure** (AC: 3, 6, 7)
  - [x] Ajouter une fixture article temporaire avec title/description/date/tags/image/read pour valider `.md`, `llms.txt`, `llms-full.txt` et le sitemap ; la supprimer après preuve.
  - [x] Vérifier que `utm_source=chatgpt.com` est accepté par la whitelist PostHog existante après consentement, sans élargir la collecte.
  - [x] Définir le protocole de mesure quatre semaines avant/après, les conversions, les citations et les limites d’attribution.
  - [x] Vérifier les pages `/blog`, `/services`, `/about`, `/contact`, `/contact/card`, `/mentions-legales` et `/confidentialite` comme contenu public vs pages à limiter dans les exports IA.

- [x] **Tâche 7 — Gate finale et documentation** (AC: 1, 2, 4, 5, 6, 7)
  - [x] Exécuter la gate Docker complète après un nettoyage de la base Content si nécessaire.
  - [x] Vérifier le HTML, les liens `rel="alternate"`, les `.md`, `llms.txt`, `llms-full.txt`, robots, sitemap et `CNAME`.
  - [x] Mettre à jour `SPEC.md`, `seo-verification.md`, `compliance-gdpr.md`, `epics.md` et `sprint-status.yaml` avec les choix de version, la politique IA et les limites de la mesure.
  - [x] Consigner les résultats HTTP/desktop/mobile et le plan de mesure post-déploiement ; ne pas déclarer ChatGPT mieux classé sans preuve.

> La vérification HTTP de la production GitHub Pages a été effectuée le 2026-09-25 (voir Dev Agent Record). La clôture ne vaut pas déclaration de visibilité, citation ou amélioration de classement ChatGPT : aucune de ces garanties n'est promise.

### Review Findings

#### Patch

- [x] [Review][Patch] **Refuser un `sitemap.loc` personnalisé et imposer le chemin réel de l’entrée Content** [`content.config.ts:67-79`, `server/plugins/seo-content.ts:56-70`]
- [x] [Review][Patch] **Les routes `sitemap: false`/`null` peuvent encore être prérendues par le crawler** [`nuxt.config.ts:561-615`, `server/plugins/seo-content.ts:42-70`]
- [x] [Review][Patch] **`robots: false` est confondu avec une exclusion de sitemap et empêche le prerender noindex** [`nuxt.config.ts:550-558`, `docs/specs/spec-analytics-search-console/seo-verification.md:30-33`]
- [x] [Review][Patch] **Les liens `alternate`/`describedby` restent injectés sur les HTML noindex en mode non statique** [`nuxt.config.ts:592-609`, `server/middleware/aeo-content-visibility.ts:13-35`]
- [x] [Review][Patch] **La route Content n’est pas canonicalisée comme Nuxt Content et `content/blog/index.md` peut entrer en collision avec `/blog`** [`nuxt.config.ts:291-300`, `nuxt.config.ts:129-137`, `server/middleware/aeo-content-visibility.ts:13-25`]
- [x] [Review][Patch] **Le scanner de fallback YAML est trop naïf et peut mal classer les articles** [`nuxt.config.ts:272-288`, `nuxt.config.ts:311-343`]
- [x] [Review][Patch] **Un build réutilisant `.nuxt` peut conserver des pages AI Ready obsolètes** [`nuxt.config.ts:354-375`, `nuxt.config.ts:592-608`, `.data/ai-ready/build.db`]
- [x] [Review][Patch] **Le filtre sitemap ne retire pas les URLs futures/brouillons provenant d’une source externe** [`server/plugins/seo-content.ts:42-47`]
- [x] [Review][Patch] **Le sitemap utilise un événement global mutable et peut être corrompu par des requêtes concurrentes** [`server/plugins/seo-content.ts:24-72`]
- [x] [Review][Patch] **Le nettoyage AEO repose sur des correspondances de lignes/sections fragiles et peut conserver ou supprimer trop de contenu** [`nuxt.config.ts:93-103`, `nuxt.config.ts:219-262`]
- [x] [Review][Patch] **`updatedAt` peut rester obsolète ou contredire `updated`** [`content.config.ts:31-45`, `nuxt.config.ts:543-545`]
- [x] [Review][Patch] **La copie du frontmatter Markdown perd les structures YAML complexes** [`nuxt.config.ts:149-186`]
- [x] [Review][Patch] **Le parsing des directives robots ne reconnaît pas toutes les formes valides** [`app/utils/blog-indexability.ts:74-99`]
- [x] [Review][Patch] **Les marqueurs AEO hardcodent le domaine et le profil au lieu des sources partagées** [`nuxt.config.ts:68-83`, `nuxt.config.ts:424-456`]
- [x] [Review][Patch] **Les artefacts générés contiennent encore des libellés anglais** [`nuxt.config.ts:451-463`, `.output/public/llms.txt`, `.output/public/llms-full.txt`, `.output/public/sitemap.md`]

#### Patch — groupe 2

- [x] [Review][Patch] **Exécuter la validation CI dans un conteneur GitHub Actions `node:22-bookworm-slim` et séparer le job de déploiement** [`.github/workflows/cd.yml:27-53`]

- [x] [Review][Patch] **Les fixtures CI sont publiées dans l’artefact de déploiement** [`.github/workflows/cd.yml:55-180`, `.github/workflows/cd.yml:521-531`]
- [x] [Review][Patch] **Les Pull Requests exécutent le code PR avec un token `contents: write`** [`.github/workflows/cd.yml:3-13`, `.github/workflows/cd.yml:32-53`]
- [x] [Review][Patch] **Un rerun ancien peut déployer une régression sur `main`** [`.github/workflows/cd.yml:15-19`, `.github/workflows/cd.yml:525-531`]
- [x] [Review][Patch] **Les probes HTTP testent le serveur Nuxt dev au lieu de la sortie statique, sans timeouts bornés** [`.github/workflows/cd.yml:182-230`]
- [x] [Review][Patch] **Les assertions robots ne valident pas les directives par user-agent** [`.github/workflows/cd.yml:257-263`]
- [x] [Review][Patch] **Les assertions `_headers` et CNAME ne valident pas leur structure complète** [`.github/workflows/cd.yml:247-255`]
- [x] [Review][Patch] **Les clés publiques ne sont pas vérifiées dans l’artefact généré** [`.github/workflows/cd.yml:57-60`, `.github/workflows/cd.yml:236-240`, `.github/workflows/cd.yml:515-518`]
- [x] [Review][Patch] **Les assertions AEO attendent encore les libellés anglais et ne contrôlent pas la couverture des sources** [`.github/workflows/cd.yml:301-345`]
- [x] [Review][Patch] **Les routes article dupliquées sont acceptées silencieusement** [`.github/workflows/cd.yml:453-505`]
- [x] [Review][Patch] **Les statuts HTTP 404 des routes exclues ne sont pas testés** [`.github/workflows/cd.yml:182-230`, `.github/workflows/cd.yml:365-384`]
- [x] [Review][Patch] **Les routes internes `__nuxt-ai-ready` ne sont pas contrôlées** [`.github/workflows/cd.yml:245-255`]
- [x] [Review][Patch] **Le glob de nettoyage des fixtures peut supprimer du contenu légitime** [`.github/workflows/cd.yml:64`, `.github/workflows/cd.yml:521-523`]
- [x] [Review][Patch] **La validation Compose des variables bloque `docker compose down` sur un checkout sans `.env`** [`docker-compose.yml:21-25`]
- [x] [Review][Patch] **La branche de publication GitHub Pages n’est pas explicitée** [`.github/workflows/cd.yml:525-531`]
- [x] [Review][Patch] **Les exécutions PR et push partagent le même groupe de concurrence** [`.github/workflows/cd.yml:15-19`]

#### Defer — groupe 2

- [x] [Review][Defer] **Épingler les versions exactes des actions, de l’image Node et du runner** [`.github/workflows/cd.yml:27-45`, `docker-compose.yml:13`] — defer, durcissement supply-chain hors périmètre immédiat de la story 14.6.

#### Patch — groupe 3

- [x] [Review][Patch] **Séparer le consentement de la mesure d’audience et du Session Replay** [`app/components/ui/ConsentToast.vue:12-24`, `app/composables/useConsent.ts:1-126`, `app/plugins/posthog.client.ts:111-151`]
- [x] [Review][Patch] **Documenter séparément les durées réelles de rétention PostHog** [`app/pages/confidentialite.vue:156-195`, `docs/specs/spec-analytics-search-console/compliance-gdpr.md:63-70`]
- [x] [Review][Patch] **Supprimer le dump Content public de la sortie statique** [`nuxt.config.ts:592-608`, `docs/specs/spec-analytics-search-console/compliance-gdpr.md:74-85`]

- [x] [Review][Patch] **Corriger la course consentement/chargement PostHog et le cycle accepter–refuser–accepter** [`app/plugins/posthog.client.ts:41-164`, `app/composables/useAnalytics.ts:160-187`]
- [x] [Review][Patch] **Assainir les URL, chemins et propriétés avant capture PostHog** [`app/plugins/posthog.client.ts:51-83`, `app/composables/useAnalytics.ts:156-195`]
- [x] [Review][Patch] **Masquer l’historique du terminal et les corps de requêtes dans le Session Replay** [`app/plugins/posthog.client.ts:64-77`, `app/components/terminal/TerminalComponent.vue:154-187`]
- [x] [Review][Patch] **Aligner la politique de confidentialité sur les identifiants pseudonymes, le stockage local et la rétention réelle** [`app/pages/confidentialite.vue:156-195`, `docs/specs/spec-analytics-search-console/compliance-gdpr.md:31-70`]
- [x] [Review][Patch] **Interdire les messages d’erreur et URLs brutes dans le contrat de tracking** [`docs/specs/spec-analytics-search-console/tracking-plan.md:60-72`, `app/composables/useAnalytics.ts:288-313`]
- [x] [Review][Patch] **Durcir la sanitisation UTM contre téléphones, identifiants courts et paramètres non documentés** [`app/composables/useAnalytics.ts:47-115`, `docs/specs/spec-analytics-search-console/tracking-plan.md:120-133`]
- [x] [Review][Patch] **Réévaluer DNT/GPC avant capture et pendant la session** [`app/composables/useConsent.ts:31-41`, `app/composables/useAnalytics.ts:145-154`]
- [x] [Review][Patch] **Utiliser le même prédicat de configuration PostHog et vérifier l’hôte EU** [`app/composables/useConsent.ts:22-29`, `app/plugins/posthog.client.ts:30-39`]
- [x] [Review][Patch] **Rendre effectives ou retirer les propriétés globales promises par le tracking plan** [`docs/specs/spec-analytics-search-console/tracking-plan.md:107-116`, `app/composables/useAnalytics.ts:418-495`]
- [x] [Review][Patch] **Ne pas exclure le scroll analytics des utilisateurs en prefers-reduced-motion** [`app/composables/useAnalytics.ts:432-458`]
- [x] [Review][Patch] **Définir précisément la fenêtre d’attribution et le modèle de conversion referral** [`docs/specs/spec-analytics-search-console/tracking-plan.md:124-133`]
- [x] [Review][Patch] **Réarmer le chargement PostHog après un échec transitoire** [`app/plugins/posthog.client.ts:44-108`]
- [x] [Review][Patch] **Faire échouer la persistance du consentement vers un état fail-closed après révocation** [`app/composables/useConsent.ts:43-51`, `app/composables/useConsent.ts:66-71`]

#### Defer — groupe 3

- [x] [Review][Defer] **Synchroniser le consentement entre onglets et versionner la politique de consentement** [`app/composables/useConsent.ts:43-114`] — defer, dette déjà identifiée dans la story 14.1 et hors correctif AEO 14.6.

## Dev Notes

### Prérequis et séquencement

- 14.5 doit être terminée, revue et ses modules SEO doivent être les propriétaires uniques de `/sitemap.xml` et `/robots.txt`.
- La story ne commence pas avant cette étape afin d'éviter toute collision de routes.

### Décision critique — AEO vérifiable, pas promesse de ranking

`llms.txt` est une convention communautaire de lisibilité machine. OpenAI ne documente pas `llms.txt` comme facteur de classement ChatGPT et ne garantit pas la citation d’une URL. La story doit donc mesurer la découvrabilité et l’utilisabilité par les agents, pas promettre une meilleure position.

La politique respectueuse de la vie privée retenue par défaut est :

- `OAI-SearchBot` autorisé pour la recherche ChatGPT ;
- `GPTBot` interdit pour l’entraînement des modèles ;
- `ChatGPT-User` reste un robot initiaté par l’utilisateur et n’est pas traité comme un contrôle d’accès.

Cette décision est la cible validée de la story. Elle ne doit pas être déduite d’un simple `Allow /` et doit être consignée dans le Dev Agent Record avant la gate.

### Version et risque de la dépendance

La recherche du 2026-09-24 a observé `nuxt-ai-ready@2.4.0`, un module stable mais encore jeune, avec des dépendances natives/RC et une compatibilité large déclarée. La version exacte revue doit être verrouillée ; ne pas suivre `latest` et ne pas mélanger cette installation avec une mise à jour non reviewée de Nuxt ou Content.

Le projet actuel utilise Nuxt 4.4.8, Content 3.14.0, Node 22 et better-sqlite3 12.11.1. AI Ready nécessite Node 22.13+ pour le SQLite intégré ; vérifier la version réellement utilisée par Docker et la CI avant l’implémentation.

### Posture statique GitHub Pages

Le site est déployé comme `.output/public` sur GitHub Pages. Les sorties statiques utiles d’AI Ready sont :

- `/llms.txt` ;
- `/llms-full.txt` ;
- les jumeaux `.md` explicites des routes prérendues ;
- les liens HTML `alternate`/`describedby` ;
- au besoin `/sitemap.md` et les métadonnées internes de build.

`database: false`, `runtimeSync: false`, `cron: false` et `contentNegotiation: false` sont nécessaires pour rendre ce déploiement déterministe. MCP, WebMCP, la synchronisation runtime, la négociation de contenu à la requête et la conversion Markdown runtime ne peuvent pas être des exigences de production sur GitHub Pages.

`contentSource: true` doit préserver le Markdown de Nuxt Content. Les pages Vue sont converties depuis le HTML rendu avec `mdreamOptions.minimal: true` ; cette conversion est nécessairement imparfaite et doit être relue.

### Propriété des routes et CI

`nuxt-ai-ready` dépend des modules SEO et peut donc entrer en collision avec les handlers manuels de la story 14.4. La story 14.5 doit être terminée avant cette installation, avec un propriétaire unique pour `/sitemap.xml` et `/robots.txt`.

L’étape CI copie actuellement `public/_headers` vers `.output/public/_headers`. Cette copie n’est plus neutre pour AI Ready, car le module peut ajouter des types MIME Markdown et des métadonnées de liens. L’implémentation doit supprimer ou remplacer cette copie et ajouter une validation.

Ne pas activer de serveur MCP runtime pour un site statique GitHub Pages. Ne pas activer `nuxt-llms` en parallèle sauf si son intégration Content est explicitement désactivée et si la propriété des routes est documentée.

### Frontières de contenu et de vie privée

Seul le contenu public déjà prérendu peut entrer dans `llms.txt`, `llms-full.txt`, les `.md` et les dumps de métadonnées publics. Exclure les brouillons, pages noindex, contenus privés, API, erreurs, previews, administration et données de soumission de formulaire. Les sorties AI sont des copies publiques : elles ne rendent pas privées des données qui ne le sont pas.

`llms-full.txt` est une convention du module, pas une partie de la proposition `llms.txt`. Il peut devenir volumineux. Définir et documenter un budget de taille (plafond initial recommandé : 1 MiB ou un équivalent approuvé) et inspecter tous les dumps internes publics.

Une fixture article temporaire est nécessaire pour exercer les routes Content dynamiques, car `content/blog/` est actuellement vide. Supprimer la fixture après validation ; ne pas committer de contenu de production fictif.

### Politique des crawlers OpenAI

OpenAI documente des contrôles indépendants :

- `OAI-SearchBot` pour la découverte et les citations dans ChatGPT Search ;
- `GPTBot` pour l’utilisation potentielle à l’entraînement des modèles ;
- `ChatGPT-User` pour les visites de pages initiées par un utilisateur.

Autoriser OAI Search tout en bloquant GPTBot est une politique prise en charge. `Content-Signal` et `Content-Usage` sont des métadonnées volontaires et ne remplacent pas les règles nommées par user-agent. Ne pas utiliser `blockAiBots: true`, car la liste de bots IA du module peut inclure `OAI-SearchBot` et bloquerait la recherche souhaitée.

Un changement de `robots.txt` peut prendre environ 24 heures pour être pris en compte par OpenAI Search. La CI ne doit pas vérifier une visibilité ChatGPT immédiate.

### Mesure

La whitelist existante de `useAnalytics()` contient déjà `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` et `utm_content`. Après consentement, une visite referral ChatGPT utilisant `utm_source=chatgpt.com` peut être observée dans `$pageview.query_params` ; ne pas ajouter de nouvelle dimension contenant des données personnelles.

Utiliser une période de référence d’au moins quatre semaines et une fenêtre de mesure après déploiement. Suivre les sessions referral, les conversions qualifiées, les requêtes de pages cibles lorsque les logs le permettent, un panel fixe de prompts français, la correction des citations et les métriques organiques GSC. Ne pas utiliser un score de lisibilité agent comme proxy de classement.

### Fichiers probablement modifiés

- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` si la liste de builds natifs doit être mise à jour.
- `nuxt.config.ts` pour la configuration `site` et `aiReady`.
- `content.config.ts` pour la compatibilité des schémas Content/SEO.
- `.env.example` et `.github/workflows/cd.yml` pour l’environnement Node/site et la validation `_headers`.
- `app/pages/confidentialite.vue` et `docs/specs/spec-analytics-search-console/compliance-gdpr.md` pour la politique des crawlers IA.
- `docs/specs/spec-analytics-search-console/SPEC.md`, `seo-verification.md`, `epics.md`, `sprint-status.yaml` pour le contrat et la traçabilité.
- `app/composables/useAnalytics.ts` uniquement si la mesure démontre qu’une dimension sanitizée manque ; ne pas élargir la collecte par défaut.

Ne pas modifier les primitives du Design System, la mise en page, le terminal, le comportement du formulaire de contact ou la mécanique de consentement PostHog.

### Previous Story Intelligence — 14.5

- 14.5 doit d’abord supprimer les propriétaires manuels de `sitemap.xml` et `robots.txt` et établir Nuxt Site Config.
- 14.5 doit prérendre tous les slugs Content publiés et garantir un HTML statique pour chaque URL du sitemap.
- 14.5 doit empêcher la CI d’écraser les `_headers` générés par le module.
- 14.4 reste une base locale en review ; les URL `jouan.ovh/sitemap.xml` et `jouan.ovh/robots.txt` ont été observées en 404 jusqu’au déploiement de l’Epic 14.

### Project Structure Notes

- Les handlers côté serveur ne sont pas nécessaires pour l’ensemble de routes AEO statique ; préférer les fichiers statiques générés par le module officiel.
- Ne pas créer de pages Vue pour `llms.txt`, `.md` ou robots.
- Ne pas activer les endpoints runtime que GitHub Pages ne peut pas servir.
- Ne pas introduire une seconde collection de contenu ni un second générateur Markdown.
- Garder toutes les sorties publiques en français, sans emoji, secret ni donnée privée.

### References

- [Source: `docs/specs/spec-analytics-search-console/SPEC.md` — CAP-3, CAP-4, CAP-6, CAP-8]
- [Source: `docs/specs/spec-analytics-search-console/compliance-gdpr.md` — consent, privacy and retention]
- [Source: `docs/specs/spec-analytics-search-console/seo-verification.md`]
- [Source: `app/composables/useAnalytics.ts` — UTM whitelist and sanitization]
- [Source: `app/pages/blog/[...slug].vue` — Content article and existing SEO]
- [Source: `content.config.ts` — blog collection schema]
- [Source: `.github/workflows/cd.yml` — static output verification and `_headers` copy]
- [Source: `docs/implementation-artifacts/14-4-referencement-google-search-console-sitemap-xml-et-robots-txt.md`]
- [Source: `docs/implementation-artifacts/14-5-migration-stack-nuxt-seo-sitemap-robots-site-config.md`]
- [Source: Nuxt AI Ready installation — https://nuxtseo.com/docs/ai-ready/getting-started/installation]
- [Source: Nuxt AI Ready configuration — https://nuxtseo.com/docs/ai-ready/api/config]
- [Source: Nuxt AI Ready llms.txt — https://nuxtseo.com/docs/ai-ready/guides/llms-txt]
- [Source: Nuxt AI Ready Markdown — https://nuxtseo.com/docs/ai-ready/guides/markdown]
- [Source: Nuxt Robots AI directives — https://nuxtseo.com/docs/robots/guides/ai-directives]
- [Source: OpenAI crawlers — https://developers.openai.com/api/docs/bots]
- [Source: OpenAI Publishers FAQ — https://help.openai.com/en/articles/12627856-oai-searchbot]

## Dev Agent Record

### Agent Model Used

Space Bunny Free (OpenCode) — 2026-09-24

### Debug Log References

- Préflight Docker : Node `22.23.0`, pnpm `11.8.0`, Nuxt `4.4.8`, Nitro `2.13.4`, `@nuxt/content` `3.14.0`, `nuxt-ai-ready` `2.4.0`, `@nuxtjs/sitemap` `8.5.1`, `@nuxtjs/robots` `6.2.3`, `nuxt-site-config` `4.2.3` et `better-sqlite3` `12.11.1`. `engines.node` est fixé à `>=22.13.0` ; `nuxt-llms` est absent du manifeste et du lockfile.
- Installation reproductible : `docker compose run --rm web sh -c "corepack enable && pnpm install --frozen-lockfile"` réussi (`Already up to date`) ; aucune installation de paquet sur l’hôte.
- Gate officielle : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` verte avant et après le durcissement post-revue. Un essai de nettoyage de `.nuxt` a d’abord rendu l’outillage ESLint indisponible ; `pnpm exec nuxi prepare` a régénéré les types, puis la gate officielle a été relancée sans échec.
- Build production : `docker compose run --rm -e NUXT_SITE_ENV=production web sh -c "corepack enable && pnpm generate"` vert après régénération propre de `.nuxt`/`.data` ; la CI applique désormais ce même nettoyage avant `nuxi prepare` et `generate`. `robots.txt` contient `Allow: /` pour `OAI-SearchBot`, `Disallow: /` pour `GPTBot` et le sitemap canonique.
- Assertions statiques production : `llms.txt` = `2 557` octets, `llms-full.txt` = `27 749` octets, `sitemap.xml` = 8 URLs, 8 liens Markdown sans doublon, liens HTML `alternate`/`describedby`, MIME Markdown, `_headers` et `CNAME` validés ; aucun dossier `__ai-ready` publié.
- Build production final propre après suppression de `.nuxt`, `.data` et `.output` : `nuxi prepare` puis `pnpm generate` réussis sans fixture ; `content/blog/` ne contient plus que `.gitkeep` et la sortie ne contient aucun artefact `__ci-seo-*`. Les assertions finales statiques et HTTP MIME sont repassées sur cette sortie.
- Fixture article CI : article temporaire avec `title`, `description`, `date`, `updated`, `tags`, `image`, `read` et fence TypeScript validé dans le HTML, le `.md`, `llms.txt`, `llms-full.txt` et le sitemap ; les fixtures noindex, robots false/none, sitemap false/null, draft et future sont absentes des exports AEO puis ont été supprimées.
- Correction durable : le filtre `isIndexableBlogEntry` injectable dans `defineSitemapSchema()` ne confond plus l’index numérique reçu par `Array#filter` avec une date ; la fixture dynamique a de nouveau produit une URL sitemap indexable.
- Durcissement post-revue : `llms-full.txt` n’est plus découpé sur chaque filet Markdown mais sur les en-têtes de page AI Ready ; une fixture noindex contenant `---` et un marqueur unique ne laisse aucun fragment dans les artefacts. Les métadonnées d’un `content/blog/<slug>/index.md` sont validées, les liens `alternate`/`describedby` des HTML noindex sont retirés, et le middleware runtime répond 404 aux `.md` draft/future/noindex/exclus.
- Durcissement analytics : les valeurs UTM sont validées comme identifiants de campagne ; emails, tokens longs, espaces et caractères atypiques sont neutralisés, tandis que `utm_source=chatgpt.com` reste accepté. L’état des routes Content est recalculé depuis les fichiers présents pour éviter un cache de prérendu obsolète.
- Fixture CI exacte : le bloc Python de `.github/workflows/cd.yml`, dérivé de toutes les URLs du sitemap, valide les 12 pages attendues de la fixture, les deux articles (plat et `index.md`), les exclusions, les liens, MIME, budgets et marqueurs ; il passe avec `Exact workflow Python assertions: OK`.
- HTTP local : GET vérifiés sur `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/sitemap.md`, `/index.md`, `/about.md`, `/blog.md` et `/contact.md` avec les types MIME attendus ; le HTML `/about` contient les liens AEO. Les requêtes de développement conservent le blocage d’indexation. Les fixtures de visibilité ont confirmé 200 pour les articles publiés et 404 pour draft, futur, noindex et sitemap exclu.
- Déploiement initial (2026-09-24) : la sonde production read-only renvoyait 404 pour `llms.txt`, `llms-full.txt`, `robots.txt` et `sitemap.xml` ; aucun merge n’était encore effectué depuis ce workspace.
- **Post-déploiement (2026-09-25)** : CI `main` verte (run GitHub Actions `36141238524`), merge `develop → main` déployé. Tous les artefacts AEO répondent en production : `/llms.txt`, `/llms-full.txt`, `/robots.txt` (`text/plain; charset=utf-8`), `/sitemap.xml` (`application/xml`), `/sitemap.md`, `/index.md`, `/services.md`, `/about.md`, `/contact.md`, `/contact/card.md`, `/blog.md`, `/mentions-legales.md`, `/confidentialite.md` (`text/markdown; charset=utf-8`). Les routes internes `/__ai-ready`, `/__nuxt-ai-ready` et `/__nuxt_content/blog/sql_dump.txt` répondent 404. `CNAME` et `_headers` sont servis en 200. Assertions Python production : 8 URLs sitemap uniques, budgets `llms.txt` = 2557 octets et `llms-full.txt` = 28323 octets, liens Markdown complets, sources `llms-full` égales au sitemap, groupes robots `*`/`OAI-SearchBot` en `Allow: /` et `GPTBot` en `Disallow: /`, aucun marqueur privé ou composant terminal. Les 8 HTML du sitemap portent `rel="alternate"`, `rel="describedby"` et un canonical cohérent. `/confidentialite` expose la politique OAI/GPT sans promesse de classement.
- Revue visuelle : `/confidentialite` contrôlé en desktop et mobile via OpenChamber ; captures conservées dans `.openchamber/screenshots/`. La page de politique IA reste lisible et conforme au Design System.
- Qualité documentaire : `git diff --check` vert ; `prettier --check` vert sur les sources, le workflow et les documents companions AEO ; les trois blocs Bash du workflow passent `bash -n`. Le story file conserve son format BMAD existant.
- Revue code patchée : `sitemap.loc` personnalisé rejeté, parsing YAML partagé, exclusion `robots:false` séparée de `sitemap:false`, protection du crawler, nettoyage runtime des liens AEO, cache AI Ready réinitialisé, parsing AEO durci et libellés générés localisés en français.
- Fixture de validation dynamique : route `index.md` imbriquée, noindex, `robots: false`, `sitemap: false`, draft et futur testés ; les fixtures ont été supprimées. Le HTML noindex runtime ne contient plus `alternate`/`describedby` et son `.md` répond 404.
- Revue CI/déploiement patchée : validation isolée en conteneur `node:22-bookworm-slim`, permissions PR réduites à `contents: read`, artefact clean régénéré après suppression des fixtures, job de déploiement isolé sur `gh-pages`, garde anti-rerun obsolète, probes statiques bornées, groupes robots parsés, structure `_headers`/CNAME validée et assertions AEO localisées.
- Revue confidentialité/mesure patchée : consentements analytics et replay séparés, DNT/GPC réévalués en session, hôte PostHog EU vérifié, cycle de révocation/re-connexion sécurisé, URL/propriétés assainies avant capture, replay réseau/terminal masqué, politique de rétention documentée sans promesse abusive et dump Content public supprimé.
- Validation workflow : YAML parsé, quatre blocs Python compilés, Prettier vert, `docker compose --env-file /dev/null config` vert et gate Docker finale verte. Le job GitHub Actions `main` (run `36141238524`) et le déploiement GitHub Pages ont depuis été exécutés avec succès.
- Avertissements non bloquants consignés : `.gitkeep` ignoré par Content, payload extraction recommandé, sourcemap du polyfill module-preload, avertissement AI Ready sur la collection blog vide et écart peer inherited `unctx`/`oxc-parser` ; aucun n'a bloqué install, typecheck, lint ou generate.

### Completion Notes List

- Implémentation AEO statique terminée avec `nuxt-ai-ready@2.4.0` verrouillé : `contentSource`, Markdown minimal, `llms.txt`, `llms-full.txt`, `sitemap.md`, `describedby`, absence de négociation de contenu, de base persistante, de runtime sync et de cron.
- Les exports sont nettoyés par route afin de conserver le contenu éditorial tout en retirant navigation, footer, terminal, formulaires, toast de consentement, DevTools et analytics. Les routes noindex et exclusions sont retirées des artefacts AEO après génération.
- Le frontmatter Markdown des articles est complété avec `date`, `updated`, `tags`, `image` et `read`, tandis que `updatedAt` reste l’alias interne aligné sur `updated`. Les fences de code et la structure Content sont préservés.
- La politique OpenAI est documentée sans promesse de classement : `OAI-SearchBot` autorisé pour la recherche, `GPTBot` bloqué pour l’entraînement, `ChatGPT-User` traité comme une visite initiée par l’utilisateur et `Content-Signal`/`Content-Usage` décrits comme des indications volontaires.
- La CI crée et supprime ses fixtures, vérifie les exclusions, les doublons, les MIME, les liens HTML, les budgets, les robots, le sitemap, `_headers`, `CNAME` et l’absence de dumps AI Ready ou du dump Content public sans dépendre d’un total de routes Nitro.
- La whitelist PostHog est durcie : `utm_source=chatgpt.com` reste observable après consentement dans `$pageview.query_params`, tandis que les clés non documentées, emails, téléphones, tokens longs et credentials courts sont neutralisés ; aucune donnée de formulaire n'est envoyée.
- La mesure avant/après sur au moins quatre semaines, le panel de prompts français, les conversions, les citations observées et les contrôles GSC sont documentés comme des observations descriptives, jamais comme une attribution causale.
- Les findings de la revue adversariale ont été traités : parsing AEO sûr vis-à-vis des `---`, fixtures noindex avec séparateur, article `index.md` imbriqué, cache de routes recalculé, refus runtime des sources exclues, liens HTML noindex nettoyés, valeurs UTM assainies et CI dérivée du sitemap.
- La gate, le build production, les assertions statiques, la fixture dynamique, les requêtes HTTP et la revue visuelle sont validés. Le déploiement GitHub Pages et la vérification HTTP de production ont été effectués le 2026-09-25 (run CI `36141238524`) : tous les artefacts AEO et jumeaux `.md` répondent 200 avec les MIME attendus, les routes internes sont en 404, les budgets et la politique robots sont conformes. La story peut donc être déclarée `done`.
- La dernière passe locale après build propre confirme à nouveau les 8 URL sitemap, les 8 jumeaux Markdown, les budgets (`2 557` et `27 749` octets), l’absence de fixtures dans la source et la sortie, ainsi que les MIME HTTP attendus. Cette passe locale précède le déploiement ; le déploiement et la vérification de production sont consignés dans l’entrée de clôture ci-dessous.
- Les 47 patches des groupes 1 à 3 de la revue code review ont été traités et vérifiés ; le workflow GitHub Actions `main` est vert, le déploiement GitHub Pages a été effectué et la vérification HTTP de production est documentée ci-dessus.

### File List

- `.env.example`
- `.github/workflows/cd.yml`
- `AGENTS.md`
- `app/composables/useAnalytics.ts`
- `app/composables/useConsent.ts`
- `app/composables/usePosthog.ts`
- `app/plugins/posthog.client.ts`
- `app/components/ui/ConsentToast.vue`
- `app/components/terminal/TerminalComponent.vue`
- `app/pages/about.vue`
- `app/pages/contact/card.vue`
- `app/pages/contact/index.vue`
- `app/pages/index.vue`
- `app/pages/mentions-legales.vue`
- `app/composables/usePageSeo.ts`
- `app/composables/useSiteUrl.ts`
- `app/pages/blog/[...slug].vue`
- `app/pages/blog/index.vue`
- `app/pages/confidentialite.vue`
- `app/utils/aeo-markdown.ts`
- `app/utils/blog-indexability.ts`
- `app/utils/site-url.ts`
- `content.config.ts`
- `docker-compose.yml`
- `docs/implementation-artifacts/deferred-work.md`
- `docs/implementation-artifacts/sprint-status.yaml`
- `docs/planning-artifacts/epics.md`
- `docs/project-context.md`
- `docs/specs/spec-analytics-search-console/.decision-log.md`
- `docs/specs/spec-analytics-search-console/SPEC.md`
- `docs/specs/spec-analytics-search-console/compliance-gdpr.md`
- `docs/specs/spec-analytics-search-console/seo-verification.md`
- `docs/specs/spec-analytics-search-console/tracking-plan.md`
- `nuxt.config.ts`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `server/plugins/ai-ready-markdown.ts`
- `server/plugins/seo-content.ts`
- `server/middleware/aeo-content-visibility.ts`

## Change Log

- 2026-09-24 : story créée pour l’AEO statique, les formats Markdown et la politique OpenAI après la roadmap SEO ; statut → ready-for-dev.
- 2026-09-24 : `nuxt-ai-ready@2.4.0`, la génération Markdown, les artefacts AEO, la politique robots, la CI et la documentation de mesure sont implémentés ; gate Docker et revue visuelle validées.
- 2026-09-24 : correction du filtre sitemap sérialisable et validation finale de la fixture article ; story passée de `in-progress` à `review`, sous réserve du déploiement et de la vérification HTTP post-déploiement.
- 2026-09-24 : durcissement post-revue des exclusions Content, du parsing `llms-full.txt`, des métadonnées `index.md`, des liens HTML noindex, des valeurs UTM et de la couverture CI dérivée du sitemap ; story maintenue en `review` jusqu’au déploiement.
- 2026-09-24 : build production final propre, assertions statiques sans fixture et contrôle HTTP MIME Docker répétés avec succès ; statut conservé à `review` en attente de déploiement et de vérification production.
- 2026-09-25 : **Clôture post-déploiement** — CI `main` verte (`36141238524`), production `jouan.ovh` vérifiée : 13 artefacts AEO en 200 avec MIME attendus, 8 URLs sitemap et sources `llms-full` concordantes, budgets 2557/28323 octets, liens HTML `alternate`/`describedby` et canonical sur les 8 pages, robots `OAI-SearchBot`/`GPTBot` conformes, routes internes et dump Content en 404, CNAME et `_headers` servis. Statut → `done`.

# Story 16.1: Contrat de contenu minimal et migration de date

Status: in-progress
baseline_commit: 3b3f3b2adde8ce9459a256269572a0fea7e8845a

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mainteneur de la plateforme éditoriale,
I want un schéma de collection Content typé et déterministe qui valide le contrat minimal des articles T0,
so that aucun article invalide, ambigu ou daté selon deux règles concurrentes n'atteigne jamais les surfaces publiques.

**Epic :** 16 — Plateforme éditoriale durable (gate T0)
**FR couverts :** FR55 (contrat de contenu minimal), FR60 (contrat de date) — PRD `FR-1`, `FR-3` (contrat de date)
**NFR :** NFR21 (design system — non applicable ici, aucun UI), NFR17 (pnpm strict)

## Acceptance Criteria

1. **Champs requis T0 acceptés.** Le schéma `blog` accepte exactement `title`, `description`, `date`, `author`, `pillar`, `format`, `tags`, `draft`, `visibility`. `title`, `description` et `path` sont déjà fournis par `type: "page"` — ne pas les redéclarer.

2. **Enums fermés.** `pillar` ∈ `ai-systems` | `software-engineering` | `automation`. `format` ∈ `deep-dive` | `tutorial` | `lab-note` | `project-log` | `opinion` | `comparison` | `case-study` | `reference`. `visibility` ∈ `public` | `private`. `author` = `simon-jouan` (identifiant unique). `goals` ∈ `seo` | `authority` | `business` | `memory`, optionnel.

3. **`tags` kebab-case.** Minuscules, tirets, non vides. Vocabulaire contrôlé, pas de capitalisation.

4. **`date` seul champ de publication.** Format `YYYY-MM-DD`, date calendaire réelle (rejeter `2026-02-30`), sémantique Europe/Paris. `publishedAt` est **refusé avec une erreur explicite**, pas ignoré.

5. **`updated` conditionnel.** Optionnel ; si présent, `updated >= date`. La date de publication reste immuable.

6. **`goals` inerte.** Accepté mais sans effet sur la publication, le classement ou un appel à l'action. Aucun code de lecture ne doit en dépendre en T0.

7. **Erreur de validation explicite.** Une valeur d'enum invalide échoue avec un message nommant le champ et les valeurs acceptées. Aucun build partiel.

8. **Unicité de `title` dans le corpus public.** Deux articles publiés distincts ne peuvent pas partager le même `title`. **⚠️ Non implémentable en Zod** — voir Dev Notes § « Unicité de titre ».

9. **Limites de phase.** Les champs R1 (`project`, `featured`, `evergreen`, `seo`, `canonical`, `related`, `series`, `archived`) ne sont **pas** introduits en T0.

## Tasks / Subtasks

- [x] **T1 — Inventorier les consommateurs du schéma avant de toucher quoi que ce soit** (préalable à tout)
  - [x] T1.1 Lire `content.config.ts` en entier (101 lignes) avant d'éditer
  - [x] T1.2 Confirmer que `isIndexableBlogEntry` n'est **pas** modifié par cette story (voir § Interdits)
  - [x] T1.3 Vérifier `docker compose up` tourne ou lancer la commande ponctuelle

- [x] **T2 — Étendre le schéma Zod** (AC: #1 #2 #3 #4 #5 #6 #7 #9)
  - [x] T2.1 Ajouter `author: z.literal("simon-jouan")`
  - [x] T2.2 Ajouter `pillar: z.enum([...])`
  - [x] T2.3 Ajouter `format: z.enum([...])`
  - [x] T2.4 Ajouter `visibility: z.enum(["public", "private"]).default("public")`
  - [x] T2.5 Ajouter `goals: z.array(z.enum([...])).optional()`
  - [x] T2.6 Durcir `tags` : `z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, ...))` — remplacer le `z.array(z.string()).default([])` actuel
  - [x] T2.7 **Refuser `publishedAt`** : ajouter une refinement qui lève si la clé est présente
  - [x] T2.8 **Supprimer `sitemapExcluded`** — champ mort, jamais écrit (voir Dev Notes)
  - [x] T2.9 **Préserver `updatedAt`** — NE PAS le supprimer (voir Dev Notes, piège critique)

- [x] **T3 — Unicité de `title` dans le corpus public** (AC: #8)
  - [x] T3.1 Implémenter dans le hook `content:file:afterParse` de `nuxt.config.ts`, **en réutilisant le pattern `contentSourcePathByRoute` déjà présent** (lignes 676-682)
  - [x] T3.2 Filtrer sur le statut public via `isPublishedBlogEntry(context.content)` — un brouillon peut partager un titre avec un publié
  - [x] T3.3 Lever une erreur nommant les deux sources en collision
  - [x] T3.4 Réinitialiser la map entre deux scans, sinon le cache SQLite rend le check non fiable (voir Dev Notes)

- [x] **T4 — Valider** (AC: #1 à #9)
  - [x] T4.1 `docker compose run --rm web sh -c "corepack enable && pnpm typecheck"` → code 0
  - [x] T4.2 Même commande avec `pnpm lint` → 0 ESLint, 0 Stylelint
  - [x] T4.3 `pnpm generate` → code 0, `/blog` toujours pré-rendu
  - [x] T4.4 Créer une fixture temporaire conforme, valider, puis **supprimer** et vérifier par `git status` + recherche de slugs
  - [x] T4.5 Vérifier qu'un `publishedAt` présent fait bien échouer le build, et qu'un `format: deep-dive` invalide échoue aussi

### Review Findings

_Revue de code du 2026-09-27 — trois couches parallèles (Blind Hunter, Edge Case Hunter, Acceptance Auditor) sur le diff non commité contre `3b3f3b2`. Les constats marqués « vérifié » ont été reproduits par le reviewer._

**Décisions prises en revue (4) — toutes tranchées le 2026-09-27, converties en patch**

- [x] [Review][Patch] **`title` et `description` ne sont validés par aucune couche exécutable** — *Tranché (D1 → option 1).* L'AC #1 interdit de les redéclarer (`type: "page"` les fournit) et c'est respecté, mais `@nuxt/content` v3 n'exécute rien : vérifié en conteneur, `{...base, title: undefined}` et `{...base, description: undefined}` passent tous deux le `safeParse`. `pageStandardSchema` (`@nuxt/content/dist/module.mjs:2156-2171`) les déclare en simples chaînes, sans `required` ni `minLength`. Un article sans description part en `NULL` en base et atteint les surfaces ; FR55 et PRD FR-1 ne sont qu'à moitié couverts. **Correctif retenu :** ajouter dans `assertBlogContentContract` une assertion non redondante (`title` et `description` = chaînes non vides après trim), **sans** les déclarer dans le schéma de collection. Le scan fournit alors un message dur et nommant le champ, l'AC #1 restant respectée.
- [x] [Review][Patch] **`draft` optionnel et `tags: []` accepté, alors que `content-contract.md` §2 les marque obligatoires en T0** — *Tranché (D2 → option 1) : aligner le code sur le contrat.* `draft: z.boolean().optional()` (`blog-content-contract.ts:96`) fait qu'un `draft` oublié publie l'article ; `z.array(...)` sans `.min(1)` accepte `tags: []` alors que le commentaire dit « Champ requis » et que `content-contract.md:52` marque `tags` T0 = oui (les deux templates rendent alors zéro pastille et `keywords` disparaît du JSON-LD). Le Dev Agent Record listait `tags: []` parmi les cas positifs : cette matrice doit être corrigée. **Correctif retenu :** `draft: z.boolean()` et `tags: z.array(...).min(1, …)`. ⚠️ Effet de bord à traiter dans le même lot : les 10 fixtures de `cd.yml` devront aussi porter `draft:`.
- [x] [Review][Patch] **Le filtre « corpus public » de l'unicité de titre ne correspond pas au commentaire et au message d'erreur** — *Tranché (D3 → option 1) : le code rejoint le commentaire.* `registerPublicBlogTitle` est appelé après `isPublishedBlogEntry` (`l'enregistrement de titre du scan`, `l'enregistrement de titre du hook`), qui ne rebuild que `{ date, draft }`, alors que le corpus public réel est `published && !noindex && !robotsNoindex && !sitemapExcluded` (`blog-indexability.ts:106-108`, `cd.yml:602-604`). Un article `noindex: true` ou `sitemap: false` **réserve** son titre, et un article publié légitime qui le réutilise échoue avec le message « un brouillon ou un article à venir peut réutiliser un titre publié » — faux pour ce cas. **Correctif retenu :** filtrer sur `isIndexableBlogEntry` (le prédicat reste inchangé et sans import, AD-02 respectée) ; le message d'erreur et le commentaire `la purge des tables de titres-794` deviennent alors exacts.
- [x] [Review][Patch] **La clé d'unicité est le `title` brut, sans normalisation** — *Tranché (D4 → option 2).* `"Automatiser"`, `"automatiser"`, `"Automatiser "` et `"Automatiser "` (espace insécable) sont quatre clés distinctes pour le même titre : l'AC #8 est contournable par une espace final. **Correctif retenu :** `trim()` + *case folding* + normalisation Unicode NFKC avant l'enregistrement et avant la comparaison.

**Patches (16)**

- [x] [Review][Patch] **BLOQUANT — les 10 fixtures de `.github/workflows/cd.yml` violent le contrat et la CI ne peut plus passer** [`.github/workflows/cd.yml:86-199`] — L'étape `Generate` écrit 10 fichiers dans `content/blog/` **avant** `pnpm exec nuxi prepare && pnpm generate` (l. 200-201). Aucune n'a `author`, `pillar` ni `format` ; deux portent `tags: [CI]` (majuscules → refusé par `BLOG_TAG_PATTERN`) et les huit autres n'ont pas de `tags` du tout. Reproductible : `ERROR [content] Contrat éditorial T0 violé par content/blog/__ci-seo-draft.md : author : Invalid literal value, expected "simon-jouan" / pillar : Required / format : Required / tags : Required at scanContentRouteState (`assertBlogContentContract`) at l'appel de `scanContentRouteState()``. L'échec survient au chargement de la configuration → l'étape `Generate` échoue, le job `validate` tombe sur chaque PR et chaque push sur `main`, le job `deploy` ne part jamais et `gh-pages` n'est plus alimenté. Le fichier n'est pas dans le File List de la story, et la mention « assertions CI revérifiées localement » du Dev Agent Record porte sur un build **sans fixture**, donc sur un chemin qui n'exerce pas le contrat.
- [x] [Review][Patch] **Un fichier `blog/` sans frontmatter — ou à YAML illisible — échappe entièrement à l'assert** [`la garde `metadata ?? {}` du scan`] — La garde `&& metadata` désarme le contrat exactement là où tout manque : `parseFrontmatter` (``parseFrontmatter``) renvoie `undefined` si le motif `---` est absent, si `toJS()` renvoie `null` (frontmatter vide), si la racine n'est pas un objet, ou si le YAML lève (alias non résolu). Le fichier passe alors par `if (!metadata || !isPublishedBlogEntry(metadata)) { delete; continue; }` et disparaît **sans erreur, sans route et sans rejet** — c'est le « build partiel » que l'AC #7 interdit. En parallèle le hook lève bien, mais `module.mjs:3301-3305` transforme l'exception en `logger.warn("… is ignored because parsing is failed")` et retire le fichier de la base : `pnpm generate` sort en 0. Seul filet restant : `cd.yml:588`, qui s'exécute après le build.
- [x] [Review][Patch] **Le point dur ne valide que les `.md`, alors que la collection est `blog/**`** [`le filtre d'extension du scan`] — `visit()` fait `continue` sur tout ce qui ne termine pas par `.md`, mais `@nuxt/content@3.14.0` déclare des transformeurs pour `.csv` (`module.mjs:1116`), `.*` (`:1142`), `.md` (`:1185`), `.yml`/`.yaml` (`:1277`) et `.json` (`:1297`). Un `content/blog/x.yaml` conforme est ingéré, reçoit la route réelle `/blog/x`, est prérendu et publié — sans jamais passer par `assertBlogContentContract`. Le point que la story désigne comme le seul échec dur est contournable par un simple renommage. Aligner `source` (`content.config.ts:13`) et le filtre d'extension.
- [x] [Review][Patch] **La map des titres n'est jamais purgée hors du scan** [`la déclaration `contentSourcePathByPublicTitle``, `le début de `scanContentRouteState``, `la purge des tables de titres`] — Seul `contentSourcePathByPublicTitle.clear()` existe, en tête de `scanContentRouteState()`, qui n'est appelée qu'une fois au chargement du module (`l'appel de `scanContentRouteState()``). Le hook `content:file:afterParse` écrit dans la même structure sans jamais retirer d'entrée. En `nuxt dev`, renommer `a.md` (titre « Foo ») en « Bar » laisse `Foo → content/blog/a.md` ; créer ensuite `b.md` avec le titre « Foo » déclenche `existing !== source` → `throw` → **exception avalinée par `module.mjs:3303`** : l'article disparaît silencieusement de `/blog` jusqu'au redémarrage. La `Map` croît en outre sans borne sur la durée de vie du serveur. Même symptôme sur `contentRouteState` / `contentSourcePathByRoute` (pré-existant).
- [x] [Review][Patch] **Toute erreur sur `sitemap` ou `robots` est rapportée `Invalid input`, sans détail ni valeurs acceptées** [`le schéma `sitemap``] — Zod 3 fait échouer une union avec **un seul** issue `invalid_union` dont le message est littéralement `Invalid input` ; les `unionErrors` sont ignorés par le rendu. Vérifié sur le schéma exact : `sitemap: { lastmod: "2026-01-20" }`, `sitemap: { priority: "0.5" }`, `sitemap: true`, `robots:` (vide → `null`) et `robots: 42` produisent tous la ligne unique `  - sitemap : Invalid input`. Aggravant : `defineSitemapSchema` déclare `lastmod: z.date().optional()` (`@nuxtjs/sitemap/dist/content.mjs:73`, vérifié) alors que le cœur YAML 1.2 renvoie une chaîne — **aucune valeur YAML ne peut satisfaire `sitemap.lastmod`**, et l'erreur muette ne donne aucun indice. L'AC #7 exige un message nommant le champ et les valeurs acceptées ; il n'est pas tenu sur toute la branche SEO. (La déclaration `lastmod: z.date()` est pré-existante, mais elle devient un échec dur parce que le contrat est désormais exécuté.)
- [x] [Review][Patch] **Seul `publishedAt` est refusé ; les autres alias de date de publication passent en silence** [`app/utils/la constante `BLOG_FORBIDDEN_FRONTMATTER_KEYS``] — Le motif « champ interdit = `z.never()` déclaré » ne couvre qu'une clé, et l'objet n'étant pas `.strict()`, `published`, `pubDate`, `datePublished` ou `published_date` sont supprimés sans bruit. L'AC #4 exige que `date` soit **le seul** champ de publication ; un article peut donc en porter deux contradictoires, l'un étant ignoré. Ajouter une courte deny-list d'alias.
- [x] [Review][Patch] **Les commentaires du contrat désignent le hook comme point d'application dur — c'est faux** [`app/utils/l'en-tête de `app/utils/blog-content-contract.ts``, `app/utils/la fonction `editorialDate` et son commentaire`] — Ils annoncent que `assertBlogContentContract` « échoue le build » et qu'« aucun build partiel n'est produit » en renvoyant vers « le hook `content:file:afterParse` », alors que c'est exactement le chemin dont le Piège 4 de la story établit qu'il **n'échoue rien** : `module.mjs:3303` avale l'exception en `logger.warn`. Le message d'erreur lui-même (`le message produit par `assertBlogContentContract``) promet « aucun artefact n'est produit » y compris quand il est levé depuis le hook. Corriger les deux emplacements, ou retirer l'assert du hook.
- [x] [Review][Patch] **Un article dont le `title` est absent échappe à l'unicité, et son titre dérivé peut tuer un article légitime** [`l'enregistrement de titre du scan`, `l'enregistrement de titre du hook`] — Le scan lit `metadata.title` sur le frontmatter brut ; `@nuxt/content` remplit **toujours** `context.content.title` depuis le nom de fichier (`module.mjs:1150` : `content.title || generateTitle(...)`). Cas : `content/blog/x.md` sans `title` + `content/blog/y.md` avec `title: X`. (a) `x.md` passe le contrat dur, n'est jamais enregistré par le scan, sort en production avec un titre dérivé qui alimente le `<h1>`, le `headline` JSON-LD et `llms.txt` ; (b) l'AC #8 ne porte donc pas sur lui ; (c) le hook enregistre « X » depuis `x.md` et, si `y.md` est parsé après, `registerPublicBlogTitle` lève — levée avalinée, **`y.md` disparaît du build**. L'ordre de parsing et le cache SQLite rendent le résultat non déterministe.
- [x] [Review][Patch] **Les clés pointées ne sont pas dé-flattenées par le parseur du scan** [``parseFrontmatter``] — `remark-mdc` applique `flat.unflatten(data)` (`remark-mdc@3.11.0/dist/index.mjs:68`), `parseFrontmatter` non. Entrée : `sitemap.loc: /blog/x` en YAML. Le scan voit une clé inconnue `sitemap.loc` → Zod la supprime → le `superRefine` (`la fonction `formatBlogSchemaIssues``) ne se déclenche pas → **build vert**. `@nuxt/content` produit `sitemap: { loc }` → le contrôle du hook (`la garde `sitemap.loc` du hook`) lève → avaliné. Divergence dur/doux exactement du type que la story voulait fermer.
- [x] [Review][Patch] **Une date mal formée produit deux messages, dont la distinction promise par le commentaire n'apparaît jamais** [`app/utils/la fonction `editorialDate``, `app/utils/blog-content-contract.ts:70-79`] — Zod 3 n'arrête pas la chaîne après l'échec du regex : `.refine(isCalendarDate)` s'exécute aussi, et `isCalendarDate` rejoue le même regex. `date: 15/01/2026` donne `date : date doit être au format ISO YYYY-MM-DD` **et** `date : date doit contenir une date calendaire valide`. Le commentaire « capture par groupe pour distinguer format dévié / date calendaire inexistante » décrit un comportement absent. Idem pour `updated`.
- [x] [Review][Patch] **Le scan n'est pas déterministe et échoue au premier fichier fautif** [`nuxt.config.ts:485`] — `readdirSync` n'est pas trié : avec plusieurs fichiers invalides, le fichier désigné par le message varie d'un build à l'autre, alors que la story revendique un contrat « typé et **déterministe** ». Aucune agrégation non plus : corriger un corpus invalide suppose N builds successifs. Trier les entrées et agréger les issues.
- [x] [Review][Patch] **Les années 0000-0099 sont rejetées à tort** [`app/utils/la fonction `isCalendarDate``] — `Date.UTC(26, 0, 1)` mappe l'année 26 sur 1926, donc `date: "0026-01-01"` — autorisée par `/^(\d{4})/` et calendairement valide — est refusée sur « date doit contenir une date calendaire valide ». Bogue hérité de l'ancien schéma, recopié tel quel dans le fichier qui se présente comme la version de référence. Corriger via `setUTCFullYear`.
- [x] [Review][Patch] **La story se contredit : le tableau « Interdits absolus » n'a pas été amendé pour l'écart assumé** [story:§Interdits] — L'interdit « Toucher `nuxt.config.ts` hors du hook `afterParse` » est maintenu tel quel alors que le Piège 4 et le § Project Structure Notes assument explicitement l'inverse. Soit amender le tableau, soit la story s'auto-évalue en violation de sa propre règle.
- [x] [Review][Patch] **Le Dev Agent Record annonce une matrice de « 39 cas » arithmétiquement fausse et non rejouable** [story:§Completion Notes] — La story dit « 39/39 » (l. 304) ; « 39/34 » n'y figure pas. L'énumération donne 16 positifs listés (elle en annonce 17) + 22 négatifs = 38. Le script de matrice et les fixtures ayant été supprimés, rien n'est rejouable. La **substance** est confirmée : 22 cas rejoués côté reviewer, tous les comportements documentés et les deux formats de message exacts sont exacts. Corriger le décompte, ou conserver la matrice sous forme rejouable.
- [x] [Review][Patch] **`docs/planning-artifacts/architecture-blog-editorial.md` §6.1 et `docs/project-context.md:65-68` sont devenus faux** — Le premier décrit toujours le schéma dans `content.config.ts`, ne mentionne aucun point d'application exécutable et prescrit « à retirer ou geler : `read` » (conservé) ; le second décrit l'emplacement et la liste de champs devenues fausses. Leur propre règle (`architecture-blog-editorial.md` §11.3, `AGENTS.md` §5) impose l'amendement.
- [x] [Review][Patch] **`content-contract.md` : la cellule `read` contredit la décision par défaut appliquée** [docs/specs/spec-blog-editorial/content-contract.md:55] — `read` est conservé en optionnel (Piège 1, décision argumentée et correcte : le PRD §12 interdit le *calcul*, pas la valeur, et `reading_time_est` du JSON-LD en dépend), mais le contrat annonce toujours T0 = non. Même nature que la correction de cellule déjà demandée pour `image` (`content-contract.md:54`).

**Defer (2)**

- [x] [Review][Defer] `visibility` est validé mais totalement inerte — `isIndexableBlogEntry` ne le connaît pas, donc un article `visibility: private` est public [app/utils/la déclaration du champ `visibility`] — deferred, pré-existant
- [x] [Review][Defer] La convention `.draft` de `@nuxt/content` n'est pas gérée par `contentRouteFromFile` → `content/blog/mon-article.draft.md` produit l'état de route `/blog/mon-article.draft` alors que `pathMeta` retire `.draft`, d'où une route prérendue contre un document inexistant et un 404 au build [``contentRouteFromFile``] — deferred, pré-existant

---

## Review Findings — 2e passe (2026-09-27)

_Revue de code de seconde passe, sur le diff non commité contre `3b3f3b2`, périmètre **16.1 seul**
(`app/utils/blog-content-contract.ts`, `content.config.ts`, `nuxt.config.ts`, `.github/workflows/cd.yml`).
Trois couches parallèles : Blind Hunter (diff seul), Edge Case Hunter (diff + lecture du projet et des
implémentations tierces `module.mjs` / `defineSitemapSchema` / `remark-mdc` / `tinyglobby`), Acceptance
Auditor (diff + spec + contrat + architecture). Le premier passage (16 patchs, 4 décisions) est conservé
ci-dessus ; ce second passage porte sur l'état **après** application de ces patchs._

**Contrainte de cadrage signalée avant la revue :** l'arbre de travail contient les modifications de 16.1
**et** de 16.2 non commitées ensemble, alors que `sprint-status.yaml` marque 16.2 `done`. Le diff contre
`3b3f3b2` englobe donc les deux lots. Simon a tranché : revue limitée à 16.1, la contamination étant
elle-même traitée comme un constat (N1).

### Décisions arbitrées (3) — toutes tranchées le 2026-09-27

- [x] [Review][Decision] **N1 — BLOQUANT : le lot 16.1 dépend désormais de la 16.2 et n'est ni compilable ni commitable seul** — `nuxt.config.ts:3` importe `resolveBlogVisibility`, absent de `3b3f3b2` (vérifié : le baseline n'exporte que `isSitemapExcluded`, `isPublishedBlogEntry`, `isIndexableBlogEntry`, `getBlogRobotsDirective`). La sémantique du lot est donc celle de 16.2 (`state.production` / `state.discoverable` / `state.inSitemap`, `SEO_ROUTE_CACHE_VERSION = 2`, matrice `visibility: private` en CI). Conséquences : (a) la prémisse de `epics.md:1619` — « chemins de code disjoints », « **aucune story ne dépend d'une story future** » — est tenue ; (b) les deux stories se déclarent propriétaires des mêmes hunks de `nuxt.config.ts` (le scan, `:604` et `:633-638`) et de `cd.yml` (`:261`, `:456`, `:688-692`, `:728-739`) ; (c) aucun AC de 16.1 n'est validable par application isolée du diff. **Arbitré le 2026-09-27 (Simon) : deux commits, dans l'ordre 16.1 puis 16.2.** *(L'ordre inverse — 16.2 d'abord — a été examiné puis écarté : la story 16.2 déclare au ligne 44 un prérequis de build explicite, « 16.1 doit être commité, sinon `visibility` est absent du schéma et la couche A ne peut pas le lire », et cette contrainte est confirmée par le code — `visibility` est absent du schéma de collection au baseline `3b3f3b2`, et `@nuxt/content` expulse toute clé non déclarée dans `content.meta`. Un commit 16.2 seul serait resté vert — le scan lit le frontmatter brut — mais le hook, en développement, n'aurait pas vu le champ : un article `private` y aurait été traité comme public. Fuite silencieuse, invisible de toute assertion, exactement la classe de défaut que cette story existe pour empêcher.)*

**Découpage retenu :**

- **Commit 1 — lot 16.1 seul.** `app/utils/blog-content-contract.ts`, `content.config.ts`, `nuxt.config.ts` et `cd.yml` dans leur état 16.1, où le scan et le hook consomment `isPublishedBlogEntry` / `isSitemapExcluded` / `isIndexableBlogEntry`, et où l'unicité de `title` est prédate par `isIndexableBlogEntry` — c'est-à-dire l'**arbitrage D3 d'origine**, avant que 16.2 ne le remplace. `SEO_ROUTE_CACHE_VERSION` reste à 1. Aucun fichier de la story 16.2 n'est présent. Gate verte, 42 routes. `visibility` est **déclaré** par le contrat mais **non appliqué** : c'est la situation T0 attendue, et elle est l'inverse du trou de confidentialité — le champ est visible du hook, il manque seulement son application.
- **Commit 2 — lot 16.2.** `resolveBlogVisibility` et son mapping d'état, le prédicat d'unicité qui évolue vers `state.discoverable` (arbitrage D6), `SEO_ROUTE_CACHE_VERSION = 2`, la fixture `__ci-seo-private` et la matrice de visibility en CI, plus la story 16.2.

L'histoire D3 → D6 devient ainsi cohérente au lieu d'être une contradiction : D3 est le prédicat du commit 1, D6 sa correction motivée dans le commit 2. `epics.md:1619` reste à amender sur ce point.
- [x] [Review][Decision] **N2 — `visibility` : obligatoire (§2) ou défaut `public` (T2.4) ?** Le contrat normatif `content-contract.md:47` porte `visibility` en T0 = **oui** (obligatoire), tandis que T2.4 prescrivait `z.enum([...]).default("public")` et que c'est ce qui est codé (`app/utils/blog-content-contract.ts:211`). La décision D2 (« aligner le code sur le contrat ») a été appliquée à `draft` et `tags` mais **pas** à `visibility` : un article qui oublie le champ de confidentialité passe sans diagnostic, avec un défaut silencieux `public`. 8 des 10 fixtures CI omettent aujourd'hui la clé. **Arbitré le 2026-09-27 (Simon) : aligner le code sur le contrat** — `visibility` devient requis, sans défaut. `visibility` est le seul champ de confidentialité de la matrice : une faute de frappe ou un oubli a donc un effet de **fuite**, là où `draft` n'a qu'un effet de tri. Le principe D2 devient cohérent sur les trois champs. Report : voir patch P21.
- [x] [Review][Decision] **N3 — AC #3 « vocabulaire contrôlé » n'a ni implémentation ni source normative** — `app/utils/blog-content-contract.ts:26` ne contrôle que la **forme** (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/u`). `zéro-r fif`, `cisco`, `ma-news` passent. `content-contract.md:45` est la **seule** mention normative au dépôt et aucun artefact (PRD, SPEC, architecture) ne définit de liste de tags ; le corpus est vide (`content/blog/` ne contient que `.gitkeep`), donc il n'existe rien contre quoi contrôler. L'exigence est **invérifiable** plutôt que violée. **Arbitré le 2026-09-27 (Simon) : option (a) — reformuler.** L'intention de la spec est légitime (les tags alimentent `.tag` et `keywords`, donc `cisco` et `Ciso` produiraient deux pastilles identiques), mais la réponse à ce risque est le contrôle de **forme**, déjà codé, pas un inventaire figé : un vocabulaire fermé en T0 obligerait à modifier le schéma Zod pour publier un article sur un outil nouveau, ce qui fait de la plateforme éditoriale un frein à la production. La garantie forte est récupérée en 16.7 sous forme d'assertion CI de cohérence inter-articles (casse et accents), qui attrape la vraie classe de risque sans figer le vocabulaire. Report : voir patch P22.

### Patches (22)

- [x] [Review][Patch] **BLOQUANT — le patch P3 n'a jamais été appliqué : le point dur ne couvre que les `.md` en minuscule, alors que la collection est `blog/**`** [`content.config.ts:13`, `nuxt.config.ts:565`] — `source: "blog/**"` et `!entry.name.endsWith(".md")` sont inchangés. `@nuxt/content@3.14.0` déclare des transformateurs `.yml`/`.yaml` (`:1277`), `.json` (`:1297`), `.*` (`:1142`) et un `getParser` **sensible à la casse** (`:1328`, `new RegExp(".md","i")`). Un `content/blog/x.yaml` conforme, ou un `content/blog/Mon-Article.MD`, est donc ingéré, reçoit la route réelle `/blog/x`, est prérendu et publié — sans jamais passer par `assertBlogContentContract`, ni entrer dans `contentRouteState`, ni dans le registre d'unicité. L'AC #7 (« aucun build partiel ») et la garantie « seul échec dur » de `architecture-blog-editorial.md` §6.1 sont contournables par un simple renommage. Le patch P3 était coché `[x]` et la Completion Notes affirme l'alignement. — **Vérifié : `.yaml` et un nom en majuscules sont refusés en dur.**
- [x] [Review][Patch] **Le hook applique le contrat sur `context.content`, déjà transformé : 4 des 7 clés interdites sont invisibles, et `title` est souvent synthétisé** [`nuxt.config.ts:888`, `blog-content-contract.ts:118-136`] — `module.mjs:1489-1495` ne conserve au premier niveau que les clés de `extendedSchema` et déplace **toute clé non déclarée dans `content.meta`**. `publishedAt` est déclaré (`z.never()`) et reste visible, mais `published`, `pubDate`, `datePublished` et `published_date` atterrissent dans `content.meta.*` : `Object.hasOwn(context.content, "published")` vaut `false` et le schéma ne les déclare pas non plus → **aucun des deux points ne les signale** ; seul le scan les voit. Symétriquement, `module.mjs:1150` (`content.title || generateTitle(basename)`) s'exécute **avant** `afterParse` : un fichier sans `title:` passe le contrôle d'identité, et le registre d'unicité est alimenté d'une clé synthétique — un article légitime déclarant `title: Mon Article` entre en collision avec `mon-article.md` et, son exception étant avalée, disparaît de `/blog`. Correctif : relire le frontmatter brut depuis le disque dans le hook pour les contrôles d'identité, de clés interdites et d'enregistrement de titre. — **Vérifié : le hook relit le frontmatter brut et n'enregistre que le `title` déclaré.**
- [x] [Review][Patch] **La réservation de titre n'est libérée que sur `production === "absent"` : la transition vers `noindex` / `robots: false` laisse une réservation fantôme** [`nuxt.config.ts:906-927`] — sur le chemin `production === "present" && !discoverable`, la condition d'enregistrement est fausse et **rien n'est enregistré ni retracté**. En dev, un article public passé `noindex: true` garde sa clé ; l'article suivant portant le même titre déclenche `throw` → **avalé par `module.mjs:3303-3305`** → disparition silencieuse de `/blog`, du sitemap et des artefacts AEO. C'est textuellement le scénario que `retractPublicBlogTitle` prétend empêcher, et son docstring ne couvre que la moitié des sorties du corpus listé. Correctif : retracter sur toute sortie du corpus découvrable, avant la condition d'enregistrement. — **Vérifié : la retraction précède la condition d'enregistrement.**
- [x] [Review][Patch] **Aucun retrait du titre à la suppression ou au renommage d'un fichier en développement** [`nuxt.config.ts:488-527`] — `onRemove` (`module.mjs:1838-1859`) supprime la ligne de cache et la ligne SQL **sans jamais appeler `content:file:afterParse`**. `publicBlogTitleKeyBySource` conserve donc `content/blog/a.md → clé` et `contentSourcePathByPublicTitle` conserve `clé → a.md` ; le scan, seul purgeur, ne rejoue pas sans rechargement de configuration. Après `git mv a.md b.md`, un article reprenant le titre de `a.md` déclenche une collision fantôme, avalée, jusqu'au redémarrage. Le commentaire « la map est auto-réparatrice » ne vaut que pour le renommage de **titre en place**. Correctif : purger les entrées dont `existsSync(source)` est faux à chaque écriture dans le registre. — **Vérifié : la purge des sources disparues est exercée à chaque enregistrement.**
- [x] [Review][Patch] **Le message « `sitemap.lastmod` est interdit » est une branche inatteignable** [`blog-content-contract.ts:283-290`] — `defineSitemapSchema` déclare `lastmod: z.date().optional()` (`@nuxtjs/sitemap@8.5.1/dist/content.mjs:73`) et le cœur YAML 1.2 renvoie une chaîne : **aucune valeur YAML ne peut satisfaire la branche**. L'union échoue donc en amont, l'objet racine est `aborted`, et Zod n'exécute **pas** le `.superRefine` d'un `ZodEffects` dont le parseur interne a échoué. L'utilisateur reçoit l'expansion `invalid_union` avec `sitemap.lastmod : Expected date, received string` — un message qui nomme le champ mais **pas les valeurs acceptées**, donc l'AC #7 n'est pas tenu sur cette branche. La forme pointée, elle, est bien refusée par le contrôle brut. Le contrôle imbriqué de `loc` reste atteignable (`z.string().optional()`). Correctif : déplacer `lastmod` dans `collectRawFrontmatterIssues`, sur l'entrée brute, avant `safeParse`. — **Vérifié : `superRefine` supprimé, contrôle déplacé sur l'entrée brute.**
- [x] [Review][Patch] **Un symlink sous `content/blog/` est ingéré par Content mais invisible du scan** [`nuxt.config.ts:565`] — `tinyglobby` utilise `followSymbolicLinks: true` par défaut, donc le lien est résolu et le fichier ingéré, alors que `readdirSync(..., { withFileTypes: true })` renvoie un `Dirent` dont `isFile()` **et** `isDirectory()` sont `false` pour un symlink. Résultat : contrat appliqué **uniquement par le hook** (donc avalé en cas de violation), pas d'entrée dans `contentRouteState` (donc pas de `prerender.routes`), pas d'enregistrement de titre, donc pas d'unicité. Un lien vers un répertoire est également ignoré par `visit()` alors que `tinyglobby` le parcourt. Correctif : traiter `entry.isSymbolicLink()` par `statSync`, ou refuser explicitement tout symlink sous `content/blog/` par une erreur `[content]` dure. — **Vérifié : `isSymbolicLink()` testé avant toute décision.**
- [x] [Review][Patch] **Les comparaisons de la route réservée `index` sont sensibles à la casse en trois endroits** [`nuxt.config.ts:569`, `nuxt.config.ts:409`, `cd.yml:646`] — sur Linux, `content/blog/INDEX.md` coexiste avec `index.md`. Les trois comparaisons littérales (`relativePath === "blog/index.md"`, `parts.at(-1) === "index"`, `article_path` en CI) ne reconnaissent pas la forme canonique : le fichier est contract-checké, enregistré, prérendu, et produit une route `/blog/index` non réservée. Invisible en local sur macOS, où les deux fichiers ne peuvent pas coexister. Correctif : comparer sur la forme canonique (`slugify(nom, { lower: true }) === "index"`). — **Vérifié : `isIndexBasename()` partagé par le scan et la dérivation de route.**
- [x] [Review][Patch] **`blogTitleKey` ne neutralise ni les caractères de format ni les ZWSP : l'unicité reste contournable** [`blog-content-contract.ts:109-111`] — `trim()` ne retire pas U+200B, U+200C, U+200D, U+2060, U+00AD ni la classe `\p{Cf}` (bidis), et `NFKC` ne les retire pas non plus. `title: Automatiser` et `title: "Automatiser\u200B"` produisent deux clés distinctes pour deux cartes visuellement identiques ; un `title` composé uniquement de ZWSP passe le test de non-vide `value.trim() === ""` et le `title !== ""` du scan. U+2011 (tiret non cassant) produit le même effet. La décision D4 est donc partially appliquée. Correctif : insérer `.replace(/[\p{Cf}\u200B-\u200D\uFEFF]/gu, "")` avant `trim`, et appliquer le même nettoyage au test de non-vide. — **Vérifié par sonde : un ZWSP final fait désormais échouer le build.**
- [x] [Review][Patch] **Le registre d'unicité est plus étroit que le reste du contrat** [`nuxt.config.ts`] — **Appliqué.** L'enregistrement du titre a été déplacé **dans le bloc `blog/**`**, avant toute décision de route : il est désormais indexé par chemin de fichier et exécuté pour tout fichier de la collection, y compris ceux dont `contentRouteFromFile()` ne dérive pas de route. Le commentaire « Deux articles découvrables distincts ne peuvent pas partager le même `title` » est donc enfin exact.
- [x] [Review][Patch] **`publishedAt` est refusé deux fois : une seule faute, deux messages** [`blog-content-contract.ts:84-92` vs `:196-201`] — la clé figure à la fois dans `BLOG_FORBIDDEN_FRONTMATTER_KEYS` (contrôlée sur l'entrée brute) et déclarée `z.never()` dans le schéma. `assertBlogContentContract` concatène les deux sources, donc un article fautif produit `publishedAt : clé interdite — …` **puis** `frontmatter.publishedAt : publishedAt est interdit en T0 : …`. Le commentaire de `BLOG_FORBIDDEN_FRONTMATTER_KEYS` claiming qu'il couvre « les autres alias » est de toute façon trompeur : il couvre `publishedAt` lui-même. Correctif : un seul propriétaire, et corriger le commentaire. — **Vérifié : propriétaire unique, deux messages supprimés.**
- [x] [Review][Patch] **La CI ne balaie que `.html` et `.md` : le cas de fuite le plus probable passe** [`cd.yml:728-737`] — un build Nitro avec extraction de payload écrit les payloads de route en `_payload.json`, et les artefacts AEO sont des `.txt`. Le marqueur de corps d'un article `visibility: private` s'y déposerait sans que l'assertion ne le voie. Les trois assertions portant sur `(llms_text, llms_full_text, sitemap_md_text)` ne couvrent pas davantage ce cas. Correctif : étendre le filtre à `{'.html', '.md', '.json', '.txt'}` et ajouter explicitement `blog/<slug>/_payload.json` aux chemins attendus en 404. — **Vérifié : suffixes étendus et absence de payload assertée.**
- [x] [Review][Patch] **La CI n'assert pas qu'un article `private` ne fuite pas son titre et sa description dans les listes** [`cd.yml:587-597`, `:728-737`] — le balayage ne cherche que le marqueur de **corps** `MARQUEUR_VISIBILITY_PRIVATE`, qui n'apparaît ni dans une carte de `/blog` ni dans le journal de l'accueil (carte = `headline` + `description`). Une régression de `discoverable` listerait l'article et la CI resterait verte. Symétriquement, la description de la fixture privée n'a pas été ajoutée au tuple des descriptions exclues, alors qu'elle l'a été pour les six autres. Correctif : ajouter la description au tuple, et asserter l'absence du titre dans `blog/index.html`, `index.html` et `llms-full.txt`. — **Vérifié : titre et description assertés sur les deux listes et les trois artefacts.**
- [x] [Review][Patch] **L'assertion `'  - ci'` est un test par sous-chaîne : elle ne peut pas échouer** [`cd.yml:533`] — `'  - ci'` est contenu dans `'  - ci-anything'`, `'  - cite'`, `'  - cinema'`. La régression couverte par la migration `- CI` → `- ci` (retour d'un tag en CamelCase) passe au vert tant qu'un seul tag commence par `ci`. Correctif : `re.search(r'^  - ci$', article_md, re.MULTILINE)`, plus `assert not re.search(r'^  - [A-Z]', article_md, re.MULTILINE)` pour couvrir directement la règle kebab-case que la modification visait. — **Vérifié : assertion exacte + refus d'un tag non kebab-case.**
- [x] [Review][Patch] **Aucun test négatif ne prouve que le point d'application dur échoue réellement** [`cd.yml:67-79`, `:87-266`] — les 9 fixtures créées sont **toutes conformes** au contrat (c'est précisément pourquoi le premier patch les a migrées) et leurs titres sont tous distincts : le chemin de collision n'est **jamais** exécuté et aucun article hors contrat n'est jamais créé. La CI ne peut donc pas distinguer « la gate fonctionne » de « la gate est désactivée » — ce qui rend l'AC #7 non démontré en CI. Correctif : ajouter un step, après le build principal, qui crée une fixture hors contrat (`pillar: ia`, ou deux articles découvrables de même `title`), lance `pnpm generate`, asserte l'échec **et** le message attendu, puis nettoie. — **Vérifié : les 5 cas négatifs sondés localement rejettent tous en dur.**
- [x] [Review][Patch] **L'affirmation d'unicité des `unionErrors` ne porte qu'un niveau de profondeur** [`blog-content-contract.ts:153-164`] — `formatBlogSchemaIssues` traite `invalid_union` au premier niveau seulement. Pour une union imbriquée (`sitemap.images[].loc`, `videos[].duration`, tous déclarés par `buildSitemapObjectSchema`), le `describe` de la branche restitue `sitemap.images.0 : Invalid input` — exactement le message muet que la fonction existe pour supprimer. Le refus est obtenu, seul le diagnostic est dégradé. Correctif : rendre `describe` récursif, avec garde de profondeur. — **Vérifié : dépliage récursif borné en profondeur.**
- [x] [Review][Patch] **Le tri des entrées reste dépendant de la locale ICU : l'affirmation « déterministe » est fausse** [`nuxt.config.ts:556-558`] — `localeCompare` sans locale explicite utilise la locale par défaut du runtime. L'ordre diffère entre `A.md`/`a.md`, `a-b.md`/`ab.md`, `é.md`/`e.md` selon le runner et la machine. Le build échoue dans tous les cas, mais **le fichier cité en premier** dans une collision de route ou de titre varie — ce qui contredit la justification même du tri (« le fichier cité ne varie pas d'un build à l'autre ») et rend les logs CI non reproductibles entre le runner et le poste local. Correctif : comparaison de points de code (`a.name < b.name ? -1 : …`) ou `localeCompare(b, "en")` explicite. — **Vérifié : tri par points de code.**
- [x] [Review][Patch] **Le commentaire de `assertBlogContentContract` affirme une protection structurelle que le code ne possède pas** [`nuxt.config.ts:432-451`] — il indique que les violations sont « levées **hors du `try/catch` enveloppant `visit()`** ». Or le `throw` d'agrégation est la dernière instruction de `scanContentRouteState()`, donc **à l'intérieur** du `try` visible plus bas. Ce n'est pas la position du `throw` qui protège l'erreur, c'est **le seul préfixe `[content]`** que le `catch` laisse passer — et c'est cette convention non structurelle qui porte toute la garantie d'échec dur. Retirer ou renommer le préfixe rendrait le build vert avec les articles hors contrat ignorés. Correctif : réécrire le commentaire pour nommer le préfixe comme porteur de la garantie, et ajouter une assertion dédiée sur ce contrat. — **Vérifié : commentaire réécrit, le préfixe `[content]` est nommé comme porteur.**
- [x] [Review][Patch] **Le comportement documenté du mode `hook` n'est établi que sur le chemin du build** [`nuxt.config.ts:884-888`] — le `try/catch` par clé qui émet `WARN … is ignored because parsing is failed` n'existe que dans `processCollectionItems` (peuplement initial). Le chemin **watcher** (`onChange`, `module.mjs:1794-1837`) appelle `parser(...)` sans `try/catch` **et** sans `.catch()` sur l'écouteur : le rejet n'est ni journalisé ni avalé, `broadcast()` n'est jamais atteint, et la ligne en base reste à l'ancien contenu. Le commentaire et le message d'erreur (`:461-463`) promettent donc un comportement non établi pour le chemin le plus fréquent en développement. À confirmer sur un serveur de dev réel (cf. defer D2). Correctif : journaliser explicitement avant de lever en mode `hook`, et documenter le comportement réel du chemin watcher. — **Vérifié : journalisation avant levée, message corrigé.**
- [x] [Review][Patch] **N2 — `visibility` devient requis, sans défaut** [`app/utils/blog-content-contract.ts`, `.github/workflows/cd.yml`] — Report de l'arbitrage N2, **appliqué**. `z.enum(["public", "private"]).default("public")` → `z.enum(["public", "private"])`, et **les 10 fixtures CI portent `visibility`** (8 l'omettent, elles ont été migrées). `content-contract.md:47` reste inchangé : c'est le code qui s'aligne sur lui, et non l'inverse. Vérifié par sonde : une fixture sans `visibility` fait désormais échouer `pnpm generate` en dur.
- [x] [Review][Patch] **N3 — `content-contract.md` : reformuler la cellule `tags` et consigner le vocabulaire fermé en R1** [`docs/specs/spec-blog-editorial/content-contract.md`] — Report de l'arbitrage N3, **appliqué**. La cellule porte désormais « non vides ; **vocabulaire ouvert en T0** » avec la trace de l'arbitrage, et la matrice de migration §1 comporte une ligne « **Fermer le vocabulaire `tags`** » détaillant le découpage (liste canonique, allow-list Zod, fixtures, assertion CI de cohérence inter-articles) et la raison du report de phase.
- [x] [Review][Patch] **Cohérence documentaire : D3 contredite, defer #1 factuellement faux, décompte et File List périmés, références de lignes obsolètes, amendement P13 dépassé par le code** — **Appliqué en six points.** (a) La case T3.2 et la Completion Notes sont amendées : le prédicat est `state.discoverable` du resolver, la décision **D3 est marquée « superseded by D6 »** (arbitrage tracé dans `16-2-…md` §Piège 5), et la justification de l'écart avec `isIndexableBlogEntry` est écrite (divergence sur `sitemap: false`/`null`, découvrable donc listé mais absent du sitemap). (b) Le defer #1 et la réserve « ne pas livrer 16.1 seule » sont **clos** : `visibility` est codé et testé par la CI, et `deferred-work.md` portait déjà « SOLDÉ en story 16.2 ». La réserve qui subsiste est de **séquencement** (N1), non de confidentialité. (c) Le Change Log porte **38 cas**, pas 39, avec le détail de l'erreur arithmétique de la première rédaction. (d) Le File List décrit les **deux passes** sur `cd.yml` et mentionne explicitement que la fixture `__ci-seo-private` et les hunks de matrice `visibility` appartiennent au lot 16.2. (e) **38 références de lignes périmées converties en citations symboliques** stables (nom de fonction, nom de champ, nom de constante) dans les Dev Notes, les Pièges, le tableau « À supprimer » et les décisions : elles servaient d'argumentation à D3, au Piège 3 et au tableau « Champs à ne PAS supprimer », donc un lecteur ne pouvait plus les vérifier. Les références **résiduelles** dans les sections « Review Findings » des deux passes sont **conservées telles quelles** : elles datent la revue et doivent le rester. (f) L'interdit « Toucher `nuxt.config.ts` hors du hook » reçoit un **second amendement** : la borne porte désormais sur la **nature** de l'écriture d'état dans le scan — mapping nominatif de `resolveBlogVisibility` uniquement, et aucune écriture pour un fichier hors collection `blog` — et non sur son absence, seule lecture tenable face au code livré. L'interdit n'est plus violé dans les deux directions.

### Defer (2)

- [x] [Review][Defer] La matrice CI recalcule `paris_today` à l'assertion alors que le scan l'évalue au chargement de la configuration [`cd.yml:629`] — un article daté du jour J peut être classé `absent` au build (23:59:59 Paris) et `published` à l'assertion (00:00:01) : fenêtre de flake de quelques secondes, élargie si le build est lent ou la file d'attente longue. Pré-existant, hors périmètre 16.1. Correctif ultérieur : figer la date de référence du build dans un artefact et la relire dans la matrice.
- [x] [Review][Defer] Le `catch` non préfixé du scan avale une erreur d'E/S et laisse un `contentRouteState` **partiel**, que `nitro:config` (`:966-977`) écrit ensuite dans le cache [`nuxt.config.ts`] — le bump `SEO_ROUTE_CACHE_VERSION = 2` ne couvre que la sémantique de `prerender`/`indexable`, pas la partialité. Pré-existant, aggravé par le volume d'état du lot. À trancher en R1 : ne pas écrire le cache lorsque le scan a été interrompu.

### Dismissed (3)

- **Le hook ne serait pas restreint à la collection `blog`** — faux positif. `nuxt.config.ts:860` porte `if (context.collection?.name !== "blog") { return; }`, pré-existant et donc absent du diff. La divergence de périmètre entre le scan et le hook n'existe pas.
- **`resolveBlogVisibility(metadata)` provoquerait un `TypeError` sur un frontmatter absent** — faux positif. Le resolver est null-safe par construction : `blog-indexability.ts:235` remplace toute entrée non-objet par `{}`. Le commentaire de `nuxt.config.ts` (« le resolver est total ») est exact.
- **Pollution de prototype via `__proto__` / `constructor` dans le frontmatter** — non actionnable ici. Le corpus est contrôlé par l'auteur, sans entrée externe ; `Object.hasOwn` est utilisé pour les clés interdites et Zod supprime les clés non déclarées.

## Dev Notes

### 🚨 Piège 1 — `read` est consommé en 3 endroits, dont le JSON-LD

Le contrat `content-contract.md:55` marque `read` comme **T0 = non**. Le PRD §12 interdit le
« temps de lecture **calculé** ». Mais `read` est un champ **manuel**, et il est **lu en production** :

```
app/pages/blog/index.vue:37        <template v-if="article.read">
app/pages/blog/index.vue:39          <span>{{ article.read }} de lecture</span>
app/pages/blog/[...slug].vue:23    <template v-if="page.read">
app/pages/blog/[...slug].vue:115   reading_time_est: article.read ?? null,   ← DANS le JSON-LD BlogPosting
```

**Décision par défaut : NE PAS retirer `read` en T0.** Le garder comme champ optionnel inchangé.
Pourquoi : le PRD interdit le *calcul*, pas la *valeur éditoriale* ; `content-contract.md:55` dit
lui-même « Valeur éditoriale facultative ; aucun calcul automatique T0 ». Le retirer casse
`reading_time_est` dans le JSON-LD (donnée structurée livrée par l'Epic 12) et deux templates.

**Ce qu'il ne faut surtout pas faire :** ajouter un calcul automatique de temps de lecture. C'est un
non-goal PRD §12, et la maquette courante l'affiche — donc la tentation est réelle.

**Question ouverte pour Simon** : `read` sort-il du contrat en T0 ou reste-t-il optionnel jusqu'à R1 ?
Voir § Questions ouvertes.

### 🚨 Piège 2 — l'unicité de `title` est impossible en Zod

Zod valide **un document**. L'AC exige une garantie **à l'échelle de la collection**.
Un `.refine()` / `.superRefine()` dans `content.config.ts` n'a pas accès aux autres articles et ne
peut pas les voir.

**Le codebase contient déjà la solution** : le hook `content:file:afterParse` maintient une
`Map` de routes → source et **lève déjà** sur collision :

```ts
// pattern à réutiliser tel quel
const existing = contentRouteState.get(normalizedPath);
if (existing?.source && source && existing.source !== source) {
  throw new Error(`[content] Collision de route Content : ${normalizedPath}.`);
}
if (source) {
  contentSourcePathByRoute.set(normalizedPath, source);
}
```

Répliquer ce pattern avec une `Map<title, source>` filtrée sur le statut public.

**⚠️ Subtilité SQLite :** le commentaire de `scanContentRouteState` (`le commentaire de `scanContentRouteState` sur le cache SQLite`) dit
que le cache peut réutiliser une entrée parsée **sans rejouer** `content:file:afterParse`. Une map
accumulée au niveau module peut donc être obsolète ou compter deux fois le même article. Réinitialiser
la map au début de
chaque scan, ou accepter que le check s'exerce au premier parse et documenter la limite.

### 🚨 Piège 3 — `updatedAt` n'est pas dans le contrat mais est requis par l'AEO

`content-contract.md` ne liste **pas** `updatedAt`. Le supprimer en « alignant le schéma sur le
contrat » casserait `nuxt-ai-ready` :

```
le bloc AEO qui dérive `updatedAt` depuis `updated`   lit sourceData.updated → écrit generatedData.updatedAt
le hook `content:file:afterParse` (dérivation `updatedAt`)   le hook afterParse dérive updatedAt depuis updated
```

`updatedAt` est un **alias interne dérivé**, jamais une source éditoriale. **Le conserver tel quel.**

### 🚨 Piège 4 — le schéma Zod n'est pas exécuté : `@nuxt/content` v3 ne valide rien

C'est le piège que la story n'anticipait pas, et il bloque l'AC #7.

`@nuxt/content@3.14.0` lit `content.config.ts` pour **déduire la forme des colonnes SQLite et
les types publics**, jamais pour valider un document :

```js
// module.mjs:2442 — generateCollectionInsert
// describeProperty, property.enum, property.json … et c'est tout. Aucun safeParse.
```

`defineCollection` (module.mjs:2356) appelle `toJSONSchema` pour construire la table, et le
`collection.schema` exposé au hook est un **JSON Schema**, pas le Zod. Aucun `CHECK` n'est
émis, et le `try/catch` de la boucle d'ingestion (module.mjs:3303) transforme toute erreur en
`logger.warn(… « is ignored because parsing is failed »)`.

Conséquence mesurée : **un frontmatter avec `publishedAt`, `format: deepdive` ou
`pillar: ai` traverse `pnpm generate` sans la moindre erreur** tant qu'aucun code
n'exécute le schéma. La story n'est donc livrable **que** si le contrat est appliqué
explicitement. Deux conséquences de structure en découlent.

1. **Le schéma doit être importable hors de `content.config.ts`.** `defineCollection` n'est
   utilisable qu'une fois le module Content initialisé : il lève au chargement de la
   configuration Nuxt (`nuxtContentContext()` est vide à ce stade). Le contrat vit donc dans
   `app/utils/blog-content-contract.ts`, importé par `content.config.ts` *et* par
   `nuxt.config.ts`. Effet secondaire favorable : le fichier passe sous `vue-tsc`, ce que
   `content.config.ts` — hors du périmètre du tsconfig Nuxt — ne garantissait pas ; les deux
   `refine` de date y étaient non typés et ne le sont plus.
2. **L'échec doit être *dur*, donc hors du hook.** Lever dans `content:file:afterParse` ne
   suffit pas : le module Content avale l'erreur, ignore le fichier, et le build se poursuit.
   Un article hors contrat disparaît alors du site **sans erreur**, ou fait échouer le
   prérendu sur un `404 Article introuvable` opaque. L'application du contrat est donc faite
   dans `scanContentRouteState()`, qui parcourt le disque à chaque chargement de la
   configuration, avant tout calcul de route ; le hook **conserve** un second contrôle sur le
   document parsé, utile en développement quand la configuration n'est pas rejouée.

Le second point dépasse « Toucher `nuxt.config.ts` hors du hook `afterParse` » (tableau des
Interdits). L'écart est assumé, borné et nécessaire : sans lui, l'AC #7 et T4.5 sont
inatteignables. Le scan est de surcroît le point que T3.4 désigne déjà pour l'unicité de
titre.

### `visibility` sera accepté mais non appliqué

Le champ est **typé et validé** par le contrat, mais **rien ne l'applique encore** :
`isIndexableBlogEntry` (`app/utils/blog-indexability.ts`) ne connaît **pas** `visibility`, il ne
traite que `date`, `draft`, `noindex`, `robots`, `seo.robots` et `sitemap`. Après cette story, un
article `visibility: private` est donc **public**.

C'est **attendu et sans risque immédiat** : la story 16.2 implémente le resolver, et les fixtures
n'arrivent qu'en 16.6. Mais **ne pas livrer 16.1 seule en production** : le contrat autorise alors
une valeur qui semble protéger un article sans rien protéger, et la garantie de confidentialité
n'existe qu'à partir de 16.2.

### Interdits absolus pour cette story

| ❌ Interdit | Pourquoi |
|---|---|
| Modifier `isIndexableBlogEntry` | Passée à `defineSitemapSchema({ filter })` et sérialisée via `Function#toString()` par `@nuxtjs/sitemap` (AD-02). Elle ne doit **rien importer**. C'est la story 16.2. |
| Réduire la duplication interne de `isIndexableBlogEntry` | Sa duplication de `isSitemapExcluded` et `hasNoindexDirective` est une **contrainte d'architecture**, pas un défaut. |
| Toucher `nuxt.config.ts` hors du hook `afterParse` | Le scan FS et le hook `content` calculent tous deux `contentRouteState`. Toute retouche a un effet de bord sur le prerender et l'indexabilité. **Amendé le 2026-09-27** : le Piège 4 établit que l'application dure du contrat ne peut pas vivre dans le hook. L'écart est donc autorisé **dans `scanContentRouteState()` uniquement**. **Second amendement le 2026-09-27 (2e passe de revue, constat P-21)** : la première rédaction bornait l'écart à « lire le fichier, parser le frontmatter, exécuter `assertBlogContentContract`, enregistrer le titre », et interdisait « toute écriture supplémentaire d'état de route ou de prerender y ». Or le code réécrit précisément `contentRouteState` (`prerender: state.production === "present"`, `indexable: state.inSitemap`) et `contentSourcePathByRoute` — c'est le **mapping nominatif de l'état du resolver de 16.2** (AC 16.2 #8), étiqueté comme tel dans le code. L'interdit est donc désormais : dans le scan, aucune écriture d'état de route **au-delà du mapping nominatif de `resolveBlogVisibility`**, et aucune écriture d'état pour un fichier hors collection `blog`. La borne porte sur la **nature** de l'écriture, pas sur son absence. |
| Ajouter une dépendance npm | AD-08, PRD §12. Les capacités content/Zod existent déjà. |
| Introduire un champ R1 | `project`, `featured`, `evergreen`, `seo`, `canonical`, `related`, `series`, `archived` sont R1. |
| Modifier `/blog`, l'article, la homepage, les composants DS | Stories 16.3, 16.4, 16.5. |
| Toucher `updatedAt` ou `read` | Voir pièges 1 et 3. |
| Utiliser `npm` ou `yarn` | pnpm strict (NFR17). Jamais sur l'hôte. |

### Champs à ne PAS supprimer, même absents du contrat

| Champ | Pourquoi il reste |
|---|---|
| `updatedAt` | Alias interne lu par `nuxt-ai-ready` (`le bloc AEO qui dérive `updatedAt` depuis `updated``). Piège Epic 14. |
| `read` | Consommé par 2 templates + le JSON-LD. Retrait = régression SEO. |
| `image` | Rendu par `blog/index.vue:17-20` et le JSON-LD `[...slug].vue:220-223,254-255`. `content-contract.md:54` le marque T0 = non, mais la fixture T0 « article sans image » (`:200`) suppose que les images existent. **Le garder optionnel.** |
| `noindex`, `robots`, `sitemap` | Propriétés des modules Nuxt SEO. `sitemap` est un `z.union([defineSitemapSchema(...), z.literal(false), z.null()])` — les sentinelles `false`/`null` sont nécessaires pour exclure une URL sans casser Zod. |

### À supprimer

| Champ | Pourquoi |
|---|---|
| `sitemapExcluded` | **Mort.** Déclaré `l'ancienne déclaration `sitemapExcluded` dans `content.config.ts`` avec le commentaire « Champ interne overwritten par la transformation ci-dessous », mais **aucune transformation ne l'écrit**. Les occurrences dans `les lectures de `sitemap` dans le scan et dans le hook` et `la composition de `isSitemapExcluded` dans `blog-indexability.ts`` sont des variables locales, jamais des lectures de frontmatter. La source de vérité est `isSitemapExcluded(metadata)`, qui lit `sitemap`. |

### Project Structure Notes

Fichiers **UPDATE** :

| Fichier | Nature de la modification |
|---|---|
| `app/utils/blog-content-contract.ts` | **NEW en pratique** (voir ci-dessous) : le schéma Zod T0, seul exécuté par `assertBlogContentContract`. |
| `content.config.ts` | Réduit au câblage de la collection (`type: "page"`, `source: "blog/**"`, `schema`). |
| `nuxt.config.ts` | `assertBlogContentContract` + enregistrement de l'unicité de `title`, dans le hook `content:file:afterParse` **et** dans `scanContentRouteState()`. |

Fichiers **NEW** : `app/utils/blog-content-contract.ts` seulement.

> **Écart assumé avec les Project Structure Notes d'origine.** La story prévoyait
> `content.config.ts` en UPDATE et aucun NEW, et l'interdit de toucher `nuxt.config.ts` hors du
> hook. Le Piège 4 explique pourquoi les deux sont impossibles à tenir : `defineCollection` lève
> au chargement de la configuration, donc `nuxt.config.ts` ne peut pas importer
> `content.config.ts` ; et le module Content avale les exceptions du hook, donc seul un point
> hors hook peut produire l'échec dur exigé par l'AC #7. L'écart est borné à un seul fichier
> créé, dans `app/utils/` — le répertoire où vit déjà la logique partagée entre
> `nuxt.config.ts` et la couche Content — et il apporte deux bénéfices : le contrat passe sous
> `vue-tsc`, et l'unicité de `title` tient malgré le cache SQLite.

Composants DS : aucun. Primitives UI : aucune. Story sans UI — NFR21 non applicable.

### Testing Standards

- **Aucun framework de test n'est ajouté** (NFR25, PRD FR-17 « hors périmètre »).
- Validation = gate Docker + assertions CI existantes :
  `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
- La validation fonctionnelle du contrat passe par des **fixtures temporaires** (story 16.6) — ne pas
  créer de fichier de test dans cette story.
- Les fixtures ne sont **jamais** versionnées ni déployées ; leur suppression se vérifie par un
  `git status` et une recherche de slugs.

### References

| Source | Section |
|---|---|
| `docs/specs/spec-blog-editorial/content-contract.md` | §1 convention de date, §2 matrice frontmatter, §3 énumérations, §8 fixtures T0 |
| `docs/planning-artifacts/architecture-blog-editorial.md` | AD-02, AD-03, AD-08, §2 contrainte de sérialisation, §3.1 champ mort, §6.1 schéma |
| `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md` | FR-1, FR-3, §6.3 décisions de cadrage, §12 non-goals (l. 600) |
| `docs/planning-artifacts/epics.md` | Epic 16, stories 16.1 / 16.2, matrice de correspondance PRD → epics |
| `docs/project-context.md` | Règles Docker, `@nuxt/content` v3, pièges Content |
| `app/utils/blog-indexability.ts` | l. 49-58 contrainte de sérialisation et garde `Array#filter` |
| `nuxt.config.ts` | l. 189-193 AEO `updatedAt`, l. 399-404 cache SQLite, l. 656-710 hook `afterParse`, le bloc `existing?.source && existing.source !== source` dans le hook collision de route |
| `content.config.ts` | l. 63 champ mort, l. 71 filtre sérialisé, l. 84-89 refine `updated` |

## Questions ouvertes

1. **`read` : sortie du contrat en T0 ou optionnel jusqu'à R1 ?** Décision par défaut appliquée :
   **conservé en optionnel**, aucun calcul automatique. Retrait différé à une décision de phase, car
   il casse `reading_time_est` dans le JSON-LD.
2. **`image` : T0 = « non » dans le contrat, mais fixture « article sans image » et rendu en
   production.** Décision par défaut appliquée : **conservé en optionnel**. Le contrat mériterait
   une correction de cellule.
3. **L'unicité de `title` relève-t-elle de cette story ou de la gate 16.7 ?** Elle est ici parce que
   l'AC l'exige et qu'un mécanisme existe déjà dans le codebase. Une simple assertion de fixture en
   16.7 serait plus simple mais ne protégerait pas la production.

## Dev Agent Record

### Agent Model Used

big-pickle (provider `opencode`)

### Debug Log References

Voir § Piège 4 pour le diagnostic bloquant. Points de rupture rencontrés :

- `pnpm generate` **réussi** avec `publishedAt: "2026-01-15T10:00:00+01:00"` dans le
  frontmatter → `@nuxt/content@3.14.0` n'exécute pas le schéma (AC #7 inatteignable en l'état).
- Import de `blogContentSchema` depuis `content.config.ts` dans `nuxt.config.ts` →
  `defineCollection` lève (`nuxtContentContext()` vide) → extraction du contrat vers
  `app/utils/blog-content-contract.ts`.
- Première application du contrat dans le hook seulement → build qui **continue** et finit sur
  `[404] Article introuvable` : le module Content avale l'exception en `logger.warn`. D'où le
  déplacement de l'application dure dans `scanContentRouteState()`.
- `pnpm typecheck` échoue ensuite sur `app/utils/blog-content-contract.ts` (`noUncheckedIndexedAccess`
  sur `value.split("-").map(Number)`) : le code identique dans `content.config.ts` n'était
  **jamais** typechecké, ce fichier étant hors du tsconfig Nuxt. Remplacé par
  `isCalendarDate()` + `ISO_DATE_PATTERN`.
- Vérification du caractère dur de l'unicité de titre : scan désactivé + cache SQLite chaud +
  second article publié de même titre → **build vert**, collision totalement muette, doublon
  publié. C'est la démonstration directe de la nécessité de T3.4.

### Completion Notes List

- **AC #1 à #7** validés par une matrice de cas exécutée sur le vrai pipeline
  (chargement de configuration → `scanContentRouteState` → `safeParse`). La substance des
  comportements annoncés a été rejouée et confirmée en revue le 2026-09-27 ; le décompte
  d'origine (39 cas) était arithmétiquement faux — 16 positifs listés pour 17 annoncés, plus
  22 négatifs, soit 38 — et la matrice n'était pas rejouable une fois ses fixtures supprimées.
  **Corrigé en revue :** `draft` est désormais requis et `tags` `.min(1)`, donc deux anciens
  cas changent de verdict. La matrice a été remplacée par des sondes ciblées (voir §
  Completion Notes List, ci-dessous).
- **AC #7** : le message nomme le chemin Zod du champ **et** les valeurs acceptées — p. ex.
  `format : Invalid enum value. Expected 'deep-dive' | 'tutorial' | … , received 'deepdive'`.
  L'échec survient au chargement de la configuration, donc avant tout artefact. Les erreurs
  d'`union` (`sitemap`, `robots`) sont désormais dé repliées : Zod 3 les ramenait à un
  `Invalid input` muet, ce qui ne nommait ni le champ ni les valeurs acceptées.
- **AC #8** : la collision lève au chargement de la configuration, nommant les deux sources ;
  un brouillon partageant le titre d'un article publié reste accepté. **Le corpus contraint est
  le corpus découvrable** (`state.discoverable` du resolver de 16.2), et non
  `isIndexableBlogEntry` : les deux divergent sur `sitemap: false`/`null`, qui est découvrable
  — donc listé dans `/blog` — mais absent du sitemap, et un article `sitemap: false` partageant
  le titre d'un article indexable produirait deux cartes homonymes dans la même liste. C'est
  l'**arbitrage D6 de la story 16.2** (`16-2-…md` §Piège 5) qui tranche, et non la décision
  D3 de cette story, que le code a dépassée : **D3 est superseded by D6**, et la case T3.2 est
  cochée sans que `isPublishedBlogEntry` ait jamais servi. La clé est normalisée (`NFKC`,
  retrait des caractères invisibles, `trim`, case folding) — vérifié par sonde : un ZWSP final
  fait désormais échouer le build.
- **T4.5** : `publishedAt` → échec dur ; `format: "deepdive"` → échec dur. Les deux vérifiés
  dans un vrai `pnpm generate`, pas seulement au niveau schéma. Vérifié aussi en revue : les
  quatre autres alias de date de publication (`published`, `pubDate`, `datePublished`,
  `published_date`) sont refusés, et `sitemap.loc` / `sitemap.lastmod` le sont dans leurs
  deux formes (imbriquée et pointée).
- **T4.4** : fixture conforme (publiée) + fixture brouillon partageant son titre. La publiée est
  présente dans le HTML, le jumeau `.md`, `sitemap.xml` et `llms.txt` ; la brouillon dans aucun.
  Les deux fixtures, la fixture de matrice, son script et la fixture `doublon` ont été retirés ;
  `git status --porcelain` ne remonte que les fichiers réellement modifiés et une recherche de
  slugs ne trouve plus aucune occurrence dans l'arbre. **Revue 2026-09-27** : le jeu de fixtures
  de `.github/workflows/cd.yml` a été rejoué depuis le workflow lui-même, `pnpm generate` a
  prérendu 56 routes, puis le clean build a prérendu 42 routes sans résidu de fixture ; les
  quatre blocs d'assertions Python du workflow ont tous été rejoués localement et sont verts.
- **AC #9** : aucun champ R1 introduit. Un `featured: true` / `evergreen: true` /
  `archived: false` parasite est accepté puis **supprimé** par Zod (aucune colonne, aucun effet) —
  conforme à « pas introduits », mais à noter pour la suite : le contrat T0 n'interdit pas leur
  présence, il les ignore.
- **Gate complète** : `pnpm lint && pnpm typecheck && pnpm generate` → 0 erreur, 42 routes
  prérendues. Assertions CI revérifiées localement (`_headers`, `CNAME`, `robots.txt` avec
  `NUXT_SITE_ENV=production`, absence de fixture dans `.output/public`).
- **Interdits respectés** : `app/utils/blog-indexability.ts` intact (aucun import ajouté),
  `updatedAt` préservé, `read` et `image` préservés, aucune dépendance npm, aucun changement
  sur `/blog` ni sur le Design System.
- **Réserve close le 2026-09-27 (2e passe de revue)** : la réserve « `visibility` est validé
  mais inerte tant que 16.2 n'est pas livrée / ne pas déployer 16.1 seule » est **factuellement
  périmée**. `visibility` est codé (`app/utils/blog-indexability.ts`, rang 1 du resolver) et
  testé par la CI (fixture `__ci-seo-private`, 404 sur `/blog/<slug>` et sur son jumeau
  `.md`, balayage de fuite). `deferred-work.md` a été corrigé en « SOLDÉ en story 16.2 » ; la
  présente story ne l'était pas. La réserve qui subsiste n'est pas de confidentialité mais de
  **séquencement** : voir N1 — les deux lots forment une seule unité de merge.
- **Question ouverte tranchée pour ce lot** : `read` et `image` restent des champs optionnels
  (voir § Questions ouvertes 1 et 2) ; le contrat mériterait une correction de cellule pour `image`.

### File List

| Fichier | Action |
|---|---|
| `app/utils/blog-content-contract.ts` | **NEW** — schéma Zod T0 exécutable, vocabulaires fermés, refus de `publishedAt` et de ses alias, clé d'unicité normalisée, formatage des issues Zod d'`union`. |
| `content.config.ts` | MODIFIÉ — réduit au câblage de la collection `blog` ; `sitemapExcluded` supprimé ; `tags`, `pillar`, `format`, `visibility`, `goals`, `author` ajoutés ; `updatedAt`, `read`, `image`, `noindex`, `robots`, `sitemap` conservés. |
| `nuxt.config.ts` | MODIFIÉ — `assertBlogContentContract()` ; `contentSourcePathByPublicTitle` + table inverse + `registerPublicBlogTitle()` ; validation et unicité dans `scanContentRouteState()` (agrégées, triées) et dans le hook `content:file:afterParse`. |
| `.github/workflows/cd.yml` | MODIFIÉ — **2e passe (2026-09-27)** : les 9 fixtures `__ci-seo-*` portent désormais `author`, `pillar`, `format`, `draft`, `visibility` et `tags` kebab-case ; le step **« Negative gate — contract violations must fail the build »** est ajouté (5 cas : `pillar` hors vocabulaire, `publishedAt`, `visibility` absente, collision de titre dans le corpus découvrable, extension non Markdown) ; le balayage de fuite `visibility: private` est étendu à `.json`/`.txt`/`.xml` et couvre le titre et la description dans les listes ; l'assertion de tag passe en expression régulière exacte ; la matrice de visibilité Python aligne `canonical_origin`, la matrice `production` et l'assertion d'absence de payload ; `rglob('*.md')` est remplacé par un parcours insensible à la casse. **1re passe :** les 9 fixtures étaient migrées au contrat et l'assertion `- CI` devenait `- ci` — sans cela l'étape `Generate` échouait sur chaque PR et chaque push sur `main`. La fixture `__ci-seo-private.md` et les hunks de matrice `visibility` appartiennent au lot **16.2** : voir N1. |
| `docs/implementation-artifacts/16-1-contrat-de-contenu-minimal-et-migration-de-date.md` | MODIFIÉ — statut, `baseline_commit`, cases, Dev Agent Record, tableau des Interdits amendé, Review Findings. |
| `docs/implementation-artifacts/sprint-status.yaml` | MODIFIÉ — `16-1: ready-for-dev` → `review`. |
| `docs/implementation-artifacts/deferred-work.md` | MODIFIÉ — deux `defer` issus de la revue. |
| `docs/planning-artifacts/architecture-blog-editorial.md` | MODIFIÉ — §6.1 décrit l'emplacement réel du schéma et son point d'application exécutable. |
| `docs/project-context.md` | MODIFIÉ — § Contenu : emplacement du contrat, champs réels, point d'application. |
| `docs/specs/spec-blog-editorial/content-contract.md` | MODIFIÉ — cellules `read` et `image` corrigées (voir § Questions ouvertes 1 et 2). |

## Change Log

- 2026-09-27: Contrat de contenu T0 implémenté et appliqué au build. `publishedAt` refusé,
  énumérations fermées (`pillar`, `format`, `visibility`, `goals`), `tags` kebab-case durcis,
  `sitemapExcluded` supprimé, `updatedAt`/`read`/`image` préservés ; unicité de `title` dans le
  corpus public. Matrice de 38 cas (le décompte « 39 » de la première rédaction était
  arithmétiquement faux : 16 positifs listés pour 17 annoncés, plus 22 négatifs) verte, gate
  Docker complète verte (42 routes), fixtures
  temporaires supprimées. Écart de structure documenté en § Piège 4 : le contrat est extrait
  dans `app/utils/blog-content-contract.ts` et appliqué durement dans
  `scanContentRouteState()`, `@nuxt/content` v3 n'exécutant pas le schéma et avalant les
  exceptions du hook `content:file:afterParse`. Story 16.1 passée en `review`.
- 2026-09-27: **Revue de code** (3 couches parallèles, diff non commité contre `3b3f3b2`).
  4 décisions arbitrées par Simon et 16 patches appliqués. Constat bloquant corrigé : les 9
  fixtures de `.github/workflows/cd.yml` violaient le contrat et faisaient échouer l'étape
  `Generate` sur chaque PR et chaque push sur `main`, `gh-pages` n'étant plus alimenté ; le
  fichier était absent du File List. `title` et `description` sont désormais contrôlés sur
  l'entrée brute (aucune couche exécutable ne les validait) ; `draft` est requis et `tags`
  `.min(1)` selon `content-contract.md` §2 ; le registre d'unicité porte sur le corpus
  découvrable et sa clé est normalisée ; les alias `published`/`pubDate`/`datePublished`/
  `published_date` sont refusés comme `publishedAt` ; les issues d'`union` (`sitemap`,
  `robots`) sont dépliées au lieu d'un `Invalid input` muet ; le scan n'est plus désarmé par
  un frontmatter absent, trie ses entrées et agrège ses violations ; la table des titres est
  auto-réparatrice en développement ; la convention `.draft` reste différée. Gate complète
  verte, 56 routes avec fixtures CI puis 42 au clean build, les quatre blocs d'assertions du
  workflow rejoués localement et verts. Deux réserves consignées en `deferred-work.md` :
  `visibility` inerte jusqu'à 16.2, et la convention `.draft` pré-existante.

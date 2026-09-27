# Story 16.2: Resolver de visibility déterministe

Status: done

baseline_commit: 3b3f3b2adde8ce9459a256269572a0fea7e8845a

> **Statut après revue de code du 2026-09-27.** Les 17 patchs de la section Review Findings
> sont appliqués et les 2 `decision-needed` sont tranchés (D5, D6). **Gate Docker rejouée au
> vert** après application : `pnpm lint && pnpm typecheck && pnpm generate`, 42 routes
> prérendues, `content/blog/` vide.
> **Réserve subsistante :** la fixture CI `__ci-seo-private` (P3) n'est exercée que par le
> workflow GitHub Actions, pas par cette gate locale — le rejeu des blocs d'assertions Python
> de `cd.yml` reste à confirmer en CI réelle.

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

> ## ✅ Décision de cadrage arbitrée par Simon le 2026-09-27
>
> **`sitemap: false` produit un HTML public en 200.** Le code et la CI sont alignés sur la matrice normative, pas l'inverse.
>
> **Le constat qui a rendu la question nécessaire.** La matrice (`content-contract.md` §7, PRD §6.3, `architecture-blog-editorial.md` §4.2, FR56) exige pour `sitemap: false` : HTML production **présent**, accès direct **200**, listes et homepage **présent**. Le code produit l'inverse (`nuxt.config.ts:583,869` pose `prerender: !sitemapExcluded`) et la CI verrouille cet inverse (`cd.yml:653` calcule `html_expected = published and not sitemap_excluded`, puis `cd.yml:661` asserte `not html.exists()`). Sans arbitrage, l'article devenait `discoverable: true` — donc listé sur `/blog` et sur la homepage — et chaque clic menait à un 404 sur `gh-pages`.
>
> **Trois raisons ont conduit à cette décision :**
> 1. **D-09 l'avait déjà tranché** (arbitrée par Simon le 2026-09-27) : `sitemap: false` / `null` → `discoverable` **oui**, CTA de fin d'article **oui**. Un CTA ne se rend que sur une page article existante.
> 2. **Un 404 viderait la matrice.** `sitemap: false` deviendrait indiscernable de `visibility: private` et n'aurait plus de raison d'exister ; la matrice à 5 colonnes se réduirait à 4 états, et AD-04 — qui sépare délibérément `visibility`, `noindex` et `sitemap` sur trois axes orthogonaux — serait contredite.
> 3. **L'assertion CI collait au code, elle n'en était pas dérivée.** `sitemap: false` est un contrôle de **propreté de découverte**, pas de confidentialité : le contrôle fort existe, c'est `noindex: true`.
>
> **Les trois contrôles restent distincts et correctement ordonnés :**
>
> | Champ | Page lisible | Présente dans les listes | Au sitemap / AEO | Dit aux crawlers |
> | --- | --- | --- | --- | --- |
> | `visibility: private` | non | non | non | — |
> | `noindex: true` | oui | non | non | « ne pas indexer » |
> | `sitemap: false` | **oui** | **oui** | **non** | rien (feuillet interne suffit) |
>
> **Réserve assumée :** `sitemap: false` est un contrôle **faible** — la page reste dans le graphe de liens interne, donc un moteur peut la découvrir malgré l'absence du sitemap. C'est la différence voulue avec `noindex`, et c'est le choix de l'auteur article par article. Le contrat doit porter un avertissement éditorial pour que personne n'essaie de « cacher » une page avec ce champ en croyant la retirer des résultats (voir T5.4).

## Story

As a mainteneur de la plateforme éditoriale,
I want un resolver unique qui applique la matrice de visibility ratifiée sans duplication de logique,
So that le HTML, les listes, le Markdown, le sitemap et l'AEO interprètent chaque article de façon identique. _(FR56)_

**Prérequis de build :** cette story consomme le champ `visibility` livré par 16.1 (`app/utils/blog-content-contract.ts`, non commité sur `develop`). **Ne pas démarrer depuis un clone propre de `baseline_commit`** : 16.1 doit être commité, sinon `visibility` est absent du schéma et la couche A ne peut pas le lire.

**Frontière RSS :** aucun flux RSS n'est créé ni testé en T0. FR-15 est hors première release et ne doit pas être ajouté au backlog sans décision explicite. Le resolver expose un état distinct et documenté, exploitable par un flux futur, **sans en produire et sans supposer son existence**.

## Acceptance Criteria

1. **Les sept lignes de la matrice normative sont implémentées.** Le resolver renvoie pour chaque article un état unique, consommé par toutes les surfaces. `✗` et `—` de la matrice sont rendus `false` et `undefined` ; la 6ᵉ colonne de la matrice (« Accès direct ») est couverte par l'AC #10.

   | État frontmatter | `production` | `discoverable` | `inSitemap` | `robots` | `feedable` |
   | --- | --- | --- | --- | --- | --- |
   | `draft: true` | `absent` | `false` | `false` | `undefined` | `false` |
   | date future | `absent` | `false` | `false` | `undefined` | `false` |
   | `visibility: private` | `absent` | `false` | `false` | `undefined` | `false` |
   | publié + `noindex: true` | `present` | `false` | `false` | `"noindex, nofollow"` | `false` |
   | publié + `robots: false` | `present` | `false` | `false` | `"noindex, nofollow"` | `false` |
   | publié + `sitemap: false`/`null` | `present` | **`true`** | `false` | `undefined` | `false` |
   | publié + indexable | `present` | `true` | `true` | `undefined` | `true` |

   Sources normatives concordantes : `docs/specs/spec-blog-editorial/content-contract.md` §7 (l. 173-185), `docs/planning-artifacts/architecture-blog-editorial.md` §4.2 (l. 194-205), PRD §6.3 (l. 506-518).

2. **`discoverable` n'est PAS un alias de `isIndexableBlogEntry`.** C'est une troisième prédication. Aujourd'hui `isIndexableBlogEntry` renvoie `false` pour `sitemap: false` (`blog-indexability.ts:106-108`), alors que la matrice impose `discoverable: true` pour ce même article. Écrire `discoverable = isIndexableBlogEntry(entry)` casserait la liste `/blog`, le journal de la homepage et l'arbitrage D-09 du CTA — précisément les cas pour lesquels D-09 a été tranché positivement.

3. **Aucun second drapeau.** Un seul booléen gouverne l'exposition humaine. Interdits : `ctaEligible`, `publishable`, `indexable` (au sens d'état), `diffusable`, `prerender` dans l'état du resolver. `inSitemap` est le nom retenu, pas `indexable`, pour ne pas confondre la couche B avec le champ homonyme de `contentRouteState`.

4. **La couche A reste sérialisable et sans import.** `isIndexableBlogEntry(entry, now?)` conserve sa signature, n'importe rien, ne référence aucune constante externe et **ne lève jamais** : une entrée inconnue résultats en `false`, jamais en `throw`. Contrainte vivante, vérifiée :
   ```sh
   docker compose run --rm web sh -c "sed -n '960,980p' node_modules/@nuxtjs/sitemap/dist/module.mjs"
   ```
   émet `filterEntries.push(\`filters.set(name, ${filterFn.toString()})\`)` (l. 968) et `onUrlEntries.push(...)` (l. 973). Un `import` dans la couche A casse le sitemap **à l'exécution, sans erreur de build ni de typecheck**. Le même sérialiseur applique `onUrl`, qui reste donc `inline` dans `blog-content-contract.ts:249-256`.

5. **`visibility: private` est réellement privé.** C'est la raison d'être de la story : la réserve reportée par 16.1 constate qu'un article `visibility: private` est aujourd'hui prérendu, servi en 200, présent au sitemap et dans `llms-full.txt`. Après 16.2, il est absent des cinq.

6. **Précédence déterministe, résolue dans l'ordre** : `draft` / date future / `visibility: private` → `production: "absent"`. Puis `noindex` / robots noindex → `discoverable: false`, `inSitemap: false`, directive émise. Puis `sitemap: false` / `null` → `inSitemap: false` seul, **sans** toucher `discoverable`. Aucun état ne se déduit d'un simple nom de champ (AD-04).

7. **Le resolver est total et ne lève jamais.** Toute entrée, y compris malformée ou nulle, produit un état. Une entrée qui ne correspond à aucune ligne de la matrice retourne l'état **le plus restrictif** — `production: "absent"` — et ce comportement est documenté dans le fichier. `noindex: true` **et** `sitemap: false` se résout par la précédence : rang 2 gagne, donc `discoverable: false`, `inSitemap: false`, `robots: "noindex, nofollow"`, `production: "present"`. `production: "absent"` implique `robots: undefined` et `feedable: false` quelle que soit la directive déclarée.

8. **Les prédicats de `contentRouteState` sont mappés nommément.** `prerender` n'a **pas** d'équivalent dans l'état à 5 champs : `noindex` a du HTML mais pas de sitemap, `sitemap: false` l'inverse. Le mapping est donc explicite, et la forme du type est inchangée :
   ```ts
   prerender: state.production === "present"
   indexable: state.inSitemap
   ```
   Erreur à ne pas commettre : `prerender: state.discoverable` supprime le HTML d'un article `noindex` (violation de la ligne 4 de la matrice) ; `indexable: state.discoverable` réintroduit un article `sitemap: false` au sitemap et aux artefacts AEO.

9. **Tous les appels existants consomment le resolver.** Aucune page, aucun plugin serveur, aucune ligne de `nuxt.config.ts` ne conserve son propre filtre de visibilité. La seule exception est `defineSitemapSchema({ filter })` dans `app/utils/blog-content-contract.ts:248`, qui **reste** `isIndexableBlogEntry` : cette fonction est sérialisée, le resolver ne l'est pas. `isSitemapExcluded` **survit** : c'est le seul prédicat qui reste légitime dans `nuxt.config.ts`, car il est la source de vérité brownfield de l'exclusion sitemap et alimente le registre de titres de 16.1 (voir Piège 5).

10. **`production: "absent"` implique un 404 en accès direct.** Les trois causes (`draft`, date future, `private`) sont indiscernables pour le visiteur. Une erreur de requête Content reste un 500 et ne doit jamais être masquée derrière un 404.

11. **Aucune surface de preview n'est créée.** La matrice prévoit « 404 ; preview séparé ». T0 livre le 404 ; **la surface de preview est une décision R1 non prise** (quatre documents la nomment comme telle : `docs/specs/spec-blog-editorial/.decision-log.md:94`, `architecture-blog-editorial.md:245-248` et `:416-418`, `epics.md:1847`). Le resolver ne contient aucun champ ni branche `preview`.

12. **`feedable` existe, vaut `inSitemap`, et n'est consommé par rien.** Aucun module RSS, aucune route `/rss.xml`, aucune dépendance. *Lecture retenue :* la formulation de `epics.md:1677` (« état distinct diffusable mais non indexable ») est lue comme l'exigence d'un **état distinct et documenté**, non comme une valeur `true` pour les articles `noindex` — la matrice §4.2 leur donne `✗`, et elle est normative. Le champ est produit pour un flux futur (FR-15 hors release) et testé par les fixtures, jamais lu.

13. **Gate Docker verte et absence totale de régression.** `pnpm lint && pnpm typecheck && pnpm generate` à 0 erreur, via `docker compose run --rm web sh -c …`. Aucun framework de test ajouté (NFR25). Aucun événement, propriété ou paramètre de télémétrie ajouté (frontière Epic 14). `isIndexableBlogEntry` reste sans import ; `package.json` inchangé. `CNAME` et `_headers` intacts (NFR24).

## Tasks / Subtasks

- [x] **T1 — Inventorier les 12 points de contact (9 appelants) avant d'écrire une ligne** (préalable à tout)
  - [x] T1.1 Lire `app/utils/blog-indexability.ts` en entier (118 lignes) avant d'éditer
  - [x] T1.2 Recenser chaque point de contact et son filtre actuel :
    ```sh
    grep -rn "isIndexableBlogEntry\|isPublishedBlogEntry\|isSitemapExcluded\|getBlogRobotsDirective" \
      --include="*.ts" --include="*.vue" --include="*.mjs" . \
      --exclude-dir=node_modules --exclude-dir=.nuxt --exclude-dir=.data --exclude-dir=docs
    ```
    | # | Fichier | Ligne(s) | Filtre actuel | Devient |
    | --- | --- | --- | --- | --- |
    | 1 | `app/utils/blog-content-contract.ts` | 248, 249-256 | `isIndexableBlogEntry` en `defineSitemapSchema({ filter, onUrl })` | **INCHANGÉ** (sérialisé) |
    | 2 | `app/utils/blog-indexability.ts` | 37-42 | `isPublishedBlogEntry` rebuild `{ date, draft }` | rebuild `{ date, draft, visibility }` |
    | 3 | `nuxt.config.ts` | 562, 850 | `isPublishedBlogEntry` → retire la route | `production === "present"` |
    | 4 | `nuxt.config.ts` | 573, 863 | `isIndexableBlogEntry` → réserve le `title` | **`isIndexableBlogEntry` — INCHANGÉ** (voir Piège 5) |
    | 5 | `nuxt.config.ts` | 583, 869 | `prerender: !sitemapExcluded` | `prerender: state.production === "present"` |
    | 6 | `nuxt.config.ts` | 584, 870 | `indexable: !sitemapExcluded && isIndexableBlogEntry` | `indexable: state.inSitemap` |
    | 7 | `app/pages/blog/index.vue` | 91, 97 | `entries.filter(isIndexableBlogEntry)` | `state.discoverable` |
    | 8 | `app/pages/index.vue` | 358, 533 | idem + `.slice(0, 3)` | `state.discoverable` |
    | 9 | `app/pages/blog/[...slug].vue` | 85, 107, 185 | `isPublishedBlogEntry` (télémétrie + 404) | `state.production === "present"` |
    | 10 | `app/pages/blog/[...slug].vue` | 257 | `getBlogRobotsDirective(article)` | `state.robots` |
    | 11 | `server/plugins/seo-content.ts` | 38, 44 | `!isIndexableBlogEntry` / `published && indexable` | `!state.inSitemap` / `state.inSitemap` |
    | 12 | `server/plugins/ai-ready-markdown.ts` | 64 | `!published \|\| indexable` | `!state.inSitemap` |
    | 13 | `server/middleware/aeo-content-visibility.ts` | 37 | `!published \|\| !indexable` | `!state.inSitemap` |
  - [x] T1.3 Confirmer que `content/blog/` ne contient que `.gitkeep` (corpus vide) et que `docker compose up` tourne, ou lancer la commande ponctuelle

- [x] **T2 — Couche A : apprendre `visibility`, sans casser la sérialisation** (AC: #4 #5 #6)
  - [x] T2.1 Ajouter `visibility?: unknown` à `BlogIndexabilityEntry` (`blog-indexability.ts:1-8`)
  - [x] T2.2 Dans `isIndexableBlogEntry`, ajouter `metadata.visibility === "private"` au retour anticipé des lignes **59-61** (et non 55-58, qui est le commentaire de sérialisation). **Inline, sans helper externe** — c'est la duplication volontaire de la §2.1
  - [x] T2.3 Dans `isPublishedBlogEntry` (l. 37-42), ajouter `visibility` à l'objet rebuild, sinon un article `private` reste « publié » et donc prérendu
  - [x] T2.4 Vérifier en conteneur que `isIndexableBlogEntry.toString()` ne référence **aucune** constante ni fonction externe après édition
  - [x] T2.5 **Ne pas** factoriser la duplication avec `isSitemapExcluded` ni `hasNoindexDirective`. Contrainte d'architecture (AD-02), pas un défaut

- [x] **T3 — Couche B : le resolver** (AC: #1 #2 #3 #6 #7 #11 #12)
  - [x] T3.1 Déclarer et exporter `BlogVisibilityState` avec les 5 champs de l'AC #1. **Retenir les noms du §4.1 de l'architecture** (`production`, `discoverable`, `inSitemap`, `robots`, `feedable`) et écarter ceux du diagramme (`renderable`, `robotsDirective`) : la table normative §4.2 emploie les premiers
  - [x] T3.2 Écrire `resolveBlogVisibility(entry: unknown, now?: Date): BlogVisibilityState` **dans le même fichier** `app/utils/blog-indexability.ts`, appelant la couche A par appel direct (pas d'import : ils partagent le module)
  - [x] T3.3 **Copier `blog-indexability.ts:59-91` verbatim**, y compris la regex `\d{4}-\d{2}-\d{2}`, le contrôle de validité calendaire (l. 73-79), le `Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" })` (l. 81-88) et la comparaison lexicographique (l. 89). **Interdiction d'importer** la couche A pour cette partie, comme pour la sérialisation. Un resolver qui écrit « `!draft && !futur` » diverge d'un jour à chaque bascule de minuit Paris et de la CI (`cd.yml:593` recalcule `paris_today`)
  - [x] T3.4 Reprendre la même garde que la couche A : `const referenceDate = now instanceof Date ? now : new Date()`. Sans elle, un `Array#filter` qui passe son index en 2ᵉ argument fait lire `0`, `1`, `2` comme des dates (Piège 4)
  - [x] T3.5 `production = "absent"` si `draft === true` **ou** date future **ou** `visibility === "private"` ; sinon `"present"`
  - [x] T3.6 `noindexEtRobots` = `noindex === true` **ou** directive `noindex`/`none` sur `robots` / `seo.robots`. **Le `noindex === true` est obligatoire** : la couche A court-circuite dessus (l. 59) avant le test robots, et `getBlogRobotsDirective` (l. 114) produit `"noindex, nofollow"` pour ce seul cas. Un test limité aux directives donnerait `discoverable: true` et `robots: "noindex, nofollow"` sur la même ligne — un état auto-contradictoire
  - [x] T3.7 `discoverable = production === "present" && !noindexEtRobots` (donc `true` pour `sitemap: false`/`null`)
  - [x] T3.8 `inSitemap = production === "present" && !noindexEtRobots && !isSitemapExcludedInline` — où le test sitemap est **dupliqué inline**, jamais importé
  - [x] T3.9 `robots = production === "absent" ? undefined : getBlogRobotsDirective(entry)` — la matrice porte `—` quand il n'y a pas de HTML
  - [x] T3.10 `feedable = inSitemap`, avec le commentaire FR-15 / AD-09
  - [x] T3.11 Documenter dans un commentaire d'en-tête la table des 7 lignes, la précédence, le mapping `prerender`/`indexable`, et le comportement « entrée inconnue → état le plus restrictif ». **Ne jamais `throw`** dans ce fichier
  - [x] T3.12 Ne créer **aucun** champ `preview`, aucun second drapeau, aucune route

- [x] **T4 — Remplacer les 10 points de contact** (AC: #2 #5 #8 #9 #10)
  - [x] T4.1 `nuxt.config.ts` l. 562, 583-584, 869-870 : lectures d'état, avec le mapping nominatif de l'AC #8. **Conserver exactement la forme de `contentRouteState`** (`{ prerender, indexable, source? }`, l. 62-66) : ce type est brownfield, absent de toute la spec, et le renommer sort du scope. L. 573 et 863 : **ne pas toucher** (Piège 5)
  - [x] T4.2 `app/pages/blog/index.vue:91,97` : filtrer sur `discoverable`. **Ce changement est visible** : un article `sitemap: false` apparaît désormais dans la liste. Ne pas réécrire la chaîne existante `.order("date","DESC")` puis filtre — cet ordre est correct
  - [x] T4.3 `app/pages/index.vue:358,533` : idem. **Conserver l'ordre `.order("date", "DESC")` → filtre `discoverable` → `.slice(0, 3)`**, qui est déjà celui du code. Justification : la colonne « Listes et homepage » de la matrice couvre la homepage, et laisser cette page sur son ancien prédicat créerait un second filtre — exactement ce qu'AD-03 interdit. FR59 « conserve son comportement actuel » porte sur la mise en page et l'absence de section `featured`, pas sur le prédicat
  - [x] T4.4 `app/pages/blog/[...slug].vue:85,107,185,257` : `production === "present"` pour la garde de 404 et la télémétrie ; `state.robots` pour la métadonnée. **Le CTA de fin d'article reste inconditionnel** — c'est 16.4 qui le conditionne à `discoverable` (D-09). Ne pas le toucher ici
  - [x] T4.5 `server/plugins/seo-content.ts:38,44` : `!inSitemap` / `inSitemap`
  - [x] T4.6 `server/plugins/ai-ready-markdown.ts:64` : `!inSitemap`. Sémantique identique (`!published || indexable` ≡ pas au sitemap), forme simplifiée
  - [x] T4.7 `server/middleware/aeo-content-visibility.ts:37` : `!inSitemap`, en conservant le court-circuit `import.meta.prerender` (l. 27) qui laisse la passe se terminer
  - [x] T4.8 **Ne pas toucher** `app/utils/blog-content-contract.ts:248` : le `filter` du schéma Sitemap reste `isIndexableBlogEntry`

- [x] **T5 — Aligner la CI et le contrat sur la matrice** (AC: #1 #5)
  - [x] T5.1 `cd.yml:653` : `html_expected = published` (retirer `and not sitemap_excluded`), afin de produire le HTML de la ligne 6 de la matrice — décision de cadrage en tête de fichier
  - [x] T5.2 `cd.yml:648-651` : ajouter `visibility` au recalcul Python de la matrice. `cd.yml:644-653` ne connaît pas `visibility`, donc une fixture `private` y serait traitée comme un article publié et échouerait à `assert not html.exists()` (l. 661)
  - [x] T5.3 Vérifier que `cd.yml:537-539,668-671` (exclusion AEO) reste cohérent : un article `sitemap: false` doit rester absent de `llms.txt` / `llms-full.txt` / `sitemap.md` **et** du jumeau `.md`, tout en étant présent dans la liste `/blog`
  - [x] T5.4 `content-contract.md` §2 (cellule `sitemap`) : ajouter l'avertissement éditorial de la décision de cadrage — `sitemap: false` retire le lien du sitemap et des artefacts AEO, **pas** la page des résultats de recherche ; pour cela, utiliser `noindex: true` ou `visibility: private`

- [x] **T6 — Corriger les commentaires devenus faux** (AC: #13)
  - [x] T6.1 `app/pages/blog/index.vue:93-94` (« Le même filtre que le schéma Sitemap ») — plus vrai : le filtre est `discoverable`, le schéma Sitemap reste `isIndexableBlogEntry`
  - [x] T6.2 `app/pages/index.vue:528-530` (« publiés/indexables »)
  - [x] T6.3 `app/pages/blog/[...slug].vue:179-180` (« 404 uniquement quand l'article n'existe pas ») — désormais aussi pour `private`
  - [x] T6.4 `nuxt.config.ts:854-855` (« Seul le corpus découvrable réserve un titre ») — le vocabulaire « découvrable » y désigne `isIndexableBlogEntry` et ne doit pas être confondu avec `state.discoverable`
  - [x] T6.5 `app/utils/blog-indexability.ts:49-58` — actualiser la mention de duplication pour couvrir le test de date du resolver

- [x] **T7 — Amender l'architecture** (obligatoire, `architecture-blog-editorial.md` §11.3)
  - [x] T7.1 §6.2 et §10 (l. 317, 319, 401-403) : `/blog` et la homepage sont basculés sur le resolver **dans cette story 16.2**, pas en 16.3 / 16.5
  - [x] T7.2 Ajouter la ligne « Amendé le 2026-09-27 (story 16.2) » en tête de §6.2, comme 16.1 l'a fait pour §6.1 (l. 275)
  - [x] T7.3 §4.1 : remplacer « proposition, à confirmer en story 16.2 » par la forme confirmée

- [x] **T8 — Valider** (AC: #1 à #13)
  - [x] T8.1 `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck"` → code 0
  - [x] T8.2 `docker compose run --rm web sh -c "corepack enable && pnpm exec nuxi prepare && pnpm generate"` → code 0, `/blog` toujours pré-rendu
  - [x] T8.3 Créer 7 fixtures temporaires, une par ligne de la matrice, **avec un `title` unique et distinct par fixture** — sinon le registre de titres de 16.1 lève « Collision de titre dans le corpus public » (`nuxt.config.ts:474-490,606-611`) et l'échec ressemble à une régression
  - [x] T8.4 **Purger l'index avant build** : `rm -rf .data` dans le conteneur, ou `docker compose restart web`. Un nouveau champ de frontmatter exige une ré-ingestion (AGENTS.md §2) ; un index SQLite périmé produit des résultats trompeurs
  - [x] T8.5 Inspecter le build : un article `visibility: private` est absent de `sitemap.xml`, `llms.txt`, `llms-full.txt`, `sitemap.md`, du jumeau `.md` **et** aucun `blog/<slug>/index.html` n'est produit
  - [x] T8.6 Inspecter le build : un article `sitemap: false` est absent de `sitemap.xml`, `llms.txt`, `llms-full.txt`, `sitemap.md` et du jumeau `.md`, **mais** `blog/<slug>/index.html` est produit, et il est listé dans `blog/index.html` et `index.html` (discoverable)
  - [x] T8.7 Vérifier la non-régression : build avec les 9 fixtures CI puis clean build, comme en 16.1 — et rejouer les blocs d'assertions Python du workflow
  - [x] T8.8 Vérifier la **totalité** du resolver par sonde en conteneur : `resolveBlogVisibility(null)`, `(undefined)`, `({})`, `({ visibility: "secret" })`, `({ date: 42 })` → tous `production: "absent"`, aucun `throw`. Sans cette sonde, l'AC #7 est invérifiable, car tous les appelants gardent déjà `!entry` avant le filtre
  - [x] T8.9 Vérifier en conteneur que `isIndexableBlogEntry.toString()` ne référence aucune constante ni fonction externe
  - [x] T8.10 `git status --porcelain` propre après suppression des fixtures + recherche de slugs

### Review Findings

_Revue de code du 2026-09-27 — trois couches parallèles (Blind Hunter, Edge Case Hunter, Acceptance Auditor) sur le diff non commité contre `3b3f3b2`, périmètre = les 14 fichiers de 16.2 (16.1 lu comme contexte, non audité). 16 constatements sources, 29 dédupliqués, 3 rejetés. Les constats marqués « vérifié » ont été reproduits par le reviewer._

**Constatsmajeur : l'AC #5 (la raison d'être de la story) n'est couvert par aucune assertion CI.** Aucune fixture `visibility: private` n'existe dans `cd.yml` — vérifié : `grep -n visibility .github/workflows/cd.yml` ne retourne que les lignes 657-662 (le calcul), jamais un `visibility: private` dans le jeu de fixtures (`:67-78`). La branche `production = published and visibility != 'private'` (`:662`) n'est donc **jamais vraie** : elle est du code mort en CI. Une régression republiant un article `visibility: private` (HTML 200, sitemap, AEO) laisse la CI verte. T5.2 a préparé la branche sans l'exercer. Constat trouvé indépendamment par l'Acceptance Auditor (MINEUR 8) et l'Edge Case Hunter (8).

**Constat majeur : la matrice Python de la CI ne peut pas valider AC #5, et l'AC #1 n'est demonstrated que par la sonde jetable.** Les 9 entrées de T8.8 et les 8 lignes de la matrice sont des constats de coherence de code, traces un par un par l'Acceptance Auditor — pas une execution. Le Build Log revendique « 8/8 lignes exactes » et « 9/9 » : c'est exact quant a la coherence, et la distinction doit rester visible au gate.

**Verification positive, a acter : `isIndexableBlogEntry(x) ≡ resolveBlogVisibility(x).inSitemap` pour tout `x`.** Les deux predicats sont logiquement equivalents (couche A `blog-indexability.ts:78-132`, couche B `:234-278`). C'est l'invariant de coherence A/B que 16.7 devra prouver par artefacts, et il est desormais etabli par lecture.

**Verification positive, a acter : `canonical_origin` est defini avant tous ses usages, et le litteral `- **Source :** ` est le format reellement produit.** L'Edge Case Hunter a verifie ce dernier octet par octet dans `.output/public/llms-full.txt` (`2d 20 2a 2a 53 6f 75 72 63 65 20 3a 2a 2a`). Cela **reduit fortement** la portee du constat « assertion vacante » du Blind Hunter (constat 2) : l'assertion ne peut pas se vider sur une derive de format.

**Decision-needed (2) — tranchées le 2026-09-27, converties en patch**

- [x] [Review][Decision] **Le contrat normatif §2 affirme une absence de `llms-full.txt` que le build ne produit pas** — T5.4 a ajoute dans `content-contract.md:50` : « `sitemap: false`/`null` retire le lien du `sitemap.xml` **et** des artefacts AEO (`llms.txt`, **`llms-full.txt`**, `sitemap.md`, jumeau `.md`) ». C'est faux : `llms-full.txt` est un assemblage de rendus de pages delimites par `- **Source:** <loc>` (`splitAiReadyFullSections`, `nuxt.config.ts:114-153`) ; la section `/blog` est conservee par `removeNonIndexableAiReadyArtifacts` (`:357-373`, dont le set `routes` ne contient que des routes *article*), et elle porte la carte de chaque article decouvrable. Le slug d'un article `sitemap: false` **est** present dans `llms-full.txt` — ce qui est precisement la raison pour laquelle les deux assertions ont du etre affaiblies. Un contrat qui promet une absence qu'il ne produit pas est un defaut de cette story. **Arbitrage : soit le texte est reecrit pour dire ce qui est vrai (absent de sa *propre* section AEO, mentionne dans la section `/blog`), soit l'implementation doit aller plus loin — ce qui exclurait `/blog` lui-meme des artefacts AEO, c'est-a-dire la page editoriale publique, ce qui n'est pas soutenable.** **Tranché (D5 → option 1) : réécrire le texte du contrat, aucune modification de code.** L'option inverse — purger la section `/blog` des artefacts AEO — a été écartée : elle retirerait aux agents IA la page éditoriale publique du blog, ce que la matrice interdit. Devient le patch P1 ci-dessous.
- [x] [Review][Decision] **Le registre de titres laisse deux cartes homonymes dans `/blog` à `sitemap: false`** — Le Piège 5 et les Completion Notes justifient de garder `isIndexableBlogEntry` parce que « l'unicite de `title` est un contrat de donnees, pas une surface de visibilite ». Ce raisonnement tient pour le *sitemap*, mais pas pour les listes : depuis 16.2, un article `sitemap: false` est `discoverable: true`, donc **liste** sur `/blog` et dans le journal. Deux articles dont l'un est `sitemap: false` et l'autre indexable, de meme `title`, sont donc tous deux reserves… non : le second reserve, le premier est ignore par le garde → les deux apparaissent cote a cote avec le meme titre et la meme description, ce qu'est exactement le motif que `registerPublicBlogTitle` declare vouloir empecher (« le titre alimente les cartes […] donc une collision produirait deux artefacts publics indiscernables »). **Arbitrage : soit on passe le garde sur `state.discoverable` (coherent avec ce que les listes exposent, mais resserre l'unicite au-dela du sitemap), soit on assume explicitement que deux homonymes dans `/blog` sont acceptables et on corrige le commentaire `nuxt.config.ts:463` qui affirme le contraire (« seul le corpus **decouvrable** est contraint »).** Le reviewer recommande de passer sur `state.discoverable` : le corpus liste est le corpus decouvrable, et un article `sitemap: false` est desormais un artefact public liste. **Tranché (D6 → option 1) : passer le garde sur `state.discoverable`.** Le corpus listé est le corpus découvrable ; un article `sitemap: false` est désormais un artefact public listé, donc soumis au contrat d'unicité. Conséquence assumée : l'unicité est plus large que le sitemap. Devient le patch P2 ci-dessous.

**Patch (17) — tous appliqués le 2026-09-27, gate Docker rejouée au vert**

> **Vérification post-patchs.** Les 17 patchs sont appliqués et validés par lecture (YAML
> parse, 4 blocs Python syntaxiquement valides, AC #4 préservé par extraction du corps de
> `isIndexableBlogEntry`), puis par la gate complète :
> `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
> → **code 0**, 42 routes prérendues, corpus `content/blog/` vide.
> Le `WARN Sitemap is empty` de `nuxt-ai-ready` est l'écart `NUXT_SITE_ENV` déjà documenté
> (`.env` local en `development`, CI en `production`), préexistant et sans rapport.
> **Ce que la gate locale ne couvre pas :** la fixture `__ci-seo-private` et le rejeu des
> assertions Python de `cd.yml`, qui ne s'exécutent qu'en CI réelle.

- [x] [Review][Patch] **Réécrire la cellule `sitemap` de `content-contract.md` §2 pour dire ce qui est réellement produit** [`docs/specs/spec-blog-editorial/content-contract.md`:50] — *(P1, issu de D5)*. Remplacer l'affirmation « retire le lien … **et** des artefacts AEO (`llms.txt`, `llms-full.txt`, `sitemap.md`, jumeau `.md`) » par une formulation exacte : absent de `sitemap.xml`, de `llms.txt`, de `sitemap.md` et du jumeau `.md` ; absent de **sa propre section AEO** dans `llms-full.txt` ; **mais mentionné dans la section `/blog`** de `llms-full.txt`, `/blog` étant une page éditoriale publique dont la carte liste chaque article découvrable. Préciser que c'est la conséquence voulue de `discoverable: true`. Le reste de l'avertissement (contrôle faible, `noindex` pour exclure des résultats, `private` pour retirer le HTML) est exact et se conserve.
- [x] [Review][Patch] **Passer le garde du registre de titres sur `state.discoverable`, et amender le Piège 5** [`nuxt.config.ts`:463-464,580,864-875] — *(P2, issu de D6)*. Remplacer `isIndexableBlogEntry(metadata)` / `isIndexableBlogEntry(context.content)` par `state.discoverable` aux deux points d'enregistrement (`:580` et `:875`) ; `state` est déjà calculé dans les deux scopes. Corriger en consequence le commentaire de `registerPublicBlogTitle` (`:463`) et celui du hook (`:864-869`), qui affirment l'un et l'autre une definition fautive. **Point d'attention :** ce changement reintroduit-il un import interdit ? Non — `state` vient du resolver, `isIndexableBlogEntry` reste donc sans appelant dans `nuxt.config.ts`, ce qui est conforme à AD-02 et renforce la separation des couches. **Amender le Piège 5 de la story** (et le Tableau de correspondance de `epics.md` si necessaire) : son raisonnement « l'unicite de `title` est un contrat de donnees, pas une surface de visibilite » ne vaut plus pour les listes, ou `sitemap: false` est expose. Le predicat du sitemap (`defineSitemapSchema({ filter })`) reste, lui, `isIndexableBlogEntry` — non modifie.

- [x] [Review][Patch] **Ajouter une fixture `visibility: private` au jeu CI** [`.github/workflows/cd.yml`:67-78] — sans elle, la branche `:662` n'est jamais exercée et l'AC #5 n'a aucune couverture CI. Cette story est precisement celle qui ferme la reserve reportee par 16.1 (« `visibility` est valide mais totalement inerte ») ; la laisser sans fixture fait reporter la reserve une seconde fois.
- [x] [Review][Patch] **Relever `SEO_ROUTE_CACHE_VERSION`** [`nuxt.config.ts`:68] — **verifie**. La version est reste a `1` alors que 16.2 change la semantique des booleens stockes : avant, `prerender: !sitemapExcluded` donnait `prerender: false` pour un article `sitemap: false` et **`prerender: true` pour un article `visibility: private`** (que `isPublishedBlogEntry` ne connaissait pas) ; apres, l'inverse. La restauration du cache (`:629-651`) est **anterieure** au scan (`:657`) et n'est ecrasee que si le scan va a son terme. Or le scan est enveloppe dans un `try/catch` (`:600-613`) dont le `catch` **avale silencieusement** toute erreur non prefixee `[content]` : une erreur d'E/S dans `visit()` laisse alors survivre les entrees restaurees d'un cache perime, et un article `visibility: private` est de nouveau prerendu et servi en 200 — exactement la fuite que l'AC #5 ferme. Les deux mecanismes (cache perime + `catch` muet) sont preexistants, mais le bump de version est **de cette story** : elle change ce qui est stocke.
- [x] [Review][Patch] **Amender AD-03 et le diagramme §4, devenus factuellement faux** [`docs/planning-artifacts/architecture-blog-editorial.md`:29,152-154] — **verifie**. AD-03 dit « un resolver d'etat riche (couche B) **qui le consomme** » avec « Dependance **B → A uniquement** », et le diagramme trace `A --> B`. Or le code livre **n'etablit aucune dependance B → A sur le predicat** : `blog-indexability.ts:221-288` n'appelle jamais `isIndexableBlogEntry` (T3.3 l'interdit explicitement, pour une raison valide). Les seules dependances de B sont `hasNoindexDirective` et `getBlogRobotsDirective`, qui sont des freres de A, pas A. Le graphe `A --> B` est donc faux. Le diagramme conserve en outre `state.renderable` et `state.robotsDirective` — exactement les noms que T3.1 a ecartes au profit de `production` et `robots`. T7 a amende §4.1, §6.2, §10 et §11.2, c'est-a-dire tout ce que la spec enumerait ; §11.3 exige que l'architecture reste une source de verite et non un document devenu faux.
- [x] [Review][Patch] **Restaurer l'assertion forte pour les fixtures non decouvrables, et ne affaiblir que la ligne 6** [`.github/workflows/cd.yml`:540-546,682-685] — Les deux assertions `… not in llms_full_text` ont ete remplacees par `assert f'- **Source :** {canonical_origin}/blog/{slug}' not in llms_full_text` pour **toute** la boucle `noindex/exclu`. Or cette boucle melange des articles `discoverable: false` (`noindex`, `robots: false`, `robots: none`) et `discoverable: true` (`sitemap: false`). Seuls les seconds ont le droit d'etre mentionnes par la carte de `/blog` ; pour les premiers, l'ancienne assertion etait correcte **et** plus forte (absence totale de l'URL). Elle est'abandonnee pour tous, alors que le Blind Hunter l'avait signalee comme affaiblissement. **Portee reelle, une fois le contexte ajoute :** l'Edge Case Hunter a verifie que `cd.yml:495-498` impose deja `set(sources) == set(locs)`, ce qui couvre la section AEO propre — la perte reelle est donc limitee a une mention non-`Source` d'un article exclu. Le correctif reste non ambigu : conditionner la forme faible a `sitemap_excluded` et conserver la forme forte sinon. L'affaiblissement lui-meme etait **techniquement justifie** (l'ancienne forme ne pouvait pas exprimer les deux proprietes simultanees de T5.3) ; c'est son **application a toute la boucle** qui est excessive.
- [x] [Review][Patch] **`ai-ready-markdown.ts` : la nouvelle condition n'est pas equivalente, et T4.6 affirme a tort l'equivalence** [`server/plugins/ai-ready-markdown.ts`:64] — **verifie**. Ancien : `!entry || !isPublishedBlogEntry(entry) || isIndexableBlogEntry(entry)` → `return`. Nouveau : `!entry || resolveBlogVisibility(entry).inSitemap` → `return`. L'ancien ensemble de retour est un **sur-ensemble strict** du nouveau (il retourne aussi sur les articles non publies ET non indexables). Concretement : sur une reponse `text/html` pour un article `draft`/`future`/`private`, le bloc de nettoyage AEO s'execute desormais. Le resultat net reste un 404 parce que `aeo-content-visibility.ts:37` (lui bien equivalent) s'execute avant — mais la validite du plugin depend maintenant entierement de l'ordre middleware/plugin, un couplage invisible et non commente. T4.6 justifiait le changement par « semantique identique (`!published || indexable` ≡ pas au sitemap) » : cette identite est **fausse**, `!published || indexable` n'est pas `!inSitemap`. Restaurer l'ancienne polarite, ou restreindre explicitement a `production === "present"`.
- [x] [Review][Patch] **Le hook ne retracte pas la reservation de titre quand l'article sort du corpus** [`nuxt.config.ts`:860-863,474-490] — `registerPublicBlogTitle` ne retracte que sur *renommage* (`previousKey !== key`), jamais sur *perte d'indexabilite*. En developpement : `a.md` publie avec `title: "Mon article"` → on passe `draft: true` → le hook retourne au `production === "absent"` **avant** d'appeler `registerPublicBlogTitle` → la cle reste reservee a `a.md` → on cree `b.md` avec le meme titre → levee « Collision de titre dans le corpus public » → `@nuxt/content` avale l'exception et **ignore le fichier** : `b.md` disparait silencieusement de `/blog`, du sitemap et des artefacts AEO, avec un simple WARN. C'est un article perdu en silence, exactement la classe de bug que l'AC #5 vise. Le scan, lui, purge implicitement en vidant les deux maps.
- [x] [Review][Patch] **Aligner le test calendaire du resolver sur le contrat (`setUTCFullYear`)** [`app/utils/blog-indexability.ts`:95,242] — **verifie**. Le contrat traite explicitement ce piege : `blog-content-contract.ts:38` commente « `setUTCFullYear` est utilise et non le constructeur `Date`, qui mappe les annees 0 a 99 » et utilise `setUTCFullYear` (`:50`). Le resolver utilise `Date.UTC(year, month - 1, day)` : `Date.UTC(26, 0, 1)` renvoie **1926**-01-01, donc `date: "0026-01-01"` — accepte par `ISO_DATE_PATTERN` **et** `isCalendarDate` — est traite comme non publie par les deux couches, sans message, build vert. C'est une divergence reintroduite dans le code duplique. Corriger par la meme methode que le contrat.
- [x] [Review][Patch] **`resolveBlogVisibility` leve un `RangeError` sur une `Date` invalide, alors que son contrat dit « ne leve jamais »** [`app/utils/blog-indexability.ts`:224,253] — Le garde `now instanceof Date` accepte `new Date(NaN)` et `new Date("pas une date")` ; `Intl.DateTimeFormat#formatToParts` leve alors `RangeError: Invalid time value`. `resolveBlogVisibility({date:"2026-01-01"}, new Date("nope"))` leve au lieu de renvoyer l'etat. Meme defaut dans la couche A (`:77`, `:110`), dont le commentaire promet de meme. Ajouter `Number.isNaN(referenceDate.getTime())` → repli sur `new Date()`. Note : aucun appelant ne passe de 2e argument aujourd'hui (verifie), donc le risque est aujourd'hui latent — mais la promesse documentee estcategorique.
- [x] [Review][Patch] **Corriger le message d'erreur de collision de titre, devenu faux** [`nuxt.config.ts`:485-486] — Le Piège 5 affirme que ce message « reste exact ». Il ne l'est plus : `isIndexableBlogEntry` ecarte aussi `visibility: private`, exclusion **introduite par cette story** (T2.2, `blog-indexability.ts:81`). Le message doit lister `private` — et `robots: false`/`none`, deja omis avant 16.1.
- [x] [Review][Patch] **Corriger trois commentaires factuellement faux introduits ou conserves** — (a) `nuxt.config.ts:564` : « le seul echec **dur** […] **hors de tout `try/catch`** » — **verifie faux** : `visit()` est dans un `try/catch` (`:600-613`). La *conclusion* reste vraie (le `throw` des violations est hors du `try`, `:616`), le raisonnement est faux. (b) `nuxt.config.ts:464` et `:865` : « la meme definition que `isSitemapExcluded` » — **verifie faux** : `isSitemapExcluded` ne teste que `sitemap` (`blog-indexability.ts:33-36`). (c) `nuxt.config.ts:866` : « il reste sans import et **inchange** » — **verifie faux** : T2.2 a modifie son corps. Ce sont precisement les enonces que T6 existait pour empecher.
- [x] [Review][Patch] **Corriger la table de matrice recopiee dans le resolver** [`app/utils/blog-indexability.ts`:189-190] — La norme (`architecture-blog-editorial.md:207`) ecrit `publié + \`sitemap: false/null\`` ; le resolver ecrit `publié + \`sitemap:false\``, sans l'alias, alors que le traitement couvre bien les deux (`:275`) et que le Debug Log revendique « 8/8 lignes exactes » precisement pour couvrir cet alias. La fixture `robots: none` est de plus repliee dans la ligne `robots: false` sans que le rattachement soit documente.
- [x] [Review][Patch] **Purger `contentSourcePathByRoute` sur le chemin d'absence dans le hook** [`nuxt.config.ts`:860-863] — Le hook ne fait que `contentRouteState.delete(normalizedPath)`, alors que le scan purge les deux tables (`:568-569`). `contentSourcePathByRoute` alimente `enrichAiReadyArticleFrontmatter` (`:182`) : en developpement, une route `/blog/x` peut rester mappee vers un fichier renomme, et l'enrichissement AEO lit alors le mauvais frontmatter.
- [x] [Review][Patch] **Ne pas muter l'etat avant de valider dans `registerPublicBlogTitle`** [`nuxt.config.ts`:476-487] — L'ancienne reservation est supprimee **avant** le test de collision ; au `throw`, `contentSourcePathByPublicTitle` a perdu sa cle precedente et `publicBlogTitleKeyBySource` conserve l'ancienne valeur : les deux tables sont dechirees. Aggrave par l'asymetrie d'appel — le scan encapsule en `try/catch` et agrege, le hook appelle la fonction nue.
- [x] [Review][Patch] **Corriger le diagnostic du message final des violations** [`nuxt.config.ts`:616-621] — Une collision de *titre* est poussee dans le meme tableau que les violations de *frontmatter*, et chaque entree recoit le suffixe « Corrigez le frontmatter ; aucun artefact n'est produit ». Sur une collision, ce diagnostic est faux (aucun frontmatter en cause) et « aucun artefact n'est produit » est faux (le scan a deja construit `contentRouteState` pour les autres fichiers). Le compte « N fichier(s) » est faux des qu'un meme fichier viole deux fois.
- [x] [Review][Patch] **Corriger la reference croisee AC #9 / AC #10 dans la spec** [`16-2-…md`:42] — « la 6e colonne de la matrice (« Acces direct ») est couverte par **l'AC #9** » : c'est l'**AC #10** qui porte le 404 en acces direct ; l'AC #9 porte les points de contact. Anomalie de la spec, a corriger pour eviter une prochaine verification erronee.

**Defer (7) — pre-existant ou hors perimetre, consigne dans `deferred-work.md`**

- [x] [Review][Defer] **`production: "absent"` n'est represente nulle part dans `contentRouteState`** [`nuxt.config.ts`:566-571,892-914] — deferred, pre-existant. `prerender: state.production === "present"` est litteralement satisfait (AC #8) mais **tautologique aux deux points d'application** : `production === "absent"` declenche `continue`/`return` avant le `set`, donc `prerender` ne peut jamais valoir `false` et la branche `excludedPrerenderRoutes` est inatteignable pour ce motif. Consequence pour l'AC #5 : une route `private` n'entre ni dans `prerender.routes`, ni dans `prerender.ignore`, ni dans `seoNonIndexableContentRoutes` ; sa protection repose **entierement** sur l'absence de lien entrant (`discoverable: false`). Le mapping impose par l'AC #8 ne peut structurellement pas porter cette garantie dans cette architecture. A porter au gate 16.7.
- [x] [Review][Defer] **`isPublishedBlogEntry` et `isSitemapExcluded` sont du code mort** [`app/utils/blog-indexability.ts`:33,48] — deferred, declare. **Verifie** : zero appelant sur tout le depot (ne definitions et commentaires). L'interdit « Supprimer `isSitemapExcluded` » est respecte et T2.3 impose de modifier le premier, mais la raison d'origine de T2.3 (« sinon un article `private` reste publie et donc prerendu ») a disparu : scan et hook consomment le resolver. L'affirmation « la sonde verifie la parite `production === isPublishedBlogEntry` » ne repose que sur un script jetable non versionne, donc sur une parite non upheld dans le temps. A rattacher a une story de nettoyage.
- [x] [Review][Defer] **Course de bascule de minuit Paris entre le scan et les consommateurs tardifs** [`nuxt.config.ts`:566 vs `app/pages/blog/index.vue`:100, `app/pages/index.vue`:535] — deferred, pre-existant. Un build lance a 23:59:50 peut classer un article `date: 2026-09-28` en `absent` au scan, puis le lier dans `/blog` apres minuit et l'inscrire au sitemap via la couche A : lien + URL de sitemap vers un 404 sur `gh-pages`. La CI a la meme faille (`paris_today`, `cd.yml:599`, est calcule apres le build). Le resolver n'introduit pas ce risque — il le rend simplement visible.
- [x] [Review][Defer] **Débordement de perimetre dans `content-contract.md` et `project-context.md`** [`docs/specs/spec-blog-editorial/content-contract.md`:57-58] — deferred, attribuable a 16.1. Le diff modifie aussi les cellules `image` (« non » → « oui (optionnel) ») et `read` (idem), hors T5.4, hors File List et hors Completion Notes ; `docs/project-context.md` est modifie sans figurer au File List. Consequence methodologique : **le diff fourni ne permet pas d'isoler le perimetre 16.2**, ce qui interdit de conclure par lecture a l'absence d'autre debordement.
- [x] [Review][Defer] **`assert '  - ci'` est devenu un match de prefixe** [`.github/workflows/cd.yml`:508] — deferred, artefact de 16.1 (contrainte kebab-case). `'  - ci'` est un prefixe de `'  - cisco'`, `'  - ci-gitlab'`. L'assertion verifie desormais « deux espaces, un tiret, `ci` ».
- [x] [Review][Defer] **`Intl.DateTimeFormat` reconstruit par entree dans un `.filter`** [`app/utils/blog-indexability.ts`:249] — deferred, trivial. Le resultat (`todayInParis`) ne depend que de la date et est calculable une fois par evaluation. Sans effet mesurable sur un corpus de cette taille ; a reconsidere si le corpus grossit.
- [x] [Review][Defer] **16.1 n'est pas commite et le worktree n'est pas propre** — deferred, processus. T8.10 dit « `git status --porcelain` propre » alors que la cellule ne verifiait intentionnellement que l'absence de fixtures (`16 fichiers modifies, 2 non suivis`). Le prerequis de build de la story (`:36`, « 16.1 doit etre commite ») **n'est pas satisfait** : le build de validation a donc tourne sur un etat non reproductible depuis `baseline_commit`.

**Rejetes (3) — verifies, faux positifs**

- **Divergence `(entry ?? {})` (couche A) vs garde `typeof entry === "object"` (couche B)** — l'Edge Case Hunter a trace 10 formes d'entree non-objet (`null`, `undefined`, `{}`, `0`, `"chaine"`, `[]`, `{date:42}`, `Date`, `null` imbrique, chaine a espaces) et les deux couches les rejettent **a l'identique**. La divergence de forme est reelle mais sans consequence.
- **`sitemap === null` materialise par une colonne SQLite nullable** — **refute**. Le schema est `union([sitemapObject, false, null])` (`blog-content-contract.ts`), `sitemap: "false"` est inatteignable, et la fixture `__ci-seo-published` ne declare aucun `sitemap:` tout en etant assert presente au sitemap : l'absence ne se materialise donc pas en `null` sur le chemin de lecture. Aucune divergence A/B.
- **`readFileSync` + parse YAML remonte devant le test de route** (`nuxt.config.ts`:543-548) — **intentionnel**. Le contrat T0 doit s'appliquer a tout `.md` de `blog/**`, y compris those qui ne produisent aucune route Vue ; le lecture remontee est ce qui rend l'assertion de contrat possible sur ces fichiers.

## Dev Notes

### 🚨 Piège 1 — `discoverable` et `isIndexableBlogEntry` divergent sur `sitemap: false`

Le piège central, écrit dans aucun document.

```ts
// app/utils/blog-indexability.ts:106-108 — fin de isIndexableBlogEntry
const sitemapExcluded = metadata.sitemap === false || metadata.sitemap === "false" || metadata.sitemap === null;
return !sitemapExcluded && !robotsNoindex;
```

`isIndexableBlogEntry` renvoie donc `false` pour `sitemap: false`. Or la matrice impose pour ce même article `discoverable: true` (colonne « Listes et homepage » : « présent, sauf autre règle d'exclusion »), et D-09 (arbitrée par Simon le 2026-09-27) tablaute explicitement :

| État | `discoverable` | CTA de fin d'article |
| --- | --- | --- |
| `sitemap: false` / `null` | **oui (présent dans les listes)** | **oui** |
| `noindex: true` | non | non |
| `robots: false` | non | non |

Il y a donc **trois** notions, pas deux.

| Notion | `draft` | futur | `private` | `noindex` | `robots:false` | `sitemap:false` | indexable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `production` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `discoverable` | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** | ✓ |
| `inSitemap` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

Écrire `discoverable = isIndexableBlogEntry(entry)` casse silencieusement les deux listes **et** l'arbitrage D-09.

### 🚨 Piège 2 — le filtre du schéma Sitemap ne peut pas devenir le resolver

`app/utils/blog-content-contract.ts:248` passe `isIndexableBlogEntry` à `defineSitemapSchema({ filter })`. Vérifié dans le code du module :

```js
// node_modules/@nuxtjs/sitemap/dist/module.mjs:968,973
filterEntries.push(`filters.set(${JSON.stringify(name2)}, ${filterFn.toString()})`);
onUrlEntries.push(`onUrlFns.set(${JSON.stringify(name2)}, ${fn.toString()})`);
```

Le callback est sérialisé dans un module virtuel Nitro par `Function#toString()`. Le runtime confirme le piège du second argument : `runtime/server/routes/__sitemap__/content-urls.js:17` fait `entries.filter(filter)`. Un resolver qui appelle d'autres fonctions de projet produirait un module virtuel cassé — **à l'exécution, sans erreur de build ni de typecheck**. Le `filter` du schéma reste donc la couche A, et `onUrl` reste `inline`.

Corollaire de structure : `resolveBlogVisibility` vit dans **le même fichier** que la couche A — ce qui rend la duplication de la §2.1 lisible côte à côte — mais il **ne l'appelle pas**. T3.3 l'interdit, et pour la même raison : `isIndexableBlogEntry` est sérialisée, donc non importable depuis un autre corps sérialisé. Les deux couches sont **autonomes** ; l'invariant qui les lie est une **équivalence logique** (`isIndexableBlogEntry(x) ≡ resolveBlogVisibility(x).inSitemap`), à prouver par confrontation des artefacts en 16.7. C'est ce qui contredit la formulation d'AD-03 (« couche B *qui le consomme* », « dépendance B → A uniquement ») et l'arête `A --> B` du diagramme §4, tous deux amendés dans cette story.

### 🚨 Piège 3 — la couche A doit apprendre `visibility`, et l'architecture ne le dit pas

L'architecture (§4.2) exige `production: "absent"` pour `visibility: private`, mais ne dit jamais si la couche A doit connaître le champ. **La réponse est oui**, et l'alternative est une fuite de contenu :

- `isPublishedBlogEntry` alimente le scan de `contentRouteState` (`nuxt.config.ts:562,850`). Sans `visibility`, un article `private` n'est jamais retiré → prérendu et servi en 200.
- La même fonction alimente le 404 de `[...slug].vue:185`.
- C'est la réserve reportée par 16.1 : « `visibility` est validé mais totalement inerte — `isIndexableBlogEntry` ne le connaît pas, donc un article `visibility: private` est public ».

Ce n'est pas une violation d'AD-02 : l'interdit porte sur les **importations** et les **constantes externes**, pas sur la lecture d'une propriété de `entry`. `visibility` est une valeur de premier niveau du document, exactement comme `draft` qui est déjà lu inline. La règle §2.3.4 s'applique : la logique est écrite **deux fois**, inline dans A et dans B.

### 🚨 Piège 4 — le second argument de `Array#filter`

```ts
// app/utils/blog-indexability.ts:55-58
 * `@nuxtjs/sitemap` applique ce callback via `Array#filter`, qui transmet
 * l'index de l'entrée comme second argument. Ne pas interpréter cet index
 * comme une date
```

Le paramètre `now?: Date` est une garde, pas un contrat. Confirmé dans le runtime (`content-urls.js:17`). Si la couche B appelle `isIndexableBlogEntry(entry, something)`, `something` doit être un `Date` explicite. **La même garde s'applique au resolver lui-même** (T3.4).

### 🚨 Piège 5 — le « corpus découvrable » de 16.1 et `state.discoverable` ne sont pas interchangeables

> ⚠️ **Piège amendé le 2026-09-27 (revue de code, arbitrage D6).** La version d'origine de
> ce piège concluait qu'il fallait laisser le registre de titres sur `isIndexableBlogEntry`.
> **Cet argument ne vaut que pour le sitemap, pas pour les listes** : depuis 16.2 un article
> `sitemap: false` est `discoverable: true`, donc listé sur `/blog`. Deux articles de même
> titre, dont un `sitemap: false`, étaient donc tous deux listés avec le même titre et la même
> description — exactement ce que le registre prétend empêcher. Le registre est désormais
> gardé sur `state.discoverable`, et l'unicité du `title` est **plus large que le sitemap**.
> Seul le `filter` du schéma Sitemap reste sur `isIndexableBlogEntry`, pour la raison
> technique du Piège 2.

Le vocabulaire se recouvre mais **les deux notions sont différentes** :

| | 16.1 | 16.2 |
| --- | --- | --- |
| Terme | « corpus découvrable » (mal nommé) | `state.discoverable` |
| Prédicat | `isIndexableBlogEntry` (= `inSitemap`) | troisième prédication |
| `sitemap: false` | **exclu** du registre | **listé**, donc **réserve** son `title` |
| Arbitrage | D3 (16.1), puis **D6 (16.2)** | matrice §4.2 |

Le corpus réellement listé par `/blog` et par le journal de la homepage est le corpus **découvrable**. C'est donc `state.discoverable` qui gouverne le registre de titres, et le message d'erreur de collision doit nommer les exclusions **réelles** : brouillon, article à venir, `visibility: private`, `noindex`/`robots: false`. Il ne doit **pas** mentionner « une entrée exclue du sitemap », qui est découvrable.

`isSitemapExcluded` survit : c'est un prédicat d'**exclusion sitemap** brownfield, pas un second prédicat d'indexabilité. L'interdit porte sur ce second, pas sur celui-ci.

### 🚨 Piège 6 — la duplication de la couche A n'est pas un bug

| Lignes de `isIndexableBlogEntry` | Duplique | Équivalent ailleurs |
| --- | --- | --- |
| l. 94-105 test robots + `noindex`/`none` | — | `hasNoindexDirective` (l. 10) |
| l. 106 `sitemap === false \| "false" \| null` | — | `isSitemapExcluded` (l. 24) |
| l. 59-91 date, calendrier, Europe/Paris | — | *(rien : c'est le cœur)* |

**Ne pas factoriser.** Le supprimer casse le sitemap à l'exécution. C'est le prix de la sérialisation, et les fixtures de 16.6 sont le seul moyen de garder A et B synchronisées.

### Piège 7 — la preview est hors T0

Quatre documents nomment l'absence : `docs/specs/spec-blog-editorial/.decision-log.md:94`, `architecture-blog-editorial.md:245-248` et `:416-418`, `epics.md:1847`. Le PRD exige que sa politique soit explicite, mais **aucune story ne la porte** et la construction de la surface est une décision R1 non prise. 16.2 livre `production: "absent"` → 404. **Ne créer ni champ, ni branche, ni route de preview.** Consigner un `defer` dans `deferred-work.md`.

### Piège 8 — le takedown n'est pas de 16.2

`verification-plan.md:146-158` décrit le runbook de retrait de confidentialité (« servir 404 ou 410 selon le runbook », « un revert Git seul ne vaut pas takedown ») mais **ne cite aucune story**. L'epic ne le rattache à aucun porteur : `epics.md:1596` place 17.2 sur la promotion contrôlée et les probes, pas sur le takedown. 16.2 ne le traite pas : la matrice ne couvre que la transition d'état au build suivant, pas le retrait d'un article déjà en production. **Réserve à porter au gate 16.7.**

### Piège 9 — la CI ne connaît pas `visibility`

`cd.yml:644-653` recalcule la matrice en Python **sans `visibility`**. Une fixture `private` y est traitée comme un article publié normal. C'est le travail de T5.2 dans cette story, puis de 16.6 / 16.7 pour la couverture d'ensemble. Ne pas conclure que le build vert prouve l'AC #5 sans cette amendment.

### Piège 10 — pas de risque d'hydratation nouveau

Le seul consommateur dépendant de `now` est le setup SSR (`[...slug].vue:181-196`). Le watcher client (`:201-208`) n'est pas `immediate`, donc ne réévalue pas au mount. Le risque préexistant (bascule de date côté client → 404 d'un article déjà prérendu) est inchangé. Le resolver n'ajoute pas de divergence SSR/client.

### Interdits absolus pour cette story

| ❌ Interdit | Pourquoi |
|---|---|
| Ajouter un `import` ou une constante externe dans `isIndexableBlogEntry` | Sérialisation `Function#toString()`, AD-02 |
| Réduire la duplication interne de la couche A | Contrainte d'architecture, pas un défaut |
| Remplacer `isIndexableBlogEntry` par le resolver dans `defineSitemapSchema({ filter })` | Le resolver n'est pas sérialisable — casse le sitemap à l'exécution |
| Supprimer `isSitemapExcluded` | C'est un prédicat d'**exclusion sitemap**, pas un second prédicat d'indexabilité. Il alimente `nuxt.config.ts` et le registre de titres |
| Toucher au registre de `title` (`nuxt.config.ts:573,863`) | L'unicité est un contrat de données, gouverné par `isIndexableBlogEntry` (Piège 5) |
| Écrire `discoverable = isIndexableBlogEntry(entry)` | Casse la ligne 6 de la matrice et D-09 |
| Écrire `prerender: state.discoverable` ou `indexable: state.discoverable` | Mapping nominatif obligatoire (AC #8) |
| Créer un second prédicat d'indexabilité, ou un second filtre dans une page | AD-03, `docs/specs/spec-blog-editorial/architecture-diagrams.md:148` |
| Ajouter `ctaEligible`, `publishable`, `prerender` ou `diffusable` à l'état | Un seul drapeau gouverne l'exposition humaine |
| Renommer `SeoContentRouteState` ou ses champs | Brownfield absent de la spec, hors scope |
| Toucher le bloc CTA de fin d'article | C'est 16.4, sous D-09 |
| Créer un flux, une route `/rss.xml` ou une dépendance RSS | AD-08, AD-09, FR-15 hors release |
| Créer une surface de preview | Décision R1 non prise |
| Ajouter un événement, une propriété ou un paramètre de télémétrie | Frontière Epic 14, `tracking-plan.md` fait foi |
| Ajouter une dépendance npm | AD-08, PRD §12 |
| Toucher `/blog`, l'article ou la homepage **au-delà du changement de filtre** | 16.3, 16.4, 16.5 |
| Utiliser `npm` ou `yarn` ; lancer `pnpm` sur l'hôte | pnpm strict (NFR17). Jamais sur l'hôte |
| Lire `entry.sitemapExcluded` | Champ mort, supprimé en 16.1 |

### Testing Standards

- **Aucun framework de test n'est ajouté** (NFR25, PRD FR-17 « hors périmètre »).
- Validation = gate Docker + assertions CI existantes :
  `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
- La validation sémantique passe par des **fixtures temporaires** (story 16.6) — ne pas créer de fichier de test dans cette story.
- La preuve de synchronisation A/B est différée à 16.7 (confrontation d'artefacts), **car la couche A doit rester non importable** : elle ne peut pas être testée unitairement. 16.2 n'a donc aucun test unitaire à écrire, et son AC de validation est la gate verte plus les sondes ponctuelles de T8.8 et T8.9.
- Les fixtures ne sont **jamais** versionnées ni déployées ; leur suppression se vérifie par `git status` et une recherche de slugs.

### Project Structure Notes

Fichiers **UPDATE** :

| Fichier | Nature de la modification |
|---|---|
| `app/utils/blog-indexability.ts` | **Le cœur.** Couche A apprend `visibility` (T2) ; ajout de `BlogVisibilityState` et `resolveBlogVisibility` (T3). Un seul fichier, deux couches, dépendance B → A par appel direct. |
| `nuxt.config.ts` | Les prédicats des l. 562, 583-584, 869-870 deviennent des lectures d'état. **La forme de `SeoContentRouteState` est inchangée.** L. 573 et 863 ne sont pas touchées. |
| `app/pages/blog/index.vue` | Imports (l. 91) et filtre (l. 97). Comportement visible : les articles `sitemap: false` apparaissent. |
| `app/pages/index.vue` | Imports (l. 358) et filtre (l. 533). Idem pour le journal. |
| `app/pages/blog/[...slug].vue` | Imports (l. 85), gardes `production` (l. 107, 185), métadonnée `robots` (l. 257). **CTA non touché.** |
| `server/plugins/seo-content.ts` | Filtres sitemap (l. 38, 44) → `inSitemap`. Reste le propriétaire unique de la réconciliation. |
| `server/plugins/ai-ready-markdown.ts` | Filtre AEO (l. 64) → `!inSitemap`. |
| `server/middleware/aeo-content-visibility.ts` | 404 jumeau `.md` (l. 37) → `!inSitemap`, court-circuit prerender préservé. |
| `.github/workflows/cd.yml` | La matrice Python de `cd.yml:644-653` est alignée sur la matrice normative : `html_expected` et prise en compte de `visibility`. **Conditionnel à la décision bloquante.** |
| `docs/planning-artifacts/architecture-blog-editorial.md` | §4.1 (forme confirmée), §6.2 et §10 (bascule `/blog` + homepage en 16.2). Amendement imposé par §11.3. |
| `docs/specs/spec-blog-editorial/content-contract.md` | §2 : avertissement éditorial sur `sitemap` (T5.4). Cellule `sitemap` inchangée — la matrice était déjà correcte, c'est le code qui avait divergé. |
| `docs/implementation-artifacts/sprint-status.yaml` | `16-2-…: backlog` → `ready-for-dev`. |
| `docs/implementation-artifacts/16-2-resolver-de-visibility-deterministe.md` | Statut, cases, Dev Agent Record. |
| `docs/implementation-artifacts/deferred-work.md` | `defer` : surface de preview (R1), takedown sans porteur. |

Fichiers **NEW** : aucun.

**Écart assumé avec les Project Structure Notes d'origine.** La story prévoyait `content.config.ts` en UPDATE et aucun NEW. Le périmètre réel est `app/utils/blog-indexability.ts` plus les 7 fichiers appelants, et **aucun** fichier nouveau. Justification : l'architecture impose `app/utils/blog-indexability.ts` comme propriétaire unique de l'indexabilité, et son tableau de propriétaires interdit explicitement le « second prédicat » — un module voisin aurait été l'un ou l'autre.

**Écart assumé sur le périmètre des pages.** `architecture-blog-editorial.md:317,319` confie la bascule de `/blog` à 16.3 et celle de la homepage à 16.5. Cette story fait les deux, sur la base de `epics.md:1666` (« chaque état expose une réponse unique consommée par toutes les surfaces, sans qu'une page n'implémente son propre filtre »). L'architecture est amendée en T7.

Composants DS : aucun. Primitives UI : aucune. Story sans UI — NFR21 non applicable.

### References

| Source | Section |
|---|---|
| `docs/specs/spec-blog-editorial/content-contract.md` | §2 matrice frontmatter, §7 matrice de visibility T0 l. 173-185 (normative), §8 fixtures |
| `docs/planning-artifacts/architecture-blog-editorial.md` | AD-02, AD-03, AD-04, AD-07, AD-08, AD-09, §2 et §2.1-2.3, §3.1, §4.1, §4.2 l. 194-205, §4.3 D-09, §5 crawlLinks, §6.1-6.4, §7 propriétaires, §9, §10, §11.2-11.4 |
| `docs/planning-artifacts/epics.md` | Epic 16, story 16.2 l. 1651-1693, FR56 l. 1459, FR62, D-09 l. 1830-1850, CAP-6/7 l. 1447-1448, 16.3 / 16.5 |
| `docs/specs/spec-blog-editorial/SPEC.md` | CAP-6 l. 72-73, CAP-7, D-02 preview ratifié T0 l. 167 |
| `docs/specs/spec-blog-editorial/architecture-diagrams.md` | l. 86-98 flowchart du resolver, l. 148 « les pages ne doivent pas inventer leur propre filtre » |
| `docs/specs/spec-blog-editorial/.decision-log.md` | l. 88, l. 94 (preview = décision R1 non prise) |
| `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md` | §6.3 l. 479 (Preview ratifié T0) et l. 506-518 (matrice), FR-12 l. 332-333, FR-15 l. 357-365, glossaire l. 160-164 |
| `docs/specs/spec-blog-editorial/verification-plan.md` | l. 45-77 assertions, l. 99, l. 130 gate R1 RSS, l. 146-158 takedown |
| `docs/implementation-artifacts/16-1-contrat-de-contenu-minimal-et-migration-de-date.md` | Piège 4, tableau des Interdits, § Review Findings (décision D3 sur le registre de titres), § `visibility` inerte |
| `app/utils/blog-indexability.ts` | l. 1-8 type, l. 10-21 `hasNoindexDirective`, l. 24-28 `isSitemapExcluded`, l. 35-44 `isPublishedBlogEntry`, l. 49-58 sérialisation + garde, l. 59-61 retour anticipé, l. 63-91 date et Europe/Paris, l. 93-108 duplication, l. 112-118 `getBlogRobotsDirective` |
| `app/utils/blog-content-contract.ts` | l. 100 `visibility`, l. 248 `filter`, l. 249-256 `onUrl` |
| `node_modules/@nuxtjs/sitemap/dist/module.mjs` | l. 968 `filterFn.toString()`, l. 973 `onUrlFn.toString()` ; runtime `content-urls.js:17` |
| `nuxt.config.ts` | l. 62-66 `SeoContentRouteState`, l. 562, 573, 581-586, 850, 863, 867-870, l. 484-485 message de collision, l. 953 `crawlLinks` |
| `.github/workflows/cd.yml` | l. 67-78 liste des fixtures, l. 537-539 et 668-671 exclusions AEO, l. 593 `paris_today`, l. 644-653 matrice Python, l. 661 `assert not html.exists()` |
| `docs/implementation-artifacts/deferred-work.md` | § code review 16.1 : `visibility` inerte à fermer en 16.2 |

## Questions ouvertes

1. **La couche A apprend-elle `visibility` ?** → **Oui**, tranché (Piège 3). L'architecture ne tranche pas ; l'alternative est une fuite de contenu.

2. **Les noms de champs.** Le diagramme de l'architecture utilise `renderable` et `robotsDirective`, son §4.1 utilise `production` et `robots`. La table normative §4.2 emploie les seconds. **T3.1 retient §4.1.** Si Simon préfère `renderable`, 16.3 / 16.4 / 16.5 doivent coder contre le même nom.

3. **La homepage bascule-t-elle en 16.2 ?** → **Oui** (T4.3), au risque d'un FR59 mal lu. La colonne « Listes et homepage » de la matrice couvre explicitement la homepage, et laisser cette page sur son ancien prédicat créerait un second filtre.

4. **Combinaisons multiples — où les prouver ?** Aucune des 11 fixtures de 16.6 ne couvre une combinaison (`noindex` + `sitemap: false`). L'AC #7 se prouve par documentation du comportement dans le fichier (T3.11) et par la sonde T8.8, **pas** par fixture. À arbitrer en 16.6 si une fixture dédiée est souhaitée.

## Dev Agent Record

### Agent Model Used

`space-bunny-free` (OpenCode), exécution via le workflow `bmad-dev-story`. Story implémentée et
validée dans une séquence unique, sans interruption.

### Debug Log References

Toutes les validations ont été exécutées dans le conteneur Docker
(`docker compose run --rm web sh -c …`). Aucun `pnpm`/`npm`/`yarn`/`nuxi` sur l'hôte (NFR16, NFR17).

| # | Tâche | Commande / sonde | Résultat |
| --- | --- | --- | --- |
| T8.1 | lint + typecheck | `pnpm lint && pnpm typecheck` | **0 erreur** (après correction du narrowing, voir Completion Notes) |
| T8.2 | build corpus vide | `rm -rf .data .nuxt && pnpm exec nuxi prepare && pnpm generate` | **code 0**, 42 routes prérendues, `/blog` présent |
| T8.3 / T8.4 | 7 fixtures + purge d'index | 7 fixtures `__t8-*` à `title` unique, `rm -rf .data` avant build | **code 0** |
| T8.5 | `visibility: private` absent des 5 surfaces | script d'inspection sur `.output/public` | **conforme** : ni `blog/<slug>/index.html`, ni `sitemap.xml`, ni `llms.txt`, ni `llms-full.txt`, ni `sitemap.md`, ni jumeau `.md`, ni mention dans les listes. Marqueur de corps `MARQUEUR_T8___t8-private` absent de **tout** le bundle. |
| T8.6 | `sitemap: false` présent HTML + découvrable | idem | **conforme** : `blog/<slug>/index.html` produit, listé dans `blog/index.html` **et** `index.html`, absent du sitemap, de `llms.txt`, de `llms-full.txt` (section propre), de `sitemap.md` et du jumeau `.md` ; aucun lien `alternate` cassé. |
| T8.7 a | matrice complète | inspection des 7 lignes | **conforme** (56 assertions) |
| T8.7 b | non-régression CI | **extraction littérale** des blocs `Generate` (l. 66-250) et d'assertions Python (l. 421-708) de `cd.yml`, rejoués par `bash` | **ASSERTIONS CI VERTES** |
| T8.7 c | clean build | corpus vide réinstallé | **code 0**, `CNAME` = `jouan.ovh`, `_headers` présent, aucune fixture dans le bundle |
| T8.8 | totale du resolver | sonde conteneur : `null`, `undefined`, `{}`, `{visibility:"secret"}`, `{date:42}`, `{date:"2026-02-30"}`, `0`, `"chaine"`, `[]` | **9/9 → `production:"absent"`, aucun `throw`** |
| T8.8 | 7 lignes + combinaisons | sonde conteneur | **8/8 lignes exactes** ; `noindex + sitemap:false` → rang 2 ; `private + noindex + sitemap:false` → absent/`undefined`/`false` |
| T8.9 / T2.4 | autonomie de la couche A | `isIndexableBlogEntry.toString()` inspecté | **aucune** référence à `isSitemapExcluded`, `hasNoindexDirective`, `isPublishedBlogEntry`, `getBlogRobotsDirective`, `resolveBlogVisibility`, `BlogIndexabilityEntry`, ni constante de module ; regex de date et `Europe/Paris` inline ; aucun `import` |
| T8.10 | propreté | `git status --porcelain` | **aucune fixture, aucun script temporaire** |

**Piège d'environnement rencontré et documenté (non un défaut de la story).** Les premiers
builds de validation étaient lancés avec le `NUXT_SITE_ENV=development` du `.env` local, alors
que la CI impose `production` (`cd.yml` l. 23-25). Deux conséquences **étrangères à 16.2** :

1. `@nuxtjs/sitemap` ne collectait alors que les URLs de la source Content — le `sitemap.xml`
   ne contenait aucune des 8 routes publiques, et l'assertion `expected.issubset(locs)` échouait.
   Vérifié **préexistant** : l'état d'avant 16.2 (16.1 appliqué, code 16.2 en `git stash`) produit
   le même sitemap réduit.
2. `@nuxtjs/robots` émet un `<meta name="robots" content="noindex, nofollow">` **sur toutes les
   pages** hors production. Ce n'est donc pas un défaut du site : en `production`, les pages
   publiques reçoivent `index, follow, max-image-preview:large, …` et seul un article `noindex`
   reçoit `noindex, nofollow`. Vérifié aussi sur les artefacts : `__ci-seo-sitemap-excluded`
   reçoit bien `index, follow, …` — `sitemap: false` **n'émet pas** de `noindex`, conforme à la
   matrice.

Le harnais de validation a été recalé sur l'environnement de la CI ; toutes les valeurs
« conformes » rapportées ci-dessus sont sous `NUXT_SITE_ENV=production`. `python3` a dû être
installé éphémèrement dans l'image de dev (`node:22-bookworm-slim` n'en fournit pas) pour rejouer
les assertions Python ; le runner GitHub en dispose nativement.

### Completion Notes List

**Résultat : les 13 AC sont satisfaits.** Aucun framework de test ajouté (NFR25), aucune
dépendance, aucun événement ni propriété de télémétrie (frontière Epic 14), `package.json`,
`CNAME` et `_headers` intacts.

- **AC #1, #6, #7** — `resolveBlogVisibility` (couche B) implémente les 7 lignes de la matrice
  `architecture-blog-editorial.md` §4.2. Précédence résolue dans l'ordre : `draft` / date future /
  `visibility: private` → `production:"absent"` ; puis `noindex` / robots noindex ; puis
  `sitemap: false` / `null` → `inSitemap:false` seul. Le resolver ne lève jamais et documente le
  comportement « entrée inconnue → état le plus restrictif » dans son en-tête, avec la table, la
  précédence et le mapping `prerender`/`indexable`.
- **AC #2, #3** — `discoverable` est une **troisième** prédication, jamais un alias :
  `discoverable = isIndexableBlogEntry(entry)` est explicitement documenté comme interdite. Aucun
  second drapeau dans l'état (ni `ctaEligible`, ni `publishable`, ni `indexable`, ni `diffusable`,
  ni `prerender`, ni `preview`).
- **AC #4** — Couche A rendue **totale** en plus d'inconditionnelle : `(entry ?? {})`, donc
  `isIndexableBlogEntry(null)` vaut `false` au lieu de lever une `TypeError` (ce qui était le cas
  avant cette story). `isSitemapExcluded`, `isPublishedBlogEntry` et `getBlogRobotsDirective` ont
  reçu la même garde. La signature `isIndexableBlogEntry(entry, now?)` est inchangée, la fonction
  n'importe rien et la sonde T8.9 confirme l'absence de toute référence externe dans son corps
  sérialisé.
- **AC #5** — `visibility: private` est réellement privé : absent du HTML, du sitemap, de
  `llms.txt`, de `llms-full.txt`, de `sitemap.md`, du jumeau `.md`, des listes **et** de tout
  marqueur de corps dans le bundle. La réserve reportée par 16.1 est close.
- **AC #8** — Mapping nominatif appliqué dans `nuxt.config.ts` (scan et hook) :
  `prerender: state.production === "present"` et `indexable: state.inSitemap`. La forme de
  `SeoContentRouteState` est **inchangée** (`{ prerender, indexable, source? }`).
- **AC #9** — Les 13 points de contact migrés. `defineSitemapSchema({ filter })` reste
  `isIndexableBlogEntry` (sérialisé). Le registre de titres (l. 579 et 874) reste sur
  `isIndexableBlogEntry` : l'unicité de `title` est un contrat de données, pas une surface de
  visibilité (Piège 5), et l'interdit est commenté sur place pour éviter la re-confusion à la
  revue. `isSitemapExcluded` **survit** (interdit explicite) ; il perd ses deux appelants dans
  `nuxt.config.ts` puisque le resolver exprime désormais l'exclusion, et sa raison d'être est
  documentée dans le module.
- **AC #10** — `production:"absent"` → 404 sur les trois causes, indiscernables pour le visiteur ;
  l'erreur de requête Content reste un 500 et n'est jamais masquée.
- **AC #11** — Aucune surface de preview : ni champ, ni branche, ni route. Consigné en `defer`.
- **AC #12** — `feedable` existe, vaut `inSitemap`, n'est consommé par rien, et le commentaire
  porte la frontière FR-15 / AD-09.
- **AC #13** — Gate Docker à 0 erreur. Deux amendements CI indispensables (voir ci-dessous).

**Changement de comportement visible, voulu par la décision de cadrage du 2026-09-27.** Un
article `sitemap: false` / `null` est désormais **prérendu en HTML 200** et **listé** sur `/blog`
et dans le journal de la homepage. C'est la correction directe de la divergence
`nuxt.config.ts` (`prerender: !sitemapExcluded`) / `cd.yml` (`html_expected = published and not
sitemap_excluded`), tous deux alignés depuis cette story sur la matrice normative.

**Amendements CI necessity (T5.1, T5.2, T5.3) — deux, pas un.**

1. `html_expected` devient `production`, et la matrice Python apprend `visibility`. Sans cela, une
   fixture `private` serait traitée comme publiée et échouerait à `assert not html.exists()`.
   `indexable` s'appuie désormais sur `production` et non sur `published`.
2. **Les deux assertions `… not in llms_full_text` ne pouvaient plus être littérales.** Elles
   exigeaient que la chaîne `/blog/<slug>` soit absente de `llms-full.txt`, or ce fichier
   incorpore le rendu des pages publiques — donc la liste `/blog`. Un article `sitemap: false` y
   est **mentionné** par sa carte, ce qui est exactement la conséquence voulue de
   `discoverable: true`. Elles vérifient désormais l'absence de la **section AEO propre** à
   l'article, discriminée par sa ligne `- **Source :** <loc>`, qui reste absente. T5.3 demandait
   explicitement que les deux propriétés tiennent simultanément ; l'ancienne forme ne pouvait pas
   les exprimer. `llms.txt` et `sitemap.md` ne sont pas touchés : ils ne portent que des liens
   `.md`, et les articles exclus y restent absents (vérifié).

**Écarts assumés par rapport à l'énoncé de la story, tous documentés.**

- `!metadata ||` a été **conservé** dans le scan de `nuxt.config.ts` (ligne 566). Le resolver est
  total, donc ce test est sémantiquement redondant : il ne reste que pour porter le narrowing
  TypeScript des lectures `metadata.title` suivantes. Le commentaire le dit explicitement.
- `isPublishedBlogEntry` et `isSitemapExcluded` n'ont **plus aucun appelant** dans le dépôt après
  la migration des 13 points de contact. Ils ne sont pas supprimés : T2.3 impose de modifier le
  premier, et l'interdit protège le second. Les deux documentent désormais leur statut exact dans
  le module, et la sonde vérifie explicitement la parité `production === isPublishedBlogEntry`.
  C'est un choix de la story, pas une inadvertance — à confirmer en revue.
- La story annonçait 7 fixtures temporaires ; 8 lignes ont été couvertes (`sitemap: false` **et**
  `sitemap: null`) dans la sonde, pour ne pas laisser un alias de la ligne 6 non prouvé.

**Prochaine étape attendue (hors périmètre de cette story).** 16.4 doit conditionner le CTA de fin
d'article à `state.discoverable` (D-09) : le bloc `.article__cta` est resté **inconditionnel**,
conformément à T4.4. 16.3 et 16.5 travaillent désormais sur des pages déjà branchées sur le
resolver ; l'architecture est amendée en conséquence (T7).

### File List

Fichiers **modifiés** (chemins relatifs à la racine du dépôt) :

- `app/utils/blog-indexability.ts` — cœur : couche A (`visibility`, totale, `visibility` dans
  `isPublishedBlogEntry`) + couche B (`BlogVisibilityState`, `resolveBlogVisibility`).
- `nuxt.config.ts` — l. 3 (imports), 565-570 et 587-591 (scan), 858-880 (hook) : lectures d'état
  et mapping nominatif. L. 579 et 874 (registre de titres) inchangés.
- `app/pages/blog/index.vue` — l. 91-100 : filtre `discoverable` + commentaire.
- `app/pages/index.vue` — l. 358, 528-535 : filtre `discoverable` + commentaire.
- `app/pages/blog/[...slug].vue` — l. 85, 107, 181-189, 259 : `production` pour la garde 404 et la
  télémétrie, `state.robots` pour la métadonnée. **CTA non touché.**
- `server/plugins/seo-content.ts` — l. 1, 38, 44 : `inSitemap`.
- `server/plugins/ai-ready-markdown.ts` — l. 2, 64 : `inSitemap`.
- `server/middleware/aeo-content-visibility.ts` — l. 2, 7-9, 37 : `inSitemap`, court-circuit
  `import.meta.prerender` préservé.
- `.github/workflows/cd.yml` — l. 429-431 (`canonical_origin` remonté), 539-545 et 676-681 :
  matrice Python alignée sur la matrice normative.
- `docs/planning-artifacts/architecture-blog-editorial.md` — §4.1 (forme confirmée), §6.2 (bascule
  `/blog` + homepage en 16.2, avec bandeau d'amendement), §10 (traçabilité), §11.2 (limite levée).
- `docs/specs/spec-blog-editorial/content-contract.md` — §2, cellule `sitemap` : avertissement
  éditorial de la décision de cadrage.
- `docs/implementation-artifacts/deferred-work.md` — `defer` preview (R1), takedown, preuve de
  synchronisation A/B ; réserve 16.1 sur `visibility` soldée.
- `docs/implementation-artifacts/sprint-status.yaml` — `16-2` : `ready-for-dev` → `review`.
- `docs/implementation-artifacts/16-2-resolver-de-visibility-deterministe.md` — statut, cases,
  Dev Agent Record, File List, Change Log.

Fichiers **non créés** : aucun (conforme aux Project Structure Notes). Les scripts de validation
(`.t8-*.sh`, `.t8-probe.ts`) et les 7 fixtures `__t8-*` ont été **supprimés** et vérifiés par
`git status` (T8.10) ; ils n'ont jamais été versionnés.

### Change Log

| Date | Version | Description |
| --- | --- | --- |
| 2026-09-27 | 16.2.0 | Résolver de visibility déterministe livré : couche A apprise `visibility` et rendue totale, couche B `resolveBlogVisibility` à 5 champs, 13 points de contact migrés, matrice Python de la CI alignée sur la matrice normative, architecture et contrat amendés. `sitemap: false` produit désormais un HTML 200 et reste listé (décision de cadrage du 2026-09-27). |
| 2026-09-27 | 16.2.1 | **Revue de code** (3 couches parallèles) : 2 `decision-needed` tranchés (D5 réécriture du texte normatif `sitemap`, D6 registre de titres sur `state.discoverable`), 17 patchs appliqués, 7 `defer` consignés, 3 faux positifs rejetés. Correctifs de fond : fixture CI `visibility: private` ajoutée (l'AC #5 n'avait aucune couverture), `SEO_ROUTE_CACHE_VERSION` relevé à 2, AD-03 et le diagramme §4 amendés (la dépendance B → A était factuellement fausse), polarité de `ai-ready-markdown.ts` restaurée, `assertion llms-full.txt` reforcée pour les fixtures non découvrables, test calendaire aligné sur `setUTCFullYear`, garde `NaN` sur `now`, deux dates de référence dans le resolver. **Statut maintenu `in-progress` : gate Docker non rejouée.** |


# Investigation: Brief éditorial du blog

## Hand-off Brief

1. **What happened.** Le brief demande une extension du blog existant, mais la date de publication, les routes, le SEO/AEO et la politique de prérendu sont des contrats transverses déjà implémentés.
2. **Where the case stands.** Investigation conclue : le brief n'est pas un simple ajout de pages ; `date`, `project`, `related`, `seo`, les hubs et RSS nécessitent des décisions et une migration coordonnée avant tout code.
3. **What's needed next.** Utiliser `bmad-spec` pour verrouiller ces contrats, stabiliser l'Epic 14 dans un checkpoint séparé, puis exécuter le plan Docker uniquement après validation de la SPEC.

## Case Info

| Field            | Value |
| ---------------- | ----- |
| Ticket           | N/A — brief libre fourni dans la conversation |
| Date opened      | 2026-09-24 |
| Status           | Concluded |
| System           | macOS ; projet Nuxt statique validé via Docker ; branche `develop` |
| Evidence sources | Brief utilisateur dans la conversation, code source, configuration, artefacts BMad, Git, documentation projet |

## Problem Statement

Le brief décrit un nouveau blog éditorial durable autour de trois piliers (`ai-systems`, `software-engineering`, `automation`), avec hubs, métadonnées éditoriales, relations article/projet, SEO par article, RSS et distribution. L'hypothèse initiale est qu'il s'agit d'une fonctionnalité nouvelle à construire ; l'investigation doit vérifier cette hypothèse contre l'implémentation existante et les contraintes du dépôt.

## Evidence Inventory

| Source | Status | Notes |
| ------ | ------ | ----- |
| Archives de diagnostic / logs | Missing | Aucun incident ou log runtime fourni ; non nécessaire pour cette exploration de périmètre |
| Ticket / issue tracker | Missing | Le brief est une entrée libre, sans ticket |
| Version control | Available | Historique récent, diff de travail et statut Git consultés |
| Test results | Missing | Aucun framework ni rapport de test actuel ; les artefacts CI sont des scripts, pas des résultats d'exécution locale |
| Static analysis | Partial | `git diff --check` passe ; aucune gate lint/typecheck n'a été relancée pendant cette étape |
| Source code | Available | Routes, schéma, données, SEO, AEO, CI et composants inventoriés |
| Brief éditorial fourni dans la conversation | Available | Entrée de référence ; aucun fichier local `pasted-context-1.txt` détecté |
| `app/pages/blog/index.vue` | Available | Index existant, requête Content et filtrage des entrées |
| `app/pages/blog/[...slug].vue` | Available | Route article dynamique, SEO, rendu Markdown et gestion des erreurs |
| `content.config.ts` | Available | Collection `blog` et schéma de métadonnées existant |
| `package.json` | Available | Versions Nuxt/Content/SEO, scripts et absence de framework de tests |
| `app/data/site.ts` | Available | Source unique du profil et des projets |
| `app/pages/about.vue` | Available | Page auteur existante sous `/about` |
| `app/utils/blog-indexability.ts` | Available | Filtrage partagé des drafts, dates futures, noindex et sitemap |
| `server/plugins/seo-content.ts` | Available | Réconciliation Content/sitemap autour de `date` et `updated` |
| `nuxt.config.ts` | Available | Configuration Content, SEO, AI Ready et pré-rendu |
| `docs/project-context.md` | Available | Règles d'architecture, Docker, design system et état du projet |
| `docs/implementation-artifacts/sprint-status.yaml` | Available | État Epic 6 et Epic 14 |
| `git status --short --branch` | Available | Changements non commités liés notamment à Epic 14 |
| `.github/workflows/cd.yml` | Available | Gate CI, fixtures Content temporaires et assertions sitemap/AEO |
| `app/pages/index.vue` | Available | La homepage consomme déjà les trois derniers articles indexables |
| `public/images/blog/**` | Missing | Aucun asset blog dédié n'est présent |
| Journal d'audit Google Search Console / trafic | Missing | Nécessaire uniquement pour valider des résultats de production, pas le fonctionnement local |
| Test results / historique de production récent | Missing | Aucun framework de test n'est configuré ; la gate sera la preuve principale |

## Investigation Backlog

| # | Path to Explore | Priority | Status | Notes |
| - | --------------- | -------- | ------ | ----- |
| 1 | Comparer le modèle de métadonnées demandé au schéma Content actuel | High | Done | `date`/`updated` sont les champs actifs ; `publishedAt` n'est pas consommé |
| 2 | Cartographier les routes, hubs, projets et page auteur existants | High | Done | `/blog`, route article et `/about` existent ; hubs et routes projet sont absents |
| 3 | Vérifier les propriétaires SEO/AEO des articles, sitemap, robots et exports Markdown | High | Done | `usePageSeo`, Content/Sitemap/Robots, AI Ready et assertions CI sont identifiés |
| 4 | Examiner le comportement des drafts, articles futurs, noindex et absence de route publique | High | Done | `blog-indexability.ts` et fixtures CI couvrent le contrat existant ; l'accès direct aux exclusions reste à décider |
| 5 | Recenser les composants UI réutilisables et les contraintes responsive/a11y | Medium | Done | Les primitives globales, composants UI et layout existants sont inventoriés ; aucune nouvelle primitive n'est justifiée |
| 6 | Vérifier l'absence ou la présence de RSS, recherche, relations projet et fixtures | Medium | Done | RSS, recherche et pages projet ne sont pas présents ; fixtures CI existantes confirmées |
| 7 | Examiner l'état Git et la séparation avec les travaux Epic 14 | High | Done | Le working tree contient des changements Epic 14 non commités ; aucun commit de blog ne doit être mélangé |
| 8 | Vérifier le comportement réel des routes dans un build Docker si les données statiques ne suffisent pas | Medium | Blocked | La gate doit attendre la SPEC et un contrat de fixture publiée |
| 9 | Tracer la propagation de `date`/`publishedAt` dans Content, AEO, sitemap, JSON-LD et CI | High | Done | Migration transverse confirmée ; alias ou renommage atomique requis |
| 10 | Vérifier les collisions de routes hubs/article et la matrice d'URLs | High | Done | Les hubs statiques explicites sont la voie compatible avec le catch-all |
| 11 | Valider la sémantique de `seo`, `project`, `related` et `featured` | High | Open | Arbitrage de SPEC nécessaire avant validation Zod inter-fichiers |
| 12 | Décider la politique de preview et d'accès direct aux entrées exclues | High | Open | Aucun preview public ne doit être inventé implicitement |
| 13 | Vérifier la production SEO/AEO, trailing-slash et déploiement GitHub Pages | Medium | Open | Nécessite des probes HTTP post-merge ; les artefacts locaux ne suffisent pas |
| 14 | Valider le contrat RSS et son propriétaire statique | Medium | Open | Décision produit puis fixture/assertion CI |

## Timeline of Events

| Time | Event | Source | Confidence |
| ---- | ----- | ------ | ---------- |
| 2026-06-23 | Les stories 6.1 et 6.2 sont documentées comme livrées | `docs/implementation-artifacts/6-1-index-du-blog-et-empty-state.md:5-7` ; `docs/implementation-artifacts/6-2-vue-article-prose-et-code.md:5-7` | Confirmed |
| 2026-09-18 | Le projet est documenté comme exploité avec Nuxt 4, Content v3, SEO et AEO | `docs/project-context.md:23-30` | Confirmed |
| 2026-09-24 | Le brief blog est fourni pour cadrer une évolution | Conversation utilisateur | Confirmed |
| 2026-09-24 | Le registre indique Epic 14 en cours et 14.6 en revue | `docs/implementation-artifacts/sprint-status.yaml:148-156` | Confirmed |
| 2026-09-24 | La CI crée des fixtures blog temporaires, dont des articles publiés, noindex, drafts et futurs, puis vérifie les sorties statiques | `.github/workflows/cd.yml:55-180` | Confirmed |
| 2026-09-24 | La homepage consomme déjà les trois derniers articles indexables | `app/pages/index.vue:527-533` | Confirmed |
| 2026-09-24 | La CI supprime ses fixtures temporaires après validation | `.github/workflows/cd.yml:521-523` | Confirmed |
| 2026-09-24 | Une trace d'audit déléguée confirme que `date` est consommé par le schéma, les listes, le scan Nitro, le sitemap, l'AEO et la CI | `content.config.ts:21-89` ; `app/utils/blog-indexability.ts:34-81` ; `nuxt.config.ts:303-343` ; `server/plugins/seo-content.ts:41-69` ; `.github/workflows/cd.yml:453-505` | Confirmed |
| 2026-09-24 | Une trace d'audit déléguée identifie un risque de collision entre hubs `/blog/*` et le catch-all article | `app/pages/blog/[...slug].vue:86-98` | Confirmed |
| 2026-09-24 | Une lecture seule de la production a signalé des redirections trailing-slash alors que les canonicals générés sont sans slash ; les logs HTTP bruts restent à joindre | `app/composables/usePageSeo.ts:43-45` ; `.github/workflows/cd.yml:398-414` | Deduced / à confirmer |
| 2026-09-24 | Les artefacts SEO/AEO locaux ont été inspectés, mais la story 14.6 reste en revue et la production n'est pas une preuve du nouveau contrat | `docs/implementation-artifacts/14-6-aeo-ai-ready-llms-markdown-oai-searchbot.md:118-118` ; `.github/workflows/cd.yml:525-531` | Confirmed |

## Confirmed Findings

### Finding 1: Une infrastructure blog de base existe déjà

**Evidence:** `app/pages/blog/index.vue:84-98` ; `app/pages/blog/[...slug].vue:93-98` ; `content.config.ts:10-14`

**Detail:** Le dépôt possède une collection Content, une page d'index et une route article dynamique. Le brief ne part donc pas d'une absence totale de blog ; il décrit une extension de cette infrastructure.

### Finding 2: Le schéma Content actuel est différent du modèle du brief

**Evidence:** `content.config.ts:16-52`

**Detail:** Le schéma utilise actuellement `date`, `updated`, `tags`, `read` et `image`. Le brief propose notamment `publishedAt`, `pillar`, `format`, `goals`, `author`, `project`, `featured`, `related` et d'autres champs optionnels. Une migration ou une couche de compatibilité est nécessaire. L'inventaire des consommateurs confirme que `date` est le contrat actif de l'application, du hook SEO et de la CI (`app/pages/blog/index.vue:96` ; `app/pages/blog/[...slug].vue:229-230` ; `server/plugins/seo-content.ts:52-53` ; `.github/workflows/cd.yml:459-485`).

### Finding 3: Les projets et le profil ont déjà une source de vérité applicative

**Evidence:** `app/data/site.ts:13-38` ; `app/data/site.ts:40-132`

**Detail:** `SITE.profile` et `SITE.projects` centralisent les informations partagées du site. Le brief ne justifie pas immédiatement la création de collections `authors/` et `projects/` qui dupliqueraient ces données.

### Finding 4: La page auteur existante est `/about`

**Evidence:** `app/pages/about.vue:1-7` ; `app/pages/about.vue:155-184`

**Detail:** La page auteur actuelle est `about.vue`, servie sous `/about`, et possède déjà un JSON-LD `ProfilePage`. Le brief demande `/a-propos` ; ce point constitue un conflit d'URL à arbitrer, pas une évidence d'implémentation.

### Finding 5: Les mécanismes SEO/AEO sont déjà présents

**Evidence:** `app/composables/usePageSeo.ts:34-109` ; `app/pages/blog/[...slug].vue:210-259` ; `docs/project-context.md:72-78`

**Detail:** Le projet possède un helper SEO centralisé, un `BlogPosting` article, une intégration sitemap/robots via Nuxt SEO et une couche AI Ready. Le brief doit étendre ces chemins, pas créer un second propriétaire des métadonnées ou des routes SEO.

### Finding 6: Le contenu blog est actuellement vide

**Evidence:** `docs/project-context.md:65-78` ; inventaire `content/` ; `app/pages/blog/index.vue:63-78`

**Detail:** Aucun article Markdown n'est présent dans le répertoire de contenu actuel. Les quatre fixtures du brief étant toutes des drafts, elles ne suffiraient pas à valider une route article publique, le RSS, le sitemap et le SEO final. La CI injecte toutefois des fixtures temporaires pendant le build, dont deux articles publiés, afin de valider les contrats SEO/AEO (`.github/workflows/cd.yml:55-180`).

### Finding 7: La CI possède déjà un schéma de fixtures et d'exclusions

**Evidence:** `.github/workflows/cd.yml:55-180` ; `.github/workflows/cd.yml:365-381`

**Detail:** La CI crée des fixtures publiées, noindex, `robots: false`, `sitemap: false`, drafts et futures, puis vérifie leur absence des artefacts publics. Ce schéma est réutilisable pour valider la nouvelle taxonomie sans versionner de faux articles.

### Finding 8: La homepage dépend déjà du flux blog

**Evidence:** `app/pages/index.vue:250-305` ; `app/pages/index.vue:527-533`

**Detail:** La homepage affiche les trois derniers articles indexables. Une refonte du modèle, des dates ou du comportement des drafts peut donc régresser la page d'accueil, pas seulement `/blog`.

### Finding 9: Il n'existe pas de route RSS ni de route projet dans l'inventaire actuel

**Evidence:** `app/pages/**` ; `server/**` ; inventaire `public/images/blog/**`

**Detail:** Le dépôt ne contient pas de route `/rss.xml`, pas de pages `/projets/<slug>` et pas d'assets blog dédiés. Ces éléments sont donc à traiter comme du nouveau périmètre, et non comme une réadaptation de code existant.

### Finding 10: La page auteur n'est pas encore une page auteur éditoriale

**Evidence:** `app/pages/about.vue:1-107` ; `app/data/site.ts:13-48`

**Detail:** `/about` présente le profil, la bio, la stack et le CV, mais ni derniers articles ni carte auteur éditoriale. Le type `IProfile` contient notamment Malt et des coordonnées, mais pas de champs GitHub/LinkedIn ; ces données ne doivent pas être inventées et devront être confirmées ou laissées hors scope.

### Finding 11: La page article ne contient pas encore les éléments éditoriaux du brief

**Evidence:** `app/pages/blog/[...slug].vue:5-69`

**Detail:** La vue article actuelle affiche un lien de retour, les tags, le titre, la date, le temps de lecture, l'image, la prose et un CTA global. Elle ne contient pas encore les pillars/formats, breadcrumbs, sources, related, auteur, contexte projet ni navigation éditoriale.

### Finding 12: La homepage blog actuelle est une liste simple, pas une homepage éditoriale

**Evidence:** `app/pages/blog/index.vue:1-81`

**Detail:** L'index actuel se compose d'un en-tête, d'une liste de cartes, d'un état d'erreur et d'un empty-state. Les sections `Commencer ici`, les sélections par pilier, les hubs et les contenus recommandés du brief restent à construire.

### Finding 13: Le dépôt fournit un contrat de validation par gate, mais non un framework de tests dédié

**Evidence:** `package.json:7-16` ; `.github/workflows/cd.yml:47-53` ; `docs/project-context.md:187-192`

**Detail:** Les scripts disponibles sont `lint`, `typecheck` et `generate`; aucun script `test` ni framework Vitest/Jest/Playwright n'est configuré. La validation blog devra s'intégrer à la gate existante et aux assertions CI, sans créer une infrastructure de tests uniquement pour ce brief.

### Finding 14: Le renommage de `date` est une migration transverse, pas un changement de schéma

**Evidence:** `content.config.ts:21-30,86-89` ; `app/utils/blog-indexability.ts:34-81` ; `app/pages/blog/index.vue:95-98` ; `app/pages/index.vue:527-533` ; `nuxt.config.ts:303-343,531-576` ; `server/plugins/seo-content.ts:41-69` ; `.github/workflows/cd.yml:453-505`

**Detail:** `date` est utilisé pour la validation, la date future Europe/Paris, le tri des deux listes, la route article, le scan de prérendu, le sitemap, l'AEO et les assertions CI. Modifier uniquement `content.config.ts` produirait un contrat incohérent ou un build cassé.

### Finding 15: Les nouveaux champs optionnels ne deviennent fonctionnels que s'ils sont consommés explicitement

**Evidence:** `content.config.ts:15-89` ; `app/pages/blog/index.vue:12-45` ; `app/pages/blog/[...slug].vue:8-68` ; `nuxt.config.ts:118-186`

**Detail:** Ajouter `pillar`, `format`, `goals`, `project`, `featured` ou `related` au schéma ne les rend ni visibles, ni filtrables, ni structurés dans le HTML ou les exports AEO. Chaque champ doit avoir un consommateur ou rester explicitement interne.

### Finding 16: Le support imbriqué `seo.robots` n'est pas de bout en bout

**Evidence:** `app/utils/blog-indexability.ts:6,74-81,84-99` ; `content.config.ts:61-89` ; `nuxt.config.ts:328-343` ; `.github/workflows/cd.yml:462-472`

**Detail:** Les helpers reconnaissent `seo.robots`, mais le schéma, le scan de prérendu et les assertions CI ne définissent pas ce chemin de manière commune. Le contrat `seo` doit être formellement tranché, mappé dans `usePageSeo` et testé, ou retiré du périmètre.

### Finding 17: Une relation projet exploitable exige une clé stable et une destination

**Evidence:** `app/data/site.ts:26-38,73-105` ; `app/pages/index.vue:175-232` ; `app/components/FooterComponent.vue:33-42`

**Detail:** `IProject` n'a pas d'`id` ou de slug et les cartes actuelles ne sont pas des liens vers des pages projet. Le nom humain seul ne constitue pas une relation éditoriale fiable ; il faut ajouter une clé publique ou ne pas exposer de lien projet dans le MVP.

### Finding 18: `related`, `featured` et les hubs doivent réutiliser le contrat de publication

**Evidence:** `app/pages/blog/index.vue:93-98` ; `app/pages/index.vue:527-533` ; `app/utils/blog-indexability.ts:16-99` ; `nuxt.config.ts:592-615`

**Detail:** Les listes actuelles filtrent les entrées non publiques, mais il n'existe pas encore de validateur pour les cibles `related` ou les sélections de hubs. Une relation vers un draft, une date future, un noindex ou une URL absente pourrait s'exposer via une nouvelle surface.

### Finding 19: Les hubs ne doivent pas être de simples documents Content à `/blog/<slug>`

**Evidence:** `content.config.ts:10-14` ; `app/pages/blog/[...slug].vue:86-98` ; `app/pages/blog/[...slug].vue:40-43`

**Detail:** Une entrée Markdown `/blog/ia` serait traitée comme un article par le catch-all. Des pages de hub explicites, par exemple sous `app/pages/blog/*/index.vue`, sont nécessaires pour conserver leur propre layout, requête et SEO.

### Finding 20: RSS est une nouvelle surface de distribution, pas un sous-produit AEO

**Evidence:** `package.json:18-44` ; `nuxt.config.ts:419-464` ; `app/composables/usePageSeo.ts:71-92` ; `.output/public/llms.txt:15-20`

**Detail:** Aucun module ou route RSS n'existe. Il faudra choisir un propriétaire unique, générer le flux au build pour GitHub Pages, découvrir le flux dans le head, exclure les contenus non publics et vérifier son MIME en production.

### Finding 21: Les exclusions sitemap ne sont pas actuellement protections suffisantes pour les HTML directs

**Evidence:** `nuxt.config.ts:331-343` ; `app/pages/blog/[...slug].vue:178-195` ; `app/utils/blog-indexability.ts:85-99` ; `server/middleware/aeo-content-visibility.ts:12-35`

**Detail:** Le build statique n'expose pas les routes explicitement exclues, mais la route article ne refuse que les entrées non publiées. En runtime Node/dev, une entrée `sitemap: false` ou `sitemap: null` peut encore être demandée directement. Le brief doit définir une politique de preview/publication explicite.

### Finding 22: Le travail SEO/AEO local ne vaut pas preuve de déploiement

**Evidence:** `docs/implementation-artifacts/14-6-aeo-ai-ready-llms-markdown-oai-searchbot.md:118-118` ; `.github/workflows/cd.yml:525-531` ; `.output/public/sitemap.xml:3-45`

**Detail:** Les artefacts locaux sont un instantané de travail, tandis que la publication se produit depuis `main`. Les futures URLs, le sitemap, robots, les Markdown et le RSS devront être vérifiés après merge et déploiement.

### Finding 23: La logique de publication est dupliquée dans plusieurs couches

**Evidence:** `app/utils/blog-indexability.ts:16-99` ; `nuxt.config.ts:311-343,534-559` ; `.github/workflows/cd.yml:453-487`

**Detail:** La date, le draft, le noindex, le robots et le sitemap sont interprétés par le helper, le scanner de configuration, le hook Content et le script Python CI. Ajouter un nouveau champ de publication ou une nouvelle exclusion sans mettre à jour ces quatre chemins peut produire un build vert mais une découverte incohérente.

### Finding 24: Les hubs Vue ne suivent pas automatiquement le chemin d'état Content

**Evidence:** `nuxt.config.ts:265-300,311-343,561-576` ; `content.config.ts:10-14`

**Detail:** `contentRouteState` ne mémorise que les fichiers Markdown `content/blog/**`. Des pages de hub Vue devront être incluses explicitement dans la découverte sitemap/robots et leur propre SEO, elles ne seront pas couvertes par le scan Content.

### Finding 25: Le crawler statique peut amplifier une relation non filtrée

**Evidence:** `nuxt.config.ts:592-615` ; `app/pages/blog/index.vue:93-98` ; `app/pages/index.vue:527-533`

**Detail:** `crawlLinks: true` suit les liens présents dans le HTML. Les listes actuelles sont filtrées, mais un futur bloc `related`, un lien de hub ou un CTA vers un article exclu pourrait réintroduire une route non souhaitée dans le prerendu.

### Finding 26: Le middleware AEO protège le Markdown, pas le HTML direct

**Evidence:** `server/middleware/aeo-content-visibility.ts:12-35` ; `app/pages/blog/[...slug].vue:178-195`

**Detail:** La défense runtime est explicitement limitée aux URLs `/blog/*.md`. Elle ne peut pas servir de contrat général pour les pages HTML, les hubs ou les routes de preview.

## Deduced Conclusions

### Deduction 1: Le brief est un changement de produit, pas une initialisation

**Based on:** Findings 1, 2, 3, 4 et 5.

**Reasoning:** Les routes, le pipeline, le design system et une partie du SEO existent déjà, tandis que le brief ajoute une nouvelle taxonomie, de nouvelles routes et de nouvelles relations.

**Conclusion:** Le travail doit être cadré comme une évolution de l'Epic 6 et du contrat SEO existant, idéalement sous une nouvelle unité de planification plutôt qu'en réécrivant les fondations.

### Deduction 2: Le principal risque n'est pas Nuxt Content, mais la cohérence des contrats

**Based on:** Finding 2, Finding 3 et Finding 5.

**Reasoning:** Ajouter des champs et des hubs touchent simultanément les requêtes, les pages, les métadonnées, le sitemap, l'AEO et les relations de données. Les modules existants qui consomment le contenu risquent de produire des routes ou exports incohérents.

**Conclusion:** La migration doit être définie avant l'implémentation et vérifiée par une fixture publiée temporaire ainsi que par la gate Docker.

### Deduction 3: La CI fournit le meilleur protocole de preuve pour le MVP

**Based on:** Finding 7 et Finding 13.

**Reasoning:** Les fixtures temporaires et assertions CI couvrent déjà les exclusions de publication et les artefacts publics, tandis qu'aucun framework de test n'est disponible.

**Conclusion:** Les nouvelles combinaisons `pillar`/`format`/`goals` et les exclusions de drafts doivent être vérifiées dans le même workflow, avec des fixtures supprimées après le build.

### Deduction 4: Le blog est une source transverse pour la homepage

**Based on:** Finding 8.

**Reasoning:** La page d'accueil interroge la même collection et applique le même filtre d'indexabilité.

**Conclusion:** Le redesign du blog doit inclure une vérification de non-régression de `/`, pas uniquement une vérification des routes `/blog`.

### Deduction 5: Un service de résolution de métadonnées partagé doit précéder les nouvelles pages

**Based on:** Findings 2, 14, 15, 16 et 18.

**Reasoning:** Les mêmes champs doivent alimenter les listes, les hubs, les articles, la homepage, le JSON-LD, le sitemap, l'AEO et le RSS. Si chaque page lit directement `date`, `seo` ou `related`, les contrats divergeront.

**Conclusion:** La SPEC doit définir un contrat unique de résolution (`date`, indexabilité, labels, URLs) avant le découpage UI.

### Deduction 6: Le design system existant suffit ; le nouveau travail est surtout compositionnel

**Based on:** Findings 1, 10, 11 et les primitives `ZCard`, `ZTag`, `ZButton`, `ZIcon` existantes.

**Reasoning:** Les briques visuelles et les primitives globales existent déjà. Le delta concerne les sections, les hubs, les relations et la taxonomie.

**Conclusion:** Ne pas créer une nouvelle librairie UI ; créer au besoin un composant blog spécialisé composé des primitives existantes.

### Deduction 7: Le contrat de preview doit distinguer publication, indexabilité et exclusion sitemap

**Based on:** Findings 4, 7, 18 et 21.

**Reasoning:** L'index public, le sitemap, l'AEO et les routes directes ne consomment pas exactement les mêmes indicateurs. Un article peut être publié mais noindex, ou explicitement exclu du sitemap.

**Conclusion:** Ajouter une décision de preview explicite et vérifier séparément HTML, Markdown, sitemap, hubs, related et RSS.

### Deduction 8: L'Epic 14 doit être stabilisé avant le changement de contrat editorial

**Based on:** Finding 22 et l'état Git de l'inventaire.

**Reasoning:** Les fichiers que le blog doit étendre (`content.config.ts`, `nuxt.config.ts`, pages blog, SEO, CI et serveur) sont déjà modifiés par l'Epic 14 non commité.

**Conclusion:** Terminer et revoir l'Epic 14 dans son propre checkpoint avant d'ouvrir le diff du blog.

### Deduction 9: La politique trailing-slash doit être tranchée avant d'ajouter beaucoup d'URLs

**Based on:** `app/composables/usePageSeo.ts:43-45`, `.github/workflows/cd.yml:398-414` et l'observation de production déléguée.

**Reasoning:** Les canonicals générés sont sans slash, tandis que GitHub Pages peut rediriger les URLs servies vers une forme avec slash final. Ajouter hubs, flux et articles multiplierait les redirections potentiellement contradictoires.

**Conclusion:** Mesurer et décider la politique canonique une fois, avant la génération du nouveau sitemap.

### Deduction 10: Un nouveau resolver de publication doit remplacer les lectures divergentes

**Based on:** Findings 14, 23 et 26.

**Reasoning:** La même question — une entrée est-elle publiée, indexable ou-liable ? — est posée dans le helper, le scanner, le hook, la route article, le middleware et la CI.

**Conclusion:** La SPEC doit imposer une seule fonction de résolution testée par des fixtures partagées, sans supprimer les contrôles défensifs propres à chaque surface.

### Deduction 11: Les hubs Vue nécessitent un chemin de découverte distinct

**Based on:** Finding 24.

**Reasoning:** Le scan Content ne connaît que les Markdown. Un hub Vue ne peut pas être validé par le seul `contentRouteState`.

**Conclusion:** Chaque hub devra avoir une route SEO explicite, une entrée sitemap contrôlée et un test de présence HTML ; il ne faut pas supposer que Nuxt la découvrira automatiquement comme un article.

### Deduction 12: Les relations doivent être filtrées avant le crawler, pas après

**Based on:** Finding 25 et Finding 18.

**Reasoning:** Une fois un lien `related` rendu dans une page SSG, `crawlLinks: true` peut le transformer en route pré-rendue avant un nettoyage ultérieur.

**Conclusion:** Le générateur de relations doit retourner uniquement des cibles publiées/indexables et valides avant le rendu du HTML.

## Hypothesized Paths

### Hypothesis 1: Le brief peut être implémenté comme un simple ajout de pages

**Status:** Refuted

**Theory:** Les nouvelles pages et un simple tableau de constantes suffiraient.

**Supporting indicators:** Le code existant possède déjà un routage Nuxt et des composants réutilisables.

**Would confirm:** Absence de dépendances aux champs SEO, AEO, sitemap et aux relations de données.

**Would refute:** Les pages qui consomment `date`, les schémas SEO/AEO et les données partagées.

**Resolution:** Refutée par `app/pages/blog/index.vue:93-98`, `app/pages/blog/[...slug].vue:210-259` et `docs/project-context.md:65-78`.

### Hypothesis 2: `date` est le nom de date le moins disruptif pour le dépôt

**Status:** Open

**Theory:** Conserver `date` comme champ de publication principal éviterait une migration simultanée de tous les consommateurs Content/SEO, tandis que `publishedAt` pourrait être ajouté comme alias si nécessaire.

**Supporting indicators:** Le schéma, les requêtes, le JSON-LD, le sitemap, le scan Nitro, la logique AEO et la CI utilisent `date` (`content.config.ts:21-89` ; `app/pages/blog/index.vue:95-98` ; `nuxt.config.ts:303-343` ; `.github/workflows/cd.yml:453-505`).

**Would confirm:** Inventaire complet des occurrences de `publishedAt`/`date` et validation de la compatibilité Content v3.

**Would refute:** Une contrainte Content existante ou une convention éditoriale qui impose `publishedAt`.

**Resolution:** À trancher après l'inventaire des occurrences et la comparaison avec le contrat de contenu.

### Hypothesis 3: Le MVP peut éviter de nouvelles collections pour les auteurs, sujets et projets

**Status:** Open

**Theory:** Les enums `pillar` et les sources `SITE.profile`/`SITE.projects` sont suffisants pour la première version.

**Supporting indicators:** Les projets et le profil sont déjà typés et centralisés dans `app/data/site.ts`.

**Would confirm:** Absence de besoin de pages projet détaillées ou d'auteurs multiples dans le périmètre MVP.

**Would refute:** Le brief exigeant effectivement plusieurs auteurs, des topics versionnés ou des routes projet détaillées dès le MVP.

**Resolution:** À valider avec Simon et le découpage de stories.

### Hypothesis 4: Renommer `date` en `publishedAt` dans le seul schéma est suffisant

**Status:** Refuted

**Theory:** Le nouveau nom pourrait être introduit uniquement dans `content.config.ts` et les autres consommateurs s'adapteraient automatiquement.

**Supporting indicators:** Le champ est centralisé et le nom `publishedAt` est plus explicite pour l'édition.

**Would confirm:** Les requêtes, helpers, scan Nitro, sitemap, AEO et CI utiliseraient déjà une abstraction indépendante du nom.

**Would refute:** Une occurrence directe de `date` dans chaque couche critique.

**Resolution:** Refutée par `app/pages/blog/index.vue:95-98`, `app/utils/blog-indexability.ts:40-71`, `nuxt.config.ts:303-343`, `server/plugins/seo-content.ts:49-54` et `.github/workflows/cd.yml:453-505`.

### Hypothesis 5: Ajouter les nouveaux champs optionnels suffit à livrer le brief

**Status:** Refuted

**Theory:** Le schéma Content rendrait automatiquement `pillar`, `format`, `goals`, `project`, `featured` et `related` dans toutes les interfaces.

**Supporting indicators:** Nuxt Content peut exposer des champs frontmatter additionnels.

**Would confirm:** Les templates, hubs, JSON-LD, AEO et les validateurs de relations les consommeraient sans adaptation.

**Would refute:** Aucun template ou helper actuel ne référence ces champs.

**Resolution:** Refutée par `app/pages/blog/index.vue:12-45`, `app/pages/blog/[...slug].vue:8-68` et `nuxt.config.ts:118-186`.

### Hypothesis 6: `seo.robots` est déjà supporté de bout en bout

**Status:** Refuted

**Theory:** Les helpers reconnaissant `seo.robots` garantiraient un contrat SEO imbriqué cohérent avec le schéma, le build et la CI.

**Supporting indicators:** `app/utils/blog-indexability.ts:74-81` inspecte le chemin imbriqué.

**Would confirm:** Le schéma, le scan de routes et les assertions CI valideraient le même objet `seo`.

**Would refute:** Le scan et la CI ne lisent que les champs top-level.

**Resolution:** Refutée par `content.config.ts:61-89`, `nuxt.config.ts:328-343` et `.github/workflows/cd.yml:462-472`.

### Hypothesis 7: `project` peut être résolu automatiquement par le nom du projet

**Status:** Refuted

**Theory:** Le nom du projet dans `SITE.projects` serait une clé relationnelle suffisante.

**Supporting indicators:** Les projets sont centralisés dans une seule source.

**Would confirm:** `IProject` aurait un id/slug stable et une route canonique.

**Would refute:** Les projets n'ont pas d'identifiant et ne possèdent pas de page détail.

**Resolution:** Refutée par `app/data/site.ts:26-38,73-105` et `app/pages/index.vue:175-232`.

### Hypothesis 8: Les liens `related` seront automatiquement sûrs

**Status:** Refuted

**Theory:** Le filtre de publication existant suffirait à valider les relations entre articles.

**Supporting indicators:** Les listes et le sitemap utilisent déjà les helpers de publication.

**Would confirm:** Un validateur de cibles et le même filtre couvriraient les relations.

**Would refute:** Aucun validateur de `related` n'existe et le filtre n'est pas appliqué aux relations.

**Resolution:** Refutée par `app/pages/blog/index.vue:93-98`, `app/pages/index.vue:527-533` et `nuxt.config.ts:592-615`.

### Hypothesis 9: Les exclusions sitemap garantissent déjà une absence totale d'accès direct

**Status:** Refuted

**Theory:** `sitemap: false` ou `sitemap: null` empêcherait toute route HTML et toute exposition en development/runtime.

**Supporting indicators:** Le build statique retire ces routes des sorties publiques.

**Would confirm:** La route article et le middleware refuseraient aussi ces entrées.

**Would refute:** La route article ne filtre que les articles non publiés et le middleware ne couvre que les jumeaux Markdown.

**Resolution:** Refutée par `app/pages/blog/[...slug].vue:178-195` et `server/middleware/aeo-content-visibility.ts:12-35`.

### Hypothesis 10: Les hubs peuvent être des documents Content ordinaires sous `/blog/<slug>`

**Status:** Refuted

**Theory:** Un fichier Markdown à `/blog/ia` suffirait à créer un hub éditorial.

**Supporting indicators:** La collection Content sait produire des routes `/blog/**` et le renderer sait afficher du Markdown.

**Would confirm:** Le catch-all distinguerait hubs et articles ou la collection aurait un type de document différent.

**Would refute:** La route catch-all traite tout `/blog/**` comme un article et renvoie 404 si aucun article ne correspond.

**Resolution:** Refutée par `app/pages/blog/[...slug].vue:86-98,178-195` et `content.config.ts:10-14`.

## Refutation Pass

- **Date alias vs literal rename :** recherche de consommateurs directs de `date` dans les deux listes, les helpers, le scan Nitro, le sitemap, l'AEO et la CI ; les occurrences directes confirmées réfutent le renommage isolé, mais soutiennent l'hypothèse d'un alias contrôlé.
- **Champs optionnels automatiques :** recherche de `pillar`, `format`, `goals`, `project`, `featured` et `related` dans les templates et consommateurs ; aucune consommation fonctionnelle trouvée, donc H5 refutée.
- **Objet SEO imbriqué :** comparaison du support latent `seo.robots` avec le schéma, le scan et les assertions CI ; les trois derniers ne lisent pas le même contrat, donc H6 refutée.
- **Relation projet par nom :** vérification de `IProject`, des cartes et des destinations ; aucun id/slug ni route détail trouvé, donc H7 refutée.
- **Relations related :** vérification des listes, du filtre partagé et du crawler ; aucun validateur de cible n'est présent, donc H8 refutée.
- **Exclusion sitemap :** comparaison entre le build statique et la route article directe ; l'exclusion du build ne protège pas le runtime HTML, donc H9 refutée.
- **Hubs Content :** vérification du type de collection et du catch-all `/blog/[...slug]` ; un hub Markdown serait traité comme un article, donc H10 refutée.

## Missing Evidence

| Gap | Impact | How to Obtain |
| --- | ------ | ------------- |
| Contrat éditorial exact à versionner localement | Permet de distinguer les champs obligatoires, aliases, enums et options P2 | Enregistrer le brief fourni dans `docs/briefs/` ou joindre une source canonique |
| Comportement réel de `/blog` avec un article publié | Vérifie route, hubs, SEO, image, liens et exclusions | Fixture temporaire publiée puis gate Docker et contrôle statique |
| Contrat `@nuxt/content` pour `pillar`, `format`, `goals`, `seo` et `series` | Évite une syntaxe invalide ou une migration incomplète | Définir les types Zod puis valider une fixture complète |
| Stratégie de `date` versus `publishedAt` | Détermine le coût, la sémantique de publication et la frontière Europe/Paris | Choisir un champ canonique et une règle d'alias explicite |
| Contrat de preview pour drafts, noindex et `sitemap: false` | Évite une fuite de contenu via HTML direct ou runtime | Décrire les environnements autorisés et tester HTML, Markdown, sitemap et AEO |
| Clé publique et destination des relations projet | Empêche les liens par nom fragile et les données privées | Ajouter des ids/slugs à `IProject` ou exclure les liens projet du MVP |
| Contrat de résolution de `related` | Empêche les liens vers drafts, futurs, noindex ou slugs absents | Valider les cibles au build et ne rendre que les entrées publiques |
| Contrat RSS (path, MIME, champs, limite, discovery) | Évite une distribution statique incomplète ou non conforme | Décider le propriétaire du flux et ajouter une fixture/assertion dédiée |
| Politique trailing-slash et redirections GitHub Pages | Évite une multiplication de redirections et de canonicals incohérents | Mesurer la production et choisir une forme canonique avant les nouvelles URLs |
| Build et probes HTTP après le nouveau contrat | Valide Zod, SSG, sitemap, AEO, RSS et navigation | Gate Docker, assertions CI, puis vérification post-déploiement |
| Données GitHub/LinkedIn réelles pour la page auteur | Évite d'inventer des liens ou de dupliquer le profil | Confirmer les URLs ou les laisser hors scope |

## Source Code Trace

| Element | Detail |
| ------- | ------ |
| Error origin | Aucun bug runtime unique confirmé ; la zone à risque est la propagation des métadonnées entre Content, pages, SEO, AEO, sitemap et CI |
| Trigger | Ajout d'un article ou chargement de `/`, `/blog`, `/blog/<slug>`, d'un hub, d'une relation ou d'un flux |
| Condition | Une entrée doit être transformée en un contrat unique avant tri, publication, indexabilité, rendu et distribution |
| Causal chain — publication | `content.config.ts:21-45` → `app/utils/blog-indexability.ts:40-71` → `nuxt.config.ts:303-343,531-576` → `server/middleware/aeo-content-visibility.ts:12-35` |
| Causal chain — affichage | `content.config.ts` → `app/pages/blog/index.vue:95-98` et `app/pages/index.vue:527-533` → `app/pages/blog/[...slug].vue:93-107` |
| Causal chain — SEO | `app/pages/blog/index.vue:110-154` et `app/pages/blog/[...slug].vue:219-258` → `app/composables/usePageSeo.ts:34-109` |
| Causal chain — distribution | `content.config.ts:67-84` → `server/plugins/seo-content.ts:41-69` → `nuxt.config.ts:118-186,419-464` → `.github/workflows/cd.yml:270-513` |
| Boundary risk — duplicated policy | `app/utils/blog-indexability.ts:16-99` ↔ `nuxt.config.ts:311-343,534-559` ↔ `.github/workflows/cd.yml:453-487` |
| Boundary risk — route discovery | `nuxt.config.ts:265-300,561-615` → Content routes only ; Vue hubs require explicit sitemap/SEO ownership |
| Boundary risk — crawl expansion | `nuxt.config.ts:613-615` (`crawlLinks: true`) → every rendered `related`/hub link can affect prerender output |
| Boundary risk — runtime surface | `server/middleware/aeo-content-visibility.ts:12-35` covers `.md` only; HTML direct requests use `app/pages/blog/[...slug].vue:178-195` |
| Related files | `content.config.ts`, `app/utils/blog-indexability.ts`, `app/pages/blog/index.vue`, `app/pages/blog/[...slug].vue`, `app/pages/index.vue`, `app/composables/usePageSeo.ts`, `server/plugins/seo-content.ts`, `server/middleware/aeo-content-visibility.ts`, `nuxt.config.ts`, `.github/workflows/cd.yml` |

## Conclusion

**Status:** Concluded — investigation read-only, aucune correction de code exécutée.

**Confidence:** High pour le diagnostic structurel ; Medium pour les décisions produit et l'état de production.

### Diagnostic final

Le brief ne révèle pas un défaut unique à corriger. Il révèle un **risque de rupture de contrat** : le dépôt possède déjà une infrastructure blog, SEO, AEO, sitemap et CI, mais les nouveaux champs éditoriaux ne sont pas encore définis comme un contrat unique. `date` est le contrat de publication transverse ; `project`, `related` et `seo` ne sont pas encore des relations ou overrides validés ; les hubs doivent être des routes Vue dédiées ; et RSS doit avoir un propriétaire statique explicite.

La cause de la complexité attendue est donc confirmée : plusieurs couches interprètent aujourd'hui la publication et l'indexabilité séparément (`app/utils/blog-indexability.ts`, `nuxt.config.ts`, `server/plugins/seo-content.ts`, middleware AEO et workflow CI). Une implémentation littérale du brief sans SPEC créerait des divergences entre HTML, sitemap, AEO, recherche, relations et RSS.

### Direction de correction

1. Stabiliser et versionner l'Epic 14 dans un diff séparé.
2. Rédiger une SPEC qui conserve `date` comme champ interne par défaut, ou définit une migration atomique vers `publishedAt`.
3. Réutiliser `SITE.profile` et `SITE.projects`, avec une clé publique stable pour les relations projet.
4. Introduire un service de résolution partagé pour la publication, l'indexabilité, les labels, les URLs et les relations.
5. Créer des hubs Vue statiques sous `app/pages/blog/*/index.vue`, sans les modéliser comme des articles Markdown.
6. Filtrer `related` et les liens de distribution avant le crawler et le rendu.
7. Ajouter un propriétaire unique pour RSS, puis son discovery et ses assertions CI.
8. Ne pas commencer l'implémentation avant la SPEC et le découpage en stories.

## Recommended Next Steps

### Menu de prochaine action

- **Correction triviale** : non applicable ; aucun correctif local n'est suffisamment isolé pour être justifié.
- **Ajustement de périmètre ou de plan — recommandé** : `bmad-correct-course`, après la SPEC, pour intégrer le blog comme évolution d'Epic 6 / nouvel Epic 16 et le sequencer après Epic 14.
- **Story suivie** : `bmad-create-story`, une fois la SPEC et le sprint mis à jour.
- **Implémentation** : `bmad-dev-story`, story par story.
- **Revue indépendante** : `bmad-code-review`, après la gate Docker de chaque story.

### Prérequis de vérification

- Aucun changement de blog ne doit être mélangé aux modifications Epic 14 non commitées.
- Le brief doit être sauvegardé comme artefact versionné avant la SPEC, afin que les valeurs d'enum et les fixtures soient auditables.
- Aucun framework de test ne sera ajouté uniquement pour ce blog ; la validation reposera sur la gate existante et ses assertions CI.

## Plan de vérification Docker

### 1. Préparer les fixtures temporaires

Créer, dans un environnement de validation uniquement :

- un article publié avec les champs candidats, une image valide, un projet et une relation `related` valide ;
- un article imbriqué `index.md` pour vérifier le chemin Content ;
- un article `draft: true` ;
- un article à date future ;
- un article `noindex: true` ;
- des fixtures `robots: false`, `sitemap: false` et `sitemap: null` ;
- une relation `related` invalide vers un slug inexistant ou un draft ;
- une page hub pour chacun des trois piliers, si la SPEC les confirme.

Les fixtures doivent être supprimées après la vérification, sauf les fixtures CI temporaires déjà prévues dans `.github/workflows/cd.yml`.

### 2. Exécuter la gate Docker

Depuis la racine du dépôt, et uniquement via Docker :

```sh
docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
```

Résultat attendu : code de sortie `0`, sans erreur ESLint, Stylelint ou vue-tsc, et génération SSG complète.

Si un serveur de développement tourne déjà, appliquer le corrective documenté avant toute vérification manuelle :

```sh
docker compose restart web
```

### 3. Contrôler les artefacts statiques

Vérifier dans `.output/public` :

- `blog/index.html` ;
- les trois HTML de hubs ;
- le HTML de l'article publié ;
- `rss.xml` si RSS est dans le périmètre ;
- `sitemap.xml` et `robots.txt` ;
- `llms.txt`, `llms-full.txt`, `sitemap.md` et les jumeaux Markdown attendus ;
- `CNAME` et `_headers` non régressés.

Assertions minimales :

- chaque URL indexable apparaît une seule fois dans le sitemap ;
- chaque URL du sitemap possède un HTML correspondant ;
- les drafts, dates futures, noindex et exclusions sitemap n'apparaissent ni dans le sitemap, ni dans les artefacts AEO, ni dans RSS ;
- les dates HTML, JSON-LD, sitemap et Markdown sont cohérentes ;
- le canonical, `og:url` et le chemin généré utilisent la même politique trailing-slash ;
- les relations `related` ne contiennent que des cibles publiques et valides ;
- le flux RSS ne contient aucun contenu privé, draft, futur ou exclu ;
- le `CNAME` contient exactement `jouan.ovh`.

### 4. Vérifier le comportement navigateur

Contrôler en desktop et mobile, après le build :

- `/` et sa section journal ;
- `/blog` ;
- `/blog/ia`, `/blog/engineering`, `/blog/automatisation` ;
- l'article publié et ses relations ;
- `/about` ;
- `/rss.xml` si applicable ;
- les liens du header/footer et les éventuels liens de distribution.

Vérifier :

- hierarchy des titres et breadcrumbs ;
- focus clavier et liens visibles ;
- absence d'overflow horizontal, notamment sur le code et les longues taxonomies ;
- rendu des images et des alternatives ;
- comportement des thèmes clair/sombre et `prefers-reduced-motion` ;
- absence de CTA ou de lien vers un contenu non public.

### 5. Vérifier la production après déploiement

Après merge sur `main` et déploiement GitHub Pages :

- requesting `/`, `/blog`, chaque hub, l'article et `/rss.xml` ;
- vérifier status HTTP, redirections et Content-Type ;
- vérifier le sitemap, robots, Markdown et RSS sur le domaine public ;
- vérifier l'absence de routes de draft dans les artefacts publics ;
- consigner séparément les observations Google Search Console et Rich Results Test, qui ne sont pas des gates Docker.

### 6. Critères de sortie

La story blog ne pourra être déclarée terminée que si :

- la gate Docker est verte ;
- les fixtures de publication et d'exclusion sont validées ;
- les hubs ne sont pas capturés par le catch-all article ;
- les relations projet et related ne pointent que vers des cibles publiques ;
- le SEO, le sitemap, l'AEO et le RSS éventuel sont cohérents ;
- la vérification desktop/mobile et le clavier sont documentées ;
- les vérifications HTTP post-déploiement sont inscrites dans le Dev Agent Record.

## Reproduction Plan

1. Partir du checkpoint Epic 14 stabilisé.
2. Ajouter les fixtures temporaires définies par la SPEC.
3. Exécuter la gate Docker complète.
4. Inspecter les artefacts statiques et les assertions CI.
5. Effectuer le contrôle navigateur desktop/mobile.
6. Supprimer les fixtures temporaires.
7. Déployer sur `main`, puis effectuer les probes HTTP de production.
8. Consigner les résultats, limites et éventuels problèmes GSC/Rich Results dans le rapport final.

## Side Findings

- Le registre de sprint conserve `epic-6: in-progress` malgré les stories 6.1/6.2 et leur rétrospective documentées comme terminées ; l'incohérence devra être traitée lors du changement de planification.
- Le dépôt contient actuellement des modifications non commitées liées à l'Epic 14 ; elles doivent être isolées avant l'implémentation du blog.
- Le blog est lié depuis la homepage et le footer, mais pas depuis la navigation principale (`app/components/HeaderComponent.vue:113-125` ; `app/components/FooterComponent.vue:78-94`).
- La CI valide `_headers`, mais GitHub Pages ne l'interprète pas comme une garantie de Content-Type ; une future route RSS devra être vérifiée en HTTP production.
- Les artefacts de production existent localement dans `.output`, mais la story 14.6 reste en revue et la publication dépend d'un push vers `main` ; la production ne doit pas être déduite de cet instantané local.
- Une observation de production déléguée signale un écart trailing-slash/canonical ; les logs HTTP bruts doivent être conservés avant de traiter ce point comme un défaut de production.

## Follow-up: 2026-09-24

### New Evidence

- Audit ciblé de la chaîne Content → publication → affichage → SEO/AEO → CI.
- Confirmation que `date` est lu directement par les listes, helpers, scan Nitro, sitemap, AEO et workflow.
- Confirmation que les hubs sous `/blog/<slug>` entrent en conflit avec le catch-all article.
- Confirmation que `seo.robots`, les relations projet et `related` ne sont pas des contrats de bout en bout.
- Confirmation que RSS est absent et devra être généré statiquement.
- Observation déléguée d'un écart potentiel trailing-slash/canonical en production, à confirmer par des logs HTTP.

### Additional Findings

- Le service de résolution de métadonnées doit être partagé par les pages, la homepage, les hubs, les distributions et les exports.
- Une route article peut être publiée mais explicitement exclue du sitemap ; le comportement direct HTML/runtime doit être défini.
- Les `SITE.projects` nécessitent une clé stable avant toute relation article/projet.
- L'Epic 14 doit être isolé avant toute modification des contrats partagés.

### Updated Hypotheses

- H4, H5, H6, H7, H8, H9 et H10 : statuts mis à jour à **Refutées**.
- H2 (`date` comme champ canonique) reste **Open**, mais fortement soutenue par les preuves.
- H3 (réutiliser `SITE.profile`/`SITE.projects`) reste **Open**, avec la condition d'une clé projet stable.

### Backlog Changes

- L'inventaire de métadonnées, routes, SEO/AEO, publication et CI est terminé.
- Le build Docker est bloqué jusqu'à la SPEC et la fixture publiée.
- Les arbitrages `seo`, `project`, `related`, preview, RSS et trailing-slash sont ouverts.
- La vérification HTTP post-déploiement est ajoutée comme preuve obligatoire.

### Updated Conclusion

La prochaine étape n'est plus l'exploration du code mais la **résolution des contrats** : date, auteur, projets, hubs, relations, preview, RSS et canonical. Le dossier d'investigation est prêt à servir de base vérifiée par la préservation à `bmad-spec`.

## Follow-up: 2026-09-24 #2

### New Evidence

- Scans parallèles des identifiants de publication, des implémentations SEO/Content et de l'historique Git.
- Lecture séquentielle du helper d'indexabilité, des deux pages blog, de la homepage, du plugin sitemap, du middleware AEO, du scan Nitro et des assertions CI.
- Le chemin `Content → publication → affichage → SEO/AEO → distribution` est désormais tracé avec ses frontières.

### Additional Findings

- La politique de publication est dupliquée entre quatre couches et doit être centralisée ou vérifiée par des fixtures communes.
- Le scan d'état ne couvre que les fichiers Markdown ; les hubs Vue nécessitent une découverte et des assertions propres.
- `crawlLinks: true` rend le filtrage des relations obligatoire avant le rendu.
- Le middleware AEO ne protège que les URLs `.md` ; il ne définit pas la politique HTML directe.

### Updated Hypotheses

- H2 (`date` canonique) reste **Open**, avec une confiance élevée.
- H3 (réutilisation de `SITE`) reste **Open**, conditionnée à une clé projet stable.
- Les hypothèses H4 à H10 restent **Refutées**.

### Backlog Changes

- Ajouter au backlog de SPEC la centralisation de la politique de publication.
- Ajouter une fixture hub Vue et une assertion sitemap/HTML dédiée.
- Ajouter une fixture `related` valide/invalide et vérifier l'absence de crawl de draft.
- Ajouter une vérification runtime HTML pour les exclusions sitemap.
- Ajouter une vérification HTTP de la politique trailing-slash après déploiement.

### Updated Conclusion

Outcome 5 clôturé : le diagnostic, la direction de correction et le plan Docker de vérification sont consignés. Aucun correctif de code n'a été exécuté ; le prochain livrable BMad est `bmad-spec`, puis `bmad-correct-course` pour intégrer le blog au planning.

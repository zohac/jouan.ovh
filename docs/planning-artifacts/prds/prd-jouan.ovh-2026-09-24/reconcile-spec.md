# Rapport de réconciliation — SPEC blog éditorial ↔ PRD draft

**Date :** 2026-09-24  
**Statut :** aligné sur l'intention produit, non prêt pour l'implémentation tant que les décisions contractuelles et de distribution ne sont pas fermées.  
**Périmètre :** comparaison de la SPEC et de ses quatre companions avec le PRD draft et son addendum. Aucun des deux documents PRD n'a été modifié.

## 1. Verdict exécutif

Le PRD est une traduction cohérente de la vision générale de la SPEC : patrimoine technique vérifiable, qualité avant volume, blog Markdown statique, découverte par hubs, relations publiques, SEO/AEO sans promesse artificielle de visibilité, et réutilisation des propriétaires brownfield. Les neuf capacités de la SPEC trouvent une correspondance explicite ou implicite dans les FR-1 à FR-17, les NFR et le périmètre MVP du PRD.

Le PRD n'est toutefois pas un contrat d'implémentation complet. La SPEC se présente elle-même comme un « contrat complet, vérifié et préservé » (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:15-15`), alors que le PRD reprend surtout les décisions de haut niveau et laisse encore ouvertes les questions qui déterminent le schéma, l'accès direct aux routes, les liens de projet, la canonicalisation, le traitement des relations invalides et le périmètre RSS. Le PRD reprend effectivement les onze questions ouvertes de la SPEC (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:99-111`; `/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:449-461`) et en ajoute trois (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:462-464`). Ces questions ne sont pas des divergences de fond, mais elles empêchent de considérer le draft comme prêt pour des stories d'implémentation.

### Résultat par axe

- **Intention et périmètre :**_pass_ — alignement solide.
- **Traçabilité des sources :** _partial_ — le PRD ne reprend pas tous les companions dans son champ `sources` et ne fait pas toujours référence aux invariants brownfield dans ses critères.
- **Contrat éditorial exécutable :** _blocked_ — matrice de champs, alias de date et visibilité directe incomplets.
- **Architecture de distribution :** _blocked_ — hubs Vue, resolver partagé, canonical, exclusions sitemap/AEO et RSS non verrouillés.
- **Definition of Done :** _partial_ — la gate et la philosophie des fixtures sont là, mais la matrice minimale du plan de vérification n'est pas reprise comme critère bloquant.

## 2. Sources et méthode

La SPEC déclare que ses companions et documents de traçabilité forment le contrat complet (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:1-15`). Le PRD affirme lui-même que les détails d'implémentation et les arbitrages non résolus sont dans `addendum.md` et les companions (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:17-19`). L'addendum précise que le PRD ne doit pas remplacer l'investigation brownfield (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:110-112`).

La réconciliation distingue donc :

1. les exigences qui sont **préservées explicitement** dans le PRD ;
2. les exigences seulement présentes dans un companion et non transformées en critère du PRD ;
3. les décisions laissées ouvertes ;
4. les divergences de formulation ou de portée.

« Préservé » signifie ici que le PRD affirme l'intention ou le résultat attendu avec une référence suffisante ; cela ne signifie pas qu'une règle de code est déjà spécifiée.

## 3. Matrice de couverture des capacités

| Capacité SPEC | Représentation dans le PRD | Verdict | Réserve principale |
| --- | --- | --- | --- |
| CAP-1, article structuré (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:25-27`) | FR-1 à FR-3 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:116-145`) | Partiel | Les champs et règles de migration sont résumés, pas reproduits comme contrat exécutable. |
| CAP-2, homepage `/blog` (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:29-31`) | FR-4 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:151-160`) | Préservé | L'état vide, la découverte et l'exclusion des non-publics sont cohérents. |
| CAP-3, trois hubs (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:33-35`) | FR-5 et FR-6 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:161-179`) | Partiel | La séparation des routes est une intention, pas une règle de précédence et de scan. |
| CAP-4, lecture d'article (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:37-39`) | FR-7 à FR-9 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:185-213`) | Préservé | Related est filtré jusqu'à trois éléments ; la politique d'une relation invalide reste ouverte. |
| CAP-5, auteur et projets (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:41-43`) | FR-10 et FR-11 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:219-237`) | Partiel | La destination publique du contexte projet n'est pas choisie. |
| CAP-6, visibilité et exclusions (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:45-47`) | FR-12 et SM-3 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:243-251`, `432-435`) | Partiel | Le PRD demande de définir la politique, sans la définir ni la rendre testable. |
| CAP-7, SEO, AEO et RSS (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:49-51`) | FR-13 à FR-15, NFR-4 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:253-281`, `315-319`) | Partiel | Les propriétaires uniques sont affirmés ; overrides, allow-list, hubs et RSS restent à trancher. |
| CAP-8, design system et accessibilité (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:53-55`) | FR-9, FR-16, NFR-7 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:205-213`, `283-295`, `320-322`) | Préservé | Le PRD ne reprend pas toute la checklist navigateur du companion. |
| CAP-9, gate et fixtures (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:57-59`) | FR-17, NFR-3 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:299-311`, `315-319`) | Partiel | La commande et la matrice minimale de fixtures ne sont pas contractuelles dans le PRD. |

## 4. Écarts critiques

### C-01 — Le contrat de date n'est pas fermé

La SPEC fixe `date` comme champ de publication interne par défaut dans le MVP et n'autorise `publishedAt` que comme alias contrôlé (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:61-66`). Le companion ajoute le format `YYYY-MM-DD`, `updated >= date`, la sémantique Europe/Paris et l'obligation de ne jamais choisir silencieusement une valeur divergente (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:5-21`).

Le PRD ne fait que dire que la date est résolue de manière déterministe (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:313-320`) et laisse le choix du champ dans une question ouverte (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:449-452`). Il ne définit ni l'alias, ni le comportement en cas de divergence, ni la contrainte `updated`, ni le fuseau, ni la liste des consommateurs à migrer.

**Impact :** le schéma, le helper de publication, le scan Nitro, le JSON-LD, les exports AEO, le sitemap et les fixtures peuvent diverger. Le PRD n'est pas suffisant pour écrire une story de migration ou un test d'acceptation.

**À réconcilier :** choisir soit `date` canonique avec alias, soit une migration atomique vers `publishedAt`; publier la règle de divergence, la sémantique de date et la matrice de consommateurs. Ajouter `updated` comme condition de validation si le contrat le conserve.

### C-02 — La matrice complète du frontmatter n'est pas normative dans le PRD

La companion donne les types, champs obligatoires, nullabilité, formes imbriquées et règles de chaque champ (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:23-53`). Elle fixe notamment l'auteur `simon-jouan`, un pilier unique, des formats et goals fermés, des tags contrôlés, les relations, les overrides SEO, l'image, l'archivage et les champs Nuxt d'indexabilité (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:55-87`).

FR-1 ne reprend qu'une liste de haut niveau — titre, description, date, auteur, pilier, format, goals, tags et état (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:116-125`). Les FR suivants couvrent certains usages de `project` et `related`, mais ne donnent pas la matrice complète, les valeurs d'enum, les règles d'unicité du titre, les types de `image`, les champs `featured`, `evergreen`, `read`, `series`, `archived`, `noindex`, `robots` et `sitemap`, ni la frontière entre schéma et affichage.

**Impact :** deux implémentations peuvent valider le même article tout en produisant des métadonnées ou artefacts différents. Les champs publics/non publics ne sont pas déterministes.

**À réconcilier :** annexer au PRD la matrice de la companion ou y renvoyer explicitement comme contrat normatif, avec une colonne « champ / type / requis / propriétaire / visibilité / règle de migration ».

### C-03 — La politique preview et l'accès direct aux états non publics restent indéfinis

La SPEC exige une distinction entre publication, indexabilité, preview et exclusion sitemap (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:45-47`). La companion fournit une matrice états × surfaces, mais laisse explicitement les lignes `noindex` et `sitemap: false/null` soumises à décision (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:156-166`). Le brownfield rappelle que le build exclut certains contenus alors que la route HTML directe ne filtre que la publication (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/brownfield.md:54-56`); l'addendum précise que le middleware AEO protège les URLs `.md` et non les URLs HTML directes (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:79-87`).

FR-12 exige que le comportement direct soit défini avant livraison, mais ne choisit aucun comportement (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:243-251`). La question correspondante reste ouverte (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:453-455`).

**Impact :** un article `noindex`, `robots: false`, `sitemap: false` ou futur peut être absent du sitemap tout en restant accessible en HTML, ou être traité de manière différente par le prerender, AEO, hubs et related.

**À réconcilier :** verrouiller une table par état — existence de la route statique, statut HTTP, HTML, balise noindex, listes, hubs, related, sitemap, AEO, RSS et preview — puis l'utiliser dans les assertions CI et les probes de production.

### C-04 — La relation `related` a un algorithme, mais pas une politique de stricceté

La companion donne l'ordre explicite → projet → pilier → tags → récence, le maximum de trois, les exclusions et l'obligation de résoudre avant le rendu (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:101-117`). Le PRD reprend fidèlement cet ordre, le maximum et les filtres (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:195-203`).

En revanche, la SPEC et la companion demandent de décider si une référence invalide échoue au build ou est omise avec avertissement (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:101-108`; `/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:111-117`). Le PRD conserve cette question ouverte (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:456-458`) sans préciser le comportement d'une relation explicite invalide par rapport à une relation déduite. Les diagrams ajoutent l'invariant de filtrage avant `crawlLinks: true` (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/architecture-diagrams.md:71-76`), mais le PRD n'en fait pas un critère de gate.

**Impact :** une relation non filtrée peut créer une route pré-rendue involontaire ; une relation explicative peut être traitée comme une erreur bloquante ou comme une simple absence, avec des conséquences opposées sur la gate.

**À réconcilier :** choisir entre fail-fast et omission avec avertissement, définir les deux classes de relations, imposer un resolver partagé et une assertion qu'aucune URL non voulue n'est découverte par le crawler.

### C-05 — La destination de la relation article/projet n'est pas choisie

La SPEC interdit d'inventer une URL de projet qui n'existe pas et laisse le choix entre ancre, page projet future ou contexte textuel (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:99-104`). La companion exige une clé publique stable et interdit l'exposition de dépôt privé, chemin interne ou donnée non publique (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:89-99`); sa matrice de routes maintient `/projets/<slug>` comme question ouverte (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:140-154`).

Le PRD exige une destination autorisée et une relation bidirectionnelle, mais reprend la question ouverte au lieu de la trancher (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:229-237`, `449-454`). L'addendum confirme que `SITE.projects` est la source existante et qu'un ID doit être stabilisé (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:68-77`, `89-100`).

**Impact :** impossible de définir le modèle de lien, les ancres, les textes de contexte et les assertions HTTP sans créer une destination non approuvée.

**À réconcilier :** choisir la destination MVP, son contrat d'URL et le comportement sans projet détaillé ; exiger un lookup par ID, jamais par nom humain.

### C-06 — La stratégie de routes des hubs est sous-specified, alors que la collision est un risque connu

La companion brownfield impose des pages Vue dédiées sous `app/pages/blog/ia/index.vue`, `engineering/index.vue` et `automatisation/index.vue` afin d'éviter le catch-all article (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/brownfield.md:34-49`). Elle précise aussi que `contentRouteState` ne voit pas les hubs Vue, donc chaque hub doit avoir son propre SEO, sitemap et assertion HTML. Le diagramme de responsabilité confirme que les pages Vue doivent appeler le SEO et le resolver de publication, tandis que le scan ne couvre que le build Content (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/architecture-diagrams.md:42-56`).

Le PRD affirme que les hubs ne sont pas traités comme articles et liste la collision comme risque (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:161-179`, `360-371`). Il ne précise toutefois pas :

- les fichiers Vue dédiés et l'interdiction ou l'arbitrage pour un article dont le slug serait `ia`, `engineering` ou `automatisation` ;
- la règle de précédence Nuxt et l'assertion de non-capture ;
- le SEO, l'entrée sitemap et l'assertion HTML propres à chaque hub Vue ;
- le fait que ces hubs doivent être ajoutés au flux de prerendrendement malgré leur absence du scan Content ;
- les projets associés, exigés par CAP-3 (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:33-35`).

**Impact :** risque de capture par `[...slug]`, de hub absent du sitemap ou de relation projet incohérente.

**À réconcilier :** ajouter une section de routes et de collision, la liste des slugs réservés, les pages dedicated, les entrées sitemap par hub et les assertions de présence/absence.

### C-07 — Le contrat SEO/canonical ne reconcile pas le self-canonical avec les overrides autorisés

La SPEC interdit un second propriétaire de canonical et JSON-LD (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:61-65`). La companion autorise un objet `seo` fermé, un champ `canonical` absolu ou nul, tout en gardant les champs top-level `robots`/`sitemap` aux schémas Nuxt (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:27-51`) et décrit un chemin propriétaire `usePageSeo → Sitemap/Robots → AEO` (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:119-138`).

FR-13 affirme qu'un article public produit un canonical self-referencing (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:253-261`), mais le PRD ne dit pas si un `canonical` explicite est autorisé, comment `seo.title`/`seo.description` sont pré-résolus, qui possède le head, ni quelle politique trailing-slash s'applique. Ces points restent ouverts (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:454-460`).

**Impact :** canonical, `og:url`, HTML, sitemap et AEO peuvent être interprétés différemment ; le self-canonical peut être silencieusement remplacé par un override non prévu.

**À réconcilier :** définir la hiérarchie de résolution et le propriétaire unique, l'interdiction de second head, la relation entre override et self-canonical, ainsi que trailing-slash/redirections.

### C-08 — Le RSS est conditionnel mais son contrat de distribution n'est pas prêt

La SPEC autorise un RSS « si approuvé » et demande cohérence avec publication, AEO et sitemap (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:49-51`, `85-89`). La companion réserve `/rss.xml` et les champs item à une décision, tout en exigeant que le flux ne contienne que des entrées publiques et ne remplace pas sitemap ou AEO (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:137-154`). Les diagrams l'identifient comme un propriétaire de distribution futur séparé (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/architecture-diagrams.md:22-40`, `71-76`).

Le PRD maintient correctement le conditionnel, mais laisse ouverts le chemin, le propriétaire statique, les champs obligatoires, la limite et le MIME (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:273-281`, `414-415`, `457-459`).

**Impact :** la Definition of Done ne peut pas savoir si `rss.xml`, son lien de découverte et ses assertions sont obligatoires ou exclus.

**À réconcilier :** décider inclusion MVP ou report explicite ; si inclus, spécifier propriétaire, URL, MIME, champs item, limites, dates, exclusions et source unique.

### C-09 — La gate de vérification n'est pas assez précise pour être la Definition of Done du PRD

La SPEC exige une gate Docker, des fixtures nettoyées, des assertions CI et des résultats consignés (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:57-59`). Le plan de vérification donne la commande exacte, la liste minimale de fixtures, les fichiers attendus, les assertions de contenu, le smoke test et les probes post-déploiement (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/verification-plan.md:12-43`, `45-76`, `78-115`).

FR-17 reprend l'intention de la gate, des fixtures temporaires et des résultats statiques/navigateur/production (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:297-311`), mais ne rend pas bloquants la commande exacte, la fixture `index.md` imbriquée, les trois variantes d'exclusion sitemap, les relations valides/invalides, la fixture projet, les HTML de hubs, les jumeaux Markdown, `CNAME`, `_headers`, les Content-Type et redirections. L'addendum fournit les propriétaires et risques techniques, mais ne remplace pas ces critères de sortie (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:57-87`).

**Impact :** une story peut être déclarée terminée alors qu'une fuite de route, un artefact absent ou une régression `CNAME`/`_headers` n'a pas été testée.

**À réconcilier :** afficher le plan de vérification comme annexe normative du PRD, avec une checklist bloquante et un format Dev Agent Record.

### C-10 — L'allow-list AEO et les assertions d'artefacts publics ne sont pas délimités

La companion prescrit que tout nouveau champ public soit ajouté à l'allow-list AEO et aux assertions CI, et que les routes HTML, Markdown, `llms.txt`, `llms-full.txt`, `sitemap.md` et les exclusions restent cohérentes (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:119-138`). Le plan de vérification énumère les artefacts attendus et les assertions de contenu, d'indexation, de dates et de budget (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/verification-plan.md:45-76`).

Le PRD affirme qu'un contenu public peut être exposé dans les représentations prévues et interdit les secrets ou articles privés, mais ne définit ni l'allow-list des champs, ni les doublons Markdown twins, ni les contrôles AEO-specifics (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:263-271`). NFR-4 garantit l'unicité des propriétaires mais ne détermine pas ce qui doit entrer dans chaque sortie (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:315-319`).

**Impact :** un champ interne pourrait fuiter dans AEO, ou un champ public pourrait manquer dans une représentation sans faire échouer la gate.

**À réconcilier :** annexer une matrice champ → propriétaire → sortie autorisée → assertion CI, et préciser les exclusions, dates, URLs, limites de budget et twins Markdown.

## 5. Écarts mineurs, dérives et précisions nécessaires

### M-01 — Index des sources incomplet dans le PRD

Le champ `sources` du PRD ne cite que la SPEC, le content contract, l'investigation et le project context (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:1-11`). Il omet `brownfield.md`, `verification-plan.md`, `architecture-diagrams.md` et les artifacts de migration listés dans la SPEC (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:1-11`). La section Références les mentionne partiellement (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:477-485`). L'addendum rappelle que l'investigation complète reste une source distincte (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:110-112`).

**Correction attendue :** indexer tous les companions et préciser que l'addendum est un supplément de recherche/architecture, pas un contrat qui remplace la SPEC.

### M-02 — Contradiction de portée sur `series`

La companion autorise un champ `series` fermé avec support de schéma sans UI complexe dans le MVP (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:46-48`). La SPEC place les séries parmi les options P2 non réouvertes (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:76-83`), et le PRD les met hors périmètre MVP (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:391-400`, `417-424`).

**Correction attendue :** dire explicitement si `series` reste schema-only, si le champ est supprimé du MVP, ou si la SPEC doit être rouverte.

### M-03 — Le hub n'explicite pas le contexte projet dans ses critères

CAP-3 demande aux hubs des recommandations, derniers contenus, projets associés et navigation vers les autres piliers (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:33-35`). FR-5 exige titre, introduction, recommandations, récents et liens vers les autres piliers, mais ne mentionne pas les projets associés (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:161-169`).

**Correction attendue :** ajouter les projets publics comme conséquence explicite, ou justifier leur absence du MVP.

### M-04 — Les champs optionnels et leur visibilité ne sont pas attribués

La companion distingue `featured`, `evergreen`, `read`, `seo`, `canonical`, `series`, `archived`, `noindex`, `robots` et `sitemap` (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:39-51`) et dit que `goals` est interne par défaut (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:78-87`). Le PRD ne tranche que la visibilité des goals et laisse plus largement les champs optionnels à une question ouverte (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:451-462`).

**Correction attendue :** ajouter une colonne de visibilité/owner pour chaque champ, en particulier pour éviter que `featured` ou `evergreen` ne deviennent des signaux publics par défaut.

### M-05 — La checklist a11y et responsive est plus courte dans le PRD

Le plan de vérification demande notamment fil d'Ariane, liens de retour, liens externes accessibles, images responsives, thèmes, contraste forcé et CTA sans contenu privé (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/verification-plan.md:78-102`). Le PRD couvre déjà les titres, le code, les images, le contraste, les liens externes et le mouvement réduit (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:185-213`, `283-295`), mais ne reprend pas la checklist détaillée et bloquante du companion (fil d'Ariane, liens de retour, thèmes, CTA et contrôles de contraste forcé).

**Correction attendue :** référencer le plan de vérification dans FR-16/FR-17 ou en annexe, en conservant les contrôles spécifiques au blog.

### M-06 — Le PRD ne cite pas les primitives et règles d'implémentation du projet

La companion brownfield impose la réutilisation de `SITE.profile`, `SITE.projects`, `usePageSeo`, les propriétaires sitemap/robots/AEO et le design system (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/brownfield.md:14-26`). L'addendum reprend ces sources (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:57-77`). Le PRD le fait au niveau des principes (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:315-326`, `351-358`), mais ne nomme pas `useSiteUrl`, `ZExternalLink`, le resolver partagé, `contentRouteState` ou `crawlLinks`.

**Correction attendue :** distinguer les invariants de brownfield des détails d'implémentation, afin que les stories héritent des interdictions (pas de second head, pas de relation non filtrée, pas d'URL codée en dur).

### M-07 — Le PRD ajoute une capability analytics non présente dans la SPEC

NFR-11 et SM-5 introduisent des événements de lecture, découverte et contact dans un analytics consenti (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:313-326`, `437-441`). La SPEC ne définit pas d'analytics et interdit seulement les promesses de classement, trafic, citation ou conversion (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:61-74`). Les implications produit de l'addendum restent centrées sur la checklist éditoriale et ne fournissent aucun contrat de consentement ou d'événements (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:44-55`).

**Correction attendue :** marquer analytics comme hors MVP ou ajouter propriétaire, événements, consentement, minimisation et critère de non-régression; ne pas en faire une capability obligatoire implicite.

### M-08 — La formulation « sombre ou claire » est plus large que l'acceptation du design system

Le PRD décrit le blog comme « sombre ou claire selon le système de thèmes existant » (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:347-349`), tandis que la SPEC demande de préserver le design system existant (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:53-55`) et le plan de vérification mentionne les thèmes clair/sombre et le terminal sanctuarisé (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/verification-plan.md:97-102`).

**Correction attendue :** reprendre la convention réelle du projet dans les critères, plutôt que de laisser une possibilité de thème clair non confirmée.

## 6. Claims explicitement préservés dans le PRD

Les éléments suivants sont conservés et ne doivent pas être perdus lors d'une révision du PRD :

1. **Pas de site SEO industriel.** La SPEC demande une source d'expériences techniques, sans usine SEO ni duplication d'infrastructure (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:19-21`); le PRD formule la même priorité de preuve et de patrimoine vérifiable (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:21-27`).

2. **Blog Markdown, Nuxt 4, Content v3, statique et GitHub Pages.** La contrainte est reprise dans NFR-1 à NFR-3 et la plateforme (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:313-319`, `351-358`), avec le même brownfield que la SPEC et l'addendum (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:61-64`; `/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:57-66`).

3. **Source auteur et source projet partagés.** Le PRD maintient `SITE.profile`, un auteur unique et `SITE.projects` avec ID stable, sans collection parallèle (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:215-237`, `466-475`), conformément à la companion (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:89-99`).

4. **Contrat éditorial de haut niveau.** Titre, description, date, auteur, un pilier, format, goals, tags et état draft sont bien présents dans FR-1, avec rejet des contenus génériques et interdiction de publication implicite d'un draft (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:112-135`).

5. **Homepage `/blog` et trois hubs.** Les routes, la découverte, l'état vide et la séparation catch-all sont formulées dans FR-4 à FR-6 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:147-179`), et les trois paths sont explicitement dans le périmètre MVP (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:402-415`).

6. **Lecture contextualisée et related limité à trois.** Métadonnées, dates, auteur, projet, code mobile et suggestions publiques sont conservés dans FR-7 à FR-9 (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:181-213`), avec l'ordre de résolution de la companion (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:101-117`).

7. **Protection contre les fuites de contenu.** Le PRD exige que drafts, futurs et non-publics ne soient pas listés ou distribués et que le comportement direct soit cohérent (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:147-179`, `243-271`, `328-341`), ce qui conserve l'intention de CAP-6/7 (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:45-51`).

8. **Propriétaires SEO/AEO uniques et RSS conditionnel.** NFR-4 et FR-13 à FR-15 maintiennent l'absence de second module et la dépendance conditionnelle de RSS (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:313-326`, `253-281`), comme la SPEC (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:61-65`).

9. **Design system, accessibilité et mouvement réduit.** FR-9, FR-16 et NFR-7 conservent tokens, composants existants, hiérarchie, focus, contraste et `prefers-reduced-motion` (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:205-213`, `283-295`, `320-322`).

10. **Gate Docker, fixtures temporaires et traçabilité.** Le PRD reprend l'obligation de valider par `lint`, `typecheck` et `generate`, de nettoyer les fixtures et de consigner résultats, décisions et rollbacks (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:297-327`; `/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/verification-plan.md:117-139`).

11. **Garde-fous de qualité et non-goals.** Le PRD conserve l'interdiction de contenu généré, métriques inventées, fixtures publiques, CMS, recherche IA, refonte DS et promesses de classement (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:328-341`, `391-400`), en correspondance avec la SPEC (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:76-83`).

12. **Séquencement après stabilisation d'Epic 14.** Le PRD traite la stabilisation d'Epic 14 comme préalable et mentionne le risque de régression (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:360-379`), ce qui recoupe le brownfield et l'addendum (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/brownfield.md:58-64`; `/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:102-108`).

13. **État brownfield actuel.** Le PRD reconnaît que le blog, les routes Content, le design system, le SEO et la gate existent déjà, que le corpus public est vide et qu'Epic 14 partage des surfaces SEO/AEO (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:343-345`), conformément au diagnostic (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/brownfield.md:5-12`; `/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:79-87`).

## 7. Registre des décisions encore ouvertes

| Question | Traitement actuel | Bloque |
| --- | --- | --- |
| `date` vs `publishedAt` | Reprise comme question ouverte | Schéma, migration, SEO, AEO, CI |
| `/about` vs `/a-propos` | Reprise comme question ouverte | Route, canonical, navigation |
| Destination projet | Reprise comme question ouverte | Lookup, liens, pages, données publiques |
| Preview/noindex/sitemap | Reprise comme question ouverte | Prerender, HTML direct, listes, AEO |
| Overrides SEO/canonical | Reprise comme question ouverte | `usePageSeo`, head, canonical, trailing slash |
| Visibilité de `goals` | Reprise comme question ouverte | HTML, JSON-LD, AEO, RSS |
| Related invalide | Reprise comme question ouverte | Build, avertissements, crawlLinks |
| RSS | Conditionnel, non tranché | Scope, artefacts, MIME, découverte |
| Trailing slash | Reprise comme question ouverte | Routes, redirections, canonical |
| Navigation principale | Reprise comme question ouverte | Architecture de l'information |
| Fixtures | Reprise comme question ouverte | Plan de test et contamination publique |
| Champs optionnels | Question ajoutée par le PRD | Schéma et surfaces publiques |
| Analytics | Question ajoutée par le PRD | Consentement et périmètre |
| Brief original versionné | Question ajoutée par le PRD | Traçabilité produit |

Sources : SPEC (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:99-111`) et PRD (`/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:449-464`).

## 8. Décision de réconciliation recommandée

### Peut être approuvé maintenant

- La vision, l'audience, le ton, la langue et le non-objectif de publication SEO industrielle.
- Le choix de la source Markdown/Content, du statique et de Docker.
- Les capacités de découverte `/blog`, hubs, article, auteur et related.
- Les garde-fous de confidentialité, de non-fuite et de non-promesse SEO/AEO.
- La décision de ne pas créer de CMS, de base éditoriale, de moteur de recherche ou de test framework dédié.

Ces points sont suffisamment stables pour le cadrage produit (`/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/SPEC.md:23-83`; `/Users/simon/dev/jouan.ovh/docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:110-135`, `313-341`).

### Ne doit pas être marqué prêt sans complément

- Le contrat de date et la matrice de migration.
- La matrice de publication/indexabilité et la politique d'accès direct.
- La résolution stricte des relations invalides.
- La destination des relations projet.
- La précédence et la distribution des hubs Vue.
- La politique canonical/SEO et trailing-slash.
- Le contrat RSS ou son report explicite.
- La Definition of Done, la vérification et la matrice de fixtures.

## 9. Actions minimales proposées avant approbation du PRD

1. **Ajouter une annexe normative « contrat de contenu »** qui reprend la matrice de `/Users/simon/dev/jouan.ovh/docs/specs/spec-blog-editorial/content-contract.md:23-87` et la règle de divergence de date.
2. **Ajouter une matrice de visibilité** pour draft, futur, noindex, robots false, sitemap false/null et publié indexable, avec le comportement de l'URL directe.
3. **Ajouter une section de routes** pour les trois hubs, les slugs réservés, la précédence `[...slug]`, le scan des hubs Vue et les assertions sitemap/HTML.
4. **Trancher les décisions produit** pour le projet, `related`, les overrides SEO, le canonical/trailing-slash, la visibilité des goals et le RSS.
5. **Rendre le plan de vérification bloquant** : commande Docker exacte, fixtures minimales, artefacts attendus, contrôles navigateur, probes HTTP et champs Dev Agent Record.
6. **Ajouter la matrice AEO** : champs autorisés, propriétaires, sorties, exclusions, dates, budgets et assertions CI.
7. **Compléter l'index des sources** et distinguer les invariants brownfield des détails d'implémentation.
8. **Clarifier `series` et les champs optionnels** afin d'éliminer la contradiction de périmètre.
9. **Qualifier analytics** comme capability optionnelle ou le retirer du MVP.

Aucune de ces actions n'autorise la publication de fixtures, la création d'une page projet ou l'ajout d'un second propriétaire SEO/AEO. Le rapport ne modifie ni `prd.md` ni `addendum.md`; il fournit uniquement le relevé des écarts et des décisions nécessaires.

## 10. Conclusion

La réconciliation ne révèle pas une divergence de vision : le PRD reprend correctement l'essentiel de la SPEC et de ses companions. Le principal écart est un **écart de contractibilité**. Le PRD décrit le résultat produit et répère les questions ouvertes, tandis que la SPEC exige que les règles de publication, les propriétaires de routes, les exclusions, la distribution et la vérification soient vérifiables. Tant que C-01 à C-10 ne sont pas fermées ou référencées comme décisions normatives, le statut recommandé est :

**« Aligné sur l'intention, bloqué pour l'implémentation et la Definition of Done. »**

# Rapport de réconciliation — PRD blog éditorial / investigation / planning

> **État actuel après la ratification du point de contrôle Epic 14 (2026-09-26) :** les constats de ce rapport décrivent l'instantané du 2026-09-24. Les six tâches de l'Epic 14 sont terminées, son point de contrôle est ratifié et l'Epic 16 peut passer en décomposition de stories T0. Les constats historiques ne doivent pas être réinterprétés comme l'état actuel.

**Date de réconciliation :** 2026-09-24  
**Portée :** `prd.md`, `addendum.md`, l'investigation brownfield, `epics.md`, `sprint-status.yaml` et `project-context.md`. Les companions de la SPEC ont aussi été consultés lorsqu'ils sont explicitement référencés par le PRD.  
**Convention de citation :** `investigation` désigne `docs/implementation-artifacts/investigations/blog-editorial-brief-investigation.md`; `SPEC` désigne `docs/specs/spec-blog-editorial/SPEC.md`; `content-contract.md` désigne `docs/specs/spec-blog-editorial/content-contract.md`; `verification-plan.md` désigne `docs/specs/spec-blog-editorial/verification-plan.md`. Les autres noms sont les chemins relatifs indiqués dans chaque source.  
**Fichiers PRD :** aucun fichier PRD n'a été modifié par ce rapport.

## Verdict exécutif

Le PRD est **directionnellement cohérent** avec l'investigation et la SPEC : il reconnaît que le blog est une évolution brownfield, réutilise les propriétaires de contenu, de design system, de SEO et d'AEO, exclut les CMS et la production de contenu générique, et conserve implicitement la cohérence des états de publication. Il conserve également les contraintes Docker, SSG, GitHub Pages, accessibilité, vie privée et absence de promesse SEO.

Le PRD n'est toutefois **pas encore exécutable comme plan de développement**. Les décisions de contrat et de périmètre qui conditionnent le schéma, les routes, le sitemap, l'AEO et la CI sont encore ouvertes, tandis que le planning existant ne contient aucune unité de travail pour le blog éditorial durable. Le PRD reconnaît désormais explicitement que `date`, la destination projet et RSS bloquent des arbitrages, mais il ne les tranche pas. Le registre de sprint ne fournit pas une base fiable pour décider entre une extension de l'Epic 6 et un nouvel Epic.

**Conclusion de statut :** PRD à conserver en `draft`; ne pas créer de stories d'implémentation avant le checkpoint Epic 14, les décisions de contrat et le passage par `bmad-correct-course`.

## Matrice de réconciliation

| Domaine | Verdict | Éléments concordants | Reste à réconcilier |
|---|---|---|---|
| Nature brownfield | Aligné | Le blog de base, Content, les routes et le pipeline existent déjà; le corpus est vide (`prd.md:343-345`; investigation:89-123). | Aucun nouveau système de blog ne doit être implicitement créé. |
| Intention éditoriale | Aligné | Autorité par l'expérience, limites, corrections et absence de volume comme mesure de succès (`prd.md:21-27`, `127-145`; `addendum.md:13-55`). | Valider les scénarios UX provisoires par des sessions réelles (`prd.md:46-48`). |
| Source de vérité | Aligné | `SITE.profile`, `SITE.projects`, Content, `usePageSeo`, AI Ready et CI sont réutilisés (`prd.md:215-237`, `315-323`; `addendum.md:57-77`). | Ajouter les identifiants et la projection publique des projets si la relation reste dans le MVP. |
| Contrat de publication | Bloqué | Le PRD exige un état unique et refuse les divergences silencieuses (`prd.md:243-251`, `315-320`). | Choisir `date`/`publishedAt`, définir la matrice preview et le resolver partagé. |
| Découverte/hubs | Partiel | Les trois URLs et le non-capturage par le catch-all sont explicités (`prd.md:161-179`). | Ajouter la propriété SEO/sitemap des hubs Vue, la précédence de routes et la politique des slugs. |
| Relations | Bloqué | Les invariants de publicabilité, auto-éviction et maximum de trois sont posés (`prd.md:195-203`). | Choisir la priorité de résolution, le comportement d'une cible invalide et la destination projet. |
| SEO/AEO/RSS | Partiel | Un seul propriétaire et aucune promesse de classement sont maintenus (`prd.md:253-281`, `337-341`). | Trancher les overrides SEO, la politique trailing-slash et le périmètre RSS. |
| Planning | Non réconcilié | Le PRD prescribe une livraison par capability (`prd.md:373-381`). | Aucun Epic/stories de blog éditorial dans `epics.md`; statut Epic 6 incohérent. |
| Validation | Partiel | Gate Docker, fixtures temporaires et vérifications navigateur/production sont demandés (`prd.md:297-311`). | Les assertions story-level et les critères de sortie ne sont pas encore transformés en checklist exécutable. |
| transverse | Majoritairement préservé | DS existant, accessibilité, français, vie privée, zéro emoji et contenu non généré sont cohérents (`prd.md:283-326`, `328-358`). | Les sources de planning contiennent des dérives anciennes: thème, `yarn`, domaine hardcodé et événement `blog_code_copied`. |

## Gaps critiques

### C1 — Le PRD n'est relié à aucun backlog éditorial exécutable

Le PRD introduit un contrat de contenu, une homepage éditoriale, trois hubs, une route article enrichie, une page auteur, des relations projet/related, SEO/AEO, une distribution conditionnelle et une gate (`prd.md:110-179`, `239-311`, `402-415`). Le planning existant ne contient qu'Epic 6, défini comme un index et une vue article via Content (`epics.md:259-261`, `569-598`). Il n'existe aucune story pour les nouvelles capacités, aucune dépendance entre elles et aucun epic 16 ou extension d'Epic 6.

Le sprint status ne comporte pas d'entrée pour ce lot et maintient `epic-6: in-progress` alors que ses deux stories et sa rétrospective sont `done` (`sprint-status.yaml:84-88`). L'investigation demande précisément de choisir une nouvelle unité de planification ou une évolution explicitement numérotée d'Epic 6 après la SPEC (`investigation:245-261`, `303-309`, `551-565`), et l'addendum laisse cette décision à `bmad-correct-course` (`addendum.md:102-108`).

**Impact :** les équipes ne peuvent pas savoir quoi implémenter, dans quel ordre, avec quel propriétaire, ni ce qui clôt une story. Une simple création de pages produirait un build potentiellement vert mais non conforme au PRD.

**Réconciliation requise :** lancer `bmad-correct-course`; décider Epic 16 versus extension d'Epic 6; réconcilier le statut; produire une table CAP/FR → epic → story → dépendance → critère de sortie. Aucun code blog ne doit être mélangé avec le diff Epic 14.

### C2 — Epic 14 est une dépendance partagée non stabilisée

Le PRD prescribe de stabiliser Epic 14 et de clarifier les propriétaires SEO/AEO avant le blog (`prd.md:373-381`). Le sprint indique pourtant `epic-14: in-progress`, `14-1` en cours, `14-2` et `14-6` en revue, même si `14-3` à `14-5` sont marquées terminées (`sprint-status.yaml:148-156`). L'Epic 14 est le propriétaire des modules SEO, du sitemap/robots, de l'AEO et des événements analytics (`epics.md:1141-1261`). Les critères d'acceptation de 14.6 exigent aussi des vérifications HTTP post-déploiement (`epics.md:1246-1261`), alors que le contexte indique que la gate locale AEO ne vaut pas preuve de production (`project-context.md:30`, `72-79`).

L'investigation documente en outre un working tree Epic 14 non commité et des surfaces partagées (`content.config.ts`, `nuxt.config.ts`, pages blog, SEO, plugins, CI) déjà modifiées (`investigation:62-68`, `680-684`).

**Impact :** une régression de publication, de date ou de route ne pourra pas être attribuée proprement; les résultats du blog peuvent valider un état transitoire de l'Epic 14.

**Réconciliation requise :** produire un checkpoint propre (commit ou worktree), désigner les artifacts 14.2/14.6 à revoir, obtenir leur gate et leurs limites de production documentées, puis enregistrer le commit de départ du blog. Le statut `done` de l'Epic 14 ne doit pas être déduit des seules stories 14.3–14.5.

### C3 — Le contrat `date` / `publishedAt` n'est pas tranché

Le PRD exige une date déterministe et refuse les divergences silencieuses (`prd.md:315-320`), mais conserve la question `date` versus `publishedAt` comme ouverte (`prd.md:451-455`). L'investigation établit que `date` est le contrat actif dans le schéma, les listes, le helper, le scan Nitro, le sitemap, l'AEO et la CI (`investigation:95-99`, `167-171`, `359-371`). Le companion de contrat recommande `date` comme source canonique au MVP et exige une résolution unique si `publishedAt` devient un alias (`content-contract.md:7-21`; SPEC:61-69).

**Impact :** modifier seulement le schéma laisserait diverger le tri, la route article, JSON-LD, sitemap, exports AEO et assertions CI; un alias naïf pourrait exposer deux valeurs contradictoires.

**Réconciliation requise :** décider explicitement entre `date` canonique avec alias contrôlé et migration atomique vers `publishedAt`; définir le fuseau horaire Europe/Paris, la règle `updated`, l'erreur en cas de divergence, le comportement Zod et la liste complète des consommateurs à migrer. Le PRD peut conserver la question ouverte, mais aucune story de schéma ne doit être `ready-for-dev` avant cette décision.

### C4 — Le contrat de frontmatter, les enums et le resolver partagé ne sont pas finalisés

FR-1 demande titre, description, date, auteur, un pilier, un format, des goals, des tags et un état (`prd.md:116-125`), tandis que les questions sur les champs optionnels, les overrides SEO, la visibilité de `goals` et les relations restent ouvertes (`prd.md:455-468`). L'investigation montre que les champs optionnels ne deviennent fonctionnels que s'ils sont explicitement consommés (`investigation:173-183`) et demande un resolver unique pour publication, indexabilité, labels, URLs et relations (`investigation:279-325`).

Il existe aussi une dérive de vocabulaire: le glossaire du PRD emploie des libellés avec espaces (`deep dive`, `lab note`, `case study`) (`prd.md:90-107`), alors que le companion de contenu donne des valeurs machine fermées avec tirets (`deep-dive`, `lab-note`, `case-study`) (`content-contract.md:55-87`). Le risque n'est pas mineur pour un contrat destiné à alimenter Zod.

**Impact :** deux implémentations peuvent valider des articles différents, exposer des champs dans AEO/RSS sans allow-list, ou diverger sur l'auteur et les goals. Ajouter `pillar`, `format`, `project` ou `related` au seul schéma ne suffit pas.

**Réconciliation requise :** adopter ou remplacer explicitement le `content-contract.md`; fixer les champs obligatoires/optionnels, valeurs exactes, visibility, overrides autorisés, auteur (`simon-jouan` résolu depuis `SITE.profile`), et comportement d'un article invalide. Le PRD doit référencer un resolver unique consommé par index, homepage, hubs, article, auteur, JSON-LD, AEO, sitemap et RSS éventuel.

### C5 — La matrice publication / indexabilité / preview / exclusion n'est pas une décision de livraison

Le PRD affirme que les états sont distingués dans toutes les surfaces et que les fixtures doivent produire un résultat documenté (`prd.md:243-251`), mais demande encore de décider du comportement direct d'une URL noindex ou sitemap-excluded (`prd.md:455-463`). L'investigation précise que l'exclusion du build sitemap ne protège pas une demande HTML directe, que la route article ne filtre que certains états et que le middleware AEO ne couvre que les URLs `.md` (`investigation:209-243`). La matrice du companion confirme que `noindex` et preview doivent être verrouillés avant les nouvelles surfaces (`content-contract.md:156-166`).

**Impact :** risque de fuite de brouillon, de contenu futur ou d'un contenu explicitement exclu via HTML direct, lien de hub, related ou crawl SSG; divergence entre sitemap, AEO, Markdown et RSS.

**Réconciliation requise :** table de décision de publication par état et par surface (index, homepage, hubs, related, HTML prod/dev, sitemap, robots, AEO, Markdown, RSS), avec comportement 404/noindex/preview explicite. Les fixtures doivent vérifier la matrice, pas seulement l'absence dans le sitemap.

### C6 — La relation article-projet est simultanément incluse et indéfinie

FR-11 exige un projet public stable, une destination autorisée et un contexte bidirectionnel (`prd.md:229-237`), et le MVP inclut la relation article/projet (`prd.md:402-415`). En même temps, le PRD demande si la destination est une ancre, une page future ou un contexte textuel (`prd.md:455-457`), et exclut les pages projet détaillées sans approbation séparée (`prd.md:417-424`).

La source de vérité actuelle `SITE.projects` n'offre pas encore d'identifiant/slug relationnel ni de route de détail; l'investigation a explicitement réfuté la correspondance par nom humain (`investigation:185-189`, `429-441`). L'addendum demande de stabiliser la relation avec un ID, sans créer de collection séparée (`addendum.md:89-100`).

**Impact :** les relations sont fragiles, inexistantes ou privées; une page projet peut être inventée alors que le PRD la déclare hors périmètre.

**Réconciliation requise :** choisir soit (a) ajouter un ID public stable, une projection publique et une destination autorisée, avec articles liés triés selon le même resolver de visibilité, soit (b) retirer la relation et le contexte bidirectionnel du MVP. Ne pas déduire l'ID du nom humain et ne pas exposer les mentions de dépôt privé.

### C7 — La résolution de `related` n'est pas spécifiée de manière déterministe

Le PRD demande jusqu'à trois suggestions selon relation explicite, projet, pilier, tags et récence, avec exclusion de l'article courant et des contenus non publics (`prd.md:195-203`). Il ne tranche toujours pas si une relation invalide échoue au build ou est omise avec avertissement (`prd.md:455-462`).

L'investigation constate qu'aucun validateur de cibles `related` n'existe, que le filtre des listes n'est pas appliqué aux relations et que `crawlLinks: true` peut transformer une relation non filtrée en route pré-rendue (`investigation:191-195`, `233-237`, `335-341`). Le companion donne un ordre recommandé, mais ce n'est pas encore un contrat exécutable (`content-contract.md:101-117`).

**Impact :** lien vers un draft, noindex, futur ou slug absent; auto-référence; expansion accidentelle du graphe SSG; résultat différent entre page, hub et crawler.

**Réconciliation requise :** adopter l'ordre de résolution ou le remplacer, définir les critères de pertinence, le traitement des cibles invalides, la limite de trois, et faire résoudre/filtrer les cibles avant le rendu HTML et le crawl. Ajouter une fixture valide et une fixture invalide dans les assertions CI.

### C8 — La découverte des hubs Vue et leur SEO ne sont pas couverts par le contrat de route

Le PRD nomme correctement les trois hubs et affirme qu'ils ne doivent pas être traités comme des articles (`prd.md:161-179`). L'investigation montre toutefois que le catch-all `/blog/[...slug]` peut capturer un hub et que le scan Content ne voit pas les hubs Vue (`investigation:197-207`, `227-237`). Chaque hub doit donc posséder sa propre route SEO, son entrée sitemap et son assertion HTML (`investigation:327-333`; `content-contract.md:140-154`).

Le PRD exige un propriétaire unique pour canonical/sitemap/robots/AEO (`prd.md:253-261`, `315-323`) mais ne formule pas les assertions de découverte, de précédence, de slug réservé ou de hub vide au niveau d'une story.

**Impact :** hub absent du sitemap, hub capturé par le catch-all, double route, ou lien hub qui crawler une URL non voulue.

**Réconciliation requise :** inscrire les routes Vue dédiées dans la matrice de découverte, définir leur SEO/canonical, interdire les slugs d'articles qui leur correspondraient, vérifier le comportement avec corpus vide et ajouter une assertion dédiée pour chaque hub. Le simple fait de nommer les URLs dans le PRD ne suffit pas.

### C9 — La politique auteur et la politique trailing-slash restent ambiguës

Le PRD demande une seule page auteur canonique (`prd.md:219-227`) mais laisse ouverte la question `/about` versus `/a-propos` (`prd.md:455-457`). L'investigation confirme que `/about` est la page auteur existante et qu'elle ne contient pas encore de carte éditoriale ou de derniers articles (`investigation:107-111`, `143-147`).

Par ailleurs, le PRD reconnaît le risque canonical/trailing-slash (`prd.md:319`, `363-371`, `455-463`) tandis que l'investigation a relevé un écart possible entre canonical généré et redirections GitHub Pages, à confirmer par probes HTTP (`investigation:84`, `311-317`). Les URLs doivent venir de Site Config (`project-context.md:144-147`; `prd.md:337-341`).

**Impact :** deux URLs auteur, canonical contradictoire, redirections répétées sur chaque hub/article, ou distribution de liens non canoniques.

**Réconciliation requise :** décider l'URL canonique et l'alias éventuel avant les stories; étendre `/about` si c'est le choix par défaut, ou définir la migration contrôlée. Décider une forme trailing-slash et vérifier canonical, `og:url`, sitemap et URL servie après déploiement. Ne jamais coder le domaine dans les nouveaux critères.

### C10 — RSS reste un périmètre conditionnel sans contrat exécutable

FR-15 et l'architecture mentionnent un flux statique éventuel, mais le PRD ne décide ni son inclusion dans le MVP, ni son propriétaire, ni son format; il le reconnaît dans les questions ouvertes (`prd.md:273-281`, `351-358`, `453-463`). L'investigation confirme qu'aucune route ou module RSS n'existe et qu'il faut choisir un propriétaire statique, le path, le MIME, la découverte et le filtrage (`investigation:203-207`, `495-508`). L'addendum le classe comme option à contrat propre, pas comme sous-produit AEO (`addendum.md:89-100`).

**Impact :** une story peut créer une distribution non prévue, ou le PRD peut déclarer une capacité réussie alors que le flux n'a jamais été dans le backlog; les critères RSS ne sont pas assignables.

**Réconciliation requise :** décider explicitement `in` ou `out` du MVP. Si `in`, spécifier propriétaire, génération statique, chemin, MIME, discovery, champs item, limite, politique des exclusions et assertions. Si `out`, retirer les vérifications RSS des critères de sortie de la capability distribution.

### C11 — La définition de validation du PRD est trop générale pour être une gate de livraison

FR-17 demande seulement un code Docker `0`, la suppression des fixtures et la consignation des résultats (`prd.md:301-311`). La gate existante est pourtant le seul protocole disponible; aucun framework Vitest/Jest/Playwright n'est configuré (`project-context.md:187-192`; investigation:161-165). L'investigation fournit des assertions nécessaires mais plus précises: absence des états exclus dans HTML/sitemap/AEO/RSS, cohérence des dates, canonical, related, MIME et `CNAME` (`investigation:567-675`).

Le PRD exige aussi un premier article réel et un parcours de bout en bout (`prd.md:373-381`, `426-441`), alors que le corpus actuel est vide et que les quatre articles de démonstration doivent rester des drafts ou des fixtures supprimées (`investigation:119-129`; `content-contract.md:168-177`).

**Impact :** un build vert peut ne pas prouver l'absence de fuite, la cohérence des dates ou la présence des hubs; la preuve navigateur/production peut être déclarative plutôt que reproductible.

**Réconciliation requise :** reprendre les assertions du plan de vérification comme critères story-level; distinguer gate Docker, smoke test navigateur et probes post-déploiement; définir qui fournit l'article réel, quelle fixture publiée temporaire est utilisée, et où les résultats sont inscrits. Le PRD ne doit pas utiliser SM-1 comme substitut à une fixture publiée et à un article réel.

### C12 — Le baseline de thème/DS est contradictoire entre les sources

Le PRD demande une expérience « sombre ou claire selon le système de thèmes existant » (`prd.md:287-295`, `347-349`). Le `project-context.md` déclare pourtant le site dark-first, sans thème clair, et doit sanctuariser le terminal sombre (`project-context.md:232-239`). À l'inverse, `epics.md` contient un Epic 13 complet Light & Dark (`epics.md:87-93`, `287-289`, `1051-1115`) et le sprint le marque terminé (`sprint-status.yaml:140-146`).

**Impact :** les stories blog ne savent pas quel rendu doit être considéré comme conforme; une validation visuelle peut être rejetée ou accepter une régression de thème.

**Réconciliation requise :** désigner la source de vérité de l'état actuel (code, contexte projet ou Epic 13), corriger la formulation du PRD si nécessaire, et écrire les critères visuels du blog contre ce baseline. Le blog ne doit pas rouvrir le thème ni le DS.

## Gaps mineurs et dette de planification

### M1 — `epics.md` et le registre de statut ne sont pas une vue courante cohérente

Le fichier de planning est déclaré généré le 18 juin et mis à jour le 24 septembre (`sprint-status.yaml:1-2`), mais plusieurs epics antérieurs restent `in-progress` malgré leurs stories et rétrospective `done` (`sprint-status.yaml:44-118`). L'investigation signale explicitement l'incohérence d'Epic 6 (`investigation:677-684`). Les stories plus récentes comptent encore un nombre fixe de routes (`epics.md:892`, `912`, `1049`, `1137`), alors que le PRD et l'investigation demandent de valider les artefacts présents plutôt qu'un total hypothétique (`investigation:581-621`; `verification-plan.md:65-76`).

**Action :** séparer la dette de statut de la décision Epic 16/extension et supprimer les assertions de nombre de routes des futurs critères blog.

### M2 — Dérive `yarn` / `pnpm` dans les anciens critères

Les stories de migration utilisent encore `yarn install`, `yarn lint` et `yarn generate` (`epics.md:307-351`), et NFR5 mentionne la chaîne yarn (`epics.md:112-130`), alors que le contexte et l'addendum imposent pnpm via Docker (`project-context.md:162-183`; `addendum.md:59-64`).

**Action :** ne pas copier ces critères dans les stories blog; utiliser la commande Docker pnpm unique et corriger les références héritées lors du passage de planification.

### M3 — Domaine hardcodé dans les critères de l'Epic 14

Le PRD et le contexte interdisent le hardcoding du domaine (`prd.md:337-341`; `project-context.md:144-147`), mais les critères d'acceptation 14.4 exigent une URL absolue `https://jouan.ovh/sitemap.xml` et une ligne robots hardcodée (`epics.md:1212-1225`). La story 10.7 contient la même ancienne forme (`epics.md:795-806`).

**Action :** traiter ces lignes comme dette de planning à corriger avant réutilisation; les nouvelles routes doivent résoudre l'origine via Site Config et être vérifiées sur l'URL effectivement servie.

### M4 — Les liens de sources du frontmatter PRD sont mal résolus

Les entrées `../../specs/...`, `../../implementation-artifacts/...` et `../../project-context.md` (`prd.md:6-10`) sont relatifs au dossier du PRD et pointent vers `docs/planning-artifacts/...`, alors que les companions existent sous `docs/specs/spec-blog-editorial/` (`SPEC.md:1-15`), `docs/implementation-artifacts/investigations/` (`investigation:1-17`) et `docs/project-context.md` (`project-context.md:1-15`). Les références de la section 17 utilisent correctement des chemins depuis la racine (`prd.md:482-490`).

**Action :** corriger uniquement la documentation de référence dans une édition ultérieure du PRD si cela est autorisé; ce rapport ne modifie pas le PRD. Le lien de la SPEC doit être vérifiable sans convention implicite.

### M5 — La navigation principale n'est pas décidée

Le PRD demande si le blog revient dans la navigation principale (`prd.md:455-464`). L'investigation observe qu'il est lié depuis la homepage et le footer, mais pas depuis la navigation principale (`investigation:677-684`). FR-6 ne dit que « surfaces publiques retenues » (`prd.md:171-179`).

**Action :** choisir header, footer ou les deux avant le découpage UI; ne pas créer deux propriétaires de navigation ni ajouter une story de navigation non nécessaire.

### M6 — Le plan d'analytics blog entre en collision avec un non-goal

La story 14.3 déjà prévue émet `blog_code_copied` (`epics.md:1193-1210`), alors que le PRD exclut explicitement le bouton de copie et le temps de lecture calculé (`prd.md:391-400`). Le PRD demande par ailleurs des événements de lecture/consentis sans définir le payload minimal (`prd.md:437-441`, `383-389`).

**Action :** conserver le propriétaire analytics d'Epic 14, supprimer ou conditionner l'événement copy hors périmètre, et définir les champs autorisés et la minimisation de la vie privée de tout événement blog. Aucun contenu éditorial privé ne doit être envoyé.

### M7 — Les labels de format et la terminologie ne sont pas normalisés dans le PRD

Le PRD emploie plusieurs formulations non françaises ou fautives (`Realizes`, `texte alternatifapproprié`, `des tokens`, `volontaires-described`, `recommendation IA`) (`prd.md:110-118`, `205-213`, `287-295`, `417-428`). Ce n'est pas un blocage de schéma, mais cela augmente le risque de créer des libellés UX, clés analytics ou critères de validation divergents.

**Action :** faire une passe de normalisation éditoriale après les décisions de contrat, en conservant les trois piliers et les valeurs machine du companion.

## Éléments préservés

Les points suivants sont correctement préservés par le PRD et ne doivent pas être perdus lors de la correction du planning:

1. **Blog brownfield, pas nouveau système.** Le PRD reconnaît l'index, la route article, Content, le DS, le SEO et la gate existants (`prd.md:17-19`, `343-345`), exactement comme l'investigation (`investigation:89-123`, `528-549`).

2. **Source Markdown et absence de CMS externe.** Le PRD impose `content/blog/`, la génération statique et exclut CMS, base éditoriale, commentaires et newsletter (`prd.md:93-108`, `351-358`, `391-400`), aligné avec l'addendum et le contexte (`addendum.md:57-64`; `project-context.md:65-79`).

3. **Réutilisation de `SITE.profile` et `SITE.projects`.** Le PRD évite une seconde base auteur/projet et exige résolution par source partagée (`prd.md:215-237`, `470-480`), conformément à l'investigation (`investigation:101-111`, `185-189`) et à l'addendum (`addendum.md:68-77`, `93-100`).

4. **Un seul propriétaire SEO/AEO.** Le PRD interdit le double propriétaire de canonical, JSON-LD, sitemap, robots et AEO (`prd.md:253-271`, `315-323`, `337-341`, `391-400`), ce qui préserve l'architecture existante décrite dans `project-context.md:144-147` et l'investigation (`investigation:113-117`, `203-225`).

5. **Aucune promesse de classement, de citation ou de trafic.** Le PRD traite SEO/AEO/RSS comme des couches de compatibilité et de distribution, pas comme des raccourcis de classement (`prd.md:263-281`, `337-341`, `426-447`), cohérent avec la recherche de l'addendum (`addendum.md:13-32`).

6. **Qualité de preuve plutôt que volume.** Vision, FR-2, garde-fous et counter-metrics interdisent les métriques, résultats et relations inventés (`prd.md:21-27`, `127-145`, `328-335`, `443-447`). Cela est cohérent avec l'exigence de l'investigation d'un resolver partagé et avec la liste des anti-patterns (`investigation:247-325`; `addendum.md:24-34`).

7. **Publication non implicite des drafts.** Le PRD exige validation, état draft explicite et absence des brouillons/futurs dans les listes (`prd.md:116-125`, `151-159`, `243-251`). Cela préserve le contrat d'indexabilité existant (`investigation:125-129`, `209-243`).

8. **Relations bornées et non privées.** Le PRD interdit les relations vers des contenus non publics et les URLs de dépôts/chemins internes (`prd.md:171-179`, `195-203`, `229-237`, `322-326`, `383-389`). La partie non résolue est le resolver et l'identifiant public du projet, pas le garde-fou lui-même.

9. **Design system et accessibilité sans seconde direction artistique.** Le PRD exige les tokens, composants existants, liens externes, focus, contraste, mobile et réduction de mouvement (`prd.md:283-295`, `313-326`), aligné avec le contexte (`project-context.md:87-108`, `207-230`) et l'investigation (`investigation:287-293`).

10. **Docker-only, pnpm et gate existante.** Le PRD impose la compatibilité Nuxt 4/Content v3/SSG/GitHub Pages et l'exécution Docker sans framework de test dédié (`prd.md:297-326`, `301-311`), aligné avec le contexte (`project-context.md:162-192`) et l'addendum (`addendum.md:59-64`).

11. **Corpus vide et fixtures non publiques.** Le PRD reconnaît que le corpus est vide, interdit la publication des fixtures et demande un premier article réel (`prd.md:332-345`, `373-389`, `430-435`), ce qui préserve le diagnostic de l'investigation (`investigation:119-129`, `654-675`).

12. **Non-régression de la homepage et du déploiement.** Le PRD inclut la homepage, les routes existantes, `gh-pages`, `CNAME` et budgets AEO dans ses NFR et critères (`prd.md:323-326`, `426-440`), ce qui est explicitement recommandé par l'investigation (`investigation:131-135`, `247-277`).

## Séquence de réconciliation recommandée

1. **Geler le diff structurel.** Isoler l'Epic 14 ou créer un commit propre; consigner le checkpoint, les stories 14.2/14.6 à revoir et la preuve de production disponible.
2. **Décider les contrats bloquants.** Date, auteur, projet, visibilité/preview, overrides SEO, goals, related, RSS et trailing-slash. Consigner chaque décision dans la SPEC/contract companion, puis mettre le PRD en cohérence.
3. **Réconcilier le planning.** Choisir Epic 16 ou extension d'Epic 6; corriger le statut d'Epic 6 et d'Epic 14; créer une story par capability et une dépendance explicite vers le checkpoint.
4. **Implémenter le resolver avant les surfaces.** Définir le contrat frontmatter, la résolution d'indexabilité, les URLs, les labels, l'auteur/projet et les relations; le partager entre index, homepage, hubs, article, SEO, AEO et distribution.
5. **Découper les stories.** Contrat/resolver; homepage et hubs; article et auteur; relations projet/related; SEO/AEO; RSS si approuvé; validation visuelle et post-déploiement.
6. **Valider sans polluer le corpus.** Utiliser les fixtures minimales de l'investigation et du plan de vérification, lancer la gate Docker, inspecter les artefacts, vérifier desktop/mobile/clavier, puis supprimer les fixtures (`investigation:567-675`; `verification-plan.md:12-127`).
7. **Publier et mesurer.** Publier un article réel, mesurer les signaux consentis de manière descriptive et consigner les limites de production; ne pas transformer cette étape en promesse SEO (`prd.md:373-389`, `426-447`).

## Conclusion

Le draft PRD est une bonne base de **vision et de cadrage**, et il conserve les garde-fous brownfield essentiels. Il n'est pas encore un **plan de livraison réconcilié**. Les trois objets qui bloquent le plus la création de stories sont: le choix de l'unité de planning et du checkpoint Epic 14, le contrat transverse de publication/résolution, et la fermeture des décisions qui exposent de nouvelles surfaces (hubs, related, projet, auteur, RSS, canonical). Tant que ces éléments ne sont pas consignés dans les artefacts de SPEC/planning, le statut correct reste **draft — blocked for story creation**.

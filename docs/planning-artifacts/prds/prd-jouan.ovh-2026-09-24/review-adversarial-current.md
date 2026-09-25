# Revue adversariale du PRD courant

Date de revue : 2026-09-25

## Périmètre et verdict

Périmètre relu depuis les fichiers courants, sans utiliser les revues précédentes :

- `prd.md` — SHA-256 `5f1b3360a20e2a3ba105f08b9eff5a6f11ae22ff27b80d48c137b329cf6ef6f2`
- `addendum.md` — SHA-256 `4407665b15c86c67f7e77de383b781f75f958883d2e8c3dc3ecc9d8819c5c2f6`
- `docs/specs/spec-blog-editorial/SPEC.md` — SHA-256 `176af27b61a473632bab51d7310248caab934a0da2c2cd5d8aa51432b210d4cf`
- Companions normatifs `content-contract.md`, `verification-plan.md`, `brownfield.md` et `architecture-diagrams.md`
- Priorité utilisateur explicite dans le PRD/addendum : **autorité technique démontrable > valeur pour une audience qualifiée > utilité commerciale**, avec le blog qui doit prouver avant de vendre.

**Verdict : `CHANGES_REQUIRED — NOT IMPLEMENTATION_READY`.**

La priorité utilisateur est bien formulée et plusieurs garde-fous sont désormais visibles. Mais le découpage phase 1/phase 2 reste contredit par la SPEC canonique et son plan de vérification, la gate FR-18 n'est pas exécutable, la visibilité et la migration ne sont pas déterministes, et les procédures de confidentialité, correction, analytics et rollback ne couvrent pas les incidents qui peuvent réellement se produire. Le PRD ne doit pas encore être transformé en stories sans ratification des points critiques et de sévérité haute.

| Sévérité | Nombre |
| --- | ---: |
| Critique | 1 |
| Haute | 12 |
| Moyenne | 5 |
| Basse | 2 |

## Findings

### CRITICAL

#### C-01 — Le rollback Git n'est pas un takedown sûr pour une fuite de données

**Zone :** confidentialité, takedown, rollback.

**Preuve :** `prd.md:499-502` propose de retirer ou de révoquer un article, régénérer et redéployer ; `prd.md:506-510` affirme en parallèle que les données privées ne sont pas exportées. La NFR-8 (`prd.md:383`) traite les contenus privés comme une contrainte forte.

**Échec :** un `git revert` ne supprime ni le secret du historique Git, ni les données d'un déploiement GitHub Pages antérieur, ni potentiellement les copies dans AEO, RSS, caches, moteurs ou archives. La procédure actuelle peut donc déclarer un incident de confidentialité résolu alors que la donnée reste récupérable. Elle ne distingue pas une correction éditoriale réversible d'un incident de secret ou de donnée personnelle.

**Correction requise :** définir deux procédures distinctes : rollback éditorial et takedown de confidentialité/sécurité. La seconde doit couvrir la classification de l'incident, la rotation des secrets concernés, la suppression ou décision explicite sur l'historique Git, la purge des artefacts et caches contrôlés, la demande de retrait aux surfaces tierces, le comportement 404/410, le propriétaire, et une preuve de vérification. Le PRD doit assumer explicitement le risque résiduel si un nettoyage de l'historique n'est pas possible.

### HIGH

#### H-01 — Le découpage première release/roadmap contredit la SPEC canonique et son signal de succès

**Zone :** périmètre, première release, roadmap.

**Preuve :** la SPEC se déclare « contrat canonique » et « complet » (`SPEC.md:15`). Son signal de succès exige un article réel découvert depuis `/`, `/blog` et son hub, relié à son projet et à ses articles, puis projeté vers SEO, JSON-LD, sitemap, AEO et RSS si inclus (`SPEC.md:85-89`). Les capacités de hubs, related, auteur et projet n'y sont pas conditionnées à une phase ultérieure. À l'inverse, le PRD classe ces capacités en phase 2 (`prd.md:196-269`, `prd.md:523-552`).

**Échec :** deux contrats normatifs donnent des définitions opposées de « release ». Une story peut être rejetée comme hors scope par le PRD mais requise par la SPEC, ou inversement. Le PRD ne peut pas réécrire unilatéralement le contrat canonique.

**Correction requise :** mettre à jour la SPEC et son signal de succès, ou déclarer le PRD comme une révision contrôlée de cette SPEC avec dérogations explicites par capacité. Les statuts phase 1/phase 2 doivent exister dans la source canonique, pas seulement dans le PRD.

#### H-02 — FR-17 réintroduit la phase 2 par le plan de vérification normatif

**Zone :** première release, fixtures, définition de terminé.

**Preuve :** FR-17 désigne `verification-plan.md` comme checklist normative (`prd.md:343-356`). Ce plan exige des fixtures avec `project` et `related`, les trois hubs (`verification-plan.md:14-27`), inspecte leurs HTML (`verification-plan.md:47-63`) et refuse de terminer une story si hubs, related et surfaces de distribution ne sont pas cohérents (`verification-plan.md:117-127`). Le PRD affirme pourtant que ces capacités ne bloquent pas la première release.

**Échec :** même si FR-17 distingue une matrice « étendue », le plan normatif ne contient pas de gate par phase. En l'état, la définition de terminé de la première release réimporte la roadmap et la séparation n'est pas enforceable.

**Correction requise :** versionner un plan de vérification explicite sur les phases, avec exigences minimales et gates d'extension, ou ajouter une dérogation normative explicite. Chaque fixture et assertion doit porter une phase et un FR associé.

#### H-03 — La gate production est post-déploiement et ne peut pas protéger le premier déploiement

**Zone :** rollback, release safety, déploiement.

**Preuve :** FR-17 exige le bundle production avant clôture de release mais le décrit comme manuel après déploiement (`prd.md:349-354`). La section 14 confirme que les probes production sont post-déploiement et ne sont pas une gate de build local (`prd.md:568`). GitHub Pages publie depuis `main` (`prd.md:464-469`).

**Échec :** un contenu non conforme peut donc être mis en ligne avant la seule vérification censée fermer la release. « Clôturer » après le déploiement n'est pas un gate de déploiement. La séquence rollback → build → déploiement → probe n'a pas de précondition de publication.

**Correction requise :** définir un environnement de préproduction ou un artefact immuable vérifié avant promotion, un mécanisme de promotion contrôlée, des déclencheurs de rollback et une preuve post-déploiement. À défaut, le PRD doit assumer que la première publication est un déploiement canari et définir son protocole de retrait.

#### H-04 — FR-18 ne définit pas ce qui constitue une preuve suffisante

**Zone :** gate éditoriale, priorité utilisateur.

**Preuve :** `prd.md:360-368` exige une checklist et parle d'un article « sans preuve suffisante », sans définir les critères de suffisance, les résultats possibles, les éléments bloquants ou les exceptions. La checklist de l'addendum (`addendum.md:52-59`) ne contient pas exactement les mêmes catégories que FR-18 : elle ne reprend explicitement ni alternatives, ni réutilisabilité, ni licences, alors que FR-2 les exige (`prd.md:161-166`).

**Échec :** la gate centrale de la priorité « prouver avant de vendre » peut être cochée subjectivement. Trois listes incomplètes et non normatives produisent des décisions différentes selon l'agent ou le jour.

**Correction requise :** fournir un formulaire normatif unique, avec champs obligatoires, preuves attendues par type d'affirmation, résultat binaire ou motifs contrôlés, conditions de rejet, exceptions explicitement motivées et approbateur nommé. La checklist doit être versionnée et ses divergences résolues.

#### H-05 — L'approbation de preuve n'est ni durable ni liée à la version de l'article

**Zone :** FR-18, traçabilité, corrections.

**Preuve :** la checklist et la décision sont conservées dans « l'historique éditorial ou le journal de story » (`prd.md:367`). La NFR-12 impose le Dev Agent Record (`prd.md:387`), mais ce journal est un artefact d'implémentation, pas une source éditoriale durable pour toutes les publications futures. Aucun slug, commit, hash, date de décision ou auteur de décision n'est lié à l'article ; aucune revalidation après édition n'est demandée.

**Échec :** le corps de l'article peut changer après approbation sans invalider la gate. La preuve porte sur un document qui n'est plus celui publié. Après la clôture de la story, le processus n'a plus de dépôt stable défini.

**Correction requise :** définir un enregistrement éditorial durable, minimal et versionné, lié à `slug + commit/content hash + checklist version + décision + date + responsable`. Toute modification substantielle doit invalider et refaire FR-18 avant publication.

#### H-06 — La matrice de visibilité confond exclusion sitemap et non-publication

**Zone :** visibilité, contrat de contenu.

**Preuve :** le PRD sépare explicitement publication et indexabilité (`prd.md:128-130`) puis décide qu'une entrée `sitemap:false/null` n'a aucune route production et retourne 404 (`prd.md:425`, `prd.md:443-451`). Le contrat de contenu companion laisse au contraire les listes, hubs et HTML direct soumis à une politique de preview/publication (`content-contract.md:156-166`).

**Échec :** une simple exclusion sitemap est transformée en état privé. Un article publié mais volontairement absent du sitemap devient inaccessible, ce qui n'est pas équivalent et n'est pas dérivé de la source canonique.

**Correction requise :** décider explicitement si `sitemap:false/null` est un simple indicateur d'indexabilité ou un interrupteur de confidentialité/publication. Définir des champs distincts si nécessaire et aligner SPEC, companion, helper, route et fixtures. Ne pas permettre qu'un nom de champ porte deux sémantiques opposées.

#### H-07 — La matrice de visibilité reste incomplète et non déterministe

**Zone :** visibilité, exclusions, preview.

**Preuve :** la matrice ne contient aucune ligne pour `robots:false` (`prd.md:443-451`), alors que FR-17 et la SPEC companion l'exigent (`prd.md:350`, `SPEC.md:45-47`, `verification-plan.md:14-22`). Elle ne définit aucune priorité pour les combinaisons `draft + noindex + robots + sitemap`, ni résultat pour `noindex:true` sans phrase exécutable : « selon politique » et « selon la politique de preview » (`prd.md:449-450`). Preview n'est pas un axe distinct et aucun mécanisme, environnement ou statut HTTP n'est défini.

**Échec :** deux implémentations peuvent chacune respecter ce tableau tout en produisant des HTML, Markdown, sitemap, AEO, statuts directs et liens différents. Cela viole l'exigence de cohérence de FR-12 (`prd.md:281-289`).

**Correction requise :** ajouter toutes les lignes et combinaisons nécessaires, une règle de précédence déterministe, des valeurs exactes par surface, un axe preview explicite et des assertions de build/production. La question ouverte doit être ratifiée avant la story de visibilité.

#### H-08 — Les règles de migration sont déclarées décidées alors qu'elles restent ouvertes

**Zone :** migration, `date`/`publishedAt`.

**Preuve :** `prd.md:370-372` affirme que le choix entre lecture duale et migration atomique est tranché dans la SPEC et le journal de décision. Le même PRD maintient une valeur par défaut provisoire (`prd.md:408-420`) et laisse la question ouverte et bloquante (`prd.md:603-610`). La SPEC dit à la fois que `date` reste la valeur par défaut et que le choix est ouvert (`SPEC.md:63-66`, `SPEC.md:99-102`). Le companion n'accepte `publishedAt` qu'après définition d'une règle de résolution unique (`content-contract.md:7-13`).

**Échec :** l'autorité normative annonce une décision inexistante. Il manque notamment le comportement quand un seul champ est présent, la normalisation, le cas des deux champs égaux, le remplissage des données, la fenêtre de compatibilité, la dépréciation et le test de rollback. Le PRD exige aussi une date dans FR-1 sans définir comment l'alias peut la remplacer.

**Correction requise :** ratifier un seul chemin avant la story de schéma, le répliquer dans tous les artefacts canoniques, puis ajouter une procédure de migration avec préconditions, ordre des consommateurs, critères de succès, chemin de retour et test de non-divergence.

#### H-09 — Les contrôles de confidentialité et de chaîne d'approvisionnement restent des intentions sans mécanismes

**Zone :** vie privée, confiance éditoriale, chaîne d'approvisionnement.

**Preuve :** FR-2 renvoie à une « politique de confiance » pour liens, images distantes, HTML brut et code (`prd.md:166`). L'addendum dit seulement que ces usages sont « documentés et vérifiés » et qu'aucune dépendance distante n'est requise pour lire l'article (`addendum.md:61-67`). NFR-10 ne demande qu'une justification pour les dépendances lourdes (`prd.md:385`).

**Échec :** aucune politique effective ne définit les hôtes ou protocoles autorisés, la gestion des scripts, iframes et gestionnaires d'événements, l'assainissement HTML, les scripts de suivi dans les images, l'en-tête Referer des liens, les paramètres URL, les licences, l'approbation des dépendances, les versions épinglées, la vérification des vulnérabilités ou les secrets. « Aucune dépendance distante requise » ne supprime ni le suivi lors d'un build ou d'une visite, ni le risque XSS. Aucun gate CI ne recherche les secrets ou les ressources non autorisées.

**Correction requise :** ajouter une matrice ressource/action/autorisation, des listes d'autorisation et des interdictions explicites, une politique d'assainissement/CSP, le comportement de repli des assets, la minimisation du référent, un contrôle des secrets avant publication, une revue des licences et dépendances, et des assertions automatisées. La vie privée doit inclure les sorties réseau tierces, pas seulement les analytics consenties.

#### H-10 — Le cycle de correction n'est pas un contrat de produit exploitable

**Zone :** corrections, fraîcheur, takedown, slugs.

**Preuve :** FR-3 exige une note Git pour une correction substantielle et sa visibilité dans le parcours (`prd.md:169-180`), mais ne définit ni « substantiel », ni format, emplacement ou statut de la note, ni relation avec `updated`/`dateModified`, ni revalidation FR-18, ni traitement d'une erreur factuelle, d'une rétractation ou d'une dépréciation. Le risque assigne Simon (`prd.md:483`), tandis que le rollback assigne le responsable de release (`prd.md:502`). Le renommage ultérieur ne demande qu'une « décision de redirection » sans propriétaire, forme, durée, mise à jour sitemap/AEO/RSS ni test (`prd.md:177`).

**Échec :** deux articles peuvent être corrigés de manière incompatible, la fraîcheur peut être manipulée indirectement, une correction peut disparaître lors d'un revert, et un slug peut changer sans migration cohérente. La correction, qui sert de signal d'autorité, reste non auditable pour le lecteur.

**Correction requise :** définir un cycle de vie et un contrat de correction : catégories mineure/majeure/rupture/takedown, champs rendus, sémantique de `updated`/`dateModified`, approbation, nouvelle vérification de preuve, historique public minimal, propriétaire, délai d'intervention, liens de version et politique de slug/redirection/410.

#### H-11 — La frontière analytics n'est ni interdite explicitement ni vérifiable

**Zone :** analytics, mesure, vie privée.

**Preuve :** NFR-11 dit seulement qu'aucun nouvel événement n'est « requis » (`prd.md:386`), tandis que la première release exige de fonctionner « sans nouvel événement » (`prd.md:533`) et que l'out of scope exige une revue de vie privée (`prd.md:554-562`). Ces formulations n'ont pas la même force. La mesure utilise Search Console, les retours et les recherches (`prd.md:54`, `prd.md:581-593`), mais aucun contrat ne décrit le fournisseur, les propriétés, la rétention, les paramètres, les URLs AEO/RSS, les exclusions de routes, le consentement effectif ou le traitement des requêtes de recherche et des retours pouvant contenir des données personnelles. La SPEC ne définit pas de capacité analytics.

**Échec :** une implémentation peut ajouter un événement et rester conforme à NFR-11; elle peut aussi exposer titre, slug, pilier, source, query string ou feedback dans un agrégat alors que la boundary est censée être minimale. Les assets et liens tiers échappent aussi à ce périmètre.

**Correction requise :** rendre l'interdiction de nouvel événement et de nouvelle propriété explicite pour la phase 1 ; ajouter un inventaire et une liste d'autorisation des événements et propriétés existants, les tests de consentement et de non-régression, la politique de conservation, le traitement de Search Console et des retours, les exclusions techniques et la liste des sorties réseau autorisées. Toute évolution doit avoir un dictionnaire de données et une revue de vie privée préalable.

#### H-12 — Le rollback technique n'a ni déclencheur, ni dernier bon état, ni couverture de vérification

**Zone :** rollback, déploiement, migration.

**Preuve :** `prd.md:497-502` décrit quatre actions générales, mais ne définit pas les seuils de déclenchement, le commit ou l'artefact « dernier état connu valide », la procédure de redéploiement GitHub Pages, l'invalidation des caches, la purge sitemap/AEO/RSS, les anciens déploiements, le lien avec le rollback de schéma, ni un exercice. Le plan de vérification ne couvre qu'un probe post-déploiement (`verification-plan.md:104-115`).

**Échec :** pendant un incident, l'équipe doit inventer la stratégie et peut déployer un état incohérent ou supprimer des corrections ultérieures. Un article restauré peut être conforme localement mais encore présent dans un artefact distribué ou un cache.

**Correction requise :** ajouter une matrice incident/rollback, les déclencheurs, l'artefact de référence, les commandes et critères d'autorité, la couverture HTML/Markdown/sitemap/robots/AEO/RSS/analytics, la gestion des caches et de la recherche, l'escalade et un exercice de rollback avant clôture.

### MEDIUM

#### M-01 — La provenance de la priorité utilisateur n'est pas stabilisée

**Zone :** source de vérité, priorité.

**Preuve :** l'addendum exige que le brief original et les nouvelles décisions soient versionnés séparément avant de finaliser la SPEC (`addendum.md:48-50`). Le PRD demande encore si le brief doit être sauvegardé (`prd.md:622`). La règle autorité > audience > commerce existe dans les deux documents, mais aucun artefact source utilisateur daté ne la rend immuable.

**Échec :** la priorité qui arbitre tous les conflits produit peut encore changer sans version ni décision tracée, et les ajouts de phase 2 peuvent être réintroduits comme priorités sans preuve de ratification.

**Correction requise :** rendre le brief et la décision de priorité versionnés obligatoires avant finalisation de la SPEC, avec date, statut, responsable et références stables.

#### M-02 — Les parcours et l'architecture contiennent des dépendances phase 2 non étiquetées

**Zone :** première release, parcours, FR-6.

**Preuve :** UJ-1 à UJ-3 utilisent hubs, related et contextes projet (`prd.md:77-99`) ; FR-6 exige auteur, projet et articles liés (`prd.md:208-216`) ; l'architecture liste trois hubs et toutes les relations (`prd.md:463-469`). Ces capacités sont phase 2 dans `prd.md:542-552`, et FR-6 n'apparaît ni dans la liste minimale ni dans la roadmap.

**Échec :** les parcours de référence ne sont pas réalisables dans la première release et FR-6 devient une exigence orpheline, soit bloquante implicitement, soit ignorée sans règle.

**Correction requise :** marquer chaque parcours et FR avec sa phase et son comportement dégradé, redéfinir le chemin minimal de la première release, et placer explicitement FR-6 dans une phase ou limiter son périmètre à l'auteur et au pilier disponibles.

#### M-03 — La promesse « contenus fondamentaux/sélections » n'a pas de source de vérité pour la première release

**Zone :** FR-4, roadmap, curation.

**Preuve :** FR-4 promet contenus fondamentaux, derniers articles et sélections par pilier dans la première release (`prd.md:186-194`). La roadmap repousse la curation `featured` de la page d'accueil (`prd.md:548-549`). Aucun champ, règle de dérivation, responsable ou repli ne définit les contenus fondamentaux.

**Échec :** l'implémentation devra hardcoder une curation dans la page, ajouter `featured` hors scope, ou inventer une priorité déterministe non documentée.

**Correction requise :** définir soit une sélection dérivée et déterministe du contrat existant, soit reporter les sections correspondantes, soit ouvrir explicitement une capacité de curation phase 1 avec source de vérité et repli.

#### M-04 — Les gates de préparation technique et de lancement éditorial sont nominalement distinctes mais operationnellement confondues

**Zone :** métriques, première release, FR-18.

**Preuve :** la section 13 autorise une préparation livrable sans article réel (`prd.md:537-538`), tandis que le gate du premier slice accepte « article réel ou fixture » (`prd.md:568`) et SM-1 appelle cela la première release (`prd.md:571-572`).

**Échec :** un tableau de bord ou une revue de release peut voir la gate verte avec une fixture alors que la priorité autorité/preuve n'a pas été validée. La préparation technique et le lancement éditorial ont des critères distincts, mais une seule nomenclature de réussite.

**Correction requise :** séparer deux gates et deux métriques : préparation technique avec fixture, puis publication éditoriale avec article réel, FR-18 réussi et probe production. Ne pas qualifier la première de « release » dans les deux sens.

#### M-05 — `goals` est obligatoire dans le contrat minimal alors qu'il reste interne et sans consommateur pour la première release

**Zone :** minimalité, risque de priorité.

**Preuve :** `prd.md:529` inclut `goals` dans la première release, tandis que `prd.md:427` le maintient interne et sans effet sur publication, related ou CTA. Le companion le déclare interne par défaut (`content-contract.md:78-87`). Aucun FR de la première release ne le rend visible, mesurable ou bloquant au-delà de sa validation d'énumération.

**Échec :** le lot minimal introduit une donnée de triage potentiellement liée au SEO ou au business et une migration de schéma, alors que la preuve éditoriale ne l'utilise pas. Cela augmente la surface sans bénéfice pour la première release.

**Correction requise :** soit reporter `goals` jusqu'à un consommateur approuvé, soit définir explicitement son usage de gouvernance et son coût de migration, sans l'ajouter comme simple champ décoratif.

### LOW

#### L-01 — La matrice de visibilité présente RSS comme une sortie obligatoire

**Zone :** visibilité, RSS.

**Preuve :** la colonne `Sitemap, AEO et RSS` affirme `présent` pour un article publié/indexable (`prd.md:443-451`), alors que RSS est hors première release et conditionnel (`prd.md:313-321`, `prd.md:542-548`).

**Échec :** une story de visibilité peut créer un faux gate RSS ou supposer un propriétaire inexistant.

**Correction requise :** ajouter la mention « si implémenté/approuvé » dans la matrice ou placer RSS dans une colonne distincte dédiée à la roadmap.

#### L-02 — L'unicité de titre dépend d'un hub qui n'existe pas dans la première release

**Zone :** content contract, FR-1.

**Preuve :** le companion exige un titre éditorial unique dans son hub (`content-contract.md:27-30`), mais les hubs sont phase 2 et FR-1 ne pose aucune règle d'unicité first release.

**Échec :** une story de schéma peut implémenter une validation impossible ou laisser un contrat non testable jusqu'à la phase 2.

**Correction requise :** préciser la portée de l'unicité pour la phase 1 et son évolution à l'ouverture des hubs.

## Priorités de correction

1. Corriger C-01 et scinder correction éditoriale/takedown de confidentialité.
2. Réaligner la SPEC, les companions, le plan de vérification, la matrice de visibilité et les gates sur un découpage de release unique.
3. Rendre FR-18 déterministe, versionné et lié au contenu publié.
4. Bloquer les stories de schéma et de visibilité jusqu'à la ratification de la migration, du preview, de la précédence et de `robots`/`sitemap`.
5. Publier les contrats de confiance du contenu, de vie privée, de frontière analytics et de rollback avant la conception détaillée.

## Points positifs conservés

- La priorité éditoriale est explicite et la preuve précède la valeur commerciale.
- La vision distingue patrimoine, audience et commerce sans promettre trafic, classement, citation ou conversion.
- Les propriétaires SEO/AEO existants sont rappelés et la duplication de propriétaire est interdite.
- Le premier slice évite explicitement CMS, recherche, recommandation IA et événements analytics, sous réserve de la frontière à durcir.
- Les fixtures temporaires, la gate Docker et la non-régression homepage sont des garde-fous utiles.

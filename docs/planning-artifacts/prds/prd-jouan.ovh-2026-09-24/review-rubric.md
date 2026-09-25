# PRD Quality Review — prd-jouan.ovh-2026-09-24

## Overall verdict

Le PRD tient sur le fond : la thèse est spécifique, la recherche et les anti-patterns de l’addendum sont réellement liés au produit, et les non-goals brownfield sont explicites. Il reste toutefois un document de cadrage, pas un contrat exécutable : plusieurs décisions fondatrices sont simultanément présentées comme defaults et rouvertes en questions, et les critères de succès du premier slice ne correspondent pas à son périmètre annoncé. Après arbitrage de ces points et conversion des conséquences vérifiables en états/assertions nets, il pourra servir de base fiable aux workflows UX, architecture et stories.

## Decision-readiness — adequate

Le document fait un effort réel de honnêteté : §0 et la ligne « Ce PRD a été rédigé en **Fast path** » disent que le cadrage ne remplace pas la gate `bmad-correct-course`, tandis que §15 signale trois tensions qui bloquent effectivement le travail aval. Le problème n’est donc pas l’absence d’un point de vue ; c’est l’absence d’un statut de décision unique. Un décideur peut recommander les defaults de §6.3, mais il ne peut pas savoir si ces defaults sont déjà arrêtés, provisoires, ou destinations de questions ouvertes.

### Findings

- **high** **Les « décisions » de §6.3 ne sont pas des décisions fermées** (§6.3, §10, §15) — §6.3 affirme que « Le PRD adopte les defaults suivants pour éviter que les workflows aval inventent des contrats », puis §10 demande encore de valider « date, auteur, projects, preview, related, RSS et canonical ». Le marqueur le plus fort est la note : « La décision `date` versus `publishedAt` [...] bloque la finalisation des stories. » Les mêmes choix (`date`, `/about`, related, visibilité) sont donc des propositions et des questions au même endroit. *Fix:* déplacer chaque default dans un tableau « décision / statut / propriétaire / date », puis supprimer la question correspondante ou la marquer explicitement comme « à trancher avant le slice ».

- **high** **Le premier slice n’a pas de contrat de sortie cohérent** (§13.1, §14.1, §10) — le slice indique « Les trois hubs, la page auteur enrichie, les relations projet bidirectionnelles et RSS constituent les slices suivantes », mais SM-1 « valide FR-1 à FR-17 » et SM-2 exige que « Les trois hubs, la homepage, la page auteur et les routes articles » soient accessibles. Une équipe ne sait donc pas si elle doit livrer un premier slice minimal ou une surface complète pour satisfaire les métriques. *Fix:* séparer les gates `MVP launch`, `slices suivantes` et `release complet`, avec des FR et SM différents pour chaque étape.

## Substance over theater — strong

La vision n’est pas générique : elle promet un « patrimoine technique vérifiable, utile et réutilisable » et formule une vraie règle de priorité, « Le blog doit prouver avant de vendre ». L’addendum apporte des observations, des anti-patterns et des options écartées qui conduisent à des choix du PRD (corpus navigable, checklists de preuve, refus du ranking shortcut, réutilisation des propriétaires SEO/AEO). Les UJ, même provisoires, discriminent des comportements qui produisent des exigences différentes — découverte, lecture longue, publication par Simon et consommation machine — et sont repris dans les descriptions de FR. Les NFR ne sont pas du boilerplate : elles nomment Nuxt Content, GitHub Pages, Docker, les propriétaires AEO et les interdictions de fuite. Aucun élément ne ressemble à de la persona, de l’innovation ou de la NFR purement décorative.

## Strategic coherence — strong

Il existe une thesis claire et les capacités en découlent : contrat de preuve, découverte par piliers, lecture longue, relations, distribution et validation. La priorité éditoriale, les anti-patterns, le premier slice et les counter-metrics (`SM-C1` à `SM-C3`) rendent l’arc cohérent plutôt que backlog. Les signaux `SM-8` et `SM-9` relient enfin explicitement les gates techniques à la valeur recherchée pour une audience qualifiée, tandis que l’absence de cible chiffrée est une prudence explicitement assumée, pas une omission accidentelle.

## Done-ness clarity — thin

La présence d’une section « Conséquences vérifiables » sous chaque FR et la commande Docker exacte de FR-17 sont un bon point de départ. Pourtant, beaucoup de conséquences sont des intentions de comportement plutôt que des conditions d’acceptation ; elles ne disent pas ce qui doit être observable, avec quelle valeur, dans quelle surface, et qui tranche. Le renvoi au plan de vérification est utile, mais il ne remplace pas la définition du résultat produit dans le PRD.

### Findings

- **high** **Les états de visibilité et les relations n’ont pas de matrice de résultat complète** (FR-8, FR-11, FR-12, FR-15, §15) — FR-8 interdit un « noindex public non autorisé » sans définir qui l’autorise ; FR-11 exige une destination publique alors que §15 demande encore ancre, page future ou contexte textuel ; FR-12 dit seulement que le comportement direct « est défini avant livraison » ; FR-15 demande que le chemin, le MIME, les champs et la limite « soient documentés ». Aucun couple état → résultat n’est donné pour HTML, listes, hubs, related, Markdown, sitemap, AEO et RSS. *Fix:* fournir une matrice exhaustive et bloquante, ou sortir ces capacités conditionnelles du MVP jusqu’à décision.

- **high** **Les critères éditoriaux, UX et non fonctionnels reposent encore sur des adjectifs** (FR-2, FR-3, FR-4, FR-6, FR-7, FR-9, FR-16, NFR-9–NFR-11) — « distingue », « importantes », « compréhensibles », « pertinentes », « sans overflow » et « reste compatible/non régressif » n’ont ni seuil, ni fixture, ni viewport, ni baseline. Par exemple, « Le contenu générique sans expérience originale n’est pas traité comme une preuve d’expertise » décrit une règle éditoriale, mais pas l’élément qui la rend vérifiable. *Fix:* préciser les champs ou sections de preuve obligatoires, les viewports et assertions d’overflow/contraste, les seuils de budget, la fenêtre de comparaison de la homepage et les résultats attendus en cas d’échec.

- **medium** **La preuve de livraison ne distingue pas les gates bloquantes des contrôles manuels** (FR-17, §10, NFR-12) — la commande Docker et la liste de fixtures sont précises, mais « Les résultats statiques, navigateur et production sont consignés » ne dit pas quel résultat fait échouer la story, qui exécute la sonde après déploiement, ni si cette sonde bloque la clôture. *Fix:* définir trois evidence bundles (build/local, navigateur, production) avec propriétaire, statut bloquant ou manuel, et champs d’évidence obligatoires.

## Scope honesty — adequate

Le PRD est honnête sur ce qu’il ne veut pas : §2.2, §12 et §13.2 excluent explicitement CMS, recherche, newsletter, pages tags, pages projet détaillées, refonte du DS et promesses SEO. Les hypothèses et les tensions sont visibles plutôt que dissimulées, ce qui est un point fort. La réserve vient du statut des capacités conditionnelles : elles restent dans le même espace de FR et de « In Scope », alors que le premier slice les reporte ou les conditionne ; un extracteur de backlog peut donc les prendre pour livrables.

### Findings

- **medium** **Les capacités conditionnelles ne sont pas marquées de façon uniforme comme hors du MVP** (§4.5, §12, §13.1–13.2) — `FR-15` est un RSS conditionnel, §13.1 dit « RSS uniquement si la question de contrat est tranchée », puis §13.2 ne dit pas que RSS lui-même est hors scope. De même, la relation projet et les hubs sont dans les fonctionnalités et l’In Scope, mais les pages projet détaillées sont ailleurs exclues et les hubs sont annoncés comme slices suivantes. *Fix:* séparer les IDs `MVP`, `conditional` et `deferred`, ou ajouter des marqueurs explicites `[NON-GOAL for MVP]` et des conditions d’entrée/sortie pour chaque capacité conditionnelle.

## Downstream usability — adequate

Le glossaire, les identifiants `FR-1` à `FR-17`, `UJ-1` à `UJ-5` et `SM-1` à `SM-9` sont faciles à parcourir, et les références vers les companions sont explicites. Le principal frein n’est donc pas la navigation du document, mais l’extraction du contrat : plusieurs termes de feature dépendent de décisions externes encore ouvertes, et le PRD ne donne pas une représentation autonome de la preuve éditoriale. Pour un PRD brownfield qui alimente UX, architecture et stories, cette ambiguïté se propage rapidement dans les mocks, les routes et les assertions.

### Findings

- **medium** **Le modèle de contenu et de visibilité n’est pas entièrement extractible du PRD** (FR-1, FR-2, FR-7, FR-14, §0, §3) — FR-7 demande au lecteur de voir « les sources » et le contexte projet, mais le PRD ne dit pas si les sources sont des sections du corps, un champ de frontmatter ou une structure de référence ; la matrice de champs déléguée à `content-contract.md` ne nomme pas non plus `sources`. `goals` reste par ailleurs public ou interne selon §15, alors que FR-14 dépend d’une allow-list normative. *Fix:* inclure dans le PRD une table minimale champ → propriétaire → visibilité → story, ou référencer les ancres exactes du companion et préciser explicitement la représentation des sources et de la checklist de preuve.

## Shape fit — adequate

La forme Vision + Features / Fast path annoncée dans §0 et §1 est adaptée à un site public brownfield, avec une seule personne comme auteur, des lecteurs multiples et une audience machine. Les UJ ont une fonction de conception réelle, les NFR et les risques sont adaptés à Nuxt statique/GitHub Pages, et les références brownfield sont cohérentes avec l’état décrit dans l’addendum. La rigueur n’est pas de la ceremony gratuite : le PRD évite les personas multiples sans usage, les capacités P2 et les promesses de performance. Il manque toutefois une séparation explicite entre ce qui existe déjà et ce que le lot crée, ce qui augmente le risque de retraiter l’infrastructure actuelle comme si elle était nouvelle.

### Findings

- **medium** **La frontière brownfield n’est pas visible dans les UJ et les FR** (§0, §2.3, §4, §13.1 ; addendum §4) — le PRD décrit à juste titre le blog, la page auteur et les routes SEO comme des extensions, mais UJ-1/UJ-2/UJ-3 et FR-4/FR-7/FR-10 ne distinguent pas le comportement actuel du delta attendu. Une story peut ainsi reconstruire une route existante ou considérer une cible existante comme une nouvelle capacité. *Fix:* marquer chaque UJ/FR `existing`, `changed` ou `new`, avec une baseline courte et le delta à livrer.

## Mechanical notes

Les IDs sont contigus et uniques dans le périmètre observé (`FR-1` à `FR-17`, `UJ-1` à `UJ-5`, `SM-1` à `SM-9`) et les références aux artifacts cités existent. Les problèmes mécaniques suivants sont plus locaux mais gênent la traçabilité aval.

- **medium** **UJ-5 n’a pas de protagoniste nommé** (§2.3, UJ-5) — « Une audience technique ou machine lit le corpus » est une catégorie, pas un acteur nommé avec un contexte comme les quatre autres UJ. *Fix:* nommer le rôle machine (par exemple un agent de recherche), ou déplacer cette surface dans les contraintes/contrats et la retirer du jeu des UJ.

- **low** **Dérive entre les libellés de formats du glossaire et les valeurs du contrat** (§3 ; `content-contract.md` §3) — le glossaire écrit « deep dive, tutorial, lab note, project log, opinion, comparison, case study ou reference », tandis que les valeurs canoniques sont `deep-dive`, `lab-note`, `project-log`, `case-study`, etc. Aucun mapping label → enum n’est donné. *Fix:* utiliser les clés enum dans le glossaire ou afficher explicitement « libellé public / valeur de schéma ».

- **medium** **L’index des hypothèses n’est pas un roundtrip** (§16) — seule l’hypothèse sur les parcours est marquée inline dans §2.3 ; les huit autres entrées sont listées dans l’index sans tag `[ASSUMPTION]` à l endroit où elles sont affirmées. *Fix:* taguer chaque inférence à sa source et conserver dans l’index exactement les hypothèses inline, avec un lien retour.

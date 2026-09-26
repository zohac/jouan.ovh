---
title: "Blog éditorial jouan.ovh — autorité technique et patrimoine éditorial"
status: draft
created: 2026-09-24
updated: 2026-09-25
sources:
  - ../../../specs/spec-blog-editorial/SPEC.md
  - ../../../specs/spec-blog-editorial/brownfield.md
  - ../../../specs/spec-blog-editorial/content-contract.md
  - ../../../specs/spec-blog-editorial/verification-plan.md
  - ../../../specs/spec-blog-editorial/architecture-diagrams.md
  - ../../../implementation-artifacts/investigations/blog-editorial-brief-investigation.md
  - ../../../implementation-artifacts/14-5-migration-stack-nuxt-seo-sitemap-robots-site-config.md
  - ../../../implementation-artifacts/14-6-aeo-ai-ready-llms-markdown-oai-searchbot.md
  - ../../../project-context.md
  - ../../epics.md
  - ../../../implementation-artifacts/sprint-status.yaml
  - ../../../implementation-artifacts/epic-14-checkpoint-2026-09-25.md
  - ../../sprint-change-proposal-2026-09-25.md
---

# PRD : Blog éditorial jouan.ovh — autorité technique et patrimoine éditorial

*Titre de travail — à confirmer.*

## 0. Objectif du document

Ce PRD décrit le changement de produit nécessaire pour faire du blog de `jouan.ovh` une maison numérique durable, centrée sur une autorité technique démontrable. Il s'adresse aux décideurs produit, aux agents de conception, aux équipes d'architecture et d'implémentation, ainsi qu'aux workflows BMad qui transformeront ce changement en epics, stories, conception UX et architecture. Il s'appuie sur la SPEC `docs/specs/spec-blog-editorial/SPEC.md` et sur l'investigation brownfield ; les détails d'implémentation, les recherches externes et les arbitrages non résolus sont dans `addendum.md` et les companions de la SPEC. Pour la matrice des champs et les règles de migration, `content-contract.md` est le contrat normatif ; le PRD exprime le comportement produit et ses critères de succès.

Ce PRD a été rédigé en **Fast path**, avec une entrée Vision + Features. Ce choix de méthode borne la première livraison ; il ne remplace pas les décisions de contrat ni la gate `bmad-correct-course`.

### Brownfield : baseline et delta

| Surface | Baseline existante | Delta du blog éditorial |
| --- | --- | --- |
| `/blog` | Index Content et empty-state | T0 : promesse, empty state et trois derniers articles publics ; sélections/fondamentaux en R1 |
| `/blog/<slug>` | Route article et JSON-LD | T0 : métadonnées, sources et responsive ; R1 : related et contexte projet |
| `/` | Journal des trois derniers articles | Non-régression ; la curation `featured` est une extension roadmap |
| `/about` | Profil, CV et `ProfilePage` | Derniers contenus publics et contexte auteur sans duplication |
| SEO/AEO | `usePageSeo`, Sitemap, Robots, AI Ready et CI | T0 : non-régression des propriétaires et assertions ; R1 : extensions approuvées |
| Hubs | Absents | Trois routes Vue dédiées |
| RSS | Absent | Surface conditionnelle, propriétaire statique séparé |

### Bloc de décision — statut de ce PRD

| Élément | Statut |
| --- | --- |
| Produit | Révision contrôlée de la SPEC blog éditorial, pas son remplacement silencieux |
| Première livraison | Préparation technique : contrat minimal, résolution, `/blog`, article, homepage et non-régression SEO/AEO |
| Roadmap conditionnelle | Hubs, related, auteur enrichi, projets, AEO étendue, RSS, analytics et curation `featured` |
| Gate d'autorité | Article réel + FR-18 + publication contrôlée ; une fixture ne démontre pas l'expertise |
| Alignement canonique | SPEC, companions et verification-plan sont révisés et normatifs ; D-08 reste à confirmer au checkpoint Epic 14 |
| Blocage actuel | Aucun story d'implémentation avant le checkpoint Epic 14, la confirmation D-08 et la vérification de la visibility matrix |

Les phases de ce PRD sont désormais ratifiées dans la SPEC et ses companions. Les stories restent bloquées jusqu'au checkpoint Epic 14, à la confirmation D-08 et aux gates de fixtures de visibility.

### Matrice de traçabilité canonique

| CAP | Phase | FR du PRD | Gate |
| --- | --- | --- | --- |
| CAP-1 | T0/E1 | FR-1 à FR-3, FR-18 | Contrat, checklist versionnée, article réel |
| CAP-2 | T0 | FR-4 | `/blog`, empty state, trois derniers publics, homepage |
| CAP-3 | R1 | FR-5 | Routes Vue, precedence, SEO/sitemap dédiés |
| CAP-4 | T0/R1 | FR-6 à FR-9 | Article responsive ; related filtré avant crawl en R1 |
| CAP-5 | R1 | FR-10, FR-11 | ID/destination projet autorisés, auteur canonique |
| CAP-6 | T0/E1/R1 | FR-12 | Matrice visibility × surfaces × HTTP |
| CAP-7 | T0/R1 | FR-13 à FR-15 | Owners existants ; allow-list avant R1 |
| CAP-8 | T0 | FR-9, FR-16 | Desktop/mobile, clavier, forced-colors, reduced-motion |
| CAP-9 | T0/E1/R1 | FR-17, FR-18 | Docker, fixtures, probes, rollback, rapports |

## 1. Vision

Le blog doit devenir le lieu où Simon Jouan documente ce qu'il construit, teste, mesure, échoue et apprend. Sa valeur principale n'est pas le volume de publication : c'est la constitution d'un patrimoine technique vérifiable, utile et réutilisable autour des systèmes IA, du software engineering et de l'automatisation métier.

Un visiteur doit pouvoir rencontrer plusieurs expériences cohérentes et en déduire une compétence réelle, sans que le site ait besoin de répéter une revendication d'expertise. L'article est une pièce d'un système éditorial : il est lié à son auteur, à son contexte de projet, à ses décisions, à ses limites et à d'autres contenus publics.

L'audience qualifiée et la crédibilité commerciale sont des effets recherchés, mais elles ne doivent pas devenir le filtre éditorial. Un contenu peut mériter d'exister sans potentiel commercial direct s'il apporte une expérience originale, une méthode, une mesure honnête ou une synthèse réutilisable. Le blog doit prouver avant de vendre.

### Règle de priorité éditoriale

Quand deux capacités entrent en conflit, l'arbitrage suit cet ordre : **1) preuve d'autorité technique, 2) valeur pour une audience qualifiée, 3) utilité commerciale**. Une surface SEO, AEO ou RSS ne peut pas prendre le pas sur une preuve d'expérience, une méthode réutilisable ou la lisibilité du contenu. Cette règle est un tie-breaker de produit, pas une promesse de performance.

Une **audience qualifiée** est un pair technique, un lecteur professionnel ou un décideur qui consulte le corpus pour évaluer une méthode, comprendre un système ou décider si l'auteur maîtrise réellement un sujet. Sa qualification est observée par la pertinence des lectures, les retours, les recherches et les demandes de contexte ; elle n'est pas définie par un seuil de trafic ou de contact.

## 2. Utilisateur cible

### 2.1 Jobs To Be Done

- **Comprendre une expertise** : trouver et relier des contenus qui démontrent une compétence technique réelle.
- **Résoudre un problème** : apprendre une méthode, une architecture, un outil ou un échec reproductible.
- **Évaluer une crédibilité** : relier une affirmation à une expérience, une source, un projet public et des limites explicites.
- **Publier et maintenir** : écrire un article Markdown structuré depuis Git, avec une publication et une correction comprehensibles.
- **Distribuer sans dégrader la vérité** : exposer les contenus autorisés aux lecteurs, moteurs et agents sans transformer le blog en contenu générique optimisé pour le SEO.

### 2.2 Non-utilisateurs principaux

- Les visiteurs qui veulent uniquement une actualité IA, une liste d'outils ou une réponse générique sans expérience originale.
- Les personnes qui attendent une démonstration publique de dépôts privés ou de résultats non documentés.
- Les lecteurs qui veulent un espace communautaire, une newsletter ou un moteur de recommandation algorithmique dans cette version.
- Les agents ou consommateurs qui traitent le blog comme une garantie de classement, de citation ou de conversion.

### 2.3 Parcours utilisateur

[ASSUMPTION: Les parcours sont modélisés avec des scénarios provisoires issus des besoins du brief ; ils devront être confrontés à des sessions de lecture réelles lors de la validation UX.] Les parcours sont suffisamment détaillés pour alimenter la conception et l'architecture, sans prétendre représenter des personas déjà observés.

- **UJ-1. Alex, pair technique, découvre une preuve exploitable.**
  - **Persona + contexte :** Alex est un pair technique qui cherche une expérience fiable dans un domaine lié aux systèmes.
  - **État d'entrée :** elle arrive depuis la homepage, un lien interne ou la recherche et ne connaît pas encore l'organisation du blog.
  - **Chemin :** elle voit les derniers articles, ouvre `/blog`, choisit un pilier ou un contenu fondamental, puis ouvre `/blog/<slug>`.
  - **Point culminant :** elle comprend ce qui a été construit, testé ou appris, avec auteur, date, sources et limites.
  - **Résolution :** elle suit un article lié ou un contexte projet autorisé, ou choisit un autre pilier.
  - **Cas limite :** un article lié pointe vers un contenu non public ; il ne doit pas être proposé.

- **UJ-2. Nora, prospecte technique, évalue une compétence sans brochure commerciale.**
  - **Persona + contexte :** Nora compare plusieurs contenus pour comprendre la méthode de travail de Simon.
  - **État d'entrée :** il arrive depuis un article, la homepage ou un lien externe.
  - **Chemin :** il consulte `/about`, parcourt les hubs, compare les formats et les projets publics associés.
  - **Point culminant :** il relie les expériences à une expertise cohérente et à des preuves inspectables.
  - **Résolution :** il peut continuer vers un contenu, un projet autorisé ou le contact sans conversion forcée.
  - **Cas limite :** il ne trouve pas de projet détail public ; le contexte reste textuel ou l'absence est explicite.

- **UJ-3. Sam, lectrice professionnelle, approfondit un article technique.**
  - **Persona + contexte :** Sam veut comprendre une décision, une limite ou une implémentation.
  - **État d'entrée :** il ouvre une URL stable `/blog/<slug>`.
  - **Chemin :** il lit les métadonnées, la prose, le code, les sources et le contexte projet ; il suit au plus trois suggestions.
  - **Point culminant :** il peut reproduire ou critiquer l'idée sans perdre le fil du contexte.
  - **Résolution :** il termine sur une synthèse réutilisable, une correction ou une prochaine lecture.
  - **Cas limite :** le code ou une longue taxonomie déborde sur mobile ; la page doit rester lisible.

- **UJ-4. Simon publie une mise à jour de son patrimoine technique.**
  - **Persona + contexte :** Simon auteur et mainteneur prépare une note de lab, un article de projet ou une synthèse.
  - **État d'entrée :** il écrit un Markdown dans Git avec les champs éditoriaux convenus.
  - **Chemin :** il valide le schéma, garde le contenu en draft, puis le publie ; les surfaces publiques consomment le même état résolu.
  - **Point culminant :** l'article apparaît de façon cohérente sur les listes, la route article, le sitemap, l'AEO et le flux éventuel.
  - **Résolution :** les fixtures de validation sont supprimées et l'article réel reste la source éditoriale.
  - **Cas limite :** une relation vers un article non public ou une date divergente ; la publication doit être refusée ou signalée.

- **UJ-5. Indexeur, un agent de recherche, lit le corpus.**
  - **Persona + contexte :** un agent de recherche suit une route publique autorisée et reçoit les mêmes champs publics qu'un lecteur humain.
  - **État d'entrée :** il utilise HTML, le sitemap, robots, les métadonnées structurées ou un flux futur.
  - **Chemin :** il découvre une route, lit les métadonnées cohérentes et suit les liens internes canoniques.
  - **Point culminant :** il reçoit une représentation fidèle du même article, sans donnée privée ni contenu exclu.
  - **Résolution :** il peut citer, suivre ou conserver la source sans rencontrer de propriétaires SEO concurrents.
  - **Cas limite :** une route noindex ou une route exclue du sitemap est demandée directement ; la politique preview doit être explicite.

## 3. Glossaire

- **Autorité éditoriale** — capacité démontrée par un ensemble d'expériences, de méthodes, de sources, de limites et de corrections, plutôt que par une revendication ou un volume de contenu.
- **Article** — document éditorial public ou draft, stocké en Markdown sous `content/blog/`, identifié par un slug stable.
- **Pilier** — l'un des trois domaines éditoriaux : `ai-systems`, `software-engineering` ou `automation`.
- **Format** — valeur machine (`deep-dive`, `tutorial`, `lab-note`, `project-log`, `opinion`, `comparison`, `case-study`, `reference`) et libellé français correspondant.
- **Goal** — objectif interne d'un article : SEO, authority, business ou memory.
- **Hub** — page éditoriale stable qui regroupe et met en relation les articles d'un pilier.
- **Auteur** — identité éditoriale de Simon Jouan, résolue depuis la source de profil partagée du site.
- **Contexte projet** — présentation publique d'un projet associé à un article, sans exposer de dépôt, chemin interne ou donnée privée.
- **Related** — suggestion d'article public produite à partir d'une relation explicite, du projet, du pilier, des tags et de la récence.
- **Visibility** — état de visibilité éditoriale (`public` ou `private`) distinct de l'indexabilité ; `private` interdit toute route de production.
- **Publication** — état qui autorise une entrée à être rendue dans les surfaces publiques selon la politique choisie.
- **Indexabilité** — état qui autorise une entrée à être découverte dans le sitemap, l'AEO, les liens de distribution et les métadonnées de recherche selon la politique choisie.
- **Preview** — environnement ou comportement qui permet de relire un contenu non public sans le publier dans les surfaces de production.
- **Fixture** — contenu synthétique temporaire servant à valider un contrat, puis supprimé avant livraison.
- **Canonical** — URL officielle d'une page, utilisée de façon cohérente par les liens, le SEO, le sitemap et les exports.
- **AEO** — couche de lisibilité machine qui expose les contenus publics via HTML, Markdown, `llms.txt`, `llms-full.txt` et `sitemap.md` sans garantir un classement ou une citation.
- **RSS** — flux de distribution autonome et statique, s'il est confirmé, qui ne contient que les articles publics autorisés.
- **Génération statique** — production de HTML et d'artefacts publics au build, compatible avec GitHub Pages et sans dépendance serveur à l'exécution.

## 4. Fonctionnalités

### 4.1 Contrat éditorial et qualité de preuve

**Description :** Simon peut publier un article structuré, validé et rattaché à une expérience réelle. Le système distingue le contenu original d'une synthèse générique et rend visibles les preuves, limites, sources et corrections. Cette capacité vise UJ-1, UJ-3 et UJ-4 ; elle sera confrontée à des lectures réelles.

#### FR-1 : Article structuré

Simon peut créer un article Markdown avec un titre, une description, une date de publication, un auteur, exactement un pilier, un format, des tags et un état de publication validés. Le champ `goals` est optionnel et interne dans la première release ; il ne devient pas un critère de publication.

**Conséquences vérifiables :**

- Une fixture conforme est acceptée par le contrat éditorial.
- Les valeurs machine de `format` sont celles de `content-contract.md` ; les libellés français ne créent pas de seconde enum.
- Une valeur d'enum invalide échoue avec une erreur compréhensible.
- Un article en état draft ne devient pas public implicitement.
- Le format reste indépendant du pilier.
- Dans la première release, le titre est unique dans le corpus public ; la règle d'unicité par hub s'applique à l'ouverture de la roadmap.

#### FR-2 : Admission fondée sur l'expérience

Simon peut documenter un problème, un contexte, une méthode, une observation, un résultat et des limites sans que le potentiel commercial direct soit une condition de publication.

**Conséquences vérifiables :**

- Une checklist éditoriale distingue les éléments prouvés, incertains, privés ou non mesurés.
- Le contenu générique sans expérience originale n'est pas traité comme une preuve d'expertise.
- Les alternatives considérées, la méthode, les limites et la réutilisabilité sont identifiées lorsque l'article prétend démontrer une compétence.
- Les affirmations sensibles citent une source primaire ou expliquent explicitement pourquoi aucune source publique n'est disponible.
- Les versions, environnements, licences et attributions nécessaires à la reproduction sont indiqués dans le corps Markdown ou la documentation associée.
- Les liens externes, images distantes, HTML brut et extraits de code suivent une politique de confiance et d'attribution documentée.
- Les métriques, dates et résultats absents ne sont pas complétés par invention.

#### FR-3 : Corrections et mise à jour

Simon peut signaler une correction ou une évolution substantielle sans modifier artificiellement la fraîcheur d'un article.

**Conséquences vérifiables :**

- Une date de mise à jour est conservée uniquement pour une évolution éditoriale réelle.
- La date de publication originale reste immuable ; une correction substantielle ajoute une note de correction traçable dans Git.
- Un slug publié reste stable dans la première release ; tout renommage ultérieur exige une décision de redirection.
- Le corpus reste stable, corrigeable, relié et historiquement intelligible.
- Le lecteur peut distinguer la date de publication de la date de mise à jour lorsque les deux existent.
- Les corrections importantes sont visibles dans le parcours de lecture.

### Cycle de correction

| Type | Date `updated` | Révision FR-18 | Traitement |
| --- | --- | --- | --- |
| Mineure | Non modifiée si aucune affirmation ne change | Non | Commit et note si nécessaire |
| Substantielle | Mise à jour obligatoire | Oui | Nouvelle version de la checklist et publication validée |
| Rétractation ou erreur factuelle | Date conservée, statut visible | Oui | Note publique, retrait ou 404/410 selon le runbook |
| Renommage de slug | Nouvelle route uniquement après décision | Oui | Redirection, mise à jour sitemap/AEO et test de liens |

Le rollback éditorial et le takedown de confidentialité sont deux procédures distinctes ; une correction ordinaire ne vaut pas autorisation de traiter une fuite de données.

### 4.2 Découverte éditoriale et hubs

**Description :** un visiteur peut comprendre la promesse du blog, commencer par des contenus fondamentaux, puis explorer les trois piliers. Cette capacité vise UJ-1 et UJ-2 ; les parcours restent des hypothèses jusqu'à validation.

#### FR-4 : Homepage éditoriale

Un visiteur peut accéder à une homepage `/blog` qui présente la promesse éditoriale et les trois derniers articles publics, triés par date de publication décroissante. Les sections « contenu fondamental », « sélection par pilier » et « curation `featured` » sont différées jusqu'à la roadmap tant que leur source de vérité n'est pas définie.

**Conséquences vérifiables :**

- `/blog` reste indexable et fonctionne avec un corpus vide grâce à un état vide explicite.
- Les brouillons, articles programmés et entrées non publiques ne sont pas listés.
- Chaque lien interne décrit le contenu et son pilier.
- La page n'affiche pas plus de trois articles dans la section « derniers articles » et ne duplique pas une carte d'article ailleurs sur la même page.

#### FR-5 : Hubs de pilier — extension phase 2

Un visiteur peut ouvrir `/blog/ia`, `/blog/engineering` et `/blog/automatisation` pour comprendre une expertise et poursuivre un parcours de lecture. Cette capacité n'est pas une gate de la première release ; elle exige une route Vue dédiée et son contrat de découverte.

**Conséquences vérifiables :**

- Chaque hub possède un titre, une introduction, des recommandations, des contenus récents, des contextes projet publics et des liens vers les autres piliers.
- Les hubs ne sont pas traités comme des articles par le catch-all.
- Les slugs `ia`, `engineering` et `automatisation` sont réservés aux hubs ou font l'objet d'une décision explicite.
- Chaque hub possède une route HTML, une entrée sitemap et un SEO propres, même lorsque le scan Content ne le voit pas.
- Un hub reste valide même lorsque son corpus est vide.

#### FR-6 : Traçabilité de la découverte

Un visiteur peut relier un contenu à son auteur et à son pilier dès la première livraison. Le contexte projet et les articles liés sont des extensions de roadmap.

**Conséquences vérifiables :**

- Les liens internes utilisent des ancres et libellés compréhensibles.
- Une relation invalide n'est pas rendue comme une route publique.
- Le blog est accessible depuis la homepage et le footer existants, sans créer de second propriétaire de navigation ; l'entrée principale du header est différée.

### 4.3 Expérience de lecture et navigation

**Description :** un lecteur peut comprendre un article, lire la prose et le code, puis poursuivre vers un contexte utile. Cette capacité vise UJ-3 ; les parcours restent des hypothèses jusqu'à validation.

#### FR-7 : Métadonnées et structure de l'article

Un lecteur voit le titre, la description, l'auteur, les dates, le pilier, le format et les sources. En R1, il peut également voir un contexte projet autorisé.

**Conséquences vérifiables :**

- Les dates HTML correspondent au contrat de publication.
- Les sources sont des sections ou liens du corps Markdown, pas un champ secret ajouté implicitement au frontmatter.
- L'auteur provient de la source partagée, pas d'un nom libre dupliqué.
- La hiérarchie `h1` → `h2` → `h3` est cohérente.

#### FR-8 : Articles liés (`related`) contextualisés — extension phase 2

Un lecteur peut consulter jusqu'à trois articles liés qui existent, sont publics et sont pertinents selon l'ordre défini : relation explicite, projet, pilier, tags et récence. Cette capacité n'est pas une gate de la première release ; le résolveur de liens doit filtrer les relations avant tout rendu ou crawl du générateur.

**Conséquences vérifiables :**

- L'article courant n'est jamais lié à lui-même.
- Un brouillon, un article programmé, un article public marqué `noindex` mais non autorisé à être découvert, ou un slug absent n'est pas proposé.
- La relation ne déclenche pas de crawl vers une route non voulue.

#### FR-9 : Lecture longue et code

Un lecteur peut lire une prose, un bloc de code, une image et une taxonomie longue sur desktop et mobile sans overflow horizontal ni perte de contraste.

**Conséquences vérifiables :**

- Le code conserve une zone de défilement contrôlée et un contraste lisible.
- Les images ont des dimensions et un texte alternatif approprié.
- Le parcours respecte le mouvement réduit et les modes de contraste du site.

### 4.4 Auteur, projets et contexte public

**Description :** les relations éditoriales utilisent l'identité et les données partagées du site, sans devenir une seconde base de données. Cette capacité vise UJ-2 et UJ-4 ; les relations projet et la page auteur enrichie sont conditionnelles.

#### FR-10 : Page auteur enrichie — extension phase 2

Un visiteur peut consulter la page auteur canonique, y compris le parcours, les expertises, les projets publics et les derniers contenus autorisés. La page existante reste non régressive ; l'enrichissement est conditionnel à une décision d'information architecture.

**Conséquences vérifiables :**

- Une seule page auteur est canonique.
- Les derniers articles respectent le contrat de publication.
- Les liens sociaux ou GitHub ne sont rendus que si les URLs sont réelles et confirmées.

#### FR-11 : Relation article-projet — extension conditionnelle phase 2

Simon peut rattacher un article à un projet public stable et présenter un contexte bidirectionnel sans exposer de dépôt privé ou de chemin interne. Cette capacité reste désactivée dans la première release tant que la destination et l'ID public ne sont pas confirmés.

**Conséquences vérifiables :**

- Le projet est résolu par un identifiant stable, jamais par une correspondance de nom humain.
- La destination du lien projet est autorisée et accessible publiquement.
- Les articles liés au projet sont triés par date et ne sont publics que selon la politique choisie.

### 4.5 Publication, SEO, AEO et distribution

**Description :** une publication réelle est projetée de façon cohérente vers les pages, la découverte, les métadonnées et les artefacts machine, sans double propriétaire ni fuite de contenu. Cette capacité vise UJ-1, UJ-4 et UJ-5 ; elle réutilise d'abord les propriétaires SEO/AEO existants.

#### FR-12 : États de visibilité

Le système distingue publication, indexabilité, prévisualisation, `noindex`, `robots: false`, exclusion du sitemap, visibilité privée et contenu futur dans toutes les surfaces publiques. La matrice §6.3 est le contrat visibility de la première release.

**Conséquences vérifiables :**

- Les fixtures couvrent chaque état et produisent un résultat documenté pour HTML, listes, Markdown, sitemap, AEO, RSS éventuel et accès direct.
- `visibility: private` est séparé de `sitemap: false/null` et ne peut pas être déduit d'un simple champ d'indexabilité.
- La règle de précédence de la matrice est déterministe ; aucune surface ne choisit un état différent.
- Le comportement direct d'une URL exclue est défini avant livraison.

#### FR-13 : SEO et données structurées

Un article public produit une URL canonique auto-référente, un `BlogPosting` cohérent, les métadonnées Open Graph/Twitter existantes et les artefacts sitemap/`robots.txt` attendus.

**Conséquences vérifiables :**

- Les champs `datePublished`, `dateModified`, auteur et image, ainsi que l'URL canonique, correspondent aux métadonnées résolues.
- Le `ProfilePage` de la page auteur reste présent et cohérent avec l'URL canonique choisie.
- Le sitemap ne contient ni doublon ni route non indexable.
- Aucun second module SEO, sitemap ou robots ne concurrence les propriétaires existants.

#### FR-14 : AEO sans promesse d'autorité — non-régression phase 1, extension phase 2

Un contenu public peut être exposé dans les représentations Markdown et AEO prévues, avec les champs explicitement publics. La première release vérifie la non-régression des sorties existantes ; toute nouvelle projection de champ est une extension phase 2.

**Conséquences vérifiables :**

- Les exports ne contiennent ni secret, ni donnée de formulaire, ni article privé.
- Les champs non publics ne sont pas ajoutés automatiquement aux exports.
- La matrice `champ → propriétaire → sortie autorisée → assertion CI` de `content-contract.md` et `verification-plan.md` est normative.
- Le PRD et le contenu ne promettent ni classement, ni citation IA, ni trafic.

#### FR-15 : RSS conditionnel — hors première release

Si RSS est confirmé, un flux statique peut diffuser les articles publics avec un propriétaire unique et une découverte depuis le blog. RSS est hors première release et ne doit pas être ajouté au backlog sans décision explicite.

**Conséquences vérifiables :**

- Le flux respecte le même contrat de publication et d'indexabilité.
- Le chemin, le MIME, les champs item et la limite sont documentés.
- Le flux n'est pas un remplacement du sitemap, du canonical ou de l'AEO.

### 4.6 Expérience site-compatible et accessibilité

**Description :** le blog réutilise l'identité visuelle et les conventions d'accessibilité du site sans créer une seconde direction artistique. Cette capacité vise UJ-1 et UJ-3 ; le parcours sera vérifié par une revue visuelle comparative.

#### FR-16 : Composition avec le design system

Les nouvelles surfaces utilisent les tokens CSS, composants UI, layout et composants de liens déjà présents, plutôt que des valeurs de style arbitraires.

**Conséquences vérifiables :**

- Les contrôles navigateur couvrent desktop 1280px et mobile 375px, fil d'Ariane, lien de retour, liens externes accessibles, images, thèmes, contraste forcé et appel à l'action sans contenu privé.
- La direction terminale, la typographie et le comportement des thèmes sont cohérents avec le site.
- Aucun composant de librairie externe n'est nécessaire pour la première release.
- Les liens externes utilisent `ZExternalLink` avec `rel="noopener"` et libellé accessible ; les focus visibles utilisent le repli `outline` standard.
- Les listes de cartes, étapes et related utilisent des éléments sémantiques ; le code conserve un défilement local et aucune page ne déborde horizontalement.

### 4.7 Validation et exploitation

**Description :** l'équipe peut valider le produit de manière reproductible sans transformer les fixtures en contenu public. Cette capacité vise UJ-4 et UJ-5 ; elle ne vaut pas preuve d'une audience ni d'un article réel.

#### FR-17 : Fixtures et gate statique

L'équipe peut valider le contrat éditorial minimal, les exclusions, `/blog`, l'article, la homepage et les artefacts existants avec des fixtures temporaires et la gate Docker. Les hubs, relations et capacités R1 ont leurs propres gates.

**Conséquences vérifiables :**

- La commande Docker exacte est `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` et termine avec le code `0`.
- Les fixtures de la première release couvrent au minimum publication, article imbriqué, brouillon, date future, noindex, robots false et exclusion sitemap ; la matrice étendue ajoute related, projet et hub lorsqu'ils sont ouverts.
- Une fixture peut exister uniquement dans le checkout local, le build QA ou la CI temporaire ; elle n'est jamais versionnée dans la branche de production ni déployée, et sa suppression est vérifiée par un diff et une recherche de slugs.
- Les HTML T0 des pages `/`, `/blog` et article, les jumeaux Markdown concernés, `sitemap.xml`, `robots.txt`, `CNAME` et `_headers` sont inspectés ; les HTML R1 sont vérifiés dans leurs gates dédiées.
- Les fixtures sont supprimées après la validation.
- Les résultats statiques, navigateur et production sont consignés.
- Le build/local bundle est bloquant pour la story ; le bundle navigateur est bloquant avant merge ; le bundle production est obligatoire avant clôture de release mais reste manuel après déploiement.

Le plan de vérification `docs/specs/spec-blog-editorial/verification-plan.md` est la checklist de référence. Pour T0, sa matrice T0 est obligatoire ; E1 et R1 sont exécutées uniquement après leurs gates de préconditions.

**Hors périmètre :** création d'un framework de test dédié pour ce seul lot.

#### FR-18 : Gate éditoriale de preuve

Avant toute publication réelle, Simon peut soumettre l'article à une checklist de preuve couvrant le problème, le contexte, la méthode, les alternatives, les résultats, les limites, les sources et les données privées potentiellement exclues.

**Conséquences vérifiables :**

- Un article sans preuve suffisante reste en préparation technique et ne devient pas une publication de démonstration.
- La checklist et la décision de publication sont consignées dans `docs/implementation-artifacts/editorial-reviews/<slug>.md`, avec le slug, le hash du contenu, la version de checklist, la date et l'approbateur.
- La checklist ne devient pas un contenu public automatique et ne remplace pas l'article.

### Formulaire normatif de preuve

| Champ | Résultat attendu |
| --- | --- |
| `slug` et version | Slug stable, commit ou hash du contenu |
| Problème et contexte | Problème réel, contraintes et non-objectifs |
| Base de première main | Ce que Simon a construit, testé, observé ou mesuré |
| Méthode et alternatives | Étapes, outils, versions, environnement et alternatives écartées |
| Preuves | Sources, résultats, limites, échecs et reproductibilité |
| Confiance et confidentialité | Données privées exclues, licences et attributions vérifiées |
| Limites et inconnu | Éléments non mesurés ou non vérifiables explicitement reconnus |
| Décision | `pass`, `rework` ou `reject`, motif, date et approbateur Simon |

Une modification de `date`, du hash, des sources ou des limites invalide le `pass` et exige une nouvelle revue. Le formulaire est versionné dans `docs/implementation-artifacts/editorial-reviews/<slug>.md`; son emplacement et sa politique de conservation sont à confirmer dans le premier story de publication.

### Compatibilité de migration

Une évolution du contrat de contenu ne devient exécutable qu'après inventaire de tous ses consommateurs : schéma Content, pages, homepage, résolveur, `usePageSeo`, AEO, fixtures CI et scripts de build. Le choix entre lecture temporaire de l'ancien ou du nouveau champ et migration atomique sera tranché dans la SPEC et le journal de décision ; aucune story de schéma ne commence avant cette ratification et aucune valeur divergente n'est résolue silencieusement.

## 5. Exigences non fonctionnelles transverses

- **NFR-1 :** Le produit reste compatible avec Nuxt 4, `@nuxt/content` v3, la génération statique et GitHub Pages.
- **NFR-2 :** Aucun contenu public ne dépend d'un serveur à l'exécution, d'une base de données ou d'un CMS externe.
- **NFR-3 :** Les commandes de développement et de validation passent par Docker ; aucun gestionnaire de paquets n'est lancé sur l'hôte.
- **NFR-4 :** Les propriétaires existants de canonical, JSON-LD, sitemap, robots et AEO restent uniques.
- **NFR-5 :** La date de publication est résolue de manière déterministe ; les valeurs divergentes ne sont jamais choisies silencieusement.
- **NFR-6 :** Le contenu et l'interface restent en français, avec vouvoiement, première personne pour Simon et aucun emoji.
- **NFR-7 :** La hiérarchie des titres, le focus clavier, le contraste forcé et la réduction de mouvement sont respectés.
- **NFR-8 :** Les contenus privés, brouillons, URLs de dépôts et chemins internes ne sont pas exposés dans les relations ou artefacts publics.
- **NFR-9 :** Le blog ne dégrade pas la homepage, les routes existantes, le déploiement `gh-pages`, le `CNAME` ou les budgets AEO.
- **NFR-10 :** Les performances statiques et le budget de génération restent compatibles avec le site actuel ; aucune dépendance lourde n'est ajoutée sans justification.
- **NFR-11 :** L'analytics existante reste non régressive et respecte le consentement, la minimisation et la vie privée ; aucun nouvel événement n'est requis pour T0.
- **NFR-12 :** Les corrections, rollbacks et décisions de publication sont traçables dans le Dev Agent Record.
- **NFR-13 :** La chaîne d'approvisionnement éditoriale interdit les scripts et trackers non approuvés, les images distantes non contrôlées, les URLs avec paramètres de suivi et toute ressource susceptible de révéler une donnée privée ; les licences, sources et secrets sont vérifiés avant publication.
- **NFR-14 :** La première release n'ajoute aucun événement, propriété ou paramètre analytics ; les propriétés existantes restent soumises au consentement, à la minimisation et à une liste d'autorisation documentée.
- **NFR-15 :** Aucun article réel n'est promu en production avant validation de l'artefact statique et des contrôles de non-régression ; la première publication suit un protocole de déploiement contrôlé et un probe post-déploiement.

## 6. Contraintes et garde-fous

### 6.1 Garde-fous éditoriaux

- Pas de contenu généré automatiquement comme article final.
- Pas de métrique, date, relation ou retour d'expérience inventé.
- Pas de publication d'un article privé ou d'une fixture de démonstration.
- Les limites, échecs, incertitudes et corrections font partie de la preuve.
- Les preuves et limites sont présentées avant tout appel à l'action commercial ; un goal `business` ne modifie ni la publication, ni le classement des articles liés, ni la mise en avant d'un lien.
- Un article ne peut être publié comme preuve d'expertise sans revue éditoriale de son problème, de sa méthode, de ses sources, de ses résultats et de ses limites.

### 6.2 Garde-fous SEO et distribution

- Le SEO décrit le contenu ; il ne décide pas si le contenu mérite d'exister.
- `llms.txt`, Markdown, AEO et RSS ne sont pas des moteurs d'autorité ni des promesses de classement.
- Les URLs et le domaine sont résolus depuis la source Site Config, jamais codés en dur.

### 6.3 Décisions de cadrage par défaut

Le PRD adopte les décisions de phase suivantes pour éviter que les workflows aval inventent des contrats. Les gates de la section 15 sont des confirmations opérationnelles, pas des alternatives cachées à ces décisions.

| Décision | Default PRD | Statut | Gate de ratification |
| --- | --- | --- | --- |
| Date | `date` seul dans la première release ; `publishedAt` n'est pas accepté | Ratifié T0 | Story schéma bloquée jusqu'à migration ratifiée |
| Auteur | `/about` canonique | Ratifié T0/R1 | Story auteur bloquée avant checkpoint |
| Projet | ID stable + contexte/ancre, pas de page détail | À confirmer R1 | Relation projet bloquée avant R-03 |
| Related | Relation explicite invalide = échec ; relation déduite = omission | Ratifié R1 | Story related bloquée avant gate R1 |
| Preview | `visibility: private` séparé ; draft/future = 404 ; noindex/robots restent publics non découverts | Ratifié T0 | Stories visibility bloquées jusqu'aux fixtures correspondantes |
| Canonical | Self-canonical par défaut | Ratifié T0, probe requis | `bmad-correct-course` avant SEO/AEO |
| RSS | Hors T0 ; propriétaire statique séparé | Reporté R1 | Décision explicite avant toute story RSS |

- Pour la première release, `date` est l'unique champ de date de publication au format `YYYY-MM-DD` ; `publishedAt` n'est pas accepté. Une évolution ultérieure devra définir une migration atomique ou un alias versionné, sans lecture ambiguë.
- `/about` reste l'URL auteur canonique ; `/a-propos` ne peut être qu'un alias contrôlé si le besoin est confirmé.
- Le canonical est self-referencing par défaut ; un override explicite doit être approuvé et ne crée pas de second head.
- Les relations projet utilisent des IDs publics stables ; aucune page détail projet n'est incluse dans le premier slice.
- Une relation `related` explicite invalide échoue la validation ; une relation déduite sans cible valide est omise avec un avertissement.
- En production, `draft: true`, une date future ou `visibility: private` n'ont pas de route publique ; `noindex: true`, `robots: false` et `sitemap: false/null` restent des états publics à accès direct tant qu'ils ne sont pas transformés en `visibility: private`. `sitemap: false/null` exclut le sitemap, l'AEO et le RSS mais ne retire pas automatiquement le HTML ni les liens éditoriaux internes.
- Les hubs exposent les projets publics associés sous forme de contexte ou d'ancre autorisée ; aucune page détail projet n'est requise dans le premier slice.
- Les `goals` restent internes à la première release et ne modifient ni la publication, ni le classement des liens, ni la visibilité d'un appel à l'action.
- Les champs `featured`, `evergreen`, `read`, `series` et `archived` ne deviennent pas automatiquement publics ; leur visibilité est définie par la matrice de `content-contract.md`.
- Les overrides SEO ne modifient que le head existant et ne dupliquent pas `usePageSeo`.
- Pour la première release, les routes réutilisent `usePageSeo()` et `useSiteUrl()` sans nouveau nested SEO override, alias `/a-propos` ni nouvelle politique trailing-slash. Si le comportement actuel de production diverge, le sujet est renvoyé à `bmad-correct-course` avant toute story SEO.

### Hypothèses de cadrage

- [ASSUMPTION: Les lecteurs principaux sont des pairs techniques et des décideurs qui évaluent une compétence réelle.]
- [ASSUMPTION: La valeur éditoriale repose sur une expérience de première main, des sources et des limites explicites.]
- [ASSUMPTION: Aucun chiffre de trafic, de classement ou de conversion ne doit être inventé.]
- [ASSUMPTION: `SITE.profile` reste la source auteur et `SITE.projects` la source projet.]
- [ASSUMPTION: Les hubs Vue et les routes article doivent rester des namespaces distincts.]
- [ASSUMPTION: L'Epic 14 doit être stabilisé avant les changements structurels du blog.]
- [ASSUMPTION: Les fixtures sont synthétiques, temporaires et supprimées après validation.]
- [ASSUMPTION: Le blog reste une source de vérité Markdown et ne reçoit pas de CMS externe.]

### Matrice de visibilité proposée pour la première release

| État | HTML production | Listes et homepage | Sitemap / AEO | RSS | Accès direct |
| --- | --- | --- | --- | --- | --- |
| `draft: true` | absent | absent | absent | absent | 404 ; preview séparé |
| date future | absent | absent | absent | absent | 404 ; preview séparé |
| `visibility: private` | absent | absent | absent | absent | 404 ; preview séparé |
| publié + `noindex: true` | présent avec balise `noindex` | absent des sélections | absent | absent | 200 |
| publié + `robots: false` | présent avec directive robots conforme | absent des sélections | absent | absent | 200 |
| publié + `sitemap: false/null` | présent | présent, sauf si une autre règle l'exclut | absent | absent | 200 |
| publié + indexable | présent | présent | présent | absent tant que RSS n'est pas approuvé | 200 |

La priorité de résolution est `draft`/future/`private` → exclusion de production ; puis `noindex`/`robots: false` → absence des sélections et artefacts de découverte ; puis `sitemap: false/null` → absence du sitemap/AEO/RSS sans supprimer le HTML. Le champ `visibility` est le contrat ratified pour séparer confidentialité et indexabilité ; il est présent dans `content-contract.md` avant toute story de visibility.

### 6.4 Pourquoi maintenant

Le blog de base, les routes Content, le DS, le SEO et la gate CI existent déjà, mais le corpus public est vide et l'Epic 14 partage encore des surfaces SEO/AEO en évolution. C'est le moment de définir une infrastructure éditoriale durable avant de publier davantage, plutôt que d'ajouter une taxonomie page par page.

## 7. Identité, ton et forme

Le blog doit rester une expérience technique sobre et réutiliser exactement le design system et l'état de thèmes à ratifier au checkpoint Epic 14 ; il ne déclenche ni migration clair/sombre ni nouveau thème. La documentation de planning qui diverge sur ce point sera réconciliée avant la revue UX. L'esthétique reste terminale, avec une typographie Ubuntu / Ubuntu Mono. La voix est celle de Simon : première personne, précise, humble sur les limites et exigeante sur la preuve. Le contenu ne doit pas ressembler à une brochure, même lorsque le sujet est commercial.

## 8. Architecture de l'information et plateforme

- **Plateforme :** site web statique, responsive desktop/mobile, GitHub Pages.
- **Entrées :** homepage, `/blog`, trois hubs, article, page auteur et surfaces de distribution conditionnelles.
- **Source éditoriale :** Markdown sous `content/blog/`.
- **Navigation :** liens internes contextualisés, hubs, auteur, projet autorisé et flux éventuel.
- **Dépendances :** Content, Site Config, Design System, modules SEO existants, AI Ready et CI.
- **Hors plateforme :** aucun CMS, compte utilisateur, commentaire, newsletter ou service tiers de recherche dans T0.

## 9. Risques et mitigations

| Risque | Trigger / propriétaire | Impact | Mitigation et preuve attendue |
| --- | --- | --- | --- |
| Trop de fonctionnalités avant contenu réel | Décision de planning / responsable produit | Complexité et publication retardée | Première release limitée au parcours lecture ; décision `bmad-correct-course` enregistrée |
| SEO/AEO pilotent une production générique | Revue éditoriale / Simon | Perte d'autorité et contenu interchangeable | Checklist de preuve, sources, limites et absence de promesse de classement |
| Fuite de draft ou relation invalide | Résolver / équipe technique | Perte de confiance et routes non voulues | Matrice de visibilité, fixtures d'exclusion et assertions avant rendu |
| Relation projet fragile | Données / responsable technique | Liens cassés ou données privées | IDs publics stables, destination autorisée et takedown documenté |
| Collision hubs/articles | Architecture / équipe technique | Perte de SEO et navigation incohérente | Routes Vue dédiées, slugs réservés et assertions de priorité de route |
| Modification pendant Epic 14 | Release / responsable technique | Régression difficile à attribuer | Checkpoint Epic 14, diff isolé et bundle de non-régression |
| Canonical/trailing-slash incohérent | SEO / responsable technique | Redirections et signaux contradictoires | Source Site Config unique et probes HTTP après déploiement |
| Correction ou publication mal maîtrisée | Éditorial / Simon | Perte de confiance | Date originale immuable, note de correction, slug stable et rollback Git |

## 10. Lancement et changement

1. Stabiliser Epic 14 et clarifier les propriétaires SEO/AEO.
2. Faire arbitrer par `bmad-correct-course` le périmètre de la première release et les capacités roadmap.
3. Valider la SPEC, le PRD et le contrat de contenu, notamment date, auteur, visibility matrix et canonical de la première release.
4. Établir les fixtures de référence, le checklist de preuve et le plan de revue visuelle/a11y.
5. Livrer la préparation technique : contrat minimal, résolution, `/blog`, route article et non-régression homepage/SEO/AEO.
6. Sélectionner un article réel et le soumettre à la revue de preuve ; ne pas publier de contenu générique pour satisfaire une gate.
7. Si l'article passe la revue, publier et vérifier le parcours de bout en bout ; sinon conserver la publication éditoriale en attente et documenter la raison.
8. Mesurer les signaux qualitatifs de découverte, d'usage et d'autorité sans fixer de cible inventée.
9. Ouvrir les slices roadmap seulement après retour d'usage et décision de planning.

### 10.1 Retour arrière éditorial

- Le déclencheur est une régression de contenu, de route, de canonical, de date ou de distribution qui ne concerne pas un secret ou une donnée personnelle.
- Le dernier commit et le dernier artefact statique validés sont identifiés avant promotion ; le retour arrière régénère l'artefact, le déploie et rejoue les probes HTML, Markdown, sitemap, robots et AEO.
- Une fixture n'est jamais publiée en production et ne constitue jamais le dernier état de référence.
- Une migration de schéma conserve un chemin de retour documenté et ne renomme pas un champ consommateur sans validation de compatibilité.
- Le responsable de la release consigne le commit, l'impact, l'action, les probes et la décision de clôture.

### 10.2 Retrait de confidentialité et de sécurité

- Un secret, une donnée personnelle, une dépendance compromise ou un contenu non autorisé déclenche l'arrêt de la promotion, la classification de l'incident et la notification du responsable.
- Les secrets exposés sont révoqués et renouvelés ; les artefacts générés, caches contrôlés, sorties AEO et URLs de distribution sont purgés ou explicitement listés comme non contrôlables.
- Une demande de retrait est adressée aux surfaces tierces qui le permettent ; la route publique passe en 404 ou 410 selon le runbook, avec preuve HTTP.
- Le nettoyage de l'historique Git, des anciens déploiements et des caches externes est un risque résiduel documenté ; il ne doit pas être déclaré résolu par un simple retour arrière.
- Le responsable de l'incident, la date, l'impact, les nettoyages effectués, les limites et la vérification sont consignés dans le journal de story.

### 10.3 Promotion contrôlée

- Aucun article réel n'est promu tant que le build, les assertions statiques, la revue navigateur/a11y et le bundle de promotion ne sont pas verts.
- La première publication suit un déploiement contrôlé ou canari ; un probe post-déploiement obligatoire confirme le statut HTTP, le canonical, le sitemap, robots et les artefacts Markdown/AEO avant clôture.
- Un échec de probe déclenche le retour arrière ou le takedown approprié, au choix de la procédure concernée.

## 11. Gouvernance des données et de la vie privée

- Les articles publiés sont publics et documentés dans Git.
- Les brouillons, fixtures, dépôts privés, données clients et informations de formulaire ne sont pas exportés.
- Les relations projet ne divulguent que des informations publiques et confirmées.
- Les analytics sont conditionnés au consentement existant et ne doivent pas transformer le blog en base de données comportementale.
- La première release n'ajoute aucun événement, propriété, paramètre d'URL ou intégration tierce ; les propriétés existantes sont inventoriées, minimisées et testées pour leur consentement avant toute release.
- Les retours ou recherches qui pourraient contenir des données personnelles sont traités comme des retours non structurés, avec minimisation et suppression selon la politique existante.
- Les changements de statut et corrections sont documentés dans le journal de story.

## 12. Non-goals explicites

- CMS externe, headless CMS, base de données éditoriale, compte utilisateur, commentaires ou newsletter.
- Génération automatique d'articles, contenu fictif, métriques inventées ou fixtures publiées.
- Recherche sémantique, indexation vectorielle, recommandation IA ou moteur de recherche externe.
- Refonte globale du DS, changement de thème, nouvelle librairie UI ou nouveau langage.
- Recherche textuelle, Mermaid rendu, bouton de copie, temps de lecture calculé, pages de tags, UI de séries, archive ou autre P2 sans réouverture explicite ; un champ `series` peut rester uniquement dans le schéma et l'événement analytics de copie existant ne justifie pas de bouton.
- Pages projet détaillées ou collections auteurs/projets autonomes sans décision produit séparée.
- Double propriétaire de canonical, JSON-LD, sitemap, robots ou AEO.
- Promesse de classement, trafic, citation IA ou conversion.

## 13. Périmètre de première release et roadmap

La première release ne doit pas chercher à installer toute la plateforme éditoriale. Elle établit la boucle minimale qui permet de publier, lire, préserver et vérifier une expérience réelle. Les capacités conditionnelles restent dans la roadmap du blog, mais ne bloquent pas cette première boucle.

### 13.1 Première release — boucle d'autorité vérifiable

- Contrat de contenu typé pour les champs nécessaires à une publication : titre, description, date, auteur, pilier, format, tags et état de publication ; `goals` reste facultatif et interne.
- Résolution déterministe d'un article public ou exclu, avec matrice de visibilité documentée.
- `/blog` éditorial et une route article responsive.
- Homepage existante sans régression, avec liens vers le contenu public.
- Réutilisation non régressive des propriétaires SEO/AEO existants, sans nouvelle projection de champ ni nouvel événement analytics.
- Checklist de preuve, provenance et correction pour le contenu réel (FR-18).
- Fixtures temporaires, gate Docker, revue visuelle/a11y desktop et mobile.
- Aucun article fictif, aucune métrique inventée et aucune publication de fixture.

La première release peut valider la **préparation technique** avec une fixture publiée temporaire. La validation de l'autorité exige ensuite un article réel nommé, relu et conforme à la checklist de preuve. Si aucun article ne passe cette revue, la préparation technique reste livrable, mais le lancement éditorial reste explicitement en attente.

Les états vides et invalides ne doivent pas produire de lien trompeur : `/blog` et les futurs hubs affichent un état vide ; un article sans image utilise le traitement éditorial convenu ; une relation absente ou non autorisée est omise ; une relation explicite invalide est refusée par la gate.

### 13.2 Roadmap conditionnel — après validation de la première release

- Hubs Vue dédiés `/blog/ia`, `/blog/engineering` et `/blog/automatisation`, avec contrat de route, SEO, sitemap et priorité de route.
- Related déterministe, filtré avant rendu et limité à trois suggestions publiques.
- Enrichissement de `/about` et relations article-projet sur IDs publics stables.
- AEO étendu avec allow-list de champs et assertions de propriété par sortie.
- RSS statique avec propriétaire, path, MIME, discovery et champs item approuvés.
- Champs optionnels supplémentaire, curation `featured` de la homepage, navigation principale et nouveaux événements analytics.
- Toute nouvelle taxonomie ou page détail projet nécessite une décision de produit distincte.

Ces capacités sont des objectifs de roadmap, pas des dépendances cachées de la première release. Elles ne doivent pas être ajoutées aux stories tant que `bmad-correct-course` n'a pas arbitré leur sequencing, leur propriétaire et leur définition de terminé.

### 13.3 Out of Scope

- CMS, newsletter, commentaires et espace membre.
- Recherche textuelle et recommandation IA.
- Pages tags, séries, archive et rendu Mermaid.
- Pages projet détaillées sans approbation explicite.
- Refonte du site ou changement de design system.
- Garantie de SEO, AEO, RSS ou analytics.
- Nouveaux événements analytics ou changement du contrat de télémétrie sans revue de vie privée.

## 14. Métriques de succès

Les métriques sont volontairement décrites comme des preuves et des diagnostics. Aucune cible chiffrée n'est inventée ; les baselines seront établies après publication. Les nombres structurels du produit — trois piliers, au plus trois suggestions related — sont des règles de conception et ne constituent pas des promesses de performance.

**Gate T0 — préparation technique :** contrat minimal, résolution, `/blog`, route article, homepage, SEO/AEO existants, fixtures temporaires et contrôles de non-régression ; une fixture est admise ici. **Gate E1 — lancement éditorial :** article réel, FR-18 réussi, promotion contrôlée et probe post-déploiement ; une fixture ne satisfait pas E1. **Gate R1 — roadmap :** related, hubs, auteur enrichi, projet, AEO étendue et RSS si approuvés. Les probes de production sont obligatoires avant clôture d'E1 ou R1, mais ne constituent pas une gate de compilation locale.

### 14.1 Primaries

- **SM-1 :** La préparation technique T0 est verte lorsqu'une fixture temporaire explicitement identifiée traverse le contrat minimal, `/blog`, la route article, la homepage et les sorties SEO/AEO existantes sans divergence. Valide FR-1 à FR-4, FR-7, FR-12 à FR-14, FR-16 et FR-17.
- **SM-E1 :** Le lancement éditorial E1 n'est vert que lorsqu'un article réel passe FR-18, la promotion contrôlée et le probe post-déploiement. Valide FR-3, FR-13, FR-17 et FR-18.
- **SM-2 :** Après extension, les trois hubs, la homepage, la page auteur et les routes articles sont accessibles sur desktop/mobile et ne régressent pas la homepage. Valide FR-4 à FR-11.
- **SM-3 :** Les états brouillon, article futur, noindex, preview et exclu du sitemap produisent un comportement documenté et ne fuitent pas. Valide FR-12.
- **SM-4 :** Le corpus produit des métadonnées cohérentes et vérifiables dans les artefacts publics ; la première release ne crée pas de nouvelle projection AEO. Valide FR-13 et FR-14.
- **SM-8 :** Les retours et parcours de lecteurs techniques ou de décideurs sont utilisés comme signal qualitatif de valeur pour une audience qualifiée, sans seuil de trafic ou de conversion. Valide FR-2, FR-4 et FR-7.
- **SM-9 :** La checklist de preuve permet de vérifier qu'un corpus public expose des expériences, méthodes, limites et réutilisations sans contenu générique. Valide FR-2 et FR-3.

### 14.2 Secondaries

- **SM-5 :** L'analytics existante reste non régressive si elle est activée avec consentement ; aucun nouvel événement blog n'est une condition de succès de la première release. Valide NFR-11.
- **SM-6 :** Search Console, les probes HTTP et les retours qualitatifs fournissent une baseline descriptive après publication. Valide FR-12 à FR-15.
- **SM-7 :** Le nombre, la diversité et la profondeur des expériences publiées sont suivis comme un indicateur de patrimoine, sans seuil arbitraire. Valide FR-1 à FR-3.

### 14.3 Dictionnaire de mesure

| Signal | Observation | Propriétaire | Cadence | Décision servie |
| --- | --- | --- | --- | --- |
| Preuve éditoriale | Checklist de l'article réel, sources, limites et corrections | Simon | À chaque publication | Autoriser ou rejeter l'article |
| Utilité de lecture | Retours qualitatifs de lecteurs techniques ou de décideurs | Simon | Après publication et retours reçus | Ajuster le format ou la clarté |
| Autorité du corpus | Diversité des formats, profondeur des expériences et relations futures | Simon | Revue trimestrielle | Ouvrir ou fermer une slice roadmap |
| Santé de distribution | Routes, sitemap, AEO, canonical et exclusions | Équipe technique | À chaque release | Corriger une régression ou roll back |
| Vie privée | Consentement et absence de fuite de draft/donnée privée | Responsable technique | À chaque validation | Bloquer la publication |

Ces observations sont des diagnostics ; elles ne créent pas de seuil chiffré ni de promesse de performance.

### 14.4 Counter-metrics

- **SM-C1 :** aucune publication ne doit augmenter le nombre de contenus génériques ou sans preuve.
- **SM-C2 :** aucune optimisation ne doit sacrifier la lisibilité technique, la transparence ou la vie privée.
- **SM-C3 :** aucun trafic, classement ou citation ne doit être optimisé par des pratiques de duplication ou de manipulation de fraîcheur.

## 15. Registre des décisions de phase

### Gates bloquants de la première livraison

| ID | Décision | Proposition PRD | Propriétaire | Statut | Gate |
| --- | --- | --- | --- | --- | --- |
| D-01 | Date de publication | `date` seul en phase 1 ; alias ultérieur à définir | Simon + équipe technique | Approuvé | Schéma et migration |
| D-02 | Visibility matrix | `visibility: private`, precedence et codes HTTP explicites | Simon + équipe technique | Approuvé | FR-12 et fixtures |
| D-03 | Canonical et URLs | `usePageSeo`/`useSiteUrl`, `/about`, pas d'alias ni trailing-slash nouveau en phase 1 | Équipe technique | Approuvé, à confirmer par probe | SEO/AEO et probes |
| D-04 | Contrat FR-18 | Formulaire, hash, approbateur et conservation versionnés | Simon | Approuvé | Publication éditoriale |
| D-05 | Promotion | Build statique, canari ou préproduction, probe et rollback | Équipe technique | Approuvé | Première publication réelle |
| D-06 | Confidentialité | Liste blanche réseau, licences, secrets et takedown | Responsable technique + Simon | Approuvé | Revue de supply chain |
| D-07 | Analytics | Aucun nouvel événement/propriété en phase 1 ; inventaire existant | Responsable vie privée | Approuvé | Gate de non-régression |
| D-08 | Thème et navigation | État DS au checkpoint ; homepage/footer seulement en phase 1 | Simon + équipe technique | À confirmer au checkpoint | Revue visuelle |

### Décisions de roadmap différées

| ID | Sujet | Condition d'ouverture |
| --- | --- | --- |
| R-01 | Hubs et slugs dédiés | Réservation de routes et contrat de découverte |
| R-02 | Related et resolver | Au moins deux articles publics et règle de tie-break |
| R-03 | Relations projet | ID public et destination autorisée |
| R-04 | AEO étendue et champs publics | Allow-list et propriétaire de chaque sortie |
| R-05 | RSS | Owner statique, path, MIME, champs item et découverte |
| R-06 | `featured`, `evergreen`, `read`, `series`, `archived` | Source de vérité et visibilité ratifiés |
| R-07 | Navigation principale et analytics enrichie | Décision UX et revue de vie privée |

### Questions de mesure et de provenance

- M-01 : quelles observations qualitatives, dates, retours et décisions Simon consigne-t-il après publication ?
- M-02 : quelles baselines SEO et de distribution sont autorisées, sans seuil de trafic ou de conversion inventé ?
- P-01 : le brief original est-il sauvegardé comme source produit versionnée avant ratification de la SPEC ?

Ces éléments sont désormais validés par la proposition de changement de sprint ; D-08 reste la seule confirmation opérationnelle pendante du checkpoint Epic 14.

## 16. Index des hypothèses

- [ASSUMPTION: Les parcours sont des scénarios provisoires à confirmer par des sessions de lecture réelles.] — §2.3.
- [ASSUMPTION: Les lecteurs principaux sont des pairs techniques et des décideurs qui évaluent une compétence réelle.] — §2, UJ-1 à UJ-3.
- [ASSUMPTION: La valeur éditoriale repose sur une expérience de première main, des sources et des limites explicites.] — §1, §4.1.
- [ASSUMPTION: Aucun chiffre de trafic, de classement ou de conversion ne doit être inventé.] — §14.
- [ASSUMPTION: `SITE.profile` reste la source auteur et `SITE.projects` la source projet.] — §4.4.
- [ASSUMPTION: Les hubs Vue et les routes article doivent rester des namespaces distincts.] — §8.
- [ASSUMPTION: L'Epic 14 doit être stabilisé avant les changements structurels du blog.] — §10.
- [ASSUMPTION: Les fixtures sont synthétiques, temporaires et supprimées après validation.] — §13.1, FR-17.
- [ASSUMPTION: Le blog reste une source de vérité Markdown et ne reçoit pas de CMS externe.] — §8, §12.

## 17. Références et artefacts associés

- SPEC : `docs/specs/spec-blog-editorial/SPEC.md`.
- Contrat de contenu : `docs/specs/spec-blog-editorial/content-contract.md`.
- Brownfield : `docs/specs/spec-blog-editorial/brownfield.md`.
- Plan de vérification : `docs/specs/spec-blog-editorial/verification-plan.md`.
- Investigation : `docs/implementation-artifacts/investigations/blog-editorial-brief-investigation.md`.
- Planning : `docs/planning-artifacts/epics.md` et `docs/implementation-artifacts/sprint-status.yaml`.
- Checkpoint Epic 14 : `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md`
- Proposal : `docs/planning-artifacts/sprint-change-proposal-2026-09-25.md`
- Recherche et détails techniques : `addendum.md`.

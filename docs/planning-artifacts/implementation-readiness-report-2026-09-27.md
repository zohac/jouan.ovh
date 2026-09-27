---
stepsCompleted: ['step-01-document-discovery', 'step-02-prd-analysis', 'step-03-epic-coverage-validation', 'step-04-ux-alignment', 'step-05-epic-quality-review', 'step-06-final-assessment']
scope: Epic 16 / Epic 17 (plateforme editoriale T0/E1)
assessedEpics: [16, 17]
outputFile: '{planning_artifacts}/implementation-readiness-report-2026-09-27.md'
date: 2026-09-27
readinessStatus: ready-for-t0
findings: 22
documentsIncluded:
  prd: docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md
  epics: docs/planning-artifacts/epics.md
  spec: docs/specs/spec-blog-editorial/ (6 files)
  ux: docs/design_system/ui_kits/jouan-site/Home - Awwwards.html
  architecture: docs/planning-artifacts/architecture-blog-editorial.md
blockingGaps: []
openItems:
  - cycle de correction FR-3 sans story porteuse (A4, gate E1)
  - surface de preview non construite (A5, decision R1)
resolvedGaps:
  - architecture absente -> produite le 2026-09-27
  - SM-1 auto-contradictoire -> corrige le 2026-09-27
  - reference de design erronee (Blog.jsx) -> corrigee le 2026-09-27
  - CTA sur article noindex -> arbitre en D-09 le 2026-09-27
criticalViolations: 0
orphanRequirements: 0
forwardDependencies: 0
---

# Implementation Readiness Assessment Report

**Date:** 2026-09-27
**Project:** jouan.ovh

## Step 1 — Document Discovery

### Périmètre de l'évaluation

Évaluation ciblée sur les **Epics 16 et 17** (plateforme éditoriale T0/E1), nouvellement
décomposés en 8 stories le 2026-09-26. Les Epics 1 à 15 sont `done` et hors périmètre.

### PRD Documents

**Sharded :**
- Folder : `prds/prd-jouan.ovh-2026-09-24/`
  - `prd.md` (63 095 o, 2026-09-26) — **document canonique**, 18 FR, 15 NFR, 5 UJ, gates T0/E1/R1
  - `addendum.md` (9 689 o, 2026-09-26)
  - `.decision-log.md` (8 322 o, 2026-09-26)
  - `reconcile-intent.md`, `reconcile-spec.md`, `reconcile-planning.md`
  - `review-adversarial.md`, `review-adversarial-current.md`, `review-rubric.md`, `review-rubric-current.md`, `review-prose.md`, `review-structure.md`

Aucun doublon whole/sharded : un seul PRD, en format sharded.

### Architecture Documents

**Aucun trouvé dans `{planning_artifacts}`.**

⚠️ **WARNING : document d'architecture absent du répertoire attendu.**

Candidat de substitution identifié dans `project_knowledge` :
- `docs/specs/spec-blog-editorial/architecture-diagrams.md` (5 174 o, 2026-09-26)

Ce fichier est un companion de SPEC, pas un document d'architecture BMAD. Il couvre les flux
T0, le resolver de visibility et la promotion E1, mais ne constitue pas une architecture
complète (pas de stack decision records, pas de catalogue de composants, pas de modèle de
déploiement).

Documents d'architecture historiques (hors périmètre, autres epics) :
- `docs/specs/spec-theme-light-dark/technical-architecture.md`

### Epics & Stories Documents

**Whole :**
- `epics.md` (1 925 lignes, 2026-09-27) — 17 epics, 69 stories

Aucun doublon whole/sharded.

**État des stories Epic 16/17 :** aucun fichier story sur disque — les 8 stories sont en
`backlog` dans `sprint-status.yaml` et attendent `[CS] bmad-create-story`.

### UX Design Documents

**Sharded :**
- Folder : `ux-designs/ux-jouan.ovh-2026-09-18/`
  - `DESIGN.md` (9 457 o, 2026-09-18) — `status: final`, périmètre « Design System Thème Light & Dark »
  - `EXPERIENCE.md` (9 828 o, 2026-09-18)
  - `.decision-log.md` (2 107 o, 2026-09-18)
  - `imports/` — ne contient que `.gitkeep`
  - `.working/` — ne contient que `.gitkeep`

Aucun doublon whole/sharded.

### Documents de support (hors classification BMAD)

`docs/specs/spec-blog-editorial/` — 5 companions de SPEC canoniques pour l'Epic 16/17 :

| Fichier | Taille | Modifié |
| --- | --- | --- |
| `SPEC.md` | 14 675 o | 2026-09-26 |
| `content-contract.md` | 11 723 o | 2026-09-25 |
| `verification-plan.md` | 8 404 o | 2026-09-26 |
| `brownfield.md` | 5 830 o | 2026-09-25 |
| `architecture-diagrams.md` | 5 174 o | 2026-09-26 |
| `.decision-log.md` | 6 168 o | 2026-09-26 |

Documents de gouvernance :
- `docs/planning-artifacts/sprint-change-proposal-2026-09-25.md` — `status: approved-applied`
- `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md` — `status: ratified`
- `docs/implementation-artifacts/sprint-status.yaml` — 103 entrées, 8 stories Epic 16/17 en `backlog`

### Issues Found

**Doublons : aucun.** Les quatre types de documents ont été recherchés ; aucun conflit
whole/sharded n'a été détecté.

**Documents manquants : deux sur quatre.**

1. ⚠️ **Architecture** — absente de `{planning_artifacts}`. Le companion
   `architecture-diagrams.md` couvre partiellement le besoin.
2. ⚠️ **UX Design** — le seul document UX du dépôt est un design system global
   (`status: final`, périmètre thèmes) et ne mentionne ni le blog ni l'Epic 16. Zéro occurrence
   de « blog », « Epic 16 ». Aucun document UX ne couvre les surfaces `/blog` et `/blog/<slug>`.

**Dette connue, hors périmètre de la découverte :**
- `brownfield.md:60` décrit l'Epic 14 comme non commité — périmé depuis le commit `5eba621`
- `brownfield.md:82` affirme que la révision « ne débloque pas encore les stories » — périmé depuis la
  ratification D-08 du 2026-09-26

Ces deux lignes sont déjà tracées dans `epics.md` (§ « Stale data détectée dans les sources »).

### Required Actions — décisions utilisateur

**Décision 1 — Périmètre : CONFIRMÉ le 2026-09-27.**
Évaluation limitée aux Epics 16 et 17. Les Epics 1 à 15 sont `done` et hors périmètre.

**Décision 2 — Architecture : RÉSOLUE le 2026-09-27.** ✅
`docs/planning-artifacts/architecture-blog-editorial.md` a été produit, dérivé du code réel relu
(source de vérité : `app/utils/blog-indexability.ts`, `content.config.ts`, `nuxt.config.ts`,
`server/plugins/`, `server/middleware/`, les trois pages du blog). Il contient les décisions
AD-01 à AD-09, la contrainte de sérialisation du prédicat d'indexabilité, la table des neuf
appelants, le resolver à deux couches, la frontière hubs/catch-all, le modèle de déploiement et la
traçabilité story → architecture. **L'écart bloquant A1 est levé.**

Deux découvertes de cette lecture ne figuraient nulle part auparavant :
- `isIndexableBlogEntry` est **dupliquée à dessein** (elle réimplémente inline `isSitemapExcluded`
  et `hasNoindexDirective`) parce que `@nuxtjs/sitemap` la sérialise via `Function#toString()`. La
  duplication est une contrainte, pas un défaut. La supprimer casse le sitemap sans erreur de build.
- le champ frontmatter `sitemapExcluded` (`content.config.ts:63`) est **mort** : aucune
  transformation ne l'écrit.

**Décision 3 — UX blog : COMPOSITION, revue humaine Simon. Référence corrigée le 2026-09-27.**

> **Double correction de l'étape 1.** (a) J'avais conclu à tort qu'aucune référence blog n'existait :
> le design **courant** `Home - Awwwards.html` n'a pas de page blog, mais il possède une **section
> `#journal`** avec les composants de carte `.jpost`, `.jfeat`, `.jrow`, `.seeall` et la taxonomie
> `.tag`. (b) Simon a précisé que `Blog.jsx` date de la **version précédente du site** et n'est plus
> la référence.

| Référence | Fichier | Couverture |
| --- | --- | --- |
| Design courant | `ui_kits/jouan-site/Home - Awwwards.html` | langage de section, typographie monospace des titres, taxonomie `.tag`, **section `#journal`** (`.jpost`, `.jfeat`, `.jrow`, `.seeall`) |
| Page `/blog` | — | ❌ **non maquetée** |
| Vue article | — | ❌ **non maquetée** |
| Thème clair | — | ❌ **non couvert** (le design est sombre) |
| Ancien UI kit | `ui_kits/jouan-site/Blog.jsx`, `index.html`, `kit.css` | ⚠️ **superseded** — ne pas s'en servir comme référence de rendu |

**Conséquence :** `/blog` et `/blog/<slug>` sont des **compositions** dérivées du langage de section du
design courant, pas des calques. L'adaptation est faible — les primitives existent (`section.block`,
`.block__head`, `.container`, `.eyebrow`, `.tag`, `.prose`) — mais il n'y a pas de cible pixel.

Simon assume le complément : **il vérifie le rendu au navigateur et ajuste ce qui ne lui convient
pas.** L'autorité d'acceptation visuelle est Simon. La gate navigateur de la story 16.8 valide la
cohérence au design system, l'accessibilité, les deux thèmes et l'absence de régression ; **elle ne
vaut pas jugement esthétique.**

**Actions requises avant implémentation :**

1. ✅ Produire `architecture-blog-editorial.md` — **fait le 2026-09-27**.
2. ✅ Reformuler la revue visuelle de la story 16.8 et rattacher `Home - Awwwards.html` aux stories
   16.3, 16.4 et 16.8 — **fait le 2026-09-27**.
3. Dette documentaire connue, non bloquante : `brownfield.md:60` et `brownfield.md:82` périmés
   depuis le commit `5eba621` et la ratification D-08 du 2026-09-26.

### Sources retenues

| Type | Fichier retenu |
| --- | --- |
| PRD | `prds/prd-jouan.ovh-2026-09-24/prd.md` |
| Epics | `epics.md` (sections Epic 16 et 17) |
| Architecture | `architecture-blog-editorial.md` (**produit le 2026-09-27**) |
| UX | `docs/design_system/ui_kits/jouan-site/Home - Awwwards.html` (design courant ; blog non maqueté) |
| SPEC | `docs/specs/spec-blog-editorial/` (6 fichiers) |

---

## PRD Analysis

**Source :** `prds/prd-jouan.ovh-2026-09-24/prd.md` (743 lignes, frontmatter `status: approved`,
`updated: 2026-09-26`).
**Numérotation PRD :** `FR-1` à `FR-18` et `NFR-1` à `NFR-15` (avec tiret) — **distincte** de la série
`FR1`→`FR64` de l'inventaire global `epics.md`.

### Functional Requirements Extracted

**Total FRs : 18**

#### 4.1 Contrat éditorial et qualité de preuve

- **FR-1 : Article structuré** — Simon peut créer un article Markdown avec titre, description, date
  de publication, auteur, exactement un pilier, un format, des tags et un état de publication
  validés. `goals` optionnel et interne, jamais critère de publication. Conséquences : fixture
  conforme acceptée par le contrat ; valeurs `format` issues de `content-contract.md` (les libellés
  français ne créent pas de seconde enum) ; enum invalide → erreur compréhensible ; draft non
  publié implicitement ; format indépendant du pilier ; titre unique dans le corpus public en
  première release.
- **FR-2 : Admission fondée sur l'expérience** — documenter problème, contexte, méthode,
  observation, résultat et limites sans potentiel commercial comme condition. Conséquences :
  checklist distingue prouvé/incertain/privé/non mesuré ; contenu générique ≠ preuve d'expertise ;
  alternatives, méthode, limites et réutilisabilité identifiées ; affirmations sensibles citent une
  source primaire ou expliquent l'absence de source publique ; versions, environnements, licences
  et attributions indiqués ; politique de confiance documentée pour liens/images/HTML/code ;
  **métriques, dates et résultats absents ne sont pas complétés par invention**.
- **FR-3 : Corrections et mise à jour** — signaler correction ou évolution sans modifier
  artificiellement la fraîcheur. Conséquences : `updated` seulement pour évolution éditoriale
  réelle ; date de publication immuable + note de correction traçable dans Git ; slug stable en
  première release, renommage ultérieur = décision de redirection ; le lecteur distingue publication
  et mise à jour ; corrections importantes visibles dans le parcours de lecture.

*Cycle de correction (§4.1)* : mineure (pas de `updated`, pas de révision FR-18) · substantielle
(`updated` obligatoire, révision FR-18) · rétractation/erreur factuelle (date conservée, statut
visible, révision) · renommage de slug (route nouvelle après décision, révision). **Le rollback
éditorial et le takedown confidentialité sont deux procédures distinctes.**

#### 4.2 Découverte éditoriale et hubs

- **FR-4 : Homepage éditoriale** — `/blog` présente la promesse éditoriale et les trois derniers
  articles publics triés par date décroissante ; sections « contenu fondamental », « sélection par
  pilier » et `featured` différées. Conséquences : `/blog` indexable et fonctionnel avec corpus vide
  via état vide explicite ; brouillons/programmés/non publics non listés ; chaque lien interne
  décrit contenu et pilier ; **max trois articles** dans « derniers articles » et **aucune carte
  dupliquée** sur la même page.
- **FR-5 : Hubs de pilier — extension phase 2** — `/blog/ia`, `/blog/engineering`,
  `/blog/automatisation`. **Pas une gate de la première release.** Exige route Vue dédiée et
  contrat de découverte ; slugs réservés ; chaque hub a route HTML, entrée sitemap et SEO propres
  même si le scan Content ne le voit pas ; valide avec corpus vide.
- **FR-6 : Traçabilité de la découverte** — relier un contenu à son auteur et son pilier dès la
  première livraison ; contexte projet et related = roadmap. Conséquences : liens internes à
  ancres/libellés compréhensibles ; relation invalide non rendue comme route publique ; blog
  accessible depuis homepage et footer existants **sans créer de second propriétaire de
  navigation** ; entrée principale du header différée.

#### 4.3 Expérience de lecture et navigation

- **FR-7 : Métadonnées et structure de l'article** — titre, description, auteur, dates, pilier,
  format et sources visibles ; contexte projet autorisé seulement en R1. Conséquences : dates HTML
  conformes au contrat ; sources = sections/liens du corps Markdown, **pas un champ secret ajouté
  implicitement au frontmatter** ; auteur depuis la source partagée, pas un nom libre dupliqué ;
  hiérarchie `h1`→`h2`→`h3` cohérente.
- **FR-8 : Articles liés (`related`) — extension phase 2** — jusqu'à trois articles liés publics et
  pertinents (ordre : relation explicite, projet, pilier, tags, récence). **Pas une gate de la
  première release** ; le résolveur filtre les relations **avant tout rendu ou crawl**.
  Conséquences : l'article courant n'est jamais lié à lui-même ; brouillon/programmé/`noindex` non
  autorisé/slug absent jamais proposé ; la relation ne déclenche pas de crawl vers une route non
  voulue.
- **FR-9 : Lecture longue et code** — prose, bloc de code, image et taxonomie longue lisibles sur
  desktop et mobile sans overflow horizontal ni perte de contraste. Conséquences : code avec zone
  de défilement contrôlée et contraste lisible ; images avec dimensions et texte alternatif ;
  mouvement réduit et modes de contraste respectés.

#### 4.4 Auteur, projets et contexte public

- **FR-10 : Page auteur enrichie — extension phase 2** — page auteur canonique avec parcours,
  expertises, projets publics et derniers contenus autorisés ; la page existante reste non
  régressive, enrichissement **conditionnel à une décision d'architecture de l'information**.
  Conséquences : une seule page auteur canonique ; derniers articles respectent le contrat ;
  liens sociaux/GitHub rendus seulement si URLs réelles et confirmées.
- **FR-11 : Relation article-projet — extension conditionnelle phase 2** — rattacher un article à un
  projet public stable avec contexte bidirectionnel sans exposer dépôt privé ni chemin interne ;
  **désactivé en première release** tant que destination et ID public ne sont pas confirmés.
  Conséquences : projet résolu par **identifiant stable, jamais par correspondance de nom humain** ;
  destination autorisée et publiquement accessible ; articles liés triés par date et publics selon
  la politique choisie.

#### 4.5 Publication, SEO, AEO et distribution

- **FR-12 : États de visibilité** — distinguer publication, indexabilité, prévisualisation,
  `noindex`, `robots: false`, exclusion sitemap, visibilité privée et contenu futur **dans toutes
  les surfaces publiques**. La matrice §6.3 est le contrat ratified. Conséquences : fixtures
  couvrent chaque état avec résultat documenté pour HTML, listes, Markdown, sitemap, AEO, RSS et
  accès direct ; **`visibility: private` est séparé de `sitemap: false/null` et ne peut pas être
  déduit d'un simple champ d'indexabilité** ; précédence déterministe, aucune surface ne choisit un
  état différent ; comportement d'accès direct d'une URL exclue défini avant livraison.
- **FR-13 : SEO et données structurées** — article public produit URL canonique auto-référente,
  `BlogPosting` cohérent, métadonnées Open Graph/Twitter existantes, artefacts sitemap/`robots.txt`.
  Conséquences : `datePublished`, `dateModified`, auteur, image et URL canonique correspondent aux
  métadonnées résolues ; `ProfilePage` de la page auteur présent et cohérent ; sitemap sans doublon
  ni route non indexable ; **aucun second module SEO, sitemap ou robots**.
- **FR-14 : AEO sans promesse d'autorité** — contenu public exposé dans représentations Markdown et
  AEO prévues avec champs explicitement publics ; première release vérifie la non-régression des
  sorties existantes, toute nouvelle projection de champ est extension phase 2. Conséquences : pas
  de secret, donnée de formulaire ni article privé dans les exports ; champs non publics non ajoutés
  automatiquement ; matrice `champ → propriétaire → sortie autorisée → assertion CI` normative ;
  **le PRD et le contenu ne promettent ni classement, ni citation IA, ni trafic**.
- **FR-15 : RSS conditionnel — hors première release** — si confirmé, flux statique avec propriétaire
  unique et découverte depuis le blog ; **ne doit pas être ajouté au backlog sans décision
  explicite**. Conséquences : respecte le contrat de publication/indexabilité ; chemin, MIME,
  champs item et limite documentés ; n'est pas un remplacement du sitemap, du canonical ou de l'AEO.

#### 4.6 Expérience site-compatible et accessibilité

- **FR-16 : Composition avec le design system** — les nouvelles surfaces utilisent les tokens CSS,
  composants UI, layout et composants de liens existants plutôt que des valeurs arbitraires.
  Conséquences : contrôles navigateur couvrent **desktop 1280px et mobile 375px**, fil d'Ariane,
  lien de retour, liens externes accessibles, images, thèmes, contraste forcé et appel à l'action
  sans contenu privé ; direction terminale, typographie et comportements de thèmes cohérents ;
  **aucun composant de librairie externe nécessaire** ; liens externes via `ZExternalLink` avec
  `rel="noopener"` et libellé accessible, focus visibles avec repli `outline` standard ; listes de
  cartes/étapes/related en éléments sémantiques, code à défilement local, **aucune page ne déborde
  horizontalement**.

#### 4.7 Validation et exploitation

- **FR-17 : Fixtures et gate statique** — valider contrat minimal, exclusions, `/blog`, article,
  homepage et artefacts existants avec fixtures temporaires et gate Docker. Conséquences : commande
  Docker exacte = `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm
  typecheck && pnpm generate"` avec code `0` ; fixtures couvrant **au minimum** publication, article
  imbriqué, brouillon, date future, noindex, robots false, exclusion sitemap ; fixture uniquement en
  checkout local, build QA ou CI temporaire, **jamais versionnée ni déployée**, suppression vérifiée
  par diff et recherche de slugs ; HTML T0 de `/`, `/blog` et article + jumeaux Markdown, `sitemap.xml`,
  `robots.txt`, `CNAME`, `_headers` inspectés ; fixtures supprimées après validation ; résultats
  statiques, navigateur et production consignés ; **bundle local bloquant pour la story**, bundle
  navigateur bloquant avant merge, bundle production obligatoire avant clôture de release. **Hors
  périmètre : création d'un framework de test dédié pour ce seul lot.**
- **FR-18 : Gate éditoriale de preuve** — avant toute publication réelle, Simon soumet l'article à
  une checklist de preuve couvrant problème, contexte, méthode, alternatives, résultats, limites,
  sources et données privées potentiellement exclues. Conséquences : un article sans preuve suffisante
  reste en préparation technique et **ne devient pas une publication de démonstration** ; checklist
  et décision consignées dans `docs/implementation-artifacts/editorial-reviews/<slug>.md` avec slug,
  hash du contenu, version de checklist, date et approbateur ; la checklist ne devient pas un contenu
  public automatique.

*Formulaire normatif de preuve* : 8 champs (`slug`+version, problème/contexte, base de première
main, méthode/alternatives, preuves, confiance/confidentialité, limites/inconnu, décision `pass`/
`rework`/`reject` avec motif, date et approbateur Simon). **Une modification de `date`, du hash, des
sources ou des limites invalide le `pass` et exige une nouvelle revue.**

*Compatibilité de migration* : une évolution du contrat de contenu ne devient exécutable qu'après
inventaire de tous ses consommateurs (schéma Content, pages, homepage, résolveur, `usePageSeo`,
AEO, fixtures CI, scripts de build) ; choix entre lecture temporaire et migration atomique tranché
dans la SPEC et le journal de décision ; **aucune story de schéma ne commence avant cette
ratification et aucune valeur divergente n'est résolue silencieusement**.

### Non-Functional Requirements Extracted

**Total NFRs : 15**

| ID | Exigence |
| --- | --- |
| NFR-1 | Compatibilité Nuxt 4, `@nuxt/content` v3, génération statique, GitHub Pages |
| NFR-2 | Aucun contenu public ne dépend d'un serveur à l'exécution, d'une base de données ou d'un CMS externe |
| NFR-3 | Commandes de développement et de validation via Docker ; aucun gestionnaire de paquets sur l'hôte |
| NFR-4 | Les propriétaires existants de canonical, JSON-LD, sitemap, robots et AEO restent uniques |
| NFR-5 | Date de publication résolue de manière déterministe ; valeurs divergentes jamais choisies silencieusement |
| NFR-6 | Contenu et interface en français, vouvoiement, première personne pour Simon, aucun emoji |
| NFR-7 | Hiérarchie des titres, focus clavier, contraste forcé et réduction de mouvement respectés |
| NFR-8 | Contenus privés, brouillons, URLs de dépôts et chemins internes non exposés dans relations ou artefacts publics |
| NFR-9 | Le blog ne dégrade pas la homepage, les routes existantes, le déploiement `gh-pages`, le `CNAME` ni les budgets AEO |
| NFR-10 | Performances statiques et budget de génération compatibles ; aucune dépendance lourde sans justification |
| NFR-11 | Analytics existante non régressive, respect du consentement, minimisation et vie privée ; aucun nouvel événement pour T0 |
| NFR-12 | Corrections, rollbacks et décisions de publication traçables dans le Dev Agent Record |
| NFR-13 | Supply chain : pas de scripts/trackers non approuvés, images distantes non contrôlées, URLs à paramètres de suivi, ni ressource révélant une donnée privée ; licences, sources et secrets vérifiés avant publication |
| NFR-14 | Première release n'ajoute aucun événement, propriété ou paramètre analytics ; propriétés existantes sous liste d'autorisation documentée |
| NFR-15 | Aucun article réel promu avant validation de l'artefact statique et des non-régressions ; première publication via déploiement contrôlé et probe post-déploiement |

### Additional Requirements

**Décisions de cadrage ratifiées (§6.3)** — le PRD tranche explicitement pour empêcher les
workflows aval d'inventer des contrats :

| Sujet | Default | Statut |
| --- | --- | --- |
| Date | `date` seul ; `publishedAt` non accepté | Ratifié T0 |
| Auteur | `/about` canonique | Ratifié T0/R1 |
| Projet | ID stable + contexte/ancre, pas de page détail | À confirmer R1 |
| Related | Relation explicite invalide = échec ; relation déduite = omission | Ratifié R1 |
| Preview | `visibility: private` séparé ; draft/future = 404 ; noindex/robots publics non découverts | Ratifié T0 |
| Canonical | Self-canonical par défaut | Ratifié T0, probe requis |
| RSS | Hors T0 ; propriétaire statique séparé | Reporté R1 |

**Matrice de visibilité (§6.3)** — 7 états, contrat normatif de la première release :

| État | HTML prod. | Listes/homepage | Sitemap/AEO | RSS | Accès direct |
| --- | --- | --- | --- | --- | --- |
| `draft: true` | absent | absent | absent | absent | 404 ; preview séparé |
| date future | absent | absent | absent | absent | 404 ; preview séparé |
| `visibility: private` | absent | absent | absent | absent | 404 ; preview séparé |
| publié + `noindex: true` | présent + balise `noindex` | absent des sélections | absent | absent | 200 |
| publié + `robots: false` | présent + directive conforme | absent des sélections | absent | absent | 200 |
| publié + `sitemap: false/null` | présent | présent sauf autre règle | absent | absent | 200 |
| publié + indexable | présent | présent | présent | absent tant que RSS non approuvé | 200 |

**Gates bloquants (§15)** : T0 (préparation technique, fixture admise) · E1 (article réel + FR-18 +
promotion contrôlée + probe ; **une fixture ne satisfait pas E1**) · R1 (related, hubs, auteur
enrichi, projet, AEO étendue, RSS si approuvés). Les probes de production sont obligatoires avant
clôture d'E1 ou R1 mais **ne constituent pas une gate de compilation locale**.

**Non-goals explicites (§12)** : CMS/headless/base éditoriale, compte utilisateur, commentaires,
newsletter · génération automatique d'articles, contenu fictif, métriques inventées, fixtures
publiées · recherche sémantique, indexation vectorielle, recommandation IA · refonte globale du DS,
changement de thème, nouvelle librairie UI, nouveau langage · recherche textuelle, Mermaid rendu,
bouton de copie, temps de lecture, pages de tags, UI de séries, archive · pages projet détaillées ou
collections auteurs/projets autonomes · double propriétaire de canonical/JSON-LD/sitemap/robots/AEO ·
promesse de classement, trafic, citation IA ou conversion.

**Roadmap conditionnelle (§13.2)** : hubs Vue dédiés, related déterministe filtré avant rendu,
enrichissement `/about` + relations article-projet sur IDs publics, AEO étendu par allow-list, RSS
statique, champs optionnels additionnels, curation `featured`, navigation principale, nouveaux
événements analytics. **« Ces capacités sont des objectifs de roadmap, pas des dépendances cachées
de la première release. »**

### PRD Completeness Assessment

**Complet sur le fond.** Les 18 FR portent des « Conséquences vérifiables » testables, la matrice de
visibility est complète à 7 états, les non-goals sont explicites, les gates sont définies avec
critère de non-saturation (une fixture ne satisfait pas E1). Aucun FR n'est formulé en
vagueur non testable.

**Trois réserves de forme :**

1. ~~**Statut `draft` assumé.**~~ **Erreur de cette évaluation, corrigée le 2026-09-27.** Le
   frontmatter du PRD porte `status: approved` et `updated: 2026-09-26`. Son « Bloc de décision »
   (l. 44-56) indique « **les stories T0 peuvent être décomposées** » — c'est fait. **Aucun blocage
   de gouvernance ne s'oppose au développement de T0.** Cette réserve était infondée : elle a été
   dérivée du résumé de session et non du frontmatter du PRD, qui n'avait pas été relu.

2. **Double numérotation FR.** Le PRD utilise `FR-1`→`FR-18`, l'inventaire global `epics.md` utilise
   `FR1`→`FR64`. J'ai ajouté une note de clarification dans `epics.md`, mais le risque de confusion
   persiste tant que les deux séries coexistent. Le PRD **ne définit pas** la projection
   `FR-n` → `FRn`, ou inversement : la matrice CAP-1 mentionne « FR-1 à FR-3 » sans indiquer la
   série de destination.

3. **Sept hypothèses non résolues (§ « Hypothèses de cadrage »).** `[ASSUMPTION: ...]` — dont
   « L'Epic 14 doit être stabilisé avant les changements structurels du blog », **qui est désormais
   satisfaite** (checkpoint ratifié le 2026-09-26) mais dont l'entrée texte n'a pas été mise à jour,
   et « Les parcours restent des hypothèses jusqu'à validation » (UJ-1, UJ-2, UJ-3) qui
   **n'a aucun statut de validation** dans le PRD. Les parcours utilisateurs ne sont donc pas
   validés, seulement supposés.

---

## Epic Coverage Validation

### Couverture déclarée dans les epics

Les epics ne listent pas les `FR-n` du PRD directement. Elles déclarent :
- un **inventaire normatif T0** de `FR55` → `FR64` + `NFR16` → `NFR25` (inventaire propre à l'Epic 16)
- une **matrice CAP** qui fait le pont vers la numérotation du PRD (`FR-1` → `FR-18`)
- une **matrice de couverture** Epic 16/17 (20 lignes, 0 orpheline)

**Total FR déclarés dans les epics (série `FRn`) : 10** (FR55→FR64) + `FR-18` = 11.
**Écarts de numérotation :** le PRD utilise `FR-1`→`FR-18`, les epics `FR55`→`FR64`. **Aucune
projection formelle `FR-n` → `FRn` n'existe.** Le seul pont est la matrice CAP.

### Matrice de couverture

| FR PRD | Exigence | CAP | Phase | Epic / Story | Statut |
| --- | --- | --- | --- | --- | --- |
| FR-1 | Article structuré | CAP-1 | T0 | 16 / 16.1 (FR55) | ✅ Couvert |
| FR-2 | Admission fondée sur l'expérience | CAP-1 | T0/E1 | **17 / 17.1** | ⚠️ Couvert en E1 seulement |
| FR-3 | Corrections et mise à jour | CAP-1 | T0/E1 | 16.1 (FR60) + 17.2 | ⚠️ Partiellement couvert |
| FR-4 | Homepage éditoriale | CAP-2 | T0 | 16 / 16.3 (FR57) | ✅ Couvert |
| FR-5 | Hubs de pilier | CAP-3 | R1 | différé R1 | ✅ Différé et documenté |
| FR-6 | Traçabilité de la découverte | CAP-4 | T0 | 16.3 (liens) — **contrainte de nav absente** | ⚠️ Partiellement couvert |
| FR-7 | Métadonnées et structure | CAP-4 | T0 | 16 / 16.4 (FR58) | ✅ Couvert |
| FR-8 | Articles liés (`related`) | CAP-4 | R1 | différé R1 | ✅ Différé et documenté |
| FR-9 | Lecture longue et code | CAP-4, CAP-8 | T0 | 16.4 (FR58) | ✅ Couvert |
| FR-10 | Page auteur enrichie | CAP-5 | R1 | différé R1 | ✅ Différé et documenté |
| FR-11 | Relation article-projet | CAP-5 | R1 | différé R1 | ✅ Différé et documenté |
| FR-12 | États de visibilité | CAP-6 | T0 | 16 / 16.2 (FR56) | ✅ Couvert |
| FR-13 | SEO et données structurées | CAP-7 | T0 | 16.4 (FR58) + 16.5 (FR61) | ✅ Couvert |
| FR-14 | AEO sans promesse d'autorité | CAP-7 | T0 | 16.5 (FR61, FR64) | ✅ Couvert |
| FR-15 | RSS conditionnel | CAP-7 | R1 | hors première release | ✅ Différé et documenté |
| FR-16 | Composition avec le DS | CAP-8 | T0 | 16.3, 16.4 (NFR21, NFR22) | ✅ Couvert |
| FR-17 | Fixtures et gate statique | CAP-9 | T0 | 16 / 16.6 (FR62, FR63) | ✅ Couvert |
| FR-18 | Gate éditoriale de preuve | CAP-1, CAP-9 | E1 | 17 / 17.1 | ✅ Couvert |

**Statistiques :**
- Total FR PRD : **18**
- Couvertes en T0 : **14** (FR-1, 3*, 4, 6*, 7, 9, 12, 13, 14, 16, 17)
- Différées R1 explicitement documentées : **4** (FR-5, 8, 10, 11) + FR-15 hors release
- Couvertes uniquement en E1 : **1** (FR-2)
- Partiellement couvertes : **2** (FR-3, FR-6)
- **Orphelines : 0**

*\* couverture partielle — détail ci-dessous.*

### Requirements Partially Covered

#### FR-3 : Corrections et mise à jour — le cycle de correction n'a pas de story

**Ce qui est couvert :** le contrat de date par 16.1/FR60 — `date` en `YYYY-MM-DD`, `publishedAt`
refusé, `updated >= date`, et l'AC « si `updated` est présent, il vérifie `updated >= date` ».

**Ce qui ne l'est pas :** le PRD définit un **cycle de correction à 4 types** (§ « Cycle de
correction ») dont trois branches n'ont aucun propriétaire de story :

| Type de correction | Traitement PRD | Propriétaire de story |
| --- | --- | --- |
| Mineure | Pas de `updated`, pas de révision FR-18, commit + note | — aucun requis |
| Substantielle | `updated` obligatoire, **nouvelle version de checklist** et publication validée | 17.1 (partiellement : invalide le `pass`) |
| Rétractation ou erreur factuelle | Date conservée, statut visible, **note publique, retrait ou 404/410** | **aucun** |
| Renommage de slug | **Route nouvelle après décision, redirection, mise à jour sitemap/AEO, test de liens** | **aucun** |

17.2 couvre le *rollback* (régression technique) et le *takedown* (fuite de données), ce qui est
**différent** d'une correction éditoriale. Le PRD est explicite : « Le rollback éditorial et le
takedown de confidentialité sont deux procédures distinctes » — mais il ne mentionne pas la
**correction éditoriale** comme troisième procédure, et c'est celle que le tableau de cycle
introduit. Le PRD nomme trois procédures, les epics n'en implémentent que deux.

**Recommandation :** ajouter à une story T0 ou E1 l'inventaire des consommateurs avant renommage de
slug (sitemap, AEO, liens), la note de correction traçable dans Git, et le traitement 404/410 d'une
rétractation. Le plus cohérent : story 16.1 pour la contrainte de contrat, story 17.2 pour le
runbook de rétractation.

#### FR-6 : Traçabilité de la découverte — contrainte de navigation absente

**Ce qui est couvert :** 16.3 porte « chaque lien interne décrit le contenu et son pilier » (FR-4),
et 16.4 résout l'auteur depuis `SITE.profile` (FR-7).

**Ce qui ne l'est pas :** la contrainte du PRD « le blog est **accessible depuis la homepage et le
footer existants, sans créer de second propriétaire de navigation** ; l'entrée principale du header
est différée ». 16.5 vérifie la non-régression de la homepage mais **ne vérifie pas qu'un lien vers
`/blog` y existe**, et aucune story ne porte l'interdiction de créer un second propriétaire de
navigation — alors que c'est exactement l'invariant Epic 14 que 16.5 prétend protéger ailleurs.

**Recommandation :** ajouter à 16.5 un AC « un lien vers `/blog` existe dans la homepage ou le
footer existant, résolu via les liens de navigation existants, sans nouvelle entrée header ni
second propriétaire ».

### Incohérence interne au PRD : SM-1 valide des FR qu'aucune fixture ne peut valider

Le PRD déclare (§14.1) :

> **SM-1 :** La préparation technique T0 est verte lorsqu'une fixture temporaire explicitement
> identifiée traverse le contrat minimal, `/blog`, la route article, la homepage et les sorties
> SEO/AEO existantes sans divergence. **Valide FR-1 à FR-4**, FR-7, FR-12 à FR-14, FR-16 et FR-17.

Cette affirmation est **auto-contradictoire** sur deux exigences :

- **FR-2** (*Admission fondée sur l'expérience*) exige une checklist éditoriale distinguant
  prouvé/incertain/privé/non mesuré et l'absence de métriques inventées. **Une fixture synthétique ne
  peut pas la valider** : par construction elle n'a aucune expérience de première main. Le PRD
  reconnaît d'ailleurs cela ailleurs : « un article sans preuve suffisante reste en préparation
  technique et ne devient pas une publication de démonstration » et « une fixture ne satisfait pas
  E1 ».
- **FR-3** (*Corrections et mise à jour*) exige une note de correction traçable et une décision de
  renommage de slug. Une fixture peut valider le contrat `updated >= date`, pas la traçabilité
  éditoriale d'une correction réelle.

**Effet concret :** T0 peut être déclaré vert alors que FR-2 et FR-3 ne sont pas implémentées, parce
que le critère de succès qui les réclame est déclaré satisfiable par une fixture. C'est un **trou de
validation**, pas un trou de couverture.

**Recommandation :** corriger SM-1 en retirant FR-2 (et en restricting FR-3 au seul contrat de date),
ou redéclarer que SM-1 valide `FR-1, FR-3 (contrat de date uniquement), FR-4, FR-7, FR-12 à FR-14,
FR-16, FR-17` et que **FR-2 relève de SM-E1**.

### Exigences des epics absentes du PRD

**Aucune.** Les `FR55`→`FR64` sont un raffinement de granularité des `FR-1`→`FR-18` du PRD, pas des
exigences orphelines. Vérifié exigence par exigence :

| FR epic | Se rattache à |
| --- | --- |
| FR55 contrat de contenu | FR-1 |
| FR56 resolver de visibility | FR-12 |
| FR57 homepage `/blog` | FR-4 |
| FR58 route article | FR-7, FR-9, FR-13 |
| FR59 non-régression homepage | FR-4, FR-6 |
| FR60 contrat de date | FR-3 |
| FR61 non-régression SEO/AEO | FR-13, FR-14 |
| FR62 fixtures et assertions | FR-17 |
| FR63 validation navigateur | FR-16, FR-17 |
| FR64 supply chain | NFR-13, NFR-14 |

---

## UX Alignment Assessment

### UX Document Status

**Trouvé — partiellement.** Aucun document UX BMAD ne couvre le blog, et le **design courant ne
maquette pas le blog**. Simon a corrigé la prémisse de cette évaluation le 2026-09-27 : la référence
retenue n'est pas l'ancien UI kit mais le design actuel.

| Référence | Statut |
| --- | --- |
| `ui_kits/jouan-site/Home - Awwwards.html` | ✅ **Design courant** — langage de section, typographie, taxonomie, et section `#journal` avec `.jpost` / `.jfeat` / `.jrow` / `.seeall` / `.tag` |
| `ui_kits/jouan-site/Blog.jsx` | ⚠️ **Superseded** — date de la version précédente du site |
| Page `/blog` dans le design courant | ❌ **Non maquetée** |
| Vue article dans le design courant | ❌ **Non maquetée** |
| Thème clair | ❌ **Non couvert** — la référence est sombre |

**Conséquence :** `/blog` et `/blog/<slug>` sont des **compositions** dérivées du langage de section du
design courant, pas des calques. L'adaptation est faible — les primitives existent
(`section.block`, `.block__head`, `.container`, `.eyebrow`, `.tag`, `.prose`) — mais il n'y a pas de
cible pixel à reproduire, et l'existe « thème clair » n'a aucune référence.

**Écarts de la version précédente, non repris :** le passage des titres au **monospace**
(`h1, h2, h3 { font-family: var(--font-mono); font-weight: var(--fw-regular) }`) et la taxonomie en
`.tag` pil (`--radius-pill`) sont propres au design courant ; `Blog.jsx` ne les contient pas.

**Les écarts 1 à 8 ci-dessous restent valides** — ils portent sur le contrat (accessibilité, no-goal
PRD, états de visibility) plus que sur l'esthétique, et restent donc applicables quelle que soit la
référence. Ils sont re-priorisés par story dans le tableau de synthèse ci-dessous.

### Alignement UX ↔ PRD

#### Points conformes

| Élément PRD | Référence UX | Statut |
| --- | --- | --- |
| FR-16 tokens CSS, aucune valeur arbitraire | `var(--fs-4xl)`, `var(--fw-light)`, `var(--space-5)`, `var(--text-muted)` | ✅ Conforme |
| FR-16 composant DS existant | `Card`, `Tag`, `Button` depuis le bundle DS | ✅ Conforme |
| FR-16 aucune librairie externe | React + DS uniquement | ✅ Conforme |
| §6.1 preuve avant CTA commercial | CTA « Un projet en tête ? » placé **après** la prose | ✅ Conforme |
| FR-9 code avec zone de défilement | `<pre><code>` en bloc dédié | ✅ Conforme |
| NFR-6 français, vouvoiement, 1re personne | « ce que j'apprends en construisant », « Démarrer un projet » | ✅ Conforme |

#### Écarts — la référence encode des défauts que les stories interdisent

⚠️ **Écart 1 — `← Retour au blog` est un `<button>`, pas un lien.**

Ligne 41 : `<button className="hdr__link" onClick={() => go("blog")}>← Retour au blog</button>`.

Le PRD FR-16 impose que les contrôles navigateur couvrent « fil d'Ariane, **lien de retour**, liens
externes accessibles ». Un `<button>` n'a ni `href`, ni rôle de lien, ni activation
`Entrée`/`Espace` native, ni clic milieu, ni découvrabilité au crawl. L'invariant est nommé dans le
PRD mais la référence ne le respecte pas. **Un agent qui copie la référence produit un bouton.**

⚠️ **Écart 2 — images de contenu avec `alt=""` et sans dimensions.**

Lignes 17 et 47 : `<img className="post__thumb" src={p.img} alt="" />` et
`<img className="article__hero" src={p.img} alt="" />`. Aucun `width`/`height`.

Le PRD FR-9 exige « les images ont **des dimensions** et **un texte alternatif approprié** ».
L'image de couverture d'un article est une image de contenu, pas décorative : `alt=""` la rend
invisible pour un lecteur d'écran, et l'absence de dimensions dégrade le CLS. Les stories 16.4 et
16.6 imposent la même chose (« une image absente déclenche le fallback éditorial, sans image
cassée » ; « les textes alternatifs »). **La référence encode exactement le défaut que 16.4
interdit.**

⚠️ **Écart 3 — temps de lecture, interdit par le PRD sous forme calculée.** _(Analyse corrigée le
2026-09-27 — voir la conclusion corrigée sous les quatre sources.)_

Ligne 22 : `<span>{p.read} de lecture</span>`. Ligne 45 : `<span>{p.read}</span>`.

Quatre sources, dont trois convergeaient initialement vers une lecture hâtive. **Correction du 2026-09-27 :**
1. **PRD §12 Non-goals** : « Recherche textuelle, Mermaid rendu, bouton de copie, **temps de lecture
   calculé** » — le non-goal porte sur le **calcul**, pas sur la valeur éditoriale.
2. **`content-contract.md:55`** : `read` est un `string`, T0 = « non », mais la règle dit « Valeur
   éditoriale facultative ; **aucun calcul automatique T0** ». La cellule et la règle se contredisent.
3. **FR55** : les champs *obligatoires* sont les neuf listés. `read` n'en fait pas partie — ce qui est
   cohérent avec un champ optionnel, pas avec un champ supprimé.
4. **`project-context.md`** : le schéma contient un champ `read` **et il est consommé en production** —
   `app/pages/blog/index.vue:37,39`, `app/pages/blog/[...slug].vue:23` et surtout
   `app/pages/blog/[...slug].vue:115` → `reading_time_est` **dans le JSON-LD `BlogPosting`**.

**Conclusion corrigée :** `read` reste un champ **optionnel et manuel** du schéma T0. Le PRD interdit
de le **calculer** ; le contrat n'interdit pas de le **stocker**. Le retirer casserait une donnée
structurée livrée par l'Epic 12. `image` est dans le même cas : `content-contract.md:54` le marque
T0 = « non », mais sa propre fixture « article sans image » (`:200`) et le rendu en production
(`blog/index.vue:17-20`, `[...slug].vue:220-223,254-255`) impliquent qu'il reste **optionnel**.

⚠️ **Écart 4 — hiérarchie de titres avec saut de niveau, contraire à la convention projet.**

Ligne 9 : `<p className="eyebrow">// ~/blog</p>` · ligne 10 : `<h1>` · ligne 20 : `<h3>` (cartes).

L'outline produite est `h1 → h3`, **saut de niveau**. `project-context.md` § « Hiérarchie de titres &
sémantique de listes (convention story 5.2) » impose : « un libellé de section (eyebrow `// ...`)
qui ouvre une section porte un **`<h2 class="eyebrow">`**, pas un `<p>` — pour un outline
`h1 → h2…` **sans saut** ».

Les stories l'exigent aussi : 16.3 « hiérarchie de titres cohérente », 16.4 « hiérarchie `h1` → `h2`
→ `h3` cohérente, sans saut de niveau », 16.6 « la hiérarchie de titres […] sont validés ».
**La référence viole la convention a11y du projet et échouerait aux AC de ses propres stories.**

⚠️ **Écart 5 — aucun état vide.**

Ligne 15 : `{S.posts.map((p) => (…))}`. Un corpus vide rend **zéro carte et aucun message**.

Le PRD FR-4 exige « `/blog` reste indexable et fonctionne avec un corpus vide grâce à **un état vide
explicite** ». 16.3 porte l'AC « un état vide explicite est affiché, sans erreur de rendu ». La
référence ne le démontre pas. C'est le cas le plus probable de la première exécution réelle, puisque
`content/blog/` ne contient que `.gitkeep`.

⚠️ **Écart 6 — pilier absent de l'affichage.**

Le PRD FR-7 exige que le lecteur voie « le pilier » ; FR-4 exige que « chaque lien interne décrit le
contenu **et son pilier** ». La référence affiche `p.tags` mais **aucun pilier**, ni sur les cartes
ni sur l'article. Les deux exigences sont satisfaites contractuellement mais pas démontrées par la
référence.

⚠️ **Écart 7 — ni fil d'Ariane, ni note de correction, ni distinction des dates.**

- FR-16 exige un **fil d'Ariane** ; la référence propose un bouton de retour, qui n'est pas un fil
  d'Ariane et n'offre ni chemin lisible ni contexte de position.
- FR-3 exige « le lecteur peut distinguer la date de publication de la date de mise à jour lorsque
  les deux existent » ; `post__meta` n'affiche que `p.date` (ligne 45). Cohérent avec le trou FR-3
  identifié en étape 3.

⚠️ **Écart 8 — la référence ignore totalement la matrice de visibilité.**

`Blog.jsx` n'a aucune notion d'état : ni `draft`, ni date future, ni `private`, ni `noindex`, ni
`sitemap: false`. Le CTA commercial (ligne 70) est **inconditionnel**. Le PRD impose une
distinction stricte entre « public mais non découvert » et « absent de production ». Question à
trancher : **le CTA doit-il apparaître sur un article `noindex` ou `sitemap: false` ?** Le PRD ne
répond pas explicitement, et la référence ne pose pas la question.

### Apport de la référence — critères spatiaux exploitables

`project-context.md` (accords rétrospective Epic 11, point 2) exige que les stories UI portent leurs
contraintes de rendu dès la spécification. **Le design courant les fournit**, ce qui comble la
limite relevée dans `epics.md`. Valeurs reprises dans les critères de 16.3 et 16.4 :

| Élément | Valeur du design courant |
| --- | --- |
| Rythme de section | `clamp(80px, 12vh, 150px) 0` |
| Conteneur | `min(1200px, 92vw)` |
| Tête de bloc | `max-width: 720px`, `margin-bottom: var(--space-10)` |
| `h2` de section | `clamp(1.8rem, 3.6vw, 2.75rem)`, `line-height: 1.08` |
| Grille journal | `1.5fr 1fr`, `gap: var(--space-6)`, 1 colonne sous 860 px |
| Média de carte | `aspect-ratio: 16 / 9`, dégradé bas `hsl(319 60% 7% / 0.85)` |
| `h3` de carte | `var(--fs-2xl)`, `line-height: 1.12` |
| `.jrow` | `84px 1fr`, `gap: var(--space-4)`, vignette `aspect-ratio: 1` |
| `.tag` | `var(--radius-pill)`, `3px 10px`, `var(--fs-xs)` |
| Titre de `.jpost` / `.jrow` | **monospace**, `var(--fw-regular)` |

**Application faite le 2026-09-27** dans les stories 16.3, 16.4 et 16.8.

### Reclassement des 8 écarts après correction de la référence

Simon ayant immunosupprimé `Blog.jsx` comme référence, les écarts changent de nature : ceux qui
portaient sur l'**esthétique de la maquette** disparaissent, ceux qui portent sur le **contrat**
subsistent.

| # | Écart | Nature | Statut après correction |
| --- | --- | --- | --- |
| 1 | Lien de retour en `<button>` | **Contrat** — FR-16 | ⚠️ Ouvert, documenté en 16.4 |
| 2 | `alt=""` et images sans dimensions | **Contrat** — FR-9 | ⚠️ Ouvert, documenté en 16.4 et 16.8 |
| 3 | Temps de lecture affiché | **Contrat** — non-goal §12 (calcul), FR55 | ⚠️ **Tranché le 2026-09-27** : `read` reste **optionnel** et **manuel**, aucun calcul automatique. La maquette courante l'affiche (section `#journal`) : ne pas l'implémenter davantage. **Présent aussi en production** (`reading_time_est` dans le JSON-LD) — sa suppression serait une régression SEO. |
| 4 | Saut de titre `h1 → h3` | **Contrat** — convention story 5.2 | ⚠️ Ouvert, documenté en 16.3 et 16.4 |
| 5 | Aucun état vide | **Contrat** — FR-4 | ⚠️ Ouvert, documenté en 16.3 et 16.8 |
| 6 | Pilier non affiché | **Contrat** — FR-4, FR-7 | ⚠️ Ouvert, documenté en 16.3 et 16.4 |
| 7 | Ni fil d'Ariane ni distinction des dates | **Contrat** — FR-16, FR-3 | ⚠️ Ouvert, documenté en 16.4 |
| 8 | CTA inconditionnel, states ignorés | **Décision produit** | 🔴 **Non tranché** — arbitrage Simon requis |

**Constat important :** l'écart 3 (temps de lecture) **existe aussi dans la maquette courante** — le
journal de `Home - Awwwards.html` affiche `${feat.read} de lecture`. Le design actuel propage donc
lui aussi une violation du non-goal PRD §12. Les stories 16.3 et 16.4 l'interdisent explicitement.

**Les 8 écarts restaient valides** : ils sont portée par le contrat (a11y, no-goals, visibility), pas
par l'esthétique de l'ancienne maquette. Seule leur **priorisation** change : ils sont désormais
des critères à respecter dans une composition, et non des corrections par rapport à un écran.

### Alignement UX ↔ Architecture

✅ **RÉALISABLE depuis le 2026-09-27.** `architecture-blog-editorial.md` existe.

Vérification de la compatibilité entre le design courant et l'architecture :

| Besoin UI | Support architectural | Statut |
| --- | --- | --- |
| Tokens du DS | `_root.scss` (`:root`), deux thèmes | ✅ |
| Primitives de layout | `.block` / `.container` / `.block__head` / `.eyebrow` / `.prose` en `_layout.scss` | ✅ |
| Taxonomie `.tag` pil | `--radius-pill`, `--fs-xs` exposés | ✅ |
| Cartes d'articles | §6.3 (composition DS, aucun composant nouveau) | ✅ |
| Frontière hubs / catch-all | AD-05, §5 | ✅ |
| Filtrage avant crawl | AD-06, §5 (`crawlLinks: true`) | ✅ |
| **Thème clair sur `/blog` et `/blog/<slug>`** | Tokens `_root.scss` | ⚠️ Non couvert par la référence — à vérifier au navigateur (16.8) |
| **Page `/blog` et vue article** | §6.2 (routes existantes) | ⚠️ Non maquetées — composition à valider visuellement par Simon |

**Résultat :** l'architecture supporte le design courant sans composant ni dépendance supplémentaire.
Les deux zones non couvertes sont des surfaces **nouvelles**, pas des incompatibilités.

### Warnings

1. ⚠️ **Le design courant ne maquette ni `/blog` ni la vue article.** Elles sont des compositions.
2. ⚠️ **Le thème clair n'est couvert par aucune référence.** Vérification navigateur obligatoire dans
   les deux thèmes (porté par l'AC de 16.8).
3. ⚠️ **La maquette courante propage le temps de lecture**, non-goal PRD §12. Les stories 16.3 et
   16.4 l'interdisent explicitement ; vérifier qu'il n'est pas repris par réflexe visuel.
4. ⚠️ **L'ancien UI kit reste sur disque** et peut induire en erreur. Marqué *superseded* dans
   `project-context.md` (références de revue visuelle) et dans `architecture-blog-editorial.md` §6.3.

---

## Epic Quality Review

Revue conduite de façon autonome contre les standards du workflow `create-epics-and-stories`.

### 1. Structure des epics

| Contrôle | Epic 16 | Epic 17 |
| --- | --- | --- |
| Titre centré utilisateur | 🟡 titre orienté plateforme | ✅ « Publication éditoriale vérifiable » |
| Outcome utilisateur déclaré | ✅ « un lecteur découvre et lit un article fiable, sans voir de contenu brouillon, futur ou privé » | ✅ « Simon publie son premier article réel après revue de preuve » |
| Bénéfice isolable | ✅ démontrable via fixtures T0, sans article réel | ❌ non demonstrated seul |
| Fondation pure (foundation-only) | ✅ non | ✅ non |
| Travail amont surdimensionné | ✅ non (16.1/16.2 petites et parallélisables) | ✅ non |

🟡 **Mineur — le titre de l'Epic 16 est orienté plateforme** (« Plateforme éditoriale durable —
contrat, publication et patrimoine »), ce qui flirte avec les drapeaux rouges du standard
(« Infrastructure Setup »). La valeur portée est pourtant orientée lecteur, et l'outcome est explicite
dans la liste d'epics et la section. **Non bloquant**, mais un titre orienté bénéfice
(« Un blog lisible, daté et vérifiable ») alignerait l'en-tête sur sa propre promesse.

### 2. Indépendance des epics

| Test | Résultat |
| --- | --- |
| Epic 16 peut fonctionner seul | ✅ OUI — fixtures T0 suffisent, aucun contenu réel requis |
| Epic 17 peut fonctionner seul | ❌ NON — requiert Epic 16 vert **et** un article réel existant |
| Epic 16 dépend-il de l'Epic 17 ? | ✅ NON |
| Dépendance circulaire ? | ✅ aucune |

**Conforme.** La dépendance Epic 17 → Epic 16 est **arrière** (sur un epic antérieur), ce qu'interdit
le standard. L'indépendance de l'Epic 16 est le bon choix : elle garantit qu'un lot technique
livrable ne dépend pas d'un contenu qui n'existe pas.

### 3. Qualité des stories

#### 3.A Dimensionnement

| Story | Lignes | Blocs Given | Verdict |
| --- | --- | --- | --- |
| 16.1 | 33 | 3 | ✅ Correct |
| 16.2 | 39 | 6 | ✅ Correct (4 états de visibility + 2 cas limites) |
| 16.3 | 32 | 5 | ✅ Correct |
| 16.4 | 30 | 3 | ✅ Correct |
| 16.5 | 35 | 4 | ✅ Correct |
| **16.6** | **124** | **5** | 🟠 **Surdimensionnée — 3× les autres** |
| 17.1 | 33 | 5 | ✅ Correct |
| 17.2 | 35 | 5 | ✅ Correct |

🟠 **Majeur — la story 16.6 agrège cinq types de travail distincts.** Ses 5 blocs `Given`
correspondent à :

| # | Bloc | Travail | Séparable ? |
| --- | --- | --- | --- |
| 1 | « un checkout local ou une branche QA temporaire » | **Rédaction de 11 fixtures** (auteur de contenu temporaire) | oui |
| 2 | « les fixtures en place » | **Exécution de la gate Docker** | couplé au 1 |
| 3 | « le build statique » | **Inspection de 12 artefacts**, cohérence des dates, budgets AEO | oui |
| 4 | « le serveur de développement » | **Smoke test navigateur** : 4 routes × 2 viewports, a11y, overflow, DS, motion | oui |
| 5 | « le résultat de la gate » | **Rédaction du rapport de preuves** | oui |

Le standard impose des stories « appropriately sized » et classe les stories surdimensionnées en
violation. **Les blocs 1+2 sont légitimement couplés** (il faut des fixtures pour lancer la gate),
mais 3, 4 et 5 sont des travaux indépendants, testables séparément, avec des propriétaires différents :
l'inspection d'artefacts est une revue statique, le smoke test est une revue navigateur, le rapport
est une trace. **Scission recommandée en 16.6 (fixtures + gate Docker) / 16.7 (assertions
artefacts) / 16.8 (revue navigateur + rapport)** — ou, si tu préfères garder le nombre de stories
stable, au minimum expliciter que 16.6 est une story de clôture transverse à effort long.

#### 3.B Critères d'acceptation

**Structure BDD** : 36 blocs `Given`/`When`/`Then` équilibrés sur 8 stories. Aucun bloc sans `Then`
ou `And` (correction déjà appliquée en étape 4 du workflow précédent). Format conforme.

**Testabilité** — 2 AC non vérifiables en l'état :

🟠 **Majeur — 16.5 « aucun événement, propriété ou paramètre de télémétrie n'est ajouté par rapport
à la liste blanche Epic 14 ».** L'AC est correct sur le fond mais **ne pointe pas la source de vérité
alors qu'elle existe** : `docs/specs/spec-analytics-search-console/tracking-plan.md`, désigné comme
« fait foi » par le checkpoint Epic 14. Sans ce chemin, l'agent dev doit deviner l'artefact de
comparaison, et l'AC devient invérifiable. **Correction : ajouter le chemin explicite.**

🟡 **Mineur — 16.2 et 16.3 assertent le comportement « RSS » alors que le RSS est hors périmètre.**
16.2 exige d'exclure l'article « du sitemap, de l'AEO et du RSS » ; or FR-15 est explicitement
« hors première release » et « ne doit pas être ajouté au backlog sans décision explicite ». L'AC ne
peut pas être vérifiée : il n'y a pas de flux RSS dont l'exclusion pourrait être testée. **Correction :
supprimer la clause RSS des AC T0, ou la reformuler explicitement comme « le resolver expose un état
distinct exploitable par un futur flux RSS, sans en créer » — ce qui est vérifiable et préserve la
frontière R1.**

**Complétude des scénarios d'erreur** : 16.1 couvre l'enum invalide, `publishedAt` refusé,
`updated < date`, collision de titre. 16.2 couvre la combinaison d'états inconnue. 16.3 couvre le
corpus vide. 16.4 couvre l'image absente. **Couverture correcte**, y compris les cas limites.

### 4. Analyse des dépendances

#### 4.A Intra-epic

| Story | Dépend de | Type | Verdict |
| --- | --- | --- | --- |
| 16.1 | — | — | ✅ |
| 16.2 | — | — | ✅ |
| 16.3 | 16.1, 16.2 | arrière | ✅ |
| 16.4 | 16.1, 16.2 | arrière | ✅ |
| 16.5 | 16.1→16.4 | arrière | ✅ |
| 16.6 | 16.1→16.5 | arrière | ✅ |
| 17.1 | — | — | ✅ |
| 17.2 | 17.1 | arrière | ✅ |

**✅ Aucune dépendance avant. Vérifié par recherche : 0 occurrence.**

Point de rigueur commendable : 16.3 déclare explicitement que les sections « contenu fondamental »,
« sélection par pilier » et `featured` sont **absentes** en T0. Formuler une contrainte
*négative* évite la dépendance avant déguisée en functionality future — c'est exactement le piège que
le standard cherche.

#### 4.B Création d'entités

| Story | Entité | Verdict |
| --- | --- | --- |
| 16.1 | collection `blog` **étendue** (existe depuis l'Epic 6) | ✅ pas de création en masse |
| 16.2 | resolver **étendu** dans `app/utils/blog-indexability.ts` | ✅ propriétaire unique, pas de doublon |
| 16.3–16.5 | aucune | ✅ |
| 16.6 | fixtures **temporaires** | ✅ non versionnées |
| 17.1 | `editorial-reviews/<slug>.md` créé à la story | ✅ paresseux, pas d'amorce |
| 17.2 | aucune | ✅ |

**✅ Conforme au standard** « chaque story crée ce dont elle a besoin, au moment où elle en a besoin ».
Aucune table ni collection amorcée par avance.

### 5. Contrôles d'implémentation particuliers

#### 5.A Starter template

**Non applicable.** Projet brownfield — pas de clonage ni de configuration initiale. 16.1 démarre par
une extension du schéma existant, pas par une installation. ✅

#### 5.B Indicateurs greenfield vs brownfield

| Attendu brownfield | Présent ? |
| --- | --- |
| Points d'intégration avec systèmes existants | ✅ 16.5 (propriétaires Epic 14, `CNAME`, `_headers`, CI) |
| Stories de migration ou compatibilité | ✅ 16.1 (migration de date, refus de `publishedAt`), 16.4 (enrichissement du `BlogPosting` existant sans second bloc JSON-LD) |
| Pièges du système existant documentés | ✅ `project-context.md` cité dans 16.4 (reset d'ancres `@nuxt/content`) |
| Propriétaires existants préservés | ✅ 16.5 est entièrement dédié à cette invariant |

**✅ Tous les indicateurs brownfield sont couverts.** C'est le point fort de cette décomposition.

### 6. Conformité aux bonnes pratiques

| # | Critère | Epic 16 | Epic 17 |
| --- | --- | --- | --- |
| 1 | L'Epic livre de la valeur utilisateur | ✅ | ✅ |
| 2 | L'Epic fonctionne indépendamment | ✅ | ❌ dépend d'un contenu externe |
| 3 | Stories correctement dimensionnées | 🟠 16.6 surdimensionnée | ✅ |
| 4 | Aucune dépendance avant | ✅ | ✅ |
| 5 | Entités créées quand nécessaire | ✅ | ✅ |
| 6 | Critères d'acceptation clairs | 🟠 1 AC non pointer, 🟡 1 AC hors périmètre | ✅ |
| 7 | Traçabilité FR maintenue | 🟡 double numérotation non projetée | ✅ |

### 7. Défauts par sévérité

#### 🔴 Violations critiques

**Aucune.** Pas d'Epic technique sans valeur, pas de dépendance avant, pas de story ingérable.

#### 🟠 Problèmes majeurs

1. **16.6 surdimensionnée** — 5 types de travail, 124 lignes, 3× les autres stories. Scission en
   16.6 / 16.7 / 16.8 recommandée.
2. **16.5 AC « liste blanche Epic 14 » sans chemin** — l'AC n'est pas vérifiable en l'état ; la
   source existe (`docs/specs/spec-analytics-search-console/tracking-plan.md`).
3. **Double numérotation FR non projetée** — `FR-1`→`FR-18` (PRD) et `FR55`→`FR64` (epics) coexistent
   sans table de correspondance. Un agent lisant 16.1 voit « FR55 » et ne peut pas savoir qu'il
   implémente FR-1 du PRD sans lire la matrice CAP. Défaut de traçabilité, déjà signalé en étape 3.
4. **SM-1 du PRD auto-contradictoire** (étape 3) — déclare T0 vert sur FR-2 et FR-3, qu'aucune
   fixture ne peut valider. Trou de validation.

#### 🟡 Préoccupations mineures

1. ~~**16.2/16.3 assertent le comportement RSS** hors périmètre (FR-15 hors release).~~ ✅ **Résolu**
   le 2026-09-27 : clause RSS retirée, remplacée par une frontière explicite en 16.2 ; FR56 aligné.
2. ~~**16.3 et 16.4 ne référencent pas la référence UX.**~~ ✅ **Résolu** le 2026-09-27 : les trois
   stories référencent `Home - Awwwards.html` avec ses valeurs spatiales et la liste des écarts.
3. **Titre de l'Epic 16 orienté plateforme** alors que sa valeur est lecteur. *Mineur, non traité.*
4. ~~**`epics.md` § « Limites de l'UX Design » affirme qu'aucun document ne couvre le blog.**~~ ✅
   **Résolu** le 2026-09-27 : § réécrit autour du design courant, avec mention explicite que le blog
   n'est pas maquetté et que l'ancien UI kit est *superseded*.
5. **Dette `brownfield.md:60` et `:82`** — périmées depuis le commit `5eba621` et la ratification
   D-08 du 2026-09-26. *Non bloquante, non traitée.*

---

## Summary and Recommendations

### Overall Readiness Status

# 🟢 READY FOR T0 — les 8 stories de l'Epic 16 sont engageables

**Mise à jour du 2026-09-27, après :** production de l'architecture (A1), application des actions 1 à 7,
correction de SM-1 (A3), correction de la référence de design, et **arbitrage D-09 (CTA)**.

Les deux écarts bloquants de l'évaluation initiale sont levés. **Les 8 stories de l'Epic 16 sont
engageables.** Restent deux réserves ouvertes, aucune bloquante pour T0 : le cycle de correction FR-3
(A4, gate E1) et la surface de preview (A5, décision R1).

**Verdict par gate :**

| Gate | Statut | Motif |
| --- | --- | --- |
| T0 / 16.1 (contrat + date) | 🟢 Prêt | Aucune dépendance externe. Chemin de code disjoint, 3 blocs Given, FR vérifiables. |
| T0 / 16.2 (resolver) | 🟢 Prêt | Gouverné par AD-02 et AD-03. Contrainte de sérialisation documentée. |
| T0 / 16.3 (homepage `/blog`) | 🟢 Prêt | Design courant, valeurs spatiales reprises, écarts documentés comme critères. |
| T0 / 16.4 (route article) | 🟢 Prêt | **D-09 tranché** : CTA ⟺ `discoverable`, consigné en AC et en assertions 16.7. |
| T0 / 16.5 (non-régression) | 🟢 Prêt | AC « liste blanche » pointer vers `tracking-plan.md`. |
| T0 / 16.6 (fixtures + gate) | 🟢 Prêt | Rescopée, 3 blocs Given / 30 lignes. |
| T0 / 16.7 (assertions) | 🟢 Prêt | Scindée. Porte désormais les assertions de D-09. Seule preuve de cohérence inter-couches. |
| T0 / 16.8 (revue navigateur) | 🟢 Prêt | Scindée. Autorité visuelle à Simon, deux Themes contrôlés. |
| E1 / 17.1, 17.2 | ⚪ Prérequis non levés | Article réel inexistant (`content/blog/` = `.gitkeep`), cycle de correction FR-3 sans story (A4). |

**Séquencement d'attaque :** 16.1 et 16.2 en parallèle (chemins de code disjoints), puis 16.3 et 16.4,
puis 16.5, puis 16.6, puis 16.7 et 16.8 en parallèle.

### Critical Issues Requiring Immediate Action

**A1 — ✅ RÉSOLU le 2026-09-27.** `architecture-blog-editorial.md` produit et rattaché à l'Epic 16.
Contraintes résolues : signature et emplacement du resolver (AD-02, AD-03, §2, §4), frontière hubs /
catch-all (§5), modèle de déploiement (§8), catalogue DS (§6.3). Deux contraintes d'architecture non
documentées jusqu'ici ont été mises au jour : la duplication délibérée du prédicat d'indexabilité et
le champ `sitemapExcluded` mort.

**A2 — ✅ RÉSOLU le 2026-09-27.** Les 8 écarts sont traités. Après correction de la référence de
design, les écarts 1 à 7 sont des **critères documentés dans les stories** (lien de retour en
`NuxtLink`, `alt` et dimensions, état vide, pilier, fil d'Ariane, distinction des dates, interdiction
du temps de lecture). L'écart 8, le CTA, a été **arbitré par Simon le 2026-09-27** et inscrit comme
**décision D-09** : le CTA s'affiche si et seulement si l'article est `discoverable`.

**A3 — ✅ RÉSOLU le 2026-09-27.** SM-1 corrigé dans le PRD : T0 valide désormais `FR-1, FR-3 (contrat
de date uniquement), FR-4, FR-7, FR-12 à FR-14, FR-16, FR-17`. **FR-2 relève de SM-E1**, et le cycle de
correction de FR-3 est rattaché à E1. La note de correction documente l'auto-contradiction, la
correction et la réserve de couverture résiduelle. L'hypothèse « Epic 14 stabilisé » est marquée
satisfaite.

**A4 — 🆕 OUVERT le 2026-09-27.** La correction de SM-1 a révélé que **le cycle de correction de FR-3
n'a pas de story porteuse** : ni la rétractation (note publique, retrait ou 404/410), ni le renommage
de slug (route nouvelle, redirection, mise à jour sitemap/AEO, test de liens). SM-1 et SM-E1
référencent désormais ces branches, donc la gate E1 ne pourra pas les valider. À arbitrer : story
dédiée dans l'Epic 17, ou rattachement à la story 17.2.

**A5 — 🆕 OUVERT le 2026-09-27.** **La surface de preview n'existe nulle part.** Le PRD (l. 144) exige
que sa politique soit explicite, `content-contract.md` la liste 3 fois, `brownfield.md:56` dit qu'elle
« doit être écrite avant d'ajouter une surface de lecture supplémentaire », et **aucune story ne
l'implémente**. D-09 en règle le CTA par extension — un brouillon n'étant pas `discoverable`, sa
preview n'afficherait pas le CTA — mais **construire la preview reste une décision R1 non prise**.
Non bloquant pour T0, puisque T0 ne construit aucune surface de lecture supplémentaire.

### Recommended Next Steps

**Actions 1 à 7 — ✅ APPLIQUÉES le 2026-09-27.**

1. ✅ Scission de 16.6 en 16.6 (fixtures + gate Docker) / 16.7 (assertions artefacts) /
   16.8 (revue navigateur + rapport).
2. ✅ AC de 16.5 pointer vers `docs/specs/spec-analytics-search-console/tracking-plan.md`.
3. ✅ Clause RSS retirée des AC de 16.2, remplacée par une frontière explicite ; FR56 aligné.
4. ✅ Valeurs spatiales du design **courant** reportées dans les critères de 16.3 et 16.4 (10 valeurs
   pour 16.3, 7 pour 16.4), extraites de `Home - Awwwards.html` et non de l'ancien UI kit.
5. ✅ `Home - Awwwards.html` référencé dans 16.3, 16.4 et 16.8, avec la liste des écarts à ne pas
   reproduire et la mention que le blog n'est pas maquetté.
6. ✅ Table de correspondance PRD → epics ajoutée à `epics.md`, avec les réserves FR-2 et FR-3 tracées.
7. ✅ § « Limites de l'UX Design » corrigé : il affirmait à tort qu'aucun document ne couvre le blog.
8. ✅ `architecture-blog-editorial.md` produit et rattaché à l'Epic 16.

**Actions 8 à 10 — ✅ APPLIQUÉES le 2026-09-27.**

8. ✅ **Référence de design corrigée** : `Home - Awwwards.html` (design courant) remplace `Blog.jsx`
   dans les stories 16.3, 16.4, 16.8, dans `architecture-blog-editorial.md` §6.3 et dans
   `project-context.md`. L'ancien UI kit est marqué *superseded*.
9. ✅ **Valeurs spatiales réécrites** depuis le design courant (rythme de section, conteneur, `h2` de
   section, grille journal, `aspect-ratio: 16/9`, `.tag` pil) et non plus depuis l'ancien kit.
10. ✅ **SM-1 corrigé** dans le PRD (A3), avec note de correction et réserve de couverture.

**Restant à faire :**

11. **Créer le fichier story de 16.2 à 16.8** via `[CS]` — seul 16.1 existe. Un agent dev ne peut pas
    travailler une story sans son fichier.
12. **Arbitrer le cycle de correction de FR-3** (A4) — story dédiée dans l'Epic 17, ou rattachement à
    17.2. Bloque la gate E1, pas T0.
13. **Dette `brownfield.md:60` et `:82`** — données périmées depuis le commit `5eba621`.
14. **Cellules « T0 = non » de `content-contract.md:54-55`** (`image`, `read`) — contredites par la
    fixture « article sans image » et par le rendu en production. Correction de contrat, non bloquante.
15. **Renommer l'Epic 16** vers un titre orienté bénéfice (mineur).

### Final Note

Cette évaluation a identifié **22 problèmes** répartis en **5 catégories** : 1 écart bloquant de
document (architecture absente), 8 écarts UX, 2 exigences partiellement couvertes, 4 problèmes
majeurs de qualité, 7 préoccupations mineures. **Aucune violation critique** de la
`create-epics-and-stories` n'a été trouvée.

La décomposition des epics n'est pas en cause : elle est complète, traçable et correctement
séquencée. Ce qui manque est le socle architectural, et le fait que la seule référence visuelle
disponible encode six défauts que les stories ont précisément pour mission d'interdire.

**Séquence recommandée :** traiter les actions 1 à 7 (mécaniques, une seule passe d'édition sur
`epics.md`), produire l'architecture, trancher les 8 écarts UX, puis `[CS] bmad-create-story` sur
16.1. La story 16.1 peut être créée dès maintenant — elle ne dépend d'aucun des correctifs ci-dessus.

---

*Évaluation conduite le 2026-09-27 par bmad-check-implementation-readiness, périmètre Epic 16/17.*
*Sources : PRD `prd-jouan.ovh-2026-09-24` (743 lignes), `epics.md` (1 925 lignes, 17 epics / 69
stories), SPEC + 5 companions `spec-blog-editorial/`, `epic-14-checkpoint-2026-09-25.md`,*
*`sprint-change-proposal-2026-09-25.md`, `project-context.md`, design courant*
*`ui_kits/jouan-site/Home - Awwwards.html` (section `#journal`), ancien UI kit `Blog.jsx` (superseded,
analysé puis écarté).*

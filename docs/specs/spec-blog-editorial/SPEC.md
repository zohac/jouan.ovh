---
id: SPEC-blog-editorial
status: controlled-revision
updated: 2026-09-25
companions:
  - brownfield.md
  - content-contract.md
  - verification-plan.md
  - architecture-diagrams.md
  - ../../project-context.md
  - ../../implementation-artifacts/investigations/blog-editorial-brief-investigation.md
  - ../../implementation-artifacts/14-5-migration-stack-nuxt-seo-sitemap-robots-site-config.md
  - ../../implementation-artifacts/14-6-aeo-ai-ready-llms-markdown-oai-searchbot.md
  - ../../planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md
  - ../../planning-artifacts/sprint-change-proposal-2026-09-25.md
sources: []
---

> **Contrat canonique révisé.** Cette SPEC, révisée le 2026-09-25 après approbation de la proposition de changement de sprint, et les fichiers listés dans `companions:` constituent le contrat de référence pour la conception, l'implémentation et la validation du blog. La révision est contrôlée : elle introduit les gates T0/E1/R1 et ne remplace pas silencieusement le brownfield.

# Blog éditorial durable — contrat, publication et patrimoine

## 1. Pourquoi ce changement

Le blog de `jouan.ovh` doit devenir la source principale des expériences techniques de Simon Jouan, sans transformer le site en usine SEO ni dupliquer l'infrastructure existante. L'opportunité est d'associer expertise, audience et business autour de systèmes IA, software engineering et automatisation métier, tout en préservant la direction terminale, la génération statique et les propriétaires SEO/AEO déjà en place.

Le changement est brownfield : le blog de base, les routes Content, le design system, les propriétaires SEO/AEO, la CI et le déploiement GitHub Pages existent déjà. Le nouveau lot construit une boucle éditoriale fiable ; il ne crée ni CMS, ni base de données, ni propriétaire concurrent.

## 2. Modèle de livraison

### T0 — Préparation technique

T0 établit le contrat minimal, la résolution déterministe, `/blog`, une route article, la non-régression de la homepage, les exclusions, les artefacts SEO/AEO existants, la validation responsive/a11y et la gate Docker. Une fixture locale/QA peut valider T0 ; elle ne démontre pas l'autorité éditoriale.

### E1 — Lancement éditorial

E1 exige un article réel nommé, la checklist de preuve FR-18, une promotion contrôlée, des probes post-déploiement et un résultat de publication documenté. Une fixture ne satisfait pas E1. Si aucun article réel ne passe la revue, T0 peut rester livrable mais E1 reste explicitement en attente.

### R1 — Roadmap conditionnelle

R1 contient les hubs, related, l'enrichissement auteur/projet, l'AEO étendu, le RSS, la curation `featured`, la navigation principale et les nouveaux événements analytics. Chaque capacité R1 possède son propre contrat, propriétaire, fixture, assertion et définition de terminé.

## 3. Capacités

- id: CAP-1
  phase: T0 + E1
  intent: Le système peut publier des articles Markdown structurés avec un pilier principal, un format, des métadonnées minimales et une preuve éditoriale validée.
  success: T0 valide le contrat minimal et les exclusions ; E1 valide un article réel avec FR-18, une promotion contrôlée et des sorties publiques cohérentes. Une fixture invalide échoue de manière contrôlée et un brouillon n'est jamais public.

- id: CAP-2
  phase: T0
  intent: Un visiteur peut comprendre la promesse éditoriale et découvrir les trois derniers articles publics depuis une homepage `/blog` véritable.
  success: `/blog` rend la promesse, l'empty state et les trois derniers articles publics triés par date décroissante ; les contenus fondamentaux, sélections et curation `featured` sont différés à R1 tant que leur source de vérité n'est pas définie.

- id: CAP-3
  phase: R1
  intent: Un visiteur peut explorer une expertise éditoriale stable via les hubs `/blog/ia`, `/blog/engineering` et `/blog/automatisation`.
  success: Les trois hubs sont des pages Vue statiques indexables, sans affecter le catch-all article, avec recommandations, contenus récents, contextes projet publics et navigation croisée. Chaque hub a son propre contrat de route, SEO, sitemap et precedence.

- id: CAP-4
  phase: T0 + R1
  intent: Un lecteur peut comprendre un article avec auteur, dates, pilier, format et sources ; les articles liés et le contexte projet sont des extensions conditionnelles.
  success: T0 rend les métadonnées disponibles, une prose/code responsive et une navigation auteur/pilier ; R1 rend des related publics, contextualisés et filtrés avant crawl ainsi qu'un contexte projet autorisé.

- id: CAP-5
  phase: T0 non-régression + R1
  intent: Les surfaces auteur et projet peuvent exposer les contenus publics associés sans dupliquer l'identité de Simon ni exposer de données privées.
  success: `/about` reste l'URL auteur canonique et les contenus publics respectent le contrat ; l'enrichissement auteur et les relations projet n'ouvrent qu'après confirmation d'ID public, destination et frontière de vie privée.

- id: CAP-6
  phase: T0 + E1 + R1
  intent: Le système distingue publication, indexabilité, prévisualisation, visibilité privée, `noindex`, `robots: false` et exclusion sitemap.
  success: La matrice états × surfaces × codes HTTP est unique pour les pages, listes, Markdown, sitemap, AEO, related et RSS éventuel ; aucune surface ne résout un état différent.

- id: CAP-7
  phase: T0 non-régression + R1
  intent: Le système distribue les articles avec les métadonnées SEO, Schema.org et AEO existants, puis peut ajouter une distribution RSS approuvée.
  success: T0 ne crée pas de second propriétaire et n'ajoute pas de nouveau champ AEO ; R1 ne peut étendre les sorties ou ajouter RSS qu'après allow-list, owner, path, MIME, exclusions et assertions.

- id: CAP-8
  phase: T0
  intent: L'expérience blog préserve le design system approuvé, l'accessibilité, le responsive, le contraste forcé et la réduction de mouvement.
  success: Les contrôles desktop/mobile montrent les tokens existants, une hiérarchie de titres cohérente, des focus visibles, du code lisible sans overflow horizontal et le respect des préférences système.

- id: CAP-9
  phase: T0 + E1 + R1
  intent: L'équipe valide chaque évolution avec une gate reproductible, des fixtures temporaires et une preuve de publication traçable.
  success: T0 est verte avec fixtures nettoyées ; E1 est verte avec article réel, FR-18, promotion et probes ; R1 possède une gate dédiée par capacité.

## 4. Contraintes

- Le site reste Nuxt 4 + `@nuxt/content` v3, statique via `nuxi generate`, déployé sur GitHub Pages ; le développement et les commandes pnpm passent uniquement par Docker.
- Les routes, helpers, SEO et propriétaires sitemap/robots/AEO existants restent la base ; aucun second propriétaire de `/sitemap.xml`, `/robots.txt`, du canonical ou du JSON-LD article n'est créé.
- En T0, `date` est l'unique champ de publication, au format `YYYY-MM-DD`, avec sémantique Europe/Paris et `updated >= date` lorsqu'il est présent. `publishedAt` est refusé dans T0 et ne pourra revenir que par une migration versionnée et atomique.
- Chaque article possède exactement un pilier ; `pillar` et `format` utilisent les enums machine de `content-contract.md`. `goals` est optionnel et interne en T0.
- L'URL article reste stable sous `/blog/<slug>` ; le pilier ne fait pas partie de l'URL article. Les hubs sont des routes Vue dédiées et ne sont pas des documents Content ordinaires.
- `/about` est l'URL auteur canonique de T0 et R1. Aucun alias `/a-propos`, override SEO imbriqué ou changement de politique trailing-slash n'est ajouté dans T0 sans décision et probe.
- `visibility: private` est distinct de `noindex`, `robots: false` et `sitemap: false/null`. Un article privé n'a pas de HTML public ; une exclusion sitemap n'est pas une instruction de confidentialité.
- `project` et `related` sont des capacités R1. T0 ne lookup pas de projet ni ne rend de related ; R1 définit les IDs, destinations, tie-breaks et filtrage avant crawl.
- Aucun nouvel événement, propriété, paramètre analytics ou intégration tierce n'est ajouté en T0. Les propriétaires analytics existants restent soumis à leur consentement et à leur liste blanche Epic 14.
- La chaîne éditoriale interdit les scripts, trackers, images distantes, iframes et ressources réseau non approuvés ; liens, licences, secrets et paramètres URL sont vérifiés.
- L'interface et le contenu restent en français, à la première personne pour Simon, avec vouvoiement et sans emoji.
- Les brouillons, contenus futurs et contenus privés ne sont pas distribués dans les surfaces publiques définies. La matrice de visibilité est la source unique de vérité.
- Aucun framework de test n'est ajouté uniquement pour ce blog ; la validation s'intègre à la gate et aux assertions CI existantes.
- Le design system approuvé au checkpoint Epic 14 est réutilisé sans migration de thème. La documentation de planning qui contredit ce baseline est supersédée, pas réinterprétée silencieusement.
- Aucune promesse de classement, de trafic, de citation par un agent IA ou de conversion n'est déduite de `llms.txt`, du RSS ou du SEO.

## 5. Non-goals

- CMS externe, headless CMS, base de données éditoriale, espace membre, commentaires ou newsletter.
- Génération automatique d'articles, contenu fictif, métriques inventées ou réutilisation de fixtures comme contenu public.
- Recherche sémantique, indexation vectorielle, recommandation IA ou moteur de recherche externe dans ce lot.
- Refonte globale du design system, changement de thème, nouveau langage de programmation ou nouvelle librairie UI.
- Recherche textuelle, Mermaid rendu, bouton de copie, temps de lecture calculé, pages de tags, interface de séries, archive et autres options P2 tant qu'elles ne sont pas explicitement ré-ouvertes.
- Création de pages projet détaillées ou de collections auteurs/projets autonomes sans décision de produit séparée.
- Nouveaux événements analytics, nouvelle télémétrie ou nouvelle intégration de sortie réseau dans T0.

## 6. Signal de succès

### T0 — Préparation technique

- Le contrat minimal, le resolver, `/blog`, une route article et la homepage sont non régressifs.
- Les fixtures couvrent les états ratifiés de publication, brouillon, futur, `private`, `noindex`, `robots: false` et `sitemap: false/null`.
- La gate Docker, les assertions statiques, la revue navigateur/a11y et l'inspection des artefacts passent.
- Les fixtures sont supprimées et aucun artefact de fixture n'est déployé en production.

### E1 — Lancement éditorial

- Un article réel nommé passe la checklist FR-18 et sa version de contenu.
- La publication est promotionnée de façon contrôlée, puis les probes HTTP et artefacts publics sont verts.
- Le parcours réel `/` → `/blog` → `/blog/<slug>` est démontré, sans article non public ni relation non autorisée.

### R1 — Roadmap

- Chaque capacité R1 possède une décision, un owner, une fixture, une assertion, une gate et une preuve de non-régression.
- Les hubs, related, projets, AEO étendue, RSS, analytics et curation ne sont pas ajoutés implicitement à T0 ou E1.

## 7. Hypothèses et provenance

- `SITE.profile` reste la source de vérité de l'auteur unique Simon Jouan ; aucune collection auteurs parallèle n'est nécessaire.
- `SITE.projects` reste la source partagée ; aucun ID public n'est inventé avant la décision R-03.
- Le corpus réel sera alimenté par les articles de Simon ; les quatre fichiers de démonstration restent des drafts ou fixtures non versionnées.
- Le chemin RSS proposé est `/rss.xml`, mais son inclusion reste conditionnée à R-05.
- Le projet reste propriétaire du domaine et du déploiement ; aucune URL de production n'est codée en dur.
- La priorité `autorité technique > audience qualifiée > support commercial` et la méthode Fast path sont consignées dans le PRD et son decision log.
- Les sources de recherche sont des observations, pas des exigences ; le brief original sera versionné comme source produit avant clôture de la SPEC.

## 8. Matrice de traçabilité

| CAP | Phase principale | FR blog | Gate de preuve |
| --- | --- | --- | --- |
| CAP-1 | T0/E1 | FR-1 à FR-3, FR-18 | Contrat, checklist versionnée, publication réelle |
| CAP-2 | T0 | FR-4 | `/blog`, empty state, trois derniers publics, homepage non régressive |
| CAP-3 | R1 | FR-5 | Routes Vue, precedence, SEO/sitemap dédiés |
| CAP-4 | T0/R1 | FR-6 à FR-9 | Article responsive ; related filtré avant crawl en R1 |
| CAP-5 | R1 | FR-10, FR-11 | ID/destination projet autorisés, auteur canonique |
| CAP-6 | T0/E1/R1 | FR-12 | Matrice états × surfaces × HTTP |
| CAP-7 | T0/R1 | FR-13 à FR-15 | Owners SEO/AEO existants ; allow-list avant R1 |
| CAP-8 | T0 | FR-16, FR-9 | Browser desktop/mobile, clavier, forced-colors, reduced-motion |
| CAP-9 | T0/E1/R1 | FR-17, FR-18 | Docker, fixtures, probes, rollback et rapports |

## 9. Décisions de phase

| ID | Décision | Statut de planification |
| --- | --- | --- |
| D-01 | `date` seul en T0 ; alias futur versionné | Ratifié T0 ; story schéma bloquée jusqu'à migration ratifiés |
| D-02 | `visibility: private` séparé de l'indexabilité | Ratifié T0 ; stories de visibility bloquées jusqu'à ratification des fixtures |
| D-03 | `usePageSeo`/`useSiteUrl`, `/about`, self-canonical, aucun alias/trailing-slash nouveau en T0 | Ratifié T0 ; probe requis |
| D-04 | FR-18 versionné et lié au hash du contenu | Ratifié E1 ; publication réelle bloquée sans pass |
| D-05 | Promotion contrôlée et probe post-déploiement | Ratifié E1 |
| D-06 | Supply chain, secrets, licences et réseau tiers contrôlés | Ratifié T0 |
| D-07 | Aucun nouvel analytics en T0 | Ratifié T0 ; liste blanche Epic 14 requise |
| D-08 | Design system approuvé et navigation homepage/footer seulement en T0 | En attente du checkpoint Epic 14 |
| R-01 à R-07 | Hubs, related, projet, AEO étendue, RSS, champs optionnels, navigation/analytics | Reportés, non bloquants pour T0/E1 |

## 10. References

- PRD : `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md`
- Contrat : `content-contract.md`
- Vérification : `verification-plan.md`
- Architecture : `architecture-diagrams.md`
- Brownfield : `brownfield.md`
- Investigation : `../../implementation-artifacts/investigations/blog-editorial-brief-investigation.md`
- Proposition de sprint : `docs/planning-artifacts/sprint-change-proposal-2026-09-25.md`

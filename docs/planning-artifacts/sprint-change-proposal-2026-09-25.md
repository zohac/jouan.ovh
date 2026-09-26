---
title: "Sprint Change Proposal — Plateforme éditoriale durable"
status: approved-applied
implementation_status: ready-for-story-decomposition
created: 2026-09-25
updated: 2026-09-26
scope: major
trigger: "Évolution du blog brownfield vers une plateforme éditoriale durable, avec sequencing à corriger autour d'Epic 6 et d'Epic 14"
---

> **Mise à jour après la rétrospective Epic 14 (2026-09-25) puis ratification du point de contrôle (2026-09-26) :** les six tâches de l'Epic 14 sont terminées, la rétrospective est enregistrée, le point de contrôle est ratifié (`stabilisation: ratifiée`) et les huit réserves sont acceptées et suivies. Les tableaux et décisions ci-dessous conservent l'instantané de la proposition ; l'Epic 16 peut désormais passer en décomposition de stories T0.

# Proposition de changement de sprint — Plateforme éditoriale durable

## 1. Issue Summary

### 1.1 Déclencheur

Le blog brownfield existant ne peut pas recevoir simplement une nouvelle taxonomie et quelques champs. Le brief initial et la SPEC `docs/specs/spec-blog-editorial/SPEC.md` demandent une infrastructure éditoriale durable autour de trois piliers : systèmes IA, software engineering et automatisation métier.

Le PRD de référence est actuellement :

`docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md`

Il distingue désormais une préparation technique T0, un lancement éditorial E1 et une roadmap R1. Il reste volontairement en `draft` jusqu'à ratification des contrats et du checkpoint Epic 14.

### 1.2 Problème précis

Le planning ne représente pas cette nouvelle capacité :

- Epic 6 ne couvre que l'index, l'empty state et la lecture prose/code ;
- Epic 14 possède encore les surfaces partagées SEO, AEO, vie privée, consentement et analytics ;
- aucune unité de planning ne porte le contrat éditorial, la migration, la matrice de visibilité, la preuve, les corrections, la publication contrôlée et la roadmap ;
- la SPEC, ses companions, le PRD et le plan de vérification ne partagent pas encore une définition unique de `release`.

### 1.3 Preuves

- `docs/planning-artifacts/epics.md:569-598` décrit le périmètre historique d'Epic 6.
- `docs/implementation-artifacts/sprint-status.yaml:84-88` indique qu'Epic 6 est encore `in-progress` malgré ses stories terminées.
- `docs/implementation-artifacts/sprint-status.yaml:148-156` indique qu'Epic 14 est encore en cours avec 14.1, 14.2 et 14.6 non stabilisées.
- `docs/specs/spec-blog-editorial/SPEC.md:85-111` conserve un signal de succès plus large que la première livraison T0 proposée par le PRD.
- `docs/specs/spec-blog-editorial/verification-plan.md:12-43` ne sépare pas les fixtures et assertions T0/E1/R1.
- `docs/implementation-artifacts/investigations/blog-editorial-brief-investigation.md:227-243` documente les collisions de routes, exclusions et risques de fuite.
- `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/review-adversarial-current.md:30-160` identifie les contrats encore bloquants.

## 2. Impact Analysis

### 2.1 Epic impact

| Epic | État actuel | Impact | Décision proposée |
| --- | --- | --- | --- |
| Epic 1, 2, 3, 4, 5, 7, 8 | `in-progress` incohérent ; stories et rétrospectives terminées | Dette de statut historique sans impact produit | Passer à `done` sans réécrire les critères |
| Epic 6 | `in-progress` incohérent ; 6.1, 6.2 et rétrospective terminées | Ne peut pas absorber la nouvelle plateforme | Passer à `done`, préserver les stories comme baseline historique, ne pas ajouter de stories |
| Epic 11 | Terminée | La homepage consomme déjà les derniers articles publics | Ajouter la non-régression à Epic 16 ; ne pas rouvrir 11.4 |
| Epic 13 | Terminée | Le planning contient encore des formulations dark-only contradictoires | Marquer les anciens critères comme supersédés ; ne pas rouvrir Epic 13 |
| Epic 14 | `in-progress` au moment de la proposition ; 14.1 active, 14.2/14.6 en revue | Propriétaire des surfaces SEO/AEO/vie privée partagées | Terminer le point de contrôle avant toute implémentation Epic 16 |
| Epic 16 | Absente | Aucun epic ne représente le déclencheur | Créer `epic-16: backlog`, sans story d'implémentation |

### 2.2 Story impact

- `6-1-index-du-blog-et-empty-state` et `6-2-vue-article-prose-et-code` restent terminées et inchangées.
- `11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion` reste terminée ; Epic 16 reprend son obligation de non-régression.
- `14-1`, `14-2` et `14-6` doivent être réconciliées avant le checkpoint.
- `14-3` reste terminé ; les événements existants sont hérités mais aucun nouvel événement blog n'est requis en T0.
- `14-4` reste terminé mais ses critères d'URL et de handlers manuels sont supersédés par 14.5.
- `14-5` reste terminé et devient le propriétaire à consommer pour Site Config, canonical, sitemap et robots.
- `14-6` reste en revue jusqu'à ratification de son baseline AEO ; T0 ne crée pas de nouvelle projection de champ.

### 2.3 Artifact conflicts

| ID | Artefacts | Conflit | Alignement proposé |
| --- | --- | --- | --- |
| BE-001 | PRD, SPEC, content-contract, diagrams, verification-plan | T0/E1/R1 du PRD contredit le signal de succès global de la SPEC | Réviser la SPEC comme révision contrôlée avec phases par capacité |
| BE-002 | PRD, SPEC, verification-plan | FR-7, FR-17 et SM-1 ne tracent pas complètement les phases | Ajouter une matrice CAP → FR → phase → fixture → assertion |
| BE-003 | PRD, SPEC, content-contract, investigation | `date` seul en T0 vs `publishedAt` alias ouvert | Fixer `date` seul en T0 ; migration future versionnée et atomique |
| BE-004 | PRD, SPEC, content-contract, verification-plan, investigation | `visibility: private` n'existe pas dans le contrat ; robots et sitemap sont ambigus | Ajouter `visibility`, matrice exhaustive états × surfaces × codes HTTP et fixtures dédiées |
| BE-005 | PRD, SPEC, content-contract, verification-plan, investigation | Canonical, `/about`, overrides SEO et trailing-slash non fermés | T0 réutilise `usePageSeo()`/`useSiteUrl()`, `/about`, self-canonical ; aucun override ou alias nouveau |
| BE-006 | PRD, SPEC, content-contract, diagrams, verification-plan, investigation | FR-7 inclut le projet en T0 alors que FR-11 est R1 | T0 n'accepte le projet que comme champ interne sans lookup, ou le retire du schéma minimal ; R1 décide de l'ID et de la destination |
| BE-007 | PRD, SPEC, content-contract, diagrams, verification-plan, investigation | Related en R1 mais présent dans les gates actuelles | Aucun rendu related en T0 ; R1 définit resolver, tie-breaks, invalidation et pré-crawl filtering |
| BE-008 | PRD, SPEC, content-contract, verification-plan | RSS conditionnel mais certaines matrices l'impliquent | Marquer toutes les cellules RSS `si approuvé` et sortir la gate RSS de T0 |
| BE-009 | PRD, SPEC, verification-plan, investigation, project-context | Dark-first du contexte vs formulations clair/sombre | Valider le baseline au checkpoint Epic 14 et supprimer les critères visuels contradictoires |
| BE-010 | PRD, SPEC, verification-plan | Analytics sans contrat explicite | Ajouter liste blanche, no-diff et test de consentement en T0 ; enhancements en R7 |
| BE-011 | PRD, verification-plan, investigation, project-context | Plan de vérification sans gates de phase | Réécrire le plan en T0, E1 et R1 avec assertions rattachées aux FR |
| BE-012 | PRD, SPEC, content-contract | `goals` obligatoire dans le companion mais facultatif en T0 ;.updated absent du minimal | Valider `goals` seulement s'il est présent ; ajouter `updated >= date` ; documenter l'unicité globale T0 puis par hub en R1 |

### 2.4 Technical impact

- Le premier lot ne doit pas créer de CMS, base de données, route dynamique runtime ou dépendance lourde.
- Le propriétaire de la résolution doit être partagé entre `/`, `/blog`, l'article, les exclusions, les fixtures et les artefacts de distribution.
- `usePageSeo()`, Site Config, Sitemap, Robots, AI Ready et le workflow CI restent les propriétaires existants.
- Les hubs Vue ne sont pas dans T0 ; lorsqu'ils seront ouverts, ils devront être des routes dédiées et réservées.
- Les fixtures sont locales/QA/CI, jamais versionnées ni déployées en production.
- La promotion d'un article réel exige un artefact statique vérifié, une promotion contrôlée et un probe post-déploiement.

## 3. Recommended Approach

### 3.1 Options évaluées

#### Option 1 — Direct Adjustment Epic 6

**Non viable.** Epic 6 est terminé et son périmètre historique ne contient ni migration, ni visibility, ni FR-18, ni publication contrôlée. L'étendre créerait une dépendance cachée et réécrirait des critères terminés.

#### Option 2 — Rollback Epic 14

**Non viable à la date de la proposition.** Epic 14 était alors en review. Un rollback supprimerait des propriétaires SEO/AEO/privacy nécessaires et ne résoudrait pas le manque de planning éditorial.

#### Option 3 — MVP Review et replan Epic 16

**Viable et recommandé.**

- Epic 16 devient l'unité de planning backlog.
- T0 couvre la préparation technique et la non-régression.
- E1 couvre l'article réel, FR-18, la promotion contrôlée et le probe.
- R1 couvre les capacités conditionnelles.
- Les contrats canoniques sont mis à jour avant toute story.
- Le tracker ne reçoit pas de story d'implémentation avant le checkpoint Epic 14 et la ratification D-01 à D-08.

### 3.2 Séquencement recommandé

| Ordre | Action | Condition de sortie |
| ---: | --- | --- |
| 0 | Corriger le statut hygiene d'Epic 6 | Epic 6 `done`, stories terminées préservées |
| 1 | Stabiliser Epic 14 | 14.1 réconciliée, 14.2/14.6 revues terminées, checkpoint enregistré |
| 2 | Réviser SPEC et companions | T0/E1/R1, visibility matrix, date, goals, canonical, analytics et traçabilité FR alignés |
| 3 | Enregistrer Epic 16 en backlog | Aucun story d'implémentation créé |
| 4 | Préparer le premier lot Epic 16 | Résolver, contrat minimal, migration, `/blog`, article, homepage et non-régression |
| 5 | Exécuter T0 | Docker, fixtures nettoyées, navigateur/a11y et artefacts statiques verts |
| 6 | Exécuter E1 | Article réel, FR-18, promotion contrôlée et probes verts |
| 7 | Ouvrir R1 par tranche | Chaque capacité roadmap a son propre contrat, propriétaire et gate |

## 4. Detailed Change Proposals

### 4.1 PRD

**Sections concernées :** §0, FR-1, FR-6 à FR-9, FR-12 à FR-18, §13, §14, §15.

**OLD :** le PRD présentait les capacités larges comme un MVP unique et laissait les contrats de publication, de migration et de distribution ambigus.

**NEW :**

- ajouter le bloc de décision T0/E1/R1 ;
- séparer la préparation technique de la publication éditoriale ;
- traiter les hubs, related, projets, AEO étendue, RSS, analytics et curation comme roadmap ;
- maintenir le statut `draft` jusqu'à ratification ;
- conserver le registre D-01 à D-08.

**Justification :** le PRD devient une proposition de révision contrôlée, sans contredire silencieusement la SPEC.

### 4.2 SPEC et companions

**OLD :** une seule définition de release et des signaux de succès non segmentés.

**NEW :**

- ajouter les phases T0/E1/R1 aux capacités ;
- aligner date, visibility, canonical, goals, related, projet, RSS, analytics et thème ;
- ajouter la matrice CAP → FR → phase → fixture → assertion ;
- mettre à jour les diagrams de resolver et de visibility.

**Justification :** les agents de développement, UX et architecture travailleront depuis un contrat unique.

### 4.3 Verification plan

**OLD :** les fixtures related/projet/hub et les probes de production sont applicables à chaque story.

**NEW :**

- T0 : contrat minimal, visibility, `/blog`, article, homepage, non-régression SEO/AEO, responsive, clavier, a11y et fixtures nettoyées ;
- E1 : article réel, FR-18, promotion contrôlée, probes HTTP, rollback et takedown ;
- R1 : une gate par capacité roadmap ;
- matrice champ → propriétaire → sortie autorisée → assertion CI.

**Justification :** le plan ne réimporte plus R1 dans T0 et protège la production.

### 4.4 Planning

**OLD :** Epic 6 obsolète `in-progress`, Epic 14 non stabilisé, aucun Epic 16.

**NEW :**

- Epic 6 `done` ;
- Epic 14 checkpoint ;
- Epic 16 `backlog` ;
- supersédés dark-only et manual SEO criteria ;
- homepage non-regression dans Epic 16.

### 4.5 Opérations

**OLD :** rollback et takedown étaient une procédure générale.

**NEW :**

- retour arrière éditorial pour régression de route/contenu/SEO ;
- takedown confidentialité/sécurité pour secret, donnée personnelle ou dépendance compromise ;
- révocation des secrets, purge des artefacts contrôlés, 404/410, demande de retrait aux tiers et preuve ;
- dernier commit et artefact statique validés identifiés avant promotion ;
- probe post-déploiement obligatoire avant clôture E1.

## 5. Implementation Handoff

### 5.1 Classification

**Major** : changement de planning fondamental et réécriture de la source canonique avant implémentation.

### 5.2 Responsabilités

| Rôle | Responsabilité |
| --- | --- |
| Simon / Product Owner | Arbitrer la priorité, la checklist FR-18, le premier article réel et l'ouverture R1 |
| Responsable produit / PM | Maintenir SPEC, PRD, epics, sprint-status et matrice de traçabilité |
| Architecte | Valider resolver, visibility, migration, SEO/AEO owners, promotion et rollback |
| UX | Valider homepage T0, article, responsive, clavier, a11y, thème et parcours minimal |
| Développeur | Ne créer les stories Epic 16 qu'après ratification ; exécuter T0/E1 selon le plan versionné |
| Équipe technique | Exécuter Docker gate, fixtures, probes et preuves de déploiement |

### 5.3 Handoff

1. PM met à jour les artefacts canoniques et le decision log.
2. Architect/UX revalident les gates D-01 à D-08.
3. Epic 14 produit son checkpoint.
4. Epic 16 est créée en backlog.
5. Les stories T0 sont décomposées seulement après approbation finale de cette proposition.
6. E1 et R1 restent des gates séparées.

## 6. Success Criteria de la proposition

- Aucun code applicatif n'est requis avant l'approbation de cette proposition et la ratification des contrats.
- Epic 16 existe en backlog, Epic 6 est `done` et Epic 14 possède un checkpoint documenté.
- SPEC, PRD, content-contract, verification-plan, diagrams et decision log décrivent la même segmentation T0/E1/R1.
- La matrice CAP → FR → phase → fixture → assertion est complète.
- D-01 à D-08 sont statués, avec propriétaire, décision et date.
- Aucun événement/propriété analytics n'est ajouté en T0.
- Les fixtures ne sont jamais déployées en production.
- Le premier article réel ne peut pas contourner FR-18, la promotion contrôlée et le probe.

## 7. Décisions en attente d'approbation finale

- [x] Mise à jour effective de `epics.md` et `sprint-status.yaml` après approbation.
- [x] Révision effective de SPEC, `content-contract.md`, `verification-plan.md` et `architecture-diagrams.md`.
- [ ] Création des premières stories Epic 16 uniquement après ces révisions.
- [ ] Confirmation de la baseline de thème et de navigation au checkpoint Epic 14.

La proposition est approuvée et appliquée au niveau planning/contrat. La création des stories reste volontairement bloquée jusqu'à la fin du checkpoint Epic 14 et des gates D-01 à D-08.

## 8. Sources

- PRD : `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md`
- SPEC : `docs/specs/spec-blog-editorial/SPEC.md`
- Contrat : `docs/specs/spec-blog-editorial/content-contract.md`
- Vérification : `docs/specs/spec-blog-editorial/verification-plan.md`
- Diagrams : `docs/specs/spec-blog-editorial/architecture-diagrams.md`
- Brownfield : `docs/specs/spec-blog-editorial/brownfield.md`
- Investigation : `docs/implementation-artifacts/investigations/blog-editorial-brief-investigation.md`
- Epics : `docs/planning-artifacts/epics.md`
- Sprint status : `docs/implementation-artifacts/sprint-status.yaml`
- Checkpoint Epic 14 : `docs/implementation-artifacts/epic-14-checkpoint-2026-09-25.md` (reconciled, stabilisation en attente)
- Revue adversarial : `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/review-adversarial-current.md`

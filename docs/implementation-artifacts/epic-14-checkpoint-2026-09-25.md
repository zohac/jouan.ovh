---
title: "Point de contrôle Epic 14 — propriété SEO, AEO et vie privée"
status: reconciled
stabilisation: en_attente
created: 2026-09-25
updated: 2026-09-25
epic: epic-14
---

# Point de contrôle Epic 14

Ce point de contrôle est **réconcilié documentairement** le 2026-09-25. Les six tâches de l'Epic 14 sont terminées et les preuves de production disponibles sont enregistrées. Cette réconciliation ne déclare pas clos les résultats externes encore en attente : la validation Google Search Console, la mesure d'effet AEO et certaines preuves d'observabilité restent des réserves explicites, et **D-08 n'est pas encore ratifiée**.

L'Epic 14 est donc **livré pour son périmètre de développement**, mais son ouverture comme base stable pour l'Epic 16 reste conditionnée par la ratification des contrats éditoriaux et la décision de Simon sur les réserves ci-dessous.

## Responsables

- Responsable technique : propriétaire des modules SEO, de Site Config, du sitemap, de `robots.txt` et des artefacts de génération.
- Responsable vie privée : propriétaire du consentement, de la télémétrie, du rejeu de session, de la liste blanche et de l'absence de fuite.
- Simon : validation éditoriale, confirmation de la base visuelle et arbitrage des réserves avant l'ouverture de l'Epic 16.

## Réconciliation des préconditions

- [x] 14.1 est réconciliée et son implémentation est gelée dans un différentiel propre. — clôturée `done` le 2026-09-25.
- [x] 14.2 est revue et le masquage des données sensibles est confirmé. — clôturée `done` le 2026-09-25 ; configuration et session de production vérifiées via MCP.
- [x] 14.6 est revue et la base AEO/Markdown est capturée. — clôturée `done` le 2026-09-25 ; artefacts AEO vérifiés en production.
- [x] 14.5 est le propriétaire unique de Site Config, du canonical, du sitemap et de `robots.txt`. — propriétaire documenté dans `14-5` et vérifié par la CI.
- [x] Les critères historiques de 14.4 sont marqués supersédés, sans réouverture de la tâche. — le statut et le remplacement sont explicites dans `sprint-status.yaml` et `epics.md`.
- [x] La liste blanche de télémétrie existante est inventoriée. — `tracking-plan.md` fait foi ; aucune nouvelle propriété ou aucun nouvel événement n'est requis en T0 de l'Epic 16.
- [x] Les routes, dates, exclusions, MIME, `CNAME` et `_headers` de référence sont documentés. — preuves dans `14-5`, `14-6` et `.github/workflows/cd.yml`.
- [x] Les vérifications de production disponibles sont enregistrées comme base de référence. — CI principale verte, artefacts AEO, sitemap, robots, Markdown, MIME et `CNAME` contrôlés.

## Ratification requise

La livraison technique des six tâches est acquise, mais la ratification du point de contrôle reste conditionnée par :

- [ ] **D-08** : confirmation par Simon de la base visuelle et de navigation (thème sombre prioritaire, thème clair « Papier technique / Crème solaire », terminal sanctuarisé, homepage et footer seulement en T0).
- [ ] **Matrice de visibilité T0** : validation des états × surfaces × codes HTTP prévue par le PRD et le plan de vérification.
- [ ] **Décision sur les réserves** : accepter, planifier ou transformer chaque réserve du tableau ci-dessous.

Une fois ces trois points tranchés, `stabilisation` peut passer de `en_attente` à `ratifiée`, puis la réconciliation doit être commitée avant l'ouverture de l'Epic 16.

## Preuves enregistrées

| Domaine | Preuve | État |
| --- | --- | --- |
| SEO | Source Site Config, forme des URL, canonical, propriétaire unique de `sitemap.xml` et `robots.txt` | Vérifié localement et en production |
| AEO | Sorties publiques, exclusions, Markdown, MIME, liens et budgets | Vérifié en production ; effet métier non conclu |
| Vie privée | Consentement distinct, DNT/GPC, rejeu masqué, liste blanche et absence de nouvelle télémétrie | Configuration et session vérifiées ; inspection visuelle du rejeu non exposée par les outils |
| Génération | Commandes Docker, artefact statique de référence, routes attendues | Vérifié |
| Navigation | Base visuelle, thèmes et terminal sanctuarisé | Documenté ; à confirmer au point de contrôle éditorial |
| CI | Contrôles automatisés, jeux de données temporaires, `CNAME` et `_headers` | Vérifié |

## Réserves ouvertes

Ces réserves ne remettent pas en cause la livraison des tâches, mais elles ne doivent pas être reformulées comme des garanties acquises :

| Réserve | Propriétaire | État | Conséquence |
| --- | --- | --- | --- |
| Validation DNS et exploitation Google Search Console | Simon | Non exécutée ou non rapportée dans les artefacts | Le sitemap est servi, mais la propriété Google, la soumission et l'indexation ne sont pas démontrées |
| Couverture exhaustive des événements en production | Responsable vie privée / Amelia | Implémentation revue, rapport PostHog par catégorie non consigné | La couverture réelle de toutes les catégories doit être vérifiée avant de considérer le plan de taggage comme pleinement observé |
| Rétention des événements de télémétrie | Responsable vie privée | Durée du projet PostHog non relevée dans les preuves disponibles | La rétention du rejeu de session à 30 jours ne doit pas être confondue avec celle des événements |
| Inspection visuelle du rejeu | Responsable vie privée | La session de production existe, mais le MCP n'expose pas le rendu image | Le masquage reste assuré par la configuration, le DOM et les réglages projet ; l'absence d'inspection vidéo indépendante est acceptée comme limite |
| Mesure d'effet AEO | Responsable produit / PM | Protocole défini, résultat avant/après non produit | Aucune conclusion de visibilité, de citation, de trafic référent ou de conversion |
| Synchronisation du consentement entre onglets et versionnement de la politique | Responsable technique | Différé | Une révocation peut ne pas être visible immédiatement dans les autres onglets ouverts |
| Chaîne d'approvisionnement CI | Responsable CI | Versions des actions, de l'image Node et de l'exécuteur non épinglées | Durcissement reproductible à traiter dans une passe dédiée |
| Contrôle préalable SEO | Simon / équipe | Recommandation issue de la rétrospective | Une recherche documentaire légère avant un futur lot SEO est recommandée, sans obligation de processus |

## Décision de sortie

- `epic-14: done` décrit la livraison des six tâches.
- `epic-14-retrospective: done` décrit la rétrospective et la réconciliation documentaire.
- `status: reconciled` décrit l'état de ce point de contrôle.
- `stabilisation` prend deux valeurs : `en_attente` tant que D-08, la matrice de visibilité et la décision sur les réserves ne sont pas tranchées ; `ratifiée` une fois ces trois points clos et la réconciliation commitée.
- L'Epic 16 reste en `backlog` et aucune tâche d'implémentation ne doit être créée avant la ratification des contrats D-01 à D-08 et la confirmation de la base visuelle.
- Les documents `AGENTS.md`, `docs/implementation-artifacts/sprint-status.yaml` et `docs/project-context.md` doivent décrire le même état.

## Références

- `docs/implementation-artifacts/epic-14-retro-2026-09-25.md`
- `docs/planning-artifacts/sprint-change-proposal-2026-09-25.md`
- `docs/implementation-artifacts/sprint-status.yaml`
- `docs/specs/spec-analytics-search-console/SPEC.md`
- `docs/specs/spec-analytics-search-console/tracking-plan.md`
- `docs/specs/spec-analytics-search-console/compliance-gdpr.md`
- `docs/specs/spec-analytics-search-console/seo-verification.md`
- `docs/specs/spec-blog-editorial/SPEC.md`
- `docs/specs/spec-blog-editorial/verification-plan.md`

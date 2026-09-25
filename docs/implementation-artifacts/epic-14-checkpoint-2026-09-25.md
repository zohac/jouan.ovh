---
title: "Epic 14 checkpoint — propriété SEO/AEO/privacy"
status: pending
created: 2026-09-25
updated: 2026-09-25
epic: epic-14
---

# Checkpoint Epic 14

Ce checkpoint est requis avant toute story Epic 16. Il est **pending** : il décrit les preuves à produire et ne déclare pas Epic 14 stabilisé.

## Responsables

- Responsable technique : propriétaire des modules SEO, Site Config, sitemap, robots et artefacts de build.
- Responsable vie privée : consentement, analytics, session replay, liste blanche et absence de fuite.
- Simon : validation éditoriale et confirmation du baseline design/navigation.

## Préconditions

- [ ] 14.1 est réconciliée et son implémentation est gelée dans un diff propre.
- [ ] 14.2 est revue et le masquage des données sensibles est confirmé.
- [ ] 14.6 est revue et la baseline AEO/Markdown est capturée.
- [ ] 14.5 reste le propriétaire unique de Site Config, canonical, sitemap et robots.
- [ ] Les critères historiques de 14.4 sont marqués supersédés, sans réouvrir la story.
- [ ] La liste blanche analytics existante est inventoriée ; aucun nouvel événement/propriété n'est requis par Epic 16 T0.
- [ ] Les routes, dates, exclusions, MIME, CNAME et `_headers` de référence sont documentés.
- [ ] Les probes de production disponibles sont enregistrés comme baseline.

## Preuves attendues

| Domaine | Preuve |
| --- | --- |
| SEO | Source Site Config, forme des URLs, canonical et owners sitemap/robots |
| AEO | Liste des sorties publiques, exclusions, Markdown, MIME et budgets |
| Privacy | Consentement, DNT, session replay, liste blanche et absence de nouvelle télémétrie |
| Build | Commit/checkpoint, commande Docker et artefact statique de référence |
| Navigation | Baseline header/homepage/footer et thème approuvé |
| CI | Assertions existantes, fixtures, CNAME et `_headers` |

## Décision de sortie

Epic 14 pourra être déclaré checkpointé lorsque toutes les cases sont cochées, que les revues 14.2/14.6 sont clôturées et qu'un commit ou worktree propre est identifié. Epic 16 reste `backlog` jusque-là.

## Références

- `docs/planning-artifacts/sprint-change-proposal-2026-09-25.md`
- `docs/implementation-artifacts/sprint-status.yaml`
- `docs/specs/spec-blog-editorial/SPEC.md`
- `docs/specs/spec-blog-editorial/verification-plan.md`

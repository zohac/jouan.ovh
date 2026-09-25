## Document Summary
- **Purpose:** Ce document existe pour aider PM, design, architecture et delivery à décider ce que le blog brownfield doit inclure dans la première release, puis à transmettre un périmètre, des arbitrages et une traçabilité fiables aux workflows UX, architecture, epics et stories.
- **Audience:** PM, design, architecture, delivery agents
- **Reader type:** humans
- **Structure model:** Strategic/Context (Pyramid), avec `addendum.md` comme annexe de preuves, de recherche et de contraintes techniques
- **Current length:** 8 984 mots répartis dans 25 sections H2 sur deux fichiers (`prd.md` : 7 778 mots ; `addendum.md` : 1 206 mots)
- **Question centrale:** Quelles capacités sont engageantes pour la première release, lesquelles sont conditionnelles, quelles décisions doivent être ratifiées et quelles preuves rendent la livraison acceptable ?
- **Diagnostic:** La vision, les parcours et les 18 exigences fonctionnelles donnent une base solide, mais le modèle décisionnel attendu d'un PRD brownfield est inversé : la première release, les defaults, les gates, les risques de planning et les questions bloquantes n'apparaissent qu'après les longs chapitres Vision, Utilisateur, Glossaire et Fonctionnalités.

### Major-Section Map

| Fichier | Section H2 | Mots | Apport structurel et disposition recommandée |
| --- | --- | ---: | --- |
| `prd.md` | 0. Objectif du document | 277 | Sert directement le propos, mais concentre à la fois méthode, sources, baseline et orientation de lecture ; condenser autour d'un bloc de décision initial. |
| `prd.md` | 1. Vision | 281 | Sert directement la décision et la compréhension ; conserver près du début. |
| `prd.md` | 2. Utilisateur cible | 843 | Les JTBD servent la conception ; déplacer les mécaniques détaillées des parcours vers un handoff UX dédié. |
| `prd.md` | 3. Glossaire | 339 | Vocabulaire partagé utile aux quatre audiences ; conserver comme repère, sans le traiter comme une section narrative lente. |
| `prd.md` | 4. Fonctionnalités | 2 237 | Cœur produit nécessaire, mais statut de release, détails de contrat et vérification sont dispersés ; conserver les FR et les tracer vers une matrice canonique. |
| `prd.md` | 5. Exigences non fonctionnelles | 249 | Contraintes transverses directes ; y rattacher la règle de compatibilité de migration actuellement isolée à la fin des fonctionnalités. |
| `prd.md` | 6. Contraintes et garde-fous | 964 | Très utile mais surcharge quatre fonctions : garde-fous, décisions, hypothèses, visibilité et justification temporelle ; scinder et relier. |
| `prd.md` | 7. Identité, ton et forme | 92 | Scaffolding design utile ; déplacer avant les exigences d'expérience. |
| `prd.md` | 8. Architecture de l'information et plateforme | 78 | Baseline technique utile ; déplacer avant le détail des FR pour cadrer leur implémentation. |
| `prd.md` | 9. Risques et mitigations | 245 | Outil décisionnel direct et visuellement clair ; conserver. |
| `prd.md` | 10. Lancement et changement | 258 | Séquence de delivery utile ; garder après le cadre de release et relier ses gates à la définition de terminé. |
| `prd.md` | 11. Gouvernance des données et de la vie privée | 72 | Directement pertinente, mais fait doublon avec les garde-fous et NFR ; fusionner dans une source canonique. |
| `prd.md` | 12. Non-goals explicites | 128 | Sert directement à borner le périmètre ; conserver comme liste canonique. |
| `prd.md` | 13. Périmètre de première release et roadmap | 472 | Critique pour la décision, mais arrive trop tard et répète les statuts des FR ; remonter et condenser dans la matrice de scope. |
| `prd.md` | 14. Métriques de succès | 631 | Utile, mais mêle gates de release, critères d'acceptation et diagnostics post-lancement ; séparer et réordonner. |
| `prd.md` | 15. Questions ouvertes | 265 | Critique pour l'aval, mais redouble §6.3 et l'addendum ; intégrer à un registre de décisions unique. |
| `prd.md` | 16. Index des hypothèses | 157 | Aide de traçabilité utile pour les agents et les lecteurs humains ; conserver et enrichir d'un statut de validation. |
| `prd.md` | 17. Références et artefacts associés | 37 | Navigation utile, mais duplique le frontmatter et l'addendum ; conserver un seul index visible. |
| `addendum.md` | 1. Décisions de cadrage | 67 | Reprend la vision, les priorités et les règles de mesure du PRD ; fusionner ou réduire. |
| `addendum.md` | 2. Recherche sur l'autorité éditoriale | 338 | Preuves, anti-patterns et sources uniques à l'addendum ; conserver intégralement comme annexe de preuves. |
| `addendum.md` | 3. Implication pour le produit | 296 | Utile comme pont vers le PRD, mais répète surtout FR-2, FR-18 et la règle de preuve ; condenser en références. |
| `addendum.md` | 4. Brownfield technique | 210 | Détail utile à l'architecture et à la delivery ; conserver, avec renvoi vers l'investigation canonique. |
| `addendum.md` | 5. Options écartées | 136 | Justification décisionnelle utile ; conserver comme registre d'options. |
| `addendum.md` | 6. Questions de planning | 63 | Doit être visible dans le registre de décisions du PRD plutôt que dans une file d'attente séparée. |
| `addendum.md` | 7. Source de l'investigation | 25 | Pointeur utile, mais absorbable par l'index d'artefacts. |

## Recommendations

### 1. MOVE - Bloc de décision et ordre de lecture
**Priority:** High
**Rationale:** Le modèle pyramidal exige que statut, recommandation, baseline, périmètre de première release, gates, arbitrages par défaut et bloqueurs apparaissent avant les détails de parcours et les 18 FR.
**Impact:** ~0 mot net ; environ 500 mots existants seraient relocalisés et environ 100 mots de navigation compressive remplacés.
**Comprehension note:** La table baseline/delta et la vision doivent rester visibles immédiatement après le bloc de décision.

### 2. MERGE - Matrice canonique de scope et de traçabilité
**Priority:** High
**Rationale:** Les statuts « phase 1 », « phase 2 », « conditionnel » et « hors release » sont dispersés dans les titres et descriptions de FR puis répétés dans §13, ce qui expose les agents aval à interpréter toutes les exigences comme engageantes.
**Impact:** ~300 mots
**Comprehension note:** Conserver toutes les FR et tous leurs effets vérifiables, mais ne laisser la matrice de portée que porter le statut, les JTBD, les gates, les métriques et l'artefact source afin d'éviter toute suppression de contenu.

### 3. MERGE - Registre unique des décisions, defaults et hypothèses
**Priority:** High
**Rationale:** Les defaults provisoires de §6.3, les quatorze questions de §15, les questions de planning de l'addendum et les hypothèses dispersées ne permettent pas aux agents de distinguer une décision ratifiée d'un default, d'une question bloquante ou d'une capacité différée.
**Impact:** ~200 mots
**Comprehension note:** Le registre doit conserver explicitement le statut, le propriétaire, la gate, les hypothèses affectées et la preuve de résolution sans convertir aucun default provisoire en décision acquise.

### 4. MERGE - Gates de release, acceptation et mesures post-lancement
**Priority:** High
**Rationale:** La section Métriques de succès commence par des gates de lancement et de release étendue puis passe à des diagnostics, ce qui mélange les conditions de livraison avec les résultats observés après usage.
**Impact:** ~120 mots
**Comprehension note:** Déplacer les critères binaires dans le contrat de release et conserver dans les métriques uniquement les signaux de valeur, de santé et d'apprentissage, avec les identifiants SM réordonnés sans rupture.

### 5. CUT - Doublon « Out of Scope »
**Priority:** Medium
**Rationale:** §13.3 répère presque point par point les non-goals déjà énoncés au §12 et disperse ainsi la définition canonique des exclusions.
**Impact:** ~80 mots
**Comprehension note:** Regrouper les rares exceptions dans §12 et y renvoyer depuis la roadmap afin de conserver toutes les exclusions sans duplication.

### 6. CONDENSE - Parcours utilisateur en handoff UX
**Priority:** Medium
**Rationale:** Les cinq scénarios détaillent utilement persona, entrée, chemin, point culminant, résolution et cas limite, mais cette granularité relève du scenario design et ralentit le PRD avant que le scope de release soit connu.
**Impact:** ~220 mots
**Comprehension note:** Cette condensation peut affecter la compréhension des agents design ; conserver une matrice concise des acteurs, résultats et cas limites dans le PRD et déplacer les chemins détaillés intacts dans un handoff UX lié.

### 7. MOVE - Fondations expérience et plateforme avant les FR
**Priority:** Medium
**Rationale:** L'identité visuelle, le ton, l'architecture de l'information et les dépendances de plateforme n'arrivent qu'après les fonctionnalités alors qu'elles constituent le scaffolding nécessaire pour concevoir et arbitrer les FR.
**Impact:** ~0 mot
**Comprehension note:** Déplacer la règle de compatibilité de migration vers les NFR ou les contraintes techniques ; conserver les exigences de design system et d'accessibilité où elles sont vérifiables.

### 8. CONDENSE - Sections de cadrage et d'implication de l'addendum
**Priority:** Medium
**Rationale:** Les sections 1 et 3 de l'addendum répètent la priorité, l'absence de cibles inventées, la définition de la preuve et la checklist déjà portées par la vision, FR-2, FR-18 et §14, alors que la valeur propre de l'addendum est ailleurs.
**Impact:** ~220 mots
**Comprehension note:** Préserver les observations, anti-patterns, sources et conclusions de recherche ; ne conserver dans l'addendum que le lien vers les exigences canoniques et la checklist existante.

### 9. MERGE - Gouvernance des données dans les exigences transverses
**Priority:** Low
**Rationale:** Les quatre règles de §11 répètent les garde-fous de confidentialité, les NFR-8 et NFR-11, la politique de fixtures et les contrôles de non-fuite sans ajouter de décision propre.
**Impact:** ~50 mots
**Comprehension note:** Déplacer les responsabilités vers NFR-8/NFR-11 et les règles de publication vers les gates existantes, avec un renvoi explicite depuis le contrat de release.

### 10. CONDENSE - Index des artefacts et des sources
**Priority:** Low
**Rationale:** Le frontmatter `sources`, §17, la dernière section de l'addendum et les renvois internes du PRD présentent plusieurs listes proches du même référentiel normatif, ce qui augmente le risque de dérive documentaire.
**Impact:** ~30 mots
**Comprehension note:** Conserver un index visible unique distinguant artefacts normatifs, preuves, planification et investigation afin de préserver la navigation humaine.

### 11. PRESERVE - Aides à la compréhension et à la traçabilité
**Priority:** Guardrail
**Rationale:** La table baseline/delta, le glossaire, les cas limites des parcours, la table des risques, l'index des hypothèses, les sources de recherche et le registre des options écartées accélèrent la décision et doivent survivre aux condensations.
**Impact:** ~0 mot
**Comprehension note:** Déplacer seulement les éléments qui sont au mauvais endroit et supprimer uniquement les doublons, sans appauvrir les exemples, tableaux, hypothèses qualifiées ou preuves.

## Summary
- **Total recommendations:** 11
- **Estimated reduction:** ~1 220 mots (~13,6 % de 8 984), sous réserve que les détails des parcours déplacés restent disponibles dans le handoff UX
- **Meets length target:** No target specified
- **Comprehension trade-offs:** La condensation des parcours et de l'addendum peut réduire la qualité de lecture si les détails ne sont pas liés ; préserver la baseline, les cas limites, les sources, les hypothèses qualifiées et l'index des risques ; aucune densité gagnée ne justifie la suppression d'une preuve ou d'un statut de décision.

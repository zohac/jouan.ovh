# Rapport de réconciliation d'intention — PRD blog éditorial

**Date :** 2026-09-24  
**Mode :** lecture seule. Aucun fichier PRD, addendum, SPEC ou journal de décision n'a été modifié.

## 1. Verdict exécutif

Le draft courant est **aligné avec les réponses de découverte et le digest de recherche**. Les huit intentions sont désormais explicites ou vérifiables dans le PRD : autorité technique en priorité 1, audience qualifiée en priorité 2, support commercial en priorité 3, blog comme maison numérique et mémoire technique publique, absence de chiffres inventés, site public brownfield, Fast path et entrée Vision + Features.

Le PRD ne présente plus de contradiction d'intention. Les éventuelles questions techniques restantes sont explicitement marquées comme provisoires ou ouvertes. Le seul gap de traçabilité restant est que les valeurs par défaut de la section 6.3 et les questions ouvertes correspondantes ne sont pas encore réconciliées dans le journal de décision ; ce point peut bloquer la finalisation des stories, mais ne modifie pas la hiérarchie produit.

**Statut recommandé :** `aligned_with_minor_gaps` — réconciliation d'intention réussie, avec une clarification de statut de décision à effectuer avant l'exécution.

## 2. Sources consultées

- PRD courant : `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/prd.md:1-540`.
- Addendum, décisions de cadrage et digest de recherche : `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/addendum.md:5-55`.
- Journal de décision : `docs/planning-artifacts/prds/prd-jouan.ovh-2026-09-24/.decision-log.md:17-34`.
- SPEC canonique : `docs/specs/spec-blog-editorial/SPEC.md:15-111`.
- Contrat de contenu et règles de migration : `docs/specs/spec-blog-editorial/content-contract.md:5-21`.

## 3. Matrice de réconciliation

| Intention utilisateur | État | Preuve et lecture |
|---|---|---|
| Autorité technique démontrable = priorité 1 | **Aligné** | Le PRD fixe explicitement l'ordre de priorité et interdit qu'une surface SEO/AEO/RSS prenne le pas sur une preuve d'expérience (`prd.md:28-40`). FR-2 exige problème, méthode, observation, résultat, limites, alternatives et réutilisabilité, sans potentiel commercial obligatoire (`prd.md:125-149`), en cohérence avec la recherche (`addendum.md:17-22`; `addendum.md:44-55`). |
| Audience qualifiée = priorité 2 | **Aligné** | L'audience est définie qualitativement comme pair technique, lecteur professionnel ou décideur évaluant une méthode ou une maîtrise réelle, sans seuil de trafic ou de contact (`prd.md:36-40`). Les parcours nommés et contextualisés couvrent les pairs, prospects, lecteurs et agents (`prd.md:59-101`). |
| Support commercial = priorité 3 | **Aligné** | Le blog prouve avant de vendre ; le potentiel commercial direct n'est pas une condition de publication et le contact reste possible sans conversion forcée (`prd.md:30-40`; `prd.md:71-77`; `prd.md:427-436`). |
| Maison numérique / mémoire technique publique | **Aligné** | Le PRD définit une maison durable, un patrimoine vérifiable et un corpus relié à ses auteurs, projets, décisions et limites (`prd.md:24-32`). Le parcours de publication, les corrections et l'indicateur de patrimoine rendent cette finalité opérationnelle (`prd.md:87-93`; `prd.md:151-159`; `prd.md:476-497`). |
| Aucun chiffre inventé | **Aligné** | La qualification n'est pas un seuil de trafic/contact, les résultats absents ne sont pas complétés, et les nombres structurels sont explicitement distingués des promesses de performance (`prd.md:38-40`; `prd.md:144-149`; `prd.md:350-363`; `prd.md:476-497`). |
| Site public existant | **Aligné** | Le PRD est une évolution brownfield de Nuxt, Content, du DS, du SEO/AEO et de la CI, statique sur GitHub Pages et sans CMS externe (`prd.md:24-26`; `prd.md:335-348`; `prd.md:379-394`; `SPEC.md:61-74`). |
| Fast path | **Aligné par le premier périmètre** | Fast path est acté dans l'addendum et le journal (`addendum.md:7-10`; `.decision-log.md:24-25`). Le PRD le matérialise par un premier périmètre de bout en bout et des capacités conditionnelles ultérieures (`prd.md:409-417`; `prd.md:438-465`). |
| Vision + Features | **Aligné** | La structure Vision puis Fonctionnalités est explicite (`prd.md:28-40`; `prd.md:123-125`), et l'entrée retenue est Vision + Features (`addendum.md:7-9`; `.decision-log.md:24-25`). |

## 4. Gap critique

Aucun gap critique d'intention n'a été détecté dans le PRD courant. Les anciens risques de priorisation, de définition d'audience, de checklist de preuve, de découpage Fast path, de `ProfilePage` et de distinction des nombres ont été traités explicitement dans le draft (`prd.md:36-40`; `prd.md:140-149`; `prd.md:269-288`; `prd.md:438-465`; `prd.md:476-478`).

## 5. Gaps mineurs

### MG-01 — Statut des valeurs par défaut à réconcilier avec le journal

La section 6.3 fixe des valeurs par défaut pour `date`/`publishedAt`, `/about`, les relations projet, `related`, la visibilité de production, les hubs et les overrides SEO (`prd.md:365-377`). Le PRD précise qu'elles restent soumises à la gate `bmad-correct-course`, mais les questions 1, 2, 3, 4, 5, 7 et 8 restent ouvertes (`prd.md:499-518`). La SPEC conserve également ces questions (`SPEC.md:99-111`), et le journal de décision indique que date, auteur, projet, preview, related, RSS et canonical restent à traiter (`.decision-log.md:29-34`).

**Impact :** un agent aval peut correctement comprendre qu'il s'agit de valeurs par défaut provisoires, mais doit interpréter leur relation avec les questions ouvertes avant de figer les stories.

**Action :** enregistrer dans le journal le statut exact de chaque valeur par défaut, puis distinguer explicitement les décisions provisoires des questions qui restent bloquantes. Aucun changement d'intention n'est nécessaire.

### MG-02 — Les signaux de succès ne nomment pas directement l'autorité et l'audience qualifiée

La règle de priorité et les signaux d'observation de l'audience sont définis (`prd.md:36-40`), mais SM-1 à SM-7 restent principalement des contrôles de cohérence, d'accessibilité, d'indexabilité, de distribution et de patrimoine (`prd.md:480-497`). SM-7 couvre la profondeur du corpus sans seuil arbitraire.

**Action :** ajouter, si le niveau de rigueur le justifie, un signal qualitatif post-publication pour l'autorité démontrée et l'audience qualifiée, fondé sur pertinence des lectures, retours, recherches et demandes de contexte, sans cible chiffrée.

### MG-03 — Le cycle de vie de la mémoire publique n'est pas totalement explicite

La mémoire est incarnée par le patrimoine, les corrections, les dates de mise à jour, les relations et SM-7 (`prd.md:30-32`; `prd.md:151-159`; `prd.md:487-491`). Le contrat laisse `evergreen`, `series` et `archived` optionnels et le PRD exclut les séries/archives de l'UI MVP (`prd.md:427-436`; `content-contract.md:39-48`; `SPEC.md:76-83`).

**Action :** définir explicitement le socle minimal de la mémoire — corpus public stable, corrigible, relié et historiquement intelligible — sans rouvrir automatiquement des systèmes d'archive ou de séries.

### MG-04 — Fast path n'est pas une métadonnée explicite du PRD

Le PRD porte la substance du Fast path avec un premier périmètre borné (`prd.md:453-465`), mais le mode lui-même et sa provenance restent dans l'addendum et le journal (`addendum.md:7-10`; `.decision-log.md:24-25`).

**Action :** ajouter une mention courte de traçabilité si le mode de découverte doit être visible dans le PRD seul. Ce point n'affecte pas la portée produit.

### MG-05 — Notes rédactionnelles

Quelques formulations restent à polir : `Realizes UJ-...` (`prd.md:125-127`; `prd.md:161-163`; `prd.md:197-199`; `prd.md:231-233`; `prd.md:255-257`; `prd.md:301-303`), `liens interne` (`prd.md:187-195`), `publicly addressable` (`prd.md:245-253`), `des tokens` (`prd.md:305-313`), `difficult` (`prd.md:396-407`) et `recommendation IA` (`prd.md:467-474`). Ces défauts sont rédactionnels et ne modifient pas l'intention.

## 6. Claims préservés

- **Priorité éditoriale :** autorité 1, audience qualifiée 2, utilité commerciale 3 ; SEO/AEO/RSS ne priment pas sur la preuve (`prd.md:36-40`; `.decision-log.md:22-23`).
- **Autorité par l'expérience :** FR-2 couvre problème, méthode, observation, résultat, limites, alternatives et réutilisabilité (`prd.md:140-149`; `addendum.md:17-22`).
- **Audience qualifiée sans seuil artificiel :** définition qualitative et signaux de pertinence, retours, recherches et demandes de contexte (`prd.md:36-40`; `prd.md:59-101`).
- **Support commercial secondaire :** le blog prouve avant de vendre et ne filtre pas sur le potentiel commercial direct (`prd.md:30-40`; `prd.md:71-77`; `.decision-log.md:22-23`).
- **Mémoire technique publique :** patrimoine durable, corrections, dates, relations et SM-7 (`prd.md:30-32`; `prd.md:87-93`; `prd.md:151-159`; `prd.md:487-491`).
- **Aucune invention numérique :** pas de métriques, dates, ROI, trafic, classement, citation ou conversion inventés ; nombres structurels explicitement non performatifs (`prd.md:144-149`; `prd.md:350-363`; `prd.md:476-497`; `addendum.md:11`).
- **Site brownfield :** réutilisation de l'infrastructure statique, du DS, du SEO/AEO et de la CI, sans CMS ni double propriétaire (`prd.md:335-348`; `prd.md:379-394`; `SPEC.md:61-74`).
- **Fast path et Vision + Features :** décisions de cadrage conservées et premier périmètre borné (`addendum.md:7-10`; `.decision-log.md:24-25`; `prd.md:453-465`).
- **AEO comme projection de distribution :** compatible sans promesse d'autorité, de classement ou de citation (`prd.md:280-299`; `prd.md:359-363`; `addendum.md:20-22`).

## 7. Handoff recommandé

1. Traiter MG-01 avant la finalisation des stories en alignant la section 6.3, les questions ouvertes, la SPEC et le journal de décision.
2. Ajouter les signaux qualitatifs d'autorité et d'audience dans les métriques si une preuve stratégique explicite est requise.
3. Clarifier le socle minimal de la mémoire publique et la traçabilité de Fast path.
4. Effectuer la passe de mise en forme rédactionnelle ; ne pas modifier le PRD dans cette sous-tâche.

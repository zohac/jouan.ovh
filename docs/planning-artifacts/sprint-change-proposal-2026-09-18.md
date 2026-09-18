---
title: "Sprint Change Proposal — Repositionnement Commercial V1.1"
date: "2026-09-18"
author: "Simon Jouan"
project: "jouan.ovh"
status: "approved"
scope_classification: "moderate"
target_epic: "epic-15"
source_document: "docs/jouan-ovh-offre-commerciale-v1.1-updated.md"
---

# Sprint Change Proposal — Repositionnement Commercial V1.1

## 1. Résumé du Problème (Issue Summary)

### Énoncé du problème
Suite aux récents retours et échanges commerciaux, l'offre publique actuellement déployée sur `jouan.ovh` (issue de l'Epic 12) souffre d'un biais d'ancrage tarifaire bloquant : l'affichage récurrent de la mention **« À partir de 3 500 € HT »** sous les cartes d'accueil et de services donne l'impression erronée qu'aucun projet ne démarre en deçà de ce montant.
Ce filtre public dissuade les prospects ayant un besoin d'automatisation ciblée, ponctuelle ou légère de contacter Simon, avant même qu'un diagnostic de valeur ou de processus n'ait pu être posé.

### Contexte de découverte
Le document de cadrage commercial [`docs/jouan-ovh-offre-commerciale-v1.1-updated.md`](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md) a été produit le 18 septembre 2026 pour corriger cette friction sans pour autant dépositionner Simon comme prestataire low-cost. L'objectif commercial clé est :
> *« Obtenir la conversation, comprendre le problème, qualifier sa valeur, puis dimensionner l'intervention. »*

### Éléments de preuve
* `app/pages/index.vue` (L351, L366) : cartes 1 et 2 affichant en dur `price: "À partir de 3 500 € HT"`.
* `app/pages/services.vue` (L129) : carte principale *AI Workflow Sprint* affichant `price: "À partir de 3 500 € HT"`.
* `app/pages/services.vue` (L147, L166) : *AI Workflow Blueprint* présenté comme l'un des 3 piliers principaux de build, et *AI Care* affiché à 490 € HT/mois au même rang que le développement initial.

---

## 2. Analyse d'Impact (Impact Analysis)

### Impact sur les Épics
* **Epic 12 (Repositionnement Commercial V1) :** Est clôturé (`done`) et a servi de fondation solide (preuves Keova/Debrief/Devis-Assist, stack, terminal). Son contenu est amendé par la présente proposition.
* **Epic 13 (Thème Light/Dark) :** Est clôturé (`done`), stable et préservé.
* **Epic 14 (Analytics Privacy-First, RGPD & Google Search Console) :** Actuellement en backlog. Son exécution est maintenue mais **re-séquencée après l'Epic 15**. Ce décalage évite de devoir re-tagguer les CTA PostHog une fois la nouvelle offre livrée.
* **Nouvel Epic 15 (Repositionnement Commercial V1.1) :** Créé avec la plus haute priorité pour appliquer sans délai la nouvelle offre.

### Conflits d'Artefacts
* **PRD / SPEC (`docs/specs/spec-repositionnement-ia/SPEC.md`) :** Les capacités CAP-3 et CAP-5 sont amendées par l'Offre V1.1 (abandon de la contrainte de prix public à 3 500 € HT, passage aux 3 niveaux d'intervention sur devis, AI Care à 250 €/mois, Blueprint optionnel).
* **Architecture & Technique :** Aucun impact négatif. Respect des invariants Docker, SCSS tokens et 0 emoji (NFR6).
* **UI/UX :** Homepage (`index.vue`), page Services (`services.vue`), CTA global inspecteur et formulaire de contact (`contact.vue`).

---

## 3. Approche Retenue (Recommended Approach)

**Approche :** *Direct Adjustment via Nouvel Epic 15*.
* **Estimation de charge :** Modérée (2 à 3 sessions de travail).
* **Niveau de risque :** Faible (modifications d'UI et de contenu, réutilisation stricte des composants existants `ZCard`, `ZButton`, tokens SCSS).
* **Justification :** Le document source fournit déjà l'intégralité des textes cibles, des consignes Codex et des critères d'acceptation. Le découpage en 4 stories indépendantes garantit une mise en œuvre sans régression et vérifiée par la gate Docker.

---

## 4. Propositions de Modifications Détaillées (Detailed Change Proposals)

### 4.1 Ajout au document des Épics (`docs/planning-artifacts/epics.md`)

```markdown
#### Epic 15 — Repositionnement Commercial V1.1 : Désancrage Tarifaire & Offres par Niveaux d'Intervention
FR49: Homepage — Suppression de tout affichage public de « À partir de 3 500 € HT », intégration des liens contextuels d'approfondissement vers `/services` et de la phrase de réassurance workflow.
FR50: Page Services — Restructuration complète en 3 niveaux d'intervention sur devis (Automatisation ciblée, Workflow métier, Système métier sur mesure) et relégation du Blueprint en cadrage préalable optionnel (à partir de 750 € HT).
FR51: Page Services — Isolation d'AI Care en section dédiée après mise en production (à partir de 250 € HT / mois) et réalignement du déroulé d'intervention en 4 étapes.
FR52: Cohérence globale — Alignement du formulaire de contact (aucun budget bloquant imposé), SEO `usePageSeo`, conformité a11y, responsive et validation Docker 100% verte.
```

### 4.2 Découpage des 4 Stories de l'Epic 15

#### Story 15.1 : Homepage — Suppression des prix d'entrée, liens contextuels et phrase de réassurance
* **Fichiers touchés :** `app/pages/index.vue`
* **Objectif :** Supprimer `price: "À partir de 3 500 € HT"` sous les cartes expertises, insérer les liens d'exploration (« Voir les types d'automatisation → », etc.) et injecter la phrase de réassurance :
  > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*

#### Story 15.2 : Page Services — Restructuration des 3 offres de build sur devis & intégration Blueprint optionnel
* **Fichiers touchés :** `app/pages/services.vue`
* **Objectif :** Nouveau Hero (H1 : « Le bon niveau de système pour le bon problème. »), grille de build restructurée en 3 cartes :
  1. *Automatisation ciblée* (Besoin précis / Sur devis)
  2. *Workflow métier* (Offre cœur / Sur devis / Mise en avant)
  3. *Système métier sur mesure* (Projet complexe / Sur devis)
  Suppression du Blueprint comme carte de build principale.

#### Story 15.3 : Page Services — Section dédiée AI Care après mise en production et process 4 étapes
* **Fichiers touchés :** `app/pages/services.vue`
* **Objectif :** Création d'une section autonome sous le build :
  * Eyebrow : `// APRÈS LA MISE EN PRODUCTION`
  * Titre : `Le système doit continuer à fonctionner.`
  * Carte : `AI Care` à partir de `250 € HT / mois`.
  * Déroulé en 4 étapes mis à jour : 01 Diagnostic (Gratuit 20-30 min), 02 Cadrage (mention Blueprint optionnel à partir de 750 € HT), 03 Construction & intégration, 04 Exploitation & mesure.

#### Story 15.4 : Audit global, SEO, cohérence CTA/Contact et Gate Docker Nitro SSG
* **Fichiers touchés :** `app/pages/contact.vue`, `app/composables/usePageSeo.ts` (si besoin), `app/pages/services.vue`
* **Objectif :** Vérifier que le formulaire ne bloque pas sur le budget, vérifier les balises SEO des 13 routes statiques, valider les thèmes sombre et clair, et exécuter la gate Docker :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```

---

## 5. Plan de Passation & Prochaines Étapes (Implementation Handoff)

* **Classification :** Portée Modérée (*Moderate*).
* **Rôle d'exécution :** Agent Développeur (`bmad-agent-dev` / `bmad-create-story` / `bmad-dev-story`).
* **Ordre de réalisation :**
  1. Mise à jour immédiate de `docs/planning-artifacts/epics.md` et `docs/implementation-artifacts/sprint-status.yaml`.
  2. Lancement du cycle de réalisation par story :
     * Création de la story 15.1 via `bmad-create-story`
     * Implémentation via `bmad-dev-story`
     * Revue de code contradictoire `bmad-code-review`
* **Critères d'acceptation de validation finale :**
  - [ ] 0 mention de `3 500 € HT` sur l'Accueil et les cartes de build Services.
  - [ ] Phrase de réassurance visible sur la Homepage.
  - [ ] Les 3 offres principales affichent `Sur devis`.
  - [ ] AI Care est séparé du build et affiche `À partir de 250 € HT / mois`.
  - [ ] Blueprint relégué au rôle de cadrage optionnel dans le process.
  - [ ] La gate Docker passe à 100% verte (ESLint, TypeCheck, Generate 13 routes).

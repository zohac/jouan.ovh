---
baseline_commit: 7162f14595e42399d234c534fd88d78a7360cbb8
---

# Story 15.3: Page Services — Section Dédiée AI Care Après Mise en Production & Process 4 Étapes

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client ayant déployé ou envisageant de déployer un système,
I want comprendre comment Simon garantit la fiabilité, la supervision et la maintenance de la capacité dans la durée,
so that mon investissement reste opérationnel, adapté aux évolutions d'APIs et maîtrisé en coûts (FR51, CAP-3).

## Acceptance Criteria

1. **Given** la route `/services` (`app/pages/services.vue`)
   **When** le visiteur fait défiler la page sous la grille des 3 offres de build
   **Then** une section autonome dédiée à l'exploitation post-déploiement est insérée avant le process :
     - Classe de section : `<section class="section section--sunken care-section">`
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`
     - Titre de section : `<h2 class="care-section__title">Le système doit continuer à fonctionner.</h2>`
     - Paragraphe d'introduction :
       > *« Une automatisation utile doit continuer à fonctionner après sa mise en production. AI Care couvre le maintien en condition opérationnelle du système : monitoring, maintenance, support, suivi des coûts et adaptations mineures liées aux APIs ou aux modèles. »*
     - Carte dédiée `<ZCard>` pour l'offre AI Care :
       - Badge : `MAINTIEN EN CONDITION OPÉRATIONNELLE` (affiché via `<ZBadge tone="neutral">`)
       - Titre : `AI Care`
       - Icône : `bot` (`<ZIcon name="bot" />`)
       - Prix : `À partir de 250 € HT / mois` (dans `.care-card__price`, plancher de maintenance pour système simple)
       - Livrables clés (liste sémantique `<ul>` + `<li>`) :
         - `Monitoring proactif, détection d'erreurs & alertes d'anomalies`
         - `Maintenance corrective & adaptation aux évolutions d'APIs tierces`
         - `Suivi fin de consommation des tokens & ajustements de prompts`
         - `Support technique réactif & veille sur les nouveaux modèles`
         - `Mesure factuelle des KPI et optimisation continue du flux`
       - Clause de transparence / disclaimer :
         > *« Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build. »*
       - Bouton CTA : `<ZButton>` pointant vers `/contact` avec `:aria-label="Découvrir l'accompagnement AI Care"` et libellé `Découvrir AI Care` (variante `secondary`)
       - Ancre HTML : `id="ai-care"` avec `scroll-margin-top: var(--space-16)`

2. **Given** la section process (`.process`) dans `app/pages/services.vue`
   **When** le visiteur consulte les 4 étapes
   **Then** les données de `steps` sont mises à jour conformément à l'Offre Commerciale V1.1 (Sections 8 et 15) :
     1. **01 — Diagnostic :**
        - Titre : `Diagnostic`
        - Description : `Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.`
        - Inline CTA : `Identifier un workflow →` pointant vers `/contact`
     2. **02 — Cadrage :**
        - Titre : `Cadrage`
        - Description : `Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.` (Résolution de la dette différée Story 15.2)
     3. **03 — Construction & intégration :**
        - Titre : `Construction & intégration`
        - Description : `Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.`
     4. **04 — Exploitation & mesure :**
        - Titre : `Exploitation & mesure` (remplace l'ancien libellé `Suivi & amélioration`)
        - Description : `Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).`

3. **Given** l'organisation visuelle et le Design System
   **When** la page est rendue en mode sombre ou en mode clair
   **Then** l'alternance des sections assure un rythme visuel naturel :
     - Build : `.section` (fond base)
     - AI Care : `.section.section--sunken` (fond sunken discret)
     - Process 4 étapes : `.section` (fond base)
   **And** aucun style ne comporte de couleur, marge ou rayon en dur (utilisation stricte des tokens `var(--token)`).
   **And** aucun emoji n'est présent dans les textes ou composants (NFR6).

4. **Given** les données structurées Schema.org (`servicesJsonLd`) et le référencement
   **When** la page est générée en statique (`pnpm generate`)
   **Then** l'offre `AI Care` est intégrée à `servicesJsonLd` dans l'ItemList (avec son prix `À partir de 250 € HT / mois` et son ancre `url: "${siteUrl}/services#ai-care"`).
   **And** les offres de build existantes reçoivent également leur champ `url` pointant vers `#automatisation`, `#workflow`, `#sur-mesure` (résolution de la dette différée Schema.org de la Story 15.2).

5. **Given** les exigences de qualité et de non-régression
   **When** la suite de validation Docker est exécutée
   **Then** elle réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript vue-tsc et 28 routes statiques pré-rendues :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

## Tasks / Subtasks

- [x] Tâche 1 — Création de la section dédiée « AI Care » dans `app/pages/services.vue` (AC: 1, 3)
  - [x] Structurer la section avec `.section.section--sunken.care-section` insérée entre la grille de build et la section process.
  - [x] Insérer l'eyebrow standard `<p class="eyebrow"><span aria-hidden="true">// </span>après la mise en production</p>`.
  - [x] Insérer le titre `h2.care-section__title` : `Le système doit continuer à fonctionner.`
  - [x] Rédiger le texte de cadrage d'exploitation en 2 phrases (prose).
  - [x] Intégrer une carte `<ZCard>` dédiée (ou layout horizontal adapté) avec badge `MAINTIEN EN CONDITION OPÉRATIONNELLE`, icône `bot`, prix `À partir de 250 € HT / mois`, les 5 points de livrables et le disclaimer des consommations tierces d'APIs/tokens.
  - [x] Ajouter le bouton `<ZButton>` vers `/contact` avec `:aria-label="careOffer.ctaAriaLabel"`.
  - [x] Configurer l'ancre `id="ai-care"` et la règle `scroll-margin-top: var(--space-16)`.

- [x] Tâche 2 — Réalignement des 4 étapes du process et intégration Blueprint (AC: 2)
  - [x] Mettre à jour l'étape `01` : Diagnostic gratuit 20 à 30 min.
  - [x] Mettre à jour l'étape `02` : Cadrage avec mention explicite du Blueprint facturable optionnel à partir de 750 € HT pour sujets complexes.
  - [x] Mettre à jour l'étape `03` : Construction & intégration centrée sur le bon niveau de système.
  - [x] Mettre à jour l'étape `04` : Renommer en `Exploitation & mesure` avec mention de la transition vers AI Care.
  - [x] Marquer comme résolu le point de dette différé correspondant dans `docs/implementation-artifacts/deferred-work.md`.

- [x] Tâche 3 — Intégration SCSS, tokens et responsive (AC: 1, 3)
  - [x] Déclarer les styles scoped de la carte AI Care dans `app/pages/services.vue` en utilisant exclusivement les tokens de spacing, border, typography et color.
  - [x] S'assurer d'un rendu soigné en desktop et mobile (< 900px).
  - [x] Tester le contraste et l'alternance visuelle sur les thèmes sombre et clair.

- [x] Tâche 4 — Synchronisation Schema.org JSON-LD (AC: 4)
  - [x] Ajouter AI Care dans l'objet `servicesJsonLd` comme service d'exploitation (`@type: "Service"`).
  - [x] Enrichir les 3 services de build avec leur attribut `url` (`${siteUrl}/services#${offer.id}`, etc.).
  - [x] Marquer comme résolu le point de dette différé Schema.org dans `docs/implementation-artifacts/deferred-work.md`.

- [x] Tâche 5 — Validation transverse, accessibilité et Gate Docker Nitro SSG (AC: 5)
  - [x] Vérifier la navigation clavier, le focus visible et les attributs ARIA des nouveaux éléments interactifs.
  - [x] Exécuter la commande de validation Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Vérifier que les 28 routes statiques compilent sans erreur.

### Review Findings

- [x] [Review][Patch] Typographie et dimensionnement du glyphe de l'icône AI Care : documenter l'exception design kit 22px de ZIcon pour alignement architectural avec `.offer__icon` [`app/pages/services.vue:548`]

## Dev Notes

### Contexte & Guardrails
- **Fichier principal à modifier :** [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue).
- **Fichier de suivi de dette :** [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md).
- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans le `<style scoped>`.
- **Nuxt 4 Gotcha :** Conserver l'import explicite `import { NuxtLink } from "#components"` pour `:as="NuxtLink"`.

### Données Officielles V1.1 pour AI Care
```typescript
interface CareOffer {
  id: string;
  badge: string;
  title: string;
  price: string;
  desc: string;
  points: string[];
  disclaimer: string;
  ctaText: string;
  ctaAriaLabel: string;
}

const careOffer: CareOffer = {
  id: "ai-care",
  badge: "MAINTIEN EN CONDITION OPÉRATIONNELLE",
  title: "AI Care",
  price: "À partir de 250 € HT / mois",
  desc: "Pour les systèmes qui ont besoin d'être exploités, surveillés et adaptés dans la durée.",
  points: [
    "Monitoring proactif, détection d'erreurs & alertes d'anomalies",
    "Maintenance corrective & adaptation aux évolutions d'APIs tierces",
    "Suivi fin de consommation des tokens & ajustements de prompts",
    "Support technique réactif & veille sur les nouveaux modèles",
    "Mesure factuelle des KPI et optimisation continue du flux",
  ],
  disclaimer:
    "Consommations tierces d'APIs et tokens (LLM, OCR, scraping...) refacturées au réel ou prises en charge directement par le client. Pas d'engagement imposé au build.",
  ctaText: "Découvrir AI Care",
  ctaAriaLabel: "Découvrir l'accompagnement AI Care",
};
```

### Données Officielles V1.1 pour les 4 Étapes de Process
```typescript
const steps: Step[] = [
  {
    n: "01",
    title: "Diagnostic",
    desc: "Échange gratuit de 20 à 30 minutes pour qualifier le problème, comprendre le workflow existant, ses volumes, ses outils et identifier la friction réelle.",
    inlineCta: {
      to: "/contact",
      label: "Identifier un workflow →",
    },
  },
  {
    n: "02",
    title: "Cadrage",
    desc: "Définir la cible, ce qui doit être automatisé, ce qui reste humain et comment mesurer le résultat. Pour les sujets complexes, un Blueprint facturable (à partir de 750 € HT) peut être proposé lorsque le cadrage nécessite un travail approfondi avant devis.",
  },
  {
    n: "03",
    title: "Construction & intégration",
    desc: "Développer uniquement le niveau de système nécessaire (automatisation ciblée, workflow métier ou application sur mesure) et le tester sur des cas réels avant livraison.",
  },
  {
    n: "04",
    title: "Exploitation & mesure",
    desc: "Mise en production, mesure initiale de performance et maintien en condition opérationnelle lorsque le workflow le justifie (via AI Care).",
  },
];
```

### References
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-3](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md#Section-14](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Dette différée : docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)
- [Story précédente : docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-2-page-services-restructuration-3-offres-build-sur-devis-et-blueprint.md)

## Dev Agent Record

### Agent Model Used
- Gemini 3.7 Flash

### Debug Log References
- `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` -> Gate 100% verte (0 erreurs lint, 0 erreurs types, 28 routes statiques pré-rendues).

### Completion Notes List
- Création de la section dédiée AI Care (`.section.section--sunken.care-section`) dans `app/pages/services.vue` avec titre, prose de cadrage, badge « MAINTIEN EN CONDITION OPÉRATIONNELLE », icône `bot`, prix « À partir de 250 € HT / mois », 5 livrables et clause de transparence.
- Réalignement des 4 étapes du process avec mention du Blueprint facturable (à partir de 750 € HT) pour l'étape 02 Cadrage et renommage de l'étape 04 en « Exploitation & mesure » avec mention de transition vers AI Care.
- Alternance visuelle des sections en 3 temps : Build (`.section`), AI Care (`.section.section--sunken`), Process (`.section`).
- Synchronisation complète de Schema.org `servicesJsonLd` avec ajout d'AI Care et des attributs `url` pour les 4 offres.
- Résolution des deux dettes techniques différées de la story 15.2 dans `docs/implementation-artifacts/deferred-work.md`.

### File List
- `app/pages/services.vue` (modifié)
- `docs/implementation-artifacts/deferred-work.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
- `docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md` (modifié)

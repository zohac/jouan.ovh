# Story 15.2: Page Services — Restructuration des 3 Offres de Build sur Devis & Relégation du Blueprint

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospect consultant la page `/services`,
I want apprécier immédiatement les 3 niveaux d'intervention possibles et comprendre le positionnement sans prix plancher bloquant,
so that je puisse identifier le format adapté à mon organisation (FR50, CAP-2).

## Acceptance Criteria

1. **Given** la route `/services` (`app/pages/services.vue`)
   **When** la page est affichée
   **Then** le Hero présente le H1 officiel de l'Offre Commerciale V1.1 :
     > *« Le bon niveau de système pour le bon problème. »*
   **And** le texte d'introduction est centré sur le workflow plutôt que sur la technologie :
     > *« Je pars d'un workflow existant, pas d'une technologie à placer. Certaines frictions se règlent avec une automatisation simple. D'autres nécessitent plusieurs intégrations, de l'IA ou une véritable application métier. Le rôle du diagnostic est justement de déterminer jusqu'où il est utile d'aller. »*
   **And** l'eyebrow conserve la convention standard `<p class="eyebrow"><span aria-hidden="true">// </span>services</p>`.

2. **Given** la grille principale des offres de build (`.grid-3`) dans `app/pages/services.vue`
   **When** le visiteur consulte les offres
   **Then** les 3 cartes d'intervention sont présentées via `<ZCard>`, identifiées par des ancres HTML stables (`id="automatisation"`, `id="workflow"`, `id="sur-mesure"`) :
     1. **Automatisation ciblée :**
        - Badge / Eyebrow : `BESOIN PRÉCIS` (affiché via `<ZBadge tone="neutral">` ou `.offer__badge`)
        - Titre : `Automatisation ciblée`
        - Icône : `zap` (`<ZIcon name="zap" />`)
        - Accroche : `Supprimer une tâche répétitive sans reconstruire tout le processus.`
        - Description : `Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.`
        - Points clés / Livrables :
          - `Cartographie rapide du flux & cadrage du besoin`
          - `Automatisation logicielle & connecteurs API / webhooks`
          - `Traitement de données ou IA ciblée si pertinent`
          - `Contrôle ou validation humaine si requis`
          - `Tests, mise en production & documentation courte`
        - Prix : `Sur devis` (dans `.offer__price`, aucun prix d'entrée chiffré)
        - CTA : `Décrire mon besoin`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Décrire mon besoin pour une automatisation ciblée"` (variante `secondary`)
        - featured : `false`
     2. **Workflow métier :**
        - Badge / Eyebrow : `OFFRE CŒUR` (affiché via `<ZBadge tone="accent">`)
        - Titre : `Workflow métier` (mention optionnelle `AI Workflow Sprint`)
        - Icône : `layers` (`<ZIcon name="layers" />`)
        - Accroche : `Transformer un processus complet en système opérationnel.`
        - Description : `Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.`
        - Points clés / Livrables :
          - `Diagnostic approfondi & cartographie avant/après`
          - `Architecture système & connecteurs API métier`
          - `Modèles d'IA & prompt engineering avec sorties typées`
          - `Tests automatisés sur cas réels & boucle de validation humaine`
          - `Déploiement en production, documentation & mesure initiale`
        - Prix : `Sur devis` (dans `.offer__price`, suppression définitive de `À partir de 3 500 € HT`)
        - CTA : `Identifier un workflow`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Identifier un workflow métier"` (variante `primary`)
        - featured : `true` (carte mise en avant avec `:accent="true"` et `:featured="true"`)
     3. **Système métier sur mesure :**
        - Badge / Eyebrow : `PROJET COMPLEXE` (affiché via `<ZBadge tone="neutral">`)
        - Titre : `Système métier sur mesure`
        - Icône : `terminal` (`<ZIcon name="terminal" />`)
        - Accroche : `Construire l'application lorsque l'automatisation devient un vrai produit.`
        - Description : `Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.`
        - Points clés / Livrables :
          - `Interface web ou desktop adaptée aux opérateurs`
          - `Backend, base de données relationnelle & gestion des rôles`
          - `Orchestration multi-modèles & pipelines de données`
          - `Intégration profonde au SI (CRM, ERP, APIs métier)`
          - `Supervision avancée, tests automatisés & déploiement souverain`
        - Prix : `Sur devis` (dans `.offer__price`)
        - CTA : `Parler du projet`, bouton `<ZButton>` pointant vers `/contact` avec `:aria-label="Parler d'un projet de système métier sur mesure"` (variante `secondary`)
        - featured : `false`

3. **Given** la structure du catalogue d'offres
   **When** le visiteur visualise la page `/services`
   **Then** l'offre *AI Workflow Blueprint* est retirée des cartes de build principales pour devenir une option de cadrage dans la section process (anticipation Story 15.3).
   **And** la carte *AI Care* est retirée de la grille de build `.grid-3` pour ne pas la présenter comme un build équivalent (sa section dédiée post-déploiement fera l'objet de la Story 15.3).

4. **Given** les liens contextuels de la page d'accueil dans `app/pages/index.vue`
   **When** le visiteur clique sur l'un des liens d'exploration vers `/services`
   **Then** les liens pointent directement vers les ancres correspondantes (résolution de la dette différée issue de la Story 15.1) :
     - *Automatisation :* `/services#automatisation`
     - *Agents IA :* `/services#workflow`
     - *Applications sur mesure :* `/services#sur-mesure`
   **And** chaque carte cible dans `app/pages/services.vue` possède l'attribut `id` adéquat et un `scroll-margin-top: var(--space-16)` pour garantir un positionnement propre sous le header fixe.

5. **Given** les exigences de référencement (SEO), accessibilité (a11y) et qualité
   **When** la page est générée en statique (`pnpm generate`)
   **Then** l'objet JSON-LD `servicesJsonLd` (Schema.org `ItemList`) et `usePageSeo` sont alignés sur les 3 offres de build sans mention de "3 500 € HT".
   **And** aucun emoji n'est présent dans le code, les textes ou les composants (NFR6).
   **And** la suite de validation Docker Nitro SSG s'exécute avec 100% de succès :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

## Tasks / Subtasks

- [ ] Tâche 1 — Mise à jour du Hero H1 et de l'introduction dans `app/pages/services.vue` (AC: 1)
  - [ ] Mettre à jour le titre `h1.services__title` : `Le bon niveau de système pour le bon problème.`
  - [ ] Mettre à jour le paragraphe `p.prose.services__intro` avec le texte officiel V1.1 en 3 phrases.
  - [ ] Vérifier la typographie, les marges et la lisibilité sur mobile et desktop.

- [ ] Tâche 2 — Restructuration des données et du modèle `offers` (AC: 2, 3)
  - [ ] Adapter l'interface TypeScript `Offer` dans `<script setup>` pour supporter `badgeText?: string` ou `badgeTone?: "accent" | "neutral"`.
  - [ ] Remplacer les 3 anciennes offres (`sprint`, `blueprint`, `care`) par les 3 offres de build :
    - `automatisation` (id: `automatisation`, icon: `zap`, badge: `BESOIN PRÉCIS`, price: `Sur devis`)
    - `workflow` (id: `workflow`, icon: `layers`, badge: `OFFRE CŒUR`, featured: true, price: `Sur devis`)
    - `sur-mesure` (id: `sur-mesure`, icon: `terminal`, badge: `PROJET COMPLEXE`, price: `Sur devis`)
  - [ ] Renseigner pour chacune les 5 points de livrables précis.
  - [ ] Configurer les libellés de CTA et `:aria-label` accessibles (`Décrire mon besoin`, `Identifier un workflow`, `Parler du projet`).

- [ ] Tâche 3 — Template, ancres et intégration visuelle des badges (AC: 2, 4)
  - [ ] Ajouter l'attribut `:id="offer.id"` sur le conteneur de carte `<li>` ou `<ZCard>` avec la classe de scroll margin (`scroll-margin-top`).
  - [ ] Afficher `<ZBadge>` pour chaque carte selon son niveau d'intervention (`BESOIN PRÉCIS`, `OFFRE CŒUR`, `PROJET COMPLEXE`).
  - [ ] S'assurer que le bas de carte (`.offer__footer`) aligne proprement le prix `Sur devis` et le bouton `<ZButton>`.
  - [ ] Mettre à jour les 3 liens contextuels de `app/pages/index.vue` pour cibler `/services#automatisation`, `/services#workflow`, `/services#sur-mesure`.

- [ ] Tâche 4 — Synchronisation SEO et données structurées Schema.org (AC: 5)
  - [ ] Aligner `servicesJsonLd` sur les 3 nouvelles offres de build avec `offers.description = "Sur devis"`.
  - [ ] Mettre à jour la balise meta `description` dans `usePageSeo` pour supprimer toute référence à l'ancien catalogue tarifaire (3 500 € HT, Blueprint en build).

- [ ] Tâche 5 — Validation a11y, responsive et Gate Docker Nitro SSG (AC: 5)
  - [ ] Tester la navigation clavier (`Tab`) et le focus visible sur les boutons des 3 cartes.
  - [ ] Vérifier le rendu sur mobile (< 900px) et la parité visuelle sur les thèmes clair et sombre.
  - [ ] Exécuter la commande de validation Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [ ] Vérifier que les 28 routes statiques pré-rendues compilent sans erreur ni avertissement.

## Dev Notes

### Contexte & Guardrails
- **Fichier principal à modifier :** [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue).
- **Fichier secondaire (résolution dette différée 15.1) :** [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) (mise à jour des liens `to="/services#..."`).
- **Fichier de suivi :** [`docs/implementation-artifacts/deferred-work.md`](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md).
- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
- **Nuxt 4 Gotcha :** Ne pas injecter de chaîne brute pour `:as="NuxtLink"`, conserver l'import explicite `import { NuxtLink } from "#components"`.

### Modèle TypeScript des Offres de Build
```typescript
interface Offer {
  id: string;
  icon: string;
  badge: string;
  badgeTone?: "accent" | "neutral";
  title: string;
  hook?: string;
  desc: string;
  points: string[];
  price: string;
  disclaimer?: string;
  featured: boolean;
  ctaText: string;
  ctaAriaLabel: string;
}
```

### Données Officielles V1.1 pour les 3 Offres de Build
```typescript
const offers: Offer[] = [
  {
    id: "automatisation",
    icon: "zap",
    badge: "BESOIN PRÉCIS",
    badgeTone: "neutral",
    title: "Automatisation ciblée",
    hook: "Supprimer une tâche répétitive sans reconstruire tout le processus.",
    desc: "Pour les besoins bien délimités : données, emails, documents, CRM, synchronisation, génération ou traitement automatisé.",
    points: [
      "Cartographie rapide du flux & cadrage du besoin",
      "Automatisation logicielle & connecteurs API / webhooks",
      "Traitement de données ou IA ciblée si pertinent",
      "Contrôle ou validation humaine si requis",
      "Tests, mise en production & documentation courte",
    ],
    price: "Sur devis",
    featured: false,
    ctaText: "Décrire mon besoin",
    ctaAriaLabel: "Décrire mon besoin pour une automatisation ciblée",
  },
  {
    id: "workflow",
    icon: "layers",
    badge: "OFFRE CŒUR",
    badgeTone: "accent",
    title: "Workflow métier",
    hook: "Transformer un processus complet en système opérationnel.",
    desc: "Pour les workflows qui traversent plusieurs étapes ou outils : cartographie, intégrations, automatisation, IA ciblée, contrôle humain, tests et mise en production.",
    points: [
      "Diagnostic approfondi & cartographie avant/après",
      "Architecture système & connecteurs API métier",
      "Modèles d'IA & prompt engineering avec sorties typées",
      "Tests automatisés sur cas réels & boucle de validation humaine",
      "Déploiement en production, documentation & mesure initiale",
    ],
    price: "Sur devis",
    featured: true,
    ctaText: "Identifier un workflow",
    ctaAriaLabel: "Identifier un workflow métier",
  },
  {
    id: "sur-mesure",
    icon: "terminal",
    badge: "PROJET COMPLEXE",
    badgeTone: "neutral",
    title: "Système métier sur mesure",
    hook: "Construire l'application lorsque l'automatisation devient un vrai produit.",
    desc: "Interface, backend, base de données, authentification, intégrations, IA, rôles, supervision et déploiement.",
    points: [
      "Interface web ou desktop adaptée aux opérateurs",
      "Backend, base de données relationnelle & gestion des rôles",
      "Orchestration multi-modèles & pipelines de données",
      "Intégration profonde au SI (CRM, ERP, APIs métier)",
      "Supervision avancée, tests automatisés & déploiement souverain",
    ],
    price: "Sur devis",
    featured: false,
    ctaText: "Parler du projet",
    ctaAriaLabel: "Parler d'un projet de système métier sur mesure",
  },
];
```

### Style de l'Ancrage et du Scroll Margin
Ajouter sur l'élément cible :
```scss
.offer {
  scroll-margin-top: var(--space-16); // Évite que l'en-tête fixe ne masque le haut de la carte
}
```

### References
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-2](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md#Section-13](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Dette différée : docs/implementation-artifacts/deferred-work.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/deferred-work.md)
- [Story précédente : docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-1-homepage-suppression-prix-dentree-liens-contextuels-et-reassurance.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

### Change Log

---
baseline_commit: f17191467b2cd4aabf147f50b0dace4121255040
---

# Story 15.1: Homepage — Suppression des Prix d'Entrée, Liens Contextuels & Phrase de Réassurance

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur découvrant la page d'accueil,
I want comprendre que Simon intervient aussi bien sur une automatisation ciblée que sur un workflow complet sans imposer un ticket d'entrée public à 3 500 € HT,
so that je me sente libre de le contacter pour qualifier mon besoin réel (FR49, NFR6, CAP-1).

## Acceptance Criteria

1. **Given** la section expertises de `app/pages/index.vue`
   **When** le visiteur consulte les 3 cartes de services (`services`)
   **Then** la propriété `price: "À partir de 3 500 € HT"` est intégralement retirée des données des cartes *Automatisation de processus métier* et *Agents IA intégrés à vos outils*
   **And** l'élément `.offer__price` affichant ce montant est supprimé du template HTML pour éliminer tout ancrage tarifaire public à 3 500 € HT.

2. **Given** les 3 cartes de services de la homepage dans `app/pages/index.vue`
   **When** le visiteur lit le bas de chaque carte
   **Then** le lien générique `En savoir plus →` est remplacé par un lien d'exploration contextuel ciblant `/services` spécifique à chaque offre :
     - *Automatisation de processus métier :* `Voir les types d'automatisation →`
     - *Agents IA intégrés à vos outils :* `Voir quand utiliser un agent →`
     - *Applications IA sur mesure :* `Découvrir les projets sur mesure →`
   **And** chaque lien conserve l'attribut `:aria-label` accessible explicite et le pseudo-élément étendu `&::after` rendant toute la carte cliquable.

3. **Given** la section des expertises ou sa transition vers le bloc différenciateur dans `app/pages/index.vue`
   **When** l'utilisateur parcourt la zone
   **Then** un bloc ou paragraphe de réassurance sobre inspiré du terminal est affiché :
     > *« Un besoin simple ne nécessite pas forcément un gros projet. Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet. »*
   **And** la mise en forme utilise une bordure subtile (`var(--border-subtle)`), une couleur de texte secondaire (`var(--text-muted)` ou `var(--text-body)`), et respecte la parité des thèmes sombre et clair.

4. **Given** les exigences d'accessibilité (a11y), responsive et qualité globale
   **When** la page d'accueil est affichée sur mobile (< 900px, < 680px), sur desktop ou naviguée au clavier
   **Then** aucun emoji n'est présent dans l'interface ou les textes (NFR6)
   **And** le focus clavier (`Tab`) met en évidence les liens contextuels avec l'outline accessible (`:focus-visible`)
   **And** la suite de validation Docker Nitro SSG s'exécute avec 100% de succès :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

## Tasks / Subtasks

- [x] Tâche 1 — Mise à jour des données et suppression des prix dans `app/pages/index.vue` (AC: 1, 2)
  - [x] Modifier l'interface `HomeServiceOffer` dans `<script setup>` pour ajouter `actionText: string` et retirer `price?: string`.
  - [x] Mettre à jour le tableau `services` :
    - *Automatisation :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir les types d'automatisation →"`
    - *Agents IA :* retirer `price: "À partir de 3 500 € HT"`, ajouter `actionText: "Voir quand utiliser un agent →"`
    - *Applications sur mesure :* retirer `price: "Sur mesure / Sprint"`, ajouter `actionText: "Découvrir les projets sur mesure →"`
  - [x] Supprimer le bloc `<div class="offer__price">` du template et afficher `service.actionText` dans le `<NuxtLink class="offer__more">`.

- [x] Tâche 2 — Intégration du composant / bloc de réassurance (AC: 3)
  - [x] Insérer l'encart de réassurance sous la grille des services `.grid-3` ou en amont du bloc `.diff-block` dans `app/pages/index.vue`.
  - [x] Styliser l'encart avec les tokens SCSS (`var(--space-*)`, `var(--radius-*)`, `var(--border-subtle)`, `var(--surface-sunken)` ou `var(--surface-card)`).
  - [x] Vérifier la lisibilité sur thème sombre aubergine et thème clair technique.

- [x] Tâche 3 — Nettoyage SCSS et vérification a11y & responsive (AC: 2, 4)
  - [x] Adapter la règle `.offer__more` pour qu'elle assure la séparation visuelle supérieure précédemment portée par `.offer__price` (`margin-top: auto; padding-top: var(--space-4); border-top: 1px dashed var(--border-subtle);`).
  - [x] Nettoyer la classe `.offer__price` devenue obsolète.
  - [x] Valider l'adaptation responsive sur petit écran.

- [x] Tâche 4 — Validation Docker Nitro SSG (AC: 4)
  - [x] Exécuter la commande `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript et 13 routes statiques générées.

### Review Findings

- [x] [Review][Patch] Refonte de l'encart de réassurance en mini-terminal compact centré (AC-3) [`app/pages/index.vue:88`] — Remplacer le grand bloc plat par un composant mini-terminal centré (max-width ~780px, barre supérieure avec prompt `anon@jouan.ovh:~$ cat note.txt`, fond sobre et typographie contrastée).
- [x] [Review][Patch] Accessibilité des liens contextuels `.offer__more` (AC-2) [`app/pages/index.vue:80`] — Isoler la flèche `→` dans un `<span aria-hidden="true">` et contextualiser le nom accessible `:aria-label` avec le titre de l'offre pour éviter la verbalisation de la flèche par les lecteurs d'écran.
- [x] [Review][Patch] Espacement et finition du bas des cartes `.offer` (AC-2, AC-4) [`app/pages/index.vue:716`] — Remplacer la bordure pointillée brute directement collée au texte de lien par un séparateur ou espacement harmonieux préservant l'alignement vertical entre cartes.
- [x] [Review][Defer] Ancrage des liens contextuels vers les sections dédiées de `/services` [`app/pages/index.vue:80`] — deferred, pre-existing (prévu dans Story 15.2 qui refond `/services` et installe les sections cibles).
- [x] [Review][Defer] Prix résiduels de 3 500 € HT sur la page `/services` [`app/pages/services.vue`] — deferred, pre-existing (prévu dans Story 15.2 dédiée au catalogue services).

## Dev Notes

### Contexte & Guardrails
- **Fichier unique à modifier :** [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue).
- **Zéro Emoji :** Règle NFR6 absolue. Les puces et icônes passent par `<ZIcon>` ou du pur CSS.
- **Tokens uniquement :** Consommer les variables de design system `var(--token)`.
- **Règle Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.

### Structure Actuelle de la Carte dans `index.vue`
```vue
<ZCard class="offer" interactive tilt :accent="service.featured" :featured="service.featured">
  <div class="offer__top">
    <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    <span class="offer__no">{{ service.no }}</span>
  </div>
  <h3 class="offer__title">{{ service.title }}</h3>
  <p class="offer__desc">{{ service.desc }}</p>
  <ul class="offer__points">...</ul>
  <ul class="hero__tags offer__tags">...</ul>
  <!-- SUPPRIMER : <div class="offer__price"><span>{{ service.price }}</span></div> -->
  <NuxtLink to="/services" class="offer__more" :aria-label="service.actionText">
    {{ service.actionText }}
  </NuxtLink>
</ZCard>
```

### Emplacement Recommandé pour la Réassurance
Immédiatement après le `</ul>` de `.grid-3` :
```vue
<div class="services-reassurance">
  <p class="services-reassurance__text">
    <strong>Un besoin simple ne nécessite pas forcément un gros projet.</strong>
    Je dimensionne la solution selon le workflow réel : parfois quelques automatisations suffisent ; parfois il faut construire un système métier complet.
  </p>
</div>
```

### References
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md#Section-11-et-12](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Sprint Change Proposal : docs/planning-artifacts/sprint-change-proposal-2026-09-18.md](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/sprint-change-proposal-2026-09-18.md)
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-1](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used
Gemini 3.7 Flash / Antigravity

### Debug Log References
- Résolution d'un saut de ligne Prettier sur `app/pages/index.vue`.

### Completion Notes List
- ✅ **AC1 & AC2 :** Retrait de la propriété `price` et de la classe `.offer__price` dans `app/pages/index.vue`. Remplacement par `actionText` avec libellés contextuels (`Voir les types d'automatisation →`, `Voir quand utiliser un agent →`, `Découvrir les projets sur mesure →`) et accessibilité conservée.
- ✅ **AC3 :** Intégration de l'encart `.services-reassurance` avec la phrase clé de désancrage tarifaire et stylisation via les tokens (`var(--surface-1)`, `var(--border-subtle)`, `var(--radius-md)`, `var(--text-body)`, `var(--text-strong)`).
- ✅ **AC4 :** Validation complète via Docker Nitro SSG (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) avec 0 erreur et 100% de succès.

### File List
- `app/pages/index.vue` (modifié)

### Change Log
- 2026-09-18 : Implémentation complète de la Story 15.1 (Désancrage tarifaire homepage, liens contextuels et encart de réassurance).

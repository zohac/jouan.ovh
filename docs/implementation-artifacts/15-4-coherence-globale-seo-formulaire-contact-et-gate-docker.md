---
baseline_commit: 7c84ab3d4ce0f562bd860a256a374aa980f52082
---

# Story 15.4: Cohérence Globale, SEO, Formulaire de Contact & Gate Docker Nitro SSG

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a développeur garantissant la qualité globale du projet jouan.ovh,
I want auditer l'ensemble des parcours, formulaires, balises SEO et valider la compilation statique Nitro,
so that le site soit exempt de régressions fonctionnelles, visuelles, d'accessibilité ou de dépositionnement commercial (FR52, NFR4, NFR6, CAP-4).

## Acceptance Criteria

1. **Given** l'ensemble des parcours de conversion de `jouan.ovh`
   **When** on audite le CTA final global (`app/pages/index.vue`, `app/pages/blog/[...slug].vue`) et la page de contact (`app/pages/contact/index.vue`)
   **Then** le CTA final de conversion maintient l'accroche officielle :
     - Eyebrow : `<p class="eyebrow"><span aria-hidden="true">$ </span>./workflow --inspect</p>`
     - Titre : `Quel process vous fait perdre du temps chaque semaine ?`
     - Sous-titre : cadrage sur le fonctionnement du workflow sans aucune mention tarifaire bloquante.
   **And** le formulaire de contact dans `app/pages/contact/index.vue` qualifie le processus sans champ de budget obligatoire (questions centrées sur l'entreprise, la fréquence, le processus à améliorer et le fonctionnement actuel).
   **And** la chaîne d'envoi Web3Forms transmet l'objet qualifié (`subject: Qualification de workflow : ...`) et gère gracieusement le honeypot anti-spam ainsi que l'état d'envoi.

2. **Given** l'ensemble des 13 routes applicatives du site
   **When** on inspecte les métadonnées SEO OpenGraph/Twitter et les données structurées Schema.org injectées par `usePageSeo()`
   **Then** toutes les méta-descriptions et entités JSON-LD sont parfaitement alignées sur l'Offre Commerciale V1.1 (systèmes IA, automatisation de processus métier, offres sur devis, AI Care dès 250 € HT / mois, Blueprint dès 750 € HT).
   **And** aucune mention obsolète de l'ancien tarif d'entrée « 3 500 € HT » ou « 3500 » ne subsiste sur le site, ni dans le balisage HTML pré-rendu, ni dans les scripts, ni dans les données structurées.

3. **Given** la bascule de thème clair et sombre (acquis Epic 13)
   **When** les pages modifiées dans le cadre de l'Epic 15 (`app/pages/index.vue`, `app/pages/services.vue`, `app/pages/contact/index.vue`) sont affichées en mode sombre (`[data-theme="dark"]`) et en mode clair (`[data-theme="light"]`)
   **Then** le contraste de l'ensemble des textes, badges, icônes et boutons interactifs respecte le standard WCAG AA (ratio >= 4.5:1 pour le texte normal, >= 3:1 pour les composants d'interface).
   **And** tous les styles consomment exclusivement les tokens SCSS `var(--token)` du design system sans valeur arbitraire en dur non documentée.

4. **Given** la suite de validation de qualité du projet (Definition of Done)
   **When** la commande de contrôle Docker est exécutée
   **Then** la gate réussit avec 0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript `vue-tsc` et 28 routes statiques pré-rendues avec succès par Nitro :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```

5. **Given** la validation complète de la Story 15.4
   **When** tous les critères d'acceptation sont vérifiés
   **Then** l'Epic 15 (« Repositionnement Commercial V1.1 ») est prêt à être clôturé avec l'ensemble de ses stories (15.1, 15.2, 15.3, 15.4) au statut `done` dans `sprint-status.yaml`.

## Tasks / Subtasks

- [ ] Tâche 1 — Audit et validation du CTA final global et du formulaire de contact (AC: 1)
  - [ ] Vérifier le composant de CTA final dans `app/pages/index.vue` (L286-308) et `app/pages/blog/[...slug].vue` (L45-63) : accroche, terminal décoratif et redirection `/contact`.
  - [ ] Vérifier `app/pages/contact/index.vue` : s'assurer de l'absence de champ budget, conformité du libellé de bouton « Décrire mon workflow », accessibilité a11y (focus premier champ invalide, honeypot masqué) et message de confirmation.
  - [ ] Tester l'absence d'erreurs d'hydratation ou de validation réseau.

- [ ] Tâche 2 — Audit transverse SEO, OpenGraph et données structurées Schema.org (AC: 2)
  - [ ] Auditer `usePageSeo` sur toutes les routes statiques :
    - `/` (`app/pages/index.vue`)
    - `/services` (`app/pages/services.vue`)
    - `/about` (`app/pages/about.vue`)
    - `/contact` (`app/pages/contact/index.vue`)
    - `/contact/card` (`app/pages/contact/card.vue`)
    - `/blog` (`app/pages/blog/index.vue`)
    - `/confidentialite` (`app/pages/confidentialite.vue`)
    - `/mentions-legales` (`app/pages/mentions-legales.vue`)
  - [ ] Vérifier l'alignement des objets JSON-LD (`WebPage`, `Service`, `ItemList`, `Person`, `ContactPage`, `ProfilePage`, `Blog`) sans prix d'entrée 3 500 € HT.
  - [ ] Lancer une recherche grep globale sur `3 500`, `3500`, `490` pour garantir l'élimination totale de l'ancien catalogue dans `app/`.

- [ ] Tâche 3 — Vérification du contraste thèmes Sombre & Clair et tokens SCSS (AC: 3)
  - [ ] Contrôler visuellement et fonctionnellement les pages `services.vue`, `index.vue` et `contact/index.vue` sous les deux thèmes.
  - [ ] Vérifier la lisibilité des badges (`<ZBadge>`), des cartes (`<ZCard>`), des bordures subtiles et de l'alternance de sections (`.section` / `.section--sunken`).
  - [ ] S'assurer qu'aucun style scoped ne redéclare les primitives globales de layout (`.section`, `.container`, `.eyebrow`, `.prose`).

- [ ] Tâche 4 — Exécution de la Gate Docker Nitro SSG et synchronisation de sprint (AC: 4, 5)
  - [ ] Exécuter la commande Docker de validation :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [ ] Vérifier que les 28 routes statiques compilent proprement dans `.output/public`.
  - [ ] Mettre à jour `docs/implementation-artifacts/sprint-status.yaml` pour marquer la story 15.4 et l'epic-15.

## Dev Notes

### Contexte & Guardrails
- **Fichiers principaux à inspecter / valider :**
  - [`app/pages/contact/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/contact/index.vue)
  - [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue)
  - [`app/pages/services.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/services.vue)
  - [`app/pages/blog/[...slug].vue`](file:///Users/simon/dev/jouan.ovh/app/pages/blog/[...slug].vue)
  - [`app/composables/usePageSeo.ts`](file:///Users/simon/dev/jouan.ovh/app/composables/usePageSeo.ts)
- **Règle d'or Docker :** Ne JAMAIS lancer `pnpm` sur l'hôte macOS arm64.
- **Règle NFR6 :** Zéro emoji dans l'UI et le code. Utiliser les icônes vectorielles du composant `<ZIcon>`.
- **Règle Tokens :** Utiliser exclusivement `var(--token)`.
- **Règle Layout SCSS :** Ne pas redéclarer `.section`, `.section--sunken`, `.container`, `.eyebrow`, `.prose` dans les styles scoped.

### Inventaire des Pages et Appels usePageSeo
| Route | Fichier | Titre SEO | JSON-LD Type |
|-------|---------|-----------|--------------|
| `/` | `app/pages/index.vue` | Simon Jouan — Systèmes IA, agents & automatisation métier | WebSite, Person |
| `/services` | `app/pages/services.vue` | Services & Systèmes IA — Simon Jouan | WebPage, ItemList (4 Services) |
| `/about` | `app/pages/about.vue` | À propos — Simon Jouan | ProfilePage, Person |
| `/contact` | `app/pages/contact/index.vue` | Contact — Simon Jouan | ContactPage, Person |
| `/contact/card` | `app/pages/contact/card.vue` | Carte de visite — Simon Jouan | ProfilePage |
| `/blog` | `app/pages/blog/index.vue` | Notes de dev | Blog, BlogPosting[] |
| `/blog/:slug` | `app/pages/blog/[...slug].vue` | (Titre article) — Simon Jouan | BlogPosting |
| `/confidentialite` | `app/pages/confidentialite.vue` | Politique de confidentialité — Simon Jouan | WebPage |
| `/mentions-legales` | `app/pages/mentions-legales.vue` | Mentions légales — Simon Jouan | WebPage |

### References
- [Cahier des Epics : docs/planning-artifacts/epics.md#Story-15-4](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/epics.md)
- [Sprint Change Proposal : docs/planning-artifacts/sprint-change-proposal-2026-09-18.md](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/sprint-change-proposal-2026-09-18.md)
- [Source de vérité Offre V1.1 : docs/jouan-ovh-offre-commerciale-v1.1-updated.md](file:///Users/simon/dev/jouan.ovh/docs/jouan-ovh-offre-commerciale-v1.1-updated.md)
- [Directives et Invariants : AGENTS.md](file:///Users/simon/dev/jouan.ovh/AGENTS.md)
- [Story précédente : docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md](file:///Users/simon/dev/jouan.ovh/docs/implementation-artifacts/15-3-page-services-section-dediee-ai-care-et-process-4-etapes.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

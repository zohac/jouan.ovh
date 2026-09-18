---
baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
---

# Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a utilisateur sur desktop ou smartphone,
I want disposer d'un bouton de bascule compact placé à gauche du statut « Disponible » dans le dock d'état et dans le menu mobile,
so that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).

## Acceptance Criteria

1. **Given** le composant `app/components/ui/ZIcon.vue`
   **When** on affiche une icône système ou de thème
   **Then** 3 nouvelles icônes vectorielles inline sans emoji (`monitor`, `moon`, `sun`) sont déclarées dans `STROKE` :
     - `monitor` : Écran épuré avec pied (mode système auto)
     - `moon` : Croissant de lune technique minimaliste (mode sombre forcé)
     - `sun` : Cercle central avec 8 rayons géométriques nets (mode clair forcé)
   **And** elles héritent fidèlement de `currentColor`, utilisent `viewBox="0 0 24 24"` avec `stroke-width="2"` et respectent le style Lucide du design system.

2. **Given** le composable `useTheme()` posé en Story 13.2
   **When** on crée le composant `app/components/ui/ThemeToggle.vue`
   **Then** il expose un bouton interactif compact `<button type="button">` :
     - Format compact : `36px × 36px` sur desktop, `40px × 40px` sur mobile (respect des cibles tactiles WCAG 2.5.5 / 2.5.8)
     - Rayon de courbure : `var(--radius-md)` (8px)
     - Clic ou activation clavier (`Entrée` / `Espace`) déclenche `cycleTheme()` : transition cyclique `system → dark → light → system`
     - Affiche l'icône `<ZIcon>` correspondant à l'état de préférence courant (`monitor` pour `system`, `moon` pour `dark`, `sun` pour `light`)
     - Propose un `aria-label` dynamique décrivant précisément le mode actif et la prochaine action :
       - `system` avec OS sombre : `"Thème : Système (Sombre actif). Cliquer pour forcer le mode Sombre."`
       - `system` avec OS clair : `"Thème : Système (Clair actif). Cliquer pour forcer le mode Sombre."`
       - `dark` : `"Thème : Sombre forcé. Cliquer pour forcer le mode Clair."`
       - `light` : `"Thème : Clair forcé. Cliquer pour revenir au mode Système."`
     - Intègre une infobulle native `title="Changer de thème (Système / Sombre / Clair)"`
     - Dispose d'une région live accessible masquée (`<span class="screen-reader-text" aria-live="polite">`) annonçant le changement aux technologies d'assistance : `"Mode [Sombre / Clair / Système] activé."`
     - Supporte le focus visible via `box-shadow: var(--ring-accent)`, le repli standard `outline: 2px solid transparent; outline-offset: 2px;` pour le mode `forced-colors: active`
     - Neutralise toute rotation ou transition cinétique d'icône sous `prefers-reduced-motion: reduce`.

3. **Given** la barre de navigation globale `app/components/HeaderComponent.vue`
   **When** le visiteur navigue sur le site
   **Then** le composant `ThemeToggle` est intégré aux deux emplacements requis :
     1. **Desktop :** dans `.hdr__dock-right`, immédiatement à gauche de `.hdr__status-badge` (« Disponible »), séparé par `var(--space-3)` (12px)
     2. **Mobile :** dans `.hdr__menu-status`, aligné avec le badge de statut et l'horloge
   **And** sur résolutions desktop intermédiaires (`901px <= width <= 1650px`), le bouton `ThemeToggle` reste accessible et visible pour les utilisateurs sur ordinateur portable (en masquant l'horloge et le badge si l'espace manque, mais en maintenant le contrôle du thème).

4. **Given** la suite d'outillage et les standards de code du projet
   **When** on exécute la vérification dans Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript (vue-tsc) et 24 routes SSG pré-rendues sans anomalie.

## Tasks / Subtasks

- [x] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
  - [x] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
    ```typescript
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    ```
  - [x] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.

- [x] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
  - [x] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
  - [x] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
  - [x] Définir les computed properties pour :
    - `currentIcon`: `'monitor' | 'moon' | 'sun'`
    - `ariaLabel`: libellé dynamique complet selon l'état actif et l'OS
    - `liveAnnouncement`: message pour la live region (`"Mode Sombre activé."`, etc.)
  - [x] Implémenter la structure de template :
    ```html
    <button
      type="button"
      class="theme-toggle"
      :aria-label="ariaLabel"
      title="Changer de thème (Système / Sombre / Clair)"
      @click="handleToggle"
    >
      <ZIcon :name="currentIcon" class="theme-toggle__icon" />
      <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
    </button>
    ```
  - [x] Implémenter les styles SCSS scopés :
    - Format compact : `width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;`
    - Variantes de surface : repos `background: var(--surface-1)`, bordure `1px solid var(--border-subtle)`, couleur `var(--text-muted)`
    - États interactifs : hover `background: var(--surface-2)`, `border-color: var(--border-strong)`, `color: var(--text-strong)`, `transform: translateY(-1px)`
    - Focus visible : `box-shadow: var(--ring-accent); outline: 2px solid transparent; outline-offset: 2px;`
    - Repli `forced-colors: active`
    - Animation de rotation d'icône fluide `transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard);`
    - Neutralisation complète de l'animation sous `@media (prefers-reduced-motion: reduce)`.

- [x] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
  - [x] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
  - [x] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
  - [x] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
  - [x] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.

- [x] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
  - [x] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
  - [x] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.

### Review Findings

- [x] [Review][Patch] Restreindre le masquage responsive à `.hdr__dock-right .hdr__status-badge` pour préserver l'indicateur de statut « Disponible » dans le menu mobile [`app/components/HeaderComponent.vue:531-536`]
- [x] [Review][Patch] Neutraliser l'effet de hover tactile sous `@media (hover: none)` sur le bouton `ThemeToggle` pour éviter les états survolés persistants sur smartphone [`app/components/ui/ThemeToggle.vue:73-78`]
- [x] [Review][Defer] Focus clavier non redirigé lors d'un redimensionnement dynamique mobile vers desktop (> 900px) avec menu ouvert [`app/components/HeaderComponent.vue:209-214`] — deferred, pre-existing

## Dev Notes

### Architecture logicielle & Contrats d'API
- **Fichier principal à créer :** `app/components/ui/ThemeToggle.vue`
- **Fichiers à modifier :**
  - `app/components/ui/ZIcon.vue` (déclaration des tracés `monitor`, `moon`, `sun`)
  - `app/components/HeaderComponent.vue` (intégration template et styles responsives)
- **Fichiers de référence :**
  - Architecture technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md#Section 4)
  - Spécification UX : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md)
  - Spécification Design : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md)
  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Piège d'implémentation critique à éviter (Détecté lors de l'analyse)
Dans `app/components/HeaderComponent.vue`, la classe `.hdr__dock-right` contient actuellement une règle responsive masquant l'intégralité du dock sur les largeurs moyennes :
```scss
@media (width <= 1650px) {
  .hdr__dock-right {
    display: none;
  }
}
```
Si `ThemeToggle` est inséré naïvement dans `.hdr__dock-right` sans ajuster cette règle, **tous les visiteurs sur ordinateurs portables (écrans 13", 14", 15", 16", résolutions 1080p, 1366px, 1440px) perdraient totalement l'accès au ThemeToggle**, car le burger mobile n'apparaît qu'en dessous de 900px !
**Solution obligatoire :** Sur l'intervalle `901px <= width <= 1650px`, masquer `.hdr__dock-clock` et `.hdr__status-badge`, mais **conserver `.hdr__dock-right` et `ThemeToggle` visibles**. Avec 36px de largeur, le bouton s'insère sans aucun risque de collision dans les marges latérales du header.

## Dev Agent Record

### Agent Model Used
- Google Gemini 2.5 Flash / Pro (Antigravity IDE)

### Debug Log References
- Gate Docker validée avec succès : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 24 routes SSG pré-rendues).
- Correction Stylelint BEM sur `ThemeToggle.vue` avec `/* stylelint-disable selector-class-pattern -- convention BEM */`.

### Completion Notes List
- ✅ **Icônes vectorielles** : Tracés `monitor`, `moon` et `sun` ajoutés dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` au format SVG inline Lucide `0 0 24 24` avec `stroke-width="2"`, héritant fidèlement de `currentColor`.
- ✅ **Composant ThemeToggle** : Composant `app/components/ui/ThemeToggle.vue` créé avec `useTheme()`, rotation d'icône fluide, infobulle native `title`, `aria-label` dynamique contextualisé (OS et prochaine action), région live accessible `aria-live="polite"` pour lecteurs d'écran, support du focus visible DS et mode `forced-colors: active`, et neutralisation `prefers-reduced-motion`.
- ✅ **Intégration Header & Mobile** : `ThemeToggle` intégré dans `.hdr__dock-right` (desktop) et dans `.hdr__menu-status` (menu mobile). Règle responsive `@media (width <= 1650px)` ajustée pour masquer uniquement l'horloge et le badge de disponibilité, tout en maintenant `ThemeToggle` visible et accessible sur les écrans d'ordinateurs portables (`901px <= width <= 1650px`).
- ✅ **Validation Qualité** : Gate Docker 100% verte (0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript vue-tsc, 24 routes SSG générées).

### File List
- `app/components/ui/ZIcon.vue` (modifié)
- `app/components/ui/ThemeToggle.vue` (créé)
- `app/components/HeaderComponent.vue` (modifié)
- `docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md` (modifié)
- `docs/implementation-artifacts/sprint-status.yaml` (modifié)

## Change Log
- 2026-09-18 : Implémentation complète de la Story 13.3 (ZIcon monitor/moon/sun, ThemeToggle.vue, intégration Header desktop & menu mobile, responsive dock preservation). Statut passé à "review".

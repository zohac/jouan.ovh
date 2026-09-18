---
baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
---

# Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

Status: ready-for-dev

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

- [ ] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
  - [ ] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
    ```typescript
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    ```
  - [ ] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.

- [ ] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
  - [ ] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
  - [ ] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
  - [ ] Définir les computed properties pour :
    - `currentIcon`: `'monitor' | 'moon' | 'sun'`
    - `ariaLabel`: libellé dynamique complet selon l'état actif et l'OS
    - `liveAnnouncement`: message pour la live region (`"Mode Sombre activé."`, etc.)
  - [ ] Implémenter la structure de template :
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
  - [ ] Implémenter les styles SCSS scopés :
    - Format compact : `width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;`
    - Variantes de surface : repos `background: var(--surface-1)`, bordure `1px solid var(--border-subtle)`, couleur `var(--text-muted)`
    - États interactifs : hover `background: var(--surface-2)`, `border-color: var(--border-strong)`, `color: var(--text-strong)`, `transform: translateY(-1px)`
    - Focus visible : `box-shadow: var(--ring-accent); outline: 2px solid transparent; outline-offset: 2px;`
    - Repli `forced-colors: active`
    - Animation de rotation d'icône fluide `transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard);`
    - Neutralisation complète de l'animation sous `@media (prefers-reduced-motion: reduce)`.

- [ ] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
  - [ ] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
  - [ ] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
  - [ ] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
  - [ ] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.

- [ ] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
  - [ ] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
  - [ ] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.

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

### Code Snippet de référence pour `ThemeToggle.vue`

```html
<template>
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
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "~/composables/useTheme";

const { preference, resolvedTheme, cycleTheme } = useTheme();
const liveAnnouncement = ref("");

const currentIcon = computed(() => {
  if (preference.value === "system") return "monitor";
  if (preference.value === "dark") return "moon";
  return "sun";
});

const ariaLabel = computed(() => {
  if (preference.value === "system") {
    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
    return `Thème : Système (${activeResolved} actif). Cliquer pour forcer le mode Sombre.`;
  }
  if (preference.value === "dark") {
    return "Thème : Sombre forcé. Cliquer pour forcer le mode Clair.";
  }
  return "Thème : Clair forcé. Cliquer pour revenir au mode Système.";
});

const handleToggle = () => {
  cycleTheme();
  const labels: Record<string, string> = {
    system: "Système",
    dark: "Sombre",
    light: "Clair",
  };
  liveAnnouncement.value = `Mode ${labels[preference.value] || "Système"} activé.`;
};
</script>

<style scoped lang="scss">
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--text-muted);
  cursor: pointer;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &:hover {
    color: var(--text-strong);
    background: var(--surface-2);
    border-color: var(--border-strong);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }

  &__icon {
    font-size: 18px;
    transition: transform var(--dur-base) var(--ease-out);
  }

  &:active .theme-toggle__icon {
    transform: rotate(45deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle__icon {
    transition: none !important;
    transform: none !important;
  }
}
</style>
```

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

Reading prompt from stdin...
2026-09-18T15:00:36.022185Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b508-9f62-7913-8e2d-b6d11959ce8f
--------
user
# Blind Hunter Prompt — Story 13.3

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/13-3/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec le niveau de scepticisme demandé, puis je confronte ses règles au contenu de `full.diff`.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/r0/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/13-3/full.diff" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.codex/skills/r0/bmad-review-adversarial-general/SKILL.md: No such file or directory

codex
Le chemin abrégé du catalogue inclut la racine `r0` sans la répéter dans le chemin réel ; je corrige ce chemin et poursuis la lecture complète des instructions et du diff.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,320p' docs/implementation-artifacts/code-reviews/13-3/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-review-adversarial-general
description: 'Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something'
---

# Adversarial Review (General)

**Goal:** Cynically review content and produce findings.

**Your Role:** You are a cynical, jaded reviewer with zero patience for sloppy work. The content was submitted by a clueless weasel and you expect to find problems. Be skeptical of everything. Look for what's missing, not just what's wrong. Use a precise, professional tone — no profanity or personal attacks.

**Inputs:**
- **content** — Content to review: diff, spec, story, doc, or any artifact
- **also_consider** (optional) — Areas to keep in mind during review alongside normal adversarial analysis


## EXECUTION

### Step 1: Receive Content

- Load the content to review from provided input or context
- If content to review is empty, ask for clarification and abort
- Identify content type (diff, branch, uncommitted changes, document, etc.)

### Step 2: Adversarial Analysis

Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content.

### Step 3: Present Findings

Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

---DIFF---
diff --git a/app/components/HeaderComponent.vue b/app/components/HeaderComponent.vue
index 3371e17..8304a88 100644
--- a/app/components/HeaderComponent.vue
+++ b/app/components/HeaderComponent.vue
@@ -46,6 +46,7 @@
 
     <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
     <div class="hdr__dock-right" aria-label="Statut et heure">
+      <ThemeToggle class="hdr__dock-theme" />
       <div class="hdr__status-badge">
         <span class="hdr__status-dot" aria-hidden="true" />
         <span class="hdr__status-text">Disponible</span>
@@ -72,6 +73,7 @@
 
       <div class="hdr__menu-actions">
         <div class="hdr__menu-status">
+          <ThemeToggle class="hdr__menu-theme" />
           <div class="hdr__status-badge">
             <span class="hdr__status-dot" aria-hidden="true" />
             <span class="hdr__status-text">Disponible</span>
@@ -527,7 +529,8 @@ onBeforeUnmount(() => {
 
 // Dégradé progressif pour le dock droit sur largeurs moyennes (évite la collision avec le CTA à 1440px)
 @media (width <= 1650px) {
-  .hdr__dock-right {
+  .hdr__status-badge,
+  .hdr__dock-clock {
     display: none;
   }
 }
diff --git a/app/components/ui/ZIcon.vue b/app/components/ui/ZIcon.vue
index b9a51a6..0cb551f 100644
--- a/app/components/ui/ZIcon.vue
+++ b/app/components/ui/ZIcon.vue
@@ -45,6 +45,10 @@ const STROKE: Record<string, string> = {
   qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
   download:
     '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
+  monitor:
+    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
+  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
+  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
 };
 
 // Glyphes de marque (fill currentColor). viewBox 16 pour les réseaux, 24 pour wp/gem.
diff --git a/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md b/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
index 431b558..17a6cc8 100644
--- a/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
+++ b/docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
@@ -4,7 +4,7 @@ baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
 
 # Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -54,23 +54,23 @@ so that je puisse cycler en un clic entre Système, Sombre et Clair avec une ann
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
-  - [ ] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
+- [x] Tâche 1 — Enrichissement du jeu d'icônes vectorielles dans `app/components/ui/ZIcon.vue` (AC: 1)
+  - [x] Ajouter les tracés vectoriels suivants dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` :
     ```typescript
     monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
     moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
     sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
     ```
-  - [ ] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.
+  - [x] Vérifier que `ZIcon` supporte sans anomalie ces nouveaux identifiants et restitue un tracé SVG propre sans emoji.
 
-- [ ] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
-  - [ ] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
-  - [ ] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
-  - [ ] Définir les computed properties pour :
+- [x] Tâche 2 — Création du composant interactif `app/components/ui/ThemeToggle.vue` (AC: 2)
+  - [x] Créer `app/components/ui/ThemeToggle.vue` en `<script setup lang="ts">`.
+  - [x] Brancher `const { preference, resolvedTheme, cycleTheme } = useTheme()`.
+  - [x] Définir les computed properties pour :
     - `currentIcon`: `'monitor' | 'moon' | 'sun'`
     - `ariaLabel`: libellé dynamique complet selon l'état actif et l'OS
     - `liveAnnouncement`: message pour la live region (`"Mode Sombre activé."`, etc.)
-  - [ ] Implémenter la structure de template :
+  - [x] Implémenter la structure de template :
     ```html
     <button
       type="button"
@@ -83,7 +83,7 @@ so that je puisse cycler en un clic entre Système, Sombre et Clair avec une ann
       <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
     </button>
     ```
-  - [ ] Implémenter les styles SCSS scopés :
+  - [x] Implémenter les styles SCSS scopés :
     - Format compact : `width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;`
     - Variantes de surface : repos `background: var(--surface-1)`, bordure `1px solid var(--border-subtle)`, couleur `var(--text-muted)`
     - États interactifs : hover `background: var(--surface-2)`, `border-color: var(--border-strong)`, `color: var(--text-strong)`, `transform: translateY(-1px)`
@@ -92,19 +92,19 @@ so that je puisse cycler en un clic entre Système, Sombre et Clair avec une ann
     - Animation de rotation d'icône fluide `transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-standard);`
     - Neutralisation complète de l'animation sous `@media (prefers-reduced-motion: reduce)`.
 
-- [ ] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
-  - [ ] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
-  - [ ] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
-  - [ ] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
-  - [ ] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.
+- [x] Tâche 3 — Intégration dans `app/components/HeaderComponent.vue` et gestion responsive (AC: 3)
+  - [x] Intégrer `<ThemeToggle class="hdr__dock-theme" />` dans `.hdr__dock-right`, immédiatement avant `.hdr__status-badge`.
+  - [x] Intégrer `<ThemeToggle class="hdr__menu-theme" />` dans `.hdr__menu-status` du menu mobile.
+  - [x] Adapter la règle responsive `@media (width <= 1650px)` de `HeaderComponent.vue` pour que le bouton `ThemeToggle` reste visible sur desktop même lorsque l'horloge ou le badge sont masqués pour éviter les collisions avec le container.
+  - [x] S'assurer que le focus reste cohérent et que l'ouverture/fermeture du menu mobile ne perturbe pas le toggle.
 
-- [ ] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
-  - [ ] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
-  - [ ] Exécuter la suite complète dans Docker :
+- [x] Tâche 4 — Validation qualité Docker & conformité a11y (AC: 4)
+  - [x] Vérifier la navigation clavier (`Tab`, `Entrée`, `Espace`) et l'annonce vocale en émulation lecteur d'écran.
+  - [x] Exécuter la suite complète dans Docker :
     ```sh
     docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
     ```
-  - [ ] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
+  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG pré-rendues.
 
 ## Dev Notes
 
@@ -131,115 +131,27 @@ Dans `app/components/HeaderComponent.vue`, la classe `.hdr__dock-right` contient
 Si `ThemeToggle` est inséré naïvement dans `.hdr__dock-right` sans ajuster cette règle, **tous les visiteurs sur ordinateurs portables (écrans 13", 14", 15", 16", résolutions 1080p, 1366px, 1440px) perdraient totalement l'accès au ThemeToggle**, car le burger mobile n'apparaît qu'en dessous de 900px !
 **Solution obligatoire :** Sur l'intervalle `901px <= width <= 1650px`, masquer `.hdr__dock-clock` et `.hdr__status-badge`, mais **conserver `.hdr__dock-right` et `ThemeToggle` visibles**. Avec 36px de largeur, le bouton s'insère sans aucun risque de collision dans les marges latérales du header.
 
-### Code Snippet de référence pour `ThemeToggle.vue`
-
-```html
-<template>
-  <button
-    type="button"
-    class="theme-toggle"
-    :aria-label="ariaLabel"
-    title="Changer de thème (Système / Sombre / Clair)"
-    @click="handleToggle"
-  >
-    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
-    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
-  </button>
-</template>
-
-<script setup lang="ts">
-import { computed, ref } from "vue";
-import { useTheme } from "~/composables/useTheme";
-
-const { preference, resolvedTheme, cycleTheme } = useTheme();
-const liveAnnouncement = ref("");
-
-const currentIcon = computed(() => {
-  if (preference.value === "system") return "monitor";
-  if (preference.value === "dark") return "moon";
-  return "sun";
-});
-
-const ariaLabel = computed(() => {
-  if (preference.value === "system") {
-    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
-    return `Thème : Système (${activeResolved} actif). Cliquer pour forcer le mode Sombre.`;
-  }
-  if (preference.value === "dark") {
-    return "Thème : Sombre forcé. Cliquer pour forcer le mode Clair.";
-  }
-  return "Thème : Clair forcé. Cliquer pour revenir au mode Système.";
-});
-
-const handleToggle = () => {
-  cycleTheme();
-  const labels: Record<string, string> = {
-    system: "Système",
-    dark: "Sombre",
-    light: "Clair",
-  };
-  liveAnnouncement.value = `Mode ${labels[preference.value] || "Système"} activé.`;
-};
-</script>
-
-<style scoped lang="scss">
-.theme-toggle {
-  display: inline-flex;
-  align-items: center;
-  justify-content: center;
-  width: 36px;
-  height: 36px;
-  padding: 0;
-  color: var(--text-muted);
-  cursor: pointer;
-  background: var(--surface-1);
-  border: 1px solid var(--border-subtle);
-  border-radius: var(--radius-md);
-  transition:
-    background var(--dur-fast) var(--ease-standard),
-    border-color var(--dur-fast) var(--ease-standard),
-    color var(--dur-fast) var(--ease-standard),
-    transform var(--dur-fast) var(--ease-standard);
-
-  &:hover {
-    color: var(--text-strong);
-    background: var(--surface-2);
-    border-color: var(--border-strong);
-    transform: translateY(-1px);
-  }
-
-  &:focus-visible {
-    outline: 2px solid transparent;
-    outline-offset: 2px;
-    box-shadow: var(--ring-accent);
-  }
-
-  &__icon {
-    font-size: 18px;
-    transition: transform var(--dur-base) var(--ease-out);
-  }
-
-  &:active .theme-toggle__icon {
-    transform: rotate(45deg);
-  }
-}
-
-@media (prefers-reduced-motion: reduce) {
-  .theme-toggle,
-  .theme-toggle__icon {
-    transition: none !important;
-    transform: none !important;
-  }
-}
-</style>
-```
-
 ## Dev Agent Record
 
 ### Agent Model Used
+- Google Gemini 2.5 Flash / Pro (Antigravity IDE)
 
 ### Debug Log References
+- Gate Docker validée avec succès : `docker compose run --rm -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` (0 erreur ESLint / Stylelint, 0 erreur vue-tsc, 24 routes SSG pré-rendues).
+- Correction Stylelint BEM sur `ThemeToggle.vue` avec `/* stylelint-disable selector-class-pattern -- convention BEM */`.
 
 ### Completion Notes List
+- ✅ **Icônes vectorielles** : Tracés `monitor`, `moon` et `sun` ajoutés dans le dictionnaire `STROKE` de `app/components/ui/ZIcon.vue` au format SVG inline Lucide `0 0 24 24` avec `stroke-width="2"`, héritant fidèlement de `currentColor`.
+- ✅ **Composant ThemeToggle** : Composant `app/components/ui/ThemeToggle.vue` créé avec `useTheme()`, rotation d'icône fluide, infobulle native `title`, `aria-label` dynamique contextualisé (OS et prochaine action), région live accessible `aria-live="polite"` pour lecteurs d'écran, support du focus visible DS et mode `forced-colors: active`, et neutralisation `prefers-reduced-motion`.
+- ✅ **Intégration Header & Mobile** : `ThemeToggle` intégré dans `.hdr__dock-right` (desktop) et dans `.hdr__menu-status` (menu mobile). Règle responsive `@media (width <= 1650px)` ajustée pour masquer uniquement l'horloge et le badge de disponibilité, tout en maintenant `ThemeToggle` visible et accessible sur les écrans d'ordinateurs portables (`901px <= width <= 1650px`).
+- ✅ **Validation Qualité** : Gate Docker 100% verte (0 erreur ESLint, 0 erreur Stylelint, 0 erreur TypeScript vue-tsc, 24 routes SSG générées).
 
 ### File List
+- `app/components/ui/ZIcon.vue` (modifié)
+- `app/components/ui/ThemeToggle.vue` (créé)
+- `app/components/HeaderComponent.vue` (modifié)
+- `docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md` (modifié)
+- `docs/implementation-artifacts/sprint-status.yaml` (modifié)
+
+## Change Log
+- 2026-09-18 : Implémentation complète de la Story 13.3 (ZIcon monitor/moon/sun, ThemeToggle.vue, intégration Header desktop & menu mobile, responsive dock preservation). Statut passé à "review".
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 6bde5be..e9dd065 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 13.3 prête pour le dev)"
+last_updated: "2026-09-18 (Story 13.3 en review)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -141,7 +141,7 @@ development_status:
   epic-13: in-progress
   13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: done
   13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: done
-  13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: ready-for-dev
+  13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: review
   13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg: backlog
   epic-13-retrospective: optional
 
diff --git a/app/components/ui/ThemeToggle.vue b/app/components/ui/ThemeToggle.vue
new file mode 100644
index 0000000..a6a4c2e
--- /dev/null
+++ b/app/components/ui/ThemeToggle.vue
@@ -0,0 +1,110 @@
+<template>
+  <button
+    type="button"
+    class="theme-toggle"
+    :aria-label="ariaLabel"
+    title="Changer de thème (Système / Sombre / Clair)"
+    @click="handleToggle"
+  >
+    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
+    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
+  </button>
+</template>
+
+<script setup lang="ts">
+import { computed, ref } from "vue";
+import { useTheme } from "~/composables/useTheme";
+
+const { preference, resolvedTheme, cycleTheme } = useTheme();
+const liveAnnouncement = ref("");
+
+const currentIcon = computed(() => {
+  if (preference.value === "system") {
+    return "monitor";
+  }
+  if (preference.value === "dark") {
+    return "moon";
+  }
+  return "sun";
+});
+
+const ariaLabel = computed(() => {
+  if (preference.value === "system") {
+    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";

exec
/bin/zsh -lc "sed -n '320,700p' docs/implementation-artifacts/code-reviews/13-3/full.diff && printf '\\n---THEME---\\n' && sed -n '1,220p' app/components/ui/ThemeToggle.vue && printf '\\n---USE THEME---\\n' && sed -n '1,280p' app/composables/useTheme.ts && printf '\\n---ZICON---\\n' && sed -n '1,180p' app/components/ui/ZIcon.vue && printf '\\n---HEADER CONTEXT---\\n' && sed -n '1,130p' app/components/HeaderComponent.vue && sed -n '470,570p' app/components/HeaderComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
+    return `Thème : Système (${activeResolved} actif). Cliquer pour forcer le mode Sombre.`;
+  }
+  if (preference.value === "dark") {
+    return "Thème : Sombre forcé. Cliquer pour forcer le mode Clair.";
+  }
+  return "Thème : Clair forcé. Cliquer pour revenir au mode Système.";
+});
+
+const handleToggle = () => {
+  cycleTheme();
+  const labels: Record<string, string> = {
+    system: "Système",
+    dark: "Sombre",
+    light: "Clair",
+  };
+  liveAnnouncement.value = `Mode ${labels[preference.value] || "Système"} activé.`;
+};
+</script>
+
+<style scoped lang="scss">
+/* stylelint-disable selector-class-pattern -- convention BEM */
+.theme-toggle {
+  display: inline-flex;
+  align-items: center;
+  justify-content: center;
+  width: 36px;
+  height: 36px;
+  padding: 0;
+  color: var(--text-muted);
+  cursor: pointer;
+  background: var(--surface-1);
+  border: 1px solid var(--border-subtle);
+  border-radius: var(--radius-md);
+  transition:
+    background var(--dur-fast) var(--ease-standard),
+    border-color var(--dur-fast) var(--ease-standard),
+    color var(--dur-fast) var(--ease-standard),
+    transform var(--dur-fast) var(--ease-standard);
+
+  &:hover {
+    color: var(--text-strong);
+    background: var(--surface-2);
+    border-color: var(--border-strong);
+    transform: translateY(-1px);
+  }
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+  }
+
+  &__icon {
+    font-size: 18px;
+    transition: transform var(--dur-base) var(--ease-out);
+  }
+
+  &:active .theme-toggle__icon {
+    transform: rotate(45deg);
+  }
+}
+
+@media (width <= 900px) {
+  .theme-toggle {
+    width: 40px;
+    height: 40px;
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .theme-toggle,
+  .theme-toggle__icon {
+    transition: none !important;
+    transform: none !important;
+  }
+}
+</style>

---THEME---
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
  if (preference.value === "system") {
    return "monitor";
  }
  if (preference.value === "dark") {
    return "moon";
  }
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
/* stylelint-disable selector-class-pattern -- convention BEM */
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

@media (width <= 900px) {
  .theme-toggle {
    width: 40px;
    height: 40px;
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

---USE THEME---
export type ThemePreference = "system" | "dark" | "light";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "jouan_theme_mode";
let mediaListenerAttached = false;

/**
 * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
 *
 * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
 * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
 * avec localStorage et les preferences systeme de l'OS.
 */
export function useTheme() {
  const preference = useState<ThemePreference>("theme-preference", () => "system");
  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");

  const resolveSystemTheme = (): ResolvedTheme => {
    if (!import.meta.client || typeof window === "undefined" || !window.matchMedia) {
      return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
    if (!import.meta.client) {
      return;
    }
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-source", pref);
    document.documentElement.style.colorScheme = resolved;
  };

  const setTheme = (pref: ThemePreference) => {
    if (pref !== "system" && pref !== "dark" && pref !== "light") {
      return;
    }
    preference.value = pref;
    const resolved = pref === "system" ? resolveSystemTheme() : pref;
    resolvedTheme.value = resolved;

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, pref);
      } catch {
        // Ignorer en navigation privee restrictive
      }
      applyToDom(resolved, pref);
    }
  };

  const cycleTheme = () => {
    const nextMap: Record<ThemePreference, ThemePreference> = {
      system: "dark",
      dark: "light",
      light: "system",
    };
    setTheme(nextMap[preference.value] || "system");
  };

  const initTheme = () => {
    if (!import.meta.client) {
      return;
    }

    let storedPref: ThemePreference = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light" || stored === "system") {
        storedPref = stored;
      }
    } catch {
      // Ignorer si localStorage inaccessible
    }

    preference.value = storedPref;
    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
    resolvedTheme.value = resolved;
    applyToDom(resolved, storedPref);

    if (mediaListenerAttached || typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (preference.value === "system") {
        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
        resolvedTheme.value = newResolved;
        applyToDom(newResolved, "system");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }
    mediaListenerAttached = true;
  };

  return {
    preference,
    resolvedTheme,
    setTheme,
    cycleTheme,
    initTheme,
  };
}

---ZICON---
<template>
  <!-- eslint-disable vue/no-v-html -->
  <svg
    class="zicon"
    :viewBox="def.box"
    :fill="def.fill ? 'currentColor' : 'none'"
    :stroke="def.fill ? undefined : 'currentColor'"
    :stroke-width="def.fill ? undefined : 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    v-html="def.body"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
// Système d'icônes du DS — SVG inline, `currentColor` (héritent de la couleur du texte),
// taille en `em`. Choix prerender-safe : set inline (pas de script Lucide CDN qui muterait
// le DOM client et laisserait un trou au `nuxi generate`). Aucune police d'icône (AC #2).
// Icônes au trait = style Lucide ; glyphes de marque (github/twitter/linkedin/wp) + logo
// diamant (gem) = fill. Porté de docs/design_system/ui_kits/jouan-site/icons.jsx.
// Le `v-html` du template injecte uniquement ces chaînes internes statiques.
import { computed } from "vue";

type IconDef = { box: string; fill: boolean; body: string };

// Icônes au trait (viewBox 24, stroke currentColor).
const STROKE: Record<string, string> = {
  arrow: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M2 14h2M20 14h2"/>',
  spark:
    '<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.4L12 17l-1.8-5.6L4.5 10l5.7-1.4z"/><path d="M19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
};

// Glyphes de marque (fill currentColor). viewBox 16 pour les réseaux, 24 pour wp/gem.
const GITHUB =
  '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>';
const TWITTER =
  '<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>';
const LINKEDIN =
  '<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>';
const WP =
  '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.5a8.5 8.5 0 0 1 4.9 1.55h-.34c-.62 0-1.06.54-1.06 1.12 0 .52.3.96.62 1.48.24.42.52.96.52 1.74 0 .54-.2 1.18-.48 2.06l-.64 2.12-2.3-6.84c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.62 0-1.66-.08-1.66-.08-.34-.02-.38.5-.04.52 0 0 .32.04.66.06l.96 2.62-1.34 4.02L7.2 7.34c.38-.02.72-.06.72-.06.34-.04.3-.54-.04-.52 0 0-1.02.08-1.68.08-.12 0-.26 0-.4-.01A8.5 8.5 0 0 1 12 3.5zM3.6 8.7l3.7 10.16A8.5 8.5 0 0 1 3.6 8.7zm8.76 3.18 2.34 6.4c.02.04.04.08.06.1a8.5 8.5 0 0 1-5.04.16l2.64-6.66zm5.96-3.4a8.5 8.5 0 0 1-2.16 9.42l2.58-7.46c.24-.6.4-1.18.48-1.7l.06.04c.24.46.42 1.02.42 1.64 0 .8-.16 1.7-.62 2.86z"/>';

// Logo diamant (gem) : carré pivoté en currentColor + facette haute éclairée
// (overlay blanc très léger, esprit "lit from above" du logo de marque).
const GEM =
  '<path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/>' +
  '<path d="M12 1.5 22.5 12 12 12z" fill="#fff" fill-opacity="0.12"/>';

const ICONS: Record<string, IconDef> = {
  ...Object.fromEntries(Object.entries(STROKE).map(([k, body]) => [k, { box: "0 0 24 24", fill: false, body }])),
  github: { box: "0 0 16 16", fill: true, body: GITHUB },
  x: { box: "0 0 16 16", fill: true, body: TWITTER },
  twitter: { box: "0 0 16 16", fill: true, body: TWITTER },
  linkedin: { box: "0 0 16 16", fill: true, body: LINKEDIN },
  wp: { box: "0 0 24 24", fill: true, body: WP },
  gem: { box: "0 0 24 24", fill: true, body: GEM },
};

const EMPTY: IconDef = { box: "0 0 24 24", fill: false, body: "" };

interface Props {
  /** Nom de l'icône dans le set (arrow, terminal, github, gem…). */
  name: string;
  /** Libellé accessible : si fourni, l'icône devient `role="img"` ; sinon décorative (`aria-hidden`). */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
});

const def = computed<IconDef>(() => ICONS[props.name] ?? EMPTY);
</script>

<style scoped>
.zicon {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>

---HEADER CONTEXT---
<template>
  <header class="hdr" :class="{ 'hdr--stuck': isScrolled }">
    <div class="hdr__progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true" />
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="onBrandClick">
        <NuxtImg src="/images/logo_white.png" alt="" class="hdr__logo" width="24" height="24" />
        <span class="hdr__brand-text"><b>jouan</b><span class="dim">.ovh</span></span>
      </NuxtLink>

      <nav class="hdr__nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hdr__link"
          :class="{ 'hdr__link--active': isActive(item.to) }"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span class="hdr__link-prefix" aria-hidden="true">{{ item.prefix }} </span>
          <span class="hdr__link-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <ZButton variant="terminal" size="sm" class="hdr__action hdr__action--terminal" @click="addNewTerminal">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" class="hdr__action">
          Démarrer un projet
        </ZButton>

        <button
          ref="burgerButton"
          class="hdr__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="hdr-mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="toggleMenu"
        >
          <ZIcon :name="menuOpen ? 'arrow' : 'layers'" />
        </button>
      </div>
    </div>

    <!-- Dock d'état tout à droite de l'écran (hors container centré) -->
    <div class="hdr__dock-right" aria-label="Statut et heure">
      <ThemeToggle class="hdr__dock-theme" />
      <div class="hdr__status-badge">
        <span class="hdr__status-dot" aria-hidden="true" />
        <span class="hdr__status-text">Disponible</span>
      </div>
      <CurrentTime class="hdr__dock-clock" />
    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
    <nav id="hdr-mobile-menu" class="hdr__menu" :class="{ 'hdr__menu--open': menuOpen }" aria-label="Navigation mobile">
      <NuxtLink
        v-for="(item, index) in navItems"
        :key="item.to"
        :ref="(el) => registerFirstLink(el, index)"
        :to="item.to"
        class="hdr__menu-link"
        :class="{ 'hdr__menu-link--active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        @click="closeMenu"
      >
        <span class="hdr__menu-link-prefix" aria-hidden="true">{{ item.prefix }} </span>
        <span class="hdr__menu-link-label">{{ item.label }}</span>
      </NuxtLink>

      <div class="hdr__menu-actions">
        <div class="hdr__menu-status">
          <ThemeToggle class="hdr__menu-theme" />
          <div class="hdr__status-badge">
            <span class="hdr__status-dot" aria-hidden="true" />
            <span class="hdr__status-text">Disponible</span>
          </div>
          <CurrentTime class="hdr__menu-clock" />
        </div>
        <ZButton variant="terminal" size="sm" class="hdr__action--terminal" @click="openTerminalFromMenu">
          <template #icon><ZIcon name="terminal" /></template>
          Terminal
        </ZButton>
        <ZButton :as="NuxtLink" to="/contact" variant="primary" size="sm" @click="closeMenu">
          Démarrer un projet
        </ZButton>
      </div>
    </nav>

    <TerminalManagerComponent ref="terminalManager" />
  </header>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from "vue";
import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
import { NuxtLink } from "#components";
import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";

const route = useRoute();

const navItems = [
  { to: "/", label: "Accueil", prefix: "~" },
  { to: "/services", label: "Services", prefix: "//" },
  { to: "/about", label: "À propos", prefix: "./" },
  { to: "/blog", label: "Blog", prefix: "~/" },
  { to: "/contact", label: "Contact", prefix: "$" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

// --- Scroll state & progress ---
const isScrolled = ref(false);
const scrollProgress = ref(0);

function onScroll() {
  const top = window.scrollY || document.documentElement.scrollTop || 0;
  isScrolled.value = top > 20;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const progress = h > 0 ? (top / h) * 100 : 0;
  scrollProgress.value = Math.min(100, Math.max(0, progress));
  backdrop-filter: blur(8px);

  &:hover {
    border-color: var(--term-green);
    box-shadow: 0 0 16px color-mix(in srgb, var(--term-green) 35%, transparent);
  }
}

.hdr__status-dot {
  width: 7px;
  height: 7px;
  background: var(--term-green);
  border-radius: var(--radius-circle);
  box-shadow: 0 0 6px var(--term-green);
}

.hdr__dock-clock {
  margin-left: var(--space-1);
}

.hdr__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  color: var(--text-strong);
  cursor: pointer;
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__overlay {
  position: fixed;
  inset: var(--header-height) 0 0;
  z-index: 40;
  background: var(--overlay);
}

.hdr__menu {
  display: none;
}

.hdr__menu-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-subtle);
}

// Dégradé progressif pour le dock droit sur largeurs moyennes (évite la collision avec le CTA à 1440px)
@media (width <= 1650px) {
  .hdr__status-badge,
  .hdr__dock-clock {
    display: none;
  }
}

// Sécurité : pas d'overlay en desktop (le menu mobile y est fermé par JS).
@media (width >= 901px) {
  .hdr__overlay {
    display: none;
  }
}

// ---- Responsive : < 900px (cf. kit.css) ----
@media (width <= 900px) {
  .hdr__nav,
  .hdr__dock-right,
  .hdr__right .hdr__action {
    display: none;
  }

  .hdr__burger {
    display: inline-flex;
  }

  .hdr__menu {
    position: fixed;
    inset: var(--header-height) 0 auto 0;
    z-index: 45;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-4) var(--space-6) var(--space-6);
    background: var(--surface-1);
    border-bottom: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-3);
    transform: translateY(-8px);
    opacity: 0;
    visibility: hidden;

exec
/bin/zsh -lc "sed -n '1,180p' docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md && sed -n '570,680p' app/components/HeaderComponent.vue && rg -n \"screen-reader-text|data-theme|ThemeToggle|useTheme\\(|initTheme|forced-colors\" app | head -120" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
---

# Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

Status: review

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
    visibility: hidden;
    transition:
      transform var(--dur-base) var(--ease-out),
      opacity var(--dur-base) var(--ease-standard),
      visibility var(--dur-base);
  }

  .hdr__menu--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

.hdr__menu-link {
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-base);
  color: var(--text-body);
  text-decoration: none;
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--text-strong);
    background: var(--surface-2);
  }

  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.hdr__menu-link--active {
  color: var(--accent);
}

.hdr__menu-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

@media (prefers-reduced-motion: reduce) {
  .hdr,
  .hdr__progress,
  .hdr__link,
  .hdr__link::after,
  .hdr__menu {
    transition: none !important;
  }

  .hdr__brand .hdr__logo,
  .hdr__brand:hover .hdr__logo {
    transform: none;
    transition: none;
  }
}
</style>
app/components/HeaderComponent.vue:49:      <ThemeToggle class="hdr__dock-theme" />
app/components/HeaderComponent.vue:76:          <ThemeToggle class="hdr__menu-theme" />
app/components/HeaderComponent.vue:336:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:387:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:504:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/HeaderComponent.vue:598:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/composables/useTheme.ts:14:export function useTheme() {
app/composables/useTheme.ts:29:    document.documentElement.setAttribute("data-theme", resolved);
app/composables/useTheme.ts:30:    document.documentElement.setAttribute("data-theme-source", pref);
app/composables/useTheme.ts:61:  const initTheme = () => {
app/composables/useTheme.ts:107:    initTheme,
app/app.vue:11:const { initTheme } = useTheme();
app/app.vue:14:  initTheme();
app/pages/contact/card.vue:377:@media (forced-colors: active) {
app/pages/blog/[...slug].vue:200:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/blog/[...slug].vue:288:      outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/pages/index.vue:737:    // Outline transparent : rendu en couleur système sous forced-colors.
app/pages/about.vue:268:    // en rendu normal mais devient une couleur système en `forced-colors`
app/pages/contact/index.vue:113:            <h2 class="screen-reader-text">Coordonnées et terminal</h2>
app/pages/contact/index.vue:512:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:126:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/FooterComponent.vue:180:    outline: 2px solid transparent; // forced-colors : rendu en couleur système
app/components/ui/ZExternalLink.vue:4:    <span class="screen-reader-text">{{ computedSrText }}</span>
app/components/ui/ThemeToggle.vue:10:    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
app/components/ui/ThemeToggle.vue:18:const { preference, resolvedTheme, cycleTheme } = useTheme();
app/components/ui/ZTag.vue:148:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZTag.vue:177:    // Outline transparent → couleur système sous forced-colors (box-shadow neutralisée).
app/components/ui/ZInput.vue:175:    // Outline transparent → rendu en couleur système sous forced-colors (où la
app/assets/scss/abstract/_root.scss:208:[data-theme="light"] {
app/assets/scss/base/_reset.scss:562:.screen-reader-text {
app/assets/scss/base/_reset.scss:574:.screen-reader-text:focus {

exec
/bin/zsh -lc "sed -n '250,470p' app/components/HeaderComponent.vue; sed -n '190,280p' app/assets/scss/abstract/_root.scss; sed -n '545,585p' app/assets/scss/base/_reset.scss; git status --short" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    -webkit-backdrop-filter var(--dur-base) var(--ease-standard);
}

.hdr--stuck {
  background: color-mix(in srgb, var(--surface-0) 80%, transparent);
  border-bottom-color: var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.hdr__progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
  box-shadow: 0 0 10px var(--accent);
  pointer-events: none;
  transition: width 0.05s linear;
}

.hdr__in {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  width: 100%;
  max-width: var(--container-xl);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.hdr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  cursor: pointer;

  .hdr__logo {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--surface-0) 60%, transparent));
    transition:
      transform var(--dur-base) var(--ease-standard),
      filter var(--dur-base) var(--ease-standard);
  }

  .hdr__brand-text {
    transition: transform var(--dur-fast) var(--ease-standard);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
    transition: color var(--dur-fast) var(--ease-standard);
  }

  .dim {
    color: var(--text-faint);
    transition: color var(--dur-fast) var(--ease-standard);
  }

  &:hover {
    .hdr__logo {
      transform: rotate(-12deg) scale(1.15);
      filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 70%, transparent));
    }

    b {
      color: var(--accent);
    }

    .dim {
      color: var(--text-body);
    }
  }

  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.hdr__nav {
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  gap: var(--space-6);
  transform: translateX(-50%);
}

.hdr__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);
  text-decoration: none;
  background: transparent;
  transition: color var(--dur-fast) var(--ease-standard);

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: var(--accent);
    transition: width var(--dur-base) var(--ease-out);
  }

  &:hover {
    color: var(--text-strong);
    background: transparent;

    &::after {
      width: 100%;
    }
  }

  // Anneau de focus DS
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 4px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.hdr__link--active {
  color: var(--text-strong);

  &::after {
    width: 100%;
  }

  .hdr__link-prefix {
    color: var(--accent);
  }
}

.hdr__link-prefix,
.hdr__menu-link-prefix {
  font-family: var(--font-mono);
  color: var(--text-faint);
  transition: color var(--dur-fast) var(--ease-standard);
}

.hdr__link:hover .hdr__link-prefix,
.hdr__link--active .hdr__link-prefix,
.hdr__menu-link:hover .hdr__menu-link-prefix,
.hdr__menu-link--active .hdr__menu-link-prefix {
  color: var(--accent);
}

.hdr__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

.hdr__action--terminal {
  border-color: color-mix(in srgb, var(--term-green) 40%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--term-green) 22%, transparent);

  &:hover {
    border-color: var(--term-green);
    box-shadow:
      0 0 20px color-mix(in srgb, var(--term-green) 45%, transparent),
      var(--glow-terminal);
  }
}

// Dock de statut & horloge positionné tout à droite de l'écran (hors container centré)
.hdr__dock-right {
  position: absolute;
  top: 50%;
  right: var(--space-6);
  z-index: 52;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  transform: translateY(-50%);
}

.hdr__status-badge {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--term-green);
  user-select: none;
  background: color-mix(in srgb, var(--term-green) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--term-green) 40%, transparent);
  border-radius: var(--radius-pill);
  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);
  transition:
    box-shadow var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard);

  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  // Anneau de focus
  --ring-accent: 0 0 0 3px var(--accent-ring);

  // ============================================================
  //  Motion — easings sobres et mécaniques (esprit terminal)
  // ============================================================
  --dur-fast: 120ms;
  --dur-base: 180ms;
  --dur-slow: 320ms;
  --dur-slower: 600ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-standard: ease-in-out;
}

// ============================================================
//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
// ============================================================
[data-theme="light"] {
  // Surfaces claires
  --bg-page: hsl(38deg 25% 97%);
  --bg-sunken: hsl(38deg 20% 93%);
  --bg-card: hsl(0deg 0% 100%);
  --bg-elevated: hsl(38deg 30% 99%);
  --bg-input: hsl(38deg 15% 95%);

  // Encres aubergine (contrastes WCAG AAA)
  --text-strong: hsl(320deg 30% 12%);
  --text-body: hsl(320deg 18% 26%);
  --text-muted: hsl(320deg 10% 44%);
  --text-faint: hsl(320deg 8% 58%);
  --ink-on-accent: hsl(0deg 0% 100%);

  // Bordures douces
  --border-subtle: hsl(35deg 15% 88%);
  --border-default: hsl(35deg 12% 80%);
  --border-strong: hsl(35deg 12% 68%);

  // Accent & sélections
  --accent: hsl(24deg 95% 44%);
  --accent-soft: hsl(24deg 94% 53% / 10%);
  --accent-ring: hsl(24deg 94% 53% / 35%);
  --selection: hsl(24deg 94% 53% / 22%);
  --overlay: hsl(320deg 30% 10% / 40%);

  // Ombres adaptées
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
  --shadow-3: 0 8px 24px hsl(35deg 20% 40% / 12%);
  --shadow-hairline: inset 0 1px 0 hsl(0deg 0% 100% / 80%);
}

// Sanctuarisation absolue du terminal sombre
.home-hero-terminal,
.hero-term,
.terminal-window,
.terminal {
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-terminal: hsl(319deg 40% 30% / 40%);
  --accent: var(--orange-500);
  --selection: hsl(24deg 94% 53% / 30%);
}

::selection {
  background: var(--selection);
}

// Keyframes globaux (hors :root). Seul caret-blink est une boucle UI (caret terminal).
@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@keyframes fade-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

.infinite-scroll.neverending .site-footer {
  display: none;
}

/* Re-display the Theme Footer when Infinite Scroll has reached its end. */
.infinity-end.neverending .site-footer {
  display: block;
}

/* --------------------------------------------------------------
# Utilities
-------------------------------------------------------------- */

/* Accessibility
--------------------------------------------- */

/* Text meant only for screen readers. */
.screen-reader-text {
  border: 0;
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  width: 1px;
  overflow-wrap: normal !important;
}

.screen-reader-text:focus {
  background-color: #f1f1f1;
  border-radius: 3px;
  box-shadow: 0 0 2px 2px rgb(0 0 0 / 60%);
  clip-path: none;
  color: #21759b;
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  height: auto;
  left: 5px;
  line-height: normal;
 M app/components/HeaderComponent.vue
 M app/components/ui/ZIcon.vue
 M docs/implementation-artifacts/13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile.md
 M docs/implementation-artifacts/sprint-status.yaml
?? app/components/ui/ThemeToggle.vue
?? docs/implementation-artifacts/code-reviews/13-3/

codex
- La règle `@media (width <= 1650px)` masque globalement `.hdr__status-badge`, y compris celui du menu mobile, ce qui supprime l’indicateur « Disponible » sur smartphone.

- Le dock reste positionné en `absolute` au-dessus de la zone d’actions du header ; entre 901 et 1650 px, le toggle peut donc recouvrir le bouton « Démarrer un projet » au lieu d’éviter la collision.

- Aucun espacement spécifique n’est ajouté à `.hdr__dock-theme` ; la conformité avec la séparation explicite `var(--space-3)` dépend uniquement du `gap` du parent.

- Le contrôle reste animé au survol tactile potentiel, alors que les règles du projet exigent la neutralisation des effets cinétiques sous `@media (hover: none)`.

- La branche `forced-colors: active` annoncée dans la documentation n’existe pas dans `ThemeToggle.vue`; le composant ne définit aucun comportement explicite pour la bordure, le fond ou le focus dans ce mode.

- La région `aria-live` est imbriquée dans le bouton portant déjà un `aria-label`, ce qui peut empêcher certains lecteurs d’écran d’annoncer de manière fiable les changements.

- La validation des annonces vocales est déclarée comme effectuée, mais le diff ne fournit aucun test automatisé, scénario reproductible ou résultat de lecteur d’écran.

- La validation visuelle obligatoire du projet est déclarée terminée sans capture, rapport de comparaison ou preuve de contrôle desktop/mobile.

- Le diff ne contient aucun test de composant couvrant le cycle `system → dark → light → system`, les libellés ARIA ou les icônes affichées.

- La documentation affirme que la nouvelle règle responsive ne présente « aucun risque de collision », alors que le positionnement absolu du dock et celui des actions du header occupent potentiellement la même zone.

- La tâche documentée exige une cible tactile de 40 × 40 px sur mobile, mais le toggle mobile est placé dans un menu dont la hauteur et les espacements ne sont pas vérifiés contre les contraintes de cible tactile.

- Le changement masque l’horloge et le badge avec des sélecteurs génériques plutôt qu’avec des sélecteurs spécifiques au dock, ce qui rend l’intégration responsive fragile pour toute future réutilisation de ces classes.

- Le composant désactive les transitions sous `prefers-reduced-motion`, mais la transformation de survol est seulement indirectement concernée et aucune vérification ne garantit qu’elle ne subsiste pas dans tous les états interactifs.

- Le fichier de story indique 24 routes SSG générées alors que les directives d’architecture du dépôt mentionnent 13 routes ; cette incohérence rend la preuve de validation difficile à interpréter.

- La commande réellement consignée dans le journal de validation ajoute `-e COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, mais ne correspond pas exactement à la commande prescrite par le critère d’acceptation.

- Le commentaire de la story présente encore l’ancien comportement comme un risque critique détecté, sans documenter précisément pourquoi le nouveau positionnement résout effectivement le chevauchement avec les actions du header.

- La désactivation globale de `selector-class-pattern` dans le composant masque potentiellement d’autres violations Stylelint au lieu de limiter l’exception aux sélecteurs BEM nécessaires.

- Le changement de statut vers `review` est effectué sans ajouter de compte rendu de revue visuelle ou de validation comportementale correspondant aux critères de fin de tâche.
tokens used
51 956
- La règle `@media (width <= 1650px)` masque globalement `.hdr__status-badge`, y compris celui du menu mobile, ce qui supprime l’indicateur « Disponible » sur smartphone.

- Le dock reste positionné en `absolute` au-dessus de la zone d’actions du header ; entre 901 et 1650 px, le toggle peut donc recouvrir le bouton « Démarrer un projet » au lieu d’éviter la collision.

- Aucun espacement spécifique n’est ajouté à `.hdr__dock-theme` ; la conformité avec la séparation explicite `var(--space-3)` dépend uniquement du `gap` du parent.

- Le contrôle reste animé au survol tactile potentiel, alors que les règles du projet exigent la neutralisation des effets cinétiques sous `@media (hover: none)`.

- La branche `forced-colors: active` annoncée dans la documentation n’existe pas dans `ThemeToggle.vue`; le composant ne définit aucun comportement explicite pour la bordure, le fond ou le focus dans ce mode.

- La région `aria-live` est imbriquée dans le bouton portant déjà un `aria-label`, ce qui peut empêcher certains lecteurs d’écran d’annoncer de manière fiable les changements.

- La validation des annonces vocales est déclarée comme effectuée, mais le diff ne fournit aucun test automatisé, scénario reproductible ou résultat de lecteur d’écran.

- La validation visuelle obligatoire du projet est déclarée terminée sans capture, rapport de comparaison ou preuve de contrôle desktop/mobile.

- Le diff ne contient aucun test de composant couvrant le cycle `system → dark → light → system`, les libellés ARIA ou les icônes affichées.

- La documentation affirme que la nouvelle règle responsive ne présente « aucun risque de collision », alors que le positionnement absolu du dock et celui des actions du header occupent potentiellement la même zone.

- La tâche documentée exige une cible tactile de 40 × 40 px sur mobile, mais le toggle mobile est placé dans un menu dont la hauteur et les espacements ne sont pas vérifiés contre les contraintes de cible tactile.

- Le changement masque l’horloge et le badge avec des sélecteurs génériques plutôt qu’avec des sélecteurs spécifiques au dock, ce qui rend l’intégration responsive fragile pour toute future réutilisation de ces classes.

- Le composant désactive les transitions sous `prefers-reduced-motion`, mais la transformation de survol est seulement indirectement concernée et aucune vérification ne garantit qu’elle ne subsiste pas dans tous les états interactifs.

- Le fichier de story indique 24 routes SSG générées alors que les directives d’architecture du dépôt mentionnent 13 routes ; cette incohérence rend la preuve de validation difficile à interpréter.

- La commande réellement consignée dans le journal de validation ajoute `-e COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, mais ne correspond pas exactement à la commande prescrite par le critère d’acceptation.

- Le commentaire de la story présente encore l’ancien comportement comme un risque critique détecté, sans documenter précisément pourquoi le nouveau positionnement résout effectivement le chevauchement avec les actions du header.

- La désactivation globale de `selector-class-pattern` dans le composant masque potentiellement d’autres violations Stylelint au lieu de limiter l’exception aux sélecteurs BEM nécessaires.

- Le changement de statut vers `review` est effectué sans ajouter de compte rendu de revue visuelle ou de validation comportementale correspondant aux critères de fin de tâche.

Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b4e9-346a-7dd1-9ac8-7eddd6cea606
--------
user
# Acceptance Auditor Prompt — Story 13.2

You are an Acceptance Auditor. Review the provided diff against:
- Spec file: `docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md`
- Context specs: `docs/specs/spec-theme-light-dark/technical-architecture.md`, `docs/specs/spec-theme-light-dark/SPEC.md`, `docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`, `docs/planning-artifacts/epics.md` (Epic 13 / Story 13.2), `docs/project-context.md`, `AGENTS.md`
- Diff file: `docs/implementation-artifacts/code-reviews/13-2/full.diff`

Check for:
1. Violations of acceptance criteria (AC)
2. Deviations from spec intent
3. Missing implementation of specified behavior
4. Contradictions between spec constraints and actual code

IMPORTANT: Do not halt, pause, or ask for confirmation at intermediate checkpoints. Execute the audit completely in one shot and output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise le skill de revue de code pour structurer l’audit adversarial, puis je comparerai directement le diff aux critères d’acceptation et aux spécifications citées.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-code-review/SKILL.md && sed -n '1,240p' docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md && sed -n '1,240p' docs/implementation-artifacts/code-reviews/13-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: bmad-code-review
description: 'Adversarial code review using parallel review layers and structured triage. Use when the user says "run code review" or "review this code"'
---

# Code Review Workflow

**Goal:** Review code changes adversarially. No noise, no filler.

Subagents, when the capability is available, are an important part of this workflow. Use them as directed by the workflow steps.
If you need an explicit user instruction to run them, ask once now for the whole workflow run.

## Conventions

- Bare paths (e.g. `checklist.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `project_context` = `**/project-context.md` (load if exists)
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

- **Micro-file Design**: Each step is self-contained and followed exactly
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Persist progress via in-memory variables
- **Append-Only Building**: Build artifacts incrementally

### Step Processing Rules

1. **READ COMPLETELY**: Read the entire step file before acting
2. **FOLLOW SEQUENCE**: Execute sections in order
3. **WAIT FOR INPUT**: Halt at checkpoints and wait for human
4. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** follow the exact instructions in the step file
- **ALWAYS** halt at checkpoints and wait for human input

## FIRST STEP

Read fully and follow: `./steps/step-01-gather-context.md`
---
baseline_commit: 6ed0830e17d887fd75969597295fab6c4af5ab15
---

# Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visiteur naviguant sur `jouan.ovh`,
I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
so that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20, CAP-2, CAP-3, CAP-5).

## Acceptance Criteria

1. **Given** l'infrastructure client Nuxt 4
   **When** on initialise le thème dans l'application
   **Then** le composable `app/composables/useTheme.ts` expose l'état réactif et les méthodes de contrôle :
     - `preference: Ref<ThemePreference>` (`'system' | 'dark' | 'light'`)
     - `resolvedTheme: Ref<ResolvedTheme>` (`'dark' | 'light'`)
     - `cycleTheme(): void` (cycle ternaire `system → dark → light → system`)
     - `setTheme(pref: ThemePreference): void`
     - `initTheme(): void` (synchronisation client avec `localStorage`, évaluation de `prefers-color-scheme` et attachement de l'écouteur `change`)
   **And** côté serveur (SSR / compilation SSG `pnpm generate`), le composable s'exécute sans erreur (`import.meta.client` guards, zéro accès direct à `window`/`document`/`localStorage` lors du pré-rendu statique).

2. **Given** un visiteur sans préférence manuelle préalable
   **When** l'application s'initialise
   **Then** `preference` vaut `'system'`
   **And** `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
   **And** tout basculement du thème système de l'OS (ou bascule émulée dans DevTools) met immédiatement à jour `resolvedTheme` et l'attribut `data-theme` sur `<html>` sans rechargement de page.

3. **Given** l'appel à `setTheme(pref)`
   **When** l'utilisateur choisit `'dark'`, `'light'` ou `'system'`
   **Then** `preference.value` est mis à jour
   **And** `localStorage.setItem('jouan_theme_mode', pref)` persiste le choix (ou suppression/mise à jour propre)
   **And** `document.documentElement.setAttribute('data-theme', resolved)` applique le thème effectif
   **And** `document.documentElement.setAttribute('data-theme-source', pref)` reflète la préférence sélectionnée.

4. **Given** la génération statique Nuxt 4 (SSG) et l'hébergement GitHub Pages
   **When** une page HTML pré-rendue est chargée dans le navigateur
   **Then** un micro-script synchrone pur JS (< 15 lignes, sans dépendance externe) est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`
   **And** ce script lit `localStorage.getItem('jouan_theme_mode') || 'system'`, résout le thème effectif avant tout rendu CSS/DOM, et pose immédiatement les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
   **And** aucun flash de contenu non stylisé ou inversion de couleur (FOUC) ne se produit avant le premier paint
   **And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.

5. **Given** la suite d'outillage et les standards de code du projet
   **When** on exécute la vérification dans Docker
   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint, 0 erreur TypeScript (vue-tsc) et 24 routes SSG pré-rendues sans anomalie.

## Tasks / Subtasks

- [x] Tâche 1 — Création du composable réactif `app/composables/useTheme.ts` (AC: 1, 2, 3)
  - [x] Déclarer les types exportés `export type ThemePreference = 'system' | 'dark' | 'light'` et `export type ResolvedTheme = 'dark' | 'light'`.
  - [x] Initialiser l'état partagé via `useState<ThemePreference>('theme-preference', () => 'system')` et `useState<ResolvedTheme>('theme-resolved', () => 'dark')`.
  - [x] Implémenter la fonction interne de résolution `resolveTheme(pref: ThemePreference): ResolvedTheme` (évaluant `window.matchMedia('(prefers-color-scheme: dark)').matches` sous `'system'`).
  - [x] Implémenter `initTheme()` :
    - Guard `if (!import.meta.client) return;`
    - Lecture de `localStorage.getItem('jouan_theme_mode')` (fallback sur `'system'`).
    - Synchronisation des refs `preference` et `resolvedTheme`.
    - Écoute de l'événement `change` sur `window.matchMedia('(prefers-color-scheme: dark)')` pour réagir dynamiquement quand `preference.value === 'system'`.
  - [x] Implémenter `setTheme(pref: ThemePreference)` :
    - Mise à jour de `preference.value`.
    - Calcul du `resolvedTheme.value`.
    - Écriture dans `localStorage.setItem('jouan_theme_mode', pref)`.
    - Mise à jour synchrone de `document.documentElement.setAttribute('data-theme', resolvedTheme.value)` et `document.documentElement.setAttribute('data-theme-source', pref)`.
  - [x] Implémenter `cycleTheme()` : transition cyclique `system → dark → light → system`.

- [x] Tâche 2 — Injection du micro-script synchrone anti-FOUC dans `nuxt.config.ts` (AC: 4)
  - [x] Ajouter dans `app.head.script` de `nuxt.config.ts` le micro-script IIFE inline.
  - [x] Contenu du script :
    ```javascript
    (function() {
      try {
        var pref = localStorage.getItem('jouan_theme_mode') || 'system';
        var resolved = pref;
        if (pref === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', resolved);
        document.documentElement.setAttribute('data-theme-source', pref);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
    ```
  - [x] Configurer `type: 'text/javascript'` et `innerHTML` pour que Nitro émette le script directement dans le `<head>` de toutes les pages HTML statiques.

- [x] Tâche 3 — Initialisation client dans `app/app.vue` et prévention d'hydration mismatch (AC: 1, 4)
  - [x] Importer et appeler `const { initTheme } = useTheme()` dans `app/app.vue`.
  - [x] Déclencher `initTheme()` dans `onMounted()` pour synchroniser l'arbre Vue avec le DOM déjà étiqueté par le script anti-FOUC.
  - [x] Vérifier qu'aucun warning d'hydratation Vue n'apparaît.

- [x] Tâche 4 — Validation et conformité Docker (AC: 5)
  - [x] Vérifier dans le build `.output/public/index.html` la présence du script inline anti-FOUC dans le `<head>`.
  - [x] Exécuter la suite complète dans Docker :
    ```sh
    docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
    ```
  - [x] Valider 0 erreur ESLint / Stylelint, 0 erreur TypeScript vue-tsc et 24 routes SSG générées.

## Dev Notes

### Architecture logicielle & Contrats d'API
- **Fichier principal à créer :** `app/composables/useTheme.ts`
- **Fichiers à modifier :**
  - `nuxt.config.ts` (section `app.head.script`)
  - `app/app.vue` (appel `initTheme()` dans `onMounted`)
- **Fichiers de référence :**
  - Spécification technique : [`docs/specs/spec-theme-light-dark/technical-architecture.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/technical-architecture.md)
  - Spécification UX : [`docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md`](file:///Users/simon/dev/jouan.ovh/docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md)
  - Contrat général : [`docs/specs/spec-theme-light-dark/SPEC.md`](file:///Users/simon/dev/jouan.ovh/docs/specs/spec-theme-light-dark/SPEC.md)
  - Règles globales : [`AGENTS.md`](file:///Users/simon/dev/jouan.ovh/AGENTS.md)

### Invariants critiques à respecter
- **Environnement Docker obligatoire :** Ne jamais exécuter `pnpm` sur la machine hôte. Toute commande s'exécute via :
  ```sh
  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
  ```
- **Zéro Emoji :** Aucun caractère emoji dans les commentaires ou le code.
- **SSR / SSG Hydration Guard :** Ne jamais accéder à `window`, `document` ou `localStorage` en dehors d'une garde `import.meta.client` ou du hook Vue `onMounted`. Au rendu SSR/SSG, `useState` fournit des valeurs par défaut stables (`'system'` et `'dark'`).
- **Clé de stockage unique :** Toujours utiliser `'jouan_theme_mode'`.

### Code Snippet de référence pour `app/composables/useTheme.ts`

```typescript
import { ref } from 'vue';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'jouan_theme_mode';

export function useTheme() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system');
  const resolvedTheme = useState<ResolvedTheme>('theme-resolved', () => 'dark');

  const resolveSystemTheme = (): ResolvedTheme => {
    if (!import.meta.client) return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
    if (!import.meta.client) return;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-source', pref);
  };

  const setTheme = (pref: ThemePreference) => {
    preference.value = pref;
    const resolved = pref === 'system' ? resolveSystemTheme() : pref;
    resolvedTheme.value = resolved;

    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, pref);
      } catch {
        // Mode privé strict
      }
      applyToDom(resolved, pref);
    }
  };

  const cycleTheme = () => {
    const nextMap: Record<ThemePreference, ThemePreference> = {
      system: 'dark',
      dark: 'light',
      light: 'system',
    };
    setTheme(nextMap[preference.value] || 'system');
  };

  const initTheme = () => {
    if (!import.meta.client) return;

    let storedPref: ThemePreference = 'system';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        storedPref = stored;
      }
    } catch {
      // Ignorer si localStorage inaccessible
    }

    preference.value = storedPref;
    const resolved = storedPref === 'system' ? resolveSystemTheme() : storedPref;
    resolvedTheme.value = resolved;
    applyToDom(resolved, storedPref);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (preference.value === 'system') {
        const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
        resolvedTheme.value = newResolved;
        applyToDom(newResolved, 'system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }
  };

  return {
    preference,
    resolvedTheme,
    setTheme,
    cycleTheme,
    initTheme,
  };
}
```

## Dev Agent Record

### Agent Model Used

Gemini 3.7 Flash (Medium)

### Debug Log References

- Validation Docker exécutée : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`
- 0 erreur ESLint / Stylelint, 0 erreur TypeScript (vue-tsc), 24 routes SSG pré-rendues avec succès.
- Vérification du `<head>` généré dans `.output/public/index.html` : script inline synchrone anti-FOUC présent.

### Completion Notes List

- Création du composable réactif `app/composables/useTheme.ts` avec gestion des états `preference` (`'system' | 'dark' | 'light'`) et `resolvedTheme` (`'dark' | 'light'`), synchronisation bidirectionnelle avec `localStorage` (`jouan_theme_mode`) et écouteur réactif `matchMedia('(prefers-color-scheme: dark)')`.
- Implémentation du cycle ternaire `cycleTheme()` (`system → dark → light → system`) et de l'initialisation sûre en environnement SSR/SSG.
- Injection du micro-script synchrone anti-FOUC inline dans `nuxt.config.ts` (`app.head.script`) pour poser immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant le premier paint.
- Initialisation client dans `app/app.vue` via `onMounted` sans aucune discordance d'hydratation.

### File List

- `app/composables/useTheme.ts` (créé)
diff --git a/app/app.vue b/app/app.vue
index 143c19e..de55fed 100644
--- a/app/app.vue
+++ b/app/app.vue
@@ -5,8 +5,15 @@
 </template>
 
 <script setup lang="ts">
+import { onMounted } from "vue";
 import { SITE } from "~/data/site";
 
+const { initTheme } = useTheme();
+
+onMounted(() => {
+  initTheme();
+});
+
 // Métadonnées Schema.org globales (Organization / publisher du site).
 // Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
 const siteUrl = useSiteUrl();
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 7ec2bf6..7237ebe 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-18 (Story 13.1 prête pour le dev)"
+last_updated: "2026-09-18 (Story 13.2 terminée et prête pour revue)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -139,8 +139,8 @@ development_status:
 
   # Epic 13 — Thème Light & Dark et Bascule Utilisateur
   epic-13: in-progress
-  13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: ready-for-dev
-  13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: backlog
+  13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal: done
+  13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc: review
   13-3-composant-themetoggle-icones-vectorielles-et-integration-header-mobile: backlog
   13-4-validation-transverse-atmosphere-dambiance-et-gate-docker-nitro-ssg: backlog
   epic-13-retrospective: optional
diff --git a/nuxt.config.ts b/nuxt.config.ts
index 3808249..3f435c2 100644
--- a/nuxt.config.ts
+++ b/nuxt.config.ts
@@ -27,6 +27,13 @@ export default defineNuxtConfig({
             " Discutons de votre projet.",
         },
       ],
+      script: [
+        {
+          type: "text/javascript",
+          innerHTML:
+            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
+        },
+      ],
     },
   },
   css: ["@/assets/scss/main.scss"],
diff --git a/app/composables/useTheme.ts b/app/composables/useTheme.ts
new file mode 100644
index 0000000..91d808c
--- /dev/null
+++ b/app/composables/useTheme.ts
@@ -0,0 +1,99 @@
+export type ThemePreference = "system" | "dark" | "light";
+export type ResolvedTheme = "dark" | "light";
+
+const STORAGE_KEY = "jouan_theme_mode";
+
+/**
+ * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
+ *
+ * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
+ * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
+ * avec localStorage et les preferences systeme de l'OS.
+ */
+export function useTheme() {
+  const preference = useState<ThemePreference>("theme-preference", () => "system");
+  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");
+
+  const resolveSystemTheme = (): ResolvedTheme => {
+    if (!import.meta.client) {
+      return "dark";
+    }
+    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
+  };
+
+  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
+    if (!import.meta.client) {
+      return;
+    }
+    document.documentElement.setAttribute("data-theme", resolved);
+    document.documentElement.setAttribute("data-theme-source", pref);
+  };
+
+  const setTheme = (pref: ThemePreference) => {
+    preference.value = pref;
+    const resolved = pref === "system" ? resolveSystemTheme() : pref;
+    resolvedTheme.value = resolved;
+
+    if (import.meta.client) {
+      try {
+        localStorage.setItem(STORAGE_KEY, pref);
+      } catch {
+        // Ignorer en navigation privee restrictive
+      }
+      applyToDom(resolved, pref);
+    }
+  };
+
+  const cycleTheme = () => {
+    const nextMap: Record<ThemePreference, ThemePreference> = {
+      system: "dark",
+      dark: "light",
+      light: "system",
+    };
+    setTheme(nextMap[preference.value] || "system");
+  };
+
+  const initTheme = () => {
+    if (!import.meta.client) {
+      return;
+    }
+
+    let storedPref: ThemePreference = "system";
+    try {
+      const stored = localStorage.getItem(STORAGE_KEY);
+      if (stored === "dark" || stored === "light" || stored === "system") {
+        storedPref = stored;
+      }
+    } catch {
+      // Ignorer si localStorage inaccessible
+    }
+
+    preference.value = storedPref;
+    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
+    resolvedTheme.value = resolved;
+    applyToDom(resolved, storedPref);
+
+    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
+    const handleMediaChange = (e: MediaQueryListEvent) => {
+      if (preference.value === "system") {
+        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
+        resolvedTheme.value = newResolved;
+        applyToDom(newResolved, "system");
+      }
+    };
+
+    if (mediaQuery.addEventListener) {
+      mediaQuery.addEventListener("change", handleMediaChange);
+    } else {
+      mediaQuery.addListener(handleMediaChange);
+    }
+  };
+
+  return {
+    preference,
+    resolvedTheme,
+    setTheme,
+    cycleTheme,
+    initTheme,
+  };
+}

exec
/bin/zsh -lc "python3 /Users/simon/dev/jouan.ovh/_bmad/scripts/resolve_customization.py --skill /Users/simon/.codex/skills/bmad-code-review --key workflow 2>&1; sed -n '1,260p' /Users/simon/.codex/skills/bmad-code-review/steps/step-01-gather-context.md; sed -n '1,260p' docs/specs/spec-theme-light-dark/technical-architecture.md; sed -n '1,260p' docs/specs/spec-theme-light-dark/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
{
  "workflow": {
    "activation_steps_prepend": [],
    "activation_steps_append": [],
    "persistent_facts": [
      "file:{project-root}/**/project-context.md"
    ],
    "on_complete": "",
    "review_layers": [
      {
        "id": "blind-hunter",
        "name": "Blind Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-adversarial-general` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "edge-case-hunter",
        "name": "Edge Case Hunter",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-edge-case-hunter` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "verification-gap",
        "name": "Verification Gap Reviewer",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> Invoke the `bmad-review-verification-gap` skill on this diff:\n>\n> {diff_output}\n"
      },
      {
        "id": "acceptance-auditor",
        "name": "Acceptance Auditor",
        "when": "Only when {review_mode} = \"full\".",
        "instruction": "Launch a subagent with no prior conversation context, with this prompt:\n\n> You are an Acceptance Auditor. Review the provided diff against `{spec_file}` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.\n>\n> Diff:\n> {diff_output}\n"
      }
    ]
  }
}
---
diff_output: '' # set at runtime
spec_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: "full" or "no-spec"
story_key: '' # set at runtime when discovered from sprint status
---

# Step 1: Gather Context

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The prompt that triggered this workflow IS the intent — not a hint.
- Do not modify any files. This step is read-only.

## INSTRUCTIONS

1. **Find the review target.** The conversation context before this skill was triggered IS your starting point — not a blank slate. Check in this order — stop as soon as the review target is identified:

   **Tier 1 — Explicit argument.**
   Did the user pass a PR, commit SHA, branch, spec file, or diff source this message?
   - PR reference → resolve to branch/commit via `gh pr view`. If resolution fails, ask for a SHA or branch.
   - Commit or branch → use directly.
   - Spec file → set `{spec_file}` to the provided path. Check its frontmatter for `baseline_commit`. If found, use as diff baseline. If not found, continue the cascade (a spec alone does not identify a diff source).
   - Also scan the argument for diff-mode keywords that narrow the scope:
     - "staged" / "staged changes" → Staged changes only
     - "uncommitted" / "working tree" / "all changes" → Uncommitted changes (staged + unstaged)
     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
     - "commit range" / "last N commits" / "<from-sha>..<to-sha>" → Specific commit range
     - "this diff" / "provided diff" / "paste" → User-provided diff (do not match bare "diff" — it appears in other modes)
   - When multiple keywords match, prefer the most specific (e.g., "branch diff" over bare "diff").

   **Tier 2 — Recent conversation.**
   Do the last few messages reveal what the user wants to be reviewed? Look for spec paths, commit refs, branches, PRs, or descriptions of a change. Apply the same diff-mode keyword scan and routing as Tier 1.

   **Tier 3 — Sprint tracking.**
   Look for a sprint status file (`*sprint-status*`) in `{implementation_artifacts}` or `{planning_artifacts}`. If found, scan for stories with status `review`:
   - **Exactly one `review` story:** Set `{story_key}` to the story's key (e.g., `1-2-user-auth`). Suggest it: "I found story <story-id> in `review` status. Would you like to review its changes? [Y] Yes / [N] No, let me choose". If confirmed, use the story context to determine the diff source (branch name derived from story slug, or uncommitted changes). If declined, clear `{story_key}` and fall through.
   - **Multiple `review` stories:** Present them as numbered options alongside a manual choice option. Wait for user selection. If a story is selected, set `{story_key}` and use its context to determine the diff source. If manual choice is selected, clear `{story_key}` and fall through.
   - **None:** Fall through.

   **Tier 4 — Current git state.**
   If version control is unavailable, skip to Tier 5. Otherwise, check the current branch and HEAD. If the branch is not `main` (or the default branch), confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, treat as a branch diff against `main`. If declined, fall through.

   **Tier 5 — Ask.**
   Fall through to instruction 2.

   Never ask extra questions beyond what the cascade prescribes. If a tier above already identified the target, skip the remaining tiers and proceed to instruction 3 (construct diff).

2. HALT. Ask the user: **What do you want to review?** Present these options:
   - **Uncommitted changes** (staged + unstaged)
   - **Staged changes only**
   - **Branch diff** vs a base branch (ask which base branch)
   - **Specific commit range** (ask for the range)
   - **Provided diff or file list** (user pastes or provides a path)

3. Construct `{diff_output}` from the chosen source.
   - For **staged changes only**: run `git diff --cached`.
   - For **uncommitted changes** (staged + unstaged): run `git diff HEAD`.
   - For **branch diff**: verify the base branch exists before running `git diff`. If it does not exist, HALT and ask the user for a valid branch.
   - For **commit range**: verify the range resolves. If it does not, HALT and ask the user for a valid range.
   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff.
   - For **file list**: validate each path exists in the working tree. Construct `{diff_output}` by running `git diff HEAD -- <path1> <path2> ...`. If any paths are untracked (new files not yet staged), use `git diff --no-index /dev/null <path>` to include them. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
   - After constructing `{diff_output}`, verify it is non-empty regardless of source type. If empty, HALT and tell the user there is nothing to review.

4. **Set the spec context.**
   - If `{spec_file}` is already set (from Tier 1 or Tier 2): verify the file exists and is readable, then set `{review_mode}` = `"full"`.
   - Otherwise, ask the user: **Is there a spec or story file that provides context for these changes?**
     - If yes: set `{spec_file}` to the path provided, verify the file exists and is readable, then set `{review_mode}` = `"full"`.
     - If no: set `{review_mode}` = `"no-spec"`.

5. If `{review_mode}` = `"full"` and the file at `{spec_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.

6. Sanity check: if `{diff_output}` exceeds approximately 3000 lines, warn the user and offer to chunk the review by file group.
   - If the user opts to chunk: agree on the first group, narrow `{diff_output}` accordingly, and list the remaining groups for the user to note for follow-up runs.
   - If the user declines: proceed as-is with the full diff.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `./step-02-review.md`
# Technical Architecture — Thème Light & Dark

> Compagnon technique à `SPEC.md`. Détaille l'architecture logicielle, les contrats d'API client, les tokens SCSS et le mécanisme anti-FOUC sous Nuxt 4 SSG.

---

## 1. Architecture des Tokens SCSS (`_root.scss`)

Le design system repose sur une cascade de variables CSS :
1. **Défaut sur `:root` :** Conserve la palette sombre actuelle comme socle de base (`--surface-0`, `--ink-1`, etc.).
2. **Surcharge sur `[data-theme="light"]` :** Réaffecte les alias sémantiques aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md`.
3. **Exception sanctuarisée :** Les sélecteurs du terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: #2e0024`, `--text-strong: #f5f3f0`, `--text-body: #c3bdb7`), assurant l'immunité au thème clair.

```scss
// app/assets/scss/abstract/_root.scss

:root {
  // Base sombre (existante)...
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
}

// Surcharge Thème Clair
[data-theme="light"] {
  --bg-page: hsl(38deg 25% 97%);        // #FAF8F4 crème solaire
  --bg-sunken: hsl(38deg 20% 93%);      // #F1EDE6
  --bg-card: hsl(0deg 0% 100%);         // #FFFFFF cartes blanches
  --bg-elevated: hsl(38deg 30% 99%);    // #FFFEFB
  --bg-input: hsl(38deg 15% 95%);       // #F5F3EE
  
  --text-strong: hsl(320deg 30% 12%);   // #271524 titres aubergine sombre
  --text-body: hsl(320deg 18% 26%);     // #473644 corps de texte
  --text-muted: hsl(320deg 10% 44%);    // #756773 légendes
  --text-faint: hsl(320deg 8% 58%);     // #988D96 désactivé
  
  --border-subtle: hsl(35deg 15% 88%);  // #E6E2DC
  --border-default: hsl(35deg 12% 80%); // #D1CCC4
  --border-strong: hsl(35deg 12% 68%);  // #B3ABA2
  
  --accent: hsl(24deg 95% 44%);         // #DA5207 contraste AA > 4.5:1 sur fond clair
  --shadow-1: 0 1px 3px hsl(35deg 20% 40% / 8%);
  --shadow-2: 0 3px 10px hsl(35deg 20% 40% / 10%);
}
```

---

## 2. Script Inline Anti-FOUC (`nuxt.config.ts`)

Pour éviter tout flash noir/blanc lors du premier rendu statique sur GitHub Pages :
- Un micro-script synchrone auto-exécuté est inséré tout en haut du `<head>` via `app.head.script`.
- Il lit `localStorage.getItem('jouan_theme_mode')` et évalue `window.matchMedia('(prefers-color-scheme: dark)')`.
- Il applique immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant tout affichage graphique.

```javascript
// Injection anti-FOUC (exécutée avant le premier rendu du navigateur)
(function() {
  try {
    var stored = localStorage.getItem('jouan_theme_mode') || 'system';
    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var resolved = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-source', stored);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
```

---

## 3. Composable `useTheme()` (`app/composables/useTheme.ts`)

Source unique de vérité pour la réactivité du thème dans Vue :

```typescript
export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

export const useTheme = () => {
  const preference = useState<ThemePreference>('theme-preference', () => 'system');
  const resolved = useState<ResolvedTheme>('theme-resolved', () => 'dark');

  // Initialisation client
  const initTheme = () => { /* synchronisation avec localStorage et matchMedia */ };

  // Cycle ternaire : system -> dark -> light -> system
  const cycleTheme = () => {
    const next: Record<ThemePreference, ThemePreference> = {
      system: 'dark',
      dark: 'light',
      light: 'system',
    };
    setTheme(next[preference.value]);
  };

  const setTheme = (pref: ThemePreference) => {
    preference.value = pref;
    // Mise à jour localStorage + DOM data-theme
  };

  return { preference, resolved, cycleTheme, setTheme, initTheme };
};
```

---

## 4. Intégration du Composant `ThemeToggle.vue`

- **Composant UI :** `app/components/ui/ThemeToggle.vue`
- **Positionnement :**
  1. Desktop : dans `HeaderComponent.vue`, dans `.hdr__dock-right`, immédiatement devant `.hdr__status-badge`.
  2. Mobile : dans `HeaderComponent.vue`, dans `.hdr__menu-status`, en vis-à-vis du statut.
- **Iconographie :** 3 symboles vectoriels déclarés dans `ZIcon.vue` :
  - `monitor` : Écran épuré avec pied (mode système).
  - `moon` : Croissant de lune technique (mode sombre).
  - `sun` : Cercle central avec 8 rayons géométriques (mode clair).
---
id: SPEC-theme-light-dark
companions:
  - ../../planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
  - technical-architecture.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Thème Light & Dark (jouan.ovh)

## Why

Le site actuel est conçu exclusivement en thème sombre aubergine, ce qui limite le confort de lecture pour les visiteurs consultant le portfolio en environnement à forte luminosité (en extérieur, sur écran non traité ou selon leur habitude système). L'ajout d'un thème clair « Papier technique / Crème solaire » tout en préservant le terminal sombre résout cette gêne visuelle, renforce l'accessibilité globale et offre aux visiteurs un contrôle complet (synchronisation avec leur OS ou forçage manuel persistant).

## Capabilities

- id: CAP-1
  intent: Le visiteur peut consulter l'intégralité du site dans une palette claire « Papier technique » contrastée et lisible sans dénaturer l'identité de marque ni modifier l'apparence sombre des terminaux.
  success: L'application de `data-theme="light"` permute l'ensemble des arrière-plans (`#FAF8F4`), bordures et textes aubergine profonde (`#271524`, contraste > 8:1) sur toutes les routes statiques, tandis que le Terminal Hero et les fenêtres flottantes conservent leur fond sombre (`#2E0024`) et leurs couleurs syntaxiques d'origine.

- id: CAP-2
  intent: Le site adopte automatiquement le thème préféré du système d'exploitation de l'utilisateur dès la première visite et réagit en temps réel à tout changement d'ambiance système tant qu'aucun forçage n'a été enregistré.
  success: En absence de clé locale, le basculement de `prefers-color-scheme` entre sombre et clair dans le système (ou l'émulation DevTools) adapte immédiatement le thème sans rafraîchissement ni interruption de lecture.

- id: CAP-3
  intent: L'utilisateur peut surcharger manuellement le thème de son choix et conserver ce paramètre lors de ses visites ultérieures sur le même terminal.
  success: La sélection d'un thème forcé (`dark` ou `light`) s'enregistre dans le `localStorage` du navigateur sous la clé `jouan_theme_mode` et est restaurée fidèlement lors des rechargements et navigations futures.

- id: CAP-4
  intent: L'utilisateur dispose dans le Header d'une commande compacte positionnée immédiatement à gauche du statut « Disponible » permettant de faire défiler les états Système, Sombre et Clair.
  success: Un bouton d'action placé dans le dock d'état du header (`.hdr__dock-right`) et dans le tiroir mobile avance cycliquement dans l'ordre `Système → Sombre → Clair → Système`, affiche l'icône vectorielle correspondante (`monitor` / `moon` / `sun`), et met à jour son `aria-label` descriptif sans aucun emoji textuel.

- id: CAP-5
  intent: Tout chargement d'une page pré-rendue applique le thème effectif dès le premier instant sans aucun flash lumineux ou clignotement de thème inverse lors de l'hydratation côté client.
  success: Un script inline synchrone injecté dans le `<head>` du document HTML résout et applique `data-theme` sur l'élément racine avant le premier paint du navigateur, sans provoquer de décalage de mise en page ni de flash FOUC.

- id: CAP-6
  intent: La sélection du thème et la navigation en mode clair sont pleinement utilisables au clavier, intelligibles pour les lecteurs d'écran et visibles en mode contraste élevé système.
  success: Le bouton est manipulable par `Tab`, `Entrée` et `Espace`, expose un indicateur de focus distinct (`--ring-accent`), supporte le mode Windows High Contrast via `forced-colors`, et tous les textes du thème clair valident le seuil de contraste WCAG AA (> 4.5:1).

## Constraints

- **Environnement Docker exclusif :** Toute compilation, vérification TypeScript et validation SSG s'exécute strictement via `docker compose run --rm web ...`.
- **Zéro Emoji :** Conformité stricte avec la règle NFR6 du projet (aucun caractère emoji dans les libellés, infobulles, SVG ou code).
- **Sanctuarisation du Terminal :** Le Terminal Hero et le composant `TerminalComponent` conservent impérativement leur fond sombre aubergine (`#2E0024`) et leur rendu CLI dans les deux thèmes.
- **Architecture SSG Statique :** Aucune dépendance à un middleware serveur ou cookie HTTP dynamique ; persistance reposant exclusivement sur `localStorage` et les media queries côté client.
- **DRY & Pas de tokens hardcodés :** Toutes les couleurs et élévations sont exposées via les variables CSS sémantiques de `_root.scss`.

## Non-goals

- Ne pas implémenter de sélecteur libre de couleurs ou de générateur de thèmes personnalisés.
- Ne pas synchroniser le thème via un compte utilisateur ou un backend distant.
- Ne pas convertir l'interface interne du terminal en thème clair.
- Ne pas introduire de bibliothèque externe de gestion de thème ou de framework CSS tiers.

## Success signal

Sur n'importe quelle page de `jouan.ovh`, un utilisateur clique sur la commande située à gauche de « Disponible » : l'interface bascule instantanément entre les modes Système, Sombre et Clair avec une palette crème « Papier technique » contrastée WCAG AA/AAA, le choix persiste au rechargement de page sans flash FOUC, et la suite de vérification Docker (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur sur l'ensemble des 13 routes statiques.

## Assumptions

- Les trois tracés d'icônes (`monitor`, `moon`, `sun`) sont ajoutés directement dans `ZIcon.vue` sans dépendance externe.
- Le script synchrone anti-FOUC est configuré dans `nuxt.config.ts` au niveau de `app.head.script`.

exec
/bin/zsh -lc "sed -n '1,280p' docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md; rg -n -C 4 \"Epic 13|Story 13\\.2|13\\.2|theme|thème|FOUC|matchMedia|localStorage|data-theme\" docs/planning-artifacts/epics.md docs/project-context.md AGENTS.md app nuxt.config.ts | head -n 500" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
name: jouan.ovh
description: Systèmes IA & automatisation métier — Expérience et Comportement Thème Light & Dark
status: final
sources:
  - docs/project-context.md
  - AGENTS.md
  - docs/specs/spec-repositionnement-ia/SPEC.md
  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
updated: 2026-09-18
---

# Experience Specification — Thème Light & Dark (jouan.ovh)

## 1. Foundation

- **Plateforme & Form-factor :** Web responsive universel (Desktop large, Laptop, Tablette, Mobile).
- **Architecture technique sous-jacente :** Nuxt 4 SSG (génération statique), Vue 3 (`<script setup lang="ts">`), SCSS Dark-first avec variables CSS sur `:root` et surcharge via l'attribut HTML racine `[data-theme="light"]` / `[data-theme="dark"]`.
- **Référence d'identité visuelle :** `DESIGN.md` (spécification des tokens, contrastes et de l'ambiance « Papier technique / Crème solaire »).
- **Rôle de cette spécification :** Définir la mécanique d'orchestration du thème, les transitions d'état, la persistance locale, les comportements du composant `ThemeToggle` et la garantie d'accessibilité sans faille (a11y).

---

## 2. Information Architecture

### 2.1 Emplacement du point de contrôle (ThemeToggle)

Le contrôle du thème est un utilitaire d'ambiance et de confort de lecture. Il s'insère naturellement dans l'architecture globale sans perturber le tunnel de conversion commercial :

| Surface / Conteneur | Emplacement Précis | Rôle et Contexte UX |
|---|---|---|
| **Header Desktop** | `.hdr__dock-right`, immédiatement à gauche du badge d'état `.hdr__status-badge` (« Disponible »). | Présent en permanence sans encombrer la navigation principale (`~`, `//`, `./`, `~/`, `$`). Équilibre visuellement l'horloge et le badge de disponibilité. |
| **Menu Mobile (Drawer)** | `.hdr__menu-status` (dans le bas du volet mobile ouvert), aligné avec le statut « Disponible » et l'horloge. | Accessible facilement au pouce lors de l'ouverture du menu mobile, sans surcharger la barre fixe supérieure sur petit écran. |

---

## 3. Voice and Tone (Microcopy & Accessibilité Vocale)

En accord avec la charte sobre et professionnelle du site (zéro emoji, style inspiré du terminal d'`AGENTS.md`) :
- **Intitulés accessibles (`aria-label`) :** Dynamiques et descriptifs du mode courant et de l'action à venir.
  - État `system` actif (OS sombre) : `"Thème : Système (Sombre actif). Cliquer pour forcer le mode Sombre."`
  - État `system` actif (OS clair) : `"Thème : Système (Clair actif). Cliquer pour forcer le mode Sombre."`
  - État `dark` forcé : `"Thème : Sombre forcé. Cliquer pour forcer le mode Clair."`
  - État `light` forcé : `"Thème : Clair forcé. Cliquer pour revenir au mode Système."`
- **Infobulle native (`title`) :** `"Changer de thème (Système / Sombre / Clair)"`.
- **Annonce d'état (Live Region / Lecteur d'écran) :** Lors du changement, un élément masqué avec `aria-live="polite"` annonce : `"Mode [Sombre / Clair / Système] activé."`

---

## 4. Component Patterns — Le Composant `ThemeToggle`

### 4.1 Modèle de Données & Cycle Ternaire

L'état utilisateur `themePreference` accepte 3 valeurs :
1. `'system'` : L'application écoute le média `(prefers-color-scheme: dark)`.
2. `'dark'` : L'utilisateur force le mode sombre, indépendamment de l'OS.
3. `'light'` : L'utilisateur force le mode clair, indépendamment de l'OS.

**Algorithme de cycle au clic / déclenchement clavier :**
```text
[ system ] ──(clic)──> [ dark ] ──(clic)──> [ light ] ──(clic)──> [ system ]
```

### 4.2 Résolution du Thème Effectif (`resolvedTheme`)
- Si `themePreference === 'dark'` → `resolvedTheme = 'dark'`
- Si `themePreference === 'light'` → `resolvedTheme = 'light'`
- Si `themePreference === 'system'` → `resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`

### 4.3 Application sur le DOM
Le thème résolu est projeté directement sur l'élément racine :
- `<html data-theme="dark">` ou `<html data-theme="light">`
- Si `themePreference === 'system'`, un attribut complémentaire `data-theme-source="system"` est présent pour permettre le stylage fin de l'indicateur d'état.

---

## 5. State Patterns & Persistance

### 5.1 Persistance Locale
- **Clé de stockage :** `localStorage.getItem('jouan_theme_mode')`.
- **Valeurs valides :** `'system' | 'dark' | 'light'`.
- Si aucune clé n'est trouvée (visiteur novice ou navigation privée réinitialisée) : valeur par défaut `'system'`.

### 5.2 Prévention du Flash au Chargement (Anti-FOUC)
Puisque `jouan.ovh` est compilé en SSG (HTML statique pré-généré sur GitHub Pages) :
- **Problème à bannir :** Un visiteur avec préférence « Light » ou OS clair ne doit jamais subir un flash noir de 200ms pendant l'hydratation Vue.
- **Pattern de solution obligatoire :**
  Un script synchrone ultra-léger (< 15 lignes de JavaScript pur sans dépendance) injecté au tout début du `<head>` dans `nuxt.config.ts` :
  ```js
  (function() {
    try {
      var pref = localStorage.getItem('jouan_theme_mode') || 'system';
      var resolved = pref;
      if (pref === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.setAttribute('data-theme-source', pref);
    } catch (e) {}
  })();
  ```
- Dès que le DOM commence à peindre, `data-theme` est positionné, évitant tout clignotement.

### 5.3 Écoute Système Réactive
Quand `themePreference === 'system'`, un listener sur `window.matchMedia('(prefers-color-scheme: dark)')` met à jour automatiquement `data-theme` si l'utilisateur bascule son OS du mode jour au mode nuit (ou inversement via programmation horaire de son système d'exploitation).

---

## 6. Interaction Primitives

- **Clic souris / Tap tactile :** Avance au prochain état dans la boucle ternaire.
- **Support Clavier :**
  - Le bouton est un `<button type="button">` natif, atteignable via la touche `Tab`.
  - Déclenchable par `Entrée` ou `Espace`.
  - Focus visible haute visibilité avec anneau orange (`--ring-accent`).
- **Comportement Motion Réduit (`prefers-reduced-motion: reduce`) :**
  - Toutes les animations de rotation d'icône ou de transition d'arrière-plan sont désactivées. Le changement de thème et d'icône est instantané.

---

## 7. Accessibility Floor (Normes & Résilience a11y)

1. **Règle Zéro-Emoji :** L'UI n'utilise aucun glyphe Unicode de soleil ou de lune dans ses textes ou infobulles. Les icônes sont des tracés SVG scalables intégrés avec `aria-hidden="true"`.
2. **Cibles tactiles :**
   - Taille minimale de 36px sur desktop, 40px avec zone de tap étendue (padding invisible) sur mobile pour respecter le standard WCAG 2.5.5 / 2.5.8.
3. **Mode Contraste Élevé Système (`forced-colors: active`) :**
   - Le bouton dispose du repli `outline: 2px solid transparent; outline-offset: 2px;` pour garantir sa lisibilité en mode Windows High Contrast.
   - Les icônes SVG utilisent `fill: currentColor; stroke: currentColor;` afin d'hériter des couleurs imposées par le système (ex. `ButtonText`, `Highlight`).
4. **Sanctuarisation du terminal :**
   - Même si l'utilisateur sélectionne le thème clair, la console terminal hero et les fenêtres interactives conservent leur contraste AAA sur fond noir/aubergine (`#2e0024`), empêchant toute fatigue visuelle ou illisibilité de la syntaxe de code.

---

## 8. Key Flows (Parcours Utilisateurs Clés)

### Flow 1 — Alexandre, CTO en télétravail lumineux (OS en mode Clair)
1. **Contexte :** 14h, journée ensoleillée. L'OS d'Alexandre (macOS) est réglé en mode clair.
2. **Arrivée :** Alexandre ouvre `https://jouan.ovh`.
3. **Beat 1 :** Grâce au script anti-FOUC, le site s'affiche immédiatement dans le thème « Papier technique / Crème solaire ». Aucun flash sombre. Les cartes blanches se détachent délicatement sur le fond crème.
4. **Beat 2 (Climax) :** Alexandre arrive sur le Hero et s'arrête sur le Terminal interactif. Le terminal est noir et violet sombre, avec son prompt vert étincelant. Alexandre tape `./workflow --inspect` et apprécie le contraste saisissant entre la lisibilité reposante de la page et l'aspect pro du terminal.
5. **Résultat :** Confort de lecture optimal en plein soleil, image de marque technique préservée.

---

### Flow 2 — Sophie, Directrice des opérations le soir (Forçage Manuel)
1. **Contexte :** 22h, Sophie consulte le site depuis son smartphone. Son OS est en mode sombre.
2. **Beat 1 :** Le site s'ouvre naturellement en mode sombre aubergine, synchronisé avec son système.
3. **Beat 2 :** Sophie préfère lire les études de cas de Keova Signal avec un contraste positif (texte sombre sur fond clair).
4. **Beat 3 (Climax) :** Elle ouvre le menu burger, aperçoit le bouton de thème à côté du badge vert « Disponible » et clique dessus deux fois : l'état passe à `Sombre forcé`, puis à `Clair forcé`. La page s'éclaire doucement.
5. **Résultat :** La préférence est stockée dans son `localStorage`. Quand elle revient le lendemain, le site s'ouvre toujours en mode clair sans réinitialisation.

---

### Flow 3 — Rétablissement de la synchronisation système
1. **Contexte :** Sophie souhaite à nouveau laisser son iPhone gérer automatiquement le thème jour/nuit.
2. **Action :** Depuis le dock d'état, elle clique sur le bouton de thème (actuellement en icône soleil).
3. **Climax :** Le bouton affiche désormais l'icône écran/système, et le thème redevient immédiatement sombre en harmonie avec son OS nocturne.
4. **Résultat :** `jouan_theme_mode` est réinitialisé à `'system'`.
AGENTS.md-136-- **Raccourcis clavier :** La touche `Échap` ferme la fenêtre terminal et restitue automatiquement le focus à l'élément déclencheur.
AGENTS.md-137-
AGENTS.md-138-### 5. Nuxt 4 Gotchas
AGENTS.md-139-- **`<component :is="...">` :** Passer un nom de composant en chaîne de caractères (`:is="'NuxtLink'"`) **ne résout pas** l'auto-import Nuxt. Il faut importer explicitement la référence depuis `#components` (`import { NuxtLink } from "#components"`) et la lier comme valeur.
AGENTS.md:140:- **Prerender compatibility :** Le site étant statique, aucun accès direct à `window`, `document` ou `localStorage` n'est toléré en dehors du hook `onMounted` ou d'une garde `import.meta.client`.
AGENTS.md-141-- **Génération d'IDs :** Toujours utiliser `useId()` de Nuxt/Vue pour générer des attributs `id` de formulaires hydration-safe.
AGENTS.md-142-
AGENTS.md-143-### 6. Pipeline CI/CD & Déploiement
AGENTS.md-144-- Le fichier `public/CNAME` contient **`jouan.ovh`**. Ne jamais le modifier ou le supprimer.
--
AGENTS.md-168-   - 0 erreur TypeScript vue-tsc.
AGENTS.md-169-   - 13 routes statiques (+ assets) pré-rendues avec succès par Nitro.
AGENTS.md-170-2. **Vérification visuelle & comportementale :**
AGENTS.md-171-   - Contrôle visuel comparatif sur navigateur (desktop et mobile) conforme à la maquette cible.
AGENTS.md:172:   - Rendu fidèle au Design System (thème sombre aubergine, orange accent, typographie Ubuntu).
AGENTS.md-173-   - Navigation clavier fonctionnelle (focus visible, ordre logique).
AGENTS.md-174-   - Pas de valeurs CSS en dur non justifiées.
AGENTS.md-175-
AGENTS.md-176----
--
nuxt.config.ts-30-      script: [
nuxt.config.ts-31-        {
nuxt.config.ts-32-          type: "text/javascript",
nuxt.config.ts-33-          innerHTML:
nuxt.config.ts:34:            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
nuxt.config.ts-35-        },
nuxt.config.ts-36-      ],
nuxt.config.ts-37-    },
nuxt.config.ts-38-  },
--
docs/planning-artifacts/epics.md-17-  - docs/specs/spec-repositionnement-ia/services-and-pricing.md
docs/planning-artifacts/epics.md-18-  - docs/specs/spec-repositionnement-ia/projects-showcase.md
docs/planning-artifacts/epics.md-19-  - docs/jouan-ovh-offre-v1-brief-codex.md
docs/planning-artifacts/epics.md-20-  - AGENTS.md
docs/planning-artifacts/epics.md:21:  - docs/specs/spec-theme-light-dark/SPEC.md
docs/planning-artifacts/epics.md:22:  - docs/specs/spec-theme-light-dark/technical-architecture.md
docs/planning-artifacts/epics.md-23-  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/DESIGN.md
docs/planning-artifacts/epics.md-24-  - docs/planning-artifacts/ux-designs/ux-jouan.ovh-2026-09-18/EXPERIENCE.md
docs/planning-artifacts/epics.md-25-  - docs/specs/spec-analytics-search-console/SPEC.md
docs/planning-artifacts/epics.md-26-  - docs/specs/spec-analytics-search-console/tracking-plan.md
--
docs/planning-artifacts/epics.md-81-FR34: CTA global inspecteur de workflow (`$ ./workflow --inspect`) et formulaire de contact orienté qualification de processus. _(CAP-7)_
docs/planning-artifacts/epics.md-82-FR35: SEO centralisé, OpenGraph et Schema.org/JSON-LD alignés sur « Systèmes IA, agents & automatisation métier ». _(CAP-8)_
docs/planning-artifacts/epics.md-83-FR36: Préservation de la DA terminal dark-first, accessibilité WCAG AA, conformité motion réduit et validation de la gate Docker 100% verte. _(CAP-9)_
docs/planning-artifacts/epics.md-84-
docs/planning-artifacts/epics.md:85:#### Epic 13 — Thème Light & Dark (SPEC-theme-light-dark)
docs/planning-artifacts/epics.md:86:FR37: Palette de thèmes et tokens sémantiques complets (mode sombre aubergine par défaut et mode clair « Papier technique / Crème solaire », sanctuarisation du terminal sombre, contrastes WCAG AAA/AA). _(CAP-1)_
docs/planning-artifacts/epics.md-87-FR38: Détection automatique et synchronisation réactive de la préférence système (`prefers-color-scheme`) en temps réel sans rechargement de page. _(CAP-2)_
docs/planning-artifacts/epics.md:88:FR39: Surcharge utilisateur et persistance locale sous `localStorage` (`jouan_theme_mode`) conservant le choix d'une visite à l'autre. _(CAP-3)_
docs/planning-artifacts/epics.md-89-FR40: Composant de bascule ternaire `ThemeToggle` dans le Header desktop (`hdr__dock-right` à gauche de « Disponible ») et dans le tiroir mobile, avec cycle `Système → Sombre → Clair → Système`, icônes vectorielles et 0 emoji. _(CAP-4)_
docs/planning-artifacts/epics.md:90:FR41: Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC dans le `<head>` avant le montage client). _(CAP-5)_
docs/planning-artifacts/epics.md-91-FR42: Accessibilité, focus visible, navigation clavier et support de `forced-colors` Windows High Contrast. _(CAP-6)_
docs/planning-artifacts/epics.md-92-
docs/planning-artifacts/epics.md-93-#### Epic 14 — Analytics Privacy-First, RGPD & Google Search Console (SPEC-analytics-search-console)
docs/planning-artifacts/epics.md-94-FR43: Initialisation asynchrone et isolée de PostHog Cloud EU (`https://eu.i.posthog.com`) côté client via Nuxt runtimeConfig et respect strict de Do Not Track. _(CAP-1)_
--
docs/planning-artifacts/epics.md-99-FR48: Outillage agentic MCP PostHog et validation Docker sans régression (`lint`, `typecheck`, `generate`). _(CAP-7, CAP-8)_
docs/planning-artifacts/epics.md-100-
docs/planning-artifacts/epics.md-101-### NonFunctional Requirements
docs/planning-artifacts/epics.md-102-
docs/planning-artifacts/epics.md:103:NFR1: Dark-first uniquement — aucun thème clair ; orange Ubuntu = unique accent héros.
docs/planning-artifacts/epics.md-104-NFR2: Aucune valeur de couleur/espace/rayon hardcodée ; tout passe par les tokens.
docs/planning-artifacts/epics.md-105-NFR3: Port, pas copie — recréation en Vue 3 `<script setup>` + SCSS `@use` (jamais `@import`).
docs/planning-artifacts/epics.md-106-NFR4: Compatibilité prerender — tout passe `nuxi generate`, accès DOM gardés.
docs/planning-artifacts/epics.md-107-NFR5: Déploiement préservé — `CNAME` + chaîne `yarn generate` → `gh-pages` non régressés.
--
docs/planning-artifacts/epics.md-116-NFR14: Confidentialité & Propriété intellectuelle — respect strict des dépôts privés (`zohac/*`), aucun lien sortant 404, mention transparente des statuts réels.
docs/planning-artifacts/epics.md-117-NFR15: Exécution Docker stricte — toute compilation et validation de gate s'effectue dans le conteneur Docker.
docs/planning-artifacts/epics.md-118-NFR16: Performance SSG & Zéro régression — génération statique Nitro préservée avec 13 routes pré-rendues.
docs/planning-artifacts/epics.md-119-NFR17: Exécution stricte de la suite de validation dans l'environnement Docker (`pnpm lint`, `pnpm typecheck`, `pnpm generate`).
docs/planning-artifacts/epics.md:120:NFR18: Zéro emoji dans les libellés, composants ou infobulles du sélecteur de thème (règle NFR6).
docs/planning-artifacts/epics.md-121-NFR19: Sanctuarisation absolue du terminal (Terminal Hero et fenêtres flottantes conservent impérativement leur fond sombre aubergine `#2E0024` et leurs couleurs syntaxiques).
docs/planning-artifacts/epics.md-122-NFR20: Compatibilité SSG totale sous GitHub Pages sans dépendance dynamique serveur.
docs/planning-artifacts/epics.md-123-
docs/planning-artifacts/epics.md-124-### Additional Requirements
--
docs/planning-artifacts/epics.md-130-- Barre de qualité stricte = Docker-only gate (`pnpm lint && pnpm typecheck && pnpm generate`) avec 0 erreur et 13 routes pré-rendues.
docs/planning-artifacts/epics.md-131-- Lint : ESLint 10 (`@nuxt/eslint`), Prettier 3, Stylelint 17 (`stylelint-scss`).
docs/planning-artifacts/epics.md-132-- **Epic 11 — Données centralisées dans `app/data/site.ts`** : mise à jour de `SITE.profile` (titre Full Stack TS, localisation Rouen/remote), `SITE.skills` (TypeScript, Nuxt, NestJS, etc.) et `SITE.projects` (Keova, TryOn, Nodium), consommées sans duplication locale.
docs/planning-artifacts/epics.md-133-- **Epic 11 — Compatibilité statique SSG (Nitro)** : tout accès direct à `window`, `document`, `sessionStorage` strictement encapsulé dans `onMounted()` ou sous `import.meta.client`.
docs/planning-artifacts/epics.md:134:- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.
docs/planning-artifacts/epics.md-135-
docs/planning-artifacts/epics.md-136-### UX Design Requirements
docs/planning-artifacts/epics.md-137-
docs/planning-artifacts/epics.md-138-UX-DR1: Porter les tokens `docs/design_system/tokens/*.css` vers `assets/scss/abstract/` (et/ou CSS vars globales) — couleurs, typographie, espacement, rayons, élévation, motion, polices Ubuntu Mono + Ubuntu sans.
--
docs/planning-artifacts/epics.md-206-FR33: Epic 12 — Page À propos, trajectoire métrologie / QA & systèmes IA
docs/planning-artifacts/epics.md-207-FR34: Epic 12 — CTA final inspecteur de workflow & formulaire de contact
docs/planning-artifacts/epics.md-208-FR35: Epic 12 — SEO centralisé, OpenGraph & Schema.org
docs/planning-artifacts/epics.md-209-FR36: Epic 12 — Préservation DA terminal, a11y & non-régression gate Docker
docs/planning-artifacts/epics.md:210:FR37: Epic 13 — Palette de thèmes et tokens sémantiques complets (mode clair crème, terminal sombre)
docs/planning-artifacts/epics.md:211:FR38: Epic 13 — Détection et synchronisation réactive de la préférence système (prefers-color-scheme)
docs/planning-artifacts/epics.md:212:FR39: Epic 13 — Surcharge utilisateur et persistance locale (localStorage)
docs/planning-artifacts/epics.md:213:FR40: Epic 13 — Bouton de bascule ternaire ThemeToggle dans le Header (desktop et mobile)
docs/planning-artifacts/epics.md:214:FR41: Epic 13 — Prévention absolue du flash au premier paint (script inline synchrone anti-FOUC)
docs/planning-artifacts/epics.md:215:FR42: Epic 13 — Accessibilité, focus visible, navigation clavier et mode forced-colors
docs/planning-artifacts/epics.md-216-FR43: Epic 14 — Initialisation PostHog Cloud EU asynchrone côté client et respect DNT
docs/planning-artifacts/epics.md-217-FR44: Epic 14 — Session Replay sécurisé et masquage strict des données de formulaire
docs/planning-artifacts/epics.md-218-FR45: Epic 14 — Toast de consentement RGPD inspiré du terminal et gestion des cookies
docs/planning-artifacts/epics.md-219-FR46: Epic 14 — Plan de taggage exhaustif (parcours IA, formulaire, terminal, blog, liens)
--
docs/planning-artifacts/epics.md-269-### Epic 12: Repositionnement Commercial V1 — Systèmes IA & Automatisation Métier
docs/planning-artifacts/epics.md-270-Le visiteur arrivant sur `jouan.ovh` (prospect ou client) comprend en moins de 15 secondes que Simon Jouan automatise les workflows métier des entreprises grâce à des systèmes IA robustes et industriels, validés par des réalisations concrètes (Keova Signal, Debrief, Devis-Assist) et une culture QA éprouvée, avec une grille tarifaire claire (Sprint à partir de 3 500 € HT) et un appel direct à qualifier son processus sans friction.
docs/planning-artifacts/epics.md-271-**FRs covered:** FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36 _(NFR13 à NFR16, UX-DR28 à UX-DR31)_
docs/planning-artifacts/epics.md-272-
docs/planning-artifacts/epics.md:273:### Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md:274:Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
docs/planning-artifacts/epics.md-275-**FRs covered:** FR37, FR38, FR39, FR40, FR41, FR42 _(NFR17 à NFR20, UX-DR32 à UX-DR35)_
docs/planning-artifacts/epics.md-276-
docs/planning-artifacts/epics.md-277-### Epic 14: Analytics Privacy-First (PostHog EU), Consentement RGPD & Google Search Console
docs/planning-artifacts/epics.md-278-Le visiteur bénéficie d'un contrôle transparent sur sa vie privée via un toast de consentement sobre inspiré du terminal, tandis que Simon Jouan dispose d'une observabilité complète sur l'audience, la restitution de parcours (Session Replay sécurisé) et les conversions de l'offre IA, soutenue par l'indexation organique certifiée par Google Search Console (`sitemap.xml`, `robots.txt` et DNS OVH).
--
docs/planning-artifacts/epics.md-365-
docs/planning-artifacts/epics.md-366-**Given** les polices Ubuntu Mono (ttf locales) et Ubuntu sans
docs/planning-artifacts/epics.md-367-**When** on configure `@font-face`/import et le reset/base dark-first
docs/planning-artifacts/epics.md-368-**Then** Ubuntu Mono sert aux titres/labels/code et Ubuntu sans au corps long
docs/planning-artifacts/epics.md:369:**And** le fond par défaut est sombre (aucun thème clair) et lisible
docs/planning-artifacts/epics.md-370-
docs/planning-artifacts/epics.md-371-### Story 2.3: Primitive ZButton
docs/planning-artifacts/epics.md-372-
docs/planning-artifacts/epics.md-373-As a développeur,
--
docs/planning-artifacts/epics.md-1033-**And** le formulaire de contact (`/contact`) est orienté qualification de workflow (champs processus à améliorer, fonctionnement actuel, répétition)
docs/planning-artifacts/epics.md-1034-**And** `usePageSeo` met à jour les balises de titres (`Simon Jouan — Systèmes IA, agents & automatisation métier`), descriptions et métadonnées canoniques/OpenGraph sur l'ensemble des 13 routes
docs/planning-artifacts/epics.md-1035-**And** la suite de validation Docker complète (`pnpm lint && pnpm typecheck && pnpm generate`) réussit avec 0 erreur (0 ESLint/Stylelint, 0 typecheck TypeScript, 13 routes statiques pré-rendues).
docs/planning-artifacts/epics.md-1036-
docs/planning-artifacts/epics.md:1037:## Epic 13: Thème Light & Dark et Bascule Utilisateur
docs/planning-artifacts/epics.md-1038-
docs/planning-artifacts/epics.md:1039:Le visiteur peut consulter l'ensemble du site dans un thème clair « Papier technique / Crème solaire » reposant et contrasté tout en profitant de l'authenticité des terminaux sombres sanctuarisés. Il bénéficie d'une synchronisation automatique avec son OS, d'une bascule manuelle rapide dans le header (desktop et tiroir mobile) et d'une persistance locale sans aucun clignotement visuel (anti-FOUC) au rechargement statique.
docs/planning-artifacts/epics.md-1040-
docs/planning-artifacts/epics.md-1041-### Story 13.1: Fondations des Tokens SCSS Thème Clair et Sanctuarisation du Terminal
docs/planning-artifacts/epics.md-1042-
docs/planning-artifacts/epics.md-1043-As a visiteur préférant un environnement d'affichage clair,
--
docs/planning-artifacts/epics.md-1046-
docs/planning-artifacts/epics.md-1047-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1048-
docs/planning-artifacts/epics.md-1049-**Given** le fichier `app/assets/scss/abstract/_root.scss`
docs/planning-artifacts/epics.md:1050:**When** on déclare le sélecteur `[data-theme="light"]`
docs/planning-artifacts/epics.md-1051-**Then** les alias sémantiques de surfaces sont surchargés :
docs/planning-artifacts/epics.md-1052-  - `--bg-page: hsl(38deg 25% 97%)` (`#FAF8F4`)
docs/planning-artifacts/epics.md-1053-  - `--bg-sunken: hsl(38deg 20% 93%)` (`#F1EDE6`)
docs/planning-artifacts/epics.md-1054-  - `--bg-card: hsl(0deg 0% 100%)` (`#FFFFFF`)
--
docs/planning-artifacts/epics.md-1061-**And** l'accent orange est adapté au contraste sur fond clair (`--accent: hsl(24deg 95% 44%)`, `#DA5207`, ratio AA > 4.5:1)
docs/planning-artifacts/epics.md-1062-**And** les conteneurs de terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: var(--aubergine-deep)`, `#2E0024`) et leurs couleurs de texte clair, restant insensibles au mode clair global
docs/planning-artifacts/epics.md-1063-**And** la suite `docker compose run --rm web sh -c "corepack enable && pnpm lint"` est validée avec 0 erreur.
docs/planning-artifacts/epics.md-1064-
docs/planning-artifacts/epics.md:1065:### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC
docs/planning-artifacts/epics.md-1066-
docs/planning-artifacts/epics.md-1067-As a visiteur naviguant sur `jouan.ovh`,
docs/planning-artifacts/epics.md:1068:I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
docs/planning-artifacts/epics.md-1069-So that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20).
docs/planning-artifacts/epics.md-1070-
docs/planning-artifacts/epics.md-1071-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1072-
docs/planning-artifacts/epics.md-1073-**Given** l'infrastructure client Nuxt 4
docs/planning-artifacts/epics.md:1074:**When** on initialise le thème dans l'application
docs/planning-artifacts/epics.md-1075-**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
docs/planning-artifacts/epics.md:1076:**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
docs/planning-artifacts/epics.md:1077:**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/planning-artifacts/epics.md:1078:**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
docs/planning-artifacts/epics.md-1079-**And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.
docs/planning-artifacts/epics.md-1080-
docs/planning-artifacts/epics.md-1081-### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile
docs/planning-artifacts/epics.md-1082-
--
docs/planning-artifacts/epics.md-1102-
docs/planning-artifacts/epics.md-1103-### Story 13.4: Validation transverse, atmosphère d'ambiance et gate Docker Nitro SSG
docs/planning-artifacts/epics.md-1104-
docs/planning-artifacts/epics.md-1105-As a développeur garantissant la robustesse de production,
docs/planning-artifacts/epics.md:1106:I want vérifier le rendu esthétique des pages sous le thème clair et exécuter la gate Docker complète,
docs/planning-artifacts/epics.md-1107-So that le déploiement sur GitHub Pages soit certifié à 100 % vert sans régressions (FR37–FR42, NFR17, NFR19).
docs/planning-artifacts/epics.md-1108-
docs/planning-artifacts/epics.md-1109-**Acceptance Criteria:**
docs/planning-artifacts/epics.md-1110-
docs/planning-artifacts/epics.md-1111-**Given** l'ensemble des routes statiques de `jouan.ovh`
docs/planning-artifacts/epics.md:1112:**When** on bascule le thème sur `light`
docs/planning-artifacts/epics.md-1113-**Then** toutes les pages (Accueil, Services, À propos, Blog, Contact) affichent un rendu harmonieux :
docs/planning-artifacts/epics.md-1114-  - Les cartes blanches (`#FFFFFF`) se détachent nettement du fond crème (`#FAF8F4`)
docs/planning-artifacts/epics.md-1115-  - Les encres aubergine et les liens orange offrent une lisibilité contrastée conforme WCAG AA/AAA
docs/planning-artifacts/epics.md-1116-  - L'arrière-plan atmosphérique d'accueil (`.atmos`) atténue son opacité pour éviter toute interférence de lecture
docs/planning-artifacts/epics.md-1117-  - Le Terminal Hero et le terminal flottant demeurent en mode sombre permanent avec leur prompt vert
docs/planning-artifacts/epics.md:1118:**And** le changement de thème est persistant après rechargement de page ou changement d'URL
docs/planning-artifacts/epics.md-1119-**And** la suite de validation Docker complète réussit avec 0 erreur :
docs/planning-artifacts/epics.md-1120-  ```sh
docs/planning-artifacts/epics.md-1121-  docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"
docs/planning-artifacts/epics.md-1122-  ```
--
docs/planning-artifacts/epics.md-1141-**Then** le paquet `posthog-js` est installé dans le conteneur Docker sans altérer l'hôte
docs/planning-artifacts/epics.md-1142-**And** les variables `runtimeConfig.public.posthogKey` et `runtimeConfig.public.posthogHost` (défaut `https://eu.i.posthog.com`) sont déclarées dans `nuxt.config.ts`
docs/planning-artifacts/epics.md-1143-**And** le composable `app/composables/useConsent.ts` est créé :
docs/planning-artifacts/epics.md-1144-  - Gère l'état réactif (`consentState: 'unknown' | 'accepted' | 'declined'`)
docs/planning-artifacts/epics.md:1145:  - Mémorise le choix dans `localStorage` (`jouan_consent_telemetry`)
docs/planning-artifacts/epics.md-1146-  - Détecte le signal navigateur `navigator.doNotTrack === '1'` et bascule automatiquement en mode `declined`
docs/planning-artifacts/epics.md-1147-  - Expose `accept()`, `decline()` et `openConsentModal()`
docs/planning-artifacts/epics.md-1148-**And** le composant `app/components/ui/ConsentToast.vue` est créé :
docs/planning-artifacts/epics.md-1149-  - Présentation flottante en bas d'écran conforme au Design System sombre aubergine (`--surface-raised`, `--border-subtle`)
--
docs/project-context.md-224-**À préserver pendant la refonte**
docs/project-context.md-225-
docs/project-context.md-226-- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
docs/project-context.md-227-  easter-egg à conserver — le design system la garde comme feature secondaire.
docs/project-context.md:228:- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
docs/project-context.md-229-  orange Ubuntu comme unique accent héros.
docs/project-context.md-230-- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
docs/project-context.md-231-  terminal.
docs/project-context.md-232-
--
app/pages/index.vue-301-  isReducedMotion.value = e.matches;
app/pages/index.vue-302-}
app/pages/index.vue-303-
app/pages/index.vue-304-onMounted(() => {
app/pages/index.vue:305:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/pages/index.vue-306-  isReducedMotion.value = motionMq.matches;
app/pages/index.vue-307-  motionMq.addEventListener("change", onMotionChange);
app/pages/index.vue-308-});
app/pages/index.vue-309-
--
app/components/HeaderComponent.vue-168-    return;
app/components/HeaderComponent.vue-169-  }
app/components/HeaderComponent.vue-170-  if (route.path === "/") {
app/components/HeaderComponent.vue-171-    event.preventDefault();
app/components/HeaderComponent.vue:172:    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/HeaderComponent.vue-173-    window.scrollTo({ top: 0, behavior: isReducedMotion ? "auto" : "smooth" });
app/components/HeaderComponent.vue-174-  }
app/components/HeaderComponent.vue-175-}
app/components/HeaderComponent.vue-176-
--
app/components/HeaderComponent.vue-212-}
app/components/HeaderComponent.vue-213-
app/components/HeaderComponent.vue-214-onMounted(() => {
app/components/HeaderComponent.vue-215-  document.addEventListener("keydown", onKeydown);
app/components/HeaderComponent.vue:216:  desktopMq = window.matchMedia("(min-width: 901px)");
app/components/HeaderComponent.vue-217-  desktopMq.addEventListener("change", onDesktopChange);
app/components/HeaderComponent.vue-218-  registerTerminalLauncher(addNewTerminal);
app/components/HeaderComponent.vue-219-  window.addEventListener("scroll", onScroll, { passive: true });
app/components/HeaderComponent.vue-220-  window.addEventListener("resize", onScroll, { passive: true });
--
app/composables/useTheme.ts-1-export type ThemePreference = "system" | "dark" | "light";
app/composables/useTheme.ts-2-export type ResolvedTheme = "dark" | "light";
app/composables/useTheme.ts-3-
app/composables/useTheme.ts:4:const STORAGE_KEY = "jouan_theme_mode";
app/composables/useTheme.ts-5-
app/composables/useTheme.ts-6-/**
app/composables/useTheme.ts:7: * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
app/composables/useTheme.ts-8- *
app/composables/useTheme.ts:9: * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
app/composables/useTheme.ts-10- * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
app/composables/useTheme.ts:11: * avec localStorage et les preferences systeme de l'OS.
app/composables/useTheme.ts-12- */
app/composables/useTheme.ts-13-export function useTheme() {
app/composables/useTheme.ts:14:  const preference = useState<ThemePreference>("theme-preference", () => "system");
app/composables/useTheme.ts:15:  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");
app/composables/useTheme.ts-16-
app/composables/useTheme.ts-17-  const resolveSystemTheme = (): ResolvedTheme => {
app/composables/useTheme.ts-18-    if (!import.meta.client) {
app/composables/useTheme.ts-19-      return "dark";
app/composables/useTheme.ts-20-    }
app/composables/useTheme.ts:21:    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
app/composables/useTheme.ts-22-  };
app/composables/useTheme.ts-23-
app/composables/useTheme.ts-24-  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
app/composables/useTheme.ts-25-    if (!import.meta.client) {
app/composables/useTheme.ts-26-      return;
app/composables/useTheme.ts-27-    }
app/composables/useTheme.ts:28:    document.documentElement.setAttribute("data-theme", resolved);
app/composables/useTheme.ts:29:    document.documentElement.setAttribute("data-theme-source", pref);
app/composables/useTheme.ts-30-  };
app/composables/useTheme.ts-31-
app/composables/useTheme.ts-32-  const setTheme = (pref: ThemePreference) => {
app/composables/useTheme.ts-33-    preference.value = pref;
--
app/composables/useTheme.ts-35-    resolvedTheme.value = resolved;
app/composables/useTheme.ts-36-
app/composables/useTheme.ts-37-    if (import.meta.client) {
app/composables/useTheme.ts-38-      try {
app/composables/useTheme.ts:39:        localStorage.setItem(STORAGE_KEY, pref);
app/composables/useTheme.ts-40-      } catch {
app/composables/useTheme.ts-41-        // Ignorer en navigation privee restrictive
app/composables/useTheme.ts-42-      }
app/composables/useTheme.ts-43-      applyToDom(resolved, pref);
--
app/composables/useTheme.ts-59-    }
app/composables/useTheme.ts-60-
app/composables/useTheme.ts-61-    let storedPref: ThemePreference = "system";
app/composables/useTheme.ts-62-    try {
app/composables/useTheme.ts:63:      const stored = localStorage.getItem(STORAGE_KEY);
app/composables/useTheme.ts-64-      if (stored === "dark" || stored === "light" || stored === "system") {
app/composables/useTheme.ts-65-        storedPref = stored;
app/composables/useTheme.ts-66-      }
app/composables/useTheme.ts-67-    } catch {
app/composables/useTheme.ts:68:      // Ignorer si localStorage inaccessible
app/composables/useTheme.ts-69-    }
app/composables/useTheme.ts-70-
app/composables/useTheme.ts-71-    preference.value = storedPref;
app/composables/useTheme.ts-72-    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
app/composables/useTheme.ts-73-    resolvedTheme.value = resolved;
app/composables/useTheme.ts-74-    applyToDom(resolved, storedPref);
app/composables/useTheme.ts-75-
app/composables/useTheme.ts:76:    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
app/composables/useTheme.ts-77-    const handleMediaChange = (e: MediaQueryListEvent) => {
app/composables/useTheme.ts-78-      if (preference.value === "system") {
app/composables/useTheme.ts-79-        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
app/composables/useTheme.ts-80-        resolvedTheme.value = newResolved;
--
app/components/home/HomeAtmosComponent.vue-319-  if (!canvas) {
app/components/home/HomeAtmosComponent.vue-320-    return;
app/components/home/HomeAtmosComponent.vue-321-  }
app/components/home/HomeAtmosComponent.vue-322-
app/components/home/HomeAtmosComponent.vue:323:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeAtmosComponent.vue-324-  isReducedMotion = motionMq.matches;
app/components/home/HomeAtmosComponent.vue-325-  motionMq.addEventListener("change", onMotionChange);
app/components/home/HomeAtmosComponent.vue-326-  document.addEventListener("visibilitychange", onVisibilityChange);
app/components/home/HomeAtmosComponent.vue-327-
--
app/assets/scss/abstract/_root.scss-204-
app/assets/scss/abstract/_root.scss-205-// ============================================================
app/assets/scss/abstract/_root.scss-206-//  Surcharge Thème Clair — Palette « Papier technique / Crème solaire »
app/assets/scss/abstract/_root.scss-207-// ============================================================
app/assets/scss/abstract/_root.scss:208:[data-theme="light"] {
app/assets/scss/abstract/_root.scss-209-  // Surfaces claires
app/assets/scss/abstract/_root.scss-210-  --bg-page: hsl(38deg 25% 97%);
app/assets/scss/abstract/_root.scss-211-  --bg-sunken: hsl(38deg 20% 93%);
app/assets/scss/abstract/_root.scss-212-  --bg-card: hsl(0deg 0% 100%);
--
app/components/ui/ZButton.vue-81-  }
app/components/ui/ZButton.vue-82-}
app/components/ui/ZButton.vue-83-
app/components/ui/ZButton.vue-84-onMounted(() => {
app/components/ui/ZButton.vue:85:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZButton.vue-86-  isReducedMotion.value = motionMq.matches;
app/components/ui/ZButton.vue-87-  motionMq.addEventListener("change", onMotionChange);
app/components/ui/ZButton.vue-88-});
app/components/ui/ZButton.vue-89-
--
app/components/ui/ZButton.vue-94-function onMouseMove(event: MouseEvent) {
app/components/ui/ZButton.vue-95-  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
app/components/ui/ZButton.vue-96-    return;
app/components/ui/ZButton.vue-97-  }
app/components/ui/ZButton.vue:98:  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
app/components/ui/ZButton.vue-99-    return;
app/components/ui/ZButton.vue-100-  }
app/components/ui/ZButton.vue-101-  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
app/components/ui/ZButton.vue-102-  if (!el || !(el instanceof HTMLElement)) {
--
app/components/ui/ZCustomCursor.vue-128-
app/components/ui/ZCustomCursor.vue-129-onMounted(() => {
app/components/ui/ZCustomCursor.vue-130-  if (!import.meta.client) return;
app/components/ui/ZCustomCursor.vue-131-
app/components/ui/ZCustomCursor.vue:132:  hoverMediaQuery = window.matchMedia("(hover: hover)");
app/components/ui/ZCustomCursor.vue:133:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCustomCursor.vue-134-
app/components/ui/ZCustomCursor.vue-135-  hoverMediaQuery.addEventListener("change", handleMediaQueryChange);
app/components/ui/ZCustomCursor.vue-136-  motionMediaQuery.addEventListener("change", handleMediaQueryChange);
app/components/ui/ZCustomCursor.vue-137-
--
app/components/home/HomeBootOverlay.vue-135-  } catch {
app/components/home/HomeBootOverlay.vue-136-    alreadyBooted = false;
app/components/home/HomeBootOverlay.vue-137-  }
app/components/home/HomeBootOverlay.vue-138-
app/components/home/HomeBootOverlay.vue:139:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeBootOverlay.vue-140-  motionMq.addEventListener("change", onMotionChange);
app/components/home/HomeBootOverlay.vue-141-
app/components/home/HomeBootOverlay.vue-142-  if (alreadyBooted || motionMq.matches) {
app/components/home/HomeBootOverlay.vue-143-    try {
--
app/components/ui/ZCard.vue-64-  }
app/components/ui/ZCard.vue-65-}
app/components/ui/ZCard.vue-66-
app/components/ui/ZCard.vue-67-onMounted(() => {
app/components/ui/ZCard.vue:68:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCard.vue-69-  isReducedMotion.value = motionMq.matches;
app/components/ui/ZCard.vue-70-  motionMq.addEventListener("change", onMotionChange);
app/components/ui/ZCard.vue-71-});
app/components/ui/ZCard.vue-72-
--
app/components/ui/ZCard.vue-77-function onMouseMove(event: MouseEvent) {
app/components/ui/ZCard.vue-78-  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
app/components/ui/ZCard.vue-79-    return;
app/components/ui/ZCard.vue-80-  }
app/components/ui/ZCard.vue:81:  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
app/components/ui/ZCard.vue-82-    return;
app/components/ui/ZCard.vue-83-  }
app/components/ui/ZCard.vue-84-  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
app/components/ui/ZCard.vue-85-  if (!el || !(el instanceof HTMLElement)) {
--
app/components/home/HomeHeroTerminal.vue-150-function startTypingSequence() {
app/components/home/HomeHeroTerminal.vue-151-  if (isStarted) return;
app/components/home/HomeHeroTerminal.vue-152-  isStarted = true;
app/components/home/HomeHeroTerminal.vue-153-
app/components/home/HomeHeroTerminal.vue:154:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue-155-
app/components/home/HomeHeroTerminal.vue-156-  if (reduceMotion) {
app/components/home/HomeHeroTerminal.vue-157-    showInstantState();
app/components/home/HomeHeroTerminal.vue-158-    return;
--
app/components/home/HomeHeroTerminal.vue-226-
app/components/home/HomeHeroTerminal.vue-227-onMounted(() => {
app/components/home/HomeHeroTerminal.vue-228-  if (!import.meta.client) return;
app/components/home/HomeHeroTerminal.vue-229-
app/components/home/HomeHeroTerminal.vue:230:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeHeroTerminal.vue-231-  motionMq.addEventListener("change", onMotionChange);
app/components/home/HomeHeroTerminal.vue-232-
app/components/home/HomeHeroTerminal.vue-233-  if (motionMq.matches) {
app/components/home/HomeHeroTerminal.vue-234-    isStarted = true;

exec
/bin/zsh -lc "sed -n '1,320p' /Users/simon/.codex/skills/bmad-code-review/steps/step-02-review.md; sed -n '1060,1085p' docs/planning-artifacts/epics.md; sed -n '1,260p' docs/project-context.md | tail -n 70; nl -ba app/composables/useTheme.ts; nl -ba nuxt.config.ts | sed -n '20,42p'; nl -ba app/app.vue | sed -n '1,35p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
---
failed_layers: '' # set at runtime: comma-separated list of layers that failed or returned empty
---

# Step 2: Review

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together, then wait for all results before continuing.

## INSTRUCTIONS

1. The review layers are `{workflow.review_layers}`, resolved during activation.

2. For each layer in `{workflow.review_layers}`:
   - `instruction` empty or missing → drop the layer silently (an override disabled it).
   - `when` condition present and not satisfied by the current context (`{review_mode}`, `{spec_file}`) → drop the layer and tell the user, e.g. "Acceptance Auditor skipped — no spec file provided."
   - otherwise → the layer is active.

   If no layer is active, HALT with status `blocked` and blocking condition `no active review layers`.

3. Execute all active layers in parallel wherever their execution methods allow: substitute the runtime placeholders (`{diff_output}`, `{spec_file}`) into each layer's `instruction`, then follow it verbatim. If a layer's instruction requires subagents and subagents are not available, generate prompt files in `{implementation_artifacts}` for each such layer and HALT. Ask the user to run each in a separate session (ideally a different LLM) and paste back the findings. When findings are pasted, treat them as those layers' findings and resume from this point.

4. **Layer failure handling**: If any layer fails, times out, or returns empty results, append the layer's `name` to `{failed_layers}` (comma-separated) and proceed with findings from the remaining layers.

5. Collect all findings from the completed layers, keeping track of each finding's originating layer `id`.

## NEXT

Read fully and follow `./step-03-triage.md`
  - `--text-muted: hsl(320deg 10% 44%)` (`#756773`, ratio > 4.5:1)
**And** l'accent orange est adapté au contraste sur fond clair (`--accent: hsl(24deg 95% 44%)`, `#DA5207`, ratio AA > 4.5:1)
**And** les conteneurs de terminal (`.home-hero-terminal`, `.terminal-window`, `.terminal`) forcent localement leurs variables de surface (`--bg-terminal: var(--aubergine-deep)`, `#2E0024`) et leurs couleurs de texte clair, restant insensibles au mode clair global
**And** la suite `docker compose run --rm web sh -c "corepack enable && pnpm lint"` est validée avec 0 erreur.

### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC

As a visiteur naviguant sur `jouan.ovh`,
I want que mon thème s'adapte automatiquement à mon OS par défaut, qu'une surcharge soit conservée en mémoire locale et que la page s'affiche sans clignotement noir/blanc,
So that mon confort de lecture soit immédiat et persistant à chaque visite (FR38, FR39, FR41, NFR20).

**Acceptance Criteria:**

**Given** l'infrastructure client Nuxt 4
**When** on initialise le thème dans l'application
**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
**And** aucune discordance d'hydratation Vue (hydration mismatch) n'apparaît en console.

### Story 13.3: Composant ThemeToggle, icônes vectorielles et intégration Header / Mobile

As a utilisateur sur desktop ou smartphone,
I want disposer d'un bouton de bascule compact placé à gauche du statut « Disponible » dans le dock d'état et dans le menu mobile,
So that je puisse cycler en un clic entre Système, Sombre et Clair avec une annonce accessible claire (FR40, FR42, NFR18, UX-DR33, UX-DR34, UX-DR35).
  properties**. NE PAS copier les `.jsx` tels quels : recréer chaque primitive en
  composant Vue 3 (`<script setup>`), en réutilisant les tokens.
- Source de vérité des valeurs = `docs/design_system/tokens/*.css` et
  `styles.css`. Stratégie : porter ces tokens vers `assets/scss/abstract/` (ou
  les exposer en CSS vars globales) plutôt que de redéfinir des valeurs.
- Le `ui_kits/jouan-site/` est la **référence visuelle cible** des pages (Home,
  Services, About, Blog, Contact, Terminal) — s'y reporter pour le rendu.

**Accessibilité (à intégrer dès l'écriture, pas seulement en revue)**

- Tout élément interactif : **focus visible** (ring `--ring-accent`, jamais
  `outline: none` sans alternative), **navigation clavier** (Enter/Space sur les
  éléments non natifs cliquables, retour de focus après fermeture d'overlay/menu),
  attributs `aria-*` pertinents (`aria-current`, `aria-label`, `aria-describedby`…).
- Respecter `prefers-reduced-motion: reduce` (neutraliser transitions/lifts).
- Images via `<NuxtImg>` avec `alt` ; fallback visuel si l'image échoue.
- **Hiérarchie de titres & sémantique de listes (convention story 5.2)** : un libellé
  de section (eyebrow `// ...`) qui ouvre une section porte un **`<h2 class="eyebrow">`**
  (style neutralisé : `font-weight`/`line-height` hérités → rendu identique), pas un
  `<p>` — pour un outline `h1 → h2…` sans saut. Une **séquence** (étapes, expériences,
  diplômes, tags, cartes répétées) se balise en **`<ol>`/`<ul>` + `<li>`** (`list-style:
  none` + reset marges UA → rendu identique), pas en `<div>`. Écrire ces deux points
  **dès la story**, ils étaient sinon systématiquement rattrapés en revue.
- Leçon rétro Epic 2 : ces points étaient systématiquement rattrapés en revue —
  les traiter en amont (checklist pré-revue dans la consigne de story).
- **Acquis d'accessibilité consolidés (Epics 9 & 10) :**
  - **Forced colors unifié** : repli inline standard `outline: 2px solid transparent; outline-offset: 2px;` sur `:focus-visible` au niveau des primitives (`ZButton`/`ZCard`/`ZTag`/`ZInput`) et liens du châssis. Plus aucun bloc `@media (forced-colors)` page-level dispersé.
  - **Liens externes** : TOUJOURS via la primitive `<ZExternalLink>` pour tout `target="_blank"` (`rel="noopener"` forcé + mention sr-only « (ouvre dans un nouvel onglet) » via `.screen-reader-text`).
  - **Sémantique titres, listes et régions** : eyebrow ouvrant une section en `<h2 class="eyebrow">` avec préfixes `// ` décoratifs en `<span aria-hidden="true">// </span>` ; séquences répétées en listes `<ol>`/`<ul>` + `<li>` (avec `> li { display: flex }` si cartes flex) ; paires label/valeur en `<dl>/<dt>/<dd>` ; déclencheurs d'overlay terminal en `aria-haspopup="dialog"`.
  - **Motion réduit global** : `base/_motion.scss` ramène animations/transitions à l'instantané (`0.01ms`) sous `prefers-reduced-motion: reduce`. Seule animation en boucle autorisée : le caret natif de frappe du terminal (CAP-11). Les carets décoratifs sont figés visibles.
  - **Clavier** : `Échap` ferme le terminal avec retour de focus au déclencheur. Navigation Tab logique sur tout le site.
  - **Contraste** : `--text-muted` minimum pour les textes informatifs réels (pas de `--text-faint` sur du contenu signifiant).

**À préserver pendant la refonte**

- La **fonctionnalité terminal** draggable (`components/terminal/`) est un
  easter-egg à conserver — le design system la garde comme feature secondaire.
- Le **dark-first** : pas de thème clair. Surfaces sombres teintées aubergine,
  orange Ubuntu comme unique accent héros.
- Respect de `prefers-reduced-motion` ; seule animation en boucle = le caret du
  terminal.

**Pièges**

- Compatibilité prerender (site statique) : tout accès DOM doit être gardé ;
  IDs déterministes via `useId()` (pas d'aléatoire qui casse l'hydration).
- Ne pas casser `CNAME` / le déploiement gh-pages.
- `<component :is="...">` : passer une référence importée, jamais un nom en string
  (cf. règles Nuxt).
- **Piège `padding` shorthand sur élément multi-classes** : quand deux classes de
  layout cohabitent sur le même élément (typiquement `.container` + wrapper de
  section, ex. `.hero__in.container`), **ne pas** styler le `padding` en shorthand
  dans les deux — la dernière déclarée écrase l'autre axe (ici `.container { padding: 0 24px }`
  effaçait le vertical de `.hero__in`). Utiliser les **longhands** `padding-inline` /
  `padding-block`, qui composent sans conflit quel que soit l'ordre. (Régression de
  padding du hero, story 3.1 — invisible à la revue de code, attrapée à l'œil.)
- **`@nuxt/content` v3 + Docker — base SQLite du dev périmée** : lancer `pnpm generate`
  dans un conteneur `run --rm` séparé pendant que le conteneur dev tourne **invalide la
  base de contenu** du dev (volume partagé) → `/blog` tombe en erreur. Correctif :
  `docker compose restart web` réindexe le contenu. Sans impact sur le build lui-même.
- **Styler le HTML généré par `@nuxt/content`** : le rendu (`<ContentRenderer>`) n'est pas
  atteint par `scoped` → cibler via `:deep()`. Piège : le renderer enrobe chaque titre
  d'une ancre `<a href="#…">` → titres rendus **bleu souligné** si pas de reset → ajouter
  `:deep(h2 a, h3 a, h4 a){ color: inherit; text-decoration: none }`. (Story 6.2.)
- **Vérif visuelle avant revue (stories de page)** : lancer le dev, ouvrir la page
  dans **Chrome DevTools MCP** ET la référence visuelle correspondante, puis comparer
  le rendu (padding/marges/espacement/fidélité), en desktop ET mobile. La revue de code
  est aveugle aux régressions de rendu. Réfs par page :
  - **Home** → `docs/design_system/ui_kits/jouan-site/Home - Awwwards.html` (maquette cible Awwwards officielle depuis l'Epic 11).
  - **Services / About / Blog / Contact** → `docs/design_system/ui_kits/jouan-site/index.html`
     1	export type ThemePreference = "system" | "dark" | "light";
     2	export type ResolvedTheme = "dark" | "light";
     3	
     4	const STORAGE_KEY = "jouan_theme_mode";
     5	
     6	/**
     7	 * Composable centralisant la gestion du theme de l'application (Dark / Light / System).
     8	 *
     9	 * Fournit l'etat reactif de la preference utilisateur et du theme effectif resolu,
    10	 * les methodes de mise a jour et de cycle ternaire, ainsi que la synchronisation
    11	 * avec localStorage et les preferences systeme de l'OS.
    12	 */
    13	export function useTheme() {
    14	  const preference = useState<ThemePreference>("theme-preference", () => "system");
    15	  const resolvedTheme = useState<ResolvedTheme>("theme-resolved", () => "dark");
    16	
    17	  const resolveSystemTheme = (): ResolvedTheme => {
    18	    if (!import.meta.client) {
    19	      return "dark";
    20	    }
    21	    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    22	  };
    23	
    24	  const applyToDom = (resolved: ResolvedTheme, pref: ThemePreference) => {
    25	    if (!import.meta.client) {
    26	      return;
    27	    }
    28	    document.documentElement.setAttribute("data-theme", resolved);
    29	    document.documentElement.setAttribute("data-theme-source", pref);
    30	  };
    31	
    32	  const setTheme = (pref: ThemePreference) => {
    33	    preference.value = pref;
    34	    const resolved = pref === "system" ? resolveSystemTheme() : pref;
    35	    resolvedTheme.value = resolved;
    36	
    37	    if (import.meta.client) {
    38	      try {
    39	        localStorage.setItem(STORAGE_KEY, pref);
    40	      } catch {
    41	        // Ignorer en navigation privee restrictive
    42	      }
    43	      applyToDom(resolved, pref);
    44	    }
    45	  };
    46	
    47	  const cycleTheme = () => {
    48	    const nextMap: Record<ThemePreference, ThemePreference> = {
    49	      system: "dark",
    50	      dark: "light",
    51	      light: "system",
    52	    };
    53	    setTheme(nextMap[preference.value] || "system");
    54	  };
    55	
    56	  const initTheme = () => {
    57	    if (!import.meta.client) {
    58	      return;
    59	    }
    60	
    61	    let storedPref: ThemePreference = "system";
    62	    try {
    63	      const stored = localStorage.getItem(STORAGE_KEY);
    64	      if (stored === "dark" || stored === "light" || stored === "system") {
    65	        storedPref = stored;
    66	      }
    67	    } catch {
    68	      // Ignorer si localStorage inaccessible
    69	    }
    70	
    71	    preference.value = storedPref;
    72	    const resolved = storedPref === "system" ? resolveSystemTheme() : storedPref;
    73	    resolvedTheme.value = resolved;
    74	    applyToDom(resolved, storedPref);
    75	
    76	    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    77	    const handleMediaChange = (e: MediaQueryListEvent) => {
    78	      if (preference.value === "system") {
    79	        const newResolved: ResolvedTheme = e.matches ? "dark" : "light";
    80	        resolvedTheme.value = newResolved;
    81	        applyToDom(newResolved, "system");
    82	      }
    83	    };
    84	
    85	    if (mediaQuery.addEventListener) {
    86	      mediaQuery.addEventListener("change", handleMediaChange);
    87	    } else {
    88	      mediaQuery.addListener(handleMediaChange);
    89	    }
    90	  };
    91	
    92	  return {
    93	    preference,
    94	    resolvedTheme,
    95	    setTheme,
    96	    cycleTheme,
    97	    initTheme,
    98	  };
    99	}
    20	        },
    21	      ],
    22	      meta: [
    23	        {
    24	          name: "description",
    25	          content:
    26	            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
    27	            " Discutons de votre projet.",
    28	        },
    29	      ],
    30	      script: [
    31	        {
    32	          type: "text/javascript",
    33	          innerHTML:
    34	            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
    35	        },
    36	      ],
    37	    },
    38	  },
    39	  css: ["@/assets/scss/main.scss"],
    40	  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint"],
    41	  // @nuxt/content : coloration syntaxique Shiki désactivée. Le DS rend le code en
    42	  // palette terminale UNIFORME (mono off-white sur fond aubergine, vert pour l'inline,
     1	<template>
     2	  <NuxtLayout>
     3	    <NuxtPage />
     4	  </NuxtLayout>
     5	</template>
     6	
     7	<script setup lang="ts">
     8	import { onMounted } from "vue";
     9	import { SITE } from "~/data/site";
    10	
    11	const { initTheme } = useTheme();
    12	
    13	onMounted(() => {
    14	  initTheme();
    15	});
    16	
    17	// Métadonnées Schema.org globales (Organization / publisher du site).
    18	// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
    19	const siteUrl = useSiteUrl();
    20	
    21	const organizationJsonLd = {
    22	  "@context": "https://schema.org",
    23	  "@type": "Organization",
    24	  "@id": `${siteUrl}/#organization`,
    25	  name: SITE.profile.name,
    26	  url: siteUrl,
    27	  logo: `${siteUrl}/images/logo.png`,
    28	  email: SITE.profile.email,
    29	  address: {
    30	    "@type": "PostalAddress",
    31	    addressLocality: SITE.profile.city,
    32	    addressCountry: "FR",
    33	  },
    34	};
    35	

2026-09-18T14:26:53.093962Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc 'if [ -f .output/public/index.html ]; then rg -n -o "<head>.*</head>" .output/public/index.html | head -c 3000; else echo NO_OUTPUT; fi; git status --short' in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Simon Jouan — Systèmes IA, agents &amp; automatisation métier</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><script type="text/javascript">(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();</script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap"><style>.ftr[data-v-278e668d]{position:relative;z-index:10;margin-top:auto;background:var(--surface-1);border-top:1px solid var(--border-subtle);padding:var(--space-12) 0 0}.ftr__container[data-v-278e668d]{width:100%;max-width:var(--container-xl);margin:0 auto;padding:0 var(--space-6)}.ftr__in[data-v-278e668d]{display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:flex-start;justify-content:space-between}.ftr__brand-col[data-v-278e668d]{max-width:300px}.ftr__brand[data-v-278e668d]{display:inline-flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);text-decoration:none}.ftr__brand .ftr__logo[data-v-278e668d]{display:block;width:22px;height:22px;-o-object-fit:contain;object-fit:contain;filter:drop-shadow(0 2px 4px color-mix(in srgb,var(--surface-0) 60%,transparent))}.ftr__brand b[data-v-278e668d]{font-family:var(--font-mono);font-size:var(--fs-md);font-weight:var(--fw-bold);color:var(--text-strong)}.ftr__brand .dim[data-v-278e668d]{color:var(--text-muted)}.ftr__brand[data-v-278e668d]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-sm);box-shadow:var(--ring-accent)}.ftr__tagline[data-v-278e668d]{margin:0;font-size:var(--fs-sm);color:var(--text-body)}.ftr__col[data-v-278e668d]{display:flex;flex-direction:column}.ftr__title[data-v-278e668d]{margin:0 0 var(--space-3);font-family:var(--font-mono);font-size:var(--fs-xs);font-weight:var(--fw-medium);letter-spacing:var(--ls-wider);text-transform:uppercase;color:var(--accent)}.ftr__list[data-v-278e668d]{display:flex;flex-direction:column;padding:0;margin:0;list-style:none}.ftr__link[data-v-278e668d]{display:block;padding:var(--space-1) 0;font-family:var(--font-mono);font-size:var(--fs-sm);color:var(--text-strong);text-decoration:none;transition:color var(--dur-fast) var(--ease-standard),transform var(--dur-fast) var(--ease-standard)}.ftr__link[data-v-278e668d]:hover{color:var(--accent);transform:translate(2px)}.ftr__link[data-v-278e668d]:focus-visible{outline:2px solid transparent;outline-offset:2px;border-radius:var(--radius-xs);box-shadow:var(--ring-accent)}.ftr__link--static[data M app/app.vue
 M app/assets/scss/abstract/_root.scss
 M docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md
 M docs/implementation-artifacts/deferred-work.md
 M docs/implementation-artifacts/sprint-status.yaml
 M nuxt.config.ts
?? app/composables/useTheme.ts
?? docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md
?? docs/implementation-artifacts/code-reviews/13-1/
?? docs/implementation-artifacts/code-reviews/13-2/

2026-09-18T14:27:03.232129Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
exec
/bin/zsh -lc "find .output/public -type f -name 'index.html' | wc -l; find .output/public -type f -name 'index.html' | sort | head -40" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
       8
.output/public/about/index.html
.output/public/blog/index.html
.output/public/confidentialite/index.html
.output/public/contact/card/index.html
.output/public/contact/index.html
.output/public/index.html
.output/public/mentions-legales/index.html
.output/public/services/index.html

2026-09-18T14:27:12.557080Z ERROR codex_models_manager::manager: failed to renew cache TTL: missing field `base_instructions` at line 133 column 5
codex
- **Le script anti-FOUC ne renseigne pas toujours `data-theme-source`** — Violation AC4 / CAP-5 : dans le `catch`, `nuxt.config.ts:34` pose uniquement `data-theme="dark"`, contrairement à l’exigence de poser immédiatement les deux attributs.

- **Le script accepte des valeurs `localStorage` invalides** — Violation AC4 / contrat des valeurs `system | dark | light` : `nuxt.config.ts:34` affecte directement toute valeur non nulle à `resolved`; une valeur corrompue peut produire `data-theme="foo"` et provoquer un thème incorrect jusqu’à `initTheme()` (`useTheme.ts:63-65`), après le premier paint.
tokens used
45 987
- **Le script anti-FOUC ne renseigne pas toujours `data-theme-source`** — Violation AC4 / CAP-5 : dans le `catch`, `nuxt.config.ts:34` pose uniquement `data-theme="dark"`, contrairement à l’exigence de poser immédiatement les deux attributs.

- **Le script accepte des valeurs `localStorage` invalides** — Violation AC4 / contrat des valeurs `system | dark | light` : `nuxt.config.ts:34` affecte directement toute valeur non nulle à `resolved`; une valeur corrompue peut produire `data-theme="foo"` et provoquer un thème incorrect jusqu’à `initTheme()` (`useTheme.ts:63-65`), après le premier paint.

Reading prompt from stdin...
2026-09-18T14:26:11.636950Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: medium
reasoning summaries: none
session id: 01a0b4e9-1f56-7a62-8a06-a31b17acc3bb
--------
user
# Blind Hunter Prompt — Story 13.2

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/13-2/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec une posture de revue hostile, puis je fournirai uniquement une liste Markdown de constats actionnables, sans classement ni sévérité.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n---DIFF---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/13-2/full.diff" in /Users/simon/dev/jouan.ovh
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

codex
Le diff est court, mais il touche l’hydratation, le DOM global, le stockage local et la synchronisation OS ; je vérifie maintenant les conventions existantes et les points d’intégration pour éviter les faux positifs.
exec
/bin/zsh -lc "rg -n \"useTheme|data-theme|data-theme-source|jouan_theme_mode|prefers-color-scheme|script:|content-security|app\\.head|onBeforeUnmount|matchMedia\" app nuxt.config.ts docs/implementation-artifacts | head -240 && printf '\\n---APP---\\n' && sed -n '1,180p' app/app.vue && printf '\\n---CONFIG---\\n' && sed -n '1,180p' nuxt.config.ts && printf '\\n---PACKAGE---\\n' && sed -n '1,160p' package.json" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
nuxt.config.ts:30:      script: [
nuxt.config.ts:34:            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
app/components/HeaderComponent.vue:97:import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";
app/components/HeaderComponent.vue:172:    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/HeaderComponent.vue:216:  desktopMq = window.matchMedia("(min-width: 901px)");
app/components/HeaderComponent.vue:224:onBeforeUnmount(() => {
app/pages/index.vue:292:import { onBeforeUnmount, onMounted, ref } from "vue";
app/pages/index.vue:305:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/pages/index.vue:310:onBeforeUnmount(() => {
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:5:# Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:21:   **Then** le composable `app/composables/useTheme.ts` expose l'état réactif et les méthodes de contrôle :
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:26:     - `initTheme(): void` (synchronisation client avec `localStorage`, évaluation de `prefers-color-scheme` et attachement de l'écouteur `change`)
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:32:   **And** `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:33:   **And** tout basculement du thème système de l'OS (ou bascule émulée dans DevTools) met immédiatement à jour `resolvedTheme` et l'attribut `data-theme` sur `<html>` sans rechargement de page.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:38:   **And** `localStorage.setItem('jouan_theme_mode', pref)` persiste le choix (ou suppression/mise à jour propre)
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:39:   **And** `document.documentElement.setAttribute('data-theme', resolved)` applique le thème effectif
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:40:   **And** `document.documentElement.setAttribute('data-theme-source', pref)` reflète la préférence sélectionnée.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:44:   **Then** un micro-script synchrone pur JS (< 15 lignes, sans dépendance externe) est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:45:   **And** ce script lit `localStorage.getItem('jouan_theme_mode') || 'system'`, résout le thème effectif avant tout rendu CSS/DOM, et pose immédiatement les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:55:- [x] Tâche 1 — Création du composable réactif `app/composables/useTheme.ts` (AC: 1, 2, 3)
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:58:  - [x] Implémenter la fonction interne de résolution `resolveTheme(pref: ThemePreference): ResolvedTheme` (évaluant `window.matchMedia('(prefers-color-scheme: dark)').matches` sous `'system'`).
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:61:    - Lecture de `localStorage.getItem('jouan_theme_mode')` (fallback sur `'system'`).
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:63:    - Écoute de l'événement `change` sur `window.matchMedia('(prefers-color-scheme: dark)')` pour réagir dynamiquement quand `preference.value === 'system'`.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:67:    - Écriture dans `localStorage.setItem('jouan_theme_mode', pref)`.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:68:    - Mise à jour synchrone de `document.documentElement.setAttribute('data-theme', resolvedTheme.value)` et `document.documentElement.setAttribute('data-theme-source', pref)`.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:72:  - [x] Ajouter dans `app.head.script` de `nuxt.config.ts` le micro-script IIFE inline.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:77:        var pref = localStorage.getItem('jouan_theme_mode') || 'system';
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:80:          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:82:        document.documentElement.setAttribute('data-theme', resolved);
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:83:        document.documentElement.setAttribute('data-theme-source', pref);
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:85:        document.documentElement.setAttribute('data-theme', 'dark');
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:92:  - [x] Importer et appeler `const { initTheme } = useTheme()` dans `app/app.vue`.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:107:- **Fichier principal à créer :** `app/composables/useTheme.ts`
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:109:  - `nuxt.config.ts` (section `app.head.script`)
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:124:- **Clé de stockage unique :** Toujours utiliser `'jouan_theme_mode'`.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:126:### Code Snippet de référence pour `app/composables/useTheme.ts`
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:134:const STORAGE_KEY = 'jouan_theme_mode';
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:136:export function useTheme() {
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:142:    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:147:    document.documentElement.setAttribute('data-theme', resolved);
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:148:    document.documentElement.setAttribute('data-theme-source', pref);
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:193:    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:233:- Création du composable réactif `app/composables/useTheme.ts` avec gestion des états `preference` (`'system' | 'dark' | 'light'`) et `resolvedTheme` (`'dark' | 'light'`), synchronisation bidirectionnelle avec `localStorage` (`jouan_theme_mode`) et écouteur réactif `matchMedia('(prefers-color-scheme: dark)')`.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:235:- Injection du micro-script synchrone anti-FOUC inline dans `nuxt.config.ts` (`app.head.script`) pour poser immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant le premier paint.
docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md:240:- `app/composables/useTheme.ts` (créé)
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:21:   **Then** un bloc de surcharge dédié `[data-theme="light"]` est déclaré à la suite des tokens racine `:root`
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:45:   **When** le thème `[data-theme="light"]` est appliqué
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:54:   **When** le document HTML porte l'attribut `data-theme="light"`
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:69:  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:81:  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:113:[data-theme="light"] {
docs/implementation-artifacts/13-1-fondations-des-tokens-scss-theme-clair-et-sanctuarisation-du-terminal.md:176:- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
docs/implementation-artifacts/epic-11-retro-2026-09-14.md:68:- **Performance et conformité statique (Nitro SSG) :** Malgré la complexité des animations (WebGL, canvas, écouteurs de scroll et de souris), l'ensemble du cycle de vie est rigoureusement encapsulé dans `onMounted()` avec nettoyage systématique lors du démontage (`onBeforeUnmount()`), éliminant tout risque de fuite mémoire ou d'erreur d'hydratation côté serveur.
app/components/ui/ZButton.vue:36:import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
app/components/ui/ZButton.vue:85:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZButton.vue:90:onBeforeUnmount(() => {
app/components/ui/ZButton.vue:98:  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
app/components/ui/ZCustomCursor.vue:132:  hoverMediaQuery = window.matchMedia("(hover: hover)");
app/components/ui/ZCustomCursor.vue:133:  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeAtmosComponent.vue:13:import { onBeforeUnmount, onMounted, ref } from "vue";
app/components/home/HomeAtmosComponent.vue:323:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/home/HomeAtmosComponent.vue:352:onBeforeUnmount(() => {
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:38:  - [x] Navigation clavier conservée (focus visible sur burger via `--ring-accent`, liens focusables). Écouteur `keydown` Escape sous `onMounted`/`onBeforeUnmount` (prerender-safe).
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:53:- [x] [Review][Patch] Durcir le menu mobile pour le focus clavier et le changement de breakpoint [app/components/HeaderComponent.vue:45] **→ Résolu** : (a) fermeture clavier (Escape) / clic overlay → `closeMenuAndRefocus()` qui **renvoie le focus au burger** (`ref="burgerButton"`) ; (b) `matchMedia("(min-width: 901px)")` ferme le menu au passage en desktop ; (c) overlay masqué en desktop (`@media (width >= 901px)`) en filet SSR/pré-JS.
docs/implementation-artifacts/2-8-chassis-global-header-footer-nav-socials.md:141:- ✅ Résolu [Patch] **durcissement menu mobile** : retour de focus au burger à la fermeture clavier/overlay (`closeMenuAndRefocus`), fermeture automatique au passage desktop via `matchMedia("(min-width: 901px)")`, overlay neutralisé en desktop (`@media (width >= 901px)`). Écouteurs ajoutés/retirés dans `onMounted`/`onBeforeUnmount` (prerender-safe).
app/components/home/HomeBootOverlay.vue:139:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCard.vue:25:import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";
app/components/ui/ZCard.vue:68:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/components/ui/ZCard.vue:73:onBeforeUnmount(() => {
app/components/ui/ZCard.vue:81:  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
app/app.vue:11:const { initTheme } = useTheme();
app/app.vue:37:  script: [jsonLdScript(organizationJsonLd)],
app/components/home/HomeStackMarquee.vue:31:  typescript: "TypeScript",
docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md:99:- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
app/composables/usePageSeo.ts:87:      script: scripts,
app/components/home/HomeHeroTerminal.vue:154:  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
app/components/home/HomeHeroTerminal.vue:230:  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
app/composables/useTheme.ts:4:const STORAGE_KEY = "jouan_theme_mode";
app/composables/useTheme.ts:13:export function useTheme() {
app/composables/useTheme.ts:21:    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
app/composables/useTheme.ts:28:    document.documentElement.setAttribute("data-theme", resolved);
app/composables/useTheme.ts:29:    document.documentElement.setAttribute("data-theme-source", pref);
app/composables/useTheme.ts:76:    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
app/assets/scss/abstract/_root.scss:208:[data-theme="light"] {
docs/implementation-artifacts/deferred-work.md:32:6. **Centralisation SEO site-wide** — la **dette concrète est soldée** (6.2) : `SITE_URL` unique dans `app/utils/seo.ts` (dédup `/about`+`/blog`+article), JSON-LD via `jsonLdScript()` qui échappe `</script>`. ✅ **`SITE_URL` sourcé depuis `runtimeConfig` fait en 10.1** (`runtimeConfig.public.siteUrl` + composable `useSiteUrl()`, surchargeable `NUXT_PUBLIC_SITE_URL`). **Reste** (architecture, non-dette) : migrer vers `useSeoMeta`/`app.head` partagé, ajouter `publisher`/`Organization` (ou `nuxt-schema-org`), et étendre OG/JSON-LD aux pages encore nues (home, services, contact). → **story 10.5**. _(revues 5.1, 6.1, 6.2)_
docs/implementation-artifacts/deferred-work.md:83:- **Centralisation SEO site-wide (consolidation)** — _Dette concrète résolue en 6.2_ : `SITE_URL` extrait dans `app/utils/seo.ts` (source unique, dédup `/about`+`/blog`+`/blog/[...slug]`) ; JSON-LD via helper `jsonLdScript()` qui **échappe `<`** (plus de risque `</script>`). _Reste_ (architecture, non-dette) : migration `useSeoMeta`/`app.head` partagé, `SITE_URL` depuis `runtimeConfig`, `publisher`/`Organization` (ou `nuxt-schema-org`). → story SEO dédiée / Epic 9.
docs/implementation-artifacts/deferred-work.md:88:- ~~**SEO `/blog`**~~ — ✅ **Résolu sur `/blog`** (décision Simon : zéro dette) : `og:*`/`twitter:*`/`canonical` + JSON-LD `Blog`→`BlogPosting` ajoutés au `useHead`, vérifiés dans le HTML prerendu. _Reste_ la **centralisation SEO site-wide** (autres pages que `/about` + `/blog`, via `useSeoMeta` partagé / `app.head`) — Epic 9.
docs/implementation-artifacts/deferred-work.md:101:- ~~**Balises Open Graph / Twitter / canonical absentes**~~ — ✅ **Résolu** pour `/about` : `og:*`, `twitter:*` et `canonical` ajoutés au `useHead` (domaine `dev.jouan.ovh`), vérifiés dans le HTML prérendu. _Reste à étendre aux autres pages_ (centralisation possible via `useSeoMeta` partagé / `app.head`) — amélioration SEO site-wide à planifier hors 5.1.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:28:  - [x] Ubuntu sans : ajouté via **`<link>` Google Fonts** (preconnect + stylesheet, `display=swap`) dans `nuxt.config.ts > app.head.link` — et non un `@import` SCSS (respecte la règle « jamais `@import` » + non bloquant).
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:55:- **SCSS `@use`, jamais `@import`** côté partiels SCSS — l'import Google Fonts est une exception « ressource externe » : préférer un `<link>` dans `app.head`. [Source: docs/project-context.md#SCSS]
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:64:- **`nuxt.config.ts`** (UPDATE optionnel) — état actuel : `app.head` avec title/htmlAttrs(lang=fr)/charset/viewport/favicon/meta description. Ajouter le `<link>` Google Fonts (preconnect + stylesheet) dans `app.head.link` si on évite l'`@import`.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:80:- **`@import` Google Fonts dans SCSS** : la règle projet bannit `@import` SCSS ; l'`@import url(...)` CSS reste valide mais bloque le rendu — préférer `<link rel="preconnect">` + `<link rel="stylesheet">` dans `app.head`.
docs/implementation-artifacts/2-2-polices-et-base-dark-first.md:115:- **Ubuntu sans** : `<link>` Google Fonts (`preconnect` ×2 + `stylesheet` `display=swap`) dans `nuxt.config.ts > app.head.link`. Choix du `<link>` plutôt que `@import` SCSS : respecte la règle projet « jamais `@import` » et évite un import bloquant.
docs/implementation-artifacts/8-3-migrer-composants-terminal-script-setup.md:30:  - [x] Convertir `data()` → `ref`/`reactive` ; `methods` → fonctions ; `computed` → `computed()` ; `mounted`/`beforeUnmount` → `onMounted`/`onBeforeUnmount` ; `props`/`emits` → `defineProps`/`defineEmits` (typés).
docs/implementation-artifacts/7-1-route-contact-et-formulaire.md:150:- [x] [Review][Defer] SEO `/contact` : `useHead` ne pose que `title`+`description` (pas d'OG/canonical/JSON-LD) — identique à `/services`, scopé hors 7.1 par le dev. — deferred, à traiter avec la centralisation SEO site-wide déjà tracée (`useSeoMeta`/`app.head` + `SITE_URL`/`jsonLdScript` partagés) — Epic 9 / story SEO.
docs/implementation-artifacts/11-6-polissage-visuel-fidelite-maquette-awwwards-et-interactions.md:101:  - [x] Encapsuler l'effet sous garde `matchMedia('(prefers-reduced-motion: reduce)')` et `import.meta.client`.
app/assets/scss/abstract/_fonts.scss:3:// Ubuntu (sans) est chargée via Google Fonts (<link> dans nuxt.config.ts > app.head).
docs/implementation-artifacts/11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker.md:81:- **SSG & Prerender Safety :** Le site étant statique, tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) doit être encapsulé dans `onMounted()` ou sous `import.meta.client`.
docs/implementation-artifacts/1-2-mettre-a-jour-les-modules-et-dependances.md:76:- **`nuxt.config.ts`** (UPDATE) — état actuel : `modules: ["@nuxt/content", "@nuxt/image-edge"]`. Remplacer `"@nuxt/image-edge"` par `"@nuxt/image"`. Ne pas toucher `app.head`, `css`, `ssr: true`, `experimental.payloadExtraction: false`.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:20:**When** on centralise via `useSeoMeta`/`app.head` partagé, on source l'URL depuis `runtimeConfig` (posé en 10.1), on ajoute `publisher`/`Organization`, et on étend OG/Twitter/canonical + JSON-LD à home/services/contact
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:28:  - [x] Ajouter `Organization`/`publisher` au JSON-LD partagé (via `app.head` global dans `nuxt.config.ts` ou un plugin), avec `name`/`url`/`logo` issus de `SITE` (`app/data/site.ts`) et `siteUrl` (runtimeConfig). Envisager (optionnel, à décider) `nuxt-schema-org` — sinon JSON-LD manuel via `jsonLdScript()` (déjà sûr, échappe `</script>`).
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:30:  - [x] **Home `app/pages/index.vue`** : ajouter `usePageSeo` (aujourd'hui **aucune** meta dédiée → hérite seulement de `app.head` de `nuxt.config.ts`). OG/Twitter/canonical + JSON-LD (`WebSite`/`Person` selon pertinence) + image OG.
docs/implementation-artifacts/10-5-seo-centralise-site-wide.md:64:- **`nuxt.config.ts`** (UPDATE) — `app.head` global (déjà : title, htmlAttrs lang fr, description) ; ajouter le JSON-LD `Organization`/`publisher` global si retenu (ou via plugin). `runtimeConfig.public.siteUrl` (posé en 10.1).
docs/implementation-artifacts/2-7-iconographie.md:62:- **`nuxt.config.ts`** (UPDATE possible) — si chargement CDN Lucide via `<script>`/`<link>` dans `app.head` (déconseillé vs inline ; documenter si retenu).
docs/implementation-artifacts/4-1-route-services-et-cartes-doffre.md:30:  - [x] Définir le `<title>`/meta de page via `useHead`/`definePageMeta` (français, cohérent avec `app.head`)
docs/implementation-artifacts/epic-2-retro-2026-06-22.md:61:- **Châssis (2.8) bien décomposé** : sticky plutôt que fixed, menu mobile durci (Escape, `matchMedia`, retour focus), refonte sans casser terminal ni horloge.
docs/implementation-artifacts/code-reviews/13-2/full.diff:12:+const { initTheme } = useTheme();
docs/implementation-artifacts/code-reviews/13-2/full.diff:53:+      script: [
docs/implementation-artifacts/code-reviews/13-2/full.diff:57:+            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
docs/implementation-artifacts/code-reviews/13-2/full.diff:63:diff --git a/app/composables/useTheme.ts b/app/composables/useTheme.ts
docs/implementation-artifacts/code-reviews/13-2/full.diff:67:+++ b/app/composables/useTheme.ts
docs/implementation-artifacts/code-reviews/13-2/full.diff:72:+const STORAGE_KEY = "jouan_theme_mode";
docs/implementation-artifacts/code-reviews/13-2/full.diff:81:+export function useTheme() {
docs/implementation-artifacts/code-reviews/13-2/full.diff:89:+    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
docs/implementation-artifacts/code-reviews/13-2/full.diff:96:+    document.documentElement.setAttribute("data-theme", resolved);
docs/implementation-artifacts/code-reviews/13-2/full.diff:97:+    document.documentElement.setAttribute("data-theme-source", pref);
docs/implementation-artifacts/code-reviews/13-2/full.diff:144:+    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:81:- **`nuxt.config.ts`** (UPDATE) — état actuel : `css: ["@/assets/scss/main.scss"]`, `modules: ["@nuxt/content", "@nuxt/image-edge"]`, `ssr: true`, `experimental.payloadExtraction: false`, `webpack: { extractCSS: true }`, et un `app.head` (title, htmlAttrs lang=fr, meta description).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:82:  - À préserver : `app.head`, `css`, `ssr`, `payloadExtraction:false`, `modules` (la mise à jour `@nuxt/image-edge` → `@nuxt/image` est story 1.2 — ne pas la traiter ici sauf si elle bloque le démarrage).
docs/implementation-artifacts/1-1-migrer-le-coeur-vers-nuxt-4.md:138:- **Cœur Nuxt (1.1)** : `nuxt@^4.4.8`, retrait de `@nuxt/bridge`, `@nuxt/webpack*` ; passage Vite ; **structure Nuxt 4 `app/` adoptée** (code applicatif sous `app/`, défaut `srcDir:"app"`, sans override) ; `ssr`/`payloadExtraction:false`/`app.head` préservés. Codemod automatique non exécuté, migration + restructuration faites à la main puis validées au `generate`.
docs/implementation-artifacts/epic-6-retro-2026-06-25.md:70:**La pile « plus tard » grossit désormais sur DEUX axes.** Jusqu'ici on empilait de l'a11y pour Epic 9 ; l'Epic 6 ajoute une **dette d'architecture SEO** : OG/Twitter/canonical/JSON-LD ont été posés **ad hoc sur 3 pages** (`/about`, `/blog`, article), et la centralisation (`useSeoMeta`/`app.head` partagé, `SITE_URL` via `runtimeConfig`, `publisher`/`Organization`) est différée. **Décision Simon (cette rétro) : le SEO ne va PAS dans Epic 9** (thématiquement « a11y & motion ») mais dans une **story SEO dédiée en fin de refonte**.
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:80:+const { initTheme } = useTheme();
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:121:+      script: [
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:125:+            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:131:diff --git a/app/composables/useTheme.ts b/app/composables/useTheme.ts
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:135:+++ b/app/composables/useTheme.ts
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:140:+const STORAGE_KEY = "jouan_theme_mode";
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:149:+export function useTheme() {
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:157:+    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:164:+    document.documentElement.setAttribute("data-theme", resolved);
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:165:+    document.documentElement.setAttribute("data-theme-source", pref);
docs/implementation-artifacts/code-reviews/13-2/raw-blind-hunter.md:212:+    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:272:+[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:341:-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:347:+  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:363:-  - [ ] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:366:+  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:386:+- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:493:docs/specs/spec-theme-light-dark/technical-architecture.md:11:2. **Surcharge sur `[data-theme="light"]` :** Réaffecte les alias sémantiques aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:497:docs/specs/spec-theme-light-dark/technical-architecture.md:33:[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:499:docs/specs/spec-theme-light-dark/technical-architecture.md:61:- Il lit `localStorage.getItem('jouan_theme_mode')` et évalue `window.matchMedia('(prefers-color-scheme: dark)')`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:500:docs/specs/spec-theme-light-dark/technical-architecture.md:62:- Il applique immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant tout affichage graphique.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:501:docs/specs/spec-theme-light-dark/technical-architecture.md:68:    var stored = localStorage.getItem('jouan_theme_mode') || 'system';
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:502:docs/specs/spec-theme-light-dark/technical-architecture.md:69:    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:504:docs/specs/spec-theme-light-dark/technical-architecture.md:71:    document.documentElement.setAttribute('data-theme', resolved);
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:505:docs/specs/spec-theme-light-dark/technical-architecture.md:72:    document.documentElement.setAttribute('data-theme-source', stored);
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:506:docs/specs/spec-theme-light-dark/technical-architecture.md:74:    document.documentElement.setAttribute('data-theme', 'dark');
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:507:docs/specs/spec-theme-light-dark/technical-architecture.md:81:## 3. Composable `useTheme()` (`app/composables/useTheme.ts`)
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:510:docs/specs/spec-theme-light-dark/technical-architecture.md:89:export const useTheme = () => {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:513:docs/specs/spec-theme-light-dark/technical-architecture.md:94:  const initTheme = () => { /* synchronisation avec localStorage et matchMedia */ };
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:522:docs/specs/spec-theme-light-dark/technical-architecture.md:108:    // Mise à jour localStorage + DOM data-theme
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:561:docs/specs/spec-theme-light-dark/SPEC.md:22:  success: L'application de `data-theme="light"` permute l'ensemble des arrière-plans (`#FAF8F4`), bordures et textes aubergine profonde (`#271524`, contraste > 8:1) sur toutes les routes statiques, tandis que le Terminal Hero et les fenêtres flottantes conservent leur fond sombre (`#2E0024`) et leurs couleurs syntaxiques d'origine.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:562:docs/specs/spec-theme-light-dark/SPEC.md:26:  success: En absence de clé locale, le basculement de `prefers-color-scheme` entre sombre et clair dans le système (ou l'émulation DevTools) adapte immédiatement le thème sans rafraîchissement ni interruption de lecture.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:564:docs/specs/spec-theme-light-dark/SPEC.md:30:  success: La sélection d'un thème forcé (`dark` ou `light`) s'enregistre dans le `localStorage` du navigateur sous la clé `jouan_theme_mode` et est restaurée fidèlement lors des rechargements et navigations futures.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:567:docs/specs/spec-theme-light-dark/SPEC.md:38:  success: Un script inline synchrone injecté dans le `<head>` du document HTML résout et applique `data-theme` sur l'élément racine avant le premier paint du navigateur, sans provoquer de décalage de mise en page ni de flash FOUC.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:586:docs/planning-artifacts/epics.md:88:FR39: Surcharge utilisateur et persistance locale sous `localStorage` (`jouan_theme_mode`) conservant le choix d'une visite à l'autre. _(CAP-3)_
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:594:docs/planning-artifacts/epics.md:134:- **Epic 13 — Cascade SCSS & Composable `useTheme`** : Déclaration des tokens de thème clair sous le sélecteur `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`, script synchrone anti-FOUC injecté via `app.head.script` dans `nuxt.config.ts`, et gestion d'état réactive via `app/composables/useTheme.ts`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:729:docs/planning-artifacts/epics.md:1050:**When** on déclare le sélecteur `[data-theme="light"]`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:732:docs/planning-artifacts/epics.md:1065:### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:734:docs/planning-artifacts/epics.md:1075:**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:735:docs/planning-artifacts/epics.md:1076:**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:736:docs/planning-artifacts/epics.md:1077:**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:737:docs/planning-artifacts/epics.md:1078:**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:781:   **Then** un bloc de surcharge dédié `[data-theme="light"]` est déclaré à la suite des tokens racine `:root`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:805:   **When** le thème `[data-theme="light"]` est appliqué
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:814:   **When** le document HTML porte l'attribut `data-theme="light"`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:829:  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:841:  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:867:[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:930:- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:950:2. **Surcharge sur `[data-theme="light"]` :** Réaffecte les alias sémantiques aux valeurs de la palette « Papier technique / Crème solaire » définie dans `DESIGN.md`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:972:[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:999:- Un micro-script synchrone auto-exécuté est inséré tout en haut du `<head>` via `app.head.script`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1000:- Il lit `localStorage.getItem('jouan_theme_mode')` et évalue `window.matchMedia('(prefers-color-scheme: dark)')`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1001:- Il applique immédiatement `data-theme` et `data-theme-source` sur `document.documentElement` avant tout affichage graphique.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1007:    var stored = localStorage.getItem('jouan_theme_mode') || 'system';
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1008:    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1010:    document.documentElement.setAttribute('data-theme', resolved);
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1011:    document.documentElement.setAttribute('data-theme-source', stored);
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1013:    document.documentElement.setAttribute('data-theme', 'dark');
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1020:## 3. Composable `useTheme()` (`app/composables/useTheme.ts`)
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1028:export const useTheme = () => {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1033:  const initTheme = () => { /* synchronisation avec localStorage et matchMedia */ };
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1047:    // Mise à jour localStorage + DOM data-theme
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1277:**When** on déclare le sélecteur `[data-theme="light"]`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1292:### Story 13.2: Composable réactif useTheme, écoute système et script synchrone anti-FOUC
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1302:**Then** le composable `app/composables/useTheme.ts` expose l'état réactif (`preference`, `resolvedTheme`, `cycleTheme()`, `setTheme()`)
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1303:**And** par défaut, `preference` vaut `'system'` et `resolvedTheme` écoute réactivement `window.matchMedia('(prefers-color-scheme: dark)')`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1304:**And** tout appel à `setTheme('dark' | 'light' | 'system')` met à jour `localStorage.getItem('jouan_theme_mode')` et positionne les attributs `data-theme` et `data-theme-source` sur `document.documentElement`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1305:**And** un micro-script synchrone pur JS est injecté dans le `<head>` via `app.head.script` dans `nuxt.config.ts`, résolvant et appliquant `data-theme` avant le premier paint du navigateur (zéro FOUC en SSG)
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1374:  success: L'application de `data-theme="light"` permute l'ensemble des arrière-plans (`#FAF8F4`), bordures et textes aubergine profonde (`#271524`, contraste > 8:1) sur toutes les routes statiques, tandis que le Terminal Hero et les fenêtres flottantes conservent leur fond sombre (`#2E0024`) et leurs couleurs syntaxiques d'origine.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1378:  success: En absence de clé locale, le basculement de `prefers-color-scheme` entre sombre et clair dans le système (ou l'émulation DevTools) adapte immédiatement le thème sans rafraîchissement ni interruption de lecture.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1382:  success: La sélection d'un thème forcé (`dark` ou `light`) s'enregistre dans le `localStorage` du navigateur sous la clé `jouan_theme_mode` et est restaurée fidèlement lors des rechargements et navigations futures.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1390:  success: Un script inline synchrone injecté dans le `<head>` du document HTML résout et applique `data-theme` sur l'élément racine avant le premier paint du navigateur, sans provoquer de décalage de mise en page ni de flash FOUC.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1418:- Le script synchrone anti-FOUC est configuré dans `nuxt.config.ts` au niveau de `app.head.script`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1630:[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:1953:    12	+[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2022:    81	-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2028:    87	+  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2044:   103	-  - [ ] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2047:   106	+  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2065:    21	   **Then** un bloc de surcharge dédié `[data-theme="light"]` est déclaré à la suite des tokens racine `:root`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2089:    45	   **When** le thème `[data-theme="light"]` est appliqué
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2098:    54	   **When** le document HTML porte l'attribut `data-theme="light"`
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2113:    69	  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2125:    81	  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2161:    33	[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2415:- **Sanctuarisation appliquée globalement, pas uniquement sous le thème clair** — Déviation de l’intention de l’AC3 et de l’architecture technique : le bloc `.home-hero-terminal, .hero-term, .terminal-window, .terminal` n’est pas préfixé par `[data-theme="light"]` (`full.diff:46-58`), ce qui modifie aussi les variables locales en thème sombre et crée une surcharge inutile hors du contexte testé.
docs/implementation-artifacts/code-reviews/13-1/raw-acceptance-auditor.md:2422:- **Sanctuarisation appliquée globalement, pas uniquement sous le thème clair** — Déviation de l’intention de l’AC3 et de l’architecture technique : le bloc `.home-hero-terminal, .hero-term, .terminal-window, .terminal` n’est pas préfixé par `[data-theme="light"]` (`full.diff:46-58`), ce qui modifie aussi les variables locales en thème sombre et crée une surcharge inutile hors du contexte testé.
docs/implementation-artifacts/1-3-migrer-loutillage-lint-vers-eslint-9.md:67:- **`nuxt.config.ts`** (UPDATE) — ajouter `"@nuxt/eslint"` aux `modules` (fait par `nuxi module add eslint`) et, au besoin, la clé `eslint: { config: { stylistic: false } }` pour laisser Prettier gérer le style. Ne pas toucher `app.head`, `css`, `ssr`, `payloadExtraction`.
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:119:+const { initTheme } = useTheme();
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:160:+      script: [
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:164:+            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:170:diff --git a/app/composables/useTheme.ts b/app/composables/useTheme.ts
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:174:+++ b/app/composables/useTheme.ts
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:179:+const STORAGE_KEY = "jouan_theme_mode";
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:188:+export function useTheme() {
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:196:+    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:203:+    document.documentElement.setAttribute("data-theme", resolved);
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:204:+    document.documentElement.setAttribute("data-theme-source", pref);
docs/implementation-artifacts/code-reviews/13-2/raw-edge-case-hunter.json:251:+    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
docs/implementation-artifacts/3-1-hero-terminal-a.md:58:- [x] [Review][Patch] Pas de désenregistrement du lanceur terminal au démontage (asymétrie cycle de vie) [app/composables/useTerminal.ts:18 / app/components/HeaderComponent.vue:180] — `register()` appelé en `onMounted` sans `unregister` en `onBeforeUnmount` ; `launcher` est un singleton module. Impact réel faible (header persistant, optional chaining = no-op sûr) mais dette d'hygiène. Fix : `unregister(fn)` (ne nullifier que si `launcher.value === fn`) appelé au démontage. [blind+edge]
docs/implementation-artifacts/3-1-hero-terminal-a.md:180:- ✅ Resolved review finding [Patch] cycle de vie du lanceur : ajout de `unregister(fn)` dans `useTerminal` (nullifie seulement si `launcher.value === fn`), appelé en `onBeforeUnmount` du header — symétrie register/unregister, plus de singleton orphelin.
docs/implementation-artifacts/3-1-hero-terminal-a.md:188:- `app/components/HeaderComponent.vue` (enregistre/désenregistre le lanceur terminal partagé — onMounted / onBeforeUnmount)
docs/implementation-artifacts/code-reviews/13-1/full.diff:12:+[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/full.diff:81:-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/full.diff:87:+  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/full.diff:103:-  - [ ] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/full.diff:106:+  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/full.diff:126:+- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
docs/implementation-artifacts/10-1-decision-hebergement-prod-et-derisquage-deploiement.md:55:  - **Story 10.5 (SEO)** fera la **centralisation SEO** (`useSeoMeta`/`app.head` partagé, `publisher`/`Organization`, OG/JSON-LD des pages nues). Ici on ne fait QUE déplacer `SITE_URL` vers `runtimeConfig` (plomberie minimale) — **pas** de refonte des métadonnées.
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:124:+[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:193:-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:199:+  - [x] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:215:-  - [ ] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:218:+  - [x] Tester temporairement l'application de `data-theme="light"` sur la balise `<html>` pour vérifier le rendu des cartes blanches sur fond crème.
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:238:+- Déclaration de la palette claire « Papier technique / Crème solaire » sous `[data-theme="light"]` dans `app/assets/scss/abstract/_root.scss`.
docs/implementation-artifacts/code-reviews/13-1/raw-edge-case-hunter.json:283:   208	[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-blind-hunter.md:80:+[data-theme="light"] {
docs/implementation-artifacts/code-reviews/13-1/raw-blind-hunter.md:149:-  - [ ] Ajouter le sélecteur `[data-theme="light"]` à la suite du bloc `:root`.

---APP---
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { SITE } from "~/data/site";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

// Métadonnées Schema.org globales (Organization / publisher du site).
// Résolues depuis runtimeConfig (useSiteUrl) et les données partagées (SITE).
const siteUrl = useSiteUrl();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: SITE.profile.name,
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  email: SITE.profile.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.profile.city,
    addressCountry: "FR",
  },
};

useHead({
  script: [jsonLdScript(organizationJsonLd)],
});
</script>

<style lang="scss" scoped></style>

---CONFIG---
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "..::<sj />::..",
      htmlAttrs: {
        lang: "fr",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // Ubuntu sans (corps long) — Google Fonts via <link> (pas d'@import SCSS, cf. règle projet).
        // Ubuntu Mono reste self-hosted (abstract/_fonts.scss).
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400;1,700&display=swap",
        },
      ],
      meta: [
        {
          name: "description",
          content:
            "Développeur Fullstack et Testeur/QA freelance passionné par la création de solutions web performantes." +
            " Discutons de votre projet.",
        },
      ],
      script: [
        {
          type: "text/javascript",
          innerHTML:
            "(function(){try{var pref=localStorage.getItem('jouan_theme_mode')||'system';var resolved=pref;if(pref==='system'){resolved=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',resolved);document.documentElement.setAttribute('data-theme-source',pref);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
        },
      ],
    },
  },
  css: ["@/assets/scss/main.scss"],
  modules: ["@nuxt/content", "@nuxt/image", "@nuxt/eslint"],
  // @nuxt/content : coloration syntaxique Shiki désactivée. Le DS rend le code en
  // palette terminale UNIFORME (mono off-white sur fond aubergine, vert pour l'inline,
  // cf. kit.css .article .prose pre/code) — pas de multicolore par token, qui injecterait
  // des styles inline écrasant les tokens. Les blocs rendent en <pre><code> nu, stylés en SCSS.
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
  },
  // Primitives DS dans components/ui/ auto-importées sans préfixe de dossier
  // (<ZButton> et non <UiZButton>). Le reste de components/ garde le scan par défaut.
  components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"],
  ssr: true,
  // Config exposée au client. La clé d'accès Web3Forms (envoi du formulaire /contact)
  // n'est JAMAIS en dur : fournie par l'env NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY (cf.
  // .env.example). Vide par défaut → le formulaire bascule sur son état d'erreur.
  runtimeConfig: {
    public: {
      web3formsAccessKey: "",
      // URL de production du site (canonical / og:url / JSON-LD). Défaut = prod
      // (jouan.ovh, cf. public/CNAME) ; surchargeable via l'env NUXT_PUBLIC_SITE_URL
      // (cf. .env.example). Consommée par le composable useSiteUrl(). Valeur inlinée au prerender (`nuxi generate`).
      siteUrl: "https://jouan.ovh",
    },
  },
  // Structure Nuxt 4 par défaut : code applicatif sous app/ (srcDir = "app").
  experimental: {
    payloadExtraction: false,
  },
  // Flat config gérée par @nuxt/eslint ; on laisse Prettier formater (stylistic off).
  eslint: {
    config: {
      stylistic: false,
    },
  },
});

---PACKAGE---
{
  "private": true,
  "packageManager": "pnpm@11.8.0",
  "engines": {
    "node": ">=22.0.0"
  },
  "scripts": {
    "build": "nuxi build",
    "dev": "nuxi dev",
    "generate": "nuxi generate",
    "preview": "nuxi preview",
    "postinstall": "nuxi prepare",
    "lint": "eslint . && stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
    "lint:style": "stylelint \"app/assets/**/*.scss\" \"app/**/*.vue\"",
    "typecheck": "nuxi typecheck",
    "deploy": "push-dir --dir=.output/public --branch=gh-pages --cleanup"
  },
  "devDependencies": {
    "@nuxt/content": "^3.14.0",
    "@nuxt/eslint": "^1.16.0",
    "@nuxt/image": "^2.0.0",
    "autoprefixer": "^10.5.0",
    "better-sqlite3": "^12.5.0",
    "eslint": "^10.5.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.6",
    "nuxt": "^4.4.8",
    "postcss-html": "^1.8.1",
    "prettier": "^3.8.4",
    "push-dir": "^0.4.1",
    "sass": "^1.101.0",
    "stylelint": "^17.13.0",
    "stylelint-config-standard-scss": "^17.0.0",
    "stylelint-scss": "^7.2.0",
    "typescript": "^6.0.3",
    "vue-tsc": "^3.3.5"
  },
  "dependencies": {
    "ua-parser-js": "^2.0.10"
  }
}

exec
/bin/zsh -lc "sed -n '1,280p' app/assets/scss/abstract/_root.scss && sed -n '1,220p' docs/implementation-artifacts/13-2-composable-reactif-usetheme-ecoute-systeme-et-script-synchrone-anti-fouc.md | tail -100" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// ============================================================
//  Tokens du design system — SOURCE DE VÉRITÉ du style
//  Porté depuis docs/design_system/tokens/*.css (dark-first,
//  héritage Ubuntu/terminal : orange + aubergine).
//
//  RÈGLE : aucune valeur de couleur / espace / rayon / ombre /
//  motion ne doit être hardcodée dans un composant. Tout passe
//  par ces CSS custom properties via var(--token). (NFR2 / CAP-2)
//
//  Les valeurs sont reproduites à l'identique des tokens source
//  (notation couleur normalisée par Stylelint : hsl angle/%).
// ============================================================

:root {
  // ---- Brand : Ubuntu orange (accent primaire) ----
  --orange-50: hsl(24deg 100% 96%);
  --orange-100: hsl(25deg 100% 92%);
  --orange-300: hsl(24deg 100% 75%);
  --orange-500: hsl(24deg 94% 53%); // accent héros
  --orange-600: hsl(24deg 100% 47%);
  --orange-700: hsl(24deg 100% 37%);
  --orange-900: hsl(15deg 60% 17%);

  // ---- Brand : Aubergine (violet Ubuntu) ----
  --aubergine-light: hsl(319deg 26% 70%);
  --aubergine: hsl(319deg 33% 30%);
  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
  --aubergine-deep: hsl(319deg 100% 9%); // corps terminal
  --aubergine-black: hsl(320deg 60% 5%);

  // ---- Rampe de surfaces neutres (teintées aubergine, sombre→clair) ----
  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
  --surface-1: hsl(319deg 22% 9%); // sections en creux
  --surface-2: hsl(318deg 18% 12%); // cartes / panneaux
  --surface-3: hsl(317deg 16% 16%); // éléments surélevés / hover
  --surface-4: hsl(316deg 14% 21%); // popovers, inputs

  // ---- Bordures / hairlines ----
  --line-subtle: hsl(316deg 14% 18%);
  --line: hsl(315deg 12% 25%);
  --line-strong: hsl(314deg 11% 34%);

  // ---- Texte (off-whites chauds sur fond sombre) ----
  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
  --ink-2: hsl(28deg 10% 74%); // corps
  --ink-3: hsl(25deg 7% 54%); // discret / légendes
  --ink-4: hsl(22deg 6% 40%); // estompé / désactivé
  --ink-on-accent: hsl(320deg 60% 5%); // texte sombre sur orange

  // ---- Palette terminale / syntaxe ----
  --term-green: hsl(143deg 60% 52%); // prompt, succès
  --term-blue: hsl(204deg 72% 62%); // répertoires, liens
  --term-cyan: hsl(186deg 64% 56%);
  --term-red: hsl(0deg 85% 64%);
  --term-yellow: hsl(48deg 90% 58%);
  --term-purple: hsl(280deg 60% 70%);

  // ---- Sémantique ----
  --success: hsl(143deg 58% 46%);
  --success-soft: hsl(143deg 45% 14%);
  --warning: hsl(38deg 92% 56%);
  --warning-soft: hsl(38deg 60% 14%);
  --danger: hsl(0deg 78% 60%);
  --danger-soft: hsl(0deg 55% 15%);
  --info: hsl(204deg 72% 56%);
  --info-soft: hsl(204deg 55% 14%);

  // ============================================================
  //  Alias sémantiques — à préférer dans les composants
  // ============================================================
  --bg-page: var(--surface-0);
  --bg-sunken: var(--surface-1);
  --bg-card: var(--surface-2);
  --bg-elevated: var(--surface-3);
  --bg-input: var(--surface-4);
  --bg-terminal: var(--aubergine-deep);
  --text-strong: var(--ink-1);
  --text-body: var(--ink-2);
  --text-muted: var(--ink-3);
  --text-faint: var(--ink-4);
  --border-subtle: var(--line-subtle);
  --border-default: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--orange-500);
  --accent-hover: hsl(24deg 100% 60%);
  --accent-active: var(--orange-600);
  --accent-text: var(--ink-on-accent);
  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
  --accent-ring: hsl(24deg 94% 53% / 45%);
  --accent-2: var(--aubergine-light); // accent secondaire
  --accent-2-soft: hsl(319deg 40% 30% / 28%);
  --border-terminal: hsl(319deg 40% 30% / 40%); // bordure fenêtre terminal (TerminalWindow.jsx)
  --link: var(--term-blue);
  --prompt: var(--term-green);
  --overlay: hsl(320deg 60% 3% / 66%);
  --selection: hsl(24deg 94% 53% / 28%);

  // ============================================================
  //  Typographie
  // ============================================================
  --font-mono: "Ubuntu Mono", "SF Mono", ui-monospace, monospace;
  --font-sans: "Ubuntu", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: var(--font-mono);

  // Tailles de police (échelle px : 12 14 16 18 20 24 28 32 40 48 56)
  --fs-xs: 0.75rem; // 12
  --fs-sm: 0.875rem; // 14
  --fs-base: 1rem; // 16
  --fs-md: 1.125rem; // 18
  --fs-lg: 1.25rem; // 20
  --fs-xl: 1.5rem; // 24
  --fs-2xl: 1.75rem; // 28
  --fs-3xl: 2rem; // 32
  --fs-4xl: 2.5rem; // 40
  --fs-5xl: 3rem; // 48
  --fs-6xl: 3.5rem; // 56

  // Graisses
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;

  // Interlignes
  --lh-tight: 1.1;
  --lh-snug: 1.3;
  --lh-normal: 1.5;
  --lh-relaxed: 1.65;

  // Interlettrage — les eyebrows/labels mono reçoivent des capitales espacées
  --ls-tight: -0.02em;
  --ls-normal: 0;
  --ls-wide: 0.04em;
  --ls-wider: 0.14em;

  // ============================================================
  //  Espacement — base 4px (token = px / 4)
  // ============================================================
  --space-0: 0;
  --space-1: 0.25rem; // 4
  --space-2: 0.5rem; // 8
  --space-3: 0.75rem; // 12
  --space-4: 1rem; // 16
  --space-5: 1.25rem; // 20
  --space-6: 1.5rem; // 24
  --space-8: 2rem; // 32
  --space-10: 2.5rem; // 40
  --space-12: 3rem; // 48
  --space-16: 4rem; // 64
  --space-20: 5rem; // 80
  --space-24: 6rem; // 96

  // Layout
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 992px;
  --container-xl: 1200px;
  --container-2xl: 1400px;
  --header-height: 56px;
  --footer-height: 56px;
  --gutter: var(--space-6);

  // ============================================================
  //  Rayons (héritage : 0 / 4 / 8 / pill / 50% ; terminal = 5px)
  // ============================================================
  --radius-none: 0;
  --radius-xs: 3px;
  --radius-sm: 5px; // fenêtre terminal, chips
  --radius-md: 8px; // cartes, inputs, boutons
  --radius-lg: 12px; // grands panneaux
  --radius-xl: 18px;
  --radius-pill: 999px;
  --radius-circle: 50%;

  // ============================================================
  //  Élévation — ombres calibrées pour une UI sombre
  // ============================================================
  --shadow-1: 0 1px 3px hsl(320deg 60% 2% / 50%);
  --shadow-2: 0 2px 8px hsl(320deg 60% 2% / 55%);
  --shadow-3: 0 8px 24px hsl(320deg 60% 2% / 60%);
  --shadow-4: 0 18px 48px hsl(320deg 60% 2% / 66%);

  // Hairline interne en haut : donne l'impression d'une carte éclairée du dessus
  --shadow-hairline: inset 0 1px 0 hsl(30deg 20% 100% / 5%);

  // Glows focaux
  --glow-accent: 0 0 0 1px hsl(24deg 94% 53% / 40%), 0 8px 30px hsl(24deg 94% 53% / 22%);
  --glow-terminal: 0 12px 40px hsl(319deg 100% 9% / 70%), 0 0 0 1px hsl(319deg 40% 40% / 30%);

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


codex
- Le micro-script accepte toute valeur non vide stockée dans `localStorage` comme préférence valide, contrairement à `initTheme()`, ce qui peut produire `data-theme="invalid"` et laisser l’application sans thème correspondant.

- En cas d’exception dans le micro-script, seul `data-theme="dark"` est appliqué ; `data-theme-source` reste absent, puis `initTheme()` peut basculer vers un autre thème dès le montage.

- Le micro-script et le composable dupliquent la résolution du thème, la clé de stockage et les valeurs autorisées, ce qui permet aux deux implémentations de diverger silencieusement.

- `initTheme()` ajoute un écouteur `matchMedia` sans jamais le supprimer, créant une fuite si le composable est initialisé plusieurs fois ou si l’arbre applicatif est remonté.

- `initTheme()` n’est pas idempotente : chaque appel ajoute un nouvel écouteur et peut provoquer plusieurs mises à jour DOM pour un seul changement de préférence système.

- Le composable n’expose aucune fonction de nettoyage ni mécanisme interne garantissant un seul abonnement partagé.

- L’appel à `window.matchMedia()` dans `initTheme()` n’est pas protégé contre une API absente ou défaillante ; une exception après l’application initiale du thème peut interrompre l’initialisation côté client.

- `setTheme()` repose uniquement sur le typage TypeScript et n’effectue aucune validation à l’exécution ; une valeur invalide injectée depuis JavaScript sera écrite dans `localStorage` et appliquée aux attributs HTML.

- L’état SSR de `resolvedTheme` est toujours `"dark"`, alors que le script synchrone peut appliquer `"light"` avant l’hydratation ; les consommateurs réactifs peuvent donc observer un état Vue incohérent avec le DOM initial.

- La préférence `"system"` n’est réellement chargée qu’après `onMounted()`, ce qui laisse les composants dépendant de `preference` avec une valeur transitoire incorrecte pendant l’hydratation.

- Aucun test n’est ajouté pour vérifier la restauration des préférences, les valeurs corrompues, les erreurs `localStorage`, les changements OS ou l’absence de `matchMedia`.

- Aucun test ne vérifie la cohérence entre le micro-script anti-FOUC et `useTheme()`, alors que ces deux chemins peuvent produire des résultats différents.

- Le code ne met pas à jour la propriété CSS `color-scheme`, ce qui peut laisser les contrôles natifs, les barres de défilement et certains éléments du navigateur dans un thème inadapté.

- Le fallback du micro-script force toujours le thème sombre, même lorsque la préférence système ou la palette par défaut du document devrait conduire à un comportement différent.

- Le script inline n’est accompagné d’aucune vérification de rendu dans le HTML généré ou dans les pages statiques, alors que son placement dans le `<head>` est essentiel à la promesse anti-FOUC.

- Le changement de statut vers `review` ne fournit aucune preuve de validation Docker, de vérification d’hydratation ou de contrôle visuel desktop/mobile.
tokens used
35 422
- Le micro-script accepte toute valeur non vide stockée dans `localStorage` comme préférence valide, contrairement à `initTheme()`, ce qui peut produire `data-theme="invalid"` et laisser l’application sans thème correspondant.

- En cas d’exception dans le micro-script, seul `data-theme="dark"` est appliqué ; `data-theme-source` reste absent, puis `initTheme()` peut basculer vers un autre thème dès le montage.

- Le micro-script et le composable dupliquent la résolution du thème, la clé de stockage et les valeurs autorisées, ce qui permet aux deux implémentations de diverger silencieusement.

- `initTheme()` ajoute un écouteur `matchMedia` sans jamais le supprimer, créant une fuite si le composable est initialisé plusieurs fois ou si l’arbre applicatif est remonté.

- `initTheme()` n’est pas idempotente : chaque appel ajoute un nouvel écouteur et peut provoquer plusieurs mises à jour DOM pour un seul changement de préférence système.

- Le composable n’expose aucune fonction de nettoyage ni mécanisme interne garantissant un seul abonnement partagé.

- L’appel à `window.matchMedia()` dans `initTheme()` n’est pas protégé contre une API absente ou défaillante ; une exception après l’application initiale du thème peut interrompre l’initialisation côté client.

- `setTheme()` repose uniquement sur le typage TypeScript et n’effectue aucune validation à l’exécution ; une valeur invalide injectée depuis JavaScript sera écrite dans `localStorage` et appliquée aux attributs HTML.

- L’état SSR de `resolvedTheme` est toujours `"dark"`, alors que le script synchrone peut appliquer `"light"` avant l’hydratation ; les consommateurs réactifs peuvent donc observer un état Vue incohérent avec le DOM initial.

- La préférence `"system"` n’est réellement chargée qu’après `onMounted()`, ce qui laisse les composants dépendant de `preference` avec une valeur transitoire incorrecte pendant l’hydratation.

- Aucun test n’est ajouté pour vérifier la restauration des préférences, les valeurs corrompues, les erreurs `localStorage`, les changements OS ou l’absence de `matchMedia`.

- Aucun test ne vérifie la cohérence entre le micro-script anti-FOUC et `useTheme()`, alors que ces deux chemins peuvent produire des résultats différents.

- Le code ne met pas à jour la propriété CSS `color-scheme`, ce qui peut laisser les contrôles natifs, les barres de défilement et certains éléments du navigateur dans un thème inadapté.

- Le fallback du micro-script force toujours le thème sombre, même lorsque la préférence système ou la palette par défaut du document devrait conduire à un comportement différent.

- Le script inline n’est accompagné d’aucune vérification de rendu dans le HTML généré ou dans les pages statiques, alors que son placement dans le `<head>` est essentiel à la promesse anti-FOUC.

- Le changement de statut vers `review` ne fournit aucune preuve de validation Docker, de vérification d’hydratation ou de contrôle visuel desktop/mobile.

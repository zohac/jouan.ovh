Reading prompt from stdin...
2026-09-13T16:28:30.062961Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09b99-4d15-75e2-a505-939a053cf7ae
--------
user
# Blind Hunter Prompt — Story 11.1

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-1/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
I’m using `bmad-review-adversarial-general` to audit the supplied diff with an intentionally skeptical lens and produce description-only findings.
  → Read the adversarial review skill instructions
  • Inspect the supplied diff and identify concrete issues
  • Return at least ten description-only findings
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.codex/skills/bmad-review-adversarial-general/SKILL.md && printf '\\n--- DIFF ---\\n' && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
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

--- DIFF ---
diff --git a/app/components/FooterComponent.vue b/app/components/FooterComponent.vue
index febe415..a583c55 100644
--- a/app/components/FooterComponent.vue
+++ b/app/components/FooterComponent.vue
@@ -7,7 +7,7 @@
             <ZIcon name="gem" class="ftr__logo" />
             <b>jouan.ovh</b>
           </NuxtLink>
-          <p class="ftr__tagline">Développeur web freelance. Valognes, France.</p>
+          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
         </div>
 
         <nav class="ftr__col" aria-label="Navigation du pied de page">
@@ -17,14 +17,12 @@
 
         <div class="ftr__col">
           <h2 class="ftr__title">// Projets</h2>
-          <ZExternalLink
-            v-for="project in projects"
-            :key="project.url"
-            :href="project.url"
-            rel="noopener noreferrer"
-            class="ftr__link"
-            >{{ project.name }}</ZExternalLink
-          >
+          <template v-for="project in projects" :key="project.name">
+            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
+              project.name
+            }}</ZExternalLink>
+            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
+          </template>
         </div>
 
         <div class="ftr__col">
@@ -55,6 +53,7 @@ const navItems = [
   { to: "/mentions-legales", label: "Mentions légales" },
 ];
 
+const profile = SITE.profile;
 // Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
 const projects = SITE.projects;
 
diff --git a/app/components/home/HomeAtmosComponent.vue b/app/components/home/HomeAtmosComponent.vue
new file mode 100644
index 0000000..b9f7223
--- /dev/null
+++ b/app/components/home/HomeAtmosComponent.vue
@@ -0,0 +1,124 @@
+<template>
+  <div class="atmos" aria-hidden="true">
+    <div class="aurora aurora--auberg" />
+    <div class="aurora aurora--orange" />
+    <div class="aurora aurora--red" />
+    <div class="grid-dots" />
+    <div class="scanlines" />
+    <div class="vignette" />
+  </div>
+</template>
+
+<script setup lang="ts">
+// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
+// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.atmos {
+  position: fixed;
+  inset: 0;
+  z-index: 0;
+  overflow: hidden;
+  pointer-events: none;
+}
+
+.aurora {
+  position: absolute;
+  border-radius: var(--radius-circle);
+  filter: blur(80px);
+  mix-blend-mode: screen;
+  will-change: transform;
+}
+
+.aurora--orange {
+  top: -22%;
+  left: 48%;
+  width: 60vw;
+  height: 60vw;
+  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
+  opacity: 0.55;
+  animation: drift-orange 26s var(--ease-in-out) infinite;
+}
+
+.aurora--auberg {
+  top: 6%;
+  left: -22%;
+  width: 64vw;
+  height: 64vw;
+  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
+  opacity: 0.7;
+  animation: drift-auberg 32s var(--ease-in-out) infinite;
+}
+
+.aurora--red {
+  top: 44%;
+  left: 26%;
+  width: 44vw;
+  height: 44vw;
+  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
+  opacity: 0.4;
+  animation: drift-red 30s var(--ease-in-out) infinite;
+}
+
+.grid-dots {
+  position: absolute;
+  inset: 0;
+  background-image: radial-gradient(hsl(30deg 20% 100% / 5%) 1px, transparent 1px);
+  background-size: 34px 34px;
+  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 78%);
+}
+
+.scanlines {
+  position: absolute;
+  inset: 0;
+  opacity: 0.35;
+  background: repeating-linear-gradient(0deg, hsl(0deg 0% 0% / 18%) 0 1px, transparent 1px 3px);
+}
+
+.vignette {
+  position: absolute;
+  inset: 0;
+  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
+}
+
+@keyframes drift-orange {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(-6vw, 5vh) scale(1.12);
+  }
+}
+
+@keyframes drift-auberg {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(7vw, -4vh) scale(1.08);
+  }
+}
+
+@keyframes drift-red {
+  0%,
+  100% {
+    transform: translate(0, 0) scale(1);
+  }
+
+  50% {
+    transform: translate(-4vw, -6vh) scale(1.15);
+  }
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .aurora {
+    animation: none;
+  }
+}
+</style>
diff --git a/app/components/terminal/programs/Projets.ts b/app/components/terminal/programs/Projets.ts
index 9333808..46b4ff8 100644
--- a/app/components/terminal/programs/Projets.ts
+++ b/app/components/terminal/programs/Projets.ts
@@ -7,7 +7,12 @@ const projets: IProgram = {
   command: "projets",
   description: "Mes projets.",
   run: function (): string {
-    const items = SITE.projects.map((p) => `<li>${p.name} — ${p.role} — ${p.desc} (${p.url})</li>`).join("");
+    const items = SITE.projects
+      .map((p) => {
+        const meta = p.url ? ` (${p.url})` : p.status ? ` [${p.status}]` : "";
+        return `<li>${p.name} — ${p.role} — ${p.desc}${meta}</li>`;
+      })
+      .join("");
     return `<ul>${items}</ul>`;
   },
 };
diff --git a/app/components/ui/ZCustomCursor.vue b/app/components/ui/ZCustomCursor.vue
new file mode 100644
index 0000000..c43f680
--- /dev/null
+++ b/app/components/ui/ZCustomCursor.vue
@@ -0,0 +1,142 @@
+<template>
+  <div v-if="isEnabled" aria-hidden="true">
+    <div
+      class="cursor-ring"
+      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
+    />
+    <div
+      class="cursor-dot"
+      :class="{ 'is-visible': isVisible }"
+      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
+    />
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
+// Purement décoratif (aria-hidden="true").
+// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
+// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.
+
+const isEnabled = ref(false);
+const isVisible = ref(false);
+const isHot = ref(false);
+
+const dotX = ref(0);
+const dotY = ref(0);
+const ringX = ref(0);
+const ringY = ref(0);
+
+let mouseX = 0;
+let mouseY = 0;
+let currentRingX = 0;
+let currentRingY = 0;
+let rafId: number | null = null;
+
+function updateAnimationLoop() {
+  currentRingX += (mouseX - currentRingX) * 0.18;
+  currentRingY += (mouseY - currentRingY) * 0.18;
+  ringX.value = currentRingX;
+  ringY.value = currentRingY;
+  rafId = requestAnimationFrame(updateAnimationLoop);
+}
+
+function handlePointerMove(e: PointerEvent) {
+  if (!isVisible.value) {
+    isVisible.value = true;
+    currentRingX = e.clientX;
+    currentRingY = e.clientY;
+    ringX.value = e.clientX;
+    ringY.value = e.clientY;
+  }
+  mouseX = e.clientX;
+  mouseY = e.clientY;
+  dotX.value = e.clientX;
+  dotY.value = e.clientY;
+}
+
+function handlePointerOver(e: Event) {
+  const target = e.target as HTMLElement | null;
+  if (!target) return;
+  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");

codex
The diff is readable but longer than the first excerpt, so I’m continuing through the remaining files and checking the changes against the project’s stated SSR, accessibility, motion, token, and content invariants.
exec
/bin/zsh -lc "sed -n '261,620p' docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
+  isHot.value = Boolean(isInteractive);
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const hasHover = window.matchMedia("(hover: hover)").matches;
+  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (!hasHover || prefersReducedMotion) {
+    return;
+  }
+
+  isEnabled.value = true;
+  window.addEventListener("pointermove", handlePointerMove, { passive: true });
+  document.addEventListener("pointerover", handlePointerOver, { passive: true });
+  rafId = requestAnimationFrame(updateAnimationLoop);
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("pointermove", handlePointerMove);
+  document.removeEventListener("pointerover", handlePointerOver);
+  if (rafId !== null) {
+    cancelAnimationFrame(rafId);
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.cursor-dot,
+.cursor-ring {
+  position: fixed;
+  top: 0;
+  left: 0;
+  z-index: 90;
+  border-radius: var(--radius-circle);
+  mix-blend-mode: difference;
+  opacity: 0;
+  pointer-events: none;
+  transition: opacity var(--dur-base) var(--ease-standard);
+
+  &.is-visible {
+    opacity: 1;
+  }
+}
+
+.cursor-dot {
+  width: 6px;
+  height: 6px;
+  background: var(--ink-1);
+}
+
+.cursor-ring {
+  width: 34px;
+  height: 34px;
+  border: 1px solid hsl(0deg 0% 100% / 70%);
+  transition:
+    width var(--dur-base) var(--ease-out),
+    height var(--dur-base) var(--ease-out),
+    border-color var(--dur-base) var(--ease-out),
+    opacity var(--dur-base) var(--ease-standard);
+
+  &.is-hot {
+    width: 56px;
+    height: 56px;
+    border-color: var(--accent);
+  }
+}
+
+@media (hover: none), (prefers-reduced-motion: reduce) {
+  .cursor-dot,
+  .cursor-ring {
+    display: none;
+  }
+}
+</style>
diff --git a/app/data/site.ts b/app/data/site.ts
index 81fd41d..d87e1d2 100644
--- a/app/data/site.ts
+++ b/app/data/site.ts
@@ -16,54 +16,65 @@ export interface IProfile {
   email: string;
   city: string;
   available: boolean;
+  maltUrl?: string;
 }
 
 export interface IProject {
   name: string;
   role: string;
   desc: string;
-  url: string;
+  url?: string;
+  status?: string;
   tags: string[];
 }
 
 const profile: IProfile = {
   name: "Simon Jouan",
-  role: "Développeur web freelance",
+  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
   email: "simon@jouan.ovh",
-  city: "Valognes, France",
+  city: "Rouen, France",
   available: true,
+  maltUrl: "https://www.malt.fr/profile/simonjouan",
 };
 
-// Stack technique — ordre conservé (tags hero de la home = sous-ensemble curé, non dérivé d'ici).
+// Stack technique moderne prioritaire ordonnée.
 const skills: string[] = [
-  "php",
-  "symfony",
-  "wordpress",
-  "node.js",
-  "nest.js",
-  "nuxt.js",
-  "vue",
   "typescript",
+  "nuxt",
+  "vue",
+  "nest.js",
+  "node.js",
+  "postgresql",
+  "typeorm",
+  "stripe",
+  "cypress",
   "docker",
-  "tailwind",
-  "n8n",
-  "mysql",
+  "rest-api",
+  "vitest",
 ];
 
 const projects: IProject[] = [
   {
     name: "keova.app",
-    role: "Fondateur · SaaS",
-    desc: "Plateforme SaaS que je conçois et opère de bout en bout.",
+    role: "Co-fondateur & Développeur Full Stack",
+    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
     url: "https://keova.app",
-    tags: ["nest.js", "nuxt", "saas"],
+    status: "En production",
+    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
+  },
+  {
+    name: "TryOn",
+    role: "CTO & Développeur Full Stack",
+    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
+    status: "Étude de cas (MVP livré)",
+    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
   },
   {
-    name: "patio-conseil.fr",
-    role: "Client",
-    desc: "Site et outils pour un cabinet de conseil.",
-    url: "https://patio-conseil.fr",
-    tags: ["wordpress", "conseil"],
+    name: "Nodium",
+    role: "Créateur & Ingénieur IA",
+    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
+    status: "R&D / En cours",
+    tags: ["typescript", "electron", "agents", "ia"],
   },
 ];
 
diff --git a/app/pages/index.vue b/app/pages/index.vue
index cb89e65..fbd4f5c 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -1,5 +1,8 @@
 <template>
   <main class="home">
+    <HomeAtmosComponent />
+    <ZCustomCursor />
+
     <section class="hero hero__grad">
       <div class="hero__in container">
         <div class="hero__grid">
@@ -98,8 +101,14 @@
 
         <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
         <ul class="grid-2 projects">
-          <li v-for="project in projects" :key="project.url">
-            <ZCard class="project" interactive :as="ZExternalLink" :href="project.url" rel="noopener noreferrer">
+          <li v-for="project in projects" :key="project.name">
+            <ZCard
+              class="project"
+              interactive
+              :as="project.url ? ZExternalLink : 'div'"
+              :href="project.url || undefined"
+              :rel="project.url ? 'noopener noreferrer' : undefined"
+            >
               <div class="project__head">
                 <h3 class="project__name">{{ project.name }}</h3>
                 <span class="project__role">{{ project.role }}</span>
diff --git a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
index 44ad82b..38abf8d 100644
--- a/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
+++ b/docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
@@ -1,6 +1,10 @@
+---
+baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed
+---
+
 # Story 11.1: Préparation de branche, mise à jour des données `site.ts` & Atmosphère cinétique
 
-Status: ready-for-dev
+Status: review
 
 <!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
 
@@ -41,36 +45,36 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
 
 ## Tasks / Subtasks
 
-- [ ] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
-  - [ ] Vérifier l'état de l'arbre de travail (`git status`).
-  - [ ] S'assurer que la branche `develop` est à jour.
-  - [ ] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
-
-- [ ] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
-  - [ ] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
-  - [ ] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
-  - [ ] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
-  - [ ] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
-  - [ ] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
-
-- [ ] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
-  - [ ] Créer `app/components/home/HomeAtmosComponent.vue`.
-  - [ ] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
-  - [ ] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
-  - [ ] Baliser le bloc avec `aria-hidden="true"`.
-  - [ ] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
-
-- [ ] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
-  - [ ] Créer `app/components/ui/ZCustomCursor.vue`.
-  - [ ] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
-  - [ ] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
-  - [ ] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
-  - [ ] Nettoyer les listeners lors du `onUnmounted()`.
-
-- [ ] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
-  - [ ] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
-  - [ ] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
-  - [ ] Vérifier que les 13 routes statiques sont générées sans avertissement.
+- [x] Tâche 1 — Préparation Git : branche dédiée issue de `develop` (AC: 1)
+  - [x] Vérifier l'état de l'arbre de travail (`git status`).
+  - [x] S'assurer que la branche `develop` est à jour.
+  - [x] Créer et basculer sur la branche `feat/home-awwwards` depuis `develop`.
+
+- [x] Tâche 2 — Mise à jour de la source unique de données `app/data/site.ts` (AC: 2)
+  - [x] Mettre à jour l'interface `IProject` pour inclure `status?: string` et rendre `url?: string` optionnel.
+  - [x] Mettre à jour `SITE.profile` (rôle « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », champ `maltUrl: "https://www.malt.fr/profile/simonjouan"`).
+  - [x] Mettre à jour `SITE.skills` avec la stack moderne ciblée.
+  - [x] Remplacer les projets dans `SITE.projects` par Keova, TryOn (sans URL externe) et Nodium.
+  - [x] Vérifier la non-régression sur les consommateurs existants (`FooterComponent.vue`, `app/components/terminal/programs/Projets.ts`).
+
+- [x] Tâche 3 — Implémentation du composant atmosphérique `.atmos` (AC: 3)
+  - [x] Créer `app/components/home/HomeAtmosComponent.vue`.
+  - [x] Intégrer les 3 calques auroras (`.aurora--auberg`, `.aurora--orange`, `.aurora--red`) en pur SCSS/CSS utilisant les variables de couleur du Design System (`--color-aubergine-base`, `--color-orange-base`, etc.).
+  - [x] Ajouter la grille de points SVG/CSS et la texture scanlines CRT.
+  - [x] Baliser le bloc avec `aria-hidden="true"`.
+  - [x] Intégrer la règle `@media (prefers-reduced-motion: reduce)` désactivant les animations.
+
+- [x] Tâche 4 — Implémentation du micro-curseur interactif progressif (AC: 4)
+  - [x] Créer `app/components/ui/ZCustomCursor.vue`.
+  - [x] Implémenter le suivi du curseur avec `pointermove` encapsulé dans `onMounted()` avec garde `import.meta.client`.
+  - [x] Gérer les classes actives d'expansion au survol des éléments interactifs (`[data-hot]`, `a`, `button`).
+  - [x] Masquer le curseur custom sous `@media (hover: none)` et `@media (prefers-reduced-motion: reduce)`.
+  - [x] Nettoyer les listeners lors du `onUnmounted()`.
+
+- [x] Tâche 5 — Intégration sur `app/pages/index.vue` et validation qualité Docker (AC: 5)
+  - [x] Intégrer `<HomeAtmosComponent />` et `<ZCustomCursor />` sur `app/pages/index.vue`.
+  - [x] Exécuter la validation qualité Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier que les 13 routes statiques sont générées sans avertissement.
 
 ## Dev Notes
 
@@ -93,6 +97,51 @@ so that j'entre immédiatement dans l'univers technique haut de gamme du site sa
 - **Pile atmosphérique :** Strictement décorative (`aria-hidden="true"`). Neutralisation des `@keyframes` sous `prefers-reduced-motion: reduce`.
 - **Micro-curseur :** Ne jamais cacher le curseur système de manière irréversible (`cursor: none` uniquement appliqué sur `body` si le JS a monté avec succès le curseur et sur écran avec hover). Désactivé sous reduced motion.
 
+## Dev Agent Record
+
+### Implementation Plan
+1. **Isolation Git :** Création et bascule sur la branche `feat/home-awwwards` depuis `develop`.
+2. **Données centralisées (`site.ts`) :**
+   - Mise à jour de `IProject` (`status?: string`, `url?: string`) et `IProfile` (`maltUrl?: string`).
+   - Rôle commercial unifié : « Développeur Full Stack TypeScript — Nuxt / NestJS », ville « Rouen, France », lien Malt.
+   - Stack ordonnée moderne : TypeScript, Nuxt, Vue, NestJS, Node.js, PostgreSQL, TypeORM, Stripe, Cypress, Docker, REST API, Vitest.
+   - Projets phares : Keova (live SaaS), TryOn (étude de cas MVP IA), Nodium (lab R&D agents IA).
+3. **Rétrocompatibilité :**
+   - Sécurisation de `FooterComponent.vue` pour supporter les projets sans URL externe.
+   - Sécurisation de `programs/Projets.ts` dans le terminal pour afficher `[status]` au lieu d'une URL vide.
+4. **Atmosphère cinétique (`HomeAtmosComponent.vue`) :**
+   - 3 auroras floutées (aubergine, orange, rouge) avec dérive lente fluide en CSS pur.
+   - Grille de points et scanlines CRT en overlay.
+   - Balisage `aria-hidden="true"` et neutralisation stricte sous `@media (prefers-reduced-motion: reduce)`.
+5. **Micro-curseur interactif (`ZCustomCursor.vue`) :**
+   - Suivi fluide (`dot` + `ring`) avec interpolation par `requestAnimationFrame`.
+   - Expansion (`.is-hot`) au survol des éléments interactifs (`a`, `button`, `[data-hot]`).
+   - Masquage sur écrans tactiles (`@media (hover: none)`) et sous `prefers-reduced-motion: reduce`.
+6. **Intégration & Gate Docker :**
+   - Intégration sur `app/pages/index.vue`.
+   - Validation 100% verte : `pnpm lint`, `pnpm typecheck`, `pnpm generate` (13 routes pré-rendues).
+
+### Completion Notes
+- Branche `feat/home-awwwards` initialisée à partir de `develop` (`baseline_commit: 42d7d7e888dbe812ec7d9d21a0f7c071ed3faeed`).
+- Données `SITE` alignées rigoureusement sur le profil Malt et la direction stratégique.
+- Arrière-plan atmosphérique cinétique et micro-curseur opérationnels et respectueux de l'accessibilité (`aria-hidden="true"`, `prefers-reduced-motion`).
+- Gate Docker 100% verte : 0 erreur ESLint/Stylelint, 0 erreur TypeScript, 13 routes statiques générées avec succès par Nitro.
+
+## File List
+
+- `app/data/site.ts` (MODIFIED)
+- `app/components/terminal/programs/Projets.ts` (MODIFIED)
+- `app/components/FooterComponent.vue` (MODIFIED)
+- `app/components/home/HomeAtmosComponent.vue` (NEW)
+- `app/components/ui/ZCustomCursor.vue` (NEW)
+- `app/pages/index.vue` (MODIFIED)
+- `docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+
+## Change Log
+
+- 2026-09-13 : Implémentation complète de la Story 11.1 (branche `feat/home-awwwards`, données `site.ts`, composant `HomeAtmosComponent.vue`, micro-curseur `ZCustomCursor.vue`, adaptation `FooterComponent.vue` et `Projets.ts`, validation Docker).
+
 ### References
 - [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
 - [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 5d9dab6..b28e1fb 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.1 ready-for-dev : Préparation de branche, site.ts & Atmosphère)"
+last_updated: "2026-09-13 (Story 11.1 review : Préparation de branche, site.ts & Atmosphère)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -119,7 +119,7 @@ development_status:
 
   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   epic-11: in-progress
-  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: ready-for-dev
+  11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: review
   11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog

exec
/bin/zsh -lc "rg -n \"(maltUrl|SITE\\.profile|SITE\\.skills|SITE\\.projects|<ZCard|ZCustomCursor|HomeAtmos|--orange-500|--aubergine-vivid|--term-red|--surface-0|--ink-1|--accent|@media \\(prefers-reduced-motion|data-hot|ftr__link--static|IProject)\" app docs/specs/spec-home-awwwards docs/project-context.md | head -240" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/project-context.md:116:  `ZCardFooter`), restylés via tokens et composés avec `<ZCard>`. (L'ancien
docs/project-context.md:134:  - Source unique de contenu : `app/data/site.ts` (`SITE.profile` / `SITE.skills` / `SITE.projects`, typés `IProfile`/`IProject`) — consommée par les programmes terminal (`skills`/`projets`/`contact`/`about`), `index.vue`, `about.vue`, `contact.vue` et `FooterComponent`. **Ne pas re-hardcoder** profil/skills/projets/email/ville ailleurs (DRY, consolidé en 8.2).
docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
docs/specs/spec-home-awwwards/sections-mapping.md:30:- **Accessibilité :** Balisage en `aria-hidden="true"`, et neutralisation totale des keyframes sous `@media (prefers-reduced-motion: reduce)`.
docs/specs/spec-home-awwwards/sections-mapping.md:55:- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
app/pages/about.vue:77:                <ZCard padded>
app/pages/about.vue:95:// stack en <ZTag>, formation en <ZCard>. Dark-first, tokens uniquement, prerender-safe.
app/pages/about.vue:100:const profile = SITE.profile;
app/pages/about.vue:101:const skills = SITE.skills;
app/pages/about.vue:145:    name: SITE.profile.name,
app/pages/about.vue:146:    jobTitle: SITE.profile.role,
app/pages/about.vue:201:  color: var(--accent);
app/pages/about.vue:312:  background: var(--surface-0);
app/pages/about.vue:313:  border: 2px solid var(--accent);
app/pages/about.vue:322:  color: var(--accent);
docs/specs/spec-home-awwwards/SPEC.md:64:  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.
docs/specs/spec-home-awwwards/SPEC.md:69:- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
app/data/site.ts:19:  maltUrl?: string;
app/data/site.ts:22:export interface IProject {
app/data/site.ts:37:  maltUrl: "https://www.malt.fr/profile/simonjouan",
app/data/site.ts:56:const projects: IProject[] = [
app/pages/blog/[...slug].vue:134:      name: SITE.profile.name,
app/pages/blog/[...slug].vue:140:      name: SITE.profile.name,
app/pages/blog/[...slug].vue:332:    color: var(--accent);
app/pages/blog/[...slug].vue:341:    border-left: 2px solid var(--accent);
app/pages/blog/index.vue:15:            <ZCard :as="NuxtLink" :to="article.path" interactive class="post">
app/pages/blog/index.vue:48:        <ZCard v-else-if="error" class="blog__notice" padded>
app/pages/blog/index.vue:64:        <ZCard v-else class="blog__notice" padded>
app/pages/blog/index.vue:123:      name: SITE.profile.name,
app/pages/blog/index.vue:129:      name: SITE.profile.name,
app/pages/services.vue:15:            <ZCard class="offer" :accent="offer.featured" :featured="offer.featured">
app/pages/services.vue:152:          name: SITE.profile.name,
app/pages/services.vue:237:  color: var(--accent);
app/pages/services.vue:238:  background: var(--accent-soft);
app/pages/services.vue:276:    color: var(--accent);
app/pages/services.vue:327:  color: var(--accent);
app/components/HeaderComponent.vue:196:  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
app/components/HeaderComponent.vue:223:    color: var(--accent);
app/components/HeaderComponent.vue:275:  color: var(--accent);
app/components/HeaderComponent.vue:404:  color: var(--accent);
app/components/HeaderComponent.vue:414:@media (prefers-reduced-motion: reduce) {
app/pages/contact.vue:17:            <ZCard v-if="sent" ref="sentCard" accent class="contact__sent" role="status" tabindex="-1">
app/pages/contact.vue:93:            <ZCard class="contact__infocard">
app/pages/contact.vue:115:            <ZCard class="contact__term">
app/pages/contact.vue:143:const contact = SITE.profile;
app/pages/contact.vue:161:const ERROR_MESSAGE = `L'envoi a échoué. Réessayez, ou écrivez-moi directement à ${SITE.profile.email}.`;
app/pages/contact.vue:265:    name: SITE.profile.name,
app/pages/contact.vue:266:    email: SITE.profile.email,
app/pages/contact.vue:269:      addressLocality: SITE.profile.city,
app/pages/contact.vue:367:    color: var(--accent);
app/pages/contact.vue:459:  border-color: var(--accent-2-soft);
app/app.vue:18:  name: SITE.profile.name,
app/app.vue:21:  email: SITE.profile.email,
app/app.vue:24:    addressLocality: SITE.profile.city,
app/pages/mentions-legales.vue:95:const profile = SITE.profile;
app/pages/mentions-legales.vue:168:    color: var(--accent);
app/components/FooterComponent.vue:24:            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
app/components/FooterComponent.vue:56:const profile = SITE.profile;
app/components/FooterComponent.vue:58:const projects = SITE.projects;
app/components/FooterComponent.vue:100:    color: var(--accent);
app/components/FooterComponent.vue:150:    color: var(--accent);
app/components/FooterComponent.vue:182:@media (prefers-reduced-motion: reduce) {
app/pages/confidentialite.vue:155:const profile = SITE.profile;
app/pages/confidentialite.vue:229:    color: var(--accent);
app/components/card/ZCardBody.vue:33:@media (prefers-reduced-motion: reduce) {
app/components/HexagonLinkComponent.vue:36:    background: var(--accent);
app/components/HexagonLinkComponent.vue:40:    outline: 2px solid var(--accent);
app/components/HexagonLinkComponent.vue:58:@media (prefers-reduced-motion: reduce) {
app/pages/index.vue:3:    <HomeAtmosComponent />
app/pages/index.vue:4:    <ZCustomCursor />
app/pages/index.vue:79:            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
app/pages/index.vue:105:            <ZCard
app/pages/index.vue:177:const projects = SITE.projects;
app/pages/index.vue:205:    name: SITE.profile.name,
app/pages/index.vue:206:    jobTitle: SITE.profile.role,
app/pages/index.vue:209:    email: SITE.profile.email,
app/pages/index.vue:212:      addressLocality: SITE.profile.city,
app/pages/index.vue:255:  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
app/pages/index.vue:257:    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
app/pages/index.vue:260:      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
app/pages/index.vue:295:    color: var(--accent);
app/pages/index.vue:329:  border: 1px solid var(--accent-2-soft);
app/pages/index.vue:358:  background: var(--term-red);
app/pages/index.vue:388:  color: var(--ink-1);
app/pages/index.vue:409:  color: var(--ink-1);
app/pages/index.vue:453:  color: var(--ink-1);
app/pages/index.vue:462:  color: var(--ink-1);
app/pages/index.vue:518:  color: var(--accent);
app/pages/index.vue:519:  background: var(--accent-soft);
app/pages/index.vue:543:  color: var(--accent);
app/pages/index.vue:659:@media (prefers-reduced-motion: reduce) {
app/components/home/HomeAtmosComponent.vue:40:  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
app/components/home/HomeAtmosComponent.vue:50:  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
app/components/home/HomeAtmosComponent.vue:60:  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
app/components/home/HomeAtmosComponent.vue:83:  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
app/components/home/HomeAtmosComponent.vue:119:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZInput.vue:145:  color: var(--accent);
app/components/ui/ZInput.vue:179:    border-color: var(--accent);
app/components/ui/ZInput.vue:233:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZButton.vue:177:  background: var(--accent);
app/components/ui/ZButton.vue:178:  color: var(--accent-text);
app/components/ui/ZButton.vue:179:  border-color: var(--accent);
app/components/ui/ZButton.vue:182:    background: var(--accent-hover);
app/components/ui/ZButton.vue:183:    border-color: var(--accent-hover);
app/components/ui/ZButton.vue:187:    background: var(--accent-active);
app/components/ui/ZButton.vue:188:    border-color: var(--accent-active);
app/components/ui/ZButton.vue:222:  border-color: var(--accent-2-soft);
app/components/ui/ZButton.vue:247:@media (prefers-reduced-motion: reduce) {
app/components/terminal/TerminalComponent.vue:339:  color: var(--ink-1);
app/components/terminal/TerminalComponent.vue:369:      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
app/components/terminal/TerminalComponent.vue:379:        outline: 2px solid var(--accent);
app/components/terminal/TerminalComponent.vue:445:      color: var(--ink-1);
app/components/ui/ZCustomCursor.vue:64:  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
app/components/ui/ZCustomCursor.vue:116:  background: var(--ink-1);
app/components/ui/ZCustomCursor.vue:132:    border-color: var(--accent);
app/components/ui/ZAvatar.vue:90:    0 0 0 4px var(--accent);
app/components/ui/ZBadge.vue:59:.zbadge--accent {
app/components/ui/ZBadge.vue:60:  background: var(--accent-soft);
app/components/ui/ZBadge.vue:61:  color: var(--accent);
app/components/terminal/programs/Projets.ts:10:    const items = SITE.projects
app/components/ui/ZCard.vue:9:      'zcard--accent': accent,
app/components/ui/ZCard.vue:106:.zcard--accent::before {
app/components/ui/ZCard.vue:111:  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
app/components/ui/ZCard.vue:115:  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
app/components/ui/ZCard.vue:117:  border-color: var(--accent-ring);
app/components/ui/ZCard.vue:121:@media (prefers-reduced-motion: reduce) {
app/components/terminal/programs/Contact.ts:10:    const statut = SITE.profile.available ? "disponible pour de nouveaux projets" : "indisponible pour le moment";
app/components/terminal/programs/Contact.ts:13:      `<li>email : ${SITE.profile.email}</li>`,
app/components/terminal/programs/Contact.ts:14:      `<li>ville : ${SITE.profile.city}</li>`,
app/assets/scss/base/_motion.scss:24:@media (prefers-reduced-motion: reduce) {
app/components/ui/ZTag.vue:130:    color: var(--accent);
app/components/ui/ZTag.vue:173:    color: var(--term-red);
app/components/ui/ZTag.vue:184:@media (prefers-reduced-motion: reduce) {
app/assets/scss/abstract/_root.scss:19:  --orange-500: hsl(24deg 94% 53%); // accent héros
app/assets/scss/abstract/_root.scss:27:  --aubergine-vivid: hsl(319deg 60% 30%); // variante saturée — glows/dégradés héros
app/assets/scss/abstract/_root.scss:32:  --surface-0: hsl(320deg 30% 6%); // fond de page, le plus profond
app/assets/scss/abstract/_root.scss:44:  --ink-1: hsl(30deg 18% 95%); // titres haut contraste
app/assets/scss/abstract/_root.scss:54:  --term-red: hsl(0deg 85% 64%);
app/assets/scss/abstract/_root.scss:71:  --bg-page: var(--surface-0);
app/assets/scss/abstract/_root.scss:77:  --text-strong: var(--ink-1);
app/assets/scss/abstract/_root.scss:84:  --accent: var(--orange-500);
app/assets/scss/abstract/_root.scss:85:  --accent-hover: hsl(24deg 100% 60%);
app/assets/scss/abstract/_root.scss:86:  --accent-active: var(--orange-600);
app/assets/scss/abstract/_root.scss:87:  --accent-text: var(--ink-on-accent);
app/assets/scss/abstract/_root.scss:88:  --accent-soft: hsl(24deg 94% 53% / 13%); // fond teinté
app/assets/scss/abstract/_root.scss:89:  --accent-ring: hsl(24deg 94% 53% / 45%);
app/assets/scss/abstract/_root.scss:90:  --accent-2: var(--aubergine-light); // accent secondaire
app/assets/scss/abstract/_root.scss:91:  --accent-2-soft: hsl(319deg 40% 30% / 28%);
app/assets/scss/abstract/_root.scss:191:  --ring-accent: 0 0 0 3px var(--accent-ring);
app/components/terminal/programs/About.ts:68:    ville: SITE.profile.city,
app/components/terminal/programs/About.ts:70:    email: SITE.profile.email,
app/assets/scss/base/_layout.scss:45:  color: var(--accent);
app/components/terminal/programs/Skills.ts:11:    return `Ma stack : ${SITE.skills.join(" · ")}`;

exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZCard.vue; printf '\\n--- index relevant ---\\n'; sed -n '1,230p' app/pages/index.vue; printf '\\n--- footer styles ---\\n'; sed -n '1,230p' app/components/FooterComponent.vue; printf '\\n--- tokens ---\\n'; sed -n '1,115p' app/assets/scss/abstract/_root.scss; printf '\\n--- specs ---\\n'; sed -n '1,120p' docs/specs/spec-home-awwwards/SPEC.md" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
    }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, le contenu est le héros.
// Portée de docs/design_system/components/core/Card.jsx (pas de copie JS :
// le CSS d'injection `ensureStyles()` devient un <style scoped> token-only).
import type { Component } from "vue";
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Hover lift + bordure plus claire. @default false */
  interactive?: boolean;
  /** Barre d'accent orange→aubergine en haut. @default false */
  accent?: boolean;
  /** Anneau de glow orange (offre mise en avant). @default false */
  featured?: boolean;
  /** Padding interne `--space-6`. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
});

const attrs = useAttrs();
// `as` accepte une balise native ("div", "article") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const rootAttrs = computed(() => {
  if (!isNativeButton.value) {
    return attrs;
  }

  return {
    ...attrs,
    type: typeof attrs.type === "string" ? attrs.type : "button",
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
.zcard {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2), var(--shadow-hairline);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-standard);
}

.zcard--pad {
  padding: var(--space-6);
}

.zcard--interactive {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-3), var(--shadow-hairline);
  }

  // Focus clavier : anneau d'accent visible. Quand la carte est rendue en lien
  // (`as="a"`, ex. cartes projet story 3.3), elle est focusable — sans cette règle,
  // aucun indicateur. Sans effet sur les cartes non focusables (div).
  &:focus-visible {
    // Outline transparent → rendu en couleur système sous forced-colors (où les
    // box-shadow disparaissent) ; le ring box-shadow reste le focus visuel normal.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.zcard--accent::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
}

.zcard--featured {
  // Bordure orange translucide de mise en avant : --accent-ring (token le plus proche
  // de la réf. hsl(24 94% 53% / 0.35), même teinte accent en translucide).
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>

--- index relevant ---
<template>
  <main class="home">
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche, CTA, tags -->
          <div class="anim hero__text">
            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
            <p class="hero__sub">{{ tagline }}</p>
            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Démarrer un projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
            </div>
            <ul class="hero__tags">
              <li v-for="tag in tags" :key="tag">
                <ZTag>{{ tag }}</ZTag>
              </li>
            </ul>
          </div>

          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
          <div class="anim hero__term-col">
            <div class="hero-term">
              <div class="hero-term__bar">
                <span class="hero-term__dots" aria-hidden="true">
                  <span class="hero-term__dot hero-term__dot--close" />
                  <span class="hero-term__dot hero-term__dot--min" />
                  <span class="hero-term__dot hero-term__dot--max" />
                </span>
                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
              </div>

              <div class="hero-term__body">
                <template v-for="row in terminalRows" :key="row.id">
                  <p class="hero-term__line" aria-hidden="true">
                    <span class="prm"
                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
                      ><span class="prm__cmd">{{ row.cmd }}</span></span
                    >
                  </p>
                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
                </template>

                <button
                  type="button"
                  class="hero-term__open"
                  aria-label="Ouvrir le terminal interactif"
                  aria-haspopup="dialog"
                  @click="openTerminal"
                >
                  <span class="prm"
                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
                    ><span class="prm__caret" aria-hidden="true"
                  /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    <section class="section">
      <div class="container">
        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
        <h2 class="section__title">Trois façons de travailler ensemble</h2>
        <ul class="grid-3">
          <li v-for="service in services" :key="service.id">
            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
              <h3 class="offer__title">{{ service.title }}</h3>
              <p class="offer__desc">{{ service.desc }}</p>
              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
                En savoir plus →
              </NuxtLink>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>

    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    <section class="section section--sunken">
      <div class="container">
        <div class="statrow">
          <div v-for="stat in stats" :key="stat.id" class="stat">
            <b>{{ stat.value }}</b>
            <span>{{ stat.label }}</span>
          </div>
        </div>

        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
        <ul class="grid-2 projects">
          <li v-for="project in projects" :key="project.name">
            <ZCard
              class="project"
              interactive
              :as="project.url ? ZExternalLink : 'div'"
              :href="project.url || undefined"
              :rel="project.url ? 'noopener noreferrer' : undefined"
            >
              <div class="project__head">
                <h3 class="project__name">{{ project.name }}</h3>
                <span class="project__role">{{ project.role }}</span>
              </div>
              <p class="prose project__desc">{{ project.desc }}</p>
              <ul class="hero__tags">
                <li v-for="tag in project.tags" :key="tag">
                  <ZTag>{{ tag }}</ZTag>
                </li>
              </ul>
            </ZCard>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
import { NuxtLink, ZExternalLink } from "#components";
import { useTerminal } from "~/composables/useTerminal";
import { SITE } from "~/data/site";

// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];

// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
const services = [
  {
    id: "wordpress",
    icon: "wp",
    title: "WordPress sur-mesure",
    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
    featured: false,
  },
  {
    id: "apps",
    icon: "code",
    title: "Applications web",
    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
    featured: true,
  },
  {
    id: "ia",
    icon: "spark",
    title: "IA & automatisation",
    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
    featured: false,
  },
];

// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
const stats = [
  { id: "stat-1", value: "8+", label: "ans dans la tech" },
  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
];

// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
const projects = SITE.projects;

// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
const terminalRows = [
  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
];

// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
// restylisation du terminal lui-même relève d'Epic 8.
const { open: openTerminal } = useTerminal();

const siteUrl = useSiteUrl();
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simon Jouan — Développeur web freelance",
    url: siteUrl,
    description: tagline,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.profile.name,
    jobTitle: SITE.profile.role,
    url: siteUrl,
    image: `${siteUrl}/images/portrait.jpeg`,
    email: SITE.profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.profile.city,
      addressCountry: "FR",
    },
  },
];

usePageSeo({
  title: "Simon Jouan — Développeur web freelance & IA",
  description:
    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
  path: "/",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: homeJsonLd,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */

--- footer styles ---
<template>
  <footer class="ftr">
    <div class="ftr__container">
      <div class="ftr__in">
        <div class="ftr__brand-col">
          <NuxtLink to="/" class="ftr__brand">
            <ZIcon name="gem" class="ftr__logo" />
            <b>jouan.ovh</b>
          </NuxtLink>
          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
        </div>

        <nav class="ftr__col" aria-label="Navigation du pied de page">
          <h2 class="ftr__title">// Navigation</h2>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="ftr__link">{{ item.label }}</NuxtLink>
        </nav>

        <div class="ftr__col">
          <h2 class="ftr__title">// Projets</h2>
          <template v-for="project in projects" :key="project.name">
            <ZExternalLink v-if="project.url" :href="project.url" rel="noopener noreferrer" class="ftr__link">{{
              project.name
            }}</ZExternalLink>
            <span v-else class="ftr__link ftr__link--static">{{ project.name }}</span>
          </template>
        </div>

        <div class="ftr__col">
          <h2 class="ftr__title">// Réseaux</h2>
          <LinkListComponent />
        </div>
      </div>

      <div class="ftr__bottom">
        <span>© {{ year }} Simon Jouan — jouan.ovh</span>
        <span class="ftr__term">anon.@jouan.ovh:~$ <span class="ftr__cmd">echo "merci de votre visite"</span></span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LinkListComponent from "~/components/LinkListComponent.vue";
import { SITE } from "~/data/site";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/confidentialite", label: "Confidentialité" },
  { to: "/mentions-legales", label: "Mentions légales" },
];

const profile = SITE.profile;
// Projets — source unique `app/data/site.ts` (le footer n'affiche que nom + URL).
const projects = SITE.projects;

const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) portée depuis Footer.jsx/kit.css */
.ftr {
  margin-top: auto;
  background: var(--surface-1);
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-12) 0 var(--space-8);
}

.ftr__container {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.ftr__in {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: flex-start;
  justify-content: space-between;
}

.ftr__brand-col {
  max-width: 300px;
}

.ftr__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  text-decoration: none;

  .ftr__logo {
    font-size: 22px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
  }

  // Lien focusable (logo + nom) : anneau DS cohérent avec le reste du châssis.
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-sm);
    box-shadow: var(--ring-accent);
  }
}

.ftr__tagline {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.ftr__col {
  display: flex;
  flex-direction: column;
}

.ftr__title {
  margin: 0 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.ftr__link {
  display: block;
  padding: var(--space-1) 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-body);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-standard);

  &:hover {
    color: var(--accent);
  }

  // Anneau de focus DS (les liens du footer n'avaient que l'outline UA par défaut).
  &:focus-visible {
    outline: 2px solid transparent; // forced-colors : rendu en couleur système
    outline-offset: 2px;
    border-radius: var(--radius-xs);
    box-shadow: var(--ring-accent);
  }
}

.ftr__bottom {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: space-between;
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);

  // Contraste (story 9.2) : --text-faint (~3:1 sur la surface footer) → --text-muted
  // pour une ligne de copyright lisible (≥ 4.5:1). Token, pas de couleur en dur.
  color: var(--text-muted);
  border-top: 1px solid var(--border-subtle);
}

.ftr__cmd {
  color: var(--term-green);
}

@media (prefers-reduced-motion: reduce) {
  .ftr__link {
    transition: none;
  }
}
</style>

--- tokens ---
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

--- specs ---
---
id: SPEC-home-awwwards
companions:
  - sections-mapping.md
  - ../../contexte_malt.md
  - ../../direction_strategique_site.md
  - ../../project-context.md
sources:
  - ../../design_system/ui_kits/jouan-site/Home - Awwwards.html
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Refonte immersive et repositionnement commercial de la page d'accueil (Home Awwwards)

## Why

Transformer la page d'accueil de `jouan.ovh` en un **entonnoir de conversion commercial de haut niveau (« Awwwards level »)** pour positionner Simon Jouan comme **Développeur Full Stack TypeScript spécialisé Nuxt / NestJS pour applications web et SaaS**.
Cette refonte traduit la puissance visuelle de `Home - Awwwards.html` (auroras cinétiques, séquence de boot `jouan.os`, terminal hero interactif, marquee de stack, cartes en relief) tout en alignant rigoureusement le message avec le profil Malt officiel (`contexte_malt.md`) et la stratégie commerciale (`direction_strategique_site.md`) :
1. **Clarté immédiate du rôle :** Développeur Full Stack TypeScript (Nuxt / NestJS / PostgreSQL), capable de concevoir et faire évoluer des produits web et SaaS de bout en bout.
2. **Preuves concrètes avant discours marketing :** Remplacement des anciens projets vitrines par le trio SaaS aligné avec Malt : **Keova** (pièce maîtresse ERP équestre), **TryOn** (SaaS IA générative) et **Nodium** (laboratoire d'agents IA), appuyés par l'expertise qualité logicielle issue de Kidizz.
3. **Maintien de l'architecture multi-pages :** Conserver les routes dédiées existantes (`/services`, `/about`, `/blog`, `/contact`) au lieu du one-page à ancres intra-page `#` de la maquette brute.

## Capabilities

- id: CAP-1
  intent: Le visiteur arrivant sur la page d'accueil perçoit un arrière-plan atmosphérique immersif composé d'auroras colorées dynamiques, d'une grille de points et de scanlines terminales.
  success: La pile atmosphérique s'affiche de manière fluide en pur CSS sans altérer les performances de scroll, et neutralise tout mouvement sous `prefers-reduced-motion: reduce`.

- id: CAP-2
  intent: Le visiteur accédant à la page d'accueil assiste à une séquence de boot interactive optionnelle (`jouan.os`), contournable instantanément.
  success: L'overlay de démarrage affiche la montée en charge progressive, s'efface automatiquement après 1 à 1.5s ou sur clic / touche Escape, ne s'exécute pas sous `prefers-reduced-motion: reduce`, et déclenche la frappe du terminal hero.

- id: CAP-3
  intent: Le visiteur visualise un hero commercial percutant combinant le titre officiel (« Développeur Full Stack TypeScript — Nuxt / NestJS »), un pitch orienté création/évolution SaaS, un badge de disponibilité avec lien accessible vers le profil Malt, et une fenêtre terminal hero simulant la frappe de commandes clés.
  success: Le hero communique instantanément le rôle et la stack clé (Nuxt, NestJS, PostgreSQL), propose un CTA primaire vers `/contact` (« Discuter de votre projet »), un CTA secondaire vers `/about` (« Voir le parcours & CV »), un lien externe vers Malt (`<ZExternalLink>`), et déroule la séquence de frappe terminale avec caret natif.

- id: CAP-4
  intent: Le visiteur observe un bandeau défilant continu (marquee) exposant la stack technique moderne prioritaire sans dispersion legacy.
  success: Le ruban défile en boucle continue avec la stack cible (TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API), se fige au survol de la souris, et s'arrête complètement sans débordement horizontal sous `prefers-reduced-motion: reduce`.

- id: CAP-5
  intent: Le visiteur découvre sur la home une vitrine des trois offres de services ciblées sous forme de cartes structurées invitant à approfondir.
  success: Les trois cartes de service (1. Création d'applications web & SaaS, 2. Développement Full Stack TypeScript, 3. Évolution & architecture applicative) affichent numéro, résumé de valeur et compétences clés, avec des liens cliquables guidant l'utilisateur vers `/services`.

- id: CAP-6
  intent: Le visiteur consulte les preuves concrètes de réalisations à travers les projets phares alignés avec le profil Malt, accompagnés des statistiques clés de parcours.
  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).

- id: CAP-7
  intent: Le visiteur accède à une mise en avant des derniers articles de veille technique et d'ingénierie logicielle.
  success: La section journal présente la carte vedette et les vignettes secondaires issues du blog, avec un lien global redirigeant vers l'index `/blog`.

- id: CAP-8
  intent: Le visiteur en bas de page dispose d'un bloc d'appel à l'action orienté mission invitant à démarrer une collaboration, avec accès direct au formulaire et à Malt.
  success: Le bloc CTA offre un bouton d'action principal vers `/contact` (« Discuter de votre projet »), un lien vers le profil Malt (`<ZExternalLink>`), et un lien secondaire vers `/about`, stylés selon les tokens du Design System.

- id: CAP-9
  intent: Le visiteur naviguant depuis le menu du header ou les liens de la home parcourt des routes complètes indépendantes.
  success: Les éléments de navigation du header et les liens d'approfondissement ciblent les routes Nuxt `/services`, `/about`, `/blog` et `/contact`, sans repli vers des ancres intra-page `#`.

- id: CAP-10
  intent: Le visiteur sur ordinateur de bureau bénéficie d'un micro-curseur interactif fluide (`dot` + `ring`) réagissant aux zones cliquables.
  success: Le curseur custom est désactivé sur les appareils tactiles (`@media (hover: none)`), n'altère pas le curseur système natif en cas d'erreur JS, et s'agrandit au survol des interactifs marqués `data-hot`.

## Constraints

- Le développement de cette refonte doit s'effectuer exclusivement sur une branche dédiée issue de `develop` (ex. `feat/home-awwwards`), préservant la branche `main` de production.
- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
- Tous les styles doivent consommer les tokens CSS globaux (`var(--token)`) et les primitives partagées du Design System (`ZButton`, `ZCard`, `ZExternalLink`, `ZTag`).
- Tout lien ouvrant un nouvel onglet (Keova, Malt, GitHub, etc.) DOIT utiliser la primitive `<ZExternalLink>`.
- Les pages secondaires existantes (`/services`, `/about`, `/blog`, `/contact`, `/confidentialite`, `/mentions-legales`) doivent rester des routes distinctes ; la home sert de portail vitrine et ne doit pas devenir une One-Page.
- Respect strict de `prefers-reduced-motion: reduce` : animations neutralisées à `0.01ms`, auroras figées, marquee statique, boot overlay passé instantanément. Seul le caret de frappe du terminal est autorisé à clignoter (CAP-11).
- Compatibilité statique SSG (Nitro) : tout accès au DOM (`document`, `window`, `sessionStorage`, `IntersectionObserver`, `matchMedia`) doit être encapsulé dans `onMounted()` ou protégé par `import.meta.client`.

## Non-goals

- Transformer le site `jouan.ovh` en une application One-Page à scroll vertical exclusif avec ancres intra-page.
- Présenter WordPress, PHP legacy ou la QA manuelle comme des offres commerciales de premier niveau sur la home.
- Modifier l'architecture ou le comportement interne de l'easter-egg terminal draggable (`components/terminal/`).
- Introduire des bibliothèques JavaScript externes lourdes (GSAP, Three.js, Canvas shaders) pour réaliser les effets atmosphériques et cinétiques.
- Modifier les schémas de collections `@nuxt/content` ou l'API de contact Web3Forms.

## Success signal

- La page d'accueil [`app/pages/index.vue`](file:///Users/simon/dev/jouan.ovh/app/pages/index.vue) communique immédiatement le positionnement « Développeur Full Stack TypeScript — Nuxt / NestJS », restitue l'atmosphère immersive et la fluidité visuelle de `Home - Awwwards.html`, expose les projets Keova, TryOn et Nodium ainsi que le lien vers le profil Malt, assure une navigation fluide vers les routes enfants, et valide la suite de contrôle Docker (`docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`) avec 13 routes pré-rendues sans erreur.

exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZExternalLink.vue; printf '\\n--- site consumers ---\\n'; rg -n \"profile\\.role|profile\\.city|profile\\.maltUrl|skills|projects|tagline|terminalRows|stat-1|Valognes|patio-conseil|8\\+|11 ans\" app/pages app/components app/data docs/specs/spec-home-awwwards | head -320; printf '\\n--- git review artifact context ---\\n'; git status --short; git diff --check -- docs/implementation-artifacts/code-reviews/11-1/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <a :href="href" :rel="computedRel" target="_blank">
    <slot />
    <span class="screen-reader-text">{{ computedSrText }}</span>
  </a>
</template>

<script setup lang="ts">
// Primitive lien externe accessible (DS) — force target="_blank", rel sécurisé ("noopener" garanti),
// et adjoint un libellé sr-only « (ouvre dans un nouvel onglet) » sans impacter le rendu visuel.
// (Story 10.3 — WCAG G201 / FR13).
import { computed } from "vue";

interface Props {
  /** URL externe cible. */
  href: string;
  /**
   * Relation de lien. Par défaut "noopener" (sécurité window.opener).
   * Peut être étendu à "noopener noreferrer" si nécessaire. "noopener" reste garanti.
   * @default "noopener"
   */
  rel?: string;
  /** Libellé accessible alternatif pour l'annonce sr-only. */
  srText?: string;
}

const DEFAULT_SR_TEXT = " (ouvre dans un nouvel onglet)";

const props = withDefaults(defineProps<Props>(), {
  rel: "noopener",
  srText: DEFAULT_SR_TEXT,
});

const computedRel = computed(() => {
  const custom = props.rel?.trim();
  if (!custom) {
    return "noopener";
  }
  const tokens = new Set(custom.split(/\s+/));
  tokens.add("noopener");
  return Array.from(tokens).join(" ");
});

const computedSrText = computed(() => {
  return props.srText && props.srText.trim() ? props.srText : DEFAULT_SR_TEXT;
});
</script>

--- site consumers ---
docs/specs/spec-home-awwwards/sections-mapping.md:16:| **Marquee Stack** | Défilé continu des technologies prioritaires | Stack moderne ciblée : TypeScript, Nuxt, Vue.js, NestJS, Node.js, PostgreSQL, Stripe, Docker, TypeORM, Cypress, REST API. | Ruban visuel continu alimenté par `SITE.skills`. |
docs/specs/spec-home-awwwards/sections-mapping.md:19:| **Statistiques clés** | Réassurance et crédibilité | 11 ans d'expérience web · 2 SaaS fondés / opérés · Culture QA & automatisation E2E. | Compteurs visuels intégrés à la section projets. |
docs/specs/spec-home-awwwards/sections-mapping.md:55:- **Contenu :** Ruban continu affichant les technologies phares de `SITE.skills` :
app/data/site.ts:41:const skills: string[] = [
app/data/site.ts:56:const projects: IProject[] = [
app/data/site.ts:81:export const SITE = { profile, skills, projects } as const;
app/pages/about.vue:13:            <p class="about__role">{{ profile.role }}</p>
app/pages/about.vue:16:              {{ profile.city }}
app/pages/about.vue:43:                <li v-for="skill in skills" :key="skill">
app/pages/about.vue:101:const skills = SITE.skills;
app/pages/about.vue:135:  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";
app/pages/about.vue:146:    jobTitle: SITE.profile.role,
docs/specs/spec-home-awwwards/SPEC.md:48:  success: Les projets présentés valorisent Keova (pièce maîtresse SaaS en production avec lien live `<ZExternalLink>`), TryOn (étude de cas d'ingénierie SaaS & IA / MVP livré, sans lien mort vers un domaine inactif) et Nodium (lab technique agents IA), chacun avec rôle, stack et description orientée valeur, accompagnés des 3 compteurs statistiques clés (11 ans d'expérience, SaaS fondés/opérés, culture qualité).
docs/specs/spec-home-awwwards/SPEC.md:69:- Les données partagées (`SITE.profile`, `SITE.skills`, `SITE.projects` dans `app/data/site.ts`) doivent être mises à jour pour refléter l'identité Malt et les nouveaux projets (Keova, TryOn, Nodium), sans jamais de hardcoding local dans la page.
app/components/FooterComponent.vue:10:          <p class="ftr__tagline">{{ profile.role }}. {{ profile.city }}.</p>
app/components/FooterComponent.vue:20:          <template v-for="project in projects" :key="project.name">
app/components/FooterComponent.vue:58:const projects = SITE.projects;
app/components/FooterComponent.vue:119:.ftr__tagline {
app/pages/contact.vue:269:      addressLocality: SITE.profile.city,
app/pages/confidentialite.vue:19:              {{ profile.role }} — {{ profile.city }}.<br />
app/pages/mentions-legales.vue:20:              Activité : {{ profile.role }}<br />
app/pages/mentions-legales.vue:21:              Localisation : {{ profile.city }}<br />
app/components/terminal/programs/Projets.ts:10:    const items = SITE.projects
app/pages/index.vue:13:            <p class="hero__sub">{{ tagline }}</p>
app/pages/index.vue:41:                <template v-for="row in terminalRows" :key="row.id">
app/pages/index.vue:103:        <ul class="grid-2 projects">
app/pages/index.vue:104:          <li v-for="project in projects" :key="project.name">
app/pages/index.vue:139:const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
app/pages/index.vue:144:// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
app/pages/index.vue:171:  { id: "stat-1", value: "8+", label: "ans dans la tech" },
app/pages/index.vue:177:const projects = SITE.projects;
app/pages/index.vue:182:const terminalRows = [
app/pages/index.vue:185:  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
app/pages/index.vue:200:    description: tagline,
app/pages/index.vue:206:    jobTitle: SITE.profile.role,
app/pages/index.vue:212:      addressLocality: SITE.profile.city,
app/pages/index.vue:221:    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
app/pages/index.vue:599:.projects {
app/components/terminal/programs/Contact.ts:14:      `<li>ville : ${SITE.profile.city}</li>`,
app/components/terminal/programs/Skills.ts:7:const skills: IProgram = {
app/components/terminal/programs/Skills.ts:8:  command: "skills",
app/components/terminal/programs/Skills.ts:11:    return `Ma stack : ${SITE.skills.join(" · ")}`;
app/components/terminal/programs/Skills.ts:15:export default skills;
app/components/terminal/programs/index.ts:6:export { default as skills } from "./Skills";
app/components/terminal/programs/ProgramManager.ts:2:import { about, clear, contact, helloWorld, help, newTerminal, projets, skills, systemInfo } from "./";
app/components/terminal/programs/ProgramManager.ts:45:programManager.add(skills);
app/components/terminal/programs/About.ts:68:    ville: SITE.profile.city,

--- git review artifact context ---
 M app/components/FooterComponent.vue
 A app/components/home/HomeAtmosComponent.vue
 M app/components/terminal/programs/Projets.ts
 A app/components/ui/ZCustomCursor.vue
 M app/data/site.ts
 M app/pages/index.vue
 M docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md
 M docs/implementation-artifacts/sprint-status.yaml
?? docs/implementation-artifacts/code-reviews/11-1/

exec
/bin/zsh -lc "rg -n \"z-index|position: relative|\\.home|hero__grad|main\" app/assets app/layouts app/pages/index.vue app/components | head -220; printf '\\n--- about seo excerpt ---\\n'; sed -n '118,155p' app/pages/about.vue; printf '\\n--- index style beginning/end ---\\n'; sed -n '230,340p' app/pages/index.vue; sed -n '640,675p' app/pages/index.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
app/pages/index.vue:2:  <main class="home">
app/pages/index.vue:6:    <section class="hero hero__grad">
app/pages/index.vue:127:  </main>
app/pages/index.vue:150:    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
app/pages/index.vue:231:.home {
app/pages/index.vue:246:// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
app/pages/index.vue:248:  position: relative;
app/pages/index.vue:252:.hero__grad {
app/pages/index.vue:255:  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
app/pages/index.vue:267:  position: relative;
app/pages/index.vue:268:  z-index: 1;
app/pages/index.vue:335:  position: relative;
app/layouts/default.vue:21:  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
app/components/HeaderComponent.vue:192:  z-index: 50;
app/components/HeaderComponent.vue:314:  z-index: 40;
app/components/HeaderComponent.vue:359:    z-index: 45;
app/assets/fonts/Ubuntu_Mono/UFL.txt:10:any other licence. The requirement for fonts to remain under this
app/assets/fonts/Ubuntu_Mono/UFL.txt:77:under any other licence. The requirement for fonts to remain under this
app/components/MainComponent.vue:2:  <main>
app/components/MainComponent.vue:4:  </main>
app/components/MainComponent.vue:16:main {
app/components/MainComponent.vue:17:  --main-space-inset: #{space.$space-inset-16x};
app/components/MainComponent.vue:19:  padding: var(--main-space-inset);
app/assets/scss/base/_layout.scss:6://  Mutualisées ici (chargées par main.scss) plutôt que redéclarées
app/components/home/HomeAtmosComponent.vue:22:  z-index: 0;
app/components/terminal/interfaces/ITerminalConfig.ts:5:  domainName?: string;
app/assets/scss/base/_reset.scss:61: * Render the `main` element consistently in IE.
app/assets/scss/base/_reset.scss:63:main {
app/assets/scss/base/_reset.scss:152:  position: relative;
app/assets/scss/base/_reset.scss:590:  z-index: 100000;
app/components/ui/ZAvatar.vue:61:  position: relative;
app/components/ui/ZInput.vue:210:  position: relative;
app/components/ui/ZCustomCursor.vue:101:  z-index: 90;
app/components/ui/ZCard.vue:68:  position: relative;
app/components/WindowWrapperComponent.vue:292:  position: relative;
app/components/WindowWrapperComponent.vue:294:  z-index: 100;
app/components/WindowWrapperComponent.vue:303:    z-index: 1;
app/components/terminal/TerminalComponent.vue:25:        <div class="header-text">{{ defaultConfig.domainName }}</div>
app/components/terminal/TerminalComponent.vue:36:              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
app/components/terminal/TerminalComponent.vue:43:          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
app/components/terminal/TerminalComponent.vue:105:  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
app/components/terminal/TerminalComponent.vue:333:  z-index: 1000;
app/components/terminal/TerminalComponent.vue:345:    position: relative;
app/components/terminal/TerminalComponent.vue:346:    z-index: 1;

--- about seo excerpt ---
  {
    date: "07/2007 — 05/2019",
    role: "Métrologue",
    org: "A+ Métrologie / Trescal",
    desc: "Technicien métrologue multi-grandeur, suppléant COFRAC électricité-magnétisme.",
  },
];

// Formation (data.js → S.degrees). `name` sert de clé v-for stable (unique).
const degrees = [
  { date: "2017 — 2018", name: "Développeur d'application — PHP / Symfony", school: "OpenClassrooms" },
  { date: "1999 — 2001", name: "BTS CIRA", school: "Lycée A. de Tocqueville, Cherbourg" },
];

// Métadonnées de la page. Voix 1re personne cohérente (cf. contrainte Langue & voix).
const pageTitle = "À propos — jouan.ovh";
const pageDescription =
  "Développeur web freelance à Valognes, je conçois des applications en PHP/Symfony, des sites WordPress sur-mesure et des produits Node.js / Nest.js / Nuxt.js — voici mon parcours.";

const siteUrl = useSiteUrl();
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: pageTitle,
  url: `${siteUrl}/about`,
  mainEntity: {
    "@type": "Person",
    name: SITE.profile.name,
    jobTitle: SITE.profile.role,
    url: siteUrl,
    image: `${siteUrl}/images/portrait.jpeg`,
  },
};

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: "/about",

--- index style beginning/end ---
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
.home {
  display: block;
}

// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
.anim {
  animation: fade-rise var(--dur-slow) var(--ease-out) both;
}

.hero__term-col {
  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
  animation-delay: 80ms;
}

// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
.hero {
  position: relative;
  overflow: hidden;
}

.hero__grad {
  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
  background:
    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(
      700px 500px at 0% 110%,
      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
      transparent 60%
    ),
    var(--bg-page);
}

.hero__in {
  position: relative;
  z-index: 1;

  // padding-block uniquement : le gutter horizontal vient de .container
  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
  padding-block: var(--space-20);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-12);
  align-items: center;
}

// .section / .container / .eyebrow / .prose : primitives de layout globales
// (app/assets/scss/base/_layout.scss) — non redéclarées ici.

// ---- Colonne texte ----
.hero__title {
  font-family: var(--font-mono);
  font-size: var(--fs-6xl);
  font-weight: var(--fw-light);
  letter-spacing: var(--ls-tight);
  color: var(--text-strong);

  em {
    font-style: normal;
    color: var(--accent);
  }
}

.hero__sub {
  max-width: 46ch;
  margin: var(--space-5) 0 var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--fs-lg);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).

// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
// l'identique la spec du composant DS et n'ont pas de token d'espacement
// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
// scrollbar parasite si le rendu mono dépasse de quelques px.
.hero-term {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  overflow: hidden;
  border: 1px solid var(--accent-2-soft);
  border-radius: var(--radius-sm);
  box-shadow: var(--glow-terminal);
}

.hero-term__bar {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-2);
  height: 30px;
  font-size: var(--fs-sm);
}

// ---- Responsive (cf. kit.css @media max-width: 900px) ----
@media (width <= 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: var(--fs-4xl);
  }

  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anim,
  .prm__caret {
    animation: none;
  }
}
</style>

codex
I found multiple concrete inconsistencies beyond the new effects: stale commercial copy and SEO, an unused Malt field, non-interactive cards styled as links, semantic regressions, token violations, and performance/layering risks. I’m consolidating these into description-only findings now.
The diff and its relevant consumers/spec have been inspected; concrete findings are ready to report.
  ✓ Read the adversarial review skill instructions
  ✓ Inspect the supplied diff and identify concrete issues
  ✓ Return at least ten description-only findings
codex
- `app/pages/index.vue` still presents the old “développeur web freelance” positioning and legacy WordPress/PHP tagline instead of the new Full Stack TypeScript role.
- The homepage tags remain hardcoded to `php`, `symfony`, `wordpress`, `nest.js`, and `nuxt.js`, so they contradict `SITE.skills`.
- The decorative terminal still advertises the old stack and `patio-conseil.fr`, which no longer exists in `SITE.projects`.
- Homepage SEO metadata still says “Valognes” and promotes PHP/Symfony and WordPress, contradicting the updated profile and visible project data.
- `app/pages/about.vue` retains the old Valognes and legacy-stack description, leaving secondary-page SEO inconsistent with the centralized profile.
- The homepage statistics remain `8+ ans`, `3 stacks`, and `1 SaaS`, despite the specification requiring different updated credibility signals.
- `profile.maltUrl` is added to `site.ts` but is never rendered, so the promised Malt conversion path is absent.
- TryOn and Nodium have no local case-study route or actionable destination, leaving their detailed claims presented without supporting proof.
- URL-less project cards are still marked `interactive` but render as non-focusable `<div>` elements, creating a misleading clickable appearance and an accessibility gap.
- The repeated project entries in the footer are not represented as a semantic `<ul>`/`<li>` list.
- Non-link project names in the footer retain the link styling and hover behavior, visually implying interactivity where none exists.
- `Projets.ts` uses mutually exclusive metadata formatting, so any project with both a URL and a status silently loses its status in the terminal output.
- The new skills list does not exactly match the canonical stack contract: labels and ordering differ, and `vitest` is added despite not being part of the specified target list.
- `HomeAtmosComponent.vue` hardcodes color values in the dot grid, scanlines, and mask instead of consuming design-system tokens.
- The fixed atmosphere has `z-index: 0`, while only the hero content establishes a higher stacking level; later unpositioned sections can therefore be painted beneath the atmosphere overlays.
- Three large blurred layers permanently use `will-change: transform`, combined with large viewport-sized filters and blend modes, which can create unnecessary GPU memory and rendering costs.
- The atmosphere relies on unprefixed `mask-image` without a fallback, so the dot-grid fade can disappear in browsers with incomplete mask support.
- `ZCustomCursor.vue` never handles `pointerleave`, allowing the cursor ring to remain visible and “hot” after the pointer leaves the document.
- The cursor starts a perpetual `requestAnimationFrame` loop for the entire mounted lifetime, even when the pointer is stationary, increasing CPU and battery usage.
- The implementation record claims a completely green Docker gate and full alignment, but provides no validation evidence and is contradicted by the stale homepage, SEO, and terminal content still present in the diff.
tokens used
52 426
- `app/pages/index.vue` still presents the old “développeur web freelance” positioning and legacy WordPress/PHP tagline instead of the new Full Stack TypeScript role.
- The homepage tags remain hardcoded to `php`, `symfony`, `wordpress`, `nest.js`, and `nuxt.js`, so they contradict `SITE.skills`.
- The decorative terminal still advertises the old stack and `patio-conseil.fr`, which no longer exists in `SITE.projects`.
- Homepage SEO metadata still says “Valognes” and promotes PHP/Symfony and WordPress, contradicting the updated profile and visible project data.
- `app/pages/about.vue` retains the old Valognes and legacy-stack description, leaving secondary-page SEO inconsistent with the centralized profile.
- The homepage statistics remain `8+ ans`, `3 stacks`, and `1 SaaS`, despite the specification requiring different updated credibility signals.
- `profile.maltUrl` is added to `site.ts` but is never rendered, so the promised Malt conversion path is absent.
- TryOn and Nodium have no local case-study route or actionable destination, leaving their detailed claims presented without supporting proof.
- URL-less project cards are still marked `interactive` but render as non-focusable `<div>` elements, creating a misleading clickable appearance and an accessibility gap.
- The repeated project entries in the footer are not represented as a semantic `<ul>`/`<li>` list.
- Non-link project names in the footer retain the link styling and hover behavior, visually implying interactivity where none exists.
- `Projets.ts` uses mutually exclusive metadata formatting, so any project with both a URL and a status silently loses its status in the terminal output.
- The new skills list does not exactly match the canonical stack contract: labels and ordering differ, and `vitest` is added despite not being part of the specified target list.
- `HomeAtmosComponent.vue` hardcodes color values in the dot grid, scanlines, and mask instead of consuming design-system tokens.
- The fixed atmosphere has `z-index: 0`, while only the hero content establishes a higher stacking level; later unpositioned sections can therefore be painted beneath the atmosphere overlays.
- Three large blurred layers permanently use `will-change: transform`, combined with large viewport-sized filters and blend modes, which can create unnecessary GPU memory and rendering costs.
- The atmosphere relies on unprefixed `mask-image` without a fallback, so the dot-grid fade can disappear in browsers with incomplete mask support.
- `ZCustomCursor.vue` never handles `pointerleave`, allowing the cursor ring to remain visible and “hot” after the pointer leaves the document.
- The cursor starts a perpetual `requestAnimationFrame` loop for the entire mounted lifetime, even when the pointer is stationary, increasing CPU and battery usage.
- The implementation record claims a completely green Docker gate and full alignment, but provides no validation evidence and is contradicted by the stale homepage, SEO, and terminal content still present in the diff.

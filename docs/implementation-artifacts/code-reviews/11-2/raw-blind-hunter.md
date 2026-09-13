Reading prompt from stdin...
2026-09-13T18:07:41.795365Z ERROR codex_models_manager::cache: failed to load models cache: missing field `base_instructions` at line 133 column 5
OpenAI Codex v0.145.0
--------
workdir: /Users/simon/dev/jouan.ovh
model: gpt-5.6-luna
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: high
reasoning summaries: none
session id: 01a09bf4-1ed9-7b71-95db-2975d04fee6c
--------
user
# Blind Hunter Prompt — Story 11.2

Invoke the `bmad-review-adversarial-general` skill on this diff:

Diff file: `docs/implementation-artifacts/code-reviews/11-2/full.diff`
(You can read the file directly).

Goal: Cynically review content and produce findings. Review with extreme skepticism — assume problems exist. Find at least ten issues to fix or improve in the provided content. Output findings as a Markdown list: descriptions only, no severity, priority, or ranking.

warning: Skill descriptions were shortened to fit the 2% skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.
codex
J’utilise `bmad-review-adversarial-general` pour examiner le diff avec une posture volontairement sceptique et produire au moins dix constats actionnables, conformément au format demandé.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md" in /Users/simon/dev/jouan.ovh
 exited 1 in 0ms:
sed: /Users/simon/.agents/skills/bmad-review-adversarial-general/SKILL.md: No such file or directory

exec
/bin/zsh -lc "sed -n '1,260p' /Users/simon/dev/jouan.ovh/.agents/skills/bmad-review-adversarial-general/SKILL.md" in /Users/simon/dev/jouan.ovh
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

Output findings as a Markdown list (descriptions only).


## HALT CONDITIONS

- HALT if zero findings — this is suspicious, re-analyze or ask for guidance
- HALT if content is empty or unreadable

exec
/bin/zsh -lc "wc -l docs/implementation-artifacts/code-reviews/11-2/full.diff && sed -n '1,260p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
    1138 docs/implementation-artifacts/code-reviews/11-2/full.diff
diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
new file mode 100644
index 0000000..bdd4f89
--- /dev/null
+++ b/app/components/home/HomeBootOverlay.vue
@@ -0,0 +1,230 @@
+<template>
+  <div
+    v-if="!isDismissed"
+    class="boot"
+    :class="{ 'boot--done': isDone }"
+    role="status"
+    aria-live="polite"
+    @click="finishBoot"
+  >
+    <div class="boot__in">
+      <div class="boot__logo">
+        <ZIcon name="gem" class="boot__logo-icon" />
+        <b>jouan.os</b>
+      </div>
+      <div class="boot__line">
+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
+      </div>
+      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
+        <i :style="{ width: `${progressPercent}%` }" />
+      </div>
+      <div class="boot__skip">[ cliquez ou appuyez sur Échap pour passer ]</div>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, onMounted, onUnmounted } from "vue";
+
+// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
+// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
+// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
+
+const emit = defineEmits<{
+  (e: "boot-complete"): void;
+}>();
+
+const isDismissed = ref(false);
+const isDone = ref(false);
+const currentStepText = ref("");
+const currentStepOk = ref(false);
+const progressPercent = ref(0);
+
+const bootSteps = [
+  { text: "initialisation du noyau…", ok: false },
+  { text: "montage de /dev/portfolio", ok: false },
+  { text: "chargement des polices Ubuntu Mono", ok: false },
+  { text: "compilation des projets", ok: true },
+  { text: "démarrage du serveur", ok: true },
+];
+
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
+
+function finishBoot() {
+  if (isDone.value) return;
+  isDone.value = true;
+  progressPercent.value = 100;
+
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+
+  if (import.meta.client) {
+    try {
+      sessionStorage.setItem("jouan_boot_done", "1");
+    } catch {
+      // Ignore sessionStorage exceptions (private browsing / quota)
+    }
+  }
+
+  emit("boot-complete");
+
+  dismissTimeoutId = setTimeout(() => {
+    isDismissed.value = true;
+  }, 600);
+}
+
+function runBoot() {
+  let stepIndex = 0;
+
+  function next() {
+    if (stepIndex >= bootSteps.length) {
+      stepTimeoutId = setTimeout(finishBoot, 260);
+      return;
+    }
+
+    const step = bootSteps[stepIndex];
+    if (step) {
+      currentStepText.value = step.text;
+      currentStepOk.value = step.ok;
+      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
+    }
+    stepIndex++;
+    stepTimeoutId = setTimeout(next, 230);
+  }
+
+  next();
+}
+
+function handleKeydown(e: KeyboardEvent) {
+  if (e.key === "Escape" && !isDone.value) {
+    finishBoot();
+  }
+}
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  window.addEventListener("keydown", handleKeydown);
+
+  // Vérifier si la session a déjà vu le boot
+  let alreadyBooted = false;
+  try {
+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
+  } catch {
+    alreadyBooted = false;
+  }
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (alreadyBooted || reduceMotion) {
+    isDone.value = true;
+    isDismissed.value = true;
+    emit("boot-complete");
+    return;
+  }
+
+  runBoot();
+});
+
+onUnmounted(() => {
+  if (!import.meta.client) return;
+  window.removeEventListener("keydown", handleKeydown);
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+  if (dismissTimeoutId !== null) {
+    clearTimeout(dismissTimeoutId);
+    dismissTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.boot {
+  position: fixed;
+  inset: 0;
+  z-index: 200;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  cursor: pointer;
+  background: var(--surface-0);
+  transition:
+    opacity var(--dur-slow) var(--ease-out),
+    visibility var(--dur-slow);
+
+  &.boot--done {
+    pointer-events: none;
+    visibility: hidden;
+    opacity: 0;
+  }
+}
+
+.boot__in {
+  width: min(560px, 88vw);
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+}
+
+.boot__logo {
+  display: flex;
+  align-items: center;
+  gap: var(--space-3);
+  margin-bottom: var(--space-5);
+  color: var(--text-strong);
+
+  b {
+    font-size: var(--fs-lg);
+  }
+}
+
+.boot__logo-icon {
+  font-size: 26px;
+  color: var(--accent);
+}
+
+.boot__line {
+  min-height: 1.6em;
+  color: var(--text-muted);
+}
+
+.boot__ok {
+  color: var(--term-green);
+}
+
+.boot__bar {
+  height: 3px;
+  margin-top: var(--space-5);
+  overflow: hidden;
+  background: var(--surface-3);
+  border-radius: var(--radius-xs);
+
+  i {
+    display: block;
+    width: 0;
+    height: 100%;
+    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
+    transition: width 0.1s linear;
+  }
+}
+
+.boot__skip {
+  margin-top: var(--space-4);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-faint);
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .boot {
+    display: none;
+  }
+}
+</style>
diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
new file mode 100644
index 0000000..82a1aac
--- /dev/null
+++ b/app/components/home/HomeHeroTerminal.vue
@@ -0,0 +1,363 @@
+<template>
+  <div class="hero-term">
+    <div class="hero-term__bar">
+      <span class="hero-term__dots" aria-hidden="true">
+        <span class="hero-term__dot hero-term__dot--close" />
+        <span class="hero-term__dot hero-term__dot--min" />
+        <span class="hero-term__dot hero-term__dot--max" />
+      </span>
+      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
+    </div>
+
+    <div class="hero-term__body">
+      <!-- Lignes complètes terminées -->
+      <template v-for="(row, idx) in executedRows" :key="idx">
+        <p class="hero-term__line" aria-hidden="true">
+          <span class="prm">
+            <span class="prm__user">anon.@jouan.ovh</span>
+            <span class="prm__sep">:</span>

exec
/bin/zsh -lc "rg -n '"'^diff --git|''^@@|TODO|FIXME|hardcod|https?://|window|document|localStorage|sessionStorage|aria-|target=|<img|color:|padding:|margin:'"' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
1:diff --git a/app/components/home/HomeBootOverlay.vue b/app/components/home/HomeBootOverlay.vue
6:@@ -0,0 +1,230 @@
13:+    aria-live="polite"
22:+        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
23:+        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
25:+      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
37:+// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
74:+      sessionStorage.setItem("jouan_boot_done", "1");
76:+      // Ignore sessionStorage exceptions (private browsing / quota)
118:+  window.addEventListener("keydown", handleKeydown);
123:+    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
128:+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
142:+  window.removeEventListener("keydown", handleKeydown);
187:+  color: var(--text-strong);
196:+  color: var(--accent);
201:+  color: var(--text-muted);
205:+  color: var(--term-green);
228:+  color: var(--text-faint);
237:diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
242:@@ -0,0 +1,363 @@
246:+      <span class="hero-term__dots" aria-hidden="true">
257:+        <p class="hero-term__line" aria-hidden="true">
270:+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
286:+        aria-label="Ouvrir le terminal interactif"
287:+        aria-haspopup="dialog"
296:+          <span class="prm__caret" aria-hidden="true" />
367:+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
429:+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
471:+  padding: 0 var(--space-3);
505:+  color: var(--text-muted);
513:+  padding: var(--space-4);
518:+  color: var(--ink-1);
531:+  margin: 0;
535:+  margin: 0 0 var(--space-4);
539:+  color: var(--ink-1);
543:+  color: var(--term-blue);
547:+  color: var(--term-green);
553:+  padding: 0;
574:+  color: var(--prompt);
578:+  color: var(--ink-1);
583:+  color: var(--term-blue);
587:+  color: var(--ink-1);
606:diff --git a/app/pages/index.vue b/app/pages/index.vue
610:@@ -1,69 +1,41 @@
623:-            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
626:+            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
634:+              <span class="hero__pulse-dot" aria-hidden="true" />
662:-                <span class="hero-term__dots" aria-hidden="true">
672:-                  <p class="hero-term__line" aria-hidden="true">
685:-                  aria-label="Ouvrir le terminal interactif"
686:-                  aria-haspopup="dialog"
692:-                    ><span class="prm__caret" aria-hidden="true"
701:@@ -129,20 +101,21 @@
715:-// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
731:@@ -177,28 +150,14 @@ const stats = [
752:     "@context": "https://schema.org",
761:     "@context": "https://schema.org",
762:@@ -217,9 +176,9 @@ const homeJsonLd = [
774:@@ -313,168 +272,32 @@ usePageSeo({
807:-  padding: 0 var(--space-3);
841:-  color: var(--text-muted);
849:-  padding: var(--space-4);
855:-  color: var(--ink-1);
868:-  margin: 0;
872:-  margin: 0 0 var(--space-4);
876:-  color: var(--ink-1);
880:-  color: var(--term-blue);
884:-  color: var(--term-green);
886:+  color: var(--text-muted);
892:-  padding: 0;
900:+    color: var(--accent);
911:+      color: var(--accent-hover);
923:-  color: var(--prompt);
927:-  color: var(--ink-1);
932:-  color: var(--term-blue);
936:-  color: var(--ink-1);
960:@@ -658,8 +481,7 @@ usePageSeo({
970:diff --git a/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
975:@@ -0,0 +1,141 @@
999:+   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
1008:+   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
1014:+     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
1032:+  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
1041:+  - [x] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
1064:+- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
1072:+- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
1098:+- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
1117:diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
1121:@@ -35,7 +35,7 @@
1130:@@ -120,7 +120,7 @@ development_status:

exec
/bin/zsh -lc "sed -n '237,605p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/components/home/HomeHeroTerminal.vue b/app/components/home/HomeHeroTerminal.vue
new file mode 100644
index 0000000..82a1aac
--- /dev/null
+++ b/app/components/home/HomeHeroTerminal.vue
@@ -0,0 +1,363 @@
+<template>
+  <div class="hero-term">
+    <div class="hero-term__bar">
+      <span class="hero-term__dots" aria-hidden="true">
+        <span class="hero-term__dot hero-term__dot--close" />
+        <span class="hero-term__dot hero-term__dot--min" />
+        <span class="hero-term__dot hero-term__dot--max" />
+      </span>
+      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
+    </div>
+
+    <div class="hero-term__body">
+      <!-- Lignes complètes terminées -->
+      <template v-for="(row, idx) in executedRows" :key="idx">
+        <p class="hero-term__line" aria-hidden="true">
+          <span class="prm">
+            <span class="prm__user">anon.@jouan.ovh</span>
+            <span class="prm__sep">:</span>
+            <span class="prm__dir">~</span>
+            <span class="prm__sep">$ </span>
+            <span class="prm__cmd">{{ row.cmd }}</span>
+          </span>
+        </p>
+        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
+      </template>
+
+      <!-- Ligne en cours de frappe -->
+      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">{{ currentTypingText }}</span>
+          <span class="prm__caret" />
+        </span>
+      </p>
+
+      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
+      <button
+        v-if="isSequenceComplete"
+        type="button"
+        class="hero-term__open"
+        aria-label="Ouvrir le terminal interactif"
+        aria-haspopup="dialog"
+        @click="openTerminal"
+      >
+        <span class="prm">
+          <span class="prm__user">anon.@jouan.ovh</span>
+          <span class="prm__sep">:</span>
+          <span class="prm__dir">~</span>
+          <span class="prm__sep">$ </span>
+          <span class="prm__cmd">help</span>
+          <span class="prm__caret" aria-hidden="true" />
+        </span>
+      </button>
+    </div>
+  </div>
+</template>
+
+<script setup lang="ts">
+import { ref, watch, onMounted, onUnmounted } from "vue";
+import { useTerminal } from "~/composables/useTerminal";
+
+// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
+// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
+// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
+// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
+
+const props = withDefaults(
+  defineProps<{
+    autoStart?: boolean;
+  }>(),
+  {
+    autoStart: true,
+  },
+);
+
+const { open: openTerminal } = useTerminal();
+
+interface ITermRow {
+  cmd: string;
+  out: string;
+  tone: "ink" | "blue" | "green";
+}
+
+const fullRows: ITermRow[] = [
+  {
+    cmd: "whoami",
+    out: "Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)",
+    tone: "ink",
+  },
+  {
+    cmd: "cat focus.txt",
+    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
+    tone: "blue",
+  },
+  {
+    cmd: "ls ~/projets",
+    out: "keova.app/  tryon-saas/  nodium-lab/",
+    tone: "green",
+  },
+];
+
+const executedRows = ref<ITermRow[]>([]);
+const currentTypingLine = ref<ITermRow | null>(null);
+const currentTypingText = ref("");
+const isSequenceComplete = ref(false);
+
+let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
+let isStarted = false;
+
+function showInstantState() {
+  executedRows.value = [...fullRows];
+  currentTypingLine.value = null;
+  currentTypingText.value = "";
+  isSequenceComplete.value = true;
+}
+
+function startTypingSequence() {
+  if (isStarted) return;
+  isStarted = true;
+
+  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+
+  if (reduceMotion) {
+    showInstantState();
+    return;
+  }
+
+  let rowIndex = 0;
+
+  function typeRow() {
+    if (rowIndex >= fullRows.length) {
+      currentTypingLine.value = null;
+      currentTypingText.value = "";
+      isSequenceComplete.value = true;
+      return;
+    }
+
+    const row = fullRows[rowIndex];
+    if (!row) return;
+
+    const activeRow: ITermRow = row;
+    currentTypingLine.value = activeRow;
+    currentTypingText.value = "";
+
+    let charIndex = 0;
+    const fullCmd = activeRow.cmd;
+
+    function typeChar() {
+      if (charIndex < fullCmd.length) {
+        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
+        charIndex++;
+        typingTimeoutId = setTimeout(typeChar, 46);
+      } else {
+        // Commande entièrement tapée, afficher le résultat après une pause
+        stepTimeoutId = setTimeout(() => {
+          executedRows.value.push(activeRow);
+          currentTypingLine.value = null;
+          currentTypingText.value = "";
+          rowIndex++;
+          stepTimeoutId = setTimeout(typeRow, 280);
+        }, 200);
+      }
+    }
+
+    typeChar();
+  }
+
+  typeRow();
+}
+
+watch(
+  () => props.autoStart,
+  (shouldStart) => {
+    if (shouldStart && !isStarted) {
+      startTypingSequence();
+    }
+  },
+);
+
+onMounted(() => {
+  if (!import.meta.client) return;
+
+  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
+  if (reduceMotion) {
+    showInstantState();
+    return;
+  }
+
+  if (props.autoStart) {
+    startTypingSequence();
+  }
+});
+
+onUnmounted(() => {
+  if (typingTimeoutId !== null) {
+    clearTimeout(typingTimeoutId);
+    typingTimeoutId = null;
+  }
+  if (stepTimeoutId !== null) {
+    clearTimeout(stepTimeoutId);
+    stepTimeoutId = null;
+  }
+});
+</script>
+
+<style lang="scss" scoped>
+/* stylelint-disable selector-class-pattern */
+.hero-term {
+  display: flex;
+  flex-direction: column;
+  min-height: 300px;
+  overflow: hidden;
+  border: 1px solid var(--accent-2-soft);
+  border-radius: var(--radius-sm);
+  box-shadow: var(--glow-terminal);
+}
+
+.hero-term__bar {
+  position: relative;
+  display: flex;
+  flex: none;
+  align-items: center;
+  gap: var(--space-2);
+  height: 30px;
+  padding: 0 var(--space-3);
+  background: var(--aubergine-black);
+}
+
+.hero-term__dots {
+  display: flex;
+  align-items: center;
+  gap: 7px;
+}
+
+.hero-term__dot {
+  width: 13px;
+  height: 13px;
+  border-radius: var(--radius-circle);
+}
+
+.hero-term__dot--close {
+  background: var(--term-red);
+}
+
+.hero-term__dot--min {
+  background: var(--term-yellow);
+}
+
+.hero-term__dot--max {
+  background: var(--term-green);
+}
+
+.hero-term__title {
+  position: absolute;
+  inset: 0;
+  font-family: var(--font-mono);
+  font-size: var(--fs-xs);
+  letter-spacing: var(--ls-wide);
+  color: var(--text-muted);
+  text-align: center;
+  pointer-events: none;
+}
+
+.hero-term__body {
+  flex: 1;
+  min-height: 0;
+  padding: var(--space-4);
+  overflow: auto;
+  font-family: var(--font-mono);
+  font-size: var(--fs-sm);
+  line-height: var(--lh-snug);
+  color: var(--ink-1);
+  background: var(--bg-terminal);
+  overflow-wrap: break-word;
+}
+
+@supports (backdrop-filter: blur(5px)) {
+  .hero-term__body {
+    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
+    backdrop-filter: blur(5px);
+  }
+}
+
+.hero-term__line {
+  margin: 0;
+}
+
+.hero-term__out {
+  margin: 0 0 var(--space-4);
+}
+
+.hero-term__out--ink {
+  color: var(--ink-1);
+}
+
+.hero-term__out--blue {
+  color: var(--term-blue);
+}
+
+.hero-term__out--green {
+  color: var(--term-green);
+}
+
+.hero-term__open {
+  display: block;
+  width: 100%;
+  padding: 0;
+  font: inherit;
+  text-align: left;
+  cursor: pointer;
+  background: none;
+  border: none;
+  border-radius: var(--radius-xs);
+
+  &:focus-visible {
+    outline: 2px solid transparent;
+    outline-offset: 2px;
+    box-shadow: var(--ring-accent);
+  }
+}
+
+.prm {
+  font-family: var(--font-mono);
+}
+
+.prm__user {
+  font-weight: var(--fw-bold);
+  color: var(--prompt);
+}
+
+.prm__sep {
+  color: var(--ink-1);
+}
+
+.prm__dir {
+  font-weight: var(--fw-bold);
+  color: var(--term-blue);
+}
+
+.prm__cmd {
+  color: var(--ink-1);
+}
+
+.prm__caret {
+  display: inline-block;
+  width: 0.55em;
+  height: 1.05em;
+  margin-left: 1px;
+  vertical-align: text-bottom;
+  background: var(--prompt);
+  animation: caret-blink 1s steps(1) infinite;
+}
+
+@media (prefers-reduced-motion: reduce) {
+  .prm__caret {
+    animation: none;
+  }
+}
+</style>

exec
/bin/zsh -lc "sed -n '606,969p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/app/pages/index.vue b/app/pages/index.vue
index e1e048c..51c7a1c 100644
--- a/app/pages/index.vue
+++ b/app/pages/index.vue
@@ -1,69 +1,41 @@
 <template>
   <main class="home">
+    <HomeBootOverlay @boot-complete="onBootComplete" />
     <HomeAtmosComponent />
     <ZCustomCursor />
 
     <section class="hero hero__grad">
       <div class="hero__in container">
         <div class="hero__grid">
-          <!-- Colonne gauche : accroche, CTA, tags -->
+          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
           <div class="anim hero__text">
-            <p class="eyebrow"><span aria-hidden="true">// </span>développeur web freelance</p>
-            <h1 class="hero__title">Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
-            <p class="hero__sub">{{ tagline }}</p>
+            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
+            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
+            <p class="hero__sub">
+              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
+              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
+            </p>
+
+            <div class="hero__badge-wrap">
+              <span class="hero__pulse-dot" aria-hidden="true" />
+              <span>Disponible pour missions freelance · </span>
+              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
+                Profil Malt vérifié
+              </ZExternalLink>
+            </div>
+
             <div class="hero__cta">
               <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
-                Démarrer un projet
+                Discuter de votre projet
                 <template #iconRight><ZIcon name="arrow" /></template>
               </ZButton>
-              <ZButton :as="NuxtLink" to="/services" variant="secondary" size="lg"> Voir les services </ZButton>
+              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
             </div>
-            <ul class="hero__tags">
-              <li v-for="tag in tags" :key="tag">
-                <ZTag>{{ tag }}</ZTag>
-              </li>
-            </ul>
           </div>
 
-          <!-- Colonne droite : fenêtre terminal décorative (statique) -->
+          <!-- Colonne droite : terminal hero cinétique -->
           <div class="anim hero__term-col">
-            <div class="hero-term">
-              <div class="hero-term__bar">
-                <span class="hero-term__dots" aria-hidden="true">
-                  <span class="hero-term__dot hero-term__dot--close" />
-                  <span class="hero-term__dot hero-term__dot--min" />
-                  <span class="hero-term__dot hero-term__dot--max" />
-                </span>
-                <span class="hero-term__title">anon.@jouan.ovh: ~</span>
-              </div>
-
-              <div class="hero-term__body">
-                <template v-for="row in terminalRows" :key="row.id">
-                  <p class="hero-term__line" aria-hidden="true">
-                    <span class="prm"
-                      ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
-                      ><span class="prm__dir">~</span><span class="prm__sep">$ </span
-                      ><span class="prm__cmd">{{ row.cmd }}</span></span
-                    >
-                  </p>
-                  <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
-                </template>
-
-                <button
-                  type="button"
-                  class="hero-term__open"
-                  aria-label="Ouvrir le terminal interactif"
-                  aria-haspopup="dialog"
-                  @click="openTerminal"
-                >
-                  <span class="prm"
-                    ><span class="prm__user">anon.@jouan.ovh</span><span class="prm__sep">:</span
-                    ><span class="prm__dir">~</span><span class="prm__sep">$ </span><span class="prm__cmd">help</span
-                    ><span class="prm__caret" aria-hidden="true"
-                  /></span>
-                </button>
-              </div>
-            </div>
+            <HomeHeroTerminal :auto-start="isBootFinished" />
           </div>
         </div>
       </div>
@@ -129,20 +101,21 @@
 </template>
 
 <script setup lang="ts">
-// Page d'accueil — hero Terminal (A) + aperçu services + stats. Porté de Home.jsx
-// (HeroTerminal / ServicesPreview / StatsProjects) du UI kit : recréation Vue 3 +
-// tokens (aucune copie JSX). Dark-first, accent orange. (Stories 3.1, 3.2, 3.3)
+// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
+// Architecture multi-pages Nuxt 4, dark-first, accent orange.
+import { ref } from "vue";
 import { NuxtLink, ZExternalLink } from "#components";
-import { useTerminal } from "~/composables/useTerminal";
 import { SITE } from "~/data/site";
 
-// Contenu repris de data.js (window.SITE) — 1re personne, vouvoiement, pas d'emoji.
-const tagline = "Je conçois des applications sur-mesure, des sites WordPress, et j'intègre l'IA dans vos outils.";
-const tags = ["php", "symfony", "wordpress", "nest.js", "nuxt.js"];
+const isBootFinished = ref(false);
+
+function onBootComplete() {
+  isBootFinished.value = true;
+}
 
 // Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
 // (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
-// `id` = clé v-for stable (indépendante du contenu affiché), cohérent avec terminalRows.
+// `id` = clé v-for stable (indépendante du contenu affiché).
 const services = [
   {
     id: "wordpress",
@@ -177,28 +150,14 @@ const stats = [
 // Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
 const projects = SITE.projects;
 
-// Lignes du terminal décoratif, fidèles à HeroTerminal (Home.jsx). Codées en dur
-// côté template (pas de chiffres/projets inventés : stats & projets = stories 3.2 / 3.3).
-// `id` = clé v-for stable (indépendante du contenu affiché), garantie unique.
-const terminalRows = [
-  { id: "line-1", cmd: "whoami", out: "Simon Jouan — Développeur web freelance", tone: "ink" },
-  { id: "line-2", cmd: "cat stack.txt", out: "PHP/Symfony · WordPress · Node/Nest · Nuxt", tone: "blue" },
-  { id: "line-3", cmd: "ls ~/projets", out: "keova.app/   patio-conseil.fr/", tone: "green" },
-];
-
-// Ouverture de l'easter-egg terminal via le lanceur partagé (enregistré par le
-// header). No-op tant qu'aucun terminal n'est disponible (prerender). La
-// restylisation du terminal lui-même relève d'Epic 8.
-const { open: openTerminal } = useTerminal();
-
 const siteUrl = useSiteUrl();
 const homeJsonLd = [
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
-    name: "Simon Jouan — Développeur web freelance",
+    name: "Simon Jouan — Développeur Full Stack TypeScript",
     url: siteUrl,
-    description: tagline,
+    description: SITE.profile.role,
   },
   {
     "@context": "https://schema.org",
@@ -217,9 +176,9 @@ const homeJsonLd = [
 ];
 
 usePageSeo({
-  title: "Simon Jouan — Développeur web freelance & IA",
+  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   description:
-    "Développeur web freelance à Valognes (Normandie) : création de sites WordPress sur-mesure, applications web (PHP/Symfony, Nest.js, Nuxt) et intégrations d'IA.",
+    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   path: "/",
   image: "/images/portrait.jpeg",
   type: "website",
@@ -313,168 +272,32 @@ usePageSeo({
   margin-bottom: var(--space-6);
 }
 
-// .hero__tags : primitive de layout globale (app/assets/scss/base/_layout.scss).
-
-// ---- Fenêtre terminal décorative (porté de TerminalWindow.jsx / Prompt.jsx) ----
-// Dérogation tokens-only assumée : les dimensions fixes du chrome (hauteur min
-// de fenêtre 300px, barre 30px, pastilles 13px / gap 7px) reproduisent à
-// l'identique la spec du composant DS et n'ont pas de token d'espacement
-// équivalent (échelle base-4). Couleurs, rayons et ombres restent en tokens.
-// `min-height` (et non `height`) : la fenêtre s'étend au contenu — pas de
-// scrollbar parasite si le rendu mono dépasse de quelques px.
-.hero-term {
-  display: flex;
-  flex-direction: column;
-  min-height: 300px;
-  overflow: hidden;
-  border: 1px solid var(--accent-2-soft);
-  border-radius: var(--radius-sm);
-  box-shadow: var(--glow-terminal);
-}
-
-.hero-term__bar {
-  position: relative;
-  display: flex;
-  flex: none;
+// ---- Badge de disponibilité & CTAs ----
+.hero__badge-wrap {
+  display: inline-flex;
   align-items: center;
   gap: var(--space-2);
-  height: 30px;
-  padding: 0 var(--space-3);
-  background: var(--aubergine-black);
-}
-
-.hero-term__dots {
-  display: flex;
-  align-items: center;
-  gap: 7px;
-}
-
-.hero-term__dot {
-  width: 13px;
-  height: 13px;
-  border-radius: var(--radius-circle);
-}
-
-.hero-term__dot--close {
-  background: var(--term-red);
-}
-
-.hero-term__dot--min {
-  background: var(--term-yellow);
-}
-
-.hero-term__dot--max {
-  background: var(--term-green);
-}
-
-.hero-term__title {
-  position: absolute;
-  inset: 0;
-  font-family: var(--font-mono);
-  font-size: var(--fs-xs);
-  letter-spacing: var(--ls-wide);
-  color: var(--text-muted);
-  text-align: center;
-  pointer-events: none;
-}
-
-.hero-term__body {
-  flex: 1;
-  min-height: 0;
-  padding: var(--space-4);
-  overflow: auto;
+  margin-bottom: var(--space-6);
   font-family: var(--font-mono);
   font-size: var(--fs-sm);
-  line-height: var(--lh-snug);
-  color: var(--ink-1);
-  background: var(--bg-terminal);
-  overflow-wrap: break-word;
-}
-
-@supports (backdrop-filter: blur(5px)) {
-  .hero-term__body {
-    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
-    backdrop-filter: blur(5px);
-  }
-}
-
-.hero-term__line {
-  margin: 0;
-}
-
-.hero-term__out {
-  margin: 0 0 var(--space-4);
-}
-
-.hero-term__out--ink {
-  color: var(--ink-1);
-}
-
-.hero-term__out--blue {
-  color: var(--term-blue);
-}
-
-.hero-term__out--green {
-  color: var(--term-green);
-}
+  color: var(--text-muted);
 
-// Ligne « help » cliquable → ouvre l'easter-egg terminal (bouton natif = clavier OK).
-.hero-term__open {
-  display: block;
-  width: 100%;
-  padding: 0;
-  font: inherit;
-  text-align: left;
-  cursor: pointer;
-  background: none;
-  border: none;
-  border-radius: var(--radius-xs);
+  a {
+    color: var(--accent);
+    text-decoration: underline;
 
-  &:focus-visible {
-    // Outline transparent : invisible en rendu normal (le ring box-shadow prend le
-    // relais), mais rendu en couleur système sous forced-colors (Windows High
-    // Contrast), où les box-shadow sont neutralisées — focus toujours visible.
-    outline: 2px solid transparent;
-    outline-offset: 2px;
-    box-shadow: var(--ring-accent);
+    &:hover {
+      color: var(--accent-hover);
+    }
   }
 }
 
-// ---- Prompt (porté de Prompt.jsx : couleurs héritage) ----
-.prm {
-  font-family: var(--font-mono);
-}
-
-.prm__user {
-  font-weight: var(--fw-bold);
-  color: var(--prompt);
-}
-
-.prm__sep {
-  color: var(--ink-1);
-}
-
-.prm__dir {
-  font-weight: var(--fw-bold);
-  color: var(--term-blue);
-}
-
-.prm__cmd {
-  color: var(--ink-1);
-}
-
-// Caret : dimensions en em reprises telles quelles de Prompt.jsx (glyphe
-// proportionnel à la police) — pas de token équivalent pour un curseur.
-.prm__caret {
-  display: inline-block;
-  width: 0.55em;
-  height: 1.05em;
-  margin-left: 1px;
-  vertical-align: text-bottom;
-  background: var(--prompt);
-
-  // Seule animation en boucle de l'UI (caret terminal). Keyframe globale (_root.scss).
-  animation: caret-blink 1s steps(1) infinite;
+.hero__pulse-dot {
+  width: 8px;
+  height: 8px;
+  border-radius: var(--radius-circle);
+  background: var(--term-green);
+  box-shadow: 0 0 8px var(--term-green);
 }
 
 .section__title {
@@ -658,8 +481,7 @@ usePageSeo({
 }
 
 @media (prefers-reduced-motion: reduce) {
-  .anim,
-  .prm__caret {
+  .anim {
     animation: none;
   }
 }

exec
/bin/zsh -lc "sed -n '970,1145p' docs/implementation-artifacts/code-reviews/11-2/full.diff" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
diff --git a/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
new file mode 100644
index 0000000..7bd200c
--- /dev/null
+++ b/docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
@@ -0,0 +1,141 @@
+---
+baseline_commit: 5f72e8c14627deb82e7d7c8f8f7f2227b00bd0d4
+---
+
+# Story 11.2: Séquence de Boot interactive (`jouan.os`) & Hero commercial cinétique
+
+Status: review
+
+<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->
+
+## Story
+
+As a prospect technique ou client potentiel visitant la page d'accueil,
+I want assister au démarrage stylisé du terminal et visualiser immédiatement le titre officiel « Développeur Full Stack TypeScript — Nuxt / NestJS »,
+so that je comprends instantanément le métier de Simon, sa disponibilité et ses technologies phares en moins de 5 secondes (FR19, FR20, UX-DR19, UX-DR20, CAP-2, CAP-3).
+
+## Acceptance Criteria
+
+1. **Given** un visiteur arrivant sur la page d'accueil
+   **When** la page se charge pour la première fois de la session
+   **Then** l'overlay de boot (`HomeBootOverlay.vue`, simulant `jouan.os`) s'affiche au premier plan (`z-index: 200`), déroule la montée en charge système (`initialisation du noyau…`, `montage de /dev/portfolio`, `chargement des polices Ubuntu Mono`, `compilation des projets [ok]`, `démarrage du serveur [ok]`) avec jauge de progression
+   **And** l'overlay s'efface automatiquement (transition d'opacité vers disparition) après 1.0s à 1.5s
+   **And** un clic n'importe où sur l'overlay ou la pression sur la touche `Escape` court-circuite immédiatement l'animation (`finishBoot`)
+   **And** la consultation du boot est mémorisée dans `sessionStorage` (`jouan_boot_done`) afin de ne pas rejouer la séquence lors des navigations ultérieures au sein de la même session
+   **And** sous `@media (prefers-reduced-motion: reduce)`, la séquence de boot est immédiatement court-circuitée sans animation ni délai.
+
+2. **Given** la fin de la séquence de boot (ou son contournement immédiat)
+   **When** le hero s'affiche
+   **Then** le composant terminal hero (`HomeHeroTerminal.vue`) déclenche sa simulation de frappe séquentielle progressive (effet machine à écrire) :
+     - `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
+     - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
+     - `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
+   **And** à la fin de la séquence, une invite `$ help` reste affichée avec un caret natif clignotant (`caret-blink`), et le bouton d'ouverture de l'easter-egg terminal modal (`useTerminal().open`) reste 100 % opérationnel avec son attribut accessible `aria-haspopup="dialog"`
+   **And** sous `@media (prefers-reduced-motion: reduce)`, les lignes du terminal hero s'affichent instantanément en texte statique complet sans animation de frappe, le caret restant figé visible.
+
+3. **Given** la colonne gauche du Hero commercial sur `app/pages/index.vue`
+   **When** le visiteur visualise la zone d'accroche principale
+   **Then** la hiérarchie de contenu affiche en typographie Ubuntu :
+     - Sur-titre / eyebrow : `<p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>` (sans rupture d'outline sémantique)
+     - Titre principal `<h1>` : `Développeur Full Stack TypeScript`
+     - Sous-titre descriptif : `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
+     - Badge de statut de disponibilité : puce pulsée (`--success`), texte `Disponible pour missions freelance · Profil Malt vérifié`, encapsulant un lien accessible vers Malt via `<ZExternalLink :href="SITE.profile.maltUrl">`
+     - Groupe de CTAs d'action :
+       - CTA primaire : `<ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">Discuter de votre projet<template #iconRight><ZIcon name="arrow" /></template></ZButton>`
+       - CTA secondaire : `<ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg">Voir le parcours &amp; CV</ZButton>`
+   **And** les anciens tags WordPress/PHP (`php`, `symfony`, `wordpress`) et l'ancienne accroche (« Du code sur-mesure, de l'IA utile ») sont définitivement retirés du Hero.
+
+4. **Given** l'ensemble des intégrations de la story
+   **When** on exécute la gate de validation Docker
+   **Then** `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"` réussit avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript, et 13 routes statiques générées avec succès par Nitro.
+
+## Tasks / Subtasks
+
+- [x] Tâche 1 — Création du composant de démarrage `app/components/home/HomeBootOverlay.vue` (AC: 1)
+  - [x] Définir la structure HTML/template (`.boot`, `.boot__in`, `.boot__logo` avec nom `jouan.os`, `.boot__line`, `.boot__bar` avec barre `<i>`, `.boot__skip`).
+  - [x] Implémenter les étapes de boot textuelles (`bootSteps`) et la barre de progression linéaire.
+  - [x] Ajouter la gestion du stockage en `sessionStorage` (`jouan_boot_done`) encapsulée dans `onMounted()` avec garde `import.meta.client`.
+  - [x] Permettre l'interruption immédiate au clic ou via la touche `Escape` (avec écouteur nettoyé dans `onUnmounted()`).
+  - [x] Supporter `prefers-reduced-motion: reduce` en zappant instantanément la séquence (`finishBoot()`).
+  - [x] Émettre l'événement `@boot-complete` vers le composant parent pour synchroniser le démarrage du terminal hero.
+  - [x] Styliser en SCSS scoped en utilisant exclusivement les tokens CSS (`--surface-0`, `--text-strong`, `--text-muted`, `--term-green`, `--surface-3`, `--accent`, `--aubergine-light`, `--text-faint`).
+
+- [x] Tâche 2 — Création du composant terminal hero `app/components/home/HomeHeroTerminal.vue` (AC: 2)
+  - [x] Extraire et modulariser la fenêtre terminal décorative du hero dans `app/components/home/HomeHeroTerminal.vue`.
+  - [x] Implémenter la séquence de frappe séquentielle progressive (effet machine à écrire) pour les commandes `$ whoami`, `$ cat focus.txt` et `$ ls ~/projets` alignées sur le positionnement Full Stack TS.
+  - [x] Conserver le bouton d'ouverture modal de l'easter-egg terminal (`anon.@jouan.ovh:~$ help`) avec `aria-haspopup="dialog"`, `aria-label="Ouvrir le terminal interactif"` et appel à `useTerminal().open`.
+  - [x] Assurer la neutralisation sous `prefers-reduced-motion: reduce` : contenu affiché immédiatement dans son état final, caret figé visible.
+  - [x] Styliser avec les variables de Design System (`--bg-terminal`, `--font-mono`, `--term-red`, `--term-yellow`, `--term-green`, `--term-blue`, etc.).
+
+- [x] Tâche 3 — Refonte commerciale de la colonne gauche du Hero sur `app/pages/index.vue` (AC: 3)
+  - [x] Mettre à jour l'eyebrow : `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`.
+  - [x] Mettre à jour le titre `h1` : `Développeur Full Stack TypeScript`.
+  - [x] Remplacer le sous-titre par le pitch commercial ciblé Nuxt / NestJS / PostgreSQL.
+  - [x] Intégrer le badge de disponibilité avec puce pulsée et lien `<ZExternalLink :href="SITE.profile.maltUrl">Profil Malt vérifié</ZExternalLink>`.
+  - [x] Adapter les boutons d'appel à l'action : bouton principal vers `/contact` (« Discuter de votre projet ») et secondaire vers `/about` (« Voir le parcours & CV »).
+  - [x] Supprimer la liste de tags legacy (`tags = ["php", "symfony", "wordpress", ...]`) du template hero.
+  - [x] Intégrer `<HomeBootOverlay @boot-complete="onBootComplete" />` et `<HomeHeroTerminal :auto-start="isBootFinished" />`.
+
+- [x] Tâche 4 — Validation qualité & Gate Docker (AC: 4)
+  - [x] Exécuter la suite de validation Docker : `docker compose run --rm web sh -c "corepack enable && pnpm lint && pnpm typecheck && pnpm generate"`.
+  - [x] Vérifier la conformité de rendu et l'absence de régression d'hydratation (SSR/SSG Nitro).
+  - [x] Vérifier le comportement d'accessibilité au clavier (`Tab`, `Escape`) et sous contraste forcé.
+
+## Dev Notes
+
+### Architecture & Contraintes d'environnement
+- **Environnement Docker STRICT :** Toute commande d'outillage (`pnpm lint`, `pnpm typecheck`, `pnpm generate`) doit impérativement s'exécuter dans le conteneur Docker `docker compose run --rm web sh -c "corepack enable && pnpm <cmd>"`. Ne jamais lancer `pnpm` sur la machine hôte macOS. [Source: AGENTS.md#Section 2]
+- **Tokens CSS & Design System :** Aucune couleur ou espacement en dur. Consommer exclusivement les variables de tokens exposées dans `:root` (`var(--surface-0)`, `var(--text-strong)`, `var(--text-muted)`, `var(--term-green)`, `var(--accent)`, etc.). Pas de préfixes vendeurs manuels (Stylelint interdit `-webkit-*`). [Source: AGENTS.md#Section 3]
+- **SSR / SSG Nitro Prerender Safety :** Tout accès direct aux APIs navigateur (`window`, `document`, `sessionStorage`, `matchMedia`) DOIT être encapsulé dans un hook `onMounted()` ou conditionné par `if (import.meta.client)`. [Source: AGENTS.md#Section 5]
+- **Accessibilité (a11y) :**
+  - Le lien externe vers Malt DOIT utiliser `<ZExternalLink>` (`app/components/ui/ZExternalLink.vue`).
+  - Seul le caret de frappe actif clignote ; les carets décoratifs ou sous reduced-motion doivent être figés visibles.
+  - La touche `Escape` court-circuite le boot overlay et ne bloque aucun focus.
+  - Les puces pulsées doivent être stylisées sans animations violentes (pulsation douce ou opacité).
+
+### Analyse des fichiers modifiés et créés
+- **`app/components/home/HomeBootOverlay.vue`** (NEW) : Overlay de démarrage `jouan.os`. Déclenche la montée système, gère le dismiss (`click`, `Escape`, timer, `sessionStorage`), neutralisé sous reduced motion.
+- **`app/components/home/HomeHeroTerminal.vue`** (NEW) : Terminal hero cinétique avec animation de frappe des commandes cibles, invitant ensuite à ouvrir l'easter-egg terminal.
+- **`app/pages/index.vue`** (UPDATE) : Remplacement du hero existant par le nouveau hero commercial Full Stack TS, intégration de `HomeBootOverlay` et `HomeHeroTerminal`, suppression des données legacy (`tags`, ancienne `tagline`).
+
+### Données & Textes exacts (Source : `sections-mapping.md` et `SPEC.md`)
+- **Eyebrow hero :** `// DÉVELOPPEUR FREELANCE · NUXT & NESTJS`
+- **Titre principal H1 :** `Développeur Full Stack TypeScript`
+- **Pitch sous-titre :** `Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.`
+- **Badge disponibilité :** `Disponible pour missions freelance · Profil Malt vérifié` (lien `SITE.profile.maltUrl`).
+- **Commandes terminal hero :**
+  1. `$ whoami` → `Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)`
+  2. `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
+  3. `$ ls ~/projets` → `keova.app/  tryon-saas/  nodium-lab/`
+  4. Invite finale : `anon.@jouan.ovh:~$ help` avec caret clignotant et déclencheur `openTerminal`.
+
+## Dev Agent Record
+
+### Agent Model Used
+- Gemini 3.7 Flash
+
+### Debug Log References
+- Résolution des erreurs de formatage Prettier sur `HomeHeroTerminal.vue` et `app/pages/index.vue`.
+- Résolution du typage TypeScript (`ITermRow` narrow) dans le callback asynchrone `typeRow` de `HomeHeroTerminal.vue`.
+- Validation complète de la suite Docker avec 0 erreur ESLint/Stylelint, 0 erreur TypeScript et 13 routes statiques générées avec succès par Nitro.
+
+### Completion Notes List
+- Composant `HomeBootOverlay.vue` créé avec simulation de démarrage `jouan.os`, barre de progression, écouteur clavier `Escape`, clic de contournement, persistance en `sessionStorage` et support complet de `prefers-reduced-motion`.
+- Composant `HomeHeroTerminal.vue` créé avec simulation de frappe séquentielle des commandes Full Stack TS (`whoami`, `cat focus.txt`, `ls ~/projets`), bouton accessible `help` déclenchant l'easter egg terminal modal, et figeage statique sous reduced motion.
+- Page `app/pages/index.vue` refondue avec nouveau positionnement commercial Full Stack TS, badge Malt vérifié avec lien `<ZExternalLink>`, CTAs d'action ciblés, et orchestration via événement `@boot-complete`.
+
+### File List
+- `app/components/home/HomeBootOverlay.vue` (NEW)
+- `app/components/home/HomeHeroTerminal.vue` (NEW)
+- `app/pages/index.vue` (MODIFIED)
+- `docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md` (MODIFIED)
+- `docs/implementation-artifacts/sprint-status.yaml` (MODIFIED)
+
+## References
+
+- [Contrat canonique : docs/specs/spec-home-awwwards/SPEC.md]
+- [Cartographie détaillée : docs/specs/spec-home-awwwards/sections-mapping.md]
+- [Maquette prototype : docs/design_system/ui_kits/jouan-site/Home - Awwwards.html]
+- [Profil Malt officiel : docs/contexte_malt.md]
+- [Directives globales pour agents : AGENTS.md]
+- [Leçons de la Story 11.1 : docs/implementation-artifacts/11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique.md]
diff --git a/docs/implementation-artifacts/sprint-status.yaml b/docs/implementation-artifacts/sprint-status.yaml
index 9235a51..6706d58 100644
--- a/docs/implementation-artifacts/sprint-status.yaml
+++ b/docs/implementation-artifacts/sprint-status.yaml
@@ -35,7 +35,7 @@
 # - Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
 
 generated: 2026-06-18
-last_updated: "2026-09-13 (Story 11.1 done : Préparation de branche, site.ts & Atmosphère)"
+last_updated: "2026-09-13 (Story 11.2 review : Séquence de Boot & Hero commercial)"
 project: jouan.ovh
 project_key: NOKEY
 tracking_system: file-system
@@ -120,7 +120,7 @@ development_status:
   # Epic 11 — Refonte d'accueil Awwwards & Repositionnement Commercial Full Stack TS
   epic-11: in-progress
   11-1-preparation-de-branche-mise-a-jour-des-donnees-sitets-et-atmosphere-cinetique: done
-  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: backlog
+  11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique: review
   11-3-marquee-de-stack-moderne-et-vitrine-des-3-services-cibles: backlog
   11-4-preuves-concretes-saas-journal-technique-et-cta-final-de-conversion: backlog
   11-5-validation-transverse-a11y-multi-pages-ssg-nitro-et-gate-docker: backlog

codex
Le diff est lisible. Je vérifie maintenant les contrats existants (données partagées, primitives d’accessibilité, orchestration du terminal et tokens) afin que les constats portent sur des régressions concrètes plutôt que sur de simples préférences de style.
exec
/bin/zsh -lc "sed -n '1,260p' app/data/site.ts" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
// Source de vérité unique du CONTENU partagé du site (DRY / SRP : les données vivent ici,
// les composants/programmes ne font que les présenter). Forme portée de
// `docs/design_system/ui_kits/jouan-site/data.js` (référence du UI kit).
//
// Consommé par : pages (`index.vue`, `about.vue`, `contact.vue`), `FooterComponent.vue`,
// et les programmes terminal (`programs/Skills|Projets|Contact|About.ts`).
//
// NB : `experiences` / `degrees` ne sont PAS centralisés ici — leurs formes et leur niveau
// de détail divergent volontairement entre le CV terminal (`About.ts`, détaillé) et la page
// `/about` (condensée). Leur réconciliation est une décision de contenu, suivie dans
// `deferred-work.md`, pas un simple refactor.

export interface IProfile {
  name: string;
  role: string;
  email: string;
  city: string;
  available: boolean;
  maltUrl?: string;
}

export interface IProject {
  name: string;
  role: string;
  desc: string;
  url?: string;
  status?: string;
  tags: string[];
}

const profile: IProfile = {
  name: "Simon Jouan",
  role: "Développeur Full Stack TypeScript — Nuxt / NestJS",
  email: "simon@jouan.ovh",
  city: "Rouen, France",
  available: true,
  maltUrl: "https://www.malt.fr/profile/simonjouan",
};

// Stack technique moderne prioritaire ordonnée.
const skills: string[] = [
  "typescript",
  "nuxt",
  "vue",
  "nest.js",
  "node.js",
  "postgresql",
  "typeorm",
  "stripe",
  "cypress",
  "docker",
  "rest-api",
  "vitest",
];

const projects: IProject[] = [
  {
    name: "keova.app",
    role: "Co-fondateur & Développeur Full Stack",
    desc: "Plateforme SaaS ERP équestre complète conçue et opérée de bout en bout (gestion de pensions, facturation automatisée, réservations).",
    url: "https://keova.app",
    status: "En production",
    tags: ["nuxt", "nest.js", "postgresql", "stripe", "saas"],
  },
  {
    name: "TryOn",
    role: "CTO & Développeur Full Stack",
    desc: "Plateforme SaaS B2B d'essayage virtuel de vêtements via l'IA générative (diffusion models, microservices asynchrones, files Redis).",
    status: "Étude de cas (MVP livré)",
    tags: ["nuxt", "nest.js", "python", "comfyui", "ia"],
  },
  {
    name: "Nodium",
    role: "Créateur & Ingénieur IA",
    desc: "Plateforme desktop d'orchestration d'agents IA autonomes, gestion de permissions et mémoire contextuelle.",
    status: "R&D / En cours",
    tags: ["typescript", "electron", "agents", "ia"],
  },
];

export const SITE = { profile, skills, projects } as const;

exec
/bin/zsh -lc "sed -n '1,220p' app/components/ui/ZExternalLink.vue && sed -n '1,220p' app/composables/useTerminal.ts" in /Users/simon/dev/jouan.ovh
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
import { ref } from "vue";

// Lanceur partagé de l'easter-egg terminal.
//
// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
// le `HeaderComponent` ; il n'existe pas d'API globale d'ouverture. Ce registre
// minimal expose cette ouverture aux autres parties du site (ex. le hero d'accueil
// story 3.1) sans dupliquer le gestionnaire ni dépendre d'Epic 8.
//
// Le header enregistre son lanceur au montage (`register`), les appelants
// déclenchent l'ouverture (`open`). Tant qu'aucun lanceur n'est enregistré (ex.
// au prerender `nuxi generate`, avant hydratation), `open()` est un no-op sûr.
// La restylisation complète du terminal reste du périmètre d'Epic 8.

type TerminalLauncher = () => void;

const launcher = ref<TerminalLauncher | null>(null);

export function useTerminal() {
  return {
    /** Enregistre le lanceur réel (appelé par le header au montage). */
    register(fn: TerminalLauncher) {
      launcher.value = fn;
    },
    /**
     * Désenregistre le lanceur au démontage. Ne nullifie que si le lanceur
     * courant est bien `fn` (évite d'effacer un enregistrement plus récent).
     */
    unregister(fn: TerminalLauncher) {
      if (launcher.value === fn) {
        launcher.value = null;
      }
    },
    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
    open() {
      launcher.value?.();
    },
  };
}

exec
/bin/zsh -lc "rg -n 'hero__|HomeHero|useTerminal|modal|focus|ring-accent|--font|--space|--glow|--success|--term-green|maltUrl' app docs/specs docs/contexte_malt.md | head -260" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
docs/specs/spec-design-system-revamp/primitives.md:10:| Button | `components/core/Button.jsx` (+ `.d.ts`) | `components/ui/ZButton.vue` | variantes (primary orange, dark…), états hover/press/focus |
docs/specs/spec-design-system-revamp/primitives.md:14:| Input | `components/core/Input.jsx` | `components/ui/ZInput.vue` | bordure `--border-default` → `--border-strong` au focus |
app/pages/about.vue:42:              <ul class="hero__tags">
app/pages/about.vue:165:// .section / .container / .eyebrow / .prose / .hero__tags sont des primitives de
app/pages/about.vue:185:  gap: var(--space-6);
app/pages/about.vue:190:  margin: var(--space-5) 0 var(--space-1);
app/pages/about.vue:191:  font-family: var(--font-mono);
app/pages/about.vue:199:  font-family: var(--font-mono);
app/pages/about.vue:207:  gap: var(--space-2);
app/pages/about.vue:208:  margin-top: var(--space-4);
app/pages/about.vue:215:  gap: var(--space-3);
app/pages/about.vue:216:  margin-top: var(--space-5);
app/pages/about.vue:221:  margin: 0 0 var(--space-4);
app/pages/about.vue:234:  // soulignement au survol + ring de focus accessible (pas d'outline: none nu).
app/pages/about.vue:243:    // Anneau de focus accent + outline transparent : ce dernier reste invisible
app/pages/about.vue:245:    // (High Contrast), où le box-shadow est neutralisé. A11y : focus toujours visible.
app/pages/about.vue:246:    &:focus-visible {
app/pages/about.vue:250:      box-shadow: var(--ring-accent);
app/pages/about.vue:256:// .hero__tags (rangée de chips) = primitive de layout globale (base/_layout.scss).
app/pages/about.vue:258:  margin: var(--space-6) 0;
app/pages/about.vue:265:  gap: var(--space-12);
app/pages/about.vue:269:// `margin-top` repris de l'inline JSX (<div class="tl" style="margin-top: var(--space-5)">).
app/pages/about.vue:282:  margin: var(--space-5) 0 0;
app/pages/about.vue:283:  padding-left: var(--space-6);
app/pages/about.vue:300:  padding-bottom: var(--space-6);
app/pages/about.vue:309:  left: calc(var(--tl-axis) - var(--space-6));
app/pages/about.vue:319:  font-family: var(--font-mono);
app/pages/about.vue:326:  // kit.css:138 utilise `margin: 2px 0` ; --space-1 (4px) est le token le plus proche
app/pages/about.vue:328:  margin: var(--space-1) 0;
app/pages/about.vue:329:  font-family: var(--font-mono);
app/pages/about.vue:335:  font-family: var(--font-mono);
app/pages/about.vue:341:  margin-top: var(--space-2);
app/pages/about.vue:342:  font-family: var(--font-sans);
app/pages/about.vue:352:  gap: var(--space-5);
app/pages/about.vue:353:  margin: var(--space-5) 0 0;
app/pages/about.vue:359:  margin: var(--space-1) 0;
app/pages/about.vue:360:  font-family: var(--font-mono);
app/pages/about.vue:370:    gap: var(--space-10);
docs/specs/spec-design-system-revamp/SPEC.md:60:  success: Le sous-système `components/terminal/` fonctionne (ouverture modale, commandes `help`/`about`/`skills`/`projets`/`contact`/`clear`), avec le style terminal du DS (fond aubergine profond, prompt vert, blur, caret clignotant) ; aucune commande existante n'est cassée.
docs/specs/spec-design-system-revamp/SPEC.md:64:  success: `prefers-reduced-motion` respecté (seule boucle = caret terminal) ; états focus/hover/press visibles ; contraste texte lisible sur fonds sombres ; navigation clavier opérante.
docs/specs/spec-design-system-revamp/pages.md:15:| Terminal (modal) | `TerminalScreen.jsx` | existe (`components/terminal/`) | easter-egg : `help` `about` `skills` `projets` `contact` `clear` |
app/pages/blog/[...slug].vue:11:          <ul v-if="page.tags?.length" class="hero__tags article__tags">
app/pages/blog/[...slug].vue:164:// .section / .container / .prose / .hero__tags / .post__meta sont des primitives de
app/pages/blog/[...slug].vue:176:// Lien retour (porté de kit.css : .hdr__link) — mono discret, soulignement + ring au focus.
app/pages/blog/[...slug].vue:179:  margin-bottom: var(--space-5);
app/pages/blog/[...slug].vue:180:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:189:  &:focus-visible {
app/pages/blog/[...slug].vue:193:    box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:198:  margin-bottom: var(--space-4);
app/pages/blog/[...slug].vue:203:  margin-bottom: var(--space-4);
app/pages/blog/[...slug].vue:204:  font-family: var(--font-mono);
app/pages/blog/[...slug].vue:213:  margin: var(--space-4) 0 var(--space-8);
app/pages/blog/[...slug].vue:220:  margin-bottom: var(--space-8);
app/pages/blog/[...slug].vue:233:    margin: 0 0 var(--space-5);
app/pages/blog/[...slug].vue:237:    margin: var(--space-8) 0 var(--space-3);
app/pages/blog/[...slug].vue:238:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:246:    margin: var(--space-6) 0 var(--space-2);
app/pages/blog/[...slug].vue:247:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:255:    margin: var(--space-5) 0 var(--space-2);
app/pages/blog/[...slug].vue:256:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:268:  // Liens du corps prose : couleur lien DS + ring de focus accessible.
app/pages/blog/[...slug].vue:277:    &:focus-visible {
app/pages/blog/[...slug].vue:281:      box-shadow: var(--ring-accent);
app/pages/blog/[...slug].vue:297:    margin: 0 0 var(--space-5);
app/pages/blog/[...slug].vue:298:    padding: var(--space-4);
app/pages/blog/[...slug].vue:300:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:311:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:313:    color: var(--term-green);
app/pages/blog/[...slug].vue:323:    margin: 0 0 var(--space-5);
app/pages/blog/[...slug].vue:324:    padding-left: var(--space-6);
app/pages/blog/[...slug].vue:328:    margin-bottom: var(--space-2);
app/pages/blog/[...slug].vue:337:    margin: 0 0 var(--space-5);
app/pages/blog/[...slug].vue:338:    padding: var(--space-1) 0 var(--space-1) var(--space-4);
app/pages/blog/[...slug].vue:350:    margin: var(--space-8) 0;
app/pages/blog/[...slug].vue:358:    margin: 0 0 var(--space-5);
app/pages/blog/[...slug].vue:365:    padding: var(--space-2) var(--space-3);
app/pages/blog/[...slug].vue:371:    font-family: var(--font-mono);
app/pages/blog/[...slug].vue:381:    margin: var(--space-2) 0 var(--space-5);
app/pages/blog/[...slug].vue:390:  gap: var(--space-4);
app/pages/blog/[...slug].vue:393:  margin-top: var(--space-10);
app/pages/blog/[...slug].vue:394:  padding-top: var(--space-6);
app/pages/blog/[...slug].vue:399:  font-family: var(--font-mono);
app/pages/blog/index.vue:27:                <ul v-if="article.tags?.length" class="hero__tags post__tags">
app/pages/blog/index.vue:156:// .section / .container / .eyebrow / .prose / .hero__tags / .post__meta sont des
app/pages/blog/index.vue:164:  margin-bottom: var(--space-2);
app/pages/blog/index.vue:165:  font-family: var(--font-mono);
app/pages/blog/index.vue:174:  margin-bottom: var(--space-10);
app/pages/blog/index.vue:183:  gap: var(--space-5);
app/pages/blog/index.vue:193:  gap: var(--space-5);
app/pages/blog/index.vue:207:  margin-bottom: var(--space-2);
app/pages/blog/index.vue:211:  margin-bottom: var(--space-2);
app/pages/blog/index.vue:212:  font-family: var(--font-mono);
app/pages/blog/index.vue:220:  margin: 0 0 var(--space-3);
app/pages/blog/index.vue:221:  font-family: var(--font-sans);
app/pages/blog/index.vue:239:  margin: 0 auto var(--space-6);
app/pages/blog/index.vue:243:  margin-bottom: var(--space-3);
app/pages/blog/index.vue:244:  font-family: var(--font-mono);
app/pages/confidentialite.vue:177:  margin-bottom: var(--space-4);
app/pages/confidentialite.vue:178:  font-family: var(--font-mono);
app/pages/confidentialite.vue:187:  margin-bottom: var(--space-10);
app/pages/confidentialite.vue:195:  gap: var(--space-8);
app/pages/confidentialite.vue:201:  gap: var(--space-3);
app/pages/confidentialite.vue:210:    gap: var(--space-2);
app/pages/confidentialite.vue:211:    padding-left: var(--space-5);
app/pages/confidentialite.vue:218:  font-family: var(--font-mono);
app/pages/confidentialite.vue:232:  &:focus-visible {
app/pages/confidentialite.vue:236:    box-shadow: var(--ring-accent);
app/pages/contact.vue:15:            <!-- État « envoyé » : carte accent + ligne mono verte. role="status" + focus
app/pages/contact.vue:114:            <!-- Carte CTA terminal : ouvre l'easter-egg via le lanceur partagé (useTerminal) -->
app/pages/contact.vue:147:const { open: openTerminal } = useTerminal();
app/pages/contact.vue:205:async function focusSentCard(): Promise<void> {
app/pages/contact.vue:207:  sentCard.value?.$el?.focus();
app/pages/contact.vue:215:    // a11y : amener le focus sur le 1er champ invalide.
app/pages/contact.vue:217:    formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
app/pages/contact.vue:224:    await focusSentCard();
app/pages/contact.vue:243:      await focusSentCard();
app/pages/contact.vue:298:  gap: var(--space-12);
app/pages/contact.vue:304:  margin-bottom: var(--space-3);
app/pages/contact.vue:305:  font-family: var(--font-mono);
app/pages/contact.vue:314:  margin-bottom: var(--space-8);
app/pages/contact.vue:322:  gap: var(--space-4);
app/pages/contact.vue:329:  gap: var(--space-4);
app/pages/contact.vue:345:  font-family: var(--font-mono);
app/pages/contact.vue:353:  font-family: var(--font-mono);
app/pages/contact.vue:370:  &:focus-visible {
app/pages/contact.vue:374:    box-shadow: var(--ring-accent);
app/pages/contact.vue:379:.contact__sent:focus {
app/pages/contact.vue:385:  margin-bottom: var(--space-2);
app/pages/contact.vue:386:  font-family: var(--font-mono);
app/pages/contact.vue:388:  color: var(--term-green);
app/pages/contact.vue:403:  gap: var(--space-5);
app/pages/contact.vue:413:  font-family: var(--font-mono);
app/pages/contact.vue:416:    margin-bottom: var(--space-5);
app/pages/contact.vue:434:// Lien email en bleu terminal (porté de Contact.jsx), ring de focus accessible.
app/pages/contact.vue:443:  &:focus-visible {
app/pages/contact.vue:447:    box-shadow: var(--ring-accent);
app/pages/contact.vue:452:  margin-top: var(--space-2);
app/pages/contact.vue:463:  margin: 0 0 var(--space-2);
app/pages/contact.vue:464:  font-family: var(--font-mono);
app/pages/contact.vue:466:  color: var(--term-green);
app/pages/contact.vue:475:  margin: 0 0 var(--space-3);
docs/specs/spec-home-awwwards/sections-mapping.md:51:    - `$ cat focus.txt` → `SaaS, web apps, clean architecture, automated testing (QA) & AI engineering`
app/pages/services.vue:186:  margin-bottom: var(--space-3);
app/pages/services.vue:187:  font-family: var(--font-mono);
app/pages/services.vue:196:  margin-bottom: var(--space-10);
app/pages/services.vue:204:  gap: var(--space-5);
app/pages/services.vue:223:  margin-bottom: var(--space-3);
app/pages/services.vue:230:  width: var(--space-10); // 40px
app/pages/services.vue:231:  height: var(--space-10);
app/pages/services.vue:232:  margin-bottom: var(--space-4);
app/pages/services.vue:235:  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
app/pages/services.vue:243:  margin-bottom: var(--space-2);
app/pages/services.vue:244:  font-family: var(--font-mono);
app/pages/services.vue:251:  margin: 0 0 var(--space-4);
app/pages/services.vue:252:  font-family: var(--font-sans);
app/pages/services.vue:265:    padding: var(--space-1) 0 var(--space-1) var(--space-5);
app/pages/services.vue:266:    font-family: var(--font-mono);
app/pages/services.vue:284:  padding-top: var(--space-5);
app/pages/services.vue:285:  font-family: var(--font-mono);
app/pages/services.vue:297:  margin-top: var(--space-4);
app/pages/services.vue:307:  margin-bottom: var(--space-8);
app/pages/services.vue:308:  font-family: var(--font-mono);
app/pages/services.vue:317:  gap: var(--space-5);
app/pages/services.vue:324:  font-family: var(--font-mono);
app/pages/services.vue:331:  margin: var(--space-2) 0;
app/pages/services.vue:332:  font-family: var(--font-mono);
app/pages/services.vue:344:  margin-top: var(--space-12);
app/data/site.ts:19:  maltUrl?: string;
app/data/site.ts:37:  maltUrl: "https://www.malt.fr/profile/simonjouan",
app/pages/mentions-legales.vue:80:              personnelles (notamment via le formulaire de contact), ainsi qu'aux modalités d'exercice de vos droits
app/pages/mentions-legales.vue:116:  margin-bottom: var(--space-4);
app/pages/mentions-legales.vue:117:  font-family: var(--font-mono);
app/pages/mentions-legales.vue:126:  margin-bottom: var(--space-10);
app/pages/mentions-legales.vue:134:  gap: var(--space-8);
app/pages/mentions-legales.vue:140:  gap: var(--space-3);
app/pages/mentions-legales.vue:149:    gap: var(--space-2);
app/pages/mentions-legales.vue:150:    padding-left: var(--space-5);
app/pages/mentions-legales.vue:157:  font-family: var(--font-mono);
app/pages/mentions-legales.vue:171:  &:focus-visible {
app/pages/mentions-legales.vue:175:    box-shadow: var(--ring-accent);
app/pages/index.vue:7:    <section class="hero hero__grad">
app/pages/index.vue:8:      <div class="hero__in container">
app/pages/index.vue:9:        <div class="hero__grid">
app/pages/index.vue:11:          <div class="anim hero__text">
app/pages/index.vue:13:            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
app/pages/index.vue:14:            <p class="hero__sub">
app/pages/index.vue:19:            <div class="hero__badge-wrap">
app/pages/index.vue:20:              <span class="hero__pulse-dot" aria-hidden="true" />
app/pages/index.vue:22:              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
app/pages/index.vue:27:            <div class="hero__cta">
app/pages/index.vue:37:          <div class="anim hero__term-col">
app/pages/index.vue:38:            <HomeHeroTerminal :auto-start="isBootFinished" />
app/pages/index.vue:90:              <ul class="hero__tags">
app/pages/index.vue:200:.hero__term-col {
app/pages/index.vue:206:// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
app/pages/index.vue:212:.hero__grad {
app/pages/index.vue:215:  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
app/pages/index.vue:226:.hero__in {
app/pages/index.vue:232:  padding-block: var(--space-20);
app/pages/index.vue:235:.hero__grid {
app/pages/index.vue:238:  gap: var(--space-12);
app/pages/index.vue:246:.hero__title {
app/pages/index.vue:247:  font-family: var(--font-mono);
app/pages/index.vue:259:.hero__sub {
app/pages/index.vue:261:  margin: var(--space-5) 0 var(--space-6);
app/pages/index.vue:262:  font-family: var(--font-sans);
app/pages/index.vue:268:.hero__cta {
app/pages/index.vue:271:  gap: var(--space-3);
app/pages/index.vue:272:  margin-bottom: var(--space-6);
app/pages/index.vue:276:.hero__badge-wrap {
app/pages/index.vue:279:  gap: var(--space-2);
app/pages/index.vue:280:  margin-bottom: var(--space-6);
app/pages/index.vue:281:  font-family: var(--font-mono);
app/pages/index.vue:295:.hero__pulse-dot {
app/pages/index.vue:299:  background: var(--term-green);
app/pages/index.vue:300:  box-shadow: 0 0 8px var(--term-green);
app/pages/index.vue:304:  margin-bottom: var(--space-8);
app/pages/index.vue:305:  font-family: var(--font-mono);
app/pages/index.vue:315:  gap: var(--space-5);
app/pages/index.vue:335:  width: var(--space-10); // 40px
app/pages/index.vue:336:  height: var(--space-10);
app/pages/index.vue:337:  margin-bottom: var(--space-4);
app/pages/index.vue:340:  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
app/pages/index.vue:348:  margin-bottom: var(--space-2);
app/pages/index.vue:349:  font-family: var(--font-mono);
app/pages/index.vue:356:  margin: 0 0 var(--space-4);
app/pages/index.vue:357:  font-family: var(--font-sans);
app/pages/index.vue:365:  font-family: var(--font-mono);
app/pages/index.vue:374:  &:focus-visible {
app/pages/index.vue:378:    box-shadow: var(--ring-accent);
app/pages/index.vue:387:  gap: var(--space-12);
app/pages/index.vue:390:  margin-bottom: var(--space-12);
app/pages/index.vue:394:  font-family: var(--font-mono);
app/pages/index.vue:413:  gap: var(--space-6);
app/pages/index.vue:424:  margin-top: var(--space-5);
app/pages/index.vue:435:  .hero__tags {
app/pages/index.vue:444:  gap: var(--space-3);
app/pages/index.vue:449:  font-family: var(--font-mono);
app/pages/index.vue:456:  font-family: var(--font-mono);
app/pages/index.vue:463:  margin: var(--space-3) 0 var(--space-4);
app/pages/index.vue:469:  .hero__grid {
app/pages/index.vue:473:  .hero__title {
app/composables/useTerminal.ts:19:export function useTerminal() {
app/layouts/default.vue:21:  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
app/components/HeaderComponent.vue:48:    <div v-if="menuOpen" class="hdr__overlay" @click="closeMenuAndRefocus" />
app/components/HeaderComponent.vue:112:const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();
app/components/HeaderComponent.vue:129:  nextTick(() => firstMenuLink.value?.focus());
app/components/HeaderComponent.vue:136:// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
app/components/HeaderComponent.vue:137:function closeMenuAndRefocus() {
app/components/HeaderComponent.vue:142:  nextTick(() => burgerButton.value?.focus());
app/components/HeaderComponent.vue:160:    closeMenuAndRefocus();
app/components/HeaderComponent.vue:207:  gap: var(--space-6);
app/components/HeaderComponent.vue:212:  padding: 0 var(--space-6);
app/components/HeaderComponent.vue:218:  gap: var(--space-2);
app/components/HeaderComponent.vue:227:    font-family: var(--font-mono);
app/components/HeaderComponent.vue:233:  // Lien focusable (logo + nom) : anneau DS comme les autres focusables du châssis.
app/components/HeaderComponent.vue:234:  &:focus-visible {
app/components/HeaderComponent.vue:238:    box-shadow: var(--ring-accent);
app/components/HeaderComponent.vue:245:  gap: var(--space-1);
app/components/HeaderComponent.vue:247:  margin-left: var(--space-4);

exec
/bin/zsh -lc "sed -n '1,520p' app/pages/index.vue && sed -n '1,260p' app/components/HeaderComponent.vue && sed -n '1,260p' app/components/terminal/TerminalManagerComponent.vue" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <main class="home">
    <HomeBootOverlay @boot-complete="onBootComplete" />
    <HomeAtmosComponent />
    <ZCustomCursor />

    <section class="hero hero__grad">
      <div class="hero__in container">
        <div class="hero__grid">
          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
          <div class="anim hero__text">
            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
            <p class="hero__sub">
              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
            </p>

            <div class="hero__badge-wrap">
              <span class="hero__pulse-dot" aria-hidden="true" />
              <span>Disponible pour missions freelance · </span>
              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
                Profil Malt vérifié
              </ZExternalLink>
            </div>

            <div class="hero__cta">
              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
                Discuter de votre projet
                <template #iconRight><ZIcon name="arrow" /></template>
              </ZButton>
              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
            </div>
          </div>

          <!-- Colonne droite : terminal hero cinétique -->
          <div class="anim hero__term-col">
            <HomeHeroTerminal :auto-start="isBootFinished" />
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
              :interactive="Boolean(project.url)"
              :data-hot="Boolean(project.url) ? '' : undefined"
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
// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
// Architecture multi-pages Nuxt 4, dark-first, accent orange.
import { ref } from "vue";
import { NuxtLink, ZExternalLink } from "#components";
import { SITE } from "~/data/site";

const isBootFinished = ref(false);

function onBootComplete() {
  isBootFinished.value = true;
}

// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
// `id` = clé v-for stable (indépendante du contenu affiché).
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

const siteUrl = useSiteUrl();
const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simon Jouan — Développeur Full Stack TypeScript",
    url: siteUrl,
    description: SITE.profile.role,
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
  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
  description:
    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
  path: "/",
  image: "/images/portrait.jpeg",
  type: "website",
  jsonLd: homeJsonLd,
});
</script>

<style lang="scss" scoped>
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

// ---- Badge de disponibilité & CTAs ----
.hero__badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);

  a {
    color: var(--accent);
    text-decoration: underline;

    &:hover {
      color: var(--accent-hover);
    }
  }
}

.hero__pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: var(--term-green);
  box-shadow: 0 0 8px var(--term-green);
}

.section__title {
  margin-bottom: var(--space-8);
  font-family: var(--font-mono);
  font-size: var(--fs-3xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

// ---- Aperçu services (porté de .grid-3 / .offer*) ----
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.offer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.offer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10); // 40px
  height: var(--space-10);
  margin-bottom: var(--space-4);

  // Dimensionne le glyphe ZIcon (1em) à 22px — fidèle au kit (.offer__icon svg),
  // pas de token d'espacement à 22px (entre --space-5/20 et --space-6/24).
  font-size: 22px;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: var(--radius-md);
}

.offer__title {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.offer__desc {
  margin: 0 0 var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  line-height: var(--lh-relaxed);
  color: var(--text-body);
}

.offer__more {
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    // Outline transparent : rendu en couleur système sous forced-colors.
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
    border-radius: var(--radius-xs);
  }
}

// ---- Stats (porté de .statrow / .stat) ----
.statrow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);

  // Espace avant le bloc projets (story 3.3), réf. Home.jsx (statrow marginBottom).
  margin-bottom: var(--space-12);
}

.stat {
  font-family: var(--font-mono);

  b {
    display: block;
    font-size: var(--fs-4xl);
    font-weight: var(--fw-light);
    color: var(--text-strong);
  }

  span {
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
}

// ---- Projets sélectionnés (porté de StatsProjects / .grid-2 / .prose) ----
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
  }
}

.projects {
  margin-top: var(--space-5);
}

// Carte rendue en lien (`as="a"`) : neutralise le soulignement par défaut du
// <a> (le contenu porte ses propres couleurs/typo). ZCard reste générique.
.project {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-decoration: none;

  .hero__tags {
    margin-top: auto;
  }
}

.project__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.project__name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  font-weight: var(--fw-regular);
  color: var(--text-strong);
}

.project__role {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
  white-space: nowrap;
}

.project__desc {
  margin: var(--space-3) 0 var(--space-4);
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
  .anim {
    animation: none;
  }
}
</style>
<template>
  <header class="hdr">
    <div class="hdr__in">
      <NuxtLink to="/" class="hdr__brand" @click="closeMenu">
        <ZIcon name="gem" class="hdr__logo" />
        <b>jouan.ovh</b>
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
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hdr__right">
        <CurrentTime class="hdr__clock" />
        <ZBadge tone="success" dot class="hdr__badge">Disponible</ZBadge>
        <ZButton variant="terminal" size="sm" class="hdr__action" @click="addNewTerminal">
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
        {{ item.label }}
      </NuxtLink>

      <div class="hdr__menu-actions">
        <ZButton variant="terminal" size="sm" @click="openTerminalFromMenu">
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
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

// Lien actif : exact pour l'accueil, préfixe pour les autres (couvre /blog/[...slug]).
function isActive(to: string): boolean {
  if (to === "/") {
    return route.path === "/";
  }
  return route.path === to || route.path.startsWith(`${to}/`);
}

// --- Terminal easter-egg (préservé) ---
const terminalManager = ref<InstanceType<typeof TerminalManagerComponent> | null>(null);

function addNewTerminal() {
  terminalManager.value?.createNewTerminal();
}

// Expose l'ouverture du terminal au reste du site via le lanceur partagé
// (ex. ligne « help » du hero d'accueil, story 3.1). Le gestionnaire reste
// monté ici ; on enregistre seulement une référence vers sa méthode.
const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();

// --- Menu mobile accessible ---
const menuOpen = ref(false);
const firstMenuLink = ref<HTMLElement | null>(null);
const burgerButton = ref<HTMLElement | null>(null);

function registerFirstLink(el: Element | ComponentPublicInstance | null, index: number) {
  if (index !== 0) {
    return;
  }
  const instance = el as ComponentPublicInstance | null;
  firstMenuLink.value = (instance?.$el ?? el) as HTMLElement | null;
}

function openMenu() {
  menuOpen.value = true;
  nextTick(() => firstMenuLink.value?.focus());
}

function closeMenu() {
  menuOpen.value = false;
}

// Fermeture clavier/overlay : renvoie le focus au burger (déclencheur) — a11y.
function closeMenuAndRefocus() {
  if (!menuOpen.value) {
    return;
  }
  closeMenu();
  nextTick(() => burgerButton.value?.focus());
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openTerminalFromMenu() {
  addNewTerminal();
  closeMenu();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && menuOpen.value) {
    closeMenuAndRefocus();
  }
}

// Passage en desktop alors que le menu mobile est ouvert : on le ferme (sinon
// l'overlay fixed resterait actif et le menu deviendrait incohérent au resize).
let desktopMq: MediaQueryList | null = null;
function onDesktopChange(event: MediaQueryListEvent) {
  if (event.matches) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  desktopMq = window.matchMedia("(min-width: 901px)");
  desktopMq.addEventListener("change", onDesktopChange);
  registerTerminalLauncher(addNewTerminal);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  desktopMq?.removeEventListener("change", onDesktopChange);
  unregisterTerminalLauncher(addNewTerminal);
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css */
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);

  // Verre sombre translucide : surface de page (token) à 82 % d'opacité + flou.
  background: color-mix(in srgb, var(--surface-0) 82%, transparent);
  border-bottom: 1px solid var(--border-subtle);

  /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
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
  gap: var(--space-2);
  text-decoration: none;

  .hdr__logo {
    font-size: 24px;
    color: var(--accent);
  }

  b {
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--text-strong);
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
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-width: 0; // autorise la nav à rétrécir plutôt que de pousser l'overflow
  margin-left: var(--space-4);
}

.hdr__link {
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition:
    color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);

<template>
  <div>
    <div v-for="(terminal, index) in terminals" :key="index">
      <TerminalComponent
        :id="index"
        :create-new-terminal="createNewTerminal"
        :terminal-config="terminal.terminalConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import { uniqueId } from "~/utils/functions";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant.
defineOptions({ name: "TerminalManagerComponent" });

const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);

const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
  const newTerminal = {
    id: uniqueId(),
    terminalConfig,
  };
  terminals.value.push(newTerminal);
};

// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
// header détient une ref de ce composant et appelle la méthode directement
// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
// appeler cette même méthode via sa ref. → on l'expose explicitement.
defineExpose({ createNewTerminal });
</script>

<style scoped></style>

exec
/bin/zsh -lc "nl -ba app/components/home/HomeBootOverlay.vue | sed -n '1,180p'; nl -ba app/components/home/HomeHeroTerminal.vue | sed -n '1,220p'; nl -ba app/pages/index.vue | sed -n '1,330p'" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
     1	<template>
     2	  <div
     3	    v-if="!isDismissed"
     4	    class="boot"
     5	    :class="{ 'boot--done': isDone }"
     6	    role="status"
     7	    aria-live="polite"
     8	    @click="finishBoot"
     9	  >
    10	    <div class="boot__in">
    11	      <div class="boot__logo">
    12	        <ZIcon name="gem" class="boot__logo-icon" />
    13	        <b>jouan.os</b>
    14	      </div>
    15	      <div class="boot__line">
    16	        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
    17	        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
    18	      </div>
    19	      <div class="boot__bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
    20	        <i :style="{ width: `${progressPercent}%` }" />
    21	      </div>
    22	      <div class="boot__skip">[ cliquez ou appuyez sur Échap pour passer ]</div>
    23	    </div>
    24	  </div>
    25	</template>
    26	
    27	<script setup lang="ts">
    28	import { ref, onMounted, onUnmounted } from "vue";
    29	
    30	// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
    31	// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
    32	// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
    33	// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.
    34	
    35	const emit = defineEmits<{
    36	  (e: "boot-complete"): void;
    37	}>();
    38	
    39	const isDismissed = ref(false);
    40	const isDone = ref(false);
    41	const currentStepText = ref("");
    42	const currentStepOk = ref(false);
    43	const progressPercent = ref(0);
    44	
    45	const bootSteps = [
    46	  { text: "initialisation du noyau…", ok: false },
    47	  { text: "montage de /dev/portfolio", ok: false },
    48	  { text: "chargement des polices Ubuntu Mono", ok: false },
    49	  { text: "compilation des projets", ok: true },
    50	  { text: "démarrage du serveur", ok: true },
    51	];
    52	
    53	let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
    54	let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;
    55	
    56	function finishBoot() {
    57	  if (isDone.value) return;
    58	  isDone.value = true;
    59	  progressPercent.value = 100;
    60	
    61	  if (stepTimeoutId !== null) {
    62	    clearTimeout(stepTimeoutId);
    63	    stepTimeoutId = null;
    64	  }
    65	
    66	  if (import.meta.client) {
    67	    try {
    68	      sessionStorage.setItem("jouan_boot_done", "1");
    69	    } catch {
    70	      // Ignore sessionStorage exceptions (private browsing / quota)
    71	    }
    72	  }
    73	
    74	  emit("boot-complete");
    75	
    76	  dismissTimeoutId = setTimeout(() => {
    77	    isDismissed.value = true;
    78	  }, 600);
    79	}
    80	
    81	function runBoot() {
    82	  let stepIndex = 0;
    83	
    84	  function next() {
    85	    if (stepIndex >= bootSteps.length) {
    86	      stepTimeoutId = setTimeout(finishBoot, 260);
    87	      return;
    88	    }
    89	
    90	    const step = bootSteps[stepIndex];
    91	    if (step) {
    92	      currentStepText.value = step.text;
    93	      currentStepOk.value = step.ok;
    94	      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
    95	    }
    96	    stepIndex++;
    97	    stepTimeoutId = setTimeout(next, 230);
    98	  }
    99	
   100	  next();
   101	}
   102	
   103	function handleKeydown(e: KeyboardEvent) {
   104	  if (e.key === "Escape" && !isDone.value) {
   105	    finishBoot();
   106	  }
   107	}
   108	
   109	onMounted(() => {
   110	  if (!import.meta.client) return;
   111	
   112	  window.addEventListener("keydown", handleKeydown);
   113	
   114	  // Vérifier si la session a déjà vu le boot
   115	  let alreadyBooted = false;
   116	  try {
   117	    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
   118	  } catch {
   119	    alreadyBooted = false;
   120	  }
   121	
   122	  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   123	
   124	  if (alreadyBooted || reduceMotion) {
   125	    isDone.value = true;
   126	    isDismissed.value = true;
   127	    emit("boot-complete");
   128	    return;
   129	  }
   130	
   131	  runBoot();
   132	});
   133	
   134	onUnmounted(() => {
   135	  if (!import.meta.client) return;
   136	  window.removeEventListener("keydown", handleKeydown);
   137	  if (stepTimeoutId !== null) {
   138	    clearTimeout(stepTimeoutId);
   139	    stepTimeoutId = null;
   140	  }
   141	  if (dismissTimeoutId !== null) {
   142	    clearTimeout(dismissTimeoutId);
   143	    dismissTimeoutId = null;
   144	  }
   145	});
   146	</script>
   147	
   148	<style lang="scss" scoped>
   149	/* stylelint-disable selector-class-pattern */
   150	.boot {
   151	  position: fixed;
   152	  inset: 0;
   153	  z-index: 200;
   154	  display: flex;
   155	  align-items: center;
   156	  justify-content: center;
   157	  cursor: pointer;
   158	  background: var(--surface-0);
   159	  transition:
   160	    opacity var(--dur-slow) var(--ease-out),
   161	    visibility var(--dur-slow);
   162	
   163	  &.boot--done {
   164	    pointer-events: none;
   165	    visibility: hidden;
   166	    opacity: 0;
   167	  }
   168	}
   169	
   170	.boot__in {
   171	  width: min(560px, 88vw);
   172	  font-family: var(--font-mono);
   173	  font-size: var(--fs-sm);
   174	}
   175	
   176	.boot__logo {
   177	  display: flex;
   178	  align-items: center;
   179	  gap: var(--space-3);
   180	  margin-bottom: var(--space-5);
     1	<template>
     2	  <div class="hero-term">
     3	    <div class="hero-term__bar">
     4	      <span class="hero-term__dots" aria-hidden="true">
     5	        <span class="hero-term__dot hero-term__dot--close" />
     6	        <span class="hero-term__dot hero-term__dot--min" />
     7	        <span class="hero-term__dot hero-term__dot--max" />
     8	      </span>
     9	      <span class="hero-term__title">anon.@jouan.ovh: ~</span>
    10	    </div>
    11	
    12	    <div class="hero-term__body">
    13	      <!-- Lignes complètes terminées -->
    14	      <template v-for="(row, idx) in executedRows" :key="idx">
    15	        <p class="hero-term__line" aria-hidden="true">
    16	          <span class="prm">
    17	            <span class="prm__user">anon.@jouan.ovh</span>
    18	            <span class="prm__sep">:</span>
    19	            <span class="prm__dir">~</span>
    20	            <span class="prm__sep">$ </span>
    21	            <span class="prm__cmd">{{ row.cmd }}</span>
    22	          </span>
    23	        </p>
    24	        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
    25	      </template>
    26	
    27	      <!-- Ligne en cours de frappe -->
    28	      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
    29	        <span class="prm">
    30	          <span class="prm__user">anon.@jouan.ovh</span>
    31	          <span class="prm__sep">:</span>
    32	          <span class="prm__dir">~</span>
    33	          <span class="prm__sep">$ </span>
    34	          <span class="prm__cmd">{{ currentTypingText }}</span>
    35	          <span class="prm__caret" />
    36	        </span>
    37	      </p>
    38	
    39	      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
    40	      <button
    41	        v-if="isSequenceComplete"
    42	        type="button"
    43	        class="hero-term__open"
    44	        aria-label="Ouvrir le terminal interactif"
    45	        aria-haspopup="dialog"
    46	        @click="openTerminal"
    47	      >
    48	        <span class="prm">
    49	          <span class="prm__user">anon.@jouan.ovh</span>
    50	          <span class="prm__sep">:</span>
    51	          <span class="prm__dir">~</span>
    52	          <span class="prm__sep">$ </span>
    53	          <span class="prm__cmd">help</span>
    54	          <span class="prm__caret" aria-hidden="true" />
    55	        </span>
    56	      </button>
    57	    </div>
    58	  </div>
    59	</template>
    60	
    61	<script setup lang="ts">
    62	import { ref, watch, onMounted, onUnmounted } from "vue";
    63	import { useTerminal } from "~/composables/useTerminal";
    64	
    65	// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
    66	// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
    67	// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
    68	// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
    69	
    70	const props = withDefaults(
    71	  defineProps<{
    72	    autoStart?: boolean;
    73	  }>(),
    74	  {
    75	    autoStart: true,
    76	  },
    77	);
    78	
    79	const { open: openTerminal } = useTerminal();
    80	
    81	interface ITermRow {
    82	  cmd: string;
    83	  out: string;
    84	  tone: "ink" | "blue" | "green";
    85	}
    86	
    87	const fullRows: ITermRow[] = [
    88	  {
    89	    cmd: "whoami",
    90	    out: "Simon Jouan — Full Stack TS Engineer (Nuxt / NestJS)",
    91	    tone: "ink",
    92	  },
    93	  {
    94	    cmd: "cat focus.txt",
    95	    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
    96	    tone: "blue",
    97	  },
    98	  {
    99	    cmd: "ls ~/projets",
   100	    out: "keova.app/  tryon-saas/  nodium-lab/",
   101	    tone: "green",
   102	  },
   103	];
   104	
   105	const executedRows = ref<ITermRow[]>([]);
   106	const currentTypingLine = ref<ITermRow | null>(null);
   107	const currentTypingText = ref("");
   108	const isSequenceComplete = ref(false);
   109	
   110	let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
   111	let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
   112	let isStarted = false;
   113	
   114	function showInstantState() {
   115	  executedRows.value = [...fullRows];
   116	  currentTypingLine.value = null;
   117	  currentTypingText.value = "";
   118	  isSequenceComplete.value = true;
   119	}
   120	
   121	function startTypingSequence() {
   122	  if (isStarted) return;
   123	  isStarted = true;
   124	
   125	  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   126	
   127	  if (reduceMotion) {
   128	    showInstantState();
   129	    return;
   130	  }
   131	
   132	  let rowIndex = 0;
   133	
   134	  function typeRow() {
   135	    if (rowIndex >= fullRows.length) {
   136	      currentTypingLine.value = null;
   137	      currentTypingText.value = "";
   138	      isSequenceComplete.value = true;
   139	      return;
   140	    }
   141	
   142	    const row = fullRows[rowIndex];
   143	    if (!row) return;
   144	
   145	    const activeRow: ITermRow = row;
   146	    currentTypingLine.value = activeRow;
   147	    currentTypingText.value = "";
   148	
   149	    let charIndex = 0;
   150	    const fullCmd = activeRow.cmd;
   151	
   152	    function typeChar() {
   153	      if (charIndex < fullCmd.length) {
   154	        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
   155	        charIndex++;
   156	        typingTimeoutId = setTimeout(typeChar, 46);
   157	      } else {
   158	        // Commande entièrement tapée, afficher le résultat après une pause
   159	        stepTimeoutId = setTimeout(() => {
   160	          executedRows.value.push(activeRow);
   161	          currentTypingLine.value = null;
   162	          currentTypingText.value = "";
   163	          rowIndex++;
   164	          stepTimeoutId = setTimeout(typeRow, 280);
   165	        }, 200);
   166	      }
   167	    }
   168	
   169	    typeChar();
   170	  }
   171	
   172	  typeRow();
   173	}
   174	
   175	watch(
   176	  () => props.autoStart,
   177	  (shouldStart) => {
   178	    if (shouldStart && !isStarted) {
   179	      startTypingSequence();
   180	    }
   181	  },
   182	);
   183	
   184	onMounted(() => {
   185	  if (!import.meta.client) return;
   186	
   187	  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   188	  if (reduceMotion) {
   189	    showInstantState();
   190	    return;
   191	  }
   192	
   193	  if (props.autoStart) {
   194	    startTypingSequence();
   195	  }
   196	});
   197	
   198	onUnmounted(() => {
   199	  if (typingTimeoutId !== null) {
   200	    clearTimeout(typingTimeoutId);
   201	    typingTimeoutId = null;
   202	  }
   203	  if (stepTimeoutId !== null) {
   204	    clearTimeout(stepTimeoutId);
   205	    stepTimeoutId = null;
   206	  }
   207	});
   208	</script>
   209	
   210	<style lang="scss" scoped>
   211	/* stylelint-disable selector-class-pattern */
   212	.hero-term {
   213	  display: flex;
   214	  flex-direction: column;
   215	  min-height: 300px;
   216	  overflow: hidden;
   217	  border: 1px solid var(--accent-2-soft);
   218	  border-radius: var(--radius-sm);
   219	  box-shadow: var(--glow-terminal);
   220	}
     1	<template>
     2	  <main class="home">
     3	    <HomeBootOverlay @boot-complete="onBootComplete" />
     4	    <HomeAtmosComponent />
     5	    <ZCustomCursor />
     6	
     7	    <section class="hero hero__grad">
     8	      <div class="hero__in container">
     9	        <div class="hero__grid">
    10	          <!-- Colonne gauche : accroche commerciale, badge dispo, CTAs -->
    11	          <div class="anim hero__text">
    12	            <p class="eyebrow"><span aria-hidden="true">// </span>DÉVELOPPEUR FREELANCE · NUXT &amp; NESTJS</p>
    13	            <h1 class="hero__title">Développeur Full Stack TypeScript</h1>
    14	            <p class="hero__sub">
    15	              Je conçois et développe des applications web et SaaS modernes avec Nuxt, NestJS et PostgreSQL. De
    16	              l'architecture au déploiement, j'interviens sur des produits neufs comme sur des applications existantes.
    17	            </p>
    18	
    19	            <div class="hero__badge-wrap">
    20	              <span class="hero__pulse-dot" aria-hidden="true" />
    21	              <span>Disponible pour missions freelance · </span>
    22	              <ZExternalLink v-if="SITE.profile.maltUrl" :href="SITE.profile.maltUrl">
    23	                Profil Malt vérifié
    24	              </ZExternalLink>
    25	            </div>
    26	
    27	            <div class="hero__cta">
    28	              <ZButton :as="NuxtLink" to="/contact" variant="primary" size="lg">
    29	                Discuter de votre projet
    30	                <template #iconRight><ZIcon name="arrow" /></template>
    31	              </ZButton>
    32	              <ZButton :as="NuxtLink" to="/about" variant="secondary" size="lg"> Voir le parcours &amp; CV </ZButton>
    33	            </div>
    34	          </div>
    35	
    36	          <!-- Colonne droite : terminal hero cinétique -->
    37	          <div class="anim hero__term-col">
    38	            <HomeHeroTerminal :auto-start="isBootFinished" />
    39	          </div>
    40	        </div>
    41	      </div>
    42	    </section>
    43	
    44	    <!-- Aperçu services (porté de ServicesPreview, Home.jsx) -->
    45	    <section class="section">
    46	      <div class="container">
    47	        <p class="eyebrow"><span aria-hidden="true">// </span>ce que je fais</p>
    48	        <h2 class="section__title">Trois façons de travailler ensemble</h2>
    49	        <ul class="grid-3">
    50	          <li v-for="service in services" :key="service.id">
    51	            <ZCard class="offer" interactive :accent="service.featured" :featured="service.featured">
    52	              <div class="offer__icon"><ZIcon :name="service.icon" /></div>
    53	              <h3 class="offer__title">{{ service.title }}</h3>
    54	              <p class="offer__desc">{{ service.desc }}</p>
    55	              <NuxtLink to="/services" class="offer__more" :aria-label="`En savoir plus sur ${service.title}`">
    56	                En savoir plus →
    57	              </NuxtLink>
    58	            </ZCard>
    59	          </li>
    60	        </ul>
    61	      </div>
    62	    </section>
    63	
    64	    <!-- Stats + projets sélectionnés — section en creux partagée (stories 3.2 / 3.3) -->
    65	    <section class="section section--sunken">
    66	      <div class="container">
    67	        <div class="statrow">
    68	          <div v-for="stat in stats" :key="stat.id" class="stat">
    69	            <b>{{ stat.value }}</b>
    70	            <span>{{ stat.label }}</span>
    71	          </div>
    72	        </div>
    73	
    74	        <h2 class="eyebrow"><span aria-hidden="true">// </span>projets sélectionnés</h2>
    75	        <ul class="grid-2 projects">
    76	          <li v-for="project in projects" :key="project.name">
    77	            <ZCard
    78	              class="project"
    79	              :interactive="Boolean(project.url)"
    80	              :data-hot="Boolean(project.url) ? '' : undefined"
    81	              :as="project.url ? ZExternalLink : 'div'"
    82	              :href="project.url || undefined"
    83	              :rel="project.url ? 'noopener noreferrer' : undefined"
    84	            >
    85	              <div class="project__head">
    86	                <h3 class="project__name">{{ project.name }}</h3>
    87	                <span class="project__role">{{ project.role }}</span>
    88	              </div>
    89	              <p class="prose project__desc">{{ project.desc }}</p>
    90	              <ul class="hero__tags">
    91	                <li v-for="tag in project.tags" :key="tag">
    92	                  <ZTag>{{ tag }}</ZTag>
    93	                </li>
    94	              </ul>
    95	            </ZCard>
    96	          </li>
    97	        </ul>
    98	      </div>
    99	    </section>
   100	  </main>
   101	</template>
   102	
   103	<script setup lang="ts">
   104	// Page d'accueil — refonte Hero Full Stack TS & Terminal cinétique (Story 11.2).
   105	// Architecture multi-pages Nuxt 4, dark-first, accent orange.
   106	import { ref } from "vue";
   107	import { NuxtLink, ZExternalLink } from "#components";
   108	import { SITE } from "~/data/site";
   109	
   110	const isBootFinished = ref(false);
   111	
   112	function onBootComplete() {
   113	  isBootFinished.value = true;
   114	}
   115	
   116	// Aperçu des 3 offres (data.js `services`). `featured` → carte mise en avant
   117	// (accent + glow). Icônes mappées sur le set ZIcon (wp / code / spark, story 2.7).
   118	// `id` = clé v-for stable (indépendante du contenu affiché).
   119	const services = [
   120	  {
   121	    id: "wordpress",
   122	    icon: "wp",
   123	    title: "WordPress sur-mesure",
   124	    desc: "Thèmes et plugins développés à la main — rapides, maintenables, et faciles à éditer pour vous.",
   125	    featured: false,
   126	  },
   127	  {
   128	    id: "apps",
   129	    icon: "code",
   130	    title: "Applications web",
   131	    desc: "Des produits complets en Symfony, Nest.js et Nuxt.js, pensés en architecture propre.",
   132	    featured: true,
   133	  },
   134	  {
   135	    id: "ia",
   136	    icon: "spark",
   137	    title: "IA & automatisation",
   138	    desc: "L'IA au service du code : agents, workflows n8n, et intégrations LLM dans vos outils.",
   139	    featured: false,
   140	  },
   141	];
   142	
   143	// Chiffres clés (data.js `stats`) — texte exact (séparateur ·), pas d'emoji.
   144	const stats = [
   145	  { id: "stat-1", value: "8+", label: "ans dans la tech" },
   146	  { id: "stat-2", value: "3", label: "stacks maîtrisés" },
   147	  { id: "stat-3", value: "1", label: "SaaS fondé · keova.app" },
   148	];
   149	
   150	// Projets sélectionnés — source unique `app/data/site.ts`. Cartes rendues en liens externes.
   151	const projects = SITE.projects;
   152	
   153	const siteUrl = useSiteUrl();
   154	const homeJsonLd = [
   155	  {
   156	    "@context": "https://schema.org",
   157	    "@type": "WebSite",
   158	    name: "Simon Jouan — Développeur Full Stack TypeScript",
   159	    url: siteUrl,
   160	    description: SITE.profile.role,
   161	  },
   162	  {
   163	    "@context": "https://schema.org",
   164	    "@type": "Person",
   165	    name: SITE.profile.name,
   166	    jobTitle: SITE.profile.role,
   167	    url: siteUrl,
   168	    image: `${siteUrl}/images/portrait.jpeg`,
   169	    email: SITE.profile.email,
   170	    address: {
   171	      "@type": "PostalAddress",
   172	      addressLocality: SITE.profile.city,
   173	      addressCountry: "FR",
   174	    },
   175	  },
   176	];
   177	
   178	usePageSeo({
   179	  title: "Simon Jouan — Développeur Full Stack TypeScript · Nuxt & NestJS",
   180	  description:
   181	    "Développeur Full Stack TypeScript freelance : création d'applications web et plateformes SaaS modernes avec Nuxt, NestJS et PostgreSQL.",
   182	  path: "/",
   183	  image: "/images/portrait.jpeg",
   184	  type: "website",
   185	  jsonLd: homeJsonLd,
   186	});
   187	</script>
   188	
   189	<style lang="scss" scoped>
   190	/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis kit.css / Home.jsx */
   191	.home {
   192	  display: block;
   193	}
   194	
   195	// Entrée one-shot (pas une boucle) — keyframe globale fade-rise (_root.scss).
   196	.anim {
   197	  animation: fade-rise var(--dur-slow) var(--ease-out) both;
   198	}
   199	
   200	.hero__term-col {
   201	  // Décalage d'entrée fidèle à Home.jsx (animationDelay 80ms) — pas de token motion
   202	  // équivalent (les --dur-* couvrent les transitions, pas les délais d'orchestration).
   203	  animation-delay: 80ms;
   204	}
   205	
   206	// ---- Hero (porté de kit.css : .hero, .hero__grad, .hero__in, .hero__grid…) ----
   207	.hero {
   208	  position: relative;
   209	  overflow: hidden;
   210	}
   211	
   212	.hero__grad {
   213	  // Dégradés décoratifs dérivés des tokens (orange accent + aubergine saturé) via
   214	  // color-mix — pas de valeur HSL en dur. Base = fond de page. Fidèle à kit.css
   215	  // (.hero__grad : aubergine ~60 % de saturation → token --aubergine-vivid).
   216	  background:
   217	    radial-gradient(900px 500px at 78% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
   218	    radial-gradient(
   219	      700px 500px at 0% 110%,
   220	      color-mix(in srgb, var(--aubergine-vivid) 28%, transparent),
   221	      transparent 60%
   222	    ),
   223	    var(--bg-page);
   224	}
   225	
   226	.hero__in {
   227	  position: relative;
   228	  z-index: 1;
   229	
   230	  // padding-block uniquement : le gutter horizontal vient de .container
   231	  // (longhands distincts → pas de conflit de shorthand entre les deux classes).
   232	  padding-block: var(--space-20);
   233	}
   234	
   235	.hero__grid {
   236	  display: grid;
   237	  grid-template-columns: 1.05fr 0.95fr;
   238	  gap: var(--space-12);
   239	  align-items: center;
   240	}
   241	
   242	// .section / .container / .eyebrow / .prose : primitives de layout globales
   243	// (app/assets/scss/base/_layout.scss) — non redéclarées ici.
   244	
   245	// ---- Colonne texte ----
   246	.hero__title {
   247	  font-family: var(--font-mono);
   248	  font-size: var(--fs-6xl);
   249	  font-weight: var(--fw-light);
   250	  letter-spacing: var(--ls-tight);
   251	  color: var(--text-strong);
   252	
   253	  em {
   254	    font-style: normal;
   255	    color: var(--accent);
   256	  }
   257	}
   258	
   259	.hero__sub {
   260	  max-width: 46ch;
   261	  margin: var(--space-5) 0 var(--space-6);
   262	  font-family: var(--font-sans);
   263	  font-size: var(--fs-lg);
   264	  line-height: var(--lh-relaxed);
   265	  color: var(--text-body);
   266	}
   267	
   268	.hero__cta {
   269	  display: flex;
   270	  flex-wrap: wrap;
   271	  gap: var(--space-3);
   272	  margin-bottom: var(--space-6);
   273	}
   274	
   275	// ---- Badge de disponibilité & CTAs ----
   276	.hero__badge-wrap {
   277	  display: inline-flex;
   278	  align-items: center;
   279	  gap: var(--space-2);
   280	  margin-bottom: var(--space-6);
   281	  font-family: var(--font-mono);
   282	  font-size: var(--fs-sm);
   283	  color: var(--text-muted);
   284	
   285	  a {
   286	    color: var(--accent);
   287	    text-decoration: underline;
   288	
   289	    &:hover {
   290	      color: var(--accent-hover);
   291	    }
   292	  }
   293	}
   294	
   295	.hero__pulse-dot {
   296	  width: 8px;
   297	  height: 8px;
   298	  border-radius: var(--radius-circle);
   299	  background: var(--term-green);
   300	  box-shadow: 0 0 8px var(--term-green);
   301	}
   302	
   303	.section__title {
   304	  margin-bottom: var(--space-8);
   305	  font-family: var(--font-mono);
   306	  font-size: var(--fs-3xl);
   307	  font-weight: var(--fw-regular);
   308	  color: var(--text-strong);
   309	}
   310	
   311	// ---- Aperçu services (porté de .grid-3 / .offer*) ----
   312	.grid-3 {
   313	  display: grid;
   314	  grid-template-columns: repeat(3, 1fr);
   315	  gap: var(--space-5);
   316	  margin: 0;
   317	  padding: 0;
   318	  list-style: none;
   319	
   320	  > li {
   321	    display: flex;
   322	  }
   323	}
   324	
   325	.offer {
   326	  display: flex;
   327	  flex-direction: column;
   328	  width: 100%;
   329	}
   330	

exec
/bin/zsh -lc "sed -n '1,120p' app/layouts/default.vue; sed -n '1,260p' app/components/terminal/TerminalComponent.vue; rg -n 'useTerminal|createNewTerminal|defineExpose|dialog|focus\\(' app/components/terminal app/components | head -220" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
<template>
  <div class="init">
    <HeaderComponent />

    <slot />

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import FooterComponent from "../components/FooterComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
</script>

<style lang="scss" scoped>
.init {
  // Fond de page dark-first (token). Remplace l'ancien dégradé legacy
  // orange/aubergine (anciens tokens SCSS `_color.$`) qui débordait derrière
  // les sections transparentes (révélé par la story 3.2). Le hero porte son
  // propre `hero__grad`, le footer son `--bg-sunken` — inchangés.
  background: var(--bg-page);

  // Flex column : header sticky en haut, footer riche poussé en bas via
  // `margin-top: auto` (le footer dépasse 56px — l'ancienne grille à hauteur
  // fixe le tronquait). --header-height/--footer-height viennent des tokens (2.1).
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
}
</style>
<template>
  <!--
    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
    `backdrop-filter: blur(10px)`. Un ancêtre filtré devient "backdrop root" et
    neutralise le `backdrop-filter` du corps (le blur DS ne s'applique alors qu'au
    contenu du header, pas à la page). Hors du header, le flou aubergine rend bien.
    Déplacement de rendu uniquement — drag/resize/focus/historique inchangés.
  -->
  <Teleport to="body">
    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput" @keydown.esc="closeTerminal">
      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
        <div class="terminal-dots">
          <div
            class="close-button"
            role="button"
            tabindex="0"
            aria-label="Fermer le terminal"
            @click="closeTerminal"
            @keydown.enter="closeTerminal"
            @keydown.space.prevent="closeTerminal"
          ></div>
          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
        </div>
        <div class="header-text">{{ defaultConfig.domainName }}</div>
      </div>

      <div class="terminal-body">
        <div v-for="(line, index) in commandLines" :key="index">
          <template v-if="line.isResponse">
            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
            <span class="terminal-response" v-html="line.text"></span>
          </template>
          <template v-else>
            <span class="git-prompt"
              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
              <span class="git-prompt-directory">~</span>
              <span class="git-prompt-separator">$</span></span
            >&nbsp;{{ line.text }}
          </template>
        </div>
        <span class="git-prompt"
          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
          <span class="git-prompt-directory">~</span>
          <span class="git-prompt-separator">$</span></span
        >&nbsp;<input
          ref="userInputRef"
          v-model="userInput"
          type="text"
          class="user-input"
          aria-label="Saisie de commande du terminal"
          @keydown.enter="submitInput"
          @keydown.arrow-up="handleHistoryNavigation"
          @keydown.arrow-down="handleHistoryNavigation"
        />
      </div>

      <div class="resize-handle" @mousedown="handleResizeMouseDown"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import programManager from "~/components/terminal/programs/ProgramManager";
import { escapeHtml } from "~/utils/functions";
// Import statique : les valeurs par défaut sont disponibles dès l'exécution du setup,
// sans course asynchrone qui laissait parfois la config vide à l'initialisation.
import { terminalDefaults } from "~/terminal.config";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant
// (props/refs/cycle de vie/handlers identiques). `defineOptions` préserve le nom du composant.
defineOptions({ name: "TerminalComponent" });

const props = withDefaults(
  defineProps<{
    id?: number;
    createNewTerminal?: (config?: ITerminalConfig) => void;
    terminalConfig?: ITerminalConfig;
  }>(),
  {
    id: 0,
    createNewTerminal: () => {},
    terminalConfig: () => ({}),
  },
);

const commandLines = ref<{ text: string; isResponse: boolean }[]>([]);
const userInput = ref<string>("");
const resizing = ref<boolean>(false);
const dragging = ref<boolean>(false);
const dragStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const terminalElement = ref<HTMLElement | null>(null);
const userInputRef = ref<HTMLInputElement | null>(null);
// Élément déclencheur (bouton Terminal du header / CTA /contact) — mémorisé à
// l'ouverture pour y renvoyer le focus à la fermeture (a11y clavier, story 9.2).
const openerElement = ref<HTMLElement | null>(null);
const commandHistory = ref<string[]>([]);
const commandHistoryPosition = ref<number>(-1);
const defaultConfig = ref({
  width: props.terminalConfig.width || terminalDefaults.width,
  height: props.terminalConfig.height || terminalDefaults.height,
  userName: props.terminalConfig.userName || terminalDefaults.userName,
  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
});

if (defaultConfig.value.initialData) {
  commandLines.value.push({
    text: defaultConfig.value.initialData,
    isResponse: true,
  });
}

const focusUserInput = () => {
  if (terminalElement.value) {
    // Garantir que la valeur de zIndex ne dépasse pas la limite du navigateur.
    terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
  }

  // Mettre le focus sur l'élément input
  if (userInputRef.value) {
    userInputRef.value.focus();
  }
};

// Pousse la commande saisie dans l'historique, réinitialise la navigation et vide la saisie.
// Commun à la branche `clear` et au flux normal (factorisation — pas de bookkeeping dupliqué).
const recordHistoryAndResetInput = (): void => {
  commandHistory.value.push(userInput.value);
  commandHistoryPosition.value = -1;
  userInput.value = "";
};

const submitInput = (): void => {
  const command = userInput.value.trim();
  if (command) {
    // `clear` : seul le composant possède le buffer `commandLines` → on l'intercepte ici
    // pour vider l'écran sans écho ni ligne résiduelle. La commande reste découvrable via
    // `help` grâce au programme `programs/Clear.ts` enregistré dans le ProgramManager.
    if (command === "clear") {
      commandLines.value = [];
      recordHistoryAndResetInput();
      return;
    }

    commandLines.value.push({
      text: userInput.value,
      isResponse: false,
    });

    const output = runCommand(command);
    if (output instanceof HTMLElement) {
      commandLines.value.push({ text: output.outerHTML, isResponse: true });
    } else {
      commandLines.value.push({ text: output, isResponse: true });
    }

    recordHistoryAndResetInput();
  }
};

const runCommand = (command: string): string | HTMLElement => {
  const program = programManager.get(command);
  if (program) {
    return program.run(
      { userName: defaultConfig.value.userName },
      props.createNewTerminal as (config?: ITerminalConfig) => void,
      program.initialData,
    );
  }
  // La commande provient de la saisie utilisateur : on l'échappe car la réponse est rendue via v-html.
  return `Commande inconnue : ${escapeHtml(command)}`;
};

const handleHistoryNavigation = (event: KeyboardEvent): void => {
  if (event.key === "ArrowUp") {
    if (commandHistoryPosition.value < commandHistory.value.length - 1) {
      commandHistoryPosition.value++;
    }
  } else if (event.key === "ArrowDown") {
    if (commandHistoryPosition.value > -1) {
      commandHistoryPosition.value--;
    }
  }

  if (commandHistoryPosition.value > -1 && commandHistoryPosition.value < commandHistory.value.length) {
    userInput.value = commandHistory.value[commandHistory.value.length - 1 - commandHistoryPosition.value] ?? "";
  } else {
    userInput.value = "";
  }
};

const handleResizeMouseDown = (event: MouseEvent): void => {
  if (event.target instanceof HTMLElement && event.target.classList.contains("resize-handle")) {
    resizing.value = true;

    // Écouteurs globaux : le redimensionnement continue même si le curseur sort
    // de la poignée de 16px pendant le glissement.
    window.addEventListener("mousemove", handleGlobalResizeMouseMove);
    window.addEventListener("mouseup", handleGlobalResizeMouseUp);
  }
};

const handleGlobalResizeMouseMove = (event: MouseEvent): void => {
  if (resizing.value && terminalElement.value) {
    const terminalRect = terminalElement.value.getBoundingClientRect();
    const minWidth = 320;
    const minHeight = 180;
    const newWidth = Math.max(minWidth, event.clientX - terminalRect.left);
    const newHeight = Math.max(minHeight, event.clientY - terminalRect.top);

    terminalElement.value.style.width = `${newWidth}px`;
    terminalElement.value.style.height = `${newHeight}px`;
  }
};

const handleGlobalResizeMouseUp = (): void => {
  resizing.value = false;
  window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
  window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
};

const handleMouseUp = (): void => {
  resizing.value = false;
  dragging.value = false;
};

const handleHeaderMouseDown = (event: MouseEvent): void => {
  if (
    event.target instanceof HTMLElement &&
    event.currentTarget instanceof HTMLElement &&
    event.currentTarget.parentElement &&
    event.target.classList.contains("terminal-header")
  ) {
    dragging.value = true;
    dragStartPosition.value = {
      x: event.clientX - event.currentTarget.parentElement.offsetLeft,
      y: event.clientY - event.currentTarget.parentElement.offsetTop,
    };

    // Ajouter les écouteurs d'événements globaux
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
  }
};

// Créer une nouvelle fonction pour gérer les événements globaux de déplacement de la souris
const handleGlobalMouseMove = (event: MouseEvent): void => {
  if (dragging.value && terminalElement.value) {
    const terminalElementValue = terminalElement.value;
    // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
    // on le garde collé au bord (0) plutôt que de le pousser hors écran (valeur négative).
    const maxLeft = Math.max(0, window.innerWidth - terminalElementValue.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - terminalElementValue.offsetHeight);
    const newLeft = Math.min(Math.max(0, event.clientX - dragStartPosition.value.x), maxLeft);
    const newTop = Math.min(Math.max(0, event.clientY - dragStartPosition.value.y), maxTop);

    terminalElementValue.style.left = `${newLeft}px`;
app/components/HeaderComponent.vue:106:  terminalManager.value?.createNewTerminal();
app/components/HeaderComponent.vue:112:const { register: registerTerminalLauncher, unregister: unregisterTerminalLauncher } = useTerminal();
app/components/HeaderComponent.vue:129:  nextTick(() => firstMenuLink.value?.focus());
app/components/HeaderComponent.vue:137:function closeMenuAndRefocus() {
app/components/HeaderComponent.vue:142:  nextTick(() => burgerButton.value?.focus());
app/components/HeaderComponent.vue:160:    closeMenuAndRefocus();
app/components/terminal/interfaces/IProgram.ts:9:    createNewTerminal?: (config?: ITerminalConfig) => void,
app/components/terminal/interfaces/IProgram.ts:9:    createNewTerminal?: (config?: ITerminalConfig) => void,
app/components/terminal/programs/About.ts:250:  run: (_, createNewTerminal, initialData?: string) => {
app/components/terminal/programs/About.ts:251:    if (createNewTerminal && initialData) {
app/components/terminal/programs/About.ts:252:      createNewTerminal({
app/components/terminal/programs/About.ts:260:    if (createNewTerminal) {
app/components/terminal/programs/About.ts:261:      createNewTerminal();
app/components/terminal/programs/NewTerminal.ts:7:  run: (_, createNewTerminal, initialData?: string) => {
app/components/terminal/programs/NewTerminal.ts:8:    if (createNewTerminal && initialData) {
app/components/terminal/programs/NewTerminal.ts:9:      createNewTerminal({ initialData });
app/components/terminal/programs/NewTerminal.ts:13:    if (createNewTerminal) {
app/components/terminal/programs/NewTerminal.ts:14:      createNewTerminal();
app/components/terminal/TerminalComponent.vue:79:    createNewTerminal?: (config?: ITerminalConfig) => void;
app/components/terminal/TerminalComponent.vue:84:    createNewTerminal: () => {},
app/components/terminal/TerminalComponent.vue:124:    userInputRef.value.focus();
app/components/terminal/TerminalComponent.vue:169:      props.createNewTerminal as (config?: ITerminalConfig) => void,
app/components/terminal/TerminalComponent.vue:289:  openerElement.value?.focus();
app/components/terminal/programs/About.ts:250:  run: (_, createNewTerminal, initialData?: string) => {
app/components/terminal/programs/About.ts:251:    if (createNewTerminal && initialData) {
app/components/terminal/programs/About.ts:252:      createNewTerminal({
app/components/terminal/programs/About.ts:260:    if (createNewTerminal) {
app/components/terminal/programs/About.ts:261:      createNewTerminal();
app/components/terminal/TerminalManagerComponent.vue:6:        :create-new-terminal="createNewTerminal"
app/components/terminal/TerminalManagerComponent.vue:22:const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
app/components/terminal/TerminalManagerComponent.vue:31:// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
app/components/terminal/TerminalManagerComponent.vue:34:// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
app/components/terminal/TerminalManagerComponent.vue:36:defineExpose({ createNewTerminal });
app/components/terminal/TerminalManagerComponent.vue:6:        :create-new-terminal="createNewTerminal"
app/components/terminal/TerminalManagerComponent.vue:22:const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
app/components/terminal/TerminalManagerComponent.vue:31:// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
app/components/terminal/TerminalManagerComponent.vue:33:// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
app/components/terminal/TerminalManagerComponent.vue:34:// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
app/components/terminal/TerminalManagerComponent.vue:36:defineExpose({ createNewTerminal });
app/components/terminal/programs/NewTerminal.ts:7:  run: (_, createNewTerminal, initialData?: string) => {
app/components/terminal/programs/NewTerminal.ts:8:    if (createNewTerminal && initialData) {
app/components/terminal/programs/NewTerminal.ts:9:      createNewTerminal({ initialData });
app/components/terminal/programs/NewTerminal.ts:13:    if (createNewTerminal) {
app/components/terminal/programs/NewTerminal.ts:14:      createNewTerminal();
app/components/terminal/TerminalComponent.vue:79:    createNewTerminal?: (config?: ITerminalConfig) => void;
app/components/terminal/TerminalComponent.vue:84:    createNewTerminal: () => {},
app/components/terminal/TerminalComponent.vue:124:    userInputRef.value.focus();
app/components/terminal/TerminalComponent.vue:169:      props.createNewTerminal as (config?: ITerminalConfig) => void,
app/components/terminal/TerminalComponent.vue:289:  openerElement.value?.focus();
app/components/home/HomeHeroTerminal.vue:45:        aria-haspopup="dialog"
app/components/home/HomeHeroTerminal.vue:63:import { useTerminal } from "~/composables/useTerminal";
app/components/home/HomeHeroTerminal.vue:68:// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.
app/components/home/HomeHeroTerminal.vue:79:const { open: openTerminal } = useTerminal();

exec
/bin/zsh -lc "sed -n '250,330p' app/components/terminal/TerminalComponent.vue; rg -n 'terminalDefaults|userName|domainName' app/terminal.config.ts app -g '*.ts' -g '*.vue' | head -100; git status --short" in /Users/simon/dev/jouan.ovh
 succeeded in 0ms:
const handleGlobalMouseMove = (event: MouseEvent): void => {
  if (dragging.value && terminalElement.value) {
    const terminalElementValue = terminalElement.value;
    // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
    // on le garde collé au bord (0) plutôt que de le pousser hors écran (valeur négative).
    const maxLeft = Math.max(0, window.innerWidth - terminalElementValue.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - terminalElementValue.offsetHeight);
    const newLeft = Math.min(Math.max(0, event.clientX - dragStartPosition.value.x), maxLeft);
    const newTop = Math.min(Math.max(0, event.clientY - dragStartPosition.value.y), maxTop);

    terminalElementValue.style.left = `${newLeft}px`;
    terminalElementValue.style.top = `${newTop}px`;
  }
};

// Créer une nouvelle fonction pour gérer les événements globaux de relâchement de la souris
const handleGlobalMouseUp = (_: MouseEvent): void => {
  if (dragging.value) {
    dragging.value = false;

    // Supprimer les écouteurs d'événements globaux
    window.removeEventListener("mousemove", handleGlobalMouseMove);
    window.removeEventListener("mouseup", handleGlobalMouseUp);
  }
};

const updateTerminalDimensions = (): void => {
  if (terminalElement.value) {
    terminalElement.value.style.width = defaultConfig.value.width;
    terminalElement.value.style.height = defaultConfig.value.height;
  }
};

const closeTerminal = () => {
  if (terminalElement.value) {
    terminalElement.value.style.display = "none";
  }
  // Retour du focus au déclencheur (a11y : ne pas perdre le focus sur <body>
  // à la fermeture clavier — Échap ou Entrée/Espace sur la pastille close).
  openerElement.value?.focus();
};

onMounted(() => {
  updateTerminalDimensions();
  // Mémorise le déclencheur AVANT de déplacer le focus dans le terminal : à ce
  // stade, l'élément actif est encore le bouton qui a ouvert le terminal.
  if (import.meta.client && document.activeElement instanceof HTMLElement) {
    openerElement.value = document.activeElement;
  }
  focusUserInput();
});

watch(
  () => [defaultConfig.value.width, defaultConfig.value.height],
  () => {
    updateTerminalDimensions();
  },
);

onUnmounted(() => {
  // Filet de sécurité : retrait des écouteurs globaux si le composant est démonté en plein drag/resize.
  window.removeEventListener("mousemove", handleGlobalMouseMove);
  window.removeEventListener("mouseup", handleGlobalMouseUp);
  window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
  window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
});
</script>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée de TerminalWindow.jsx */
.terminal {
  // Châssis fenêtre — porté de TerminalWindow.jsx (.ds-term). STYLE uniquement : la
  // logique (drag/resize/close/focus/historique/commandes) et les classes porteuses de
  // handlers (terminal-header, close-button, user-input, resize-handle) sont préservées.
  // `position: fixed` (et non absolute) : le terminal est <Teleport>é sur <body> (pour que
  // son backdrop-filter rende hors du <header> filtré) ; fixed le garde relatif au VIEWPORT,
  // cohérent avec le clamp du drag (window.innerWidth/innerHeight) et évite une fenêtre
  // hors-écran ou un saut de scroll au focus quand la page est défilée.
  // Dimensions/pastilles (px) = structurelles (DS), portées telles quelles.
  box-sizing: border-box;
  position: fixed;
app/terminal.config.ts:1:export const terminalDefaults = {
app/terminal.config.ts:4:  userName: "anon.",
app/terminal.config.ts:5:  domainName: "jouan.ovh",
app/components/terminal/interfaces/ITerminalConfig.ts:4:  userName?: string;
app/components/terminal/interfaces/ITerminalConfig.ts:5:  domainName?: string;
app/components/terminal/programs/HelloWorld.ts:7:    return `Bonjour, ${config?.userName ?? "anon."} ! Bienvenue dans le terminal.`;
app/components/terminal/TerminalComponent.vue:25:        <div class="header-text">{{ defaultConfig.domainName }}</div>
app/components/terminal/TerminalComponent.vue:36:              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
app/components/terminal/TerminalComponent.vue:43:          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
app/components/terminal/TerminalComponent.vue:70:import { terminalDefaults } from "~/terminal.config";
app/components/terminal/TerminalComponent.vue:102:  width: props.terminalConfig.width || terminalDefaults.width,
app/components/terminal/TerminalComponent.vue:103:  height: props.terminalConfig.height || terminalDefaults.height,
app/components/terminal/TerminalComponent.vue:104:  userName: props.terminalConfig.userName || terminalDefaults.userName,
app/components/terminal/TerminalComponent.vue:105:  domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
app/components/terminal/TerminalComponent.vue:106:  initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
app/components/terminal/TerminalComponent.vue:168:      { userName: defaultConfig.value.userName },
app/terminal.config.ts:1:export const terminalDefaults = {
app/terminal.config.ts:4:  userName: "anon.",
app/terminal.config.ts:5:  domainName: "jouan.ovh",
 M app/pages/index.vue
 M docs/implementation-artifacts/11-2-sequence-de-boot-interactive-jouanos-et-hero-commercial-cinetique.md
 M docs/implementation-artifacts/sprint-status.yaml
?? app/components/home/HomeBootOverlay.vue
?? app/components/home/HomeHeroTerminal.vue
?? docs/implementation-artifacts/code-reviews/11-2/

codex
- [`HomeBootOverlay.vue`](</Users/simon/dev/jouan.ovh/app/components/home/HomeBootOverlay.vue:45>) reste visible environ 2 secondes : les délais des étapes, le délai final et les 600 ms de disparition dépassent la fenêtre spécifiée de 1 à 1,5 seconde.

- L’overlay est rendu côté SSR avant la lecture de `sessionStorage`, ce qui provoque un flash du boot à chaque rechargement d’une session déjà mémorisée.

- Sous `prefers-reduced-motion`, `HomeHeroTerminal` appelle `showInstantState()` même lorsque `autoStart` vaut `false`, contournant la synchronisation avec la fin du boot.

- Le badge affiche toujours « Disponible » sans consulter `SITE.profile.available`, et peut donc annoncer une disponibilité devenue fausse.

- Lorsque `SITE.profile.maltUrl` est absent, le texte laisse un séparateur final « · » sans lien associé.

- Les sorties du terminal et les noms de projets sont recopiés en dur dans `HomeHeroTerminal.vue`, en contradiction avec la source de vérité `SITE.projects`; les noms affichés divergent notamment de `TryOn` et `Nodium`.

- Le prompt `anon.@jouan.ovh` est répété dans plusieurs templates au lieu d’utiliser la configuration terminal ou une donnée centralisée, ce qui le rend incohérent avec un éventuel domaine d’environnement.

- Le rôle, le titre SEO, le nom JSON-LD et le H1 sont maintenus séparément en dur alors que `SITE.profile.role` existe déjà, permettant des divergences silencieuses lors d’une mise à jour du profil.

- Les sorties `whoami` et `cat focus.txt` introduisent plusieurs phrases en anglais dans une interface dont la langue et le contenu doivent rester en français.

- `.hero__pulse-dot` est présenté comme une puce pulsée mais ne possède aucune animation ni changement d’opacité.

- `box-shadow: 0 0 8px var(--term-green)` introduit une valeur d’ombre en dur malgré la règle imposant l’usage des tokens du Design System.

- La barre exposée avec `role="progressbar"` n’a ni `aria-label` ni `aria-labelledby`, et sera annoncée sans contexte compréhensible par les technologies d’assistance.

- Le texte « cliquez ou appuyez sur Échap » est un simple `<div>` non focalisable et non activable comme contrôle ; l’action de contournement repose uniquement sur la connaissance préalable d’un écouteur clavier global.

- L’overlay plein écran utilise `role="status"` mais ne rend pas le contenu sous-jacent inerte ou modal, laissant les liens et boutons de la page atteignables au clavier alors qu’ils sont visuellement recouverts.

- Les lignes et sorties du terminal sont toutes marquées `aria-hidden="true"` sans alternative accessible, de sorte que les informations présentées dans le terminal sont totalement absentes pour un utilisateur de lecteur d’écran.

- Le bouton annonce `aria-haspopup="dialog"`, mais le composant terminal ouvert reste un `<div>` sans `role="dialog"`, nom accessible, `aria-modal` ni véritable gestion de modalité.

- Aucun test n’est ajouté pour vérifier la durée réelle du boot, la persistance de session, le raccourci Échap, le comportement reduced-motion, la séquence de frappe ou l’ouverture du terminal, malgré les affirmations de validation complète dans le journal de story.

- Le journal de story indique que le fichier Markdown a été « MODIFIED », alors que le diff le crée avec `new file`, ce qui rend la liste des fichiers et l’historique de réalisation incohérents.
tokens used
103 374
- [`HomeBootOverlay.vue`](</Users/simon/dev/jouan.ovh/app/components/home/HomeBootOverlay.vue:45>) reste visible environ 2 secondes : les délais des étapes, le délai final et les 600 ms de disparition dépassent la fenêtre spécifiée de 1 à 1,5 seconde.

- L’overlay est rendu côté SSR avant la lecture de `sessionStorage`, ce qui provoque un flash du boot à chaque rechargement d’une session déjà mémorisée.

- Sous `prefers-reduced-motion`, `HomeHeroTerminal` appelle `showInstantState()` même lorsque `autoStart` vaut `false`, contournant la synchronisation avec la fin du boot.

- Le badge affiche toujours « Disponible » sans consulter `SITE.profile.available`, et peut donc annoncer une disponibilité devenue fausse.

- Lorsque `SITE.profile.maltUrl` est absent, le texte laisse un séparateur final « · » sans lien associé.

- Les sorties du terminal et les noms de projets sont recopiés en dur dans `HomeHeroTerminal.vue`, en contradiction avec la source de vérité `SITE.projects`; les noms affichés divergent notamment de `TryOn` et `Nodium`.

- Le prompt `anon.@jouan.ovh` est répété dans plusieurs templates au lieu d’utiliser la configuration terminal ou une donnée centralisée, ce qui le rend incohérent avec un éventuel domaine d’environnement.

- Le rôle, le titre SEO, le nom JSON-LD et le H1 sont maintenus séparément en dur alors que `SITE.profile.role` existe déjà, permettant des divergences silencieuses lors d’une mise à jour du profil.

- Les sorties `whoami` et `cat focus.txt` introduisent plusieurs phrases en anglais dans une interface dont la langue et le contenu doivent rester en français.

- `.hero__pulse-dot` est présenté comme une puce pulsée mais ne possède aucune animation ni changement d’opacité.

- `box-shadow: 0 0 8px var(--term-green)` introduit une valeur d’ombre en dur malgré la règle imposant l’usage des tokens du Design System.

- La barre exposée avec `role="progressbar"` n’a ni `aria-label` ni `aria-labelledby`, et sera annoncée sans contexte compréhensible par les technologies d’assistance.

- Le texte « cliquez ou appuyez sur Échap » est un simple `<div>` non focalisable et non activable comme contrôle ; l’action de contournement repose uniquement sur la connaissance préalable d’un écouteur clavier global.

- L’overlay plein écran utilise `role="status"` mais ne rend pas le contenu sous-jacent inerte ou modal, laissant les liens et boutons de la page atteignables au clavier alors qu’ils sont visuellement recouverts.

- Les lignes et sorties du terminal sont toutes marquées `aria-hidden="true"` sans alternative accessible, de sorte que les informations présentées dans le terminal sont totalement absentes pour un utilisateur de lecteur d’écran.

- Le bouton annonce `aria-haspopup="dialog"`, mais le composant terminal ouvert reste un `<div>` sans `role="dialog"`, nom accessible, `aria-modal` ni véritable gestion de modalité.

- Aucun test n’est ajouté pour vérifier la durée réelle du boot, la persistance de session, le raccourci Échap, le comportement reduced-motion, la séquence de frappe ou l’ouverture du terminal, malgré les affirmations de validation complète dans le journal de story.

- Le journal de story indique que le fichier Markdown a été « MODIFIED », alors que le diff le crée avec `new file`, ce qui rend la liste des fichiers et l’historique de réalisation incohérents.

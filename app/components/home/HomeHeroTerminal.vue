<template>
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
      <!-- Lignes complètes terminées -->
      <template v-for="(row, idx) in executedRows" :key="idx">
        <p class="hero-term__line" aria-hidden="true">
          <span class="prm">
            <span class="prm__user">anon.@jouan.ovh</span>
            <span class="prm__sep">:</span>
            <span class="prm__dir">~</span>
            <span class="prm__sep">$ </span>
            <span class="prm__cmd">{{ row.cmd }}</span>
          </span>
        </p>
        <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
      </template>

      <!-- Ligne en cours de frappe -->
      <p v-if="currentTypingLine" class="hero-term__line" aria-hidden="true">
        <span class="prm">
          <span class="prm__user">anon.@jouan.ovh</span>
          <span class="prm__sep">:</span>
          <span class="prm__dir">~</span>
          <span class="prm__sep">$ </span>
          <span class="prm__cmd">{{ currentTypingText }}</span>
          <span class="prm__caret" />
        </span>
      </p>

      <!-- Bouton d'ouverture du terminal interactif / invite finale -->
      <button
        v-if="isSequenceComplete"
        type="button"
        class="hero-term__open"
        aria-label="Ouvrir le terminal interactif"
        aria-haspopup="dialog"
        @click="openTerminal"
      >
        <span class="prm">
          <span class="prm__user">anon.@jouan.ovh</span>
          <span class="prm__sep">:</span>
          <span class="prm__dir">~</span>
          <span class="prm__sep">$ </span>
          <span class="prm__cmd">help</span>
          <span class="prm__caret" aria-hidden="true" />
        </span>
      </button>

      <!-- Fallback statique si JavaScript est désactivé -->
      <noscript>
        <div>
          <template v-for="(row, idx) in fullRows" :key="`noscript-${idx}`">
            <p class="hero-term__line">
              <span class="prm">
                <span class="prm__user">anon.@jouan.ovh</span>
                <span class="prm__sep">:</span>
                <span class="prm__dir">~</span>
                <span class="prm__sep">$ </span>
                <span class="prm__cmd">{{ row.cmd }}</span>
              </span>
            </p>
            <p class="hero-term__out" :class="`hero-term__out--${row.tone}`">{{ row.out }}</p>
          </template>
        </div>
      </noscript>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useTerminal } from "~/composables/useTerminal";
import { SITE } from "~/data/site";

// Terminal hero cinétique (Story 11.2 / AC-2 / CAP-3).
// Déroule une animation de frappe séquentielle pour whoami, cat focus.txt et ls ~/projets.
// Neutralisé sous prefers-reduced-motion (affichage statique complet immédiat).
// Ouvre l'easter-egg terminal via useTerminal().open sur l'invite finale help.

const props = withDefaults(
  defineProps<{
    autoStart?: boolean;
  }>(),
  {
    autoStart: true,
  },
);

const { open: openTerminal } = useTerminal();

interface ITermRow {
  cmd: string;
  out: string;
  tone: "ink" | "blue" | "green";
}

const projectsOutput = SITE.projects
  .map((p) => {
    if (p.url) {
      return `${p.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}/`;
    }
    return `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`;
  })
  .join("  ");

const fullRows: ITermRow[] = [
  {
    cmd: "whoami",
    out: `${SITE.profile.name} — ${SITE.profile.role}`,
    tone: "ink",
  },
  {
    cmd: "cat focus.txt",
    out: "SaaS, web apps, clean architecture, automated testing (QA) & AI engineering",
    tone: "blue",
  },
  {
    cmd: "ls ~/projets",
    out: projectsOutput,
    tone: "green",
  },
];

const executedRows = ref<ITermRow[]>([]);
const currentTypingLine = ref<ITermRow | null>(null);
const currentTypingText = ref("");
const isSequenceComplete = ref(false);

let typingTimeoutId: ReturnType<typeof setTimeout> | null = null;
let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
let motionMq: MediaQueryList | null = null;
let isStarted = false;

function showInstantState() {
  executedRows.value = [...fullRows];
  currentTypingLine.value = null;
  currentTypingText.value = "";
  isSequenceComplete.value = true;
}

function startTypingSequence() {
  if (isStarted) return;
  isStarted = true;

  const reduceMotion = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    showInstantState();
    return;
  }

  let rowIndex = 0;

  function typeRow() {
    if (rowIndex >= fullRows.length) {
      currentTypingLine.value = null;
      currentTypingText.value = "";
      isSequenceComplete.value = true;
      return;
    }

    const row = fullRows[rowIndex];
    if (!row) return;

    const activeRow: ITermRow = row;
    currentTypingLine.value = activeRow;
    currentTypingText.value = "";

    let charIndex = 0;
    const fullCmd = activeRow.cmd;

    function typeChar() {
      if (charIndex < fullCmd.length) {
        currentTypingText.value = fullCmd.slice(0, charIndex + 1);
        charIndex++;
        typingTimeoutId = setTimeout(typeChar, 46);
      } else {
        // Commande entièrement tapée, afficher le résultat après une pause
        stepTimeoutId = setTimeout(() => {
          executedRows.value.push(activeRow);
          currentTypingLine.value = null;
          currentTypingText.value = "";
          rowIndex++;
          stepTimeoutId = setTimeout(typeRow, 280);
        }, 200);
      }
    }

    typeChar();
  }

  typeRow();
}

watch(
  () => props.autoStart,
  (shouldStart) => {
    if (shouldStart && !isStarted) {
      startTypingSequence();
    }
  },
);

function onMotionChange(e: MediaQueryListEvent) {
  if (e.matches) {
    if (typingTimeoutId !== null) {
      clearTimeout(typingTimeoutId);
      typingTimeoutId = null;
    }
    if (stepTimeoutId !== null) {
      clearTimeout(stepTimeoutId);
      stepTimeoutId = null;
    }
    showInstantState();
  }
}

onMounted(() => {
  if (!import.meta.client) return;

  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionMq.addEventListener("change", onMotionChange);

  if (motionMq.matches) {
    isStarted = true;
    showInstantState();
    return;
  }

  if (props.autoStart) {
    startTypingSequence();
  }
});

onUnmounted(() => {
  motionMq?.removeEventListener("change", onMotionChange);
  if (typingTimeoutId !== null) {
    clearTimeout(typingTimeoutId);
    typingTimeoutId = null;
  }
  if (stepTimeoutId !== null) {
    clearTimeout(stepTimeoutId);
    stepTimeoutId = null;
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
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
  padding: 0 var(--space-3);
  background: var(--aubergine-black);
}

.hero-term__dots {
  display: flex;
  align-items: center;
  gap: 7px;
}

.hero-term__dot {
  width: 13px;
  height: 13px;
  border-radius: var(--radius-circle);
}

.hero-term__dot--close {
  background: var(--term-red);
}

.hero-term__dot--min {
  background: var(--term-yellow);
}

.hero-term__dot--max {
  background: var(--term-green);
}

.hero-term__title {
  position: absolute;
  inset: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wide);
  color: var(--text-muted);
  text-align: center;
  pointer-events: none;
}

.hero-term__body {
  flex: 1;
  min-height: 0;
  padding: var(--space-4);
  overflow: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--ink-1);
  background: var(--bg-terminal);
  overflow-wrap: break-word;
}

@supports (backdrop-filter: blur(5px)) {
  .hero-term__body {
    background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
    backdrop-filter: blur(5px);
  }
}

.hero-term__line {
  margin: 0;
}

.hero-term__out {
  margin: 0 0 var(--space-4);
}

.hero-term__out--ink {
  color: var(--ink-1);
}

.hero-term__out--blue {
  color: var(--term-blue);
}

.hero-term__out--green {
  color: var(--term-green);
}

.hero-term__open {
  display: block;
  width: 100%;
  padding: 0;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-xs);

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.prm {
  font-family: var(--font-mono);
}

.prm__user {
  font-weight: var(--fw-bold);
  color: var(--prompt);
}

.prm__sep {
  color: var(--ink-1);
}

.prm__dir {
  font-weight: var(--fw-bold);
  color: var(--term-blue);
}

.prm__cmd {
  color: var(--ink-1);
}

.prm__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--prompt);
  animation: caret-blink 1s steps(1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .prm__caret {
    animation: none;
  }
}
</style>

<template>
  <div
    v-if="!isDismissed"
    class="boot"
    :class="{ 'boot--done': isDone }"
    role="status"
    aria-live="polite"
    @click="finishBoot"
  >
    <div class="boot__in">
      <div class="boot__logo">
        <ZIcon name="gem" class="boot__logo-icon" />
        <b>jouan.os</b>
      </div>
      <div class="boot__line">
        <span aria-hidden="true">&gt; </span>{{ currentStepText }}
        <span v-if="currentStepOk" class="boot__ok" aria-hidden="true"> [ok]</span>
      </div>
      <div
        class="boot__bar"
        role="progressbar"
        aria-label="Progression du démarrage de jouan.os"
        :aria-valuenow="progressPercent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <i :style="{ width: `${progressPercent}%` }" />
      </div>
      <button type="button" class="boot__skip" aria-label="Passer la séquence de démarrage" @click.stop="finishBoot">
        [ cliquez ou appuyez sur Échap pour passer ]
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Séquence de démarrage stylisée jouan.os (Story 11.2 / AC-1 / CAP-2).
// S'exécute une seule fois par session (sessionStorage jouan_boot_done).
// Contournement immédiat sous prefers-reduced-motion ou via clic / touche Escape.
// Émet 'boot-complete' dès la fin de l'animation pour orchestrer le hero terminal.

const emit = defineEmits<{
  (e: "boot-complete"): void;
}>();

const isDismissed = ref(false);
const isDone = ref(false);
const currentStepText = ref("");
const currentStepOk = ref(false);
const progressPercent = ref(0);

const bootSteps = [
  { text: "initialisation du noyau…", ok: false },
  { text: "montage de /dev/portfolio", ok: false },
  { text: "chargement des polices Ubuntu Mono", ok: false },
  { text: "compilation des projets", ok: true },
  { text: "démarrage du serveur", ok: true },
];

let stepTimeoutId: ReturnType<typeof setTimeout> | null = null;
let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null;

function finishBoot() {
  if (isDone.value) return;
  isDone.value = true;
  progressPercent.value = 100;

  if (stepTimeoutId !== null) {
    clearTimeout(stepTimeoutId);
    stepTimeoutId = null;
  }

  if (import.meta.client) {
    try {
      sessionStorage.setItem("jouan_boot_done", "1");
    } catch {
      // Ignore sessionStorage exceptions (private browsing / quota)
    }
  }

  emit("boot-complete");

  dismissTimeoutId = setTimeout(() => {
    isDismissed.value = true;
  }, 350);
}

function runBoot() {
  let stepIndex = 0;

  function next() {
    if (stepIndex >= bootSteps.length) {
      stepTimeoutId = setTimeout(finishBoot, 180);
      return;
    }

    const step = bootSteps[stepIndex];
    if (step) {
      currentStepText.value = step.text;
      currentStepOk.value = step.ok;
      progressPercent.value = Math.round(((stepIndex + 1) / bootSteps.length) * 100);
    }
    stepIndex++;
    stepTimeoutId = setTimeout(next, 170);
  }

  next();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && !isDone.value) {
    finishBoot();
  }
}

onMounted(() => {
  if (!import.meta.client) return;

  window.addEventListener("keydown", handleKeydown);

  // Vérifier si la session a déjà vu le boot
  let alreadyBooted = false;
  try {
    alreadyBooted = sessionStorage.getItem("jouan_boot_done") === "1";
  } catch {
    alreadyBooted = false;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (alreadyBooted || reduceMotion) {
    try {
      sessionStorage.setItem("jouan_boot_done", "1");
    } catch {
      // Ignore sessionStorage exceptions
    }
    isDone.value = true;
    isDismissed.value = true;
    emit("boot-complete");
    return;
  }

  runBoot();
});

onUnmounted(() => {
  if (!import.meta.client) return;
  window.removeEventListener("keydown", handleKeydown);
  if (stepTimeoutId !== null) {
    clearTimeout(stepTimeoutId);
    stepTimeoutId = null;
  }
  if (dismissTimeoutId !== null) {
    clearTimeout(dismissTimeoutId);
    dismissTimeoutId = null;
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.boot {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--surface-0);
  transition:
    opacity var(--dur-slow) var(--ease-out),
    visibility var(--dur-slow);

  &.boot--done {
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
  }
}

.boot__in {
  width: min(560px, 88vw);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}

.boot__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  color: var(--text-strong);

  b {
    font-size: var(--fs-lg);
  }
}

.boot__logo-icon {
  font-size: 26px;
  color: var(--accent);
}

.boot__line {
  min-height: 1.6em;
  color: var(--text-muted);
}

.boot__ok {
  color: var(--term-green);
}

.boot__bar {
  height: 3px;
  margin-top: var(--space-5);
  overflow: hidden;
  background: var(--surface-3);
  border-radius: var(--radius-xs);

  i {
    display: block;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
    transition: width 0.1s linear;
  }
}

.boot__skip {
  display: inline-block;
  margin-top: var(--space-4);
  padding: 0;
  font-family: inherit;
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wide);
  color: var(--text-faint);
  cursor: pointer;
  background: none;
  border: none;

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .boot {
    display: none;
  }
}
</style>

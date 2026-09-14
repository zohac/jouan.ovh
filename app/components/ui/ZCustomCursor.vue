<template>
  <div v-if="isEnabled" aria-hidden="true">
    <div
      class="cursor-ring"
      :class="{ 'is-hot': isHot, 'is-visible': isVisible }"
      :style="{ transform: `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)` }"
    />
    <div
      class="cursor-dot"
      :class="{ 'is-visible': isVisible }"
      :style="{ transform: `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)` }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Micro-curseur interactif progressif (Story 11.1 / AC-4 / CAP-10).
// Purement décoratif (aria-hidden="true").
// Masqué sur mobile/tactile (hover: none) et prefers-reduced-motion.
// N'altère pas le curseur natif système et supporte le SSR sans effet de bord.

const isEnabled = ref(false);
const isVisible = ref(false);
const isHot = ref(false);

const dotX = ref(0);
const dotY = ref(0);
const ringX = ref(0);
const ringY = ref(0);

let mouseX = 0;
let mouseY = 0;
let currentRingX = 0;
let currentRingY = 0;
let rafId: number | null = null;
let hoverMediaQuery: MediaQueryList | null = null;
let motionMediaQuery: MediaQueryList | null = null;
let listenersAttached = false;

function updateAnimationLoop() {
  const dx = mouseX - currentRingX;
  const dy = mouseY - currentRingY;
  currentRingX += dx * 0.18;
  currentRingY += dy * 0.18;
  ringX.value = currentRingX;
  ringY.value = currentRingY;

  if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
    rafId = requestAnimationFrame(updateAnimationLoop);
  } else {
    rafId = null;
  }
}

function startAnimationLoop() {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateAnimationLoop);
  }
}

function handlePointerMove(e: PointerEvent) {
  if (!isVisible.value) {
    isVisible.value = true;
    currentRingX = e.clientX;
    currentRingY = e.clientY;
    ringX.value = e.clientX;
    ringY.value = e.clientY;
  }
  mouseX = e.clientX;
  mouseY = e.clientY;
  dotX.value = e.clientX;
  dotY.value = e.clientY;
  startAnimationLoop();
}

function handlePointerOver(e: Event) {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  const isInteractive = target.closest("a, button, [data-hot], input, textarea, select, [role='button']");
  isHot.value = Boolean(isInteractive);
}

function handlePointerLeave() {
  isVisible.value = false;
  isHot.value = false;
}

function attachListeners() {
  if (listenersAttached || !import.meta.client) return;
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("pointerover", handlePointerOver, { passive: true });
  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  listenersAttached = true;
}

function detachListeners() {
  if (!listenersAttached || !import.meta.client) return;
  window.removeEventListener("pointermove", handlePointerMove);
  document.removeEventListener("pointerover", handlePointerOver);
  document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
  listenersAttached = false;
}

function updateCursorState() {
  const hasHover = hoverMediaQuery?.matches ?? false;
  const isReduced = motionMediaQuery?.matches ?? false;

  if (hasHover && !isReduced) {
    isEnabled.value = true;
    attachListeners();
  } else {
    isEnabled.value = false;
    isVisible.value = false;
    isHot.value = false;
    detachListeners();
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
}

function handleMediaQueryChange() {
  updateCursorState();
}

onMounted(() => {
  if (!import.meta.client) return;

  hoverMediaQuery = window.matchMedia("(hover: hover)");
  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  hoverMediaQuery.addEventListener("change", handleMediaQueryChange);
  motionMediaQuery.addEventListener("change", handleMediaQueryChange);

  updateCursorState();
});

onUnmounted(() => {
  if (!import.meta.client) return;
  detachListeners();
  hoverMediaQuery?.removeEventListener("change", handleMediaQueryChange);
  motionMediaQuery?.removeEventListener("change", handleMediaQueryChange);
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  border-radius: var(--radius-circle);
  mix-blend-mode: difference;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-standard);

  &.is-visible {
    opacity: 1;
  }
}

.cursor-dot {
  width: 6px;
  height: 6px;
  background: var(--ink-1);
}

.cursor-ring {
  width: 34px;
  height: 34px;
  border: 1px solid color-mix(in srgb, var(--ink-1) 70%, transparent);
  transition:
    width var(--dur-base) var(--ease-out),
    height var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-standard);

  &.is-hot {
    width: 56px;
    height: 56px;
    border-color: var(--accent);
  }
}

@media (hover: none), (prefers-reduced-motion: reduce) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}
</style>

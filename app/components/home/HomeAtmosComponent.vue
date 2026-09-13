<template>
  <div class="atmos" aria-hidden="true">
    <div class="aurora aurora--auberg" />
    <div class="aurora aurora--orange" />
    <div class="aurora aurora--red" />
    <div class="grid-dots" />
    <div class="scanlines" />
    <div class="vignette" />
  </div>
</template>

<script setup lang="ts">
// Composant atmosphérique décoratif pour la page d'accueil (Story 11.1 / CAP-1).
// Entièrement rendu en pur CSS, marqué aria-hidden="true", animations neutralisées sous prefers-reduced-motion.
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.atmos {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.aurora {
  position: absolute;
  border-radius: var(--radius-circle);
  filter: blur(80px);
  mix-blend-mode: screen;
  will-change: transform;
}

.aurora--orange {
  top: -22%;
  left: 48%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle at center, var(--orange-500), transparent 62%);
  opacity: 0.55;
  animation: drift-orange 26s var(--ease-in-out) infinite;
}

.aurora--auberg {
  top: 6%;
  left: -22%;
  width: 64vw;
  height: 64vw;
  background: radial-gradient(circle at center, var(--aubergine-vivid), transparent 62%);
  opacity: 0.7;
  animation: drift-auberg 32s var(--ease-in-out) infinite;
}

.aurora--red {
  top: 44%;
  left: 26%;
  width: 44vw;
  height: 44vw;
  background: radial-gradient(circle at center, var(--term-red), transparent 64%);
  opacity: 0.4;
  animation: drift-red 30s var(--ease-in-out) infinite;
}

.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(color-mix(in srgb, var(--ink-1) 6%, transparent) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, var(--surface-0) 30%, transparent 78%);
}

.scanlines {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background: repeating-linear-gradient(
    0deg,
    color-mix(in srgb, var(--surface-0) 24%, transparent) 0 1px,
    transparent 1px 3px
  );
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, var(--surface-0) 100%);
}

@keyframes drift-orange {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-6vw, 5vh) scale(1.12);
  }
}

@keyframes drift-auberg {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(7vw, -4vh) scale(1.08);
  }
}

@keyframes drift-red {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-4vw, -6vh) scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora {
    animation: none;
  }
}
</style>

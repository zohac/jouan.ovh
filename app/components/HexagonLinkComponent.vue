<template>
  <a class="hex" :href="link" target="_blank" rel="noopener noreferrer">
    <slot name="icon" />
    <span class="hex__label"><slot name="title" /></span>
  </a>
</template>

<script setup lang="ts">
// Lien social en hexagone — motif patrimonial du footer/contact, restylé DS (story 2.8).
// Hexagone via clip-path (cf. kit.css .hex) ; glyphe en currentColor (ZIcon, story 2.7).
defineProps<{
  /** URL externe (réseau social). */
  link: string;
}>();
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element) */
.hex {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 53px;
  font-size: 20px; // dimensionne le glyphe ZIcon (1em)
  color: var(--text-muted);
  cursor: pointer;
  background: var(--surface-2);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  transition:
    color var(--dur-base) var(--ease-standard),
    background var(--dur-base) var(--ease-standard);

  &:hover {
    color: var(--ink-on-accent);
    background: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

// Libellé accessible (lecteurs d'écran) — masqué visuellement.
.hex__label {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  .hex {
    transition: none;
  }
}
</style>

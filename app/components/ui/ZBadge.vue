<template>
  <span class="zbadge" :class="`zbadge--${tone}`">
    <span v-if="dot" class="zbadge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup lang="ts">
// Primitive badge du DS — petit libellé de statut / catégorie (palette terminale/sémantique).
// Porté de docs/design_system/components/core/Badge.jsx (CSS en <style scoped>, prerender-safe).

interface Props {
  /** Teinte. @default "neutral" */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  /** Point de statut en tête. @default false */
  dot?: boolean;
}

withDefaults(defineProps<Props>(), {
  tone: "neutral",
  dot: false,
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Badge.jsx */
.zbadge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: 22px;
  padding: 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-medium);
  line-height: 1;
  letter-spacing: var(--ls-wide);
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
}

.zbadge__dot {
  width: 6px;
  height: 6px;
  background: currentcolor;
  border-radius: var(--radius-circle);
}

// Tones — fills doux. Les couleurs de bordure sont des teintes DS dédiées (sans token
// équivalent) : valeurs portées telles quelles de Badge.jsx (tolérées par la story).
.zbadge--neutral {
  background: var(--surface-3);
  color: var(--text-body);
  border-color: var(--border-default);
}

.zbadge--accent {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: hsl(24deg 94% 53% / 30%);
}

.zbadge--success {
  background: var(--success-soft);
  color: var(--success);
  border-color: hsl(143deg 50% 32% / 50%);
}

.zbadge--warning {
  background: var(--warning-soft);
  color: var(--warning);
  border-color: hsl(38deg 70% 32% / 50%);
}

.zbadge--danger {
  background: var(--danger-soft);
  color: var(--danger);
  border-color: hsl(0deg 55% 35% / 50%);
}

.zbadge--info {
  background: var(--info-soft);
  color: var(--info);
  border-color: hsl(204deg 55% 32% / 50%);
}
</style>

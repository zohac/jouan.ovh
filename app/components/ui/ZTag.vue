<template>
  <span v-bind="rootAttrs" class="ztag" :class="{ 'ztag--plain': !hash, 'ztag--clickable': isClickable }">
    <slot />
    <button v-if="isRemovable" type="button" class="ztag__remove" aria-label="Retirer" @click.stop="handleRemove">
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
// Primitive tag du DS — chip pill mono avec préfixe "#" orange (techno / sujets).
// Porté de docs/design_system/components/core/Tag.jsx (CSS en <style scoped>, prerender-safe).
// API React → Vue : `onRemove`/`onClick` (callbacks React) deviennent des listeners
// détectés via les attrs (le `×` et l'état cliquable n'apparaissent que si fournis).
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Affiche le préfixe "#". @default true */
  hash?: boolean;
}

withDefaults(defineProps<Props>(), {
  hash: true,
});

const attrs = useAttrs();

const isClickable = computed(() => attrs.onClick != null);
const isRemovable = computed(() => attrs.onRemove != null);

// `onRemove` n'est pas un événement DOM natif : on le retire de la racine et on
// l'invoque manuellement depuis le bouton ×. Le reste des attrs (dont onClick) est hérité.
const rootAttrs = computed(() => {
  const { onRemove: _onRemove, ...rest } = attrs;
  return rest;
});

function handleRemove(event: MouseEvent) {
  const handler = attrs.onRemove;
  if (Array.isArray(handler)) {
    handler.forEach((fn) => typeof fn === "function" && fn(event));
  } else if (typeof handler === "function") {
    handler(event);
  }
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Tag.jsx */
.ztag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-sizing: border-box;
  height: 26px;
  padding: 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: 1;
  white-space: nowrap;
  color: var(--text-body);
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);

  &::before {
    content: "#";
    color: var(--accent);
  }
}

.ztag--plain::before {
  content: "";
}

.ztag--clickable {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }
}

.ztag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: -2px;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  background: none;
  border: none;
  border-radius: var(--radius-circle);

  &:hover {
    color: var(--term-red);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ring-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ztag {
    transition: none;
  }
}
</style>

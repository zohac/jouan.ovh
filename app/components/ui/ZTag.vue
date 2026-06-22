<template>
  <span
    v-bind="rootAttrs"
    class="ztag"
    :class="{ 'ztag--plain': !hash, 'ztag--clickable': isClickable }"
    :role="clickableRole"
    :tabindex="clickableTabindex"
    @click="handleClick"
    @keydown.enter="handleKeyboardClick"
    @keydown.space="handleKeyboardClick"
  >
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
import { computed, getCurrentInstance, useAttrs } from "vue";

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

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent];
  remove: [event: MouseEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

function hasListener(name: "onClick" | "onRemove") {
  const listener = instance?.vnode.props?.[name];
  return typeof listener === "function" || Array.isArray(listener);
}

const isClickable = computed(() => hasListener("onClick"));
const isRemovable = computed(() => hasListener("onRemove"));

const rootAttrs = computed(() => {
  if (!isClickable.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "role" && key !== "tabindex" && key !== "tabIndex";
    }),
  );
});

const clickableRole = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  return typeof attrs.role === "string" ? attrs.role : "button";
});

const clickableTabindex = computed(() => {
  if (!isClickable.value) {
    return undefined;
  }

  const tabindex = attrs.tabindex ?? attrs.tabIndex;
  return typeof tabindex === "string" || typeof tabindex === "number" ? tabindex : 0;
});

function handleClick(event: MouseEvent) {
  if (!isClickable.value) {
    return;
  }

  emit("click", event);
}

function handleKeyboardClick(event: KeyboardEvent) {
  if (!isClickable.value) {
    return;
  }

  event.preventDefault();
  emit("click", event);
}

function handleRemove(event: MouseEvent) {
  emit("remove", event);
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
  display: none;
  content: none;
}

.ztag--clickable {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    color: var(--text-strong);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ring-accent);
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

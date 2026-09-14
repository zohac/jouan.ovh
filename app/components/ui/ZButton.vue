<template>
  <component
    :is="as"
    ref="buttonEl"
    v-bind="passthroughAttrs"
    class="zbtn"
    :class="[`zbtn--${variant}`, `zbtn--${size}`, { 'zbtn--magnetic': magnetic }]"
    :type="buttonType"
    :disabled="isNativeButton ? disabled || undefined : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    :tabindex="isDisabledNonNative ? -1 : undefined"
    @click="blockDisabledActivation"
    @keydown.enter="blockDisabledActivation"
    @keydown.space="blockDisabledActivation"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <span ref="innerEl" class="zbtn__inner">
      <span v-if="icon || $slots.icon" class="zbtn__icon">
        <component :is="icon" v-if="icon" aria-hidden="true" />
        <slot v-else name="icon" />
      </span>
      <slot />
      <span v-if="iconRight || $slots.iconRight" class="zbtn__icon">
        <component :is="iconRight" v-if="iconRight" aria-hidden="true" />
        <slot v-else name="iconRight" />
      </span>
    </span>
  </component>
</template>

<script setup lang="ts">
// Primitive bouton du DS — label mono, dimensions généreuses, micro-effet magnétique.
// Porté de docs/design_system/components/core/Button.jsx et Home - Awwwards.html.
import type { Component, ComponentPublicInstance } from "vue";
import { computed, onMounted, ref, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

type IconProp = string | Component;

interface Props {
  /** Style visuel. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "terminal" | "danger";
  /** @default "md" — hauteurs 32 / 40 / 48 */
  size?: "sm" | "md" | "lg";
  /** Icône leading via composant Vue ou nom de composant. */
  icon?: IconProp;
  /** Icône trailing via composant Vue ou nom de composant. */
  iconRight?: IconProp;
  /** Élément rendu (polymorphe), ex. "a" pour un lien. @default "button" */
  as?: string | Component;
  /** Désactivé : natif sur <button>, aria-disabled + pointer-events sur les autres tags. */
  disabled?: boolean;
  /** Activer le micro-effet magnétique au curseur. @default true */
  magnetic?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: undefined,
  iconRight: undefined,
  as: "button",
  disabled: false,
  magnetic: true,
});

const attrs = useAttrs();
const buttonEl = ref<Element | ComponentPublicInstance | null>(null);
const innerEl = ref<HTMLElement | null>(null);
const isReducedMotion = ref(false);

onMounted(() => {
  isReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});

function onMouseMove(event: MouseEvent) {
  if (!props.magnetic || isReducedMotion.value || !buttonEl.value || props.disabled) {
    return;
  }
  const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  el.style.transform = `translate(${x * 0.16}px, ${y * 0.18}px)`;
  if (innerEl.value) {
    innerEl.value.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
  }
}

function onMouseLeave() {
  if (buttonEl.value) {
    const el = ((buttonEl.value as ComponentPublicInstance).$el ?? buttonEl.value) as HTMLElement | null;
    if (el instanceof HTMLElement) {
      el.style.transform = "";
    }
  }
  if (innerEl.value) {
    innerEl.value.style.transform = "";
  }
}

// `as` accepte une balise native ("button", "a") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const isDisabledNonNative = computed(() => !isNativeButton.value && props.disabled);
const buttonType = computed(() => {
  if (!isNativeButton.value) {
    return undefined;
  }

  return typeof attrs.type === "string" ? attrs.type : "button";
});

const passthroughAttrs = computed(() => {
  if (!isDisabledNonNative.value) {
    return attrs;
  }

  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => {
      return key !== "href" && key !== "tabindex" && key !== "tabIndex" && !/^on[A-Z]/.test(key);
    }),
  );
});

function blockDisabledActivation(event: Event) {
  if (!isDisabledNonNative.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if ("stopImmediatePropagation" in event) {
    event.stopImmediatePropagation();
  }
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS portée depuis Button.jsx */
.zbtn {
  --_h: 42px;
  --_px: var(--space-5);
  --_fs: var(--fs-sm);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--_h);
  padding: 0 var(--_px);
  font-family: var(--font-mono);
  font-size: var(--_fs);
  font-weight: var(--fw-medium);
  line-height: 1;
  letter-spacing: var(--ls-wide);
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }

  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.zbtn__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: transform var(--dur-fast) var(--ease-standard);
  will-change: transform;
}

.zbtn__icon {
  display: inline-flex;
  width: 1.1em;
  height: 1.1em;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

// ---- Tailles ----
.zbtn--sm {
  --_h: 32px;
  --_px: var(--space-3);
  --_fs: var(--fs-xs);
}

.zbtn--lg {
  --_h: 48px;
  --_px: var(--space-6);
  --_fs: var(--fs-sm);
}

// ---- Variantes ----
.zbtn--primary {
  background: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent);
  box-shadow: var(--glow-accent);

  &:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
    box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 45%, transparent);
    transform: translateY(-1px);
  }

  &:active {
    background: var(--accent-active);
    border-color: var(--accent-active);
    transform: translateY(0);
  }
}

.zbtn--secondary {
  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
  color: var(--text-strong);
  border-color: var(--border-default);
  backdrop-filter: blur(6px);

  &:hover {
    background: var(--surface-3);
    border-color: var(--border-strong);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.zbtn--ghost {
  background: transparent;
  color: var(--text-body);
  border-color: transparent;

  &:hover {
    background: var(--surface-2);
    color: var(--text-strong);
    transform: translateY(-1px);
  }
}

.zbtn--terminal {
  background: var(--bg-terminal);
  color: var(--term-green);
  border-color: color-mix(in srgb, var(--term-green) 35%, var(--accent-2-soft));
  box-shadow: 0 0 10px color-mix(in srgb, var(--term-green) 18%, transparent);

  &:hover {
    border-color: var(--term-green);
    box-shadow:
      0 0 18px color-mix(in srgb, var(--term-green) 45%, transparent),
      var(--glow-terminal);
    transform: translateY(-1px);
  }
}

.zbtn--danger {
  background: var(--danger);
  color: var(--ink-on-accent);
  border-color: var(--danger);

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .zbtn,
  .zbtn__inner {
    transition: none;
    transform: none !important;
  }
}
</style>

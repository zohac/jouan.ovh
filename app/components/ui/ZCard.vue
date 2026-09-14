<template>
  <component
    :is="as"
    ref="cardRef"
    v-bind="rootAttrs"
    class="zcard"
    :class="{
      'zcard--pad': padded,
      'zcard--interactive': interactive,
      'zcard--accent': accent,
      'zcard--featured': featured,
      'zcard--tilt': tilt,
    }"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Primitive carte du DS — surface discrète, 3D tilt interactif optionnel.
// Porté de docs/design_system/components/core/Card.jsx et Home - Awwwards.html.
import type { Component, ComponentPublicInstance } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Rendre la carte interactive (hover state, clickable). @default false */
  interactive?: boolean;
  /** Filet supérieur dégradé accent (story 2.4). @default false */
  accent?: boolean;
  /** Variante mise en valeur (bordure accent, glow). @default false */
  featured?: boolean;
  /** Padding interne (var(--space-6)). Désactivable pour cartes média. @default true */
  padded?: boolean;
  /** Élément rendu (polymorphe). @default "div" */
  as?: string | Component;
  /** Activer l'effet 3D tilt sur mousemove. @default false */
  tilt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  accent: false,
  featured: false,
  padded: true,
  as: "div",
  tilt: false,
});

const attrs = useAttrs();
const cardRef = ref<Element | ComponentPublicInstance | null>(null);
const isReducedMotion = ref(false);
let motionMq: MediaQueryList | null = null;

function onMotionChange(e: MediaQueryListEvent) {
  isReducedMotion.value = e.matches;
  if (e.matches) {
    onMouseLeave();
  }
}

onMounted(() => {
  motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  isReducedMotion.value = motionMq.matches;
  motionMq.addEventListener("change", onMotionChange);
});

onBeforeUnmount(() => {
  motionMq?.removeEventListener("change", onMotionChange);
});

function onMouseMove(event: MouseEvent) {
  if (!props.tilt || isReducedMotion.value || !cardRef.value) {
    return;
  }
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return;
  }
  const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.transform = `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
}

function onMouseLeave() {
  if (cardRef.value) {
    const el = ((cardRef.value as ComponentPublicInstance).$el ?? cardRef.value) as HTMLElement | null;
    if (el instanceof HTMLElement) {
      el.style.transform = "";
    }
  }
}

watch(
  () => props.tilt,
  (newVal) => {
    if (!newVal) {
      onMouseLeave();
    }
  },
);

// `as` accepte une balise native ("div", "article") ou une référence de composant
// (ex. NuxtLink importé de "#components") ; ne pas passer un nom de composant en chaîne.
const isNativeButton = computed(() => props.as === "button");
const rootAttrs = computed(() => {
  if (!isNativeButton.value) {
    return attrs;
  }

  return {
    ...attrs,
    type: typeof attrs.type === "string" ? attrs.type : "button",
  };
});
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block--modifier) portée depuis Card.jsx */
.zcard {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  color: var(--text-body);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2), var(--shadow-hairline);
  transition:
    border-color var(--dur-base) var(--ease-standard),
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-standard);
}

.zcard--tilt {
  transform-style: preserve-3d;
  will-change: transform;
}

.zcard--pad {
  padding: var(--space-6);
}

.zcard--interactive {
  cursor: pointer;

  &:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
    box-shadow: var(--shadow-3), var(--shadow-hairline);
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }
}

.zcard--accent::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--aubergine-light));
}

.zcard--featured {
  border-color: var(--accent-ring);
  box-shadow: var(--glow-accent), var(--shadow-hairline);
}

@media (prefers-reduced-motion: reduce) {
  .zcard {
    transition: none;
    transform: none !important;
  }

  .zcard--interactive:hover {
    transform: none;
  }
}
</style>

<template>
  <span class="zavatar" :class="[`zavatar--${safeSize}`, { 'zavatar--ring': ring }]">
    <NuxtImg v-if="showImage" class="zavatar__img" :src="src" :alt="alt" @error="onImageError" />
    <template v-else>{{ fallbackInitials }}</template>
  </span>
</template>

<script setup lang="ts">
// Primitive avatar du DS — image ou initiales, anneau accent optionnel.
// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>
// (jamais <img> brut — règle images projet). CSS en <style scoped>, prerender-safe.
import { computed, ref, watch } from "vue";

const avatarSizes = ["sm", "md", "lg", "xl"] as const;

type AvatarSize = (typeof avatarSizes)[number];

interface Props {
  /** URL de l'image. Repli sur les initiales si absent. */
  src?: string;
  /** Texte alternatif de l'image. @default "" */
  alt?: string;
  /** Initiales affichées sans image. */
  initials?: string;
  /** @default "md" — tailles 32 / 44 / 64 / 96 */
  size?: AvatarSize;
  /** Anneau accent orange. @default false */
  ring?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  alt: "",
  initials: undefined,
  size: "md",
  ring: false,
});

const imageFailed = ref(false);
const safeSize = computed(() => {
  return avatarSizes.includes(props.size) ? props.size : "md";
});
const fallbackInitials = computed(() => props.initials || "?");
const showImage = computed(() => Boolean(props.src) && !imageFailed.value);

watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  },
);

function onImageError() {
  imageFailed.value = true;
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern, custom-property-pattern -- convention DS BEM + variable privée --_sz portée depuis Avatar.jsx */
.zavatar {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--_sz);
  height: var(--_sz);
  overflow: hidden;
  font-family: var(--font-mono);
  font-weight: var(--fw-bold);
  font-size: calc(var(--_sz) * 0.4);
  color: var(--text-strong);
  background: var(--surface-3);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-circle);
}

.zavatar__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zavatar--ring {
  // Double anneau : gap couleur page puis anneau accent (repris d'Avatar.jsx).
  box-shadow:
    0 0 0 2px var(--bg-page),
    0 0 0 4px var(--accent);
}

.zavatar--sm {
  --_sz: 32px;
}

.zavatar--md {
  --_sz: 44px;
}

.zavatar--lg {
  --_sz: 64px;
}

.zavatar--xl {
  --_sz: 96px;
}
</style>

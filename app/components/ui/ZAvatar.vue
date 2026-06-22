<template>
  <span class="zavatar" :class="[`zavatar--${size}`, { 'zavatar--ring': ring }]">
    <NuxtImg v-if="src" class="zavatar__img" :src="src" :alt="alt" />
    <template v-else>{{ initials || "?" }}</template>
  </span>
</template>

<script setup lang="ts">
// Primitive avatar du DS — image ou initiales, anneau accent optionnel.
// Porté de docs/design_system/components/core/Avatar.jsx. Image via <NuxtImg>
// (jamais <img> brut — règle images projet). CSS en <style scoped>, prerender-safe.

interface Props {
  /** URL de l'image. Repli sur les initiales si absent. */
  src?: string;
  /** Texte alternatif de l'image. @default "" */
  alt?: string;
  /** Initiales affichées sans image. */
  initials?: string;
  /** @default "md" — tailles 32 / 44 / 64 / 96 */
  size?: "sm" | "md" | "lg" | "xl";
  /** Anneau accent orange. @default false */
  ring?: boolean;
}

withDefaults(defineProps<Props>(), {
  src: undefined,
  alt: "",
  initials: undefined,
  size: "md",
  ring: false,
});
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

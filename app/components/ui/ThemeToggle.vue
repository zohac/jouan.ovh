<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="ariaLabel"
    title="Changer de thème (Système / Sombre / Clair)"
    @click="handleToggle"
  >
    <ZIcon :name="currentIcon" class="theme-toggle__icon" />
    <span class="screen-reader-text" aria-live="polite">{{ liveAnnouncement }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "~/composables/useTheme";

const { preference, resolvedTheme, cycleTheme } = useTheme();
const liveAnnouncement = ref("");

const currentIcon = computed(() => {
  if (preference.value === "system") {
    return "monitor";
  }
  if (preference.value === "dark") {
    return "moon";
  }
  return "sun";
});

const ariaLabel = computed(() => {
  if (preference.value === "system") {
    const activeResolved = resolvedTheme.value === "dark" ? "Sombre" : "Clair";
    return `Thème : Système (${activeResolved} actif). Cliquer pour forcer le mode Sombre.`;
  }
  if (preference.value === "dark") {
    return "Thème : Sombre forcé. Cliquer pour forcer le mode Clair.";
  }
  return "Thème : Clair forcé. Cliquer pour revenir au mode Système.";
});

const handleToggle = () => {
  cycleTheme();
  const labels: Record<string, string> = {
    system: "Système",
    dark: "Sombre",
    light: "Clair",
  };
  liveAnnouncement.value = `Mode ${labels[preference.value] || "Système"} activé.`;
};
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern -- convention BEM */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--text-muted);
  cursor: pointer;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition:
    background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);

  @media (hover: hover) {
    &:hover {
      color: var(--text-strong);
      background: var(--surface-2);
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }
  }

  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: var(--ring-accent);
  }

  &__icon {
    font-size: 18px;
    transition: transform var(--dur-base) var(--ease-out);
  }

  &:active .theme-toggle__icon {
    transform: rotate(45deg);
  }
}

@media (width <= 900px) {
  .theme-toggle {
    width: 40px;
    height: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle__icon {
    transition: none !important;
    transform: none !important;
  }
}
</style>

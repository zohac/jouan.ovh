<template>
  <section class="content">
    <slot name="title" />
    <slot name="body" />
  </section>
</template>

<script>
export default {
  name: "ZCardBody",
};
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/animations";

section {
  // Tokens DS (dark-first) : le titre était en gris foncé (fond clair legacy),
  // illisible sur le fond sombre --bg-card de ZCard → encre claire --text-strong.
  padding: var(--space-4);
  color: var(--text-body);

  :slotted(h1) {
    color: var(--text-strong);
    margin: 0;
  }

  &.content {
    animation: fadeIn var(--dur-slower) var(--ease-out) forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  section.content {
    animation: none;
  }
}
</style>

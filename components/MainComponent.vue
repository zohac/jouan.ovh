<template>
  <main>
    <slot />
  </main>
</template>

<script lang="ts">
export default {
  name: "MainComponent",
}
</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space";

  main {
    --main-space-inset: #{space.$space-inset-16x};

    padding: var(--main-space-inset);
    max-width: 100vw;
  }
</style>

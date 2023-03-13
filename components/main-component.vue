<template>
  <main>
    <article-component />
  </main>
</template>

<script>
export default {
  name: "MainComponent"
}
</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space";

  main {
    --main-space-inset: #{space.$space-inset-16x};

    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    gap: 0 0;
    grid-template-areas:
      ".";
    align-items: center;
    justify-items: center;

    padding: var(--main-space-inset);
  }
</style>

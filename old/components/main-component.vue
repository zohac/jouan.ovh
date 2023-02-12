<template>
  <main>

    <article-component />

    <terminal-component />

  </main>
</template>

<script>
export default {
  name: "MainComponent"
}
</script>

<style lang="scss" scoped>
  main {
    display: flex;
    flex: 1;
    flex-direction: row;
    padding: 1.25rem;
    width: calc(100% - (2 * 1.25rem));
  }
</style>

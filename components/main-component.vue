<template>
  <main>

    <article-component />

    <aside-component />

  </main>
</template>

<script>
export default {
  name: "main-component"
}
</script>

<style scoped>
  main {
    display: flex;
    flex-direction: row;

    width: 100vw;
    margin: auto 0;
  }

  main > article,
  main > aside {
    flex-grow: 1;

    max-width: 50vw;
    height: auto;
    margin: auto 1.25rem;
  }
</style>

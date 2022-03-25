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
    flex-direction: row;

    width: 100vw;
    margin: auto 0;

    > article,
    > aside {
      flex-grow: 1;

      max-width: 100vw;
      height: auto;
      margin: auto 1.25rem;

      @media only screen and (min-width: $laptop) {
        max-width: 50vw;
      }
    }
  }
</style>

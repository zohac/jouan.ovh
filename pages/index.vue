<template>

  <div class="init" role="img" title="">
    <header-component />

    <main-component />

    <footer-component />
  </div>

</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'IndexPage'
})
</script>


<style lang="scss" scoped>
  .init {
    background-image:
      linear-gradient(127deg, var(--color-aubergine-dark), transparent),
      linear-gradient(217deg, var(--color-orange), transparent),
      linear-gradient(0deg, var(--color-red), transparent);
    margin: 0;
    min-height: 100vh;
    overflow: auto;
    width: 100vw;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: var(--header-height) 1fr var(--footer-height);
    gap: 0 0;
    grid-template-areas:
    "."
    "."
    ".";
    justify-content: center;
  }
</style>
